# Fowler Catalog (Refactoring, 2nd ed) -- index

Scope: the 62 Fowler refactorings, grouped by their book chapter. Coach mode routes a mechanical
smell here; reference mode looks up a named refactoring here. This is a THIN index -- each row is a
name, its 1st-ed alias(es), and the leaf's `Use when:` line; the mechanics and example live in the
per-refactoring leaf file, never inlined here.

Provenance legend:

- `[web-only]` -- present in the online catalog and verified against the web edition, not in the
  2nd-ed print/e-book (the sole such entry is Return Modified Value).

## Ch.6 -- a first set of refactorings (the basic set)

| Refactoring | 1st-ed aliases | Use when |
|---|---|---|
| [Extract Function](extract-function.md) | Extract Method | a fragment of code can be understood on its own and given a name that says what it does, not how. |
| [Inline Function](inline-function.md) | Inline Method | a function's body is as clear as its name, or a set of poorly-factored functions is easier to reorganize once merged back inline. |
| [Extract Variable](extract-variable.md) | Introduce Explaining Variable | an expression is hard to read, and naming a sub-expression would explain its role. |
| [Inline Variable](inline-variable.md) | Inline Temp | a variable's name says no more than the expression it holds, and it gets in the way of further refactoring. |
| [Change Function Declaration](change-function-declaration.md) | Add Parameter, Remove Parameter, Rename Function, Rename Method, Change Signature | a function's name does not reveal its purpose, or its parameter list is wrong for how it is used. |
| [Encapsulate Variable](encapsulate-variable.md) | Encapsulate Field, Self-Encapsulate Field | data with a wide scope -- especially mutable, shared, or global data -- is read and written directly, and you want one place to control that access. |
| [Rename Variable](rename-variable.md) | -- | a variable's name does not convey what it holds, and a clearer name would capture what you now understand. |
| [Introduce Parameter Object](introduce-parameter-object.md) | -- | the same group of arguments travels together through several functions (a data clump). |
| [Combine Functions into Class](combine-functions-into-class.md) | -- | several functions operate closely on the same piece of data and keep passing it around. |
| [Combine Functions into Transform](combine-functions-into-transform.md) | -- | several functions derive extra values from the same source record, and the source is not updated after the fact. |
| [Split Phase](split-phase.md) | -- | one block of code does two distinct things in sequence -- typically it prepares some data and then computes a result from it. |

## Ch.7 -- encapsulation

| Refactoring | 1st-ed aliases | Use when |
|---|---|---|
| [Encapsulate Record](encapsulate-record.md) | Replace Record with Data Class | a mutable record (a plain data structure) is passed around widely and you want to control access to it and hide how it stores its data. |
| [Encapsulate Collection](encapsulate-collection.md) | -- | a class exposes a collection field, so callers can add to or remove from it behind the owning class's back. |
| [Replace Primitive with Object](replace-primitive-with-object.md) | Replace Data Value with Object, Replace Type Code with Class | a primitive value has started to carry meaning -- it needs formatting, validation, or related behavior that is duplicating itself around the code. |
| [Replace Temp with Query](replace-temp-with-query.md) | -- | a temporary variable holds the result of an expression, and you want that value reachable from other methods or to clear the way for extracting a function. |
| [Extract Class](extract-class.md) | -- | a class is doing the work of two -- a subset of its fields and the methods that use them form a cohesive unit that could stand on its own. |
| [Inline Class](inline-class.md) | -- | a class no longer pulls its weight -- often the leftover of a refactoring that moved most of its features elsewhere. |
| [Hide Delegate](hide-delegate.md) | -- | a client reaches through an object to call a method on one of its fields, coupling the client to that delegate's structure. |
| [Remove Middle Man](remove-middle-man.md) | -- | a class has grown so many simple delegating methods that the forwarding itself is the burden, and clients would be clearer talking to the delegate directly. |
| [Substitute Algorithm](substitute-algorithm.md) | -- | you have found a clearer way to do what a block of code already does, and want to swap the whole approach rather than tweak the old one. |

## Ch.8 -- moving features between objects

| Refactoring | 1st-ed aliases | Use when |
|---|---|---|
| [Move Function](move-function.md) | Move Method | a function talks to elements in another context more than to those in its own home. |
| [Move Field](move-field.md) | -- | a field is used more by another record than the one that currently holds it, or fields that change together live apart. |
| [Move Statements into Function](move-statements-into-function.md) | -- | the same statements always run alongside a call to a function, so they belong inside it. |
| [Move Statements to Callers](move-statements-to-callers.md) | -- | statements once common to every caller of a function now need to vary between them. |
| [Replace Inline Code with Function Call](replace-inline-code-with-function-call.md) | -- | inline code does the same thing as a function that already exists. |
| [Slide Statements](slide-statements.md) | Consolidate Duplicate Conditional Fragments | related code is scattered, and moving statements together would make it clearer or set up another refactoring. |
| [Split Loop](split-loop.md) | -- | a single loop does two different things, so you cannot change one without understanding the other. |
| [Replace Loop with Pipeline](replace-loop-with-pipeline.md) | -- | a loop walks a collection through steps -- filtering, mapping, accumulating -- that a collection pipeline would state more directly. |
| [Remove Dead Code](remove-dead-code.md) | -- | code is no longer executed or referenced -- an unused variable, function, parameter, or branch. |

## Ch.9 -- organizing data

| Refactoring | 1st-ed aliases | Use when |
|---|---|---|
| [Split Variable](split-variable.md) | Remove Assignments to Parameters, Split Temporary Variable | a local variable is assigned more than once for two different purposes, rather than as a loop counter or a collecting temp. |
| [Rename Field](rename-field.md) | -- | a record or class field's name no longer says what it holds. |
| [Replace Derived Variable with Query](replace-derived-variable-with-query.md) | -- | a variable stores a value that could be computed from other data, kept in sync by update code. |
| [Change Reference to Value](change-reference-to-value.md) | -- | a small nested object is shared and mutated in place, but would be simpler treated as an immutable value. |
| [Change Value to Reference](change-value-to-reference.md) | -- | many copies of the same conceptual entity exist as separate value objects, but they should be one shared object. |

## Ch.10 -- simplifying conditional logic

| Refactoring | 1st-ed aliases | Use when |
|---|---|---|
| [Decompose Conditional](decompose-conditional.md) | -- | a conditional's test or branches are complex enough that their intent is hard to read. |
| [Consolidate Conditional Expression](consolidate-conditional-expression.md) | -- | several separate conditional checks all lead to the same result or action. |
| [Replace Nested Conditional with Guard Clauses](replace-nested-conditional-with-guard-clauses.md) | -- | nested conditionals make the normal path of execution hard to pick out. |
| [Replace Conditional with Polymorphism](replace-conditional-with-polymorphism.md) | -- | a conditional chooses behavior by type or kind, and that variation could be expressed with subclasses. |
| [Introduce Special Case](introduce-special-case.md) | Introduce Null Object | many callers check for the same special value of a field and then all react the same way. |
| [Introduce Assertion](introduce-assertion.md) | -- | a section of code works only if some condition holds, but that assumption is left implicit. |

## Ch.11 -- refactoring APIs

| Refactoring | 1st-ed aliases | Use when |
|---|---|---|
| [Separate Query from Modifier](separate-query-from-modifier.md) | -- | a function both returns a value and changes observable state, so callers cannot ask the question without causing the effect. |
| [Parameterize Function](parameterize-function.md) | Parameterize Method | several functions carry out the same logic differing only in a few literal values. |
| [Remove Flag Argument](remove-flag-argument.md) | Replace Parameter with Explicit Methods | a boolean or enum argument makes a function switch between distinct behaviors. |
| [Preserve Whole Object](preserve-whole-object.md) | -- | a caller pulls several values out of one object just to pass them into a function. |
| [Replace Parameter with Query](replace-parameter-with-query.md) | Replace Parameter with Method | a function is passed a value it could work out for itself from its other inputs or state. |
| [Replace Query with Parameter](replace-query-with-parameter.md) | -- | a function reaches out to global state or a wide reference that would be better passed in. |
| [Remove Setting Method](remove-setting-method.md) | -- | a field should be set once at creation and never changed afterward. |
| [Replace Constructor with Factory Function](replace-constructor-with-factory-function.md) | Replace Constructor with Factory Method | a constructor's limits get in the way -- you want a name that says intent, to return a subtype, or to avoid forcing callers to use `new`. |
| [Replace Function with Command](replace-function-with-command.md) | Replace Method with Method Object | a function is intricate enough -- lots of local state, or wanting to be broken up -- that turning it into an object would help. |
| [Replace Command with Function](replace-command-with-function.md) | -- | a command object does little more than run one function, so the class is just overhead. |
| [Return Modified Value [web-only]](return-modified-value.md) | -- | a function updates a value by mutating it in place, and the code would read more clearly if it returned the new value instead. |

## Ch.12 -- dealing with inheritance

| Refactoring | 1st-ed aliases | Use when |
|---|---|---|
| [Pull Up Method](pull-up-method.md) | -- | two or more subclasses carry methods that do the same thing, so the behavior belongs on the shared parent. |
| [Pull Up Field](pull-up-field.md) | -- | sibling subclasses each declare a field that holds the same thing. |
| [Pull Up Constructor Body](pull-up-constructor-body.md) | -- | subclass constructors begin with the same setup steps. |
| [Push Down Method](push-down-method.md) | -- | a method on the superclass is relevant to only one subclass (or a few), not all of them. |
| [Push Down Field](push-down-field.md) | -- | a field on the superclass is used by only one subclass (or a few), not all of them. |
| [Replace Type Code with Subclasses](replace-type-code-with-subclasses.md) | Extract Subclass; Replace Type Code with State/Strategy | a type-code field drives behavior through conditionals, or gates fields that only apply to certain values. |
| [Remove Subclass](remove-subclass.md) | Replace Subclass with Fields | a subclass has thinned out until it does too little to earn its place in the hierarchy. |
| [Extract Superclass](extract-superclass.md) | -- | two classes share fields and behavior that mark them as variants of one idea. |
| [Collapse Hierarchy](collapse-hierarchy.md) | -- | a superclass and its subclass have grown so alike that the separation no longer earns its keep. |
| [Replace Subclass with Delegate](replace-subclass-with-delegate.md) | -- | subclasses vary one aspect of an object, but inheritance is too rigid -- the axis changes at runtime, or you need to vary more than one thing at once. |
| [Replace Superclass with Delegate](replace-superclass-with-delegate.md) | Replace Inheritance with Delegation | a subclass inherits from a superclass that is not a true "is a" fit -- it uses only part of the parent, or the parent's interface leaks operations that make no sense on the child. |
