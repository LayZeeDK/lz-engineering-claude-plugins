# Extract Function

*Aliases: Extract Method.*

Use when: a fragment of code can be understood on its own and given a name that says what it does, not how.

## Motivation

Pull a fragment into its own named function so a reader sees the intention without decoding the
implementation. The deciding factor is the semantic distance between what the code does and how it
does it: whenever naming a block makes its purpose clearer, extract it, even if the block is short.
Small, well-named functions also make later change and reuse cheaper, and they turn comments that
explain a block into a name.

## Mechanics

1. Create a new function and name it after its intention (what it does), not its mechanics.
2. Copy the fragment into the new function.
3. Check the fragment for variables that are local to the source function; decide how each crosses
   the boundary: a variable only read becomes a parameter; a variable assigned and used afterward is
   returned. If several variables are assigned and needed later, the extraction is harder -- first
   apply [Split Variable](split-variable.md) or [Replace Temp with Query](replace-temp-with-query.md),
   then extract.
4. Once all parameters are declared, compile the new function in isolation before wiring it in -- a
   checkpoint that surfaces a missed variable early.
5. Replace the original fragment with a call to the new function.
6. Run the tests.
7. Look for other code that duplicates the extracted fragment and route it through the new function
   with [Replace Inline Code with Function Call](replace-inline-code-with-function-call.md).

Inverse of [Inline Function](inline-function.md).

## Example

Before -- one function mixes a fixed heading with a calculation:

```ts
function report(items: readonly number[]): string {
  const heading = "=== Report ===";
  let total = 0;
  for (const n of items) {
    total += n;
  }
  return `${heading}\nTotal: ${total}`;
}
```

After -- the calculation becomes a function taking a read-only parameter and returning its result,
and the fixed heading becomes its own function:

```ts
function report(items: readonly number[]): string {
  return `${heading()}\nTotal: ${sum(items)}`;
}

function heading(): string {
  return "=== Report ===";
}

function sum(items: readonly number[]): number {
  let total = 0;
  for (const n of items) {
    total += n;
  }
  return total;
}
```

## Watch for

- Extract by intention, not by length; a two-line fragment is worth extracting if its name adds
  meaning.
- If the fragment assigns more than one local still needed by the caller, resolve that first rather
  than returning a bundle.
