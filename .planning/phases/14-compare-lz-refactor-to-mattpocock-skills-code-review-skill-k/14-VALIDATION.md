---
phase: 14
slug: compare-lz-refactor-to-mattpocock-skills-code-review-skill-k
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-15
validated: 2026-07-15
---

# Phase 14 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This is a MEASUREMENT-ONLY eval phase: "code under test" = the harness extensions
> (competitor arm + meta capture) + grading scaffolding in the tracked
> `.claude/skills/lz-refactor-workspace/` tree. Validation is by OFFLINE, ZERO-SPEND
> build-time self-checks that gate BEFORE the D-12 metered-run halt; the head-to-head
> RESULTS + verdict are produced by graded runs AFTER the gate.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js stdlib self-checks (no new deps) + existing `npm run check` in the workspace |
| **Config file** | `.claude/skills/lz-refactor-workspace/package.json` (existing check scripts) |
| **Quick run command** | `node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs --mode recommend --arm code_review --dry-run` (offline command-composition self-check) |
| **Full suite command** | `cd .claude/skills/lz-refactor-workspace && npm run check` (existing lints) + the two Wave-0 offline self-checks |
| **Estimated runtime** | < 30 seconds (all offline; no `claude -p` spend) |

---

## Sampling Rate

- **After every task commit:** Run the relevant offline self-check (dry-run command composition, or transcript-parse, or synthetic-branch build/teardown).
- **After every plan wave:** Run the full offline suite (`npm run check` + both Wave-0 self-checks).
- **Before any metered run:** All offline self-checks green AND the D-12 eval-run-approval gate presented + explicitly approved.
- **Max feedback latency:** < 30 seconds (offline).

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 14-01-01 | 01 | 0 | D-06 | T-14-01 / n-a | code_review arm composes a valid `claude -p` command with mattpocock `--plugin-dir` + Bash/sub-agent tool profile; no metered call in dry-run | self-check | `node e2e-nx/selfcheck-code-review.mjs` (crux 1) | yes | green |
| 14-01-02 | 01 | 0 | D-02 | T-14-02 / n-a | synthetic throwaway branch (empty-root -> target-file-only commit) builds + tears down; three-dot diff resolves + is scoped to the target path | self-check | `node e2e-nx/selfcheck-code-review.mjs` (crux 2, nx+kata) | yes | green |
| 14-01-03 | 01 | 0 | D-07 | n-a | meta capture parses `usage`/`total_cost_usd`/`modelUsage`/`num_turns` + tool_use histogram from a stream-json result event | self-check | `node e2e-nx/selfcheck-code-review.mjs` (crux 3) | yes | green |
| 14-03-01 | 03 | 0 | D-04 / D-07 | T-14-07 / n-a | mechanical tabulator computes token/spawn/lift/Pass@k vs fixtures and fails closed (exit 1) on garbled/missing-key meta | self-check | `node grading/head-to-head/tabulate-mechanical.mjs --selfcheck` | yes | green |

*Per-task rows are refined by the planner + gsd-nyquist-auditor. Status: pending / green / red / flaky.*

---

## Wave 0 Requirements

- [x] Offline dry-run self-check: `code_review` arm command composition (D-06) -- asserts plugin-dir + tool profile + no spend.
- [x] Offline synthetic-branch self-check: whole-file-as-diff baseline build/teardown (D-02) -- asserts three-dot diff resolves + path-scoped, built from suite `applyBase` not HEAD.
- [x] Offline transcript-parse self-check: token + tool meta extraction (D-07) -- asserts new meta.json fields populate from a fixture stream-json result event.

*These three offline self-checks are the zero-spend Wave-0 gate; they run before the D-12 metered halt.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Book-authenticity + TS/FP/OOP idiom/pattern fidelity of each arm's findings | D-04/D-05 | DST-04: graded by the `oracle`/`oracle-reviewer` agents (own words), not a mechanical assertion | After approved runs land outputs, package each finding claim to `oracle`; record pass/partial/fail per arm |
| Output quality + over-/under-engineering | D-04 | Judgment call; graded with an unbiased from-scratch reviewer | Judge findings against the target code; include >= 1 unbiased reviewer per [[unbiased-review-beats-primed]] |
| The head-to-head verdict itself | D-11 | Empirical finding synthesized from all graded cells | Tabulate lz-refactor vs code_review per dimension in 14-RESULTS.md; verdict = finding, never pre-assumed |

---

## Validation Sign-Off

- [x] All Wave-0 self-checks defined and offline (zero spend)
- [x] Sampling continuity: no 3 consecutive tasks without an automated/self-check verify
- [x] Wave 0 covers the three harness-extension cruxes (D-02, D-06, D-07)
- [x] No watch-mode flags
- [x] Feedback latency < 30s (offline)
- [x] `nyquist_compliant: true` set in frontmatter (flipped by validate-phase)

**Approval:** APPROVED -- 2026-07-15, gsd-nyquist-auditor. All four Wave-0 self-checks run GREEN and are
adversarially confirmed can-fail (see Validation Audit below). Zero metered spend. Borrowed repos pristine.

---

## Validation Audit (gsd-nyquist-auditor, 2026-07-15)

Verdict: GAPS FILLED (no gaps). The self-checks built in 14-01 / 14-03 were RE-RUN from scratch (not
taken on the prior SUMMARY's word) and independently corroborated. Every crux is COVERED by a self-check
that was proven to actually fire (can fail), not pass trivially.

| Crux | Requirement | Verdict | Self-check command | Green? | Evidence |
|------|-------------|---------|--------------------|--------|----------|
| D-06 composition | 14-01-01 | COVERED | `node e2e-nx/selfcheck-code-review.mjs` (crux 1) | yes | argv shows `-p /mattpocock-skills:code-review ea7e4fae...` (40-hex ROOT), `--plugin-dir` = mattpocock cache, `--disallowedTools Edit Write MultiEdit NotebookEdit` (NO Bash); invoke_skill blocks Bash + uses `plugins/lz-tdd`; `code_review` sans `--synthetic-base` throws + exits 1. Asymmetry preserved. |
| D-02 synthetic branch | 14-01-02 | COVERED | `node e2e-nx/selfcheck-code-review.mjs` (crux 2) | yes | Built + tore down synthetic branches for BOTH nx (`packages/eslint-plugin/src/rules/enforce-module-boundaries.ts`) and kata (`TypeScript/app/gilded-rose.ts`): three-dot `ROOT...TIP` diff non-empty, `ls-tree` scoped to exactly the target path, kata armCwd = `<worktree>/TypeScript` (Pitfall 4). Both borrowed repos independently verified pristine after (empty porcelain, no `review-*` branch/worktree). |
| D-07 meta capture | 14-01-03 | COVERED | `node e2e-nx/selfcheck-code-review.mjs` (crux 3) | yes | `extractResult()` over the on-disk Phase-13 transcript -> input_tokens=37, total_cost_usd=1.5663615, tool_calls non-empty (Read+Glob+Bash+Edit). |
| T-14-07 tabulator | 14-03-01 | COVERED | `node grading/head-to-head/tabulate-mechanical.mjs --selfcheck` | yes | `--selfcheck` exit 0 (token totals, opus model row cost, spawn=2, lift=2, Pass@k vs fixtures). Fail-closed independently PROVEN via main path against scratch fixtures: garbled JSON -> `FAIL - garbled meta.json` exit 1; missing prompt_id/arm -> `FAIL - ... missing prompt_id/arm` exit 1. |

Adversarial notes:
- The tabulator `--selfcheck` only exercises the pure `tabulateGroup` core; the T-14-07 fail-closed
  mitigation lives in `collectRuns()` (main path), so it was verified SEPARATELY with scratch garbled /
  missing-key meta fixtures -- both exit 1 for the CORRECT reason (a first attempt exited 1 on an
  unrelated ENOENT and was rejected as a false green).
- Crux 1 was corroborated by directly inspecting the runner's `argv:` dry-run line, not by trusting the
  self-check's own parse.
- Optional cross-check `npm run check` (workspace) also exits 0 -- no unrelated lint regressions.
- Zero metered `claude -p` spend; the D-12 gate is untouched. No implementation (.mjs) files modified.

**Final `nyquist_compliant`: true.** All three harness cruxes (D-02/D-06/D-07) plus the grading tabulator
(T-14-07) are covered by offline, zero-spend, fail-closed self-checks that were re-run GREEN and shown to
be genuinely can-fail. No gaps, no escalations.
