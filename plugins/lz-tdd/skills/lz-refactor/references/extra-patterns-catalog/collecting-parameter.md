# Collecting Parameter

Functional alternative: [Function Composition](../functional-catalog/function-composition.md#collecting-parameter)

## Intent

Pass one collector object into a set of methods so each adds its contribution to it,
accumulating a combined result in a single place instead of merging separate return values
by hand.

## Applicability

Use it when a result must be accumulated from several methods or from a traversal, rather than assembled from their separate return values.

Reach for it when you are breaking a large result-building method into smaller ones and need the pieces to keep contributing to one shared result, or when a recursive walk must gather output from every node it visits.

## Consequences

- Gathers results in one place: passing a single collector to each step accumulates the
  output centrally, so the caller does not stitch together many separate return values.
- Fits recursion and traversal: a method that walks a structure can hand the same collector
  down, so every visited part contributes to one result without threading return values
  back up.
- Ties the accumulation to specific types: the collector and the objects that feed it must
  agree on a shared interface, so it reads poorly when the objects are heterogeneous. When
  accumulation has to span unrelated element classes, moving the logic into a
  [Visitor](../gof-catalog/visitor.md#visitor) is the better fit.

## Example

```ts
// Collecting Parameter: one collector passed to each step so results accumulate in a
// single place instead of being combined from many return values.
class Problems {
  private readonly messages: string[] = [];

  add(message: string): void {
    this.messages.push(message);
  }

  get all(): readonly string[] {
    return this.messages;
  }
}

interface Rule {
  check(value: string, problems: Problems): void;
}

class NotEmpty implements Rule {
  check(value: string, problems: Problems): void {
    if (value.length === 0) {
      problems.add("must not be empty");
    }
  }
}

class MaxLength implements Rule {
  constructor(private readonly limit: number) {}

  check(value: string, problems: Problems): void {
    if (value.length > this.limit) {
      problems.add("too long");
    }
  }
}

const problems = new Problems();
const rules: Rule[] = [new NotEmpty(), new MaxLength(3)];

for (const rule of rules) {
  rule.check("hello", problems);
}

const found = problems.all;
```

## Related patterns

- [Visitor](../gof-catalog/visitor.md#visitor): preferred when the accumulation must run across a structure of unrelated element classes; a collecting parameter suits a set of objects that already share an interface.
- [Composed Method](composed-method.md#composed-method): a collecting parameter is what lets the small methods a composed method calls each add to one shared result.
