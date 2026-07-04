---
phase: 6
slug: lz-refactor-skill-scaffold-progressive-disclosure
status: verified
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-04
---

# Phase 6 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This is a pure-Markdown/JSON plugin phase: there is NO code test framework.
> "Tests" are shell/filesystem assertions + the first-party `claude plugin validate`
> + the plugin-validator / skill-reviewer review agents. Source: 06-RESEARCH.md
> "## Validation Architecture".
> ASCII-only status markers per the repo ASCII-only constraint: [pending] [green] [red] [flaky].

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (Markdown/JSON plugin). Verification = shell assertions + `claude plugin validate` + first-party review agents. |
| **Config file** | none -- see Wave 0 (one throwaway checker script) |
| **Quick run command** | `claude plugin validate .` (structure + frontmatter, exit 0) |
| **Full suite command** | `claude plugin validate . --strict` (exit 0) + the SC1-SC4 assertions below |
| **Estimated runtime** | ~5-15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `claude plugin validate .` + the file-exists / pointer-resolution assertion for files touched.
- **After every plan wave:** Run `claude plugin validate . --strict` (exit 0) AND all SC1-SC4 checks green.
- **Before `/gsd:verify-work`:** `--strict` exit 0 AND all SC checks green AND plugin-validator + skill-reviewer PASS.
- **Max feedback latency:** ~15 seconds

---

## Per-Task Verification Map

> Populated by the planner / gsd-nyquist-auditor against the emitted PLAN.md tasks.
> The success-criteria -> check mapping below is the authoritative source for those rows.
> "File Exists" = W0 means the checker/stub is created in Wave 0; "tool" = uses existing claude CLI.

| SC | Behavior | Check type | Automated command / assertion | File Exists | Status |
|----|----------|-----------|-------------------------------|-------------|--------|
| SC1 | Skill exists at path with dual-mode frontmatter | file + frontmatter | `test -f plugins/lz-tdd/skills/lz-refactor/SKILL.md`; parse YAML: `name == "lz-refactor"` (== dir), `description` non-empty; assert `disable-model-invocation` absent AND `user-invocable` absent (dual-mode by default) | W0 | [green] |
| SC1 | `/lz-tdd:lz-refactor` resolves | structural | `claude plugin validate .` exit 0 | tool | [green] |
| SC2 | Lean router < 500 lines | line count | `wc -l SKILL.md` < 500 (target ~90-150) | W0 | [green] |
| SC2 | Five task-area groups present | grep | assert 5 `##` section pointers (one per D-03 group) | W0 | [green] |
| SC2 | Every references/ pointer resolves | filesystem | extract `](references/...)` targets from SKILL.md; assert each path exists (NOT covered by `claude plugin validate` -- Pitfall 1) | W0 | [green] |
| SC3 | Description within char cap | length | combined `description` length <= 1,536; target ~750 | W0 | [green] |
| SC3 | Description carries dual-mode + seam + near-miss | grep structure | assert a "should be used" clause, a "Do not use"/near-miss clause, and an lz-tpp-seam mention (D-08); empirical recall/specificity deferred to Phase 11 | W0 | [green] |
| SC4 | Heavy material bundled, not inlined | structure | assert no catalog content in SKILL.md; `test -d references/fowler-catalog` and `test -d references/kerievsky-catalog` | W0 | [green] |
| SC4 | No single file forces whole catalog | index thinness | catalog entry-point files are thin indexes (names/pointers), not full-content dumps (leaves are stubs in Phase 6 -> naturally satisfied) | W0 | [green] |
| all | First-party review PASS | agents | plugin-validator + skill-reviewer PASS | tool | [green] |

*Status legend: [pending] not run - [green] pass - [red] fail - [flaky] intermittent*

---

## Wave 0 Requirements

- [ ] One throwaway verification checker (bash `.sh` or node `.mjs`) that runs the SC1-SC4 assertions: file exists, frontmatter keys (`name`==dir, description present, dual-mode-by-omission), `wc -l` < 500, five `##` pointers present, every `](references/...)` target resolves on disk, description length <= cap. Keep it a single checker, not a framework.
- [ ] No framework install needed -- `claude` CLI already on PATH.

*This checker is the only new "test infra". Do not add a test runner or dependency.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Trigger recall / specificity of the `description` | SKEL-03 | Requires the native eval harness; explicitly deferred | Deferred to Phase 11 (EVL-01). Phase 6 authors a well-structured first draft only. |

*All structural/authorable behaviors have automated (shell/filesystem) verification. Empirical trigger quality is the only deferred item.*

---

## Validation Audit 2026-07-04

| Metric | Count |
|--------|-------|
| Requirements (SKEL-01..04 / SC1-SC4) | 4 |
| COVERED (automated) | 4 |
| PARTIAL | 0 |
| MISSING | 0 |
| Gaps found | 0 |

All four success criteria are covered by the Wave-0 checker
(`.claude/skills/lz-refactor-workspace/tools/verify-scaffold.mjs`, 11 assertions,
exit 0) plus `claude plugin validate .` (exit 0). Both were re-run independently by
gsd-verifier. No gaps to fill; no new test files generated.

**Known non-blocking checker improvements (from 06-REVIEW.md, tracked -- not coverage gaps):**
- WR-01: line-count assertion counts the trailing-newline segment (reports 70 for a
  69-line file), making the effective cap 498 not 500. Nil impact at 69 lines.
- WR-02: the "exactly 5 references" assertion checks distinct-path cardinality +
  resolution, not identity -- a pointer rewired to a wrong-but-existing file would pass.
  Correct for Phase 6 (pointers verified right); harden before Phase 7 extends the checker.

The one deferred item is empirical trigger recall/specificity of the `description`,
which requires the native eval harness -> Phase 11 (EVL-01). It is listed under
Manual-Only above and does not affect Nyquist compliance for this scaffold phase.

---

## Validation Sign-Off

- [x] All tasks have an automated verify (shell/filesystem assertion) or a Wave 0 dependency
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers the SC1-SC4 checker
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter (post-execution, by gsd-validate-phase)

**Approval:** verified 2026-07-04
