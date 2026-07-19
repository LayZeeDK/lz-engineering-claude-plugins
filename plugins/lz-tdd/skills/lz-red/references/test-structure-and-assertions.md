# Test Structure and Assertions

Scope: how to STRUCTURE a unit test and how to ASSERT well once the next test is chosen --
the arrange-act-assert and given-when-then vocabularies (both, without imposing one), assert-first,
evident test data, one concept per test, the F.I.R.S.T. properties, and the four pillars that make
an assertion pin observable behavior rather than implementation detail. This is the coach's
"now write it well" surface downstream of test selection.

> Mixed-provenance reference. The one-concept-per-test rationale that leans on Robert C. Martin's
> Clean Code is owned and oracle-verified against the clean-room source. The Bill Wake
> (arrange-act-assert), Dan North (given-when-then), and Kent Beck (assert-first, evident data)
> material is high-confidence core only, authored blind with no owned copy to check against
> (no-oracle tag). Technique NAMES are kept as plain facts; every definition below is written in
> original words, with no verbatim source prose or code (DST-04).
>
> Phase 16 fills the test-STRUCTURE slice (STR-01, STR-02). Assertion design in depth (ASRT-01,
> ASRT-02) is deferred to Phase 17 and left as a marker below.

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

## Assertions and the four pillars (Phase 17)

Assertion design in depth -- the F.I.R.S.T. properties and the four pillars of a good unit test, as
the lens for asserting observable behavior over implementation detail -- is deferred to Phase 17
(ASRT-01, ASRT-02). This section is their insertion point; their prose lands in that phase.

## Sources

- Bill Wake -- arrange-act-assert as the three-part test shape. Unowned; high-confidence core only
  (no-oracle).
- Dan North -- given-when-then as the behavioral vocabulary for the same three parts. Unowned;
  high-confidence core only (no-oracle).
- Kent Beck, Test-Driven Development by Example -- assert-first and evident test data. Unowned;
  high-confidence core only (no-oracle).
- Robert C. Martin, Clean Code (Ch. 9, Unit Tests) -- one concept per test, one reason to fail.
  Owned; oracle-verified against the clean-room source.
