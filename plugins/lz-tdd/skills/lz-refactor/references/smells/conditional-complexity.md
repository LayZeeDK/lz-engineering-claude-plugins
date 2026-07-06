# Conditional Complexity

Recognize by: branching logic that has grown tangled over time -- conditionals that select behavior, layer on optional extras, and drive state changes, all accreting in one place.

Source: Kerievsky

## How to recognize

One unit accumulates conditionals for several distinct jobs at once: choosing which algorithm to run, switching optional or special-case behavior on and off, and deciding which state to move to next. Each new feature adds another branch, so the logic sprawls and the intent behind any one condition gets harder to see. This is broader than
[Repeated Switches](repeated-switches.md), which is specifically the *same* switch duplicated across sites: here the complexity is the accretion of many kinds of branching within a unit, not one branch copied around. It is also distinct from a single conditional you would simply tidy in place.

## Why it's a problem

Tangled conditionals are hard to read, extend, and test: the number of paths multiplies, a change to one branch can silently affect another, and the design resists new variants because every addition means threading another case through the existing logic. Pushing each kind of variation onto its own object turns a branch into a class, so behavior has one home and new cases stop deepening the tangle.

## Candidate refactorings

- [Replace Conditional Logic with Strategy](../kerievsky-catalog/replace-conditional-logic-with-strategy.md#replace-conditional-logic-with-strategy) -- pick when the conditional chooses among whole interchangeable algorithms you want to vary independently.
- [Move Embellishment to Decorator](../kerievsky-catalog/move-embellishment-to-decorator.md#move-embellishment-to-decorator) -- pick when the conditionals switch optional or special-case behavior on top of a core responsibility.
- [Replace State-Altering Conditionals with State](../kerievsky-catalog/replace-state-altering-conditionals-with-state.md#replace-state-altering-conditionals-with-state) -- pick when the conditionals both decide what may happen now and choose which state comes next.
- [Introduce Null Object](../kerievsky-catalog/introduce-null-object.md#introduce-null-object) -- pick when the complexity is the same absence check repeated everywhere, each supplying the same do-nothing default.
