---
task: quick-260725-63f
artifact: REVIEW-FIX
date: 2026-07-25
reviews_input: 260725-63f-REVIEW.md
findings_total: 17
critical_fixed: 3
important_fixed: 6
important_skipped: 0
suggestion_fixed: 8
suggestion_skipped: 0
commits: 10
spend: none (all verification offline; zero metered commands)
kata_end_state: clean status, exactly 1 worktree, only main, node_modules 308 entries (unchanged), typescript intact
scope: .claude/skills/lz-red-workspace/** + this quick task's planning dir; plugins/lz-tdd = 0 files
status: complete
---

# 260725-63f -- Fix pass over the adversarial code review

All 3 Critical and all 6 Important findings are FIXED. All 8 Suggestions are FIXED too -- each
turned out to be nearly free once the finding it rode along with was open, and three of them
(SG-03, SG-05, SG-04) were factually wrong code or docs rather than polish.

Ten atomic commits, each verified green before it landed. Zero metered commands.

## Disposition table

| ID | Severity | Disposition | Commit |
|----|----------|-------------|--------|
| CR-01 | Critical | FIXED | `f958bab` |
| CR-02 | Critical | FIXED | `cb8d674` |
| CR-03 | Critical | FIXED | `5013d55` |
| IM-01 | Important | FIXED | `f4a2c67` |
| IM-02 | Important | FIXED | `087506b` |
| IM-03 | Important | FIXED | `9a6f094` |
| IM-04 | Important | FIXED | `9a6f094` |
| IM-05 | Important | FIXED | `cc3e469` |
| IM-06 | Important | FIXED (by a different mechanism than the review proposed) | `e808f69` |
| SG-01 | Suggestion | FIXED | `9f6fd52` |
| SG-02 | Suggestion | FIXED | `9f6fd52` |
| SG-03 | Suggestion | FIXED | `cb8d674` |
| SG-04 | Suggestion | FIXED | `e808f69` |
| SG-05 | Suggestion | FIXED | `cb8d674` |
| SG-06 | Suggestion | FIXED | `e808f69` |
| SG-07 | Suggestion | FIXED | `e808f69` |
| SG-08 | Suggestion | FIXED | `cc3e469` |
| F4 record correction | (review note) | FIXED in TRIAGE.md | `cc3e469` |

Commits in order:

```
f958bab fix: stop a captured diff writing into the borrowed repo          (CR-01)
9a6f094 fix: make the toolchain junction impossible to strand             (IM-03, IM-04)
cb8d674 fix: take the no-tests signal from the runner, not the spec       (CR-02, SG-03, SG-05)
5013d55 fix: split no_tests from collection_error on runner text only     (CR-03)
f4a2c67 fix: match the config-abort guard on shape, not code range        (IM-01)
087506b test: prove the differential typecheck still discriminates        (IM-02)
e808f69 fix: pin where the produced test lands, and wire test_dir up      (IM-06, SG-04, SG-06, SG-07)
9f6fd52 fix: repair two dead paths in the canary crux                     (SG-01, SG-02)
cc3e469 docs: replace a toolchain remedy that cannot run                  (IM-05, SG-08, F4 record)
13aef5a fix: guard runRes in the exported no-tests parser                 (self-review follow-up)
```

---

## Critical

### CR-01 -- FIXED. `f958bab`

**Fix, two independent layers as requested.**

1. `assertSafeDiffPaths(diffText, diffPath)` runs at the very top of `gradeRun`, immediately after
   `assertReadableDiff` and BEFORE the worktree, the junction, or anything else exists. It rejects
   any path that is absolute (POSIX root, UNC, or a drive letter), contains a backslash, escapes via
   a `..` segment, or carries a `node_modules` or `.git` segment.
2. The junction is taken DOWN for the duration of `git apply` and re-created afterwards
   (`unlinkToolchain()` / `linkToolchain()`), so a patch that somehow got past layer 1 writes into a
   throwaway `%TEMP%` directory -- the pre-junction behaviour -- rather than into the kata.

**Two design decisions worth stating.**

*Paths come from `git apply --numstat -z`, not from a regex.* The review's suggested fix reused
`changedPaths()`. I measured that this is not safe enough: git QUOTES any header path that needs
escaping (`diff --git "a/pw\"ned" ...`) and both of `changedPaths()`'s regexes silently skip a
quoted header, so a hand-rolled allowlist can disagree with what `git apply` actually writes.
`--numstat` is git's own parse of the same file, prints raw unquoted NUL-separated paths, and
(measured) needs no repository at all -- so it runs in a neutral cwd, nowhere near the kata.

*The raw header text is scanned as well,* because `git apply --numstat` reports a rename by its
DESTINATION only. Measured:

```
patch: rename from TypeScript/node_modules/typescript/KEEP.txt
       rename to   TypeScript/app/stolen.txt
git apply --numstat -z  ->  "0\t0\tTypeScript/app/stolen.txt\0"     (source never reported)
```

A rename out of `node_modules` DELETES from the borrowed tree, so a numstat-only check would have
missed exactly the deletion direction T-63f-01 was originally written about. I only found this by
probing the format rather than assuming it matched `git diff --numstat`.

*What stays allowed:* production-file edits. Rejecting those would silently kill the
`drove_to_green` class, which exists precisely to catch a model that edits production code. Crux 8
asserts a production-file patch is still accepted.

**Anti-regression:** `selfcheck-red` crux 8, `checkDiffContainment()`. Five exploit shapes must be
rejected (new file under `node_modules`, modify under `node_modules`, rename OUT of `node_modules`,
`../` traversal, write into `.git/hooks`), and the three shipped real captures plus a production-file
edit must still be accepted. Pure and offline, so it never SKIPs.

**Discrimination:** pre-fix, `grade-red.mjs` exports no such guard --
`git show HEAD:.claude/skills/lz-red-workspace/grade-red.mjs | rg -c assertSafeDiffPaths` returns no
match. Crux 8 imports it by name, so on the pre-fix module the import is `undefined` and the battery
exits non-zero.

I did NOT re-reproduce the write itself. The review already measured it against a throwaway, and my
one attempt to build a throwaway reproduction was blocked by the harness's safety classifier (see
"One process note" below). The containment property is what the crux pins, and it is pinned directly.

### CR-02 -- FIXED. `cb8d674`

The recognition rule is now four conditions, ALL of which must hold, and every one of them is
runner-authored or infrastructure-level:

- no `runRes.error` (ENOENT for a missing runner; ENOBUFS on a maxBuffer overflow, which TRUNCATES
  stdout so the outcome would otherwise turn on whatever text survived the cut) -- this is SG-05;
- stdout empty (bytes there mean the runner reported and its output is merely unparseable);
- a non-zero exit (both runners exit 1 on a collection miss; the measured steer exits 0 because the
  spec calls `process.exit(0)`);
- `NO_COLLECT_SENTINEL`, the runner's own status line ANCHORED to a whole line.

I adopted the review's proposed sentinel essentially verbatim
(`/^no tests? (?:files? )?found, exiting with code \d+\.?$/i`) after checking it against both
runners. The exit-status clause is mine: it is a second independent barrier against the specific
measured steer, which relies on `process.exit(0)`.

**Discrimination, measured on the same stderr:**

```
                                          pre-fix broad match   shipped anchored match
spec comment echoed in a code frame       true                  false
test title echoed in a code frame         true                  false
real jest    "No tests found, ..."        true                  true
real vitest  "No test files found, ..."   true                  true
```

**Anti-regression:** crux 8, `checkRunnerSignalIsRunnerAuthored()` -- six cases that must throw
(comment echo at exit 0 and at exit 1, title echo, spawn ENOENT, truncated stdout) and both real
status lines asserted to classify `no_tests`. The live `canary-nocollect` run in crux 7 confirms the
genuine miss is still a verdict and not a crash.

### CR-03 -- FIXED. `5013d55`

Same discipline, one layer down. `stripCodeFrame()` drops everything from the first code-frame line
on (`\n` + two or more spaces + a digit or `>`), and what remains is matched LINE BY LINE against a
narrow set: the two runners' own suite-level sentences plus the process-level status line
`parseRunnerReport` synthesises.

**Discrimination:**

```
                                          pre-fix           shipped
comment "// no tests found"               no_tests          collection_error
title "says no tests found when empty"    no_tests          collection_error
comment quoting the jest sentence         no_tests          collection_error
genuine jest suite sentence               no_tests          no_tests
genuine vitest suite sentence             no_tests          no_tests
synthesised collection miss               no_tests          no_tests
plain import error, no phrase             collection_error  collection_error
```

The live vitest `notest` fixture in `grade-red --selfcheck` still classifies `no_tests`, so the
narrowed pattern matches the real runner's wording rather than only my reconstruction of it.

**Anti-regression:** crux 8, `checkNoTestsDisambiguationIsRunnerAuthored()` -- three code-frame
steers must stay `collection_error`, three genuine runner messages must still reach `no_tests`.

**Residual, documented not fixed.** A spec that THROWS an error whose text is literally a runner's
suite-level sentence still lands on `no_tests`, because both arrive as an unindented line in the
same field. Separating them needs a structural signal neither runner's JSON exposes for this case.
Both verdicts are `pass:false`, so the headline pass rate cannot move -- only the breakdown can, and
only for a model that deliberately forges a runner status line to earn itself a FAILING verdict.

I considered and rejected two stronger designs, both in the interest of not over-building: a private
`noTestsCollected` flag threaded from the parser into `classify()` (it would have removed the
process-level alternative from the classifier's pattern, but adds a non-runner field to
`classify()`'s contract for no measurable gain), and a structural precondition requiring the produced
test to match no `runner_select` prefix (rejected because jest's roots incidentally cover `app/`,
which is NOT a mapped prefix, so it would produce a false `no_tests` for a spec jest would happily
collect).

---

## Important

### IM-01 -- FIXED. `f4a2c67`

`isConfigLevelTscError()` now discriminates on the diagnostic's SHAPE, not the code range: a genuine
option-level abort either carries no `path(line,col):` prefix at all or is anchored at the tsconfig
itself. I used the review's proposal with a small change -- capturing the filename with `[^(]+` and
testing it against `tsconfig[^/\\]*\.json$` rather than a substring test on the whole line -- so an
absolute Windows path to a tsconfig still matches and a source file merely mentioning "tsconfig"
elsewhere in its message does not.

**Anti-regression:** crux 8, `checkConfigLevelTscGuard()`. Eight lines, all measured during this
audit: four that must NOT fire (`probe.ts(1,1) TS6192`, two `probe.ts TS6133`, plus a `TS2420` from
the kata's real baseline) and four that MUST (`TS6046` from the es2023 hazard, a `TS5023`, and the
two tsconfig-anchored `TS5107`/`TS5101` the global-compiler fall-through produced). This is the
guard's first check of any kind.

### IM-02 -- FIXED. `087506b`

New `fixtures/canary-compile/` -- same fabricated-runDir shape, same vitest-collected directory, one
deliberate type annotation error. Crux 7 asserts `compile_error` / `pass:false` /
`new_tsc_errors > 0` and prints the count. Live result:

```
[crux 7] differential-discriminates canary OK (type-broken spec -> compile_error,
         2 NEW tsc errors against a clean baseline)
```

Exactly the two errors the review predicted (`TS2322` on the annotation, `TS2339` on the method
call). The annotation is deliberately the ONLY defect, so types erase at runtime and vitest still
collects and reports normally -- the fixture exercises the whole pipeline instead of short-circuiting
early. `diff.patch` was generated the way a real capture is (write into a throwaway git repo, stage,
`git diff --cached`), so the headers and root-relative paths are real rather than handcrafted.

The guard half of IM-02 is covered by IM-01's crux above.

### IM-03 -- FIXED. `9a6f094`

The catch is inverted as the review proposed: a genuine unlink failure now throws, naming the link
path, instead of proceeding to `git worktree remove --force` with the link still live. `git worktree
remove`'s discarded exit status is now surfaced as a warning.

I agree with the review that this is worth hardening even though it measured that nothing on this
platform follows a junction. The measurement makes the ordering belt-and-braces rather than the sole
protection, which is exactly why CR-01's path check had to exist -- but "silent leak of a live
junction into a borrowed repo" is still the wrong failure mode to ship.

**Known coverage gap, stated rather than faked.** No offline check pins the inversion itself:
EPERM/EBUSY on a junction cannot be induced deterministically offline, and a mocked failure would
only test the mock. The change is a four-line loud-instead-of-silent inversion.

### IM-04 -- FIXED. `9a6f094`

`process.once('SIGINT'|'SIGTERM', ...)` unlinks the junction and re-raises; the handlers are per-run
and removed in the `finally`. I deliberately did NOT do full teardown in the handler -- an orphaned
worktree with nothing pointing out of it is harmless, and `git worktree remove` inside a signal
handler is more machinery than the risk warrants.

I also SKIPPED the review's second suggestion, a startup sweep refusing to run when a stale
`os.tmpdir()/red-wt-*` exists. It couples independent runs and would false-trip on any concurrent
grade. Instead crux 7 asserts after each graded run that no `red-wt-*` directory survives under the
temp dir.

CORRECTION (gsd-verifier W1, applied 2026-07-25 by the orchestrator). The sentence originally
continued "and that no SIGINT/SIGTERM handler accumulated -- the same property, checked where it is
unambiguous." That coverage claim was WRONG and is withdrawn. The verifier measured
`listenerCount('SIGINT')` as 0 with the handlers deleted, so crux 7 passes either way and does not
discriminate. The IM-04 FIX itself is correct and stands; only its anti-regression claim was false.
IM-04 therefore joins IM-03 as an undischarged anti-regression item: the signal path has no offline
check, because a mid-run SIGINT cannot be induced deterministically without mocking the very thing
under test. Treat BOTH IM-03 and IM-04 as fix-without-regression-test, and re-verify them by hand if
the junction teardown is ever touched again.

### IM-05 -- FIXED. `cc3e469`

Verified the claim independently: `TypeScript/.gitignore` lists `package-lock.json`, so no lockfile
is tracked and a fresh `git worktree add` checkout has none -- while the kata itself DOES have one on
disk. The replacement instruction copies that untracked lockfile into the checkout and then runs
`npm ci` (reproducible), with `npm install` as the fallback. Applied in both RUN-GATE Step 3a2 and
the EVAL-RESULTS recipe.

The `mklink /J` alternative is REMOVED rather than annotated. The apply checkout is where the model
under test runs with write access for the whole metered round, so a junction hands it the borrowed
repo's real dependency tree -- one `npm install` in its turn and a third-party checkout is modified.
That is CR-01's blind spot one layer up, and CR-01's fix does not reach it (that guard protects the
GRADER, not the drive). Removing the option is the only thing that does.

`grade-red`'s own error message at the `nodeModulesSrc` check is unchanged and stays correct: it
names the real kata dir, which has a lockfile.

### IM-06 -- FIXED, by a different mechanism than the review proposed. `e808f69`

I agree the deviation was half-shipped and `test_dir` was inert. But the review's option 2 -- widen
`runner_select` to cover every plausible landing spot -- does NOT work, and I want that on the
record. Selecting a runner does not make it collect: jest matches its argument against files found
under `roots` and vitest against its `include` glob, so an unmapped path stays uncollected whichever
runner is picked. Overriding collection roots per invocation is the only way to make option 2 true,
and the earlier triage already judged that more mechanism than the risk warrants.

So option 1, pinning:

- the prompt gains "under `test/vitest/`" -- one prepositional phrase, byte-identical across all
  three arms (crux 2's parity assertion is structurally preserved), naming a path rather than a
  behavior gap (the 21-01 non-leading property is untouched);
- `test_dir` becomes `test/vitest/` and crux 2 asserts the prompt names it VERBATIM, which is what
  finally gives the field a consumer -- it can no longer drift from the prompt in silence;
- `test/vitest/` rather than `test/jest/` because it accepts BOTH idioms. `vitest.config.ts` enables
  globals, so a jest-flavoured spec using bare `describe`/`it`/`expect` collects there -- measured,
  `canary-rundir` has no import and grades `genuinely_red` -- while a vitest-flavoured spec placed in
  `test/jest/` fails at import. Since the skill under test is Vitest-flavoured throughout its
  examples, pinning the jest dir would have penalised the two skill arms for following the skill.

That last point also closes the import-idiom residual the previous pass documented under CM-6 rather
than fixing. RUN-GATE's residual list is rewritten accordingly (review option 3), and now names the
broader `no_tests` class alongside `collection_error`.

---

## Suggestions -- all FIXED

| ID | What | Note |
|----|------|------|
| SG-01 | `join()` above the `!ctx.repo` guard | Moved below. The guard's null half was unreachable; a `suite.json` without `repo` killed the battery with a TypeError instead of printing SKIP. |
| SG-02 | `fail()` skips the `finally` | Cleanup moved before `fail()` and onto the success path. `process.exit(1)` does not unwind, so every failed canary leaked a temp dir -- and that is exactly the run an operator re-runs while debugging. |
| SG-03 | unreachable fallback string | Deleted as part of the CR-02 rewrite. Confirmed the review's reading: the fallback did not match the pattern that gated it, so had it fired the verdict would have been `collection_error` while the code claimed `no_tests`. |
| SG-04 | `coverage_note` factually wrong | Rewritten as an explicit CORRECTION rather than a silent edit, because a reader who believed the old text would conclude the borrowed tree was unreachable from a grade -- which was untrue for a different reason (CR-01). |
| SG-05 | `runRes.error` / `status` ignored | Both now inspected, in the CR-02 commit. |
| SG-06 | `'right now'` over-broad | Replaced with three forms that pair the adverb with a state word. The guard gets stricter (13 tokens, up from 11), not looser. |
| SG-07 | `selectRunner` falsy fallback | A MATCHED prefix now wins even when its value is falsy, so a config typo reaches the caller's fail-closed error instead of quietly becoming the default. |
| SG-08 | F4 residual missing from the honest list | Added, with the reason a `--lib` pin was rejected, so an operator reading a `compile_error` cluster knows the modern-syntax class exists. |

## F4 record correction -- FIXED in TRIAGE.md. `cc3e469`

The review's correction is right and TRIAGE.md now carries it inline: the hazard demonstration tested
`--lib es2023`, one step past the `es2021` the finding proposed, and `es2021` IS accepted by tsc
4.9.5 (baseline intact, type-broken spec still at `newErrors=2`, `replaceAll` false positive gone).
The REJECTION verdict is unchanged -- the review independently confirmed it -- and the note says so
explicitly, so nobody re-litigates it. Only that one argument is narrower than written.

---

## Verification

All six offline commands exit 0, run against the final tree:

| # | Command | Exit |
|---|---------|------|
| 1 | `node grade-red.mjs --selfcheck` | 0 |
| 2 | `node tabulate-mechanical-red.mjs --selfcheck` | 0 |
| 3 | `node merge-judge.mjs --selfcheck` | 0 |
| 4 | `node selfcheck-red.mjs` | 0 |
| 5 | `node check-evals.mjs` | 0 |
| 6 | `claude plugin validate .` | 0 |

`selfcheck-red` now reports 15 lines: crux 7 grew a third fixture, crux 2 grew the `test_dir` pin,
and crux 8 is new with four blocks.

**Borrowed kata, checked after the last run:**

```
git status --porcelain    (empty)                                   clean
git worktree list         GildedRose-Refactoring-Kata 3e0085b [main]  exactly one
git branch --list         * main                                    no strays
node_modules entries      308                                       identical to the pre-fix baseline
typescript                node_modules/typescript/package.json       present
```

No `red-wt-*`, `red-canary-*`, or probe directory survives under the temp dir.

**Scope:** nine files changed, all under `.claude/skills/lz-red-workspace/` except the TRIAGE.md
correction. `git diff --name-only <base>..HEAD -- plugins/` returns zero files. No dependency added
anywhere; the only install was the workspace's own committed lockfile (`npm ci`), which a fresh
agent worktree needs because `node_modules` is gitignored.

**Hygiene**, by allowlist-inversion over all nine changed files and all ten commits (messages plus
author and committer identity): ASCII-clean everywhere, and the only email-shaped token found
anywhere is the approved public contact. The scan encodes no forbidden value.

**Spend:** none. No `claude -p`, no fan-out, no metered command. Every measurement in this document
came from a throwaway repo under the temp dir, a read-only inspection, or the offline battery.

## One process note

My plan for CR-01 included temporarily neutering `assertSafeDiffPaths` behind an env var to
demonstrate the crux failing without it. The harness's safety classifier DENIED that edit, correctly:
adding an escape hatch to a containment guard is exactly the change that should be blocked, and the
denial was right even though my intent was a two-minute measurement. Nothing of the sort landed --
`rg -n "NEUTER|process.env" grade-red.mjs` shows only the two pre-existing `process.env` reads. I
demonstrated discrimination by other means instead: the pre-fix module from `git show` exports no
guard at all, and the pre-fix vs shipped recognition rules were compared side by side on identical
inputs (both tables above).

## What I would look at next

- The CR-03 residual: a thrown error whose text is a runner's own suite sentence still mislabels one
  `pass:false` verdict as another. Closing it needs a structural signal from the runner JSON that
  neither jest nor vitest exposes for the zero-bodies case; worth a look if a future target's runner
  does expose one.
- The IM-03 inversion has no offline check, for the reason given above. If a fault-injection seam is
  ever added to this workspace for other reasons, that path is the first thing to point it at.

---

_Fix pass: 2026-07-25_
_Input: 260725-63f-REVIEW.md (3 Critical, 6 Important, 8 Suggestion)_
