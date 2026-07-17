---
phase: 02-tpp-source-distillation
plan: 02
subsystem: docs
tags: [tpp, transformations, provenance, citations, ascii-hygiene, reconciliation]

# Dependency graph
requires:
  - phase: 01-foundation
    provides: "Existing skill dir plugins/lz-tdd/skills/lz-tpp/ and the ASCII-only / public-repo hygiene conventions"
  - phase: 02-tpp-source-distillation (plan 02-01)
    provides: "Retained NDC 2011 talk transcript at .planning/phases/02-tpp-source-distillation/ndc-2011-tpp-transcript.md, used for the reconciliation section"
provides:
  - "Single SHIPPED canonical TPP reference plugins/lz-tdd/skills/lz-tpp/references/transformations.md: verbatim-faithful 14-item FibTPP list, cited to the exact primary post"
  - "Explicit 12-vs-14 resolution (14 canonical) with the original 12-item list, the 3 FibTPP revisions, and secondary-source drift documented for provenance"
  - "Transformations-vs-refactorings definition, premise, mantra, and the author's split-attributed hedges (provisional-heuristic framing)"
  - "Amended red-green-refactor 3-bullet process and the NDC 2011 transcript reconciliation with precedence blogs > talk > secondary"
affects: [03-skill-authoring, tpp-coach, tpp-reference]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Canonical source-of-truth reference: verbatim quotes with per-post inline citation labels ((TPP post)/(FibTPP post)) mapped to full URLs in a Sources section"
    - "Provenance kept adjacent to the canonical list in ONE file (D-05), so list and provenance cannot drift apart"
    - "ASCII-only committed content: all arrows normalized to `->` with a one-line notation note; rg [^\\x00-\\x7F] zero-match gate on every touched task"
    - "Discrepancies NOTED not silently resolved (12-vs-14, transcript-vs-blog), with an explicit precedence statement"

key-files:
  created:
    - plugins/lz-tdd/skills/lz-tpp/references/transformations.md
  modified: []

key-decisions:
  - "Adopted the revised 14-item FibTPP list as canonical; retained the original 12-item TPP-post list plus the 3 revisions and secondary drift for provenance (D-03) -- explicit resolution, not a silent pick"
  - "Split hedge attribution: 'language specific' cites the FibTPP post; 'roughly ordered' / 'informal at best' / 'not likely' / 'probably not' / 'ordinal sequence' cite the TPP post (RESEARCH fidelity trap avoided)"
  - "Quoted the transformations-vs-refactorings definition with the source spelling 'it's [sic]' so the fidelity choice is deliberate"
  - "Captured the FibTPP language-specificity caveat as provenance only; the opinionated TS/JS ordering default is deferred (D-02 scope boundary)"
  - "Task 3 (validation gate) produced no file change -- all mechanical + semantic + hygiene checks passed against the as-authored file, so no separate commit (results recorded here)"

patterns-established:
  - "Per-post citation of every list and quote; the 14-item list -> FibTPP, the 12-item list + defs/premise/mantra/most-hedges/amended-RGR -> TPP"
  - "Single locked reference file with delimited provenance + reconciliation sections in the D-05 order"

requirements-completed: [TPP-01, TPP-02, TPP-03, TPP-04]

# Metrics
duration: 5min
completed: 2026-07-02
---

# Phase 2 Plan 02: TPP Transformations Canonical Reference Summary

**Shipped `references/transformations.md`: the verbatim-faithful, per-post-cited 14-item FibTPP transformation-priority list with the explicit 12-vs-14 resolution, transformations-vs-refactorings definition, provisional-heuristic hedges, amended red-green-refactor process, and NDC 2011 transcript reconciliation -- all ASCII-only.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-07-02T07:44:00Z
- **Completed:** 2026-07-02T07:49:00Z
- **Tasks:** 3 (2 producing commits, 1 validation gate that was a verified no-op)
- **Files modified:** 1 created (shipped reference)

## Accomplishments
- Authored the single SHIPPED canonical reference `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` (creating the `references/` dir): the verbatim-faithful 14-item FibTPP list with ASCII arrows, cited to the FibTPP post.
- Resolved the 12-vs-14 discrepancy EXPLICITLY: adopted the 14-item list as canonical, and documented the original 12-item list ("There are likely others." trailer), the 3 FibTPP revisions, and secondary-source drift as provenance.
- Captured the TPP-04 content: the transformations-vs-refactorings definition ("it's [sic]"), the premise, the mantra, and the author's hedges with SPLIT per-post attribution ("language specific" -> FibTPP; the rest -> TPP).
- Reconciled the retained NDC 2011 transcript against the blog list, NOTING discrepancies (partial/informal spoken list; naming drift; pre-revision talk; mantra wording; garbled URL) and stating the precedence blogs > talk > secondary (D-06).
- Passed the full validation gate: all mechanical `rg`/`test` checks, the per-entry/per-quote semantic cross-check against the Verified Content Anchors, the ASCII gate (zero non-ASCII bytes), the single-reference-file check, and the work-email allowlist (clean).

## Task Commits

Each task was committed atomically where it produced changes:

1. **Task 1: Author the canonical core (definitions, framing, 14-item list, notation, amended RGR)** - `39b7205` (docs)
2. **Task 2: Author provenance, 12-vs-14 resolution, secondary drift, NDC reconciliation, and sources** - `3bab6bc` (docs)
3. **Task 3: Full validation gate (mechanical suite + semantic cross-check + hygiene)** - no commit (verified no-op; all checks green against the as-authored file; see Deviations)

**Plan metadata:** committed separately (SUMMARY.md + REQUIREMENTS.md; STATE.md / ROADMAP.md are owned by the orchestrator in worktree mode).

## Files Created/Modified
- `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` (226 lines) - The single shipped canonical TPP reference: transformations-vs-refactorings definition, premise + mantra, provisional-heuristic hedges, the 14-item canonical list, notation notes, amended red-green-refactor process, original 12-item provenance, FibTPP revisions + 12-vs-14 resolution, secondary-source drift, NDC 2011 reconciliation, and a Sources section mapping both post labels to full URLs.

## Validation Gate Results (Task 3)

Full mechanical suite (RESEARCH "Validation Architecture") -- all GREEN:
- `rg -F '(statement -> tail-recursion)'` and `rg -F '(case)'` -> match (canonical-list markers).
- `rg -F 'FibTPP.html'` AND `rg -F 'TheTransformationPriorityPremise.html'` -> both match (both primary posts cited).
- `rg -F 'change the behavior of code'`, `rg -F 'informal at best'`, `rg -F 'language specific'`, `rg -F 'When passing a test'`, `rg -iF 'backtrack'`, `rg -iF 'ASCII'` -> all match.
- ASCII gate `rg -n '[^\x00-\x7F]'` -> ZERO matches.
- Single shipped reference file: `find plugins/lz-tdd/skills/lz-tpp/references -name '*.md'` -> only `transformations.md` (count 1).
- Work-email allowlist over the shipped file + phase dir (emails minus the public gmail) -> no output.

Semantic cross-check against the Verified Content Anchors -- PASS:
- All 14 canonical entries present, verbatim, in exact order (tail-recursion at #9 above `(if -> while)`, plain recursion at #11 below it, `(case)` at #14). All 12 original entries present, verbatim, in exact order (recursion at #9 above `(if -> while)`).
- Per-quote attribution correct: 14-item list -> FibTPP; 12-item list + definition/premise/mantra/amended-RGR + four hedges -> TPP; "language specific" hedge + language caveat -> FibTPP.
- No D-02 scope creep: no TypeScript/JS code blocks, no Fibonacci/Word-Wrap walkthrough, no coach decision procedure, no "prefer iteration in TS" default (negative grep clean; no fenced code blocks).

## Decisions Made
- **14-item canonical, 12-item retained (D-03):** adopted the revised FibTPP list as the source of truth and documented the original list + 3 revisions + secondary drift for provenance, rather than silently picking one.
- **Split hedge attribution (D-04 fidelity trap):** each hedge is cited to the post it actually came from -- "language specific" to FibTPP, the other five to TPP -- avoiding the RESEARCH-flagged single-post over-attribution.
- **"it's [sic]" preserved:** the transformations-vs-refactorings definition is quoted with the source spelling and `[sic]`, making the fidelity choice deliberate (resolved in the plan `<context>`).
- **Language caveat as provenance only (D-02):** the FibTPP "in Java ... move (if -> while) ... above (statement -> tail-recursion)" example is captured to explain the ordering evolution; the opinionated per-language coaching default is left out of scope.
- **Arrow normalization documented:** all arrows rendered ASCII `->` (including inside the language-caveat quote) with a one-line notation note stating this is a rendering normalization only.

## Deviations from Plan

None - plan executed exactly as written.

Note: Task 3's validation gate found no failures, so it edited nothing and produced no commit (the task action is "fix any failure in place"; there were none). This mirrors 02-01's verified-no-op task pattern -- all mechanical, semantic, and hygiene checks passed against the file as authored in Tasks 1-2. Results are recorded above under "Validation Gate Results" rather than forcing an empty commit.

## Issues Encountered
- Two `rg -F` line-oriented token checks initially missed because a blockquote line wrap split a checked phrase ("change the behavior of / code") across two lines. Reflowed the quote so the phrase stays on one line; re-ran the check green. This was a formatting-only fix within Task 1 before its commit, not a content change.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The canonical, cited source-of-truth is locked and shipped, ready for Phase 3 skill authoring: `SKILL.md` can reference `references/transformations.md` via progressive disclosure, and the coach decision procedure + TypeScript examples + the language-specific ordering overlay (TPP-05/06/07, SKILL-03) build on top of it.
- TPP-01, TPP-02, TPP-04 are fully satisfied by this plan; TPP-03 is now fully closed (transcription + retention from 02-01, reconciliation here).
- No blockers.

## Self-Check: PASSED

- FOUND: `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` (created, 226 lines, ASCII-clean)
- FOUND: `.planning/phases/02-tpp-source-distillation/02-02-SUMMARY.md` (this file)
- FOUND: commit `39b7205` (Task 1)
- FOUND: commit `3bab6bc` (Task 2)

---
*Phase: 02-tpp-source-distillation*
*Completed: 2026-07-02*
