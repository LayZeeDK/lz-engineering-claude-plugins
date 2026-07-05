# Slide Statements

*Aliases: Consolidate Duplicate Conditional Fragments.*

Use when: related code is scattered, and moving statements together would make it clearer or set up
another refactoring.

## Motivation

Code is easier to understand when things that belong together appear together. A declaration that
sits far from where it is used, or a piece of behavior split across a block, forces the reader to
hold context in their head. Sliding related statements next to each other -- typically a declaration
down to its first use -- shortens that span and often prepares the ground for an
[Extract Function](extract-function.md). The move looks trivial, but its safety hinges on whether the
statements you pass have any ordering dependency, so check before you cut.

## Mechanics

1. Identify where the fragment should go, then inspect every statement it must slide past for
   interference: the fragment must not reference anything declared in that span, nothing in that span
   may reference anything the fragment declares, and the fragment and the span must not both touch
   the same state (one reading what the other writes) or depend on side-effect ordering.
2. Cut the fragment and paste it into the target position.
3. Run the tests.

If a slide feels risky, break it into smaller slides, or lean on a tool that guarantees the move is
safe.

## Example

Before -- `discountThreshold` is declared at the top, far from the calculation that uses it:

```ts
function invoice(quantity: number, unitPrice: number): number {
  const base = quantity * unitPrice;
  const discountThreshold = 100;
  const shipping = quantity > 10 ? 0 : 5;
  const discount = quantity > discountThreshold ? base * 0.1 : 0;
  return base - discount + shipping;
}
```

After -- the declaration slides down to sit with its use; the statements it passes share no state:

```ts
function invoice(quantity: number, unitPrice: number): number {
  const base = quantity * unitPrice;
  const shipping = quantity > 10 ? 0 : 5;
  const discountThreshold = 100;
  const discount = quantity > discountThreshold ? base * 0.1 : 0;
  return base - discount + shipping;
}
```
