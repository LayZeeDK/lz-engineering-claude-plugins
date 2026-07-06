# Inline Singleton

Use when: a class is a Singleton, but its single-instance policy and global access are hiding a dependency and making the callers hard to test.

Direction: Away
GoF pattern: Singleton
Composed Fowler primitive(s): [Inline Class](../fowler-catalog/inline-class.md#inline-class), [Move Function](../fowler-catalog/move-function.md#move-function), [Move Field](../fowler-catalog/move-field.md#move-field)

## Motivation

A Singleton bundles two decisions -- that there is one instance, and that anyone may reach it
globally -- into the class itself, which hides who actually depends on it and makes a caller
impossible to test with a stand-in. When neither the single-instance guarantee nor the global reach
is truly needed, this refactors away from Singleton: absorb its behavior into the object that will
own it and pass that object to the code that used to reach for it. Callers then declare their
dependency in the open, and tests can supply their own instance. Apply it once the global access is
causing more trouble than the one-instance policy is worth.

## Mechanics

1. Find every caller that reaches the Singleton through its global accessor.
2. Decide where the behavior should live: if one class is the natural owner, plan to fold the
   Singleton into it; otherwise plan to keep the behavior as a plain class that callers are handed.
3. Move the Singleton's fields and methods to their new home, and give each caller the instance
   explicitly instead of through the accessor; compile and run the tests after each move.
4. Once no caller uses the global accessor, remove it and the static instance field.
5. If the Singleton has been fully absorbed into an owner, delete the now-empty Singleton class; run
   the tests.

## Example

Before -- callers reach a global instance through a static accessor:

```ts
class IdSequence {
  private static instance: IdSequence | undefined;
  private next = 1;

  static get(): IdSequence {
    return (IdSequence.instance ??= new IdSequence());
  }

  take(): number {
    return this.next++;
  }
}

function label(): string {
  return "row-" + IdSequence.get().take();
}
```

After -- the behavior is a plain object passed in; the global access is gone:

```ts
class IdSequence {
  private next = 1;

  take(): number {
    return this.next++;
  }
}

function label(sequence: IdSequence): string {
  return "row-" + sequence.take();
}
```

## Watch for

- If a genuine invariant requires exactly one instance (a hardware handle, a shared cache), keep the
  single-instance policy and inject the one instance rather than removing the guarantee outright.
- When one class is clearly the sole user, folding the Singleton straight into it (Inline Class) is
  cleaner than leaving a standalone class only to inject it.
