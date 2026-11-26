---
phase: "23"
slug: "agent-as-developer-conversion-of-lz-red-lz-tpp-and-lz-refact"
# status lifecycle: draft (seeded by plan-phase) -> validated (set by validate-phase section 6)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-11-26"
---

# Phase 23 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Seeded from 23-RESEARCH.md "Validation
> Architecture".

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `node:test` + `tsc` (tools/evals); Node `.mjs` selftests and gates (workspaces); `claude plugin validate` |
| **Config file** | `tools/evals/package.json` (`check`), `tools/evals/tsconfig.json`; workspace `package.json` `check` scripts |
| **Quick run command** | `npm --prefix .claude/skills/lz-red-workspace run check` and `npm --prefix .claude/skills/lz-refactor-workspace run check` |
| **Full suite command** | both workspace checks, `npm --prefix tools/evals run check`, `claude plugin validate . --strict`, `node .claude/skills/lz-red-workspace/variants/build-variants.mjs`, `node .claude/skills/lz-red-workspace/selfcheck-routing.mjs` |
| **Estimated runtime** | ~180 seconds (tools/evals check about 116 s measured) |

---

## Sampling Rate

- **After every task commit:** the workspace check the commit touches, plus the skill-contract check once it exists
- **After every plan wave:** the full suite command
- **Before `/gsd-verify-work`:** full suite must be green; the paid after run only if Lars approves its cost
- **Max feedback latency:** 180 seconds

---

## Per-Task Verification Map

Filled by the planner per task (requirement ids AGD-01 to AGD-12 from 23-RESEARCH.md).

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `tools/evals/check-skills.ts` + `.test.ts`: banned coach phrases, line formats against committed graders, coach skill present, description caps (AGD-01, 03, 05); asserted RED at HEAD
- [ ] Hygiene coverage for `skills/lz-tdd-coach/` (AGD-05)
- [ ] Variant single-axis and staleness checks (AGD-07)
- [ ] Leaf-reachability check for the seven named leaves (AGD-09), or a one-time measured `rg` in the plan

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Reviewer gates on every skill-text change | AGD-11 | Agent review, not a script | Orchestrator spawns the D-10 reviewer agents after each skill change |
| Before/after behaviour numbers | AGD-10 | Paid; needs Lars's yes on cost | `node tools/evals/eval.ts run evals/results/<after>` then aggregate and crosscheck |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 180s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
