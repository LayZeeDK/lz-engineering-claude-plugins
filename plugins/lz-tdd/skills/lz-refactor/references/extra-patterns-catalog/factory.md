# Factory

Functional alternative: [Factory Function](../functional-catalog/factory-function.md#factory)

## Intent

Concentrate the creation of related objects in one place that hides which concrete class is
built and how it is assembled, so callers ask for a product by intent and never name or
construct the concrete types themselves.

## Applicability

Use it when the choice of which concrete class to create, and the work of building it, is duplicated across callers or exposes concrete types they should not depend on.

Reach for it when construction is non-trivial, when the concrete product should be selectable or replaceable, or when scattering `new` expressions has tied callers to classes you want to keep private.

## Consequences

- Centralizes creation: the knowledge of which concrete class to build, and how, lives in
  one place instead of being copied across callers.
- Decouples callers from concrete classes: callers depend on the product interface and the
  factory, so the concrete products can change without touching them.
- Adds a level of indirection: the factory is another type to maintain, which pays off once
  creation is non-trivial or duplicated but is overhead when construction is trivial.

## Example

```ts
interface Parser {
  parse(text: string): number;
}

class CsvParser implements Parser {
  parse(text: string): number {
    return text.split(",").length;
  }
}

class JsonParser implements Parser {
  parse(text: string): number {
    return text.trim().length;
  }
}

// Factory: holds the decision of which concrete Parser to build, hiding the concrete
// classes and the selection logic from callers.
class ParserFactory {
  create(format: string): Parser {
    if (format === "csv") {
      return new CsvParser();
    }

    return new JsonParser();
  }
}

const factory = new ParserFactory();
const parser = factory.create("csv");
const fieldCount = parser.parse("a,b,c");
```

## Related patterns

- [Abstract Factory](../gof-catalog/abstract-factory.md#abstract-factory) and [Factory Method](../gof-catalog/factory-method.md#factory-method): the Gang of Four creational patterns this more general Factory subsumes; use the specific one when its structure (a family of products, or a subclass hook) fits.
- [Creation Method](creation-method.md#creation-method): a factory usually exposes its products through intention-revealing creation methods.
