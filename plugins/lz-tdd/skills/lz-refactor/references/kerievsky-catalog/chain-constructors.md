# Chain Constructors

Use when: several creation paths for the same class repeat the same object-building steps.

Direction: n/a
GoF pattern: n/a -- utility
Composed Fowler primitive(s): [Substitute Algorithm](../fowler-catalog/substitute-algorithm.md#substitute-algorithm), [Remove Dead Code](../fowler-catalog/remove-dead-code.md#remove-dead-code), [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration)
Functional alternative: [Factory Function](../functional-catalog/factory-function.md#factory)

## Motivation

When a class offers more than one way to be created and each path assembles the object itself, the
construction logic is copied across them, so a change to how the object is built has to be repeated in
each and can be missed in one. Chaining the constructors picks the most general creation path and has the
specific ones call it with the extra arguments filled in, so the actual building happens in exactly one
place and the specialized paths only supply their defaults. Reach for it once two or more creation paths
duplicate the same setup.

## Mechanics

1. Pick the most general creation path -- the one the others could be expressed in terms of -- and settle
   its parameter list with
   [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration).
2. Replace each specific path's body with a call to the general one, passing its fixed values, using
   [Substitute Algorithm](../fowler-catalog/substitute-algorithm.md#substitute-algorithm); compile and run
   the tests after each.
3. Remove the now-redundant setup left behind in the specific paths with
   [Remove Dead Code](../fowler-catalog/remove-dead-code.md#remove-dead-code).
4. Narrow the visibility of any creation path that no longer needs to be called from outside, so only the
   paths clients actually use stay public.
5. Run the tests and confirm every path still produces the same object it did before.

## Example

Before -- each creator repeats the assembly:

```ts
class Rational {
  constructor(
    readonly numerator: number,
    readonly denominator: number,
  ) {}
}

function fromPair(a: number, b: number): Rational {
  const numerator = a;
  const denominator = b;
  return new Rational(numerator, denominator);
}

function fromInteger(n: number): Rational {
  const numerator = n;
  const denominator = 1;
  return new Rational(numerator, denominator);
}
```

After -- the specific creator chains through the general one:

```ts
class Rational {
  constructor(
    readonly numerator: number,
    readonly denominator: number,
  ) {}
}

function fromPair(a: number, b: number): Rational {
  return new Rational(a, b);
}

function fromInteger(n: number): Rational {
  return fromPair(n, 1);
}
```

## Watch for

- Chain constructors only to remove genuine duplication in how the object is built; if two creation paths
  legitimately assemble the object differently, forcing one to call the other couples them and can add
  parameters that exist only to satisfy the chain, obscuring each path's real intent.
