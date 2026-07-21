---
phase: 20-skill-effectiveness-evals
plan: 01
subsystem: testing
tags: [skill-creator-eval, trigger-eval, lz-red, native-fix, canary-runner, allowlist-inversion]

# Dependency graph
requires:
  - phase: 16-red-content-gate
    provides: the existing dev-only .claude/skills/lz-red-workspace/ (content gate + tsc extractor) that eval assets are additive to
  - phase: 11-skill-effectiveness-evals
    provides: the freshest working skill-creator-eval rig (native-fixed run_eval.py, merge-judge, eval-status, runners, check-evals) copied here
  - phase: 18-red-coach-procedure
    provides: the shipped lz-red SKILL.md description (:3-15) that is the should/should-not ground truth for the trigger set
provides:
  - Vendored native-fixed skill-creator-eval harness under lz-red-workspace (run_eval.py + utils.py + __init__.py + LICENSE.upstream.txt + README), byte-identical to the lz-refactor source
  - eval-status.mjs + merge-judge.mjs copied verbatim (merge-judge --selfcheck GREEN)
  - Light-edited canary-gated runners (run-recall-chunks.mjs, run-spec-chunks.mjs) pointed at lz-red with the CANARY derived from a real positive
  - check-evals.mjs adapted to the three-way boundary (both-seam negatives + reciprocal dual-write + email allowlist-inversion)
  - evals/trigger-eval.json (12 RED positives + 12 near-miss negatives), evals/reciprocal-red.json (positives re-tagged false), evals/d07-chunks/negatives.json (dual-write slice)
  - 3 lz-red-workspace run-capture .gitignore lines
affects: [20-02-EVL-02-grader, 20-03-finalize-gated-run]

# Tech tracking
tech-stack:
  added: []  # no new packages; the harness is a byte-identical copy, workspace devDeps pre-exist
  patterns:
    - "Canary-gated chunk runners (a chunk is trusted only if its appended positive fired)"
    - "Dual-write byte-consistency invariants (negatives.json <-> trigger negatives; reciprocal-red.json <-> trigger positives)"
    - "Email allowlist-inversion lint (assert only the approved public contact; never encode the forbidden value)"
    - "Build-then-halt: all EVL-01 assets built, no metered run (D-11)"

key-files:
  created:
    - .claude/skills/lz-red-workspace/tools/skill-creator-eval/scripts/run_eval.py
    - .claude/skills/lz-red-workspace/tools/skill-creator-eval/scripts/utils.py
    - .claude/skills/lz-red-workspace/tools/skill-creator-eval/scripts/__init__.py
    - .claude/skills/lz-red-workspace/tools/skill-creator-eval/LICENSE.upstream.txt
    - .claude/skills/lz-red-workspace/tools/skill-creator-eval/README.md
    - .claude/skills/lz-red-workspace/eval-status.mjs
    - .claude/skills/lz-red-workspace/merge-judge.mjs
    - .claude/skills/lz-red-workspace/run-recall-chunks.mjs
    - .claude/skills/lz-red-workspace/run-spec-chunks.mjs
    - .claude/skills/lz-red-workspace/check-evals.mjs
    - .claude/skills/lz-red-workspace/evals/trigger-eval.json
    - .claude/skills/lz-red-workspace/evals/reciprocal-red.json
    - .claude/skills/lz-red-workspace/evals/d07-chunks/negatives.json
  modified:
    - .gitignore

key-decisions:
  - "Copied the vendored native-fixed harness byte-identical (D-01); never re-fixed the skill-agnostic run_eval bugs"
  - "Chose T3 (how should i structure this unit test) as the CANARY: a clean, high-confidence RED trigger, derived from the set so the throw-guard resolves (WR-01)"
  - "Refactor-seam lint requires a refactor-vocab cue AND a tests-green cue together, so a bare perf refactor does not satisfy the lz-refactor seam"
  - "EVL-01 NOT marked complete: this is a build-only plan; recall/specificity closes only after the gated run (20-03), matching the Phase-11 11-02 precedent"

patterns-established:
  - "Per-skill gitignore edit for run-capture dirs (Pitfall 8: the generic *-workspace rules are only partially generic)"
  - "Reciprocal RED spot-check set as the RED positives re-tagged should_trigger:false, byte-consistency enforced by the lint (D-03.2)"

requirements-completed: []  # EVL-01 assets built; the requirement closes after the user-gated run in 20-03 (Phase-11 precedent)

coverage:
  - id: D1
    description: "Vendored native-fixed skill-creator-eval harness + eval-status + merge-judge copied byte-identical from the lz-refactor rig (D-01)"
    requirement: "EVL-01"
    verification:
      - kind: other
        ref: "git diff --no-index --quiet <src> <dst> for run_eval.py, utils.py, __init__.py, LICENSE.upstream.txt, eval-status.mjs, merge-judge.mjs"
        status: pass
      - kind: unit
        ref: "node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck"
        status: pass
    human_judgment: false
  - id: D2
    description: "check-evals.mjs adapted to the three-way boundary (both-seam negatives + reciprocal dual-write + email allowlist-inversion) and GREEN over the authored sets"
    requirement: "EVL-01"
    verification:
      - kind: unit
        ref: "node .claude/skills/lz-red-workspace/check-evals.mjs (exit 0: 24 queries, 3 lz-tpp-seam + 3 lz-refactor-seam, reciprocal 12 all-false byte-consistent, ASCII, email-allowlist)"
        status: pass
    human_judgment: false
  - id: D3
    description: "trigger-eval.json (12 RED positives + 12 near-miss negatives), reciprocal-red.json (positives re-tagged false), d07-chunks/negatives.json (dual-write slice) authored, grounded in the shipped description, covering both seams"
    requirement: "EVL-01"
    verification:
      - kind: unit
        ref: "node check-evals.mjs (schema, >=8/>=8 split, both-seam >=2 each, reciprocal all-false byte-consistent, negatives dual-write)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Both canary-gated runners point at the lz-red skill-path with a CANARY_PREFIX derived from a real should_trigger:true positive"
    requirement: "EVL-01"
    verification:
      - kind: unit
        ref: "node --check run-recall-chunks.mjs && run-spec-chunks.mjs; CANARY_PREFIX resolves via all.find(q=>q.should_trigger && q.query.startsWith(prefix)); rg -c lz-refactor = 0"
        status: pass
    human_judgment: false
  - id: D5
    description: "3 lz-red-workspace run-capture .gitignore lines drop per-run byproducts without ignoring the tracked runner files (Pitfall 8)"
    requirement: "EVL-01"
    verification:
      - kind: other
        ref: "git check-ignore: iteration-1/.../run-N + trigger-results-*.json ignored; run-*.mjs runner files NOT ignored"
        status: pass
    human_judgment: false

# Metrics
duration: 11min
completed: 2026-07-21
status: complete
---

# Phase 20 Plan 01: EVL-01 Trigger-Eval Build Summary

**Vendored the native-fixed skill-creator-eval harness into lz-red-workspace, adapted check-evals.mjs to the three-way (lz-red vs lz-tpp vs lz-refactor) boundary, and authored the RED trigger set + reciprocal spot-check set -- all build-time, zero metered spend (D-11).**

## Performance

- **Duration:** 11 min
- **Started:** 2026-07-21T07:38:29Z
- **Completed:** 2026-07-21T07:50:15Z
- **Tasks:** 3
- **Files modified:** 14 (13 created + .gitignore)

## Accomplishments
- Copied the proven native-fixed trigger probe (run_eval.py + utils.py + __init__.py + LICENSE.upstream.txt), eval-status.mjs, and merge-judge.mjs byte-identical from the lz-refactor rig -- the three-bug Windows fix is skill-agnostic and was NOT re-fixed (D-01). merge-judge --selfcheck GREEN.
- Light-edited both canary-gated runners to point at the shipped lz-red skill and re-derived the CANARY from a real positive ("how should i structure this unit test"), so the throw-guard resolves without a hand-typed twin (WR-01).
- Adapted check-evals.mjs to the three-way boundary: it now requires >=2 lz-tpp green-step AND >=2 lz-refactor refactor-step negatives (both seams), asserts reciprocal-red.json is the RED positives re-tagged should_trigger:false and byte-consistent, and adds an email allowlist-inversion sweep over every present eval file (D-02, D-03, AGENTS.md).
- Authored trigger-eval.json (12 RED positives spanning selection / structure / assertion target / naming / stance / fail-for-the-right-reason / low-signal, 12 near-misses covering both sibling seams + generic), plus the derived negatives.json (dual-write slice) and reciprocal-red.json (positives re-tagged false) -- flipping check-evals GREEN.
- Added the 3 lz-red-workspace run-capture .gitignore lines (Pitfall 8: the generic *-workspace rules are only partially generic).

## Task Commits

Each task was committed atomically:

1. **Task 1: Copy vendored harness + generic scripts, light-edit runners, add gitignore** - `8b44780` (chore)
2. **Task 2: Adapt check-evals.mjs to the three-way boundary (RED baseline)** - `dfdde96` (chore)
3. **Task 3: Author trigger/reciprocal/negatives sets; re-derive canary; flip check-evals GREEN** - `d3b620b` (feat)

**Plan metadata:** (this SUMMARY + STATE.md + ROADMAP.md) committed separately.

## Files Created/Modified
- `.claude/skills/lz-red-workspace/tools/skill-creator-eval/scripts/run_eval.py` - native-fixed trigger probe (VERBATIM)
- `.claude/skills/lz-red-workspace/tools/skill-creator-eval/scripts/utils.py` - upstream helpers (VERBATIM)
- `.claude/skills/lz-red-workspace/tools/skill-creator-eval/scripts/__init__.py` - package marker (VERBATIM)
- `.claude/skills/lz-red-workspace/tools/skill-creator-eval/LICENSE.upstream.txt` - Apache-2.0 provenance (VERBATIM)
- `.claude/skills/lz-red-workspace/tools/skill-creator-eval/README.md` - provenance + usage (COPY + EDIT: --skill-path -> lz-red, triple-sibling Pitfall-2 note)
- `.claude/skills/lz-red-workspace/eval-status.mjs` - resume/status walker (VERBATIM)
- `.claude/skills/lz-red-workspace/merge-judge.mjs` - fail-closed judge merge + aggregate gate (VERBATIM; --selfcheck GREEN)
- `.claude/skills/lz-red-workspace/run-recall-chunks.mjs` - canary-gated recall runner (LIGHT EDIT: SKILL -> lz-red, CANARY re-derived)
- `.claude/skills/lz-red-workspace/run-spec-chunks.mjs` - canary-gated specificity runner (LIGHT EDIT: SKILL -> lz-red, CANARY re-derived)
- `.claude/skills/lz-red-workspace/check-evals.mjs` - build-time trigger lint (ADAPT: both seams + reciprocal dual-write + email-allowlist)
- `.claude/skills/lz-red-workspace/evals/trigger-eval.json` - 12 RED positives + 12 near-miss negatives
- `.claude/skills/lz-red-workspace/evals/reciprocal-red.json` - the RED positives re-tagged should_trigger:false (D-03.2)
- `.claude/skills/lz-red-workspace/evals/d07-chunks/negatives.json` - the negative slice the spec runner reads (dual-write)
- `.gitignore` - 3 added lz-red-workspace run-capture lines

## Decisions Made
- **Copied the harness byte-identical (D-01):** never re-fixed the skill-agnostic native run_eval bugs; verified with `git diff --no-index --quiet`.
- **Canary = T3 ("how should i structure this unit test"):** a clean (no backticks), high-confidence RED structure trigger, unique via `startsWith`; derived from the set so the runner throw-guard resolves without drift (WR-01).
- **Refactor-seam lint = refactor-vocab AND tests-green cue:** a bare "refactor for speed" (a perf ask) must NOT count as the lz-refactor refactor-step seam, so the seam count reflects genuine "tests are green, clean up" near-misses.
- **EVL-01 left OPEN:** this is a build-only plan (D-11); the requirement's recall/specificity measurement closes only after the user-gated run (20-03). Mirrors the Phase-11 11-02 precedent ("Data + lint only; measured EVL-01 ... closes post gated run").

## Deviations from Plan

None - plan executed exactly as written. The one honest departure from the source text was replacing the copied runners' lz-refactor CANARY provenance comment (which claimed a "9/9 fired" measurement that never happened for lz-red) with an explicit placeholder in Task 1, then an honest derived-from-set note in Task 3 -- this is the plan's own instruction ("leave the CANARY_PREFIX as a documented placeholder for now; Task 3 re-derives it"), not a deviation.

## Issues Encountered
None. All deterministic build gates passed on the first run.

## User Setup Required
None - no external service configuration required. The metered eval RUN (EVL-01 forward + reciprocal) is user-gated and presented in 20-03 (D-11); nothing metered ran in this plan.

## Next Phase Readiness
- EVL-01 build assets are complete and GREEN under the deterministic battery; 20-02 (EVL-02 grader + scenarios) and 20-03 (finalize + gated run) can proceed.
- The canary-gated runners are ready to run `claude -p` but are HALTED pending user approval (D-11). 20-03 presents the exact ready-to-run commands.
- The email allowlist-inversion sweep in check-evals.mjs scans evals.json opportunistically if present; 20-02 owns its own hygiene gate for that file.

## Self-Check: PASSED

- All 13 created eval-harness files + this SUMMARY exist on disk.
- All 3 task commits exist in history (8b44780, dfdde96, d3b620b).
- Deterministic build gates GREEN: 6 verbatim files byte-identical (git diff --no-index exit 0); merge-judge --selfcheck exit 0; node --check on eval-status + both runners exit 0; check-evals.mjs exit 0; both runners' CANARY_PREFIX resolves to a real should_trigger:true positive; content gate (check-red-references.mjs) still exit 0.
- Nothing metered ran (no claude -p / run_eval / subagent). SUMMARY is ASCII-only and email-allowlist clean.

---
*Phase: 20-skill-effectiveness-evals*
*Completed: 2026-07-21*
