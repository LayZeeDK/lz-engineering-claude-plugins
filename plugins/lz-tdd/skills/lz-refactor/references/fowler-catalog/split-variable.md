# Split Variable

*Aliases: Remove Assignments to Parameters, Split Temporary Variable.*

Use when: a local variable is assigned more than once for two different purposes, rather than as a
loop counter or a collecting temp.

## Motivation

A variable should stand for one thing. When a temp is assigned a second time to hold a different
value (not accumulating, just reused), it is really two variables wearing one name, and the reader
has to track which meaning is live at each point. Splitting it into one variable per responsibility,
each named for its own role and made immutable, removes that ambiguity and often exposes a further
simplification.

## Mechanics

1. Confirm this is a split, not an accumulation: if the second assignment reads the variable's own
   prior value (a running total or similar), it is a collecting variable, so stop; it is not a
   split.
2. Rename the variable at its declaration and first assignment to a name that says what that first
   use holds; declare it immutable if the language allows.
3. Change every reference between the first and second assignment to the new name.
4. Run the tests.
5. At the second assignment, declare a fresh variable named for its own role, and update the
   references that follow it.
6. Run the tests.
7. Repeat for any further distinct assignment.

## Example

Before, `value` holds two unrelated results in turn:

```ts
function describeBox(width: number, height: number): string {
  let value = width * 2;
  const widthLabel = `width doubled: ${value}`;
  value = height * 3;
  const heightLabel = `height tripled: ${value}`;
  return `${widthLabel}, ${heightLabel}`;
}
```

After, each result gets its own single-purpose, immutable variable:

```ts
function describeBox(width: number, height: number): string {
  const doubledWidth = width * 2;
  const widthLabel = `width doubled: ${doubledWidth}`;
  const tripledHeight = height * 3;
  const heightLabel = `height tripled: ${tripledHeight}`;
  return `${widthLabel}, ${heightLabel}`;
}
```
