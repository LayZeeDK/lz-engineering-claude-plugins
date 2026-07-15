---
phase: 14
slug: compare-lz-refactor-to-mattpocock-skills-code-review-skill-k
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-15
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
| 14-01-01 | 01 | 0 | D-06 | T-14-01 / n-a | code_review arm composes a valid `claude -p` command with mattpocock `--plugin-dir` + Bash/sub-agent tool profile; no metered call in dry-run | self-check | `run-e2e.mjs --arm code_review --dry-run` | no (W0) | pending |
| 14-01-02 | 01 | 0 | D-02 | T-14-02 / n-a | synthetic throwaway branch (empty-root -> target-file-only commit) builds + tears down; three-dot diff resolves + is scoped to the target path | self-check | synthetic-branch build/teardown self-check | no (W0) | pending |
| 14-01-03 | 01 | 0 | D-07 | n-a | meta capture parses `usage`/`total_cost_usd`/`modelUsage`/`num_turns` + tool_use histogram from a stream-json result event | self-check | transcript-parse self-check on a fixture | no (W0) | pending |

*Per-task rows are refined by the planner + gsd-nyquist-auditor. Status: pending / green / red / flaky.*

---

## Wave 0 Requirements

- [ ] Offline dry-run self-check: `code_review` arm command composition (D-06) -- asserts plugin-dir + tool profile + no spend.
- [ ] Offline synthetic-branch self-check: whole-file-as-diff baseline build/teardown (D-02) -- asserts three-dot diff resolves + path-scoped, built from suite `applyBase` not HEAD.
- [ ] Offline transcript-parse self-check: token + tool meta extraction (D-07) -- asserts new meta.json fields populate from a fixture stream-json result event.

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

- [ ] All Wave-0 self-checks defined and offline (zero spend)
- [ ] Sampling continuity: no 3 consecutive tasks without an automated/self-check verify
- [ ] Wave 0 covers the three harness-extension cruxes (D-02, D-06, D-07)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s (offline)
- [ ] `nyquist_compliant: true` set in frontmatter (flipped by validate-phase)

**Approval:** pending
