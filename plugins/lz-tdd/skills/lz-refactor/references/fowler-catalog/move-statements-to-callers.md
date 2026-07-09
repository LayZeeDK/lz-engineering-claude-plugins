# Move Statements to Callers

Use when: statements once common to every caller of a function now need to vary between them.

## Motivation

Functions bundle behavior so callers can share it, but as a program grows the behavior that once was
common to all callers starts to diverge -- one caller needs a variation the others do not. When that
happens, the shared statements no longer belong inside the function; move them out to the callers so
each can decide for itself. This is the counter-move to folding statements in: you make it when a
single function is doing slightly the wrong thing for some of the code that calls it.

## Mechanics

1. Where only a few callers exist and the function is unremarkable, paste the departing statements
   into each caller, strip them from the function, and test caller by caller.
2. Failing that, wrap whatever stays behind in a function of its own via
   [Extract Function](extract-function.md) under a throwaway name, and run the tests. Where
   subclasses override the function, each override needs the same extraction so that all the
   retained-code functions come out identical; delete the overrides afterwards, which is what makes
   the following step safe.
3. Apply [Inline Function](inline-function.md) to the original function so every caller now holds its
   body directly; run the tests.
4. Apply [Change Function Declaration](change-function-declaration.md) to rename the extracted
   function back to the original name.

Inverse of [Move Statements into Function](move-statements-into-function.md).

## Example

Before -- `summarize` always prepends the header, but not every caller should:

```ts
function summarize(rows: readonly string[]): string {
  const header = `${rows.length} item(s)`;
  const body = rows.join(", ");
  return `${header}\n${body}`;
}

function report(rows: readonly string[]): string {
  return summarize(rows);
}
```

After -- the header statement moves out to the caller, freeing `summarize` to serve varied callers:

```ts
function summarize(rows: readonly string[]): string {
  return rows.join(", ");
}

function report(rows: readonly string[]): string {
  const header = `${rows.length} item(s)`;
  return `${header}\n${summarize(rows)}`;
}
```
