---
phase: 16
slug: source-distillation-core-red-references
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-19
audited: 2026-07-19
---

# Phase 16 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Strategy scaffold from 16-RESEARCH.md `## Validation Architecture`. The detailed
> per-task map + sign-off were finalized by gsd-nyquist-auditor at /gsd-validate-phase --
> 2026-07-19, see the Validation Audit section below for the verdict and evidence.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Node.js structural checkers (ESM, node builtins, no test framework) + a pinned `typescript` per-fence tsc --strict extractor; Vitest 4.1.10 types for the example fences only |
| **Config file** | `.claude/skills/lz-red-workspace/tsconfig.json` (strict) + `package.json` (pinned `typescript`, `vitest@4.1.10`) -- dev-only workspace; the shipped `plugins/lz-tdd` tree has NO build deps |
| **Quick run command** | `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` (completeness/contract; the RED baseline) |
| **Full suite command** | `check-red-references.mjs` + `extract-samples.mjs` (tsc --strict per fence) + repo-global `check-hygiene.mjs` (ASCII / work-email allowlist / no-verbatim) |
| **Estimated runtime** | ~20-40 seconds (deterministic, offline, free) |

---

## Sampling Rate

- **After every content task commit:** Run `check-red-references.mjs` + `extract-samples.mjs`.
- **After every wave:** Run the full battery (add `check-hygiene.mjs`).
- **Before phase close:** Full battery GREEN + oracle-reviewer converge-to-clean on every owned surface.
- **Max feedback latency:** ~40 seconds.

---

## Nyquist RED baseline (why tsc alone is insufficient)

The tsc --strict extractor is **GREEN-on-empty** -- zero code fences compile vacuously, so it
is NOT the RED->GREEN signal for content authoring. The instrument-first RED baseline is the
`check-red-references.mjs` completeness checker: it is RED while the three references still carry
only Phase-15 stub content and turns GREEN when the SEL / STR / NAME slices are authored with
their required own-words facts + at least one tsc-strict example each.

---

## Per-Task Verification Map

| Requirement | Wave | Threat Ref | Test Type | Automated Command | Result (audit re-run, 2026-07-19) | Status |
|-------------|------|------------|-----------|--------------------|--------------------------------------|--------|
| (instrument) | 0 | T-16-* | completeness | `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` | exit 1 at the 16-01 checkpoint (RED baseline, by design, 6/22 checks failing); exit 0 today | green |
| SEL-01 | 1 | T-16-verbatim | completeness + tsc | `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` (test-list / one-step / degenerate-starter rows) + `node .claude/skills/lz-red-workspace/extract-samples.mjs` (SEL fence tsc --strict clean) | both exit 0 | green |
| SEL-02 | 1 | T-16-verbatim, T-16-firewall | completeness + tsc + manual | `check-red-references.mjs` (triangulation + lz-tpp-reference rows) + `extract-samples.mjs`; firewall DIRECTION confirmed by direct read (this audit) + skill-reviewer (16-03) + gsd-verifier (16-VERIFICATION.md) | exit 0; firewall sentence present and correctly directional | green |
| STR-01 | 1 | T-16-verbatim | completeness + tsc | `check-red-references.mjs` (arrange-act-assert / given-when-then rows) + `extract-samples.mjs` (STR fence tsc --strict clean) | both exit 0 | green |
| STR-02 | 1 | T-16-verbatim | completeness + tsc | `check-red-references.mjs` (assert-first / evident-data / one-concept rows) + `extract-samples.mjs` | both exit 0 | green |
| NAME-01 | 1 | T-16-verbatim | completeness + tsc | `check-red-references.mjs` (should / behavior / Osherove / match-house-stance rows) + `extract-samples.mjs` (naming fence tsc --strict clean) | both exit 0 | green |
| (hygiene, cross-cutting) | 1-2 | T-16-email, T-16-ascii | hygiene | `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` | exit 0 -- 198 files ASCII/email clean, 191 files no-verbatim clean | green |
| 16-Gate | 2 | T-16-*, T-16-gate | full battery | full battery (all commands above) + oracle-reviewer converge-to-clean + `claude plugin validate .` | all exit 0; oracle-reviewer 3/3 round-1 pass (16-02) + 2/2 re-gate pass after DST-04 reword (16-03) | green |

*Status: pending / green / red / flaky. All rows independently re-run by gsd-nyquist-auditor on
2026-07-19 (see Validation Audit below). "Result" reports what THIS audit session observed
directly by running the commands, not what SUMMARY/VERIFICATION narrated.*

---

## Wave 0 Requirements

- [x] `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` -- completeness/contract checker; confirmed on disk and GREEN (22/22 checks) in this audit's re-run.
- [x] `.claude/skills/lz-red-workspace/tools/extract-samples.mjs` + `tsconfig.json` -- one-module-per-fence tsc --strict extractor (copied/adapted from lz-refactor-workspace); confirmed on disk and GREEN (3/3 modules tsc --strict clean).
- [x] `.claude/skills/lz-red-workspace/package.json` -- pinned `typescript@6.0.3` + `vitest@4.1.10` (dev-only; not in `plugins/`); confirmed exact pins, confirmed absent from the shipped `plugins/lz-tdd` tree.
- [x] Extend repo-global `check-hygiene.mjs` no-verbatim/ASCII/email targets to include the lz-red reference tree; confirmed additive-only (APPROVED_EMAILS/EMAIL_RE/QUOTE_THRESHOLD/scan-floor unchanged) and GREEN.

D-11 resolved: the planner chose a fresh `lz-red-workspace` (not a reuse of the
`lz-refactor-workspace` extractor in place) -- shipped and verified present on disk
(`.claude/skills/lz-red-workspace/`), self-contained (own copy of `scaffold-phrases.mjs`, no
cross-workspace import), zero build dependency in the shipped `plugins/lz-tdd` tree.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Own-words fidelity of OWNED-source surfaces (RCM one-step/one-concept; Metz name-for-behavior) | SEL-01, STR-02, NAME-01 | Copyright/DST-04 judgement is not fully deterministic | oracle-reviewer converge-to-clean (3-round cap), CONTENT_TYPE=other + driver anchors; main context never reads `.oracle/` |
| No-oracle high-confidence-core surfaces (Beck/Wake/North/Osherove) | SEL-01/02, STR-01/02, NAME-01 | No `.oracle/` source to gate against | Deterministic no-verbatim scan (`check-hygiene.mjs`) only |
| SEL-02 load-bearing RED/GREEN firewall direction (triangulation SELECTS the next test; it does not generalize production code) | SEL-02 | Directional/semantic correctness of a boundary claim is not regex-checkable -- `check-red-references.mjs` only asserts the word "lz-tpp" appears somewhere in the file, not which direction the sentence points | Direct read confirmed by gsd-verifier (16-VERIFICATION.md truth #2), the 16-03 skill-reviewer (>= 1 unbiased from-scratch), and this audit's independent re-read: "Triangulation in this reference selects the next test; it never generalizes production code. lz-red picks the test; lz-tpp makes it pass." |
| Topic-content substance (does real distilled rationale exist under each heading, not just the heading/keyword) | SEL-01, SEL-02, STR-01, STR-02, NAME-01 | `check-red-references.mjs`'s topic regexes are line-level keyword presence, not prose-completeness proofs -- see the Validation Audit WARNING below | Direct full-file read (this audit + gsd-verifier + 16-03 skill-reviewer); confirmed substantive prose under every heading in all three references |

---

## Validation Audit 2026-07-19

**Scope:** retroactive Nyquist coverage audit per `/gsd-validate-phase 16`, State A (this
scaffold existed; audited and finalized after 16-01/16-02/16-03 and 16-VERIFICATION.md were
already complete). Constraints observed: implementation files (references + checkers) are
READ-ONLY to this audit -- only this file was edited; `.oracle/` was never read.

**Method:** every automated command named in this file was independently re-run in this audit
session (not read from SUMMARY/VERIFICATION claims), and all three shipped reference files were
read directly in full to confirm the checker's topic-regex hits correspond to real, substantive
prose rather than bare keyword insertion.

### Gap-closure metrics

| Metric | Count |
|--------|-------|
| Requirements audited | 5 (SEL-01, SEL-02, STR-01, STR-02, NAME-01) |
| Gaps found (requirement with NO automated check at all) | 0 |
| Gaps resolved (new tests generated this session) | 0 -- none needed; the structural battery already covers every requirement (phase-type constraint: do not fabricate a jest/vitest suite for Markdown docs) |
| Gaps escalated (BLOCKER) | 0 |
| Instrument-quality WARNINGs raised (non-blocking) | 1 -- topic-regex precision, detailed below |

### Commands re-run this session (independent, not narrated)

| Command | Result |
|---------|--------|
| `node .claude/skills/lz-red-workspace/extract-samples.mjs` | exit 0 -- "3 module(s) extracted, 0 fence(s) skipped" / "RED-SAMPLES GREEN -- 3 module(s) tsc --strict --noEmit clean" |
| `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` | exit 0 -- 22/22 checks PASS, "RED-REFS GREEN -- 3/3 core references authored" |
| `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` | exit 0 -- "hygiene GREEN -- ASCII + work-email (198 files) + no-verbatim (191 files) all clean" |
| `claude plugin validate .` | exit 0 -- "Validation passed" |

### WARNING (non-blocking): check-red-references.mjs topic-regex precision

Comparing the current (16-02/16-03) content against the Phase-15 stub commit (`a7c037d`) shows
that **all 14 "topic" line-regexes across the three files were already satisfied by the Phase-15
stub's Scope paragraph and Sub-topics bullets**, before any Phase-16 prose was authored. Verified
directly against the stub commit:

- `naming.md` stub Scope line already contained "should", "behavior", and "Osherove"; a
  Sub-topics bullet ("Matching the codebase's existing naming stance...") already satisfied
  `/match.*(house|stance)/i`.
- `three-laws-and-test-selection.md` stub Sub-topics already contained "The running test list",
  "One step at a time", "Degenerate / starter case", "Triangulation", and "(lz-tpp)" in the Scope
  paragraph.
- `test-structure-and-assertions.md` stub Scope/Sub-topics already contained
  "arrange-act-assert", "given-when-then", "Assert-first", "Evident test data", and "One concept
  per test".

This matches what `16-01-SUMMARY.md` itself discloses: only 6 of the 22 checks were the real RED
baseline at the 16-01 checkpoint (3x `>= 1 ts fence` + 3x `no scaffold phrase`); the other 14
topic-presence checks were passing from the Phase-15 stub onward. They function as a **line-level
keyword proxy**, not a proof that substantive rationale exists under each heading, and would NOT
catch a regression that deleted a section's real prose while leaving a stray keyword elsewhere in
the file -- most notably `naming.md`'s "should" and "behavior" checks, which key on single common
English words.

**This is a real precision gap in the checker, but it is NOT a coverage gap in the phase.** Every
requirement still has genuine automated instrumentation that DID flip from RED to GREEN on real
authoring signal:
- the `>= 1 ts fence` assertion (0 fences at the stub -> >= 1 today, and `extract-samples.mjs`
  independently proves each fence is tsc --strict --noEmit clean, not just present),
- the `no scaffold phrase` assertion (the stub's `## Sources (placeholder)` heading tripped the
  shared `SCAFFOLD_RES` set; today's `## Sources` heading is clean), and
- `check-hygiene.mjs` (ASCII + work-email + no-verbatim), unaffected by this finding.

On top of the automated layer, this audit independently re-read all three shipped files in full
(not sampled) and confirms the actual prose under every heading is substantive, correct, and
matches its requirement -- not just a bare heading -- corroborating the same conclusion
`16-VERIFICATION.md` (direct-read evidence per truth) and the 16-03 skill-reviewers (>= 1 unbiased
from-scratch, 0 Critical/Important) already reached independently and separately.

**Disposition:** WARNING, not BLOCKER, and does not flip `nyquist_compliant` to false. Per this
phase's validate-phase constraints, a gap is only flagged when a requirement has NO automated
check at all; every requirement here has one (fence-existence + tsc-compile + scaffold-clearing +
hygiene, all independently re-run GREEN this session), even though the topic sub-check is
low-precision. Per the READ-ONLY constraint on implementation files, the checker itself was not
modified by this audit.

**Recommended follow-up (not this phase's scope):** a future checker-maintenance pass could
tighten the topic regexes to require the pattern inside an authored `## <Heading>` prose block
(for example, within N lines after the matching heading, or requiring a "Distilled rationale"
marker) rather than any line in the file, so a future regression that hollows out a section's
rationale while leaving the heading/keywords intact would be caught. Track as tech debt, not a
Phase-16 gap.

### Verdict

All 5 requirements (SEL-01, SEL-02, STR-01, STR-02, NAME-01) are COVERED by the structural
battery (`check-red-references.mjs` + `extract-samples.mjs` + `check-hygiene.mjs` +
`claude plugin validate .`), all four commands independently re-run GREEN in this session, and
independently corroborated by direct full-file reading. No requirement lacks an automated check.
`nyquist_compliant: true` and `wave_0_complete: true` (set in frontmatter above) hold.

---

## Validation Sign-Off

- [x] All content tasks gate on `check-red-references.mjs` + `extract-samples.mjs` -- confirmed: every 16-02 task's `<verify>` block runs both; independently re-run GREEN this audit.
- [x] Sampling continuity: no 3 consecutive tasks without an automated check -- confirmed: every one of the 8 tasks across 16-01/16-02/16-03 carries an `<automated>` verify block (see the three PLAN.md files).
- [x] Wave 0 stands up the checker + tsc extractor and asserts the RED baseline -- confirmed: 16-01 (`5b816d9`, `5a67567`) stood up the instrument and asserted RED (6/22 failing) before any content landed.
- [x] No watch-mode flags in any committed command -- confirmed: all four battery commands are one-shot (`node <script>.mjs`, `claude plugin validate .`); no `--watch` anywhere.
- [x] Every owned surface passed oracle-reviewer; no-verbatim scan GREEN -- confirmed: 16-02 (3/3 round-1 pass) + 16-03 re-gate after DST-04 reword (2/2 pass, confidence 93); `check-hygiene.mjs` independently re-run GREEN (191 files no-verbatim clean).
- [x] `nyquist_compliant: true` set post-execution by gsd-nyquist-auditor -- set in frontmatter above, backed by this Validation Audit.

**Approval:** approved -- gsd-nyquist-auditor, 2026-07-19 (see Validation Audit 2026-07-19 above)
