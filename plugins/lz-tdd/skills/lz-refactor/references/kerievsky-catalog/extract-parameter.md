# Extract Parameter

Use when: a class builds one of its fields from a value it creates internally, but callers need to supply that value instead.

Direction: n/a
GoF pattern: n/a -- utility
Composed Fowler primitive(s): [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration)

## Motivation

When a class assigns a field from a value it instantiates in its own body, it is welded to that one
choice: no caller can hand it a different instance -- a pre-seeded one, a shared one, a test double --
because the class insists on making its own. Extracting the value into a parameter lifts that decision to
the caller: the class receives the value and assigns the field from it, so the same class can be given
whatever the caller needs while still behaving exactly as before when handed the original value. Reach for
it once a locally-created field is standing between callers and a value they legitimately need to control.

## Mechanics

1. Add a parameter for the value to the class's constructor with
   [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration).
2. Assign the field from the new parameter instead of from the locally-created value; compile and run the
   tests.
3. Update each caller to pass the value the class used to build for itself, or the substitute the caller
   needs.
4. Run the tests and confirm callers passing the original value get the original behavior.

## Example

Before -- the log creates its own backing store, so callers cannot supply one:

```ts
class EventLog {
  private readonly sink: string[] = [];
  record(event: string): void {
    this.sink.push(event);
  }
  events(): string[] {
    return this.sink;
  }
}
```

After -- the store is a constructor parameter the caller supplies:

```ts
class EventLog {
  constructor(private readonly sink: string[]) {}
  record(event: string): void {
    this.sink.push(event);
  }
  events(): string[] {
    return this.sink;
  }
}
```

## Watch for

- Extract a parameter only when a caller genuinely needs to supply or substitute the value; if the class
  always builds the same thing and nothing needs to vary it, pushing the value out to every call site
  widens the constructor and leaks a construction detail in exchange for flexibility no one uses.
