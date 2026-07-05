# Change Value to Reference

Use when: many copies of the same conceptual entity exist as separate value objects, but they should
be one shared object.

## Motivation

When a data structure holds several records that all stand for the same real-world thing -- the same
publisher reached from many books, say -- copying it as a value means an update has to find and change
every copy, and any copy you miss drifts out of date. Turning those copies into references to a single
shared instance makes one update visible everywhere and removes the duplication. A repository that
returns the one instance for a given id is the usual way to share it.

## Mechanics

1. Create or identify a repository that returns the single shared instance for a given id.
2. Ensure each owner knows the id it needs to look the entity up.
3. Replace the code that constructs a fresh copy with a lookup that fetches the shared instance from
   the repository; run the tests.
4. Repeat for each owner, testing after each.

Inverse of [Change Reference to Value](change-reference-to-value.md).

## Watch for

- A single module-global repository couples every owner to that global and makes it hard to
  substitute -- in tests, for instance. Consider passing the repository in rather than reaching for a
  global.

## Example

Before -- every book builds its own `Publisher`, so copies with the same id can diverge:

```ts
class Publisher {
  constructor(readonly id: string, readonly name: string) {}
}

class Book {
  readonly publisher: Publisher;

  constructor(publisherId: string, publisherName: string) {
    this.publisher = new Publisher(publisherId, publisherName);
  }
}
```

After -- books fetch the one shared instance from a repository keyed by id:

```ts
class Publisher {
  constructor(readonly id: string, readonly name: string) {}
}

const publishers = new Map<string, Publisher>();

function publisherById(id: string): Publisher {
  const found = publishers.get(id);
  if (found === undefined) {
    throw new Error(`unknown publisher: ${id}`);
  }
  return found;
}

class Book {
  readonly publisher: Publisher;

  constructor(publisherId: string) {
    this.publisher = publisherById(publisherId);
  }
}
```
