# Phase 2: TPP Source Distillation - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-02
**Phase:** 2-TPP Source Distillation
**Mode:** --auto --analyze --chain (autonomous single-pass; recommended option selected per area)
**Areas discussed:** Distilled reference file structure & scope, Canonical list fidelity & citation, Reconciliation & discrepancy presentation, NDC 2011 transcript production & retention

---

## Distilled reference file: structure & scope

| Option | Description | Selected |
|--------|-------------|----------|
| Single shipped transformations.md, phase-2 content only | One `references/transformations.md`; list + provenance + distinctions + framing; defer TS/examples/coach to Phase 3 | X |
| One file, pull Phase-3 content forward | Also include TS examples / worked examples / coach in this file now | |
| Split into several reference files now | transformations.md + separate provenance/examples files | |

**Selected option:** Single shipped transformations.md, phase-2 content only (recommended default).
**Notes:** Roadmap traceability puts TPP-05/06/07 + SKILL-* in Phase 3. PITFALLS Pitfall 2 assigns "capture the caveat" to source-distillation, so the language-specificity caveat is captured as provenance while the opinionated TS coaching overlay is deferred. HIGH-impact scope boundary, HIGH confidence (roadmap + pitfalls both explicit) -- not trap-quadrant, auto-locked. -> D-01, D-02.

---

## Canonical list: fidelity & citation

| Option | Description | Selected |
|--------|-------------|----------|
| 14-item FibTPP canonical + verbatim quotes + inline primary-URL citations + ASCII arrows | Adopt revised 14-item list as canonical; document 12-item + drift; quote definitions/hedges; normalize glyph to `->` | X |
| Paraphrase the list, cite loosely | Summarize entries in own words with a single source link | |
| Ship the 12-item list as canonical | Use the original list (matches many secondary sources) | |

**Selected option:** 14-item FibTPP canonical + verbatim quotes + inline citations + ASCII normalization (recommended default).
**Notes:** FEATURES.md Part 2 + PITFALLS Pitfall 3 pin the canonical list and mandate verbatim primary-source transcription with citation; the 12-item list is documented for provenance only. ASCII-only is a repo convention (PITFALLS ASCII pitfall). HIGH confidence. -> D-03, D-04.

---

## Reconciliation & discrepancy presentation

| Option | Description | Selected |
|--------|-------------|----------|
| Delimited sections within single transformations.md; note (don't silently resolve); blogs take precedence | List -> notation -> provenance -> secondary drift -> transcript reconciliation -> sources | X |
| Separate provenance/reconciliation file | transformations.md = list only; provenance in its own doc | |
| Silently adopt one ordering | Pick 14-item and drop the discrepancy discussion | |

**Selected option:** Delimited sections within a single locked transformations.md (recommended default).
**Notes:** SC2 + SC3 require explicit resolution of the 12-vs-14 discrepancy and transcript reconciliation with discrepancies noted, not silently resolved. Keeping provenance adjacent to the list prevents drift; blogs > talk > secondary precedence stated explicitly. HIGH confidence. -> D-05, D-06.

---

## NDC 2011 transcript: production & retention

| Option | Description | Selected |
|--------|-------------|----------|
| youtube-to-markdown primary (markitdown fallback on unusable output); retain in .planning phase dir, not shipped | Transcript is provenance material, kept git-tracked outside the shipped skill | X |
| Bundle transcript under shipped plugins/.../references/ | Co-locate raw transcript with the skill | |
| Skip transcription; rely on blogs only | Do not produce the transcript | |

**Selected option:** youtube-to-markdown primary + markitdown fallback; retain at `.planning/phases/02-tpp-source-distillation/ndc-2011-tpp-transcript.md`, not shipped (recommended default).
**Notes:** TPP-03 requires the NDC talk transcribed via the local tool, retained as source material, and reconciled. Bundling raw ASR in the public skill bloats it with no runtime value and works against progressive disclosure; `.planning/` is git-tracked but filtered from PR branches (Phase-1 D-10), so it stays out of the shipped skill. Reversible (medium impact), HIGH confidence -- not trap-quadrant. -> D-07, D-08.

---

## Claude's Discretion

- Exact section headings/ordering within transformations.md beyond the D-05 sequence.
- Citation micro-format (inline parenthetical vs footnote) as long as each list/quote is attributable to a specific primary URL.
- Exact `--output` prefix for youtube-to-markdown (final file lands per D-08).
- Whether to add a short "how produced / reconciled" provenance header in transformations.md.
- Whether to keep the ROADMAP's two-plan split (transcribe -> distill) or adjust ordering during planning.

## Deferred Ideas

- TypeScript examples, worked Fibonacci/Word-Wrap examples, coach decision procedure -> Phase 3 (TPP-05, TPP-06, SKILL-03).
- Opinionated TS/JS language overlay + TCO-alternative patterns (trampoline/generator/CPS) -> Phase 3 (TPP-07).
- Quick-reference one-line cheat sheet -> v1.x (post-validation).
- Additional-language ordering variants -> v2+ / NEXT-04 (out of scope).
