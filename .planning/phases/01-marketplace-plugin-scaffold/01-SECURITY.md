---
phase: 1
slug: marketplace-plugin-scaffold
status: verified
threats_open: 0
asvs_level: 1
created: 2026-07-02
---

# Phase 1 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.
> Register authored at plan time (PLAN.md `<threat_model>`). All threats verified CLOSED
> via the code review (byte-level ASCII scan, email allowlist) and phase verification
> (email scan, structure resolution, `claude plugin validate`). ASVS V2-V6 do not apply:
> this phase creates only static JSON + Markdown scaffold files -- no code execution, auth,
> sessions, cryptography, input parsing, network I/O, or external packages.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| repo -> public GitHub | Static JSON + Markdown scaffold published to a public repository | Human-authored manifest content becoming publicly readable (no runtime input, no code execution, no network calls) |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-01-01 | Information Disclosure | `author.email` / `owner.email` in manifests | mitigate | Only the public gmail `larsbrinknielsen@gmail.com` is used; the work email (from global CLAUDE.md) appears nowhere. Verified via email allowlist over committed manifests (the only email present is the public gmail). | closed |
| T-01-02 | Tampering | non-ASCII / smart punctuation in committed files | mitigate | ASCII-only in every committed file (`->` not arrows, `--` not em/en dashes, straight quotes). Verified via byte-level non-ASCII scan (zero non-ASCII code points across all four files). | closed |
| T-01-03 | Tampering | `source` path traversal in manifests | mitigate | `source` is a `./`-relative string (`./plugins/lz-tdd`), forward slashes, no `../` or absolute. `claude plugin validate .` resolves it and rejects traversal (exit 0). | closed |
| T-01-04 | Repudiation | ambiguous reuse rights | mitigate | `license: "MIT"` field set in `plugin.json` this phase (the LICENSE file is Phase 4, DIST-02). Verified: `rg -n '"license": "MIT"'` matches. | closed |
| T-01-SC | Tampering | npm / pip / cargo installs (supply chain) | accept | Not applicable -- this phase installs NO external packages (pure JSON + Markdown, no `package.json`, no build). No supply-chain surface exists; no legitimacy checkpoint required. | closed |

*Status: open / closed*
*Disposition: mitigate (implementation required) / accept (documented risk) / transfer (third-party)*

No STRIDE threat at or above the ASVS L1 / HIGH block threshold applies to this static
manifest scaffold. All dispositions are LOW severity.

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-01 | T-01-SC | No external packages are installed in this phase (pure JSON + Markdown, no `package.json`, no build step); the supply-chain threat is not applicable. | Lars Gyrup Brink Nielsen | 2026-07-02 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-02 | 5 | 5 | 0 | gsd-secure-phase (short-circuit: plan-time register, all mitigations verified in code-review + verification) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-02
