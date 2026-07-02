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

---

## The no-reliable-TCO reality (TPP-07)

### Engine status

In practice, TypeScript/JavaScript has no reliable tail-call optimization. As of 2026, only
JavaScriptCore (Safari) implements ES6 proper tail calls (PTC). V8 (Chrome, Node.js, Deno,
Edge, Electron) and SpiderMonkey (Firefox) do not implement proper tail calls. Verified
empirically: Node v24.18.0 (V8 13.6) throws `RangeError: Maximum call stack size exceeded` on
deep tail recursion at roughly 10,000 frames.

| Engine | Runtimes | ES6 proper tail calls |
|--------|----------|-----------------------|
| JavaScriptCore | Safari (and Bun) | YES (compat-table 2/2) |
| V8 | Chrome, Node.js, Deno, Edge, Electron | NO (Chrome 0/2; empirical overflow) |
| SpiderMonkey | Firefox | NO (0/2) |

Do NOT trust the kangax/compat-table "Node 2/2" proper-tail-calls cell. The ES6 compat-table
reports proper tail calls PASSING for Node (2/2) while reporting FAILING for Chrome (0/2),
even though both run V8. That Node cell is a reporting/harness artifact -- a false positive.
Running the exact compat-table test on Node v24 throws `RangeError`. The authoritative signal
is runtime behavior, and the runtime overflows: cite the Chrome row (0/2) plus the empirical
V8 overflow, never the Node cell.

Bun uses JavaScriptCore, so it is the one non-Safari runtime that gets PTC -- but do not rely
on Bun-only behavior; treat "no reliable TCO" as the portable default. Raising `--stack-size`
only moves the overflow cliff further out (and risks a hard native crash instead of a
catchable `RangeError`); it is not a fix.

### Why it matters for TPP

In a language WITH proper TCO (Scheme, Safari's JS), `(statement -> tail-recursion)` #9 runs
in constant stack: a legitimately safe, simple, high-priority move. The canonical ordering
(tail-recursion above iteration) reflects that functional worldview.

In V8/SpiderMonkey JS/TS, `(statement -> tail-recursion)` #9 produces code that passes the
test but silently overflows on deep inputs. The transformation looks cheap on the priority
list but carries a hidden non-functional defect. This is exactly the case that motivates the
TS/JS overlay below: prefer iteration so the overflow never arises.

## Stack-safe recursion patterns

All snippets type-check under `tsc --strict` and were executed at depth 1,000,000, where
naive recursion overflows at roughly 10,000. What the skill should teach vs merely mention:

| Pattern | Treatment | Why |
|---------|-----------|-----|
| Iterative route (`if -> while` + `variable -> assignment`) | TEACH (default for TS/JS) | It IS two transformations already on the list; sidesteps TCO entirely; most idiomatic. |
| Trampoline (`Thunk<T>` / `Bounce<T>`) | TEACH (first-class) | Canonical stack-safety refactoring when a recursive shape is kept; small and reusable. |
| Generator as state machine | TEACH (secondary) | Best for tree recursion and lazy/streaming sequences. |
| Fold / reduce | TEACH (secondary) | Idiomatic functional linear iteration, no explicit recursion or mutation. |
| CPS (with a trampoline) | MENTION | Real but heavy and low-readability; note it exists and that it REQUIRES a trampoline. |
| Mutual-recursion trampolining | MENTION | Same trampoline, one sentence. |

### Pattern 1: Trampoline (TEACH, first-class)

A tail-recursive function is rewritten to RETURN a thunk (a zero-arg function that does the
next step) instead of calling itself. A driver loop repeatedly invokes thunks until a plain
value pops out; the recursion never nests.

```ts
type Thunk<T> = () => Trampoline<T>;
type Trampoline<T> = T | Thunk<T>;

function trampoline<T>(initial: Trampoline<T>): T {
  let result = initial;

  while (typeof result === 'function') {
    result = (result as Thunk<T>)();
  }

  return result;
}

// The tail-recursive body: return a thunk instead of recursing.
function sumTo(n: number, acc: number): Trampoline<number> {
  if (n === 0) {
    return acc;
  }

  return () => sumTo(n - 1, acc + n);
}

trampoline(sumTo(1_000_000, 0)); // 500000500000, no overflow
```

Typing gotcha. The `T | Thunk<T>` union plus `typeof result === 'function'` misclassifies
results when `T` is itself a function type (a legitimate function return would be run as a
thunk). When the payload can be a function, use a tagged union `Bounce<T>` instead:

```ts
type Bounce<T> =
  | { readonly done: true; readonly value: T }
  | { readonly done: false; readonly next: () => Bounce<T> };

const done = <T>(value: T): Bounce<T> => ({ done: true, value });
const more = <T>(next: () => Bounce<T>): Bounce<T> => ({ done: false, next });

function trampoline<T>(start: Bounce<T>): T {
  let bounce = start;

  while (!bounce.done) {
    bounce = bounce.next();
  }

  return bounce.value;
}
```

Trade-offs: allocates one closure (or one small object) per step -- measurable GC and speed
overhead versus a raw loop. Best when a recursive SHAPE is genuinely clearer than a loop and
you still need depth safety (and for mutual recursion, Pattern 6). Not worth it for a trivial
linear accumulation where a `while` loop is clearer.

### Pattern 2: Generator as a state machine (TEACH, secondary)

Model what would be recursion as an explicit iterative process inside a `function*`, driven
by a loop. Especially strong for tree traversal (yield leaves while walking an explicit
stack, as in Kata 2) and lazy/streaming sequences.

```ts
function* countUp(n: number): Generator<number, void, void> {
  for (let i = 1; i <= n; i++) {
    yield i;
  }
}

function sumGen(n: number): number {
  let acc = 0;

  for (const x of countUp(n)) {
    acc += x;
  }

  return acc;
}

sumGen(1_000_000); // safe
```

Typing gotcha: annotate the generator explicitly as `Generator<Yield, Return, Next>`. The
`Return` slot is easy to omit, and a driver loop that reads `.value` can see the return type
widen to `void`/`any` when the generator is under-specified.

### Pattern 3: CPS with a trampoline (MENTION)

Continuation-passing style (CPS) threads an explicit continuation (a "what to do next"
callback) through every call so that every call is in tail position. On its own this does NOT
help in JS: invoking the continuation is still a nested call, so the stack still grows.
Verified: "naked" CPS overflows at the same roughly 10,000 threshold as naive recursion. Do
NOT present naked CPS as a fix.

```ts
// NAKED CPS -- STILL OVERFLOWS on V8. Do not present this as a fix.
function sumCpsNaked(n: number, k: (value: number) => number): number {
  if (n === 0) {
    return k(0);
  }

  return sumCpsNaked(n - 1, (rest) => k(n + rest)); // k(...) is a nested call
}
// sumCpsNaked(10000, x => x) -> RangeError
```

CPS becomes stack-safe ONLY when paired with a trampoline: the continuations are RETURNED as
thunks and bounced off the driver loop (verified safe at 1,000,000). In other words, CPS
requires a trampoline; it is never a standalone stack-safety fix.

```ts
type Thunk<T> = () => Trampoline<T>;
type Trampoline<T> = T | Thunk<T>;
type Cont<T> = (value: T) => Trampoline<T>;

function trampoline<T>(initial: Trampoline<T>): T {
  let result = initial;

  while (typeof result === 'function') {
    result = (result as Thunk<T>)();
  }

  return result;
}

function sumCps(n: number, k: Cont<number>): Trampoline<number> {
  if (n === 0) {
    return k(0);
  }

  return () => sumCps(n - 1, (rest) => () => k(n + rest));
}

trampoline(sumCps(1_000_000, (x) => x)); // safe
```

Its real niche is transforming already-CPS code (async pipelines, parser combinators,
interpreters), not first-choice stack safety. Steer readers to Patterns 1, 2, or 4 instead.

### Pattern 4: The iterative (if -> while) route (TEACH, default)

This is not an exotic pattern; it is the two transformations `(if -> while)` #10 and
`(variable -> assignment)` #13 applied directly. For linear recursion it is a plain
accumulator loop (see `sumIterative` in Kata 1). For tree recursion, "iteration" means
walking an EXPLICIT stack (an array used as a LIFO) instead of the native call stack (see
`flattenIterative` in Kata 2). Fastest and lowest-allocation of all options, with zero
dependency on any helper; it is the idiomatic, portable answer in TS/JS and the one the
language overlay defaults to.

### Pattern 5: Fold / reduce (TEACH, secondary)

When the shape is "combine a sequence into one value," `Array.prototype.reduce` expresses
linear iteration functionally, with no explicit recursion and no user-level mutation (the
loop lives inside `reduce`).

```ts
const range = (n: number): number[] =>
  Array.from({ length: n }, (_unused, i) => i + 1);

const sumFold = (n: number): number => range(n).reduce((acc, x) => acc + x, 0);

sumFold(1_000_000); // safe
```

Trade-offs: stack-safe and readable for the fold shape, but `range(n)` materializes an array
of `n` elements and `reduce` cannot early-exit. For huge or infinite sequences prefer a
generator (Pattern 2). Not applicable to tree recursion without first flattening.

### Pattern 6: Mutual-recursion trampolining (MENTION)

Two or more functions that tail-call each other (`isEven`/`isOdd`, state machines) still
overflow; the fix is the same trampoline -- each function returns a thunk for the other and
one driver loop bounces between them (same `Thunk`/`Bounce` helper as Pattern 1).

## Transformation vs refactoring, and the decision guide

Do not blur the distinction:

- Choosing recurse vs iterate at GREEN time is a TRANSFORMATION choice. Both a recursive body
  and an iterative body are behavior-changing edits that make the red test pass; they map to
  list positions 9/10/11/13. The priority list ranks them; the TS/JS overlay reorders them.
- Converting an already-green recursive solution into a trampoline / generator /
  explicit-stack form is a REFACTORING. It preserves observable behavior for the inputs the
  tests exercise and only changes a non-functional property (bounded stack). It is not on the
  priority list and belongs in the refactor step.
- The sharp edge: if a test asserts behavior on a DEEP input (for example `sum(1_000_000)`
  returns the right number without throwing), then stack safety is now BEHAVIORAL. Going from
  red to green may require picking the stack-safe (iterative or trampolined) form AS the
  transformation, not as a later refactor. So the same conversion is a refactoring or a
  transformation depending on whether a test pins deep-input behavior. Teach practitioners to
  notice which case they are in.

Decision guide -- the list points at a recursion transformation and there is no reliable TCO:

- Is there a (passing-or-red) test that asserts correctness on DEEP input (depth beyond
  roughly 1e4)?
  - NO -> stack safety is a non-functional concern. Take the highest-priority-that-passes
    transformation. On the canonical list that may be `(statement -> tail-recursion)` #9; on
    the TS/JS overlay (recommended default) prefer `(if -> while)` #10 plus `(variable ->
    assignment)` #13, which produce stack-safe code directly. Defer any stack-safety
    CONVERSION to the refactor step, and only do it if deep input is a realistic production
    concern. Do not pre-optimize.
  - YES -> stack safety is BEHAVIORAL; the transformation you pick must itself be stack-safe.
    Choose by recursion SHAPE:
    - Linear / tail-recursive shape: the iterative transformation (`if -> while` + `variable
      -> assignment`) is the simplest default; a trampoline keeps the recursive shape and
      adds the driver.
    - Tree-recursive shape (no tail form): generator plus explicit stack, or explicit-stack
      iteration (trampolining tree recursion is awkward -- avoid).
    - Already-CPS / async pipeline: CPS plus a trampoline (only here does CPS earn its keep).

## The TS/JS overlay (source-sanctioned, not dogma)

The overlay -- prefer `(if -> while)` and `(variable -> assignment)` above the recursion
transformations -- is not an opinion bolted onto TPP. It is the direct consequence of the TCO
reality above, and it is sanctioned by the premise's own author, who notes the priority list
is language specific (FibTPP post):

> "In Java, for example, we might move (if -> while) and (variable -> assignment) above
> (statement -> tail-recursion) so that iteration is always preferred above recursion, and
> assignment is preferred above parameter passing."

TypeScript/JavaScript sits in the same bucket as Java here (non-functional, no reliable TCO),
so the same reordering applies. Frame this as a heuristic with a stated reason (the TCO
reality), never as a hard rule: on the canonical list `(statement -> tail-recursion)` #9 is
still above `(if -> while)` #10, and a stated-reason deviation from the overlay is legitimate.
Reserve trampolines and generators for genuinely recursive shapes (tree traversal, mutual
recursion, parser/interpreter code) where a loop would obscure the algorithm and depth safety
still matters.

## Sources

- Robert C. Martin, "Fib. The T-P Premise." (Clean Coder Blog):
  https://blog.cleancoder.com/uncle-bob/2013/05/27/FibTPP.html -- the language-specific
  ordering caveat quoted above.
- ECMAScript 6 compatibility table (kangax/compat-table):
  https://compat-table.github.io/compat-table/es6/ -- per-engine PTC status (with the Node
  false-positive caveat noted above).
- "ES2015, ES2016, and beyond" (V8 blog): https://v8.dev/blog/modern-javascript -- V8
  implemented then removed proper tail calls, and the debugging rationale.
- tc39/proposal-ptc-syntax: https://github.com/tc39/proposal-ptc-syntax -- syntactic tail
  calls, stalled and unshipped.
- Engine status and every code pattern above were verified by executing on Node v24.18.0
  (V8 13.6) with `tsc --strict`; naive recursion overflows near 10,000 frames, each
  stack-safe pattern survives depth 1,000,000.
