---
phase: 13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness
plan: 05
status: complete
completed: 2026-07-15
requirements: [SPEC-req-5, SPEC-req-6]
---

# Plan 13-05 Summary: 13-RESULTS.md head-to-head + verdict, restore + hygiene

## What was built

- **grading/summary.json**: machine-readable rollup joining fidelity.json + name-layer.json +
  behavior.json per {cell, arm} with Pass@k (passAtK/passHatK formulas copied verbatim from
  run-e2e.mjs).
- **13-RESULTS.md** (128 lines): header block + a Book-authenticity table + a Correctness table
  (per-cell with_skill/invoke_skill vs no_skill, Pass@k), a Caveats section, and an empirical
  Verdict.
- **Unbiased from-scratch review (Task 2)**: an independent reviewer, given ONLY the grading records
  (not the authored verdict), independently returned "parity" and: (1) confirmed all Pass@k values
  are internally consistent with their {n,c}; (2) identified the lone sub-1.0 (p2 with_skill
  name/layer 0.67) as a denominator-convention artifact of the no-edit decline, not a miss; (3) found
  a "beats base" claim unsupported and strict parity accurate; (4) flagged the gr1 with_skill
  Strategy reach as a mild over-reach (not a win); (5) confirmed no fidelity `why` field quotes
  source prose (DST-04 clean). The Verdict + p2 caveat were reconciled to these findings.
- **Restore + hygiene (Task 3)**: both borrowed repos restored pristine (nx clean at origin/23.0.x;
  kata back on protected main, throwaway branch lz13-kata-apply deleted); no leftover worktrees.
  Hygiene gate clean: ASCII-only authored artifacts; only the approved gmail present
  (allowlist-inversion); no .oracle path/prose in grading records or RESULTS; all phase-13 commit
  author AND committer emails = the approved gmail.

## Verdict (empirical)

**PARITY between lz-refactor (with_skill/invoke_skill) and base Opus 4.8 @ high on BOTH measured
dimensions of applied output -- book authenticity and correctness.** All 11 cell x arm groups sit at
Pass@1 = 1.00 on book-authenticity fidelity, name/layer correctness (apply runs), and
behavior-preservation; the single sub-1.0 is a QUESTION-mode advise-only decline artifact, not a
defect. This CONFIRMS the prior finding (E2E-FINDINGS.md): base Opus 4.8 @ high is already
catalog-grade on the mechanical bulk and, unprompted, respects the same over-engineering guardrails
the skill encodes. The skill shows no clean applied-output advantage; its value stays where prior
phases located it (auto-triggering; pattern-direction vocabulary; explicit over-engineering
judgment) and is "harmless" where base is already catalog-grade.

## Key files

created:
- .planning/phases/13-.../13-RESULTS.md
- .claude/skills/lz-refactor-workspace/grading/summary.json

## Verification

- 13-RESULTS.md has both dimension tables + Caveats + an empirical Verdict (parity, not a pre-assumed
  win); summary.json joins all three grading records with Pass@k. [OK]
- Unbiased reviewer independently confirmed parity; verdict reconciled. [OK]
- Both borrowed repos pristine; throwaway branch deleted; no worktrees. [OK]
- Hygiene: ASCII-only; only approved gmail; no .oracle path/prose; author+committer = approved gmail. [OK]

## Self-Check: PASSED
