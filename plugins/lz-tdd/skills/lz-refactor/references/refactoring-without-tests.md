# Refactoring Safely Without Tests (Feathers)

Scope: the core techniques for refactoring code that has no tests, from Feathers (Working
Effectively with Legacy Code). The coach falls back here when a smell must be addressed but the
target code lacks the test coverage that makes ordinary refactoring safe.

> Populated in Phase 9. Feathers is unowned -> high-confidence CORE techniques only, tagged
> no-oracle. No verbatim Feathers prose or code (DST-04).

## Per-entry content contract

Each technique, when populated, carries:

- Technique -- the technique name in original words.
- When-to-use -- the situation that calls for it.
- Distilled mechanics -- the step sequence in original words (no verbatim book prose).

Core techniques in scope (high-confidence only):

- Seams -- the places where behavior can be altered without editing in place.
- Characterization tests -- pinning current behavior before changing it.
- The change algorithm -- identify change points, find test points, break dependencies, write
  tests, make the change.
- Sprout Method / Sprout Class.
- Wrap Method / Wrap Class.
- Subclass and Override Method.
- Extract Interface.

## Sources (placeholder)

- Feathers, Working Effectively with Legacy Code -- unowned; high-confidence core only, no-oracle
  tag; Phase 9.
