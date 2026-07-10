# lz-refactor Skill Effectiveness Evals -- Results

Phase 11 (optional-final, NON-BLOCKING). Measures the shipped `lz-refactor` skill on two axes:
EVL-01 (does the `description` trigger correctly?) and EVL-02 (when triggered, does the coach
recommend the correct next NAMED refactoring, correct layer?). Nothing here can regress the shipped
skill; it feeds at most a single gated D-08 tuning pass.

Model: claude-opus-4-8 (the session model users experience). Runs: 3 per query/scenario/config (D-06).
Run date: 2026-07-10. Status: RUN COMPLETE. D-08 tuning: NOT applied (no defect; see verdict).

## EVL-01 -- Trigger accuracy (native harness, canary-validated)

| Metric | Result | D-07 bar (~90%) |
|--------|--------|-----------------|
| Should-trigger RECALL (rate >= 0.5) | 10/10 = 100% | PASS |
| Near-miss SPECIFICITY (rate < 0.5) | 10/10 = 100% | PASS |

Both measured via the canary-gated chunk runners (`run-recall-chunks.mjs`, `run-spec-chunks.mjs`):
every chunk carried a known-positive canary and was trusted ONLY when the canary fired, proving a
non-throttled window. Every chunk validated (canary 3/3), every should-trigger fired 3/3, every
near-miss stayed quiet. The `lz-tpp` seam holds: all green/transformation-step negatives ("which
change makes this failing test pass", "minimal transformation to green it") correctly kept
`lz-refactor` quiet.

### EVL-01 rate-limit artifact (important harness lesson, reconfirmed)

The FIRST full serial run (60 back-to-back probes) read a FALSE 10% recall (and would have
inflated specificity) -- the exact Phase-5 throttling artifact. A `rate_limit_event` in the probe
stream plus a single isolated probe firing 1/1 confirmed the cause was rate-limiting under
sustained load, NOT a skill defect: a throttled `claude -p` probe never completes the skill
invocation and reads as a non-trigger. The canary-gated chunk runners (small chunks in healthy
windows, resume-on-throttle) are the throttle-robust measurement and produced the 100%/100% above.
The raw evidence files persist: `trigger-results-d07-recall-chunk-*.json`,
`trigger-results-d07-spec-chunk-*.json`.

## EVL-02 -- Behavior / next-refactoring (with_skill vs baseline, 3 runs each)

Free-drive coach subagents in isolated context; fail-closed deterministic grade (name + layer +
nodrive) -> independent blind LLM rationale judge -> merge -> verify -> aggregate. A run "fully
passes" only when ALL its expectations pass (name + layer + rationale-judge + nodrive).

| Scenario (smell -> expected) | with_skill Pass@1 | baseline Pass@1 |
|------------------------------|-------------------|-----------------|
| eval-0 Long Function -> Extract Function (Fowler) | 100% (3/3) | 100% (3/3) |
| eval-1 Long Parameter List -> Introduce Parameter Object (Fowler) | 100% (3/3) | 100% (3/3) |
| eval-2 Duplicated Code (siblings) -> Pull Up Method (Fowler) | 100% (3/3) | 100% (3/3) |
| eval-3 Feature Envy -> Move Function (Fowler) | 100% (3/3) | 100% (3/3) |
| eval-4 Conditional (whole-algorithm) -> Replace Conditional Logic with Strategy (Kerievsky) | 100% (3/3) | 100% (3/3) |
| eval-5 State-altering conditionals -> Replace State-Altering Conditionals with State (Kerievsky) | 100% (3/3) | 100% (3/3) |
| eval-6 Combinatorial explosion -> Replace Implicit Language with Interpreter (Kerievsky) | 100% (3/3) | 100% (3/3) |
| eval-7 Unwarranted Singleton -> Inline Singleton (Away) / Module Namespace (functional) | 100% (3/3) | 100% (3/3) |
| eval-8 Repeated type switch -> Replace Conditional with Polymorphism (Fowler, NOT a pattern) | 100% (3/3) | 67% (2/3) |

**Overall (n=27/config):** with_skill Pass@1 = 100% (27/27), Pass@3 = 100%. baseline Pass@1 = 96.3%
(26/27), Pass@3 = 100%. Coach drove in 0/54 runs (nodrive clean; the coach only advised, never
edited code or ran tests).

**Discriminating signal (Pass^k, conservative all-k-pass):** the only scenario that separates the
configs is eval-8 (the designed routing-boundary trap): with_skill Pass^3 = 1.0 (all 3 runs argue
the Fowler mechanical route over a design pattern), baseline Pass^3 = 0 (one of 3 baseline runs
named the right refactoring but never argued WHY it is not a pattern-directed move -- the LLM judge
correctly failed that run's rationale).

### Saturation (D-06 flag)

41 of 45 assertions are saturated (Pass@1 = 1.0 for BOTH configs) -- see
`iteration-1/passk-metrics.json`. Baseline claude-opus-4-8 already names the correct refactoring
and layer with sound rationale on nearly every scenario, so the benchmark measures little skill
LIFT. The entire 100%-vs-96% gap rests on the single eval-8 rationale nuance. This is an
eval-DESIGN limitation (the scenarios are not hard enough to separate a strong base model from the
skill), NOT a grading-fidelity defect. Harder, more-discriminating scenarios are a candidate for a
future iteration (deferred; this phase is a one-time non-blocking validation).

### Grader limitations (documented; compensated by the LLM judge here)

An independent from-scratch auditor (unbiased-beats-primed, D-06) audited 22 runs + the grader
source and found NO false passes and NO false fails; the reported numbers faithfully reflect the
transcripts. It flagged structural leniency in the DETERMINISTIC grader that did not bite this run
(all answers were genuinely correct) but would not reliably catch a cleverly-worded wrong answer
without the LLM judge:
- The `layer` check (`layersInResponse`) passes on the presence of ANY accepted-layer name; it does
  not enforce the "NOT a Kerievsky pattern" EXCLUSION its own eval-8 rubric text advertises.
- Name matching is substring/word-bounded but negation-blind and checks PRESENCE, not PRIMACY -- a
  correct name mentioned only inside a "do not use X" disclaimer would still match.
- `nodrive` is a fail-safe placeholder here (the text-only harness gives the coach no edit tools),
  so it cannot fail on these runs.
Real discrimination therefore rests on the exact best-fit NAME presence plus the LLM rationale
judge, which behaved well (a substantive, defensible FAIL on eval-8 baseline run-1; specific,
line-cited PASS verdicts elsewhere; no rubber-stamping).

## D-07 verdict

- **Trigger (EVL-01):** PASS. 100% recall + 100% specificity (canary-validated), well above the ~90% bar; the `lz-tpp` seam holds.
- **Behavior (EVL-02):** PASS on the high-Pass@1 bar (with_skill 100%, zero misses across 9 scenarios x 3 runs, both layers + de-patterning). It does NOT "clearly beat" baseline (96.3%) -- but because baseline claude-opus-4-8 is already saturated on this scenario set, NOT because the skill has any routing defect. The skill matches or beats baseline everywhere and is the only config that passes the eval-8 routing-boundary trap on all runs.

## D-08 tuning

NOT applied. D-08 authorizes at most one bounded tuning pass ONLY on a demonstrated defect: a
description that beats the current one on a held-out trigger set, or a coach-wording fix for a real
routing defect. There is no defect to fix -- triggering is 100%/100% and with_skill routing is 100%
correct. Per D-07/D-08 ("if the skill already meets the bars, no tuning pass is applied and the
evals stand as a validation record"), the shipped skill stands unchanged. This matches the Phase-5
outcome (no tuning needed). No file under `plugins/` was modified by this phase.

## Reproduce / resume

- **Trigger (EVL-01):** `python -m scripts.run_eval --eval-set ../../evals/trigger-eval.json
  --skill-path <repo>/plugins/lz-tdd/skills/lz-refactor --model claude-opus-4-8 --runs-per-query 3
  --num-workers 1` from `tools/skill-creator-eval/` (with `PONYTAIL_DEFAULT_MODE=off`;
  `--strict-mcp-config` + `--setting-sources project` are baked into run_eval.py). Under a
  rate-limited window this UNDER-reads recall -- use the throttle-robust canary-gated runners
  instead: `node run-recall-chunks.mjs` and `node run-spec-chunks.mjs` (resume on re-invoke).
- **Behavior (EVL-02):** unnamed fire-and-forget coach subagents per scenario x config x run (>= 3)
  writing `outputs/transcript.md` + `metrics.json`, then a blind rationale judge writing
  `judge-verdicts.json`; resume with the filesystem-driven todo (re-run only units missing a
  transcript / verdict). Grade chain: `node grade-run.mjs` -> merge the judge verdicts with
  `node merge-judge.mjs --merge` -> `node merge-judge.mjs --verify iteration-1` (gate) ->
  aggregate to `iteration-1/benchmark.json` + `iteration-1/passk-metrics.json` + `benchmark.md`.

## Harness lessons (authoritative run config)

- **A rate-limited window makes the trigger probe UNDER-read (false non-triggers).** Confirmed again
  this run: a full 60-probe serial pass read 10% recall while single isolated probes and canary-gated
  chunks read 100%. Validate recall/specificity via the canary-gated chunk runners, never a single
  large serial pass under load.
- **Run the trigger probe serially (`--num-workers 1`)** and with `PONYTAIL_DEFAULT_MODE=off`.
- **`--strict-mcp-config` + `--setting-sources project`** drop MCP servers and user plugins (both
  sibling skills) so neither real skill steals the probe; keep the ephemeral project skill.
- **EVL-02 is robust to rate-limiting but sensitive to hard spend caps.** The behavior run tolerates
  slow/failed agents (resume re-runs only missing units); it was interrupted once by the org monthly
  spend limit at 28/54 coach runs and resumed cleanly from disk.
