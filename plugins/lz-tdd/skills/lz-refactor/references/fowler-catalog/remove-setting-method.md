# Remove Setting Method

Use when: a field should be set once at creation and never changed afterward.

## Motivation

A setter signals that a field is meant to change over an object's life. When a value should be fixed
once the object exists (an id, or anything that defines the object's identity), keeping a setter
invites code to change it by accident and obscures the intent. Removing the setter makes the field's
immutability explicit and is a step toward safe value objects and sharing.

## Mechanics

1. Check the setter's job first: if it updates a shared reference object that you cannot replace by
   constructing a new object, stop: removing the setter is unsafe here.
2. If the constructor does not already take the value, add it as a constructor parameter and set the
   field there.
3. Redirect every caller that used the setter to pass the value through the constructor instead; run
   the tests after each.
4. Remove the setter and make the field read-only.
5. Run the tests.

## Example

Before, the id can be changed after construction:

```ts
class Account {
  private _id: string;

  constructor(id: string) {
    this._id = id;
  }

  get id(): string {
    return this._id;
  }

  setId(id: string): void {
    this._id = id;
  }
}
```

After, the id is set once, with no setter:

```ts
class Account {
  constructor(private readonly _id: string) {}

  get id(): string {
    return this._id;
  }
}
```

## Watch for

- Removing a published setter breaks callers that still set the field; green unit tests do not prove
  that safe for external callers. Migrate with a parallel change. See the atomic-boundary tripwire
  in the [refactoring principles](../principles.md).
