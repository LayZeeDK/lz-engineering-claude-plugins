# lz-tpp Skill Effectiveness Evals -- Results

Phase 5 (optional-final, NON-BLOCKING). Measures the shipped `lz-tpp` skill on two axes:
EVAL-01 (does the `description` trigger correctly?) and EVAL-02 (when triggered, does the coach
recommend the correct next transformation by priority?). Nothing here can regress the shipped skill;
it feeds at most a single gated D-07 description-tuning pass.

Model: claude-opus-4-8 (the session model users experience). Runs: 3 per query/scenario/config (D-05).

## EVAL-01 -- Trigger accuracy (native, 27 queries x3)

| Metric | Result | D-06 bar (~90%) |
|--------|--------|-----------------|
| Should-trigger RECALL (rate >= 0.5) | **1/13 = 8%** | MISS (large gap) |
| Near-miss SPECIFICITY (rate < 0.5) | **14/14 = 100%** | PASS |

The `description` fires only on explicit TPP jargon (transformation names, "transformation priority
premise") and stays silent on the 9 jargon-free red-green-refactor situations it's meant for
(a failing `expect(of(2)).toBe(1)` with trivial code, a Roman-numeral kata at `return`, etc.).
Specificity is perfect precisely because it is so narrow. Run verified trustworthy (7.4 min /
81 sessions excludes throttling; the rolling usage limit was hit AFTER completion). Details:
`.planning/phases/05-skill-effectiveness-evals/05-03-SUMMARY.md`; raw: `trigger-results.json`.

## EVAL-02 -- Behavior / next-transformation (discriminating subset: eval-2,3,4,5)

Ran the discriminating core (token budget: full 10-scenario run ~= 4.1M tokens). with_skill vs
baseline, 3 runs each, 24 runs total. Free-drive with isolated scratch dirs (ground-truth "drove?");
independent judge subagent per scenario; fail-closed grade -> judge -> merge -> verify -> aggregate.

| Scenario | with_skill (full-pass, Pass@1) | baseline (full-pass, Pass@1) | Verdict |
|----------|-------------------------------|------------------------------|---------|
| eval-2 fib prefer tail-recursion | 3/3, 1.00 | 0/3, 0.00 | strongly discriminating |
| eval-4 flatten tree-no-tail | 3/3, 1.00 | 1/3, 0.33 | discriminating |
| eval-3 sum deep-input stack-safe | 3/3, 1.00 | 2/3, 0.67 | weakly discriminating |
| eval-5 wordwrap impasse backtrack | 3/3, 1.00 | 3/3, 1.00 | saturated (both 1.0) |

**Overall (n=12/config):** with_skill **Pass@1 = 1.00, Pass^12 = 1.00** (12/12 full-pass) vs
baseline **Pass@1 = 0.50, Pass^3 = 0.09** (6/12). Aggregate mean pass_rate 100% vs 75.7%, delta +0.24.

**The skill lifts full-pass reliability from 50% (baseline) to 100%, concentrated in the
priority-reasoning scenarios (eval-2, eval-4).** Findings + Pass^k table:
`.planning/phases/05-skill-effectiveness-evals/05-02-SUMMARY.md`; viewer: `iteration-1/review.html`.

Notable: NO run drove (0/24) -- even baselines advised on these question-shaped prompts -- so the
"coach, don't drive" check is a passing safety net here, not a discriminator. The skill's measured
value is transformation *reasoning* (naming the correct higher-priority transformation, rejecting
lower-priority moves, applying the TS/JS no-TCO overlay), which the LLM judge is required to detect
(e.g. eval-2 baseline named `(statement -> tail-recursion)` only to reject it -- a false name-match
the judge correctly failed).

## D-06 verdict

- **Behavior (EVAL-02): PASS.** When the skill is invoked, it clearly improves next-transformation
  choice vs baseline (100% vs 50% full-pass on the discriminating subset). The load-bearing core --
  "recommend the correct next transformation by priority" -- holds.
- **Trigger (EVAL-01): MISS.** Recall 8% is far below the ~90% bar; the description is too narrow.
  Specificity is perfect (100%). This is the classic under-triggering failure -- the skill is
  excellent when it fires but rarely fires without explicit TPP jargon.

## D-07 recommendation (gated, NOT yet applied)

Widen the `description` so it also triggers on jargon-free red-green-refactor situations (a failing
test + current code + "what's the smallest change / next move") WITHOUT sacrificing the 100%
specificity (must stay quiet on plain refactor / write-a-function / test-authoring / complexity
questions). skill-creator guidance: make the description a bit "pushy" about TDD/red-test contexts.
Re-measure EVAL-01 after any edit; only edit `plugins/lz-tdd/skills/lz-tpp/SKILL.md`. This is the
single allowed, human-gated tuning pass -- deferred here (needs approval + token spend for
re-measurement). Phases 1-4 (the public ship) remain complete regardless.

## Reproduce / resume

- Trigger: `python -m scripts.run_eval --eval-set <ws>/evals/trigger-eval.json --skill-path <lztpp> --model claude-opus-4-8 --runs-per-query 3` from `tools/skill-creator-eval/`.
- Behavior status/resume: `node eval-status.mjs iteration-1 --evals <slugs>` (re-spawn only MISSING runs).
- Grade chain: `grade-run.mjs` -> judge -> `merge-judge.mjs --merge` -> `--verify` -> `aggregate_benchmark.py`.
