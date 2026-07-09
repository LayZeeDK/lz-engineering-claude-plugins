# Remove Subclass

*Aliases: Replace Subclass with Fields.*

Use when: a subclass has thinned out until it does too little to earn its place in the hierarchy.

## Motivation

Subclasses that once carried real variation can wither as behavior migrates elsewhere, until they add
only a constructor and a hard-coded value. A hierarchy that shallow costs a reader more to follow than
it saves, so fold the subclass back into its parent as a field. This is the reverse of
[Replace Type Code with Subclasses](replace-type-code-with-subclasses.md): when polymorphism no longer
pays, a field is the simpler carrier.

## Mechanics

1. Route creation of the subclass through a factory with
   [Replace Constructor with Factory Function](replace-constructor-with-factory-function.md), so
   callers stop naming the subclass directly.
2. If code tests the object's type, isolate the test with [Extract Function](extract-function.md) and
   [Move Function](move-function.md) it onto the superclass so it reads a field rather than the class.
3. Add a field to the superclass for the value the subclass encoded, and make the affected methods use
   it; run the tests.
4. Delete the subclass and point its factory at the superclass.
5. Run the tests.

## Example

Before, an admin subclass only decorates the label:

```ts
class User {
  constructor(readonly name: string) {}

  get label(): string {
    return this.name;
  }
}

class AdminUser extends User {
  get label(): string {
    return `${this.name} (admin)`;
  }
}
```

After, the distinction becomes a field, and a factory hides construction:

```ts
class User {
  constructor(
    readonly name: string,
    private readonly admin: boolean = false,
  ) {}

  get label(): string {
    return this.admin ? `${this.name} (admin)` : this.name;
  }
}

function createUser(name: string, admin = false): User {
  return new User(name, admin);
}
```

## Watch for

- Callers that construct or type-check the subclass depend on its name; removing it changes that
  published surface, so migrate them as a boundary move. See the atomic-boundary tripwire in the
  [refactoring principles](../principles.md).
