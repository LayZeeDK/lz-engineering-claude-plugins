# Test Naming

Scope: how to NAME a unit test so the name states the behavior the test pins -- behavior-oriented
("should ...") naming as the primary convention, with Osherove's three-part
(unit-of-work / scenario / expected-behavior) naming as a design-agnostic alternative. A test name
is documentation of the behavior, not of the method under test.

> Mixed-provenance reference. The name-the-behavior-not-the-method rationale that leans on Sandi
> Metz and Katrina Owen's 99 Bottles of OOP (JavaScript Edition) is owned and oracle-verified against
> the clean-room source. The Dan North (behavior naming) and Roy Osherove (three-part naming)
> material is high-confidence core only, authored blind with no owned copy to check against (no-oracle
> tag). Technique NAMES are kept as plain facts; every definition below is written in original words,
> with no verbatim source prose or code (DST-04). NAME-01 is wholly Phase 16, so this reference is
> filled in full.

## Behavior naming (primary)

- Convention: name a test as a short sentence about what the code is supposed to do, conventionally
  opening with the word should, so the name reads as a small specification of observable behavior.
- When-to-use: as the default for new tests and new codebases; this is the primary convention this
  coach recommends.
- Distilled rationale: a name that states the behavior tells a reader what broke straight from the
  test report, without opening the test body. The name becomes documentation of intent rather than a
  label for the function that happens to be called.

## Osherove three-part naming (alternative)

- Convention: a structured convention names a test in three segments -- the unit of work under test,
  the scenario or state it runs under, and the result expected of it -- joined into one identifier.
  For example, a withdrawal test might read as: withdraw, when the balance is too low, is rejected.
- When-to-use: when the codebase already uses this three-part scheme; match it rather than
  introducing a competing style.
- Distilled rationale: the three segments make every name record what is exercised, under what
  condition, and what should result, which keeps names uniform and searchable across a suite that
  adopts the scheme.

## Name the behavior, not the method

- Convention: name a test for the behavior it pins, not for the method or function it happens to
  call. Avoid names that echo the implementation -- the method name, the class -- because those leak
  how the code works rather than what it guarantees.
- When-to-use: always, and especially watch for names that are just a function name plus a word like
  works or test.
- Distilled rationale (Sandi Metz and Katrina Owen, owned; oracle-verified): let the name describe
  the behavior the code exhibits for its callers, not the internal step that produces it. A name
  tied to behavior survives a rename or a reshaping of the code underneath it, so the suite keeps
  reading as a description of what the object does rather than a mirror of its internals.

## Match the codebase's naming stance

- Convention: before imposing any scheme, look at how the existing tests are named and match that
  stance -- should sentences, three-part identifiers, or another house convention -- so the suite
  stays consistent.
- When-to-use: when adding tests to an existing codebase that already has an established naming style.
- Distilled rationale: consistency within a suite matters more than the merits of any one convention.
  A reader scans a uniform suite faster, and a coach that respects the house style is adopted rather
  than resisted.

A behavior-oriented name reads as a sentence about what the code should do:

```ts
import { describe, it, expect } from 'vitest';

// The name states the behavior, opening with 'should'.
describe('isEven', () => {
  it('should report zero as even', () => {
    // Arrange
    const input = 0;
    // Act
    const result = isEven(input);
    // Assert
    expect(result).toBe(true);
  });
});

function isEven(value: number): boolean {
  return value % 2 === 0;
}
```

## Sources

- Dan North -- behavior-oriented naming where a test name reads as a sentence beginning with should.
  Unowned; high-confidence core only (no-oracle).
- Roy Osherove -- the three-part test-naming convention (unit of work, scenario, expected result).
  Unowned; high-confidence core only (no-oracle).
- Sandi Metz and Katrina Owen, 99 Bottles of OOP (2nd Edition, JavaScript Edition) -- naming a test
  for the behavior it pins rather than the method it calls. Owned; oracle-verified against the
  clean-room source.
