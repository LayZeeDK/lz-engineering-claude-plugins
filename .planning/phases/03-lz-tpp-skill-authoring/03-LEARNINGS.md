---
phase: 3
phase_name: "lz-tpp Skill Authoring"
project: "lz-engineering-claude-plugins"
generated: "2026-07-02"
counts:
  decisions: 8
  lessons: 4
  patterns: 6
  surprises: 4
missing_artifacts:
  - "UAT.md"
---

# Phase 3 Learnings: lz-tpp Skill Authoring

## Decisions

### Dual-mode skill on default frontmatter
The `lz-tpp` skill uses DEFAULT frontmatter (no `disable-model-invocation`, no `user-invocable`): it auto-triggers as a coach during red-green-refactor and is user-invocable as a reference. The body routes by intent (failing test + code -> coach; "explain X" -> reference).

**Rationale:** SKILL-02 requires both behaviors from one skill; the current Agent Skills docs achieve dual-mode via defaults, not extra keys.
**Source:** 03-01-SUMMARY.md (D-03)

### Full 7-step coach procedure kept in the SKILL.md body
The entire coach decision procedure lives inline in the body rather than offloaded to a reference file; the body still measured 87 lines / 702 words, well under the budget.

**Rationale:** The coach procedure is the Core Value and is compact; keeping it in the always-loaded body (per D-02) avoids an extra disclosure hop. Resolved RESEARCH Open Question 2.
**Source:** 03-01-SUMMARY.md (D-02)

### Scoped triggering description drafted now, tuned in Phase 5
A third-person, scoped `description` (750 chars, YAML folded block scalar) that fires on TDD/red-green-refactor/TPP/transformation-priority contexts and excludes generic coding; empirical trigger/behavior tuning deferred to Phase 5.

**Rationale:** SKILL-05 + FEATURES anti-feature "over-broad description"; the field cap is exactly 1024 (verified) and the description must contain no XML tags or the words "claude"/"anthropic".
**Source:** 03-01-SUMMARY.md, 03-RESEARCH.md (D-10)

### Fibonacci as the monotonic worked example; Word Wrap as impasse only
The full worked example is the canonical FibTPP Fibonacci walk in TypeScript, applied test-by-test in monotonic priority order with each step tagged; Word Wrap is referenced only to illustrate the impasse, not walked a second time.

**Rationale:** TPP-06 needs one full monotonic walk; Fibonacci is the canonical FibTPP example and maps to the tail-recursion-then-loop story. Word Wrap full walk is v1.x (D-06).
**Source:** 03-02-SUMMARY.md (D-06)

### Paired katas + teach-vs-mention pattern split
Paired examples are Kata 1 (sum, linear) and Kata 2 (flatten, tree). Stack-safe patterns follow a teach-vs-mention split: TEACH iterative default + trampoline; TEACH generator + fold; MENTION CPS (stack-safe only with a trampoline) and mutual-recursion trampolining.

**Rationale:** TPP-05/07 per TPP-TYPESCRIPT.md's verified design; the split keeps the reference focused on the idiomatic answers while still covering the landmines.
**Source:** 03-03-SUMMARY.md (D-07, D-08)

### transformations.md kept LOCKED and byte-unchanged
Every plan excluded `transformations.md` from `files_modified` and carried a `git diff --exit-code` guard; the file remained byte-unchanged since Phase 2.

**Rationale:** It is the Phase-2 locked source of truth the skill references; modifying it would corrupt the provenance the whole project rests on (D-01).
**Source:** 03-01/03-02/03-03-SUMMARY.md (D-01)

### Engine-status prose keeps V8 (not Node) as the subject
Any "does not implement proper tail calls" sentence uses V8 as the grammatical subject, never "Node supports/has proper tail calls".

**Rationale:** Defuses the kangax compat-table "Node 2/2" false-positive landmine while keeping the forbidden-assertion `rg` gate empty.
**Source:** 03-03-SUMMARY.md

### Decision guide rendered as Markdown list, not a fenced block
The recurse-vs-iterate decision guide is a nested Markdown list rather than a fenced text block.

**Rationale:** Keeps every code fence in the file a `tsc`-clean ```ts block (acceptance required only `ts` fences), so the confirmatory type-check has no non-TS fences to trip on.
**Source:** 03-03-SUMMARY.md

---

## Lessons

### The Phase-2 line-wrap brittleness recurred
A coach-not-drive guard phrase ("unless explicitly asked") wrapped across two lines, defeating a line-oriented `rg` presence gate; reflowing it onto one line fixed it (formatting only).

**Context:** This is the exact Phase-2 lesson repeating. Any acceptance criterion that asserts a phrase via line-oriented `rg` must keep that phrase on one Markdown line.
**Source:** 03-01-SUMMARY.md

### Current Agent Skills docs add two concrete progressive-disclosure rules
Verified against the current docs this phase: reference files must be ONE level deep from SKILL.md (no reference linking to another), and any reference file over 100 lines needs a top-of-file table of contents.

**Context:** Neither in-repo research file spelled these out; both new reference files exceeded 100 lines and got TOCs, and none cross-link.
**Source:** 03-RESEARCH.md (applied in 03-02, 03-03)

### The description field cap is exactly 1024 chars
The hard `description` field limit is 1024 (the 1536 figure elsewhere was a separate listing-truncation mechanism); `name`/`description` must also contain no XML tags and not the words "claude"/"anthropic".

**Context:** Resolved a STACK.md ambiguity; the shipped description is 750 chars.
**Source:** 03-RESEARCH.md, 03-01-SUMMARY.md

### "tsc --strict-clean" has a precise scope for a docs deliverable
Of the fenced TS blocks, the 9 compilable modules type-check clean; two blocks are intentionally illustrative (`expect(...)` test snippets and the labelled naked-CPS-overflow example) and are not standalone-compilable by design.

**Context:** The confirmatory `tsc --strict` extraction compiled self-contained blocks individually and assembled the Kata-2 family with its shared type declarations; the illustrative blocks are correctly excluded.
**Source:** 03-03-SUMMARY.md

---

## Patterns

### Verified-no-op verification task
A conditional "fix any failure in place" verification task that finds nothing to fix records its passing gates in the SUMMARY rather than forcing an empty commit.

**When to use:** Any verification/normalization task whose precondition is already satisfied by prior tasks (carried from Phase 2; applied in all three Phase-3 plans).
**Source:** 03-01-SUMMARY.md, 03-03-SUMMARY.md

### Mechanical rg gate battery as the validation instrument
For a docs/skill deliverable with no test framework, a battery of `rg` checks (ASCII gate, positive presence tokens, NEGATIVE landmine asserts, work-email allowlist) plus `claude plugin validate .` is the automated validation instrument.

**When to use:** Any Markdown/skill phase in this repo; negative asserts (forbidden strings absent) are as important as positive ones for landmine-bearing content.
**Source:** 03-03-SUMMARY.md, 03-VALIDATION.md

### Confirmatory (non-gating) per-block tsc extraction
Extract fenced TS blocks and run `tsc --strict --noEmit` on them as a confirmatory check: compile self-contained blocks individually, assemble a shared-type family together.

**When to use:** Shipping fenced TypeScript in Markdown when the patterns were already verified upstream; confirmatory rather than a hard gate.
**Source:** 03-03-SUMMARY.md

### Coach procedure as a "workflow for Skills without code"
The coach behavior is authored as a numbered decision algorithm in the SKILL.md body, matching the current docs' checklist pattern for skills that guide rather than run code.

**When to use:** Any skill whose value is a repeatable judgement procedure (not a script).
**Source:** 03-01-SUMMARY.md

### Wave sequencing to resolve dangling pointers
The consumer/wiring plan (SKILL.md, which points at reference files) is sequenced into a later wave than the plans that create those reference files, so its `test -f` pointer-target checks pass.

**When to use:** Whenever one deliverable references artifacts produced by sibling plans in the same phase; make the referencer depend on the referenced.
**Source:** 03-01-SUMMARY.md (dependency graph), plan structure

### Work-email allowlist gate that never spells the private literal
Enumerate all emails, filter out the approved public gmail, assert an empty remainder -- so the committed check never contains the private work-email string.

**When to use:** Any public-repo hygiene gate (carried from Phase 2).
**Source:** 03-01-SUMMARY.md

---

## Surprises

### The line-wrap gate failure repeated despite being a known Phase-2 lesson
Even with the Phase-2 lesson in hand, the wrapped-phrase-defeats-rg issue recurred in SKILL.md authoring.

**Impact:** Minor pre-commit reflow; reinforces that phrase-presence acceptance criteria and Markdown soft-wrapping interact and need single-line phrasing.
**Source:** 03-01-SUMMARY.md

### Reference files are long, and that is fine
`typescript-and-tco.md` reached 505 lines and `fibonacci-worked-example.md` 225 lines -- larger than a naive expectation, but references legitimately hold heavy material.

**Impact:** None -- only the SKILL.md body carries the ~500-line budget; the >100-line TOC rule and one-level-deep rule keep the long files navigable.
**Source:** 03-02-SUMMARY.md, 03-03-SUMMARY.md

### Not all fenced TS is meant to compile standalone
Two `ts` fences are illustrative (test-snippet `expect(...)` and the deliberately-overflowing naked-CPS example) and are intentionally not standalone-compilable.

**Impact:** Clarifies the scope of the "tsc --strict-clean" claim; the confirmatory check covers the 9 real modules, not the illustrations.
**Source:** 03-03-SUMMARY.md

### Code review surfaced only 2 trivial Info nits
Deep review returned 0 Critical / 0 Warning; the two Info items are a coach step-1 "green" wording ambiguity and a plain-text-vs-linked TOC inconsistency in the larger reference file.

**Impact:** None to requirements; recorded as optional polish, not acted on.
**Source:** 03-REVIEW.md
