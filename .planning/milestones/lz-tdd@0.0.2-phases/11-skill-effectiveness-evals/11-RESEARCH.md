# Phase 11: Skill-Effectiveness Evals - Research

**Researched:** 2026-07-10
**Domain:** Skill-effectiveness evaluation (trigger recall/specificity + behavior routing) via the vendored native skill-creator eval harness; a build-only, near-exact analog of the completed Phase 5.
**Confidence:** HIGH (this is an internal reuse-mapping problem; the proven Phase-5 rig is on disk and the ground-truth sources are the LOCKED shipped catalogs)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01 (harness):** Reuse the locally vendored, bug-fixed `skill-creator-eval` harness proven in Phase 5 (the one that fixed the three upstream `run_eval.py` bugs: Windows `select.select()` on a pipe; detection quitting at the first message boundary; probing a non-auto-triggering `.claude/commands/` slash-command). Runs NATIVELY on Windows with the already-authenticated `claude` (no WSL). Vendor a copy under `.claude/skills/lz-refactor-workspace/tools/skill-creator-eval/`, preserving Apache-2.0 provenance + the `run_eval` reimplementation note in the README. RUN CONFIG (the config that fixed Phase 5's false 8%-recall artifact): serial (`--num-workers 1`), Ponytail disabled (`PONYTAIL_DEFAULT_MODE=off`), MCP servers stripped, session model id `claude-opus-4-8`. This phase authors eval DATA, not eval INFRASTRUCTURE.
- **D-02 (trigger set):** Hand-author a ~20-query trigger eval set: 8-10 should-trigger + 8-10 near-miss should-not-trigger. Near-misses MUST include the `lz-tpp` seam (green/transformation-step prompts) plus generic "write a function", "write a test", "explain SOLID/clean code", "fix this bug". Queries concrete/detailed. The shipped `description` (SKILL.md:3-12), incl. the "Do not use it for the green / transformation step of TDD (... is lz-tpp)" clause, is the ground truth.
- **D-03 (behavior harness):** skill-creator test-case + benchmark posture: `evals/evals.json` (prompts), with-skill vs baseline (no-skill) subagent runs, per-eval `assertions`, grading, benchmark aggregate. Follow the Phase-5 EVAL-02 orchestration mechanic: spawn eval subagents UNNAMED / fire-and-forget in an isolated scratch cwd per run, capture timing from the completion notification, then grade -> independent judge -> merge-judge -> verify -> aggregate. Each scenario = tests-green code carrying a recognizable smell (NO failing test).
- **D-04-RUBRIC [ESCALATED + LOCKED - Hybrid]:** Ground truth for "correct next refactoring" is HYBRID. A recommendation PASSES when it is (1) a refactoring in the detected smell's candidate set per `references/smells.md` (+ the matching smell leaf) AND (2) from the correct layer (Fowler mechanical vs Kerievsky pattern-directed vs functional de-patterning) per CCH-01/CCH-02. Where a scenario's details pin a single best-fit (sourced from a specific catalog leaf's example), assert that specific refactoring name. Grade name + layer deterministically (scripted string/set match, reusable across iterations) and assert the coach did NOT edit code or run tests ("Coach, don't drive"); use an LLM-judge pass ONLY for rationale quality. Rejected: strict-single-best-fit and lenient-routing-only.
- **D-05 (scenario sourcing):** Source EVL-02 scenarios PRIMARILY from the shipped catalog leaves' `Use when:` selectors + before/after examples. Cover a representative spread across BOTH layers: several Fowler mechanical, several Kerievsky pattern-directed, >= 1 de-patterning case, and >= 1 routing-boundary case that distinguishes mechanical-Fowler from pattern-directed-Kerievsky. Optionally a no-tests scenario that routes to the Feathers reference first.
- **D-06 (sampling/metrics):** Run each behavior scenario and each trigger query >= 3x. Compute and report Pass@k and Pass^k (k = 1, 3, 5, and total run count) per eval and overall. Flag saturated assertions (Pass@1 = 1.0 for both configs). WAIT for ALL run-completion notifications before grading (persist timing as each arrives). Include >= 1 review agent with a neutral from-scratch brief.
- **D-07 (pass bars, SOFT/tunable/non-blocking):** trigger recall + specificity ~90%+ (near-misses stay quiet, esp. the `lz-tpp` seam); behavior with-skill correct-routing Pass@1 high AND clearly beating baseline. Missing a bar triggers AT MOST the D-08 tuning pass; NEVER reopens Phases 6-10.
- **D-08 (tuning, at most one, non-blocking):** Description: apply a tuned `description` to SKILL.md frontmatter ONLY if it beats the current one on a held-out trigger set (show before/after + scores). Behavior: a bounded wording tweak to the SKILL.md coach procedure/description ONLY if a scenario exposes a real routing defect. NO new reference files, NO re-authoring LOCKED catalog content, NO scope expansion. Do NOT run self-feeding re-eval loops beyond the tool's bounded iterations.
- **D-09 (location + git hygiene):** Everything lives under `.claude/skills/lz-refactor-workspace/` (alongside the existing catalog checkers) - eval sets, vendored harness, iteration run dirs, orchestration scripts, `EVAL-RESULTS.md`. The generic root-`.gitignore` `.claude/skills/*-workspace/` rules already track the eval record and drop bulky raw outputs - reused as-is (no per-skill gitignore edits). Explicitly NOT under `plugins/lz-tdd/skills/lz-refactor/` and NOT under `.planning/`. A D-08 tuning pass is the ONLY write-back into `plugins/`.
- **D-10 [HARD GATE]:** The plan builds ALL eval assets but MUST HALT before actually RUNNING the evals or any description-optimization loop (the run spends tokens via `claude -p`, user-gated). Present the ready-to-run command(s) and wait for explicit user approval. (Token spend is on the Claude plan, not a metered pool - no paid-consult confirmation needed - but the RUN is still gated per the standing eval-run approval rule.)

### Claude's Discretion
- Exact eval-query wording and exact scenario count within the D-02 / D-05 posture (>= skill-creator minimums; edge-case-focused).
- Exact assertion text and which are scripted vs judged (D-04-RUBRIC posture: deterministic name+layer first, judge only for rationale).
- Exact workspace directory naming/layout under `lz-refactor-workspace/`, and whether behavior runs execute in parallel or series (series is fine if timeouts bite).
- Whether EVL-01 and EVL-02 are one plan or split into two.
- Whether to run a standalone measurement around any tuning, and how many net-new scenarios to add beyond the leaf-sourced ones.

### Deferred Ideas (OUT OF SCOPE)
- Turning the eval sets into a permanent CI/regression gate -> future.
- Expanding coverage to every one of the 62 Fowler / 27 Kerievsky / 23 GoF / 19 functional leaves -> out of scope; EVL-02 is a REPRESENTATIVE spread, not exhaustive per-leaf coverage.
- A second/iterative tuning pass or re-authoring catalog content on eval findings -> disallowed by SC3 / D-08.
- Multi-language example sets / additional skills -> post-0.0.2 (FUT-01..04).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EVL-01 | Trigger eval - the `description` fires on in-scope refactoring / refactor-step / smell prompts and stays quiet on near-misses (recall + specificity), run on the native eval harness. | Reuse vendored `tools/skill-creator-eval/` (native-fixed `run_eval.py`) verbatim + `evals/trigger-eval.json` with new lz-refactor queries (see "EVL-01 query candidates"). Output schema + pass rule documented below. Serial/Ponytail-off/MCP-stripped run config confirmed against harness README. |
| EVL-02 | Behavior eval - the coach recommends the correct next refactoring for representative smell/scenario prompts across both layers (Fowler mechanical + Kerievsky pattern-directed), measured with-skill vs baseline. | Reuse `evals/evals.json` schema + the grade -> judge -> merge -> verify -> aggregate chain. New scenarios sourced from shipped smell leaves (see "EVL-02 scenario candidates"). D-04-RUBRIC name+layer set-match grading design documented below. |
</phase_requirements>

## Summary

Phase 11 is a build-only, non-blocking validation phase that is a near-exact analog of the completed Phase 5 (which evaluated the sibling `lz-tpp` skill). The proven rig lives at `.claude/skills/lz-tpp-workspace/` and is on disk in full: a vendored native-fixed trigger harness (`tools/skill-creator-eval/`), two eval-data files (`evals/trigger-eval.json`, `evals/evals.json`), four deterministic orchestration scripts (`eval-status.mjs`, `grade-run.mjs`, `merge-judge.mjs`, `run-spec-chunks.mjs`), a completed `iteration-1/` run tree, and an `EVAL-RESULTS.md`. Because CONTEXT.md has already locked every strategic decision (D-01..D-10), the planner's job is purely mechanical: copy the reusable pieces, rewrite the one skill-specific piece (the `grade-run.mjs` rubric + refactoring-name/layer matcher), author two new eval-data files grounded in the shipped catalog leaves, and HALT before running anything (D-10).

The single lz-refactor-specific delta from Phase 5 is the LIVE `lz-tpp` <-> `lz-refactor` seam: both skills now ship in the same plugin, so the trigger eval's highest-value negatives are green-step ("which change makes this failing test pass") prompts that lz-refactor MUST stay quiet on. The shipped `description` already draws that boundary explicitly ("Do not use it for the green / transformation step of TDD ... is lz-tpp"), so the trigger set just needs to stress it. The grading rubric adaptation is the only genuine authoring work: lz-tpp graded a single-answer transformation name in `(a -> b)` format, whereas lz-refactor grades a one-to-many smell->refactoring mapping as a candidate-set match PLUS a layer match (Fowler / Kerievsky / functional) per the D-04-RUBRIC hybrid.

**Primary recommendation:** Copy `tools/`, `eval-status.mjs`, and `merge-judge.mjs` verbatim; light-edit `run-spec-chunks.mjs` (3 path constants + canary query); rewrite `grade-run.mjs`'s RUBRICS + name-matcher into a `{candidateSet, bestFit?, layer, judge[], nodrive}` model with a name->layer lookup derived from the catalog READMEs; author `trigger-eval.json` (from the EVL-01 candidate set below) and `evals.json` (from the EVL-02 scenario table below); scaffold `EVAL-RESULTS.md` as a numbers-empty template. End the phase with a "ready-to-run commands + HALT for approval" task.

## Architectural Responsibility Map

The "tiers" here are the eval-pipeline stages, not web tiers. Mapping each capability to its owning stage prevents the planner from misassigning, e.g., trigger measurement to the behavior chain or grading logic to the harness.

| Capability | Primary Stage | Secondary Stage | Rationale |
|------------|--------------|-----------------|-----------|
| Trigger recall/specificity measurement (EVL-01) | Vendored `tools/skill-creator-eval` (`run_eval.py`) | `run-spec-chunks.mjs` (canary-gated specificity, optional) | The native-fixed probe is the ONLY component that measures triggering; it is skill-agnostic and reused verbatim. |
| Behavior scenario execution (EVL-02) | Main-session subagent orchestration (Task spawns, RUN-time) | isolated scratch cwd per run | "Did the coach drive?" is ground-truthed by running each scenario in a throwaway dir; this is orchestration, not a script. |
| Deterministic grading (name + layer + nodrive) | `grade-run.mjs` (rewritten rubric) | `metrics.json` (tool_calls) | Objective checks belong in a scripted, reusable pre-filter; this is the one file needing real per-skill authoring. |
| Nuanced grading (rationale quality) | skill-creator `agents/grader.md` (LLM judge, RUN-time) | `judge-verdicts.json` | Only rationale/"does-not-recommend" nuance is delegated to the judge; everything checkable is scripted. |
| Judge merge + aggregate gate | `merge-judge.mjs` (verbatim) | - | Fail-closed merge of judge verdicts + a pre-aggregate completeness gate; fully generic, reused verbatim. |
| Benchmark aggregate + report | installed skill-creator `aggregate_benchmark.py` + `eval-viewer/generate_review.py` (RUN-time) | `benchmark.json`/`.md` | The aggregate/report tooling is external (installed skill-creator), NOT vendored; grading.json shape is authored to match it. |
| Resume/status bookkeeping | `eval-status.mjs` (verbatim) | - | Generic run-tree walker; reused verbatim. |
| Results record | `EVAL-RESULTS.md` (template built in-phase, numbers filled RUN-time) | - | Build-phase produces the skeleton; numbers come only after the gated run. |

## Rig Inventory + Reuse Map

Source rig: `.claude/skills/lz-tpp-workspace/` (Phase 5, working). Target: `.claude/skills/lz-refactor-workspace/` (already exists with the Phase 7-9 catalog-checker harness + `package.json` + `tsconfig.json`; eval assets are ADDITIVE - build alongside, do not overwrite).

> IMPORTANT (landmine): `*-workspace/` is a gitignored path prefix for RAW outputs but the eval RECORD is tracked. `git grep` returns ZERO matches inside these dirs regardless - use `rg` or Read/Glob. Confirmed: `git ls-files .claude/skills/lz-tpp-workspace/` lists 340 tracked files (eval sets, eval_metadata.json, benchmark.json/.md, grading.json, timing.json, metrics.json, judge-verdicts.json, EVAL-RESULTS.md, the vendored `tools/` harness), while `outputs/`, `*.stream.jsonl`, `run_loop_stdout.json`, `trigger-workspace/`, `__pycache__/`, `*.pyc`, and `samples/` are ignored (`.gitignore:21-33`).

| Source path (lz-tpp-workspace) | Purpose | Disposition for lz-refactor |
|--------------------------------|---------|-----------------------------|
| `tools/skill-creator-eval/scripts/{__init__.py, utils.py}` | Upstream skill-creator helpers (Apache-2.0), unchanged. | COPY VERBATIM. Skill-agnostic. |
| `tools/skill-creator-eval/scripts/run_eval.py` | Native-fixed trigger probe (`run_single_query` reimplemented for the 3 bugs; whole-turn detection; ephemeral `.claude/skills/<id>/SKILL.md` + shared-prefix match). | COPY VERBATIM. The fix is skill-agnostic; do NOT re-fix upstream. |
| `tools/skill-creator-eval/LICENSE.upstream.txt` | Apache-2.0 provenance. | COPY VERBATIM. |
| `tools/skill-creator-eval/README.md` | Provenance + `run_eval` reimplementation note + usage. | COPY, then EDIT the example paths (`lz-tpp` -> `lz-refactor`) and the "not an enabled project skill" pitfall note (now applies to BOTH sibling skills). |
| `eval-status.mjs` | Resume/status map for behavior runs (walks `eval-*/<config>/run-*`, reports MISSING/PARTIAL/DONE). | COPY VERBATIM. Fully generic - takes iteration-dir + `--evals` + `--runs`. |
| `merge-judge.mjs` | Fail-closed LLM-judge merge + pre-aggregate completeness gate (`--merge`, `--verify`, `--selfcheck`). | COPY VERBATIM. Fully generic (uses placeholder "Q1 nuance" texts in selfcheck; no skill content). |
| `run-spec-chunks.mjs` | Resumable, canary-gated specificity runner (splits negatives into chunks, appends a positive canary, validates the window). | LIGHT EDIT. Change 3 hardcoded constants (`WS`, `SKILL`, `CHUNK_DIR` implicitly via `WS`) + the `CANARY` query (use an lz-refactor should-trigger query, e.g. the Extract Function lookup). Logic reused verbatim. OPTIONAL (a throttle workaround; not required if the direct `run_eval` pass is clean). |
| `grade-run.mjs` | Deterministic pre-filter grader (RUBRICS keyed by eval-id; transform-name regex; nodrive; fail-closed preliminary/judge scaffolding; `--selfcheck` incl. RUBRICS<->evals.json alignment). | HEAVY REWRITE of the skill-specific parts; REUSE the skeleton. Keep verbatim: `toolDrive`/`nodrive` logic, the preliminary/judge_required scaffolding, `finalOutPath`, `parseArgs`, `main`, and the selfcheck STRUCTURE (incl. the RUBRICS<->evals.json count-alignment check). Replace: the `transformRe` matcher (lz-tpp's `(a -> b)` format) with a refactoring-NAME matcher + a LAYER check; the `RUBRICS` object with lz-refactor's `{candidateSet, bestFit?, layer, judge[], nodrive}` model. |
| `evals/trigger-eval.json` | EVL-01 query set (array of `{query, should_trigger}`). | REPLACE CONTENT with lz-refactor queries (schema identical). |
| `evals/evals.json` | EVL-02 scenario set (`{skill_name, evals:[{id, prompt, expected_output, files, expectations}]}`). | REPLACE CONTENT with lz-refactor scenarios (schema identical). `skill_name: "lz-refactor"`. |
| `evals/d07-chunks/negatives.json` (+ generated chunk files) | Input to `run-spec-chunks.mjs` (the negatives to canary-gate). | OPTIONAL. Only if using the chunked specificity runner; author the negatives list here, let the runner generate the chunk files. |
| `evals/trigger-smoke.json` | A tiny smoke set for a fast harness sanity check. | OPTIONAL. Author a 2-3 query smoke set if desired. |
| `iteration-1/**` (eval dirs, run-*, transcripts, grading.json, timing.json, metrics.json, judge-verdicts.json, benchmark.json/.md, review.html) | The completed Phase-5 RUN artifacts. | DO NOT BUILD. Generated at RUN-time (gated). Study the shapes only. |
| `trigger-results*.json` | run_eval stdout captures. | DO NOT BUILD. Generated at RUN-time. |
| `EVAL-RESULTS.md` | Results summary + run-config caveat + harness-lessons. | COPY the STRUCTURE as a template; scaffold headings/columns; leave numbers empty (filled post-approval). |

### External (installed skill-creator, NOT vendored)

The behavior aggregate + report + the LLM judge live in the installed skill-creator, verified present at `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/skills/skill-creator/`:
- `scripts/aggregate_benchmark.py` - `python -m scripts.aggregate_benchmark <iteration-dir> --skill-name lz-refactor` (run from that scripts' parent) -> `benchmark.json` + `benchmark.md`.
- `agents/grader.md` - the LLM judge spawned per run to resolve `judge_required` items -> `judge-verdicts.json`.
- `eval-viewer/generate_review.py` - builds `review.html`.
- `scripts/run_loop.py` / `improve_description.py` - the OPTIONAL description-optimization loop (D-08 tuning candidate). GATED (RUN-time only). Only the trigger probe (`run_eval.py`) is vendored, because only IT carries the native fix; the rest are used from the install.

### JSON Schemas (field-by-field, for exact assertion shapes)

`evals/trigger-eval.json` (EVL-01 input):
```
[  { "query": string,          // the probe prompt (concrete: code snippets, casual speech, typos)
     "should_trigger": boolean } // true = in-scope; false = near-miss
]
```

`trigger-results.json` (EVL-01 output, run_eval stdout):
```
{ "skill_name": string,
  "description": string,        // the exact description text that was probed
  "results": [
    { "query": string,
      "should_trigger": boolean,
      "trigger_rate": number,   // 0.0..1.0 across runs
      "triggers": int,
      "runs": int,              // = --runs-per-query
      "pass": boolean } ]       // should_trigger ? trigger_rate>=0.5 : trigger_rate<0.5
}
```
Recall = quiet/fired accounting over `should_trigger:true` with `trigger_rate>=0.5`; specificity = `should_trigger:false` with `trigger_rate<0.5`. (Threshold 0.5 is the harness convention.)

`evals/evals.json` (EVL-02 input):
```
{ "skill_name": string,
  "evals": [
    { "id": int,                // 0-based, contiguous
      "prompt": string,         // tests-GREEN code carrying a smell (NO failing test)
      "expected_output": string,// human-readable summary of the correct answer
      "files": array,           // [] for these prompt-only scenarios
      "expectations": [string] }// 1:1 count-aligned with grade-run.mjs RUBRICS[id]
  ]
}
```

`eval_metadata.json` (per eval dir, generated at run setup): `{ eval_id:int, eval_name:string, prompt:string, assertions:[string] }`.

`grading.json` / `grading.preliminary.json`: `{ expectations:[{text:string, passed:bool|null, evidence:string}], summary:{passed:int, failed:int, total:int, pass_rate:number}, preliminary:bool, judge_required:[string] }`. grade-run.mjs writes `grading.preliminary.json` (never final) while any `judge_required` remains; merge-judge.mjs produces the final `grading.json`.

`judge-verdicts.json`: `[ { text:string (verbatim judge_required question), passed:bool, evidence:string } ]` (or `{ verdicts:[...] }`). merge-judge REFUSES unknown/duplicate/missing/non-boolean verdicts (fail-closed).

`metrics.json` (nodrive source): canonical `{ tool_calls:{ Edit:int, Write:int, MultiEdit:int, NotebookEdit:int, Bash:int } }` OR flat `{ edits:int, writes:int, testRuns:int }`. "Drove" = any > 0.

`timing.json`: `{ total_tokens:int, duration_ms:int, total_duration_seconds:number }`. Arrives ONLY at run completion (D-06: persist as each arrives).

`benchmark.md` (aggregate output): a summary table with rows Pass Rate / Time / Tokens and columns With Skill / Without Skill / Delta.

## EVL-01 Query Candidates (grounded in the shipped `description`)

The shipped `description` (SKILL.md:3-12) is the ground truth. Its in-scope surface: (a) refactor step of red-green-refactor with tests green + a smell; (b) recommend the next NAMED refactoring; (c) explain refactorings / smells / principles on demand; (d) named-refactoring lookup (Extract Function, Replace Conditional with Polymorphism); (e) de-patterning ("refactor away from a pattern"); (f) Fowler or Kerievsky catalog questions. Its explicit out-of-scope: the green/transformation step (lz-tpp), plain feature work, generic write-a-function/write-code.

The planner finalizes wording; this is a strong starting set (concrete, varied register, some with code/typos per skill-creator guidance).

### Should-trigger (10 candidates)

| # | Candidate query | In-scope facet |
|---|-----------------|----------------|
| T1 | "all tests pass, but this 60-line `processOrder()` does five things and i keep scrolling to follow it. whats the refactoring here?" | Long Function, refactor step (casual) |
| T2 | "green bar. i've got the same date-formatting block copy-pasted across three services - which named refactoring cleans up that duplication?" | Duplicated Code, refactor step |
| T3 | "tests green. `Invoice.describe()` only ever reads Customer's name/tier/address and barely touches Invoice. is there a named refactoring for that?" | Feature Envy |
| T4 | "i'm on the refactor step of red-green-refactor, tests are green. whats the right named move for a function taking 7 positional args?" | Long Parameter List (formal, explicit refactor step) |
| T5 | "green. this pricing class has a giant switch on customerType that also flips discount flags and sets the next state. feels like it wants a pattern - which refactoring?" | Conditional Complexity (Kerievsky) |
| T6 | "what does Extract Function actually do, and when should I reach for it over inlining?" | Fowler catalog lookup |
| T7 | "what does Replace Conditional with Polymorphism mean, and how is it different from just tidying a switch in place?" | catalog lookup / distinction |
| T8 | "i have a `Config` Singleton that everything reaches into globally and it's making my tests painful. should I refactor away from the Singleton?" | de-patterning (Away / functional) |
| T9 | "whats the 'rule of three' about when to actually refactor duplicated code?" | principle lookup |
| T10 | "tests pass. ~12 near-identical methods each handle one combination of {currency, taxRegion, rounding}; adding a currency means adding a dozen more. what refactoring?" | Combinatorial Explosion (Kerievsky) |

### Should-not-trigger (10 candidates) - genuinely tricky near-misses

| # | Candidate query | Why it must stay quiet |
|---|-----------------|------------------------|
| N1 | "red test `expect(of(2)).toBe(1)`, my `of` is `return n <= 1 ? n : 1;`. whats the smallest edit to get it passing? doing tdd" | **lz-tpp seam** (green step - shares the TDD frame). HIGHEST-VALUE negative. |
| N2 | "my failing test wants fib(3)=2 but the code returns 1 for anything above 1. whats the minimal transformation to green it without writing the whole recursion?" | **lz-tpp seam** (green step; uses "transformation" + "minimal"). |
| N3 | "which change makes this failing test pass - is there a smaller step than writing the full algorithm?" | **lz-tpp seam** (green step, generic phrasing). |
| N4 | "refactor this to be faster - it's O(n^2) and I need it under 50ms" | Uses the word "refactor" but asks for a behavior/performance change, NOT structure-only. |
| N5 | "write a jest test for this `formatCurrency(cents)` helper covering negatives and zero" | TDD-adjacent (write-a-test), not a refactoring/smell/catalog question. |
| N6 | "write a debounce helper in typescript" | Generic write-a-function / write-code. |
| N7 | "add pagination to the GET /users endpoint in this express app" | Plain feature work. |
| N8 | "explain the SOLID principles with a short typescript example for each" | Design-principle adjacent, but not a refactoring/smell/catalog/de-patterning question. |
| N9 | "my CSV parse step throws on empty rows and one test is failing - help me find the bug" | Debugging, not refactoring. |
| N10 | "whats the time and space complexity of this recursive merge sort?" | Analysis, not refactoring. |

Note on `lz-tpp` seam coverage: N1-N3 give three green-step negatives (D-02 + the specifics block require the seam to be the headline). Avoid a "rename variable X to Y" near-miss - Rename Variable IS a shipped Fowler refactoring, so it would be a legitimate trigger, not a clean negative.

## EVL-02 Scenario Candidates (each grounded in a shipped leaf; ground truth pre-proven)

Every candidate below is anchored in an actual shipped smell leaf whose `## Candidate refactorings` list is the D-04-RUBRIC candidate set, and (where the prompt pins one) a specific catalog leaf's example. All scenarios are tests-GREEN code carrying a smell (never a failing test). Layer is per CCH-01 routing. The planner finalizes prompt wording and count (10 shown; trim to >= 8 if preferred).

| id | Scenario (tests green + smell) | Smell leaf | Candidate set (from leaf) | Best-fit / expected | Layer |
|----|-------------------------------|-----------|---------------------------|---------------------|-------|
| 0 | A 60-line function that inlines several nameable blocks; asks the next refactoring. | long-function.md | Extract Function, Replace Temp with Query, Introduce Parameter Object, Preserve Whole Object, Replace Function with Command, Decompose Conditional, Split Loop, Replace Conditional with Polymorphism | Extract Function (leaf: "the workhorse move for length") | Fowler |
| 1 | A function with 7 args where a clump (street, city, zip) always travels together. | long-parameter-list.md | Replace Parameter with Query, Preserve Whole Object, Introduce Parameter Object, Remove Flag Argument, Combine Functions into Class | Introduce Parameter Object (clump travels together) | Fowler |
| 2 | Identical validation code duplicated in two sibling subclasses. | duplicated-code.md | Extract Function, Slide Statements, Pull Up Method | Pull Up Method (copies in sibling subclasses -> lift to parent) | Fowler |
| 3 | `Invoice.total()` computes almost entirely from `Customer`'s fields; barely touches Invoice. | feature-envy.md | Move Function, Extract Function | Move Function (whole function envies the other module) | Fowler |
| 4 | A conditional that selects among whole interchangeable pricing algorithms you want to vary independently. | conditional-complexity.md | Replace Conditional Logic with Strategy, Move Embellishment to Decorator, Replace State-Altering Conditionals with State, Introduce Null Object | Replace Conditional Logic with Strategy (chooses among whole algorithms) | Kerievsky |
| 5 | Conditionals that both decide what may happen now AND choose which state comes next. | conditional-complexity.md | (same set as id 4) | Replace State-Altering Conditionals with State (state-altering) | Kerievsky |
| 6 | ~12 near-identical methods each covering one combination of a small option set; adding an option multiplies methods. | combinatorial-explosion.md | Replace Implicit Language with Interpreter | Replace Implicit Language with Interpreter (single best-fit) | Kerievsky |
| 7 [de-patterning] | A `Config` Singleton reached globally, hiding a dependency and making callers hard to test; nothing needs single-instance policy. | (Kerievsky Away / functional) | Inline Singleton (Kerievsky Away) OR Module Namespace (functional dissolution) | EITHER Inline Singleton OR Module Namespace | Kerievsky-Away OR functional |
| 8 [routing-boundary] | The SAME `switch (shapeType)` appears in three sites (area, perimeter, bounding-box); a new shape means editing all three. | repeated-switches.md | Replace Conditional with Polymorphism | Replace Conditional with Polymorphism (FOWLER, not Kerievsky) | Fowler |
| 9 [no-tests, optional] | A long messy function with a smell but NO test coverage; asks how to refactor safely. | (any smell) + CCH-03 | route to Feathers first (characterization tests), THEN the structural refactoring | correct FIRST move = characterization tests via refactoring-without-tests.md | behavior-preservation |

Design notes for the planner:
- The de-patterning case (id 7) is D-05-required and tests CCH-02/CCH-06. Per the shipped functional-catalog README, Singleton/Inline Singleton/Limit-Instantiation-with-Singleton all map to the `Module Namespace` idiom (`#singleton` anchor). The D-04-RUBRIC "correct layer" is satisfied by EITHER the Kerievsky Away refactoring (Inline Singleton) OR the functional idiom (Module Namespace) - the rubric candidate set must accept both, and the layer check must accept `Kerievsky-Away` OR `functional`.
- The routing-boundary case (id 8) is D-05-required and is the discriminating CCH-01 test: a naive reader sees "a messy switch, wants a pattern" and would route to Kerievsky (Strategy/State), but because it is the SAME switch on a type code repeated across sites (Repeated Switches leaf, single candidate), the correct route is the FOWLER mechanical Replace Conditional with Polymorphism. This is exactly the mechanical-vs-pattern-directed seam the phase must protect.
- ids 4 and 5 share one smell (Conditional Complexity) but pin different best-fits within its candidate set - a good within-set discriminator that the deterministic set-match handles cleanly.
- Every named refactoring above resolves to a real shipped leaf (Fowler catalog has 62 leaves; Kerievsky catalog README lists all 27 with Direction + GoF pattern + Use-when; functional catalog README maps Singleton -> Module Namespace). Ground truth is pre-proven - no re-derivation.

## Deterministic Grading Design (D-04-RUBRIC)

The grade-run.mjs rewrite keeps the Phase-5 skeleton (fail-closed preliminary/judge scaffolding, nodrive, selfcheck structure, RUBRICS<->evals.json alignment check) and replaces two skill-specific pieces:

1. Refactoring-NAME matcher (replaces `transformRe`). lz-refactor names are proper-noun phrases ("Extract Function", "Replace Conditional with Polymorphism", "Inline Singleton"), not `(a -> b)` tokens. Build a case-insensitive, whitespace-tolerant, word-bounded matcher over the canonical name. Two check kinds:
   - `{ candidateSet: [names] }` -> SCORED PASS if the response names ANY refactoring in the smell's candidate set (the one-to-many tolerance the D-04-RUBRIC demands; a correct-but-alternative in-set pick still passes).
   - `{ bestFit: name }` -> SCORED PASS only if the pinned single best-fit name is present (used where the scenario's details pin one answer, e.g. ids 2, 6, 8).
2. LAYER check (new). Derive a name->layer lookup table from the shipped catalog READMEs at build time (Fowler catalog README = 62 names -> `Fowler`; Kerievsky catalog README = 27 names -> `Kerievsky`, with the 3 Away leaves also tagged `Kerievsky-Away`; functional catalog README = idiom names -> `functional`). Check kind `{ layer: "Fowler"|"Kerievsky"|"Kerievsky-Away"|"functional" }` -> SCORED PASS if the named refactoring resolves to the expected layer (accept a set of acceptable layers for the de-patterning case). This is what enforces "correct layer per CCH-01" deterministically rather than by judge.

3. nodrive (reuse verbatim). `{ nodrive: true }` reads `metrics.json` `tool_calls`/flat keys; "drove" = any Edit/Write/MultiEdit/NotebookEdit/Bash > 0. Fail-safe (no metrics -> fail) and fail-loud (unrecognized shape -> fail). This is the scripted form of "Coach, don't drive" (SKILL.md line 69). Copy the `toolDrive` function unchanged.

4. LLM-judge ONLY for rationale quality (`{ judge: "question" }` -> emitted `passed:null`, resolved by the grader agent + merge-judge). Use it where a set/name match is insufficient: (a) "does the rationale correctly tie the named refactoring to the detected smell" (not just name-drop); (b) for id 8, "did the coach justify the Fowler-mechanical route over a pattern-directed one" (the routing-boundary rationale); (c) for id 7, "did the coach frame the pattern as unwarranted / name the FP dissolution" (de-patterning intent). Do NOT judge anything the name+layer set-match already covers.

RUBRICS shape per eval-id (illustrative for id 2):
```
2: [
  { bestFit: "Pull Up Method", text: "Names Pull Up Method (duplicate in sibling subclasses)" },
  { candidateSet: ["Extract Function","Slide Statements","Pull Up Method"], text: "Names an in-set Duplicated Code refactoring" },
  { layer: "Fowler", text: "Routes to the Fowler mechanical layer" },
  { judge: "Ties the pick to WHERE the duplication lives (sibling subclasses -> lift to parent), not a generic dedup" },
  { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
]
```
The selfcheck MUST assert `RUBRICS[id].length === evals.json.evals[id].expectations.length` for every id (the Phase-5 selfcheck already does this; keep it - it catches the exact drift that bit Phase 5's eval-6).

## Build / Run Split (D-10 HARD GATE)

The plan encodes a build-only phase. Enumerated:

### BUILD (in-phase, committed)
- Vendored harness copied to `tools/skill-creator-eval/` (+ README path/pitfall edits).
- `eval-status.mjs`, `merge-judge.mjs` copied verbatim; `--selfcheck` GREEN for merge-judge.
- `run-spec-chunks.mjs` copied + 3 path constants + canary edited (optional component).
- `grade-run.mjs` rewritten (name+layer matcher + RUBRICS + name->layer lookup); `--selfcheck` GREEN incl. RUBRICS<->evals.json alignment.
- `evals/trigger-eval.json` authored (10 + 10 from the candidate sets above).
- `evals/evals.json` authored (>= 8 scenarios from the table above; `skill_name: "lz-refactor"`; `expectations` count-aligned with RUBRICS).
- (optional) `evals/trigger-smoke.json`, `evals/d07-chunks/negatives.json`.
- `EVAL-RESULTS.md` template (headings + empty tables + the standing run-config caveat text; numbers blank).
- A build-time schema/lint check (fold into grade-run selfcheck or a small node script): trigger-eval has >= 8/>= 8 split with >= 2 lz-tpp-seam negatives; every evals.json `expectations` array is count-aligned; every candidate-set/best-fit name resolves in the name->layer lookup.

### RUN (GATED - out of phase, only after explicit user approval)
- EVL-01 trigger probe: `python -m scripts.run_eval --eval-set ../../evals/trigger-eval.json --skill-path <repo>/plugins/lz-tdd/skills/lz-refactor --model claude-opus-4-8 --runs-per-query 3 --num-workers 1` run from `tools/skill-creator-eval/`, with `PONYTAIL_DEFAULT_MODE=off` and MCP/user-plugins stripped (`--strict-mcp-config` + `--setting-sources project`; see landmines). (Optional: `run-spec-chunks.mjs` for canary-gated specificity; `run_loop.py`/`improve_description.py` for the D-08 description-tuning candidate.)
- EVL-02 behavior: spawn UNNAMED subagents per scenario x config x run (>= 3 each) in isolated scratch cwds; capture timing at completion; grade-run.mjs -> grader agent -> merge-judge.mjs --merge -> merge-judge.mjs --verify -> `python -m scripts.aggregate_benchmark iteration-1 --skill-name lz-refactor` -> `eval-viewer/generate_review.py`.
- Compute Pass@k / Pass^k per eval + overall; fill `EVAL-RESULTS.md`; >= 1 unbiased-from-scratch reviewer.
- D-08 tuning (at most one, only if a bar is missed).

The final build task presents the exact ready-to-run commands and HALTS for approval. Do NOT run anything in-phase (the researcher did not run any evals either).

## Validation Architecture

> `workflow.nyquist_validation` is `true` in `.planning/config.json` - this section is included.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node built-in script self-checks (`--selfcheck` in `grade-run.mjs` and `merge-judge.mjs`); no jest/vitest/pytest in this workspace. `node --version` = v24.18.0. |
| Config file | none - each script is self-contained and self-testing. |
| Quick run command | `node grade-run.mjs --selfcheck && node merge-judge.mjs --selfcheck` |
| Full suite command | Quick run + the workspace catalog battery already present (`npm run check` in `lz-refactor-workspace/package.json`) if the plan touches the checker harness (it should not - eval assets are additive). |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command (build-time, non-gated) | File Exists? |
|--------|----------|-----------|-------------------------------------------|-------------|
| EVL-01 | Trigger set is schema-valid, has >= 8 should-trigger + >= 8 near-miss, incl. >= 2 lz-tpp-seam negatives | build-time lint | small node schema check over `evals/trigger-eval.json` (fold into grade-run selfcheck or a new `check-evals.mjs`) | Wave 0 |
| EVL-01 | Trigger recall/specificity measured on the native harness | RUN-time (gated) | `python -m scripts.run_eval ...` (see Build/Run split) - NOT run in-phase | n/a (gated) |
| EVL-02 | Grader rubric is internally consistent (RUBRICS <-> evals.json count alignment; names resolve to layers; nodrive fail-safe/fail-loud) | unit (selfcheck) | `node grade-run.mjs --selfcheck` | Wave 0 (rewrite) |
| EVL-02 | Judge-merge is fail-closed; aggregate gate rejects unmerged runs | unit (selfcheck) | `node merge-judge.mjs --selfcheck` | exists (verbatim copy) |
| EVL-02 | With-skill vs baseline benchmark (name+layer routing correctness) | RUN-time (gated) | subagent runs -> grade -> judge -> merge -> verify -> aggregate - NOT run in-phase | n/a (gated) |

### Sampling Rate
- **Per task commit:** `node grade-run.mjs --selfcheck` (and `merge-judge.mjs --selfcheck` when that file is touched).
- **Per wave merge:** both selfchecks + the trigger-eval/evals.json schema lint.
- **Phase gate:** both selfchecks GREEN + schema lint GREEN + the ready-to-run commands presented; then HALT (D-10). The actual eval RUN and its Pass@k/Pass^k are the gated, post-approval validation of the requirements' measured outcomes.

### Wave 0 Gaps
- [ ] `grade-run.mjs` - rewrite RUBRICS + name/layer matcher for lz-refactor; keep the alignment selfcheck. (covers EVL-02 grading)
- [ ] name->layer lookup data (derive from the 3 catalog READMEs at build time). (covers EVL-02 layer check)
- [ ] `evals/trigger-eval.json` + `evals/evals.json` authored. (covers EVL-01/EVL-02 data)
- [ ] (optional) `check-evals.mjs` schema lint, or fold the schema assertions into the grade-run selfcheck.
- [ ] Framework install: none needed (node present; typescript already a devDependency; no new packages).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Native trigger probe on Windows | A new `run_eval`/subprocess reader | The vendored `tools/skill-creator-eval/run_eval.py` (verbatim) | It already fixes the 3 upstream bugs (select-on-pipe, message-boundary detection, slash-command probe). Re-fixing risks re-introducing them. |
| Judge-verdict merge + aggregate gate | A new merge/verify script | `merge-judge.mjs` (verbatim) | Fully generic, fail-closed, self-tested; no skill content. |
| Run resume/status bookkeeping | Ad-hoc run tracking | `eval-status.mjs` (verbatim) | Generic run-tree walker; respawns only MISSING runs. |
| Benchmark aggregate + HTML report | A custom aggregator | installed skill-creator `aggregate_benchmark.py` + `eval-viewer/generate_review.py` | grading.json shape is authored to match them; reinventing diverges from the schema. |
| Nuanced "does-not-recommend X" grading | Regex heuristics | The LLM judge (`agents/grader.md`) via `{judge:...}` | A good coach names X to warn against it (regex false-fail); a bad coach edits code without naming it (false-pass). Phase-5 grade-run comment documents exactly this. |
| Throttle-robust specificity | Re-running blindly | `run-spec-chunks.mjs` canary gating (optional) | A throttled probe reads as a non-trigger, which for a NEGATIVE looks like a (possibly false) pass; the canary proves the window was healthy. |

**Key insight:** This phase authors eval DATA + one rubric, not eval INFRASTRUCTURE. The infrastructure is proven and on disk; deviating from it re-opens solved problems.

## Common Pitfalls (Phase-5 landmines that will bite again)

### Pitfall 1: num-workers-3 false-recall artifact
**What goes wrong:** Running the trigger probe concurrently (`--num-workers 3`) under a tight rate window produces spurious non-triggers, collapsing recall to a false ~8%. Phase 5 shipped a wrong "8% MISS" result before catching it.
**How to avoid:** Run the trigger probe SERIALLY (`--num-workers 1`), `PONYTAIL_DEFAULT_MODE=off`, MCP stripped (`--strict-mcp-config`), user-plugins stripped (`--setting-sources project`, keeps the ephemeral project skill, ~54% probe token cut), model `claude-opus-4-8`. This is the D-01 locked config.
**Warning signs:** Uniform 0.0 trigger_rate across obviously in-scope queries (the `trigger-results.json` on disk still shows the buggy 0.0 run - do not mistake it for a real result).
**Asymmetry to remember:** Specificity is throttle-robust (a throttled negative still reads as "quiet" = pass); recall is NOT. Validate recall with self-evident triggers and a canary; corroborate specificity across independent runs.

### Pitfall 2: the real sibling skills stealing the probe
**What goes wrong:** The probe writes an ephemeral `.claude/skills/<id>/SKILL.md` and matches the `<skill_name>-skill-` prefix. If the real plugin skills are enabled in the run directory, they can steal the trigger. With lz-refactor this is now DOUBLE-risk: BOTH `lz-tpp` and `lz-refactor` ship in the same plugin.
**How to avoid:** `--setting-sources project` drops user-level plugins (both real siblings) while keeping the ephemeral project skill. Confirm neither `.claude/skills/lz-tpp-workspace/` nor `.claude/skills/lz-refactor-workspace/` is a loadable skill (they are `-workspace` tooling dirs with no root SKILL.md - safe). Edit the vendored README's pitfall note to name both siblings.

### Pitfall 3: grading a run before all completion notifications arrive
**What goes wrong:** `total_tokens` / `duration_ms` (timing.json) are available ONLY at run completion and cannot be recovered later. Grading early loses them.
**How to avoid (D-06 + CLAUDE.md):** Wait for ALL benchmark completion notifications before grading; persist `timing.json` as each arrives.

### Pitfall 4: git grep blindness on gitignored workspace paths
**What goes wrong:** `git grep` returns ZERO matches inside `.claude/skills/*-workspace/` (the path prefix is partially gitignored and git grep only searches the index the way it does). Silent zero, no error - easy to conclude "not there".
**How to avoid:** Use `rg` (or Read/Glob) for anything under `*-workspace/`. Never conclude absence from a `git grep` zero-result there.

### Pitfall 5: aggregating unmerged/preliminary runs (silent false pass)
**What goes wrong:** `aggregate_benchmark.py` only warns and drops an unmerged run from the denominator - a scored-only false pass.
**How to avoid:** Run `node merge-judge.mjs --verify <iteration-dir>` BEFORE aggregate; a non-zero exit means "do not aggregate". This gate is already in `merge-judge.mjs` - reuse it verbatim.

### Pitfall 6: RUBRICS <-> evals.json count drift
**What goes wrong:** If `grade-run.mjs` RUBRICS[id] has a different number of checks than `evals.json` evals[id].expectations, grading is silently miscounted (this exact drift bit Phase-5 eval-6).
**How to avoid:** Keep the selfcheck's alignment assertion (`RUBRICS[id].length === expectations.length` for every id). It reads `evals/evals.json` relative to the script - preserve that path resolution.

### Pitfall 7 (build/run confusion): running an eval in-phase
**What goes wrong:** Any `run_eval` / subagent / `run_loop` invocation spends `claude -p` tokens and is user-gated (D-10). Building the assets and then running "just to check" violates the hard gate.
**How to avoid:** The final task presents ready-to-run commands and HALTS. No run in-phase.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | `grade-run.mjs`, `merge-judge.mjs`, `eval-status.mjs`, `run-spec-chunks.mjs` (build + selfchecks) | yes | v24.18.0 | - |
| Python 3 | vendored `run_eval.py`, installed `aggregate_benchmark.py`/`run_loop.py`/`generate_review.py` (RUN-time) | yes | 3.13.6 | - |
| `claude` CLI (authenticated) | trigger probe + behavior subagents (RUN-time) | yes | present at `~/.local/bin/claude` | - |
| Installed skill-creator (`aggregate_benchmark.py`, `agents/grader.md`, `agents/analyzer.md`, `agents/comparator.md`, `eval-viewer/generate_review.py`, `run_loop.py`, `improve_description.py`) | EVL-02 aggregate/report + LLM judge + D-08 loop (RUN-time) | yes | at `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/skills/skill-creator/` | - |
| TypeScript | existing catalog compile harness only (NOT needed for eval assets) | yes | 6.0.3 (devDependency) | - |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none. All build-time and (gated) run-time dependencies are present.

## Package Legitimacy Audit

Not applicable. This phase installs NO external packages. The only workspace devDependency (`typescript@6.0.3`) already exists and is not used by the eval assets; the vendored `skill-creator-eval` is copied from the on-disk Phase-5 rig (Apache-2.0, provenance recorded in its README), not fetched from a registry. No `npm install` / `pip install` step is introduced.

## Security Domain

> `workflow.security_enforcement` gating: the eval assets are local JSON data + Node/Python scripts that read local files and spawn the already-authenticated `claude` CLI. There is no network service, no auth surface, no crypto, and no untrusted input beyond eval prompts the maintainer authors.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | minor | The eval scripts parse local JSON authored by the maintainer; `grade-run.mjs`/`merge-judge.mjs` already fail-closed on malformed/unrecognized shapes. |
| V6 Cryptography | no | none. |
| Others (V2/V3/V4) | no | no auth/session/access-control surface. |

Repo-hygiene control that DOES apply (project constraint, not ASVS): committed eval content must be ASCII-only (`->`, straight quotes, no emojis/em-dashes) and must not leak the maintainer's work email/domain. The trigger queries and scenario prompts are new committed prose - re-run the allowlist-inversion scan before committing (assert the only email-shaped token present is the approved gmail). The eval prompts contain code snippets and casual phrasing; keep them ASCII.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The trigger probe threshold is `>= 0.5` for "fired" (recall) and `< 0.5` for "quiet" (specificity). | Schemas / EVL-01 | Low - confirmed by `run-spec-chunks.mjs` (`trigger_rate >= 0.5`) and the trigger-results `pass` field; if run_eval changed the threshold the recall/specificity accounting shifts, but the pass rule is read straight from the harness output. |
| A2 | `run_eval.py`, `utils.py`, `__init__.py` are byte-identical between Phase 5's vendored copy and what lz-refactor needs (skill-agnostic native fix). | Reuse Map | Low - the fix is in `run_single_query` (probe mechanics), not skill content; the README documents it as skill-agnostic. Verify by a diff on copy. |
| A3 | `--setting-sources project` still keeps the ephemeral project skill while dropping user plugins on the current Claude Code version. | Pitfall 2 | Medium - this is a RUN-time flag behavior from Phase 5 (commit 5f586da). If Claude Code changed flag semantics, the probe token cut / skill isolation may differ; the RUN step (gated) is where this is exercised, and the operator confirms recall on self-evident triggers. Not a build-phase blocker. |
| A4 | The functional-catalog `Module Namespace` idiom is the accepted FP dissolution for Singleton (de-patterning scenario id 7). | EVL-02 id 7 | Low - confirmed in the shipped functional-catalog README (Singleton / Inline Singleton / Limit-Instantiation-with-Singleton all -> Module Namespace `#singleton`). |
| A5 | The behavior aggregate uses the INSTALLED skill-creator `aggregate_benchmark.py` (only the trigger `run_eval` is vendored). | Reuse Map / External | Low - the vendored `tools/` contains only `run_eval.py`+helpers; EVAL-RESULTS.md's reproduce section calls `aggregate_benchmark.py` as the last step; it is present in the install (verified). |

## Open Questions

1. **One plan or two?** (Claude's Discretion.) EVL-01 (trigger data + verbatim harness copy) and EVL-02 (rubric rewrite + scenario data) are cleanly separable. Recommendation: two waves in one phase, or two plans - the rubric rewrite (EVL-02) is the only heavy task and benefits from an isolated selfcheck-green gate. Either is fine; the roadmap sketched Phase 5 as multiple plans (4/4).
2. **Scenario count.** 10 shown; D-05 requires a representative spread + >= 1 de-patterning + >= 1 routing-boundary. Recommendation: keep 8-10 (drop the optional no-tests id 9 first if trimming). More scenarios = more gated `claude -p` cost at run time.
3. **Chunked specificity runner.** `run-spec-chunks.mjs` is a throttle workaround. Recommendation: build it (light edit) but treat it as optional at run time - use the direct `run_eval` pass first; fall back to chunking only if throttling shows.

## Sources

### Primary (HIGH confidence) - all on-disk, verified this session
- `.claude/skills/lz-tpp-workspace/` - the working Phase-5 rig: `tools/skill-creator-eval/{README.md, LICENSE.upstream.txt, scripts/{__init__.py, utils.py, run_eval.py}}`, `evals/{trigger-eval.json, evals.json}`, `eval-status.mjs`, `grade-run.mjs`, `merge-judge.mjs`, `run-spec-chunks.mjs`, `iteration-1/**` (eval_metadata.json, grading.json, timing.json, metrics.json, judge-verdicts.json, benchmark.md), `EVAL-RESULTS.md`.
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` - the `description` (EVL-01 ground truth) + the 6-step coach decision procedure (CCH-01..06, EVL-02 ground truth).
- `plugins/lz-tdd/skills/lz-refactor/references/smells.md` + smell leaves (long-function, long-parameter-list, duplicated-code, feature-envy, conditional-complexity, combinatorial-explosion, repeated-switches, indecent-exposure) - the D-04-RUBRIC candidate sets.
- `plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/README.md` - 27 refactorings + To/Towards/Away directions (de-patterning routes).
- `plugins/lz-tdd/skills/lz-refactor/references/functional-catalog/README.md` - Singleton -> Module Namespace dissolution.
- `.planning/phases/11-skill-effectiveness-evals/11-CONTEXT.md`, `.planning/phases/05-skill-effectiveness-evals/05-CONTEXT.md`, `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md`, `.planning/config.json`, root `.gitignore`.
- Environment probes: `node --version` (v24.18.0), `python --version` (3.13.6), `claude` present, installed skill-creator scripts/agents/eval-viewer listing.

### Secondary (MEDIUM confidence)
- `.claude/skills/lz-tpp-workspace/tools/skill-creator-eval/README.md` cites `anthropics/claude-plugins-official#3041` (the native-fix design source) and the upstream skill-creator repo. Not re-fetched this session (internal reuse; the fixed code is on disk and reused verbatim).

### Tertiary (LOW confidence)
- None. No web research was required - this phase is fully internal to the repo + the installed skill-creator.

## Metadata

**Confidence breakdown:**
- Rig inventory + reuse map: HIGH - every file read on disk; disposition (verbatim vs edit) derived from actual content.
- Eval-data candidates: HIGH - every EVL-02 scenario anchored in a shipped leaf's candidate set; EVL-01 queries derived from the shipped description's explicit in/out-of-scope clauses.
- Grading design: HIGH - the D-04-RUBRIC hybrid maps cleanly onto the existing grade-run.mjs skeleton; the only new logic is the name->layer lookup (data derivable from 3 READMEs).
- Run config / pitfalls: HIGH for build-time; MEDIUM for the RUN-time `--setting-sources` flag semantics (A3), which is gated and operator-confirmed anyway.

**Research date:** 2026-07-10
**Valid until:** 2026-08-09 (30 days - stable; the only external moving part is the installed skill-creator + Claude Code flag semantics, exercised only in the gated RUN step).
