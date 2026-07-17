# Replace Type Code with Class

Use when: a field holds one of a fixed set of bare codes (a string or number) that nothing stops callers from getting wrong.

Direction: n/a
GoF pattern: Class / type-safe value (non-GoF)
Composed Fowler primitive(s): [Replace Primitive with Object](../fowler-catalog/replace-primitive-with-object.md#replace-primitive-with-object), [Encapsulate Variable](../fowler-catalog/encapsulate-variable.md#encapsulate-variable)
Functional alternative: [Branded Type](../functional-catalog/branded-type.md#branded-type)

## Motivation

When a value that can only be one of a few known codes is carried as a raw string or number, the type
system offers no protection: any string or any number type-checks, so a typo or an out-of-range value is
caught only at run time, if at all. Replacing the type code with a small class turns the finite set of
valid codes into a finite set of shared instances of that class, and the field's type becomes the class,
so a caller can no longer pass an arbitrary raw value where a code is expected. This refactoring is only
about making the field type-safe; attaching state-dependent behavior to the new class is a separate,
later step. Reach for it once a bare code is being passed around and validated by hand.

## Mechanics

1. Introduce a class for the code with
   [Replace Primitive with Object](../fowler-catalog/replace-primitive-with-object.md#replace-primitive-with-object),
   giving it one shared instance per valid code.
2. Add a new field of the class type alongside the existing code field, assigning it from the code so both
   stay in step; funnel access through an accessor with
   [Encapsulate Variable](../fowler-catalog/encapsulate-variable.md#encapsulate-variable).
3. Switch each reader from the old code field to the new typed field, one at a time; compile and run the
   tests after each.
4. When no reader uses the old code field, delete it and the code-to-instance bridge; run the tests.
5. Optionally, prevent stray instances by making the class's constructor private: the book treats this
   locking as optional hardening, not a required step.

## Example

Before, the priority is a bare string nothing validates:

```ts
class Task {
  constructor(
    private readonly title: string,
    private readonly priority: string,
  ) {}
  isUrgent(): boolean {
    return this.priority === "high";
  }
}
```

After, the priority is a class with a fixed set of instances:

```ts
class Priority {
  static readonly low = new Priority();
  static readonly high = new Priority();
}

class Task {
  constructor(
    private readonly title: string,
    private readonly priority: Priority,
  ) {}
  isUrgent(): boolean {
    return this.priority === Priority.high;
  }
}
```

## Watch for

- Replace the code with a class only when the set of values is genuinely fixed and a wrong value would
  actually cause harm; for a code already constrained elsewhere, or a truly open-ended set, a class of
  instances adds ceremony: the extra code it costs is the refactoring's main price.
- If the codes need distinct behavior rather than just distinct identity, subclasses may fit better than a
  single class of instances. Choose the plain class form when the values differ but their behavior does
  not.
