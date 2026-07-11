# Large Class

Recognize by: a class trying to do too much, with too many fields and methods.

Source: both (also named by Kerievsky in Ch.4 as Large Class).

## How to recognize

A class with a long field list (often several subsets used together) and many methods, where you
can name more than one responsibility it carries. Prefixed field names (`invoice*`, `customer*`) that
cluster are a hint that a class is hiding inside. This is the class-level counterpart of
[Long Function](long-function.md), and it commonly harbors [Duplicated Code](duplicated-code.md) among
its overlapping methods.

## Why it's a problem

A class carrying too many responsibilities tends to breed duplicated code, because similar logic gets
written across its overlapping methods instead of being shared, and it is hard to understand as a
whole. Splitting it into focused classes removes that duplication and gives each responsibility a
clear home and a smaller surface to reason about.

## Candidate refactorings

- [Extract Class](../fowler-catalog/extract-class.md#extract-class): pick when a subset of fields and their methods form a cohesive unit; split it into its own class.
- [Extract Superclass](../fowler-catalog/extract-superclass.md#extract-superclass): pick when the class's responsibilities are shared with a sibling and belong on a common parent.
- [Replace Type Code with Subclasses](../fowler-catalog/replace-type-code-with-subclasses.md#replace-type-code-with-subclasses): pick when a type code inside the class gates behavior that could split into subclasses.
