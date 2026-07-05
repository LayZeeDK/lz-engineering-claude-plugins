# Phase 8: Kerievsky Catalog (Refactoring to Patterns) - Research

**Researched:** 2026-07-05
**Domain:** Markdown skill-authoring -- pattern-directed refactoring catalog (Kerievsky) layered on the LOCKED Phase-7 Fowler model, clean-room-oracle verified
**Confidence:** HIGH (architecture + harness + validation -- all reuse of shipped Phase-7 assets); MEDIUM (catalog inventory names/chapters -- CITED from Kerievsky's own catalog; GoF targets + direction + composed-Fowler cross-map -- ASSUMED, oracle-confirmed at execution)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions (D-01..D-08, verbatim)

- **D-01 [architecture]:** Author the Kerievsky layer as per-refactoring LEAF files `references/kerievsky-catalog/<slug>.md` (x27) behind the existing thin `kerievsky-catalog/README.md` index -- exactly mirroring the LOCKED Fowler per-refactoring-leaf + thin-index model (07-ROUTING-ARCHITECTURE.md). Group the index by Kerievsky's OWN six book chapters: Creation (Ch.6), Simplification (Ch.7), Generalization (Ch.8), Protection (Ch.9), Accumulation (Ch.10), Utilities (Ch.11). SKILL.md is NOT re-touched -- its `references/kerievsky-catalog/README.md` pointer already resolves. COMPETING (rejected at auto-lock, re-openable at plan time): split by direction (To/Towards/Away) -- rejected because direction is a per-leaf FIELD (D-03), not a file axis; split by GoF pattern family -- rejected because it fragments the catalog and diverges from the book's own structure.

- **D-02 [architecture]:** Each Kerievsky leaf mirrors the LOCKED Fowler leaf contract (`Use when:` / `## Motivation` / `## Mechanics` / `## Example` / optional `## Watch for`) PLUS three Kerievsky-specific fields: **Composed Fowler primitive(s)** (KRV-01 -- cross-link to `../fowler-catalog/<slug>.md#<slug>`, the always-present H1 anchor), **Direction** (KRV-02 -- To / Towards / Away), and **GoF pattern** (KRV-04 -- vocabulary name only; see D-04). Intent replaces/leads the Motivation wording for the pattern-directed framing.

- **D-03 [content]:** Capture To / Towards / Away as a per-leaf `Direction:` field, annotated in the index rows. The three named de-patterning (Away) cases -- **Inline Singleton**, **Move Accumulation to Visitor** (away from Iterator), and **Encapsulate Composite with Builder** (away from Composite) -- carry an explicit "refactor AWAY from `<pattern>`" callout. The extended harness asserts all 27 leaves carry a Direction value and that these 3 Away cases are present and flagged.

- **D-04 [oracle]:** Cross-reference GoF by pattern NAME (vocabulary only). The target pattern for each refactoring is stated in the Kerievsky book and is oracle-verifiable by `oracle-reviewer`; the pattern name plus at most a 1-line own-words intent are common-knowledge facts. NO GoF prose or code is reproduced (DST-04); `check-hygiene` guards this. **Sourcing / fallback:** GoF is NOT in `.oracle/`, so AskUserQuestion is the FALLBACK ONLY -- fired for a specific GoF target the Kerievsky oracle cannot settle, NOT for pattern names generally. **Re-open note:** name-only vocabulary is the safe default; a richer GoF intent line is an additive, reversible AskUserQuestion enhancement -- surface at plan review, do not pre-build.

- **D-05 [content]:** Fold Kerievsky's Ch.4 smells into the existing unified taxonomy (`smells.md` + `smells/`) with source tags, deduplicated against Fowler's 24: Kerievsky-UNIQUE smells -> new `smells/<slug>.md` leaves + new source-tagged index rows in the LOCKED navigation-only shape; OVERLAP smells -> deduped: NO new leaf/row, add a source tag + an "also named by Kerievsky: `<name>`" note to the existing Fowler leaf (and, where apt, add Kerievsky candidate refactorings to that leaf's candidate map). Introduce a `Fowler` / `Kerievsky` / `both` source tag -- ADDING a tag only, never rewriting the Phase-7 recognize-by cues. The exact per-smell dedup MAP is decided DURING the oracle-gated loop against Ch.4 -- NOT blind at discuss time. Extend `check-smells` to assert the fold.

- **D-06 [content]:** Re-render each Kerievsky example from the book's Java into ONE compact original TS/JS before/after, mirroring the LOCKED Fowler example discipline: 5-15 lines per side, only the code the refactoring touches, hard cap of 2 examples, authored in a domain UNRELATED to the source with original identifiers to avoid `too_close_to_source`; every example `tsc --strict`-clean via `extract-samples.mjs`. For pattern-heavy refactorings whose teaching lives in intermediate states, use the LOCKED overflow rule -- push an evolving `<slug>-walkthrough.md` loaded only in explain-in-depth mode; the leaf keeps the compact before/after. Behavior-preservation AND full-strength DST-04 near-verbatim are gated by `oracle-reviewer`.

- **D-07 [oracle]:** Source and verify ALL Kerievsky catalog + smell content via the clean-room `oracle`/`oracle-reviewer` loop (Model C) over `.oracle/refactoring-to-patterns/index.md`, IDENTICAL to Phase 7: author BLIND; run the DETERMINISTIC layer first; gate fidelity + full-strength DST-04 near-verbatim via the isolated `oracle-reviewer`; revise BLIND; sub-batch ~6-8 leaves per reviewer call in parallel; cap ~3 rounds; escalate non-convergence / `ambiguities` to the owner via AskUserQuestion. The main context NEVER reads `.oracle/` prose (only `ls` for names). Pass a tight per-leaf scope. This SUPERSEDES the `kerievsky-catalog/README.md` stub's "AskUserQuestion oracle-access checkpoint" for the Kerievsky book. Reference only `index.md` + chapter number/topic in `.planning/` artifacts -- never hardcode the book's chapter filenames.

- **D-08 [orchestration]:** The orchestrator (MAIN context) drives the content plans INLINE -- NOT via `gsd-executor`. `gsd-executor` has no `Agent` tool (cannot spawn `oracle`/`oracle-reviewer`) and no `AskUserQuestion` (cannot do owner escalation). Set `branching_strategy=none`, no worktrees (the oracle agents are read-only). The plan MUST encode it or execution will fail the same way Phase 7 did.

### Claude's Discretion
Leaf slugs; entry ordering within a chapter group; the exact index annotation format for Direction and GoF pattern; the precise `Composed Fowler primitive(s)` phrasing; whether the harness extension is added to the existing `check-catalog`/`check-smells` or a new `check-kerievsky` (keep it out of the shipped skill surface either way); oracle-reviewer sub-batch size within the ~6-8 guidance; the per-axis rubric anchors passed per reviewer call (default to the Phase-7 canonical anchors, adjusted for pattern-directed content).

### Deferred Ideas (OUT OF SCOPE)
- The coach decision procedure consuming this catalog + taxonomy (mechanical->Fowler, structural->Kerievsky; de-patterning routing) -> Phase 9 (CCH-01..05).
- Beck / Feathers principle-backing references -> Phase 9 (PRIN-01..03).
- Splitting the Kerievsky layer into its own `lz-refactor-to-patterns` skill -> FUT-04 (future milestone).
- A richer per-refactoring GoF intent line (beyond the pattern name) -> re-openable at plan review via a targeted AskUserQuestion (D-04); default ships name-only vocabulary.
- Version bump / README / CHANGELOG -> Phase 10 (DST-*). Evals -> Phase 11 (EVL-*). No SKILL.md router changes.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| KRV-01 | All 27 Kerievsky pattern-directed refactorings -- each with name, intent, distilled mechanics (original words), an original TS/JS example re-rendered from the book's Java, and the Fowler primitive(s) it composes. | Inventory table below (27 names CITED from Kerievsky's catalog; composed-Fowler cross-map ASSUMED, oracle-confirmed). Leaf contract = Phase-7 leaf + 3 fields (D-02). Examples compiled by extended `extract-samples.mjs`; fidelity gated by `oracle-reviewer`. |
| KRV-02 | The To / Towards / Away directions model, with the "refactor AWAY from a pattern" cases called out (Inline Singleton; Move Accumulation to Visitor away from Iterator; Encapsulate Composite with Builder away from Composite). | Per-leaf `Direction:` field (D-03). 3 named Away cases confirmed present in the 27-inventory. Harness asserts Direction on all 27 + flags the 3 Away cases. |
| KRV-03 | Kerievsky's Ch.4 smells (Conditional Complexity, Indecent Exposure, Solution Sprawl, Combinatorial Explosion, Oddball Solution) folded into the unified taxonomy, source-tagged, deduped against Fowler's list. | Ch.4 = 12 smells (CITED: "twelve design smells"). Provisional unique-vs-overlap map below. Fold = additive source tags + new leaves for unique smells (D-05). Extended `check-smells`. Exact dedup map settled at execution vs oracle. |
| KRV-04 | Each Kerievsky refactoring cross-references its target GoF pattern for vocabulary, without reproducing GoF text. | Per-leaf `GoF pattern` field, name-only (D-04). Target-pattern map in inventory (ASSUMED common knowledge, oracle-confirmed). GoF NOT in `.oracle/` -> AskUserQuestion is the fallback for an unresolvable target only. `check-hygiene` guards no-verbatim. |
</phase_requirements>

## Project Constraints (from CLAUDE.md / AGENTS.md / PROJECT.md)

- **ASCII-only** in every committed file (no Unicode/emoji/em-dash/curly-quote). `check-hygiene.mjs` fails on any non-ASCII byte. Applies to leaves, index rows, and harness code.
- **DST-04:** No verbatim Fowler / Kerievsky / GoF prose or code in the shipped tree. Original prose, original code, names, and facts only. Main context never reads `.oracle/` prose.
- **MIT license; public contact `larsbrinknielsen@gmail.com` only.** Work email must never appear (allowlist gate in `check-hygiene.mjs`).
- **`git grep` / `rg` for search** (never the Grep tool); **`npm`** default package manager; **PowerShell Core + Git Bash** on Windows arm64.
- **The shipped skill stays dependency-free Markdown.** All tooling (harness + checkers) lives in the NON-shipped `.claude/skills/lz-refactor-workspace/` and is gitignored per the workspace rules.
- **GSD workflow enforcement:** edits go through a GSD command; this is a planned phase (`/gsd-execute-phase`).

## Summary

Phase 8 is a near-mechanical clone of the already-shipped Phase 7. Every architectural decision -- per-refactoring leaf files behind a thin index, the leaf content contract, the clean-room `oracle` -> deterministic-checks -> `oracle-reviewer` -> revise-blind -> converge loop, the sub-batch/round-cap discipline, the deterministic-checkers-as-test-suite finding, and the main-context-drives-inline orchestration constraint -- is LOCKED and carried forward verbatim. Phase 8 adds exactly three things on top of that machine: (1) 27 Kerievsky pattern-directed refactoring leaves grouped by the book's own six catalog chapters; (2) three Kerievsky-specific leaf fields (Composed Fowler primitive(s), Direction, GoF pattern); and (3) a fold of Kerievsky's 12 Ch.4 smells into the existing unified taxonomy, source-tagged and deduped against Fowler's 24.

The catalog inventory is well-established public knowledge: Kerievsky's own catalog at industriallogic.com lists all 27 refactorings by name, and the book advertises "a catalog of 27 pattern-directed refactorings" and "twelve design smells." The chapter grouping (Creation 6 / Simplification 6 / Generalization 7 / Protection 3 / Accumulation 2 / Utilities 3 = 27) is reconstructed from public sources and must be oracle-confirmed at execution. The GoF target pattern per refactoring, the To/Towards/Away direction per leaf, and the composed-Fowler-primitive cross-map are common-knowledge orientation (tagged ASSUMED) that the `oracle-reviewer` settles authoritatively during the authoring loop -- do not fabricate mechanics from this research; use it to structure the plan.

The `.oracle/refactoring-to-patterns/` book is fully provisioned (verified by `ls`: `index.md` + `12-chapter-4-code-smells.md` + `14-chapter-6-creation.md` through `19-chapter-11-utilities.md`), so the oracle loop runs from the start with no owner provisioning step (unlike Phase 7's mid-phase provisioning). The harness extension is small and additive: point `extract-samples.mjs`, `check-crossrefs.mjs`, and `check-smells.mjs` at the new `kerievsky-catalog/` dir, and add a Kerievsky-name-identity + Direction + Away-case + GoF-field + composed-Fowler-resolution checker (the discretionary choice of a new `check-kerievsky.mjs` vs extending `check-catalog.mjs`).

**Primary recommendation:** Plan Phase 8 as a direct Phase-7 mirror -- Wave 0/1 extends the harness for Kerievsky, then per-chapter authoring waves (6 leaf batches sub-batched ~6-8) run the clean-room loop INLINE from the main context, and a final wave folds Ch.4 smells + finalizes the index and full battery. Encode D-08 (inline orchestration, no worktrees) in the plan or execution fails exactly as Phase 7 did.

## Architectural Responsibility Map

This is a documentation/knowledge skill, not a running app; "tiers" map to content and verification layers.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| 27 pattern-directed refactoring content | Content layer (`kerievsky-catalog/<slug>.md` leaves) | Thin index (`kerievsky-catalog/README.md`) | Progressive disclosure (SKEL-04): heavy content in leaves, navigation in the index; mirrors Fowler catalog. |
| Direction + de-patterning callouts (KRV-02) | Content layer (per-leaf `Direction:` field) | Index annotation | Direction is a per-leaf attribute, not a file axis (D-01/D-03). |
| GoF vocabulary cross-ref (KRV-04) | Content layer (per-leaf `GoF pattern` field) | Owner (AskUserQuestion fallback) | Names are vocabulary; oracle-verified from the Kerievsky book, owner fallback only for an unresolvable target. |
| Composed Fowler primitive cross-links (KRV-01) | Content layer (Kerievsky leaf) -> Fowler catalog leaf (`#<slug>` anchor) | Cross-ref harness | Connects the two catalog layers for Phase-9 routing; the Fowler leaves are the composition targets. |
| Ch.4 smell fold (KRV-03) | Smell taxonomy (`smells.md` + `smells/`) | Kerievsky catalog (candidate targets) | Unique smells become new leaves; overlaps get additive source tags -- keeps the LOCKED navigation-only index shape Phase 9 consumes. |
| Fidelity + no-verbatim verification | Clean-room `oracle-reviewer` (isolated) | `oracle` (own-words lookup) | Semantic fidelity + full-strength DST-04 near-verbatim need the full source; only the isolated agent may hold it (D-07). |
| Deterministic verification (the "test suite") | Non-shipped harness (`.claude/skills/lz-refactor-workspace/`) | -- | Name identity, contract fields, link resolution, `tsc --strict` compile -- cheap layer run before reviewer calls. |
| Loop orchestration | MAIN context (Agent + AskUserQuestion tools) | -- | `gsd-executor` lacks Agent/AskUserQuestion; only the main context can drive the loop (D-08). |

## Standard Stack

No new packages. The phase reuses the Phase-7 toolchain in full.

### Core (all pre-existing, verified)
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| Node.js | 24.18.0 (verified in this session) | Runs the checker battery + `extract-samples.mjs` | Already the workspace runtime; builtins only, no deps. |
| TypeScript (`tsc`) | 6.0.3 (pinned in workspace `package.json`; global `tsc --version` = 6.0.3, verified) | `--strict --noEmit` compile of every fenced example | The FWL-04/KRV-01 example-compile gate. tsconfig `lib: ["es2021"]` (no DOM) -- examples must be pure. |
| `oracle-reviewer` agent | shipped (`.claude/agents/oracle-reviewer.md`; `tools: Read, Glob`, `model: opus`, verified) | Clean-room fidelity + DST-04 near-verbatim gate | Isolated agent allowed to hold full source; verdict never carries prose. |
| `oracle` agent | shipped (`.claude/agents/oracle.md`, verified present) | Own-words open-ended lookups from the source | Reads `.oracle/` in its own context. |

### Supporting (existing checker battery to EXTEND)
| File | Purpose | Extension needed for Phase 8 |
|------|---------|------------------------------|
| `extract-samples.mjs` | Extract + `tsc --strict` compile every `ts`/`typescript` fence in `fowler-catalog/` | Add `kerievsky-catalog/` (and any `*-walkthrough.md`) to the walked dirs; namespace sample filenames per catalog to avoid slug collisions. |
| `tools/check-catalog.mjs` | 62-name identity + leaf-contract + provenance for Fowler | Either extend to a second catalog or add a sibling `check-kerievsky.mjs` (discretion, D-08 note: keep out of shipped surface). |
| `tools/check-smells.mjs` | 24-smell identity + candidate-link resolution + navigation index | Add Kerievsky-unique smell names; source-tag validity; broaden candidate-link regex to also resolve `kerievsky-catalog/` targets; assert no un-deduped duplicate. |
| `tools/check-crossrefs.mjs` | Every intra-repo `.md` link resolves; inverse-of mutuality | Add `kerievsky-catalog/` leaves to `sourceFiles` so composed-Fowler links (`../fowler-catalog/<slug>.md#<slug>`) are resolution-checked. |
| `tools/check-hygiene.mjs` | ASCII-only + work-email allowlist + no-verbatim WARN | Walks `references/` already; picks up new leaves automatically. No change required. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Extend `check-catalog.mjs` for both catalogs | New `check-kerievsky.mjs` | Separate file keeps the Fowler 62-scope checker untouched and makes the Kerievsky assertions (Direction, Away cases, GoF field, composed-Fowler resolution) legible. RECOMMENDED -- fewer regressions to the shipped-verified Phase-7 gate; add its invocation to the workspace `check` script. |
| Namespace sample files by catalog | Keep flat `${leaf}-${n}.ts` | Flat naming risks a Kerievsky slug colliding with a Fowler slug and silently overwriting a module (false green). Namespacing (e.g. `kerievsky-<leaf>-<n>.ts`) is the safe default. |

## Package Legitimacy Audit

**No external packages are installed in this phase.** The shipped skill is dependency-free Markdown; the non-shipped workspace already pins its sole dependency (`typescript@6.0.3`) from Phase 7. Nothing new enters the registry surface, so the slopcheck / registry-verification gate is N/A. If the planner adds a new workspace devDependency (not anticipated), run the Package Legitimacy Gate before install; otherwise this section is intentionally empty.

| Package | Registry | Disposition |
|---------|----------|-------------|
| typescript@6.0.3 | npm (pre-existing, Phase-7-verified) | Unchanged -- no new install |

## Kerievsky Catalog Inventory (KRV-01, KRV-02, KRV-04)

All 27 names are CITED from Kerievsky's own catalog (industriallogic.com) and the book's advertised "catalog of 27 pattern-directed refactorings." Chapter grouping is reconstructed from public sources and MUST be oracle-confirmed at execution (the `.oracle/` chapter files 14-19 confirm the six chapter TITLES: Creation, Simplification, Generalization, Protection, Accumulation, Utilities -- verified by `ls`, filenames only). GoF target, Direction, and composed-Fowler primitives are ASSUMED orientation (common knowledge) -- the `oracle-reviewer` settles them authoritatively; do not treat this table as final mechanics.

Direction legend: **Towards** = default (build toward a pattern); **Away** = de-patterning (the 3 named cases per D-03). The precise To-vs-Towards granularity per leaf is oracle-settled.

### Ch.6 Creation (6)
| # | Refactoring | GoF / target pattern [ASSUMED] | Direction | Likely composed Fowler primitive(s) [ASSUMED -> cross-map] |
|---|-------------|-------------------------------|-----------|------------------------------------------------------------|
| 1 | Replace Constructors with Creation Methods | Creation Method (Kerievsky's term; not GoF) | Towards | replace-constructor-with-factory-function, change-function-declaration |
| 2 | Move Creation Knowledge to Factory | Factory | Towards | move-function, extract-class, move-field |
| 3 | Encapsulate Classes with Factory | Factory | Towards | move-function, change-function-declaration, hide-delegate |
| 4 | Introduce Polymorphic Creation with Factory Method | Factory Method | Towards | pull-up-method, extract-function, replace-constructor-with-factory-function |
| 5 | Encapsulate Composite with Builder | Builder | **Away** (from Composite, per D-03) | extract-class, move-function, hide-delegate |
| 6 | Inline Singleton | Singleton | **Away** (from Singleton) | inline-function, move-function, move-field, change-function-declaration |

### Ch.7 Simplification (6)
| # | Refactoring | GoF / target pattern [ASSUMED] | Direction | Likely composed Fowler primitive(s) [ASSUMED] |
|---|-------------|-------------------------------|-----------|------------------------------------------------|
| 7 | Compose Method | Composed Method (Beck; not GoF) | Towards | extract-function, inline-function, replace-temp-with-query, rename-variable |
| 8 | Replace Conditional Logic with Strategy | Strategy | Towards | replace-conditional-with-polymorphism, extract-class, replace-constructor-with-factory-function |
| 9 | Move Embellishment to Decorator | Decorator | Towards | extract-class, move-function, replace-superclass-with-delegate |
| 10 | Replace State-Altering Conditionals with State | State | Towards | replace-conditional-with-polymorphism, extract-class, replace-type-code-with-subclasses |
| 11 | Replace Implicit Tree with Composite | Composite | Towards | extract-class, replace-primitive-with-object, move-function |
| 12 | Replace Conditional Dispatcher with Command | Command | Towards | replace-function-with-command, extract-class, move-function |

### Ch.8 Generalization (7)
| # | Refactoring | GoF / target pattern [ASSUMED] | Direction | Likely composed Fowler primitive(s) [ASSUMED] |
|---|-------------|-------------------------------|-----------|------------------------------------------------|
| 13 | Form Template Method | Template Method | Towards | pull-up-method, extract-function, slide-statements, change-function-declaration |
| 14 | Extract Composite | Composite | Towards | extract-superclass, pull-up-field, pull-up-method |
| 15 | Replace One/Many Distinctions with Composite | Composite | Towards | extract-class, change-function-declaration, encapsulate-collection |
| 16 | Replace Hard-Coded Notifications with Observer | Observer | Towards | extract-class, move-function, change-function-declaration |
| 17 | Unify Interfaces with Adapter | Adapter | Towards | extract-superclass, change-function-declaration |
| 18 | Extract Adapter | Adapter | Towards | extract-class, move-function, extract-superclass |
| 19 | Replace Implicit Language with Interpreter | Interpreter | Towards | extract-class, replace-conditional-with-polymorphism, move-function (pattern-heavy -- overflow-walkthrough candidate) |

### Ch.9 Protection (3)
| # | Refactoring | GoF / target pattern [ASSUMED] | Direction | Likely composed Fowler primitive(s) [ASSUMED] |
|---|-------------|-------------------------------|-----------|------------------------------------------------|
| 20 | Replace Type Code with Class | Class / type-safe value (not GoF) | Towards | replace-primitive-with-object, replace-type-code-with-subclasses, encapsulate-variable |
| 21 | Limit Instantiation with Singleton | Singleton | Towards | replace-constructor-with-factory-function, change-function-declaration |
| 22 | Introduce Null Object | Null Object (Woolf; not classic GoF) | Towards | introduce-special-case (Fowler 2nd-ed name for Introduce Null Object), replace-conditional-with-polymorphism |

### Ch.10 Accumulation (2)
| # | Refactoring | GoF / target pattern [ASSUMED] | Direction | Likely composed Fowler primitive(s) [ASSUMED] |
|---|-------------|-------------------------------|-----------|------------------------------------------------|
| 23 | Move Accumulation to Collecting Parameter | Collecting Parameter (Beck; not GoF) | Towards | extract-function, change-function-declaration, move-statements-into-function, split-loop |
| 24 | Move Accumulation to Visitor | Visitor | **Away** (from Iterator, per D-03) | extract-class, move-function, change-function-declaration |

### Ch.11 Utilities (3)
| # | Refactoring | GoF / target pattern [ASSUMED] | Direction | Likely composed Fowler primitive(s) [ASSUMED] |
|---|-------------|-------------------------------|-----------|------------------------------------------------|
| 25 | Chain Constructors | (utility -- no target pattern) | Towards | pull-up-constructor-body, remove-dead-code, substitute-algorithm, change-function-declaration |
| 26 | Unify Interfaces | (utility -- no target pattern) | Towards | change-function-declaration, extract-superclass |
| 27 | Extract Parameter | (utility -- no target pattern) | Towards | extract-variable, change-function-declaration, parameterize-function |

**Count check:** 6 + 6 + 7 + 3 + 2 + 3 = **27**. This is the canonical NAMES array the harness needs (name identity, not cardinality -- mirror `check-catalog.mjs`'s `NAMES` pattern).

**The 3 named de-patterning (Away) cases (KRV-02, LOCKED D-03), confirmed present in the 27:**
- **Inline Singleton** (#6) -- away from Singleton.
- **Move Accumulation to Visitor** (#24) -- away from Iterator (per D-03 framing).
- **Encapsulate Composite with Builder** (#5) -- away from Composite (per D-03 framing).

**Note on non-GoF targets:** Several targets are patterns NOT in the classic GoF 23 -- Creation Method, Composed Method (Beck), Collecting Parameter (Beck), Null Object (Woolf), and the plain "type-safe Class" of Replace Type Code with Class; three Utilities target no pattern at all. KRV-04 says cross-reference "its target GoF pattern for vocabulary" -- for these the `GoF pattern` field should name the pattern honestly (or "n/a -- utility") rather than force a GoF label. Flag as an open question for the planner (see Open Questions).

## How the LOCKED Phase-7 Model Is Reused (D-01, D-02, D-06, D-07, D-08)

Phase 8 inherits the entire Phase-7 machine. Reused verbatim:

**Structure (D-01):** Thin index (`kerievsky-catalog/README.md`, already scaffolded) + one leaf per refactoring (`kerievsky-catalog/<slug>.md`). Index grouped by the six book chapters. No SKILL.md edit -- the pointer already resolves.

**Leaf contract (D-02):** The LOCKED Fowler leaf shape --
- `# <Name>` (single H1 -- the always-present `#<slug>` anchor for cross-links)
- `Use when:` one-line selector (mirrored into the index row)
- `## Motivation` (intent leads it for the pattern-directed framing)
- `## Mechanics` (4-8 numbered verb-first steps, distilled, name the test/compile checkpoint)
- `## Example` (compact TS before/after, 5-15 lines/side, hard cap 2)
- optional `## Watch for`
- PLUS three Kerievsky fields: **Composed Fowler primitive(s)** (cross-links to `../fowler-catalog/<slug>.md#<slug>`), **Direction:** (To/Towards/Away), **GoF pattern:** (name only).

**Example discipline (D-06):** Re-render from Java to compact original TS; distinct domain + original identifiers to dodge `too_close_to_source`; pure examples only (no DOM/`console` -- workspace tsconfig `lib: ["es2021"]`, a Phase-7 lesson); overflow rule for pattern-heavy refactorings (`<slug>-walkthrough.md`, explain-in-depth only) -- Interpreter (#19) and possibly State (#10)/Command (#12) are the likely overflow candidates.

**The clean-room loop (D-07), per chapter/batch:**
1. Draft leaves BLIND (public knowledge + this research's structure), in the locked format.
2. Run the DETERMINISTIC layer first (extended `extract-samples` tsc + name-identity + contract + cross-ref + hygiene) -- cheap, catches format/compile/link breaks before spending reviewer calls.
3. Spawn `oracle-reviewer` over drafts + `.oracle/refactoring-to-patterns/index.md` scoped by chapter/topic, sub-batched ~6-8 leaves in parallel, with per-axis anchors (default to Phase-7 canonical anchors adjusted for pattern-directed content).
4. Revise BLIND from the directives (never seeing the source).
5. Cap ~3 rounds; on non-convergence / `ambiguities` escalate the specific entry to the owner via AskUserQuestion.
6. Commit.

**Orchestration (D-08):** The MAIN context drives this loop INLINE. `gsd-executor` cannot (no Agent tool to spawn oracle agents, no AskUserQuestion for escalation). `branching_strategy=none` (already set in config.json), no worktrees (oracle agents read-only). The plan MUST encode this -- it is the #1 Phase-7 execution-blocking anti-pattern.

**Rubric anchors (per-axis, from 07-ORACLE-MODEL, adjust for pattern-directed content):** mechanics (all steps, safe order, faithful branches/checkpoints, cross-ref aptness), example (compiles, behavior-preserving, representative, independent of source), motivation, applicability, spirit/judgment. For Kerievsky add: **direction** (is the To/Towards/Away correct?), **composed-primitive aptness** (are the cited Fowler primitives the ones the source actually composes? -- this is the mechanics-axis cross-ref-aptness anchor applied to the composed-primitive list), and **target-pattern correctness** (does the leaf name the pattern the source targets?).

## Ch.4 Smell Fold + Dedup (KRV-03, D-05)

Kerievsky Ch.4 = **12 smells** (CITED: the book advertises "twelve design smells"). The 12 (names CITED from Kerievsky's Ch.4, common knowledge -- exact list oracle-confirmed):

| # | Kerievsky Ch.4 smell | Provisional disposition vs Fowler's 24 | Existing Fowler leaf (if overlap) |
|---|----------------------|----------------------------------------|-----------------------------------|
| 1 | Duplicated Code | OVERLAP | `smells/duplicated-code.md` |
| 2 | Long Method | OVERLAP (Fowler 2nd-ed: "Long Function") | `smells/long-function.md` |
| 3 | Conditional Complexity | PROVISIONAL: unique OR overlap w/ Repeated Switches | `smells/repeated-switches.md` (candidate) |
| 4 | Primitive Obsession | OVERLAP | `smells/primitive-obsession.md` |
| 5 | Indecent Exposure | UNIQUE (Kerievsky) | new `smells/indecent-exposure.md` |
| 6 | Solution Sprawl | UNIQUE (Kerievsky) | new `smells/solution-sprawl.md` |
| 7 | Alternative Classes with Different Interfaces | OVERLAP | `smells/alternative-classes-with-different-interfaces.md` |
| 8 | Lazy Class | OVERLAP (Fowler 2nd-ed: "Lazy Element") | `smells/lazy-element.md` |
| 9 | Large Class | OVERLAP | `smells/large-class.md` |
| 10 | Switch Statements | OVERLAP (Fowler 2nd-ed: "Repeated Switches") | `smells/repeated-switches.md` |
| 11 | Combinatorial Explosion | UNIQUE (Kerievsky) | new `smells/combinatorial-explosion.md` |
| 12 | Oddball Solution | UNIQUE (Kerievsky) | new `smells/oddball-solution.md` |

**Provisional tally:** ~4-5 UNIQUE (Indecent Exposure, Solution Sprawl, Combinatorial Explosion, Oddball Solution, and possibly Conditional Complexity) become new source-tagged `smells/<slug>.md` leaves + navigation-only index rows; ~7-8 OVERLAP smells get an additive source tag + "also named by Kerievsky: `<name>`" note on the existing Fowler leaf (and, where apt, Kerievsky pattern-directed candidate refactorings added to that leaf's candidate map). **This map is PROVISIONAL -- the exact per-smell dedup is settled during the oracle-gated loop against Ch.4 (D-05), not from this research.**

**Fold mechanics (D-05):**
- Introduce a `Fowler` / `Kerievsky` / `both` source tag. On overlaps the existing Fowler leaf's tag becomes `both`; the recognize-by cue is NEVER rewritten (additive only -- reconciles Phase-7 D-04's "fold without re-touching the rows").
- New unique-smell leaves follow the LOCKED smell-leaf contract: `# <Smell>`, `Recognize by:` (mirrored to index), `## How to recognize`, `## Why it's a problem`, `## Candidate refactorings` (each: link + "pick when <discriminator>").
- **Candidate targets for the unique Kerievsky smells will mostly be Kerievsky pattern-directed refactorings** (e.g. Conditional Complexity -> Replace Conditional Logic with Strategy / Replace State-Altering Conditionals with State / Move Embellishment to Decorator; Combinatorial Explosion -> Replace Implicit Language with Interpreter; Oddball Solution -> Unify Interfaces with Adapter / Introduce Null Object; Solution Sprawl -> Move Creation Knowledge to Factory / Move Accumulation to Collecting Parameter; Indecent Exposure -> Encapsulate Classes with Factory). **This is why `check-smells.mjs`'s candidate-link regex (currently `fowler-catalog/`-only) MUST be broadened to also resolve `kerievsky-catalog/` targets** -- otherwise a unique smell whose candidates are all Kerievsky refactorings would false-fail with "no candidate-refactoring links."
- Learning carried forward: the candidate map is where smell drafts drift most (12/24 Fowler smell leaves needed revision, mostly candidate completeness/aptness). Budget extra oracle rounds for the smell fold.

## Harness Extension (KRV verification)

The deterministic layer is the phase's "test suite" (see Validation Architecture). Concrete extensions, keeping everything in the NON-shipped `.claude/skills/lz-refactor-workspace/`:

**1. `extract-samples.mjs` (KRV-01 example compile) -- REQUIRED, currently Fowler-only:**
- Add `references/kerievsky-catalog/` (and any `*-walkthrough.md`) to the walked directory set.
- Namespace output filenames by catalog (e.g. prefix `kerievsky-`) so a Kerievsky slug cannot collide with / overwrite a Fowler sample module (false green).
- No tsconfig change -- `samples/**/*.ts` already globbed; `lib: ["es2021"]` (pure examples only).

**2. New `check-kerievsky.mjs` (RECOMMENDED over extending `check-catalog.mjs`) -- asserts:**
- All 27 canonical Kerievsky names present EXACTLY once as a leaf H1 (identity, not cardinality); filename = kebab-slug of the name; no dupes; no unknown/typo heading.
- Each leaf carries the contract fields: `Use when:`, `## Motivation`, `## Mechanics`, `## Example` with >=1 ts/js fence (mirror `check-catalog.mjs`).
- Each leaf carries a **`Direction:`** field with a value in {To, Towards, Away} (KRV-02).
- The **3 named Away cases** (Inline Singleton, Move Accumulation to Visitor, Encapsulate Composite with Builder) are present AND their leaves carry an Away callout (KRV-02).
- Each leaf carries a **`GoF pattern:`** field (name present; KRV-04) -- allow an explicit "n/a -- utility" for the utility refactorings (see Open Questions).
- Each leaf carries >=1 **Composed Fowler primitive** cross-link matching `../fowler-catalog/<slug>.md#<slug>` (presence here; RESOLUTION is `check-crossrefs`'s job).
- Index-row mirror: each leaf's `Use when:` appears in a `kerievsky-catalog/README.md` row that links to the leaf (mirror the Fowler README-mirror check).

**3. `check-crossrefs.mjs` (composed-Fowler-link resolution) -- REQUIRED:**
- Add `kerievsky-catalog/` leaves to `sourceFiles`. Then the existing link-resolution logic validates every Kerievsky composed-primitive link's target file exists AND the `#<slug>` anchor resolves. The inverse-of mutuality check is CATALOG-scoped to `fowler-catalog/` and will not misfire on the one-directional Kerievsky->Fowler links -- confirm this scoping holds when adding the dir (the current guard is `path.dirname(targetPath) === CATALOG && path.dirname(srcResolved) === CATALOG`, i.e. Fowler-only, so Kerievsky links are correctly excluded from mutuality).

**4. `check-smells.mjs` (Ch.4 fold) -- REQUIRED:**
- Add the Kerievsky-unique smell names to the expected set (or a separate Kerievsky set); assert each unique smell leaf present once with the smell-leaf contract.
- **Broaden the candidate-link regex** from `fowler-catalog/`-only to also match `kerievsky-catalog/` so unique-smell candidate links resolve (see fold section).
- Assert source-tag validity (`Fowler` / `Kerievsky` / `both`) and no un-deduped duplicate (a Kerievsky smell that overlaps Fowler must NOT also appear as a new leaf).

**5. `check-hygiene.mjs` -- no change** (already walks all of `references/`, picks up new leaves; ASCII + email + no-verbatim WARN apply automatically).

**6. Workspace `package.json` `check` script -- add** `node tools/check-kerievsky.mjs` to the chain.

**Assert identity, not cardinality** (07-ORACLE-MODEL / WR-02 gap): the checkers key on the canonical NAMES array, so a typo or a dropped/renamed refactoring fails loudly rather than passing on a count.

## Architecture Patterns

### Recommended Structure (additions only; existing tree unchanged)
```
plugins/lz-tdd/skills/lz-refactor/references/
  kerievsky-catalog/
    README.md                     # thin index (already scaffolded) -> fill: 6 chapter groups, rows w/ Use-when + Direction + GoF annotation + link
    <slug>.md                     # LEAF x27: Use-when + Motivation(intent) + Mechanics + Example + Direction + GoF pattern + Composed Fowler primitive(s)
    <slug>-walkthrough.md         # OPTIONAL, pattern-heavy only (Interpreter, maybe State/Command); explain-in-depth
  smells.md                       # ADD source-tagged rows for unique Kerievsky smells (navigation-only shape preserved)
  smells/
    indecent-exposure.md          # NEW unique-smell leaves (x~4-5, oracle-confirmed count)
    solution-sprawl.md
    combinatorial-explosion.md
    oddball-solution.md
    <existing Fowler leaf>.md      # ADD source tag + "also named by Kerievsky" note on overlaps (additive)
.claude/skills/lz-refactor-workspace/
  extract-samples.mjs             # EXTEND: walk kerievsky-catalog/
  tools/check-kerievsky.mjs       # NEW
  tools/check-smells.mjs          # EXTEND: Kerievsky smells + kerievsky-catalog candidate links
  tools/check-crossrefs.mjs       # EXTEND: add kerievsky-catalog to sourceFiles
```

### Pattern 1: Composed-primitive cross-link to the Fowler H1 anchor
**What:** A Kerievsky leaf names the Fowler primitives it composes and links each to the Fowler leaf's stable H1 anchor.
**When:** Every Kerievsky leaf (KRV-01, D-02).
**Example (structure, original):**
```md
Composed Fowler primitive(s): [Replace Conditional with Polymorphism](../fowler-catalog/replace-conditional-with-polymorphism.md#replace-conditional-with-polymorphism), [Extract Class](../fowler-catalog/extract-class.md#extract-class)
Direction: Towards
GoF pattern: Strategy
```
(Source: LOCKED cross-link pattern, 07-LEARNINGS "Candidate/inverse cross-links target each leaf's H1 anchor")

### Anti-Patterns to Avoid
- **Reading `.oracle/` prose in the main context.** Firewall breach (DST-04). Only `ls` for filenames; only `oracle-reviewer` reads content.
- **Driving the loop via `gsd-executor`.** It cannot spawn oracle agents or escalate. Main context inline only (D-08).
- **Flat sample filenames across two catalogs.** Slug collision -> silent overwrite -> false-green compile.
- **Forcing a GoF label on a non-GoF/utility target.** Name the real pattern or "n/a"; do not invent a GoF mapping.
- **Rewriting Phase-7 smell recognize-by cues during the fold.** Additive source tags only.
- **Splitting the catalog by direction or GoF family.** Rejected in D-01; direction/GoF are per-leaf fields.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Verify example correctness | A bespoke JS runner / eyeballing | `extract-samples.mjs` + `tsc --strict` (extend to Kerievsky) | Already the FWL-04 gate; catches type errors + the no-DOM pitfall cheaply. |
| Verify catalog completeness | Manual count | Name-identity checker (`check-kerievsky.mjs`, mirror `check-catalog.mjs`) | Identity beats cardinality -- a typo/drop fails loudly. |
| Verify cross-links resolve | Manual link-following | `check-crossrefs.mjs` (add kerievsky dir) | Existing anchor-resolution logic; GitHub-slug rules already implemented. |
| Verify fidelity + no-verbatim | A general-purpose agent / self-review | `oracle-reviewer` (isolated, full-text) | Only it may hold the source; verdict never carries prose. General-purpose agents lack the firewall contract. |
| Generate the index rows | Hand-transcribe 27 rows | A deterministic index generator that reads only public leaves | Phase-7 pattern: guarantees the Use-when mirror is exact; never opens `.oracle/`. |

**Key insight:** Every verification primitive this phase needs already exists and shipped green in Phase 7. Phase 8 is a re-point + additive-checker job, not a new-tooling job.

## Common Pitfalls

### Pitfall 1: extract-samples never compiles Kerievsky examples
**What goes wrong:** `extract-samples.mjs`'s `CATALOG` constant is `fowler-catalog` only; Kerievsky examples silently go uncompiled -> KRV-01 "tsc-clean" is unverified.
**How to avoid:** Extend the walked dirs in Wave 0/1 before authoring; namespace sample filenames per catalog.
**Warning sign:** `extract-samples` module count does not rise after authoring Kerievsky leaves.

### Pitfall 2: check-smells false-fails unique Kerievsky smells
**What goes wrong:** The candidate-link regex only matches `fowler-catalog/`; a unique smell whose candidates are all Kerievsky refactorings reports "no candidate-refactoring links."
**How to avoid:** Broaden the regex to `(fowler|kerievsky)-catalog/` and keep the same resolve logic.

### Pitfall 3: Blind draft accidentally converges on the source example
**What goes wrong:** Textbook scenarios collide; `oracle-reviewer` returns `too_close_to_source` even with no source access (happened twice in Phase 7).
**How to avoid:** Author every example in a domain unrelated to the source with original identifiers; on a `too_close` verdict, fully re-domain blind and re-gate.

### Pitfall 4: Content-correct but token-RED checker
**What goes wrong:** A leaf can be oracle-converged yet fail a checker that keys on a literal token the prose never uses (Phase-7 `check-principles` was 7/8 RED for a missing literal "definition").
**How to avoid:** Design `check-kerievsky.mjs` token contracts (`Direction:`, `GoF pattern:`, `Composed Fowler primitive(s):`) to match the exact leaf field labels the plan mandates; keep field labels and checker regexes in lockstep.

### Pitfall 5: Pattern-heavy refactoring overflows the compact-example rule
**What goes wrong:** Interpreter (#19), and possibly State (#10)/Command (#12), teach through intermediate states -- a 5-15 line before/after loses the lesson.
**How to avoid:** Use the LOCKED overflow rule -- push an evolving `<slug>-walkthrough.md` (explain-in-depth only); the leaf keeps the compact before/after. Ensure walkthroughs are ALSO compiled by extract-samples.

### Pitfall 6: Non-convergence oscillation
**What goes wrong:** `oracle-reviewer` is adversarial; a faithful draft can false-`revise` and a too-close<->drift rewrite can oscillate.
**How to avoid:** Cap ~3 rounds; on non-convergence escalate the specific entry to the owner via AskUserQuestion (main context only -- D-08).

## Runtime State Inventory

N/A -- this is greenfield/additive Markdown authoring, not a rename/refactor/migration of running systems. New leaf files are created; existing Fowler smell leaves are edited additively (source tag + note only, D-05). No databases, live-service config, OS-registered state, secrets/env vars, or build artifacts embed a renamed string. **Verified:** no persisted or externally-registered state is touched; the only build artifact is the throwaway `samples/` dir, regenerated fresh each `extract-samples` run.

## Validation Architecture

> nyquist_validation = true (config.json). Section required.

For a Markdown reference-authoring phase, **the "test suite" IS the deterministic checker battery + the tsc example harness**, backed by the `oracle-reviewer` fidelity gate for what deterministic checks cannot reach. This mirrors the Phase-7 validate-phase finding: all requirements were COVERED by committed checkers, and generating `.test.`/`.spec.` files would be spurious (07-VALIDATION.md generated 0 runtime tests). There is NO runtime behavior to unit-test.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Node builtins + pinned `typescript@6.0.3` (no test framework; deterministic `.mjs` checkers) |
| Config file | `.claude/skills/lz-refactor-workspace/tsconfig.json` (samples), `package.json` (`check` + `typecheck` scripts) |
| Quick run command | `node .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs` (per-batch, after authoring a chapter) |
| Full suite command | `cd .claude/skills/lz-refactor-workspace && npm run check && npm run typecheck` (extended to include check-kerievsky) |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|--------------|
| KRV-01 | 27 leaves present by canonical name + contract fields + composed-Fowler primitive present | deterministic (name identity + contract) | `node tools/check-kerievsky.mjs` | NEW (Wave 0) |
| KRV-01 | every Kerievsky example `tsc --strict`-clean | compile | `node extract-samples.mjs` (extended) | EXTEND (Wave 0) |
| KRV-01 | example behavior-preserving + representative | semantic | `oracle-reviewer` gate (not automatable) | agent exists |
| KRV-02 | every leaf has a Direction value; 3 Away cases present + flagged | deterministic | `node tools/check-kerievsky.mjs` | NEW (Wave 0) |
| KRV-03 | Ch.4 smells folded, source-tagged, deduped; candidate links resolve | deterministic | `node tools/check-smells.mjs` (extended) | EXTEND (Wave 0) |
| KRV-03 | correct unique-vs-overlap classification (fidelity) | semantic | `oracle-reviewer` gate | agent exists |
| KRV-04 | each leaf has a GoF pattern field; no verbatim GoF text | deterministic (field presence) + hygiene | `node tools/check-kerievsky.mjs` + `node tools/check-hygiene.mjs` | NEW + exists |
| KRV-04 | GoF target pattern is correct | semantic | `oracle-reviewer` (Kerievsky book states the target) / AskUserQuestion fallback | agent exists |
| all | composed-Fowler + candidate cross-links resolve | deterministic | `node tools/check-crossrefs.mjs` (extended) | EXTEND (Wave 0) |
| all | ASCII-only, no work-email, no-verbatim WARN | deterministic | `node tools/check-hygiene.mjs` | exists |

### Sampling Rate
- **Per task commit:** the relevant checker for the batch just authored (`check-kerievsky` for catalog batches, `check-smells` for the fold) + `extract-samples` if examples changed.
- **Per wave merge:** full battery (`npm run check && npm run typecheck`, with check-kerievsky added).
- **Phase gate:** full battery green + all 27 catalog leaves and every folded smell oracle-converged (all-`pass` or owner-accepted) before `/gsd-verify-work`.

### Coverage a checker CANNOT reach (delegated to oracle-reviewer + tsc)
- **Semantic fidelity** of mechanics/motivation/intent -> `oracle-reviewer` (per-axis anchors).
- **Behavior-preservation** of examples -> `oracle-reviewer` + `tsc --strict` (tsc proves it compiles; the reviewer proves before/after are behaviorally equivalent -- a tsc-clean example can still change behavior).
- **Direction correctness** (is To/Towards/Away right?) and **target-pattern correctness** -> `oracle-reviewer` (the checker only proves the FIELDS are present, not that their VALUES are right).
- **Composed-primitive aptness** (is the cited Fowler primitive the one the source actually composes, not a plausible-but-wrong sibling?) -> `oracle-reviewer` mechanics/cross-ref-aptness axis (check-crossrefs only proves the link RESOLVES).
- **Full-strength DST-04 near-verbatim** -> `oracle-reviewer` (needs the real prose to compare); `check-hygiene` is only a WARN-level long-quote heuristic.

### Wave 0 Gaps
- [ ] `tools/check-kerievsky.mjs` -- NEW; covers KRV-01 (identity + contract + composed-primitive presence), KRV-02 (Direction + 3 Away), KRV-04 (GoF field presence).
- [ ] `extract-samples.mjs` -- EXTEND to walk `kerievsky-catalog/` + namespace sample files; covers KRV-01 compile.
- [ ] `tools/check-smells.mjs` -- EXTEND for Kerievsky smells + `kerievsky-catalog/` candidate links; covers KRV-03.
- [ ] `tools/check-crossrefs.mjs` -- EXTEND `sourceFiles` with `kerievsky-catalog/`; covers composed-Fowler link resolution.
- [ ] `package.json` `check` script -- add `check-kerievsky.mjs`.
- (No framework install needed -- Node + pinned tsc already present and verified.)

## Security Domain

> config.json has no explicit `security_enforcement` key (treated as enabled). This is a Markdown-authoring phase with NO runtime attack surface -- no auth, sessions, access control, input from untrusted sources, or cryptography. The classic ASVS categories (V2-V6) do not apply. The real "security"-adjacent concerns are IP/copyright hygiene and public-repo hygiene, which the harness already gates.

| Concern | Applies | Standard Control |
|---------|---------|------------------|
| V5 Input Validation | no | No runtime input; static Markdown |
| V6 Cryptography | no | None |
| IP / copyright leakage (DST-04) | yes | Clean-room firewall (main context never reads `.oracle/`); `oracle-reviewer` full-strength near-verbatim gate; `check-hygiene` long-quote WARN; Phase-10 hygiene scan |
| Public-repo hygiene | yes | ASCII-only + work-email allowlist (`check-hygiene.mjs` hard-fail); MIT + public contact only |
| Supply chain | low | No new deps; sole workspace dep `typescript@6.0.3` pinned, Phase-7-verified |

| Threat pattern | STRIDE | Mitigation |
|----------------|--------|------------|
| Copyrighted prose/code leaks into the world-readable repo | Information Disclosure | Firewall + oracle-reviewer no-leak verdict + hygiene scan (DST-04) |
| Work email committed to a public repo | Information Disclosure | Email allowlist gate (recurred twice in Phase 4 -- keep the gate load-bearing) |
| Non-ASCII mojibake corrupts committed files | Tampering (integrity) | ASCII-only hard-fail in `check-hygiene.mjs` |

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | checker battery + extract-samples | yes | 24.18.0 (verified) | -- |
| TypeScript `tsc` | example compile (KRV-01) | yes | 6.0.3 global (matches pinned; verified) | `npm install` in workspace to get local pinned tsc |
| `oracle-reviewer` agent | fidelity + DST-04 gate | yes | `.claude/agents/oracle-reviewer.md` (verified; Read/Glob, opus) | none -- required |
| `oracle` agent | own-words lookups | yes | `.claude/agents/oracle.md` (verified) | oracle-reviewer alone can gate |
| `.oracle/refactoring-to-patterns/` | oracle source | yes | index.md + Ch.4 (12-...) + Ch.6-11 (14-19-...) present (verified by `ls`, filenames only) | none -- required; already fully provisioned (no owner provisioning step needed) |
| Fowler catalog (62 leaves) | composition targets for cross-links | yes | shipped in Phase 7 (verified: 62 leaf files + README) | none -- required |
| Unified smell taxonomy (24 leaves + smells.md) | Ch.4 fold target | yes | shipped in Phase 7 (verified: 24 leaves + index) | none -- required |

**Missing dependencies with no fallback:** none -- every dependency is present and verified. Unlike Phase 7 (mid-phase book provisioning), the Kerievsky book is fully provisioned from the start.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Chapter grouping (Creation 6 / Simplification 6 / Generalization 7 / Protection 3 / Accumulation 2 / Utilities 3) | Inventory | Wrong chapter assignment in index; oracle-reviewer catches at execution (pass tight per-chapter scope). Chapter TITLES verified by `ls`; counts are ASSUMED. |
| A2 | GoF target pattern per refactoring (Strategy, State, Command, Composite, Visitor, etc.) | Inventory, KRV-04 | Wrong `GoF pattern:` field value; oracle-reviewer + Kerievsky book (states the target) corrects; AskUserQuestion fallback for unresolvable. |
| A3 | Composed Fowler primitive(s) cross-map per refactoring | Inventory, D-02 | Wrong/incomplete composed-primitive list; oracle-reviewer mechanics/cross-ref-aptness axis catches; check-crossrefs only proves resolution. |
| A4 | Direction (Towards default; the 3 named Away cases) | Inventory, KRV-02 | Wrong To/Towards/Away; the 3 Away cases are LOCKED (D-03); the To-vs-Towards granularity is oracle-settled. |
| A5 | Ch.4 = exactly 12 smells; the 12 names | Ch.4 fold | Wrong smell count/names; "twelve design smells" is CITED; exact list oracle-confirmed. |
| A6 | Provisional unique-vs-overlap dedup map (5 unique / 7 overlap) | Ch.4 fold | Wrong dedup -> a duplicate leaf or a missed unique smell; D-05 mandates the exact map be settled at execution vs oracle. |
| A7 | Interpreter/State/Command are the likely overflow-walkthrough candidates | Reuse, Pitfall 5 | Over/under-use of walkthroughs; decided per-leaf at authoring by teaching value (YAGNI overflow rule). |
| A8 | A new `check-kerievsky.mjs` is preferable to extending `check-catalog.mjs` | Harness | Either satisfies D-08's "keep out of shipped surface"; discretion (D-01 discretion list). |

## Open Questions (RESOLVED)

All four questions below are substantively RESOLVED and adopted into the plans. Q4 is
deferred-by-design per LOCKED D-05 (settled at execution by the oracle loop, not an unresolved gap).

1. **GoF field value for non-GoF / utility targets.** (RESOLVED)
   - What we know: 5+ targets are not classic GoF (Creation Method, Composed Method, Collecting Parameter, Null Object, type-safe Class); 3 Utilities target no pattern.
   - What's unclear: whether KRV-04's `GoF pattern:` field should name the actual (non-GoF) pattern, or carry "n/a -- utility," and whether `check-kerievsky.mjs` should allow "n/a."
   - RESOLVED (adopted): name the real target pattern where one exists (even if non-GoF); use "n/a -- utility" for the three Utilities; `check-kerievsky.mjs` accepts a non-empty value OR the literal "n/a -- utility" (adopted in 08-01 checker + 08-05 authoring).

2. **Richer GoF intent line (D-04 re-open).** (RESOLVED)
   - What we know: default ships name-only vocabulary (satisfies KRV-04).
   - What's unclear: whether the owner wants a 1-line own-words intent per pattern.
   - RESOLVED (adopted): default name-only GoF vocabulary; a richer per-pattern intent line is an additive, reversible AskUserQuestion enhancement, NOT pre-built (per LOCKED D-04).

3. **Exact To vs Towards granularity per leaf.** (RESOLVED)
   - What we know: the 3 Away cases are LOCKED; the rest are "toward(s)."
   - What's unclear: whether each non-Away leaf is "To" or "Towards" (Kerievsky distinguishes).
   - RESOLVED (adopted): default the field to "Towards," let `oracle-reviewer`'s direction axis correct any "To" cases; the harness only asserts the field is one of {To, Towards, Away} (adopted across 08-01..08-05).

4. **Does any Kerievsky-unique smell duplicate a Fowler smell after all?** (RESOLVED -- deferred-by-design)
   - What we know: Conditional Complexity vs Repeated Switches is the borderline case.
   - What's unclear: the exact dedup boundary.
   - RESOLVED (deferred-by-design): the exact unique-vs-overlap dedup boundary is settled at EXECUTION by the oracle-gated loop against Ch.4 per LOCKED D-05 -- an intended execution-time settlement, not an unresolved research gap. 08-06 drafts Conditional Complexity provisionally as unique and lets the oracle reclassify it to an overlap-tag if the source treats it as the same smell.

## Sources

### Primary (HIGH confidence)
- LOCKED Phase-7 design: `07-ROUTING-ARCHITECTURE.md`, `07-ORACLE-MODEL.md`, `07-LEARNINGS.md` -- leaf/index/harness contracts, clean-room loop, driver responsibilities, per-axis anchors, carried-forward lessons.
- Phase-8 CONTEXT: `08-CONTEXT.md` (D-01..D-08) -- the authoritative decisions.
- Codebase (verified this session): `check-catalog.mjs`, `check-smells.mjs`, `check-crossrefs.mjs`, `check-hygiene.mjs`, `extract-samples.mjs`, `package.json`, `tsconfig.json`; `.claude/agents/oracle-reviewer.md` frontmatter; `.oracle/refactoring-to-patterns/` filenames (`ls` only -- firewall respected); 62 Fowler leaves + 24 smell leaves + Kerievsky README stub.
- Environment (verified): `node --version` 24.18.0; `tsc --version` 6.0.3; oracle agents present.

### Secondary (MEDIUM confidence)
- Kerievsky's own catalog, industriallogic.com (fetched this session) -- the 27 refactoring names (authoritative source list).
- Book description via search (goodreads/amazon/informit) -- "catalog of 27 pattern-directed refactorings," "twelve design smells," the "to, towards, or away from pattern implementations" framing, the six thematic chapter conception.

### Tertiary (LOW confidence -- ASSUMED, oracle-confirmed at execution)
- Chapter counts, GoF target mapping, composed-Fowler cross-map, per-leaf direction, and the Ch.4 unique-vs-overlap dedup map -- training knowledge, to be settled by `oracle-reviewer` against `.oracle/refactoring-to-patterns/`.

## Metadata

**Confidence breakdown:**
- Architecture / reuse of Phase-7 model: HIGH -- LOCKED and shipped-green; Phase 8 is a re-point + additive-checker job.
- Harness extension: HIGH -- exact files + minimal diffs identified from reading the shipped checkers.
- Validation architecture: HIGH -- mirrors the Phase-7 validate-phase finding (checkers are the test suite).
- Catalog inventory names: MEDIUM -- 27 names CITED from Kerievsky's catalog; chapter grouping reconstructed.
- GoF targets / directions / composed-Fowler map / smell dedup: LOW/ASSUMED -- orientation only; oracle-confirmed at execution (by design, D-07).

**Research date:** 2026-07-05
**Valid until:** ~2026-08-05 (stable -- LOCKED design + published book; the only volatile element is the exact oracle-settled content, which is resolved during execution not research).
