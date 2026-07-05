# Encapsulate Variable

*Aliases: Encapsulate Field, Self-Encapsulate Field.*

Use when: data with a wide scope -- especially mutable, shared, or global data -- is read and written directly, and you want one place to control that access.

## Motivation

Data is harder to work with than functions, because moving or reshaping it means finding every
reference at once. Wrapping access in functions gives a single chokepoint: a place to add
validation, logging, or a later change of representation, and a first step toward moving the data.
The wider and more mutable the scope, the more this matters.

## Mechanics

1. Create get and set functions that read and write the variable.
2. Run the static checks.
3. Replace each direct reference with a call to the getter or setter, testing after each.
4. Restrict the variable's visibility so callers must go through the accessors.
5. Run the tests.

If the value is a record, follow with [Encapsulate Record](encapsulate-record.md) to control its
fields as well.

## Example

Before -- a mutable value is exported for anyone to read or write:

```ts
export let threshold = 10;
```

After -- access goes through functions, and the variable is module-private:

```ts
let currentThreshold = 10;

export function threshold(): number {
  return currentThreshold;
}

export function setThreshold(value: number): void {
  currentThreshold = value;
}
```

## Watch for

- Encapsulating the reference does not protect the contents of a mutable object it points to. To
  guard those, encapsulate the record too or hand back a copy.
