# Form Template Method

Use when: two subclasses run the same sequence of steps in the same order but each spells the individual steps out itself, so the shared skeleton is duplicated.

Direction: To
GoF pattern: Template Method
Composed Fowler primitive(s): [Extract Function](../fowler-catalog/extract-function.md#extract-function), [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration), [Pull Up Method](../fowler-catalog/pull-up-method.md#pull-up-method)

## Motivation

When two subclasses carry out the same overall algorithm -- the same steps assembled the same way -- but
each writes the whole thing out, the invariant skeleton is copied in both places and the parts that
actually differ are buried inside it. A reader cannot see which steps are shared and which vary, and a
change to the skeleton has to be made twice. Forming a template method hoists the fixed skeleton into one
method on the superclass and leaves only the differing steps as overridable operations the subclasses
fill in. The shared shape then lives in exactly one place, and each subclass says only how its steps
behave, not how they are assembled. Reach for it once you can see the same skeleton duplicated across
siblings that already run their steps in the same order.

## Mechanics

1. In each subclass, isolate the steps that differ into their own methods with
   [Extract Function](../fowler-catalog/extract-function.md#extract-function), leaving each algorithm as a
   skeleton that calls those step methods.
2. Align the step methods across the subclasses -- same names, same signatures -- with
   [Change Function Declaration](../fowler-catalog/change-function-declaration.md#change-function-declaration);
   compile and run the tests after each rename.
3. The skeleton method is now identical in both subclasses; lift it to the superclass with
   [Pull Up Method](../fowler-catalog/pull-up-method.md#pull-up-method) and declare the differing step
   methods abstract there.
4. Run the tests and confirm each subclass still produces its original output through the pulled-up
   template.

## Example

Before -- both renderers assemble their parts the same way, differing only in the parts:

```ts
class TextReport {
  render(title: string, rows: string[]): string {
    const header = title.toUpperCase();
    const body = rows.join("\n");
    const footer = `${rows.length} rows`;
    return [header, body, footer].join("\n");
  }
}

class CsvReport {
  render(title: string, rows: string[]): string {
    const header = `# ${title}`;
    const body = rows.map((row) => `"${row}"`).join("\n");
    const footer = `# ${rows.length} rows`;
    return [header, body, footer].join("\n");
  }
}
```

After -- the superclass owns the assembly; each subclass supplies only the differing steps:

```ts
abstract class Report {
  render(title: string, rows: string[]): string {
    return [this.header(title), this.body(rows), this.footer(rows)].join("\n");
  }
  protected abstract header(title: string): string;
  protected abstract body(rows: string[]): string;
  protected abstract footer(rows: string[]): string;
}

class TextReport extends Report {
  protected header(title: string): string { return title.toUpperCase(); }
  protected body(rows: string[]): string { return rows.join("\n"); }
  protected footer(rows: string[]): string { return `${rows.length} rows`; }
}
```

## Watch for

- Form the template only once two or more subclasses genuinely share the same assembled skeleton; a single
  implementation, or siblings whose steps differ in how they are assembled rather than in detail, gain
  nothing from an abstract skeleton -- pulling one up early freezes an algorithm shape you do not yet have
  and forces future variants to bend to it.
- A skeleton broken into many abstract steps burdens every subclass with a long list of small methods to
  flesh out; if the varying part is a single step, the extra structure can obscure the algorithm more than
  the duplication did.
