# Phase 7: Fowler Catalog (Refactoring, 2nd ed) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-04
**Phase:** 7-Fowler Catalog (Refactoring, 2nd ed)
**Mode:** `--analyze --auto --chain` (autonomous single-pass; trade-off tables logged; recommended option auto-selected per question)
**Areas discussed:** Fowler catalog split axis, Entry content & examples, tsc verification mechanism, Smell-taxonomy scope, Provenance labeling, Oracle-verification workflow

---

## Fowler catalog split axis (resolves Phase-6 D-04)

| Option | Description | Selected |
|--------|-------------|----------|
| Fowler's own tag-groups (~20 files) | Author's authoritative grouping; matches coach smell->routing; ~3-4 entries/file; no SKILL.md re-touch | SELECTED |
| One file per refactoring (66 files) | Max progressive-disclosure granularity | |
| Book-chapter grouping (Ch.6-12) | Fewer, larger files | |

**Auto-selection:** Fowler tag-groups (recommended default) -> CONTEXT.md D-01.
**Notes:** Competing option (one-file-per-refactoring) documented in D-01 and left re-openable at plan time; exact per-entry tag bucketing + multi-tag handling finalized at plan time with the oracle's tag data.

---

## Entry content & examples

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal focused TS before->after, every entry | Illustrative not exhaustive; TS default, JS only for JS-specific idioms; no verbatim code | SELECTED |
| Full worked example per entry | Heavier docs, higher authoring cost | |

**Auto-selection:** Minimal focused TypeScript examples (recommended default) -> CONTEXT.md D-02.
**Notes:** Fills the Phase-6 per-entry content contract exactly; refactoring.com excerpts are orientation only, never copied (DST-04).

---

## tsc --strict verification mechanism

| Option | Description | Selected |
|--------|-------------|----------|
| Bundled compile harness | Extractable .ts sources + tsconfig (like lz-tpp); FWL-04 machine-checkable | SELECTED |
| Inline fenced code only | Not compiler-verified; FWL-04 unprovable | |

**Auto-selection:** Bundled compile harness (recommended default) -> CONTEXT.md D-03.
**Notes:** Markdown shows the code; the harness proves it compiles. Harness location/shape is Claude's discretion at plan time, kept off the shipped skill surface if noisy.

---

## Smell-taxonomy scope

| Option | Description | Selected |
|--------|-------------|----------|
| Fowler's 24 smells only now | Trigger table shaped to accept Phase-8 Kerievsky Ch.4 fold without re-touch | SELECTED |
| Author Fowler + placeholder Kerievsky rows now | Premature; Kerievsky oracle is Phase 8 | |

**Auto-selection:** Fowler 24 only (recommended default) -> CONTEXT.md D-04.
**Notes:** Each row = smell name + source tag Fowler + candidate refactoring(s) cross-linked + one-line "when to pick".

---

## Provenance labeling

| Option | Description | Selected |
|--------|-------------|----------|
| Legend at index + per-entry inline tag | Marks the 5 print-absent "+" entries + Split Phase online-only examples; auditable | SELECTED |
| No labels | Print-vs-web provenance not auditable | |

**Auto-selection:** Legend + inline tag (recommended default) -> CONTEXT.md D-06.
**Notes:** Labels informational; owner e-book/web remains the oracle for all 66.

---

## Oracle-verification workflow

| Option | Description | Selected |
|--------|-------------|----------|
| Mandatory AskUserQuestion oracle checkpoint before authoring, batched by tag-group | Honors the user standing instruction + Phase-6 D-09; no fabrication; survives --auto/--chain | SELECTED |
| Author from orientation scaffold, verify later | Risks fabrication; violates D-09 | |

**Auto-selection:** Mandatory oracle checkpoint (recommended default) -> CONTEXT.md D-07 [oracle blocking].
**Notes:** Discuss-phase authors NO content, so the checkpoint does NOT fire now -- it fires at EXECUTION before any catalog/smell/principle prose. AskUserQuestion pauses the autonomous chain for the human, then it resumes.

---

## Claude's Discretion

- Leaf file names within the tag-group axis; exact compile-harness location and shape; entry ordering within a file; the precise "when to pick" wording in the smell table; the exact provenance legend format.

## Deferred Ideas

- Kerievsky Ch.4 smells folded into `smells.md` -> Phase 8 (KRV-03).
- Beck principle-backing placement in `principles.md` -> Phase 9 (PRIN-01/02).
- The coach decision procedure that consumes `smells.md` as its trigger table -> Phase 9 (CCH-01..05).
- Optional richer per-entry harvest (refactorgram sketch / inverse-of graph / before-after excerpts) from refactoring.com -> only if a richer local scaffold is wanted.
