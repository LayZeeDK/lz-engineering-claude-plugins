# Transducers

Use when: a chain of map and filter over a large collection allocates a fresh intermediate array at every stage, and those passes show up in a profile.
Correspondence: alternative-to -> [Replace Loop with Pipeline](../fowler-catalog/replace-loop-with-pipeline.md#replace-loop-with-pipeline)
Keep the OO form when: the collection is small enough that the extra arrays never matter, a plain pipeline reads more clearly, or you actually want the intermediate results.

## Idiom

A transducer expresses each collection step -- a map, a filter -- as a function that wraps a reducer rather than one that produces a new collection. Because each step is just a reducer-to-reducer transformation, the steps compose into a single reducer that applies all of them per element. Folding a collection through that one reducer runs every stage in a single pass, so a multi-stage pipeline no longer builds an array between each map and filter, and the step definitions stay independent of the collection they run over.

## Example

Before -- each array method allocates its own intermediate array before the next stage runs:

```ts
function evenSquares(numbers: readonly number[]): number[] {
  return numbers.filter((n) => n % 2 === 0).map((n) => n * n);
}
```

After -- filter and map are reducer-wrapping steps composed into one reducer; a single fold applies both per element with no array between stages. The output list is identical.

```ts
type Reducer<A, T> = (accumulator: A, item: T) => A;

const mapping =
  <T, U>(fn: (item: T) => U) =>
  <A>(next: Reducer<A, U>): Reducer<A, T> =>
  (accumulator, item) =>
    next(accumulator, fn(item));

const filtering =
  <T>(keep: (item: T) => boolean) =>
  <A>(next: Reducer<A, T>): Reducer<A, T> =>
  (accumulator, item) =>
    keep(item) ? next(accumulator, item) : accumulator;

function evenSquares(numbers: readonly number[]): number[] {
  const collect: Reducer<number[], number> = (acc, n) => {
    acc.push(n);

    return acc;
  };

  const step = filtering<number>((n) => n % 2 === 0)(
    mapping<number, number>((n) => n * n)(collect),
  );

  return numbers.reduce<number[]>(step, []);
}
```

Same behavior; mechanics: [Replace Loop with Pipeline](../fowler-catalog/replace-loop-with-pipeline.md#replace-loop-with-pipeline), run tests between steps.

## When each fits

Reach for transducers when a multi-stage map/filter over a large sequence shows intermediate-array allocation in a profile and you want a single pass without giving up the composability of separate steps. Keep a plain pipeline -- the result of Replace Loop with Pipeline -- when the collection is small, when the per-stage arrays are cheap relative to the readability they buy, or when you want to see the intermediate results, since the reducer-wrapping machinery costs clarity to earn its one pass.
