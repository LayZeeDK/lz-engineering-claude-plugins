# Phase 21: Applied RED Eval in Real OSS Repos (multi-dimensional, 3-arm) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md - this log preserves the alternatives considered.

**Date:** 2026-07-22
**Phase:** 21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-inserted
**Mode:** `--analyze --auto --chain` (single-pass autonomous; recommended option auto-selected per area, steered by the pre-locked ROADMAP Phase 21 design)
**Areas discussed:** Target corpus, Task+prompt shape, Arm mechanics, Dimension gate-vs-report, Grading+authenticity, Harness+build boundary

---

## Target corpus (D-01)

| Option | Description | Selected |
|--------|-------------|----------|
| Auto-pick nx now | Lock nrwl/nx `@nx/*` as the target in this pass | |
| Defer to research | Researcher proposes 2-3 red-test-shaped targets; user steers before run | [x] |
| Synthetic snippets | Reuse Phase-20-style inline scenarios | |

**Choice:** Defer to research (NOT auto-locked). HIGH-IMPACT + not evidence-backed = `--auto` trap quadrant; recorded as UNRESOLVED with the nx + Gilded Rose kata corpus as the reuse-candidate baseline.
**Notes:** ROADMAP pins ">= 1 real OSS TS repo (Vitest/Jest)" but names none. Picking a specific repo silently would violate the maintainer's `--auto` trap rule; deferring to the researcher is the legitimate non-lock.

---

## Task + prompt shape (D-02, D-03)

| Option | Description | Selected |
|--------|-------------|----------|
| Drive next red test | Short human prompt drives the next failing test on current code; grade the diff | [x] |
| Full red->green | Drive test + implementation | |

**Choice:** Drive next red test only; byte-identical prompt across arms except path; ~2-3 targets x k=3, tuned at the run gate.
**Notes:** Matches the RED-step-only scope and the lz-refactor apply precedent (cr-* at k=3-5).

---

## Arm mechanics (D-04, D-05)

| Option | Description | Selected |
|--------|-------------|----------|
| 2-arm | no_skill vs skill | |
| 3 own-skill arms | no_skill / with_skill (auto-trigger) / invoke_skill (force) | [x] |
| + competitor now | add mattpocock tdd in the first fan-out | |

**Choice:** 3 own-skill arms first; competitor deferred to a later contingent round.
**Notes:** `with_skill` must run the REAL installed plugin via `claude -p` (avoid the Phase-20 with_skill=force-invoke conflation). mattpocock `tdd` is broader-scope (full loop + interactive seam-confirm) - noted.

---

## Dimensions: gate vs report (D-06, D-07, D-08)

| Option | Description | Selected |
|--------|-------------|----------|
| All-gate | every dimension pass/fail | |
| Correctness-gate + 8-report | correctness is the hard gate; 8 lift dims compared | [x] |

**Choice:** Correctness (tsc-strict AND genuinely-red-for-right-reason) = hard GATE; the other 8 dimensions = report/compare; substance-only headline wherever a vocabulary proxy is used.
**Notes:** Direct carry-forward of the Phase-20 EVL-02 vocabulary-inflation lesson.

---

## Grading + authenticity (D-09, D-10)

| Option | Description | Selected |
|--------|-------------|----------|
| Mechanical only | stream-json meta only | |
| Mechanical + judges + oracle-reviewer + unbiased reviewer | full grading stack | [x] |

**Choice:** stream-json mechanical + <=2-dim blind judges + oracle-reviewer authenticity (DST-04) + Pass@k/Pass^k + >= 1 from-scratch unbiased reviewer (mandatory).
**Notes:** The unbiased reviewer is what caught the Phase-20 inflation - non-negotiable.

---

## Harness + build boundary (D-11, D-12, D-13, D-14)

| Option | Description | Selected |
|--------|-------------|----------|
| New harness | build from scratch | |
| Reuse lz-refactor apply rig | adapt run-e2e.mjs + tabulate-mechanical.mjs | [x] |

**Choice:** Reuse the lz-refactor apply harness; git-ignore byproducts; no build deps in `plugins/lz-tdd`; instrument-first build + zero-spend selfcheck; the metered run is user-gated (D-11); EVL-03 formalized at plan time.
**Notes:** Run-time orchestration hygiene carried from Phase 20 (small waves, ponytail-off directive in subagent prompts, SendMessage-resume, isolated work dir).

---

## Claude's Discretion

- Harness adaptation details (RED produced-test grader plug-in), exact judge prompts, per-arm tool-profile specifics - left to researcher/planner against the reused rig.

## Deferred Ideas

- mattpocock-skills:tdd competitor round (contingent, after own lift - D-05).
- ADV-01 / ADV-02 (type-level / property-based RED) - Future Requirements.
- `/gsd-complete-milestone lz-tdd@0.0.3` - only after Phase 21 completes.
