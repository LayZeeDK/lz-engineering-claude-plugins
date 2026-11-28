---
phase: 17-assertion-design-stance-router-ts-vitest-mechanics
verified: 2026-07-19T00:00:00Z
status: passed
score: 14/14 must-haves verified (9 requirements + 5 success criteria)
behavior_unverified: 0
overrides_applied: 0
deferred:
  - truth: "VIT-02 'throughout SKILL.md' worked-example clause"
    addressed_in: "Phase 18"
    evidence: "17-CONTEXT D-10 + Deferred section: the SKILL.md body is owned by the Phase-18 coach procedure; Phase 17 satisfies VIT-02 via examples in the references only. REQUIREMENTS.md traceability marks VIT-02 -> Phase 18. ROADMAP Success Criterion 4 requires examples 'throughout the references' only, which is met."
  - truth: "LAW-01/LAW-02 Three Laws spine + fail-for-the-right-reason PROCEDURE + F.I.R.S.T.-as-baseline step"
    addressed_in: "Phase 18"
    evidence: "Phase 18 Success Criteria 1 + 3; deferral markers present in test-structure-and-assertions.md, three-laws-and-test-selection.md, vitest-typescript-mechanics.md, principle-backing.md"
  - truth: "RTR-02 coach routing step that wires the stance index into SKILL.md + override phrase"
    addressed_in: "Phase 18"
    evidence: "Phase 18 Success Criterion 2; Phase 17 authors the index CONTENT (testing-stance/README.md), Phase 18 wires it"
  - truth: "SEAM-01 classify-first + lz-tpp seam"
    addressed_in: "Phase 18"
    evidence: "Phase 18 Success Criteria 1 + 3-4; deferral markers present in three-laws-and-test-selection.md + principle-backing.md"
---

# Phase 17: Assertion Design, Stance Router & TS/Vitest Mechanics Verification Report

**Phase Goal:** The differentiator content exists -- assertion design tied to the adaptive testing-stance router, plus the TypeScript + Vitest mechanics and the anti-pattern / Test Desiderata references.
**Verified:** 2026-07-19
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

The phase goal is achieved. All nine phase requirements (ASRT-01/02/03, RTR-01, RTR-03, VIT-01, VIT-02, ANTI-01, ANTI-02) and all five ROADMAP Success Criteria have delivering content that exists in the shipped tree, is substantive (not stubbed), is correctly wired (cross-links resolve), and passes every deterministic gate (content, tsc --strict, hygiene, plugin validate). The co-edit boundary is honored: every Phase-18 insertion-point marker (LAW spine, fail-for-the-right-reason procedure, classify-first/lz-tpp seam, RTR-02 SKILL.md wiring) remains intact rather than being filled early.

### Observable Truths -- ROADMAP Success Criteria

| # | Success Criterion | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Assert observable behavior, not implementation (Khorikov four pillars, resistance-to-refactoring load-bearing) + output/state/communication selection tied to stance | VERIFIED | `test-structure-and-assertions.md` "Assert observable behavior: the four pillars" (four pillars named; resistance-to-refactoring explicitly LOAD-BEARING) + "Select the assertion style: output, state, communication" mapping output->functional-core, state/communication->Metz message-matrix boundary, characterization->seams-and-legacy, each linked to its leaf |
| 2 | `testing-stance/` subdir: nav README (signals + route table) + 3 leaves (Bernhardt/Metz/Feathers); Feathers cross-linked to lz-refactor, not copied | VERIFIED | `testing-stance/` contains README.md (navigation-only route table + detection signals), functional-core.md (Bernhardt), message-matrix.md (Metz), seams-and-legacy.md (Feathers). Feathers leaf links `../../../lz-refactor/references/refactoring-without-tests.md` (target confirmed present, 5951 bytes) under an explicit "cross-link, not copied" section |
| 3 | Metz query/command matrix as design-agnostic assert-vs-mock rule; "listen to the tests" = design feedback (route to core/seam, not more doubles; GOOS counterpoint only) | VERIFIED | `message-matrix.md` full 6-cell matrix, only outgoing-command warrants a double, "the design of the object does not change the rule; the kind of message does". `anti-patterns.md` "Listen to the tests" routes pain toward functional core or seam, warns against another double; GOOS stated fairly as counterpoint, classicist default held |
| 4 | Vitest 4.x mechanics mapped to RED (it.todo/test.each/vi.* restraint/watch); TS+Vitest examples throughout references, tsc --strict clean | VERIFIED | `vitest-typescript-mechanics.md` maps it.todo (test list), test.each/it.each (triangulation), vi.fn/spyOn/mock (restraint), watch mode (feedback loop), read-the-red-bar; pinned Vitest 4.1.10. tsc gate: 7 modules extracted, 0 skipped, `tsc --strict --noEmit` exit 0 |
| 5 | Anti-pattern leaf names RED anti-patterns + observable-behavior fix (incl. Cooper over-mock/test-per-class, private methods, multiple assertions, pass-immediately, snapshot-as-thinking, slow/order-dependent) + Test Desiderata tradeoff lens in heuristic-not-law voice | VERIFIED | `anti-patterns.md` "The six anti-patterns" -- all six with Recognize-by cue + observable-behavior Correction; "Test Desiderata: a tradeoff lens" presents Beck's properties as a heuristic ("not as a checklist"), "coach-not-law voice" |

### Observable Truths -- Phase Requirements

| Req | Truth | Status | Evidence |
| --- | --- | --- | --- |
| ASRT-01 | Assert observable behavior; Khorikov four pillars, resistance-to-refactoring load-bearing | VERIFIED | `test-structure-and-assertions.md` four-pillars section; content gate token `four pillars` + `resistance to refactoring` + `observable behavior` PASS |
| ASRT-02 | Output/state/communication selection tied to the stance router | VERIFIED | `test-structure-and-assertions.md` selection section + each leaf's own assert rule (functional-core output-based; message-matrix state/communication; seams-and-legacy `Assert rule (ASRT-02)` characterization); content gate `communication-based selection` + three `links ...md` PASS |
| ASRT-03 | Metz query/command matrix; expect-to-send only for outgoing command | VERIFIED | `message-matrix.md` matrix + firewall; content gate incoming/outgoing query+command + `expect-to-send warranted double` PASS; owned + oracle-verified (Magic Tricks) |
| RTR-01 | testing-stance subdir: 3 leaves; Feathers cross-linked not copied | VERIFIED | 4 files present; cross-link guard `cross-link refactoring-without-tests.md` PASS; target file present |
| RTR-03 | Listen-to-the-tests routes to core/seam; GOOS counterpoint only | VERIFIED | `anti-patterns.md` "Listen to the tests"; content gate `listen to the tests` + `GOOS counterpoint` PASS |
| VIT-01 | Vitest 4.x mechanics mapped to RED; ADV forward-pointer; tsc-strict | VERIFIED | `vitest-typescript-mechanics.md`; content gate it.todo/test.each/vi.* restraint/watch/fails-for-right-reason/ADV-pointer PASS; fence tsc-strict clean; pinned 4.1.10 |
| VIT-02 | TS+Vitest examples throughout references, tsc --strict clean | VERIFIED (references scope) | 7 modules `tsc --strict` clean, 0 skipped, exit 0. "throughout SKILL.md" clause deferred to Phase 18 per D-10 (SKILL.md body owned by coach procedure) -- see Deferred Items; Success Criterion 4 (references only) fully met |
| ANTI-01 | Six named RED anti-patterns + observable-behavior fix incl. Cooper | VERIFIED | `anti-patterns.md` six entries; content gate over-mock/private/multiple-assertions/passes-immediately/snapshot/slow-order-dependent PASS; Cooper owned + oracle-verified |
| ANTI-02 | Test Desiderata tradeoff lens, heuristic-not-law voice | VERIFIED | `anti-patterns.md` Test Desiderata section; content gate `Test Desiderata` + `tradeoff/heuristic lens` PASS; Beck owned + oracle-verified |

**Score:** 14/14 truths verified (0 present-behavior-unverified)

### Deferred Items

Items not delivered in Phase 17 but explicitly scheduled for a later milestone phase -- not actionable gaps.

| # | Item | Addressed In | Evidence |
| --- | --- | --- | --- |
| 1 | VIT-02 "throughout SKILL.md" worked-example clause | Phase 18 | D-10 + CONTEXT Deferred; SKILL.md body owned by Phase-18 coach procedure; REQUIREMENTS traceability marks VIT-02 -> Phase 18. Phase 17 satisfies VIT-02 via references examples |
| 2 | LAW-01/02 Three Laws spine + fail-for-right-reason procedure + F.I.R.S.T.-as-baseline step | Phase 18 | Phase 18 SC 1 + 3; deferral markers present and intact in 4 references |
| 3 | RTR-02 coach routing step wiring the stance index into SKILL.md + override phrase | Phase 18 | Phase 18 SC 2; Phase 17 authors index CONTENT, Phase 18 wires it |
| 4 | SEAM-01 classify-first + forward lz-tpp seam | Phase 18 | Phase 18 SC 1 + 3; deferral markers intact |

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `references/test-structure-and-assertions.md` | ASRT-01/02 four pillars + F.I.R.S.T. + selection (STR slice intact) | VERIFIED | Assertion slice filled; STR slice retained; two tsc-clean fences; Phase-18 F.I.R.S.T.-baseline marker retained |
| `references/testing-stance/README.md` | Navigation index (signals + route table), no stance content | VERIFIED | Route table with 3 signals -> 3 leaves; navigation-only; no-default-stance note |
| `references/testing-stance/functional-core.md` | Bernhardt FCIS; output-based assert; no doubles in core | VERIFIED | Owned (Boundaries, oracle-verified); tsc-clean fence |
| `references/testing-stance/message-matrix.md` | Metz query/command matrix; expect-to-send | VERIFIED | Owned (Magic Tricks, oracle-verified); 6-cell matrix; tsc-clean fence with vi.fn expect-to-send |
| `references/testing-stance/seams-and-legacy.md` | Feathers seams+characterization; cross-link to lz-refactor | VERIFIED | Cross-link resolves; RED-step framing only; refactor-step techniques cross-linked not copied |
| `references/vitest-typescript-mechanics.md` | Vitest 4.x -> RED; ADV pointers | VERIFIED | All named mechanics; ADV-01/02 forward-pointers only (no fast-check dep); tsc-clean fence |
| `references/anti-patterns.md` | Six anti-patterns + listen-to-tests + Test Desiderata | VERIFIED | ANTI-01 + ANTI-02 + RTR-03 all present |
| `references/principle-backing.md` | Co-edit: Phase-17 backing rows + tiers | VERIFIED | Rows added for four pillars, F.I.R.S.T., selection, functional-core, message-matrix, seams, Cooper, Metz Design-of-Tests, Khorikov, GOOS, Beck, Vitest; Phase-18 rows deferred + marked |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| `test-structure-and-assertions.md` | `testing-stance/{functional-core,message-matrix,seams-and-legacy}.md` | selection-to-stance markdown links | WIRED | All three links present (content gate PASS) |
| `testing-stance/README.md` | 3 leaves | route-table markdown links | WIRED | All three links present |
| `testing-stance/seams-and-legacy.md` | `lz-refactor/references/refactoring-without-tests.md` | `../../../` relative cross-link | WIRED | Path resolves; target present (5951 bytes) |
| `vitest-typescript-mechanics.md` | `testing-stance/message-matrix.md`, `anti-patterns.md` | doubles-with-restraint + listen-to-tests links | WIRED | Both cross-refs present |
| `anti-patterns.md` | `functional-core.md`, `seams-and-legacy.md`, `message-matrix.md`, `test-structure-and-assertions.md` | listen-to-tests routing + one-concept link | WIRED | All present |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| --- | --- | --- | --- |
| RED-reference content gate | `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` | exit 0 -- "RED-REFS GREEN -- 10/10", every token/fence/cross-link/marker PASS | PASS |
| Every TS fence tsc --strict clean | `npm --prefix .claude/skills/lz-red-workspace run typecheck` | exit 0 -- 7 modules extracted, 0 skipped, tsc --strict --noEmit clean | PASS |
| ASCII + work-email allowlist + no-verbatim | `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` | exit 0 -- 198 files ASCII, no non-allowlisted emails, 191 files no-verbatim clean | PASS |
| First-party structural validation | `claude plugin validate .` | exit 0 -- "Validation passed" | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| --- | --- | --- | --- | --- |
| ASRT-01 | 17-02 | Assert observable behavior, four pillars | SATISFIED | test-structure-and-assertions.md |
| ASRT-02 | 17-02/03/04 | Output/state/communication selection tied to router | SATISFIED | assertions slice + 3 leaf assert-rules |
| ASRT-03 | 17-04 | Metz query/command matrix | SATISFIED | message-matrix.md |
| RTR-01 | 17-03/04 | testing-stance subdir + 3 leaves, Feathers cross-linked | SATISFIED | testing-stance/ tree + resolved cross-link |
| RTR-03 | 17-05 | Listen-to-the-tests; GOOS counterpoint only | SATISFIED | anti-patterns.md |
| VIT-01 | 17-04 | Vitest 4.x mechanics -> RED | SATISFIED | vitest-typescript-mechanics.md |
| VIT-02 | 17-02/03/04 | TS+Vitest examples throughout (references scope) | SATISFIED | 7 modules tsc-strict clean; SKILL.md clause -> Phase 18 (deferred) |
| ANTI-01 | 17-05 | Six anti-patterns + Cooper | SATISFIED | anti-patterns.md |
| ANTI-02 | 17-05 | Test Desiderata tradeoff lens | SATISFIED | anti-patterns.md |

No orphaned requirements: all nine Phase-17 requirements in REQUIREMENTS.md are claimed by a plan and delivered.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| `vitest-typescript-mechanics.md` | 27 | word "placeholders" | Info | Benign -- "printf-style placeholders" describes Vitest `test.each` title syntax, not a stub |

No debt markers (TBD/FIXME/XXX) in any modified file. No stub returns, no empty implementations, no "coming soon"/"not implemented" leaks.

### Human Verification Required

None. The two VALIDATION.md "manual-only" items are already resolved this pass:
- Own-words fidelity of owned surfaces (Metz matrix, F.I.R.S.T., Cooper, plus the pass-upgraded Bernhardt functional-core and Beck Test Desiderata) -- oracle-reviewer PASS on all owned surfaces + no-verbatim scan GREEN (hygiene: 191 files clean).
- Assertion-style-to-stance aptness (ASRT-02) -- skill-reviewer PASS (>= 1 unbiased) established this pass.

All Phase-17 truths are documentation content verifiable by direct file read + deterministic gates; none assert a runtime state transition or cancellation/cleanup/ordering invariant, so there are no present-behavior-unverified items.

### Gaps Summary

No gaps. The differentiator content exists, is substantive, is correctly wired (all cross-links resolve including the lz-refactor Feathers cross-link), and every deterministic gate is GREEN. The co-edit boundary is respected -- the LAW spine, fail-for-the-right-reason procedure, classify-first/lz-tpp seam, RTR-02 SKILL.md wiring, and VIT-02's SKILL.md worked-example clause are intentionally deferred to Phase 18 with their insertion-point markers intact, and are recorded as Deferred Items rather than gaps.

---

_Verified: 2026-07-19_
_Verifier: Claude (gsd-verifier)_
