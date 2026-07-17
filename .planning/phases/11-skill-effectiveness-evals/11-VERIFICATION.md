---
phase: 11-skill-effectiveness-evals
verified: 2026-07-10T06:36:32Z
status: passed
score: 3/3 must-haves verified
overrides_applied: 0
---

# Phase 11: Skill Effectiveness Evals Verification Report

**Phase Goal:** Empirically validate the lz-refactor skill's triggering accuracy and coach routing correctness on the native eval harness -- a late, non-blocking refinement that does not gate the public ship.

**Verified:** 2026-07-10T06:36:32Z
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

This is a NON-BLOCKING validation phase. Plans 11-01/02/03 built the eval rig + data + grader; 11-04 was the D-10 readiness gate. The evals were then RUN out-of-phase under explicit user approval, and results are recorded. Verification below is goal-backward: the recorded numbers are cross-checked against the actual on-disk run tree (54 transcripts, 54 metrics, 54 judge-verdicts, 54 final gradings, benchmark.json, passk-metrics.json), NOT accepted from EVAL-RESULTS.md prose alone.

### Observable Truths

| # | Truth (Success Criterion) | Status | Evidence |
| --- | --- | --- | --- |
| SC1 | Trigger eval confirms the description fires on in-scope contexts and stays quiet otherwise (recall + specificity), on the native harness | VERIFIED | 100% recall (10/10 should-trigger fired 3/3) + 100% specificity (10/10 near-miss quiet), canary-validated per chunk; measured against the byte-identical shipped SKILL.md description on the vendored native run_eval harness |
| SC2 | Behavior eval confirms the coach recommends the correct next refactoring across both layers (Fowler + Kerievsky), with-skill vs baseline | VERIFIED | 9 scenarios spanning 5 Fowler + 3 Kerievsky + 1 de-patterning + 1 routing-boundary; with_skill Pass@1 = 100% (27/27), baseline 96.3% (26/27); 54 real run dirs; VERIFY OK gate passed |
| SC3 | Eval findings feed AT MOST a bounded tuning pass; earlier phases remain complete regardless (non-blocking) | VERIFIED | Zero writes into plugins/ during phase 11 (last lz-refactor commit predates all phase-11 commits); D-08 tuning NOT applied (correctly -- both bars met, no defect); no scope expansion |

**Score:** 3/3 truths verified

### SC1 Detail -- EVL-01 Trigger accuracy

- `evals/trigger-eval.json`: 10 should-trigger + 10 near-miss, including 3 lz-tpp-seam green-step negatives (`check-evals.mjs` reports "20 queries / 3 lz-tpp-seam negatives, ASCII-clean").
- The recall/spec chunk evidence files exist and were parsed directly:
  - RECALL: all should-trigger queries `trigger_rate=1.0`, `pass=true` (10 real + canary repeats, 3/3 each).
  - SPEC: all 10 near-miss `trigger_rate=0`, `pass=true`; each spec chunk carried an "Extract Function" canary that fired `rate=1.0`, proving a non-throttled window.
- The lz-tpp seam holds: "which change makes this failing test pass", "my failing test wants fib(3)", "red test expect(of(2)).toBe(1)" all stayed quiet.
- The description embedded in `trigger-results-d07-recall-chunk-1.json` matches the shipped `plugins/lz-tdd/skills/lz-refactor/SKILL.md` description verbatim -- the probe measured the ACTUAL shipped skill.
- Rate-limit artifact honestly documented: the first 60-probe serial pass under-read recall (throttling artifact, not a skill defect); the canary-gated chunk runners are the throttle-robust measurement. Both above the D-07 ~90% bar.

### SC2 Detail -- EVL-02 Behavior / next-refactoring

- `evals/evals.json`: skill_name `lz-refactor`, 9 scenarios; spans both layers (ids 0-3,8 Fowler; ids 4-6 Kerievsky; id 7 de-patterning Kerievsky-Away/functional; id 8 routing-boundary Fowler-not-pattern).
- `passk-metrics.json` (read directly): overall with_skill Pass@1 = 1.0 (27/27), without_skill Pass@1 = 0.9629 (26/27); coach drove in 0/54 runs (nodrive clean).
- Discriminating scenario eval-8 verified at the grading.json level: without_skill run-1 fails the LLM rationale judge (named the right refactoring but never argued the mechanical route over a pattern-directed one), runs 2-3 pass -> 2/3; with_skill all 3 runs pass 4/4 including rationale.
- `merge-judge.mjs --verify iteration-1` = "VERIFY OK: all 54 run dir(s) have a final grading.json (preliminary:false, judge_required:[], no passed:null)" -- the grading pipeline completed fully; no unmerged/preliminary runs.

### SC3 Detail -- Non-blocking, bounded tuning

- `git log -- plugins/lz-tdd/skills/lz-refactor` shows the most recent commit (`00258e3`) is older than every phase-11 commit (`f82358e`..`8c0c105`). No write-back into plugins/ occurred.
- EVAL-RESULTS.md "D-08 tuning: NOT applied" corroborated -- both soft bars are met, so zero tuning is the correct disciplined outcome (matches Phase-5 precedent).
- All phase-11 commits live under `.claude/skills/lz-refactor-workspace/` and `.planning/`; earlier phases untouched.

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `.claude/skills/lz-refactor-workspace/evals/trigger-eval.json` | 10+10 trigger set | VERIFIED | 20 queries, 3 seam negatives, ASCII-clean (check-evals OK) |
| `.claude/skills/lz-refactor-workspace/evals/evals.json` | >=8 behavior scenarios, both layers | VERIFIED | 9 scenarios, skill_name lz-refactor, both layers + de-patterning + routing-boundary |
| `.claude/skills/lz-refactor-workspace/grade-run.mjs` | deterministic name+layer grader | VERIFIED | --selfcheck SELFCHECK OK (exit 0) |
| `.claude/skills/lz-refactor-workspace/merge-judge.mjs` | fail-closed judge merge + verify gate | VERIFIED | --selfcheck OK; --verify iteration-1 = VERIFY OK (54/54) |
| `.claude/skills/lz-refactor-workspace/check-evals.mjs` | build-time trigger lint | VERIFIED | OK (20 queries / 3 seam negatives / ASCII-clean) |
| `.claude/skills/lz-refactor-workspace/tools/skill-creator-eval/` | vendored native probe | VERIFIED | run_eval.py present; harness importable per 11-04 |
| `.claude/skills/lz-refactor-workspace/iteration-1/benchmark.json` + `passk-metrics.json` | aggregate results | VERIFIED | real aggregates matching EVAL-RESULTS claims |
| `.claude/skills/lz-refactor-workspace/EVAL-RESULTS.md` | results record | VERIFIED | RUN COMPLETE; numbers filled, corroborated by underlying data |
| EVL-01 chunk evidence (`trigger-results-d07-*-chunk-*.json`) | recall+spec raw | VERIFIED | 3 recall + 3 spec chunks present, all pass, canary-gated |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| --- | --- | --- | --- | --- |
| passk-metrics.json | per_eval / overall Pass@k | aggregate_benchmark over 54 grading.json | Yes -- traced to 54 final gradings, VERIFY OK gate | FLOWING |
| EVAL-RESULTS.md EVL-02 table | with_skill / baseline Pass@1 | passk-metrics.json + grading.json per run | Yes -- eval-8 failure traced to real LLM-judge verdict | FLOWING |
| EVAL-RESULTS.md EVL-01 table | recall / specificity | trigger-results chunk JSONs | Yes -- all queries + canaries traced, rates real | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| --- | --- | --- | --- |
| Grader integrity | `node grade-run.mjs --selfcheck` | SELFCHECK OK, exit 0 | PASS |
| Judge merge integrity | `node merge-judge.mjs --selfcheck` | SELFCHECK OK, exit 0 | PASS |
| Trigger data lint | `node check-evals.mjs` | OK, 20 queries, exit 0 | PASS |
| Grading completeness gate | `node merge-judge.mjs --verify iteration-1` | VERIFY OK: 54/54 final gradings | PASS |

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
| --- | --- | --- | --- | --- |
| EVL-01 | 11-01/02/04 | Trigger eval: description fires in-scope, quiet on near-misses (recall+specificity), native harness | SATISFIED | 100%/100% canary-validated; REQUIREMENTS.md still "Pending" (normal pre-audit state -- verification enables closure) |
| EVL-02 | 11-01/03/04 | Behavior eval: correct next refactoring both layers, with-skill vs baseline | SATISFIED | with_skill 100% vs baseline 96.3%, both layers; REQUIREMENTS.md still "Pending" pending milestone audit |

Note: `requirements-completed` was deliberately kept empty in all four SUMMARYs (documented rationale: measured outcomes close only after the gated run + verification). This verification is the independent goal-achievement report that lets the milestone audit close both IDs.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| `tools/check-backing.mjs` | 14 | "TBD" inside a comment | Info | False positive -- the linter comment lists marker words it DETECTS ("TODO / TBD / placeholder"); not a debt marker on delivered work |

No email-shaped tokens in committed public prose (allowlist-inversion clean). EVAL-RESULTS.md is ASCII-clean.

### Minor Observations (Informational)

- EVAL-RESULTS.md states "41 of 45 assertions are saturated"; the actual RUBRICS total is 42 (41 saturated + the 1 non-saturated eval-8 rationale). Immaterial denominator wording nit -- the saturation finding and its interpretation are correct.
- The workspace raw outputs (273 tracked files including all transcripts/gradings) ARE committed to git, differing from the plan-11-01 D-09 intent that gitignore would "drop bulky raw outputs". This strengthens auditability (the raw evidence is permanently inspectable) and does not affect goal achievement.

### Documented Caveats (weighed, not blocking)

- **EVL-02 saturation = weak skill LIFT.** 41/42 assertions are saturated (Pass@1 = 1.0 for both configs). Baseline claude-opus-4-8 already routes correctly on nearly every scenario, so the 100%-vs-96% gap rests on the single eval-8 rationale nuance. This is an eval-DESIGN limitation, transparently documented, not a grading defect. SC2 asks for correct routing across both layers with-skill vs baseline -- that is measured and passes (with_skill matches or beats baseline everywhere and is the only config passing the eval-8 routing-boundary trap on all runs). For a NON-BLOCKING validation phase this is an acceptable, honestly-reported outcome.
- **Deterministic grader leniency, compensated by the LLM judge.** An independent from-scratch auditor (D-06 unbiased-beats-primed) reviewed 22 runs + grader source: no false passes, no false fails. Flagged structural leniency (layer-check presence-not-exclusion, name presence-not-primacy) that did not bite this run because all answers were genuinely correct; real discrimination rests on best-fit name presence + the LLM rationale judge, which behaved well (substantive FAIL on eval-8 baseline run-1, no rubber-stamping). Compensating control documented and verified at the grading.json level.

### Human Verification Required

None. The eval RUN already executed out-of-phase under explicit user approval; all results are recorded and independently corroborated from on-disk artifacts (chunk JSONs, 54 run dirs, passk-metrics). The unbiased from-scratch reviewer (D-06) was already run and its findings are documented. The selfchecks and the VERIFY OK completeness gate were re-executed by this verification. No visual, real-time, or external-service behavior remains to check.

### Gaps Summary

No gaps. All three success criteria are empirically satisfied by the recorded results and cross-checked against the underlying run tree:

- SC1 (EVL-01): 100% recall + 100% specificity on the native harness, canary-validated, seam holds, measured against the byte-identical shipped description.
- SC2 (EVL-02): with_skill 100% vs baseline 96.3% across 9 scenarios spanning both layers, with a fully-completed grade -> judge -> merge -> verify -> aggregate pipeline (54/54 final gradings).
- SC3: zero write-back into plugins/, zero tuning applied (correct discipline), earlier phases untouched, non-blocking honored.

The documented saturation and grader-leniency caveats are real and honestly reported, but they do not invalidate the correctness measurement and are appropriate to weigh against the phase being an explicitly non-blocking validation record. The phase goal is achieved.

---

_Verified: 2026-07-10T06:36:32Z_
_Verifier: Claude (gsd-verifier)_
