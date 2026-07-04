# Kerievsky Catalog (Refactoring to Patterns) -- index

Scope: all 27 Kerievsky pattern-directed refactorings. Coach mode routes structural /
pattern-directed smells here; reference mode looks up a named Kerievsky refactoring here. This is a
THIN index entry-point -- entry content lives in split leaf files (added in Phase 8), never inlined
here (SKEL-04). Kerievsky refactorings compose named Fowler primitives, so this catalog builds on
the Fowler catalog (authored first, in Phase 7).

> Populated in Phase 8. Owner acts as the authoritative oracle.
> Phase 8 MUST open an AskUserQuestion oracle-access checkpoint BEFORE authoring any content
> (owner Kerievsky *Refactoring to Patterns* book; GoF e-book for pattern vocabulary only). Do NOT
> fabricate catalog content. No verbatim Kerievsky or GoF prose or code, even here (DST-04).

## Per-entry content contract

Each of the 27 pattern-directed refactorings, when populated in Phase 8, carries:

- Name; intent -- in original words (no verbatim book prose).
- Distilled mechanics -- the step sequence in original words (no verbatim book prose).
- TS/JS example -- re-rendered from the book's Java into original TS/JS, `tsc --strict` clean.
- Composed Fowler primitive(s) -- the named Fowler refactorings it builds on (cross-link to the
  Fowler catalog).
- Direction -- To / Towards / Away, with de-patterning cases (Away from a pattern) called out.
- GoF pattern cross-reference -- vocabulary only (pattern name), no GoF text or code (DST-04).

## Deferred: intra-catalog split axis (D-04)

The subdir + this thin index admit ANY split axis without re-touching SKILL.md. Phase 8 planning
picks the axis (oracle-informed); Phase 6 does NOT pick one and does NOT create leaf files yet.

Candidate axes (report only, not a decision):

- By direction: To / Towards / Away.
- By GoF pattern family the refactoring targets.

<!-- Split axis DEFERRED to Phase 8 planning (D-04). Do NOT create per-axis leaf files in Phase 6. -->
