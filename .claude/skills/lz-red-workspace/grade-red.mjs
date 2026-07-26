#!/usr/bin/env node
// grade-red.mjs -- the D-06 RED correctness GATE + 7-class classifier (+ offline --selfcheck).
//
// This is the ONE hard gate of the Phase-21 applied-RED eval (D-06). For a captured run it applies
// the produced test to a FRESH os.tmpdir() git worktree at applyBase, runs a DIFFERENTIAL
// `tsc --noEmit --strict` (NEW errors attributable to the test must be 0 -- NOT the target's
// pre-existing non-strict source), runs the TARGET's own test runner with a machine-readable JSON
// reporter, and classifies the produced test into exactly one of:
//
//   genuinely_red   tsc-strict clean AND >=1 ASSERTION failure in a test THE DIFF ADDED (the ONLY pass)
//   false_green     the tests the diff added all pass; the diff changed only test files
//   drove_to_green  the tests the diff added all pass because the diff changed PRODUCTION code
//   compile_error   the produced test introduces NEW tsc --strict errors
//   collection_error the suite failed to LOAD before any assertion ran (import/setup throw)
//   no_tests        zero it()/test() bodies collected
//   wrong_reason    an ADDED test's failure is a runtime/type error masquerading as an assertion
//   unattributable  something in the file failed, but no failure belongs to a test the diff ADDED
//
// pass == (verdict === 'genuinely_red'). Everything else is reported, not passed (D-06).
//
// ATTRIBUTION is load-bearing (added 2026-07-25 by quick 260725-63f). Until it existed, "the file
// has >= 1 assertion failure" WAS the pass criterion, and the k=1 with_skill pilot showed why that
// is not the same question D-06 asks: the model APPENDED its test to the kata's existing
// test/vitest/gilded-rose.spec.ts, which ships a broken `should foo` placeholder asserting
// 'fixme' -- so the file was already red before the produced test ran, and the recorded
// failure_excerpt was that placeholder's message rather than the model's. That run's verdict was
// right by luck, but a model that appends a test which PASSES -- a false green, the exact thing
// D-06 exists to catch -- would have graded genuinely_red / pass:true on the borrowed failure. The
// hole is arm-independent, so it would have inflated every arm's Pass@k equally while hollowing
// out the eval's only hard correctness gate.
//
// It is a POST-RUN pass over captured artifacts (mirrors Phase 13's grading/* reading captured
// diffs); it does NOT drive claude and does NOT modify run-e2e.mjs. It fails CLOSED (T-21-02 /
// RESEARCH Security Domain): an unreadable/empty diff.patch, a garbled/keyless meta.json, an
// unparseable runner JSON, or a worktree that will not build throws / exits non-zero rather than
// silently scoring "no change".
//
// It also runs MODEL-AUTHORED CODE -- the produced spec, under the target's own runner. Everything
// that code can reach relatively is inside a throwaway worktree under os.tmpdir(), including the
// toolchain, which is a per-grade COPY of the target's node_modules rather than a link to it
// (T-63f-05). The borrowed repo is read once, to make that copy, and is never a write target.
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

// The 8 D-06 classes. pass is true for genuinely_red only.
export const VERDICTS = [
  'genuinely_red',
  'false_green',
  'drove_to_green',
  'compile_error',
  'collection_error',
  'no_tests',
  'wrong_reason',
  'unattributable',
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
// assertionResults) EXCEPT this suite-level message.
//
// Matched LINE BY LINE against the message with its code frame stripped, never as a substring of
// the whole thing. Both runners append a frame quoting the produced spec's own source to
// testResults[0].message, so a substring match over the raw message lets the MODEL UNDER TEST pick
// its own verdict -- measured 2026-07-25, `it('says no tests found when empty')` alone turned a
// collection_error (a suite that blew up on import) into a no_tests. Both are pass:false, but the
// breakdown an operator reads to tell an instrument artifact from a model failure was wrong, and
// RUN-GATE now tells the operator to read collection_error clusters as a possible artifact.
//
// The third alternative is the PROCESS-level status line that parseRunnerReport synthesises for a
// collection miss; the first two are the runners' own SUITE-level sentences (jest: "Your test suite
// must contain at least one test."; vitest: "No test found in suite <file>") [pinned 2026-07-22].
const NO_TESTS_RE =
  /^(?:your test suite must contain at least one test\.?|no tests? found in suite\b.*|no tests? (?:files? )?found, exiting with code \d+\.?)$/i;
// The runner's OWN "I collected nothing" STATUS LINE, anchored to a whole line. Both of the kata's
// runners print exactly this shape on a collection miss (measured 2026-07-25). Anchoring is the
// point: run unanchored over raw process output, a no-tests pattern also matches a runner's echo of
// the PRODUCED SPEC'S OWN SOURCE, which is model-authored. See parseRunnerReport.
const NO_COLLECT_SENTINEL = /^no tests? (?:files? )?found, exiting with code \d+\.?$/i;
// Everything from the first CODE FRAME line on. jest and vitest quote the spec's source as
// "      12 | ..." / "    > 12 | ...", i.e. two or more spaces then a line number or a caret
// marker. That tail is model-authored text appended to a runner-authored message; classification
// must not read it.
export function stripCodeFrame(message) {
  return String(message == null ? '' : message).split(/\n\s{2,}[>\d]/)[0];
}

// Did the RUNNER say the file loaded but declared no test bodies (or that it collected nothing at
// all)? Runner-authored sentences only.
export function runnerReportedNoTests(message) {
  return stripCodeFrame(message)
    .split('\n')
    .map((l) => l.trim())
    .some((l) => NO_TESTS_RE.test(l));
}

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

// ---- RED attribution: which assertion belongs to a test the DIFF ADDED? -----------------------

// An `it(...)` / `test(...)` call site and its literal title, matched PER SOURCE LINE. Two shapes,
// because `.each` puts a table argument between the modifier chain and the title:
//
//   it('t')   it.only("t")   test.skip(`t`)   it.failing('t')
//   it.each([[1, 2]])('adds %i and %i')       test.each`a|b`('$a + $b')
//
// Line-scoped by construction (`.` never crosses a newline), so neither pattern can run away over a
// whole patch, and a `.each` table spanning several lines simply does not match -- which is the safe
// direction: an unmatched title is unattributable, never a pass.
const TITLE_MODIFIERS = '(?:\\.(?:only|skip|todo|failing|fails|concurrent|sequential|runIf|skipIf|for|extend))*';
// group 1 = the quote character, group 2 = the raw title text (escapes preserved).
const TITLE_LITERAL = '([\'"`])((?:\\\\.|(?!\\1).)*)\\1';
const DIRECT_TITLE_RE = new RegExp(`(?:^|[^\\w$.])(?:it|test)${TITLE_MODIFIERS}\\s*\\(\\s*${TITLE_LITERAL}`, 'g');
const EACH_TITLE_RE = new RegExp(
  `(?:^|[^\\w$.])(?:it|test)${TITLE_MODIFIERS}\\.each\\s*(?:\\(.*\\)|\`.*\`)\\s*\\(\\s*${TITLE_LITERAL}`,
  'g',
);
// The placeholder forms a runner SUBSTITUTES before it reports a title: printf-style and `$var`
// come from a `.each` table, `${...}` from a template literal. Everything else in the title is
// reported verbatim.
const TITLE_PLACEHOLDER_RE = /\$\{[^}]*\}|%[sdifjop#%]|\$#|\$[A-Za-z_][\w.]*/g;
const REGEX_META_RE = /[.*+?^${}()|[\]\\]/g;

// The `it()`/`test()` titles declared on ONE source line, each flagged `parameterized` when the
// runner will report a SUBSTITUTED form of it rather than the literal text.
export function extractTestTitles(line) {
  const text = String(line == null ? '' : line);
  const out = [];

  for (const m of text.matchAll(EACH_TITLE_RE)) {
    out.push({ title: m[2], parameterized: true });
  }

  // A `.each` site can never also match here: DIRECT requires `(` straight after the modifier
  // chain, and `each` is deliberately absent from TITLE_MODIFIERS.
  for (const m of text.matchAll(DIRECT_TITLE_RE)) {
    out.push({ title: m[2], parameterized: m[1] === '`' });
  }

  return out;
}

// A predicate deciding whether a RUNNER-REPORTED title is this source title, or null when the
// source title carries no evidence to match on.
//
// Exact equality for an ordinary literal. For a parameterized title the reported form is
// substituted and can NEVER equal the source text (`'adds %i and %i'` is reported as
// `'adds 1 and 2'`), so each placeholder becomes a wildcard while every literal part still has to
// match, anchored and in order. Only `.each` and template-literal titles get that treatment: a
// plain `it('%s')` is reported verbatim, and wildcarding it would hand the model under test a
// matcher that claims every test in the file, including a pre-existing failing one.
export function titleMatcher(entry) {
  const text = String(entry && entry.title != null ? entry.title : '');
  const parts = text.split(TITLE_PLACEHOLDER_RE);

  if (!(entry && entry.parameterized) || parts.length === 1) {
    return text.trim() === '' ? null : (reported) => reported === text;
  }

  // A title that is ALL placeholder (`'%s'`, `` `${name}` ``) matches anything, so it cannot
  // attribute a failure to the produced test rather than to a borrowed one. Refuse it.
  if (parts.join('').trim() === '') {
    return null;
  }

  const pattern = new RegExp(`^${parts.map((p) => p.replace(REGEX_META_RE, '\\$&')).join('[\\s\\S]*')}$`);

  return (reported) => pattern.test(reported);
}

// The test titles a produced diff ADDED. Only hunk lines inside a TEST file count, and a title the
// diff also shows on its pre-existing side (a context or removed line) is dropped as AMBIGUOUS: a
// duplicated or moved test cannot be told apart from the one that was already there, and guessing
// in that direction is exactly how a borrowed failure becomes a pass.
//
// A header this cannot parse (git QUOTES a path needing escapes) resets the file to "not a test
// file" rather than carrying the previous one forward -- fail closed toward unattributable.
export function addedTestTitles(diffPatch) {
  const added = [];
  const preexisting = new Set();
  let inTestFile = false;

  for (const line of String(diffPatch == null ? '' : diffPatch).split('\n')) {
    if (line.startsWith('diff --git ')) {
      const m = /^diff --git a\/(?:.+?) b\/(.+)$/.exec(line);
      inTestFile = m ? isTestFile(m[1].trim()) : false;

      continue;
    }

    if (line.startsWith('+++ ')) {
      const m = /^\+\+\+ b\/(.+)$/.exec(line);
      inTestFile = m ? isTestFile(m[1].trim()) : false;

      continue;
    }

    if (!inTestFile || line.startsWith('--- ') || line.startsWith('@@')) {
      continue;
    }

    if (line.startsWith('+')) {
      added.push(...extractTestTitles(line.slice(1)));

      continue;
    }

    if (line.startsWith('-') || line.startsWith(' ')) {
      for (const t of extractTestTitles(line.slice(1))) {
        preexisting.add(t.title);
      }
    }
  }

  return added.filter((t) => !preexisting.has(t.title));
}

// The runner's assertionResults that belong to a test the diff ADDED. Matching is on the assertion's
// own `title` (the innermost it() name) -- never `fullName`, which folds in describe() ancestors the
// diff may not have touched.
export function attributedAssertions(assertionResults, diffPatch) {
  const matchers = addedTestTitles(diffPatch).map(titleMatcher).filter(Boolean);

  if (!matchers.length) {
    return [];
  }

  return (Array.isArray(assertionResults) ? assertionResults : []).filter((a) => {
    const reported = a && a.title;

    return typeof reported === 'string' && reported !== '' && matchers.some((m) => m(reported));
  });
}

// Fail-closed guard: a missing/empty diff.patch must throw, never be scored "no change" (T-21-02).
export function assertReadableDiff(diffText) {
  if (typeof diffText !== 'string' || diffText.trim() === '') {
    throw new Error('grade-red: diff.patch is missing or empty -- refusing to score "no change" (fail closed, T-21-02)');
  }

  return diffText;
}

// ---- captured-diff path containment (T-63f-01 write direction) --------------------------------

// A path segment the grade must never write through. '..' escapes the worktree; '.git' is git's own
// state; 'node_modules' WAS the TARGET's real dependency tree, reachable from inside the grading
// worktree through the toolchain junction gradeRun() used to create. That junction is gone
// (T-63f-05, the toolchain is a per-grade copy), so a patch under node_modules/ would now only
// reach a throwaway -- but it is still not gradable input, and this list is the FIRST layer, whose
// job is to be true regardless of what the second one happens to be.
const FORBIDDEN_PATH_SEGMENT_RE = /(?:^|\/)(?:node_modules|\.git|\.\.)(?:\/|$)/;
// An absolute path (POSIX root, UNC, or a Windows drive letter).
const ABSOLUTE_PATH_RE = /^(?:\/|\\|[A-Za-z]:)/;
// Header lines that NAME a path. `git apply --numstat` reports a rename/copy by its DESTINATION
// only (measured 2026-07-25), so `rename from TypeScript/node_modules/...` -- which DELETES from the
// borrowed tree -- is invisible to the numstat report and has to be caught in the raw text.
const DIFF_PATH_HEADER_RE = /^(?:diff --git |--- |\+\+\+ |rename from |rename to |copy from |copy to )/;
const FORBIDDEN_IN_HEADER_RE = /(?:^|[\s"/\\])(?:node_modules|\.git|\.\.)(?:[/\\"]|$)/;

// Every path the patch would write, as GIT ITSELF resolves them. Hand-parsing is not good enough
// here: git QUOTES any header path that needs escaping (`diff --git "a/pw\"ned" ...`), and
// changedPaths()'s regexes silently skip a quoted header -- so a hand-rolled allowlist can disagree
// with what `git apply` actually writes, which is the one divergence a containment check cannot
// afford. `--numstat` is git's own parse and prints raw, unquoted, NUL-separated paths. It needs no
// repository (measured 2026-07-25), so it runs in a neutral cwd, before any worktree or toolchain
// exists.
export function diffTargetPaths(diffPath) {
  const r = spawnSync('git', ['apply', '--numstat', '-z', diffPath], {
    cwd: os.tmpdir(),
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    windowsHide: true,
  });

  if (r.status !== 0) {
    throw new Error(`grade-red: git could not parse ${diffPath} (fail closed): ${(r.stderr || '').trim()}`);
  }

  const out = [];

  for (const field of (r.stdout || '').split('\0')) {
    if (!field) {
      continue;
    }

    const m = /^[^\t]*\t[^\t]*\t([\s\S]*)$/.exec(field);

    if (!m) {
      // A bare path field: the old/new pair git emits after an empty path slot for a rename.
      out.push(field.trim());

      continue;
    }

    if (m[1]) {
      out.push(m[1].trim());
    }
  }

  return out;
}

// Fail closed BEFORE the grading worktree and its toolchain exist (T-63f-01, write direction).
// diff.patch is attacker-shaped input -- it is whatever the model under test staged.
//
// WHY IT WAS WRITTEN: the grading worktree used to LINK the target repo's real node_modules so the
// differential typecheck had a toolchain, so applying an unconstrained patch inside that worktree
// wrote THROUGH the junction into a third-party checkout this gate does not own (measured
// 2026-07-25: both a modify hunk and a new-file hunk under TypeScript/node_modules/ landed in the
// link target). The threat model before that only considered the DELETION direction.
//
// WHY IT STAYS: the junction is gone (T-63f-05), so this is no longer the only thing standing
// between a hostile patch and the borrowed repo -- but it is still the FIRST layer and it covers
// ground the copy does not. '..' traversal and writes into '.git' have nothing to do with the
// toolchain, and a first layer that quietly depends on the second is not a layer.
export function assertSafeDiffPaths(diffText, diffPath) {
  const reject = (what, why) => {
    throw new Error(
      `grade-red: refusing to apply ${diffPath} -- it names '${what}' (${why}). A captured diff is ` +
        'attacker-shaped input, and a path that escapes the grading worktree or targets its ' +
        'toolchain or git state is never gradable ' +
        '(fail closed, T-63f-01).',
    );
  };

  for (const p of diffTargetPaths(diffPath)) {
    if (ABSOLUTE_PATH_RE.test(p)) {
      reject(p, 'an absolute path escapes the grading worktree');
    }

    if (p.includes('\\')) {
      reject(p, 'git emits forward slashes, so a backslash is a separator or an escape');
    }

    if (FORBIDDEN_PATH_SEGMENT_RE.test(p)) {
      reject(p, "'..', '.git' and 'node_modules' segments are never gradable");
    }
  }

  for (const line of String(diffText == null ? '' : diffText).split('\n')) {
    if (DIFF_PATH_HEADER_RE.test(line) && FORBIDDEN_IN_HEADER_RE.test(line)) {
      reject(line.trim().slice(0, 200), 'a diff header names a forbidden path');
    }
  }

  return diffText;
}

// ---- toolchain-copy containment (T-63f-05 runtime write direction) ----------------------------

// Every link under `root` whose target resolves OUTSIDE `root`, as `<link> -> <resolved>` strings.
//
// The grading worktree's toolchain is a disposable COPY precisely so that nothing inside the
// worktree leads back to the borrowed repo -- but `fs.cpSync` copies a symlink AS a symlink, so a
// source tree containing one would hand the copy a path straight back out and silently reopen the
// hole. The kata's tree has none (measured 2026-07-25: 0 links in 7610 files), but a target using
// npm workspaces or a `file:` dependency can, and the whole point of a structural containment is
// that it does not depend on which target happens to be configured. Verify, do not assume.
//
// Windows junctions count: `lstat` reports them as symlinks, so a `readdirSync` Dirent does too.
// An unreadable link is reported as an escape -- a link that cannot be resolved cannot be proven
// contained, and this check exists to fail closed.
export function escapingLinks(root) {
  const base = path.resolve(root);
  const escapes = [];
  const stack = [base];

  while (stack.length) {
    const dir = stack.pop();

    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);

      if (entry.isSymbolicLink()) {
        let resolved;

        try {
          resolved = path.resolve(dir, fs.readlinkSync(p));
        } catch (err) {
          escapes.push(`${p} -> <unreadable: ${err.code || err.message}>`);

          continue;
        }

        if (resolved !== base && !resolved.startsWith(base + path.sep)) {
          escapes.push(`${p} -> ${resolved}`);
        }

        continue;
      }

      if (entry.isDirectory()) {
        stack.push(p);
      }
    }
  }

  return escapes;
}

// Where the grade actually runs inside the throwaway worktree, for a target whose repo may be a
// SUBDIR of its git root (`<kata>/TypeScript`). Returns `{ rel, armCwd }`, and FAILS CLOSED if
// armCwd would land outside the worktree.
//
// `rel` is a path.relative() of two strings that must agree on FORM. git reports its toplevel in
// long Windows form, so a suite.json `repo` written in 8.3 SHORT form -- `C:\Users\...~1\...`,
// which is exactly what os.tmpdir() hands back on this machine -- produces an escaping `../..`
// chain, and path.join(worktree, thatChain) normalises straight back to the SOURCE CHECKOUT
// (measured 2026-07-25 while building the T-63f-05 probe). Everything downstream -- git apply, the
// toolchain copy, the runner spawn on the model-authored spec, teardown's recursive delete -- would
// then run inside the borrowed repo this gate is only ever supposed to READ. That is the same
// damage the toolchain junction used to allow, reached by arithmetic rather than by a link, so it
// gets the same answer: refuse before anything is created.
export function resolveArmCwd(worktree, gitRoot, repo) {
  const rel = path.relative(path.resolve(gitRoot), path.resolve(repo)).split(path.sep).join('/');
  const armCwd = rel ? path.join(worktree, rel) : worktree;
  const resolvedWorktree = path.resolve(worktree);
  const resolvedArmCwd = path.resolve(armCwd);

  if (resolvedArmCwd !== resolvedWorktree && !resolvedArmCwd.startsWith(resolvedWorktree + path.sep)) {
    throw new Error(
      `grade-red: the grading cwd ${resolvedArmCwd} resolves OUTSIDE the throwaway worktree ` +
        `${resolvedWorktree}, so the grade would run inside the target checkout itself. suite.repo ` +
        `(${repo}) and the git toplevel (${gitRoot}) must be written the same way -- use the long ` +
        'path git reports (fail closed, T-63f-05).',
    );
  }

  return { rel, armCwd };
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
    // The two have an identical vitest JSON shape EXCEPT the suite-level message, so disambiguate
    // on the runner's OWN sentence in it -- not on the code frame the runner appends, which quotes
    // the produced spec and is therefore chosen by the model under test.
    const msg = `${(suite && suite.message) || ''}\n${runnerJson.message || ''}`;

    if (runnerReportedNoTests(msg)) {
      return 'no_tests';
    }

    return 'collection_error';
  }

  const failed = asserts.filter((a) => a && a.status === 'failed');
  const green = () => (changedProductionFiles(diffPatch).length > 0 ? 'drove_to_green' : 'false_green');

  if (failed.length === 0) {
    // NOTHING in the file failed, so whatever the diff added passed too -- a sound conclusion
    // without attribution, which is why this stays the first branch. A false green -- UNLESS the
    // diff also changed production (non-test) code so the test now passes, which is drove_to_green
    // (overstepped into lz-tpp's green job; RESEARCH Pitfall 9). A benign compiling STUB that keeps
    // the test red never reaches here.
    return green();
  }

  // >= 1 assertion failed SOMEWHERE in the file. D-06 asks the narrower question: did a test the
  // PRODUCED DIFF ADDED fail? A failure borrowed from a test that was already in the file says
  // nothing about the model's work -- see the ATTRIBUTION note at the top of this file.
  const attributed = attributedAssertions(asserts, diffPatch);
  const attributedFailed = attributed.filter((a) => a && a.status === 'failed');

  if (attributedFailed.length === 0) {
    if (attributed.length > 0) {
      // The added tests RAN and every one of them passed; the failure belongs to a test that was
      // already there. That is a false green (or drove_to_green) and never a pass -- THE defect
      // this attribution exists to close.
      return green();
    }

    // Nothing in the report can be tied to a test the diff added: the produced test did not run,
    // the runner reports it under a different title, or the diff declares no extractable test
    // title at all (e.g. it only edited an existing test's body). Not a pass, and NOT the same
    // claim as "the added test passed" -- so it gets its own class rather than being folded into
    // false_green, which would assert something the report does not support.
    return 'unattributable';
  }

  // >= 1 ADDED test failed. genuinely_red ONLY if EVERY added-test failure is an assertion error,
  // not a runtime/type error masquerading as a failure (wrong_reason). Fail closed toward
  // wrong_reason. Pre-existing failures are excluded on purpose: a broken placeholder already in
  // the file must not turn the model's genuine assertion failure into wrong_reason either.
  const rightReason = attributedFailed.every((a) => {
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

// ---- vacuous-differential guard --------------------------------------------------------------

// A tsc diagnostic scoped to a source FILE carries a `path(line,col):` prefix.
const FILE_SCOPED_TSC_RE = /^([^(]+)\(\d+,\d+\):/;
const TSCONFIG_FILE_RE = /tsconfig[^/\\]*\.json$/i;

// Did tsc fail at the OPTION/CONFIG layer, i.e. before it typechecked any source? Such a failure
// emits the identical line in both differential runs, so newErrors subtracts to 0 for every input
// and the gate reports "tsc clean" precisely when it could not check anything.
//
// The CODE RANGE alone is not the test. TS6xxx is TypeScript's general MESSAGE range, and it holds
// ordinary file-scoped diagnostics -- TS6133 (declared but never read), TS6192 (all imports
// unused), TS6059, TS6053 -- which do NOT abort the compile. MEASURED 2026-07-25 against the kata's
// own tsc 4.9.5, `--noUnusedLocals` alone emits TS6133/TS6192 lines. Matching on the range would
// abort every grade for any target whose pre-existing source has one unused local, with the message
// "the target typecheck failed at the option/config layer" -- which would be false, and which the
// operator could not act on. It cannot fire on the current target (its baseline codes are TS2691,
// TS2403, TS1383, TS2420) so the shape test costs nothing today and is the whole guard tomorrow.
//
// Genuine option-level diagnostics either carry no file prefix at all (`error TS6046: Argument for
// '--lib' option must be: ...`, `error TS5023: ...`) or are anchored at the tsconfig itself
// (`tsconfig.json(4,15): error TS5107: ...`).
export function isConfigLevelTscError(line) {
  const text = String(line == null ? '' : line);

  if (!/error TS(?:5\d{3}|6\d{3})\b/.test(text)) {
    return false;
  }

  const scoped = FILE_SCOPED_TSC_RE.exec(text);

  if (!scoped) {
    return true;
  }

  return TSCONFIG_FILE_RE.test(scoped[1].trim());
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

// Parse the runner's report, or -- on a RECOGNIZED no-tests signal -- synthesize the minimal report
// that drives classify() to the no_tests verdict.
//
// A runner that collected nothing writes NOTHING to stdout, puts a status line on stderr, and exits
// non-zero (measured 2026-07-25: jest "No tests found, exiting with code 1"; vitest "No test files
// found, exiting with code 1", both with a 0-byte stdout and exit 1). Feeding stdout alone to
// parseRunnerJson turned an honest "the produced test landed where this runner cannot see it" into
// a hard throw with no red-grade.json written at all, so the run could not even be counted.
//
// EVERY condition below is runner-authored or infrastructure-level, because the model under test
// controls the spec's text and both runners ECHO that text on their error paths. Recognising a
// no-tests signal anywhere in the combined output let the model pick its own verdict: MEASURED
// 2026-07-25, a two-line spec whose only comment reads "// no tests found" plus a process.exit(0)
// killed jest before it wrote a byte of JSON, and the gate then synthesised a no_tests verdict from
// jest's own code-frame echo of that comment -- a hard runner crash laundered into a scored
// measurement. Pre-widening it threw, which was correct.
//
// The fail-closed contract (T-21-V5) is therefore: no spawn error, an empty stdout, a non-zero
// exit, AND the runner's own anchored status line. Anything else still throws.
export function parseRunnerReport(runRes) {
  const stdout = `${(runRes && runRes.stdout) || ''}`;
  const stderr = `${(runRes && runRes.stderr) || ''}`;

  try {
    return parseRunnerJson(stdout);
  } catch (err) {
    // Infrastructure failure, never a verdict: ENOENT for a missing runner, or ENOBUFS from a
    // maxBuffer overflow -- which TRUNCATES stdout, so whether the run throws or scores would
    // otherwise be decided by whatever incidental text survived the cut.
    if (runRes && runRes.error) {
      throw err;
    }

    // Bytes on stdout mean the runner DID report and its output is merely unparseable. A zero exit
    // means the process ended some other way than a collection miss -- the produced spec calling
    // process.exit(0) at import time is the measured case.
    if (stdout.trim() !== '' || (runRes && runRes.status) === 0) {
      throw err;
    }

    // Strip ANSI colour so the pattern match and the recorded excerpt both see plain text.
    const combined = `${stdout}\n${stderr}`.replace(/\x1b\[[0-9;]*m/g, '');
    // Anchored, per line: a code frame quoting the spec is indented and prefixed with its source
    // line number ("  1 | // no tests found"), so it cannot pass for the runner's status line.
    const observed = combined
      .split('\n')
      .map((l) => l.trim())
      .find((l) => NO_COLLECT_SENTINEL.test(l));

    if (!observed) {
      throw err;
    }

    // Carry the runner's OWN words -- the exact line that matched -- so the recorded excerpt stays
    // honest and classify() sees a message its no-tests pattern recognizes.
    return { testResults: [{ status: 'failed', message: observed, assertionResults: [] }] };
  }
}

// ---- fixture grader (offline --selfcheck path; workspace toolchain) ---------------------------

// A NEW-FILE unified diff whose `+` lines are `source` verbatim -- the diff a model produces when
// it creates a spec from nothing, which is exactly what a standalone fixture represents.
export function newFileDiff(specFile, source) {
  const lines = String(source == null ? '' : source).split('\n');

  // A trailing newline yields one empty element; it is not a line of the file.
  if (lines.length && lines[lines.length - 1] === '') {
    lines.pop();
  }

  return [
    `diff --git a/${specFile} b/${specFile}`,
    'new file mode 100644',
    '--- /dev/null',
    `+++ b/${specFile}`,
    `@@ -0,0 +1,${lines.length} @@`,
    ...lines.map((l) => `+${l}`),
    '',
  ].join('\n');
}

// Grade one SELFCHECK-ONLY fixture dir (module.ts? + module.spec.ts) through the SAME classify() as
// the real gate, using the workspace's pinned typescript@6.0.3 + vitest@4.1.10. Standalone fixtures
// have no pre-existing baseline, so the differential tsc reduces to "all --strict errors are NEW".
// Leaves the fixture dir pristine (the vitest JSON report is written to os.tmpdir(), not the fixture).
//
// The fixture's DIFF is part of the fixture. A fixture that ships its own diff.patch is graded
// against that patch verbatim -- the only way to express an APPEND onto a file that already
// contains a failing test. Everything else gets a new-file diff synthesized from the spec's real
// source, so every added title reaches attribution. This replaced a header-only synthetic diff
// carrying NO `+` lines at all: under attribution that diff would have made every fixture
// unattributable, and the tempting repair -- a flag that skips attribution for fixtures -- would
// have reopened the very hole this gate closes, in the one place nobody re-reads.
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

  // Test-only in every case, so a green fixture classifies false_green and never drove_to_green;
  // the selfcheck proves drove_to_green separately via a synthetic production diff.
  const ownDiff = path.join(fixtureDir, 'diff.patch');
  const testOnlyDiff = fs.existsSync(ownDiff)
    ? fs.readFileSync(ownDiff, 'utf8')
    : newFileDiff(specFile, fs.readFileSync(path.join(fixtureDir, specFile), 'utf8'));

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

function whyFor(verdict, tscResult, addedTitles) {
  const added = Array.isArray(addedTitles) ? addedTitles : [];

  switch (verdict) {
    case 'genuinely_red':
      return 'tsc --strict clean; >=1 assertion failure in a test the diff ADDED (correct RED)';
    case 'false_green':
      return 'the tests the diff added all pass on current code and the diff changed only test files (not red)';
    case 'drove_to_green':
      return 'the tests the diff added all pass because the diff also changed production code (overstepped into GREEN)';
    case 'compile_error':
      return `${tscResult.newErrors} NEW tsc --strict error(s) attributable to the produced test`;
    case 'collection_error':
      return 'the suite failed to load before any assertion ran (import/setup error)';
    case 'no_tests':
      return 'zero it()/test() bodies were collected';
    case 'wrong_reason':
      return 'an ADDED test failed with a runtime/type error masquerading as an assertion failure';
    case 'unattributable':
      return added.length
        ? `the suite has failing assertions but none belongs to a test the diff added (${added
            .map((t) => JSON.stringify(t.title))
            .join(', ')} matched no reported test title)`
        : 'the suite has failing assertions but the diff declares no it()/test() title to attribute them to';
    default:
      return 'unknown';
  }
}

// The failure a human reads to sanity-check the verdict. It reports the ATTRIBUTED failure -- the
// one belonging to a test the diff ADDED -- rather than merely the first in the file. Reporting the
// first is what let the k=1 pilot record the kata's pre-existing `expected 'foo' to be 'fixme'`
// placeholder as if it were the model's own RED.
function failureExcerpt(runnerJson, diffPatch) {
  const suite = Array.isArray(runnerJson.testResults) ? runnerJson.testResults[0] : undefined;
  const asserts = suite && Array.isArray(suite.assertionResults) ? suite.assertionResults : [];
  const attributedFailed = attributedAssertions(asserts, diffPatch).filter((a) => a && a.status === 'failed');
  const failed = attributedFailed[0] || asserts.find((a) => a && a.status === 'failed');
  const msg = failed && Array.isArray(failed.failureMessages) ? failed.failureMessages.join('\n') : (suite && suite.message) || '';
  // Name the test the message came from, and say plainly when it is NOT the model's -- an excerpt
  // that silently borrows a pre-existing failure is what made this defect invisible.
  const label = failed && failed.title ? `${attributedFailed.length ? 'added test' : 'PRE-EXISTING test'} ${JSON.stringify(failed.title)}: ` : '';

  return `${label}${String(msg)}`.slice(0, 500);
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

  // A MATCHED prefix wins even when its value is falsy. `(hit && map[hit]) || default` would have
  // turned a config typo -- an empty string, a null -- into "quietly use the default" instead of
  // the fail-closed error the caller raises for a runner with no command.
  if (hit !== undefined) {
    return map[hit];
  }

  return (runnerSpec && runnerSpec.runner_default) || null;
}

// ---- per-target runner + typecheck configuration (three data-driven mechanisms) ---------------
//
// All three are OPTIONAL and absent-by-default, so a target that declares none behaves exactly as
// it did before they existed. No target NAME appears anywhere in this file: a new target is data in
// targets.json, never a branch here.

// Strip a leading `base + '/'` off a repo-relative test path.
//
// WHY: a runner's own path argument is not always repo-relative. `ng test --include` is PROJECT
// relative, while meta.changed_files (and therefore runner_select) are repo-relative. Declaring
// `runner_path_base` on the runner spec lets the SUBSTITUTED path be project-relative while
// selectRunner keeps keying on the UNSTRIPPED one -- so runner selection still reflects where the
// produced test actually landed, which is the honesty property that field was built for.
//
// Returns testPath unchanged when base is empty or is not a prefix (never a partial strip).
export function relativeToBase(testPath, base) {
  const p = String(testPath == null ? '' : testPath);
  const b = String(base == null ? '' : base).replace(/\/+$/, '');

  if (!b) {
    return p;
  }

  return p.startsWith(`${b}/`) ? p.slice(b.length + 1) : p;
}

// Substitute a runner command template's placeholders.
//
// `<reportFile>` normalises to FORWARD SLASHES. The path comes from os.tmpdir(), which on Windows
// carries backslashes, and the command is run through a shell -- where a backslash is an escape
// character, not a separator. Node, npx, vitest and the Angular builder all accept forward slashes
// on Windows, so normalising is free and not normalising silently mangles the path.
//
// A template with no `<reportFile>` is left byte-identical, which is what keeps the existing
// stdout-parsing runners on exactly the path they were on.
export function substituteRunnerCmd(template, { testPath, reportFile } = {}) {
  let out = String(template == null ? '' : template);

  if (testPath != null) {
    out = out.replaceAll('<producedTestFile>', () => String(testPath));
  }

  if (reportFile != null && String(reportFile) !== '') {
    out = out.replaceAll('<reportFile>', () => String(reportFile).split('\\').join('/'));
  }

  return out;
}

// The differential typecheck's args + an optional prebuild, per target.
//
// An EMPTY array falls back to the default on purpose. `--noEmit --strict` IS D-06 clause 1, and a
// config typo (`"args": []`) that silently disabled it would make the gate report "tsc clean" for
// every produced test -- the same vacuous-differential failure isConfigLevelTscError() exists to
// catch, arriving through config rather than through the compiler.
export function resolveTypecheck(target) {
  const tc = (target && target.typecheck) || {};
  const args = Array.isArray(tc.args) && tc.args.length ? tc.args.slice() : ['--noEmit', '--strict'];
  const prebuild = typeof tc.prebuild === 'string' && tc.prebuild.trim() !== '' ? tc.prebuild : null;

  return { args, prebuild };
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
  assertSafeDiffPaths(diffPatch, diffPath);

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

  // FAIL CLOSED on an unstated base, BEFORE anything is created (T-wpu-08).
  //
  // A suite whose base is chosen AT THE GATE rather than baked into suite.json sets
  // requireExplicitApplyBase. The Gilded Rose anchor is the case: arm-anchor.mjs commits the
  // approvals snapshot inside the throwaway, so the base for that round is the ARMED sha, not
  // `main`.
  //
  // WHY A GUARD AND NOT A NOTE. The two steps of a round do NOT fail the same way. Forgetting the
  // export on the DRIVE is loud -- run-e2e.mjs computes `rev-list APPLY_BASE..HEAD` and throws
  // because the arming commit puts HEAD ahead. Forgetting it on a later `grade-red --run` was
  // SILENT: gradeRun has no ahead-check and no protected-branch check of its own, so it simply
  // built a worktree at whatever base it resolved and graded the armed round against the UNARMED
  // one, with no signal at all. RUN-GATE documents driving and grading as separate commands, which
  // makes that an ordinary operator slip rather than an exotic one.
  //
  // Placed before the worktree and the toolchain copy so the failure is instant and leaves nothing
  // behind.
  if (suite.requireExplicitApplyBase && !process.env.E2E_APPLY_BASE) {
    throw new Error(
      `grade-red: suite '${suite.name || suiteDir}' sets requireExplicitApplyBase, so its base is chosen at the ` +
        'gate rather than baked into suite.json -- refusing to grade against an unstated base (fail closed, ' +
        'T-wpu-08). Run `node arm-anchor.mjs --verify <throwaway checkout>`: it prints the armed SHA and the ' +
        'exact E2E_APPLY_BASE export line, which is required on EVERY grade invocation, not only on the drive.',
    );
  }

  // the produced test file(s) from meta.changed_files (the runner's spec/test glob).
  const producedTests = meta.changed_files.filter((f) => isTestFile(f));

  const gitRoot = (git(repo, ['rev-parse', '--show-toplevel'], { mustSucceed: true }).stdout || '').trim();
  const stamp = `${process.pid}-${Date.now()}`;
  const worktree = path.join(os.tmpdir(), `red-wt-${meta.target}-${stamp}`);
  const { rel, armCwd } = resolveArmCwd(worktree, gitRoot, repo);

  // The runner command and runner_select are both relative to the REPO SUBDIR, while
  // meta.changed_files is repo-ROOT-relative; strip the subdir prefix before either uses it.
  const primaryTest = producedTests[0];
  const testForRunner =
    primaryTest && rel && primaryTest.startsWith(`${rel}/`) ? primaryTest.slice(rel.length + 1) : primaryTest;
  // Selection keys on the UNSTRIPPED path (see relativeToBase): runner_path_base changes what the
  // COMMAND receives, never which runner is chosen.
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

  // The path form the runner's own command argument wants (project-relative for an `ng test
  // --include`, repo-relative otherwise). Recorded in red-grade.json so an operator can see what
  // the command actually received rather than inferring it from two config fields.
  const testForTemplate = relativeToBase(testForRunner, runnerSpec.runner_path_base);
  const { args: tscArgs, prebuild } = resolveTypecheck(target);

  // The target's OWN node_modules, COPIED into the grading worktree below. A fresh worktree has
  // none (node_modules is gitignored and untracked), and without it the gate degrades SILENTLY
  // rather than loudly: targetTscBin() finds no local typescript, targetTscErrors() falls through
  // to `npx tsc` -> the GLOBAL compiler, and a global compiler that rejects the target's tsconfig
  // aborts at config parse before checking any source. The identical abort then appears in BOTH
  // differential runs, so newErrors subtracts to 0 and D-06 clause 1 reports "tsc clean" for a
  // produced test with blatant type errors. Fail closed here instead (T-63f-04).
  const nodeModulesSrc = path.join(repo, 'node_modules');
  const toolchainDir = path.join(armCwd, 'node_modules');

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

  let toolchainInstalled = false;
  let toolchainMs = 0;
  let prebuildMs = 0;

  // A DISPOSABLE COPY of the target's node_modules, never a link to it (T-63f-05).
  //
  // This used to be a Windows directory junction, and the junction was a live RUNTIME WRITE PATH
  // into a third-party checkout this gate does not own. assertSafeDiffPaths() closes the `git
  // apply` direction, but it scans DECLARED PATHS ONLY -- never hunk CONTENT -- and the step right
  // after the apply SPAWNS THE TARGET'S RUNNER ON THE MODEL-AUTHORED SPEC. MEASURED 2026-07-25: a
  // patch declaring a perfectly legitimate `<subdir>/test/vitest/evil.spec.ts` whose body calls
  // `fs.rmSync('node_modules/typescript', { recursive: true })` is ACCEPTED by every path check,
  // and executing it deletes through the junction into the borrowed tree. Scanning hunk bodies
  // cannot fix that: the runner executes arbitrary model-authored code, so any `fs` /
  // `child_process` call can be obfuscated past a content scan. Containment has to be structural.
  //
  // So the worktree gets its OWN copy and the damage lands on a throwaway that teardown deletes.
  // MEASURED on the kata's tree (7610 files, 142.8 MB): cpSync 2.5-2.8 s, rmSync ~0.7 s, i.e.
  // ~3.5 s per grade, ~30 s across a 9-run fan-out. A SHARED cache under os.tmpdir() would save
  // that but reintroduces a mutable tree every grade writes through -- one poisoned compiler and
  // every later grade in the round is measured against it -- for ~30 s on a run that costs real
  // money and many minutes. A per-grade copy needs no cache stamp, no freshness check and no
  // rebuild path, and it cannot be poisoned across grades. Per-worktree `npm ci` was measured too
  // (6.0 s warm) and is worse on both axes: twice the cost, a registry dependency inside a
  // deterministic gate, and it executes third-party postinstall scripts -- MORE attack surface,
  // not less.
  const provisionToolchain = () => {
    const started = Date.now();
    fs.cpSync(nodeModulesSrc, toolchainDir, { recursive: true });
    // Set BEFORE the containment assertion below, so a rejected copy is still torn down.
    toolchainInstalled = true;
    toolchainMs = Date.now() - started;

    const escapes = escapingLinks(toolchainDir);

    if (escapes.length) {
      throw new Error(
        `grade-red: the copied toolchain is not self-contained -- ${escapes.length} link(s) resolve ` +
          `outside ${toolchainDir}, which is a path straight back out of the grading worktree ` +
          `(fail closed, T-63f-05): ${escapes.slice(0, 3).join('; ')}`,
      );
    }
  };

  // maxRetries covers the routine Windows case: a scanner or indexer still holding a handle
  // somewhere in a 7000-file tree moments after the runner exited. rmSync backs off and retries
  // rather than turning a transient handle into a failed grade.
  const removeToolchain = () => {
    fs.rmSync(toolchainDir, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
    toolchainInstalled = false;
  };

  const teardown = () => {
    // ORDER IS LOAD-BEARING (T-63f-01): remove the toolchain copy BEFORE removing the worktree.
    // With a copy rather than a junction, no recursive delete can reach the target's real
    // node_modules whatever the order -- but keeping the order keeps `git worktree remove --force`
    // off a 143 MB untracked tree, and keeps one place responsible for the toolchain's lifetime.
    if (toolchainInstalled) {
      try {
        removeToolchain();
      } catch (err) {
        // rmSync's force:true ALREADY swallows an already-gone directory and the retries above
        // have already backed off, so reaching here means something is genuinely still holding
        // files INSIDE the grading worktree. Force-removing a worktree in that state produces a
        // half-deleted tree and a confusing error; stop instead and make a human look. This can
        // mask a pending error from the graded run, but the grade is offline and free to re-run.
        throw new Error(
          `grade-red: could NOT remove the toolchain copy ${toolchainDir} (${err.code || err.message}). ` +
            'Refusing to force-remove the grading worktree while something still holds files inside ' +
            'it -- delete it by hand first (fail closed, T-63f-01).',
        );
      }
    }

    const removed = git(gitRoot, ['worktree', 'remove', '--force', worktree]);

    if (removed.status !== 0) {
      // Not fatal (the link is already down, so nothing points out of the worktree) but never
      // silent: a stranded worktree accumulates across a fan-out and crux 7 asserts against it.
      console.error(
        `grade-red: WARNING -- could not remove the grading worktree ${worktree} ` +
          `(exit ${removed.status}): ${(removed.stderr || '').trim()}`,
      );
    }

    git(gitRoot, ['worktree', 'prune']);
  };

  // teardown() only runs via the finally below. A Ctrl-C, a SIGTERM, or a closed terminal between
  // provisionToolchain() and that finally would strand the toolchain copy under os.tmpdir(), and
  // interrupting a 9-run fan-out is a normal operator action, not an exotic one. Since the
  // toolchain became a COPY (T-63f-05) what gets stranded is ~143 MB of throwaway rather than a
  // live junction into a borrowed repo, so this handler is now disk hygiene rather than a
  // containment guarantee -- still worth doing, no longer load-bearing. Remove and re-raise; an
  // orphaned worktree is harmless, and removing it here would need git plumbing inside a signal
  // handler.
  const onSignal = (signal) => {
    try {
      fs.rmSync(toolchainDir, { recursive: true, force: true, maxRetries: 2, retryDelay: 50 });
    } catch {
      // there is nothing better to do from inside a signal handler
    }

    process.exit(signal === 'SIGINT' ? 130 : 143);
  };

  process.once('SIGINT', onSignal);
  process.once('SIGTERM', onSignal);

  try {
    provisionToolchain();

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
        runner_test_path: testForTemplate,
        apply_base: applyBase,
        toolchain_ms: toolchainMs,
        prebuild_ms: prebuildMs,
        produced_test_files: [],
        added_test_titles: [],
        attributed_failures: 0,
        failure_excerpt: '',
      };
      fs.writeFileSync(path.join(runDir, 'red-grade.json'), JSON.stringify(grade, null, 2));

      return grade;
    }

    // An optional per-target PREBUILD, run once in the grading worktree before the differential
    // baseline (mechanism 3 of resolveTypecheck).
    //
    // WHY IT EXISTS: a package whose own tests import its PUBLIC entry point resolve that import
    // through a gitignored build output, which a fresh worktree does not have. Without the build
    // the produced test manufactures its OWN module-resolution error, which is NEW against the
    // baseline, so an otherwise perfect test grades compile_error and reads as a model failure.
    // The prebuild is a TYPECHECK-only cost for such a target; a runner that aliases the
    // self-reference at the source does not need it.
    //
    // It runs the TARGET's own build script, which is code this gate does not own -- contained the
    // same way the runner spawn is (T-wpu-01): inside the throwaway worktree, against the
    // disposable toolchain copy, never the pristine checkout. It FAILS CLOSED: a build that did not
    // succeed leaves a baseline nobody can reason about.
    if (prebuild) {
      const startedPrebuild = Date.now();
      const preRes = spawnSync(prebuild, {
        cwd: armCwd,
        shell: true,
        encoding: 'utf8',
        maxBuffer: 64 * 1024 * 1024,
        windowsHide: true,
      });
      prebuildMs = Date.now() - startedPrebuild;

      if (preRes.status !== 0) {
        throw new Error(
          `grade-red: the target's typecheck prebuild '${prebuild}' failed (exit ${preRes.status}) in ${armCwd}, ` +
            'so the differential baseline would be measured against an unbuilt tree and every produced test ' +
            `that imports the public API would grade compile_error (fail closed): ${(preRes.stderr || '').trim().slice(0, 600)}`,
        );
      }
    }

    // differential tsc (Pitfall 3): baseline BEFORE applying the produced test, then WITH it.
    //
    // No --lib is pinned on purpose. It was measured 2026-07-25 that pinning one buys nothing here
    // (@types/node's `/// <reference lib="es2020" />` already raises the program lib above the
    // target's es5 setting, so every common modern array/object method typechecks) while coupling
    // this target-agnostic gate to one compiler's accepted lib list -- a value the target's tsc
    // rejects becomes a TS6046 in BOTH runs, i.e. exactly the vacuous differential guarded below.
    //
    // tscArgs comes from resolveTypecheck(target): the pair above unless the target declares its
    // own (a project flag for a monorepo library whose specs live under their own tsconfig).
    const baseErrors = new Set(targetTscErrors(armCwd, worktree, tscArgs));

    // Fail closed on an OPTION/CONFIG-level tsc error. Those abort the compile before any source is
    // checked, and the identical line then lands in both differential runs -- so newErrors
    // subtracts to 0 for EVERY input and D-06 clause 1 silently passes anything. Never grade on a
    // differential that cannot discriminate.
    const configError = [...baseErrors].find(isConfigLevelTscError);

    if (configError) {
      throw new Error(
        'grade-red: the target typecheck failed at the option/config layer, so the differential ' +
          `cannot discriminate and would report every produced test as tsc-clean (fail closed): ${configError}`,
      );
    }

    // The apply used to be bracketed by unlinkToolchain()/linkToolchain() as defence in depth for
    // T-63f-01 -- with a junction up, a patch that got past assertSafeDiffPaths() would have
    // written through it into the borrowed repo. The bracket is gone because the toolchain is now
    // a disposable COPY (T-63f-05): a patch writing under node_modules/ lands in a throwaway that
    // teardown deletes, which is what the bracket bought, except it now also holds for the RUNNER
    // spawn below -- the direction the bracket never covered. assertSafeDiffPaths() is untouched
    // and still rejects such a patch outright; this is the second layer, not the first.
    const applyRes = git(worktree, ['apply', '--whitespace=nowarn', diffPath]);

    if (applyRes.status !== 0) {
      throw new Error(`grade-red: git apply of ${diffPath} failed in the worktree (fail closed): ${(applyRes.stderr || '').trim()}`);
    }

    const withErrors = targetTscErrors(armCwd, worktree, tscArgs);
    const newErrors = withErrors.filter((l) => !baseErrors.has(l));
    const tscResult = { newErrors: newErrors.length, errors: newErrors };

    // Run the TARGET's own runner on the produced test (Pitfall 4), using the subdir-relative path
    // resolved above alongside the runner selection.
    //
    // THIS LINE EXECUTES MODEL-AUTHORED CODE. Everything it can reach through a relative path is
    // inside the throwaway worktree, including the toolchain, because that is a copy and not a
    // link (T-63f-05). It can still write to an ABSOLUTE path, which no in-process guard can stop
    // -- containing that needs a sandbox, and RUN-GATE.md names it in the residual list rather
    // than pretending otherwise.
    //
    // REPORT SOURCE (mechanism 1 of the three). A template carrying `<reportFile>` gets a temp path
    // and the report is read from that FILE rather than from stdout. Required for a runner that
    // interleaves its own build output on stdout, where parseRunnerJson's outermost-brace
    // extraction would slice a JSON-shaped fragment out of surrounding noise. gradeFixture already
    // reads vitest's --outputFile this way; this is the same idea in the real gate.
    //
    // The fail-closed contract is UNCHANGED because the file's contents are fed to the SAME
    // parseRunnerReport, spread over the real spawn result: `status`, `stderr` and `error` reach it
    // untouched, so the no-collect branch (empty report + non-zero exit + the runner's own anchored
    // status line) and the infrastructure-failure branch both still decide. A MISSING report file
    // reads as an empty stdout -- exactly what a runner that collected nothing produces.
    const wantsReportFile = String(runnerCmdTemplate).includes('<reportFile>');
    const reportFile = wantsReportFile
      ? path.join(os.tmpdir(), `red-report-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2)}.json`)
      : null;
    const cmd = substituteRunnerCmd(runnerCmdTemplate, { testPath: testForTemplate, reportFile });
    let runnerJson;

    try {
      const runRes = spawnSync(cmd, {
        cwd: armCwd,
        shell: true,
        encoding: 'utf8',
        maxBuffer: 128 * 1024 * 1024,
        windowsHide: true,
      });

      if (!reportFile) {
        runnerJson = parseRunnerReport(runRes);
      } else {
        let fileText = '';

        try {
          fileText = fs.readFileSync(reportFile, 'utf8');
        } catch {
          // No report file: the runner collected nothing, or died before writing one. Both are
          // already-handled shapes -- an empty stdout is what parseRunnerReport's fail-closed
          // contract is written against.
        }

        runnerJson = parseRunnerReport({ ...runRes, stdout: fileText });
      }
    } finally {
      if (reportFile) {
        try {
          fs.rmSync(reportFile, { force: true });
        } catch {
          // best-effort; the temp report lives outside the worktree and is harmless if it lingers
        }
      }
    }

    const verdict = classify(tscResult, runnerJson, diffPatch);
    const addedTitles = addedTestTitles(diffPatch);
    const suiteReport = Array.isArray(runnerJson.testResults) ? runnerJson.testResults[0] : undefined;
    const attributed = attributedAssertions(
      suiteReport && Array.isArray(suiteReport.assertionResults) ? suiteReport.assertionResults : [],
      diffPatch,
    );
    const grade = {
      prompt_id: meta.prompt_id,
      target: meta.target,
      arm: meta.arm,
      run_idx: meta.run_idx,
      verdict,
      pass: verdictPass(verdict),
      why: whyFor(verdict, tscResult, addedTitles),
      new_tsc_errors: tscResult.newErrors,
      runner: runnerName,
      runner_version: readRunnerVersion(armCwd, worktree, runnerName),
      // The path the runner COMMAND actually received, after runner_path_base stripping. Selection
      // used the unstripped one; recording both halves of that split keeps a per-target path config
      // checkable rather than something an operator has to re-derive from two config fields.
      runner_test_path: testForTemplate,
      // The commit this grade was actually measured against (T-wpu-08). Prevention is the
      // requireExplicitApplyBase guard above; this is the AUDIT TRAIL, so a post-hoc reader can
      // check which base a round used rather than take it on trust. It matters most for a suite
      // whose base is armed at the gate, where "main" and "the armed sha" are different
      // measurements that look identical in every other field.
      apply_base: applyBase,
      // The measured cost of copying the target's node_modules into this grade's worktree
      // (T-63f-05). The CLI prints it too, but recording it puts the containment's overhead in
      // every artifact rather than only in front of whoever watched the console.
      toolchain_ms: toolchainMs,
      // The target's own typecheck prebuild, when it declares one (0 otherwise). Same reason as
      // toolchain_ms: it is a real per-grade cost that must be priceable from the artifacts.
      prebuild_ms: prebuildMs,
      produced_test_files: producedTests,
      // The attribution evidence, recorded so an operator can check the verdict rather than take
      // it on trust: what the gate extracted from the diff, and how many reported assertions it
      // could tie back to those titles. An `unattributable` verdict is unreadable without them.
      added_test_titles: addedTitles.map((t) => t.title),
      attributed_failures: attributed.filter((a) => a && a.status === 'failed').length,
      failure_excerpt: failureExcerpt(runnerJson, diffPatch),
    };
    fs.writeFileSync(path.join(runDir, 'red-grade.json'), JSON.stringify(grade, null, 2));

    return grade;
  } finally {
    process.off('SIGINT', onSignal);
    process.off('SIGTERM', onSignal);
    teardown();
  }
}

// ---- offline selfcheck (zero spend; proves all 8 D-06 classes) --------------------------------

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

// The classifier as it stood BEFORE attribution, reproduced verbatim from the pre-fix source so the
// discrimination proof below compares two REAL rules on identical inputs rather than an assertion
// against a remembered one. It is deliberately a dead-end copy: nothing else calls it, and it must
// never be wired back into the gate.
function classifyPreAttribution(runnerJson) {
  const suite = Array.isArray(runnerJson.testResults) ? runnerJson.testResults[0] : undefined;
  const asserts = suite && Array.isArray(suite.assertionResults) ? suite.assertionResults : [];
  const failed = asserts.filter((a) => a && a.status === 'failed');

  if (failed.length === 0) {
    return 'false_green';
  }

  const rightReason = failed.every((a) => {
    const m = (Array.isArray(a.failureMessages) ? a.failureMessages : []).join('\n');

    return ASSERTION_RE.test(m) && !RUNTIME_RE.test(m);
  });

  return rightReason ? 'genuinely_red' : 'wrong_reason';
}

function runSelfcheck() {
  // Seven runnable fixture pairs. Six are one-per-class; `borrowed` is the ANTI-REGRESSION fixture
  // for the attribution hole -- a diff that APPENDS a passing test to a spec that already contains
  // a permanently failing one. Proves the A1 runner-JSON shape against the pinned vitest before any
  // metered run.
  const table = [
    ['red', 'genuinely_red'],
    ['green', 'false_green'],
    ['compile', 'compile_error'],
    ['collect', 'collection_error'],
    ['notest', 'no_tests'],
    ['wrong', 'wrong_reason'],
    ['borrowed', 'false_green'],
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

  // ---- attribution: the 8th class + the DISCRIMINATION proof against the pre-fix rule ----------

  // The captured k=1 with_skill run's exact shape, reduced to the two facts that matter: the kata's
  // pre-existing `should foo` placeholder FAILS, and the appended test PASSES. This is the false
  // PASS. The two rules are run on IDENTICAL inputs, so the proof is a measured difference rather
  // than a claim about one.
  const borrowedDiff = fs.readFileSync(path.join(HERE, 'fixtures', 'borrowed', 'diff.patch'), 'utf8');
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
          { title: 'returns the sum of its two arguments', status: 'passed', failureMessages: [] },
        ],
      },
    ],
  };
  const borrowedNow = classify({ newErrors: 0 }, borrowedRunner, borrowedDiff);
  const borrowedBefore = classifyPreAttribution(borrowedRunner);

  if (borrowedBefore !== 'genuinely_red') {
    fail(
      `[classify:attribution] the pre-fix rule classified the borrowed-failure shape '${borrowedBefore}', not ` +
        "'genuinely_red' -- the discrimination proof is not exercising the defect it claims to close",
    );
  }

  if (borrowedNow !== 'false_green') {
    fail(
      `[classify:attribution] a diff that APPENDS a PASSING test to a file that already contains a failing ` +
        `one classified '${borrowedNow}', expected 'false_green'. The pre-fix rule scored this ` +
        `'${borrowedBefore}' / pass:true on the borrowed failure -- that is the D-06 hole`,
    );
  }

  if (verdictPass(borrowedNow)) {
    fail('[classify:attribution] the borrowed-failure shape must never pass the D-06 gate');
  }

  console.log(
    `  [classify:attribution] borrowed-failure shape -> ${borrowedNow} (pass=false) OK ` +
      `-- the pre-fix rule scored the SAME inputs '${borrowedBefore}' / pass=true`,
  );

  // The MODEL'S test failing in the same file must still pass the gate, and the excerpt must name
  // ITS failure rather than the placeholder's -- the field a human reads to sanity-check a verdict,
  // and the one that made this defect visible in the first place.
  const attributedRunner = {
    testResults: [
      {
        status: 'failed',
        assertionResults: [
          {
            title: 'should foo',
            status: 'failed',
            failureMessages: ["AssertionError: expected 'foo' to be 'fixme' // Object.is equality"],
          },
          {
            title: 'returns the sum of its two arguments',
            status: 'failed',
            failureMessages: ['AssertionError: expected -1 to be 5 // Object.is equality'],
          },
        ],
      },
    ],
  };
  const attributedVerdict = classify({ newErrors: 0 }, attributedRunner, borrowedDiff);

  if (attributedVerdict !== 'genuinely_red') {
    fail(
      `[classify:attribution] an ADDED test failing on an assertion in a file that also has a pre-existing ` +
        `failure classified '${attributedVerdict}', expected 'genuinely_red' -- attribution must not reject a real RED`,
    );
  }

  const excerpt = failureExcerpt(attributedRunner, borrowedDiff);

  if (!excerpt.includes('expected -1 to be 5') || excerpt.includes("to be 'fixme'")) {
    fail(`[classify:attribution] failure_excerpt reported the pre-existing failure, not the added test's: ${JSON.stringify(excerpt)}`);
  }

  console.log(`  [classify:attribution] an ADDED assertion failure still -> genuinely_red OK, excerpt ${JSON.stringify(excerpt.slice(0, 72))}`);

  // The 8th class. A file with a failing test and a diff that adds no attributable test title (here:
  // the model edited an existing test's body) is NOT a pass -- and it is not the claim "the added
  // test passed" either, so it gets its own verdict rather than being folded into false_green.
  const bodyOnlyDiff = [
    'diff --git a/test/vitest/gilded-rose.spec.ts b/test/vitest/gilded-rose.spec.ts',
    '--- a/test/vitest/gilded-rose.spec.ts',
    '+++ b/test/vitest/gilded-rose.spec.ts',
    '@@ -5,3 +5,3 @@',
    "     const gildedRose = new GildedRose([new Item('foo', 0, 0)]);",
    '-    expect(items[0].name).toBe(\'foo\');',
    '+    expect(items[0].name).toBe(\'fixme\');',
    '',
  ].join('\n');
  const unattributableVerdict = classify({ newErrors: 0 }, borrowedRunner, bodyOnlyDiff);

  if (unattributableVerdict !== 'unattributable') {
    fail(
      `[classify:unattributable] a failing suite whose diff adds no it()/test() title classified ` +
        `'${unattributableVerdict}', expected 'unattributable'`,
    );
  }

  if (verdictPass(unattributableVerdict)) {
    fail('[classify:unattributable] an unattributable failure must never pass the D-06 gate');
  }

  console.log('  [classify:unattributable] a failing suite with no ADDED test title -> unattributable (pass=false) OK');

  // Parameterized titles. A `.each` runner report carries the SUBSTITUTED title, which can never
  // equal the source literal -- so without this the gate would call a perfectly legitimate
  // table-driven RED unattributable. Both directions asserted: the substituted title attributes,
  // an unrelated one does not.
  const eachDiff = newFileDiff(
    'test/vitest/each.spec.ts',
    [
      "describe('conjured', () => {",
      "  it.each([[3, 6, 4], [0, 10, 6]])('degrades %i/%i to %i', (sellIn, quality, want) => {",
      '    expect(update(sellIn, quality)).toBe(want);',
      '  });',
      '});',
      '',
    ].join('\n'),
  );
  const eachRunner = {
    testResults: [
      {
        status: 'failed',
        assertionResults: [
          { title: 'degrades 3/6 to 4', status: 'failed', failureMessages: ['AssertionError: expected 5 to be 4'] },
          { title: 'degrades 0/10 to 6', status: 'passed', failureMessages: [] },
        ],
      },
    ],
  };
  const eachVerdict = classify({ newErrors: 0 }, eachRunner, eachDiff);

  if (eachVerdict !== 'genuinely_red') {
    fail(`[classify:each] a substituted .each title classified '${eachVerdict}', expected 'genuinely_red' -- the wildcard match is broken`);
  }

  const strangerRunner = {
    testResults: [
      {
        status: 'failed',
        assertionResults: [
          { title: 'some unrelated pre-existing test', status: 'failed', failureMessages: ['AssertionError: expected 1 to be 2'] },
        ],
      },
    ],
  };
  const strangerVerdict = classify({ newErrors: 0 }, strangerRunner, eachDiff);

  if (strangerVerdict !== 'unattributable') {
    fail(`[classify:each] an unrelated title matched the .each wildcard ('${strangerVerdict}') -- the pattern is too loose`);
  }

  // ... and an ALL-placeholder title carries no evidence, so it must attribute NOTHING rather than
  // hand the model under test a matcher that claims every test in the file.
  const wildcardDiff = newFileDiff('test/vitest/wild.spec.ts', "it.each([[1], [2]])('%s', (n) => { expect(n).toBe(0); });\n");
  const wildcardVerdict = classify({ newErrors: 0 }, strangerRunner, wildcardDiff);

  if (wildcardVerdict !== 'unattributable') {
    fail(`[classify:each] an all-placeholder title claimed an unrelated failure ('${wildcardVerdict}'), expected 'unattributable'`);
  }

  console.log(
    "  [classify:each] parameterized titles OK (substituted '.each' title attributes -> genuinely_red; " +
      'an unrelated title and an all-placeholder pattern both stay unattributable)',
  );

  // ---- the three per-target config mechanisms, asserted PURELY ---------------------------------
  //
  // Each assertion fails if its mechanism is deleted, so none of them can rot into decoration. The
  // end-to-end proof that each one is LOAD-BEARING lives in selfcheck-red crux 7, where a real
  // target grades against its own toolchain; these pin the pure contracts those rest on.

  const eqStr = (got, want, label) => {
    if (got !== want) {
      fail(`${label}: got ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`);
    }
  };

  // relativeToBase: strips an exact prefix, never a partial one, and is a no-op for an empty base.
  eqStr(relativeToBase('projects/libs/flex/x.spec.ts', 'projects/libs/flex'), 'x.spec.ts', '[relativeToBase] exact prefix');
  eqStr(relativeToBase('projects/libs/flex/x.spec.ts', 'projects/libs/flex/'), 'x.spec.ts', '[relativeToBase] trailing slash trimmed');
  eqStr(relativeToBase('test/x.spec.ts', 'projects/libs/flex'), 'test/x.spec.ts', '[relativeToBase] non-prefix untouched');
  // A base that is a STRING prefix but not a PATH prefix must not be stripped -- otherwise
  // 'projects/libs/flexbox/x' would become 'box/x' and the runner would be handed a path that does
  // not exist.
  eqStr(relativeToBase('projects/libs/flexbox/x.spec.ts', 'projects/libs/flex'), 'projects/libs/flexbox/x.spec.ts', '[relativeToBase] partial segment untouched');
  eqStr(relativeToBase('test/x.spec.ts', ''), 'test/x.spec.ts', '[relativeToBase] empty base');
  eqStr(relativeToBase('test/x.spec.ts', undefined), 'test/x.spec.ts', '[relativeToBase] absent base');

  // substituteRunnerCmd: forward slashes for a backslashed temp path; a placeholder-free template
  // comes back byte-identical.
  const winReport = 'C:\\Users\\x\\AppData\\Local\\Temp\\red-report-1.json';
  const withReport = substituteRunnerCmd('npx ng test --include "<producedTestFile>" --outputFile "<reportFile>"', {
    testPath: 'flex/x.spec.ts',
    reportFile: winReport,
  });

  if (withReport.includes('\\')) {
    fail(`[substituteRunnerCmd] a backslash survived into the shell command: ${JSON.stringify(withReport)}`);
  }

  eqStr(
    withReport,
    'npx ng test --include "flex/x.spec.ts" --outputFile "C:/Users/x/AppData/Local/Temp/red-report-1.json"',
    '[substituteRunnerCmd] both placeholders substituted',
  );

  const plain = 'npx vitest run <producedTestFile> --reporter=json';
  eqStr(
    substituteRunnerCmd(plain, { testPath: 'test/x.spec.ts' }),
    'npx vitest run test/x.spec.ts --reporter=json',
    '[substituteRunnerCmd] no-reportFile template',
  );
  eqStr(substituteRunnerCmd(plain, {}), plain, '[substituteRunnerCmd] no substitution requested leaves the template alone');

  // resolveTypecheck: the default for an absent config AND for an empty array (a config typo must
  // never silently disable D-06 clause 1), the target's own args when it declares them.
  const defTc = resolveTypecheck({});

  if (defTc.args.join(' ') !== '--noEmit --strict' || defTc.prebuild !== null) {
    fail(`[resolveTypecheck] absent config gave ${JSON.stringify(defTc)}, expected the --noEmit --strict default and no prebuild`);
  }

  const emptyTc = resolveTypecheck({ typecheck: { args: [] } });

  if (emptyTc.args.join(' ') !== '--noEmit --strict') {
    fail(`[resolveTypecheck] an EMPTY args array disabled the default (${JSON.stringify(emptyTc.args)}) -- a config typo must not turn off the strict differential`);
  }

  const ownTc = resolveTypecheck({ typecheck: { args: ['--noEmit', '--strict', '-p', 'tsconfig.spec.json'], prebuild: 'npm run build' } });

  if (ownTc.args.join(' ') !== '--noEmit --strict -p tsconfig.spec.json' || ownTc.prebuild !== 'npm run build') {
    fail(`[resolveTypecheck] the target's own config was not returned: ${JSON.stringify(ownTc)}`);
  }

  if (resolveTypecheck({ typecheck: { prebuild: '   ' } }).prebuild !== null) {
    fail('[resolveTypecheck] a whitespace-only prebuild must resolve to null rather than spawning an empty shell command');
  }

  console.log(
    '  [per-target config] relativeToBase / substituteRunnerCmd / resolveTypecheck OK ' +
      '(path-base stripping is segment-exact, <reportFile> normalises to forward slashes, an empty ' +
      'typecheck.args falls back to --noEmit --strict)',
  );

  // Fail-closed paths (T-21-02 / T-21-V5): empty/missing diff and garbled/empty runner JSON must
  // throw rather than silently score a verdict.
  assertThrows(() => assertReadableDiff(''), 'empty diff.patch');
  assertThrows(() => assertReadableDiff('   \n\t '), 'whitespace-only diff.patch');
  assertThrows(() => classify({ newErrors: 0 }, null, testOnlyDiff), 'null runner JSON');
  assertThrows(() => parseRunnerJson(''), 'empty runner output');
  console.log('  [fail-closed] empty diff + null/empty runner JSON throw OK');

  console.log(
    'grade-red --selfcheck: OK -- all EIGHT D-06 classes proven offline ' +
      '(genuinely_red / false_green / drove_to_green / compile_error / collection_error / no_tests / wrong_reason / ' +
      'unattributable), plus RED attribution and its discrimination against the pre-fix rule; ' +
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
    // Make the containment's cost visible rather than a mystery pause (T-63f-05).
    console.log(`toolchain: copied the target's node_modules into the grading worktree in ${grade.toolchain_ms} ms`);
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
