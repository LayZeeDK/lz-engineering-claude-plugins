# Limit Instantiation with Singleton

Use when: profiling shows that many identical instances of a shareable object are wasting memory or construction time, and a single shared instance would serve every caller.

Direction: To
GoF pattern: [Singleton](../gof-catalog/singleton.md#singleton)
Composed Fowler primitive(s): [Replace Constructor with Factory Function](../fowler-catalog/replace-constructor-with-factory-function.md#replace-constructor-with-factory-function), [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration)

## Motivation

When many parts of a system each construct their own copy of an object that carries no per-instance state
-- a formatter, a lookup table, a converter -- the copies are interchangeable, so holding one each only
wastes memory and repeats whatever the construction costs. Limiting instantiation with a Singleton routes
every caller through one access point that returns a single lazily created instance and prevents others
from being made, so the resource cost is paid once. This is a performance move, applied after profiling
shows the duplication actually matters -- not a default. It has a hard precondition: the object must be
stateless, or hold only state that is safe to share, because every caller now sees the same instance.
Reach for it once a profiler points at duplicate instances of a shareable object.

## Mechanics

1. Confirm the object is stateless or holds only sharable state -- if one caller could mutate it in a way
   another caller must not see, stop; this refactoring does not apply.
2. Replace direct construction with a shared access method using
   [Replace Constructor with Factory Function](../fowler-catalog/replace-constructor-with-factory-function.md#replace-constructor-with-factory-function),
   returning a lazily created instance held in a static field.
3. Make the constructor private with
   [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration)
   so no other instance can be created, and point every caller at the shared access method.
4. Profile again and run the tests: confirm the instance count dropped and behavior is unchanged.

## Example

Before -- each caller builds its own formatter, rebuilding the same table:

```ts
class MoneyFormatter {
  private readonly symbols: ReadonlyMap<string, string> = new Map([
    ["USD", "$"],
    ["GBP", "L"],
  ]);
  format(code: string, amount: number): string {
    return `${this.symbols.get(code) ?? code}${amount}`;
  }
}
```

After -- one shared, stateless instance behind a factory method:

```ts
class MoneyFormatter {
  private static instance: MoneyFormatter | undefined;
  private readonly symbols: ReadonlyMap<string, string> = new Map([
    ["USD", "$"],
    ["GBP", "L"],
  ]);
  private constructor() {}
  static shared(): MoneyFormatter {
    if (MoneyFormatter.instance === undefined) {
      MoneyFormatter.instance = new MoneyFormatter();
    }
    return MoneyFormatter.instance;
  }
  format(code: string, amount: number): string {
    return `${this.symbols.get(code) ?? code}${amount}`;
  }
}
```

## Watch for

- Reach for a Singleton only when a profiler shows duplicate instances are a real memory or performance
  problem; using it merely for convenient global access hides dependencies, couples callers to the access
  point, and makes state hard to isolate in tests -- prefer passing the one instance explicitly wherever
  you can.
- It is unsuitable when the object holds mutable state that must not be shared: collapsing such instances
  into one makes each caller's changes visible to the others, silently changing behavior.
