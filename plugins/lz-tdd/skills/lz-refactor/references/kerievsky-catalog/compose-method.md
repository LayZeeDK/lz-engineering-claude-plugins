# Compose Method

Use when: a method mixes high-level flow with low-level detail, so you must read every line to follow what it does.

Direction: To
GoF pattern: [Composed Method](../extra-patterns-catalog/composed-method.md#composed-method) (Beck's pattern; not one of the GoF 23)
Composed Fowler primitive(s): [Extract Function](../fowler-catalog/extract-function.md#extract-function), [Inline Function](../fowler-catalog/inline-function.md#inline-function), [Replace Temp with Query](../fowler-catalog/replace-temp-with-query.md#replace-temp-with-query), [Rename Variable](../fowler-catalog/rename-variable.md#rename-variable)

## Motivation

A method that jumps between levels of abstraction -- orchestrating the overall steps while also spelling
out how one of them works -- forces the reader to hold both concerns at once. Composing the method turns
it into a short sequence of calls to well-named helpers, each operating at a single level, so the top
method reads as a summary of intent and the detail lives one call away. Reach for it when a method is
long enough that its purpose is buried, or when parts of it sit at obviously different levels of detail.

## Mechanics

Compose Method is guideline-driven rather than a fixed sequence -- apply these moves by judgment until
the method reads at one level of abstraction:

1. Read the method and mark the runs of statements that each accomplish one conceptual step.
2. Extract each run into a small helper with
   [Extract Function](../fowler-catalog/extract-function.md#extract-function), naming it for what it
   achieves rather than how, and keeping each helper short.
3. Replace explanatory locals and comments with a query or a well-named helper so the top method stops
   describing detail; use [Replace Temp with Query](../fowler-catalog/replace-temp-with-query.md#replace-temp-with-query)
   and [Rename Variable](../fowler-catalog/rename-variable.md#rename-variable) as needed.
4. Remove any duplication and dead code the decomposition exposes, and fold away any helper that no
   longer earns its name with [Inline Function](../fowler-catalog/inline-function.md#inline-function).
5. Run the tests after each extraction so a slip surfaces immediately.
6. Stop once every line of the top method sits at the same level of abstraction.

## Example

Before -- one method both formats the reading and classifies it:

```ts
class Thermostat {
  constructor(private readonly celsius: number) {}

  summary(): string {
    let label: string;
    if (this.celsius <= 0) {
      label = "freezing";
    } else if (this.celsius < 18) {
      label = "cool";
    } else {
      label = "warm";
    }
    const rounded = Math.round(this.celsius * 10) / 10;
    return rounded + "C (" + label + ")";
  }
}
```

After -- the top method reads as intent; detail moves into named helpers:

```ts
class Thermostat {
  constructor(private readonly celsius: number) {}

  summary(): string {
    return this.reading() + " (" + this.comfortLabel() + ")";
  }

  private reading(): string {
    return Math.round(this.celsius * 10) / 10 + "C";
  }

  private comfortLabel(): string {
    if (this.celsius <= 0) {
      return "freezing";
    }
    if (this.celsius < 18) {
      return "cool";
    }
    return "warm";
  }
}
```

## Watch for

- Do not extract so aggressively that a one-line helper only hides a self-evident expression -- a step
  earns a name only when the name says more than the code it replaces.
