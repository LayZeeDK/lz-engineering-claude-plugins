# Encapsulate Composite with Builder

Use when: clients build a Composite by hand -- creating nodes and wiring parent to child -- and that assembly is verbose and easy to get wrong.

Direction: Away
GoF pattern: [Builder](../gof-catalog/builder.md#builder)
Composed Fowler primitive(s): [Extract Class](../fowler-catalog/extract-class.md#extract-class), [Move Function](../fowler-catalog/move-function.md#move-function), [Hide Delegate](../fowler-catalog/hide-delegate.md#hide-delegate)
Functional alternative: [Function Composition](../functional-catalog/function-composition.md#builder)

## Motivation

A Composite makes a tree easy to traverse, but building one still leaves clients constructing each
node and attaching it to its parent by hand, which is repetitive and lets malformed trees slip
through. A Builder gives clients a small, guided interface for describing the tree, and takes on the
node creation and wiring itself. This refactors away from Composite as the client's building surface:
clients program to the Builder instead of to the node structure, so the Composite's shape can change
without touching every construction site. Introduce it once hand-assembly of the Composite is a
recurring source of noise or mistakes.

## Mechanics

1. Identify the node creation and parent-child wiring that clients repeat when building the
   Composite.
2. Create a builder type that owns a root node and tracks where the next child attaches.
3. Give the builder intention-revealing operations (add a leaf, descend into a new branch) that
   create and wire nodes internally, and a terminal that returns the built root.
4. Move one client's hand-assembly onto the builder; compile and run the tests.
5. Repeat for each client, then stop exposing the node wiring operations clients no longer need.

## Example

Before -- the client creates and wires every node against the Composite directly:

```ts
class Node {
  readonly children: Node[] = [];
  constructor(readonly name: string) {}
  add(child: Node): void {
    this.children.push(child);
  }
  render(): string {
    return this.children.length === 0
      ? this.name
      : this.name + "(" + this.children.map((c) => c.render()).join(",") + ")";
  }
}

const root = new Node("root");
const docs = new Node("docs");
docs.add(new Node("guide"));
root.add(docs);
```

After -- a builder hides node creation and wiring; the client describes the tree:

```ts
class Node {
  readonly children: Node[] = [];
  constructor(readonly name: string) {}
  add(child: Node): void {
    this.children.push(child);
  }
  render(): string {
    return this.children.length === 0
      ? this.name
      : this.name + "(" + this.children.map((c) => c.render()).join(",") + ")";
  }
}

class TreeBuilder {
  private readonly root: Node;
  private cursor: Node;

  constructor(name: string) {
    this.root = new Node(name);
    this.cursor = this.root;
  }

  leaf(name: string): this {
    this.cursor.add(new Node(name));
    return this;
  }

  branch(name: string): this {
    const next = new Node(name);
    this.cursor.add(next);
    this.cursor = next;
    return this;
  }

  build(): Node {
    return this.root;
  }
}

const root = new TreeBuilder("root").branch("docs").leaf("guide").build();
```

## Watch for

- A Composite that clients rarely build by hand does not need a builder -- the extra type only earns
  its place when assembly is both frequent and error-prone.
