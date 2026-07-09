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

1. Should the repeated statements sit anywhere other than right beside the call, bring them together
   first with [Slide Statements](slide-statements.md).
2. A single call site makes this easy: lift the statements out of the caller, drop them inside the
   target, and let the tests confirm it. Nothing further is needed.
3. With more callers, pick one call site and apply [Extract Function](extract-function.md) to the
   statements together with the call, giving the new function a temporary name; run the tests.
4. Work through the remaining call sites, switching each one over to the new function and testing as
   you go.
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
