# lz-refactor end-to-end results -- nrwl/nx

Stage (a): recommend-only, `with_skill`, 6 prompts, model `claude-opus-4-8`, read-only.
Repo `D:/projects/github/nrwl/nx` @ `23.0.x`, package `@nx/eslint-plugin`. nx working tree verified
clean after the run. Raw transcripts under `results/recommend/with_skill/<pN>/`.

## Run summary

| # | Target | smell / intent | skill invoked | answer quality vs `targets.json` | time | verdict |
|---|--------|----------------|---------------|----------------------------------|------|---------|
| p1 | T1 `enforce-module-boundaries.ts:run` | Long Function | **none** (baseline) | Excellent | 56s | PASS |
| p2 | T2 `nx-plugin-checks.ts:validateEntry` | Long Function + polymorphism bait | **none** (baseline) | Excellent | 54s | PASS |
| p3 | T3 `runtime-lint-utils.ts:findTransitiveExternalDependencies` | imperative loops -> FP | **none** (baseline) | Excellent (deviates from rubric, correctly) | 75s | PASS* |
| p4 | T4 `runtime-lint-utils.ts:groupImports` | reduce -> clarity | **none** (baseline) | Excellent | 58s | PASS |
| p5 | T5 reference / de-patterning | explain + reverse a pattern | **lz-refactor** | Excellent, catalog-grounded | 57s | PASS |
| p6 | T6 seam (failing test) | route to green step | **lz-tpp** | Excellent, correct hand-off | 39s | PASS |

`*` p3 PASSes on judgment, not on the literal rubric -- see below.

## Headline findings

1. **Coach mode did not auto-trigger.** For the four real "here is smelly code, what would you do"
   prompts (p1-p4), the model NEVER invoked lz-refactor (0 Skill-tool calls in each transcript; the
   skill was advertised in the session init but not called). It answered from its own knowledge.
   The skill only fired for the explicit named-refactoring lookup (p5 -> lz-refactor) and the
   transformation/seam question (p6 -> lz-tpp).

2. **Baseline Opus 4.8 is already catalog-grade at refactoring coaching.** Without the skill, the
   p1-p4 answers named the right Fowler refactorings, sequenced them by reward-to-risk, respected
   the over/under-engineering balance, and independently applied Feathers-style
   characterization-test discipline ("tests green only protects exercised behavior; pin the
   ambiguous case first"). Specifics:
   - **p1**: Extract Function in order (the two duplicated `fix()` closures first, then the
     resolution phase, then the check cascade); explicitly rejected a premature class and a
     data-driven `checks.forEach` (order/short-circuit matters). Matches T1 judgment exactly,
     including the closure-capture seam call (module-level for fixers/resolution, nested helpers
     for the cascade).
   - **p2**: Declined the polymorphism bait for the right reason -- `generator` and `executor`
     behave identically so `mode` collapses to migration-vs-not, and a sibling call site partitions
     on a *different* axis; "doing too much is a Long Function smell, not a type-code smell."
     Recommended finishing the half-done Extract Function, then a data descriptor if guards still
     grate. This is the CCH-02/CCH-06 discipline, unaided.
   - **p3**: **Deliberately declined** the FP loop->pipeline conversion the rubric expected, because
     it read the neighbouring `graph-utils.ts`, found a comment measuring a ~10x perf difference,
     and judged the imperative loops a deliberate hot-path house style. This is precisely the
     skill's own "Replace Pipeline with Loop only on a measured hot path / named house-style reason"
     rule -- reached independently. (It still fixed the misleading JSDoc + missing `any[]` types and
     filed the redundant reachability scan as a follow-up.)
   - **p4**: Recommended the Map-based group-by (the expected move), and additionally caught a
     latent duplicate-member bug and a dead guard in the original `reduce`, and prescribed pinning
     the duplicate case with a test before refactoring.

3. **When the skill fired, it added real value.** p5's answer is grounded in the skill's catalog
   (de-patterning via Remove Subclass / Collapse Hierarchy / Inline; Decompose Conditional as the
   lighter alternative), which is more specific than a generic model answer would likely be. p6
   correctly reframed a failing-test request as the green/transformation step and handed off to
   lz-tpp per CCH-05.

## What this means (careful reading)

- The hard fact is **(1): coach mode did not trigger** under natural, non-leading prompts in a busy
  real-repo session (25 tools, the repo's own slash-commands present). The trigger evals in
  `../iteration-1/` measure routing under a controlled harness; this is the natural `--plugin-dir`
  path, and the two disagree for coach-shaped prompts.
- We CANNOT yet conclude the skill adds no value in coach mode. We can only say (a) it didn't fire,
  and (b) the base model's unaided answers were already excellent. Measuring true marginal value
  needs either the skill forced to fire in coach mode, or a no_skill comparison where it *did* fire
  (p5/p6).
- **Rubric correction from the run**: T3's `expected_family` (Replace Loop with Pipeline) is too
  textbook for this specific code -- the adjacent perf comment makes "leave the loops" the better
  call. The prompt/target is still good; the expected answer was wrong. Updated understanding, not a
  prompt defect.

## Open decisions (staged plan)

- **(b) apply + typecheck + real tests** (`with_skill`, throwaway branch): tests application
  mechanics, not the coaching-value crux. Lower priority given finding (1)/(2).
- **(c) no_skill baseline**: most informative if scoped to **p5 + p6** (where the skill fired) to
  measure the skill's marginal value; running it for p1-p4 would near-certainly reproduce the
  identical answers (skill wasn't in the loop there).
- **Trigger-gap follow-up**: understand WHY coach mode doesn't auto-trigger via `--plugin-dir`
  (description phrasing vs. a strong base model that just answers). This is the highest-leverage
  finding for the skill itself, but is scope beyond "test end-to-end".
