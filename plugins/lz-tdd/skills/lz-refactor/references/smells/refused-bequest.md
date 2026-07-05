# Refused Bequest

Recognize by: a subclass that uses little of what it inherits, or overrides it to do nothing.

## How to recognize

A child class that ignores most of the parent's fields and methods, or overrides inherited behavior to
reject or no-op it -- a sign the inheritance was chosen for convenience rather than a true "is a"
relationship. The sharper alarm is a subclass that refuses the parent's interface, not merely its
implementation. Distinguish from [Lazy Element](lazy-element.md): here the hierarchy is mis-shaped, not
merely thin.

## Why it's a problem

A subclass that declines some inherited implementation is common and usually harmless -- inheriting to
reuse is a reasonable trade, so this smell is often mild enough to leave alone. It turns serious only
when the child refuses the parent's interface: then the "is a kind of" promise is a lie that misleads
readers and breaks code relying on substitutability. Judge the strength before acting; when a change
is warranted, reshape the hierarchy or replace inheritance with delegation.

## Candidate refactorings

- [Push Down Method](../fowler-catalog/push-down-method.md#push-down-method) -- pick when only some subclasses want a parent method; push it down to those that use it.
- [Push Down Field](../fowler-catalog/push-down-field.md#push-down-field) -- pick when a parent field is used by only some subclasses; push it down to them.
- [Replace Subclass with Delegate](../fowler-catalog/replace-subclass-with-delegate.md#replace-subclass-with-delegate) -- pick when a subclass refuses the bequest; make it delegate to the former parent instead.
- [Replace Superclass with Delegate](../fowler-catalog/replace-superclass-with-delegate.md#replace-superclass-with-delegate) -- pick when the parent is the wrong base; swap inheritance for delegation from the child's side.
