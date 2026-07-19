---
phase: 17-assertion-design-stance-router-ts-vitest-mechanics
plan: 01
subsystem: testing
tags: [nyquist, instrument-first, red-baseline, tsc-strict, vitest, lz-red, completeness-gate]

# Dependency graph
requires:
  - phase: 16-source-distillation-core-red-references
    provides: the check-red-references.mjs base instrument (3 core-ref FILES entries + tsc-fence idiom + SCAFFOLD guard) and the lz-red-workspace (pinned typescript 6.0.3 / vitest 4.1.10)
  - phase: 15-lz-red-skill-scaffold
    provides: the ten reference stubs (incl. the testing-stance/ subdir) that carry per-doc content contracts + `## Sources (placeholder)` markers
provides:
  - Phase-17 RED baseline gate -- check-red-references.mjs grown from 3 to 10 FILES entries covering all six Phase-17 slices + the flipped assertions slice + the co-edited principle-backing
  - a per-file requireFence flag (fence assertion no longer unconditional -- nav-only / prose-only files exempt)
  - filename-presence cross-link guard (seams -> refactoring-without-tests.md) + cross-reference guards (vitest -> anti-patterns.md, message-matrix.md) + assertions-slice stance-leaf spine guards
  - machine-enforced D-15 co-edit boundary (Phase-18 deferral guards on the assertions slice, vitest, principle-backing; three-laws Phase-18 guard preserved)
affects: [17-02, 17-03, 17-04, 17-05, 17-06, phase-18-coach-procedure]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Instrument-first Nyquist RED->GREEN: the completeness gate is extended BEFORE content lands; the six stubs turn its new guards RED now and GREEN only as Waves 2-3 author content"
    - "Per-file requireFence flag: the ts-fence assertion is gated per entry so nav-only / prose-only references are not false-RED-ed"
    - "Filename-presence cross-link / cross-reference tokens folded into the topics array (check-backing fowler-catalog idiom) -- presence only, no link resolver"

key-files:
  created: []
  modified:
    - .claude/skills/lz-red-workspace/tools/check-red-references.mjs

key-decisions:
  - "D-13 instrument-first: extended check-red-references.mjs in place (no sibling checker); no build dep added to plugins/lz-tdd"
  - "Requirements ASRT-01/02/03, RTR-01/03, VIT-01/02, ANTI-01/02 remain OPEN -- this plan GATES them (RED baseline) but does not satisfy them; they close GREEN as Waves 2-3 author content (mirrors the 16-01 / 08.1 / 07 / 09 instrument-first precedent)"
  - "D-15 co-edit boundary machine-enforced: Phase-18 deferral guards added on the assertions slice, vitest, and principle-backing so a Wave-2 fill cannot over-fill a Phase-18 slice"

patterns-established:
  - "RED-on-stubs by design: the shared SCAFFOLD guard (## Sources (placeholder)) plus requireFence keep every unfilled stub RED regardless of stub-prose token matches; the gate flips GREEN only when authoring rewrites Sources + adds the fence + cross-links + Phase-18 marker"

requirements-completed: []

coverage:
  - id: D1
    description: "check-red-references.mjs extended to the Phase-17 RED baseline (10 FILES entries; per-file requireFence; cross-link/cross-ref + Phase-18 deferral guards); the content gate exits 1 by design against the current Phase-15 stubs"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs; test $? -eq 1"
        status: pass
    human_judgment: false
  - id: D2
    description: "GREEN floor holds -- tsc extractor and check-hygiene stay exit 0; no regression on the three-laws + naming core rows or the assertions-slice STR tokens; no shipped file touched, no dependency added"
    verification:
      - kind: automated
        ref: "npm --prefix .claude/skills/lz-red-workspace run typecheck (exit 0) && node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs (exit 0)"
        status: pass
    human_judgment: false

# Metrics
duration: ~10min
completed: 2026-07-19
status: complete
---

# Phase 17 Plan 01: Instrument-First Phase-17 RED Baseline Summary

**check-red-references.mjs grown from 3 to 10 FILES entries with a per-file requireFence flag, seams/vitest cross-link guards, and D-15 Phase-18 co-edit deferral guards -- the content gate now exits 1 (RED-on-stubs by design) while three-laws + naming stay all-PASS and typecheck + hygiene stay GREEN.**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-07-19
- **Completed:** 2026-07-19
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments

- Extended the dev-only `check-red-references.mjs` completeness gate in place (D-13, no sibling): the `FILES` array now carries ten entries -- the three carried-over Phase-16 core refs (three-laws + naming unchanged; the `test-structure-and-assertions.md` assertions slice FLIPPED), the six new Phase-17 slices (`testing-stance/README.md`, `functional-core.md`, `message-matrix.md`, `seams-and-legacy.md`, `vitest-typescript-mechanics.md`, `anti-patterns.md`), and the co-edited `principle-backing.md`.
- Flipped the assertions slice: deleted the old `Phase 17 / ASRT-0` marker-remains deferral, kept the five STR tokens (regression floor), added five ASRT content tokens (four pillars, resistance to refactoring, F.I.R.S.T., observable behavior, communication-based) plus three stance-leaf filename-presence tokens (functional-core.md / message-matrix.md / seams-and-legacy.md -- the ASRT-02 spine, ROADMAP SC1), set `requireFence: true`, and added a NEW Phase-18 F.I.R.S.T.-baseline deferral guard.
- Made the ts-fence assertion per-file via a `requireFence` flag (replacing the unconditional check); nav-only / prose-only files (README, seams-and-legacy, anti-patterns, principle-backing) set it `false` so they are not false-RED-ed.
- Added the seams-and-legacy cross-link presence guard (`refactoring-without-tests.md`, RTR-01 "cross-linked not copied"), the vitest cross-reference guards (`anti-patterns.md`, `message-matrix.md`), and Phase-18 co-edit deferral guards on the assertions slice, vitest, and principle-backing (D-15); preserved the three-laws Phase-18 guard untouched.
- Asserted the Wave-0 RED baseline across all three gates: content gate exits 1 (RED by design; 29 checks FAIL on the unfilled stubs), tsc extractor exits 0 (GREEN-on-empty over the 3 existing Phase-16 fences), check-hygiene exits 0 (ASCII + work-email + no-verbatim clean, 198/191 files). No shipped `plugins/lz-tdd` file modified; no dependency added.

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend check-red-references.mjs to the Phase-17 RED baseline** - `10f8314` (test)
2. **Task 2: Assert the Wave-0 RED baseline across all three gates** - verification-only (no file delta beyond Task 1; the three-gate assertion produced no code change to commit)

**Plan metadata:** committed with STATE.md + ROADMAP.md (docs: complete plan)

## Files Created/Modified

- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` - Extended the Phase-16 SEL/STR/NAME completeness gate to the Phase-17 scope: 10 FILES entries, per-file requireFence flag, filename-presence cross-link/cross-reference tokens, Phase-18 co-edit deferral guards, updated header comment + intro/SUMMARY strings. Dev-only (NOT shipped); Node builtins only; imports the shared SCAFFOLD_RES.

## Decisions Made

- **Requirements remain OPEN (not marked complete).** This is an instrument-first Wave-0/1 plan: it establishes the machine gate for all nine Phase-17 requirements (ASRT-01/02/03, RTR-01/03, VIT-01/02, ANTI-01/02) but does NOT author the content that satisfies them. They close GREEN only when the Wave-2/3 content plans (17-02..17-06) turn the gate GREEN. This mirrors the repeated project precedent (16-01: SEL/STR/NAME remained OPEN; 08.1: GOF/XTR remained OPEN; 07: FWL remained OPEN; 09: PRIN remained OPEN). `requirements-completed: []`.
- **Some content tokens legitimately PASS on the current stub prose (by design).** The Phase-15 stubs carry per-doc "content contract" descriptions that already name some tokens (e.g. README's detection signals + route table + leaf filenames; message-matrix's incoming/outgoing query/command; the assertions-slice scope paragraph's "four pillars" / "F.I.R.S.T." / "observable behavior"; the seams stub's prose mention of refactoring-without-tests.md). The reliable RED-now signal for every unfilled stub is the shared SCAFFOLD guard (`## Sources (placeholder)`) plus `requireFence` -- exactly the Phase-16 instrument design. The overall gate is unambiguously RED (exit 1; 29 FAILs; six stubs each trip the scaffold guard). The non-discriminating tokens are harmless GREEN targets that stay green when real content lands.

## Deviations from Plan

None - plan executed exactly as written. The plan's explicit regexes and requireFence flags were implemented verbatim; the acceptance criteria and both `<verify>` gates pass as specified.

## Issues Encountered

None. The extended checker parses and runs under Node builtins; all three gates returned their expected exit codes on the first run (content=1, typecheck=0, hygiene=0).

## Self-Check: PASSED

- Commit `10f8314` exists on the branch and contains the modified file.
- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` exists on disk and is the only file in the Task-1 commit.
- No `plugins/lz-tdd` (shipped) file is present in the commit; no dependency was added.

## User Setup Required

None - no external service configuration required. This is a dev-only instrument change.

## Next Phase Readiness

- The Phase-17 RED baseline is established and asserted. Wave-2/3 content plans (17-02..17-06) now have a machine signal for every requirement: authoring a slice flips its rows GREEN (add the real content tokens + the tsc-strict Vitest fence where `requireFence: true` + the cross-links + rewrite `## Sources (placeholder)` -> `## Sources`), and the D-15 Phase-18 deferral guards ensure a wave fills only its own slice.
- Requirements ASRT-01/02/03, RTR-01/03, VIT-01/02, ANTI-01/02 remain OPEN until the content plans turn the gate GREEN.
- No blockers. The tsc extractor + check-hygiene GREEN floor is intact; no shipped file or dependency was touched.

---
*Phase: 17-assertion-design-stance-router-ts-vitest-mechanics*
*Completed: 2026-07-19*
