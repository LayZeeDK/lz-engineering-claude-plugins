---
type: quick-plan
slug: lz-refactor-e2e-nx
created: 2026-07-10
status: in-progress
---

# Quick Task: lz-refactor end-to-end test against nrwl/nx

## Description

Test the `lz-refactor` skill end-to-end on a real-world repo (`D:/projects/github/nrwl/nx` @
`23.0.x`) using isolated `claude -p --plugin-dir` sessions (mirrors this repo's skill-workspace
pattern; `--setting-sources project` drops the user's global plugins to minimize interference).
Curate recognizable code smells in a focused `@nx/*` package, have the skill coach the next NAMED
refactoring, and (staged) apply + verify. Save the prompts used, and optionally run a no-skill
baseline on the same prompts for comparison. JavaScript/TypeScript only.

## Decisions (locked with the user)

1. **Isolation:** throwaway git branch inside the nx clone for any edits; the pristine `23.0.x`
   working tree is never mutated. The read-only `recommend` suite runs in the nx dir directly (no
   writes); `apply` runs only in a branch checkout (`--cwd`).
2. **Targets:** fixed curated set from ONE focused package -- `@nx/eslint-plugin` (pure TS rule +
   utility logic, recognizable self-contained smells). 4 code targets (T1-T4) + a reference probe
   (T5) + a seam/routing negative (T6). See `targets.json`.
3. **Depth (staged):** (a) `recommend`-only `with_skill` suite FIRST (cheap, read-only). Then (b)
   decide whether to run `apply` + typecheck + real tests `with_skill`. Then (c) decide whether to
   run the `no_skill` baseline on the same prompts for comparison.

## Harness (built -- `.claude/skills/lz-refactor-workspace/e2e-nx/`)

- `targets.json` -- curated target manifest (file:line, smell, expected refactoring family, judgment).
- `prompts/p1..p6.md` -- shared prompt bodies (natural phrasing, real file:line, no skill jargon).
- `run-e2e.mjs` -- runner: composes `preamble[mode] + body`, runs `claude -p` per (prompt, arm),
  saves raw stream + extracted `answer.md` + `meta.json`. `--dry-run` and `--report` spend nothing.
- `README.md` -- what/how.

## Steps

1. [done] Curate `@nx/eslint-plugin` targets (T1 enforce-module-boundaries `run` ~570 LOC Long
   Function; T2 `validateEntry` ~107 LOC + `mode` branching; T3 `findTransitiveExternalDependencies`
   imperative loops -> FP; T4 `groupImports` reduce -> clarity; T5 reference de-patterning; T6 seam).
2. [done] Build harness (prompts + runner + README + manifest). Validate with `--dry-run` (no spend).
3. [done] Ran stage (a): `node run-e2e.mjs --mode recommend --arm with_skill` (6 sessions, all exit
   0, nx tree clean). Runner fixed mid-stage: resolve native claude.exe (not the .CMD shim), track
   both lz skills.
4. [done] Graded stage (a) vs `targets.json` -> `E2E-RESULTS.md`. KEY FINDING: coach mode (p1-p4)
   did NOT auto-trigger lz-refactor (baseline Opus answered, and answered very well); skill fired
   only for p5 (lz-refactor reference) and p6 (lz-tpp hand-off). Rubric correction: T3 expected FP
   conversion is wrong for that hot-path code.
5. [GATE / pending user] stage (b) apply+verify on a throwaway branch; stage (c) no_skill baseline
   (most informative scoped to p5+p6, where the skill actually fired).
6. Write final results; update STATE.md Quick Tasks; commit.

## Verification

- Harness `--dry-run` composes prompts + resolves the CLI without spending (done).
- Each executed run produces `answer.md` + `meta.json` with a non-error exit and captured text.
- `with_skill` answers name the expected refactoring family for T1-T4, route T5 to reference, and
  hand T6 off to lz-tpp -- graded against `targets.json`.
- nx pristine tree stays clean (`git -C <nx> status` empty after recommend runs).

## Non-goals

- Committing refactorings to nx (edits are throwaway test evidence).
- Automated/judge grading pipeline (grading is qualitative for this first pass).
- Non-JS/TS code.
