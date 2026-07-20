# Three Laws and Test Selection

Scope: the Three Laws of TDD spine plus how to choose the NEXT failing (red) unit test --
the running test list, taking one step at a time, starting from the degenerate or starter
case, and triangulating with another concrete example to drive out the next test. Also the
classify-first framing that keeps the red step distinct from the green step (lz-tpp) and the
refactor step (lz-refactor). This is the coach's entry point: what to test next, and why.

> Mixed-provenance reference. The selection rationale that leans on Robert C. Martin's Clean Code
> (the one-small-step / only-enough-to-fail thread) is owned and oracle-verified against the
> clean-room source. Two Kent Beck moves are likewise owned and oracle-verified against the
> clean-room source: the running test list and the one-step move, both against Canon TDD. The other
> Kent Beck selection material (the starter / degenerate case and triangulation) is high-confidence
> core only, authored blind with no full-text owned copy to check against (no-oracle tag): it rests
> on Test-Driven Development by Example, a book held summary-only in the clean-room set. Technique
> NAMES are kept as plain facts; every definition below is written in original words, with no verbatim
> source prose or code (DST-04).
>
> The Three Laws of TDD spine and the classify-first seam (LAW-01, LAW-02, SEAM-01) are present in
> the section below. Laws 1 and 2 are owned and oracle-verified against the clean-room source; the
> Law-3-as-lz-tpp-handoff reframe is lz-red orchestration (no-oracle).

## Keep a running test list

- Move: before and during a red step, hold a written test list -- a working queue of the behaviors
  you still owe the code. Each concrete example, edge case, and error path you think of but do not
  act on yet gets parked on the list.
- When-to-use: at the start of a behavior, and every time a fresh case occurs to you mid-cycle;
  record it and keep going rather than chasing it now.
- Distilled rationale: the list lets you finish the current test with full attention while nothing
  you noticed slips away. You pull the next red test from a considered queue instead of inventing
  one under pressure, so selection stays deliberate rather than ad hoc.

## Take one small step

- Move: advance by a single new failing test at a time, sized to the smallest slice of behavior not
  yet covered. Between steps every earlier test is green and the code still compiles.
- When-to-use: whenever you reach for the next test. Resist folding two behaviors into one test, and
  resist writing more of the test than it takes to make it fail.
- Distilled rationale (Robert C. Martin, owned; oracle-verified): the discipline is to grow the test
  only to the first failure, then stop -- a not-yet-defined symbol counts as that failure just as
  much as a wrong result does. Holding each increment to one small step keeps the distance between
  red and green tiny, so a red bar always names the single change that caused it and the diagnosis
  is immediate.

## Start from the degenerate or starter case

- Move: open a new behavior with its simplest or emptiest instance first -- the empty collection,
  zero, null, the no-op input -- before any interesting case.
- When-to-use: as the very first test of a behavior you have not begun, when you want a cheap way to
  stand up the function's name and shape.
- Distilled rationale: the degenerate case pins the type signature and forces the first passing
  implementation into existence with almost no logic. That gives you a green bar and a real function
  to grow, so later tests add the interesting behavior against something that already compiles.

The opening move of a new behavior is often the empty case, written before the code exists:

```ts
import { describe, it, expect } from 'vitest';

// The starter test of a new behavior: the degenerate, empty input.
describe('sumOf', () => {
  it('should be zero for an empty list', () => {
    // Arrange
    const values: number[] = [];
    // Act
    const result = sumOf(values);
    // Assert
    expect(result).toBe(0);
  });
});

function sumOf(values: number[]): number {
  return values.reduce((running, value) => running + value, 0);
}
```

## Triangulate to select the next test

- Move: when one example is not enough to tell you which test should come next, add a second (and,
  if needed, a third) concrete example that differs in the value that matters. The difference points
  at the behavior still missing and becomes the next failing test.
- When-to-use: in the red step, when the current tests would be satisfied by an implementation that
  is too specific, and you need the next failing test that rules that shortcut out.
- Distilled rationale and firewall: adding another example here is a test-SELECTION move. It chooses
  the next failing test that the current code cannot satisfy -- that is all it does on the red side.
  Turning those examples into a general implementation (faking a constant and then generalizing, or
  writing the obvious implementation outright) is the GREEN step, and choosing that transformation by
  priority is lz-tpp's job, not this coach's. Triangulation in this reference selects the next test;
  it never generalizes production code. lz-red picks the test; lz-tpp makes it pass.

## The Three Laws spine and classify-first

The red step rests on three laws that fix the order of work in a TDD cycle. They are the spine the
selection moves above hang from: the running test list, the small step, the starter case, and
triangulation all operate inside the discipline these laws impose.

- Law 1 -- gate entry (Robert C. Martin, owned; oracle-verified): write no production code until a
  failing unit test asks for it. The failing test comes first and the code that satisfies it comes
  second, so a red bar is the entry ticket to writing any behavior.
- Law 2 -- size the test (Robert C. Martin, owned; oracle-verified): write only as much of a test as
  it takes to fail, then stop and watch it fail. A reference to a symbol that does not yet exist is a
  failure just as much as a wrong assertion is -- code that does not compile counts as the red bar.
  This is the same thread as "Take one small step" above: grow the test to the first failure and no
  further (see that row for the not-yet-defined-symbol rationale in full).
- Law 3 -- the lz-tpp handoff (lz-red orchestration, no-oracle): write only as much production code as
  it takes to pass the one failing test. That is the green step, and it is lz-tpp's job, not this
  skill's. lz-red confirms the red bar fails for the right reason and hands the failing test forward;
  lz-tpp then chooses the minimal transformation that turns it green. Framing Law 3 as this forward
  handoff is the lz-red orchestration reframe, not a restatement of the law's source.

Classify first: before writing or selecting any test, sort the request into red, green, or refactor.
A failing test that must now be made to pass is the green step -- hand it off to lz-tpp and stop.
Already-passing code to clean up without changing behavior is the refactor step -- hand it off to
lz-refactor. Otherwise the work is choosing and writing the next failing test, which is lz-red: apply
the selection moves above under the Three Laws. This is the same red-vs-green-vs-refactor split the
SKILL.md router states; it is repeated here as the entry gate to the selection moves, not to re-argue
the seam.

## Sources

- Robert C. Martin, Clean Code (Ch. 9, Unit Tests) -- the Three Laws spine (Laws 1 and 2) and the
  one-small-step / only-enough-to-fail rationale for shaping the next test. Owned; oracle-verified
  against the clean-room source.
- Kent Beck, Canon TDD -- the running test list and the one-step move as test-selection moves.
  Owned; oracle-verified against the clean-room source.
- Kent Beck, Test-Driven Development by Example -- the starter / degenerate case and triangulation as
  test-selection moves. Unowned; high-confidence core only (no-oracle).
