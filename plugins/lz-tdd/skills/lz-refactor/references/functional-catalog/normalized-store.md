# Normalized Store

Use when: the same entity is copied into many records, and an edit to one copy silently fails to reach the others.
Correspondence: alternative-to -> [Change Value to Reference](../fowler-catalog/change-value-to-reference.md#change-value-to-reference), [Mediator](../gof-catalog/mediator.md#mediator)
Keep the OO form when: the entities are genuine interchangeable values with no shared identity (money, dates), the copies are meant to diverge independently, or a central coordinator already owns the cross-object interaction.

## Idiom

Store each entity once in a `Map<Id, Entity>` and refer to it everywhere else by its id. A reader resolves the id back to the single record on demand, so one update is seen by every holder of the id -- there is exactly one place the entity lives. It is the functional counterpart of turning a duplicated value into a shared reference, reached without a mutable object graph: the map is the identity, the ids are the edges.

## Example

Before -- each order embeds a full copy of its customer, so renaming a customer means finding and rewriting every order that carries them:

```ts
interface Customer {
  id: number;
  name: string;
}

interface Order {
  ref: string;
  customer: Customer;
}

function customerNames(orders: readonly Order[]): string[] {
  return orders.map((order) => order.customer.name);
}
```

After -- an order holds only a `customerId`, and one `Map` holds the single customer record; a rename touches that one entry and every order sees it. Given the same data, the same names come out.

```ts
interface Customer {
  id: number;
  name: string;
}

interface Order {
  ref: string;
  customerId: number;
}

function customerNames(
  orders: readonly Order[],
  customers: ReadonlyMap<number, Customer>,
): string[] {
  return orders.map((order) => customers.get(order.customerId)?.name ?? "unknown");
}
```

Same behavior; mechanics: [Change Value to Reference](../fowler-catalog/change-value-to-reference.md#change-value-to-reference), run tests between steps.

## When each fits

Reach for a normalized store when an entity has identity and is shared across many records, so a single update must become visible everywhere at once. Keep values (the "leave it as a value" side of Change Value to Reference) when the instances are interchangeable and are allowed to drift apart independently. Keep a Mediator when the goal is to coordinate behavior between objects rather than to deduplicate shared data; Mediator's own dissolution is the reducer-and-store idiom, whereas this leaf addresses only the shared-reference concern.
