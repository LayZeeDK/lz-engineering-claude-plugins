---
phase: 7
slug: fowler-catalog-refactoring-2nd-ed
status: verified
threats_open: 0
asvs_level: n/a
created: 2026-07-05
---

# Phase 7 - Security

> Per-phase security contract: threat register, accepted risks, and audit trail.
> Register authored at plan time (PLAN.md `<threat_model>`, register_authored_at_plan_time);
> verified retroactively. This phase ships ZERO runtime code -- pure Markdown skill leaves
> (62 refactoring leaves + 24 bad-smell leaves + indices). No network, secrets, auth, or
> input-parsing surface, so ASVS V2-V6 are not applicable. The load-bearing trust boundaries
> are (a) author -> public git repository (IP / copyright hygiene under the DST-04 clean-room
> firewall) and (b) the deterministic checker battery in the NON-shipped workspace.
>
> Verification did NOT re-audit content fidelity against the owner's git-ignored book at
> `.oracle/refactoring-2e/` -- doing so would BE the DST-04 disclosure the firewall prevents.
> This audit confirms the MITIGATION MECHANISMS exist and run green.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| author -> public git repo | Locally authored skill content crosses into a public, cloneable repository | Skill Markdown leaves + navigation indices (no secrets, no user data) |
| owner book (`.oracle/`) -> authored leaves | Copyrighted 2nd-ed source read ONLY by isolated oracle-reviewer subagents; never by main/executor context | Fidelity verdicts (pass/revise/blocked) + revise directives -- never source prose |
| workspace checkers -> phase gate | NON-shipped Node checker battery gates merge on exit code | Deterministic PASS/FAIL over the shipped tree (Node builtins only) |

---

## Threat Register

| Threat ID | Category | Disposition | Status | Evidence |
|-----------|----------|-------------|--------|----------|
| T-07-01 | Information Disclosure / legal (DST-04) | mitigate | closed | Clean-room firewall held: every wave SUMMARY records leaves authored + revised BLIND; only isolated oracle-reviewer subagents read `.oracle/`. The near-verbatim (`too_close_to_source`) gate is LIVE and load-bearing -- it fired twice on accidental collisions (07-07 Introduce Assertion, 07-09 Push Down Method) and both were re-domained/reworded to pass. `check-hygiene.mjs` no-verbatim heuristic GREEN (0 WARN over 92 files). No shipped file references the git-ignored `.oracle/` path (`git grep -i "\.oracle" -- plugins/lz-tdd/` = no match). Deferred Phase-10 hygiene scan is the final backstop. |
| T-07-02 | Information Disclosure (work email) | mitigate | closed | `check-hygiene.mjs` work-email allowlist gate (only `larsbrinknielsen@gmail.com` allowed; HARD non-zero exit on any other email token). Run result: `[PASS] no non-allowlisted emails` over 92 files; `SUMMARY: hygiene GREEN`. |
| T-07-03 | Tampering (fabricated / unfaithful content) | mitigate | closed | oracle-reviewer fidelity gate (pass\|revise\|blocked) + converge loop + owner escalation; no leaf shipped until pass or owner-accepted. Every wave SUMMARY records full convergence: Ch.6 11/11; 07-04 8/8 (1 R1 blocked cleared R2); 07-05 9/9; 07-06 5/5; 07-07 6/6; 07-08 11/11; 07-09 11/11; 07-10 smells 24/24 over 2 rounds, 0 owner escalations. Deterministic corroboration: check-catalog 62/62 GREEN, check-smells 24/24 GREEN. |
| T-07-04 | Tampering (silently-passing checker) | mitigate | closed | Source-read confirms REAL assertions, not always-pass: `check-catalog.mjs` asserts NAME IDENTITY (each of 62 canonical names present exactly once, byName map, unknown-heading flagged) + per-leaf contract regexes (`Use when:`, `## Motivation`, `## Mechanics`, `## Example`, ts/js fence) + provenance markers + scaffold-phrase absence + README `Use-when` mirror; `check-smells.mjs` asserts 24 name identity + `Recognize by:` + `## Candidate refactorings` + candidate-link resolution + navigation index. Both accumulate `failures` and `process.exit(1)` on any failure (verified in source; RED-by-design baseline documented in header). Run result: both GREEN (62/62, 24/24). |
| T-07-05 | Tampering / firewall (fan-out aggregation) | mitigate | closed | The only persisted aggregate of the oracle fan-out is the 62 name->slug map in 07-02-SUMMARY, which is a FLAT ALPHABETICAL list explicitly labeled "membership/slug are public facts from `refactoring-com-overview.md` -- no book compilation reproduced" (line 112) and is a name->slug map, NOT an ordered name+chapter compilation. `tech-stack.added: []`. No `.planning/` or shipped artifact persists a full ordered book chapter map reconstructing the curated selection. |
| T-07-06 | Tampering (dangling cross-links) | mitigate | closed | `check-crossrefs.mjs` asserts every intra-repo `.md` link resolves (file exists + `#anchor` resolves to a GitHub-slug heading), no self-referential links, and inverse-of pairs mutually declared; `check-smells.mjs` asserts every candidate-refactoring link resolves to a real catalog leaf. Run result: `[PASS] all cross-links resolve -- 291 link(s), 0 unresolved`, `[PASS] no self-referential links`, `[PASS] inverse-of pairs mutually declared -- 20 inverse link(s), 0 one-sided`. |
| T-07-SC | Tampering (supply chain) | mitigate | closed | `.claude/skills/lz-refactor-workspace/package.json` pins `typescript@6.0.3` exactly (no caret/range), `private: true`, and it is the SOLE dependency. The workspace is NON-shipped. No `package.json` exists anywhere under `plugins/lz-tdd/` (glob = no files) -- the shipped skill surface remains dependency-free Markdown. |

*Status: open - closed*
*Disposition: mitigate (implementation required) - accept (documented risk) - transfer (third-party)*

---

## Unregistered Flags

None. No `## Threat Flags` section appears in any Phase-7 SUMMARY (07-01..07-10); the executors
declared no new attack surface during implementation, and no new attack surface was observed that
lacks a threat mapping.

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| (none) | - | All Phase-7 threats carry disposition `mitigate` and verified CLOSED; no risk was accepted or transferred this phase. | - | - |

*Accepted risks do not resurface in future audit runs.*

---

## Checker Evidence (mitigation mechanisms, re-run at audit)

| Checker | Threats | Result |
|---------|---------|--------|
| `check-hygiene.mjs` | T-07-01, T-07-02 | GREEN -- ASCII + email clean over 92 files; 0 no-verbatim WARN |
| `check-catalog.mjs` | T-07-04 | GREEN -- 62/62 refactorings present with contract fields + provenance |
| `check-smells.mjs` | T-07-04, T-07-06 | GREEN -- 24/24 smell leaves with contract + navigation index |
| `check-crossrefs.mjs` | T-07-06 | GREEN -- 291 links resolve, 20 inverse pairs mutual, no self-refs |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-05 | 7 | 7 | 0 | gsd-security-auditor (checker battery re-run + PLAN threat_model / SUMMARY convergence cross-reference; DST-04 firewall observed -- `.oracle/` not read) |

---

## Sign-Off

- [x] All threats have a disposition (all `mitigate`)
- [x] Each mitigation mechanism located and verified (not accepted on documentation alone)
- [x] Checker battery re-run at audit time -- all GREEN
- [x] DST-04 firewall respected during audit (`.oracle/` never read)
- [x] No unregistered threat flags
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-05
