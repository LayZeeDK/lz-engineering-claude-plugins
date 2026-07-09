---
name: lz-refactor
description: >-
  This skill should be used during the refactor step of red-green-refactor TDD to recommend the
  next NAMED refactoring for a detected code smell, and to explain refactorings, smells, and
  refactoring principles on demand. Use it as a coach when the tests are green and the code has a
  smell and the question is which named refactoring to apply, and as a reference when the user
  asks what a refactoring such as Extract Function or Replace Conditional with Polymorphism means,
  how to refactor away from a pattern (de-patterning), or asks a Fowler or Kerievsky catalog
  question. Do not use it for the green / transformation step of TDD (choosing the change that
  makes a failing test pass is lz-tpp), nor for plain feature work or generic write-a-function or
  write-code requests.
---

# lz-refactor: Refactoring coach (Fowler + Kerievsky)

This skill drives the refactor step of red-green-refactor TDD: with the tests green, it recommends
the next NAMED refactoring for a detected code smell (Fowler mechanical refactorings and Kerievsky
pattern-directed refactorings), and explains refactorings, smells, and refactoring principles on
demand. It runs in two modes and routes by intent, and it never changes behavior. Behavior
changes belong to the green step and its sibling skill lz-tpp.

## Two modes

- Coach mode: the tests are green and the code has a smell, and the question is which refactoring
  to apply. Route the smell to a candidate NAMED refactoring and present it via the coach decision
  procedure below.
- Reference mode: the request is "explain this refactoring / smell / principle", a named-refactoring
  lookup, or an explicit `/lz-tdd:lz-refactor` invocation with nothing to coach. Answer from the
  reference files listed below; do not restate their content here.

## Refactoring vs the green step (the lz-tpp seam)

The refactor step (structure-only, behavior-preserving) is lz-refactor. The green / transformation
step (making a failing test pass by changing behavior) is lz-tpp. Classify the request before
acting: if a red test must be made to pass, that is lz-tpp, not this skill.

## Coach decision procedure

1. Classify the request against the lz-tpp seam (CCH-05). If a red / failing test must be made to
   pass, that is the green step. Hand off to lz-tpp and stop. If the tests are green and the code
   has a structure-only smell, continue here (the refactor step). See "Refactoring vs the green step"
   above; do not restate it.
2. Recognize the smell (CCH-01). Scan the recognize-by cues in
   [references/smells.md](references/smells.md), then OPEN the matching smell leaf for its candidate
   refactorings. The index is navigation-only, so never guess a refactoring from it.
3. Route by smell kind to a NAMED refactoring (CCH-01):
   - Mechanical smell (Long Function, Duplicated Code, Feature Envy) -> a Fowler refactoring from the
     [Fowler catalog](references/fowler-catalog/README.md).
   - Repeated / complex-structure smell (Conditional Complexity, Combinatorial Explosion) -> a
     Kerievsky pattern-directed refactoring from the
     [Kerievsky catalog](references/kerievsky-catalog/README.md); look the target pattern up in the
     [GoF](references/gof-catalog/README.md) or
     [extra-patterns](references/extra-patterns-catalog/README.md) catalog.
4. Apply the over/under-engineering balance (CCH-02, CCH-06). A pattern that earns its keep is
   applied or kept; an unwarranted pattern is refactored AWAY: either a Kerievsky Away refactoring
   (Inline Singleton, Encapsulate Composite with Builder, Move Accumulation to Visitor) or dissolved
   to a functional idiom via the [functional catalog](references/functional-catalog/README.md)
   ("pattern X disappears via idiom Y / TS feature Z"). Replace Pipeline with Loop only on a measured
   hot path or a named house-style reason. Clarity is the default.
5. Preserve behavior (CCH-03). Advise the smallest steps that keep the code working, running the
   tests after each and committing on green. If the target code has NO tests, route to
   [references/refactoring-without-tests.md](references/refactoring-without-tests.md) (Feathers) to
   pin current behavior with characterization tests first, then refactor.
6. Reference mode (CCH-04). For an explain / lookup request, route to the correct references/ doc:
   Fowler, Kerievsky, GoF, extra-patterns, functional, [smells](references/smells.md), or
   [principles](references/principles.md). Answer from it; do not restate it here.

Coach, don't drive. Present the named refactoring and the smallest next step; let the developer apply
it and run the tests. Never edit the developer's code or run the tests unless explicitly asked.

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
