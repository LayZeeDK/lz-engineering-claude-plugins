# Phase 7: Fowler Catalog (Refactoring, 2nd ed) - Context

**Gathered:** 2026-07-04
**Status:** Ready for planning

> **SUPERSEDED IN PART (2026-07-05, scope-correction re-plan).** The scope/routing/oracle decisions
> below are superseded by two LOCKED design docs -- READ THOSE FIRST: `07-ROUTING-ARCHITECTURE.md`
> (canonical routing) and `07-ORACLE-MODEL.md` (clean-room oracle + availability matrix + driver
> notes). Specifically:
> - **Scope 66 -> 62** -- cut 4 web-only 1st-ed relics (Replace Magic Literal, Replace Control Flag
>   with Break, Replace Error Code with Exception, Replace Exception with Precheck); keep Return
>   Modified Value `[web-only]`. This overrides every "all 66" phrasing below and D-06's `+`-entry list.
> - **D-01 (tag-group split) SUPERSEDED** by chapter-grouped per-refactoring LEAF files
>   (`fowler-catalog/<refactoring>.md` x62 + a chapter-grouped `README.md` index).
> - **D-04 (smells as a table) SUPERSEDED** by smell LEAVES under `smells/` + a navigation-only
>   `smells.md` recognize-by index (candidates live in the leaf, forcing confirm-via-leaf).
> - **D-07 (AskUserQuestion oracle checkpoint) SUPERSEDED for this book** by the clean-room
>   `oracle`/`oracle-reviewer` loop over `.oracle/refactoring-2e/` (main context never reads book
>   prose; DST-04). D-07's intent (owner authoritative, no fabrication) is preserved + strengthened.
>   AskUserQuestion remains the oracle path ONLY for books NOT in `.oracle/` (GoF/Beck/RCM).
> The `<code_context>` / `<canonical_refs>` reuse notes below remain valid.

<domain>
## Phase Boundary

Phase 7 fills the Phase-6 scaffold stubs with the complete, provenance-labeled
FOWLER reference LAYER of the `lz-refactor` skill:

1. **Fowler catalog** (`references/fowler-catalog/`) -- all 66 2nd-edition
   refactorings, each with name (+ 1st-ed alias(es) it replaces), distilled
   motivation and mechanics in original words, and an original TS/JS
   before->after example; provenance-labeled (the 5 print-absent "+" entries and
   Split Phase's online-only examples).
2. **Unified smell taxonomy** (`references/smells.md`) -- Fowler's 24 bad smells
   as a coach trigger table, each mapped to its candidate named refactoring(s).
3. **Principles** (`references/principles.md`) -- Fowler Ch.2 distilled in
   original words with correct attributions.

All TS/JS samples are `tsc --strict`-clean and behavior-preserving, verified
against the owner's e-book/web oracle. Satisfies FWL-01..FWL-04.

**In scope:** the CONTENT of the Fowler layer -- populating the three stubs
above (fowler-catalog leaf files, the Fowler rows of smells.md, and the Ch.2
principles), plus the compile harness that proves the samples are `tsc
--strict`-clean.

**Out of scope (later phases):** the Kerievsky catalog and its Ch.4 smell fold
(Phase 8, KRV-*); the coach decision procedure and principle-backing prose
(Phase 9, CCH-*/PRIN-*); Beck principle-backing PLACEMENT in principles.md
(Phase 9); version bump / README / CHANGELOG (Phase 10, DST-*); evals (Phase 11,
EVL-*). smells.md holds only Fowler rows now; Kerievsky Ch.4 folds in Phase 8.

</domain>

<decisions>
## Implementation Decisions

### Fowler Catalog Structure
- **D-01 [architecture]:** Split the 66 refactorings across leaf files under
  `references/fowler-catalog/` by **Fowler's own tag-groups** (the ~20 tags in
  the scaffold: basic, encapsulation, moving-features, organizing-data,
  simplify-conditional-logic, refactoring-apis, dealing-with-inheritance,
  collections, delegation, errors, extract, parameters, fragments,
  grouping-function, immutability, inline, remove, rename, split-phase,
  variables), one leaf file per tag-group, each refactoring placed in its
  PRIMARY tag-group. This RESOLVES the Phase-6 D-04 deferred split axis.
  Rationale: it is the author's own grouping (authoritative + matches
  refactoring.com), aligns with the coach's smell->refactoring routing, and
  gives good progressive-disclosure granularity (~3-4 entries/file) without 66
  micro-files. The thin `fowler-catalog/README.md` index stays the only
  entry-point `SKILL.md` points at -- adding leaf files needs NO `SKILL.md`
  re-touch.
  COMPETING OPTION (documented, re-openable at plan time): one-file-per-refactoring
  (max granularity) or book-chapter grouping. Exact per-entry tag bucketing and
  multi-tag handling are finalized at plan time WITH the oracle's tag data.

### Entry Content & Examples
- **D-02:** Each of the 66 entries fills the Phase-6 per-entry content contract
  exactly (name + 1st-ed alias / distilled motivation / distilled mechanics /
  TS-JS before->after / provenance label). Examples are **minimal, focused
  before->after in TypeScript** (drop to plain JS only where a JS-specific idiom
  is the point), illustrative not exhaustive; every entry gets an original
  example (the contract requires it). NO verbatim Fowler code or prose (DST-04)
  -- the refactoring.com excerpts are orientation only, never copied.
- **D-03 [verification]:** TS/JS samples live in a **bundled compile harness**
  (extractable `.ts` sources + a `tsconfig`, mirroring how lz-tpp's TS was
  verified) so FWL-04's `tsc --strict`-clean claim is machine-checkable, not
  inline-fence-only-unverified. The Markdown entries SHOW the original code; the
  harness PROVES it compiles. Exact harness location/shape is Claude's
  discretion at plan time (keep it out of the shipped skill surface if it would
  add noise -- e.g., a workspace under the skill or `.planning`).

### Smell Taxonomy
- **D-04:** `references/smells.md` is populated with **Fowler's 24 bad smells
  only** in Phase 7, as a coach trigger table: each row = smell name (original
  words) + source tag `Fowler` + candidate named refactoring(s) cross-linked to
  the fowler-catalog entries + a one-line "when to pick". The table is SHAPED to
  accept the Phase-8 Kerievsky Ch.4 fold (additional source-tagged, deduplicated
  rows) WITHOUT re-touching the Phase-7 rows.

### Principles
- **D-05:** `references/principles.md` distills **Fowler Ch.2 only** in Phase 7
  (definition of refactoring; the two hats; when-to-refactor: rule of three /
  preparatory / comprehension / litter-pickup; performance; YAGNI) in original
  words with correct attributions. Beck principle-backing PLACEMENT stays
  deferred to Phase 9 -- do NOT pre-split a `principles-beck.md` here.

### Provenance Labeling
- **D-06:** Provenance uses a small explicit legend at the catalog index PLUS a
  per-entry inline tag: mark the 5 print-absent "+" entries (Replace Magic
  Literal, Replace Control Flag with Break, Return Modified Value, Replace Error
  Code with Exception, Replace Exception with Precheck) as web-edition-only, and
  Split Phase's online-only examples as such. Labels are informational; the
  owner's e-book/web edition remains the oracle for all 66.

### Oracle-Access Checkpoint (MANDATORY -- user standing instruction + Phase-6 D-09)
- **D-07 [oracle blocking]:** Before authoring ANY Fowler catalog / smell /
  principle content, the executor MUST open an **AskUserQuestion oracle-access
  checkpoint** -- the owner is the authoritative oracle (Fowler *Refactoring*
  2nd-ed e-book / web edition, InformIT ISBN 9780135425664). Do NOT fabricate
  mechanics, motivations, smell names, or Ch.2 details. Verify in BATCHES by
  tag-group split (D-01), not one refactoring at a time. This gate is
  non-negotiable and survives the `--auto` / `--chain` autonomous run
  (AskUserQuestion pauses execution for the human, then the chain resumes).
  Discuss-phase itself authors NO content, so the checkpoint fires at EXECUTION,
  not during discuss. (GoF e-book is for Kerievsky pattern vocabulary only --
  Phase 8, not needed here.)

### Claude's Discretion
- Leaf file names within the tag-group axis; exact compile-harness location and
  shape; entry ordering within a file; the precise "when to pick" wording in the
  smell table; the exact legend format for provenance.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 7 scaffold to FILL (Phase 6 output -- the content contracts)
- `plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/README.md` -- thin
  index + per-entry content contract + D-04 split-axis note + oracle-checkpoint
  note. FILL THIS (tag-group leaf files are added alongside it).
- `plugins/lz-tdd/skills/lz-refactor/references/smells.md` -- smell trigger-table
  stub + per-row content contract. FILL (Fowler's 24 rows).
- `plugins/lz-tdd/skills/lz-refactor/references/principles.md` -- principles stub
  + per-entry content contract. FILL (Fowler Ch.2).
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` -- the router; its pointers
  already resolve, so do NOT re-touch it for the split (D-01).

### Orientation scaffold (NOT the oracle)
- `.planning/research/refactoring-com-overview.md` -- 66 names + 1st-ed aliases +
  Fowler's 20 tag-groups + inverse-of pattern; owner-confirmed count 66; the 5
  print-absent entries listed. Use for name/alias/inverse/tag cross-checks and
  structuring ONLY; the owner's e-book/web is the oracle for all mechanics.

### The oracle (owner-held -- access via the D-07 AskUserQuestion checkpoint)
- Fowler *Refactoring* 2nd ed e-book / web edition (InformIT, ISBN
  9780135425664) -- authoritative for all 66 mechanics/motivations, the 24 Ch.3
  bad smells, and the Ch.2 principles. NO path (owner-held); access is gated by
  D-07.

### In-repo precedent (COPY the shape, not the content)
- `plugins/lz-tdd/skills/lz-tpp/references/` (`transformations.md`,
  `fibonacci-worked-example.md`, `typescript-and-tco.md`) -- reference-file
  granularity, provenance-labeling, and `tsc --strict`-clean TS example
  precedent to mirror.

### Phase spec
- `.planning/ROADMAP.md` -> "Phase 7: Fowler Catalog (Refactoring, 2nd ed)" --
  goal + the 4 success criteria this phase is graded on.
- `.planning/REQUIREMENTS.md` -> "Fowler Catalog (Refactoring, 2nd ed)" (FWL-01,
  FWL-02, FWL-03, FWL-04).
- `.planning/PROJECT.md` -- constraints (ASCII-only, MIT, public contact, no
  verbatim prose DST-04) and prior key decisions.
- `.planning/phases/06-lz-refactor-skill-scaffold-progressive-disclosure/06-CONTEXT.md`
  -- Phase-6 D-01..D-09 (scaffold decisions; esp. D-04 split deferral resolved
  here by D-01, and D-09 oracle checkpoint carried forward here as D-07).

### Authoring guidance (via the Skill tool -- no path needed)
- `skill-creator` -- progressive-disclosure authoring.
- `plugin-dev:skill-development`, `plugin-dev:plugin-structure` -- skill/plugin
  structure and auto-discovery.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **lz-tpp references/**: reuse the reference-file granularity, provenance-label
  idiom, and the `tsc --strict`-clean TS example pattern (SHAPE, not content).
- **Phase-6 stubs** (`fowler-catalog/README.md`, `smells.md`, `principles.md`):
  each already carries its per-entry content contract -- fill against it, do not
  redesign it.
- **`SKILL.md` pointers already resolve** -- the tag-group leaf files hang under
  the existing thin index, so the split needs no `SKILL.md` edit.

### Established Patterns
- Progressive disclosure: thin index + split leaf files; no single file forces
  the whole catalog into context (SKEL-04). Mirror the lz-tpp lean-router ratio.
- Public-repo hygiene from every file: ASCII-only, MIT, public contact only, and
  NO verbatim Fowler prose or code listings (DST-04).

### Integration Points
- `smells.md` becomes the coach trigger table that Phase 9's coach consumes.
- The Fowler catalog entries are the primitives that Phase 8's Kerievsky
  refactorings cross-map to and compose; Kerievsky Ch.4 smells fold into
  `smells.md` in Phase 8.

</code_context>

<specifics>
## Specific Ideas

- User standing instruction (this milestone): "Use AskUserQuestion when you need
  authoritative oracle book access." Captured as D-07. It does NOT fire during
  discuss-phase (no content is authored here) but MUST fire at execution before
  any catalog / smell / principle content is written.
- This is a Markdown skill-authoring phase -- there is NO UI / frontend. Skip
  UI-SPEC generation at plan time.

</specifics>

<deferred>
## Deferred Ideas

- Kerievsky Ch.4 smells folded into `smells.md` -> Phase 8 (KRV-03).
- Beck principle-backing placement in `principles.md` -> Phase 9 (PRIN-01/02).
- The coach decision procedure that consumes `smells.md` as its trigger table
  -> Phase 9 (CCH-01..05).
- Optional richer per-entry harvest (refactorgram sketch / inverse-of graph /
  before-after excerpts) from refactoring.com -> only if a richer local scaffold
  is wanted; the index-level overview is sufficient to structure the docs.

</deferred>

---

*Phase: 7-Fowler Catalog (Refactoring, 2nd ed)*
*Context gathered: 2026-07-04*
