---
phase: 14-compare-lz-refactor-to-mattpocock-skills-code-review-skill-k
plan: 03
subsystem: eval-grading
tags: [head-to-head, mechanical-tabulator, pass-at-k, zero-spend, D-04, D-07]
requires:
  - "14-01 run-e2e.mjs extractResult() meta.json fields (input_tokens, output_tokens, cache_read_input_tokens, cache_creation_input_tokens, total_cost_usd, num_turns, model_usage, tool_calls)"
  - "grade-run.mjs nameRe + FOWLER/KERIEVSKY name arrays"
  - "run-e2e.mjs comb/passAtK/passHatK"
provides:
  - "grading/head-to-head/tabulate-mechanical.mjs (deterministic mechanical-dimension tabulator + --selfcheck)"
  - "grading/head-to-head/summary.template.json (7-dimension x 2-arm rollup skeleton for 14-05)"
  - "grading/head-to-head/fixtures/{meta.sample.json,answer.sample.md} (known-value fixtures pinning the selfcheck)"
affects:
  - "14-05 (DST-04 grading): fills the GRADED dimension blocks + runs the tabulator over real phase-14 runs"
  - "14-04 (D-12 spend gate): tabulate-mechanical.mjs --selfcheck is one of the two zero-spend gates"
tech_stack:
  added: []
  patterns:
    - "Fail-closed offline --selfcheck against known-value fixtures (check-evals.mjs / grade-run.mjs shape)"
    - "Verbatim-copy of the shipped nameRe matcher + Pass@k helpers rather than reinvention (PATTERNS Pattern F)"
    - "Spelling-agnostic sub-agent spawn count (match a name SET, not one hardcoded tool name)"
key_files:
  created:
    - ".claude/skills/lz-refactor-workspace/grading/head-to-head/tabulate-mechanical.mjs"
    - ".claude/skills/lz-refactor-workspace/grading/head-to-head/fixtures/meta.sample.json"
    - ".claude/skills/lz-refactor-workspace/grading/head-to-head/fixtures/answer.sample.md"
    - ".claude/skills/lz-refactor-workspace/grading/head-to-head/summary.template.json"
  modified: []
decisions:
  - "Lift tagged MECHANICAL here (the tabulator computes a distinct-named-refactoring heuristic); the graded lift refinement stays oracle-owned in 14-05, matching the plan's D-04 wording."
  - "Copied nameRe + name arrays + Pass@k helpers verbatim rather than importing: grade-run.mjs runs main() on import with no exports, and run-e2e.mjs does not export the stats helpers."
  - "Spawn count matches a case-insensitive name set {task, agent} so the count survives whichever spelling the CLI uses for the sub-agent-spawn tool."
  - "Did NOT generate/commit mechanical.json -- it is a 14-05 output, not a scaffolding artifact; main-mode output during verification went to scratch."
metrics:
  tasks: 2
  files: 4
  duration: ~25min
  completed: 2026-07-15
---

# Phase 14 Plan 03: Zero-Spend Mechanical Grading Scaffolding Summary

Deterministic mechanical-dimension tabulator (tokens/cost, tool histogram + sub-agent spawn count, distinct-named-refactoring lift, Pass@k/Pass^k) that reuses the shipped `nameRe` matcher and `run-e2e.mjs` Pass@k helpers and self-checks against known-value fixtures at zero spend, plus a seven-dimension x two-arm head-to-head rollup template for the Wave-2 graded fills.

## What was built

### Task 1: `tabulate-mechanical.mjs` + fixtures + `--selfcheck` (commit afe77ba)
- Walks the two phase-14 recommend results trees (`--results`/`--cell`/`--arm`/`--out` overridable), reads every per-run `meta.json` + sibling `answer.md`, and emits per `(cell, arm)`:
  - **token/cost totals** -- `total_cost_usd` + per-model `model_usage` roll-up (headline, aggregates sub-agents) and `input_tokens`/`output_tokens` (main-context-only), consuming the EXACT D-07 field names 14-01's `extractResult()` emits (verified against the committed `run-e2e.mjs`, commits d64226c/6ea94e7).
  - **tool_calls histogram + sub-agent spawn count** -- spawn count = sum of `tool_calls` entries whose name is a spawn tool, matched case-insensitively against `{task, agent}` (spelling-agnostic; ~2 expected for `code_review`, 0 for lz-refactor).
  - **lift** -- distinct named Fowler/Kerievsky refactorings surfaced in `answer.md` via the reused word-bounded `nameRe`, with longest-match shadow-suppression (so `Factory Function` never phantom-counts inside `Replace Constructor with Factory Function`).
  - **Pass@k / Pass^k** on the `lift>0` predicate (k=1,3), using `comb`/`passAtK`/`passHatK` copied verbatim from `run-e2e.mjs`.
- `nameRe` + `FOWLER`/`KERIEVSKY` arrays are COPIED VERBATIM from `grade-run.mjs`; the Pass@k helpers COPIED VERBATIM from `run-e2e.mjs`. Neither module is importable (grade-run.mjs runs `main()` on import with no exports; run-e2e.mjs does not export the stats helpers), so copy-with-provenance keeps the head-to-head numbers identical to the shipped grader/runner (PATTERNS Pattern F).
- **Fail-closed** (T-14-07): a garbled/unparseable `meta.json`, or one missing `prompt_id`/`arm`, aborts with exit 1 -- never a silent skip.
- `--selfcheck` drives the pure `tabulateGroup` core against the two committed fixtures and asserts the expected token totals, opus model-row cost, spawn count (2), lift count (2), and Pass@k values -- **exits 0 with an OK line**, zero spend.

### Task 2: `summary.template.json` (commit 4754eec)
- Machine-readable head-to-head rollup skeleton: arms `lz-refactor` (= `invoke_skill`) and `code_review`; one block per the seven D-04 dimensions (`lift`, `token_usage`, `tool_usage`, `output_quality`, `book_authenticity`, `over_under_engineering`, `idiom_pattern`); each block has 6 per-`(cell, arm)` rows (3 cells x 2 arms) with null `{n, c, passAt1, passAt3, passHat3}` placeholders.
- A top-level `dimension_kind` map tags each dimension MECHANICAL (lift, token_usage, tool_usage) or GRADED (the other four), a `passk_source` note points at the `run-e2e.mjs` helpers, and the `idiom_pattern` block carries the ~139-vs-12 vocabulary-breadth headline field (lz-refactor 139 named refactorings/patterns/idioms + 28 smell leaves vs code-review's 12 Fowler smells).
- The mandatory D-02 whole-file-diff off-grain caveat and the D-03 Spec-axis-skip asymmetry are recorded in a top-level `caveats` array for 14-05 to carry into `14-RESULTS.md`.

## Verification

| Check | Command | Result |
|-------|---------|--------|
| Task 1 gate (D-12 zero-spend) | `node grading/head-to-head/tabulate-mechanical.mjs --selfcheck` | exit 0, "SELFCHECK OK" |
| Task 2 parse | `node -e "JSON.parse(readFileSync(summary.template.json))"` | PARSE=OK |
| Template shape | 7 dimensions, each tagged MECHANICAL/GRADED, 6 rows each, all passk cells null | ALL CHECKS PASS |
| Vocabulary headline | idiom_pattern.vocabulary_breadth_headline | 139 vs 12 |
| Main mode fail-closed | tabulate over the two recommend trees (0 phase-14 runs yet) | exit 0, wrote 0 blocks (to scratch) |
| ASCII-only (all 4 files) | non-ASCII byte scan | ASCII-clean |
| Public-repo hygiene | allowlist-inversion email scan + committer identity | no email tokens; committer = approved gmail |

No metered `claude -p` run occurred (D-12 gate lives in 14-04).

## Deviations from Plan

None -- plan executed exactly as written. The plan's frontmatter `files_modified` lists `mechanical.json` implicitly only as the tabulator's OUTPUT path; it is intentionally NOT committed here (it is a 14-05 output produced from real runs, not scaffolding). During verification the tabulator's main-mode output was written to the session scratchpad, keeping the tracked tree clean.

## Known Stubs

The seven dimension blocks in `summary.template.json` are intentional null-placeholder templates (this is the plan's deliverable -- a rollup skeleton). The MECHANICAL blocks are filled by `tabulate-mechanical.mjs` and the GRADED blocks by oracle/oracle-reviewer/judge, both in 14-05, after the D-12-gated metered runs exist. This is documented in the file's `status` field.

## Self-Check: PASSED
- All 4 created files exist on disk (verified).
- Both per-task commits exist in git history: afe77ba (Task 1), 4754eec (Task 2).
- `tabulate-mechanical.mjs --selfcheck` exits 0.
