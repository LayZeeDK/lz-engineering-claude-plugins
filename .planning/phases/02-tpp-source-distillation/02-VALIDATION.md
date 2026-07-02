---
phase: 2
slug: tpp-source-distillation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-02
---

# Phase 2 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none - Markdown docs deliverable; validation via mechanical shell checks (rg / node) + semantic cross-check, no unit-test framework |
| **Config file** | none |
| **Quick run command** | `rg -n '[^\x00-\x7F]' plugins/lz-tdd/skills/lz-tpp/references/transformations.md` (ASCII-only gate; expect no output) |
| **Full suite command** | `{docs verification script - defined by planner in Wave 0}` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run the ASCII-only gate + presence checks (`rg` for the 14 list entries, citations, required section headings)
- **After every plan wave:** Run the full docs verification (per-entry fidelity cross-check against the primary source anchors in 02-RESEARCH.md)
- **Before `/gsd:verify-work`:** All mechanical checks green; semantic cross-check complete
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 2-01-01 | 01 | 1 | TPP-03 | T-2-01 / - | Transcript retained under .planning (not shipped in skill) | file-presence | `test -f .planning/phases/02-tpp-source-distillation/ndc-2011-tpp-transcript.md` | [ ] W0 | pending |
| 2-02-01 | 02 | 2 | TPP-01, TPP-02, TPP-04 | - | ASCII-only + all 14 entries + citations present | shell-assertion | `rg -n '[^\x00-\x7F]' plugins/lz-tdd/skills/lz-tpp/references/transformations.md` (expect none) | [ ] W0 | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [ ] `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` presence + ASCII-only + section-heading checks
- [ ] `.planning/phases/02-tpp-source-distillation/ndc-2011-tpp-transcript.md` presence check
- [ ] Fidelity cross-check checklist (14 entries + key quotes) sourced from 02-RESEARCH.md "Verified Content Anchors"

*Populated post-execution by gsd-validate-phase; this draft lists the mechanical + semantic checks the docs deliverable needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| 12-vs-14 discrepancy explicitly resolved (14-item canonical, 12-item documented, secondary drift noted) | TPP-02 | Semantic judgement, not a string match | Read transformations.md provenance section; confirm the resolution statement + both lists + drift note are present |
| Transformations-vs-refactorings distinction + provisional-heuristic framing present | TPP-04 | Semantic judgement | Read transformations.md; confirm the distinction is stated and the author's hedges are quoted with per-post citations |
| NDC transcript reconciled with discrepancies NOTED (not silently resolved) | TPP-03 | Semantic judgement | Read transformations.md reconciliation section; confirm any transcript-vs-blog differences are called out with blogs stated as authoritative |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
