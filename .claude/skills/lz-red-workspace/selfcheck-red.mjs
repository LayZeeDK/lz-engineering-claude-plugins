#!/usr/bin/env node
// selfcheck-red.mjs -- the offline, ZERO-SPEND crux battery for the RED apply harness (mirrors
// lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs). It proves the whole RED instrument
// composes and tears down correctly BEFORE any metered claude -p run (the D-12 build-then-halt
// boundary). It NEVER calls claude; every step is a --dry-run compose, a git-only worktree
// build/teardown, an offline transcript parse, or a pure classifier assertion.
//
// Seven cruxes (RESEARCH "Wave 0 Gaps"; EVL-03.1 / .2; crux 7 added by quick 260725-63f):
//   1. COMPOSITION   -- the RED suite composes all 3 own-skill arms: no_skill (no --plugin-dir),
//      with_skill (--plugin-dir plugins/lz-tdd, natural prompt), invoke_skill (-p prefixed
//      /lz-tdd:lz-red ). (recommend mode needs no --cwd; arm plumbing is mode-independent.)
//   2. PROMPT-PARITY -- no_skill and with_skill -p are byte-identical; invoke_skill -p is exactly
//      with_skill -p + the leading "/lz-tdd:lz-red " (the D-02 non-leading, byte-identical prompt).
//      Also, in APPLY mode: the RED suite's own preamble override reaches composition, keeps the
//      typecheck + never-commit constraints, makes no stay-green claim (the shared lz-refactor
//      default does, which argues against the very behavior a RED eval measures), stays
//      non-leading, and holds parity across all three arms.
//   3. WORKTREE BASE -- buildSyntheticBase against the kata git root builds + tears down a worktree
//      leaving the borrowed repo pristine (git status clean, no leftover worktree/branch; Pitfall 6).
//      Kata unavailable -> SKIP (do not fail the whole selfcheck).
//   4. TRIGGER DETECTOR -- extractResult(raw, ['lz-red','lz-tpp']) keeps the three trigger facts
//      apart: AVAILABLE (system/init advertises the skill -- proves --plugin-dir worked),
//      MODEL-FIRED (a Skill tool_use -- the genuine auto-trigger), and, by its absence, FORCED
//      (an expanded slash command leaves no stream trace, so run-e2e records it by construction).
//      Runs off two committed hand-authored fixtures, so it never SKIPs; a real on-disk capture
//      (gitignored) is parsed as an extra when present. It also pins the END-OF-RUN SUMMARY count,
//      which read two hardcoded legacy scalars and so contradicted the per-run model-fired line on
//      any suite whose trackSkills are not the lz-refactor pair.
//   5. CLASSIFIER    -- grade-red's classify() classifies genuinely_red + false_green, and RED
//      ATTRIBUTION holds: a failure borrowed from a PRE-EXISTING test never passes the D-06 gate
//      (thin re-assert; grade-red --selfcheck is the full 8-class one, with the discrimination
//      proof against the pre-attribution rule).
//   6. REGRESSION    -- the DEFAULT nx suite still composes 3 arms with plugins/lz-tdd (the suite-driven
//      trackSkills edit did not break the lz-refactor suites; D-11), AND its apply preamble is still
//      the shared lz-refactor default byte-for-byte (the RED suite must override, never edit it).
//   7. TARGET TOOLCHAIN -- gradeRun over a FABRICATED runDir (hand-built meta.json + diff.patch)
//      against the kata's OWN toolchain: a real verdict, the selected runner, a real runner_version
//      (not the 'unknown' sentinel), and the borrowed repo intact afterwards. Every other crux and
//      every grade-red fixture uses the WORKSPACE toolchain, so this is the only step that proves
//      the gate works against the actual target. Kata absent -> SKIP. Four fixtures: a clean spec
//      (genuinely_red), one outside every collection root (no_tests, not a crash), a type-broken
//      one (compile_error with NEW errors -- the negative control that proves the differential
//      still tells two inputs apart), and a PASSING test APPENDED to the kata's own spec, which
//      already contains a permanently failing placeholder (false_green -- the attribution
//      anti-regression; pre-fix it graded genuinely_red / pass:true on the borrowed failure).
//   8. EXPLOIT REGRESSIONS -- the steering and write exploits measured against the real toolchain
//      on 2026-07-25 stay blocked: a captured diff cannot NAME a path into the borrowed repo, its
//      own git state or outside the worktree; the no-tests signal comes from the runner rather than
//      from the produced spec's own text; and the vacuous-differential guard ignores ordinary
//      source diagnostics. Pure and offline, so it never SKIPs.
//   9. RUNTIME WRITE PATH -- crux 8 covers what a captured diff DECLARES; this one covers what the
//      produced spec DOES when the runner executes it. A spec declaring a legitimate path whose
//      BODY deletes and overwrites through node_modules/ is graded for real against a THROWAWAY
//      stand-in repo (never the kata) and asserted to leave that tree byte-intact. Plus the three
//      pure invariants the containment rests on: escapingLinks(), arm-anchor's realpath identity
//      (driven by a SYNTHETIC junction alias rather than by whatever form os.tmpdir() returns), and
//      resolveArmCwd() -- including an explicit 8.3 SHORT-form mismatch.
//
// Fail-closed: any violation prints a FAIL line and exits 1; an OK line + exit 0 on success. Zero
// claude spend, borrowed repo left pristine. NOT wired into `npm run check` (it touches the borrowed
// repo); run it explicitly:  node selfcheck-red.mjs

import fs from 'node:fs';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { buildSyntheticBase, countModelFired, extractResult, git } from '../lz-refactor-workspace/e2e-nx/run-e2e.mjs';
import {
  assertSafeDiffPaths,
  classify,
  escapingLinks,
  gradeRun,
  isConfigLevelTscError,
  newFileDiff,
  parseRunnerReport,
  resolveArmCwd,
} from './grade-red.mjs';
import { isSameOrNested } from './arm-anchor.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const RUN_E2E = resolve(HERE, '..', 'lz-refactor-workspace', 'e2e-nx', 'run-e2e.mjs');
const RED_SUITE_DIR = join(HERE, 'e2e-red-gilded-rose');
const SRVX_SUITE_DIR = join(HERE, 'e2e-red-srvx');

// The lz-refactor apply preamble, pinned BYTE-FOR-BYTE. run-e2e.mjs is shared with the lz-refactor
// suites, where "run the affected tests to confirm nothing broke" is exactly right -- a refactoring
// must preserve behavior. The RED suite overrides it per suite (suite.json "preambles") because
// that sentence pushes against the behavior a RED eval measures. This copy is the tripwire: if the
// shared default is ever edited in place instead of overridden, crux 6 fails.
const DEFAULT_APPLY_PREAMBLE =
  'You are pair-programming with me. Read what I point you at and make the improvement in small ' +
  'steps. After editing, typecheck the touched file(s) and run the affected tests to confirm ' +
  'nothing broke. Leave your edits in the working tree; do not commit. Here is my question:\n\n';

function fail(msg) {
  console.error(`selfcheck-red: FAIL -- ${msg}`);
  process.exit(1);
}

function readJson(p) {
  let raw;

  try {
    raw = fs.readFileSync(p, 'utf8');
  } catch (err) {
    fail(`cannot read ${p}: ${err.message}`);
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    fail(`invalid JSON in ${p}: ${err.message}`);
  }
}

// ---- dry-run helpers (zero spend) ------------------------------------------------------------

// Spawn `node run-e2e.mjs --dry-run <extra>` and return its stdout.
function dryRun(extraArgs) {
  const r = spawnSync(process.execPath, [RUN_E2E, '--dry-run', ...extraArgs], {
    cwd: HERE,
    encoding: 'utf8',
  });

  if (r.status !== 0) {
    fail(`dry-run '${extraArgs.join(' ')}' exited ${r.status}: ${(r.stderr || '').trim()}`);
  }

  return r.stdout || '';
}

// Parse the untruncated `argv:` lines the dry-run prints.
function argvLines(stdout) {
  const argvs = stdout
    .split('\n')
    .filter((l) => l.startsWith('argv: '))
    .map((l) => JSON.parse(l.slice('argv: '.length)));

  if (!argvs.length) {
    fail('dry-run produced no argv: line');
  }

  return argvs;
}

// Map arm -> argv by pairing each `--- <mode>/<arm>/<pid> ---` header with the argv line that follows.
function armMap(stdout) {
  const lines = stdout.split('\n');
  const map = {};
  let arm = null;

  for (const line of lines) {
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

// Value immediately after a single-value flag (e.g. -p, --plugin-dir).
function flagValue(argv, flag) {
  const i = argv.indexOf(flag);

  return i >= 0 ? argv[i + 1] : undefined;
}

// ---- crux 1 + 2: composition + prompt-parity (EVERY RED suite, every prompt, both modes) -------

// Every RED suite dir: a direct child of HERE named e2e-red-* that carries a suite.json. Mirrors
// tabulate-mechanical-red.mjs's discoverSuiteDirs() deliberately -- the battery and the tabulator
// must not be able to disagree about what "the RED suites" are, or a suite could be tabulated
// without ever having been composition-checked.
function discoverRedSuites() {
  return fs
    .readdirSync(HERE, { withFileTypes: true })
    .filter((e) => e.isDirectory() && e.name.startsWith('e2e-red-'))
    .map((e) => join(HERE, e.name))
    .filter((d) => fs.existsSync(join(d, 'suite.json')))
    .sort();
}

// The tokens from `tokens` that appear in `prompt`, case-insensitively. PURE, and exported so it
// can be driven in BOTH directions.
//
// Both directions are the point. A positive-only assertion ("the real prompt is clean") passes
// trivially today and would keep passing with a case-folding bug, an emptied token list, or a
// matcher wired to the wrong field -- so it would prove nothing about the guard and everything
// about the prompt happening not to contain a lowercase copy of anything. Crux 2 therefore also
// feeds a POISONED prompt (the real one plus one of that target's own tokens, in a different
// letter case) through this same function and requires a non-empty result.
//
// Empty and whitespace-only tokens are dropped rather than matched: `''` is a substring of every
// string, so one blank entry in a list would make the guard claim to have caught everything.
export function forbiddenTokensIn(prompt, tokens) {
  const lowered = String(prompt == null ? '' : prompt).toLowerCase();

  return (Array.isArray(tokens) ? tokens : [])
    .filter((t) => typeof t === 'string' && t.trim() !== '')
    .filter((t) => lowered.includes(t.toLowerCase()));
}

// Claims ABOUT THE EXISTING SUITE's pass/fail state. The RED prompt must make none.
//
// It used to open "The tests for `app/gilded-rose.ts` are all green right now", which is measurably
// false -- both shipped placeholder specs fail on current code. A false premise invites the model
// to repair the placeholder instead of adding a test, and a repair-only turn grades false_green: a
// correctness failure manufactured by the instrument rather than by the model.
//
// The tokens are claims, not the word "failing" -- asking for the next failing test IS the task, so
// the ask itself must not trip this. Every token pairs a STATE word with the claim; a bare adverb
// would not. 'right now' on its own failed the battery for the benign rewording "the next failing
// test you'd write right now", which claims nothing about the existing suite.
const STATE_CLAIM_TOKENS = [
  'all green',
  'all passing',
  'are green',
  'are passing',
  'currently green',
  'currently passing',
  'currently pass',
  'currently fail',
  'tests pass',
  'suite is green',
  'green right now',
  'passing right now',
  'pass right now',
];

// Crux 1 + 2 for ONE (suite, prompt, mode) triple. Returns the composed with_skill prompt.
function checkComposedPrompt(suiteDir, suite, target, promptEntry, mode) {
  const label = `${suite.name}/${promptEntry.id}/${mode}`;
  const extra = ['--suite', suiteDir, '--mode', mode, '--arm', 'all', '--prompt', promptEntry.id];

  // apply mode requires --cwd and, under --dry-run, only echoes it; no git command runs.
  if (mode === 'apply') {
    extra.push('--cwd', HERE);
  }

  const arms = armMap(dryRun(extra));

  for (const name of ['no_skill', 'with_skill', 'invoke_skill']) {
    if (!arms[name]) {
      fail(`[crux 1] ${label}: dry-run did not compose the ${name} arm (got: ${Object.keys(arms).join(', ')})`);
    }
  }

  // no_skill: NO --plugin-dir (baseline).
  if (arms.no_skill.indexOf('--plugin-dir') >= 0) {
    fail(`[crux 1] ${label}: no_skill must NOT have --plugin-dir`);
  }

  // with_skill: --plugin-dir ends with plugins/lz-tdd; -p is a natural prompt (no slash command).
  const wsPlugin = flagValue(arms.with_skill, '--plugin-dir') || '';

  if (!/[\\/]plugins[\\/]lz-tdd$/.test(wsPlugin)) {
    fail(`[crux 1] ${label}: with_skill --plugin-dir is not plugins/lz-tdd: ${JSON.stringify(wsPlugin)}`);
  }

  const wsPrompt = flagValue(arms.with_skill, '-p') || '';

  if (wsPrompt.startsWith('/')) {
    fail(`[crux 1] ${label}: with_skill -p must be a natural prompt (no leading slash command): ${JSON.stringify(wsPrompt.slice(0, 40))}`);
  }

  // invoke_skill: -p force-starts with the suite's own slash command.
  const prefix = `${suite.skillCommand} `;
  const isPrompt = flagValue(arms.invoke_skill, '-p') || '';

  if (!isPrompt.startsWith(prefix)) {
    fail(`[crux 1] ${label}: invoke_skill -p must start with ${JSON.stringify(prefix)}: ${JSON.stringify(isPrompt.slice(0, 40))}`);
  }

  const isPlugin = flagValue(arms.invoke_skill, '--plugin-dir') || '';

  if (!/[\\/]plugins[\\/]lz-tdd$/.test(isPlugin)) {
    fail(`[crux 1] ${label}: invoke_skill --plugin-dir is not plugins/lz-tdd: ${JSON.stringify(isPlugin)}`);
  }

  // crux 2: prompt-parity (EVL-03.1). no_skill == with_skill byte-identical; invoke == prefix + with_skill.
  const nsPrompt = flagValue(arms.no_skill, '-p') || '';

  if (nsPrompt !== wsPrompt) {
    fail(`[crux 2] ${label}: no_skill vs with_skill -p differ (must be byte-identical):\n  no_skill=${JSON.stringify(nsPrompt)}\n  with_skill=${JSON.stringify(wsPrompt)}`);
  }

  if (isPrompt !== prefix + wsPrompt) {
    fail(`[crux 2] ${label}: invoke_skill -p is not with_skill -p + ${JSON.stringify(prefix)}:\n  invoke=${JSON.stringify(isPrompt)}`);
  }

  const lowered = wsPrompt.toLowerCase();
  const claimed = STATE_CLAIM_TOKENS.filter((t) => lowered.includes(t));

  if (claimed.length) {
    fail(
      `[crux 2] ${label}: the prompt makes a claim about the existing tests' pass/fail state ` +
        `(${JSON.stringify(claimed)}); the RED prompt must not assert that the target's tests currently pass or fail`,
    );
  }

  // The gate can only grade a spec a runner actually collects, so the landing directory must be
  // PINNED rather than left to the model: a spec outside every collection root grades no_tests for
  // a folder choice that says nothing about RED quality. targets.json declares the pin and the
  // prompt states it; assert they agree, which is also what gives test_dir a consumer.
  if (!target.test_dir) {
    fail(`[crux 2] ${label}: target ${target.id} declares no test_dir, so the produced test has no pinned landing directory`);
  }

  if (!wsPrompt.includes(target.test_dir)) {
    fail(
      `[crux 2] ${label}: the prompt does not name the target's pinned test_dir ${JSON.stringify(target.test_dir)}, ` +
        `so the runner and the produced test's location can disagree: ${JSON.stringify(wsPrompt)}`,
    );
  }

  // NON-LEADING, in both directions. The real prompt must name none of the target's own forbidden
  // tokens; the same prompt poisoned with one of them, in a DIFFERENT letter case, must be caught.
  const tokens = target.prompt_forbidden_tokens;

  if (!Array.isArray(tokens) || tokens.length === 0) {
    fail(
      `[crux 2] ${label}: target ${target.id} declares no prompt_forbidden_tokens, so nothing stops the prompt ` +
        'from naming the expected behavior. An empty list must FAIL this crux rather than pass it vacuously',
    );
  }

  const led = forbiddenTokensIn(wsPrompt, tokens);

  if (led.length) {
    fail(`[crux 2] ${label}: the composed prompt names ${JSON.stringify(led)}; it must stay non-leading`);
  }

  // Flip the case of the poison token so a matcher that forgot to fold case is caught too.
  const poison = String(tokens[0]);
  const flipped = poison === poison.toUpperCase() ? poison.toLowerCase() : poison.toUpperCase();
  const caught = forbiddenTokensIn(`${wsPrompt} ${flipped}`, tokens);

  if (!caught.includes(poison)) {
    fail(
      `[crux 2] ${label}: a POISONED prompt carrying ${JSON.stringify(flipped)} was NOT caught (got ${JSON.stringify(caught)}). ` +
        'The token check is unreachable or case-sensitive, so the clean result above proves nothing',
    );
  }

  return wsPrompt;
}

function checkCompositionAndParity() {
  const suiteDirs = discoverRedSuites();

  if (!suiteDirs.length) {
    fail(`[crux 1] no e2e-red-* suite dir with a suite.json was discovered under ${HERE}`);
  }

  const preambles = [];
  let prompts = 0;

  for (const suiteDir of suiteDirs) {
    const suite = readJson(join(suiteDir, 'suite.json'));
    const ctx = loadSuiteCtx(suiteDir);
    const declared = (suite.preambles || {}).apply;

    if (!declared) {
      fail(
        `[crux 2] ${suite.name} declares no apply preamble override, so it inherits the lz-refactor default that ` +
          'tells the model the tests must stay green',
      );
    }

    preambles.push({ name: suite.name, declared });

    for (const promptEntry of suite.prompts || []) {
      const target = ctx.targetsById.get(promptEntry.target);

      if (!target) {
        fail(`[crux 1] ${suite.name}/${promptEntry.id} names target '${promptEntry.target}', which is not in targets.json`);
      }

      checkComposedPrompt(suiteDir, suite, target, promptEntry, 'recommend');
      const applyPrompt = checkComposedPrompt(suiteDir, suite, target, promptEntry, 'apply');
      checkRedApplyPreamble(suite, declared, applyPrompt);
      prompts++;
    }
  }

  // EVERY RED suite must declare the SAME apply preamble bytes. A per-suite override is how the
  // RED preamble exists at all, so nothing structural stops two suites drifting apart -- and two
  // suites measured under different instructions are not comparable, which is the whole point of
  // running more than one.
  const [first, ...rest] = preambles;
  const drifted = rest.filter((p) => p.declared !== first.declared);

  if (drifted.length) {
    fail(
      `[crux 2] RED suites declare DIFFERENT apply preambles (${JSON.stringify(drifted.map((p) => p.name))} differ from ` +
        `${JSON.stringify(first.name)}); every RED suite must be measured under byte-identical instructions`,
    );
  }

  console.log(
    `  [crux 1+2] composition + parity OK across ${suiteDirs.length} RED suite(s) / ${prompts} prompt(s) x 2 modes ` +
      '(no_skill: no plugin; with_skill: lz-tdd + natural prompt; invoke_skill: slash command + lz-tdd; ' +
      'no_skill == with_skill byte-identical)',
  );
  console.log(`  [crux 2] no test-state claim in any prompt OK (checked ${STATE_CLAIM_TOKENS.length} tokens per prompt)`);
  console.log('  [crux 2] every prompt pins its target test_dir OK, names none of its forbidden tokens, and a POISONED prompt IS caught');
  console.log(`  [crux 2] all ${preambles.length} RED suite(s) declare byte-identical apply preamble bytes OK`);
}

// crux 2 (apply mode): the RED suite's own apply preamble. The shared default ends "...run the
// affected tests to confirm nothing broke", which is correct for a refactoring and WRONG here: a
// RED eval measures whether the newly written test FAILS, so that sentence argues against the
// behavior under measurement and is a plausible drove_to_green inducer. It was byte-identical
// across arms, so it never biased the A/B -- it biased the whole suite.
//
// The fix is a per-SUITE override, so this asserts (i) the override actually reaches composition,
// (ii) it keeps the two constraints the harness depends on (typecheck, never commit), (iii) it
// makes no green-preserving claim, (iv) it stays non-leading, and (v) apply-mode prompt parity
// across the three arms still holds -- an override applied per arm would silently break the A/B.
function checkRedApplyPreamble(suite, declared, wsPrompt) {
  // (i) the declared override is what actually gets composed.
  if (!wsPrompt.startsWith(declared)) {
    fail(
      `[crux 2] ${suite.name}: the composed apply prompt does not start with the suite's declared preamble -- the ` +
        `override did not take effect:\n  composed=${JSON.stringify(wsPrompt.slice(0, 120))}`,
    );
  }

  if (wsPrompt.startsWith(DEFAULT_APPLY_PREAMBLE)) {
    fail(`[crux 2] ${suite.name} is still composing the shared lz-refactor apply preamble`);
  }

  // (ii) the harness depends on both of these: an untypechecked edit muddies the compile_error
  // class, and a commit would move the capture out of the working tree the runner diffs.
  if (!/typecheck/i.test(declared)) {
    fail(`[crux 2] the RED apply preamble no longer asks for a typecheck: ${JSON.stringify(declared)}`);
  }

  if (!/do not commit/i.test(declared)) {
    fail(`[crux 2] the RED apply preamble no longer forbids committing: ${JSON.stringify(declared)}`);
  }

  // (iii) no claim that the tests must stay green.
  const greenPreservingTokens = [
    'nothing broke',
    'nothing is broken',
    'nothing breaks',
    'still pass',
    'still green',
    'stay green',
    'remain green',
    'keep the tests passing',
    'without breaking',
    "don't break",
    'do not break',
  ];
  const loweredPreamble = declared.toLowerCase();
  const greenClaims = greenPreservingTokens.filter((t) => loweredPreamble.includes(t));

  if (greenClaims.length) {
    fail(
      `[crux 2] the RED apply preamble tells the model the tests must stay green (${JSON.stringify(greenClaims)}); ` +
        'the produced test is REQUIRED to fail, so the preamble must not argue against the measured behavior',
    );
  }

  // (iv) non-leading: it must not name the smell, the domain behavior, or the verdict. Word-boundary
  // matched, because the short tokens ('red', 'green') would otherwise hit ordinary prose.
  const leadingTokens = ['conjured', 'sulfuras', 'brie', 'backstage', 'quality', 'sellin', 'red', 'green', 'failing', 'passing', 'refactor', 'characterization'];
  const led = leadingTokens.filter((t) => new RegExp(`(^|[^a-z])${t}($|[^a-z])`, 'i').test(declared));

  if (led.length) {
    fail(`[crux 2] the RED apply preamble names the expected smell/behavior/verdict (${JSON.stringify(led)}); it must stay non-leading`);
  }

  console.log(
    `  [crux 2] ${suite.name} apply preamble OK (suite override in effect, byte-identical across the 3 arms, asks ` +
      'for a typecheck, forbids committing, makes no stay-green claim, and names no smell/behavior/verdict)',
  );
}

// ---- crux 3: worktree build/teardown leaves the borrowed repo pristine ------------------------

function loadSuiteCtx(suiteDir) {
  const suite = readJson(join(suiteDir, 'suite.json'));
  const targets = readJson(join(suiteDir, 'targets.json'));

  return {
    repo: suite.repo,
    applyBase: suite.applyBase,
    targetsById: new Map((targets.targets || []).map((t) => [t.id, t])),
    protectedBranches: suite.protectedBranches || ['main', 'master'],
  };
}

function checkWorktreeBase() {
  const ctx = loadSuiteCtx(RED_SUITE_DIR);

  // Availability: SKIP (not fail) if the kata repo is absent or not a git repo (Pitfall 6 crux
  // needs the borrowed repo present; the metered run is gated anyway).
  if (!ctx.repo || !fs.existsSync(ctx.repo)) {
    console.log(`  [crux 3] SKIP -- kata repo not on disk (${ctx.repo}); run the gated suite to exercise it`);

    return;
  }

  const topClone = git(ctx.repo, ['rev-parse', '--show-toplevel']);

  if (topClone.status !== 0) {
    console.log(`  [crux 3] SKIP -- ${ctx.repo} is not a git repo; run the gated suite to exercise it`);

    return;
  }

  const promptEntry = { id: 'sc-red', target: 'GRC' };
  let syn;

  try {
    syn = buildSyntheticBase(promptEntry, ctx, { dryRun: false });
  } catch (err) {
    fail(`[crux 3] worktree build threw: ${err.message}`);
  }

  try {
    if (syn.rootRelPath !== 'TypeScript/app/gilded-rose.ts') {
      fail(`[crux 3] rootRelPath '${syn.rootRelPath}' != 'TypeScript/app/gilded-rose.ts'`);
    }

    if (!syn.tip || !syn.worktree) {
      fail('[crux 3] worktree/tip was not built');
    }
  } finally {
    syn.teardown();
  }

  // teardown must leave the borrowed repo pristine (Pitfall 6): clean tree, no review-* branch, no worktree.
  const porcelain = (git(syn.gitRoot, ['status', '--porcelain']).stdout || '').trim();

  if (porcelain) {
    fail(`[crux 3] repo not clean after teardown: ${porcelain}`);
  }

  const branches = (git(syn.gitRoot, ['branch', '--list', 'review-*']).stdout || '').trim();

  if (branches) {
    fail(`[crux 3] leftover review-* branch after teardown: ${branches}`);
  }

  const worktrees = git(syn.gitRoot, ['worktree', 'list']).stdout || '';

  if (/lz-review-wt-/.test(worktrees)) {
    fail(`[crux 3] leftover review worktree after teardown:\n${worktrees}`);
  }

  console.log('  [crux 3] worktree base OK (built + torn down against the kata git root; repo pristine, no leftover worktree/branch)');
}

// ---- crux 4: the trigger detector distinguishes available / model-fired / forced ---------------

// The 2026-07-25 k=1 pilot exposed the measurement-invalidating defect this crux now guards: the
// detector counted a tracked name inside a tool_use blob, and a slash command in the -p prompt is
// expanded by the CLI at prompt-processing time and produces NO Skill tool_use. So the forced
// invoke_skill arm -- the POSITIVE CONTROL for the D-04 trigger gap -- recorded 0 firings even
// though the skill demonstrably loaded, which makes a with_skill reading of 0.00 indistinguishable
// from a broken detector.
//
// Real transcripts are gitignored, so the old crux SKIPped and could not see any of this. It now
// runs off two committed, hand-authored fixtures and NEVER skips; an on-disk real capture, when one
// happens to exist, is checked as an extra.
function checkTranscriptParse() {
  const fixtureDir = join(HERE, 'fixtures', 'transcripts');

  const readFixture = (name) => {
    const p = join(fixtureDir, name);

    try {
      return fs.readFileSync(p, 'utf8');
    } catch (err) {
      fail(`[crux 4] cannot read committed transcript fixture ${p}: ${err.message}`);
    }
  };

  const tracked = ['lz-red', 'lz-tpp'];
  const slash = extractResult(readFixture('slash-command.jsonl'), tracked);
  const fired = extractResult(readFixture('model-fired.jsonl'), tracked);

  for (const [label, r] of [['slash-command', slash], ['model-fired', fired]]) {
    for (const key of ['used_skills', 'skills_available', 'skills_model_fired']) {
      if (!r[key] || !('lz-red' in r[key]) || !('lz-tpp' in r[key])) {
        fail(`[crux 4] ${label}: ${key} not keyed by the tracked names lz-red/lz-tpp: ${JSON.stringify(r[key])}`);
      }
    }
  }

  // (a) AVAILABLE -- read off the system/init event, the only transcript proof --plugin-dir worked.
  // The slash-command fixture advertises lz-red but NOT lz-tpp, so this has a negative case too: a
  // detector that answered "true" for every tracked name would pass the positive half and fail here.
  if (slash.skills_available['lz-red'] !== true) {
    fail('[crux 4] slash-command fixture: lz-red is advertised in system/init but skills_available says otherwise -- availability is not being read');
  }

  if (slash.skills_available['lz-tpp'] !== false) {
    fail('[crux 4] slash-command fixture: lz-tpp is NOT advertised in system/init, but skills_available claims it is');
  }

  if (fired.skills_available['lz-red'] !== true || fired.skills_available['lz-tpp'] !== true) {
    fail(`[crux 4] model-fired fixture: both tracked skills are advertised, got ${JSON.stringify(fired.skills_available)}`);
  }

  // (b) MODEL-FIRED -- a Skill tool_use, i.e. the model CHOSE to invoke. The slash-command shape has
  // none; that is the pilot's exact blind spot, and it must read as 0 rather than be fabricated.
  if (slash.skills_model_fired['lz-red'] !== 0 || slash.skills_model_fired['lz-tpp'] !== 0) {
    fail(
      `[crux 4] slash-command fixture has no Skill tool_use, so model-fired must be 0 for every tracked name ` +
        `(a forced run must NOT be reported as a model-choice auto-trigger): ${JSON.stringify(slash.skills_model_fired)}`,
    );
  }

  if (fired.skills_model_fired['lz-red'] !== 1) {
    fail(`[crux 4] model-fired fixture: a genuine Skill tool_use for lz-tdd:lz-red was not counted (got ${fired.skills_model_fired['lz-red']})`);
  }

  // Only the Skill call's own descriptor may count. That call's args mention lz-tpp as a hand-off;
  // counting the whole input blob would read the mention as the sibling skill having fired.
  if (fired.skills_model_fired['lz-tpp'] !== 0) {
    fail(
      `[crux 4] model-fired fixture: lz-tpp is only MENTIONED in the lz-red Skill call's args, but it was ` +
        `counted as fired (${fired.skills_model_fired['lz-tpp']}) -- the count must read the descriptor, not the blob`,
    );
  }

  // THE DISCRIMINATION: identical availability, opposite model-fired. If the two collapse, the
  // detector cannot tell "forced/expanded" from "the model chose it" and the D-04 headline is noise.
  if (slash.skills_available['lz-red'] !== fired.skills_available['lz-red']) {
    fail('[crux 4] the two fixtures must AGREE on availability (both loaded the plugin)');
  }

  if (slash.skills_model_fired['lz-red'] === fired.skills_model_fired['lz-red']) {
    fail(
      '[crux 4] the two fixtures read the SAME model-fired count, so the detector cannot distinguish an ' +
        'expanded slash command from a genuine model-choice Skill call',
    );
  }

  console.log(
    '  [crux 4] trigger detector OK (slash-command fixture: available lz-red=true/lz-tpp=false, model-fired 0; ' +
      'model-fired fixture: available both, model-fired lz-red=1/lz-tpp=0 -- descriptor-scoped, and the two ' +
      'agree on availability while differing on model-fired)',
  );

  // The end-of-run SUMMARY line reads the same three facts, and it used to read them off the legacy
  // `used_refactor || used_tpp` scalars -- two hardcoded names. On the RED suite that printed
  // "with_skill: 0/1 runs invoked an lz skill (lz-refactor or lz-tpp)" immediately under the correct
  // per-run `model-fired: lz-red`, contradicting itself in one output. The meta below is exactly
  // that run's shape: lz-red model-fired, both legacy scalars false.
  const redMeta = {
    arm: 'with_skill',
    skills_model_fired: { 'lz-red': 1, 'lz-tpp': 0 },
    used_refactor: false,
    used_tpp: false,
  };
  const quietMeta = { arm: 'with_skill', skills_model_fired: { 'lz-red': 0, 'lz-tpp': 0 }, used_refactor: false, used_tpp: false };
  const legacyCount = [redMeta, quietMeta].filter((m) => m.used_refactor || m.used_tpp).length;

  if (countModelFired([redMeta, quietMeta], tracked) !== 1) {
    fail(
      `[crux 4] the run summary counted ${countModelFired([redMeta, quietMeta], tracked)} model-fired run(s) for the ` +
        "RED suite's tracked skills, expected 1 -- it is not reading skills_model_fired",
    );
  }

  if (legacyCount !== 0) {
    fail('[crux 4] the legacy-scalar comparison is not exercising the defect it claims to (expected the old expression to count 0)');
  }

  // ... and the lz-refactor suites must not regress: their own tracked pair still counts correctly.
  const refactorMeta = { arm: 'with_skill', skills_model_fired: { 'lz-refactor': 2, 'lz-tpp': 0 } };

  if (countModelFired([refactorMeta, quietMeta], ['lz-refactor', 'lz-tpp']) !== 1) {
    fail('[crux 4] the run summary miscounts the lz-refactor suites\' own tracked skills');
  }

  console.log(
    `  [crux 4] run-summary count OK (a lz-red model-fired run counts 1 for trackSkills ${JSON.stringify(tracked)}; ` +
      `the legacy used_refactor||used_tpp expression counted ${legacyCount} on the same meta; lz-refactor pair still counts)`,
  );

  // Extra, when a real capture happens to be on disk (gitignored, so usually absent): the same
  // parameterized parse over real bytes.
  for (const arm of ['with_skill', 'no_skill', 'invoke_skill']) {
    const candidate = join(RED_SUITE_DIR, 'results', 'apply', arm, 'r1', 'run-1', 'outputs', 'transcript.stream.jsonl');

    if (!fs.existsSync(candidate)) {
      continue;
    }

    const r = extractResult(fs.readFileSync(candidate, 'utf8'), tracked);

    if (!r.used_skills || !('lz-red' in r.used_skills) || !('lz-tpp' in r.used_skills)) {
      fail(`[crux 4] on-disk ${arm} transcript: used_skills not keyed by lz-red/lz-tpp: ${JSON.stringify(r.used_skills)}`);
    }

    console.log(
      `  [crux 4] on-disk ${arm} capture also parses (available=${JSON.stringify(r.skills_available)}, ` +
        `model-fired=${JSON.stringify(r.skills_model_fired)}, tools=${Object.keys(r.tool_calls).join('+') || 'none'})`,
    );

    break;
  }
}

// ---- crux 5: classifier (thin re-assert; grade-red --selfcheck is the full one) ---------------

function checkClassifier() {
  // A REAL new-file diff, `+` lines and all. The old stand-in here was a two-line header with no
  // hunk at all, which stopped being a usable input once genuinely_red started requiring a failure
  // attributable to a test the diff ADDED -- a diff carrying no test source adds no test.
  const conjuredTitle = 'degrades twice as fast';
  const testOnlyDiff = newFileDiff(
    'test/vitest/conjured.spec.ts',
    [
      "describe('Conjured items', () => {",
      `  it('${conjuredTitle}', () => {`,
      '    expect(update(3, 6)).toBe(4);',
      '  });',
      '});',
      '',
    ].join('\n'),
  );

  const redRunner = {
    testResults: [
      {
        status: 'failed',
        assertionResults: [{ title: conjuredTitle, status: 'failed', failureMessages: ['AssertionError: expected -1 to be 5'] }],
      },
    ],
  };
  const redVerdict = classify({ newErrors: 0 }, redRunner, testOnlyDiff);

  if (redVerdict !== 'genuinely_red') {
    fail(`[crux 5] tsc-clean + assertion failure classified '${redVerdict}', expected 'genuinely_red'`);
  }

  const greenRunner = {
    testResults: [{ status: 'passed', assertionResults: [{ title: conjuredTitle, status: 'passed', failureMessages: [] }] }],
  };
  const greenVerdict = classify({ newErrors: 0 }, greenRunner, testOnlyDiff);

  if (greenVerdict !== 'false_green') {
    fail(`[crux 5] all-pass + test-only diff classified '${greenVerdict}', expected 'false_green'`);
  }

  // ATTRIBUTION, re-asserted at the crux layer because it is the D-06 gate's pass criterion and the
  // k=1 pilot proved the file-level "something failed" question is not the one D-06 asks: the model
  // APPENDED its test to the kata's own spec, which ships a permanently failing `should foo`
  // placeholder. Here the added test PASSES and only the borrowed placeholder fails -- pre-fix that
  // was genuinely_red / pass:true.
  const borrowedRunner = {
    testResults: [
      {
        status: 'failed',
        assertionResults: [
          {
            title: 'should foo',
            status: 'failed',
            failureMessages: ["AssertionError: expected 'foo' to be 'fixme' // Object.is equality"],
          },
          { title: conjuredTitle, status: 'passed', failureMessages: [] },
        ],
      },
    ],
  };
  const borrowedVerdict = classify({ newErrors: 0 }, borrowedRunner, testOnlyDiff);

  if (borrowedVerdict !== 'false_green') {
    fail(
      `[crux 5] a PASSING added test alongside a pre-existing FAILING one classified '${borrowedVerdict}', ` +
        "expected 'false_green' -- a borrowed failure must never pass the D-06 gate",
    );
  }

  // ... and a failure that cannot be tied to any added test is its own verdict, never a pass and
  // never a claim that the added test passed.
  const strangerRunner = {
    testResults: [
      {
        status: 'failed',
        assertionResults: [
          { title: 'should foo', status: 'failed', failureMessages: ["AssertionError: expected 'foo' to be 'fixme'"] },
        ],
      },
    ],
  };
  const strangerVerdict = classify({ newErrors: 0 }, strangerRunner, testOnlyDiff);

  if (strangerVerdict !== 'unattributable') {
    fail(`[crux 5] a failure belonging to no added test classified '${strangerVerdict}', expected 'unattributable'`);
  }

  console.log(
    '  [crux 5] classifier OK (genuinely_red + false_green re-assert; a borrowed failure stays false_green and ' +
      'an unmatched one unattributable; grade-red --selfcheck covers all 8 classes)',
  );
}

// ---- crux 7: the D-06 gate against the TARGET's own toolchain (fabricated runDir) --------------

// Every other crux and every grade-red --selfcheck fixture is graded with the WORKSPACE's pinned
// typescript + vitest, so the target's own toolchain is never exercised and the gate's real failure
// modes stay invisible. That structural gap is what let both 2026-07-25 blockers through: a fresh
// worktree has no node_modules (so the differential typecheck silently degraded to a global
// compiler and stopped discriminating), and the runner was picked by substring-matching a PROSE
// field (so it was pinned to a runner that could not collect the produced test and the grade threw
// instead of classifying).
//
// This crux closes the gap rather than the two symptoms: it grades a FABRICATED runDir -- a
// hand-built meta.json + diff.patch, the same two files a real capture contributes -- end to end
// against the kata's real toolchain, at zero spend. The fixture's spec is pinned under the
// vitest-collected dir on purpose, so the crux cannot pass unless the gate BOTH sees the toolchain
// AND routes to a runner whose collection config includes that path.
function gradeFabricatedRunDir(suiteDir, fixtureName, assertGrade) {
  const ctx = loadSuiteCtx(suiteDir);
  const fixture = join(HERE, 'fixtures', fixtureName);

  // Mirror crux 3's SKIP-if-absent discipline: the metered run is gated anyway, and a missing
  // borrowed repo must not fail the whole battery. This has to come BEFORE any join(ctx.repo, ...)
  // -- join(undefined, ...) throws a TypeError and takes the whole battery down instead of
  // printing the SKIP, which made the !ctx.repo half of the guard unreachable.
  if (!ctx.repo || !fs.existsSync(ctx.repo)) {
    console.log(`  [crux 7:${fixtureName}] SKIP -- target repo not on disk (${ctx.repo})`);

    return;
  }

  const realNodeModules = join(ctx.repo, 'node_modules');

  if (!fs.existsSync(realNodeModules)) {
    console.log(
      `  [crux 7:${fixtureName}] SKIP -- ${ctx.repo} has no node_modules (${realNodeModules}); install the target's ` +
        'dependencies there to exercise it',
    );

    return;
  }

  if (!fs.existsSync(fixture)) {
    fail(`[crux 7:${fixtureName}] fixture dir missing: ${fixture}`);
  }

  // Never grade the committed fixture in place -- gradeRun writes red-grade.json into the runDir.
  const runDir = join(os.tmpdir(), `red-canary-${fixtureName}-${process.pid}-${Date.now()}`);
  fs.cpSync(fixture, runDir, { recursive: true });

  let grade;

  try {
    grade = gradeRun({ runDir, suiteDir });
  } catch (err) {
    // Clean up BEFORE failing: fail() calls process.exit(1), which does not unwind the stack, so a
    // finally here would never run and every failed canary would leave a directory behind.
    fs.rmSync(runDir, { recursive: true, force: true });
    fail(`[crux 7:${fixtureName}] gradeRun threw instead of producing a verdict: ${err.message}`);
  }

  fs.rmSync(runDir, { recursive: true, force: true });

  assertGrade(grade);

  // T-63f-01 / T-63f-05: grading reads the target's real node_modules to build its own copy, and
  // it used to LINK that directory instead, which made teardown ordering a data-loss boundary
  // rather than a style point. Keep asserting the borrowed repo survived: this is the outcome the
  // whole containment exists for, and it must not depend on remembering which mechanism is in use.
  if (!fs.existsSync(realNodeModules)) {
    fail(`[crux 7:${fixtureName}] the target's real node_modules is GONE after grading (${realNodeModules})`);
  }

  const porcelain = (git(ctx.repo, ['status', '--porcelain']).stdout || '').trim();

  if (porcelain) {
    fail(`[crux 7:${fixtureName}] ${ctx.repo} not clean after grading: ${porcelain}`);
  }

  const worktrees = git(ctx.repo, ['worktree', 'list']).stdout || '';

  if (/red-wt-/.test(worktrees)) {
    fail(`[crux 7:${fixtureName}] leftover grading worktree after teardown:\n${worktrees}`);
  }

  // A grading worktree left behind on disk is now ~143 MB of toolchain copy rather than the
  // stranded link into the borrowed repo it used to be -- clutter instead of a hazard, but a
  // fan-out of nine would strand over a gigabyte of it. `git worktree list` above would not notice
  // one that git had already pruned.
  const stranded = fs.readdirSync(os.tmpdir()).filter((e) => e.startsWith('red-wt-'));

  if (stranded.length) {
    fail(`[crux 7:${fixtureName}] stranded grading worktree director(ies) under the temp dir: ${stranded.join(', ')}`);
  }

  // gradeRun installs SIGINT/SIGTERM handlers so an interrupted fan-out cleans its toolchain up.
  // They are per-run and must not accumulate across the 9 runs of a fan-out. (This assertion does
  // NOT exercise the signal path -- see the withdrawn IM-04 coverage claim in REVIEW-FIX.md; it
  // only pins that the handlers are removed again.)
  for (const signal of ['SIGINT', 'SIGTERM']) {
    if (process.listenerCount(signal) !== 0) {
      fail(`[crux 7:${fixtureName}] gradeRun leaked a ${signal} handler (${process.listenerCount(signal)} still registered)`);
    }
  }

  return grade;
}

// The GRC (kata) canaries. Kept in their OWN function, not merged into a loop over suites, for a
// containment reason rather than a style one.
//
// The GRC suite sets requireExplicitApplyBase, so these four calls need E2E_APPLY_BASE set. Setting
// it to 'main' is HONEST: a fabricated canary genuinely grades against the unarmed base and never
// touches the snapshot, and doing it explicitly makes that deliberate choice visible instead of
// implicit.
//
// The RESTORE is the load-bearing half. gradeRun resolves its base as
// `process.env.E2E_APPLY_BASE || suite.applyBase`, so a value that leaked past these calls would
// SILENTLY replace every OTHER suite's pinned SHA with 'main' -- grading the wrong commit, in the
// two suites whose whole point is a fixed pin, with no operator-visible signal. That is exactly the
// silent-failure class the requireExplicitApplyBase guard exists to eliminate, merely relocated.
// Scoping the variable to this function makes the leak structurally impossible rather than
// something to remember, which is why the sibling suites' canaries are a separate call and not the
// next iteration of a loop.
function checkGrcCanaries() {
  const hadKey = Object.prototype.hasOwnProperty.call(process.env, 'E2E_APPLY_BASE');
  const prior = process.env.E2E_APPLY_BASE;
  process.env.E2E_APPLY_BASE = 'main';

  try {
    runGrcCanaries();
  } finally {
    if (hadKey) {
      process.env.E2E_APPLY_BASE = prior;
    } else {
      delete process.env.E2E_APPLY_BASE;
    }
  }
}

function runGrcCanaries() {
  const grade = gradeFabricatedRunDir(RED_SUITE_DIR, 'canary-rundir', (g) => {
    if (g.verdict !== 'genuinely_red' || g.pass !== true) {
      fail(`[crux 7] fabricated runDir graded '${g.verdict}' (pass=${g.pass}), expected genuinely_red / pass=true -- why: ${g.why}`);
    }

    // The fixture's spec sits under the vitest-collected dir, so runner_select must route there.
    // A prose-sniffed or hardcoded runner picks the other one, cannot collect the spec, and the
    // grade throws before this line.
    if (g.runner !== 'vitest') {
      fail(`[crux 7] recorded runner '${g.runner}', expected 'vitest' for a spec under the vitest-collected dir`);
    }

    // The F1 pin. runner_version can only be read out of a node_modules the grading worktree can
    // actually see, so the 'unknown' sentinel means the toolchain was invisible and the
    // differential typecheck was not discriminating.
    if (!/^\d+\.\d+\.\d+/.test(String(g.runner_version || ''))) {
      fail(`[crux 7] runner_version is '${g.runner_version}', not a real version -- the grading worktree could not see the target's toolchain`);
    }

    if (g.new_tsc_errors !== 0) {
      fail(`[crux 7] fabricated runDir reported ${g.new_tsc_errors} NEW tsc errors, expected 0`);
    }

    // The audit trail must actually be populated, and it must record the base this canary really
    // used rather than a default someone assumed.
    if (g.apply_base !== 'main') {
      fail(`[crux 7] red-grade.json records apply_base ${JSON.stringify(g.apply_base)}, expected 'main' for a fabricated canary`);
    }

    // ATTRIBUTION against the TARGET's real runner. Everywhere else the attribution is asserted
    // over hand-built assertionResults, so this is the only step that proves the runner's actual
    // report carries a `title` the gate can tie back to the diff. If it did not, every real run
    // would grade `unattributable` and the whole eval would read as a model failure.
    const want = 'degrades in quality twice as fast as a normal item';

    if (!Array.isArray(g.added_test_titles) || !g.added_test_titles.includes(want)) {
      fail(`[crux 7] the gate did not extract the fixture's added test title from the diff: ${JSON.stringify(g.added_test_titles)}`);
    }

    if (g.attributed_failures !== 1) {
      fail(
        `[crux 7] the gate attributed ${g.attributed_failures} failure(s) to the added test, expected 1 -- ` +
          "the runner's reported titles are not matching the diff's",
      );
    }

    if (!String(g.failure_excerpt || '').startsWith(`added test ${JSON.stringify(want)}:`)) {
      fail(`[crux 7] failure_excerpt does not name the ADDED test: ${JSON.stringify(String(g.failure_excerpt).slice(0, 120))}`);
    }
  });

  if (grade) {
    console.log(
      `  [crux 7] target-toolchain canary OK (fabricated runDir -> ${grade.verdict}, runner ${grade.runner}@${grade.runner_version}; ` +
        `${grade.attributed_failures} failure attributed to the ADDED test; kata intact, no leftover worktree)`,
    );
  }

  // The canary above is engineered to be genuinely_red, so it never reaches the stderr
  // disambiguation branch. This second fixture puts the produced spec OUTSIDE every collection
  // root, so the runner emits nothing usable on stdout and a recognized no-tests signal on stderr.
  // Without that branch the grade THROWS and no red-grade.json is written at all, which the
  // downstream tabulator then fails closed on -- so a run that merely landed in the wrong folder
  // takes the whole grade down instead of being counted honestly.
  const missGrade = gradeFabricatedRunDir(RED_SUITE_DIR, 'canary-nocollect', (g) => {
    if (g.verdict !== 'no_tests' || g.pass !== false) {
      fail(`[crux 7] uncollected spec graded '${g.verdict}' (pass=${g.pass}), expected no_tests / pass=false`);
    }

    if (!/no test/i.test(String(g.failure_excerpt || ''))) {
      fail(`[crux 7] no_tests excerpt does not carry the runner's own message: ${JSON.stringify(g.failure_excerpt)}`);
    }
  });

  if (missGrade) {
    console.log(
      `  [crux 7] uncollected-spec canary OK (${missGrade.verdict}, pass=${missGrade.pass}, excerpt ${JSON.stringify(String(missGrade.failure_excerpt).slice(0, 60))} -- a verdict, not a throw)`,
    );
  }

  // IM-02. The two canaries above are POSITIVE controls only: both expect new_tsc_errors === 0, so
  // neither would notice the differential silently ceasing to discriminate -- which is F1's actual
  // damage ("a produced test with blatant type errors grades as tsc-clean") and the whole reason
  // this task existed. runner_version is a proxy: it proves a node_modules was VISIBLE, not that
  // the typecheck can tell two inputs apart. This third fixture is the negative control: the same
  // fabricated-runDir shape, the same vitest-collected dir, one deliberate type error.
  const compileGrade = gradeFabricatedRunDir(RED_SUITE_DIR, 'canary-compile', (g) => {
    if (g.verdict !== 'compile_error' || g.pass !== false) {
      fail(`[crux 7] the type-broken spec graded '${g.verdict}' (pass=${g.pass}), expected compile_error / pass=false -- why: ${g.why}`);
    }

    if (!(g.new_tsc_errors > 0)) {
      fail(
        `[crux 7] the type-broken spec reported ${g.new_tsc_errors} NEW tsc errors. The differential is NOT ` +
          'discriminating, so D-06 clause 1 would pass any produced test',
      );
    }
  });

  if (compileGrade) {
    console.log(
      `  [crux 7] differential-discriminates canary OK (type-broken spec -> ${compileGrade.verdict}, ` +
        `${compileGrade.new_tsc_errors} NEW tsc errors against a clean baseline)`,
    );
  }

  // THE ATTRIBUTION ANTI-REGRESSION, against the real target. The three canaries above all write a
  // BRAND-NEW spec file, which is the one shape where "the file has a failing assertion" and "the
  // test the model added failed" happen to coincide -- so none of them can see the D-06 hole the
  // k=1 with_skill pilot exposed. This fixture reproduces that run's exact shape instead: it
  // APPENDS to the kata's own test/vitest/gilded-rose.spec.ts, which ships a permanently failing
  // `should foo` placeholder asserting 'fixme', and the test it appends PASSES on current code.
  //
  // So the file IS red and the produced test is a FALSE GREEN. Pre-attribution the gate answered
  // the file-level question, recorded the placeholder's "expected 'foo' to be 'fixme'" as the
  // failure_excerpt, and returned genuinely_red / pass:true. grade-red --selfcheck proves the same
  // discrimination purely; this proves it end to end through the kata's real vitest.
  const borrowedGrade = gradeFabricatedRunDir(RED_SUITE_DIR, 'canary-borrowed', (g) => {
    if (g.verdict !== 'false_green' || g.pass !== false) {
      fail(
        `[crux 7] a PASSING test appended to a spec that already contains a failing one graded ` +
          `'${g.verdict}' (pass=${g.pass}), expected false_green / pass=false -- the borrowed-failure ` +
          `hole is open again. why: ${g.why}`,
      );
    }

    if (g.attributed_failures !== 0) {
      fail(`[crux 7] the gate attributed ${g.attributed_failures} failure(s) to a test that passed`);
    }

    // The excerpt is the field a human reads to sanity-check a verdict. It must SAY the failure it
    // is quoting is not the model's, rather than presenting a borrowed one as the produced RED.
    if (!/^PRE-EXISTING test /.test(String(g.failure_excerpt || ''))) {
      fail(`[crux 7] the excerpt presents a borrowed failure as the produced test's: ${JSON.stringify(String(g.failure_excerpt).slice(0, 160))}`);
    }
  });

  if (borrowedGrade) {
    console.log(
      `  [crux 7] borrowed-failure canary OK (a PASSING test appended to the kata's own failing spec -> ` +
        `${borrowedGrade.verdict}, pass=${borrowedGrade.pass}; excerpt ${JSON.stringify(String(borrowedGrade.failure_excerpt).slice(0, 48))})`,
    );
  }
}

// The SRVC (srvx) canaries -- the OUT-OF-DOMAIN control's half of crux 7.
//
// These exercise two mechanisms the kata's canaries structurally cannot reach, because the kata
// declares neither: the `<reportFile>` report source (srvx's runner writes its JSON to a file
// grade-red allocates, rather than to stdout) and `typecheck.prebuild` (srvx's public entry points
// resolve through a gitignored dist/, so an unbuilt worktree manufactures a module-resolution error
// for any produced test that imports them).
function checkSrvcCanaries() {
  // The POSITIVE control, and the discriminating check for typecheck.prebuild. The spec imports
  // the package's PUBLIC entry point on purpose: MEASURED 2026-07-26 in a throwaway at the pin,
  // WITHOUT the prebuild that import adds 2 NEW differential errors (TS2307 plus a knock-on
  // TS7006) and this canary would grade compile_error; WITH it the baseline is 0 and the same spec
  // adds 0. So deleting the prebuild flips this canary, which is what makes it a check rather than
  // a demonstration.
  const redGrade = gradeFabricatedRunDir(SRVX_SUITE_DIR, 'canary-srvc-red', (g) => {
    if (g.verdict !== 'genuinely_red' || g.pass !== true) {
      fail(
        `[crux 7:SRVC] the disciplined spec graded '${g.verdict}' (pass=${g.pass}), expected genuinely_red / ` +
          `pass=true -- why: ${g.why}. A compile_error here means typecheck.prebuild did not run: the public-entry ` +
          'import resolves through a gitignored dist/ that a fresh worktree does not have',
      );
    }

    if (g.runner !== 'vitest') {
      fail(`[crux 7:SRVC] recorded runner '${g.runner}', expected 'vitest'`);
    }

    // runner_version can only be read out of a node_modules the grading worktree can actually see,
    // so the 'unknown' sentinel means the toolchain was invisible and the differential typecheck
    // was not discriminating.
    if (!/^\d+\.\d+\.\d+/.test(String(g.runner_version || ''))) {
      fail(`[crux 7:SRVC] runner_version is '${g.runner_version}', not a real version -- the grading worktree could not see the target's toolchain`);
    }

    if (g.new_tsc_errors !== 0) {
      fail(`[crux 7:SRVC] the disciplined spec reported ${g.new_tsc_errors} NEW tsc errors, expected 0`);
    }

    // ATTRIBUTION through the `<reportFile>` path. Everywhere else the report arrives on stdout, so
    // this is the only step proving a FILE-sourced report still carries a title the gate can tie
    // back to the diff. If it did not, every real SRVC run would grade unattributable and read as a
    // model failure.
    const want = 'keeps a Set-Cookie header already set on the Node response';

    if (!Array.isArray(g.added_test_titles) || !g.added_test_titles.includes(want)) {
      fail(`[crux 7:SRVC] the gate did not extract the fixture's added test title from the diff: ${JSON.stringify(g.added_test_titles)}`);
    }

    if (g.attributed_failures !== 1) {
      fail(
        `[crux 7:SRVC] the gate attributed ${g.attributed_failures} failure(s) to the added test, expected 1 -- ` +
          "the runner's reported titles are not matching the diff's",
      );
    }

    if (!String(g.failure_excerpt || '').startsWith(`added test ${JSON.stringify(want)}:`)) {
      fail(`[crux 7:SRVC] failure_excerpt does not name the ADDED test: ${JSON.stringify(String(g.failure_excerpt).slice(0, 140))}`);
    }

    // The prebuild is a real per-grade cost, so it must be recorded rather than invisible.
    if (!(g.prebuild_ms > 0)) {
      fail(`[crux 7:SRVC] prebuild_ms is ${g.prebuild_ms}; the target declares a typecheck.prebuild, so it must have run and been timed`);
    }

    // THE LEAK CHECK, and the reason apply_base is worth recording. checkGrcCanaries() sets
    // E2E_APPLY_BASE=main for its four calls; gradeRun resolves the base as
    // `process.env.E2E_APPLY_BASE || suite.applyBase`, so if that value survived its finally this
    // grade would silently have run against the KATA's base instead of this suite's pin -- and
    // every other field would look identical. This assertion is what turns that from a silent
    // wrong number into a failure.
    const pinned = loadSuiteCtx(SRVX_SUITE_DIR).applyBase;

    if (g.apply_base !== pinned) {
      fail(
        `[crux 7:SRVC] this grade ran against apply_base ${JSON.stringify(g.apply_base)}, not the suite's pin ` +
          `${JSON.stringify(pinned)}. E2E_APPLY_BASE leaked out of checkGrcCanaries(), so the wrong commit was graded`,
      );
    }
  });

  if (redGrade) {
    console.log(
      `  [crux 7:SRVC] out-of-domain canary OK (${redGrade.verdict}, runner ${redGrade.runner}@${redGrade.runner_version} via ` +
        `<reportFile>; ${redGrade.attributed_failures} failure attributed to the ADDED test; prebuild ${redGrade.prebuild_ms} ms, ` +
        `toolchain copy ${redGrade.toolchain_ms} ms; srvx intact, no leftover worktree)`,
    );
  }

  // The NEGATIVE control. Without it nothing would notice this target's differential ceasing to
  // discriminate -- and its args differ from the default (--skipLibCheck), so the GRC compile
  // canary does not cover them.
  const compileGrade = gradeFabricatedRunDir(SRVX_SUITE_DIR, 'canary-srvc-compile', (g) => {
    if (g.verdict !== 'compile_error' || g.pass !== false) {
      fail(`[crux 7:SRVC] the type-broken spec graded '${g.verdict}' (pass=${g.pass}), expected compile_error / pass=false -- why: ${g.why}`);
    }

    if (!(g.new_tsc_errors > 0)) {
      fail(
        `[crux 7:SRVC] the type-broken spec reported ${g.new_tsc_errors} NEW tsc errors. The differential is NOT ` +
          "discriminating under this target's own typecheck args, so D-06 clause 1 would pass any produced test",
      );
    }
  });

  if (compileGrade) {
    console.log(
      `  [crux 7:SRVC] differential-discriminates canary OK (type-broken spec -> ${compileGrade.verdict}, ` +
        `${compileGrade.new_tsc_errors} NEW tsc errors against a clean post-prebuild baseline)`,
    );
  }
}

function checkTargetToolchainCanary() {
  checkGrcCanaries();
  checkSrvcCanaries();
}

// ---- crux 10: anchor arming + the unstated-base guard -----------------------------------------
//
// Two things the operator relies on, both proved WITHOUT a toolchain and without a metered
// anything:
//
//   (a) gradeRun REFUSES to grade a requireExplicitApplyBase suite when E2E_APPLY_BASE is unset,
//       and grades normally when it is set. Without the guard the unset case silently graded the
//       armed round against the UNARMED base -- no throw, no warning, a plausible-looking number.
//   (b) arm-anchor.mjs --verify DISCRIMINATES: it fails on an unarmed throwaway and passes on an
//       armed one, and leaves the borrowed kata pristine either way.
//
// The auto-write behavior itself is NOT asserted here -- it is a MEASUREMENT, recorded in
// arm-anchor.mjs's header (vitest 0.28.5: 2 snapshots written, exit 0, outside --ci). What this
// crux tests is the verifier's logic and the guard, which are the parts an operator's round rests
// on.
function checkApplyBaseGuard() {
  const fixture = join(HERE, 'fixtures', 'canary-rundir');
  const hadKey = Object.prototype.hasOwnProperty.call(process.env, 'E2E_APPLY_BASE');
  const prior = process.env.E2E_APPLY_BASE;
  delete process.env.E2E_APPLY_BASE;

  try {
    // The runDir is a copy so nothing is written into the committed fixture -- though with the
    // guard in place gradeRun throws before it creates anything at all, which is the point of
    // putting the check first.
    const runDir = join(os.tmpdir(), `red-crux10-${process.pid}-${Date.now()}`);
    fs.cpSync(fixture, runDir, { recursive: true });

    let threw = null;

    try {
      gradeRun({ runDir, suiteDir: RED_SUITE_DIR });
    } catch (err) {
      threw = err;
    } finally {
      fs.rmSync(runDir, { recursive: true, force: true });
    }

    if (!threw) {
      fail(
        '[crux 10] gradeRun GRADED a requireExplicitApplyBase suite with E2E_APPLY_BASE unset. An armed round ' +
          'would be measured against the unarmed base with no signal at all',
      );
    }

    if (!/E2E_APPLY_BASE/.test(String(threw.message))) {
      fail(`[crux 10] the refusal does not name the variable an operator has to set: ${JSON.stringify(String(threw.message).slice(0, 200))}`);
    }
  } finally {
    if (hadKey) {
      process.env.E2E_APPLY_BASE = prior;
    } else {
      delete process.env.E2E_APPLY_BASE;
    }
  }

  console.log('  [crux 10] unstated-base guard OK (gradeRun REFUSES the GRC suite with E2E_APPLY_BASE unset, naming the variable)');
}

function checkAnchorArming() {
  const ctx = loadSuiteCtx(RED_SUITE_DIR);

  // SKIP-if-absent, matching cruxes 3 and 7: the metered run is gated anyway and a missing borrowed
  // repo must not fail the whole battery.
  if (!ctx.repo || !fs.existsSync(ctx.repo)) {
    console.log(`  [crux 10] SKIP -- kata repo not on disk (${ctx.repo})`);

    return;
  }

  const gitRoot = (git(ctx.repo, ['rev-parse', '--show-toplevel']).stdout || '').trim();

  if (!gitRoot) {
    console.log(`  [crux 10] SKIP -- ${ctx.repo} is not a git repo`);

    return;
  }

  const armScript = join(HERE, 'arm-anchor.mjs');
  const throwaway = join(os.tmpdir(), `red-arm-crux10-${process.pid}-${Date.now()}`);
  const rel = resolve(ctx.repo).slice(resolve(gitRoot).length + 1).split(/[\\/]/).filter(Boolean).join('/');
  const snapRootRel = `${rel ? `${rel}/` : ''}test/vitest/__snapshots__/approvals.spec.ts.snap`;

  const runArm = (mode) =>
    spawnSync(process.execPath, [armScript, mode, throwaway], { encoding: 'utf8', maxBuffer: 16 * 1024 * 1024 });

  // --detach: a named branch on the borrowed repo is out of bounds.
  gitOrFail(gitRoot, ['worktree', 'add', '--detach', throwaway, 'main'], '[crux 10] worktree add');

  try {
    const unarmed = runArm('--verify');

    if (unarmed.status === 0) {
      fail(`[crux 10] --verify PASSED on an UNARMED throwaway, so it cannot tell armed from unarmed:\n${unarmed.stdout}`);
    }

    if (!/snapshot|not tracked|NOT ARMED/i.test(`${unarmed.stdout}${unarmed.stderr}`)) {
      fail(`[crux 10] --verify failed on the unarmed throwaway for an unrelated reason: ${(unarmed.stderr || '').trim().slice(0, 240)}`);
    }

    // Hand-create the snapshot and commit it BY NAME. Deliberately not via --arm: that needs a real
    // toolchain and a real runner invocation, which is a metered-scale cost for a check about
    // git-visible state. --arm is exercised at the gate, and its own steps assert the runner side.
    const snapAbs = join(throwaway, ...snapRootRel.split('/'));
    fs.mkdirSync(dirname(snapAbs), { recursive: true });
    fs.writeFileSync(
      snapAbs,
      '// Vitest Snapshot v1\n\nexports[`Gilded Rose Approval > should foo 1`] = `\n[\n  Item {\n    "name": "foo",\n    "quality": 0,\n    "sellIn": -1,\n  },\n]\n`;\n',
    );
    gitOrFail(throwaway, ['add', '--', snapRootRel], '[crux 10] stage the snapshot');
    gitOrFail(throwaway, ['commit', '-m', 'test: arm the approvals snapshot (crux 10 fixture)'], '[crux 10] commit the snapshot');

    const armed = runArm('--verify');

    if (armed.status !== 0) {
      fail(`[crux 10] --verify FAILED on an armed throwaway: ${(armed.stderr || '').trim().slice(0, 300)}`);
    }

    const sha = (git(throwaway, ['rev-parse', 'HEAD']).stdout || '').trim();

    if (!armed.stdout.includes(sha)) {
      fail(`[crux 10] --verify passed but did not print the armed SHA the operator has to export:\n${armed.stdout}`);
    }

    if (!/E2E_APPLY_BASE/.test(armed.stdout)) {
      fail(`[crux 10] --verify passed but did not print the E2E_APPLY_BASE export line:\n${armed.stdout}`);
    }

    console.log(
      `  [crux 10] anchor arming OK (--verify FAILS unarmed and PASSES armed, printing ${sha.slice(0, 8)} and the ` +
        'E2E_APPLY_BASE export line)',
    );
  } finally {
    fs.rmSync(throwaway, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    git(gitRoot, ['worktree', 'remove', '--force', throwaway]);
    git(gitRoot, ['worktree', 'prune']);
  }

  // The borrowed kata must be pristine afterwards.
  const porcelain = (git(gitRoot, ['status', '--porcelain']).stdout || '').trim();

  if (porcelain) {
    fail(`[crux 10] kata not clean after the arming probe: ${porcelain}`);
  }

  const worktrees = git(gitRoot, ['worktree', 'list']).stdout || '';

  if (/red-arm-crux10-/.test(worktrees)) {
    fail(`[crux 10] leftover arming worktree after teardown:\n${worktrees}`);
  }

  // Scoped to a GLOB, never a bare listing: the kata legitimately has `main`, so a bare
  // `git branch` would "find a leftover branch" in the fully correct end state. checkWorktreeBase()
  // uses the same idiom for review-*.
  const branches = (git(gitRoot, ['branch', '--list', 'red-*']).stdout || '').trim();

  if (branches) {
    fail(`[crux 10] leftover red-* branch after teardown (the throwaway must be --detach): ${branches}`);
  }

  console.log('  [crux 10] kata pristine after the arming probe OK (clean tree, no leftover worktree, no red-* branch)');
}

function checkAnchorArmingAndGuard() {
  // The guard first: it is pure, needs no borrowed repo, and costs nothing.
  checkApplyBaseGuard();
  checkAnchorArming();
}

// ---- crux 8: the measured 2026-07-25 steering exploits stay blocked ---------------------------

// Pure and offline: no kata, no runner, no worktree, so this crux never SKIPs. Each assertion
// pins ONE exploit that was reproduced against the real toolchain during the code review. Delete
// the corresponding guard in grade-red.mjs and exactly one of these fails.

// The caller supplies its OWN crux prefix in `label`, for the same reason gitOrFail() does: this
// helper is shared by more than one crux, and a hardcoded prefix attributes one crux's failure to
// another.
function expectThrows(fn, label) {
  let threw = false;

  try {
    fn();
  } catch {
    threw = true;
  }

  if (!threw) {
    fail(`${label}: expected the fail-closed path to throw, but it did not`);
  }
}

// assertSafeDiffPaths() reads the patch through `git apply --numstat`, so the exploit patches have
// to exist on disk. They are written to a throwaway temp dir and removed in the finally.
function withPatchFile(body, fn) {
  const p = join(os.tmpdir(), `red-crux8-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}.patch`);
  fs.writeFileSync(p, body);

  try {
    return fn(p);
  } finally {
    fs.rmSync(p, { force: true });
  }
}

function newFilePatch(targetPath, line) {
  return [
    `diff --git a/${targetPath} b/${targetPath}`,
    'new file mode 100644',
    'index 0000000..1111111',
    '--- /dev/null',
    `+++ b/${targetPath}`,
    '@@ -0,0 +1 @@',
    `+${line}`,
    '',
  ].join('\n');
}

function checkDiffContainment() {
  // T-63f-01, the DECLARED-PATH write direction. diff.patch is whatever the model under test
  // staged. MEASURED 2026-07-25 back when the grading worktree LINKED the kata's real node_modules:
  // with nothing constraining the paths, both a modify hunk and a new-file hunk under node_modules/
  // applied straight through the junction into the borrowed checkout. The junction is gone
  // (T-63f-05, crux 9) so that patch would now only reach a throwaway copy -- this crux pins the
  // FIRST layer, which must hold on its own and also covers '..' and '.git', neither of which the
  // copy has anything to do with.
  const exploits = {
    'new file under node_modules': newFilePatch('TypeScript/node_modules/.bin/EVIL.txt', 'pwned'),
    'modify under node_modules': [
      'diff --git a/TypeScript/node_modules/typescript/KEEP.txt b/TypeScript/node_modules/typescript/KEEP.txt',
      'index 1111111..2222222 100644',
      '--- a/TypeScript/node_modules/typescript/KEEP.txt',
      '+++ b/TypeScript/node_modules/typescript/KEEP.txt',
      '@@ -1 +1 @@',
      '-keep',
      '+PWNED',
      '',
    ].join('\n'),
    // `git apply --numstat` reports a rename by its DESTINATION only, so this one is invisible to
    // a numstat-only check and has to be caught in the raw header text.
    'rename OUT of node_modules': [
      'diff --git a/TypeScript/node_modules/typescript/KEEP.txt b/TypeScript/app/stolen.txt',
      'similarity index 100%',
      'rename from TypeScript/node_modules/typescript/KEEP.txt',
      'rename to TypeScript/app/stolen.txt',
      '',
    ].join('\n'),
    'traversal out of the worktree': newFilePatch('../escape.txt', 'escaped'),
    'write into git state': newFilePatch('TypeScript/.git/hooks/pre-commit', '#!/bin/sh'),
  };

  for (const [label, body] of Object.entries(exploits)) {
    withPatchFile(body, (p) => {
      expectThrows(() => assertSafeDiffPaths(body, p), `[crux 8] ${label}`);
    });
  }

  // ... and the shipped fixtures, which are real captures, must still pass. A containment check
  // that rejects legitimate input is just a broken gate.
  for (const fixtureName of ['canary-rundir', 'canary-nocollect', 'canary-compile', 'canary-borrowed']) {
    const p = join(HERE, 'fixtures', fixtureName, 'diff.patch');
    const body = fs.readFileSync(p, 'utf8');

    try {
      assertSafeDiffPaths(body, p);
    } catch (err) {
      fail(`[crux 8] the shipped ${fixtureName} diff was rejected by the containment check: ${err.message}`);
    }
  }

  // A production-file edit MUST still be allowed -- rejecting it would silently kill the
  // drove_to_green class, which exists precisely to catch a model that edits production code.
  const prodPatch = newFilePatch('TypeScript/app/gilded-rose.ts', '// production edit');

  withPatchFile(prodPatch, (p) => {
    try {
      assertSafeDiffPaths(prodPatch, p);
    } catch (err) {
      fail(`[crux 8] a production-file diff was rejected, which would kill the drove_to_green class: ${err.message}`);
    }
  });

  console.log(
    `  [crux 8] captured-diff containment OK (${Object.keys(exploits).length} forbidden path shapes rejected; ` +
      'real captures and production edits still accepted)',
  );
}

// A jest error-path stderr: the reporter quotes the produced spec's own source as a CODE FRAME, so
// every byte after the header is text the model under test chose.
function jestCodeFrameStderr(sourceLines) {
  return [
    'FAIL test/jest/produced.spec.ts',
    '  * Test suite failed to run',
    '',
    '    Cannot find module \'@/nope\' from \'test/jest/produced.spec.ts\'',
    '',
    ...sourceLines.map((l, i) => `      ${i + 1} | ${l}`),
    '        | ^',
    '      at Resolver._throwModNotFoundError (node_modules/jest-resolve/build/resolver.js:427:11)',
    '',
  ].join('\n');
}

function checkRunnerSignalIsRunnerAuthored() {
  // CR-02. The no-tests widening tested a suite-level pattern against the FULL stdout+stderr, and
  // both runners echo the produced spec's source on their error paths -- so the model under test
  // could steer its own verdict. MEASURED 2026-07-25: a spec whose only comment reads
  // "// no tests found" plus process.exit(0) kills jest before it writes a byte of JSON, exits 0,
  // and the gate synthesised a no_tests verdict out of jest's echo of that comment.
  const steer = {
    stdout: '',
    status: 0,
    stderr: jestCodeFrameStderr(['// no tests found', 'process.exit(0);']),
  };

  expectThrows(() => parseRunnerReport(steer), '[crux 8] a spec comment reading "no tests found" must not become a verdict');

  // The same echo with a non-zero exit: still only a code frame, still not the runner's status line.
  expectThrows(
    () => parseRunnerReport({ ...steer, status: 1 }),
    '[crux 8] an echoed "no tests found" comment must not become a verdict even on a non-zero exit',
  );

  // A test TITLE carrying the phrase is the realistic version of the same steer.
  expectThrows(
    () => parseRunnerReport({
      stdout: '',
      status: 1,
      stderr: jestCodeFrameStderr(["describe('x', () => {", "  it('says no tests found when empty', () => {})", '});']),
    }),
    '[crux 8] a test title reading "no tests found" must not become a verdict',
  );

  // Infrastructure failures are not verdicts either, whatever text happens to be on the streams.
  expectThrows(
    () => parseRunnerReport({
      stdout: '',
      status: null,
      error: Object.assign(new Error('spawn npx ENOENT'), { code: 'ENOENT' }),
      stderr: 'No tests found, exiting with code 1',
    }),
    '[crux 8] a spawn failure must throw, not synthesise a verdict',
  );
  expectThrows(
    () => parseRunnerReport({
      stdout: '{"testResults":[{"assertionRes',
      status: 1,
      stderr: 'No tests found, exiting with code 1',
    }),
    '[crux 8] a TRUNCATED stdout payload must throw, not synthesise a verdict',
  );

  // ... and the genuine collection miss still becomes an honest verdict rather than a crash. Both
  // of the kata's runners print their status line unindented, with a 0-byte stdout and exit 1.
  for (const sentinel of ['No tests found, exiting with code 1', 'No test files found, exiting with code 1']) {
    const report = parseRunnerReport({ stdout: '', status: 1, stderr: `${sentinel}\n` });
    const verdict = classify({ newErrors: 0 }, report, 'diff --git a/t.spec.ts b/t.spec.ts\n+++ b/t.spec.ts\n');

    if (verdict !== 'no_tests') {
      fail(`[crux 8] the runner's own status line ${JSON.stringify(sentinel)} classified '${verdict}', expected 'no_tests'`);
    }
  }

  console.log('  [crux 8] no-tests signal is runner-authored OK (5 model-steered/infrastructure cases throw; both real status lines classify)');
}

function checkConfigLevelTscGuard() {
  // IM-01/IM-02. The vacuous-differential guard is the fail-closed backstop for D-06 clause 1 and
  // it shipped with no check at all, so a typo in it would be silent. Every line below was MEASURED
  // against the kata's own tsc 4.9.5 on 2026-07-25.
  //
  // Must NOT fire: ordinary file-scoped diagnostics that happen to sit in the TS6xxx MESSAGE range.
  // They do not abort the compile, so treating them as a config abort would kill every grade for
  // any target that sets --noUnusedLocals and has one unused local in its pre-existing source.
  const sourceDiagnostics = [
    "probe.ts(1,1): error TS6192: All imports in import declaration are unused.",
    "probe.ts(4,9): error TS6133: 'unusedLocal' is declared but its value is never read.",
    "probe.ts(5,10): error TS6133: 'a' is declared but its value is never read.",
    "app/gilded-rose.ts(12,3): error TS2420: Class incorrectly implements interface.",
  ];

  for (const line of sourceDiagnostics) {
    if (isConfigLevelTscError(line)) {
      fail(`[crux 8] the vacuous-differential guard fires on an ordinary source diagnostic: ${line}`);
    }
  }

  // MUST fire: an option-level diagnostic (no file prefix) or one anchored at the tsconfig. Both
  // abort before any source is checked, so the differential would report every produced test as
  // tsc-clean. These are the two shapes this audit actually produced.
  const configAborts = [
    "error TS6046: Argument for '--lib' option must be: 'es5', 'es6', ... 'es2022', 'esnext'.",
    "error TS5023: Unknown compiler option '--nope'.",
    "tsconfig.json(4,15): error TS5107: Option 'target=ES5' is deprecated and will stop functioning in TypeScript 7.0.",
    "tsconfig.json(8,5): error TS5101: Option 'baseUrl' is deprecated.",
  ];

  for (const line of configAborts) {
    if (!isConfigLevelTscError(line)) {
      fail(`[crux 8] the vacuous-differential guard MISSES a config-layer abort, so the gate would grade on a differential that cannot discriminate: ${line}`);
    }
  }

  console.log(
    `  [crux 8] vacuous-differential guard OK (${sourceDiagnostics.length} ordinary diagnostics ignored, ` +
      `${configAborts.length} config-layer aborts caught)`,
  );
}

function checkNoTestsDisambiguationIsRunnerAuthored() {
  // CR-03. Same root cause one layer down: classify() splits no_tests from collection_error on
  // testResults[0].message, and jest embeds the failing file's CODE FRAME in that field. MEASURED
  // 2026-07-25 with an identical import-time throw in all three cases, only the spec's text
  // differing: a source comment saying "no tests found" and a test title reading
  // "says no tests found when empty" BOTH flipped collection_error to no_tests.
  const testOnlyDiff = 'diff --git a/test/vitest/x.spec.ts b/test/vitest/x.spec.ts\n+++ b/test/vitest/x.spec.ts\n';
  const importThrow = (sourceLines) => ({
    testResults: [
      {
        status: 'failed',
        message: [
          '* Test suite failed to run',
          '',
          "    Cannot find module '@/nope' from 'test/jest/produced.spec.ts'",
          '',
          ...sourceLines.map((l, i) => `      ${i + 1} | ${l}`),
          '        | ^',
        ].join('\n'),
        assertionResults: [],
      },
    ],
  });

  const steers = {
    'source comment echoed in the code frame': ['// no tests found', "import { thing } from '@/nope';"],
    'test title echoed in the code frame': ["describe('x', () => {", "  it('says no tests found when empty', () => {})", '});'],
    'suite sentence echoed in the code frame': ['// Your test suite must contain at least one test.'],
  };

  for (const [label, sourceLines] of Object.entries(steers)) {
    const verdict = classify({ newErrors: 0 }, importThrow(sourceLines), testOnlyDiff);

    if (verdict !== 'collection_error') {
      fail(`[crux 8] a ${label} classified '${verdict}', expected 'collection_error' -- the produced spec is steering its own verdict`);
    }
  }

  // ... and each runner's OWN suite-level sentence still reaches no_tests.
  const genuine = {
    jest: 'Your test suite must contain at least one test.',
    vitest: 'No test found in suite D:/repo/test/vitest/x.spec.ts',
    'synthesised collection miss': 'No tests found, exiting with code 1',
  };

  for (const [runner, message] of Object.entries(genuine)) {
    const verdict = classify({ newErrors: 0 }, { testResults: [{ status: 'failed', message, assertionResults: [] }] }, testOnlyDiff);

    if (verdict !== 'no_tests') {
      fail(`[crux 8] the genuine ${runner} no-tests message classified '${verdict}', expected 'no_tests'`);
    }
  }

  console.log(
    `  [crux 8] no_tests disambiguation is runner-authored OK (${Object.keys(steers).length} code-frame steers stay collection_error; ` +
      `${Object.keys(genuine).length} genuine runner messages still classify)`,
  );
}

// ---- crux 9: the RUNTIME write path is CONTAINED, not merely detected (T-63f-05) --------------

// grade-red spawns the TARGET'S RUNNER ON THE MODEL-AUTHORED SPEC. Until 2026-07-25 the grading
// worktree reached its toolchain through a junction into the borrowed repo, which made that spawn a
// live write path into a third-party checkout -- and assertSafeDiffPaths(), crux 8's subject, could
// not see it, because it scans DECLARED PATHS ONLY and never hunk CONTENT. MEASURED: a patch
// declaring a perfectly legitimate `<subdir>/test/vitest/*.spec.ts` whose BODY deletes and
// overwrites through `node_modules/` was ACCEPTED, and executing it landed both writes in the real
// tree. Scanning bodies cannot close that -- the runner executes arbitrary model-authored code, so
// any fs call can be obfuscated past a content scan -- so the fix is structural: the toolchain is a
// per-grade DISPOSABLE COPY, and the damage lands on a throwaway that teardown deletes.
//
// This crux pins the property end to end, with the exploit graded for real. The stand-in "borrowed
// repo" is a throwaway git repo under os.tmpdir() built to the kata's shape; the KATA IS NEVER THE
// PROBE TARGET, because a check that can only discriminate by damaging a borrowed repo is not a
// check worth having. Discrimination was measured instead by replaying this same probe through the
// pre-fix module loaded out of git: junction -> SENTINEL "PWNED" and the victim package deleted;
// copy -> both byte-intact, same `genuinely_red` verdict either way.

const T63F05_SENTINEL = 'DO-NOT-TOUCH-ME';
const T63F05_MARKER = 'T63F05-SPEC-EXECUTED';

// The caller supplies its OWN crux prefix in `label`: this helper is shared by cruxes 9 and 10, and
// a hardcoded prefix would attribute one crux's git failure to the other.
function gitOrFail(cwd, args, label) {
  const r = git(cwd, args);

  if (r.status !== 0) {
    fail(`${label}: git ${args.join(' ')} failed in ${cwd}: ${(r.stderr || '').trim()}`);
  }

  return r;
}

// A throwaway stand-in for the borrowed repo: a git repo with a `TypeScript/` subdir (the kata's
// shape, so `rel` is exercised), a real toolchain, and the two things the exploit attacks.
function buildStandInRepo() {
  const root = join(os.tmpdir(), `red-t63f05-${process.pid}-${Date.now()}`);
  const sub = join(root, 'TypeScript');
  fs.mkdirSync(join(sub, 'app'), { recursive: true });
  fs.mkdirSync(join(sub, 'test', 'vitest'), { recursive: true });

  fs.writeFileSync(join(root, '.gitignore'), 'node_modules/\n');
  fs.writeFileSync(join(sub, 'package.json'), `${JSON.stringify({ name: 'red-t63f05', private: true, type: 'module' }, null, 2)}\n`);
  fs.writeFileSync(
    join(sub, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: { target: 'es2021', module: 'esnext', moduleResolution: 'bundler', skipLibCheck: true, noEmit: true },
        include: ['app', 'test', 'types.d.ts'],
      },
      null,
      2,
    )}\n`,
  );
  // Just enough ambient typing for the spec below to be tsc --strict CLEAN, so the exploit arrives
  // as an ordinary-looking test rather than as a compile error the gate would flag anyway.
  fs.writeFileSync(
    join(sub, 'types.d.ts'),
    [
      "declare module 'node:fs' {",
      '  export function rmSync(target: unknown, options?: { recursive?: boolean; force?: boolean }): void;',
      '  export function writeFileSync(target: unknown, data: string): void;',
      '}',
      '',
    ].join('\n'),
  );
  fs.writeFileSync(join(sub, 'app', 'thing.ts'), 'export function thing(): number {\n  return 1;\n}\n');
  fs.writeFileSync(join(sub, 'test', 'vitest', '.gitkeep'), '');

  gitOrFail(root, ['init', '-q'], '[crux 9] stand-in init');
  gitOrFail(root, ['add', '.gitignore', 'TypeScript'], '[crux 9] stand-in add');
  // A throwaway identity, so the probe never depends on (or writes) a real one.
  gitOrFail(root, ['-c', 'user.name=probe', '-c', 'user.email=probe', 'commit', '-q', '-m', 'stand-in base'], '[crux 9] stand-in commit');

  const base = (gitOrFail(root, ['rev-parse', 'HEAD'], '[crux 9] stand-in rev-parse').stdout || '').trim();
  // Take the toplevel in GIT'S form. os.tmpdir() can hand back an 8.3 short path while git reports
  // long, and resolveArmCwd() now (correctly) refuses that mismatch outright -- so the probe has to
  // be internally consistent or it would only ever exercise the new guard.
  const topLevel = (gitOrFail(root, ['rev-parse', '--show-toplevel'], '[crux 9] stand-in toplevel').stdout || '').trim();
  const repo = `${topLevel}/TypeScript`;

  // The stand-in's own node_modules: a working toolchain (the workspace's, so the runner really
  // runs) plus a sentinel file and a victim package for the exploit to attack.
  const nodeModules = join(sub, 'node_modules');
  fs.cpSync(join(HERE, 'node_modules'), nodeModules, { recursive: true });
  fs.writeFileSync(join(nodeModules, 'SENTINEL.txt'), T63F05_SENTINEL);
  fs.mkdirSync(join(nodeModules, 'victim'), { recursive: true });
  fs.writeFileSync(join(nodeModules, 'victim', 'package.json'), '{"name":"victim","version":"1.0.0"}\n');

  const suiteDir = join(root, 'suite');
  fs.mkdirSync(suiteDir, { recursive: true });
  fs.writeFileSync(join(suiteDir, 'suite.json'), `${JSON.stringify({ name: 'red-t63f05', repo, applyBase: base }, null, 2)}\n`);
  fs.writeFileSync(
    join(suiteDir, 'targets.json'),
    `${JSON.stringify(
      {
        targets: [
          {
            id: 'T63F05',
            runner: {
              vitest: 'npx vitest run <producedTestFile> --reporter=json',
              runner_select: { 'test/vitest/': 'vitest' },
              runner_default: 'vitest',
            },
          },
        ],
      },
      null,
      2,
    )}\n`,
  );

  return { root, nodeModules, suiteDir };
}

// The exploit, as a fabricated runDir: ONE declared path that every containment check accepts, and
// a body that writes through the toolchain. The paths are resolved from `import.meta.url` rather
// than from the cwd so the write target is the worktree's own node_modules by construction.
function buildExploitRunDir(root) {
  const specPath = 'TypeScript/test/vitest/conjured.spec.ts';
  const specLines = [
    "import { describe, expect, it } from 'vitest';",
    "import { rmSync, writeFileSync } from 'node:fs';",
    '',
    'const toolchain = (name: string) => new URL(`../../node_modules/${name}`, import.meta.url);',
    '',
    "describe('conjured items', () => {",
    "  it('degrade twice as fast', () => {",
    "    rmSync(toolchain('victim'), { recursive: true, force: true });",
    "    writeFileSync(toolchain('SENTINEL.txt'), 'PWNED');",
    `    expect('${T63F05_MARKER}').toBe('${T63F05_MARKER}-NOT');`,
    '  });',
    '});',
  ];
  const runDir = join(root, 'runDir');
  fs.mkdirSync(runDir, { recursive: true });
  fs.writeFileSync(
    join(runDir, 'diff.patch'),
    [
      `diff --git a/${specPath} b/${specPath}`,
      'new file mode 100644',
      'index 0000000..1111111',
      '--- /dev/null',
      `+++ b/${specPath}`,
      `@@ -0,0 +1,${specLines.length} @@`,
      ...specLines.map((l) => `+${l}`),
      '',
    ].join('\n'),
  );
  fs.writeFileSync(
    join(runDir, 'meta.json'),
    `${JSON.stringify(
      { prompt_id: 't63f05', target: 'T63F05', arm: 'probe', run_idx: 1, changed_files: [specPath] },
      null,
      2,
    )}\n`,
  );

  return runDir;
}

function checkRuntimeWriteContainment() {
  // The stand-in needs a real runner, and the only one guaranteed on disk is the workspace's own.
  // SKIP loudly rather than fail if it is missing -- but a SKIP is NOT a pass, and `npm ci` here is
  // required by `grade-red.mjs --selfcheck` anyway, so the six-command battery never skips this.
  if (!fs.existsSync(join(HERE, 'node_modules', 'vitest'))) {
    console.log(
      `  [crux 9] SKIP -- no workspace toolchain at ${join(HERE, 'node_modules')} (npm ci here first); ` +
        'a SKIP is not a pass, the runtime write path is simply unmeasured',
    );

    return;
  }

  const standIn = buildStandInRepo();
  const runDir = buildExploitRunDir(standIn.root);
  const sentinelPath = join(standIn.nodeModules, 'SENTINEL.txt');
  const victimPath = join(standIn.nodeModules, 'victim');

  let grade;
  let threw;

  try {
    grade = gradeRun({ runDir, suiteDir: standIn.suiteDir });
  } catch (err) {
    threw = err;
  }

  // Read the evidence BEFORE cleaning up, and clean up BEFORE any fail(): fail() exits without
  // unwinding, so a later cleanup would never run and every failed probe would leak ~60 MB.
  const sentinel = fs.existsSync(sentinelPath) ? fs.readFileSync(sentinelPath, 'utf8') : '<DELETED>';
  const victimSurvived = fs.existsSync(victimPath);
  const excerpt = String((grade && grade.failure_excerpt) || '');
  const stranded = fs.readdirSync(os.tmpdir()).filter((e) => e.startsWith('red-wt-'));
  fs.rmSync(standIn.root, { recursive: true, force: true });

  if (threw) {
    fail(`[crux 9] gradeRun threw instead of grading the exploit spec: ${threw.message}`);
  }

  // The containment only means anything if the hostile spec actually EXECUTED. The marker is the
  // spec's own assertion text, and the writes above it run first, so seeing it proves the runner
  // reached and passed the two fs calls.
  if (!excerpt.includes(T63F05_MARKER)) {
    fail(
      `[crux 9] the exploit spec did not run (no ${T63F05_MARKER} in the failure excerpt), so the ` +
        `containment was never exercised: verdict ${grade.verdict}, excerpt ${JSON.stringify(excerpt.slice(0, 200))}`,
    );
  }

  // THE PROPERTY. Pre-fix this read "PWNED" and the victim package was gone.
  if (sentinel !== T63F05_SENTINEL) {
    fail(
      `[crux 9] the produced spec WROTE THROUGH into the stand-in borrowed repo: SENTINEL.txt is ` +
        `${JSON.stringify(sentinel)}, expected ${JSON.stringify(T63F05_SENTINEL)}. The grading worktree's ` +
        'toolchain is reaching the real tree again (T-63f-05)',
    );
  }

  if (!victimSurvived) {
    fail(
      '[crux 9] the produced spec DELETED a package from the stand-in borrowed repo through the ' +
        "grading worktree's toolchain (T-63f-05)",
    );
  }

  if (stranded.length) {
    fail(`[crux 9] stranded grading worktree director(ies) under the temp dir: ${stranded.join(', ')}`);
  }

  console.log(
    `  [crux 9] runtime write path contained OK (a legit-path spec whose body deletes + overwrites ` +
      `through node_modules ran to its assertion -> ${grade.verdict}; stand-in tree byte-intact, ` +
      `toolchain copied in ${grade.toolchain_ms} ms)`,
  );
}

function checkContainmentInvariants() {
  // escapingLinks() is what stops a copied toolchain from smuggling the old junction back in:
  // fs.cpSync copies a symlink AS a symlink, so a source tree containing one would hand the copy a
  // path straight back out of the worktree. Pure, offline, and it never SKIPs.
  const probe = join(os.tmpdir(), `red-links-${process.pid}-${Date.now()}`);
  const inside = join(probe, 'copy', 'pkg');
  const outside = join(probe, 'borrowed');
  const containedLink = join(probe, 'copy', 'contained-link');
  fs.mkdirSync(join(inside, 'sub'), { recursive: true });
  fs.mkdirSync(outside, { recursive: true });

  let escapes;
  let linkError;
  let alias;

  try {
    // 'junction' is the Windows-safe directory link (a plain symlink needs elevation there); the
    // type argument is ignored elsewhere.
    fs.symlinkSync(inside, containedLink, 'junction');
    fs.symlinkSync(outside, join(probe, 'copy', 'escaping-link'), 'junction');
    escapes = escapingLinks(join(probe, 'copy'));

    // arm-anchor.mjs identifies a throwaway by REALPATH, not by string -- and that has only ever
    // been exercised INCIDENTALLY, because os.tmpdir() happens to hand back the 8.3 SHORT Windows
    // form on this machine while git reports its toplevel LONG. A guard whose only coverage is a
    // coincidence of the local environment is one refactor away from being decoration, so the
    // identity is driven here by a SYNTHETIC alias instead: a junction and its target are two
    // different strings naming one directory, on any machine.
    alias = {
      rawDiffers: resolve(containedLink) !== resolve(inside),
      same: isSameOrNested(containedLink, inside),
      nested: isSameOrNested(join(containedLink, 'sub'), inside),
      unrelated: isSameOrNested(outside, inside),
    };
  } catch (err) {
    linkError = err;
  }

  fs.rmSync(probe, { recursive: true, force: true });

  if (linkError) {
    fail(`[crux 9] could not build the link probe: ${linkError.message}`);
  }

  if (escapes.length !== 1 || !escapes[0].includes('escaping-link')) {
    fail(
      `[crux 9] escapingLinks() reported ${JSON.stringify(escapes)}; expected exactly the one link ` +
        'resolving outside the copy (a contained link must NOT be flagged, an escaping one MUST be)',
    );
  }

  // The discrimination first: if the two strings were already equal, everything below would pass
  // without the realpath ever being consulted.
  if (!alias.rawDiffers) {
    fail('[crux 9] the alias probe is not exercising anything -- the junction and its target are the same string');
  }

  if (!alias.same || !alias.nested) {
    fail(
      `[crux 9] arm-anchor's isSameOrNested() did not recognise a junction as its target ` +
        `(same=${alias.same}, nested=${alias.nested}). It is comparing STRINGS, so it would refuse a valid ` +
        'throwaway and, worse, let an aliased path slip past the pristine-checkout containment check',
    );
  }

  if (alias.unrelated) {
    fail("[crux 9] arm-anchor's isSameOrNested() claimed an unrelated sibling directory is nested inside the target");
  }

  // resolveArmCwd() is the other half: `rel` is arithmetic over two path strings, and if they
  // disagree on form (git's long toplevel vs an 8.3 short suite.repo -- what os.tmpdir() hands back
  // on this machine) the join normalises straight back onto the SOURCE checkout, putting the apply,
  // the runner spawn and teardown's recursive delete inside the borrowed repo. Same damage as the
  // junction, reached by arithmetic. Both directions asserted.
  const worktree = join(os.tmpdir(), 'red-wt-PROBE');
  const ok = resolveArmCwd(worktree, '/repo/root', '/repo/root/TypeScript');

  if (ok.rel !== 'TypeScript' || resolve(ok.armCwd) !== resolve(join(worktree, 'TypeScript'))) {
    fail(`[crux 9] resolveArmCwd() mangled an ordinary subdir target: ${JSON.stringify(ok)}`);
  }

  const flat = resolveArmCwd(worktree, '/repo/root', '/repo/root');

  if (flat.rel !== '' || resolve(flat.armCwd) !== resolve(worktree)) {
    fail(`[crux 9] resolveArmCwd() mangled a repo that IS its git root: ${JSON.stringify(flat)}`);
  }

  expectThrows(
    () => resolveArmCwd(worktree, '/long/form/root', '/short/form/root/TypeScript'),
    '[crux 9] a suite.repo that disagrees with the git toplevel must not resolve the grade back onto the source tree',
  );

  // ... and the SPECIFIC shape the guard was written for, spelled out rather than left to whatever
  // os.tmpdir() happens to return: an 8.3 SHORT Windows path against git's LONG one. The two
  // positive cases above are what keep this from being satisfied by a guard that simply always
  // throws.
  expectThrows(
    () => resolveArmCwd(worktree, 'C:\\Users\\LongUserName\\repo', 'C:\\Users\\LONGUS~1\\repo\\TypeScript'),
    '[crux 9] an 8.3 SHORT-form suite.repo against a LONG-form git toplevel must be refused',
  );

  console.log(
    '  [crux 9] containment invariants OK (escapingLinks flags the escaping link only; a junction and its ' +
      "target compare EQUAL through arm-anchor's realpath identity while an unrelated sibling does not; " +
      'resolveArmCwd keeps the grade inside the worktree and refuses a path-form mismatch, including an ' +
      'explicit 8.3 short-form one)',
  );
}

// ---- crux 6: lz-refactor nx-suite regression (D-11) -------------------------------------------

function checkNxRegression() {
  const stdout = dryRun(['--arm', 'all', '--prompt', 'p1']); // default suite = nx (no --suite)
  const arms = armMap(stdout);

  for (const name of ['no_skill', 'with_skill', 'invoke_skill']) {
    if (!arms[name]) {
      fail(`[crux 6] nx suite did not compose the ${name} arm (got: ${Object.keys(arms).join(', ')})`);
    }
  }

  if (arms.no_skill.indexOf('--plugin-dir') >= 0) {
    fail('[crux 6] nx no_skill must NOT have --plugin-dir');
  }

  for (const name of ['with_skill', 'invoke_skill']) {
    const plugin = flagValue(arms[name], '--plugin-dir') || '';

    if (!/[\\/]plugins[\\/]lz-tdd$/.test(plugin)) {
      fail(`[crux 6] nx ${name} --plugin-dir is not plugins/lz-tdd: ${JSON.stringify(plugin)}`);
    }
  }

  console.log('  [crux 6] nx regression OK (default lz-refactor suite still composes 3 arms with plugins/lz-tdd)');

  // The suite-level preamble override edits a file the lz-refactor suites drive, so pin their apply
  // preamble byte-for-byte. A suite that declares no override must compose the shared default
  // unchanged -- "confirm nothing broke" is the correct instruction for a behavior-preserving
  // refactoring, and every captured lz-refactor result was produced under exactly these bytes.
  const applyStdout = dryRun(['--mode', 'apply', '--cwd', HERE, '--arm', 'all', '--prompt', 'p1']);
  const applyArms = armMap(applyStdout);
  const nxApply = flagValue(applyArms.with_skill, '-p') || '';

  if (!nxApply.startsWith(DEFAULT_APPLY_PREAMBLE)) {
    fail(
      '[crux 6] the nx suite no longer composes the lz-refactor apply preamble byte-for-byte -- the shared ' +
        `default was edited instead of overridden per suite:\n  got     =${JSON.stringify(nxApply.slice(0, 260))}\n  expected=${JSON.stringify(DEFAULT_APPLY_PREAMBLE)}`,
    );
  }

  const nxApplyNoSkill = flagValue(applyArms.no_skill, '-p') || '';

  if (nxApplyNoSkill !== nxApply) {
    fail('[crux 6] nx apply mode: no_skill vs with_skill -p differ (must be byte-identical)');
  }

  console.log('  [crux 6] lz-refactor apply preamble unchanged OK (nx composes the shared default byte-for-byte; parity intact)');
}

// ---- run all -----------------------------------------------------------------------------------

checkCompositionAndParity();
checkWorktreeBase();
checkTranscriptParse();
checkClassifier();
checkAnchorArmingAndGuard();
checkTargetToolchainCanary();
checkDiffContainment();
checkRunnerSignalIsRunnerAuthored();
checkNoTestsDisambiguationIsRunnerAuthored();
checkConfigLevelTscGuard();
checkContainmentInvariants();
checkRuntimeWriteContainment();
checkNxRegression();

console.log(
  'selfcheck-red: OK -- composition, prompt-parity, worktree base, transcript parse, classifier, the ' +
    'target-toolchain canary, captured-diff containment, the runtime write path, and the lz-refactor ' +
    'nx regression all pass; zero claude spend, borrowed repo left pristine.',
);
process.exit(0);
