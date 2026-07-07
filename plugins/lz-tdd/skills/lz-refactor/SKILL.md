---
name: lz-refactor
description: >-
  This skill should be used during the refactor step of red-green-refactor TDD to recommend the
  next NAMED refactoring for a detected code smell, and to explain refactorings, smells, and
  refactoring principles on demand. Use it as a coach when the tests are green and the code has a
  smell and the question is which named refactoring to apply, and as a reference when the user
  asks what a refactoring such as Extract Function or Replace Conditional with Polymorphism means,
  how to refactor away from a pattern (de-patterning), or asks a Fowler or Kerievsky catalog
  question. Do not use it for the green / transformation step of TDD -- choosing the change that
  makes a failing test pass is lz-tpp -- nor for plain feature work or generic write-a-function or
  write-code requests.
---

# lz-refactor: Refactoring coach (Fowler + Kerievsky)

This skill drives the refactor step of red-green-refactor TDD: with the tests green, it recommends
the next NAMED refactoring for a detected code smell (Fowler mechanical refactorings and Kerievsky
pattern-directed refactorings), and explains refactorings, smells, and refactoring principles on
demand. It runs in two modes and routes by intent, and it never changes behavior -- behavior
changes belong to the green step and its sibling skill lz-tpp.

## Two modes

- Coach mode: the tests are green and the code has a smell, and the question is which refactoring
  to apply. Route the smell to a candidate NAMED refactoring and present it. (The full coach
  decision procedure is deferred to Phase 9 -- see the placeholder below.)
- Reference mode: the request is "explain this refactoring / smell / principle", a named-refactoring
  lookup, or an explicit `/lz-tdd:lz-refactor` invocation with nothing to coach. Answer from the
  reference files listed below; do not restate their content here.

## Refactoring vs the green step (the lz-tpp seam)

The refactor step (structure-only, behavior-preserving) is lz-refactor. The green / transformation
step (making a failing test pass by changing behavior) is lz-tpp. Classify the request before
acting: if a red test must be made to pass, that is lz-tpp, not this skill.

## Coach decision procedure (deferred to Phase 9)

Placeholder only. The full coach decision procedure -- smell -> named-refactoring routing
(mechanical -> Fowler, pattern-directed -> Kerievsky), de-patterning balance, behavior-preservation
discipline, the Feathers no-tests fallback, and the lz-tpp seam detail -- is authored in Phase 9
(CCH-01..05, PRIN-01..03). Do not infer it from this scaffold.

## Fowler catalog (mechanical refactorings)

When routing a mechanical smell or looking up a named Fowler refactoring, consult the catalog
index: [references/fowler-catalog/README.md](references/fowler-catalog/README.md)

## Smell taxonomy (coach trigger table)

To map a detected smell to candidate named refactorings, use the unified smell taxonomy:
[references/smells.md](references/smells.md)

## Refactoring principles (Fowler Ch.2 + backing)

To explain or justify a recommendation from refactoring principles, consult:
[references/principles.md](references/principles.md)

## Kerievsky pattern-directed refactorings

When routing a structural / pattern-directed smell or looking up a named Kerievsky refactoring
(including de-patterning), consult the catalog index:
[references/kerievsky-catalog/README.md](references/kerievsky-catalog/README.md)

## Target pattern catalogs (GoF + extra patterns)

When a pattern-directed refactoring names a target pattern to move toward or away from, look the
pattern itself up in the target-pattern catalogs: the 23 classic Gang-of-Four patterns in
[references/gof-catalog/README.md](references/gof-catalog/README.md), and the non-GoF-23 patterns
(Null Object, Factory, Creation Method, Composed Method, Collecting Parameter) in
[references/extra-patterns-catalog/README.md](references/extra-patterns-catalog/README.md).

## Functional catalog (de-patterning + native FP idioms)

When a request is about how an OO pattern or a pattern-directed refactoring dissolves into a
functional idiom (de-patterning), or about a native FP idiom offered alongside an OO form
(Option/Either, functor/monad, lens/optics, currying/partial application, transducers), look the
idiom up in the by-idiom index:
[references/functional-catalog/README.md](references/functional-catalog/README.md)

## Refactoring safely without tests (Feathers)

When the target code lacks the test coverage that makes ordinary refactoring safe, consult the
no-tests core techniques: [references/refactoring-without-tests.md](references/refactoring-without-tests.md)
