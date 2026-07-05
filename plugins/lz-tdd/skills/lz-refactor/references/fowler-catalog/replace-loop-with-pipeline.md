# Replace Loop with Pipeline

Use when: a loop walks a collection through steps -- filtering, mapping, accumulating -- that a
collection pipeline would state more directly.

## Motivation

A loop makes the reader track an accumulator and reconstruct what each iteration contributes. A
collection pipeline of operations like filter and map names each step and lets the reader follow the
data top to bottom, one transformation at a time, without holding loop state in their head. Expressing
the logic as a pipeline turns "how the collection is walked" into "what happens to the collection",
which is usually the clearer story.

## Mechanics

1. Create a variable holding the collection the loop iterates over, independent of the loop.
2. Take the topmost piece of behavior in the loop and re-express it as a pipeline operation on that
   variable, then remove that piece from the loop. Run the tests.
3. Repeat down the loop, moving one behavior at a time into the pipeline and testing after each, until
   the loop body is empty.
4. Remove the empty loop and return the pipeline's result. Run the tests.

## Example

Before -- a loop filters, then collects a field:

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

After -- the same steps read as a pipeline:

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
