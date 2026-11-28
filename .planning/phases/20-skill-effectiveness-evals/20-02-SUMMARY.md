---
phase: 20-skill-effectiveness-evals
plan: 02
subsystem: testing
tags: [grade-run, evl-02, lz-red, phrase-set, negation-aware, occursAffirmed, red-behavior-rubric]

# Dependency graph
requires:
  - phase: 20-skill-effectiveness-evals
    provides: 20-01 vendored the eval harness + merge-judge + check-evals into lz-red-workspace (this plan's grader plugs into that grade -> judge -> merge -> aggregate chain)
  - phase: 11-skill-effectiveness-evals
    provides: the lz-refactor grade-run.mjs skeleton (kept verbatim) and grade-reference.mjs occursAffirmed (borrowed)
  - phase: 18-red-coach-procedure
    provides: the shipped lz-red SKILL.md 6-step coach procedure + the reference leaves that are the ground truth for the RED scenarios and the rubric dimensions
provides:
  - grade-run.mjs rewritten as the D-05-RUBRIC per-dimension hybrid grader (RED phrase-set matchers + borrowed negation-aware occursAffirmed + 2-dimension LLM judge + fail-closed preliminary + selfcheck with alignment gate)
  - evals/evals.json with 10 leaf-grounded RED-situation scenarios (skill_name lz-red, ids 0-9, expectations count-aligned 1:1 with RUBRICS)
affects: [20-03-finalize-gated-run]

# Tech tracking
tech-stack:
  added: []  # no new packages; borrowed logic from the on-disk lz-refactor rig, workspace devDeps pre-exist
  patterns:
    - "Per-dimension hybrid RED rubric: six mechanical dimensions scripted (phraseSet/nodrive), two judgment dimensions delegated to the LLM judge"
    - "Negation-aware phrase matching (occursAffirmed) on every RED phrase, never a bare regex.test (Pitfall 6 / CR-01)"
    - "Judge locked to exactly two dimensions (right-next-test, behavior-not-implementation); selfcheck enforces <=2 judge checks per scenario"
    - "RUBRICS <-> evals.json count-alignment gate as the RED->GREEN instrument-before-data signal (Pitfall 5)"

key-files:
  created:
    - .claude/skills/lz-red-workspace/grade-run.mjs
    - .claude/skills/lz-red-workspace/evals/evals.json

key-decisions:
  - "Kept the skill-agnostic skeleton byte-verbatim (toolDrive/grade/finalOutPath/parseArgs/main + the judge+nodrive scoreCheck branches); verified absent from a diff against the lz-refactor analog"
  - "Borrowed occursAffirmed + clause helpers from grade-reference.mjs, renamed nameRe->phraseRe (satisfies the 'refactoring-name model removed' gate while reusing the proven negation logic)"
  - "Authored 10 scenarios (target 8-10): coach-behavior split into a QUESTION variant (7) and a COMMAND variant (8) to exercise both halves of the coach-by-default clause"
  - "EVL-02 NOT marked complete: build-only plan; the with-skill-vs-baseline behavior measurement closes only after the user-gated run (20-03), mirroring 20-01 / the Phase-11 11-02 precedent"

patterns-established:
  - "phraseSet check kind: SCORED PASS if the response AFFIRMS any literal phrase in the set via occursAffirmed (the RED analog of lz-refactor's candidateSet)"
  - "Judge strings live only in RUBRICS (merge-judge byte-matches judge_required from grading.preliminary.json, WR-01); evals.json expectations are free-form and only count-aligned"

requirements-completed: []  # EVL-02 grader + scenarios built; the requirement closes after the user-gated behavior run in 20-03

coverage:
  - id: G1
    description: "grade-run.mjs is a valid D-05-RUBRIC hybrid grader: RED phrase-set matchers routed through the borrowed negation-aware occursAffirmed; refactoring name+layer model removed; judge locked to two dimensions"
    requirement: "EVL-02"
    verification:
      - kind: unit
        ref: "node --check grade-run.mjs (exit 0); rg occursAffirmed=18, NEG|hedgedContrastive=8, phraseSet=35, nameRe|NAME_LAYERS|layersInResponse|FOWLER|KERIEVSKY=0"
        status: pass
      - kind: other
        ref: "diff vs lz-refactor analog: toolDrive/grade/finalOutPath/parseArgs/main + the judge+nodrive branches absent from the diff (kept byte-verbatim)"
        status: pass
    human_judgment: false
  - id: G2
    description: "grade-run.mjs --selfcheck: RED baseline before data (alignment gate fails closed on the absent evals.json), then GREEN after Task 2 (alignment + phraseSet-empty + negation-rejection + judge-count <=2 fixtures all pass)"
    requirement: "EVL-02"
    verification:
      - kind: unit
        ref: "node grade-run.mjs --selfcheck: exit 1 at Task 1 (evals.json absent) -> exit 0 at Task 2"
        status: pass
    human_judgment: false
  - id: G3
    description: "evals/evals.json holds 10 RED-situation scenarios (skill_name lz-red, ids 0-9 contiguous), spanning all four assertion stances + the required classify-first boundary, expectations count-aligned 1:1 with RUBRICS [4,3,5,4,4,4,4,3,3,4]"
    requirement: "EVL-02"
    verification:
      - kind: unit
        ref: "node grade-run.mjs --selfcheck (alignment gate, exit 0); rg: output-based/communication/state/characterization each >=1; classify-first present"
        status: pass
    human_judgment: false
  - id: G4
    description: "committed grader + scenarios are ASCII-only and email-allowlist clean (T-20-01/T-20-02)"
    requirement: "EVL-02"
    verification:
      - kind: unit
        ref: "hygiene scan (ASCII + allowlist-inversion) on both files exit 0; plan's exact node -e byte scan prints evals-hygiene-ok"
        status: pass
    human_judgment: false

# Metrics
duration: ~20min
completed: 2026-07-21
status: complete
---

# Phase 20 Plan 02: EVL-02 RED-Behavior Grader Build Summary

**Rewrote grade-run.mjs into the D-05-RUBRIC per-dimension hybrid grader (deterministic RED phrase-set matchers routed through the borrowed negation-aware occursAffirmed, plus a two-dimension LLM judge) and authored 10 leaf-grounded RED-situation scenarios in evals/evals.json -- all build-time, zero metered spend (D-11).**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-07-21
- **Tasks:** 2
- **Files modified:** 2 (both created)

## Accomplishments
- Rewrote grade-run.mjs keeping the skill-agnostic control skeleton byte-verbatim (toolDrive/nodrive detection, grade(), finalOutPath() fail-closed, parseArgs()/main(), and the judge+nodrive branches of scoreCheck) -- confirmed by diffing against the lz-refactor analog: every kept function is absent from the diff.
- Replaced the refactoring name+layer model (nameRe / NAME_LAYERS / FOWLER / KERIEVSKY / KERIEVSKY_AWAY / FUNCTIONAL / layersInResponse) with a RED per-dimension phrase-set model and a new `phraseSet` check kind (SCORED PASS if the response affirms any in-set phrase).
- Borrowed the negation-aware occursAffirmed() + its clause helpers (NEG / CONTRAST / FWD_BOUNDARY / HEDGE / CONTRAST_FWD, clauseBefore / clauseAfter / sentenceAround / hedgedContrastive) from grade-reference.mjs, renamed nameRe->phraseRe; EVERY RED phrase runs through it, so a negated or contrastive phrase ("assert the returned value, NOT the private field"; "this is NOT a false green"; "do NOT mock the query") is not credited (Pitfall 6 / CR-01).
- Built RUBRICS[0-9] as a per-dimension keyed object mixing {phraseSet, text}, {judge}, and {nodrive:true}, count-aligned 1:1 with evals.json expectations; the LLM judge is locked to EXACTLY the two judgment dimensions (right-next-test, behavior-not-implementation) and the selfcheck enforces <=2 judge checks per scenario.
- Extended the selfcheck with RED matcher/negation fixtures (a negated phrase is provably not credited), a phraseSet-non-empty gate, the judge-count gate, and the kept RUBRICS<->evals.json count-alignment gate (which reads evals.json by the script's own path) -- exits RED before the data and GREEN after.
- Authored evals/evals.json (skill_name lz-red) with 10 RED-situation scenarios grounded in the shipped lz-red leaves: starter case (three-laws sumOf), triangulation (isEven), the four assertion stances (output/functional-core, communication/message-matrix outgoing command + over-mock, state/incoming command, characterization/seams-and-legacy), fail-for-the-right-reason (false green), coach-not-drive QUESTION + COMMAND variants, and the required classify-first boundary. Weighted toward the discriminating cases (over-mock, false-green, classify-first) given baseline saturation (A7).

## Task Commits

Each task was committed atomically:

1. **Task 1: Rewrite grade-run.mjs into the D-05-RUBRIC RED hybrid grader (RED baseline)** - `3ccdcb0` (feat)
2. **Task 2: Author evals/evals.json (10 leaf-grounded RED scenarios); flip selfcheck GREEN** - `07986d2` (feat)

**Plan metadata:** (this SUMMARY + STATE.md + ROADMAP.md) committed separately.

## Files Created/Modified
- `.claude/skills/lz-red-workspace/grade-run.mjs` - the EVL-02 RED grader (HEAVY REWRITE: skeleton kept verbatim; RED phrase-set matchers + borrowed occursAffirmed + RUBRICS[0-9] + 2-dimension judge + selfcheck with alignment + negation fixtures)
- `.claude/skills/lz-red-workspace/evals/evals.json` - 10 leaf-grounded RED-situation scenarios (skill_name lz-red, ids 0-9, expectations count-aligned 1:1 with RUBRICS)

## Decisions Made
- **Kept the skeleton byte-verbatim:** toolDrive/grade/finalOutPath/parseArgs/main + the judge+nodrive scoreCheck branches are absent from a diff against the lz-refactor analog. Only the skill-specific regions (header, matcher, RUBRICS, the phraseSet branch, selfcheck fixtures, usage string, export) changed.
- **Borrowed matcher renamed nameRe->phraseRe:** reuses the proven negation-aware logic from grade-reference.mjs while satisfying the "refactoring-name model removed" gate (rg for nameRe|NAME_LAYERS|layersInResponse|FOWLER|KERIEVSKY returns 0). The rename is also semantically accurate -- it matches RED phrases, not refactoring names.
- **10 scenarios, coach-behavior split QUESTION+COMMAND:** the plan's target is 8-10; splitting the coach-behavior scenario into a QUESTION variant (present the test, do not edit/run) and a COMMAND variant (write the test then stop, hand green to lz-tpp) exercises both halves of the coach-by-default clause. Within Claude's discretion (D-06 / research Q2).
- **EVL-02 left OPEN:** this is a build-only plan (D-11); the requirement's with-skill-vs-baseline behavior measurement closes only after the user-gated run (20-03). Mirrors 20-01 (EVL-01) and the Phase-11 11-02 precedent.

## Deviations from Plan

None substantive - plan executed as written. One honest process note: the plan suggests `cp` to seed then a heavy rewrite. The grader was seeded via `cp` from the lz-refactor analog (so the skeleton was never hand-retyped), then rewritten via a single Write; the kept skeleton was then verified byte-identical to the analog by diff (every kept function absent from the diff). Net effect is identical to a cp+edit: the verbatim skeleton is provably preserved.

## Issues Encountered
None. The only "failure" was the intended Task-1 RED baseline: grade-run --selfcheck exits non-zero while evals.json is absent (the alignment gate fails closed), proving the instrument is wired before the data. Task 2 turned it GREEN.

## User Setup Required
None - no external service configuration. The metered EVL-02 behavior RUN (subagent fan-out + LLM judge across scenarios x with-skill/baseline x >=3 runs) is user-gated and presented in 20-03 (D-11); nothing metered ran in this plan.

## Next Phase Readiness
- The EVL-02 grader + scenarios are complete and GREEN under the deterministic battery; 20-03 (finalize battery + present the exact ready-to-run gated commands + HALT) can proceed.
- Known limitation carried to the run (not a stub): the text-only subagent harness gives the coach no edit tools, so `nodrive` is a fail-SAFE placeholder (as in Phase 11); the real coach-vs-drive signal for the COMMAND variant is the judge dimension (writes the test then stops, does not drive to green). Documented for EVAL-RESULTS.md in 20-03.
- SATURATION WARNING (A7) stands: claude-opus-4-8 is likely to saturate most leaf-sourced scenarios; the discriminating signal concentrates in the classify-first boundary, over-mock, and false-green cases. This is an eval-design limitation to DOCUMENT in 20-03, not to tune away.

## Self-Check: PASSED

- Both created files exist on disk: grade-run.mjs, evals/evals.json.
- Both task commits exist in history: 3ccdcb0 (grade-run.mjs), 07986d2 (evals.json).
- Deterministic build gates GREEN: node --check grade-run.mjs exit 0; grade-run --selfcheck exit 0; evals.json schema (skill_name lz-red, 10 evals, ids 0-9, expectations [4,3,5,4,4,4,4,3,3,4]); hygiene (ASCII + email-allowlist) clean on both files; adjacent gates unregressed (merge-judge --selfcheck, check-evals, check-red-references all exit 0).
- Nothing metered ran (no claude -p / run_eval / subagent). SUMMARY is ASCII-only and email-allowlist clean.

---
*Phase: 20-skill-effectiveness-evals*
*Completed: 2026-07-21*
