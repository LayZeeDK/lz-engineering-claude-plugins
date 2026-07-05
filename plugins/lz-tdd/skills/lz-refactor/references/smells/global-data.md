# Global Data

Recognize by: data reachable and writable from anywhere in the program, with no single owner.

## How to recognize

Top-level variables, class statics, or singletons that any code can read and modify. The danger sign
is that you cannot tell, from a bug at the point of use, where the value was last changed. Global data
is the most virulent form of [Mutable Data](mutable-data.md); treat this leaf as the wide-scope case,
and mutable-data as the general case for data with narrower reach.

## Why it's a problem

When any code can change a value from anywhere, a wrong value gives you no clue where the change came
from, and debugging degrades into searching the whole program. Funnelling access through one guarded
point restores the ability to reason about who changes what and when, and creates a seam for later
narrowing the scope. Not all global data is fatal: a small amount of it, or global data that is
provably immutable, is relatively easy to live with -- the danger scales with how much mutable state
is reachable from everywhere.

## Candidate refactorings

- [Encapsulate Variable](../fowler-catalog/encapsulate-variable.md#encapsulate-variable) -- pick as the first move for any global; wrap it in access functions so every read and write goes through one place you can guard, log, or later restrict.
