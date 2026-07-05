# Middle Man

Recognize by: a class whose methods mostly just forward to another object.

## How to recognize

You look at a class's interface and find that a large share of its methods do nothing but delegate to
a field, adding no behavior of their own. Encapsulation has tipped over into pure forwarding. This is
the flip side of [Message Chains](message-chains.md): a middle man hides its delegate so thoroughly
that it becomes dead weight, while a message chain exposes the delegate's structure directly.

## Why it's a problem

When most of a class only forwards, the indirection costs more than the encapsulation buys: readers
and callers pay for a layer that adds nothing. Removing the excess forwarding, or turning the
relationship into real delegation, restores a class that earns its interface.

## Candidate refactorings

- [Remove Middle Man](../fowler-catalog/remove-middle-man.md#remove-middle-man) -- pick when the forwarding dominates; let clients talk to the delegate directly.
- [Inline Function](../fowler-catalog/inline-function.md#inline-function) -- pick when only a few delegating methods remain; fold them into their callers.
- [Replace Superclass with Delegate](../fowler-catalog/replace-superclass-with-delegate.md#replace-superclass-with-delegate) -- pick when you want to keep and build on some of the delegated behavior rather than simply forward it.
- [Replace Subclass with Delegate](../fowler-catalog/replace-subclass-with-delegate.md#replace-subclass-with-delegate) -- pick when the forwarding should become real delegation you can extend, not just remove.
