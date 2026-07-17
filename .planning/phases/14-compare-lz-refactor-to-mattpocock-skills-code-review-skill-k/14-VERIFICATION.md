---
phase: 14-compare-lz-refactor-to-mattpocock-skills-code-review-skill-k
verified: 2026-07-15T15:40:00Z
status: passed
score: 12/12 must-haves verified
overrides_applied: 0
re_verification:
  previous_status: none
  previous_score: n/a
gaps: []
human_verification: []
---

# Phase 14: Compare lz-refactor to mattpocock-skills code-review skill (kata + nx) Verification Report

**Phase Goal:** Head-to-head comparison of `/lz-tdd:lz-refactor` (recommend / smell-scan coach mode) vs the third-party `/mattpocock-skills:code-review` skill, on the SAME kata + nx targets, scored across 7 dimensions (lift, token usage, tool usage, output quality, book authenticity via oracle/oracle-reviewer DST-04, over-/under-engineering, and TS/FP/OOP idioms+patterns). Recommend/report mode only. Produces `14-RESULTS.md` + an empirical verdict. Measurement-only: ships NO change to the lz-refactor skill; harness extensions only.

**Verified:** 2026-07-15T15:40:00Z
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

This is a MEASUREMENT-ONLY, terminal phase. There are no REQ-IDs (14-SPEC.md was never locked); the must-haves are the CONTEXT.md decisions D-01..D-12, which the plan frontmatter cites. Every decision was verified against on-disk artifacts, not SUMMARY claims. Because the phase is measurement-only, the empirical verdict (differently-shaped work; lz-refactor cheaper/named/proportionality-guarded/FP-capable, code_review broader with off-axis bug + spec value) is a valid PASS -- a required skill "win" was never the success condition.

### Observable Truths (D-01..D-12)

| #    | Truth (decision)                                                                 | Status     | Evidence |
| ---- | -------------------------------------------------------------------------------- | ---------- | -------- |
| D-01 | lz-refactor runs recommend (invoke_skill, Bash blocked); code_review runs `/mattpocock-skills:code-review`; both produce findings not diffs | VERIFIED | `run-e2e.mjs:198-205,233-246`; selfcheck crux 1 confirms code_review Bash allowed + invoke_skill Bash blocked; 18 recommend-mode runs, Edit/Write blocked |
| D-02 | code_review fed whole target file as diff vs synthetic empty-root baseline (built from applyBase, not HEAD) | VERIFIED | `run-e2e.mjs:386 buildSyntheticBase`, `--synthetic-base` flag; selfcheck crux 2 builds+tears down scoped three-dot diff for nx AND kata; RESULTS + summary.json caveat states off-grain price |
| D-03 | Spec axis skips (no issue/PRD in corpus) -- expected asymmetry, reported not defect | VERIFIED | 14-04 SUMMARY (Spec sub-agent skipped on nx, engaged on kata); RESULTS Caveats "D-03"; summary.json caveats |
| D-04 | All 7 dimensions scored incl. owner-added idiom/pattern axis; ~139-vs-12 breadth is the headline, not normalized away | VERIFIED | mechanical.json (lift/token/tool/spawn/Pass@k for 6 cell,arm rows) + fidelity.json (graded) + summary.json (7-dim rows); RESULTS section 7 + verdict carry the 139-vs-12 headline |
| D-05 | Book-authenticity + idiom/pattern graded via oracle/oracle-reviewer against `.oracle/` (DST-04, agent's own words); FP idioms no-oracle tier | VERIFIED | fidelity.json `_meta` documents DST-04 firewall + oracle_confidence 88/100; per-claim pass/partial/fail + no-oracle FP verdicts in agent's words; main context never read book prose (verifier also did not read `.oracle/`) |
| D-06 | Competitor `code_review` arm added in place to run-e2e.mjs, loads mattpocock via `--plugin-dir` | VERIFIED | `run-e2e.mjs:43 MATTPOCOCK_DIR`, `:46 CODE_REVIEW_COMMAND`, `:139 arm allowlist`, `:246 --plugin-dir` |
| D-07 | meta.json extended with token/cost (input/output/cache/total_cost_usd/model_usage/num_turns) + per-tool tool_calls | VERIFIED | `run-e2e.mjs extractResult:293-355`, meta object `:561-564`; all 18 meta.json carry populated `total_cost_usd`, `input_tokens`, `tool_calls` |
| D-08 | 3 report-framed, non-leading, read-only cr-* queries at the same files code_review reviews; subagent-reviewed incl. unbiased | VERIFIED | 3 cr-* prompts on disk (byte-identical bar path, "Do not edit anything", no named smell); suite.json cr-emb->T1/cr-rlu->T3/cr-gr->G1; 14-02 SUMMARY records 2 reviewers, 1 unbiased, both PASS |
| D-09 | Reuse both suites -- kata gr + representative nx subset | VERIFIED | Cells cr-emb + cr-rlu (nx enforce-module-boundaries, runtime-lint-utils) + cr-gr (kata gilded-rose); both borrowed repos on disk |
| D-10 | 2 arms x 3 cells x k=3 = 18 runs; opus-4-8@high, --setting-sources project, serial, synthetic base, PONYTAIL off | VERIFIED | 18 answer.md + 18 meta.json captured, all exit_code 0; RESULTS header + summary.json (runs_total 18, runs_exit_zero 18) |
| D-11 | 14-RESULTS.md tabulates per cell per dimension, states D-02 + D-03 caveats, empirical verdict, 139-vs-12 headline, >= 1 unbiased reviewer | VERIFIED | RESULTS has 7 dimension tables + Caveats(D-02,D-03,A1,A4) + "Verdict (empirical finding -- not a pre-assumed win)"; 14-05 SUMMARY records unbiased reviewer PASS |
| D-12 | HARD eval-run gate: build-then-halt, explicit user approval, no self-approval | VERIFIED | 14-04-PLAN Task 1 is `checkpoint:decision gate="blocking"`; 14-04 SUMMARY records gate presented + "explicitly approved by the user: approve-3cell (18 runs)"; 18 runs exist as spend evidence |

**Score:** 12/12 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
| -------- | -------- | ------ | ------- |
| `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` | code_review arm + --synthetic-base + token/tool meta | VERIFIED | All three extensions present (D-02/D-06/D-07); ASCII-clean; no debt markers |
| `.claude/skills/lz-refactor-workspace/e2e-nx/selfcheck-code-review.mjs` | offline zero-spend Wave-0 gate | VERIFIED | Exits 0, all 3 cruxes pass, repos left pristine |
| `.claude/skills/lz-refactor-workspace/grading/head-to-head/tabulate-mechanical.mjs` | deterministic mechanical tabulator + --selfcheck | VERIFIED | `--selfcheck` exits 0 (SELFCHECK OK) |
| `.claude/skills/lz-refactor-workspace/grading/head-to-head/mechanical.json` | per-(cell,arm) token/tool/spawn/lift/Pass@k | VERIFIED | 6 rows populated; numbers match RESULTS tables exactly |
| `.claude/skills/lz-refactor-workspace/grading/head-to-head/claims.json` | normalized per-arm claim list | VERIFIED | cr-emb/cr-rlu/cr-gr each with invoke_skill + code_review claims |
| `.claude/skills/lz-refactor-workspace/grading/head-to-head/fidelity.json` | per-claim oracle book/idiom verdicts (own words) | VERIFIED | smells/refactorings/patterns per-claim + per-cell rollup; no fail verdicts; DST-04 |
| `.claude/skills/lz-refactor-workspace/grading/head-to-head/summary.json` | filled 7-dim x 2-arm rollup | VERIFIED | 6 rows across all dimensions + caveats + verdict |
| 3x `prompts/cr-*.md` | report-framed non-leading queries | VERIFIED | Present, read-only, non-leading, wired into suite.json |
| `14-RESULTS.md` | head-to-head record + empirical verdict + caveats | VERIFIED | 7 tables + Caveats(D-02/D-03) + empirical verdict + 139-vs-12 headline; ASCII-clean |
| 18x `results/recommend/<arm>/<cell>/run-<k>/{answer.md,meta.json}` | metered run artifacts | VERIFIED | 18/18 present, answer.md 3-7.5 KB (substantive), meta exit_code 0 |

### Key Link Verification

| From | To | Via | Status | Details |
| ---- | -- | --- | ------ | ------- |
| selfcheck-code-review.mjs | run-e2e.mjs | imports extractResult/buildSyntheticBase + spawns --dry-run | WIRED | `run-e2e.mjs:877 export`; selfcheck exits 0 exercising all three |
| suite.json.prompts | prompts/cr-*.md | file+target fields resolve cr-* to targets.json id | WIRED | cr-emb->T1, cr-rlu->T3, cr-gr->G1 all resolve |
| main context (claim list) | oracle/oracle-reviewer (.oracle/) | DST-04 firewall; verdicts in agent words | WIRED | fidelity.json verdicts present; no book prose in committed output |
| spend gate | run-e2e.mjs --arm ... --synthetic-base | approved commands run only after blocking approval | WIRED | 14-04 gate approved; 18 runs captured |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
| -------- | ------------- | ------ | ------------------ | ------ |
| mechanical.json | per-run token/tool/lift | tabulate-mechanical.mjs over 18 meta.json + answer.md | Yes -- lift 4.67/7.33/8.00 lz vs 0 code_review; costs 0.66/0.49/0.57 vs 0.95/0.85/1.04 | FLOWING |
| summary.json | 7-dim rollup | mechanical.json + fidelity.json + claims.json | Yes -- 6 rows with real numbers + graded verdicts | FLOWING |
| 14-RESULTS.md | dimension tables | summary.json + grading records | Yes -- tables match mechanical.json byte-for-byte on lift/cost/spawn | FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| -------- | ------- | ------ | ------ |
| Harness Wave-0 gate green (D-02/D-06/D-07) | `node e2e-nx/selfcheck-code-review.mjs` | exit 0, 3 cruxes pass, repos clean | PASS |
| Mechanical tabulator correct | `node grading/head-to-head/tabulate-mechanical.mjs --selfcheck` | exit 0, SELFCHECK OK | PASS |
| meta.json D-07 fields populated | inspect 18 meta.json | all exit 0; total_cost_usd/input_tokens/tool_calls present | PASS |
| Tool asymmetry (D-04) | tool_calls per arm | code_review=Bash+Agent (spawns 1-2); lz-refactor=Glob/Read (0 spawns) | PASS |

### Requirements Coverage

No REQ-IDs exist for this phase (Requirements = TBD; 14-SPEC.md never locked; the D-* decisions are the scope, per CONTEXT.md and confirmed by the plan frontmatter). The ROADMAP goal's dimension list (Lift, Token, Tool, Output quality, Book authenticity, Over-/under-engineering) plus the owner-added TS/FP/OOP idiom+pattern axis map exactly to D-04 and are all covered. No orphaned requirements.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| ---- | ---- | ------- | -------- | ------ |
| (none) | -- | No TBD/FIXME/XXX/TODO/HACK/PLACEHOLDER in any phase-14 code file | -- | Clean |

### Public-repo hygiene

- ASCII-only: all 8 committed phase-14 artifacts (RESULTS + 4 grading JSON + 3 code files) scanned, zero bytes > 0x7F.
- Email allowlist-inversion: 0 email-shaped tokens in phase-14 artifacts (safest -- no leak; only the approved gmail would be permitted).
- Committer identity: 15 phase-14 commits scanned, author + committer = approved public gmail on all; zero flagged.
- Borrowed repos: nx and kata both `git status --porcelain` clean, no `review-*` branch/worktree, before AND after re-running the git-only selfcheck.

### Human Verification Required

None. All observable truths were verified programmatically against on-disk artifacts and re-run self-checks. The oracle-graded and judge-graded dimensions were produced in-session by the DST-04 agent channel and the unbiased from-scratch reviewer (recorded PASS in 14-05 SUMMARY); their outputs (fidelity.json, claims.json) exist, are substantive, and internally consistent with the mechanical numbers. No `<human-check>` blocks were deferred in any PLAN.

### Gaps Summary

None. All 12 decisions (D-01..D-12) are realized on disk. The harness extensions exist and both offline self-checks pass; 18 metered runs are captured behind a documented, user-approved D-12 gate; all 7 dimensions are graded (mechanical + oracle/judge DST-04); 14-RESULTS.md states both mandatory caveats, frames an empirical verdict, and reports the 139-vs-12 vocabulary-breadth headline; an unbiased reviewer confirmed the verdict; public-repo hygiene passes; both borrowed repos are pristine. As a measurement-only phase, the parity-with-broader-vocabulary empirical finding is a valid pass, and the shipped lz-refactor skill is unchanged as required.

---

_Verified: 2026-07-15T15:40:00Z_
_Verifier: Claude (gsd-verifier)_
