# Temporary Field

Recognize by: a field that only holds a meaningful value some of the time.

## How to recognize

An instance field set and used only during a particular operation, empty or irrelevant the rest of the
time, so readers must guess when it applies, and code guards against its being unset. Sometimes a
whole cluster of fields is populated together for one algorithm and otherwise idle. Tell it apart from
[Mutable Data](mutable-data.md): the problem here is not that the field changes but that it is only
sometimes valid, so its home object is the wrong place for it.

## Why it's a problem

A field valid only part of the time misleads every reader of the class and forces defensive checks for
the empty case. Moving the sometimes-used fields, with the code that fills them, into their own home
makes each object's state always meaningful.

## Candidate refactorings

- [Extract Class](../fowler-catalog/extract-class.md#extract-class): pick when the sometimes-used fields form a cluster; give them a class where they are always valid.
- [Move Function](../fowler-catalog/move-function.md#move-function): pick when the code that uses the temporary fields should follow them into the extracted class.
- [Introduce Special Case](../fowler-catalog/introduce-special-case.md#introduce-special-case): pick when callers repeatedly check for the not-populated case; give that case its own object.
