---
phase: 08-kerievsky-catalog-refactoring-to-patterns
plan: 06
subsystem: skill-authoring
tags: [kerievsky-catalog, smells, fold-dedup, catalog-index, refactoring-directions, oracle-clean-room, phase-gate]

# Dependency graph
requires:
  - phase: 08-01
    provides: check-kerievsky harness + extended extract-samples/check-crossrefs/check-smells
  - phase: 08-02..08-05
    provides: all 27 Kerievsky catalog leaves (composed-primitive + direction + GoF fields)
  - phase: 07
    provides: 24 Fowler smell leaves + LOCKED smell-leaf/navigation-index contracts
provides:
  - Ch.4 smell fold (KRV-03): 4 Kerievsky-unique smell leaves + 8 additive overlap tags, source-tagged and deduped
  - finalized kerievsky-catalog/README.md thin 27-row index (KRV-01) with mirrored Use-when + Direction + GoF + shared Direction gloss
  - Direction reconciliation of the 17 committed leaves against the authoritative Refactoring Directions table (KRV-02)
  - check-kerievsky Direction allow-list widened (+n/a sentinel); full phase-gate battery GREEN
affects: [phase-9-coach, phase-9-de-patterning, phase-close]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Ch.4 smell fold: unique smells become source-tagged leaves (Source: Kerievsky); overlaps get an additive Source: both tag + 'also named by Kerievsky' note on the existing Fowler leaf (recognize-by cues unchanged)"
    - "Dedup map oracle-settled against .oracle/ Ch.4, not blind from research"
    - "Direction field reconciled from the book's authoritative Refactoring Directions table; n/a sentinel accepted by the widened checker allow-list"

key-files:
  created:
    - plugins/lz-tdd/skills/lz-refactor/references/smells/conditional-complexity.md
    - plugins/lz-tdd/skills/lz-refactor/references/smells/indecent-exposure.md
    - plugins/lz-tdd/skills/lz-refactor/references/smells/combinatorial-explosion.md
    - plugins/lz-tdd/skills/lz-refactor/references/smells/oddball-solution.md
  modified:
    - plugins/lz-tdd/skills/lz-refactor/references/smells.md
    - plugins/lz-tdd/skills/lz-refactor/references/smells/duplicated-code.md
    - plugins/lz-tdd/skills/lz-refactor/references/smells/long-function.md
    - plugins/lz-tdd/skills/lz-refactor/references/smells/primitive-obsession.md
    - plugins/lz-tdd/skills/lz-refactor/references/smells/alternative-classes-with-different-interfaces.md
    - plugins/lz-tdd/skills/lz-refactor/references/smells/lazy-element.md
    - plugins/lz-tdd/skills/lz-refactor/references/smells/large-class.md
    - plugins/lz-tdd/skills/lz-refactor/references/smells/repeated-switches.md
    - plugins/lz-tdd/skills/lz-refactor/references/smells/shotgun-surgery.md
    - plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/README.md
    - plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/ (17 leaves -- Direction reconciliation)
    - .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs

key-decisions:
  - "Ch.4 has 12 smells -> 4 UNIQUE + 8 OVERLAP (oracle-settled, 95-98 confidence)"
  - "Conditional Complexity is UNIQUE (broader than Repeated Switches: accretion of variant-selection + optional-behavior + state-transition branching), NOT folded into Repeated Switches -- corrects the provisional plan map"
  - "Solution Sprawl is OVERLAP -> Shotgun Surgery (the book explicitly equates them), NOT a unique leaf -- corrects the provisional plan map (no solution-sprawl.md authored)"
  - "Overlap leaves get tag + note only; Kerievsky candidate enrichment on overlap Fowler leaves deferred (no oracle-confirmed overlap->Kerievsky candidate mappings; the unique leaves + the catalog carry the pattern-directed routing the Phase-9 coach consumes)"
  - "Direction reconciled from the authoritative Refactoring Directions table: 11 Towards->To, 6 Towards->To/Towards; checker Direction allow-list widened by the n/a token only (compound To/Towards already validates via leading token)"
  - "check-kerievsky NAMES array needed NO reconciliation -- all 27 authored leaf H1 slugs already match (no wave-2 oracle name correction)"

patterns-established:
  - "Source-tagged unified smell taxonomy: untagged=Fowler, [both]=overlap folded onto the Fowler leaf, [Kerievsky]=unique Ch.4 leaf"

requirements-completed: [KRV-01, KRV-03]

# Metrics
duration: ~session (inline D-08 clean-room loop: 1 oracle dedup consult + 3 oracle-reviewer batches)
completed: 2026-07-06
---

# Phase 8 Plan 06: Ch.4 Smell Fold + Catalog Index Finalization + Phase-Gate Battery

**The Kerievsky layer is closed: Ch.4's 12 smells folded into the unified taxonomy (4 unique + 8 overlap, oracle-settled and deduped), the kerievsky-catalog/README.md finalized as a thin 27-row index with reconciled Directions, and the full phase-gate battery + `claude plugin validate` GREEN.**

## Performance

- **Completed:** 2026-07-06
- **Execution:** INLINE in the main context (D-08); oracle/oracle-reviewer subagents did all `.oracle/` reading. The main context never opened any file under `.oracle/` (ls of names only).
- **Tasks:** Task 1 (smell fold) + Task 2 (README + Direction reconciliation + checker widen + battery). Task 3 (owner escalation) was a NO-OP -- nothing failed to converge.
- **Commits:** a58aa22 (Task 1 smell fold), 8b98aa0 (Task 2 catalog finalize).

## Settled Ch.4 smell set (oracle, 95-98 confidence)

12 smells: Duplicated Code, Long Method, Conditional Complexity, Primitive Obsession, Indecent Exposure, Solution Sprawl, Alternative Classes with Different Interfaces, Lazy Class, Large Class, Switch Statements, Combinatorial Explosion, Oddball Solution.

## Final unique-vs-overlap dedup map

| Ch.4 smell | Classification | Maps to (Fowler) | Action |
|---|---|---|---|
| Conditional Complexity | UNIQUE | -- | new leaf (Source: Kerievsky) |
| Indecent Exposure | UNIQUE | -- | new leaf (Source: Kerievsky) |
| Combinatorial Explosion | UNIQUE | -- | new leaf (Source: Kerievsky) |
| Oddball Solution | UNIQUE | -- | new leaf (Source: Kerievsky) |
| Duplicated Code | OVERLAP | Duplicated Code | tag both + note |
| Long Method | OVERLAP | Long Function | tag both + note |
| Primitive Obsession | OVERLAP | Primitive Obsession | tag both + note |
| Alternative Classes with Different Interfaces | OVERLAP | Alternative Classes with Different Interfaces | tag both + note |
| Lazy Class | OVERLAP | Lazy Element | tag both + note |
| Large Class | OVERLAP | Large Class | tag both + note |
| Switch Statements | OVERLAP | Repeated Switches | tag both + note |
| Solution Sprawl | OVERLAP | Shotgun Surgery | tag both + note |

Unique-smell candidate refactorings (oracle-confirmed): Conditional Complexity -> Replace Conditional Logic with Strategy / Move Embellishment to Decorator / Replace State-Altering Conditionals with State / Introduce Null Object; Indecent Exposure -> Encapsulate Classes with Factory; Combinatorial Explosion -> Replace Implicit Language with Interpreter; Oddball Solution -> Substitute Algorithm (Fowler) / Unify Interfaces with Adapter.

## Per-leaf oracle-reviewer round counts

- **4 unique leaves:** R1 pass (all four; confidence 84-92). Oddball Solution received a within-pass fidelity refinement (the "determine the preferred solution first -- occasionally the oddball is the better design to keep" nuance the reviewer flagged) and was re-gated on the candidate axis -> R2 pass (confidence 95).
- **8 overlap leaves:** R1 pass (all eight; confidence 90-98). The Solution Sprawl -> Shotgun Surgery mapping was source-confirmed ("the book explicitly declares Solution Sprawl the same problem as Shotgun Surgery").
- **Owner escalations (Task 3):** none. Every leaf reached oracle-reviewer pass; no blocked, no non-convergence, no dedup boundary the oracle left ambiguous.

## Direction reconciliation (KRV-02, from 08-REFACTORING-DIRECTIONS.md)

- 11 committed leaves: `Towards` -> `To` (Ch.6/7/8 To-only rows).
- 6 both-listed leaves: `Towards` -> `To/Towards` (Move Embellishment to Decorator, Replace Conditional Dispatcher with Command, Replace Conditional Logic with Strategy, Replace Hard-Coded Notifications with Observer, Replace State-Altering Conditionals with State, Unify Interfaces with Adapter).
- Already correct: 3 Away (Inline Singleton, Encapsulate Composite with Builder, Move Accumulation to Visitor) + 4 n/a utilities + 3 To set in 08-05. Final census: 14 To, 6 To/Towards, 3 Away, 4 n/a = 27.
- Checker: check-kerievsky Direction allow-list widened by the `n/a` token only (compound `To/Towards` already validates via its leading `To` token; coach `Away` routing untouched). NAMES array needed no change -- all 27 authored H1 slugs already match.

## Deviations from Plan

- **Provisional file list corrected by the oracle-settled dedup map (D-05 anticipated this).** The plan's PROVISIONAL unique set listed Solution Sprawl as a new leaf and Conditional Complexity as borderline. The oracle settled: Conditional Complexity = UNIQUE (kept its leaf), Solution Sprawl = OVERLAP -> Shotgun Surgery (NO solution-sprawl.md; folded onto shotgun-surgery.md instead). Net new unique leaves = 4, not the provisional 4-5.
- **Direction reconciliation + checker Direction allow-list widen are a plan deviation, owner-approved.** The 08-06-PLAN.md predates the Refactoring Directions convention lock; the reconciliation + the `n/a` allow-list widen follow the later owner-approved 08-REFACTORING-DIRECTIONS.md (the plan frontmatter's "NAMES-only, data not logic" checker note is superseded by that convention). The widen is a data/allow-list edit on the normal verify path (checker .mjs edits are exempt from the agent-review rule).
- **Overlap Kerievsky-candidate enrichment deferred.** The parenthetical "where apt, add Kerievsky candidate refactorings to the overlap leaf's candidate map" was not exercised: the oracle confirmed candidates only for the unique smells, and adding unconfirmed overlap->Kerievsky candidate mappings would risk fabrication and reopening converged Fowler candidate maps. The unique leaves + both catalogs carry the pattern-directed routing the Phase-9 coach reads.

## Phase-gate battery (final, on the committed state)

All GREEN + `claude plugin validate .` passes:

- extract-samples: 185 modules `tsc --strict --noEmit` clean.
- check-kerievsky: 27/27 (contract + Direction + GoF + composed-primitive + README Use-when mirror + 3 Away + 3 fields).
- check-catalog: 62/62 Fowler regression.
- check-smells: 24/24 + 4 Kerievsky-unique (source tags valid, no un-deduped duplicate, all candidate links resolve).
- check-crossrefs: 449 links resolve, 20 inverse pairs mutual, no self-refs.
- check-principles: 8/8.
- check-hygiene: ASCII + email clean, 0 no-verbatim WARN.
- claude plugin validate: passed. SKILL.md untouched.

## Next Phase Readiness

- Phase 8 content is complete: 27 Kerievsky catalog leaves + finalized index + Ch.4 smell fold. The unified smell taxonomy keeps its LOCKED navigation-only shape (Phase-9 routing unchanged); the Direction `Away` cases + de-patterning callouts feed Phase-9 CCH-02; composed-Fowler-primitive links connect the two catalog layers for CCH-01.
- Phase close remaining: verify_phase_goal -> secure-phase -> validate-phase -> extract-learnings.

---
*Phase: 08-kerievsky-catalog-refactoring-to-patterns*
*Completed: 2026-07-06*
