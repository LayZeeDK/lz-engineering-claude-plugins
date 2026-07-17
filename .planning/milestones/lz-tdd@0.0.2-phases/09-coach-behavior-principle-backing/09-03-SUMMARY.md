---
phase: 09-coach-behavior-principle-backing
plan: 03
subsystem: testing
tags: [beck-tdd, beck-tidy-first, feathers-legacy-code, no-oracle, principle-backing, dst-04, markdown-skill]

# Dependency graph
requires:
  - phase: 09-01
    provides: check-backing.mjs RED gate + check-crossrefs source-set extension (SKILL.md, principles.md, 3 backing refs)
  - phase: 07
    provides: fowler-catalog leaves (the by-link cross-reference targets for beck-tidy-first.md)
provides:
  - beck-tdd-by-example.md (PRIN-01) no-oracle Beck TDD backing (cycle, two rules, green-bar strategies), seam-scoped to lz-tpp
  - beck-tidy-first.md (PRIN-02) no-oracle Beck Tidy First? backing (structural/behavioral separation + economics), 8 Fowler cross-links by link
  - refactoring-without-tests.md (PRIN-03) populated Feathers backing (seams, characterization tests, change algorithm, sprout/wrap, subclass-and-override, extract interface)
  - check-backing GREEN (3/3 references authored)
affects: [09-04 (principles.md cross-ref pointers to the two Beck files; full-battery phase gate), coach behavior CCH-03/CCH-05]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "No-oracle provenance marker: top blockquote + ## Sources naming ONLY the book (no research artifact), checker keys on /no-oracle/i"
    - "DST-04 clean-room authoring with no owned oracle: original prose, famous one-liners paraphrased from the first draft, only technique NAMES verbatim"
    - "PRIN-02 cross-reference-by-link: overlapping Fowler refactorings linked, mechanics not restated"

key-files:
  created:
    - plugins/lz-tdd/skills/lz-refactor/references/beck-tdd-by-example.md
    - plugins/lz-tdd/skills/lz-refactor/references/beck-tidy-first.md
  modified:
    - plugins/lz-tdd/skills/lz-refactor/references/refactoring-without-tests.md

key-decisions:
  - "beck-tidy-first.md Fowler links use the ./fowler-catalog/<slug>.md form (leading dot) to satisfy check-backing's mandatory-leading-dot link regex, not the bare fowler-catalog/ form principles.md uses"
  - "All three refs name ONLY the book in ## Sources (no research artifact) per D-07 no-oracle posture"

patterns-established:
  - "No-oracle backing reference shape: scope paragraph + no-oracle blockquote + core-topic sections + ## Sources (book-only)"
  - "Feathers per-entry contract authored as Technique / When-to-use / Distilled mechanics per technique"

requirements-completed: [PRIN-01, PRIN-02, PRIN-03]

# Metrics
duration: 15min
completed: 2026-07-08
---

# Phase 9 Plan 03: No-Oracle Principle-Backing References Summary

**Three no-oracle principle references authored on top of the 09-01 check-backing RED gate -- Beck TDD by Example (cycle + two rules + Fake It/Triangulate/Obvious Implementation), Beck Tidy First? (structural/behavioral separation + coupling/cohesion/options economics with 8 Fowler cross-links by link), and a populated Feathers refactoring-without-tests -- turning check-backing GREEN.**

## Performance

- **Duration:** ~15 min
- **Completed:** 2026-07-08
- **Tasks:** 3
- **Files modified:** 3 (2 created, 1 populated)

## Accomplishments
- beck-tdd-by-example.md (PRIN-01): red-green-refactor cycle, the two rules, and the three green-bar strategies (Fake It, Triangulate, Obvious Implementation) in original prose, scoping the green step to lz-tpp and the refactor step to lz-refactor.
- beck-tidy-first.md (PRIN-02): structural-vs-behavioral change separation + refactor economics (coupling, cohesion, options), cross-referencing 8 overlapping Fowler refactorings BY LINK without restating their mechanics; no complete tidyings catalog claimed (FUT-01).
- refactoring-without-tests.md (PRIN-03): populated to its declared Technique / When-to-use / Distilled mechanics contract for seams, characterization tests, the change algorithm, Sprout/Wrap Method+Class, Subclass and Override Method, and Extract Interface; both scaffold markers removed.
- check-backing.mjs GREEN (3/3 references, 25/25 checks PASS); check-crossrefs GREEN (713 links resolve, all 8 new Beck->Fowler links included); check-hygiene GREEN (ASCII clean, no email leak, 0 no-verbatim WARN).

## Task Commits

Each task was committed atomically:

1. **Task 1: Author beck-tdd-by-example.md (PRIN-01, no-oracle)** - `8200c28` (feat)
2. **Task 2: Author beck-tidy-first.md (PRIN-02, no-oracle, Fowler cross-links)** - `d35cbdd` (feat)
3. **Task 3: Populate refactoring-without-tests.md (PRIN-03, Feathers, scaffold markers removed)** - `609e9b8` (feat)

## Files Created/Modified
- `plugins/lz-tdd/skills/lz-refactor/references/beck-tdd-by-example.md` - NEW; PRIN-01 no-oracle Beck TDD by Example backing (cycle, two rules, green-bar strategies), seam-scoped to lz-tpp.
- `plugins/lz-tdd/skills/lz-refactor/references/beck-tidy-first.md` - NEW; PRIN-02 no-oracle Beck Tidy First? backing (structural/behavioral separation + economics), 8 Fowler cross-links by link.
- `plugins/lz-tdd/skills/lz-refactor/references/refactoring-without-tests.md` - POPULATED; PRIN-03 Feathers no-tests backing to the per-entry contract; both scaffold markers (Populated-in-Phase-9 blockquote + (placeholder) Sources heading) removed.

## Decisions Made
- **Fowler-link form:** check-backing's link regex `/\]\(\.\.?\/?fowler-catalog\/[a-z0-9-]+\.md/` requires a mandatory leading dot, so beck-tidy-first.md uses `./fowler-catalog/<slug>.md` (not the bare `fowler-catalog/` form principles.md uses). Both forms resolve identically under check-crossrefs; only the leading-dot form satisfies the presence gate. This is a HOW detail within D-12 discretion, not a deviation.
- **Sources name book only:** per D-07 (no owned oracle AND no committed research artifact for Beck/Feathers), each `## Sources` names only the book plus the no-oracle posture -- unlike the functional-catalog which cites its research artifact.

## Deviations from Plan

None - plan executed exactly as written. All three tasks authored to their declared scope (D-08), DST-04-clean, fence-free (D-11), and turned check-backing GREEN. The Fowler-link leading-dot form was already specified by the check-backing regex; using it is contract compliance, not a deviation.

## Issues Encountered
None. The three per-task verify commands and the broader hygiene/crossrefs checks all passed on the first authoring pass. DST-04 discipline (paraphrasing the seam definition, the "legacy code is code without tests" line, and Beck's two rules / green-bar definitions from the first draft, keeping only technique NAMES verbatim) was applied throughout; the skill-reviewer PASS at the 09-04 gate remains the authoritative DST-04 anchor per D-07.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- check-backing is GREEN; PRIN-01/02/03 are satisfied structurally. The DST-04 authoritative gate (skill-reviewer PASS) and the full-battery + `claude plugin validate .` phase gate land in 09-04.
- 09-04 wires the `principles.md` cross-ref pointers to the two new Beck files (D-06); those two new outbound links will be resolution-checked by the already-extended check-crossrefs source set.
- The coach decision procedure (09-02) already references the Feathers no-tests fallback (CCH-03) and the lz-tpp seam (CCH-05); the backing files now exist for those pointers.

## Self-Check: PASSED
- beck-tdd-by-example.md, beck-tidy-first.md, refactoring-without-tests.md all present on disk.
- Commits 8200c28, d35cbdd, 609e9b8 all present in git history.
- check-backing.mjs exit 0 (GREEN, 25/25); check-crossrefs.mjs exit 0 (713 links); check-hygiene.mjs exit 0 (178 files ASCII + email clean).

---
*Phase: 09-coach-behavior-principle-backing*
*Completed: 2026-07-08*
