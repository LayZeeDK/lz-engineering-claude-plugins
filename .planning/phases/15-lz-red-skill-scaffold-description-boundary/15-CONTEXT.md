# Phase 15: lz-red Skill Scaffold & Description Boundary - Context

**Gathered:** 2026-07-18
**Status:** Ready for planning
**Mode:** --auto --analyze --chain (autonomous single pass; gray areas auto-resolved from research + Phase 6 precedent)

<domain>
## Phase Boundary

Deliver the invocable dual-mode `lz-red` skill SKELETON, mirroring the shipped
lz-tpp and lz-refactor scaffolds. In scope:

- The skill directory `plugins/lz-tdd/skills/lz-red/` and a lean `SKILL.md` router
  with dual-mode-by-omission frontmatter (`name` + `description` only; `name`
  equals the directory).
- A three-way-guarded triggering `description` (v1) that auto-triggers on RED-phase
  intent and carries reciprocal near-miss exclusion clauses against lz-tpp (make the
  failing test pass) and lz-refactor (restructure passing code), within the char cap.
- A progressive-disclosure `references/` tree of STUBS -- each stub carries a per-doc
  content contract (what it will contain + which requirement IDs + which phase fills
  it), no real prose/examples yet. Flat docs plus one `testing-stance/` subdir.
- Gate: `claude plugin validate .` exits 0.

Explicitly NOT in this phase (fixed by ROADMAP): reference content authoring
(Phases 16-17), the numbered coach procedure + stance-router logic + lz-tpp seam
wiring (Phase 18), plugin.json version bump / README / CHANGELOG (Phase 19), eval
workspace + `.oracle/` book setup + description tuning (Phases 16/20). This phase
produces the skeleton and the triggering description only; downstream phases fill it.

</domain>

<decisions>
## Implementation Decisions

Requirements SKL-01, SKL-02, SKL-03 (see REQUIREMENTS.md) are the locked scope.
The decisions below are the HOW, auto-resolved from `.planning/research/ARCHITECTURE.md`
and the direct 0.0.2 precedent (Phase 6 scaffolded lz-refactor the same way). All
were rated HIGH-confidence (research explicit + Phase 6 template + ROADMAP scope), so
none were escalated in this `--auto` pass.

### Reference structure and stubs (SKL-02)

- **D-01:** Adopt the `ARCHITECTURE.md` reference layout verbatim -- flat single-topic
  docs plus one `testing-stance/` navigation subdir, clustered by DECISION-PROCEDURE
  STEP (not by source author, not 1:1 with phases). The 10 stub files to create:
  - `references/three-laws-and-test-selection.md`
  - `references/test-structure-and-assertions.md`
  - `references/testing-stance/README.md` (navigation index: detection signals + route table)
  - `references/testing-stance/functional-core.md` (Bernhardt FCIS)
  - `references/testing-stance/message-matrix.md` (Metz + Owen query/command matrix)
  - `references/testing-stance/seams-and-legacy.md` (Feathers seams + characterization)
  - `references/naming.md`
  - `references/anti-patterns.md`
  - `references/vitest-typescript-mechanics.md`
  - `references/principle-backing.md`
  Rationale: this is lz-tpp's flat grain plus lz-refactor's proven
  index-is-navigation-only + leaf-carries-content convention for the one branchy part
  (the router). Files that later span >1 phase are acceptable -- phases co-edit; a
  single decision doc must NOT be fragmented per-source (ARCHITECTURE Anti-Pattern 1).
- **D-02:** Each stub is a THIN content contract, not empty and not full content: a
  title + a scoped bullet list of what the doc will contain + the requirement IDs it
  satisfies + the source cluster + a "Populated in Phase NN" marker. Mirrors Phase 6's
  "each references/ stub carries its per-entry content contract." No prose synthesis
  and no TS examples land in Phase 15 (those are Phases 16-17, gated by the oracle
  clean-room + tsc --strict-clean).
- **D-03:** Do NOT over-decompose (no per-author files) and do NOT create an eval
  workspace or add `.oracle/` books in this phase (Phases 20 and 16 respectively).

### SKILL.md router body (SKL-01, SKL-02)

- **D-04:** Ship the router body only -- frontmatter (name + description), a "Two modes"
  (coach / reference) section, the RED-vs-green(lz-tpp)/refactor(lz-refactor) seam
  intro, a one-line "listen to the tests" / heuristic-not-law caveat, and a
  Reference-material pointer section linking every stub. The numbered coach decision
  procedure + stance-router detail is a LABELED PLACEHOLDER deferred to Phase 18
  (exactly as Phase 6 left a Phase-9 coach placeholder in lz-refactor). Target near
  lz-tpp's size (~80-140 lines), well under the < 500 cap.
- **D-05:** Frontmatter is dual-mode-by-omission: omit `disable-model-invocation` and
  `user-invocable` so the skill both auto-triggers (coach) and answers explicit
  `/lz-tdd:lz-red` (reference). No `version`, no `allowed-tools` (pure guidance skill).

### Triggering description (SKL-03 -- the core deliverable)

- **D-06:** Draft a v1 three-way-guarded `description` now. Positive trigger:
  choose/write the next FAILING (red) unit test, keep a test list, pick the next test,
  adaptively match the codebase's testing stance. Language-agnostic (TypeScript/Vitest
  specificity lives in the body/references, matching both siblings). Two reciprocal
  near-miss EXCLUSION clauses in the tail: "make a failing test pass" -> lz-tpp;
  "restructure/clean up passing code" -> lz-refactor.
- **D-07:** Size to the ~1000-1536-char load-bearing window (truncation at 1536; see
  `[[skill-description-char-cap]]`); reserve the tail for the two exclusion clauses.
  lz-refactor's is 774 chars, lz-tpp's ~750 -- lz-red may run longer because it carries
  TWO exclusions, but keep the positive-trigger sentence first.
- **D-08:** Empirical trigger tuning is DEFERRED to Phase 20 (EVL-01), exactly as
  lz-refactor deferred SKEL-03 tuning to Phase 11. Phase 15 ships a reasoned v1; the
  cross-skill (three-way boundary) trigger eval and any `description` re-tuning happen
  in Phase 20. Do not pull eval work forward.

### Version and manifest (scope boundary)

- **D-09:** Leave `plugins/lz-tdd/.claude-plugin/plugin.json` at `0.0.2` in Phase 15.
  The bump to `0.0.3` + description/keywords extension is DST-01 = Phase 19
  (Distribution). `claude plugin validate .` exits 0 without a bump because skills are
  auto-discovered from the plugin root -- no manifest edit is needed to register lz-red.
  This deliberately OVERRIDES `ARCHITECTURE.md`'s "Phase A bumps plugin.json version":
  the ROADMAP phase split is fixed, and 0.0.2 bumped the version in the Distribution
  phase (Phase 10), not the scaffold phase (Phase 6).
- **D-10:** `.claude-plugin/marketplace.json` is UNCHANGED (version deliberately omitted
  there; skills auto-discovered).

### Claude's Discretion

- Exact stub-file wording of the per-doc content contracts (D-02) -- the executor drafts
  them from the requirement clusters; content itself is Phases 16-18.
- Exact v1 `description` wording within the D-06/D-07 constraints -- reasoned draft;
  Phase 20 owns empirical validation.
- Whether Phase 15 uses a Nyquist "instrument-first" wave (a `claude plugin validate .`
  gate is the natural Wave-0 check); planner's call, but a validate gate is mandatory.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor) MUST read these before planning
or implementing.**

### Phase-15 scaffold blueprint (primary)
- `.planning/research/ARCHITECTURE.md` -- the authoritative scaffold spec: recommended
  project structure (the 10-file reference layout), dual-mode-by-omission frontmatter,
  inline-coach-procedure pattern, adaptive stance router, description budget, the
  New/Modified/Unchanged file list, and the anti-patterns. HIGH confidence (both
  siblings read on disk).
- `.planning/research/SUMMARY.md` -- research synthesis across STACK/FEATURES/PITFALLS.
- `.planning/research/FEATURES.md` -- feature-level detail for the RED coach (feeds
  Phases 16-18; skim for Phase 15 stub content contracts).
- `.planning/research/PITFALLS.md` -- landmines (description triggering, validate,
  progressive disclosure); relevant to the description (D-06/07) and the validate gate.
- `.planning/research/STACK.md` -- Claude Code plugin/skill format facts.

### Scaffold precedents on disk (mirror these exactly)
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (81 lines) -- the size/frontmatter/two-mode
  target; the reference-pointer section shape.
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (180 lines) -- dual-mode-by-omission
  frontmatter, the description seam/near-miss pattern (the direct model for D-06's
  reciprocal exclusions), the index-is-navigation-only convention for `testing-stance/`.
- `plugins/lz-tdd/skills/lz-refactor/references/smells.md` -- the navigation-only index
  pattern the `testing-stance/README.md` stub should mirror.
- `plugins/lz-tdd/.claude-plugin/plugin.json` -- current at 0.0.2; the D-09 boundary
  (do NOT edit in Phase 15).

### Requirements and scope
- `.planning/REQUIREMENTS.md` SKL-01, SKL-02, SKL-03 -- the locked Phase-15 requirements;
  the Out-of-Scope table (no build deps, coach-don't-drive, no imposed testing school).
- `.planning/ROADMAP.md` Phase 15 Success Criteria (4 items) + the Phase 16-20 split
  (what is DEFERRED out of Phase 15).
- `.planning/PROJECT.md` Key Decisions -- the locked adaptive-stance-router decision, the
  source-access / clean-room `.oracle/` model, the DHH hard-ban, the seam tech debt.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **lz-tpp / lz-refactor SKILL.md**: copy the frontmatter shape, the "Two modes"
  section, and the reference-material pointer list; adapt wording to the RED step.
- **lz-refactor `description`**: the reciprocal seam/exclusion clause is a direct
  template for lz-red's two-way exclusion (green -> lz-tpp, refactor -> lz-refactor).
- **lz-refactor `references/smells.md` + catalog READMEs**: the
  index-is-navigation-only + leaf-carries-content pattern for `testing-stance/README.md`
  and its three leaves.

### Established Patterns
- Skills are auto-discovered from the plugin root -- adding lz-red needs NO manifest
  edit (validate still exits 0). This is why D-09 can defer the version bump.
- Progressive disclosure: SKILL.md router links, never inlines; stubs are thin; the
  index is navigation-only. Restating reference content in SKILL.md is ARCHITECTURE
  Anti-Pattern 2 -- avoid.
- Phase 6 (lz-refactor scaffold) is the direct precedent: dual-mode-by-omission router
  + stubs with content contracts + a scaffold-phase description with tuning deferred +
  a Wave-0 `claude plugin validate .` gate. Phase 15 repeats that shape at lz-tpp grain
  (no large catalog).

### Integration Points
- lz-red <-> lz-tpp and lz-red <-> lz-refactor seams live in the `description`
  exclusion clauses (Phase 15) and, later, the step-1 classify + step-8 handoff
  (Phase 18). The REVERSE `lz-tpp -> lz-red` pointer is Phase 18 (SEAM-02) -- do NOT
  edit lz-tpp in Phase 15.

</code_context>

<specifics>
## Specific Ideas

- The `description` MUST fire on RED-phase / next-failing-test / testing-stance /
  triangulation prompts and stay quiet on green-step and refactor near-misses; the
  three-way boundary is the novel triggering challenge (validated in Phase 20).
- SKILL.md target ~80-140 lines (near lz-tpp's 81), well under the < 500 hard cap.
- Every reference stub names the requirement IDs it will satisfy and the phase that
  fills it, so Phases 16-18 have unambiguous targets and links resolve from day one.

</specifics>

<deferred>
## Deferred Ideas

- Reference content authoring (own-words facts, TS/Vitest examples) -> Phases 16-17.
- Numbered coach procedure + stance-router logic + lz-tpp forward seam + reverse
  `lz-tpp -> lz-red` pointer (SEAM-02) -> Phase 18.
- plugin.json 0.0.3 bump + README + CHANGELOG + `--strict` validate + validator/reviewer
  PASS -> Phase 19.
- `.oracle/` owned-book setup (RCM Clean Code, Metz 99 Bottles JS Ed) + source
  distillation -> Phase 16.
- Eval workspace (`.claude/skills/lz-red-workspace/`) + trigger/behavior evals +
  description tuning -> Phase 20.
- Advanced RED leaves (type-level `expectTypeOf`, property-based `fast-check`) -> post-0.0.3
  (ADV-01/ADV-02, Future Requirements).

None of the above were scope creep from discussion -- they are the ROADMAP's own later
phases, recorded here so the planner does not pull them into Phase 15.

</deferred>

---

*Phase: 15-lz-red-skill-scaffold-description-boundary*
*Context gathered: 2026-07-18*
