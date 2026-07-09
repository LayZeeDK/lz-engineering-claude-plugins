# Adapter

Also known as: Wrapper

Functional alternative: [First-Class Function](../functional-catalog/first-class-function.md#adapter)

## Intent

Wrap an existing class in the interface a client expects, so code written against that
interface can drive a class built to a different, incompatible one that it otherwise could
not work with.

## Applicability

Use it when you need an existing class to fit an interface it was not built for.

Reach for it when a class you want to reuse does not offer the interface a client requires, or when you are building a reusable component that must cooperate with classes it was never designed around and whose own interfaces you are not free to change.

## Consequences

- Lets otherwise incompatible classes work together by translating one interface into
  another, so a client and a supplier that were never designed for each other can be
  combined without changing either.
- An object adapter (one that holds a reference to the adaptee) can adapt the adaptee and
  all of its subclasses, and can add responsibilities of its own, but it makes overriding
  the adaptee's behavior harder because the adaptee is wrapped rather than subclassed.
- The amount of work an adapter does varies widely, from a simple interface rename to a
  substantial translation of operations and data between the two sides.

## Example

```ts
// Target: the interface the client is written against.
interface PaymentProcessor {
  charge(amountInDollars: number): boolean;
}

// Adaptee: an existing class whose interface does not match the target.
class LegacyBillingSystem {
  submitCharge(cents: number): { accepted: boolean } {
    return { accepted: cents > 0 };
  }
}

// Adapter: an object adapter that holds the adaptee and translates the target call
// (dollars) into the adaptee's own vocabulary (cents).
class LegacyBillingAdapter implements PaymentProcessor {
  constructor(private readonly billing: LegacyBillingSystem) {}

  charge(amountInDollars: number): boolean {
    const result = this.billing.submitCharge(Math.round(amountInDollars * 100));
    return result.accepted;
  }
}

const processor: PaymentProcessor = new LegacyBillingAdapter(new LegacyBillingSystem());
const paid = processor.charge(19.99);
```

## Related patterns

- [Bridge](bridge.md#bridge): has a structure similar to an object adapter, but a different intent: Bridge separates an interface from its implementation up front, whereas Adapter changes the interface of something that already exists.
- [Decorator](decorator.md#decorator): enhances an object without changing its interface, whereas Adapter gives an object a new interface.
- [Proxy](proxy.md#proxy): stands in for another object without changing its interface, unlike Adapter.
