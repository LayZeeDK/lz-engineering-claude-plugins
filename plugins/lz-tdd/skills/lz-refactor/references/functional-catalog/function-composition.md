# Function Composition

Use when: behavior is built by wrapping or sequencing same-shaped steps, and you want to vary the order or set of steps without a wrapper class per step.
Correspondence: dissolves-from -> [Decorator](../gof-catalog/decorator.md#decorator), [Chain of Responsibility](../gof-catalog/chain-of-responsibility.md#chain-of-responsibility), [Template Method](../gof-catalog/template-method.md#template-method), [Builder](../gof-catalog/builder.md#builder), [Composed Method](../extra-patterns-catalog/composed-method.md#composed-method), [Collecting Parameter](../extra-patterns-catalog/collecting-parameter.md#collecting-parameter), [Encapsulate Composite with Builder](../kerievsky-catalog/encapsulate-composite-with-builder.md#encapsulate-composite-with-builder), [Compose Method](../kerievsky-catalog/compose-method.md#compose-method), [Move Embellishment to Decorator](../kerievsky-catalog/move-embellishment-to-decorator.md#move-embellishment-to-decorator), [Form Template Method](../kerievsky-catalog/form-template-method.md#form-template-method), [Move Accumulation to Collecting Parameter](../kerievsky-catalog/move-accumulation-to-collecting-parameter.md#move-accumulation-to-collecting-parameter)
Keep the OO form when: steps need coordinated mutable state, a decorator must expose extra methods beyond the shared interface, or a measured hot path cannot afford a closure per step.

## Idiom

Express a multi-step transformation as small functions that share one input and output type, then combine them with a compose or pipe helper so the whole is again a single function. Data flows through the pipe in order; each step stays independently testable and the sequence is reordered by rearranging arguments rather than rewiring wrapper objects.

## Example

Before -- decorators wrap a formatter, each adding one step through the shared interface:

```ts
interface Formatter {
  format(input: string): string;
}

class PlainFormatter implements Formatter {
  format(input: string): string {
    return input;
  }
}

class TrimFormatter implements Formatter {
  constructor(private readonly inner: Formatter) {}

  format(input: string): string {
    return this.inner.format(input).trim();
  }
}

class LowerFormatter implements Formatter {
  constructor(private readonly inner: Formatter) {}

  format(input: string): string {
    return this.inner.format(input).toLowerCase();
  }
}

const decorated: Formatter = new LowerFormatter(new TrimFormatter(new PlainFormatter()));
const result: string = decorated.format("  HELLO  ");
```

After -- each step is a function of the same type, composed into one pipe:

```ts
type TextTransform = (input: string) => string;

const trim: TextTransform = (input) => input.trim();
const toLower: TextTransform = (input) => input.toLowerCase();

const pipe =
  (...steps: readonly TextTransform[]): TextTransform =>
  (input) =>
    steps.reduce((value, step) => step(value), input);

const format: TextTransform = pipe(trim, toLower);
const result: string = format("  HELLO  ");
```

Same behavior; mechanics: run [Move Embellishment to Decorator](../kerievsky-catalog/move-embellishment-to-decorator.md#move-embellishment-to-decorator) in reverse -- replace each wrapping decorator with one function in the pipe, run tests between steps.

## When each fits

### Decorator

Each wrapper that preserves the shared input and output type is one function in the pipe, and the order of composition is the order the wrappers would nest.

### Chain of Responsibility

Handlers become functions that either produce a result or defer, and a short-circuit is an early return inside the composed step rather than a linked handler object.

### Template Method

The fixed skeleton is one composing function and the varying hooks are function parameters, so no subclass is needed to supply the varying steps.

### Builder

A fluent build sequence becomes a pipe of small functions over an immutable draft, and the final step returns the assembled value.

### Composed Method

Extracting a long body into small same-level functions and composing them is the functional reading of a method composed from intention-revealing calls.

### Collecting Parameter

Threading an accumulator through the pipe with reduce replaces handing a mutable collecting parameter from one method to the next.
