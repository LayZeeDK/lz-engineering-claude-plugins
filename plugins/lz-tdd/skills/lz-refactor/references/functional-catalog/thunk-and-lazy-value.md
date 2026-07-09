# Thunk and Lazy Value

Use when: you need to defer, queue, or memoize a single operation, and a command or proxy object exists only to hold that one deferred call.
Correspondence: dissolves-from -> [Command](../gof-catalog/command.md#command), [Proxy](../gof-catalog/proxy.md#proxy), [Replace Conditional Dispatcher with Command](../kerievsky-catalog/replace-conditional-dispatcher-with-command.md#replace-conditional-dispatcher-with-command)
Keep the OO form when: the operation must be serialized, inspected, or undone (a tagged-data command), or coordinated mutable state must live behind the deferral.

## Idiom

Wrap deferred work in a nullary closure (`() => T`) that captures everything it needs and runs only when called. The same shape memoizes: compute the value on the first call, keep it in the closure, and return the cached value on every later call.

## Example

Before, a command object holds one deferred operation behind an execute method:

```ts
interface Command {
  execute(): void;
}

class AddItemCommand implements Command {
  constructor(
    private readonly cart: string[],
    private readonly item: string,
  ) {}

  execute(): void {
    this.cart.push(this.item);
  }
}

const cart: string[] = [];
const command: Command = new AddItemCommand(cart, "book");
command.execute();
```

After, the deferred operation is a nullary closure that captures its arguments:

```ts
type Command = () => void;

const addItem =
  (cart: string[], item: string): Command =>
  () => {
    cart.push(item);
  };

const cart: string[] = [];
const command: Command = addItem(cart, "book");
command();
```

Same behavior; mechanics: run [Replace Conditional Dispatcher with Command](../kerievsky-catalog/replace-conditional-dispatcher-with-command.md#replace-conditional-dispatcher-with-command) in reverse: replace each command object with a nullary closure that captures its arguments, run tests between steps.

## When each fits

### Command

A one-method command object collapses to a nullary closure that captures its arguments; invoke-later, queueing, and macro-batching all work over arrays of thunks, while serialization is the residual boundary that still wants a tagged-data command.

### Proxy

A virtual proxy is a memoized thunk that computes once on first call, while the protection and remote variants are the residual sub-kinds: guarding folds into wrapping composition and remoteness folds into an async thunk.
