---
phase: 19
slug: distribution-hygiene
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-20
---

# Phase 19 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | node built-in check-*.mjs battery + tsc --strict extractor (dev-only workspaces); no runtime test framework in the shipped plugin |
| **Config file** | `.claude/skills/lz-refactor-workspace/package.json` (npm run check / typecheck) |
| **Quick run command** | `npm run check --prefix .claude/skills/lz-refactor-workspace` |
| **Full suite command** | `npm run check --prefix .claude/skills/lz-refactor-workspace && npm run typecheck --prefix .claude/skills/lz-refactor-workspace && claude plugin validate . --strict` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run the quick check battery (check-hygiene + check-red-references)
- **After every plan wave:** Run the full suite command
- **Before `/gsd:verify-work`:** Full suite must be green + `claude plugin validate . --strict` exit 0
- **Max feedback latency:** 30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | DST-01 / DST-02 / DST-03 | T-19-* / — | ASCII + allowlist-inversion email + no-verbatim gates pass; validate --strict exit 0 | deterministic | `npm run check` | check-hygiene.mjs exists | pending |

*Status: pending / green / red / flaky (filled by validate-phase gsd-nyquist-auditor)*

---

## Wave 0 Requirements

- Existing infrastructure covers all phase requirements. check-hygiene.mjs already walks the lz-red tree + root README/CHANGELOG + both manifests (added 16-01); check-red-references + the tsc --strict extractor already GREEN. No new instrument to build (Phase 19 is a docs + regression-gate + one-scoped-fix phase).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| plugin-validator agent PASS on lz-red | DST-02 | first-party agent gate, orchestrator-spawned | run plugin-dev plugin-validator on the final tree |
| skill-reviewer agent PASS on lz-red | DST-02 | first-party agent gate, orchestrator-spawned | run plugin-dev skill-reviewer on lz-red SKILL.md |

*README/CHANGELOG/manifest factual accuracy is checked by the deterministic gates + validate; the agent gates above are the non-deterministic PASS requirement.*

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter (by validate-phase)

**Approval:** pending
