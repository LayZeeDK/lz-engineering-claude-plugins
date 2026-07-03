---
phase: 05-skill-effectiveness-evals
plan: 02
type: execute
status: complete (discriminating subset)
requirements: [EVAL-02]
result: with_skill Pass@1=1.00 (12/12 full-pass) vs baseline 0.50 (6/12) across the discriminating subset (eval-2,3,4,5)
---

# 05-02 SUMMARY -- EVAL-02 (behavior), discriminating subset

## Scope + methodology

Per user decision (token cost ~4.1M for the full 10-scenario run), EVAL-02 was run on the
**discriminating subset**: eval-2, eval-3, eval-4, eval-5. Each scenario: with_skill vs
baseline (without_skill), 3 runs per config (24 runs total).

- **eval-3/4/5 (18 runs):** free-drive mechanic -- unnamed fire-and-forget subagents, each with an
  ISOLATED scratch cwd; free to implement+test there or just advise. Ground-truth "drove?" =
  scratch dir non-empty (attributable, no self-report). Per-run `timing.json` captured from the
  completion notification (subagent_tokens / duration_ms). Model: claude-opus-4-8. Independent
  judge subagent per scenario (neutral brief) for the `judge_required` items.
- **eval-2 (6 runs):** the earlier pilot (advise-only instruction; named-teammate relay; placeholder
  timing; judged inline). Methodology differs slightly (nodrive was constrained, timing is a
  placeholder) but the transformation-reasoning verdicts are directly comparable.
- Grading pipeline (validated end-to-end): `grade-run.mjs` (deterministic pre-filter) ->
  independent LLM judge -> `merge-judge.mjs --merge` (recompute over ALL expectations, fail-closed)
  -> `merge-judge.mjs --verify` (pre-aggregate gate; all 24 runs final) -> `aggregate_benchmark.py`
  -> Pass@k/Pass^k.

## Results

### Full-pass counts + Pass@k/Pass^k (per scenario, n=3)

| Scenario | with c/n | with Pass@1 | with Pass^3 | base c/n | base Pass@1 | base Pass^3 | Discriminating? |
|----------|----------|-------------|-------------|----------|-------------|-------------|-----------------|
| eval-2 fib-prefer-tail-recursion | 3/3 | 1.00 | 1.00 | 0/3 | 0.00 | 0.00 | YES (strong) |
| eval-3 sum-deep-input-stacksafe | 3/3 | 1.00 | 1.00 | 2/3 | 0.67 | 0.00 | YES (weak) |
| eval-4 flatten-tree-no-tail | 3/3 | 1.00 | 1.00 | 1/3 | 0.33 | 0.00 | YES |
| eval-5 wordwrap-impasse-backtrack | 3/3 | 1.00 | 1.00 | 3/3 | 1.00 | 1.00 | SATURATED (both 1.0) |

"Full pass" = grading.summary.pass_rate == 1.0 (ALL expectations for that run pass).

### Overall (n=12 per config)

| k | with_skill Pass@k | with_skill Pass^k | baseline Pass@k | baseline Pass^k |
|---|-------------------|-------------------|-----------------|-----------------|
| 1 | 1.00 | 1.00 | 0.50 | 0.50 |
| 3 | 1.00 | 1.00 | 0.91 | 0.09 |
| 5 | 1.00 | 1.00 | 0.99 | 0.01 |
| 12 | 1.00 | 1.00 | 1.00 | 0.00 |

- **with_skill: 12/12 full-pass -- Pass^k = 1.00 at every k (perfectly reliable across the subset).**
- **baseline: 6/12 full-pass -- Pass@1 = 0.50; Pass^3 = 0.09 (very unlikely all 3 runs pass a scenario).**
- Aggregate mean per-run pass_rate (partial credit): with_skill 100% vs baseline 75.7%, delta +0.24.

## Findings

1. **The skill's value is transformation REASONING, concentrated in priority scenarios.** eval-2
   (prefer `(statement -> tail-recursion)` #9 over plain `(statement -> recursion)` #11) and eval-4
   (state #9 unavailable for tree recursion; recommend explicit-stack `(if -> while)` #10) are where
   baseline fails most (0/3 and 1/3). With the skill, both are 3/3.
2. **eval-3 weakly discriminates:** a competent baseline already reaches iteration for stack safety
   (2/3 full-pass). The skill's edge is the crisper "the deep-input test makes stack safety
   BEHAVIORAL -- a transformation" framing; one baseline run framed it as a mere optimization and failed.
3. **eval-5 is saturated (both 1.0):** both configs steer to a smaller move (with_skill via a TPP
   test-ladder avoiding `(expression -> function)` #12; baseline via fake-it + triangulate).
   Non-discriminating -- candidate for a harder prompt.
4. **Coach, don't drive: NO run drove (0/24).** Even baselines advised -- the question-shaped prompts
   ("what's the next move?") elicit advice, not code, from both configs. So `nodrive` is a passing
   safety check here, not a discriminator; the free-drive measurement (isolated scratch dirs, all
   empty) confirmed this empirically rather than by assumption.

## Judge discrimination (why the merge/judge step matters)

The deterministic pre-filter alone could not have produced these verdicts:
- eval-2 baseline run-3 NAMED `(statement -> tail-recursion)` only to REJECT it -> the name-match
  scored 2/2 but the judge correctly failed it (recommended plain recursion) -> 2/3, not a false 3/3.
- eval-3/eval-4 discrimination is entirely (eval-3) or partly (eval-4) in judge items.

## Artifacts

- `.claude/skills/lz-tpp-workspace/iteration-1/eval-{2,3,4,5}-*/{with,without}_skill/run-*/` --
  grading.json + metrics.json + timing.json + judge-verdicts.json (transcripts under gitignored outputs/).
- `iteration-1/benchmark.json` + `benchmark.md` + `review.html` (aggregate + static viewer).
- Tools: `grade-run.mjs`, `merge-judge.mjs`, `eval-status.mjs` (resume map).

## Deferred

- eval-0, eval-1, eval-6..9 (non-discriminating-core scenarios) NOT run (token budget). The subset
  is sufficient to establish the skill's behavioral value; the remaining scenarios can run later via
  the same mechanic (`eval-status.mjs` shows what's outstanding; resume re-spawns only missing runs).
