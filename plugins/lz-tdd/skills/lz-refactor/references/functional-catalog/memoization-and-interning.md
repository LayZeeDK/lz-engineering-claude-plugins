# Memoization and Interning

Use when: many uses want the same immutable value and you would rather share one copy by key than allocate a fresh one every time.
Correspondence: dissolves-from -> [Flyweight](../gof-catalog/flyweight.md#flyweight)
Keep the OO form when: the shared object owns identity or coordinated mutable state, lookup sits on a measured hot path with its own tuning, variant churn is constant, or the surrounding house style is object-oriented.

## Idiom

Flyweight saves memory by sharing one instance of an immutable value across many contexts, handing out references through a factory that caches by key. That becomes a memoized -- or interning -- factory: a closure over a `Map` or `WeakMap` that returns the cached value when a key repeats and stores a freshly built one otherwise. `Symbol.for` is the language's built-in interning table for symbols, and any pure function of a key can be wrapped the same way.

## Example

Before -- a factory class caches shared glyphs in a field:

```ts
class Glyph {
  constructor(readonly char: string) {}
}

class GlyphFactory {
  private readonly cache = new Map<string, Glyph>();

  get(char: string): Glyph {
    let glyph = this.cache.get(char);

    if (glyph === undefined) {
      glyph = new Glyph(char);
      this.cache.set(char, glyph);
    }

    return glyph;
  }
}
```

After -- a closure captures the cache; the factory is a plain function:

```ts
type Glyph = { readonly char: string };

function createGlyphPool(): (char: string) => Glyph {
  const cache = new Map<string, Glyph>();

  return (char) => {
    let glyph = cache.get(char);

    if (glyph === undefined) {
      glyph = { char };
      cache.set(char, glyph);
    }

    return glyph;
  };
}
```

Same behavior; mechanics: [Replace Constructor with Factory Function](../fowler-catalog/replace-constructor-with-factory-function.md#replace-constructor-with-factory-function), run tests between steps.

## When each fits

Memoization fits when the same input recurs and its value is immutable -- interning short strings, canonicalizing enum-like values, or caching a pure computation. For genuinely immutable primitives the pattern dissolves entirely, because equal literals are already shared by the runtime and there is nothing to pool. A closure-held cache earns its keep only when the shared value is a heavy compound object whose identity you want to reuse; reach for a `WeakMap` there so the cache does not pin its keys in memory once nothing else references them.
