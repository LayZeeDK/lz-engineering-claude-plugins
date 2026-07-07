# Encapsulate Classes with Factory

Use when: clients instantiate a family of related concrete classes directly, and you would rather they depend only on a shared interface plus one factory.

Direction: To
GoF pattern: [Factory](../extra-patterns-catalog/factory.md#factory)
Composed Fowler primitive(s): [Extract Function](../fowler-catalog/extract-function.md#extract-function), [Move Function](../fowler-catalog/move-function.md#move-function), [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration)
Functional alternative: [Factory Function](../functional-catalog/factory-function.md#factory)

## Motivation

When a set of concrete classes all implement one interface but clients still name the concretes to
create them, every client is coupled to the whole family and free to reach past the interface.
Hiding the concrete classes and routing all construction through a factory narrows that coupling to a
single seam: clients name only the interface and the factory, and one intention-revealing creation
method per kind reads better than a raw constructor call. Apply it once a family of interface
implementers is stable enough that direct instantiation is a liability rather than a convenience.

## Mechanics

1. Confirm the concrete classes share one interface that clients can depend on instead.
2. For one concrete class, extract the constructor call into a small method and move that method onto
   the factory (the shared owner); have it return the interface type.
3. Redirect that concrete's clients to the factory's creation method; compile and run the tests.
4. Repeat per kind, so the factory ends with one intention-revealing method per concrete.
5. Reduce the concrete classes' visibility so they can no longer be named from outside the module;
   run the tests.

## Example

Before -- every client names a concrete codec to build one:

```ts
export interface Codec {
  decode(bytes: number[]): string;
}

export class PcmCodec implements Codec {
  decode(bytes: number[]): string {
    return "pcm:" + bytes.length;
  }
}

export class OpusCodec implements Codec {
  decode(bytes: number[]): string {
    return "opus:" + bytes.length;
  }
}
```

After -- the concretes are hidden; the factory offers one named method per kind:

```ts
export interface Codec {
  decode(bytes: number[]): string;
}

class PcmCodec implements Codec {
  decode(bytes: number[]): string {
    return "pcm:" + bytes.length;
  }
}

class OpusCodec implements Codec {
  decode(bytes: number[]): string {
    return "opus:" + bytes.length;
  }
}

export class CodecFactory {
  pcm(): Codec {
    return new PcmCodec();
  }

  opus(): Codec {
    return new OpusCodec();
  }
}
```

## Watch for

- Encapsulating a family whose clients legitimately need the concrete type (for type-specific
  behavior) fights the language -- keep the concrete reachable in that case.
