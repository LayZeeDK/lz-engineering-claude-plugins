# Phase 21: Applied RED Eval in Real OSS Repos (multi-dimensional, 3-arm) - Context

**Gathered:** 2026-07-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Build (and, in a later user-gated step, run) an APPLY-based, multi-dimensional,
3-arm eval that validates `lz-red` on real applied RED work: driving the next
failing (red) test in real OSS TypeScript repos with short, basic, human-style
prompts. The graded artifact is the produced test file / diff, not coaching
prose. This mirrors the lz-refactor Phase 13/14 apply evals and strengthens the
first-pass Phase-20 EVL-02 coaching-prose record before milestone close.

**In scope:** the apply harness (reuse of the lz-refactor rig), arm design,
dimension/grading design, EVL-03 formalization at plan time, instrument-first
build + zero-spend selfcheck.
**Out of scope:** the metered apply run itself (user-gated, D-11); GREEN/REFACTOR
behavior; new build deps in `plugins/lz-tdd`; the mattpocock competitor round
(later, contingent).

**Gate boundary:** This discuss/plan/build chain HALTS before any metered
`claude -p` / apply fan-out. The run is a separate, freshly-approved step.
</domain>

<decisions>
## Implementation Decisions

### Target corpus & task shape

- **D-01 (UNRESOLVED -> research-directed; NOT auto-locked):** The specific OSS
  TypeScript repo(s) and the red-test-shaped module(s) are deliberately NOT
  locked here. ROADMAP pins ">= 1 real OSS TypeScript repo (Vitest/Jest)" but
  names none; choosing one is HIGH-IMPACT and not evidence-backed (the `--auto`
  trap quadrant). Directed research task for `gsd-phase-researcher`: propose 2-3
  concrete red-test-shaped targets - a real behavior gap where "the next failing
  test" is genuinely meaningful and a byte-identical short prompt works across
  all arms. Reuse-candidate baseline: the lz-refactor corpus already vendored in
  the workspace (nrwl/nx `@nx/*` packages + the Gilded Rose kata). The planner
  confirms the final target(s) at plan time; the user can steer before the gated
  run.
- **D-02:** The task = drive the NEXT failing (red) test on CURRENT code via a
  short, basic, human-style prompt ("what should I test next here?", "add the
  next test"). The prompt is byte-identical across arms except the target path.
  Grade the produced test file / diff, never coaching prose.
- **D-03:** Precedent-sized small corpus: aim ~2-3 targets x k=3 (mirrors
  lz-refactor cr-emb / cr-rlu / cr-gr at k=3-5); exact count is tuned at the run
  gate for spend. Report Pass@k and Pass^k (k = 1, 3, 5, total).

### Arm mechanics

- **D-04:** THREE own-skill arms in the first rounds: `no_skill` (baseline);
  `with_skill` (real installed plugin present + natural prompt - tests whether
  the description AUTO-TRIGGERS and then helps); `invoke_skill` (prompt
  force-starts with `/lz-tdd:lz-red ...` - isolates content value).
  `with_skill` vs `invoke_skill` surfaces the trigger gap. MUST-AVOID: the
  Phase-20 conflation where "with_skill" was actually force-invoke reading
  SKILL.md from disk - `with_skill` here runs the real plugin via `claude -p`
  for genuine auto-trigger.
- **D-05:** The `mattpocock-skills:tdd` competitor arm is a LATER, CONTINGENT
  round - run only after our own lift is measured, and only because the
  standalone check passed (2026-07-22: no hard sibling dep). Note the scope
  mismatch in the writeup: mattpocock `tdd` is a full red->green loop with an
  interactive seam-confirmation step, vs lz-red's RED-step-only coach. NOT in
  the first fan-out.

### Dimensions: gate vs report

- **D-06 (hard GATE):** Correctness per produced test = tsc `--strict` clean AND
  genuinely RED for the right reason on current code (fails on the asserted
  behavior, not a compile / setup error, not a false green). A run that is not
  correctness-clean does not count as a pass.
- **D-07 (report / compare - lift dims, not pass/fail):** wall-clock time; tool
  usage; token usage (mechanical from stream-json meta); output quality;
  book/source authenticity vs the owned `.oracle/` RED sources (oracle-reviewer,
  DST-04); follows idioms; follows house style; follows TDD RED practices (right
  next test, fail-for-right-reason, assert observable behavior, classify-first,
  lz-tpp handoff).
- **D-08:** SUBSTANCE-ONLY is the headline wherever any vocabulary proxy
  (phrase-set matcher) is used; any full-run vocabulary number is labeled context
  only. (Phase-20 EVL-02 lesson: phrase-set graders measure house vocabulary, not
  substance -> ~3x inflation caught by the unbiased reviewer.)

### Grading mechanics

- **D-09:** Mechanical dims from the stream-json result meta (usage / cost / tool
  histogram / num_turns) via `tabulate-mechanical.mjs`. Graded dims (output
  quality, TDD practices) via blind LLM judges (<= 2 dims per judge, per the
  Phase-20 judge lock). Book authenticity via `oracle-reviewer` against `.oracle/`
  (clean-room, DST-04 - own-words verdicts only cross back). Pass@k + Pass^k per
  eval and overall.
- **D-10:** >= 1 from-scratch UNBIASED reviewer (neutral brief, no prior findings)
  audits the results before they are recorded. Mandatory - the Phase-20 reviewer
  is what caught the vocabulary inflation.

### Harness & build boundary

- **D-11:** Reuse the lz-refactor apply harness at
  `.claude/skills/lz-refactor-workspace/` (`e2e-nx/run-e2e.mjs`,
  `tabulate-mechanical.mjs`, `selfcheck-*.mjs`) + `oracle`/`oracle-reviewer`.
  Adapt for RED: the graded artifact is a produced test (does it compile + fail
  for the right reason), not a refactor diff. Synthetic base, stream-json meta,
  and per-arm tool profiles carry over.
- **D-12:** Build + zero-spend selfcheck freely; the metered apply RUN is
  user-gated (D-11 / [[eval-run-approval-gate]]) - HALT at the run gate for fresh
  approval. Per-run byproducts git-ignored; NO build deps added to
  `plugins/lz-tdd` (dev-only workspace).
- **D-13 (run-time orchestration hygiene, carried from Phase 20):** fan out in
  SMALL waves (user flagged 24-in-flight + the org cap); put an explicit "normal
  mode / stop ponytail" directive in every in-session Agent subagent prompt (the
  env-var lock does not reach subagents); resume spend-limit-killed agents via
  `SendMessage(agentId)`; drive each run in an isolated git-ignored `work/` dir
  (ground-truth nodrive).

### Requirement formalization

- **D-14:** EVL-03 is formalized in `REQUIREMENTS.md` at PLAN time (per ROADMAP),
  mapping the 5 Phase-21 success criteria. The planner does an instrument-first
  build plan (harness + selfcheck GREEN before the gated run).

### Claude's Discretion

- Harness adaptation details (how the RED produced-test grader plugs into
  `run-e2e.mjs`), exact judge prompts, and per-arm tool-profile specifics are for
  the researcher/planner to settle against the reused rig.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Locked design + requirements
- `.planning/ROADMAP.md` (Phase 21 section, ~lines 236-268) - the locked design + 5 success criteria.
- `.planning/REQUIREMENTS.md` (EVL section) - EVL-01/EVL-02 context; EVL-03 to be added at plan time.

### Phase-20 baseline this phase strengthens
- `.claude/skills/lz-red-workspace/EVAL-RESULTS.md` - the Phase-20 EVL-02 record + unbiased-reviewer verdict (substance-only with_skill 0.97 vs baseline 0.87; the vocabulary-inflation caveat).

### Reuse harness (lz-refactor apply rig)
- `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` - the apply harness (synthetic base, stream-json meta, per-arm tool profiles, worktree teardown).
- `.claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs` - the offline zero-spend selfcheck pattern.
- `.claude/skills/lz-refactor-workspace/e2e-angular/tabulate-mechanical.mjs` and `.claude/skills/lz-refactor-workspace/grading/head-to-head/tabulate-mechanical.mjs` - mechanical tabulation (token/cost/tool/lift + Pass@k).
- `.claude/skills/lz-red-workspace/{grade-run.mjs, merge-judge.mjs}` - the Phase-20 RED grader + judge-merge to adapt.

### Precedent (apply-eval pattern)
- `.planning/milestones/lz-tdd@0.0.2-phases/13-*/` and `.../14-*/` - lz-refactor Phase 13/14 apply-eval plans + RESULTS (the pattern being mirrored).

### Skill under test + owned sources
- `plugins/lz-tdd/skills/lz-red/SKILL.md` - the skill being evaluated.
- `.oracle/{clean-code, 99-bottles-2e-js, videos, written-content}/` - owned RED sources for the authenticity dimension; accessed ONLY via `oracle`/`oracle-reviewer` (DST-04).

### Governing memories (CLAUDE.md)
- `lz-skill-eval-design-apply-based-multidim`, `lz-red-evl02-substance-vs-vocabulary`, `eval02-subagent-orchestration-mechanic`, `eval-run-approval-gate`, and the `gsd-discuss-phase --auto` trap.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `run-e2e.mjs` (lz-refactor e2e-nx): apply harness - synthetic base build/teardown, stream-json result meta, per-arm tool profiles, arm fan-out. Primary reuse target for the 3-arm RED apply run.
- `tabulate-mechanical.mjs`: token/cost/tool histogram + distinct-lift + Pass@k/Pass^k tabulation from meta.json + answer.md.
- `selfcheck-*.mjs`: offline zero-spend gates that prove the harness cruxes on borrowed repos left pristine (the build-then-halt boundary).
- `grade-run.mjs` + `merge-judge.mjs` (lz-red-workspace): the Phase-20 RED phrase-set grader + independent-judge merge to adapt for produced-test grading.
- `oracle` / `oracle-reviewer` agents: clean-room book-authenticity gate against `.oracle/` RED sources (DST-04).

### Established Patterns
- Instrument-first RED baseline: build the harness, prove selfcheck GREEN offline, THEN gate the metered run.
- Per-run byproducts git-ignored; each run drives an isolated `work/` dir (ground-truth nodrive).
- `with_skill` requires the real installed plugin (marketplace) for genuine auto-trigger - not reading SKILL.md from disk.

### Integration Points
- `.claude/skills/lz-red-workspace/` holds the Phase-20 eval infra and will hold the Phase-21 apply outputs (iteration-* git-ignored).
- The lz-red plugin must be installed/live for the `with_skill` auto-trigger arm (`/reload-plugins` already run for the shipped 0.0.3 tree).
</code_context>

<specifics>
## Specific Ideas

- Mirror lz-refactor Phase 13 (book authenticity + correctness) and Phase 14
  (competitor comparison) structure explicitly - the 3-own-arm rounds first, the
  mattpocock `tdd` competitor as a later contingent round.
- The single most load-bearing open choice is the OSS target (D-01); everything
  else is steered by the ROADMAP pre-lock.
</specifics>

<deferred>
## Deferred Ideas

- **mattpocock-skills:tdd competitor round** - contingent, only after own lift is measured (D-05). A later Phase-21 round, not a new phase.
- **ADV-01 / ADV-02** (type-level `expectTypeOf` RED; property-based `fast-check` RED) - Future Requirements, post-0.0.3.
- **Milestone close** - `/gsd-complete-milestone lz-tdd@0.0.3` (+ manual archival per the @-scoped version, git tag, GitHub Release) runs only AFTER Phase 21 completes.

### Reviewed Todos (not folded)
None - no pending todos matched this phase.
</deferred>

---

*Phase: 21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-inserted*
*Context gathered: 2026-07-22*
