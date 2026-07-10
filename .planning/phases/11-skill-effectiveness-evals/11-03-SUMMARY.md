---
phase: 11-skill-effectiveness-evals
plan: 03
subsystem: testing
tags: [evals, skill-creator, grader, refactoring, fowler, kerievsky, functional]

# Dependency graph
requires:
  - phase: 11-01
    provides: vendored skill-creator-eval rig + eval-status/merge-judge; grade-run.mjs analog shape
  - phase: 11-02
    provides: EVL-01 trigger set + check-evals.mjs lint precedent (ASCII/schema/count gates)
  - phase: 07-08
    provides: shipped Fowler (62) + Kerievsky (27, 3 Away) catalog READMEs + smell leaves (candidate sets)
  - phase: 08.2
    provides: functional-catalog README (idiom-leaf names + Singleton -> Module Namespace dissolution)
provides:
  - EVL-02 behavior scenario set (evals/evals.json, 9 leaf-sourced scenarios spanning both layers + de-patterning + routing-boundary) [Task 1, prior session]
  - Deterministic grader grade-run.mjs (nameRe matcher + candidateSet/bestFit/layer/nodrive/judge + name->layer lookup + selfcheck)
affects: [11-04, milestone-audit, EVL-02-gated-run]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "D-04-RUBRIC hybrid grader: name (bestFit/candidateSet) + layer scored deterministically; only rationale delegated to LLM judge"
    - "name->layer lookup built from the 3 shipped catalog READMEs (Fowler/Kerievsky/+Away/functional); scanned via word-bounded nameRe"
    - "RUBRICS<->evals.json count-alignment selfcheck + name-resolve gate (Pitfall-6 / T-11-06 fail-loud)"

key-files:
  created:
    - .claude/skills/lz-refactor-workspace/grade-run.mjs
  modified: []

key-decisions:
  - "nameRe replaces the lz-tpp transformRe: matches proper-noun refactoring phrases, whitespace-tolerant, word-bounded (no sub-match of a longer word)"
  - "layer check resolves ANY named refactoring in the response via NAME_LAYERS and passes if it intersects the accepted layer set (deterministic CCH-01 routing check, not a judge question)"
  - "id-7 de-patterning accepts candidateSet [Inline Singleton, Module Namespace] and layer [Kerievsky-Away, functional]; id-8 routing-boundary pins Replace Conditional with Polymorphism at Fowler"
  - "EVL-02 requirement stays OPEN: data + grader are BUILT this plan; measured with-skill vs baseline accuracy closes only after the D-10-gated run (11-04)"

patterns-established:
  - "Grader skeleton reuse: toolDrive/nodrive/judge branches + grade()/finalOutPath/parseArgs/main + selfcheck structure kept verbatim from the analog; only the matcher + RUBRICS + lookup are skill-specific"

requirements-completed: []  # EVL-02 remains OPEN by design (D-10): the grader + scenarios are built, but the empirical run that closes EVL-02 is gated to 11-04.

# Metrics
duration: ~15min (continuation session; Task 1 authored in a prior session before a usage-limit interruption)
completed: 2026-07-10
---

# Phase 11 Plan 03: EVL-02 Behavior Set + Deterministic Grader Summary

**Deterministic lz-refactor grader (`grade-run.mjs`) scoring next-refactoring name + layer via a word-bounded phrase matcher and a name->layer lookup derived from the 3 shipped catalog READMEs, with the 9 leaf-sourced EVL-02 scenarios it grades against.**

## Performance

- **Duration:** ~15 min (continuation session for Task 2; Task 1 was committed in a prior session)
- **Started:** 2026-07-10 (continuation after usage-limit interruption)
- **Completed:** 2026-07-10
- **Tasks:** 2 (Task 1 prior session; Task 2 this session)
- **Files modified:** 2 (1 created this session)

## Accomplishments
- Rewrote `grade-run.mjs` as the lz-refactor deterministic grader: `nameRe` proper-noun phrase matcher (case-insensitive, whitespace-tolerant, word-bounded) replacing the lz-tpp `transformRe`.
- Built the `NAME_LAYERS` lookup from the three shipped catalog READMEs (62 Fowler -> Fowler; 27 Kerievsky -> Kerievsky, the 3 Direction=Away rows also -> Kerievsky-Away; 19 functional idiom leaves -> functional).
- Implemented the five D-04-RUBRIC check kinds: `bestFit`, `candidateSet`, `layer`, `nodrive`, `judge`; authored RUBRICS for evals 0-8 count-aligned 1:1 with the committed `evals.json` expectations.
- Kept the analog skeleton verbatim (`toolDrive`, nodrive/judge branches, `grade()`, `finalOutPath`, `parseArgs`, `main`, selfcheck alignment loop) and widened the `--eval-id` range to 0-8.
- Selfcheck GREEN: matcher boundary + whitespace cases, four-layer resolve (Fowler/Kerievsky/Kerievsky-Away/functional), nodrive nested-drove/flat/miskeyed/no-metrics, finalOutPath preliminary path, RUBRICS<->evals.json alignment, and the new every-name-resolves gate.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author evals/evals.json (9 leaf-sourced behavior scenarios)** - `3ff3cb0` (test) [prior session]
2. **Task 2: Build name->layer lookup + rewrite grade-run.mjs; selfcheck GREEN** - `b4b044f` (feat) [this session]

**Plan metadata:** this commit (docs: complete plan)

## Files Created/Modified
- `.claude/skills/lz-refactor-workspace/grade-run.mjs` - Deterministic EVL-02 grader: `nameRe` matcher, `NAME_LAYERS` lookup, five check kinds, RUBRICS[0-8], `--selfcheck` (created this session)
- `.claude/skills/lz-refactor-workspace/evals/evals.json` - 9 EVL-02 scenarios (created prior session, `3ff3cb0`; left intact, not re-committed)

## Decisions Made
- `layer` check is deterministic (resolve-via-lookup), not a judge question: it passes when any refactoring named in the response resolves to an accepted layer. This enforces CCH-01 layer routing mechanically and reserves the LLM judge strictly for rationale quality (tie-to-smell, id-8 Fowler-over-pattern justification, id-7 unwarranted-pattern framing).
- Only canonical catalog names populate `NAME_LAYERS` (no 1st-ed aliases). `Introduce Null Object` is the canonical Kerievsky name (Ch.9) and resolves to Kerievsky; the Fowler `Introduce Special Case` alias is intentionally excluded to avoid a two-layer collision.
- EVL-02 requirement is NOT marked complete: consistent with 11-01/11-02, the empirical with-skill-vs-baseline measurement is D-10-gated to plan 11-04. This plan ships the DATA + grader only.

## Deviations from Plan

None - plan executed exactly as written. RUBRICS check counts and orderings match the committed `evals.json` expectations exactly (5/5/5/5/5/5/4/4/4 for ids 0-8), and every candidateSet/bestFit name resolves in the lookup.

## Issues Encountered
None. The analog skeleton transferred cleanly; the only genuine authoring was the matcher, the lookup, and the RUBRICS, all validated by the selfcheck.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The EVL-02 grader is build-verified (`node grade-run.mjs --selfcheck` -> `SELFCHECK OK`, exit 0) and an end-to-end fixture run confirmed the `--output`/`--metrics`/`--out` path emits the fail-closed `grading.preliminary.json` with the `aggregate_benchmark.py` output shape intact.
- Ready for plan 11-04 (readiness gate): present the ready-to-run EVL-01 + EVL-02 commands with the locked serial run config, then HALT for explicit user approval (D-10). No `claude -p` run occurred in this plan.

## Self-Check: PASSED

- FOUND: `.claude/skills/lz-refactor-workspace/grade-run.mjs`
- FOUND: `.claude/skills/lz-refactor-workspace/evals/evals.json` (Task 1, left intact)
- FOUND commit `b4b044f` (Task 2, feat)
- FOUND commit `3ff3cb0` (Task 1, test, prior session)
- `node grade-run.mjs --selfcheck` -> `SELFCHECK OK` (exit 0)

---
*Phase: 11-skill-effectiveness-evals*
*Completed: 2026-07-10*
