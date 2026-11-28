---
phase: 17-assertion-design-stance-router-ts-vitest-mechanics
plan: 02
subsystem: lz-red-references
tags: [assertions, four-pillars, first-properties, khorikov, assertion-style-selection, stance-router, principle-backing, tsc-strict, vitest, clean-room, dst-04, lz-red]

# Dependency graph
requires:
  - phase: 17-assertion-design-stance-router-ts-vitest-mechanics
    plan: 01
    provides: the check-red-references.mjs Phase-17 RED baseline (assertions-slice ASRT tokens + stance-leaf filename tokens + requireFence + Phase-18 F.I.R.S.T.-baseline deferral guard; principle-backing tier/link/Khorikov guards)
  - phase: 16-source-distillation-core-red-references
    provides: the filled STR slice (the in-file style analog) + the lz-red-workspace tsc extractor (typescript 6.0.3 / vitest 4.1.10)
  - phase: 15-lz-red-skill-scaffold
    provides: the test-structure-and-assertions.md + principle-backing.md stubs with per-doc content contracts
provides:
  - the filled ASRT slice of test-structure-and-assertions.md -- the four pillars (Khorikov, no-oracle, resistance-to-refactoring load-bearing), F.I.R.S.T. (Clean Code Ch.9, owned/oracle-gated, authored own-words BLIND), and the output/state/communication selection rule linking the three stance leaves (the ASRT-02 spine)
  - the populated principle-backing.md source-to-recommendation map (Recommendation | Source | Access tier across all RED docs, canonical tier strings, sibling-relative links)
affects: [17-03, 17-04, 17-06, phase-18-coach-procedure]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Own-words BLIND authoring of an owned surface (F.I.R.S.T., Clean Code Ch.9): the acronym expansion is a plain fact; every gloss is original prose; the oracle-reviewer converge-to-clean gate is deferred to the orchestrator (Plan 17-06), main context never reads .oracle/"
    - "ASRT-02 spine as filename-presence links: the assertions slice carries the selection rule and points at the three stance leaves by relative filename; each leaf carries its own assert rule"
    - "Backing map as a Markdown table with canonical owned/no-oracle tier strings reused verbatim across the RED reference set (DST-03 traceability)"

key-files:
  created: []
  modified:
    - plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md
    - plugins/lz-tdd/skills/lz-red/references/principle-backing.md

key-decisions:
  - "D-01/D-02: F.I.R.S.T. (owned) authored own-words BLIND from the 17-RESEARCH planning grain; the four pillars + the three assertion styles (Khorikov, no-oracle) authored blind from high-confidence core -- no .oracle/ read in main context"
  - "D-03: ASRT-01 closed -- the four pillars land with resistance-to-refactoring named the LOAD-BEARING pillar (assert observable behavior, not implementation); F.I.R.S.T. co-lands as the test-quality baseline"
  - "D-04: ASRT-02 closed -- the output/state/communication selection rule ties output to the functional core, state/communication to the Metz boundary, and characterization to Feathers legacy, linking functional-core.md / message-matrix.md / seams-and-legacy.md"
  - "D-15: co-edit boundary held -- the Phase-16 STR slice is untouched; the Phase-18 F.I.R.S.T.-as-baseline PROCEDURE (LAW-02) marker remains in the assertions slice; principle-backing leaves a Phase-18 marker for the Three-Laws (LAW-01/02) and lz-tpp seam (SEAM-01/02) rows; the SKILL.md body is not edited"

requirements-completed: [ASRT-01, ASRT-02]

coverage:
  - id: ASRT-01
    description: "Assert observable behavior, not implementation, via Khorikov's four pillars with resistance-to-refactoring as the load-bearing property, plus F.I.R.S.T. as the test-quality baseline -- authored own-words in the assertions slice"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs shows test-structure-and-assertions.md rows PASS (four pillars, resistance to refactoring, F.I.R.S.T., observable behavior)"
        status: pass
    human_judgment: false
  - id: ASRT-02
    description: "Output/state/communication assertion-style selection tied to the stance router, linking the three stance leaves (functional-core.md / message-matrix.md / seams-and-legacy.md)"
    verification:
      - kind: automated
        ref: "check-red-references.mjs shows the communication-based token + all three stance-leaf filename tokens PASS on the assertions slice"
        status: pass
    human_judgment: false
  - id: DST-03
    description: "principle-backing.md maps every RED recommendation to its source + access tier using the canonical owned/no-oracle tier strings, with sibling-relative links and a Phase-18 deferral marker"
    verification:
      - kind: automated
        ref: "check-red-references.mjs shows principle-backing.md rows PASS (oracle-verified tier, no-oracle tier, >=1 recommendation link, Khorikov, no scaffold, Phase-18 marker)"
        status: pass
    human_judgment: false

# Metrics
duration: ~15min
completed: 2026-07-19
status: complete
---

# Phase 17 Plan 02: Assertion Design Slice + Principle-Backing Map Summary

**Filled the ASRT slice of test-structure-and-assertions.md own-words -- Khorikov's four pillars (resistance-to-refactoring named the load-bearing pillar = assert observable behavior, not implementation), F.I.R.S.T. as the test-quality baseline (Clean Code Ch.9, authored BLIND, oracle-reviewer gate deferred to 17-06), and the output/state/communication selection rule linking the three stance leaves -- and populated principle-backing.md as a Recommendation | Source | Access-tier map across all RED docs, with the STR slice and both Phase-18 markers left intact and typecheck + hygiene GREEN.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-07-19
- **Completed:** 2026-07-19
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Filled the assertions slice of `test-structure-and-assertions.md` (replacing the Phase-17 deferral stub), renaming the heading to drop the "(Phase 17)" literal so the instrument's inverted deferral guard cannot false-match:
  - **The four pillars** (Vladimir Khorikov, no-oracle): protection against regressions, resistance to refactoring, fast feedback, and maintainability -- with resistance-to-refactoring named the LOAD-BEARING pillar and framed explicitly as "assert observable behavior, not implementation."
  - **F.I.R.S.T.** (Robert C. Martin, Clean Code Ch.9, owned): Fast / Independent / Repeatable / Self-validating / Timely as the test-quality baseline the four pillars sit on -- every gloss authored own-words BLIND from the 17-RESEARCH planning grain (the acronym expansion is a plain fact), carrying the `(Robert C. Martin, owned; oracle-verified)` attribution on the distilled line; the oracle-reviewer converge-to-clean gate on this owned prose is deferred to the orchestrator in Plan 17-06.
  - **The ASRT-02 selection rule**: prefer output-based (the functional core), use state-based for a state change, use communication-based ONLY for a genuine outgoing command, use characterization for untested legacy -- linking `testing-stance/functional-core.md`, `testing-stance/message-matrix.md`, and `testing-stance/seams-and-legacy.md` (the spine that ties the assertions slice to the three stance leaves; each leaf carries its own assert rule).
  - **One tsc-strict output-based Vitest fence** (self-contained `netOf` module) pinning a returned value, mirroring the STR-slice fence shape.
  - A labelled **Phase-18 F.I.R.S.T.-as-baseline PROCEDURE (LAW-02) marker** so the co-edit deferral guard holds; the provenance blockquote and `## Sources` were extended with the Khorikov (no-oracle) row and the F.I.R.S.T./Clean Code owned attribution.
- Populated `principle-backing.md` as a **Recommendation | Source | Access tier** table (24 rows) spanning every RED reference surface -- selection, structure, naming, assertions, stance, anti-patterns, and mechanics -- each Recommendation a sibling-relative Markdown link to the doc that states it, each tier using the canonical strings verbatim (`Owned; oracle-verified against the clean-room source.` / `Unowned; high-confidence core only (no-oracle).`). Rewrote the `## Sources (placeholder)` heading to a plain `## Sources` and left a labelled Phase-18 marker for the deferred Three-Laws (LAW-01/02) and lz-tpp seam (SEAM-01/02) backing rows.
- Held the co-edit boundary (D-15): the Phase-16 STR slice is byte-unchanged, both Phase-18 markers remain, and the SKILL.md body was not touched.

## Task Commits

Each task was committed atomically:

1. **Task 1: Fill the ASRT slice (four pillars, F.I.R.S.T., selection rule)** - `132dae0` (feat)
2. **Task 2: Populate principle-backing.md (source-to-recommendation map + access tiers)** - `a66b94f` (feat)

**Plan metadata:** committed with STATE.md + ROADMAP.md + REQUIREMENTS.md (docs: complete plan)

## Files Created/Modified

- `plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md` - Replaced the ASRT deferral stub with the four pillars + F.I.R.S.T. + the output/state/communication selection rule + one tsc-strict output-based Vitest fence + a Phase-18 LAW-02 marker; extended the provenance blockquote and Sources. STR slice (Phase 16) untouched.
- `plugins/lz-tdd/skills/lz-red/references/principle-backing.md` - Replaced the placeholder with a 24-row Recommendation | Source | Access tier map across all RED docs + a Phase-18 deferral marker + a plain `## Sources` summary.

## Verification

- `npm --prefix .claude/skills/lz-red-workspace run typecheck` exits 0 -- 4 tsc-strict modules clean (the new output-based fence compiled alongside the 3 carried-over Phase-16 fences).
- `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` exits 0 -- ASCII + work-email allowlist (198 files) + no-verbatim (191 files) all clean.
- `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs`: all 16 rows for `test-structure-and-assertions.md` and all 6 rows for `principle-backing.md` PASS; the overall gate still exits 1 by design (the four sibling Wave-2 stubs -- testing-stance/README, functional-core, message-matrix, seams-and-legacy, vitest-typescript-mechanics, anti-patterns -- remain RED until Plans 17-03/17-04/17-05 land). The RED count dropped from 29 (17-01 baseline) to 18; no regression on the three-laws or naming rows.

## Decisions Made

- **ASRT-01 and ASRT-02 marked complete.** This plan authors the content that satisfies both: ASRT-01 (the four pillars + observable-behavior framing) is wholly within this plan; ASRT-02 (the selection rule + the tie to the stance router) is authored here as the spine and links the three leaf destinations by filename. The leaf plans (17-03/17-04) author each leaf's own assert rule (RTR-01/ASRT-03), not ASRT-02 itself. The orchestrator's `verify_phase_goal` remains the final cross-check after all waves.
- **F.I.R.S.T. authored own-words BLIND; oracle gate deferred.** Per D-01/D-14, the owned F.I.R.S.T. surface is drafted from the 17-RESEARCH planning grain in original wording with no `.oracle/` read in main context; the orchestrator runs the oracle-reviewer converge-to-clean loop on this prose in Plan 17-06. The deterministic no-verbatim scan (check-hygiene) is already GREEN this plan.
- **State-handler arg format.** `state.record-metric` and `state.add-decision` take named flags (`--phase`, `--plan`, `--duration`, `--tasks`, `--files`, `--summary`), not positional args; re-invoked accordingly. `config.json`'s `_auto_chain_active` flag is orchestrator-owned and left uncommitted (outside this plan's commit scope).

## Deviations from Plan

None - the plan executed exactly as written. Every acceptance criterion and both `<verify>` gates pass as specified; the content, links, fence, Phase-18 markers, and Sources rewrites match the task actions.

## Issues Encountered

None. All three gates returned their expected results on the first content run per task (typecheck 0, hygiene 0, the two authored files GREEN in check-red-references while the sibling stubs stay RED by design).

## Known Stubs

None introduced by this plan. The sibling Wave-2 stubs (testing-stance leaves, vitest-typescript-mechanics, anti-patterns) remain unfilled by design -- they are owned by Plans 17-03/17-04/17-05 and are not in this plan's scope.

## Self-Check: PASSED

- `plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md` exists on disk (assertions slice filled; STR slice intact).
- `plugins/lz-tdd/skills/lz-red/references/principle-backing.md` exists on disk (backing map populated).
- Commit `132dae0` (Task 1) exists on the branch and contains the assertions-slice fill.
- Commit `a66b94f` (Task 2) exists on the branch and contains the principle-backing map.
- Both commits carry the public gmail author + committer identity; check-hygiene work-email allowlist GREEN.

## Next Plan Readiness

- The assertions slice is the ASRT-02 spine: it links to `functional-core.md`, `message-matrix.md`, and `seams-and-legacy.md`, which Plans 17-03 and 17-04 author. Those links resolve to real content only once the sibling leaves land; the full check-red-references gate flips GREEN when Plans 17-03/17-04/17-05 complete.
- The owned F.I.R.S.T. prose awaits the orchestrator's oracle-reviewer converge-to-clean gate in Plan 17-06 (deferred by design; main context never read `.oracle/`).
- No blockers. typecheck + hygiene GREEN floor intact; no shipped dependency added.

---
*Phase: 17-assertion-design-stance-router-ts-vitest-mechanics*
*Completed: 2026-07-19*
