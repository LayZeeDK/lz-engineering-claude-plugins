---
phase: 7
slug: fowler-catalog-refactoring-2nd-ed
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-04
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This is a Markdown skill-authoring phase: there is no application test runner.
> Validation is a `tsc --strict` compile harness over the extracted TS/JS samples
> plus Node/shell checkers asserting catalog completeness, provenance, and hygiene.
> The per-task map and sign-off are finalized by `/gsd-validate-phase 7` post-execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `tsc --strict --noEmit` (TypeScript 6.x) over a non-shipped compile workspace + Node/`rg` checkers (no app test runner) |
| **Config file** | `.claude/skills/lz-refactor-workspace/tsconfig.json` (created Wave 0; gitignored-record pattern, mirrors lz-tpp-workspace) |
| **Quick run command** | `npx tsc --strict --noEmit -p .claude/skills/lz-refactor-workspace/tsconfig.json` |
| **Full suite command** | Above `tsc` run PLUS the catalog/smell/principle/hygiene checkers (66-name + provenance, 24-smell count, Ch.2 topic presence, ASCII-only, no-verbatim DST-04, work-email allowlist) |
| **Estimated runtime** | ~10-30 seconds |

---

## Sampling Rate

- **After every task commit:** Run the `tsc --strict` quick command over samples added by that task
- **After every plan wave:** Run the full suite (tsc + all checkers)
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD (finalized by validate-phase) | — | — | FWL-01..04 | see PLAN threat_model | N/A (guidance skill) | checker/compile | see Full suite command | ❌ W0 | ⬜ pending |

*Status: pending / green / red / flaky. Populated by `/gsd-validate-phase 7` after execution.*

---

## Wave 0 Requirements

- [ ] `.claude/skills/lz-refactor-workspace/tsconfig.json` + `package.json` — compile harness for extracted TS/JS samples (FWL-04)
- [ ] A completeness checker asserting all 66 refactoring names present + the 5 print-absent entries provenance-tagged (FWL-01)
- [ ] A smell-count checker asserting the 24 Fowler smells + resolving catalog cross-links (FWL-02)
- [ ] A Ch.2 topic-presence checker (two hats / rule of three / preparatory / comprehension / litter-pickup / performance / YAGNI) (FWL-03)
- [ ] Hygiene checkers: ASCII-only, no verbatim Fowler prose/code (DST-04), work-email allowlist

*Extends the Phase-6 Wave-0 SC checker approach.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Owner-oracle content fidelity (mechanics/motivations/smell/Ch.2 match the owner's e-book/web edition) | FWL-01..04 | Requires the owner's Fowler *Refactoring* 2nd-ed e-book/web edition; no automatable oracle | At the D-07 AskUserQuestion checkpoint, the owner confirms distilled content against the e-book, batched by tag-group |
| Behavior-preservation of each before->after sample | FWL-04 | Semantic equivalence is not fully machine-checkable beyond compilation | Reviewer confirms each before/after pair preserves behavior |

---

## Validation Sign-Off

- [ ] All tasks have automated verify (compile/checker) or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (harness + checkers)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter (by validate-phase)

**Approval:** pending
