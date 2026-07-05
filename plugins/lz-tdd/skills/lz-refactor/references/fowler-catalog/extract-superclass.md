# Extract Superclass

Use when: two classes share fields and behavior that mark them as variants of one idea.

## Motivation

When two classes do similar things, the duplication is a signal that a shared parent is waiting to be
named. Extracting a superclass gives the common fields and methods one home and states the "is a
kind of" relationship explicitly. It is the inheritance route to removing duplication; where a shared
role fits better than a shared ancestor, [Extract Class](extract-class.md) captures the same
commonality by delegation instead.

## Mechanics

1. Create an empty superclass and make the two classes extend it; run the tests.
2. Move shared constructor setup up with [Pull Up Constructor Body](pull-up-constructor-body.md).
3. Pull common fields up with [Pull Up Field](pull-up-field.md) and common methods up with
   [Pull Up Method](pull-up-method.md), testing after each move.
4. For methods that are similar but not identical, use [Extract Function](extract-function.md) to
   separate the common part, then pull that part up.
5. Review what remains on the subclasses for further commonality to lift.
6. Examine the clients of the original classes; where they operate on the shared behavior, consider
   retargeting them to the new superclass type so they work through the abstraction. Run the tests.

## Example

Before -- an invoice and a receipt format money the same way:

```ts
class Invoice {
  constructor(protected readonly total: number) {}

  formatTotal(): string {
    return `$${this.total.toFixed(2)}`;
  }
}

class Receipt {
  constructor(protected readonly total: number) {}

  formatTotal(): string {
    return `$${this.total.toFixed(2)}`;
  }
}
```

After -- the shared field and method rise into an extracted superclass:

```ts
abstract class FinancialDocument {
  constructor(protected readonly total: number) {}

  formatTotal(): string {
    return `$${this.total.toFixed(2)}`;
  }
}

class Invoice extends FinancialDocument {}

class Receipt extends FinancialDocument {}
```

## Watch for

- If the two classes share data but not a genuine "is a" relationship, prefer delegation via
  [Extract Class](extract-class.md); a superclass you extract only to share code can mislead later
  readers.
