# Move Creation Knowledge to Factory

Use when: the knowledge of which concrete type to build, and how to wire it, is sprawled across the collaborator classes that produce or hold these objects.

Direction: To
GoF pattern: [Factory](../extra-patterns-catalog/factory.md#factory)
Composed Fowler primitive(s): [Move Function](../fowler-catalog/move-function.md#move-function), [Extract Class](../fowler-catalog/extract-class.md#extract-class), [Move Field](../fowler-catalog/move-field.md#move-field)
Functional alternative: [Factory Function](../functional-catalog/factory-function.md#factory)

## Motivation

When the decision of which concrete type to build, and the data needed to build it, are spread across
the classes that collaborate to make these objects, no single place owns creation and each
collaborator is coupled to the concrete classes. Gathering that scattered creation knowledge (both
the selection logic and the data it depends on) into a dedicated factory gives creation one home,
so collaborators ask the factory and depend only on the abstraction. Do it once the making of an
object is smeared across several classes rather than owned by one.

## Mechanics

1. Find the creation knowledge (the type-selection logic and the fields it reads) spread across
   the collaborators.
2. Create a factory type (or a creation method on an existing owner) to hold it.
3. Move one collaborator's creation code into the factory; have that collaborator call the factory
   instead; compile and run the tests.
4. Repeat for each collaborator, converging every caller on the one factory.
5. Consolidate the data those decisions relied on (the scattered fields) into the factory, so the
   creation knowledge and its state live together; compile and run the tests.

## Example

Before, the carrier rule is embedded in a collaborator and repeated wherever a carrier is chosen:

```ts
interface Carrier {
  label(): string;
}

class Ground implements Carrier {
  label(): string {
    return "ground";
  }
}

class Air implements Carrier {
  label(): string {
    return "air";
  }
}

function quote(weightKg: number): Carrier {
  return weightKg > 20 ? new Ground() : new Air();
}
```

After, the rule (and the threshold it depends on) live in a factory the collaborator is handed:

```ts
interface Carrier {
  label(): string;
}

class Ground implements Carrier {
  label(): string {
    return "ground";
  }
}

class Air implements Carrier {
  label(): string {
    return "air";
  }
}

class CarrierFactory {
  constructor(private readonly groundOverKg: number) {}

  forWeight(weightKg: number): Carrier {
    return weightKg > this.groundOverKg ? new Ground() : new Air();
  }
}

function quote(weightKg: number, carriers: CarrierFactory): Carrier {
  return carriers.forWeight(weightKg);
}
```

## Watch for

- A single collaborator that already owns all of the creation knowledge does not need a separate
  factory. This refactoring pays off when the knowledge is genuinely scattered.
