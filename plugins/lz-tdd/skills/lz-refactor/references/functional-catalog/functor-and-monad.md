# Functor and Monad

Use when: you keep unwrapping a container, applying one step, and re-wrapping it by hand at every stage of a transformation.
Correspondence: alternative-to -> [Iterator](../gof-catalog/iterator.md#iterator)
Keep the OO form when: consumers need stateful positional traversal (pause and resume), a for-of consumer must drive the walk, or the sequence is effectively infinite and you want lazy pull rather than a whole-container transform.

## Idiom

A functor is any container that offers `map`: hand it a function and it applies that function to whatever it holds, returning the same kind of container with transformed contents. A monad adds `flatMap` (also called chain) so a step that itself returns a wrapped value composes without stacking wrappers. Together they let a caller express a sequence of transformations over a container -- an optional, a result, a promise, a list -- while the wrapping stays invisible to each individual step.

## Example

Before -- the caller reaches into a boxed value, transforms it, and rebuilds the box at each stage:

```ts
class Box<T> {
  constructor(readonly value: T) {}
}

function priceWithTax(box: Box<number>): Box<number> {
  const withTax = new Box(box.value * 1.25);
  const rounded = new Box(Math.round(withTax.value * 100) / 100);

  return rounded;
}
```

After -- the box carries `map` (and `flatMap`), so the same two steps read as a chain and no site opens the container by hand. The result is the identical rounded price.

```ts
class Box<T> {
  constructor(readonly value: T) {}

  map<U>(fn: (value: T) => U): Box<U> {
    return new Box(fn(this.value));
  }

  flatMap<U>(fn: (value: T) => Box<U>): Box<U> {
    return fn(this.value);
  }
}

function priceWithTax(box: Box<number>): Box<number> {
  return box
    .map((price) => price * 1.25)
    .map((withTax) => Math.round(withTax * 100) / 100);
}
```

Same behavior; mechanics: [Combine Functions into Transform](../fowler-catalog/combine-functions-into-transform.md#combine-functions-into-transform), run tests between steps.

## When each fits

Reach for a functor or monad when you want to sequence transformations over a wrapped value and keep the wrapping out of each step -- `map` for a plain transform, `flatMap` when a step returns another wrapped value that would otherwise nest. Keep an Iterator when consumers need positional, stateful traversal: pausing, resuming, or pulling one element at a time from a possibly infinite source, none of which map and flatMap model. Note that Iterator's own dissolution is the generator idiom; this leaf is the transform-oriented alternative offered alongside it, not that dissolution.
