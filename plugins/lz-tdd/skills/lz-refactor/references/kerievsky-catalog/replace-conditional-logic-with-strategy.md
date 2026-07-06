# Replace Conditional Logic with Strategy

Use when: a conditional selects between whole algorithms, and you want to vary or extend those algorithms independently of the code that runs them.

Direction: Towards
GoF pattern: Strategy
Composed Fowler primitive(s): [Replace Conditional with Polymorphism](../fowler-catalog/replace-conditional-with-polymorphism.md#replace-conditional-with-polymorphism), [Move Function](../fowler-catalog/move-function.md#move-function), [Extract Class](../fowler-catalog/extract-class.md#extract-class)

## Motivation

When a method chooses among several complete calculations by branching on a mode, each branch is really a
separate algorithm crammed into one place, and adding or tuning one means editing the shared method again.
Moving each branch into its own object behind a common interface lets a caller hold the one algorithm it
needs and swap it without touching the others, and lets you unit-test each in isolation. Prefer it over
plain subclass polymorphism when the varying behavior is a pluggable part rather than the identity of the
host object -- the strategy is composed in, not inherited. Reach for it once the conditional guards
genuine algorithmic variation you expect to grow.

## Mechanics

1. Define an interface for the varying calculation, naming the single operation it performs.
2. For one branch, create a class implementing that interface with
   [Extract Class](../fowler-catalog/extract-class.md#extract-class), and move that branch's calculation
   into the strategy with [Move Function](../fowler-catalog/move-function.md#move-function); compile.
3. Have the host hold a strategy reference and delegate to it instead of running the branch.
4. Repeat for each remaining branch, one at a time, running the tests after each move.
5. Parameterize the host so clients supply the strategy instance rather than selecting a mode, letting
   the polymorphic call replace the conditional
   ([Replace Conditional with Polymorphism](../fowler-catalog/replace-conditional-with-polymorphism.md#replace-conditional-with-polymorphism)).
6. Once every branch is a strategy, delete the now-dead conditional and run the tests.

## Example

Before -- one function branches on the shipping mode:

```ts
type Method = "standard" | "express";

function fee(method: Method, weightKg: number): number {
  if (method === "standard") {
    return 3 + weightKg * 0.5;
  }
  return 8 + weightKg * 1.2;
}
```

After -- each mode is a strategy behind a shared interface:

```ts
interface ShippingStrategy {
  fee(weightKg: number): number;
}

class StandardShipping implements ShippingStrategy {
  fee(weightKg: number): number {
    return 3 + weightKg * 0.5;
  }
}

class ExpressShipping implements ShippingStrategy {
  fee(weightKg: number): number {
    return 8 + weightKg * 1.2;
  }
}

function fee(strategy: ShippingStrategy, weightKg: number): number {
  return strategy.fee(weightKg);
}
```

## Watch for

- A conditional that only picks a value, or that will never gain a third case, does not need a strategy --
  the extra interface and classes cost more than the branch they replace.
