# Facade

Functional alternative: [Module Namespace](../functional-catalog/module-namespace.md#facade)

## Intent

Put one higher-level entry point in front of a subsystem's many classes, so the tasks
clients usually need are reachable through a single simple interface rather than through
the subsystem's individual parts.

## Applicability

Use it when most clients need only the common, default behavior of a complex subsystem and would be better served by one simple entry point.

Reach for it when clients are entangled with a subsystem's implementation classes and you want to loosen that coupling, or when you are organizing a system into layers and want each layer reached through one front door.

## Consequences

- Shields clients from subsystem components: it reduces the number of objects clients deal
  with and makes the subsystem easier to use for the common case.
- Promotes weak coupling between the subsystem and its clients: because clients talk to
  the facade rather than to subsystem classes directly, the components behind it can
  change without disturbing client code, which also helps layer the system.
- Does not hide the subsystem from clients that need more: the facade offers a simplified
  view but does not prevent a client that needs finer control from using the subsystem
  classes directly.

## Example

```ts
// Subsystem classes: each does one focused job and is unaware of the facade.
class Inventory {
  reserve(sku: string, quantity: number): boolean {
    return quantity > 0 && sku.length > 0;
  }
}

class Payments {
  charge(amount: number): boolean {
    return amount > 0;
  }
}

class Shipping {
  schedule(sku: string): string {
    return `ship:${sku}`;
  }
}

// Facade: one entry point that wires the subsystem together for the common workflow.
class CheckoutFacade {
  private readonly inventory = new Inventory();
  private readonly payments = new Payments();
  private readonly shipping = new Shipping();

  place(sku: string, quantity: number, amount: number): string | undefined {
    if (!this.inventory.reserve(sku, quantity)) {
      return undefined;
    }

    if (!this.payments.charge(amount)) {
      return undefined;
    }

    return this.shipping.schedule(sku);
  }
}

const checkout = new CheckoutFacade();
const tracking = checkout.place("book-1", 1, 25);
```

## Related patterns

- [Abstract Factory](abstract-factory.md#abstract-factory): can be used with a facade to create subsystem objects in a subsystem-independent way, or can itself act as a facade over creation.
- [Mediator](mediator.md#mediator): also centralizes, but a mediator coordinates communication between colleague objects that know it, whereas a facade only simplifies access to a subsystem that does not know the facade.
- [Singleton](singleton.md#singleton): a facade is frequently the only one of its kind, so it is often realized as a singleton.
