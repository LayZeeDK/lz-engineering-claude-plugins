# Phase 5: Skill Effectiveness Evals - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning
**Mode:** `--auto` (decisions auto-locked from prior context + requirements + the
skill-creator tool contract; `--analyze` trade-off tables live in DISCUSSION-LOG.md;
`--auto` auto-advances to plan-phase). Every gray area was rated IMPACT x CONFIDENCE
before auto-locking; none fell in the HIGH-impact + NOT-HIGH-confidence trap quadrant
(this is the LAST phase -- nothing downstream inherits -- and it is roadmap-declared
non-blocking).

<domain>
## Phase Boundary

Empirically validate and (only if needed) tune the ALREADY-SHIPPED `lz-tpp` skill. It
delivers two eval sets plus at most one tuning pass, and nothing more:

1. **Trigger eval (EVAL-01):** a skill-creator trigger-eval set (in-scope should-trigger
   prompts + near-miss should-not-trigger prompts) that confirms the `description` fires
   on red-green-refactor / TDD / "next transformation" / TPP contexts and stays quiet on
   near-misses (generic write-a-function, plain refactoring, TDD-adjacent-but-non-TPP).
2. **Behavior/effectiveness eval (EVAL-02):** a skill-creator test-case + benchmark set
   that confirms the coach recommends the CORRECT next transformation on sample
   failing-test scenarios, judged against the canonical 14-item list and the Phase-3
   coach decision procedure.
3. **At most one tuning pass (SC3):** eval findings feed AT MOST a description/behavior
   tuning pass on the shipped skill. It is NON-BLOCKING -- Phases 1-4 (the public ship)
   remain complete regardless of eval outcome.

This phase clarifies HOW to build, run, score, and (conditionally) act on the evals for
what already exists. It does NOT re-author skill content, add reference files, expand
scope, or add languages/examples (those are post-0.0.1, NEXT-01..04). It does NOT reopen
any earlier phase.

</domain>

<decisions>
## Implementation Decisions

### Trigger eval: harness + set design (EVAL-01)
- **D-01:** Use skill-creator's built-in **Description Optimization loop** as the trigger
  harness -- `python -m scripts.run_loop --eval-set <trigger-eval.json>
  --skill-path <lz-tpp-path> --model <session-model-id> --max-iterations 5 --verbose`
  (run from the installed skill-creator skill dir). The loop splits the set 60% train /
  40% held-out, runs each query 3x for a reliable trigger rate, proposes description
  improvements, and selects `best_description` by HELD-OUT test score (guards against
  overfitting). `run_eval.py` alone (one-shot, no auto-improve) is the fallback if a
  pure measurement without the improver is wanted, but the loop is preferred because it
  produces the EVAL-01 measurement AND the D-04 description tuning candidate in one run.
- **D-02:** Hand-author a ~20-query trigger eval set: **8-10 should-trigger** (varied
  phrasings -- formal and casual -- of: a failing test + code asking "what's the minimal
  change to pass", "which transformation next", "make the failing test pass", explicit
  TPP / transformation-priority mentions, and reference-mode asks like "what does
  `(constant -> scalar)` mean" / "why is `({} -> nil)` first") and **8-10 near-miss
  should-not-trigger** (genuinely tricky negatives, NOT obvious irrelevancies): generic
  "write a function", plain structure-only refactoring with no failing test, "write a
  test for this" / "mock this dependency" (TDD-adjacent but not transformation choice),
  "explain SOLID / clean code", "reduce the complexity of this function". Queries must be
  concrete and detailed (file paths, code snippets, casual speech, typos) per
  skill-creator guidance. Use the **session model id** (`claude-opus-4-8`) so the
  triggering test matches what users experience.

### Behavior eval: harness + correct-transformation rubric (EVAL-02)
- **D-03:** Use skill-creator's **test-case + benchmark harness** for behavior:
  `evals/evals.json` (prompts), with-skill vs baseline (no-skill) subagent runs, per-eval
  `assertions`, grading via `agents/grader.md` (`grading.json` fields `text` / `passed` /
  `evidence`), and `python -m scripts.aggregate_benchmark <workspace>/iteration-N
  --skill-name lz-tpp`. Each scenario = a failing (red) test + current code. Source
  scenarios PRIMARILY from the LOCKED worked examples so ground truth is already proven:
  the Fibonacci walk steps (`fibonacci-worked-example.md`), Kata 1 (sum 1..n, LINEAR) and
  Kata 2 (flatten a nested list, TREE) from `typescript-and-tco.md`, plus a small number
  of net-new scenarios INCLUDING the Word Wrap impasse (tests the backtrack heuristic).
- **D-04-RUBRIC:** Ground truth for "correct next transformation" = the named
  highest-priority (lowest-numbered) available transformation the **Phase-3 coach
  decision procedure** (03-CONTEXT.md D-04) should pick, per the canonical 14-item list
  in `transformations.md` (LOCKED), INCLUDING the TS/JS overlay (`(if -> while)` /
  `(variable -> assignment)` above the recursion transformations) where it changes the
  pick. Grade **deterministically first** (assert the recommendation NAMES the right
  transformation, e.g. `(constant -> scalar)`, and that the coach did NOT edit code or run
  tests -- "coach, don't drive"); use an LLM-judge/grader pass only for rationale quality
  where a string match is insufficient. Deterministic assertions are scripted (faster,
  reusable across iterations) per skill-creator guidance.

### Scoring, sampling, and reliability metrics
- **D-05:** Run each behavior scenario >= 3 times and each trigger query 3x (loop
  default). Compute and report **Pass@k and Pass^k** (k = 1, 3, 5, and total run count)
  per eval and overall, per the project's skill-creator workflow rule in CLAUDE.md
  (Pass@k optimistic = at-least-1-of-k passes; Pass^k conservative = all-k pass). Flag
  saturated/non-discriminating assertions (Pass@1 = 1.0 for both configs). **Wait for ALL
  run-completion notifications before grading** -- `total_tokens` / `duration_ms` arrive
  only at completion and cannot be recovered later (save to `timing.json` as each
  arrives).
- **D-06 [tunable bar]:** Provisional pass bars (SOFT, non-blocking, planner may adjust
  with evidence): trigger held-out accuracy >= ~90% with near-misses staying quiet;
  behavior correct-transformation Pass@1 ~= 1.0 on the canonical deterministic-answer
  scenarios. Missing a bar triggers AT MOST the D-07 tuning pass -- it NEVER reopens
  Phases 1-4. If the skill already meets the bars, no tuning pass is applied and the evals
  stand as a validation record.

### Tuning pass: scope + non-blocking discipline (SC3)
- **D-07:** AT MOST ONE tuning pass, tightly bounded. Triggering: apply run_loop's
  `best_description` to `SKILL.md` frontmatter ONLY if it beats the current description on
  the HELD-OUT set (show before/after + scores). Behavior: a bounded wording tweak to the
  SKILL.md coach procedure / description ONLY if a scenario exposes a real coaching defect
  -- NO new reference files, NO re-authoring LOCKED content (`transformations.md` and the
  worked examples stay frozen), NO scope expansion. Single-pass discipline: do NOT run
  self-feeding re-eval loops beyond the tool's own `--max-iterations 5`; once the eval +
  optional tuning pass is done and committed, the phase is complete.

### Eval-artifact location + git hygiene
- **D-08:** Follow the established repo pattern (Phase-2 D-08 kept the NDC transcript in
  `.planning/`, not shipped `plugins/`; Phase-4 doc-review trimmed provenance off the
  shipped surface). Eval sets, the skill-creator workspace (iteration run dirs), and an
  EVAL results summary live UNDER `.planning/phases/05-skill-effectiveness-evals/`
  (git-tracked but PR-filtered out of the public shipped skill), NOT under
  `plugins/lz-tdd/skills/lz-tpp/`. Commit the eval sets (trigger-eval.json,
  evals/evals.json) + a concise EVAL results summary + benchmark.json/.md; keep bulky
  iteration transcripts / raw run outputs OUT of the shipped surface (scratchpad or
  gitignored). The shipped skill stays lean (progressive-disclosure hygiene). Any tuning
  pass (D-07) is the only change that touches `plugins/`.

### Claude's Discretion
- Exact eval-query wording and the exact scenario count within the D-02 / D-03 posture
  (>= the skill-creator minimums; edge-case-focused).
- Exact assertion text and which are scripted vs judged (D-04 posture: deterministic
  first).
- Exact workspace directory naming/layout under the phase dir, and whether behavior runs
  execute in parallel or series (series is fine if timeouts bite).
- Whether EVAL-01 and EVAL-02 are one plan or split into two (the roadmap sketches one
  plan, `05-01`).
- Whether to also run `run_eval.py` as a standalone pre/post measurement around any tuning.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & success criteria (PRIMARY)
- `.planning/REQUIREMENTS.md` -- EVAL-01, EVAL-02 (the two Phase-5 requirements), the
  "late / optional-final" framing, and the Out of Scope table (no auto-edit/auto-run of
  user code; no new features/languages in 0.0.1).
- `.planning/ROADMAP.md` Phase 5 -- goal ("empirically validate and tune triggering
  accuracy and coaching correctness -- late, optional, does not gate the ship") and the
  3 success criteria (SC1 trigger set, SC2 behavior eval, SC3 at-most-one tuning pass /
  non-blocking).

### Eval harness authority (the tool that runs the evals)
- Installed skill-creator skill:
  `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/skills/skill-creator/SKILL.md`
  -- the eval workflow. Two DISTINCT mechanisms this phase uses:
  - **Description Optimization** ("Description Optimization" section) drives EVAL-01 via
    `scripts/run_loop.py` (20-query set, 60/40 split, 3x runs, best_description by
    held-out test score). `scripts/run_eval.py` = one-shot fallback.
  - **Running and evaluating test cases** ("Running and evaluating test cases" section)
    drives EVAL-02 via `evals/evals.json`, with-skill vs baseline runs, assertions,
    `agents/grader.md`, and `scripts/aggregate_benchmark.py`; view with
    `eval-viewer/generate_review.py`.
  - Supporting files under that skill dir: `agents/grader.md` (assertion grading + exact
    grading.json field names), `references/schemas.md` (evals.json / grading.json /
    benchmark.json schemas), `agents/analyzer.md` (benchmark analysis).

### Skill under test + ground-truth sources (LOCKED -- do NOT modify except D-07 tuning)
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` -- the `description` (EVAL-01 target) and the
  7-step coach decision procedure + two-mode routing (EVAL-02 behavior ground truth).
- `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` -- the canonical 14-item
  transformation list; the authoritative ranking for "correct next transformation".
- `plugins/lz-tdd/skills/lz-tpp/references/fibonacci-worked-example.md` -- Fibonacci walk;
  primary source of behavior scenarios with proven expected transformations.
- `plugins/lz-tdd/skills/lz-tpp/references/typescript-and-tco.md` -- Kata 1 (sum 1..n),
  Kata 2 (flatten), the TS/JS TCO reality, and the `(if -> while)` / `(variable ->
  assignment)` overlay that shifts the correct pick by paradigm.

### Prior-phase decisions this phase inherits
- `.planning/phases/03-lz-tpp-skill-authoring/03-CONTEXT.md` -- D-04 (the coach decision
  procedure = behavior ground truth) and D-10 (a SCOPED `description` was authored in
  Phase 3; empirical trigger + behavior tuning was explicitly DEFERRED to this phase).
- `.planning/phases/04-distribution-hygiene/04-CONTEXT.md` -- D-06 (findings triage:
  any triggering-effectiveness / coaching-accuracy finding from skill-reviewer was
  recorded and DEFERRED here).
- `.planning/phases/02-tpp-source-distillation/02-CONTEXT.md` -- D-08 (the precedent that
  source/eval material is git-tracked under `.planning/`, not bundled in the shipped
  `plugins/` surface). Basis for D-08 above.

### Project constraints
- `CLAUDE.md` (project + global) -- the "skill-creator workflow" rules: MUST compute and
  report Pass@k / Pass^k per eval and overall (formulas + k values); MUST wait for all
  benchmark completion notifications before grading (timing data only available at
  completion); use the session model id for triggering evals; ASCII-only committed output
  (arrows `->`, straight quotes, no emojis/em-dashes); `git grep`/`rg` for search;
  npm default.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- The three LOCKED reference files (`transformations.md`, `fibonacci-worked-example.md`,
  `typescript-and-tco.md`) already contain proven, step-by-step expected transformations
  and two `tsc --strict`-clean katas -- lift scenarios + expected answers from them rather
  than inventing ground truth (low authoring risk, no re-derivation).
- skill-creator ships the ENTIRE eval harness (run_loop.py, run_eval.py,
  aggregate_benchmark.py, generate_review.py, grader/analyzer agents, schemas) -- this
  phase authors eval DATA (query sets, scenarios, assertions), not eval INFRASTRUCTURE.
- The current `SKILL.md` `description` (SKILL.md:3-12) is the concrete EVAL-01 target and
  the starting point any D-07 tuning improves on.

### Established Patterns
- Source/eval material lives under `.planning/` (git-tracked, PR-filtered); the shipped
  `plugins/` surface stays lean (Phase-2 D-08; Phase-4 provenance trim). D-08 above applies
  it to eval artifacts.
- ASCII-only committed content (`->`, straight quotes) -- repo convention across all phases.
- Pass@k / Pass^k reporting + wait-for-all-notifications are project-standard skill-creator
  execution discipline (CLAUDE.md).

### Integration Points
- Evals consume the shipped skill via its path (`plugins/lz-tdd/skills/lz-tpp/`) and its
  `description`; triggering is model-specific, so evals run on the session model
  (`claude-opus-4-8`).
- This is the OPTIONAL-FINAL, NON-BLOCKING phase; it runs after Phase 4 and no phase
  depends on its output. A tuning pass (D-07) is the only write-back into `plugins/`.

</code_context>

<specifics>
## Specific Ideas

- Trigger set near-misses must be genuinely tricky (share keywords/concepts but need
  something else): "write a test for this" (TDD but not transformation choice), "refactor
  this to be cleaner" (refactoring, not a red-test transformation), "explain SOLID". Avoid
  obvious irrelevancies -- they test nothing.
- Behavior scenarios anchor on named-transformation answers already proven in the LOCKED
  references, so assertions can string-match the transformation name (e.g. `({} -> nil)`,
  `(nil -> constant)`, `(constant -> scalar)`, `(statement -> tail-recursion)`,
  `(if -> while)` + `(variable -> assignment)` for the iterative/stack-safe unwind).
- Include a Word Wrap-style impasse scenario to test the backtrack heuristic (pose a
  simpler test / structure-only refactor before forcing a low-priority transformation).
- The single "if everything else fails, this must be correct" core is the
  transformation-priority guidance -- the behavior eval exists to protect exactly that.
- run_loop.py / run_eval.py spend tokens on the Claude plan via `claude -p` (NOT a
  separate metered pool), so no paid-consult confirmation gate is needed.

</specifics>

<deferred>
## Deferred Ideas

- **Additional worked examples / languages (full Word Wrap walk, Prime Factors, Python/Go/
  C#/Clojure ordering variants), a cheat-sheet reference** -> post-0.0.1 (NEXT-01, NEXT-04).
  Behavior scenarios may REFERENCE Word Wrap as an impasse test, but this phase does NOT
  author a new full worked-example reference file.
- **Empty `AGENTS.md` (0 bytes) imported by `CLAUDE.md` via `@AGENTS.md`** -- a hygiene
  defect flagged in Phase 4; out of EVAL-01/02 scope. A separate quick task if the user
  wants it fixed, not this phase.
- **Turning the eval sets into a permanent CI/regression gate** -> future; 0.0.1 Phase 5
  is a one-time validation + at-most-one tuning pass, not a standing CI harness.

### Reviewed Todos (not folded)
None -- `todo.match-phase 5` returned 0 matches.

</deferred>

---

*Phase: 5-Skill Effectiveness Evals*
*Context gathered: 2026-07-02*
