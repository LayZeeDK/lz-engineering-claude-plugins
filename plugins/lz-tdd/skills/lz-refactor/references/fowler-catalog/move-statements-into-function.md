# Move Statements into Function

Use when: the same statements always run alongside a call to a function, so they belong inside it.

## Motivation

Removing duplication is one of the most reliable ways to keep code healthy. When you see the same few
statements run every time just before (or after) a particular function is called, those statements
are really part of what that function does. Folding them into the function means callers no longer
repeat the setup, and the function captures the whole task in one place. Do this only when the
statements truly are part of the called function's job; if they merely happen to sit nearby, leave
them out.

## Mechanics

1. If the repeated statements are not adjacent to the call of the target function, apply
   [Slide Statements](slide-statements.md) until they are.
2. If the target function is called only from this one place, cut the statements from the caller,
   paste them into the target, and run the tests. You are done.
3. With more callers, pick one call site and apply [Extract Function](extract-function.md) to the
   statements together with the call, giving the new function a temporary name; run the tests.
4. Convert every other call site to the new function, testing after each.
5. When all callers use the new function, apply [Inline Function](inline-function.md) to fold the
   original target into it.
6. Apply [Change Function Declaration](change-function-declaration.md) to rename the new function to
   the original name; run the tests.

Inverse of [Move Statements to Callers](move-statements-to-callers.md).

## Example

Before -- the sole caller computes the header, then calls `summarize`:

```ts
function summarize(rows: readonly string[]): string {
  return rows.join(", ");
}

function report(rows: readonly string[]): string {
  const header = `${rows.length} item(s)`;
  const body = summarize(rows);
  return `${header}\n${body}`;
}
```

After -- the header statement moves into `summarize`, so it owns the whole summary:

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
