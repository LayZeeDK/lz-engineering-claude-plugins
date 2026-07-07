# Extract Adapter

Use when: one class supports several versions or variants of an external thing, and the version-specific code is spreading through its methods as conditionals.

Direction: To
GoF pattern: [Adapter](../gof-catalog/adapter.md#adapter)
Composed Fowler primitive(s): [Extract Class](../fowler-catalog/extract-class.md#extract-class), [Move Function](../fowler-catalog/move-function.md#move-function), [Replace Conditional with Polymorphism](../fowler-catalog/replace-conditional-with-polymorphism.md#replace-conditional-with-polymorphism), [Pull Up Method](../fowler-catalog/pull-up-method.md#pull-up-method)

## Motivation

When a single class talks to more than one version of an external library, format, or service, it tends to
grow a version field and branch on it in method after method. Every method now mixes the real work with
"which version am I on?" bookkeeping, and adding a version means touching all of them. Extracting an
adapter moves each version's specifics into its own class, so the code that varies by version lives in one
place per version and the client picks an adapter once. The version branching collapses into a choice made
at the edge. Reach for it once the version conditional appears in more than one method.

## Mechanics

1. Create one adapter class per version with
   [Extract Class](../fowler-catalog/extract-class.md#extract-class), each responsible for a single
   version's specifics.
2. Move each version-specific branch body into its matching adapter with
   [Move Function](../fowler-catalog/move-function.md#move-function), dropping the version test as you go;
   where a method still branches on version, turn that branch into a call through the adapter with
   [Replace Conditional with Polymorphism](../fowler-catalog/replace-conditional-with-polymorphism.md#replace-conditional-with-polymorphism).
   Compile and run the tests after each move.
3. Let the shared type emerge from what the adapters have in common rather than fixing it up front, and
   have the client select the right adapter once, then call it through that type.
4. Remove any duplication left across the adapters by lifting the common code with
   [Pull Up Method](../fowler-catalog/pull-up-method.md#pull-up-method) into a shared base that defers the
   version-specific steps to each adapter.
5. Run the tests and confirm each version behaves as it did before.

## Example

Before -- one class branches on the API version everywhere:

```ts
class WeatherClient {
  constructor(private readonly version: 1 | 2) {}
  temperature(payload: Record<string, number>): number {
    if (this.version === 1) {
      return payload["temp"];
    }
    return payload["celsius"];
  }
}
```

After -- one adapter per version, no version field:

```ts
interface Weather {
  temperature(payload: Record<string, number>): number;
}

class WeatherV1 implements Weather {
  temperature(payload: Record<string, number>): number {
    return payload["temp"];
  }
}

class WeatherV2 implements Weather {
  temperature(payload: Record<string, number>): number {
    return payload["celsius"];
  }
}
```

## Watch for

- Extract the adapters only once the version test is genuinely spreading across methods; a single version
  check in one place is cheaper left inline than split into a class hierarchy, and pre-splitting for
  versions you do not yet support builds an abstraction around a guess rather than a real second variant.
- An adapter that narrows the adaptee to one uniform interface can hide behavior a client still needs from
  a particular version -- keep the shared type wide enough that no version's essential capability is cut
  off.
