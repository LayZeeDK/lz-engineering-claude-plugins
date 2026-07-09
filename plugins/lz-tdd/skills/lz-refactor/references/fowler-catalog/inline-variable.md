# Inline Variable

*Aliases: Inline Temp.*

Use when: a variable's name says no more than the expression it holds, and it gets in the way of further refactoring.

## Motivation

A name that merely echoes its expression adds nothing and can block a move you want to make next
(for example, it hides that a value could be a query). Fold it back into its uses.

## Mechanics

1. Confirm the right-hand expression has no side effects.
2. If the variable is not already immutable, make it so and run the tests: this proves it is
   assigned exactly once.
3. Replace the first reference to the variable with the expression.
4. Run the tests.
5. Repeat for each reference, then remove the declaration.

Inverse of [Extract Variable](extract-variable.md).

## Example

Before, the temp restates the expression:

```ts
function shippingIsFree(weight: number): boolean {
  const total = weight * 2;
  return total > 50;
}
```

After, the expression stands on its own:

```ts
function shippingIsFree(weight: number): boolean {
  return weight * 2 > 50;
}
```

## Watch for

- Keep the variable if its name genuinely explains an opaque expression. That is
  [Extract Variable](extract-variable.md) working as intended, not something to undo.
