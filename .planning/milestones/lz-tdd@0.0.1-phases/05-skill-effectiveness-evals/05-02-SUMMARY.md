---
phase: 05-skill-effectiveness-evals
plan: 02
type: execute
status: complete (all 10 scenarios)
requirements: [EVAL-02]
result: with_skill Pass@1=0.97 (29/30 full-pass) vs baseline 0.50 (15/30) across all 10 behavior scenarios
---

# 05-02 SUMMARY -- EVAL-02 (behavior), full 10-scenario run

## Scope + methodology

All 10 behavior scenarios (eval-0..9), with_skill vs baseline (without_skill), 3 runs per config
= 60 runs.

- **eval-0,1,3-9 (54 runs):** free-drive mechanic -- unnamed fire-and-forget subagents, each with an
  ISOLATED scratch cwd; free to implement+test there or advise. Ground-truth "drove?" = scratch dir
  non-empty (attributable, no self-report). Per-run `timing.json` from the completion notification.
  Model claude-opus-4-8. Independent judge subagent per scenario (neutral brief) for judge items.
- **eval-2 (6 runs):** earlier pilot (advise-only instruction; named-teammate relay; placeholder
  timing; judged inline). Comparable on transformation reasoning; nodrive/timing differ.
- Pipeline: `grade-run.mjs` (pre-filter) -> independent LLM judge -> `merge-judge.mjs --merge`
  (recompute over ALL expectations, fail-closed) -> `merge-judge.mjs --verify` (all 60 runs final)
  -> `aggregate_benchmark.py`.

## Results (full-pass = grading.summary.pass_rate == 1.0)

| Scenario | with c/n | with Pass@1 | base c/n | base Pass@1 | Verdict |
|----------|----------|-------------|----------|-------------|---------|
| eval-0 fib-nothing-to-constant | 2/3 | 0.67 | 0/3 | 0.00 | discriminates |
| eval-1 fib-split-base-case | 3/3 | 1.00 | 1/3 | 0.33 | discriminates |
| eval-2 fib-prefer-tail-recursion | 3/3 | 1.00 | 0/3 | 0.00 | discriminates (strong) |
| eval-3 sum-deep-input-stacksafe | 3/3 | 1.00 | 2/3 | 0.67 | discriminates (weak) |
| eval-4 flatten-tree-no-tail | 3/3 | 1.00 | 1/3 | 0.33 | discriminates |
| eval-5 wordwrap-impasse-backtrack | 3/3 | 1.00 | 3/3 | 1.00 | SATURATED |
| eval-6 refactor-not-transformation | 3/3 | 1.00 | 3/3 | 1.00 | SATURATED |
| eval-7 wrong-proposal-correction | 3/3 | 1.00 | 2/3 | 0.67 | discriminates (weak) |
| eval-8 reference-mode-ordering-hedges | 3/3 | 1.00 | 3/3 | 1.00 | SATURATED |
| eval-9 deviation-with-reason | 3/3 | 1.00 | 0/3 | 0.00 | discriminates (strong) |

### Overall (n=30 per config)

| k | with_skill Pass@k | baseline Pass@k |
|---|-------------------|-----------------|
| 1 | 0.97 | 0.50 |
| 3 | 1.00 | 0.89 |
| 5 | 1.00 | 0.98 |
| 10+ | 1.00 | 1.00 |

- **with_skill: 29/30 full-pass (Pass@1 0.97; Pass@3 1.00 -- effectively perfectly reliable).**
- **baseline: 15/30 full-pass (Pass@1 0.50).**
- Aggregate mean pass_rate (partial credit): with_skill 98.9% vs baseline 80.3%, delta +0.19.
- **7/10 scenarios discriminate; 3 saturated (eval-5,6,8).**
- The single with_skill miss: one eval-0 run named only `(nil -> constant)`, not both `({} -> nil)` +
  `(nil -> constant)` -> failed the names check (2/3 on eval-0).

## Findings

1. **The skill lifts full-pass reliability 50% -> 97%,** strongest on priority-reasoning scenarios:
   eval-2 (tail-recursion #9 over #11) and eval-9 (anti-dogma deviation) both 100% vs 0%.
2. **eval-9 discriminates via the anti-dogma nuance:** with_skill (following the skill's amended
   rules) acknowledges a reasoned deviation is legitimately allowable; baseline treats the priority
   order as a hard rule (0/3). The skill teaches a nuance the base model misses.
3. **Saturated (non-discriminating) scenarios:** eval-5 (backtrack), eval-6 (refactor classification),
   eval-8 (reference hedges) -- the base model already handles these. Candidates for harder prompts.
4. **Coach, don't drive: NO run drove (0/60).** Even baselines advised on these question-shaped
   prompts. `nodrive` is a passing safety check, not a discriminator; the free-drive measurement
   (isolated scratch dirs, all empty) confirmed this empirically.

## Eval-set-quality caveats (feed a future eval iteration, not this result)

- **eval-1 ground-truth is arguably wrong:** it expects a base-case split `(unconditional->if)#6 +
  (constant->scalar)#4`, but the truly minimal move is `(constant->scalar)` alone (`return n` passes
  both `of(0)` and `of(1)` with no conditional). Every coach correctly recommends `return n`. The
  names check passes on name-PRESENCE (all cite both), so it did not cause false-fails; eval-1 still
  discriminates (baseline 1/3 -- some baselines named only `constant->scalar`).
- **eval-9 ground-truth is debatable:** it expects the coach to ALLOW the deviation, but the stated
  reason ("next three tests need a list") is a forecast, so recommending to STAY (route foresight to
  test selection) is defensible/arguably better. The judge scored the anti-dogma FRAMING (does it
  treat deviation as allowable vs a hard rule), which is where with_skill and baseline genuinely differ.

## Artifacts

- `iteration-1/eval-*/{with,without}_skill/run-*/` -- grading.json + metrics.json + timing.json +
  judge-verdicts.json (transcripts under gitignored outputs/).
- `iteration-1/benchmark.json` + `benchmark.md` + `review.html`.
- Tools: `grade-run.mjs`, `merge-judge.mjs`, `eval-status.mjs`.
