# Encapsulate Collection

Use when: a class exposes a collection field, so callers can add to or remove from it behind the owning class's back.

## Motivation

If a getter hands back the class's own collection, any caller can mutate it directly and the owner
never knows -- its invariants can be broken without a single call to one of its methods. Give the
class add and remove methods so all changes go through it, and return something callers cannot use to
mutate the internal collection.

## Mechanics

1. Apply [Encapsulate Variable](encapsulate-variable.md) to the collection if it is not already
   reached through methods.
2. Add methods to add and remove single elements.
3. If a setter assigns the whole collection, change it to copy the incoming contents into the field
   (or remove the setter); run the tests.
4. Run the static checks to find every caller that reaches the collection through the getter.
5. Redirect the callers that mutate the collection to the add/remove methods FIRST, testing after
   each -- locking the getter before this would break them mid-refactor.
6. Once no caller mutates through the getter, change the getter to return a copy or a read-only view.
7. Run the tests.

## Example

Before -- the getter leaks the live array:

```ts
class Team {
  private _members: string[] = [];

  get members(): string[] {
    return this._members;
  }
}
```

After -- changes go through the class, and the getter is safe to hand out:

```ts
class Team {
  private _members: string[] = [];

  get members(): readonly string[] {
    return [...this._members];
  }

  addMember(name: string): void {
    this._members.push(name);
  }

  removeMember(name: string): void {
    this._members = this._members.filter((member) => member !== name);
  }
}
```

## Watch for

- Returning the live collection defeats the point; return a defensive copy or a read-only view.
