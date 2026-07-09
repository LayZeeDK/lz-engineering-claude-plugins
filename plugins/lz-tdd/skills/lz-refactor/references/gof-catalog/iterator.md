# Iterator

Also known as: Cursor

Functional alternative: [Generator](../functional-catalog/generator.md#generator)

## Intent

Let a client step through the elements of a collection one at a time through a separate
cursor object, without the collection having to reveal how it stores those elements.

## Applicability

Use it when you want to access an aggregate object's contents without exposing its internal representation.

Reach for it when you want to support multiple, simultaneous traversals of an aggregate, or when you want a uniform way to traverse different aggregate structures.

## Consequences

- Supports variations in traversal: a complex aggregate can be traversed in different ways
  just by replacing the iterator, and new traversals are added without changing the
  aggregate.
- Simplifies the aggregate's interface: the traversal interface lives on the iterator, so
  the aggregate need not carry it.
- Allows more than one pending traversal at a time: because each iterator keeps its own
  position, several traversals of the same aggregate can be in progress at once.
- Modern status: mainstream languages now provide built-in iteration protocols (for-of
  loops, iterables, and generators), so a hand-written Iterator class is rarely necessary
  today. The pattern has largely been subsumed by the language.

## Example

```ts
// Iterator (a.k.a. Cursor): the traversal interface, holding its own position.
interface Cursor<T> {
  hasNext(): boolean;
  next(): T;
}

// Aggregate: hands out a cursor without exposing how it stores its elements.
class Playlist {
  private readonly tracks: string[] = [];

  add(track: string): void {
    this.tracks.push(track);
  }

  createCursor(): Cursor<string> {
    return new PlaylistCursor(this.tracks);
  }
}

// Concrete Iterator: holds the state for one pass over the aggregate.
class PlaylistCursor implements Cursor<string> {
  private index = 0;

  constructor(private readonly items: readonly string[]) {}

  hasNext(): boolean {
    return this.index < this.items.length;
  }

  next(): string {
    const item = this.items[this.index];
    this.index += 1;

    return item;
  }
}

const playlist = new Playlist();
playlist.add("song-a");
const cursor = playlist.createCursor();
const played: string[] = [];

while (cursor.hasNext()) {
  played.push(cursor.next());
}
```

## Related patterns

- Direction: Away. [Move Accumulation to Visitor](../kerievsky-catalog/move-accumulation-to-visitor.md#move-accumulation-to-visitor): the pattern-directed refactoring that moves accumulation logic that a traversal collects into a visitor, rather than growing an iterator loop that gathers many kinds of data.
- [Composite](composite.md#composite): iterators are commonly used to traverse composite structures.
- [Factory Method](factory-method.md#factory-method): polymorphic aggregates use a factory method to create the right concrete iterator.
- [Memento](memento.md#memento): a cursor can hand its current position to a memento, so a traversal can be captured and resumed later.
