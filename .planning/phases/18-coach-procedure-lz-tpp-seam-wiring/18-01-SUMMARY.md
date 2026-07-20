---
phase: 18-coach-procedure-lz-tpp-seam-wiring
plan: 01
subsystem: testing
tags: [instrument-first, nyquist, red-baseline, checker, tsc-extractor, seam-02, lz-red, lz-tpp]

# Dependency graph
requires:
  - phase: 16-scaffold-and-selection-instrument
    provides: the dev-only lz-red-workspace instrument (check-red-references.mjs, extract-samples.mjs), the pinned typescript/vitest devDeps, and the reference-tree scaffold
  - phase: 17-assertion-design-stance-router-ts-vitest-mechanics
    provides: the 10-entry FILES array, the per-file requireFence flag, and the four Phase-18 deferral guards this plan flips
provides:
  - NET-NEW `absent` no-stale-marker checker field (inverse of `deferral`) + its loop branch
  - four co-edited deferral guards flipped to positive Phase-18 content topics + an `absent: /Phase 18/i` guard
  - SKILL.md coverage via a per-entry `dir` base override (7 coach-procedure topics + a non-ignore ts-fence guard + an absent guard)
  - a hardened NON_IGNORE_TS_FENCE_RE guard that a `ts ignore` fence cannot satisfy (VIT-02 real tsc coverage)
  - a post-loop SEAM-02 block reading the shipped lz-tpp/SKILL.md for both reverse pointers
  - extract-samples.mjs walk extended to cover the lz-red SKILL.md fence (compiles as SKILL-1.ts)
  - a fresh Phase-18 RED baseline asserted (content gate exit 1 by design; every other gate GREEN)
affects: [later Phase-18 content waves, three-laws-owned-surface, lz-red-SKILL.md-coach-procedure, lz-tpp-seam-edit, VIT-02-worked-example]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "instrument-first RED baseline (Nyquist): the guard is asserted before content lands; filling a slice flips it GREEN"
    - "absent no-stale-marker guard (D-14): inverse of `deferral`; FAILS while the /Phase 18/i marker is still present"
    - "per-entry `dir` base override: one FILES entry reaches the skill ROOT (SKILL.md) while the rest stay under references/"
    - "non-ignore ts-fence guard: a bare ```ts fence only, closing the TS_FENCE_RE ts-ignore gap"
    - "standalone post-loop cross-skill guard (SEAM-02): mirrors the D-05 honesty-gate block idiom for a path outside references/"

key-files:
  created: []
  modified:
    - .claude/skills/lz-red-workspace/tools/check-red-references.mjs
    - .claude/skills/lz-red-workspace/extract-samples.mjs

key-decisions:
  - "D-13: extend both instrument files in place (no sibling); tsc gate + no-verbatim scan stay non-negotiable"
  - "D-14: flip each of the four deferral guards to positive content topics PLUS an `absent: /Phase 18/i` no-stale-marker guard (LAW-0/SEAM-0 legitimately remain in filled content, so the needle is /Phase 18/i only)"
  - "D-13 planner call: SKILL.md covered via a per-entry `dir` override FILES entry (leaner than a separate block)"
  - "Pitfall 3: added requireNonIgnoreFence so a coverage-skipping `ts ignore` fence cannot satisfy VIT-02"
  - "D-09/SEAM-02: a standalone post-loop block reads lz-tpp/SKILL.md and asserts BOTH /lz-red/ and /lz-refactor/ reverse pointers"

patterns-established:
  - "absent no-stale-marker guard: the D-14 inverse of `deferral`"
  - "dir base override: reach a file at the skill root without leaving the references-only default"
  - "non-ignore ts-fence guard: bare-fence-only, real tsc coverage for VIT-02"
  - "SEAM-02 cross-skill pointer guard: reads a shipped sibling skill outside the lz-red tree"

requirements-completed: []

coverage:
  - id: D1
    description: "NET-NEW `absent` field + loop branch; the four co-edited deferral guards (three-laws-and-test-selection, test-structure-and-assertions, vitest-typescript-mechanics, principle-backing) flipped to positive Phase-18 topics + an `absent: /Phase 18/i` guard; every Phase-16/17 topic kept as the regression floor"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs -> exit 1 (RED by design); the four absent guards report FAIL (marker still present); D-05 honesty gate still PASS"
        status: pass
    human_judgment: false
  - id: D2
    description: "SKILL.md coverage via a `dir` override entry (7 coach-procedure topics + requireNonIgnoreFence + an absent guard) and a post-loop SEAM-02 block reading lz-tpp/SKILL.md for both reverse pointers"
    verification:
      - kind: automated
        ref: "check-red-references.mjs lists the SKILL.md checks + the SEAM-02 block; the non-ignore fence, override topic, scaffold, absent, and SEAM-02 guards all FAIL by design; the reference entries keep their prior PASS/FAIL states"
        status: pass
    human_judgment: false
  - id: D3
    description: "extract-samples.mjs walk extended to prepend the lz-red SKILL.md so its VIT-02 fence is tsc-covered; cosmetic Phase-17 -> Phase-18 header/SUMMARY strings; D-05 gate block + import byte-intact"
    verification:
      - kind: automated
        ref: "npm --prefix .claude/skills/lz-red-workspace run typecheck -> GREEN (7 modules, SKILL.md contributes 0 fences today); check-hygiene GREEN (198/191); provenance-honesty.selftest 3/3; claude plugin validate . passed"
        status: pass
    human_judgment: false

# Metrics
duration: 22min
completed: 2026-07-20
status: complete
---

# Phase 18 Plan 01: Instrument-first Phase-18 RED baseline Summary

**Extended the dev-only lz-red-workspace checker + tsc extractor to the Phase-18 coach-procedure / SEAM-02 surface (absent no-stale-marker guard, SKILL.md dir-override coverage, non-ignore ts-fence guard, SEAM-02 lz-tpp block, SKILL.md tsc coverage) and asserted it RED-by-design before any content lands.**

## Performance

- **Duration:** ~22 min
- **Started:** 2026-07-20T09:53:00Z
- **Completed:** 2026-07-20T10:15:17Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments

- Added a NET-NEW per-entry `absent` field to check-red-references.mjs (the D-14 inverse of `deferral`): it FAILS while the pattern is still present, so a filled slice must drop its `/Phase 18/i` deferral artifact. Added its loop branch beside the existing `deferral` branch.
- Flipped the four co-edited deferral guards (three-laws-and-test-selection, test-structure-and-assertions, vitest-typescript-mechanics, principle-backing) to positive Phase-18 content topics + an `absent: /Phase 18/i` guard, keeping every Phase-16/17 topic as the regression floor.
- Added SKILL.md coverage via a per-entry `dir` base override (`path.join(spec.dir ?? REFERENCES, spec.name)`) + a SKILL.md FILES entry with 7 coach-procedure topics, a `requireNonIgnoreFence` guard, and an absent guard. The checker read `references/` only before this (Pitfall 2).
- Added NON_IGNORE_TS_FENCE_RE + its branch: a bare ```ts / ```typescript fence only, closing the TS_FENCE_RE gap that also matched a coverage-skipping `ts ignore` fence the tsc extractor silently skips (Pitfall 3), so VIT-02 gets real tsc coverage.
- Added a post-loop SEAM-02 block reading the shipped lz-tpp/SKILL.md, PASS only when BOTH `/lz-red/` and `/lz-refactor/` reverse pointers are present (mirrors the D-05 honesty-gate standalone-block idiom).
- Extended extract-samples.mjs to prepend the lz-red SKILL.md to its walk so the VIT-02 fence is tsc-covered (extracts as SKILL-1.ts; GREEN-on-empty preserved because SKILL.md carries no fence today).
- Asserted the fresh Phase-18 RED baseline: content gate exit 1 (9 FAILs by design); tsc extractor, hygiene scan, provenance self-test, and `claude plugin validate .` all GREEN.

## Task Commits

Each task was committed atomically:

1. **Task 1: absent field + flip the four deferral guards** - `dee8f2b` (test)
2. **Task 2: SKILL.md dir-override coverage + non-ignore fence + SEAM-02 block** - `23ba7aa` (test)
3. **Task 3: extend tsc extractor to SKILL.md + refresh Phase-18 strings** - `8c3c039` (test)

## Files Created/Modified

- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` - added the `absent` field + branch, flipped the four deferral guards, added the SKILL.md `dir`-override entry + NON_IGNORE_TS_FENCE_RE + its branch, added the SEAM-02 post-loop block, refreshed the Phase-17 -> Phase-18 header + SUMMARY strings. D-05 honesty-gate block + `findBookCitedAsOwned` import byte-unchanged.
- `.claude/skills/lz-red-workspace/extract-samples.mjs` - added the SKILL_MD const and prepended it to the walk so the SKILL.md fence is tsc-covered.

## Decisions Made

- Followed the plan as specified. The one planner-call within scope (D-13) was already resolved in the plan: SKILL.md is covered via a per-entry `dir` override FILES entry (the leaner option) rather than a separate post-loop block.
- Kept the now-dead `deferral` branch in the loop (the plan instructs "keep the `deferral` branch for entries that still use it"); after the flip no entry sets `deferral`, so the branch is inert but available, consistent with extend-in-place.

## Deviations from Plan

None - plan executed exactly as written. No Rule 1-4 deviations. No shipped `plugins/lz-tdd` file touched; no dependency added; provenance-honesty.mjs + its self-test byte-unchanged.

## RED Baseline (by design, NOT a failure)

This is the instrument-first Wave-1 plan (Nyquist). The extended `check-red-references.mjs` is RED (exit 1) ON PURPOSE because the Phase-18 content it now detects has not been authored yet (later waves):

- The four co-edited slices still carry their `/Phase 18/i` deferral marker, so their new `absent` guards FAIL.
- The lz-red SKILL.md still has its placeholder ("deferred to Phase 18"), so its `absent` guard FAILs, its `requireNonIgnoreFence` guard FAILs (no bare ts fence yet), its `no scaffold phrase` check FAILs ("Placeholder only" trips `/\bplaceholder\b/i`), and its `natural-language override` topic FAILs.
- The shipped lz-tpp/SKILL.md has no reverse pointers yet, so the SEAM-02 block FAILs.

That is 9 FAILs total. Every OTHER gate is GREEN: tsc extractor (7 modules, SKILL.md 0 fences today), check-hygiene (198/191 files), provenance-honesty.selftest (3/3), and `claude plugin validate .`. When later waves author the coach procedure + a tsc-strict Vitest fence, fill the four slices (removing every `/Phase 18/i` marker), and add both lz-tpp pointers, each guard flips GREEN - that is the Nyquist RED -> GREEN signal this instrument exists to provide.

## Honesty note on SKILL.md topic checks

The plan's Task 2 acceptance criteria say "all SKILL.md topic checks report FAIL now". In practice 6 of the 7 SKILL.md topics PASS today (classify-first, Three Laws spine, stance routing, house idiom, fail-for-the-right-reason, forward lz-tpp handoff), because the current SKILL.md placeholder text literally describes the deferred procedure steps ("classify against the lz-tpp / lz-refactor seams -> detect the house testing idiom -> ... -> route the testing stance -> ... -> confirm it fails for the right reason -> hand off to lz-tpp"). Only the `natural-language override` topic FAILs. This does not weaken the RED baseline: it is asserted decisively via the `absent` (no-stale-marker), `requireNonIgnoreFence`, `no scaffold phrase`, and SEAM-02 guards, all of which FAIL by design. The exact topics specified in the plan were used verbatim; no topic was tightened to force a FAIL.

## Requirements Status

Phase-18 requirements (LAW-01, LAW-02, RTR-02, SEAM-01, SEAM-02, VIT-02) remain OPEN. This Wave-1 plan builds the INSTRUMENT that will detect them; it does NOT satisfy them. They close only when later content waves turn the flipped guards + the SKILL.md entry + the SEAM-02 block GREEN (the Phase-16/17 precedent: the instrument-first plan asserts the requirements RED and later waves close them). `requirements-completed` is intentionally empty.

## Issues Encountered

- A commit message containing backticks (` `dir` `, ` ```ts `) triggered Git Bash command substitution and failed to parse (the whole command line errored, so the paired `git add` never ran). Resolved by writing the Task 2 and Task 3 commit messages to scratchpad files and committing with `git commit -F <file>`. No content impact.

## Self-Check: PASSED

- FOUND: .claude/skills/lz-red-workspace/tools/check-red-references.mjs
- FOUND: .claude/skills/lz-red-workspace/extract-samples.mjs
- FOUND: .planning/phases/18-coach-procedure-lz-tpp-seam-wiring/18-01-SUMMARY.md
- FOUND commit dee8f2b (Task 1), 23ba7aa (Task 2), 8c3c039 (Task 3)

## Next Phase Readiness

- The Phase-18 RED baseline is asserted and machine-checkable. The next waves can author (a) the owned Three-Laws surface in three-laws-and-test-selection.md (orchestrator oracle-reviewer gated, D-05/D-12), (b) the SKILL.md coach procedure + the VIT-02 tsc-safe worked example (a compiling stub that fails its assertion at runtime - Pitfall 3), (c) the four co-edited reference slices, and (d) the lz-tpp reverse-pointer edit (orchestrator unbiased review, D-10). Filling each turns its guard GREEN.
- Reminder for the orchestrator (Pitfall 4): the oracle-reviewer on the owned surface, the >=1 unbiased review of the shipped lz-tpp edit, and the >=1 review of the lz-red SKILL.md coach procedure are ORCHESTRATOR gates AFTER the executor returns - gsd-executor has no Agent/Task tool. `/reload-plugins` is a Phase-19 ship action, not a Phase-18 task.

---
*Phase: 18-coach-procedure-lz-tpp-seam-wiring*
*Completed: 2026-07-20*
