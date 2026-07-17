# Phase 6: lz-refactor Skill Scaffold & Progressive Disclosure - Pattern Map

**Mapped:** 2026-07-04
**Files analyzed:** 6 to create (+1 optional checker)
**Analogs found:** 7 / 7 (all in-repo or on-disk; no gaps)

This phase is scaffold-only, pure Markdown/JSON. Every new file copies the SHAPE of an
existing, shipped, validate-clean analog. The load-bearing analog is the sibling skill
`plugins/lz-tdd/skills/lz-tpp/` (frontmatter convention + dual-mode framing + pointer idiom +
provenance/sources style). The external `angular-developer/SKILL.md` supplies ONLY the
`##`-per-task-area body sectioning (NOT its frontmatter).

## File Classification

| New file | Role | Data flow | Closest analog | Match |
|----------|------|-----------|----------------|-------|
| `plugins/lz-tdd/skills/lz-refactor/SKILL.md` | skill router (frontmatter + dual-mode body) | request-response / intent-routing | `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (frontmatter + dual-mode) fused with `angular-developer/SKILL.md` (task-area `##` sections) | exact (in-repo sibling) + role-match (external sectioning) |
| `references/fowler-catalog/README.md` | reference stub -- thin catalog index entry-point | on-demand doc | `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` (heading + scope + provenance + sources) | role-match (no in-repo "thin index" exists yet; SHAPE only) |
| `references/kerievsky-catalog/README.md` | reference stub -- thin catalog index entry-point | on-demand doc | same as fowler-catalog README | role-match |
| `references/smells.md` | reference stub -- single cohesive file | on-demand doc | `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` | role-match |
| `references/principles.md` | reference stub -- single cohesive file | on-demand doc | `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` | role-match |
| `references/refactoring-without-tests.md` | reference stub -- single cohesive file | on-demand doc | `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` / `typescript-and-tco.md` | role-match |
| (optional) Wave-0 verification checker `.mjs` | utility / SC assertion script | batch (run-once, exit code) | `.claude/skills/lz-tpp-workspace/eval-status.mjs` | role-match |

No manifest change: `plugins/lz-tdd/.claude-plugin/plugin.json` (read; lines 1-21) needs NO
edit -- skills are auto-discovered from `skills/`. The version bump to 0.0.2 is Phase 10 (DST-01),
NOT this phase. Do NOT touch plugin.json in Phase 6.

## Pattern Assignments

### `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (skill router)

**Analog A (frontmatter + dual-mode framing + pointer idiom):** `plugins/lz-tdd/skills/lz-tpp/SKILL.md`
**Analog B (task-area `##` sectioning ONLY):** `D:\projects\github\LayZeeDK\in-browser-ai-coding-agent\.claude\skills\angular-developer\SKILL.md`

**Frontmatter pattern -- COPY from lz-tpp** (lz-tpp/SKILL.md lines 1-13). Folded scalar `>-`,
`name` + `description` only, no other keys:

```markdown
---
name: lz-refactor
description: >-
  This skill should be used during the refactor step of red-green-refactor TDD to ...
  [triggers] ... Do not use it for the green/transformation step (making a failing test
  pass -- that is lz-tpp), plain feature work, or generic write-code requests.
---
```

- `name` MUST equal the directory name `lz-refactor` (D-02; lz-tpp/SKILL.md line 2 shows the equality).
- Description follows the lz-tpp 4-part shape (see Shared Pattern "Dual-mode description" below).
- OMIT `disable-model-invocation`, `user-invocable`, `allowed-tools`, `version` (dual-mode by
  default). Do NOT copy angular-developer's frontmatter (lines 4-7: `license`, `metadata.author`,
  `metadata.version`) -- Pitfall 3, D-02.

**Title + one-paragraph purpose -- COPY shape from lz-tpp** (lz-tpp/SKILL.md lines 15-19):

```markdown
# lz-refactor: Refactoring coach (Fowler + Kerievsky)

<one-paragraph purpose: what the skill does + "runs in two modes and routes by intent">
```

**Dual-mode block -- COPY from lz-tpp** (lz-tpp/SKILL.md lines 21-28). Two bullets, Coach mode +
Reference mode, each says what triggers it and where it routes:

```markdown
## Two modes

- Coach mode: <smell present -> recommend a NAMED refactoring>   (full procedure -> Phase 9)
- Reference mode: <explain a refactoring / smell / principle on demand -> route to references/>
```

**The seam framing -- COPY the "Transformations vs refactorings" shape** (lz-tpp/SKILL.md lines
30-34). lz-tpp already carves the boundary from its side ("A refactoring changes structure only
... belongs to the refactor step"); mirror it from lz-refactor's side (D-08):

```markdown
## Refactoring vs the green step (the lz-tpp seam)

<one line: refactor step (structure-only, behavior-preserving) = lz-refactor; green /
transformation step (make a failing test pass) = lz-tpp>
```

**Five task-area sections -- COPY the angular-developer `##`-section shape** (angular-developer
lines 44-53). Its idiom per area: `## <Task Area>` heading, a "When ... consult" intro sentence,
a bullet with a bolded label + one-line scope + `Read [file.md](references/file.md)`, and an
optional "If you require deeper documentation ... " line. Fuse that with lz-tpp's pointer idiom
(lz-tpp/SKILL.md lines 74-81, `[references/x.md](references/x.md)`). One section per D-03 group,
each ending in ONE one-level-deep pointer:

```markdown
## Fowler catalog (mechanical refactorings)

When routing a mechanical smell or looking up a named Fowler refactoring, consult the catalog
index: [references/fowler-catalog/README.md](references/fowler-catalog/README.md)

## Smell taxonomy (coach trigger table)

<one-line scope>. [references/smells.md](references/smells.md)

## Refactoring principles (Fowler Ch.2 + backing)

<one-line scope>. [references/principles.md](references/principles.md)

## Kerievsky pattern-directed refactorings

<one-line scope>. [references/kerievsky-catalog/README.md](references/kerievsky-catalog/README.md)

## Refactoring safely without tests (Feathers)

<one-line scope>. [references/refactoring-without-tests.md](references/refactoring-without-tests.md)
```

- Exactly five `##` pointer sections (SC2). Section ordering + wording are Claude's discretion (D-09).
- Every `](references/...)` target MUST be a file that exists on disk (Pitfall 1 -- validate does
  NOT check body links). The two catalog pointers hop to `.../README.md` index files, not leaves.
- Keep the whole file ~90-150 lines, hard cap < 500 (SC2). lz-tpp ships 82 lines with 3 pointers;
  this adds 5 pointers + the seam block, so it lands a bit higher but well under cap.
- NO catalog content, NO full coach decision procedure in the body (D-06; that is Phase 9). The
  lz-tpp "Coach decision procedure" (lz-tpp/SKILL.md lines 42-65) is the FUTURE shape for Phase 9,
  NOT to be authored now -- reference it as the forward target only.

---

### `references/fowler-catalog/README.md` and `references/kerievsky-catalog/README.md` (thin index stubs)

**Analog:** `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` (heading + scope +
provenance-label discipline + Sources section). These are THIN INDEX entry-points, not content
dumps (Pitfall 2 / SKEL-04): a title, a one-line scope, a `Populated in Phase N` marker, the
per-entry content contract, and a deferred split-axis note. NO entry content in Phase 6.

**Shape to write** (structure from RESEARCH "Code Examples", lines 344-360; provenance/sources
discipline inherited from transformations.md lines 1-3 + 107-116):

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

<!-- Split axis (subdir leaves) DEFERRED to Phase 7 planning -- D-04. Candidate axes noted below. -->
```

- Kerievsky README: same shape, Kerievsky entry contract instead (RESEARCH lines 362-371):
  Name; intent / Distilled mechanics (original words) / TS-JS re-rendered from the book's Java /
  Composed Fowler primitive(s) / Direction To-Towards-Away (call out de-patterning) / GoF
  cross-reference (vocabulary only, no GoF text -- DST-04). Marker says `Populated in Phase 8`.
- The subdir MUST exist (`references/fowler-catalog/` and `references/kerievsky-catalog/`) with the
  `README.md` inside so the SKILL.md pointer resolves and `test -d` passes (SC4).
- Do NOT create per-axis leaf files (Open Question 2 / D-04 -- axis chosen in Phase 7/8).
- The transformations.md verbatim-quote practice (blockquotes of Uncle Bob's BLOG) is NOT licensed
  here: Fowler/Kerievsky/GoF are BOOKS -- inherit the LABELING/Sources SHAPE, never paste book prose.

---

### `references/smells.md`, `references/principles.md`, `references/refactoring-without-tests.md` (single-file stubs)

**Analog:** `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` (title line 1; scoped
intro; Sources/citations section lines 107-116). Each is ONE cohesive stub file (not a subdir --
splitting these now is speculative, D-03 / RESEARCH lines 169-171).

**Shape (each file):**

```markdown
# <Group title, e.g. Code Smell Taxonomy (Fowler Ch.3 + Kerievsky Ch.4)>

Scope: <one line -- what this group covers and which mode consumes it>.

> Populated in Phase <N> (oracle-verified; no verbatim book prose or code -- DST-04).

## Per-entry content contract
- <the fields the later phase fills for each smell / principle / technique>

## Sources (placeholder)
- <oracle to cite in Phase N; owner e-book/web edition>
```

- `smells.md` -> unified smell taxonomy trigger table (coach trigger), `Populated in Phase 7/8`.
- `principles.md` -> Fowler Ch.2 principles + Beck backing (placement finalized Phase 9, D-03 /
  Open Question 1 -- ONE `principles.md` stub now, do not pre-split `principles-beck.md`).
- `refactoring-without-tests.md` -> Feathers no-tests core techniques, `Populated in Phase 9`.
- Provenance/Sources SHAPE from transformations.md lines 107-116; NO verbatim book prose (DST-04).

---

### (optional) Wave-0 verification checker script

**Analog:** `.claude/skills/lz-tpp-workspace/eval-status.mjs` (Node ESM checker style). Only build
this if the planner wants the SC1-SC4 assertions automated (RESEARCH "Wave 0 Gaps", lines 421-425).
Keep it a single throwaway checker, NOT a framework (ponytail: the SC checks are also runnable as
plain shell one-liners -- `test -f`, `wc -l`, grep for `##` pointers, extract `](references/...)`
and assert each path exists; add the .mjs only if repeated).

**Style to mirror** (eval-status.mjs): shebang line 1; `import fs from "node:fs"` / `path` lines
7-8; usage + `process.exit(2)` arg guard lines 13-16; small `exists`/`nonEmpty` helpers lines
27-34; a final `SUMMARY:` line + pass/fail message lines 70-72 with a non-zero exit on failure.
Assertions to encode (from RESEARCH Validation Architecture, lines 404-414): SKILL.md exists;
`name == "lz-refactor"`; `disable-model-invocation` + `user-invocable` ABSENT; `wc -l` < 500;
five `##` pointer sections; every extracted `](references/...)` path exists; description length
<= 1,536 (target ~750). Put it under the skill workspace / repo tooling, NOT inside the shipped
skill dir (a checker script would pollute the auto-discovered skill).

## Shared Patterns

### ASCII-only (applies to ALL files)
**Source:** repo CLAUDE.md + transformations.md line 82-84 (arrow-normalization note) + RESEARCH
Pitfall 4 (lines 293-297).
Use `->` (not the arrow glyph), `--` (not en/em dash), straight quotes, `...` (not ellipsis). No
emojis, no box-drawing. Windows cp1252 produces mojibake otherwise. transformations.md documents
the exact normalization discipline to inherit.

### No verbatim Fowler/Kerievsky/GoF prose or code -- DST-04 (applies to ALL stubs)
**Source:** CONTEXT D-05, RESEARCH Anti-Patterns (line 249) + Security Domain (line 446).
Even scaffold stubs carry ONLY the contract template + original wording. The transformations.md
blockquote style quotes a freely-quotable BLOG with attribution -- that license does NOT extend to
the three refactoring BOOKS. Stubs get the contract + a Sources placeholder, never book text.

### Dual-mode description (applies to SKILL.md)
**Source:** lz-tpp/SKILL.md lines 3-12 (750 chars, scored 100/100 recall+specificity in Phase 5).
Reusable 4-part structure: (1) "This skill should be used ..." core action + when; (2) concrete
trigger contexts/phrases; (3) both modes named (coach + reference); (4) explicit "Do not use it
for ..." near-miss. For lz-refactor, part (4) MUST exclude the green/transformation step (that is
lz-tpp) so the siblings do not cross-trigger (D-08). Note lz-tpp already excludes "plain
refactoring" from ITS side (line 11-12) -- the exclusion is bidirectional. Draft wording in
RESEARCH lines 227-236; keep near ~750 chars, hard cap 1,536.

### name == directory name (applies to SKILL.md)
**Source:** lz-tpp/SKILL.md line 2 (`name: lz-tpp` under `skills/lz-tpp/`). The `/lz-tdd:lz-refactor`
command derives from the directory name; `name:` MUST be `lz-refactor` (Anti-Pattern in RESEARCH
line 246; SC1 check).

### Pointer resolution is a filesystem assertion, NOT a validate check (applies to SKILL.md + stubs)
**Source:** RESEARCH Pitfall 1 (lines 266-274) + SC2 pointer check (line 410).
`claude plugin validate .` checks marketplace/plugin/frontmatter, NOT Markdown body links. Every
`](references/...)` in SKILL.md must point at a file created THIS phase. Create the stub for every
pointer (including the two `.../README.md` index files inside their subdirs) or skill-reviewer's
"referenced files exist" check fails.

### Progressive-disclosure ratio (applies to the whole skill)
**Source:** RESEARCH Established Patterns + lz-tpp (82-line SKILL.md + 3 reference files).
Lean SKILL.md (framing + routing + pointers only) with content deferred to `references/`. Catalog
indexes stay THIN (names + one-line + pointer per leaf; Pitfall 2) so no single file forces the
whole catalog into context (SKEL-04). In Phase 6 the leaves are stubs, so this is naturally
satisfied -- the contract must be documented so Phases 7-8 preserve it.

## No Analog Found

None. Every new file maps to a shipped in-repo analog (lz-tpp) or an on-disk model
(angular-developer, eval-status.mjs). The only NET-NEW design is the five-group `references/`
layout and the two catalog subdirs -- both fully specified by RESEARCH "Recommended Project
Structure" (lines 147-173), not requiring a codebase analog.

## Metadata

**Analog search scope:** `plugins/lz-tdd/skills/lz-tpp/` (SKILL.md + 3 references),
`plugins/lz-tdd/.claude-plugin/plugin.json`, `.claude/skills/lz-tpp-workspace/*.mjs`,
external `angular-developer/.claude/skills/angular-developer/SKILL.md`.
**Files scanned:** 6 read in full + directory listing.
**Pattern extraction date:** 2026-07-04
