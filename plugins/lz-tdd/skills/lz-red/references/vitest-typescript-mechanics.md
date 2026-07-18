# Vitest and TypeScript Mechanics

Scope: the demo-stack mechanics that support the RED step in Vitest + TypeScript -- the test-list
and triangulation APIs, type-level assertions, mocking restraint, the watch loop, property-based
generation, and confirming a test "fails for the right reason". This is where the language-agnostic
red guidance lands on the concrete stack; the demo stack lives here, not in the description or the
router.

> Populated in Phase 17. Satisfies VIT-01, VIT-02. Source cluster: Vitest 4.x, fast-check.
> No verbatim source prose or code (DST-04). Worked TypeScript / Vitest examples are Phase 17,
> not this scaffold.

## Per-entry content contract

Each mechanic, when populated, carries:

- Mechanic -- the Vitest or fast-check facility named in original words.
- When-to-use -- the red-step move it supports (test list, triangulation, type assertion, ...).
- Distilled note -- how it is used in original words, with any tsc --strict-clean example
  authored in Phase 17.

Sub-topics in scope for this doc:

- Test-list capture -- `it.todo` for the running list of not-yet-written tests.
- Triangulation -- `test.each` / `it.each` for driving out the next case from concrete examples.
- Type-level assertions -- `expectTypeOf` and `assertType` for pinning behavior at the type level.
- Mocking restraint -- `vi.fn` / `vi.mock` used sparingly (listen to the tests; see anti-patterns.md).
- The watch loop -- running the failing test fast and continuously in the red step.
- Property-based generation -- fast-check for generative cases (advanced; core mechanics first).
- Fail for the right reason -- confirming the red is the intended assertion failure, not a
  compile error, import error, or wrong-fixture failure.

## Sources (placeholder)

- Vitest 4.x -- test APIs and type-level assertions (Phase 17).
- fast-check -- property-based generation (Phase 17).
