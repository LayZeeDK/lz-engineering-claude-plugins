---
phase: 20
slug: skill-effectiveness-evals
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-21
---

# Phase 20 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This is a skill-effectiveness EVAL phase. `plugins/lz-tdd` ships only dependency-free
> Markdown; there is no runtime feature to unit-test. "Validation" here splits in two:
> (a) DETERMINISTIC, zero-spend, build-time gates that CAN run in the normal battery
> (eval-set lint, grader --selfcheck, tsc --strict on sample fixtures), and (b) the
> EMPIRICAL eval measurements (trigger recall/specificity, RED-behavior vs baseline)
> which spend tokens via `claude -p` and are USER-GATED (CONTEXT.md D-11 / memory
> eval-run-approval-gate) -- they are manual-only by design, not automated in this battery.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | node built-in check-*.mjs battery + tsc --strict extractor in the dev-only `lz-red-workspace`; no runtime test framework in the shipped plugin |
| **Config file** | `.claude/skills/lz-red-workspace/package.json` (npm run check / typecheck) |
| **Quick run command** | `npm run check --prefix .claude/skills/lz-red-workspace` |
| **Full suite command** | `npm run check --prefix .claude/skills/lz-red-workspace && npm run typecheck --prefix .claude/skills/lz-red-workspace && claude plugin validate . --strict` |
| **Estimated runtime** | ~30 seconds (deterministic gates only; the metered eval run is separate + user-gated) |

*To be confirmed/expanded by gsd-nyquist-auditor during `/gsd:validate-phase 20` once the eval-set lint (check-evals) + grader --selfcheck land.*

---

## Sampling Rate

- **After every task commit:** Run the quick check battery (build-time eval-set lint + grader selfcheck + content gate)
- **After every plan wave:** Run the full suite command
- **Before `/gsd:verify-work`:** Full deterministic suite green; the metered eval run is a separate user-approved step
- **Max feedback latency:** ~30 seconds (deterministic gates)

---

## Per-Task Verification Map

*Scaffold -- filled by gsd-nyquist-auditor during validate-phase against the finalized PLAN.md tasks.*

| Task ID | Plan | Wave | Requirement | Correct Behavior | Test Type | Automated Command | Status |
|---------|------|------|-------------|------------------|-----------|-------------------|--------|
| TBD | TBD | TBD | EVL-01 | trigger eval-set lints clean (schema, split, seam-coverage, reciprocal dual-write invariant) | build-time lint | `node .claude/skills/lz-red-workspace/tools/check-evals.mjs` (or chosen name) | pending |
| TBD | TBD | TBD | EVL-02 | grader --selfcheck passes (dimension matchers, negation-aware phrase match, no-drive, alignment) | selfcheck | `node .claude/skills/lz-red-workspace/grade-run.mjs --selfcheck` (or chosen name) | pending |

*Status legend: pending / green / red / flaky.*

---

## Wave 0 Requirements

*To be confirmed by the planner/auditor.* The `lz-red-workspace` instrument already exists (Phase 16:
content gate + tsc extractor). Phase 20 ADDS the vendored eval rig + eval data + a RED-behavior grader;
the deterministic build-time gates (eval-set lint, grader selfcheck, tsc-strict on any sample fixtures)
are the Wave 0 "tests" that must go RED-then-GREEN before the metered run. No runtime test framework is
introduced in the shipped plugin (REQUIREMENTS Out of Scope).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Trigger recall/specificity incl. the three-way boundary + reciprocal RED spot-check | EVL-01 | The measurement runs the skill via `claude -p` (token spend); model-specific; user-gated (D-11) | Present the ready-to-run trigger + reciprocal commands; run only after explicit user approval; target 100% recall / 100% specificity |
| RED-behavior correct-move vs unaided baseline (with_skill vs no_skill) | EVL-02 | Behavior subagents + LLM-judge dimensions spend tokens; user-gated (D-11) | Present the ready-to-run behavior benchmark; run only after approval; report Pass@k/Pass^k vs baseline |

*The DETERMINISTIC halves (eval-set lint + grader selfcheck + tsc-strict fixtures) are automated and run
in the battery; the EMPIRICAL measurements above are manual-only by design per the eval-run approval gate.*

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (deterministic build-time gates)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter (by validate-phase)

**Approval:** pending
