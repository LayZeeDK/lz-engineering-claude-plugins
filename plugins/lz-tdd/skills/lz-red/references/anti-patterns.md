# RED-step Anti-patterns

Scope: the failure modes to avoid when choosing and writing a failing test, plus the
"listen to the tests" meta-rule that reads test-writing pain as design feedback rather than a
cue to mock more. Covers over-mocking and test-per-class rigidity, asserting on implementation
detail instead of observable behavior, the mockist (GOOS) counterpoint stated fairly, and the
Test Desiderata lens for weighing what a test buys. This is the "what not to do" surface the
coach checks a candidate test against.

> Populated in Phase 17. Satisfies ANTI-01, ANTI-02, RTR-03. Source cluster: Ian Cooper,
> Vladimir Khorikov, Sandi Metz, GOOS (Freeman + Pryce), Kent Beck (unowned -> no-oracle).
> No verbatim source prose or code (DST-04).

## Per-entry content contract

Each anti-pattern, when populated, carries:

- Anti-pattern -- the failure mode named in original words.
- Recognize by -- the cue that a candidate test is falling into it.
- Correction -- the red-step move that avoids it, and any counterpoint stated fairly.

Sub-topics in scope for this doc:

- Over-mocking / test-per-class rigidity -- testing implementation structure instead of behavior
  (Cooper).
- Asserting on implementation detail -- brittle tests that resist refactoring (Khorikov).
- Listen to the tests (RTR-03 meta-rule) -- test-writing pain is design feedback, not a signal
  to add more doubles.
- The mockist counterpoint -- the GOOS interaction-testing position, stated fairly alongside the
  classicist default (do not impose one school).
- Test Desiderata lens -- weighing what a test buys and costs (Beck).

## Sources (placeholder)

- Ian Cooper -- over-mocking / test-per-class (Phase 17).
- Vladimir Khorikov -- implementation-detail assertions (Phase 17).
- Sandi Metz -- behavior-over-structure (owned; Phase 17).
- GOOS (Steve Freeman + Nat Pryce) -- the mockist counterpoint (Phase 17).
- Kent Beck -- Test Desiderata (unowned; high-confidence core only, no-oracle tag; Phase 17).
