---
phase: 17-assertion-design-stance-router-ts-vitest-mechanics
plan: 03
subsystem: lz-red-references
tags: [stance-router, navigation-index, functional-core, imperative-shell, bernhardt, fcis, feathers, seams, characterization, legacy-code, output-based, no-doubles, cross-link, no-oracle, clean-room, dst-04, tsc-strict, vitest, lz-red]

# Dependency graph
requires:
  - phase: 17-assertion-design-stance-router-ts-vitest-mechanics
    plan: 01
    provides: the check-red-references.mjs Phase-17 RED baseline for the testing-stance leaves (README detection-signal/route-table tokens, functional-core FCIS tokens + requireFence, seams seam/characterization/sequencing tokens + the refactoring-without-tests.md cross-link presence guard)
  - phase: 15-lz-red-skill-scaffold
    provides: the testing-stance/{README,functional-core,seams-and-legacy}.md stubs with per-doc content contracts and the deferred cross-link marker
  - phase: 16-source-distillation-core-red-references
    provides: the lz-red-workspace tsc extractor (typescript / vitest) and the naming.md / three-laws house-style fence + Sources analogs; the lz-refactor refactoring-without-tests.md cross-link target
provides:
  - the nav-only testing-stance/README.md route table (RTR-01 navigation spine) -- 3 detection-signal -> leaf rows, recognize-by + links only, no stance content of its own
  - the functional-core.md leaf (Bernhardt FCIS, no-oracle) -- Signal / output-based Assert rule / no-doubles Mock rule, scoped to value-in-value-out code, with one tsc-strict output-based Vitest fence
  - the seams-and-legacy.md leaf (Feathers, no-oracle) -- seam / characterization (pins CURRENT behavior) / sequencing as RED-step framing, cross-linked to lz-refactor's refactoring-without-tests.md rather than copied
affects: [17-04, 17-05, 17-06, phase-18-coach-routing]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Navigation-only index mirrors lz-refactor smells.md: the README carries recognize-by signals + leaf links ONLY; all assert/mock stance content lives in the leaves (Pitfall 4 avoided)"
    - "No-oracle BLIND authoring of two unowned stance leaves (Bernhardt FCIS, Feathers seams) from high-confidence core -- own words, no .oracle/ read, deterministic no-verbatim scan the only DST-04 backstop"
    - "Cross-skill link not copy: the Feathers leaf points at lz-refactor's refactoring-without-tests.md via ../../../lz-refactor/references/... for the refactor-step technique bodies; the RED/refactor seam stays clean and the no-verbatim gate stays GREEN"
    - "FCIS scoped, not defaulted (Pitfall 3): functional-core.md applies only when the code IS value-in/value-out; the README encodes no-default routing and sends no-seam legacy to seams-and-legacy.md"

key-files:
  created: []
  modified:
    - plugins/lz-tdd/skills/lz-red/references/testing-stance/README.md
    - plugins/lz-tdd/skills/lz-red/references/testing-stance/functional-core.md
    - plugins/lz-tdd/skills/lz-red/references/testing-stance/seams-and-legacy.md

key-decisions:
  - "D-02: Bernhardt (FCIS) and Feathers (seams/characterization) authored BLIND from high-confidence core -- no .oracle/ read in main context; the check-hygiene no-verbatim scan (>=120-char quoted run) is the only DST-04 backstop for these two no-oracle leaves"
  - "D-04: ASRT-02 per-leaf assert rules landed -- functional-core carries the output-based rule (feed inputs, assert the returned value), seams-and-legacy carries the characterization rule (pin CURRENT behavior, not desired)"
  - "D-06: RTR-01 authored at content grain -- README nav-only route table + 2 no-oracle leaves; the Feathers leaf CROSS-LINKS refactoring-without-tests.md (RED-step framing only), it does not copy the refactor-step technique bodies"
  - "D-15: co-edit boundary held -- filled only the RTR-01 index/leaf content; the SKILL.md body is untouched; the README carries no Phase-18 RTR-02 wiring in its nav content"
  - "RTR-01 NOT marked complete this plan (accuracy): RTR-01 requires all three leaves (Bernhardt + Metz + Feathers); this plan lands the navigation spine + the 2 no-oracle leaves, but the owned Metz message-matrix.md leaf is Plan 17-04 and remains a stub. RTR-01 is left Pending for 17-04 to close so REQUIREMENTS.md carries no false-positive. ASRT-02 (already Complete from 17-02) is reinforced here."

requirements-completed: [ASRT-02]

coverage:
  - id: RTR-01-nav
    description: "testing-stance/README.md is a NAVIGATION-ONLY index: a 3-row detection-signal -> leaf route table linking functional-core.md / message-matrix.md / seams-and-legacy.md, carrying recognize-by signals + links only (no assert/mock stance content)"
    requirement: RTR-01
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs shows testing-stance/README.md rows PASS (detection signal, route table, links to all 3 leaves, no scaffold)"
        status: pass
    human_judgment: false
  - id: RTR-01-functional-core
    description: "functional-core.md (Bernhardt FCIS, no-oracle) carries Signal / output-based Assert rule / no-doubles Mock rule scoped to value-in-value-out code, with a tsc-strict output-based Vitest fence"
    requirement: RTR-01
    verification:
      - kind: automated
        ref: "check-red-references.mjs shows testing-stance/functional-core.md rows PASS (functional core, imperative shell, value/output-based, no doubles, >=1 ts fence, no scaffold); npm run typecheck exits 0"
        status: pass
    human_judgment: false
  - id: RTR-01-seams-legacy
    description: "seams-and-legacy.md (Feathers, no-oracle) carries seam / characterization / sequencing as RED-step framing and CROSS-LINKS refactoring-without-tests.md rather than copying it"
    requirement: RTR-01
    verification:
      - kind: automated
        ref: "check-red-references.mjs shows testing-stance/seams-and-legacy.md rows PASS (seam, characterization, sequencing, refactoring-without-tests.md cross-link, no scaffold); cross-link target resolves on disk"
        status: pass
    human_judgment: false
  - id: ASRT-02-per-leaf
    description: "ASRT-02 per-leaf assert rules: functional-core = output-based over the pure core (no doubles); seams-and-legacy = characterization pins CURRENT behavior"
    requirement: ASRT-02
    verification:
      - kind: automated
        ref: "the output-based rule and characterization (pin current behavior) rule are present and topic-token GREEN in check-red-references.mjs"
        status: pass
    human_judgment: false
  - id: RTR-01-complete
    description: "RTR-01 as a whole (all three testing-stance leaves authored, Feathers cross-linked) -- the owned Metz message-matrix.md leaf remains a Plan 17-04 stub, so RTR-01 is not yet closed"
    verification: []
    human_judgment: true
    rationale: "RTR-01 spans 17-03 (nav + 2 no-oracle leaves) and 17-04 (owned message-matrix leaf). This plan cannot close RTR-01 alone; the phase verifier confirms full closure after Wave-2 completes."

# Metrics
duration: ~8min
completed: 2026-07-19
status: complete
---

# Phase 17 Plan 03: Testing-Stance Navigation Index + Two No-Oracle Stance Leaves Summary

**Authored the testing-stance router's navigation half plus its two blind-authored stance leaves: a nav-only README route table (3 detection-signal -> leaf rows, recognize-by + links only), the Bernhardt functional-core leaf (Signal / output-based Assert rule / no-doubles Mock rule, scoped to value-in-value-out code, with one tsc-strict Vitest fence), and the Feathers seams-and-legacy leaf (seam / characterization pinning CURRENT behavior / sequencing, cross-linked to lz-refactor's refactoring-without-tests.md, not copied) -- all own-words no-oracle, SKILL.md untouched, typecheck + hygiene GREEN.**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-07-19T04:48:18Z
- **Completed:** 2026-07-19T04:56:09Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Filled `testing-stance/README.md` as a NAVIGATION-ONLY index (Pitfall 4 avoided) mirroring lz-refactor's smells.md convention: a 3-row route table mapping each detection signal to its leaf link -- value-in/value-out -> [functional-core.md], object with collaborators / query-command split -> [message-matrix.md], untested legacy / hidden I/O / no place to assert -> [seams-and-legacy.md]. Carries recognize-by signals + links only; encodes no-default routing (Pitfall 3: FCIS is achieved, no-seam legacy routes to Feathers); rewrote `## Sources (placeholder)` to a router-only `## Sources`.
- Authored `testing-stance/functional-core.md` own-words (Bernhardt FCIS, no-oracle): the functional-core-vs-imperative-shell design, the value-in/value-out Signal, the output-based Assert rule (feed inputs, assert the returned value -- named the highest-resistance-to-refactoring style, ASRT-02), and the no-doubles Mock rule (purity removes the reason to mock; the shell gets a thin band of integration tests). Scoped strictly to value-in/value-out code (Pitfall 3: not presented as the default; no-seam legacy routes to seams-and-legacy.md). Added one self-contained tsc-strict output-based Vitest fence (a pure `nextBalance` core, assert the returned value, no doubles) mirroring the three-laws fence shape; rewrote Sources with a Bernhardt no-oracle row.
- Authored `testing-stance/seams-and-legacy.md` own-words (Feathers, no-oracle), RED-step framing ONLY: the seam (the substitution/observation point where a test can assert), the characterization test (run the code, record the value it actually produces today, assert exactly that -- Assert rule pins CURRENT behavior, not desired), and the sequencing (seam -> characterization -> then the new red test). Added the cross-link `[refactoring-without-tests.md](../../../lz-refactor/references/refactoring-without-tests.md)` for the refactor-step technique bodies instead of duplicating them (RTR-01, cross-link not copy); rewrote Sources with a Feathers no-oracle row noting cross-linked-not-copied.
- Held the co-edit boundary (D-15): the SKILL.md body was not touched, and the README's nav content carries no Phase-18 RTR-02 wiring.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author testing-stance/README.md (navigation-only route table)** - `60ddee7` (feat)
2. **Task 2: Author functional-core.md (Bernhardt FCIS, output-based, no doubles)** - `e7f79d7` (feat)
3. **Task 3: Author seams-and-legacy.md (Feathers, characterization, cross-linked to lz-refactor)** - `abf407b` (feat)

**Plan metadata:** committed with STATE.md + ROADMAP.md (docs: complete plan)

## Files Created/Modified

- `plugins/lz-tdd/skills/lz-red/references/testing-stance/README.md` - Replaced the stub content-contract + placeholder Sources with a nav-only route table (3 detection-signal -> leaf rows), a no-default routing note, and a router-only Sources section. No fence (nav-only; the extractor skips READMEs).
- `plugins/lz-tdd/skills/lz-red/references/testing-stance/functional-core.md` - Replaced the stub with the FCIS stance own-words: Signal / output-based Assert rule / no-doubles Mock rule, scoped to value-in/value-out code (Pitfall 3), one tsc-strict output-based Vitest fence, and a Bernhardt no-oracle Sources row.
- `plugins/lz-tdd/skills/lz-red/references/testing-stance/seams-and-legacy.md` - Replaced the stub with the Feathers RED-step framing own-words: seam / characterization (pins CURRENT behavior) / sequencing, plus the refactoring-without-tests.md cross-link (not a copy) and a Feathers no-oracle Sources row.

## Verification

- `npm --prefix .claude/skills/lz-red-workspace run typecheck` exits 0 -- 5 tsc-strict modules clean (the new functional-core output-based fence compiled alongside the 4 carried-over Phase-16/17 fences).
- `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` exits 0 -- ASCII + work-email allowlist (198 files) + no-verbatim (191 files) all clean; the seams leaf reproduced no lz-refactor prose (no-verbatim GREEN).
- `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs`: all rows for testing-stance/README.md (6/6), functional-core.md (6/6), and seams-and-legacy.md (5/5, incl. the cross-link presence guard) PASS. The overall gate still exits 1 BY DESIGN -- the sibling Wave-2/3 stubs (message-matrix.md -> 17-04; vitest-typescript-mechanics.md + anti-patterns.md -> 17-05/06) remain RED until their plans land. The RED count dropped from 18 (post-17-02) to 14; no regression on any prior-filled row.
- Cross-link target resolves on disk: `../../../lz-refactor/references/refactoring-without-tests.md` from the seams leaf reaches the real file.

## Decisions Made

- **RTR-01 left Pending; only ASRT-02 marked (accuracy over mechanical marking).** The plan frontmatter lists `requirements: [RTR-01, ASRT-02]`, but RTR-01's own definition in REQUIREMENTS.md requires all THREE testing-stance leaves (Bernhardt + Metz + Feathers, Feathers cross-linked). This plan lands the navigation spine + the two no-oracle leaves (Bernhardt, Feathers); the owned Metz `message-matrix.md` leaf is Plan 17-04 and is still a stub. Marking RTR-01 complete now would be a false-positive in the traceability table while a required leaf is unauthored. RTR-01 is therefore left `[ ]` Pending for Plan 17-04 (which also lists RTR-01) to close when the message-matrix leaf lands; the orchestrator's `verify_phase_goal` is the final cross-check. ASRT-02 (already Complete from 17-02) is reinforced by the two per-leaf assert rules authored here and re-marked idempotently.
- **Both no-oracle leaves authored BLIND (D-02).** No `.oracle/` file was read in main context. Bernhardt (FCIS) and Feathers (seams/characterization) prose is original wording from the 17-RESEARCH/17-PATTERNS planning grain; technique NAMES are kept as plain facts. The deterministic no-verbatim scan (check-hygiene, >=120-char quoted-run proxy) is GREEN and is the only DST-04 backstop for these two leaves (there is no owned surface here to run the oracle-reviewer loop against). The phase-gate skill-reviewer PASS (Plan 17-06) remains the human-grade backstop.

## Deviations from Plan

None to the task actions -- all three tasks executed exactly as written; every acceptance criterion and every `<verify>` gate passes as specified (route table + tokens, output-based fence compiling, characterization + cross-link, hygiene GREEN).

The one judgment call is at the state-update step, not in the authored content: RTR-01 was left Pending rather than marked complete (see Decisions Made) because a required leaf (message-matrix.md, Plan 17-04) is still a stub -- an accuracy-preserving choice that avoids a false-positive in REQUIREMENTS.md. This is flagged explicitly rather than silently applied.

## Issues Encountered

None. All three gates returned their expected results per task on the first content run (typecheck 0, hygiene 0, the three authored files GREEN in check-red-references while the sibling stubs stay RED by design).

## Known Stubs

None introduced by this plan. The sibling Wave-2/3 stubs (`testing-stance/message-matrix.md` -> Plan 17-04; `vitest-typescript-mechanics.md` and `anti-patterns.md` -> Plans 17-05/06) remain unfilled BY DESIGN -- they are out of this plan's scope and keep the overall check-red-references gate RED until their plans land (the documented instrument-first baseline).

## Self-Check: PASSED

- `plugins/lz-tdd/skills/lz-red/references/testing-stance/README.md` exists on disk (nav-only route table).
- `plugins/lz-tdd/skills/lz-red/references/testing-stance/functional-core.md` exists on disk (FCIS leaf + fence).
- `plugins/lz-tdd/skills/lz-red/references/testing-stance/seams-and-legacy.md` exists on disk (Feathers leaf + cross-link).
- Commit `60ddee7` (Task 1, README) exists on the branch.
- Commit `e7f79d7` (Task 2, functional-core) exists on the branch.
- Commit `abf407b` (Task 3, seams-and-legacy) exists on the branch.
- All three commits carry the public gmail author + committer identity (`larsbrinknielsen@gmail.com`); check-hygiene work-email allowlist GREEN.

## Next Plan Readiness

- The stance router's navigation spine + both no-oracle leaves are in place. Plan 17-04 authors the owned Metz `message-matrix.md` leaf (oracle-gated) -- the last leaf RTR-01 needs; once it lands, RTR-01 closes and the message-matrix rows flip GREEN in check-red-references.
- The seams leaf's cross-link resolves to lz-refactor's `refactoring-without-tests.md` (verified on disk); no duplication of refactor-step prose (no-verbatim GREEN).
- No blockers. typecheck + hygiene GREEN floor intact; no shipped dependency added; SKILL.md untouched (Phase-18 owns the RTR-02 wiring).

---
*Phase: 17-assertion-design-stance-router-ts-vitest-mechanics*
*Completed: 2026-07-19*
