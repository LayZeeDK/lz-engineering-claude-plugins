# Move Embellishment to Decorator

Use when: a class carries optional extras behind flags or conditionals, and those extras clutter its core responsibility.

Direction: To/Towards
GoF pattern: [Decorator](../gof-catalog/decorator.md#decorator)
Composed Fowler primitive(s): [Replace Superclass with Delegate](../fowler-catalog/replace-superclass-with-delegate.md#replace-superclass-with-delegate), [Move Function](../fowler-catalog/move-function.md#move-function)
Functional alternative: [Function Composition](../functional-catalog/function-composition.md#decorator)

## Motivation

When a class does one core job but also handles a handful of optional adjustments, those extras tend to
live as fields and conditionals inside it, so the core logic is tangled with features that only some
callers want. A decorator lifts each optional adjustment into its own object that wraps the core and adds
its behavior around the wrapped call, leaving the core class to do just its one thing. Callers then
compose exactly the extras they need by nesting wrappers, and a new embellishment becomes a new wrapper
rather than another flag. Reach for it once optional behavior is multiplying the conditionals in a class
whose main purpose should stay simple.

## Mechanics

1. Identify one optional adjustment and the flag that currently switches it on.
2. Define an interface for the core operation the class exposes, and have the core class implement it.
3. Create a subclass of the core that adds the one adjustment around the inherited behavior, moving the
   adjustment's code out of the core with [Move Function](../fowler-catalog/move-function.md#move-function);
   compile and run the tests.
4. Apply [Replace Superclass with Delegate](../fowler-catalog/replace-superclass-with-delegate.md#replace-superclass-with-delegate)
   so that subclass holds a wrapped instance of the interface and delegates to it, adding its behavior
   around the delegated call: it is now a decorator.
5. Have callers that wanted the extra wrap the core in the decorator instead of setting the flag.
6. Repeat per adjustment, then remove the drained flags and run the tests.

## Example

Before, optional charges live as flags inside the quote:

```ts
class Quote {
  constructor(
    private readonly base: number,
    private readonly insured: boolean,
    private readonly expedited: boolean,
  ) {}

  total(): number {
    let amount = this.base;
    if (this.insured) {
      amount += 5;
    }
    if (this.expedited) {
      amount *= 1.1;
    }
    return amount;
  }
}
```

After, each charge is a decorator wrapping the quote:

```ts
interface Quote {
  total(): number;
}

class BaseQuote implements Quote {
  constructor(private readonly base: number) {}
  total(): number {
    return this.base;
  }
}

class Insured implements Quote {
  constructor(private readonly inner: Quote) {}
  total(): number {
    return this.inner.total() + 5;
  }
}

class Expedited implements Quote {
  constructor(private readonly inner: Quote) {}
  total(): number {
    return this.inner.total() * 1.1;
  }
}
```

## Watch for

- The wrapper must reimplement every public method of the wrapped type, so this fits a narrow interface;
  when the interface is wide, prefer
  [Replace Conditional Logic with Strategy](replace-conditional-logic-with-strategy.md#replace-conditional-logic-with-strategy)
  instead.
- Decorators compose in an order that can matter: wrapping insurance inside expedite is not the same as
  the reverse; keep the composition explicit where the sequence changes the result.
