---
phase: 09-coach-behavior-principle-backing
plan: 02
subsystem: skill-router
tags: [coach-procedure, skill-md, decision-tree, cross-links, CCH, progressive-disclosure]

# Dependency graph
requires:
  - phase: 09-coach-behavior-principle-backing
    plan: 01
    provides: check-crossrefs.mjs now sources SKILL.md (so the new coach cross-links are resolution-gated) + check-backing RED gate
  - phase: 08.2-functional-catalog-inserted
    provides: functional-catalog + the one-line "Functional alternative:" cross-links on OO leaves (the CCH-02/06 de-patterning substrate)
  - phase: 07-fowler-catalog
    provides: fowler-catalog + unified smells.md taxonomy (navigation-only index -> open the leaf) + principles.md two-hats framing
provides:
  - "SKILL.md: the inline dual-mode coach decision procedure (a compact 6-step numbered tree wiring CCH-01..06) replacing the deferred-to-Phase-9 placeholder"
  - "The router now routes: classify -> recognize smell -> route mechanical/Fowler vs repeated-complex/Kerievsky -> de-patterning balance -> behavior-preservation + Feathers fallback -> reference mode"
affects: [09-04, 09-phase-gate, EVL-02, coach-behavior]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Numbered coach decision tree mirroring the sibling lz-tpp SKILL.md shape (opens with a classify gate, closes with a coach-don't-drive line)"
    - "Routing source-of-truth is the EXISTING smells.md + smell leaves + router pointer sections -- no duplicate smell->refactoring table (D-03)"
    - "All coach cross-links file-level (no #anchor) to already-existing files; INLINE in SKILL.md, no coach-procedure.md split (D-01/D-02)"

key-files:
  created: []
  modified:
    - plugins/lz-tdd/skills/lz-refactor/SKILL.md

key-decisions:
  - "D-01/D-02: the coach procedure lives INLINE in SKILL.md (the file lands at 112 lines, ~388 under the < 500 budget); the split-to-coach-procedure.md fallback is not triggered"
  - "D-03: NO new smell->refactoring table; the procedure references the existing smells.md + smell leaves + the router pointer sections already in SKILL.md, adding only the routing dimension"
  - "D-04/D-05: step 1 points at the existing 'Refactoring vs the green step' seam section (CCH-05) and the functional-catalog de-patterning route (CCH-02/06, Replace-Pipeline-with-Loop reverse note); links are file-level to existing files only (Beck files reached via principles.md, wired in 09-03/09-04)"

patterns-established:
  - "Inline compact decision tree for a skill router's core auto-trigger behavior: 6 numbered steps, references (does not re-add) the router pointer sections, file-level links only"

requirements-completed: [CCH-01, CCH-02, CCH-03, CCH-04, CCH-05, CCH-06]

# Metrics
duration: ~8min
completed: 2026-07-08
---

# Phase 9 Plan 02: Inline Coach Decision Procedure (CCH-01..06) Summary

**Replaced the deferred-to-Phase-9 placeholder in the shipped lz-refactor SKILL.md with the real inline coach decision procedure -- a compact 6-step numbered decision tree that wires CCH-01..06 on top of the existing smells taxonomy, catalogs, and router pointers, with no new smell table and file-level links to already-existing files only.**

## Performance

- **Duration:** ~8 min
- **Completed:** 2026-07-08
- **Tasks:** 1
- **Files modified:** 1 (0 created, 1 modified)

## Accomplishments

- Replaced the `## Coach decision procedure (deferred to Phase 9)` placeholder section (SKILL.md :38-43) with a real `## Coach decision procedure`: a compact 6-step numbered decision tree (~30 lines) that mirrors the sibling lz-tpp SKILL.md shape -- opens with a classify gate, closes with a coach-don't-drive line.
- The six steps wire every coach behavior: (1) classify against the lz-tpp seam -- a red test to make pass is the green step, hand off to lz-tpp and stop (CCH-05); (2) recognize the smell by scanning smells.md recognize-by cues, then OPEN the matching leaf for candidates -- the index is navigation-only, never guess from it (CCH-01, D-03); (3) route by smell kind -- mechanical -> Fowler catalog, repeated/complex-structure -> Kerievsky catalog with the target pattern looked up in GoF/extra-patterns (CCH-01); (4) apply the over/under-engineering balance -- keep a pattern that earns its keep, refactor an unwarranted one AWAY via a Kerievsky Away refactoring OR dissolve it to a functional idiom via the functional-catalog, with the Replace-Pipeline-with-Loop reverse note (CCH-02, CCH-06, D-05); (5) preserve behavior -- smallest steps, run tests after each, commit on green, and route to the Feathers refactoring-without-tests reference when the target code has no tests (CCH-03); (6) reference mode -- route an explain/lookup request to the correct references/ doc and answer from it (CCH-04).
- Removed the placeholder-mode parenthetical inside the "Two modes" coach bullet (:27); the string "deferred to Phase 9" no longer appears anywhere in the file.
- Added NO new smell->refactoring table (D-03): the procedure references the existing smells.md + smell leaves + the router pointer sections already present at :45-85 as the routing source of truth.
- Every coach cross-link is FILE-LEVEL (no #anchor) and points ONLY at already-existing files (smells.md, fowler-catalog/README.md, kerievsky-catalog/README.md, gof-catalog/README.md, extra-patterns-catalog/README.md, functional-catalog/README.md, refactoring-without-tests.md, principles.md). The Beck files are deliberately NOT linked here -- they are reached via principles.md, wired in the parallel 09-03/09-04 work.
- SKILL.md stays lean at 112 lines (~388 under the < 500 budget), ASCII-only, work-email-free.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author the inline coach decision procedure in SKILL.md (CCH-01..06)** - `a0df8df` (feat)

_No TDD split; this is a Markdown skill-router authoring plan._

## Files Created/Modified

- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` - Replaced the deferred-to-Phase-9 placeholder section and its coach-mode parenthetical with a real inline 6-step coach decision procedure; net +35/-8 lines (85 -> 112). No router pointer section touched; no table added.

## Decisions Made

- **D-01/D-02 (inline, no split):** The measured file lands at 112 lines, comfortably under the < 500 budget, so the D-02 split-to-`coach-procedure.md` fallback stayed dead code -- the procedure is INLINE in SKILL.md, the skill's core auto-trigger behavior.
- **D-03 (no duplicate table):** The procedure adds only the routing dimension (mechanical -> Fowler; repeated/complex-structure -> Kerievsky; unwarranted pattern -> functional-catalog de-patterning; missing tests -> Feathers) on top of the existing smells.md navigation-only-index / open-the-leaf design; no smell->refactoring table was introduced.
- **D-04/D-05 (seam + de-patterning routing):** Step 1 points at the existing "Refactoring vs the green step" section rather than restating the two-hats framing (CCH-05); the de-patterning step routes to the functional-catalog with the Replace-Pipeline-with-Loop reverse guidance (CCH-02/06). Links stay file-level to existing files; the Beck backing files are not linked here (reached via principles.md, authored in 09-03/09-04).

## Deviations from Plan

None - the plan executed exactly as written. No auto-fixes (Rules 1-3) were needed; no architectural decisions (Rule 4) arose.

## Issues Encountered

- **check-backing stays RED by design** (not a failure): per the plan's scoped verification, only check-crossrefs + check-hygiene + the SKILL.md string/line-count assertion were run (all exit 0). check-backing is intentionally left RED in this run because the Beck principle references it gates are authored in the parallel plan 09-03; the full-battery GREEN is asserted at the 09-04 phase gate.
- **STATE handler argument forms:** `state.record-metric` and `state.add-decision` rejected positional args and required named flags (`--phase/--plan/--duration`, `--summary`); re-invoked with flags and both recorded. `state.update-progress` reported "Progress field not found in STATE.md" (this STATE.md carries progress only in frontmatter, no body progress-bar line) -- a no-op, no impact on tracking.

## User Setup Required

None - this is a shipped-Markdown edit to a single skill router; zero packages, zero external configuration.

## Next Phase Readiness

- **The router now coaches** rather than advertising a deferred placeholder -- CCH-01..06 are wired inline and their outbound links are resolution-gated by check-crossrefs (extended in 09-01 to source SKILL.md).
- **09-03 (parallel) authors the Beck/Feathers backing references** that turn check-backing GREEN; **09-04 is the phase gate** where the full battery (including check-backing) is asserted GREEN and principles.md gains the D-06 Beck cross-ref pointers.
- **No blockers.** All coach cross-links resolve today; nothing in this plan depends on 09-03's output.

## Self-Check: PASSED

- FOUND: plugins/lz-tdd/skills/lz-refactor/SKILL.md
- FOUND commit: a0df8df (Task 1)

---
*Phase: 09-coach-behavior-principle-backing*
*Completed: 2026-07-08*
