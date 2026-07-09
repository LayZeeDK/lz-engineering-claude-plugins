# Return Modified Value

*Provenance: [web-only]. Verified against the web edition of the catalog, not the print/e-book.*

Use when: a function updates a value by mutating it in place, and the code would read more clearly if
it returned the new value instead.

## Motivation

When a function computes a new value for something, returning that value, rather than mutating a
variable the caller passed or shares, makes the data flow explicit: the reader sees exactly where
the value is set. A returned result is also easier to reason about and to compose, and it pairs
naturally with declaring the receiving variable immutable. It fits best when a single value is being
computed; needing to return several can be a sign the function is doing too much. It is also a common
first step before [Move Function](move-function.md), since a function that returns its result is
easier to relocate than one that mutates a caller's variable.

## Mechanics

1. Have the function also return the value it computes, keeping its existing in-place update for now;
   run the tests.
2. At each caller, assign the returned value to the target variable: the update still runs, so the
   value is unchanged; test after each.
3. Once every caller consumes the returned value, remove the in-place update so the function only
   computes and returns; run the tests.
4. Make the caller's variable immutable where it is set once, and rename the function's local to your
   result-naming convention; run the tests.

## Example

Before, a nested helper mutates the outer `peak` variable:

```ts
function report(readings: readonly number[]): string {
  let peak = 0;

  function recordPeak(): void {
    for (const reading of readings) {
      if (reading > peak) {
        peak = reading;
      }
    }
  }

  recordPeak();
  return `peak ${peak}`;
}
```

After, the helper returns the value; the caller assigns it to an immutable local:

```ts
function report(readings: readonly number[]): string {
  function findPeak(): number {
    let result = 0;
    for (const reading of readings) {
      if (reading > result) {
        result = reading;
      }
    }
    return result;
  }

  const peak = findPeak();
  return `peak ${peak}`;
}
```
