# Code Smells index (unified taxonomy: Fowler 2nd ed Ch.3 + Kerievsky Ch.4)

Scope: the unified bad-smell taxonomy. It gathers Fowler's 24 smells (Refactoring, 2nd ed, Ch.3) with
Kerievsky's Ch.4 smells (Refactoring to Patterns) folded in and deduplicated against them. This index
is NAVIGATION ONLY: per smell, a recognize-by cue and a link to its leaf. It deliberately carries NO
candidate refactorings, so a coach must open the smell leaf to confirm the match and see the
smell-to-refactoring map. Scan the recognize-by cues for a fuzzy match, then follow the link to
confirm.

Source tags: an untagged smell is Fowler-only (Ch.3); `[both]` marks a smell named by both Fowler and
Kerievsky (a Ch.4 overlap folded onto the existing Fowler leaf); `[Kerievsky]` marks a
Kerievsky-unique Ch.4 smell with no Fowler equivalent.

### Mysterious Name

Recognize by: a name that makes you stop and work out what it refers to, or that points you the wrong way. ([leaf](smells/mysterious-name.md))

### Duplicated Code [both]

Recognize by: the same or nearly-identical code structure appearing in more than one place. ([leaf](smells/duplicated-code.md))

### Long Function [both]

Recognize by: a function long enough that you have to scan it to understand what it does. ([leaf](smells/long-function.md))

### Long Parameter List

Recognize by: a parameter list long enough that callers struggle to get the arguments in the right order. ([leaf](smells/long-parameter-list.md))

### Global Data

Recognize by: data reachable and writable from anywhere in the program, with no single owner. ([leaf](smells/global-data.md))

### Mutable Data

Recognize by: data updated in place, where one update can surprise code elsewhere that shares it. ([leaf](smells/mutable-data.md))

### Divergent Change

Recognize by: one module you keep editing for several unrelated reasons. ([leaf](smells/divergent-change.md))

### Shotgun Surgery [both]

Recognize by: one kind of change forcing many small edits scattered across many modules. ([leaf](smells/shotgun-surgery.md))

### Feature Envy

Recognize by: a function that talks to another module's data far more than to its own. ([leaf](smells/feature-envy.md))

### Data Clumps

Recognize by: the same few data items appearing together in field lists and parameter lists. ([leaf](smells/data-clumps.md))

### Primitive Obsession [both]

Recognize by: bare primitives standing in for concepts that deserve their own type. ([leaf](smells/primitive-obsession.md))

### Repeated Switches [both]

Recognize by: the same switch (or if/else chain) on the same value showing up in several places. ([leaf](smells/repeated-switches.md))

### Loops

Recognize by: a loop, or a reduce or accumulator that buckets items into a Map or object under a key, whose real intent (filter, map, sum, group-by) is buried in bookkeeping. ([leaf](smells/loops.md))

### Lazy Element [both]

Recognize by: a program element that does too little to justify its own existence. ([leaf](smells/lazy-element.md))

### Speculative Generality

Recognize by: machinery built for a flexibility that was anticipated but never needed. ([leaf](smells/speculative-generality.md))

### Temporary Field

Recognize by: a field that only holds a meaningful value some of the time. ([leaf](smells/temporary-field.md))

### Message Chains

Recognize by: a client hopping object-to-object (`a.b().c().d()`) to reach what it wants. ([leaf](smells/message-chains.md))

### Middle Man

Recognize by: a class whose methods mostly just forward to another object. ([leaf](smells/middle-man.md))

### Insider Trading

Recognize by: modules that reach into each other's private detail and trade it back and forth. ([leaf](smells/insider-trading.md))

### Large Class [both]

Recognize by: a class trying to do too much, with too many fields and methods. ([leaf](smells/large-class.md))

### Alternative Classes with Different Interfaces [both]

Recognize by: classes that do interchangeable jobs but expose them through mismatched interfaces. ([leaf](smells/alternative-classes-with-different-interfaces.md))

### Data Class

Recognize by: a class that is all fields and accessors, with no behavior of its own. ([leaf](smells/data-class.md))

### Refused Bequest

Recognize by: a subclass that uses little of what it inherits, or overrides it to do nothing. ([leaf](smells/refused-bequest.md))

### Comments

Recognize by: comments used to explain code that should have been made clear on its own. ([leaf](smells/comments.md))

## Kerievsky-unique smells (Refactoring to Patterns, Ch.4)

These four Ch.4 smells have no Fowler Ch.3 equivalent; their candidate refactorings live mostly in the
Kerievsky catalog. (The other Ch.4 smells overlap Fowler's and are folded onto the Fowler leaves above,
tagged `[both]`.)

### Conditional Complexity [Kerievsky]

Recognize by: branching logic that has grown tangled over time: conditionals that select behavior, layer on optional extras, and drive state changes, all accreting in one place. ([leaf](smells/conditional-complexity.md))

### Indecent Exposure [Kerievsky]

Recognize by: classes, constructors, or methods that ought to be hidden are publicly reachable, leaking implementation detail callers should never see. ([leaf](smells/indecent-exposure.md))

### Combinatorial Explosion [Kerievsky]

Recognize by: a pile of near-identical methods or branches that each handle one combination of the same few options: an unnamed mini-language spelled out by hand. ([leaf](smells/combinatorial-explosion.md))

### Oddball Solution [Kerievsky]

Recognize by: one problem solved one consistent way almost everywhere, but handled differently in a few odd spots. ([leaf](smells/oddball-solution.md))

## Sources

- Fowler, *Refactoring: Improving the Design of Existing Code*, 2nd ed, Ch.3 (bad smells in code).
  Smell names and the recognize-by cues are distilled in original words (no verbatim prose; DST-04).
- Kerievsky, *Refactoring to Patterns*, Ch.4 (code smells). Kerievsky's Ch.4 smells are folded into
  this taxonomy and deduplicated against Fowler's: overlapping smells are tagged `[both]` on the
  existing Fowler leaf (with an "also named by Kerievsky" note), and four Kerievsky-unique smells have
  their own leaves. Distilled in original words (no verbatim prose; DST-04).
