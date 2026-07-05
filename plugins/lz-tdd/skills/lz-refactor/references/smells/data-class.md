# Data Class

Recognize by: a class that is all fields and accessors, with no behavior of its own.

## How to recognize

A class holding data -- public fields or getters and setters -- that other code manipulates from
outside, doing all the work that ought to belong to the data. Callers reach in, compute, and write
back. The tell is that logic about the data lives everywhere except the class that owns it. This
overlaps with [Feature Envy](feature-envy.md) in the callers: they envy the data because the data has
no behavior to offer.

## Why it's a problem

A class with no behavior lets its rules scatter across callers, duplicating them and coupling everyone
to its field layout -- and unguarded fields allow invalid states. Pulling behavior into the class, and
controlling how its data is set, turns a passive record into a real object. A data class is not always
a smell: when it holds an immutable intermediate result passed between two processing phases (see
[Split Phase](../fowler-catalog/split-phase.md#split-phase)), being pure data is the point, not a defect.

## Candidate refactorings

- [Encapsulate Record](../fowler-catalog/encapsulate-record.md#encapsulate-record) -- pick when public fields are read and written directly; wrap them so access runs through the class.
- [Remove Setting Method](../fowler-catalog/remove-setting-method.md#remove-setting-method) -- pick for fields that should be set once at creation and never changed.
- [Move Function](../fowler-catalog/move-function.md#move-function) -- pick when caller logic about the data should move into the class.
- [Extract Function](../fowler-catalog/extract-function.md#extract-function) -- pick when only part of a caller's method is data behavior; extract it before moving it in.
