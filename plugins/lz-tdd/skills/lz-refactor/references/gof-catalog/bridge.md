# Bridge

Also known as: Handle/Body

## Intent

Keep an abstraction and the implementation that carries it out in two separate class
hierarchies joined by a reference, so either side can be extended or replaced on its own
without forcing changes on the other.

## Applicability

Use it when both an abstraction and its implementation should be extensible by subclassing independently, so neither hierarchy is locked to the other.

Reach for it when you want to avoid a permanent binding between an abstraction and its implementation, when changes in the implementation must not affect clients, or when a class hierarchy would otherwise explode into a combinatorial product of abstraction and implementation variants.

## Consequences

- Decouples interface from implementation: because the abstraction refers to an
  implementor object rather than inheriting from it, the implementation can be selected
  or swapped at run time and is no longer bound at compile time.
- Improves extensibility: the abstraction and the implementor hierarchies can be extended
  independently, so a new abstraction or a new implementation is a single new class
  rather than a change that ripples across both sides.
- Hides implementation details from clients: clients work through the abstraction and are
  shielded from the implementor objects and how their work is carried out.

## Example

```ts
// Implementor: the implementation interface, free to vary on its own.
interface MessageSender {
  send(text: string): void;
}

class SmsSender implements MessageSender {
  private readonly sent: string[] = [];

  send(text: string): void {
    this.sent.push(text);
  }
}

// Abstraction: holds a reference to an implementor and delegates the primitive work,
// so the two hierarchies vary independently.
abstract class Notification {
  constructor(protected readonly sender: MessageSender) {}

  abstract notify(subject: string, detail: string): void;
}

// Refined Abstraction: extends the abstraction side without touching any sender.
class AlertNotification extends Notification {
  notify(subject: string, detail: string): void {
    this.sender.send(`ALERT ${subject}: ${detail}`);
  }
}

const alert: Notification = new AlertNotification(new SmsSender());
alert.notify("disk", "95% full");
```

## Related patterns

- [Abstract Factory](abstract-factory.md#abstract-factory): can create and configure a particular bridge, choosing which implementor an abstraction is paired with.
- [Adapter](adapter.md#adapter): also puts an object behind another interface, but Adapter is applied after the fact to make unrelated classes cooperate, whereas Bridge is designed in up front so the two sides can vary.
