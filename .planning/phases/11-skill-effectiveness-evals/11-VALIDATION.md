---
phase: 11
slug: skill-effectiveness-evals
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-10
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

*Status: pending until plans assign task IDs.*

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

- [ ] All build-time tasks have `<automated>` selfcheck verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive build tasks without automated verify
- [ ] Wave 0 covers all MISSING references (grade-run rewrite, eval data, layer lookup)
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter (by `/gsd:validate-phase 11` post-execution)

**Approval:** pending
