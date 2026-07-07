# Generator

Use when: you need sequential access to a series of values and want the traversal produced lazily rather than materialized up front.
Correspondence: dissolves-from -> [Iterator](../gof-catalog/iterator.md#iterator)
Keep the OO form when: the cursor owns identity or coordinated mutable state, iteration sits on a measured hot path, traversal variants churn constantly, or the surrounding house style is object-oriented.

## Idiom

Iterator hands out an object that walks a collection one element at a time, tracking its position with paired `next`/`hasNext` calls. A generator function (`function*`) keeps that position in the language itself: each `yield` produces the next value and suspends execution until the caller asks for more, and implementing `[Symbol.iterator]` lets any object drive a `for...of` loop. The payoff is laziness -- values appear on demand, so an unbounded series you only take a prefix of costs nothing extra.

## Example

Before -- an iterator object tracks the current position by hand:

```ts
class RangeIterator {
  private current: number;

  constructor(
    private readonly end: number,
    start = 0,
  ) {
    this.current = start;
  }

  hasNext(): boolean {
    return this.current < this.end;
  }

  next(): number {
    return this.current++;
  }
}

function collect(it: RangeIterator): number[] {
  const out: number[] = [];

  while (it.hasNext()) {
    out.push(it.next());
  }

  return out;
}
```

After -- a generator yields each value; the position lives in the suspended frame:

```ts
function* range(end: number, start = 0): Generator<number> {
  for (let i = start; i < end; i++) {
    yield i;
  }
}

function collect(count: number): number[] {
  return [...range(count)];
}
```

Same behavior; mechanics: [Extract Function](../fowler-catalog/extract-function.md#extract-function), run tests between steps.

## When each fits

A generator fits when the sequence is the point and you want it produced lazily -- streaming, pagination, or an infinite series you take a bounded prefix of. The `yield` form removes the explicit position field and the `hasNext`/`next` bookkeeping, leaving the traversal as ordinary control flow. Keep an explicit iterator object only when you need random access, rewinding, or several independent cursors over the same source at once -- none of which a single generator instance provides, since it is consumed as it runs.
