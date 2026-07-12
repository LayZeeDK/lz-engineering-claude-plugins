---
status: complete
quick_id: 260712-i5y
date: 2026-07-12
---

# Quick Task 260712-i5y: Package-scope directive-prompt eval (nx + kata), live vs baseline

## Goal

Measure whether a whole-package NATURAL/directive prompt (no leading `/lz-refactor`) drives the
lz-refactor skill to identify + triage code smells across a package and refactor them to a
multi-round fixpoint. nx `@nx/eslint-plugin` + Gilded Rose kata. Live (latest-commit skill) measured
first, then the most relevant baseline (`no_skill` = base Opus 4.8 @ high, no plugin).

## Instruments (built + reviewed this task)

- `e2e-nx/prompts/p8-eslint-plugin-package-directive.md`: "Identify the code smells in the
  `@nx/eslint-plugin` package and refactor them away. The tests are green." (id `p8`, target `pkgsweep`)
- `e2e-gilded-rose/prompts/gr4-project-directive.md`: kata analog (id `gr4`, target `projsweep`)
- Register: **directive-unscripted** (imperative + no `/lz-refactor` + no scripted steps) -- a third
  register distinct from interrogative-natural (`p7`/`gr3`) and scripted-command (`p7cmd`/`gr3cmd`).
  Renamed from `-natural` to `-directive` after unbiased review flagged the mislabel.

## Review gate (before any run)

- Unbiased prompt+config review: p7/gr3 FAIR; p8/gr4 relabeled directive (wording kept = user's
  literal prompt); config OK (valid JSON, all files exist, wiring correct).
- Harness code review of `run-e2e.mjs`: recommend safe as-is; applied 3 apply-mode fixes before
  spending -- I1 (git reset/clean `mustSucceed` guard, no silent edit-stacking), I3 (stage-before-diff
  so untracked extracted files are captured), I5 (Windows timeout kills the process tree). I2/I4
  (report denominator / exit-0-error) handled in manual grading. I6 (nx cache) mitigated via `nx reset`.

## Run config

apply mode, `--model claude-opus-4-8 --effort high`, k=3 per arm, `--setting-sources project`,
`--strict-mcp-config`. Live = `with_skill` (auto-trigger via `--plugin-dir` = latest commit).
Baseline = `no_skill` (no plugin). nx timeout raised to 45 min. All 12 runs exit 0 (no timeout/429).

## Results

### nx `p8` (real package, many files)

| arm | auto-fired | files triaged | rounds | behavior preserved | traps |
|-----|-----------|---------------|--------|--------------------|-------|
| LIVE (with_skill) | 3/3 | 6 / 4 / 5 | 4-6 | yes (169 pass, 15 pre-existing) | excluded red-spec + public-API + exported sig; checkpointed before ~530-line run() |
| no_skill (base Opus) | n/a | 5 / 5 / 3 | 3-5 | yes | same exclusions + checkpoint |

### kata `gr4`

| arm | auto-fired | scope | rounds | Conjured trap |
|-----|-----------|-------|--------|---------------|
| LIVE | 3/3 | gilded-rose.ts + generated characterization snapshot | multi | avoided 6/6 (run-3 only added a clarifying comment) |
| no_skill | n/a | same | multi | avoided |

## Findings

1. **The capability exists and works.** The directive package prompt auto-triggers (no `/lz-refactor`),
   triages across the package, and drives multi-round behavior-preserving refactoring to a safe fixpoint.
2. **No measurable skill value-add at package scale.** `no_skill` (base Opus 4.8 @ high) matches the
   live skill on triage breadth, round count, Fowler-move selection, behavior preservation,
   blast-radius exclusions, and checkpoint-before-risky posture. Consistent with the full session
   ladder (single-file trigger, single-file drive, kata) -- the skill shows no measurable behavioral
   delta vs base Opus in any measured condition.
3. **"To completion" is safety-bounded.** Both arms stopped at the safe-duplication fixpoint and
   asked before the highest-blast-radius Long-Function decomposition. Correct autonomy-precision, but
   not exhaustive smell elimination.
4. **"FP idioms + design patterns" barely fired at package scale** -- warranted smells were
   duplication (mechanical Extract); both arms correctly declined premature patterns.

## Disposition input

Reinforces the open keep/revert-12-02 decision: the shipped skill's measurable e2e value is null
across all scopes/gaps vs base Opus. Base Opus 4.8 @ high is already catalog-grade at package-scale
multi-round refactoring. Decision deferred to the user (see conversation).
