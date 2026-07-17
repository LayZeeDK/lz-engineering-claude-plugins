---
phase: 09
slug: coach-behavior-principle-backing
status: verified
threats_open: 0
asvs_level: 1
created: 2026-07-09
---

# Phase 09 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

This phase touches only shipped Markdown content (SKILL.md, references/) and the NON-shipped
node-builtin checker harness (`.mjs` + package.json). There is no runtime, network, session, crypto,
auth, or user-input surface. The security-relevant boundaries are public-repo content hygiene,
harness-verdict integrity, cross-link integrity, and no-oracle IP fidelity — all machine- or
review-verified GREEN this phase.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| checker harness -> phase GREEN/RED verdict | a checker that silently mis-counts would let a defect ship GREEN | build-time verdict only (no runtime data) |
| repo -> published git history | committed `.mjs` + Markdown must stay ASCII-only and work-email-free | public source text |
| coach cross-links -> catalog references | a broken/anchored link would misroute the coach | intra-repo doc links |
| no-oracle content -> shipped skill | with no owned book oracle, tight core scope + skill-reviewer + hygiene are the only correctness anchors | unowned-source-derived prose |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-09-FP | Tampering | IN-02 `collectH1Lines` swap in the 4 catalog checkers (09-01) | mitigate | Behavior-preserving refactor; all 9 pre-existing checkers exit 0 individually (identical counts). A mis-count fails safe (false-FAIL/RED, never silent false-PASS) since no leaf carries a fenced column-0 hash. **Verified:** `npm run check` exit 0. | closed |
| T-09-RED | Tampering | `check-backing.mjs` baseline (09-01) | mitigate | RED baseline asserted (exit 1) before content, so the gate is proven to work before Wave-2 content turns it GREEN — a vacuous false-PASS is impossible. **Verified:** RED at Wave 1, GREEN 3/3 (25/25 checks) post-content. | closed |
| T-09-SC | Tampering | npm/pip/cargo installs (09-01) | mitigate | Zero packages added this phase; only devDependency `typescript@6.0.3` unchanged (audited Phase 7). No install task -> no supply-chain legitimacy checkpoint required. **Verified:** package.json diff adds only a checker script entry. | closed |
| T-09-EM | Information Disclosure | committed harness `.mjs` + SKILL.md + 3 refs + principles.md | mitigate | `check-hygiene` HARD-fails on non-ASCII bytes and non-allowlisted email tokens (work-email leak recurred twice in Phase 4). **Verified:** check-hygiene GREEN over 178 files, 0 non-allowlisted emails. | closed |
| T-09-LINK | Tampering | SKILL.md coach cross-links + principles.md Beck pointers | mitigate | All coach/principle links are file-level to already-existing files; `check-crossrefs` (extended in 09-01 to source SKILL.md + principles.md + the 3 refs) resolves every outbound link. **Verified:** check-crossrefs GREEN, 716 links, 0 unresolved. | closed |
| T-09-IP | Information Disclosure / IP | coach-procedure prose in SKILL.md (09-02) | mitigate | Original routing prose (no book text); check-hygiene no-verbatim heuristic + skill-reviewer PASS. **Verified:** skill-reviewer PASS-with-suggestions; check-hygiene 0 no-verbatim WARN. | closed |
| T-09-DST | Information Disclosure / IP | no-oracle Beck/Feathers famous one-liners in the 3 refs (09-03) | mitigate | DST-04: paraphrase every canonical line, keep only NAMES verbatim; skill-reviewer PASS is the authoritative anchor (D-07). **Verified:** independent DST-04 review + skill-reviewer PASS; one near-verbatim seam definition caught and re-expressed (commit a63d1b4). | closed |
| T-09-SCOPE | Tampering | no-oracle core scope (09-03) | mitigate | D-08 fixes the scope; tight scope is the correctness anchor absent an oracle. **Verified:** gsd-verifier 9/9 confirmed content stayed within the declared core; FUT-01 tidyings catalog explicitly deferred. | closed |
| T-09-GATE | Tampering | phase finalize verdict (09-04) | mitigate | The gate is full battery + typecheck + `claude plugin validate .` + skill-reviewer PASS; a residual RED must be fixed in the owning file, never by weakening a checker. **Verified:** full battery + typecheck GREEN, validate PASS, no checker modified to force GREEN. | closed |

*Status: open / closed*
*Disposition: mitigate (implementation required) / accept (documented risk) / transfer (third-party)*

---

## Accepted Risks Log

No accepted risks. All threats mitigated and verified closed.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-09 | 9 | 9 | 0 | orchestrator (short-circuit: threats_open 0, register authored at plan time, all mitigations verified GREEN this session) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-09
