# Inline Function

*Aliases: Inline Method.*

Use when: a function's body is as clear as its name, or a set of poorly-factored functions is easier to reorganize once merged back inline.

## Motivation

Sometimes indirection earns nothing: the body says exactly what the name says, so the call adds a
hop without adding meaning. Remove it. Inlining also helps when a group of functions is badly
divided -- inline them into one place, then re-extract along better seams.

## Mechanics

1. Confirm the function is not polymorphic -- do not inline a method that subclasses override, since
   callers may bind to a different body.
2. Find every caller.
3. At every call site, substitute what the body actually does for the call itself.
4. Run the tests after each replacement, so a bad substitution is caught while it is still isolated.
5. Once every call is replaced, remove the function definition.

For a function with many callers, inline one call at a time rather than all at once.

Inverse of [Extract Function](extract-function.md).

## Example

Before -- the helper restates its own name:

```ts
function isEligible(score: number): boolean {
  return hasEnoughPoints(score);
}

function hasEnoughPoints(score: number): boolean {
  return score >= 100;
}
```

After -- the body replaces the call, and the helper is gone:

```ts
function isEligible(score: number): boolean {
  return score >= 100;
}
```

## Watch for

- Do not inline across a polymorphic boundary.
- Mechanical awkwardness is itself a reason not to inline -- recursion, several return points, or a
  body that leans on accessors the caller cannot reach all argue against it, not just polymorphism.
- If inlining makes the caller long or unclear, the indirection was pulling its weight -- keep it.
