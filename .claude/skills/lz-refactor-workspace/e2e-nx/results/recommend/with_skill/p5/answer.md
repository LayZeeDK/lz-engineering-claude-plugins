## What "Replace Conditional with Polymorphism" is for

It targets a specific smell: a conditional (a `switch`/`if-else` chain) that **chooses behavior by type or kind**, where each branch is really the behavior of one variant. You give each variant its own class, move each branch into an overriding method, and let the language's method dispatch stand in for the switch.

The payoff is about the axis of change:

- **Adding a variant becomes adding a class** instead of editing every switch that mentions the type. This especially pays off when the *same* type-switch is duplicated across several call sites (the Repeated Switches smell) — one new subclass replaces edits in many places.
- Each variant's behavior gets **one home**, so a change to one variant can't silently break another.

The mechanics, roughly (from `replace-conditional-with-polymorphism.md`): make sure a hierarchy exists (often via *Replace Type Code with Subclasses*), route callers through a factory to get the right subclass, extract the conditional into a method, then move one branch at a time into an overriding method — running tests after each move — leaving the superclass method as the default or making it abstract once every case is handled.

The canonical example is a `shape.kind` switch computing area, turned into `Square` and `Circle` classes each implementing `area()`.

## The key caveat — it's easy to over-apply

The refactoring's own motivation warns: **reserve it for genuine type-based variation.** A plain conditional that's easy to read does not need a hierarchy. Fowler's overarching economics matter here — refactoring is meant to make you go *faster*, not to be aesthetically "pattern-rich." The catalog explicitly points you at a lighter alternative: if a conditional just needs clearer names, use **Decompose Conditional**, not a class hierarchy.

## How to know you've overdone it (and should go back)

The skill frames this as the over/under-engineering balance: a pattern that earns its keep is kept; **an unwarranted one is refactored *away*.** Signs you've overshot:

1. **The subclasses are anemic.** Each override is one line and there's no other per-variant state or behavior — the hierarchy adds ceremony without carrying weight. That's the *Refused Bequest* / *Lazy Element* territory.
2. **You only ever have one branch's worth of real logic**, or the "variants" don't actually vary independently — you invented a hierarchy for a switch that appeared exactly once and reads fine.
3. **The type set is stable but the behavior changes**, so you're constantly editing all the subclasses in lockstep — the flexibility you paid for (cheap new variants) is flexibility you never use (Speculative Generality).
4. **Reading the code now means hopping across many small files** to reassemble what one local `switch` used to show at a glance. Dispatch has hidden the control flow rather than clarified it.
5. **The variant is chosen at runtime / on a changing axis**, where inheritance is too rigid — a sign the polymorphism should at least be delegation, or shouldn't be a hierarchy at all.

## The way back

There's no single named inverse, but the reversal path is well-stocked in the Fowler catalog (Ch.12, dealing with inheritance):

- **Remove Subclass** (a.k.a. *Replace Subclass with Fields*) — when subclasses have thinned out to almost nothing, fold them back into a single class with a type field.
- **Collapse Hierarchy** — when a superclass and subclass have grown too alike to justify the split.
- And ultimately **Inline** the dispatch back into a plain conditional — often paired with *Decompose Conditional* so the collapsed conditional still reads clearly.

The governing principle: knowing when to **stop** matters as much as when to start. If the next step (adding the hierarchy, or keeping it) has stopped paying for itself in easier change, that's your signal — clarity for today's actual needs is the default, per YAGNI/evolutionary design, not maximal polymorphic flexibility for variants you're speculating about.

One practical guardrail before you reverse: this is all behavior-preserving structural work, so do it on a green test suite in the smallest steps, committing on each green — that's what lets you push the hierarchy in *and* pull it back out safely as you learn whether the variation is real.