# Replace Constructor with Factory Function

*Aliases: Replace Constructor with Factory Method.*

Use when: a constructor's limits get in the way (you want a name that says intent, to return a
subtype, or to avoid forcing callers to use `new`).

## Motivation

Constructors are constrained: they must return an instance of their own class, cannot carry a name
that explains what they build, and tie callers to the class name and `new`. A factory function is an
ordinary function, so it can be named for what it produces, return a subtype or a cached instance,
and hide the concrete class behind an intention-revealing call. Prefer it when construction needs more
flexibility than a constructor allows.

## Mechanics

1. Create a factory function whose body calls the constructor.
2. Replace each caller of the constructor with a call to the factory; run the tests after each.
3. Once no caller uses the constructor directly, restrict its visibility as far as the language
   allows.
4. Run the tests.

## Example

Before, callers construct with `new` and a bare priority number:

```ts
class Ticket {
  constructor(readonly code: string, readonly priority: number) {}
}

const urgent = new Ticket("T-1", 1);
```

After, a named factory states intent and hides the constructor:

```ts
class Ticket {
  constructor(readonly code: string, readonly priority: number) {}
}

function urgentTicket(code: string): Ticket {
  return new Ticket(code, 1);
}

const urgent = urgentTicket("T-1");
```

## Watch for

- Changing how callers construct an object is a published-interface change; green unit tests do not
  prove that safe for external callers. Migrate with a parallel change. See the atomic-boundary
  tripwire in the [refactoring principles](../principles.md).
