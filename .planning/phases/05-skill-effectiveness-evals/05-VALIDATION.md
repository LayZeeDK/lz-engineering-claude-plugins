---
phase: 5
slug: skill-effectiveness-evals
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-02
---

# Phase 5 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> NOTE: the "test framework" here IS the skill-creator eval harness; the phase's
> own deliverables (the trigger-eval set + behavior evals) ARE the tests that prove
> EVAL-01 / EVAL-02. There is no application code under test.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | skill-creator harness: `run_loop.py` / `run_eval.py` (trigger, EVAL-01) + `evals.json` -> subagent runs -> `grading.json` -> `aggregate_benchmark.py` -> `generate_review.py` (behavior, EVAL-02) + `agents/grader.md` |
| **Config file** | none -- eval DATA authored this phase under `.planning/phases/05-skill-effectiveness-evals/evals/` and `.../lz-tpp-workspace/` (Wave 0) |
| **Quick run command** | (trigger, WSL2) `python3 -m scripts.run_eval --eval-set <trigger-smoke.json> --skill-path <LZTPP> --model claude-opus-4-8 --runs-per-query 1 --verbose` (interop smoke test) |
| **Full suite command** | (trigger, WSL2) `python3 -m scripts.run_loop --eval-set <trigger-eval.json> --skill-path <LZTPP> --model claude-opus-4-8 --runs-per-query 3 --holdout 0.4 --max-iterations 5 --report none --results-dir <trigger-workspace>` ; (behavior, native) spawn with_skill+baseline subagents x>=3, then `python -m scripts.aggregate_benchmark <workspace>/iteration-1 --skill-name lz-tpp` |
| **Estimated runtime** | trigger loop ~minutes (5 iterations x 20 queries x 3 runs); behavior ~42 subagent runs (7 scenarios x 2 configs x 3) |

**ENVIRONMENT SPLIT (verified this session):** EVAL-01 (`run_loop`/`run_eval`) MUST run
under **WSL2 Ubuntu** -- native Windows Python raises `OSError WinError 10093` on
`select.select()` over the subprocess pipe and silently scores every query as "did not
trigger" (~50% meaningless). EVAL-02 is orchestrator/subagent-driven and runs natively.

---

## Sampling Rate

- **Trigger (EVAL-01):** 3 runs per query (loop default); pass = per-query trigger rate vs 0.5 threshold; selection by HELD-OUT (40%) accuracy.
- **Behavior (EVAL-02):** >= 3 runs per scenario per config (with_skill vs baseline) -- D-05.
- **Reliability metric:** Pass@k / Pass^k (k = 1, 3, 5, total; cap k at n) per eval AND overall.
- **Before results sign-off:** WAIT for ALL run-completion notifications before grading (total_tokens / duration_ms only available at completion; save to `timing.json` as each arrives).
- **Gate (D-06, soft/non-blocking):** trigger held-out accuracy >= ~90% with near-misses quiet; behavior correct-transformation Pass@1 ~= 1.0. Missing a bar -> at most the D-07 tuning pass; NEVER reopens Phases 1-4.

---

## Per-Task Verification Map

> Task IDs are assigned by the planner (PLAN.md). This map is requirement-level; the
> executor / gsd-validate-phase reconciles it against final task IDs.

| Req | Behavior to prove | Test Type | Automated Command / Mechanism | Wave 0 dep | Status |
|-----|-------------------|-----------|-------------------------------|------------|--------|
| EVAL-01 | `description` triggers on TDD / transformation-priority / TPP prompts; stays quiet on genuine near-misses | trigger eval (3x/query, 40% held-out), WSL2 | `run_loop.py` -> held-out accuracy + per-query rate; `run_eval.py` smoke first | trigger-eval.json + trigger-smoke.json | pending |
| EVAL-02 | Coach names the correct highest-priority AVAILABLE transformation per scenario (incl. TS/JS overlay), backtracks at the Word Wrap impasse, classifies a green-code request as a refactoring (no numbered transformation), and does NOT edit code / run tests | behavior benchmark (>=3 runs, with vs baseline), native | subagents -> scripted `grading.json` (string-match named transformation + no-Edit/Write/test-run check) -> `aggregate_benchmark.py` -> Pass@k/Pass^k | evals.json + eval_metadata.json per scenario + scripted grader | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `evals/trigger-eval.json` -- the ~20-query set (8-10 should-trigger, 8-10 near-miss should-not-trigger) -- covers EVAL-01
- [ ] `evals/trigger-smoke.json` -- 2-query subset for the WSL2 interop + model-id smoke test (A1/A2 de-risk) -- run BEFORE the full loop
- [ ] `evals/evals.json` -- 7 behavior scenarios (fib-nothing-to-constant, fib-split-base-case, fib-prefer-tail-recursion, sum-deep-input-stacksafe, flatten-tree-no-tail, wordwrap-impasse-backtrack, refactor-not-transformation) with `expectations[]` -- covers EVAL-02
- [ ] `lz-tpp-workspace/iteration-1/eval-<N>-<slug>/eval_metadata.json` per scenario (exact fields per schemas.md)
- [ ] A scripted deterministic grader writing `grading.json` per run (fields `text` / `passed` / `evidence`; string-match named transformation + assert no Edit/Write to provided code + no test execution)
- [ ] `EVAL-RESULTS.md` -- concise results summary + Pass@k/Pass^k tables (committed per D-08)
- [ ] Framework install: NONE needed (skill-creator harness + native Python + WSL2 Python + `claude` CLI all present)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| WSL2 interop streaming + model-id validity (A1/A2) | EVAL-01 | Cannot be asserted by the harness itself; must confirm the pipe stream + `--model claude-opus-4-8` before trusting loop scores | Run `trigger-smoke.json` (>=1 should-trigger query) under WSL2; a should-trigger query MUST read rate=1/1. If it reads 0, STOP -- the loop scores are invalid. |
| lz-tpp NOT enabled as a plugin in the `claude -p` environment (A3) | EVAL-01 | An enabled lz-tpp would steal the trigger and cause false negatives | Re-check `~/.claude/plugins/config.json` + `~/.claude/settings.json` at run time; lz-tpp must be absent/disabled. |

---

## Validation Sign-Off

- [ ] All requirements have an automated verify mechanism or a Wave 0 dependency
- [ ] Sampling continuity: trigger 3x/query, behavior >=3x/scenario/config
- [ ] Wave 0 authors all eval sets + the scripted grader before any run
- [ ] Pass@k / Pass^k computed per eval and overall; wait-for-all-notifications honored
- [ ] EVAL-01 executed under WSL2 with the smoke test passing first
- [ ] `nyquist_compliant: true` set in frontmatter (post-execution, by gsd-validate-phase)

**Approval:** pending
