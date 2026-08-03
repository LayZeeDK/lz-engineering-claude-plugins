#!/usr/bin/env node
// selfcheck-routing.mjs -- the offline, ZERO-SPEND crux battery for the D-08 PLACEMENT arms. It
// proves the three-arm placement instrument composes and measures the thing it claims to measure
// BEFORE any metered claude -p run (the build-then-halt boundary, D-14). It NEVER calls claude: every
// step is a --dry-run compose, a filesystem walk over tracked or generated files, or a pure assertion.
//
// Six cruxes:
//   1. ARM COMPOSITION   -- `--arm placement` composes variant_a, variant_b and variant_c; the three
//      --plugin-dir values are DISTINCT; variant_a resolves to the shipped plugin dir (the tracked
//      tree IS variant A, D-24); the other two equal run-e2e.mjs's exported VARIANT_B_DIR /
//      VARIANT_C_DIR by IDENTITY rather than by a recomputed path; those two consts in turn equal the
//      builder's hardcoded destinations (the KEEP-THE-TWO-IN-SYNC pair -- if they drift, an arm loads
//      a stale or absent tree and degrades into a second variant_a, which is the failure mode that
//      looks healthiest); every argv blocks the file-editing and command-running tools, since
//      recommend mode must yield coaching prose rather than an applied diff; and each arm's argv is
//      identical to variant_a's OUTSIDE --plugin-dir, so the tree is the only variable.
//   2. PROMPT PARITY     -- for EVERY one of the nine prompts, the -p value is BYTE-IDENTICAL across
//      all three arms and none of them begins with a slash. All three arms are natural prompts by
//      construction, so auto-trigger is a shared constant and the only variable is the tree.
//   3. DESCRIPTION IDENTITY -- per skill, the frontmatter block is byte-identical across all three
//      trees. Re-asserted here INDEPENDENTLY of build-variants.mjs -- its own hash helper is
//      deliberately NOT imported -- because the builder proves this at GENERATION time and this proves
//      it at MEASUREMENT time, and a tree can be regenerated or hand-touched between the two. A
//      description that differs by one byte turns the placement measurement into a triggering
//      measurement (D-11), which is why this is the single most important offline assertion here.
//   4. DELTA DECLARATION -- each generated tree's delta set against the shipped tree equals the
//      builder's DECLARED expectation exactly. The declaration is imported (one source of truth); the
//      measurement is an independent byte-comparing filesystem walk.
//   5. CORPUS DERIVATION -- exactly one prompt file per corpus case, ids equal as sets, and no prompt
//      file without a corresponding case. A divergence between the guard's corpus and the eval's
//      prompts is a silent MEASUREMENT error rather than a cosmetic one, so it gets its own crux.
//   6. GRADER ALIGNMENT  -- every case's expected label is one the grader RECOGNIZES, proven by
//      round-tripping a synthetic answer through grade-routing.mjs's own extractor rather than by
//      matching a second literal, and the one two-hop case's ORDERED pair is representable.
//
// WHY THIS FILE TARGETS ONE NAMED SUITE DIR DIRECTLY, instead of auto-discovering a namespace the way
// selfcheck-red.mjs does: that file discovers e2e-red-* siblings and its crux 2 BANS thirteen
// test-state claim tokens in prompts. The routing corpus must carry test-state facts by design --
// D-03 exists precisely because routing has to IGNORE them -- so a corpus that is CORRECT would
// hard-fail that ban. Naming the suite outside the discovered namespace (D-22) is what keeps both
// invariants true, and copying the prefix filter here would reintroduce the problem the rename solved.
// selfcheck-red.mjs is deliberately left BYTE-UNCHANGED.
//
//   node .claude/skills/lz-red-workspace/selfcheck-routing.mjs
//
// Exit: 0 on success, 1 on a crux failure, 2 on an IO or usage error. Nothing metered runs.

import fs from 'node:fs';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { VARIANT_B_DIR, VARIANT_C_DIR } from '../lz-refactor-workspace/e2e-nx/run-e2e.mjs';
import { VARIANTS, SKILL_NAMES, SKILL_RELS, SOURCE_DIR, variantDest } from './variants/build-variants.mjs';
import { extractDestination, expectedLabelFor, loadCorpus } from './grade-routing.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
// lz-red-workspace -> skills -> .claude -> repo root
const REPO_ROOT = resolve(HERE, '..', '..', '..');
const RUN_E2E = resolve(HERE, '..', 'lz-refactor-workspace', 'e2e-nx', 'run-e2e.mjs');
const ROUTING_SUITE_DIR = join(HERE, 'e2e-rgr-routing');
const PROMPTS_DIR = join(ROUTING_SUITE_DIR, 'prompts');
const CORPUS_PATH = join(HERE, 'tools', 'rgr-cases.json');

// The plugin tree under test. variant_a MUST resolve here (D-24) and the other two MUST NOT, or the
// treatment arms are extra baselines.
const PLUGIN_UNDER_TEST = join(REPO_ROOT, 'plugins', 'lz-tdd');

const PLACEMENT_ARMS = ['variant_a', 'variant_b', 'variant_c'];

// recommend mode must produce coaching prose, never an applied diff.
const BLOCKED_TOOLS = ['Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'Bash'];

function fail(msg) {
  console.error(`selfcheck-routing: FAIL -- ${msg}`);
  process.exit(1);
}

// ---- dry-run helpers (zero spend) --------------------------------------------------------------

// Spawn `node run-e2e.mjs --dry-run ...` from the REPO ROOT, which is the suite's own documented
// invocation directory (suite.json's repo path is relative and resolves against the caller's cwd).
function dryRun(extraArgs) {
  const r = spawnSync(process.execPath, [RUN_E2E, '--dry-run', ...extraArgs], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });

  if (r.status !== 0) {
    fail(`dry-run '${extraArgs.join(' ')}' exited ${r.status}: ${(r.stderr || '').trim()}`);
  }

  return r.stdout || '';
}

// Map arm -> argv by pairing each `--- <mode>/<arm>/<pid> ---` header with the argv line that follows.
function armMap(stdout) {
  const map = {};
  let arm = null;

  for (const line of stdout.split('\n')) {
    const m = /^--- \S+\/(\S+)\/\S+/.exec(line);

    if (m) {
      arm = m[1];

      continue;
    }

    if (arm && line.startsWith('argv: ')) {
      map[arm] = JSON.parse(line.slice('argv: '.length));
      arm = null;
    }
  }

  return map;
}

function flagValue(argv, flag) {
  const i = argv.indexOf(flag);

  return i >= 0 ? argv[i + 1] : undefined;
}

// The values of a repeatable flag: every token after it up to the next `--`-prefixed token.
function flagValues(argv, flag) {
  const i = argv.indexOf(flag);

  if (i < 0) {
    return [];
  }

  const out = [];

  for (let k = i + 1; k < argv.length && !argv[k].startsWith('--'); k++) {
    out.push(argv[k]);
  }

  return out;
}

// Drop --plugin-dir AND its value, so two arms can be compared on everything else.
function withoutPluginDir(argv) {
  const i = argv.indexOf('--plugin-dir');

  return i < 0 ? argv.slice() : [...argv.slice(0, i), ...argv.slice(i + 2)];
}

// Path-form-INSENSITIVE identity. A raw string compare reads a forward-slash spelling of the shipped
// dir as a distinct tree, which is exactly how a hand-typed environment override collapses an arm
// while still looking clean.
function samePath(a, b) {
  const norm = (p) => (process.platform === 'win32' ? resolve(String(p)).toLowerCase() : resolve(String(p)));

  return norm(a) === norm(b);
}

// ---- filesystem helpers ------------------------------------------------------------------------

// relative path -> absolute path, for every file at any depth.
function walkFiles(root) {
  const out = new Map();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      if (entry.isFile()) {
        out.set(relative(root, full), full);
      }
    }
  };

  walk(root);

  return out;
}

// The delta set of `treeRoot` against `sourceRoot`, in the builder's own reporting format. Compares
// BYTES rather than reusing the builder's hash walk, so a defect in that walk cannot make both sides
// agree with each other and disagree with the truth.
function deltaSet(sourceRoot, treeRoot) {
  const src = walkFiles(sourceRoot);
  const tree = walkFiles(treeRoot);
  const deltas = [];

  for (const [rel, full] of tree) {
    if (!src.has(rel)) {
      deltas.push(`added   ${rel}`);
      continue;
    }

    if (!fs.readFileSync(src.get(rel)).equals(fs.readFileSync(full))) {
      deltas.push(`edited  ${rel}`);
    }
  }

  for (const rel of src.keys()) {
    if (!tree.has(rel)) {
      deltas.push(`removed ${rel}`);
    }
  }

  return deltas.sort();
}

function hashOf(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

// The leading YAML frontmatter block, delimiters included. Implemented HERE rather than imported from
// build-variants.mjs on purpose -- see crux 3 in the header. Independent code, independent verdict.
function frontmatterBlock(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

  if (lines[0] !== '---') {
    fail(`[crux 3] ${file}: no leading '---' frontmatter delimiter, so the description cannot be extracted`);
  }

  const closeAt = lines.indexOf('---', 1);

  if (closeAt < 0) {
    fail(`[crux 3] ${file}: frontmatter is never closed by a second '---', so the description cannot be extracted`);
  }

  return lines.slice(0, closeAt + 1).join('\n');
}

function readJson(p, label) {
  let raw;

  try {
    raw = fs.readFileSync(p, 'utf8');
  } catch (err) {
    fail(`cannot read ${label} at ${p}: ${err.message}`);
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    fail(`invalid JSON in ${label} at ${p}: ${err.message}`);
  }
}

// ---- crux 1 + 2: arm composition and prompt parity ---------------------------------------------

function cruxCompositionAndParity(suite) {
  const seenPluginDirs = new Map();

  for (const promptEntry of suite.prompts) {
    const label = `${suite.name}/${promptEntry.id}`;
    const arms = armMap(dryRun(['--suite', ROUTING_SUITE_DIR, '--mode', 'recommend', '--arm', 'placement', '--prompt', promptEntry.id]));

    for (const name of PLACEMENT_ARMS) {
      if (!arms[name]) {
        fail(`[crux 1] ${label}: dry-run did not compose the ${name} arm (got: ${Object.keys(arms).join(', ')})`);
      }
    }

    const dirs = new Map(PLACEMENT_ARMS.map((name) => [name, flagValue(arms[name], '--plugin-dir') || '']));

    for (const [name, dir] of dirs) {
      if (!dir) {
        fail(`[crux 1] ${label}: ${name} composes no --plugin-dir, so it runs without any plugin tree`);
      }

      const blocked = flagValues(arms[name], '--disallowedTools');
      const missing = BLOCKED_TOOLS.filter((t) => !blocked.includes(t));

      if (missing.length) {
        fail(
          `[crux 1] ${label}: ${name} does not block ${JSON.stringify(missing)}; recommend mode must yield coaching ` +
            `prose rather than an applied diff (got ${JSON.stringify(blocked)})`,
        );
      }

      const previous = seenPluginDirs.get(name);

      if (previous !== undefined && previous !== dir) {
        fail(`[crux 1] ${name}: --plugin-dir changed between prompts (${JSON.stringify(previous)} then ${JSON.stringify(dir)})`);
      }

      seenPluginDirs.set(name, dir);
    }

    // Three DISTINCT trees. Two arms resolving to one tree is the silent collapse.
    for (let i = 0; i < PLACEMENT_ARMS.length; i++) {
      for (let j = i + 1; j < PLACEMENT_ARMS.length; j++) {
        const [a, b] = [PLACEMENT_ARMS[i], PLACEMENT_ARMS[j]];

        if (samePath(dirs.get(a), dirs.get(b))) {
          fail(`[crux 1] ${label}: ${a} and ${b} name the SAME --plugin-dir (${JSON.stringify(dirs.get(b))}), so those arms collapse into one`);
        }
      }
    }

    if (!samePath(dirs.get('variant_a'), PLUGIN_UNDER_TEST)) {
      fail(`[crux 1] ${label}: variant_a --plugin-dir is not the shipped plugin dir (D-24): ${JSON.stringify(dirs.get('variant_a'))}`);
    }

    // By IDENTITY against the driver's own exported consts, never against a path recomputed here: a
    // second recomputation would agree with a drifted const and prove nothing.
    if (!samePath(dirs.get('variant_b'), VARIANT_B_DIR)) {
      fail(`[crux 1] ${label}: variant_b --plugin-dir ${JSON.stringify(dirs.get('variant_b'))} is not the driver's VARIANT_B_DIR ${JSON.stringify(VARIANT_B_DIR)}`);
    }

    if (!samePath(dirs.get('variant_c'), VARIANT_C_DIR)) {
      fail(`[crux 1] ${label}: variant_c --plugin-dir ${JSON.stringify(dirs.get('variant_c'))} is not the driver's VARIANT_C_DIR ${JSON.stringify(VARIANT_C_DIR)}`);
    }

    // The tree is the ONLY variable: prompt bytes, model, effort and tool policy must all match.
    const base = JSON.stringify(withoutPluginDir(arms.variant_a));

    for (const name of ['variant_b', 'variant_c']) {
      if (JSON.stringify(withoutPluginDir(arms[name])) !== base) {
        fail(
          `[crux 1] ${label}: ${name} argv differs from variant_a OUTSIDE --plugin-dir (prompt bytes, model, effort ` +
            `or tool policy drifted): ${JSON.stringify(arms[name])}`,
        );
      }
    }

    // crux 2: byte-identical prompts, no forced slash command on any arm.
    const prompts = PLACEMENT_ARMS.map((name) => [name, flagValue(arms[name], '-p') || '']);

    for (const [name, prompt] of prompts) {
      if (prompt === '') {
        fail(`[crux 2] ${label}: ${name} composes an empty -p`);
      }

      if (prompt.startsWith('/')) {
        fail(`[crux 2] ${label}: ${name} -p must be a natural prompt (no leading slash command): ${JSON.stringify(prompt.slice(0, 40))}`);
      }
    }

    for (const [name, prompt] of prompts.slice(1)) {
      if (prompt !== prompts[0][1]) {
        fail(
          `[crux 2] ${label}: variant_a vs ${name} -p differ (must be byte-identical):\n  variant_a=${JSON.stringify(prompts[0][1])}\n  ${name}=${JSON.stringify(prompt)}`,
        );
      }
    }
  }

  // The KEEP-THE-TWO-IN-SYNC pair, asserted rather than trusted: the driver READS these paths and the
  // builder WRITES them. A drift means the arm loads a stale or absent tree, and run-e2e.mjs's own
  // comment names that as the failure mode that looks healthiest.
  for (const variant of VARIANTS) {
    const driverConst = variant.outName.endsWith('variant-b') ? VARIANT_B_DIR : VARIANT_C_DIR;

    if (!samePath(driverConst, variantDest(variant.outName))) {
      fail(
        `[crux 1] ${variant.id}: the driver reads ${JSON.stringify(driverConst)} but the builder writes ` +
          `${JSON.stringify(variantDest(variant.outName))}; the arm would load a stale or absent tree`,
      );
    }
  }

  console.log(`[crux 1] OK -- placement composed 3 arms x ${suite.prompts.length} prompt(s); 3 distinct plugin dirs; variant_a is the shipped tree`);
  console.log(`[crux 1] OK -- variant_b/variant_c match the driver's exported consts; all argv identical outside --plugin-dir; ${BLOCKED_TOOLS.length} tools blocked`);
  console.log('[crux 1] OK -- builder destinations and driver consts are in SYNC for both generated trees');
  console.log(`[crux 2] OK -- all ${suite.prompts.length} prompts BYTE-IDENTICAL across the 3 arms, none forced with a slash command`);
}

// ---- crux 3: description identity across the three trees ---------------------------------------

function cruxDescriptionIdentity(trees) {
  // Anti-vacuity: a hash that cannot tell two blocks apart would make every comparison below pass.
  const probe = '---\nname: probe\n---';

  if (hashOf(probe) === hashOf(`${probe} `)) {
    fail('[crux 3] the frontmatter hash does not discriminate a one-byte difference, so every identity check below is vacuous');
  }

  for (const name of SKILL_NAMES) {
    const hashes = trees.map(([id, root]) => [id, hashOf(frontmatterBlock(join(root, SKILL_RELS[name])))]);
    const distinct = new Set(hashes.map(([, h]) => h));

    if (distinct.size !== 1) {
      fail(
        `[crux 3] ${name}: frontmatter is NOT identical across the three trees, so the A/B would measure triggering ` +
          `rather than placement (D-11):\n  ` + hashes.map(([id, h]) => `${id} ${h}`).join('\n  '),
      );
    }

    console.log(`[crux 3] OK -- ${name} frontmatter identical across all 3 trees (${hashes[0][1].slice(0, 16)})`);
  }
}

// ---- crux 4: the declared delta set ------------------------------------------------------------

function cruxDeltaDeclaration() {
  for (const variant of VARIANTS) {
    const dest = variantDest(variant.outName);

    if (!fs.existsSync(dest)) {
      fail(`[crux 4] ${variant.id}: generated tree missing at ${dest}. Build it first: node variants/build-variants.mjs`);
    }

    const measured = deltaSet(SOURCE_DIR, dest);
    const declared = variant.expectedDeltas.slice().sort();

    if (measured.join('|') !== declared.join('|')) {
      fail(
        `[crux 4] ${variant.id}: measured delta set does not equal the builder's declaration.\n  declared:\n    ` +
          declared.join('\n    ') + '\n  measured:\n    ' + measured.join('\n    '),
      );
    }

    console.log(`[crux 4] OK -- ${variant.id} delta set equals its declaration exactly (${measured.length} path(s))`);
  }
}

// ---- crux 5: the corpus-to-prompt derivation ---------------------------------------------------

function cruxCorpusDerivation(suite, cases) {
  const caseIds = cases.map((c) => c.id);
  const promptIds = suite.prompts.map((p) => p.id);

  if (caseIds.length === 0) {
    fail('[crux 5] the corpus carries no cases, so the derivation check would be vacuous');
  }

  if (new Set(promptIds).size !== promptIds.length) {
    fail(`[crux 5] the suite declares a duplicate prompt id: ${JSON.stringify(promptIds)}`);
  }

  const missing = caseIds.filter((id) => !promptIds.includes(id));
  const orphanIds = promptIds.filter((id) => !caseIds.includes(id));

  if (missing.length || orphanIds.length) {
    fail(
      `[crux 5] the corpus ids and the suite prompt ids are not the same set -- the guard's corpus and the eval's ` +
        `prompts have diverged. cases without a prompt: ${JSON.stringify(missing)}; prompts without a case: ${JSON.stringify(orphanIds)}`,
    );
  }

  const referenced = new Set();

  for (const entry of suite.prompts) {
    if (!entry.file) {
      fail(`[crux 5] suite prompt ${entry.id} declares no file`);
    }

    if (!fs.existsSync(join(PROMPTS_DIR, entry.file))) {
      fail(`[crux 5] suite prompt ${entry.id} names ${entry.file}, which does not exist in ${PROMPTS_DIR}`);
    }

    referenced.add(entry.file);
  }

  const onDisk = fs.readdirSync(PROMPTS_DIR).filter((f) => f.endsWith('.md'));
  const orphanFiles = onDisk.filter((f) => !referenced.has(f));

  if (orphanFiles.length) {
    fail(`[crux 5] ${JSON.stringify(orphanFiles)} exist under prompts/ but no corpus case declares them`);
  }

  console.log(`[crux 5] OK -- one-to-one corpus-to-prompt derivation: ${caseIds.length} cases, ${promptIds.length} prompt ids, ${onDisk.length} files, no orphan on either side`);
}

// ---- crux 6: grader alignment ------------------------------------------------------------------

// A synthetic answer that DESIGNATES the case's expected owner in ordinary coaching register. The
// point is the round trip: the expected label has to be one grade-routing.mjs's own extractor
// produces, not a second literal that merely looks like one.
function syntheticAnswer(owner, secondHop) {
  if (owner === 'NONE') {
    return 'That is a general design question outside the loop, so I will answer it directly here.';
  }

  if (secondHop) {
    return `Start with ${owner} to open the work. Once that is done, ${secondHop} takes it from there.`;
  }

  return `The owner of this request is ${owner}.`;
}

function cruxGraderAlignment(cases) {
  const otherOwner = (owner) => (owner === 'lz-red' ? 'lz-refactor' : 'lz-red');

  for (const caseSpec of cases) {
    const expected = expectedLabelFor(caseSpec);
    const got = extractDestination(syntheticAnswer(caseSpec.expectedOwner, caseSpec.expectedSecondHop)).label;

    if (got !== expected) {
      fail(
        `[crux 6] ${caseSpec.id}: the expected label ${JSON.stringify(expected)} is NOT one the grader produces -- ` +
          `a synthetic answer designating that owner extracted ${JSON.stringify(got)}. The corpus and the grader's ` +
          'closed label vocabulary have diverged.',
      );
    }

    // Both directions. A round trip that passes for every input would prove nothing about the
    // extractor, so a synthetic naming a DIFFERENT owner must NOT produce the expected label.
    const decoyOwner = caseSpec.expectedOwner === 'NONE' ? 'lz-tpp' : otherOwner(caseSpec.expectedOwner);
    const decoy = extractDestination(syntheticAnswer(decoyOwner, null)).label;

    if (decoy === expected) {
      fail(`[crux 6] ${caseSpec.id}: a synthetic naming ${decoyOwner} also extracted ${JSON.stringify(expected)}, so the round trip is vacuous`);
    }
  }

  const twoHop = cases.filter((c) => c.expectedSecondHop);

  if (twoHop.length !== 1) {
    fail(`[crux 6] expected exactly ONE ordered two-hop case in the corpus, found ${twoHop.length} (${twoHop.map((c) => c.id).join(', ')})`);
  }

  const hopLabel = expectedLabelFor(twoHop[0]);
  const reversed = extractDestination(syntheticAnswer(twoHop[0].expectedSecondHop, twoHop[0].expectedOwner)).label;

  if (reversed === hopLabel) {
    fail(`[crux 6] ${twoHop[0].id}: the REVERSED pair extracts the same label ${JSON.stringify(hopLabel)}, so order is not represented and D-02's ordering claim is unmeasurable`);
  }

  console.log(`[crux 6] OK -- all ${cases.length} expected labels round-trip through the grader's extractor, decoys rejected`);
  console.log(`[crux 6] OK -- the single ordered two-hop (${twoHop[0].id}: ${hopLabel}) is representable and its reverse is a DIFFERENT label`);
}

// ---- drive -------------------------------------------------------------------------------------

function main() {
  const suite = readJson(join(ROUTING_SUITE_DIR, 'suite.json'), 'the routing suite');
  const cases = loadCorpus(CORPUS_PATH);

  if (!Array.isArray(suite.prompts) || suite.prompts.length === 0) {
    fail('the routing suite declares no prompts, so every crux below would be vacuous');
  }

  // variant A first: the tracked tree IS variant A and needs no generated copy (D-24).
  const trees = [
    ['variant_a', PLUGIN_UNDER_TEST],
    ['variant_b', variantDest('lz-tdd-variant-b')],
    ['variant_c', variantDest('lz-tdd-variant-c')],
  ];

  for (const [id, root] of trees) {
    if (!fs.existsSync(root)) {
      fail(`${id}: plugin tree missing at ${root}. Build the generated trees first: node variants/build-variants.mjs`);
    }
  }

  console.log(`selfcheck-routing -- offline placement-arm proof (zero spend)`);
  console.log(`  suite:  ${suite.name} (${relative(REPO_ROOT, ROUTING_SUITE_DIR).split(sep).join('/')})`);
  console.log(`  corpus: ${cases.length} cases`);
  console.log('');

  cruxCompositionAndParity(suite);
  cruxDescriptionIdentity(trees);
  cruxDeltaDeclaration();
  cruxCorpusDerivation(suite, cases);
  cruxGraderAlignment(cases);

  console.log('');
  console.log(
    `SUMMARY: routing selfcheck GREEN -- 6/6 cruxes PASS. 3 placement arms compose distinctly off ${suite.prompts.length} ` +
      `byte-identical prompts with byte-identical descriptions across all 3 trees; both generated deltas match their ` +
      `declaration; ${cases.length} cases map one-to-one to prompts and round-trip through the grader. Zero spend.`,
  );
}

try {
  main();
} catch (err) {
  // fail() already exited 1 for a crux failure; anything reaching here is an IO or usage error.
  console.error(`selfcheck-routing: ERROR -- ${err && err.message ? err.message : err}`);
  process.exit(2);
}
