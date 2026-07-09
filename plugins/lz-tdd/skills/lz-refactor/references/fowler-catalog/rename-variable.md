# Rename Variable

Use when: a variable's name does not convey what it holds, and a clearer name would capture what you now understand.

## Motivation

Names carry most of the meaning in code. As you come to understand what a variable really is, rename
it to say so. The next reader then learns it for free. The wider the variable's reach, the more a
good name is worth, and the more care the rename takes.

## Mechanics

1. If the variable is used widely (for example a field visible across a module), first apply
   [Encapsulate Variable](encapsulate-variable.md) so the rename happens behind accessors and stays
   local.
2. Find every reference to the variable.
3. Rename the declaration and each reference, then run the tests.

For a variable used only within one function, a direct rename is enough. For a widely-used constant
or other read-only value, introduce the new name as a copy of the old one, migrate references to the
copy gradually while the tests stay green, then remove the original.

## Example

Before, a terse accumulator name:

```ts
function totalCost(prices: readonly number[]): number {
  let a = 0;
  for (const p of prices) {
    a += p;
  }
  return a;
}
```

After, the name states its role:

```ts
function totalCost(prices: readonly number[]): number {
  let runningTotal = 0;
  for (const p of prices) {
    runningTotal += p;
  }
  return runningTotal;
}
```

## Watch for

- Renaming something that is part of a published interface is not a bare rename: treat it as
  [Change Function Declaration](change-function-declaration.md) and migrate consumers.
