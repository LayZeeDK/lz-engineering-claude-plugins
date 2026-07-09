# Unify Interfaces

Use when: a superclass and its subclass (or two related types you own) should present the same interface, but one lacks a method the other has, forcing clients to distinguish them.

Direction: n/a
GoF pattern: n/a -- utility
Composed Fowler primitive(s): [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration)
Functional alternative: [First-Class Function](../functional-catalog/first-class-function.md#adapter)

## Motivation

When a client holds a reference typed as the general type but occasionally needs a method that only the
specific type defines, it has to test the concrete type and narrow before calling -- and that type test
spreads to every such client. Unifying the interfaces gives the general type the same set of methods as
the specific one (with a safe default where it has no real behavior), so a client can call through the
general type without knowing which concrete type it holds. The distinguishing test disappears. Reach for
it once clients are narrowing to a subtype just to call a method the supertype could declare.

## Mechanics

1. Add the method the client needs -- the one only the specific type defines -- to the existing shared
   supertype, declaring it there with
   [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration)
   and backing it with a harmless default body -- one that does nothing observable -- so every subtype
   answers it; compile and run the tests.
2. Remove the type tests and narrowing at the call sites, calling the unified method directly.
3. Run the tests and confirm behavior is unchanged for both types.

## Example

Before -- the client must narrow to the subtype to call its method:

```ts
class Widget {
  render(): string { return "widget"; }
}

class Button extends Widget {
  render(): string { return "button"; }
  click(): string { return "clicked"; }
}

function activate(widget: Widget): string {
  if (widget instanceof Button) {
    return widget.click();
  }
  return "";
}
```

After -- the shared type declares the method, so no narrowing is needed:

```ts
class Widget {
  render(): string { return "widget"; }
  click(): string { return ""; }
}

class Button extends Widget {
  render(): string { return "button"; }
  click(): string { return "clicked"; }
}

function activate(widget: Widget): string {
  return widget.click();
}
```

## Watch for

- Unify the interfaces only when clients genuinely need to treat the types uniformly; adding a do-nothing
  method to the shared type just to satisfy one caller pushes behavior onto every subtype that does not own
  it, and a supertype padded with empty methods it does not really have is its own smell.
