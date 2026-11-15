---
phase: quick-261115-qax
plan: 01
subsystem: lz-red references
tags: [provenance, clean-code, attribution, dst-04]
requires: []
provides: [scoped Clean Code Ch. 9 attributions in lz-red references]
affects: [plugins/lz-tdd/skills/lz-red/references]
tech-stack:
  added: []
  patterns: [inline `(lz-red's own reasoning, no-oracle)` / `(lz-red's own addition, no-oracle)` labels]
key-files:
  created: []
  modified:
    - plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
    - plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md
    - plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md
decisions:
  - "principle-backing.md checked, no change needed: its rows name rules and sources, not the rationales changed here"
metrics:
  completed: 2026-11-15
  tasks: 3
  files: 3
status: complete
---

# Quick 261115-qax Plan 01: Fix Clean Code misattributions in lz-red Summary

Martin-tagged claims in three lz-red references now cover only what Clean Code Ch. 9 states; the diagnosis payoff,
the run-and-watch step, failure localization and the clock/leftover-data examples carry lz-red's own no-oracle
labels, and one-concept-per-test gained the few-asserts nuance.

## Changes (items 1-7)

1. three-laws: "Take one small step" -- immediate-diagnosis sentence split into a `(lz-red's own reasoning, no-oracle)` bullet.
2. three-laws: Law 2 attributed text ends at "then stop"; the run-and-watch sentence follows, labelled `(lz-red's own addition, no-oracle)`.
3. test-structure: Martin rationale for one concept per test is now reader comprehension; failure localization moved to an lz-red-labelled bullet; Rule no longer credits a reason.
4. test-structure Sources: Clean Code bullet credits one concept per test (readability rationale, few-asserts nuance) and F.I.R.S.T.; single-reason-to-fail credit removed.
5. test-structure F.I.R.S.T.: Repeatable = same verdict in any environment, even with no network; clock/leftover-data sentence labelled lz-red's addition.
6. test-structure Rule: a few asserts on one concept are fine; one assert per test is a guideline; split by concept.
7. vitest-typescript-mechanics Sources: added Clean Code Ch. 9 bullet for build-failure-as-legitimate-red.

Top blockquotes and three-laws Sources left as they were: they credit Martin with the sizing rule and the
one-concept rationale, which still hold. principle-backing.md checked, no change needed.

Not changed (outside the plan's items): the F.I.R.S.T. Martin-tagged distilled rationale still says independent and
repeatable tests make a red name a real defect; flagged for the oracle-reviewer gate to judge.

## Checks

- `npm --prefix .claude/skills/lz-red-workspace run check`: exit 0
- `claude plugin validate . --strict`: exit 0
- ASCII scan of the three files: exit 1 (no non-ASCII)
- Email allowlist-inversion scan: no email-shaped tokens; `git config user.email` and commit author/committer are the approved gmail
- Plan negative checks ("stop and watch it fail", "reason to fail"): no hits

## Commit

- a9f1fe3: docs(lz-red): scope Clean Code attributions to what Ch. 9 states

## Deviations from Plan

None - plan executed exactly as written.

## Self-Check: PASSED

## Round 2 (oracle-reviewer fixes)

Commit 2a6f8f4: docs(lz-red): narrow Clean Code to compile failure and retag scope notes

- A1 three-laws "Take one small step": the sizing-vs-handoff sentences moved out of the Martin-tagged bullet into a
  `(lz-red's own reasoning, no-oracle)` "Scope of the rule" bullet.
- A2 three-laws Law 2: the scope note is labelled lz-red's own reasoning; "Both are owned" replaced by naming the
  sources principle-backing.md credits for fail-for-the-right-reason (Fowler, Refactoring 2nd Ed. Ch. 4; Beck, TDD is
  Kanban for Code), stated as not Clean Code.
- B3 vitest-typescript-mechanics: divergence sentence and Sources bullet now say compile failure (code that does not
  compile) counts as failing.
- C4 principle-backing.md: retag paragraph (two lines), the Clean Code bullet and the "Clean Code and Beck disagree"
  sentence narrowed to compile failure; the disagreement stays coherent (Martin counts it as failing, Beck clears it
  first). No guidance changed. No other "build failure" credits remain under plugins/lz-tdd/skills/lz-red.

Checks: lz-red battery exit 0; `claude plugin validate . --strict` exit 0; ASCII scan exit 1 (clean); email scan exit 1
(no tokens); commit author and committer are the approved gmail.
