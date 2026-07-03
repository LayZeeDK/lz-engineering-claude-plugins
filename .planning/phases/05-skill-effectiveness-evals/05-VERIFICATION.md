---
phase: 05-skill-effectiveness-evals
slug: skill-effectiveness-evals
verified: 2026-07-03
independent: true
status: passed
score: 3/3 success criteria verified (EVAL-01, EVAL-02 both satisfied)
requirements: [EVAL-01, EVAL-02]
overrides_applied: 0
warnings:
  - "RESOLVED 2026-07-04: work-email literal was committed in the prior inline 05-SECURITY.md via commit 60fa6f3 (HEAD, unpushed; origin/main clean). Remediated by amending 60fa6f3 to fold in the scrubbed independent artifacts; post-amend git grep / git log -S confirm the literal is absent from HEAD and full history. Was not an EVAL success criterion."
  - "REQUIREMENTS.md still lists EVAL-01 / EVAL-02 as Pending in the traceability table despite both being functionally satisfied; flip to Complete during milestone audit."
---

# Phase 5: Skill Effectiveness Evals -- Verification Report

**Phase Goal:** Empirically validate and tune the skill's triggering accuracy and coaching correctness -- a late, optional refinement that does not gate the public ship. OPTIONAL-FINAL and NON-BLOCKING: Phases 1-4 must not regress.
**Verified:** 2026-07-03
**Status:** passed
**Re-verification:** No -- fresh independent pass (the existing 05-VERIFICATION.md was authored inline by the executor and was NOT read; this verdict is reached from primary evidence only).

## Goal Achievement

### Observable Truths (ROADMAP Success Criteria)

| # | Truth (Success Criterion) | Status | Evidence |
|---|---------------------------|--------|----------|
| 1 | EVAL-01: a trigger-eval set (should-trigger + near-miss should-not-trigger) confirms the `description` fires on TDD/transformation/TPP contexts and stays quiet otherwise | VERIFIED | `evals/trigger-eval.json` = 27 queries (13 should-trigger + 14 near-miss), committed. Shipped-description clean serial run `trigger-results-d07-recall-old.json` summary `{total:13,passed:13}` = 100% recall; `trigger-results-d07-spec.json` `{total:14,passed:14}` = 100% specificity. Its `description` string is byte-identical to the shipped `plugins/lz-tdd/skills/lz-tpp/SKILL.md` frontmatter -- so the 13/13 measures the SHIPPED description. Meets the D-06 ~90% soft bar. |
| 2 | EVAL-02: a behavior/effectiveness eval confirms the coach recommends the correct next transformation on sample failing-test scenarios | VERIFIED | `evals/evals.json` = 10 named-transformation scenarios. Recomputed independently from `iteration-1/benchmark.json` (60 runs = 10x2x3): with_skill 29/30 full-pass (Pass@1 0.97, Pass@3 1.00), baseline 15/30 (0.50). Per-eval grading evidence confirms correct highest-priority AVAILABLE picks (eval-2 #9 over #11; eval-3 (if->while)+(variable->assignment); eval-4 tree-no-tail; eval-5 backtrack; eval-6 refactoring classification). `tool_calls:0` on all 60 runs (0/60 drove). Meets the D-06 Pass@1 ~= 1.0 soft bar. |
| 3 | Eval findings feed AT MOST a tuning pass; earlier phases remain complete regardless (non-blocking) | VERIFIED | `git status --porcelain plugins/` is empty; `git log -- plugins/lz-tdd/skills/lz-tpp/SKILL.md` shows last edits are Phase-3 commits (aa14279, 841e97e) -- NO Phase-5 change to the shipped skill. D-07 decision recorded as "no tuning" (shipped description already passes; widened variant reverted). Phases 1-4 not reopened. |

**Score:** 3/3 success criteria verified.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `.claude/skills/lz-tpp-workspace/evals/trigger-eval.json` | EVAL-01 trigger set (>=18) | VERIFIED | 27 queries (13 pos / 14 neg), tracked in git |
| `.claude/skills/lz-tpp-workspace/evals/trigger-smoke.json` | 2-query smoke subset | VERIFIED | 2 queries, tracked |
| `.claude/skills/lz-tpp-workspace/evals/evals.json` | EVAL-02 behavior set | VERIFIED | skill_name=lz-tpp, 10 scenarios, tracked |
| `.claude/skills/lz-tpp-workspace/grade-run.mjs` | Deterministic grader (>=60 lines) | VERIFIED | 374 lines; Node built-ins; text/passed/evidence + summary contract |
| `iteration-1/eval-0..9/eval_metadata.json` | 10 per-scenario metadata | VERIFIED | 10 dirs, all have eval_metadata.json |
| `.claude/skills/lz-tpp-workspace/trigger-results.json` | EVAL-01 run output | VERIFIED (see note) | num-workers-3 run: 8% recall (concurrency artifact); superseded by serial re-runs |
| `trigger-results-d07-recall-old.json` | Shipped-desc clean recall | VERIFIED | 13/13 recall, serial; desc == shipped SKILL.md |
| `trigger-results-d07-spec.json` | Clean specificity | VERIFIED | 14/14, serial |
| `iteration-1/benchmark.json` | Aggregated behavior benchmark | VERIFIED | 60 runs, metadata/runs/run_summary/notes; both configs with pass_rate |
| `iteration-1/benchmark.md`, `review.html` | Human summary + static review | VERIFIED | both present, tracked |
| `.claude/skills/lz-tpp-workspace/EVAL-RESULTS.md` | Combined results + D-06/D-07 record | VERIFIED | Both evals, Pass@k, D-06 PASS/PASS, D-07 no-tuning; ASCII-clean; only public gmail |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| shipped SKILL.md `description` | trigger-results-d07-recall-old.json | identical description string measured | WIRED | Byte-identical -> the 13/13 recall is on the shipped description, not a variant |
| grade-run.mjs -> judge -> merge-judge.mjs -> aggregate_benchmark.py | benchmark.json | per-run grading.json summary.pass_rate | WIRED | 60 final grading.json present; run_summary aggregated; grading.preliminary.json present per run (fail-closed staging honored) |
| benchmark.json / trigger-results | EVAL-RESULTS.md | combined Pass@k + held-out accuracy | WIRED | EVAL-RESULTS numbers recomputed and match on-disk data |
| D-07 decision | plugins/lz-tdd/skills/lz-tpp/SKILL.md | conditional apply (only if beats held-out) | WIRED (no-op, correct) | Not applied; git confirms shipped skill unchanged |

### Data-Flow Trace (Level 4)

| Artifact | Data | Source | Real Data | Status |
|----------|------|--------|-----------|--------|
| benchmark.json | per-run pass_rate | 60 committed grading.json (real LLM-judge verdicts + metrics.json tool counts) | Yes -- recomputed 29/30 & 15/30 independently | FLOWING |
| trigger-results-d07-recall-old.json | trigger_rate per query | vendored run_eval `claude -p` ephemeral-skill probe, serial | Yes -- rates correlate with query semantics | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| EVAL-02 full-pass tally reproducible from benchmark.json | node tally over runs[] | with_skill 29/30, baseline 15/30 | PASS |
| Shipped description == measured recall description | byte compare SKILL.md vs recall-old.json | identical | PASS |
| No shipped-skill regression | `git status --porcelain plugins/` | empty | PASS |
| Raw transcripts excluded from committed surface | `git ls-files **/outputs/*` + `git check-ignore` | 0 tracked; ignored | PASS |

### Probe Execution

Not applicable as a gate: EVAL-01/EVAL-02 are metered `claude -p` / subagent runs whose outputs are already committed as result artifacts (recomputed above from committed JSON). Re-running would spend plan tokens and is gated on explicit user approval (05-03 autonomous:false). Verification relied on the committed run records, independently recomputed -- not on SUMMARY PASS-marker counts.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| EVAL-01 | 05-01, 05-03, 05-04 | Trigger-eval set validates the description fires in-scope / quiet out-of-scope | SATISFIED | trigger-results-d07-recall-old.json 13/13 + spec 14/14 on shipped desc |
| EVAL-02 | 05-01, 05-02, 05-04 | Behavior eval checks correct next-transformation recommendations | SATISFIED | benchmark.json with_skill 29/30 vs baseline 15/30; correct picks per scenario |

Note: REQUIREMENTS.md still marks both as Pending (checkbox + traceability table). Documentation lag only; flip to Complete in the milestone audit.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| commit 60fa6f3 (prior inline 05-SECURITY.md) | n/a | Work-email literal in a committed public-repo file (now scrubbed from the working tree) | WARNING | Violates the documented work-email allowlist convention (MEMORY: public-repo-work-email-allowlist, flagged as recurring). The prior inline line ironically asserted no such literal existed. Committed only in 60fa6f3 (HEAD, unpushed); origin/main is clean. Not an EVAL deliverable and not a success criterion, so it does not block the phase goal -- but remediate the unpushed commit before the next push. |

No debt markers (TBD/FIXME/XXX) found in phase-authored tools or records. EVAL-RESULTS.md and eval JSON are ASCII-clean and contain only the public gmail.

### Warnings / Follow-ups (non-blocking)

1. **Work-email literal in unpushed commit 60fa6f3** (see Anti-Patterns) -- RESOLVED 2026-07-04. Owner approved amending the single unpushed commit; 60fa6f3 was rewritten to fold in the scrubbed artifacts, so the literal never reaches origin -- no filter-repo + force-push needed because origin/main (a19b4f4) was clean throughout. Post-amend git grep / git log -S confirm HEAD and full history are clean.
2. **REQUIREMENTS.md traceability lag** -- EVAL-01/EVAL-02 shown Pending though satisfied.
3. **"Widened variant tied at 13/13" nuance** -- `trigger-results-d07-recall-new.json` alone is 10/13; the 13/13 tie is reached only by combining it with `trigger-results-d07-retry3.json` (3/3 on the flaked queries). Consistent with the concurrency-flakiness story; immaterial to the shipped-description verdict or the D-07 no-change outcome.

### Human Verification Required

None. The phase goal is "empirically validate," and the empirical results are committed and were independently recomputed from primary data. The two warnings above are remediation decisions, not verification gaps.

### Gaps Summary

No gaps against the phase goal. All three ROADMAP success criteria are verified from primary evidence:
- EVAL-01 trigger accuracy: 100% recall / 100% specificity on the shipped description (clean serial measurement; the committed 8% is a corroborated num-workers-3 concurrency artifact, honestly documented).
- EVAL-02 coaching correctness: with_skill lifts full-pass reliability from 0.50 (baseline) to 0.97 (Pass@1) / 1.00 (Pass@3), 0/60 drove; recomputed independently from benchmark.json.
- Non-blocking discipline: the shipped skill is unchanged (git-confirmed), Phases 1-4 intact, raw transcripts gitignored, D-07 correctly resolved to no-tuning.

The single finding (work-email literal in the secure-phase meta-file) is a WARNING outside the EVAL success criteria and does not make the phase goal unachieved.

---

_Verified: 2026-07-03_
_Verifier: Claude (gsd-verifier) -- independent from-scratch pass_
