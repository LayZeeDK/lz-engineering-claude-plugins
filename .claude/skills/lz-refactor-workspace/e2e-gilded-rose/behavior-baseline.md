# Kata (Gilded Rose) behavior-oracle baseline

**Captured:** 2026-07-15 from PRISTINE main (commit 3e0085b)

## Runner

`npx jest --ci test/jest/approvals.spec.ts` in the kata `TypeScript/` dir.
`--ci` refuses to write new snapshots and fails on mismatch -- this is the golden-master guard
(OQ-2 resolved: jest, not vitest).

## Golden master

Seeded by running `approvals.spec.ts` ONCE on unedited pristine `main` source: 2 snapshots written.
Retained (git-tracked) at `golden-master/approvals.spec.ts.snap` (388 lines). This is the reused
pristine-behavior record for ALL edited-source runs and BOTH arms. The locally written
`TypeScript/test/jest/__snapshots__/` was removed from the borrowed repo after copying (the workspace
copy is the record; borrowed repo restored to clean main).

## Reuse recipe (13-04 behavior oracle)

1. Check out a fresh throwaway branch off `main`; `git apply` the run's `diff.patch` to the edited source.
2. Restore the golden master into place: copy the workspace `golden-master/approvals.spec.ts.snap`
   to `TypeScript/test/jest/__snapshots__/approvals.spec.ts.snap`.
3. Run `npx jest --ci test/jest/approvals.spec.ts`.
   - PASS -> behavior preserved (edited source still matches the pristine golden master).
   - FAIL / snapshot mismatch -> behavior changed (not behavior-preserving).
4. Ignore `test/jest/gilded-rose.spec.ts` -- it asserts the 'fixme' placeholder, not behavior.
