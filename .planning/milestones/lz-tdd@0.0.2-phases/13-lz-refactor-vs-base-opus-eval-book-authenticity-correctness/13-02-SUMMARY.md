---
phase: 13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness
plan: 02
status: complete
completed: 2026-07-15
requirements: [SPEC-req-1, SPEC-req-2]
---

# Plan 13-02 Summary: 18 metered apply runs (D-09 gated)

## What was built

Generated the 18 net-new metered `claude -p` apply runs through the existing `run-e2e.mjs`
harness, gated by the D-09 eval-run-approval checkpoint (user pre-approved; auto-approved against
the concrete 18-run manifest). All runs `claude-opus-4-8 @ high`, `--setting-sources project`, k=3.

- **Task 1 (dry-run):** all four command groups dry-run-verified (no spend); no_skill omits
  `--plugin-dir`, gr4 with_skill includes it; kata `--cwd` on throwaway branch (not protected main).
- **Task 2 (D-09 gate):** manifest (6 cells, 18 runs) auto-approved per the standing pre-approval.
- **Task 3 (runs):** executed as two parallel detached jobs (different repos, no contention).

### Results (all 18 exit 0, diffs persisted into the tracked workspace)

| Cell | Arm | Runs | changed_files/run | Note |
|------|-----|------|-------------------|------|
| nx p1 (T1) | no_skill | 3 | 1-2 | baseline |
| nx p2 (T2) | no_skill | 3 | 1 | baseline |
| nx p8 (pkgsweep) | no_skill | 3 | 5 | baseline sweep (matches with_skill p8 5-file scope) |
| kata gr1 (G1) | no_skill | 3 | 2 | baseline |
| kata gr4 (projsweep) | with_skill | 3 | 2 | used lz-refactor |
| kata gr4 (projsweep) | no_skill | 3 | 2 | baseline |

Reused (NOT re-run, per amended D-02 / OQ-1): nx p8 with_skill (committed k=3), nx with_skill
single-target p1/p2, kata with_skill + invoke_skill gr1.

## Key deviations (recorded)

- **Persistence path:** `run-e2e.mjs` captures `git diff --cached <applyBase>` into the tracked
  workspace tree BEFORE resetting each borrowed repo, so the diffs survive restoration (SPEC req 2).
- **ASCII normalization:** the raw `answer.md` captures contained Unicode punctuation
  (em/en dash, arrow, x, ellipsis, >=); all 18 new answer.md were normalized to ASCII before commit
  (diff.patch + meta.json were already ASCII).
- Borrowed repos left with the last run's working-tree edits (expected; 13-04 resets per-run,
  13-05 does final canonical restoration).

## Key files

created: 54 tracked artifacts (18 runs x {diff.patch, meta.json, answer.md}) under
`.claude/skills/lz-refactor-workspace/{e2e-nx,e2e-gilded-rose}/results/apply/`.

## Verification

- All 6 cells x 3 runs have meta.json + non-empty diff.patch (18/18). [OK]
- no_skill commands omitted --plugin-dir; gr4 with_skill included it. [OK]
- New tracked result files ASCII-only; no email-shaped tokens; committer = approved gmail. [OK]
- Reused nx p8 with_skill diffs still present (k=3). [OK]

## Self-Check: PASSED
