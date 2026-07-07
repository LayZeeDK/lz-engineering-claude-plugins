# Strategy

Also known as: Policy

## Intent

Capture each member of a family of interchangeable algorithms in its own object behind a
shared interface, so the algorithm a client uses can be chosen and swapped without changing
the client.

## Applicability

Use it when many related classes differ only in their behavior, so that one configurable class can be given a choice of behaviors instead.

Reach for it when you need different variants of an algorithm, when an algorithm uses data that clients should not know about, or when a class defines many behaviors that show up as multibranch conditionals in its operations.

## Consequences

- Defines families of related algorithms: a strategy hierarchy factors out the common
  interface of a family of algorithms so a context can reuse any of them.
- Offers an alternative to subclassing the context: composing behavior with a strategy
  keeps the algorithm separate from the context, so you can vary and understand it
  independently instead of hard-wiring it by subclassing.
- Eliminates conditional statements: moving each branch of behavior into its own strategy
  class removes the large conditionals that would otherwise select behavior.
- Clients must know the strategies to choose one: a client has to understand how the
  strategies differ before it can select an appropriate one, which exposes implementation
  concerns to the client.
- Offers a choice of implementations: because the strategies share one interface, a client
  can pick among alternatives that trade off differently, for example speed against memory,
  and change that choice as its needs change.
- Can incur communication overhead: because the interface is shared by all strategies,
  some strategies receive information through it that they do not use, and simple
  strategies still pay for the shared protocol.
- Increases the number of objects: each behavior becomes its own object, so a design with
  many strategies has more small objects to create and hand around than one class with the
  behavior inlined.

## Example

```ts
// Strategy: the shared interface for a family of interchangeable algorithms.
interface ShippingStrategy {
  cost(weightKg: number): number;
}

class StandardShipping implements ShippingStrategy {
  cost(weightKg: number): number {
    return 5 + weightKg * 0.5;
  }
}

class ExpressShipping implements ShippingStrategy {
  cost(weightKg: number): number {
    return 12 + weightKg * 1.5;
  }
}

// Context: configured with a strategy and delegates the varying work to it.
class Checkout {
  constructor(private strategy: ShippingStrategy) {}

  setStrategy(strategy: ShippingStrategy): void {
    this.strategy = strategy;
  }

  quote(weightKg: number): number {
    return this.strategy.cost(weightKg);
  }
}

const checkout = new Checkout(new StandardShipping());
const standard = checkout.quote(2);
checkout.setStrategy(new ExpressShipping());
const express = checkout.quote(2);
```

## Related patterns

- [Template Method](template-method.md#template-method): varies part of an algorithm through subclassing and inheritance, whereas Strategy varies the whole algorithm through composition and delegation.
- [Decorator](decorator.md#decorator): a decorator adds behavior by wrapping an object from the outside, whereas a strategy swaps out the algorithm the object runs internally.
- [Flyweight](flyweight.md#flyweight): strategy objects usually carry no per-context state, so they make good flyweights.
