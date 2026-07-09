# GoF Design Patterns Catalog: index

Scope: all 23 Gang-of-Four design patterns, grouped by family (Creational / Structural /
Behavioral). Coach mode routes a pattern-directed decision here to name the target pattern to move
toward (or away from); reference mode looks up a named GoF pattern here. This is a THIN index.
Entry content lives in per-pattern leaf files, never inlined here (SKEL-04). Each leaf follows the
locked 5-section contract: Intent, Applicability, Consequences, Example, Related patterns. The
selector shown against each entry is that leaf's Applicability first line, mirrored verbatim.

## Creational

Patterns that abstract how objects are instantiated, decoupling a client from the concrete classes
it creates.

| Pattern | Applicability |
|---|---|
| [Abstract Factory](abstract-factory.md) | Use it when a system must work with one of several interchangeable families of related products and must guarantee that products from the same family are used together. |
| [Builder](builder.md) | Use it when the algorithm for assembling a complex object should be independent of the parts the object is made of and how they are put together. |
| [Factory Method](factory-method.md) | Use it when a class cannot anticipate the class of objects it must create and wants its subclasses to specify them. |
| [Prototype](prototype.md) | Use it when a system should be independent of how its products are created and represented, and new products are best specified by cloning a configured instance. |
| [Singleton](singleton.md) | Use it when there must be exactly one instance of a class and it must be reachable from a well-known access point. |

## Structural

Patterns that compose classes and objects into larger structures while keeping those structures
flexible and efficient.

| Pattern | Applicability |
|---|---|
| [Adapter](adapter.md) | Use it when you need an existing class to fit an interface it was not built for. |
| [Bridge](bridge.md) | Use it when both an abstraction and its implementation should be extensible by subclassing independently, so neither hierarchy is locked to the other. |
| [Composite](composite.md) | Use it when you want to model a part-whole hierarchy and let clients ignore whether they are dealing with one object or a group of them. |
| [Decorator](decorator.md) | Use it when you want to give particular objects extra behavior at run time without changing the other objects of their class. |
| [Facade](facade.md) | Use it when most clients need only the common, default behavior of a complex subsystem and would be better served by one simple entry point. |
| [Flyweight](flyweight.md) | Use it when an application uses a very large number of objects whose memory cost is only bearable once most of their state is shared. |
| [Proxy](proxy.md) | Use it whenever there is a need for a more versatile or sophisticated reference to an object than a plain pointer. |

## Behavioral

Patterns that assign responsibilities between objects and describe how they communicate and
distribute control.

| Pattern | Applicability |
|---|---|
| [Chain of Responsibility](chain-of-responsibility.md) | Use it when more than one object may handle a request and the handler is not known in advance but should be determined automatically. |
| [Command](command.md) | Use it when you want to parameterize objects by an action to perform, treating the action itself as a value you can pass around. |
| [Interpreter](interpreter.md) | Use it when there is a simple language to interpret and you can represent its sentences as abstract syntax trees. |
| [Iterator](iterator.md) | Use it when you want to access an aggregate object's contents without exposing its internal representation. |
| [Mediator](mediator.md) | Use it when a group of objects talk to each other along many tangled paths that are hard to trace and to change. |
| [Memento](memento.md) | Use it when a snapshot of an object's state must be saved so the object can be restored to it later, and a direct interface to that state would expose implementation details and break encapsulation. |
| [Observer](observer.md) | Use it when a change to one object requires changing others, and you do not know how many objects need to change. |
| [State](state.md) | Use it when an object's behavior depends on its state and it must change its behavior at run time depending on that state. |
| [Strategy](strategy.md) | Use it when many related classes differ only in their behavior, so that one configurable class can be given a choice of behaviors instead. |
| [Template Method](template-method.md) | Use it to implement the invariant parts of an algorithm once and leave the varying parts to subclasses. |
| [Visitor](visitor.md) | Use it when an object structure contains many classes of objects with differing interfaces and you want to perform operations on them that depend on their concrete classes. |

## Sources

- Gamma, Helm, Johnson, Vlissides, *Design Patterns: Elements of Reusable Object-Oriented Software*,
  Ch.3 Creational, Ch.4 Structural, Ch.5 Behavioral. Intents, applicability, consequences, and
  examples are distilled in original words with original TypeScript (no verbatim prose or code;
  DST-04). Author-cited modern-status caveats are folded into each leaf's Consequences.
