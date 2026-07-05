# Mysterious Name

Recognize by: a name that makes you stop and work out what it refers to, or that points you the wrong way.

## How to recognize

A function, variable, field, class, or module whose name does not say plainly what it is or does.
You reread the body to remember its purpose, or the name suggests one thing while the code does
another. A good test: try to rename it to something crisp -- if no short, honest name comes, the
trouble is usually that the thing itself is doing too much, and the naming difficulty is a symptom of
a deeper smell. Separate this from [Comments](comments.md): a comment that exists only to explain what
a name should have said is really this smell wearing a disguise.

## Why it's a problem

Names are the primary way code communicates intent. A misleading or vague name forces every future
reader to decode the implementation instead of trusting the name, and the misunderstanding it plants
tends to spread into callers and new code written against it. Clear naming is the cheapest and most
frequent refactoring, so a mysterious name left in place quietly taxes every later change.

## Candidate refactorings

- [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration) -- pick when the unclear name is on a function; rename it (and revisit its parameter names in the same pass).
- [Rename Variable](../fowler-catalog/rename-variable.md#rename-variable) -- pick when the unclear name is a local variable or temp.
- [Rename Field](../fowler-catalog/rename-field.md#rename-field) -- pick when the unclear name is a record or class field that outlives a single call.
