# Replace Parameter with Query

*Aliases: Replace Parameter with Method.*

Use when: a function is passed a value it could work out for itself from its other inputs or state.

## Motivation

A parameter the function could determine on its own is needless work for callers and a chance for them
to pass an inconsistent value. If the function can derive the value from another parameter or from
object state it already reaches, drop the parameter and let the function query for it -- shorter call
sites, one fewer thing to get wrong. Keep the parameter, though, if removing it would force the
function into an unwanted dependency it should not own.

## Mechanics

1. If the value is computed at the call sites, make sure that computation can run inside the function
   -- extract it into a query with [Extract Function](extract-function.md) if needed.
2. Replace uses of the parameter in the body with a call to that query; run the tests.
3. Remove the parameter with [Change Function Declaration](change-function-declaration.md), updating
   each caller; test after each.

Inverse of [Replace Query with Parameter](replace-query-with-parameter.md).

## Example

Before -- the caller passes a subtotal the object could compute:

```ts
class Cart {
  constructor(private units: number, private unitPrice: number) {}

  total(subtotal: number): number {
    return subtotal * 1.2;
  }

  get subtotal(): number {
    return this.units * this.unitPrice;
  }
}
```

After -- the function queries for it, so callers cannot pass a wrong value:

```ts
class Cart {
  constructor(private units: number, private unitPrice: number) {}

  total(): number {
    return this.subtotal * 1.2;
  }

  get subtotal(): number {
    return this.units * this.unitPrice;
  }
}
```

## Watch for

- Do not turn the parameter into a query that reads mutable global state -- that swaps an honest
  parameter for a hidden dependency and costs the function its referential transparency. Keep the
  parameter in that case.
