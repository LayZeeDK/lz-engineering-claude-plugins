# Functional core, imperative shell

Scope: the testing stance for a functional core with an imperative shell (Bernhardt FCIS) --
when the codebase pushes decisions into pure functions and I/O to a thin shell, the red-step
tests are value-based over the core (given inputs, assert the returned value) with no test
doubles, and the shell is covered by a few integration tests. Reached from the testing-stance
index when the detection signal is value-in / value-out code with no mocking.

> Populated in Phase 17. Satisfies RTR-01, ASRT-02. Source cluster: Gary Bernhardt (FCIS;
> unowned -> high-confidence core only, no-oracle).
> No verbatim source prose or code (DST-04).

## Per-entry content contract

Each guidance point, when populated, carries:

- Signal -- the recognize-by cue that this stance fits the code under test.
- Assert rule -- what a red-step test asserts under this stance (value-based over the core).
- Mock rule -- when NOT to reach for a double (the core needs none), in original words.

Sub-topics in scope for this doc:

- Functional core vs imperative shell -- where the decision logic lives and where I/O lives.
- Value-based tests over the core -- assert on returned values, not on interactions.
- No test doubles in the core -- purity removes the need to mock.
- Covering the shell -- a thin band of integration tests at the boundary.

## Sources (placeholder)

- Gary Bernhardt -- functional core, imperative shell (unowned; high-confidence core only,
  no-oracle tag; Phase 17).
