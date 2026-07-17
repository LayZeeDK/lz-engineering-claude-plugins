---
phase: 3
slug: lz-tpp-skill-authoring
status: verified
threats_open: 0
asvs_level: 1
created: 2026-07-02
---

# Phase 3 - Security

> Per-phase security contract: threat register, accepted risks, and audit trail.
> Skill-authoring phase; threats are documentation-integrity, public-repo-hygiene,
> skill-correctness (TS misinformation), and coach-overreach oriented -- not web/runtime.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| authored SKILL.md / reference files -> public git repo | Committed skill content becomes a public artifact; fidelity/hygiene errors ship publicly | Markdown + fenced TypeScript |
| coach output -> user's codebase | The coach recommends changes a human may apply; overreach (auto-edit/auto-run) would cross into driving the user's code | Recommendations (not edits) |
| description metadata -> session trigger surface | The description is the sole always-loaded trigger; over-broad wording mis-fires and erodes trust | Trigger description |
| TCO guidance / fenced TS -> reader's engineering decisions + copy-paste | Wrong stack-safety advice or non-compiling TS would lead readers to ship overflowing/broken code | TS patterns + engine claims |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-03-01-01 | Information Disclosure | SKILL.md committed content | mitigate | Work-email allowlist gate (never spells the literal). Verified: email scan empty; consensus.dk empty | closed |
| T-03-01-02 | EoP / Tampering | Coach body instructions | mitigate | Coach-don't-drive; "unless explicitly asked" qualifier. Verified: SKILL.md "Never edit ... or run the tests unless explicitly asked -- coach, don't drive" | closed |
| T-03-01-03 | Spoofing (mis-trigger) | Frontmatter description | mitigate | Scoped third-person description + should-NOT-trigger clause; 750 chars (<=1024); no claude/anthropic; no XML tags. Verified | closed |
| T-03-01-04 | Tampering (fidelity drift) | Reference-mode routing | mitigate | Reference mode explains FROM the locked transformations.md; body does not restate the 14-item list (only a 7-token subset as inline examples). Verified | closed |
| T-03-01-05 | Tampering (hygiene) | Non-ASCII bytes | mitigate | ASCII-only gate; arrows `->`. Verified: zero non-ASCII in SKILL.md | closed |
| T-03-01-SC | Tampering (supply chain) | npm/pip/cargo installs | accept | No package installs (Markdown-only); no package.json/lockfile in repo. Documented accepted risk | closed |
| T-03-02-01 | Tampering (fidelity drift) | Fibonacci walk order | mitigate | Canonical FibTPP walk, each step tagged with transformation + list position; tail-recursion preferred over plain recursion; iterative unwind. Verified: all 8 step tokens present | closed |
| T-03-02-02 | Information Disclosure | Committed reference content | mitigate | Work-email allowlist gate. Verified: no email in file | closed |
| T-03-02-03 | Tampering (hygiene) | Non-ASCII / arrow glyphs | mitigate | ASCII-only gate; arrows `->`. Verified: zero non-ASCII | closed |
| T-03-02-04 | Tampering (locked-source integrity) | transformations.md | mitigate | git --exit-code guard; excluded from files_modified. Verified: last changed in Phase 2 (`3bab6bc`); diff clean | closed |
| T-03-02-05 | EoP | Worked-example prose | accept | Static walk; no auto-edit/run directives (coach-drive guard lives in SKILL.md). Documented accepted risk | closed |
| T-03-02-SC | Tampering (supply chain) | npm/pip/cargo installs | accept | No package installs. Documented accepted risk | closed |
| T-03-03-01 | Tampering (misinformation) | CPS pattern | mitigate | CPS stated stack-safe ONLY with a trampoline; naked CPS labelled "not a fix". Verified: every CPS mention co-located with trampoline; naked-CPS warning present | closed |
| T-03-03-02 | Tampering (misinformation) | Engine/compat-table claim | mitigate | kangax "Node 2/2" flagged false positive; Chrome 0/2 + empirical V8 overflow cited. Verified: no "Node supports proper tail calls" assertion | closed |
| T-03-03-03 | Tampering (fidelity + type safety) | Lifted TypeScript | mitigate | Bounce<T>, custom isNested guard, explicit generator return typing, no DOM-Node name; confirmatory tsc --strict --noEmit clean. Verified | closed |
| T-03-03-04 | Information Disclosure | Committed reference content | mitigate | Work-email allowlist gate. Verified: email scan empty | closed |
| T-03-03-05 | Tampering (hygiene) | Non-ASCII / arrow glyphs | mitigate | ASCII-only gate; arrows `->`. Verified: zero non-ASCII | closed |
| T-03-03-06 | Tampering (locked-source integrity) | transformations.md | mitigate | git --exit-code guard; excluded from files_modified. Verified: byte-unchanged since Phase 2 | closed |
| T-03-03-SC | Tampering (supply chain) | npm/pip/cargo installs | accept | No package installs; confirmatory tsc uses the already-installed global toolchain. Documented accepted risk | closed |

*Status: open / closed*
*Disposition: mitigate (implementation required) / accept (documented risk) / transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-03-01 | T-03-01-SC / T-03-02-SC / T-03-03-SC | No package installs occur this phase; deliverables are Markdown + fenced TS; no package.json/lockfile exists in the repo. Package Legitimacy Audit: not applicable. | Lars Gyrup Brink Nielsen | 2026-07-02 |
| AR-03-02 | T-03-02-05 | The Fibonacci worked-example file is a static walk that recommends but issues no auto-edit/auto-run instructions; the coach-don't-drive guard is enforced in SKILL.md (T-03-01-02). | Lars Gyrup Brink Nielsen | 2026-07-02 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-02 | 19 | 19 | 0 | gsd-security-auditor (verify mode; register authored at plan time) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-02
