# Principle Backing

Scope: the cross-cutting map from each RED recommendation back to the source that backs it, plus
the owned / unowned access-tier note for each source. This is the "why we say this" layer: it lets
the coach justify a recommendation from a named principle, and it records which sources are
oracle-verifiable (owned books) versus high-confidence-core-only (unowned, no-oracle). It carries
no selection, structure, naming, or stance guidance of its own -- it points back at the docs that do.

> Populated in Phases 16-17 -- co-edited as the other reference docs are authored (each
> recommendation is backed as it lands). Cross-cutting; supports DST-03 (source-to-recommendation
> traceability). No verbatim source prose or code (DST-04).

## Per-entry content contract

Each backing entry, when populated, carries:

- Recommendation -- the RED guidance being backed (linking to the doc that states it).
- Source -- the author / work that backs it, in original words.
- Access tier -- owned book (oracle-verifiable) or unowned (high-confidence core only, no-oracle).

Sub-topics in scope for this doc:

- The source-to-recommendation map across all RED reference docs (selection, structure,
  assertions, naming, stance, anti-patterns, mechanics).
- Owned-book access tier -- sources verifiable against an owned edition in `.oracle/` at the
  Phase 16 checkpoint (for example Robert C. Martin, Sandi Metz).
- Unowned / no-oracle access tier -- sources used at high-confidence core only, no verbatim prose
  (for example Kent Beck, Michael Feathers).
- The DST-03 traceability record tying each recommendation to its backing source.

## Sources (placeholder)

- All RED-coach sources, mapped recommendation-by-recommendation with their access tiers
  (owned vs no-oracle), co-edited across Phases 16-17.
