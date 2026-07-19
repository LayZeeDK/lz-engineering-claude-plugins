# RED-step Anti-patterns

Scope: the failure modes to avoid when choosing and writing a failing test, plus the
listen-to-the-tests meta-rule that reads test-writing pain as design feedback rather than a cue
to mock more. This is the what-not-to-do surface the coach checks a candidate test against. It
names six RED anti-patterns, each with a cue to recognize it and an observable-behavior
correction; states the mockist counterpoint fairly; and offers the Test Desiderata lens for
weighing what a test buys and costs.

> Mixed-provenance reference. The over-mocking and test-per-class anti-pattern that leans on Ian
> Cooper's TDD talks is owned and oracle-verified against the clean-room source. The
> implementation-detail brittleness thread (Vladimir Khorikov), the mockist counterpoint (GOOS --
> Steve Freeman and Nat Pryce), and the Test Desiderata lens (Kent Beck) are high-confidence core
> only, authored blind with no owned copy to check against (no-oracle tag). Technique names are
> kept as plain facts; every description below is written in original words, with no verbatim
> source prose or code (DST-04).

## The six anti-patterns

Each entry names the failure mode, the cue that a candidate test is falling into it, and the
red-step move that avoids it. Three of them (over-mocking, private methods, snapshot-as-thinking)
share one root failure on the assertion side: the test is bound to how the code is built rather
than to what it does, so it has low resistance to refactoring -- it breaks on a behavior-preserving
change (Khorikov).

### 1. Over-mocking and test-per-class rigidity

- Anti-pattern: a suite that mirrors the production structure one-to-one -- one spec file per
  class, a test double stood up for every collaborator the class touches, and assertions that
  check a collaborator was called rather than what the code produced (Cooper).
- Recognize by: a mock or stub for nearly every constructor argument; an assertion that a method
  such as save was invoked; a fresh spec created reflexively the moment a new class is added.
- Correction: drive tests from behavior reached through the public API or port, and reserve a
  double for the one boundary that warrants it -- an outgoing command at the edge of the module.
  Add a new test when a new behavior appears, not when a new class appears. A test coupled to the
  call graph has low resistance to refactoring: rename or inline a collaborator and it fails even
  though the behavior held (Khorikov).

### 2. Testing private methods

- Anti-pattern: reaching a private method or field straight from a test, through reflection, a
  cast that strips the visibility, or an internal exported only so a test can call it.
- Recognize by: a test that casts away private or any to poke at an internal; a test that breaks
  the instant a helper is renamed, though the observable behavior is unchanged.
- Correction: exercise the private through the public API that uses it, so the test pins the
  guarantee rather than the mechanism. If the private is genuinely hard to reach that way, treat
  the difficulty as design feedback and extract the logic into a collaborator with its own public
  surface. An assertion bound to an internal name has low resistance to refactoring (Khorikov).

### 3. Multiple unrelated assertions in one test

- Anti-pattern: a single test that checks several unrelated behaviors at once, so one failure
  cannot tell you which behavior regressed.
- Recognize by: a test name joined with the word and; assertions that span different behaviors or
  different units of work inside one test body.
- Correction: keep one concept per test and split the unrelated checks into separate tests, each
  named for the one behavior it pins (the one-concept-per-test rule in
  [test-structure-and-assertions.md](test-structure-and-assertions.md)). A focused test reports
  precisely what broke.

### 4. A test that passes immediately (no red)

- Anti-pattern: a new test that is green the first time it runs, before any production code exists
  to satisfy it -- so it never showed that it can fail.
- Recognize by: a fresh test that passes immediately on its first run; an assertion so loose, or
  aimed at code that already behaves that way, that nothing was actually driven out.
- Correction: see the test fail first, for the reason you intend, before writing the code that
  makes it pass. A test that was never red proves nothing about the behavior it claims to guard.
  Reading a red bar to confirm it fails for the right reason is a mechanic in
  [vitest-typescript-mechanics.md](vitest-typescript-mechanics.md); this entry is only the
  anti-pattern, not the fail-for-the-right-reason procedure (which lands with the coach spine in a
  later phase).

### 5. Snapshot-as-thinking

- Anti-pattern: leaning on a serialized snapshot as the primary assertion and accepting whatever
  it records, then refreshing the snapshot whenever it fails without reading what changed.
- Recognize by: toMatchSnapshot standing in for a real expectation; a workflow where a failing
  snapshot is updated on reflex rather than inspected.
- Correction: assert the specific observable behavior you mean to pin, so the test states an intent
  a reader can check. Reserve snapshots for stable, serializable output you actually review on
  every change. A blindly-updated snapshot asserts nothing and has low resistance to refactoring --
  it shifts shape with the implementation (Khorikov).

### 6. Slow or order-dependent tests

- Anti-pattern: tests that are slow, or that pass only in a particular run order because they share
  mutable state or reach real I/O.
- Recognize by: a test that fails when run in isolation or in a different order; fixtures mutated
  across tests; a suite that hits a real network, clock, or filesystem.
- Correction: isolate each test's state so it neither leaks into nor depends on another, push I/O
  out to an imperative shell so the logic under test stays pure and fast, and keep each test
  independent and quick (the F.I.R.S.T. properties). The fast, isolated tests are the ones you
  actually run on every change.

## Listen to the tests

Writing the test is the first place the design pushes back. When a test needs heavy setup, a
double for every collaborator, reflection to reach a private, or an assertion that never reads
cleanly, treat that friction as feedback about the code under test -- not as a problem to mock your
way through. Adding another double to silence the friction is the move this rule warns against: it
preserves the design that caused the pain and buys a more brittle test. The friction usually points
one of two ways:

- Toward a functional core: when the awkwardness is logic tangled up with I/O, separate the
  decision from the effect so the core is a pure function you assert on by value, with no doubles.
  See [testing-stance/functional-core.md](testing-stance/functional-core.md).
- Toward a seam: when the awkwardness is that there is nowhere to get a test in at all, introduce a
  seam and pin the current behavior with a characterization test before you change anything. See
  [testing-stance/seams-and-legacy.md](testing-stance/seams-and-legacy.md).

Counterpoint (GOOS, stated fairly): the mockist, or London, school -- Steve Freeman and Nat Pryce
in Growing Object-Oriented Software, Guided by Tests -- also listens to the tests, but reads the
same friction as pressure to discover the right roles and protocols between objects, and uses mocks
at those boundaries as a design tool to drive the object relationships out. It is a coherent
position, not a strawman. This coach keeps the classicist, value-based default -- assert observable
results and reserve a double for the one warranted boundary, the outgoing command in
[testing-stance/message-matrix.md](testing-stance/message-matrix.md) -- and treats interaction
testing as the exception you reach for at a genuine boundary, not the norm. Pick the stance that
fits the code in front of you; do not impose either school wholesale.

## Test Desiderata: a tradeoff lens

Kent Beck's Test Desiderata name the properties that make a test worth having -- among them
isolated, composable, deterministic, fast, writable, readable, behavioral, structure-insensitive,
automated, specific, predictive, and inspiring. Read them as a heuristic for weighing what a test
buys and costs, not as a checklist to satisfy in full. The value of the list is the tension inside
it: several properties pull against each other, so you optimize the mix for the code in front of
you rather than maximizing every one.

Some tensions worth naming:

- Behavioral vs structure-insensitive: a test should be sensitive to a change in behavior yet
  insensitive to a change in structure -- and the second property is Khorikov's resistance to
  refactoring restated. Push sensitivity too far and the test couples to the implementation; push
  insensitivity too far and a real regression slips through.
- Writable vs readable: the test that is quickest to write is not always the one that is easiest to
  read later, and over the life of a suite the readers outnumber the writer.
- Fast vs predictive: the fastest tests exercise the least, so they predict the least about the
  whole system; the most predictive tests tend to be slower and broader.

No assignment of these maxes all at once. Naming the tradeoff -- which properties you are buying and
which you are spending -- is the lens; the heuristic is to choose deliberately per context, in the
same coach-not-law voice as the rest of this skill.

## Sources

- Ian Cooper -- the over-mocking and test-per-class anti-pattern: test behavior through the public
  API and add a test per behavior rather than per class. Owned; oracle-verified against the
  clean-room source.
- Vladimir Khorikov -- implementation-detail assertions as the low-resistance-to-refactoring
  failure mode threaded through the over-mocking, private-method, and snapshot anti-patterns.
  Unowned; high-confidence core only (no-oracle).
- GOOS (Steve Freeman and Nat Pryce), Growing Object-Oriented Software, Guided by Tests -- the
  mockist counterpoint that drives object roles out through interaction testing at boundaries.
  Unowned; high-confidence core only (no-oracle).
- Kent Beck -- the Test Desiderata, presented here as a tradeoff lens rather than a checklist.
  Unowned; high-confidence core only (no-oracle).
