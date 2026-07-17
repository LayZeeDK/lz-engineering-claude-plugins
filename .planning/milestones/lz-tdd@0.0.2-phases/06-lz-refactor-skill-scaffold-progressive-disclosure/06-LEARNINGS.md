---
phase: 6
phase_name: "lz-refactor Skill Scaffold & Progressive Disclosure"
project: "lz-engineering-claude-plugins"
generated: "2026-07-04"
counts:
  decisions: 4
  lessons: 3
  patterns: 3
  surprises: 2
missing_artifacts:
  - "UAT.md"
---

# Phase 6 Learnings: lz-refactor Skill Scaffold & Progressive Disclosure

## Decisions

### Dual-mode by omission (minimal frontmatter)
Frontmatter carries `name` + `description` only. Auto-triggering coach AND
user-invocable reference are obtained by OMITTING `disable-model-invocation`
(default false) and `user-invocable` (default true). No `version`/`license`/`metadata`.

**Rationale:** Matches the shipped, validated lz-tpp convention; the defaults already
deliver both modes, and adding flags only risks disabling one. `version` is not in the
skill frontmatter spec.
**Source:** 06-CONTEXT.md (D-02), 06-RESEARCH.md

### Splittable catalogs behind a thin index; defer the split axis
The two large catalogs (Fowler, Kerievsky) are subdirectories fronted by a thin
`README.md` index that SKILL.md points to in one hop. The exact intra-catalog split
axis (Fowler tag-groups vs book chapters; Kerievsky direction vs GoF family) is
deferred to Phases 7/8.

**Rationale:** The subdir + index admits any axis without re-touching SKILL.md, and the
axis choice is oracle-informed content work that belongs to the catalog phases. Satisfies
SKEL-04 at the SKILL.md hop now while keeping later options open.
**Source:** 06-CONTEXT.md (D-04), 06-RESEARCH.md

### Hybrid router shape (lz-tpp framing + angular-developer sectioning)
SKILL.md fuses lz-tpp's dual-mode framing (Coach / Reference, routed by intent) with
angular-developer's `##`-per-task-area pointer layout.

**Rationale:** lz-refactor is simultaneously a coach (needs a decision procedure) and a
large reference surface (5 groups, ~93 future entries); neither model alone fits.
**Source:** 06-CONTEXT.md (D-01), 06-RESEARCH.md

### Wave-0 checker in the workspace tools/ dir
The scaffold verification checker lives at
`.claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs` (git-tracked, Node
builtins only), not inside the auto-discovered skill dir.

**Rationale:** Matches the repo's tracked eval-workspace `tools/` convention and keeps a
non-skill helper out of the skill's discovery surface.
**Source:** 06-01-PLAN.md, 06-01-SUMMARY.md

---

## Lessons

### `claude plugin validate` does not check markdown body-link resolution
The first-party validator checks marketplace/plugin/skill frontmatter and structure, but
NOT that a SKILL.md `](references/...)` pointer resolves to a real file. A dangling
pointer passes `validate`.

**Context:** Pointer resolution must be an explicit filesystem assertion (the Wave-0
checker extracts pointer targets and asserts each exists). Treating `validate` as
sufficient would have shipped a broken router that "passes".
**Source:** 06-RESEARCH.md (Pitfall 1), 06-REVIEW.md

### ASCII-only needs a byte-scan, not eyeballing
A first VALIDATION.md draft carried an invisible U+200C (zero-width non-joiner) that a
PreToolUse hook flagged. Emoji/typographic status markers copied from a template also
violated the repo ASCII-only rule.

**Context:** Invisible/typographic characters enter via copy-paste and are undetectable by
eye. Every authored file must be byte-scanned with `rg -n '[^\x00-\x7F]'` before commit.
**Source:** this session (VALIDATION.md rewrite), 06-01-SUMMARY.md

### A verification helper can carry its own latent bugs
Deep code review of `verify-scaffold.mjs` found a trailing-newline off-by-one in the
line-count check (WR-01) and a cardinality-not-identity gap in the pointer check (WR-02) --
neither affects the current scaffold but both are real.

**Context:** The tool that gates the phase deserves independent review too; a green checker
run is not proof the checker is correct. Harden WR-01/WR-02 before Phase 7 extends it.
**Source:** 06-REVIEW.md

---

## Patterns

### Content-contract STUB
Scaffold each reference file as: heading + one-line scope + `Populated in Phase N` marker +
the per-entry content contract the later phase must fill -- never empty, never real content.

**When to use:** Multi-phase content builds where the structure and contracts should land
(and be validated) before the content is authored. Makes pointers resolve, documents the
contract for the content phase, and keeps the scaffold copyright-clean.
**Source:** 06-CONTEXT.md (D-05), 06-RESEARCH.md

### Oracle-access thread-forward
When a phase defers authoritative-source (copyrighted) content to a later phase, bake an
explicit "later phase MUST open an AskUserQuestion oracle-access checkpoint before authoring"
note into the stubs and CONTEXT decisions.

**When to use:** Any scaffold that will later be filled from books/specs the agent cannot
freely reproduce; carries the human-in-the-loop obligation forward so it is not silently
skipped.
**Source:** 06-CONTEXT.md (D-09), 06-01-SUMMARY.md

### Index-entry-point progressive disclosure
SKILL.md points one hop to a thin catalog index README that fans out internally to leaf
files. Satisfies "no single file forces the whole catalog into context" while keeping the
router's pointer count small and stable.

**When to use:** A lean router that must front a large reference catalog whose internal
organization may change later.
**Source:** 06-RESEARCH.md

---

## Surprises

### The lean router landed far under the size target
SKILL.md is 69-70 lines against a ~90-150 soft target (500 hard cap) -- lean beats padded,
mirroring lz-tpp's 82 lines.

**Impact:** The checker's "(target ~90-150)" hint now reads as contradicting the
deliberately thin router (INFO IN-03 in the review); the hint, not the router, is what
should change.
**Source:** 06-01-SUMMARY.md, 06-REVIEW.md

### Generic string-match checks constrained stub wording
Two wording-level deviations were needed for the checker/verifier to detect markers:
reflowing the D-09 note so "AskUserQuestion oracle-access checkpoint" stays on one line, and
capitalizing principles.md's "Populated in Phase 7" so the generic marker check matched.

**Impact:** No scope change, but a reminder that brittle substring assertions leak into and
constrain the prose they check; identity/structured assertions would be more robust.
**Source:** 06-01-SUMMARY.md
