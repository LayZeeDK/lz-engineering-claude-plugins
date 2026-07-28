# Vitest and TypeScript Mechanics

Scope: the demo-stack mechanics that support the RED step in Vitest 4.x and TypeScript -- the
running test list, triangulation over examples, using doubles with restraint, the watch loop, and
reading the red bar to confirm a test fails for the right reason. This is where the
language-agnostic red guidance lands on the concrete stack; the demo stack lives here, not in the
description or the router. Type-level and property-based mechanics are named as advanced, deferred
pointers only.

> No-oracle reference: high-confidence core mapped from the public Vitest 4.x API, with no owned
> source to verify against. Original prose, no verbatim source prose or code (DST-04); API NAMES
> (it.todo, test.each, vi.fn, vi.spyOn, vi.mock) are kept as plain facts. Version-pinned to Vitest
> 4.1.10.

## it.todo: capture the running test list

- Mechanic: it.todo (also test.todo) registers a named test with no body, which the runner reports
  as a distinct pending entry rather than a pass or a fail.
- When-to-use: to park a behavior you owe the code but are not writing this instant -- the running
  test list from test selection, kept in the test file itself instead of a separate note.
- Distilled note: a todo entry is visible pressure. It keeps the next behaviors in view in the
  report without turning them into empty tests that would go green and pretend to be covered.

## test.each and it.each: triangulate over examples

- Mechanic: test.each (and its alias it.each) runs one test body over a table of rows -- an array of
  tuples with printf-style placeholders, or an array of objects addressed by name in the title.
- When-to-use: triangulation -- when one example under-specifies the behavior and you drive out the
  next case by adding another concrete row that differs in the value that matters.
- Distilled note: a table keeps the examples that select the behavior side by side and adds the next
  red case as one more row. This is the red-step SELECTION facet only; turning the examples into a
  general implementation is the green step (lz-tpp), not this table's job.

An example table drives one behavior across several concrete rows. The production body below is shown
for context only; at red time it is the not-yet-implemented form, so the rows genuinely fail:

```ts
import { describe, test, expect } from 'vitest';

// Triangulation: each row is a concrete example that selects the next case.
const cases: [input: number, expected: boolean][] = [
  [0, true],
  [1, false],
  [2, true],
];

describe('isEven', () => {
  test.each(cases)('should report %i as even=%s', (input: number, expected: boolean) => {
    // Act + Assert, one row at a time.
    expect(isEven(input)).toBe(expected);
  });
});

function isEven(value: number): boolean {
  return value % 2 === 0;
}
```

## vi.fn, vi.spyOn, vi.mock: doubles with restraint

- Mechanic: vi.fn creates a standalone spy or stub function, vi.spyOn wraps an existing method or
  accessor, and vi.mock replaces a whole module. Each observes or replaces a collaborator.
- When-to-use: sparingly, and at a boundary. The one message that genuinely warrants a double is the
  outgoing command -- the expect-to-send in the
  [message matrix](testing-stance/message-matrix.md). A query gives you a value to assert, so it
  needs no double.
- Distilled note: heavy mocking is a design signal, not a testing technique. When a test wants a
  double for every collaborator, listen to the tests -- that pain routes toward a functional core or
  a seam, covered in [anti-patterns.md](anti-patterns.md), not toward more doubles.

Vitest 4.x note: a mock invoked with new must use a function or class implementation -- an arrow
function throws because it is not a constructor. Value-returning arrow mocks are still fine.

## Watch mode: the fast feedback loop

- Mechanic: run bare vitest in an interactive terminal and it watches the files and re-runs the
  affected tests on every save; vitest run is the single-shot run for CI; vitest --watch forces watch
  explicitly.
- When-to-use: while writing the failing test. Watch mode closes the write-fail-read loop so the red
  bar appears the moment you save, before you hand the pass off to lz-tpp.
- Distilled note: the fast feedback is what makes the red step cheap. A test you watch go red tells
  you immediately whether it fails for the reason you intended.

## Read the red bar: fail for the right reason

- Mechanic: read WHY a test is red and WHERE the failure originated, not just that it is red. An
  AssertionError (expected X, received Y) is the sharpest red: the test ran, reached the assertion, and
  the asserted behavior is missing. A ReferenceError or a TypeError raised at the ACT LINE is also a
  valid red. Measured on the pinned toolchain (Vitest 4.1.10, tsc 6.0.3): a missing named export throws
  a TypeError at the act line, and a bare undeclared identifier throws a ReferenceError at the act
  line -- in both cases the test body RAN. Such a red is blunter than an AssertionError, because it
  names no expected value, but it is not invalid. What is not the red you hand forward is a failure
  that happens before the body runs at all: a missing MODULE fails at collection with zero tests run,
  and a build or import error never reaches the body either.
- When-to-use: the instant a new test goes red, before you write any production code to make it pass.
- Distilled note: a valid red fails for the right reason -- in the code under test -- so the green step
  has a precise target. Locate the failure before judging it: a red at the act line is real evidence
  about missing behavior, whereas a red from collection or module resolution is a prerequisite to clear
  and says nothing yet. Clear the second kind, then read the first.

## Advanced red mechanics (deferred)

Two red-step mechanics are advanced and deferred to future requirements, named here only as
pointers:

- Type-level red: expectTypeOf and assertType express failing expectations about TYPES in
  *.test-d.ts files, checked with the --typecheck flag (Vitest analyzes them statically rather than
  running them). Deferred to ADV-01 (post-0.0.3).
- Property-based red: fast-check expresses an invariant over generated inputs and shrinks a failure
  to a minimal counterexample. Deferred to ADV-02 (post-0.0.3); no fast-check dependency is added in
  this milestone.

## Fail-for-the-right-reason as a procedure

The Read-the-red-bar mechanic above is where this step gets its evidence; here that mechanic becomes
a fixed procedure step on the coach's Three-Laws spine (LAW-02). The rule: after a fresh test is
written and before a single line of production code is added, confirm the test is red for the reason
you intended. The red you hand forward must have RUN and failed, and the failure must originate in the
code under test rather than in module load, collection, or setup. An AssertionError -- expected X,
received Y -- is the sharpest form, because it names both what was expected and what arrived. A
not-implemented throw, or an error raised inside the test body at the point of use, is a valid but
blunter red: it is real evidence that the behavior is missing, not a defect in the test setup. A build,
import, module-resolution or collection failure is different in kind -- it is a prerequisite to clear
before any red means anything. A test that passes the instant it is written while driving new behavior
is a false green: it asserts what the code already does and drives nothing out. The one carve-out is
the characterization test, which is green by construction because it pins existing behavior rather than
driving new behavior; it is a pin, not a driver, and it is not required to go red.

Only when the red originates in the code under test does the failing test become a precise target for
the green step, which is lz-tpp's job. This procedure step is the gate between choosing the test and
handing it off: a red that ran and failed in the code under test passes forward; a collection or build
failure is cleared first, and a false green sends you back to sharpen the test.

Instrument divergence, recorded rather than hidden. This project's own RED evaluation gate implements
the assertion-only form of this rule -- it accepts an AssertionError and nothing else. That is STRICTER
THAN the criterion stated above, and stricter than every owned source: Clean Code makes a build failure
a legitimate red outright, Beck's instruction is to clear the compile error and then run and fail,
Fowler puts the boundary at an exception raised in an earlier phase, and Meszaros treats an error as a
legitimate, equally severe red that you are told NOT to convert into a failure. The narrower gate is
deliberate evaluation design -- one unambiguous signal is easier to grade mechanically -- and not a
claim about doctrine, so it is left exactly as it is. A skill that silently diverges from its own
instrument has a defect; one that writes the divergence down does not.

The coach questions rather than drives here. It reads the failure with the developer and explains
which red is the right one and why -- where the failure originated, and whether it is the sharpest
form or a blunter one -- but it does not run the suite unprompted or edit the test to force the color.

## Sources

- Vitest 4.x (version-pinned 4.1.10) -- the test-list, triangulation, mocking, and watch APIs mapped
  to the red step: it.todo, test.each / it.each, vi.fn / vi.spyOn / vi.mock, and watch mode. Public
  API; no-oracle (no owned source to verify against).
- fast-check -- property-based generation, named only as a deferred ADV-02 forward-pointer, not a
  dependency of this skill. Public API; no-oracle.
