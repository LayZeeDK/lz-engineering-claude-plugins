# Functional Catalog (de-patterning idioms + native FP) -- index

Scope: the functional renderings of the OO patterns and pattern-directed refactorings (how a GoF
pattern, a Kerievsky refactoring, or a Fowler FP-analog dissolves into a functional idiom) AND the
native FP patterns offered alongside an OO alternative (Option/Either, functor/monad, lens/optics,
currying/partial application, transducers). Coach mode routes a de-patterning or functional-alternative
decision here; reference mode looks up a named idiom here. This is a THIN index -- entry content lives
in per-idiom leaf files, never inlined here (SKEL-04). Every TypeScript Example is `tsc --strict`-clean.

N:1 contract: unlike the sibling catalogs (gof / kerievsky / extra-patterns), whose READMEs are 1:1
selector-mirrors of one leaf per row, THIS index is an N:1 pattern -> idiom map -- many OO patterns and
refactorings fan into one idiom leaf (for example Visitor / State / Interpreter / Composite all map to
Discriminated Union and Fold). Each map row still mirrors its target leaf's `Use when:` selector
verbatim, and each note cell is capped to one line. A row that names a served pattern of an N:1 leaf
targets that pattern's residual anchor inside the leaf (`<slug>.md#<pattern-anchor>`); a 1:1 row targets
the bare leaf (`<slug>.md`).

The `Correspondence` value on each leaf is the closed enum `dissolves-from` (an OO pattern dissolves
into this idiom) or `alternative-to` (a native FP idiom offered alongside an OO alternative). Each
gof / kerievsky / extra-patterns leaf carries a one-line `Functional alternative:` cross-link to its
idiom leaf, and each idiom leaf's `Correspondence:` links back (bidirectional integrity).

## Pattern -> idiom map

Every dissolvable source item resolves to an idiom leaf below. The `Correspondence` cell states how the
target leaf relates to the source: `dissolves-from` when the OO structure disappears into the idiom,
`alternative-to` when the idiom is a native FP option offered beside the OO form. Fowler refactorings
whose intent is a functional default, is reached by data reshaping, or is a light one-line adjustment do
not resolve to a leaf -- they are the one-line notes under `## Notes`.

### GoF patterns (23)

| OO pattern | Correspondence | Idiom leaf | Use when |
|---|---|---|---|
| Abstract Factory | dissolves-from | [Factory Function](factory-function.md#abstract-factory) | construction logic is spread across factory classes or subclasses, and choosing what to build is really a lookup by a variant key. |
| Builder | dissolves-from | [Function Composition](function-composition.md#builder) | behavior is built by wrapping or sequencing same-shaped steps, and you want to vary the order or set of steps without a wrapper class per step. |
| Factory Method | dissolves-from | [Factory Function](factory-function.md#factory-method) | construction logic is spread across factory classes or subclasses, and choosing what to build is really a lookup by a variant key. |
| Prototype | dissolves-from | [Structural Clone](structural-clone.md) | you want a fresh value seeded from an existing one and would rather copy its data than route creation through a clone method on a class. |
| Singleton | dissolves-from | [Module Namespace](module-namespace.md#singleton) | a class exists only to provide one shared instance or to group related operations, and a module of functions would carry the same contract. |
| Adapter | dissolves-from | [First-Class Function](first-class-function.md#adapter) | an object exists only to carry a single method, and you want to pass, return, or swap that behavior as a value. |
| Bridge | dissolves-from | [First-Class Function](first-class-function.md#bridge) | an object exists only to carry a single method, and you want to pass, return, or swap that behavior as a value. |
| Composite | dissolves-from | [Discriminated Union and Fold](discriminated-union-and-fold.md#composite) | a type hierarchy or a chain of conditionals selects behavior by variant, and you add operations more often than variants. |
| Decorator | dissolves-from | [Function Composition](function-composition.md#decorator) | behavior is built by wrapping or sequencing same-shaped steps, and you want to vary the order or set of steps without a wrapper class per step. |
| Facade | dissolves-from | [Module Namespace](module-namespace.md#facade) | a class exists only to provide one shared instance or to group related operations, and a module of functions would carry the same contract. |
| Flyweight | dissolves-from | [Memoization and Interning](memoization-and-interning.md) | many uses want the same immutable value and you would rather share one copy by key than allocate a fresh one every time. |
| Proxy | dissolves-from | [Thunk and Lazy Value](thunk-and-lazy-value.md#proxy) | you need to defer, queue, or memoize a single operation, and a command or proxy object exists only to hold that one deferred call. |
| Chain of Responsibility | dissolves-from | [Function Composition](function-composition.md#chain-of-responsibility) | behavior is built by wrapping or sequencing same-shaped steps, and you want to vary the order or set of steps without a wrapper class per step. |
| Command | dissolves-from | [Thunk and Lazy Value](thunk-and-lazy-value.md#command) | you need to defer, queue, or memoize a single operation, and a command or proxy object exists only to hold that one deferred call. |
| Interpreter | dissolves-from | [Discriminated Union and Fold](discriminated-union-and-fold.md#interpreter) | a type hierarchy or a chain of conditionals selects behavior by variant, and you add operations more often than variants. |
| Iterator | dissolves-from | [Generator](generator.md) | you need sequential access to a series of values and want the traversal produced lazily rather than materialized up front. |
| Mediator | dissolves-from | [Reducer and Store](reducer-and-store.md) | several components coordinate through a central object and you want their state transitions to be pure, replayable, and testable in isolation. |
| Memento | dissolves-from | [Immutable Snapshot](immutable-snapshot.md) | you need to save a value so you can return to it later -- undo, rollback, time-travel -- and the value is already immutable. |
| Observer | dissolves-from | [Observer Callbacks](observer-callbacks.md) | one object needs to tell an open-ended set of interested parties that something changed, and those parties should not be coupled to the notifier's concrete type. |
| State | dissolves-from | [Discriminated Union and Fold](discriminated-union-and-fold.md#state) | a type hierarchy or a chain of conditionals selects behavior by variant, and you add operations more often than variants. |
| Strategy | dissolves-from | [First-Class Function](first-class-function.md#strategy) | an object exists only to carry a single method, and you want to pass, return, or swap that behavior as a value. |
| Template Method | dissolves-from | [Function Composition](function-composition.md#template-method) | behavior is built by wrapping or sequencing same-shaped steps, and you want to vary the order or set of steps without a wrapper class per step. |
| Visitor | dissolves-from | [Discriminated Union and Fold](discriminated-union-and-fold.md#visitor) | a type hierarchy or a chain of conditionals selects behavior by variant, and you add operations more often than variants. |

### Kerievsky refactorings (27)

Each Kerievsky refactoring inherits the idiom leaf -- and, for an N:1 leaf, the residual anchor -- of the
GoF pattern it targets. The three Ch.11 utilities map to the nearest idiom (A4: no checker exemption).

| Kerievsky refactoring | Correspondence | Idiom leaf | Use when |
|---|---|---|---|
| Replace Constructors with Creation Methods | dissolves-from | [Factory Function](factory-function.md#creation-method) | construction logic is spread across factory classes or subclasses, and choosing what to build is really a lookup by a variant key. |
| Move Creation Knowledge to Factory | dissolves-from | [Factory Function](factory-function.md#factory) | construction logic is spread across factory classes or subclasses, and choosing what to build is really a lookup by a variant key. |
| Encapsulate Classes with Factory | dissolves-from | [Factory Function](factory-function.md#factory) | construction logic is spread across factory classes or subclasses, and choosing what to build is really a lookup by a variant key. |
| Introduce Polymorphic Creation with Factory Method | dissolves-from | [Factory Function](factory-function.md#factory-method) | construction logic is spread across factory classes or subclasses, and choosing what to build is really a lookup by a variant key. |
| Encapsulate Composite with Builder | dissolves-from | [Function Composition](function-composition.md#builder) | behavior is built by wrapping or sequencing same-shaped steps, and you want to vary the order or set of steps without a wrapper class per step. |
| Inline Singleton | dissolves-from | [Module Namespace](module-namespace.md#singleton) | a class exists only to provide one shared instance or to group related operations, and a module of functions would carry the same contract. |
| Compose Method | dissolves-from | [Function Composition](function-composition.md#composed-method) | behavior is built by wrapping or sequencing same-shaped steps, and you want to vary the order or set of steps without a wrapper class per step. |
| Replace Conditional Logic with Strategy | dissolves-from | [First-Class Function](first-class-function.md#strategy) | an object exists only to carry a single method, and you want to pass, return, or swap that behavior as a value. |
| Move Embellishment to Decorator | dissolves-from | [Function Composition](function-composition.md#decorator) | behavior is built by wrapping or sequencing same-shaped steps, and you want to vary the order or set of steps without a wrapper class per step. |
| Replace State-Altering Conditionals with State | dissolves-from | [Discriminated Union and Fold](discriminated-union-and-fold.md#state) | a type hierarchy or a chain of conditionals selects behavior by variant, and you add operations more often than variants. |
| Replace Implicit Tree with Composite | dissolves-from | [Discriminated Union and Fold](discriminated-union-and-fold.md#composite) | a type hierarchy or a chain of conditionals selects behavior by variant, and you add operations more often than variants. |
| Replace Conditional Dispatcher with Command | dissolves-from | [Thunk and Lazy Value](thunk-and-lazy-value.md#command) | you need to defer, queue, or memoize a single operation, and a command or proxy object exists only to hold that one deferred call. |
| Form Template Method | dissolves-from | [Function Composition](function-composition.md#template-method) | behavior is built by wrapping or sequencing same-shaped steps, and you want to vary the order or set of steps without a wrapper class per step. |
| Extract Composite | dissolves-from | [Discriminated Union and Fold](discriminated-union-and-fold.md#composite) | a type hierarchy or a chain of conditionals selects behavior by variant, and you add operations more often than variants. |
| Replace One/Many Distinctions with Composite | dissolves-from | [Discriminated Union and Fold](discriminated-union-and-fold.md#composite) | a type hierarchy or a chain of conditionals selects behavior by variant, and you add operations more often than variants. |
| Replace Hard-Coded Notifications with Observer | dissolves-from | [Observer Callbacks](observer-callbacks.md) | one object needs to tell an open-ended set of interested parties that something changed, and those parties should not be coupled to the notifier's concrete type. |
| Unify Interfaces with Adapter | dissolves-from | [First-Class Function](first-class-function.md#adapter) | an object exists only to carry a single method, and you want to pass, return, or swap that behavior as a value. |
| Extract Adapter | dissolves-from | [First-Class Function](first-class-function.md#adapter) | an object exists only to carry a single method, and you want to pass, return, or swap that behavior as a value. |
| Replace Implicit Language with Interpreter | dissolves-from | [Discriminated Union and Fold](discriminated-union-and-fold.md#interpreter) | a type hierarchy or a chain of conditionals selects behavior by variant, and you add operations more often than variants. |
| Replace Type Code with Class | dissolves-from | [Branded Type](branded-type.md) | a primitive carries meaning the compiler should enforce -- an id, a unit, a validated string -- and you want that guarantee without allocating a wrapper object. |
| Limit Instantiation with Singleton | dissolves-from | [Module Namespace](module-namespace.md#singleton) | a class exists only to provide one shared instance or to group related operations, and a module of functions would carry the same contract. |
| Introduce Null Object | alternative-to | [Option and Either](option-and-either.md) | a value may be absent or a call may fail, and callers keep guarding with null checks or try/catch before they can use the result. |
| Move Accumulation to Collecting Parameter | dissolves-from | [Function Composition](function-composition.md#collecting-parameter) | behavior is built by wrapping or sequencing same-shaped steps, and you want to vary the order or set of steps without a wrapper class per step. |
| Move Accumulation to Visitor | dissolves-from | [Discriminated Union and Fold](discriminated-union-and-fold.md#visitor) | a type hierarchy or a chain of conditionals selects behavior by variant, and you add operations more often than variants. |
| Chain Constructors | dissolves-from | [Factory Function](factory-function.md#factory) | construction logic is spread across factory classes or subclasses, and choosing what to build is really a lookup by a variant key. |
| Unify Interfaces | dissolves-from | [First-Class Function](first-class-function.md#adapter) | an object exists only to carry a single method, and you want to pass, return, or swap that behavior as a value. |
| Extract Parameter | alternative-to | [Currying and Partial Application](currying-and-partial-application.md) | several calls share the same leading arguments, and you keep threading the same configuration through every call or assembling it with a builder. |

### Extra patterns (5)

| Extra pattern | Correspondence | Idiom leaf | Use when |
|---|---|---|---|
| Null Object | alternative-to | [Option and Either](option-and-either.md) | a value may be absent or a call may fail, and callers keep guarding with null checks or try/catch before they can use the result. |
| Factory | dissolves-from | [Factory Function](factory-function.md#factory) | construction logic is spread across factory classes or subclasses, and choosing what to build is really a lookup by a variant key. |
| Creation Method | dissolves-from | [Factory Function](factory-function.md#creation-method) | construction logic is spread across factory classes or subclasses, and choosing what to build is really a lookup by a variant key. |
| Composed Method | dissolves-from | [Function Composition](function-composition.md#composed-method) | behavior is built by wrapping or sequencing same-shaped steps, and you want to vary the order or set of steps without a wrapper class per step. |
| Collecting Parameter | dissolves-from | [Function Composition](function-composition.md#collecting-parameter) | behavior is built by wrapping or sequencing same-shaped steps, and you want to vary the order or set of steps without a wrapper class per step. |

### Fowler FP-analog refactorings (15)

The FP-analog subset of the Fowler catalog folds into existing idiom leaves through these rows only --
Fowler leaves carry no `Functional alternative:` line (D-10). The paradigm-neutral Fowler refactorings
already ship functional-style examples and stay out of this catalog.

| Fowler refactoring | Correspondence | Idiom leaf | Use when |
|---|---|---|---|
| Replace Type Code with Subclasses | dissolves-from | [Discriminated Union and Fold](discriminated-union-and-fold.md) | a type hierarchy or a chain of conditionals selects behavior by variant, and you add operations more often than variants. |
| Replace Conditional with Polymorphism | dissolves-from | [Discriminated Union and Fold](discriminated-union-and-fold.md) | a type hierarchy or a chain of conditionals selects behavior by variant, and you add operations more often than variants. |
| Replace Primitive with Object | dissolves-from | [Branded Type](branded-type.md) | a primitive carries meaning the compiler should enforce -- an id, a unit, a validated string -- and you want that guarantee without allocating a wrapper object. |
| Combine Functions into Class | dissolves-from | [Module Namespace](module-namespace.md) | a class exists only to provide one shared instance or to group related operations, and a module of functions would carry the same contract. |
| Extract Class | dissolves-from | [Module Namespace](module-namespace.md) | a class exists only to provide one shared instance or to group related operations, and a module of functions would carry the same contract. |
| Inline Class | dissolves-from | [Module Namespace](module-namespace.md) | a class exists only to provide one shared instance or to group related operations, and a module of functions would carry the same contract. |
| Replace Constructor with Factory Function | dissolves-from | [Factory Function](factory-function.md#factory) | construction logic is spread across factory classes or subclasses, and choosing what to build is really a lookup by a variant key. |
| Replace Function with Command | dissolves-from | [Thunk and Lazy Value](thunk-and-lazy-value.md#command) | you need to defer, queue, or memoize a single operation, and a command or proxy object exists only to hold that one deferred call. |
| Replace Command with Function | dissolves-from | [First-Class Function](first-class-function.md) | an object exists only to carry a single method, and you want to pass, return, or swap that behavior as a value. |
| Replace Subclass with Delegate | dissolves-from | [First-Class Function](first-class-function.md) | an object exists only to carry a single method, and you want to pass, return, or swap that behavior as a value. |
| Replace Loop with Pipeline | dissolves-from | [Function Composition](function-composition.md) | behavior is built by wrapping or sequencing same-shaped steps, and you want to vary the order or set of steps without a wrapper class per step. |
| Combine Functions into Transform | dissolves-from | [Function Composition](function-composition.md) | behavior is built by wrapping or sequencing same-shaped steps, and you want to vary the order or set of steps without a wrapper class per step. |
| Hide Delegate | alternative-to | [Lens and Optics](lens-and-optics.md) | reading or updating a value buried several levels deep in immutable data forces long access chains and hand-written copy-on-write spreads. |
| Remove Middle Man | alternative-to | [Lens and Optics](lens-and-optics.md) | reading or updating a value buried several levels deep in immutable data forces long access chains and hand-written copy-on-write spreads. |
| Change Value to Reference | alternative-to | [Normalized Store](normalized-store.md) | the same entity is copied into many records, and an edit to one copy silently fails to reach the others. |

### Native FP idioms (alternative-to, 6)

Native FP idioms offered ALONGSIDE an OO alternative rather than dissolving one. Each links to the OO
form it competes with; two carry mutual back-links (Null Object, Extract Parameter), the rest are reached
by the OO alternative's own dissolution leaf or via the Fowler rows above.

| OO alternative | Correspondence | Idiom leaf | Use when |
|---|---|---|---|
| Null Object; exceptions | alternative-to | [Option and Either](option-and-either.md) | a value may be absent or a call may fail, and callers keep guarding with null checks or try/catch before they can use the result. |
| Iterator | alternative-to | [Functor and Monad](functor-and-monad.md) | you keep unwrapping a container, applying one step, and re-wrapping it by hand at every stage of a transformation. |
| Hide Delegate, Remove Middle Man (Fowler) | alternative-to | [Lens and Optics](lens-and-optics.md) | reading or updating a value buried several levels deep in immutable data forces long access chains and hand-written copy-on-write spreads. |
| Builder; Extract Parameter | alternative-to | [Currying and Partial Application](currying-and-partial-application.md) | several calls share the same leading arguments, and you keep threading the same configuration through every call or assembling it with a builder. |
| Replace Loop with Pipeline (Fowler) | alternative-to | [Transducers](transducers.md) | a chain of map and filter over a large collection allocates a fresh intermediate array at every stage, and those passes show up in a profile. |
| Change Value to Reference (Fowler); Mediator | alternative-to | [Normalized Store](normalized-store.md) | the same entity is copied into many records, and an edit to one copy silently fails to reach the others. |

## Notes (Fowler: moot / data-modeling / light)

Fowler refactorings whose intent is a functional default (immutability, value equality, composition),
is reached through data/ADT reshaping rather than a dedicated idiom, or is a light one-line adjustment
appear here as one-line notes with NO idiom leaf -- a leaf requires a real `tsc --strict` Example. Names
are reconciled against the shipped `../fowler-catalog/` leaf filenames (A5).

Moot / FP-baseline (the intent is already the default, so the refactoring does not arise):

- Change Reference to Value -- values are immutable by default, so there is no shared mutable object to fold back into a value.
- Remove Setting Method -- records are built whole and never mutated after construction, so no setter exists to remove.
- Replace Superclass with Delegate -- behavior is shared by composing functions and records, so there is no superclass to convert into a delegate.

FP-avoids-via-data-modeling (the intent is reached by reshaping records or unions, not by an inheritance hierarchy):

- Pull Up Method -- shared behavior is a function that takes the record, so there is no hierarchy to lift a method into.
- Push Down Method -- variant-specific behavior lives in a branch of the fold over the union, not in a subclass to push into.
- Pull Up Field -- common data is a shared record field or the base of an intersection type, reshaped rather than inherited.
- Push Down Field -- variant-specific data lives on the matching union member, selected by the value's shape rather than a subclass.
- Pull Up Constructor Body -- construction is a plain function, so shared setup is a helper call, not a superclass constructor to hoist.
- Extract Superclass -- shared structure is captured by a common record type or a union, not by extracting a parent class.
- Collapse Hierarchy -- there is no class hierarchy to collapse; variants are members of one discriminated union.
- Remove Subclass -- a redundant variant is dropped from the union and its fold branch, not from a subclass.

Light functional notes (a one-line data adjustment, no dedicated idiom):

- Move Field -- a field moves by reshaping the record types that hold it, a plain data edit with no accessor ceremony.
- Encapsulate Variable -- shared state is reached through functions, and a value that needs a guarantee becomes an opaque or branded type (Encapsulate Record folds in here too).
- Encapsulate Collection -- expose a ReadonlyArray and return new collections from pure operations instead of handing out a mutable one.

## Sources

- `.planning/research/functional-depatterning-ts.md` Sections 10-13 -- the LOCKED design source of
  record for this catalog (the pattern -> FP-idiom -> TS-feature disappearance map, the full-corpus
  Stays-OO analysis, the board-ratified leaf template, and the N:1 map). This phase has no owned book
  oracle (D-06); the committed research artifact plus `check-functional` plus `tsc --strict` are the
  correctness anchor. Idioms, examples, and prose are original words with original TypeScript -- no
  verbatim book or artifact prose or code (DST-04).
