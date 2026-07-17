---
quick_id: 260717-ohn
mode: quick-full
type: execute
branch: gsd/lz-tdd-0.0.2-lz-refactor
task_count: 13
commits: 13
status: complete
completed: 2026-07-17
---

# Quick 260717-ohn: Fix lz-refactor eval-harness code-review findings -- Summary

Fixed 13 pre-triaged code-review findings in the lz-refactor eval harness (internal `.mjs`
tooling under `.claude/skills/lz-refactor-workspace/`) as 13 atomic, bisect-safe commits. Each
commit leaves the checker(s) it touches GREEN. No shipped skill touched; no metered `claude -p`
run; zero spend (only local `node` invocations and offline `tsc`).

## Commits (one per fix, in plan order)

| # | Hash | Subject | Per-fix verify |
|---|------|---------|----------------|
| 1 | `0131a18` | refactor(lz-refactor): share sectionBody helper; scope check-catalog Example fence test | check-catalog/gof/extra-patterns/functional all exit 0; `node --check` section-body.mjs OK |
| 2 | `aa86fab` | fix(lz-refactor): exact ## Example heading match in check-gof and check-extra-patterns | check-gof + check-extra-patterns exit 0 |
| 3 | `4d746b5` | fix(lz-refactor): broaden check-kerievsky README-row link regex (./ prefix, #anchor) | check-kerievsky exit 0 |
| 4 | `71c8b1d` | fix(lz-refactor): enforce per-smell recognize-by co-occurrence in check-smells | check-smells exit 0 (co-occurrence PASS); scratchpad negative-test confirmed the gate FAILS when a linked row loses its cue |
| 5 | `70469c8` | docs(lz-refactor): correct check-crossrefs self-link header and github-slug whitespace comment | check-crossrefs exit 0; `node --check` github-slug.mjs OK (comment-only, no behavior change) |
| 6 | `c5db22a` | fix(lz-refactor): grade-reference refuses aggregate on a zero-run question | grade-reference `--selfcheck` exit 0; `node --check` OK |
| 7 | `a72b9c2` | fix(lz-refactor): enumerate eval-status config dirs from disk | `node --check` OK; scratchpad fixture confirmed `invoke_skill`/`no_skill` now enumerated (previously hidden by the hardcoded pair) |
| 8 | `d2cc2fe` | fix(lz-refactor): extract-samples accepts CommonMark-indented code fences | `node --check` OK; offline tsc harness exit 0 (259 modules `--strict` clean, 0 skipped) |
| 9 | `fe0fa51` | fix(lz-refactor): prep-ws bundles only exit-0 drove-runs | `node --check` OK (one-shot prep script; not re-run against live data) |
| 10 | `faee2b3` | fix(lz-refactor): tabulate-mechanical excludes non-zero-exit runs from drove/lift | `node --check` OK; scratchpad replication confirmed non-zero-exit runs excluded from drove/lift/union/Pass and `nClean===0` yields `'0.0'` not NaN, cost/turns still over all runs |
| 11 | `7d473ef` | fix(lz-refactor): selfcheck-code-review skips crux-3 when the gitignored transcript is absent | selfcheck exit 0 (transcript present); ENOENT SKIP branch verified exit 0 by temporary rename-test-restore of the gitignored transcript |
| 12 | `735727f` | fix(lz-refactor): run-e2e apply mode refuses to orphan HEAD commits on reset | `node --check` OK; selfcheck exit 0 (buildSyntheticBase path unaffected) |
| 13 | `dfe56f8` | fix(lz-refactor): process-unique synthetic branch name in run-e2e buildSyntheticBase | `node --check` OK; selfcheck exit 0 (both crux-2 synthetic-branch build/teardown pass; name still matches the `review-*` glob) |

## Final gate (full offline battery, after all 13 commits)

All 12 members exit 0 at HEAD (`dfe56f8`):

```
check-backing        exit 0     check-kerievsky              exit 0
check-catalog        exit 0     check-principles             exit 0
check-crossrefs      exit 0     check-smells                 exit 0
check-extra-patterns exit 0     e2e-nx/selfcheck-code-review exit 0
check-functional     exit 0     check-evals                  exit 0
check-gof            exit 0
check-hygiene        exit 0
```

Additionally `grade-reference --selfcheck` exits 0 (Task 6). Working tree clean apart from the
untracked planning docs dir; all changed files ASCII-only; no email-shaped tokens introduced in
any changed file; maintainer identity is the public gmail.

## Deviations from plan

Plan executed as written (no Rule 1-4 deviations). Two checker advisories handled:

1. **Advisory 2 (Task 1 -- tighten check-catalog `## Example` presence check):** Applied in the
   same commit as FIX 1. Tightened the loose `^##\s+Example\b` presence check to exact
   `^##\s+Example\s*$` so it agrees with the `sectionBody` match. check-catalog stayed GREEN
   (all 62 Fowler Example headings are exact).

2. **Advisory 1 (Task 10 -- exercise tabulate data logic):** Running the actual
   `tabulate-mechanical.mjs` against a scratchpad fixture is impractical -- it reads repo-internal
   hardcoded paths (`HERE/<suite>/results/apply`) that must not be created in the repo, and it
   imports `grade-run.mjs`. Instead, the exact per-cell math was replicated in a scratchpad
   script with hand-authored run objects (one exit!=0 + one clean; and an all-crashed cell). This
   confirmed: (a) non-zero-exit runs excluded from drove/lift/union/Pass, (b) `nClean===0` yields
   `'0.0'` not NaN and Pass@1 does not crash, (c) cost/turns aggregate over all runs regardless of
   exit. Result recorded above.

## No gate weakened

- check-catalog/gof/extra Example fence scoping and check-smells recognize-by co-occurrence are
  STRICTER (verified: co-occurrence negative-test fails on a missing cue).
- grade-reference now REFUSES a zero-run question; prep-ws/tabulate now EXCLUDE failed runs;
  run-e2e apply now REFUSES to orphan commits.
- check-kerievsky link regex and extract-samples fence regex are BROADER (accept previously-missed
  valid forms), not looser gates.

## Self-Check: PASSED

- Shared module created: `.claude/skills/lz-refactor-workspace/tools/lib/section-body.mjs` (FOUND).
- All 13 commit hashes present in `git log` (FOUND).
- Full offline battery exits 0 at HEAD (12/12).
