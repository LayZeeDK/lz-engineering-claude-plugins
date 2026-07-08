# Refactoring Safely Without Tests (Feathers)

Scope: the core techniques for changing and refactoring code that has no tests, from Feathers (Working
Effectively with Legacy Code). The coach falls back here when a smell must be addressed but the target
code lacks the test coverage that makes ordinary refactoring safe. Feathers treats code without tests
as the hard case: untested code is risky to change because nothing catches a mistake, so the first job
is to get a net in place before touching behavior.

> No-oracle reference: high-confidence CORE only (no owned book to verify against). Original prose, no
> verbatim Feathers prose or code (DST-04). Technique NAMES are kept verbatim as facts; every
> definition and step sequence below is written in original words.

## Per-entry content contract

Each technique carries:

- Technique -- the technique name (verbatim) and what it is, in original words.
- When-to-use -- the situation that calls for it.
- Distilled mechanics -- the step sequence in original words (no verbatim book prose).

## Seams

- Technique -- a seam is a point where you can change what a piece of code does without editing that
  code in place, by supplying a different implementation at that point. Feathers distinguishes object
  seams (swap the object whose method is called), link seams (swap a linked or imported module), and
  preprocessing seams.
- When-to-use -- when a unit is hard to instantiate or observe because a collaborator (a database, the
  clock, the network, a global) is wired straight into it.
- Distilled mechanics -- locate the point where the awkward behavior is selected, introduce a
  substitution point there (an injected object, an overridable method, a swappable module), pass a test
  double through it, and sense or pin the behavior through that point.

## Characterization tests

- Technique -- a characterization test captures what the code currently does, correct or not, so any
  change your refactoring introduces becomes detectable.
- When-to-use -- before changing untested code whose full behavior you do not yet understand; you need
  a safety net first.
- Distilled mechanics -- exercise the code with a plausible input, observe the actual output, and write
  an assertion that locks in that observed value even if it looks wrong. Add cases until the behavior
  you are about to touch is pinned. These tests describe current behavior, not intended behavior --
  record suspected bugs separately rather than "fixing" them here.

## The change algorithm

- Technique -- the change algorithm is the standard sequence for editing legacy code safely.
- When-to-use -- any change to code that has no tests around it.
- Distilled mechanics -- identify the change points; find the test points where the effect can be
  sensed; break the dependencies that block testing (using seams); write characterization tests at
  those points; then make the change and refactor under the now-green tests.

## Sprout Method and Sprout Class

- Technique -- add new behavior as a fresh, test-driven method (Sprout Method) or class (Sprout Class)
  instead of editing the tangled code in place.
- When-to-use -- when you must add behavior to a method you cannot easily bring under test, and cannot
  afford to test the whole method first.
- Distilled mechanics -- develop the new behavior test-first in a new method or class, in isolation;
  then call into it from the untested code at a single point. The new code is fully tested; the old
  code gains only one call.

## Wrap Method and Wrap Class

- Technique -- add behavior around existing behavior without altering the existing body (Wrap Method
  for a single method; Wrap Class for a decorator around a whole object).
- When-to-use -- when new behavior must run before or after existing behavior and you want the existing
  behavior left untouched.
- Distilled mechanics -- for Wrap Method, rename the original method and create a new method under the
  old name that calls the renamed original and adds the new step. For Wrap Class, create a class that
  holds the original, shares its interface, and adds behavior around the forwarded calls.

## Subclass and Override Method

- Technique -- Subclass and Override Method uses inheritance to replace awkward behavior with a
  test-friendly version in a subclass.
- When-to-use -- when a dependency is buried inside a method and you need to neutralize or observe it
  to get the code under test.
- Distilled mechanics -- if needed, extract the awkward behavior into its own overridable method,
  create a testing subclass that overrides it with a benign or observable version, and instantiate the
  subclass in the test. This is a temporary scaffold for testability, not a permanent design choice.

## Extract Interface

- Technique -- Extract Interface introduces an interface that a concrete class implements, so tests can
  substitute a double for a hard-to-use collaborator.
- When-to-use -- when a client depends directly on an awkward concrete collaborator.
- Distilled mechanics -- declare an interface holding the methods the client actually uses, make the
  real collaborator implement it, change the client to depend on the interface, and pass a test double
  that implements the interface in tests.

## Using this reference from the coach

When the target code has no tests, do not refactor blind. Pick a seam, pin the current behavior with
characterization tests, and only then apply the smallest refactoring steps -- running the tests after
each. If the class is hard to instantiate, reach for Extract Interface or Subclass and Override Method;
if you only need to add behavior, Sprout or Wrap keeps the untested code nearly untouched.

## Sources

- Feathers, Working Effectively with Legacy Code -- unowned; high-confidence core only, no-oracle.
  There is no owned copy to verify against, so correctness rests on tight core scope, skill-reviewer
  review, and DST-04 hygiene (original prose; only technique NAMES kept verbatim).
