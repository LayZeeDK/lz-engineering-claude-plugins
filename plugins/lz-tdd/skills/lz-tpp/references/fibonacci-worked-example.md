# Fibonacci Worked Example -- TPP Applied Test-by-Test

This is the canonical Transformation Priority Premise (TPP) worked example, taken from
Robert C. Martin's "Fib. The T-P Premise." post (the FibTPP post) and translated from its
Java into TypeScript. It walks the Fibonacci function one failing test at a time, and at
each step it names the single transformation applied and that transformation's position on
the canonical 14-item list. The walk is monotonic: at every step it takes the
highest-priority (lowest-numbered) transformation that passes the then-current test, which
is exactly the discipline the premise asks for.

Priority-number convention used throughout: a LOWER number means a HIGHER priority (a
simpler, less risky change). "#9" means list position 9. This file is reached one level
deep from `SKILL.md` and is self-contained: it links to no other reference file. The full
14-item list, its provenance, and the ordering rationale live in the transformations
reference; the "no reliable TCO in JS/TS" reason and the complete stack-safe pattern catalog
live in the TypeScript/TCO reference.

## Contents

- [The test suite](#the-test-suite)
- [How to read each step](#how-to-read-each-step)
- [Step 1 -- from nothing to a constant](#step-1----from-nothing-to-a-constant)
- [Step 2 -- split the base case](#step-2----split-the-base-case)
- [Step 3 -- the tempting naive recursion](#step-3----the-tempting-naive-recursion)
- [Step 4 -- prefer tail recursion](#step-4----prefer-tail-recursion)
- [Step 5 -- unwind to a loop for stack safety](#step-5----unwind-to-a-loop-for-stack-safety)
- [Why (case) sits at the bottom](#why-case-sits-at-the-bottom)
- [Word Wrap -- the impasse illustration](#word-wrap----the-impasse-illustration)

## The test suite

The behavior is language-agnostic; only the syntax changes from the FibTPP Java. We drive
`of(n)` (the nth Fibonacci number, zero-indexed) with these tests, added one at a time in
this order:

```ts
expect(of(0)).toBe(0);
expect(of(1)).toBe(1);
expect(of(2)).toBe(1);
expect(of(3)).toBe(2);
expect(of(4)).toBe(3);
expect(of(5)).toBe(5);
expect(of(6)).toBe(8);
```

## How to read each step

Each step below:

1. states the newly RED test that forces a change,
2. shows the minimal TypeScript change in a `ts` block, and
3. TAGS the applied transformation by name AND canonical list position.

Where the choice between two transformations matters, the step explains why the
higher-priority one wins. The refactor steps are called out as refactorings (structure-only,
behavior-preserving) rather than transformations, because they are not ranked by the
priority list.

## Step 1 -- from nothing to a constant

Red test: `of(0)` should be `0`. There is no code at all yet.

Two transformations apply in sequence. First `({} -> nil)` #1 takes us from no code to a
body that employs a nothing-ish value; then `(nil -> constant)` #2 makes that value the
concrete constant `0`:

```ts
export function of(n: number): number {
  return 0;
}
```

Transformations applied: `({} -> nil)` #1, then `(nil -> constant)` #2. This is the
simplest thing that passes the first test.

## Step 2 -- split the base case

Red test: `of(1)` should be `1`. The constant `0` returns `0` for every input, so this is
red.

The minimal move is to split the execution path with `(unconditional -> if)` #6, and in the
base branch replace the constant with the argument via `(constant -> scalar)` #4 -- return
`n` instead of a literal. The other branch keeps the constant `1`:

```ts
export function of(n: number): number {
  if (n <= 1) {
    return n;
  }

  return 1;
}
```

Transformations applied: `(unconditional -> if)` #6 plus `(constant -> scalar)` #4. This
coincidentally makes the third test, `of(2)` should be `1`, pass as well -- the `n > 1`
branch already returns `1`.

## Step 3 -- the tempting naive recursion

Red test: `of(3)` should be `2`. The current code returns `1` for every `n > 1`, so this is
red.

The "obvious" move is plain `(statement -> recursion)` #11, because `fib(n) = fib(n - 1) +
fib(n - 2)`:

```ts
export function of(n: number): number {
  if (n <= 1) {
    return n;
  }

  return of(n - 1) + of(n - 2);
}
```

This passes every test and reads beautifully -- but the premise steers us away from it.
Plain recursion sits at `(statement -> recursion)` #11, which is BELOW both `(if -> while)`
#10 and `(statement -> tail-recursion)` #9 on the revised list, so it is not the
highest-priority option available. It is also exponential in runtime, it is not
tail-recursive, and JS/TS engines do not reliably optimize tail calls, so deep inputs would
overflow the stack. Preferring a higher-priority transformation here is what avoids that
trap.

## Step 4 -- prefer tail recursion

The revised FibTPP list inserts `(statement -> tail-recursion)` #9 ABOVE `(if -> while)` #10
precisely so that, when recursion is warranted, the tail-recursive form is preferred over
arbitrary recursion. Reach for #9 with an accumulator helper that carries the running pair
of Fibonacci values in tail position:

```ts
export function of(n: number): number {
  if (n <= 1) {
    return n;
  }

  return ofAcc(0, 1, n);
}

function ofAcc(a: number, b: number, n: number): number {
  if (n === 0) {
    return a;
  }

  return ofAcc(b, a + b, n - 1);
}
```

Transformation applied: `(statement -> tail-recursion)` #9. The recursive call is now the
last thing the helper does, so no work is pending after it returns.

The outer `if (n <= 1)` guard is now redundant -- `ofAcc(0, 1, 0)` already returns `0` and
`ofAcc(0, 1, 1)` already returns `1`. Dropping it is a structure-only REFACTORING (behavior
is unchanged and every test stays green), not a transformation, so it is not ranked by the
priority list:

```ts
export function of(n: number): number {
  return ofAcc(0, 1, n);
}

function ofAcc(a: number, b: number, n: number): number {
  if (n === 0) {
    return a;
  }

  return ofAcc(b, a + b, n - 1);
}
```

## Step 5 -- unwind to a loop for stack safety

On the canonical list the walk could stop at tail recursion. But because JS/TS lacks
reliable tail-call optimization, the tail-recursive helper still grows the call stack and
overflows on large `n`. Following FibTPP's own language-specificity note, unwind the
recursion into iteration: convert the recursive `if` into a loop with `(if -> while)` #10,
and reassign the carried values with `(variable -> assignment)` #13:

```ts
export function of(n: number): number {
  return ofAcc(0, 1, n);
}

function ofAcc(a: number, b: number, n: number): number {
  while (n !== 0) {
    const s = a + b;
    a = b;
    b = s;
    n = n - 1;
  }

  return a;
}
```

Transformations applied: `(if -> while)` #10 plus `(variable -> assignment)` #13. The result
runs in constant stack space and is safe for arbitrarily deep inputs. This is the TS/JS
language overlay in action -- prefer `(if -> while)` and `(variable -> assignment)` above the
recursion transformations when the language has no reliable TCO. The reason JS/TS lacks
reliable TCO, and the full catalog of stack-safe patterns (trampoline, generator, and
others), are documented in the TypeScript/TCO reference; they are not repeated here.

## Why (case) sits at the bottom

FibTPP's key lesson is that this priority ordering is exactly what PREVENTS a degenerate
solution. Without a rule against it, the "cheapest" way to pass each new Fibonacci test is
to bolt on another branch -- `switch (n) { case 0: return 0; case 1: return 1; ... }` -- a
lookup table that never generalizes. That is why `(case)` was added at position 14 as the
very last resort: adding a `case` (or an `else if`) to an existing `switch` or `if` is
always the last option to choose. Because `(case)` #14 is the lowest priority, the premise
forces you toward the general algorithm (recursion, then the stack-safe loop) instead of the
degenerate switch.

## Word Wrap -- the impasse illustration

Fibonacci flows cleanly from one high-priority transformation to the next. The Word Wrap
kata (from the original TPP post) illustrates the opposite case -- the impasse -- and is
referenced here only as that illustration, not re-walked. In Word Wrap you can reach a point
where the only way to pass the current failing test is a low-priority transformation such as
`(expression -> function)`, i.e. writing a whole algorithm at once. The premise's most
valuable move at that point is NOT to power through with the low-priority change; it is to
BACKTRACK and pose a different, simpler test (optionally skipping the hard one for now) that
advances the same behavior but is passable by a higher-priority transformation. Changing the
next test, not just the next line of code, is how you escape the local maximum.
