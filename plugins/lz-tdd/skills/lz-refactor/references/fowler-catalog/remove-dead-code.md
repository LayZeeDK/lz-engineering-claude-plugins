# Remove Dead Code

Use when: code is no longer executed or referenced (an unused variable, function, parameter, or
branch).

## Motivation

Code that is never run still costs every reader who meets it: they must work out what it does before
realizing it does nothing, and it clutters the search for the code that matters. Deleting it is a
pure gain. Version control answers the usual hesitation ("we might need it again") by keeping the
history, so you can recover the code if a real need returns; there is no reason to keep dead code
commented out or parked in place.

## Mechanics

1. If the element could be reached from outside the current scope (an exported function, for
   instance), search for callers to confirm it really is unused.
2. Remove the dead code.
3. Run the tests.

For an unused parameter, drop it with [Change Function Declaration](change-function-declaration.md)
rather than deleting it in place.

## Example

Before, `legacyRate` is computed but never used:

```ts
function price(base: number, taxRate: number): number {
  const legacyRate = 0.05;
  const tax = base * taxRate;
  return base + tax;
}
```

After, the dead declaration is gone:

```ts
function price(base: number, taxRate: number): number {
  const tax = base * taxRate;
  return base + tax;
}
```
