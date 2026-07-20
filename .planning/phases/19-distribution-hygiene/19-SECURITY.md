---
phase: 19
slug: distribution-hygiene
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: 2026-07-21
---

# Phase 19 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| new authored prose -> committed public README/CHANGELOG/manifests | must be ASCII-only, work-email-free (only the approved public gmail), original (not inlined book/talk text) | maintainer identity / PII; public docs |
| README/CHANGELOG/manifest claims -> live tree + LICENSE | install strings, invocations, contact, license, version, lz-red inventory counts must not drift from reality | correctness-sensitive metadata |
| archived planning meta-doc -> published public repo | must carry no encoded work-domain needle; only the approved public gmail may appear as an email-shaped token | maintainer identity / PII |
| plugin manifest source -> /plugin marketplace add install | relative `./plugins/lz-tdd` source only; no `../` or absolute path traversal | install-path integrity |
| .oracle/ book prose -> main context / committed tree | FORBIDDEN; only the orchestrator's oracle-reviewer reads .oracle/ and returns own-words verdicts | copyrighted IP |

No runtime / network / session / crypto / input surface. Shipped artifacts are Markdown/JSON that execute
no code; TypeScript example fences are compiled, never run. The threat class is content hygiene (PII,
verbatim IP, mojibake), manifest/factual correctness, and install-path structure.

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-19-EM | Information Disclosure (PII) | work/PII email or bare work-domain in committed files (README/CHANGELOG/manifests + archived planning docs incl. 06-SECURITY.md) | high | mitigate | check-hygiene axis (b) allowlist-inversion over the wide set + full-tree allowlist-inversion; only the approved public gmail present. 19-02 forward-fixed the archived 06-SECURITY needle (commit 8cc452e) | closed |
| T-19-REINTRO | Information Disclosure (PII) | the 19-02 fix itself spelling the forbidden value while removing it | high | mitigate | allowlist-inversion phrasing only; needle held ephemerally on the command line, never committed; 19 docs swept | closed |
| T-19-IP | Information Disclosure / IP | verbatim book prose / talk transcript inlined into the README primer, CHANGELOG, or shipped lz-red tree | high | mitigate | link-don't-inline (D-03/D-11); check-hygiene axis (c) no-verbatim over README+CHANGELOG+lz-red tree; DST-04 oracle-reviewer re-sweep recorded in 19-DST-04-ATTESTATION.md | closed |
| T-19-STRUCT | Tampering | manifest path-traversal / malformed structure breaking install | high | mitigate | `claude plugin validate . --strict` (HARD gate) + plugin-dev plugin-validator agent; relative `./plugins/lz-tdd` source only | closed |
| T-19-DRIFT | Tampering / Integrity | README/manifest/CHANGELOG stating wrong version, install string, invocation, contact, or lz-red inventory count | medium | mitigate | install strings + email/URL/license lifted verbatim from live files; inventory recounted; version 0.0.3 agrees with the CHANGELOG %400.0.3 link-ref; `claude plugin validate` confirms manifest correctness | closed |
| T-19-ASCII | Integrity | non-ASCII (cp1252 mojibake) in new prose / shipped tree | medium | mitigate | check-hygiene axis (a) ASCII byte-scan GREEN over the wide set | closed |
| T-19-SKILLEDIT | Tampering | a skill-instruction edit slipping in unreviewed | medium | mitigate | any SKILL.md fix routes through the D-10 >=1-unbiased subagent review; Phase 19 modified ZERO shipped SKILL/reference bytes (vacuously satisfied); /reload-plugins is a human ship action | closed |
| T-19-SC | Tampering (supply chain) | npm/pip/cargo package installs | low | accept | no package installs this phase; docs + manifest-only diff; shipped `plugins/lz-tdd` stays dependency-free Markdown/JSON | closed |

*Status: open - closed - open below high threshold (non-blocking)*
*Severity: critical > high > medium > low -- only open threats at or above `high` count toward threats_open*
*Disposition: mitigate (implementation required) - accept (documented risk) - transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-19-SC | T-19-SC | No package installs this phase (RESEARCH Package Legitimacy Audit: Not applicable). The shipped `plugins/lz-tdd` tree stays dependency-free Markdown/JSON; no dependency manifest exists anywhere in the plugin tree. Low severity, accepted. | Lars Gyrup Brink Nielsen (maintainer) | 2026-07-21 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-21 | 8 | 8 | 0 | gsd-security-auditor (opus), orchestrator-spawned |

**Verification depth:** ASVS L1 (grep/inspection). The auditor confirmed each mitigation directly
against the tree, not from documentation:

- check-hygiene runs GREEN on the final tree -- all three axes PASS (198 files ASCII, 0 non-allowlisted
  email tokens, 191 files no-verbatim).
- Full-tree email allowlist-inversion: the only genuine email token is the approved public gmail; the 6
  other `@`-bearing tokens are `lz-tdd@0.0.x-*.md` milestone filenames (a digit follows the `@`), not
  emails.
- Phase-19 diff over `plugins/lz-tdd/skills/` is EMPTY -- zero shipped SKILL/reference bytes changed; only
  README, CHANGELOG, and the two manifests moved (T-19-SKILLEDIT vacuously satisfied).
- No dependency manifest exists anywhere in the shipped plugin tree (T-19-SC accepted-risk basis holds).
- marketplace.json source is the relative `./plugins/lz-tdd` (no `../`, no absolute path; T-19-STRUCT).
- 19-GATE-RESULTS.md records plugin-validator PASS + skill-reviewer PASS; `claude plugin validate . --strict`
  exit 0 (19-VERIFICATION.md).

No unregistered threat flags: no SUMMARY (19-01/19-02/19-03) contains a `## Threat Flags` section and no
new attack surface appeared during implementation.

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-21
