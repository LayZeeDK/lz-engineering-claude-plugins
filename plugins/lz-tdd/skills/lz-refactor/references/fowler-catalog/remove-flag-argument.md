# Remove Flag Argument

*Aliases: Replace Parameter with Explicit Methods.*

Use when: a boolean or enum argument makes a function switch between distinct behaviors.

## Motivation

A flag argument hides what a call does: `book(true)` tells the reader nothing, and it forces the
function to bundle two behaviors behind one entry point. Replacing the flag with an explicit function
for each value makes every call self-documenting and each function focused on one job. Keep the flag
only when the parameter genuinely selects orthogonal data rather than switching behavior.

## Mechanics

1. Create an explicit function for each value the flag selects -- each either holding that leg's body
   or calling the original with the flag fixed.
2. For each caller that passes a literal flag, switch it to the matching explicit function; run the
   tests after each.
3. Once no caller passes a literal, remove the flag parameter -- or keep the original for callers that
   pass a computed value.

## Example

Before -- a boolean selects the calculation:

```ts
function seatPrice(base: number, premium: boolean): number {
  if (premium) {
    return base * 2;
  }
  return base;
}
```

After -- an explicit function per case:

```ts
function standardSeatPrice(base: number): number {
  return base;
}

function premiumSeatPrice(base: number): number {
  return base * 2;
}
```

## Watch for

- Removing or replacing a flagged call changes a published interface; green unit tests do not prove
  that safe for external callers. Migrate with a parallel change -- see the atomic-boundary tripwire
  in the [refactoring principles](../principles.md).
