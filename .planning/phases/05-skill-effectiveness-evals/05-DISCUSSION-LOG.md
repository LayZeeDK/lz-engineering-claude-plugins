# Phase 5: Skill Effectiveness Evals - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-02
**Phase:** 5-Skill Effectiveness Evals
**Mode:** `--auto --analyze` (autonomous single-pass; recommended option auto-selected per
gray area; trade-off tables recorded here for the audit trail)
**Areas discussed:** Trigger eval harness + set (EVAL-01), Behavior eval + correct-transformation
rubric (EVAL-02), Scoring/sampling + Pass@k/Pass^k, Tuning-pass scope (SC3), Eval-artifact location

---

## Auto-lock trap-quadrant screen

Per the project `--auto` rule, each area was rated IMPACT (hard to reverse?) x CONFIDENCE
(evidence-backed?) before auto-locking. Phase 5 is the LAST phase (no downstream phase
inherits its choices) and is roadmap-declared NON-BLOCKING (findings feed at most one tuning
pass; Phases 1-4 stay complete regardless).

| Area | Impact | Confidence | Trap quadrant? | Basis |
|------|--------|-----------|----------------|-------|
| Trigger harness + set (D-01/02) | LOW | HIGH | No | skill-creator tool contract; SC1 explicit |
| Behavior harness + rubric (D-03/04) | LOW-MED | HIGH | No | ground truth = LOCKED transformations.md + Phase-3 coach procedure + worked examples |
| Scoring + Pass@k/Pass^k (D-05/06) | LOW | MED-HIGH | No | metric formulas fixed by CLAUDE.md; numeric bar soft + tunable + non-blocking |
| Tuning-pass scope (D-07) | MED | HIGH | No | bounded by SC3 + roadmap non-blocking framing |
| Eval-artifact location (D-08) | MED | HIGH | No | strong repeated precedent (Phase-2 D-08, Phase-4 trim) |

None fell in HIGH-impact + NOT-HIGH-confidence -> all safe to auto-lock in one pass.

---

## Trigger eval: harness + set design (EVAL-01)

**Trade-off analysis (--analyze):**

| Approach | Pros | Cons |
|----------|------|------|
| skill-creator `run_loop.py` Description Optimization | Tool-standard; 60/40 train/held-out split; 3x runs/query; picks best_description by held-out score (anti-overfit); produces the EVAL-01 measurement AND the D-07 tuning candidate in one run | Auto-rewrites the description up to 5 iterations (must gate application per D-07) |
| `run_eval.py` one-shot measurement | Pure measurement, no auto-rewrite, simplest | No improvement candidate; a second step needed if tuning is wanted |
| Hand-rolled trigger harness | Full control | Reinvents shipped tooling; against ponytail/YAGNI; no reason to |

Recommended: `run_loop.py` -- it is the shipped, purpose-built mechanism and yields both the
measurement and a gated tuning candidate. Cites SC1 (should/should-not-trigger set) and the
skill-creator "Description Optimization" section.

**[auto] Selected: `run_loop.py` Description Optimization loop + a hand-authored ~20-query set
(8-10 should-trigger, 8-10 near-miss should-not-trigger), session model `claude-opus-4-8`
(recommended default).**

---

## Behavior eval: harness + correct-transformation rubric (EVAL-02)

**Trade-off analysis (--analyze):**

| Scenario source | Pros | Cons |
|-----------------|------|------|
| LOCKED worked examples (Fibonacci walk, Kata 1/2) + a few net-new | Ground truth already proven + cited; near-zero re-derivation risk | Fewer novel scenarios; mitigated by adding Word Wrap impasse |
| All net-new scenarios | Broader coverage | Must re-establish correct answers -> risk of grading the coach against an unverified oracle |

| Grading method | Pros | Cons |
|----------------|------|------|
| Deterministic assertion (transformation name match + no-edit/no-run) | Objective, scripted, reusable, fast | Misses rationale-quality nuance |
| LLM-judge grader | Judges reasoning quality | Subjective, higher variance |

Recommended: LOCKED-example scenarios + deterministic-first assertions (the answer is a named
item from a fixed 14-item list), LLM-judge only for rationale where a string match is
insufficient. Cites Phase-3 D-04 (coach procedure) + transformations.md (LOCKED) + skill-creator
grader.md.

**[auto] Selected: skill-creator test-case + benchmark harness; scenarios from the LOCKED
worked examples + Word Wrap impasse; deterministic-first grading against the canonical list and
the Phase-3 coach procedure (recommended default).**

---

## Scoring, sampling, and reliability metrics

**Trade-off analysis (--analyze):**

| Choice | Pros | Cons |
|--------|------|------|
| >= 3 runs/scenario + Pass@k/Pass^k (k=1,3,5,total) | Project-standard (CLAUDE.md); exposes sampling reliability + flaky/saturated evals | More runs = more tokens/time |
| Single run per scenario | Cheapest | No reliability signal; violates project rule |

Recommended: multi-run + Pass@k/Pass^k reporting, provisional soft bars (trigger held-out
>= ~90%; behavior Pass@1 ~= 1.0 on deterministic scenarios), tunable and non-blocking. Wait for
all completion notifications before grading (timing only available at completion).

**[auto] Selected: multi-run with Pass@k/Pass^k per eval + overall; soft/tunable bars; wait for
all notifications before grading (recommended default, per CLAUDE.md skill-creator rules).**

---

## Tuning-pass scope + non-blocking discipline (SC3)

**Trade-off analysis (--analyze):**

| Choice | Pros | Cons |
|--------|------|------|
| At most ONE bounded pass; apply best_description only if it beats held-out; behavior tweak only on a real defect | Honors SC3; protects LOCKED content; no self-feeding loops | May leave a marginal improvement unshipped (acceptable -- non-blocking) |
| Open-ended iterate-until-perfect | Chases max score | Violates SC3 "at most one pass"; risks the self-feeding loop the auto-mode cap forbids |

Recommended: at most one bounded pass, gated on beating the held-out score; earlier phases never
reopen; if the skill already passes, apply nothing and keep the evals as a validation record.

**[auto] Selected: at-most-one bounded tuning pass, non-blocking, single-pass discipline
(recommended default, per SC3 + the --auto single-pass cap).**

---

## Eval-artifact location + git hygiene

**Trade-off analysis (--analyze):**

| Location | Pros | Cons |
|----------|------|------|
| Eval sets + summary under `.planning/phases/05.../` (PR-filtered) | Matches Phase-2 D-08 / Phase-4 trim; shipped skill stays lean | Eval data not shipped with the plugin (fine -- it is validation material) |
| Commit `evals/` alongside the shipped skill in `plugins/` | Reproducible next to the skill | Bloats the public shipped surface; against progressive-disclosure hygiene + established precedent |
| Scratchpad only (nothing committed) | Zero repo footprint | Loses the reproducible eval record |

Recommended: eval sets + concise EVAL summary + benchmark under `.planning/` (git-tracked,
PR-filtered); keep bulky iteration transcripts out of the shipped surface. Only a D-07 tuning
pass writes into `plugins/`.

**[auto] Selected: `.planning/`-hosted eval artifacts, shipped skill stays lean (recommended
default, following Phase-2 D-08 precedent).**

---

## Claude's Discretion

- Exact eval-query wording and scenario count (>= skill-creator minimums; edge-case-focused).
- Exact assertion text; which assertions are scripted vs judged.
- Workspace directory naming/layout under the phase dir; parallel vs series behavior runs.
- Whether EVAL-01 + EVAL-02 are one plan or split (roadmap sketches a single plan `05-01`).
- Whether to run `run_eval.py` as a standalone pre/post measurement around any tuning.

## Deferred Ideas

- Additional worked examples / languages / cheat-sheet -> post-0.0.1 (NEXT-01, NEXT-04).
- Empty `AGENTS.md` (`@AGENTS.md` import) hygiene defect -> separate quick task, not this phase.
- Turning eval sets into a permanent CI/regression gate -> future; Phase 5 is one-time validation.
