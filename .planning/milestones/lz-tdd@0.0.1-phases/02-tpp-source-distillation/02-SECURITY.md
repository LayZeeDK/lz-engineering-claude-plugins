---
phase: 2
slug: tpp-source-distillation
status: verified
threats_open: 0
asvs_level: 1
created: 2026-07-02
---

# Phase 2 - Security

> Per-phase security contract: threat register, accepted risks, and audit trail.
> This is a documentation-distillation phase; threats are documentation-integrity
> and public-repo-hygiene oriented, not web/runtime threats.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| External video/ASR source -> committed repo file | Untrusted third-party caption/ASR text crosses into a public, git-tracked artifact | NDC 2011 caption/ASR text |
| Local tool output -> Windows cp1252 toolchain | Non-ASCII bytes from ASR/copy-paste can corrupt diffs/rendering | Markdown byte stream |
| Secondary sources / memory -> canonical shipped reference | Drifted third-party renderings could contaminate the source-of-truth list | Transformation list + definitions |
| Primary posts -> quoted content | Verbatim quotes must be attributed to the correct post to preserve provenance | Quoted list entries + hedges |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-02-01-01 | Information Disclosure | Retained transcript in public `.planning/` | mitigate | Work-email allowlist scan (public gmail only; check never spells the work-email literal). Verified by allowlist-inversion: transcript email-free; only the approved public gmail present (remainder empty) | closed |
| T-02-01-02 | Tampering (encoding) | Non-ASCII ASR bytes in committed `.md` | mitigate | `rg -n '[^\x00-\x7F]'` gate returns zero. Verified: zero matches on `ndc-2011-tpp-transcript.md` | closed |
| T-02-01-03 | Tampering (source truth) | ASR transcript treated as canonical over blogs | accept | Transcript is tertiary reconciliation input; precedence blogs > talk > secondary enforced in `transformations.md`. Realized precedence statement verified | closed |
| T-02-01-SC | Tampering (supply chain) | npm/pip/cargo installs | accept | No package installs this phase; only pre-existing local tooling invoked (`02-01-SUMMARY.md` tech-stack.added: []) | closed |
| T-02-02-01 | Tampering (source truth) | Canonical 14-item list | mitigate | Transcribed from RESEARCH Verified Content Anchors + per-entry cross-check; Wikipedia/memory forbidden as canonical. Verified: 14-item + 12-item lists match anchors token-by-token and in order | closed |
| T-02-02-02 | Repudiation (provenance) | Quote/list citations | mitigate | Inline per-post citations; split hedge attribution ("language specific" -> FibTPP; five others -> TPP); Sources section maps labels to URLs. Verified: both post URLs present, attribution correct | closed |
| T-02-02-03 | Information Disclosure | Work-email in a public committed file | mitigate | Work-email allowlist scan over shipped file + phase dir (never spells the literal). Verified by allowlist-inversion: no email-shaped token remains after subtracting the approved public gmail (remainder empty) | closed |
| T-02-02-04 | Tampering (encoding) | Non-ASCII glyph -> mojibake | mitigate | Arrow/quote/dash normalization to ASCII + `rg -n '[^\x00-\x7F]'` zero-match gate. Verified: zero matches on `transformations.md` | closed |
| T-02-02-05 | Information Disclosure (IP) | Over-quoting Clean Coder essays | mitigate | Quote only list + key definitions/hedges/process; narrative summarized; URLs cited. Verified: no fenced code blocks; quotes bounded; Sources cite URLs | closed |
| T-02-02-SC | Tampering (supply chain) | npm/pip/cargo installs | accept | No package installs this phase (`02-02-SUMMARY.md` tech-stack.added: []) | closed |

*Status: open / closed*
*Disposition: mitigate (implementation required) / accept (documented risk) / transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-02-01 | T-02-01-03 | ASR transcript is retained as tertiary reconciliation input only; the blogs remain canonical and precedence (blogs > talk > secondary) is stated in `transformations.md`. Low risk. | Lars Gyrup Brink Nielsen | 2026-07-02 |
| AR-02-02 | T-02-01-SC / T-02-02-SC | No package installs occur in this phase; only pre-existing local tooling (`youtube-to-markdown`, markitdown fallback) is invoked. Package Legitimacy Audit: not applicable. | Lars Gyrup Brink Nielsen | 2026-07-02 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-02 | 10 | 10 | 0 | gsd-security-auditor (verify mode; register authored at plan time) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-02
