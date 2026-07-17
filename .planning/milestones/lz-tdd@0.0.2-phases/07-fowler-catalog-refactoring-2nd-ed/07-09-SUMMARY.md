---
phase: 07-fowler-catalog-refactoring-2nd-ed
plan: 09
subsystem: skill-authoring
tags: [fowler-catalog, refactoring, clean-room-oracle, typescript, dealing-with-inheritance]

requires:
  - phase: 07-02
    provides: calibrated clean-room loop + rubric anchors + canonical 62 name->slug map
provides:
  - the 11 Ch.12 dealing-with-inheritance catalog leaves (oracle-converged, tsc --strict clean) -- catalog now 62/62
affects: [07-10]

tech-stack:
  added: []
  patterns:
    - "Same per-refactoring-leaf contract + clean-room loop as the 07-02 pilot; two parallel oracle-reviewer sub-batches (6+5), then converge-only re-gates (4, then 2)"
    - "Class-syntax examples under tsc --strict (target es2021, no dom lib): abstract classes, super() delegation, interface-typed delegates"

key-files:
  created:
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/pull-up-method.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/pull-up-field.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/pull-up-constructor-body.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/push-down-method.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/push-down-field.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-type-code-with-subclasses.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/remove-subclass.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/extract-superclass.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/collapse-hierarchy.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-subclass-with-delegate.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-superclass-with-delegate.md

key-decisions:
  - "Inverse-of pairs declared mutually: Pull Up Method <-> Push Down Method; Pull Up Field <-> Push Down Field."
  - "Atomic-boundary back-edge added only to the interface-breakers whose published-surface change the source itself flags (Push Down Method later swapped it for the polymorphism remedy; Remove Subclass; Replace Superclass with Delegate)."
  - "Replace Type Code with Subclasses / Remove Subclass carry a see-also to each other as the direction reverse (not a mutual inverse-of declaration)."
  - "replace-subclass-with-delegate re-domained off a source-adjacent example (booking/premium -> search-result ranking) on a reviewer ambiguity -- resolved by the driver's distinct-domain default, no owner escalation."

patterns-established:
  - "The DST-04 near-verbatim gate fires on ACCIDENTAL collision: push-down-method was authored blind yet two short imperative mechanics steps matched the source word-for-word; reworded blind, cleared next round. Blind authoring does not guarantee non-collision on terse procedural steps."
  - "Completeness/aptness drove every revise: a dropped final mechanics step (extract-superclass client retargeting; replace-type-code push-down + polymorphism) and a missing secondary motivation (replace-subclass-with-delegate coupling) each forced a revise even with all other axes correct."

requirements-completed: []  # FWL-01/FWL-04 advanced (62/62 leaves now); close phase-wide at 07-10.

duration: ~75min
completed: 2026-07-05
---

# Phase 7 / Plan 09: Ch.12 dealing-with-inheritance leaves

**The 11 dealing-with-inheritance (Ch.12) refactorings authored as oracle-converged per-refactoring leaves (tsc --strict clean, class syntax); the last catalog chapter, bringing the Fowler catalog to 62/62.**

## Accomplishments

- 11 Ch.12 leaves authored blind + oracle-converged (11/11 pass); every example tsc --strict clean and behavior-preserving per the reviewer's example axis (124 extracted modules total).
- Catalog reaches 62/62 refactorings. This closes the per-refactoring authoring; the full-battery gate (check-catalog 62/62, check-smells 24/24, check-crossrefs) lands at 07-10.
- Inverse-of pairs declared mutually: Pull Up Method <-> Push Down Method; Pull Up Field <-> Push Down Field.
- File-disjoint: touched only this chapter's 11 leaf files (README + checkers left to 07-02 / 07-10).

## Task Commits

1. **Task 1: author the Ch.12 leaves via the clean-room loop** - `3460dc1` (feat)
2. **Task 2: owner escalation** - did not fire (no non-converging / blocked entry); no-op.

## Confirmed Ch.12 membership (11)

Pull Up Method, Pull Up Field, Pull Up Constructor Body, Push Down Method, Push Down Field, Replace Type Code with Subclasses (aliases Extract Subclass; Replace Type Code with State/Strategy), Remove Subclass (alias Replace Subclass with Fields), Extract Superclass, Collapse Hierarchy, Replace Subclass with Delegate, Replace Superclass with Delegate (alias Replace Inheritance with Delegation). (All accepted in-scope by oracle-reviewer against the Ch.12 source; no topic-mismatch error.)

## Per-leaf round counts (11/11 pass)

| Leaf | Rounds | Notes |
|------|--------|-------|
| Pull Up Method | 1 | pass R1 |
| Pull Up Field | 1 | pass R1 |
| Pull Up Constructor Body | 1 | pass R1 |
| Push Down Field | 1 | pass R1 |
| Collapse Hierarchy | 1 | pass R1 |
| Remove Subclass | 1 | pass R1 |
| Replace Superclass with Delegate | 1 | pass R1 |
| Extract Superclass | 2 | R1 revise: restore the final client-retargeting mechanics step |
| Replace Subclass with Delegate | 2 | R1 revise: add the tight-coupling motivation; re-domain example (booking -> search-result ranking) |
| Replace Type Code with Subclasses | 3 | R1 revise: add final push-down + polymorphism step; R2 revise: also name Push Down Method as the source-paired companion; R3 pass |
| Push Down Method | 3 | R1 revise: restore the polymorphism remedy for superclass-reference callers; R2 revise: reword two near-verbatim mechanics steps (DST-04); R3 pass |

Round tally: R1 = 7 pass / 4 revise; R2 = 2 pass / 2 revise (of 4 re-gated); R3 = 2 pass. 1 too_close_to_source (push-down-method R2, resolved by blind reword), 0 blocked, 0 error, 0 owner escalations.

## Owner escalation (0)

Task 2 was conditional (fires only for a leaf that does not reach `pass` within ~3 rounds or returns a blocked ambiguity). Push Down Method and Replace Type Code with Subclasses each took the full 3 rounds but converged, so nothing escalated. The one reviewer ambiguity (replace-subclass-with-delegate example domain adjacency) was resolved by the driver's distinct-domain default rather than an owner question.

## Notable

- **DST-04 near-verbatim fired on accidental collision.** Push Down Method was authored blind, yet two of its short imperative mechanics steps matched the source's step sentences word-for-word; the reviewer flagged `too_close_to_source`, the steps were reworded blind, and R3 cleared. Confirms the copyright gate catches unavoidable-looking overlap on terse procedural steps even when the author never saw the source.
- **Judgment-heavy chapter, but framing held.** spirit/judgment scored `correct` on all 11 -- the delegate / collapse / remove leaves carry the source's when-to / when-not-to character (composition-over-inheritance, "collapse only when the split stops paying", "subclass does too little"). The retargeted spirit/judgment axis did not fire a single revise here.
- **Completeness of multi-step mechanics was the recurring gap.** Both 3-round leaves and extract-superclass lost the source's FINAL mechanics step (retarget clients; push behavior down + polymorphism) on the first draft -- the deeper chapters' longer procedures need explicit completeness checks, as the pilot warned.

## Deviations from Plan

None -- plan executed as written (Task 1 auto; Task 2 no-op). Example domains are all distinct from the source (reports, marketplace listings, game characters, bank accounts, media assets, carrier shipments, users, financial documents, folders, search-result ranking, playlists); no residual `too_close_to_source` after R3.

## Next

- Wave 4 = 07-10 (24 smell leaves + navigation-only smells.md + finalize README Ch.7-12 rows + FULL checker battery GREEN: check-catalog 62/62, check-smells 24/24, check-crossrefs). Catalog now 62/62.
- Open before phase close: 07-03 check-principles `definition`-token fix + 07-03 SUMMARY.
- After all plans: verify_phase_goal -> secure-phase -> validate-phase -> extract-learnings.

---
*Phase: 07-fowler-catalog-refactoring-2nd-ed*
*Completed: 2026-07-05*
