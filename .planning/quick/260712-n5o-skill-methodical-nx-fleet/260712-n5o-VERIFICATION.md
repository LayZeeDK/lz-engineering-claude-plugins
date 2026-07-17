---
status: passed
quick_id: 260712-n5o
date: 2026-07-12
---

# Verification: methodical-skill research + nx fleet

## must_haves check

- [x] Part 1 RESEARCH.md delivered (E1-E8, cited); NO SKILL.md edit made (research-only, per gate).
- [x] Pre-run gate: unbiased prompt+config review PASSED before any run; json-converter path fixed;
      p13 deferred (thin net).
- [x] Part 2 ran with_skill + no_skill, p9-p12, apply, k=2, on nrwl/nx (16 valid runs; no_skill 429'd
      mid-run then resumed to completion).
- [x] Skill invocation VERIFIED: with_skill 8/8 auto-invoked lz-refactor (no /lz-refactor prefix).

## Outcome

- Auto-trigger generalizes (8/8 across 4 packages) -- the one robust skill-attributable positive.
- Null value-delta generalizes: no systematic skill advantage in behavior/quality; base Opus's best
  fleet sweep (no_skill @nx/module-federation) outclassed with_skill on that package.
- Caveats: degenerate runs in both arms (background-test-wait) at k=2; efficiency noisy (p8's +66%
  did not robustly generalize). Firm per-package numbers would need k>=3 + a wait-guard.
- No skill-induced over-engineering in the fleet (pat markers were false positives).

## Human follow-up

- Disposition (revert 12-02 / broader skill value / reference-use-case eval) is the user's call.
- Part-1 E1-E8 pending their own review + citation verification before any SKILL.md change + reload.
- Borrowed repos (nx/kata) + worktrees + stashes + all deferred eval results still need restore/commit.
