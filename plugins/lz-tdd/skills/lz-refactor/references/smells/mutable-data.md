# Mutable Data

Recognize by: data updated in place, where one update can surprise code elsewhere that shares it.

## How to recognize

A variable or structure assigned repeatedly, reused for different purposes across its lifetime, or
shared and mutated by code that does not obviously belong together. Look for a value that is both
computed and later mutated by hand, or a reference passed around and changed behind an owner's back.
When the data is reachable program-wide, see [Global Data](global-data.md); this leaf covers the
narrower-scope cases.

## Why it's a problem

Updates in one corner can ripple to another that read the value expecting it unchanged, producing bugs
that are hard to reproduce and reason about. Confining, deriving, or freezing mutation removes whole
classes of these coupling bugs and makes data flow easier to follow. Mutable data is not always worth chasing:
when its scope spans only a couple of lines, the risk is small and the smell is minor.

## Candidate refactorings

- [Encapsulate Variable](../fowler-catalog/encapsulate-variable.md#encapsulate-variable): pick when the data is read and written directly; route access through functions so updates have one controllable path.
- [Split Variable](../fowler-catalog/split-variable.md#split-variable): pick when one variable is reassigned for two different purposes; give each purpose its own variable.
- [Slide Statements](../fowler-catalog/slide-statements.md#slide-statements): pick when update code is scattered; gather it, then [Extract Function](../fowler-catalog/extract-function.md#extract-function) so mutation lives in one place.
- [Separate Query from Modifier](../fowler-catalog/separate-query-from-modifier.md#separate-query-from-modifier): pick when a function both returns a value and mutates state; split the two.
- [Remove Setting Method](../fowler-catalog/remove-setting-method.md#remove-setting-method): pick when a field should be set once at creation and never change afterward.
- [Replace Derived Variable with Query](../fowler-catalog/replace-derived-variable-with-query.md#replace-derived-variable-with-query): pick when a mutable variable merely caches something computable from other data.
- [Change Reference to Value](../fowler-catalog/change-reference-to-value.md#change-reference-to-value): pick when a shared mutable sub-object would be safer as an immutable value replaced wholesale.
- [Combine Functions into Class](../fowler-catalog/combine-functions-into-class.md#combine-functions-into-class): pick to gather the functions that update the data so fewer places can change it.
- [Combine Functions into Transform](../fowler-catalog/combine-functions-into-transform.md#combine-functions-into-transform): pick when the updates derive new values from source data; compute them in one transform instead.
