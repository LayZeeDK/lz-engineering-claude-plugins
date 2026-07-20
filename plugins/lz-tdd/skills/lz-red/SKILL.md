---
name: lz-red
description: >-
  This skill should be used during the red step of red-green-refactor TDD to choose and write the
  next FAILING (red) unit test well: which test to write next, keeping a running test list,
  starting from the degenerate or starter case, triangulating with another concrete example to
  drive out the next test, structuring the test (arrange-act-assert or given-when-then), naming
  it for the behavior it pins, asserting observable behavior rather than implementation detail,
  and confirming it fails for the right reason. Use it whenever a developer asks what test to
  write next, how to write or structure a unit test, whether a test is a good test, or how to
  match the codebase's existing testing stance -- even when they only ask "what should I test
  here?" or "is this a good test?". Do NOT use it to make an existing failing test pass or to
  pick the minimal code change that turns the bar green -- that is the green/transformation step;
  use lz-tpp instead. Do NOT use it to restructure, clean up, or de-duplicate code whose tests
  already pass -- that is the refactor step; use lz-refactor instead.
---

# lz-red: RED-phase TDD coach

This skill drives the red step of red-green-refactor TDD: it helps choose and write the next
FAILING (red) unit test well, and explains RED-step concepts on demand. It runs in two modes and
routes by intent. Making that failing test pass by changing behavior is the green step and its
sibling skill lz-tpp; restructuring passing code without changing behavior is the refactor step
and its sibling skill lz-refactor.

## Two modes

- Coach mode: a codebase is in view and the question is which failing test to write next or how
  to shape it. Pick and structure the next failing (red) test via the coach decision procedure
  below.
- Reference mode: the request is "explain this RED concept" (test selection, triangulation, test
  structure, naming, the testing stance, an anti-pattern), or an explicit `/lz-tdd:lz-red`
  invocation with nothing to coach. Answer from the reference files listed below; do not restate
  their content here.

## RED vs the green step (lz-tpp) and the refactor step (lz-refactor)

The red step (choose and write the next failing test) is lz-red. Making that failing test pass by
changing behavior is the green / transformation step (lz-tpp). Restructuring passing code without
changing behavior is the refactor step (lz-refactor). Classify the request before acting: if a
failing test must be made to pass, hand off to lz-tpp; if already-passing code must be cleaned up,
hand off to lz-refactor; otherwise, choosing and writing the next failing test is this skill.

## Listen to the tests

RED guidance is a heuristic and a thinking aid, not a law. When a test is hard to write -- heavy
setup, many doubles, an awkward assertion -- treat that pain as design feedback about the code
under test, not as a cue to mock more. Explain WHY a given test is the next one to write, and
allow a reasoned deviation. Do not frame any single test-selection or structuring rule as
mandatory.

## Coach decision procedure

Run these steps in order on a coach-mode request. Each step is a move plus a pointer to the
reference leaf that carries the detail; do not restate a leaf's content here.

1. Classify the request against the lz-tpp and lz-refactor seams. A failing test that must be made
   to pass is the green step: hand off to lz-tpp and stop. Already-passing code to clean up is the
   refactor step: hand off to lz-refactor. Otherwise choosing and writing the next failing test is
   this skill's work. See "RED vs the green step (lz-tpp) and the refactor step (lz-refactor)" above;
   do not restate it.
2. Hold the Three Laws spine. Law 1 gates entry: write no production code until a failing test asks
   for it. Law 2 sizes the test: grow it only to the first failure, and a reference to a
   not-yet-defined symbol counts as that failure. (Law 3 is step 6.) The owned spine and the
   test-selection moves -- running test list, one small step, the degenerate starter case, and
   triangulation -- live in
   [references/three-laws-and-test-selection.md](references/three-laws-and-test-selection.md); read it
   to decide which test comes next.
3. Detect the house test idiom, then route the stance. Match the shape of the existing tests first,
   then route by structural control and seam availability through the route table in
   [references/testing-stance/README.md](references/testing-stance/README.md), and open the routed leaf
   to act. State the route you took and why. If the developer states a stance preference in plain
   language -- for example "test this as a functional core", "use the message-matrix stance", or
   "characterize it" -- honor that override over the auto-route and still state the route chosen. The
   override is natural language; there is no flag.
4. Structure the test and assert observable behavior. Shape it arrange-act-assert (or
   given-when-then) and assert what the code does, not how it does it, per
   [references/test-structure-and-assertions.md](references/test-structure-and-assertions.md); do not
   restate it.
5. Confirm it fails for the right reason. The fresh test must fail on its assertion -- an
   AssertionError on the behavior it pins -- not on a compile, import, or setup error, and it must not
   pass immediately (a false green); F.I.R.S.T. is the quality baseline. Explain which failure is the
   right one and why; do not run the suite unprompted. The red-bar mechanics are in
   [references/vitest-typescript-mechanics.md](references/vitest-typescript-mechanics.md) and the
   F.I.R.S.T. baseline in
   [references/test-structure-and-assertions.md](references/test-structure-and-assertions.md).
6. Hand off forward to lz-tpp. Once the test is red for the right reason, making it pass is Law 3 --
   the green step, and that is lz-tpp's job, not this skill's.

The RED path end to end (Vitest + TypeScript). Classify (step 1): this is new behavior, so the next
failing test is lz-red's. Pick the starter case (step 2) and shape it arrange-act-assert (step 4),
asserting the observable result (step 5). The production symbol already compiles with a wrong body, so
the bar is red for the right reason -- an AssertionError on the value, not a compile error -- and
turning it green is lz-tpp's job (step 6):

```ts
import { describe, it, expect } from 'vitest';

// RED: the starter case for a new behavior. The stub compiles, so the bar is red
// for the right reason -- an AssertionError on the value, not a missing symbol.
describe('applyDiscount', () => {
  it('should take ten percent off a total', () => {
    // Arrange
    const total = 100;
    // Act
    const net = applyDiscount(total, 10);
    // Assert
    expect(net).toBe(90);
  });
});

// Production stub: correct type signature, wrong body -- returns the total untouched.
// Not yet implemented; lz-tpp picks the transformation that turns this green.
function applyDiscount(total: number, percent: number): number {
  return total;
}
```

Coach by default; hand off, do not drive. When the request is a QUESTION or asks for advice (what
should I test next, is this a good test, how would you shape this), present the next failing test and
the smallest move and let the developer write it -- do not edit their tests or run the suite unasked.
When the request is an explicit COMMAND to write the test (write the failing test for me, add the red
test), write the failing test and then stop; making it pass is the green step (lz-tpp), so do not
drive it to green. Refusing to write the test when you were plainly asked to is the failure to avoid,
not caution.

## Reference material

- Three Laws of TDD and choosing the next failing test (test list, degenerate/starter case,
  triangulation): [references/three-laws-and-test-selection.md](references/three-laws-and-test-selection.md)
- Structuring a test and asserting observable behavior (arrange-act-assert / given-when-then, the
  four pillars): [references/test-structure-and-assertions.md](references/test-structure-and-assertions.md)
- Naming a test for the behavior it pins: [references/naming.md](references/naming.md)
- RED-step anti-patterns and the listen-to-the-tests meta-rule:
  [references/anti-patterns.md](references/anti-patterns.md)
- Vitest and TypeScript mechanics for the red step (test list, triangulation, type-level
  assertions): [references/vitest-typescript-mechanics.md](references/vitest-typescript-mechanics.md)
- Source-to-recommendation backing and owned/unowned access tiers:
  [references/principle-backing.md](references/principle-backing.md)
- Adaptive testing-stance router -- navigation index (detection signals + route table); open a
  leaf to act: [references/testing-stance/README.md](references/testing-stance/README.md)
  - Functional core, imperative shell (Bernhardt):
    [references/testing-stance/functional-core.md](references/testing-stance/functional-core.md)
  - Message matrix, query vs command (Metz + Owen):
    [references/testing-stance/message-matrix.md](references/testing-stance/message-matrix.md)
  - Seams and legacy code (Feathers):
    [references/testing-stance/seams-and-legacy.md](references/testing-stance/seams-and-legacy.md)
