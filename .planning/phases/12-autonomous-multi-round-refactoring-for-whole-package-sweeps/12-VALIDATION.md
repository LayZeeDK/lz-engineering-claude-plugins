---
phase: 12
slug: autonomous-multi-round-refactoring-for-whole-package-sweeps
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-11
---

# Phase 12 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution. ASCII-only
> (repo convention). This phase's "tests" are build-time lints (fast, unattended) plus
> a metered `claude -p` eval run that is USER-GATED behind `/reload-plugins` (D-18) --
> the eval run is the behavior oracle, not a unit-test suite.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js ESM checkers + skill-creator-eval (native-fixed run_eval.py) under `.claude/skills/lz-refactor-workspace/` |
| **Config file** | `.claude/skills/lz-refactor-workspace/package.json` (npm run check battery) |
| **Quick run command** | `node .claude/skills/lz-refactor-workspace/tools/check-evals.mjs` (build-time eval-set lint, no claude -p) |
| **Full suite command** | trigger recall/spec chunk runners + `e2e-nx` / `e2e-gilded-rose` runners (metered claude -p; USER-GATED per D-18) |
| **Estimated runtime** | lints ~seconds; metered eval + e2e ~tens of minutes (gated) |

---

## Sampling Rate

- **After every SKILL.md / eval-set edit:** `check-evals.mjs` lint stays green (schema, >=8/>=8 split, >=2 seam, ASCII-only); `claude plugin validate .` passes.
- **After the plugin is reloaded (USER `/reload-plugins`):** trigger recall/spec + e2e before/after runs (D-16).
- **Before phase complete:** both gaps measured CLOSED before/after in BOTH suites (SC4); the existing 18/18 e2e recall + 11/11 specificity re-run with no regression (SC1).
- **Max feedback latency:** build-time lints immediate; the metered runs are the gated behavior oracle.

---

## Per-Task Verification Map

*To be completed by validate-phase / gsd-nyquist-auditor after plans exist. Anchor each
plan task to: a build-time lint (check-evals / check battery / claude plugin validate), the
D-17 subagent review (incl. >=1 unbiased) for SKILL.md edits, or a gated eval/e2e run.*

| Task ID | Plan | Wave | Requirement (SC) | Test Type | Automated Command | Status |
|---------|------|------|------------------|-----------|-------------------|--------|
| TBD | TBD | TBD | SC1..SC4 | lint / review / gated-eval | TBD | pending |

*Status: pending / green / red / flaky (ASCII words, no symbols).*

---

## Wave 0 Requirements

- [ ] Sweep-shaped trigger positives added to `evals/trigger-eval.json`; sweep-shaped negatives added to BOTH `evals/trigger-eval.json` and `evals/d07-chunks/negatives.json` (dual-write); `check-evals.mjs` green.
- [ ] Baseline capture (current shipped skill) archived under `baseline/` BEFORE any SKILL.md edit (reproduces Gap 1 ~0 trigger + Gap 2 stop-and-ask).

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Plugin reload before after-measurement | SC4 | `/reload-plugins` cannot be run by Claude; committed != live (D-18) | User runs `/reload-plugins`, then the after-measurement runs proceed |
| Metered eval / e2e run | SC1, SC4 | Spends `claude -p`; user pre-approved conditionally (agent-reviewed Markdown) | Present ready-to-run commands; run after reload |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [ ] Every plan task anchored to a build-time lint, a D-17 review, or a gated eval/e2e run
- [ ] Sampling continuity: no build task without a lint/validate check
- [ ] Wave 0 covers eval-set edits + baseline capture before any SKILL.md change
- [ ] No watch-mode flags; `--num-workers 1` locked for eval runs
- [ ] `nyquist_compliant: true` set in frontmatter (by validate-phase)

**Approval:** pending
