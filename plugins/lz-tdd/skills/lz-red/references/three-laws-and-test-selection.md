# Three Laws and Test Selection

Scope: the Three Laws of TDD spine plus how to choose the NEXT failing (red) unit test --
the running test list, taking one step at a time, starting from the degenerate or starter
case, and triangulating with another concrete example to drive out the next test. Also the
classify-first framing that keeps the red step distinct from the green step (lz-tpp) and the
refactor step (lz-refactor). This is the coach's entry point: what to test next, and why.

> Populated in Phase 16 (test-selection: SEL-01, SEL-02) + Phase 18 (Three Laws and the
> classify-first seam: LAW-01, LAW-02, SEAM-01) -- co-edited across both phases. Satisfies
> SEL-01, SEL-02, LAW-01, LAW-02, SEAM-01. Source cluster: Robert C. Martin (RCM, owned),
> Kent Beck (unowned -> high-confidence core only, no-oracle).
> No verbatim source prose or code (DST-04).

## Per-entry content contract

Each selection move, when populated, carries:

- Move -- the selection heuristic named in original words (test list, one step, degenerate
  first, triangulation).
- When-to-use -- the situation in the red step that calls for it.
- Distilled rationale -- why it produces a well-chosen next failing test, in original words.

Sub-topics in scope for this doc:

- The Three Laws of TDD spine -- write no production code except to pass a failing test;
  write no more of a test than is sufficient to fail; write no more production code than is
  sufficient to pass. Stated in original words.
- The running test list -- capturing the behaviors still to pin as a working queue.
- One step at a time -- one new failing test, all prior tests green, code compiling.
- Degenerate / starter case -- opening from the simplest or empty case.
- Triangulation -- adding a second concrete example to force the next generalization,
  described as a RED-phase test-selection facet (the green-side generalization is lz-tpp).
- Classify-first seam framing -- deciding red vs green vs refactor before writing anything.

## Sources (placeholder)

- Robert C. Martin -- the Three Laws of TDD (owned; oracle-verified at the Phase 16 checkpoint).
- Kent Beck -- test-list and triangulation from test-driven development (unowned;
  high-confidence core only, no-oracle tag; Phases 16 + 18).
