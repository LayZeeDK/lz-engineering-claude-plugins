# Consolidate Conditional Expression

Use when: several separate conditional checks all lead to the same result or action.

## Motivation

When a run of checks each ends in the same outcome, they are really one check wearing several
disguises, and their separateness hides that. Combining them into a single logical expression -- and
usually extracting it into a named function -- makes the shared intent explicit: there is one reason
for one result. It also often sets up an [Extract Function](extract-function.md) that names the
combined condition after what it means rather than what it tests.

## Mechanics

1. Confirm none of the conditions has a side effect; if one does, apply
   [Separate Query from Modifier](separate-query-from-modifier.md) first.
2. Combine two of the conditions that share a result into one expression -- `or` for a sequence of
   independent checks, `and` for nested ones.
3. Run the tests, then fold in the next condition the same way, testing after each.
4. Consider [Extract Function](extract-function.md) on the combined condition, naming it for what it
   means.

## Example

Before -- three separate guards return the same value:

```ts
function shippingDiscount(weight: number, express: boolean, remote: boolean): number {
  if (weight > 20) {
    return 0;
  }
  if (express) {
    return 0;
  }
  if (remote) {
    return 0;
  }
  return 5;
}
```

After -- the checks are one named condition:

```ts
function shippingDiscount(weight: number, express: boolean, remote: boolean): number {
  if (notEligibleForDiscount(weight, express, remote)) {
    return 0;
  }
  return 5;
}

function notEligibleForDiscount(weight: number, express: boolean, remote: boolean): boolean {
  return weight > 20 || express || remote;
}
```

## Watch for

- Consolidate only checks that are really one reason for the result. If the conditions are
  conceptually independent, combining them hides that they are separate decisions and makes later
  change harder -- leave them apart.
