# Move Function

*Aliases: Move Method.*

Use when: a function talks to elements in another context more than to those in its own home.

## Motivation

A function belongs with the data and other functions it works with. When a function references the
fields or functions of some other context more than its own, its coupling points the wrong way:
readers must jump between contexts to follow it, and the context it really serves cannot evolve
without reaching back. Moving it next to what it uses tightens the module it now lives in and thins
the one it left. You also move a function to reach it from where it is now needed -- to sit near new
callers, or to lift a helper nested inside one function out to where other code can reuse it. Deciding
where a function truly belongs is often a judgment call you refine as the program teaches you more
about its subject.

## Mechanics

1. Examine every element the function uses in its current context -- fields, other functions,
   variables -- and decide whether any of them should move with it.
2. Confirm the function is not polymorphic; an override in a class hierarchy makes the move harder
   and may need a different approach.
3. Copy the function into the target context and fit it there: rewire each reference by either
   passing the source context in as an argument or giving the new home access to what it needs.
4. Compile the target context to surface any reference you missed before wiring callers.
5. Work out how the source context will reach the moved function.
6. Turn the original into a thin delegator that forwards to the moved function, or update every
   caller directly and delete the original.
7. Run the tests.
8. If you left a delegator that no longer earns its keep, fold it away with
   [Inline Function](inline-function.md).

## Example

Before -- the total is a free function, but it uses nothing except a `Reservation`'s own data:

```ts
class Reservation {
  constructor(readonly nights: number, readonly ratePerNight: number) {}
}

function reservationTotal(reservation: Reservation): number {
  return reservation.nights * reservation.ratePerNight;
}
```

After -- the function moves onto the class whose data it works with:

```ts
class Reservation {
  constructor(readonly nights: number, readonly ratePerNight: number) {}

  get total(): number {
    return this.nights * this.ratePerNight;
  }
}
```

## Watch for

- Moving a function that other modules call changes a published interface; green unit tests do not
  prove that safe. Keep a delegator and migrate callers first -- see the atomic-boundary tripwire in
  the [refactoring principles](../principles.md).
