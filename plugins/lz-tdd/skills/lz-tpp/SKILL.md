---
name: lz-tpp
description: >-
  This skill should be used during red-green-refactor TDD to recommend the next code
  transformation by Transformation Priority Premise (TPP) priority, and to explain the
  transformations and their ordering on demand. Use it as a coach when a failing test and the
  current code are present and the question is which minimal change makes the failing test
  pass, and when the user mentions TPP, transformation priority, the transformation priority
  list, the next transformation, or asks what a transformation such as (constant -> scalar) or
  ({} -> nil) means or why the ordering is what it is. Do not use it for generic
  write-a-function, write-code, add-a-feature, or plain refactoring requests that are not about
  choosing the next transformation during TDD.
---

# lz-tpp: Transformation Priority Premise coach

This skill operationalizes Robert C. Martin's Transformation Priority Premise (TPP): during
red-green-refactor TDD, prefer the simplest (highest-priority) code transformation that makes
the current failing test pass. It runs in two modes and routes by intent.

## Two modes

- Coach mode: the request has a failing (red) test plus the current code, and the question is
  which minimal change makes the test pass. Run the coach decision procedure below and
  recommend a NAMED next transformation.
- Reference mode: the request is "explain TPP", "why this order", "what does (X) mean", or an
  explicit `/lz-tdd:lz-tpp` invocation with no test to coach. Explain the transformations and
  their ordering rationale FROM references/transformations.md; do not restate the list here.

## Transformations vs refactorings

A transformation changes behavior to make a red test pass and IS ranked by the priority list.
A refactoring changes structure only, preserves behavior, and is NOT priority-ranked (it
belongs to the refactor step). Classify every candidate change before ranking it.

## Amended red-green-refactor

- When passing a test, prefer higher-priority (lower-numbered) transformations.
- When posing a test, choose one that can be passed with a higher-priority transformation.
- When only a low-priority transformation seems to fit, backtrack: look for a simpler test.

## Coach decision procedure

1. Confirm the green phase. Exactly one new failing (red) test, all prior tests green, and
   the code compiles -> you are choosing a transformation. If the tests are green and the
   request is "clean this up", that is a refactoring (structure-only) -- do not priority-rank
   it.
2. Enumerate the candidate minimal changes that would make the red test pass.
3. Classify and map each candidate to the canonical 14-item list
   (references/transformations.md) as a behavior change (specific -> generic).
4. Recommend the highest-priority (lowest-numbered) available transformation, and NAME it
   (for example, use `(constant -> scalar)`: replace the literal 1 with the parameter n).
5. Apply the TS/JS overlay when it changes the pick: prefer `(if -> while)` and
   `(variable -> assignment)` above the recursion transformations, because JS/TS lacks
   reliable tail-call optimization -- a source-sanctioned heuristic, not a contradiction of the
   canonical list. State this whenever it changes the recommendation.
6. Impasse check. If the only transformation that passes is low-priority
   (`(expression -> function)` or `(case)`): (a) pose a different, simpler test passable by a
   higher-priority transformation (optionally skip the hard test for now); (b) check whether a
   structure-only refactoring opens a higher-priority path; (c) only then take the
   low-priority transformation, and say why it was unavoidable. Word Wrap is the classic
   illustration of this impasse.
7. Show, don't drive. Present the minimal diff and the named transformation; let the developer
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
