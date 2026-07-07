# Singleton

Functional alternative: [Module Namespace](../functional-catalog/module-namespace.md#singleton)

## Intent

Guarantee that a class is instantiated only once, and route all use of that single
instance through one well-known access point.

## Applicability

Use it when there must be exactly one instance of a class and it must be reachable from a well-known access point.

Reach for it when the sole instance should be extensible by subclassing and clients should be able to use the extended instance without changing their code.

## Consequences

- Gives controlled access to the sole instance: because the class encapsulates its only
  instance, it governs how and when that instance is reached.
- Reduces the namespace: it is an improvement over global variables, which would
  otherwise be needed to make a single instance widely reachable.
- Permits refinement of operations and representation: the class can be subclassed, and
  the access point can be configured to hand out an instance of the subclass.
- Permits a variable number of instances: the same approach can be relaxed later to
  allow a controlled number of instances rather than strictly one.
- Modern status: today Singleton is widely treated as a design smell, because the global
  access point couples every caller to hidden global state and makes those callers hard
  to test in isolation. The preferred alternative is Dependency Injection (see Martin
  Fowler's article on Inversion of Control and Dependency Injection): create the single
  instance once at the composition root and pass it to the objects that need it, rather
  than letting them reach for a global accessor.

## Example

```ts
class MetricsRegistry {
  private static instance: MetricsRegistry | undefined;
  private readonly counters = new Map<string, number>();

  private constructor() {}

  static getInstance(): MetricsRegistry {
    return (MetricsRegistry.instance ??= new MetricsRegistry());
  }

  increment(name: string): void {
    this.counters.set(name, (this.counters.get(name) ?? 0) + 1);
  }

  read(name: string): number {
    return this.counters.get(name) ?? 0;
  }
}

MetricsRegistry.getInstance().increment("requests");
const requests = MetricsRegistry.getInstance().read("requests");
```

## Related patterns

- Direction: Away -- [Inline Singleton](../kerievsky-catalog/inline-singleton.md#inline-singleton): the pattern-directed refactoring that removes a singleton by absorbing its behavior into an owner and injecting the instance, once its global access is causing more trouble than the one-instance policy is worth.
- [Abstract Factory](abstract-factory.md#abstract-factory), [Builder](builder.md#builder), and [Prototype](prototype.md#prototype): these creational objects are themselves often realized as singletons.
