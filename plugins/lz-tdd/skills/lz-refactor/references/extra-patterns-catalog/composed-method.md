# Composed Method

## Intent

Build a method out of calls to a few well-named helper methods, each at a single level of
abstraction, so the method reads as a short summary of what it does rather than a tangle of
detail.

## Applicability

Use it when a method is hard to follow because it mixes high-level steps with low-level detail.

Reach for it when a method has grown long, when its sections would each deserve a name, or when readers must trace through the whole body to understand its overall shape.

## Consequences

- Makes a method read as a summary: the top-level method becomes a short sequence of
  intention-revealing calls, so a reader grasps what it does before drilling into how.
- Keeps each method at one level of abstraction: detail moves into named helpers, so no
  method mixes high-level flow with low-level steps.
- Multiplies small methods: the class gains many short methods, which reads well but adds
  navigation between them and can feel fragmented if the helpers are trivial.

## Example

```ts
interface Cart {
  readonly subtotal: number;
  readonly memberDiscount: number;
}

class Checkout {
  // Composed Method: the public method reads as a summary; each step is a well-named
  // helper at a single level of abstraction.
  total(cart: Cart): number {
    const discounted = this.applyDiscount(cart);

    return this.addTax(discounted);
  }

  private applyDiscount(cart: Cart): number {
    return cart.subtotal - cart.memberDiscount;
  }

  private addTax(amount: number): number {
    return Math.round(amount * 110) / 100;
  }
}

const checkout = new Checkout();
const due = checkout.total({ subtotal: 100, memberDiscount: 10 });
```

## Related patterns

- [Collecting Parameter](collecting-parameter.md#collecting-parameter): often paired with Composed Method when the extracted steps each contribute to one accumulating result.
- [Factory](factory.md#factory): the small, named steps a composed method calls are themselves candidates for further extraction, the same intention-revealing move applied to creation.
