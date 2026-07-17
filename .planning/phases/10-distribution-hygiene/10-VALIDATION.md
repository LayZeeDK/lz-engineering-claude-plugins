---
phase: 10
slug: distribution-hygiene
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-09
---

# Phase 10 -- Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

This is a docs / distribution phase: there is no unit-test framework and no runtime
code to unit-test. The automated "test suite" is the deterministic checker battery +
`tsc --strict` + the first-party `claude plugin validate` CLI, complemented by the
plan verify-block content assertions (`git grep` of the required manifest / README /
CHANGELOG strings). Two verifications are legitimately manual (agent judgment and the
git-ignored clean-room source comparison); both were completed at the phase gate.

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

## Per-Requirement Verification Map

| Requirement | Plan | Secure/Correct Behavior | Test Type | Automated Command | Status |
|-------------|------|-------------------------|-----------|-------------------|--------|
| DST-01 | 10-02 (T1/T2) | manifests + README truthfully describe a two-skill `0.0.2` plugin; ASCII + email-clean | checker + CLI + content assert | `git grep -qF '"version": "0.0.2"' -- plugins/lz-tdd/.claude-plugin/plugin.json && git grep -qF 'lz-refactor' -- .claude-plugin/marketplace.json README.md && node tools/check-hygiene.mjs && claude plugin validate .` | green |
| DST-02 | 10-01 / 10-04 | shippable surface ASCII + work-email-free + no verbatim book prose; manifest structure valid, no path-traversal | battery + CLI + agents | `npm run check && npm run typecheck && claude plugin validate . --strict` (+ plugin-validator / skill-reviewer PASS, manual) | green |
| DST-03 | 10-02 (T3) | CHANGELOG carries the `[lz-tdd@0.0.2]` entry above 0.0.1 with the `%40`-encoded release-tag link-ref | content assert + checker | `git grep -qF '[lz-tdd@0.0.2]' -- CHANGELOG.md && git grep -qF 'releases/tag/lz-tdd%400.0.2' -- CHANGELOG.md && node tools/check-hygiene.mjs` | green |
| DST-04 | 10-01 / 10-03 | no verbatim Fowler/Kerievsky/GoF prose on the proven-collision surfaces (`## Intent`, `## Mechanics`) | checker (axis c, HARD) + oracle sweep | `node tools/check-hygiene.mjs` (axis c HARD gate, 180 files clean) + `oracle-reviewer` clean-room sweep (manual, attested in 10-DST-04-ATTESTATION.md) | green |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

- [x] Harden `check-hygiene.mjs` axis (c) WARN -> HARD gate (D-01 layer 1) and widen the D-10 target walk to a RED-then-GREEN baseline BEFORE authoring the README/CHANGELOG/manifest prose it gates. **Delivered in 10-01** (10-checker battery; axis (c) is a HARD `report()` gate over verbatimTargets; wide (a)/(b) target set).

*The deterministic instrument (hardened + widened `check-hygiene.mjs`) is this phase's Wave 0 test infrastructure. The oracle-reviewer clean-room sweep and first-party agent reviews are gate-time verifications, not persistent test files.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions | Result |
|----------|-------------|------------|-------------------|--------|
| First-party `plugin-validator` + `skill-reviewer` PASS on both skills | DST-02 | Agent judgment, not a deterministic script | Spawn `plugin-dev` agents on the final tree; PASS = no structural/manifest/security/path-traversal errors | PASS (10-04) |
| No verbatim Fowler/Kerievsky/GoF prose on the proven-collision surfaces | DST-04 | Book prose lives in git-ignored `.oracle/`; only the read-only `oracle-reviewer` subagent may read it (clean-room) | Batched-by-chapter `oracle-reviewer` sweep over `## Intent` (gof + extra) and `## Mechanics` (fowler + kerievsky); every verdict must be `pass` | PASS -- 117 surfaces all `pass`, 24 reworded blind (10-03) |

---

## Validation Audit 2026-07-09

| Metric | Count |
|--------|-------|
| Requirements audited | 4 (DST-01..04) |
| Covered (automated) | 4 |
| Gaps found | 0 |
| Tests generated | 0 (docs phase; the checker battery is the test suite and already exists + passes) |
| Escalated | 0 |

No MISSING gaps: every requirement maps to existing automated verification (checker battery / `tsc` / first-party CLI / plan verify-block content assertions), all green and independently re-run by `gsd-verifier` (10-VERIFICATION.md, verdict `passed`). The two manual-only verifications were completed at the phase gate. Per the workflow's no-gaps path, the `gsd-nyquist-auditor` was not spawned -- there were no tests to generate.

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 90s (deterministic layer)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** validated 2026-07-09
