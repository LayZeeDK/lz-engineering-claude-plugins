# Currying and Partial Application

Use when: several calls share the same leading arguments, and you keep threading the same configuration through every call or assembling it with a builder.
Correspondence: alternative-to -> [Builder](../gof-catalog/builder.md#builder), [Extract Parameter](../kerievsky-catalog/extract-parameter.md#extract-parameter)
Keep the OO form when: many optional parts are assembled and validated together, the half-built state must be inspected or adjusted before completion, or a fluent builder reads better to your team than nested calls.

## Idiom

A curried function accepts its arguments in stages: supply the stable ones now and receive a smaller function that waits for the rest. Partial application is the same move applied to an existing function: fix its leading arguments to get a specialized version. Either way the shared configuration is captured once in a closure and the remaining call sites pass only what actually varies, so there is no configuration object to thread through and no builder to assemble.

## Example

Before, a builder collects the fixed parts (a prefix and a level) and hands back a formatter:

```ts
class MessageBuilder {
  private prefix = "";
  private level = "info";

  withPrefix(prefix: string): this {
    this.prefix = prefix;

    return this;
  }

  withLevel(level: string): this {
    this.level = level;

    return this;
  }

  build(): (message: string) => string {
    const prefix = this.prefix;
    const level = this.level;

    return (message: string): string => `[${prefix}] ${level}: ${message}`;
  }
}

const format = new MessageBuilder().withPrefix("api").withLevel("warn").build();
const line = format("disk almost full");
```

After, the same fixed parts are supplied in stages; each application returns a narrower function, and the last one is the formatter. `format("disk almost full")` yields the identical string.

```ts
const makeFormatter =
  (prefix: string) =>
  (level: string) =>
  (message: string): string =>
    `[${prefix}] ${level}: ${message}`;

const format = makeFormatter("api")("warn");
const line = format("disk almost full");
```

Same behavior; mechanics: [Extract Parameter](../kerievsky-catalog/extract-parameter.md#extract-parameter), run tests between steps.

## When each fits

Reach for currying or partial application when the varying input is a small number of values threaded through many calls, and you want a ready-specialized function to hand around instead of repeating the fixed arguments. Keep a Builder when an object has many optional fields that are gathered and validated as a unit, or when the half-assembled state is worth inspecting before it is finished. Extract Parameter is the narrower move on the object side: it simply lets a caller supply one value a class currently constructs for itself, where currying lets you pre-bind that value and defer the rest.
