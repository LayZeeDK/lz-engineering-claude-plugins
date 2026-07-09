# Move Accumulation to Visitor walkthrough

This walkthrough expands the compact example in
[Move Accumulation to Visitor](move-accumulation-to-visitor.md#move-accumulation-to-visitor). The leaf's
after shows only the visitor holding the accumulation; the teaching this refactoring is really about lives
in the double dispatch (each element type accepting the visitor and calling its own method), so this
fuller example keeps the node classes, their `accept` methods, and the driver that runs the visitor over
the structure.

## Starting point: iterate and switch on type

A loop walks a mixed list of document nodes and branches on each node's kind to add its contribution to a
running sum. A second accumulation (say, counting images) would be a second loop with the same type
switch, and a third node kind would be another branch in each:

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

The type switch is the part that keeps growing, and it moves away from a plain iterator toward
double dispatch.

## After: each node accepts a visitor

Give every node type an `accept` method that calls the visitor method for its own type: that is the
double dispatch. The accumulation state and the per-type arithmetic move into a visitor class. The driver
loops once, asking each node to accept the visitor, and then reads the result off the visitor. A different
accumulation is now a different visitor, not another type switch:

```ts
interface NodeVisitor {
  text(length: number): void;
  image(area: number): void;
}

interface DocNode {
  accept(visitor: NodeVisitor): void;
}

class TextNode implements DocNode {
  constructor(private readonly length: number) {}
  accept(visitor: NodeVisitor): void {
    visitor.text(this.length);
  }
}

class ImageNode implements DocNode {
  constructor(private readonly area: number) {}
  accept(visitor: NodeVisitor): void {
    visitor.image(this.area);
  }
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

function totalWeight(nodes: DocNode[]): number {
  const visitor = new WeightVisitor();
  for (const node of nodes) {
    node.accept(visitor);
  }
  return visitor.sum;
}
```

The loop no longer knows the node types; each node routes itself to the right visitor method, and the sum
lives in the visitor. Adding a "count images" accumulation is a new visitor class with the same two
methods (no change to the loop or the nodes), which is the payoff for leaving the type-switching
iterator behind.
