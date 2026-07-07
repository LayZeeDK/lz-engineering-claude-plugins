# State

Also known as: Objects for States

## Intent

Let an object change how it behaves as its internal condition changes, so that from the
outside it looks as though the object had switched to a different class.

## Applicability

Use it when an object's behavior depends on its state and it must change its behavior at run time depending on that state.

Reach for it when operations have large, multipart conditional statements that depend on the object's state, so that the state is represented as an enumerated constant checked all over the code.

## Consequences

- Localizes state-specific behavior and partitions behavior for different states: all
  behavior tied to a particular state lives in one object, so new states and transitions
  are added by defining new state classes rather than editing sprawling conditionals.
- Makes state transitions explicit: a transition becomes a single reassignment of the
  context's state object, an atomic change, rather than several assignments to internal
  data members that could leave the object inconsistent.
- Lets state objects be shared: when state objects hold no instance variables, contexts
  can share a single instance of each state, since the state carries only behavior.
- Trades a compact conditional for more classes: giving each state its own class increases
  the total number of classes, which is less compact than one object full of state-checking
  conditionals, but far easier to extend and keep correct as states multiply.

## Example

```ts
// State: the interface for behavior that varies with the document's state.
interface DocState {
  publish(doc: ReviewDoc): void;
  label(): string;
}

// Concrete States implement one state's behavior and drive the transitions.
class Draft implements DocState {
  publish(doc: ReviewDoc): void {
    doc.setState(new Moderation());
  }

  label(): string {
    return "draft";
  }
}

class Moderation implements DocState {
  publish(doc: ReviewDoc): void {
    doc.setState(new Published());
  }

  label(): string {
    return "moderation";
  }
}

class Published implements DocState {
  publish(): void {
    // terminal state: publishing again is a no-op
  }

  label(): string {
    return "published";
  }
}

// Context: holds a state object and delegates the state-specific behavior to it.
class ReviewDoc {
  private state: DocState = new Draft();

  setState(state: DocState): void {
    this.state = state;
  }

  publish(): void {
    this.state.publish(this);
  }

  status(): string {
    return this.state.label();
  }
}

const doc = new ReviewDoc();
doc.publish();
doc.publish();
const state = doc.status();
```

## Related patterns

- [Flyweight](flyweight.md#flyweight): explains when and how state objects that carry no per-context data can be shared.
- [Strategy](strategy.md#strategy): has the same structure but a different intent -- a strategy is chosen once by the client, whereas states swap themselves as the context evolves.
- [Singleton](singleton.md#singleton): state objects are often singletons.
