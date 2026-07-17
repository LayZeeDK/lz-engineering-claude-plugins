# Extra Patterns Catalog: index

Scope: the 5 Tier-1 extra patterns (Null Object, Factory, Creation Method, Composed Method, and
Collecting Parameter) that Kerievsky documents with pattern-grade material but that are not among
the classic GoF 23. Coach mode routes here when a Kerievsky refactoring targets one of these
non-GoF-23 patterns; reference mode looks one up by name. This is a THIN index: entry content lives
in per-pattern leaf files, never inlined here (SKEL-04). Each leaf follows the same locked 5-section
contract as the GoF leaves: Intent, Applicability, Consequences, Example, Related patterns. The
selector shown against each entry is that leaf's Applicability first line, mirrored verbatim.

This index is flat (no family grouping).

| Pattern | Applicability |
|---|---|
| [Null Object](null-object.md) | Use it when many callers repeat the same check for a missing collaborator before acting on it. |
| [Factory](factory.md) | Use it when the choice of which concrete class to create, and the work of building it, is duplicated across callers or exposes concrete types they should not depend on. |
| [Creation Method](creation-method.md) | Use it when a class is created through constructors that are ambiguous or fail to reveal what kind of object results. |
| [Composed Method](composed-method.md) | Use it when a method is hard to follow because it mixes high-level steps with low-level detail. |
| [Collecting Parameter](collecting-parameter.md) | Use it when a result must be accumulated from several methods or from a traversal, rather than assembled from their separate return values. |

## Sources

- Kerievsky, *Refactoring to Patterns*, Ch.6-11 (the catalog of pattern-directed refactorings), which
  documents these five patterns alongside the refactorings that reach them. Intents, applicability,
  consequences, and examples are distilled in original words with original TypeScript (no verbatim
  prose or code; DST-04).
