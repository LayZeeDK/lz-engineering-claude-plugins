# Memento

Also known as: Token

## Intent

Capture a snapshot of an object's internal state in a separate object that only the
original can read back, so the object can be rolled back to that state later without
exposing its internals to whatever holds the snapshot.

## Applicability

Use it when a snapshot of an object's state must be saved so the object can be restored to it later, and a direct interface to that state would expose implementation details and break encapsulation.

Reach for it when you want an undo or rollback capability, or a checkpoint of an object's state, without the object having to publish its internals to the code that stores the snapshot.

## Consequences

- Preserves encapsulation boundaries: the state is captured in a memento that only the
  originator can interpret, so the object holding the snapshot cannot read or corrupt the
  originator's internals.
- Simplifies the originator: the originator need not manage versions of its own state; the
  caretaker keeps the mementos, so that bookkeeping leaves the originator.
- Using mementos might be expensive: if the originator stores large amounts of state, or
  clients create and restore mementos frequently, the storage and copying cost can be
  significant.
- Shifts the cost of caring for mementos to the caretaker: the caretaker may accumulate a
  large history and cannot know how much state a memento holds or how costly it is to keep.
- Can be hard to guarantee originator-only access: the pattern relies on only the
  originator being able to read a memento's contents, and some languages cannot enforce
  that narrow access, so the encapsulation it promises may rest on convention rather than
  on the compiler.

## Example

```ts
// Memento: an opaque snapshot; only the originator interprets its contents.
class SaveGame {
  constructor(
    readonly level: number,
    readonly health: number,
  ) {}
}

// Originator: produces a memento of its state and restores itself from one.
class Player {
  private level = 1;
  private health = 100;

  advance(level: number, health: number): void {
    this.level = level;
    this.health = health;
  }

  save(): SaveGame {
    return new SaveGame(this.level, this.health);
  }

  restore(snapshot: SaveGame): void {
    this.level = snapshot.level;
    this.health = snapshot.health;
  }
}

// Caretaker: keeps mementos without inspecting their contents.
class Checkpoint {
  private saved: SaveGame | undefined;

  keep(snapshot: SaveGame): void {
    this.saved = snapshot;
  }

  last(): SaveGame | undefined {
    return this.saved;
  }
}

const player = new Player();
const checkpoint = new Checkpoint();
checkpoint.keep(player.save());
player.advance(5, 40);

const snapshot = checkpoint.last();

if (snapshot !== undefined) {
  player.restore(snapshot);
}
```

## Related patterns

- [Command](command.md#command): a command can use a memento to keep the state it needs to undo its effect.
- [Iterator](iterator.md#iterator): a memento can capture the state of a traversal so iteration can be resumed later.
