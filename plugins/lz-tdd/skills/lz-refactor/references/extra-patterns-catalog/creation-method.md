# Creation Method

## Intent

Replace a plain or overloaded constructor with a named method that builds and returns the
object, so the creation site says which kind of object it makes.

## Applicability

Use it when a class is created through constructors that are ambiguous or fail to reveal what kind of object results.

Reach for it when a class has several constructors that differ only by parameter list and are easy to confuse, or when the plain `new` expression does not convey the intent of the object being made.

## Consequences

- Reveals intent at the creation site: a well-named method states what kind of object it
  produces, which a bare `new` or a set of look-alike constructors does not.
- Disambiguates multiple ways to construct: several named creation methods replace
  constructors that differ only by their parameters and are easy to mix up.
- Can make object creation inconsistent across a codebase: once some classes are built
  through named creation methods while others are still created with a bare constructor,
  callers meet two different creation styles, so the pattern only pays off when the team
  applies it consistently.

## Example

```ts
// Each Creation Method is an intention-revealing named builder that returns an instance,
// used in place of a bare or overloaded constructor.
class Color {
  private constructor(
    readonly red: number,
    readonly green: number,
    readonly blue: number,
  ) {}

  static fromRgb(red: number, green: number, blue: number): Color {
    return new Color(red, green, blue);
  }

  static fromGray(level: number): Color {
    return new Color(level, level, level);
  }
}

const teal = Color.fromRgb(0, 128, 128);
const mid = Color.fromGray(128);
```

## Related patterns

- [Factory](factory.md#factory): creation methods frequently live on a factory that concentrates the creation of a family of products.
- [Factory Method](../gof-catalog/factory-method.md#factory-method): differs in that a factory method is overridden by subclasses to choose the product, whereas a creation method simply gives construction an intention-revealing name.
