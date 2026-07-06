# Replace One/Many Distinctions with Composite

Use when: code keeps branching on whether it is handling a single object or a collection of them, and you need to combine those objects in richer ways than a flat list allows.

Direction: To
GoF pattern: Composite
Composed Fowler primitive(s): [Extract Class](../fowler-catalog/extract-class.md#extract-class), [Move Function](../fowler-catalog/move-function.md#move-function), [Inline Function](../fowler-catalog/inline-function.md#inline-function), [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration)

## Motivation

When a design treats "one" and "many" as different shapes -- a method that takes either a single item or a
list, then branches to handle each case -- the one-versus-many test spreads to every place that consumes
the value, and callers must know which form they hold. A composite dissolves the distinction: a group of
objects becomes an object of the same type as a single one, so both answer the same interface and the
branching disappears. The real payoff is not just uniform calls and less branching but the freedom to
combine objects in richer ways -- mixing single items and groups, and eventually AND/OR or tree-shaped
queries -- which a flat one-or-many split cannot express. Reach for it once the single-versus-collection
branch recurs and you can foresee combining the objects, not merely listing them.

## Mechanics

1. Confirm the single objects already share an interface; if not, give them one with
   [Extract Class](../fowler-catalog/extract-class.md#extract-class) so there is a common type to conform
   to.
2. Add a composite class that implements that same interface and holds the children, moving the
   many-object handling onto it with [Move Function](../fowler-catalog/move-function.md#move-function).
3. Make the many-object path safe by having it delegate to the single-object interface method, then remove
   the now-redundant many-object method with
   [Inline Function](../fowler-catalog/inline-function.md#inline-function); compile and run the tests.
4. Retire the one-versus-many branches: change the consumers to accept the interface with
   [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration),
   passing a composite where a list used to go.
5. Run the tests and confirm a single object and a composite of many produce the same results as before.

## Example

Before -- the caller branches on one query versus many:

```ts
interface Query {
  matches(text: string): boolean;
}

class TermQuery implements Query {
  constructor(private readonly term: string) {}
  matches(text: string): boolean { return text.includes(this.term); }
}

function matchesAll(text: string, query: Query | Query[]): boolean {
  if (Array.isArray(query)) {
    return query.every((part) => part.matches(text));
  }
  return query.matches(text);
}
```

After -- a composite is itself a Query, so one and many are the same type:

```ts
interface Query {
  matches(text: string): boolean;
}

class TermQuery implements Query {
  constructor(private readonly term: string) {}
  matches(text: string): boolean { return text.includes(this.term); }
}

class AllQuery implements Query {
  constructor(private readonly parts: Query[]) {}
  matches(text: string): boolean { return this.parts.every((part) => part.matches(text)); }
}
```

## Watch for

- Introduce the composite only when the one-versus-many branch genuinely recurs and you foresee combining
  the objects; if a single item is handled in just one place, wrapping it in a composite adds a class and
  a level of indirection for no gain.
- A composite lets any conforming object be added as a child, so it needs a runtime guard to reject
  children that are invalid for its context -- the compiler alone will not stop a malformed tree from
  being built.
