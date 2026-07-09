# Replace Type Code with Subclasses

*Aliases: Extract Subclass; Replace Type Code with State/Strategy.*

Use when: a type-code field drives behavior through conditionals, or gates fields that only apply to certain values.

## Motivation

A type code that a class switches on is a request for polymorphism. Turning each value into a subclass
lets [Replace Conditional with Polymorphism](replace-conditional-with-polymorphism.md) dispatch on the
type instead of testing it, and lets fields that only matter for one value live on the subclass that
uses them. Reach for subclasses of a separate state object (the State/Strategy shape) when the
host is already subclassed on another axis, or when the code value can change during an object's life.

## Mechanics

1. Self-encapsulate the type-code field with [Encapsulate Variable](encapsulate-variable.md) so it is
   read through a getter.
2. Create one subclass for a single type-code value and override the getter to return that value.
3. Route construction through a selector that returns the right subclass for a code, introduced with
   [Replace Constructor with Factory Function](replace-constructor-with-factory-function.md); run the
   tests.
4. Repeat for each remaining type-code value, testing after each.
5. Remove the type-code field once every value has a subclass, and run the tests.
6. Move type-specific behavior down onto the subclass that owns it: turn type-branching logic into
   polymorphism with [Replace Conditional with Polymorphism](replace-conditional-with-polymorphism.md),
   and send a method that only one type uses down with [Push Down Method](push-down-method.md); once
   nothing outside the subclasses reads the type, delete its accessor and run the tests.

To reverse this move (folding thin subclasses back into a field), see [Remove Subclass](remove-subclass.md).

## Example

Before, a transit time chosen by a carrier type code:

```ts
class Shipment {
  constructor(private readonly carrier: "air" | "ground") {}

  get transitDays(): number {
    return this.carrier === "air" ? 2 : 5;
  }
}
```

After, each carrier is a subclass and a factory selects it:

```ts
abstract class Shipment {
  abstract get transitDays(): number;
}

class AirShipment extends Shipment {
  get transitDays(): number {
    return 2;
  }
}

class GroundShipment extends Shipment {
  get transitDays(): number {
    return 5;
  }
}

function createShipment(carrier: "air" | "ground"): Shipment {
  return carrier === "air" ? new AirShipment() : new GroundShipment();
}
```

## Watch for

- If the type value must change while the object lives, do not subclass the host directly; subclass a
  separate state object it delegates to, so the object can swap states.
