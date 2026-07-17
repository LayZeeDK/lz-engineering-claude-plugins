---
phase: 12-autonomous-multi-round-refactoring-for-whole-package-sweeps
plan: 01
subsystem: testing
tags: [evals, trigger-eval, e2e, sweep, autonomy-precision, lz-refactor, measurement]

# Dependency graph
requires:
  - phase: 11-skill-effectiveness-evals
    provides: native trigger-eval harness (check-evals.mjs, run-recall/spec-chunks) + both e2e suites (nx, gilded-rose)
provides:
  - 3 whole-package sweep POSITIVES + 3 sweep-shaped hard NEGATIVES (feature / perf / red-test) in trigger-eval.json
  - the 3 negatives dual-written byte-consistent into evals/d07-chunks/negatives.json (the spec-runner source)
  - nx e2e multi-round sweep-command scenario (p7cmd / p7sweep) seeded with 2 safe rounds + 1 exported-signature trap
  - kata e2e multi-round sweep-command scenario (gr3cmd / G1sweep) seeded with 3+ safe rounds + 1 uncovered-behavior trap
  - a committed pre-edit baseline tree (OLD SKILL.md + NEW instruments) for the D-16 before/after protocol
affects: [12-02 SKILL.md description + sweep-drive edit, 12-03 before/after metered eval run]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Sweep intent CATEGORY positives: name a package/directory/module/codebase scope (not one symbol) + green-state cue + scan-and-fix framing"
    - "Paired sweep-shaped hard negatives (feature / perf / red-test) carry the specificity guarantee in the eval set, not the prose (D-03)"
    - "Dual-write invariant: every negative written byte-consistent to BOTH trigger-eval.json (lint) and d07-chunks/negatives.json (spec runner)"
    - "e2e sweep scenario = prompt + targets row + suite row, seeded with N safe rounds + exactly ONE should-pause trap for deterministic posture A/B/C"

key-files:
  created:
    - .claude/skills/lz-refactor-workspace/e2e-nx/prompts/p7cmd-runtime-lint-utils-sweep-command.md
    - .claude/skills/lz-refactor-workspace/e2e-gilded-rose/prompts/gr3cmd-update-quality-sweep-command.md
  modified:
    - .claude/skills/lz-refactor-workspace/evals/trigger-eval.json
    - .claude/skills/lz-refactor-workspace/evals/d07-chunks/negatives.json
    - .claude/skills/lz-refactor-workspace/e2e-nx/suite.json
    - .claude/skills/lz-refactor-workspace/e2e-nx/targets.json
    - .claude/skills/lz-refactor-workspace/e2e-gilded-rose/suite.json
    - .claude/skills/lz-refactor-workspace/e2e-gilded-rose/targets.json

key-decisions:
  - "Did NOT mark SC1/SC2/SC4 complete: 12-01 builds the measurement instruments only; the gaps are CLOSED only after the 12-03 metered before/after run"
  - "Anti-overfit: sweep positives address the whole-package scan-and-fix CATEGORY with generic package/dir/module scopes; no p7cmd/gr3cmd prompt wording pasted into any query"
  - "Red-test sweep negative satisfies the check-evals seam regex (failing test / make .* pass / smallest edit) to keep the >=2-seam gate satisfied (now 5 seam)"

patterns-established:
  - "Instruments-first: commit the eval + e2e instruments as their own commit BEFORE the SKILL.md edit so the pre-edit tree = OLD SKILL.md + NEW instruments (D-16)"

requirements-completed: []  # SC1/SC2/SC4 are phase-spanning and measured only after 12-03's metered run; 12-01 contributes instruments, does not close them.

# Metrics
duration: 20min
completed: 2026-07-11
---

# Phase 12 Plan 01: Sweep-shaped measurement instruments Summary

**Added 3 whole-package sweep trigger positives + 3 dual-written sweep-shaped hard negatives (feature/perf/red-test) and one seeded multi-round sweep-command e2e scenario per suite (nx p7cmd, kata gr3cmd), committed as the pre-edit D-16 baseline with check-evals green (16/14, 5 seam) and no SKILL.md change.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-07-11
- **Tasks:** 3
- **Files modified:** 8 (6 modified, 2 created)

## Accomplishments

- Trigger-eval set gained the missing intent CATEGORY (whole-package / directory / module / codebase scan-and-fix of existing green code): 3 positives naming a `billing` package, a `src/services` directory, and an `auth` library, each with a green-state cue and scan-and-fix framing.
- 3 sweep-shaped hard negatives guard the neighboring boundaries: a feature-adding sweep (`api` package), a performance sweep (`reporting` module), and a red-test sweep (`parser` package) that also satisfies the lz-tpp seam regex.
- The 3 negatives are dual-written byte-consistent into `evals/d07-chunks/negatives.json` (the file the spec runner actually reads) - verified identical query strings, same order (14 negatives across both files).
- nx e2e: `p7cmd` whole-file sweep of `runtime-lint-utils.ts` with target `p7sweep` documenting N_safe = 2 (T3 loop->pipeline, T4 reduce->Map) + one exported-signature should-pause trap (D-07.6 blast-radius / Pitfall 8 monorepo).
- kata e2e: `gr3cmd` end-to-end sweep of `updateQuality` with target `G1sweep` documenting N_safe = 3+ (guard clauses, per-branch updater, name magic numbers) + one uncovered-behavior trap (Conjured/Sulfuras, checked by running the ORIGINAL approval tests against the EDITED source).
- Instruments committed as their own commit (no `plugins/` path), giving D-16 a clean pre-edit baseline tree = OLD SKILL.md + NEW instruments.

## Task Commits

Per the plan's D-16 design, Tasks 1-2 built the instruments and Task 3 committed them together as one dedicated pre-edit commit:

1. **Task 1: 3 sweep positives + 3 dual-written sweep negatives** - built in `beed2a1`
2. **Task 2: one multi-round sweep-command scenario per e2e suite (nx + kata)** - built in `beed2a1`
3. **Task 3: commit the 12-01 instruments as their own pre-SKILL.md commit** - `beed2a1` (test)

## Files Created/Modified

- `.claude/skills/lz-refactor-workspace/evals/trigger-eval.json` - +3 sweep positives, +3 sweep negatives (16 pos / 14 neg)
- `.claude/skills/lz-refactor-workspace/evals/d07-chunks/negatives.json` - +3 sweep negatives (dual-write, byte-consistent)
- `.claude/skills/lz-refactor-workspace/e2e-nx/prompts/p7cmd-runtime-lint-utils-sweep-command.md` - nx whole-file sweep-command prompt
- `.claude/skills/lz-refactor-workspace/e2e-nx/targets.json` - +`p7sweep` row (2 safe rounds + exported-signature trap, posture A/B/C judgment)
- `.claude/skills/lz-refactor-workspace/e2e-nx/suite.json` - +`p7cmd` prompts[] row (target p7sweep, code true)
- `.claude/skills/lz-refactor-workspace/e2e-gilded-rose/prompts/gr3cmd-update-quality-sweep-command.md` - kata end-to-end sweep-command prompt
- `.claude/skills/lz-refactor-workspace/e2e-gilded-rose/targets.json` - +`G1sweep` row (3+ safe rounds + uncovered-behavior trap, posture A/B/C judgment)
- `.claude/skills/lz-refactor-workspace/e2e-gilded-rose/suite.json` - +`gr3cmd` prompts[] row (target G1sweep, code true)

## Decisions Made

- **SC1/SC2/SC4 left OPEN.** This plan builds the measurement instruments only. The two gaps are proven CLOSED only after 12-02's SKILL.md edit and 12-03's metered before/after run; marking the Success Criteria complete now would be a false claim. `requirements-completed` is intentionally empty.
- **Anti-overfit honored.** Sweep positives address the general scan-and-fix category with generic scopes (`billing` / `src/services` / `auth`); no query quotes or paraphrases the p7cmd/gr3cmd prompt wording (which name `runtime-lint-utils.ts` / `updateQuality`).
- **Seam gate preserved.** The red-test sweep negative ("...whats the smallest edit to make each one pass? doing tdd.") matches the check-evals seam regex on three tokens (failing test, make .* pass, smallest edit), lifting the seam count 4 -> 5 (gate needs >= 2).

## Deviations from Plan

None - plan executed exactly as written. No auto-fixes, no blocking issues, no architectural changes.

## Issues Encountered

- The Task 3 verify command (`git show --stat HEAD | rg 'plugins/'`) false-positives because the commit MESSAGE contains the literal phrase "no plugins/ path". Re-verified against the actual changed file list (`git diff-tree --name-only -r HEAD`): zero `plugins/` file paths. Not a defect - the commit is clean.

## Verification

- `node check-evals.mjs` -> `OK - 30 queries (16 trigger / 14 near-miss; 5 lz-tpp-seam negatives), ASCII-clean` (exit 0).
- Both eval JSONs parse; the two negative lists are byte-consistent (14 identical query strings in the same order).
- Throwaway `scripts-check-e2e-suites.mjs` (written, run, deleted): both suites parse and every prompts[] row resolves (nx 8 prompts / 7 targets; kata 4 prompts / 3 targets).
- No harness `.mjs` modified; no `plugins/` path in the commit; SKILL.md untouched (D-16 baseline intact).
- ASCII + email allowlist-inversion scan clean on all 8 staged files (no non-approved email token).
- Committer/author identity = the approved public gmail.

## Known Stubs

None. All 8 instrument files are complete and consumed by the existing harness as-is.

## User Setup Required

None - no external service configuration required. (The metered eval RUN and the `/reload-plugins` user gate belong to 12-02/12-03, not this plan.)

## Next Phase Readiness

- The instruments are in place for the D-16 before/after protocol. 12-02 edits the shipped SKILL.md (description broadening + one sweep-drive sentence-cluster), reviewed per D-17.
- 12-03 captures baselines against the current shipped skill, then (after the USER runs `/reload-plugins`, D-18) captures `after/` and reports the {trigger, drive} x {nx, kata} x {before, after} matrix + Pass@k.
- No blockers introduced by this plan.

## Self-Check: PASSED

- All 8 instrument files FOUND on disk.
- Commit `beed2a1` FOUND in git log.
- SKILL.md UNTOUCHED (D-16 pre-edit baseline confirmed).

---
*Phase: 12-autonomous-multi-round-refactoring-for-whole-package-sweeps*
*Completed: 2026-07-11*
