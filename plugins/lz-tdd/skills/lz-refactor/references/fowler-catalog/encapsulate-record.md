# Encapsulate Record

*Aliases: Replace Record with Data Class.*

Use when: a mutable record (a plain data structure) is passed around widely and you want to control access to it and hide how it stores its data.

## Motivation

A bare record exposes its field layout to every holder, so changing the representation means chasing
every reference. Wrapping it in a class lets access go through methods: you can hide which fields are
stored versus computed, add validation, and later change the internals without touching callers. It
also eases renaming a field, since the class can expose both the old and the new name during
migration and let references move across gradually. The payoff is largest for mutable records with a
wide reach.

## Mechanics

1. Apply [Encapsulate Variable](encapsulate-variable.md) so the record is reached through a getter
   and setter.
2. Wrap the record in a class, change the getter to return that class, and give the class a
   temporary raw-record accessor with a deliberately searchable name, so every existing use can be
   found and migrated.
3. Run the static checks.
4. Migrate the writers first: replace direct field writes with set methods on the class, testing
   after each.
5. Migrate the readers: replace direct field reads with get methods. For a record too complex to
   migrate in one go, have the reader accessor return a read-only view or a copy, so nothing mutates
   the record behind the class's back.
6. Remove the temporary raw-record accessor once no use remains, and run the tests.
7. For nested records or collections, apply the same treatment recursively.

## Example

Before -- a record anyone can reshape:

```ts
interface BookData {
  title: string;
  authorCount: number;
}

const book: BookData = { title: "Untitled", authorCount: 1 };
```

After -- a class controls access to the same data:

```ts
interface BookData {
  title: string;
  authorCount: number;
}

class Book {
  constructor(private readonly data: BookData) {}

  get title(): string {
    return this.data.title;
  }

  set title(value: string) {
    this.data.title = value;
  }

  get authorCount(): number {
    return this.data.authorCount;
  }
}
```

## Watch for

- Wrapping the record does not by itself protect a nested mutable object; encapsulate those too, or
  hand back copies.
