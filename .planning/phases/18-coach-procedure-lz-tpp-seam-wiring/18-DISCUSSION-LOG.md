# Phase 18: Coach Procedure & lz-tpp Seam Wiring - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-20
**Phase:** 18-coach-procedure-lz-tpp-seam-wiring
**Mode:** --analyze --auto --chain (autonomous single pass; no interactive AskUserQuestion; recommended
option auto-locked per gray area; trade-off tables logged here for the audit trail)
**Areas discussed:** Coach procedure placement, Three Laws provenance tier, Stance-routing override,
lz-tpp reverse-pointer seam, VIT-02 SKILL.md worked example, Instrument-first extension

Each gray area was rated on IMPACT x CONFIDENCE per the --auto trap-quadrant rule. None landed
HIGH-impact + NOT-high-confidence, so all were auto-locked (none escalated).

---

## Coach procedure placement (D-01)

| Option | Description | Selected |
|--------|-------------|----------|
| Inline in SKILL.md | Replace the Phase-18 placeholder with the numbered procedure; matches lz-tpp + lz-refactor precedent; reached with no extra load | SELECTED |
| New references/coach-procedure.md leaf | Keeps SKILL.md tiny but breaks the pattern and hides the always-active procedure behind a lazy load | |

**Auto-selected:** Inline in SKILL.md (recommended). IMPACT high, CONFIDENCE high (SKL-02 lean-router
+ explicit reserved placeholder + two shipped precedents).
**Notes:** Est. ~130-180 lines, still well under the 500 cap and near lz-refactor's 181.

---

## Three Laws provenance tier (D-05) -- the one genuine judgment call

| Option | Description | Selected |
|--------|-------------|----------|
| Owned; oracle-verified vs Clean Code Ch. 9 | Ch. 9 is owned + opens with the Three Laws; LAW-02's "only enough to fail" is already an owned row; honest per 17.1 D-05; gate-confirmed | SELECTED |
| No-oracle high-confidence core | No gate needed, but under-claims a verifiable owned source and is inconsistent with the adjacent owned row | |

**Auto-selected:** Owned; oracle-verified against Clean Code Ch. 9 (recommended), gate-confirmed via
the orchestrator-driven oracle-reviewer -- falls back to no-oracle only if the gate finds Ch. 9 does
not cover a Law statement. IMPACT medium-high, CONFIDENCE high (source owned + contains the Three
Laws + LAW-02 already owned + reversible at the gate).
**Notes:** The Law-3-as-lz-tpp-handoff reframe is lz-red orchestration (no-oracle). Same
reference-carries-content / SKILL.md-carries-orchestration split as lz-refactor Phase 9.

---

## Stance-routing override phrase (D-07)

| Option | Description | Selected |
|--------|-------------|----------|
| Natural-language override | Honor a plain-language stance preference ("test this as a functional core"); no invented syntax; mirrors lz-tpp/lz-refactor | SELECTED |
| Invented override keyword / CLI flag | Rigid, and ROADMAP SC2 explicitly says "no CLI flag" | |

**Auto-selected:** Natural-language override (recommended). IMPACT low-medium, CONFIDENCE high
(ROADMAP SC2 verbatim + sibling precedent).
**Notes:** The coach still states the route it took, whether auto-routed or overridden.

---

## lz-tpp reverse-pointer seam (D-09 / D-10)

| Option | Description | Selected |
|--------|-------------|----------|
| Both pointers in one edit + orchestrator review (>=1 unbiased) | Add `-> lz-red` and deferred `-> lz-refactor` in one edit; a short seam pointer section symmetric with the existing sibling sections; reviewed before acceptance | SELECTED |
| Only `-> lz-red` now, defer `-> lz-refactor` | Rejected: ROADMAP SC4 requires both in the same edit | |

**Auto-selected:** Both pointers, one edit, orchestrator-driven subagent review before acceptance
(recommended). IMPACT high (edits a live shipped skill), CONFIDENCE high (locked by SC4; symmetric
with existing sibling sections).
**Notes:** gsd-executor cannot spawn the reviewer -> orchestrator gate after the blind edit returns.
Making it live requires a human /reload-plugins, deferred to ship (Phase 19).

---

## VIT-02 SKILL.md worked example (D-11)

| Option | Description | Selected |
|--------|-------------|----------|
| One compact tsc-strict Vitest RED walkthrough in the procedure | Closes the VIT-02 SKILL.md clause Phase 17 deferred here (17-CONTEXT D-10); covered by the tsc extractor + a SKILL.md fence guard | SELECTED |
| No SKILL.md example (references only) | Rejected: leaves the VIT-02 "throughout SKILL.md" clause open | |

**Auto-selected:** One compact worked example in the procedure (recommended). IMPACT medium,
CONFIDENCE high (D-10 pre-decided; tsc-strict gate model established).
**Notes:** Exact example = executor discretion within tsc --strict.

---

## Instrument-first extension (D-13)

| Option | Description | Selected |
|--------|-------------|----------|
| Extend check-red-references.mjs in place | Flip the four Phase-18 deferral guards into content assertions; add SKILL.md coach tokens + fence + lz-tpp pointer guard; keep the D-05 honesty gate | SELECTED |
| New sibling checker | Rejected: D-13 precedent is extend-in-place, no sibling |

**Auto-selected:** Extend in place (recommended). IMPACT medium, CONFIDENCE high (established model).
**Notes:** Whether the checker gains a SKILL.md FILES entry vs a separate block, and a fresh Wave-0
RED baseline, is the planner's call; tsc gate + no-verbatim scan non-negotiable; no build dep enters
plugins/lz-tdd.

---

## Claude's Discretion

- Exact own-words wording of the Three Laws spine (oracle-reviewer gates the owned surface), the
  routing/override phrasing, and the classify-first / handoff prose.
- Exact minimal tsc-strict Vitest worked example in SKILL.md.
- Exact placement + phrasing of the lz-tpp reverse-pointer section, subject to the review gate.
- Plan / wave breakdown (instrument -> owned Three-Laws surface -> SKILL.md procedure + example ->
  lz-tpp seam edit -> finalize gate).
- Whether the checker adds a SKILL.md FILES entry or a separate SKILL.md check block.

## Deferred Ideas

- DST-01/02/03 (version bump, docs, validators, hygiene sweep) + making the shipped-skill edits live
  via /reload-plugins -> Phase 19.
- EVL-01/02 (trigger + RED-behavior evals, description tuning) -> Phase 20.
- ADV-01 (type-level RED) + ADV-02 (property-based RED) -> Future Requirements (post-0.0.3).
- FUT-METZ-REFACTOR (lz-refactor Metz layer) -> post-0.0.3 lz-refactor milestone.
