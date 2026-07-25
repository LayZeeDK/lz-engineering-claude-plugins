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
//   3. WORKTREE BASE -- buildSyntheticBase against the kata git root builds + tears down a worktree
//      leaving the borrowed repo pristine (git status clean, no leftover worktree/branch; Pitfall 6).
//      Kata unavailable -> SKIP (do not fail the whole selfcheck).
//   4. TRANSCRIPT PARSE -- the parameterized extractResult(raw, ['lz-red','lz-tpp']) reads a RED
//      transcript's used_skills keyed by the tracked names (gitignored -> SKIP if absent).
//   5. CLASSIFIER    -- grade-red's classify() classifies genuinely_red + false_green (thin re-assert;
//      grade-red --selfcheck is the full 7-class one).
//   6. REGRESSION    -- the DEFAULT nx suite still composes 3 arms with plugins/lz-tdd (the suite-driven
//      trackSkills edit did not break the lz-refactor suites; D-11).
//   7. TARGET TOOLCHAIN -- gradeRun over a FABRICATED runDir (hand-built meta.json + diff.patch)
//      against the kata's OWN toolchain: a real verdict, the selected runner, a real runner_version
//      (not the 'unknown' sentinel), and the borrowed repo intact afterwards. Every other crux and
//      every grade-red fixture uses the WORKSPACE toolchain, so this is the only step that proves
//      the gate works against the actual target. Kata absent -> SKIP. Three fixtures: a clean spec
//      (genuinely_red), one outside every collection root (no_tests, not a crash), and a
//      type-broken one (compile_error with NEW errors -- the negative control that proves the
//      differential still tells two inputs apart).
//   8. EXPLOIT REGRESSIONS -- the steering and write exploits measured against the real toolchain
//      on 2026-07-25 stay blocked: a captured diff cannot write into the borrowed repo through the
//      toolchain junction, the no-tests signal comes from the runner rather than from the produced
//      spec's own text, and the vacuous-differential guard ignores ordinary source diagnostics.
//      Pure and offline, so it never SKIPs.
//   9. RUNTIME WRITE PATH -- crux 8 covers what a captured diff DECLARES; this one covers what the
//      produced spec DOES when the runner executes it. A spec declaring a legitimate path whose
//      BODY deletes and overwrites through node_modules/ is graded for real against a THROWAWAY
//      stand-in repo (never the kata) and asserted to leave that tree byte-intact. Plus the two
//      pure invariants the containment rests on: escapingLinks() and resolveArmCwd().
//
// Fail-closed: any violation prints a FAIL line and exits 1; an OK line + exit 0 on success. Zero
// claude spend, borrowed repo left pristine. NOT wired into `npm run check` (it touches the borrowed
// repo); run it explicitly:  node selfcheck-red.mjs

import fs from 'node:fs';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { buildSyntheticBase, extractResult, git } from '../lz-refactor-workspace/e2e-nx/run-e2e.mjs';
import {
  assertSafeDiffPaths,
  classify,
  escapingLinks,
  gradeRun,
  isConfigLevelTscError,
  parseRunnerReport,
  resolveArmCwd,
} from './grade-red.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const RUN_E2E = resolve(HERE, '..', 'lz-refactor-workspace', 'e2e-nx', 'run-e2e.mjs');
const RED_SUITE_DIR = join(HERE, 'e2e-red-gilded-rose');

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

// ---- crux 1 + 2: composition + prompt-parity (RED suite, recommend, all arms) -----------------

function checkCompositionAndParity() {
  const stdout = dryRun(['--suite', RED_SUITE_DIR, '--mode', 'recommend', '--arm', 'all', '--prompt', 'r1']);
  const arms = armMap(stdout);

  for (const name of ['no_skill', 'with_skill', 'invoke_skill']) {
    if (!arms[name]) {
      fail(`[crux 1] dry-run did not compose the ${name} arm (got: ${Object.keys(arms).join(', ')})`);
    }
  }

  // no_skill: NO --plugin-dir (baseline).
  if (arms.no_skill.indexOf('--plugin-dir') >= 0) {
    fail('[crux 1] no_skill must NOT have --plugin-dir');
  }

  // with_skill: --plugin-dir ends with plugins/lz-tdd; -p is a natural prompt (no slash command).
  const wsPlugin = flagValue(arms.with_skill, '--plugin-dir') || '';

  if (!/[\\/]plugins[\\/]lz-tdd$/.test(wsPlugin)) {
    fail(`[crux 1] with_skill --plugin-dir is not plugins/lz-tdd: ${JSON.stringify(wsPlugin)}`);
  }

  const wsPrompt = flagValue(arms.with_skill, '-p') || '';

  if (wsPrompt.startsWith('/')) {
    fail(`[crux 1] with_skill -p must be a natural prompt (no leading slash command): ${JSON.stringify(wsPrompt.slice(0, 40))}`);
  }

  // invoke_skill: -p force-starts with the slash command.
  const isPrompt = flagValue(arms.invoke_skill, '-p') || '';

  if (!isPrompt.startsWith('/lz-tdd:lz-red ')) {
    fail(`[crux 1] invoke_skill -p must start with '/lz-tdd:lz-red ': ${JSON.stringify(isPrompt.slice(0, 40))}`);
  }

  const isPlugin = flagValue(arms.invoke_skill, '--plugin-dir') || '';

  if (!/[\\/]plugins[\\/]lz-tdd$/.test(isPlugin)) {
    fail(`[crux 1] invoke_skill --plugin-dir is not plugins/lz-tdd: ${JSON.stringify(isPlugin)}`);
  }

  console.log('  [crux 1] composition OK (no_skill: no plugin; with_skill: lz-tdd + natural prompt; invoke_skill: /lz-tdd:lz-red + lz-tdd)');

  // crux 2: prompt-parity (EVL-03.1). no_skill == with_skill byte-identical; invoke == prefix + with_skill.
  const nsPrompt = flagValue(arms.no_skill, '-p') || '';

  if (nsPrompt !== wsPrompt) {
    fail(`[crux 2] no_skill vs with_skill -p differ (must be byte-identical):\n  no_skill=${JSON.stringify(nsPrompt)}\n  with_skill=${JSON.stringify(wsPrompt)}`);
  }

  if (isPrompt !== '/lz-tdd:lz-red ' + wsPrompt) {
    fail(`[crux 2] invoke_skill -p is not with_skill -p + '/lz-tdd:lz-red ':\n  invoke=${JSON.stringify(isPrompt)}\n  expected=${JSON.stringify('/lz-tdd:lz-red ' + wsPrompt)}`);
  }

  console.log('  [crux 2] prompt-parity OK (no_skill == with_skill byte-identical; invoke_skill == "/lz-tdd:lz-red " + with_skill)');

  // The prompt must make NO claim about the current pass/fail state of the target's existing
  // tests. It used to open "The tests for `app/gilded-rose.ts` are all green right now", which is
  // measurably false -- both shipped placeholder specs fail on current code. A false premise
  // invites the model to repair the placeholder instead of adding a test, and a repair-only turn
  // grades false_green: a correctness failure manufactured by the instrument rather than by the
  // model. Guard the regression rather than trusting the file to stay fixed.
  //
  // The tokens are claims ABOUT THE EXISTING SUITE, not the word "failing" -- asking for the next
  // failing test IS the task, so the ask itself must not trip this.
  //
  // Every token pairs a STATE word with the claim. A bare adverb would not: 'right now' on its own
  // failed the battery for a benign rewording such as "the next failing test you'd write right
  // now", which claims nothing about the existing suite.
  const stateClaimTokens = [
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
  const lowered = wsPrompt.toLowerCase();
  const claimed = stateClaimTokens.filter((t) => lowered.includes(t));

  if (claimed.length) {
    fail(
      `[crux 2] the prompt makes a claim about the existing tests' pass/fail state (${JSON.stringify(claimed)}); ` +
        'the RED prompt must not assert that the target\'s tests currently pass or fail',
    );
  }

  console.log(`  [crux 2] no test-state claim in the prompt OK (checked ${stateClaimTokens.length} tokens)`);

  // The gate can only grade a spec a runner actually collects, so the landing directory must be
  // PINNED rather than left to the model: a spec outside every collection root grades no_tests for
  // a folder choice that says nothing about RED quality. targets.json declares the pin and the
  // prompt states it; assert they agree, which is also what gives test_dir a consumer -- it was
  // inert documentation that nothing read (`git grep test_dir` found no code).
  const pinnedDir = (loadSuiteCtx(RED_SUITE_DIR).targetsById.get('GRC') || {}).test_dir;

  if (!pinnedDir) {
    fail('[crux 2] target GRC declares no test_dir, so the produced test has no pinned landing directory');
  }

  if (!wsPrompt.includes(pinnedDir)) {
    fail(
      `[crux 2] the prompt does not name the target's pinned test_dir ${JSON.stringify(pinnedDir)}, so the runner ` +
        `and the produced test's location can disagree: ${JSON.stringify(wsPrompt)}`,
    );
  }

  console.log(`  [crux 2] prompt pins the target's test_dir OK (${pinnedDir})`);
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

// ---- crux 4: transcript parse (offline, zero spend) -------------------------------------------

function checkTranscriptParse() {
  const arms = ['with_skill', 'no_skill', 'invoke_skill'];
  let transcript = null;

  for (const arm of arms) {
    const candidate = join(RED_SUITE_DIR, 'results', 'apply', arm, 'r1', 'run-1', 'outputs', 'transcript.stream.jsonl');

    if (fs.existsSync(candidate)) {
      transcript = candidate;

      break;
    }
  }

  if (!transcript) {
    console.log('  [crux 4] SKIP -- no RED transcript on disk (gitignored); run a metered apply run to exercise it');

    return;
  }

  let raw;

  try {
    raw = fs.readFileSync(transcript, 'utf8');
  } catch (err) {
    fail(`[crux 4] cannot read on-disk transcript ${transcript}: ${err.message}`);
  }

  // The RED suite tracks lz-red + lz-tpp -- assert used_skills is keyed by exactly those tracked names.
  const r = extractResult(raw, ['lz-red', 'lz-tpp']);

  if (!r.used_skills || !('lz-red' in r.used_skills) || !('lz-tpp' in r.used_skills)) {
    fail(`[crux 4] used_skills not keyed by the tracked names lz-red/lz-tpp: ${JSON.stringify(r.used_skills)}`);
  }

  console.log(`  [crux 4] transcript parse OK (used_skills keyed by lz-red/lz-tpp = ${JSON.stringify(r.used_skills)}, tools=${Object.keys(r.tool_calls).join('+') || 'none'})`);
}

// ---- crux 5: classifier (thin re-assert; grade-red --selfcheck is the full one) ---------------

function checkClassifier() {
  const testOnlyDiff = 'diff --git a/test/vitest/conjured.spec.ts b/test/vitest/conjured.spec.ts\n+++ b/test/vitest/conjured.spec.ts\n';

  const redRunner = {
    testResults: [
      { status: 'failed', assertionResults: [{ status: 'failed', failureMessages: ['AssertionError: expected -1 to be 5'] }] },
    ],
  };
  const redVerdict = classify({ newErrors: 0 }, redRunner, testOnlyDiff);

  if (redVerdict !== 'genuinely_red') {
    fail(`[crux 5] tsc-clean + assertion failure classified '${redVerdict}', expected 'genuinely_red'`);
  }

  const greenRunner = {
    testResults: [{ status: 'passed', assertionResults: [{ status: 'passed', failureMessages: [] }] }],
  };
  const greenVerdict = classify({ newErrors: 0 }, greenRunner, testOnlyDiff);

  if (greenVerdict !== 'false_green') {
    fail(`[crux 5] all-pass + test-only diff classified '${greenVerdict}', expected 'false_green'`);
  }

  console.log('  [crux 5] classifier OK (genuinely_red + false_green re-assert; grade-red --selfcheck covers all 7 classes)');
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
function gradeFabricatedRunDir(fixtureName, assertGrade) {
  const ctx = loadSuiteCtx(RED_SUITE_DIR);
  const fixture = join(HERE, 'fixtures', fixtureName);

  // Mirror crux 3's SKIP-if-absent discipline: the metered run is gated anyway, and a missing
  // borrowed repo must not fail the whole battery. This has to come BEFORE any join(ctx.repo, ...)
  // -- join(undefined, ...) throws a TypeError and takes the whole battery down instead of
  // printing the SKIP, which made the !ctx.repo half of the guard unreachable.
  if (!ctx.repo || !fs.existsSync(ctx.repo)) {
    console.log(`  [crux 7:${fixtureName}] SKIP -- kata repo not on disk (${ctx.repo})`);

    return;
  }

  const realNodeModules = join(ctx.repo, 'node_modules');

  if (!fs.existsSync(realNodeModules)) {
    console.log(`  [crux 7:${fixtureName}] SKIP -- kata has no node_modules (${realNodeModules}); run npm ci there to exercise it`);

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
    grade = gradeRun({ runDir, suiteDir: RED_SUITE_DIR });
  } catch (err) {
    // Clean up BEFORE failing: fail() calls process.exit(1), which does not unwind the stack, so a
    // finally here would never run and every failed canary would leave a directory behind.
    fs.rmSync(runDir, { recursive: true, force: true });
    fail(`[crux 7:${fixtureName}] gradeRun threw instead of producing a verdict: ${err.message}`);
  }

  fs.rmSync(runDir, { recursive: true, force: true });

  assertGrade(grade);

  // T-63f-01: the grading worktree links the target's real node_modules, so teardown ordering is a
  // data-loss boundary, not a style point. Assert the borrowed repo survived intact.
  if (!fs.existsSync(realNodeModules)) {
    fail(`[crux 7:${fixtureName}] the kata's real node_modules is GONE after grading (${realNodeModules}) -- teardown followed the link`);
  }

  const porcelain = (git(ctx.repo, ['status', '--porcelain']).stdout || '').trim();

  if (porcelain) {
    fail(`[crux 7:${fixtureName}] kata not clean after grading: ${porcelain}`);
  }

  const worktrees = git(ctx.repo, ['worktree', 'list']).stdout || '';

  if (/red-wt-/.test(worktrees)) {
    fail(`[crux 7:${fixtureName}] leftover grading worktree after teardown:\n${worktrees}`);
  }

  // The grading worktree carries a LIVE junction into the borrowed repo for most of its life, so a
  // directory left behind on disk is a stranded link, not just clutter. `git worktree list` above
  // would not notice one that git already pruned.
  const stranded = fs.readdirSync(os.tmpdir()).filter((e) => e.startsWith('red-wt-'));

  if (stranded.length) {
    fail(`[crux 7:${fixtureName}] stranded grading worktree director(ies) under the temp dir: ${stranded.join(', ')}`);
  }

  // gradeRun installs SIGINT/SIGTERM handlers so an interrupted fan-out cannot strand that junction.
  // They are per-run and must not accumulate across the 9 runs of a fan-out.
  for (const signal of ['SIGINT', 'SIGTERM']) {
    if (process.listenerCount(signal) !== 0) {
      fail(`[crux 7:${fixtureName}] gradeRun leaked a ${signal} handler (${process.listenerCount(signal)} still registered)`);
    }
  }

  return grade;
}

function checkTargetToolchainCanary() {
  const grade = gradeFabricatedRunDir('canary-rundir', (g) => {
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
  });

  if (grade) {
    console.log(
      `  [crux 7] target-toolchain canary OK (fabricated runDir -> ${grade.verdict}, runner ${grade.runner}@${grade.runner_version}; kata intact, no leftover worktree)`,
    );
  }

  // The canary above is engineered to be genuinely_red, so it never reaches the stderr
  // disambiguation branch. This second fixture puts the produced spec OUTSIDE every collection
  // root, so the runner emits nothing usable on stdout and a recognized no-tests signal on stderr.
  // Without that branch the grade THROWS and no red-grade.json is written at all, which the
  // downstream tabulator then fails closed on -- so a run that merely landed in the wrong folder
  // takes the whole grade down instead of being counted honestly.
  const missGrade = gradeFabricatedRunDir('canary-nocollect', (g) => {
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
  const compileGrade = gradeFabricatedRunDir('canary-compile', (g) => {
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
}

// ---- crux 8: the measured 2026-07-25 steering exploits stay blocked ---------------------------

// Pure and offline: no kata, no runner, no worktree, so this crux never SKIPs. Each assertion
// pins ONE exploit that was reproduced against the real toolchain during the code review. Delete
// the corresponding guard in grade-red.mjs and exactly one of these fails.

function expectThrows(fn, label) {
  let threw = false;

  try {
    fn();
  } catch {
    threw = true;
  }

  if (!threw) {
    fail(`[crux 8] ${label}: expected the fail-closed path to throw, but it did not`);
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
  // T-63f-01, WRITE direction. The grading worktree links the kata's REAL node_modules so the
  // differential typecheck has a toolchain, and diff.patch is whatever the model under test staged.
  // MEASURED 2026-07-25: with nothing constraining the paths, both a modify hunk and a new-file
  // hunk under node_modules/ applied straight THROUGH the junction into the borrowed checkout.
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
      expectThrows(() => assertSafeDiffPaths(body, p), label);
    });
  }

  // ... and the shipped fixtures, which are real captures, must still pass. A containment check
  // that rejects legitimate input is just a broken gate.
  for (const fixtureName of ['canary-rundir', 'canary-nocollect', 'canary-compile']) {
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
    `  [crux 8] captured-diff containment OK (${Object.keys(exploits).length} write paths into the borrowed repo rejected; ` +
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

  expectThrows(() => parseRunnerReport(steer), 'a spec comment reading "no tests found" must not become a verdict');

  // The same echo with a non-zero exit: still only a code frame, still not the runner's status line.
  expectThrows(
    () => parseRunnerReport({ ...steer, status: 1 }),
    'an echoed "no tests found" comment must not become a verdict even on a non-zero exit',
  );

  // A test TITLE carrying the phrase is the realistic version of the same steer.
  expectThrows(
    () => parseRunnerReport({
      stdout: '',
      status: 1,
      stderr: jestCodeFrameStderr(["describe('x', () => {", "  it('says no tests found when empty', () => {})", '});']),
    }),
    'a test title reading "no tests found" must not become a verdict',
  );

  // Infrastructure failures are not verdicts either, whatever text happens to be on the streams.
  expectThrows(
    () => parseRunnerReport({
      stdout: '',
      status: null,
      error: Object.assign(new Error('spawn npx ENOENT'), { code: 'ENOENT' }),
      stderr: 'No tests found, exiting with code 1',
    }),
    'a spawn failure must throw, not synthesise a verdict',
  );
  expectThrows(
    () => parseRunnerReport({
      stdout: '{"testResults":[{"assertionRes',
      status: 1,
      stderr: 'No tests found, exiting with code 1',
    }),
    'a TRUNCATED stdout payload must throw, not synthesise a verdict',
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

function gitOrFail(cwd, args, label) {
  const r = git(cwd, args);

  if (r.status !== 0) {
    fail(`[crux 9] ${label}: git ${args.join(' ')} failed in ${cwd}: ${(r.stderr || '').trim()}`);
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

  gitOrFail(root, ['init', '-q'], 'stand-in init');
  gitOrFail(root, ['add', '.gitignore', 'TypeScript'], 'stand-in add');
  // A throwaway identity, so the probe never depends on (or writes) a real one.
  gitOrFail(root, ['-c', 'user.name=probe', '-c', 'user.email=probe', 'commit', '-q', '-m', 'stand-in base'], 'stand-in commit');

  const base = (gitOrFail(root, ['rev-parse', 'HEAD'], 'stand-in rev-parse').stdout || '').trim();
  // Take the toplevel in GIT'S form. os.tmpdir() can hand back an 8.3 short path while git reports
  // long, and resolveArmCwd() now (correctly) refuses that mismatch outright -- so the probe has to
  // be internally consistent or it would only ever exercise the new guard.
  const topLevel = (gitOrFail(root, ['rev-parse', '--show-toplevel'], 'stand-in toplevel').stdout || '').trim();
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
  fs.mkdirSync(inside, { recursive: true });
  fs.mkdirSync(outside, { recursive: true });

  let escapes;
  let linkError;

  try {
    // 'junction' is the Windows-safe directory link (a plain symlink needs elevation there); the
    // type argument is ignored elsewhere.
    fs.symlinkSync(inside, join(probe, 'copy', 'contained-link'), 'junction');
    fs.symlinkSync(outside, join(probe, 'copy', 'escaping-link'), 'junction');
    escapes = escapingLinks(join(probe, 'copy'));
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
    'a suite.repo that disagrees with the git toplevel must not resolve the grade back onto the source tree',
  );

  console.log(
    '  [crux 9] containment invariants OK (escapingLinks flags the escaping link only; resolveArmCwd ' +
      'keeps the grade inside the worktree and refuses a path-form mismatch)',
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
}

// ---- run all -----------------------------------------------------------------------------------

checkCompositionAndParity();
checkWorktreeBase();
checkTranscriptParse();
checkClassifier();
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
