# Template Method

Functional alternative: [Function Composition](../functional-catalog/function-composition.md#template-method)

## Intent

The overall shape of an algorithm lives in one place, a base-class method, while the individual
steps it reaches for are deliberately left open. Each subclass fills in its own version of those
hook steps, and the order the base class laid down never moves.

## Applicability

Use it to implement the invariant parts of an algorithm once and leave the varying parts to subclasses.

Reach for it to factor common behavior among subclasses into a single place to avoid duplication, or to control which points of an algorithm subclasses are allowed to extend, by exposing only specific hook operations.

## Consequences

- Is a fundamental technique for code reuse: it factors the shared structure of an
  algorithm into a base class, which is especially important in class libraries where it
  hoists common behavior out of the subclasses.
- Inverts control (the "Hollywood principle", don't call us, we'll call you): the parent
  class calls down into the subclass operations rather than the other way around, so the
  overall flow stays fixed while the details vary.
- Distinguishes the kinds of operations a template method calls: concrete operations,
  primitive operations the subclass must supply, and hook operations that offer default
  behavior a subclass may extend, so the extension points are explicit.
- Modern status: some Template Method uses have been absorbed by declarative
  meta-programming. JUnit 3 ran each test through a template method (a fixed sequence
  around overridable setup and teardown steps), whereas JUnit 4 replaced that overridable
  skeleton with lifecycle annotations discovered by the runner.

## Example

```ts
// Abstract Class: holds the template method (the fixed skeleton) plus the primitive and
// hook operations subclasses fill in.
abstract class ImportJob {
  // Template method: the invariant algorithm; subclasses do not override it.
  run(raw: string): number {
    const rows = this.parse(raw);
    const valid = rows.filter((row) => this.isValid(row));

    return this.persist(valid);
  }

  protected abstract parse(raw: string): string[];
  protected abstract isValid(row: string): boolean;

  // Hook operation: a default the subclass may keep or override.
  protected persist(rows: string[]): number {
    return rows.length;
  }
}

// Concrete Class: supplies the primitive operations; the skeleton is inherited unchanged.
class CsvImportJob extends ImportJob {
  protected parse(raw: string): string[] {
    return raw.split("\n").filter((line) => line.length > 0);
  }

  protected isValid(row: string): boolean {
    return row.includes(",");
  }
}

const job: ImportJob = new CsvImportJob();
const imported = job.run("a,1\nbad\nb,2");
```

## Related patterns

- [Factory Method](factory-method.md#factory-method): is frequently called by a template method as one of the steps it defers to subclasses.
- [Strategy](strategy.md#strategy): varies an entire algorithm by delegation, whereas Template Method varies parts of one algorithm by inheritance.
