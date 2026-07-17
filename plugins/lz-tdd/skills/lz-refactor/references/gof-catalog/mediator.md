# Mediator

Functional alternative: [Reducer and Store](../functional-catalog/reducer-and-store.md#reducer-and-store)

## Intent

Route the interactions among a group of objects through one coordinating object, so the
members no longer hold references to each other and the way they cooperate can be changed
in a single place.

## Applicability

Use it when a group of objects talk to each other along many tangled paths that are hard to trace and to change.

Reach for it when reusing an object is hard because it refers to and communicates with many others, or when behavior distributed among several classes should be customizable without a lot of subclassing.

## Consequences

- Limits subclassing: it localizes behavior that would otherwise be spread across many
  objects into a single mediator, so changing that collective behavior means subclassing
  only the mediator, not every colleague.
- Decouples colleagues: colleagues no longer refer to one another directly, so they can be
  varied and reused independently.
- Simplifies object protocols: it replaces many-to-many interactions among colleagues with
  one-to-many interactions between the mediator and its colleagues, which are easier to
  understand and maintain.
- Abstracts how objects cooperate: making mediation a separate concept lets you focus on
  how objects interact apart from their individual behavior.
- Centralizes control: the mediator trades interaction complexity for complexity in the
  mediator itself, which can grow into a monolith that is hard to maintain.

## Example

```ts
// Mediator: the interface colleagues use to communicate indirectly.
interface AuctionMediator {
  placeBid(bidder: Bidder, amount: number): void;
}

// Colleague: knows only the mediator, never the other colleagues.
class Bidder {
  private lastSeen = 0;

  constructor(
    readonly name: string,
    private readonly mediator: AuctionMediator,
  ) {}

  bid(amount: number): void {
    this.mediator.placeBid(this, amount);
  }

  notify(amount: number): void {
    this.lastSeen = amount;
  }
}

// Concrete Mediator: holds the interaction logic that would otherwise be scattered
// across the colleagues.
class Auction implements AuctionMediator {
  private readonly bidders: Bidder[] = [];
  private highest = 0;

  register(bidder: Bidder): void {
    this.bidders.push(bidder);
  }

  placeBid(bidder: Bidder, amount: number): void {
    if (amount <= this.highest) {
      return;
    }

    this.highest = amount;

    for (const other of this.bidders) {
      if (other !== bidder) {
        other.notify(amount);
      }
    }
  }
}

const auction = new Auction();
const alice = new Bidder("alice", auction);
auction.register(alice);
alice.bid(100);
```

## Related patterns

- [Facade](facade.md#facade): a facade also abstracts access to a group of objects, but its protocol is one-directional (clients call the facade), whereas a mediator's colleagues talk back to it.
- [Observer](observer.md#observer): colleagues can communicate with the mediator through an observer relationship.
