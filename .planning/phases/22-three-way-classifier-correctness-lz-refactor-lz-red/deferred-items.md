# Phase 22 -- deferred items (out-of-scope discoveries)

## From plan 22-02

### selfcheck-red.mjs crux 7 `canary-rdxf-red` cannot run in a fresh worktree -- RESOLVED, NOT DEFERRED

**RESOLUTION (orchestrator, post-merge, 2026-08-03).** There is nothing to defer. `node
selfcheck-red.mjs` exits **0** in the main working tree at merge commit `1d4673f`, with every crux
passing including crux 7 and crux 9. The entry is retained as history because the observation was
real in the worktree, but the item is CLOSED and needs no `npm install` and no follow-up.

Two corrections to the diagnosis below, both material:

- Evidence point 3 is **FALSE as written**. The main repo working copy DOES have
  `.claude/skills/lz-red-workspace/node_modules/angular-typechecker` present. Measured directly.
- The actual mechanism is narrower than "absent in every fresh checkout": a git worktree does not
  carry gitignored files, so the dependency was missing in the WORKTREE only. That is why the
  failure did not reproduce after merge.

The conclusion the executor drew -- that the failure was not caused by its edits -- was correct, and
it rests on independent evidence (points 1, 2 and 4 all hold). Only the stated reasoning in point 3
was wrong. Recording this because a spurious deferred item costs a future reader a real
investigation, and because "it fails in my worktree" must never be generalized to the repo without
measuring the repo.

**Found during:** plan 22-02 Task 2 verification (running `node selfcheck-red.mjs` as a
no-regression check after widening `check-evals.mjs` clause 8).

**Observed:** the script exits 1 at
`[crux 7:canary-rdxf-red] gradeRun threw instead of producing a verdict: grade-red: cannot resolve
the angular-typechecker package, so the atc differential cannot run (fail closed): Cannot find
module 'angular-typechecker/package.json'`.

**Diagnosis -- PRE-EXISTING environment condition, NOT caused by plan 22-02.** Four independent
pieces of evidence:

1. `selfcheck-red.mjs` is BYTE-UNCHANGED since the fork base (`git diff --stat` empty), as D-22
   requires. Same for `tools/check-red-references.mjs`.
2. `selfcheck-red.mjs` contains no reference to `check-evals` at all, so the file this plan widened
   is not on its code path (`git grep -F check-evals` returns nothing).
3. `angular-typechecker` is a TRACKED, pinned dependency of the workspace
   (`.claude/skills/lz-red-workspace/package.json:11` -> `"angular-typechecker": "0.2.4"`), and
   `node_modules/` is gitignored, so it is absent in a freshly created git worktree.
   (CORRECTED -- see the RESOLUTION block above. The original wording claimed it was also absent
   from the main repo working copy. It is not: the main copy has it, which is exactly why the whole
   run goes GREEN after merge.)
4. The tool's own error text documents this exact case: "This workspace's node_modules is gitignored
   while its package.json and package-lock.json are tracked, so a fresh worktree needs `npm install`
   in ...lz-red-workspace before the atc checker path works." The condition was anticipated by the
   author; it is the expected fresh-worktree state, not a defect.

Every crux that does not depend on that package PASSED in the same run: cruxes 1+2 (composition and
byte-identical prompt parity across 3 RED suites / 6 prompts x 2 modes, plus the D-12 arm proof and
the 13-token state-claim ban), 3, 4, 5, 10, and the crux-7 canaries for GRC / SRVC / RXF.

**Deliberately NOT fixed here.** Two reasons:

- Out of scope. Plan 22-02 touches `check-hygiene.mjs`, `check-evals.mjs`, `.gitignore` and
  `REQUIREMENTS.md`. The failing canary is `grade-red.mjs`'s Angular differential path, which none
  of those four files reach.
- Running a package-manager install is excluded from the executor's auto-fix rules. It would also
  create a large untracked `node_modules/` tree in a worktree the orchestrator force-removes on
  return, so the effect would not survive the merge anyway.

**To resolve:** nothing to do. Superseded by the RESOLUTION block at the top of this entry -- the
main working tree already has the dependency and the full run exits 0 post-merge. No `npm install`
is required. Anyone hitting this again inside a throwaway worktree can either ignore it or run
`npm install` in `.claude/skills/lz-red-workspace` (lockfile tracked and pinned, so it restores a
committed dependency set rather than resolving anything new).

**Effect on plan 22-02 acceptance:** clean. The D-22 obligation that actually matters --
`selfcheck-red.mjs` stays byte-unchanged -- is satisfied and independently proven against the fork
base. The plan's softer "`node selfcheck-red.mjs` exits 0" line is ALSO satisfied, measured in the
main tree post-merge. The executor was right to refuse to claim a pass it had not observed; the
orchestrator then observed it.
