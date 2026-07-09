# Preserve Whole Object

Use when: a caller pulls several values out of one object just to pass them into a function.

## Motivation

When code extracts a handful of fields from an object only to hand them to a function, the parameter
list grows and every new need means changing the signature and each caller. Passing the whole object
shortens the call, lets the function reach anything else it needs from that object without another
signature change, and can reveal that the logic belongs on the object itself.

## Mechanics

1. Create a new function that takes the whole object; in its body, call the existing function,
   deriving each of its arguments from the object's fields.
2. Compile to check the new function.
3. Redirect each caller to the new function, passing the whole object; test after each.
4. When no caller uses the original, fold it into the new function with
   [Inline Function](inline-function.md).
5. Rename the new function to the original's name if that reads better, with
   [Change Function Declaration](change-function-declaration.md).
6. If the function now uses only that object's data, consider [Move Function](move-function.md) to
   move it onto the object.

## Example

Before, the caller unpacks a bracket to pass two numbers:

```ts
interface Bracket {
  min: number;
  max: number;
}

function inBracket(min: number, max: number, amount: number): boolean {
  return amount >= min && amount <= max;
}

function qualifies(bracket: Bracket, amount: number): boolean {
  return inBracket(bracket.min, bracket.max, amount);
}
```

After, the caller passes the whole bracket:

```ts
interface Bracket {
  min: number;
  max: number;
}

function inBracket(bracket: Bracket, amount: number): boolean {
  return amount >= bracket.min && amount <= bracket.max;
}

function qualifies(bracket: Bracket, amount: number): boolean {
  return inBracket(bracket, amount);
}
```

## Watch for

- Do not preserve the whole object when the receiver should not depend on the whole, especially
  across a module boundary, where passing the entire object couples the callee to more than it needs.
