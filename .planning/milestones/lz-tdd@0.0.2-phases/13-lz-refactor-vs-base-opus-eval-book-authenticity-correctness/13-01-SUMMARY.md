---
phase: 13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness
plan: 01
status: complete
completed: 2026-07-15
requirements: [SPEC-req-4, SPEC-req-6]
---

# Plan 13-01 Summary: Behavior-oracle baselines

## What was built

Captured the two independent behavior-oracle baselines that every wave-3 correctness grade is
scored against, on PRISTINE borrowed repos, before any metered apply run. No metered `claude -p`
spend; no shipped-skill change.

- **nx differential baseline** (`e2e-nx/behavior-baseline.json`): pristine `origin/23.0.x`
  (`fea2cabbcc`) records **15 failed / 169 passed / 184 total**; all 15 failures are isolated to
  `dependency-checks.spec.ts` (a single pre-existing `TypeError: Cannot redefine property:
  detectPackageManager` from `spyOn(...)` at line 1714, jest-mock 30.3.0). Behavior-preservation
  grading in 13-04 is DIFFERENTIAL: a run preserves behavior when it adds NO NEW failures beyond
  this baseline.
- **kata golden master** (`e2e-gilded-rose/golden-master/approvals.spec.ts.snap`, 388 lines):
  seeded by running `approvals.spec.ts` ONCE on pristine `main` (`3e0085b`); 2 snapshots. Reused
  across all runs/arms; verified with `jest --ci` (refuses to write, fails on mismatch).
- **kata runner note** (`e2e-gilded-rose/behavior-baseline.md`): documents the `jest --ci` runner
  (OQ-2) and the 13-04 reuse recipe.

## Key deviation (recorded)

`npx nx test eslint-plugin` does NOT work on this arm64 Windows box -- it fails at the
`nx:build-native` Rust prerequisite ("Failed to copy artifact", exit 130). Workaround (matches
RESEARCH Pitfall 2 / "raw jest"): the behavior oracle uses raw jest directly against the package
config -- `npx jest --config packages/eslint-plugin/jest.config.cts --ci` -- which bypasses
build-native. This command is recorded in `behavior-baseline.json.runner` for 13-04 to reuse.

## Key files

created:
- .claude/skills/lz-refactor-workspace/e2e-nx/behavior-baseline.json
- .claude/skills/lz-refactor-workspace/e2e-gilded-rose/golden-master/approvals.spec.ts.snap
- .claude/skills/lz-refactor-workspace/e2e-gilded-rose/behavior-baseline.md

## Verification

- behavior-baseline.json non-empty; `passed`/`failed` present (169 / 15). [OK]
- golden-master snapshot + behavior-baseline.md present and non-empty. [OK]
- Both borrowed repos clean after capture (nx on origin/23.0.x; kata on main). [OK]
- All 3 new artifacts ASCII-only; no email-shaped tokens. [OK]

## Self-Check: PASSED
