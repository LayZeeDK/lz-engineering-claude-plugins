# Replace Derived Variable with Query

Use when: a variable stores a value that could be computed from other data, kept in sync by update
code.

## Motivation

Mutable data that duplicates other data is a standing invitation to bugs: the derived variable and
the data it mirrors can drift apart whenever an update path is missed. When a value can be calculated
from its sources on demand, replacing the stored copy with a function gives you a single source of
truth and removes the whole class of stale-value defects. The exception is a value derived from data
that does not change: when the source is immutable, a stored transformation of it cannot drift, so
keeping it is fine.

## Mechanics

1. Find every place the variable is updated; if it serves more than one purpose, split those uses
   first with [Split Variable](split-variable.md).
2. Write a function that computes the value from the underlying data.
3. At each place the value is read, assert (or test) that the function's result equals the stored
   value, to confirm they agree before you switch.
4. Run the tests.
5. Replace reads of the variable with calls to the function.
6. Run the tests.
7. Remove the variable and the code that maintained it with [Remove Dead Code](remove-dead-code.md).

## Example

Before -- `total` is a derived field kept in step with `items` by hand:

```ts
class Cart {
  private items: number[] = [];
  private total = 0;

  add(price: number): void {
    this.items.push(price);
    this.total += price;
  }

  get sum(): number {
    return this.total;
  }
}
```

After -- the value is queried from its source, so it can never fall out of sync:

```ts
class Cart {
  private items: number[] = [];

  add(price: number): void {
    this.items.push(price);
  }

  get sum(): number {
    return this.items.reduce((running, price) => running + price, 0);
  }
}
```
