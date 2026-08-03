# 260725-63f -- Raw findings from the Phase-21 RED apply instrument review (2026-07-25)

**Source:** an orchestrator-side read-only review of the Phase-21 applied-RED eval instrument,
performed in the resume-work session immediately before this quick task. These are CANDIDATE
findings. This task's first job is to AUDIT and TRIAGE them independently (confirm / reject /
wontfix with a reason), then fix only what survives triage.

**Scope fence.** Everything here is NON-SHIPPED dev tooling under
`.claude/skills/lz-red-workspace/` (plus the borrowed kata's config, which is READ-ONLY -- it is a
third-party repo we do not own and must leave pristine). `plugins/lz-tdd/**` MUST NOT be touched.
No dependency may be added to `plugins/lz-tdd`.

**Standing constraints (from CLAUDE.md / AGENTS.md):**

- ASCII-only in every file and commit message; no emoji, no Unicode dashes/quotes.
- Public repo: the only email-shaped token that may appear is the maintainer's public gmail.
  Verify by allowlist-inversion; never write a forbidden value as a search needle.
- Bisect-safe atomic commits: one logical change per commit, each commit leaves the offline
  battery in a self-consistent state.
- Never `git add .` / `-A` / `-u`; stage specific files by name.
- The borrowed kata at `D:/projects/github/emilybache/GildedRose-Refactoring-Kata` must be left
  git-clean with no leftover worktrees or branches.

**Zero-spend fence.** NOTHING in this task may run `claude -p` or any metered command. The
eval-run-approval-gate is still closed. All verification is offline.

---

## Environment facts established during the review (re-verify, do not assume)

- Kata `TypeScript/package.json` devDependencies include `jest@^29.4.3`, `ts-jest@^29.0.5`,
  `vitest@^0.28.5`, `typescript@^4.4.4`.
- Kata `TypeScript/jest.config.ts` sets `roots: ['<rootDir>/app', '<rootDir>/test/jest']`,
  `collectCoverage: true`, and imports `pathsToModuleNameMapper` from `ts-jest` at config load.
- Kata `TypeScript/vitest.config.ts` sets `include: ['test/vitest/**/*.{spec,test}.{js,ts}']`.
- Kata `TypeScript/tsconfig.json` sets `target: es5`, `module: commonjs`, `strict: true`,
  `noImplicitAny: false`, no `lib`, no `types`.
- Kata `TypeScript/.gitignore` ignores `node_modules`, `coverage`, `package-lock.json`,
  `app/**/*.js`, `test/**/*.js`.
- `git ls-files TypeScript/node_modules` returns 0 entries (node_modules is NOT tracked).
- No global `jest` on PATH. A global `tsc` IS on PATH at `~/.local/bin/tsc` (version unverified,
  NOT the kata's 4.4.4).
- All four offline batteries currently exit 0: `grade-red --selfcheck`,
  `tabulate-mechanical-red --selfcheck`, `merge-judge --selfcheck`, `selfcheck-red.mjs`.

---

## F1 -- BLOCKER: the grading worktree has no `node_modules`, so the D-06 gate cannot run

**Where:** `.claude/skills/lz-red-workspace/grade-red.mjs`, `gradeRun()`.

- Line ~459: `git(gitRoot, ['worktree', 'add', '--detach', worktree, applyBase], ...)` builds a
  fresh detached worktree under `os.tmpdir()`.
- Lines ~490-501: the differential typecheck runs immediately in that worktree.
- Lines ~508-515: the target's runner runs immediately in that worktree.
- There is NO `npm ci` / `npm install` anywhere in the file.

**Why it breaks:** `node_modules` is gitignored and untracked, so a fresh worktree has none.
Node/npx module resolution walks UP from cwd; the worktree lives in `os.tmpdir()`, so it never
reaches the kata's real `node_modules`. Therefore:

- `targetTscBin()` (line ~359) finds no local typescript in either `armCwd` or `worktree`, returns
  `null`, and `targetTscErrors()` (line ~384) falls back to `npx tsc` -- which resolves the GLOBAL
  tsc, not the kata's `typescript@^4.4.4`. This directly contradicts the function's own comment
  ("The target repo's own typescript (never the workspace's -- Pitfall 4)").
- `npx jest ... --json` finds no local jest and no global jest. It would attempt a registry fetch
  of a wrong-major jest with no `ts-jest` present; `jest.config.ts` imports `ts-jest` at config
  load, so jest crashes. Empty stdout then makes `parseRunnerJson` throw (line ~515), so
  `gradeRun` throws and writes NO `red-grade.json`.
- `tabulate-mechanical-red.mjs` then fails closed on the missing `red-grade.json` (line ~243).

**Why an operator cannot work around it:** the worktree is created AND torn down inside
`gradeRun`'s try/finally. There is no hook for a pre-install step. This requires a code change.

**Knock-on (assess during triage, may be a separate finding):** RUN-GATE.md Step 3a tells the
operator to create the APPLY checkout with `git worktree add`, which is likewise `node_modules`-less.
The model under test would then have no toolchain to run the test it writes -- which suppresses the
"fail for the right reason" verification behavior in all three arms. Consider whether RUN-GATE.md
needs an explicit install step for the apply checkout.

**Reproduction (offline, zero spend):**

```
# a fresh worktree of the kata has no node_modules
git --git-dir=<kata>/.git worktree add --detach <tmp> main
ls <tmp>/TypeScript/node_modules   # absent
git --git-dir=<kata>/.git worktree remove --force <tmp>
```

**Fix direction (the executor picks and justifies one):** after `worktree add`, link the repo's real
`node_modules` into the worktree before running tsc/the runner -- on Windows this needs
`fs.symlinkSync(target, link, 'junction')` for a directory. Must be created for the dir that
actually runs the commands (`armCwd`), must be torn down / harmless on teardown, and must degrade
with a clear fail-closed error if the source `node_modules` is absent (tell the operator to
`npm ci` in the kata first) rather than silently falling through to `npx`.

---

## F2 -- BLOCKER: the grader is hard-locked to jest, jest cannot see `test/vitest/`, and a miss THROWS

**Where:** `.claude/skills/lz-red-workspace/grade-red.mjs` line ~439 and line ~515;
`.claude/skills/lz-red-workspace/e2e-red-gilded-rose/targets.json` (`runner`, `test_dir`).

```js
const preferJest = /jest/i.test(runnerSpec.runner_preference || '') && runnerSpec.jest;
const runnerName = preferJest ? 'jest' : runnerSpec.vitest ? 'vitest' : runnerSpec.jest ? 'jest' : null;
```

`runner_preference` in targets.json is PROSE that merely mentions the word "jest", so `preferJest`
is always truthy and `runnerName` is always `jest`. Meanwhile targets.json's own `test_dir` is
`test/vitest/` and its `test_dir_note` says a produced spec must land there to be collected.

**Empirically confirmed 2026-07-25** in the kata's real `TypeScript/` dir:

```
npx jest test/vitest/gilded-rose.spec.ts --json
  -> exit 1
  -> stdout: 0 bytes            <-- NOT a JSON verdict
  -> stderr: "No tests found, exiting with code 1"
             "roots: .../app, .../test/jest - 3 matches"
```

Positive control (same command against a file inside `roots`):

```
npx jest test/jest/gilded-rose.spec.ts --json
  -> stdout: 12461 bytes of valid JSON (numTotalTests 1)
```

**Why it breaks:** `gradeRun` feeds ONLY `runRes.stdout` to `parseRunnerJson` (line ~515). Empty
stdout throws "runner produced empty output". So a produced test placed under `test/vitest/` does
not even reach the `no_tests` / `collection_error` classes -- the whole grade hard-fails.

**Second-order problem:** the suite prompt does not say WHERE to put the test, and the kata has
three test dirs (`test/jest`, `test/vitest`, `test/mocha`). Directory choice is uncontrolled and
arm-independent, so the "correctness gate" would partly be measuring which folder the model guessed
rather than RED quality.

**Fix direction (the executor picks and justifies):** (a) stop sniffing prose -- add an explicit
machine-readable runner field, or select the runner from the produced test's actual path; (b) make
the test location deterministic (pin it in the prompt or the target spec) so the runner and the
test dir cannot disagree; (c) feed stderr into the no-tests disambiguation so a "No tests found"
miss classifies as `no_tests` instead of throwing. Keep the fail-closed contract for genuinely
garbled output -- only a RECOGNIZED no-tests signal should become a verdict.

---

## F3 -- the suite prompt's premise is factually false

**Where:** `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/prompts/r1-next-test.md`.

The prompt opens: "The tests for `app/gilded-rose.ts` are all green right now."

Both `test/jest/gilded-rose.spec.ts` and `test/vitest/gilded-rose.spec.ts` in the kata ship the
canonical placeholder:

```ts
it('should foo', () => {
  const gildedRose = new GildedRose([new Item('foo', 0, 0)]);
  const items = gildedRose.updateQuality();
  expect(items[0].name).toBe('fixme');
});
```

which FAILS on current code (confirmed: `numFailedTests: 1` in the positive control above).

**Severity is a triage call.** The false premise is byte-identical across all three arms, so it is
symmetric noise, not an arm bias. But it invites the model to "fix" the placeholder -- a test or
production edit that can trip `drove_to_green` and corrupt the correctness gate. Changing the
prompt has an eval-design cost: the prompt was subagent-reviewed in 21-01 for non-leading phrasing,
so any edit must preserve non-leading, byte-identical-across-arms properties and must not name the
expected smell/behavior. Weigh "fix the premise" against "leave it and document it as a known
caveat in RUN-GATE.md / EVAL-RESULTS.md".

---

## F4 -- false `compile_error` risk from `--strict` against an `es5` target

**Where:** `.claude/skills/lz-red-workspace/grade-red.mjs` line ~490
(`const tscArgs = ['--noEmit', '--strict'];`).

The differential typecheck runs in the kata dir, so tsc picks up the kata `tsconfig.json`
(`target: es5`, no `lib`). Default lib for es5 is ES5 + DOM. A produced test using
`Array.prototype.includes`, `Object.entries`, `Object.values`, or `Array.from` yields genuinely-NEW
TS2550 errors, which the differential cannot absorb (they are not in the pristine baseline) ->
false `compile_error`, i.e. a correct RED test graded as a failure.

Note also that CLI `--strict` re-enables `noImplicitAny`, which the kata tsconfig deliberately sets
to `false`. That inflates the baseline error set, which the differential DOES absorb -- so it is not
a defect by itself, but it is worth a comment so the next reader does not "fix" it.

**Fix direction:** pin an explicit modern `--lib` for the differential typecheck (e.g. es2021 plus
whatever the produced test plausibly needs), or drop the CLI `--strict` override and let the
project's own tsconfig govern. Whichever is chosen, document WHY in a comment, because the current
`--strict` looks deliberate.

---

## F5 (candidate) -- RUN-GATE.md Step 2's canary is weaker and more expensive than necessary

**Where:** `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md`, Step 2.

Step 2 frames the residual risk narrowly as "runner-JSON shape drift" and proposes a canary that
costs ONE real metered run (`grade-red --run <one captured kata runDir>`). F1 and F2 are both
reproducible with ZERO spend using a fabricated `runDir` (a hand-written `diff.patch` plus a
minimal `meta.json` with `arm` / `target` / `prompt_id` / `run_idx` / `changed_files`). A fabricated
-runDir canary is strictly cheaper and catches strictly more.

**Fix direction:** if F1/F2 are fixed, add a zero-spend fabricated-runDir canary (ideally wired into
`selfcheck-red.mjs` so it runs with the rest of the battery) and update RUN-GATE.md Step 2 to
require it before the metered fan-out. This is what would have caught F1 and F2 before spend.

---

## Why the existing green battery missed F1 and F2

Every selfcheck grades `fixtures/*` dirs using the WORKSPACE's pinned `typescript@6.0.3` +
`vitest@4.1.10`, and the workspace DOES have `node_modules`. The kata's toolchain is never
exercised. `selfcheck-red.mjs` crux 3 builds and tears down a worktree but never runs tsc or a
runner inside it. So the battery proves `classify()`'s logic, not that the gate works against the
real target.

Any fix should close that structural gap, not just the two symptoms -- otherwise the next target
repo reintroduces the same class of bug.
