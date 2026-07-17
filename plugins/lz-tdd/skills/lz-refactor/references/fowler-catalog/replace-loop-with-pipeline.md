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

The Loops smell wears several disguises. The tell is an accumulator being fed *inside* the loop --
`result.push(...)`, `map.set(key, ...)`, `set.add(...)`, a running `total +=`, or the accumulator
rebuilt from itself each pass (`tags = new Set([...tags, ...])`) -- so the body mixes bookkeeping with
the real work. In each pair below the *before* buries the intent that way and the
*after* names the step; learn to see the shape and reach for the pipeline whether the loop is a plain
`for`, a `reduce`, a Set union, or a `switch` over each element. Each snippet is self-contained and
type-checks under `tsc --strict`.

**Filter, then collect a field.** A guard-and-`push` loop is a `filter` followed by a `map`.

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

**Sum with an accumulator.** A running total folded over the collection is a `reduce`.

```ts
interface LineItem {
  readonly price: number;
  readonly quantity: number;
}

function subtotal(items: readonly LineItem[]): number {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total;
}
```

```ts
interface LineItem {
  readonly price: number;
  readonly quantity: number;
}

function subtotal(items: readonly LineItem[]): number {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}
```

**Bucket items under a key (a group-by).** A loop or `reduce` that mutates a `Map` with a nested
`if`/`else` to slot each item under its key is a group-by hiding in bookkeeping. Restate it as one
grouping step: fold each item into the array for its key.

```ts
interface Order {
  readonly customerId: string;
  readonly amount: number;
}

function ordersByCustomer(orders: readonly Order[]): Map<string, Order[]> {
  const grouped = new Map<string, Order[]>();
  for (const order of orders) {
    const bucket = grouped.get(order.customerId);
    if (bucket === undefined) {
      grouped.set(order.customerId, [order]);
    } else {
      bucket.push(order);
    }
  }
  return grouped;
}
```

```ts
interface Order {
  readonly customerId: string;
  readonly amount: number;
}

function ordersByCustomer(orders: readonly Order[]): Map<string, Order[]> {
  // Reads as "group these orders by customer". Map.groupBy expresses the same
  // step in one call where the runtime supports it; the grouping is what matters.
  return orders.reduce((grouped, order) => {
    const bucket = grouped.get(order.customerId) ?? [];
    bucket.push(order);
    return grouped.set(order.customerId, bucket);
  }, new Map<string, Order[]>());
}
```

**Union nested collections into a set.** A loop that keeps re-building a `Set` from itself plus each
item's sub-collection is a `flatMap` into a `Set`.

```ts
interface Category {
  readonly tags: readonly string[];
}

function allTags(categories: readonly Category[]): Set<string> {
  let tags = new Set<string>();
  for (const category of categories) {
    tags = new Set([...tags, ...category.tags]);
  }
  return tags;
}
```

```ts
interface Category {
  readonly tags: readonly string[];
}

function allTags(categories: readonly Category[]): Set<string> {
  return new Set(categories.flatMap((category) => category.tags));
}
```

**Classify each element into a set.** A `for` loop with a `switch` that `add`s a derived value per
element is a `map` (the classifier) followed by a `filter` (the type guard).

```ts
type Primitive = 'string' | 'number' | 'boolean';

function primitiveTypes(values: readonly unknown[]): Set<Primitive> {
  const found = new Set<Primitive>();
  for (const value of values) {
    switch (typeof value) {
      case 'string':
        found.add('string');
        break;
      case 'number':
        found.add('number');
        break;
      case 'boolean':
        found.add('boolean');
        break;
    }
  }
  return found;
}
```

```ts
type Primitive = 'string' | 'number' | 'boolean';

function primitiveTypes(values: readonly unknown[]): Set<Primitive> {
  const isPrimitive = (kind: string): kind is Primitive =>
    kind === 'string' || kind === 'number' || kind === 'boolean';
  return new Set(values.map((value) => typeof value).filter(isPrimitive));
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
