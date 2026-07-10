---
phase: 11
phase_name: "skill-effectiveness-evals"
project: "lz-engineering-claude-plugins"
generated: "2026-07-10"
counts:
  decisions: 3
  lessons: 5
  patterns: 2
  surprises: 2
missing_artifacts:
  - "UAT.md"
---

# Phase 11 Learnings: skill-effectiveness-evals

## Decisions

### No D-08 tuning pass -- the shipped skill validates as-is
Both D-07 bars were met (EVL-01 100% recall / 100% specificity; EVL-02 with_skill 100% Pass@1 routing), so no tuning was applied and no file under plugins/ was modified. The soft "clearly beats baseline" sub-bar was not clearly met (baseline 96.3%), but the cause is baseline saturation, not a skill defect -- D-08 authorizes a tuning pass only on a DEMONSTRATED defect, of which there was none.

**Rationale:** D-07/D-08 discipline: "if the skill already meets the bars, no tuning pass is applied and the evals stand as a validation record." Matches the Phase-5 outcome.
**Source:** EVAL-RESULTS.md, 11-CONTEXT.md (D-07/D-08), 11-VERIFICATION.md

### The eval RUN was executed out-of-phase under explicit user approval (D-10 honored)
Plans 11-01/02/03 built the rig; 11-04 halted at the D-10 gate (autonomous:false, blocking) after only running the no-spend selfchecks/lints. The EVL-01/EVL-02 runs (real claude -p spend) executed only after the user said "start the prepared runs".

**Rationale:** Running an eval is a standing user-gated action (token spend); the build/run split keeps the phase's plans spend-free and the run explicitly authorized.
**Source:** 11-04-PLAN.md (threat T-11-07), 11-04-SUMMARY.md, EVAL-RESULTS.md

### Resume the behavior benchmark off the filesystem, not the workflow cache
When the org spend limit interrupted EVL-02 at 28/54 coach runs, the resume recomputed its todo list from on-disk artifacts (units missing a transcript / verdict) rather than the workflow's resumeFromRunId cache.

**Rationale:** The workflow cache keys on (prompt, opts) and would have replayed the terminally failed judge agents as cached nulls, silently skipping them. Durable on-disk artifacts are the source of truth.
**Source:** EVAL-RESULTS.md (reproduce/resume), execution history

---

## Lessons

### Rate-limiting silently produces FALSE eval artifacts -- validate with canary-gated chunks
A single 60-probe serial trigger run read a FALSE 10% recall. Root cause was rate-limiting under sustained back-to-back claude -p load (a rate_limit_event in the probe stream + an isolated single probe firing proved the skill triggers when the window is healthy). A throttled probe never completes the skill invocation and reads as a non-trigger, sinking recall (and potentially inflating specificity). Re-measured via canary-gated chunks: 100% recall, 100% specificity.

**Context:** Reconfirms the Phase-5 throttling lesson; the fix added run-recall-chunks.mjs as the recall counterpart to run-spec-chunks.mjs. NEVER trust a single large serial probe pass under an active/constrained session.
**Source:** EVAL-RESULTS.md (harness lessons + EVL-01 rate-limit artifact)

### A strong base model saturates behavior evals -- leaf-sourced scenarios under-measure skill lift
claude-opus-4-8 baseline already names the correct refactoring + layer with sound rationale on nearly every scenario (41/45 assertions Pass@1=1.0 for BOTH configs). The only discriminating case was the designed routing-boundary trap (eval-8). To measure skill LIFT against a strong base model, behavior scenarios must be harder / adversarial / genuinely ambiguous, not "correct answer proven in a catalog leaf".

**Context:** Deferred to a future iteration (this phase is a non-blocking one-time validation). Recorded as a saturated-assertion flag per D-06.
**Source:** EVAL-RESULTS.md (saturation), 11-VERIFICATION.md

### The org MONTHLY spend limit is a distinct hard cap from the per-session usage limit
EVL-02 was interrupted at 28/54 coach runs by "You've hit your org's monthly spend limit". A per-session "usage limit reset" does not necessarily clear the org monthly cap -- they are different limits.

**Context:** Confirm budget headroom and surface the spend decision to the user before resuming a multi-million-token operation, rather than blindly relaunching.
**Source:** EVAL-RESULTS.md (harness lessons), execution history

### Deterministic grader leniency is compensated by the LLM judge -- but only for correct answers
Code review found CR-01 (BLOCKER): layersInResponse sub-phrase-matched the functional leaf "Factory Function" inside the Fowler name "Replace Constructor with Factory Function", which could falsely credit the functional layer. It was one-directional, gated by the candidate-set check, and flipped no verdict (re-grading all 54 runs after the fix produced byte-identical gradings). Name-matching is also substring/negation-blind and presence-not-primacy.

**Context:** For future robustness against cleverly-worded wrong answers, layer checks must enforce the "NOT <other layer>" exclusion the rubric advertises. CR-01 is now fixed (longest-match resolution + a resolve-identity selfcheck assertion).
**Source:** 11-REVIEW.md (CR-01), grade-run.mjs fix commit 46921aa

### Extract verbatim judge strings from the grader, do not transcribe them
merge-judge --merge rejects a verdict whose text does not byte-match the grader's judge_required string. The scenario args were built by grading a dummy input per eval-id and reading judge_required from the emitted grading.preliminary.json, guaranteeing the merge never rejects on a text mismatch.

**Context:** Also caught the inverse class of bug in WR-01, where a hand-typed canary drifted from the eval-set positive it stood for; the fix derives the canary from the eval set itself.
**Source:** 11-03 execution, 11-REVIEW.md (WR-01), run-recall-chunks.mjs fix commit bdac462

---

## Patterns

### Workflow-orchestrated eval fan-out with agents writing their own durable artifacts
The 54-run behavior benchmark ran as a Workflow (coach + independent blind judge). Each agent wrote its own transcript.md / metrics.json / judge-verdicts.json to disk, so transcripts never bloat the orchestrator context; every deterministic step (grade -> merge -> verify -> aggregate) ran as Node/shell the orchestrator controls.

**When to use:** Large eval / benchmark fan-outs (dozens of runs) where main-context preservation and resumability matter, especially under a constrained token budget. Combine with filesystem-driven resume.
**Source:** EVAL-RESULTS.md (EVL-02 pipeline), execution history

### Canary-gated chunk measurement for throttle-robust triggering probes
Split the probe set into small chunks, append a known-reliable positive canary to each, and trust a chunk's results ONLY when the canary fired (proving a non-throttled window). Resume re-runs only throttled/unrun chunks.

**When to use:** Any claude -p triggering/detection probe run inside an active or rate-limited session, where a throttled probe would otherwise read as a false non-trigger.
**Source:** run-spec-chunks.mjs, run-recall-chunks.mjs, EVAL-RESULTS.md

---

## Surprises

### The canary that read 0/3 under load read 9/9 in chunks
The exact positive query ("what does Extract Function do") that failed 0/3 in the throttled 60-probe run fired 3/3 in every small canary chunk. Same query, same skill, same model -- the only variable was concurrent load on the rate window.

**Impact:** Confirmed the 10% recall was purely a measurement artifact and prevented a false "the skill under-triggers" conclusion (and an unwarranted D-08 tuning pass against noise).
**Source:** EVAL-RESULTS.md (EVL-01 rate-limit artifact)

### The code-review BLOCKER changed zero verdicts
CR-01 was a genuine grader correctness bug (a false-pass path) yet re-grading all 54 runs with the fixed grader produced byte-identical gradings and the same aggregate.

**Impact:** The bug was latent -- no coach response in this run ever hit the sub-phrase-match case -- so the reported EVL-02 numbers were unaffected, but the latent false-pass path is now closed for future/adversarial answers.
**Source:** 11-REVIEW.md, re-grade after fix commit 46921aa
