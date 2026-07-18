---
phase: 15
slug: lz-red-skill-scaffold-description-boundary
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-18
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
| SKL-01 | 1 | Skill dir + `SKILL.md` exist; frontmatter has `name` (== `lz-red`) + `description`, and OMITS `version` / `disable-model-invocation` / `user-invocable` / `allowed-tools` | structural | `test -f plugins/lz-tdd/skills/lz-red/SKILL.md` + parse YAML head, assert keys | ❌ W0 | ⬜ pending |
| SKL-01 | 1 | Skill validates / is registerable | validate | `claude plugin validate .` exits 0 | ❌ W0 | ⬜ pending |
| SKL-02 | 1 | Router under cap; all 10 reference stubs exist; every stub linked from `SKILL.md`; each stub carries its content-contract markers | structural | `wc -l SKILL.md` (< 500); `test -f` each of 10 stubs; `git grep -F` each stub path in `SKILL.md`; `git grep -l "Populated in Phase"` across stubs | ❌ W0 | ⬜ pending |
| SKL-03 | 1 | Description present, <= 1536 chars (folded); both exclusion clauses present (lz-tpp + lz-refactor); positive trigger precedes exclusions | structural | parse folded description; assert length <= 1536; `git grep -F "lz-tpp"` and `"lz-refactor"` in the description | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky · W0 = created at Wave 0*

---

## Wave 0 Requirements

- [ ] A mechanical structural check covering the four rows above. **Lazy path (recommended,
  per RESEARCH.md):** inline `wc -l` / `test -f` / `git grep -F` assertions in the plan's
  verification steps -- no committed script. A scaffold does not need a re-runnable harness;
  the vendored eval harness is Phase 20. Add a dedicated `.mjs` checker only if the planner
  explicitly wants it re-runnable.
- [ ] `claude plugin validate .` availability confirmed (the `claude` CLI is the runtime we
  are in -- present by definition).

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

- [ ] All tasks have `<acceptance_criteria>` mapped to a structural check or the validate gate
- [ ] Sampling continuity: `claude plugin validate .` runs after each task commit
- [ ] Wave 0 covers all four SKL-01/02/03 structural rows
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter (by the planner / validate-phase once Wave 0 checks are bound)

**Approval:** pending
