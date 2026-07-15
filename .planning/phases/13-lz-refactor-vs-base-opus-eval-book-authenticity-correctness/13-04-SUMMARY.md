---
phase: 13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness
plan: 04
subsystem: testing
tags: [eval, refactoring, correctness, behavior-oracle, pass-at-k, nx, gilded-rose, jest]

# Dependency graph
requires:
  - phase: 13-01
    provides: behavior-oracle baselines (nx 15-fail raw-jest differential; kata pristine golden master + jest --ci recipe)
  - phase: 13-02
    provides: persisted apply diffs (diff.patch/answer.md/meta.json) for both arms across p1/p2/p8/gr1/gr4
provides:
  - grading/correctness/name-layer.json (name_correct + layer_correct + name_layer_correct per run per arm)
  - grading/correctness/behavior.json (independent tests_green per run per arm + Pass@k per cell x arm)
  - empirical correctness half of the with/without head-to-head (parity on every graded cell)
affects: [13-05, 13-RESULTS, milestone-audit]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Independent behavior oracle: re-apply persisted diff to a fresh borrowed-repo reset, run ORIGINAL tests on EDITED source (never the in-session self-report)"
    - "nx differential gate: raw jest --config packages/eslint-plugin/jest.config.cts --ci vs a recorded 15-fail baseline (nx test unusable on arm64)"
    - "kata golden-master gate: seed pristine snapshot, jest --ci refuses to write and fails on mismatch"
    - "Pass@k/Pass^k via verbatim run-e2e.mjs passAtK/passHatK (not hand-rolled)"

key-files:
  created:
    - .claude/skills/lz-refactor-workspace/grading/correctness/name-layer.json
    - .claude/skills/lz-refactor-workspace/grading/correctness/behavior.json
  modified: []

key-decisions:
  - "All 32 graded refactorings are name/layer correct; both arms parity"
  - "All 33 graded runs are behavior-preserving (nx 0-new-failures differential; kata 2/2 snapshots); Pass@1=Pass@3=Pass^3=1.00 for every cell x arm"
  - "p2 with_skill run-3 is a valid no-edit decline: name/layer n/a, tests_green trivially true"

patterns-established:
  - "Sweep correctness graded against constituent judgments (p7sweep+T1-T4 for nx p8; G1sweep for kata gr4) using the Posture A/B/C rubric"

requirements-completed: [SPEC-req-4]

# Metrics
duration: 55min
completed: 2026-07-15
---

# Phase 13 Plan 04: Correctness grading (name/layer + independent behavior oracle) Summary

**Both arms are correctness-parity on every graded cell: 32/32 graded refactorings name/layer correct and 33/33 runs behavior-preserving (nx raw-jest differential vs the 15-fail baseline; kata jest --ci vs the pristine golden master), with Pass@1 = Pass@3 = Pass^3 = 1.00 for every cell x arm.**

## Performance

- **Duration:** ~55 min
- **Completed:** 2026-07-15T07:36:52Z
- **Tasks:** 2
- **Files created:** 2 (name-layer.json, behavior.json)
- **Test executions:** 17 nx raw-jest runs + 1 nx baseline + 15 kata jest --ci runs + 1 kata baseline

## Accomplishments

- **Name/layer correctness (Task 1):** graded all 33 runs across nx p1/p2/p8 and kata gr1/gr4 (both arms; gr1 also invoke_skill) from each run's own diff.patch + answer.md + meta.json against OUR targets.json (single-target T1/T2/G1) and the constituent sweep judgments (p7sweep+T1-T4 for p8; G1sweep for gr4). 32 graded refactorings are all name/layer correct; 1 valid no-edit decline (p2 with_skill run-3).
- **Independent behavior oracle (Task 2):** re-applied every persisted diff to a fresh reset of the borrowed repo and ran the repo's ORIGINAL tests on the EDITED source. nx: all 17 applied runs reproduced the exact 15-fail/169-pass/184-total baseline (0 new failures). kata: all 15 applied runs passed 2/2 snapshots against the pristine golden master. 33/33 tests_green.
- **Pass@k rollup:** every (cell, arm) is 3/3 green -> Pass@1 = Pass@3 = Pass^3 = 1.00, computed with the verbatim run-e2e.mjs passAtK/passHatK.
- **Empirical finding:** correctness parity between with_skill/invoke_skill and no_skill. Base Opus (no_skill) is catalog-grade on the mechanical (p1/p2) and functional-sweep (p8) cells and clarity-first on the kata (gr1/gr4). No run took a documented judgment trap: p2 never introduced Strategy for the mode param; the nx p8 sweep never changed an exported signature; the kata gr4 sweep never added Conjured handling or altered Sulfuras.

## Task Commits

1. **Task 1: Grade name/layer correctness vs targets.json** - `38c65c4` (feat)
2. **Task 2: Independent behavior oracle + Pass@k** - `1a031cc` (feat)

_(STATE.md/ROADMAP.md deliberately NOT updated -- the orchestrator owns those after the worktree merges.)_

## Files Created/Modified

- `.claude/skills/lz-refactor-workspace/grading/correctness/name-layer.json` - 33 records: name_correct + layer_correct + name_layer_correct + one-line rationale citing the target id, per {cell, arm, run}; plus per-(cell,arm) tallies and an empirical finding.
- `.claude/skills/lz-refactor-workspace/grading/correctness/behavior.json` - 33 records: tests_green per {cell, arm, run} from the independent oracle (nx differential / kata jest --ci) with a detail note; per-(cell,arm) Pass@k block {n, c, passAt1, passAt3, passHat3}; baselines and finding.

## Decisions Made

- **Sweep name/layer graded against constituent judgments (Pitfall 6):** pkgsweep/projsweep have no targets.json row, so nx p8 was graded against p7sweep + T1-T4 and kata gr4 against G1sweep, applying the Posture A/B/C (pass/timid/reckless) rubric those judgment fields encode. All sweep runs are posture A.
- **gr1 with_skill run-2 counted name/layer correct with a flag:** it reached full (constraint-respecting) Strategy + Map<name,updater> on the single-shot where G1's judgment prefers clarity-first Extract/Decompose. It is still in G1's expected set ("then optionally Replace Conditional with Polymorphism"), respects the do-not-modify-Item constraint (no Item subclass), and is behavior-preserving -- so name/layer correct, with a mild-over-reach note.
- **No-edit decline handling:** p2 with_skill run-3 (empty diff) recorded as name/layer "n/a" and tests_green true (trivially behavior-preserving, "no refactoring applied").

## Deviations from Plan

**1. [Rule 3 - Blocking] Used raw jest for the nx behavior oracle instead of `nx test eslint-plugin`**
- **Found during:** Task 2 (nx behavior oracle)
- **Issue:** `npx nx test eslint-plugin` fails at the nx:build-native Rust prerequisite on this arm64 Windows box (exit 130), before jest runs -- as flagged in the plan's critical environment facts and 13-01 behavior-baseline.json.
- **Fix:** Ran the recorded raw-jest runner `npx jest --config packages/eslint-plugin/jest.config.cts --ci` and scored the differential vs the 15-fail baseline. This is the prior-art workaround already baked into behavior-baseline.json.runner, not a new decision.
- **Verification:** Pristine baseline reproduced 15 failed / 169 passed / 184 total; every applied run reproduced the same counts (0 new failures).
- **Committed in:** `1a031cc`

**2. [Rule 1 - Bug] Transient 0/0/0 jest reading in the nx loop for p1 no_skill run-1**
- **Found during:** Task 2 (nx behavior oracle loop)
- **Issue:** The batched loop reported 0/0/0 for one run (jest produced no parseable Tests: line that pass).
- **Fix:** Re-ran that single run directly; it produced the correct 15 failed / 169 passed / 184 total (behavior-preserving). Recorded the correct value.
- **Verification:** Direct re-run showed the same 15-fail/169-pass baseline with the FAIL confined to the pre-existing dependency-checks spyOn crash.
- **Committed in:** `1a031cc`

---

**Total deviations:** 2 (1 blocking-workaround already prescribed by the plan, 1 transient-reading bug re-verified).
**Impact on plan:** None on outcome -- both were environment/tooling handling, not grading changes. No scope creep.

## Issues Encountered

- The behavior-json generator initially wrote to a Git Bash `/d/...` mount path, which Node on Windows resolved to `D:\d\...` (ENOENT). Fixed by using the Windows-style `D:/...` absolute path. No effect on results.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Correctness half of the head-to-head is tabulation-ready for 13-RESULTS.md (13-05): name-layer.json + behavior.json with per-cell x arm Pass@k.
- Both borrowed repos were reset to base after grading and left clean (nx on lz-refactor-e2e-smoke @ fea2cabbcc = origin/23.0.x; kata on lz13-kata-apply @ 3e0085b = main). Final canonical restoration (return to default branches, remove throwaway branches) is 13-05's job.
- Ran in parallel with 13-03 (book-authenticity); this plan touched only grading/correctness/ and never read the oracle books.

## Self-Check: PASSED

- FOUND: grading/correctness/name-layer.json (33 records, verify passed)
- FOUND: grading/correctness/behavior.json (33 records + 11 Pass@k cells, verify passed)
- FOUND: 13-04-SUMMARY.md
- FOUND commit 38c65c4 (Task 1); FOUND commit 1a031cc (Task 2)
- Hygiene: all three artifacts ASCII-only, no email tokens, no book paths/prose; both borrowed repos reset to base and clean.

---
*Phase: 13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness*
*Completed: 2026-07-15*
