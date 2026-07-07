# Observer

Also known as: Dependents, Publish-Subscribe

Functional alternative: [Observer Callbacks](../functional-catalog/observer-callbacks.md#observer-callbacks)

## Intent

Set up a one-to-many link between a subject and its dependents so that whenever the
subject's state changes, every dependent is told and refreshes itself automatically.

## Applicability

Use it when a change to one object requires changing others, and you do not know how many objects need to change.

Reach for it when an abstraction has two aspects, one dependent on the other, and you want to reuse them separately, or when an object should notify other objects without making assumptions about who those objects are.

## Consequences

- Allows abstract coupling between subject and observers: the subject knows only that it
  holds a list of observers conforming to an interface, not their concrete classes, so the
  two can belong to different layers of a system.
- Supports broadcast communication: the subject sends its notification to every registered
  observer, and observers can be added or removed at any time without the subject's
  cooperation beyond the interface.
- Can cause unexpected updates: because observers have no knowledge of one another, a
  single change can trigger a cascade of updates whose breadth and cost are hard to
  predict, and a spurious notification can be difficult to trace.
- Modern status: publish-subscribe is now widely provided natively by languages and
  libraries (event emitters, event targets, reactive streams), so a hand-rolled
  subject/observer is often unnecessary.

## Example

```ts
// Observer: the update interface the subject calls.
interface OrderObserver {
  updated(status: string): void;
}

// Subject: maintains a list of observers and notifies them, knowing only the interface.
class Order {
  private readonly observers: OrderObserver[] = [];
  private status = "new";

  subscribe(observer: OrderObserver): void {
    this.observers.push(observer);
  }

  advance(status: string): void {
    this.status = status;

    for (const observer of this.observers) {
      observer.updated(status);
    }
  }
}

// Concrete Observer: reacts to a change without the subject knowing its class.
class WarehouseDesk implements OrderObserver {
  private readonly seen: string[] = [];

  updated(status: string): void {
    this.seen.push(status);
  }
}

const order = new Order();
order.subscribe(new WarehouseDesk());
order.advance("packed");
```

## Related patterns

- [Mediator](mediator.md#mediator): a change manager that encapsulates complex update rules between subjects and observers acts as a mediator between them.
- [Singleton](singleton.md#singleton): such a change manager is often a singleton so it is globally reachable and unique.
