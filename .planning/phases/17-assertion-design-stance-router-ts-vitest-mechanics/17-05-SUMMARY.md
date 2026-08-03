---
phase: 17-assertion-design-stance-router-ts-vitest-mechanics
plan: 05
subsystem: testing
tags: [tdd, red-phase, anti-patterns, testing-stance, cooper, khorikov, goos, beck, test-desiderata, listen-to-the-tests]

# Dependency graph
requires:
  - phase: 16-source-distillation-core-red-references
    provides: lz-red-workspace instrument (tsc extractor + check-red-references) + house leaf shape (naming.md analog)
  - phase: 17-01
    provides: check-red-references.mjs anti-patterns.md entry (ten topic tokens, requireFence false, RED-until-authored baseline)
provides:
  - "anti-patterns.md: six named RED anti-patterns, each with a Recognize-by cue and an observable-behavior Correction (over-mocking/test-per-class, private methods, multiple unrelated assertions, passes-immediately/no-red, snapshot-as-thinking, slow/order-dependent)"
  - "RTR-03 listen-to-the-tests meta-rule: test-writing pain routes toward a functional core (functional-core.md) or a seam (seams-and-legacy.md), NOT more doubles; GOOS stated as a fair counterpoint; DHH not cited"
  - "ANTI-02 Test Desiderata tradeoff lens (Beck): properties as tradeoffs to optimize with named tension pairs (behavioral vs structure-insensitive, writable vs readable, fast vs predictive)"
  - "full check-red-references now GREEN (10/10) -- the last Wave-2 leaf; the Phase-17 content-completeness gate is satisfied"
affects: [17-06-finalize-oracle-reviewer, phase-18-coach-procedure]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "OWNED anti-pattern (Cooper over-mock/test-per-class) authored BLIND own-words from the RESEARCH planning grain (no .oracle/ read); orchestrator oracle-reviewer fidelity gate deferred to Plan 17-06"
    - "Khorikov implementation-detail brittleness threaded as a shared root through anti-patterns 1/2/5 (low resistance to refactoring = the assertion-side failure mode)"
    - "no-fence prose leaf (requireFence false): a short bad-vs-good TS example was intentionally skipped -- it is a nice-to-have, not required, and adds tsc-compile surface for zero requirement gain"

key-files:
  created: []
  modified:
    - plugins/lz-tdd/skills/lz-red/references/anti-patterns.md

key-decisions:
  - "No TS fence added (Open Question 1): anti-patterns.md is requireFence false; a bad-vs-good fence is a nice-to-have. Skipped to avoid extra tsc-compile surface for no requirement benefit; the leaf stays prose/table-heavy per its analog naming.md."
  - "Metz dropped from the Sources rows: this plan's OWNED surface is scoped to the Cooper over-mock/test-per-class anti-pattern ONLY. The private-methods correction is stated as a general principle, so no Metz-attributed owned prose is introduced here -- keeping the oracle-reviewer surface for 17-06 exactly one entry (Cooper)."
  - "ANTI-01/ANTI-02/RTR-03 marked complete now; the Cooper owned-surface DST-04 fidelity gate (oracle-reviewer converge-to-clean) is a separate downstream verification at the orchestrator level in Plan 17-06 (captured as coverage D1 human_judgment: true), mirroring the 17-04 owned-leaf treatment."

patterns-established:
  - "Per-anti-pattern shape: Anti-pattern / Recognize-by / Correction bullet triplet under a numbered heading, mirroring the naming.md Convention/When-to-use/Distilled-rationale triplet."
  - "listen-to-the-tests section routes by filename to testing-stance/functional-core.md and testing-stance/seams-and-legacy.md, with the GOOS counterpoint pointing at testing-stance/message-matrix.md for the one warranted double."

requirements-completed: [ANTI-01, ANTI-02, RTR-03]

coverage:
  - id: D1
    description: "anti-patterns.md #1 -- over-mocking / test-per-class rigidity (Ian Cooper, OWNED): Recognize-by (a double per collaborator, assert save() was called, a spec per class) + observable-behavior Correction (test behaviors through the public API/port, one warranted double at the outgoing-command boundary, a test per BEHAVIOR not per class)"
    requirement: "ANTI-01"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs (anti-patterns.md over-mock/test-per-class row PASS)"
        status: pass
      - kind: automated
        ref: "node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs (ASCII + email allowlist + no-verbatim, 198/191 files clean)"
        status: pass
    human_judgment: true
    rationale: "OWNED surface (Cooper's two talk transcripts) -- DST-04 near-verbatim fidelity is confirmed by the orchestrator oracle-reviewer converge-to-clean gate in Plan 17-06, not by the deterministic no-verbatim byte scan alone. Main context never read .oracle/."
  - id: D2
    description: "anti-patterns.md #2-#6 (no-oracle) -- testing private methods, multiple unrelated assertions, a test that passes immediately (no red), snapshot-as-thinking, slow/order-dependent tests: each with a Recognize-by cue + observable-behavior Correction; Khorikov brittleness threaded through the mock/private/snapshot trio"
    requirement: "ANTI-01"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs (anti-patterns.md rows: private methods / multiple unrelated assertions / passes-immediately-no-red / snapshot / slow-order-dependent all PASS)"
        status: pass
      - kind: automated
        ref: "npm --prefix .claude/skills/lz-red-workspace run typecheck (7 modules tsc --strict --noEmit clean; no fence regression)"
        status: pass
    human_judgment: false
  - id: D3
    description: "RTR-03 listen-to-the-tests meta-rule + GOOS counterpoint: test-writing pain routes toward a functional core or a seam (linked), NOT more doubles; GOOS (Freeman + Pryce) stated fairly as the mockist counterpoint with the classicist/value-based default held; DHH never cited"
    requirement: "RTR-03"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs (anti-patterns.md listen-to-the-tests + GOOS counterpoint rows PASS; links to functional-core.md + seams-and-legacy.md present)"
        status: pass
      - kind: automated
        ref: "git grep -c -i -e dhh -e hansson -- anti-patterns.md == 0 (DHH hard-ban honored)"
        status: pass
    human_judgment: false
  - id: D4
    description: "ANTI-02 Test Desiderata tradeoff lens (Beck, no-oracle): the good-test properties as tradeoffs to optimize in the heuristic-not-law voice, with named tension pairs (behavioral vs structure-insensitive = Khorikov's resistance-to-refactoring restated; writable vs readable; fast vs predictive)"
    requirement: "ANTI-02"
    verification:
      - kind: automated
        ref: "node .claude/skills/lz-red-workspace/tools/check-red-references.mjs (anti-patterns.md Test Desiderata + tradeoff/heuristic rows PASS)"
        status: pass
    human_judgment: false

# Metrics
duration: 2min
completed: 2026-07-19
status: complete
---

# Phase 17 Plan 05: RED Anti-patterns Leaf Summary

**Six named RED anti-patterns with observable-behavior corrections (Cooper over-mock owned own-words, Khorikov brittleness threaded), the RTR-03 listen-to-the-tests meta-rule routing to core/seam with a fair GOOS counterpoint, and the ANTI-02 Test Desiderata tradeoff lens -- closing ANTI-01, ANTI-02, RTR-03 and turning the full check-red-references GREEN.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-07-19T05:29:34Z
- **Completed:** 2026-07-19T05:32:32Z
- **Tasks:** 1
- **Files modified:** 1

## Accomplishments

- Filled `anti-patterns.md` own-words: the six RED anti-patterns as numbered sections, each carrying the content-contract triplet Anti-pattern / Recognize-by / Correction (observable-behavior fix) -- (1) over-mocking / test-per-class rigidity (Cooper, OWNED, authored BLIND from the RESEARCH planning grain; no `.oracle/` read), (2) testing private methods, (3) multiple unrelated assertions in one test, (4) a test that passes immediately (no red), (5) snapshot-as-thinking, (6) slow / order-dependent tests.
- Threaded Khorikov's implementation-detail brittleness through anti-patterns 1/2/5 as the shared assertion-side root: an assertion bound to how the code is built (not what it does) has low resistance to refactoring and breaks on a behavior-preserving change.
- Authored the RTR-03 listen-to-the-tests meta-rule (deepening the short SKILL.md section, no SKILL.md edit): test-writing pain is design feedback routing toward a functional core (`testing-stance/functional-core.md`) or a seam (`testing-stance/seams-and-legacy.md`), NOT more doubles. GOOS (Steve Freeman and Nat Pryce) is stated fairly as the mockist counterpoint with the classicist / value-based default held; DHH is never cited (hard-ban honored, git-grep verified 0 hits).
- Authored the ANTI-02 Test Desiderata tradeoff lens (Beck, no-oracle): the good-test properties as tradeoffs to optimize rather than a checklist, in the heuristic-not-law voice, naming three tension pairs (behavioral vs structure-insensitive -- Khorikov's resistance-to-refactoring restated; writable vs readable; fast vs predictive).
- Rewrote the `## Sources (placeholder)` scaffold to a real `## Sources` with per-source access tiers: Cooper (Owned; oracle-verified against the clean-room source), Khorikov / GOOS / Beck (Unowned; high-confidence core only, no-oracle) -- the canonical tier strings mirrored from the filled lz-red refs.
- The full `check-red-references` gate is now GREEN (10/10 references): anti-patterns.md was the last Wave-2 leaf, so the Phase-17 content-completeness instrument is satisfied.

## Task Commits

The single task was committed atomically:

1. **Task 1: Author anti-patterns.md (six anti-patterns + listen-to-the-tests + Test Desiderata)** - `2588d38` (docs)

**Plan metadata:** committed with this SUMMARY + STATE + ROADMAP + REQUIREMENTS (docs).

## Files Created/Modified

- `plugins/lz-tdd/skills/lz-red/references/anti-patterns.md` - Filled: six RED anti-patterns (Anti-pattern / Recognize-by / Correction) + the listen-to-the-tests meta-rule (GOOS counterpoint, routes to functional-core.md + seams-and-legacy.md) + the Test Desiderata tradeoff lens + rewritten Sources tiers. Cooper #1 is the OWNED surface (oracle-reviewer gate deferred to 17-06); the rest are no-oracle. requireFence false, no TS fence.

## Decisions Made

- **No TS fence added (Open Question 1).** anti-patterns.md is `requireFence: false`; a short bad-vs-good example fence is a nice-to-have, not required. Skipped to keep the leaf prose/table-heavy (its analog `naming.md` shape) and avoid adding tsc-compile surface for zero requirement gain. The typecheck still shows 7 modules clean (unchanged from 17-04).
- **Metz dropped from the Sources rows.** The RESEARCH source-tier column lists Cooper/Metz/Khorikov for anti-pattern #2, but this plan's scoped OWNED surface is the Cooper over-mock/test-per-class anti-pattern ONLY. The private-methods correction is written as a general principle needing no Metz-attributed owned prose, so the oracle-reviewer surface handed to 17-06 stays exactly one entry (Cooper). Sources therefore carries Cooper + Khorikov + GOOS + Beck, matching the plan's acceptance criteria.
- **ANTI-01 / ANTI-02 / RTR-03 marked complete now.** All three requirement slices are fully authored in this leaf. The Cooper owned-surface DST-04 fidelity gate (oracle-reviewer converge-to-clean) is a separate downstream verification run by the orchestrator in Plan 17-06 -- captured here as coverage D1 `human_judgment: true` -- mirroring how 17-04 closed its requirements while deferring the owned-surface oracle gate.

## Deviations from Plan

None - plan executed exactly as written. The two content choices above (no fence; Metz dropped from Sources) are both explicit discretion the plan grants (Open Question 1 / the plan's scoped one-entry owned surface + Sources acceptance criterion), not deviations from it.

## Issues Encountered

None. The stub already satisfied four checker tokens (over-mock/test-per-class, listen-to-the-tests, GOOS counterpoint, Test Desiderata) from its sub-topic list; the seven remaining RED checks (private methods, multiple unrelated assertions, passes-immediately/no-red, snapshot, slow/order-dependent, tradeoff/heuristic, and the `placeholder` scaffold) all flipped GREEN once the content and the rewritten Sources heading landed.

## User Setup Required

None - no external service configuration required. No dependency was added to `plugins/lz-tdd`.

## Next Phase Readiness

- ANTI-01, ANTI-02, RTR-03 closed. The full `check-red-references` gate is GREEN (10/10) -- all Wave-2 lz-red reference content is authored.
- Remaining before the Phase-17 finalize gate (Plan 17-06): the orchestrator drives the oracle-reviewer converge-to-clean pass over the three OWNED surfaces (message-matrix Metz + F.I.R.S.T. Clean Code + Cooper over-mock/test-per-class here), then the skill-reviewer and `claude plugin validate .`, with the full battery (hygiene + typecheck + check-red-references) GREEN.
- Executor could not spawn the oracle-reviewer (Read/Write/Edit/Bash/Skill tools only); the Cooper anti-pattern was authored BLIND own-words per the plan, and the fidelity gate is the orchestrator's at 17-06 -- no gap, by design.
- Phase 18 (coach procedure) will wire the stance router (RTR-02) and the LAW-02 fail-for-the-right-reason procedure into SKILL.md; the anti-pattern #4 (no-red) entry cross-references the vitest-typescript-mechanics.md fail-for-the-right-reason MECHANIC and defers the procedure to that phase without authoring it.

## Self-Check: PASSED

- File exists: `plugins/lz-tdd/skills/lz-red/references/anti-patterns.md` (FOUND), `17-05-SUMMARY.md` (FOUND).
- Commit exists: `2588d38` (Task 1) (FOUND on gsd/lz-tdd-0.0.3-lz-red).
- Gates: hygiene GREEN (198 ASCII / 0 non-allowlisted emails / 191 no-verbatim clean); typecheck GREEN (7 modules tsc --strict --noEmit); check-red-references GREEN (10/10 references, all anti-patterns.md rows PASS, no scaffold leak).
- DHH hard-ban: `git grep -i -e dhh -e hansson` on anti-patterns.md == 0 hits (honored).
- Route links present: `testing-stance/functional-core.md` + `testing-stance/seams-and-legacy.md` (2 hits).
- No dependency added (`plugins/lz-tdd` untouched beyond the reference leaf); `.planning/config.json` runtime flag left unstaged.

---
*Phase: 17-assertion-design-stance-router-ts-vitest-mechanics*
*Completed: 2026-07-19*
