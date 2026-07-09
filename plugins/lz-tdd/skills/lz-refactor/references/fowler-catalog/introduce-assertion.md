# Introduce Assertion

Use when: a section of code works only if some condition holds, but that assumption is left implicit.

## Motivation

Code often assumes something about its state (a rate is positive, a list is non-empty) without
saying so, and the assumption stays invisible until it breaks somewhere far away. An assertion makes
the assumption explicit: it documents the precondition for the next reader and fails loudly the moment
it is violated, turning a silent wrong answer into an obvious error. An assertion must never change
what a correct program does; removing every assertion should leave behavior identical.

## Mechanics

1. Take the assumption the code leans on without saying so, and write it down on the spot as an
   assertion.
2. Run the tests.

## Example

Before, the average silently assumes a non-empty list:

```ts
function average(values: readonly number[]): number {
  const total = values.reduce((running, value) => running + value, 0);
  return total / values.length;
}
```

After, the assumption is stated and checked:

```ts
function assert(claim: boolean, message: string): void {
  if (!claim) {
    throw new Error(message);
  }
}

function average(values: readonly number[]): number {
  assert(values.length > 0, "average needs at least one value");
  const total = values.reduce((running, value) => running + value, 0);
  return total / values.length;
}
```

## Watch for

- An assertion states something that is always true when the program is correct; do not use it to
  handle input you actually expect might be invalid: that needs real validation, not an assertion.
- Keep logic out of assertions: the program must never depend on one running, since removing them all
  must leave behavior unchanged.
