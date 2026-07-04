# Phase 7: Fowler Catalog (Refactoring, 2nd ed) - Research

**Researched:** 2026-07-04
**Domain:** Skill-authoring (progressive-disclosure Markdown catalog) + a `tsc --strict` compile harness for extractable TS/JS samples
**Confidence:** HIGH (structure, toolchain, patterns); MEDIUM/LOW (exact tag-group bucketing -- needs oracle/plan-time data)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01 [architecture]:** Split the 66 refactorings across leaf files under
  `references/fowler-catalog/` by Fowler's own tag-groups (the ~20 tags: basic,
  encapsulation, moving-features, organizing-data, simplify-conditional-logic,
  refactoring-apis, dealing-with-inheritance, collections, delegation, errors, extract,
  parameters, fragments, grouping-function, immutability, inline, remove, rename,
  split-phase, variables), one leaf file per tag-group, each refactoring placed in its
  PRIMARY tag-group. RESOLVES the Phase-6 D-04 deferred split axis. The thin
  `fowler-catalog/README.md` index stays the only entry-point SKILL.md points at --
  adding leaf files needs NO SKILL.md re-touch. COMPETING OPTION (documented, re-openable
  at plan time): one-file-per-refactoring or book-chapter grouping. Exact per-entry tag
  bucketing and multi-tag handling are finalized at plan time WITH the oracle's tag data.
- **D-02:** Each of the 66 entries fills the Phase-6 per-entry content contract exactly
  (name + 1st-ed alias / distilled motivation / distilled mechanics / TS-JS before->after
  / provenance label). Examples are minimal, focused before->after in TypeScript (drop to
  plain JS only where a JS-specific idiom is the point), illustrative not exhaustive;
  every entry gets an original example. NO verbatim Fowler code or prose (DST-04) -- the
  refactoring.com excerpts are orientation only, never copied.
- **D-03 [verification]:** TS/JS samples live in a bundled compile harness (extractable
  `.ts` sources + a `tsconfig`, mirroring how lz-tpp's TS was verified) so FWL-04's `tsc
  --strict`-clean claim is machine-checkable, not inline-fence-only-unverified. The
  Markdown entries SHOW the original code; the harness PROVES it compiles. Exact harness
  location/shape is Claude's discretion at plan time (keep it out of the shipped skill
  surface if it would add noise -- e.g., a workspace under the skill or `.planning`).
- **D-04:** `references/smells.md` is populated with Fowler's 24 bad smells only in Phase
  7, as a coach trigger table: each row = smell name (original words) + source tag
  `Fowler` + candidate named refactoring(s) cross-linked to the fowler-catalog entries + a
  one-line "when to pick". The table is SHAPED to accept the Phase-8 Kerievsky Ch.4 fold
  (additional source-tagged, deduplicated rows) WITHOUT re-touching the Phase-7 rows.
- **D-05:** `references/principles.md` distills Fowler Ch.2 only in Phase 7 (definition of
  refactoring; the two hats; when-to-refactor: rule of three / preparatory / comprehension
  / litter-pickup; performance; YAGNI) in original words with correct attributions. Beck
  principle-backing PLACEMENT stays deferred to Phase 9 -- do NOT pre-split a
  `principles-beck.md` here.
- **D-06:** Provenance uses a small explicit legend at the catalog index PLUS a per-entry
  inline tag: mark the 5 print-absent "+" entries (Replace Magic Literal, Replace Control
  Flag with Break, Return Modified Value, Replace Error Code with Exception, Replace
  Exception with Precheck) as web-edition-only, and Split Phase's online-only examples as
  such. Labels are informational; the owner's e-book/web edition remains the oracle for
  all 66.
- **D-07 [oracle blocking]:** Before authoring ANY Fowler catalog / smell / principle
  content, the executor MUST open an AskUserQuestion oracle-access checkpoint -- the owner
  is the authoritative oracle (Fowler *Refactoring* 2nd-ed e-book / web edition, InformIT
  ISBN 9780135425664). Do NOT fabricate mechanics, motivations, smell names, or Ch.2
  details. Verify in BATCHES by tag-group split (D-01), not one refactoring at a time.
  This gate is non-negotiable and survives the `--auto` / `--chain` autonomous run
  (AskUserQuestion pauses execution for the human, then the chain resumes). The checkpoint
  fires at EXECUTION, not during discuss. (GoF e-book is for Kerievsky pattern vocabulary
  only -- Phase 8, not needed here.)

### Claude's Discretion

- Leaf file names within the tag-group axis; exact compile-harness location and shape;
  entry ordering within a file; the precise "when to pick" wording in the smell table; the
  exact legend format for provenance.

### Deferred Ideas (OUT OF SCOPE)

- Kerievsky Ch.4 smells folded into `smells.md` -> Phase 8 (KRV-03).
- Beck principle-backing placement in `principles.md` -> Phase 9 (PRIN-01/02).
- The coach decision procedure that consumes `smells.md` as its trigger table -> Phase 9
  (CCH-01..05).
- Optional richer per-entry harvest (refactorgram sketch / inverse-of graph / before-after
  excerpts) from refactoring.com -> only if a richer local scaffold is wanted; the
  index-level overview is sufficient to structure the docs.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FWL-01 | All 66 Fowler refactorings, each with name (+ 1st-ed alias), motivation, distilled mechanics (original words), original TS/JS before/after; 5 print-absent entries + Split Phase online-only provenance-labeled | Tag-group split design (D-01), entry template + provenance-legend pattern, the 66-name + alias oracle list (from `refactoring-com-overview.md`), FWL-01 presence checker |
| FWL-02 | Unified smell-taxonomy reference: the 24 Fowler bad smells, each mapped to candidate refactorings (coach trigger table) | Smell-table row template (extensible for Phase-8 fold), the 24 smell-name orientation list, cross-link-resolves checker |
| FWL-03 | Principles reference distills Ch.2 (definition, two hats, when-to-refactor set, performance, YAGNI) in original words with attributions | principles.md topic-set template, topic-presence checker |
| FWL-04 | All Fowler TS/JS samples `tsc --strict`-clean and behavior-preserving, verified against the owner e-book/web oracle | Bundled compile-harness design (D-03): tsconfig + per-fence extractor + `tsc --strict --noEmit` gate; doubles as the FWL-04 validator |
</phase_requirements>

## Summary

This phase is Markdown skill-authoring with one net-new engineering piece: a repeatable
`tsc --strict` compile harness. There is no framework, no runtime, and (in the shipped
tree) no code -- only original prose and original, compile-checked TS/JS filling Phase-6
stubs whose per-entry content contracts are already written. Every structural pattern has
an in-repo, shipped, validate-clean analog: the sibling `lz-tpp` skill's `references/`
(reference-file granularity, provenance-label discipline, `tsc --strict`-clean TS
examples) and the Phase-6 stubs themselves. The authoring TASK is gated behind the
mandatory D-07 AskUserQuestion oracle checkpoint at execution; research therefore covers
HOW to build (structure, harness, provenance, table/topic shapes, validation), never WHAT
to write.

Two findings materially shape the plan. First, the D-01 tag-group axis is not a clean
partition: refactoring.com assigns MULTIPLE tags per refactoring and mixes coarse
"chapter" tags (basic, encapsulation, moving-features, organizing-data,
simplify-conditional-logic, refactoring-apis, dealing-with-inheritance) with fine
"operation" tags (extract, inline, remove, rename, ...). A one-primary-tag partition
collapses toward the 7 chapter tags (uneven, ~9-11 entries in "basic"), which is close to
D-01's own COMPETING "book-chapter grouping" option. The per-entry tag data is NOT in the
public catalog's static HTML (it lives in a client-side filter panel), so the exact
bucketing must be resolved at plan time from the owner's e-book tag data (or by fetching
individual entry pages) -- exactly what D-01 defers. Second, the compile harness is
genuinely new: no `tsconfig.json`, `package.json`, or `.ts` file is tracked in this repo
today; Phase 3 verified lz-tpp's TS with an AD-HOC, non-committed per-block extraction.
D-03 asks for a committed, re-runnable harness -- a strict step up that should live in a
non-shipped workspace (mirroring `.claude/skills/lz-tpp-workspace/`).

**Primary recommendation:** Author ~7-20 tag-group leaf files under a thin
`fowler-catalog/README.md` index (finalize the leaf count/bucketing at the D-07 oracle
checkpoint using per-entry tag data); fill `smells.md` (24 Fowler rows) and
`principles.md` (Ch.2 topic set) against their existing contracts; and build a committed
`tsc --strict --noEmit` harness in `.claude/skills/lz-refactor-workspace/` that extracts
each fenced `ts` block as its own module and gates FWL-04. Add NO new runtime dependency;
pin only `typescript` (the compiler the requirement names) as a workspace devDependency
for reproducibility, or rely on the globally available `tsc 6.0.3`.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| The 66 refactoring entries (content) | `references/fowler-catalog/<tag-group>.md` leaf files | -- | SKEL-04: heavy catalog material is bundled in split leaves, never inlined |
| Catalog navigation / entry-point | `references/fowler-catalog/README.md` (thin index) | `SKILL.md` (one pointer, already resolves) | D-01: the index is the only entry-point SKILL.md points at; leaves hang under it |
| Smell -> refactoring routing table | `references/smells.md` | fowler-catalog leaves (cross-link targets) | D-04: coach trigger table; Phase 9 consumes it; shaped for the Phase-8 fold |
| Ch.2 principles | `references/principles.md` | -- | D-05: Fowler Ch.2 only now; Beck placement deferred to Phase 9 |
| Provenance legend + per-entry tags | `references/fowler-catalog/README.md` (legend) + inline per entry | -- | D-06: print-vs-web auditable; 5 "+" entries + Split Phase labeled |
| `tsc --strict`-clean proof (FWL-04) | NON-shipped harness workspace (`.claude/skills/lz-refactor-workspace/`) | -- | D-03: machine-checkable; kept off the shipped skill surface so `claude plugin validate` sees pure Markdown |

## Standard Stack

### Core
| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| TypeScript (`tsc`) | 6.0.3 (`latest`) | `tsc --strict --noEmit` gate proving every TS sample compiles (FWL-04) | The compiler the requirement names; already installed globally at 6.0.3 and used by Phase 3 |
| Node.js | v24.18.0 | Runs the extractor `.mjs` and drives `tsc` | Repo standard; Phase 3 verified lz-tpp TS on this exact runtime |

### Supporting
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `skill-creator` (Skill tool, no path) | installed | Progressive-disclosure authoring guidance | While authoring; confirm current split/TOC/size guidance |
| `plugin-dev:skill-development`, `plugin-dev:plugin-structure` (Skill tool) | 0.1.0 | Skill/plugin structure + auto-discovery rules | Confirm the workspace stays outside the auto-discovered skill dir |
| `claude plugin validate .` (built-in CLI) | Claude Code >= 2.1.x | Structural gate: frontmatter/marketplace; does NOT check Markdown body links | Regression gate (Phase 10 owns the strict pass; run here to catch breakage early) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-rolled ~40-line fence extractor | `codedown` / `typescript-docs-verifier` / `eslint-plugin-markdown` | [ASSUMED] Adds a first new runtime dependency to a zero-dep repo for what a small script already does (Phase 3 precedent); would require the package-legitimacy gate. Not worth it. |
| Global `tsc 6.0.3` | Pinned workspace `typescript` devDependency | Global is zero-setup but not reproducible for a public repo; pinning is more auditable. Recommend pinning in the workspace `package.json`. |
| 7 chapter-tag leaves | 20 tag-group leaves / one-file-per-refactoring | See "Tag-group split analysis" -- a real plan-time decision, not settled by D-01's default |

**Installation (harness workspace only -- NOT the shipped skill):**
```bash
# In .claude/skills/lz-refactor-workspace/ (gitignored-record pattern, mirrors lz-tpp-workspace)
npm install --save-dev typescript@6.0.3   # optional: else use global tsc 6.0.3
```

**Version verification:** `npm view typescript version` -> `6.0.3` (dist-tag `latest`,
verified 2026-07-04). Local `tsc --version` -> `Version 6.0.3`. `node --version` ->
`v24.18.0`. All present on this machine.

## Package Legitimacy Audit

> This phase installs at most ONE package (`typescript`), and only into the non-shipped
> harness workspace. The shipped skill tree stays dependency-free Markdown.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| typescript | npm | 12+ yrs | ~90M/wk | github.com/microsoft/TypeScript | not run (see note) | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

*slopcheck was not installed this session. `typescript` is not a "discovered" package -- it
is the first-party Microsoft compiler explicitly named by FWL-04 (`tsc --strict`), and is
already installed globally at 6.0.3. Registry existence confirmed via `npm view typescript
version`. Treated as legitimate on that basis. If any OTHER package is proposed at plan
time, run the full legitimacy gate and gate its install behind a `checkpoint:human-verify`
task.*

## Architecture Patterns

### System Architecture Diagram

Data flow at REFERENCE/COACH time (how a request reaches an entry) and at BUILD/VALIDATE
time (how the harness proves FWL-04):

```
REFERENCE/COACH-TIME DISCLOSURE (what Claude loads on demand)
  user request / detected smell
        |
        v
  SKILL.md  (router -- already shipped; NOT re-touched, D-01)
        |  one pointer each
        +--> references/fowler-catalog/README.md   (thin index: legend + contract + links)
        |         |  link to the ONE relevant tag-group
        |         v
        |    references/fowler-catalog/<tag-group>.md   (~3-11 entries; only this leaf loads)
        |
        +--> references/smells.md      (24-row trigger table -> cross-links into leaves)
        |
        +--> references/principles.md  (Ch.2 topic set)

BUILD/VALIDATE-TIME (non-shipped; proves FWL-04)
  references/fowler-catalog/*.md
        |  extract each fenced ```ts block
        v
  .claude/skills/lz-refactor-workspace/extract-samples.mjs
        |  one .ts module per fence (before and after are SEPARATE modules)
        v
  samples/*.ts  --->  tsc --strict --noEmit -p tsconfig.json  --->  exit 0 == FWL-04 pass
```

### Recommended Project Structure
```
plugins/lz-tdd/skills/lz-refactor/references/
|-- fowler-catalog/
|   |-- README.md              # FILL: thin index -- provenance legend + per-entry contract + link per leaf
|   |-- basic.md               # tag-group leaf (entries placed by PRIMARY tag)
|   |-- encapsulation.md
|   |-- moving-features.md
|   |-- organizing-data.md
|   |-- simplify-conditional-logic.md
|   |-- refactoring-apis.md
|   |-- dealing-with-inheritance.md
|   `-- ...                     # remaining tag-groups (final count set at plan time -- see analysis)
|-- smells.md                  # FILL: 24 Fowler rows (coach trigger table)
`-- principles.md              # FILL: Fowler Ch.2 topic set

.claude/skills/lz-refactor-workspace/     # NON-shipped harness (gitignored-record; NOT under the skill dir)
|-- package.json               # optional: pins typescript@6.0.3 + a "typecheck" script
|-- tsconfig.json              # strict:true, noEmit:true, target es2021, no dom lib
|-- extract-samples.mjs        # pulls ```ts fences from ../.../fowler-catalog/*.md into samples/
`-- samples/                   # generated one-module-per-fence .ts (gitignore the generated dir)
```

### Pattern 1: Thin index + tag-group leaves (progressive disclosure)
**What:** `SKILL.md -> fowler-catalog/README.md -> <tag-group>.md`. The README is a
navigation index (names + one-line + link per leaf, plus the provenance legend and the
per-entry contract); the leaves hold the entries.
**When to use:** A catalog too large for one file that must (a) keep a single SKILL.md
pointer and (b) never force the whole catalog into context (SKEL-04).
**Docs basis:** Current Agent Skills docs describe `SKILL.md` as "overview and
navigation," place supporting files (including subdirectories) beside it, and cap SKILL.md
at 500 lines while moving detail to separate files. [CITED: docs.claude.com/en/docs/claude-code/skills]
An index that navigates to leaf files is consistent with that. (The Phase-3 LEARNINGS note
"references must be ONE level deep, no reference-to-reference linking" reflected an earlier
reading; it is NOT a `claude plugin validate` rule and is not restated as a hard rule in
the current docs. The two-level index->leaf hop is the intended SKEL-04 design -- verify
against current skill-creator guidance at plan time and keep the README genuinely thin so
the second hop is cheap.)
**Structure template (README index -- NO Fowler content):**
```markdown
# Fowler Catalog (Refactoring, 2nd ed) -- index

<one-line scope>. Coach routes mechanical smells here; reference mode looks up a name here.

## Provenance legend
- `[print+web]` -- in both the print and web editions.
- `[web-only]`  -- print-absent "+" entry (web edition only).
- `[web-example]` -- Split Phase: examples are online-only.

## Tag-groups
- [basic](basic.md) -- <count> entries: <one-line>
- [encapsulation](encapsulation.md) -- <count> entries: <one-line>
- ...
```

### Pattern 2: Per-entry leaf template (fills the D-02 contract)
**What:** One heading per refactoring, in a stable order, carrying the five contract
fields. Any leaf over 100 lines gets a top-of-file TOC (Phase-3 guidance still useful).
**Example (STRUCTURAL placeholder only -- real content comes from the oracle at D-07):**
```markdown
### <2nd-ed Name>  `[print+web]`
_Aliases (1st-ed): <alias>, <alias>_   <!-- omit if none -->

**Motivation.** <distilled, original words>

**Mechanics.** <distilled step sequence, original words>

**Example.**
```ts
// before: <original, tsc --strict-clean>
```
```ts
// after: <original, behavior-preserving, tsc --strict-clean>
```
```
- The 5 print-absent entries carry `[web-only]`; Split Phase carries `[web-example]`.
- `before` AND `after` must BOTH compile strict-clean -- a smell is a design issue, not a
  compiler error. Do not illustrate a smell with a type error.

### Pattern 3: Compile harness -- one module per fence (D-03, FWL-04)
**What:** Extract each fenced `ts` block into its own `.ts` file (a module), so before/after
pairs that reuse the same symbol names do NOT collide, and each snippet is proven
independently `tsc --strict`-clean.
**Why one-module-per-fence:** Concatenation (Phase-3's Kata-family approach) breaks when
132 before/after snippets redeclare names. Module scoping (each file = a module; add
`export {}` if a file has no import/export) isolates them for free.
**Illustrative-vs-compilable split (Phase-3 lesson):** Phase 3 had 2 fences that were not
standalone-compilable (test-`expect(...)` snippets, a deliberately-overflowing example).
Prefer making EVERY shipped Fowler example a self-contained compilable module; if a fence
must be illustrative, mark it with an info-string the extractor skips (e.g. ```ts ignore)
and record the exclusion, so the FWL-04 claim's scope stays precise.
**tsconfig (original tooling code):**
```json
{
  "compilerOptions": {
    "strict": true,
    "noEmit": true,
    "target": "es2021",
    "module": "esnext",
    "moduleResolution": "bundler",
    "lib": ["es2021"],
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["samples/**/*.ts"]
}
```
- OMIT the `dom` lib deliberately: Phase 3 hit a `Node` global collision under `--lib dom`.
  If an example genuinely needs DOM types, scope that per-file, not globally.

### Anti-Patterns to Avoid
- **Inlining catalog content in README.md or SKILL.md:** violates SKEL-04; the index and
  router stay thin. Content lives only in leaves.
- **Any verbatim Fowler prose/code, even paraphrase-with-substitutions (DST-04):** original
  wording and original examples only. The refactoring.com excerpts are orientation, never
  a source to copy.
- **Re-touching SKILL.md for the split (D-01):** its pointer to
  `fowler-catalog/README.md` already resolves; leaves hang under the index.
- **Putting the harness (tsconfig/.ts/package.json) inside the shipped skill dir:** could
  confuse auto-discovery / first-party review and pollutes the pure-Markdown skill surface.
  Keep it in the workspace.
- **A "before" example that only differs from "after" by a compile error:** the harness
  would reject it and it misrepresents the smell.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Prove TS compiles | A bespoke type-checker or regex "looks like valid TS" check | `tsc --strict --noEmit` | Only the real compiler proves FWL-04; anything else is theater |
| Skill structure / frontmatter rules | Guess the current spec | `skill-creator` + current skills docs (verified) + lz-tpp analog | Spec drifts; the sibling skill is a shipped, validate-clean template |
| The 66 names / aliases / inverse-of map | Re-derive from memory | `.planning/research/refactoring-com-overview.md` (owner-confirmed count 66) | Already ingested and reconciled; names/aliases are facts |

**Key insight:** The only thing worth building here is the extractor+tsconfig (small,
repo-specific, no maintained drop-in fits a Markdown-catalog-to-modules gate cleanly). The
catalog CONTENT is not "built" at all -- it is transcribed in original words from the owner
oracle behind the D-07 gate.

## Common Pitfalls

### Pitfall 1: The tag-group axis is not a partition
**What goes wrong:** Treating the 20 tags as 20 disjoint buckets of ~3-4 entries each.
**Why it happens:** D-01's "~3-4 entries/file" is an average; refactoring.com assigns
several tags per refactoring and mixes coarse chapter tags with fine operation tags.
**How to avoid:** Decide a PRIMARY-tag rule with the oracle's per-entry tag data (see
"Tag-group split analysis" and Open Question 1). Expect an uneven distribution ("basic" is
large); consider merging tiny tag-groups or a "see also" cross-link for multi-tagged
entries.
**Warning signs:** A leaf with 0-1 entries, or "basic" holding a third of the catalog.

### Pitfall 2: Before/after symbol collisions in the harness
**What goes wrong:** Concatenating all snippets makes `tsc` fail on duplicate declarations.
**Why it happens:** 66 refactorings x (before + after) reuse names like `order`, `price`.
**How to avoid:** One `.ts` module per fence (Pattern 3); rely on module scoping.
**Warning signs:** `tsc` errors like "Cannot redeclare block-scoped variable".

### Pitfall 3: Line-wrap defeats presence checks (recurring Phase 2/3 lesson)
**What goes wrong:** A phrase or a required token that a line-oriented `rg` gate asserts
gets soft-wrapped across two Markdown lines and the gate false-negatives.
**Why it happens:** Markdown source wrapping.
**How to avoid:** Keep any token a checker asserts (entry headings, provenance tags,
cross-link anchors) on ONE line. Prefer checking on rendered structure (headings) not prose.
**Warning signs:** A checker fails on content you can see is present.

### Pitfall 4: ASCII-only violations (repo hard rule)
**What goes wrong:** Curly quotes, em/en dashes, arrow glyphs, ellipsis -> cp1252 mojibake.
**Why it happens:** Copy-paste from an e-book/web edition or an editor auto-formatting.
**How to avoid:** `->` not the arrow glyph, `--` not em/en dash, straight quotes, `...`
literal. Run a non-ASCII `rg` gate over every authored file (see Validation Architecture).
This risk is elevated here precisely because the oracle is an e-book (rich typography).
**Warning signs:** `rg -n "[^\x00-\x7F]"` returns hits.

### Pitfall 5: `claude plugin validate` does NOT check Markdown body links
**What goes wrong:** A cross-link in `smells.md` or the README index points at a leaf/anchor
that does not exist; validate still passes but the coach's routing is broken.
**Why it happens:** validate checks frontmatter/marketplace only (Phase-3 lesson).
**How to avoid:** A link-resolution checker (extract every `](...)` and every smell->entry
cross-link, assert each path/anchor resolves). See Validation Architecture.

## Code Examples

Structural templates only. NONE reproduce Fowler content; real entries are authored from
the owner oracle at the D-07 checkpoint.

### Smell trigger-table row (smells.md; extensible for the Phase-8 fold)
```markdown
| Smell | Source | Candidate refactoring(s) | When to pick |
|-------|--------|--------------------------|--------------|
| <Smell name> | Fowler | [<Refactoring>](fowler-catalog/<tag-group>.md#<anchor>) | <one line> |
```
- Column order and the `Source` column are the extension seam: Phase 8 appends
  Kerievsky-tagged rows (and merges `Fowler, Kerievsky` where they overlap) WITHOUT
  editing the Phase-7 rows (D-04).

### principles.md topic set (D-05; original words, attributions)
```markdown
## <Principle / topic>   -- Fowler, Refactoring 2nd ed, Ch.2
<distilled statement: what it means + when it applies, original words>
```
Topics to cover (from D-05, locked): definition of refactoring; the two hats;
when-to-refactor (rule of three, preparatory, comprehension, litter-pickup); performance;
YAGNI. A topic-presence checker asserts each appears.

### Extractor sketch (extract-samples.mjs -- original tooling)
```javascript
// Walk references/fowler-catalog/*.md, write each ```ts fence to samples/<file>-<n>.ts.
// Skip fences whose info string is "ts ignore". Append "export {}" if a file has no
// top-level import/export, to force module scope. Then run: tsc --strict --noEmit.
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom commands in `.claude/commands/` | Skills (commands merged into skills) | Current Claude Code 2.1.x | Confirms the skill-only layout; no `commands/` dir |
| Ad-hoc, non-committed per-block `tsc` extraction (Phase 3 for lz-tpp) | Committed, re-runnable harness (D-03) | This phase | FWL-04 becomes machine-checkable and re-verifiable, not a one-time claim |

**Deprecated/outdated:**
- The Phase-3 "references must be one level deep / no reference-to-reference linking"
  reading: not a validator rule and not restated as a hard rule in the current docs; the
  index->leaf navigation pattern is the intended SKEL-04 design. Re-verify at plan time.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The 24 Fowler 2nd-ed bad-smell NAMES are: Mysterious Name, Duplicated Code, Long Function, Long Parameter List, Global Data, Mutable Data, Divergent Change, Shotgun Surgery, Feature Envy, Data Clumps, Primitive Obsession, Repeated Switches, Loops, Lazy Element, Speculative Generality, Temporary Field, Message Chains, Middle Man, Insider Trading, Large Class, Alternative Classes with Different Interfaces, Data Class, Refused Bequest, Comments | Validation Architecture / smells.md skeleton | Wrong name/count breaks FWL-02 (target=24). Orientation only; the owner e-book confirms exact 2nd-ed wording + set at D-07 |
| A2 | "basic" tag holds ~9-11 of the 66 (the Ch.6 foundational set); distribution across the 20 tags is uneven | Tag-group split analysis / Pitfall 1 | Mis-sizes leaves. Confirm with per-entry tag data at plan time |
| A3 | A one-primary-tag partition of the 20 tags collapses toward the 7 chapter tags | Tag-group split analysis / Open Question 1 | If wrong, the 20-leaf default is fine as-is; low risk (it is a recommendation to re-check, not a change) |
| A4 | A hand-rolled ~40-line extractor beats adding `codedown`/`typescript-docs-verifier` | Standard Stack / Don't Hand-Roll | If a maintained tool is preferred, run the legitimacy gate first; low risk |

**Not assumed (locked/cited):** the 66 names + aliases + 20 tag names + the 5 print-absent
entries (from `refactoring-com-overview.md`, owner-confirmed); the Ch.2 topic set and the
count 24 (from CONTEXT D-04/D-05 and REQUIREMENTS, owner-confirmed); toolchain versions
(verified via `npm view` / local `--version`).

## Open Questions

1. **Tag-group bucketing and leaf count (D-01, the top planning decision)**
   - What we know: 20 tag names + 66 names/aliases are known. Each refactoring carries
     MULTIPLE tags. The tags mix 7 coarse chapter tags (basic, encapsulation,
     moving-features, organizing-data, simplify-conditional-logic, refactoring-apis,
     dealing-with-inheritance) with 13 fine operation tags (extract, inline, remove,
     rename, collections, delegation, errors, parameters, fragments, grouping-function,
     immutability, split-phase, variables).
   - What's unclear: the PRIMARY tag per multi-tagged entry, hence the exact leaf set and
     each leaf's size. The public catalog page does NOT expose per-entry tags in static
     HTML (they live in a client-side filter panel).
   - Recommendation: at the D-07 checkpoint, capture the per-entry tag list from the owner
     e-book (or fetch individual refactoring.com entry pages), then choose: (a) 7
     chapter-tag leaves (cleaner partition, matches book chapters + refactoring.com, ~9-11
     entries each -- effectively D-01's COMPETING "book-chapter" option), or (b) all 20
     tag-groups with a documented primary-tag tiebreaker (finer disclosure, uneven sizes).
     Either satisfies "adds leaves without re-touching SKILL.md." Surface the choice; do
     not let `--auto` silently lock it (HIGH-impact, sets the catalog's shape).

2. **Harness reproducibility: pin `typescript` or use global `tsc`?**
   - What we know: global `tsc 6.0.3` works today; no `package.json` is tracked.
   - Recommendation: pin `typescript@6.0.3` as a workspace devDependency + a `typecheck`
     script for a public, reproducible FWL-04 claim. Low stakes; Claude's discretion (D-03).

3. **`smells.md` cross-link anchors before all leaves exist**
   - What we know: smell rows cross-link into fowler-catalog entries (D-04); both are
     authored this phase.
   - Recommendation: sequence the smell table AFTER the leaves (or in the same wave) so its
     `#anchor` targets resolve (Phase-3 "wave sequencing to resolve dangling pointers").

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| TypeScript (`tsc`) | FWL-04 compile gate | yes | 6.0.3 (global) | Pin `typescript@6.0.3` in the workspace |
| Node.js | extractor `.mjs` + driving tsc | yes | v24.18.0 | -- |
| `claude plugin validate` | regression gate | yes (Claude Code 2.1.x) | -- | -- |
| Owner e-book/web oracle | ALL content (FWL-01/02/03) | via D-07 AskUserQuestion at execution | ISBN 9780135425664 | none -- gate is blocking by design |

**Missing dependencies with no fallback:** none for tooling. The oracle is "missing" only
in the sense that it is owner-held and reached through the mandatory D-07 checkpoint at
execution -- this is a designed pause, not a blocker to planning.

**Missing dependencies with fallback:** local `typescript` pin (fallback to global tsc).

## Validation Architecture

> nyquist_validation is enabled (`.planning/config.json` -> `workflow.nyquist_validation:
> true`). This section maps FWL-01..FWL-04 to automated checks. There is no unit-test
> framework in this repo; the validation instrument is a battery of `rg`/Node checkers plus
> the `tsc --strict` harness (the Phase-3 "mechanical rg gate battery" pattern).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None (docs/skill repo). Checkers: `rg` gates + Node `.mjs` + `tsc --strict --noEmit` |
| Config file | `.claude/skills/lz-refactor-workspace/tsconfig.json` (Wave 0) |
| Quick run command | `rg` presence/ASCII gates over changed files |
| Full suite command | extractor -> `tsc --strict --noEmit -p tsconfig.json` + all `rg` gates + `claude plugin validate .` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command / Check | File Exists? |
|--------|----------|-----------|---------------------------|-------------|
| FWL-01 | All 66 entries present, each with the 5 contract fields; 5 print-absent + Split Phase provenance-labeled | structural | Node checker: for each of the 66 canonical names (from `refactoring-com-overview.md`) assert exactly one entry heading across `fowler-catalog/*.md`; assert the 5 "+" entries carry `[web-only]` and Split Phase carries `[web-example]`; assert each entry block has Motivation + Mechanics + at least one `ts`/`js` fence | Wave 0 |
| FWL-02 | 24 Fowler smell rows, each mapped to >=1 candidate refactoring that resolves | structural | Node/`rg` checker: count `Fowler`-tagged rows == 24; every candidate cross-link path+anchor resolves to a real fowler-catalog entry | Wave 0 |
| FWL-03 | Ch.2 topic set present with attributions | presence | `rg` topic-presence gate for: definition, two hats, rule of three, preparatory, comprehension, litter-pickup, performance, YAGNI (each on one line) | Wave 0 |
| FWL-04 | Every TS sample `tsc --strict`-clean | compile | `extract-samples.mjs` -> `tsc --strict --noEmit -p tsconfig.json` exits 0; report count of modules compiled and any `ts ignore`-excluded fences | Wave 0 |
| (hygiene) | ASCII-only; no verbatim prose; work email absent (DST-04, public-repo) | negative | `rg -n "[^\x00-\x7F]"` empty; work-email allowlist gate (enumerate emails, filter approved gmail, assert empty remainder); manual/heuristic no-verbatim-prose scan | Wave 0 |

### Sampling Rate
- **Per task commit:** ASCII gate + FWL-01 presence checker over the file(s) touched.
- **Per wave merge:** full extractor + `tsc --strict --noEmit` + link-resolution + smell/topic checkers.
- **Phase gate:** full suite green + `claude plugin validate .` clean before `/gsd:verify-work`.

### Wave 0 Gaps
- [ ] `.claude/skills/lz-refactor-workspace/tsconfig.json` -- strict compile config (FWL-04)
- [ ] `.claude/skills/lz-refactor-workspace/extract-samples.mjs` -- fence extractor (FWL-04)
- [ ] `.claude/skills/lz-refactor-workspace/package.json` -- optional `typescript` pin + `typecheck` script
- [ ] A catalog-completeness checker `.mjs` (66 names + provenance tags + contract fields) -- FWL-01
- [ ] A cross-link / topic-presence / ASCII / work-email gate (can be one `.mjs` or a shell battery) -- FWL-02/03 + hygiene

*(Model these on `.claude/skills/lz-tpp-workspace/eval-status.mjs`: shebang, `node:fs`/`path`,
small `exists`/`nonEmpty` helpers, a final `SUMMARY:` line, non-zero exit on failure. Keep
them throwaway checkers, not a framework -- ponytail.)*

## Security Domain

> `security_enforcement` is absent from `.planning/config.json` (treat as enabled). This is
> a docs-authoring phase with a dev-only compile harness: no runtime, no network, no user
> input, no auth/session/crypto surface. Standard application ASVS categories (V2/V3/V4/V6)
> do not apply. The real "security" surface here is intellectual-property hygiene and
> supply-chain.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | -- |
| V3 Session Management | no | -- |
| V4 Access Control | no | -- |
| V5 Input Validation | no (no runtime input) | -- |
| V6 Cryptography | no | -- |
| V14 Config / Dependencies (supply chain) | yes | Pin `typescript@6.0.3`; add no other dependency; legitimacy gate any proposed package |

### Known Threat Patterns for this stack
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Copyright infringement (verbatim Fowler prose/code) | Information Disclosure / legal | DST-04: original prose + original examples only; refactoring.com excerpts are orientation, never copied; no-verbatim scan at the phase gate |
| Private work-email leak into a public repo | Information Disclosure | Work-email allowlist gate (enumerate emails, subtract approved gmail, assert empty) -- recurred twice in Phase 4; keep the gate |
| Fabricated catalog content bypassing the oracle | Tampering (integrity of the reference) | D-07 AskUserQuestion checkpoint BEFORE any content; verify in tag-group batches; blocking even under `--auto`/`--chain` |
| Supply-chain (a slopsquatted extractor dependency) | Tampering | Add no new runtime dep; hand-rolled extractor + first-party `typescript` only |

## Sources

### Primary (HIGH confidence)
- Local `plugins/lz-tdd/skills/lz-tpp/references/` (`transformations.md`,
  `typescript-and-tco.md`, `fibonacci-worked-example.md`) -- in-repo, shipped precedent:
  reference granularity, provenance/Sources discipline, `tsc --strict`-clean TS pattern,
  ASCII normalization.
- Local Phase-6 stubs (`references/fowler-catalog/README.md`, `smells.md`, `principles.md`)
  and `06-PATTERNS.md` -- the content contracts to fill and the SHAPE analogs.
- Local `.planning/phases/03-lz-tpp-skill-authoring/03-LEARNINGS.md` + `03-03-SUMMARY.md` --
  the confirmatory per-block `tsc` extraction, the illustrative-vs-compilable split, the
  line-wrap and description-cap lessons, toolchain (Node v24.18.0, tsc 6.0.3).
- `.planning/research/refactoring-com-overview.md` -- 66 names + 1st-ed aliases + 20 tags +
  5 print-absent entries (owner-confirmed count 66).
- `docs.claude.com/en/docs/claude-code/skills` (fetched via markdown.new 2026-07-04) --
  current Agent Skills guidance: SKILL.md as overview+navigation, supporting files
  (incl. subdirectories), 500-line SKILL.md cap, "move detail to separate files."
- `npm view typescript version` -> 6.0.3; local `tsc --version` 6.0.3, `node --version`
  v24.18.0 (verified 2026-07-04).

### Secondary (MEDIUM confidence)
- `refactoring.com/catalog/` (fetched via markdown.new 2026-07-04) -- confirms the 20 tag
  names and the 66-entry list with inline aliases; per-entry tags are NOT in the static
  HTML (client-side filter panel).

### Tertiary (LOW confidence)
- The 24 bad-smell NAMES (A1) and the tag-distribution estimate (A2) -- training knowledge,
  widely published; oracle-confirmed at D-07. Extractor-vs-library tradeoff (A4) -- reasoned.

## Metadata

**Confidence breakdown:**
- Standard stack / toolchain: HIGH -- versions verified locally + on the registry.
- Architecture / structure: HIGH -- in-repo shipped analog + current docs verified; the
  index->leaf tension is resolved and flagged for a plan-time re-check.
- Tag-group bucketing: MEDIUM/LOW -- per-entry tags not statically available; the primary
  decision is deferred to the D-07 oracle checkpoint (as D-01 intends).
- Validation: HIGH -- FWL-01..04 all map to concrete, runnable checks; the harness is the
  FWL-04 instrument.
- Content (mechanics/motivations/smell text/principles): OUT OF RESEARCH SCOPE -- gated by
  D-07; not fabricated here.

**Research date:** 2026-07-04
**Valid until:** 2026-08-03 (30 days). Re-verify the Agent Skills progressive-disclosure
guidance and `typescript` `latest` at plan time if the gap widens.
