# Replace Function with Command

*Aliases: Replace Method with Method Object.*

Use when: a function is intricate enough -- lots of local state, or wanting to be broken up -- that
turning it into an object would help.

## Motivation

A command object wraps a single operation as an object with a method to run it. That gives the
operation a home for intermediate state as fields, room to be decomposed into smaller methods that
share that state, and a hook for undo, queuing, or lifecycle. Reach for it when a function is complex
enough that these capabilities earn their keep; a simple function is better left as a function (the
inverse).

## Mechanics

1. Create an empty command class named for the operation, with an `execute` method.
2. Move the function's body into `execute` with [Move Function](move-function.md), leaving the
   original function in place forwarding to a fresh command's `execute` so the tests stay green.
3. Make each of the function's parameters a constructor parameter stored as a field; run the tests.
4. Migrate callers to construct the command and call `execute`, then remove the forwarding function;
   test after each.
5. With the state now in fields, decompose `execute` into smaller methods that share them with
   [Extract Function](extract-function.md).

Inverse of [Replace Command with Function](replace-command-with-function.md).

## Example

Before -- a charge calculation with several intermediate steps:

```ts
function rentalCharge(days: number, dailyRate: number, memberDiscount: number): number {
  const base = days * dailyRate;
  const discount = base * memberDiscount;
  const net = base - discount;
  return net + net * 0.1;
}
```

After -- a command holds the inputs as fields, and the steps become methods that share them:

```ts
class RentalCharge {
  constructor(
    private readonly days: number,
    private readonly dailyRate: number,
    private readonly memberDiscount: number,
  ) {}

  execute(): number {
    const net = this.base() - this.discount();
    return net + net * 0.1;
  }

  private base(): number {
    return this.days * this.dailyRate;
  }

  private discount(): number {
    return this.base() * this.memberDiscount;
  }
}
```
