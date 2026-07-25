#!/usr/bin/env node
// grade-red.mjs -- the D-06 RED correctness GATE + 7-class classifier (+ offline --selfcheck).
//
// This is the ONE hard gate of the Phase-21 applied-RED eval (D-06). For a captured run it applies
// the produced test to a FRESH os.tmpdir() git worktree at applyBase, runs a DIFFERENTIAL
// `tsc --noEmit --strict` (NEW errors attributable to the test must be 0 -- NOT the target's
// pre-existing non-strict source), runs the TARGET's own test runner with a machine-readable JSON
// reporter, and classifies the produced test into exactly one of:
//
//   genuinely_red   tsc-strict clean AND >=1 ASSERTION failure on current code   (the ONLY pass)
//   false_green     all assertions pass; the diff changed only test files
//   drove_to_green  all assertions pass because the diff changed PRODUCTION code (overstepped GREEN)
//   compile_error   the produced test introduces NEW tsc --strict errors
//   collection_error the suite failed to LOAD before any assertion ran (import/setup throw)
//   no_tests        zero it()/test() bodies collected
//   wrong_reason    a failure whose message is a runtime/type error masquerading as an assertion
//
// pass == (verdict === 'genuinely_red'). Everything else is reported, not passed (D-06).
//
// It is a POST-RUN pass over captured artifacts (mirrors Phase 13's grading/* reading captured
// diffs); it does NOT drive claude and does NOT modify run-e2e.mjs. It fails CLOSED (T-21-02 /
// RESEARCH Security Domain): an unreadable/empty diff.patch, a garbled/keyless meta.json, an
// unparseable runner JSON, or a worktree that will not build throws / exits non-zero rather than
// silently scoring "no change".
//
// The classifier logic is SHARED between the real gate (gradeRun) and --selfcheck (gradeFixture);
// only the runner command + cwd differ -- the target's own toolchain for real runs, the workspace's
// pinned typescript@6.0.3 + vitest@4.1.10 for the fixtures. The runner-JSON shapes classify() reads
// were empirically pinned 2026-07-22 against vitest 4.1.10 by the fixtures selfcheck (RESEARCH A1).
//
// Usage:
//   node grade-red.mjs --selfcheck                 # offline, zero spend; proves all 7 classes
//   node grade-red.mjs --run <runDir> [--suite D]  # grade one captured run; writes <runDir>/red-grade.json

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));

// The 7 D-06 classes. pass is true for genuinely_red only.
export const VERDICTS = [
  'genuinely_red',
  'false_green',
  'drove_to_green',
  'compile_error',
  'collection_error',
  'no_tests',
  'wrong_reason',
];

// An ASSERTION failure message (a genuine RED). vitest 4.1.10 emits e.g.
// "AssertionError: expected -1 to be 5 // Object.is equality" [pinned 2026-07-22].
const ASSERTION_RE =
  /assertion(?:error)?|\bexpected\b|\btobe\b|\bto be\b|\btoequal\b|\bto equal\b|\btostrictequal\b|\btohavebeen|\btocontain\b|\btomatch\b|\btothrow\b/i;
// A RUNTIME / TYPE error masquerading as a failure (wrong_reason, NOT a genuine RED). vitest emits
// e.g. "TypeError: (0 , __vite_ssr_import_1__.compute) is not a function" [pinned 2026-07-22].
const RUNTIME_RE =
  /is not a function|is not defined|is not iterable|is not a constructor|cannot find|cannot read propert|referenceerror|syntaxerror/i;
// A "suite loaded but declared no tests" message. Disambiguates no_tests from collection_error --
// the two share an identical vitest JSON shape (numTotalTests 0, status failed, empty
// assertionResults) EXCEPT this suite-level message. vitest: "No test found in suite <file>";
// jest: "Your test suite must contain at least one test." [pinned 2026-07-22].
const NO_TESTS_RE = /no test(?:s)? found|no test(?:s)? in suite|must contain at least one test|no test files? found/i;
// A produced test file (the runner's spec/test glob).
const TEST_FILE_RE = /\.(?:spec|test)\.[cm]?[jt]sx?$/i;

// ---- diff helpers (drove_to_green vs false_green split) --------------------------------------

// b-side paths touched by a unified diff (from `diff --git a/X b/Y` and `+++ b/Y` headers).
export function changedPaths(diffPatch) {
  const out = new Set();

  for (const line of String(diffPatch == null ? '' : diffPatch).split('\n')) {
    let m = /^diff --git a\/(.+?) b\/(.+)$/.exec(line);

    if (m) {
      out.add(m[2].trim());

      continue;
    }

    m = /^\+\+\+ b\/(.+)$/.exec(line);

    if (m) {
      const p = m[1].trim();

      if (p && p !== '/dev/null') {
        out.add(p);
      }
    }
  }

  return [...out];
}

export function isTestFile(p) {
  return TEST_FILE_RE.test(String(p || ''));
}

// Production (non-test) files the diff changed. A non-empty result on an all-green run is the
// drove_to_green signal (RESEARCH Pitfall 9).
export function changedProductionFiles(diffPatch) {
  return changedPaths(diffPatch).filter((p) => p && p !== '/dev/null' && !isTestFile(p));
}

// Fail-closed guard: a missing/empty diff.patch must throw, never be scored "no change" (T-21-02).
export function assertReadableDiff(diffText) {
  if (typeof diffText !== 'string' || diffText.trim() === '') {
    throw new Error('grade-red: diff.patch is missing or empty -- refusing to score "no change" (fail closed, T-21-02)');
  }

  return diffText;
}

// ---- the pure classifier (shared by the real gate and --selfcheck) ---------------------------

// tscResult: { newErrors: number }. runnerJson: the Jest-compatible runner report (vitest
// --reporter=json / jest --json). diffPatch: the produced test's unified diff (splits the all-green
// case). Returns exactly one VERDICTS entry. Throws (fail closed) on garbled input rather than
// emitting a false verdict.
export function classify(tscResult, runnerJson, diffPatch) {
  if (!tscResult || typeof tscResult.newErrors !== 'number') {
    throw new Error('classify: tscResult.newErrors is missing (fail closed -- do not emit a verdict)');
  }

  if (runnerJson == null || typeof runnerJson !== 'object') {
    throw new Error('classify: runnerJson is not an object (unparseable runner output -- fail closed)');
  }

  // D-06 clause 1: tsc --strict must be clean. NEW errors attributable to the produced test
  // (differential -- not the target's pre-existing non-strict source) => compile_error.
  if (tscResult.newErrors > 0) {
    return 'compile_error';
  }

  const suite = Array.isArray(runnerJson.testResults) ? runnerJson.testResults[0] : undefined;
  const asserts = suite && Array.isArray(suite.assertionResults) ? suite.assertionResults : [];

  if (asserts.length === 0) {
    // Zero assertions ran. Either the suite could not LOAD (an import/setup throw before any test
    // body -- collection_error) or it loaded cleanly but declared no it()/test() bodies (no_tests).
    // The two have an identical vitest JSON shape EXCEPT the suite-level message: disambiguate on it.
    const msg = `${(suite && suite.message) || ''}\n${runnerJson.message || ''}`;

    if (NO_TESTS_RE.test(msg)) {
      return 'no_tests';
    }

    return 'collection_error';
  }

  const failed = asserts.filter((a) => a && a.status === 'failed');

  if (failed.length === 0) {
    // Every assertion passed. A false green -- UNLESS the diff also changed production (non-test)
    // code so the test now passes, which is drove_to_green (overstepped into lz-tpp's green job;
    // RESEARCH Pitfall 9). A benign compiling STUB that keeps the test red never reaches here.
    return changedProductionFiles(diffPatch).length > 0 ? 'drove_to_green' : 'false_green';
  }

  // >= 1 assertion failed. genuinely_red ONLY if EVERY failure is an assertion error, not a
  // runtime/type error masquerading as a failure (wrong_reason). Fail closed toward wrong_reason.
  const rightReason = failed.every((a) => {
    const m = (Array.isArray(a.failureMessages) ? a.failureMessages : []).join('\n');

    return ASSERTION_RE.test(m) && !RUNTIME_RE.test(m);
  });

  return rightReason ? 'genuinely_red' : 'wrong_reason';
}

export function verdictPass(verdict) {
  return verdict === 'genuinely_red';
}

// ---- shared process helpers ------------------------------------------------------------------

// Run git in a working dir. mustSucceed throws on a non-zero exit rather than proceeding on a
// silently-failed plumbing step (mirrors run-e2e.mjs's git() / I1 fail-closed idiom).
function git(cwd, gitArgs, { mustSucceed = false, env = undefined } = {}) {
  const r = spawnSync('git', gitArgs, {
    cwd,
    env: env ? { ...process.env, ...env } : undefined,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
  });

  if (mustSucceed && r.status !== 0) {
    throw new Error(`git ${gitArgs.join(' ')} failed (exit ${r.status}) in ${cwd}: ${(r.stderr || '').trim()}`);
  }

  return r;
}

// tsc error lines (`error TS####`) from a `node <tscBin> ...args` run in cwd. Errors go to stdout
// by default; scan both streams to be safe.
function tscErrorLines(cwd, args, tscBin) {
  const r = spawnSync(process.execPath, [tscBin, ...args], {
    cwd,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
  });
  const text = `${r.stdout || ''}\n${r.stderr || ''}`;

  return text.split('\n').filter((l) => /error TS\d+/.test(l)).map((l) => l.trim());
}

// Parse a runner's JSON report. Fail closed (T-21-V5): empty or unparseable output throws rather
// than yielding a false verdict. Tolerates a runner that interleaves non-JSON lines on stdout by
// extracting the outermost {...} block.
function parseRunnerJson(raw) {
  if (typeof raw !== 'string' || !raw.trim()) {
    throw new Error('grade-red: runner produced empty output -- cannot classify (fail closed, T-21-V5)');
  }

  try {
    return JSON.parse(raw);
  } catch {
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');

    if (start >= 0 && end > start) {
      try {
        return JSON.parse(raw.slice(start, end + 1));
      } catch {
        // fall through to the throw below
      }
    }

    throw new Error('grade-red: could not parse runner JSON (fail closed, T-21-V5)');
  }
}

// ---- fixture grader (offline --selfcheck path; workspace toolchain) ---------------------------

// Grade one SELFCHECK-ONLY fixture dir (module.ts? + module.spec.ts) through the SAME classify() as
// the real gate, using the workspace's pinned typescript@6.0.3 + vitest@4.1.10. Standalone fixtures
// have no pre-existing baseline, so the differential tsc reduces to "all --strict errors are NEW".
// Leaves the fixture dir pristine (the vitest JSON report is written to os.tmpdir(), not the fixture).
export function gradeFixture(fixtureDir) {
  const tscBin = path.join(HERE, 'node_modules', 'typescript', 'bin', 'tsc');
  const vitestBin = path.join(HERE, 'node_modules', 'vitest', 'vitest.mjs');
  const specFile = 'module.spec.ts';
  const moduleFile = 'module.ts';
  const files = fs.existsSync(path.join(fixtureDir, moduleFile)) ? [moduleFile, specFile] : [specFile];

  // --ignoreConfig is required on TS 6.x: passing files on the CLI while a tsconfig.json is present
  // is otherwise TS5112. The compiler options mirror the workspace tsconfig.
  const tscErrors = tscErrorLines(
    fixtureDir,
    [
      '--noEmit',
      '--strict',
      '--skipLibCheck',
      '--ignoreConfig',
      '--target',
      'es2021',
      '--module',
      'esnext',
      '--moduleResolution',
      'bundler',
      ...files,
    ],
    tscBin,
  );
  const tscResult = { newErrors: tscErrors.length, errors: tscErrors };

  // A test-only synthetic diff so a green fixture classifies false_green (never drove_to_green);
  // the selfcheck proves drove_to_green separately via a synthetic production diff.
  const testOnlyDiff = `diff --git a/${specFile} b/${specFile}\n+++ b/${specFile}\n`;

  if (tscResult.newErrors > 0) {
    // compile_error short-circuits in classify(); no need to run the runner.
    return classify(tscResult, { testResults: [] }, testOnlyDiff);
  }

  const outFile = path.join(os.tmpdir(), `red-vitest-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
  const res = spawnSync(process.execPath, [vitestBin, 'run', '--reporter=json', `--outputFile=${outFile}`], {
    cwd: fixtureDir,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
  });

  let raw;

  try {
    raw = fs.readFileSync(outFile, 'utf8');
  } catch (err) {
    throw new Error(
      `grade-red: vitest produced no JSON report for ${fixtureDir} (fail closed): ${err.message}\n${(res.stderr || '').slice(0, 400)}`,
    );
  } finally {
    try {
      fs.rmSync(outFile, { force: true });
    } catch {
      // best-effort; the temp report lives outside the fixture and is harmless if it lingers
    }
  }

  return classify(tscResult, parseRunnerJson(raw), testOnlyDiff);
}

// ---- real gate (the D-06 correctness gate over one captured run) ------------------------------

function whyFor(verdict, tscResult) {
  switch (verdict) {
    case 'genuinely_red':
      return 'tsc --strict clean; >=1 assertion failure on current code (correct RED)';
    case 'false_green':
      return 'all assertions pass on current code and the diff changed only test files (not red)';
    case 'drove_to_green':
      return 'all assertions pass because the diff also changed production code (overstepped into GREEN)';
    case 'compile_error':
      return `${tscResult.newErrors} NEW tsc --strict error(s) attributable to the produced test`;
    case 'collection_error':
      return 'the suite failed to load before any assertion ran (import/setup error)';
    case 'no_tests':
      return 'zero it()/test() bodies were collected';
    case 'wrong_reason':
      return 'a failure whose message is a runtime/type error masquerading as an assertion failure';
    default:
      return 'unknown';
  }
}

function firstFailureExcerpt(runnerJson) {
  const suite = Array.isArray(runnerJson.testResults) ? runnerJson.testResults[0] : undefined;
  const asserts = suite && Array.isArray(suite.assertionResults) ? suite.assertionResults : [];
  const failed = asserts.find((a) => a && a.status === 'failed');
  const msg = failed && Array.isArray(failed.failureMessages) ? failed.failureMessages.join('\n') : (suite && suite.message) || '';

  return String(msg).slice(0, 500);
}

// The target's own runner version (drift detection). Looks in the worktree subdir then the root.
function readRunnerVersion(armCwd, worktree, runnerName) {
  for (const base of [armCwd, worktree]) {
    try {
      const v = JSON.parse(fs.readFileSync(path.join(base, 'node_modules', runnerName, 'package.json'), 'utf8')).version;

      if (v) {
        return v;
      }
    } catch {
      // keep looking
    }
  }

  return 'unknown';
}

// Select the target's runner from the produced test's OWN path, via the target's machine-readable
// runner_select map (repo-subdir-relative path prefix -> runner name), longest prefix first,
// falling back to runner_default.
//
// It deliberately does NOT read runner_preference. That field is PROSE, and a substring test over
// prose matches any sentence that merely mentions a runner's name -- so it could only ever return
// one answer regardless of what it said (measured 2026-07-25: the GRC prose pinned every run to
// jest while the configured test_dir was the vitest-only one, which the selected runner cannot
// collect). Keying on the produced test's path also keeps the gate from scoring a run on WHICH of
// the target's test dirs the model chose, which is not a RED-quality signal.
export function selectRunner(runnerSpec, testPath) {
  const map = (runnerSpec && runnerSpec.runner_select) || {};
  const hit = Object.keys(map)
    .sort((a, b) => b.length - a.length)
    .find((prefix) => String(testPath || '').startsWith(prefix));

  return (hit && map[hit]) || (runnerSpec && runnerSpec.runner_default) || null;
}

// The target repo's own typescript (never the workspace's -- Pitfall 4).
function targetTscBin(armCwd, worktree) {
  for (const base of [armCwd, worktree]) {
    const bin = path.join(base, 'node_modules', 'typescript', 'bin', 'tsc');

    if (fs.existsSync(bin)) {
      return bin;
    }
  }

  return null;
}

function targetTscErrors(armCwd, worktree, args) {
  const bin = targetTscBin(armCwd, worktree);
  let text;

  if (bin) {
    const r = spawnSync(process.execPath, [bin, ...args], {
      cwd: armCwd,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      windowsHide: true,
    });
    text = `${r.stdout || ''}\n${r.stderr || ''}`;
  } else {
    const r = spawnSync('npx', ['tsc', ...args], {
      cwd: armCwd,
      shell: true,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
      windowsHide: true,
    });
    text = `${r.stdout || ''}\n${r.stderr || ''}`;
  }

  return text.split('\n').filter((l) => /error TS\d+/.test(l)).map((l) => l.trim());
}

// Grade one captured run: fail-closed reads, fresh full-repo worktree at applyBase, differential
// tsc (NEW errors only), the TARGET's own runner, classify(), write red-grade.json. Teardown is
// finally-style so a failed grade still removes the worktree.
export function gradeRun({ runDir, suiteDir }) {
  // fail-closed reads (T-21-02): unreadable/empty diff or garbled/keyless meta throws.
  const diffPath = path.join(runDir, 'diff.patch');
  const metaPath = path.join(runDir, 'meta.json');
  let diffPatch;

  try {
    diffPatch = fs.readFileSync(diffPath, 'utf8');
  } catch (err) {
    throw new Error(`grade-red: cannot read ${diffPath} (fail closed): ${err.message}`);
  }

  assertReadableDiff(diffPatch);

  let meta;

  try {
    meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
  } catch (err) {
    throw new Error(`grade-red: cannot read/parse ${metaPath} (garbled meta -- fail closed): ${err.message}`);
  }

  if (!meta || !Array.isArray(meta.changed_files)) {
    throw new Error('grade-red: meta.json has no changed_files array (keyless meta -- fail closed)');
  }

  // resolve target + runner from suite.json/targets.json (the target's own toolchain, not hardcoded).
  const suite = JSON.parse(fs.readFileSync(path.join(suiteDir, 'suite.json'), 'utf8'));
  const targetsDoc = JSON.parse(fs.readFileSync(path.join(suiteDir, 'targets.json'), 'utf8'));
  const target = (targetsDoc.targets || []).find((t) => t.id === meta.target);

  if (!target) {
    throw new Error(`grade-red: target '${meta.target}' not found in ${suiteDir}/targets.json (fail closed)`);
  }

  const repo = suite.repo;
  const applyBase = process.env.E2E_APPLY_BASE || suite.applyBase;
  const runnerSpec = target.runner || {};

  // the produced test file(s) from meta.changed_files (the runner's spec/test glob).
  const producedTests = meta.changed_files.filter((f) => isTestFile(f));

  const gitRoot = (git(repo, ['rev-parse', '--show-toplevel'], { mustSucceed: true }).stdout || '').trim();
  const stamp = `${process.pid}-${Date.now()}`;
  const worktree = path.join(os.tmpdir(), `red-wt-${meta.target}-${stamp}`);
  const rel = path.relative(path.resolve(gitRoot), path.resolve(repo)).split(path.sep).join('/');
  const armCwd = rel ? path.join(worktree, rel) : worktree;

  // The runner command and runner_select are both relative to the REPO SUBDIR, while
  // meta.changed_files is repo-ROOT-relative; strip the subdir prefix before either uses it.
  const primaryTest = producedTests[0];
  const testForRunner =
    primaryTest && rel && primaryTest.startsWith(`${rel}/`) ? primaryTest.slice(rel.length + 1) : primaryTest;
  const runnerName = selectRunner(runnerSpec, testForRunner);

  if (!runnerName) {
    throw new Error(
      `grade-red: target '${target.id}' has no runner_select match for '${testForRunner}' and no runner_default (fail closed)`,
    );
  }

  const runnerCmdTemplate = runnerSpec[runnerName];

  if (!runnerCmdTemplate) {
    throw new Error(
      `grade-red: target '${target.id}' selected runner '${runnerName}' but runner.${runnerName} has no command (fail closed)`,
    );
  }

  // The target's OWN node_modules, linked into the grading worktree below. A fresh worktree has
  // none (node_modules is gitignored and untracked), and without it the gate degrades SILENTLY
  // rather than loudly: targetTscBin() finds no local typescript, targetTscErrors() falls through
  // to `npx tsc` -> the GLOBAL compiler, and a global compiler that rejects the target's tsconfig
  // aborts at config parse before checking any source. The identical abort then appears in BOTH
  // differential runs, so newErrors subtracts to 0 and D-06 clause 1 reports "tsc clean" for a
  // produced test with blatant type errors. Fail closed here instead (T-63f-04).
  const nodeModulesSrc = path.join(repo, 'node_modules');
  const nodeModulesLink = path.join(armCwd, 'node_modules');

  if (!fs.existsSync(nodeModulesSrc)) {
    throw new Error(
      `grade-red: ${nodeModulesSrc} does not exist, so the grading worktree would have no toolchain ` +
        'and the differential typecheck could not discriminate (fail closed). Install the target\'s ' +
        `dependencies there first (npm ci in ${repo}), then re-run.`,
    );
  }

  // detached worktree at the pristine applyBase (RED needs the FULL repo so the produced test can
  // import/typecheck/run -- not a one-file synthetic tree; RESEARCH anti-pattern).
  git(gitRoot, ['worktree', 'add', '--detach', worktree, applyBase], { mustSucceed: true });

  let linkCreated = false;

  const teardown = () => {
    // ORDER IS LOAD-BEARING (T-63f-01): unlink the node_modules junction BEFORE removing the
    // worktree, so no recursive delete can follow the link into the TARGET's real node_modules.
    // Removing a directory junction unlinks the link and not its target, but the ordering is what
    // makes that hold no matter who does the deleting. Link removal is failure-tolerant so an
    // already-gone link cannot mask the real error or strand the worktree.
    if (linkCreated) {
      try {
        fs.rmSync(nodeModulesLink, { recursive: true, force: true });
      } catch {
        // best-effort; the worktree removal below still has to run
      }
    }

    git(gitRoot, ['worktree', 'remove', '--force', worktree]);
    git(gitRoot, ['worktree', 'prune']);
  };

  try {
    // 'junction' is the Windows-safe directory link (a plain symlink needs elevation there); the
    // type argument is ignored on other platforms. The target must be absolute, which it is.
    fs.symlinkSync(nodeModulesSrc, nodeModulesLink, 'junction');
    linkCreated = true;

    if (producedTests.length === 0) {
      // The diff was non-empty (assertReadableDiff passed) but no test file was produced: zero
      // assertions can ever be collected. Honest verdict: no_tests.
      const grade = {
        prompt_id: meta.prompt_id,
        target: meta.target,
        arm: meta.arm,
        run_idx: meta.run_idx,
        verdict: 'no_tests',
        pass: false,
        why: 'the produced diff contains no test file (nothing to run)',
        new_tsc_errors: 0,
        runner: runnerName,
        runner_version: readRunnerVersion(armCwd, worktree, runnerName),
        produced_test_files: [],
        failure_excerpt: '',
      };
      fs.writeFileSync(path.join(runDir, 'red-grade.json'), JSON.stringify(grade, null, 2));

      return grade;
    }

    // differential tsc (Pitfall 3): baseline BEFORE applying the produced test, then WITH it.
    //
    // No --lib is pinned on purpose. It was measured 2026-07-25 that pinning one buys nothing here
    // (@types/node's `/// <reference lib="es2020" />` already raises the program lib above the
    // target's es5 setting, so every common modern array/object method typechecks) while coupling
    // this target-agnostic gate to one compiler's accepted lib list -- a value the target's tsc
    // rejects becomes a TS6046 in BOTH runs, i.e. exactly the vacuous differential guarded below.
    const tscArgs = ['--noEmit', '--strict'];
    const baseErrors = new Set(targetTscErrors(armCwd, worktree, tscArgs));

    // Fail closed on an OPTION/CONFIG-level tsc error (TS5xxx/TS6xxx). Those abort the compile
    // before any source is checked, and the identical line then lands in both differential runs --
    // so newErrors subtracts to 0 for EVERY input and D-06 clause 1 silently passes anything.
    // Never grade on a differential that cannot discriminate.
    const configError = [...baseErrors].find((l) => /error TS(?:5\d{3}|6\d{3})\b/.test(l));

    if (configError) {
      throw new Error(
        'grade-red: the target typecheck failed at the option/config layer, so the differential ' +
          `cannot discriminate and would report every produced test as tsc-clean (fail closed): ${configError}`,
      );
    }

    const applyRes = git(worktree, ['apply', '--whitespace=nowarn', diffPath]);

    if (applyRes.status !== 0) {
      throw new Error(`grade-red: git apply of ${diffPath} failed in the worktree (fail closed): ${(applyRes.stderr || '').trim()}`);
    }

    const withErrors = targetTscErrors(armCwd, worktree, tscArgs);
    const newErrors = withErrors.filter((l) => !baseErrors.has(l));
    const tscResult = { newErrors: newErrors.length, errors: newErrors };

    // run the TARGET's own runner on the produced test (Pitfall 4), using the subdir-relative path
    // resolved above alongside the runner selection.
    const cmd = runnerCmdTemplate.replace('<producedTestFile>', testForRunner);
    const runRes = spawnSync(cmd, {
      cwd: armCwd,
      shell: true,
      encoding: 'utf8',
      maxBuffer: 128 * 1024 * 1024,
      windowsHide: true,
    });
    const runnerJson = parseRunnerJson(`${runRes.stdout || ''}`);

    const verdict = classify(tscResult, runnerJson, diffPatch);
    const grade = {
      prompt_id: meta.prompt_id,
      target: meta.target,
      arm: meta.arm,
      run_idx: meta.run_idx,
      verdict,
      pass: verdictPass(verdict),
      why: whyFor(verdict, tscResult),
      new_tsc_errors: tscResult.newErrors,
      runner: runnerName,
      runner_version: readRunnerVersion(armCwd, worktree, runnerName),
      produced_test_files: producedTests,
      failure_excerpt: firstFailureExcerpt(runnerJson),
    };
    fs.writeFileSync(path.join(runDir, 'red-grade.json'), JSON.stringify(grade, null, 2));

    return grade;
  } finally {
    teardown();
  }
}

// ---- offline selfcheck (zero spend; proves all 7 D-06 classes) --------------------------------

function fail(msg) {
  console.error(`grade-red --selfcheck: FAIL -- ${msg}`);
  process.exit(1);
}

function assertThrows(fn, label) {
  let threw = false;

  try {
    fn();
  } catch {
    threw = true;
  }

  if (!threw) {
    fail(`expected the fail-closed path '${label}' to throw, but it did not`);
  }
}

function runSelfcheck() {
  // Six runnable fixture pairs, one per class. Proves the A1 runner-JSON shape against the pinned
  // vitest before any metered run.
  const table = [
    ['red', 'genuinely_red'],
    ['green', 'false_green'],
    ['compile', 'compile_error'],
    ['collect', 'collection_error'],
    ['notest', 'no_tests'],
    ['wrong', 'wrong_reason'],
  ];

  for (const [dir, want] of table) {
    const fixtureDir = path.join(HERE, 'fixtures', dir);

    if (!fs.existsSync(fixtureDir)) {
      fail(`fixture dir missing: ${fixtureDir}`);
    }

    const got = gradeFixture(fixtureDir);

    if (got !== want) {
      fail(`[fixture:${dir}] classified '${got}', expected '${want}'`);
    }

    console.log(`  [fixture:${dir}] -> ${got} OK`);
  }

  // MANDATORY (non-discretionary) 7th class: drove_to_green. A green runnerJson PLUS a diff that
  // changed a PRODUCTION (non-test) file so the test now passes -> drove_to_green, distinct from a
  // test-only diff (false_green). Closes the class without a runnable model-drives-green fixture.
  const greenRunner = { testResults: [{ status: 'passed', assertionResults: [{ status: 'passed', failureMessages: [] }] }] };
  const prodDiff =
    'diff --git a/app/gilded-rose.ts b/app/gilded-rose.ts\n--- a/app/gilded-rose.ts\n+++ b/app/gilded-rose.ts\n@@ -1 +1,2 @@\n+// production edit that drives the test green\n';
  const droveVerdict = classify({ newErrors: 0 }, greenRunner, prodDiff);

  if (droveVerdict !== 'drove_to_green') {
    fail(`[classify:drove_to_green] green runner + production diff classified '${droveVerdict}', expected 'drove_to_green'`);
  }

  const testOnlyDiff =
    'diff --git a/test/vitest/conjured.spec.ts b/test/vitest/conjured.spec.ts\n--- /dev/null\n+++ b/test/vitest/conjured.spec.ts\n@@ -0,0 +1 @@\n+// test-only diff\n';
  const falseGreenVerdict = classify({ newErrors: 0 }, greenRunner, testOnlyDiff);

  if (falseGreenVerdict !== 'false_green') {
    fail(`[classify:false_green] green runner + test-only diff classified '${falseGreenVerdict}', expected 'false_green'`);
  }

  console.log('  [classify:drove_to_green] green + production diff -> drove_to_green OK (test-only diff -> false_green)');

  // Fail-closed paths (T-21-02 / T-21-V5): empty/missing diff and garbled/empty runner JSON must
  // throw rather than silently score a verdict.
  assertThrows(() => assertReadableDiff(''), 'empty diff.patch');
  assertThrows(() => assertReadableDiff('   \n\t '), 'whitespace-only diff.patch');
  assertThrows(() => classify({ newErrors: 0 }, null, testOnlyDiff), 'null runner JSON');
  assertThrows(() => parseRunnerJson(''), 'empty runner output');
  console.log('  [fail-closed] empty diff + null/empty runner JSON throw OK');

  console.log(
    'grade-red --selfcheck: OK -- all SEVEN D-06 classes proven offline ' +
      '(genuinely_red / false_green / drove_to_green / compile_error / collection_error / no_tests / wrong_reason); ' +
      'zero spend, fixtures pristine.',
  );
  process.exit(0);
}

// Walk up from a runDir to the nearest suite.json (so --suite is optional for the common layout).
function runDirToSuiteDir(runDir) {
  let d = runDir;

  for (let i = 0; i < 8; i++) {
    if (fs.existsSync(path.join(d, 'suite.json'))) {
      return d;
    }

    const parent = path.dirname(d);

    if (parent === d) {
      break;
    }

    d = parent;
  }

  throw new Error('grade-red: could not locate suite.json above the runDir; pass --suite <dir> explicitly');
}

function main(argv) {
  if (argv.includes('--selfcheck')) {
    runSelfcheck();

    return;
  }

  const runIdx = argv.indexOf('--run');

  if (runIdx >= 0 && argv[runIdx + 1]) {
    const runDir = path.resolve(argv[runIdx + 1]);
    const suiteIdx = argv.indexOf('--suite');
    const suiteDir = suiteIdx >= 0 && argv[suiteIdx + 1] ? path.resolve(argv[suiteIdx + 1]) : runDirToSuiteDir(runDir);
    const grade = gradeRun({ runDir, suiteDir });
    console.log(`${grade.target} ${grade.arm} run-${grade.run_idx}: ${grade.verdict} (pass=${grade.pass}) -- ${grade.why}`);
    console.log(`wrote ${path.join(runDir, 'red-grade.json')}`);

    return;
  }

  console.error('usage: node grade-red.mjs --run <runDir> [--suite <suiteDir>] | --selfcheck');
  process.exit(2);
}

// Run main() only as the CLI; when imported (Task 2 selfcheck wiring / 21-03 selfcheck-red) expose
// classify() + the graders without executing the CLI.
const isMainModule = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;

if (isMainModule) {
  main(process.argv.slice(2));
}

export { parseRunnerJson };
