# Hide Delegate

Use when: a client reaches through an object to call a method on one of its fields, coupling the client to that delegate's structure.

## Motivation

When a client calls `order.customer.region`, it must know that an order has a customer and that a
customer has a region -- so a change to that relationship ripples out to every such client. Adding a
delegating method on the server (`order.region`) hides the delegate: clients ask the server, and a
later change to the delegate touches only the server. This is encapsulation of a relationship.

## Mechanics

1. Wherever a client currently reaches the delegate for some operation, give the server a thin
   forwarding method that covers it.
2. Change the client to call the server's method instead of reaching through to the delegate, testing
   after each.
3. Once nothing outside relies on it, drop the server member that handed the delegate out.
4. Run the tests.

Inverse of [Remove Middle Man](remove-middle-man.md).

## Example

Before -- the caller reaches through Order to Customer:

```ts
class Customer {
  constructor(public region: string) {}
}

class Order {
  constructor(public customer: Customer) {}
}

const regionOf = (order: Order): string => order.customer.region;
```

After -- Order hides the delegate behind its own method:

```ts
class Customer {
  constructor(public region: string) {}
}

class Order {
  constructor(private readonly customer: Customer) {}

  get region(): string {
    return this.customer.region;
  }
}

const regionOf = (order: Order): string => order.region;
```

## Watch for

- Hiding every delegate turns the server into a maze of forwarding methods; balance this against
  [Remove Middle Man](remove-middle-man.md).
