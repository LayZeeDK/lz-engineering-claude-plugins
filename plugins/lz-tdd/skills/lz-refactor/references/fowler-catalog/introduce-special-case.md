# Introduce Special Case

*Aliases: Introduce Null Object.*

Use when: many callers check for the same special value of a field and then all react the same way.

## Motivation

When a lot of code checks for one particular value (often a missing or null case) and responds
to it identically, that repeated handling is duplication that spreads the special case across the
program. Capture the case as its own object that answers the common queries the way the special case
should, so callers can use it without checking. The most common form is a null object: a stand-in for
"missing" that responds sensibly, letting the surrounding code drop its guards.

## Mechanics

1. Add a way to identify the special case on the subject: a property such as `isUnknown`, or a
   shared predicate function.
2. Extract that special-case check into the shared function and route every caller through it, so no
   caller tests the raw value directly; run the tests.
3. Create the special-case object (a subclass or a stand-in) that answers the common queries with
   the special-case values.
4. Change the producer to return the special-case object wherever the raw special value (often null)
   was yielded; run the tests.
5. Update the shared predicate to recognize the special-case object, then fold each caller's repeated
   handling onto the object, testing after each.
6. Run the tests.

## Example

Before, the producer yields `undefined`, so every caller checks and substitutes the same defaults:

```ts
interface User {
  name: string;
  seats: number;
}

function findUser(id: string, users: Map<string, User>): User | undefined {
  return users.get(id);
}

function summary(user: User | undefined): string {
  const name = user === undefined ? "guest" : user.name;
  const seats = user === undefined ? 0 : user.seats;
  return `${name}: ${seats}`;
}
```

After, the producer returns the special-case object, so callers stop checking:

```ts
interface User {
  name: string;
  seats: number;
}

const unknownUser: User = { name: "guest", seats: 0 };

function findUser(id: string, users: Map<string, User>): User {
  return users.get(id) ?? unknownUser;
}

function summary(user: User): string {
  return `${user.name}: ${user.seats}`;
}
```
