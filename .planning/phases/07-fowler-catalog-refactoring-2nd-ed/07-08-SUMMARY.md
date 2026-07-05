---
phase: 07-fowler-catalog-refactoring-2nd-ed
plan: 08
subsystem: skill-authoring
tags: [fowler-catalog, refactoring, clean-room-oracle, typescript, refactoring-apis, web-only]

requires:
  - phase: 07-02
    provides: calibrated clean-room loop + rubric anchors + canonical 62 name->slug map
provides:
  - the 11 Ch.11 refactoring-APIs catalog leaves (oracle-converged, tsc --strict clean), incl. Return Modified Value [web-only]
affects: [07-10]

tech-stack:
  added: []
  patterns:
    - "Same per-refactoring-leaf contract + clean-room loop as the 07-02 pilot; two parallel oracle-reviewer sub-batches (6+5) for the big chapter"
    - "First chapter gated with the sharpened rubric (cross-ref aptness in mechanics; back-edges as benign additions; spirit/judgment)"

key-files:
  created:
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/separate-query-from-modifier.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/parameterize-function.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/remove-flag-argument.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/preserve-whole-object.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-parameter-with-query.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-query-with-parameter.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/remove-setting-method.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-constructor-with-factory-function.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-function-with-command.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-command-with-function.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/return-modified-value.md

key-decisions:
  - "Return Modified Value is the sole [web-only] entry -- provenance line, H1 kept clean so check-catalog name identity matches; gated against the Ch.11 source (owner-provisioned)."
  - "Replace Error Code with Exception and Replace Exception with Precheck stay CUT (1st-ed relics, outside the 62)."
  - "Atomic-boundary back-edge added only to interface-breakers that do NOT already route through Change Function Declaration (Separate Query from Modifier, Remove Flag Argument, Replace Query with Parameter, Remove Setting Method, Replace Constructor with Factory Function) -- avoids duplicating the gate across the CFD-routing leaves."

patterns-established:
  - "The sharpened rubric fired productively on its first chapter: cross-ref aptness caught a wrong cited sibling (Preserve Whole Object: CFD vs Inline Function); back-edges were consistently scored as benign additions, not invented limits."
  - "An always-green migration order matters for the reviewer: Return Modified Value took 3 rounds oscillating between an immutable-too-early bug (R1) and a stop-mutation-too-early bug (R2) before the callers-assign-before-mutation-removed order (R3) held."

requirements-completed: []  # FWL-01/FWL-04 advanced (51/62 leaves now); close phase-wide at 07-10.

duration: ~60min
completed: 2026-07-05
---

# Phase 7 / Plan 08: Ch.11 refactoring-APIs leaves

**The 11 refactoring-APIs (Ch.11) refactorings authored as oracle-converged per-refactoring leaves (tsc --strict clean), including the sole [web-only] entry Return Modified Value; the two 1st-ed relics are absent. First chapter gated with the sharpened oracle-reviewer rubric.**

## Accomplishments

- 11 Ch.11 leaves authored blind + oracle-converged (11/11 pass); every example tsc --strict clean and behavior-preserving per the reviewer's example axis (102 extracted modules).
- Return Modified Value carries [web-only]; the two 1st-ed relics (Replace Error Code with Exception, Replace Exception with Precheck) NOT authored.
- Inverse-of pairs declared mutually: Replace Parameter with Query <-> Replace Query with Parameter; Replace Function with Command <-> Replace Command with Function.
- File-disjoint: touched only this chapter's 11 leaf files (README + checkers left to 07-02 / 07-10).

## Task Commits

1. **Task 1: author the Ch.11 leaves via the clean-room loop** - `eb97c88` (feat)
2. **Task 2: owner escalation** - did not fire (no non-converging / blocked entry); no-op.

## Confirmed Ch.11 membership (11)

Separate Query from Modifier, Parameterize Function (alias Parameterize Method), Remove Flag Argument (alias Replace Parameter with Explicit Methods), Preserve Whole Object, Replace Parameter with Query (alias Replace Parameter with Method), Replace Query with Parameter, Remove Setting Method, Replace Constructor with Factory Function (alias Replace Constructor with Factory Method), Replace Function with Command (alias Replace Method with Method Object), Replace Command with Function, Return Modified Value [web-only]. (All accepted in-scope by oracle-reviewer against the Ch.11 source; no topic-mismatch error.)

## Per-leaf round counts (11/11 pass)

| Leaf | Rounds | Notes |
|------|--------|-------|
| Separate Query from Modifier | 1 | pass R1 |
| Parameterize Function | 1 | pass R1 |
| Remove Flag Argument | 1 | pass R1 |
| Replace Query with Parameter | 1 | pass R1 |
| Replace Constructor with Factory Function | 1 | pass R1 |
| Preserve Whole Object | 2 | R1 revise: realign mechanics to create-parallel-then-Inline-Function (fix cited siblings); add cross-module dependency caveat |
| Replace Parameter with Query | 2 | R1 revise: add referential-transparency caveat (do not query mutable global) |
| Remove Setting Method | 2 | R1 revise: add the shared-reference-object abort precondition |
| Replace Function with Command | 2 | R1 revise: keep-green forwarding via Move Function; richer example (locals-to-fields + Extract Function payoff) |
| Replace Command with Function | 2 | R1 revise: always-green path (seed via Extract Function, keep command working, Remove Dead Code) |
| Return Modified Value | 3 | R1 revise: immutable-too-early order bug; R2 revise: stop-mutation-too-early bug; R3 pass: callers-assign-before-mutation-removed (always-green) |

Round tally: R1 = 5 pass / 6 revise; R2 = 5 pass / 1 revise; R3 = 1 pass. 0 too_close_to_source, 0 blocked, 0 error, 0 owner escalations.

## Owner escalation (0)

Task 2 was conditional (fires only for a leaf that does not reach `pass` within ~3 rounds or returns a blocked ambiguity). Return Modified Value took the full 3 rounds but converged, so nothing escalated.

## Notable (sharpened-rubric evidence)

- **Cross-ref aptness (sharpening #1) fired on its first chapter:** Preserve Whole Object cited Change Function Declaration where the source uses the create-parallel-function-then-Inline-Function procedure -- a resolvable-but-wrong sibling, now scored as a mechanics defect.
- **Back-edges scored as benign additions (sharpening #2):** every atomic-boundary Watch-for cross-link was scored `likely-correct` in `additions`, never an applicability "invented limit" -- exactly the intended behavior; no per-call special-casing needed.
- **Always-green ordering is a real fidelity axis:** Return Modified Value oscillated across two opposite order bugs before the source's overlap (callers consume the return while the old mutation still runs, then remove it) held -- a good reminder that mechanics fidelity includes keeping every test checkpoint green.

## Deviations from Plan

None -- plan executed as written. Example domains are all distinct from the source (numeric total+log, box fee, seat price, bracket check, cart subtotal, tax config, account id, ticket factory, rental charge command, peak-reading accumulator); no `too_close_to_source`.

## Next

- Wave 3 finishes with Ch.12 (07-09, dealing with inheritance, 11 leaves) -- the last catalog chapter.
- Then Wave 4 = 07-10 (24 smell leaves + navigation-only smells.md + finalize README Ch.7-12 rows + FULL checker battery GREEN: check-catalog 62/62, check-smells 24/24, check-crossrefs).
- Catalog now 51/62.
- Open before phase close: 07-03 check-principles `definition`-token fix + 07-03 SUMMARY.

---
*Phase: 07-fowler-catalog-refactoring-2nd-ed*
*Completed: 2026-07-05*
