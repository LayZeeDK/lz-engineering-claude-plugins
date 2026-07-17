---
phase: 11
slug: skill-effectiveness-evals
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-10
validated: 2026-07-10
---

# Phase 11 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
>
> This is a BUILD-only phase (D-10 hard gate): all eval assets are built and
> selfcheck-verified in-phase; the actual eval RUN (which spends `claude -p`
> tokens) is user-gated and happens AFTER this phase, on explicit approval.
> The automated commands below are the build-time selfchecks, not the run.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node built-in `--selfcheck` self-tests in the orchestration scripts (no jest/vitest/pytest in this workspace) |
| **Config file** | none -- each `.mjs` script is self-contained and self-testing |
| **Quick run command** | `node grade-run.mjs --selfcheck && node merge-judge.mjs --selfcheck` (from the lz-refactor-workspace eval dir) |
| **Full suite command** | Quick run + the eval-data schema lint (`check-evals.mjs --selfcheck`, or the folded schema assertions in `grade-run.mjs`) |
| **Estimated runtime** | ~5 seconds (selfchecks are in-memory; no network, no `claude -p`) |

---

## Sampling Rate

- **After every task commit:** Run `node grade-run.mjs --selfcheck` (plus `merge-judge.mjs --selfcheck` when that file is touched)
- **After every plan wave:** Both selfchecks + the trigger-eval/evals.json schema lint
- **Before phase gate:** Both selfchecks GREEN + schema lint GREEN + the ready-to-run RUN commands presented, then HALT (D-10)
- **Max feedback latency:** ~5 seconds

Note: EVL-01 recall/specificity and EVL-02 with-skill-vs-baseline routing correctness are RUN-time (gated) measurements. They are NOT sampled in-phase -- the eval RUN is the post-approval validation of those measured outcomes.

---

## Per-Task Verification Map

> Task IDs are assigned by the planner (step 8). This map is completed/audited by
> `/gsd:validate-phase 11` after plans exist. The build-time verification anchors are:

| Anchor | Requirement | Test Type | Automated Command (build-time, non-gated) | File Exists |
|--------|-------------|-----------|-------------------------------------------|-------------|
| Trigger set schema-valid; >= 8 should-trigger + >= 8 near-miss incl. >= 2 lz-tpp-seam negatives | EVL-01 | build-time lint | `node check-evals.mjs --selfcheck` (or folded into `grade-run.mjs`) | W0 |
| Grader rubric internally consistent (RUBRICS <-> evals.json count alignment; names resolve to layers; nodrive fail-safe/fail-loud) | EVL-02 | unit (selfcheck) | `node grade-run.mjs --selfcheck` | W0 (rewrite) |
| Judge-merge fail-closed; aggregate gate rejects unmerged runs | EVL-02 | unit (selfcheck) | `node merge-judge.mjs --selfcheck` | exists (verbatim copy) |
| Trigger recall/specificity measured on native harness | EVL-01 | RUN-time (gated) | native probe -- NOT run in-phase (D-10) | n/a (gated) |
| With-skill vs baseline routing-correctness benchmark | EVL-02 | RUN-time (gated) | subagent runs -> grade -> judge -> merge -> verify -> aggregate -- NOT run in-phase (D-10) | n/a (gated) |

*Status: AUDITED 2026-07-10. All three build-time anchors GREEN (exit 0) plus the
run-completeness gate GREEN. Both RUN-time measurements executed under approval and recorded
in EVAL-RESULTS.md. See the Validation Audit trail at the end of this file.*

---

## Wave 0 Requirements

- [ ] `grade-run.mjs` -- rewrite RUBRICS + name/layer matcher for lz-refactor; keep the alignment selfcheck (covers EVL-02 grading)
- [ ] name->layer lookup data -- derive from the 3 catalog READMEs at build time (covers EVL-02 layer check)
- [ ] `evals/trigger-eval.json` + `evals/evals.json` authored (covers EVL-01 / EVL-02 data)
- [ ] (optional) `check-evals.mjs` schema lint, or fold the schema assertions into the grade-run selfcheck
- [ ] Framework install: none needed (node v24.18.0 present; typescript already a devDependency; no new packages)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| EVL-01 recall/specificity (esp. lz-tpp-seam quiet) | EVL-01 | Requires the gated eval RUN (`claude -p` token spend, D-10) | On approval, run the native trigger probe serially (`--num-workers 1`, `PONYTAIL_DEFAULT_MODE=off`, MCP stripped, `--setting-sources project`, model `claude-opus-4-8`); report recall + specificity + Pass@k/Pass^k |
| EVL-02 with-skill-vs-baseline routing correctness | EVL-02 | Requires the gated eval RUN | On approval, run the with-skill/baseline subagent benchmark, then grade -> judge -> merge -> verify -> aggregate; report Pass@k/Pass^k per eval and overall |

---

## Validation Sign-Off

- [x] All build-time tasks have `<automated>` selfcheck verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive build tasks without automated verify
- [x] Wave 0 covers all MISSING references (grade-run rewrite, eval data, layer lookup)
- [x] No watch-mode flags
- [x] Feedback latency < 10s (all four automated commands complete in ~5s, in-memory/filesystem only)
- [x] `nyquist_compliant: true` set in frontmatter (post-execution Nyquist audit, 2026-07-10)

**Approval:** VALIDATED 2026-07-10 -- coverage COMPLETE, no missing gaps. See the Validation
Audit trail below.

---

## Validation Audit trail (2026-07-10)

Nyquist coverage audit for a NON-BLOCKING eval/validation phase. No application source exists in
this phase; the deliverables are Node ESM eval tooling (`.mjs`) + JSON eval data that are
SELF-TESTING via `--selfcheck`/lint harnesses. Per the phase constraint, no jest/vitest/pytest
suite was invented (that would be redundant scaffolding around already-self-testing tooling), and
NO eval / `claude -p` / `run_eval` was executed (zero token spend). The auditor re-RAN every
non-token automated command rather than trusting the "green" claim.

### Automated commands executed (all exit 0, no claude -p spend)

Run from `.claude/skills/lz-refactor-workspace/`:

| # | Command | Result | Covers | Can fail? |
|---|---------|--------|--------|-----------|
| 1 | `node check-evals.mjs` | `OK - 20 queries (10 trigger / 10 near-miss; 3 lz-tpp-seam negatives), ASCII-clean` | EVL-01 build-time (trigger-set schema/count/seam/ASCII) | Yes -- fail-closed `process.exit(1)` on malformed / short-split / missing-seam / non-ASCII input |
| 2 | `node grade-run.mjs --selfcheck` | `SELFCHECK OK` | EVL-02 build-time (grader: word-bounded name matcher, 4-layer resolve, CR-01 resolve-identity gate, nodrive fail-safe/fail-loud, RUBRICS<->evals.json count alignment) | Yes -- ~40 assertions, `process.exit(1)` on any fail |
| 3 | `node merge-judge.mjs --selfcheck` | `SELFCHECK OK` | EVL-02 build-time (fail-closed judge merge + `assessRunFinal` pre-aggregate predicate; every refusal branch) | Yes -- refusal-path assertions, `process.exit(1)` on any fail |
| 4 | `node merge-judge.mjs --verify iteration-1` | `VERIFY OK: all 54 run dir(s) have a final grading.json (preliminary:false, judge_required:[], no passed:null)` | EVL-02 RUN completeness -- confirms the recorded run's 9 evals x 2 configs x 3 runs = 54 gradings are final/aggregate-safe (filesystem-only, no token spend) | Yes -- `process.exit(1)` if any run dir is missing / preliminary / has an unresolved judge item |

Adversarial check: none of the four passes trivially. Each terminates with a non-zero exit on a
real defect (verified by reading the assertion bodies and the fail-closed branches in-source), so
they are behavioral gates that CAN fail, not smoke checks.

### RUN-time measurements (inherently manual; token-spending; executed + recorded)

EVL-01 recall/specificity and EVL-02 with-skill-vs-baseline routing correctness cannot be measured
without a `claude -p` run, so they are NOT automatable in a non-spending gate. Both were executed
out-of-phase under explicit user approval and recorded:

- EVL-01: 100% recall (10/10) + 100% specificity (10/10), canary-gated; the lz-tpp seam holds
  (all green-step negatives kept lz-refactor quiet). Raw evidence persists on disk:
  `trigger-results-d07-recall-chunk-{1,2,3}.json`, `trigger-results-d07-spec-chunk-{1,2,3}.json`.
- EVL-02: with_skill Pass@1 = 100% (27/27), baseline Pass@1 = 96.3% (26/27); coach drove in 0/54
  runs. Recorded in `iteration-1/benchmark.json` + `iteration-1/passk-metrics.json` (present on
  disk, gitignored bulky outputs) and summarized in `EVAL-RESULTS.md`.

These stay in the Manual-Only Verifications table by design (D-10). The auditor confirmed the
recorded artifacts exist on disk and that command #4 above independently gates their completeness.

### Coverage verdict: COMPLETE -- no missing gaps

- EVL-01: build-time COVERED (command #1, green); run-time measured + recorded (manual, D-10).
- EVL-02: build-time COVERED (commands #2, #3, green); run-completeness COVERED (command #4, green,
  54/54 final); run-time measured + recorded (manual, D-10).

No genuine uncovered behavior was found. No implementation file was modified (the frozen `.mjs`
tooling and eval data were re-run, never edited).

### Non-blocking observation (WARNING, not a gap)

`check-evals.mjs` has no `--selfcheck` mode: it lints the real `trigger-eval.json` directly (green),
but its fail-closed branches (short-split / no-seam / non-ASCII) have no STANDING automated
self-test -- they were verified once by hand against three bad inputs during 11-02 and are not
re-runnable as a selfcheck. This does not affect EVL-01 coverage (the lint's actual job -- validate
the shipped trigger set -- is automated and green). Recording it as a future-hardening candidate
only; not actioned here because the frozen tooling is READ-ONLY for this audit.
