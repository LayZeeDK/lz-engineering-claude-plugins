# Replace Temp with Query

Use when: a temporary variable holds the result of an expression, and you want that value reachable from other methods or to clear the way for extracting a function.

## Motivation

A temp that captures a calculation is only visible inside its own method. Turning it into a query
method makes the value available anywhere in the class, avoids repeating the calculation, and removes
a local that would otherwise block [Extract Function](extract-function.md). It fits best when the
value is computed once and does not change afterward.

## Mechanics

1. Check the variable is assigned once and yields the same result each time. If computing it has a
   side effect, first apply [Separate Query from Modifier](separate-query-from-modifier.md) so the
   calculation is pure before continuing.
2. If the variable is not already immutable, make it so and run the tests to prove it is set once.
3. Extract the assigned expression into a query method; it may keep the variable's name for now.
4. Replace each reference to the variable with a call to the query, testing after each.
5. Remove the variable's declaration.

## Example

Before, a temp holds an intermediate value:

```ts
class Invoice {
  constructor(private readonly hours: number, private readonly rate: number) {}

  get total(): number {
    const labor = this.hours * this.rate;
    return labor + labor * 0.1;
  }
}
```

After, the value is a query, reusable and free of the local:

```ts
class Invoice {
  constructor(private readonly hours: number, private readonly rate: number) {}

  get total(): number {
    return this.labor + this.labor * 0.1;
  }

  private get labor(): number {
    return this.hours * this.rate;
  }
}
```

## Watch for

- Only for a temp whose expression is idempotent and side-effect-free; if the value depends on
  mutable state that changes mid-method, a query would compute something different.
