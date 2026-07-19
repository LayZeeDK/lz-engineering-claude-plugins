---
phase: 16-source-distillation-core-red-references
plan: 02
subsystem: testing
tags: [lz-red, tdd, red-phase, vitest, typescript, clean-room, dst-04, references]

requires:
  - phase: 16-01
    provides: dev-only lz-red-workspace (tsc extractor, check-red-references RED baseline, widened check-hygiene) + approved pinned deps
provides:
  - Filled SEL slice of three-laws-and-test-selection.md (test list, one small step, degenerate-first, triangulation with the load-bearing lz-tpp-GREEN firewall)
  - Filled STR slice of test-structure-and-assertions.md (AAA + GWT one skeleton two vocabularies, assert-first, evident data, one-concept-per-test)
  - Fully filled naming.md (behavior/"should" primary + Osherove three-part alternative + match-house-stance)
  - Every reference carries >= 1 tsc --strict-clean Vitest example; every owned surface oracle-reviewer-passed
affects: [17-assertion-design-stance-router, 18-coach-procedure-seam]

tech-stack:
  added: [typescript@6.0.3 (dev-only workspace), vitest@4.1.10 (dev-only workspace)]
  patterns: [clean-room own-words authoring (author blind + orchestrator oracle-reviewer gate), tsc-strict Vitest fences with explicit vitest imports, co-edited stub slice-fill with later-phase deferral markers]

key-files:
  created: []
  modified:
    - plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
    - plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md
    - plugins/lz-tdd/skills/lz-red/references/naming.md
    - .claude/skills/lz-red-workspace/package-lock.json

key-decisions:
  - "Executor authored ALL surfaces blind (never read .oracle/); the orchestrator ran the oracle-reviewer owned-surface gate -- forced adaptation because gsd-executor has no Agent/Task tool and subagents cannot nest."
  - "Owned rationale threads (RCM one-small-step in SEL, RCM one-concept in STR, Metz name-for-behavior in NAME) authored from high-confidence core then oracle-reviewer-verified against the books; all 3 passed round 1."
  - "Vitest fences use explicit `import { describe, it, expect } from 'vitest'` so the workspace tsc gate resolves types from the installed node_modules (RESEARCH Pitfall 4)."

patterns-established:
  - "Clean-room owned-surface gate: author blind -> orchestrator spawns oracle-reviewer (CONTENT_TYPE=other + per-axis anchors) -> converge-to-clean. Main context never reads .oracle/."
  - "Slice-fill of a co-edited stub: fill only this phase's requirement slice, leave the Populated-in-Phase-NN deferral markers intact."

requirements-completed: [SEL-01, SEL-02, STR-01, STR-02, NAME-01]

coverage:
  - id: D1
    description: "SEL slice: running test list, one small step, degenerate/starter case, triangulation-for-selection with the load-bearing lz-tpp-GREEN firewall sentence"
    requirement: "SEL-01"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs (three-laws rows GREEN, >=1 ts fence, Phase-18 marker intact)"
        status: pass
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/extract-samples.mjs (SEL fence tsc --strict clean)"
        status: pass
    human_judgment: false
  - id: D2
    description: "STR slice: AAA + GWT one skeleton two vocabularies, assert-first, evident test data, one-concept-per-test"
    requirement: "STR-01"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs (test-structure rows GREEN, >=1 ts fence, Phase-17 marker intact)"
        status: pass
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/extract-samples.mjs (STR fence tsc --strict clean)"
        status: pass
    human_judgment: false
  - id: D3
    description: "naming.md: behavior/should naming primary + Osherove three-part alternative + match-house-stance"
    requirement: "NAME-01"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs (naming rows GREEN, >=1 ts fence)"
        status: pass
      - kind: automated
        ref: "node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs (ASCII + email + no-verbatim GREEN over lz-red tree)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Owned-source fidelity of the RCM (SEL one-small-step, STR one-concept) and Metz (NAME name-for-behavior) rationale threads -- own-words, no near-verbatim leak"
    requirement: "SEL-01"
    verification:
      - kind: other
        ref: "oracle-reviewer gate (CONTENT_TYPE=other, per-axis anchors): 3/3 owned surfaces verdict=pass, axis correct, too_close_to_source=false, round 1"
        status: pass
    human_judgment: false

duration: 18min
completed: 2026-07-19
status: complete
---

# Phase 16 (Plan 02): Core RED References Filled Summary

**Three core RED references authored clean-room in own words -- test selection (list, one step, degenerate-first, triangulation firewalled from lz-tpp's GREEN facet), structure (AAA+GWT one skeleton, assert-first, evident data, one-concept), and naming (should-primary + Osherove alternative) -- each with a tsc --strict-clean Vitest fence, every owned surface oracle-reviewer-verified.**

## Performance

- **Duration:** ~18 min (authoring ~12 min + orchestrator oracle-reviewer gate ~6 min, 2 gates in parallel)
- **Tasks:** 3 authored + committed; owned-surface gate run by the orchestrator
- **Files modified:** 4 (3 references + package-lock.json)

## Accomplishments
- SEL slice (SEL-01, SEL-02): running test list, one small (one-step) step, degenerate/starter case (empty/zero/null), triangulation as a RED test-SELECTION move with the LOAD-BEARING firewall sentence (triangulation SELECTS the next failing test; generalizing production code is lz-tpp's GREEN job).
- STR slice (STR-01, STR-02): Arrange-Act-Assert (Wake) and Given-When-Then (North) as ONE three-part skeleton in TWO vocabularies (match the house idiom, impose no school), assert-first, evident/intention-revealing test data, one concept per test.
- naming.md (NAME-01): behavior/"should" naming PRIMARY (North), Osherove three-part UnitOfWork_StateUnderTest_ExpectedBehavior as documented ALTERNATIVE, match the codebase's naming stance; Metz name-the-behavior-not-the-method as the owned rationale.
- Each reference carries at least one tsc --strict-clean Vitest example (explicit vitest import, minimal describe/it/expect surface).
- The RED baseline flipped GREEN: check-red-references now exits 0 (all three slices), extract-samples exits 0 (3 modules tsc-strict clean), check-hygiene exits 0 (ASCII + email + no-verbatim over 198/191 files).
- All three OWNED surfaces (RCM in SEL + STR, Metz in NAME) passed the oracle-reviewer gate in round 1 (axis correct, too_close_to_source=false, no ambiguities).

## Task Commits

1. **Task 1: Fill SEL slice + npm install workspace deps** - `8cdda55` (feat)
2. **Task 2: Fill STR slice** - `4f48216` (feat)
3. **Task 3: Fill naming.md fully** - `df17fa7` (feat)

## Files Created/Modified
- `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` - SEL slice filled (Phase-18 LAW/SEAM marker preserved)
- `plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md` - STR slice filled (Phase-17 ASRT marker preserved)
- `plugins/lz-tdd/skills/lz-red/references/naming.md` - filled fully (NAME-01 resolved)
- `.claude/skills/lz-red-workspace/package-lock.json` - pinned lock from the approved dev-only install (node_modules gitignored)

## Decisions Made
- Owned-source facts (RCM one-small-step, RCM one-concept, Metz name-for-behavior) authored from high-confidence core in original words, then verified by the oracle-reviewer against the books -- all 3 passed round 1, no re-draft needed.
- No build dependency entered the shipped `plugins/lz-tdd` tree; the two dev deps live only in the gitignored `.claude/skills/lz-red-workspace/node_modules`.

## Deviations from Plan

### Execution-mechanics adaptation (not a scope change)

**1. [Runtime constraint] Clean-room oracle loop driven by the orchestrator, not the executor**
- **Found during:** Wave-2 dispatch planning.
- **Issue:** The plan's task actions instruct the EXECUTOR to "spawn the oracle agent" and "spawn the oracle-reviewer". The `gsd-executor` agent has tools `Read, Write, Edit, Bash, Grep, Glob, Skill, mcp__context7__*` -- no `Agent`/`Task` tool -- and subagents cannot spawn subagents. The executor also must never read `.oracle/` (clean-room DST-04).
- **Fix:** The executor authored EVERY surface blind (own-words, never touching `.oracle/`) and ran the deterministic gates it can (extract-samples, check-red-references, check-hygiene). The ORCHESTRATOR then spawned the `oracle-reviewer` agent on the three owned surfaces (CONTENT_TYPE=other + per-axis anchors), which read the books in isolation and returned pass|revise verdicts. This mirrors the 0.0.2 operator-driven clean-room sweeps and preserves the identical outcome: own-words, oracle-reviewer-verified owned surfaces, main context never reading source prose.
- **Verification:** 3/3 owned surfaces verdict=pass (RCM Clean Code Ch.9 x2, Metz 99 Bottles 2e JS x1); too_close_to_source=false on all; clean-room held (only JSON verdicts crossed back).

---

**Total deviations:** 1 execution-mechanics adaptation (forced by the no-nested-subagents runtime; outcome identical to the planned clean-room gate).
**Impact on plan:** No scope change. The owned surfaces are still own-words and oracle-reviewer-verified; only the driver of the gate moved from executor to orchestrator.

## Issues Encountered
None. All deterministic gates GREEN after authoring; all owned-surface gates passed round 1.

## User Setup Required
None - the two dev dependencies are dev-only (gitignored node_modules), already approved and installed.

## Next Phase Readiness
- SEL/STR/NAME references are filled, own-words, tsc-strict, and owned-surface-verified.
- Wave 3 (16-03) runs the finalize gate: full battery GREEN + a skill-reviewer (>= 1 unbiased from-scratch) PASS + `claude plugin validate .` exit 0.
- Phase 17 will fill the deferred ASRT slice (test-structure-and-assertions.md marker intact) and Phase 18 the LAW/SEAM slice (three-laws-and-test-selection.md marker intact).

---
*Phase: 16-source-distillation-core-red-references*
*Completed: 2026-07-19*
