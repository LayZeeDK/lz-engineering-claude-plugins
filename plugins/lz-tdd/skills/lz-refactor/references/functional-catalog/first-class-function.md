# First-Class Function

Use when: an object exists only to carry a single method, and you want to pass, return, or swap that behavior as a value.
Correspondence: dissolves-from -> [Strategy](../gof-catalog/strategy.md#strategy), [Bridge](../gof-catalog/bridge.md#bridge), [Adapter](../gof-catalog/adapter.md#adapter), [Replace Conditional Logic with Strategy](../kerievsky-catalog/replace-conditional-logic-with-strategy.md#replace-conditional-logic-with-strategy), [Unify Interfaces with Adapter](../kerievsky-catalog/unify-interfaces-with-adapter.md#unify-interfaces-with-adapter), [Extract Adapter](../kerievsky-catalog/extract-adapter.md#extract-adapter), [Unify Interfaces](../kerievsky-catalog/unify-interfaces.md#unify-interfaces)
Keep the OO form when: the collaborator carries more than one method, needs identity or lifecycle, holds coordinated mutable state, or a measured hot path favors monomorphic call sites.

## Idiom

Pass, return, and store behavior as an ordinary value: a function typed as `(args) => result`. Where an object exists only to hold one method, a function of that signature carries the same contract without the surrounding class or interface, and selecting behavior becomes choosing which function to bind.

## Example

Before, a single-method strategy modeled as an interface with a class per algorithm:

```ts
interface DiscountStrategy {
  apply(price: number): number;
}

class NoDiscount implements DiscountStrategy {
  apply(price: number): number {
    return price;
  }
}

class PercentageDiscount implements DiscountStrategy {
  constructor(private readonly rate: number) {}

  apply(price: number): number {
    return price * (1 - this.rate);
  }
}

class Cart {
  constructor(private strategy: DiscountStrategy) {}

  checkout(price: number): number {
    return this.strategy.apply(price);
  }
}

const cart = new Cart(new PercentageDiscount(0.1));
const due: number = cart.checkout(100);
```

After, the algorithm is a function value; a configured variant is a returned closure:

```ts
type DiscountStrategy = (price: number) => number;

const noDiscount: DiscountStrategy = (price) => price;

const percentageDiscount =
  (rate: number): DiscountStrategy =>
  (price) =>
    price * (1 - rate);

const checkout = (strategy: DiscountStrategy, price: number): number => strategy(price);

const due: number = checkout(percentageDiscount(0.1), 100);
```

Same behavior; mechanics: run [Replace Conditional Logic with Strategy](../kerievsky-catalog/replace-conditional-logic-with-strategy.md#replace-conditional-logic-with-strategy) in reverse: collapse each single-method strategy class into a function value, run tests between steps.

## When each fits

### Strategy

A single-method algorithm object collapses to a function value that is passed or stored, and choosing a strategy is binding one function instead of instantiating a class.

### Bridge

When the abstraction varies over one operation, the implementor side becomes a function parameter rather than a parallel class hierarchy, and the two vary independently as caller and callback.

### Adapter

A one-method adapter is just a converting function, but an adapter over a multi-method interface still needs an object, so keep that N-method case as an object of functions.
