# Data Clumps

Recognize by: the same few data items appearing together in field lists and parameter lists.

## How to recognize

A recurring group (start and end date, or street/city/postcode) that shows up as fields in several
classes and as arguments in several signatures. A quick test: delete one of the values; if the rest no
longer make sense on their own, they are a clump that wants to be one object. Data clumps often feed
[Long Parameter List](long-parameter-list.md) and overlap with [Primitive Obsession](primitive-obsession.md),
which is about single values that want richer types rather than groups that want to combine.

## Why it's a problem

Repeating the group everywhere duplicates its structure and scatters the logic that belongs to it, so
each change to the group means editing many places. Making the clump a single object gives that logic
one home and shortens every signature that used to spell the group out.

## Candidate refactorings

- [Extract Class](../fowler-catalog/extract-class.md#extract-class): pick when the clump appears as fields; give it its own class so behavior can gather there.
- [Introduce Parameter Object](../fowler-catalog/introduce-parameter-object.md#introduce-parameter-object): pick when the clump appears in parameter lists; replace the group with one object.
- [Preserve Whole Object](../fowler-catalog/preserve-whole-object.md#preserve-whole-object): pick when a caller already holds an object carrying the clump and could pass it whole.
