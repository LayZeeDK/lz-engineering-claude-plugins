---
quick: 260714-nxp
plan: 01
subsystem: lz-refactor-workspace / eval instruments
status: complete
tags: [eval, reference-catalog, deterministic-grader, fairness-rule]
build-commit: f08ca62
fix-commit: 714767e
metrics:
  runs: 60
  arms: [invoke_skill, no_skill]
  k: 3
  discriminating_positive: "1/8"
  mean_delta: "+0.13"
---

# Quick 260714-nxp: Build, review, and run the reference-catalog eval

Tested the one untested value lever for lz-refactor: does the curated, oracle-verified catalog give a
RECALL edge over base Opus 4.8 on on-demand explain/look-up questions (recommend mode, no repo)?

## Pipeline (all gates honored)
research -> plan (2-iteration validate: 1 blocker + 3 warnings fixed) -> BUILD instrument (`f08ca62`) ->
unbiased REVIEW (neutral + adversarial: NEEDS-CHANGES) -> fixes applied (`714767e`, GATE: PASS) -> spend
checkpoint (user approved clean-core) -> RUN (60 metered runs, 2 arms, k=3, all exit 0) -> GRADE.

## Result: reference lever essentially NULL, ONE genuine niche edge
Clean core = 8 discriminating (book-independent facts) + 2 controls. **1/8 positive; mean delta +0.13.**
- **q1 (+1.00, VERIFIED real):** the Kerievsky Refactoring-Directions dual/Away placement (Move
  Accumulation to Visitor moves away from Iterator). invoke_skill names Visitor AND Iterator from the
  catalog; no_skill says "Visitor and only Visitor ... confident it relates to Visitor alone" -- base is
  confidently WRONG. The catalog supplies a real book-table fact base misremembers.
- **7/8 parity:** base already recalls the classic Fowler/Kerievsky/GoF facts (6 saturated at 1.00; q10
  both-correct but a symmetric grader false-fail -> delta still +0.00).
- Controls saturated (1.00/1.00). invoke_skill +23% more verbose, but length buys correctness only at q1.

Excluded by the SKILL.md-echo audit (tokens in the skill body = preamble echo, not catalog recall): q3,
q5. Dropped in review-fix: q2 (saturated), q4 (SKILL.md echo).

## Interpretation
The catalog's realizable recall edge is CONCENTRATED in the oracle-settled Kerievsky direction-table
dual/Away placements -- the one class base confidently misremembers -- and is NULL everywhere else. Real
but narrow and low-utility for TDD coaching. Matches both reviewers' predicted ceiling. Confirms the
skill-improvement loop's finding: base is catalog-grade; the skill's realizable value is AUTO-TRIGGER
(proven) + a narrow reference edge on niche direction-table facts. Output-gating and general reference
recall are null/parity. Reference lever closed; no further tuning warranted.

## Artifacts
- Verdict: `.claude/skills/lz-refactor-workspace/e2e-reference/REFERENCE-RESULTS.md` (+ aggregate.json)
- Instrument: `.claude/skills/lz-refactor-workspace/e2e-reference/` (suite + prompts + targets) +
  `grade-reference.mjs` (deterministic, negation-aware, selfcheck-tested)
- Review: `260714-nxp-REVIEW.md` (GATE: PASS post-fix); Plan/Research: `260714-nxp-{PLAN,RESEARCH}.md`
- Commits: `f08ca62` (build), `714767e` (review fixes). Raw per-run results are local-only byproducts
  (convention: results/ never committed; findings live in the docs).

## Known limitation (not re-run)
grade-reference.mjs q10 anyOf under-matches "does not contain a refactoring named X" -> false-fails both
arms symmetrically; delta correct (+0.00). Left as-is; fixing changes 0/0 -> 1/1 (still parity) for no
verdict change and extra metered cost.
