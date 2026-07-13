---
name: lz-refactor
description: >-
  This skill should be used for the refactor step of red-green-refactor TDD: improving the
  STRUCTURE or READABILITY of existing, working code WITHOUT changing its behavior. Use it whenever
  a developer wants to clean up, tidy, simplify, restructure, or de-duplicate code whose tests
  already pass, or make such code more readable; says a function, class, or module is hard to read,
  hard to follow, messy, doing too much, or a pain to work with; or mentions a code smell, a
  refactoring, or a design pattern in existing code (applying one to it, or refactoring away from
  one / de-patterning) -- even when they only ask "what would you do with this?", "anything you'd
  refactor?", or "how would you make it easier to read?" and never name a smell or say the word
  refactor. It recommends the next named Fowler or Kerievsky refactoring and, when the developer
  asks you to apply it, performs it in small behavior-preserving steps; it also explains a
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
     CANDIDATE Kerievsky pattern-directed refactoring from the
     [Kerievsky catalog](references/kerievsky-catalog/README.md) (look the target pattern up in the
     [GoF](references/gof-catalog/README.md) or
     [extra-patterns](references/extra-patterns-catalog/README.md) catalog). Route to the candidate
     but do not present it as chosen; step 4 decides whether it earns its keep.
4. Decide whether the pattern earns its keep by one net-cost count, and STATE the verdict before any
   code (CCH-02, CCH-06). Count what it REMOVES (duplication sites collapsed, obscurity clarified)
   against what it ADDS (new classes, types, files, indirection). A branch relocated into its own
   class or method is added structure, not a removal, so never count it on both sides. Emit one line:
   `Pattern: <name> | APPLY: removes <cost + count> > adds <structure + count>` or
   `Pattern: <name> | DECLINE: adds <structure + count> >= removes <cost + count>; keep <simpler form>`.
   APPLY only when removed exceeds added; otherwise DECLINE and keep the simplest form that clears the
   smell: the switch, a discriminated union, or a functional idiom via the
   [functional catalog](references/functional-catalog/README.md). Naming the smell ("removes the
   conditional complexity") is not a cost count and does not satisfy APPLY. Instance: 4 type codes in
   one switch -> Replace Conditional with Polymorphism adds 4 classes, removes 0 duplication sites ->
   DECLINE. If an unwarranted pattern is already present, refactor it AWAY: a Kerievsky Away
   refactoring (Inline Singleton, Encapsulate Composite with Builder, Move Accumulation to Visitor) or
   the functional dissolution above. De-patterning away is a first-class direction but stays gated by
   the QUESTION/COMMAND intent routing below, so do not edit working code on a question. Replace
   Pipeline with Loop only on a measured hot path or a named house-style reason.
5. Preserve behavior (CCH-03). Advise -- or perform, when the developer asks you to apply it -- the
   smallest steps that keep the code working, following the chosen refactoring's catalog-leaf
   mechanics and running the tests after each; commit on green is the developer's call (commit only
   when asked). If the target code has NO tests, route to
   [references/refactoring-without-tests.md](references/refactoring-without-tests.md) (Feathers) to
   pin current behavior with characterization tests first, then refactor. If a change alters an
   exported or public-API symbol (or a caller in another package) whose downstream consumers are not
   covered by the local tests, pause and ask before applying, because green local tests prove nothing
   about those consumers. Before you finish,
   verify every pattern you introduced carries an APPLY verdict naming what it removes; for any that
   cannot, refactor it away or, if keeping it, state that APPLY reason.
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

## Whole-package / directory sweeps

When the command names a package, directory, module, or codebase scope ("identify the code smells in
<package> and refactor them away", "clean up this directory"), apply the coach decision procedure to
each smell in turn and drive to a fixpoint: scan for the next warranted, in-scope, test-covered
refactoring, run its step-4 APPLY/DECLINE verdict, and on APPLY perform it in behavior-preserving
steps with the tests green after each (on DECLINE keep the simpler form and scan on); keep going
across rounds without asking between them. Lead with the
pattern-directed, de-patterning, and seam judgment calls, where this skill earns its keep over an
unaided model; do not churn a package with mechanical edits for their own sake. Pause and ask
(do not silently proceed) on the step-5 blast-radius guard and on an untested target (characterization
test first, per step 5); route any behavior change to lz-tpp and exclude it (step 1). If a step turns
the tests red, revert it and take a smaller step; halt the sweep if green cannot be restored. Once a
sweep has touched many files or run several rounds, checkpoint scope with the developer rather than
churning unbounded. Stop at the fixpoint (a scan finds nothing warranted left in scope), not at
zero smells at any cost.

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
