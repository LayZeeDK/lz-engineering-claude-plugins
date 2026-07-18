---
phase: 16
slug: source-distillation-core-red-references
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-19
---

# Phase 16 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Strategy scaffold from 16-RESEARCH.md `## Validation Architecture`. The detailed
> per-task map + sign-off are finalized by gsd-nyquist-auditor at /gsd-validate-phase.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js structural checkers (ESM, node builtins, no test framework) + a pinned `typescript` per-fence tsc --strict extractor; Vitest 4.1.10 types for the example fences only |
| **Config file** | `.claude/skills/lz-red-workspace/tsconfig.json` (strict) + `package.json` (pinned `typescript`, `vitest@4.1.10`) -- dev-only workspace; the shipped `plugins/lz-tdd` tree has NO build deps |
| **Quick run command** | `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` (completeness/contract; the RED baseline) |
| **Full suite command** | `check-red-references.mjs` + `extract-samples.mjs` (tsc --strict per fence) + repo-global `check-hygiene.mjs` (ASCII / work-email allowlist / no-verbatim) |
| **Estimated runtime** | ~20-40 seconds (deterministic, offline, free) |

---

## Sampling Rate

- **After every content task commit:** Run `check-red-references.mjs` + `extract-samples.mjs`.
- **After every wave:** Run the full battery (add `check-hygiene.mjs`).
- **Before phase close:** Full battery GREEN + oracle-reviewer converge-to-clean on every owned surface.
- **Max feedback latency:** ~40 seconds.

---

## Nyquist RED baseline (why tsc alone is insufficient)

The tsc --strict extractor is **GREEN-on-empty** -- zero code fences compile vacuously, so it
is NOT the RED->GREEN signal for content authoring. The instrument-first RED baseline is the
`check-red-references.mjs` completeness checker: it is RED while the three references still carry
only Phase-15 stub content and turns GREEN when the SEL / STR / NAME slices are authored with
their required own-words facts + at least one tsc-strict example each.

---

## Per-Task Verification Map

| Task ID | Wave | Requirement | Threat Ref | Test Type | Automated Command | Status |
|---------|------|-------------|------------|-----------|-------------------|--------|
| 16-Wave0 | 0 | (instrument) | T-16-* | completeness | `check-red-references.mjs` (asserts RED baseline) | pending |
| 16-SEL | 1 | SEL-01, SEL-02 | T-16-verbatim | completeness + tsc | `check-red-references.mjs` + `extract-samples.mjs` | pending |
| 16-STR | 1 | STR-01, STR-02 | T-16-verbatim | completeness + tsc | `check-red-references.mjs` + `extract-samples.mjs` | pending |
| 16-NAME | 1 | NAME-01 | T-16-verbatim | completeness + tsc | `check-red-references.mjs` + `extract-samples.mjs` | pending |
| 16-Gate | 2 | all | T-16-* | full battery | full battery + oracle-reviewer + `claude plugin validate .` | pending |

*Status: pending / green / red / flaky. Detailed per-task rows finalized by gsd-nyquist-auditor.*

---

## Wave 0 Requirements

- [ ] `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` -- completeness/contract checker (RED baseline against the current stubs).
- [ ] `.claude/skills/lz-red-workspace/tools/extract-samples.mjs` + `tsconfig.json` -- one-module-per-fence tsc --strict extractor (copied/adapted from lz-refactor-workspace).
- [ ] `.claude/skills/lz-red-workspace/package.json` -- pinned `typescript` + `vitest@4.1.10` (dev-only; not in `plugins/`).
- [ ] Extend repo-global `check-hygiene.mjs` no-verbatim/ASCII/email targets to include the lz-red reference tree.

*Planner's call (D-11): a fresh `lz-red-workspace` (recommended by RESEARCH.md) vs. reusing the lz-refactor-workspace extractor.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Own-words fidelity of OWNED-source surfaces (RCM one-step/one-concept; Metz name-for-behavior) | SEL-01, STR-02, NAME-01 | Copyright/DST-04 judgement is not fully deterministic | oracle-reviewer converge-to-clean (3-round cap), CONTENT_TYPE=other + driver anchors; main context never reads `.oracle/` |
| No-oracle high-confidence-core surfaces (Beck/Wake/North/Osherove) | SEL-01/02, STR-01/02, NAME-01 | No `.oracle/` source to gate against | Deterministic no-verbatim scan (`check-hygiene.mjs`) only |

---

## Validation Sign-Off

- [ ] All content tasks gate on `check-red-references.mjs` + `extract-samples.mjs`
- [ ] Sampling continuity: no 3 consecutive tasks without an automated check
- [ ] Wave 0 stands up the checker + tsc extractor and asserts the RED baseline
- [ ] No watch-mode flags in any committed command
- [ ] Every owned surface passed oracle-reviewer; no-verbatim scan GREEN
- [ ] `nyquist_compliant: true` set post-execution by gsd-nyquist-auditor

**Approval:** pending
