# Change Function Declaration

*Aliases: Add Parameter, Remove Parameter, Rename Function, Rename Method, Change Signature.*

Use when: a function's name does not reveal its purpose, or its parameter list is wrong for how it is used.

## Motivation

A function's declaration is its interface: the name is how callers understand it without reading the
body, and the parameters decide how it couples to the rest of the program. Improving either -- a
clearer name, a better-fitting parameter -- pays off every time the function is read or called. A
good habit is to name a function as if writing a comment for it, then use that name.

## Mechanics

Use the simple path when the callers are few and easy to reach; use the migration path when there
are many callers, the function is published, it is a polymorphic method, its callers are hard to
reach, or the change is a complex one. Make a rename and a change of parameters as separate steps,
each tested on its own, rather than folding them into a single move.

Simple:

1. If you are removing a parameter, first confirm the body no longer uses it.
2. Change the declaration -- the name, or the parameter list.
3. Find and update every caller.
4. Run the tests.

Migration (safe for wide or published use):

1. If needed, refactor the body first so the new declaration is easy to introduce.
2. Use [Extract Function](extract-function.md) to build a new function with the desired declaration,
   leaving the old one delegating to it.
3. Move callers over to the new function one at a time, testing after each.
4. When no caller remains, remove the old function and, if you kept a temporary name, rename the new
   one into place.
5. Run the tests.

## Example

Before -- an opaque name and single-letter parameters:

```ts
function calc(a: number, b: number): number {
  return a * b;
}
```

After -- the name states the intent and the parameters say what they are:

```ts
function areaOfRectangle(width: number, height: number): number {
  return width * height;
}
```

## Watch for

- A change to a published or consumed interface is not proven safe by green unit tests. Use parallel
  change (expand then contract) and migrate consumers before removing the old form -- see the
  atomic-boundary tripwire in the [refactoring principles](../principles.md).
