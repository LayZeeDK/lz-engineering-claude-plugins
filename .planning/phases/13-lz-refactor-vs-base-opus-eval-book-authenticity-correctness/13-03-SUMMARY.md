---
phase: 13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness
plan: 03
status: complete
completed: 2026-07-15
requirements: [SPEC-req-3]
---

# Plan 13-03 Summary: Book-authenticity grading (oracle, DST-04)

## What was built

Graded the book fidelity of every applied refactoring across the graded corpus, via the `oracle`
agent (the only DST-04 channel to the source books). Main context normalized OUR output only
(diff.patch + answer.md + meta.json) into a per-claim list; the oracle established each book's
mechanics and owns the pass/partial/fail verdict in its own words.

- **claims.json** (63 claims): one claim per distinct applied refactoring per graded run across
  p1/p2/gr1 (single-target, both arms incl. kata invoke_skill) and p8/gr4 (sweep, both arms).
  Distinct groups: Extract Function (31), Guard Clauses (10), Replace Magic Literal (9),
  Decompose Conditional (8), Extract Variable (2), Consolidate Conditional Expression (1),
  Replace Conditional Logic with Strategy (1). The p2 with_skill run-3 no-edit advise-only run is
  recorded as a "none applied" N/A claim.
- **fidelity.json**: oracle pass/partial/fail per claim + per-(cell,arm) tally + Pass@k
  (passAtK/passHatK formulas copied verbatim from run-e2e.mjs).

## Result (both arms)

**Book-authenticity fidelity is Pass@1 = 1.00 for every cell and both arms** -- every applied
refactoring realized its book's mechanics:

- **Fowler (2 oracle establishment + grading)**: Extract Function, Replace Nested Conditional with
  Guard Clauses, Decompose Conditional, Extract Variable, Consolidate Conditional Expression -> all
  pass. Replace Magic Literal with Symbolic Constant -> pass, with the oracle's honest caveat that
  it is NOT a named refactoring in the Fowler 2nd-ed catalog (online-only), graded against the
  book's general symbolic-constant/naming principle.
- **Kerievsky**: Replace Conditional Logic with Strategy (kata gr1 with_skill run-2) -> pass
  (composition-based delegation + per-variant strategy classes + factory-equivalent name->updater
  selection; Item left untouched per the kata rule -- exactly the compose-over-subclass scenario
  the book favors). Confidence 93/100.
- **Cross-cutting (oracle-confirmed)**: both arms' declining of Replace Conditional with
  Polymorphism (nx type-code ladders; small kata conditionals) is CONSISTENT with Fowler, which
  warns against polymorphism overuse.

**Empirical read:** book-authenticity fidelity is PARITY between with_skill and no_skill -- both
arms produce book-faithful applied refactorings. The skill's only distinguishing move here is that
the with_skill arm uniquely REACHED a named pattern-directed refactoring (the Kerievsky Strategy in
gr1 run-2) that the no_skill arm never named or applied; but the fidelity of what each arm DID apply
is equally high.

## Key files

created:
- .claude/skills/lz-refactor-workspace/grading/book-authenticity/claims.json
- .claude/skills/lz-refactor-workspace/grading/book-authenticity/fidelity.json

## Verification

- 63/63 claims carry a verdict (or N/A for the one decline). [OK]
- Both records ASCII-only; no source-book path/prose; no email-shaped tokens. [OK]
- Main context never read the git-ignored source books; the oracle agent owns every book fact and verdict. [OK]

## Self-Check: PASSED
