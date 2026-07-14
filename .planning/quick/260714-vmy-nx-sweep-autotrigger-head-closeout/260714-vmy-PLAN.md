---
quick_id: 260714-vmy
slug: nx-sweep-autotrigger-head-closeout
mode: quick-full
created: 2026-07-14
description: Measure the nx whole-package sweep auto-trigger on HEAD to close the Phase-12 WARNING
must_haves:
  truths:
    - The nx whole-package sweep prompt (p8) auto-triggers lz-refactor on HEAD (20e2790+) in with_skill APPLY mode, measured directly (not inferred), matching the pre-revert 3/3 and the post-revert kata gr4 3/3.
    - Grading is auto-trigger ONLY (meta.json used_refactor / skills_invoked fires); drive/quality is NOT re-litigated (settled: null skill delta, base catalog-grade).
    - If p8 does NOT fire, that is a genuine regression from the 9832c74 revert and is investigated instead of flipped.
  artifacts:
    - .planning/phases/12-*/12-VALIDATION.md WARNING flipped from "inferred" to "measured/CONFIRMED" (or regression noted) with the run rate + date.
    - .planning/phases/12-*/12-VERIFICATION.md audit_notes evidential-nuance finding updated to reflect the direct HEAD measurement.
    - Raw run evidence at .claude/skills/lz-refactor-workspace/e2e-nx/results/apply/with_skill/p8/ (3x meta.json; gitignored workspace, not committed).
  key_links:
    - .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs
    - .claude/skills/lz-refactor-workspace/e2e-nx/suite.json
    - .planning/HANDOFF.json
---

# Quick Task 260714-vmy: nx whole-package sweep auto-trigger on HEAD (close Phase-12 WARNING)

## Boundary

Narrow close-out of ONE non-blocking WARNING carried by 12-VALIDATION.md and
12-VERIFICATION.md (audit_notes): the nx whole-package sweep auto-trigger was measured
PRE-revert (p8 3/3, fleet 8/8) against the broadened 12-02 description that was later
reverted (9832c74); post-revert only the kata sweep (gr4 3/3) was directly re-confirmed on
HEAD. This converts the nx measurement from strongly-inferred to directly-measured on HEAD.

NOT in scope: re-opening output-value gating or the reference-catalog lever (both tested and
closed -- see memory lz-refactor-output-warrant-axis-exhausted). Grade auto-trigger only.

## Task

1. **Infra (done in orchestrator):** re-create the nx throwaway apply branch
   `git checkout -b lz-refactor-e2e-smoke origin/23.0.x` in `D:/projects/github/nrwl/nx`
   (apply mode reset --hard's to applyBase each run and refuses protected branches).
   - files: (external repo; no repo edits)
   - verify: `git -C D:/projects/github/nrwl/nx rev-parse --abbrev-ref HEAD` == `lz-refactor-e2e-smoke`
   - done: branch checked out at origin/23.0.x

2. **Metered run (user-gated, approved):** run
   `node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs --mode apply --prompt p8 --arm with_skill --cwd D:/projects/github/nrwl/nx --runs 3`
   on HEAD (reads the live skill via --plugin-dir). 3 claude -p sessions, opus-4-8/high.
   - files: .claude/skills/lz-refactor-workspace/e2e-nx/results/apply/with_skill/p8/run-{1,2,3}/meta.json
   - verify: 3 meta.json exist with exit_code 0
   - done: 3 runs captured; used_refactor / skills_invoked read per run

3. **Grade + reconcile:** grade auto-trigger (fires iff used_refactor true or lz-refactor in
   skills_invoked). If >=2/3 fire (matching prior 3/3), flip the WARNING to CONFIRMED in
   12-VALIDATION.md + 12-VERIFICATION.md with the measured rate + date. If it does NOT fire,
   document a regression finding instead (the revert removed something load-bearing) and do
   not flip.
   - files: .planning/phases/12-*/12-VALIDATION.md, .planning/phases/12-*/12-VERIFICATION.md
   - verify: WARNING text reflects measured-on-HEAD (or regression); git grep confirms no
     "inferred, not directly re-measured" language remains stale if fired
   - done: both artifacts reconciled + committed

## Restore

After the run, the nx throwaway branch is left for the operator to clean up (checkout
23.0.x + delete branch) -- destructive git on nx is classifier-gated and needs user OK.
