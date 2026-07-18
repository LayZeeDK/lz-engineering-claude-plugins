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
  to shape it. Pick and structure the next failing (red) test. (The full coach decision procedure
  is deferred to Phase 18 -- see the placeholder below.)
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

## Coach decision procedure (deferred to Phase 18)

Placeholder only. The full numbered RED procedure -- classify against the lz-tpp / lz-refactor
seams -> detect the house testing idiom -> pick the next test -> route the testing stance ->
structure the test -> assert observable behavior -> confirm it fails for the right reason -> hand
off to lz-tpp -- is authored in Phase 18 (SEAM-01, LAW-01/02, RTR-02/03). Do not infer it from
this scaffold.

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
