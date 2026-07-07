# Replace Implicit Tree with Composite

Use when: a tree is represented with nested primitives or ad-hoc structures, and traversing it means special-casing leaves against branches everywhere.

Direction: To
GoF pattern: [Composite](../gof-catalog/composite.md#composite)
Composed Fowler primitive(s): [Extract Class](../fowler-catalog/extract-class.md#extract-class), [Replace Primitive with Object](../fowler-catalog/replace-primitive-with-object.md#replace-primitive-with-object)
Functional alternative: [Discriminated Union and Fold](../functional-catalog/discriminated-union-and-fold.md#composite)

## Motivation

When a nested structure is built out of raw arrays or nested values, every operation over it has to test
what kind of node it is looking at and recurse by hand, so the tree's shape is implied by the code that
walks it rather than stated anywhere. A Composite gives leaves and branches a shared interface, so a
branch holds children of that same interface and an operation calls the same method on any node without
asking what it is. Building and traversing the tree then reads uniformly, and a new kind of node just
implements the interface. Reach for it once the by-hand type tests and recursion have spread across
several operations.

## Mechanics

1. Define an interface for the operation every node must answer.
2. Turn the leaf case into a class implementing that interface with
   [Replace Primitive with Object](../fowler-catalog/replace-primitive-with-object.md#replace-primitive-with-object).
3. Create a branch class implementing the same interface that holds a list of child nodes and implements
   the operation by delegating to each child; use
   [Extract Class](../fowler-catalog/extract-class.md#extract-class).
4. Implement the branch's operation by walking its children through the shared interface, replacing the
   old by-hand traversal; compile and run the tests.
5. Redirect construction sites to build nodes instead of nested primitives, one call site at a time.
6. Delete the old type tests and run the tests.

## Example

Before -- the tree is nested primitives, walked by a type test:

```ts
type Parcel = number | Parcel[];

function weight(parcel: Parcel): number {
  if (typeof parcel === "number") {
    return parcel;
  }
  return parcel.reduce((sum: number, child) => sum + weight(child), 0);
}
```

After -- leaves and boxes share an interface; each answers weight:

```ts
interface Parcel {
  weight(): number;
}

class Item implements Parcel {
  constructor(private readonly grams: number) {}
  weight(): number {
    return this.grams;
  }
}

class Box implements Parcel {
  private readonly contents: Parcel[] = [];
  add(parcel: Parcel): void {
    this.contents.push(parcel);
  }
  weight(): number {
    return this.contents.reduce((sum, child) => sum + child.weight(), 0);
  }
}
```

## Watch for

- A structure that is only ever one level deep, or never traversed polymorphically, does not need a
  Composite -- the shared interface earns its place when nesting and uniform traversal are real.
