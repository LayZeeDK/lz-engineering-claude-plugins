# Replace Primitive with Object

*Aliases: Replace Data Value with Object, Replace Type Code with Class.*

Use when: a primitive value has started to carry meaning -- it needs formatting, validation, or related behavior that is duplicating itself around the code.

## Motivation

A value that begins as a simple string or number often grows requirements: special display,
comparison, validation. Left as a primitive, that behavior scatters and duplicates. Wrapping the
value in a small class gives the concept a name and a single home for its behavior, so the rules live
in one place and the type says what it is.

## Mechanics

1. Apply [Encapsulate Variable](encapsulate-variable.md) to the primitive field if it is not already
   encapsulated.
2. Give the concept a class of its own: its constructor accepts the raw value, and a single read
   accessor hands that value back.
3. Run the static checks.
4. Rewire the write accessor so incoming values arrive wrapped in that class, and the read accessor
   so it unwraps them again; test.
5. Move the behavior that operated on the primitive onto the value class.
6. Run the tests.
7. Consider renaming the original accessors so their names reflect the new type rather than the old
   primitive.
8. Decide whether the wrapper is a value object or a reference object -- see
   [Change Reference to Value](change-reference-to-value.md) /
   [Change Value to Reference](change-value-to-reference.md) -- since that governs sharing and
   equality.

## Example

Before -- a string field with behavior sitting outside it:

```ts
class Parcel {
  constructor(public trackingId: string) {}
}

const isExpress = (parcel: Parcel): boolean => parcel.trackingId.startsWith("EX");
```

After -- the concept is a type, and its behavior lives on it:

```ts
class TrackingId {
  constructor(private readonly value: string) {}

  toString(): string {
    return this.value;
  }

  get isExpress(): boolean {
    return this.value.startsWith("EX");
  }
}

class Parcel {
  constructor(public trackingId: TrackingId) {}
}
```

## Watch for

- Introduce the object when the value earns it (behavior or invariants gather on it); a value that
  stays inert may not need the wrapper yet.
