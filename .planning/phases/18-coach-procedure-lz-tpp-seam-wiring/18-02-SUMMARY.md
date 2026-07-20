---
phase: 18-coach-procedure-lz-tpp-seam-wiring
plan: 02
subsystem: testing
tags: [lz-red, tdd, three-laws, clean-code, principle-backing, clean-room, provenance]

# Dependency graph
requires:
  - phase: 18-01
    provides: flipped Phase-18 deferral guards + absent no-stale-marker guards the filled slices satisfy
  - phase: 16
    provides: the SEL slice in three-laws-and-test-selection.md (running test list, one small step, degenerate case, triangulation, sumOf fence) kept byte-stable
  - phase: 17
    provides: the principle-backing.md source-to-recommendation map + canonical owned/no-oracle tier strings
provides:
  - Owned Three Laws of TDD spine + classify-first framing authored blind in the three-laws leaf (LAW-01, SEAM-01)
  - Law 1/Law 2 tagged owned; oracle-verified, Law 3 tagged lz-red orchestration (no-oracle handoff)
  - LAW-01/LAW-02 (owned) + SEAM-01/SEAM-02 (no-oracle) backing rows in principle-backing.md
affects: [18-05 SKILL.md coach procedure, 18-06 oracle-reviewer finalize gate, 18-04 lz-tpp seam edit]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "SKILL.md = orchestration, references = content: the owned Three-Laws prose lives in the leaf; SKILL.md will carry only the compact spine and point here (D-04)."
    - "Clean-room DST-04: owned surface authored BLIND at the target tier; the orchestrator oracle-reviewer gate (18-06) confirms or downgrades the tier."
    - "Co-edit, do not split (D-14): only the Phase-18 slice filled; SEL/Phase-16/17 content byte-stable; the /Phase 18/i deferral marker removed."

key-files:
  created: []
  modified:
    - plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
    - plugins/lz-tdd/skills/lz-red/references/principle-backing.md

key-decisions:
  - "D-04: owned Three-Laws prose lands in the three-laws leaf, not SKILL.md."
  - "D-05: authored at the target `Owned; oracle-verified` tier against Clean Code Ch. 9; the tier is gate-decided at 18-06 (may fall back to no-oracle)."
  - "D-12: authored blind clean-room; main context never read .oracle/; the no-verbatim hygiene scan is the deterministic backstop."
  - "D-03: classify-first red/green/refactor framing landed; Law 3 handoff is lz-red orchestration (no-oracle)."
  - "D-14: only the Phase-18 slice filled; SEL slice + Phase-16/17 rows byte-stable; no stale deferral marker."

patterns-established:
  - "Inline tier tag style reused: `(Robert C. Martin, owned; oracle-verified)` on Law 1/Law 2, matching the existing Take-one-small-step row."
  - "Canonical tier strings reused verbatim so the checker and D-05 honesty gate key correctly: `Owned; oracle-verified against the clean-room source.` and `Unowned; high-confidence core only (no-oracle).`"

requirements-completed: [LAW-01, LAW-02, SEAM-01, SEAM-02]

coverage:
  - id: D1
    description: "Owned Three Laws spine + classify-first section filled in three-laws-and-test-selection.md; heading de-marked; SEL slice byte-stable."
    requirement: "LAW-01"
    verification:
      - kind: automated_ui
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs (three-laws-and-test-selection.md topics + absent /Phase 18/i guard all PASS)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Three-Laws prose is authored at the TARGET `Owned; oracle-verified` tier; the actual tier per Law statement is decided by the orchestrator oracle-reviewer gate against Clean Code Ch. 9."
    requirement: "LAW-01"
    verification: []
    human_judgment: true
    rationale: "D-05: the owned-vs-no-oracle tier is decided by the orchestrator-driven oracle-reviewer gate at 18-06, not by a deterministic check; a fresh-context agent must gate the blind distillation against the clean-room source."
  - id: D3
    description: "LAW-01/LAW-02 (owned) + SEAM-01/SEAM-02 (no-oracle) backing rows added to principle-backing.md in the exact three-column pipe shape; D-05 honesty gate holds."
    requirement: "SEAM-01"
    verification:
      - kind: automated_ui
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs (principle-backing.md topics + absent guard + D-05 honesty gate all PASS)"
        status: pass
    human_judgment: false

# Metrics
duration: ~12min
completed: 2026-07-20
status: complete
---

# Phase 18 Plan 02: Owned Three-Laws spine + classify-first, LAW/SEAM backing rows Summary

**Filled the one owned surface Phase 18 introduces -- the Three Laws of TDD spine + classify-first framing in the three-laws leaf (Law 1/2 owned; oracle-verified, Law 3 the lz-tpp handoff reframe) -- plus the LAW-01/LAW-02 owned and SEAM-01/SEAM-02 no-oracle backing rows in principle-backing.md, authored blind and clean-room.**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-07-20T18:26:00Z
- **Completed:** 2026-07-20T18:37:45Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Authored the owned Three Laws spine blind (clean-room DST-04): Law 1 gates entry, Law 2 sizes the test (a not-yet-defined symbol / non-compiling code counts as the failure), Law 3 is the lz-tpp handoff. Law 1/2 tagged `(Robert C. Martin, owned; oracle-verified)`; Law 3 tagged lz-red orchestration (no-oracle).
- Added the classify-first red/green/refactor framing consistent with the SKILL.md "RED vs the green step" section, without restating the SEL rows.
- Rewrote both head blockquotes to declare the now-present owned surface and removed every `/Phase 18/i` deferral marker from both files.
- Added the four backing rows to principle-backing.md in the exact `| [rec](doc.md) | Source | tier |` shape using the canonical tier strings; D-05 honesty gate stays GREEN.

## Task Commits

Each task was committed atomically:

1. **Task 1: Fill the owned Three Laws spine + classify-first section (blind)** - `cb14638` (feat)
2. **Task 2: Add the LAW / SEAM backing rows to principle-backing.md** - `e5091c6` (feat)

**Plan metadata:** committed with this SUMMARY + STATE.md + ROADMAP.md (docs)

## Files Created/Modified
- `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` - filled the "## The Three Laws spine and classify-first" section (heading de-marked), rewrote the head blockquote, and noted the Three Laws spine in the Clean Code Ch. 9 Sources entry. SEL slice + fence byte-stable.
- `plugins/lz-tdd/skills/lz-red/references/principle-backing.md` - filled the "## Three-Laws spine and lz-tpp seam backing" section (heading de-marked) with LAW-01/LAW-02 (owned) + SEAM-01/SEAM-02 (no-oracle) rows and rewrote the head blockquote. Prior Phase-16/17 rows byte-stable.

## Decisions Made
None beyond the plan. Executed exactly as specified: authored at the target `Owned; oracle-verified` tier per D-05 (tier gate-decided at 18-06), blind per D-12, co-edit-only per D-14.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None. The topic tokens for both files already PASSed on the pre-fill markers; the only pre-fill FAIL was the `absent: /Phase 18/i` guard on each file, which flipped to PASS once the deferral markers were removed and real content landed.

## Verification

- `check-red-references.mjs`: three-laws-and-test-selection.md and principle-backing.md - every topic + the `absent` no-stale-marker guard PASS; D-05 honesty gate PASS. Overall checker still exits 1 (RED by design) - the remaining FAILs are all later-wave targets (test-structure-and-assertions.md, vitest-typescript-mechanics.md, SKILL.md, lz-tpp/SKILL.md), not this plan's files.
- `npm --prefix .claude/skills/lz-red-workspace run typecheck`: exit 0 (7 modules tsc --strict clean; the existing sumOf fence still compiles, no new fence added here).
- `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs`: exit 0 (ASCII + work-email + no-verbatim DST-04 all clean; 198/191 files).
- No `.oracle/` prose read; no verbatim source text; ASCII-only; public-gmail commit identity.

## Next Phase Readiness
- The owned Three-Laws surface is queued for the orchestrator-driven oracle-reviewer gate at 18-06, which decides the tier per Law statement (may downgrade a statement to no-oracle high-confidence core). It was NOT run here (executor cannot spawn agents).
- 18-05 can point the SKILL.md compact spine at this now-filled leaf; 18-04 adds the lz-tpp reverse pointers the SEAM-02 backing row references.

## Self-Check: PASSED
- FOUND: plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
- FOUND: plugins/lz-tdd/skills/lz-red/references/principle-backing.md
- FOUND commit: cb14638 (Task 1)
- FOUND commit: e5091c6 (Task 2)

---
*Phase: 18-coach-procedure-lz-tpp-seam-wiring*
*Completed: 2026-07-20*
