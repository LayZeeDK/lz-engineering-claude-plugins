# Phase 15: lz-red Skill Scaffold & Description Boundary - Pattern Map

**Mapped:** 2026-07-18
**Files analyzed:** 11 new (1 router + 10 reference stubs)
**Analogs found:** 11 / 11 (every file has an exact in-plugin analog; this is a copy-adapt phase, not a design phase)

## Scope guardrails (surface to executor)

Phase 15 creates ONLY the 11 files below, all under `plugins/lz-tdd/skills/lz-red/`. It does NOT:

- edit `plugins/lz-tdd/.claude-plugin/plugin.json` (D-09: no `0.0.2` -> `0.0.3` bump; skills auto-discovered from the plugin root, so `claude plugin validate .` exits 0 with no manifest edit).
- edit `.claude-plugin/marketplace.json` (D-10: version deliberately omitted there).
- touch `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (the reverse `lz-tpp -> lz-red` pointer is SEAM-02 = Phase 18).
- create `.claude/skills/lz-red-workspace/` (eval workspace = Phase 20) or any `.oracle/` book (Phase 16).
- author real reference prose or TS examples (Phases 16-17). Stubs carry a content contract only (D-02).

The single highest-probability scope error is pulling one of the above forward (RESEARCH Pitfall 5). All content sits behind progressive disclosure: SKILL.md links, never inlines (ARCHITECTURE Anti-Pattern 2).

## File Classification

Roles/data-flow are adapted to a Markdown-only skill (no runtime tiers). "Data flow" here names the progressive-disclosure role each file plays.

| New file | Role | Data flow | Closest analog | Match |
|----------|------|-----------|----------------|-------|
| `SKILL.md` | skill-router | request-response (dual-mode dispatch) | `lz-refactor/SKILL.md` @ `f1102ec` (scaffold-time) + current `lz-tpp/SKILL.md` | exact |
| `references/three-laws-and-test-selection.md` | reference-stub (flat single-topic) | reference-lookup (lazy) | `lz-refactor/references/refactoring-without-tests.md` @ `69459e8` (stub) | exact |
| `references/test-structure-and-assertions.md` | reference-stub (flat single-topic) | reference-lookup (lazy) | same (`refactoring-without-tests.md` stub) | exact |
| `references/naming.md` | reference-stub (flat single-topic) | reference-lookup (lazy) | same | exact |
| `references/anti-patterns.md` | reference-stub (flat single-topic) | reference-lookup (lazy) | same | exact |
| `references/vitest-typescript-mechanics.md` | reference-stub (flat single-topic) | reference-lookup (lazy) | same | exact |
| `references/principle-backing.md` | reference-stub (flat, cross-cutting) | reference-lookup (lazy) | same | exact |
| `references/testing-stance/README.md` | navigation-index stub (subdir) | routing table / dispatch to leaves | `lz-refactor/references/smells.md` @ `69459e8` (stub) + `fowler-catalog/README.md` @ `69459e8` (subdir stub) | exact |
| `references/testing-stance/functional-core.md` | leaf stub | reference-lookup (lazy) | `refactoring-without-tests.md` @ `69459e8` (stub) | exact |
| `references/testing-stance/message-matrix.md` | leaf stub | reference-lookup (lazy) | same | exact |
| `references/testing-stance/seams-and-legacy.md` | leaf stub | reference-lookup (lazy) | same | exact |

The tree is lz-tpp's flat grain (6 flat docs) plus lz-refactor's index-is-navigation-only + leaf-carries-content convention for the one branchy part (`testing-stance/`: 1 index + 3 leaves). Do NOT over-decompose into per-author files (ARCHITECTURE Anti-Pattern 1 / RESEARCH Pitfall 2).

## Pattern Assignments

The 11 files collapse into 4 shapes. One assignment per shape (the 10 stubs are near-identical; do not author 10 bespoke templates).

---

### `SKILL.md` (skill-router, request-response)

**Primary analog:** `plugins/lz-tdd/skills/lz-refactor/SKILL.md` at commit `f1102ec` (the Phase-6 scaffold-time snapshot -- the exact "router body only, coach section is a labeled placeholder" state D-04 tells you to mirror). **Size/section-shape analog:** current `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (81 lines).

Section list (RESEARCH SKILL.md Router Skeleton, 7 sections). Target ~90-120 lines, well under the < 500 cap.

**Frontmatter pattern -- dual-mode-by-omission** (mirror `lz-refactor/SKILL.md` @ `f1102ec` lines 1-13; D-05). Only `name` + `description`. NO `version`, `disable-model-invocation`, `user-invocable`, `allowed-tools`:

```yaml
---
name: lz-red
description: >-
  <v1 three-way-guarded description -- see Shared Patterns "Description" below>
---
```

`name` MUST equal the directory (`lz-red`). The `>-` folded block scalar is how both siblings render the description (this is the length Claude Code reads).

**H1 + intro paragraph** (mirror `f1102ec` lines 15-21). One H1 naming the skill, one paragraph: choose/write the next failing unit test; runs in two modes; hands off to lz-tpp for green:

```markdown
# lz-red: RED-phase TDD coach

This skill drives the red step of red-green-refactor TDD: it helps choose and write the next
FAILING (red) unit test well ... It runs in two modes and routes by intent. Making that failing
test pass is the green step and its sibling skill lz-tpp; restructuring passing code is lz-refactor.
```

**`## Two modes`** (mirror `f1102ec` lines 23-30 / current `lz-tpp` lines 21-28). Coach mode (a codebase in view; pick/shape the next failing test) and Reference mode (explain a RED concept, or explicit `/lz-tdd:lz-red`). Include the "Answer from references; do not restate here" clause. Note how the scaffold-time analog flags the deferral inline: "(The full coach decision procedure is deferred to Phase 9 -- see the placeholder below.)" -- do the same, pointing to Phase 18.

**`## RED vs the green step (lz-tpp) and the refactor step (lz-refactor)`** -- the THREE-way seam intro (mirror `f1102ec` lines 32-36 "Refactoring vs the green step (the lz-tpp seam)", but state BOTH exclusions since lz-red sits between two siblings):

```markdown
The red step (choose and write the next failing test) is lz-red. Making that failing test pass by
changing behavior is the green/transformation step (lz-tpp). Restructuring passing code without
changing behavior is the refactor step (lz-refactor). Classify the request before acting.
```

**`## Listen to the tests` (heuristic-not-law caveat)** -- one short paragraph. Analog: current `lz-tpp/SKILL.md` lines 67-72 (`## TPP is a heuristic, not a law`). Adapt: test-writing pain is design feedback, not a cue to mock more; RED guidance is a heuristic, allow reasoned deviation.

**`## Coach decision procedure` -- LABELED PLACEHOLDER** (D-04). This is the one deliberate stub in the router. Copy the shape of `f1102ec` lines 38-43 verbatim in structure:

```markdown
## Coach decision procedure (deferred to Phase 18)

Placeholder only. The full coach decision procedure -- classify against the lz-tpp / lz-refactor
seams -> detect the house testing idiom -> pick the next test -> route the testing stance ->
structure -> assert observable behavior -> fail for the right reason -> hand off to lz-tpp -- is
authored in Phase 18 (SEAM-01, LAW-01/02, RTR-02/03). Do not infer it from this scaffold.
```

Keep it 2-4 lines so it does not read as real content (RESEARCH Open Question 2).

**`## Reference material`** -- pointer list linking ALL 10 stubs. Use current `lz-tpp/SKILL.md` lines 74-81 shape (a single `## Reference material` section with a bullet list -- cleaner for 10 links than lz-refactor's one-`##`-per-pointer style). Every relative link MUST resolve to a created stub from day one (RESEARCH Pitfall 3; watch case: `testing-stance/README.md` not `readme.md`). Example row shape from lz-tpp:

```markdown
- Full 14-item transformation list, provenance, and ordering rationale:
  [references/transformations.md](references/transformations.md)
```

**Anti-Pattern 2 guard:** the router links, never inlines. Do not restate the route table, the message matrix, or the (deferred) coach steps in SKILL.md. Warning sign: SKILL.md creeping past ~140 lines while the coach section is only a placeholder.

---

### Flat single-topic reference stubs (6 files) + testing-stance leaf stubs (3 files)

**Applies to:** `three-laws-and-test-selection.md`, `test-structure-and-assertions.md`, `naming.md`, `anti-patterns.md`, `vitest-typescript-mechanics.md`, `principle-backing.md`, and the three `testing-stance/` leaves (`functional-core.md`, `message-matrix.md`, `seams-and-legacy.md`).

**Analog:** `plugins/lz-tdd/skills/lz-refactor/references/refactoring-without-tests.md` at commit `69459e8` (the Phase-6 stub -- the exact "thin content contract, no real prose" state D-02 mirrors). No YAML frontmatter (reference docs are frontmatter-free; H1 first -- confirmed against current `lz-tpp/references/transformations.md` line 1 and every lz-refactor reference doc).

Copy-adaptable stub skeleton (from `refactoring-without-tests.md` @ `69459e8`):

```markdown
# <Doc Title>

Scope: <one or two sentences naming what this doc will cover and its role in the RED coach>.

> Populated in Phase <NN>. <source-cluster note>. <access note if unowned: no-oracle / owned-book>.
> No verbatim source prose or code (DST-04).

## Per-entry content contract

Each <entry>, when populated, carries:

- <field> -- <what it is, in original words>.
- <field> -- <...>.
- <field> -- <...>.

<Scoped bullet list of the specific items/sub-topics in scope for this doc.>

## Sources (placeholder)

- <source(s)>. <owned/unowned + fill-phase note>.
```

Every stub MUST carry, per D-02 (RESEARCH per-stub content contract map, table at lines 112-123):

1. A title + a `Scope:` line.
2. A `> Populated in Phase NN` marker naming the fill phase(s). Co-editing across phases is expected -- list all contributing phases (e.g. `three-laws-and-test-selection.md` is co-edited in 16 + 18). Use the exact string `Populated in Phase` (the Wave-0 structural check greps for it).
3. The **requirement IDs** the doc will satisfy (per the map below).
4. The **source cluster** (author names as facts only -- no prose).
5. A scoped bullet list of eventual content. NO prose synthesis, NO TS examples in Phase 15.

Per-stub targets (from RESEARCH lines 112-123; exact wording is executor discretion, D-02):

| Stub | Requirement IDs | Source cluster | Fill phase(s) |
|------|-----------------|----------------|---------------|
| `three-laws-and-test-selection.md` | SEL-01, SEL-02, LAW-01, LAW-02, SEAM-01 | RCM, Beck | 16 + 18 |
| `test-structure-and-assertions.md` | STR-01, STR-02, ASRT-01, ASRT-02 | Wake, North, Beck, Khorikov | 16 + 17 |
| `testing-stance/functional-core.md` | RTR-01, ASRT-02 | Bernhardt (FCIS) | 17 |
| `testing-stance/message-matrix.md` | RTR-01, ASRT-03 | Metz + Owen | 17 |
| `testing-stance/seams-and-legacy.md` | RTR-01, ASRT-02 | Feathers (cross-link lz-refactor `refactoring-without-tests.md`, do NOT copy) | 17 |
| `naming.md` | NAME-01 | North, Osherove, Metz | 16 |
| `anti-patterns.md` | ANTI-01, ANTI-02, RTR-03 | Cooper, Khorikov, Metz, GOOS, Beck | 17 |
| `vitest-typescript-mechanics.md` | VIT-01, VIT-02 | Vitest 4.x, fast-check | 17 |
| `principle-backing.md` | cross-cutting (supports DST-03) | all sources | 16-17 |

---

### `testing-stance/README.md` (navigation-index stub, subdir)

**Analog:** `plugins/lz-tdd/skills/lz-refactor/references/smells.md` at commit `69459e8` (the Phase-6 navigation-index stub) for the content-contract shape, and `fowler-catalog/README.md` @ `69459e8` for the subdir-README placement. For the eventual navigation-only STYLE (recognize-by cue + link per entry, "index is navigation only, open the leaf"), mirror the CURRENT `smells.md` (lines 1-8 header + the `### <name>` / `Recognize by: ... ([leaf](...))` row pattern).

Stub skeleton (from `smells.md` @ `69459e8`):

```markdown
# Testing-stance router (adaptive stance selection) -- navigation index

Scope: detection signals + a route table that maps a codebase's house testing stance to the
matching leaf (functional-core / message-matrix / seams-and-legacy). This index is NAVIGATION
ONLY: it carries no stance content, only recognize-by signals and links; open the leaf to act.

> Populated in Phase 17 (index) + Phase 18 (SKILL.md routing step). Satisfies RTR-02.
> No verbatim source prose (DST-04).

## Per-entry content contract

Each stance, when populated, is one route-table row carrying:

- Detection signal -- the recognize-by cue that points at this stance (in original words).
- Route -- a link to the leaf that carries the stance's assert/mock guidance.

## Sources (placeholder)

- Bernhardt (FCIS), Metz + Owen (query/command), Feathers (seams). Distilled in original words; Phase 17.
```

Key constraint: navigation-only. Never inline stance guidance here; the three leaves carry it (mirrors `smells.md`, which deliberately carries no candidate refactorings). This is the one branchy part of the tree.

---

## Shared Patterns

### Description (the core SKL-03 deliverable)

**Source template:** current `lz-refactor/SKILL.md` description tail, lines 15-17 -- the shipped reciprocal exclusion clause:

```
... Do NOT use it to make a failing or red test pass or otherwise ADD or CHANGE behavior -- that is
the green/transformation step; use lz-tpp instead -- nor for writing new code, adding a feature, or
writing a function from scratch.
```

**Apply to:** `SKILL.md` frontmatter. lz-red needs TWO reciprocal exclusions (one per sibling). Positive trigger FIRST, both exclusions in the tail (D-06/D-07). Copy-ready v1 draft from RESEARCH (measured 1083 chars folded, under the 1536 listing-truncation cap, positive trigger first, both exclusion clauses in the tail):

```
This skill should be used during the red step of red-green-refactor TDD to choose and write the
next FAILING (red) unit test well: which test to write next, keeping a running test list, starting
from the degenerate or starter case, triangulating with another concrete example to drive out the
next test, structuring the test (arrange-act-assert or given-when-then), naming it for the behavior
it pins, asserting observable behavior rather than implementation detail, and confirming it fails
for the right reason. Use it whenever a developer asks what test to write next, how to write or
structure a unit test, whether a test is a good test, or how to match the codebase's existing
testing stance -- even when they only ask "what should I test here?" or "is this a good test?". Do
NOT use it to make an existing failing test pass or to pick the minimal code change that turns the
bar green -- that is the green/transformation step; use lz-tpp instead. Do NOT use it to
restructure, clean up, or de-duplicate code whose tests already pass -- that is the refactor step;
use lz-refactor instead.
```

Render as a `>-` folded block scalar (exactly like both siblings). Language-agnostic (D-06): no "Vitest"/"TypeScript" in the description -- stack specifics live in the body/references (neither sibling names its language in the description). Structural Wave-0 checks: `git grep -F "use lz-tpp"` and `git grep -F "use lz-refactor"` both hit SKILL.md; folded length <= 1536.

Char budget (RESEARCH-measured; treat as ground truth):

| Description | Chars (folded) | Note |
|-------------|-----------------|------|
| lz-tpp (shipped) | 750 | |
| lz-refactor (shipped, current) | 1245 | NOT 774 -- 774 was its Phase-6 scaffold length; it grew during Phase-11 tuning |
| lz-red v1 (this phase) | 1083 | within load-bearing window; ~450 chars headroom before the 1536 cap for Phase-20 tuning |

Do NOT over-tune (D-08). Empirical proof of the three-way boundary is Phase 20 (EVL-01). Ship the reasoned v1.

### Content-contract marker ("Populated in Phase NN")

**Source:** every Phase-6 stub @ `69459e8` (e.g. `refactoring-without-tests.md`, `smells.md`, `fowler-catalog/README.md`).
**Apply to:** all 10 reference stubs. Each carries a `> Populated in Phase NN` blockquote + a `## Per-entry content contract` section + a `## Sources (placeholder)` section. The Wave-0 gate greps for the literal `Populated in Phase`, so keep that exact string.

### Frontmatter (dual-mode-by-omission)

**Source:** `lz-refactor/SKILL.md` @ `f1102ec` lines 1-13 and current `lz-tpp/SKILL.md` lines 1-13.
**Apply to:** `SKILL.md` only. `name` + `description` (folded `>-`), everything else omitted. Reference docs (the 10 stubs) carry NO frontmatter -- H1 first.

### Public-repo hygiene (continuous, every commit)

**Source:** `AGENTS.md` (maintainer identity) + `CLAUDE.md` (ASCII-only).
**Apply to:** all 11 files + commit identity.
- ASCII-only. Use `--` (not em/en dash), `->` (not arrow glyphs), straight quotes, no emoji/box-drawing.
- Allowlist-inversion email check: the only email-shaped token anywhere in authored content is `larsbrinknielsen@gmail.com` (there should be none in these files). Confirm `git config user.email` is the public gmail before committing.
- DST-04 is effectively nil this phase: stubs carry NO source prose (content contracts only). The real no-verbatim gate is Phases 16-17.

### Link resolution (Wave-0 structural gate)

**Source:** RESEARCH Validation Architecture + Pitfall 3.
**Apply to:** `SKILL.md` <-> all 10 stubs. After creating all 10 stubs, assert every relative link in SKILL.md resolves to an existing file. Lazy path (recommended, D-11 discretion / ponytail): inline `test -f` + `git grep -F <path>` assertions in the plan's verification steps -- no committed `.mjs` checker (that harness is Phase 20). The mandatory gate is `claude plugin validate .` exits 0.

## No Analog Found

None. Every one of the 11 files has an exact in-plugin analog (the two shipped siblings + the Phase-6 scaffold-time git snapshots). RESEARCH's own "Don't Hand-Roll" table confirms: "every piece of this scaffold already exists in the same plugin." Do not reach for RESEARCH.md-only patterns -- copy-adapt the on-disk siblings.

## Metadata

**Analog search scope:** `plugins/lz-tdd/skills/lz-refactor/` (current + git `f1102ec`, `69459e8`), `plugins/lz-tdd/skills/lz-tpp/` (current). Confirmed `plugins/lz-tdd/skills/lz-red/` is empty (all 11 files NEW).
**Files scanned:** 8 (2 current SKILL.md, 3 current reference docs, 3 scaffold-time git snapshots) + 2 directory globs.
**Pattern extraction date:** 2026-07-18
