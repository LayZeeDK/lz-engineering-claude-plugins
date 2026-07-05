# Extract Class

Use when: a class is doing the work of two -- a subset of its fields and the methods that use them form a cohesive unit that could stand on its own.

## Motivation

Classes accrete responsibilities until they blur. When a clump of fields and the methods operating on
them read as a distinct concept, split that concept into its own class: each class then has a
sharper responsibility, the original shrinks, and the new unit can be understood and reused on its
own.

## Mechanics

1. Decide how to divide the responsibilities between the old class and the new one.
2. Create a new, empty class for the split-off responsibility.
3. Give the old class a field holding an instance of the new class.
4. Move each relevant field across with [Move Field](move-field.md), testing after each.
5. Move each relevant method across with [Move Function](move-function.md), starting with the
   lower-level methods (those called by others) so each move lands on dependencies already in place;
   test after each.
6. Review both interfaces and trim what is no longer needed; rename the old class if its name no
   longer fits its reduced role.
7. Decide whether to expose the new class or keep it hidden behind the old one; if you expose it,
   consider making it a value object (see [Change Reference to Value](change-reference-to-value.md)).

Inverse of [Inline Class](inline-class.md).

## Example

Before -- one class holds two concepts:

```ts
class Book {
  constructor(
    public title: string,
    public publisherName: string,
    public publisherCity: string,
  ) {}
}
```

After -- the publisher is its own class:

```ts
class Publisher {
  constructor(
    public name: string,
    public city: string,
  ) {}
}

class Book {
  constructor(
    public title: string,
    public publisher: Publisher,
  ) {}
}
```

## Watch for

- Split along a real seam of responsibility; carving a class out that always changes together with
  its parent just adds a hop.
