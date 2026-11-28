---
phase: 15
slug: lz-red-skill-scaffold-description-boundary
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-18
audited: 2026-07-18
---

# Phase 15 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Phase 15 is Markdown authoring with NO runtime behavior. The "test framework" is the
> first-party `claude plugin validate .` CLI plus a lightweight mechanical STRUCTURAL gate
> (the scaffold analogue of the siblings' instrument-first harness). Empirical trigger
> recall/specificity is deferred to Phase 20 (EVL-01) -- do NOT build the eval harness here.
> Full detail in `15-RESEARCH.md` (## Validation Architecture).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `claude plugin validate .` (first-party CLI validator) + inline mechanical assertions (`wc -l` / `test -f` / `git grep -F`) |
| **Config file** | none (validator reads `.claude-plugin/marketplace.json` + each `plugin.json`) |
| **Quick run command** | `claude plugin validate .` |
| **Full suite command** | `claude plugin validate .` plus the structural assertions in Wave 0 |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `claude plugin validate .`
- **After every plan wave:** Run `claude plugin validate .` plus the full structural assertion set
- **Before `/gsd:verify-work`:** `validate .` exits 0 AND all structural assertions green
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

Task IDs are assigned by the planner. The requirement -> structural-check map below is the
contract each task's `<acceptance_criteria>` must satisfy; the planner binds tasks to these rows.

| Requirement | Wave | Behavior | Test Type | Automated Command | File Exists | Status |
|-------------|------|----------|-----------|-------------------|-------------|--------|
| SKL-01 | 1 | Skill dir + `SKILL.md` exist; frontmatter has `name` (== `lz-red`) + `description`, and OMITS `version` / `disable-model-invocation` / `user-invocable` / `allowed-tools` | structural | `test -f plugins/lz-tdd/skills/lz-red/SKILL.md` + parse YAML head, assert keys | ✅ | ✅ green |
| SKL-01 | 1 | Skill validates / is registerable | validate | `claude plugin validate .` exits 0 | ✅ | ✅ green |
| SKL-02 | 1 | Router under cap; all 10 reference stubs exist; every stub linked from `SKILL.md`; each stub carries its content-contract markers | structural | `wc -l SKILL.md` (< 500); `test -f` each of 10 stubs; `git grep -F` each stub path in `SKILL.md`; `git grep -l "Populated in Phase"` across stubs | ✅ | ✅ green |
| SKL-03 | 1 | Description present, <= 1536 chars (folded); both exclusion clauses present (lz-tpp + lz-refactor); positive trigger precedes exclusions | structural | parse folded description; assert length <= 1536; `git grep -F "lz-tpp"` and `"lz-refactor"` in the description | ✅ | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky · W0 = created at Wave 0*

### Audit re-run (2026-07-18) -- structural gate re-verified green on disk

Each check below was re-run independently against the committed on-disk state during this audit (not read from the SUMMARY):

| # | Check | Result |
|---|-------|--------|
| 1 | `claude plugin validate .` | exit 0 (`Validation passed`) |
| 2 | `wc -l < .../lz-red/SKILL.md` | 80 (< 500) |
| 3 | `test -f` all 11 files (SKILL.md + 10 stubs) | 11/11 present |
| 4 | `git grep -l "Populated in Phase"` over the stubs | 10/10 carry the marker |
| 5 | each of the 10 stub paths linked in SKILL.md AND resolves on disk | 10/10 linked + 10/10 resolve (case-correct `testing-stance/README.md`) |
| 6 | `git grep -F "use lz-tpp"` / `"use lz-refactor"` in SKILL.md | both hit (reciprocal exclusions present) |
| 7 | folded `description` length | 1091 chars (<= 1536) |
| 8 | frontmatter top-level keys | exactly `[name, description]`; `name: lz-red` == directory |
| 9 | positive trigger precedes exclusions | positive at offset 0 < first "Do NOT use it" at offset 777 |
| 10 | ASCII-only across the 11 files (`rg '[^\x00-\x7F]'`) | no matches (clean) |
| 11 | email allowlist-inversion (email-shaped tokens in the 11 files) | none present (expected) |

Verdict: SKL-01, SKL-02, SKL-03 are each **COVERED** by the structural gate. No runtime surface exists to unit-test (Markdown-only scaffold; no-new-deps scope fence forbids a test framework here). Full Nyquist coverage for this phase.

---

## Wave 0 Requirements

- [x] A mechanical structural check covering the four rows above. **Lazy path (recommended,
  per RESEARCH.md):** inline `wc -l` / `test -f` / `git grep -F` assertions in the plan's
  verification steps -- no committed script. A scaffold does not need a re-runnable harness;
  the vendored eval harness is Phase 20. Add a dedicated `.mjs` checker only if the planner
  explicitly wants it re-runnable. **Re-run green at audit (2026-07-18).**
- [x] `claude plugin validate .` availability confirmed (the `claude` CLI is the runtime we
  are in -- present by definition). **Re-run at audit: exit 0.**

*Deferred to Phase 20 (EVL-01, NOT Wave 0): empirical trigger recall/specificity and the
cross-skill (three-way boundary) trigger eval. The vendored skill-creator eval harness + eval
sets are Phase 20 (D-03/D-08). Do not build them here.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| The `description` actually fires on RED-phase intent and stays quiet on green/refactor near-misses | SKL-03 | Requires a live trigger eval against a prompt corpus; deliberately deferred to Phase 20 (D-08) | Phase 20 EVL-01: run the vendored trigger eval; measure recall/specificity + the three-way boundary |
| Reciprocal near-miss guards read correctly to a human | SKL-03 | Judgment on wording clarity (empirical tuning is Phase 20) | Read the two exclusion clauses; confirm each points at the correct sibling skill |

---

## Validation Sign-Off

- [x] All tasks have `<acceptance_criteria>` mapped to a structural check or the validate gate
- [x] Sampling continuity: `claude plugin validate .` runs after each task commit
- [x] Wave 0 covers all four SKL-01/02/03 structural rows
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter (confirmed by validate-phase audit 2026-07-18; all Wave 0 structural checks re-run green)

**Approval:** approved (audit 2026-07-18) -- SKL-01/02/03 COVERED by the structural gate; the empirical trigger eval (EVL-01) is deferred to Phase 20 by design and recorded as manual-only, not a Nyquist gap for Phase 15.
