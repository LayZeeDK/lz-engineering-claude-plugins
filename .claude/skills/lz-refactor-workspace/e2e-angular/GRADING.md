# e2e-angular grading -- multi-dimensional judged comparison vs no_skill

Mirrors the **Phase 14 head-to-head rollup** (`../grading/head-to-head/`, the lz-refactor vs
mattpocock code-review eval) and the **nx/kata EVL-02** grade chain, adapted to **apply/drive mode**.
Matt Pocock rule carried over: **independent parallel judges per axis, reported side-by-side, NO
cross-dimension winner** (one axis must not mask another).

## Arms (per target, k=3)

- **no_skill** -- baseline Opus 4.8 @ high, apply mode, NO lz plugin (`--setting-sources project`,
  no `--plugin-dir`). The comparison baseline the user asked for.
- **with_skill** -- lz plugin loaded (`--plugin-dir`), natural apply prompt (auto-trigger; also
  measures the coach auto-trigger rate the nx e2e flagged).
- **invoke_skill** -- forced `/lz-tdd:lz-refactor` apply (guarantees activation; isolates
  skill-active quality from the trigger question).

## Dimensions

MECHANICAL (script-computed from run meta.json + the applied diff; Pass@k where a per-run predicate exists):

| dim | definition |
|-----|-----------|
| `lift` | distinct named Fowler/Kerievsky/functional refactorings actually APPLIED per run (diff + transcript; word-bounded name matcher copied from grade-run.mjs). |
| `token_usage` | total_cost_usd + per-model usage (rolls up sub-agents). Continuous -> report totals, passk N/A. |
| `tool_usage` | tool-call histogram + Edit/Write count + sub-agent spawn count. |
| `drove_vs_advised` | did the arm EDIT the code (>=1 Edit/Write to the target) vs only advise? (the nx coach-vs-apply no-edit tension). Per-run boolean -> Pass@k. |
| `behavior_preservation` | `tsc --noEmit` pass AND golden-master match where node-callable (ac1/ac2, an1 attempt). Per-run boolean -> Pass@k. |

GRADED (independent parallel judges; unbiased-from-scratch brief per >=1 judge; `book_authenticity` via oracle/oracle-reviewer, DST-04 firewall -- main context never reads .oracle prose):

| dim | definition |
|-----|-----------|
| `output_quality` | is the applied refactoring correct, useful, well-sequenced vs `targets.json`.expected_family/judgment? |
| `over_under_engineering` | proportionality: no speculative pattern APPLIED (e.g. did NOT introduce a top/bottom Strategy on cd1; did NOT class-ify ac1), no missed simplification (took the dup-loop / Parameterize win). |
| `book_authenticity` | fidelity of any named refactoring/smell/pattern the run CITES to the .oracle books (Fowler/Kerievsky/GoF); functional idioms vs functional-depatterning research. Apply runs cite less than recommend runs -- grade what is cited, do not penalize terseness. |
| `idiom_pattern` | correctness + aptness of the TS/FP/OOP idiom or pattern used in the applied change. |
| `incrementality` | small behavior-preserving steps (typecheck/tests between steps) vs one big rewrite -- graded from the diff/transcript. |

## Reporting

Per cell (target) x arm: Pass@1, Pass@3, Pass^3 for each boolean dimension; totals for continuous
ones. Side-by-side table like `head-to-head/summary.template.json`. Headline: **does with_skill /
invoke_skill beat no_skill on any dimension, and where?** Expected (per triple-closed axis + nx
apply arm): parity on output_quality/behavior_preservation; any skill delta concentrated in
`lift` / `idiom_pattern` / `book_authenticity` (vocabulary + grounding), NOT in a better or
more-correct applied result.

## Judge integrity (per memory: unbiased-beats-primed, oracle firewall)

- >=1 judge per graded axis runs a neutral from-scratch brief (no prior findings, no expected answer).
- `book_authenticity` MUST route through the `oracle`/`oracle-reviewer` agents; the grading harness
  and main context never read `.oracle/` prose (DST-04).
- Fail-closed deterministic checks first (edit-count, tsc, golden-master), then LLM judges.
