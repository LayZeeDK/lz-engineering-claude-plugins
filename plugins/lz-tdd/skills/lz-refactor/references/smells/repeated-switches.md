# Repeated Switches

Recognize by: the same switch (or if/else chain) on the same value showing up in several places.

## How to recognize

You find one conditional that branches on a type or kind, then the same set of cases repeated
elsewhere -- and adding a new case means finding and editing every copy. The repetition of the switch
itself, across sites, is the smell. This is distinct from a single complex conditional (see
[Decompose Conditional](../fowler-catalog/decompose-conditional.md#decompose-conditional) as a tidy-up for
that): here the same branching logic is duplicated across the program.

## Why it's a problem

Every duplicated switch is another place to update when a case is added or changed, and it is easy to
miss one, leaving inconsistent behavior. Replacing the branching with polymorphism puts each variant's
behavior in one class, so a new variant is a new class rather than an edit to every switch.

## Candidate refactorings

- [Replace Conditional with Polymorphism](../fowler-catalog/replace-conditional-with-polymorphism.md#replace-conditional-with-polymorphism) -- pick when the branches vary behavior by type or kind; give each kind a class and let dispatch replace the switch.
