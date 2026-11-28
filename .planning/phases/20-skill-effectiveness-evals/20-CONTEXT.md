# Phase 20: Skill-Effectiveness Evals - Context

**Gathered:** 2026-07-21
**Status:** Ready for planning
**Mode:** `--analyze --auto --chain` (decisions auto-locked from the Phase-11 / Phase-5
analogs + REQUIREMENTS + the shipped `lz-red` skill's own ground truth; `--analyze`
trade-off tables live in DISCUSSION-LOG.md). Every gray area was rated IMPACT x
CONFIDENCE before auto-locking.

> Eleven phase-specific decisions. Nine are HIGH-confidence carry-forwards from the two
> prior skill-effectiveness-eval phases (Phase 5 = lz-tpp, Phase 11 = lz-refactor, both
> CLOSED with detailed CONTEXT) -- none in the trap quadrant -- so `--auto` locked them to
> their recommended options. TWO are genuinely new to this phase and sit in the
> HIGH-impact + NOT-high-confidence trap quadrant, so `--auto` did NOT lock them; they
> were escalated to the operator (a human is in the loop this session) and decided there:
> D-03 (the three-way cross-skill trigger mechanism) and D-05-RUBRIC (the open-ended
> RED-behavior correctness rubric). This mirrors Phase 11, which escalated exactly one
> (its D-04-RUBRIC). Auto-advance to plan-phase proceeds per `--chain`. Nothing below is
> open.

<domain>
## Phase Boundary

Empirically validate the ALREADY-SHIPPED `lz-red` skill and (only if needed) feed at most
one bounded tuning pass. It delivers two eval sets plus at most one tuning pass, and
nothing more:

1. **Trigger eval (EVL-01):** an in-scope-should-trigger + near-miss-should-not-trigger
   query set confirming the `description` fires on RED-phase intent (choose / write the
   next failing test, keep a test list, structure / name / assert a test, match the
   testing stance) and stays quiet on near-misses -- most importantly the sibling seams:
   `lz-tpp` (make the failing test pass / the green step) and `lz-refactor` (restructure
   passing code / the refactor step). Includes a CROSS-SKILL trigger eval that proves the
   three-way boundary (lz-red vs lz-tpp vs lz-refactor) holds. Measured for recall +
   specificity on the native eval harness, targeting the 0.0.1 / 0.0.2 bar (100% recall /
   100% specificity per ROADMAP SC1).
2. **RED-behavior eval (EVL-02):** a with-skill vs. baseline (no-skill) benchmark
   confirming the coach recommends the correct next-test / assertion move across
   representative RED scenarios -- right selection, right structure, right assertion
   target, fails for the right reason, hands off to `lz-tpp`, and coaches rather than
   drives -- clearly beating an unaided baseline.
3. **At most one tuning pass (SC3):** eval findings feed AT MOST a bounded
   `description` / coach-wording tuning pass on the shipped skill, and only if specificity
   drops or a real routing defect surfaces. NON-BLOCKING -- the public 0.0.3 ship (Phases
   15-19) is complete regardless of eval outcome; no phase depends on this one.

This phase clarifies HOW to build, run, score, and (conditionally) act on the evals for
what already exists. It does NOT re-author reference content, add reference files, expand
scope, or add languages / examples, and it does NOT reopen any earlier phase. It runs
AFTER Phase 19 (closed 2026-07-21).

</domain>

<decisions>
## Implementation Decisions

Decisions carry forward from **Phase 11 (0.0.2 lz-refactor evals)** and **Phase 5 (0.0.1
lz-tpp evals)** -- the two direct precedents -- adapted to `lz-red`, the three-skill
plugin, and the more open-ended RED-coaching ground truth. Phase 11's D-01..D-10 are the
template; the mapping is noted per decision.

### Eval harness (shared infrastructure, reused from Phases 5 + 11)
- **D-01:** Reuse the locally vendored, bug-fixed `skill-creator-eval` harness proven in
  Phase 5 and re-used in Phase 11 -- the one that fixed the three upstream `run_eval.py`
  bugs (Windows `select.select()` on a pipe; detection quitting at the first message
  boundary; probing a non-auto-triggering slash-command). It runs NATIVELY on Windows with
  the already-authenticated `claude` (no WSL, no interop, no separate auth). Copy the rig
  into `.claude/skills/lz-red-workspace/tools/skill-creator-eval/` from the freshest
  working source (`.claude/skills/lz-refactor-workspace/`; `lz-tpp-workspace/` is the
  original), preserving its Apache-2.0 provenance + `run_eval` reimplementation note. RUN
  CONFIG (the exact config that fixed Phase 5's false 8%-recall artifact): serial
  (`--num-workers 1`), Ponytail disabled (`PONYTAIL_DEFAULT_MODE=off`), MCP servers
  stripped from the probe, session model id `claude-opus-4-8` (match what users
  experience). This phase authors eval DATA, not eval INFRASTRUCTURE. The `lz-red-workspace`
  already exists (Phase 16 content gate + tsc extractor); eval assets are ADDITIVE under
  the same workspace root -- do not disturb `check-red-references.mjs` / `extract-samples.mjs`.

### Trigger eval: set design (EVL-01)
- **D-02:** Hand-author a ~20-24-query trigger eval set: **should-trigger** RED-phase
  prompts (varied formal / casual phrasings of: "what test should I write next", "how do I
  structure / name this unit test", "is this a good test", "what should I assert here",
  "how do I match this codebase's testing stance", "keep a test list for this feature",
  "start from the simplest case", "add another example to triangulate") and **near-miss
  should-not-trigger** queries that are genuinely tricky negatives, NOT obvious
  irrelevancies. The near-misses MUST cover BOTH sibling seams: the **`lz-tpp` green-step**
  ("this test is failing -- what minimal change makes it pass", "what transformation turns
  the bar green") and the **`lz-refactor` refactor-step** ("the tests pass, clean up this
  duplication", "what refactoring removes this smell"), plus generic negatives ("write a
  function", "explain SOLID / clean code", "fix this bug", "add integration tests for the
  whole flow"). Queries must be concrete and detailed (file paths, code snippets, casual
  speech, typos) per skill-creator guidance. The shipped `description`
  (`plugins/lz-tdd/skills/lz-red/SKILL.md:3-15`), with its explicit "Do NOT use it to make
  an existing failing test pass ... use lz-tpp" and "Do NOT use it to restructure ... use
  lz-refactor" clauses, is the ground truth for should-vs-should-not.

### Three-way cross-skill boundary: measurement design (EVL-01)
- **D-03 [ESCALATED + LOCKED -- specificity + reciprocal RED spot-check]:** Prove the
  three-way boundary in two directions.
  1. **Forward (lz-red-centric):** measure `lz-red` recall + specificity with the D-02
     near-miss set drawing from BOTH sibling territories; `lz-red` must fire on RED prompts
     and stay quiet on the `lz-tpp` green-step and `lz-refactor` refactor-step near-misses.
  2. **Reciprocal RED spot-check (the new delta):** run the harness for `lz-tpp` and
     `lz-refactor` against the `lz-red` should-trigger RED prompts ONLY, asserting both
     siblings stay QUIET on RED intent. This is the genuinely new coverage: `lz-tpp` and
     `lz-refactor` were eval'd in Phases 5 / 11 BEFORE any RED prompts existed, so nobody
     has measured whether adding `lz-red` leaves them mis-firing on RED intent. This is a
     bounded spot-check, NOT a full 3x3 confusion matrix.
  **Rejected alternatives (see DISCUSSION-LOG.md):** lz-red-centric near-misses only
  (cheapest, exact Phase-11 precedent, but never re-checks that the siblings stay quiet on
  the new RED prompts -- leaves the headline three-way claim half-proven); full 3x3
  reciprocal matrix (strongest literal proof but ~3x runs / ~3x tokens, and re-checks
  sibling directions already covered by Phases 5 / 11 for little new information).
  Escalated because it is HIGH-impact (EVL-01's headline deliverable and the ROADMAP SC1
  three-way boundary claim) + NOT-high-confidence (the harness measures one skill at a
  time, so "prove the three-way boundary" was genuinely ambiguous between the three designs
  above, with a real cost / scope tradeoff).

### RED-behavior eval: harness + orchestration (EVL-02)
- **D-04:** Use the skill-creator test-case + benchmark posture proven in Phases 5 + 11:
  `evals/evals.json` (prompts), with-skill vs baseline (no-skill) subagent runs, per-eval
  `assertions`, grading, and a benchmark aggregate. Follow the Phase-5 / Phase-11 EVAL-02
  orchestration mechanic: spawn eval subagents UNNAMED / fire-and-forget in an isolated
  scratch cwd per run (ground-truth "did the coach drive?"), capture timing from the
  completion notification, then grade -> independent judge -> merge-judge -> verify ->
  aggregate (memory `eval02-subagent-orchestration-mechanic`). Each scenario = code in a
  RED situation (a new behavior to test, or an existing test to critique / reshape) -- NOT
  a failing test to make pass (that is the `lz-tpp` green step) and NOT passing code to
  restructure (that is the `lz-refactor` refactor step).

### RED-behavior correctness rubric (EVL-02)
- **D-05-RUBRIC [ESCALATED + LOCKED -- per-dimension hybrid: deterministic + judge]:**
  Ground truth for a "correct" RED coaching move is HYBRID, decomposed into the shipped
  coach-procedure dimensions (`SKILL.md` "Coach decision procedure", steps 1-6 + the
  coach-by-default clause). Grade the MECHANICAL / observable dimensions DETERMINISTICALLY
  (scripted, reusable across iterations):
  - **Selection:** picks the degenerate / starter case for a new behavior; takes one small
    step; uses triangulation (another concrete example) where the scenario calls for it.
  - **Structure:** names / uses arrange-act-assert or given-when-then; assert-first;
    one concept per test.
  - **Assertion target selection:** chooses an output- / state- / communication-based style
    consistent with the routed stance (the deterministic part is "an assertion style is
    named and matches the stance"; whether it is genuinely behavior-not-implementation is
    judged, below).
  - **Fail-for-the-right-reason:** states the test should fail on its assertion
    (AssertionError on the pinned behavior), not on a compile / import / setup error, and
    not pass immediately (false green).
  - **Handoff:** hands off to `lz-tpp` for green; does NOT drive the test to passing.
  - **Coach, don't drive:** does NOT edit the developer's tests or run the suite unasked
    on a QUESTION; writes the failing test then stops on an explicit COMMAND
    (`plugins/lz-tdd/skills/lz-red/SKILL.md` "Coach by default" clause).
  Reserve an LLM-judge / grader pass ONLY for the judgment-heavy dimensions where a scripted
  match is insufficient: "is THIS genuinely the right next test for the scenario" and "is
  the asserted target observable behavior rather than implementation detail". Each scenario
  pins a known-correct answer sourced from a shipped `lz-red` reference example (low
  authoring risk, no re-derivation). Mirrors Phase 5 / 11 "deterministic first, judge only
  where a set-match is insufficient". Rejected alternatives (see DISCUSSION-LOG.md):
  single-best-move set-match (brittle -- penalizes correct-but-alternative next tests, the
  Phase-11 strict-single-best-fit failure mode); holistic LLM-judge-only rubric (weakest
  reproducibility + judge-bias risk across iterations, the analog of Phase 11's rejected
  lenient-only approach). Escalated because it is HIGH-impact (EVL-02's core "if everything
  else fails, this must be correct" deliverable) + NOT-high-confidence (the dimensional
  decomposition and the deterministic-vs-judge split are genuinely new for open-ended RED
  coaching; lz-refactor was a single name+layer set-match).

### RED-behavior scenario sourcing (EVL-02)
- **D-06:** Source EVL-02 scenarios PRIMARILY from the shipped `lz-red` reference examples
  so ground truth is already proven: the `three-laws-and-test-selection.md` examples
  (starter case, one small step, triangulation), the `test-structure-and-assertions.md`
  examples (AAA / GWT, four pillars, assert observable behavior), `naming.md`, the three
  `testing-stance/` leaves (functional-core / message-matrix / seams-and-legacy -- each
  drives a different assertion style), `vitest-typescript-mechanics.md` (fail-for-the-
  right-reason), and the `SKILL.md` worked example. Cover a representative spread: a
  new-behavior starter-case scenario, a triangulation scenario, an assertion-target-choice
  scenario per stance (output / state / communication), a fail-for-the-right-reason
  scenario (a test that would pass immediately or fail on a compile error), a
  coach-don't-drive scenario (a bare command vs. a question), and at least one CLASSIFY-FIRST
  boundary scenario where a naive reading would hand off to `lz-tpp` (green) or `lz-refactor`
  (refactor) but the correct move is a RED test -- the discriminating test for step 1 of the
  coach procedure and the EVL-02 mirror of EVL-01's three-way boundary.

### Scoring, sampling, and reliability metrics
- **D-07:** Run each behavior scenario and each trigger query >= 3x. Compute and report
  **Pass@k and Pass^k** (k = 1, 3, 5, and total run count) per eval and overall, per the
  CLAUDE.md skill-creator workflow rule (Pass@k optimistic = at-least-1-of-k passes;
  Pass^k conservative = all-k pass). Flag saturated / non-discriminating assertions
  (Pass@1 = 1.0 for both configs) as replacement candidates. **Wait for ALL run-completion
  notifications before grading** -- `total_tokens` / `duration_ms` arrive only at
  completion and cannot be recovered later; persist as each arrives (memory
  `skill-creator eval` workflow rule). Include >= 1 review agent with a neutral
  from-scratch brief (unbiased-beats-primed, memory `unbiased-review-beats-primed`) so
  grader / rubric bugs are caught, not confirmed.

### Pass bars (SOFT, tunable, non-blocking)
- **D-08:** Trigger target is the 0.0.1 / 0.0.2 bar: **100% recall / 100% specificity**
  (ROADMAP SC1), with the sibling near-misses (both `lz-tpp` and `lz-refactor`) staying
  quiet AND the reciprocal RED spot-check clean (D-03). Behavior with-skill correct-move
  Pass@1 high AND clearly beating the unaided baseline. Bars are SOFT (planner may adjust
  with evidence). Missing a bar triggers AT MOST the D-09 tuning pass -- it NEVER reopens
  Phases 15-19. If the skill already meets the bars, no tuning pass is applied and the
  evals stand as a validation record (the Phase-5 / Phase-11 outcome: no tuning needed).

### Tuning pass: scope + non-blocking discipline (SC3)
- **D-09:** AT MOST ONE tuning pass, tightly bounded, and ONLY if evidence warrants.
  Description: apply a widened / tuned `description` to `SKILL.md` frontmatter ONLY if it
  beats the current one on a HELD-OUT trigger set (show before / after + scores) -- the
  ROADMAP SC3 condition is "tuned only if specificity drops". Behavior: a bounded wording
  tweak to the `SKILL.md` coach decision procedure / description ONLY if a scenario exposes
  a real routing / RED-move defect -- NO new reference files, NO re-authoring LOCKED
  reference content (all references + the testing-stance leaves stay frozen), NO scope
  expansion. Any `SKILL.md` edit gets its OWN subagent review (>= 1 unbiased from-scratch)
  before acceptance (memory `agent-skill-instruction-changes-need-review`), and
  `/reload-plugins` is a human ship action afterward (memory
  `reload-plugins-after-oracle-agent-changes`). Single-pass discipline: do NOT run
  self-feeding re-eval loops beyond the tool's own bounded iterations; once the eval +
  optional tuning pass is committed, the phase is complete.

### Eval-artifact location + git hygiene
- **D-10:** Everything lives under `.claude/skills/lz-red-workspace/` (the skill-creator
  workspace convention, alongside the existing RED content gate) -- eval sets
  (`evals/trigger-eval.json`, `evals/evals.json` or the phase's chosen names), the vendored
  harness (`tools/skill-creator-eval/`), iteration run dirs, orchestration scripts, and an
  `EVAL-RESULTS.md` summary. The generic root-`.gitignore` rules for
  `.claude/skills/*-workspace/` already track the eval record (sets, benchmark, results,
  tools) and drop bulky raw outputs / transcripts / caches -- reused as-is (no per-skill
  gitignore edits). Explicitly NOT under `plugins/lz-tdd/skills/lz-red/` (that ships with
  the plugin -- no build deps there per REQUIREMENTS Out of Scope) and NOT under
  `.planning/`. A D-09 tuning pass is the ONLY change that writes back into `plugins/`.

### Execution gate (build in-plan; halt before the run)
- **D-11 [HARD GATE]:** The plan builds ALL eval assets (sets, scenarios, assertions,
  vendored harness, orchestration scripts, the reciprocal-spot-check config) but MUST HALT
  before actually RUNNING the evals or any description-optimization loop -- the run spends
  tokens via `claude -p` and is a user-gated action (standing memory `eval-run-approval-gate`).
  Present the ready-to-run command(s) and wait for explicit user approval before execution.
  (Token spend is on the Claude plan, NOT a separate metered pool, so no paid-consult
  confirmation is needed -- but the run itself is still gated.)

### Claude's Discretion (deferred to research / planning)
- Exact eval-query wording and the exact query / scenario counts within the D-02 / D-06
  posture (>= skill-creator minimums; edge-case-focused).
- Exact assertion text and which dimensions are scripted vs judged within the D-05-RUBRIC
  split (deterministic mechanical dimensions first; judge only the two judgment-heavy ones).
- Whether the reciprocal RED spot-check (D-03) reuses the exact `lz-red` should-trigger
  prompts verbatim or a curated subset; exact workspace directory naming / layout under
  `lz-red-workspace/`.
- Whether EVL-01 and EVL-02 are one plan or split into two; whether behavior runs execute
  in parallel or series (series is fine if timeouts bite).
- How many net-new behavior scenarios to add beyond the leaf-sourced ones; whether to run a
  standalone measurement around any D-09 tuning.
- The Windows / native harness env specifics (nx not involved here; the workspace runs plain
  `node` + the vendored Python `run_eval` under the native fix).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & success criteria (PRIMARY)
- `.planning/REQUIREMENTS.md` -- EVL-01, EVL-02 (the two Phase-20 requirements), the
  "late / non-blocking" framing, and the "Out of Scope" table (no new repo build deps;
  eval-validation deps live only in the dev-only workspace).
- `.planning/ROADMAP.md` -> "Phase 20: Skill-Effectiveness Evals" -- goal and the three
  Success Criteria (SC1 trigger recall / specificity INCLUDING the three-way cross-skill
  boundary at the 100% / 100% bar; SC2 RED-behavior correct-move vs unaided baseline; SC3
  dev-only workspace + at-most-one tuning pass tuned only if specificity drops).

### The Phase-11 + Phase-5 analogs (the proven templates for THIS phase)
- `.planning/milestones/lz-tdd@0.0.2-phases/11-skill-effectiveness-evals/11-CONTEXT.md` --
  the direct template: D-01 (vendored native-fixed harness + run config), D-02 (trigger set
  design + sibling-seam near-misses), D-03 (skill-creator behavior posture), D-04-RUBRIC
  (the ESCALATED hybrid rubric this phase's D-05-RUBRIC extends to RED's open-ended move),
  D-06 (Pass@k / Pass^k + wait-for-all + unbiased reviewer), D-08 (tuning discipline), D-09
  (workspace location), D-10 (build-then-halt execution gate).
- `.planning/milestones/lz-tdd@0.0.2-phases/11-skill-effectiveness-evals/` SUMMARY +
  LEARNINGS + VALIDATION + REVIEW -- the lz-refactor eval build's lessons (grader design,
  three-way delta groundwork, the vendored-rig copy mechanic).
- `.planning/milestones/lz-tdd@0.0.1-phases/05-skill-effectiveness-evals/05-CONTEXT.md`
  (and its RESEARCH / SUMMARY / LEARNINGS) -- the ORIGINAL native-harness pivot, the
  three run_eval bug fixes, the num-workers / Ponytail / MCP run-config correction that
  killed the false 8%-recall artifact, and the EVAL-RESULTS.md format.

### The WORKING rigs to mirror (copy, do not re-fix)
- `.claude/skills/lz-refactor-workspace/` -- the FRESHEST working rig: `check-evals.mjs`
  (build-time trigger-set lint, fail-closed), `eval-status.mjs`, `grade-run.mjs`,
  `grade-reference.mjs`, `evals/trigger-eval.json`, `evals/evl02-scenarios.json`,
  `evals/evals.json`, `baseline/` + `after/` trigger-result chunks, `iteration-1/`
  with_skill / without_skill run dirs, `EVAL-RESULTS.md`. Copy the vendored
  `tools/skill-creator-eval/` and the orchestration `.mjs` scripts into
  `lz-red-workspace/` and re-point them at the `lz-red` skill + RED eval data.
- `.claude/skills/lz-tpp-workspace/` -- the original Phase-5 rig (the same scripts one
  generation back) if a cleaner reference is needed.

### Skill under test + ground-truth sources (LOCKED -- do NOT modify except a D-09 tuning)
- `plugins/lz-tdd/skills/lz-red/SKILL.md` -- the `description` (`:3-15`, EVL-01 target,
  incl. the explicit `lz-tpp` and `lz-refactor` "Do NOT use" seam clauses) and the 6-step
  coach decision procedure + coach-by-default clause (`:52-125`, EVL-02 / D-05-RUBRIC
  behavior ground truth). The tsc-strict `applyDiscount` worked example (`:96-117`) is the
  canonical fail-for-the-right-reason shape.
- `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` -- selection
  moves (running test list, one small step, degenerate / starter case, triangulation);
  primary EVL-02 selection-scenario source.
- `plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md` -- AAA / GWT,
  the four pillars, assert observable behavior, F.I.R.S.T. baseline; structure +
  assertion-target scenario source.
- `plugins/lz-tdd/skills/lz-red/references/naming.md` -- behavior / BDD naming; naming
  assertions.
- `plugins/lz-tdd/skills/lz-red/references/testing-stance/README.md` + the three leaves
  (`functional-core.md`, `message-matrix.md`, `seams-and-legacy.md`) -- the stance router;
  each leaf drives a different assertion style (output / state+communication /
  characterization), the source for the per-stance assertion-target scenarios.
- `plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md` -- Vitest 4.x
  RED mechanics + fail-for-the-right-reason; source for the false-green / compile-error
  scenarios.
- `plugins/lz-tdd/skills/lz-red/references/anti-patterns.md` +
  `plugins/lz-tdd/skills/lz-red/references/principle-backing.md` -- anti-pattern fixes +
  source-to-recommendation backing (rationale-quality judging).

### The sibling skills (three-way boundary ground truth -- D-03)
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` -- the green-step `description`; its should-trigger
  territory = `lz-red` near-misses AND the reciprocal-spot-check subject (must stay quiet on
  RED prompts).
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` -- the refactor-step `description`; same role
  for the refactor seam.

### The existing lz-red-workspace (additive target)
- `.claude/skills/lz-red-workspace/` -- already hosts the Phase-16 content gate
  (`tools/check-red-references.mjs`), the tsc extractor (`extract-samples.mjs`), `samples/`,
  and `package.json` / `tsconfig.json`. Eval assets are ADDITIVE here; do NOT disturb the
  content gate or extractor.

### Project constraints
- `CLAUDE.md` (project + global) -- the "skill-creator workflow" rules: MUST compute /
  report Pass@k / Pass^k per eval and overall (formulas + k values); MUST wait for all
  completion notifications before grading; use the session model id for trigger evals;
  include >= 1 unbiased-from-scratch reviewer; NEVER run skill evals / optimization loops
  (`claude -p` spend) without explicit user approval (prep is fine, HALT before execute --
  D-11); ASCII-only committed output (`->`, straight quotes, no emojis / em-dashes);
  `git grep` / `rg` for search; npm default. Global memory: `eval-run-approval-gate`,
  `skill-creator-eval-windows-native-fix`, `eval02-subagent-orchestration-mechanic`,
  `unbiased-review-beats-primed`, `agent-skill-instruction-changes-need-review`,
  `reload-plugins-after-oracle-agent-changes`.
- `AGENTS.md` (project) -- public-repo hygiene: maintainer work-email + its bare domain must
  never appear in any committed file (eval sets, scripts, results); allowlist-inversion, never
  encode the forbidden value as a needle.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.claude/skills/lz-refactor-workspace/tools/skill-creator-eval/` -- the vendored
  native-fixed harness; copy it into `lz-red-workspace/tools/` rather than re-fixing the
  upstream bugs. The orchestration `.mjs` scripts (`grade-run.mjs`, `eval-status.mjs`,
  `check-evals.mjs`, `grade-reference.mjs`, plus the merge-judge / spec-chunk flow) are
  direct templates for the `lz-red` eval run.
- The shipped `lz-red` `references/` + `SKILL.md` already contain proven, `tsc --strict`-
  clean examples and the exact coach-procedure dimensions -- lift EVL-02 scenarios and their
  per-dimension ground truth from them rather than inventing.
- `.claude/skills/lz-red-workspace/` already exists (Phase-16 content gate + tsc extractor +
  `package.json` / `tsconfig.json`); the eval assets are additive under the same workspace root.
- `EVAL-RESULTS.md` from Phases 5 + 11 is the format template for the Phase-20 results
  summary, including the correct run-config caveat (serial / Ponytail-off / MCP-stripped /
  session-model).

### Established Patterns
- Eval material lives under `.claude/skills/*-workspace/` (git-tracked record; bulky raw
  outputs gitignored; PR-filtered off the shipped surface). The shipped `plugins/` surface
  stays lean (progressive-disclosure + no-build-deps hygiene). D-10 applies it here.
- ASCII-only committed content (`->`, straight quotes) -- repo convention across all phases.
- Pass@k / Pass^k reporting + wait-for-all-notifications + unbiased reviewer =
  project-standard skill-creator execution discipline (CLAUDE.md).
- Build-then-halt: eval assets are built in-plan; the metered run is user-gated (D-11).
- Orchestrator runs agent gates: the behavior-eval subagents + the unbiased reviewer are
  spawned by the orchestrator, not the `gsd-executor` (which has no Agent tool -- memory
  `gsd-executor-cannot-spawn-subagents`); plan them as orchestrator steps after the executor
  builds the deterministic assets.

### Integration Points
- Evals consume the shipped skill via its path (`plugins/lz-tdd/skills/lz-red/`) and its
  `description`; triggering is model-specific, so evals run on the session model
  (`claude-opus-4-8`).
- The three-way seam is a LIVE concern -- all three skills (`lz-tpp`, `lz-refactor`,
  `lz-red`) ship in the same plugin. EVL-01's cross-skill delta (D-03) is the main
  Phase-20-specific difference from the two prior single-skill / two-skill eval phases.
- This is the LAST, NON-BLOCKING phase of milestone lz-tdd@0.0.3; it runs after Phase 19
  (closed 2026-07-21) and no phase depends on its output. A D-09 tuning pass is the only
  write-back into `plugins/`.

</code_context>

<specifics>
## Specific Ideas

- Trigger near-misses must be genuinely tricky (share the TDD frame but belong to a sibling):
  the `lz-tpp` green-step prompts ("what minimal change makes this failing test pass") and
  the `lz-refactor` refactor-step prompts ("clean up this duplication, tests are green") are
  the highest-value negatives -- they share TDD / testing vocabulary and must keep `lz-red`
  quiet. Avoid obvious irrelevancies; they test nothing.
- The reciprocal RED spot-check (D-03) is the one piece of coverage no prior phase produced:
  run `lz-tpp` and `lz-refactor` against the RED should-trigger prompts and confirm both stay
  quiet. If either sibling fires on RED intent, that is a D-09 tuning candidate on THAT
  sibling's description -- but bounded and non-blocking like every other finding.
- EVL-02 scenarios anchor on the shipped `lz-red` reference examples so per-dimension ground
  truth is already proven; assertions grade the mechanical dimensions deterministically and
  judge only "right next test" + "behavior-not-implementation" (D-05-RUBRIC).
- The single "if everything else fails, this must be correct" core here is the RED-move
  correctness -- choosing / structuring / asserting the next failing test and handing off,
  not driving to green. EVL-02 exists to protect exactly that.
- `run_eval` / the description-optimization loop spend tokens on the Claude plan via
  `claude -p` (NOT a separate metered pool), so no paid-consult confirmation gate is needed
  -- but the RUN itself is still user-gated (D-11).
- Never write the maintainer work-email or its bare domain into any eval set, script, or
  results file (AGENTS.md; allowlist-inversion, never a needle).

</specifics>

<deferred>
## Deferred Ideas

- **Turning the eval sets into a permanent CI / regression gate** -> future; Phase 20 is a
  one-time validation + at-most-one tuning pass, not a standing CI harness (same posture as
  Phases 5 + 11).
- **A full 3x3 reciprocal confusion matrix** across all three skills and a shared RED + green
  + refactor corpus -> rejected now (D-03) as disproportionate; the bounded reciprocal RED
  spot-check covers the one genuinely new risk. Revisit only if a future skill is added or a
  sibling description is materially rewritten.
- **Exhaustive per-reference / per-stance scenario coverage** -> out of scope; EVL-02 is a
  REPRESENTATIVE spread across the coach-procedure dimensions and the three stances, not
  exhaustive coverage. Per-reference correctness is already gated by the Phase-16/17/18
  content gate + oracle-reviewer sweeps.
- **A second / iterative tuning pass or re-authoring reference content on eval findings** ->
  disallowed by SC3 / D-09 (at most one bounded pass; LOCKED content stays frozen). A larger
  content change would be its own future phase / milestone.
- **The type-level (ADV-01) and property-based (ADV-02) RED leaves, outside-in / acceptance
  RED (FUT-OUTSIDE-IN), and multi-language example sets (FUT-02)** -> post-0.0.3 Future
  Requirements, unchanged; not eval'd here.
- **Git tag / GitHub Release for 0.0.3** -> already handled as the post-Phase-19 ship task;
  not Phase 20 scope.

### Reviewed Todos (not folded)
None -- `todo.match-phase 20` returned 0 matches.

</deferred>

---

*Phase: 20-skill-effectiveness-evals*
*Context gathered: 2026-07-21*
