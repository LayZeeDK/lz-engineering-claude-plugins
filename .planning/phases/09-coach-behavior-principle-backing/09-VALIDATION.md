---
phase: 09
slug: coach-behavior-principle-backing
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-08
---

# Phase 09 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Draft created at plan-time from the RESEARCH.md `## Validation Architecture`
> section. Completed and flags flipped by `/gsd-validate-phase 09` after execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | node-builtin checker harness (`.mjs`, no test framework) + `tsc --strict` typecheck + `claude plugin validate .` |
| **Config file** | `.claude/skills/lz-refactor-workspace/package.json` (`npm run check` battery) |
| **Quick run command** | `npm run check` (in `.claude/skills/lz-refactor-workspace/`) |
| **Full suite command** | `npm run check && npm run typecheck && claude plugin validate .` |
| **Estimated runtime** | ~{N} seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run check`
- **After every plan wave:** Run the full suite (`npm run check && npm run typecheck`)
- **Before `/gsd:verify-work`:** Full suite + `claude plugin validate .` must be green
- **Max feedback latency:** {N} seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| {N}-01-01 | 01 | 1 | REQ-{XX} | T-{N}-01 / — | {expected secure behavior or "N/A"} | structural | `npm run check` | ✅ / ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*
*Populated by `/gsd-validate-phase 09` after execution against the RED->GREEN wave sequence in `09-RESEARCH.md`.*

---

## Wave 0 Requirements

- [ ] `check-backing.mjs` (or extended `check-principles.mjs`) — RED baseline against the empty/stub principle refs (D-09)
- [ ] `tools/lib/heading-scan.mjs` — shared fence-aware `collectH1Lines` helper (D-10 / IN-02)

*Instrument-first: the structural checker gate is built to a RED baseline BEFORE content lands; requirements close only when the full `npm run check` battery goes GREEN.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Behavioral routing correctness (coach recommends the correct next refactoring) | CCH-01..06 | Not machine-checked in this phase — deferred to Phase 11 EVL-02 | skill-reviewer PASS + manual spot-check of the routing decision tree |

*Structural existence / token-presence / cross-link resolution are automated; behavioral routing accuracy is Phase 11's EVL-02.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < {N}s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** {pending / approved YYYY-MM-DD}
