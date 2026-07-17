# Shotgun Surgery

Recognize by: one kind of change forcing many small edits scattered across many modules.

Source: both (also named by Kerievsky in Ch.4 as Solution Sprawl).

## How to recognize

Making a single conceptual change (adding a currency, changing how a fee is calculated) means
touching a little bit of many files, and it is easy to miss one. The behavior for one responsibility
is smeared across the codebase. Contrast [Divergent Change](divergent-change.md): there, many kinds of
change hit one module; here, one kind of change hits many modules.

## Why it's a problem

Scattered responsibility makes changes laborious and error-prone: the more places you must find and
edit, the more likely one is forgotten, leaving an inconsistent, half-changed system. Gathering the
scattered behavior into one module turns the change into a single, local edit.

## Candidate refactorings

- [Move Function](../fowler-catalog/move-function.md#move-function): pick when the scattered behavior is functions that should live together in one module.
- [Move Field](../fowler-catalog/move-field.md#move-field): pick when scattered data should be gathered alongside the behavior that uses it.
- [Combine Functions into Class](../fowler-catalog/combine-functions-into-class.md#combine-functions-into-class): pick when the gathered functions all work on the same data; make them a class.
- [Combine Functions into Transform](../fowler-catalog/combine-functions-into-transform.md#combine-functions-into-transform): pick when the scattered functions all derive values from the same source data.
- [Inline Function](../fowler-catalog/inline-function.md#inline-function): pick when the behavior was over-split; pull the pieces back together first, then re-divide cleanly.
- [Inline Class](../fowler-catalog/inline-class.md#inline-class): pick alongside Inline Function when an over-split class should be merged back before the logic is re-divided.
- [Split Phase](../fowler-catalog/split-phase.md#split-phase): pick when the gathered functions can combine their output for a later consuming phase.
