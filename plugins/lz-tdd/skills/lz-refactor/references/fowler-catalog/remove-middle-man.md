# Remove Middle Man

Use when: a class has grown so many simple delegating methods that the forwarding itself is the burden, and clients would be clearer talking to the delegate directly.

## Motivation

The opposite of [Hide Delegate](hide-delegate.md). Every delegating method is code to maintain, and
when a server does little but forward call after call to the same delegate, the indirection costs
more than it hides. Let clients reach the delegate directly. Where to sit between hiding and removing
is a judgment call that shifts as the relationship changes.

## Mechanics

1. Add an accessor on the server for the delegate, if there is not one.
2. Redirect the clients one at a time: each forwarding call becomes a call reached through the
   accessor, with a test run in between.
3. Remove the delegating method once no client uses it.

With refactoring-tool support this composes from two other refactorings: apply
[Encapsulate Variable](encapsulate-variable.md) to the delegate field, then
[Inline Function](inline-function.md) on each delegating method: inlining updates every caller in
one step, subsuming the per-client redirect and the method removal.

Inverse of [Hide Delegate](hide-delegate.md).

## Example

Before, Order forwards to Customer through a wrapper method:

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
```

After, the delegate is exposed and the forwarding method is gone:

```ts
class Customer {
  constructor(public region: string) {}
}

class Order {
  constructor(public customer: Customer) {}
}

const regionOf = (order: Order): string => order.customer.region;
```

## Watch for

- Removing too many wrappers re-couples clients to the delegate's structure; this trades against
  [Hide Delegate](hide-delegate.md), so weigh how likely that structure is to change.
