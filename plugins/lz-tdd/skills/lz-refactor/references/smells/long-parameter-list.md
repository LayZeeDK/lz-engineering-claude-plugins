# Long Parameter List

Recognize by: a parameter list long enough that callers struggle to get the arguments in the right order.

## How to recognize

A function that takes many arguments, especially when some are always passed together, when one is a
value the function could work out for itself, or when a boolean or enum switches the function between
behaviors. Long lists often hide a [Data Clump](data-clumps.md) (the same group of arguments recurring)
or [Primitive Obsession](primitive-obsession.md) (bare values that want to be an object). Tell it apart
from [Long Function](long-function.md): here the trouble is the signature, not the body.

## Why it's a problem

Long parameter lists are hard to call correctly and hard to read: callers juggle order and meaning,
and every added parameter ripples through every call site. Grouping related arguments or letting the
function derive what it can shortens the list and makes the remaining parameters meaningful.

## Candidate refactorings

- [Replace Parameter with Query](../fowler-catalog/replace-parameter-with-query.md#replace-parameter-with-query): pick when a parameter's value can be derived from the other arguments or from the receiver.
- [Preserve Whole Object](../fowler-catalog/preserve-whole-object.md#preserve-whole-object): pick when several parameters are pulled from one object the function could take whole.
- [Introduce Parameter Object](../fowler-catalog/introduce-parameter-object.md#introduce-parameter-object): pick when a group of arguments keeps travelling together across functions.
- [Remove Flag Argument](../fowler-catalog/remove-flag-argument.md#remove-flag-argument): pick when a boolean or enum argument makes the function branch into distinct behaviors.
- [Combine Functions into Class](../fowler-catalog/combine-functions-into-class.md#combine-functions-into-class): pick when the same arguments are threaded through several related functions; make them fields instead.
