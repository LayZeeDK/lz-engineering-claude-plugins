---
phase: 3
slug: lz-tpp-skill-authoring
status: draft
nyquist_compliant: false
wave_0_complete: false
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
| 3-01-01 | 01 | - | SKILL-01,02,05,06 | - | valid frontmatter; name==dir==lz-tpp; description <= 1024; body under budget; no version field | shell-assertion | `claude plugin validate .` + `node -e` length check + `rg -c` body lines | [ ] W0 | pending |
| 3-02-01 | 02 | - | SKILL-03,04,TPP-06 | - | coach procedure + reference pointers present; Fibonacci worked example test-by-test | shell-assertion | `rg` for procedure steps / transformation names / test-by-test markers | [ ] W0 | pending |
| 3-03-01 | 03 | - | TPP-05,07 | - | paired functional/imperative TS + TCO patterns; ASCII; TOC on >100-line refs | shell-assertion | `rg -n '[^\x00-\x7F]'` + TOC presence + pattern-name presence | [ ] W0 | pending |

*Status: pending / green / red / flaky*
*(Plan/task IDs and waves above are provisional -- gsd-planner sets the authoritative structure; gsd-validate-phase reconciles this map post-execution.)*

---

## Wave 0 Requirements

- [ ] `claude plugin validate .` passes on the authored skill (frontmatter + structure)
- [ ] `plugins/lz-tdd/skills/lz-tpp/SKILL.md` description <= 1024 chars; body under the ~500-line / ~1.5-2k-word budget; no `version` field
- [ ] `references/` new files present and pointed to from SKILL.md; files > 100 lines carry a top-of-file TOC (per current Agent Skills docs)
- [ ] ASCII-only gate across `plugins/lz-tdd/skills/lz-tpp/**/*.md`
- [ ] transformations.md unchanged (LOCKED Phase-2 source)

*Populated post-execution by gsd-validate-phase; this draft lists the mechanical checks the skill deliverable needs.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Coach recommends the CORRECT next transformation on sample failing-test scenarios | SKILL-03 | Behavioral judgement; the domain of Phase 5 behavior evals (EVAL-02) | Read SKILL.md coach procedure; dry-run against a few RGR scenarios; full eval deferred to Phase 5 |
| Description triggers on TDD/TPP contexts and stays quiet on generic coding | SKILL-05 | Triggering accuracy is measured empirically in Phase 5 (EVAL-01) | Inspect description posture now; should/should-not-trigger eval deferred to Phase 5 |
| TS examples are tsc --strict-clean when extracted | TPP-05,07 | Fenced TS in Markdown is not compiled by any repo build; patterns already verified in TPP-TYPESCRIPT.md on Node v24 | Optional confirmatory extract + `tsc --strict` (offered in RESEARCH.md); otherwise manual cross-check vs the verified source |
| Coach + TS content faithful to transformations.md / TPP-TYPESCRIPT.md | SKILL-03,TPP-05/06/07 | Semantic fidelity judgement | Cross-check named transformations, ordering, and CPS-needs-trampoline / no-Node-2/2 landmines |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
