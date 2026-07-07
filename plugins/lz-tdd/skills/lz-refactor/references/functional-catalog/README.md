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

The rows below are finalized in a later authoring wave; this scaffold declares the table shape so the
selector-mirror gate has a target.

| OO pattern / refactoring | Correspondence | Idiom leaf | Use when |
|---|---|---|---|

## Notes (Fowler: moot / data-modeling / light)

Fowler refactorings whose intent is a functional default (immutability, value equality, composition),
is reached through data/ADT reshaping rather than a dedicated idiom, or is a light one-line adjustment
appear here as one-line notes with NO idiom leaf -- a leaf requires a real `tsc --strict` Example. The
note rows are authored in a later wave, reconciled against the shipped fowler-catalog leaf names.

## Sources

- `.planning/research/functional-depatterning-ts.md` Sections 10-13 -- the LOCKED design source of
  record for this catalog (the pattern -> FP-idiom -> TS-feature disappearance map, the full-corpus
  Stays-OO analysis, the board-ratified leaf template, and the N:1 map). This phase has no owned book
  oracle (D-06); the committed research artifact plus `check-functional` plus `tsc --strict` are the
  correctness anchor. Idioms, examples, and prose are original words with original TypeScript -- no
  verbatim book or artifact prose or code (DST-04).
