---
phase: 07-fowler-catalog-refactoring-2nd-ed
plan: 03
subsystem: skill-authoring
tags: [fowler-catalog, principles, clean-room-oracle, ch2, FWL-03]

requires:
  - phase: 07-01
    provides: NON-shipped FWL checker battery (incl. check-principles, the FWL-03 topic gate)
provides:
  - references/principles.md -- Fowler Ch.2 distilled in original words (definition, two hats, why/when to refactor, performance, YAGNI, attributions)
affects: [07-10]

tech-stack:
  added: []
  patterns:
    - "Principles gated on the driver-supplied principles axes (concepts / reasons / triggers / boundaries / attribution / spirit), NOT the refactoring-leaf axes -- per 07-ORACLE-MODEL"

key-files:
  modified:
    - plugins/lz-tdd/skills/lz-refactor/references/principles.md

key-decisions:
  - "D-05: Fowler Ch.2 ONLY -- Beck principle-backing stays deferred to Phase 9; principles.md stays a single file (no principles-beck.md pre-split)."
  - "check-principles is a line-oriented TOKEN presence gate (definition, two hats, rule of three, preparatory, comprehension, litter-pickup, performance, YAGNI); the 'definition' topic needs the literal word on a line, satisfied by an own-framing lead-in (not the noun/verb wording alone)."

patterns-established:
  - "A deterministic token-presence checker can stay RED after an oracle-converged draft when the draft conveys a topic without the checker's literal token; close it with a minimal own-words framing edit, no oracle re-review."

requirements-completed: []  # FWL-03 satisfied by this file; closes phase-wide with the rest at the 07-10 full-battery gate.

duration: ~10min (definition-token fix + SUMMARY this session; content authored pre-session)
completed: 2026-07-05
---

# Phase 7 / Plan 03: Fowler Ch.2 principles

**`references/principles.md` distills Fowler Ch.2 (definition of refactoring, the two hats, why/when to refactor -- rule of three / preparatory / comprehension / litter-pickup -- performance, YAGNI, attributions) in original words behind the D-07 oracle checkpoint; check-principles is now 8/8 GREEN.**

## Accomplishments

- principles.md authored + oracle-converged (against Ch.2 on the principles axes: concepts / reasons / triggers / boundaries / attribution / spirit) -- authored pre-session in `654714b`.
- Closed the last FWL-03 gap: `check-principles` was 7/8 RED because the file conveyed the noun/verb definition without ever using the literal token `definition` (the checker's `definition-of-refactoring` topic). Added a one-line own-framing lead-in ("The definition comes in two halves -- a noun and a verb.") -> `check-principles` GREEN 8/8. Own words, no oracle re-review needed.
- Single file (Beck backing deferred to Phase 9 per D-05); ASCII + email hygiene clean.

## Task Commits

1. **Task 1: author principles.md via the oracle loop** - `654714b` (docs) -- pre-session.
2. **definition-token fix + this SUMMARY** - this session (docs).

## Verification

- `check-principles`: GREEN -- 8/8 Ch.2 topics present (definition, two hats, rule of three, preparatory, comprehension, litter-pickup, performance, YAGNI).
- `check-hygiene`: GREEN (ASCII + work-email allowlist) over 68 files.

## Deviations from Plan

- The plan's `must_haves` truth "each topic token sits on its own line so the presence checker matches" was met for 7/8 topics at authoring time; the `definition` topic was conveyed by the noun/verb wording without the literal token, leaving check-principles 7/8 RED until this session's one-line framing fix. No content/fidelity change -- purely the checker's literal-token contract.

## Next

- FWL-03 is satisfied; it closes phase-wide at 07-10 when the full battery goes green.
- 07-10 (Wave 4) is the last plan: 24 smell leaves + navigation smells.md + finalize README + FULL checker battery GREEN (check-catalog 62/62, check-smells 24/24, check-crossrefs, check-principles 8/8).

---
*Phase: 07-fowler-catalog-refactoring-2nd-ed*
*Completed: 2026-07-05*
