# lz-refactor end-to-end results -- nrwl/nx

Stage (a): recommend-only, `with_skill`, 6 prompts x **k=3 runs** = 18 sessions.
Model `claude-opus-4-8`; effort `high` (Anthropic's default -- these runs did not pin it, but
`--setting-sources project` drops the user's global `effortLevel`, so the compiled default `high`
applied; the runner now pins `--effort high` explicitly for future iterations). Read-only.
Repo `D:/projects/github/nrwl/nx` @ `23.0.x`, package `@nx/eslint-plugin`. nx tree verified clean.
Raw transcripts under `results/recommend/with_skill/<pN>/run-<k>/` (`outputs/` gitignored).

## Skill-fire reliability (k=3)

"fired" = the run invoked an lz skill (the deterministic, gradeable signal). Pass@k on skill-firing:

| prompt | intent | run-1 | run-2 | run-3 | fired | pass@1 | pass@3 | pass^3 |
|--------|--------|-------|-------|-------|-------|--------|--------|--------|
| p1 | coach: Long Function | - | - | - | **0/3** | 0.00 | 0.00 | 0.00 |
| p2 | coach: polymorphism bait | - | lz-refactor | - | **1/3** | 0.33 | 1.00 | 0.00 |
| p3 | coach: loops -> FP | - | - | - | **0/3** | 0.00 | 0.00 | 0.00 |
| p4 | coach: reduce -> clarity | - | - | - | **0/3** | 0.00 | 0.00 | 0.00 |
| p5 | reference / de-patterning | lz-refactor | lz-refactor | lz-refactor | **3/3** | 1.00 | 1.00 | 1.00 |
| p6 | seam (failing test) | lz-tpp | lz-tpp | lz-tpp | **3/3** | 1.00 | 1.00 | 1.00 |

- **Coach mode (p1-p4): 1/12 runs fired the skill.** Non-triggering is consistent across k=3, not a
  single-sample fluke.
- **Reference (p5): 3/3 fired lz-refactor.** Seam (p6): 3/3 fired lz-tpp (correct hand-off).
- Overall with_skill: **7/18 fired**, pass@1 0.39 (dominated by the reference/seam prompts).

## Answer quality (graded vs `targets.json`)

All 18 answers PASS the rubric on substance -- including the 11 coach-mode runs where the skill did
NOT fire. Quality is consistent across runs, so **baseline Opus 4.8 @ high is already catalog-grade
at refactoring coaching**:
- **p1** (all 3 runs): Extract Function sequenced (duplicated `fix()` closures first, then resolution,
  then the check cascade); explicitly rejected a premature class / data-driven array.
- **p2** (all 3 runs): rejected the polymorphism bait for the right reason (generator/executor are
  identical -> binary axis; two identical subclasses = duplication smell); recommended finishing the
  half-done Extract Function, with a mode-descriptor table as the lighter alternative.
- **p3** (all 3 runs): declined the FP loop->pipeline conversion the rubric expected, citing the
  measured ~10x perf comment in the neighbouring `graph-utils.ts` and the hot path -- the skill's own
  "Replace Pipeline with Loop only on a measured hot path" rule, reached unaided. (Rubric corrected.)
- **p4** (all 3 runs): Map-based group-by (expected) + caught the latent duplicate-member bug + dead
  guard + prescribed a characterization test first.
- **p5** (3/3): catalog-grounded de-patterning (Remove Subclass / Collapse Hierarchy / Inline).
- **p6** (3/3): reframed the failing-test request as the green/transformation step and handed off to
  lz-tpp per CCH-05.

## The natural experiment: p2 (fired once in 3)

p2 is the single prompt where the skill fired in exactly one of three runs -- a free within-prompt
A/B on the SAME input:
- **run-2 (fired lz-refactor)** vs **run-1 / run-3 (baseline, no fire)**: all three reach the
  *substantively identical* conclusion (reject polymorphism, finish Extract Function, offer the
  descriptor table, note the Repeated Switches smell).
- The only material difference in the fired run is an **explicit Fowler citation** ("Reserve it for
  genuine type-based variation..."). The two baseline runs make the same argument in their own words.

**Read:** for these targets, the skill's coach-mode marginal value is *grounding/citation*, not a
different or better recommendation. The base model already produces the right named refactoring and
the right over/under-engineering judgment.

## with_skill vs no_skill (p2, p5, p6 -- where the skill fired), k=3

`no_skill` = the identical command WITHOUT `--plugin-dir` (baseline Opus 4.8 @ high, no lz plugin).
Run for the three prompts where the skill actually fired; p1/p3/p4 are omitted (the skill was never
in the loop there, so with == without by construction).

| prompt | with_skill | no_skill (baseline) | skill marginal value |
|--------|-----------|---------------------|----------------------|
| p2 (coach) | rejects polymorphism; finish Extract Function; `MODE_RULES` descriptor | **same**: rejects polymorphism (generator/executor identical -> boolean; "variation is data, not behavior"; fights the functional style); finish Extract Function; `MODE_RULES` descriptor; same cross-field impl-or-prompt caveat | **~none** |
| p5 (reference) | catalog-grounded de-patterning; cites the skill's own leaf | **same or richer**: names it from Fowler; canonical Bird example; 6 over-application signs; reverse moves (Replace Subclass with Fields / Inline Class / collapse hierarchy) | **~none** (baseline if anything more thorough) |
| p6 (seam) | reframes as a *transformation*; TPP `(nil->constant)`/`(constant->scalar)`; fake-it-then-triangulate; hands to lz-tpp | gets the core call unaided -- "a function hardcoded to `return null` isn't a refactor situation, it's unimplemented -- implement the split" -- but NO TPP framing, vocabulary, or numbered move | **moderate**: skill adds TPP structure + green-step discipline; baseline still nails the essential distinction |

**Net:** the skill's marginal value over baseline Opus 4.8 @ high is **~zero for the coach (p2) and
reference (p5)** prompts and **moderate for the seam (p6)** -- concentrated in TPP-structured
green-step handling and catalog grounding, NOT in reaching the right refactoring (baseline already
does). This confirms the p2 within-prompt natural experiment at the arm level.

## Addendum: invoke_skill + apply (nx)

**invoke_skill, recommend, p1-p4, k=3 (12 runs):** forced via `/lz-tdd:lz-refactor` -> **12/12 activated**.
Establishes skill-activated coaching quality for the coach prompts that never auto-trigger. Content is
clearly skill-driven (classifies the refactor/lz-tpp seam; cites the catalog; p1 invoke even surfaced the
`isComboDepConstraint` duplication appearing ~6x) -- and substantively matches the strong baseline, adding
catalog grounding rather than a different conclusion.

**apply, with_skill, p1-p4, k=3 (11 runs + the p4 smoke):** ran on throwaway branches (2-parallel: main
clone p1/p2, junctioned worktree p3/p4).
- **Auto-trigger split:** p1 (`run`, ~530 lines) **3/3**, p2 (`validateEntry`) **3/3**, p3 **0/3**, p4
  **0/3**. So apply framing raises the trigger rate over recommend (coach recommend 1/12) and it
  correlates with target size / how obviously the task is "a refactoring."
- **Skill-driven apply works:** p1 applied incremental Extract Function (the visitor's phase checks ->
  named `report*`/`check*` fns, short-circuit preserved), typecheck + tests between steps; p3/p4 applied
  the functional pipeline / Map rewrite, tests green (p3 46/46).
- **coach-vs-apply tension:** p2 run-3 fired the skill but produced **0 edits** (advice only) -- the
  skill's "never edit unless asked" can override an explicit apply directive.

See [../E2E-FINDINGS.md](../E2E-FINDINGS.md) for the cross-suite synthesis (nx + Gilded Rose).

## Conclusions

1. **Coach-mode auto-triggering is effectively absent** (1/12) under natural, non-leading "clean up
   this code" prompts via `--plugin-dir` in a busy real-repo session (25 tools, the repo's own
   slash-commands present). This is the skill's stated primary use case.
2. **When it does fire (p2 once), the answer is not materially better** than the baseline non-fired
   runs -- only more explicitly catalog-cited. Baseline Opus 4.8 @ high is already strong here.
3. **The skill fires reliably and adds clear value for the two non-coach shapes**: explicit
   named-refactoring / de-patterning lookups (p5 -> lz-refactor, 3/3) and the green-step seam
   (p6 -> lz-tpp hand-off, 3/3).
4. **Implication for the skill.** Either (a) strengthen coach-mode triggering (description / routing
   so "tests green, tidy this smelly code" reliably loads lz-refactor), and/or (b) reframe the value
   proposition toward reference + seam + de-patterning + cross-session consistency, where the skill
   demonstrably fires and helps. The end-to-end evidence does not support a coach-mode value claim as
   things stand.

## Caveats / scope

- Effort = `high` (Anthropic default), NOT the maintainer's personal `xhigh`; single model
  (opus-4-8); `--setting-sources project` (clean, user-plugin-free env). A stronger/weaker model or
  a busier/leaner session could shift triggering.
- Grading is qualitative (author read of `answer.md` vs `targets.json`); N=3 per prompt.
- `--plugin-dir` natural triggering may differ from marketplace-installed triggering; the
  `../iteration-1/` trigger evals measure routing under a controlled harness and disagree with this
  natural path for coach-shaped prompts -- itself a finding worth a follow-up.

## Status of the other stages

- **(c) no_skill baseline (p2/p5/p6, k=3): DONE.** See the with/without comparison above.
- **(b) apply + typecheck + real tests: DONE (p1-p4, k=3).** See the addendum above. Ran 2-parallel on
  throwaway branches; auto-trigger split by target size (p1/p2 3/3, p3/p4 0/6); skill-driven apply keeps
  tests green; the coach-vs-apply no-edit tension surfaced once (p2 run-3).
- **invoke_skill: DONE (nx p1-p4, k=3).** Forced activation 12/12; see addendum.
- **Trigger-gap follow-up**: why coach mode doesn't auto-trigger via `--plugin-dir` -- highest
  leverage for the skill, but scope beyond "test end-to-end".
