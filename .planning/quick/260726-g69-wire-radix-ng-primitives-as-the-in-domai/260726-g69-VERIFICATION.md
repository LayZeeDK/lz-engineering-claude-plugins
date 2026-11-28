---
task: 260726-g69
kind: goal-backward-verification
verified: 2026-07-26T16:40:00Z
status: passed
score: 8/8 must-haves verified
behavior_unverified: 0
overrides_applied: 0
spend: zero (no claude -p, no eval fan-out, no metered command)
bisect_safety: 15/15 distinct trees green (covers all 16 workspace-touching commits + HEAD); 45/45 checks EXIT=0
advisories:  # NOT gaps -- residuals surfaced for owner decision, none blocks the goal
  - id: A-1
    severity: warning
    subject: "IM-06 declined baseline-count invariant leaves a narrow residual"
    detail: "tscLinesOrThrow throws on error / status===null, but a tsc pass that exits with a NON-NULL status and emits no diagnostics (internal compiler crash) still returns [] and subtracts to zero NEW errors. The decline reason is sound for the ask AS WRITTEN; a strictly-safe middle ground was not considered."
  - id: A-2
    severity: info
    subject: "copyToolchainPaths lstats only the FINAL component of a declared path"
    detail: "A declared path whose PARENT directory is a link copies from outside the repo. Fidelity-only, not containment. Unreachable in the current corpus."
  - id: A-3
    severity: info
    subject: "PLAN T-g69-01 still carries the overstated containment claim"
    detail: "Deliberate and disclosed by the fix pass; both live sites are corrected and crux 9 pins the permitted shape."
---

# 260726-g69 -- Goal-Backward Verification

**Task goal:** Wire `radix-ng/primitives` as the in-domain RED apply target -- multiple candidates,
one non-leading prompt each, multi-`node_modules` toolchain provisioning, and unconditional
drive-mode instrumentation.

**Verified:** 2026-07-26 | **Status:** passed | **Score:** 8/8

Every claim below was checked against the codebase, git history, or a live probe I ran myself. The
SUMMARY and the two review reports were treated as the artifacts under test, not as evidence.

## Observable Truths

| # | Truth (PLAN `must_haves.truths`) | Status | Evidence |
|---|---|---|---|
| 1 | `changed_production_files` recorded UNCONDITIONALLY at every write site; taxonomy unchanged | VERIFIED | Computed once at `grade-red.mjs:1560` before any branch; written at BOTH `red-grade.json` sites (`:1773` zero-produced-tests early return, `:1983` main). Those are the only two write sites. `classify` / `verdictPass` / `VERDICTS` / `changedProductionFiles` / `isTestFile` / `changedPaths` extracted from `34d0678` and from HEAD and compared: **all IDENTICAL**. |
| 2 | `escapingLinks()` contained by the WORKTREE, legitimate pnpm up-link passes, absolute escape still fails closed | VERIFIED (live probe) | Base commit `34d0678` exports `escapingLinks` with **arity 1** (boundary always == root). On ONE pnpm-shaped tree: narrow boundary reports the legitimate relative up-link (1), worktree boundary reports 0, and the ABSOLUTE link out of the worktree is reported under BOTH (1 / 1). |
| 3 | Toolchain provisioning copies EVERY declared `node_modules`, defaulting to the single root one | VERIFIED | `resolveToolchainPaths` returns `['node_modules']` for absent / non-array / empty and throws on absolute, `..`, empty, `.`, `.git`. `e2e-red-gilded-rose/targets.json` and `e2e-red-srvx/targets.json` declare **no** `toolchain_paths` (grep exit 1) -> byte-identical behaviour. Base commit has **no `copyToolchainPaths` export at all**; live probe copies both declared trees with their contents. |
| 4 | `run-e2e.mjs --suite e2e-red-radix-ng` composes all three arms with byte-identical non-leading prompts for BOTH targets, offline | VERIFIED (ran it myself) | `--dry-run` for r1 and r2 in BOTH `recommend` and `apply`: 3 arms each, `no_skill === with_skill` true, `invoke_skill === '/lz-tdd:lz-red ' + with_skill` true, 4/4 cells. All 12 RXF + 11 RXL forbidden tokens absent from the COMPOSED prompt (case-insensitive), 0 non-ASCII bytes, both name their pinned `test_dir`, preamble byte-identical across all 3 RED suites. |
| 5 | `grade-red --run` against a fabricated runDir returns a VERDICT for radix on radix's OWN toolchain, real semver `runner_version`, plus a `compile_error` negative control | VERIFIED | Battery at every radix-carrying tree: `[crux 7:RXF] genuinely_red, runner vitest@4.1.8 via <reportFile>; 1 failure attributed to the ADDED test; two-path toolchain copied; apply_base pinned` and `[crux 7:RXF] compile_error, 1 NEW tsc error against a 55-error pre-existing baseline`. `gradeFabricatedRunDir` calls the same exported `gradeRun` that `main(--run)` calls (`:2484`). **Zero SKIP lines anywhere in the battery output.** |
| 6 | All FOUR borrowed repos end git-clean, one worktree, no new named branch; kata 308; owner's checkout untouched | VERIFIED | Checked AFTER 15 full batteries (the most adversarial state available). See the fence table below. |
| 7 | Zero metered spend | VERIFIED | No `results*/`, `run-*/`, `outputs/` or `mechanical-red.json` under `e2e-red-radix-ng` or `e2e-red-srvx` -- the radix suite dir holds exactly its 4 authored files. The only such artifacts (`e2e-red-gilded-rose/results/`, `mechanical-red.json`) are dated **2026-07-25**, before this task; `find results -newermt 2026-07-26` returns nothing. Both grading temp dirs empty. |
| 8 | `plugins/lz-tdd` zero files in the task diff; `run-e2e.mjs` byte-identical | VERIFIED | `git diff --name-only 34d0678..HEAD -- plugins/lz-tdd <run-e2e>` -> zero files. Blob SHA `5e76cd98` at 34d0678 **and** at HEAD. |

## Key Links

| Link | Status | Evidence |
|---|---|---|
| `target.toolchain_paths` -> `copyToolchainPaths()` -> one disposable copy per declared path; teardown removes every one | WIRED | `gradeRun:1609` resolves, `:1617` arms `toolchainDests` BEFORE the copy, `:1650` copies, `:1678` `removeToolchain` iterates reverse, `:1731` SIGINT/SIGTERM handler does the same. |
| `escapingLinks(copiedDir, worktree)` -> containment asserted against the guard's own contract | WIRED | `:1661` `toolchainDests.flatMap((dest) => escapingLinks(dest, worktree))`, run ONCE after all copies (order comment `:1653-1660`). |
| `changedProductionFiles(diffPatch)` -> `red-grade.json.changed_production_files` at BOTH write sites | WIRED | `:1560`, `:1773`, `:1983`. |
| `runner_select {"packages/primitives/": "vitest"}` -> one prefix covers both radix targets | WIRED | Identical block on RXF and RXL; battery routes the RXF spec to `vitest@4.1.8`. |
| RXL's `runner`/`typecheck`/`toolchain_paths` deep-equal RXF's, asserted in the selfcheck | WIRED | `checkRadixTargetConfigEquality()` (`selfcheck-red.mjs:1551`), and it FAILS rather than passing vacuously when only one target is declared. |

## Item 2 -- BISECT SAFETY (the explicit discipline of this project)

Not sampled. **Every commit in `34d0678..HEAD` that touches
`.claude/skills/lz-red-workspace/` was checked out detached in a temp worktree of THIS repo and the
FULL offline battery was run, unshortened.** 16 such commits collapse to 15 distinct trees (`6029cbd`
duplicates `c756cc5`'s tree; HEAD `deea0c9` duplicates `de3afac`'s), so 15 runs cover all 16 plus
HEAD. `1640925` is docs-only with a workspace tree identical to `c756cc5`.

| # | Commit | `selfcheck-red` | `grade-red --selfcheck` | `check-evals` | s |
|---|---|---|---|---|---|
| 1 | `c534f41` feat: record changed_production_files | EXIT 0 | EXIT 0 | EXIT 0 | 102 |
| 2 | `4830231` feat: copy every declared node_modules | EXIT 0 | EXIT 0 | EXIT 0 | 107 |
| 3 | `921ccc4` feat: radix-ng RED apply suite | EXIT 0 | EXIT 0 | EXIT 0 | 222 |
| 4 | `c756cc5` docs: RUN-GATE (= tree of merge `6029cbd`) | EXIT 0 | EXIT 0 | EXIT 0 | 229 |
| 5 | `2ad11e9` fix: CR-01 linked source + lstat root | EXIT 0 | EXIT 0 | EXIT 0 | 231 |
| 6 | `cb8e3be` docs: correct containment guarantee | EXIT 0 | EXIT 0 | EXIT 0 | 232 |
| 7 | `8fdf902` fix: verbatimSymlinks in stand-in copy | EXIT 0 | EXIT 0 | EXIT 0 | 229 |
| 8 | `3868cbb` fix: loud verbatimSymlinks SKIP | EXIT 0 | EXIT 0 | EXIT 0 | 227 |
| 9 | `4712bbc` fix: cut the diagnosis clause from r1 | EXIT 0 | EXIT 0 | EXIT 0 | 222 |
| 10 | `6f34939` fix: throw on an incomplete tsc pass | EXIT 0 | EXIT 0 | EXIT 0 | 223 |
| 11 | `e4c89a8` feat: record NEW tsc diagnostics | EXIT 0 | EXIT 0 | EXIT 0 | 225 |
| 12 | `0b7d058` docs: drive-evidence TestBed caveat | EXIT 0 | EXIT 0 | EXIT 0 | 225 |
| 13 | `d67ae04` fix: reject repo-root path, target-aware SKIP | EXIT 0 | EXIT 0 | EXIT 0 | 228 |
| 14 | `025cce2` feat: sweep every e2e-red-* suite dir | EXIT 0 | EXIT 0 | EXIT 0 | 221 |
| 15 | `de3afac` docs: unset apply base (= tree of HEAD `deea0c9`) | EXIT 0 | EXIT 0 | EXIT 0 | 230 |

**45/45 checks EXIT=0. No non-zero exit, no checkout error, and no `SKIP` line in any run.** Total
battery wall-clock across the bisect: ~57 min. The temp worktree was removed and pruned; `git
worktree list` shows only the main checkout.

## Item 3 -- CR-01 is genuinely closed, and the crux discriminates

Both halves exist:

- **Guard half** -- `escapingLinks` (`grade-red.mjs:478-489`) `lstat`s its own resolved root and, when
  that root is a symlink, returns `linkEscapes(root, dirname(root), base)` and never walks through it.
  The per-link comparison lives in ONE helper (`linkEscapes:516`) so the root and the walk cannot drift.
- **Copy-site half** -- `copyToolchainPaths` (`:1366-1372`) `lstat`s every declared SOURCE in the
  pre-check loop that runs before anything is created, and throws naming the target id and the entry.

**Discrimination proved against the real pre-fix module, not asserted.** I imported the exported
functions from commit `1640925` (pre-CR-01, post-boundary/multi-path) and from HEAD, and ran ONE
identical synthetic input (a junction-rooted declared source) through both:

| | `copyToolchainPaths` threw | destination created | walk-inside-root sees | `escapingLinks(dest, wt)` |
|---|---|---|---|---|
| PRE-FIX `1640925` | **false** | **true** | 1 entry on the far side | **`[]`** |
| CURRENT HEAD | true (names `PROBE` + `LINK`) | false | 1 entry on the far side | `["...\wt\node_modules -> ...\outside-store"]` |

`checkLinkedToolchainSource()` asserts (1) the copy threw, (2) the message names target and fault,
(3) no destination was created, (4) the walk-from-inside really does enumerate the far side, and
(5) `escapingLinks` reports the linked root. Against the pre-fix logic **assertions 1, 3 and 5 all
fail**. It would not merely pass now -- it genuinely discriminates. No flag, no env var.

## Item 4 -- the r1 prompt, judged fresh against the LOCKED rule

Shipped text (one line, byte-identical across arms):

> Consumers can't style the focused day of the calendar -- their focus styling never applies. What's
> the next failing test you'd write for
> `packages/primitives/calendar/src/calendar-cell-trigger.directive.ts`? Go ahead and add it under
> `packages/primitives/calendar/__tests__/`.

| Rule clause | Judgment |
|---|---|
| May name a SYMPTOM | Yes -- "their focus styling never applies" is the consumer-visible symptom. |
| May name a FEATURE AREA | Yes -- focus state on the calendar day cell. |
| Never the missing attribute | PASS -- neither spelling appears; both are on the forbidden list, verified absent case-insensitively. |
| Never the expected value | PASS -- no value, no `'20'`, no trimmed-text hint. |
| Never the mechanism | PASS -- the withdrawn clause "the same way they style a focused control elsewhere in this library" is **cut** (diff `921ccc4..HEAD` confirms). That clause was a one-grep pointer to the house convention and therefore to the token the list blocks; its removal is the substantive fix, not a reword. |
| Never the verdict or the fix | PASS. |
| Disambiguates exactly ONE gap | PASS -- I read the pinned directive read-only (`cat-file` at `4a7390a2`): line 22 emits the undocumented focus spelling, and the deferred CAND-3 attribute is a DIFFERENT, disjoint symptom (days outside the visible view). r1 contains no occurrence of `outside` or `visible`; both CAND-3 spellings are on RXF's forbidden list. **r1 cannot be answered by the CAND-3 gap.** |
| Byte-identical across arms | PASS -- verified by my own dry-run in both modes. |

**r2 meets the same standard.** Symptom (month names still English) + feature area (global locale),
and none of its 11 forbidden tokens appear -- no token name, no provider function, no month spelling,
no `heading` / `textContent` / assertion helper. Keeping the ordinary English word "locale" is the
feature name, not the mechanism, and without it the prompt is unanswerable. No cross-cell leakage in
either direction (r1 contains no RXL token; r2 contains no RXF token).

## Item 6 -- the declined findings, judged

**IM-06 baseline-count invariant -- SKIP is SOUND, with a named residual (advisory A-1).**
The ask as written (`withErrors.length < baseErrors.size` throws) does false-positive: a produced
spec adding a module augmentation or a `declare` can legitimately resolve a baseline diagnostic, and
the run would then fail closed on a correct grade. The snippet is also sloppy on its own terms --
it compares an un-deduped array length against a deduped `Set` size. The shipped `tscLinesOrThrow`
is the reviewer's own "cheaper still, and worth having regardless" alternative and covers the named
scenario (OOM kill, spawn failure, ENOBUFS) on every target, with both-direction pure assertions
(`grade-red.mjs:2406-2425`) that I read and confirmed discriminate.
**Residual, stated plainly:** a tsc process that exits with a NON-NULL status and emits no
diagnostics -- an internal compiler crash -- still returns `[]`, subtracts to zero NEW errors, and
reports a type-broken produced test as tsc clean. The declined invariant would have caught it, and
a strictly-safe middle ground (`withErrors.length === 0 && baseErrors.size > 0`) was not considered.
Not a must-have; surfaced for owner decision.

**IM-01 corrected rather than closed -- SOUND.** The two-hop shape needs a symlink COMMITTED in the
target's tracked content (measured 0 in all three borrowed repos), and everything inside the worktree
is already reachable by the executing spec through ordinary relative paths, which `T-g69-07` accepts.
Closing it means `realpath`-ing the boundary too, which is real regression risk on this machine's
path shapes. What lifts this above a bare doc edit: crux 9 now **builds** the two-hop chain and PINS
it as permitted (`selfcheck-red.mjs:2612-2617`, asserted `:2655`), so the header and the code cannot
drift. Verified present. The fix pass's own disclosure that PLAN `T-g69-01` keeps the old text is
correct and reasonable (advisory A-3).

**IM-02 provably inert here -- CLAIM VERIFIED INDEPENDENTLY.** I walked
`.claude/skills/lz-red-workspace/node_modules` myself: **939 entries, 0 symlinks** (npm on Windows
writes `.bin` as `.cmd`/`.ps1` shim files). `verbatimSymlinks: true` is applied at
`selfcheck-red.mjs:2168`. The change is a portability fix with no discriminating check possible on
this platform, and the fix pass says exactly that rather than claiming a proof it does not have.

Also spot-checked: SG-03 and SG-07 both took the doc half and named the skipped code half with a
reason (each needs its own canary); neither skip touches a must-have.

## Item 7 -- fences

| Repo | `status --porcelain` | worktrees | branches | HEAD | extra |
|---|---|---|---|---|---|
| `emilybache/GildedRose-Refactoring-Kata` | EMPTY | 1 | `main` only, no `red-*` | `3e0085b` | `TypeScript/node_modules` = **308** non-dotted |
| `h3js/srvx` | EMPTY | 1 | pre-existing `main` only | detached `55d90b3` | -- |
| `radix-ng/primitives-pin` | EMPTY | 1 | pre-existing `main` only | detached **`4a7390a2`** (matches the suite pin) | -- |
| `radix-ng/primitives` (owner's) | exactly **2** files: `package.json`, `pnpm-lock.yaml` | 1 | pre-existing `main` only | detached `4a7390a2` | its own pre-existing state; no eval-created branch |

Checked AFTER my 15 batteries, each of which created and removed grading worktrees on the kata, srvx
and `primitives-pin`. Both grading temp dirs (`D:\.lz-red-grade-tmp`, `C:\.lz-red-grade-tmp`) are
**empty** -- no stranded worktree. The scratch dir the SUMMARY says it removed
(`D:/projects/github/radix-ng/.lz-g69-tmp`) is gone; that parent holds only `primitives` and
`primitives-pin`.

**Non-contact with the owner's checkout:** `git grep -F 'radix-ng/primitives"'` over
`.claude` returns nothing. The only surviving matches for that string are the npm package name
`@radix-ng/primitives` and prose that explicitly says the owner's checkout is NOT the eval source.
No filesystem path points at it.

**Scope and hygiene:** `plugins/lz-tdd` and `run-e2e.mjs` have **zero** files in
`git diff 34d0678..HEAD` (`run-e2e.mjs` blob SHA identical at both ends). Independent audit over all
17 touched files plus the untracked REVIEW-FIX: **0 non-ASCII bytes, 0 non-approved email-shaped
tokens**, 1 approved-gmail hit. Over all 18 commits in range: **0 non-approved author/committer
identities, 0 emails in commit messages, 0 non-ASCII in commit messages, 0 AI-attribution trailers.**
Detection was by allowlist-inversion; no forbidden value was written as a needle.

## Behavioral spot-checks (independent of the SUMMARY)

| Behavior | How checked | Result |
|---|---|---|
| CR-01 discrimination | pre-fix vs HEAD module, one synthetic junction input | PASS -- see the table above |
| Boundary widening | pre-fix (arity 1) vs HEAD, one pnpm-shaped tree, two boundaries | PASS -- narrow 1 / wide 0 / absolute caught under both |
| Multi-path copy | both declared trees through `copyToolchainPaths` | PASS -- both markers land |
| Three-arm prompt parity | `run-e2e.mjs --dry-run`, r1+r2 x recommend+apply | PASS -- 4/4 cells byte-identical |
| Forbidden tokens over the COMPOSED prompt | own scan, case-insensitive, all 4 RED prompts | PASS -- 0 hits, 0 non-ASCII |
| `canary-grc-drive-red` really is a NON-fixing production edit | read the kata source at `main` | PASS -- the hunk patches the `sellIn < 0` branch (lines 51-53); the fixture item has `sellIn: 3`, so quality goes 6 -> 5 and `toBe(4)` still fails |
| Verdict taxonomy unmoved | function-by-function extraction, `34d0678` vs HEAD | PASS -- `classify` / `verdictPass` / `VERDICTS` / `changedProductionFiles` / `isTestFile` / `changedPaths` all IDENTICAL |
| Remaining verification commands at HEAD | run directly | `tabulate-mechanical-red --selfcheck` 0, `merge-judge --selfcheck` 0, `check-evals` 0 (12 authored files across 3 suite dirs swept), `selfcheck-code-review` 0, `claude plugin validate .` PASS |

## Anti-patterns

Scanned all 14 changed files under `.claude/`: **zero** `TBD` / `FIXME` / `XXX` / `HACK` / `TODO`
debt markers. The one `PLACEHOLDER` hit is the identifier `TITLE_PLACEHOLDER_RE`, not a marker.

## Advisories (not gaps)

- **A-1 (warning).** The IM-06 residual above: a tsc pass that exits non-null with no diagnostics is
  still read as "0 new errors". Owner decision -- accept, or open a follow-up for the
  `withErrors.length === 0 && baseErrors.size > 0` form.
- **A-2 (info).** `copyToolchainPaths` `lstat`s only the FINAL component of a declared path, so a
  declared path whose PARENT is a link would copy from outside the repo. Fidelity, not containment
  (the destination is still worktree-bounded), and unreachable in the current corpus.
- **A-3 (info).** The widened boundary also newly permits a link from inside a copied toolchain to
  `<worktree>/.git`. Same accepted-residual class as the pinned two-hop shape; `T-g69-07` already
  accepts arbitrary filesystem access from the executing spec. Not named in the residual list.
- **A-4 (info).** PLAN `T-g69-01` retains the superseded "any `..` chain that leaves the worktree"
  wording. Disclosed by the fix pass; both live sites are corrected.

## Verdict

**PASSED.** All eight must-haves are delivered and independently verified with behavioral evidence,
not presence checks. The instrument is bisect-safe at every one of the 16 commits that touch it.
CR-01 is genuinely closed with a crux that fails against the pre-fix logic. The r1 prompt no longer
leaks a diagnosis and cannot be answered by the deferred candidate. All four borrowed repos are
pristine after fifteen full batteries. Zero metered spend; the eval-run-approval-gate stays CLOSED.

---

_Verified: 2026-07-26_
_Verifier: Claude (gsd-verifier), goal-backward, FORCE stance_
