# Branded Type

Use when: a primitive carries meaning the compiler should enforce -- an id, a unit, a validated string -- and you want that guarantee without allocating a wrapper object.
Correspondence: dissolves-from -> [Replace Type Code with Class](../kerievsky-catalog/replace-type-code-with-class.md#replace-type-code-with-class)
Keep the OO form when: the value needs behavior or runtime identity, it owns coordinated mutable state, construction sits on a measured hot path, or the surrounding house style is object-oriented.

## Idiom

Replace Type Code with Class promotes a bare primitive -- a string id, a status code -- into a class so the type system can tell it apart from every other primitive of the same shape. TypeScript reaches the same nominal safety without a runtime object by branding: intersect the primitive with a unique phantom tag so a plain string cannot be passed where a `UserId` is expected. The brand lives only at compile time; at run time the value is still the primitive, so there is no wrapper to allocate and construction funnels through one smart constructor that applies the tag.

## Example

Before -- a class wraps the primitive to give it a distinct type:

```ts
class UserId {
  constructor(readonly value: string) {}
}

function loadUser(id: UserId): string {
  return `user:${id.value}`;
}

function demo(): string {
  return loadUser(new UserId("42"));
}
```

After -- a branded type plus a smart constructor; the value stays a string:

```ts
type UserId = string & { readonly __brand: "UserId" };

const toUserId = (value: string): UserId => value as UserId;

function loadUser(id: UserId): string {
  return `user:${id}`;
}

function demo(): string {
  return loadUser(toUserId("42"));
}
```

Same behavior; mechanics: [Replace Primitive with Object](../fowler-catalog/replace-primitive-with-object.md#replace-primitive-with-object), run tests between steps.

## When each fits

A branded type fits when the distinction is about type identity rather than behavior -- keeping a `UserId` from being confused with an `OrderId`, or a validated `Email` from any raw string -- and you want that at zero runtime cost. Funnel construction through a single smart constructor, or a validating parser that only tags the value once its invariant is checked, so the brand cannot be forged elsewhere. Keep a real class only when the value needs methods, `instanceof` checks, or private state -- runtime capabilities a phantom tag, which is erased before the code runs, cannot provide.
