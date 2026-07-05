# Phase 7: Fowler Catalog (Refactoring, 2nd ed) - Research

**Researched:** 2026-07-04 (base) / **Refreshed + synthesized:** 2026-07-05 (scope-correction re-plan)
**Domain:** Skill-authoring (progressive-disclosure Markdown catalog, per-refactoring leaves) + a `tsc --strict` compile harness + a clean-room oracle-review authoring loop
**Confidence:** HIGH (toolchain, harness, progressive-disclosure structure, content-format basis, clean-room precedent); MEDIUM (smell-leaf two-tier design, cross-chapter fan-out coordination)

> ## SYNTHESIS STATUS (read first)
>
> This file is the 2026-07-04 base research REFRESHED and INTEGRATED with the 2026-07-05
> scope-correction re-plan. The two LOCKED design docs are authoritative and supersede parts of
> the base: `07-ROUTING-ARCHITECTURE.md` (62-scope, chapter-grouped per-refactoring leaves,
> two-tier smell leaves) and `07-ORACLE-MODEL.md` (clean-room `oracle`/`oracle-reviewer` loop).
>
> | Base finding | Status | What changed |
> |--------------|--------|--------------|
> | Scope "all 66" | **SUPERSEDED** | 62 = 66 web entries MINUS 4 web-only 1st-ed relics, KEEPING Return Modified Value. |
> | D-01 tag-group leaves (~7-20 files) | **SUPERSEDED** | ONE leaf file per refactoring (62 leaves), grouped in the index by the 7 book chapters (Ch.6-12). |
> | D-04 smells as a single trigger TABLE | **SUPERSEDED** | Two-tier: 24 smell LEAVES (`smells/<slug>.md`, candidates live here) + a navigation-only `smells.md` recognize-by index. |
> | D-06 five print-absent "+" entries | **SUPERSEDED** | Only Return Modified Value is `[web-only]`; Split Phase examples `[web-example]`; the other 4 are CUT, not labeled. |
> | D-07 AskUserQuestion oracle checkpoint | **SUPERSEDED (for this book)** | Clean-room `oracle`/`oracle-reviewer` loop over `.oracle/refactoring-2e/`; main context never reads book prose. AskUserQuestion survives only as the per-entry escalation path and as the oracle for non-`.oracle/` books (GoF/Beck/RCM). |
> | `tsc --strict` compile harness (D-03) | **KEPT (built in 07-01)** | Extractor + tsconfig unchanged; the CHECKERS are overhauled by 07-02 from the 66/tag-group/table model to the 62/per-leaf/smell-leaf model + a new `check-crossrefs`. |
> | Pitfalls 2-5, ASCII rule, Package audit, Security/DST-04 | **KEPT + strengthened** | Cited below; clean-room firewall strengthens the DST-04 mitigation. |

<user_constraints>
## User Constraints (from CONTEXT.md, reconciled with the LOCKED design docs)

> CONTEXT.md carries a supersede banner (2026-07-05). Where a locked decision below is superseded
> by `07-ROUTING-ARCHITECTURE.md` / `07-ORACLE-MODEL.md`, the LOCKED form is stated and the original
> is marked. The `<code_context>` / `<canonical_refs>` reuse notes in CONTEXT.md remain valid.

### Locked Decisions (as reconciled)

- **D-01 [architecture] -- SUPERSEDED:** originally "split 66 across tag-group leaf files." LOCKED
  form: each refactoring is its OWN leaf `references/fowler-catalog/<slug>.md` (62 leaves), and the
  thin `fowler-catalog/README.md` index groups the 62 rows under the 7 book chapters (Ch.6-12). The
  index stays the only entry-point SKILL.md points at; adding leaves needs NO SKILL.md re-touch.
- **D-02 [KEPT, reshaped to leaves]:** each entry fills the per-entry content contract exactly
  (name + 1st-ed alias / `Use when:` selector / distilled motivation / distilled mechanics /
  TS before->after / provenance). Examples are minimal, focused before->after in TypeScript
  (drop to plain JS only where a JS-specific idiom is the point), illustrative not exhaustive; every
  entry gets an original example. NO verbatim Fowler code or prose (DST-04).
- **D-03 [verification -- KEPT]:** TS/JS samples live in a bundled, re-runnable compile harness
  (extractable `.ts` + `tsconfig`) so FWL-04's `tsc --strict`-clean claim is machine-checkable. The
  Markdown SHOWS the code; the harness PROVES it compiles. Built in 07-01 under
  `.claude/skills/lz-refactor-workspace/` (non-shipped).
- **D-04 -- SUPERSEDED:** originally "`smells.md` as a single Fowler-24 trigger table with a Source
  column." LOCKED form: 24 smell LEAVES `references/smells/<slug>.md` (each: `Recognize by:` +
  `## How to recognize` + `## Why it's a problem` + `## Candidate refactorings` with per-candidate
  "pick when <discriminator>" -- the smell->refactoring map lives HERE) + a navigation-only
  `references/smells.md` recognize-by index (no candidates, so it cannot shortcut the confirm step).
  Still shaped to accept the Phase-8 Kerievsky Ch.4 fold without re-touching Phase-7 leaves.
- **D-05 [KEPT]:** `references/principles.md` distills Fowler Ch.2 only (definition; two hats;
  when-to-refactor: rule of three / preparatory / comprehension / litter-pickup; performance; YAGNI)
  in original words with correct attributions. Ch.2 when-to-refactor triggers LINK to their typical
  refactorings (route, not only explain). Beck placement stays deferred to Phase 9. (Authored in
  07-03; oracle-converged.)
- **D-06 -- SUPERSEDED:** originally "mark the 5 print-absent '+' entries + Split Phase." LOCKED
  form: only Return Modified Value is `[web-only]` (verified against the WEB edition, not the
  e-book); Split Phase's extended examples are `[web-example]`. The other 4 former "+" entries
  (Replace Magic Literal, Replace Control Flag with Break, Replace Error Code with Exception, Replace
  Exception with Precheck) are CUT (1st-ed relics) and are NOT authored or labeled.
- **D-07 [oracle blocking] -- SUPERSEDED for this book:** originally "batch AskUserQuestion
  oracle-access checkpoint." LOCKED form (`07-ORACLE-MODEL.md`, Model C): author BLIND (public
  knowledge + `refactoring-com-overview.md` scaffold), gate fidelity with the isolated
  `oracle-reviewer` subagent over `.oracle/refactoring-2e/`, revise BLIND to convergence; the main
  context NEVER reads book prose (`ls` for names only). D-07's intent (owner authoritative, no
  fabrication) is PRESERVED and STRENGTHENED (the reviewer also runs the near-verbatim DST-04 gate).
  AskUserQuestion survives only as (a) the per-entry escalation path when the loop cannot converge in
  ~3 rounds or returns `blocked`, and (b) the oracle path for books NOT in `.oracle/` (GoF/Beck/RCM).

### Claude's Discretion

- Leaf slug spellings (kebab-case of the canonical name); the exact `Use when:` / `pick when`
  wording; entry ordering within the index chapter groups; the provenance legend format; the exact
  compile-harness shape (already realized in 07-01).

### Deferred Ideas (OUT OF SCOPE)

- Kerievsky Ch.4 smells folded into the taxonomy -> Phase 8 (KRV-03).
- Beck principle-backing placement in `principles.md` -> Phase 9 (PRIN-01/02).
- The coach decision procedure that consumes the smell taxonomy -> Phase 9 (CCH-01..05); note the
  SAFETY-CRITICAL always-loaded gates (two-hats seam; atomic-boundary tripwire) are Phase-9 work,
  but Phase-7 leaves author the `Watch for` back-edges into `principles.md` that Phase 9 relies on.
- Richer per-entry harvest (refactorgram / inverse-of graph / book excerpts) from refactoring.com.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support (updated for the LOCKED model) |
|----|-------------|-------------------------------------------------|
| FWL-01 | All 62 Fowler refactorings, each name (+ 1st-ed alias), `Use when:`, motivation, distilled mechanics (original words), original TS/JS before/after; Return Modified Value `[web-only]` + Split Phase `[web-example]` provenance-labeled | Per-refactoring-leaf contract (07-ROUTING-ARCHITECTURE "Content contracts"); chapter-grouped index; the 62-name + alias + inverse-of scaffold (`refactoring-com-overview.md`); `check-catalog` 62-name identity + contract + provenance + index-row-mirror checker |
| FWL-02 | Unified smell taxonomy: 24 Fowler smells, each mapped to candidate refactorings usable as the coach trigger table | Two-tier smell design (24 leaves with candidates+discriminators + navigation-only index); `check-smells` (24 leaves + candidate-link resolution) + `check-crossrefs` (bidirectional smell<->refactoring) |
| FWL-03 | Principles reference distills Ch.2 (definition, two hats, when-to-refactor set, performance, YAGNI) in original words with attributions | `principles.md` topic-set contract with trigger->refactoring routing links; `check-principles` topic-presence gate (authored in 07-03) |
| FWL-04 | All Fowler TS/JS samples `tsc --strict`-clean AND behavior-preserving, verified against the owner source | Bundled compile harness (D-03): extractor + tsconfig + `tsc --strict --noEmit` gate; the behavior-preserving clause is UPGRADED from manual-only to `oracle-reviewer` example-axis gated (07-ORACLE-MODEL "Comprehensive review dimensions") |
</phase_requirements>

## Summary

This phase is Markdown skill-authoring with two engineering pieces already in place from wave 1: a
re-runnable `tsc --strict` compile harness and a checker battery. The scope-correction re-plan
changed three things the base research predates. First, SCOPE: 62 refactorings, not 66 -- the 4
web-only 1st-edition relics are cut and Return Modified Value is the sole surviving web-only entry.
Second, STRUCTURE: the catalog is now ONE leaf file per refactoring (62 leaves) grouped in a thin
chapter-organized index, and the smell taxonomy is two-tier (24 smell leaves that hold the
candidate map + a navigation-only recognize-by index). Third, SOURCING: content is produced by a
clean-room loop -- authored BLIND, gated by an isolated `oracle-reviewer` subagent that reads the
owner's book in `.oracle/refactoring-2e/` and returns only own-words verdicts, then revised BLIND to
convergence. The main/executor context never reads book prose (DST-04 firewall).

The refresh confirms the LOCKED design against current authoritative sources and enriches its
citations. Anthropic's current Agent Skills best-practices doc directly supports the thin-index +
many-small-files pattern (its "domain-specific organization" pattern is essentially this design),
reaffirms the 500-line SKILL.md cap and the 100-line-TOC rule, and reaffirms "keep references one
level deep" -- which is the one genuine tension with the two-level index->leaf hop (addressed below,
no plan change required). The clean-room loop has real, well-established legal precedent
(clean-room / Chinese-wall design; recent generative-model clean-room academic work), with a known
failure mode (a porous wall) that the firewall + driver-aggregation guards are built to prevent. The
content-format basis the design cites (one strong example over many; imperative numbered steps;
few-shot demonstrations mirrored in rules) still holds against the current GPT-4.1 guide and the
Anthropic skills best-practices doc.

**Primary recommendation:** Execute the LOCKED design as planned. Author 62 per-refactoring leaves
(chapter fan-out) and 24 smell leaves via the clean-room `oracle-reviewer` loop; keep each index
genuinely thin/navigation-only and each leaf self-contained (this is the mitigation for the
one-level-deep tension); finalize the chapter-grouped README and run the full battery green at the
07-10 gate. Add NO new dependency beyond the pinned `typescript@6.0.3`. The single highest fan-out
risk is cross-chapter slug drift (see Pitfalls + Impact section) -- pin the canonical name->slug map
in the 07-02 pilot SUMMARY so all six wave-3 chapters link the same targets.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| The 62 refactoring entries (content) | `references/fowler-catalog/<slug>.md` (one leaf per refactoring) | -- | SKEL-04: heavy catalog material bundled as split leaves, never inlined (LOCKED per-refactoring-leaf model) |
| Catalog navigation / entry-point | `references/fowler-catalog/README.md` (thin, chapter-grouped index) | `SKILL.md` (one pointer, already resolves) | The index is the only entry-point SKILL.md points at; leaves hang under it |
| Smell -> refactoring routing (the map) | `references/smells/<slug>.md` (24 leaves: candidates + discriminators) | fowler-catalog leaves (cross-link targets) | D-04 LOCKED: candidates live in the leaf so the coach must confirm-via-leaf; Phase 9 consumes this |
| Smell recognition / navigation | `references/smells.md` (navigation-only recognize-by index) | smell leaves | Deliberately no candidates in the index (cannot shortcut the confirm tier) |
| Ch.2 principles + when-to-refactor routing | `references/principles.md` (single doc; triggers link to refactorings) | fowler-catalog leaves; SKILL.md coach gates (Phase 9) | Bounded + interrelated; the safety gates are promoted always-loaded in Phase 9, the explanations stay on-demand |
| Provenance labels | `[web-only]` on Return Modified Value + `[web-example]` on Split Phase (inline) + README legend | -- | D-06 LOCKED: only these two markers |
| `tsc --strict`-clean + behavior-preserving proof (FWL-04) | NON-shipped harness (`.claude/skills/lz-refactor-workspace/`) + `oracle-reviewer` example axis | -- | D-03: compile machine-checkable; behavior-preservation is reviewer-gated, not manual-only |
| Content fidelity (no fabrication, no verbatim) | `oracle-reviewer` subagent over `.oracle/refactoring-2e/` (isolated, own-words verdict) | `check-hygiene` no-verbatim heuristic; Phase-10 scan | Clean-room firewall: expression never crosses to committed files |

## Standard Stack

### Core
| Library / Tool | Version | Purpose | Why Standard |
|----------------|---------|---------|--------------|
| TypeScript (`tsc`) | 6.0.3 (`latest`) | `tsc --strict --noEmit` gate proving every TS sample compiles (FWL-04) | The compiler the requirement names; pinned in the workspace `package.json` (07-01); also installed globally |
| Node.js | v24.18.0 | Runs the extractor + checker `.mjs` and drives `tsc` | Repo standard |

### Authoring instruments (not shipped -- they PRODUCE the content)
| Instrument | Location | Purpose | Notes |
|------------|----------|---------|-------|
| `oracle-reviewer` (subagent) | `.claude/agents/oracle-reviewer.md` | GATE a drafted leaf/smell/principles doc against `.oracle/` and return a `pass\|revise\|blocked\|error` verdict in own words | `tools: Read, Glob`; `model: opus`; read-only; never echoes source prose/code/paths (DST-04) |
| `oracle` (subagent) | `.claude/agents/oracle.md` | OPEN-ENDED lookups ("which chapter presents X?", "candidate set for smell Y?") | `tools: Read, Glob`; `model: opus`; own-words answers only |
| `skill-creator` / `plugin-dev` (Skill tool) | installed | progressive-disclosure + structure guidance | confirm the workspace stays outside the auto-discovered skill dir |
| `claude plugin validate .` | Claude Code >= 2.1.x | structural gate (frontmatter/marketplace; does NOT check Markdown body links) | run at the 07-10 gate; Phase 10 owns the strict pass |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Per-refactoring leaves (62 files) | Tag-group leaves (base D-01) / one-big-file | Per-refactoring maximizes progressive-disclosure precision (load only the one entry needed) and gives clean fan-out ownership; costs 62 small files (fine -- no per-file context penalty per Anthropic docs). LOCKED. |
| Clean-room `oracle-reviewer` loop | AskUserQuestion batch paste (base D-07) | The loop keeps the source out of the main context entirely (stronger DST-04 firewall) and mechanizes the fidelity gate; AskUserQuestion survives as the escalation path. LOCKED. |
| Hand-rolled ~40-line fence extractor | `codedown` / `typescript-docs-verifier` | [ASSUMED] Adds a first new dependency to a near-zero-dep repo for what the 07-01 script already does. Not worth it. |
| Global `tsc 6.0.3` | Pinned workspace `typescript@6.0.3` | Pinned chosen (reproducible public FWL-04 claim); extractor still runs against global tsc with zero install. |

**Installation (harness workspace only -- already done in 07-01):**
```bash
# .claude/skills/lz-refactor-workspace/ (non-shipped)
npm install --save-dev typescript@6.0.3   # or rely on global tsc 6.0.3
```

**Version verification (re-run 2026-07-05):** `npm view typescript version` -> `6.0.3`; local
`tsc --version` -> `Version 6.0.3`; `node --version` -> `v24.18.0`. All present.

## Package Legitimacy Audit

> This phase installs at most ONE package (`typescript@6.0.3`), only into the non-shipped harness
> workspace (already installed in 07-01). The shipped skill tree stays dependency-free Markdown.

| Package | Registry | Age | Downloads | Source Repo | slopcheck | Disposition |
|---------|----------|-----|-----------|-------------|-----------|-------------|
| typescript | npm | 12+ yrs | ~90M/wk | github.com/microsoft/TypeScript | not run (see note) | Approved |

**Packages removed due to slopcheck [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

*slopcheck was not installed this session. `typescript` is not a "discovered" package -- it is the
first-party Microsoft compiler explicitly named by FWL-04 (`tsc --strict`), already pinned and
installed. Registry existence re-confirmed via `npm view`. If any OTHER package is proposed, run the
full legitimacy gate and gate its install behind a `checkpoint:human-verify` task.*

## Architecture Patterns

### System Architecture Diagram

Two data flows: reference/coach-time disclosure (how a request reaches a leaf) and build/validate +
authoring (how content is produced and FWL-04 proven).

```
REFERENCE / COACH-TIME DISCLOSURE (what Claude loads on demand)
  user request / detected smell / name lookup / intended change
        |
        v
  SKILL.md  (router -- already shipped; NOT re-touched)
        |  one pointer each (existing, resolves)
        +--> references/fowler-catalog/README.md   (thin chapter-grouped index: legend + 62 rows)
        |         |  pick ONE leaf by name/alias or mirrored `Use when:`
        |         v
        |    references/fowler-catalog/<slug>.md    (ONE refactoring; only this leaf loads)
        |         ^  (leaf<->leaf "see also" / inverse-of cross-links; leaf-> principles back-edge)
        |
        +--> references/smells.md      (navigation-only recognize-by index)
        |         |  fuzzy recognize-by -> confirm
        |         v
        |    references/smells/<slug>.md   (confirm cues + candidates + "pick when" discriminators)
        |         |  candidate cross-links
        |         v
        |    references/fowler-catalog/<slug>.md
        |
        +--> references/principles.md  (Ch.2 topics; when-to-refactor triggers -> refactoring links)

CLEAN-ROOM AUTHORING + BUILD/VALIDATE (non-shipped; produces + proves content)
  public knowledge + refactoring-com-overview.md scaffold (names/aliases/tags/inverse-of)
        |  (1) AUTHOR BLIND (main context never reads .oracle/)
        v
  drafted leaf / smell / principles doc
        |  (2) GATE: spawn oracle-reviewer  --reads-->  .oracle/refactoring-2e/  (isolated context)
        |                                    <--own-words verdict (pass|revise|blocked|error)
        |  (3) REVISE BLIND from directives  (4) ITERATE to converge (driver caps ~3 rounds)
        v
  references/**/*.md
        |  extract each fenced ```ts block -> one module per fence
        v
  extract-samples.mjs -> tsc --strict --noEmit  (exit 0 == FWL-04 compile pass)
        |  + check-catalog (62 identity + contract + index mirror), check-smells (24 leaves +
        |    candidate links), check-crossrefs (bidirectional + no self-ref + resolve),
        |    check-principles, check-hygiene (ASCII + work-email + no-verbatim)
        v
  full battery GREEN at the 07-10 phase gate + `claude plugin validate .`
```

### Recommended Project Structure
```
plugins/lz-tdd/skills/lz-refactor/references/
|-- fowler-catalog/
|   |-- README.md              # thin chapter-grouped index (legend + 62 rows, Use-when mirrored)
|   |-- extract-function.md    # ONE leaf per refactoring (62 leaves), kebab-case canonical-name slug
|   |-- inline-function.md
|   `-- ...                     # grouped in the index under Ch.6..Ch.12
|-- smells.md                  # navigation-only recognize-by index (24 smells, NO candidates)
|-- smells/
|   |-- duplicated-code.md      # ONE leaf per smell (24 leaves): recognize + why + candidates
|   `-- ...
`-- principles.md              # Fowler Ch.2 (triggers link to refactorings)

.claude/skills/lz-refactor-workspace/     # NON-shipped harness (built in 07-01)
|-- package.json  tsconfig.json  extract-samples.mjs
`-- tools/  check-catalog.mjs  check-smells.mjs  check-crossrefs.mjs  check-principles.mjs  check-hygiene.mjs

.oracle/refactoring-2e/        # owner full-text book (git-ignored; ONLY the subagents read it)
```

### Pattern 1: Thin chapter-grouped index + per-refactoring leaves (progressive disclosure)
**What:** `SKILL.md -> fowler-catalog/README.md -> <slug>.md`. The README is navigation (name +
alias + one-line mirrored `Use when:` + link, grouped under the 7 book chapters); each leaf holds one
refactoring's full contract.
**When to use:** A catalog too large for one file that must keep a single SKILL.md pointer and never
force the whole catalog into context (SKEL-04).
**Docs basis (refreshed):** Anthropic's current best-practices doc calls SKILL.md "an overview that
points Claude to detailed materials as needed, like a table of contents," caps the body at 500 lines,
and shows a "domain-specific organization" pattern (`SKILL.md -> reference/<domain>.md`) that is
essentially this design. It also mandates a table of contents for any reference file over 100 lines.
[CITED: platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices]
**One-level-deep tension (MEDIUM -- watch, no plan change):** the same doc says "Keep references one
level deep from SKILL.md" and warns that files "referenced from other referenced files" risk partial
(`head -100`) reads. The locked hop is TWO levels (SKILL -> index -> leaf), plus leaf<->leaf "see
also" links. This is a deliberate SKEL-04 tradeoff, mitigated three ways the plans already enforce:
(a) each index is genuinely THIN and navigation-only -- its whole job is to be read fully and route to
ONE leaf; (b) each leaf is self-contained and read fully once selected; (c) leaf<->leaf and
leaf->principles cross-links are "see also," not load-bearing nesting. The doc's own grep-based
"domain-specific organization" pattern legitimizes a curated index over a `reference/` directory. Keep
indexes thin and leaves self-contained and the risk stays low.

### Pattern 2: Per-refactoring leaf contract (D-02, LOCKED leaf format)
**What:** one file per refactoring carrying the full contract.
**Template (STRUCTURAL only -- real content comes from the clean-room loop):**
```markdown
# <2nd-ed Name>

_Aliases (1st-ed): <alias>, <alias>_   <!-- omit if none -->

Use when: <one-line situation/seam -- mirrored verbatim into the index row>

## Motivation

<2-4 sentences, original words: the WHY>

## Mechanics

1. <verb-first imperative step, original words>
2. <... name the test/compile checkpoint inline where behavior-preservation lives>

## Example

```ts
// before: original, tsc --strict-clean
```
```ts
// after: original, behavior-preserving, tsc --strict-clean
```

## Watch for

- <0-3 bullets; may cross-link ../principles.md by NAMING the target section in link text>
```
- Return Modified Value carries `[web-only]`; Split Phase carries `[web-example]`.
- Both `before` AND `after` must compile strict-clean -- a smell is a design issue, not a type error.
- Hard cap of 2 examples; prefer ONE compact 5-15-line-per-side before->after (see Content Format).
- Content-fidelity discipline (07-ORACLE-MODEL): distill WORDING, never SUBSTANCE -- keep every
  decision branch, safety checkpoints as their own steps, follow-up/compose steps as cross-links.

### Pattern 3: Two-tier smell taxonomy (D-04 LOCKED)
**What:** a navigation-only `smells.md` index (per smell: `### <Smell> -- recognize by: <line>` +
link) routes to a smell leaf that CONFIRMS the fuzzy match and holds the candidate map.
**Smell-leaf template:**
```markdown
# <Smell>

Recognize by: <one-line cue -- mirrored into the index>

## How to recognize
<fuller cues; separate near-neighbors so the coach does not mis-identify>

## Why it's a problem
<original words>

## Candidate refactorings
- [<Refactoring>](../fowler-catalog/<slug>.md#<anchor>) -- pick when <smell-specific discriminator>
```
**Why two tiers:** the coach entry is FUZZY (recognize-by), so it needs the leaf CONFIRM tier before
acting; keeping candidates OUT of the index forces confirm-via-leaf. Reference/preparatory entries
are exact/goal-matched and resolve index->leaf with no confirm tier. This is a diagnostic
decision procedure -- it maps to the Anthropic "conditional workflow" (route at a decision point) and
"template" patterns. [CITED: platform.claude.com/.../best-practices] (design-reasoned; MEDIUM.)

### Pattern 4: Clean-room blind-author -> isolated-reviewer-gate -> converge (07-ORACLE-MODEL)
**What:** author BLIND from public knowledge + the scaffold; gate fidelity with the isolated
`oracle-reviewer` (which holds the full source but returns only own-words verdicts); revise BLIND;
iterate to convergence (driver caps ~3 rounds, escalates `blocked`/non-converge to the owner).
**Precedent (refreshed):** this is a variant of clean-room / Chinese-wall design -- the established
copyright-safe method where a wall separates anyone who has seen the protected EXPRESSION from the
artifact, so only ideas/facts/procedure (not copyrightable) cross. [CITED: en.wikipedia.org/wiki/
Clean-room_design] Recent academic work formalizes clean rooms for generative models. [CITED:
arxiv.org/pdf/2506.19881 "Blameless Users in a Clean Room"] The classic form has a "dirty" reader
write a spec and a "clean" team implement; the LOCKED variant INVERTS it -- the clean team (main
context) authors first, and the source-holder only GATES fidelity, returning own-words directives.
The firewall property is identical: expression never reaches the committed artifact.
**Failure mode to respect:** a porous wall defeats the defense (in Sony v. Connectix a Chinese-wall
attempt failed and engineers disassembled the object code directly). [CITED: en.wikipedia.org/wiki/
Clean-room_design] The design closes this at two levels: per-call (the agent files forbid echoing
prose/code/paths) and cross-call (the DRIVER dedupes/caps fan-out aggregation and does not persist a
full ordered name+chapter map -- otherwise merged per-chapter answers reconstruct the book's curated
selection).

### Pattern 5: Compile harness -- one module per fence (D-03, FWL-04; KEPT from 07-01)
**What:** extract each fenced `ts` block into its own `.ts` module so before/after pairs that reuse
symbol names do not collide; each snippet is proven independently `tsc --strict`-clean.
**tsconfig (built in 07-01):** `strict:true, noEmit:true, target es2021, module esnext,
moduleResolution bundler, lib es2021` (OMIT `dom` -- Phase-3 `Node` global collision), `skipLibCheck`,
`forceConsistentCasingInFileNames`, `include samples/**/*.ts`. Class syntax compiles fine without
`dom` (relevant to Ch.12 inheritance leaves). Vacuous-GREEN on an empty include set.

### Anti-Patterns to Avoid
- **Inlining catalog/smell content in an index or SKILL.md:** violates SKEL-04; indexes stay thin.
- **Any verbatim Fowler prose/code (DST-04):** original wording + original examples only. The
  refactoring.com excerpts are orientation, never a source to copy. The `oracle-reviewer` runs the
  near-verbatim gate; the main context never reads the book.
- **Main/executor context opening `.oracle/`:** breaks the firewall. `ls` for names only.
- **Re-touching SKILL.md for the split:** its pointers already resolve.
- **Putting the harness inside the shipped skill dir:** keep it in the workspace so validate sees
  pure Markdown.
- **A "before" example that differs from "after" only by a compile error:** misrepresents the smell.
- **Candidates in the smell INDEX:** it must be navigation-only to force confirm-via-leaf.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Prove TS compiles | A bespoke type-checker or "looks like TS" regex | `tsc --strict --noEmit` (07-01 harness) | Only the real compiler proves FWL-04 |
| Verify content fidelity + catch verbatim leakage | An ad-hoc general-purpose review agent | The dedicated `oracle-reviewer` | It carries the clean-room firewall contract; a general agent lacks it (07-ORACLE-MODEL) |
| Skill structure / frontmatter rules | Guess the spec | `skill-creator` + current best-practices doc (verified) + `lz-tpp` analog | Spec drifts; the sibling skill is a shipped, validate-clean template |
| The 62 names / aliases / inverse-of map | Re-derive from memory | `.planning/research/refactoring-com-overview.md` | Public facts, already ingested (orientation only, NOT oracle content) |

**Key insight:** The only things "built" here are the harness+checkers (07-01/07-02) and the
authoring instruments (the two oracle agents). The catalog CONTENT is transcribed in original words
through the clean-room loop -- never fabricated, never copied.

## Runtime State Inventory

> Not a rename/migration of a running system, but the re-plan DID leave one carried-over build
> artifact worth flagging (a plan-set refactor, not runtime state).

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Build artifacts (checkers) | `check-catalog.mjs` / `check-smells.mjs` still encode the SUPERSEDED 66-name / tag-group / smell-TABLE model (verified: 4 hits for the cut relic names in check-catalog) | 07-02 Task 1 OVERHAULS them to the 62 / per-leaf / smell-leaf model + adds `check-crossrefs`. Already planned. |
| Stored data | None -- no datastore keys the scope change. | none |
| Live service config | None. | none |
| Secrets/env vars | None. | none |
| Oracle source | `.oracle/refactoring-2e/` + `.oracle/refactoring-to-patterns/` present + gitignored (`.gitignore` line 38 `.oracle/`) | none -- provisioned; read only by the subagents |

## Common Pitfalls

### Pitfall 1: Cross-chapter slug drift (the top fan-out risk -- NEW)
**What goes wrong:** a wave-3 chapter authors a cross-link to a sibling chapter's leaf by a PREDICTED
slug; if the sibling plan spells the kebab-case slug differently, the link dangles and only surfaces
at the 07-10 `check-crossrefs` gate -- after six parallel plans have committed.
**Why it happens:** 62 leaves are authored across 7 file-disjoint plans that never see each other's
files during wave 3; inverse-of / see-also / smell->refactoring links point across that boundary.
**How to avoid:** pin the canonical name->slug map (kebab-case of the canonical name from
`refactoring-com-overview.md`) in the 07-02 pilot SUMMARY as the shared contract all six wave-3 plans
link against. `check-catalog` already hardcodes the 62 names; keep slug derivation deterministic.
`check-crossrefs` catches misses at the gate (it is a PHASE-GATE check, run fully only at 07-10).
**Warning signs:** `check-crossrefs` reports an unresolved `](../fowler-catalog/<slug>.md#...)`.

### Pitfall 2: Split inverse-of / bidirectional pairs across chapters (NEW)
**What goes wrong:** `check-crossrefs` requires inverse-of and smell<->refactoring links to be
declared MUTUALLY; if one half lives in a different plan and is missed, the gate fails.
**Why it happens:** parallel fan-out with a mutual-declaration invariant.
**How to avoid:** most inverse pairs are INTRA-chapter (Extract Class<->Inline Class in Ch.7; Pull Up
<->Push Down in Ch.12; Move Statements into/to Callers in Ch.8) -- author both halves in the same
plan. Where a pair or a smell candidate crosses files, author the link on both sides now (they
resolve at the gate). The plans already list the intra-chapter pairs per chapter.

### Pitfall 3: Oracle-reviewer oscillation / false-revise (NEW)
**What goes wrong:** the reviewer is adversarial (assumes drift until proven otherwise), so it can
false-`revise` a faithful draft, and a too-close<->drift rewrite can oscillate indefinitely.
**Why it happens:** by design the gate is strict; `pass` requires every in-play axis `correct`.
**How to avoid:** the DRIVER caps rounds (~3) and escalates a non-converging/`blocked` entry to the
owner via AskUserQuestion (the per-plan checkpoint:decision task) rather than looping. Record round
counts in the pilot SUMMARY so the fan-out inherits realistic expectations.

### Pitfall 4: Clean-room wall porosity (NEW -- the DST-04 failure mode)
**What goes wrong:** copyrighted expression leaks into a committed file (verbatim prose, the book's
example identifiers/domain, or -- across fan-out -- the book's curated selection reconstructed from
merged oracle answers).
**Why it happens:** a per-call firewall cannot see across calls; a human reading `.oracle/` by
mistake bypasses it entirely.
**How to avoid:** main context NEVER opens `.oracle/` (`ls` names only); rely on the reviewer's
own-words verdicts; apply the driver aggregation guard (dedupe/cap, no persisted full ordered
name+chapter map); `check-hygiene` no-verbatim heuristic + Phase-10 scan as backstops.

### Pitfall 5: Before/after symbol collisions in the harness (KEPT from base)
**What goes wrong:** concatenating snippets makes `tsc` fail on duplicate declarations.
**How to avoid:** one `.ts` module per fence (append `export {}` to force module scope). Built in
07-01; no change needed.

### Pitfall 6: Line-wrap defeats presence/mirror checks (KEPT -- recurring Phase 2/3 lesson)
**What goes wrong:** a `Use when:` line the index must mirror, or a required token a line-oriented
checker asserts, gets soft-wrapped across two Markdown lines and the gate false-negatives.
**How to avoid:** keep every asserted token (leaf headings, `Use when:` / `Recognize by:` lines,
provenance tags, cross-link anchors, principle topics) on ONE line. The `Use when:` line is mirrored
VERBATIM between leaf and index row -- keep both identical and single-line.

### Pitfall 7: ASCII-only violations (KEPT -- repo hard rule, elevated risk)
**What goes wrong:** curly quotes, em/en dashes, arrow glyphs, ellipsis -> cp1252 mojibake.
**Why it happens:** the oracle is an e-book with rich typography; copy-paste risk is elevated (though
the firewall means the main context never sees the e-book -- the residual risk is editor auto-format).
**How to avoid:** `->` not the arrow glyph, `--` not em/en dash, straight quotes, literal `...`.
`check-hygiene` `scanNonAscii` gates every authored file.

### Pitfall 8: `claude plugin validate` does NOT check Markdown body links (KEPT)
**What goes wrong:** a cross-link points at a leaf/anchor that does not exist; validate still passes
but routing is broken.
**How to avoid:** `check-crossrefs` (new in 07-02) resolves every `](...md#anchor)` against
GitHub-style heading slugs and runs fully at the 07-10 gate.

## Code Examples

Structural templates only. NONE reproduce Fowler content; real entries come from the clean-room loop.

### Chapter-grouped index row (fowler-catalog/README.md)
```markdown
## Ch.6 -- a first set of refactorings (basic)

- [Extract Function](extract-function.md) -- _Extract Method_ -- Use when: <mirrored one-line>
- [Inline Function](inline-function.md) -- Use when: <mirrored one-line>
```

### Navigation-only smell index row (smells.md)
```markdown
### Duplicated Code  -- recognize by: <one-line cue>

[Confirm + candidates](smells/duplicated-code.md)
```

### principles.md topic with routing (D-05; original words, attributions)
```markdown
## When to refactor -- Fowler, Refactoring 2nd ed, Ch.2

- Rule of three: <distilled> -- see [Duplicated Code](smells/duplicated-code.md).
- Preparatory: <distilled> -- match the seam via the catalog Use-when lines.
```

### oracle-reviewer invocation shape (driver -> subagent)
```
Task -> oracle-reviewer
  DRAFT_PATHS: [the drafted repo leaf paths]
  SOURCE: ".oracle/refactoring-2e/index.md" + "Ch.7 -- encapsulation"   # index + chapter/topic ONLY
  CONTENT_TYPE: "refactoring-leaf"                                        # or "smell-leaf" / driver axes for principles
  SCOPE: each leaf's refactoring
  ANCHORS: the canonical per-axis anchors (mechanics/motivation/example/applicability/spirit)
Returns: raw JSON array, one object per draft: {verdict: pass|revise|blocked|error, axes, ...}
```

### Extractor sketch (extract-samples.mjs -- 07-01, unchanged)
```javascript
// Walk references/**/*.md fowler-catalog leaves, write each ```ts fence to samples/<file>-<n>.ts.
// Skip "ts ignore" fences. Append "export {}" if no top-level import/export. Then tsc --strict --noEmit.
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| 66 web entries treated as scope | 62 (cut 4 1st-ed relics; keep Return Modified Value) | 2026-07-05 re-plan | FWL-01 target is 62; checkers overhauled |
| Tag-group leaf files (base D-01) | One leaf per refactoring, chapter-grouped index | 2026-07-05 re-plan | Precise progressive disclosure; clean fan-out ownership |
| Single smell trigger TABLE (base D-04) | Two-tier: 24 smell leaves + navigation-only index | 2026-07-05 re-plan | Forces confirm-via-leaf; Phase-9 coach consumes it |
| AskUserQuestion batch oracle paste (base D-07) | Clean-room `oracle`/`oracle-reviewer` loop | 2026-07-05 re-plan | Source stays out of main context (stronger DST-04); fidelity mechanized |
| Behavior-preservation manual-only | `oracle-reviewer` example-axis gated | 2026-07-05 re-plan | FWL-04's behavior-preserving clause is now reviewer-gated |
| Ad-hoc per-block `tsc` (Phase 3) | Committed re-runnable harness (07-01) | Phase 7 wave 1 | FWL-04 machine-checkable + re-verifiable |

**Deprecated/outdated:**
- The Phase-3 "references must be one level deep / no reference-to-reference linking" as a hard rule:
  it is NOT a validator rule, but the current Anthropic best-practices doc DOES reaffirm one-level-deep
  as guidance. Treat the two-level index->leaf hop as a deliberate SKEL-04 tradeoff with thin indexes
  + self-contained leaves as the mitigation (see Pattern 1).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The 24 Fowler 2nd-ed bad-smell names are the orientation set listed in 07-10 | Validation / smell leaves | Wrong name/count breaks FWL-02 (target 24). Orientation only; `oracle-reviewer` confirms exact wording/set at authoring |
| A2 | Chapter membership per leaf (Ch.6..Ch.12) matches the sizing scaffold in each plan | Pattern 1 / fan-out | Mis-groups an index row. Confirmed per leaf via the `oracle` subagent; do NOT treat plan lists as authoritative |
| A3 | kebab-case-of-canonical-name is the uniform slug convention across all 62 leaves | Pitfall 1 | Cross-chapter links dangle at the gate. Mitigation: pin the map in 07-02 SUMMARY |
| A4 | The clean-room reviewer's own-words verdict never carries copyrightable expression | Pattern 4 / Security | If wrong, DST-04 leak. Mitigated by the agent-file firewall + driver guard + hygiene backstops |
| A5 | A hand-rolled extractor beats adding `codedown` | Standard Stack | Low risk; run legitimacy gate if a tool is ever preferred |

**Not assumed (locked/cited):** the 62 scope + the 4 cuts + Return Modified Value web-only (07-ROUTING
-ARCHITECTURE); the leaf/smell/index contracts (LOCKED docs); the clean-room loop (07-ORACLE-MODEL);
toolchain versions (verified 2026-07-05); the current Agent Skills best-practices guidance (fetched
2026-07-05).

## Open Questions

1. **Any leaf whose chapter membership the scaffold gets wrong** -- RESOLVED by design: each plan
   confirms placement via the `oracle` subagent; the index groups by the confirmed chapter recorded
   in wave-2/3 SUMMARYs. Not `--auto`-locked.
2. **Return Modified Value fidelity (web-edition-only)** -- likeliest `blocked` entry (07-08); its
   `oracle-reviewer` SOURCE is the web edition, not the e-book. Handled by the per-plan escalation
   checkpoint. No open action.
3. **One-level-deep vs the two-level index->leaf hop** -- surfaced (Pattern 1); recommendation is to
   keep indexes thin + leaves self-contained (no plan change). Re-evaluate only if Phase-11 evals show
   the coach mis-navigating.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| TypeScript (`tsc`) | FWL-04 compile gate | yes | 6.0.3 (pinned + global) | -- |
| Node.js | extractor + checkers | yes | v24.18.0 | -- |
| `oracle-reviewer` subagent | content fidelity gate (all leaves/smells) | yes | `.claude/agents/oracle-reviewer.md` | AskUserQuestion escalation per entry |
| `oracle` subagent | chapter-membership / candidate lookups | yes | `.claude/agents/oracle.md` | AskUserQuestion |
| `.oracle/refactoring-2e/` (owner book) | ALL content fidelity | yes (provisioned + gitignored) | via `index.md` | none -- read only by subagents |
| `claude plugin validate` | regression gate | yes (Claude Code 2.1.x) | -- | -- |

**Missing dependencies with no fallback:** none. The re-plan's prerequisite is that the converged
oracle agents are LIVE -- each authoring plan runs `/reload-plugins` (or restarts the session) before
invoking them.

**Missing dependencies with fallback:** none blocking.

## Validation Architecture

> `nyquist_validation: true`. FWL-01..FWL-04 map to the overhauled checker battery + the `tsc
> --strict` harness. No unit-test framework; the instrument is `rg`/Node checkers (the Phase-3
> mechanical-gate pattern), the compile harness, and the `oracle-reviewer` fidelity gate.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None (docs/skill repo). Checkers: Node `.mjs` + `tsc --strict --noEmit` + `oracle-reviewer` |
| Config file | `.claude/skills/lz-refactor-workspace/tsconfig.json` (07-01) |
| Quick run command | `node .../extract-samples.mjs && node .../tools/check-hygiene.mjs` (per authored leaf) |
| Full suite command | extract-samples + check-catalog + check-smells + check-crossrefs + check-principles + check-hygiene + `claude plugin validate .` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command / Check | File Exists? |
|--------|----------|-----------|---------------------------|-------------|
| FWL-01 | 62 leaves present (identity), each with Use-when + Motivation + Mechanics + Example + provenance; index rows mirror `Use when:` | structural | `check-catalog.mjs`: 62-name identity across leaves; per-leaf contract; Return Modified Value `[web-only]` + Split Phase `[web-example]`; no dupes; no scaffolding phrases; index-row mirror | overhauled in 07-02 |
| FWL-02 | 24 smell leaves with resolving candidate links + discriminators; navigation-only index; bidirectional smell<->refactoring | structural | `check-smells.mjs` (24 leaves + index + candidate resolution) + `check-crossrefs.mjs` (bidirectional + no self-ref + resolve) | overhauled/new in 07-02 |
| FWL-03 | Ch.2 topic set present with attributions + trigger routing links | presence | `check-principles.mjs` topic-presence (definition, two hats, rule of three, preparatory, comprehension, litter-pickup, performance, YAGNI) | 07-01 (authored 07-03) |
| FWL-04 | Every TS sample `tsc --strict`-clean AND behavior-preserving | compile + semantic | `extract-samples.mjs` -> `tsc --strict --noEmit` exits 0; behavior-preservation gated by the `oracle-reviewer` example axis | 07-01 harness |
| (hygiene) | ASCII-only; no verbatim prose; work-email absent (DST-04, public-repo) | negative | `check-hygiene.mjs` (scanNonAscii; work-email allowlist; no-verbatim heuristic) | 07-01 |

### Sampling Rate
- **Per task commit:** ASCII + hygiene + extract-samples over the file(s) touched; the authored
  leaf's `oracle-reviewer` verdict is `pass` (or owner-accepted `blocked`).
- **Per wave merge:** extract-samples + check-hygiene (+ check-catalog partial). `check-crossrefs` is
  a PHASE-GATE check (07-10), NOT a per-wave gate -- cross-chapter links point at leaves that do not
  exist yet during wave 3.
- **Phase gate (07-10):** full battery GREEN (check-catalog 62/62, check-smells 24/24, check-crossrefs,
  extract-samples, check-principles, check-hygiene) + `claude plugin validate .`.

### Wave 0 Gaps
- None outstanding: the harness + four checkers exist (07-01); 07-02 overhauls check-catalog/
  check-smells to the 62/leaf model and adds check-crossrefs. `check-principles` + `check-hygiene`
  are unchanged and stay green.

## Security Domain

> `security_enforcement` absent (treat as enabled). Docs-authoring phase with a dev-only compile
> harness: no runtime, no network, no user input, no auth/session/crypto. Standard application ASVS
> categories do not apply. The real surface is intellectual-property hygiene and supply chain.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 / V3 / V4 / V5 / V6 | no | -- (no runtime input/auth/crypto) |
| V14 Config / Dependencies (supply chain) | yes | Pin `typescript@6.0.3`; add no other dependency; legitimacy-gate any proposal |

### Known Threat Patterns for this stack
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Copyright infringement (verbatim Fowler prose/code) | Information Disclosure / legal | Clean-room firewall: main context never reads `.oracle/`; leaves authored BLIND; `oracle-reviewer` near-verbatim gate; `check-hygiene` no-verbatim heuristic; Phase-10 scan |
| Fan-out aggregation reconstructing the book's curated selection | Information Disclosure / legal | Driver dedupes/caps merged oracle output; no persisted full ordered name+chapter map |
| Fabricated / unfaithful catalog content | Tampering (reference integrity) | `oracle-reviewer` fidelity gate (`pass\|revise\|blocked`) + converge loop; owner escalation on non-converge |
| Silently-passing checker after the 66->62 change | Tampering | 62-name IDENTITY + per-leaf contract + bidirectional/no-self-ref cross-ref checks; RED-by-design baseline proven before content lands |
| Private work-email leak into a public repo | Information Disclosure | `check-hygiene` work-email allowlist (recurred twice in Phase 4; keep the gate) |
| Supply-chain (slopsquatted extractor dependency) | Tampering | No new runtime dep; hand-rolled extractor + first-party `typescript` only |

## Sources

### Primary (HIGH confidence)
- `platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices` (fetched 2026-07-05) --
  current Agent Skills authoring guidance: SKILL.md as a table-of-contents overview; 500-line body
  cap; 100-line-TOC rule; "domain-specific organization" many-small-files pattern; "keep references
  one level deep"; degrees-of-freedom (numbered imperative steps); "examples are concrete";
  "provide a default" (avoid too many options).
- `anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills` (via WebSearch,
  2026-07-05) -- progressive disclosure three-stage model (discovery/activation/execution); no context
  penalty for unread bundled files; lean index + references pattern.
- Local `07-ROUTING-ARCHITECTURE.md` + `07-ORACLE-MODEL.md` (LOCKED design) -- 62-scope, per-refactoring
  leaves, two-tier smells, chapter-grouped index, clean-room loop, canonical per-axis anchors, driver
  responsibilities.
- Local `.claude/agents/oracle-reviewer.md` + `oracle.md` (shipped agents) -- firewall contract,
  verdict schema (`pass|revise|blocked|error`), input contract.
- Local `07-01-SUMMARY.md` + the workspace harness/checkers -- the built FWL-04 harness + checker
  idiom + RED-by-design baseline.
- Local `lz-tpp/references/` + Phase-3 LEARNINGS/SUMMARY -- reference granularity, `tsc --strict`-clean
  TS pattern, ASCII normalization, line-wrap lesson, toolchain (Node v24.18.0, tsc 6.0.3).
- `.planning/research/refactoring-com-overview.md` -- 62/66 names + 1st-ed aliases + tags + inverse-of
  (orientation scaffold, owner-confirmed count).
- `npm view typescript version` -> 6.0.3; local `tsc --version` 6.0.3, `node --version` v24.18.0
  (verified 2026-07-05).

### Secondary (MEDIUM confidence)
- `en.wikipedia.org/wiki/Clean-room_design` (via WebSearch, 2026-07-05) -- clean-room / Chinese-wall
  method; isolated-reviewer certification; Sony v. Connectix porous-wall failure.
- `arxiv.org/pdf/2506.19881` "Blameless Users in a Clean Room: Defining Copyright Protection for
  Generative Models" (via WebSearch, 2026-07-05) -- clean rooms formalized for generative models.
- `cookbook.openai.com/examples/gpt4-1_prompting_guide` (via WebSearch, 2026-07-05) -- literal
  instruction-following; be explicit; few-shot still effective; mirror example behavior in rules;
  imperative phrasing -- confirms the content-format basis the LOCKED design cites.

### Tertiary (LOW confidence)
- The 24 bad-smell names (A1) + chapter-membership sizing (A2) -- orientation; oracle-confirmed at
  authoring. Two-tier smell-leaf design (Pattern 3) -- design-reasoned + doc-supported. Extractor-vs-
  library tradeoff (A5) -- reasoned.

## Metadata

**Confidence breakdown:**
- Standard stack / toolchain: HIGH -- re-verified 2026-07-05 locally + on the registry.
- Progressive-disclosure structure: HIGH -- current Anthropic best-practices doc verified; the
  one-level-deep tension is surfaced with a mitigation (MEDIUM on that single point).
- Clean-room loop: MEDIUM-HIGH -- established legal precedent + recent academic work; the blind-author
  variant is design-reasoned.
- Content format: HIGH -- GPT-4.1 guide + Anthropic best-practices both confirm.
- Smell-leaf two-tier + fan-out coordination: MEDIUM -- design-reasoned + doc-supported; slug-drift is
  the top residual risk.
- Content (mechanics/motivations/smell text): OUT OF RESEARCH SCOPE -- produced by the clean-room loop,
  not fabricated here.

**Research date:** 2026-07-05 (refresh of 2026-07-04 base)
**Valid until:** 2026-08-04. Re-verify the Agent Skills best-practices guidance and `typescript`
`latest` if the gap widens.

## Impact on the LOCKED plans

> Recommendations only. The LOCKED plans (07-02, 07-04..07-10) are NOT edited here. Net assessment:
> the refresh CONFIRMS the locked design -- no required plan change. Two enrichments and one watch-item
> are worth folding in when convenient.

1. **[ENRICHMENT -- recommended] Pin the canonical name->slug map in 07-02's SUMMARY.** The single
   highest fan-out risk is cross-chapter slug drift (Pitfall 1): six parallel wave-3 plans author
   inverse-of / see-also / smell->refactoring links across a file boundary they cannot see during
   wave 3, and mismatches surface only at the 07-10 `check-crossrefs` gate. 07-02 already produces the
   pilot SUMMARY that wave-3 reads; adding the explicit kebab-case slug for all 62 canonical names to
   that SUMMARY makes the cross-link target contract shared and deterministic. No plan edit needed --
   this is a note for the 07-02 executor's SUMMARY content.

2. **[ENRICHMENT -- optional] Note the one-level-deep tension in the pilot calibration.** The current
   Anthropic best-practices doc reaffirms "keep references one level deep from SKILL.md," while the
   locked hop is SKILL -> index -> leaf (two levels) plus leaf<->leaf cross-links. The plans already
   enforce the mitigation (thin navigation-only indexes; self-contained leaves; "see also" cross-links
   that are not load-bearing). Worth recording in the pilot SUMMARY as an explicit design rationale so
   the fan-out authors keep indexes thin and leaves self-contained rather than drifting toward
   index-inlined content. No structural change.

3. **[CONFIRMATION -- no action] Content-format + clean-room citations hold.** The GPT-4.1 guide and
   the Anthropic best-practices doc confirm the leaf content-format basis (one compact example over
   many; imperative numbered mechanics; examples concrete; provide a default). Clean-room / Chinese-
   wall design + the generative-model clean-room paper confirm the `oracle`/`oracle-reviewer` loop is a
   sound copyright-safe method, with the porous-wall failure mode already mitigated by the agent-file
   firewall + the driver aggregation guard. The 07-01 harness (tsc + module-per-fence) and the 07-02
   checker overhaul (62 / per-leaf / smell-leaf / +check-crossrefs) remain the correct FWL-04/FWL-01/
   FWL-02 instruments. No change to 07-02..07-10.
