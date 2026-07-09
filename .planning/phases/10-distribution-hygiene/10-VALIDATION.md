---
phase: 10
slug: distribution-hygiene
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-09
---

# Phase 10 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js ESM checkers (custom `*.mjs` scripts) + `tsc --strict`; agent gates (`plugin-validator`, `skill-reviewer`, `oracle-reviewer`); first-party `claude plugin validate` CLI |
| **Config file** | `.claude/skills/lz-refactor-workspace/package.json` (`npm run check` battery + `npm run typecheck`); repo-root `.claude-plugin/marketplace.json` for `claude plugin validate .` |
| **Quick run command** | `npm run check` (from the lz-refactor workspace) |
| **Full suite command** | `npm run check && npm run typecheck` (workspace) + `claude plugin validate . --strict` (repo root) |
| **Estimated runtime** | ~30-90 seconds (checker battery + `tsc --strict` over ~251 modules); agent/oracle-reviewer sweeps are longer, run at gate time |

---

## Sampling Rate

- **After every task commit:** Run `npm run check` (workspace)
- **After every plan wave:** Run `npm run check && npm run typecheck` (workspace)
- **Before `/gsd:verify-work`:** Full suite green + `claude plugin validate . --strict` exits 0 + first-party review PASS + DST-04 sweep clean
- **Max feedback latency:** ~90 seconds for the deterministic layer

---

## Per-Task Verification Map

<!-- Completed by /gsd-validate-phase after PLAN.md files exist. One row per task,
     mapping DST-01..04 to its objective signal (checker exit code, agent verdict,
     oracle-reviewer sweep verdict, or CLI exit code). See 10-RESEARCH.md
     "## Validation Architecture" for the requirement -> signal mapping. -->

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| {N}-01-01 | 01 | 1 | DST-{XX} | T-10-01 / — | {expected secure behavior or "N/A"} | checker | `{command}` | ✅ / ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Harden `check-hygiene.mjs` axis (c) WARN -> HARD gate (D-01 layer 1) and widen the D-10 target walk to a RED-then-GREEN baseline BEFORE authoring the README/CHANGELOG/manifest prose it gates.

*The deterministic instrument (hardened + widened `check-hygiene.mjs`) is this phase's Wave 0 test infrastructure. The oracle-reviewer clean-room sweep and first-party agent reviews are gate-time verifications, not persistent test files.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| First-party `plugin-validator` + `skill-reviewer` PASS on both skills | DST-02 | Agent judgment, not a deterministic script | Spawn `plugin-dev` agents on the final tree; PASS = no structural/manifest/security/path-traversal errors |
| No verbatim Fowler/Kerievsky/GoF prose on the proven-collision surfaces | DST-04 | Book prose lives in git-ignored `.oracle/`; only the read-only `oracle-reviewer` subagent may read it (clean-room) | Batched-by-chapter `oracle-reviewer` sweep over `## Intent` (gof + extra) and `## Mechanics` (fowler + kerievsky); every verdict must be `pass` |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 90s (deterministic layer)
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
