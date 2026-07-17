# 14-04 SUMMARY -- Metered head-to-head runs (D-12 gated)

**Plan:** 14-04 | **Wave:** 1 | **Status:** complete
**Completed:** 2026-07-15

## What ran

The D-12 eval-run approval gate (Task 1) was presented with the exact commands + spend estimate and
**explicitly approved by the user: approve-3cell (18 runs)**. Both Wave-0 offline self-checks were green
before any spend. Task 2 then executed the approved metered `claude -p` runs.

**18/18 runs captured, all `exit_code: 0`**, recommend mode, k=3, serial, synthetic whole-file-diff base,
`claude-opus-4-8 @ high`, `--setting-sources project`:

| Cell | Target | lz-refactor (invoke_skill) | code_review |
|------|--------|----------------------------|-------------|
| cr-emb | nx enforce-module-boundaries.ts (mechanical) | 3 | 3 |
| cr-rlu | nx runtime-lint-utils.ts (functional/FP) | 3 | 3 |
| cr-gr | kata app/gilded-rose.ts (pattern-directed) | 3 | 3 |

Outputs persisted under `e2e-{nx,gilded-rose}/results/recommend/<arm>/<cell>/run-<k>/` (`answer.md` +
`meta.json`; raw `outputs/` transcripts gitignored). No grading here -- grading is Wave 2 (14-05).

## A1 / A2 measurement-boundary findings (recorded per plan)

- **A2 (sub-agent spawn count):** code_review spawns **1 `Agent` sub-agent** (`tool_calls.Agent: 1`) -- the
  Standards axis; the Spec sub-agent SKIPPED (no originating issue/PRD in the kata/nx corpus), confirming
  D-03. lz-refactor spawns **0** (single read-only context). This tool-usage asymmetry is a D-04 finding,
  not a defect to equalize.
- **A1 (fair cross-arm token headline):** code_review's `model_usage.claude-opus-4-8.output` (e.g. 6550 on
  cr-emb run-1) EXCEEDS its main-context `output_tokens` (4881) -- i.e. `model_usage` / `total_cost_usd`
  **roll up the sub-agent's tokens**, while `input/output_tokens` are main-context-only and UNDERCOUNT
  code_review. **Decision: `total_cost_usd` + `model_usage` totals are the fair cross-arm headline** for
  token/cost; raw `output_tokens` would spuriously favor code_review. (14-05 tabulator uses this headline.)

## Deviation (fixed)

The plan's kata commands used `--suite ../e2e-gilded-rose`; `run-e2e.mjs:57` resolves `--suite` via
`path.resolve` against **CWD** (the workspace root), so `../e2e-gilded-rose` overshot to
`.claude/skills/e2e-gilded-rose` (ENOENT). Corrected to `--suite e2e-gilded-rose` (sibling dir from the
workspace root). Fail-fast caught it before any kata `claude -p` fired -- **zero wasted spend**. The 12 nx
runs (which use the runner's own dir, no `--suite`) were unaffected. Followup note for the plan text: the
kata command assumes CWD=`e2e-nx/`; from the workspace root drop the `../`.

## Teardown / hygiene

- Both borrowed repos verified **pristine**: `git status --porcelain` empty, no `review-*` branch or
  synthetic worktree left behind (runner finally-teardown + a post-abort manual cleanup of one leftover
  `review-T1` worktree from the earlier spend-limit-killed attempt).
- Committed `answer.md` + `meta.json` for all 18 runs (ASCII; no work email; committer = approved public gmail).

## Interruptions during execution

- The earlier spend-limit-killed attempt (org monthly limit) produced zero output and was cleaned up; the
  limit was then reset by the user, and this run completed cleanly.
