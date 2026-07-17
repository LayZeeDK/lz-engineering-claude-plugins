---
phase: 03-lz-tpp-skill-authoring
plan: 01
subsystem: skill-authoring
tags: [claude-code-skill, agent-skills, tpp, progressive-disclosure, dual-mode, frontmatter]

# Dependency graph
requires:
  - phase: 02-tpp-source-distillation
    provides: "LOCKED references/transformations.md (canonical 14-item list, provenance, RGR, hedges) that reference mode explains from"
  - phase: 03-lz-tpp-skill-authoring (wave 1, plans 03-02/03-03)
    provides: "references/fibonacci-worked-example.md and references/typescript-and-tco.md that SKILL.md points at"
provides:
  - "Lean dual-mode SKILL.md: coach mode (failing test + code -> named next transformation) and reference mode (explain TPP + ordering from transformations.md)"
  - "7-step coach decision procedure with impasse/backtrack heuristic (Word Wrap illustration)"
  - "Scoped third-person triggering description (750 chars) that fires on TDD/red-green-refactor/TPP/transformation-priority contexts, not generic coding"
  - "One-level-deep progressive-disclosure pointer block wiring all three reference files"
affects: [04-distribution, 05-evals]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Progressive disclosure: lean SKILL.md body (< 500 lines) + heavy material in references/ reached one level deep"
    - "Dual-mode skill on default frontmatter (no disable-model-invocation/user-invocable): auto-triggers as coach, user-invocable as reference"
    - "Coach decision procedure as a 'workflow for Skills without code' numbered algorithm"
    - "Line-wrap-aware phrasing: keep phrase-presence-checked strings on a single line so line-oriented rg gates match (Phase 2 lesson)"

key-files:
  created: []
  modified:
    - "plugins/lz-tdd/skills/lz-tpp/SKILL.md - replaced Phase-1 placeholder with the real dual-mode skill"

key-decisions:
  - "Kept the full 7-step coach procedure in the SKILL.md body (RESOLVED Open Question 2); body stayed at 87 lines / 702 words, well under budget, so no offload to a references/ file was needed"
  - "Wrote the description with a YAML folded block scalar (>-) at 750 chars; scoped posture only, empirical tuning deferred to Phase 5"
  - "Task 2 recorded as a verified-no-op (Phase 2 pattern): every gate passed on the first pass, so no forced no-op edit/commit"

patterns-established:
  - "Verified-no-op verification task: record passing gates in SUMMARY rather than forcing an empty commit"
  - "Work-email allowlist gate that never spells the private literal (enumerate emails, filter the public gmail, assert empty remainder)"

requirements-completed: [SKILL-01, SKILL-02, SKILL-03, SKILL-04, SKILL-05, SKILL-06]

# Metrics
duration: ~20min
completed: 2026-07-02
---

# Phase 3 Plan 01: Dual-Mode lz-tpp SKILL.md Summary

**Lean dual-mode lz-tpp SKILL.md: an auto-triggering TPP coach (7-step decision procedure + impasse/backtrack) and an on-demand reference, on default frontmatter with a 750-char scoped description and one-level-deep pointers to all three reference files.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-07-02T10:05Z (approx)
- **Completed:** 2026-07-02T10:25Z
- **Tasks:** 2 (1 authoring + 1 verification)
- **Files modified:** 1

## Accomplishments
- Replaced the deliberately-inert Phase-1 placeholder with the real dual-mode skill that both auto-triggers as a coach and serves the reference explanation on explicit `/lz-tdd:lz-tpp` invocation.
- Embedded the concrete 7-step coach decision procedure (confirm green phase -> enumerate -> classify/map -> name highest-priority -> apply TS/JS overlay -> impasse check -> show, don't drive) with the Word Wrap impasse/backtrack heuristic.
- Authored a scoped, third-person triggering description (750 chars, well under the 1024 cap) that fires on TDD/transformation-priority/TPP contexts and explicitly excludes generic coding requests.
- Wired progressive disclosure: the body carries only the operational summary + one-line distinctions/overlay and points one level deep at transformations.md, fibonacci-worked-example.md, and typescript-and-tco.md.
- Passed the full mechanical gate battery and both `claude plugin validate ./plugins/lz-tdd` and `claude plugin validate .` (exit 0).

## Task Commits

Each task was committed atomically:

1. **Task 1: Author the lean dual-mode SKILL.md (frontmatter + body)** - `b7267c4` (feat)
2. **Task 2: Full mechanical + hygiene verification of SKILL.md and the skill tree** - verified-no-op (no commit; all gates passed on first pass, recorded below per the Phase-2 verified-no-op pattern)

_Task 2 changed no files: every acceptance gate was already green after Task 1, so per the plan action ("record the passing checks in the plan SUMMARY rather than forcing a no-op edit") no commit was produced._

## Files Created/Modified
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` - Replaced the Phase-1 placeholder with the lean dual-mode skill: frontmatter (name + 750-char scoped description, no forbidden keys) and body (two-mode router, transformations-vs-refactorings one-liner, amended RGR, 7-step coach procedure, anti-dogma framing, TS/JS overlay note, three reference pointers).

## Verification Results (Task 1 + Task 2 gate battery)

All gates green:

- `claude plugin validate ./plugins/lz-tdd` -> exit 0; `claude plugin validate .` (repo root) -> exit 0.
- Frontmatter: `name: lz-tpp` exactly one line; description present, 750 chars (<= 1024), no `<...>` angle-bracket tags, no "claude"/"anthropic".
- Forbidden frontmatter keys (`version`, `disable-model-invocation`, `user-invocable`, `allowed-tools`) all absent.
- Body budget: 87 lines (< 500), 702 words (<= 2000 target).
- Coach step cues present: "green phase", "enumerate", "classify"/"map", "highest-priority", "overlay", "impasse", "show".
- Named-transformation tokens present: `(constant -> scalar)` and `(if -> while)`.
- Impasse/backtrack heuristic present: "Word Wrap" and "simpler test" both match.
- Anti-dogma: "heuristic" matches; no "always use transformation" mandate.
- Coach-not-drive guard: "unless explicitly asked" matches on a single line; no unguarded "edit the file"/"run the tests" directive (the only "run the tests" occurrences are the developer-does-it phrasing and the "Never ... unless explicitly asked" guard).
- Reference pointer block: all three links present (`references/transformations.md`, `references/fibonacci-worked-example.md`, `references/typescript-and-tco.md`); all three target files exist (no dangling pointers); links are one level deep (no nested references).
- ASCII-only gate: no non-ASCII bytes.
- Work-email allowlist gate: no email addresses in the changed file after filtering the approved public gmail (gate never spells the private literal).
- `transformations.md` unchanged (`git diff --exit-code` exit 0) and absent from this plan's `files_modified` frontmatter.

## Decisions Made
- Kept the full 7-step coach procedure inline in the SKILL.md body rather than offloading to a references/ file; the body stayed comfortably under budget (87 lines / 702 words), consistent with D-02 and the RESOLVED Open Question 2.
- Used a YAML folded block scalar (`>-`) for the description to keep it readable while measuring the folded value at 750 chars; wording is a scoped posture only (D-10), with empirical trigger/behavior tuning deferred to Phase 5.

## Deviations from Plan

None - plan executed exactly as written. (No Rule 1-4 deviations. Task 2 was a verified-no-op by design of the plan's conditional action.)

## Issues Encountered
- The coach-not-drive guard check ("unless (you are |explicitly )?asked") initially failed because the phrase "unless explicitly asked" wrapped across two lines, defeating the line-oriented `rg` gate. Reflowed the phrase onto a single line (formatting-only, no content change) before committing Task 1 - the exact Phase-2 line-wrap brittleness lesson recurring. Fix folded into the Task 1 commit.

## User Setup Required
None - no external service configuration required. Markdown-only deliverable, no packages installed.

## Next Phase Readiness
- SKILL-01..06 satisfied and mechanically verified; ROADMAP Phase 3 SC1 (named next transformation incl. backtracking), SC2 (reference explanation on demand), and SC5 (lean SKILL.md, <=1024-char description, heavy material in references/) are met by this plan.
- Ready for Phase 4 (README/LICENSE + first-party plugin-validator/skill-reviewer authoring review) and Phase 5 (skill-creator trigger + behavior evals, empirical description tuning).
- No blockers.

## Self-Check: PASSED

- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` exists.
- `.planning/phases/03-lz-tpp-skill-authoring/03-01-SUMMARY.md` exists.
- Task 1 commit `b7267c4` present in git history.
- Task 2 was a verified-no-op (no commit expected); all gates recorded above.

---
*Phase: 03-lz-tpp-skill-authoring*
*Completed: 2026-07-02*
