# Message Chains

Recognize by: a client hopping object-to-object -- `a.b().c().d()` -- to reach what it wants.

## How to recognize

A long navigation where each call returns an object only so the next call can be made on it. The
client ends up knowing the shape of a whole chain of intermediaries, not just its immediate neighbor.
Message chains often accompany [Middle Man](middle-man.md), but they are the opposite failure: a chain
exposes too much structure to the client, whereas a middle man hides everything behind pass-through
methods.

## Why it's a problem

A client that walks a chain is coupled to the structure of every link, so a change anywhere along the
path breaks it. Hiding the navigation behind a method on the first object means the client asks once
and stays ignorant of the intermediaries. Not every chain is worth breaking, though -- some navigation
is reasonable, so weigh whether hiding the delegate earns its keep before acting.

## Candidate refactorings

- [Hide Delegate](../fowler-catalog/hide-delegate.md#hide-delegate) -- pick as the direct move; give the server a method so the client stops walking to the delegate.
- [Extract Function](../fowler-catalog/extract-function.md#extract-function) -- pick when the chain computes something; name that computation, then [Move Function](../fowler-catalog/move-function.md#move-function) it closer to the objects it navigates.
