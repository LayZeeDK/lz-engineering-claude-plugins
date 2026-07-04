# Fowler Catalog (Refactoring, 2nd ed) -- index

Scope: all 66 Fowler refactorings, provenance-labeled. Coach mode routes mechanical smells here;
reference mode looks up a named Fowler refactoring here. This is a THIN index entry-point -- entry
content lives in split leaf files (added in Phase 7), never inlined here (SKEL-04).

> Populated in Phase 7. Owner acts as the authoritative oracle.
> Phase 7 MUST open an AskUserQuestion oracle-access checkpoint BEFORE authoring any content
> (owner Fowler *Refactoring* 2nd-ed e-book / web edition, ISBN 9780135425664; GoF e-book for
> pattern vocabulary only). Do NOT fabricate catalog content. No verbatim Fowler or GoF prose or
> code, even here (DST-04).

## Per-entry content contract

Each of the 66 refactorings, when populated in Phase 7, carries:

- Name -- the 2nd-ed canonical name, plus the 1st-ed alias(es) it replaces, if any.
- Motivation -- distilled in original words (no verbatim book prose).
- Distilled mechanics -- the step sequence in original words (no verbatim book prose).
- TS/JS example -- before -> after, original code, `tsc --strict` clean.
- Provenance label -- mark the 5 print-absent "+" entries (web-edition-only) and any
  Split Phase online-only material as such, so print vs web edition is auditable.

## Deferred: intra-catalog split axis (D-04)

The subdir + this thin index admit ANY split axis without re-touching SKILL.md. Phase 7 planning
picks the axis (oracle-informed); Phase 6 does NOT pick one and does NOT create leaf files yet.

Candidate axes (report only, not a decision):

- Fowler's own 20 tag-groups: basic, encapsulation, moving-features, organizing-data,
  simplify-conditional-logic, refactoring-apis, dealing-with-inheritance, collections, delegation,
  errors, extract, parameters, fragments, grouping-function, immutability, inline, remove, rename,
  split-phase, variables.
- Book-chapter grouping (Ch.6-12), or alphabetical / count-balanced buckets.

<!-- Split axis DEFERRED to Phase 7 planning (D-04). Do NOT create per-axis leaf files in Phase 6. -->
