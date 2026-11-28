---
phase: 16-source-distillation-core-red-references
audited: 2026-07-19
asvs_level: 1
block_on: high
register_authored_at_plan_time: true
threats_total: 9
threats_closed: 9
threats_open: 0
status: secured
---

# Phase 16: Source Distillation and Core RED References Security Audit

**Verdict: SECURED.** All 9 threats declared across the three plan `<threat_model>` blocks
(16-01 / 16-02 / 16-03) are CLOSED. Every declared mitigation was verified present in the
implementation -- not accepted from documentation or intent. The five HIGH threats (the blocking
tier at `block_on: high`) each have a located, re-run, or diff-confirmed control. `threats_open: 0`.

This is a Markdown-only docs plus dev-tooling phase with no application runtime, so there is no
injection / authz / network / crypto attack surface; the register is entirely content-integrity,
supply-chain, and public-repo-hygiene threats. No new attack surface was scanned for (per the
retroactive-verification contract); each declared threat was verified by its disposition.

## Register Origin

`register_authored_at_plan_time: true` -- all three PLANs carry parseable `<threat_model>` blocks.
The union of their STRIDE registers yields 9 distinct threats (T-16-email / T-16-ascii / T-16-scope
recur across plans; verified once each against the merged tree). Every disposition is `mitigate`;
no `accept` or `transfer` entries exist, so no accepted-risk log or transfer documentation is
required.

## Severity Gate

`block_on: high` (ASVS L1). Severity order critical > high > medium > low. Blocking tier = HIGH and
above. All 9 threats are CLOSED, so `threats_open` (severity-filtered count of OPEN threats at or
above HIGH) is 0. Nothing blocks phase completion.

## Threat Verification

| Threat ID | Category | Severity | Disposition | Status | Evidence |
|-----------|----------|----------|-------------|--------|----------|
| T-16-verbatim | Information Disclosure | high | mitigate | CLOSED | Clean-room `.oracle/` is git-ignored and authored blind (executor never read source prose; recorded in 16-02/16-03 SUMMARY deviation notes). Oracle-reviewer converge-to-clean gate: 16-02 records 3/3 owned surfaces verdict=pass round 1 (RCM Clean Code x2, Metz 99 Bottles x1); 16-03 records 2/2 re-gate pass (confidence 93) after commit `606faa8` reworded 2 near-verbatim canon phrasings caught by the dual skill-review. Deterministic no-verbatim scan re-run this audit: `check-hygiene.mjs` axis (c) GREEN, 191 files clean, `QUOTE_THRESHOLD=120` unchanged, lz-red tree in `verbatimTargets` (check-hygiene.mjs:139-143). All three refs read as own-words with per-thread provenance blockquotes. Verified WITHOUT reading `.oracle/` per the clean-room constraint. |
| T-16-email | Information Disclosure | high | mitigate | CLOSED | Allowlist-inversion control intact: `APPROVED_EMAILS = {larsbrinknielsen@gmail.com}` (check-hygiene.mjs:42), `EMAIL_RE` enumerate-and-subtract (check-hygiene.mjs:43,188-201); lz-red tree added to `wideTargets` (check-hygiene.mjs:114-118). Gate re-run: "no non-allowlisted emails" PASS over 198 files. The three shipped references contain zero email-shaped tokens (direct read). Commit identity: all 6 phase-16 code commits (`5b816d9 5a67567 8cdda55 4f48216 df17fa7 606faa8`) have author AND committer = the approved public gmail (`git show --no-walk` verified). No maintainer work-email or bare work-domain token present; verified by allowlist-inversion, not by encoding the forbidden value. |
| T-16-firewall | Coach-boundary integrity | high | mitigate | CLOSED | The load-bearing SEL-02 firewall sentence is present in `three-laws-and-test-selection.md:81-86`: "Triangulation in this reference selects the next test; it never generalizes production code. lz-red picks the test; lz-tpp makes it pass." `check-red-references.mjs:38` asserts an lz-tpp reference is present -- re-run this audit: "lz-tpp GREEN firewall reference" PASS. Dual skill-reviewer (1 unbiased from-scratch opus, 1 primed sonnet) and oracle-reviewer confirmed the RED/GREEN seam holds (16-03-SUMMARY). |
| T-16-SC-hygiene | Tampering | high | mitigate | CLOSED | The check-hygiene edit (commit `5a67567`) is additive-only. Diff inspected directly: additions are new `LZ_RED_SKILL_DIR/_MD/_REFERENCES` consts + two `wideTargets.push(...)` + two `verbatimTargets.push(...)`. The single deletion line is a cosmetic `console.log` scope string ("both skill trees" -> "the skill trees"). `APPROVED_EMAILS`, `EMAIL_RE`, `QUOTE_THRESHOLD`, and the scan-floor anchor logic are byte-unchanged. Widening the file set cannot weaken an existing control. |
| T-16-gate | Integrity of verification | high | mitigate | CLOSED | No checker was weakened to force GREEN; fixes were content-only (`606faa8` reworded prose, not gates). `check-red-references.mjs` topic assertions are substantive (per-file topic-regex + `>= 1 ts fence` + scaffold-leak + deferral guard), not trivially-passing. The finalize task re-ran the exact Wave-1 checker commands + `claude plugin validate .`. Independently re-run this audit: check-red-references exit 0 (22/22 PASS), check-hygiene exit 0, extract-samples exit 0 (3 modules tsc-strict clean); `claude plugin validate .` exit 0 per 16-VERIFICATION. |
| T-16-ascii | Tampering (data corruption) | medium | mitigate | CLOSED | check-hygiene axis (a) fails on any byte > 0x7F, reported file@byteN (check-hygiene.mjs:84-94,174-185); lz-red tree in `wideTargets`. Gate re-run: "ASCII-only -- 198 files clean" PASS. |
| T-16-tsc | Integrity of guidance | medium | mitigate | CLOSED | `extract-samples.mjs` runs `tsc --strict --noEmit` over every fence (one module per fence). Re-run this audit: exit 0, "3 module(s) tsc --strict --noEmit clean, 0 skipped". Each of the three references carries exactly one minimal `describe/it/expect` Vitest fence with an explicit `import ... from 'vitest'`; types resolve from the git-ignored workspace node_modules. |
| T-16-SC | Supply chain | low | mitigate | CLOSED | Two dev deps exact-pinned: `typescript: "6.0.3"`, `vitest: "4.1.10"` (package.json:11-12, no `^`/`~`). Blocking-human legitimacy checkpoint APPROVED (16-01 Task 3: human verified both on npmjs.com -- official microsoft/TypeScript, official vitest-dev/vitest, no postinstall). Dev-only: the shipped `plugins/lz-tdd/.claude-plugin/plugin.json` has NO `dependencies` key (grep: 0 matches); node_modules is git-ignored; 16-VERIFICATION confirms no package.json/lock/node_modules under plugins/lz-tdd. |
| T-16-scope | Scope integrity | low | mitigate | CLOSED | `check-red-references.mjs` deferral guards assert later-phase markers must REMAIN: Phase 18 (`/Phase 18|LAW-0|SEAM-0/`, line 40) on three-laws, Phase 17 (`/Phase 17|ASRT-0/`, line 51) on test-structure. Re-run: "Phase 18 spine/seam marker remains" PASS, "Phase 17 assertions marker remains" PASS. Direct read confirms `three-laws-and-test-selection.md:88` ("The Three Laws spine and classify-first (Phase 18)") and `test-structure-and-assertions.md:86` ("Assertions and the four pillars (Phase 17)") are markers, not filled prose. naming.md correctly carries no marker (wholly Phase 16). |

**Closed: 9/9. Open: 0/9.**

## Unregistered Flags

None. No `## Threat Flags` section appears in any of the three phase-16 SUMMARY files (grep:
0 matches), and no new attack surface emerged during implementation that lacks a threat mapping.

## Audit Trail

Verification performed against the current committed tree, not accepted from SUMMARY narration:

1. Extracted the STRIDE registers from 16-01 / 16-02 / 16-03 `<threat_model>` blocks; deduped to
   9 distinct threats; classified each by disposition (all `mitigate`).
2. Read the three shipped references (`three-laws-and-test-selection.md`,
   `test-structure-and-assertions.md`, `naming.md`) -- confirmed own-words content, the SEL-02
   firewall sentence, ASCII, no email tokens, and the intact Phase 17 / Phase 18 deferral markers.
3. Read the two checkers (`check-hygiene.mjs`, `check-red-references.mjs`) and the workspace
   `package.json` + shipped `plugin.json` -- confirmed the allowlist-inversion rule set, the
   substantive completeness assertions, the exact dep pins, and the absence of a shipped
   `dependencies` key.
4. Re-ran all three deterministic gates independently: check-red-references (exit 0, 22/22 PASS),
   check-hygiene (exit 0, ASCII+email+no-verbatim over 198/191 files), extract-samples (exit 0,
   3 modules tsc-strict clean).
5. Inspected commit `5a67567` diff -- confirmed the check-hygiene extension is additive-only with
   no rule-constant change (only a cosmetic log-string deletion).
6. Verified phase-16 commit identity via `git show --no-walk` on the 6 code commits -- author and
   committer are the approved public gmail on every one.
7. Honored the clean-room constraint: `.oracle/` was NOT read. T-16-verbatim was verified via the
   recorded oracle-reviewer verdicts (16-02/16-03), the independently re-run no-verbatim scan, and
   the own-words reading of the shipped refs -- never by re-reading the source books.

## Notes and Out-of-Scope

- Implementation files were not modified. This audit only created `16-SECURITY.md`.
- A pre-existing, archived-milestone (lz-tdd@0.0.2) public-repo-hygiene item exists outside this
  phase's file set and register; it is not a Phase 16 threat and is out of scope here. It is tracked
  separately and its remediation is gated on push-state, to be decided before the next push/PR.
- The one behavior-dependent question (whether the SEL/STR/NAME guidance empirically produces the
  correct coaching move when live-invoked) is not a security threat; it is a coaching-efficacy eval
  deferred to Phase 20 (EVL-02) per 16-VERIFICATION, and does not affect this verdict.

---
*Audited: 2026-07-19*
*Auditor: Claude (gsd-security-auditor)*
