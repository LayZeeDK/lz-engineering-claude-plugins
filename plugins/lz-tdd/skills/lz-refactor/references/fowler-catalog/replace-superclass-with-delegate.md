# Replace Superclass with Delegate

*Aliases: Replace Inheritance with Delegation.*

Use when: a subclass inherits from a superclass that is not a true "is a" fit -- it uses only part of the parent, or the parent's interface leaks operations that make no sense on the child.

## Motivation

Inheritance is a strong claim: the subclass is a kind of the superclass and honors its whole
interface. When that is not true -- the child needs only some of the parent, or exposes inherited
operations that break its own invariants -- inheritance couples the two so that parent changes ripple
into the child. Replacing the superclass with a delegate field keeps the useful behavior through
explicit forwarding while dropping the false claim and the leaked interface. This is the whole-parent
counterpart to [Replace Subclass with Delegate](replace-subclass-with-delegate.md).

## Mechanics

1. Add a field to the subclass that holds an instance of the (former) superclass.
2. For each superclass method the class actually relies on, create a forwarding method that delegates
   to that field; run the tests.
3. Remove the extends clause so the class no longer inherits.
4. Run the tests, and adjust any caller that leaned on an inherited method now gone from the interface.

## Example

Before -- a playlist inherits a whole list, exposing more than it should:

```ts
class ItemList {
  private readonly items: string[] = [];

  add(item: string): void {
    this.items.push(item);
  }

  get count(): number {
    return this.items.length;
  }
}

class Playlist extends ItemList {
  play(): string {
    return `playing ${this.count} tracks`;
  }
}
```

After -- the list becomes a delegate reached through forwarding methods:

```ts
class ItemList {
  private readonly items: string[] = [];

  add(item: string): void {
    this.items.push(item);
  }

  get count(): number {
    return this.items.length;
  }
}

class Playlist {
  private readonly tracks = new ItemList();

  add(track: string): void {
    this.tracks.add(track);
  }

  play(): string {
    return `playing ${this.tracks.count} tracks`;
  }
}
```

## Watch for

- Dropping extends removes inherited methods from the class's type; callers that used them bind to a
  published surface, so migrate them as a boundary move -- see the atomic-boundary tripwire in the
  [refactoring principles](../principles.md).
