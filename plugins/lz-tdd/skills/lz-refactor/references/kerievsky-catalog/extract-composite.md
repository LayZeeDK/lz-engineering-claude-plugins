# Extract Composite

Use when: sibling classes in a hierarchy each repeat the same code for holding and iterating child objects.

Direction: To
GoF pattern: [Composite](../gof-catalog/composite.md#composite)
Composed Fowler primitive(s): [Extract Superclass](../fowler-catalog/extract-superclass.md#extract-superclass), [Pull Up Field](../fowler-catalog/pull-up-field.md#pull-up-field), [Pull Up Method](../fowler-catalog/pull-up-method.md#pull-up-method)
Functional alternative: [Discriminated Union and Fold](../functional-catalog/discriminated-union-and-fold.md#composite)

## Motivation

When several classes in the same hierarchy each contain a collection of children and each writes its own
code to add to that collection and to fold a result over it, the child-handling logic is duplicated once
per class. The duplication drifts (one class fixes a traversal bug the others still have) and a reader
cannot tell that these classes are all containers of the same kind. Extracting a composite gathers the
child collection and the operations over it into one shared superclass that both the leaves and the
containers descend from, so the container behavior is defined once. Reach for it when you notice two or
more classes repeating the same "holds many children and aggregates over them" code.

## Mechanics

1. Introduce a common superclass for the duplicating container classes with
   [Extract Superclass](../fowler-catalog/extract-superclass.md#extract-superclass).
2. Move the child collection up into that superclass with
   [Pull Up Field](../fowler-catalog/pull-up-field.md#pull-up-field), so a single field holds the children
   for every subclass.
3. Move one duplicated child operation at a time up with
   [Pull Up Method](../fowler-catalog/pull-up-method.md#pull-up-method), the add and the aggregation,
   compiling and running the tests after each move.
4. Delete the now-empty overrides from the subclasses and run the tests; the shared container behavior now
   lives only in the superclass.

## Example

Before, both containers repeat the children array, the add, and the sum:

```ts
abstract class Shape {
  abstract area(): number;
}

class Group extends Shape {
  private readonly items: Shape[] = [];
  add(shape: Shape): void { this.items.push(shape); }
  area(): number { return this.items.reduce((sum, shape) => sum + shape.area(), 0); }
}

class Layer extends Shape {
  private readonly items: Shape[] = [];
  add(shape: Shape): void { this.items.push(shape); }
  area(): number { return this.items.reduce((sum, shape) => sum + shape.area(), 0); }
}
```

After, an extracted composite superclass owns the child handling once:

```ts
abstract class Shape {
  abstract area(): number;
}

abstract class CompositeShape extends Shape {
  private readonly items: Shape[] = [];
  add(shape: Shape): void { this.items.push(shape); }
  area(): number { return this.items.reduce((sum, shape) => sum + shape.area(), 0); }
}

class Group extends CompositeShape {}
class Layer extends CompositeShape {}
```

## Watch for

- Extract the composite only once two or more classes truly duplicate the child-holding code; a single
  container has nothing to share, and pushing unrelated containers under one composite couples them to a
  child model and traversal they may not actually have in common, buying reuse you will later have to
  unpick.
