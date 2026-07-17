---
phase: 09
slug: coach-behavior-principle-backing
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-08
validated: 2026-07-09
---

# Phase 09 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Draft created at plan-time from the RESEARCH.md `## Validation Architecture`
> section. Completed and flags flipped by `/gsd-validate-phase 09` after execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | node-builtin checker harness (`.mjs`, no test framework) + `tsc --strict` typecheck + `claude plugin validate .` |
| **Config file** | `.claude/skills/lz-refactor-workspace/package.json` (`npm run check` battery) |
| **Quick run command** | `npm run check` (in `.claude/skills/lz-refactor-workspace/`) |
| **Full suite command** | `npm run check && npm run typecheck && claude plugin validate .` |
| **Estimated runtime** | ~5-10 seconds (10-checker battery + typecheck) |

---

## Sampling Rate

- **After every task commit:** Run `npm run check`
- **After every plan wave:** Run the full suite (`npm run check && npm run typecheck`)
- **Before `/gsd:verify-work`:** Full suite + `claude plugin validate .` must be green
- **Max feedback latency:** ~10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 09-01-01 | 01 | 1 | PRIN infra (D-10/IN-02) | T-09-FP | Behavior-preserving H1-scan swap; all 9 checkers keep exit 0 | structural | `npm run check` | Yes (W0) | Green |
| 09-01-02 | 01 | 1 | PRIN-01/02/03 gate (D-09) | T-09-RED | RED baseline asserted before content (exit 1) | structural | `node tools/check-backing.mjs` | Yes (W0) | Green (RED->GREEN post-content) |
| 09-02-01 | 02 | 2 | CCH-01..06 | T-09-LINK / T-09-IP | Coach links resolve; original routing prose | structural + manual | `node tools/check-crossrefs.mjs && node tools/check-hygiene.mjs` (+ skill-reviewer for routing) | Yes | Green |
| 09-03-01 | 03 | 2 | PRIN-01 | T-09-DST | no-oracle tag + core tokens + no scaffold; DST-04 paraphrase | structural + manual | `node tools/check-backing.mjs` (+ skill-reviewer / DST-04) | Yes | Green |
| 09-03-02 | 03 | 2 | PRIN-02 | T-09-DST | core tokens + Fowler link presence + no-oracle | structural | `node tools/check-backing.mjs && node tools/check-crossrefs.mjs` | Yes | Green |
| 09-03-03 | 03 | 2 | PRIN-03 | T-09-DST | technique tokens + no-oracle + scaffold markers removed | structural + manual | `node tools/check-backing.mjs` (+ skill-reviewer / DST-04) | Yes | Green |
| 09-04-01 | 04 | 3 | CCH-05 / PRIN-01 / PRIN-02 | T-09-LINK | Beck pointers resolve; pointers-only (no content import) | structural | `node tools/check-crossrefs.mjs` | Yes | Green |
| 09-04-02 | 04 | 3 | CCH-01..06 / PRIN-01..03 | T-09-GATE / T-09-DST | Full gate GREEN, no checker weakened; skill-reviewer PASS | structural + manual | `npm run check && npm run typecheck` + `claude plugin validate .` + skill-reviewer | Yes | Green |

*Status: pending / green / red / flaky*
*Populated by `/gsd-validate-phase 09` after execution against the RED->GREEN wave sequence in `09-RESEARCH.md`.*

---

## Wave 0 Requirements

- [x] `check-backing.mjs` — RED baseline against the empty/stub principle refs (D-09), then GREEN after Wave 2 content (25/25 checks, 3/3 refs)
- [x] `tools/lib/heading-scan.mjs` — shared fence-aware `collectH1Lines` helper (D-10 / IN-02); all four catalog checkers rewired, battery behavior-preserving

*Instrument-first: the structural checker gate is built to a RED baseline BEFORE content lands; requirements close only when the full `npm run check` battery goes GREEN.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Behavioral routing correctness (coach recommends the correct next refactoring) | CCH-01..06 | Not machine-checkable in this phase — prose coach guidance; deferred to Phase 11 EVL-02 | skill-reviewer PASS + manual spot-check of the routing decision tree. DONE 2026-07-09: skill-reviewer PASS-with-suggestions (caught + fixed the Repeated Switches->Kerievsky routing example in 09-02); empirical eval is EVL-02. |
| DST-04 IP fidelity of the no-oracle Beck/Feathers refs | PRIN-01/02/03 | No owned book oracle (D-07); cannot diff against a source text | skill-reviewer PASS (authoritative DST-04 anchor) + check-hygiene no-verbatim heuristic. DONE 2026-07-09: independent DST-04 review + skill-reviewer PASS; one near-verbatim seam definition fixed (commit a63d1b4). |

*Structural existence / token-presence / cross-link resolution are automated; behavioral routing accuracy and no-oracle IP fidelity are anchored by skill-reviewer PASS (EVL-02 covers empirical routing in Phase 11).*

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-09

---

## Validation Audit 2026-07-09

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated (manual-only) | 2 (CCH-01..06 behavioral routing; PRIN no-oracle DST-04 fidelity) |

No MISSING automatable gaps: this is a documentation / skill-authoring phase whose test suite IS
the node-builtin checker battery (`npm run check`, 10 checkers) + `tsc --strict` typecheck +
`claude plugin validate .`, all GREEN on the merged tree and independently re-run by gsd-verifier
(9/9 SATISFIED). Behavioral routing correctness (CCH-01..06) and no-oracle IP fidelity
(PRIN-01/02/03) are inherently non-unit-testable and are anchored by the skill-reviewer PASS
(achieved this phase) with empirical routing deferred to Phase 11 EVL-02. No gsd-nyquist-auditor
test generation was required.
