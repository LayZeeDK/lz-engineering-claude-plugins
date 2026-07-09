# Move Field

Use when: a field is used more by another record than the one that currently holds it, or fields that
change together live apart.

## Motivation

Data structure is the backbone of a program, and a field in the wrong place forces every operation to
reach across the structure to find it. When a field is consulted or updated more from another record
than from its own, or when it is always changed in step with a field elsewhere, it belongs with that
other data. Moving it puts related data together, so the code that uses it reads locally instead of
threading through references. You often discover a field is misplaced only once you start writing the
functions that use it.

## Mechanics

1. The source field must be reachable only through accessors before anything moves; where it is not,
   run [Encapsulate Variable](encapsulate-variable.md) or
   [Encapsulate Record](encapsulate-record.md) first.
2. Run the tests.
3. Give the target record its own copy of the field, together with the accessors that read and write
   it.
4. Compile to confirm the new field and accessors are consistent.
5. Ensure the source can reach the target -- an existing reference, or one you add.
6. Redirect the source accessors to read and write the target's field instead of their own.
7. Run the tests.
8. Remove the now-unused field from the source.
9. Run the tests.

## Example

Before -- the price lives on `Subscription`, though it is really a property of the `Plan`:

```ts
class Plan {
  constructor(readonly name: string) {}
}

class Subscription {
  constructor(readonly plan: Plan, private monthlyPrice: number) {}

  get price(): number {
    return this.monthlyPrice;
  }
}
```

After -- the field moves to `Plan`; the `Subscription` accessor now delegates:

```ts
class Plan {
  constructor(readonly name: string, private monthlyPrice: number) {}

  get price(): number {
    return this.monthlyPrice;
  }
}

class Subscription {
  constructor(readonly plan: Plan) {}

  get price(): number {
    return this.plan.price;
  }
}
```

## Watch for

- If the target is shared by several source objects, moving the field there can change behavior
  unless every source already holds the same value; confirm they agree -- an assertion helps -- before
  relying on the shared field.
- Moving a field that maps to stored data changes the persisted shape; passing unit tests do not
  prove a schema move safe. Migrate with a parallel change -- see the atomic-boundary tripwire in the
  [refactoring principles](../principles.md).
