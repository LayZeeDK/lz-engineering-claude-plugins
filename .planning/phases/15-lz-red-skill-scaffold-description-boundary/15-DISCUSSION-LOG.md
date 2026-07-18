# Phase 15: lz-red Skill Scaffold & Description Boundary - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-18
**Phase:** 15-lz-red-skill-scaffold-description-boundary
**Mode:** --auto --analyze --chain (autonomous single pass; no interactive prompts)
**Areas discussed:** Reference structure & stubs, SKILL.md router body, Triggering description, Version/manifest boundary, Eval/oracle setup timing

> `--auto` note: options below were NOT presented interactively. Each was
> auto-resolved to the recommended option, grounded in `.planning/research/ARCHITECTURE.md`
> and the direct Phase 6 (lz-refactor scaffold) precedent. All gray areas were rated
> HIGH-confidence, so none met the trap-quadrant bar (HIGH-impact + NOT-HIGH-confidence)
> that would require escalating to the user in this pass.

---

## Reference structure & stubs (SKL-02) -> D-01, D-02, D-03

| Option | Description | Selected |
|--------|-------------|----------|
| A: ARCHITECTURE 10-file layout, clustered by decision-step | 7 flat docs + `testing-stance/` README + 3 leaves; proven lz-tpp/lz-refactor grain; links resolve at scaffold; matches Phase 6 stub-upfront | ✓ |
| B: 1:1 phase/requirement files | Each of Phases 16-18 fills whole files | |
| C: Minimal now, defer stubs to content phases | Only SKILL.md + subdir now | |

**Selected:** A. **Notes:** B fragments a single decision doc across sources/phases
(ARCHITECTURE Anti-Pattern 1); C leaves dangling links and violates success-criterion 2
("stubs each carry a per-doc content contract"). Files spanning >1 later phase are
acceptable -- phases co-edit; cohesion is by decision-procedure step. Stubs are THIN
content contracts (D-02); no eval workspace or `.oracle/` books this phase (D-03).

---

## SKILL.md router body (SKL-01, SKL-02) -> D-04, D-05

| Option | Description | Selected |
|--------|-------------|----------|
| A: Router body + labeled coach-procedure PLACEHOLDER | Frontmatter, Two modes, seam intro, heuristic caveat, reference pointers; coach procedure deferred to Phase 18 | ✓ |
| B: Full coach procedure now | Author the numbered procedure + stance router in Phase 15 | |
| C: Frontmatter + pointers only | No seam framing | |

**Selected:** A. **Notes:** Phase 18 owns LAW/RTR-02/SEAM; success criteria 1-2 need a
valid lean router (~80-140 lines), not the procedure. Mirrors Phase 6, which left a
Phase-9 coach placeholder in lz-refactor. Dual-mode-by-omission frontmatter (D-05).

---

## Triggering description (SKL-03 -- core deliverable) -> D-06, D-07, D-08

| Option | Description | Selected |
|--------|-------------|----------|
| A: v1 three-way-guarded, language-agnostic; tail = two reciprocal exclusions; tuning deferred to Phase 20 | Positive RED trigger + exclude green(lz-tpp)/refactor(lz-refactor); ~1000-1536 load-bearing window | ✓ |
| B: Minimal one-liner now, full drafting in Phase 20 | Defer nearly all wording | |
| C: Exhaustive tuned-now description | Pull Phase 20 eval work forward | |

**Selected:** A. **Notes:** Matches success-criterion 3 + the research budget + the
Phase 6 precedent (774-char seam-aware description at scaffold, tuning deferred to
Phase 11). lz-red carries TWO exclusions so it may run longer than the siblings, but the
positive-trigger sentence stays first. Empirical + cross-skill trigger eval = Phase 20 (D-08).

---

## Version / manifest boundary -> D-09, D-10

| Option | Description | Selected |
|--------|-------------|----------|
| A: Leave plugin.json at 0.0.2; bump is Phase 19 (DST-01) | validate exits 0 without a bump (skills auto-discovered) | ✓ |
| B: Bump to 0.0.3 now | Fold the version bump into the scaffold | |

**Selected:** A. **Notes:** Deliberately overrides ARCHITECTURE.md's "Phase A bumps
version" -- ROADMAP scope is fixed and 0.0.2 bumped the version in the Distribution
phase (Phase 10), not the scaffold phase (Phase 6). marketplace.json unchanged (D-10).

---

## Eval / oracle setup timing -> D-03 (reinforced)

| Option | Description | Selected |
|--------|-------------|----------|
| A: Neither this phase | `lz-red-workspace` = Phase 20; `.oracle/` books = Phase 16 | ✓ |
| B: Set up now | Fold eval harness / oracle books into scaffold | |

**Selected:** A. **Notes:** Keep Phase 15 to the shipped skeleton + a `claude plugin
validate .` gate; defer dev-only tooling and clean-room source setup to their owning phases.

## Claude's Discretion

- Exact per-doc content-contract wording in each stub (executor drafts from requirement clusters).
- Exact v1 `description` wording within the D-06/D-07 constraints (Phase 20 validates empirically).
- Whether the planner uses a Nyquist instrument-first wave; a `claude plugin validate .` gate is mandatory regardless.

## Deferred Ideas

- Reference content authoring -> Phases 16-17.
- Coach procedure + stance-router logic + lz-tpp forward seam + reverse `lz-tpp -> lz-red` pointer -> Phase 18.
- plugin.json 0.0.3 bump + README + CHANGELOG + `--strict` + validator/reviewer PASS -> Phase 19.
- `.oracle/` owned-book setup + source distillation -> Phase 16.
- Eval workspace + trigger/behavior evals + description tuning -> Phase 20.
- Advanced RED leaves (type-level `expectTypeOf`, property-based `fast-check`) -> post-0.0.3 (ADV-01/02).
