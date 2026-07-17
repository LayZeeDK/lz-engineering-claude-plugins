# Indecent Exposure

Recognize by: classes, constructors, or methods that ought to be hidden are publicly reachable, leaking implementation detail callers should never see.

Source: Kerievsky

## How to recognize

The public surface of a module is wider than its real contract: concrete classes clients should reach only through an interface are directly constructible, or helper methods that support one internal responsibility are callable from anywhere. The tell is that callers name and depend on things that are supposed to be internal. Do not confuse this with
[Insider Trading](insider-trading.md), where two modules trade each other's private detail back and forth, or with a class that merely forwards calls. Here the problem is a failure of information hiding: too much is exposed in the first place.

## Why it's a problem

Every exposed internal is something other code can now depend on, so you lose the freedom to change it without breaking callers, and the true contract of the module gets lost in the noise of accidental public members. Narrowing exposure (handing out instances through a factory behind a shared interface, and keeping support methods private) restores information hiding and lets the implementation change freely.

## Candidate refactorings

- [Encapsulate Classes with Factory](../kerievsky-catalog/encapsulate-classes-with-factory.md#encapsulate-classes-with-factory): pick when clients construct a family of related concrete classes directly and should instead depend only on a shared interface plus one factory that hands out instances.
