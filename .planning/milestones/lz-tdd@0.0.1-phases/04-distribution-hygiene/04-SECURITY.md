---
phase: 4
slug: distribution-hygiene
status: verified
threats_open: 0
asvs_level: 1
created: 2026-07-02
---

# Phase 4 -- Security

> Per-phase security contract: threat register, accepted risks, and audit trail.
> Register authored at plan time (PLAN.md `<threat_model>`); all threats verified CLOSED.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| repo -> public GitHub | Every committed file (including `.planning/`) becomes world-readable once pushed | Source, docs, and public identity (name, public gmail, repo URL) |
| manifest source -> install-time resolution | `marketplace.json` `source` path is resolved by clients running `/plugin marketplace add` | Relative path string (no sensitive data) |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-04-01 | Information Disclosure | Work/PII email in a public repo (incl. `.planning/`) | mitigate | The two `.planning/` occurrences and the code-review report were redacted and their commits amended (never spelled); the full-tree work-email allowlist-inversion guard leaves only the approved public gmail (empty remainder) on the working tree and HEAD. Verified live 2026-07-02. | closed |
| T-04-02 | Tampering | `marketplace.json` plugin `source` path (path traversal) | mitigate | `source` is the relative `./plugins/lz-tdd` only -- no `../`, no absolute path. plugin-validator agent + `claude plugin validate . --strict` (exit 0) confirm path-traversal safety. | closed |
| T-04-03 | Information Disclosure | Hardcoded secrets/credentials in README/LICENSE | mitigate | README/LICENSE carry only public identity lifted verbatim from the manifests; no secrets introduced. plugin-validator secret scan reported no credentials/keys/tokens. | closed |
| T-04-04 | Information Disclosure | Non-ASCII / stray content leaking into shippable files | mitigate | Scoped ASCII gate `git grep -qP '[^\x00-\x7F]' -- 'plugins/' '.claude-plugin/' 'README.md' 'LICENSE'` returns rc=1 (clean); validator stdout never pasted into committed files. | closed |
| T-04-SC | Tampering | Supply chain (npm/pip/cargo installs) | accept | Not applicable -- this phase installs no external packages (RESEARCH Package Legitimacy Audit: none). No supply-chain surface introduced. | closed |

*Status: open - closed*
*Disposition: mitigate (implementation required) - accept (documented risk) - transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| R-04-SC | T-04-SC | No external packages installed in this phase; no supply-chain surface exists to mitigate. | Lars Gyrup Brink Nielsen | 2026-07-02 |

---

## Out-of-Scope Note (pre-existing, user-gated -- NOT counted in threats_open)

A pre-existing PUBLIC git-history exposure of the work email exists in four Phase-1 commits
(`5f46fee`, `79b1db0`, `43ee129`, `009060c`), all ancestors of `origin/main`. This phase
gates the working TREE (all Phase-4-scoped info-disclosure threats are CLOSED); scrubbing
published history requires rewriting and force-pushing public history and is a separate,
user-gated decision (RESEARCH Open Q1 / VERIFICATION note). It is deliberately NOT recorded
as an open Phase-4 threat, but is surfaced here so it is not lost.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-02 | 5 | 5 | 0 | gsd-secure-phase (orchestrator, evidence-verified) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-02
