# Plan 12-02 Summary: SKILL.md sweep-trigger description + sweep-drive cluster

**Status:** complete
**Commit:** 98eedd5 (SKILL.md only -- preserves the D-16 pre-edit baseline: instruments in beed2a1, skill edited after)
**Executed:** inline by the orchestrator (the D-17 review must run before commit, and only the orchestrator can spawn review subagents; the gsd-executor cannot).

## What shipped

Two research-informed text edits to `plugins/lz-tdd/skills/lz-refactor/SKILL.md`, building on the committed quick-task form (8acd2b8), no catalog/smells/principles re-authoring, seam preserved (D-01):

1. **Description broadening (Gap 1 / SC1, D-02/D-04):** added the whole-package / directory / module / codebase SWEEP scan-and-fix intent category to the positive framing ("wants to sweep a whole package, directory, module, or codebase -- finding the code smells across many files and refactoring them away, not just one function") plus a multi-round apply echo ("driving a whole-package sweep across multiple rounds to completion when asked"). Category-level wording, no e2e-prompt overfit; exclude-and-reroute tail (red test -> lz-tpp; not for new code/features) intact. Description = 1484 chars (within the ~1000-1500 load-bearing window; the exclusion tail starts at char 1256, all before the 1536 listing-truncation boundary); ASCII-only.
2. **Sweep-drive cluster (Gap 2 / SC2, D-05..D-10):** ONE new paragraph appended to the "Coach by default; drive when asked" drive arm, keyed off SCOPE inside the COMMAND branch. Loop-to-fixpoint within the named scope; forward-only (no re-touch, no introduce-then-remove); explicit revert-on-red; terminal review gate (rounds reported, tests green each round, changes uncommitted, never commit unless asked); goal = fixpoint, not zero smells. All 7 D-07 pause boundaries: 1-4 REFERENCE decision steps 1/5/5/4 (never step 6, which is Reference mode); 5 (ambiguous -> pin/ask), 6 (blast radius escaping scope: exported/public-API symbol or cross-package edit -> pause+ask), 7 (flaky/slow suite -> advise) stated FRESH. Single-target COMMAND "then stop" clause and the QUESTION->advise clause byte-unchanged (D-09). Value-lead: pattern-directed / de-patterning / seam is where the skill beats a strong baseline (D-10).

SKILL.md: 153 lines (< 500).

## D-17 review (before commit, incl. >= 1 unbiased) -- PASS

- **Primed reviewer (Phase-12 contract):** PASS. Verified sweep category without overfit, seam intact, loop-to-fixpoint + forward-only + terminal gate, all 7 boundaries wired (1-4 -> steps 1/4/5 by number, 5/6/7 fresh, step 6 not used), single-target/question clauses unchanged, description within budget.
- **Unbiased from-scratch reviewer (no Phase-12 framing):** PASS-with-fixes. No blockers. One IMPORTANT finding (undefined runaway backstop / no check-in) + minor (no explicit revert-on-recoverable-red; loose "steps 1 and 5" citations).

**Fixes applied before commit:** added a concrete default ceiling + developer check-in ("once a sweep has run several rounds or begun touching many files, checkpoint ... confirm scope before pressing on"); added an explicit revert-on-red instruction; tightened the step citations (step 1 = seam only; step 5 = untested + behavior-preservation/red; step-4 balance for speculative patterns).
**Deliberately declined:** the suggested performance-exclusion clause -- locked decision D-03 / Open Question 1 says NOT to add a literal "not for performance" clause (overfit); the perf-sweep NEGATIVE carries that specificity, verified by the eval run.

## Build-time gates

- `claude plugin validate .`: PASS (exit 0).
- SKILL.md < 500 lines: 153. ASCII-only: clean. Email allowlist-inversion: only the approved public gmail present (or none) on the edited surface.
- `check-evals.mjs`: green (16 trigger / 14 near-miss, 5 lz-tpp-seam, ASCII-clean).

## Deviation / finding (needs orchestrator + user attention)

**`npm run check` is RED at HEAD, PRE-EXISTING and unrelated to this edit.** `check-catalog.mjs` fails on 3 Fowler leaves -- Extract Class, Replace Primitive with Object, Split Phase -- "Use-when not mirrored in README row". Proof it is pre-existing: the working tree only modifies SKILL.md (+ .planning/config.json); `git diff 7553151 HEAD -- .../fowler-catalog/` is empty (the catalog is byte-unchanged since before Phase 12), and `check-catalog` does not read SKILL.md. Likely introduced by the 2026-07-09 humanize-lz-refactor-docs pass (README "Use when:" rows drifted from the leaf selectors). This is OUTSIDE Phase 12's frozen-catalog scope (D-01) and was NOT fixed here. Recommended: a separate quick task to re-mirror the 3 README rows.

## Self-Check: PASSED

## Notes for the orchestrator

- SC1/SC2/SC4 remain OPEN by design: the gaps are proven CLOSED only by the metered before/after run in 12-03 (after the user runs `/reload-plugins`). Marking them now would be a false claim.
- The change is committed but NOT live until the user reloads the plugin (D-18, Plan 12-03 gate).
