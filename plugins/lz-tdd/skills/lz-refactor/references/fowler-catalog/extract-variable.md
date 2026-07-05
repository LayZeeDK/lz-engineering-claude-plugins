# Extract Variable

*Aliases: Introduce Explaining Variable.*

Use when: an expression is hard to read, and naming a sub-expression would explain its role.

## Motivation

A named local turns a dense expression into pieces a reader can follow, and gives each piece a label
that says what it means. The name is also a handle for a debugger. Reach for it when the explanation
belongs inside the current function; if the name would be useful more widely, prefer
[Extract Function](extract-function.md) so the name travels with the behavior.

## Mechanics

1. Confirm the expression has no side effects, so naming and reusing it changes nothing.
2. Declare a new immutable variable and set it to the expression you want to name.
3. Replace the original expression with the variable.
4. Run the tests.

Repeat for each sub-expression worth naming.

Inverse of [Inline Variable](inline-variable.md).

## Example

Before -- a single return line packs several ideas:

```ts
function finalScore(raw: number, bonus: number, penalty: number): number {
  return Math.min(100, raw + bonus * 2 - penalty * 0.5);
}
```

After -- the adjustment is named, and the cap reads as a cap:

```ts
function finalScore(raw: number, bonus: number, penalty: number): number {
  const adjusted = raw + bonus * 2 - penalty * 0.5;
  return Math.min(100, adjusted);
}
```

## Watch for

- If the name would help beyond this function, extract a function instead of a variable.
- Extract only side-effect-free expressions; naming a call that mutates state can change evaluation
  order.
