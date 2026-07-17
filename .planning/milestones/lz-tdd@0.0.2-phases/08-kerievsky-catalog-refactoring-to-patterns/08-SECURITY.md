# Phase 8 Security Audit -- Kerievsky Catalog (Refactoring to Patterns)

**Audited:** 2026-07-06
**Phase:** 8 -- Kerievsky Catalog (Refactoring to Patterns)
**Scope:** Retroactive verification of the PLAN.md `<threat_model>` mitigations against the implemented harness + authored content.
**ASVS Level:** 1 (Markdown skill-authoring phase: no runtime, no network, no user input, no auth/session/crypto -- most ASVS controls are N/A by construction).
**block_on:** high (per plan notes; no threat this phase reaches the high bar).

## Verdict

**SECURED.** 8/8 declared threats CLOSED (7 `mitigate` verified present in code + process, 1 `accept` documented below). No BLOCKER. No open threats. No unregistered attack surface.

The deterministic battery is GREEN end to end and each mitigation was verified by reading the harness source (assertions exist, gate on non-zero exit) -- not by trusting the SUMMARY prose:

| Checker | Result | Gates |
|---------|--------|-------|
| check-hygiene.mjs | GREEN (126 files, ASCII + email clean, 0 no-verbatim WARN) | T-08-01, T-08-02, T-08-03 |
| check-kerievsky.mjs | GREEN (27/27 identity + Direction + GoF + composed-primitive + 3 Away + README mirror) | T-08-04, T-08-06, T-08-07 |
| check-smells.mjs | GREEN (24 Fowler + 4 Kerievsky-unique folded, source tags valid, dedup enforced, candidates resolve) | T-08-04, T-08-06 |
| check-crossrefs.mjs | GREEN (449 links resolve, 0 unresolved, 20 inverse pairs mutual, 0 self-refs) | T-08-06 |
| check-catalog.mjs | GREEN (62/62 Fowler regression clean) | T-08-06 (cross-link targets) |
| check-principles.mjs | GREEN (8/8 Ch.2 topics) | regression |
| extract-samples.mjs | GREEN (185 modules `tsc --strict --noEmit` clean, 0 skipped) | T-08-04 (behavior/compile) |

## Trust Boundaries

| Boundary | Description | Status |
|----------|-------------|--------|
| `.oracle/refactoring-to-patterns/` (owner full-text book, git-ignored) -> authored public-repo leaves/smells/indexes | Copyrighted Kerievsky expression must never cross; the only crossing is via the isolated `oracle`/`oracle-reviewer` subagents (own-words verdicts, no prose/code/paths) | Enforced -- firewall (ls-only) + INLINE orchestration, attested in every SUMMARY |
| authored files -> public GitHub repo | Anything committed is world-readable (IP + secrets surface) | Guarded -- check-hygiene ASCII + work-email gate over 126 shipped files |
| npm registry -> workspace devDependency | No new dependency enters this phase; sole dep `typescript` pre-existing + Phase-7-verified | No change -- accepted (T-08-SC) |
| harness (`.claude/skills/lz-refactor-workspace/`) -> shipped skill (`plugins/lz-tdd/skills/lz-refactor/`) | The checker battery must stay out of the shipped surface | Confirmed -- harness is non-shipped; `git status` shows no `plugins/` changes |

## STRIDE Threat Register

| Threat ID | Category | Disposition | Status | Evidence |
|-----------|----------|-------------|--------|----------|
| T-08-01 | Information Disclosure / legal (DST-04) | mitigate | CLOSED | check-hygiene GREEN (126 files ASCII+email clean, 0 no-verbatim WARN); no-verbatim heuristic present at check-hygiene.mjs:125-137; clean-room firewall + oracle-reviewer near-verbatim gate process-attested in 08-02..08-06 SUMMARYs ("No `.oracle/` file opened by the main context (ls for names only)" + per-leaf pass records); GoF is name-only, enforced by check-kerievsky.mjs:275-277 (presence, no prose). Final shipping scan deferred to Phase 10 by design. |
| T-08-02 | Information Disclosure (work email) | mitigate | CLOSED | check-hygiene "no non-allowlisted emails" PASS; allowlist gate at check-hygiene.mjs:22-24,109-123 (`APPROVED_EMAILS` = public gmail only). Harness .mjs/json also work-email-clean (`rg [redacted-domain]` = 0 matches). |
| T-08-03 | Tampering (integrity: non-ASCII / mojibake) | mitigate | CLOSED | check-hygiene "ASCII-only 126 files clean" PASS; hard-fail scan at check-hygiene.mjs:71-81,96-107 (fails on any byte > 0x7f). Harness files ASCII-clean (`rg [^\x00-\x7F]` = 0 matches). |
| T-08-04 | Tampering (fabricated / unfaithful content) | mitigate | CLOSED | oracle-reviewer fidelity gate + converge loop process-attested (per-leaf round counts in 08-02..08-06; 0 blocked; 1 direction escalation resolved by owner via the Refactoring Directions table). Deterministically backed: check-kerievsky field lockstep (Direction check-kerievsky.mjs:268-270, GoF :275-277, composed-primitive :281-283); check-smells dedup/source-tag; extract-samples 185 modules `tsc --strict` clean. Per the .oracle/ firewall, book-prose fidelity is NOT re-openable by this audit (intended model). |
| T-08-05 | Information Disclosure / firewall (main context reads .oracle/) | mitigate | CLOSED | Firewall discipline (ls-only) + INLINE main-context orchestration (D-08) attested in all six SUMMARYs (08-02:54, 08-03:70, 08-04:67, 08-05:72, 08-06:75). Driver dedupes/caps and does not persist a full ordered name+chapter map. |
| T-08-06 | Tampering (dangling / resolvable-but-wrong cross-links) | mitigate | CLOSED | check-crossrefs GREEN (449 links resolve, 0 unresolved, 20 inverse pairs mutual, 0 self-refs); check-smells candidate-link resolution GREEN (check-smells.mjs:189-211); check-kerievsky README-row Use-when mirror GREEN 27/27 (check-kerievsky.mjs:303-315); oracle-reviewer composed-primitive-aptness axis covers the resolvable-but-wrong-sibling case (process). |
| T-08-07 | Tampering (silent-pass checker) | mitigate | CLOSED | check-kerievsky asserts 27-name IDENTITY, each present exactly once (check-kerievsky.mjs:220-231), rejects unknown/typo headings (:320-327), field lockstep (:263-294), gates on non-zero exit + SUMMARY (:331-337). Run reports 27/27 GREEN. Sibling checkers all end with SUMMARY + `process.exit(1)` on failure. |
| T-08-SC | Tampering (supply chain / package installs) | accept | CLOSED | Accepted risk -- documented below. No new package installs this phase; sole dep `typescript` pre-existing + Phase-7-verified; no registry surface change. `git status` shows no manifest/lockfile churn. |

## Accepted Risks Log

- **T-08-SC (supply-chain / package installs) -- ACCEPTED.** This phase authors Markdown + extends a non-shipped Node-builtins-only checker battery. No `npm`/`pip`/`cargo` install occurred; the only devDependency (`typescript`) is pre-existing and was verified in Phase 7. There is no new registry attack surface to gate, so no package-legitimacy checkpoint is required. Rationale recorded in 08-01-PLAN.md `<threat_model>` (RESEARCH Package Legitimacy Audit: N/A). Residual risk: none introduced by Phase 8.

## Unregistered Flags

None. No SUMMARY (08-01..08-06) declares a `## Threat Flags` section, and no new attack surface appeared during implementation that lacks a mapping to a registered threat. The one mid-phase change (the `oracle`/`oracle-reviewer` agent-contract fix for the ~25K-token Read truncation, 08-02:58-62) was firewall/DST-04-reviewed as SAFE and maps to the existing T-08-01/T-08-05 firewall boundary -- not new surface.

## Auditor Notes (audit boundary)

- Per the D-07/D-08 clean-room firewall, this audit did NOT read any file under `.oracle/` (ls for names only). Book-prose fidelity (the substance of T-08-04) is verifiable ONLY through the `oracle-reviewer` gate, which ran during execution and is process-attested with per-leaf pass records and zero shipped `blocked` leaves. This audit therefore verifies the fidelity CONTROL exists and ran, plus its deterministic backstops (hygiene + tsc + identity/field/cross-ref checkers) -- it does not, and by the firewall model cannot, re-open the prose comparison.
- The authoritative final no-verbatim / hygiene scan for shipping runs in Phase 10 (DST-*). check-hygiene's no-verbatim heuristic is WARN-level by design (0 WARNs today); the hard gates (ASCII + work-email) are green.
- Implementation files were treated as READ-ONLY. This audit created only this file (08-SECURITY.md).
