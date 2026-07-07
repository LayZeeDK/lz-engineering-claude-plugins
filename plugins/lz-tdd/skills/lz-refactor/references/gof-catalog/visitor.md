# Visitor

Functional alternative: [Discriminated Union and Fold](../functional-catalog/discriminated-union-and-fold.md#visitor)

## Intent

Move an operation that works across the objects of a structure into a separate visitor
object, so new operations can be added without editing the classes of the elements they
run on.

## Applicability

Use it when an object structure contains many classes of objects with differing interfaces and you want to perform operations on them that depend on their concrete classes.

Reach for it when many distinct and unrelated operations must be performed on the objects in a structure and you want to keep those operations together rather than scattered across the element classes, especially when the classes defining the structure rarely change but new operations over it are added often.

## Consequences

- Makes adding new operations easy: a new operation over the structure is a new visitor
  class, so you add it without touching the element classes at all.
- Gathers related behavior and separates unrelated behavior: the logic for one operation
  lives together in a single visitor, instead of being spread across every element class.
- Makes adding new element classes hard: every existing visitor must gain an operation for
  the new element, so the pattern trades easy operations for costly new element types --
  the reverse of the usual class-based tradeoff.
- Can accumulate state as it visits: a visitor can build up a result across the elements it
  visits, avoiding extra parameters or global variables.
- Can visit across unrelated classes: a visitor is not limited to elements that share a
  common parent type, so it can operate over a structure whose element classes have no
  inheritance relationship -- something a plain iterator cannot do.
- May force elements to break encapsulation: because the visitor's operations live outside
  the elements, the elements may have to expose enough of their internals for the visitor
  to do its work.

## Example

```ts
// Visitor: one visit operation per concrete element type.
interface StaffVisitor {
  visitEngineer(engineer: Engineer): void;
  visitManager(manager: Manager): void;
}

// Element: accepts a visitor and dispatches to the matching operation (double dispatch).
interface Staff {
  accept(visitor: StaffVisitor): void;
}

class Engineer implements Staff {
  constructor(readonly salary: number) {}

  accept(visitor: StaffVisitor): void {
    visitor.visitEngineer(this);
  }
}

class Manager implements Staff {
  constructor(
    readonly salary: number,
    readonly reports: number,
  ) {}

  accept(visitor: StaffVisitor): void {
    visitor.visitManager(this);
  }
}

// Concrete Visitor: one operation gathered in a single class and accumulating a result;
// a second operation would be another visitor, not a change to Engineer or Manager.
class BonusVisitor implements StaffVisitor {
  private total = 0;

  visitEngineer(engineer: Engineer): void {
    this.total += engineer.salary * 0.1;
  }

  visitManager(manager: Manager): void {
    this.total += manager.salary * 0.2 + manager.reports * 100;
  }

  get bonuses(): number {
    return this.total;
  }
}

const staff: Staff[] = [new Engineer(100), new Manager(200, 3)];
const visitor = new BonusVisitor();

for (const member of staff) {
  member.accept(visitor);
}

const total = visitor.bonuses;
```

## Related patterns

- [Composite](composite.md#composite): a visitor is often used to apply an operation across the objects of a composite structure.
- [Interpreter](interpreter.md#interpreter): a visitor can carry out the interpretation of each node in a grammar's expression tree.
