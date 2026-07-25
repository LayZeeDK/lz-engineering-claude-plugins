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
//      the gate works against the actual target. Kata absent -> SKIP.
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
import { classify, gradeRun } from './grade-red.mjs';

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
    'right now',
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
  const realNodeModules = join(ctx.repo, 'node_modules');

  // Mirror crux 3's SKIP-if-absent discipline: the metered run is gated anyway, and a missing
  // borrowed repo must not fail the whole battery.
  if (!ctx.repo || !fs.existsSync(ctx.repo)) {
    console.log(`  [crux 7:${fixtureName}] SKIP -- kata repo not on disk (${ctx.repo})`);

    return;
  }

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
    fail(`[crux 7:${fixtureName}] gradeRun threw instead of producing a verdict: ${err.message}`);
  } finally {
    fs.rmSync(runDir, { recursive: true, force: true });
  }

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
checkNxRegression();

console.log(
  'selfcheck-red: OK -- composition, prompt-parity, worktree base, transcript parse, classifier, the ' +
    'target-toolchain canary, and the lz-refactor nx regression all pass; zero claude spend, borrowed repo left pristine.',
);
process.exit(0);
