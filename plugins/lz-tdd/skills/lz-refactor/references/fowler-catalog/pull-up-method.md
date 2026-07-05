# Pull Up Method

Use when: two or more subclasses carry methods that do the same thing, so the behavior belongs on the shared parent.

## Motivation

Duplicated methods on sibling subclasses drift apart over time: a fix lands in one copy and not the
others. When subclasses compute the same result the same way, the method belongs on the superclass,
where every subclass inherits one authoritative version. The move often exposes further duplication
in the data the method touches, which you then resolve by pulling that up too.

## Mechanics

1. Inspect the candidate methods to confirm they are identical; if they only do the same thing,
   first refactor their bodies until they match -- use [Extract Function](extract-function.md) to
   isolate the common part, and [Change Function Declaration](change-function-declaration.md) to give
   them one signature.
2. If a body references a field or method that lives only on the subclasses, pull that up first with
   [Pull Up Field](pull-up-field.md), or declare an abstract member on the superclass for it.
3. Create the method on the superclass and copy one subclass body into it.
4. Compile to confirm the superclass method resolves every name it uses.
5. Delete the method from one subclass and run the tests.
6. Delete it from the remaining subclasses one at a time, running the tests after each removal.

Inverse of [Push Down Method](push-down-method.md).

## Example

Before -- two report subclasses format the heading identically:

```ts
abstract class Report {
  constructor(protected readonly title: string) {}
}

class SalesReport extends Report {
  heading(): string {
    return `Report: ${this.title}`;
  }
}

class AuditReport extends Report {
  heading(): string {
    return `Report: ${this.title}`;
  }
}
```

After -- the method moves to the superclass and both subclasses inherit it:

```ts
abstract class Report {
  constructor(protected readonly title: string) {}

  heading(): string {
    return `Report: ${this.title}`;
  }
}

class SalesReport extends Report {}

class AuditReport extends Report {}
```

## Watch for

- Bodies that look alike but read different subclass fields are not yet identical; unify the data they
  depend on before pulling the method up.
