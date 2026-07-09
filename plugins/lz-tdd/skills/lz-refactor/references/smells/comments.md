# Comments

Recognize by: comments used to explain code that should have been made clear on its own.

## How to recognize

Comments that narrate what a block does, apologize for a tangle, or restate a name, the kind that
exist because the code does not speak for itself. This is not a ban on comments: comments that record
why a decision was made, or flag a genuine subtlety, are valuable. The smell is the comment that could
be replaced by a better name or a clearer structure. Such comments often mark a hidden
[Long Function](long-function.md) or [Mysterious Name](mysterious-name.md).

## Why it's a problem

A comment that stands in for clear code is a deodorant over a smell: it can go stale as the code
changes, and it signals a structure that could be made self-explanatory instead. Turning the comment
into a name or a small function makes the intent live in the code, where it stays honest.

## Candidate refactorings

- [Extract Function](../fowler-catalog/extract-function.md#extract-function): pick when a comment introduces a block; extract that block and let its name carry the comment's meaning.
- [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration): pick when a comment explains what a badly-named function does; rename it instead.
- [Introduce Assertion](../fowler-catalog/introduce-assertion.md#introduce-assertion): pick when a comment states an assumption the code relies on; make it an executable assertion.
