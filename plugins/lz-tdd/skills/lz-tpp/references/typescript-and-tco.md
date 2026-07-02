# TypeScript paired katas and the no-reliable-TCO reality

This reference backs two parts of the lz-tpp skill:

- TPP-05: paired functional and imperative TypeScript examples that show how the
  transformation-priority choice shifts by paradigm.
- TPP-07: the TypeScript/JavaScript tail-call-optimization (TCO) reality, the stack-safe
  recursion patterns (with a teach-vs-mention split), the transformation-vs-refactoring
  distinction, and a recurse-vs-iterate decision guide.

All fenced TypeScript below is `tsc --strict`-clean and was executed at depth 1,000,000 on
Node v24.18.0 (V8 13.6). Naive recursion overflows at roughly 10,000 frames; each stack-safe
pattern survives depth 1,000,000. Arrows are ASCII `->` throughout.

Canonical list positions referenced below, by number and name, are: 9 `(statement ->
tail-recursion)`, 10 `(if -> while)`, 11 `(statement -> recursion)`, and 13 `(variable ->
assignment)`.

One-sentence overlay: the TS/JS overlay -- prefer `(if -> while)` #10 and `(variable ->
assignment)` #13 above the recursion transformations #9 and #11 -- is a source-sanctioned
heuristic (see "The TS/JS overlay" below), not a contradiction of the canonical list and not
dogma.

## Contents

- Paired katas (TPP-05)
  - Kata 1: sum of 1..n (linear recursion)
  - Kata 2: flatten a nested list (tree recursion)
- The no-reliable-TCO reality (TPP-07)
  - Engine status
  - Why it matters for TPP
- Stack-safe recursion patterns
  - Pattern 1: Trampoline (TEACH, first-class)
  - Pattern 2: Generator as a state machine (TEACH, secondary)
  - Pattern 3: CPS with a trampoline (MENTION)
  - Pattern 4: The iterative (if -> while) route (TEACH, default)
  - Pattern 5: Fold / reduce (TEACH, secondary)
  - Pattern 6: Mutual-recursion trampolining (MENTION)
- Transformation vs refactoring, and the decision guide
- The TS/JS overlay (source-sanctioned, not dogma)
- Sources

---

## Paired katas (TPP-05)

Two katas, each done the FUNCTIONAL way (recursive, then made stack-safe) and the IMPERATIVE
way (iterative), showing which transformations each path reaches for and where the priority
order diverges by paradigm. Behavior is identical across paradigms; the transformation
sequence is not.

### Kata 1: sum of 1..n (linear recursion)

The tests are paradigm-independent. The last one is a deep-input test: it pins stack safety
as a behavioral requirement.

```ts
expect(sum(0)).toBe(0);
expect(sum(1)).toBe(1);
expect(sum(3)).toBe(6);
expect(sum(1_000_000)).toBe(500_000_500_000); // deep-input test: pins stack safety
```

Functional path (canonical ordering). After the base case, the natural functional move is
`(statement -> tail-recursion)` #9: an accumulator threaded through a tail call.

```ts
// GREEN for small inputs, but sum(1_000_000) OVERFLOWS on V8:
// V8 does not optimize this tail call, so the stack grows one frame per step.
function sumTo(n: number, acc: number): number {
  if (n === 0) {
    return acc;
  }

  return sumTo(n - 1, acc + n);
}
```

Because the deep-input test is red, stack safety is behavioral -- so the transformation has
to be stack-safe. The functional path pays for it with a trampoline (Pattern 1 below): the
endpoint is `trampoline(sumTo(n, 0))`, where `sumTo` returns a thunk instead of recursing.

Imperative path (TS/JS overlay ordering). The overlay promotes `(if -> while)` #10 and
`(variable -> assignment)` #13 above the recursion transformations, so the first move after
the base case is a `while` loop with an accumulator -- stack-safe for every input, no later
conversion needed.

```ts
function sumIterative(n: number): number {
  let acc = 0;

  while (n !== 0) {
    acc = acc + n;
    n = n - 1;
  }

  return acc;
}
```

Where the order diverges: the functional path reaches for `(statement -> tail-recursion)` #9
first and then must pay for stack safety; the imperative path reaches for `(if -> while)` #10
plus `(variable -> assignment)` #13 first and gets stack safety for free. Same tests, same
final behavior, different transformation sequence -- driven entirely by the TCO reality.

### Kata 2: flatten a nested list (tree recursion)

```ts
type Nested = ReadonlyArray<number | Nested>;
type Item = number | Nested;
const isNested = (x: Item): x is Nested => Array.isArray(x);

expect(flatten([1, [2, [3, 4]], 5])).toEqual([1, 2, 3, 4, 5]);
// deep-nesting test pins stack safety:
expect(flatten(nest200k).length).toBe(200_001);
```

Functional path. The natural definition is TREE recursion: for each element, recurse if it
is an array and combine the results. The recursion is NOT in tail position (results are
combined after each recursive call), so `(statement -> tail-recursion)` #9 is simply not
available for this shape. The naive recursive form is green for shallow input but overflows
on deep nesting.

```ts
// Tree recursion: no tail form. Overflows (RangeError) on deeply nested input.
function flattenNaive(root: Nested): number[] {
  const out: number[] = [];

  for (const item of root) {
    if (isNested(item)) {
      out.push(...flattenNaive(item));
    } else {
      out.push(item);
    }
  }

  return out;
}
```

The stack-safe functional-flavoured answer is a GENERATOR that walks an EXPLICIT stack and
yields leaves (Pattern 2 below), consumed with `[...gen]`.

```ts
function* flattenGen(node: Item): Generator<number, void, void> {
  const stack: Item[] = [node];

  while (stack.length > 0) {
    const top = stack.pop()!;

    if (isNested(top)) {
      for (let i = top.length - 1; i >= 0; i--) {
        stack.push(top[i]);
      }
    } else {
      yield top;
    }
  }
}

const flatten = (root: Nested): number[] => [...flattenGen(root)];
```

Imperative path. An explicit-stack `while` loop (Pattern 4 below, the tree-recursion form):
the stack lives in an array instead of the native call stack. Verified stack-safe at 200k
depth.

```ts
function flattenIterative(root: Nested): number[] {
  const out: number[] = [];
  const stack: Item[] = [root];

  while (stack.length > 0) {
    const top = stack.pop()!;

    if (isNested(top)) {
      for (let i = top.length - 1; i >= 0; i--) {
        stack.push(top[i]);
      }
    } else {
      out.push(top);
    }
  }

  return out;
}
```

Where the order diverges: this kata shows a case the linear examples hide. For tree
recursion the high-priority `(statement -> tail-recursion)` #9 transformation does not apply
at all, so BOTH paradigms converge on an explicit stack; the only difference is a generator
(lazy, yields leaves) versus a plain loop (eager, pushes into an output array). "Prefer
tail-recursion" is meaningless when the algorithm has no tail form, and the stack lives in an
array either way.

TS typing lesson embedded in Kata 2. `Array.isArray(x)` does NOT narrow a `readonly` union
member: its built-in guard is `x is any[]`, and a `ReadonlyArray` is not an `any[]`. Use the
custom guard `const isNested = (x: Item): x is Nested => Array.isArray(x)` instead. Also, do
NOT name the element type `Node` -- it collides with the DOM `Node` global under `--lib dom`;
use `Item`/`Nested`.
