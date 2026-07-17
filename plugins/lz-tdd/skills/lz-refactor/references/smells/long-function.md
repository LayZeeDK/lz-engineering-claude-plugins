# Long Function

Recognize by: a function long enough that you have to scan it to understand what it does.

Source: both (also named by Kerievsky in Ch.4 as Long Method).

## How to recognize

The strongest signal is not raw line count but the need to summarize a stretch of the body in your
head. Any time you would write a comment to explain a block, that block wants to be its own named
function. Deeply nested conditionals and long loops inside the function are common contributors.
Distinguish this from [Long Parameter List](long-parameter-list.md): a function can be short in body
yet still take too many arguments, and vice versa; they are addressed by different moves.

## Why it's a problem

Long functions bury intent under mechanism: the reader must hold the whole span in mind to follow it,
and reuse is impossible because behavior is welded together. Short, well-named functions read like a
summary and make the pieces available to change and reuse on their own.

## Candidate refactorings

- [Extract Function](../fowler-catalog/extract-function.md#extract-function): pick when a span of the body can be named for what it does; this is the workhorse move for length.
- [Replace Temp with Query](../fowler-catalog/replace-temp-with-query.md#replace-temp-with-query): pick when local temporaries are what make extraction awkward.
- [Introduce Parameter Object](../fowler-catalog/introduce-parameter-object.md#introduce-parameter-object): pick when extraction is blocked by a clump of arguments that travel together.
- [Preserve Whole Object](../fowler-catalog/preserve-whole-object.md#preserve-whole-object): pick when several extracted parameters all come from one object you could pass instead.
- [Replace Function with Command](../fowler-catalog/replace-function-with-command.md#replace-function-with-command): pick when the whole function is too tangled to split with parameters and returns alone.
- [Decompose Conditional](../fowler-catalog/decompose-conditional.md#decompose-conditional): pick when the length comes from a complex conditional's test and branches.
- [Split Loop](../fowler-catalog/split-loop.md#split-loop): pick when one loop does several things; separate them so each can be extracted.
- [Replace Conditional with Polymorphism](../fowler-catalog/replace-conditional-with-polymorphism.md#replace-conditional-with-polymorphism): pick when the same switching on one condition recurs through the function.
