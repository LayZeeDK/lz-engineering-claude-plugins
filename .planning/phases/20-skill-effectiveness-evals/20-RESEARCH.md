# Phase 20: Skill-Effectiveness Evals - Research

**Researched:** 2026-07-21
**Domain:** Skill-effectiveness evaluation (trigger recall/specificity + RED-coaching behavior) for the shipped `lz-red` skill, via the vendored native skill-creator eval harness. A build-only, near-exact analog of the CLOSED Phase 11 (lz-refactor) and Phase 5 (lz-tpp), extended with a THREE-way cross-skill boundary and an open-ended RED-move rubric.
**Confidence:** HIGH (internal reuse-mapping problem; the proven Phase-11 rig is on disk in full, and the ground-truth sources are the LOCKED shipped `lz-red` references + description)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01 (harness):** Reuse the locally vendored, bug-fixed `skill-creator-eval` harness proven in Phase 5 and re-used in Phase 11 (the one that fixed the three upstream `run_eval.py` bugs: Windows `select.select()` on a pipe; detection quitting at the first message boundary; probing a non-auto-triggering slash-command). Runs NATIVELY on Windows with the already-authenticated `claude` (no WSL). Copy the rig into `.claude/skills/lz-red-workspace/tools/skill-creator-eval/` from the freshest working source (`.claude/skills/lz-refactor-workspace/`), preserving Apache-2.0 provenance + the `run_eval` reimplementation note. RUN CONFIG (the config that fixed Phase 5's false 8%-recall artifact): serial (`--num-workers 1`), Ponytail off (`PONYTAIL_DEFAULT_MODE=off`), MCP servers stripped, session model `claude-opus-4-8`. This phase authors eval DATA, not eval INFRASTRUCTURE. `lz-red-workspace` already exists (Phase-16 content gate + tsc extractor); eval assets are ADDITIVE - do NOT disturb `check-red-references.mjs` / `extract-samples.mjs`.
- **D-02 (trigger set):** Hand-author a ~20-24-query trigger set: should-trigger RED-phase prompts + near-miss should-not-trigger queries that are genuinely tricky negatives. Near-misses MUST cover BOTH sibling seams: `lz-tpp` green-step AND `lz-refactor` refactor-step, plus generic negatives. Queries concrete/detailed (file paths, code snippets, casual speech, typos). The shipped `description` (`SKILL.md:3-15`, with its explicit "Do NOT use ... use lz-tpp" and "Do NOT use ... use lz-refactor" clauses) is the should-vs-should-not ground truth.
- **D-03 [ESCALATED + LOCKED - specificity + reciprocal RED spot-check]:** Prove the three-way boundary in TWO directions. (1) Forward (lz-red-centric): measure `lz-red` recall + specificity with the D-02 near-misses drawing from BOTH sibling territories. (2) Reciprocal RED spot-check (the genuinely new delta): run the harness for `lz-tpp` AND `lz-refactor` against the `lz-red` should-trigger RED prompts ONLY, asserting both siblings stay QUIET on RED intent. Bounded spot-check, NOT a full 3x3 confusion matrix. Rejected: lz-red-centric-only (leaves the three-way claim half-proven); full 3x3 (~3x cost, re-checks already-covered directions).
- **D-04 (behavior harness):** skill-creator test-case + benchmark posture: `evals/evals.json` (prompts), with-skill vs baseline (no-skill) subagent runs, per-eval `assertions`, grading, benchmark aggregate. Follow the Phase-5/11 EVAL-02 orchestration mechanic: spawn eval subagents UNNAMED / fire-and-forget in an isolated scratch cwd per run, capture timing from the completion notification, then grade -> independent judge -> merge-judge -> verify -> aggregate. Each scenario = code in a RED situation (new behavior to test, or an existing test to critique/reshape) - NOT a failing test to make pass (lz-tpp) and NOT passing code to restructure (lz-refactor).
- **D-05-RUBRIC [ESCALATED + LOCKED - per-dimension hybrid: deterministic + judge]:** Ground truth for a "correct" RED move is HYBRID, decomposed into the shipped coach-procedure dimensions (SKILL.md "Coach decision procedure", steps 1-6 + coach-by-default). Grade the MECHANICAL/observable dimensions DETERMINISTICALLY (scripted, reusable): Selection (degenerate/starter case, one small step, triangulation); Structure (AAA/GWT, assert-first, one concept); Assertion-target (an output/state/communication style is named and matches the routed stance); Fail-for-the-right-reason (AssertionError on the pinned behavior, not a compile/import/setup error, not a false green); Handoff (to lz-tpp for green, does not drive to passing); Coach-don't-drive (no unasked edit/suite-run on a QUESTION; write-then-stop on a COMMAND). Reserve an LLM-judge pass ONLY for the two judgment-heavy dimensions: "is THIS genuinely the right next test" and "is the asserted target observable behavior not implementation detail". Each scenario pins a known-correct answer from a shipped `lz-red` reference example. Rejected: single-best-move set-match (brittle); holistic judge-only (weak reproducibility).
- **D-06 (scenario sourcing):** Source EVL-02 scenarios PRIMARILY from the shipped `lz-red` reference examples so ground truth is proven: three-laws-and-test-selection.md (starter case, one small step, triangulation), test-structure-and-assertions.md (AAA/GWT, four pillars, assert observable behavior), naming.md, the three testing-stance leaves (functional-core / message-matrix / seams-and-legacy - each drives a different assertion style), vitest-typescript-mechanics.md (fail-for-the-right-reason), and the SKILL.md worked example. Cover a representative spread including a classify-first boundary scenario where a naive read hands off to lz-tpp/lz-refactor but the correct move is a RED test.
- **D-07 (sampling/metrics):** Run each behavior scenario and each trigger query >= 3x. Compute + report Pass@k and Pass^k (k = 1, 3, 5, and total run count) per eval and overall. Flag saturated assertions (Pass@1 = 1.0 for both configs). WAIT for ALL completion notifications before grading (persist timing as each arrives). Include >= 1 review agent with a neutral from-scratch brief.
- **D-08 (pass bars, SOFT/tunable/non-blocking):** Trigger = the 0.0.1/0.0.2 bar: 100% recall / 100% specificity (ROADMAP SC1), sibling near-misses (both) quiet AND the reciprocal RED spot-check clean. Behavior with-skill correct-move Pass@1 high AND clearly beating baseline. Missing a bar triggers AT MOST the D-09 tuning pass; NEVER reopens Phases 15-19.
- **D-09 (tuning, at most one, non-blocking):** Description: apply a widened/tuned `description` to `SKILL.md` frontmatter ONLY if it beats the current one on a HELD-OUT trigger set (show before/after + scores). Behavior: a bounded wording tweak to the coach procedure/description ONLY on a real routing/RED-move defect. NO new reference files, NO re-authoring LOCKED content (references + stance leaves stay frozen), NO scope expansion. Any `SKILL.md` edit gets its OWN subagent review (>= 1 unbiased); `/reload-plugins` is a human ship action afterward. No self-feeding re-eval loops.
- **D-10 (location + git hygiene):** Everything under `.claude/skills/lz-red-workspace/` (eval sets, vendored harness `tools/skill-creator-eval/`, iteration run dirs, orchestration scripts, `EVAL-RESULTS.md`). Explicitly NOT under `plugins/lz-tdd/skills/lz-red/` and NOT under `.planning/`. A D-09 tuning pass is the ONLY write-back into `plugins/`. (See Pitfall 8 below: the generic `*-workspace` gitignore rules only PARTIALLY cover the bulky byproducts - a per-skill gitignore edit IS required, contrary to the CONTEXT phrasing.)
- **D-11 [HARD GATE]:** The plan builds ALL eval assets (sets, scenarios, assertions, vendored harness, orchestration scripts, reciprocal-spot-check config) but MUST HALT before RUNNING the evals or any description-optimization loop (the run spends `claude -p` tokens, user-gated per the standing eval-run approval rule). Present the ready-to-run command(s) and wait for explicit approval. Token spend is on the Claude plan (not a metered pool), so no paid-consult confirmation - but the RUN is still gated.

### Claude's Discretion
- Exact eval-query wording and exact query/scenario counts within the D-02/D-06 posture (>= skill-creator minimums; edge-case-focused).
- Exact assertion text and which dimensions are scripted vs judged within the D-05-RUBRIC split (deterministic mechanical first; judge only the two judgment-heavy ones).
- Whether the reciprocal RED spot-check (D-03) reuses the exact lz-red should-trigger prompts verbatim or a curated subset; exact workspace directory naming/layout.
- Whether EVL-01 and EVL-02 are one plan or two; whether behavior runs execute in parallel or series (series is fine if timeouts bite).
- How many net-new behavior scenarios to add beyond the leaf-sourced ones; whether to run a standalone measurement around any D-09 tuning.
- The Windows/native harness env specifics (nx not involved; plain `node` + the vendored Python `run_eval` under the native fix).

### Deferred Ideas (OUT OF SCOPE)
- Turning the eval sets into a permanent CI/regression gate -> future.
- A full 3x3 reciprocal confusion matrix across all three skills -> rejected (D-03) as disproportionate.
- Exhaustive per-reference / per-stance scenario coverage -> out of scope; EVL-02 is a REPRESENTATIVE spread.
- A second/iterative tuning pass or re-authoring reference content on eval findings -> disallowed by SC3/D-09.
- The type-level (ADV-01), property-based (ADV-02), outside-in (FUT-OUTSIDE-IN), and multi-language (FUT-02) RED work -> post-0.0.3 Future Requirements; not eval'd here.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EVL-01 | Trigger eval - `lz-red` fires on RED-phase prompts and stays quiet on near-misses (recall + specificity), INCLUDING a cross-skill trigger eval proving the three-way boundary (lz-red vs lz-tpp vs lz-refactor). | Copy vendored `tools/skill-creator-eval/` verbatim (native-fixed `run_eval.py`); author `evals/trigger-eval.json` (lz-red positives + BOTH-seam near-misses, see EVL-01 candidates) + `evals/reciprocal-red.json` (the RED positives re-tagged `should_trigger:false`, run against the lz-tpp AND lz-refactor skill-paths). Adapt `check-evals.mjs` seam lint to require negatives from BOTH seams + a dual-write invariant on the reciprocal set. Canary-gated chunk runners (`run-recall-chunks.mjs`, `run-spec-chunks.mjs`) for throttle-robust measurement. |
| EVL-02 | RED-behavior eval - the coach recommends the correct next-test / assertion move (right selection, structure, assertion target; fails for the right reason; hands off to lz-tpp; coaches rather than drives) versus an unaided baseline, as in 0.0.1/0.0.2. | Reuse `evals/evals.json` schema + the grade -> judge -> merge -> verify -> aggregate chain. New scenarios sourced from the shipped lz-red leaves (see EVL-02 candidates). Rewrite `grade-run.mjs` into the D-05-RUBRIC per-dimension hybrid: deterministic phrase-set matchers for the mechanical dimensions + `nodrive`; LLM-judge for the two judgment-heavy ones. Borrow the negation-aware matcher from `grade-reference.mjs`. |
</phase_requirements>

## Summary

Phase 20 is a build-only, NON-BLOCKING validation of the already-shipped `lz-red` skill. It is a near-exact clone of two CLOSED phases: Phase 11 (lz-refactor evals) and Phase 5 (lz-tpp evals). The proven rig lives on disk in full at `.claude/skills/lz-refactor-workspace/`: a vendored native-fixed trigger harness (`tools/skill-creator-eval/`), a build-time trigger lint (`check-evals.mjs`), a deterministic grader (`grade-run.mjs`), a fail-closed judge merge (`merge-judge.mjs`), a resume/status walker (`eval-status.mjs`), two throttle-robust canary-gated runners (`run-recall-chunks.mjs`, `run-spec-chunks.mjs`), the eval-data files, and `EVAL-RESULTS.md`. Because CONTEXT.md has already locked every strategic decision (D-01..D-11), the planner's job is largely mechanical: copy the reusable pieces into the existing `lz-red-workspace`, author RED eval DATA grounded in the shipped `lz-red` references, rewrite the ONE skill-specific script (`grade-run.mjs`) for the RED-move rubric, and HALT before running anything (D-11).

Two genuine deltas separate Phase 20 from its precedents, both flagged ESCALATED in CONTEXT. First, the THREE-way cross-skill boundary (D-03): near-misses must draw from BOTH the `lz-tpp` green-step and the `lz-refactor` refactor-step, and a NEW reciprocal RED spot-check runs the harness against the lz-tpp AND lz-refactor skill-paths (feeding them the lz-red RED positives, re-tagged `should_trigger:false`) to prove both siblings stay quiet on RED intent - coverage no prior phase produced. Second, the open-ended RED-move rubric (D-05-RUBRIC): where lz-refactor graded a single refactoring name + layer, lz-red decomposes "correct RED move" into six coach-procedure dimensions, grading the mechanical ones deterministically (phrase-set/no-drive matchers) and reserving the LLM judge for only two judgment-heavy dimensions.

**Primary recommendation:** Copy `tools/skill-creator-eval/`, `eval-status.mjs`, and `merge-judge.mjs` VERBATIM; light-edit `run-recall-chunks.mjs` + `run-spec-chunks.mjs` (path constants resolve from file location already; only the CANARY needs re-derivation from the lz-red eval set); rewrite `grade-run.mjs` into the D-05-RUBRIC per-dimension hybrid (phrase-set matchers for the six dimensions, borrowing the negation-aware `occursAffirmed()` from `grade-reference.mjs`, plus the verbatim `toolDrive`/nodrive logic and the selfcheck alignment gate); adapt `check-evals.mjs` to require BOTH-seam negatives + a reciprocal dual-write invariant; author `evals/trigger-eval.json`, `evals/reciprocal-red.json`, and `evals/evals.json` from the candidate tables below; scaffold `EVAL-RESULTS.md`. Add the required `lz-red-workspace`-specific gitignore lines (Pitfall 8). End the phase with a "ready-to-run commands + HALT for approval" task.

## Architectural Responsibility Map

The "tiers" are eval-pipeline stages, not web tiers. Mapping each capability to its owning stage prevents misassigning (e.g.) trigger measurement into the behavior chain or grading logic into the harness.

| Capability | Primary Stage | Secondary Stage | Rationale |
|------------|--------------|-----------------|-----------|
| Trigger recall/specificity (EVL-01 forward) | vendored `tools/skill-creator-eval/run_eval.py` | `run-recall-chunks.mjs` / `run-spec-chunks.mjs` (canary-gated) | The native-fixed probe is the ONLY component measuring triggering; skill-agnostic, reused verbatim; `--skill-path` selects lz-red. |
| Reciprocal RED spot-check (EVL-01, D-03.2) | same `run_eval.py`, `--skill-path` = lz-tpp then lz-refactor | `evals/reciprocal-red.json` (RED positives tagged `should_trigger:false`) | Same harness, different skill-path + eval-set; asserts each sibling stays quiet (specificity) on RED prompts. Three separate invocations, no new tool. |
| Behavior scenario execution (EVL-02) | orchestrator subagent fan-out (RUN-time) | isolated scratch cwd per run | "Did the coach drive?" is ground-truthed by running each scenario in a throwaway dir; orchestration, not a script. Orchestrator (not gsd-executor) spawns these. |
| Deterministic RED grading (6 dimensions + nodrive) | `grade-run.mjs` (rewritten) | `metrics.json` (tool_calls) | The one file needing real per-skill authoring; scripted, reusable across iterations. |
| Nuanced grading (right-next-test, behavior-not-impl) | skill-creator `agents/grader.md` (LLM judge, RUN-time) | `judge-verdicts.json` | ONLY the two D-05-RUBRIC judgment dimensions are delegated; everything checkable is scripted. |
| Judge merge + aggregate gate | `merge-judge.mjs` (verbatim) | - | Fail-closed merge + pre-aggregate completeness gate; fully generic. |
| Benchmark aggregate + report | installed skill-creator `aggregate_benchmark.py` + `eval-viewer/generate_review.py` (RUN-time) | `benchmark.json`/`.md`, `passk-metrics.json` | External (installed), NOT vendored; grading.json shape authored to match. |
| Build-time trigger lint | `check-evals.mjs` (adapted) | `evals/reciprocal-red.json` dual-write | Fail-closed schema/split/seam/ASCII lint over the trigger set + reciprocal set; the non-gated EVL-01 gate. |
| Results record | `EVAL-RESULTS.md` (template in-phase; numbers filled RUN-time) | - | Build-phase produces the skeleton; numbers come only after the gated run. |

## Standard Stack (eval toolchain, not a library stack)

### Core
| Component | Version | Purpose | Why standard |
|-----------|---------|---------|--------------|
| Node.js | v24.18.0 (present) `[VERIFIED: node --version]` | Runs all `.mjs` orchestration scripts + selfchecks | Already the workspace runtime; no install. |
| Python 3 | 3.13.6 (present) `[VERIFIED: python --version]` | Runs the vendored `run_eval.py` (trigger probe) + installed `aggregate_benchmark.py` | Native Windows, no WSL, per the D-01 fix. |
| `claude` CLI (authenticated) | present at `~/.local/bin/claude` `[CITED: 11-RESEARCH.md]` | The trigger probe + behavior subagents shell out to `claude -p` | Already authenticated; RUN-time only (gated). |
| vendored `skill-creator-eval` | Apache-2.0 (on disk) `[VERIFIED: read lz-refactor-workspace/tools/skill-creator-eval/]` | Native-fixed `run_eval.py` + `utils.py` + `__init__.py` | The three-bug native fix; copy verbatim, do NOT re-fix. |
| installed skill-creator | present at `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/` `[CITED: 11-RESEARCH.md]` | `aggregate_benchmark.py`, `agents/grader.md`, `eval-viewer/generate_review.py`, `run_loop.py`/`improve_description.py` (D-09) | Used from the install; only the trigger probe is vendored (it alone carries the native fix). |

### Supporting (already present in lz-red-workspace)
| Component | Version | Purpose | When used |
|-----------|---------|---------|-----------|
| typescript | 6.0.3 (devDep) `[VERIFIED: read lz-red-workspace/package.json]` | `extract-samples.mjs` tsc-strict on sample fences | Existing content gate; NOT needed by eval assets, but available for any fixture check. |
| vitest | 4.1.10 (devDep) `[VERIFIED: read lz-red-workspace/package.json]` | present from Phase 16 | Not needed by eval assets. |

**Installation:** NONE. No new package for any ecosystem. `node` + `python` + `claude` are present; the vendored harness is copied from disk (not fetched from a registry); the workspace devDeps already exist. This satisfies REQUIREMENTS "Out of Scope: New repo build dependencies" AND D-10's "no build deps in plugins/lz-tdd".

## Package Legitimacy Audit

Not applicable. This phase installs NO external packages (no `npm install` / `pip install` step introduced). The only workspace devDependencies (`typescript@6.0.3`, `vitest@4.1.10`) already exist from Phase 16; the vendored `skill-creator-eval` is copied from the on-disk Phase-11 rig (Apache-2.0, provenance in its README), not fetched. The package-legitimacy gate is vacuously satisfied.

## Rig Inventory + Reuse Map

**Source rig:** `.claude/skills/lz-refactor-workspace/` (149 tracked files; the freshest working generation). **Target:** `.claude/skills/lz-red-workspace/` (8 tracked files today: `extract-samples.mjs`, `package.json`, `package-lock.json`, `tsconfig.json`, `tools/check-red-references.mjs`, `tools/lib/provenance-honesty.mjs`, `tools/lib/scaffold-phrases.mjs`, `tools/provenance-honesty.selftest.mjs`; plus gitignored `samples/`). Eval assets are ADDITIVE - build alongside, do NOT overwrite the content gate or extractor.

> LANDMINE (Pitfall 7): `git grep` returns ZERO matches inside `.claude/skills/*-workspace/` (partially gitignored path prefix). Use `rg` or Read/Glob for anything under `*-workspace/`. Never conclude absence from a `git grep` zero-result there.

| Source path (lz-refactor-workspace) | Purpose | Disposition for lz-red |
|--------------------------------------|---------|------------------------|
| `tools/skill-creator-eval/scripts/{__init__.py, utils.py}` | Upstream skill-creator helpers (Apache-2.0), unchanged. | COPY VERBATIM. Skill-agnostic. |
| `tools/skill-creator-eval/scripts/run_eval.py` | Native-fixed trigger probe (3-bug fix; whole-turn detection; ephemeral `.claude/skills/<id>/SKILL.md`; `--strict-mcp-config` + `--setting-sources project` baked in). | COPY VERBATIM. The fix is skill-agnostic; do NOT re-fix upstream. |
| `tools/skill-creator-eval/LICENSE.upstream.txt` | Apache-2.0 provenance. | COPY VERBATIM. |
| `tools/skill-creator-eval/README.md` | Provenance + reimplementation note + usage. | COPY, then EDIT the example `--skill-path` to `.../lz-red` and the Pitfall-2 note to name ALL THREE siblings (lz-tpp, lz-refactor, lz-red now all ship in the same plugin - TRIPLE steal-risk). |
| `eval-status.mjs` | Resume/status walker (`eval-*/<config>/run-*`, reports MISSING/PARTIAL/DONE). | COPY VERBATIM. Fully generic. |
| `merge-judge.mjs` | Fail-closed judge merge + pre-aggregate `--verify` gate (`--merge`, `--verify`, `--selfcheck`). | COPY VERBATIM (fully generic; comment header names lz-tpp cosmetically - optionally retitle to lz-red, no logic change). `--selfcheck` must stay GREEN. |
| `run-recall-chunks.mjs` | Resumable canary-gated RECALL runner for positives. | LIGHT EDIT. Paths resolve from `import.meta.url` already (portable). Re-derive `CANARY_PREFIX` from a chosen lz-red should-trigger positive (WR-01: derive FROM the eval set, never hand-type). |
| `run-spec-chunks.mjs` | Resumable canary-gated SPECIFICITY runner for negatives (reads `evals/d07-chunks/negatives.json`). | LIGHT EDIT. Same as above (CANARY re-derivation). OPTIONAL for the reciprocal spot-check (which is itself a specificity measurement over the RED positives against the sibling skill-paths). |
| `grade-run.mjs` | Deterministic pre-filter grader (RUBRICS keyed by eval-id; nodrive; fail-closed preliminary; `--selfcheck` incl. RUBRICS<->evals.json alignment). | HEAVY REWRITE of the skill-specific parts; REUSE the skeleton. See "Deterministic RED-behavior grading design" below. |
| `grade-reference.mjs` | (lz-refactor-specific quick-task grader for a reference-facts eval.) NOT copied as-is. | BORROW `occursAffirmed()` - a clause-scoped, BIDIRECTIONAL negation-aware phrase matcher. This is the single most valuable non-obvious reuse for RED grading (see below). |
| `check-evals.mjs` | Build-time trigger lint (schema; >= 8/>= 8 split; >= 2 lz-tpp-seam negatives; ASCII; dual-write with d07-chunks/negatives.json). | ADAPT. Add the lz-refactor seam regex + require >= 2 negatives from EACH seam (lz-tpp green-step AND lz-refactor refactor-step); add a reciprocal-red.json dual-write + all-`should_trigger:false` assertion; keep ASCII + email-allowlist (add). |
| `evals/trigger-eval.json` | EVL-01 query set (`[{query, should_trigger}]`). | REPLACE CONTENT with lz-red queries (schema identical). |
| `evals/reciprocal-red.json` | (NEW - no Phase-11 analog.) The lz-red should-trigger RED positives, re-tagged `should_trigger:false`, run against the lz-tpp + lz-refactor skill-paths (D-03.2). | AUTHOR NEW. Recommend: the trigger-eval.json positives verbatim, flipped to `should_trigger:false`, asserted byte-consistent by check-evals. |
| `evals/evals.json` | EVL-02 scenario set (`{skill_name, evals:[{id, prompt, expected_output, files, expectations}]}`). | REPLACE CONTENT with lz-red RED scenarios (schema identical). `skill_name: "lz-red"`. |
| `evals/d07-chunks/negatives.json` | Input the spec runner reads (canary-gated). | AUTHOR. The near-miss negatives list; keep byte-consistent with trigger-eval.json negatives (check-evals dual-write invariant). |
| `iteration-1/**` (run dirs, transcripts, grading.json, timing.json, metrics.json, benchmark.json/.md, passk-metrics.json) | Phase-11 RUN artifacts. | DO NOT BUILD. Generated RUN-time (gated). Study shapes only. |
| `EVAL-RESULTS.md` | Results summary + run-config caveat + harness lessons. | COPY the STRUCTURE as a template; scaffold headings/columns; leave numbers empty (filled post-approval). |

### JSON schemas (field-by-field)

`evals/trigger-eval.json` and `evals/reciprocal-red.json` (EVL-01 input): `[{ "query": string, "should_trigger": boolean }]`. For reciprocal-red.json every entry is `should_trigger:false` (we want the siblings quiet on RED prompts).

`trigger-results.json` (EVL-01 output, run_eval stdout): `{ skill_name, description, results:[{ query, should_trigger, trigger_rate (0..1), triggers:int, runs:int, pass:boolean }] }`. Threshold: `trigger_rate >= 0.5` = "fired". Recall = fired over `should_trigger:true`; specificity = quiet (`< 0.5`) over `should_trigger:false`.

`evals/evals.json` (EVL-02 input): `{ skill_name:"lz-red", evals:[{ id:int (0-based, contiguous), prompt:string (code in a RED situation), expected_output:string, files:[] , expectations:[string] (1:1 count-aligned with grade-run.mjs RUBRICS[id]) }] }`.

`grading.json` / `grading.preliminary.json`: `{ expectations:[{text, passed:bool|null, evidence}], summary:{passed, failed, total, pass_rate}, preliminary:bool, judge_required:[string] }`. grade-run writes `grading.preliminary.json` while any `judge_required` remains; merge-judge produces final `grading.json`.

`metrics.json` (nodrive source): canonical `{ tool_calls:{ Edit, Write, MultiEdit, NotebookEdit, Bash } }` OR flat `{ edits, writes, testRuns }`. "Drove" = any > 0.

`timing.json`: `{ total_tokens, duration_ms, total_duration_seconds }`. Arrives ONLY at run completion (D-07: persist as each arrives).

### External (installed skill-creator, NOT vendored)
`aggregate_benchmark.py` (`python -m scripts.aggregate_benchmark <iteration-dir> --skill-name lz-red`), `agents/grader.md` (LLM judge), `eval-viewer/generate_review.py`, `run_loop.py`/`improve_description.py` (the OPTIONAL D-09 description-optimization loop - GATED, RUN-time). Only the trigger probe is vendored because only it carries the native fix.

## EVL-01 Query Candidates (grounded in the shipped `description`)

The shipped `description` (`plugins/lz-tdd/skills/lz-red/SKILL.md:3-15`) is the ground truth. In-scope surface: which test to write next; keeping a running test list; the degenerate/starter case; triangulating with another example; structuring the test (AAA/GWT); naming it for the behavior; asserting observable behavior not implementation; confirming it fails for the right reason; matching the codebase's testing stance; and the low-signal "what should I test here?" / "is this a good test?". Out-of-scope (explicit): making an existing failing test pass / picking the minimal green change (lz-tpp); restructuring/de-duplicating passing code (lz-refactor).

The planner finalizes wording. Target ~11-12 should-trigger + ~11-12 near-miss (D-02 "~20-24"). Concrete, varied register, some with code/typos.

### Should-trigger (~12 candidates)

| # | Candidate query | In-scope facet |
|---|-----------------|----------------|
| T1 | "starting a new `slugify(title)` from scratch, tests-first. whats the first test i should write?" | Selection: degenerate/starter case (casual) |
| T2 | "i'm doing tdd on a `discount` function. i've got the 10%-off case green. whats the next test to drive out the behavior?" | Selection: triangulation / next test |
| T3 | "how should i structure this unit test - is there a standard skeleton?" | Structure: AAA/GWT |
| T4 | "what should i actually assert here? the function just returns a number" | Assertion-target: output-based |
| T5 | "this class has a collaborator it notifies. what do i assert, and do i mock it?" | Assertion-target: message-matrix (outgoing command) |
| T6 | "is `test('works')` a good name for this? doing tdd" | Naming (low-signal "is this a good test?") |
| T7 | "keep a test list for this parser feature - what belongs on it and how do i track it?" | Selection: running test list / it.todo |
| T8 | "my new test went green the first time i ran it. is that a problem?" | Fail-for-the-right-reason (false green) |
| T9 | "how do i match the way this codebase already writes its tests before i add one?" | Stance: match the house idiom |
| T10 | "legacy `PriceCalculator` has no tests and reaches into a global clock. how do i get a first test around it before i add behavior?" | Stance: seams-and-legacy (characterization) |
| T11 | "is this a good test? `expect(svc.total).toBe(42)` where total is a private field" | Assertion-target: assert observable behavior, not implementation |
| T12 | "what should i test here?" (bare, with a small pure function pasted) | Low-signal catch-all (description explicitly covers this) |

### Should-not-trigger (~12 candidates) - genuinely tricky near-misses, BOTH seams (D-02/D-03.1)

lz-tpp GREEN-step seam (>= 2 required):
| # | Candidate query | Why it must stay quiet |
|---|-----------------|------------------------|
| N1 | "red test `expect(of(2)).toBe(1)`, my `of` is `return n <= 1 ? n : 1;`. whats the smallest edit to get it passing? doing tdd" | lz-tpp seam (green step; make the failing test pass). HIGH-value. |
| N2 | "my failing test wants fib(3)=2 but the code returns 1 above 1. whats the minimal transformation to green it?" | lz-tpp seam ("transformation" + "minimal" + "green it"). |
| N3 | "which change makes this failing test pass - is there a smaller step than the full algorithm?" | lz-tpp seam (green step, generic). |

lz-refactor REFACTOR-step seam (>= 2 required):
| # | Candidate query | Why it must stay quiet |
|---|-----------------|------------------------|
| N4 | "all tests pass, but this 60-line function does five things. which named refactoring cleans it up?" | lz-refactor seam (structure-only, tests green). |
| N5 | "green bar. i've got the same block copy-pasted across three services - how do i de-duplicate it?" | lz-refactor seam (de-duplicate passing code). |
| N6 | "the tests are green but this module is messy - what would you refactor?" | lz-refactor seam (clean up passing code). |

Generic negatives:
| # | Candidate query | Why it must stay quiet |
|---|-----------------|------------------------|
| N7 | "write a debounce helper in typescript" | Generic write-a-function. |
| N8 | "add pagination to the GET /users endpoint in this express app" | Plain feature work. |
| N9 | "explain the SOLID principles with a short typescript example for each" | Design-principle adjacent, not RED. |
| N10 | "my CSV parse throws on empty rows and a test is red - help me find the bug" | Debugging, not test selection/design. |
| N11 | "whats the time and space complexity of this recursive merge sort?" | Analysis, not RED. |
| N12 | "run my whole test suite and tell me which ones fail" | Test execution, not choosing/writing a new failing test. |

**Seam-negative design note:** the check-evals seam lint must be satisfied by >= 2 negatives matching a lz-tpp regex (e.g. `/failing test|make .* pass|minimal transformation|go green|green it|smallest (edit|step)/i`) AND >= 2 matching a lz-refactor regex (e.g. `/clean(ing)? up|de-?duplicat|refactor|restructure|tidy|messy|code smell/i` combined with a tests-green cue). Avoid a "write a test" near-miss that reads as RED intent; keep negatives clearly on a sibling's or a non-TDD facet.

### Reciprocal RED spot-check set (D-03.2) - `evals/reciprocal-red.json`

The lz-red should-trigger positives (T1..T12), re-tagged `should_trigger:false`, run TWICE more: `--skill-path .../lz-tpp` and `--skill-path .../lz-refactor`. Each must show ~100% specificity (both siblings quiet on RED prompts). If a sibling fires on a RED positive, that is a D-09 tuning candidate on THAT sibling's description - bounded and non-blocking. Recommend the reciprocal set reuse the positives VERBATIM (check-evals asserts byte-consistency), so it is provably the exact RED prompts.

## EVL-02 Scenario Candidates (each grounded in a shipped lz-red leaf; ground truth pre-proven)

Every scenario is code in a RED situation (new behavior to test, or an existing test to critique/reshape) - never a failing test to make pass (lz-tpp) and never passing code to restructure (lz-refactor). Each maps to the D-05-RUBRIC dimension(s) it exercises and pins its answer to a shipped leaf example (`[VERIFIED: read the leaf]`). The planner finalizes prompt wording and count (10 shown; trim to >= 8 if preferred, dropping the optional naming scenario first).

| id | Scenario (RED situation) | Primary dimension(s) | Ground-truth leaf | Expected move |
|----|--------------------------|----------------------|-------------------|---------------|
| 0 | A brand-new behavior (e.g. `sumOf(values)`), nothing written yet; "what test first?" | Selection (degenerate/starter case) + Structure (AAA) | three-laws-and-test-selection.md (`sumOf([]) -> 0`), test-structure (AAA) | Start from the empty/degenerate case; shape AAA/GWT |
| 1 | One example green; a too-specific impl would still pass; "what's the next test?" | Selection (triangulation) | three-laws (triangulate) + vitest (`test.each` `isEven`) | Add another concrete example that rules out the shortcut |
| 2 | A pure value-in/value-out function (functional-core signal); "what should I assert?" | Assertion-target (output-based, no doubles) | testing-stance/functional-core.md (`nextBalance`) | Assert the returned value; no doubles; state the stance |
| 3 | An object with a collaborator it must notify (outgoing command); "what to assert, do I mock?" | Assertion-target (communication: expect-to-send, ONE warranted double) + anti-over-mock | testing-stance/message-matrix.md (`Gate` / `notify`) | Expect-to-send on the one boundary; do not mock queries |
| 4 | An object whose command changes observable state; "what to assert?" | Assertion-target (state-based, public side effect, no double) | message-matrix.md (incoming command) | Assert the public side effect through the public surface |
| 5 | Untested legacy welded to a global/clock, no seam; "how do I start testing to add behavior?" | Assertion-target (characterization first) + Selection sequencing | testing-stance/seams-and-legacy.md | Find a seam; pin CURRENT behavior with a characterization test first, then the new red test |
| 6 | A candidate test that would pass immediately (false green) OR a stub that throws ReferenceError; "is this a valid red?" | Fail-for-the-right-reason | vitest-typescript-mechanics.md + anti-patterns.md #4 + SKILL `applyDiscount` | It must fail on its assertion (AssertionError), not a compile/import error, and not pass immediately |
| 7 | Coach-behavior probe: a bare COMMAND ("write the failing test for X") vs a QUESTION ("what should I test here?") | Coach-don't-drive + Handoff (nodrive; write-then-stop; hand to lz-tpp) | SKILL.md "Coach by default" clause | On a question: present the test + smallest move, do not edit/run. On a command: write the failing test then stop; do not drive to green (lz-tpp's job) |
| 8 [classify-first boundary] | A naive read routes to lz-tpp (a failing test to green) OR lz-refactor (messy passing code), but the correct move is a NEW red test for an un-covered behavior. | Selection / classify-first (step 1) - the EVL-02 mirror of EVL-01's three-way boundary | SKILL.md step 1 + three-laws classify-first | Classify RED (not green, not refactor); choose the next failing test; hand green off to lz-tpp |
| 9 [optional] | An existing test named `test('works')`; "is this a good test name?" | Structure/Naming (should-naming; name the behavior not the method) | naming.md (`isEven` "should report zero as even") | Recommend a behavior-oriented "should ..." name (or Osherove 3-part if the house style) |

**Design notes for the planner:**
- Scenario 8 (classify-first boundary) is D-06-REQUIRED and is the discriminating case for step 1 of the coach procedure. It is the EVL-02 analog of EVL-01's three-way trigger boundary and the single scenario most likely to separate the skill from a strong baseline.
- Scenarios 2/3/4/5 deliberately span the four assertion styles (output / communication / state / characterization) so the "assertion-target matches the routed stance" dimension is exercised across all stances (ASRT-02 spine).
- Scenario 7 is the ONLY scenario whose primary signal is `nodrive` + the write-then-stop behavior; it needs both a QUESTION variant and a COMMAND variant (or two scenarios) to test both halves of the coach-by-default clause. Note the text-only subagent harness gives the coach no edit tools, so `nodrive` is a fail-SAFE placeholder here (as it was in Phase 11) - the real coach-vs-drive signal for the COMMAND variant is whether the answer presents the failing test then STOPS (does not narrate making it pass), which is a JUDGE dimension.

**SATURATION WARNING (Phase-11 lesson, applies directly):** claude-opus-4-8 baseline is a strong model. In Phase 11, 41 of 45 assertions were saturated (Pass@1 = 1.0 for BOTH configs); the entire skill-vs-baseline gap rested on the single designed routing-boundary trap. Leaf-sourced "correct answer proven in the reference" scenarios UNDER-measure skill lift. To have any discriminating signal, weight the scenario set toward the harder cases (scenario 8 classify-first boundary; scenario 3 over-mock temptation; scenario 6 false-green) and expect most straightforward scenarios to saturate. This is an eval-DESIGN limitation to document in EVAL-RESULTS.md, not a defect to tune away.

## Deterministic RED-behavior Grading Design (D-05-RUBRIC)

The `grade-run.mjs` rewrite KEEPS the Phase-11 skeleton and REPLACES the skill-specific matcher + RUBRICS.

**Keep verbatim:** `toolDrive()`/nodrive logic (canonical `tool_calls` + flat keys; fail-safe on no metrics; fail-LOUD on unrecognized shape); the `{judge:...}` -> `passed:null` scaffolding; `finalOutPath()` (refuses a final grading.json while judge items remain -> writes `grading.preliminary.json`); `grade()`/`scoreCheck()` dispatch; `parseArgs`/`main`; the `--selfcheck` STRUCTURE incl. the `RUBRICS[id].length === evals.json.evals[id].expectations.length` alignment gate (this catches the exact count-drift that bit Phase-5 eval-6).

**Replace:** the refactoring-NAME matcher (`nameRe` + `NAME_LAYERS` lookup) with RED-vocabulary PHRASE-SET matchers, and the `{bestFit, candidateSet, layer}` rubric with per-dimension checks. Each RUBRICS[id] is count-aligned 1:1 with its scenario's evals.json expectations.

**Check kinds for RED (adapt `candidateSet` to a phrase-set model):**
- `{ phraseSet: [/regex/ or "phrase", ...] }` -> SCORED PASS if the response affirms ANY phrase in the set (tolerance for correct-but-alternative phrasing). This is the RED analog of lz-refactor's `candidateSet`.
- `{ nodrive: true }` -> SCORED, reuse verbatim.
- `{ judge: "question" }` -> UNSCORED, resolved by the LLM judge. Use ONLY for the two D-05-RUBRIC judgment dimensions.

**Per-dimension phrase sets (starting vocabulary; the planner tunes):**
| Dimension | Deterministic phrase set (word-bounded, negation-aware) |
|-----------|----------------------------------------------------------|
| Selection: starter case | `degenerate`, `starter case`, `simplest case`, `empty (list\|collection\|input)`, `zero`, `null`, `no-op` |
| Selection: one small step | `one small step`, `smallest slice`, `one .* test at a time`, `only enough to fail`, `not-yet-defined symbol` |
| Selection: triangulation | `triangulat`, `another (concrete )?example`, `second example`, `test\.each`, `it\.each` |
| Selection: running test list | `test list`, `it\.todo`, `test\.todo`, `park (it )?on the list` |
| Structure: AAA/GWT | `arrange[- ]act[- ]assert`, `arrange,? act,? assert`, `given[- ]when[- ]then`, `given,? when,? then`, `\bAAA\b`, `\bGWT\b` |
| Structure: assert-first / one concept | `assert[- ]first`, `write the assertion first`, `one concept per test`, `single (concept\|behavior)` |
| Assertion: output-based | `output-based`, `assert (on )?the returned value`, `the value it returns` |
| Assertion: state-based | `state-based`, `public side effect`, `observable state` |
| Assertion: communication-based | `communication-based`, `expect-to-send`, `toHaveBeenCalled`, `the one warranted double`, `outgoing command` |
| Assertion: characterization | `characterization test`, `pin (the )?current behavior`, `lock (it )?in`, `find a seam` |
| Fail-for-the-right-reason | `AssertionError`, `fail(s)? (on\|for) (its\|the )?assertion`, `fail for the right reason`, `not a (compile\|reference\|type\|import\|setup) error`, `false green`, `passes immediately` |
| Handoff | `lz-tpp`, `green step`, `hand(s)? (it )?off`, `Law 3` |

**BORROW the negation-aware matcher from `grade-reference.mjs` (`occursAffirmed()`), do NOT use bare presence.** RED coaching prose is dense with contrastive phrasing - "assert the returned value, NOT the private field", "this is NOT a false green because...", "do NOT mock the query". A naive `regex.test(resp)` would credit a phrase that the coach explicitly warned AGAINST (the Phase-11 "presence-not-primacy / negation-blind" grader-leniency lesson, CR-01). `grade-reference.mjs` already implements a clause-scoped, BIDIRECTIONAL negation-aware matcher (`NEG`, `CONTRAST`, `FWD_BOUNDARY`, hedged-contrastive retraction) with a full selfcheck. This is the single most valuable non-obvious reuse: lift `occursAffirmed()` + its clause helpers into `grade-run.mjs` and run every RED phrase through it. This closes the exact false-positive class that RED coaching answers will trip.

**Reserve the LLM judge for ONLY these two dimensions (D-05-RUBRIC):**
1. "Is THIS genuinely the right next test for the scenario?" (a scripted phrase-set cannot tell a correct-but-alternative next test from a wrong one; the judge assesses aptness against `expected_output`.)
2. "Is the asserted target observable behavior rather than implementation detail?" (the deterministic part only checks that an assertion STYLE is named and matches the stance; whether the specific target is genuinely observable is judged.)

**Judge-string provenance (Phase-11 WR-01/verbatim-judge lesson):** merge-judge `--merge` REJECTS a verdict whose text does not byte-match the grader's `judge_required` string. Build the EVL-02 judge scenario args by grading a dummy input per eval-id and reading `judge_required` from the emitted `grading.preliminary.json` - never transcribe judge strings by hand.

**Illustrative RUBRICS[id] (scenario 2, functional-core output-based):**
```
2: [
  { phraseSet: ["output-based", "assert (on )?the returned value", "the value it returns"], text: "Names an output-based assertion (assert the returned value)" },
  { phraseSet: ["no doubles", "no mock", "pure function", "functional core"], text: "States no doubles are needed for the pure core" },
  { judge: "Is asserting the returned value of this pure function genuinely observable behavior, not an implementation detail?" },
  { judge: "Is this the right next test for a value-in/value-out function (an output-based test over the core)?" },
  { nodrive: true, text: "Coach, don't drive (no edit / no test run)" },
]
```
The `--selfcheck` must assert, for every id, `RUBRICS[id].length === evals.json.evals[id].expectations.length`, and that every phrase-set is non-empty, plus fixture cases proving the negation-aware matcher rejects a negated phrase (mirror the `grade-reference.mjs` selfcheck fixtures).

## Build / Run Split (D-11 HARD GATE)

### BUILD (in-phase, committed - zero `claude -p` spend)
- Vendored harness copied to `tools/skill-creator-eval/` (+ README skill-path + triple-sibling Pitfall-2 edits).
- `eval-status.mjs`, `merge-judge.mjs` copied verbatim; `merge-judge.mjs --selfcheck` GREEN.
- `run-recall-chunks.mjs` + `run-spec-chunks.mjs` copied + CANARY re-derived from the lz-red eval set.
- `grade-run.mjs` rewritten (RED phrase-set matchers + negation-aware `occursAffirmed` + RUBRICS + judge for the 2 dimensions); `--selfcheck` GREEN incl. RUBRICS<->evals.json alignment + negation fixtures.
- `check-evals.mjs` adapted (BOTH-seam negatives; reciprocal dual-write; ASCII; email-allowlist); GREEN over the authored sets.
- `evals/trigger-eval.json` (~12 + ~12), `evals/reciprocal-red.json` (positives re-tagged false), `evals/evals.json` (>= 8 scenarios, `skill_name:"lz-red"`, expectations count-aligned), `evals/d07-chunks/negatives.json`.
- `EVAL-RESULTS.md` template (headings + empty tables + the standing run-config caveat text; numbers blank).
- The `lz-red-workspace`-specific gitignore lines (Pitfall 8).

### RUN (GATED - out of phase, ONLY after explicit user approval)
- EVL-01 forward (lz-red): `python -m scripts.run_eval --eval-set ../../evals/trigger-eval.json --skill-path <repo>/plugins/lz-tdd/skills/lz-red --model claude-opus-4-8 --runs-per-query 3 --num-workers 1` from `tools/skill-creator-eval/` (with `PONYTAIL_DEFAULT_MODE=off`; `--strict-mcp-config` + `--setting-sources project` baked in). Prefer the canary-gated runners (`node run-recall-chunks.mjs`, `node run-spec-chunks.mjs`) under any active/rate-limited session.
- EVL-01 reciprocal (D-03.2): the same probe with `--eval-set ../../evals/reciprocal-red.json` and `--skill-path .../lz-tpp`, then again with `--skill-path .../lz-refactor`. Assert ~100% specificity (siblings quiet).
- EVL-02 behavior: spawn UNNAMED subagents per scenario x config x run (>= 3) in isolated scratch cwds; capture timing at completion; `grade-run.mjs` -> grader agent -> `merge-judge.mjs --merge` -> `merge-judge.mjs --verify iteration-1` (gate) -> `python -m scripts.aggregate_benchmark iteration-1 --skill-name lz-red` -> `eval-viewer/generate_review.py`.
- Compute Pass@k / Pass^k per eval + overall; fill `EVAL-RESULTS.md`; >= 1 unbiased-from-scratch reviewer.
- D-09 tuning (at most one, only if a bar is missed on a demonstrated defect).

The final BUILD task presents the exact ready-to-run commands and HALTS for approval. Do NOT run anything in-phase (the researcher ran no evals either).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Native trigger probe on Windows | A new `run_eval`/subprocess reader | vendored `run_eval.py` (verbatim) | Already fixes the 3 upstream bugs (select-on-pipe, message-boundary detection, slash-command probe). Re-fixing risks re-introducing them. |
| Judge-verdict merge + aggregate gate | A new merge/verify script | `merge-judge.mjs` (verbatim) | Fully generic, fail-closed, self-tested. |
| Run resume/status bookkeeping | Ad-hoc run tracking | `eval-status.mjs` (verbatim) | Generic run-tree walker. |
| Benchmark aggregate + report | A custom aggregator | installed skill-creator `aggregate_benchmark.py` + `generate_review.py` | grading.json shape is authored to match; reinventing diverges. |
| Negation-aware phrase grading | A bare `regex.test(resp)` | `occursAffirmed()` from `grade-reference.mjs` | RED coaching prose is full of "assert X, NOT Y" contrasts; bare presence false-passes the warned-against phrase (Phase-11 CR-01 class). |
| Throttle-robust recall/specificity | Re-running a single big serial pass | `run-recall-chunks.mjs` / `run-spec-chunks.mjs` (canary-gated) | A throttled probe reads as a false non-trigger, sinking recall; the canary proves the window was healthy. |
| Reciprocal three-way proof | A new 3x3 matrix runner | The SAME `run_eval.py`, three `--skill-path` invocations | D-03 is a bounded spot-check; the harness already measures one skill at a time. |

**Key insight:** This phase authors eval DATA + one rubric, not eval INFRASTRUCTURE. The infrastructure is proven and on disk; deviating re-opens solved problems.

## Common Pitfalls (Phase-5/11 landmines that will bite again)

### Pitfall 1: num-workers-3 / rate-limit false-recall artifact
**What goes wrong:** Concurrent probes (`--num-workers 3`) OR a single large serial pass under a tight rate window produce spurious non-triggers, collapsing recall to a false ~8-10%. Both Phase 5 (num-workers) and Phase 11 (a 60-probe serial pass) shipped a wrong result before catching it.
**How to avoid:** Run serially (`--num-workers 1`), `PONYTAIL_DEFAULT_MODE=off`, MCP stripped, `--setting-sources project`, model `claude-opus-4-8`; and prefer the canary-gated chunk runners under any active session. A chunk is trusted ONLY when its appended positive canary fired (healthy window).
**Asymmetry:** specificity is throttle-robust (a throttled negative still reads "quiet" = pass); recall is NOT. The reciprocal spot-check is a specificity measurement, so it is throttle-robust - but validate it with a canary anyway.

### Pitfall 2: the real sibling skills stealing the probe (now TRIPLE-risk)
**What goes wrong:** The probe writes an ephemeral `.claude/skills/<id>/SKILL.md` and matches the `<skill_name>-skill-` prefix. If real plugin skills are enabled in the run dir, they can steal the trigger. With three siblings shipping in one plugin (lz-tpp, lz-refactor, lz-red), this is TRIPLE-risk.
**How to avoid:** `--setting-sources project` drops user-level plugins (all three real siblings) while keeping the ephemeral project skill; `--strict-mcp-config` drops MCP. Both are baked into `run_eval.py`. The `-workspace` dirs have no root `SKILL.md`, so they are not loadable skills (safe). Edit the vendored README's Pitfall note to name all three siblings.

### Pitfall 3: grading before all completion notifications arrive
**What goes wrong:** `total_tokens`/`duration_ms` (timing.json) are available ONLY at run completion and cannot be recovered later.
**How to avoid (D-07 + CLAUDE.md):** WAIT for ALL benchmark completion notifications before grading; persist timing as each arrives.

### Pitfall 4: aggregating unmerged/preliminary runs (silent false pass)
**What goes wrong:** `aggregate_benchmark.py` only warns and drops an unmerged run from the denominator - a scored-only false pass.
**How to avoid:** Run `node merge-judge.mjs --verify iteration-1` BEFORE aggregate; a non-zero exit means "do not aggregate". Reuse verbatim.

### Pitfall 5: RUBRICS <-> evals.json count drift
**What goes wrong:** If `grade-run.mjs` RUBRICS[id] has a different count than `evals.json` expectations[id], grading is silently miscounted (bit Phase-5 eval-6).
**How to avoid:** Keep the selfcheck alignment assertion (`RUBRICS[id].length === expectations.length`), which reads `evals/evals.json` relative to the script.

### Pitfall 6: deterministic grader leniency (negation-blind / presence-not-primacy)
**What goes wrong:** A bare-presence phrase match credits a phrase the coach explicitly warned against ("assert X, NOT Y"); Phase-11 CR-01 was a latent false-pass path in `layersInResponse`.
**How to avoid:** Use the negation-aware `occursAffirmed()` matcher; add selfcheck fixtures proving a negated phrase is NOT credited; keep the LLM judge on the two judgment dimensions; and have the unbiased reviewer audit the grader source for the same class (an unbiased-beats-primed reviewer caught the Phase-11 leniency).

### Pitfall 7: git grep blindness on gitignored workspace paths
**What goes wrong:** `git grep` returns ZERO matches inside `.claude/skills/*-workspace/` - silent zero, no error.
**How to avoid:** Use `rg` (or Read/Glob) for anything under `*-workspace/`.

### Pitfall 8 [NEW - discovered this session]: the `*-workspace` gitignore rules are only PARTIALLY generic
**What goes wrong:** CONTEXT.md D-10 says the generic root-`.gitignore` `*-workspace/` rules "already track the eval record ... and drop bulky raw outputs ... reused as-is (no per-skill gitignore edits)." This is INCORRECT for lz-red. The GENERIC rules (`.gitignore:29-36`) only drop `__pycache__/`, `*.pyc`, `outputs/`, `*.stream.jsonl`, `run_loop_stdout.json`, `trigger-workspace/`, `samples/`. The rules that drop the bulky per-run capture dirs and the probe-stdout captures are hardcoded to `lz-refactor-workspace` (`.gitignore:43-45`): `results*/`, `run-*/`, `trigger-results-*.json`. lz-red will produce `iteration-1/eval-*/<config>/run-N/` dirs and `trigger-results-*.json` chunk captures that are NOT covered by the generic rules - they would be committed as bloat.
**How to avoid:** The plan MUST add `lz-red-workspace`-specific gitignore lines mirroring `.gitignore:43-45` (surgical, matches precedent):
```
.claude/skills/lz-red-workspace/**/results*/
.claude/skills/lz-red-workspace/**/run-*/
.claude/skills/lz-red-workspace/**/trigger-results-*.json
```
(Alternatively generalize `lz-refactor-workspace` -> `*-workspace` on those three lines, but that would newly-ignore already-tracked lz-tpp `trigger-results-*.json` files - messier; prefer the additive lz-red lines.) Keep the tracked record = eval sets + `eval_metadata.json` per eval dir + `benchmark.json`/`.md` + `passk-metrics.json` + `EVAL-RESULTS.md` + the vendored `tools/`.

### Pitfall 9: running an eval in-phase (build/run confusion)
**What goes wrong:** Any `run_eval`/subagent/`run_loop` invocation spends `claude -p` tokens and is user-gated (D-11).
**How to avoid:** The final task presents ready-to-run commands and HALTS. No run in-phase.

### Pitfall 10: gsd-executor cannot spawn subagents
**What goes wrong:** The EVL-02 behavior subagents + the unbiased reviewer are Agent/Task spawns; the `gsd-executor` has only Read/Write/Edit/Bash/Grep/Glob/Skill (memory `gsd-executor-cannot-spawn-subagents`). A plan task saying "executor spawns the coach/judge/reviewer" is unexecutable.
**How to avoid:** Plan the subagent fan-out + the reviewer as ORCHESTRATOR steps AFTER the executor builds the deterministic assets. (Moot in-phase anyway, since the RUN is gated - but the plan wording must not assign spawns to the executor.)

## Runtime State Inventory

Not applicable. This is an ADDITIVE greenfield-asset phase (new eval files + copied scripts under an existing dev-only workspace), not a rename/refactor/migration. No stored data, live-service config, OS-registered state, secret/env-var, or build-artifact carries a string being renamed. Confirmed: the phase writes only new files under `.claude/skills/lz-red-workspace/` and (conditionally, D-09) one edit to `plugins/lz-tdd/skills/lz-red/SKILL.md`; nothing existing is renamed.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | all `.mjs` scripts + selfchecks (build) | yes | v24.18.0 | - |
| Python 3 | vendored `run_eval.py`, installed `aggregate_benchmark.py`/`run_loop.py`/`generate_review.py` (RUN-time) | yes | 3.13.6 | - |
| `claude` CLI (authenticated) | trigger probe + behavior subagents (RUN-time) | yes | present at `~/.local/bin/claude` | - |
| installed skill-creator | EVL-02 aggregate/report + LLM judge + D-09 loop (RUN-time) | yes | `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/` | - |
| typescript / vitest | existing content gate only (NOT needed by eval assets) | yes | 6.0.3 / 4.1.10 (devDeps) | - |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none. All build-time and (gated) run-time dependencies are present.

## Validation Architecture

> `workflow.nyquist_validation` is `true` in `.planning/config.json` `[VERIFIED: rg config.json]` - this section is included. This is a BUILD-only phase (D-11): all eval assets are built and selfcheck-verified in-phase; the actual eval RUN (which spends `claude -p`) is user-gated and happens AFTER this phase. The automated commands below are the build-time selfchecks/lints, NOT the run.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node built-in `--selfcheck` self-tests in the orchestration scripts (no jest/vitest/pytest suite in this workspace for the eval assets). `node --version` = v24.18.0. |
| Config file | none - each `.mjs` script is self-contained and self-testing. |
| Quick run command | `node grade-run.mjs --selfcheck && node merge-judge.mjs --selfcheck && node check-evals.mjs` (from `.claude/skills/lz-red-workspace/`) |
| Full suite command | Quick run + the existing content gate (`node tools/check-red-references.mjs` and `node extract-samples.mjs`) to confirm the eval additions did not disturb the Phase-16/17/18 gate. |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command (build-time, non-gated) | File Exists? |
|--------|----------|-----------|-------------------------------------------|-------------|
| EVL-01 | Trigger set schema-valid; >= 8 should-trigger + >= 8 near-miss; >= 2 lz-tpp-seam AND >= 2 lz-refactor-seam negatives; ASCII; reciprocal-red.json dual-write + all-false | build-time lint | `node check-evals.mjs` | Wave 0 (adapt) |
| EVL-01 | Trigger recall/specificity (forward lz-red) measured on native harness | RUN-time (gated) | `python -m scripts.run_eval ...` / canary runners - NOT run in-phase | n/a (gated) |
| EVL-01 | Reciprocal RED spot-check: lz-tpp + lz-refactor stay quiet on RED prompts | RUN-time (gated) | `run_eval` with reciprocal-red.json against each sibling skill-path - NOT run in-phase | n/a (gated) |
| EVL-02 | Grader rubric internally consistent (RUBRICS<->evals.json count alignment; phrase-sets non-empty; negation-aware matcher rejects negated phrases; nodrive fail-safe/fail-loud) | unit (selfcheck) | `node grade-run.mjs --selfcheck` | Wave 0 (rewrite) |
| EVL-02 | Judge-merge fail-closed; aggregate gate rejects unmerged runs | unit (selfcheck) | `node merge-judge.mjs --selfcheck` | exists (verbatim copy) |
| EVL-02 | With-skill vs baseline RED-move correctness benchmark | RUN-time (gated) | subagent runs -> grade -> judge -> merge -> verify -> aggregate - NOT run in-phase | n/a (gated) |

### Sampling Rate
- **Per task commit:** `node grade-run.mjs --selfcheck` (plus `merge-judge.mjs --selfcheck` when that file is touched; `check-evals.mjs` when eval data changes).
- **Per wave merge:** all three selfchecks/lints + a re-run of the existing content gate (`check-red-references.mjs`, `extract-samples.mjs`) to prove no regression.
- **Phase gate:** all build-time selfchecks/lints GREEN + the ready-to-run RUN commands presented, then HALT (D-11). The eval RUN and its Pass@k/Pass^k are the gated, post-approval validation of the measured outcomes.

### Wave 0 Gaps
- [ ] `grade-run.mjs` - rewrite RUBRICS + RED phrase-set matchers + borrowed `occursAffirmed()`; keep the alignment selfcheck. (covers EVL-02 grading)
- [ ] `check-evals.mjs` - adapt seam lint (both seams) + reciprocal dual-write + email-allowlist. (covers EVL-01 build-time)
- [ ] `evals/trigger-eval.json` + `evals/reciprocal-red.json` + `evals/evals.json` + `evals/d07-chunks/negatives.json` authored. (covers EVL-01/EVL-02 data)
- [ ] `merge-judge.mjs`, `eval-status.mjs`, `tools/skill-creator-eval/` copied; `run-recall-chunks.mjs`/`run-spec-chunks.mjs` copied + canary re-derived. (infrastructure)
- [ ] `lz-red-workspace`-specific gitignore lines added (Pitfall 8). (git hygiene)
- [ ] Framework install: none needed (node + python + claude present; workspace devDeps exist; no new packages).

## Security Domain

> `workflow.security_enforcement` gating: the eval assets are local JSON data + Node/Python scripts that read local files and spawn the already-authenticated `claude` CLI. No network service, no auth surface, no crypto, no untrusted input beyond eval prompts the maintainer authors.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | minor | The eval scripts parse local JSON authored by the maintainer; `grade-run.mjs`/`merge-judge.mjs`/`check-evals.mjs` already fail-closed on malformed/unrecognized shapes. |
| V6 Cryptography | no | none. |
| V2/V3/V4 (auth/session/access) | no | no such surface. |

**Repo-hygiene control that DOES apply (project constraint, not ASVS):** committed eval content (trigger queries, reciprocal set, scenario prompts, results) is NEW committed prose and must be (a) ASCII-only (`->`, straight quotes, no emojis/em-dashes) and (b) free of the maintainer work-email and its bare domain. Verify by ALLOWLIST-INVERSION (assert the only email-shaped token present is the approved gmail; never encode the forbidden value as a needle). Recommend folding an ASCII + email-allowlist assertion into `check-evals.mjs` (it already checks ASCII), and re-running the allowlist scan before committing. Eval prompts contain code snippets and casual phrasing - keep them ASCII.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The trigger probe threshold is `>= 0.5` = "fired" (recall) / `< 0.5` = "quiet" (specificity). `[VERIFIED: run-recall-chunks.mjs + trigger-results pass field]` | Schemas / EVL-01 | Low - read straight from the harness output; if run_eval changed the threshold the accounting shifts, but the `pass` field is authoritative. |
| A2 | `run_eval.py`/`utils.py`/`__init__.py` are skill-agnostic (the native fix is in probe mechanics, not skill content) and copy verbatim. `[VERIFIED: read run_eval.py header + README]` | Reuse Map | Low - verify with a diff on copy. |
| A3 | `--setting-sources project` still keeps the ephemeral project skill while dropping user plugins on the current Claude Code version. `[ASSUMED]` (RUN-time flag behavior carried from Phase 5/11) | Pitfall 2 | Medium - RUN-time only (gated), operator-confirmed by recall on self-evident triggers; not a build-phase blocker. |
| A4 | The reciprocal spot-check works by pointing `--skill-path` at lz-tpp/lz-refactor and feeding the RED positives tagged `should_trigger:false`; run_eval probes whether THAT skill triggers. `[VERIFIED: run_eval writes an ephemeral copy of --skill-path and measures its trigger]` | D-03.2 mechanic | Low - the harness measures one skill at a time by design; three invocations is the exact bounded spot-check. |
| A5 | The behavior aggregate uses the INSTALLED skill-creator `aggregate_benchmark.py` (only the trigger probe is vendored). `[CITED: 11-RESEARCH.md; installed path verified there]` | Reuse Map / External | Low - EVAL-RESULTS.md reproduce section calls it as the last step. |
| A6 | The lz-red `description` is 1091 chars, leaving ~445 chars of headroom under the 1536 listing-truncation cap for a D-09 widening. `[VERIFIED: node char count]` | D-09 tuning | Low - a widened description must stay < 1536 (memory `skill-description-char-cap`); this bounds the tuning pass. |
| A7 | claude-opus-4-8 baseline will saturate most leaf-sourced RED scenarios (Phase-11 saturated 41/45 assertions). `[CITED: 11-LEARNINGS.md]` | EVL-02 saturation | Medium - if lz-red scenarios saturate similarly, skill LIFT is measured mainly by the classify-first boundary + over-mock + false-green cases; document as an eval-design limitation, do NOT tune away. |

## Open Questions (RESOLVED)

All four are substantively settled by the finalized PLAN.md set (20-01/20-02/20-03); recorded here for audit-trail cleanliness.

1. **One plan or two?** (Discretion.) EVL-01 (trigger data + verbatim harness copy + reciprocal set) and EVL-02 (grader rewrite + scenario data) are cleanly separable. Recommendation: two waves in one phase (or two plans) - the `grade-run.mjs` rewrite is the only heavy task and benefits from an isolated selfcheck-green gate. Phase 11 used 4 plans. -> RESOLVED: 3 plans -- 20-01 (EVL-01 build) + 20-02 (EVL-02 grader) parallel in wave 1, 20-03 (finalize battery + gated commands + HALT) in wave 2.
2. **Scenario count + how hard.** 10 shown; D-06 requires the classify-first boundary. Recommendation: 8-10, weighted toward the discriminating cases (8 classify-first, 3 over-mock, 6 false-green) given the saturation risk (A7). More scenarios = more gated `claude -p` cost. -> RESOLVED: 20-02 authors >=8 leaf-grounded scenarios incl. the classify-first boundary case.
3. **Reciprocal set: verbatim or curated subset?** (D-03/discretion.) Recommendation: reuse the trigger-eval.json positives VERBATIM (check-evals asserts byte-consistency) so the reciprocal set is provably the exact RED prompts; a curated subset saves run cost but weakens the "the siblings stay quiet on THE RED prompts" claim. -> RESOLVED: verbatim reuse in 20-01 Task 3 (check-evals asserts the reciprocal dual-write invariant, all should_trigger:false).
4. **Chunked runners vs direct probe.** Recommendation: build both canary-gated runners (light edit) and use them by default under any active session; the direct `run_eval` pass is fine only in a demonstrably healthy window. -> RESOLVED: 20-01 builds the light-edited canary-gated runners; 20-03 documents the direct `run_eval` commands as the gated fallback (all user-gated per D-11).

## Sources

### Primary (HIGH confidence) - all on-disk, verified this session
- `.claude/skills/lz-refactor-workspace/` - the freshest working rig: `tools/skill-creator-eval/{README.md, LICENSE.upstream.txt, scripts/{__init__.py, utils.py, run_eval.py}}`, `check-evals.mjs`, `grade-run.mjs`, `grade-reference.mjs`, `merge-judge.mjs` (header read), `eval-status.mjs` (inventory), `run-recall-chunks.mjs`, `run-spec-chunks.mjs` (mirror), `evals/{trigger-eval.json, evals.json}`, `EVAL-RESULTS.md`, `package.json`.
- `plugins/lz-tdd/skills/lz-red/SKILL.md` - the `description` (EVL-01 ground truth, 1091 chars) + the 6-step coach decision procedure + coach-by-default clause + the `applyDiscount` worked example (EVL-02 / D-05-RUBRIC ground truth).
- `plugins/lz-tdd/skills/lz-red/references/` - three-laws-and-test-selection.md (`sumOf([])` starter case, triangulation), test-structure-and-assertions.md (`applyCredit`/`netOf` AAA + output-based, four pillars, F.I.R.S.T.), naming.md (`isEven` should-naming), testing-stance/{README, functional-core (`nextBalance`), message-matrix (`Gate`/notify), seams-and-legacy}.md, vitest-typescript-mechanics.md (`isEven` test.each, fail-for-the-right-reason), anti-patterns.md (false-green #4, over-mock), principle-backing.md.
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` + `plugins/lz-tdd/skills/lz-refactor/SKILL.md` - the sibling descriptions (near-miss + reciprocal-spot-check ground truth, D-03).
- `.claude/skills/lz-red-workspace/{package.json, extract-samples.mjs, tools/check-red-references.mjs}` - the existing additive target (8 tracked files; devDeps typescript@6.0.3 + vitest@4.1.10).
- `.planning/milestones/lz-tdd@0.0.2-phases/11-skill-effectiveness-evals/{11-RESEARCH.md, 11-LEARNINGS.md, 11-VALIDATION.md}` + `EVAL-RESULTS.md` - the direct template + the rate-limit / saturation / grader-leniency / verbatim-judge lessons.
- Root `.gitignore` (lines 24-49) - the PARTIALLY-generic workspace rules (Pitfall 8).
- `.planning/{REQUIREMENTS.md (EVL-01/EVL-02, Out of Scope), phases/20-skill-effectiveness-evals/20-CONTEXT.md, config.json (nyquist_validation:true), STATE.md}`.
- Environment probes: `node --version` (v24.18.0), `python --version` (3.13.6); git ls-files counts (lz-refactor 149, lz-red 8, lz-tpp tracked eval files).

### Secondary (MEDIUM confidence)
- `.claude/skills/lz-refactor-workspace/tools/skill-creator-eval/README.md` cites `anthropics/claude-plugins-official#3041` (the native-fix design source) - not re-fetched this session (the fixed code is on disk and reused verbatim).
- Installed skill-creator path + `aggregate_benchmark.py`/`agents/grader.md`/`generate_review.py`/`run_loop.py` presence - carried from `11-RESEARCH.md` (verified there); not re-probed this session.

### Tertiary (LOW confidence)
- None. No web research required - the phase is fully internal to the repo + the installed skill-creator.

## Metadata

**Confidence breakdown:**
- Rig inventory + reuse map: HIGH - every source file read on disk; disposition (verbatim vs edit vs rewrite) derived from actual content.
- EVL-01 query candidates: HIGH - every should-vs-should-not derived from the shipped description's explicit in/out-of-scope clauses; both-seam negatives grounded in the two sibling descriptions.
- EVL-02 scenario candidates: HIGH - every scenario anchored in a shipped lz-red leaf's worked example (ground truth pre-proven, no re-derivation).
- Grading design: HIGH for the skeleton reuse + the negation-aware matcher borrow; MEDIUM for the exact phrase-set vocabulary (the planner tunes it, and the unbiased reviewer audits for leniency).
- Run config / pitfalls: HIGH for build-time; MEDIUM for the RUN-time `--setting-sources` flag semantics (A3) and the saturation projection (A7), both gated / operator-confirmed.
- The gitignore landmine (Pitfall 8): HIGH - read the exact `.gitignore` lines; the lz-refactor-specific hardcoding is confirmed.

**Research date:** 2026-07-21
**Valid until:** 2026-08-20 (30 days - stable; the only external moving parts are the installed skill-creator + Claude Code flag semantics, exercised only in the gated RUN step).
