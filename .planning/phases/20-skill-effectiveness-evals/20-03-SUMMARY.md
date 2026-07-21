---
phase: 20-skill-effectiveness-evals
plan: 03
subsystem: testing
tags: [eval-results, evl-01, evl-02, lz-red, pass-at-k, pass-hat-k, build-then-halt, d-11-gate, reciprocal-red]

# Dependency graph
requires:
  - phase: 20-skill-effectiveness-evals
    provides: 20-01 vendored the native-fixed harness + canary-gated runners + check-evals + trigger-eval/reciprocal-red/negatives data + the lz-red gitignore lines (this record cites those runners + the direct run_eval commands)
  - phase: 20-skill-effectiveness-evals
    provides: 20-02 rewrote grade-run.mjs into the D-05-RUBRIC hybrid grader + authored evals/evals.json (this record cites the grade -> judge -> merge -> verify -> aggregate chain and the 10 scenarios)
  - phase: 11-skill-effectiveness-evals
    provides: the lz-refactor EVAL-RESULTS.md structure (copied) + the run-config caveat text + the rate-limit / saturation / grader-leniency lessons
provides:
  - EVAL-RESULTS.md scaffold (EVL-01 forward + EVL-01 reciprocal lz-tpp/lz-refactor + EVL-02 with_skill-vs-baseline + Pass@k AND Pass^k tables k=1,3,5,total per eval and overall; run-config caveat; saturation note; reserved >=1 unbiased-reviewer slot; ALL numbers blank)
  - the exact ready-to-run gated command set (EVL-01 forward canary-runners OR direct run_eval; EVL-01 reciprocal direct run_eval TWICE vs lz-tpp + lz-refactor; EVL-02 orchestrator fan-out chain) + an explicit HALT line
  - the full deterministic battery proven GREEN on the merged tree (5 zero-spend checks exit 0)
affects: [gated-post-approval-run-evl01-forward, gated-post-approval-run-evl01-reciprocal, gated-post-approval-run-evl02-behavior, conditional-d09-tuning-pass]

# Tech tracking
tech-stack:
  added: []  # no new packages; all tooling on-disk (vendored harness + workspace devDeps pre-exist)
  patterns:
    - "Build-then-halt results record: EVAL-RESULTS.md carries the full three-measurement structure + Pass@k/Pass^k tables with numbers blank until the user-gated run (D-11)"
    - "Reciprocal canary caveat documented: the canary-gated runners are NOT used for the reciprocal probe (the canary is a lz-red positive that will not fire on a sibling skill-path); the reciprocal probe is the direct run_eval, which is sound because specificity is throttle-robust"
    - "Orchestrator-gate documentation: the EVL-02 subagent fan-out + LLM judge + >=1 unbiased reviewer are documented as post-approval ORCHESTRATOR steps (the gsd-executor cannot spawn subagents)"
    - "Tree-wide email/ASCII hygiene backstop over all maintainer-authored lz-red-workspace eval artifacts after both wave-1 plans merge (allowlist-inversion; vendored third-party rig out of scope)"

key-files:
  created:
    - .claude/skills/lz-red-workspace/EVAL-RESULTS.md

key-decisions:
  - "Copied the lz-refactor EVAL-RESULTS.md structure and adapted it to the three lz-red measurements; left every result / Pass@k / Pass^k cell blank with an explicit per-table 'filled only after the user-approved run' caption (D-07 tables present, D-11 numbers withheld)"
  - "Documented the reciprocal probe as direct run_eval TWICE (lz-tpp then lz-refactor) with the explicit 'canary-gated runners not used here' caveat + the reason (the lz-red canary would not fire on a sibling skill-path); if a sibling fires that is a bounded non-blocking D-09 candidate on THAT sibling"
  - "Documented EVL-02 fan-out + LLM judge + merge/verify/aggregate + >=1 unbiased reviewer as ORCHESTRATOR post-approval steps, never executor work (gsd-executor-cannot-spawn-subagents); included the judge-string provenance rule (read judge_required from grading.preliminary.json, never transcribe)"
  - "EVL-01 / EVL-02 left OPEN: this is the build/run boundary (D-11); the empirical recall/specificity + behavior measurement + Pass@k/Pass^k fill + unbiased-reviewer verdict close only after the user-approved run, mirroring 20-01 / 20-02"

patterns-established:
  - "A results record can be committed complete-in-structure but empty-in-numbers when the measurement is user-gated; the ready-to-run command set + HALT line are the deliverable, not the numbers"
  - "Saturation is documented as an eval-DESIGN limitation (claude-opus-4-8 saturates leaf-sourced scenarios; discriminating signal rests on classify-first / over-mock / false-green), never tuned away"

requirements-completed: []  # EVL-01/EVL-02 empirical closure awaits the user-gated run + orchestrator gates (D-11); this plan finalizes the build boundary only

coverage:
  - id: C1
    description: "The full deterministic build battery is GREEN on the merged tree and the Phase-16/17/18 content gate is unregressed"
    requirement: "EVL-01, EVL-02"
    verification:
      - kind: unit
        ref: "check-evals.mjs exit 0; grade-run.mjs --selfcheck exit 0; merge-judge.mjs --selfcheck exit 0; tools/check-red-references.mjs exit 0; extract-samples.mjs exit 0"
        status: pass
    human_judgment: false
  - id: C2
    description: "EVAL-RESULTS.md carries EVL-01 forward (recall/specificity, per-query tables) + EVL-01 reciprocal (lz-tpp + lz-refactor) + EVL-02 (with_skill vs baseline per scenario x dimension) + Pass@k AND Pass^k tables (k=1,3,5,total) per eval and overall with formulas, all numbers blank + run-config caveat + saturation note + reserved unbiased-reviewer slot"
    requirement: "EVL-01, EVL-02"
    verification:
      - kind: unit
        ref: "rg -c 'Pass\\^k|Pass@k' = 5; section headers EVL-01 forward / EVL-01 reciprocal / EVL-02 / Unbiased reviewer present; result cells blank"
        status: pass
    human_judgment: false
  - id: C3
    description: "A 'How to run (GATED)' section presents the exact EVL-01 forward, EVL-01 reciprocal (lz-tpp + lz-refactor via direct run_eval), and EVL-02 orchestrator commands, with the reciprocal canary caveat and an explicit HALT / await-approval line"
    requirement: "EVL-01, EVL-02"
    verification:
      - kind: unit
        ref: "rg -c 'GATED|user approval|HALT' = 6; rg -c 'reciprocal-red.json' = 3; canary-not-used caveat present"
        status: pass
    human_judgment: false
  - id: C4
    description: "The EVL-02 fan-out + LLM judge + >=1 unbiased-from-scratch reviewer + the conditional at-most-one D-09 tuning pass are documented as ORCHESTRATOR post-approval steps, and the D-08 soft bars are stated as non-blocking"
    requirement: "EVL-02"
    verification:
      - kind: other
        ref: "EVAL-RESULTS.md 'How to run' + 'D-08 soft bars / D-09 tuning' sections name the orchestrator, the executor-cannot-spawn constraint, the judge-string provenance rule, and the /reload-plugins human ship action"
        status: pass
    human_judgment: false
  - id: C5
    description: "EVAL-RESULTS.md is ASCII-only + email-allowlist clean, and the tree-wide hygiene backstop over all maintainer-authored lz-red-workspace eval artifacts prints tree-hygiene-ok"
    requirement: "EVL-01, EVL-02"
    verification:
      - kind: unit
        ref: "non-ASCII scan of EVAL-RESULTS.md = false; email-allowlist scan = no offending tokens; tree-wide backstop exit 0 (tree-hygiene-ok)"
        status: pass
    human_judgment: false
  - id: C6
    description: "Nothing metered ran (no run_eval / run_loop / claude -p / subagent / benchmark); only the zero-spend deterministic battery + hygiene scans executed"
    requirement: "EVL-01, EVL-02"
    verification:
      - kind: other
        ref: "D-11 HARD GATE honored; only node .mjs selfchecks/lints + node -e ASCII/email scans + git were invoked in this plan"
        status: pass
    human_judgment: false

# Metrics
duration: ~15min
completed: 2026-07-21
status: complete
---

# Phase 20 Plan 03: Finalize Eval Build + Gated Command Set + HALT Summary

**Scaffolded the lz-red EVAL-RESULTS.md record (three-measurement structure + Pass@k/Pass^k tables with all numbers blank), proved the full deterministic battery GREEN on the merged tree, and presented the exact ready-to-run gated commands for EVL-01 forward + reciprocal and the EVL-02 orchestrator fan-out -- then HALTED before any metered run (D-11 HARD GATE). Nothing metered executed.**

## Performance

- **Duration:** ~15 min
- **Completed:** 2026-07-21
- **Tasks:** 2
- **Files modified:** 1 (created: EVAL-RESULTS.md)

## Accomplishments
- Scaffolded `EVAL-RESULTS.md` by copying the lz-refactor analog structure and adapting it to the three lz-red measurements, with ALL numbers blank: (a) a locked run-config caveat (serial `--num-workers 1`, `PONYTAIL_DEFAULT_MODE=off`, MCP stripped + `--setting-sources project`, model `claude-opus-4-8`) + a standing NOT-RUN note; (b) EVL-01 forward (recall over the 12 should-trigger positives, specificity over the 12 near-miss negatives, `trigger_rate >= 0.5` = fired, per-query tables); (c) EVL-01 reciprocal RED spot-check (lz-tpp + lz-refactor specificity over the RED positives, note both siblings must stay quiet); (d) EVL-02 (with_skill vs baseline per scenario x dimension across the 10 leaf-grounded scenarios) + the saturation limitation note; (e) Pass@k AND Pass^k tables (k = 1, 3, 5, total) per eval and overall with the two formulas; (f) a reserved slot for the >= 1 unbiased-from-scratch reviewer verdict.
- Proved the full deterministic build battery GREEN on the merged tree: `check-evals.mjs` (24 queries, 3 lz-tpp-seam + 3 lz-refactor-seam, reciprocal 12 all-false byte-consistent, email-allowlist clean), `grade-run.mjs --selfcheck`, `merge-judge.mjs --selfcheck`, and the unregressed Phase-16/17/18 content gate (`tools/check-red-references.mjs` 11/11, `extract-samples.mjs` 8 modules tsc-strict clean) -- all exit 0.
- Appended a "How to run (GATED -- user approval required)" section with the EXACT commands: EVL-01 forward via the canary-gated runners (`node run-recall-chunks.mjs`, `node run-spec-chunks.mjs`) OR the direct `run_eval` probe from `tools/skill-creator-eval/`; EVL-01 reciprocal via the direct `run_eval` probe run TWICE (`--skill-path .../lz-tpp` then `.../lz-refactor`) against `evals/reciprocal-red.json`; and the EVL-02 orchestrator-driven fan-out -> grade-run -> LLM judge -> merge-judge --merge -> merge-judge --verify -> aggregate_benchmark -> generate_review chain.
- Called out explicitly that the canary-gated runners are NOT used for the reciprocal probe (their canary is a lz-red positive that would not fire on a sibling skill-path) and that the reciprocal probe is a throttle-robust specificity measurement; if a sibling fires on a RED positive that is a bounded, non-blocking D-09 tuning candidate on THAT sibling's description.
- Documented the EVL-02 subagent fan-out, the LLM judge (locked to exactly two dimensions), and the >= 1 unbiased-from-scratch reviewer as ORCHESTRATOR post-approval steps (the gsd-executor cannot spawn subagents), including the wait-for-all-completion-notifications rule and the judge-string provenance rule (read `judge_required` from `grading.preliminary.json`, never transcribe by hand).
- Documented the D-08 soft, non-blocking pass bars and the at-most-one, tightly-bounded D-09 tuning pass (the only write-back into `plugins/`; any SKILL.md edit gets its own >= 1 unbiased review; `/reload-plugins` is a human ship action), and ended with an explicit HALT line (build complete, no eval was run, await user approval).

## Task Commits

Each task was committed atomically:

1. **Task 1: Scaffold EVAL-RESULTS.md (three-measurement structure + Pass@k/Pass^k, numbers blank); prove the full deterministic battery GREEN** - `8b3bfc5` (docs)
2. **Task 2: Add the gated run command set + orchestrator gates + D-09 tuning notes + HALT** - `c18d6c8` (docs)

**Plan metadata:** (this SUMMARY + STATE.md + ROADMAP.md) committed separately.

## Files Created/Modified
- `.claude/skills/lz-red-workspace/EVAL-RESULTS.md` - the Phase-20 results record (SCAFFOLD: three-measurement structure + Pass@k/Pass^k tables + run-config + saturation caveats + the gated "How to run" command set + orchestrator-gate + D-09 tuning notes + HALT; all numbers blank until the gated run)

## Decisions Made
- **Structure copied, numbers withheld:** the record mirrors the lz-refactor EVAL-RESULTS.md heading/table structure and the standing run-config caveat text, but every result / Pass@k / Pass^k cell is intentionally blank with a per-table caption. The D-07 tables are PRESENT (proving the reporting obligation is wired) while the numbers are WITHHELD until the user-gated run (D-11).
- **Reciprocal probe = direct run_eval TWICE, with the canary caveat:** the reciprocal RED spot-check is documented as the direct `run_eval` against each sibling skill-path (not the canary-gated runners), with the explicit reason the runners' canary cannot certify a window on a sibling path and the note that specificity is throttle-robust so the direct probe is sound.
- **Orchestrator gates, not executor work:** the EVL-02 fan-out, the LLM judge, and the unbiased reviewer are documented as post-approval ORCHESTRATOR steps per `gsd-executor-cannot-spawn-subagents`; this plan neither ran nor attempted them.
- **EVL-01 / EVL-02 left OPEN:** this is the build/run boundary (D-11). The empirical recall/specificity, the with-skill-vs-baseline behavior measurement, the Pass@k/Pass^k fill, and the unbiased-reviewer verdict close only after the user-approved run. Mirrors 20-01 (EVL-01) and 20-02 (EVL-02).

## Deviations from Plan
None - plan executed exactly as written. No Rule 1-4 deviations were triggered; the deterministic battery was already GREEN on the merged tree (both wave-1 plans clean), so the only work was authoring EVAL-RESULTS.md across the two documented tasks.

## Issues Encountered
None. The deterministic battery was GREEN on first run and stayed GREEN after both EVAL-RESULTS.md edits (the .mjs selfchecks and content gate do not depend on EVAL-RESULTS.md). The tree-wide hygiene backstop printed `tree-hygiene-ok` both before Task 2 (merged-tree baseline) and after (with the full record). The naive-email-regex false-positive risk flagged in the plan (version/archive tokens shaped like `@X.Y.Z-word.md`) did not materialize -- EVAL-RESULTS.md was authored free of any `@`-shaped token so the scan stays clean without weakening the allowlist.

## User Setup Required
None - no external service configuration. What IS required next is the user's explicit approval to RUN the evals: the EVL-01 forward + reciprocal runs and the EVL-02 behavior benchmark are user-gated (D-11) and were NOT executed. The exact ready-to-run commands are in the "How to run (GATED)" section of EVAL-RESULTS.md; the orchestrator presents them and awaits approval.

## Next Phase Readiness
- The build is complete and the phase HALTS at the run boundary. After the orchestrator presents the command set and the user approves, the gated run proceeds as ORCHESTRATOR post-approval steps: EVL-01 forward + reciprocal, then the EVL-02 fan-out -> grade -> LLM judge -> merge -> verify -> aggregate, then compute Pass@k/Pass^k and fill EVAL-RESULTS.md, then the >= 1 unbiased-from-scratch reviewer, then the conditional at-most-one D-09 tuning pass (only on a demonstrated defect; own unbiased review; /reload-plugins is a human ship action).
- D-08 bars are SOFT and NON-blocking: missing a bar triggers at most the bounded D-09 pass and NEVER reopens Phases 15-19. If the skill already meets the bars, no tuning is applied and the evals stand as a validation record (the Phase-5 / Phase-11 outcome).
- SATURATION WARNING (A7) is documented in EVAL-RESULTS.md as an eval-design limitation: claude-opus-4-8 is likely to saturate most leaf-sourced scenarios; the discriminating signal concentrates in the classify-first boundary (scenario 9), over-mock (scenario 3), and false-green (scenario 6) cases. Not a defect to tune away.

## Known Stubs
None in the code sense. EVAL-RESULTS.md's blank result / Pass@k / Pass^k cells are the INTENDED state of this build-then-halt plan (D-11): the record is complete in structure and command set, and the numbers are filled only after the user-approved run. Each blank table carries a caption stating this. This is not a stub that blocks the plan's goal -- the plan's goal IS the ready-to-run blank scaffold + the gated command set + the HALT.

## Self-Check: PASSED

- Created file exists on disk: `.claude/skills/lz-red-workspace/EVAL-RESULTS.md`.
- Both task commits exist in history: `8b3bfc5` (scaffold), `c18d6c8` (gated commands + HALT).
- Full deterministic battery GREEN on the merged tree: check-evals.mjs, grade-run.mjs --selfcheck, merge-judge.mjs --selfcheck, tools/check-red-references.mjs, extract-samples.mjs all exit 0.
- EVAL-RESULTS.md carries EVL-01 forward + EVL-01 reciprocal (lz-tpp + lz-refactor) + EVL-02 + Pass@k AND Pass^k (k=1,3,5,total) + the gated command set + the HALT line; result cells blank.
- EVAL-RESULTS.md is ASCII-only (non-ASCII scan false) and email-allowlist clean; the tree-wide hygiene backstop prints tree-hygiene-ok (exit 0). This SUMMARY is ASCII-only and carries no work-email / bare domain.
- Nothing metered ran (no run_eval / run_loop / claude -p / subagent / benchmark) -- D-11 HARD GATE honored.

---
*Phase: 20-skill-effectiveness-evals*
*Completed: 2026-07-21*
