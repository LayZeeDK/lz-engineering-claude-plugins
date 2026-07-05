---
phase: 07-fowler-catalog-refactoring-2nd-ed
plan: 06
subsystem: skill-authoring
tags: [fowler-catalog, refactoring, clean-room-oracle, typescript, organizing-data]

requires:
  - phase: 07-02
    provides: calibrated clean-room loop + rubric anchors + canonical 62 name->slug map
provides:
  - the 5 Ch.9 organizing-data catalog leaves (oracle-converged, tsc --strict clean)
affects: [07-10]

tech-stack:
  added: []
  patterns:
    - "Same per-refactoring-leaf contract + clean-room loop as the 07-02 pilot"
    - "Single oracle-reviewer batch (5 leaves); revised leaves re-gated by resuming the same reviewer (source already in context)"

key-files:
  created:
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/split-variable.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/rename-field.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-derived-variable-with-query.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/change-reference-to-value.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/change-value-to-reference.md

key-decisions:
  - "Rename Field carries the atomic-boundary back-edge to principles.md (persisted-field rename); reviewer judged it a benign own-routing addition, not an invented source caveat."

patterns-established:
  - "The motivation axis catches invented content, not just missing content: it flagged a fabricated performance/measure-first exception on Replace Derived Variable with Query (source's real exception is immutable-source-data) as motivation=wrong."

requirements-completed: []  # FWL-01/FWL-04 advanced (34/62 leaves now); close phase-wide at 07-10.

duration: ~30min
completed: 2026-07-05
---

# Phase 7 / Plan 06: Ch.9 organizing-data leaves

**The 5 organizing-data (Ch.9) refactorings authored as oracle-converged per-refactoring leaves (tsc --strict clean), using the loop calibrated by the 07-02 pilot.**

## Accomplishments

- 5 Ch.9 leaves authored blind + oracle-converged (5/5 pass); every example tsc --strict clean and behavior-preserving per the reviewer's example axis.
- Inverse-of pair declared mutually: Change Reference to Value <-> Change Value to Reference.
- File-disjoint: touched only this chapter's 5 leaf files (README + checkers left to 07-02 / 07-10).
- Deterministic layer (tsc extractor + check-hygiene) green before AND after the oracle gate.

## Task Commits

1. **Task 1: author the Ch.9 leaves via the clean-room loop** - `3f98e35` (feat)
2. **Task 2: owner escalation** - did not fire (no non-converging / blocked entry); no-op.

## Confirmed Ch.9 membership (5)

Split Variable (1st-ed aliases: Remove Assignments to Parameters, Split Temporary Variable), Rename Field, Replace Derived Variable with Query, Change Reference to Value, Change Value to Reference. (All accepted in-scope by oracle-reviewer against the Ch.9 source; no topic-mismatch error.)

## Per-leaf round counts (5/5 pass)

| Leaf | Rounds | Notes |
|------|--------|-------|
| Change Reference to Value | 1 | pass R1 |
| Split Variable | 2 | R1 revise: reinstate the per-stage test (test after the first-segment rename, before the second) |
| Rename Field | 2 | R1 revise: add the conditional constructor-parameter rename step (Change Function Declaration) |
| Replace Derived Variable with Query | 2 | R1 revise: replace an INVENTED performance exception with the source's immutable-source-data exception; assert stored-vs-computed at read sites, not update sites |
| Change Value to Reference | 2 | R1 revise: add the global-repository coupling caveat + inject-the-repository alternative |

Round tally: R1 = 1 pass / 4 revise; R2 = 4 pass. 0 too_close_to_source, 0 blocked, 0 error.

## Owner escalation (0)

Task 2 was conditional (fires only for a leaf that does not reach `pass` within ~3 rounds or returns a blocked ambiguity). Nothing escalated -- all 5 converged within 2 rounds.

## Notable

- The `motivation` axis caught **invented** content (not merely missing): Replace Derived Variable with Query had a fabricated "performance/measure-first" exception (`motivation=wrong`); the source's real exception is immutable-source-data. Fixed blind. This is live evidence the fidelity gate catches hallucinated rationale, not only omissions.

## Deviations from Plan

None -- plan executed as written. Example domains are all distinct from the source (box description, contacts, cart totals, marker/position, publisher/book); no `too_close_to_source`.

## Next

- Wave 3 continues: Ch.10 (07-07), then Ch.11-12 (07-08..07-09). Return Modified Value in 07-08 now gate-able (source provisioned in .oracle/ Ch.11).
- Catalog now 34/62; check-catalog/check-crossrefs close at the 07-10 phase gate.
- Open before phase close: 07-03 check-principles `definition`-token fix + 07-03 SUMMARY.

---
*Phase: 07-fowler-catalog-refactoring-2nd-ed*
*Completed: 2026-07-05*
