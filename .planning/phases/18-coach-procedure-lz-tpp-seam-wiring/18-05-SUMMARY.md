---
phase: 18-coach-procedure-lz-tpp-seam-wiring
plan: 05
subsystem: testing
tags: [lz-red, skill-authoring, coach-procedure, three-laws, testing-stance, VIT-02, SEAM-01, LAW-01, LAW-02, RTR-02]

# Dependency graph
requires:
  - phase: 18-01
    provides: check-red-references.mjs SKILL.md FILES entry (coach-procedure topics + non-ignore ts-fence guard + no-stale-marker guard) and the extract-samples.mjs SKILL.md walk (SKILL-1.ts)
  - phase: 18-02
    provides: three-laws-and-test-selection.md owned Three Laws spine + classify-first the procedure links
  - phase: 18-03
    provides: test-structure-and-assertions.md F.I.R.S.T. baseline + vitest-typescript-mechanics.md right-reason mechanic the procedure links
provides:
  - lz-red/SKILL.md inline 6-step coach decision procedure on the Three Laws spine
  - the ONE VIT-02 tsc-strict Vitest RED worked example (SKILL-1.ts)
  - overall check-red-references.mjs gate flipped GREEN (11/11 surfaces authored)
affects: [18-06, phase-19-ship, phase-20-evals]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SKILL.md = orchestration; references = content -- the coach procedure links file-level to the leaves and never restates them (lz-refactor / lz-tpp precedent)"
    - "VIT-02 valid RED depicted as a compiling stub returning the wrong value (runtime AssertionError), not a missing symbol and not a ts-ignore fence, so tsc --strict stays clean while the assertion is genuinely red"

key-files:
  created: []
  modified:
    - plugins/lz-tdd/skills/lz-red/SKILL.md

key-decisions:
  - "D-01/D-02: procedure authored INLINE in SKILL.md (not a new leaf) as a compact numbered decision tree in ROADMAP SC1-3 order"
  - "D-03/SEAM-01: step 1 classifies RED/GREEN/REFACTOR and reuses the existing RED-vs-green-step section; step 6 is the forward lz-tpp handoff (Law 3)"
  - "D-04/LAW-01: SKILL.md carries only the compact Law 1 / Law 2 / Law 3 spine and links the owned leaf"
  - "D-06/D-07/RTR-02: step 3 detects the house idiom, routes the stance via testing-stance/README.md, states the route, and honors a natural-language override (no CLI flag)"
  - "D-08/LAW-02: step 5 confirms fail-for-the-right-reason (AssertionError, F.I.R.S.T. baseline) before the handoff; the coach questions, does not run the suite"
  - "D-11: one tsc-strict Vitest worked example (compiling wrong-value stub) walks the RED path"
  - "D-14: all Phase-18 deferral markers removed; closing paragraph coaches (QUESTION vs COMMAND), it does not drive"

patterns-established:
  - "6-step RED coach procedure mirrors the shipped lz-refactor (6-step) and lz-tpp (7-step) inline precedents: classify-first, numbered steps, file-level cross-links, coach-by-default close"

requirements-completed: [LAW-01, LAW-02, RTR-02, SEAM-01, VIT-02]

coverage:
  - id: D1
    description: "lz-red/SKILL.md carries the inline 6-step coach decision procedure on the Three Laws spine (classify-first, stance routing with natural-language override, fail-for-the-right-reason before the forward lz-tpp handoff, coach-not-drive close), file-level linked to the leaves without restatement"
    requirement: "LAW-01, LAW-02, RTR-02, SEAM-01"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs -> SKILL.md entry all topics PASS (classify-first, Three Laws spine, stance routing, house idiom, natural-language override, fail-for-the-right-reason, forward lz-tpp handoff) + no-stale-marker + no scaffold; overall RED-REFS GREEN exit 0"
        status: pass
      - kind: automated
        ref: "node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs -> exit 0 (ASCII + work-email + no-verbatim GREEN)"
        status: pass
      - kind: automated
        ref: "claude plugin validate . -> exit 0"
        status: pass
    human_judgment: true
    rationale: "Own-words / no-restatement fidelity, coach-don't-drive framing, and the natural-language-override handling are quality properties the deterministic checker only proxies via token presence; the D-10 >= 1-unbiased orchestrator skill-review at 18-06 confirms them."
  - id: D2
    description: "ONE tsc-strict Vitest RED worked example (a compiling stub returning the wrong value) walks the RED path end to end; it is not a missing symbol and not a ts-ignore fence"
    requirement: "VIT-02"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs -> SKILL.md >= 1 non-ignore ts fence PASS"
        status: pass
      - kind: automated
        ref: "npm --prefix .claude/skills/lz-red-workspace run typecheck -> exit 0, SKILL-1.ts among 8 compiled modules, tsc --strict --noEmit clean"
        status: pass
    human_judgment: false
    rationale: "Fully deterministic: the fence extracts as SKILL-1.ts, the tsc --strict extractor compiles it, and the non-ignore-fence guard proves it is a bare ts fence with real coverage."

# Metrics
duration: ~2min
completed: 2026-07-20
status: complete
---

# Phase 18 Plan 05: lz-red Coach Decision Procedure + VIT-02 Worked Example Summary

**Replaced the Phase-18 placeholder in lz-red/SKILL.md with the real inline 6-step coach decision procedure on the Three Laws spine (classify-first, stance routing with a natural-language override, fail-for-the-right-reason before the forward lz-tpp handoff, coach-not-drive close) plus ONE tsc-strict Vitest RED worked example, flipping the overall check-red-references gate GREEN.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-07-20T18:57:38Z
- **Completed:** 2026-07-20T18:59:39Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Authored the inline `## Coach decision procedure` -- a compact 6-step numbered decision tree in ROADMAP SC1-3 order: (1) classify RED / GREEN / REFACTOR against the lz-tpp and lz-refactor seams; (2) hold the Three Laws spine (Law 1 gates entry, Law 2 sizes the test, Law 3 is step 6); (3) detect the house test idiom, route the stance via the testing-stance route table, state the route, and honor a natural-language override; (4) structure the test and assert observable behavior; (5) confirm it fails for the right reason (AssertionError, F.I.R.S.T. baseline, coach questions rather than runs the suite); (6) forward handoff to lz-tpp (Law 3).
- Every step links file-level to the leaf that carries the detail (three-laws-and-test-selection.md, testing-stance/README.md, test-structure-and-assertions.md, vitest-typescript-mechanics.md) and never restates it -- SKILL.md stays orchestration.
- Added the closing "Coach by default; hand off, do not drive." paragraph distinguishing a QUESTION (present the next test and smallest move; do not edit tests or run the suite unasked) from an explicit COMMAND (write the failing test, then stop; making it pass is lz-tpp).
- Added the ONE VIT-02 worked example: an `applyDiscount` Vitest test asserting a 10%-off total of 90, backed by a compiling production stub that returns the untouched total. It compiles tsc --strict clean and fails at runtime with an AssertionError -- the LAW-02 "right reason" -- and it is neither a missing symbol nor a `ts ignore` fence.
- Rewrote the Coach-mode bullet to point at the now-present procedure and removed all three Phase-18 deferral markers; the frontmatter description, Two modes, RED-vs-green-step, Listen-to-the-tests, and Reference material sections are otherwise byte-stable.

## Task Commits

Each task was committed atomically:

1. **Task 1: Replace the placeholder with the inline 6-step coach decision procedure** - `25c4c5c` (feat)
2. **Task 2: Add the VIT-02 tsc-strict Vitest worked example** - `7f0e914` (feat)

**Plan metadata:** (this SUMMARY + STATE.md + ROADMAP.md) - see final docs commit.

## Files Created/Modified
- `plugins/lz-tdd/skills/lz-red/SKILL.md` - replaced the `## Coach decision procedure (deferred to Phase 18)` placeholder (7 lines) with the real 6-step procedure + worked example + closing paragraph (~75 lines), and rewrote the Coach-mode bullet parenthetical. Grew from 81 to 147 lines (well under the ~200 target and the 500 cap).

## Verification

- **check-red-references.mjs:** overall `SUMMARY: RED-REFS GREEN` exit 0 -- 11/11 lz-red surfaces authored. The SKILL.md entry PASSes every coach-procedure topic (classify-first, Three Laws spine, stance routing, house test idiom, natural-language override, fail-for-the-right-reason, forward lz-tpp handoff), the `>= 1 non-ignore ts fence` guard, the no-scaffold-phrase guard, and the no-stale-Phase-18-marker guard; the D-05 provenance-honesty gate and the SEAM-02 lz-tpp reverse-pointer block still PASS.
- **npm run typecheck (extract-samples.mjs):** exit 0 -- 8 modules extracted (up from 7), SKILL-1.ts among them, tsc --strict --noEmit clean, 0 fences skipped.
- **check-hygiene.mjs:** exit 0 -- ASCII-only (198 files), no non-allowlisted emails, no verbatim-looking runs (191 files) all GREEN.
- **claude plugin validate .:** exit 0 -- Validation passed.
- **Orchestrator gate (deferred to 18-06):** >= 1 unbiased from-scratch subagent skill-review of the coach procedure (coach-don't-drive QUESTION vs COMMAND, natural-language override honored, no leaf content restated, the 6-step Three Laws spine present). gsd-executor has no Agent/Task tool, so this is NOT an executor step.

## Decisions Made
None beyond the plan's locked D-01..D-14. Executor discretion was exercised on the exact own-words wording of the six steps, the routing/override phrasing, and the concrete worked example (`applyDiscount` returning the untouched total), all within D-11 + tsc --strict.

## Deviations from Plan
None - plan executed exactly as written.

## Issues Encountered
None. `git commit` ran with hooks (no --no-verify) on the main working tree (branch gsd/lz-tdd-0.0.3-lz-red, no branch switch); committer identity is the public gmail; config.json was not touched.

## Next Phase Readiness
- The overall check-red-references gate is now GREEN -- this wave's stated job is done; all downstream deterministic gates (typecheck, hygiene, plugin validate) pass.
- 18-06 (finalize) runs the orchestrator gates: the D-10 >= 1-unbiased skill-review of the lz-red coach procedure AND the queued lz-tpp reverse-pointer review, plus gsd-verifier for goal achievement.
- Making the shipped-skill edits LIVE is a human `/reload-plugins` at the Phase-19 ship (not a task here).

## Self-Check: PASSED

- FOUND: plugins/lz-tdd/skills/lz-red/SKILL.md coach procedure + VIT-02 example (147 lines)
- FOUND: .planning/phases/18-coach-procedure-lz-tpp-seam-wiring/18-05-SUMMARY.md
- FOUND commit 25c4c5c (Task 1: inline coach procedure)
- FOUND commit 7f0e914 (Task 2: VIT-02 worked example)
- check-red-references overall exit 0 (GREEN); typecheck exit 0 (SKILL-1.ts compiled, 8 modules); check-hygiene exit 0; claude plugin validate . exit 0; config.json byte-unchanged

---
*Phase: 18-coach-procedure-lz-tpp-seam-wiring*
*Completed: 2026-07-20*
