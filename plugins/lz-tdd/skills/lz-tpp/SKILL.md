---
name: lz-tpp
description: >-
  This skill should be used during red-green-refactor TDD to recommend the next code
  transformation by Transformation Priority Premise (TPP) priority, and to explain the
  transformations and their ordering on demand. Use it as a coach when the ask is which minimal
  change makes a failing (red) test pass, and when the user mentions TPP, transformation
  priority, the transformation priority
  list, the next transformation, or asks what a transformation such as (constant -> scalar) or
  ({} -> nil) means or why the ordering is what it is. Do not use it to choose or write the next
  failing test, or to judge whether a test is a good test -- that is the red step; use lz-red
  instead. Do not use it to clean up, tidy, restructure, or de-duplicate working code without
  changing what it does -- that is the refactor step; use lz-refactor instead. An ask to add a new
  behavior or change what working code does starts at lz-red, which writes the failing test, and
  comes back here once that test is red. Do not use it for generic write-a-function, write-code, or
  plain refactoring requests that are not about choosing the next transformation during TDD.
---

# lz-tpp: Transformation Priority Premise coach

This skill operationalizes Robert C. Martin's Transformation Priority Premise (TPP): during
red-green-refactor TDD, prefer the simplest (highest-priority) code transformation that makes
the current failing test pass. It runs in two modes and routes by intent.

## Two modes

- Coach mode: the request asks for a move on code -- most often which minimal change makes a failing
  test pass, the green step. Run the coach decision procedure below; step 1 classifies the ask. When
  step 1 settles the ask as the green step, recommend a NAMED next transformation. When it routes the
  ask to the red step or the refactor step instead, hand the request to that sibling skill. When it
  finds no skill in the loop owns the request, its branch (e) answers directly. This gate chooses
  coach versus reference only: it never decides ownership and never declines a request itself.
- Reference mode: otherwise -- the request is "explain TPP", "why this order", "what does (X) mean",
  or an explicit `/lz-tdd:lz-tpp` invocation with nothing to coach. Explain the transformations and
  their ordering rationale FROM references/transformations.md; do not restate the list here.

## Transformations vs refactorings

A transformation changes behavior to make a red test pass and IS ranked by the priority list.
A refactoring changes structure only, preserves behavior, and is NOT priority-ranked (it
belongs to the refactor step). Classify every candidate change before ranking it.

## The green step vs the red step (lz-red) and the refactor step (lz-refactor)

lz-tpp coaches the green / transformation step: turning a failing (red) test green by changing
behavior. Its two siblings own the neighboring steps. Deciding and writing the next failing (red)
test is the red step (lz-red). Restructuring working code without altering what it does is the
refactor step (lz-refactor). Classify the request by what the developer is asking for, before
ranking a transformation, and take the first branch that fits. An ask to make a failing test pass --
which minimal change turns this red test green -- is this step, and this step is lz-tpp. An ask
about which test comes next, what a test should assert, how to name it, or whether it is a good test
is the red step: hand off to lz-red. An ask to add a new behavior, or to change what working code
does, opens the red step first: hand off to lz-red, and it returns here to lz-tpp once that test is
red. An ask to improve structure or readability without changing behavior -- including a tidy of
code that happens to live in a test file -- is the refactor step: hand off to lz-refactor. Anything
outside those is not a red-green-refactor-loop request and no skill in this loop owns it; say so
plainly and answer directly.

## Amended red-green-refactor

- When passing a test, prefer higher-priority (lower-numbered) transformations.
- When posing a test, choose one that can be passed with a higher-priority transformation.
- When only a low-priority transformation seems to fit, backtrack: look for a simpler test.

## Coach decision procedure

1. Classify the request by what the developer is asking for, never by the state of the suite. A
   cleanup ask is a structure-only refactoring that belongs to lz-refactor, so it is never
   priority-ranked here. See "The green step vs the red step (lz-red) and the refactor step
   (lz-refactor)" above; do not restate it. Take the FIRST branch that matches:
   A developer's own report of where they are in the loop is context for the ask, not a condition
   to route on, so classify from what they are asking for next. A request carrying more than one
   ask is owned whole by its primary ask, and the secondary ask is named as a next step in the
   answer rather than routed as a second hop.
   a. Asking which test to write next -- what test comes next, what a test should assert, how to
      name it, or whether this is a good test: that is the red step, and the red step is lz-red.
   b. Asking to make a failing test pass -- which minimal change turns this red test green: that
      is the green step, and the green step is lz-tpp.
   c. Asking to add a new behavior, or to change what working code does, before any test covers
      it: hand off to lz-red first, because Law 1 gates production code behind a failing test;
      then lz-tpp ranks the transformation that turns that test green.
   d. Asking to improve structure or readability without changing behavior -- clean up this
      function, tidy this test file, de-duplicate this module -- or saying "I just finished making
      a test pass, what now?": that is the refactor step, and the refactor step is lz-refactor. A
      structure-only tidy of code that happens to live in a test file belongs there, and so does a
      target that carries no tests (characterization tests pin its behavior first). An ask about
      the test itself -- what it should assert, how it reads as a test -- is (a).
   e. None of (a) through (d): this is not a red-green-refactor-loop request and no skill in this
      loop owns it. Say so plainly, answer the question directly, and claim nothing.
2. Once branch (b) has settled this as the green step, ASSUME the phase is sound before ranking:
   one new test failing for the right reason, no unrelated test red, and the code compiles. State
   it as an assumption rather than interrogating the developer -- a make-this-test-pass ask almost
   never supplies any of the three. Ask only when something already in view contradicts it. This is
   a precondition on ranking, never a condition for routing: step 1 has already decided ownership
   from the ask alone.
3. Enumerate the candidate minimal changes that would make the red test pass.
4. Classify and map each candidate to the canonical 14-item list
   (references/transformations.md) as a behavior change (specific -> generic).
5. Recommend the highest-priority (lowest-numbered) available transformation, and NAME it
   (for example, use `(constant -> scalar)`: replace the literal 1 with the parameter n).
6. Apply the TS/JS overlay when it changes the pick: prefer `(if -> while)` and
   `(variable -> assignment)` above the recursion transformations, because JS/TS lacks
   reliable tail-call optimization -- a source-sanctioned heuristic, not a contradiction of the
   canonical list. State this whenever it changes the recommendation.
7. Impasse check. If the only transformation that passes is low-priority
   (`(expression -> function)` or `(case)`): (a) pose a different, simpler test passable by a
   higher-priority transformation (optionally skip the hard test for now); (b) check whether a
   structure-only refactoring opens a higher-priority path; (c) only then take the
   low-priority transformation, and say why it was unavoidable. Word Wrap is the classic
   illustration of this impasse.
8. Show, don't drive. Present the minimal diff and the named transformation; let the developer
   apply it and run the tests. Never edit the developer's code or run the tests
   unless explicitly asked -- coach, don't drive.

## TPP is a heuristic, not a law

The ordering is informal, roughly ordered by complexity, and language-specific; the author
himself hedges it. Treat it as a heuristic and a thinking aid: explain WHY a transformation is
preferred, and allow deviation with a stated reason. Do not frame any transformation as
mandatory.

## Reference material

- Full 14-item transformation list, provenance, and ordering rationale:
  [references/transformations.md](references/transformations.md)
- Fibonacci applied test-by-test in monotonic priority order:
  [references/fibonacci-worked-example.md](references/fibonacci-worked-example.md)
- Paired functional/imperative TypeScript plus TCO-safe recursion guidance:
  [references/typescript-and-tco.md](references/typescript-and-tco.md)
