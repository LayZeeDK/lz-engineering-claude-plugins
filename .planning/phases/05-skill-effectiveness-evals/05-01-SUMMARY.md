---
phase: 05-skill-effectiveness-evals
plan: 01
type: execute
status: complete
requirements: [EVAL-01, EVAL-02]
result: eval data + deterministic grader + gitignore authored (backfilled summary)
---

# 05-01 SUMMARY -- Eval data + grader (backfilled 2026-07-03)

Authored the Wave-0 eval inputs and the deterministic grader consumed by 05-02/05-03. (Summary
backfilled after the fact; the work was committed in prior sessions.)

## Delivered

- `.claude/skills/lz-tpp-workspace/evals/trigger-eval.json` -- **27** `{query, should_trigger}` objects
  (13 should-trigger incl. 9 jargon-free positives / 14 genuinely-tricky near-misses). (D-02)
  *(Plan text said ">=18 / 20"; the authored set is 27 -- see the stale-count corrections in 05-02/05-03 plans.)*
- `evals/trigger-smoke.json` -- 2-query smoke subset (gate before the full trigger run).
- `evals/evals.json` -- `{skill_name, evals[]}` with **10** named-transformation behavior scenarios
  (eval-0..9), each carrying a "coach, don't drive" assertion. (D-03) *(Plan text said 7; authored 10.)*
- `iteration-1/eval-0..9/eval_metadata.json` -- 10 per-scenario metadata files (eval_id, name, prompt, assertions).
- `grade-run.mjs` -- deterministic PRE-FILTER grader (transformation-name presence + nodrive; nuance
  delegated to an LLM judge). Hardened over 3 review rounds incl. a fresh/unbiased pass that caught a
  CRITICAL nested-vs-flat metrics-shape false-pass; `--selfcheck` passes. (D-04)
- Root `.gitignore` rules for `.claude/skills/*-workspace/**/outputs/` (raw transcripts) and caches. (DIST/D-08)

## Notes

- Ground truth lifted from the locked references (fibonacci-worked-example, typescript-and-tco,
  transformations.md), not re-derived.
- Two eval-set-quality issues surfaced later during execution (documented in 05-02-SUMMARY): eval-1
  over-specifies a base-case split; eval-9's "allow the deviation" expectation is debatable. Neither
  caused false-fails; candidates for a future eval iteration.
