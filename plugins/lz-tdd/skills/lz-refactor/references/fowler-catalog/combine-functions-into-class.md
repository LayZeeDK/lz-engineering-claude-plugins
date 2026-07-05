# Combine Functions into Class

Use when: several functions operate closely on the same piece of data and keep passing it around.

## Motivation

When a set of functions share a common piece of data, binding them into a class puts the data and
the behavior in one place: call signatures shrink because the shared data is now the object, and the
class becomes a natural home for further refactoring. It also makes shared derivations easy to reach
from every method. When the source data is read-only and you would rather derive a new record than
carry an object, [Combine Functions into Transform](combine-functions-into-transform.md) is the
alternative.

## Mechanics

1. Encapsulate the common data so the functions share one object -- apply
   [Encapsulate Record](encapsulate-record.md) if it is a bare record.
2. Take each function that uses the common data and move it onto the new class with
   [Move Function](move-function.md).
3. Extract fragments of logic that manipulate the data with
   [Extract Function](extract-function.md) and move those onto the class too.
4. Run the tests after each move.

## Example

Before -- free functions thread the same record through their signatures:

```ts
interface Session {
  minutes: number;
  ratePerMinute: number;
}

function cost(session: Session): number {
  return session.minutes * session.ratePerMinute;
}

function isLong(session: Session): boolean {
  return session.minutes > 60;
}
```

After -- data and behavior live together, and the parameters disappear:

```ts
class Session {
  constructor(
    private readonly minutes: number,
    private readonly ratePerMinute: number,
  ) {}

  cost(): number {
    return this.minutes * this.ratePerMinute;
  }

  isLong(): boolean {
    return this.minutes > 60;
  }
}
```

## Watch for

- If the source data changes after the functions run and they must reflect it, a class fits; if the
  data is fixed and you want a computed snapshot, prefer the transform.
