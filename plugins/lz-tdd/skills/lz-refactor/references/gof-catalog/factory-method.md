# Factory Method

Also known as: Virtual Constructor

## Intent

Give a class a method whose job is to produce a collaborator, but leave the choice of
concrete type to its subclasses, so the class defers that instantiation decision to
whoever specializes it.

## Applicability

Use it when a class cannot anticipate the class of objects it must create and wants its subclasses to specify them.

Reach for it when a framework must create objects whose concrete type is a subclass responsibility, or when you want to give clients a well-defined hook for changing which product a component produces without touching the component itself.

## Consequences

- Removes application-specific classes from the framework code: the creator works only
  with the abstract product interface, so it can cooperate with any product a subclass
  supplies.
- Provides a hook for subclasses: overriding the factory method is a natural, narrow
  extension point for supplying an alternative product.
- Connects parallel class hierarchies: the factory method localizes the knowledge of
  which product subclass pairs with which creator subclass.
- Can force a subclass just to choose a product: a client may have to subclass the
  creator only to change which product it makes, even when nothing else varies. With
  hindsight the pattern's authors treat Factory Method as a special case of a more
  general Factory and would generalize it so the product choice is passed in as data
  rather than fixed by subclassing.

## Example

```ts
interface Channel {
  deliver(message: string): void;
}

class EmailChannel implements Channel {
  private readonly sent: string[] = [];

  deliver(message: string): void {
    this.sent.push(message);
  }
}

// Creator: uses the product through its interface and defers the choice of concrete
// product to the factory method createChannel().
abstract class NotificationDispatcher {
  protected abstract createChannel(): Channel;

  dispatch(message: string): void {
    const channel = this.createChannel();
    channel.deliver(message);
  }
}

// Concrete Creator: the subclass names the concrete product.
class EmailDispatcher extends NotificationDispatcher {
  protected createChannel(): Channel {
    return new EmailChannel();
  }
}

const dispatcher: NotificationDispatcher = new EmailDispatcher();
dispatcher.dispatch("welcome aboard");
```

## Related patterns

- [Abstract Factory](abstract-factory.md#abstract-factory): often implemented with factory methods, one per product in the family.
- [Template Method](template-method.md#template-method): a factory method is commonly called from within a template method, which decides when a product is needed.
- [Prototype](prototype.md#prototype): an alternative that produces the product by cloning rather than by subclassing the creator.
