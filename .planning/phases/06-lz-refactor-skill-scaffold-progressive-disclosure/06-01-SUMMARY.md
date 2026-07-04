---
phase: 06-lz-refactor-skill-scaffold-progressive-disclosure
plan: 01
subsystem: skill-authoring
tags: [claude-code-plugin, skill, progressive-disclosure, lz-refactor, lz-tdd, fowler, kerievsky]

# Dependency graph
requires:
  - phase: 01-04 (lz-tdd@0.0.1)
    provides: shipped lz-tpp skill (dual-mode frontmatter convention, pointer idiom) + auto-discovered plugin manifest
provides:
  - Invocable /lz-tdd:lz-refactor dual-mode router (SKILL.md, name==dir, dual-mode by omission)
  - Five task-area references/ stubs wired via one-level-deep pointers (all resolve on disk)
  - Two splittable catalog subdirs behind thin index entry-points (fowler-catalog, kerievsky-catalog)
  - Per-entry content contracts + D-09 oracle-access notes ready for Phases 7-11 to fill
  - Wave-0 SC1-SC4 filesystem/frontmatter checker (verify-scaffold.mjs)
affects: [phase-07-fowler-catalog, phase-08-kerievsky-catalog, phase-09-coach-behavior-principles, phase-10-distribution, phase-11-evals]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Dual-mode-by-omission skill frontmatter (name + description only; auto-triggers as coach, user-invocable as reference)"
    - "Router + thin catalog index entry-point + splittable subdir (SKEL-04 progressive disclosure)"
    - "Content-contract stub (heading + scope + Populated-in-Phase marker + per-entry contract, no oracle content)"
    - "Wave-0 single-file throwaway checker (node builtins only, SUMMARY: line + non-zero exit)"

key-files:
  created:
    - plugins/lz-tdd/skills/lz-refactor/SKILL.md
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/README.md
    - plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/README.md
    - plugins/lz-tdd/skills/lz-refactor/references/smells.md
    - plugins/lz-tdd/skills/lz-refactor/references/principles.md
    - plugins/lz-tdd/skills/lz-refactor/references/refactoring-without-tests.md
    - .claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs
  modified: []

key-decisions:
  - "SKILL.md landed at 70 lines (under the ~90-150 soft target, well under the 500 hard cap) -- lean beats padded; lz-tpp ships 82 lines"
  - "principles.md marker written as 'Populated in Phase 7 (Fowler Ch.2, ...)' (capitalized) instead of the plan's lowercase 'Fowler Ch.2 populated in Phase 7' so the generic Populated-in-Phase marker check detects it"
  - "D-09 oracle-access note reflowed so 'AskUserQuestion oracle-access checkpoint' stays on one line (single-line grep detectability)"

patterns-established:
  - "Dual-mode by omission: omit disable-model-invocation + user-invocable to get coach + reference for free"
  - "Splittable catalog: SKILL.md points one hop to references/<catalog>/README.md; leaves deferred to the content phase"

requirements-completed: [SKEL-01, SKEL-02, SKEL-03, SKEL-04]

# Metrics
duration: 6min
completed: 2026-07-04
---

# Phase 6 Plan 01: lz-refactor Skill Scaffold & Progressive Disclosure Summary

**Invocable /lz-tdd:lz-refactor dual-mode router (70-line SKILL.md, 774-char seam-aware description) wired to five references/ stubs -- two thin catalog indexes in splittable subdirs -- plus a Wave-0 SC1-SC4 checker; both the checker and `claude plugin validate .` exit 0.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-07-04T17:02:41Z
- **Completed:** 2026-07-04T17:08:02Z
- **Tasks:** 3
- **Files modified:** 7 created

## Accomplishments

- Stood up the `lz-refactor` skill skeleton as a sibling to shipped `lz-tpp` under the `lz-tdd` plugin: a lean dual-mode-by-omission router (`name` + folded `description` only) that auto-triggers as a coach and is user-invocable as a reference.
- Authored a 774-char, 4-part description carrying a should-be-used clause, concrete triggers (code smell, "which refactoring", named-refactoring lookup, de-patterning, Fowler/Kerievsky catalog questions), both mode names, and a Do-not-use near-miss that carves out the green/transformation step (lz-tpp) -- the bidirectional seam per D-08.
- Wired exactly five one-level-deep `references/` pointers (one per D-03 task area), all resolving on disk; the two big catalogs sit behind thin index entry-points inside splittable subdirs (SKEL-04, D-04) with the intra-catalog split axis explicitly deferred.
- Every `references/` stub carries its D-05 per-entry content contract + a Populated-in-Phase marker; both catalog stubs carry the D-09 AskUserQuestion oracle-access note (owner Fowler e-book/web ISBN 9780135425664, Kerievsky book, GoF e-book) required before Phases 7/8 author content.
- Built a single throwaway Wave-0 checker encoding all nine SC1-SC4 assertions; it exited non-zero before the scaffold and exits 0 after.

## Task Commits

Each task was committed atomically:

1. **Task 1: Wave-0 scaffold verification checker** - `ced95b6` (test)
2. **Task 2: references/ stub tree (five stubs + two catalog subdirs)** - `69459e8` (feat)
3. **Task 3: SKILL.md dual-mode router** - `f1102ec` (feat)

_Note: Task 1 committed as `test(...)` because the checker was authored to fail RED before the scaffold existed._

## Files Created/Modified

- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` - Lean dual-mode router: minimal frontmatter, seam-aware description, Two modes + lz-tpp seam + Phase 9 coach placeholder, five task-area pointers (70 lines)
- `plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/README.md` - Thin Fowler catalog index stub: per-entry contract, D-09 Phase 7 oracle note, deferred split-axis (20 tag-groups vs chapter grouping)
- `plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/README.md` - Thin Kerievsky catalog index stub: per-entry contract, D-09 Phase 8 oracle note, deferred split-axis (direction vs GoF family)
- `plugins/lz-tdd/skills/lz-refactor/references/smells.md` - Unified smell-taxonomy stub in coach trigger-table shape (Populated in Phases 7-8)
- `plugins/lz-tdd/skills/lz-refactor/references/principles.md` - Fowler Ch.2 principles stub (Beck backing placement finalized Phase 9, single-file, no pre-split)
- `plugins/lz-tdd/skills/lz-refactor/references/refactoring-without-tests.md` - Feathers no-tests core-techniques stub (Populated in Phase 9)
- `.claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs` - Wave-0 SC1-SC4 checker (node builtins only; exits 0 only when scaffold is complete)

## Verification Results

- **Wave-0 checker** (`node .claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs`): exit 0. All 11 lines PASS: SKILL.md exists; name===lz-refactor; description present; dual-mode by omission; description 774 chars (<=1536); 70 lines (<500); exactly 5 distinct references/ pointers; all 5 resolve; both catalog subdirs exist; description has should-be-used + Do-not-use + lz-tpp; 6 files ASCII-clean.
- **`claude plugin validate .`**: exit 0 ("Validation passed").
- **Hygiene gate**: no work-email literal (no emails at all) in any created file; ASCII-only across the whole `lz-refactor/` tree + checker; no verbatim book prose or code (stubs carry contract templates + original wording only).

## Decisions Made

- SKILL.md at 70 lines rather than padding to the ~90-150 soft target -- the hard cap is < 500 and lean routers trigger better; content belongs in `references/`.
- Kept `principles.md` as one file (no `principles-beck.md` pre-split) per D-03 / RESEARCH Open Question 1; Phase 9 finalizes Beck placement.
- Did NOT pick any intra-catalog split axis or create leaf files (D-04); shipped subdir + thin index only.

## Deviations from Plan

None affecting scope. Two wording-level adjustments were made for verifier robustness (both documented in frontmatter key-decisions), neither changes deliverables:

1. **[Rule 3 - Blocking-adjacent] Reflowed the D-09 note in both catalog stubs** so "AskUserQuestion oracle-access checkpoint" sits on one line. As first written the phrase wrapped across a blockquote line break, which a single-line grep (the natural verifier check for the D-09 note) would miss. Content unchanged; commit `69459e8`.
2. **[Rule 3 - Blocking-adjacent] Capitalized the principles.md phase marker** to "Populated in Phase 7 (Fowler Ch.2, oracle-verified)". The plan text specified lowercase "Fowler Ch.2 populated in Phase 7", but the generic acceptance/must-have requires a "Populated in Phase" marker in every stub; the capitalized form satisfies both. Commit `69459e8`.

**Total deviations:** 2 wording-level adjustments (verifier robustness). **Impact:** none on scope or deliverables; all acceptance criteria and both gates green.

## Issues Encountered

- Initial verification used `git grep` on newly-created (untracked) files, which returned empty because `git grep` searches the index only. Re-ran the checks with `rg` per project CLAUDE.md; all confirmed present.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Scaffold is complete and validate-clean: Phase 7 can drop oracle-verified Fowler catalog content into `references/fowler-catalog/` behind the thin index, picking the split axis then.
- **Carry-forward for Phases 7-8 (D-09):** BOTH catalog phases MUST open an AskUserQuestion oracle-access checkpoint (owner Fowler e-book/web ISBN 9780135425664, Kerievsky book, GoF e-book) BEFORE authoring content -- do not fabricate. The stubs record this requirement inline.
- Out of scope, still pending downstream: catalog CONTENT (Phases 7-8), full coach decision procedure + principle backing (Phase 9), plugin.json 0.0.2 bump + README/CHANGELOG (Phase 10), evals (Phase 11).

## Self-Check: PASSED

- All 7 created files present on disk (+ this SUMMARY.md).
- All 3 task commits present in git history (ced95b6, 69459e8, f1102ec).
- SUMMARY.md is ASCII-only.

---
*Phase: 06-lz-refactor-skill-scaffold-progressive-disclosure*
*Completed: 2026-07-04*
