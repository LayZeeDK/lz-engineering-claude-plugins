# Insider Trading

Recognize by: modules that reach into each other's private detail and trade it back and forth.

## How to recognize

Two modules that know too much about one another's internals -- swapping data and calling into private
corners -- so a change to one keeps forcing a change to the other. Excessive coupling "behind the
scenes", beyond the clean interface each should present. Distinguish from [Feature Envy](feature-envy.md):
feature envy is one function that would rather live in another module; insider trading is a mutual,
two-way over-familiarity between modules.

## Why it's a problem

Hidden coupling between modules means they can no longer change independently, and the tangle grows
until they may as well be one. Reducing the traffic -- moving what belongs together, or routing access
through a proper interface -- lets each module keep its own secrets.

## Candidate refactorings

- [Move Function](../fowler-catalog/move-function.md#move-function) -- pick when a function sits on the wrong side of the boundary; move it to where its data lives.
- [Move Field](../fowler-catalog/move-field.md#move-field) -- pick when data is held by the wrong module; move it to its true owner to cut the back-channel.
- [Hide Delegate](../fowler-catalog/hide-delegate.md#hide-delegate) -- pick when one module navigates another's structure; give it a method and stop exposing internals.
- [Replace Subclass with Delegate](../fowler-catalog/replace-subclass-with-delegate.md#replace-subclass-with-delegate) -- pick when inheritance is the channel through which the two over-share.
- [Replace Superclass with Delegate](../fowler-catalog/replace-superclass-with-delegate.md#replace-superclass-with-delegate) -- pick when a subclass and its parent are the intimate pair; swap inheritance for delegation.
