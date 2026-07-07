# Chain of Responsibility

## Intent

Give several objects a chance to handle a request by linking them in a line and passing
the request along until one of them takes it, so the sender never needs to know which
object will respond.

## Applicability

Use it when more than one object may handle a request and the handler is not known in advance but should be determined automatically.

Reach for it when you want to issue a request to one of several objects without naming the receiver explicitly, or when the set of objects that can handle a request should be specified dynamically.

## Consequences

- Reduces coupling: the sender and receiver have no explicit knowledge of each other, and
  an object in the chain need not know the chain's structure -- it keeps only a reference
  to its successor.
- Adds flexibility in assigning responsibilities: because the chain is built at run time,
  you can add or reorder handlers, or change which handler covers which request, by
  changing the chain rather than the objects.
- Receipt is not guaranteed: since no handler is obligated to service a request, a request
  can travel to the end of the chain and fall off unhandled if the chain is not configured
  to cover it.

## Example

```ts
interface SupportRequest {
  readonly severity: number;
}

// Handler: keeps a successor and either services the request or forwards it.
abstract class Handler {
  private next: Handler | undefined;

  setNext(next: Handler): Handler {
    this.next = next;

    return next;
  }

  handle(request: SupportRequest): string {
    if (this.canHandle(request)) {
      return this.resolve();
    }

    if (this.next !== undefined) {
      return this.next.handle(request);
    }

    return "unresolved";
  }

  protected abstract canHandle(request: SupportRequest): boolean;
  protected abstract resolve(): string;
}

// Concrete Handlers each own one slice of responsibility.
class FrontLine extends Handler {
  protected canHandle(request: SupportRequest): boolean {
    return request.severity <= 1;
  }

  protected resolve(): string {
    return "handled by front line";
  }
}

class Engineering extends Handler {
  protected canHandle(request: SupportRequest): boolean {
    return request.severity <= 3;
  }

  protected resolve(): string {
    return "handled by engineering";
  }
}

const chain = new FrontLine();
chain.setNext(new Engineering());
const outcome = chain.handle({ severity: 3 });
```

## Related patterns

- [Composite](composite.md#composite): a chain is often applied to a composite structure, where a component forwards a request it cannot handle to its parent.
- [Command](command.md#command): the request travelling the chain can be reified as a command object.
