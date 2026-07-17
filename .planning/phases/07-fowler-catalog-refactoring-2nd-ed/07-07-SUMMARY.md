---
phase: 07-fowler-catalog-refactoring-2nd-ed
plan: 07
subsystem: skill-authoring
tags: [fowler-catalog, refactoring, clean-room-oracle, typescript, simplify-conditional-logic]

requires:
  - phase: 07-02
    provides: calibrated clean-room loop + rubric anchors + canonical 62 name->slug map
provides:
  - the 6 Ch.10 simplify-conditional-logic catalog leaves (oracle-converged, tsc --strict clean)
affects: [07-10]

tech-stack:
  added: []
  patterns:
    - "Same per-refactoring-leaf contract + clean-room loop as the 07-02 pilot"
    - "tsc --strict discriminated-union exhaustive switch compiles clean without a default (before-side of Replace Conditional with Polymorphism)"

key-files:
  created:
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/decompose-conditional.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/consolidate-conditional-expression.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-nested-conditional-with-guard-clauses.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-conditional-with-polymorphism.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/introduce-special-case.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/introduce-assertion.md

key-decisions:
  - "Replace Control Flag with Break stays CUT (1st-ed relic, outside the 62); not authored."
  - "Replace Conditional with Polymorphism: the extraction mechanic cites Extract Function (per source), with a see-also to Decompose Conditional as the lighter alternative -- satisfies both fidelity and the plan key_link."

patterns-established:
  - "The cross-ref-aptness gap is real (rubric rec #1): the reviewer caught a leaf citing the wrong sibling refactoring (Decompose Conditional vs Extract Function) even though both links resolve."
  - "Blind authoring can converge on the source's own example (Introduce Assertion hit too_close_to_source on the discount-rate scenario); re-domain fully on a too_close verdict."

requirements-completed: []  # FWL-01/FWL-04 advanced (40/62 leaves now); close phase-wide at 07-10.

duration: ~35min
completed: 2026-07-05
---

# Phase 7 / Plan 07: Ch.10 simplify-conditional-logic leaves

**The 6 simplify-conditional-logic (Ch.10) refactorings authored as oracle-converged per-refactoring leaves (tsc --strict clean), using the loop calibrated by the 07-02 pilot; the cut 1st-ed relic (Replace Control Flag with Break) is absent.**

## Accomplishments

- 6 Ch.10 leaves authored blind + oracle-converged (6/6 pass); every example tsc --strict clean and behavior-preserving per the reviewer's example axis (both before and after compile -- a smell is a design issue, not a type error).
- Replace Control Flag with Break (1st-ed relic) NOT authored -- correctly cut from the 62-scope.
- File-disjoint: touched only this chapter's 6 leaf files (README + checkers left to 07-02 / 07-10).
- Deterministic layer (tsc extractor + check-hygiene) green before AND after the oracle gate (80 modules).

## Task Commits

1. **Task 1: author the Ch.10 leaves via the clean-room loop** - `30966fa` (feat)
2. **Task 2: owner escalation** - did not fire (no non-converging / blocked entry); no-op.

## Confirmed Ch.10 membership (6)

Decompose Conditional, Consolidate Conditional Expression, Replace Nested Conditional with Guard Clauses, Replace Conditional with Polymorphism, Introduce Special Case (alias: Introduce Null Object), Introduce Assertion. (All accepted in-scope by oracle-reviewer against the Ch.10 source; no topic-mismatch error.)

## Per-leaf round counts (6/6 pass)

| Leaf | Rounds | Notes |
|------|--------|-------|
| Decompose Conditional | 1 | pass R1 |
| Replace Nested Conditional with Guard Clauses | 1 | pass R1 |
| Consolidate Conditional Expression | 2 | R1 revise: combine two-at-a-time with a test between each (not one bulk combine); add the leave-independent-checks-apart caveat |
| Replace Conditional with Polymorphism | 2 | R1 revise: extraction cross-ref Decompose Conditional -> Extract Function; state the folded route-callers-through-factory + move-conditional-to-superclass steps |
| Introduce Special Case | 2 | R1 revise: restore the shared-predicate routing (route callers before swapping the producer); wire the special-case object through the producer in the example (was defined-but-unused) |
| Introduce Assertion | 2 | R1 revise: too_close_to_source (converged on the source discount-rate example) -> re-domained to average()/non-empty-list |

Round tally: R1 = 2 pass / 4 revise; R2 = 4 pass. 1 too_close_to_source (Introduce Assertion, resolved), 0 blocked, 0 error.

## Owner escalation (0)

Task 2 was conditional (fires only for a leaf that does not reach `pass` within ~3 rounds or returns a blocked ambiguity). Nothing escalated -- all 6 converged within 2 rounds.

## Notable (rubric evidence)

- **Cross-ref aptness (rubric rec #1):** the reviewer caught Replace Conditional with Polymorphism citing Decompose Conditional where the source extracts via Extract Function -- a wrong-but-resolvable sibling link. The current rubric caught it here because it sat inside a mechanics step; a see-also-only miscitation could still slip, which is what rec #1 (a cross-ref-aptness clause in the mechanics anchor) would close.
- **First too_close_to_source across all chapters:** Introduce Assertion. Blind authoring independently reproduced the source's discount-rate example. Fix = full re-domain, not a reword. Confirms the DST-04 near-verbatim gate is live and load-bearing.

## Deviations from Plan

None -- plan executed as written. Example domains are all distinct from the source (library late fee, shipping discount, ticket price, geometric shapes, unknown-user null object, list average); after re-domaining Introduce Assertion, no `too_close_to_source` remains.

## Next

- Wave 3 continues: Ch.11 (07-08, refactoring APIs, 11 leaves -- includes Return Modified Value [web-only], now gate-able), then Ch.12 (07-09, dealing with inheritance, 11 leaves).
- Catalog now 40/62; check-catalog/check-crossrefs close at the 07-10 phase gate.
- Open before phase close: 07-03 check-principles `definition`-token fix + 07-03 SUMMARY.
- Open owner decision: 2 optional oracle-rubric sharpenings (cross-ref aptness in the mechanics anchor; codify the atomic-boundary back-edge as a benign addition) -- not yet applied to the LOCKED 07-ORACLE-MODEL.md.

---
*Phase: 07-fowler-catalog-refactoring-2nd-ed*
*Completed: 2026-07-05*
