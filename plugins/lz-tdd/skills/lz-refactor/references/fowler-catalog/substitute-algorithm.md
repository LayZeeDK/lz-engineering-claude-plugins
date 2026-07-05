# Substitute Algorithm

Use when: you have found a clearer way to do what a block of code already does, and want to swap the whole approach rather than tweak the old one.

## Motivation

Some code is easier to replace than to improve in place. When you see a simpler algorithm that
produces the same results, substituting it wholesale leaves you with something easier to understand
and to change further. Common triggers: you find a library or built-in that already does what your
code hand-rolls, or you are about to make a change that a clearer algorithm would make easy. The
move depends on first isolating the algorithm and having tests that pin its current behavior, so you
can prove the replacement matches.

## Mechanics

1. Arrange the code so the algorithm to replace is a single self-contained function -- use
   [Extract Function](extract-function.md) if it is not already.
2. Make sure that function is covered by tests that fix its current behavior.
3. Prepare the replacement algorithm.
4. Run the static checks.
5. Run the tests, comparing the new algorithm's results against the old across them; when they match,
   the substitution is complete.

## Example

Before -- nested loops search for the first allowed name:

```ts
function firstMatch(names: readonly string[], allowed: readonly string[]): string {
  for (const name of names) {
    for (const candidate of allowed) {
      if (name === candidate) {
        return name;
      }
    }
  }

  return "";
}
```

After -- a clearer library-driven expression, same result:

```ts
function firstMatch(names: readonly string[], allowed: readonly string[]): string {
  return names.find((name) => allowed.includes(name)) ?? "";
}
```

## Watch for

- If the two algorithms disagree on an edge case, either behavior was not preserved or the tests are
  incomplete -- reconcile before deleting the old one.
