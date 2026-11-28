---
phase: 17-assertion-design-stance-router-ts-vitest-mechanics
plan: 04
subsystem: testing
tags: [vitest, typescript, tdd, testing-stance, metz, message-matrix, assert-vs-mock, red-phase]

# Dependency graph
requires:
  - phase: 16-source-distillation-core-red-references
    provides: lz-red-workspace instrument (tsc extractor + check-red-references) + house leaf shape
  - phase: 17-01
    provides: check-red-references.mjs Phase-17 RED baseline (message-matrix + vitest file entries + requireFence + Phase-18 deferral guards)
  - phase: 17-03
    provides: testing-stance README nav index + functional-core.md + seams-and-legacy.md sibling leaves (RTR-01 completed by adding message-matrix.md here)
provides:
  - "message-matrix.md: Metz + Owen query/command 6-cell matrix (origin x type); the design-agnostic assert-vs-mock firewall; outgoing command is the one warranted double (expect-to-send)"
  - "vitest-typescript-mechanics.md: Vitest 4.x mapped to RED concepts (it.todo / test.each / vi.* restraint / watch / fail-for-the-right-reason MECHANIC) + brief ADV-01/ADV-02 forward-pointers"
  - "RTR-01 now fully authored (README nav + 3 stance leaves): message-matrix.md is the message-oriented route leaf"
affects: [phase-18-coach-procedure, 17-05-anti-patterns, 17-06-finalize-oracle-reviewer]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "OWNED leaf authored BLIND own-words from RESEARCH planning grain (no .oracle/ read); oracle-reviewer fidelity gate deferred to orchestrator (Plan 17-06)"
    - "tsc-strict Vitest fence with vi.fn() collaborator double asserting an outgoing-command expect-to-send (toHaveBeenCalledWith)"
    - "explicit labeled-tuple cases array ([input: number, expected: boolean][]) so test.each callback params type-check under strict"

key-files:
  created: []
  modified:
    - plugins/lz-tdd/skills/lz-red/references/testing-stance/message-matrix.md
    - plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md

key-decisions:
  - "VIT-02 left Pending, not marked complete: the references-examples clause is satisfied (both fences tsc --strict clean) but the 'throughout SKILL.md' clause is Phase 18 (D-10) -- marking it now would be a false-positive a milestone audit would flag."
  - "RTR-01 marked complete now: message-matrix.md is the third stance leaf; with the 17-03 README nav + functional-core + seams-and-legacy, the testing-stance subdir content is fully authored (17-03 deliberately left RTR-01 Pending awaiting this leaf)."
  - "ASRT-02 already Complete (17-02/17-03); this leaf reinforces it with the state-based (incoming command) + communication-based (outgoing command) sides of the Metz boundary the assertions-slice selection rule points at."

patterns-established:
  - "Owned-attribution parenthetical '(Sandi Metz and Katrina Owen, owned; oracle-verified)' on the distilled firewall line, mirroring naming.md."
  - "vi.* restraint section cross-links by filename to anti-patterns.md (listen-to-the-tests) and message-matrix.md (outgoing-command warranted double)."

requirements-completed: [ASRT-03, RTR-01, VIT-01]

coverage:
  - id: D1
    description: "message-matrix.md -- Metz query/command 6-cell matrix + over-mocking firewall (outgoing command = the one warranted double) + tsc-strict incoming-query/outgoing-command fence"
    requirement: "ASRT-03"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs (message-matrix.md rows all PASS)"
        status: pass
      - kind: automated
        ref: "npm --prefix .claude/skills/lz-red-workspace run typecheck (fence tsc --strict clean)"
        status: pass
      - kind: automated
        ref: "node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs (ASCII + email allowlist + no-verbatim)"
        status: pass
    human_judgment: true
    rationale: "OWNED surface (99 Bottles JS ed) -- DST-04 near-verbatim fidelity is confirmed by the orchestrator oracle-reviewer converge-to-clean gate in Plan 17-06, not by the deterministic scans alone."
  - id: D2
    description: "vitest-typescript-mechanics.md -- Vitest 4.x -> RED-concept mapping + brief ADV-01/ADV-02 forward-pointers + tsc-strict test.each triangulation fence; Phase-18 LAW-02 marker intact"
    requirement: "VIT-01"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs (vitest-typescript-mechanics.md rows all PASS, incl. both cross-refs + Phase-18 marker)"
        status: pass
      - kind: automated
        ref: "npm --prefix .claude/skills/lz-red-workspace run typecheck (7 modules tsc --strict clean)"
        status: pass
    human_judgment: false
  - id: D3
    description: "RTR-01 -- testing-stance subdir now fully authored (README nav + functional-core + message-matrix + seams-and-legacy); message-matrix.md is the message-oriented route leaf"
    requirement: "RTR-01"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs (all four testing-stance/* rows PASS)"
        status: pass
    human_judgment: false

# Metrics
duration: 13min
completed: 2026-07-19
status: complete
---

# Phase 17 Plan 04: Message Matrix & Vitest Mechanics Summary

**Metz query/command 6-cell assert-vs-mock matrix (outgoing command = the one warranted double) plus Vitest 4.x mapped to RED concepts with tsc-strict fences -- closing ASRT-03, RTR-01, and VIT-01.**

## Performance

- **Duration:** ~13 min
- **Started:** 2026-07-19T05:04:23Z
- **Completed:** 2026-07-19T05:17:42Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Authored `message-matrix.md` own-words BLIND from the RESEARCH planning grain (OWNED 99 Bottles JS ed; no `.oracle/` read): the 6-cell origin x type matrix, per-cell assert/mock rules (incoming query -> assert return; incoming command -> assert public side effect; outgoing command -> expect-to-send; outgoing query + self-messages -> do not test), and the explicit over-mocking firewall (the outgoing command is the ONLY warranted double).
- Authored `vitest-typescript-mechanics.md` (no-oracle): `it.todo` = running test list; `test.each`/`it.each` = triangulation; `vi.*` doubles WITH RESTRAINT (cross-linked to `anti-patterns.md` + `message-matrix.md`); watch mode = feedback loop; fail-for-the-right-reason as a Vitest MECHANIC (AssertionError = valid red vs ReferenceError/import = broken harness); brief ADV-01 (`expectTypeOf`/`assertType`) + ADV-02 (`fast-check`) forward-pointers -- no leaves, no dependency.
- Two self-contained tsc --strict Vitest fences: message-matrix's incoming-query return assertion + outgoing-command `vi.fn()` expect-to-send; vitest-mechanics' `test.each` triangulation table. Both compile clean under the pinned typescript 6.0.3 / vitest 4.1.10 extractor (7 modules total GREEN).
- RTR-01 completed (third stance leaf lands on top of the 17-03 README nav + functional-core + seams-and-legacy); ASRT-03 and VIT-01 closed.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author message-matrix.md (Metz query/command matrix, OWNED, own-words)** - `36c9d1d` (feat)
2. **Task 2: Author vitest-typescript-mechanics.md (Vitest 4.x -> RED + ADV pointers)** - `3c924ee` (feat)

**Plan metadata:** committed with this SUMMARY + STATE + ROADMAP + REQUIREMENTS (docs).

## Files Created/Modified

- `plugins/lz-tdd/skills/lz-red/references/testing-stance/message-matrix.md` - Metz + Owen query/command 6-cell matrix + over-mocking firewall + tsc-strict Vitest fence (OWNED, oracle-reviewer gate deferred to 17-06).
- `plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md` - Vitest 4.x -> RED-concept mapping + tsc-strict test.each fence + ADV forward-pointers + Phase-18 LAW-02 marker (no-oracle).

## Decisions Made

- **VIT-02 not marked complete (partial by design).** Both Phase-17 fences are tsc --strict clean, satisfying the "examples throughout the references" half. The "throughout SKILL.md" clause is Phase 18 (D-10 / CONTEXT deferred note), which owns the SKILL.md body and its worked example. Marking VIT-02 fully complete after Phase 17 would be a false-positive, so it stays Pending until the Phase-18 SKILL.md example lands.
- **RTR-01 marked complete.** message-matrix.md is the message-oriented route leaf; with 17-03's README nav index + functional-core.md + seams-and-legacy.md, the `testing-stance/` subdir is now fully authored per the requirement. 17-03 deliberately left RTR-01 Pending precisely because this owned leaf was Plan 17-04.
- **Owned-surface fidelity is deferred, not skipped.** The Metz matrix was authored BLIND own-words (no `.oracle/` read in main context); the DST-04 oracle-reviewer converge-to-clean gate runs at the orchestrator level in Plan 17-06. The deterministic no-verbatim scan passed here as the per-commit backstop.

## Deviations from Plan

None - plan executed exactly as written. (The VIT-02 "mark all plan requirements" step was applied per D-10: VIT-02's SKILL.md clause is a Phase-18 deliverable, so only the three requirements this plan actually closes -- ASRT-03, RTR-01, VIT-01 -- were flipped. This follows the plan's own scope, not a deviation from it.)

## Issues Encountered

None. The one `test.each` strict-typing risk (callback-param contravariance on an array-of-arrays) was avoided up front by declaring the cases table with an explicit labeled-tuple element type (`[input: number, expected: boolean][]`), which pins the callback param types and compiles clean.

## User Setup Required

None - no external service configuration required. No dependency was added (fast-check remains a named-only ADV-02 forward-pointer).

## Next Phase Readiness

- ASRT-03, RTR-01, VIT-01 closed; ASRT-02 reinforced (already Complete).
- The FULL `check-red-references` gate remains RED by design on `anti-patterns.md` only -- Plan 17-05 authors it (Cooper owned + listen-to-the-tests + Test Desiderata). Both this plan's file rows PASS.
- Remaining before the Phase-17 finalize gate (17-06): 17-05 content, then the full battery GREEN + orchestrator oracle-reviewer over the 3 owned surfaces (message-matrix F.I.R.S.T. Cooper) + skill-reviewer + `claude plugin validate .`.
- Phase 18 (coach procedure) will wire the stance router (RTR-02) and the LAW-02 fail-for-the-right-reason procedure into SKILL.md; the Phase-18 marker in vitest-typescript-mechanics.md is intact.

## Self-Check: PASSED

- Files exist: message-matrix.md, vitest-typescript-mechanics.md, 17-04-SUMMARY.md (all FOUND).
- Commits exist: 36c9d1d (Task 1), 3c924ee (Task 2) (both FOUND).
- Gates: typecheck GREEN (7 modules tsc --strict), hygiene GREEN (198 ASCII / no non-allowlisted email / 191 no-verbatim), both file rows PASS in check-red-references (overall RED by design on anti-patterns.md / Plan 17-05). No package.json touched (no dependency added).

---
*Phase: 17-assertion-design-stance-router-ts-vitest-mechanics*
*Completed: 2026-07-19*
