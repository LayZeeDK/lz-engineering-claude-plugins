# Phase 2: TPP Source Distillation - Research

**Researched:** 2026-07-02
**Domain:** Source distillation / documentation fidelity (canonical Markdown reference + retained video transcript). NOT a code phase.
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Phase 2 produces exactly one SHIPPED reference file:
  `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` (create the `references/`
  dir -- a pure addition to the Phase-1 skill dir). Content is limited to phase-2 subject
  matter: the canonical 14-item list (verbatim-faithful + cited), the 12-vs-14 resolution
  and provenance, the transformations-vs-refactorings distinction, the amended
  red-green-refactor process intent, and the provisional-heuristic framing with the
  author's hedges. Covers TPP-01, TPP-02, TPP-03 (reconciliation), TPP-04.
- **D-02 [scope-boundary]:** transformations.md does NOT include TypeScript examples, the
  worked Fibonacci / Word-Wrap examples, the coach decision procedure, or the opinionated
  TS/JS language overlay (`(if->while)` / `(variable->assignment)` over recursion) -- all
  Phase 3 (TPP-05/06/07, SKILL-*). Phase 2 DOES capture the source's language-specificity
  caveat as a provenance/source fact (part of resolving the recursion/iteration ordering
  discrepancy), but defers the opinionated TS coaching DEFAULT to Phase 3.
- **D-03:** Adopt the revised 14-item FibTPP list as canonical (source of truth). Document
  the original 12-item TPP-post list and the FibTPP revisions (+`(statement->tail-recursion)`
  at #9 above `(if->while)`; +`(case)` at #14 as last resort; plain `(statement->recursion)`
  moved to #11 below `(if->while)`) for provenance. Also document secondary-source drift
  (Wikipedia/Grokipedia render `constant->scalar` as `constant->variable`, mislabel
  `statement->recursion` as "tail recursion", and commonly publish only the 12-item list).
  Resolve the discrepancy explicitly -- do NOT silently pick (TPP-02, SC2).
- **D-04:** Render the transformation entries and key definitions verbatim-faithful, each
  attributed with an inline citation to the specific primary post URL (distinguish the TPP
  post from the FibTPP post). Directly quote the transformations-vs-refactorings definition,
  the premise statement, the mantra, and the author's hedges ("informal at best",
  "roughly ordered", "not likely" perfectly correct, "language specific"). Normalize the
  source's special arrow glyph to ASCII `->` everywhere, with an explicit one-line notation
  note (ASCII-only repo requirement).
- **D-05:** Present provenance + reconciliation as clearly delimited sections WITHIN the
  single transformations.md (one locked source-of-truth file), not split across multiple
  reference files. Suggested section order: canonical 14-item list -> notation notes ->
  provenance (original 12-item list + FibTPP revisions) -> secondary-source drift ->
  NDC-2011 transcript reconciliation notes -> sources/citations.
- **D-06:** Reconcile the NDC 2011 transcript against the blog list and NOTE any
  discrepancies rather than silently resolving them (TPP-03, SC3). State the precedence
  explicitly: the two Clean Code blog posts take precedence over the talk and over all
  secondary sources when they differ.
- **D-07:** Transcribe the NDC 2011 talk (video id `B93QezwTQpI`) with the local
  youtube-to-markdown tool
  (`node D:\projects\github\LayZeeDK\lz-cybernetics-ai-plugins\tools\youtube-to-markdown\youtube-to-markdown.mjs B93QezwTQpI --output <prefix>`).
  Fall back to the markitdown CLI ONLY if the primary output is empty, truncated, or garbled
  to the point the TPP list/definitions are unusable. The transcript is
  provenance/reconciliation material, not shipped content -- do NOT over-invest in ASR cleanup.
- **D-08:** Retain the transcript at
  `.planning/phases/02-tpp-source-distillation/ndc-2011-tpp-transcript.md` (git-tracked, but
  NOT bundled under the shipped `plugins/lz-tdd/skills/lz-tpp/references/`).

### Claude's Discretion

- Exact section headings/ordering within transformations.md beyond the D-05 sequence.
- Citation micro-format (inline parenthetical vs footnote-style) as long as every list and
  quote is attributable to a specific primary URL.
- Exact `--output` prefix passed to youtube-to-markdown (final retained file lands per D-08).
- Whether to add a short "how produced / reconciled" provenance header note at the top of
  transformations.md.
- Whether to keep the ROADMAP's two-plan split (transcribe first, distill second) or adjust
  ordering (transcribe is a soft dependency of the reconciliation section).

### Deferred Ideas (OUT OF SCOPE)

- TypeScript examples (functional + imperative), worked Fibonacci/Word-Wrap examples, and
  the coach decision procedure -- Phase 3 (TPP-05, TPP-06, SKILL-03).
- Opinionated TS/JS language overlay + TCO-alternative patterns (trampoline/generator/CPS)
  -- Phase 3 (TPP-07). Phase 2 records only the source's language-specificity CAVEAT as
  provenance, not the coaching default.
- Quick-reference one-line-per-transformation cheat sheet -- v1.x (post-validation).
- Additional-language ordering variants (Python, Go, C#, Clojure) -- v2+ / NEXT-04.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| TPP-01 | `references/transformations.md` contains the canonical transformation priority list transcribed verbatim-faithfully from the primary sources, with citations | Both primary posts re-fetched and confirmed verbatim this session (see Verified Content Anchors). Canonical = FibTPP 14-item list. Exact tokens + descriptions + citation URLs supplied below. |
| TPP-02 | The reference resolves the 12-vs-14 discrepancy explicitly (uses revised FibTPP list as canonical; notes original list + secondary-source drift) | Both lists confirmed verbatim; the 3 FibTPP revisions confirmed against the FibTPP post; secondary drift carried from prior research (cross-check, not load-bearing). Explicit-resolution structure specified in Document Structure. |
| TPP-03 | NDC 2011 talk (`B93QezwTQpI`) transcribed via local youtube-to-markdown (markitdown fallback), reconciled against the blog list; transcript retained as source material | Tool + fallback verified present; Node v24.18.0 present; tool deps installed. Exact invocation, fallback trigger, retention path, and "note-don't-resolve" reconciliation definition supplied. |
| TPP-04 | Content distinguishes transformations (behavior-changing, green) from refactorings (behavior-preserving) and frames TPP as a provisional heuristic, not rigid law | Verbatim definition quote and all hedge quotes confirmed against the primary posts, WITH the correct source-post attribution for each (a fidelity nuance -- hedges are split across BOTH posts). |
</phase_requirements>

## Summary

This is a source-distillation / documentation phase, not a code phase. It produces two
artifacts: (1) one SHIPPED Markdown reference, `plugins/lz-tdd/skills/lz-tpp/references/transformations.md`,
and (2) one RETAINED (non-shipped) NDC 2011 talk transcript at
`.planning/phases/02-tpp-source-distillation/ndc-2011-tpp-transcript.md`. The heavy lifting
is already done: `.planning/research/FEATURES.md` Part 2 is a near-complete pre-distilled
extract, and this session re-fetched BOTH primary blog posts and confirmed the 14-item list,
the 12-item list, the transformations-vs-refactorings definition, the mantra, the amended
red-green-refactor process, the language-specificity caveat, and the author's hedges VERBATIM.
So the distillation is restructure + cite + explicitly-resolve, not research-from-scratch.

The correctness bar is fidelity, not novelty. The three failure modes that matter are (a)
list drift from secondary sources or memory, (b) silently resolving the 12-vs-14 and the
transcript discrepancies instead of documenting them, and (c) non-ASCII glyphs leaking into
committed content. I confirmed the source itself contains at least one non-ASCII dash glyph
in an arrow (the `{}` entries render `--` differently from the ASCII `->` used elsewhere),
so the ASCII-normalization note is a real, verifiable requirement, not a hypothetical.

One fidelity nuance the planner must honor: D-04 lists four hedge phrases together, but they
are NOT all from one post. "roughly ordered", "informal at best", "not likely" (perfectly
correct), and "might be more complicated than a simple ordinal sequence" are all from the TPP
post; "language specific" is from the FibTPP post. Each quote's inline citation must point to
the post it actually came from -- otherwise the reference violates its own D-04 citation rule.

**Primary recommendation:** Structure transformations.md as delimited sections in the D-05
order (with definitions/framing placed before the list), transcribe verbatim from the
confirmed anchors in this document (do NOT re-derive from Wikipedia or memory), cite each
list and quote to the exact post it came from, normalize all arrows to ASCII `->`, produce
the transcript with the verified tool invocation, and reconcile by NOTING discrepancies with
an explicit "blogs > talk > secondary" precedence statement rather than silently picking.

## Architectural Responsibility Map

For a docs phase the "tiers" are the artifacts and their authority level. Each Phase-2
capability maps to the artifact that owns it.

| Capability | Primary Owner | Secondary Owner | Rationale |
|------------|---------------|-----------------|-----------|
| Canonical 14-item list (shipped) | `transformations.md` (shipped reference) | FibTPP post (ultimate source) | The list is the non-negotiable core; it must be verbatim from FibTPP and cited. |
| 12-vs-14 resolution + provenance | `transformations.md` provenance sections | TPP post + FibTPP post | Keeping provenance adjacent to the list (D-05) stops the two from drifting. |
| Transformations-vs-refactorings + heuristic framing | `transformations.md` definition/framing sections | TPP + FibTPP posts (quotes) | TPP-04 content; must be verbatim-quoted and correctly attributed. |
| Amended red-green-refactor process intent | `transformations.md` process section | TPP post (verbatim block) | D-01 lists it as required content; it is a verbatim 3-bullet block in the TPP post. |
| NDC 2011 transcript (raw source material) | `.planning/.../ndc-2011-tpp-transcript.md` (retained, not shipped) | youtube-to-markdown tool | Provenance/reconciliation input; bundling raw ASR in the public skill bloats it (D-08). |
| Transcript reconciliation notes | `transformations.md` reconciliation section | the retained transcript | TPP-03/SC3: note discrepancies, do not silently resolve; state precedence. |
| Pre-distilled subject matter (working input) | `.planning/research/FEATURES.md` Part 2 | this RESEARCH.md's Verified Content Anchors | Already verbatim; the distillation restructures + cites it. |

## Tooling & Inputs

This phase installs NO packages. It consumes existing local tooling and already-fetched
sources. "Stack" here means the transcription tool, the fallback, and the source inputs.

### Core

| Tool / Input | Version / Location | Purpose | Verified |
|--------------|--------------------|---------|----------|
| youtube-to-markdown (local) | `D:\projects\github\LayZeeDK\lz-cybernetics-ai-plugins\tools\youtube-to-markdown\youtube-to-markdown.mjs` (9530 bytes) | Fetch NDC 2011 transcript via InnerTube API (no browser) -> Markdown | [VERIFIED: file present; `node_modules/` incl. `youtubei.js` installed] |
| Node.js | v24.18.0 | Runtime for the transcription tool | [VERIFIED: `node --version`] |
| markitdown CLI (fallback) | `C:\Users\LarsGyrupBrinkNielse\AppData\Local\Temp\markitdown-mcp-npx\venv\Scripts\markitdown.exe` (183158 bytes) | Fallback ASR/transcription only if primary output is unusable | [VERIFIED: `markitdown.exe` + `python.exe` present in venv] |
| FibTPP post | https://blog.cleancoder.com/uncle-bob/2013/05/27/FibTPP.html | Canonical 14-item list; tail-recursion + case additions; language caveat; Fibonacci | [VERIFIED: re-fetched via markdown.new this session; list confirmed] |
| TPP post | https://blog.cleancoder.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html | Original 12-item list; defs; mantra; hedges; amended RGR; Word Wrap | [VERIFIED: re-fetched via markdown.new this session; content confirmed] |
| FEATURES.md Part 2 | `.planning/research/FEATURES.md` lines 168-377 | Pre-distilled verbatim extract (the primary working input) | [VERIFIED: read this session; matches primary posts] |
| NDC 2011 talk | https://youtu.be/B93QezwTQpI (id `B93QezwTQpI`) | Transcript source | [ASSUMED: caption availability not probed this session -- see Open Questions Q1] |

### Supporting

| Item | Purpose | When to Use |
|------|---------|-------------|
| markdown.new fetch chain | Confirmation re-fetch of blog posts | Already done this session; re-run only if a quote needs re-verification during distillation. |
| `rg` (ripgrep) | Mechanical validation checks (ASCII scan, token/citation presence) | Validation Architecture checks; never `grep` (repo convention). |

### Tool invocation (transcript, D-07)

```bash
node "D:\projects\github\LayZeeDK\lz-cybernetics-ai-plugins\tools\youtube-to-markdown\youtube-to-markdown.mjs" \
  B93QezwTQpI \
  --output ".planning/phases/02-tpp-source-distillation/ndc-2011-tpp-transcript"
```

Notes for the planner (verified by reading the tool source):
- The `--output <prefix>` value is passed through `path.resolve(prefix)` and the tool writes
  `<prefix>.md`. Passing the prefix WITHOUT the `.md` extension lands the file exactly at the
  D-08 retention path. Do NOT include `.md` in the prefix.
- The tool auto-names to CWD (`<sanitized-title>-<videoId>.md`) when `--output` is omitted.
  Always pass `--output` so the file lands at the retention path regardless of executor CWD.
- Do NOT pass `--json` unless the `.json` sidecar is wanted. D-08 retains only the `.md`; the
  sidecar would add an untracked-noise artifact. Recommend omitting `--json`.
- On success the tool prints `[OK] Markdown saved: ...` and a segment count. If it prints
  `[WARN] No transcript was available. Markdown contains metadata only.` OR the segment count
  is 0, the primary output is UNUSABLE -> trigger the markitdown fallback (D-07).

### Fallback trigger (D-07)

Fall back to markitdown ONLY when the primary output is empty, truncated, or garbled to the
point the TPP list/definitions are unusable. Concretely: transcript segment count is 0, the
`.md` contains metadata only, or the transcript text is so garbled the transformation names /
definitions cannot be recognized. The bar is "usable for reconciliation", not "clean prose"
-- do not over-invest in ASR cleanup (D-07).

## Package Legitimacy Audit

**Not applicable.** This phase installs no external packages (npm/PyPI/crates). The only
executables invoked are pre-existing, user-owned local tooling that was installed and used in
prior work (youtube-to-markdown with vendored `node_modules`; a local markitdown venv). No
registry install, no slopcheck target. If the planner adds any package install step, this
section must be revisited and the Package Legitimacy Gate run first.

## Document Structure & Content Architecture

### Data flow (sources -> artifacts)

```
[FibTPP post]  --14-item list, tail-recursion+case, language caveat, (Fibonacci=Phase 3)-->\
[TPP post]     --12-item list, defs, mantra, hedges, amended RGR, (Word Wrap=Phase 3)------>|
                                                                                            |
[FEATURES.md Part 2] --pre-distilled verbatim extract (primary working input)------------->|
                                                                                            v
[NDC 2011 video] --youtube-to-markdown (markitdown fallback)--> [ndc-2011-tpp-transcript.md]
                                                                  (.planning, RETAINED, not shipped)
                                                                          |
                                                                    reconcile (note, do not resolve)
                                                                          v
   ALL feed --> [plugins/lz-tdd/skills/lz-tpp/references/transformations.md]  (SHIPPED)

   Authority precedence when sources differ:  blogs  >  NDC talk  >  secondary (Wikipedia et al.)
```

File-to-owner detail lives in the Architectural Responsibility Map; the diagram shows data
flow only.

### Recommended section layout for transformations.md

D-05 fixes the provenance/reconciliation ordering. TPP-04 additionally requires the
definition + heuristic-framing content, and D-01 requires the amended RGR process. Placing
the definitions/framing BEFORE the list (so a reader knows what a transformation IS before
reading the list) satisfies both. Recommended order (headings are Claude's discretion):

```
transformations.md
|-- (optional) Provenance header note        # D-05 discretion: "how produced / reconciled"
|-- Transformations vs refactorings          # TPP-04: verbatim definition quote + TPP-post cite
|-- The premise and the mantra               # context: premise + "specific -> generic" mantra (quotes)
|-- TPP is a provisional heuristic           # TPP-04: author hedges, each quoted + correct-post cite
|-- CANONICAL transformation priority list   # TPP-01: 14-item, verbatim-faithful, ASCII arrows, FibTPP cite
|-- Notation notes                           # D-04: glyph normalization note + {} / nil / scalar / container / case
|-- Amended red-green-refactor process       # D-01: verbatim 3-bullet block, TPP-post cite
|-- Provenance: original 12-item list        # TPP-02: 12-item verbatim + TPP-post cite
|-- Provenance: FibTPP revisions             # TPP-02/D-03: the 3 revisions, explicit 12-vs-14 resolution
|-- Secondary-source drift                   # TPP-02/D-03: Wikipedia/Grokipedia drift, cross-check only
|-- NDC 2011 transcript reconciliation       # TPP-03/D-06: discrepancies NOTED + precedence statement
'-- Sources / citations                      # every list + quote attributable to a specific primary URL
```

This is one file (D-05: single locked source-of-truth), delimited sections, provenance
adjacent to the list. The definitions/framing/process sections are the only additions to the
literal D-05 sequence and do not reorder its provenance/reconciliation tail.

### Citation micro-format (D-04 discretion, but must be unambiguous)

Every list and every quote MUST resolve to a specific primary URL, AND must resolve to the
CORRECT post (FibTPP vs TPP). Either inline parenthetical (e.g. "... (FibTPP post)") with a
Sources section mapping labels to URLs, or footnote-style, is acceptable. The load-bearing
rule: the 14-item list cites FibTPP; the 12-item list cites the TPP post; each hedge quote
cites the post it came from (see Verified Content Anchors for the per-quote source).

## Don't Hand-Roll

| Problem | Do NOT | Do instead | Why |
|---------|--------|------------|-----|
| The transformation list | Reconstruct from memory or from Wikipedia/secondary write-ups | Transcribe from the confirmed anchors below (verbatim from FibTPP/TPP) | Secondary sources have DRIFTED (constant->variable, "tail recursion" mislabel, 12-item only). Memory is stale. |
| The NDC transcript | Hand-transcribe the video or paraphrase from watching | Run the verified youtube-to-markdown tool (markitdown fallback) | D-07 mandates the tool; hand-transcription is slow, error-prone, and not reproducible. |
| Discrepancy resolution | Silently pick one ordering / drop the discrepancy | Document both, adopt 14-item as canonical, NOTE the difference with precedence | SC2/SC3 and D-03/D-06 explicitly forbid silent resolution. |
| Arrow rendering | Copy the source glyph as-is | Normalize ALL arrows to ASCII `->` + add a one-line notation note | Source mixes a non-ASCII dash (`{}` entries) with ASCII `->`; repo is ASCII-only. |
| Quote attribution | Attribute all hedges to "the TPP post" | Cite each quote to its actual post (hedges are split across BOTH) | D-04 requires post-specific citation; "language specific" is FibTPP, the rest are TPP. |

**Key insight:** In this phase the value is fidelity and provenance, not authorship. The
distillation should read like a faithful, well-cited restatement of two primary posts, with
every deviation from the raw source (arrow normalization, ordering choice) documented.

## Common Pitfalls

### Pitfall 1: List drift from secondary sources or memory (PITFALLS Pitfall 3)
**What goes wrong:** The 14-item list silently diverges -- `constant->scalar` rendered as
`constant->variable`, `statement->recursion` mislabeled "tail recursion", entries dropped, or
only 12 items shipped.
**Why it happens:** Secondary sources have already drifted; memory is stale.
**How to avoid:** Transcribe from the Verified Content Anchors below (confirmed verbatim
against FibTPP this session). Run the token-presence and order checks in Validation
Architecture.
**Warning signs:** Fewer than 14 canonical entries; `constant->variable`; "tail recursion"
where the source says "recursion"; any entry not traceable to the FibTPP post.

### Pitfall 2: Presenting TPP as rigid law (PITFALLS Pitfall 2 -- assigned to this phase)
**What goes wrong:** The ordered list reads as canon; the reference omits the author's own
uncertainty.
**Why it happens:** A numbered list looks authoritative; compression pressure cuts the hedges.
**How to avoid:** Include the hedge quotes verbatim, each correctly attributed. This is the
"capture the caveat" responsibility PITFALLS assigns specifically to source-distillation.
**Warning signs:** No hedges present; MUST/NEVER language around ordering; no mention that the
order is "language specific".

### Pitfall 3: Silently resolving discrepancies (SC2 / SC3 / D-03 / D-06)
**What goes wrong:** The reference picks the 14-item list and deletes the discrepancy
discussion; or the transcript is reconciled by quietly overwriting the blog wording.
**Why it happens:** It is tidier to present one answer.
**How to avoid:** Adopt 14-item as canonical AND document the original 12-item list, the 3
revisions, and secondary drift. For the transcript, NOTE differences and state precedence
(blogs > talk > secondary) rather than editing them away.
**Warning signs:** No "provenance" or "reconciliation" section; no precedence statement.

### Pitfall 4: Non-ASCII glyphs leaking into committed content (PITFALLS ASCII pitfall)
**What goes wrong:** The source's special dash glyph, smart quotes, or an em/en dash survive
into transformations.md, producing mojibake on the Windows cp1252 toolchain and ugly diffs.
**Why it happens:** Copy-paste from the rendered source carries the glyphs; the `{}` entries
in BOTH posts use a non-ASCII dash while other arrows are ASCII (confirmed this session).
**How to avoid:** Normalize every arrow to `->`, every quote to straight ASCII quotes, every
dash to `-`/`--`. Add the notation note. Gate with the `rg -n '[^\x00-\x7F]'` scan (must
return zero matches).
**Warning signs:** The ASCII scan returns any match.

### Pitfall 5: Scope creep into Phase 3 (D-02 boundary)
**What goes wrong:** transformations.md starts including TypeScript examples, the Fibonacci /
Word-Wrap walkthroughs, the coach decision procedure, or the opinionated TS ordering default.
**Why it happens:** The source posts contain the Fibonacci and Word-Wrap examples inline, so
they are "right there" while distilling.
**How to avoid:** Capture only the language-specificity CAVEAT (as provenance for the ordering
discrepancy). Leave examples, coach logic, and the TS overlay to Phase 3. When the FibTPP /
TPP source text shifts into worked-example prose, stop extracting.
**Warning signs:** Java/TS code blocks beyond what is needed to state a definition; a
"decision procedure" or "prefer iteration in TS" default appearing in Phase 2 content.

### Pitfall 6: Over-quoting / attribution risk (PITFALLS security row)
**What goes wrong:** Large verbatim swaths of the Clean Coder essays are pasted in.
**Why it happens:** Verbatim-faithful is misread as "copy the whole post".
**How to avoid:** Quote the list (short factual content) and the key definitions/hedges/
process block; summarize the surrounding narrative; cite URLs. Verbatim-faithful applies to
the LIST ENTRIES and the KEY QUOTES, not the entire essays.
**Warning signs:** Multi-paragraph verbatim essay reproduction; no summarization.

## Verified Content Anchors

These were confirmed VERBATIM against the primary posts this session (markdown.new re-fetch,
2026-07-02). Use these as the transcription source. Arrows shown here are already normalized
to ASCII `->`.

### CANONICAL 14-item list -- cite FibTPP post [VERIFIED: FibTPP.html re-fetched]

```
1.  ({} -> nil)                  no code at all -> code that employs nil
2.  (nil -> constant)
3.  (constant -> constant+)      a simple constant to a more complex constant
4.  (constant -> scalar)         replacing a constant with a variable or an argument
5.  (statement -> statements)    adding more unconditional statements
6.  (unconditional -> if)        splitting the execution path
7.  (scalar -> array)
8.  (array -> container)
9.  (statement -> tail-recursion)
10. (if -> while)
11. (statement -> recursion)
12. (expression -> function)     replacing an expression with a function or algorithm
13. (variable -> assignment)     replacing the value of a variable
14. (case)                       adding a case (or else) to an existing switch or if
```

### ORIGINAL 12-item list -- cite TPP post [VERIFIED: TheTransformationPriorityPremise.html re-fetched]

```
1.  ({} -> nil)                  no code at all -> code that employs nil
2.  (nil -> constant)
3.  (constant -> constant+)      a simple constant to a more complex constant
4.  (constant -> scalar)         replacing a constant with a variable or an argument
5.  (statement -> statements)    adding more unconditional statements
6.  (unconditional -> if)        splitting the execution path
7.  (scalar -> array)
8.  (array -> container)
9.  (statement -> recursion)
10. (if -> while)
11. (expression -> function)     replacing an expression with a function or algorithm
12. (variable -> assignment)     replacing the value of a variable
```
The TPP post appends "There are likely others." after this list. [VERIFIED]

### The 3 FibTPP revisions (the 12-vs-14 resolution) -- cite FibTPP post [VERIFIED]

1. Added `(statement -> tail-recursion)` at #9, ABOVE `(if -> while)`. FibTPP: "So tail
   recursion is preferred over arbitrary recursion."
2. Added `(case)` at #14 (bottom). FibTPP: "So I've added the (case) transformation to the
   very bottom of the list. This means that using a switch/case or an 'else if' is always the
   last option to choose."
3. Plain `(statement -> recursion)` moved to #11, now BELOW `(if -> while)` (it was #9, above
   `(if -> while)`, in the original).

### Transformations vs refactorings -- cite TPP post [VERIFIED]

Verbatim: "Refactorings are simple operations that change the structure of code without
changing it's behavior. Transformations are simple operations that change the behavior of
code. Transformations can be used as the sole means for passing the currently failing test in
the red/green/refactor cycle."
NOTE the source spells "it's" (should be "its"). For verbatim-faithful quoting, preserve the
source spelling (optionally with "[sic]") or quote faithfully -- planner's call, but do not
silently "fix and quote". [VERIFIED]

### The mantra -- cite TPP post [VERIFIED]

Verbatim: "As the tests get more specific, the code gets more generic."

### The premise -- cite TPP post [VERIFIED]

Verbatim: "My premise is that if you choose the tests and implementations that employ
transformations that are higher on the list, you will avoid the impasse."
Priority rationale (verbatim): "the transformations at the top of the list are simpler, and
less risky, than the transformations that are lower in the list." and "the more complexity
required by the test the larger the risk you take to get that test to pass."

### Author's hedges -- ATTRIBUTION IS SPLIT ACROSS BOTH POSTS [VERIFIED]

| Hedge (verbatim) | Source post to cite |
|------------------|---------------------|
| "I have roughly ordered the transformations by their complexity" ("roughly ordered") | TPP post |
| "The transformations as described are informal at best." ("informal at best") | TPP post |
| "Is the priority order presented in this blog correct? (not likely)" ("not likely") | TPP post |
| "Are these the right transformations? (probably not)" | TPP post |
| "Is there really a priority? (I think so, but it might be more complicated than a simple ordinal sequence)" | TPP post |
| "the priority list is language specific" | FibTPP post |

This is the D-04 fidelity nuance: do not attribute "language specific" to the TPP post, and
do not attribute the others to FibTPP.

### Amended red-green-refactor process -- cite TPP post [VERIFIED]

Verbatim block (source renders as a 3-item blockquote):
```
* When passing a test, prefer higher priority transformations.
* When posing a test choose one that can be passed with higher priority transformations.
* When an implementation seems to require a low priority transformation, backtrack to see if
  there is a simpler test to pass.
```

### Language-specificity caveat (provenance for the ordering discrepancy, D-02) -- cite FibTPP [VERIFIED]

Verbatim: "In Java, for example, we might move (if->while) and (variable->assignment) above
(statement->tail-recursion) so that iteration is always preferred above recursion, and
assignment is preferred above parameter passing." Capture this CAVEAT only; the opinionated
TS/JS default built on it is Phase 3 (D-02).

### Notation anchors -- cite as needed [VERIFIED against source usage]

- The source's `{}` entries render with a NON-ASCII dash glyph (e.g. `({}` then a dash-glyph
  then `>nil)`), while `(nil->constant)`, `(if->while)`, etc. use ASCII `->`. Normalize ALL to
  `->`. This is the concrete basis for the mandatory one-line notation note.
- `{}` = no code / empty; `nil` = null / a nothing-ish return; `constant+` = a more complex
  constant; `scalar` = a variable or argument; `container` = a collection generalizing an
  array; `(case)` = adding a case to a switch or an else/else-if (lowest priority).

## State of the Art (source evolution)

| Old | Current (canonical) | When | Impact |
|-----|---------------------|------|--------|
| 12-item list (TPP post, dated Dec 19 2010) | 14-item list (FibTPP post, dated Feb 2 2011; both published on blog 27 May 2013) | FibTPP explicitly revises the original | Adopt 14-item as canonical; keep 12-item for provenance (D-03). |
| `(statement->recursion)` above `(if->while)` | `(statement->tail-recursion)` above `(if->while)`; plain recursion moved below | FibTPP | The recursion/iteration ordering is a DELIBERATE within-source evolution, not a transcription error (document as such). |

**Known-drifted (do not use as canonical):** Wikipedia / Grokipedia and most secondary
write-ups -- render `constant->scalar` as `constant->variable`, mislabel
`statement->recursion` as "tail recursion", and commonly publish only the 12-item list. Cite
them only as cross-checks / drift examples, never as the list source.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The NDC 2011 video (`B93QezwTQpI`) has an accessible caption/transcript track the tool can fetch | Tooling & Inputs / Environment | If no captions, primary tool returns metadata-only -> markitdown fallback (ASR) is required. Mitigated by D-07's fallback; worst case the transcript is lower quality but still usable for reconciliation. Not a blocker for the shipped reference (blogs are canonical). |
| A2 | Secondary-source drift specifics (Wikipedia renders `constant->variable`, "tail recursion" mislabel, 12-item only) | State of the Art / TPP-02 | Carried from FEATURES.md/PITFALLS; NOT re-verified against Wikipedia this session. If a specific drift example is quoted in transformations.md, the executor should re-confirm the exact secondary rendering, or phrase it as "secondary sources such as Wikipedia commonly ..." without pinning an exact quote. Blogs remain canonical regardless. |
| A3 | markitdown fallback can transcribe a YouTube URL/audio if invoked | Tooling & Inputs | markitdown's YouTube support depends on its build; if it cannot fetch the video it may need a downloaded audio/caption file. Only relevant IF the primary tool fails (A1). Verify at fallback time. |

## Open Questions

1. **Does `B93QezwTQpI` expose a caption track to the InnerTube tool?**
   - What we know: the tool prefers an English caption track, falls back to `getTranscript()`;
     Node + deps are present.
   - What's unclear: whether this specific 2011 talk has captions accessible without an
     authenticated session (not probed this session to avoid a network call outside the
     distillation task).
   - Recommendation: the transcript plan's first task runs the tool and checks the segment
     count; branch to markitdown on 0 segments / metadata-only (D-07). Treat a low-quality
     transcript as acceptable (reconciliation material, not shipped).

2. **Preserve or correct the source "it's" typo in the transformations-vs-refactorings quote?**
   - What we know: the source verbatim reads "without changing it's behavior".
   - Recommendation: quote faithfully (optionally "[sic]"); do not silently correct-and-quote.
     A discretion call for the planner, but flag it so it is a decision, not an accident.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Node.js | youtube-to-markdown tool | Yes | v24.18.0 | none needed |
| youtube-to-markdown.mjs + deps | TPP-03 transcript | Yes | present; `node_modules` incl. `youtubei.js` installed | markitdown |
| markitdown CLI | TPP-03 fallback | Yes | `markitdown.exe` + `python.exe` in venv | none (last resort) |
| NDC 2011 captions | transcript quality | Unknown | -- | markitdown ASR (D-07) |
| rg (ripgrep) | validation checks | Yes (repo standard) | -- | none needed |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** NDC captions -> markitdown ASR fallback (A1/A3).

## Validation Architecture

Nyquist validation is enabled (`workflow.nyquist_validation: true`). This is a docs
deliverable, so validation is a set of mechanical (rg/test-based) checks plus semantic
cross-checks against the primary source -- not a unit-test framework.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None (Markdown deliverable). Validation = `rg`/`test` mechanical checks + human cross-check against Verified Content Anchors. |
| Config file | none -- see Wave 0 |
| Quick run command | `rg -n '[^\x00-\x7F]' plugins/lz-tdd/skills/lz-tpp/references/transformations.md` (ASCII gate; zero matches = pass) |
| Full suite command | Run the full checklist below (mechanical checks + per-entry cross-check) |

### Phase Requirements -> Check Map
| Req / SC | Behavior to verify | Check type | Command / method | Exists? |
|----------|--------------------|-----------|-------------------|---------|
| TPP-01 | Canonical 14-item list present, verbatim, in order | mechanical + semantic | `rg -F '(statement -> tail-recursion)' <file>` and `rg -F '(case)' <file>`; then per-entry cross-check vs Verified Content Anchors (14 entries, exact names + descriptions, correct order) | Wave 0 checklist |
| TPP-01 | Inline citations to BOTH primary posts | mechanical | `rg -F 'FibTPP.html' <file>` AND `rg -F 'TheTransformationPriorityPremise.html' <file>` (both must match) | Wave 0 checklist |
| TPP-02 | 12-vs-14 resolved explicitly (14 canonical; 12 documented; 3 revisions; secondary drift) | semantic | Confirm provenance sections present: original 12-item list, the 3 FibTPP revisions, secondary-source drift, and an explicit "adopt 14 as canonical" statement | Wave 0 checklist |
| TPP-03 | Transcript produced + retained | mechanical | `test -f .planning/phases/02-tpp-source-distillation/ndc-2011-tpp-transcript.md` and file non-empty | Wave 0 checklist |
| TPP-03 / SC3 | Reconciliation notes discrepancies (not silently resolved) + precedence stated | semantic | Confirm a reconciliation section exists that lists any transcript-vs-blog differences AND states "blogs > talk > secondary" | Wave 0 checklist |
| TPP-04 | Transformations-vs-refactorings distinction present (verbatim + cited) | mechanical + semantic | `rg -F 'change the behavior of code' <file>`; confirm quote attributed to TPP post | Wave 0 checklist |
| TPP-04 | Provisional-heuristic framing present (hedges, correctly attributed) | mechanical + semantic | `rg -F 'informal at best' <file>` and `rg -F 'language specific' <file>`; confirm "language specific" cites FibTPP, others cite TPP | Wave 0 checklist |
| D-01 | Amended red-green-refactor process present (verbatim, cited) | mechanical | `rg -F 'When passing a test' <file>` and `rg -F 'backtrack' <file>` | Wave 0 checklist |
| D-04 | ASCII-only committed content | mechanical | `rg -n '[^\x00-\x7F]' <file>` returns ZERO matches (set WORK_EMAIL to the work-email literal from MEMORY.md; never hardcode it in a committed file) | Wave 0 checklist |
| D-04 | Notation note (arrow normalization) present | mechanical | `rg -iF 'ASCII' <file>` and confirm a one-line arrow-normalization note | Wave 0 checklist |
| D-01/D-05 | Single shipped file at the correct path; no stray reference files | mechanical | `test -f plugins/lz-tdd/skills/lz-tpp/references/transformations.md`; confirm no other new `references/*.md` | Wave 0 checklist |
| hygiene | Work email absent (public-repo rule) | mechanical | `rg -F "$WORK_EMAIL" plugins/ .planning/phases/02-tpp-source-distillation/` returns ZERO matches | Wave 0 checklist |

`<file>` = `plugins/lz-tdd/skills/lz-tpp/references/transformations.md`. All searches use `rg`
(never `grep`, per repo convention).

### Sampling Rate
- **Per task commit:** ASCII gate (`rg -n '[^\x00-\x7F]'`) on any file touched.
- **Per plan / wave merge:** run the full mechanical check list above.
- **Phase gate:** full mechanical suite green AND the per-entry semantic cross-check (all 14
  entries + all key quotes verified against Verified Content Anchors, correct post attribution)
  before `/gsd:verify-work`.

### Wave 0 Gaps
- [ ] A durable validation checklist for the semantic cross-checks (per-entry + per-quote +
      attribution). Recommend a `02-VALIDATION.md` checklist in the phase dir (the mechanical
      `rg`/`test` checks can be embedded as copy-paste commands). This is the docs-appropriate
      substitute for a test file -- do NOT add shipped test code for a Markdown reference.
- [ ] No framework install needed (no runtime code under test).

*(Recommendation: keep validation as `rg`/`test` one-liners + a manual `VALIDATION.md`
checklist. A tiny check script is optional but must live OUTSIDE the shipped plugin -- e.g.
under `.planning/` -- so it never reaches the public skill. Do not add a dependency or a test
runner for this phase.)*

## Security Domain

`security_enforcement` is absent from config (treat as enabled). This is a public-repo docs
phase with no runtime code, no auth, no session, no crypto, and no user-input processing, so
most ASVS categories do not apply. The real controls are content-provenance and secret-leak
hygiene.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | -- (no auth surface) |
| V3 Session Management | no | -- |
| V4 Access Control | no | -- |
| V5 Input Validation | no (runtime) | -- (no runtime input; content fidelity handled by Validation Architecture) |
| V6 Cryptography | no | -- |
| V7 Error/Logging | no | -- |
| V14 Config / Data protection (adapted) | yes | Public-repo hygiene: no secrets/PII (work email) in committed content; ASCII-only committed bytes |

### Known Threat Patterns for this phase (STRIDE, adapted for a docs deliverable)

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Work email / secret leaked into committed content | Information Disclosure | Use public `larsbrinknielsen@gmail.com` only if any contact appears; gate with `rg -F "$WORK_EMAIL"` = zero matches (MEMORY.md public-repo allowlist rule). A TPP reference should contain no contact info at all. |
| List drift / unfaithful transcription presented as canonical | Tampering (of source truth) | Verbatim transcription from Verified Content Anchors + per-entry cross-check; cite the exact post. |
| Missing / wrong attribution of quotes and list | Repudiation (of provenance) | Inline citation of every list and quote to the correct primary URL (D-04); Sources section. |
| Over-quoting Clean Coder essays (licensing/attribution) | Information Disclosure (IP) | Quote the list + key definitions minimally with attribution; summarize narrative (PITFALLS security row). |
| Non-ASCII glyph -> mojibake in committed file | Tampering (encoding corruption) | ASCII-only gate (`rg -n '[^\x00-\x7F]'`); arrow normalization to `->`. |

## Sources

### Primary (HIGH confidence)
- FibTPP post -- https://blog.cleancoder.com/uncle-bob/2013/05/27/FibTPP.html -- re-fetched via
  markdown.new 2026-07-02; 14-item list, tail-recursion + case additions, language-specificity
  caveat, "tail recursion is preferred over arbitrary recursion" confirmed verbatim.
- TPP post -- https://blog.cleancoder.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html
  -- re-fetched via markdown.new 2026-07-02; 12-item list, transformations-vs-refactorings
  definition, mantra, premise, priority rationale, amended RGR 3-bullet process, and hedges
  ("roughly ordered", "informal at best", "not likely", "probably not", "might be more
  complicated than a simple ordinal sequence") confirmed verbatim.
- `.planning/research/FEATURES.md` Part 2 (lines 168-377) -- pre-distilled verbatim extract;
  the primary working input; matches the re-fetched posts.
- `.planning/research/PITFALLS.md` -- Pitfalls 2, 3, 10, 11, 12 and the ASCII / security rows;
  the docs-fidelity failure modes for this phase.
- youtube-to-markdown tool source (read this session) -- confirms `--output <prefix>` ->
  `<prefix>.md`, `--json` sidecar behavior, and the 0-segment / metadata-only failure signal.

### Secondary (MEDIUM confidence)
- Wikipedia "Transformation Priority Premise" -- cited by prior research as a DRIFT example
  (constant->variable, "tail recursion" mislabel, 12-item only). Not re-verified this session
  (A2); used only as a cross-check / drift illustration, never as the list source.

### Tertiary (LOW confidence)
- NDC 2011 talk `B93QezwTQpI` -- caption availability not probed this session (A1). Transcript
  to be produced during execution; reconciliation material, not shipped.

## Metadata

**Confidence breakdown:**
- Canonical + original lists: HIGH -- both re-fetched and confirmed verbatim against FibTPP/TPP.
- Key quotes + hedge attribution: HIGH -- confirmed verbatim, per-post attribution corrected.
- Tooling / environment: HIGH -- tool, deps, Node, and fallback all verified present.
- Transcript producibility: MEDIUM -- caption availability unprobed (A1); fallback exists.
- Secondary-source drift specifics: MEDIUM -- carried from prior research, not re-verified (A2).

**Research date:** 2026-07-02
**Valid until:** 2026-08-01 (stable domain -- 2013 primary sources are immutable; only the
transcript-tool caption availability could change).
```