# Replace Loop with Pipeline

Use when: a loop walks a collection through steps (filtering, mapping, accumulating) that a
collection pipeline would state more directly.

## Motivation

A loop makes the reader track an accumulator and reconstruct what each iteration contributes. A
collection pipeline of operations like filter and map names each step and lets the reader follow the
data top to bottom, one transformation at a time, without holding loop state in their head. Expressing
the logic as a pipeline turns "how the collection is walked" into "what happens to the collection",
which is usually the clearer story.

Grouping is a common instance to name directly: a `reduce` or loop that mutates a `Map` (or object)
with a nested conditional to bucket items under a key is a group-by. Restate it as a single grouping
step -- fold each item into the array for its key -- so the intent reads as "group these by X" instead
of accumulator bookkeeping. Native `Map.groupBy` / `Object.groupBy` express the same step in one call
where the runtime supports them; the equivalence to the pipeline form is what matters, not the API.

## Mechanics

1. Create a variable holding the collection the loop iterates over, independent of the loop.
2. Start with whatever the loop does first: restate it as an operation applied to that variable,
   delete it from the loop body, and run the tests.
3. Repeat down the loop, moving one behavior at a time into the pipeline and testing after each, until
   the loop body is empty.
4. Remove the empty loop and return the pipeline's result. Run the tests.

## Example

Before, a loop filters, then collects a field:

```ts
interface Account {
  readonly owner: string;
  readonly active: boolean;
}

function activeOwners(accounts: readonly Account[]): string[] {
  const result: string[] = [];
  for (const account of accounts) {
    if (account.active) {
      result.push(account.owner);
    }
  }
  return result;
}
```

After, the same steps read as a pipeline:

```ts
interface Account {
  readonly owner: string;
  readonly active: boolean;
}

function activeOwners(accounts: readonly Account[]): string[] {
  return accounts
    .filter((account) => account.active)
    .map((account) => account.owner);
}
```

## Reverse direction: Replace Pipeline with Loop

The inverse refactoring exists, but clarity is the default and a pipeline is usually the clearer
story. Reverse to a plain loop only for a concrete, named reason, never on folklore.

- Measured hot path. Each `.filter().map()` stage allocates a throwaway intermediate array and
  re-walks the data, so a single loop can run measurably faster in tight, large-N passes over trivial
  per-element work (numeric loops, per-frame rendering, million-row data); in ordinary app code the
  difference is negligible and clarity wins. Confirm it in a profile first. Middle grounds keep the
  functional style: collapse the chain into one `reduce` or `for-of` to drop the intermediate arrays;
  reach for the short-circuiting `find` / `some` / `every` when the only reason for a loop was early
  exit; use a typed array for a pure numeric loop. Never accumulate with `[...acc, x]` inside a
  reduce. That is quadratic.
- Clarity, debuggability, or house style. A loop steps and breakpoints cleanly, whereas `reduce` and
  collector stages often leave nowhere to pause; `break` and `return` map awkwardly onto pipeline
  operators; and matching the surrounding idiom can matter. If the pipeline is not clearer than the
  loop it replaced, revert.
