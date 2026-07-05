# Feature Envy

Recognize by: a function that talks to another module's data far more than to its own.

## How to recognize

A method that calls several getters or methods on some other object -- computing with that object's
fields, following its structure -- while barely touching the class it lives in. Its logic clearly
"envies" the other module and would be at home there. Tell it apart from [Insider Trading](insider-trading.md):
feature envy is a single function reaching into one other module's data; insider trading is two modules
trading private detail back and forth.

## Why it's a problem

Behavior placed away from the data it uses spreads knowledge of that data across modules and couples
them tightly, so a change to the data's shape ripples outward. Putting a function next to the data it
works on keeps related things together and shrinks the coupling. Some feature envy is intentional --
certain design patterns deliberately place behavior apart from the data it uses -- so weigh the intent
before moving. When a function draws on several modules, site it with the one whose data it uses most.

## Candidate refactorings

- [Move Function](../fowler-catalog/move-function.md#move-function) -- pick when the whole function belongs with the data it envies; move it to that module.
- [Extract Function](../fowler-catalog/extract-function.md#extract-function) -- pick when only part of the function envies another module; extract that part first, then move it.
