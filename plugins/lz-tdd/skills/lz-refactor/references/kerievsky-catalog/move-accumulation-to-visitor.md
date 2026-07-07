# Move Accumulation to Visitor

Use when: code accumulates a result by iterating a mixed collection and branching on each element's type, and that type-branching keeps growing.

Direction: Away
GoF pattern: [Visitor](../gof-catalog/visitor.md#visitor)
Composed Fowler primitive(s): [Extract Function](../fowler-catalog/extract-function.md#extract-function), [Move Function](../fowler-catalog/move-function.md#move-function), [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration)
Functional alternative: [Discriminated Union and Fold](../functional-catalog/discriminated-union-and-fold.md#visitor)

## Motivation

This refactoring moves AWAY from Iterator: the starting point is a loop that walks a heterogeneous
structure and switches on each element's type to accumulate a result. That iterate-and-type-check style
concentrates every type's contribution in one growing conditional, and each new element type or each new
kind of accumulation forces another branch. Moving the accumulation to a visitor gives each element type
an `accept` method that dispatches to the matching visitor method, so the accumulation lives in a visitor
object -- one method per element type -- and adding a new accumulation is a new visitor rather than another
branch in the loop. Reach for it once the type-switching accumulation over a stable structure has become
the thing that is hard to extend.

## Mechanics

1. Give each element type an `accept` method that will hand the element to a visitor, adding the method
   with [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration);
   compile and run the tests.
2. Define a visitor interface with one method per element type, and carve each type's contribution into
   the matching visitor method with
   [Extract Function](../fowler-catalog/extract-function.md#extract-function); compile and run the tests
   after each.
3. Move each branch body from the old loop into the visitor method for its type with
   [Move Function](../fowler-catalog/move-function.md#move-function), one type at a time, running the
   tests after each move.
4. Replace the loop with one that asks each element to accept the visitor, read the result from the
   visitor, and run the tests to confirm it matches the loop's result.

## Example

Before -- iterate and branch on each element's type to accumulate:

```ts
type DocNode =
  | { kind: "text"; length: number }
  | { kind: "image"; area: number };

function totalWeight(nodes: DocNode[]): number {
  let sum = 0;
  for (const node of nodes) {
    if (node.kind === "text") {
      sum += node.length;
    } else {
      sum += node.area;
    }
  }
  return sum;
}
```

After -- the accumulation lives in a visitor, one method per type:

```ts
interface NodeVisitor {
  text(length: number): void;
  image(area: number): void;
}

class WeightVisitor implements NodeVisitor {
  sum = 0;
  text(length: number): void {
    this.sum += length;
  }
  image(area: number): void {
    this.sum += area;
  }
}
```

Each node type gains an `accept(visitor)` that calls the matching method, so the driver asks every node to
accept a `WeightVisitor` instead of switching on `kind`. See the
[walkthrough](move-accumulation-to-visitor-walkthrough.md) for the full double dispatch (the node classes,
their `accept` methods, and running the visitor over them).

## Watch for

- Move to a visitor only when the accumulation genuinely varies by element type over a structure whose set
  of types is stable; the double dispatch is rigid -- adding an element type means touching every visitor
  -- so if the type set churns, or there is only one accumulation over one or two types, the plain loop is
  simpler and you should not abandon it for a visitor.
- If the element types can instead expose one common method that does the work, giving them that shared
  interface can make the visitor unnecessary -- prefer it to double dispatch when it fits.
- A visitor usually needs each element to expose enough of its internals for the visit method to compute
  its part, which can weaken the elements' encapsulation.
