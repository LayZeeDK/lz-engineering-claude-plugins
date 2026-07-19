# Test Structure and Assertions

Scope: how to STRUCTURE a unit test and how to ASSERT well once the next test is chosen --
the arrange-act-assert and given-when-then vocabularies (both, without imposing one), assert-first,
evident test data, one concept per test, the F.I.R.S.T. properties, and the four pillars that make
an assertion pin observable behavior rather than implementation detail. This is the coach's
"now write it well" surface downstream of test selection.

> Mixed-provenance reference. Two owned threads are oracle-verified against the clean-room source:
> the one-concept-per-test rationale and the F.I.R.S.T. properties (both Robert C. Martin, Clean
> Code Ch. 9). The Kent Beck material (assert-first, evident data) is owned and oracle-verified
> against the clean-room source (Canon TDD). The Bill Wake (arrange-act-assert), Dan North
> (given-when-then), and Vladimir Khorikov (the four pillars and the output/state/communication
> assertion styles) material is high-confidence core only, authored blind with no owned copy to check
> against (no-oracle tag). Technique NAMES are kept as plain facts; every definition below is written
> in original words, with no verbatim source prose or code (DST-04).
>
> Phase 16 filled the test-STRUCTURE slice (STR-01, STR-02); Phase 17 fills the assertion-design
> slice (ASRT-01, ASRT-02). The F.I.R.S.T.-as-baseline PROCEDURE step (LAW-02) is deferred to
> Phase 18 and left as a marker below.

## One skeleton, two vocabularies

- Rule: a unit test has three parts -- set up the world, exercise the behavior once, then check the
  result. Two naming traditions describe that same shape: arrange-act-assert (Wake) and
  given-when-then (North). They are one skeleton wearing two vocabularies, not two competing designs.
- When-to-use: every test. Speak whichever vocabulary the surrounding codebase already uses and stay
  consistent with it; do not import a second convention just to follow a particular book.
- Distilled rationale: keeping the three parts visually distinct lets a reader see, at a glance, what
  was assumed, what was run, and what was expected, without untangling them. Because the shape is
  identical under both names, the choice between them is house style rather than architecture -- this
  reference imposes no single school.

## Assert-first

- Rule: write the assertion first. State the result you expect before you write the setup and the
  call that produce it, then work backwards to arrange only what that assertion needs.
- When-to-use: when you are unsure how to shape a test, or the setup is tempting you to check more
  than one thing; starting from the assertion anchors the test to a single expected result.
- Distilled rationale: naming the outcome first forces you to decide what a passing result means for
  this slice before you get lost in setup detail. The arrange and act then exist only to serve that
  one assertion, which keeps the test tight and focused on the behavior it pins.

## Evident test data

- Rule: choose test data whose relationship to the expected result is self-evident -- values where a
  reader can see why the output follows from the input, rather than opaque constants that force them
  to run the code in their head.
- When-to-use: whenever you pick the literals for a test; prefer numbers and strings whose connection
  to the expected result is obvious on sight.
- Distilled rationale: a test doubles as documentation, and evident data lets a reader confirm the
  expectation by inspection. Magic values that merely happen to work hide the very behavior the test
  is meant to explain.

## One concept per test

- Rule: let each test pin a single concept, so a failure points back to exactly one broken behavior.
  When a test grows a second, unrelated check, split it into two.
- When-to-use: when a test accumulates assertions about different behaviors, or its name needs an
  "and" to describe everything it verifies.
- Distilled rationale (Robert C. Martin, owned; oracle-verified): a test that owns exactly one
  concept turns a red bar into a precise signal -- the failure names the one behavior that broke
  instead of leaving you to work out which of several checks tripped. The suite then reads as one
  clear statement of intent per test rather than a bundle you must decode.

The same three-part shape reads under either vocabulary:

```ts
import { describe, it, expect } from 'vitest';

// One three-part shape in both vocabularies: arrange-act-assert is given-when-then.
describe('applyCredit', () => {
  it('should subtract a credit from the balance', () => {
    // Arrange (Given) a balance and a credit
    const balance = 100;
    const credit = 30;
    // Act (When) the credit is applied
    const result = applyCredit(balance, credit);
    // Assert (Then) the reduced balance comes back
    expect(result).toBe(70);
  });
});

function applyCredit(balance: number, credit: number): number {
  return balance - credit;
}
```

## Assert observable behavior: the four pillars

- Property: a good unit test maximizes four properties -- protection against regressions (it catches
  a real break), resistance to refactoring (it stays green through a behavior-preserving change),
  fast feedback (it runs quickly), and maintainability (it is cheap to read and to run). Resistance
  to refactoring is the LOAD-BEARING pillar for this coach: it is precisely "assert observable
  behavior, not implementation."
- When-to-use: every time you decide what an assertion checks. Pin the observable result a caller can
  see -- a returned value or a public state change -- never a private field, an internal call count,
  or a step the code happens to take on the way there.
- Distilled rationale: protection and resistance together are a test's accuracy -- few missed defects
  AND few false alarms. A test bound to implementation goes red on a refactor that changed nothing a
  caller can observe, and those false alarms are what erode trust until people stop reading the red
  bar. Asserting observable behavior is the single move that buys resistance to refactoring, so it is
  the property you never trade away.

## F.I.R.S.T.: the baseline the pillars sit on

- Property: beneath the four pillars sits a baseline of five properties every unit test should hold,
  named by the acronym F.I.R.S.T. -- Fast (runs in the blink of an eye, so the suite is run often),
  Independent (each test builds its own world and shares no state, so any test can run alone and in
  any order), Repeatable (returns the same verdict on every machine and every run, leaning on no
  clock, network, or leftover data), Self-validating (ends in a plain pass or fail with nothing for a
  human to eyeball), and Timely (written just before the code it drives, which is what the red step
  is).
- When-to-use: as the standing bar for every test you write; a test that surrenders one of these
  properties is a debt the suite repays later in flakiness or slowness.
- Distilled rationale (Robert C. Martin, owned; oracle-verified): these five properties are what keep
  a suite worth running -- fast and self-validating so feedback is instant and unambiguous,
  independent and repeatable so a red bar names a real defect rather than a neighbor or the weather,
  and timely so the test shapes the code instead of being bolted on afterwards.

## Select the assertion style: output, state, communication

- Rule: match the assertion style to what the unit actually does. Prefer output-based -- feed input
  and assert the returned value; it carries the highest resistance to refactoring and is the reward
  of a functional core. Reach for state-based when the behavior is a state change -- exercise the
  unit, then assert the observable state it left behind. Use communication-based ONLY for a genuine
  outgoing command -- assert that the message was sent, through the one warranted double. Fall back to
  characterization when the unit is untested legacy -- pin whatever it does now, output or state,
  before you touch it.
- When-to-use: at the moment you choose what to assert, once the next test is picked. Let the shape of
  the code choose the style; do not reach for a double when a value is sitting there to assert.
- Distilled rationale: each style maps to a testing stance, and that mapping is this rule's spine.
  Output-based is the [functional core](testing-stance/functional-core.md); state- and
  communication-based are the two sides of the Metz boundary in the
  [message matrix](testing-stance/message-matrix.md); characterization is the legacy route through
  [seams and legacy code](testing-stance/seams-and-legacy.md). Open the matching leaf for the
  assert-vs-mock rule that style carries -- this slice only chooses between them.

An output-based assertion pins the returned value, the observable result a caller sees:

```ts
import { describe, it, expect } from 'vitest';

// Output-based: assert the returned value, not any internal step.
describe('netOf', () => {
  it('should return the total minus the discount', () => {
    // Arrange
    const total = 80;
    const discount = 20;
    // Act
    const result = netOf(total, discount);
    // Assert
    expect(result).toBe(60);
  });
});

function netOf(total: number, discount: number): number {
  return total - discount;
}
```

## F.I.R.S.T. as a red-step baseline (Phase 18)

Turning F.I.R.S.T. into a PROCEDURE step -- the coach checking a fresh red test against the five
properties as part of the red-green-refactor loop (LAW-02) -- is deferred to Phase 18. This section
is that step's insertion point; the procedure lands with the coach spine in that phase.

## Sources

- Bill Wake -- arrange-act-assert as the three-part test shape. Unowned; high-confidence core only
  (no-oracle).
- Dan North -- given-when-then as the behavioral vocabulary for the same three parts. Unowned;
  high-confidence core only (no-oracle).
- Kent Beck, Canon TDD -- assert-first and evident test data. Owned; oracle-verified against the
  clean-room source.
- Vladimir Khorikov, Unit Testing: Principles, Practices, and Patterns -- the four pillars of a good
  unit test and the output/state/communication assertion styles. Unowned; high-confidence core only
  (no-oracle).
- Robert C. Martin, Clean Code (Ch. 9, Unit Tests) -- one concept per test and one reason to fail,
  and the F.I.R.S.T. properties as the test-quality baseline. Owned; oracle-verified against the
  clean-room source.
