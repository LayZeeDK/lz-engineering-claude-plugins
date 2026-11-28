---
task: quick-260725-63f
artifact: VERIFICATION
verified: 2026-07-25T00:00:00Z
status: human_needed
score: 6/6 must-haves verified
behavior_unverified: 0
overrides_applied: 0
diff_base: 9f75048
head: d474dfe
method: goal-backward; every claim re-measured against the codebase and git history, not read from the reports
spend: none (zero metered commands; the eval-run-approval-gate was not touched)
bisect_probe: 14/14 workspace-touching commits leave the offline battery exiting 0
kata_end_state: clean status, exactly 1 worktree, only main, node_modules 308 entries, typescript 4.9.5
repo_end_state: gsd/lz-tdd-0.0.3-lz-red @ d474dfe, 1 pre-existing untracked artifact, 1 worktree
human_verification:
  - test: "Decide whether the toolchain junction's RUNTIME write path into the borrowed kata is acceptable before opening the metered fan-out gate."
    expected: "Either a guard/doc entry closing it, or an explicit accepted-risk record. Today it is neither closed nor named anywhere."
    why_human: "It is a NEW risk that no finding named, so no must-have covers it. Whether to spend a fix now or accept it is a scope call, and it gates a metered run."
  - test: "Correct the REVIEW-FIX.md record for IM-04, which claims crux 7 checks 'the same property' as the SIGINT/SIGTERM fix."
    expected: "Either an added check that exercises the signal path, or the same honest 'known coverage gap' wording IM-03 already carries."
    why_human: "The code fix is present and correct; only the coverage claim is wrong. Whether to add a fault-injection seam or just fix the wording is a judgment call."
---

# Quick 260725-63f -- Goal verification

**Task goal:** Audit and triage all findings then address the findings that remain using bisect-safe,
atomic commits.

**Verified:** 2026-07-25
**Status:** human_needed -- the goal IS achieved; two items need a human decision
**Diff base:** `9f75048..d474dfe` (18 commits, 15 files, +2524/-61)

Every claim below was re-measured in this session. The reports were treated as the thing under test.

---

## Goal Achievement

### Observable Truths (PLAN frontmatter `must_haves.truths`)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Each of F1..F5 carries exactly one triage verdict backed by re-verified offline evidence in a committed TRIAGE.md | VERIFIED | `rg -c '^\| F[1-5] +\| (CONFIRMED\|REJECTED\|WONTFIX) '` returns exactly 5; the five ids are distinct (F1/F2/F3/F5 CONFIRMED, F4 REJECTED). File is tracked, last touched `cc3e469`, first landed `a1e45ed`. |
| 2 | The D-06 gate produces a verdict (never an exception) for a fabricated runDir graded against the real kata toolchain | VERIFIED | Live `selfcheck-red.mjs` crux 7: `fabricated runDir -> genuinely_red`. Two further fixtures return verdicts rather than throwing: `canary-nocollect -> no_tests, pass=false`; `canary-compile -> compile_error, 2 NEW tsc errors`. |
| 3 | red-grade.json records the kata's own runner AND a real runner_version (not "unknown") | VERIFIED | Live crux 7: `runner vitest@0.28.5`. The assertion is `/^\d+\.\d+\.\d+/` against `runner_version` plus `g.runner !== 'vitest'`, and vitest 0.28.5 is the kata's own installed version, not the workspace's pinned 4.1.10. |
| 4 | Every CONFIRMED code finding has an offline check that FAILS without its fix and PASSES with it; doc-only findings carry a positive content assertion | VERIFIED | Discrimination measured against the real pre-fix modules extracted from git -- see the table below. Doc-only F5: three distinctive phrases each `post=1 pre=0`. |
| 5 | The borrowed kata is left git-clean, with real node_modules intact and no leftover worktrees or branches | VERIFIED | After the full battery AND 14 detached-checkout battery runs: status 0 lines, 1 worktree, `* main` only, 308 node_modules entries, typescript 4.9.5 resolvable. No `red-wt-*` / `red-canary-*` under the temp dir. |
| 6 | The full offline battery plus `claude plugin validate .` exit 0; zero metered spend | VERIFIED | All six run in this session at HEAD, each exit 0. No `claude -p`, no fan-out, no metered command. |

**Score: 6/6 truths verified (0 present-but-behavior-unverified).**

### Requirements coverage

| Req | Verdict recorded | Fix expected | Fix present | Status |
|-----|------------------|--------------|-------------|--------|
| F1 | CONFIRMED | yes | junction + fail-closed `nodeModulesSrc` check + config-abort guard (`grade-red.mjs:733-742, 752-760, 854-863`) | SATISFIED |
| F2 | CONFIRMED | yes | `selectRunner()` path-keyed + `runner_select` in targets.json + `parseRunnerReport()` | SATISFIED |
| F3 | CONFIRMED | yes | prompt premise deleted; crux 2 state-claim guard (13 tokens) | SATISFIED |
| F4 | REJECTED | **no** | **none** -- verified below | SATISFIED (correctly no-op) |
| F5 | CONFIRMED | yes (doc) | RUN-GATE Step 2 rewritten, Step 3a2 toolchain step added | SATISFIED |

---

## Task-level guarantee 1 -- verdicts, and REJECTED produces no fix

`F4 REJECTED` produced no fix, confirmed three independent ways:

- `grade-red.mjs:849` is still `const tscArgs = ['--noEmit', '--strict'];` -- no `--lib` pin anywhere.
- No `fixtures/canary-modernlib/` exists. The only fixtures added are `canary-rundir`,
  `canary-nocollect` (F1/F2 canaries) and `canary-compile` (IM-02's negative control).
- No CM-4 commit exists; nothing in `9f75048..HEAD` mentions a lib pin.

The one F4-attributable edit is a factual CORRECTION inside TRIAGE.md (`cc3e469`) recording that the
hazard demo tested `es2021`'s successor rather than `es2021` itself. It changes no code and does not
reverse the verdict.

## Task-level guarantee 2 -- BISECT SAFETY (the explicit ask)

14 of the 18 commits touch `.claude/skills/lz-red-workspace/`. Each was checked out detached and the
full offline battery run against it. Method: in-place detached checkout of THIS repo (the kata was
never checked out), restored to `gsd/lz-tdd-0.0.3-lz-red @ d474dfe` by an EXIT trap.

| Commit | grade-red | tabulate | merge-judge | selfcheck-red | check-evals | Kata after |
|--------|-----------|----------|-------------|---------------|-------------|------------|
| a3ee8c1 | 0 | 0 | 0 | 0 | 0 | clean/1/308 |
| 556446b | 0 | 0 | 0 | 0 | 0 | clean/1/308 |
| 6d26b91 | 0 | 0 | 0 | 0 | 0 | clean/1/308 |
| 1714fe4 | 0 | 0 | 0 | 0 | 0 | clean/1/308 |
| f958bab | 0 | 0 | 0 | 0 | 0 | clean/1/308 |
| 9a6f094 | 0 | 0 | 0 | 0 | 0 | clean/1/308 |
| cb8d674 | 0 | 0 | 0 | 0 | 0 | clean/1/308 |
| 5013d55 | 0 | 0 | 0 | 0 | 0 | clean/1/308 |
| f4a2c67 | 0 | 0 | 0 | 0 | 0 | clean/1/308 |
| 087506b | 0 | 0 | 0 | 0 | 0 | clean/1/308 |
| e808f69 | 0 | 0 | 0 | 0 | 0 | clean/1/308 |
| 9f6fd52 | 0 | 0 | 0 | 0 | 0 | clean/1/308 |
| cc3e469 | 0 | 0 | 0 | 0 | 0 | clean/1/308 |
| 13aef5a | 0 | 0 | 0 | 0 | 0 | clean/1/308 |

**14/14 GREEN. Zero non-zero exits anywhere in the probe. No commit lands a knowingly-red state.**
No empty commits; per-commit file counts are 1-5, one concern each.

## Task-level guarantee 3 -- anti-regression discrimination

Measured by loading the REAL pre-fix `grade-red.mjs` from git and replaying the exact inputs the
shipped cruxes use. A check that passes on both versions is vacuous; none of these do.

| Fix | Check | Pre-fix behaviour | Shipped behaviour | Discriminates |
|-----|-------|-------------------|-------------------|---------------|
| CR-01 | crux 8 `checkDiffContainment` | `65391f3` exports no `assertSafeDiffPaths` -> ESM import fails, battery exits non-zero | exports a function; 5 exploit shapes rejected, real captures accepted | YES |
| CR-02 | crux 8 `checkRunnerSignalIsRunnerAuthored` | `9a6f094`'s `NO_TESTS_RE` matched the model-authored code frame, the test title AND a stack frame (all `true`) | anchored sentinel rejects all three, still matches both runners' real status lines | YES |
| CR-03 | crux 8 `checkNoTestsDisambiguationIsRunnerAuthored` | `cb8d674` classify(title steer) -> `no_tests` | classify(title steer) -> `collection_error`; genuine jest sentence still -> `no_tests` | YES |
| IM-01 | crux 8 `checkConfigLevelTscGuard` | pre-fix `/error TS(?:5\d{3}\|6\d{3})\b/` fires on `TS6133` (`true`) | `isConfigLevelTscError(TS6133)` -> `false`; `TS6046` -> `true` | YES |
| IM-02 | crux 7 `canary-compile` | no such fixture; nothing asserted `newErrors > 0` | asserts `compile_error` + `new_tsc_errors > 0`; live result 2 | YES |
| F1 | crux 7 `runner_version` | pre-fix gradeRun throws at the config-abort guard (recorded in SUMMARY) | `vitest@0.28.5` | YES |
| F2(a)(b) | crux 7 `g.runner === 'vitest'` | prose sniff pins jest, which cannot collect `test/vitest/` | routes to vitest | YES |
| F2(c) | crux 7 `canary-nocollect` | threw "runner produced empty output" | `no_tests`, `pass=false` | YES |
| F3 | crux 2 state-claim tokens | pre-edit prompt "are all green right now" trips `all green` | 13 tokens, none present | YES |
| IM-06 | crux 2 `wsPrompt.includes(test_dir)` | prompt named no directory | prompt names `test/vitest/` verbatim | YES |
| F5 / IM-05 / SG-08 | doc-only, exempt | 3 phrases absent pre-edit | 3 phrases present post-edit | YES (content assertion) |
| IM-03 | **NONE** | -- | -- | **NO -- admitted** |
| IM-04 | **NONE** | -- | -- | **NO -- NOT admitted (see W1)** |

**IM-03 is NOT the only undischarged anti-regression claim.** See warning W1.

## Task-level guarantee 4 -- CR-01 containment coverage

Adversarial patches built in a throwaway dir under `os.tmpdir()`. The kata was never referenced.
Every shape the brief named, plus four I added:

| Shape | Result | Caught by |
|-------|--------|-----------|
| modify under node_modules | REJECTED | numstat |
| new file under node_modules | REJECTED | numstat |
| delete under node_modules | REJECTED | numstat + header |
| rename OUT of node_modules (deletes from the borrowed tree) | REJECTED | raw header scan (numstat reports destination only -- confirmed: `["TypeScript/app/stolen.txt"]`) |
| rename INTO node_modules | REJECTED | numstat |
| copy INTO node_modules | REJECTED | numstat |
| copy OUT of node_modules | REJECTED | raw header scan |
| mode change only, under node_modules | REJECTED | numstat |
| quoted header path (`"a/...pw\"ned.txt"`) | REJECTED | both -- numstat unquotes correctly |
| octal-escaped `\156ode_modules` (header scan blind) | REJECTED | numstat unquotes to `TypeScript/node_modules/sneak.txt` |
| `../` traversal out of the worktree | REJECTED | numstat |
| write into `.git/hooks/` | REJECTED | numstat |
| ordinary new test file | accepted | -- |
| production edit | accepted | -- (drove_to_green stays reachable) |
| filename merely CONTAINING "node_modules" | accepted | -- (no false positive) |

The two-parse design is load-bearing and both halves earn their place: the rename-out and copy-out
cases are invisible to numstat, and the octal-escaped case is invisible to the header scan. The
second layer (junction taken down for the duration of `git apply`, `grade-red.mjs:870`) is real --
verified by reading the ordering, and it degrades safely (a patch creating a real `node_modules`
directory makes the subsequent `linkToolchain()` throw EEXIST into the `finally`).

**Verdict: the diff.patch write path is CLOSED.** See warning W2 for a different path.

## Task-level guarantee 5 -- CR-02/CR-03 are not steerable

The recognition signal is now runner-emitted for both runners.

`parseRunnerReport` requires FOUR conditions, all runner- or infrastructure-authored: no
`runRes.error`, empty stdout, non-zero exit, and `NO_COLLECT_SENTINEL` anchored to a whole line.
Measured against the actual pre-fix pattern:

```
label                          PRE-FIX(broad)  SHIPPED(anchored)
jest real status line          true            true
vitest real status line        true            true
spec comment in a code frame   true            false
test title in a code frame     true            false
stack frame mentioning it      true            false
```

`classify()` strips the code frame (`stripCodeFrame`) and matches `NO_TESTS_RE` LINE BY LINE against
a narrow set: jest's "Your test suite must contain at least one test.", vitest's "No test found in
suite ...", plus the synthesised process-level line. Both runners covered; live crux 8 confirms
3 code-frame steers stay `collection_error` and 3 genuine runner messages still classify.

Residual (already documented in REVIEW-FIX, and it holds): a spec that deliberately PRINTS a runner
status line can still earn `no_tests`. Both that and `collection_error` are `pass:false`, so the
headline pass rate cannot be steered -- only the diagnostic breakdown. Accepted as written.

## Task-level guarantee 6 -- fences

| Fence | Result |
|-------|--------|
| Kata git-clean | PASS (`status --porcelain` 0 lines) |
| Kata exactly one worktree | PASS |
| Kata no stray branches | PASS (`* main`) |
| Kata `TypeScript/node_modules` intact | PASS (308 entries; typescript 4.9.5 resolvable) |
| `plugins/lz-tdd/**` untouched | PASS (`git diff --name-only 9f75048..HEAD -- plugins/` -> 0 files) |
| Nothing outside the two permitted trees | PASS (every changed path is under `.claude/skills/lz-red-workspace/` or `.planning/quick/260725-63f-.../`) |
| ASCII-only across the whole diff | PASS (0 non-ASCII bytes in 155,766 bytes of diff) |
| ASCII-only across all 18 commit messages | PASS |
| Email allowlist-inversion over diff content | PASS -- the only email-shaped token is `larsbrinknielsen@gmail.com`, in two places, both quoting the hygiene rule itself |
| Email allowlist-inversion over commit messages | PASS (zero email-shaped tokens) |
| Author/committer identity | PASS (`larsbrinknielsen@gmail.com` on every commit) |
| Untracked REVIEW-FIX.md hygiene | PASS (ASCII-clean, zero email-shaped tokens) |
| Zero metered spend | PASS |

Note: the SUMMARY says the email scan "returns nothing at all". It returns the approved gmail twice.
The allowlist-inversion assertion still holds; the SUMMARY's wording is just stronger than the fact.

## Behavioral spot-checks (run in this session, at HEAD)

| Command | Exit |
|---------|------|
| `node grade-red.mjs --selfcheck` | 0 (all 7 D-06 classes) |
| `node tabulate-mechanical-red.mjs --selfcheck` | 0 |
| `node merge-judge.mjs --selfcheck` | 0 |
| `node selfcheck-red.mjs` | 0 (15 lines; crux 4 SKIP -- no transcript, expected) |
| `node check-evals.mjs` | 0 |
| `claude plugin validate .` | 0 |

---

## Warnings

### W1 -- IM-04 has no discriminating check, and REVIEW-FIX.md says it does

**File:** `.claude/skills/lz-red-workspace/selfcheck-red.mjs:485-491`; claim in REVIEW-FIX.md IM-04.

REVIEW-FIX states: *"crux 7 asserts after each graded run that no `red-wt-*` directory survives under
the temp dir and that no SIGINT/SIGTERM handler accumulated -- the same property, checked where it is
unambiguous."* It is not the same property.

```
listenerCount('SIGINT') with NO handler ever registered: 0   <- crux 7 asserts === 0
```

Delete `process.once('SIGINT', onSignal)`, `process.once('SIGTERM', onSignal)` and both `process.off`
lines and crux 7 still passes: the count is 0 either way, and the `stranded` check passes too because
an uninterrupted run tears down normally regardless. Neither assertion ever exercises the signal path.

This does not make the fix wrong -- the handlers are present and correctly written. It makes the
COVERAGE CLAIM wrong, and it means the brief's premise ("confirm IM-03 is the ONLY undischarged
anti-regression claim") does not hold: there are two. IM-03 is honestly labelled a "known coverage
gap, stated rather than faked"; IM-04 is not.

**Suggested resolution:** downgrade the IM-04 claim to the same honest wording IM-03 already uses, or
add a check that actually exercises the handler (spawn a child that runs gradeRun, send it SIGINT,
assert the junction is gone).

### W2 -- the toolchain junction is still a live RUNTIME write path into the borrowed kata

**File:** `.claude/skills/lz-red-workspace/grade-red.mjs:878-893`.

CR-01 closed the `git apply` direction. It did not close the direction that runs immediately after:

```js
linkToolchain();                                  // :878  junction back UP
const withErrors = targetTscErrors(...);          // :880
const runRes = spawnSync(cmd, { cwd: armCwd, shell: true, ... });   // :887  runs the MODEL'S spec
```

While the model-authored spec executes, `armCwd/node_modules` is a live junction to
`<kata>/TypeScript/node_modules`. Two measurements, neither touching the kata:

1. **The primitive works.** In a throwaway `os.tmpdir()` tree with a junction standing in for the
   borrowed one, a spawned process with `cwd` = the linking directory wrote `PLANTED.txt` into the
   link target and overwrote `SENTINEL.txt` there. The junction is an ordinary write path.
2. **The containment check cannot see it.** `assertSafeDiffPaths` scans numstat paths and diff
   HEADER lines only -- never hunk content. A patch declaring one innocuous path,
   `TypeScript/test/vitest/evil.spec.ts`, whose body calls
   `fs.writeFileSync('node_modules/PLANTED.txt', ...)` and
   `fs.rmSync('node_modules/typescript', { recursive: true })`, was **ACCEPTED**.

Before the F1 fix this was not reachable: the worktree had no `node_modules` at all, so such a write
created a throwaway directory under `%TEMP%`. The junction that fixed F1 introduced it. Strictly, a
spec can also just write to an absolute path -- the runner executes arbitrary model-authored code, so
the borrowed tree was never protected by anything except the diff's declared paths.

Nothing names this. `rg -i 'runtime write|arbitrary code|write at runtime'` over `grade-red.mjs` and
`RUN-GATE.md` returns nothing, and RUN-GATE's "honest list" of residual risks (`:118-144`) states
only that a diff *touching* node_modules is rejected -- a reader would conclude the borrowed tree is
unreachable from a grade. It is not.

**Why this is a WARNING and not a BLOCKER:** no must-have, no triaged finding, and no threat-register
entry covers it. T-63f-01 was written about teardown deletion (mitigated); CR-01 was scoped to
`diff.patch` (closed, verified above). The task's own kata fence -- leave it pristine after THIS work
-- holds. This is a newly-surfaced risk in the instrument's future behaviour.

**Why it still needs a decision now:** the next action on this instrument is opening the metered
fan-out gate, which runs nine model-authored specs with that junction live against a third-party
repo the project promised to leave pristine.

**Cheapest options:** run the runner with the junction down and the toolchain reachable another way;
or copy rather than link `node_modules`; or -- lazy but honest -- add one bullet to RUN-GATE's
residual list and a line to `grade-red.mjs`'s junction comment saying the produced spec executes with
write access to the linked tree, and have the operator verify the kata after each round.

---

## Report accuracy

Claims spot-checked against the codebase. All held except as noted.

| Claim | Source | Verdict |
|-------|--------|---------|
| 4 CONFIRMED / 1 REJECTED, 5 commits in pass 1 | SUMMARY | ACCURATE |
| 10 commits, 9 files changed in the fix pass | REVIEW-FIX | ACCURATE (exactly 9) |
| every commit verified green before it landed | SUMMARY + REVIEW-FIX | ACCURATE (14/14 re-measured) |
| `plugins/lz-tdd` gained zero files | both | ACCURATE |
| email scan "returns nothing at all" | SUMMARY | SLIGHTLY OVERSTATED -- returns the approved gmail twice; the allowlist assertion still holds |
| kata node_modules 311 entries | REVIEW | STALE -- 308 now, and both SUMMARY and REVIEW-FIX say 308. Cosmetic |
| IM-04: "crux 7 checks the same property" | REVIEW-FIX | **INACCURATE** -- see W1 |
| CR-01 fix uses numstat + raw header scan because numstat hides a rename source | REVIEW-FIX | ACCURATE and independently reproduced |
| F4 rejection is correct | REVIEW | Not re-litigated; no fix shipped, which is what this verification checks |

## Cleanliness proof for this verification

The probes wrote nothing into the kata and nothing into the repo. All scratch lived under the session
scratchpad or `os.tmpdir()` and was removed. The 14 detached checkouts were restored by an EXIT trap.

```
kata:  status 0 lines | 1 worktree | * main | node_modules 308 | typescript 4.9.5
repo:  gsd/lz-tdd-0.0.3-lz-red @ d474dfe | 1 worktree
       ?? .planning/quick/260725-63f-.../260725-63f-REVIEW-FIX.md   (pre-existing)
temp:  no red-wt-* / red-canary-* / probe directories
```

---

_Verified: 2026-07-25_
_Verifier: Claude (gsd-verifier), goal-backward, adversarial stance_
