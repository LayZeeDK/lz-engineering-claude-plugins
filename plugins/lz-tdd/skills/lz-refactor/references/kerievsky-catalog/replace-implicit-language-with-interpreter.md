# Replace Implicit Language with Interpreter

Use when: a class keeps growing methods for each combination of the same few conditions, spelling out by hand a small language it never names.

Direction: Towards
GoF pattern: Interpreter
Composed Fowler primitive(s): [Extract Class](../fowler-catalog/extract-class.md#extract-class), [Extract Superclass](../fowler-catalog/extract-superclass.md#extract-superclass), [Extract Function](../fowler-catalog/extract-function.md#extract-function), [Inline Function](../fowler-catalog/inline-function.md#inline-function)

## Motivation

When a class answers many closely related questions -- errors, errors from a service, warnings, warnings
from a service, and so on -- by adding one hard-coded method per combination, it is really expressing a
small query language one frozen sentence at a time. Every new combination is another method, and the
shared building blocks (a level test, a service test, an "and") are re-typed inside each one. An
interpreter names those building blocks as small expression objects that compose: each term is a class,
combinators like "and" hold other expressions, and any query is built by assembling them. The open-ended
set of methods collapses into a handful of composable parts. Reach for it once the combinations are
clearly multiplying.

## Mechanics

1. Identify the recurring building blocks in the hard-coded methods -- the individual tests and the ways
   they combine -- and give each its own class with
   [Extract Class](../fowler-catalog/extract-class.md#extract-class).
2. Give those classes a common expression type with
   [Extract Superclass](../fowler-catalog/extract-superclass.md#extract-superclass), so every term and
   combinator evaluates itself against an input through the same method.
3. Extract one shared method that applies an assembled expression over the data with
   [Extract Function](../fowler-catalog/extract-function.md#extract-function); compile and run the tests.
4. Rewrite each per-question method to assemble an expression and call that shared apply step, then remove
   the per-question methods with [Inline Function](../fowler-catalog/inline-function.md#inline-function)
   so callers assemble expressions directly.
5. Run the tests and confirm each assembled expression returns what its old method did. See the
   [walkthrough](replace-implicit-language-with-interpreter-walkthrough.md) for the fuller grammar (a
   service term, an "or", and applying an expression to filter).

## Example

Before -- one method per combination of the same tests:

```ts
interface Entry {
  level: string;
  service: string;
}

class LogFilter {
  errors(entries: Entry[]): Entry[] {
    return entries.filter((entry) => entry.level === "error");
  }
  errorsFrom(entries: Entry[], service: string): Entry[] {
    return entries.filter((entry) => entry.level === "error" && entry.service === service);
  }
}
```

After -- composable expression objects; a combination is assembled, not coded:

```ts
interface Entry {
  level: string;
  service: string;
}

interface Expr {
  test(entry: Entry): boolean;
}

class Level implements Expr {
  constructor(private readonly level: string) {}
  test(entry: Entry): boolean { return entry.level === this.level; }
}

class And implements Expr {
  constructor(private readonly parts: Expr[]) {}
  test(entry: Entry): boolean { return this.parts.every((part) => part.test(entry)); }
}
```

## Watch for

- Build the interpreter only when the combinations are genuinely multiplying; for a handful of fixed
  queries the explicit methods are simpler and easier to read than a grammar you compose by hand.
- There is an upper bound too: once the language grows a real grammar -- precedence, nesting, parsing of
  input strings -- a hand-built interpreter becomes as much work as the code it replaced; reach for a
  parser or a generator tool instead of extending the expression hierarchy indefinitely.
