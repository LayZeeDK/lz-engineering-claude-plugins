# Phase 2: TPP Source Distillation - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning

<domain>
## Phase Boundary

Produce the correct, cited, canonical TPP source-of-truth and lock it BEFORE any
skill behavior is authored on top of it. This phase delivers two artifacts:

1. A shipped reference `plugins/lz-tdd/skills/lz-tpp/references/transformations.md`
   -- the canonical transformation priority list (verbatim-faithful, cited), the
   12-vs-14 discrepancy resolution + provenance, the transformations-vs-refactorings
   distinction, the amended red-green-refactor process intent, and the
   provisional-heuristic framing (the author's own hedges).
2. A retained NDC 2011 talk transcript (video id `B93QezwTQpI`) as source material,
   reconciled against the blog list with discrepancies noted.

Requirements: TPP-01, TPP-02, TPP-03, TPP-04.

This phase clarifies HOW to distill and lock what is already scoped. It does NOT
author skill behavior, the coach decision procedure, TypeScript examples, worked
examples, or the language-specific coaching overlay -- those are Phase 3
(SKILL-*, TPP-05/06/07). It does not write README/LICENSE (Phase 4) or build evals
(Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Distilled reference file: structure & scope
- **D-01:** Phase 2 produces exactly one SHIPPED reference file:
  `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` (create the
  `references/` dir -- it is a pure addition to the Phase-1 skill dir). Its content
  is limited to the phase-2 subject matter: the canonical 14-item list
  (verbatim-faithful + cited), the 12-vs-14 resolution and provenance, the
  transformations-vs-refactorings distinction, the amended red-green-refactor
  process intent, and the provisional-heuristic framing with the author's hedges.
  Covers TPP-01, TPP-02, TPP-03 (reconciliation), TPP-04.
- **D-02 [scope-boundary]:** transformations.md does NOT include TypeScript
  examples, the worked Fibonacci / Word-Wrap examples, the coach decision
  procedure, or the opinionated TS/JS language overlay (prefer `(if->while)` /
  `(variable->assignment)` over recursion) -- all of those are Phase 3
  (TPP-05/06/07, SKILL-*), per ROADMAP traceability. Phase 2 DOES capture the
  source's language-specificity caveat as a provenance/source fact (it is part of
  resolving the recursion/iteration ordering discrepancy -- PITFALLS Pitfall 2
  assigns "capture the caveat" to source-distillation), but defers the opinionated
  TS coaching DEFAULT to Phase 3.

### Canonical list: fidelity & citation
- **D-03:** Adopt the revised 14-item FibTPP list as canonical (source of truth).
  Document the original 12-item TPP-post list and the FibTPP revisions
  (+`(statement->tail-recursion)` at #9 above `(if->while)`; +`(case)` at #14 as
  last resort; plain `(statement->recursion)` moved to #11 below `(if->while)`) for
  provenance. Also document secondary-source drift (Wikipedia/Grokipedia render
  `constant->scalar` as `constant->variable`, mislabel `statement->recursion` as
  "tail recursion", and commonly publish only the 12-item list). Resolve the
  discrepancy explicitly -- do NOT silently pick (TPP-02, SC2).
- **D-04:** Render the transformation entries and the key definitions
  verbatim-faithful, each attributed with an inline citation to the specific
  primary post URL (distinguish the TPP post from the FibTPP post). Directly quote
  (quotation marks / blockquote) the transformations-vs-refactorings definition,
  the premise statement, the mantra, and the author's hedges ("informal at best",
  "roughly ordered", "not likely" perfectly correct, "language specific").
  Normalize the source's special arrow glyph to ASCII `->` everywhere, with an
  explicit one-line notation note (ASCII-only repo requirement; PITFALLS ASCII
  pitfall).

### Reconciliation & discrepancy presentation
- **D-05:** Present provenance + reconciliation as clearly delimited sections
  WITHIN the single transformations.md (one locked source-of-truth file), not split
  across multiple reference files. Keeping provenance adjacent to the list stops the
  two from drifting. Suggested section order: canonical 14-item list -> notation
  notes -> provenance (original 12-item list + FibTPP revisions) -> secondary-source
  drift -> NDC-2011 transcript reconciliation notes -> sources/citations.
- **D-06:** Reconcile the NDC 2011 transcript against the blog list and NOTE any
  discrepancies rather than silently resolving them (TPP-03, SC3). State the
  precedence explicitly: the two Clean Code blog posts take precedence over the talk
  and over all secondary sources when they differ.

### NDC 2011 transcript: production & retention
- **D-07:** Transcribe the NDC 2011 talk (video id `B93QezwTQpI`) with the local
  youtube-to-markdown tool
  (`node D:\projects\github\LayZeeDK\lz-cybernetics-ai-plugins\tools\youtube-to-markdown\youtube-to-markdown.mjs B93QezwTQpI --output <prefix>`).
  Fall back to the markitdown CLI
  (`C:\Users\LarsGyrupBrinkNielse\AppData\Local\Temp\markitdown-mcp-npx\venv\Scripts\markitdown`)
  ONLY if the primary output is empty, truncated, or garbled to the point the TPP
  list/definitions are unusable. The transcript is provenance/reconciliation
  material, not shipped content -- do NOT over-invest in ASR cleanup.
- **D-08:** Retain the transcript as a phase artifact at
  `.planning/phases/02-tpp-source-distillation/ndc-2011-tpp-transcript.md`
  (git-tracked, but NOT bundled under the shipped
  `plugins/lz-tdd/skills/lz-tpp/references/`). It is source material for
  reconciliation, not a skill-runtime asset; bundling raw ASR in the public skill
  bloats it with no runtime value and works against progressive disclosure. TPP-03
  asks for the transcript to be "retained as source material", which the planning
  trail satisfies.

### Claude's Discretion
- Exact section headings/ordering within transformations.md beyond the D-05
  sequence.
- Exact citation micro-format (inline parenthetical vs footnote-style) as long as
  every list and quote is attributable to a specific primary URL.
- Exact `--output` prefix passed to youtube-to-markdown (the final retained file
  lands per D-08).
- Whether to add a short "how produced / reconciled" provenance header note at the
  top of transformations.md.
- Whether to split the two plans (transcribe first, distill second) exactly as the
  ROADMAP sketches or adjust ordering during planning (transcribe is a soft
  dependency of the reconciliation section).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Primary TPP subject matter (the distillation inputs)
- `.planning/research/FEATURES.md` Part 2 ("TPP Subject-Matter Reference") -- the
  verbatim-faithful canonical extract: the revised 14-item FibTPP list, the original
  12-item list, the flagged ordering discrepancy + language-specificity caveat,
  notation notes, transformations-vs-refactorings quote, the premise/mantra/hedges,
  and the source URLs. This is the PRIMARY input -- most of the distillation is
  restructure + cite + resolve, not research from scratch. HIGH confidence.
- `.planning/research/PITFALLS.md` -- Pitfall 2 (capture the provisional-heuristic
  caveat; assigned to source-distillation), Pitfall 3 (list drift from secondary
  sources; verbatim primary-source transcription with citation; the 12-item canonical
  order), and the ASCII/smart-punctuation pitfall (normalize arrows to `->`).

### Authoritative primary sources (ultimate source of truth -- blogs > talk > secondary)
- Robert C. Martin, "Fib. The T-P Premise." (FibTPP; canonical revised 14-item list)
  -- https://blog.cleancoder.com/uncle-bob/2013/05/27/FibTPP.html
- Robert C. Martin, "The Transformation Priority Premise" (original 12-item list;
  mantra; transformations-vs-refactorings; Word Wrap impasse; amended RGR process)
  -- https://blog.cleancoder.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html
- Robert C. Martin, "The Transformation Priority Premise", NDC 2011 talk (video id
  `B93QezwTQpI`) -- https://youtu.be/B93QezwTQpI -- transcribe locally this phase.

### Requirements & success criteria
- `.planning/REQUIREMENTS.md` -- TPP-01, TPP-02, TPP-03, TPP-04 (locked requirements
  for this phase) and the Out of Scope table.
- `.planning/ROADMAP.md` -- Phase 2 goal, the 4 success criteria, and the 2-plan
  sketch.
- `.planning/PROJECT.md` -- Context section: authoritative source URLs, video id,
  the transcription tool paths (primary + markitdown fallback), and the JS/TS
  TCO caveat framing.

### Tooling
- Transcription (primary): `node D:\projects\github\LayZeeDK\lz-cybernetics-ai-plugins\tools\youtube-to-markdown\youtube-to-markdown.mjs B93QezwTQpI --output <prefix>` (verified present).
- Transcription (fallback): `C:\Users\LarsGyrupBrinkNielse\AppData\Local\Temp\markitdown-mcp-npx\venv\Scripts\markitdown`.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.planning/research/FEATURES.md` Part 2 is effectively a pre-distilled canonical
  extract: it already contains the verbatim 14-item list, the 12-item list, the
  ordering-discrepancy analysis, notation notes, and the source list. The phase-2
  distillation is largely restructuring + citing + explicit resolution, not a fresh
  fetch of the blogs.
- The Phase-1 skill dir `plugins/lz-tdd/skills/lz-tpp/` already exists (placeholder
  `SKILL.md`); `references/` is a pure addition, consistent with Phase-1 D-02
  (auto-discovery, additive layout).

### Established Patterns
- Progressive disclosure: heavy content lives in bundled `references/` loaded on
  demand; the skill body (Phase 3) stays lean and points at transformations.md.
- ASCII-only committed content (arrows as `->`, hyphens not en/em dashes) -- repo
  convention carried from Phase 1 (D-10) and PITFALLS.
- `.planning/` is git-tracked but filtered out of GSD PR branches (Phase-1 D-10),
  so the retained transcript (D-08) never reaches the public shipped skill.

### Integration Points
- transformations.md is consumed downstream by Phase 3 skill authoring (SKILL.md
  references it and the coach builds on it) and by the Phase-2 verifier
  (checks the list is canonical, cited, and the discrepancy resolved).
- The transcript feeds only the reconciliation section of transformations.md; it is
  not itself a runtime asset.

</code_context>

<specifics>
## Specific Ideas

- Canonical list = the revised 14-item FibTPP list, verbatim (arrows normalized to
  ASCII `->`), exactly as captured in FEATURES.md Part 2 lines 189-208.
- The recursion/iteration ordering difference between the two posts is a deliberate
  within-source evolution (FibTPP adds tail-recursion above `(if->while)` and drops
  plain recursion below it), NOT a transcription error -- document it as such.
- Blogs take precedence over the NDC talk and over secondary sources; secondary
  sources (Wikipedia et al.) are known-drifted and are cited only as
  cross-checks, never as the canonical list.

</specifics>

<deferred>
## Deferred Ideas

- **TypeScript examples (functional + imperative), worked Fibonacci/Word-Wrap
  examples, and the coach decision procedure** -- Phase 3 (TPP-05, TPP-06, SKILL-03).
- **Opinionated TS/JS language overlay** (prefer `(if->while)` and
  `(variable->assignment)` over recursion because JS/TS lacks reliable TCO;
  trampoline / generator / CPS alternatives) -- Phase 3 (TPP-07). Phase 2 only
  records the source's language-specificity CAVEAT as provenance, not the coaching
  default.
- **Quick-reference one-line-per-transformation cheat sheet** as a separate small
  reference -- FEATURES.md "Add After Validation (v1.x)"; not phase 2.
- **Additional-language ordering variants (Python, Go, C#, Clojure)** -- v2+ /
  NEXT-04; explicitly out of scope.

</deferred>

---

*Phase: 2-TPP Source Distillation*
*Context gathered: 2026-07-02*
