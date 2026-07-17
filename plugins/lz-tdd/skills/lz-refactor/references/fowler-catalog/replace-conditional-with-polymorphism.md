# Replace Conditional with Polymorphism

Use when: a conditional chooses behavior by type or kind, and that variation could be expressed with
subclasses.

## Motivation

A conditional that switches on a type code is a classic candidate for polymorphism: each branch is
really the behavior of one variant. Moving each branch into an overriding method lets the language's
dispatch stand in for the switch, so adding a variant becomes adding a class rather than editing every
switch that mentions the type. Reserve it for genuine type-based variation, though. A plain
conditional that is easy to read does not need a hierarchy.

## Mechanics

1. Ensure a class hierarchy exists for the variants; if not, create it, for example
   [Replace Type Code with Subclasses](replace-type-code-with-subclasses.md) or
   [Replace Constructor with Factory Function](replace-constructor-with-factory-function.md).
2. Route callers through a factory so each obtains the right subclass instance.
3. If the conditional is tangled with other code, extract it whole into its own method with
   [Extract Function](extract-function.md), then move that method onto the superclass.
4. In one subclass, override the method with that variant's leg of the conditional; run the tests.
5. Repeat for each subclass, removing each leg as you move it.
6. Leave the superclass method as the default case, or make it abstract if every case is handled.
7. Run the tests.

For a conditional that just needs clearer names rather than a whole hierarchy, prefer
[Decompose Conditional](decompose-conditional.md) instead.

## Example

Before, a switch selects the area formula by shape kind:

```ts
type Shape =
  | { kind: "square"; side: number }
  | { kind: "circle"; radius: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "square":
      return shape.side * shape.side;
    case "circle":
      return Math.PI * shape.radius * shape.radius;
  }
}
```

After, each variant overrides the method; dispatch replaces the switch:

```ts
interface Shape {
  area(): number;
}

class Square implements Shape {
  constructor(private readonly side: number) {}
  area(): number {
    return this.side * this.side;
  }
}

class Circle implements Shape {
  constructor(private readonly radius: number) {}
  area(): number {
    return Math.PI * this.radius * this.radius;
  }
}
```
