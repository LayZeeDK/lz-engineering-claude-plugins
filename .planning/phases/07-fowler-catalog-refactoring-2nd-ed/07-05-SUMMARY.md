---
phase: 07-fowler-catalog-refactoring-2nd-ed
plan: 05
subsystem: skill-authoring
tags: [fowler-catalog, refactoring, clean-room-oracle, typescript, moving-features]

requires:
  - phase: 07-02
    provides: calibrated clean-room loop + rubric anchors + canonical 62 name->slug map
provides:
  - the 9 Ch.8 moving-features catalog leaves (oracle-converged, tsc --strict clean)
affects: [07-10]

tech-stack:
  added: []
  patterns:
    - "Same per-refactoring-leaf contract + clean-room loop as the 07-02 pilot"
    - "Two parallel oracle-reviewer batches (5+4); revised leaves re-gated by resuming the same reviewer (source already in context)"

key-files:
  created:
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/move-function.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/move-field.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/move-statements-into-function.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/move-statements-to-callers.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-inline-code-with-function-call.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/slide-statements.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/split-loop.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-loop-with-pipeline.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/remove-dead-code.md

key-decisions:
  - "Move Function / Move Field carry the atomic-boundary back-edge to principles.md (published-interface / persisted-data moves); reviewer judged these as benign own-routing additions, not invented source caveats."

patterns-established:
  - "Sub-batch the review (5+4) and re-gate only the revised leaves by resuming the same reviewer agent -- preserves the expensive full-chapter read across rounds."

requirements-completed: []  # FWL-01/FWL-04 advanced (29/62 leaves now); close phase-wide at 07-10.

duration: ~35min
completed: 2026-07-05
---

# Phase 7 / Plan 05: Ch.8 moving-features leaves

**The 9 moving-features (Ch.8) refactorings authored as oracle-converged per-refactoring leaves (tsc --strict clean), using the loop calibrated by the 07-02 pilot.**

## Accomplishments

- 9 Ch.8 leaves authored blind + oracle-converged (9/9 pass); every example tsc --strict clean and behavior-preserving per the reviewer's example axis.
- Inverse-of pair declared mutually: Move Statements into Function <-> Move Statements to Callers (mirror examples on both sides).
- File-disjoint: touched only this chapter's 9 leaf files (README + checkers left to 07-02 / 07-10).
- Deterministic layer (tsc extractor + check-hygiene) green before AND after the oracle gate.

## Task Commits

1. **Task 1: author the Ch.8 leaves via the clean-room loop** - `6bcbfa7` (feat)
2. **Task 2: owner escalation** - did not fire (no non-converging / blocked entry); no-op.

## Confirmed Ch.8 membership (9)

Move Function (alias Move Method), Move Field, Move Statements into Function, Move Statements to Callers, Replace Inline Code with Function Call, Slide Statements (1st-ed alias Consolidate Duplicate Conditional Fragments), Split Loop, Replace Loop with Pipeline, Remove Dead Code. (All accepted in-scope by oracle-reviewer against the Ch.8 source; no topic-mismatch error.)

## Per-leaf round counts (9/9 pass)

| Leaf | Rounds | Notes |
|------|--------|-------|
| Move Statements into Function | 1 | pass R1 |
| Replace Inline Code with Function Call | 1 | pass R1 |
| Slide Statements | 1 | pass R1 |
| Replace Loop with Pipeline | 1 | pass R1 |
| Remove Dead Code | 1 | pass R1 |
| Move Function | 2 | R1 revise: add second motivation (reach new callers / lift a nested helper out for reuse) |
| Move Field | 2 | R1 revise: add shared-target caveat (moving a field to a shared object can change behavior unless all sources agree; assert it) |
| Move Statements to Callers | 2 | R1 revise: add polymorphic branch (extract in every override, make identical, remove before inlining) |
| Split Loop | 2 | R1 revise: reframe removal as eliminating duplicated side effects (side-effect-free duplicates may stay); add return-directly + split-enables-optimization motivations |

Round tally: R1 = 5 pass / 4 revise; R2 = 4 pass. 0 too_close_to_source, 0 blocked, 0 error. Every `revise` was a substantive dropped-motivation / dropped-branch / drifted-step fix -- the loop caught real omissions while holding the firewall.

## Owner escalation (0)

Task 2 was conditional (fires only for a leaf that does not reach `pass` within ~3 rounds or returns a blocked ambiguity). Nothing escalated -- all 9 converged within 2 rounds with no blocked verdict.

## Deviations from Plan

None -- plan executed as written. Example domains are all distinct from the source (reservations, subscriptions/plans, row summaries, vowel counting, invoice line, temperature-reading stats, account owners, tax price); no `too_close_to_source` across either batch.

## Next

- Wave 3 continues: Ch.9 (07-06), then Ch.10-12 (07-07..07-09). Return Modified Value in 07-08 now gate-able (source provisioned in .oracle/ Ch.11).
- Catalog now 29/62; check-catalog/check-crossrefs close at the 07-10 phase gate.
- Open before phase close: 07-03 check-principles `definition`-token fix + 07-03 SUMMARY.

---
*Phase: 07-fowler-catalog-refactoring-2nd-ed*
*Completed: 2026-07-05*
