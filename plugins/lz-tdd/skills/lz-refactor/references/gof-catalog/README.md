# GoF Design Patterns Catalog -- index

Scope: all 23 Gang-of-Four design patterns, grouped by family (Creational / Structural /
Behavioral). Coach mode routes a pattern-directed decision here to name the target pattern to move
toward (or away from); reference mode looks up a named GoF pattern here. This is a THIN index --
entry content lives in per-pattern leaf files, never inlined here (SKEL-04). Each leaf follows the
locked 5-section contract: Intent, Applicability, Consequences, Example, Related patterns. The
selector shown against each entry is that leaf's Applicability first line, mirrored verbatim.

Leaf rows are added when the pattern leaves are authored; until then this index carries the family
headings and their glosses only.

## Creational

Patterns that abstract how objects are instantiated, decoupling a client from the concrete classes
it creates.

## Structural

Patterns that compose classes and objects into larger structures while keeping those structures
flexible and efficient.

## Behavioral

Patterns that assign responsibilities between objects and describe how they communicate and
distribute control.

## Sources

- Gamma, Helm, Johnson, Vlissides, *Design Patterns: Elements of Reusable Object-Oriented Software*,
  Ch.3 Creational, Ch.4 Structural, Ch.5 Behavioral. Intents, applicability, consequences, and
  examples are distilled in original words with original TypeScript (no verbatim prose or code;
  DST-04). Author-cited modern-status caveats are folded into each leaf's Consequences.
