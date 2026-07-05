# Move Statements to Callers

Use when: statements once common to every caller of a function now need to vary between them.

## Motivation

Functions bundle behavior so callers can share it, but as a program grows the behavior that once was
common to all callers starts to diverge -- one caller needs a variation the others do not. When that
happens, the shared statements no longer belong inside the function; move them out to the callers so
each can decide for itself. This is the counter-move to folding statements in: you make it when a
single function is doing slightly the wrong thing for some of the code that calls it.

## Mechanics

1. In the simple case -- a handful of callers and a straightforward function -- copy the statements
   you want to move into each caller, then remove them from the function, testing after each caller.
2. Otherwise, apply [Extract Function](extract-function.md) to all the code you want to keep inside
   the function, giving it a temporary name; run the tests. If the function is overridden in
   subclasses, extract the kept code in every override too, so each subclass's kept-code function is
   identical, then remove the overrides -- this keeps the next step safe.
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
