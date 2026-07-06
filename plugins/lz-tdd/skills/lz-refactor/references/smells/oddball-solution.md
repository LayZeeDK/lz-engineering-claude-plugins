# Oddball Solution

Recognize by: one problem solved one consistent way almost everywhere, but handled differently in a few odd spots.

Source: Kerievsky

## How to recognize

The codebase has a usual way of doing something -- reading a resource, formatting a value, talking to a service -- and then one or two places that do the same job their own way. The odd solution is not a copy of the standard one; it is a second, divergent approach to the same problem. That distinguishes it from
[Duplicated Code](duplicated-code.md), where the fragments are the same: here the solutions differ in form while solving the same thing, so the duplication is hidden behind the difference in shape.

## Why it's a problem

Inconsistent approaches to one problem force a reader to learn several solutions instead of one, make it unclear which is canonical, and block the consolidation that would remove the underlying duplication. Converging the oddball onto the standard approach first makes the duplication visible so it can then be merged to a single implementation.

## Candidate refactorings

- [Substitute Algorithm](../fowler-catalog/substitute-algorithm.md#substitute-algorithm) -- pick after deciding which approach is preferred (usually the common one, but sometimes the oddball is the better design worth keeping); replace the others with it, after which the now-identical code can be consolidated.
- [Unify Interfaces with Adapter](../kerievsky-catalog/unify-interfaces-with-adapter.md#unify-interfaces-with-adapter) -- pick when mismatched interfaces are what force the divergent solution, and wrapping the odd one to share a common interface lets a single approach serve both.
