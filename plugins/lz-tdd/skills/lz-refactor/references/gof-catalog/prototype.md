# Prototype

## Intent

Produce fresh objects by cloning a fully configured example instance instead of building
them from a class, so the example itself dictates what each new object looks like.

## Applicability

Use it when a system should be independent of how its products are created and represented, and new products are best specified by cloning a configured instance.

Reach for it when the classes to instantiate are chosen at run time, when you want to avoid a parallel hierarchy of factory classes, or when instances have only a few different combinations of state that are cheaper to clone-and-tweak than to build from scratch.

## Consequences

- Lets you add and remove products at run time: registering a new prototype is enough to
  make a new kind of product available, and it can be withdrawn just as easily.
- Specifies new objects by varying values or structure: a client assembles a prototype
  and then clones it, defining new "classes" of object without writing new classes.
- Reduces subclassing: cloning a prototype avoids the creator subclass that Factory
  Method would otherwise need for each product.
- Hides the concrete product classes from clients: a client works through the prototype
  interface and clones a registered instance, so it never names the concrete classes it
  produces, and that set of classes can change without touching the client.
- Each concrete prototype must implement its own clone operation, which can be awkward
  when the object's internals do not readily support copying or contain circular
  references.

## Example

```ts
interface Prototype<T> {
  clone(): T;
}

// Concrete Prototype: knows how to copy itself, carrying its configured state along.
class Enemy implements Prototype<Enemy> {
  constructor(
    readonly kind: string,
    readonly health: number,
    readonly loot: readonly string[],
  ) {}

  clone(): Enemy {
    return new Enemy(this.kind, this.health, [...this.loot]);
  }
}

// New kinds of enemy are registered as configured prototypes and produced by cloning,
// so no Enemy subclass or factory hierarchy is needed to introduce one.
class EnemyRegistry {
  private readonly prototypes = new Map<string, Enemy>();

  register(name: string, prototype: Enemy): void {
    this.prototypes.set(name, prototype);
  }

  spawn(name: string): Enemy {
    const prototype = this.prototypes.get(name);

    if (prototype === undefined) {
      throw new Error(`unknown enemy: ${name}`);
    }

    return prototype.clone();
  }
}

const registry = new EnemyRegistry();
registry.register("orc", new Enemy("orc", 30, ["coin"]));
const orc = registry.spawn("orc");
```

## Related patterns

- [Abstract Factory](abstract-factory.md#abstract-factory): a rival for creating objects; a concrete factory can also store prototypes and create products by cloning them.
- [Composite](composite.md#composite) and [Decorator](decorator.md#decorator): designs that make heavy use of these patterns often benefit from Prototype to copy their assembled structures.
