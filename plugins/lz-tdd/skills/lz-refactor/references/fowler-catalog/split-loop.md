# Split Loop

Use when: a single loop does two different things, so you cannot change one without understanding the
other.

## Motivation

A loop that computes two things at once looks efficient but couples unrelated concerns: to modify one
you must reason about both, and neither can be extracted on its own. Splitting the loop so each does a
single thing makes each easy to name, understand, and lift into its own function (usually the real
goal), and a single-purpose loop is easier to use, since it can simply return the one value it
computes. The common objection is the cost of iterating twice; separate first for clarity and measure
before optimizing, and note that the split is often what makes optimization possible, because each
concern can then be tuned on its own.

## Mechanics

1. Copy the loop so there are two identical loops over the same collection.
2. In each copy, remove the statements that produce the other copy's result (the duplicated side
   effects) so each loop carries out only its own task. A duplicated statement with no side effect
   does no harm and can stay for now; you clean it up when you extract.
3. Run the tests.
4. Consider following up with [Extract Function](extract-function.md) on each loop, or with
   [Replace Loop with Pipeline](replace-loop-with-pipeline.md).

## Example

Before, one loop accumulates the total and finds the peak:

```ts
function stats(readings: readonly number[]): { total: number; peak: number } {
  let total = 0;
  let peak = Number.NEGATIVE_INFINITY;
  for (const reading of readings) {
    total += reading;
    if (reading > peak) {
      peak = reading;
    }
  }
  return { total, peak };
}
```

After, one loop per concern, each now easy to extract:

```ts
function stats(readings: readonly number[]): { total: number; peak: number } {
  let total = 0;
  for (const reading of readings) {
    total += reading;
  }

  let peak = Number.NEGATIVE_INFINITY;
  for (const reading of readings) {
    if (reading > peak) {
      peak = reading;
    }
  }

  return { total, peak };
}
```

## Watch for

- The double iteration is almost never the bottleneck; measure before trading this clarity away.
