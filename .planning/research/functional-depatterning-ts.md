# Functional / De-Patterning Idioms for OO Refactorings and Patterns (TypeScript/JavaScript)

**Produced:** 2026-07-07
**Method:** `deep-research` workflow (run `wf_189867f5-1db`) -- 5 search angles, 21 sources
fetched, 95 claims extracted, top 25 adversarially verified.
**Verdict tally:** 25/25 claims confirmed, 0 refuted, 0 unverified.
**Purpose:** inform the lz-refactor dual-paradigm decision (see
`.planning/phases/08-.../08-REFACTORING-DIRECTIONS.md` and the dual-paradigm audit)
-- which catalog examples could carry a functional second example, grounded in
authoritative sources rather than opinion.

> **Read the confidence caveat first (Section 7).** Under the tuned tiered-verify
> scheme, primary-source claims passed on a single confirming verifier vote. "High
> confidence" here means the source is primary and authoritative (Norvig's own
> slides, Fowler's own catalog, Kerievsky's book, MDN) -- NOT that multiple
> verifiers reached consensus. Coverage is also narrower than the question asked:
> firm idioms landed for four patterns; several the question hypothesized were not
> established by any surviving claim.

---

## 1. Executive summary

The anchor result is Peter Norvig's thesis: **16 of the 23 GoF patterns are
"invisible or simpler"** in a language with first-class functions and first-class
types, and he attributes each dissolution to a *specific* language mechanism. JS/TS
have both first-class functions and first-class classes, so the attribution
generalizes (an inference beyond Norvig's literal Lisp/Dylan text, but a sound one).

Concrete, source-backed functional idioms are firmly established for four cases:

- **Strategy** -> a function-valued variable or a function parameter.
- **Abstract Factory** -> classes are themselves first-class factories.
- **Decorator** -> a higher-order function that wraps while preserving the signature.
- **Iterator** -> generator functions (`function*`), with lazy evaluation as a bonus.

plus Wlaschin's generalizing principle that **a one-method interface is just a
function**. For Fowler's 2nd edition, **Replace Loop with Pipeline** is a first-class
named refactoring (imperative accumulator loop -> `filter`/`map`/`reduce`). Kerievsky
contributes the explicit **de-patterning** principle: patterns are evolutionary and
reversible (refactor to / towards / away), applied with restraint.

---

## 2. The anchor: Norvig's mechanism -> pattern map (16 of 23)

Peter Norvig, *Design Patterns in Dynamic Languages* (1996 Object World slides).
He found 16 of 23 GoF patterns have a qualitatively simpler (or invisible)
implementation given the right language feature, and named which feature dissolves
which pattern. Per-mechanism counts sum to exactly 16.

| Language mechanism | Patterns it dissolves (count) |
|--------------------|-------------------------------|
| First-class functions | Command, Strategy, Template Method, Visitor (4) |
| First-class types | Abstract Factory, Flyweight, Factory Method, State, Proxy, Chain of Responsibility (6) |
| Macros | Interpreter, Iterator (2) |
| Method combination | Mediator, Observer (2) |
| Multimethods | Builder (1) |
| Modules | Facade (1) |

**Caveat:** Norvig *names* Command, Template Method, Visitor, State, Proxy, Chain of
Responsibility, Flyweight, and Factory Method as invisible/simpler, but no surviving
claim in this run spelled out the concrete JS/TS idiom for them (see Section 6). The
map tells you *that* they dissolve and *by which mechanism*; the concrete rendering
for most is still to be confirmed.

Sources: `norvig.com/design-patterns/`, `norvig.com/design-patterns/design-patterns.pdf`
(primary); corroborated by independent text mirrors and WebSearch.

---

## 3. Confirmed functional idioms (high source-confidence)

### 3.1 Strategy -> first-class function

The strategy is simply a variable whose value is a function, or a function passed as
a parameter -- eliminating the `ConcreteStrategy` class hierarchy. Norvig's slide:
"the strategy is a variable whose value is a function ... with first-class functions,
pattern is invisible." Wlaschin reframes it as "using a function as a parameter ...
because functions are things" (`let doSomethingWith strategy x = strategy x`).

- **Genuinely equivalent** when the strategies differ only in behavior.
- **Objects still warranted** when a strategy needs to carry metadata/state -- that
  concerns objects, not the class hierarchy, and does not contradict the dissolution.

Sources: Norvig (primary), Wlaschin NDC London 2014 `youtube.com/watch?v=ucnWLfBA1dc`
(primary), `fsharpforfunandprofit.com/fppatterns/`.

### 3.2 Abstract Factory -> classes are first-class factories

When classes/types are first-class runtime values, the classes themselves serve as
factories; the parallel factory/product dual hierarchy the static (C++) version needs
disappears. Norvig: "The classes themselves serve as factories ... We can say
`make(c)`." The JS analog is just `new c(x, y)`.

- **Genuinely equivalent** for the pattern's core use.
- **Factory-like objects still useful** to *bundle* a family of related classes --
  Norvig's secondary caveat, not a contradiction.

Source: Norvig (primary); corroborated by *Fluent Python* ch06.

### 3.3 Decorator -> higher-order function wrapping

Keep the same interface and add behavior (e.g. logging) by wrapping a function with a
same-signature function -- HOF composition rather than a decorator class. Raganwald
defines a function decorator as a HOF returning a same-signature variation of its
argument (via `fn.apply(this, args)` to stay context-agnostic); it underlies Python's
`@decorator`. The only nuance is terminology ("composition" vs "HOF wrapping"); the
literature itself calls it composition.

Sources: Wlaschin (primary), `raganwald.com/2015/06/26/decorators-in-es6.html`.

### 3.4 Iterator -> generator functions (`function*`)

Generator functions define an iterative algorithm as a single function that returns a
Generator (an iterator), eliminating the manual internal-state bookkeeping of custom
iterator objects. MDN: "custom iterators ... require careful programming due to the
need to explicitly maintain their internal state. Generator functions provide a
powerful alternative." They evaluate lazily -- computing yielded values on demand --
which additionally lets them represent expensive or **infinite** sequences.

- **Genuinely equivalent** and language-native (stable ES2015+, universal support).
- Some sources frame the substitution driver as boilerplate/state-machine elimination,
  with laziness as the value-add rather than the defining reason.

Source: MDN Iterators and generators (primary).

### 3.5 General principle: a one-method interface is just a function

Wlaschin: "a one-method interface is really just a function ... functions [are]
interfaces automatically." Taking interface-segregation to the extreme yields
one-method interfaces, which are functions. Directly relevant to TS: an interface with
a single call signature is interchangeable with a function type (structural typing).
Corroborated by the SAM/functional-interface mechanisms that exist *because* the
equivalence holds (Java `@FunctionalInterface`, Kotlin `fun interface`, C# delegates).

Source: Wlaschin (primary) + broad cross-language corroboration.

---

## 4. Fowler *Refactoring* 2nd edition: functional-style refactorings

### 4.1 Replace Loop with Pipeline (#231, Moving Features)

A first-class named refactoring converting an imperative accumulator loop into a JS
Array collection pipeline.

```javascript
// Before
const names = [];
for (const i of input) {
  if (i.job === 'programmer') {
    names.push(i.name);
  }
}

// After
const names = input
  .filter(i => i.job === 'programmer')
  .map(i => i.name);
```

The conditional becomes `.filter()`; the projection becomes `.map()`. Mechanics:
start with **Extract Variable** on the loop's source collection, then move each loop
behavior into a named pipeline operation one at a time (filter = guard, map =
transform, reduce = accumulation, plus group/distinct). Fowler prefers the style for
readability -- "I can see the flow of logic as the elements ... pass through the
pipeline" -- and advises "clarity over performance, unless you have a measured,
significant performance problem."

- Minor imprecision: the operation vocabulary is *extensible*, not strictly fixed
  (Fowler composes custom ops), and he partly distances the "functional" label
  ("I used it heavily in Smalltalk").

Sources: `refactoring.com/catalog/replaceLoopWithPipeline.html`,
`martinfowler.com/articles/refactoring-pipelines.html` (both primary).

### 4.2 Other named catalog refactorings that shift under a functional/immutable style

Confirmed to exist as named catalog entries (existence/naming level -- full functional
mechanics not spelled out by surviving claims):

- **Combine Functions into Transform** (Ch. 6, a new 2nd-edition data-transformation
  refactoring; its `enrichReading` example uses `cloneDeep` to preserve source
  immutability).
- **Replace Temp with Query**
- **Separate Query from Modifier**
- **Split Phase**

Sources: `refactoring.com/catalog/` and the per-refactoring catalog pages (primary).

---

## 5. Kerievsky: de-patterning is first-class

*Refactoring to Patterns* treats pattern application as bidirectional and reversible:
refactor **to, towards, or away from** patterns. De-patterning is an explicit goal --
"refactor to Patterns when appropriate and away from Patterns when something simpler is
discovered." Patterns are best *evolved* by refactoring existing code, not designed up
front. The book carries a restraint heuristic: even a pattern the author favors
(Decorator) is usually unnecessary -- "many problem chunks of code simply don't need to
be refactored to use Decorator."

- Concrete "away-from" example: **Inline Singleton** (the counterpart to Limit
  Instantiation with Singleton), section "Refactoring to, towards, and away from
  Patterns" (p. 29) with a directional table.
- Not every pattern offers all three directions (27 refactorings, not 3x27).
- One sub-claim had mild quantifier strengthening flagged ("many" -> "most", rated
  medium) but is corroborated.

Sources: Kerievsky book PDF (`tarrani.net/RefactoringToPatterns.pdf`),
`industriallogic.com/refactoring-to-patterns/`, `martinfowler.com/books/r2p.html`.

This directly validates the skill's existing `Direction: Away` / de-patterning framing
(KRV-02, CCH-02): removing an unwarranted pattern is a first-class move in the source
literature, not an invention.

---

## 6. Not established by *this workflow run* (coverage gaps -- since resolved)

This records what the **verify workflow did not source** -- an honest snapshot of the
run's coverage, not the final word. **Every row below is now resolved in Section 10**
(2026-07-07 follow-up). Keep the two tiers of confidence distinct when citing:

- **Sections 2-5** -- workflow-verified (adversarial pass, primary sources).
- **Section 10** -- authoritative-but-not-adversarially-verified (synthesized from
  Norvig, Wlaschin, Redux/Elm, MDN, the TS handbook; settled textbook idioms).

| Pattern / item | Hypothesized functional idiom | Workflow-run status | Resolved |
|----------------|-------------------------------|---------------------|----------|
| Command | closure / thunk `() => void` | named by Norvig; idiom not sourced | S10 Q1 |
| Template Method | HOF taking step callbacks | named by Norvig; idiom not sourced | S10 Q1 |
| Visitor | fold / match over an ADT | named by Norvig; idiom not sourced | S10 Q1 |
| State | discriminated union + reducer | named by Norvig; idiom not sourced | S10 Q1 |
| Chain of Responsibility | reduced handler array | named by Norvig; idiom not sourced | S10 Q1 |
| Observer | callbacks / event streams | Norvig: method combination; idiom not sourced | S10 Q1 |
| Discriminated unions + exhaustive `switch` | State/Visitor replacement | no surviving evidence | S10 Q3 |
| `Object.freeze` / `readonly` | immutability / Memento | no surviving evidence | S10 Q3 |
| Modules-as-singletons | Singleton replacement | no surviving evidence | S10 Q3 |
| Which patterns remain genuinely OO-only | -- | not answered | S10 Q2 |
| "Equivalent vs. dissolves" boundary per pattern | -- | not answered | S10 Q1/Q2 |

Named-but-unsourced sources: the **Mostly Adequate Guide**, **Eric Elliott**, and the
**TypeScript handbook** produced no *verified* claims this run; they are cited as
corroboration (not workflow-confirmation) in Section 10, Q4.

---

## 7. Confidence and method caveats

- **Single-verifier basis.** Every surviving claim passed under the tiered scheme's
  minimum: primary sources needed only one confirming verifier vote. Confidence is
  "high" because the sources are primary/authoritative and several were mirror-
  corroborated -- not because multiple verifiers agreed. Weaker sources would have
  drawn the full 3-vote panel, but the confirmed set is primary-dominated.
- **Uneven coverage.** Firm idioms for four patterns (Strategy, Abstract Factory,
  Decorator, Iterator) + the one-method-interface principle + Replace Loop with
  Pipeline + existence of four other Fowler refactorings. Everything in Section 6 is
  open.
- **Time/generalization.** Norvig's study is 1996 Lisp/Dylan; applying it to JS/TS is
  sound but inferential (classes and functions are first-class in JS/TS).
- **Two mild interpretive stretches** flagged by verifiers: Kerievsky Decorator
  quantifier ("many" -> "most", medium); MDN generators "core capability" framing
  slightly exceeds literal text.

---

## 8. Open questions (next research round)

1. Concrete, source-backed JS/TS idioms for the remaining Norvig-named patterns --
   Command (closure/thunk), Template Method (HOF with step callbacks), Visitor
   (fold/pattern-match over an ADT), State (discriminated union + reducer), Chain of
   Responsibility (reduced handler array), Observer (event streams/callbacks) -- and
   when each is genuinely equivalent vs. a partial dissolution.
2. Which GoF patterns remain genuinely OO-only (do not dissolve under first-class
   functions/types), and what property makes them resistant?
3. What the TS/JS built-ins that obviate patterns look like in practice --
   discriminated unions + exhaustive switch (State/Visitor), `Object.freeze`/`readonly`
   immutability, modules-as-singletons, function composition/pipe.
4. Wlaschin's fuller treatment (F# for Fun and Profit) of State-as-reducer and
   Observer-as-event-stream, and whether the Mostly Adequate Guide, Eric Elliott, and
   the TypeScript handbook corroborate the reducer/ADT idioms hypothesized.

**These four are resolved in Section 10 below (2026-07-07 follow-up).**

---

## 9. Sources (21 fetched)

**Primary**
- `norvig.com/design-patterns/` -- Norvig, Design Patterns in Dynamic Languages (slides)
- `norvig.com/design-patterns/design-patterns.pdf` -- same, PDF
- `youtube.com/watch?v=ucnWLfBA1dc` -- Wlaschin, Functional Programming Design Patterns (NDC London 2014)
- `martinfowler.com/articles/refactoring-pipelines.html` -- Fowler, Refactoring with Loops and Collection Pipelines
- `refactoring.com/catalog/replaceLoopWithPipeline.html` -- Fowler catalog: Replace Loop with Pipeline
- `refactoring.com/catalog/` -- Fowler catalog index (+ combineFunctionsIntoTransform / replaceTempWithQuery / separateQueryFromModifier / splitPhase pages)
- `tarrani.net/RefactoringToPatterns.pdf` -- Kerievsky, Refactoring to Patterns (full text)
- `industriallogic.com/refactoring-to-patterns/` -- Kerievsky's company page
- `developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_generators` -- MDN

**Secondary**
- `oreilly.com/library/view/fluent-python/9781491946237/ch06.html` -- Fluent Python ch06
- `programmingtalks.org/talk/functional-programming-design-patterns-by-scott-wlaschin/`
- `martinfowler.com/books/r2p.html` -- Fowler's review of Refactoring to Patterns
- `informit.com/store/refactoring-to-patterns-9780321213358`

**Blog / community**
- `fsharpforfunandprofit.com/fppatterns/` -- Wlaschin
- `raganwald.com/2015/06/26/decorators-in-es6.html` -- Raganwald, function/method decorators
- `xp123.com/articles/nested-loops-to-functional-pipeline/`
- `github.com/kaiosilveira/replace-loop-with-pipeline-refactoring`
- `fullstory.com/blog/discriminated-unions-and-exhaustiveness-checking-in-typescript/`
- `github.com/MostlyAdequate/mostly-adequate-guide`
- `medium.com/javascript-scene/higher-order-functions-composing-software-5365cf2cbe99` -- Eric Elliott
- `dev.to/zelenya/functional-takes-on-gof-design-patterns-4jff`
- `blog.jooq.org/how-functional-programming-will-finally-do-away-with-the-gof-patterns/`

---

## 10. Resolution of the open questions (2026-07-07 follow-up)

> **Provenance note.** This section is synthesized from established, authoritative
> sources (Norvig; Wlaschin's *F# for Fun and Profit*; the Redux/Elm architecture; MDN;
> the TypeScript handbook) plus the run's confirmed findings. Unlike Sections 2-5 it did
> NOT pass the adversarial verify workflow -- these are settled, textbook FP-pattern
> equivalences rather than contested claims, so hand-resolution with citations and
> compileable code is appropriate. The TS snippets are strict-mode-shaped and
> illustrative; if promoted into skill content they should be run through the skill's
> `tsc --strict` checker first.

Shared helper used below:

```typescript
const assertNever = (x: never): never => {
  throw new Error(`Unhandled case: ${JSON.stringify(x)}`);
};
```

### Q1: Functional idioms for the six remaining Norvig-named patterns

**Command -> closure / thunk.** A command reifies a request; the closure IS the request.

```typescript
type Command = () => void;
const queue: Command[] = [];
queue.push(() => console.log('save'));
queue.forEach(run => run());

// Undo: a command returns its own inverse (a closure capturing what to reverse).
type Undoable = () => () => void;
const setName = (model: { name: string }, next: string): Undoable => () => {
  const prev = model.name;
  model.name = next;
  return () => { model.name = prev; };
};
```

*Equivalent* for invoke-later, queues, and macro (compose thunks). *Partial dissolution*
when you need a **serializable** command log (persist/replay across sessions): a closure
can't be serialized, so you fall back to a tagged data command (`{ type: 'setName',
next }`) interpreted by a reducer -- which is really the Command/Memento/State idioms
converging. Norvig: first-class functions.

**Template Method -> HOF taking the varying steps as parameters.**

```typescript
function report<T, R>(
  read: () => T,
  transform: (data: T) => R,
  format: (result: R) => string,
): string {
  return format(transform(read())); // the fixed skeleton
}
```

*Equivalent* when steps are independent. In FP, Template Method and Strategy **converge**
-- both become "pass functions"; the only difference is how many. *Partial dissolution*
when many hooks share protected state or there is deep hook granularity: pass a *record*
of callbacks (`{ read, transform, format }`), which is the boundary where "just a
function" grows back toward an object. Norvig: first-class functions.

**Visitor -> fold / exhaustive match over a discriminated union (ADT).**

```typescript
type Shape =
  | { kind: 'circle'; r: number }
  | { kind: 'rect'; w: number; h: number };

const area = (s: Shape): number => {
  switch (s.kind) {
    case 'circle': return Math.PI * s.r ** 2;
    case 'rect':   return s.w * s.h;
    default:       return assertNever(s);
  }
};
// A new operation is a new function; no accept()/visit() double-dispatch plumbing.
```

*Equivalent* on Visitor's own axis (add operations over a fixed element set), and it
removes the double-dispatch boilerplate. The **expression-problem** trade-off names the
"equivalent vs. dissolves" boundary exactly: ADT + fold makes adding *operations* cheap
but adding a new *case* edits every fold; OO Visitor makes adding operations cheap but a
new *element type* edits every visitor. They are mirror images -- pick the axis you
expect to grow. Norvig: first-class functions (he cites macros for the closely related
Interpreter/Iterator).

**State -> discriminated union + pure reducer.** The Redux/Elm architecture.

```typescript
type State =
  | { tag: 'idle' }
  | { tag: 'loading' }
  | { tag: 'done'; data: string }
  | { tag: 'error'; message: string };

type Event =
  | { type: 'fetch' }
  | { type: 'resolved'; data: string }
  | { type: 'rejected'; message: string };

const reduce = (state: State, event: Event): State => {
  switch (state.tag) {
    case 'idle':    return event.type === 'fetch' ? { tag: 'loading' } : state;
    case 'loading':
      if (event.type === 'resolved') return { tag: 'done', data: event.data };
      if (event.type === 'rejected') return { tag: 'error', message: event.message };
      return state;
    case 'done':
    case 'error':   return state;
    default:        return assertNever(state);
  }
};
```

*Equivalent* and usually clearer than State objects; illegal states become
unrepresentable and transitions are one pure function. *Partial dissolution* when states
own **side effects / long-lived services**: those move to a separate effects layer
(exactly why Redux adds middleware/thunks and Elm has commands). Norvig: first-class
types.

**Chain of Responsibility -> a reduced array of handler functions (or middleware).**

```typescript
type Handler<Req, Res> = (req: Req) => Res | undefined;
const handle = <Req, Res>(handlers: Handler<Req, Res>[], req: Req): Res | undefined =>
  handlers.reduce<Res | undefined>((result, h) => result ?? h(req), undefined);
```

*Equivalent* -- the `setNext` linked-list plumbing disappears into an array + `reduce`
(or `find`). The **richer** variant is `(req, next) => ...` middleware composition
(Koa/Express/Redux style) when each handler must pre- and post-process around the rest
of the chain -- that is Chain of Responsibility and Decorator merged into one idiom.
Norvig: first-class types.

**Observer -> callbacks / event streams.**

```typescript
type Listener<T> = (value: T) => void;
const createSubject = <T>() => {
  const listeners = new Set<Listener<T>>();
  return {
    subscribe: (l: Listener<T>) => { listeners.add(l); return () => listeners.delete(l); },
    next: (value: T) => listeners.forEach(l => l(value)),
  };
};
```

*Equivalent* for simple pub/sub; the returned unsubscribe closure replaces `detach()`.
Native substrates: `EventTarget` / `CustomEvent`, and async iterables (`for await...of`).
*Partial dissolution* for complex event graphs (map/filter/merge/debounce over time):
that wants **reactive streams** (RxJS `Observable`) -- a library, not a language
built-in. Norvig attributes Observer to *method combination* (a CLOS feature); in JS the
practical idiom is callbacks/streams.

### Q2: Which patterns stay genuinely OO-only, and the deciding property

The honest headline: **almost none are purely OO-only.** The deciding property is *what
the pattern's essence is*:

- **Behavior only -> dissolves into plain function(s).** No residual type needed.
  Strategy, Command, Template Method, Observer, Chain of Responsibility, Factory Method /
  Abstract Factory (factory functions), Facade (a module of functions).
- **Data / structure -> relocates to an ADT (de-classed, but still a typed structure).**
  Not a class hierarchy, but you still declare a discriminated union or recursive type.
  Visitor, State, Interpreter, Composite, Iterator (generators), Memento (an immutable
  snapshot -- immutability makes it nearly free).
- **Identity / mutable-sharing / resource -> keeps genuine OO residue.** These hinge on
  *object identity* or *coordinated mutable state*, which functions and values do not
  model: **Flyweight** (shares identity to save memory), **Proxy** (must be a real
  drop-in object reference for lazy/remote/access control on an OO API), **Mediator**
  (coordinates stateful colleagues addressed by identity). Stateful **Builder** and
  multi-method **Adapter/Decorator/Bridge** keep a thin object when the interface has
  many methods (a one-method interface is just a function -- Section 3.5 -- but an
  N-method one is an object).

So the smallest "genuinely OO-only" set is **Flyweight, Proxy, Mediator** (plus the
stateful/multi-method tails of Builder, Adapter, Decorator, Bridge). Everything else
either becomes a function or relocates into the type system.

> **Superseded 2026-07-07 -- see Section 11 "C resolved".** The focused research pass
> found these three also collapse (Flyweight -> memoization/interning; Proxy ->
> lazy-thunk/guard-HOF/async + native `Proxy`; Mediator -> reducer+store). No GoF pattern
> is strictly OO-only; the residue is a stateful closure, a language primitive, or an
> effect boundary -- all functionally expressible.

**Reconciliation with Norvig.** Norvig's 1996 "not simplified" 7 were Adapter, Bridge,
Composite, Decorator, Memento, Prototype, Singleton -- because he measured against
Lisp/Dylan mechanisms, not against ADT + exhaustive matching or pervasive immutability.
In modern TS those extra tools dissolve Composite/Memento (and, per the FP community,
Decorator) *further* than Norvig's list implies. Net: TS dissolves **more** than
Norvig's 16, and the residual-OO set is smaller than his residual 7.

### Q3: The TS/JS built-ins in practice

**Discriminated unions + exhaustive `switch`** (replaces State/Visitor hierarchies): the
`kind`/`tag` literal + a `default: assertNever(x)` arm. The `never` assignment fails to
compile if a case is unhandled -- compile-time exhaustiveness (see the `reduce`/`area`
examples above). Source: TypeScript handbook (Narrowing / Discriminated Unions,
exhaustiveness checking with `never`).

**`Object.freeze` vs `readonly`/`as const`** (replaces defensive copying, Memento,
mutable value objects):

```typescript
const frozen = Object.freeze({ a: 1 });      // runtime, SHALLOW
type Point = Readonly<{ x: number; y: number }>; // compile-time only, erased at runtime
const tuple = [1, 2] as const;                // deep readonly literal, compile-time
```

Key gotcha: `readonly`/`Readonly<T>`/`as const` are **erased at runtime** (compile-time
guarantees only); `Object.freeze` is a **shallow** runtime guarantee. For deep runtime
immutability you freeze recursively or use a library (Immer/immutable-js).

**Modules-as-singletons** (replaces Singleton): an ES module's bindings are evaluated
once and cached, so a module-level value *is* a process singleton -- no private
constructor + static accessor needed.

```typescript
// service.ts
export const service = createService(); // one instance, shared by every importer
```

This is the preferred replacement, consistent with the skill's Singleton leaf already
citing Dependency Injection as the alternative. Source: ES modules spec / MDN modules.

**Function composition / `pipe`** (underlies Replace Loop with Pipeline, Decorator,
Template Method): compose small functions so data flows through them. No native `pipe`
operator yet (the pipeline-operator proposal is not standardized), so it is either a
tiny helper or method chaining (`arr.filter(...).map(...)`).

### Q4: Source corroboration for the reducer / ADT / stream idioms

- **State-as-reducer:** the Redux docs ("Reducers", "Redux FAQ") and the Elm
  Architecture are the canonical primary sources; Wlaschin's *F# for Fun and Profit*
  ("Designing with types" series, "The State pattern") covers modelling state as a union
  and transitions as functions.
- **Observer-as-stream:** RxJS `Observable` docs; MDN `EventTarget` and async iterators.
- **Discriminated unions + exhaustiveness:** the TypeScript handbook (Narrowing) --
  primary and directly on-topic for the research question's TS focus.
- **Composition / HOFs:** the *Mostly Adequate Guide* (ch. 5 "Coding by Composing") and
  Eric Elliott's "Composing Software" series corroborate composition-as-structure; both
  were fetched in the run but yielded no *verified* claim, so they are cited here as
  corroboration, not as workflow-confirmed.

### Bottom line for the lz-refactor dual-paradigm decision

Every Tier-1 candidate from the dual-paradigm audit now has a concrete, idiomatic TS
functional form: Strategy/Command/Template Method/Observer/CoR reduce to functions;
State/Visitor relocate to discriminated-union + reducer/fold. The "when equivalent vs.
when it dissolves" boundary is well-defined per pattern (serialization for Command,
shared effects for State, the expression problem for Visitor, multi-method interfaces for
Decorator/Adapter). The genuinely OO-only residue is small (Flyweight, Proxy, Mediator).
This is enough to author functional "second examples" or `Functional alternative:` notes
for the behavior-and-data patterns with confidence. Flyweight/Proxy/Mediator are NOT
single-paradigm either -- Section 11 ("C resolved") documents their functional collapse
(memoization/interning; lazy-thunk/guard-HOF/async + native `Proxy`; reducer+store), so
every GoF pattern carries a functional attribution.

---

## 11. The disappearance map: pattern X -> FP idiom Y -> TS feature Z

This is the canonical form of the whole research: for each GoF pattern, **what makes it
disappear** -- the functional-programming idiom (**Y**) and/or the TypeScript
language/runtime feature (**Z**) that dissolves the need for the pattern. It is Norvig's
1996 thesis (Section 2) made TS-concrete, folding in the verified idioms (Sections 3-4),
the synthesized ones (Section 10), and the collapse labels (Q2 + #C).

**Verdict legend**
- **Dissolves** -- becomes plain function(s); no residual type.
- **Relocates** -- becomes an algebraic data type (discriminated union) + a fold/reducer;
  de-classed, but still a declared type (expression-problem trade-off applies).
- **Collapses -> P** -- no *distinct* functional form; becomes an already-mapped idiom P.
- **Stays OO? (pending C)** -- a candidate functional idiom exists but hinges on object
  identity / coordinated mutable state; final label pending the Section-6-C decision.

**Tier**: `verified` = passed the adversarial workflow (Sections 2-4); `synth` =
authoritative-but-not-workflow-verified (Section 10); `pending` = classification not yet
settled.

### Creational

| Pattern (X) | FP idiom (Y) | TS feature (Z) | Verdict | Tier |
|-------------|--------------|----------------|---------|------|
| Abstract Factory | a record of factory functions | first-class functions/values | Dissolves | verified |
| Factory Method | a factory function passed/returned (HOF) | first-class functions | Dissolves | synth |
| Builder | a pipe of immutable transforms / partial application | function composition, spread, optional params | Collapses -> pipe/composition | synth |
| Prototype | structural clone | object spread `{...}`, `Object.create`, `structuredClone` | Collapses -> spread-clone | synth (#C) |
| Singleton | a module-scoped value | ES module single-evaluation + cached bindings | Collapses -> module | synth |

### Structural

| Pattern (X) | FP idiom (Y) | TS feature (Z) | Verdict | Tier |
|-------------|--------------|----------------|---------|------|
| Decorator | higher-order function wrapping (same signature) | first-class functions, structural typing | Dissolves | verified |
| Adapter | wrapper closure (1-method) / delegating object literal (N-method) | structural typing, first-class functions | Dissolves (1-method) / OO residue (N-method) | synth |
| Bridge | inject the implementor as a function | first-class functions | Collapses -> Strategy | synth (#C) |
| Composite | recursive discriminated union + fold | discriminated unions + exhaustive `switch` (`never`) | Relocates (ADT) | synth |
| Facade | a module of functions over the subsystem | ES modules | Collapses -> module | synth |
| Flyweight | memoized / interning factory (closure over a cache) + partial application (intrinsic/extrinsic split) | `Map`/`WeakMap` (+`FinalizationRegistry`), `Symbol.for`, engine string-interning | Collapses -> memoization/interning | researched |
| Proxy | lazy thunk (virtual) / guard HOF == Decorator (protection) / async wrapper (remote) | memoizing getter, `#private`/`readonly`, `async`/`await`; native `Proxy` traps (transparent whole-object) | Collapses -> lazy-thunk / guard-HOF / async; Relocates -> native `Proxy` | researched |

### Behavioral

| Pattern (X) | FP idiom (Y) | TS feature (Z) | Verdict | Tier |
|-------------|--------------|----------------|---------|------|
| Strategy | a function-valued variable / function parameter | first-class functions | Dissolves | verified |
| Iterator | a generator / lazy sequence | `function*`, `Symbol.iterator`, `for...of` | Dissolves (language feature) | verified |
| Command | a closure / thunk `() => void` | closures, first-class functions | Dissolves | synth |
| Template Method | a HOF taking step callbacks | first-class functions | Dissolves | synth |
| Observer | a list of callbacks / an event stream | first-class functions; `EventTarget`, async iterables | Dissolves | synth |
| Chain of Responsibility | an array of handlers folded / middleware compose | `Array.prototype.reduce`, first-class functions | Dissolves | synth |
| State | a discriminated union + transition reducer | discriminated unions + exhaustive `switch` | Relocates (ADT) | synth |
| Visitor | a fold / pattern-match over an ADT | discriminated unions + exhaustive `switch` | Relocates (ADT) | synth |
| Interpreter | a discriminated-union AST + recursive evaluator | discriminated unions + exhaustive `switch` | Relocates (ADT) | synth |
| Memento | keep the previous immutable value (structural sharing) | `readonly`/`Object.freeze`/`as const` | Collapses -> immutable snapshot | synth |
| Mediator | central pure reducer + store/subscribe (Redux/Elm) | discriminated unions + exhaustive `switch`, closures | Collapses -> reducer + store | researched |

### C resolved (2026-07-07): the map is complete -- no pattern is genuinely OO-only

A focused three-source research pass (one per pattern, neutral brief, high confidence)
settled the last three cells. **None of Flyweight, Proxy, Mediator stays OO-only**; each
collapses into a functional idiom, with only a narrow, well-characterized residual core
that is itself functionally expressible (a closure-held cache, a language primitive, or an
effect boundary) -- never a hand-built class hierarchy:

- **Flyweight -> memoization / interning.** The intrinsic/extrinsic split is partial
  application; the sharing is a memoized/interning factory. *Fully dissolves* when the
  intrinsic state is an immutable primitive (the runtime already interns strings;
  `Symbol.for` is a built-in flyweight). Residual only when the shared value is a heavy
  compound object -- then a closure-held `Map`/`WeakMap` cache remains (side-effecting,
  but a closure, not a class).
- **Proxy -> lazy-thunk / guard-HOF / async-wrapper, per sub-kind** (virtual / protection /
  remote); the protection proxy is literally Decorator. The only part a closure cannot
  supply -- a transparent stand-in intercepting arbitrary property access on an existing
  object surface -- is absorbed by the **native `Proxy`** exotic object. So the *design*
  pattern dissolves; the *concept* survives as a language feature, not an OO class.
- **Mediator -> a central pure reducer + store/subscribe** (the Redux/Elm architecture);
  colleagues dispatch tagged events and pull derived state instead of referencing each
  other. Residual: coordinating long-lived stateful actors (sockets, hardware) by identity
  relocates to an effect interpreter + keyed registry (Elm `Cmd` / redux-saga) -- still
  functional, not an irreducible Mediator object. (The God-object risk transfers to the
  reducer.)

**Consequence:** all 23 GoF patterns now carry a `Y`/`Z` disappearance attribution. The
"Stays OO" bucket is empty; the residual OO concerns reduce to (a) a stateful closure
(Flyweight cache), (b) a runtime metaprogramming primitive (native `Proxy`), or (c) an
effect boundary (Mediator) -- each documented above as its own idiom.

---

## 12. Beyond GoF: Fowler / Kerievsky / extra-patterns, and the opposite direction

Extends the disappearance map from GoF patterns to the refactoring catalogs, and checks
the reverse (functional-only items lacking an OO alternative). **Headline: no catalog has
a genuinely "OO-only, no functional realization" set.** But for *refactorings* the residue
splits three ways -- and the reason differs from GoF.

### 12.1 extra-patterns-catalog -- all dissolve (no Stays-OO)

| Pattern (X) | FP idiom (Y) | TS feature (Z) | Verdict |
|---|---|---|---|
| Composed Method | small pure functions composed via `pipe` | function composition | Dissolves |
| Factory | factory function + lookup map | first-class functions, records | Dissolves |
| Creation Method | named factory function -> immutable record | first-class functions, `Readonly<T>` | Dissolves |
| Collecting Parameter | `reduce` with an immutable accumulator | `Array.prototype.reduce` | Collapses -> fold |
| Null Object | no-op function default / absent-value type | first-class functions; union / `Option` | Collapses -> no-op fn / `Option` |

These overlap Kerievsky (Composed Method == Compose Method; Collecting Parameter == Move
Accumulation to Collecting Parameter; Null Object == Introduce Null Object; Factory/Creation
Method == the factory refactorings). In the functional-catalog: **one leaf per idiom,
cross-linked from both** -- never duplicated.

### 12.2 Kerievsky -- no true Stays-OO

Every Kerievsky refactoring targets a GoF pattern (or Fowler primitive); since all those
dissolve, each inherits a functional analog ("refactor toward the *functional* form":
Strategy -> function, State -> reducer, Visitor -> fold, Observer -> callbacks, the Factory
family -> factory functions, the Composite family -> recursive DU + fold). The transformation
is re-shaped, not blocked. **Lone residue: multi-method Adapter** (Extract Adapter / Unify
Interfaces with Adapter), where a wrapper object survives an N-method interface.

### 12.3 Fowler -- firmed up by adversarial pass (2026-07-07)

An adversarial pass (neutral brief: *try to find an FP analog for each*) refuted an earlier
"13 Stays-OO" classification. Reconciled 3-way, classified by **intent** (does an FP
transformation reach the same goal?):

- **Moot -- FP baseline (3):** Change Reference to Value; Remove Setting Method; Replace
  Superclass with Delegate. Immutability / value-equality / composition are FP defaults, so
  the refactoring does not arise. No leaf.
- **FP-avoids via data modeling -- no distinct idiom (8):** Pull Up / Push Down Method + Field;
  Pull Up Constructor Body; Extract Superclass; Collapse Hierarchy; Remove Subclass. Intent is
  reached through ADT/record reshaping + Extract Function; FP has no inheritance hierarchy, so
  "pull up to a superclass" never happens *as such*. **No dedicated leaf** -- the map notes the
  data-modeling realization.
- **Distinct FP idiom -> leaf / cross-link (4):** Replace Subclass with Delegate -> **Strategy**
  (function field; cross-link, no new leaf); Change Value to Reference -> **normalized store**
  (id + `Map<Id,Entity>`; same substrate as Mediator); Hide Delegate -> **selector / lens**;
  Remove Middle Man -> inline selector (inverse).

Plus (from the earlier analysis): **~10 FP-analog refactorings get full leaves** -- Replace
Type Code with Subclasses -> discriminated union; Replace Conditional with Polymorphism -> DU
+ exhaustive `switch`; Replace Primitive with Object -> branded type; Combine Functions into
Class -> module/closure; Extract/Inline Class -> split/merge module; Move Field -> record
field; Replace Constructor with Factory Function -> factory fn; Replace Function <-> Command ->
closure/function -- and **3 light "Functional note" entries** (Encapsulate Variable/Record ->
opaque type; Encapsulate Collection -> `ReadonlyArray` + pure ops).

**Bar caveat:** under a strict *procedural* reading ("the same mechanical step on a class
hierarchy"), the 8 hierarchy refactorings are trivially OO-only (inapplicable without classes)
-- but then their FP "analog" is a separately-named refactoring, not a rendering of the same
one. We classify by intent, so they are "FP-avoids," not "OO-only." **True OO-only count: 0.**

**Paradigm-neutral Fowler (~32):** already ship functional-style examples (standalone
functions), so #A is met; they are NOT de-patternings and stay OUT of the functional-catalog.
The only in-place fix is re-rendering the 3 class-based leaves (Replace Temp / Derived Variable
/ Parameter with Query) functionally. Whether to ALSO add OO twins is the separate,
still-open **dual-paradigm-examples decision** (standing recommendation: do not blanket-dualize;
FUT-02).

### 12.4 The opposite direction -- functional-only items lacking an OO alternative

- **Currently, only two functional-native items**, and both are near-symmetric already:
  **Combine Functions into Transform** is deliberately paired with its OO sibling **Combine
  Functions into Class**; **Replace Command with Function** <-> **Replace Function with Command**
  is a bidirectional pair. The **one genuine asymmetry** is **Replace Loop with Pipeline**,
  which has **no canonized inverse** ("Replace Pipeline with Loop") -- the de-functionalizing
  direction the coach needs for the over-/under-engineering balance (CCH-02) when a pipeline is
  over-clever or perf-critical. *Recommendation:* add a "reverse direction / when a loop is
  clearer" note inside the existing leaf rather than inventing a non-Fowler refactoring.
- **Per the plan, the functional-catalog is symmetric by construction** -- every functional leaf
  derives from and cross-links to an OO source, so none lacks an OO version. Deeper: **FP idioms
  are many-to-one** (DU + fold subsumes Visitor + State + Interpreter + Composite; composition/pipe
  subsumes Decorator + Chain of Responsibility + Template Method), so a functional idiom's "OO
  alternative" is *plural* -- the coach must use expression-problem guidance to pick which OO
  pattern to introduce. A coach-behavior (CCH) requirement, not a missing leaf.
- **Out of scope -- native FP patterns** (Option/Either, functor/monad, lenses, currying/partial
  application, transducers) have no OO ancestor and are NOT in the catalogs. If ever added, their
  OO alternatives mostly already exist here (Option <-> Null Object; functor <-> Iterator;
  memoization <-> Flyweight; free-monad/effects <-> Command + Interpreter) or as non-pattern OO
  idioms (Either <-> exceptions; lens <-> setters; currying <-> constructor injection/Builder).
  Keep them out -- a general FP-patterns catalog would be a separate future skill (cf. FUT-04).
- **Meta:** the functional-catalog (dissolve) and the OO catalogs + Kerievsky "refactor to X"
  (introduce) form ONE bidirectional de-patterning map -- exactly what CCH-02 needs. The balance
  holds at the smell level too: **Speculative Generality** drives the de-pattern direction while
  the tangled-conditional / duplication smells drive the introduce direction. The only incomplete
  axis is loop <-> pipeline.

### 12.5 Layout policy (same leaf vs. separate leaves)

Deciding question: is the functional version a *different artifact* or the *same refactoring*
rendered two ways?

- **Pattern <-> FP idiom (de-patterning) -> SEPARATE leaves** (functional-catalog + OO leaf,
  cross-linked). Forced by: different concepts; the FP idiom is many-to-one (cannot live inside
  one pattern's leaf); preserves the ratified GoF 5-section contract + progressive disclosure.
- **Same refactoring, two idiomatic renderings -> SAME leaf** (a second `## Example` or a
  "variant" note). Rare in practice, since paradigm-neutral leaves already ship a functional
  example; reserve for the few where both genuinely teach and for re-rendering the 3 class-based
  Fowler leaves.

### 12.6 Provenance

Section 12.3 Fowler split was firmed by an adversarial verification pass; 12.1/12.2 and the
12.4 opposite-direction analysis are reasoned from the GoF resolution + the audits (not
adversarially verified). Same tier as Section 10: authoritative-but-not-workflow-verified.
Section 12.7 is a higher tier -- web-researched.

### 12.7 Replace Pipeline with Loop -- is the reverse direction justified? (web-researched)

Two parallel research passes (neutral confirm/reject briefs) grounded the "reverse
direction" note flagged in 12.4. **Both angles confirm, with qualification.**

**Performance -- Confirm-with-qualification.** In JS/V8, imperative loops are measurably
faster than chained array pipelines in *tight, large-N, trivial-body* hot paths -- roughly
1.3x-3.5x in credible microbenchmarks. Dominant cause: each `.filter().map()` stage
allocates a throwaway intermediate array and re-walks the data; secondary: per-element
callback/closure overhead (largely but not fully closed by TurboFan inlining) and deopt
risks (megamorphic callbacks, HOLEY arrays). The pathological case is spread-in-reduce
(`[...acc, x]`) -- O(n^2), avoid unconditionally. It matters at N ~1e5-1e7+ with trivial
per-element work (numeric loops, render/game frames, million-row data); it is negligible in
ordinary app code (dozens-to-thousands of elements), where clarity wins. Fowler's rule
stands: reverse to a loop only on a *measured* hot path, not on folklore.
Middle grounds that keep functional style: collapse the chain into a single `reduce`/
`for-of` (recovers the ~1.3-1.6x chaining penalty, drops the intermediate array); use
short-circuiting builtins (`find`/`some`/`every`) when the only reason for a loop was early
exit; typed arrays for pure numeric loops.

**Non-performance / house-style -- Qualified confirm.** De-pipelining is a recognized
legitimate refactoring independent of speed. Fowler explicitly names it as the inverse of
Replace Loop with Pipeline (he rarely does it, but acknowledges it) and makes *clarity the
acceptance test*: if the pipeline is not clearer than the loop, revert. Other
authority-backed motivations: debuggability (loops step/breakpoint cleanly; pipeline stages
-- especially reduce/collectors -- often have nowhere to breakpoint); early-exit
(`break`/`return` map awkwardly onto pipeline operators -- Fowler shows the friction);
paradigm/house-style conformance (Principle of Least Astonishment -- match the surrounding
idiom, with the "foolish consistency" caveat); and de-patterning an over-applied idiom
(Kerievsky refactor-away). Counter-position: pipelines remove the mutable-accumulator /
off-by-one surface and scale better in readability as stages accrete -- keep the pipeline
for clean multi-stage transforms.

**Skill implication:** the Replace Loop with Pipeline leaf should carry a "reverse
direction" note covering BOTH cases -- (a) a *measured* performance hot path (with the
intermediate-array / early-exit mechanism and the single-reduce / typed-array middle
grounds), and (b) clarity/debuggability/early-exit/house-style -- framed as "clarity is the
default; reverse only for a concrete, named reason." This is the one genuine
functional->imperative asymmetry in the catalog (12.4).

**Sources (dates noted -- engine behavior shifts):**
- `v8.dev/blog/elements-kinds` (V8 team, 2017) -- PACKED vs HOLEY arrays; one-way elements-kind transitions.
- `benediktmeurer.de/2017/07/14/faster-collection-iterators/` (V8 engineer) -- callback/closure overhead, TurboFan inlining, prefer `for-of`.
- `mrale.ph/talks/goto2016/` (V. Egorov) -- inline caches; monomorphic vs megamorphic; why JS microbenchmarks mislead.
- `dev.to/alexander-nenashev/avoid-intermediate-arrays-in-js-5bkg` (Chrome 124 / Firefox 126, ~2024) -- filter+map ~1.3-1.55x slower than a single reduce; spread-in-reduce O(n^2).
- `leanylabs.com/blog/js-foreach-map-reduce-vs-for-for_of/` (Node 14, ~2021) -- ~3-3.5x loop-vs-method multipliers at 1M elements.
- `martinfowler.com/articles/refactoring-pipelines.html` -- names the inverse refactoring; clarity-as-acceptance-test; break/return friction; side-effect caveat.
- `jetbrains.com/guide/java/tips/debugging-streams/` -- debuggability of pipelines vs loops.

Provenance: web-researched (two neutral confirm/reject passes) -- higher evidence tier than 12.1-12.5.

---

## 13. Functional-catalog design spec (LOCKED 2026-07-07)

Ratified by a two-round advisor board (three lenses: skill architecture, coaching pedagogy,
cross-catalog consistency). Round 2 was unanimous **RATIFY-WITH-NIT at HIGH confidence**; both
open points resolved 3/0. This is the build spec for the functional-catalog (planned Phase 8.2).

### 13.1 Organization

- **One catalog `functional-catalog/`** covering BOTH de-patterning idioms (the FP renderings of
  GoF / Kerievsky / Fowler-analog patterns) AND native FP patterns (Option/Either, functor/monad,
  lens, currying/partial application, transducers), unified as "an FP idiom + its OO correspondence,
  differing only by direction."
- **By IDIOM, not per-pattern** (~17 leaves: ~12 de-patterning idioms + ~5 native). Many OO patterns
  map to ONE idiom leaf (Visitor/State/Interpreter/Composite -> "Discriminated union + fold").
- **Shape aligned to the Kerievsky sibling leaf** (selector + metadata header + body) -- NOT a bespoke
  shape, NOT the GoF 5-section. Book-freedom removes prose-mirroring, not the repo's structural
  conventions (a leading selector, a thin README-mirror, a checker gate, `tsc --strict`).

### 13.2 Locked leaf template

```
# <idiom name>

Use when: <one-line smell/trigger; mirrored verbatim in the README index>
Correspondence: dissolves-from | alternative-to  ->  [OO pattern(s)](links: gof / kerievsky / extra-patterns)
Keep the OO form when: <identity | coordinated mutable state | measured hot path | new-variant churn (expression problem) | house style>

## Idiom
FP idiom (Y) + TS feature (Z), 1-2 lines.

## Example
Before (OO) -> After (idiom), tsc --strict-clean, behavior-preserving by construction
(pure, same inputs -> outputs; ideally mirroring the linked refactoring's domain).
Same behavior; mechanics: <cross-link to the Fowler/Kerievsky refactoring>, run tests between steps.

## When each fits
Idiom-specific boundary; for a multi-pattern (N:1) idiom, exactly ONE capped residual line
per served pattern (stable anchor, locked format) carrying its expression-problem flip;
plus the explicit reverse transformation where relevant (e.g. Replace Pipeline with Loop).
1:1 idioms get no per-pattern split.
```

### 13.3 README contract

- An **N:1 pattern -> idiom MAP** that **declares this contract in a header** (the sibling READMEs are
  1:1 selector-mirrors; this one fans many rows into one leaf).
- Still **mirrors each leaf's `Use when:`** selector; **note cells capped to one line**.
- Rows for ALL 23 GoF + Kerievsky + Fowler-analog + native idioms; each resolves to an idiom leaf OR
  a one-line note.
- **Moot/FP-default + FP-avoids-via-data-modeling entries are one-line NOTES, not leaves** (a leaf
  requires a real `tsc --strict` Example).
- A **`## Sources`** block cites this research artifact -- the no-oracle correctness anchor.
- Each OO catalog leaf (gof / kerievsky / extra) gains a one-line **`Functional alternative:`**
  cross-link to its idiom leaf.

### 13.4 `check-functional` spec (replaces oracle-fidelity as the correctness anchor)

1. **Selector-mirror**, generalized to N:1 -- each README row mirrors its leaf's `Use when:`.
2. **`Correspondence:`** = closed enum `{dissolves-from | alternative-to}` + resolvable pattern link(s).
3. **Bidirectional link integrity spanning gof + kerievsky + extra-patterns** (Correspondence targets
   are NOT GoF-only): every OO leaf's `Functional alternative:` resolves to an idiom leaf, and every
   `Correspondence:` link resolves back.
4. **Per-pattern residual lines**: stable anchor ids + a locked parseable format; the checker resolves
   README-row -> intra-leaf residual anchor (not just file-to-file), with a **hard cap of one line per
   served pattern** enforced.
5. **`tsc --strict`** on every Example; examples **pure / same-I/O** so Before->After is
   behavior-preserving by construction (tsc checks types, not equivalence).
6. **Moot / data-modeling entries** are one-line README notes, not leaves.
7. **`## Sources`** cites the committed research artifact.

### 13.5 Provenance

Two advisor-board rounds. Round 1: all three lenses returned MODIFY, converged on by-idiom + the
Kerievsky-aligned shape + the anchor-swap. Round 2: unanimous RATIFY-WITH-NIT at HIGH confidence;
R1 (mechanics via cross-link, no duplicated `## Mechanics`) and R2 (capped per-pattern residual only
where it differs) both ACCEPT 3/0; the architecture lens reversed its round-1 README-row position.
The residual nits are folded into 13.4.
