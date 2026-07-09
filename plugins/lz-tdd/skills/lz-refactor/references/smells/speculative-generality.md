# Speculative Generality

Recognize by: machinery built for a flexibility that was anticipated but never needed.

## How to recognize

Abstract classes with a single concrete child, hooks and parameters no caller uses, delegation put in
"in case we need it", or names like `doEverything` with unused options. The tell is that the
generality serves a hypothetical future rather than any current caller. Distinguish from
[Lazy Element](lazy-element.md): a lazy element is simply too small to justify itself; speculative
generality is extra structure serving a need that has not arrived.

## Why it's a problem

Unused flexibility is weight the reader must understand and the maintainer must keep working, all for
a case that may never come: the opposite of doing the simplest thing that works now. Removing it
leaves code that fits its actual use and is easier to change when the real need does arrive.

## Candidate refactorings

- [Collapse Hierarchy](../fowler-catalog/collapse-hierarchy.md#collapse-hierarchy): pick when an abstract class and its lone subclass no longer earn the separation.
- [Inline Function](../fowler-catalog/inline-function.md#inline-function): pick when indirection was added for reuse that never happened.
- [Inline Class](../fowler-catalog/inline-class.md#inline-class): pick when a class was split out for a role it never took on.
- [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration): pick when parameters exist only for unused flexibility; remove them.
- [Remove Dead Code](../fowler-catalog/remove-dead-code.md#remove-dead-code): pick when the element's only remaining users are its own tests; delete those tests first, then remove it.
