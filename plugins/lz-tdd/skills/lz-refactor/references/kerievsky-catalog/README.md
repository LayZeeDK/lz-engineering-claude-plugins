# Kerievsky Catalog (Refactoring to Patterns) -- index

Scope: all 27 Kerievsky pattern-directed refactorings, grouped by their book chapter. Coach mode
routes a structural / pattern-directed smell here; reference mode looks up a named Kerievsky
refactoring here. This is a THIN index -- entry content lives in per-refactoring leaf files, never
inlined here (SKEL-04). Kerievsky refactorings compose named Fowler primitives, so this catalog builds
on the Fowler catalog (`../fowler-catalog/`), authored first.

Direction: `To` = the refactoring completes the named pattern; `To/Towards` = it completes the pattern
and also supports a keepable partial adoption (stop at the pattern-ready intermediate, or carry on to
the full pattern); `Away` = it de-patterns (retreats from the named pattern); `n/a` = a utility that
targets no GoF pattern, so direction does not apply.

## Ch.6 -- Creation

| Refactoring | Direction | GoF pattern | Use when |
|---|---|---|---|
| [Replace Constructors with Creation Methods](replace-constructors-with-creation-methods.md) | To | Creation Method (Kerievsky's own pattern; not one of the GoF 23) | a class has several constructors, or constructor calls whose arguments do not reveal which kind of instance you are asking for. |
| [Move Creation Knowledge to Factory](move-creation-knowledge-to-factory.md) | To | Factory | the knowledge of which concrete type to build, and how to wire it, is sprawled across the collaborator classes that produce or hold these objects. |
| [Encapsulate Classes with Factory](encapsulate-classes-with-factory.md) | To | Factory | clients instantiate a family of related concrete classes directly, and you would rather they depend only on a shared interface plus one factory. |
| [Introduce Polymorphic Creation with Factory Method](introduce-polymorphic-creation-with-factory-method.md) | To | Factory Method | sibling subclasses each carry a near-identical method that differs only in the object it creates. |
| [Encapsulate Composite with Builder](encapsulate-composite-with-builder.md) | Away | Builder | clients build a Composite by hand -- creating nodes and wiring parent to child -- and that assembly is verbose and easy to get wrong. |
| [Inline Singleton](inline-singleton.md) | Away | Singleton | a class is a Singleton, but its single-instance policy and global access are hiding a dependency and making the callers hard to test. |

## Ch.7 -- Simplification

| Refactoring | Direction | GoF pattern | Use when |
|---|---|---|---|
| [Compose Method](compose-method.md) | To | Composed Method (Beck's pattern; not one of the GoF 23) | a method mixes high-level flow with low-level detail, so you must read every line to follow what it does. |
| [Replace Conditional Logic with Strategy](replace-conditional-logic-with-strategy.md) | To/Towards | Strategy | a conditional selects between whole algorithms, and you want to vary or extend those algorithms independently of the code that runs them. |
| [Move Embellishment to Decorator](move-embellishment-to-decorator.md) | To/Towards | Decorator | a class carries optional extras behind flags or conditionals, and those extras clutter its core responsibility. |
| [Replace State-Altering Conditionals with State](replace-state-altering-conditionals-with-state.md) | To/Towards | State | conditionals scattered through a class both decide what it may do now and choose which state it moves to next. |
| [Replace Implicit Tree with Composite](replace-implicit-tree-with-composite.md) | To | Composite | a tree is represented with nested primitives or ad-hoc structures, and traversing it means special-casing leaves against branches everywhere. |
| [Replace Conditional Dispatcher with Command](replace-conditional-dispatcher-with-command.md) | To/Towards | Command | a switch or if/else chain selects and runs an action by name or code, and the set of actions keeps changing. |

## Ch.8 -- Generalization

| Refactoring | Direction | GoF pattern | Use when |
|---|---|---|---|
| [Form Template Method](form-template-method.md) | To | Template Method | two subclasses run the same sequence of steps in the same order but each spells the individual steps out itself, so the shared skeleton is duplicated. |
| [Extract Composite](extract-composite.md) | To | Composite | sibling classes in a hierarchy each repeat the same code for holding and iterating child objects. |
| [Replace One/Many Distinctions with Composite](replace-one-many-distinctions-with-composite.md) | To | Composite | code keeps branching on whether it is handling a single object or a collection of them, and you need to combine those objects in richer ways than a flat list allows. |
| [Replace Hard-Coded Notifications with Observer](replace-hard-coded-notifications-with-observer.md) | To/Towards | Observer | a class notifies a fixed, named set of dependents by calling each one directly whenever its state changes. |
| [Unify Interfaces with Adapter](unify-interfaces-with-adapter.md) | To/Towards | Adapter | clients want to treat two classes the same way, but the classes expose different interfaces and one of them you cannot change. |
| [Extract Adapter](extract-adapter.md) | To | Adapter | one class supports several versions or variants of an external thing, and the version-specific code is spreading through its methods as conditionals. |
| [Replace Implicit Language with Interpreter](replace-implicit-language-with-interpreter.md) | To | Interpreter | a class keeps growing methods for each combination of the same few conditions, spelling out by hand a small language it never names. |

## Ch.9 -- Protection

| Refactoring | Direction | GoF pattern | Use when |
|---|---|---|---|
| [Replace Type Code with Class](replace-type-code-with-class.md) | n/a | Class / type-safe value (non-GoF) | a field holds one of a fixed set of bare codes (a string or number) that nothing stops callers from getting wrong. |
| [Limit Instantiation with Singleton](limit-instantiation-with-singleton.md) | To | Singleton | profiling shows that many identical instances of a shareable object are wasting memory or construction time, and a single shared instance would serve every caller. |
| [Introduce Null Object](introduce-null-object.md) | To | Null Object (non-classic-GoF) | the same "is it absent?" check is repeated across call sites, each supplying the same default behavior when it is. |

## Ch.10 -- Accumulation

| Refactoring | Direction | GoF pattern | Use when |
|---|---|---|---|
| [Move Accumulation to Collecting Parameter](move-accumulation-to-collecting-parameter.md) | To | Collecting Parameter (non-GoF) | one long method builds up a result by hand, and you want to spread the work across several methods without each returning a piece to stitch together. |
| [Move Accumulation to Visitor](move-accumulation-to-visitor.md) | Away | Visitor | code accumulates a result by iterating a mixed collection and branching on each element's type, and that type-branching keeps growing. |

## Ch.11 -- Utilities

| Refactoring | Direction | GoF pattern | Use when |
|---|---|---|---|
| [Chain Constructors](chain-constructors.md) | n/a | n/a -- utility | several creation paths for the same class repeat the same object-building steps. |
| [Unify Interfaces](unify-interfaces.md) | n/a | n/a -- utility | a superclass and its subclass (or two related types you own) should present the same interface, but one lacks a method the other has, forcing clients to distinguish them. |
| [Extract Parameter](extract-parameter.md) | n/a | n/a -- utility | a class builds one of its fields from a value it creates internally, but callers need to supply that value instead. |

## Sources

- Kerievsky, *Refactoring to Patterns*, Ch.6-11 (the catalog of pattern-directed refactorings). Names,
  intents, mechanics, and examples are distilled in original words with original TS/JS (no verbatim
  prose or code; DST-04). GoF pattern names are vocabulary only.
- The Direction values are transcribed from the book's Refactoring Directions table; `To/Towards`
  marks the six refactorings the table lists under both columns, and `n/a` marks the four utilities
  the table does not place under any pattern.
