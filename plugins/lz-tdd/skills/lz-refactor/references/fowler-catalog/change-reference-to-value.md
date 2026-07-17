# Change Reference to Value

Use when: a small nested object is shared and mutated in place, but would be simpler treated as an
immutable value.

## Motivation

A reference object is shared: every holder sees an in-place update, which is exactly what you want for
a genuine entity but a hazard for a small data-holder, where aliasing turns one holder's edit into a
surprise for another. Treating such an object as a value (immutable, compared by its contents,
replaced whole rather than mutated) removes that aliasing risk and makes the object safe to pass
around freely, which also helps in concurrent or distributed code.

## Mechanics

1. Confirm the object can be immutable, or make it so: no holder may rely on mutating it in place
   and having another holder observe the change.
2. Remove any setter with [Remove Setting Method](remove-setting-method.md) so the field can only be
   replaced by assigning a whole new object.
3. Give the class value-based equality that compares field contents rather than object identity.
4. Run the tests.

Inverse of [Change Value to Reference](change-value-to-reference.md).

## Example

Before, the position is shared by reference and mutated field by field:

```ts
class Position {
  constructor(public x: number, public y: number) {}
}

class Marker {
  constructor(public position: Position) {}

  moveX(x: number): void {
    this.position.x = x;
  }
}
```

After, the position is an immutable value; a change replaces it whole and compares by content:

```ts
class Position {
  constructor(readonly x: number, readonly y: number) {}

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }
}

class Marker {
  constructor(public position: Position) {}

  moveX(x: number): void {
    this.position = new Position(x, this.position.y);
  }
}
```
