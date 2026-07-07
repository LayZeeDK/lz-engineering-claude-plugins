# Composite

Functional alternative: [Discriminated Union and Fold](../functional-catalog/discriminated-union-and-fold.md#composite)

## Intent

Arrange objects into part-whole trees and give a single item and a whole subtree the same
interface, so client code can act on any node without checking whether it holds one object
or a composed group.

## Applicability

Use it when you want to model a part-whole hierarchy and let clients ignore whether they are dealing with one object or a group of them.

Reach for it when every object in the structure should be usable through one interface, and the structure can nest to any depth.

## Consequences

- Defines class hierarchies of primitive and composite objects: primitives can be
  combined into more complex objects, which in turn can be combined, recursively.
- Makes the client simple: a client can treat composite structures and individual objects
  the same way, without switching on whether it holds a leaf or a whole subtree.
- Makes it easy to add new kinds of components: a new leaf or composite class works with
  the existing structure and existing client code without change.
- Can make a design overly general: because everything is treated uniformly, it is hard
  to restrict a composite to hold only certain component types, so you cannot lean on the
  type system and may need run-time checks instead.
- Modern status: in some settings the explicit Composite tree has been superseded by
  declarative meta-programming. A well-known case is JUnit: version 3 assembled a test run
  as a Composite (a suite composing tests and nested suites built by hand), whereas
  version 4 replaced that hand-built tree with annotation-driven test discovery.

## Example

```ts
// Component: the uniform interface for both leaves and composites.
interface BomComponent {
  cost(): number;
}

// Leaf: a part with no children.
class Part implements BomComponent {
  constructor(private readonly price: number) {}

  cost(): number {
    return this.price;
  }
}

// Composite: holds children and implements the recursive operation, so a client can
// treat one part and a whole assembly through the same interface.
class Assembly implements BomComponent {
  private readonly children: BomComponent[] = [];

  add(child: BomComponent): void {
    this.children.push(child);
  }

  cost(): number {
    return this.children.reduce((sum, child) => sum + child.cost(), 0);
  }
}

const chassis = new Assembly();
chassis.add(new Part(120));

const frame = new Assembly();
frame.add(chassis);
frame.add(new Part(30));

const total = frame.cost();
```

## Related patterns

- Direction: Away -- [Encapsulate Composite with Builder](../kerievsky-catalog/encapsulate-composite-with-builder.md#encapsulate-composite-with-builder): the pattern-directed refactoring that hides an awkward hand-built Composite behind a builder so callers assemble the tree fluently instead of wiring child nodes by hand.
- [Decorator](decorator.md#decorator): often used with Composite; both rely on recursive composition, but Decorator adds responsibilities to one child rather than aggregating many.
- [Flyweight](flyweight.md#flyweight): lets you share leaf components of a composite structure when there are many identical ones.
