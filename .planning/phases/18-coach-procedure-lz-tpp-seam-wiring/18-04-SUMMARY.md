---
phase: 18-coach-procedure-lz-tpp-seam-wiring
plan: 04
subsystem: testing
tags: [lz-tpp, lz-red, lz-refactor, skill-authoring, cross-skill-seam, SEAM-02]

# Dependency graph
requires:
  - phase: 18-01
    provides: check-red-references.mjs SEAM-02 block reading lz-tpp/SKILL.md for both reverse pointers
provides:
  - lz-tpp/SKILL.md reverse-pointer section naming lz-red (red step) and lz-refactor (refactor step)
  - the red-green-refactor seam fully wired -- all three skills point at each other
affects: [18-05, 18-06, phase-19-ship, lz-red-coach-procedure]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Cross-skill seam pointer from the GREEN vantage, symmetric with the sibling 'vs the green step' sections lz-red and lz-refactor already carry"

key-files:
  created: []
  modified:
    - plugins/lz-tdd/skills/lz-tpp/SKILL.md

key-decisions:
  - "D-09: both reverse pointers (lz-tpp -> lz-red and lz-tpp -> lz-refactor) added in ONE additive edit"
  - "D-10: authored blind own-words; the >= 1-unbiased from-scratch review is an ORCHESTRATOR gate at 18-06, not an executor step; going live needs a human /reload-plugins at Phase-19 ship"
  - "D-12: lz-tpp is EXCLUDED from the no-verbatim scan, so own-words authoring + the D-10 review are the verbatim backstops; ASCII + work-email scans still cover it"

patterns-established:
  - "GREEN-vantage seam section: lz-tpp names the neighboring steps (lz-red, lz-refactor) as pointers, without restating their procedures"

requirements-completed: [SEAM-02]

coverage:
  - id: D1
    description: "lz-tpp/SKILL.md gains one additive red-green-refactor-seam pointer section naming both lz-red (red step) and lz-refactor (refactor step) from the green vantage, own-words + pointer-only"
    requirement: "SEAM-02"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs -> SEAM-02 block PASS (both lz-red AND lz-refactor present in lz-tpp/SKILL.md)"
        status: pass
      - kind: automated
        ref: "node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs -> exit 0 (ASCII + work-email + no-verbatim GREEN)"
        status: pass
      - kind: automated
        ref: "claude plugin validate . -> exit 0"
        status: pass
    human_judgment: true
    rationale: "Own-words / pointer-only fidelity of prose in a SHIPPED skill EXCLUDED from the no-verbatim scan needs the D-10 >= 1-unbiased orchestrator review at 18-06; the deterministic checkers only prove token presence + hygiene, not authoring quality or no-restatement."

# Metrics
duration: ~3min
completed: 2026-07-20
status: complete
---

# Phase 18 Plan 04: lz-tpp Reverse-Pointer Seam (SEAM-02) Summary

**Added one additive red-green-refactor-seam section to the shipped lz-tpp/SKILL.md naming both lz-red (red step) and lz-refactor (refactor step) from the green vantage, wiring all three skills to point at each other.**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-07-20T18:50:10Z
- **Completed:** 2026-07-20T18:51:22Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments
- lz-tpp/SKILL.md now carries a single additive "## The green step vs the red step (lz-red) and the refactor step (lz-refactor)" section: it states lz-tpp is the green / transformation step, points at lz-red for choosing/writing the next failing test, points at lz-refactor for restructuring passing code, and tells the coach to classify the request first (no failing test yet -> lz-red; tests green + cleanup -> lz-refactor; otherwise this skill).
- Closed the carried reverse-pointer tech-debt: with both `lz-tpp -> lz-red` and the deferred `lz-tpp -> lz-refactor` pointers landed in ONE edit, the red-green-refactor seam is fully wired (all three skills reference each other).
- Authored BLIND own-words, pointer-only -- no restatement of lz-red's or lz-refactor's procedures; lz-red and lz-refactor were NOT edited.

## Task Commits

Each task was committed atomically:

1. **Task 1: Add the red-green-refactor-seam reverse-pointer section to lz-tpp/SKILL.md** - `51f76c2` (docs)

**Plan metadata:** (this SUMMARY + STATE.md + ROADMAP.md) - see final docs commit.

## Files Created/Modified
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` - added one additive cross-skill pointer section (heading + one short paragraph, +10 lines) after "## Transformations vs refactorings"; every pre-existing section (frontmatter, modes, transformations-vs-refactorings, amended cycle, coach procedure, heuristic note, reference material) is byte-stable.

## Verification

- **check-red-references.mjs SEAM-02 block:** PASS -- `lz-tpp/SKILL.md: SEAM-02 reverse pointers (lz-red AND lz-refactor)` flipped FAIL -> PASS. Overall checker remains RED by design (closes when 18-05 authors the lz-red SKILL.md coach procedure).
- **check-hygiene.mjs:** exit 0 -- ASCII-only (198 files), no non-allowlisted emails, no verbatim-looking runs (191 files) all GREEN.
- **claude plugin validate .:** exit 0 -- Validation passed.
- **Orchestrator gate (deferred to 18-06):** >= 1 unbiased from-scratch subagent review of this lz-tpp diff (D-10); gsd-executor has no Agent/Task tool, so this is NOT an executor step. Making the edit LIVE is a human `/reload-plugins` at the Phase-19 ship (not a task here).

## Decisions Made
None beyond the plan's locked D-09/D-10/D-12. Placement (after "## Transformations vs refactorings") and heading/phrasing were executor discretion per D-09; a green-vantage heading symmetric with the sibling sections was chosen.

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None. `git commit` ran with hooks (no --no-verify); committer identity was the public gmail; config.json was not touched by the task edit.

## Next Phase Readiness
- SEAM-02 deterministic checker block is GREEN; requirement closure awaits the 18-06 orchestrator review + gsd-verifier.
- 18-05 (lz-red SKILL.md coach procedure) is next and will turn the overall check-red-references gate GREEN.
- The lz-tpp edit is queued for the D-10 unbiased review at 18-06 and the human `/reload-plugins` at Phase-19 ship.

## Self-Check: PASSED

- FOUND: plugins/lz-tdd/skills/lz-tpp/SKILL.md reverse-pointer section (commit 51f76c2, +10 lines)
- FOUND: .planning/phases/18-coach-procedure-lz-tpp-seam-wiring/18-04-SUMMARY.md
- FOUND commit 51f76c2 (Task 1 SKILL.md edit)
- FOUND commit 715ccd7 (docs: SUMMARY + STATE + ROADMAP)
- check-red-references SEAM-02 block PASS; overall exit 1 (RED by design pre-18-05); check-hygiene exit 0; claude plugin validate . exit 0; config.json byte-unchanged

---
*Phase: 18-coach-procedure-lz-tpp-seam-wiring*
*Completed: 2026-07-20*
