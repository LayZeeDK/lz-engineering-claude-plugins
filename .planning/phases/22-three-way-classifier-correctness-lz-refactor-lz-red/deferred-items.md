# Phase 22 -- deferred items (out-of-scope discoveries)

## From plan 22-02

### selfcheck-red.mjs crux 7 `canary-rdxf-red` cannot run in a fresh worktree

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
   `node_modules/` is gitignored, so it is absent in every fresh checkout -- including the main
   repo working copy, which also has no `node_modules/`.
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

**To resolve (whoever needs the atc path):** run `npm install` inside
`.claude/skills/lz-red-workspace` from a persistent checkout -- the lockfile is tracked and pinned,
so this restores a committed dependency set rather than resolving anything new -- then re-run
`node .claude/skills/lz-red-workspace/selfcheck-red.mjs`.

**Effect on plan 22-02 acceptance:** the D-22 obligation that actually matters -- `selfcheck-red.mjs`
stays byte-unchanged -- is satisfied and independently proven. The plan's softer
"`node selfcheck-red.mjs` exits 0" line is recorded as ENVIRONMENT-BLOCKED rather than claimed as a
pass, because it did not exit 0 in this worktree.
