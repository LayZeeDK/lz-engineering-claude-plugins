# Discriminated Union and Fold

Use when: a type hierarchy or a chain of conditionals selects behavior by variant, and you add operations more often than variants.
Correspondence: dissolves-from -> [Visitor](../gof-catalog/visitor.md#visitor), [State](../gof-catalog/state.md#state), [Interpreter](../gof-catalog/interpreter.md#interpreter), [Composite](../gof-catalog/composite.md#composite), [Replace State-Altering Conditionals with State](../kerievsky-catalog/replace-state-altering-conditionals-with-state.md#replace-state-altering-conditionals-with-state), [Replace Implicit Tree with Composite](../kerievsky-catalog/replace-implicit-tree-with-composite.md#replace-implicit-tree-with-composite), [Extract Composite](../kerievsky-catalog/extract-composite.md#extract-composite), [Replace One/Many Distinctions with Composite](../kerievsky-catalog/replace-one-many-distinctions-with-composite.md#replace-onemany-distinctions-with-composite), [Replace Implicit Language with Interpreter](../kerievsky-catalog/replace-implicit-language-with-interpreter.md#replace-implicit-language-with-interpreter), [Move Accumulation to Visitor](../kerievsky-catalog/move-accumulation-to-visitor.md#move-accumulation-to-visitor)
Keep the OO form when: variants churn more than operations (the expression problem favors classes), a stable public identity per variant matters, or house style is class-per-case.

## Idiom

Model each variant as one arm of a tagged union (a shared `kind` or `tag` field), then write a single function that switches over every arm and returns a result. A `default` arm typed `never`, reached through an `assertNever` helper, makes the compiler reject any unhandled variant, so exhaustiveness is enforced at build time instead of discovered at runtime.

## Example

Before -- a polymorphic hierarchy where each shape supplies its own operation:

```ts
interface Shape {
  area(): number;
}

class Circle implements Shape {
  constructor(private readonly radius: number) {}

  area(): number {
    return Math.PI * this.radius * this.radius;
  }
}

class Rectangle implements Shape {
  constructor(
    private readonly width: number,
    private readonly height: number,
  ) {}

  area(): number {
    return this.width * this.height;
  }
}

const shapes: Shape[] = [new Circle(2), new Rectangle(3, 4)];
const total: number = shapes.reduce((sum, shape) => sum + shape.area(), 0);
```

After -- a tagged union plus one fold, with a compiler-checked exhaustive switch:

```ts
type Shape =
  | { readonly kind: "circle"; readonly radius: number }
  | { readonly kind: "rectangle"; readonly width: number; readonly height: number };

const assertNever = (value: never): never => {
  throw new Error(`unhandled shape: ${JSON.stringify(value)}`);
};

const area = (shape: Shape): number => {
  switch (shape.kind) {
    case "circle": {
      return Math.PI * shape.radius * shape.radius;
    }

    case "rectangle": {
      return shape.width * shape.height;
    }

    default: {
      return assertNever(shape);
    }
  }
};

const shapes: Shape[] = [
  { kind: "circle", radius: 2 },
  { kind: "rectangle", width: 3, height: 4 },
];
const total: number = shapes.reduce((sum, shape) => sum + area(shape), 0);
```

Same behavior; mechanics: run [Move Accumulation to Visitor](../kerievsky-catalog/move-accumulation-to-visitor.md#move-accumulation-to-visitor) in reverse -- lift each visit method into one arm of the switch, run tests between steps.

## When each fits

### Visitor

Adding a new operation is one new fold; adding a new variant edits every existing fold -- the expression-problem tradeoff flips versus a class-per-variant Visitor that makes new variants cheap and new operations expensive.

### State

Transitions become a fold from (state, event) to the next state; a new event is one arm, while a new state touches every transition fold instead of a new state class.

### Interpreter

Each grammar node is a union arm and evaluation is the fold; a new node type edits every interpreter fold, whereas a new operation over the grammar is simply another fold.

### Composite

Leaf and branch are two arms of one recursive union and traversal is the fold, so the recursion lives in the fold rather than in a node hierarchy that each client walks.
