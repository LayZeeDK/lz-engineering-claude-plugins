# Lazy Element

Recognize by: a program element that does too little to justify its own existence.

Source: both (also named by Kerievsky in Ch.4 as Lazy Class).

## How to recognize

A function whose body is as clear as a call to it would be, a class with a single method that adds
nothing over a plain function, or a subclass that no longer differs meaningfully from its parent.
Often the leftover of an earlier design that was expected to grow and never did. Separate this from
[Speculative Generality](speculative-generality.md): a lazy element is a thin thing that earns its
keep only if inlined away; speculative generality is machinery built for a need that never arrived.

## Why it's a problem

Each element a reader must open and understand has a cost; one that adds no meaning is pure overhead,
padding the structure and slowing navigation. Folding it back into its user removes a layer without
losing anything.

## Candidate refactorings

- [Inline Function](../fowler-catalog/inline-function.md#inline-function): pick when a function's body says no more than its name; merge it back into callers.
- [Inline Class](../fowler-catalog/inline-class.md#inline-class): pick when a class no longer pulls its weight; fold its few features into its main user.
- [Collapse Hierarchy](../fowler-catalog/collapse-hierarchy.md#collapse-hierarchy): pick when a subclass and its parent have grown too alike to keep apart.
