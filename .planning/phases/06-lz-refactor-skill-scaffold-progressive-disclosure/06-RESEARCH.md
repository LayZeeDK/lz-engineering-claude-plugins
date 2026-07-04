# Phase 6: lz-refactor Skill Scaffold & Progressive Disclosure - Research

**Researched:** 2026-07-04
**Domain:** Claude Code plugin skill authoring -- lean router SKILL.md + progressive-disclosure references/ scaffold (no catalog content)
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** `SKILL.md` is a HYBRID router -- lz-tpp's dual-mode framing (Coach mode + Reference mode, routed by intent) combined with angular-developer's task-area-sectioned pointer layout (one `##` section per reference group, each ending in a one-level-deep `[references/x.md](references/x.md)` pointer). Keep it lean (< 500 lines hard cap; target lz-tpp scale, ~90-150 lines at scaffold).
- **D-02:** Frontmatter is MINIMAL, matching lz-tpp: `name: lz-refactor` + `description` only. Omit `disable-model-invocation` (default false -> auto-triggers as coach), omit `user-invocable` (default true -> invocable as reference), omit `allowed-tools` (pure guidance skill), omit `version` (not in the skill frontmatter spec; versioned via `plugin.json`). No `license`/`metadata` block -- stay repo-consistent.
- **D-03:** Five task-area reference groups per SKEL-02, each reachable one level deep from `SKILL.md`: (1) Fowler catalog, (2) unified smell taxonomy, (3) Fowler Ch.2 principles, (4) Kerievsky pattern-directed catalog, (5) refactoring-without-tests (Feathers). Beck principle-backing folds into the principles group or a sibling `principles-*` file -- final placement decided in Phase 9.
- **D-04:** The two large catalogs are structured SPLITTABLE from day one (Fowler as a subdir / multi-file group; Kerievsky likewise) so no single file forces the whole catalog into context (SKEL-04). The EXACT intra-catalog file split axis is DEFERRED to Phase 7 / Phase 8. Phase 6 guarantees the architecture supports the split; it does NOT freeze the axis.
- **D-05:** Each `references/` file is a STUB -- a heading, a one-line scope statement, a `Populated in Phase N` marker, and the per-entry content contract the later phase fills. Fowler entry contract: name / motivation / distilled mechanics (original words) / TS-JS before-after / provenance label. Kerievsky entry contract: name / intent / mechanics / TS-JS re-rendered from Java / composed Fowler primitive(s) / To-Towards-Away direction / GoF cross-ref. Stubs make `SKILL.md` pointers resolve and document the contract WITHOUT fabricating oracle content.
- **D-06:** No catalog CONTENT and no detailed coach decision procedure are authored in Phase 6. `SKILL.md` carries only dual-mode framing + a minimal routing skeleton + the reference pointers. Full coach behavior -> Phase 9.
- **D-07:** The `description` mirrors lz-tpp's proven dual-mode shape (refactor step / code smell / choosing the next NAMED refactoring; explain on demand; explicit "Do NOT use it for..." near-miss). Tuned for refactor-step / code-smell / refactoring-catalog / de-patterning triggers, within the description char cap. Empirical trigger tuning deferred to Phase 11 (EVL-01).
- **D-08:** The `description` explicitly disambiguates the lz-tpp seam (refactor step vs. green/transformation step) so the two sibling skills do not cross-trigger.
- **D-09:** Phase 6 requires NO authoritative oracle book access -- it is scaffold-only. The scaffold MUST leave clean insertion points + the per-entry content contracts (D-05). Phase 7/8 planning + execution MUST open an AskUserQuestion oracle-access checkpoint before authoring catalog content.

### Claude's Discretion
- Exact `SKILL.md` section ordering, stub wording, and individual file names within the agreed five-group structure.

### Deferred Ideas (OUT OF SCOPE for Phase 6)
- Full coach decision procedure (smell -> named-refactoring routing, de-patterning, behavior-preservation, Feathers fallback, lz-tpp seam detail) -> Phase 9.
- Catalog CONTENT: 66 Fowler refactorings, 27 Kerievsky refactorings, the 24 Fowler + Kerievsky Ch.4 smells, Ch.2 principles -> Phases 7-8 (oracle-verified).
- The exact intra-catalog file split axis -> Phase 7 / Phase 8 (oracle-informed).
- Version bump to 0.0.2, README + CHANGELOG -> Phase 10 (DST-01, DST-03).
- Skill-effectiveness evals -> Phase 11 (EVL-01, EVL-02).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SKEL-01 | Invocable `/lz-tdd:lz-refactor`; skill at `plugins/lz-tdd/skills/lz-refactor/SKILL.md` with dual-mode default frontmatter | Frontmatter spec confirmed (Q1): name+description only; dual-mode via omitted defaults; command derives from directory name. lz-tpp precedent shipped+validated. |
| SKEL-02 | Progressive disclosure -- lean router SKILL.md lazy-loads references/ grouped by 5 task areas, modeled on angular-developer + authoring guidance; < 500 lines | angular-developer model extracted (Q2/Q3); skill-creator "< 500 lines, add a hierarchy layer" rule; concrete 5-group layout recommended. |
| SKEL-03 | `description` tuned for refactor-step / code-smell / catalog prompts, quiet on near-misses, within char cap | skill-creator description-authoring shape distilled (Q5); lz-tpp 4-part structure (750 chars, 100/100 recall/specificity) to reuse; seam exclusion per D-08. |
| SKEL-04 | Each references/ doc reachable via one-level-deep pointer; heavy catalog bundled not inlined; no single file forces whole catalog into context | Index-entry-point pattern confirmed compatible (Q2); catalog subdirs + thin index files (Q3); validation checks defined (Q6). |
</phase_requirements>

## Summary

This is a **scaffold-only, pure-Markdown** phase. It stands up a sibling skill to the shipped
`lz-tpp` under the same `lz-tdd` plugin: a new directory `plugins/lz-tdd/skills/lz-refactor/`
with a lean dual-mode router `SKILL.md` plus a wired `references/` tree whose files are
content-contract STUBS. No external packages, no code, no book/oracle access, and no catalog
content are involved. Every fact needed to plan it is verified against authoritative local
sources: the in-repo `lz-tpp` skill (shipped + `validate --strict`-clean + skill-reviewer PASS
in Phase 4, 100/100 trigger eval in Phase 5), the external `angular-developer` clone (the
task-area-sectioned router model, 42 reference files), and the installed `skill-creator` /
`plugin-dev:skill-development` authoring skills.

The three load-bearing findings: (1) **dual-mode is achieved by OMISSION** -- `name` +
`description` only; the defaults (`disable-model-invocation: false`, `user-invocable: true`)
give auto-triggering coach + user-invocable reference for free, exactly as `lz-tpp` ships.
(2) **A one-level-deep pointer from SKILL.md to a catalog ENTRY-POINT index (which itself links
to split leaf files) is explicitly sanctioned** by skill-creator ("Keep SKILL.md under 500
lines; if approaching this limit, add an additional layer of hierarchy along with clear
pointers") and satisfies SKEL-04 provided the entry-point index stays thin (names + one-line +
pointer per entry, never full content). (3) **`claude plugin validate .` checks structure and
frontmatter, NOT markdown body-link resolution** -- so "every references/ pointer resolves" is a
filesystem check, and the stub files must exist for the pointers to resolve and for
skill-reviewer's "referenced files exist" check to pass.

**Primary recommendation:** Copy the `lz-tpp` SKILL.md SHAPE (minimal frontmatter + dual-mode
framing + `[references/x.md](references/x.md)` pointer idiom) and overlay angular-developer's
`##`-per-task-area sectioning; put the two big catalogs (Fowler, Kerievsky) in subdirs behind
thin index entry-points, the three smaller groups (smells, principles, refactoring-without-tests)
as single stub files; keep SKILL.md at ~90-150 lines with a ~750-char, 4-part description that
carries the lz-tpp-seam exclusion.

## Architectural Responsibility Map

Single deliverable (one skill); the meaningful "tiers" are the progressive-disclosure loading
levels, not runtime services.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Triggering (auto + on-demand) | Frontmatter `description` (always in context) | -- | Description is the sole trigger mechanism; must carry both modes + the seam exclusion. |
| Mode routing (coach vs reference) + task-area routing | SKILL.md body (loaded on trigger) | -- | Lean router; dual-mode framing + `##`-per-area pointers only. No catalog content (D-06). |
| Fowler catalog (66 entries, splittable) | `references/` subdir + thin index entry-point | leaf stub files | Volume forces bundling (SKEL-04); subdir keeps split axis deferrable (D-04). |
| Kerievsky catalog (27 entries, splittable) | `references/` subdir + thin index entry-point | leaf stub files | Same as Fowler; composes Fowler primitives so it comes after (Phase 8). |
| Smell taxonomy (coach trigger table) | single `references/` stub file | -- | One cohesive table; better kept together than split. |
| Ch.2 principles + Beck/Feathers backing | single `references/` stub file(s) | -- | Moderate size; Beck placement finalized Phase 9 (D-03). |
| Refactoring-without-tests (Feathers) | single `references/` stub file | -- | Bounded core-techniques reference. |

## Standard Stack

No external libraries, package managers, runtimes, or build tools are added by this phase. The
"stack" is the Claude Code plugin/skill file format plus the built-in `claude` CLI validator.

### Core
| Component | Version | Purpose | Why Standard |
|-----------|---------|---------|--------------|
| `SKILL.md` (YAML frontmatter + Markdown body) | Agent Skills format, Claude Code >= 2.1.x | The skill: `name`+`description` metadata + lean router body | Required, single source of the `/lz-tdd:lz-refactor` command (derives from directory name). [VERIFIED: in-repo lz-tpp shipped this shape] |
| `references/` bundled docs | n/a | On-demand progressive-disclosure tier | Standard skill layout; auto-loaded only when SKILL.md points to them. [CITED: plugin-dev skill-development SKILL.md] |
| `claude plugin validate .` / `--strict` | Claude Code >= 2.1.x | Structural + frontmatter gate | First-party validator; the authoritative structural gate (used clean in Phases 1-4). [VERIFIED: `claude` CLI available on PATH this session] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Minimal `name`+`description` frontmatter | Add `version`/`license`/`metadata` (as angular-developer does) | angular-developer carries `license`/`metadata`/`version`; lz-tpp carries none and shipped clean. `version` is NOT in the current skill frontmatter spec (harmless but noise). D-02 locks minimal; stay repo-consistent. [CITED: project TECHNOLOGY STACK research + CLAUDE.md] |
| Catalog subdir + thin index entry-point | Flat references/ with SKILL.md pointing directly at every leaf (angular-developer's 42-file model) | Flat-direct is fine for ~40 curated files, but pointing SKILL.md at 66 Fowler leaves bloats the router and re-touches SKILL.md whenever the split axis changes. Subdir+index keeps SKILL.md lean and the axis deferrable (D-04). |

**Installation:** None. `git`-tracked Markdown/JSON only; skills are auto-discovered (no
`plugin.json` edit needed -- validated in Phase 1).

## Package Legitimacy Audit

**Not applicable.** This phase installs zero external packages (npm/PyPI/crates). It authors
Markdown and validates with the built-in `claude` CLI. No slopcheck / registry verification is
required. If any future task proposes adding a dependency, halt and run the Package Legitimacy
Gate first.

## Architecture Patterns

### System Architecture Diagram (load + trigger flow, this skill)

```
Install: /plugin install lz-tdd@...     (already installed for lz-tpp; lz-refactor is additive)
   -> Claude Code scans plugins/lz-tdd/skills/  (auto-discovery, no manifest edit)
   -> finds skills/lz-refactor/SKILL.md
   -> loads frontmatter (name + description) into context  [ALWAYS ON]

Session mentions a refactor step / code smell / "which refactoring" / named refactoring
   -> description match -> SKILL.md body loads  [ON TRIGGER]
   -> body routes by intent:
        Coach mode  (smell present, "which refactoring?") --.
        Reference mode ("explain Extract Function")       --+--> task-area section
                                                              |
        section pointer -> references/<group>            [ON DEMAND]
             |                                    |                  |
             v                                    v                  v
   references/fowler-catalog/README.md   references/smells.md   references/kerievsky-catalog/README.md
        (thin index)                       (single file)            (thin index)
             |                                                          |
             v  (internal fan-out; Phases 7-8 add leaves)              v
   references/fowler-catalog/<split leaves>          references/kerievsky-catalog/<split leaves>
```

Phase 6 delivers the boxes; the leaves are empty of content but present as stubs carrying the
per-entry contract (D-05). The green step of red-green-refactor routes to the sibling `lz-tpp`;
the refactor step routes here (seam noted in SKILL.md + carved out in each description).

### Recommended Project Structure (concrete; file names are Claude's discretion per D-09)

```
plugins/lz-tdd/skills/lz-refactor/
|-- SKILL.md                              lean dual-mode router (~90-150 lines, < 500 hard cap)
'-- references/
    |-- fowler-catalog/                   SPLITTABLE subdir (D-04) -- Fowler 66 refactorings
    |   '-- README.md                     thin index entry-point (SKILL.md points HERE, one hop)
    |                                        (Phase 7 adds split leaf files under this dir)
    |-- kerievsky-catalog/                SPLITTABLE subdir (D-04) -- Kerievsky 27 refactorings
    |   '-- README.md                     thin index entry-point (SKILL.md points HERE, one hop)
    |                                        (Phase 8 adds split leaf files under this dir)
    |-- smells.md                         unified smell taxonomy (coach trigger table) -- stub
    |-- principles.md                     Fowler Ch.2 principles (+ Beck backing per D-03) -- stub
    '-- refactoring-without-tests.md      Feathers no-tests core techniques -- stub
```

Rationale:
- **Two catalogs = subdirs with an index.** Satisfies D-04 (splittable day one) and SKEL-04
  (no single file forces the whole catalog into context) while keeping SKILL.md's pointer count
  at five. The intra-catalog split axis is not chosen here -- the subdir + index simply admits
  any axis Phase 7/8 picks without re-touching SKILL.md.
- **Three smaller groups = single files.** Smells is one cohesive trigger table; principles and
  refactoring-without-tests are bounded. Splitting them now would be speculative structure.
- **Every SKILL.md pointer is one hop** (`references/smells.md`, `references/fowler-catalog/README.md`).
  The catalog index -> leaf links are the internal second hop; SKEL-04 constrains the SKILL.md
  hop, and CONTEXT (D-01 + D-04) explicitly blesses this index-entry-point shape.

### Pattern 1: Dual-mode by omission (copy lz-tpp verbatim in shape)
**What:** A skill auto-triggers as a coach AND is user-invocable as a reference using only the
frontmatter defaults.
**When:** Any skill that must both fire automatically and answer `/lz-tdd:lz-refactor` directly.
**How:** Include only `name` + `description`. Do NOT set `disable-model-invocation` (default
`false` keeps auto-triggering) and do NOT set `user-invocable` (default `true` keeps direct
invocation). Frontmatter `name` MUST equal the directory name `lz-refactor` (the command is
`/{plugin}:{skill-dir}`; misalignment is Anti-Pattern 5 in the milestone ARCHITECTURE research).

```yaml
# Source: plugins/lz-tdd/skills/lz-tpp/SKILL.md (shipped, validate --strict clean)
---
name: lz-refactor
description: >-
  <4-part dual-mode description, ~750 chars -- see Pattern 3>
---
```

### Pattern 2: Task-area-sectioned router (from angular-developer) fused with lz-tpp dual-mode
**What:** One `##` section per reference group; each section = a one-line scope sentence + a
one-level-deep pointer; an optional "for deeper material, read X" line.
**When:** A router that fans out to multiple reference groups.
**How (extracted from angular-developer/SKILL.md, 180 lines, 42 refs):** angular-developer opens
with a short numbered "always do this" preamble, then `## <Task Area>` blocks like:
`- **Fundamentals**: <one-line scope>. Read [components.md](references/components.md)`.
For lz-refactor, precede the sections with the lz-tpp-style "Two modes" + "refactoring vs
transformation (the lz-tpp seam)" framing, then the five `##` task-area sections each ending in
its pointer.

```markdown
# Source: angular-developer/.claude/skills/angular-developer/SKILL.md (task-area sectioning)
## Fowler catalog (mechanical refactorings)
When routing a mechanical smell or looking up a named Fowler refactoring, consult the catalog
index: [references/fowler-catalog/README.md](references/fowler-catalog/README.md)
```

### Pattern 3: The 4-part dual-mode description (why lz-tpp scored 100/100)
lz-tpp's shipped description is 750 chars and scored 100% recall (13/13) + 100% specificity
(14/14) in Phase 5. Its reusable structure:
1. **Core action + when** ("This skill should be used during red-green-refactor TDD to
   recommend the next code transformation ... and to explain ... on demand").
2. **Concrete trigger contexts + phrases** ("when the user mentions TPP, transformation
   priority, ... or asks what a transformation such as (constant -> scalar) means").
3. **Both modes named** (coach when a failing test + code are present; reference for
   explain-on-demand).
4. **Explicit near-miss exclusion** ("Do not use it for generic write-a-function, write-code,
   add-a-feature, or plain refactoring requests ...").

Note the seam is already bidirectional: lz-tpp's negative clause excludes "plain refactoring"
(lz-refactor's territory), so lz-refactor's description must symmetrically exclude the green /
transformation step (D-08). Draft for lz-refactor (planner refines wording; empirical tuning ->
Phase 11):
- (1) used during the **refactor step** of red-green-refactor to pick the next NAMED refactoring
  for a detected code smell, and to explain refactorings / smells / refactoring principles on
  demand;
- (2) triggers: a code smell is present, "which refactoring should I apply", named-refactoring
  lookup (e.g. Extract Function, Replace Conditional with Polymorphism), "refactor away from a
  pattern" (de-patterning), Fowler / Kerievsky catalog questions;
- (3) coach mode (smell -> named refactoring) + reference mode (explain on demand);
- (4) Do NOT use it for the **green / transformation step** (choosing the change that makes a
  failing test pass -- that is lz-tpp), plain feature work, or generic write-code requests.
Keep the combined length near lz-tpp's ~750 chars, well under the cap.

### Anti-Patterns to Avoid
- **Inlining catalog content in SKILL.md.** Violates SKEL-04 and D-06; bloats always-triggered
  context and weakens triggering. Keep SKILL.md to framing + routing + pointers.
- **A "thick" catalog index.** If `fowler-catalog/README.md` inlines all 66 full entries it
  re-creates the exact problem SKEL-04 forbids. The index is names + one-line + pointer only.
- **Frontmatter drift.** Adding `version`, `allowed-tools`, or a `metadata` block diverges from
  the lz-tpp repo convention (D-02) and adds validator surface; `version` is not even in the
  skill spec.
- **Directory/name mismatch.** `name:` must be `lz-refactor` (== dir), or the command and
  triggering get confusing.
- **Seeding verbatim book prose into stubs.** Even scaffold stubs must carry only the contract
  template and original wording (DST-04); no Fowler/Kerievsky/GoF prose or code.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Structural / frontmatter validation | A custom YAML/manifest linter | `claude plugin validate .` (+ `--strict`) and the plugin-validator / skill-reviewer agents | First-party gate already used clean in Phases 1-4; re-implementing it is wasted surface. |
| Skill registration / command wiring | Any `plugin.json` edit or `commands/` entry | Auto-discovery of `skills/lz-refactor/SKILL.md` | Skills are auto-discovered; adding the dir needs no manifest change (validated Phase 1). The command derives from the dir name. |
| Dual-mode enablement | Explicit `disable-model-invocation`/`user-invocable` flags | The defaults (omit both) | Defaults already give coach + reference; setting them risks disabling a mode. |
| Description effectiveness proof | Bespoke trigger tests now | The native eval harness in Phase 11 (EVL-01) | Empirical tuning is explicitly deferred; Phase 6 only authors a well-structured first draft. |

**Key insight:** Almost everything here is a copy-the-precedent-shape exercise. The lz-tpp skill
is a working, validated, high-scoring template for every mechanical decision in this phase; the
only net-new design is the five-group references/ layout and the two catalog subdirs.

## Common Pitfalls

### Pitfall 1: Assuming `claude plugin validate` catches dangling references/ pointers
**What goes wrong:** Planner relies on `validate` to prove "every pointer resolves" and ships a
SKILL.md pointing at a file that does not exist.
**Why it happens:** `validate` checks marketplace.json schema, plugin.json, and skill/agent/
command **frontmatter** -- it does not parse Markdown body links or require reference files to be
non-empty. A broken body pointer passes `validate`.
**How to avoid:** Treat "every references/ pointer resolves" as a **filesystem assertion**
(extract `](references/...)` targets, assert each path exists) and a skill-reviewer check, not a
`validate` check. Create every stub file the SKILL.md points to. (See Validation Architecture.)

### Pitfall 2: SKEL-04 satisfied at the SKILL.md hop but violated inside the catalog
**What goes wrong:** SKILL.md correctly points one-level-deep to `fowler-catalog/README.md`, but
that index inlines all 66 entries -- so opening the index still forces the whole catalog into
context.
**Why it happens:** Conflating "one-level-deep pointer from SKILL.md" (satisfied) with "no
single file forces the whole catalog into context" (the real SKEL-04 constraint).
**How to avoid:** Keep the index thin -- names + one-line + a pointer per split leaf. Content
lives only in leaf files. In Phase 6 the leaves are stubs, so this is naturally satisfied; the
contract must be documented so Phases 7-8 preserve it.

### Pitfall 3: Frontmatter additions that pass validate but drift from repo convention
**What goes wrong:** Copying angular-developer's `license` / `metadata` / `version:` frontmatter.
**Why it happens:** angular-developer is the router MODEL for sectioning, not for frontmatter;
its frontmatter differs from the repo's lz-tpp convention.
**How to avoid:** For frontmatter, copy **lz-tpp** (name + description only, D-02). Use
angular-developer ONLY for the body sectioning pattern.

### Pitfall 4: Non-ASCII sneaking into stubs
**What goes wrong:** Arrows / em-dashes / smart quotes in stub templates -> mojibake on Windows
cp1252, violates the ASCII-only constraint.
**Why it happens:** Copy-pasting from book/web sources or using typographic characters.
**How to avoid:** ASCII only (`->`, `--`, straight quotes). This applies from the first stub.

## Code Examples

### SKILL.md skeleton (scaffold shape -- planner fills framing/wording)
```markdown
# Source: shape from plugins/lz-tdd/skills/lz-tpp/SKILL.md + angular-developer sectioning
---
name: lz-refactor
description: >-
  This skill should be used during the refactor step of red-green-refactor TDD to recommend the
  next NAMED refactoring for a detected code smell, and to explain refactorings, smells, and
  refactoring principles on demand. Use it as a coach when the tests are green and the code has a
  smell ... [triggers: code smell present, "which refactoring", named-refactoring lookup,
  refactor away from a pattern, Fowler/Kerievsky catalog questions] ... Do not use it for the
  green/transformation step (making a failing test pass -- that is lz-tpp), plain feature work,
  or generic write-code requests.
---

# lz-refactor: Refactoring coach (Fowler + Kerievsky)

<one-paragraph purpose>

## Two modes
- Coach mode: <smell present -> recommend a NAMED refactoring>   (full procedure -> Phase 9)
- Reference mode: <explain a refactoring / smell / principle on demand -> route to references/>

## Refactoring vs the green step (the lz-tpp seam)
<one line: refactor step = lz-refactor; green/transformation step = lz-tpp>

## Fowler catalog (mechanical refactorings)
<one-line scope>. [references/fowler-catalog/README.md](references/fowler-catalog/README.md)

## Smell taxonomy (coach trigger table)
<one-line scope>. [references/smells.md](references/smells.md)

## Refactoring principles (Fowler Ch.2 + backing)
<one-line scope>. [references/principles.md](references/principles.md)

## Kerievsky pattern-directed refactorings
<one-line scope>. [references/kerievsky-catalog/README.md](references/kerievsky-catalog/README.md)

## Refactoring safely without tests (Feathers)
<one-line scope>. [references/refactoring-without-tests.md](references/refactoring-without-tests.md)
```

### Stub file content contract (D-05) -- Fowler leaf/index example
```markdown
# Fowler Catalog (Refactoring, 2nd ed)

Scope: all 66 Fowler refactorings, provenance-labeled. Coach routes mechanical smells here.

> Populated in Phase 7 (owner e-book/web oracle; AskUserQuestion checkpoint required before
> authoring -- D-09). No verbatim book prose or code (DST-04).

## Per-entry content contract (each refactoring)
- Name (2nd-ed canonical; list 1st-ed aliases it replaces)
- Motivation (original words)
- Distilled mechanics (original words)
- TS/JS before -> after example (original, tsc --strict clean)
- Provenance label (print-absent "+" entries and Split Phase online-only marked)

<!-- Split axis (subdir leaves) DEFERRED to Phase 7 planning -- D-04. Candidate axes below. -->
```

### Stub file content contract (D-05) -- Kerievsky entry contract
```markdown
## Per-entry content contract (each pattern-directed refactoring)
- Name; intent
- Distilled mechanics (original words)
- TS/JS example re-rendered from the book's Java (original, tsc --strict clean)
- Composed Fowler primitive(s) it builds on
- Direction: To / Towards / Away (call out de-patterning cases)
- GoF pattern cross-reference (vocabulary only; no GoF text -- DST-04)
```

## Candidate Fowler split axes (report only -- Phase 7 chooses, D-04)

From `.planning/research/refactoring-com-overview.md` (orientation scaffold; owner e-book/web is
the oracle):
- **Fowler's own 20 tag-groups:** `basic`, `encapsulation`, `moving-features`,
  `organizing-data`, `simplify-conditional-logic`, `refactoring-apis`,
  `dealing-with-inheritance`, `collections`, `delegation`, `errors`, `extract`, `parameters`,
  `fragments`, `grouping-function`, `immutability`, `inline`, `remove`, `rename`, `split-phase`,
  `variables`.
- **Alternative axis:** book chapter grouping (Ch.6-12 groupings), or alphabetical/count-balanced
  buckets.

Kerievsky candidate axes (for Phase 8): by To/Towards/Away direction vs. by GoF pattern family.
**Do NOT pick either axis in Phase 6** -- the subdir + thin index admits any of them without
touching SKILL.md.

## Validation Architecture

nyquist_validation is `true` in `.planning/config.json` -> this section is required. There is no
code test framework in this repo (Markdown/JSON plugin); the "tests" are shell/filesystem
assertions plus the first-party `claude plugin validate`. This drives VALIDATION.md.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None (Markdown/JSON plugin). Verification = shell assertions + `claude plugin validate` + first-party review agents. |
| Config file | none -- see Wave 0 |
| Quick run command | `claude plugin validate .` (structure + frontmatter, exit 0) |
| Full suite command | `claude plugin validate . --strict` (exit 0) + the pointer/line/length assertions below |

### Success Criteria -> Verifiable Checks
| SC | Behavior | Check type | Automated command / assertion | File exists? |
|----|----------|-----------|-------------------------------|-------------|
| SC1 | Skill exists + invocable + dual-mode frontmatter | file + frontmatter | `test -f plugins/lz-tdd/skills/lz-refactor/SKILL.md`; parse YAML: `name == "lz-refactor"` (== dir), `description` non-empty; assert `disable-model-invocation` absent AND `user-invocable` absent (dual-mode by default) | Wave 0 |
| SC1 | `/lz-tdd:lz-refactor` resolves | structural | `claude plugin validate .` exit 0 (command derives from dir under lz-tdd/skills) | uses existing tool |
| SC2 | Lean router < 500 lines | line count | `wc -l SKILL.md` < 500 (target ~90-150) | Wave 0 |
| SC2 | Five task-area groups present | grep | assert 5 `##` section pointers exist (one per D-03 group) | Wave 0 |
| SC2 | Every references/ pointer resolves | filesystem | extract `](references/...)` targets from SKILL.md; assert each path exists on disk (NOT covered by `claude plugin validate` -- see Pitfall 1) | Wave 0 |
| SC3 | Description within char cap | length | combined `description` (+ `when_to_use` if any) length <= 1,536 chars; target ~750 (lz-tpp scale) | Wave 0 |
| SC3 | Description carries dual-mode + seam + near-miss | grep structure | assert "should be used" clause, a "Do not use" / near-miss clause, and an lz-tpp-seam mention (D-08) -- authorable checks only; empirical recall/specificity deferred to Phase 11 | Wave 0 |
| SC4 | Heavy material bundled, not inlined | structure | assert no catalog content in SKILL.md (line count small + no 66/27-entry list); `test -d references/fowler-catalog` and `test -d references/kerievsky-catalog` | Wave 0 |
| SC4 | No single file forces whole catalog | index thinness | assert catalog entry-point files are indexes (names/pointers), not full-content dumps (in Phase 6, leaves are stubs -> naturally satisfied) | Wave 0 |
| all | First-party review PASS | agents | plugin-validator + skill-reviewer PASS (skill-reviewer confirms referenced files exist + progressive disclosure) | uses existing tool |

### Sampling Rate
- **Per task commit:** `claude plugin validate .` + the file-exists / pointer-resolution assertion for files touched.
- **Per wave merge / phase gate:** `claude plugin validate . --strict` exit 0 AND all SC checks above green AND plugin-validator + skill-reviewer PASS, before `/gsd:verify-work`.

### Wave 0 Gaps
- [ ] A tiny verification script (bash or node `.mjs`) that runs the SC1-SC4 assertions
  (file exists, frontmatter keys, line count, pointer resolution, description length). This is
  the only new "test infra"; keep it a single throwaway checker, not a framework.
- [ ] No framework install needed. `claude` CLI already available.

## Security Domain

security_enforcement is not set in config (absent = enabled), so this section is included --
but this is a **pure-Markdown, no-code, no-input, no-network, no-crypto** scaffold, so the ASVS
application surface is essentially empty.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | no auth surface |
| V3 Session Management | no | no sessions |
| V4 Access Control | no | no runtime |
| V5 Input Validation | no | skill ships no code that parses input |
| V6 Cryptography | no | no crypto |

### Real (non-ASVS) gates for this phase -- repo hygiene + IP
| Concern | Threat | Mitigation |
|---------|--------|-----------|
| Public-repo hygiene | Leaking the work email into a public commit | Work email absent; public contact only (post-commit allowlist gate per project memory). |
| Licensing / copyright (DST-04) | Verbatim Fowler/Kerievsky/GoF prose or code in the tree | Stubs carry ONLY the contract template + original wording; no book prose/code even in scaffold. Enforced hard in Phase 10. |
| ASCII-only output | Mojibake on Windows cp1252 | ASCII only in every stub and SKILL.md. |
| Skill "lack of surprise" | Malicious/misleading skill content | Guidance-only skill; intent matches description. Trivially satisfied. [CITED: skill-creator SKILL.md] |

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Description listing truncation cap is 1,536 chars | Standard Stack / Validation | LOW. Sourced from the project's own TECHNOLOGY STACK research citing docs.claude.com (fetched 2026-07-01); docs.claude.com is AI-blocked so it was not re-fetched this session. The cap is a ceiling, not a target -- lz-tpp (750) and angular-developer (449) both work well under it, and the plan targets ~750. Even a moderately wrong cap does not change the scaffold. |

All other claims are VERIFIED against local authoritative sources (in-repo shipped/validated
lz-tpp; installed skill-creator + plugin-dev skills; on-disk angular-developer clone; the
`claude` CLI present this session) or CITED to those sources.

## Open Questions (RESOLVED)

1. **Beck principle-backing file placement (D-03).**
   - What we know: it folds into the principles group or a sibling `principles-*` file.
   - What's unclear: exact file(s) -- fold into `principles.md` vs. a separate `principles-beck.md`.
   - RESOLVED: scaffold a single `principles.md` stub now (Claude's discretion, D-09);
     Phase 9 finalizes placement. Do not over-split at scaffold time.

2. **Intra-catalog split axis (D-04) -- intentionally deferred.**
   - What we know: subdir + thin index admits any axis; Fowler tag-groups and chapter grouping
     are the candidates.
   - What's unclear: which axis -- resolved in Phase 7/8 with the owner oracle.
   - RESOLVED: for Phase 6, ship the subdir + index only; do NOT create per-axis leaf files
     (the split axis is intentionally deferred to Phase 7/8 per D-04).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `claude` CLI (`plugin validate`) | SC verification gate | yes | on PATH (used clean in Phases 1-4) | none needed |
| plugin-validator + skill-reviewer agents | first-party review | yes (plugin-dev installed) | -- | none needed |
| git | version control | yes | -- | none needed |

No missing dependencies. No new runtimes or packages introduced.

## Sources

### Primary (HIGH confidence)
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (in-repo, shipped, `validate --strict` clean Phase 4,
  100/100 trigger eval Phase 5) -- minimal frontmatter, dual-mode framing, pointer idiom,
  near-miss clause, 750-char description. THE shape to copy.
- `plugins/lz-tdd/skills/lz-tpp/references/` (transformations.md 116L, fibonacci 225L, tco 462L)
  -- reference granularity + provenance-labeling precedent.
- `plugins/lz-tdd/.claude-plugin/plugin.json` -- skills auto-discovered; no manifest edit needed.
- `D:\projects\github\LayZeeDK\in-browser-ai-coding-agent\.claude\skills\angular-developer\`
  (SKILL.md 180L + 42 reference files, description 449 chars) -- task-area-sectioned router model.
- Installed `skill-creator/skills/skill-creator/SKILL.md` -- progressive disclosure ("< 500
  lines; add a hierarchy layer with clear pointers"; ">300-line refs get a TOC"; domain-organized
  references), description authoring ("primary triggering mechanism", "be a little pushy",
  should-trigger vs near-miss eval design), "lack of surprise".
- Installed `plugin-dev/skills/skill-development/SKILL.md` -- frontmatter (name+description
  required), third-person "This skill should be used when..." description form, lean-SKILL.md +
  references/ progressive disclosure, "referenced files actually exist" review check.
- `.planning/research/ARCHITECTURE.md` -- skill/plugin layout, auto-discovery, name==dir
  anti-pattern, progressive-disclosure tiers.
- `.planning/research/refactoring-com-overview.md` -- Fowler 66 names + aliases + 20 tag-groups
  (candidate split axes).
- `claude` CLI verified available on PATH this session.

### Secondary (MEDIUM confidence)
- Project TECHNOLOGY STACK research (in CLAUDE.md) citing official Claude Code docs
  (docs.claude.com/en/docs/claude-code/skills + plugin-marketplaces, fetched 2026-07-01):
  1,536-char description cap, command-name derivation, namespacing, `version` not in skill spec.

### Tertiary (LOW confidence)
- None.

## Metadata

**Confidence breakdown:**
- Standard stack / frontmatter: HIGH -- verified against shipped, validated in-repo lz-tpp.
- Architecture (router + references layout): HIGH -- extracted from angular-developer + sanctioned
  by skill-creator's explicit "add a hierarchy layer" guidance.
- Pitfalls / validation: HIGH -- validate scope confirmed from project STACK research; pointer
  resolution correctly assigned to filesystem/skill-reviewer.
- Description cap: MEDIUM -- CITED (not re-fetched; docs.claude.com AI-blocked). Mitigated: cap is
  a ceiling, plan targets ~750 chars.

**Research date:** 2026-07-04
**Valid until:** ~2026-08-04 (stable format; skill/plugin spec is slow-moving). Re-check only if
Claude Code changes the skill frontmatter spec or the description listing cap.
