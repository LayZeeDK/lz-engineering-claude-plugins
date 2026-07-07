# Interpreter

Functional alternative: [Discriminated Union and Fold](../functional-catalog/discriminated-union-and-fold.md#interpreter)

## Intent

For a small language, model each grammar rule as its own class and walk the resulting tree
of rule objects to interpret sentences written in that language.

## Applicability

Use it when there is a simple language to interpret and you can represent its sentences as abstract syntax trees.

Reach for it when the grammar is small and stable, and efficiency is not a critical concern -- so that expressing each grammar rule as a class is worthwhile rather than a burden.

## Consequences

- Makes the grammar easy to change and extend: because each grammar rule is a class,
  rules can be extended or altered through inheritance, and new rules are new classes.
- Makes implementing the grammar straightforward: the classes for rule nodes are simple
  and often similar, and can be generated mechanically.
- Complex grammars are hard to maintain: the pattern defines at least one class per rule,
  so a grammar with many rules becomes hard to manage -- at that point a parser generator
  or interpreter tool is the better tool.
- Makes it possible to add new ways to interpret expressions: because each rule is a
  class, you can give the classes new operations beyond evaluation, such as
  pretty-printing -- though adding one normally means adding a method to every rule class;
  a visitor is what lets you add such an operation without editing those classes.
- Modern status: Interpreter is a niche pattern and a different kind of beast from the
  everyday behavioral patterns -- for anything beyond a tiny, stable grammar a real parser
  or a parser generator is preferable to hand-written rule classes.

## Example

```ts
interface Context {
  has(flag: string): boolean;
}

// Abstract Expression: the interpret operation shared by every grammar rule.
interface RuleExpression {
  interpret(context: Context): boolean;
}

// Terminal Expression: a leaf rule (a single flag lookup).
class FlagRule implements RuleExpression {
  constructor(private readonly flag: string) {}

  interpret(context: Context): boolean {
    return context.has(this.flag);
  }
}

// Nonterminal Expression: a composite rule built from sub-expressions.
class AndRule implements RuleExpression {
  constructor(
    private readonly left: RuleExpression,
    private readonly right: RuleExpression,
  ) {}

  interpret(context: Context): boolean {
    return this.left.interpret(context) && this.right.interpret(context);
  }
}

const rule: RuleExpression = new AndRule(new FlagRule("beta"), new FlagRule("admin"));
const context: Context = { has: (flag) => flag === "beta" || flag === "admin" };
const enabled = rule.interpret(context);
```

## Related patterns

- [Composite](composite.md#composite): the abstract syntax tree of expressions is an instance of Composite.
- [Iterator](iterator.md#iterator): can traverse the expression structure.
- [Visitor](visitor.md#visitor): can hold behavior for each node of the grammar in one class, instead of spreading it across the expression classes.
- [Flyweight](flyweight.md#flyweight): can share terminal symbols within the abstract syntax tree.
