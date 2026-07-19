# Functional core, imperative shell

Scope: the testing stance for a functional core with an imperative shell (Bernhardt FCIS) --
when the codebase pushes decisions into pure functions and I/O to a thin shell, the red-step
tests are value-based over the core (given inputs, assert the returned value) with no test
doubles, and the shell is covered by a few integration tests. Reached from the testing-stance
index when the detection signal is value-in / value-out code with no mocking.

> Owned reference: the functional-core / imperative-shell stance comes from Gary Bernhardt's talk
> Boundaries, transcribed into the clean-room set and oracle-verified against it. Original prose, no
> verbatim source prose or code (DST-04). Scoped to code that IS value-in / value-out -- no-seam
> legacy routes to seams-and-legacy.md, not here.

## Functional core vs imperative shell

- Design: the functional core holds the decision logic as pure functions that take values and
  return values and touch no I/O; the imperative shell is a thin edge that reads inputs, calls the
  core, and writes the results out.
- When-to-use: when the code under test is already value-in / value-out, or you can push the
  decision into a pure function cheaply and leave the side effects at the boundary.
- Distilled rationale: a pure core is deterministic, so a test drives it directly with plain values
  and never has to stand up the database, clock, or network the shell talks to.

## Signal: value-in, value-out code

- Signal: a function or cluster that takes values, returns a value, does no I/O, and reaches for no
  collaborator -- so a test can exercise it with literals and needs no mocking to drive it.
- When-to-use: route here when that signal holds. When it does not -- hidden I/O, statics, no seam
  to observe -- route to seams-and-legacy.md instead.
- Distilled note: a functional core is a design you achieve, not a property every codebase has. Do
  not force this stance onto code that has no core to test; that is the brownfield trap.

## Assert rule: assert the returned value (output-based)

- Assert rule (ASRT-02): feed the core its inputs and assert on the value it returns -- output-based,
  not interaction-based. The test names only the inputs and the expected result.
- When-to-use: every red-step test over the functional core.
- Distilled rationale: an output-based test over a pure function is the highest-resistance-to-
  refactoring style there is -- it couples to nothing but inputs and the returned value, so it
  survives any internal reshaping that keeps the result the same.

## Mock rule: no doubles in the core

- Mock rule: the core needs no test doubles. Purity removes the reason to mock, so a double here
  only couples the test to a shape the refactor is free to change. Keep a thin band of integration
  tests for the shell at the boundary instead.
- When-to-use: whenever you are tempted to mock a dependency of the core -- that temptation usually
  means the decision and the I/O have not been separated yet.
- Distilled note: no doubles in, no doubles out. If a piece genuinely needs a double to test, it
  belongs to the shell, and the message-matrix or seams-and-legacy stance fits it better.

An output-based red test over the pure core feeds values in and asserts the value out, with no
doubles; the shell would call this same function and persist its result:

```ts
import { describe, it, expect } from 'vitest';

// Output-based: feed the pure core its inputs and assert the returned value; no doubles.
describe('nextBalance', () => {
  it('should subtract a valid withdrawal from the balance', () => {
    // Arrange
    const balance = 100;
    const withdrawal = 30;
    // Act
    const result = nextBalance(balance, withdrawal);
    // Assert
    expect(result).toBe(70);
  });
});

// The functional core: a pure decision, no I/O. The imperative shell reads the account,
// calls nextBalance, and writes the result back.
function nextBalance(balance: number, withdrawal: number): number {
  return balance - withdrawal;
}
```

## Sources

- Gary Bernhardt, Boundaries (functional core, imperative shell) -- push the decision logic into a
  pure core tested output-based with no doubles, and cover the thin imperative shell with a few
  integration tests at the boundary. Owned (transcribed talk); oracle-verified against the clean-room
  source.
