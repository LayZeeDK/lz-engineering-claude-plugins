---
phase: 14-compare-lz-refactor-to-mattpocock-skills-code-review-skill-k
plan: 02
subsystem: testing
tags: [eval, e2e, lz-refactor, code-review, prompts, measurement-validity]

# Dependency graph
requires:
  - phase: 14-01
    provides: code_review arm + synthetic whole-file-diff base (D-02) + suite.json prompt-entry shape
  - phase: 11
    provides: e2e-nx + e2e-gilded-rose suite/prompts/targets scaffolding reused for the cr-* queries
provides:
  - Three report-framed, non-leading, read-only cr-* lz-refactor queries pointing at the exact single files code-review reviews (D-08)
  - suite.json wiring in both suites (cr-emb -> T1, cr-rlu -> T3, cr-gr -> G1)
  - Subagent-review clearance (>= 2 reviewers, >= 1 unbiased from-scratch; both PASS) proving the queries are non-leading before any spend (T-14-06)
affects: [14-04, 14-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Equal-input/equal-framing comparison: report-mode lz-refactor query mirrors code-review's Standards-axis output contract (surface smells + named fixes, read-only) so the two skills do the same work"
    - "invoke_skill arm prepends /lz-tdd:lz-refactor at composePrompt time; prompt bodies stay framing-only (no slash command in the body)"
    - "Prompt-review discipline: >= 2 subagents, >= 1 unbiased from-scratch, before any metered run"

key-files:
  created:
    - .claude/skills/lz-refactor-workspace/e2e-nx/prompts/cr-enforce-module-boundaries.md
    - .claude/skills/lz-refactor-workspace/e2e-nx/prompts/cr-runtime-lint-utils.md
    - .claude/skills/lz-refactor-workspace/e2e-gilded-rose/prompts/cr-gilded-rose.md
  modified:
    - .claude/skills/lz-refactor-workspace/e2e-nx/suite.json
    - .claude/skills/lz-refactor-workspace/e2e-gilded-rose/suite.json

key-decisions:
  - "D-08: report/recommend-oriented lz-refactor queries mirror code-review's review-these-files framing, point at the SAME files, invoke_skill prepends the slash command, read-only; subagent-reviewed (incl. unbiased) before any run"
  - "Prompt bodies byte-identical across all 3 targets except the path -- no per-target leading phrasing possible"
  - "No prompt edits: both reviewers returned PASS, zero leading-language / read-only defects; the single non-blocking note is a phase-design concern (whole-file scope + RESULTS framing), not a prompt fix"

patterns-established:
  - "Report-mode cr-* query template: Review <path>. The tests are green. Surface the code smells you see and the named refactorings you would recommend for each. Do not edit anything."

requirements-completed: [D-08]

# Metrics
duration: ~8min
completed: 2026-07-15
---

# Phase 14 Plan 02: Report-framed cr-* lz-refactor queries Summary

**Three byte-identical (path aside), non-leading, read-only report-mode `/lz-tdd:lz-refactor` queries pointing at the exact files code-review reviews, wired into both suites and cleared by two subagent reviews (one unbiased) with zero prompt defects (D-08).**

## Performance

- **Duration:** ~8 min
- **Completed:** 2026-07-15T11:23:12Z
- **Tasks:** 2
- **Files modified:** 5 (3 created, 2 modified)

## Accomplishments
- Authored three report-framed cr-* prompts (`cr-enforce-module-boundaries.md`, `cr-runtime-lint-utils.md`, `cr-gilded-rose.md`), each a single framing sentence pointing at one target file, read-only, naming no expected smell/refactoring/pattern.
- Wired matching `suite.json.prompts` entries: e2e-nx `cr-emb -> T1` and `cr-rlu -> T3` (the runtime-lint file carries both T3 and T4 smells; grading references both), e2e-gilded-rose `cr-gr -> G1`.
- Cleared the queries through two subagent reviews (>= 1 unbiased from-scratch), both PASS, so they are provably non-leading before any metered spend (mitigates T-14-06).

## Task Commits

Each task was committed atomically:

1. **Task 1: Author cr-* prompts + suite.json entries** - `f5f7f1d` (feat)
2. **Task 2: Subagent review of the cr-* prompts (incl. unbiased)** - no code change (review-only; both PASS, no prompt edits required)

**Plan metadata:** this commit (docs: complete plan)

## Files Created/Modified
- `.claude/skills/lz-refactor-workspace/e2e-nx/prompts/cr-enforce-module-boundaries.md` - report-framed lz-refactor query for the nx Long-Function/Conditional-Complexity target (T1: `packages/eslint-plugin/src/rules/enforce-module-boundaries.ts`)
- `.claude/skills/lz-refactor-workspace/e2e-nx/prompts/cr-runtime-lint-utils.md` - report-framed query for the nx functional/FP loop target (T3/T4: `packages/eslint-plugin/src/utils/runtime-lint-utils.ts`)
- `.claude/skills/lz-refactor-workspace/e2e-gilded-rose/prompts/cr-gilded-rose.md` - report-framed query for the kata pattern-directed target (G1: `app/gilded-rose.ts`)
- `.claude/skills/lz-refactor-workspace/e2e-nx/suite.json` - added `cr-emb`/`cr-rlu` prompt entries
- `.claude/skills/lz-refactor-workspace/e2e-gilded-rose/suite.json` - added `cr-gr` prompt entry

## Subagent Review Outcome (Task 2)

Two review subagents ran on the three cr-* prompt bodies (satisfies the >= 2 reviewers / >= 1 unbiased requirement, mitigating T-14-06):

1. **Unbiased reviewer (from-scratch, no prior findings): VERDICT PASS.** Confirmed the prompts are byte-identical across the 3 targets except the path; read-only ("Do not edit anything"); name NO specific smell/refactoring/pattern/idiom/catalog; target paths reused verbatim from the validated Phase 11-13 corpus. Raised one optional-only (non-blocking) tightening -- rephrase "Surface the code smells you see" -> "Surface any code smells present (note if you find none)" to drop the non-empty presupposition -- but judged the current wording defensible because the targets are known-smelly and code-review's Standards axis presupposes the same, so no arm gains an advantage. NOT required; not applied.
2. **Measurement-validity reviewer: VERDICT PASS on all 4 criteria** (equal-work framing, no primed vocabulary, no apply/drive leakage, consistency). Confirmed the prompts mirror code-review's Standards-axis output contract (surface smells + named fixes, read-only).

Both reviewers independently raised the SAME non-blocking design note (a phase-design concern, already covered; NOT a prompt fix): the `code_review` arm must be fed the SAME whole-file scope -- which D-02's synthetic whole-file-diff baseline (built in 14-01) already guarantees -- and 14-RESULTS.md (14-05) should state that both arms were asked for named fixes so the vocabulary-breadth result reads as the intended D-04 finding.

**Conclusion:** Task 2 acceptance MET (>= 2 reviewers, >= 1 unbiased, both PASS, zero leading-language / read-only defects). No prompt bodies edited. The two non-blocking notes are forwarded to 14-05 below.

## Notes Forwarded to 14-05
- **Whole-file scope parity:** ensure the `code_review` arm reviews the SAME whole-file scope the cr-* queries target; already guaranteed by D-02's synthetic whole-file-diff baseline (14-01). No action needed unless the base build regresses.
- **RESULTS framing:** 14-RESULTS.md should state that BOTH arms were asked for named fixes, so any vocabulary-breadth difference reads as the intended D-04 tool/output finding rather than an artifact of asymmetric prompting.

## Decisions Made
- Kept prompt bodies framing-only and byte-identical except the path; the invoke_skill arm supplies the `/lz-tdd:lz-refactor` prefix at composePrompt time. This makes any per-target bias structurally impossible and keeps the read-only report contract identical to code-review's Standards axis (D-08).
- Applied no reviewer suggestions: both were non-blocking (one optional prompt tightening, one phase-design note), and applying the optional rephrase was not required and would not change measurement validity.
- Requirements for this plan are **phase decision ids (D-01 equal-input framing context, D-08 the query-authoring decision), not REQUIREMENTS.md ids** -- Phase 14 locks its scope via decisions, so `requirements-completed` records the plan's frontmatter `D-08`.

## Deviations from Plan

None - plan executed exactly as written. Task 2's review returned PASS with no defects, so the plan's "apply any flagged fixes and re-review" branch was not exercised (no fixes were flagged).

## Issues Encountered
None.

## User Setup Required
None - no external service configuration required. No metered `claude -p` run occurred in this plan (the D-12 spend gate lives in 14-04).

## Next Phase Readiness
- Three review-cleared, non-leading, report-framed cr-* prompts are wired into both suites and compose under invoke_skill with the `/lz-tdd:lz-refactor` prefix -- ready for the Wave-1 gated runs (14-04).
- 14-03 (grading scaffolding) and 14-04 (metered runs) can proceed; the two forwarded notes are for 14-05 (RESULTS framing) and are non-blocking.

## Self-Check: PASSED

- FOUND: `.claude/skills/lz-refactor-workspace/e2e-nx/prompts/cr-enforce-module-boundaries.md`
- FOUND: `.claude/skills/lz-refactor-workspace/e2e-nx/prompts/cr-runtime-lint-utils.md`
- FOUND: `.claude/skills/lz-refactor-workspace/e2e-gilded-rose/prompts/cr-gilded-rose.md`
- FOUND: suite.json entries `cr-emb`/`cr-rlu` (e2e-nx) and `cr-gr` (e2e-gilded-rose)
- FOUND commit: `f5f7f1d`

---
*Phase: 14-compare-lz-refactor-to-mattpocock-skills-code-review-skill-k*
*Completed: 2026-07-15*
