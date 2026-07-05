# Introduce Parameter Object

Use when: the same group of arguments travels together through several functions (a data clump).

## Motivation

When a clutch of values keeps moving together, replacing them with a single structure names the
relationship between them and shrinks the parameter lists that carry them. It also gives every
caller the same names for the grouped values, so the code speaks about them consistently, and it
creates a home where behavior that operates on the group can gather -- which often starts a
structure growing into a class. This is a common cure for the
[Data Clumps](../smells/data-clumps.md) smell.

## Mechanics

1. Create a structure (or type) for the group if a suitable one does not exist.
2. Run the tests.
3. Use [Change Function Declaration](change-function-declaration.md) to add the new structure as a
   parameter, and run the tests.
4. Adjust each caller to pass the structure, testing after each one.
5. Replace each use of an old individual value in the body with a read from the structure, then
   remove the now-unused individual parameters.
6. Run the tests.

Once the structure exists, behavior that uses the clump can move onto it with
[Move Function](move-function.md) or [Combine Functions into Class](combine-functions-into-class.md).

## Example

Before -- a low/high pair rides alongside the value:

```ts
function inRange(low: number, high: number, value: number): boolean {
  return value >= low && value <= high;
}
```

After -- the pair becomes one named structure:

```ts
interface Range {
  low: number;
  high: number;
}

function inRange(range: Range, value: number): boolean {
  return value >= range.low && value <= range.high;
}
```

## Watch for

- The gain comes when behavior follows the data onto the structure; a structure that only ferries
  fields is a weak result -- look for methods it could hold.
