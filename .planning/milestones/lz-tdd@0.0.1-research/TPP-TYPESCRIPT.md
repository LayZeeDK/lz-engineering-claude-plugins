# TPP in TypeScript/JavaScript: TCO Reality and Recursion Alternatives

**Domain:** Applying the Transformation Priority Premise (TPP) in TypeScript/JavaScript, focused on (1) functional-vs-imperative example pairing and (2) the lack of reliable tail-call optimization (TCO) plus its alternatives.
**Project:** lz-engineering-claude-plugins / lz-tdd / lz-tpp (`/lz-tdd:lz-tpp`).
**Researched:** 2026-07-02
**Overall confidence:** HIGH (engine status and every code pattern verified by executing on the local Node.js runtime, not from memory).

> Builds on `.planning/research/FEATURES.md` Part 2 (the canonical 14-item transformation
> list and the language-specificity caveat). This file does NOT re-derive the list; it
> supplies the TS/JS-specific TCO reality, the alternative patterns, and the
> transformation-vs-refactoring reasoning the skill needs for TPP-05 and TPP-07.

---

## Summary / Key Findings

1. **In practice, JS/TS has no reliable TCO.** As of 2026, only JavaScriptCore (Safari)
   implements ES6 proper tail calls (PTC). V8 (Chrome, Node.js, Deno, Bun, Edge,
   Electron) and SpiderMonkey (Firefox) do not. Verified empirically: Node v24.18.0
   (V8 13.6) throws `RangeError: Maximum call stack size exceeded` on deep tail
   recursion at roughly 10,000 frames.

2. **Do not trust the kangax/compat-table "Node.js 2/2" cell.** The ES6 compat-table
   reports proper tail calls as PASSING for Node (2/2) while reporting FAILING for
   Chrome (0/2), even though both run V8. This is a reporting/harness artifact. Running
   the exact compat-table test on Node v24 throws `RangeError`. The authoritative signal
   is the runtime behavior, and the runtime overflows. The Chrome row (0/2) and the
   empirical test agree; the Node row is wrong.

3. **The recursion transformations in the TPP list are the ones affected.** Positions 9
   `(statement -> tail-recursion)` and 11 `(statement -> recursion)` produce code that
   overflows on deep inputs in every mainstream JS runtime except Safari. This is
   exactly why FibTPP's language-specificity note says to promote `(if -> while)` and
   `(variable -> assignment)` above the recursion transformations in non-functional
   languages.

4. **Five stack-safe patterns, all verified runnable and `--strict`-clean:** trampoline,
   generator-as-state-machine, CPS-plus-trampoline, accumulator/explicit-stack iteration
   (`if -> while`), and fold/reduce. All survive depth 1,000,000 where naive recursion
   overflows at ~10,000.

5. **CPS alone does NOT fix stack growth in JS.** Verified: "naked" CPS overflows at the
   same ~10,000 threshold as naive recursion, because each continuation invocation is
   itself a nested call. CPS is stack-safe only when PAIRED with a trampoline (return
   thunks instead of calling the continuation directly). The skill must not present CPS
   as a standalone fix.

6. **Transformation vs refactoring is the key TPP-fidelity distinction here.** Choosing
   "recurse" vs "iterate" at green time is a choice between two *transformations* (both
   behavior-changing, both on the priority list). Converting an already-green recursive
   solution into a trampoline/generator/explicit-stack form is a *refactoring*
   (behavior-preserving, off the priority list, done in the refactor step) -- UNLESS a
   test pins behavior on deep input, in which case stack safety becomes behavioral and
   the transformation you pick must itself be stack-safe.

**What the skill should teach vs mention:**

| Pattern | Skill treatment | Why |
|---------|-----------------|-----|
| Iterative conversion (`if -> while` + `variable -> assignment`) | TEACH (default for TS/JS) | It IS two transformations already on the list; sidesteps TCO entirely; most idiomatic. |
| Trampoline (`Thunk<T>`/`Trampoline<T>`) | TEACH (first-class) | Canonical stack-safety refactoring when a recursive shape is kept; small, reusable. |
| Generator-as-state-machine | TEACH (secondary) | Best for tree recursion and lazy/streaming sequences; idiomatic JS. |
| Fold / reduce | TEACH (secondary) | Idiomatic functional linear iteration with no explicit recursion or mutation. |
| CPS (+ trampoline) | MENTION and move on | Real but heavy and low-readability; only note it exists and that it REQUIRES a trampoline. |
| Explicit-stack iteration | TEACH as part of the iterative route | It is the manual form of `if -> while` for tree recursion, not a separate concept. |

---

## TCO Engine Status (2026)

| Engine | Runtimes | ES6 proper tail calls | Source |
|--------|----------|-----------------------|--------|
| JavaScriptCore | Safari, Bun's JS in older builds (Bun uses JSC-derived? no -- see note) | YES (2/2) | compat-table ES6, Safari 15.6-26.4 all 2/2; shipped 2016, never removed |
| V8 | Chrome, Node.js, Deno, Edge, Electron | NO | compat-table Chrome 136-149 = 0/2; empirically verified overflow on Node v24 |
| SpiderMonkey | Firefox | NO (0/2) | compat-table Firefox 115-152 all 0/2 |

Note on runtimes: **Deno and Node.js are V8 -> no PTC. Bun uses JavaScriptCore -> it is
the one non-Safari runtime that DOES get PTC**, but the skill should not rely on Bun-only
behavior; treat "no reliable TCO" as the portable default. (Bun/JSC PTC: MEDIUM
confidence -- not re-verified on a local Bun install in this research; JSC itself is
HIGH.)

**Empirical verification (this machine, 2026-07-02):**

```
Node v24.18.0 (V8 13.6.233.17-node.50)
direct-tail sumTo depth=1000:  OK
direct-tail sumTo depth=10000: THREW RangeError: Maximum call stack size exceeded
mutual-tail isEven depth=10000: OK
mutual-tail isEven depth=50000: THREW RangeError

# Exact kangax "proper tail calls" test (1e6):
kangax direct (1e6): THREW RangeError
kangax mutual (1e6): THREW RangeError
```

The direct-recursion cliff is around 10,000 frames; the exact number varies with frame
size (arguments + locals) and is not a stable API. Mutual recursion reaches a higher
depth only because each logical step alternates two tiny frames, not because any TCO
occurs -- it still overflows.

### History (why V8/Node has no PTC)

- ES2015 (ES6) specified proper tail calls as mandatory. V8 implemented them and staged
  them behind `--harmony-tailcalls` (and `--harmony-explicit-tailcalls`). **Those flags
  were later removed; PTC was disabled and never shipped in Chrome/Node.** (V8 blog,
  2016.)
- V8's stated reasons: eliding tail frames creates stack discontinuities that break
  debugging and shrink `error.stack`, breaking telemetry; and developers get no signal
  when an intended tail call silently is not one. A "shadow stack" mitigation was judged
  too expensive to run always.
- V8 instead co-championed an explicit, opt-in TC39 proposal: **syntactic tail calls
  (STC)**, using a `return continue f(...)` statement. The STC proposal
  (`tc39/proposal-ptc-syntax`) **stalled around 2016-2017, never advanced past its early
  stage, and has not shipped.** No explicit tail-call syntax exists in any engine today.

**Bottom line for the skill:** treat TCO as unavailable in TS/JS. Recursion depth is
bounded by the native call stack (typically low tens of thousands of frames). Raising
`--stack-size` only moves the cliff and risks a hard native crash; it is not a fix.

Citations: [ECMAScript 6 compatibility table (kangax/compat-table, live)](https://compat-table.github.io/compat-table/es6/) | [ES2015, ES2016, and beyond -- V8 blog](https://v8.dev/blog/modern-javascript) | [tc39/proposal-ptc-syntax](https://github.com/tc39/proposal-ptc-syntax) | [What happened to proper tail calls in JavaScript? -- mgmarlow](https://mgmarlow.com/words/2021-03-27-proper-tail-calls-js/) | [Tail-Call Optimization in the Wild -- IndigoAg Eng](https://medium.com/indigoag-eng/tail-call-optimization-in-the-wild-26a10e450c73)

---

## Why It Matters for TPP

The canonical 14-item list (FibTPP) contains three recursion/iteration-relevant
transformations:

- `9. (statement -> tail-recursion)` -- preferred over arbitrary recursion, sits ABOVE
  `(if -> while)` in the canonical order.
- `10. (if -> while)`
- `11. (statement -> recursion)` -- plain recursion, sits BELOW `(if -> while)`.
- (`13. (variable -> assignment)` is the companion the imperative route needs.)

In a language WITH proper TCO (Scheme, Safari's JS), `(statement -> tail-recursion)` is a
legitimately safe, simple, high-priority move: the tail-recursive form runs in constant
stack. The canonical ordering (tail-recursion above iteration) reflects that functional
worldview.

In V8/SpiderMonkey JS/TS, `(statement -> tail-recursion)` produces code that **passes the
test but silently overflows on deep inputs.** The transformation looks cheap on the
priority list but carries a hidden non-functional defect. This is precisely the case
FibTPP calls out: "the priority list is language specific. In Java, for example, we might
move `(if->while)` and `(variable->assignment)` ABOVE `(statement->tail-recursion)` so
that iteration is always preferred above recursion." TypeScript/JavaScript is in the same
bucket as Java here (non-functional, no reliable TCO).

So the skill's TS/JS overlay is not an opinion bolted on; it is the direct, source-
sanctioned consequence of the TCO reality documented above.

---

## TCO-Alternative Patterns

All snippets below type-check under `tsc --strict` and were executed with the code paths
that overflow (naive recursion) versus survive (each pattern) at depth 1,000,000.

### Pattern 1: Trampoline (TEACH -- first-class)

A tail-recursive function is rewritten to RETURN a thunk (a zero-arg function that does
the next step) instead of calling itself. A driver loop repeatedly invokes thunks until a
plain value pops out. The recursion never nests: each step returns to the loop.

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

**Typing gotcha (important):** the `T | Thunk<T>` union plus `typeof result === 'function'`
misclassifies results when `T` is itself a function type (a legitimate function return
would be run as a thunk). When the payload can be a function, use a tagged union instead
(also verified):

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

**Trade-offs:** allocates one closure (or one small object) per step -- measurable GC and
speed overhead versus a raw loop. Readable and reusable once the `Thunk`/`Bounce` helper
exists. Best when a recursive SHAPE is genuinely clearer than a loop and you still need
depth safety, and for mutual recursion (see Pattern 6). Not worth it for a trivial linear
accumulation where a `while` loop is clearer.

### Pattern 2: Generator as state machine (TEACH -- secondary)

Model what would be recursion as an explicit iterative process inside a `function*`, and
drive it with a loop. Especially strong for tree traversal (yield leaves while walking an
explicit stack) and lazy/streaming sequences where you do not want to materialize the
whole result.

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

For tree recursion, the generator carries an explicit stack (see Kata 2 below), which is
what makes it stack-safe -- the generator does not recurse into itself.

**Trade-offs:** the iterator protocol has per-`next()` overhead (slower than a raw loop);
`Generator<Yield, Return, Next>` typing is easy to get wrong (forgetting the `Return`
slot, or the `TReturn` widening to `void`/`any` when a driver reads `.value`). Excellent
readability for streaming/lazy work; overkill for a simple accumulate-and-return.

### Pattern 3: Continuation-Passing Style (MENTION -- and only WITH a trampoline)

CPS threads an explicit continuation (a "what to do next" callback) through every call so
that every call is in tail position. **On its own this does NOT help in JS**: invoking the
continuation directly is still a nested call, so the stack still grows. Verified: "naked"
CPS overflows at the same ~10,000 threshold as naive recursion.

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

CPS becomes stack-safe only when the continuations are RETURNED as thunks and bounced off
a trampoline (verified safe at 1,000,000):

```ts
type Cont<T> = (value: T) => Trampoline<T>;

function sumCps(n: number, k: Cont<number>): Trampoline<number> {
  if (n === 0) {
    return k(0);
  }

  return () => sumCps(n - 1, (rest) => () => k(n + rest));
}

trampoline(sumCps(1_000_000, (x) => x)); // safe
```

**Trade-offs:** the highest readability cost of any pattern here; nested continuation
types (`Cont<T>` returning `Trampoline<T>`) get gnarly fast. Its real niche is
transforming already-CPS code (async pipelines, parser combinators, interpreters), not
first-choice stack safety. The skill should state the "needs a trampoline" nuance
explicitly and steer readers to Patterns 1, 2, or 4 instead.

### Pattern 4: Accumulator / explicit-stack iteration -- the `(if -> while)` route (TEACH -- default)

This is not an exotic pattern; it is the two transformations `(if -> while)` and
`(variable -> assignment)` applied directly. For linear recursion it is a plain loop with
an accumulator:

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

For tree recursion, "iteration" means walking an EXPLICIT stack (an array used as a LIFO)
instead of the native call stack:

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

**Trade-offs:** fastest and lowest-allocation of all options; zero dependency on any
helper. The cost is that a tree algorithm expressed with an explicit stack is less
self-evidently "the recursive definition" than the naive recursive form -- but it is the
idiomatic, portable answer in TS/JS and the one the language overlay defaults to.

### Pattern 5: Fold / reduce as functional iteration (TEACH -- secondary)

When the shape is "combine a sequence into one value," `Array.prototype.reduce` expresses
linear iteration functionally, with no explicit recursion and no user-level mutation (the
loop lives inside `reduce`):

```ts
const range = (n: number): number[] =>
  Array.from({ length: n }, (_unused, i) => i + 1);

const sumFold = (n: number): number => range(n).reduce((acc, x) => acc + x, 0);

sumFold(1_000_000); // safe
```

**Trade-offs:** stack-safe and readable for the fold shape; but `range(n)` materializes an
array of `n` elements (memory), and `reduce` cannot early-exit. For huge or infinite
sequences prefer a generator (Pattern 2). Not applicable to tree recursion without first
flattening.

### Pattern 6: Mutual-recursion trampolining (MENTION)

Two or more functions that tail-call each other (`isEven`/`isOdd`, state machines) still
overflow (verified above). The fix is the same trampoline: each function returns a thunk
for the other, and one driver loop bounces between them. Same `Thunk`/`Bounce` helper as
Pattern 1; the only difference is the thunks close over different functions. Worth one
sentence in the skill, not a full section.

---

## TPP Integration and Decision Guide

### The transformation-vs-refactoring distinction (do not blur it)

- **Choosing recurse vs iterate at GREEN time is a transformation choice.** Both a
  recursive body and an iterative body are behavior-changing edits that make the red test
  pass. They map to list positions 9/10/11/13. The priority list ranks them; the TS/JS
  overlay reorders them (iteration above recursion).
- **Converting an already-green recursive solution into a trampoline / generator /
  explicit-stack form is a REFACTORING.** It preserves observable behavior for the inputs
  the tests exercise; it changes a non-functional property (bounded stack). It is NOT on
  the priority list and is NOT priority-ranked. It belongs in the refactor step.
- **The sharp edge:** if a test asserts behavior on a DEEP input (e.g. `sum(1_000_000)`
  returns the right number without throwing), then stack safety is now BEHAVIORAL. Going
  from red to green on that test may require picking the iterative transformation (or a
  trampoline) as the transformation itself -- not as a later refactor. So the same
  stack-safety conversion is a refactoring or a transformation depending on whether a test
  pins deep-input behavior. The skill should teach practitioners to notice which case
  they are in.

### Decision guide: the list points at a recursion transformation and there is no TCO

```
Is there a (passing-or-red) test that asserts correctness on DEEP input
(depth beyond ~1e4)?
|
+-- NO  -> Stack safety is a non-functional concern.
|          Take the highest-priority-that-passes transformation.
|          - On the canonical list: that may be (statement -> tail-recursion) #9.
|          - On the TS/JS overlay (recommended default): prefer (if -> while) #10
|            + (variable -> assignment) #13, which produce stack-safe code directly.
|          Defer any stack-safety CONVERSION to the refactor step, and only do it
|          if deep input is a realistic production concern. Do not pre-optimize.
|
+-- YES -> Stack safety is BEHAVIORAL. The transformation you pick must be stack-safe.
           Choose by recursion SHAPE:
           - Linear / tail-recursive shape:
               (a) iterative transformation (if -> while + variable -> assignment)  <-- simplest, default
               (b) trampoline (keep the recursive shape, add the driver)
           - Tree-recursive shape (no tail form):
               generator + explicit stack, OR explicit-stack iteration
               (trampolining tree recursion is awkward -- avoid)
           - Already-CPS / async pipeline:
               CPS + trampoline (only here does CPS earn its keep)
```

**Default recommendation for the lz-tpp TS/JS overlay:** apply FibTPP's sanctioned
reordering -- prefer `(if -> while)` and `(variable -> assignment)` above the recursion
transformations. This sidesteps the TCO problem by producing iterative code in the first
place. Reserve trampolines/generators for genuinely recursive shapes (tree traversal,
mutual recursion, parser/interpreter code) where a loop would obscure the algorithm and
depth safety still matters. Frame all of this as a heuristic with a stated reason, never
as a hard rule (consistent with the anti-dogma stance in FEATURES.md).

---

## Paired Example Design

Two katas, each done the FUNCTIONAL way (recursive, then made stack-safe) and the
IMPERATIVE way (iterative), showing which transformations each path applies and where the
priority order diverges by paradigm. Both are verified runnable.

### Kata 1: sum of 1..n (linear recursion) -- clean divergence at positions 9 vs 10/13

Tests (behavior is paradigm-independent):

```ts
expect(sum(0)).toBe(0);
expect(sum(1)).toBe(1);
expect(sum(3)).toBe(6);
expect(sum(1_000_000)).toBe(500_000_500_000); // the deep-input test: pins stack safety
```

**Functional path (canonical ordering):**
1. `({} -> nil)` then `(nil -> constant)` -> `return 0`.
2. `(unconditional -> if)` + `(constant -> scalar)` for the base case.
3. `(statement -> tail-recursion)` #9 -> `sum(n, acc)` calling `sum(n-1, acc+n)` in tail
   position. GREEN for small inputs, but OVERFLOWS the `sum(1_000_000)` test.
4. Because the deep-input test is red, stack safety is behavioral: apply the trampoline.
   If you regard the trampoline as preserving the behavior already green for small inputs
   and merely extending it to deep inputs, you can frame steps 3->4 as a refactoring of a
   green solution; if the deep test is what forced the change, it is the transformation.
   Either way the endpoint is `trampoline(sumTo(n, 0))` (Pattern 1).

**Imperative path (TS/JS overlay ordering):**
1-2. Same base case.
3. Overlay promotes `(if -> while)` #10 and `(variable -> assignment)` #13 above
   recursion -> write the `while` loop with an `acc` accumulator directly (Pattern 4).
   GREEN for all inputs including `sum(1_000_000)` with no later conversion needed.

**Where the order diverges:** functional path reaches for #9 first (and then must pay for
stack safety); imperative path reaches for #10 + #13 first (and gets stack safety for
free). Same tests, same final behavior, different transformation sequence -- driven
entirely by the TCO reality. This is the canonical TS/JS teaching example; it maps
directly onto FibTPP's Fibonacci walk (tail-recursion then unwound to a loop) that
FEATURES.md Part 2 already documents.

### Kata 2: flatten a nested list (tree recursion) -- shows tail-recursion is NOT even available

```ts
type Nested = ReadonlyArray<number | Nested>;
type Item = number | Nested;
const isNested = (x: Item): x is Nested => Array.isArray(x);

expect(flatten([1, [2, [3, 4]], 5])).toEqual([1, 2, 3, 4, 5]);
// deep-nesting test pins stack safety:
expect(flatten(nest200k).length).toBe(200_001);
```

**Functional path:** the natural definition is TREE recursion -- for each element,
recurse if it is an array. There is no tail-recursive form (the recursion is not in tail
position; results are combined after each recursive call), so `(statement -> tail-recursion)`
#9 is unavailable. The naive recursive `flatten` overflows on deep nesting (verified:
`RangeError` at 200k depth). The stack-safe functional-flavoured answer is a GENERATOR
that walks an explicit stack and yields leaves (Pattern 2), consumed with `[...gen]`.

**Imperative path:** explicit-stack `while` loop (Pattern 4, the tree-recursion form).
Verified stack-safe at 200k depth.

**Where the order diverges:** this kata shows a case the linear examples hide -- for tree
recursion the high-priority tail-recursion transformation simply does not apply, so BOTH
paradigms converge on an explicit stack; the only difference is generator (lazy, yields)
vs plain loop (eager, pushes to an output array). Good for teaching that "prefer
tail-recursion" is meaningless when the algorithm has no tail form, and that the
stack lives in an array either way.

**TS typing lesson embedded in Kata 2:** `Array.isArray(x)` does NOT narrow a `readonly`
union member (`Nested = ReadonlyArray<...>`), because its built-in guard is `x is any[]`
and a `ReadonlyArray` is not an `any[]`. Use a custom guard `const isNested = (x: Item):
x is Nested => Array.isArray(x)`. (Also: do not name the element type `Node` -- it
collides with the DOM `Node` global under `--lib dom`.)

---

## Pitfalls

### Critical

**CPS without a trampoline still overflows.** The single most likely piece of
misinformation. Invoking a continuation is a nested call; without TCO the stack grows.
Verified overflow at ~10,000. Always pair CPS with a trampoline (return thunks), or
prefer a plain trampoline/generator. Never present CPS as a standalone stack-safety fix.

**Trusting the compat-table "Node 2/2" cell.** The kangax ES6 table reports proper tail
calls PASSING for Node while FAILING for Chrome -- both are V8. The Node cell is a
reporting artifact; the runtime overflows (verified with the exact test). Cite the Chrome
row and the empirical result, not the Node row.

**Treating stack safety as always-a-refactoring OR always-a-transformation.** It depends
on whether a test pins deep-input behavior (see the decision guide). Getting this wrong
corrupts the TPP advice: either pre-optimizing (turning a refactor into a premature
transformation) or shipping code that fails a real deep-input requirement.

### Moderate

**`--stack-size` as a "fix."** Raising Node's stack size (or the browser's) only pushes
the overflow cliff further out and increases the risk of a hard, uncatchable native crash
instead of a catchable `RangeError`. It does not make recursion depth-independent. Not a
solution; do not recommend it.

**Trampoline/generator performance and allocation overhead.** Trampolines allocate a
closure (or small object) per step; generators pay iterator-protocol overhead per
`next()`. Both are meaningfully slower and allocate more than a raw `while` loop. For
hot linear loops, plain iteration (Pattern 4) wins. Measure before choosing a fancy
pattern.

**Over-engineering / readability cost.** Do not trampoline or CPS-transform code where a
5-line `while` loop is clearer. The skill should steer toward the SIMPLEST stack-safe form
(usually iteration), reserving trampolines/generators for genuinely recursive shapes.

### TypeScript typing gotchas (specific to these patterns)

- **`Trampoline<T> = T | Thunk<T>` + `typeof x === 'function'` breaks when `T` is a
  function type** (a real function result gets run as a thunk). Use the tagged-union
  `Bounce<T>` variant when the payload can be a function.
- **`Array.isArray()` does not narrow a `readonly` array union member.** Use a custom
  `x is Nested` type guard (Kata 2).
- **Generator return typing.** `Generator<Yield, Return, Next>` -- the `Return` slot is
  easy to omit; driver loops that read `.value` can see `TReturn` widen to `void`/`any`
  if the generator's return type is under-specified. Annotate the generator explicitly.
- **Recursive generic type aliases** (`Trampoline<T>`, `Nested`) are fine but can, in
  more elaborate shapes, hit "Type instantiation is excessively deep and possibly
  infinite." Keep them shallow; use an `interface` for self-referential shapes if a type
  alias blows up.
- **Name collisions with DOM globals** (`Node`, `Text`, `Event`, `Range`) when
  `--lib dom` is in scope. Prefer `Item`/`NestedNode` etc.

### Minor / note

**Async recursion is a different axis.** Deep `await`-based or Promise-`.then`-chained
recursion does not grow the synchronous call stack (each step runs on a fresh microtask),
so it avoids `RangeError` -- but it can starve the event loop or exhaust memory with
pending microtasks/closures. It is not a TCO substitute and is out of scope for the core
TPP examples; mention only if async katas appear later.

---

## Confidence and Sources

| Claim | Confidence | Basis |
|-------|------------|-------|
| Only JavaScriptCore/Safari implements ES6 PTC; V8 and SpiderMonkey do not | HIGH | Live compat-table (Chrome 0/2, Firefox 0/2, Safari 2/2) + empirical Node/V8 overflow |
| V8/Node deep tail recursion overflows (~10k frames) | HIGH | Executed on Node v24.18.0 / V8 13.6, twice (custom + exact kangax test) |
| compat-table "Node 2/2" is a false positive | HIGH | Exact kangax test throws RangeError on Node v24 |
| V8 implemented then removed PTC (`--harmony-tailcalls`); STC proposal stalled, unshipped | MEDIUM-HIGH | V8 blog + tc39/proposal-ptc-syntax repo/issues; exact TC39 stage not formally reconfirmed |
| Bun (JavaScriptCore) gets PTC | MEDIUM | JSC has PTC (HIGH); Bun-uses-JSC not re-verified on a local Bun here |
| All five alternative patterns are stack-safe and `--strict`-clean | HIGH | Type-checked with tsc 6.0.3 + executed with tsx at depth 1,000,000 |
| Naked CPS overflows; CPS needs a trampoline | HIGH | Executed; overflow at ~10,000 |
| Transformation-vs-refactoring framing for stack-safety conversion | HIGH | Direct application of FEATURES.md Part 2 definitions + FibTPP language-specificity note |

**Local verification environment:** Node v24.18.0 (V8 13.6.233.17-node.50), TypeScript
6.0.3, tsx 4.22.4, `tsc --strict --target es2021`. Windows 11 arm64.

**Sources:**
- [ECMAScript 6 compatibility table (kangax/compat-table)](https://compat-table.github.io/compat-table/es6/) -- live per-engine PTC status. HIGH (with the Node-cell caveat above).
- [ES2015, ES2016, and beyond -- V8 blog](https://v8.dev/blog/modern-javascript) -- V8's implementation-then-removal of PTC and the debugging rationale. HIGH.
- [tc39/proposal-ptc-syntax](https://github.com/tc39/proposal-ptc-syntax) -- syntactic tail calls (`return continue`), stalled/unshipped. MEDIUM-HIGH.
- [What happened to proper tail calls in JavaScript? -- mgmarlow (2021)](https://mgmarlow.com/words/2021-03-27-proper-tail-calls-js/) -- history summary; corroborating. MEDIUM.
- [Tail-Call Optimization in the Wild -- IndigoAg Eng (Medium)](https://medium.com/indigoag-eng/tail-call-optimization-in-the-wild-26a10e450c73) -- engine breakdown + trampoline workaround; corroborating. MEDIUM.
- [tc39/ecma262 issue #535 -- response to explicit tail-call proposal](https://github.com/tc39/ecma262/issues/535) -- Apple/JSC position against making PTC explicit. MEDIUM.
- FEATURES.md Part 2 (this repo) -- canonical transformation list, transformation-vs-refactoring definitions, FibTPP language-specificity note. HIGH (primary-sourced).
- Robert C. Martin, "Fib. The T-P Premise." -- https://blog.cleancoder.com/uncle-bob/2013/05/27/FibTPP.html -- language-specificity caveat and Fibonacci tail-recursion-then-loop walk. HIGH.

---
*Research for: lz-tpp (TPP coach + reference skill). Feeds references/typescript.md and the paired worked examples in the skill-authoring phase.*
*Researched: 2026-07-02. Do NOT commit -- orchestrator commits.*
