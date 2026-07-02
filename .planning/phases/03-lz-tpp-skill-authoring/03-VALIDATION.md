---
phase: 3
slug: lz-tpp-skill-authoring
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-02
---

# Phase 3 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | none - Markdown skill deliverable (SKILL.md + references/*.md with fenced TS); validation via mechanical shell checks (rg / node / test) + `claude plugin validate .` + manual semantic cross-check. No unit-test framework. |
| **Config file** | none |
| **Quick run command** | `rg -n '[^\x00-\x7F]' plugins/lz-tdd/skills/lz-tpp/**/*.md` (ASCII-only gate; expect no output) |
| **Full suite command** | `claude plugin validate .` (frontmatter/structure) + description-length + body-line-budget + references-present + TOC checks (see Per-Task Map) |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** ASCII gate + `claude plugin validate .` + the frontmatter/description-length checks for touched files
- **After every plan wave:** full mechanical suite (frontmatter valid, description <= 1024 chars, SKILL.md body under budget, references present + pointed-to + TOC on >100-line files, no `version` field, no auto-edit/auto-run language)
- **Before `/gsd:verify-work`:** all mechanical checks green; semantic cross-check (coach procedure + TS fidelity vs transformations.md / TPP-TYPESCRIPT.md) complete
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-01 | 01 | 2 | SKILL-01,02,03,04,05,06 | - | valid frontmatter; name==dir==lz-tpp; description 750<=1024; body 87 lines/702 words; no version field; coach procedure + reference pointers | shell-assertion | `claude plugin validate .` + `node -e` length check + `rg` body/procedure checks | [x] | green |
| 03-02 | 02 | 1 | TPP-06 | - | Fibonacci worked example test-by-test in monotonic priority order; TOC; ASCII | shell-assertion | `rg` transformation-step tokens + TOC + `rg -n '[^\x00-\x7F]'` | [x] | green |
| 03-03 | 03 | 1 | TPP-05,07 | - | paired functional/imperative TS + TCO patterns; landmines; ASCII; TOC | shell-assertion | `rg -n '[^\x00-\x7F]'` + TOC + pattern/landmine presence | [x] | green |

*Status: pending / green / red / flaky*
*(Reconciled post-execution to the authoritative plan/wave structure: Wave 1 = 03-02/03-03, Wave 2 = 03-01. All mechanical checks green; `claude plugin validate .` exits 0.)*

---

## Wave 0 Requirements

- [x] `claude plugin validate .` passes on the authored skill (frontmatter + structure) -- exits 0
- [x] `plugins/lz-tdd/skills/lz-tpp/SKILL.md` description 750 <= 1024 chars; body 87 lines / 702 words (under budget); no `version` field
- [x] `references/` new files present and pointed to from SKILL.md (one level deep); both new files > 100 lines carry a top-of-file TOC
- [x] ASCII-only gate across `plugins/lz-tdd/skills/lz-tpp/**/*.md` -- zero non-ASCII
- [x] transformations.md unchanged (LOCKED Phase-2 source) -- byte-unchanged since Phase 2; `git diff` clean

*All mechanical Wave-0 checks confirmed green post-execution (gsd-verifier + gsd-code-reviewer + gsd-security-auditor).*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Coach recommends the CORRECT next transformation on sample failing-test scenarios | SKILL-03 | Behavioral judgement; the domain of Phase 5 behavior evals (EVAL-02) | Read SKILL.md coach procedure; dry-run against a few RGR scenarios; full eval deferred to Phase 5 |
| Description triggers on TDD/TPP contexts and stays quiet on generic coding | SKILL-05 | Triggering accuracy is measured empirically in Phase 5 (EVAL-01) | Inspect description posture now; should/should-not-trigger eval deferred to Phase 5 |
| TS examples are tsc --strict-clean when extracted | TPP-05,07 | Fenced TS in Markdown is not compiled by any repo build; patterns already verified in TPP-TYPESCRIPT.md on Node v24 | Optional confirmatory extract + `tsc --strict` (offered in RESEARCH.md); otherwise manual cross-check vs the verified source |
| Coach + TS content faithful to transformations.md / TPP-TYPESCRIPT.md | SKILL-03,TPP-05/06/07 | Semantic fidelity judgement | Cross-check named transformations, ordering, and CPS-needs-trampoline / no-Node-2/2 landmines |

*The manual-only semantic checks were confirmed this phase by gsd-verifier (03-VERIFICATION.md, status: passed, 5/5) and gsd-code-reviewer (03-REVIEW.md, 0 critical / 0 warning); fidelity + tsc --strict on load-bearing blocks verified. Triggering + coaching-accuracy EVALS remain Phase 5 (EVAL-01/02).*

---

## Validation Audit 2026-07-02

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated (manual-only) | 4 |

**Notes:** Skill-authoring phase with no unit-test framework (Phase 1/2 precedent). The mechanical `claude plugin validate .` + `rg`/`node`/`test` checks are the automated validation instrument and all pass green; the four semantic-fidelity/behavioral checks are manual-only by nature and were independently verified by the phase verifier and code reviewer (plus confirmatory `tsc --strict` on load-bearing TS blocks). Empirical triggering + coaching-accuracy evals are deferred to Phase 5 (EVAL-01/02). No test files generated (a unit-test harness is inapplicable to a Markdown skill deliverable and out of scope). `nyquist_compliant` and `wave_0_complete` set true on that basis.

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** verified 2026-07-02
