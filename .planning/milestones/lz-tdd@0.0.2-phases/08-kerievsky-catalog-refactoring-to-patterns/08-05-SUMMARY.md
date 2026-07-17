---
phase: 08-kerievsky-catalog-refactoring-to-patterns
plan: 05
subsystem: skill-authoring
tags: [kerievsky-catalog, refactoring-to-patterns, protection, accumulation, utilities, de-patterning, typescript, oracle-clean-room, refactoring-directions]

# Dependency graph
requires:
  - phase: 08-01
    provides: check-kerievsky harness + extended extract-samples/check-hygiene
  - phase: 07
    provides: 62 Fowler catalog leaves (composed-primitive targets) + LOCKED leaf/index/oracle-loop contracts
provides:
  - 8 tail Kerievsky leaves (Ch.9 Protection 3, Ch.10 Accumulation 2, Ch.11 Utilities 3) -- completing all 27
  - 1 overflow walkthrough (Move Accumulation to Visitor)
  - the 3rd named de-patterning case (Move Accumulation to Visitor, Direction: Away from Iterator)
  - the LOCKED Refactoring Directions convention (08-REFACTORING-DIRECTIONS.md) -- To/Towards/Away/n-a
affects: [08-06, phase-9-coach, phase-9-de-patterning]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Kerievsky Direction field settled against the book's Refactoring Directions table (authoritative), not chapter prose"
    - "Compound Direction `To/Towards` for both-listed refactorings; `n/a` sentinel for table-absent utilities"

key-files:
  created:
    - plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/replace-type-code-with-class.md
    - plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/limit-instantiation-with-singleton.md
    - plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/introduce-null-object.md
    - plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/move-accumulation-to-collecting-parameter.md
    - plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/move-accumulation-to-visitor.md
    - plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/move-accumulation-to-visitor-walkthrough.md
    - plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/chain-constructors.md
    - plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/unify-interfaces.md
    - plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/extract-parameter.md
    - .planning/phases/08-kerievsky-catalog-refactoring-to-patterns/08-REFACTORING-DIRECTIONS.md
  modified:
    - .claude/agents/oracle.md
    - .claude/agents/oracle-reviewer.md

key-decisions:
  - "The book's Refactoring Directions table (Inside Front Cover) is the AUTHORITATIVE source for the Direction field, outranking oracle chapter-prose; owner-provided + recorded in 08-REFACTORING-DIRECTIONS.md"
  - "Move Accumulation to Visitor = Direction: Away (from Iterator) -- vindicated by the table's Iterator/Away row (it is To/Towards Visitor AND Away Iterator); D-03 stands"
  - "The 4 table-absent utilities carry Direction: n/a (sentinel), NOT Towards (which falsely implies partial pattern adoption) -- unanimous 6-member Opus board"
  - "The 6 both-listed refactorings will carry compound Direction: To/Towards (08-06) -- lossless record of the table's dual placement; a single shared README gloss ships"
  - "oracle + oracle-reviewer agents made permanently aware of the Refactoring Directions table (committed 9a877d7, reloaded)"

patterns-established:
  - "Direction settled per the Refactoring Directions table; To=full pattern, Towards=keepable partial, Away=de-pattern, n/a=table-absent utility"

requirements-completed: [KRV-01, KRV-02, KRV-04]

# Metrics
duration: ~session (multi-round: authoring + oracle convergence + direction-table inference + 6-member board)
completed: 2026-07-06
---

# Phase 8 Plan 05: Ch.9 Protection + Ch.10 Accumulation + Ch.11 Utilities Summary

**All 8 tail Kerievsky refactorings authored as oracle-converged, tsc --strict-clean leaves -- completing all 27 catalog leaves -- with the Direction field settled against the book's authoritative Refactoring Directions table (Visitor = Away from Iterator; the 4 utilities = n/a sentinel).**

## Performance

- **Completed:** 2026-07-06
- **Tasks:** 1 authoring task; Task 2 (owner escalation) fired for the Move Accumulation to Visitor direction and was resolved via the owner-provided Refactoring Directions table + a 6-member Opus board.
- **Files created:** 9 (8 leaves + 1 walkthrough) + 08-REFACTORING-DIRECTIONS.md + this SUMMARY.

## Accomplishments

- Authored the 8 tail leaves BLIND via the D-08 inline clean-room loop; oracle-converged (Ch.9/10/11 gated per-chapter, R1->R2, 0 blocked, 0 non-convergence).
- Completed all 27 Kerievsky catalog leaves (Ch.6 + Ch.7 + Ch.8 + Ch.9/10/11).
- Settled the Direction model against the book's authoritative Refactoring Directions table (owner-provided).

## Confirmed Ch.9/10/11 membership + directions (for 08-06 reconciliation)

| # | Refactoring | slug | Direction | GoF pattern | Rounds | Walkthrough |
|---|-------------|------|-----------|-------------|--------|-------------|
| 20 | Replace Type Code with Class | replace-type-code-with-class | n/a | Class / type-safe value (non-GoF) | 2 | no |
| 21 | Limit Instantiation with Singleton | limit-instantiation-with-singleton | To | Singleton | 2 | no |
| 22 | Introduce Null Object | introduce-null-object | To | Null Object | 2 | no |
| 23 | Move Accumulation to Collecting Parameter | move-accumulation-to-collecting-parameter | To | Collecting Parameter (non-GoF) | 2 | no |
| 24 | Move Accumulation to Visitor | move-accumulation-to-visitor | Away (from Iterator) | Visitor | 2 | yes |
| 25 | Chain Constructors | chain-constructors | n/a | n/a -- utility | 2 | no |
| 26 | Unify Interfaces | unify-interfaces | n/a | n/a -- utility | 2 | no |
| 27 | Extract Parameter | extract-parameter | n/a | n/a -- utility | 2 | no |

## Decisions Made

- **Refactoring Directions table is authoritative.** The owner provided the book's Refactoring Directions table (Inside Front Cover, after the List of Refactorings); it settles the To/Towards/Away Direction field and OUTRANKS oracle chapter-prose (which frames only the pattern being adopted). Recorded in `08-REFACTORING-DIRECTIONS.md`; the `oracle`/`oracle-reviewer` agents were made permanently aware of it (committed `9a877d7`, reloaded).
- **Move Accumulation to Visitor = Away (from Iterator).** The oracle's chapter-prose read said "Towards Visitor," which nearly drove a wrong flip -- but the table lists this refactoring under BOTH Visitor (To/Towards) AND Iterator (Away). D-03's Away-from-Iterator framing is source-founded; the leaf keeps Direction: Away + the callout.
- **The 4 table-absent utilities carry `Direction: n/a`.** A unanimous 6-member Opus board (3 advisors + 3 adversarial critics, peer-deliberated to consensus) settled that `Towards` was a fidelity error (it implies partial adoption of a nonexistent pattern); `n/a` mirrors their `GoF pattern: n/a -- utility` sibling and the directions doc's Authoritative column.
- **The To/Towards distinction was inferred, not stated.** The book gives no explicit definition; three independent oracle consults (Ch.7/8/10) converged (~72-76 conf): To = fully instantiates the pattern; Towards = a keepable partial adoption (two-phase, separable completing step). Recorded in `08-REFACTORING-DIRECTIONS.md`.
- **Composed-primitive fields map Kerievsky's 1st-ed primitives onto our Fowler 2nd-ed catalog slugs** (Extract Method->Extract Function, etc.; "Extract Interface" -> Change Function Declaration / Extract Superclass). Extract Parameter was re-scoped in R1->R2 from a parameterize-a-constant reading to the source's field-decoupling refactoring.

## Deviations from Plan

- **D-04 GoF for the utilities:** plan anticipated the 3 Ch.11 utilities carrying `GoF pattern: n/a -- utility` (done) and set their Direction to `Towards`; the board changed the DIRECTION of all 4 table-absent utilities (incl. Replace Type Code with Class) to the `n/a` sentinel. This is an oracle/board-driven refinement of the plan's direction defaults, recorded here and in 08-REFACTORING-DIRECTIONS.md.
- No other deviations; the R1->R2 revises were expected clean-room convergence.

## Owner Escalations (Task 2)

One escalation, resolved: the Move Accumulation to Visitor direction. The oracle-reviewer flagged `direction: partial` (prose framed Towards Visitor) against D-03's locked `Away`. Rather than override either way, escalated to the owner; the owner supplied the book's Refactoring Directions table, which confirms the dual placement (To/Towards Visitor + Away Iterator) and vindicates `Away`. The broader To/Towards/`n/a` field convention was then settled by a 6-member Opus board. No leaf shipped `blocked`.

## Carry-forward to 08-06 (direction reconciliation)

08-06 must, in addition to the Ch.4 smell fold + README index + full battery:
1. Apply compound `Direction: To/Towards` to the 6 both-listed committed leaves (Unify Interfaces with Adapter, Replace Conditional Dispatcher with Command, Move Embellishment to Decorator, Replace Hard-Coded Notifications with Observer, Replace State-Altering Conditionals with State, Replace Conditional Logic with Strategy).
2. Reconcile the 11 committed To-only leaves `Towards` -> `To` (Ch.6/7/8 -- see 08-REFACTORING-DIRECTIONS.md table).
3. Widen `check-kerievsky`'s Direction allow-list: accept the `n/a` sentinel and the compound `To/Towards` (leading-token). Keep the coach's `Away` routing untouched.
4. Ship the single shared Direction gloss line in the kerievsky-catalog README.
5. Reconcile check-kerievsky NAMES to the authored slugs; full battery GREEN + `claude plugin validate`.

## Next Phase Readiness

- All 27 Kerievsky leaves authored + oracle-converged. `check-kerievsky` remains RED-by-design until 08-06 (NAMES + enum widen); extract-samples / check-hygiene GREEN.
- README.md and checker .mjs were NOT touched by this plan (08-06 owns them).

---
*Phase: 08-kerievsky-catalog-refactoring-to-patterns*
*Completed: 2026-07-06*
