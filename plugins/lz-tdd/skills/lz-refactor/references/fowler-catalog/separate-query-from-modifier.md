# Separate Query from Modifier

Use when: a function both returns a value and changes observable state, so callers cannot ask the
question without causing the effect.

## Motivation

A function that returns a value should have no observable side effect. This is the command-query separation
principle. When one function both answers a question and changes state, callers are forced to trigger
the change every time they want the answer, and the code is harder to reason about, reuse, and test.
Splitting it into a pure query and a separate modifier lets each be called on its own, and makes the
side effect visible where it happens.

## Mechanics

1. Copy the function and name the copy for the value it returns. This becomes the query.
2. Strip every side effect out of the query so it only computes and returns; run the tests.
3. For each caller of the original, add a call to the query and take the value from it, leaving the
   original call in place for its side effect; test after each.
4. Remove the return value from the original so it is now a pure modifier.
5. Run the tests.

## Example

Before, one function computes the total and also records it:

```ts
const log: number[] = [];

function totalAndRecord(values: readonly number[]): number {
  let sum = 0;
  for (const value of values) {
    sum += value;
  }
  log.push(sum);
  return sum;
}
```

After, a pure query and a separate modifier:

```ts
const log: number[] = [];

function total(values: readonly number[]): number {
  let sum = 0;
  for (const value of values) {
    sum += value;
  }
  return sum;
}

function recordTotal(values: readonly number[]): void {
  log.push(total(values));
}
```

## Watch for

- Splitting a published function changes its interface; green unit tests do not prove that safe for
  external callers. Migrate with a parallel change. See the atomic-boundary tripwire in the
  [refactoring principles](../principles.md).
