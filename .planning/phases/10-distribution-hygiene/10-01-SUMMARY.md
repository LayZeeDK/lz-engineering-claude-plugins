---
phase: 10-distribution-hygiene
plan: 01
subsystem: infra
tags: [hygiene-checker, dst-04, dst-02, ascii-gate, work-email-allowlist, no-verbatim-gate, node-esm]

# Dependency graph
requires:
  - phase: 07-fowler-catalog-refactoring-2nd-ed
    provides: the lz-refactor-workspace checker battery (check-hygiene.mjs, report()/warn() split, walkMd, repoRoot anchor)
  - phase: 09-coach-behavior-and-principles
    provides: the GREEN Phase-9 baseline (npm run check + typecheck) the widened gate must preserve
provides:
  - "check-hygiene.mjs axes (a) ASCII + (b) work-email widened from lz-refactor-only (178 files) to the full shippable surface (187 files): both skill trees + root README/CHANGELOG/LICENSE + both manifests"
  - "per-axis target-set split: wideTargets (a/b, 187 files) vs verbatimTargets (c, 180 files)"
  - "axis (c) no-verbatim promoted from a soft WARN to a HARD report() gate over verbatimTargets (lz-refactor tree + new root prose only), realizing the Phase-10 no-verbatim gate named at the file's own header"
affects: [10-02-manifests-readme-changelog, 10-03-dst04-cleanroom-sweep, 10-04-phase-gate]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Per-axis target-set split inside one checker: two internal target arrays (wide vs narrow) instead of a single shared array, so ASCII/email scan wider than the IP no-verbatim gate (D-04/D-10/D-17)"
    - "Widen a gate, never weaken one: axis (c) moved WARN -> HARD; no existing HARD check relaxed (T-09-GATE)"

key-files:
  created: []
  modified:
    - ".claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs"

key-decisions:
  - "D-17 realized: extended check-hygiene.mjs in place (not a sibling checker); per-axis split implemented as two internal arrays (wideTargets / verbatimTargets), reusing the existing repoRoot anchor"
  - "Removed the now-dead warn()/warnings soft-report path once (c) was promoted -- no soft checks remain in the checker"
  - "Left the runtime header console.log label ('no-verbatim heuristic') unchanged -- still accurate (a heuristic-based gate) and outside the plan's enumerated edit scope"

patterns-established:
  - "Per-axis target split: axes (a)/(b) scan wideTargets (both skill trees + root docs + manifests); axis (c) scans verbatimTargets (lz-refactor tree + new root prose only, excluding lz-tpp/LICENSE/manifests)"

requirements-completed: []  # 10-01 lands only the instrument (deterministic layer); DST-02 + DST-04 close at the 10-04 phase gate. See Next Phase Readiness.

# Metrics
duration: ~13min
completed: 2026-07-09
---

# Phase 10 Plan 01: Widen & Harden the Hygiene Instrument Summary

**check-hygiene.mjs now scans the full shippable public surface for ASCII + work-email (178 -> 187 files) and enforces a HARD no-verbatim gate over the lz-refactor tree + new root prose (180 files) -- GREEN regression baseline on today's tree, ready to gate Wave 2 content.**

## Performance

- **Duration:** ~13 min
- **Started:** 2026-07-09T08:03Z (approx)
- **Completed:** 2026-07-09T08:15Z
- **Tasks:** 2
- **Files modified:** 1

## Accomplishments
- Widened axes (a) ASCII-only and (b) work-email allowlist from the lz-refactor skill only (178 files) to the full shippable surface: both skill trees (lz-refactor + lz-tpp), the repo-root README.md/CHANGELOG.md/LICENSE, and both manifests (plugin.json + marketplace.json) -- 187 files, an increase of exactly 9 (D-10).
- Introduced a per-axis target-set split (D-04/D-17): `wideTargets` for (a)/(b) and `verbatimTargets` for (c). Non-.md targets (LICENSE, both manifests) and root prose (README/CHANGELOG) are added via explicit `targets.push` mirroring the existing `SKILL_MD` shape, because `walkMd` is .md-only and only recurses a references dir.
- Promoted axis (c) no-verbatim from a soft `warn()` to a HARD `report()` gate (D-01 layer 1), collecting 120+ char quoted runs into a hits array and emitting one gate line mirroring axes (a)/(b). It scans the narrower `verbatimTargets` (180 files = lz-refactor tree + README + CHANGELOG), excluding lz-tpp (cited FibTPP by design), LICENSE (verbatim OSI MIT), and both manifests (short quoted JSON).
- Kept the email allowlist-subtraction shape unchanged (D-11): `APPROVED_EMAILS` / `EMAIL_RE` untouched, only the target set widened; the work-email literal appears nowhere in the checker.
- Checker exits 0 on today's tree as a HARD-gate regression baseline; the transient Task-1 WARN on plugin.json (150-char quoted JSON) is resolved by the D-04 exclusion in Task 2, empirically confirming why the manifests must stay out of axis (c).

## Task Commits

Each task was committed atomically:

1. **Task 1: Widen the ASCII + work-email walk with a per-axis target-set split (D-10, D-04, D-11)** - `546a11a` (feat)
2. **Task 2: Promote axis (c) no-verbatim from WARN to a HARD gate over verbatimTargets (D-01 layer 1, D-17)** - `57d35c9` (feat)

_Note: no TDD tasks (harness edit, verified by running the checker to exit 0)._

## Files Created/Modified
- `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` - widened axes (a)/(b) to the full shippable surface via a `wideTargets` array (both skill trees + root README/CHANGELOG/LICENSE + both manifests); added a `verbatimTargets` array for axis (c); promoted (c) from a WARN to a HARD `report()` gate over `verbatimTargets`; removed the now-dead `warn()`/`warnings` path; refreshed the header comment so it describes (c) as the realized Phase-10 HARD no-verbatim gate.

## Decisions Made
- **D-17 realized (extend, not sibling):** extended `check-hygiene.mjs` in place rather than landing a sibling checker -- lower surface, reuses the existing `repoRoot` anchor. The per-axis split is two internal arrays (`wideTargets` / `verbatimTargets`), the approach RESEARCH open-question 1 recommended.
- **Header/purpose comment coherence:** rewrote line 2 (file purpose) and the `QUOTE_THRESHOLD` comment alongside the plan-specified `:6-9` header block so the whole header is internally consistent after widening + promotion (the old text still said "over the shipped lz-refactor skill" and "no-verbatim WARN"). Behavior-preserving, comment-only.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - dead code from the (c) promotion] Removed the unused warn()/warnings soft-report path**
- **Found during:** Task 2 (promoting axis (c) to a HARD gate)
- **Issue:** The plan explicitly required removing the `warn("long quoted ...")` call and updating the two SUMMARY console.log lines (which referenced `${warnings}`). Once (c) -- the only caller of `warn()` -- routed through `report()`, the entire `warn` helper and the `warnings` counter became dead code (`warnings` was also unreferenced after the SUMMARY-line update the plan mandates).
- **Fix:** Deleted the `warn` arrow function and the `let warnings = 0;` declaration; rewrote both SUMMARY lines to report only `failures` (no WARN counter). Verified no dangling `warn(`/`warnings`/old-`targets` references remain.
- **Files modified:** `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs`
- **Verification:** `node check-hygiene.mjs` exits 0; `rg -n -e '\bwarnings\b' -e '\bwarn\(' -e '\btargets\b'` returns no matches.
- **Committed in:** `57d35c9` (Task 2 commit)

**2. [Rule 1 - stale documentation] Refreshed line 2 (file purpose) and the QUOTE_THRESHOLD comment**
- **Found during:** Task 2 (header comment refresh)
- **Issue:** The plan scoped the header update to `:6-9` and the SUMMARY lines, but leaving line 2 ("over the shipped lz-refactor skill") and the `QUOTE_THRESHOLD` comment ("...trip the no-verbatim WARN") unchanged would leave the header internally inconsistent and factually stale after widening (a)/(b) and promoting (c).
- **Fix:** Updated line 2 to describe the full shippable surface and the `QUOTE_THRESHOLD` comment to say "gate" instead of "WARN". Comment-only, no behavior change.
- **Files modified:** `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs`
- **Verification:** `node check-hygiene.mjs` exits 0 (behavior unchanged).
- **Committed in:** `57d35c9` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 -- dead code + stale documentation, directly within the (c)-promotion blast radius)
**Impact on plan:** Both are behavior-preserving cleanups the plan's own required edits necessitated. No scope creep; no checker relaxed (T-09-GATE holds).

## Issues Encountered
None. The Task-1 transient WARN on plugin.json (a 150-char quoted JSON run) was expected while axis (c) briefly scanned `wideTargets`; Task 2's D-04 exclusion of the manifests from `verbatimTargets` removed it, empirically validating the per-axis split design.

## Known Stubs
None. This plan edits one non-shipped Node checker; no UI, no data sources, no placeholders introduced.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The instrument is landed and GREEN: axes (a)/(b) gate the full shippable surface (187 files) and axis (c) is a HARD no-verbatim gate over the lz-refactor tree + new root prose (180 files). Wave 2 (10-02: manifests + README + CHANGELOG) can now author every byte of new Phase-10 prose UNDER the widened gate.
- **Requirements advanced, not yet completed:** 10-01 delivers only the deterministic layer of DST-04 (D-01 layer 1) and the widened ASCII/work-email coverage for DST-02 (D-10). Both requirements fully close at the 10-04 phase gate (`claude plugin validate . --strict`, `plugin-validator` + `skill-reviewer`, full `npm run check` + `npm run typecheck`) plus the 10-03 clean-room `oracle-reviewer` sweep and Layer-3 attestation. `requirements-completed` is intentionally empty here; do not mark DST-02/DST-04 complete until the phase gate.
- No SKILL.md was touched, so no D-14 subagent review and no `/reload-plugins` is required for this plan.

---
*Phase: 10-distribution-hygiene*
*Completed: 2026-07-09*
