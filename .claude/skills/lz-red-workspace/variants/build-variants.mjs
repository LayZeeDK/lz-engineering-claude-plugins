#!/usr/bin/env node
// Regenerate the D-08 PLACEMENT variant plugin trees from tracked inputs. TWO of them, one per
// NON-TRACKED variant:
//
//   out/lz-tdd-variant-b -- the shared routing table PLUS a short inline classify-first rationale in
//                           each of the three SKILL.md files. Each file KEEPS its sibling-seam
//                           heading and its step-1 branch list. Drives --arm variant_b.
//   out/lz-tdd-variant-c -- the shared routing table REPLACING the three per-skill narrative
//                           sections: the section is deleted outright and step 1's closing pointer
//                           links out to the table instead of naming a now-absent heading. The
//                           step-1 branch list stays INLINE. Drives --arm variant_c.
//
// There is deliberately NO variant A entry. The TRACKED tree IS variant A (D-24) -- inline only, no
// shipped file added -- so it needs no generated copy, it is the composition anchor selfcheck-red.mjs
// cruxes 1/2 already assert, and run-e2e.mjs's variant_a arm reuses PLUGIN_DIR.
//
// Why a build script instead of committed copies: plugins/lz-tdd is ~200 files, and each variant
// differs from it in four. Git carries the artifact plus this script; the trees are built on demand
// into an already-gitignored directory (.gitignore `out/`).
//
// The shipped tree is never mutated. It IS the variant-A arm of the A/B, so a build that touched it
// would corrupt the baseline rather than just the treatment -- which is why the source tree is hashed
// before and after and the equality is asserted, not assumed.
//
// Everything here fails CLOSED. A silently-skipped transform would produce a tree whose lever is
// absent, and the A/B would then measure nothing while looking healthy. That is the whole reason the
// operation vocabulary below carries one assert per operation rather than one assert for the build.
//
//   node .claude/skills/lz-red-workspace/variants/build-variants.mjs
//
// Exit: 0 on success, 1 on an assert failure, 2 on an IO or usage error. Node builtins only.

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
// variants -> lz-red-workspace -> skills -> .claude -> repo root
const REPO_ROOT = path.resolve(HERE, '../../../..');
const SOURCE_DIR = path.join(REPO_ROOT, 'plugins', 'lz-tdd');

const ARTIFACT_NAME = 'rgr-routing.md';
const ARTIFACT_SRC = path.join(HERE, ARTIFACT_NAME);
const ARTIFACT_REL = path.join('references', ARTIFACT_NAME);
const MANIFEST_REL = path.join('.claude-plugin', 'plugin.json');

// The three shipped skills, in a fixed order so every report reads the same way twice.
const SKILL_NAMES = ['lz-red', 'lz-tpp', 'lz-refactor'];
const SKILL_RELS = {
  'lz-red': path.join('skills', 'lz-red', 'SKILL.md'),
  'lz-tpp': path.join('skills', 'lz-tpp', 'SKILL.md'),
  'lz-refactor': path.join('skills', 'lz-refactor', 'SKILL.md'),
};

// ---------------------------------------------------------------------------------------------
// The OPERATION VOCABULARY.
// ---------------------------------------------------------------------------------------------
// The analog (treatment/build-treatment.mjs) supports exactly ONE operation, insert-lines-at-anchor.
// Variant C needs three shapes that one cannot express, so the vocabulary is widened to four:
//
//   addFile         copy a declared source artifact to a declared destination path inside the tree
//   replaceSection  replace the BODY of a named level-2 section, keeping its heading line
//   deleteSection   remove a named level-2 section, heading included
//   replaceRun      replace an exact contiguous run of lines with another run
//
// replaceRun SUBSUMES the analog's insert-at-anchor -- pass the anchor line as the whole `from` run
// and the anchor plus the new lines as `to` -- so this is a widening, not a swap. There is no
// separate insertLines operation on purpose: every operation here is USED by at least one variant,
// and an operation no variant exercises would carry a fail-closed assert no run ever reaches, which
// is a guard that cannot fail.
//
// EVERY operation carries its own assert on BOTH sides of the edit:
//
//   pre   the anchor, heading or line run resolves EXACTLY ONCE. Zero matches is the silent-no-op
//         case (a reworded heading), and more than one is ambiguous; both FAIL, naming the variant,
//         the operation and the file.
//   post  the operation's own marker is present exactly once in the output.
//
// deleteSection's post-assert is deliberately the INVERSE -- the heading must occur ZERO times. A
// present-marker assert on a deletion would be satisfied by a no-op, which is precisely the failure
// the pre-assert exists to catch, so asserting presence there would be a guard that cannot fail.

// The heading the routing artifact carries in the workspace and must NOT carry inside a plugin tree:
// it says the file is staged for an experiment, and a model under test must never be told that. Same
// doctrine as the analog's dev-time-header strip, expressed as an ordinary deleteSection so it gets
// the same fail-closed assert as every other transform instead of a bespoke slicer.
const STAGING_HEADING = 'Staging note -- workspace artifact, not shipped';

// The artifact's H1, used as the addFile marker. It survives the staging strip, occurs exactly once,
// and occurs ZERO times in the shipped tree, so the marker assert stays meaningful.
const ARTIFACT_H1 = '# Red-green-refactor routing table';

// The sibling-seam narrative heading in each shipped SKILL.md. Matched EXACTLY: a rewording makes the
// pre-assert see zero matches and FAIL, which is the property the mutation proof measures. These are
// the headings 22-03 landed; step 1 of each file cites its own by name, which is why variant C has to
// rewrite that pointer in the same breath as deleting the section.
const NARRATIVE_HEADING = {
  'lz-red': 'RED vs the green step (lz-tpp) and the refactor step (lz-refactor)',
  'lz-tpp': 'The green step vs the red step (lz-red) and the refactor step (lz-refactor)',
  'lz-refactor': 'Refactoring vs the red step (lz-red) and the green step (lz-tpp)',
};

// The ONE citation form. INLINE CODE, never a Markdown link: check-red-references.mjs guard N2
// classifies a variable-prefixed target as a RELATIVE link and existsSync-checks it, so a Markdown
// link around this path can never resolve. Single-quoted on purpose -- a template literal would
// interpolate the dollar-brace away.
const TABLE_CITE = '`${CLAUDE_PLUGIN_ROOT}/references/rgr-routing.md`';

// Variant B's replacement body for each sibling-seam section: a SHORT classify-first rationale plus
// the citation. It is deliberately plugin-neutral and identical in all three files -- B's lever is
// "shared table PLUS inline rationale", and three divergent rationales would be a fourth variant.
const B_RATIONALE_LINES = [
  'Classify the request before acting, by what the developer is asking for and never by the state of',
  'the suite. Classifying first is what keeps exactly one owner per request: the red step (choosing',
  'and writing the next failing test) is lz-red, the green step (making a failing test pass by',
  'changing behavior) is lz-tpp, and the refactor step (changing structure without changing behavior)',
  'is lz-refactor. A request outside all three is not a red-green-refactor-loop request and no skill',
  'in this loop owns it. The full case-to-owner table, the two-hop rule and the edge cases live in the',
  'plugin-wide routing reference ' + TABLE_CITE + '; read it',
  'rather than restating it here.',
];

// Variant C's step-1 closing pointer, per skill. `from` is the EXACT contiguous run in the shipped
// file; `to` swaps the "See <heading> above" pointer for a link-out to the shared table, because
// under C that heading no longer exists. The branch list itself is untouched -- D-08's own wording
// keeps it inline, and reference-file retrieval has a MEASURED zero rate on this repo, so relocating
// the branch list would move the load-bearing rule to a tier that may never be read (D-10).
const C_POINTER = {
  'lz-red': {
    from: [
      '1. Classify the request by what the developer is asking for, never by the state of the suite. See',
      '   "RED vs the green step (lz-tpp) and the refactor step (lz-refactor)" above; do not restate it.',
      '   Take the FIRST branch that matches:',
    ],
    to: [
      '1. Classify the request by what the developer is asking for, never by the state of the suite. The',
      '   full case-to-owner table, the two-hop rule and the edge cases live in the plugin-wide routing',
      '   reference ' + TABLE_CITE + '; read it rather than',
      '   restating it here. Take the FIRST branch that matches:',
    ],
  },
  'lz-tpp': {
    from: [
      '1. Classify the request by what the developer is asking for, never by the state of the suite. Once',
      '   a branch below has settled this as the green step, confirm the green phase before ranking',
      '   anything: exactly one new failing (red) test, all prior tests green, and the code compiles. A',
      '   cleanup ask is a structure-only refactoring that belongs to lz-refactor, so it is never',
      '   priority-ranked here. See "The green step vs the red step (lz-red) and the refactor step',
      '   (lz-refactor)" above; do not restate it. Take the FIRST branch that matches:',
    ],
    to: [
      '1. Classify the request by what the developer is asking for, never by the state of the suite. Once',
      '   a branch below has settled this as the green step, confirm the green phase before ranking',
      '   anything: exactly one new failing (red) test, all prior tests green, and the code compiles. A',
      '   cleanup ask is a structure-only refactoring that belongs to lz-refactor, so it is never',
      '   priority-ranked here. The full case-to-owner table, the two-hop rule and the edge cases live',
      '   in the plugin-wide routing reference ' + TABLE_CITE + '; read it',
      '   rather than restating it here. Take the FIRST branch that matches:',
    ],
  },
  'lz-refactor': {
    from: [
      '1. Classify the request by what the developer is asking for, never by the state of the suite. See',
      '   "Refactoring vs the red step (lz-red) and the green step (lz-tpp)" above; do not restate it.',
      '   Take the FIRST branch that matches:',
    ],
    to: [
      '1. Classify the request by what the developer is asking for, never by the state of the suite. The',
      '   full case-to-owner table, the two-hop rule and the edge cases live in the plugin-wide routing',
      '   reference ' + TABLE_CITE + '; read it rather than restating it here.',
      '   Take the FIRST branch that matches:',
    ],
  },
};

// Both variants change exactly the same four paths. They differ in HOW, which is the point: the delta
// SET being identical is what makes "placement" the only variable between the two treatment arms.
const EXPECTED_DELTAS = [
  `added   ${ARTIFACT_REL}`,
  ...SKILL_NAMES.map((name) => `edited  ${SKILL_RELS[name]}`),
];

// The two transforms every variant starts with: copy the shared table in, then strip its staging note.
// Expressed once because a drift between the two variants' copies of the table would silently make
// them two different treatments.
const sharedTableTransforms = () => [
  {
    op: 'addFile',
    file: ARTIFACT_REL,
    src: ARTIFACT_SRC,
    marker: ARTIFACT_H1,
  },
  {
    op: 'deleteSection',
    file: ARTIFACT_REL,
    heading: STAGING_HEADING,
  },
];

const VARIANTS = [
  {
    id: 'variant-b',
    outName: 'lz-tdd-variant-b',
    lever: 'shared routing table PLUS a short inline classify-first rationale in each SKILL.md',
    transforms: [
      ...sharedTableTransforms(),
      ...SKILL_NAMES.map((name) => ({
        op: 'replaceSection',
        file: SKILL_RELS[name],
        heading: NARRATIVE_HEADING[name],
        body: B_RATIONALE_LINES,
        marker: TABLE_CITE,
      })),
    ],
    expectedDeltas: EXPECTED_DELTAS,
  },
  {
    id: 'variant-c',
    outName: 'lz-tdd-variant-c',
    lever: 'shared routing table REPLACING the three per-skill narrative sections; branch lists stay inline',
    transforms: [
      ...sharedTableTransforms(),
      ...SKILL_NAMES.map((name) => ({
        op: 'deleteSection',
        file: SKILL_RELS[name],
        heading: NARRATIVE_HEADING[name],
      })),
      ...SKILL_NAMES.map((name) => ({
        op: 'replaceRun',
        file: SKILL_RELS[name],
        from: C_POINTER[name].from,
        to: C_POINTER[name].to,
        marker: TABLE_CITE,
      })),
    ],
    expectedDeltas: EXPECTED_DELTAS,
  },
];

// ---------------------------------------------------------------------------------------------
// Primitives.
// ---------------------------------------------------------------------------------------------

function fail(message) {
  console.error(`[FAIL] ${message}`);
  process.exit(1);
}

function hashFile(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

// relative path -> content hash, for every file at any depth.
function hashTree(root) {
  const out = new Map();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        walk(full);
        continue;
      }

      if (entry.isFile()) {
        out.set(path.relative(root, full), hashFile(full));
      }
    }
  };

  walk(root);

  return out;
}

// The D-11 primitive: sha256 of the leading YAML frontmatter block, delimiters included. Scoped to the
// frontmatter and nothing else, so a body edit is invisible to it and a description edit is not --
// which is the only distinction the assertion cares about.
export function frontmatterHash(file) {
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);

  if (lines[0] !== '---') {
    fail(`${file}: no leading '---' frontmatter delimiter, so the description block cannot be extracted`);
  }

  const closeAt = lines.indexOf('---', 1);

  if (closeAt < 0) {
    fail(`${file}: frontmatter is never closed by a second '---', so the description block cannot be extracted`);
  }

  return crypto.createHash('sha256').update(lines.slice(0, closeAt + 1).join('\n')).digest('hex');
}

// The destructive destination for one variant. HARDCODED, deliberately with NO environment override:
// the first thing the build does to this path is a recursive delete, and an environment-overridable
// destructive target is a foot-gun. run-e2e.mjs's VARIANT_B_DIR / VARIANT_C_DIR carry the override
// instead, because there the value is only ever READ as a --plugin-dir argument.
//
// Exported so selfcheck-routing.mjs walks the same paths this writes rather than recomposing them.
export function variantDest(outName) {
  return path.resolve(path.join(REPO_ROOT, 'out', outName));
}

// Every line index at which `line` occurs EXACTLY, as a whole line.
function exactLineIndexes(lines, wanted) {
  return lines.reduce((acc, line, i) => (line === wanted ? acc.concat(i) : acc), []);
}

// Start index of every occurrence of the contiguous `run` of exact lines.
function runIndexes(lines, run) {
  const at = [];

  for (let i = 0; i + run.length <= lines.length; i++) {
    if (run.every((wanted, k) => lines[i + k] === wanted)) {
      at.push(i);
    }
  }

  return at;
}

// [start, end) of a level-2 section: the heading line through the line before the next `## ` heading,
// or EOF. Returns the match COUNT so the caller can fail on anything other than exactly one -- the
// heading is a parse INPUT here, so a rewording lands on count 0 and FAILS rather than no-opping.
function sectionRange(lines, heading) {
  const at = exactLineIndexes(lines, `## ${heading}`);

  if (at.length !== 1) {
    return { count: at.length };
  }

  let end = lines.length;

  for (let i = at[0] + 1; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) {
      end = i;
      break;
    }
  }

  return { count: 1, start: at[0], end };
}

function occurrences(text, needle) {
  return text.split(needle).length - 1;
}

function readLines(file) {
  return fs.readFileSync(file, 'utf8').split(/\r?\n/);
}

function writeLines(file, lines) {
  fs.writeFileSync(file, lines.join('\n'));
}

// ---------------------------------------------------------------------------------------------
// The four operations. Each asserts its own anchor BEFORE applying and its own marker AFTER.
// ---------------------------------------------------------------------------------------------

function applyTransform(variant, transform, dest) {
  const where = `${variant.id}: ${transform.op} in ${transform.file}`;
  const target = path.join(dest, transform.file);

  if (transform.op === 'addFile') {
    if (!fs.existsSync(transform.src)) {
      fail(`${where}: source artifact missing: ${transform.src}`);
    }

    // A destination that already exists means the shipped tree carries this path, so the delta would
    // be an `edited` where the variant declares an `added` -- and the declaration, not the tree, is
    // what the A/B is read against.
    if (fs.existsSync(target)) {
      fail(`${where}: destination already exists in the copied tree, so this is not an added file`);
    }

    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(transform.src, target);

    const count = occurrences(fs.readFileSync(target, 'utf8'), transform.marker);

    if (count !== 1) {
      fail(`${where}: marker ${JSON.stringify(transform.marker)} occurs ${count} time(s) in the copy, expected exactly 1`);
    }

    return;
  }

  if (!fs.existsSync(target)) {
    fail(`${where}: target file missing from the copied tree: ${target}`);
  }

  const lines = readLines(target);

  if (transform.op === 'replaceSection') {
    const range = sectionRange(lines, transform.heading);

    if (range.count !== 1) {
      fail(
        `${where}: heading ${JSON.stringify(transform.heading)} matched ${range.count} time(s), expected exactly 1. ` +
          'A zero-match replace would leave the section unchanged and yield a tree whose lever is absent.',
      );
    }

    // Keep the heading line; replace everything between it and the next `## `.
    writeLines(target, [...lines.slice(0, range.start + 1), '', ...transform.body, '', ...lines.slice(range.end)]);

    const after = fs.readFileSync(target, 'utf8');
    const headingCount = exactLineIndexes(after.split(/\r?\n/), `## ${transform.heading}`).length;

    if (headingCount !== 1) {
      fail(`${where}: the heading survived ${headingCount} time(s) after the replace, expected exactly 1`);
    }

    const markerCount = occurrences(after, transform.marker);

    if (markerCount !== 1) {
      fail(`${where}: marker ${JSON.stringify(transform.marker)} occurs ${markerCount} time(s) after the replace, expected exactly 1`);
    }

    return;
  }

  if (transform.op === 'deleteSection') {
    const range = sectionRange(lines, transform.heading);

    if (range.count !== 1) {
      fail(
        `${where}: heading ${JSON.stringify(transform.heading)} matched ${range.count} time(s), expected exactly 1. ` +
          'A zero-match delete would leave the section in place and yield a tree whose lever is absent.',
      );
    }

    writeLines(target, [...lines.slice(0, range.start), ...lines.slice(range.end)]);

    // INVERSE post-assert, and deliberately so: a present-marker check on a deletion would be
    // satisfied by the very no-op the pre-assert exists to catch.
    const headingCount = exactLineIndexes(readLines(target), `## ${transform.heading}`).length;

    if (headingCount !== 0) {
      fail(`${where}: the heading still occurs ${headingCount} time(s) after the delete, expected 0`);
    }

    return;
  }

  if (transform.op === 'replaceRun') {
    const at = runIndexes(lines, transform.from);

    if (at.length !== 1) {
      fail(
        `${where}: the ${transform.from.length}-line run matched ${at.length} time(s), expected exactly 1. ` +
          `First line: ${JSON.stringify(transform.from[0])}. A zero-match replace would leave the pointer ` +
          'naming a section this variant deletes.',
      );
    }

    writeLines(target, [...lines.slice(0, at[0]), ...transform.to, ...lines.slice(at[0] + transform.from.length)]);

    const afterLines = readLines(target);

    if (runIndexes(afterLines, transform.from).length !== 0) {
      fail(`${where}: the original run survived the replace`);
    }

    const markerCount = occurrences(afterLines.join('\n'), transform.marker);

    if (markerCount !== 1) {
      fail(`${where}: marker ${JSON.stringify(transform.marker)} occurs ${markerCount} time(s) after the replace, expected exactly 1`);
    }

    return;
  }

  fail(`${where}: unknown operation ${JSON.stringify(transform.op)}`);
}

// ---------------------------------------------------------------------------------------------
// Build one variant.
// ---------------------------------------------------------------------------------------------

function buildVariant(variant, before, repoRoot) {
  // -------------------------------------------------------------------------------------------
  // Destination safety. Asserted BEFORE anything is deleted -- see variantDest for why the path is
  // hardcoded with no environment override.
  // -------------------------------------------------------------------------------------------
  const dest = variantDest(variant.outName);
  const lastTwo = dest.split(path.sep).slice(-2);

  if (dest !== repoRoot && !dest.startsWith(repoRoot + path.sep)) {
    fail(`destination ${dest} is outside the repo root ${repoRoot}; refusing to delete anything`);
  }

  if (lastTwo[0] !== 'out' || lastTwo[1] !== variant.outName) {
    fail(`destination ${dest} does not end in out/${variant.outName}; refusing to delete anything`);
  }

  fs.rmSync(dest, { recursive: true, force: true });
  fs.cpSync(SOURCE_DIR, dest, { recursive: true });

  for (const transform of variant.transforms) {
    applyTransform(variant, transform, dest);
  }

  // -------------------------------------------------------------------------------------------
  // Post-build assertions. All fail closed, all printed.
  // -------------------------------------------------------------------------------------------
  const manifestPath = path.join(dest, MANIFEST_REL);

  if (!fs.existsSync(manifestPath)) {
    fail(`${variant.id}: generated tree has no ${MANIFEST_REL}; --plugin-dir would not load it`);
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  if (manifest.name !== 'lz-tdd') {
    fail(
      `${variant.id}: generated manifest name is ${JSON.stringify(manifest.name)}, expected "lz-tdd". Any other name ` +
        'breaks the plugin-root variable and the skill namespace, turning this arm into a second baseline.',
    );
  }

  const after = hashTree(dest);
  const deltas = [];

  for (const [rel, hash] of after) {
    if (!before.has(rel)) {
      deltas.push(`added   ${rel}`);
      continue;
    }

    if (before.get(rel) !== hash) {
      deltas.push(`edited  ${rel}`);
    }
  }

  for (const rel of before.keys()) {
    if (!after.has(rel)) {
      deltas.push(`removed ${rel}`);
    }
  }

  const expected = variant.expectedDeltas.slice().sort();

  if (deltas.length !== expected.length || deltas.slice().sort().join('|') !== expected.join('|')) {
    fail(
      `${variant.id}: expected exactly ${expected.length} delta(s) (${expected.join(', ')}), got ${deltas.length}:\n  ` +
        deltas.join('\n  '),
    );
  }

  console.log(`[OK] ${variant.id} tree built at ${path.relative(repoRoot, dest)} -- lever: ${variant.lever} (plugin name: ${manifest.name})`);

  for (const delta of deltas.slice().sort()) {
    console.log(`[OK] ${variant.id} delta: ${delta}`);
  }

  return dest;
}

// ---------------------------------------------------------------------------------------------
// Drive.
// ---------------------------------------------------------------------------------------------

function main() {
  const repoRoot = path.resolve(REPO_ROOT);

  if (!fs.existsSync(SOURCE_DIR)) {
    fail(`source plugin tree missing: ${SOURCE_DIR}`);
  }

  if (!fs.existsSync(ARTIFACT_SRC)) {
    fail(`shared routing table missing: ${ARTIFACT_SRC}`);
  }

  const before = hashTree(SOURCE_DIR);
  const dests = new Map();

  for (const variant of VARIANTS) {
    dests.set(variant.id, buildVariant(variant, before, repoRoot));
  }

  // The shipped tree is the variant-A arm AND the transform input, so proving it unchanged is not
  // housekeeping -- a mutated source would corrupt the baseline every treatment is measured against.
  const afterSource = hashTree(SOURCE_DIR);
  const moved = [...before.keys()].filter((rel) => !afterSource.has(rel) || afterSource.get(rel) !== before.get(rel));
  const appeared = [...afterSource.keys()].filter((rel) => !before.has(rel));

  if (moved.length || appeared.length) {
    fail(
      `the shipped tree was MUTATED by the build: ${moved.length} changed/removed, ${appeared.length} added:\n  ` +
        [...moved, ...appeared].join('\n  '),
    );
  }

  console.log(`[OK] source tree ${path.relative(repoRoot, SOURCE_DIR)} UNTOUCHED: ${before.size} files hashed before and after, all identical`);

  // The three arms' trees, variant A first. variant A is the tracked tree, so it is read in place.
  const trees = [
    ['variant-a', SOURCE_DIR],
    ['variant-b', dests.get('variant-b')],
    ['variant-c', dests.get('variant-c')],
  ];

  // Pairwise distinctness across ALL THREE trees, per skill: two arms must never be the same tree
  // twice. Checked per SKILL.md rather than per tree, so a variant that changed only one file cannot
  // hide behind another file's difference.
  for (const name of SKILL_NAMES) {
    const bodies = trees.map(([id, root]) => [id, fs.readFileSync(path.join(root, SKILL_RELS[name]), 'utf8')]);

    for (let i = 0; i < bodies.length; i++) {
      for (let j = i + 1; j < bodies.length; j++) {
        if (bodies[i][1] === bodies[j][1]) {
          fail(`${bodies[i][0]} vs ${bodies[j][0]}: ${SKILL_RELS[name]} is IDENTICAL, so those arms are not distinct`);
        }
      }
    }
  }

  console.log(`[OK] pairwise DISTINCT: all 3 pairs differ for each of the ${SKILL_NAMES.length} SKILL.md files (9 comparisons)`);

  // The shared table must be byte-identical in B and C. B and C differ in PLACEMENT only; a drifted
  // copy would make them two different treatments and the comparison would answer a question nobody
  // asked.
  const tableB = hashFile(path.join(dests.get('variant-b'), ARTIFACT_REL));
  const tableC = hashFile(path.join(dests.get('variant-c'), ARTIFACT_REL));

  if (tableB !== tableC) {
    fail(`the shared table differs between variant-b (${tableB.slice(0, 12)}) and variant-c (${tableC.slice(0, 12)}); placement would not be the only variable`);
  }

  console.log(`[OK] shared table BYTE-IDENTICAL in variant-b and variant-c (${tableB.slice(0, 12)})`);

  // The staging note must not have reached either tree.
  for (const [id, root] of trees) {
    const artifact = path.join(root, ARTIFACT_REL);

    if (!fs.existsSync(artifact)) {
      continue;
    }

    if (occurrences(fs.readFileSync(artifact, 'utf8'), STAGING_HEADING) !== 0) {
      fail(`${id}: the copied table still carries the staging note, which would tell a model under test it is inside an experiment`);
    }
  }

  console.log('[OK] no generated tree carries the staging note');

  // -------------------------------------------------------------------------------------------
  // THE SINGLE MOST IMPORTANT ASSERTION IN THIS FILE (D-11).
  // -------------------------------------------------------------------------------------------
  // The three arms must carry BYTE-IDENTICAL `description` frontmatter for all three skills. The
  // description is what drives auto-triggering, and all three arms use a NATURAL prompt, so if a
  // description drifts by one byte the arms stop differing only in placement and the A/B silently
  // measures TRIGGERING instead. Asserted here at GENERATION time; selfcheck-routing.mjs re-asserts
  // it INDEPENDENTLY at measurement time, because a tree can be hand-touched between the two.
  for (const name of SKILL_NAMES) {
    const hashes = trees.map(([id, root]) => [id, frontmatterHash(path.join(root, SKILL_RELS[name]))]);
    const distinct = new Set(hashes.map(([, h]) => h));

    if (distinct.size !== 1) {
      fail(
        `${name}: frontmatter differs across the three trees, so the A/B would measure triggering rather than placement:\n  ` +
          hashes.map(([id, h]) => `${id} ${h}`).join('\n  '),
      );
    }

    console.log(`[OK] ${name} frontmatter IDENTICAL across all 3 trees -- ${hashes[0][1].slice(0, 16)}`);
  }

  console.log('');
  console.log(
    `SUMMARY: variants GREEN -- ${VARIANTS.length} tree(s) built, each with ${EXPECTED_DELTAS.length} declared delta(s) matched exactly; ` +
      'source untouched; 3 arms pairwise distinct per SKILL.md; frontmatter byte-identical across all 3 trees',
  );
}

const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  try {
    main();
  } catch (err) {
    // fail() already exited 1 for an assert; anything reaching here is an IO or usage error.
    console.error(`[ERROR] ${err && err.message ? err.message : err}`);
    process.exit(2);
  }
}

export { VARIANTS, SKILL_NAMES, SKILL_RELS, ARTIFACT_REL, MANIFEST_REL, SOURCE_DIR, REPO_ROOT, EXPECTED_DELTAS, hashTree };
