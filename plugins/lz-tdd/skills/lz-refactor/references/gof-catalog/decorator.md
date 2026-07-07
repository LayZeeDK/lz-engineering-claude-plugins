# Decorator

Also known as: Wrapper

Functional alternative: [Function Composition](../functional-catalog/function-composition.md#decorator)

## Intent

Wrap an object in a matching-interface enclosure that adds behavior around it, so
responsibilities can be layered onto individual objects at run time instead of baking
every combination into a subclass.

## Applicability

Use it when you want to give particular objects extra behavior at run time without changing the other objects of their class.

Reach for it when responsibilities can be withdrawn again, or when extension by subclassing is impractical because it would produce an explosion of subclasses to support every combination of features.

## Consequences

- Adds and removes responsibilities at run time: attaching or detaching a decorator turns
  a feature on or off dynamically, and the same responsibility can even be applied twice,
  which fixed inheritance cannot do.
- Keeps each added feature small instead of one do-everything class: rather than a single
  class high in the hierarchy that supports every option, you compose simple wrappers and
  pay only for the features you actually use.
- A decorated object is not the same object as the one it wraps: because the wrapper is a
  transparent stand-in, code that compares object identity should not be handed a
  decorated instance and expect the original back.
- Tends to multiply small objects: a design that leans on decorators yields many lookalike
  objects that differ only in how they are connected, which can be harder to learn and
  debug.

## Example

```ts
// Component: the interface that both the concrete object and the decorators implement.
interface RequestHandler {
  handle(request: string): string;
}

// Concrete Component: the base object that decorators wrap.
class CoreHandler implements RequestHandler {
  handle(request: string): string {
    return `handled:${request}`;
  }
}

// Decorator: implements the component interface and holds a wrapped component, adding
// behavior around the delegated call while staying transparent to clients.
abstract class HandlerDecorator implements RequestHandler {
  constructor(protected readonly inner: RequestHandler) {}

  abstract handle(request: string): string;
}

// Concrete Decorator: adds a responsibility (tagging every response) around the delegate
// and stays transparent to callers; the added behavior is always exercised, not conditional.
class TracingHandler extends HandlerDecorator {
  constructor(inner: RequestHandler, private readonly tag: string) {
    super(inner);
  }

  handle(request: string): string {
    return `[${this.tag}] ${this.inner.handle(request)}`;
  }
}

const handler: RequestHandler = new TracingHandler(new CoreHandler(), "traced");
const response = handler.handle("GET /");
```

## Related patterns

- [Adapter](adapter.md#adapter): an adapter changes an object's interface, whereas a decorator changes its responsibilities and keeps the interface the same.
- [Composite](composite.md#composite): a decorator can be seen as a degenerate composite with a single component, but it adds responsibilities rather than aggregating children.
- [Strategy](strategy.md#strategy): a decorator adds behavior by wrapping an object from the outside, whereas a strategy changes the algorithm the object runs internally.
