# Replace Implicit Language with Interpreter walkthrough

This walkthrough expands the compact example in
[Replace Implicit Language with Interpreter](replace-implicit-language-with-interpreter.md#replace-implicit-language-with-interpreter).
The leaf's before/after shows only a level term and an "and"; the teaching this refactoring is really
about lives in the fuller grammar: more than one kind of term, more than one combinator, and the single
step that applies an assembled expression to the data. This fuller example keeps all of it so the shift
from "a method per question" to "compose the question" is visible.

## Starting point: a method per combination

Each question the code can answer is a hard-coded method. The same three ideas (match a level, match a
service, combine two tests) are re-typed inside every one, and each new question (warnings, warnings from
a service, errors-or-warnings) is another method:

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
  errorsOrWarnings(entries: Entry[]): Entry[] {
    return entries.filter((entry) => entry.level === "error" || entry.level === "warning");
  }
}
```

The set of methods is open-ended, and the building blocks (level test, service test, and/or) are
implicit, copied into each method rather than named anywhere.

## After: name the building blocks as composable expressions

Give each building block its own class implementing a common `Expr` interface. Terms (`Level`, `Service`)
test one field; combinators (`And`, `Or`) hold other expressions and combine their results. Any question
is now assembled from these parts, and a single `filter` step applies whatever you assembled:

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
  test(entry: Entry): boolean {
    return entry.level === this.level;
  }
}

class Service implements Expr {
  constructor(private readonly service: string) {}
  test(entry: Entry): boolean {
    return entry.service === this.service;
  }
}

class And implements Expr {
  constructor(private readonly parts: Expr[]) {}
  test(entry: Entry): boolean {
    return this.parts.every((part) => part.test(entry));
  }
}

class Or implements Expr {
  constructor(private readonly parts: Expr[]) {}
  test(entry: Entry): boolean {
    return this.parts.some((part) => part.test(entry));
  }
}

function filter(entries: Entry[], expr: Expr): Entry[] {
  return entries.filter((entry) => expr.test(entry));
}
```

Now the old methods are just assembled expressions passed to `filter`:

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
  test(entry: Entry): boolean {
    return entry.level === this.level;
  }
}

class Service implements Expr {
  constructor(private readonly service: string) {}
  test(entry: Entry): boolean {
    return entry.service === this.service;
  }
}

class And implements Expr {
  constructor(private readonly parts: Expr[]) {}
  test(entry: Entry): boolean {
    return this.parts.every((part) => part.test(entry));
  }
}

function filter(entries: Entry[], expr: Expr): Entry[] {
  return entries.filter((entry) => expr.test(entry));
}

// "errors from the shipping service" -- assembled, not coded as its own method:
const shippingErrors: Expr = new And([new Level("error"), new Service("shipping")]);

function errorsFromShipping(entries: Entry[]): Entry[] {
  return filter(entries, shippingErrors);
}
```

Each new question is a new combination of the same parts rather than a new method, and the grammar
(terms plus and/or) is now named in one place instead of retyped in every filter.
