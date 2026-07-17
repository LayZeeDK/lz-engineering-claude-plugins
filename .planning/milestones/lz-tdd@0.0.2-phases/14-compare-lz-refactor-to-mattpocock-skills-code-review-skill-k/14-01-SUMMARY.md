---
phase: 14-compare-lz-refactor-to-mattpocock-skills-code-review-skill-k
plan: 01
subsystem: eval-harness
tags: [eval, harness, run-e2e, code-review, synthetic-diff, meta-capture, zero-spend, wave-0]
requires:
  - "run-e2e.mjs recommend/apply/arm/persist backbone (Phase 11-13)"
  - "mattpocock-skills@1.2.0 plugin cached locally"
  - "borrowed repos on disk (nrwl/nx origin/23.0.x, GildedRose kata main)"
provides:
  - "code_review competitor arm (D-06) composing /mattpocock-skills:code-review <ROOT>"
  - "buildSyntheticBase: equal-input whole-file-diff baseline from applyBase (D-02)"
  - "D-07 token/cost/tool meta.json fields"
  - "offline zero-spend Wave-0 gate (selfcheck-code-review.mjs)"
affects:
  - "14-04 metered runs (consume the code_review arm + synthetic-base)"
  - "14-05 grading (consumes token/tool meta)"
tech-stack:
  added: []
  patterns:
    - "git plumbing (commit-tree/write-tree/update-index/worktree) as the runner's own ungated child"
    - "empty-root synthetic commit as code-review's three-dot fixed point"
    - "module-main guard + ESM exports so an offline self-check can import runner internals"
    - "machine-parseable argv: line in --dry-run for spawn-based self-check assertions"
key-files:
  created:
    - ".claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs"
  modified:
    - ".claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs"
decisions:
  - "D-06: code_review arm added in place with its OWN tool profile (allow Bash + Agent, block Edit/Write); NOT in both/all fan-outs; requires --synthetic-base"
  - "D-02: synthetic empty-root ROOT -> target-only-tree TIP throwaway branch built from applyBase (not HEAD), scoped to exactly the target path; kata TypeScript/ prefix"
  - "D-07: token/cost/tool meta read from the stream-json result event; total_cost_usd/model_usage headline, usage main-context-only"
  - "tool-profile asymmetry (Bash allowed for code_review, blocked for lz-refactor) is preserved as the D-04 finding, not equalized"
metrics:
  duration: 8min
  completed: 2026-07-15
  tasks: 3
  files_changed: 2
---

# Phase 14 Plan 01: run-e2e.mjs Harness Extensions + Wave-0 Self-Check Summary

Extended the recommend harness `run-e2e.mjs` in place with a `code_review` competitor arm, a `--synthetic-base` equal-input whole-file-diff baseline, and token/cost/tool meta capture, gated by a new offline zero-spend self-check that leaves both borrowed repos pristine -- the load-bearing Wave-0 build before any metered spend.

## What Was Built

**Task 1 -- D-07 token/cost/tool meta (`run-e2e.mjs`, commit b02a71e)**
`extractResult()` now reads `usage` (input/output/cache tokens), `total_cost_usd`, `modelUsage`, and `num_turns` from the stream-json `result` event, and builds a `tool_use`-by-name histogram from the block loop it already walks. It returns 8 new fields; `runOne`'s `meta` object writes them alongside every pre-existing field. Tokens are read from the CLI's own reported usage -- never recomputed from transcript text (RESEARCH "Don't Hand-Roll"). `total_cost_usd`/`model_usage` are the headline cross-arm cost (they roll up sub-agents); `input/output_tokens` are main-context-only.

**Task 2 -- code_review arm + `--synthetic-base` (`run-e2e.mjs`, commit 47ad17e)**
- Module consts `MATTPOCOCK_DIR` (os.homedir()-derived, `MATTPOCOCK_DIR` env override) + `CODE_REVIEW_COMMAND`.
- `parseArgs`: `code_review` added to the `--arm` allowlist (NOT to `both`/`all`); new `--synthetic-base` flag; `code_review` without `--synthetic-base` throws.
- `composePrompt`: `code_review` branch returns `/mattpocock-skills:code-review <root_sha>` with no preamble/body (`root_sha` threaded via `promptEntry`, set during setup).
- `buildCmd`: per-arm tool profile -- `code_review` blocks only Edit/Write/MultiEdit/NotebookEdit (Bash + Agent stay allowed); the recommend arms keep Bash blocked. Per-arm `--plugin-dir` (mattpocock cache for `code_review`, `plugins/lz-tdd` for with_skill/invoke_skill). The Bash asymmetry is the D-04 finding -- not equalized.
- `buildSyntheticBase()`: from the suite `applyBase` (origin/23.0.x / main), builds `empty-root ROOT -> commit-tree TIP` adding only the target blob (via a throwaway `GIT_INDEX_FILE`), branches `review-<target>`, and `worktree add`s it; kata's `TypeScript/` prefix is resolved from the git root and the arm cwd is `<worktree>/TypeScript`. Finally-style teardown (`worktree remove --force` + `prune` + `branch -D`). Dry-run builds only the loose ROOT (no branch/worktree) so the borrowed repo stays clean.
- `main()`: a `--synthetic-base` run branch builds the worktree per target, runs the selected arms x runs in it, and tears down in a `finally`. A module-main guard + `export { extractResult, buildSyntheticBase, git, MATTPOCOCK_DIR, CODE_REVIEW_COMMAND }` let the self-check import internals without running the CLI. `--dry-run` also emits a machine-parseable `argv:` line.

**Task 3 -- offline Wave-0 self-check (`selfcheck-code-review.mjs`, commit 629c25c)**
Fail-closed, ASCII-only, no framework. Three cruxes, zero spend:
1. Composition -- spawns `--dry-run --arm code_review --synthetic-base --prompt p1`, asserts the `-p` value is `/mattpocock-skills:code-review <40-hex>`, `--plugin-dir` is the mattpocock cache, and Bash is NOT blocked; asserts `--arm invoke_skill` still blocks Bash and uses `plugins/lz-tdd`.
2. Synthetic branch -- builds+tears down for BOTH nx (`T1`) and kata (`G1`, `main`): three-dot `git diff ROOT...TIP --stat` non-empty, `git ls-tree -r --name-only TIP` equals exactly the ROOT-relative target path, kata `armCwd == <worktree>/TypeScript` (Pitfall 4), then teardown leaves `git status --porcelain` empty with no `review-*` branch/worktree.
3. Transcript parse -- runs the extended `extractResult()` over the on-disk Phase-13 transcript; asserts `input_tokens>0`, `total_cost_usd>0`, `tool_calls` non-empty.

Not wired into `npm run check` (it touches borrowed repos + reads a gitignored transcript); it runs explicitly.

## Verification

- `node .claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs` -> exit 0, all three cruxes green (`input_tokens=37, total_cost_usd=1.5663615, tools=Read+Glob+Bash+Edit`).
- `--dry-run --arm code_review --synthetic-base --prompt p1` composes `/mattpocock-skills:code-review <40-hex>`, mattpocock `--plugin-dir`, no Bash blocked. `--arm invoke_skill` keeps Bash blocked + `plugins/lz-tdd`. `code_review` without `--synthetic-base` exits 1.
- Both borrowed repos (`D:/projects/github/nrwl/nx`, `D:/projects/github/emilybache/GildedRose-Refactoring-Kata`) are `git status --porcelain` clean with no `review-*` branch or worktree after the self-check.
- No metered `claude -p` run occurred (D-12 gate is deferred to plan 14-04).

## Deviations from Plan

None -- plan executed as written. All three tasks landed on-grain with the analogs the pattern map named; the synthetic build+teardown was de-risked with a throwaway probe (both suites, incl. cross-drive C:-temp worktrees over D:-drive repos) before commit.

## Requirements

The plan's `requirements: [D-06, D-07, D-02]` are phase DECISION ids, not `REQUIREMENTS.md` ids (Phase 14 locks no 14-SPEC.md; the D-* decisions are the scope). They are IMPLEMENTED by this Wave-0 build but the head-to-head verdict they serve is not delivered until the later plans (14-04 metered runs, 14-05 grading), so no `REQUIREMENTS.md` checkbox is flipped here (verified absent from `REQUIREMENTS.md`).

## Known Stubs

None. `model_usage`/`tool_calls` default to `{}` only when a transcript carries no `result` event (a correct empty fallback), not a placeholder.

## Self-Check: PASSED

- FOUND: `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs`
- FOUND: `.claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs`
- FOUND commit b02a71e (feat 14-01: D-07 meta capture)
- FOUND commit 47ad17e (feat 14-01: code_review arm + --synthetic-base)
- FOUND commit 629c25c (test 14-01: offline Wave-0 self-check)
