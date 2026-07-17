# Primitive Obsession

Recognize by: bare primitives standing in for concepts that deserve their own type.

Source: both (also named by Kerievsky in Ch.4 as Primitive Obsession).

## How to recognize

Strings, numbers, and booleans used to represent money, ranges, phone numbers, coordinates, or type
codes, so formatting, validation, and related rules get duplicated wherever the value is used. A
type-code primitive that drives conditionals is a strong signal. Distinguish from
[Data Clumps](data-clumps.md): clumps are groups of values that want to combine; primitive obsession is
usually a single value that wants to become a richer type.

## Why it's a problem

A primitive carries no behavior, so every rule about the concept it stands for gets re-implemented at
each use site and drifts out of step. Giving the concept a class puts its formatting, validation, and
comparisons in one place and lets the type system help catch misuse.

## Candidate refactorings

- [Replace Primitive with Object](../fowler-catalog/replace-primitive-with-object.md#replace-primitive-with-object): pick when a value has started to carry meaning and needs behavior of its own.
- [Replace Type Code with Subclasses](../fowler-catalog/replace-type-code-with-subclasses.md#replace-type-code-with-subclasses): pick when a type-code value gates behavior or fields that apply only to some values.
- [Replace Conditional with Polymorphism](../fowler-catalog/replace-conditional-with-polymorphism.md#replace-conditional-with-polymorphism): pick when conditionals switch on the type code across the code.
- [Extract Class](../fowler-catalog/extract-class.md#extract-class): pick when several related primitives should become one concept with its own class.
- [Introduce Parameter Object](../fowler-catalog/introduce-parameter-object.md#introduce-parameter-object): pick when the primitives recur together through signatures.
