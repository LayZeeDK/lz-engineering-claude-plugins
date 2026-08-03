---
task: 260726-g69
kind: code-review-fix
date: 2026-07-26
review: 260726-g69-REVIEW.md
base: 1640925206b964ed4bf4e1aef7e227ddbd4c0f77
findings_addressed: 1 Critical + 7 Important + 6 of 8 Suggestions
commits: 11
spend: zero (no claude -p, no eval fan-out, no metered command)
---

# 260726-g69 -- Code Review Fix Report

Eleven atomic commits, the battery green before each. **Zero metered spend -- the
eval-run-approval-gate stays CLOSED.**

## Disposition table

| ID | Severity | Disposition | Commit |
|----|----------|-------------|--------|
| CR-01 | Critical | **FIXED** (both halves) | `2ad11e9` |
| IM-01 | Important | **FIXED** -- claim corrected + shape pinned | `cb8e3be` (+ header in `2ad11e9`) |
| IM-02 | Important | **FIXED** (no discrimination possible here -- said plainly) | `8fdf902` |
| IM-03 | Important | **FIXED** | `3868cbb` |
| IM-04 | Important | **FIXED** | `4712bbc` |
| IM-05 | Important | **FIXED** | `e4c89a8` |
| IM-06 | Important | **FIXED** (spawn-status half; the invariant half SKIPPED with reason) | `6f34939` |
| IM-07 | Important | **FIXED** | `0b7d058` |
| SG-01 | Suggestion | **FIXED** | `d67ae04` |
| SG-02 | Suggestion | **FIXED** | `d67ae04` |
| SG-03 | Suggestion | **FIXED** (doc half; code half SKIPPED with reason) | `de3afac` |
| SG-04 | Suggestion | **FIXED** | `d67ae04` |
| SG-05 | Suggestion | **FIXED** | `de3afac` |
| SG-06 | Suggestion | **FIXED** | `de3afac` |
| SG-07 | Suggestion | **FIXED** (comment half; code half SKIPPED with reason) | `d67ae04` |
| SG-08 | Suggestion | **FIXED** | `025cce2` |

---

## CR-01 -- `escapingLinks` never inspects the destination ROOT -- FIXED

**Reproduced first, before changing anything.** Read-only scratchpad probe against the real
exports, junction-rooted destination:

```
src existsSync (FOLLOWS): true      src lstat isSymbolicLink: true
copyToolchainPaths threw: NO
dest is link: true -> C:\...\Temp\cr01-.../outside-store
dest reaches the far side: true
escapingLinks(dest, wt) -> []                        <-- the bug
post-fix escapingLinks(dest, wt) -> ["...\wt\node_modules -> ...\outside-store"]
```

A **second shape** the review did not name, measured on the same path and load-bearing for the
decision below -- a declared source that is a RELATIVE link:

```
src lstat isSymbolicLink: true       copyToolchainPaths threw: NO
dest is link: true -> text ".store\\nm"     dest resolves to an existing dir: false
escapingLinks(dest, wt) THREW: ENOENT
```

### Where the fix belongs, and why BOTH

The reviewer asked for a justification rather than a location. Mine:

**The guard is the root cause of the reported symptom, so it is fixed there.** `escapingLinks` is
exported, and its header promises containment that "does not depend on which target happens to be
configured". A function that returns `[]` for a root it never inspected breaks that on its own
terms, whatever the caller. It now `lstat`s its own root and judges it by *the same rule as every
entry beneath it* -- a link is a LEAF (the walk already never descends into one), reported when it
resolves outside the boundary, never walked through. The per-link comparison moved into one
`linkEscapes()` helper so the root and the walk cannot drift apart.

**The copy site is not redundant, and the relative-link measurement is why.** Under a guard-only
fix, the relative shape becomes an ENOENT crash instead of a clean refusal -- and if such a link
resolved *inside* the worktree the guard would (correctly, by its own contract) call a dangling
toolchain contained. A linked source can never produce a self-contained copy, whichever way it
points, so `copyToolchainPaths` refuses it in the pre-check loop that already runs before anything
is created. That site is also the only one that knows the path came from target CONFIG, so the
message names the target and the entry, and it fires before ~949 MiB of copying rather than after.

Division of responsibility, stated in both comments: **containment** is the guard's job,
**provisioning validity** is the copy site's.

### Discriminating check

`checkLinkedToolchainSource()` in crux 9. One synthetic input (a junction -- `lstat` reports it as
a symbolic link, which is the exact property under test and needs no privilege, so unlike the
relative-link probe it never SKIPs). It asserts:

1. provisioning THROWS, naming the target and the fault;
2. no destination was created;
3. walking INSIDE the linked root really does enumerate the far side -- so the probe **reproduces
   the blind spot** rather than assuming it;
4. `escapingLinks` now reports the linked root.

Without the fix, (1) and (4) both fail. No flag, no env var.

---

## IM-01 -- the two-hop escape the guarantee overstated -- FIXED (claim corrected + pinned)

**Corrected the claim rather than closing the case.** Closing it means `realpath`-ing the resolved
target *and the boundary with it* -- a boundary whose own path contains a symlinked component
(`/tmp` -> `/private/tmp` is the everyday case) would otherwise false-flag every link under it.
That is real regression risk across three suites, spent on a shape whose reachability requires a
symlink COMMITTED in the target's tracked content (measured 0 in all three borrowed repos) and
where everything inside the worktree is already reachable through ordinary relative paths, which
T-g69-07 accepts.

Both live sites now say "a `..` chain whose FIRST hop leaves the worktree", name the un-walked
region, and state the reachability precondition: `escapingLinks`' header and RUN-GATE's residual
bullet.

**Anti-regression for a documentation defect = drift protection.** crux 9's boundary probe now
builds the chain (hop 1 into `wt/content`, hop 2 out of the worktree from there) and PINS it as
permitted. If anyone later closes the case, that assertion FAILS and names the header and the
bullet as the things to rewrite -- doc and code can no longer diverge silently. The narrow-boundary
side was tightened to assert BOTH intra-worktree links, so it still reproduces the pre-change rule.

**Scope note, stated rather than hidden:** `T-g69-01` in `260726-g69-PLAN.md` carries the same
overstated mitigation text. It is left as written -- a plan is the record of what was planned, and
retroactively editing a threat register to match the outcome is the wrong direction. The correction
lives at the two sites a reader consults about the shipped code, and here.

**One commit-hygiene deviation, disclosed:** the header paragraph landed in the CR-01 commit
(`2ad11e9`) rather than in `cb8e3be`, because it is a paragraph inside the same function header
CR-01 rewrote and splitting it would have produced a commit whose comment contradicted its code.
Bisect safety is unaffected (prose).

---

## IM-02 -- the un-fixed sibling copy site -- FIXED

`selfcheck-red.mjs` `buildStandInRepo()` now passes `verbatimSymlinks: true`, with a comment
pointing at `copyToolchainPaths`' note.

**No discriminating check exists on this platform, and that is reported rather than papered over.**
Measured before and after: **0 symlinks across 939 entries** in the workspace `node_modules` (npm
on Windows writes `.bin` entries as `.cmd`/`.ps1` shim FILES), so the change is provably a no-op
here and nothing can be made to fail without it. The property it protects is the one crux 9's
relative-store-link assertion already discriminates at the production site; this is the same option
for the same reason, made consistent so the probe is portable to POSIX.

---

## IM-03 -- the silent SKIP on the only unit check for a Critical-class bug -- FIXED

The parenthetical inside the OK line is gone. The unmeasured case now prints a top-level
`[crux 9] SKIP -- ... a SKIP is not a pass`, and the OK line no longer claims the direction was
measured. The check is NOT deleted.

**No platform-independent substitute exists, and this is the measured reason:** an absolute link is
written unchanged under BOTH `cpSync` settings, so it cannot tell them apart; a junction is the only
directory link Windows grants without Developer Mode, and it is always absolute. Forcing the
fallback would need precisely the test-only switch this project has refused twice.

**Discriminating check:** the branch logic is a pure `verbatimSymlinkSkipNote()`, and
`checkVerbatimSkipIsLoud()` asserts BOTH branches on any platform -- measured produces no line,
unmeasured produces a top-level SKIP containing "a SKIP is not a pass". It fails against the
pre-change shape, which returned a parenthetical.

RUN-GATE Step 2 records the check as platform-conditional, names both SKIP layers (this one and
`canary-rdxf-red`, which SKIPs wherever `primitives-pin` is absent), and tells the operator not to
read exit 0 as covering it. Measured on this machine: it does **not** skip.

---

## IM-04 -- the r1 prompt leaked a diagnosis -- FIXED

Clause cut. The prompt is now:

> Consumers can't style the focused day of the calendar -- their focus styling never applies.
> What's the next failing test you'd write for
> `packages/primitives/calendar/src/calendar-cell-trigger.directive.ts`? Go ahead and add it under
> `packages/primitives/calendar/__tests__/`.

Symptom kept, feature area kept, file path kept, landing directory kept, pointer gone, parity with
`r2-global-locale.md` restored. CAND-2 stays disambiguated from the deferred CAND-3 -- focus state
and outside-visible-view are disjoint symptoms, and both spellings remain on the forbidden list.

`targets.json`'s `prompt_forbidden_tokens_note` records the WITHDRAWN "naming the house convention
as the contract is allowed" carve-out and why, so it cannot be cited later as precedent. The rule
now reads: never the missing attribute, the expected value, the mechanism, the verdict, the fix --
**or a pointer to where the answer can be derived from**.

**Guards re-run after the rewrite:** all 12 forbidden tokens absent (case-insensitive, checked
directly), 0 non-ASCII bytes, and the battery's crux 1+2 green in both directions across 3 RED
suites / 4 prompts x 2 modes with the poisoned prompt still caught.

---

## IM-05 -- `compile_error` recorded only a count -- FIXED

`new_tsc_error_lines` (the actual NEW diagnostics, capped at 10) is written at BOTH
`red-grade.json` sites -- present and empty on the `no_tests` early return, where no differential
ran, because an absent key and an empty array are different claims. The taxonomy is untouched.

**Discriminating check:** `canary-rdxf-compile` asserts the field is PRESENT (`hasOwnProperty`) and
that the recorded lines ARE the counted diagnostics. Measured against the real 55-error baseline,
and the evidence earns its place on the first run:

```
recorded verbatim: "packages/primitives/calendar/__tests__/canary-rdxf-compile.spec.ts(17,15): error TS2322: T"
```

Visibly the produced spec's own file rather than a relocated baseline line -- exactly the
distinction a bare count cannot make. RUN-GATE gains the matching residual.

---

## IM-06 -- the differential could still go vacuous -- FIXED (spawn-status half)

`targetTscErrors` never looked at `status`, `error` or `signal`, so a pass that produced no output
returned `[]`, `newErrors` subtracted to 0, and a type-broken produced test read as **tsc clean**.
Extracted as a pure `tscLinesOrThrow()` that both differential passes route through: it throws on
`error` (spawn failure, ENOBUFS on `maxBuffer` overflow) and on `status === null` (killed by a
signal). The exit CODE cannot detect this -- tsc exits non-zero precisely when it found errors.

**Discriminating check:** pure assertions in `--selfcheck`, both directions. An ordinary non-zero
tsc exit still yields its diagnostics and a clean pass yields none (so the guard is not "always
throws"), while a KILLED pass, a failed spawn and a missing result all throw. The pre-change code
returned `[]` for all three.

**SKIPPED -- the reviewer's baseline-count invariant** (`withErrors.length < baseErrors.size`
throws). Reason: it **false-positives on a plausible shape**. A produced spec that adds a module
augmentation, a `declare`, or a type that changes inference in a shared file can legitimately
RESOLVE a baseline diagnostic -- which is the very mechanism IM-05 describes one finding earlier --
and the run would then fail closed on a correct grade. It also only works on a dirty baseline. The
spawn-status guard covers the actual failure mode (a process that did not run) on every target
without that hazard, which is why it was the "at minimum" ask.

---

## IM-07 -- drive-evidence false positives -- FIXED

Documentation, not code: changing `changedProductionFiles` would also move `classify()`'s
`drove_to_green` split, which D-5 forbids.

The `genuinely_red` + non-empty row now says "a drive ATTEMPT **if the paths are production** --
check the paths first", followed by an explicit caveat: a non-`*.spec.ts` file under `__tests__/`
or `test/` is test SUPPORT, `isTestFile` is a filename match only, and
`config/__tests__/locale-host.component.ts` is a likely benign shape on RXL. The RXL paragraph
below the table repeats the separation instruction where the operator will be looking.

The table also gained the two rows the review asked for: `no_tests` + non-empty (the sharpest drive
shape in the taxonomy, and the reason the early-return write site was extended) and `wrong_reason`
+ non-empty.

No mechanical check -- this is prose the battery does not read.

---

## Suggestions -- taken

- **SG-01 (crux 7 SKIP not target-aware) -- FIXED.** It now reads the fixture's own `meta.target`,
  resolves that target's declared paths and SKIPs loudly if any is missing. A repo with a root
  `node_modules` but no `packages/primitives/node_modules` used to hard-FAIL with "gradeRun threw
  instead of producing a verdict" where the documented behaviour is a SKIP -- an operator reads that
  as a gate regression. Same class as IM-03, so it was not left for later.
- **SG-02 (`.` and `.git` accepted) -- FIXED.** One `if`. All five surviving spellings (`.`, `./`,
  `.//`, `.git`, `.git/objects`) added to the pure rejection list.
- **SG-04 (`linkDir` inside the neighbouring doc block) -- FIXED.** Moved above it.
- **SG-05 (grading-overhead column excludes the runner) -- FIXED.** Split into two columns; the real
  4-cell k=3 figure is ~19-20 min, not ~15, and the operator is told to size `k` against the
  right-hand one.
- **SG-06 (two stale counts) -- FIXED.** `canary-borrowed` vs the other FOUR fixtures; the
  "two-suite corpus" line put in the past tense.
- **SG-08 (new suite dirs outside the automated scan) -- FIXED.** `check-evals.mjs` now sweeps
  `.json` and `.md` under every `e2e-red-*/` for non-ASCII bytes and the email allowlist, skipping
  the gitignored runtime output (captured MODEL text, not authored content). It also fails when
  suite dirs exist but zero files were scanned, so a layout change cannot turn the sweep into a
  no-op that still prints OK. **Discrimination measured** with a throwaway probe file inside a suite
  dir, then removed: an en dash FAILS naming its byte offset, a non-approved email-shaped token
  FAILS on the allowlist, the approved public gmail PASSES. Current tree: 12 authored files across
  3 suite dirs, clean.

## Suggestions -- partially taken, with the skipped half named

- **SG-03 -- doc half FIXED, code half SKIPPED.** `unset E2E_APPLY_BASE` is now the first line of
  Steps 3b and 3c rather than a comment, with the reason inline (both srvx and `primitives-pin` have
  a `main` branch, so a leaked `main` grades the wrong commit *silently*). **Skipped:** making
  `gradeRun` refuse the variable when the suite does not set `requireExplicitApplyBase`. That is a
  behaviour change needing its own canary and its own decision about the canary path, which
  deliberately sets the variable; the battery already scopes it correctly (set-and-restore, plus the
  `apply_base`-equals-pin assertion on two suites). Worth its own task, not a drive-by.
- **SG-07 -- comment half FIXED, code half SKIPPED.** The comment now says which source is
  authoritative and why (`git apply` lands the edits, so the DIFF is the authority on what the grade
  measured) instead of implying the two halves share a source. **Skipped:** moving
  `produced_test_files` onto `changedPaths(diffPatch)`. It changes which file the RUNNER is pointed
  at, so it needs a canary pinning the equivalence, and it buys nothing on any current fixture.

## Suggestions -- none skipped outright

All eight were addressed at least in part.

---

## Verification -- all seven exit 0 on the final tree

```
node .claude/skills/lz-red-workspace/grade-red.mjs --selfcheck                  OK
node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --selfcheck    OK
node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck                OK
node .claude/skills/lz-red-workspace/selfcheck-red.mjs                          OK (backgrounded)
node .claude/skills/lz-red-workspace/check-evals.mjs                            OK
node .claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs      OK
claude plugin validate .                                                        OK
```

The battery was run in the BACKGROUND and waited for at **every** code commit (7 full runs), never
shortened. Radix toolchain copies ranged 21.6-62.0 s per grade across the runs -- machine load, not
a regression.

New battery lines:

```
[crux 9] escapingLinks boundary OK (... the permitted TWO-HOP shape is pinned, so the guard header
         cannot overstate what the code does)
[crux 9] linked toolchain source OK (a declared path whose SOURCE is a link is refused before
         anything is created, naming the target; and escapingLinks reports a destination ROOT that
         is a link out of the boundary, which the walk-from-inside-the-root rule could not see)
[crux 7:RXF] differential-discriminates canary OK (... 1 NEW tsc error against a 55-error
         pre-existing baseline, recorded verbatim: "...canary-rdxf-compile.spec.ts(17,15): error
         TS2322: T")
[tscLinesOrThrow] spawn status is consulted OK (... a KILLED pass, a failed spawn and a missing
         result all THROW -- the pre-change code returned [] for all three)
```

## Scope fence and hygiene

- `git diff --name-only 1640925..HEAD -- plugins/lz-tdd
  .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` -> **zero files**.
- Six files changed, all under `.claude/skills/lz-red-workspace/`.
- Diff content: **0 non-ASCII bytes**, **0 email-shaped tokens** (allowlist-inversion; the forbidden
  value is never written as a needle). All 11 commits authored AND committed as the approved public
  gmail.
- The owner's `radix-ng/primitives` checkout is referenced nowhere in the workspace and was never
  opened.
- Working tree clean; no stranded grading worktree under `D:\.lz-red-grade-tmp` or
  `C:\.lz-red-grade-tmp`.

## Borrowed-repo attestation (all four)

| Repo | State after the fix pass |
|------|--------------------------|
| `emilybache/GildedRose-Refactoring-Kata` | `status --porcelain` EMPTY; ONE worktree; branches = `main` only; `TypeScript/node_modules` = **308** |
| `h3js/srvx` | EMPTY; ONE worktree; detached at `55d90b3`; no new branch |
| `radix-ng/primitives-pin` | EMPTY; ONE worktree; detached at `4a7390a2`; branches = pre-existing `main` only |
| `radix-ng/primitives` (owner's) | **NEVER opened, read, written, installed into, or referenced.** Non-contact, not cleanliness -- its git state was deliberately not inspected |

## Zero spend

No `claude -p`, no eval fan-out, no metered command. `run-e2e.mjs` was invoked only via
`selfcheck-red.mjs`'s `--dry-run` composition and is byte-identical. **The
eval-run-approval-gate remains CLOSED and the round remains HALTED pending fresh explicit user
approval.**
