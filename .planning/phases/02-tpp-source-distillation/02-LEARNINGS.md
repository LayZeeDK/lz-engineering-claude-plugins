---
phase: 2
phase_name: "TPP Source Distillation"
project: "lz-engineering-claude-plugins"
generated: "2026-07-02"
counts:
  decisions: 6
  lessons: 4
  patterns: 5
  surprises: 4
missing_artifacts:
  - "UAT.md"
---

# Phase 2 Learnings: TPP Source Distillation

## Decisions

### Adopt the revised 14-item FibTPP list as canonical, retain the 12-item list for provenance
The shipped reference uses the revised 14-item FibTPP list as the source of truth, and documents the original 12-item TPP-post list, the 3 FibTPP revisions, and secondary-source drift as provenance -- an explicit resolution, not a silent pick.

**Rationale:** The two authoritative posts disagree on recursion/iteration ordering; the FibTPP post explicitly revises the original, so the revised list is canonical while the original is kept to document the evolution (TPP-02, ROADMAP SC2).
**Source:** 02-02-SUMMARY.md, 02-CONTEXT.md (D-03)

### Split hedge-quote citation attribution across the two posts
Each verbatim hedge is cited to the post it actually came from: "language specific" -> FibTPP post; "roughly ordered" / "informal at best" / "not likely" / "probably not" / "ordinal sequence" -> TPP post.

**Rationale:** D-04 named the four hedges together, but they are split across both posts; attributing all to one post would violate the file's own per-quote-citation fidelity rule. RESEARCH flagged this as the key fidelity trap.
**Source:** 02-RESEARCH.md, 02-02-SUMMARY.md (D-04)

### Retain the NDC transcript under .planning/, never bundle it in the shipped skill
The 1141-segment transcript lives git-tracked at `.planning/phases/02-tpp-source-distillation/ndc-2011-tpp-transcript.md`, with no copy under `plugins/lz-tdd/skills/lz-tpp/references/` and no `.json` sidecar.

**Rationale:** The raw ASR transcript is provenance/reconciliation source material, not a skill-runtime asset; bundling it would bloat the public skill with no runtime value and works against progressive disclosure. `.planning/` is also filtered from PR branches.
**Source:** 02-01-SUMMARY.md, 02-CONTEXT.md (D-08)

### Single shipped transformations.md scoped to phase-2 content only
The reference contains the list + provenance + distinctions + framing + reconciliation; the FibTPP language-specificity caveat is captured as provenance only, and the opinionated TS/JS coaching overlay is deferred to Phase 3.

**Rationale:** ROADMAP traceability puts TS examples / worked examples / coach procedure / language overlay in Phase 3 (TPP-05/06/07). Capturing the caveat but deferring the coaching default keeps the scope boundary clean.
**Source:** 02-02-SUMMARY.md, 02-CONTEXT.md (D-01, D-02)

### Provenance kept adjacent to the canonical list in one file
The 14-item list, notation notes, 12-item provenance, FibTPP revisions, secondary drift, and NDC reconciliation all live in one delimited file in the D-05 section order.

**Rationale:** Keeping provenance next to the list stops the two from drifting apart over time, and keeps the locked source-of-truth self-contained.
**Source:** 02-02-SUMMARY.md, 02-CONTEXT.md (D-05)

### Quote the source "it's [sic]" typo verbatim rather than silently correcting
The transformations-vs-refactorings definition is quoted with the source spelling and an explicit `[sic]`.

**Rationale:** For a verbatim-faithful reference, silently correcting-and-quoting would misrepresent the source; `[sic]` makes the fidelity choice deliberate and visible.
**Source:** 02-02-SUMMARY.md

---

## Lessons

### D-04's named hedges are split across both posts, not one
"language specific" comes from the FibTPP post while the other hedges come from the TPP post; a single-post attribution would have shipped an incorrect citation in the project's most fidelity-critical file.

**Context:** Surfaced during research and honored in authoring; verified by the code reviewer and verifier.
**Source:** 02-RESEARCH.md, 02-02-SUMMARY.md

### The NDC talk is a spoken/ASR paraphrase; canonical text must come from the blogs
The caption track enumerates the transformations informally (e.g. "constant -> variable", "statement to if", "scalar -> vector"), which differs from the blogs' precise names -- reinforcing the blogs > talk > secondary precedence.

**Context:** The transcript is reconciliation input only; discrepancies are NOTED, not silently resolved (TPP-03).
**Source:** 02-01-SUMMARY.md, 02-02-SUMMARY.md

### Docs phases have no test framework; mechanical rg/test checks are the validation instrument
There is no unit-test harness in this repo; the automated verification for a Markdown deliverable is the set of `rg` ASCII/presence/citation checks plus `test -f`, complemented by manual semantic cross-checks.

**Context:** Consistent with the Phase 1 precedent; drove the 02-VALIDATION.md nyquist_compliant determination without generating test files.
**Source:** 02-01-SUMMARY.md, 02-02-SUMMARY.md, 02-VALIDATION.md

### Line-oriented `rg -F` token checks are brittle across blockquote line-wraps
A checked phrase ("change the behavior of / code") was split across two wrapped lines, so the line-oriented `rg -F` presence check missed it until the quote was reflowed onto one line.

**Context:** Fixed as a formatting-only change within Task 1 before commit; no content change. Worth anticipating when acceptance criteria assert phrase presence with line-oriented grep.
**Source:** 02-02-SUMMARY.md

---

## Patterns

### Mechanical shell-check validation for docs deliverables
Use `rg -n '[^\x00-\x7F]'` (ASCII gate) + content-presence `rg` (list entries, section headings) + citation-URL `rg -F` + `test -f`/`test -s` as the automated validation suite when there is no test framework.

**When to use:** Any Markdown/docs phase in an ASCII-only repo where a unit-test harness is inapplicable or out of scope.
**Source:** 02-VALIDATION.md, 02-02-SUMMARY.md

### Work-email allowlist gate that never spells the work-email literal
Scan for all email addresses and filter out the approved public gmail; assert no remainder -- so the committed check never contains the private work-email string.

**When to use:** Any public-repo hygiene gate where a private contact must be provably absent from committed files.
**Source:** 02-01-SUMMARY.md, 02-02-SUMMARY.md (PLAN threat models T-02-01-01 / T-02-02-03)

### Per-post citation with a label-to-URL Sources section
Cite every quoted list/definition inline with a short per-post label ("(TPP post)" / "(FibTPP post)") and map those labels to full URLs in one Sources section.

**When to use:** Any distilled reference drawing verbatim content from multiple primary sources that must preserve provenance.
**Source:** 02-02-SUMMARY.md

### Retain non-shipped source material under .planning/
Keep bulky or noisy provenance artifacts (ASR transcripts, raw captures) git-tracked under `.planning/` (filtered from PR branches), not under the shipped component directory.

**When to use:** When source material is needed for provenance/reconciliation but has no runtime value in the shipped artifact.
**Source:** 02-01-SUMMARY.md (D-08)

### Verified-no-op task recorded in SUMMARY instead of an empty commit
When a normalization/validation task finds nothing to change (input already clean), record the passing checks in the SUMMARY rather than forcing an empty commit.

**When to use:** Conditional "fix any failure in place" tasks whose precondition is already satisfied by prior tasks.
**Source:** 02-01-SUMMARY.md, 02-02-SUMMARY.md

---

## Surprises

### youtube-to-markdown returned a clean 1141-segment caption track on the first try
The primary tool fetched the full English caption track (1141 segments, ~7,850 words), already pure ASCII and email-free, so both the markitdown fallback and the Task-2 normalization were verified no-ops.

**Impact:** Lower effort than budgeted; the D-07 fallback path was defined but never needed.
**Source:** 02-01-SUMMARY.md

### Benign YouTube.js decipher warnings did not block caption retrieval
The tool logged two `[YOUTUBEJS][Player]: Failed to extract ... decipher function` warnings during client init, but the caption track was still fetched and the tool exited 0.

**Impact:** None -- the transcript is complete and usable; the warnings are noise to ignore for caption-only extraction.
**Source:** 02-01-SUMMARY.md

### A blockquote line-wrap silently defeated a presence check
Reflowing wrapped quote text to keep an asserted phrase on a single line was required to make a line-oriented `rg -F` acceptance check pass.

**Impact:** Minor formatting fix pre-commit; a reminder that phrase-presence checks and Markdown wrapping interact.
**Source:** 02-02-SUMMARY.md

### Code review found only 2 trivial Info items in the reconciliation section
Deep code review returned 0 Critical / 0 Warning; the two Info findings (ASR paraphrase-quoting nuance and cosmetic arrow spacing inside a verbatim block) fall within the phase's own D-07 "do not over-invest in ASR cleanup" latitude.

**Impact:** None to requirements; recorded as optional polish, not acted on.
**Source:** 02-REVIEW.md
