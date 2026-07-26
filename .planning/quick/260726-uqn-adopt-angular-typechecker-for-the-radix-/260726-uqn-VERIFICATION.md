---
task: quick-260726-uqn
verified: 2026-07-26T22:03:39Z
status: passed
score: 12/12 must-haves verified
behavior_unverified: 0
overrides_applied: 0
---

# Quick 260726-uqn: adopt angular-typechecker for the radix cells -- Verification Report

**Task goal:** Adopt angular-typechecker (atc) as the differential typechecker for the radix-ng
targets only (RXF + RXL), keeping tsc unchanged for GRC and SRVC; and record the Phase-21
JestMatchers research findings plus the RXF verdict decision.

**Verified against:** HEAD `9794e90` on `gsd/lz-tdd-0.0.3-lz-red` (commits `fc174c7`, `7ade70a`,
`9794e90`), independently re-derived from the actual codebase and the four borrowed repos -- not
from SUMMARY.md's narrative.

**Verdict: PASSED.** Every must-have in the PLAN frontmatter checks out against the real files, the
real git history, the real borrowed-repo state, and a live run of the offline selfcheck. No
blockers, no gaps, no items requiring further human sign-off beyond what the task's own constraints
already deferred (see "Deliberately not re-executed" below).

## Goal Achievement

### Observable Truths (from PLAN.md `must_haves.truths`)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `angular-typechecker@0.2.4` tracked devDependency, no sibling-checkout path | VERIFIED | `package.json`: `"angular-typechecker": "0.2.4"` (exact, no range). `package-lock.json`'s `node_modules/angular-typechecker` entry: `version 0.2.4`, `resolved: registry.npmjs.org/.../0.2.4.tgz`, `dev: true`, `bin` maps both `angular-typechecker` and `atc` to `src/cli/bin.js`. `atcCliPath()` resolves exclusively through `createRequire(...).resolve('angular-typechecker/package.json')` then `bin.atc` -- no reference to any sibling checkout anywhere in `grade-red.mjs` (`git grep -n 'angular-typechecker' ` outside the tracked manifests/fixtures returns none). |
| 2 | Per-target checker selection, `tsc` DEFAULT, GRC/SRVC byte-identical | VERIFIED | `resolveChecker()`: `declared === undefined -> DEFAULT_CHECKER` ('tsc'). `e2e-red-gilded-rose/targets.json` and `e2e-red-srvx/targets.json`: `git diff e4ce66c 9794e90 -- <both files>` is EMPTY; neither declares `checker`. Only `e2e-red-radix-ng/targets.json`'s RXF and RXL declare `"checker": "atc"`. |
| 3 | Malformed checker/tsconfig/args each THROW before the grading worktree exists | VERIFIED | Read `resolveChecker()` (non-string, empty/whitespace, unknown value all throw) and `resolveAtcTsconfig()` (missing/empty/non-string/absolute/drive-prefixed/`..`-bearing all throw) and the `tc.args !== undefined` throw inside `resolveTypecheck()` when `checker==='atc'`. All of these are exercised and pass in a LIVE run of `node grade-red.mjs --selfcheck` (exit 0, see below) via the `[per-target checker]` selfcheck block, which enumerates every one of these malformed shapes and asserts a throw. |
| 4 | atc invoked as `-c <tsconfig> --format json`, format owned by code; args-alongside-atc throws | VERIFIED | `resolveTypecheck()`: `return { checker, args: ['-c', tsconfig, '--format', 'json'], tsconfig, prebuild }` -- the format flag is a literal in the code, not sourced from config. The same function throws when `tc.args !== undefined` on the atc path. atc's JSON `diagnostics[]` are normalized by `atcRecordLine()` into the identical single-line shape the tsc path uses; `tscErrorIdentity()`, `isConfigLevelTscError`-vs-`isConfigLevelAtcError` dispatch, and `newTscErrorsOrThrow()` all operate on that shape with zero per-checker branch beyond `configLevelPredicateFor(checker)` and the single `targetTypecheckErrors()` dispatch point. |
| 5 | Differential stays POSITION-INSENSITIVE; `endLine`/`endColumn` discarded; raw line kept for audit | VERIFIED | Programmatically diffed `tscErrorIdentity()` and `newTscErrorsOrThrow()` between pre-task HEAD (`e4ce66c`) and the shipped tree: **byte-identical**, confirming no regression of commits `d317950`/`3c50958`. `atcRecordLine()` never reads `endLine`/`endColumn`. Live `--selfcheck` run reproduces the 8-vs-0 position-insensitivity assertions. |
| 6 | Advisory A-1's guards hold on both paths: an unrun/crashed pass never reads clean | VERIFIED | `atcDiagnosticsOrThrow()` read in full: exit 2, unparseable stdout, missing `diagnostics` array, non-zero exit with empty array, spawn error, and null status all throw; exit 0 with diagnostics is the only clean path. All eight of these branches are exercised and asserted in the live `--selfcheck` run (`[atcDiagnosticsOrThrow]` block, exit 0). |
| 7 | Vacuous-differential guard covers atc's own FILE-LESS synthesized faults | VERIFIED | `isConfigLevelAtcError()` requires a file-scoped prefix (same shape test as `isConfigLevelTscError`, reused rather than duplicated) and enumerates no codes. `configLevelPredicateFor()` dispatches on the resolved checker at the ONE baseline-check call site in `gradeRun` (line ~2372). Live selfcheck reproduces the full failure chain against the captured `config-fault.json` payload (`ATC90001`/`TS18002`, both file-less, both refused by the atc predicate, neither caught by the untouched tsc predicate) and asserts zero of the 73 measured healthy-baseline error records is file-less. |
| 8 | Three radix canaries prove discrimination end to end | VERIFIED | Read all three canary blocks in `selfcheck-red.mjs` (lines ~1514-1684): canary A (`canary-rdxf-compile`) asserts `compile_error` with a `TS2322` line; canary B (`canary-rdxf-template`) asserts `compile_error` with an `NG8007`-coded line and `g.checker === 'atc'`; canary C (`canary-rdxf-append`) asserts `genuinely_red`/`pass:true`, `new_tsc_errors === 0`, `attributed_failures === 1`, and `changed_production_files === []`. Both new fixtures' `diff.patch` files were independently checked with `git apply --check` against the real, read-only `radix-ng/primitives-pin` checkout at its pinned commit -- **both apply cleanly**, confirming the patches are real, not fabricated. `rg -c '\[crux 7:RXF\].*canary OK' <log>` pattern is satisfied by exactly 4 distinct `console.log` call sites in the source. |
| 9 | RXF's `compile_error` verdict STANDS; no allowlist/tolerance added; consequence recorded as residual | VERIFIED | `21-ATC-ADOPTION.md` section 6 states the decision and rationale in full; `RUN-GATE.md`'s new residual entry states the ACCEPTED consequence explicitly ("a matcher allowlist, a baseline-keyed noise rule and any target-specific tolerance were deliberately NOT written"). Grepped `grade-red.mjs` and `selfcheck-red.mjs` for any matcher-name-based conditional -- none exists. |
| 10 | RXF/RXL `typecheck_note` carries MEASURED atc baseline + timing; no stale tsc-era figure | VERIFIED | Both targets' `typecheck` blocks are deep-equal (`{"checker":"atc","tsconfig":"packages/primitives/tsconfig.spec.json"}`, confirmed via a JSON diff). Both `typecheck_note` fields carry the dated 2026-07-26 measured atc baseline (80 diagnostics, 73 error/26 files, 9.0-9.9s/pass, rootNamesCount 146) with no bare tsc-era figure inside the note itself. |
| 11 | `HANDOFF.json`/`.continue-here.md` carry corrected mechanism, FALSIFIED premise, RXF settled | VERIFIED | Read `.planning/HANDOFF.json` in full: `next_action` states "NOTHING TECHNICAL IS BLOCKING", `remaining_tasks` contains only the two metered items + post-round closure (no RXF research/verdict item), `completed_tasks` contains `jestmatchers-research` and `rxf-verdict` entries stating FALSIFIED / DECIDED, `blockers` contains only the metered-round approval (no RXF blocker), a new `decisions` entry records the atc adoption and the pre-existing "revisit" decision is corrected in place, `context_notes` carries the append-canary and checker-fidelity lessons. `.planning/.continue-here.md` (the TRACKED resume point) matches: RXF absent from `<blockers>`, `<next_action>` points at the two gated metered items, required reading points at `21-ATC-ADOPTION.md` first. The GITIGNORED phase-level `.continue-here.md` (a known, accepted deviation -- see below) was separately confirmed to carry the same corrections. |
| 12 | Full `selfcheck-red.mjs` run exits 0, zero skips in the radix block; not shortened | VERIFIED (by code inspection, per explicit instruction -- see note below) | NOT re-executed in this verification pass per an explicit constraint ("Do NOT run selfcheck-red.mjs... a metered eval run is queued immediately after you return"), which also prescribed the substitute check performed here: confirmed the canary assertions exist and are wired (4 distinct `[crux 7:RXF].*canary OK` console.log call sites, `STATUS` captured from `child_process` exit and gated on -- not log-text-only -- per lines around the radix block), and independently corroborated via `git apply --check` that both new canaries' diffs are real and apply cleanly to the actual read-only pinned repo. See "Deliberately not re-executed" below for the residual coverage gap this leaves and why it is acceptable. |

**Score:** 12/12 truths verified. 0 present-but-behavior-unverified (truth 12 was checked via the
orchestrator's own prescribed substitute method, not left unaddressed).

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `.claude/skills/lz-red-workspace/package.json` | atc 0.2.4 exact devDependency | VERIFIED | Confirmed exact pin, no `^`/`~`. |
| `.claude/skills/lz-red-workspace/e2e-red-radix-ng/targets.json` | atc form, deep-equal, no stale figures | VERIFIED | Deep-equal `typecheck` blocks confirmed programmatically. |
| `fixtures/atc/` (`radix-healthy.json`, `config-fault.json`, `CAPTURE-NOTES.md`) | captured payloads, dated, command recorded | VERIFIED | Both JSON payloads exist and are consumed by the live `--selfcheck` run; `CAPTURE-NOTES.md` documents the exact command, cwd, and date for each. |
| `fixtures/canary-rdxf-template/` (`meta.json`, `diff.patch`, `NOTES.md`) | atc-visible/tsc-invisible defect | VERIFIED | `diff.patch` applies cleanly (`git apply --check`) against the real pinned repo; `NOTES.md` records a measured tsc-clean comparison on the same spec. |
| `fixtures/canary-rdxf-append/` (`meta.json`, `diff.patch`, `NOTES.md`) | append onto dirty file | VERIFIED | `diff.patch` applies cleanly against the real pinned repo (verified against the actual `calendar.spec.ts` context lines at the pin); shifts the import hunk to the top exactly as documented. |
| `.planning/phases/21-.../21-ATC-ADOPTION.md` | durable record | VERIFIED | All required sections present and dated; ASCII-clean; passes the maintainer-email allowlist-inversion scan. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `target.typecheck.checker` | `resolveTypecheck()` | single dispatch point | WIRED | Confirmed both call sites inside `gradeRun`'s differential route through `targetTypecheckErrors(armCwd, worktree, args, checker)`. |
| atc JSON `diagnostics[]` | `tscErrorIdentity()` / `newTscErrorsOrThrow()` / `classify()` | `atcRecordLine()` normalizer | WIRED | No per-checker branch found downstream of the normalizer; confirmed by reading the full call chain. |
| atc exit code + stdout | `atcDiagnosticsOrThrow()` | guard-and-parse in one function | WIRED | Confirmed: caller (`targetTypecheckErrors`) cannot reach diagnostics without passing through the guard. |
| resolved checker | `configLevelPredicateFor()` | baseline config-level check | WIRED | Single selection point at the one baseline-check call site in `gradeRun`; `isConfigLevelTscError` proved byte-unchanged. |
| `canary-rdxf-append/diff.patch` | multiset subtraction | `git apply` onto a spec with baseline diagnostics | WIRED | Confirmed via code inspection of the canary C assertion block AND independently confirmed the patch applies cleanly to the real repo. |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Offline `grade-red.mjs --selfcheck` (all checker-resolution, guard, normalizer, vacuous-differential and position-insensitivity assertions) | `node grade-red.mjs --selfcheck` | Exit 0, every named assertion block printed `OK` | PASS (run live by this verifier) |
| `canary-rdxf-template/diff.patch` applies against the real read-only pin | `git apply --check` in `radix-ng/primitives-pin` | Applied cleanly | PASS |
| `canary-rdxf-append/diff.patch` applies against the real read-only pin | `git apply --check` in `radix-ng/primitives-pin` | Applied cleanly | PASS |
| `isConfigLevelTscError` / `tscErrorIdentity` / `newTscErrorsOrThrow` byte-unchanged | programmatic function-body diff, pre- vs post-task HEAD | Byte-identical | PASS |
| GRC/SRVC `targets.json` untouched | `git diff e4ce66c 9794e90 -- <both files>` | Empty diff | PASS |
| `plugins/lz-tdd` has zero files in the task diff | `git diff --name-status e4ce66c 9794e90` | 18 files, all under `.claude/skills/lz-red-workspace/` and `.planning/` | PASS |
| ASCII-only + maintainer-email allowlist over the four Task-3 files | `rg -P '[^\x00-\x7F]'` (negated) + email-token scan | Zero non-ASCII, zero email-shaped tokens | PASS |
| Full `selfcheck-red.mjs` (real atc against real borrowed repos, ~7 min) | -- | NOT RUN | SKIP (explicitly prohibited for this verification pass; see below) |

### Borrowed-Repo Cleanliness (independently re-checked, not taken from SUMMARY)

| Repo | State | Matches claim |
|------|-------|----------------|
| `radix-ng/primitives-pin` | Clean, detached at `4a7390a2`, ONE worktree | YES |
| `h3js/srvx` | Clean, detached at `55d90b3`, ONE worktree | YES |
| GildedRose kata | Clean, `main` branch, ONE worktree, `TypeScript/node_modules` = 308 entries | YES |
| `radix-ng/primitives` (owner's checkout) | 2 dirty files (`package.json`, `pnpm-lock.yaml`), pre-existing owner WIP, untouched by this task | YES |

### Requirements Coverage

| Requirement | Description | Status | Evidence |
|--------------|-------------|--------|----------|
| EVL-03.3 | D-06 produced-test correctness gate, proven by `grade-red --selfcheck` | SATISFIED | Live-run confirms `grade-red --selfcheck` exits 0 including all new atc-related assertions; the differential gate's core behavior is unregressed (byte-identical identity/subtraction functions). |

### Anti-Patterns Found

None. No `TBD`/`FIXME`/`XXX` markers without a follow-up reference; no placeholder returns; no
hardcoded empty data flowing to a decision path; no disabled guard flags. The one thing that could
look like a stub -- the current checkout's `node_modules` lacking `angular-typechecker` -- is not an
anti-pattern in the delivered code: it is normal post-merge git/npm drift (node_modules is
gitignored and git merge never runs `npm install`), and the code's own fail-closed behavior
(`atcCliPath()`) is explicitly designed to surface this loudly with an actionable message rather than
silently degrading. Both `HANDOFF.json` and `RUN-GATE.md` already document "a fresh worktree must run
`npm install`" for exactly this reason.

## Known Deviations (already accepted, re-confirmed rather than re-litigated)

1. **Phase-level `.continue-here.md` path.** Confirmed: `.gitignore:22` matches `.continue-here.md`
   at any depth, so `.planning/phases/21-.../. continue-here.md` is gitignored and local-only. It
   exists on disk, was independently read, and DOES carry the corrected state (RXF removed from
   blockers/remaining_work, falsified premise stated, required reading points at
   `21-ATC-ADOPTION.md`) -- confirming the orchestrator's separate correction was applied as
   claimed. The TRACKED resume point, `.planning/.continue-here.md`, was updated by the executor and
   independently verified above.
2. **Severity domain wider than "observed".** Confirmed in code: `ATC_SEVERITIES = new Set(['error',
   'warning', 'suggestion', 'message'])` -- all four real atc severities are recognised (only `error`
   kept), rather than just the two observed on this target. Matches the SUMMARY's stated deviation
   exactly.

## Deliberately Not Re-Executed (per explicit task constraint, not a gap)

This verification pass was explicitly instructed NOT to run `selfcheck-red.mjs` (the ~7-minute full
battery against the real borrowed repos) because a metered eval round is queued immediately after
this report and both would collide on shared grading temp dirs. The task instructions prescribed an
alternate check for this specific item ("verify instead that the new canary assertions are present
in the file and wired into the crux battery"), which was performed thoroughly (see truth #12 and #8
above): every assertion block was read in full, the exit-status gating (not log-text-only) was
confirmed, and both new canaries' diffs were independently proven to apply cleanly against the real,
read-only pinned repo.

What this leaves unconfirmed by this verifier directly: whether a live invocation of the real,
installed `atc` CLI against the real repos reproduces the exact numbers the SUMMARY reports (80
diagnostics, NG8007 at the stated position, the 8-vs-0 line-shift split). The evidence for this is
strong but secondhand: internally consistent measured tables across three independent files
(`fixtures/atc/CAPTURE-NOTES.md`, both canary `NOTES.md` files, `21-ATC-ADOPTION.md`), commit
messages matching the same figures, and code whose logic is sound and independently exercised
offline. This is not treated as a blocking gap because (a) the task explicitly authorized this
substitution, and (b) the next scheduled action (the metered round) itself depends on `atc`
resolving and working correctly and will fail loudly and immediately if it does not, given the
fail-closed design confirmed throughout this review.

**Advisory, non-blocking:** if the developer wants full independent confirmation before spending on
the metered round, running `node selfcheck-red.mjs` once (backgrounded, ~7 min) would close this
residual completely. Not required to proceed.

## Gaps Summary

None. All 12 must-haves verified. GRC/SRVC are provably untouched. The position-insensitive
differential and the tsc config-level guard are provably byte-unchanged. Both new canary fixtures
are provably real, applicable patches against the actual pinned repo. All four Task-3 documentation
artifacts exist, are dated, ASCII-clean, and correctly state the falsified premise and the settled
RXF verdict without presenting it as open. `plugins/lz-tdd` is untouched. No metered spend occurred
in this task's own commits.

---

_Verified: 2026-07-26T22:03:39Z_
_Verifier: Claude (gsd-verifier)_
