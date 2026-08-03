---
phase: 17-assertion-design-stance-router-ts-vitest-mechanics
audited: 2026-07-19
auditor: gsd-security-auditor
asvs_level: 1
block_on: high
threats_total: 4
threats_closed: 4
threats_open: 0
unregistered_flags: 0
status: secured
---

# Phase 17 Security Audit: Assertion Design, Stance Router & TS/Vitest Mechanics

**Verdict:** SECURED -- 4/4 declared mitigations verified present in the current tree. `threats_open: 0`. No open high-severity threat; the phase does not block on the `high` threshold.

This is a Markdown-only, dev-tooling-only skill-authoring phase (`plugins/lz-tdd` content is prose; the deterministic tooling lives in the dev-only `.claude/skills/*-workspace/`). The threat register is hygiene / supply-chain-shaped, not runtime. Every mitigation was re-verified by re-running its deterministic check live -- not accepted from documentation.

## Threat Verification

| Threat ID | Category | Severity | Disposition | Status | Evidence |
|-----------|----------|----------|-------------|--------|----------|
| T-17-01 | Information Disclosure (copyright, DST-04) | high | mitigate | CLOSED | `check-hygiene.mjs` no-verbatim axis exit 0 (191 files, no quoted run >= 120 chars); corroborated by orchestrator oracle-reviewer all-PASS on the 3 owned surfaces + skill-reviewer PASS (>= 1 unbiased) recorded in `17-VERIFICATION.md` lines 130-131 |
| T-17-02 | Information Disclosure (PII / maintainer work-email) | high | mitigate | CLOSED | `check-hygiene.mjs` allowlist-inversion axis exit 0 -- no non-allowlisted email across the 198-file shippable surface (incl. the lz-red tree); `git config user.email` = `larsbrinknielsen@gmail.com` (public gmail) |
| T-17-03 | Tampering (mojibake) | medium | mitigate | CLOSED | `check-hygiene.mjs` ASCII byte scan exit 0 -- 198 files, no byte > 0x7f |
| T-17-04 | Tampering (supply chain / new dep) | medium | mitigate | CLOSED | `claude plugin validate .` -> "Validation passed" exit 0; `plugins/lz-tdd` has no `package.json` / `package-lock.json` / `node_modules` (Markdown-only; deps stay in the dev-only workspace); `plugin.json` declares no dependency field |

## Verification Detail

### T-17-01 -- copyright / verbatim-prose disclosure (owned surfaces)
- **Syntactic backstop (re-run):** `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` -> `no verbatim-looking quoted runs (DST-04) -- 191 files clean`, exit 0. The gate fails on any single double-quoted run >= 120 chars across the lz-refactor + lz-red trees + root prose.
- **Semantic backstop (recorded, not re-runnable here):** the oracle-reviewer converge-to-clean on the three owned surfaces (F.I.R.S.T. in `test-structure-and-assertions.md`, the Metz message matrix in `testing-stance/message-matrix.md`, the Cooper anti-pattern in `anti-patterns.md`) returned all-PASS, and skill-reviewer PASSED with >= 1 unbiased from-scratch reviewer. Recorded in `17-VERIFICATION.md` ("Human Verification Required" -> None; oracle-reviewer PASS on all owned surfaces + skill-reviewer PASS). Per the audit contract, agents cannot be re-spawned here; the recorded PASSes plus the GREEN scan are the mitigation evidence.

### T-17-02 -- maintainer work-email / PII
- Allowlist-inversion (assert the ONLY email-shaped token is the approved gmail, flag the remainder) re-run GREEN: `no non-allowlisted emails` across 198 files. The checker hardcodes only the approved value (`larsbrinknielsen@gmail.com`) and never encodes the forbidden value -- matching the AGENTS.md allowlist-inversion rule.
- Commit identity: `git config user.email` = `larsbrinknielsen@gmail.com`.
- Known false-positive shapes (`lz-tdd@0.0.x` version-scoped filenames, `Pass@N`) do not match the email regex (no dotted alpha TLD after `@`) and were not flagged -- correct.

### T-17-03 -- mojibake / non-ASCII tampering
- `ASCII-only -- 198 files clean`, exit 0. Byte-level scan (`buf[i] > 0x7f`) over the full shippable surface.

### T-17-04 -- supply chain / new dependency
- `claude plugin validate .` -> "Validation passed", exit 0 (marketplace + descended plugin manifests; path-traversal / duplicate-name checks).
- `find plugins/lz-tdd` for `package.json` / `package-lock.json` / `node_modules` -> none. The shipped plugin is prose only; the deterministic dev tooling and its deps live in `.claude/skills/lz-red-workspace/` (dev-only, not part of the installed plugin surface). No dependency was added to the shipped tree.

## Unregistered Flags

None. No phase-17 SUMMARY declares a `## Threat Flags` section, and every plan SUMMARY records `tech-stack.added: []` -- no new attack surface or dependency appeared during implementation.

## Audit Notes

- **Config:** `block_on: high` (per task directive; no explicit `security_block_on` in `.planning/config.json`). `asvs_level` unset -> treated as L1 (verify mitigation PRESENT), exceeded here by re-running each deterministic gate live.
- **Read-only:** no implementation file was modified. Only this `17-SECURITY.md` was written.
- **Severity-filtered gate:** the two high-severity threats (T-17-01, T-17-02) are both CLOSED, so `threats_open: 0` and the phase does not block on the `high` threshold.

---
*Audited: 2026-07-19*
*Auditor: gsd-security-auditor*
