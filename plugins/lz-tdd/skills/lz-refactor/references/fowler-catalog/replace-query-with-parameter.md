# Replace Query with Parameter

Use when: a function reaches out to global state or a wide reference that would be better passed in.

## Motivation

A function that queries global state or a far-reaching reference carries a hidden dependency: it is
harder to test, harder to reason about, and tied to that context. Passing the value in as a parameter
makes the dependency explicit and the function easier to reuse and test, at the cost of a longer
parameter list and pushing the responsibility to callers. It is the trade you make to lift a
dependency out of a function -- the inverse of letting the function query for it.

## Mechanics

1. Isolate the queried value in a variable with [Extract Variable](extract-variable.md).
2. Extract the rest of the function's body into a new function that takes that value as a parameter
   with [Extract Function](extract-function.md); run the tests.
3. Inline the variable so the original function just performs the query and passes it to the new one;
   run the tests.
4. Inline the original function into its callers so each does the query and calls the new function;
   test after each.
5. Rename the new function to the original name with
   [Change Function Declaration](change-function-declaration.md).

Inverse of [Replace Parameter with Query](replace-parameter-with-query.md).

## Example

Before -- the function reads shared config directly:

```ts
const config = { taxRate: 0.2 };

function grossPrice(net: number): number {
  return net + net * config.taxRate;
}
```

After -- the rate is a parameter, the dependency explicit:

```ts
function grossPrice(net: number, taxRate: number): number {
  return net + net * taxRate;
}
```

## Watch for

- Adding a required parameter changes a published interface; green unit tests do not prove that safe
  for external callers. Migrate with a parallel change -- see the atomic-boundary tripwire in the
  [refactoring principles](../principles.md).
