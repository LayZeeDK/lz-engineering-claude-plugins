# Phase 11: Skill-Effectiveness Evals - Context

**Gathered:** 2026-07-09
**Status:** Ready for planning
**Mode:** `--auto --analyze` (decisions auto-locked from the Phase-5 analog + REQUIREMENTS
+ the shipped skill's own ground truth; `--analyze` trade-off tables live in
DISCUSSION-LOG.md). Every gray area was rated IMPACT x CONFIDENCE before auto-locking.
The ONE trap-quadrant item (HIGH impact + not-high confidence) -- the EVAL-02
correctness rubric for lz-refactor's one-to-many smell->refactoring mapping -- was NOT
auto-decided; it was escalated to the user (a human is in the loop via the
pause-before-plan-phase directive) and locked interactively as D-04-RUBRIC below.
Auto-advance to plan-phase is SUPPRESSED per the user's "pause before gsd-plan-phase"
directive.

<domain>
## Phase Boundary

Empirically validate the ALREADY-SHIPPED `lz-refactor` skill and (only if needed) feed at
most one bounded tuning pass. It delivers two eval sets plus at most one tuning pass, and
nothing more:

1. **Trigger eval (EVL-01):** an in-scope-should-trigger + near-miss-should-not-trigger
   query set confirming the `description` fires on refactor-step / code-smell /
   refactoring-catalog / de-patterning contexts and stays quiet on near-misses -- most
   importantly the sibling `lz-tpp` green/transformation-step territory -- measured for
   recall + specificity on the native eval harness.
2. **Behavior/effectiveness eval (EVL-02):** a with-skill vs. baseline (no-skill) benchmark
   confirming the coach recommends the correct next NAMED refactoring across representative
   smell/scenario prompts spanning both layers (Fowler mechanical + Kerievsky
   pattern-directed routing), plus at least one de-patterning case.
3. **At most one tuning pass (SC3):** eval findings feed AT MOST a bounded
   description/coach-wording tuning pass on the shipped skill. NON-BLOCKING -- Phases 6-10
   (the public ship) remain complete regardless of eval outcome.

This phase clarifies HOW to build, run, score, and (conditionally) act on the evals for
what already exists. It does NOT re-author catalog content, add reference files, expand
scope, or add languages/examples, and it does NOT reopen any earlier phase. It runs AFTER
Phase 10 (verified complete 2026-07-09) and no phase depends on its output.

</domain>

<decisions>
## Implementation Decisions

### Eval harness (shared infrastructure, reused from Phase 5)
- **D-01:** Reuse the locally vendored, bug-fixed `skill-creator-eval` harness proven in
  Phase 5 -- the one that fixed the three upstream `run_eval.py` bugs (Windows
  `select.select()` on a pipe; detection quitting at the first message boundary; probing a
  non-auto-triggering `.claude/commands/` slash-command). It runs NATIVELY on Windows with
  the already-authenticated `claude` (no WSL, no interop, no separate auth). Vendor a copy
  under `.claude/skills/lz-refactor-workspace/tools/skill-creator-eval/` (mirroring
  `lz-tpp-workspace/tools/`), preserving its Apache-2.0 provenance + `run_eval`
  reimplementation note in the README. RUN CONFIG (the exact config that fixed Phase 5's
  false 8%-recall artifact): serial (`--num-workers 1`), Ponytail disabled
  (`PONYTAIL_DEFAULT_MODE=off`), MCP servers stripped from the probe, session model id
  `claude-opus-4-8` (match what users experience). This phase authors eval DATA, not eval
  INFRASTRUCTURE.

### Trigger eval: set design (EVL-01)
- **D-02:** Hand-author a ~20-query trigger eval set: **8-10 should-trigger** (varied
  formal/casual phrasings of: "tests are green, this method smells -- what refactoring",
  a named smell like Long Function / Duplicated Code / Feature Envy / Conditional
  Complexity, an explicit refactor-step ask, a catalog-lookup like "what does Extract
  Function / Replace Conditional with Polymorphism do", and a de-patterning ask like
  "should I remove this Singleton") and **8-10 near-miss should-not-trigger** (genuinely
  tricky negatives, NOT obvious irrelevancies). The near-misses MUST include the
  **`lz-tpp` seam**: green/transformation-step prompts ("which change makes this failing
  test pass", "what's the minimal transformation to go green") that belong to `lz-tpp`
  and must keep `lz-refactor` quiet; plus generic "write a function", "write a test for
  this", "explain SOLID / clean code", "fix this bug". Queries must be concrete and
  detailed (file paths, code snippets, casual speech, typos) per skill-creator guidance.
  The shipped `description` (SKILL.md:3-12), with its explicit "Do not use it for the
  green / transformation step of TDD (... is lz-tpp)" clause, is the ground truth for
  should-vs-should-not.

### Behavior eval: harness + scenario sourcing (EVL-02)
- **D-03:** Use the skill-creator test-case + benchmark posture proven in Phase 5:
  `evals/evals.json` (prompts), with-skill vs baseline (no-skill) subagent runs, per-eval
  `assertions`, grading, and a benchmark aggregate. Follow the Phase-5 EVAL-02
  orchestration mechanic: spawn eval subagents UNNAMED / fire-and-forget in an isolated
  scratch cwd per run (ground-truth "did the coach drive?"), capture timing from the
  completion notification, then grade -> independent judge -> merge-judge -> verify ->
  aggregate. Each scenario = tests-green code carrying a recognizable smell (no failing
  test -- a failing test would be the `lz-tpp` green step, out of scope).
- **D-04-RUBRIC [ESCALATED + LOCKED -- Hybrid]:** Ground truth for "correct next
  refactoring" is HYBRID, adapted to lz-refactor's one-to-many smell->refactoring mapping
  (unlike lz-tpp's single-answer priority order). A recommendation PASSES when it is
  (1) a refactoring in the detected smell's **candidate set** per the shipped
  `references/smells.md` (+ the matching smell leaf) AND (2) from the **correct layer**
  (Fowler mechanical vs. Kerievsky pattern-directed vs. functional de-patterning) per the
  coach's own routing contract (CCH-01/CCH-02). Where a scenario's details pin a single
  best-fit (scenarios sourced from a specific catalog leaf's example), assert that specific
  refactoring name. Grade **name + layer deterministically** (scripted string/set match,
  reusable across iterations) and also assert the coach did NOT edit code or run tests
  ("Coach, don't drive" -- SKILL.md); use an LLM-judge/grader pass ONLY for rationale
  quality where a set match is insufficient. Rejected alternatives (see DISCUSSION-LOG.md):
  strict-single-best-fit (contestable adjudication of one "best" answer for multi-candidate
  smells; penalizes correct-but-alternative picks) and lenient-routing-only (weak signal;
  misses a plausible-but-suboptimal in-layer name).
- **D-05:** Source EVL-02 scenarios PRIMARILY from the shipped catalog leaves' `Use when:`
  selectors + before/after examples so ground truth is already proven (low authoring risk,
  no re-derivation). Cover a representative spread across BOTH layers: several Fowler
  mechanical (e.g. Long Function -> Extract Function; Long Parameter List -> Introduce
  Parameter Object; Duplicated Code across siblings -> Pull Up Method), several Kerievsky
  pattern-directed (e.g. Conditional Complexity -> Replace Conditional Logic with
  Strategy / Replace Conditional with Polymorphism; Combinatorial Explosion -> Interpreter;
  repeated switches / state-altering conditionals -> Replace State-Altering Conditionals
  with State), at least one **de-patterning** case (an unwarranted Singleton -> Inline
  Singleton or the functional-catalog dissolution), and at least one **routing-boundary**
  case that distinguishes mechanical-Fowler from pattern-directed-Kerievsky. Optionally
  include a no-tests scenario that should route to the Feathers reference first.

### Scoring, sampling, and reliability metrics
- **D-06:** Run each behavior scenario and each trigger query >= 3x. Compute and report
  **Pass@k and Pass^k** (k = 1, 3, 5, and total run count) per eval and overall, per the
  CLAUDE.md skill-creator workflow rule (Pass@k optimistic = at-least-1-of-k passes;
  Pass^k conservative = all-k pass). Flag saturated / non-discriminating assertions
  (Pass@1 = 1.0 for both configs) as replacement candidates. **Wait for ALL run-completion
  notifications before grading** -- `total_tokens` / `duration_ms` arrive only at
  completion and cannot be recovered later (persist as each arrives). Include >= 1 review
  agent with a neutral from-scratch brief (unbiased-beats-primed) so grader/rubric bugs
  are caught, not confirmed.

### Pass bars (SOFT, tunable, non-blocking)
- **D-07:** Provisional bars (planner may adjust with evidence): trigger recall +
  specificity high (~90%+, near-misses staying quiet, esp. the `lz-tpp` seam);
  behavior with-skill correct-routing Pass@1 high AND clearly beating baseline. Missing a
  bar triggers AT MOST the D-08 tuning pass -- it NEVER reopens Phases 6-10. If the skill
  already meets the bars, no tuning pass is applied and the evals stand as a validation
  record (the Phase-5 outcome: no tuning needed).

### Tuning pass: scope + non-blocking discipline (SC3)
- **D-08:** AT MOST ONE tuning pass, tightly bounded, and ONLY if evidence warrants.
  Description: apply a widened/tuned `description` to `SKILL.md` frontmatter ONLY if it
  beats the current one on the held-out trigger set (show before/after + scores).
  Behavior: a bounded wording tweak to the SKILL.md coach decision procedure / description
  ONLY if a scenario exposes a real routing defect -- NO new reference files, NO
  re-authoring LOCKED catalog content (all catalogs + smells.md + principles stay frozen),
  NO scope expansion. Single-pass discipline: do NOT run self-feeding re-eval loops beyond
  the tool's own bounded iterations; once the eval + optional tuning pass is committed, the
  phase is complete.

### Eval-artifact location + git hygiene
- **D-09:** Everything lives under `.claude/skills/lz-refactor-workspace/` (the
  skill-creator workspace convention, alongside the existing catalog checkers) -- eval sets
  (`evals/trigger-eval.json`, `evals/evals.json`), the vendored harness
  (`tools/skill-creator-eval/`), iteration run dirs, orchestration scripts, and an
  `EVAL-RESULTS.md` summary. The generic root-`.gitignore` rules for
  `.claude/skills/*-workspace/` already track the eval record (sets, benchmark, results,
  tools) and drop bulky raw outputs / transcripts / caches -- reused as-is (no per-skill
  gitignore edits). Explicitly NOT under `plugins/lz-tdd/skills/lz-refactor/` (that ships
  with the plugin) and NOT under `.planning/`. A D-08 tuning pass is the ONLY change that
  writes back into `plugins/`.

### Execution gate (build in-plan; halt before the run)
- **D-10 [HARD GATE]:** The plan builds ALL eval assets (sets, scenarios, assertions,
  vendored harness, orchestration scripts) but MUST HALT before actually RUNNING the evals
  or any description-optimization loop -- the run spends tokens via `claude -p` and is a
  user-gated action. Present the ready-to-run command(s) and wait for explicit user
  approval before execution. (Token spend is on the Claude plan, NOT a separate metered
  pool, so no paid-consult confirmation is needed -- but the run itself is still gated per
  the standing eval-run approval rule.)

### Claude's Discretion
- Exact eval-query wording and the exact scenario count within the D-02 / D-05 posture
  (>= skill-creator minimums; edge-case-focused).
- Exact assertion text and which are scripted vs judged (D-04-RUBRIC posture: deterministic
  name+layer first, judge only for rationale).
- Exact workspace directory naming/layout under `lz-refactor-workspace/`, and whether
  behavior runs execute in parallel or series (series is fine if timeouts bite).
- Whether EVL-01 and EVL-02 are one plan or split into two.
- Whether to run a standalone measurement around any tuning, and how many net-new scenarios
  to add beyond the leaf-sourced ones.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & success criteria (PRIMARY)
- `.planning/REQUIREMENTS.md` -- EVL-01, EVL-02 (the two Phase-11 requirements), the
  "late / non-blocking" framing, and the Out of Scope table.
- `.planning/ROADMAP.md` Phase 11 -- goal ("empirically validate the lz-refactor skill's
  triggering accuracy and coach routing correctness ... late, non-blocking") and the 3
  success criteria (SC1 trigger recall/specificity, SC2 behavior with-skill vs baseline
  across both layers, SC3 at-most-one bounded tuning pass / non-blocking).

### The Phase-5 analog (the proven template for THIS phase)
- `.planning/phases/05-skill-effectiveness-evals/05-CONTEXT.md` -- D-01..D-09; the harness
  choice, set-design posture, deterministic-first rubric, Pass@k/Pass^k discipline, tuning
  discipline, and the D-09 native-harness + workspace-location pivot this phase inherits
  wholesale.
- `.claude/skills/lz-tpp-workspace/` -- the WORKING Phase-5 rig to mirror: vendored
  `tools/skill-creator-eval/` (native-fixed run_eval), `evals/trigger-eval.json` +
  `evals/evals.json`, the orchestration scripts (`eval-status.mjs`, `grade-run.mjs`,
  `merge-judge.mjs`, `run-spec-chunks.mjs`), `iteration-1/` grader outputs, and
  `EVAL-RESULTS.md` (the results-summary format + the num-workers/Ponytail/MCP run-config
  correction note).

### Skill under test + ground-truth sources (LOCKED -- do NOT modify except a D-08 tuning)
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` -- the `description` (EVL-01 target, incl.
  the explicit lz-tpp-seam "Do not use" clause) and the 6-step coach decision procedure +
  two-mode routing (EVL-02 behavior ground truth; CCH-01..06).
- `plugins/lz-tdd/skills/lz-refactor/references/smells.md` -- the unified smell taxonomy /
  coach trigger table; each smell's candidate refactorings = the EVL-02 D-04-RUBRIC
  candidate sets. Open the per-smell leaf for the actual candidate list.
- `plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/README.md` (+ leaves) --
  62 Fowler mechanical refactorings; `Use when:` selectors + examples = proven EVL-02
  scenario sources for the mechanical layer.
- `plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/README.md` (+ leaves) --
  27 pattern-directed refactorings + the To/Towards/Away directions; scenario sources for
  the pattern-directed layer + the de-patterning (Away) cases.
- `plugins/lz-tdd/skills/lz-refactor/references/functional-catalog/README.md` -- the
  de-patterning idiom map (the FP dissolution alternative for the D-05 de-patterning case).
- `plugins/lz-tdd/skills/lz-refactor/references/principles.md` +
  `references/refactoring-without-tests.md` -- backing for rationale-quality judging and
  the optional no-tests routing scenario.

### Prior-phase decisions this phase inherits
- `.planning/phases/06-lz-refactor-skill-scaffold-progressive-disclosure/06-CONTEXT.md` --
  SKEL-03: the seam-aware `description` was authored with empirical trigger tuning
  explicitly DEFERRED to Phase 11 (this phase).
- `.planning/phases/09-coach-behavior-principle-backing/09-CONTEXT.md` -- the coach
  decision procedure (CCH-01..06) = the EVL-02 behavior ground truth; the smell->layer
  routing rules the D-04-RUBRIC grades against.

### Project constraints
- `CLAUDE.md` (project + global) -- the "skill-creator workflow" rules: MUST compute and
  report Pass@k / Pass^k per eval and overall (formulas + k values); MUST wait for all
  benchmark completion notifications before grading; use the session model id for trigger
  evals; include >= 1 unbiased-from-scratch reviewer; NEVER run skill evals / optimization
  loops (claude -p spend) without explicit user approval (prep is fine, HALT before
  execute -- D-10); ASCII-only committed output (`->`, straight quotes, no emojis/em-dashes);
  `git grep`/`rg` for search; npm default.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.claude/skills/lz-tpp-workspace/tools/skill-creator-eval/` -- the vendored native-fixed
  harness; copy it into `lz-refactor-workspace/tools/` rather than re-fixing the upstream
  bugs. The orchestration `.mjs` scripts in `lz-tpp-workspace/` are direct templates for the
  lz-refactor eval run (grade/merge-judge/status/spec-chunks flow).
- The shipped `references/` catalogs + `smells.md` already contain proven, verified
  smell->refactoring mappings and `Use when:` selectors + `tsc --strict`-clean examples --
  lift EVL-02 scenarios and their candidate-set ground truth from them rather than inventing.
- `.claude/skills/lz-refactor-workspace/` already exists (the Phase 7-9 catalog checker
  harness + `package.json` + `tsconfig.json`); the eval assets are additive under the same
  workspace root.
- `EVAL-RESULTS.md` from Phase 5 is the format template for the Phase-11 results summary,
  including the correct run-config caveat (serial / Ponytail-off / MCP-stripped).

### Established Patterns
- Eval material lives under `.claude/skills/*-workspace/` (git-tracked record, bulky raw
  outputs gitignored, PR-filtered off the shipped surface); the shipped `plugins/` surface
  stays lean (progressive-disclosure hygiene). D-09 applies it here.
- ASCII-only committed content (`->`, straight quotes) -- repo convention across all phases.
- Pass@k / Pass^k reporting + wait-for-all-notifications + unbiased reviewer =
  project-standard skill-creator execution discipline (CLAUDE.md).

### Integration Points
- Evals consume the shipped skill via its path (`plugins/lz-tdd/skills/lz-refactor/`) and
  its `description`; triggering is model-specific, so evals run on the session model
  (`claude-opus-4-8`).
- This is the LAST, NON-BLOCKING phase of milestone lz-tdd@0.0.2; it runs after Phase 10
  (verified complete 2026-07-09) and no phase depends on its output. A D-08 tuning pass is
  the only write-back into `plugins/`.
- The `lz-tpp` <-> `lz-refactor` seam is now a LIVE concern (both skills ship in the same
  plugin): the trigger eval must prove `lz-refactor` stays quiet on `lz-tpp` green-step
  prompts. This is the main lz-refactor-specific delta from Phase 5.

</code_context>

<specifics>
## Specific Ideas

- Trigger near-misses must be genuinely tricky (share keywords/concepts but need something
  else): the `lz-tpp` green-step prompts ("which transformation makes this failing test
  pass") are the highest-value negatives -- they share the TDD frame and must NOT fire
  lz-refactor. Also "write a test for this" (TDD but not a refactoring), "refactor this to
  be faster" (behavior-changing, not structure-only), "explain SOLID". Avoid obvious
  irrelevancies -- they test nothing.
- EVL-02 scenarios anchor on named-refactoring answers already proven in the shipped leaves,
  so assertions can set-match the candidate refactoring name(s) + assert the correct layer
  (Fowler / Kerievsky / functional) per D-04-RUBRIC.
- Include a de-patterning scenario (an unwarranted Singleton, or a pattern that dissolves to
  an FP idiom) to test CCH-02/CCH-06 routing to the Kerievsky Away direction or the
  functional-catalog.
- Include a routing-boundary scenario that a purely mechanical reading would send to Fowler
  but the repeated/complex structure sends to Kerievsky -- the discriminating test for
  CCH-01 layer routing.
- The single "if everything else fails, this must be correct" core here is the
  smell->named-refactoring routing correctness -- EVL-02 exists to protect exactly that.
- run_eval / the description-optimization loop spend tokens on the Claude plan via
  `claude -p` (NOT a separate metered pool), so no paid-consult confirmation gate is needed
  -- but the RUN itself is still user-gated (D-10).

</specifics>

<deferred>
## Deferred Ideas

- **Turning the eval sets into a permanent CI/regression gate** -> future; Phase 11 is a
  one-time validation + at-most-one tuning pass, not a standing CI harness (same posture as
  Phase 5).
- **Expanding coverage to every one of the 62 Fowler / 27 Kerievsky / 23 GoF / 19
  functional leaves** -> out of scope; EVL-02 is a REPRESENTATIVE spread across both layers,
  not exhaustive per-leaf coverage. Exhaustive per-leaf correctness is already gated by the
  catalog checkers + oracle-reviewer sweeps from Phases 7-8.2/10, not by these evals.
- **A second/iterative tuning pass or re-authoring catalog content on eval findings** ->
  disallowed by SC3 / D-08 (at most one bounded pass; LOCKED content stays frozen). A larger
  content change would be its own future phase/milestone.
- **Multi-language example sets / additional skills** -> post-0.0.2 (FUT-01..04), unchanged.

### Reviewed Todos (not folded)
None -- `todo.match-phase 11` returned 0 matches.

</deferred>

---

*Phase: 11-Skill-Effectiveness Evals*
*Context gathered: 2026-07-09*
