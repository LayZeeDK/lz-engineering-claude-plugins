# Move Accumulation to Collecting Parameter

Use when: one long method builds up a result by hand, and you want to spread the work across several methods without each returning a piece to stitch together.

Direction: To
GoF pattern: [Collecting Parameter](../extra-patterns-catalog/collecting-parameter.md#collecting-parameter) (non-GoF)
Composed Fowler primitive(s): [Extract Function](../fowler-catalog/extract-function.md#extract-function), [Move Statements into Function](../fowler-catalog/move-statements-into-function.md#move-statements-into-function), [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration)
Functional alternative: [Function Composition](../functional-catalog/function-composition.md#collecting-parameter)

## Motivation

When a single method accumulates a result (appending to a string, growing a list, summing), it tends to
swell, because breaking it into helpers means each helper returns a fragment that the caller must merge
back. A collecting parameter cuts that friction: you pass one mutable accumulator to each helper, and each
contributes to it directly instead of returning something to combine. The result is assembled in one
place, and the work can be split across as many methods (or recursive calls) as the structure needs. Reach
for it once a build-up method is growing and you want to divide it without threading return values back
together.

## Mechanics

1. Introduce the accumulator the result is built in, and pass it to a new helper with
   [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration)
   so the helper takes the collecting parameter.
2. Move the accumulating statements into that helper with
   [Move Statements into Function](../fowler-catalog/move-statements-into-function.md#move-statements-into-function),
   having them contribute to the parameter rather than to a local.
3. Where the build-up spans structure, split each part into its own contribution with
   [Extract Function](../fowler-catalog/extract-function.md#extract-function), each taking the same
   accumulator; compile and run the tests.
4. Run the tests and confirm the assembled result matches the original.

## Example

Before, each node returns its text and the parent concatenates:

```ts
class Tree {
  constructor(
    readonly name: string,
    readonly children: Tree[],
  ) {}
  render(): string {
    let out = this.name;
    for (const child of this.children) {
      out += "\n" + child.render();
    }
    return out;
  }
}
```

After, one collecting parameter is passed down and each node appends to it:

```ts
class Tree {
  constructor(
    readonly name: string,
    readonly children: Tree[],
  ) {}
  render(): string {
    const lines: string[] = [];
    this.collect(lines);
    return lines.join("\n");
  }
  private collect(lines: string[]): void {
    lines.push(this.name);
    for (const child of this.children) {
      child.collect(lines);
    }
  }
}
```

## Watch for

- Move to a collecting parameter only when the result is genuinely assembled across several methods or a
  recursion; for a build-up that lives in one short method, a returned value is simpler and keeps the
  method free of a shared mutable accumulator that callers must create and thread through.
- A collecting parameter fits accumulation over a known, uniform set of elements that share an interface;
  when the elements are of diverse types each contributing differently, a visitor sibling
  ([Move Accumulation to Visitor](move-accumulation-to-visitor.md#move-accumulation-to-visitor)) suits the
  heterogeneous case better.
