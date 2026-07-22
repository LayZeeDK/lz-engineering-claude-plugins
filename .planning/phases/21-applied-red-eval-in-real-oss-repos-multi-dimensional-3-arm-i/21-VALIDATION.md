---
phase: 21
slug: applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-22
---

# Phase 21 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution. This phase's
> "feature" is the eval INSTRUMENT itself, so validation maps each EVL-03 sub-criterion
> to the deterministic OFFLINE gate that proves it BEFORE the user-gated metered run.
> The instrument is Nyquist-covered when the full battery + the new selfchecks exit 0
> with zero spend and the borrowed repos are left pristine. (Source: 21-RESEARCH.md
> "## Validation Architecture".)

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node ESM selfcheck scripts (assert-and-exit; no test framework) -- the established workspace pattern (`selfcheck-code-review.mjs`, `grade-run.mjs --selfcheck`, `merge-judge.mjs --selfcheck`) |
| **Config file** | none (scripts self-contained); deterministic battery adds `grade-red.mjs` / `tabulate-mechanical-red.mjs` / `selfcheck-red.mjs` |
| **Quick run command** | `node .claude/skills/lz-red-workspace/selfcheck-red.mjs` (composition + base + parse + classifier + prompt-parity cruxes) |
| **Full suite command** | `node .claude/skills/lz-red-workspace/grade-red.mjs --selfcheck && node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --selfcheck && node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck && node .claude/skills/lz-red-workspace/selfcheck-red.mjs` (all exit 0, zero spend) |
| **Estimated runtime** | ~30-60 seconds (offline; no `claude -p`) |

---

## Sampling Rate

- **After every task commit:** Run the touched selfcheck (`node <script> --selfcheck`).
- **After every plan wave:** Run the full battery + `claude plugin validate .`.
- **Before `/gsd:verify-work`:** Full battery green AND borrowed repos pristine (`git status --porcelain` clean) AND `plugins/lz-tdd` untouched.
- **Max feedback latency:** ~60 seconds (all offline).

---

## Per-Task Verification Map

| Req ID | Behavior | Wave | Test Type | Automated Command | File Exists | Status |
|--------|----------|------|-----------|-------------------|-------------|--------|
| EVL-03.1 | Prompt byte-identical across arms except path; non-leading bodies | 0 | unit (dry-run argv) | `node selfcheck-red.mjs` (prompt-parity assertion) | [ ] W0 | pending |
| EVL-03.2 | 3 arms compose correctly (plugin-dir, slash-prefix) | 0 | unit (dry-run argv) | `node selfcheck-red.mjs` (composition crux) | [ ] W0 | pending |
| EVL-03.3 | Correctness classifier decides genuinely_red vs 5 other classes (tsc --strict differential + runner JSON) | 0 | unit (fixtures) | `node grade-red.mjs --selfcheck` | [ ] W0 | pending |
| EVL-03.4 | Mechanical dims + Pass@k/Pass^k tabulate from meta + red-grade | 0 | unit (fixtures) | `node tabulate-mechanical-red.mjs --selfcheck` | [ ] W0 | pending |
| EVL-03.5 | Judge merge + fail-closed verify; oracle-reviewer/judge-input emission | 0 | unit | `node merge-judge.mjs --selfcheck` (reused) + judge-input emission check | [x] merge-judge; [ ] W0 emission | pending |
| EVL-03.6 | No plugins/lz-tdd dep; byproducts git-ignored; repos pristine | 0 | integration | `git status --porcelain` clean after selfcheck; `plugins/lz-tdd` unchanged | [ ] W0 | pending |
| EVL-03.7 | EVAL-RESULTS scaffold: Pass@k/Pass^k tables + reserved unbiased slot + substance-only headline | 0 | doc scaffold | manual review of the scaffold | [ ] W0 | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `grade-red.mjs` + its `--selfcheck` and `fixtures/{red,green,compile,collect,notest}/` -- the genuinely-new logic (author fixtures + classifier together as an instrument-first RED baseline). Covers EVL-03.3.
- [ ] `tabulate-mechanical-red.mjs` + `--selfcheck` over a fixture `meta.json` + `red-grade.json`. Covers EVL-03.4.
- [ ] `selfcheck-red.mjs` (composition + worktree base build/teardown + transcript parse + classifier crux + prompt-parity). Covers EVL-03.1/.2.
- [ ] The one `run-e2e.mjs` edit (skill-name parameterization off `suite.json`) + a regression assertion that the lz-refactor suites still compose unchanged.
- [ ] gitignore lines for the new suite's results tree (prefer os.tmpdir() worktrees so nothing lands in the tracked tree).
- [ ] EVAL-RESULTS.md scaffold (blank numbers, reserved unbiased-reviewer slot, substance-only headline structure). Covers EVL-03.7.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| The metered 3-arm apply RUN and its empirical Pass@k / judge / oracle-reviewer verdicts | EVL-03.5 (verdicts) / EVL-03.7 (results) | User-gated per D-11 / eval-run-approval-gate; spends real tokens; not run in this phase | HALT after the build; present the ready-to-run gated commands; run only on fresh explicit approval, then fill EVAL-RESULTS.md + the unbiased-reviewer slot |

*The BUILD sub-criteria (EVL-03.1-.4, .6, and the .5/.7 wiring/scaffold) close in this phase offline. The RUN sub-criteria (.5 verdicts, .7 results) close in a later, freshly-approved step -- the same "build complete; empirical run gated" shape as EVL-01/EVL-02.*

---

## Validation Sign-Off

- [ ] All Wave-0 tasks have an `--selfcheck` verify or a deterministic battery command
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (the 3 new scripts + fixtures + scaffold)
- [ ] No watch-mode flags
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter (post-execution, by /gsd-validate-phase)

**Approval:** pending
