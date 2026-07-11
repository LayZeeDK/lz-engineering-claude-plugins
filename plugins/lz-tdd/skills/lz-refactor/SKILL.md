---
name: lz-refactor
description: >-
  This skill should be used for the refactor step of red-green-refactor TDD: improving the
  STRUCTURE or READABILITY of existing, working code WITHOUT changing its behavior. Use it whenever
  a developer wants to clean up, tidy, simplify, restructure, or de-duplicate code whose tests
  already pass, or make such code more readable; wants to sweep a whole package, directory, module,
  or codebase -- finding the code smells across many files and refactoring them away, not just one
  function; says a function, class, or module is hard to read,
  hard to follow, messy, doing too much, or a pain to work with; or mentions a code smell, a
  refactoring, or a design pattern in existing code (applying one to it, or refactoring away from
  one / de-patterning) -- even when they only ask "what would you do with this?", "anything you'd
  refactor?", or "how would you make it easier to read?" and never name a smell or say the word
  refactor. It recommends the next named Fowler or Kerievsky refactoring and, when the developer
  asks you to apply it, performs it in small behavior-preserving steps -- driving a whole-package
  sweep across multiple rounds to completion when asked; it also explains a
  refactoring, code smell, refactoring principle, or design pattern on request. Do NOT use it to
  make a failing or red test pass or otherwise ADD or CHANGE behavior -- that is the
  green/transformation step; use lz-tpp instead -- nor for writing new code, adding a feature, or
  writing a function from scratch.
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
5. Preserve behavior (CCH-03). Advise -- or perform, when the developer asks you to apply it -- the
   smallest steps that keep the code working, running the tests after each; commit on green is the
   developer's call (commit only when asked). If the target code has NO tests, route to
   [references/refactoring-without-tests.md](references/refactoring-without-tests.md) (Feathers) to
   pin current behavior with characterization tests first, then refactor.
6. Reference mode (CCH-04). For an explain / lookup request, route to the correct references/ doc:
   Fowler, Kerievsky, GoF, extra-patterns, functional, [smells](references/smells.md), or
   [principles](references/principles.md). Answer from it; do not restate it here.

Coach by default; drive when asked. When the request is a QUESTION or asks for advice (what would you
do here, anything you'd refactor, how would you make this more readable), present the named refactoring
and the smallest next step and let the developer apply it -- do not edit their code or run tests unasked,
because unrequested changes to working code are unwelcome. When the request is an explicit COMMAND to do
it (refactor this for me, apply it, go ahead and make the change, do it), perform the refactoring yourself
in small behavior-preserving steps, running the tests after each; then stop and leave the changes for the
developer to review -- do not commit unless they ask. Refusing to edit when you were plainly asked to
apply is the failure to avoid, not caution.

When the command names a whole-package, directory, module, or codebase scope -- sweep the package,
refactor away every smell in this module, clean up the whole directory -- do not stop after a single
refactoring. Repeat the decision procedure to a fixpoint within that named scope: scan for the next
warranted, in-scope, test-covered refactoring, apply it in the same small behavior-preserving steps,
run the tests, and keep going across rounds without asking between them. Work forward-only -- never
re-touch a region an earlier round already refactored, and never introduce an abstraction in one
round and remove it in another. Stop when a scan pass finds nothing warranted and actionable left in
scope, or a sensible ceiling is reached; as a default, once a sweep has run several rounds or begun
touching many files, checkpoint with the developer and confirm scope before pressing on rather than
churning unbounded. Then land at a terminal review gate -- report how many rounds ran with the tests
green after each, leave every change uncommitted for the developer to review, and never commit unless
asked. The end goal is that fixpoint, not zero smells at any cost. Run the tests after every step; if
a step turns them red, revert that step and take a smaller one, and halt the sweep if green cannot be
restored (the behavior-preservation discipline of step 5 above). Even mid-sweep, pause and surface
instead of silently proceeding on any of these: the green-step seam or a behavior-changing item --
route it to lz-tpp and exclude it, per step 1 above; an untested target -- stop and pin current
behavior with characterization tests first, per step 5 above; a pattern you would only be adding on
spec -- leave it with a one-line reason, since the step-4 balance above decides whether a pattern
earns its keep (de-patterning away stays autonomous); genuinely ambiguous behavior (pin it with a
characterization test or ask, never guess); a change whose blast radius escapes the named scope,
such as altering an exported or public-API symbol or editing a caller in another package outside this
target's own test suite (pause and ask); and a flaky or too-slow-to-run-each-step suite (fall back to
advising rather than driving). Lead with the pattern-directed, de-patterning, and seam judgment calls
-- that is where this skill beats a strong model working unaided; on plain mechanical extractions a
capable model is already close, so do not churn a package for its own sake.

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
