---
phase: 18
slug: coach-procedure-lz-tpp-seam-wiring
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: 2026-07-20
---

# Phase 18 - Security

> Per-phase security contract: threat register, accepted risks, and audit trail.
> Verified by gsd-security-auditor (register_authored_at_plan_time: true; mitigations verified, no new
> scan). Markdown-only skill-authoring phase: no runtime code, no network/auth/input/data surface;
> shipped artifacts execute no code and example fences are compiled by a dev-only extractor, never run.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| `.oracle/` book prose -> distilled Markdown | Owned copyrighted source read only by the isolated oracle/oracle-reviewer agents; only own-words facts cross back | Copyrighted expression (IP) |
| authored content -> shipped LIVE skill tree | Authored Markdown enters the shipped `plugins/lz-tdd` tree that ships to users after the Phase-19 reload | Maintainer identity (work-email), encoding (ASCII), IP |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-18-01 | Info disclosure (IP) | owned Three-Laws surface + all authored prose | medium | mitigate | Clean-room DST-04 own-words + oracle-reviewer gate 1 (PASS, conf 93) + check-hygiene no-verbatim scan GREEN (191 files) | closed |
| T-18-02 | Info disclosure (work-email) | all authored Markdown | medium | mitigate | check-hygiene allowlist-inversion work-email scan GREEN (198 files); no forbidden value encoded as a needle | closed |
| T-18-03 | Tampering (integrity/ASCII) | all authored Markdown | low | mitigate | check-hygiene ASCII scan GREEN (198 files) | closed |
| T-18-04 | Info disclosure (IP, lz-tpp scan-excluded) | plugins/lz-tdd/skills/lz-tpp/SKILL.md | medium | mitigate | lz-tpp EXCLUDED from the no-verbatim scan by design; sole backstop = gate 2 unbiased review (PASS); shipped section independently inspected (own-words, pointer-only, +10 lines) | closed |
| T-18-05 | Tampering (injection via .oracle/) | owned-surface authoring path | medium | mitigate | Main context never reads .oracle/ prose; blind authoring + oracle-reviewer gate 1 (PASS); any leaked injected prose trips the no-verbatim + D-05 honesty scans (GREEN) | closed |
| T-18-06 | Tampering (VIT-02 fence integrity) | lz-red SKILL.md worked example | low | mitigate | `NON_IGNORE_TS_FENCE_RE` + `requireNonIgnoreFence` on the SKILL.md checker entry; typecheck exit 0 (8 modules incl. SKILL-1.ts, 0 skipped) | closed |
| T-18-GATE | Tampering (instrument integrity) | check-red-references.mjs | low | mitigate | Positive content-topic asserts (defeat false-GREEN) + D-14 `absent` guards + D-05 honesty gate intact (self-test 3/3) + SEAM-02 block; all GREEN | closed |
| T-18-SC | Tampering (supply chain) | shipped plugins/lz-tdd tree | low | accept | No dependency added this phase (tech-stack added: []); `claude plugin validate .` exit 0 confirms structural integrity | closed |

*Status: open / closed / open - below high threshold (non-blocking)*
*Severity: critical > high > medium > low - only open threats at or above workflow.security_block_on (high) count toward threats_open*
*Disposition: mitigate (implementation required) / accept (documented risk) / transfer (third-party)*

No high-severity runtime threats exist: the shipped artifacts are Markdown that execute no code.

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| R-18-SC | T-18-SC | No new dependency enters the shipped `plugins/lz-tdd` tree this phase; the only edits are Markdown + a dev-only workspace checker. Supply-chain surface is unchanged and `claude plugin validate .` confirms structural integrity. Residual risk is negligible and accepted. | maintainer | 2026-07-20 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-20 | 8 | 8 | 0 | gsd-security-auditor (opus), orchestrator-driven |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-20
