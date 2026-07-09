# Duplicated Code

Recognize by: the same or nearly-identical code structure appearing in more than one place.

Source: both. Also named by Kerievsky (Ch.4) as Duplicated Code.

## How to recognize

Two or more fragments that read almost the same: identical expressions, parallel branches of a
conditional, or sibling methods that differ only in a detail. The tell is that a change to one copy
means hunting down and editing the others. Watch for near-duplicates that have drifted slightly:
those are the dangerous ones, because the difference may be a bug rather than intent. Where the copies
live tells you which refactoring fits: same function, same class, or sibling subclasses.

## Why it's a problem

Every copy is a place a future change can be forgotten, so duplication multiplies the cost and risk of
each edit and invites the copies to diverge into subtle inconsistencies. Merging duplication to a
single source makes the code shorter and gives each behavior exactly one home to change.

## Candidate refactorings

- [Extract Function](../fowler-catalog/extract-function.md#extract-function): pick when the same expression appears in more than one place; give it one named home and call it from each.
- [Slide Statements](../fowler-catalog/slide-statements.md#slide-statements): pick when the duplicates are similar but not adjacent; bring the matching lines together first, then extract.
- [Pull Up Method](../fowler-catalog/pull-up-method.md#pull-up-method): pick when the identical code sits in sibling subclasses; lift it to the shared parent.
