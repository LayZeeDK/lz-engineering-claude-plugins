# Immutable Snapshot

Use when: you need to save a value so you can return to it later -- undo, rollback, time-travel -- and the value is already immutable.
Correspondence: dissolves-from -> [Memento](../gof-catalog/memento.md#memento)
Keep the OO form when: the owner refuses to expose the state a snapshot would capture, the object has identity or coordinated mutable state, capture sits on a measured hot path, or the surrounding house style is object-oriented.

## Idiom

Memento records enough of an object's state that it can be rolled back to that point later, without opening up the internals it protects. When the state is already an immutable value, the memento is simply the previous value: you keep the old reference before producing the next one, and "undo" is assigning that reference back. `readonly`, `Object.freeze`, and `as const` express the immutability, and structural sharing keeps holding a history of values cheap.

## Example

Before -- an editor hands out and restores opaque memento objects:

```ts
class EditorMemento {
  constructor(readonly content: string) {}
}

class Editor {
  private content = "";

  type(text: string): void {
    this.content += text;
  }

  save(): EditorMemento {
    return new EditorMemento(this.content);
  }

  restore(memento: EditorMemento): void {
    this.content = memento.content;
  }
}
```

After -- each edit returns a new immutable value; history keeps the prior ones:

```ts
type EditorState = { readonly content: string };

const type = (state: EditorState, text: string): EditorState => ({
  content: state.content + text,
});

function demo(): string {
  const history: EditorState[] = [{ content: "" }];
  history.push(type(history[history.length - 1], "hi"));

  const undone = history[history.length - 2];

  return undone.content;
}
```

Same behavior; mechanics: [Change Reference to Value](../fowler-catalog/change-reference-to-value.md#change-reference-to-value), run tests between steps.

## When each fits

Immutable snapshots fit when history is linear and the state is a plain value -- undo/redo stacks, time-travel debugging, or optimistic UI you can roll back on failure. Two gotchas are runtime-shaped, not type-shaped: `readonly` is a compile-time-only marker that is erased and gives no runtime protection, and `Object.freeze` is shallow, so a nested object still mutates unless you freeze it too. Keep an encapsulating memento object only when the saved state must hide internals the owner will not expose as a plain value.
