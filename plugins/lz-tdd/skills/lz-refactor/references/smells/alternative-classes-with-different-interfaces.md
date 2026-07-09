# Alternative Classes with Different Interfaces

Recognize by: classes that do interchangeable jobs but expose them through mismatched interfaces.

Source: both. Also named by Kerievsky (Ch.4) as Alternative Classes with Different Interfaces.

## How to recognize

Two classes that could substitute for one another (they cover the same kind of responsibility), yet
their method names and signatures differ, so callers cannot treat them uniformly and cannot swap one
for the other. The clue is spotting that the classes are alternatives at all, despite the surface
mismatch. Unlike [Duplicated Code](duplicated-code.md), the bodies may differ; it is the interfaces
that should line up and do not.

## Why it's a problem

Alternatives with different interfaces cannot share a common type, so callers branch on which one they
hold and duplication creeps in. Aligning the interfaces lets the classes be used interchangeably and
opens the door to unifying what they share.

## Candidate refactorings

- [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration): pick to rename and reshape methods so the two interfaces match.
- [Move Function](../fowler-catalog/move-function.md#move-function): pick when one class is missing a method the other has; move behavior so both cover the same set.
- [Extract Superclass](../fowler-catalog/extract-superclass.md#extract-superclass): pick once the interfaces align; lift the common protocol to a shared parent.
