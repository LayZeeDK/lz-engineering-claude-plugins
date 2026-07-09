# Tidy First? (Beck)

Scope: the high-confidence core of Beck's Tidy First? It covers separating structural change from
behavioral change, and the economics that decide when a small structural cleanup pays for itself. The coach cites
this when it recommends tidying before or after a behavior change, and when it weighs whether a
cleanup is worth doing now. This is not the complete tidyings catalog (that is deferred); it
covers only the core that overlaps refactorings this skill already carries.

> No-oracle reference: high-confidence CORE only (no owned book to verify against). Original prose, no
> verbatim Beck prose or code (DST-04). Overlapping Fowler refactorings are cross-referenced by LINK,
> not restated here.

## Structural change vs behavioral change

A change is either structural or behavioral, and the two should not share a commit:

- A structural change rearranges code (renaming, extracting, moving, reordering) without altering
  what the code observably does. Beck calls these small structural changes tidyings.
- A behavioral change alters or adds to what the code does: new output, new branch, changed result.

Keep them in separate steps and separate commits. A reviewer can confirm a purely structural change by
checking that behavior is unchanged; a reviewer verifies a behavioral change by its tests. Mixing the
two destroys both checks, makes review harder, and makes either change harder to revert on its own.
When both are needed, sequence them (usually tidy first, then change behavior) rather than
interleaving them in one edit.

## The economics of tidying

Tidying is an economic decision, not an aesthetic one. Three forces decide whether it pays:

- Coupling: the dominant driver of change cost. When elements are coupled, changing one forces you
  to change the others, so the cost of a change tracks how coupled the affected code is. Tidying that
  lowers coupling lowers the cost of every future change through that code.
- Cohesion: elements that change together should sit together. Raising cohesion keeps a change local
  instead of scattering it, which is the flip side of reducing coupling across boundaries.
- Options: a codebase you can change cheaply is worth more than one you cannot, because it preserves
  options: the ability to defer a decision until you know more. Under real uncertainty, that optionality
  can be worth more than the immediate saving, which is the case for tidying now. Balance it against the
  time value of money: do not tidy far ahead of a need you cannot yet see.

## When to tidy

- Before (tidy first): when a small structural change makes the coming behavior change obviously
  easier, tidy first, then make the now-easy change.
- After: when making the change taught you a better structure, tidy once the bar is green.
- Later or never: defer when the payoff is unclear, and skip entirely for code you will not touch
  again.

## Overlapping Fowler refactorings

Several core tidyings are the same move as a named Fowler refactoring already in this skill. Follow the
link for the mechanics; they are not repeated here:

- Explaining variables: introduce a well-named variable for a sub-expression. Use
  [Extract Variable](./fowler-catalog/extract-variable.md).
- Extract helper: pull a chunk into a named unit. Use [Extract Function](./fowler-catalog/extract-function.md),
  [Extract Class](./fowler-catalog/extract-class.md), or
  [Combine Functions into Class](./fowler-catalog/combine-functions-into-class.md).
- Inline an over-eager helper: undo an extraction that no longer earns its name. Use
  [Inline Function](./fowler-catalog/inline-function.md).
- Move declaration and initialization together: bring a variable next to its first use for reading
  order. Use [Slide Statements](./fowler-catalog/slide-statements.md).
- Guard clauses: flatten nested conditionals into early exits. Use
  [Replace Nested Conditional with Guard Clauses](./fowler-catalog/replace-nested-conditional-with-guard-clauses.md).
- Split a tangled conditional into named parts: [Decompose Conditional](./fowler-catalog/decompose-conditional.md).
- Rename for clarity: [Rename Variable](./fowler-catalog/rename-variable.md).

Explaining constants (naming a bare literal) has no leaf in this catalog; treat it as
the same instinct as Extract Variable applied to a constant value.

## Sources

- Beck, Tidy First? Unowned; high-confidence core only, no-oracle. There is no owned copy to verify
  against, so correctness rests on tight core scope, skill-reviewer review, and DST-04 hygiene (original
  prose; overlapping refactorings referenced by link, not restated).
