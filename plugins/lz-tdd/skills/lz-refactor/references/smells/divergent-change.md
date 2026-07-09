# Divergent Change

Recognize by: one module you keep editing for several unrelated reasons.

## How to recognize

You find yourself changing the same file whenever any of several different kinds of requirement
change (a new database, a new report format, a new business rule) and the edits touch different,
unrelated parts of it each time. The module mixes concerns that change on independent schedules. This
is the mirror image of [Shotgun Surgery](shotgun-surgery.md): divergent change is one module touched by
many kinds of change; shotgun surgery is one kind of change touching many modules.

## Why it's a problem

When one module answers to several forces, every change risks disturbing the others, and you must
understand concerns that have nothing to do with your task. Splitting it so each context has its own
module means a given change lands in one place, with a smaller blast radius.

## Candidate refactorings

- [Split Phase](../fowler-catalog/split-phase.md#split-phase): pick when the two concerns run in sequence (prepare, then process); separate them into distinct phases.
- [Extract Function](../fowler-catalog/extract-function.md#extract-function): pick when the concerns are interleaved statements; name and separate each before moving it.
- [Move Function](../fowler-catalog/move-function.md#move-function): pick when the separated behavior belongs in another module dedicated to that concern.
- [Extract Class](../fowler-catalog/extract-class.md#extract-class): pick when one of the concerns is a cohesive cluster of data and behavior that deserves its own class.
