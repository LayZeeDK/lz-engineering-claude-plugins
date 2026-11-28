# Quick Task 260728-wev: Revise test-double taxonomy - Current-State Audit

**Researched:** 2026-07-28
**Mode:** quick-task current-state audit (NOT open-ended research)
**Domain:** Markdown reference-doc revision + a Node checker gate, inside the lz-tdd plugin
**Confidence:** HIGH on every location claim (all verified by `git grep` / `git blame` / `sha256sum` /
running the checker in this session). No `.oracle/` path was read, listed or searched.

## Scope of this document

Location inventory only. Every claim below is a fact about the repo's own tracked files as of
`HEAD` = `2cba9f4` on branch `gsd/lz-tdd-0.0.3-lz-red`. No solution, no replacement prose, nothing
edited. Numbered sections map 1:1 to the seven audit items.

<user_constraints>
## User Constraints (from CONTEXT.md)

CONTEXT.md is the authority on WHAT changes. It is not restated here. The constraints that bind
THIS audit's reporting:

- `signature skeleton` is removed entirely. No invented terms.
- Axis one is production-side vs TEST-side (not collaborator-side).
- Three axes: WHERE it lives / WHAT it stands in for / LIFETIME.
- HARD GUARD-RAIL: never assert a cell is empty. "No source in this set populates it", never
  "no author names it".
- The Meszaros-to-Beck `Fake` mapping is fabricated and is removed, along with the
  authority-denial built on it.
- All three taxonomy copies stay byte-identical (sha256 gate), so no skill-relative pronouns.
- `grade-red.mjs` is verified byte-unchanged and must stay that way.
- OUT OF SCOPE: the vintage/seniority evidence base, the Phase-21 eval round.
- UNRESOLVED (planner must NOT decide): the meaning of the "oracle-verified" tier after a
  verified claim proved false. Three competing options, none chosen.

## Project Constraints (from CLAUDE.md / AGENTS.md)

- ASCII only. No emojis, no Unicode dashes/quotes/ellipsis. `--` not an em dash.
- Public-repo hygiene: allowlist-inversion only. Never encode a forbidden value as a search
  needle. Maintainer-scoped, never a blanket contributor check.
- Search with `git grep` (tracked) / `rg` (untracked or ignored). Never the Grep tool, never
  the `grep` command, never `| grep`.
- `.oracle/` is firewalled. Not read, not listed, not searched in this session.
- Use the Write tool for multi-line content, never a Bash heredoc.
</user_constraints>

---

## 1. `signature skeleton` -- every occurrence, everywhere

**20 tracked occurrences.** Verified by `git grep -n -i "signature skeleton" -- .` (count 20).
Split into three dispositions. **The checker contains ZERO occurrences** -- see the correction in
section 5.

### 1a. SHIPPED CONTENT -- MUST change (13 occurrences, 6 distinct lines x copies)

| File | Line | Text (abbrev) |
|------|------|----------------|
| `plugins/lz-tdd/skills/lz-red/references/test-double-taxonomy.md` | 14 | `> section 5 is COINED by this skill and has no source at all` (blockquote; the phrase itself is not on this line but the coinage declaration is) |
| same | 22 | TOC entry `- [5. The coined term: signature skeleton](#5-the-coined-term-signature-skeleton)` |
| same | 182 | H2 `## 5. The coined term: signature skeleton` |
| same | 189 | `This document therefore **coins** \`signature skeleton\` for it. The term is COINED HERE and belongs to` |
| same | 305 | Sources bullet `- \`signature skeleton\` (section 5) -- COINED by lz-red. No source, by construction.` |
| `plugins/lz-tdd/skills/lz-refactor/references/test-double-taxonomy.md` | 14, 22, 182, 189, 305 | byte-identical copy |
| `plugins/lz-tdd/skills/lz-tpp/references/test-double-taxonomy.md` | 14, 22, 182, 189, 305 | byte-identical copy |
| `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` | 78 | `// A signature skeleton: the real symbol, the correct signature, nothing behind it yet.` -- inside a **tracked, tsc-compiled `ts` fence** (fence opens L61, closes L83). Added by `c691def` (the merge). |
| `plugins/lz-tdd/skills/lz-red/references/principle-backing.md` | 71 | taxonomy backing row: `... and the coined term \`signature skeleton\` is lz-red's own with no source at all.` Added by `9ad48cd` (the merge). |

Note on line 14: it says `COINED by this skill`, and line 305 says `COINED by lz-red`. CONTEXT.md
already flags this pair as the worst skill-relative-pronoun offender.

### 1b. HISTORICAL RECORDS -- must NOT be rewritten (5 occurrences)

| File | Lines | Nature |
|------|-------|--------|
| `.planning/quick/260728-j9m-test-double-taxonomy-reference-four-prov/260728-j9m-PLAN.md` | 351, 662 | Completed prior quick-task plan. Immutable record. |
| `.planning/quick/260728-j9m-.../260728-j9m-SUMMARY.md` | 11 | Completed prior quick-task summary. Immutable record. |

### 1c. LIVE PLANNING STATE -- becomes stale, planner decides (3 tracked + 2 untracked)

| File | Lines | Why it matters |
|------|-------|----------------|
| `.planning/HANDOFF.json` (56 lines total) | 27, 48, 54 | **TRACKED and LIVE.** L27 is the `"id": "review"` item with `"status": "not_started"` -- the unbiased-review gate this task supersedes. L48 records the coinage as a `decisions` entry with `"phase": "21"`. L54 `next_action` still instructs spawning the review of the coinage. Not named in CONTEXT.md. |
| `.planning/phases/21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i/.continue-here.md` | 121, 173 | **UNTRACKED** scratch handoff. Records the coinage decision + the pending review. |

### 1d. GENERATED / GIT-IGNORED -- regenerates automatically, do not hand-edit (1)

`.claude/skills/lz-red-workspace/samples/three-laws-and-test-selection-1.ts:17`
Extractor output of `three-laws-and-test-selection.md`'s L61-83 fence. Confirmed git-ignored:
`.gitignore:44` pattern `.claude/skills/*-workspace/**/samples/`. Regenerated by
`node extract-samples.mjs` (`npm run typecheck` in `.claude/skills/lz-red-workspace/`).

---

## 2. Bare unqualified `stub` -- COUNT VERIFIED AS SIX

The taxonomy's hard rule (`test-double-taxonomy.md:111-114`): "**never use bare `stub`
unqualified.** Say production-side stub or collaborator-side stub, or use a term that is not
contested."

`git grep -n -i -w "stub|stubs|stubbed|stubbing" -- plugins/lz-tdd/` returns **90 lines**, of which
**81 are inside the three taxonomy copies** (27 per copy) where the word is the document's own
subject matter. **9 lines sit outside the taxonomy.** Classified:

| # | File:Line | Text (abbrev) | Sense | Qualified? | Verdict | Added by |
|---|-----------|---------------|-------|-----------|---------|----------|
| 1 | `lz-red/SKILL.md:99` | `author a wrong-value stub to reach one` | production | NO | **VIOLATION** | `c691def` (c7a452d) |
| 2 | `lz-red/SKILL.md:100` | `without settling who owns that stub` | production | NO | **VIOLATION** | `c691def` (c7a452d) |
| 3 | `lz-red/SKILL.md:111` | `// ... The stub compiles, so the bar is red` | production | NO | **VIOLATION** | `7f0e914` (Phase 18) |
| 4 | `lz-red/SKILL.md:124` | `// Production stub: correct type signature, wrong body` | production | YES (`Production`, not the doc's `production-side`) | compliant-in-substance, non-canonical form | `7f0e914` |
| 5 | `lz-red/SKILL.md:153` | `read it before using the word stub, which owned sources` | META-mention of the word | n/a | not a use | `ef7d12f` (c7a452d) |
| 6 | `lz-red/references/anti-patterns.md:32` | `a mock or stub for nearly every constructor argument` | TEST/collaborator | NO | **VIOLATION** | `2588d38c` (Phase 17) |
| 7 | `lz-red/references/principle-backing.md:85` | `and his own canonical / stub throws.` (wraps L84-85) | production | NO | **VIOLATION** | `9ad48cd` (c7a452d) |
| 8 | `lz-red/references/vitest-typescript-mechanics.md:64` | `vi.fn creates a standalone spy or stub function` | TEST/collaborator | NO | **VIOLATION** | `3c924ee` (Phase 17) |
| 9 | `lz-tpp/SKILL.md:93` | `read it before using the word stub, which owned sources assign to opposite sides:` | META-mention | n/a | not a use | `ef7d12f` (c7a452d) |

**Count reconciliation -- CONTEXT.md is CORRECT on all three numbers:**
- **SIX violations** = rows 1, 2, 3, 6, 7, 8.
- **THREE added by `c7a452d`** = rows 1, 2 (`c691def`) and 7 (`9ad48cd`).
- **TWO of those inside the paragraph introducing the doctrine** = rows 1 and 2, both inside
  `lz-red/SKILL.md` step 6 (L97-100), the paragraph that introduces the not-implemented-throw
  doctrine.

The reconciliation only closes under this reading, which the planner should adopt explicitly:
meta-mentions of the word-as-a-word (rows 5, 9) are NOT violations, and `Production stub` (row 4)
counts as qualified. `lz-refactor/SKILL.md` has **zero** `stub` occurrences.

**Not machine-gated.** No checker asserts the hard rule. There is no bare-`stub` gate anywhere in
`.claude/skills/lz-red-workspace/tools/`. A regression would be silent.

---

## 3. Taxonomy structure -- row-by-row map

**File:** `plugins/lz-tdd/skills/lz-red/references/test-double-taxonomy.md`
**310 lines.** Prose and pipe tables only -- **zero code fences** (verified: no ` ``` ` match), so
it never enters the tsc extractor.

### 3a. Byte-identity -- CONFIRMED

```
sha256 6deb707e7d24ba3ac1bf299528cb84736154c227743e16b0b8cb1c8d615c721b
```

Identical for all three copies (`lz-red`, `lz-refactor`, `lz-tpp`), each 310 lines. The checker's
own gate reports the same digest prefix: `sha256 6deb707e7d24 in all three`.

### 3b. Section line ranges

| Element | Lines |
|---------|-------|
| H1 title | 1 |
| Scope paragraph | 3-8 |
| Provenance blockquote (TIERS ARE PER ROW; `COINED by this skill` on L14) | 10-14 |
| `## Table of contents` | 16 (entries 18-24) |
| `## 1. The two axes: what it stands in for, and how long it lives` | 26-46 |
| `## 2. The authority rule: authority is per cell` | 48-95 |
| `## 3. The headline finding: bare stub is unusable` | 97-114 |
| `## 4. The per-author table` | 116-180 |
| -- prose preamble | 118-121 |
| -- table header row | 123 |
| -- table separator | 124 |
| -- **data rows** | **125-158** |
| -- post-table notes (excluded terms; Cooper false friend; two live conflicts) | 160-180 |
| `## 5. The coined term: signature skeleton` | 182-216 |
| -- rejected-candidates list | 197-216 |
| `## 6. Caveats that change a citation` | 218-267 |
| `## Sources` | 269 (bullets 271-305; closing tier rule 307-310) |

### 3c. Table-of-contents anchors (lines 18-24)

| Line | Anchor |
|------|--------|
| 18 | `#1-the-two-axes-what-it-stands-in-for-and-how-long-it-lives` |
| 19 | `#2-the-authority-rule-authority-is-per-cell` |
| 20 | `#3-the-headline-finding-bare-stub-is-unusable` |
| 21 | `#4-the-per-author-table` |
| 22 | `#5-the-coined-term-signature-skeleton` |
| 23 | `#6-caveats-that-change-a-citation` |
| 24 | `#sources` |

**No checker validates these anchors.** `check-crossrefs.mjs` (in `lz-refactor-workspace/tools/`)
does validate `](*.md#anchor)` targets, but its `sourceFiles` set is the catalog leaves plus
`lz-refactor/SKILL.md`, `principles.md`, `beck-tdd-by-example.md`, `beck-tidy-first.md`,
`refactoring-without-tests.md` (L128-136). `test-double-taxonomy.md` is NOT a source, so its
internal TOC anchors are ungated. A stale anchor after a heading rename would pass silently.

### 3d. Table rows -- 34 rows, line-exact

| Line | Author | Term | Side (axis 1) | Lifetime (axis 2) |
|------|--------|------|---------------|-------------------|
| 125 | Kent Beck | `stub` | Production | Transitional |
| 126 | Kent Beck | `pass-through interface` | Production | Permanent |
| 127 | Kent Beck | `impostor` | Collaborator | Either |
| 128 | Kent Beck | `mocking` | Collaborator | Either |
| 129 | Sandi Metz (talks) | `stub` | Collaborator | Permanent |
| 130 | Sandi Metz (talks) | `shim` | Production | Transitional |
| 131 | Sandi Metz (talks) | `empty method` | Production | Permanent |
| 132 | Sandi Metz (talks) | `do-nothing method` | Production | Permanent |
| 133 | Metz and Owen | `Fake` | Collaborator | Either |
| 134 | Metz and Owen | `empty class` | Production | Transitional |
| 135 | Metz and Owen | `empty method` | Production | Permanent |
| 136 | Metz and Owen | `empty subclass` | Production | Transitional |
| 137 | Metz and Owen | `shim` | Collaborator | Transitional |
| 138 | Gary Bernhardt | double versus value | Collaborator | Either |
| 139 | Martin Fowler (web) | `test double`, the five kinds, `SUT` | Collaborator | Either |
| 140 | Martin Fowler (web) | state versus behaviour verification | Collaborator | Either |
| 141 | Martin Fowler (web) | `classicist` and `mockist` | Collaborator | Either |
| 142 | Martin Fowler (Refactoring 2e) | `failure` versus `error` | Neither | Permanent |
| 143 | Ian Cooper | `classical` | Collaborator | Either |
| 144 | Joshua Kerievsky | `skeleton` | Production | Transitional |
| 145 | Gerard Meszaros | `Test Double` | Collaborator | Either |
| 146 | Gerard Meszaros | `Dummy Object` | Collaborator | Permanent |
| 147 | Gerard Meszaros | `Test Stub` | Collaborator | Either |
| 148 | Gerard Meszaros | `Test Spy` | Collaborator | Either |
| 149 | Gerard Meszaros | `Mock Object` | Collaborator | Either |
| 150 | Gerard Meszaros | `Fake Object` | Collaborator | Permanent |
| 151 | Gerard Meszaros | `Responder` | Collaborator | Either |
| 152 | Gerard Meszaros | `Saboteur` | Collaborator | Either |
| 153 | Gerard Meszaros | `Temporary Test Stub` | Collaborator | Transitional |
| 154 | Gang of Four | `Proxy`, alias `Surrogate` | Production | Permanent |
| 155 | Gang of Four | `Adapter`, alias `Wrapper` | Production | Permanent |
| 156 | Gang of Four | Template Method `hook` | Production | Permanent |
| 157 | Gang of Four | empty build operation (Builder) | Production | Permanent |
| 158 | Gang of Four | `NullIterator` | Production | Permanent |

Columns are: Author | Term | Side | Lifetime | Defining property | Defines or uses | Source |
Citability tier (8 columns; header L123).

### 3e. Axis distribution -- the re-axis coverage check

**34 rows total.**

| Axis 1 (Side) | Count |
|---------------|-------|
| Production | 14 |
| Collaborator | 19 |
| Neither | 1 (row 142, Fowler `failure` vs `error`) |

| Axis 2 (Lifetime) | Count |
|-------------------|-------|
| Transitional | 7 |
| Permanent | 13 |
| Either | 14 |

| Cross (Side / Lifetime) | Count |
|-------------------------|-------|
| Production / Transitional | 5 (rows 125, 130, 134, 136, 144) |
| Production / Permanent | 9 |
| Collaborator / Transitional | 2 (rows 137, 153) |
| Collaborator / Permanent | 3 |
| Collaborator / Either | 14 |
| Neither / Permanent | 1 |

| Rows per author label | Count |
|-----------------------|-------|
| Gerard Meszaros | 9 |
| Metz and Owen | 5 |
| Gang of Four | 5 |
| Kent Beck | 4 |
| Sandi Metz (talks) | 4 |
| Martin Fowler (web) | 3 |
| Gary Bernhardt | 1 |
| Martin Fowler (Refactoring 2e) | 1 |
| Ian Cooper | 1 |
| Joshua Kerievsky | 1 |

**DEFECT CONFIRMED MECHANICALLY.** Line 46 states: "The fourth -- production side, transitional --
is the one no author names, which is why section 5 exists." Line 184: "has no name in any of the
twelve sources mapped here." Line 187: "Twelve independent sources, and not one names it." The
table's own **Production / Transitional cell has FIVE populated rows** (125 Beck `stub`, 130 Metz
`shim`, 134 `empty class`, 136 `empty subclass`, 144 Kerievsky `skeleton`). This is the
self-falsification against the document's own table that CONTEXT.md describes.

**Bernhardt's `fake` IO object has NO ROW.** CONTEXT.md cites it as populating
production/collaborator under the three-axis scheme. Row 138 is the only Bernhardt row and its
term is "double versus value" (Collaborator / Either). The planner must ADD a row, not re-axis an
existing one.

### 3f. Sources entries (bullets, lines 271-305)

| Line | Source |
|------|--------|
| 271 | Kent Beck, Test-Driven Development by Example |
| 274 | Sandi Metz, The Magic Tricks of Testing and The Design of Tests (talks) |
| 277 | Sandi Metz and Katrina Owen, 99 Bottles of OOP, JavaScript Edition |
| 280 | Gary Bernhardt, Boundaries (talk) |
| 283 | Martin Fowler, web articles |
| 286 | Martin Fowler, Refactoring, 2nd Edition, Ch. 4 |
| 289 | Ian Cooper, TDD talks |
| 291 | Joshua Kerievsky, Refactoring to Patterns, Ch. 11 |
| 293 | Gerard Meszaros, xUnit Test Patterns |
| 296 | Gang of Four, Design Patterns (1994) |
| 302 | Bobby Woolf, PLoPD3 |
| 305 | `signature skeleton` -- COINED by lz-red |

**11 real sources + 1 coinage bullet = 12 bullets.** That is where "twelve" comes from. Removing
the coinage bullet leaves 11 -- so every "twelve authors" / "twelve sources" claim (L11, L184,
L187, and `principle-backing.md:71`) needs a recount.

**Clean Code is NOT in Sources.** It carries load at L103-104 (Ch. 7, Feathers-guest-authored,
production side), L105 (Ch. 17 and Ch. 10, collaborator side), L109 (both sides), L162, L174 -- with
no Sources bullet and no tier. Matches CONTEXT.md.

Closing tier rule at **L307-310**: "A tier listed above does NOT license a tier for any table row
that cites the same source. Tiers are per row." Row 174 violates it (CONTEXT.md's point).

---

## 4. `plugins/lz-tdd/skills/lz-red/SKILL.md` (164 lines)

| Element | Lines |
|---------|-------|
| YAML frontmatter (description) | 1-16 |
| `## Coach decision procedure` | 52 |
| Step 1 (classify) | 57-61 |
| Step 2 (Three Laws; Law 2 sizes the test) | 62-71 |
| Step 3 (house idiom / stance route) | 72-78 |
| Step 4 (structure + assert) | 79-82 |
| **Step 5 -- the red criterion** | **83-96** |
| **Step 6 -- handoff paragraph** | **97-100** |
| **"The RED path end to end" worked example -- prose lead-in** | **102-106** |
| **-- code fence** | **108 (opens ` ```ts `) to 129 (closes)** |
| Coach-by-default QUESTION vs COMMAND paragraph | 131-137 |
| `## Reference material` | 139 |
| **-- taxonomy gloss** | **152-155** |

### 4a. The two asserted lines -- verbatim

**WRONG (per CONTEXT.md), line 112**, inside the code fence:

```
// for the right reason -- an AssertionError on the value, not a missing symbol.
```

**CORRECT (per CONTEXT.md, must not change), line 105**, in the prose lead-in:

```
the bar is red for the right reason (step 5) -- an AssertionError on the value, not a compile error -- and
```

The contradiction is with **step 5, line 86-87**: "A not-implemented throw, or an error raised
inside the test body at the point of use, is a valid but blunter red". Line 112 sits **7 lines
below** the end of step 6 (L100) and 26 lines below the start of step 5 -- CONTEXT.md's "seven lines
below" refers to the gap from the step-6 paragraph.

### 4b. The latent FALSE GREEN in the fence

Line 124: `// Production stub: correct type signature, wrong body -- returns the total untouched.`
Lines 126-128:

```
function applyDiscount(total: number, percent: number): number {
  return total;
}
```

`return total` is CORRECT behaviour for `percent === 0`, so this wrong-value stub is a false green
for a zero-percent discount, exactly as CONTEXT.md states. The test at L114-121 uses `percent = 10`
so it does fail -- the hazard is latent, not live.

### 4c. Taxonomy gloss (lines 152-155)

```
- What to call the thing you substitute, and which author to cite for it, when deciding what to stand
  in for while writing the failing test -- read it before using the word stub, which owned sources
  assign to opposite sides:
  [references/test-double-taxonomy.md](references/test-double-taxonomy.md)
```

Added by `ef7d12f` (the merge). L153 is the meta-mention counted as a non-violation in section 2.

---

## 5. `check-red-references.mjs`

**Path (confirmed):** `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` -- 491
lines, tracked. This is the ONLY checker in `lz-red-workspace/tools/`; the sibling battery
(`check-hygiene`, `check-crossrefs`, `check-catalog`, ...) lives in
`.claude/skills/lz-refactor-workspace/tools/`.

**Wiring:** `.claude/skills/lz-red-workspace/package.json` -- `"check": "node
tools/check-red-references.mjs"`, `"typecheck": "node extract-samples.mjs"`. No root `package.json`
exists.

**Current state, run this session:** exit 0, **132 checks, 0 FAIL**, `12/12 lz-red surfaces`.
Byte-identity gate reports `sha256 6deb707e7d24 in all three`.

### 5a. Entry structure

`const FILES = [...]` at **L86-325**. Twelve entries. Per-entry keys, documented L65-85:
`name`, `dir` (base override; defaults to `REFERENCES`), `topics[]` (`{label, re}`, PASS when
>= 1 line matches), `requireFence` (>= 1 `TS_FENCE_RE` match, L330), `requireNonIgnoreFence`
(>= 1 bare `NON_IGNORE_TS_FENCE_RE`, L337), `deferral` (must-REMAIN marker), `absent` (single
object OR array; FAILS when present), `scaffoldExempt[]`, `labelPrefix`.

Loop `L355-414`. Three post-loop blocks: D-05 honesty gate `L421-431`, SEAM-02 `L438-449`,
byte-identity `L451-480`.

### 5b. Which entries carry `absent` guards, and which are positive-topic-only

| # | Entry | Lines | Fence flag | Topics | `deferral` | `absent` guards |
|---|-------|-------|-----------|--------|-----------|-----------------|
| 1 | `three-laws-and-test-selection.md` | 87-107 | `requireFence: true` | 8 | - | **1** -- L106 `/Phase 18/i` |
| 2 | `test-structure-and-assertions.md` | 108-132 | `requireFence: true` | 14 | - | **1** -- L131 `/Phase 18/i` |
| 3 | `naming.md` | 133-143 | `requireFence: true` | 4 | `null` (L142) | **NONE** |
| 4 | `testing-stance/README.md` | 144-155 | `false` | 5 | `null` (L154) | **NONE** |
| 5 | `testing-stance/functional-core.md` | 156-166 | `true` | 4 | `null` (L165) | **NONE** |
| 6 | `testing-stance/message-matrix.md` | 167-178 | `true` | 5 | `null` (L177) | **NONE** |
| 7 | `testing-stance/seams-and-legacy.md` | 179-190 | `false` | 4 | `null` (L189) | **NONE** |
| 8 | `vitest-typescript-mechanics.md` | 191-221 | `true` | 12 | - | **3 (array)** -- L214 `/Phase 18/i`; L217 `/never reached its assertion/i`; L219 `/broken harness/i` |
| 9 | `anti-patterns.md` | 222-248 | `false` | 11 | `null` (L240) | **1** -- L247 `/later phase/i` |
| 10 | `principle-backing.md` | 249-267 | `false` | 8 | - | **1** -- L266 `/Phase 18/i` |
| 11 | `SKILL.md` | 268-292 | `requireNonIgnoreFence: true` (L274) | 10 | - | **1** -- L291 `/Phase 18/i` |
| 12 | `test-double-taxonomy.md` | 293-324 | `requireFence: false` (L301) | 17 | `null` (L323) | **NONE** |

Check arithmetic: 102 topics + 6 `requireFence` + 1 `requireNonIgnoreFence` + 12 scaffold + 8
`absent` + 3 post-loop = **132**. Matches the run exactly.

### 5c. TWO CORRECTIONS TO CONTEXT.md's mechanical-consequences bullet

CONTEXT.md L160-162 says: *"its taxonomy label gate references the coined term, and its `SKILL.md`
entry has NO `absent` guard"*. Both halves are inaccurate as stated.

**Correction 1 -- the checker contains NO occurrence of `signature skeleton`, `signature` or
`skeleton`.** Verified: `git grep -n -i "skeleton" -- .claude/skills/lz-red-workspace/tools/check-red-references.mjs`
returns nothing. The exact taxonomy label constant is:

```js
// L457
const TAXONOMY_LABEL = "[j9m] test-double-taxonomy.md byte-identical across all three skills";
```

That is the sha256 gate's label (`L451-480`) and it says nothing about the coinage. The gate that
actually touches the coinage is a **topic**, `L309`:

```js
{ label: "[j9m] coinage declared openly", re: /\bcoined\b/i },
```

**This topic is a LIVE FALSE-GREEN HAZARD.** Its needle is the bare word `coined`, and the taxonomy
retains two unrelated occurrences after the coinage is dropped -- **L56** ("He coined the umbrella
term", about Meszaros) and **L145** (Meszaros row, "Defines; coined it"). So the topic will keep
reporting PASS while the coinage it exists to police is gone. The planner must remove or replace
this topic; leaving it is a fifth false-GREEN.

**Correction 2 -- entry 11 (`SKILL.md`) DOES have an `absent` guard**, at L291:
`{ label: "no stale deferral marker", re: /Phase 18/i }`. What it lacks is any **semantic** guard on
the worked example -- nothing gates the contradicting "not a missing symbol" text. That is the real
reason stale text passed at 12/12, and CONTEXT.md's requirement (add a guard, prove it FAILS at
baseline) still stands -- it just is not a missing-`absent`-key problem.

The entries with **no `absent` guard at all** are #3 `naming.md`, #4-#7 the four
`testing-stance/` files, and **#12 `test-double-taxonomy.md`** -- the taxonomy itself has only
positive topic guards plus `deferral: null`.

### 5d. sha256 byte-identity gate (L451-480)

Reads `plugins/lz-tdd/skills/<skill>/references/test-double-taxonomy.md` for
`["lz-red", "lz-tpp", "lz-refactor"]` (L458-461). FAILs loud and by name on a missing copy
(`L462-465`) rather than passing vacuously on the two that exist. Otherwise hashes all three and
requires every digest to equal `digests[0]` (`L467-479`). Reports the first 12 hex chars.

### 5e. Scaffold gate -- a HAZARD for CONTEXT.md's vintage placeholder

Shared list, `.claude/skills/lz-red-workspace/tools/lib/scaffold-phrases.mjs:8`:

```js
export const SCAFFOLD_RES = [/\bTODO\b/, /once it exists/i, /to be authored/i, /\bplaceholder\b/i, /\bTBD\b/];
```

The taxonomy entry exempts exactly one pattern, `L303`: `scaffoldExempt: [/\bplaceholder\b/i]`,
justified (comment L297-299) because `placeholder` is a registered alias in the mapped source
taxonomy (L199, L202) and appears in the GoF Proxy intent sentence (L73).

**Consequence for CONTEXT.md's "leave a clearly marked placeholder" for the vintage paragraph:**
- If the marker uses the word `placeholder`, the scaffold gate is **already blind to it** in this
  file -- the exemption masks it. The gate cannot detect an unfilled vintage paragraph.
- If the marker uses `TODO`, `TBD`, `to be authored` or `once it exists`, the gate **FAILS the
  file** (those four are not exempted). The revision would not go green.

Either way the planner must choose the marker wording deliberately and must not rely on the
scaffold gate to police the placeholder.

### 5f. D-05 provenance-honesty gate -- a constraint on re-tiering

`.claude/skills/lz-red-workspace/tools/lib/provenance-honesty.mjs`:
`ROW_RE` (L10) parses `| [Rec](doc.md) | Source | Tier |`; `BOOK_RE = /test-driven development by
example/i` (L11); `OWNED_RE = /^owned\b/i` (L12). A `principle-backing.md` row whose Source cites
that book AND whose tier starts with `Owned` is a violation.

Scope note: the gate reads **`principle-backing.md` only** (`L421-431`). Re-tiering the taxonomy's
four Beck rows (`test-double-taxonomy.md:125-128`) does NOT trip it. But if CONTEXT.md's Beck
re-tier propagates into a `principle-backing.md` row that still cites "Test-Driven Development by
Example", it WILL trip. Self-test at `tools/provenance-honesty.selftest.mjs`.

---

## 6. `principle-backing.md` and `beck-tdd-by-example.md`

### 6a. `plugins/lz-tdd/skills/lz-red/references/principle-backing.md` (113 lines)

| Element | Lines |
|---------|-------|
| Provenance blockquote | 9-14 |
| Main source-to-recommendation table | header 27, sep 28, rows **29-54** |
| `## Three-Laws spine and lz-tpp seam backing` | 56 (prose 58-61) |
| -- second table | header 63, sep 64, rows **65-71** |
| **kanban-cycle claim** | **67** |
| **taxonomy row (carries `signature skeleton`)** | **71** |
| `### Why the fail-for-the-right-reason backing was retagged` | 73 (prose 75-79) |
| **"Four owned sources" sentence** | **81** |
| -- the four bullets | 83-88 (Clean Code 83; **Beck 84-85**; Fowler 86; Meszaros 87-88) |
| Clean-Code-vs-Beck disagreement paragraph | 90-97 |
| `## Sources` | 99 (prose 101-112) |

**The kanban-cycle claim, L67 verbatim:**

```
| [Fail for the right reason: clear the compile error, then run and fail](vitest-typescript-mechanics.md) | Kent Beck's kanban-cycle step | No-oracle. Which owned Beck surface carries the kanban cycle was NOT established, and a guessed owned tag is the exact defect this row exists to fix, so it is tagged down rather than up. |
```

**The "four owned sources" sentence, L81 verbatim:**

```
Four owned sources independently decline to require an AssertionError specifically:
```

**THE SELF-CONTRADICTION -- located exactly.** L67 states, of Beck: *"Which owned Beck surface
carries the kanban cycle was NOT established"*. Fourteen lines later, L81 counts **four OWNED
sources**, and L84-85 makes Beck one of them citing **the same kanban-cycle instruction**:

```
- Beck -- the instruction is to clear the compile error and then run and fail, and his own canonical
  stub throws.
```

So the same surface is simultaneously "owned surface NOT established" (L67) and one of "four owned
sources" (L81 + L84-85). Both are in the same file, in the same subsection, 14 lines apart. L85
also carries bare-`stub` violation #7 from section 2.

**Beck tier rows in `principle-backing.md`** (all Source cells naming Beck):

| Line | Recommendation | Source cell | Tier cell |
|------|----------------|-------------|-----------|
| 29 | Running test list | Kent Beck, Canon TDD | Owned; oracle-verified |
| 30 | Take one small step | Kent Beck, Canon TDD | Owned; oracle-verified |
| 32 | Start from the degenerate case | Kent Beck, Test-Driven Development by Example | Unowned; no-oracle |
| 33 | Triangulate to the next test | Kent Beck, Test-Driven Development by Example | Unowned; no-oracle |
| 36 | Assert-first | Kent Beck, Canon TDD | Owned; oracle-verified |
| 37 | Evident test data | Kent Beck, Test-Driven Development by Example | Unowned; no-oracle |
| 53 | Test Desiderata tradeoff lens | Kent Beck, Test Desiderata (essay + video series) | Owned; oracle-verified |
| 67 | Clear the compile error, then run and fail | Kent Beck's kanban-cycle step | No-oracle (see above) |

Rows 32, 33, 37 are exactly the three the D-05 gate protects. Prose restatement at L107-109.

### 6b. `plugins/lz-tdd/skills/lz-refactor/references/beck-tdd-by-example.md` (74 lines)

**Contains ZERO occurrences of `signature skeleton` or `stub`.** Verified.
Contains **no "four owned sources" sentence** -- that sentence exists only in
`principle-backing.md:81`.

| Element | Lines |
|---------|-------|
| Scope paragraph | 3-6 |
| **Global tier blockquote** ("No-oracle reference: high-confidence CORE only") | **8-10** |
| `## The red-green-refactor cycle` | 12 (beats 16-21) |
| Green-bar-rule re-attribution paragraph | 23-27 |
| **kanban-cycle claim (body)** | **26** |
| `## The two rules` | 29 |
| `## Green-bar strategies` | 41 (Fake It 47; Triangulate 50; Obvious Implementation 52) |
| `## The seam with lz-tpp` | 56 |
| `## Sources` | 65 |
| **-- Beck tier bullet** | **67-69** |
| -- Fowler Refactoring 2e bullet | 70-73 |
| **kanban-cycle claim (Sources)** | **72** |

**kanban-cycle claim, L26 verbatim (wraps L26-27):**

```
direction either: Beck's own kanban cycle sanctions a preparatory refactoring BEFORE green, so the
green-bar rule is Fowler's discipline rather than an absolute both authors share.
```

**kanban-cycle claim, L72 verbatim (wraps L72-73):**

```
  source. Beck's kanban cycle is noted alongside it as the exception that keeps the claim from being
  overstated in the other direction.
```

**Beck tier rows, L67-69 verbatim:**

```
- Beck, Test-Driven Development by Example. Unowned; high-confidence core only, no-oracle. There is
  no owned copy to verify against, so correctness rests on tight core scope, skill-reviewer review, and
  DST-04 hygiene (original prose; only technique NAMES kept verbatim).
```

Plus the file-global tier at L8-10. There is no per-claim tier tag on L26 -- the kanban assertion
inherits the file-global no-oracle tier, which is consistent with `principle-backing.md:67`'s
tagged-down verdict but inconsistent with L81's "four owned".

**This file is a `check-crossrefs.mjs` SOURCE** (`L131`), so its outbound `](*.md)` links and
anchors ARE validated. It carries no link to the taxonomy.

---

## 7. Anything CONTEXT.md does not anticipate

Ranked by risk of shipping a defect.

### 7.1 HIGH -- `lz-refactor/SKILL.md:182-185` goes stale under three axes

```
plugins/lz-tdd/skills/lz-refactor/SKILL.md:182: ## Test-double and stand-in taxonomy (which artifacts are transitional)
plugins/lz-tdd/skills/lz-refactor/SKILL.md:184: When a request turns on whether an artifact is a temporary step or a permanent fixture of the design,
plugins/lz-tdd/skills/lz-refactor/SKILL.md:185: place it on the side and lifetime axes: [references/test-double-taxonomy.md](references/test-double-taxonomy.md)
```

Added by `ef7d12f` (the merge). "**the side and lifetime axes**" names TWO axes explicitly and is
false the moment the document has three. **Not listed in CONTEXT.md's IN SCOPE set.** This file is
a `check-crossrefs.mjs` source, so the link is validated -- but the axis count is prose and
ungated.

### 7.2 HIGH -- `lz-tpp/SKILL.md:92-94` gloss, also not in CONTEXT.md's scope

```
plugins/lz-tdd/skills/lz-tpp/SKILL.md:92: - What to call a production symbol that has no implementation yet, while picking the transformation
plugins/lz-tdd/skills/lz-tpp/SKILL.md:93:   that fills it -- read it before using the word stub, which owned sources assign to opposite sides:
plugins/lz-tdd/skills/lz-tpp/SKILL.md:94:   [references/test-double-taxonomy.md](references/test-double-taxonomy.md)
```

Added by `ef7d12f`. "a production symbol that has no implementation yet" is a paraphrase of the
artifact the coinage named. Survives the coinage drop, but the planner should check it against the
new naming (qualified `stub`) so the two glosses agree. CONTEXT.md's IN SCOPE list names
`lz-red/SKILL.md` only.

### 7.3 HIGH -- the `/\bcoined\b/i` topic will PASS after the coinage is dropped

Full detail in 5c. `check-red-references.mjs:309`. Two unrelated `coined` occurrences (taxonomy
L56, L145) keep it green. This is a fifth false-GREEN unless the topic is removed or repointed.

### 7.4 HIGH -- the `placeholder` scaffold exemption blinds the gate to the vintage placeholder

Full detail in 5e. The exemption that lets the taxonomy name `placeholder` as a domain term also
means an unfilled vintage placeholder is undetectable in this file -- while the other four scaffold
needles would hard-FAIL. The marker wording is a real decision, not a formality.

### 7.5 MEDIUM -- `.planning/HANDOFF.json` is tracked, live, and contradicts this task

L27 (`"id": "review"`, `"status": "not_started"`), L48 (coinage in `decisions`), L54
(`next_action` = spawn the coinage review). After this revision, L48's decision is reversed and
L27/L54 describe a gate that no longer applies. Untracked twin at
`.planning/phases/21-.../.continue-here.md:121,173`. Not mentioned in CONTEXT.md.

### 7.6 MEDIUM -- a FIFTH in-house `skeleton` sense already ships, inside lz-red itself

`plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md:24` -- H2
`## One skeleton, two vocabularies`; L28 "They are one skeleton wearing two vocabularies". This is
the arrange-act-assert / given-when-then structure sense. CONTEXT.md counts four claimants for
`skeleton` (Kerievsky extraction, Clean Code Ch.14, GoF Template Method, RPC far-end); this is a
fifth, and it is in the same skill's own reference set. Nothing is grounded on it, so it is not a
defect -- but if the revision says "nothing may be grounded on that word", the nearest counterexample
is two files away.

Corroborating in-tree claimants, all already shipped and consistent with the four-claimant point:
`lz-refactor/references/gof-catalog/template-method.md:31,36,56` (algorithm outline);
`lz-refactor/references/kerievsky-catalog/form-template-method.md:3,13,15,18,25,29,80,82,84`;
`lz-refactor/references/kerievsky-catalog/README.md:40`;
`lz-refactor/references/functional-catalog/function-composition.md:77`.

### 7.7 MEDIUM -- the Metz `RailsConf 2014` / `Cascadia Ruby 2012` sources are absent from the tree

CONTEXT.md's row correction retargets Metz `shim` and `empty method` to RailsConf 2014 (plus Owen at
Cascadia Ruby 2012). Neither string occurs anywhere in `plugins/`. The only RailsConf citation in the
shipped tree is **2013**, at `lz-red/references/testing-stance/message-matrix.md:13` and `:145`, for
The Magic Tricks of Testing. So the corrected Source cells will introduce talk titles/years that no
other shipped surface names -- there is no in-tree precedent to mirror, and no existing surface to
keep consistent. Also: deleting row 132 (`do-nothing method`) changes the row count from 34 to 33 and
requires editing the Sources bullet at **L274**, which lists `do-nothing method` by name.

### 7.8 LOW -- the taxonomy's TOC anchors are ungated

Detail in 3c. `check-crossrefs.mjs` does not source the taxonomy, and `check-red-references.mjs`
has no anchor check. Renaming section 5 without updating L22 would pass silently. Same exposure for
the other six anchors if any heading is reworded.

### 7.9 LOW -- the three copies are NOT uniformly hygiene-gated

`.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs:28-31,137` puts the **lz-red** tree in
all three axes including no-verbatim; lz-refactor is in the verbatim targets; **lz-tpp is excluded
from the no-verbatim gate** (D-12). So the lz-tpp copy of the taxonomy is not DST-04-scanned, while
the sha256 gate forces it to be byte-identical to a copy that is. No action needed -- the byte gate
makes the weakest link irrelevant -- but the planner should not assume "hygiene passed" means all
three copies were scanned.

### 7.10 LOW -- extract-samples is unaffected by the taxonomy, affected by three-laws

The taxonomy has zero code fences, so `extract-samples.mjs` never touches it (matching the
checker's `requireFence: false` comment at L295-298). But
`three-laws-and-test-selection.md:78` sits inside a compiled fence (L61-83), so editing that comment
line changes the generated, git-ignored `samples/three-laws-and-test-selection-1.ts` and must be
re-verified with `npm run typecheck` in `.claude/skills/lz-red-workspace/`.

### 7.11 CONFIRMED CLEAN -- `grade-red.mjs`

`.claude/skills/lz-red-workspace/grade-red.mjs` is tracked and contains no reference to the
taxonomy, the coinage, or any file in this task's scope. Nothing in this revision touches it. It is
also not reachable from `package.json`'s `check` or `typecheck` scripts.

---

## Verification commands used (re-runnable, zero spend)

```bash
git grep -n -i "signature skeleton" -- .
git grep -n -i -w "stub|stubs|stubbed|stubbing" -- plugins/lz-tdd/
sha256sum plugins/lz-tdd/skills/lz-*/references/test-double-taxonomy.md
node .claude/skills/lz-red-workspace/tools/check-red-references.mjs
git blame -L <n>,<n> --date=short <file>
git check-ignore -v .claude/skills/lz-red-workspace/samples/three-laws-and-test-selection-1.ts
```

## Assumptions Log

| # | Claim | Section | Risk if wrong |
|---|-------|---------|---------------|
| A1 | Meta-mentions of the word (`the word stub`) are NOT hard-rule violations, and `Production stub` counts as qualified | 2 | If the owner counts them, there are 9 sites not 6, and CONTEXT.md's "six / three / two" reconciliation no longer closes |
| A2 | The five Production/Transitional rows are the reviewers' falsification target CONTEXT.md refers to | 3e | None -- the count is mechanical either way |

Everything else in this document is a direct tool observation, not an inference.

## Sources

All HIGH confidence, all first-party observation of this repo in this session:
`git grep`, `git blame`, `git ls-files`, `git check-ignore`, `sha256sum`, `rg -uu`, a live run of
`check-red-references.mjs`, and direct reads of the eight files named above.
`.oracle/` was not read, listed, or searched.
