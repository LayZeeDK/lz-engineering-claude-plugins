---
phase: 18-coach-procedure-lz-tpp-seam-wiring
plan: 03
subsystem: testing
tags: [lz-red, tdd, law-02, first, fail-for-the-right-reason, clean-room, co-edit]

# Dependency graph
requires:
  - phase: 18-01
    provides: flipped Phase-18 deferral guards + absent no-stale-marker guards these two slices now satisfy
  - phase: 17
    provides: the ASRT slice (four pillars, owned F.I.R.S.T. block) in test-structure-and-assertions.md and the VIT slice (Read-the-red-bar mechanic, ADV pointers) in vitest-typescript-mechanics.md -- both kept byte-stable
provides:
  - F.I.R.S.T.-as-a-red-step-baseline procedure section (LAW-02) authored blind, pointing at the owned F.I.R.S.T. block rather than restating it
  - Fail-for-the-right-reason procedure section (LAW-02) tying the Read-the-red-bar mechanic to the Three-Laws spine step
  - Both co-edited slices de-marked; no /Phase 18/i deferral marker remains in either file
affects: [18-05 SKILL.md coach procedure step 5 links these two sections]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SKILL.md = orchestration, references = content: both fills are lz-red orchestration prose that points at already-owned content (the F.I.R.S.T. block, the Read-the-red-bar mechanic) and never restates it (D-12)."
    - "Co-edit, do not split (D-14): only the two Phase-18 procedure markers filled; STR / ASRT and VIT slices byte-stable; every /Phase 18/i deferral marker removed."
    - "Coach questions, does not drive: both sections frame the coach as explaining which red is the right one, never running the suite or editing the test unprompted (D-08)."

key-files:
  created: []
  modified:
    - plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md
    - plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md

key-decisions:
  - "D-08: fail-for-the-right-reason = an AssertionError on the asserted behavior, not a compile / import / setup error or a false green; F.I.R.S.T. is the test-quality baseline; the coach questions, it does not run the suite."
  - "D-14: filled only the two Phase-18 procedure markers; kept the STR / ASRT and VIT slices byte-stable; left no stale deferral marker."
  - "D-12: both fills authored blind as no-oracle orchestration; point at the existing owned F.I.R.S.T. block and the Read-the-red-bar mechanic, do not restate them."

patterns-established:
  - "Head-marker rewrite idiom (reused from 18-02): the head blockquote / stub deferral sentence is rewritten to declare the now-present procedure framing, and the parenthetical (Phase 18) drops from the section heading, so the absent /Phase 18/i guard flips to PASS."

requirements-completed: [LAW-02]

coverage:
  - id: D1
    description: "F.I.R.S.T.-as-a-red-step-baseline section filled in test-structure-and-assertions.md; heading de-marked; points at the owned F.I.R.S.T. block; STR / ASRT slice byte-stable."
    requirement: "LAW-02"
    verification:
      - kind: automated_ui
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs (test-structure-and-assertions.md: every topic + the red-step-baseline topic + the absent /Phase 18/i guard all PASS)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Fail-for-the-right-reason procedure section filled in vitest-typescript-mechanics.md; heading de-marked; ties the Read-the-red-bar mechanic to the LAW-02 procedure step; VIT slice byte-stable."
    requirement: "LAW-02"
    verification:
      - kind: automated_ui
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs (vitest-typescript-mechanics.md: every topic + the procedure-step topic + the absent /Phase 18/i guard all PASS)"
        status: pass
    human_judgment: false

# Metrics
duration: ~10min
completed: 2026-07-20
status: complete
---

# Phase 18 Plan 03: F.I.R.S.T.-as-a-red-step-baseline + fail-for-the-right-reason procedure sections Summary

**Filled the two co-edited Phase-18 LAW-02 procedure markers -- turned the owned F.I.R.S.T. properties into the coach's red-step test-quality baseline (test-structure-and-assertions.md) and the Read-the-red-bar mechanic into the fail-for-the-right-reason procedure step (vitest-typescript-mechanics.md) -- authored blind, no-oracle, pointing at the existing owned content rather than restating it.**

## Performance

- **Duration:** ~10 min
- **Completed:** 2026-07-20
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Filled the "## F.I.R.S.T. as a red-step baseline" section: the coach reads a fresh, structured red test back against the five F.I.R.S.T. properties (defined in the block above, not restated) as the baseline the LAW-02 fail-for-the-right-reason step stands on; coach questions rather than drives.
- Filled the "## Fail-for-the-right-reason as a procedure" section: after a fresh test is written and before any production code, confirm it is red for the reason intended -- an AssertionError on the asserted behavior, not a ReferenceError / TypeError / import or setup failure (a broken harness) and not a false green (a test that passes immediately); only then is it a target for the lz-tpp green step.
- Dropped the parenthetical `(Phase 18)` from both headings and rewrote the head deferral sentences to declare the now-present procedure framing.
- Removed every `/Phase 18/i` deferral marker from both files, flipping each file's `absent` no-stale-marker guard to PASS.
- Kept the STR / ASRT slice (arrange-act-assert, assert-first, four pillars, the owned F.I.R.S.T. block, both fences) and the VIT slice (it.todo, test.each, vi.* restraint, watch, Read-the-red-bar, ADV pointers, isEven fence) byte-stable.

## Task Commits

Each task was committed atomically:

1. **Task 1: Fill the F.I.R.S.T.-as-a-red-step-baseline procedure section** - `38cf978` (feat)
2. **Task 2: Fill the fail-for-the-right-reason procedure section** - `a684e2a` (feat)

**Plan metadata:** committed with this SUMMARY + STATE.md + ROADMAP.md (docs)

## Files Created/Modified
- `plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md` - filled the "## F.I.R.S.T. as a red-step baseline" section (heading de-marked), rewrote the head blockquote deferral sentence. STR / ASRT content and both fences byte-stable.
- `plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md` - filled the "## Fail-for-the-right-reason as a procedure" section (heading de-marked), which also replaced the stub deferral sentence. VIT mechanics content and the isEven fence byte-stable.

## Decisions Made
None beyond the plan. Executed exactly as specified: authored blind no-oracle orchestration per D-12, pointing at the existing owned F.I.R.S.T. block and the Read-the-red-bar mechanic; co-edit-only per D-14; the D-08 fail-for-the-right-reason shape (AssertionError vs broken harness vs false green, coach-questions-not-drives).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. As in 18-02, both files' Phase-18 content topic tokens (`red-step baseline`, `procedure step`) already PASSed on the pre-fill marker text; the only pre-fill FAIL on each file was the `absent: /Phase 18/i` guard, which flipped to PASS once the deferral markers were removed and the real procedure prose landed.

## Verification

- `check-red-references.mjs`: test-structure-and-assertions.md and vitest-typescript-mechanics.md - every topic + the `>= 1 ts fence` requirement + the `absent` no-stale-marker guard PASS. Overall checker still exits 1 (RED by design) - the remaining 5 FAILs are all later-wave targets (SKILL.md coach-procedure content + non-ignore fence + placeholder + its /Phase 18/i marker, and the lz-tpp SEAM-02 reverse pointers), not this plan's files.
- `npm --prefix .claude/skills/lz-red-workspace run typecheck`: exit 0 (7 modules tsc --strict clean; the applyCredit / netOf / isEven fences still compile, no new fence added here).
- `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs`: exit 0 (ASCII + work-email allowlist-inversion + no-verbatim DST-04 all clean; 198 / 191 files).
- D-05 provenance-honesty gate stays GREEN (principle-backing.md untouched).
- No `.oracle/` prose read; no verbatim source text; ASCII-only; public-gmail commit identity; config.json and no checker .mjs touched.

## Next Phase Readiness
- 18-05 SKILL.md coach procedure step 5 (fail-for-the-right-reason) can now link both filled sections: the F.I.R.S.T. red-step baseline in test-structure-and-assertions.md and the AssertionError-vs-broken-harness-vs-false-green procedure step in vitest-typescript-mechanics.md.
- After this plan, three of the four co-edited Phase-18 slices are filled (three-laws, principle-backing in 18-02; these two here); only the SKILL.md body + the lz-tpp SEAM-02 seam edit remain to flip the checker fully GREEN.

## Self-Check: PASSED
- FOUND: plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md
- FOUND: plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md
- FOUND commit: 38cf978 (Task 1)
- FOUND commit: a684e2a (Task 2)

---
*Phase: 18-coach-procedure-lz-tpp-seam-wiring*
*Completed: 2026-07-20*
