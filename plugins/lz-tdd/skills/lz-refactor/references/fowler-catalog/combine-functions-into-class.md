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
2. Relocate onto the class, one at a time, every function whose work centers on that data --
   [Move Function](move-function.md) does the mechanical part.
3. Where a chunk of logic still handles the data from outside, pull it out via
   [Extract Function](extract-function.md) and give it a home on the class as well.
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
