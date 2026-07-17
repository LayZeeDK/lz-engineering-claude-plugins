---
quick_id: 260716-lq9
slug: extend-lz-refactor-drive-to-fixpoint-to-
description: Extend lz-refactor drive-to-fixpoint from package/directory scope to single-target apply
date: 2026-07-16
status: complete
outcome: null-not-shipped
commit: docs-only (no SKILL.md change shipped)
---

# Quick Task 260716-lq9 -- SUMMARY

## Outcome: NULL lift, edit NOT shipped

Extended the lz-refactor `Driving to a fixpoint` discipline in SKILL.md from package/directory scope to
single-target apply (after the requested refactoring lands green on a single target, complete the
warranted follow-ons it EXPOSES -- e.g. a residual loop -> map/pipeline -- rather than deferring;
explicitly "does not go hunting unrelated smells elsewhere", so no open-ended sweep on a narrow apply).
The held-out validation eval showed **no idiom_pattern lift and no regression**, so per the pre-set rule
the edit was reverted and nothing was committed to the skill.

## What was done

1. **Edit designed + applied (uncommitted):** two prose loci in `plugins/lz-tdd/skills/lz-refactor/SKILL.md`
   -- the COMMAND branch of "Coach by default; drive when asked" now keeps driving newly-exposed follow-ons
   to a fixpoint; the section renamed `Whole-package / directory sweeps` -> `Driving to a fixpoint` and
   broadened to cover single-target apply. ALL existing guards preserved (step-4 APPLY/DECLINE, step-5
   blast-radius pause, verify-between-rounds, "do not churn", stop-at-fixpoint-not-zero-smells).
2. **Review gate PASSED:** 3 subagent reviews (2 unbiased from-scratch + 1 primed). One unbiased reviewer
   flagged a scope-widening risk on narrow `apply it`/`do it` commands; tightened the wording to "completes
   the change you were asked to make, does not go hunting unrelated smells" and re-reviewed (final unbiased
   PASS, no fixes). Deterministic gates all green: `npm run check` (all catalog checkers), `npm run typecheck`
   (251 modules tsc --strict), `claude plugin validate .` -- exit 0.
3. **Held-out validation eval (user-approved metered spend):** held-out target `getTypesOfSchema`
   (angular-cli @angular-devkit/core, NOT the k=5 trained-on targets); invoke_skill apply k=3, EDITED vs
   PREEDIT (SKILL.md toggled between the edit and HEAD; `--plugin-dir` reads the working tree). 6 runs, all
   exit 0, $4.57. Two independent BLIND judges (condition hidden) both scored EDITED idiom 0/3 = PREEDIT
   idiom 0/3, with behavior/over_under/incrementality/quality 3/3 in both conditions. See
   `.claude/skills/lz-refactor-workspace/e2e-angular/heldout/RESULTS.md`.

## Why null (root cause)

The model does not recognize these accumulation/union loops as warranted pipeline follow-ons in the first
place (its Loops lens anchors on index/`for` loops, not accumulation into a Set), so the drive-to-fixpoint
instruction has nothing to act on. Both conditions extracted helpers but relocated the loops as loops.
This is a **model recall/judgment ceiling, not a skill-prose gap** -- the same conclusion as the 2026-07-15
groupby-loop / groupby-detection-variants tasks. The output-warrant axis is now null across a FOURTH
independent probe (L1 net-cost + reference-lookup + Phase-13 applied-output + this held-out apply).

## Decision + state

- **SKILL.md: reverted to HEAD, unchanged.** Nothing shipped to the skill; no `/reload-plugins` needed.
- The edit was reviewer-clean and regression-free; it is a sensible generalization but delivered no
  measured value, so it is not shipped (honors the pre-set "else revert + report null" rule and YAGNI).
  It remains reconstructable from this task's PLAN + RESULTS if the maintainer ever wants it on merit.
- **Repos restored pristine:** angular-cli back on 22.0.x @ 5584a589a, clean; throwaway branch deleted.
- Eval record committed under the workspace (suite config + meta/diff; raw transcripts gitignored).

## Next

queued-1 (this task) is resolved as null. The inherited milestone-close items remain:
`/gsd-audit-milestone lz-tdd@0.0.2` then `/gsd-complete-milestone lz-tdd@0.0.2`.
