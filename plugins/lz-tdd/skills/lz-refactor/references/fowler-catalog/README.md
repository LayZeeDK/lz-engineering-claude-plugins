# Fowler Catalog (Refactoring, 2nd ed) -- index

Scope: the 62 Fowler refactorings, grouped by their book chapter. Coach mode routes a mechanical
smell here; reference mode looks up a named refactoring here. This is a THIN index -- each row is a
name, its 1st-ed alias(es), and the leaf's `Use when:` line; the mechanics and example live in the
per-refactoring leaf file, never inlined here.

Provenance legend:

- `[web-only]` -- present in the online catalog and verified against the web edition, not in the
  2nd-ed print/e-book (the sole such entry is Return Modified Value).

## Ch.6 -- a first set of refactorings (the basic set)

| Refactoring | 1st-ed aliases | Use when |
|---|---|---|
| [Extract Function](extract-function.md) | Extract Method | a fragment of code can be understood on its own and given a name that says what it does, not how. |
| [Inline Function](inline-function.md) | Inline Method | a function's body is as clear as its name, or a set of poorly-factored functions is easier to reorganize once merged back inline. |
| [Extract Variable](extract-variable.md) | Introduce Explaining Variable | an expression is hard to read, and naming a sub-expression would explain its role. |
| [Inline Variable](inline-variable.md) | Inline Temp | a variable's name says no more than the expression it holds, and it gets in the way of further refactoring. |
| [Change Function Declaration](change-function-declaration.md) | Add/Remove Parameter, Rename Function/Method, Change Signature | a function's name does not reveal its purpose, or its parameter list is wrong for how it is used. |
| [Encapsulate Variable](encapsulate-variable.md) | Encapsulate Field, Self-Encapsulate Field | data with a wide scope -- especially mutable, shared, or global data -- is read and written directly, and you want one place to control that access. |
| [Rename Variable](rename-variable.md) | -- | a variable's name does not convey what it holds, and a clearer name would capture what you now understand. |
| [Introduce Parameter Object](introduce-parameter-object.md) | -- | the same group of arguments travels together through several functions (a data clump). |
| [Combine Functions into Class](combine-functions-into-class.md) | -- | several functions operate closely on the same piece of data and keep passing it around. |
| [Combine Functions into Transform](combine-functions-into-transform.md) | -- | several functions derive extra values from the same source record, and the source is not updated after the fact. |
| [Split Phase](split-phase.md) | -- | one block of code does two distinct things in sequence -- typically it prepares some data and then computes a result from it. |

## Ch.7 -- encapsulation

## Ch.8 -- moving features between objects

## Ch.9 -- organizing data

## Ch.10 -- simplifying conditional logic

## Ch.11 -- refactoring APIs

## Ch.12 -- dealing with inheritance
