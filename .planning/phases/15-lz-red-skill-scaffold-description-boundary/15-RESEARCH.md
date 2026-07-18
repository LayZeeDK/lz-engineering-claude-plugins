# Phase 15: lz-red Skill Scaffold & Description Boundary - Research

**Researched:** 2026-07-18
**Domain:** Claude Code agent-skill scaffold (Markdown-only, progressive disclosure) -- the RED step of the lz-tdd plugin, mirroring shipped siblings lz-tpp (green) and lz-refactor (refactor).
**Confidence:** HIGH (both sibling skills, plugin.json, and the milestone ARCHITECTURE spec read directly on disk; char counts and line counts measured, not estimated)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Adopt the ARCHITECTURE.md reference layout verbatim -- flat single-topic docs plus one `testing-stance/` navigation subdir, clustered by DECISION-PROCEDURE STEP (not by source author, not 1:1 with phases). The 10 stub files to create:
  - `references/three-laws-and-test-selection.md`
  - `references/test-structure-and-assertions.md`
  - `references/testing-stance/README.md` (navigation index: detection signals + route table)
  - `references/testing-stance/functional-core.md` (Bernhardt FCIS)
  - `references/testing-stance/message-matrix.md` (Metz + Owen query/command matrix)
  - `references/testing-stance/seams-and-legacy.md` (Feathers seams + characterization)
  - `references/naming.md`
  - `references/anti-patterns.md`
  - `references/vitest-typescript-mechanics.md`
  - `references/principle-backing.md`
  Files that later span >1 phase are acceptable -- phases co-edit; a single decision doc must NOT be fragmented per-source (ARCHITECTURE Anti-Pattern 1).
- **D-02:** Each stub is a THIN content contract, not empty and not full content: a title + a scoped bullet list of what the doc will contain + the requirement IDs it satisfies + the source cluster + a "Populated in Phase NN" marker. No prose synthesis and no TS examples land in Phase 15 (those are Phases 16-17).
- **D-03:** Do NOT over-decompose (no per-author files) and do NOT create an eval workspace or add `.oracle/` books in this phase (Phases 20 and 16 respectively).
- **D-04:** Ship the router body only -- frontmatter (name + description), a "Two modes" (coach / reference) section, the RED-vs-green(lz-tpp)/refactor(lz-refactor) seam intro, a one-line "listen to the tests" / heuristic-not-law caveat, and a Reference-material pointer section linking every stub. The numbered coach decision procedure + stance-router detail is a LABELED PLACEHOLDER deferred to Phase 18. Target near lz-tpp's size (~80-140 lines), well under the < 500 cap.
- **D-05:** Frontmatter is dual-mode-by-omission: omit `disable-model-invocation` and `user-invocable` so the skill both auto-triggers (coach) and answers explicit `/lz-tdd:lz-red` (reference). No `version`, no `allowed-tools` (pure guidance skill).
- **D-06:** Draft a v1 three-way-guarded `description` now. Positive trigger: choose/write the next FAILING (red) unit test, keep a test list, pick the next test, adaptively match the codebase's testing stance. Language-agnostic (TypeScript/Vitest specificity lives in the body/references). Two reciprocal near-miss EXCLUSION clauses in the tail: "make a failing test pass" -> lz-tpp; "restructure/clean up passing code" -> lz-refactor.
- **D-07:** Size to the ~1000-1536-char load-bearing window (truncation at 1536); reserve the tail for the two exclusion clauses. Keep the positive-trigger sentence first.
- **D-08:** Empirical trigger tuning is DEFERRED to Phase 20 (EVL-01). Phase 15 ships a reasoned v1; the cross-skill trigger eval and any re-tuning happen in Phase 20. Do not pull eval work forward.
- **D-09:** Leave `plugins/lz-tdd/.claude-plugin/plugin.json` at `0.0.2` in Phase 15. The bump to `0.0.3` is DST-01 = Phase 19. `claude plugin validate .` exits 0 without a bump because skills are auto-discovered. This deliberately OVERRIDES ARCHITECTURE.md's "Phase A bumps plugin.json version."
- **D-10:** `.claude-plugin/marketplace.json` is UNCHANGED (version deliberately omitted there; skills auto-discovered).

### Claude's Discretion

- Exact stub-file wording of the per-doc content contracts (D-02) -- executor drafts them from the requirement clusters; content itself is Phases 16-18.
- Exact v1 `description` wording within the D-06/D-07 constraints -- reasoned draft; Phase 20 owns empirical validation.
- Whether Phase 15 uses a Nyquist "instrument-first" wave (a `claude plugin validate .` gate is the natural Wave-0 check); planner's call, but a validate gate is mandatory.

### Deferred Ideas (OUT OF SCOPE for Phase 15)

- Reference content authoring (own-words facts, TS/Vitest examples) -> Phases 16-17.
- Numbered coach procedure + stance-router logic + lz-tpp forward seam + reverse `lz-tpp -> lz-red` pointer (SEAM-02) -> Phase 18.
- plugin.json 0.0.3 bump + README + CHANGELOG + `--strict` validate + validator/reviewer PASS -> Phase 19.
- `.oracle/` owned-book setup + source distillation -> Phase 16.
- Eval workspace (`.claude/skills/lz-red-workspace/`) + trigger/behavior evals + description tuning -> Phase 20.
- Advanced RED leaves (`expectTypeOf`, `fast-check`) -> post-0.0.3.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| SKL-01 | `/lz-tdd:lz-red` invocable; skill at `plugins/lz-tdd/skills/lz-red/SKILL.md` with dual-mode-by-omission frontmatter (name + description only; `name` == dir). | Frontmatter shape verified against both siblings on disk (see Standard Stack + SKILL.md Router Skeleton). Skills auto-discovered from plugin root -- no manifest edit needed (verified: lz-tpp and lz-refactor are discovered with no path config in plugin.json). |
| SKL-02 | Lean `SKILL.md` router (< 500 lines; target near lz-tpp) using progressive disclosure -- heavy content in lazy `references/` (flat docs + one `testing-stance/` subdir). | Exact 10-file tree from ARCHITECTURE.md, confirmed against lz-tpp's flat grain (3 flat docs) and lz-refactor's index+subdir grain (see Scaffold File Tree). |
| SKL-03 | The `description` auto-triggers on RED-phase intent and carries reciprocal near-miss guards against lz-tpp and lz-refactor, within the char cap. | Concrete v1 draft (1083 chars, measured) + budget reconciliation + the lz-refactor exclusion-clause template (see The v1 Three-Way-Guarded Description). |
</phase_requirements>

## Summary

Phase 15 is a pure scaffold: create `plugins/lz-tdd/skills/lz-red/` containing one lean `SKILL.md` router and ten reference STUBS, and nothing else. Every architectural decision is already locked by `.planning/research/ARCHITECTURE.md` (the authoritative "Phase A" spec) and the 10 CONTEXT.md decisions (D-01..D-10), and the exact shape is observable on disk in two shipped siblings. There is no domain uncertainty and no new dependency -- the skill is Markdown-only. The researcher's job here is to hand the planner a precise file list, a SKILL.md section list, a concrete triggering description, and a lightweight Wave-0 validation gate.

The three load-bearing facts: (1) the tree is lz-tpp's flat grain (a handful of single-topic docs) plus lz-refactor's proven index-is-navigation-only + leaf-carries-content convention for the one branchy part (`testing-stance/`); do NOT over-decompose into per-author files (ARCHITECTURE Anti-Pattern 1). (2) The SKILL.md coach procedure is a LABELED PLACEHOLDER in Phase 15 -- the numbered decision procedure is Phase 18 (D-04). (3) The description carries the entire triggering burden and must fire on "write the next failing test" while staying quiet on lz-tpp's "make it pass" and lz-refactor's "restructure passing code"; empirical proof of that boundary is deferred to Phase 20 (D-08), so Phase 15 ships a reasoned v1, not a tuned one.

**Primary recommendation:** Copy the lz-refactor scaffold shape at lz-tpp grain. Create the 10 stubs (each a thin content contract naming its requirement IDs + fill-phase), write a ~90-120-line SKILL.md router with a placeholder coach section, ship the 1083-char v1 description below, and gate on `claude plugin validate .` exit 0 plus a handful of mechanical structural assertions. Do not bump plugin.json (D-09). Do not touch lz-tpp (SEAM-02 is Phase 18).

## Architectural Responsibility Map

The "tiers" here are the skill's structural layers, not web tiers. This maps each Phase-15 capability to the layer that owns it, for planner sanity-checking.

| Capability | Primary Layer | Secondary Layer | Rationale |
|------------|--------------|-----------------|-----------|
| Auto-trigger on RED intent + reciprocal exclusions | `SKILL.md` frontmatter `description` | -- | Description is the sole triggering mechanism for a dual-mode-by-omission skill [CITED: ARCHITECTURE.md Pattern 1]. |
| Mode split (coach vs reference) + seam intro + heuristic caveat | `SKILL.md` body (router) | -- | Router names the move and links out; never inlines content [CITED: ARCHITECTURE.md Anti-Pattern 2]. |
| Deep single-topic content (selection, structure, naming, anti-patterns, mechanics, backing) | `references/*.md` (flat) | -- | Lazy-loaded on demand; deferred to Phases 16-17 (Phase 15 = stubs only). |
| Adaptive stance routing content | `references/testing-stance/` (index + 3 leaves) | `SKILL.md` step 4 (Phase 18) | Only branchy part; index is navigation-only, leaves carry content [CITED: ARCHITECTURE.md Structure Rationale]. |
| Skill registration / namespacing as `/lz-tdd:lz-red` | Claude Code auto-discovery of `skills/` | plugin.json (unchanged, D-09) | Skills auto-discovered from plugin root; no manifest edit needed [VERIFIED: codebase -- siblings discovered with no path config]. |
| Coach decision procedure (numbered steps + stance router logic) | `SKILL.md` body -- LABELED PLACEHOLDER | -- | Deferred to Phase 18 [CITED: 15-CONTEXT.md D-04]. Phase 15 ships only the labeled stub. |

## Scaffold File Tree

**NEW files to create in Phase 15 (11 total: 1 router + 10 stubs). All under `plugins/lz-tdd/skills/lz-red/`:**

```
plugins/lz-tdd/skills/lz-red/
+-- SKILL.md                              # NEW lean router (~90-120 lines; placeholder coach section)
+-- references/
    +-- three-laws-and-test-selection.md  # STUB
    +-- test-structure-and-assertions.md  # STUB
    +-- testing-stance/                   # navigation subdir (index + 3 leaves)
    |   +-- README.md                     # STUB (navigation index: detection signals + route table)
    |   +-- functional-core.md            # STUB (Bernhardt FCIS)
    |   +-- message-matrix.md             # STUB (Metz + Owen matrix)
    |   +-- seams-and-legacy.md           # STUB (Feathers seams + characterization)
    +-- naming.md                         # STUB
    +-- anti-patterns.md                  # STUB
    +-- vitest-typescript-mechanics.md    # STUB
    +-- principle-backing.md              # STUB
```

This is verified against the two siblings on disk [VERIFIED: codebase]:
- **lz-tpp grain (flat):** `references/` holds 3 flat single-topic docs (`transformations.md`, `fibonacci-worked-example.md`, `typescript-and-tco.md`) -- no subdirs. lz-red's 7 flat docs mirror this.
- **lz-refactor grain (index + subdir):** `references/` holds `smells.md` (navigation index) alongside subdirs (`fowler-catalog/`, `kerievsky-catalog/`, `smells/`, ...), each with a `README.md`. lz-red's single `testing-stance/` subdir mirrors this at small grain -- one index + 3 leaves.

**UNCHANGED (do NOT edit in Phase 15):** `plugins/lz-tdd/.claude-plugin/plugin.json` (D-09), `.claude-plugin/marketplace.json` (D-10), `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (SEAM-02 reverse pointer is Phase 18). No `.claude/skills/lz-red-workspace/`, no `.oracle/` (D-03).

### Per-stub content contract map

Each stub is a thin contract (D-02): title + scoped bullet list of eventual content + requirement IDs + source cluster + "Populated in Phase NN". The mapping below is synthesized from ARCHITECTURE.md's inline structure comments [CITED: ARCHITECTURE.md lines 66-83] cross-referenced with the REQUIREMENTS.md traceability table [CITED: REQUIREMENTS.md lines 111-137]. Exact stub wording is executor discretion (D-02); this table gives unambiguous targets.

| Stub | Eventual content (cluster) | Requirement IDs | Source cluster | Fill phase(s) |
|------|----------------------------|-----------------|----------------|---------------|
| `three-laws-and-test-selection.md` | Three Laws spine; test list, one-step, degenerate/starter, RED-facet triangulation; classify-first seam framing | SEL-01, SEL-02, LAW-01, LAW-02, SEAM-01 | RCM, Beck | 16 (SEL) + 18 (LAW, SEAM) -- co-edited |
| `test-structure-and-assertions.md` | AAA/GWT (both vocabularies); assert-first; evident data; one concept; F.I.R.S.T.; Khorikov four pillars | STR-01, STR-02, ASRT-01, ASRT-02 | Wake, North, Beck, Khorikov | 16 (STR) + 17 (ASRT) -- co-edited |
| `testing-stance/README.md` | Detection signals + route table; navigation-only (mirror `smells.md`) | RTR-02 | (router) | 17 (index) + 18 (SKILL.md routing step) |
| `testing-stance/functional-core.md` | Bernhardt FCIS: value-based tests, no doubles | RTR-01, ASRT-02 | Bernhardt | 17 |
| `testing-stance/message-matrix.md` | Metz+Owen query/command matrix (design-agnostic assert/mock rule) | RTR-01, ASRT-03 | Metz + Owen | 17 |
| `testing-stance/seams-and-legacy.md` | Feathers no-seam: seam first + characterization; cross-link lz-refactor's `refactoring-without-tests.md` (do NOT copy) | RTR-01, ASRT-02 | Feathers | 17 |
| `naming.md` | Behavior/"should" naming primary; Osherove three-part alternative | NAME-01 | North, Osherove, Metz | 16 |
| `anti-patterns.md` | Over-mock/test-per-class (Cooper); impl-detail assertions (Khorikov); "listen to the tests" meta-rule; GOOS mockist counterpoint; Test Desiderata lens | ANTI-01, ANTI-02, RTR-03 | Cooper, Khorikov, Metz, GOOS, Beck | 17 |
| `vitest-typescript-mechanics.md` | `it.todo` (test list), `test.each` (triangulation), `expectTypeOf`/`assertType`, `vi.*` restraint, watch loop, fast-check, "fail for the right reason" | VIT-01, VIT-02 | Vitest 4.x, fast-check | 17 |
| `principle-backing.md` | Source-to-recommendation map + owned/unowned access-tier notes | (cross-cutting; supports DST-03) | all sources | 16-17 -- co-edited |

**Co-editing is expected and permitted** [CITED: 15-CONTEXT.md D-01] -- a single decision doc that spans phases is correct; fragmenting one doc per-source is the anti-pattern. The stub's "Populated in Phase NN" marker should list all contributing phases where a doc is co-edited.

## SKILL.md Router Skeleton

Phase-15 SKILL.md contains these sections (mirroring lz-tpp's 81-line and lz-refactor's 180-line shape [VERIFIED: codebase]). The coach procedure is the one deliberate placeholder.

| # | Section | Shape | Sibling precedent |
|---|---------|-------|-------------------|
| 1 | Frontmatter | `name: lz-red` + `description:` (v1 below). Dual-mode-by-omission: NO `version`, `disable-model-invocation`, `user-invocable`, `allowed-tools` (D-05). | Both siblings; lz-tpp lines 1-13 |
| 2 | H1 + intro paragraph | `# lz-red: RED-phase TDD coach` + one paragraph: choose/write the next failing unit test; two modes; hands off to lz-tpp | lz-tpp 15-19; lz-refactor 20-26 |
| 3 | `## Two modes` | Coach mode (a codebase in view, pick/shape the next failing test) / Reference mode (explain a RED concept, or explicit `/lz-tdd:lz-red`). "Answer from references; do not restate here." | lz-tpp 21-28; lz-refactor 29-35 |
| 4 | `## RED vs the green step (lz-tpp) and the refactor step (lz-refactor)` | The THREE-way seam intro + classify-first framing. (Siblings have a two-way seam; lz-red states both exclusions.) | lz-refactor 37-41 ("Refactoring vs the green step") |
| 5 | `## Listen to the tests` (heuristic-not-law caveat) | One short para: test-writing pain is design feedback, not a cue to mock more; RED guidance is a heuristic, allow reasoned deviation | lz-tpp 67-72 ("TPP is a heuristic, not a law") |
| 6 | `## Coach decision procedure` | **LABELED PLACEHOLDER** (D-04). A blockquote naming the deferred content + phase + req IDs, e.g.: `> Populated in Phase 18 (SEAM-01, LAW-01/02, RTR-02/03). The numbered RED procedure -- classify against the seams -> detect house idiom -> pick the next test -> route the testing stance -> structure -> assert observable behavior -> fail for the right reason -> hand off to lz-tpp -- lands here.` | Phase 6 left a Phase-9 coach placeholder in lz-refactor [CITED: 15-CONTEXT.md D-04] |
| 7 | `## Reference material` | Pointer list linking ALL 10 stubs (flat docs + the `testing-stance/README.md` index). Every link must resolve from day one. | lz-tpp 74-81; lz-refactor 140-181 |

**Target line count:** ~90-120 lines. Rationale: near lz-tpp's 81, well under the < 500 cap [VERIFIED: codebase, lz-tpp = 81 lines]. Because the coach procedure is a placeholder (not the full 7-8 steps), Phase-15 SKILL.md sits at the LOW end; it will grow toward sibling size when Phase 18 fills the procedure. Do not pad it.

**Anti-Pattern 2 guard:** the router links, it never inlines. Do not restate the route table, the matrix, or the transformation list in SKILL.md [CITED: ARCHITECTURE.md Anti-Pattern 2].

## The v1 Three-Way-Guarded Description

**Concrete v1 draft (1083 chars, measured [VERIFIED: measured via node]):**

```
This skill should be used during the red step of red-green-refactor TDD to choose and
write the next FAILING (red) unit test well: which test to write next, keeping a running
test list, starting from the degenerate or starter case, triangulating with another
concrete example to drive out the next test, structuring the test (arrange-act-assert or
given-when-then), naming it for the behavior it pins, asserting observable behavior rather
than implementation detail, and confirming it fails for the right reason. Use it whenever a
developer asks what test to write next, how to write or structure a unit test, whether a
test is a good test, or how to match the codebase's existing testing stance -- even when
they only ask "what should I test here?" or "is this a good test?". Do NOT use it to make an
existing failing test pass or to pick the minimal code change that turns the bar green --
that is the green/transformation step; use lz-tpp instead. Do NOT use it to restructure,
clean up, or de-duplicate code whose tests already pass -- that is the refactor step; use
lz-refactor instead.
```

(YAML: render as a `>-` folded block scalar exactly like both siblings. The 1083 figure is the FOLDED length -- how Claude Code reads it.)

### Triggering strategy

- **Positive trigger FIRST** (D-06/D-07): the RED-phase intents -- which test next, test list, degenerate/starter, RED-facet triangulation, structure, naming, assert observable behavior, fail-for-the-right-reason, match the house stance. Includes the low-signal phrasings ("what should I test here?", "is this a good test?") that must still fire.
- **Two reciprocal exclusion clauses in the tail:** (1) "make an existing failing test pass / pick the minimal code change" -> lz-tpp; (2) "restructure / clean up / de-duplicate passing code" -> lz-refactor. This mirrors lz-refactor's shipped exclusion pattern [VERIFIED: codebase] -- lz-refactor's tail reads "Do NOT use it to make a failing or red test pass ... use lz-tpp instead -- nor for writing new code ...".
- **Language-agnostic** (D-06): no "Vitest" / "TypeScript" in the description; the demo-stack specifics live in the body/references, matching both siblings [VERIFIED: codebase -- neither sibling names its language in the description].

### Char budget (corrected)

| Description | Chars | Note |
|-------------|-------|------|
| lz-tpp (shipped) | 750 | [VERIFIED: measured] |
| lz-refactor (shipped, current) | **1245** | [VERIFIED: measured] -- NOT 774 |
| lz-refactor (scaffold-time, Phase 6) | ~774 | [CITED: 15-CONTEXT.md D-07 / research] -- the pre-tuning length |
| lz-red v1 draft (this phase) | 1083 | [VERIFIED: measured] -- within load-bearing window, under 1536 cap |

**Correction the planner must use:** CONTEXT.md D-07 and the milestone research cite "lz-refactor's is 774 chars." The **current on-disk lz-refactor description is 1245 chars** [VERIFIED: measured]. The 774 figure is the scaffold-time (Phase 6) length; lz-refactor grew to 1245 during its deferred tuning phase (Phase 11). This is the exact trajectory lz-red follows: a ~1083-char v1 scaffold description now, with Phase 20 (EVL-01) tuning free to grow it toward ~1245 as the cross-skill boundary is empirically hardened. Both the load-bearing window (~1000-1536) and the 1536 listing-truncation cap are validator-confirmed repo facts [CITED: repo memory skill-description-char-cap]. The 1083 draft leaves ~450 chars of headroom before truncation for Phase-20 tightening.

**Do not over-tune** (D-08): Phase 15 ships this reasoned v1. The three-way trigger boundary is only PROVEN by the Phase 20 cross-skill eval; treat the wording as a starting point, not a locked contract.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Skill directory + frontmatter shape | A novel layout | Copy lz-tpp's SKILL.md skeleton verbatim, adapt wording | Both siblings prove the dual-mode-by-omission shape; auto-discovery needs no config [VERIFIED: codebase] |
| Reciprocal exclusion clause | Invent a new guard phrasing | Adapt lz-refactor's shipped "Do NOT use it to ... -- that is the ... step; use lz-... instead" tail | Proven pattern already shipping in the same plugin [VERIFIED: codebase] |
| Navigation index (`testing-stance/README.md`) | A prose explainer | Mirror `smells.md`: recognize-by cue + link per entry, "navigation only, open the leaf" | Established repo convention [VERIFIED: codebase -- smells.md] |
| Wave-0 structural check | A full eval harness | `claude plugin validate .` + a few `wc -l` / `git grep` assertions | The eval harness is Phase 20 (D-03); a scaffold gate is mechanical, not empirical |

**Key insight:** every piece of this scaffold already exists in the same plugin. This is a copy-adapt phase, not a design phase.

## Common Pitfalls

Scaffold-specific landmines (the domain anti-patterns A1-A10 are Phase 16-17 content concerns, not Phase-15 scaffold risks). Sources: ARCHITECTURE.md Anti-Patterns + PITFALLS.md Bucket B + repo memory.

### Pitfall 1: Restating reference content in SKILL.md
**What goes wrong:** Inlining the route table, the Metz matrix, or the eventual coach steps into the router. **Why:** breaks progressive disclosure and blows the line budget. **Avoid:** SKILL.md names the move and links; leaves carry content; the index is navigation-only [CITED: ARCHITECTURE.md Anti-Pattern 2]. **Warning sign:** SKILL.md creeping past ~140 lines in a phase whose coach section is only a placeholder.

### Pitfall 2: Over-decomposing references into a per-source catalog
**What goes wrong:** One file per author (`beck.md`, `metz.md`, `feathers.md`, ...). **Why:** lz-red has no enumerable catalog; per-book files fragment one decision procedure and mismatch lz-tpp's grain. **Avoid:** cluster by decision-procedure step; the 10-file tree is exactly this -- do not add files [CITED: ARCHITECTURE.md Anti-Pattern 1 / D-03].

### Pitfall 3: Dangling reference links
**What goes wrong:** SKILL.md links a stub that was not created, or a stub path typo. **Why:** the "links resolve from day one" requirement fails; `claude plugin validate .` may pass but the router is broken. **Avoid:** create all 10 stubs, then assert every SKILL.md relative link resolves to an existing file (Wave-0 check below). **Warning sign:** a link to `testing-stance/README.md` when the file was written as `testing-stance/readme.md` (case).

### Pitfall 4: Description char-cap and boundary erosion
**What goes wrong:** the description exceeds 1536 (silent listing truncation) or omits an exclusion clause. **Why:** two exclusions plus a rich positive trigger is long. **Avoid:** keep positive trigger first, both exclusions in the tail, total under 1536 (the 1083 draft has headroom) [CITED: repo memory skill-description-char-cap]. **Note:** do NOT try to empirically perfect the boundary now -- that is Phase 20 (D-08).

### Pitfall 5: Editing beyond the scaffold boundary
**What goes wrong:** bumping plugin.json to 0.0.3, adding the lz-tpp reverse pointer, writing real reference prose, or creating the eval workspace. **Why:** these are Phases 19 / 18 / 16-17 / 20 respectively; pulling them forward breaks the ROADMAP split. **Avoid:** D-09 (no version bump), D-03 (no workspace/oracle), D-04 (coach is a placeholder), and leave lz-tpp untouched [CITED: 15-CONTEXT.md]. **This is the highest-probability scope error** given how much downstream context is in view.

### Pitfall 6 (process): GSD UI-SPEC gate false-positive
**What goes wrong:** plan-phase's UI gate matches "ui" inside "guidance" and tries to generate a UI-SPEC for a Markdown authoring phase. **Avoid:** skip-UI; do not auto-generate UI-SPEC [CITED: repo memory gsd-ui-gate-false-positive]. (Config already sets `workflow.ui_phase: false` [VERIFIED: config.json].)

## Validation Architecture

> nyquist_validation is `true` in config.json [VERIFIED: config.json] -- this section is REQUIRED.

Phase 15 has no runtime behavior to test -- it is Markdown authoring. The "test framework" is the first-party validator plus a lightweight mechanical structural gate (the scaffold analogue of the siblings' instrument-first harness). The empirical eval harness itself is Phase 20; Wave 0 here is a STRUCTURAL gate only.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `claude plugin validate .` (first-party CLI validator) + inline mechanical assertions |
| Config file | none (validator reads `.claude-plugin/marketplace.json` + each `plugin.json`) |
| Quick run command | `claude plugin validate .` |
| Full suite command | `claude plugin validate .` plus the structural assertions below |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | Exists? |
|--------|----------|-----------|-------------------|---------|
| SKL-01 | Skill dir + SKILL.md exist; frontmatter has `name` (== `lz-red`) + `description`, and OMITS version/disable-model-invocation/user-invocable/allowed-tools | structural | `test -f plugins/lz-tdd/skills/lz-red/SKILL.md` + assert frontmatter keys (parse YAML head) | Wave 0 |
| SKL-01 | Skill validates / is registerable | validate | `claude plugin validate .` exits 0 | Wave 0 |
| SKL-02 | Router under cap; all 10 stubs exist; every stub linked from SKILL.md; each stub carries its content-contract markers | structural | `wc -l SKILL.md` (< 500); `test -f` each of the 10 stubs; `git grep -F` each stub path in SKILL.md; `git grep -l "Populated in Phase"` across stubs | Wave 0 |
| SKL-03 | Description present, <= 1536 chars folded; both exclusion clauses present (lz-tpp + lz-refactor); positive trigger precedes exclusions | structural | parse folded description; assert length; `git grep -F "use lz-tpp"` and `"use lz-refactor"` in SKILL.md | Wave 0 |

### Sampling Rate
- **Per task commit:** `claude plugin validate .`
- **Per wave merge:** validate + the full structural assertion set
- **Phase gate:** validate exit 0 AND all structural assertions green before `/gsd:verify-work`

### Wave 0 Gaps
- [ ] A mechanical structural checker covering the four rows above. **Lazy path (recommended):** a handful of inline `wc -l` / `test -f` / `git grep -F` assertions in the plan's verification steps -- no committed script. Add a dedicated `.mjs` checker only if the planner wants it re-runnable; a scaffold does not need a harness. `ponytail:` inline asserts are enough here; the eval harness is Phase 20.
- [ ] `claude plugin validate .` availability confirmed (the `claude` CLI is the runtime we are in -- present by definition).

*Deferred to Phase 20 (EVL-01, not Wave 0): empirical trigger recall/specificity and the cross-skill (three-way boundary) trigger eval. The vendored skill-creator eval harness + eval sets are Phase 20 (D-03/D-08). Do not build them here.*

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `claude` CLI (`plugin validate`) | Wave-0 validate gate | Yes (runtime) | current | -- |
| Node.js / `git grep` | Structural assertions | Yes | -- | `wc`/`test`/`rg` |

No new build or runtime dependencies are introduced -- the skill is Markdown-only [CITED: REQUIREMENTS.md Out of Scope: "New repo build dependencies for the skill"]. No npm install, no package audit needed (no packages).

## Security Domain

> `security_enforcement` is absent from config (= enabled), so this section is included -- but scoped honestly.

Phase 15 ships **Markdown only, no executable code**: no auth, sessions, access control, input handling, or cryptography. The standard ASVS web categories (V2-V6) do not apply -- there is no attack surface in the artifact. The only "security-adjacent" concern is **public-repo hygiene**, and it is enforced continuously rather than as an ASVS control:

| Concern | STRIDE | Control | Phase |
|---------|--------|---------|-------|
| Maintainer work-email leak in authored content / commit identity | Information disclosure | Allowlist-inversion scan (assert only `larsbrinknielsen@gmail.com` present); confirm git author/committer = public gmail before commit | Continuous (every authoring commit) [CITED: AGENTS.md] |
| Non-ASCII / Unicode in shipped content | -- (correctness/hygiene) | ASCII-only (`--`, `->`); no em-dash/curly-quote/emoji | Continuous [CITED: CLAUDE.md] |
| Verbatim copyright leak from source prose | -- (legal) | Stubs carry NO source prose in Phase 15 (content contracts only) -> DST-04 risk is effectively nil this phase; the real gate is Phases 16-17 (own-words + oracle-reviewer) | Deferred (16-17) |

Full distribution hygiene (`validate --strict`, plugin-validator + skill-reviewer PASS, no-verbatim gate) is Phase 19 (DST-02/DST-03), not Phase 15.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The exact v1 description WORDING triggers correctly on RED intent and does not cross-fire with siblings | The v1 Three-Way-Guarded Description | LOW/expected -- empirical validation is deliberately Phase 20 (D-08). A collision found later is tightened in tuning, not a Phase-15 blocker. |
| A2 | The per-stub requirement-ID / fill-phase mapping matches how Phases 16-18 will actually populate the docs | Scaffold File Tree | LOW -- exact stub wording is executor discretion (D-02); docs are explicitly allowed to co-edit across phases (D-01). A stub naming slightly different IDs is cheap to adjust. |
| A3 | ~90-120 lines is the right Phase-15 SKILL.md target | SKILL.md Router Skeleton | LOW -- derived from lz-tpp's measured 81 lines minus the deferred procedure; the < 500 cap is the only hard constraint and there is wide margin. |

**Note:** the description char-count correction (1245 vs 774) is [VERIFIED: measured], NOT assumed -- the planner should treat 1245 as ground truth for the current shipped sibling.

## Open Questions

1. **Committed structural checker vs inline assertions for Wave 0**
   - What we know: a validate gate is mandatory (D-11 discretion note); the eval harness is Phase 20.
   - What's unclear: whether the planner wants a re-runnable `.mjs` checker or inline plan-step assertions.
   - Recommendation: inline assertions (the lazy, correct choice for a scaffold). Reserve a committed checker for the Phase 20 workspace.

2. **Placeholder coach section wording**
   - What we know: it is a labeled placeholder naming Phase 18 + req IDs (D-04).
   - What's unclear: exact blockquote text (executor discretion).
   - Recommendation: use the section-6 template above; keep it to 2-4 lines so it does not read as real content.

## Sources

### Primary (HIGH confidence)
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (81 lines, on disk) -- frontmatter convention, two-mode split, heuristic caveat, reference-pointer section, flat `references/` grain. [VERIFIED: codebase]
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (180 lines, on disk) -- dual-mode-by-omission frontmatter, the exclusion-clause description tail (template for D-06), index+subdir grain. Description measured at 1245 chars. [VERIFIED: codebase]
- `plugins/lz-tdd/skills/lz-refactor/references/smells.md` -- navigation-only index pattern for `testing-stance/README.md`. [VERIFIED: codebase]
- `plugins/lz-tdd/.claude-plugin/plugin.json` -- version 0.0.2 (D-09 boundary), skills auto-discovered (no path config). [VERIFIED: codebase]
- `.planning/config.json` -- nyquist_validation true; ui_phase false; no security_enforcement key. [VERIFIED: codebase]
- `.planning/research/ARCHITECTURE.md` -- the authoritative scaffold spec: 10-file tree, dual-mode frontmatter, anti-patterns, New/Modified/Unchanged list. [CITED]
- `.planning/phases/15-.../15-CONTEXT.md` -- locked decisions D-01..D-10. [CITED]
- `.planning/REQUIREMENTS.md` -- SKL-01/02/03; traceability table (stub -> phase mapping); Out of Scope. [CITED]

### Secondary (MEDIUM confidence)
- `.planning/research/PITFALLS.md` (Bucket B authoring pitfalls B1-B6) and `SUMMARY.md` (Phase 1 scaffold framing). [CITED]
- Repo memory: `skill-description-char-cap` (>1024 accepted, validator-confirmed; 1536 truncation), `gsd-ui-gate-false-positive`. [CITED]

### Tertiary (LOW confidence)
- None. No web research needed or performed (brave/firecrawl/exa disabled; all facts on disk).

## Metadata

**Confidence breakdown:**
- Scaffold file tree: HIGH -- exact 10-file list locked in ARCHITECTURE.md + D-01, grain confirmed against both siblings on disk.
- SKILL.md skeleton: HIGH -- section list mirrors two measured siblings; line target derived from lz-tpp's 81 lines.
- Description strategy: HIGH on structure/budget (measured), MEDIUM on exact wording (empirical tuning deferred to Phase 20 by design).
- Validation gate: HIGH -- validate command + mechanical assertions are established repo practice.
- Pitfalls: HIGH -- sourced from ARCHITECTURE anti-patterns + proven repo memory.

**Research date:** 2026-07-18
**Valid until:** stable (scaffold conventions; ~30 days). The only fast-moving fact (sibling description lengths) is measured, not estimated.
