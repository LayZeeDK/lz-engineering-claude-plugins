# Replace Nested Conditional with Guard Clauses

Use when: nested conditionals make the normal path of execution hard to pick out.

## Motivation

Conditionals come in two shapes: both legs are part of normal behavior, or one leg is an unusual case
that just needs handling. Nested if/else treats the two the same, so a reader wades through
edge-case checks to find the main flow. A guard clause handles the unusual case up front and returns
immediately, leaving the rest of the function as the clear, normal path. The intent shifts from
"which of these branches" to "deal with the odd cases, then do the real work".

## Mechanics

1. Take the outermost check for a special or early-exit case and turn it into a guard clause that
   returns (or throws) at once.
2. Run the tests.
3. Repeat for each remaining special-case check, converting it to a guard and removing the nesting.
4. Run the tests after each.
5. If several guards produce the same result, consider
   [Consolidate Conditional Expression](consolidate-conditional-expression.md).

## Example

Before: nested conditionals bury the ordinary case:

```ts
function ticketPrice(age: number, hasPass: boolean): number {
  let result: number;
  if (hasPass) {
    result = 0;
  } else {
    if (age < 12) {
      result = 5;
    } else {
      result = 10;
    }
  }
  return result;
}
```

After: guards handle the special cases, leaving the normal price last:

```ts
function ticketPrice(age: number, hasPass: boolean): number {
  if (hasPass) {
    return 0;
  }
  if (age < 12) {
    return 5;
  }
  return 10;
}
```
