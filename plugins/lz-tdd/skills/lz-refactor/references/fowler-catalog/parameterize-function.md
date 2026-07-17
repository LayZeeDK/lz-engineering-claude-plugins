# Parameterize Function

*Aliases: Parameterize Method.*

Use when: several functions carry out the same logic differing only in a few literal values.

## Motivation

When two or more functions do the same thing apart from a baked-in constant, they are duplication in
disguise: a change to the shared logic has to be made in each copy. Combining them into one function
that takes the varying value as a parameter removes the duplication and states the shared logic once;
a new variant then becomes a call with a different argument rather than another near-identical
function.

## Mechanics

1. Pick one of the similar functions and add a parameter for the value that varies with
   [Change Function Declaration](change-function-declaration.md); update its callers to pass the
   literal they use.
2. Replace the baked-in literal in the body with the new parameter; run the tests.
3. For each remaining similar function, redirect its callers to the parameterized function with the
   right argument, then delete it; test after each.

## Example

Before, two fee functions differ only by a rate:

```ts
function smallBoxFee(weight: number): number {
  return weight * 2;
}

function largeBoxFee(weight: number): number {
  return weight * 5;
}
```

After, one function takes the rate as a parameter:

```ts
function boxFee(weight: number, ratePerKg: number): number {
  return weight * ratePerKg;
}
```
