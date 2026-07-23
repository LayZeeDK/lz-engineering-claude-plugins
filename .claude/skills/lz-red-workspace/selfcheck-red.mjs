#!/usr/bin/env node
// selfcheck-red.mjs -- the offline, ZERO-SPEND crux battery for the RED apply harness (mirrors
// lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs). It proves the whole RED instrument
// composes and tears down correctly BEFORE any metered claude -p run (the D-12 build-then-halt
// boundary). It NEVER calls claude; every step is a --dry-run compose, a git-only worktree
// build/teardown, an offline transcript parse, or a pure classifier assertion.
//
// Six cruxes (RESEARCH "Wave 0 Gaps"; EVL-03.1 / .2):
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
//
// Fail-closed: any violation prints a FAIL line and exits 1; an OK line + exit 0 on success. Zero
// claude spend, borrowed repo left pristine. NOT wired into `npm run check` (it touches the borrowed
// repo); run it explicitly:  node selfcheck-red.mjs

import fs from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { buildSyntheticBase, extractResult, git } from '../lz-refactor-workspace/e2e-nx/run-e2e.mjs';
import { classify } from './grade-red.mjs';

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
checkNxRegression();

console.log(
  'selfcheck-red: OK -- composition, prompt-parity, worktree base, transcript parse, classifier, and the ' +
    'lz-refactor nx regression all pass; zero claude spend, borrowed repo left pristine.',
);
process.exit(0);
