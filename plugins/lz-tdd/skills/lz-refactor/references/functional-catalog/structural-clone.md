# Structural Clone

Use when: you want a fresh value seeded from an existing one and would rather copy its data than route creation through a clone method on a class.
Correspondence: dissolves-from -> [Prototype](../gof-catalog/prototype.md#prototype)
Keep the OO form when: copying must run class-specific logic, the object has identity or coordinated mutable state, cloning sits on a measured hot path, or the surrounding house style is object-oriented.

## Idiom

Prototype builds new objects by copying an existing instance rather than invoking a constructor, which helps when construction is costly or the concrete type is chosen at run time. In functional code a copy is a structural operation on data: a spread `{ ...template }` for a shallow copy, `structuredClone` for a deep one, or `Object.create` when the goal is to share a prototype. There is no `clone` method to override: the copy is expressed as data, and updates spread the old value and overwrite a field.

## Example

Before, a class exposes a `clone` method that reconstructs itself:

```ts
interface Prototype {
  clone(): Prototype;
}

class Circle implements Prototype {
  constructor(
    public radius: number,
    public color: string,
  ) {}

  clone(): Circle {
    return new Circle(this.radius, this.color);
  }
}
```

After, a copy is a spread; an update overwrites one field of the template:

```ts
type Circle = { readonly radius: number; readonly color: string };

const withRadius = (template: Circle, radius: number): Circle => ({
  ...template,
  radius,
});

function demo(): Circle {
  const base: Circle = { radius: 1, color: "red" };

  return withRadius(base, 2);
}
```

Same behavior; mechanics: [Substitute Algorithm](../fowler-catalog/substitute-algorithm.md#substitute-algorithm), run tests between steps.

## When each fits

A structural copy fits when you want a new value based on an existing one (prototypes and templates, defaults you override a field at a time, or copy-on-write updates). Match the copy to the depth you need: a spread when a shallow copy suffices, `structuredClone` when nested data must be copied deeply, and `Object.create` when the point is to share a prototype rather than duplicate fields. Keep an explicit `clone` method only when copying must run class-specific logic (registering the copy, duplicating handles, or re-wiring back-references) that a generic structural copy cannot see.
