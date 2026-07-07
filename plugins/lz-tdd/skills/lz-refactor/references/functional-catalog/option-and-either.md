# Option and Either

Use when: a value may be absent or a call may fail, and callers keep guarding with null checks or try/catch before they can use the result.
Correspondence: alternative-to -> [Null Object](../extra-patterns-catalog/null-object.md#null-object), [Introduce Null Object](../kerievsky-catalog/introduce-null-object.md#introduce-null-object)
Keep the OO form when: one benign stand-in object can satisfy every caller without per-call branching (a true Null Object), the absence carries behavior rather than only data, or house style forbids union return types.

## Idiom

A tagged union states the two outcomes in the type itself: a present/absent pair (Option) or a success/failure pair (Result, sometimes called Either). Because the two arms carry different tags, an exhaustive check forces every caller to handle both -- the missing or failed case becomes a compile-time obligation instead of a reference that happens to be null at runtime. Result also lets the failure arm carry a reason, so a recoverable error travels as a value rather than unwinding the stack as an exception.

## Example

Before -- a lookup returns `User | null`, and every caller has to remember the guard; one forgotten check is a runtime crash:

```ts
interface User {
  id: number;
  name: string;
}

class UserDirectory {
  private readonly users = new Map<number, User>();

  add(user: User): void {
    this.users.set(user.id, user);
  }

  find(id: number): User | null {
    const user = this.users.get(id);

    if (user === undefined) {
      return null;
    }

    return user;
  }
}

function greet(directory: UserDirectory, id: number): string {
  const user = directory.find(id);

  if (user === null) {
    return "unknown";
  }

  return user.name;
}
```

After -- the result is an `Option<User>`, so the "not found" arm is part of the type and the caller must open it before reading a name. Same inputs produce the same greeting.

```ts
interface User {
  id: number;
  name: string;
}

type Option<T> =
  | { readonly kind: "some"; readonly value: T }
  | { readonly kind: "none" };

class UserDirectory {
  private readonly users = new Map<number, User>();

  add(user: User): void {
    this.users.set(user.id, user);
  }

  find(id: number): Option<User> {
    const user = this.users.get(id);

    if (user === undefined) {
      return { kind: "none" };
    }

    return { kind: "some", value: user };
  }
}

function greet(directory: UserDirectory, id: number): string {
  const found = directory.find(id);

  if (found.kind === "some") {
    return found.value.name;
  }

  return "unknown";
}
```

Same behavior; mechanics: define the Option<T> union and replace each | null return and its null-guard with a some/none tag the caller must open, run tests between steps.

## When each fits

Reach for Option or Result when the caller should decide what an absent value or a failure means at the point of use, and you want the compiler to force that decision rather than trust a possibly-null reference. Keep a Null Object when a single harmless stand-in -- a no-op logger, an empty collection, a zero-priced line -- can serve every caller so no site needs to branch at all. Result extends the idea past mere absence: it carries a reason for the failure, filling the role an exception would otherwise play while keeping the outcome an ordinary return value.
