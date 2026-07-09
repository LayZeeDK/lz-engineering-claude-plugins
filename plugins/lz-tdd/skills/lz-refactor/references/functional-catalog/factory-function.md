# Factory Function

Use when: construction logic is spread across factory classes or subclasses, and choosing what to build is really a lookup by a variant key.
Correspondence: dissolves-from -> [Abstract Factory](../gof-catalog/abstract-factory.md#abstract-factory), [Factory Method](../gof-catalog/factory-method.md#factory-method), [Factory](../extra-patterns-catalog/factory.md#factory), [Creation Method](../extra-patterns-catalog/creation-method.md#creation-method), [Replace Constructors with Creation Methods](../kerievsky-catalog/replace-constructors-with-creation-methods.md#replace-constructors-with-creation-methods), [Move Creation Knowledge to Factory](../kerievsky-catalog/move-creation-knowledge-to-factory.md#move-creation-knowledge-to-factory), [Encapsulate Classes with Factory](../kerievsky-catalog/encapsulate-classes-with-factory.md#encapsulate-classes-with-factory), [Introduce Polymorphic Creation with Factory Method](../kerievsky-catalog/introduce-polymorphic-creation-with-factory-method.md#introduce-polymorphic-creation-with-factory-method), [Chain Constructors](../kerievsky-catalog/chain-constructors.md#chain-constructors)
Keep the OO form when: creation involves coordinated mutable state or lifecycle, the product family churns with new operations, or house style expects an injectable factory object.

## Idiom

Return constructed values from a plain function rather than a constructor or a factory class. When several variants share a shape, key their builders in a record and look one up, so selecting a variant is a data lookup instead of a subclass choice.

## Example

Before, an abstract factory with one factory class per product family:

```ts
interface Button {
  render(): string;
}

class LightButton implements Button {
  render(): string {
    return "light button";
  }
}

class DarkButton implements Button {
  render(): string {
    return "dark button";
  }
}

interface ButtonFactory {
  create(): Button;
}

class LightButtonFactory implements ButtonFactory {
  create(): Button {
    return new LightButton();
  }
}

class DarkButtonFactory implements ButtonFactory {
  create(): Button {
    return new DarkButton();
  }
}

const factory: ButtonFactory = new DarkButtonFactory();
const button: Button = factory.create();
```

After, a creation function plus a record of builders keyed by variant:

```ts
type Theme = "light" | "dark";

interface Button {
  render(): string;
}

const makeButton = (label: string): Button => ({
  render: () => label,
});

const buttonFactories: Record<Theme, () => Button> = {
  light: () => makeButton("light button"),
  dark: () => makeButton("dark button"),
};

const createButton = (theme: Theme): Button => buttonFactories[theme]();

const button: Button = createButton("dark");
```

Same behavior; mechanics: run [Replace Constructors with Creation Methods](../kerievsky-catalog/replace-constructors-with-creation-methods.md#replace-constructors-with-creation-methods): replace each factory class with a named creation function, run tests between steps.

## When each fits

### Abstract Factory

A family of related products becomes a record of creation functions keyed by variant, and selecting the family is choosing which record to read.

### Factory Method

An overridable creation method becomes a function parameter or a lookup entry, so varying what gets built no longer requires a subclass.

### Factory

A standalone factory object collapses to a plain function that returns the constructed value with no surrounding class.

### Creation Method

A named static constructor becomes an exported creation function that reveals intent and hides the concrete shape being built.
