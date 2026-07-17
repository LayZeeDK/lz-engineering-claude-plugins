---
phase: 10
slug: distribution-hygiene
status: verified
threats_open: 0
asvs_level: 1
created: 2026-07-09
---

# Phase 10 -- Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

ASVS level is nominal (`1`); this is a docs / distribution phase with no runtime,
auth, network, crypto, or user-input surface. The real threats are content hygiene
(PII email, non-ASCII, verbatim third-party prose) and manifest integrity
(path-traversal, factual drift). Register authored at plan time across the four
Phase-10 plans; the gsd-security-auditor verified each mitigation on the final tree
(verify-only, no new-threat scan).

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| authored content -> committed public repo | new Phase-10 prose (README/CHANGELOG/manifests) + both skill trees must be ASCII-only and work-email-free before commit | maintainer PII (email), text |
| shipped lz-refactor prose -> published tree | no verbatim Fowler/Kerievsky/GoF/Beck/Feathers prose or code | third-party IP (book prose/code) |
| `.oracle/` source text -> main context / committed tree | forbidden; only the read-only oracle-reviewer subagent reads `.oracle/` | third-party IP |
| manifest source -> `/plugin marketplace add` install | relative `./` source only; no `../` or absolute path traversal | install path |
| README/CHANGELOG/manifest claims -> live tree | version, install strings, invocations, contact, license, catalog counts must not drift | factual metadata |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-10-EM | Information Disclosure | work/PII email in a public file | mitigate | check-hygiene axis (b) allowlist-inversion over the widened shippable set (both skill trees + root README/CHANGELOG/LICENSE + both manifests) + full-tree allowlist-inversion guard; only the approved public gmail is email-shaped | closed |
| T-10-ASCII | Integrity | non-ASCII (cp1252 mojibake) in committed output | mitigate | check-hygiene axis (a) ASCII byte-scan over the widened target set; 187 files clean | closed |
| T-10-IP | Information Disclosure / IP | verbatim book prose/code in the lz-refactor tree + new prose | mitigate | check-hygiene axis (c) hardened to a HARD gate over verbatimTargets + the 10-03 clean-room sweep (117 surfaces all pass, 24 reworded blind) + 10-DST-04-ATTESTATION.md; 180 files clean | closed |
| T-10-SC | Tampering | npm/pip/cargo package installs | accept | No package installs this phase; `package.json` byte-unchanged, `typescript` pinned at `6.0.3` (unchanged). See Accepted Risks Log | closed |
| T-10-ORACLE | Information Disclosure | `.oracle/` source leaking into main context or a committed artifact | mitigate | `.oracle/` gitignored and untracked; the sweep ran only through the read-only oracle-reviewer; the attestation records category-only reasons, no source spans | closed |
| T-10-DRIFT | Tampering / Integrity | wrong version / install string / invocation / catalog count in README/CHANGELOG/manifests | mitigate | Install strings + URL/license lifted verbatim from live files; inventory (62/27/23/5/19/28) recounted against disk; `claude plugin validate .` exit 0 | closed |
| T-10-STRUCT | Tampering | manifest path-traversal / malformed structure breaking install | mitigate | `claude plugin validate . --strict` exit 0; source is relative `./plugins/lz-tdd` (no `../`/absolute); plugin-dev plugin-validator agent PASS | closed |
| T-10-SKILLEDIT | Tampering | a forced SKILL.md reword bypassing the D-14 review | mitigate | No `SKILL.md` edited in the Phase-10 commit range; the D-14 subagent-review path was never triggered | closed |

*Status: open / closed*
*Disposition: mitigate (implementation required) / accept (documented risk) / transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-10-SC | T-10-SC | No package installs this phase; the sole devDependency (`typescript@6.0.3`) is unchanged from Phase 7. No new supply-chain surface to mitigate. | maintainer | 2026-07-09 |
| AR-10-DOMAIN | T-10-EM (out-of-scope variant) | The maintainer's employer BARE domain (no local-part, not email-shaped, not a routable address) is quoted as an audit needle in four `main`-side prior-phase `.planning/` docs (02-SECURITY, 03-REVIEW, 03-SECURITY, 05-SECURITY). It is out of DST-02's shippable-surface scope (the 187-file shippable surface is clean), carries no identity leak, and remediation would require rewriting published `main` history. Branch-only leaks (08, 08.2) were already scrubbed. Bare-domain detection is out of scope by design (see AGENTS.md). Recorded in `deferred-items.md`. | maintainer | 2026-07-09 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-09 | 8 | 8 | 0 | gsd-security-auditor (verify-only; register authored at plan time) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-09
