---
phase: quick-261107-ft7
plan: 01
subsystem: lz-tdd plugin (lz-refactor, lz-red) + lz-red-workspace checker
tags: [lz-refactor, lz-red, packaging, links, checker]
status: complete
requires: []
provides:
  - lz-refactor step-3 open-the-leaf sub-bullet
  - packaging-safe links in plugins/lz-tdd
  - lz-red Sources cross-link to refactoring-without-tests.md
  - check-red-references N2 LEAVES PACKAGE leg
affects: [packaged claude -p evals of lz-tdd]
tech-stack:
  added: []
  patterns: ["N2 link gate checks each resolved relative target against its plugin root"]
key-files:
  created: []
  modified:
    - plugins/lz-tdd/skills/lz-refactor/SKILL.md
    - plugins/lz-tdd/README.md
    - plugins/lz-tdd/skills/lz-refactor/references/functional-catalog/README.md
    - plugins/lz-tdd/skills/lz-red/SKILL.md
    - .claude/skills/lz-red-workspace/tools/check-red-references.mjs
decisions:
  - "N2 escape test uses `rel === '..' || rel.startsWith('..' + path.sep) || isAbsolute(rel)` instead of a bare startsWith('..'), so a file named like `..x.md` at the plugin root is not misread as escaping"
  - "Task 2 a+b was committed with edit c temporarily backed out of the working tree, so the checkers ran on exactly the committed a+b state (bisect-safe), then c was re-applied and committed alone"
metrics:
  duration: ~10 min
  completed: 2026-11-07
  tasks: 3
  files: 5
---

# Phase quick-261107-ft7 Plan 01: lz-tdd reference-depth and packaging-link fixes Summary

lz-refactor step 3 now tells Claude to open the candidate leaf in full (the A/B-measured text), the two
links that broke in a packaged lz-tdd are replaced by an https README link and a pinned permalink, lz-red
Sources links lz-refactor's seam leaf, and check-red-references N2 now fails any relative link that leaves
its plugin root (proven RED on README.md:3, GREEN on the fixed tree).

## Commits

| Task | Commit | Subject |
|------|--------|---------|
| 1 | f387ced | docs(lz-refactor): open the candidate leaf in full before step 4 |
| 2a+b | 6758d47 | fix(lz-tdd): resolve links that break when the plugin is packaged |
| 2c | dafaa0a | docs(lz-red): link lz-refactor's seam techniques from Sources |
| 3 | 9783765 | test(lz-red-workspace): fail relative links that leave the plugin package |

All four: author and committer `larsbrinknielsen@gmail.com` (measured with `git log --format='%ae %ce'`).

## Checker exit codes (measured)

Run with `node <absolute path>` over the 14 checkers globbed from both workspaces (set unchanged from the
planner's list). Baseline at HEAD 00ea35d (code-identical to 4ad31e8; 00ea35d adds only the plan file).

| Checker | Baseline | After T1 | After T2a+b | After T2c | After T3 |
|---------|----------|----------|-------------|-----------|----------|
| check-backing.mjs | 0 | 0 | 0 | 0 | 0 |
| check-catalog.mjs | 0 | 0 | 0 | 0 | 0 |
| check-crossrefs.mjs | 0 | 0 | 0 | 0 | 0 |
| check-extra-patterns.mjs | 0 | 0 | 0 | 0 | 0 |
| check-functional.mjs | 0 | 0 | 0 (C8 PASS) | 0 | 0 |
| check-gof.mjs | 0 | 0 | 0 | 0 | 0 |
| check-hygiene.mjs | 0 | 0 | 0 | 0 | 0 |
| check-kerievsky.mjs | 0 | 0 | 0 | 0 | 0 |
| check-principles.mjs | 0 | 0 | 0 | 0 | 0 |
| check-smells.mjs | 0 | 0 | 0 | 0 | 0 |
| check-red-references.mjs | 0 | 0 | 0 | 0 | 0 |
| check-rgr-routing.evasions.mjs | 0 | 0 | 0 | 0 | 0 |
| check-rgr-routing.mjs | 0 | 0 | 0 | 0 | 0 |
| check-rgr-routing.selftest.mjs | 0 | 0 | 0 | 0 | 0 |

No pre-existing checker failures.

## Task 3 discrimination proof (measured)

1. `git show 4ad31e8:plugins/lz-tdd/README.md > plugins/lz-tdd/README.md`, then check-red-references:
   exit 1, with
   `[FAIL] [lc9] every relative markdown link in the shipped tree resolves inside its plugin package -- 1 unresolved: plugins\lz-tdd\README.md:3 -> ../../README.md LEAVES PACKAGE`
   Only the new leg fired: `../../README.md` exists in the repo, so the old existsSync-only gate passed it.
2. `git checkout -- plugins/lz-tdd/README.md`; `git status --short plugins/lz-tdd/README.md` printed nothing.
3. Re-run: exit 0, `[PASS] [lc9] every relative markdown link in the shipped tree resolves inside its plugin package`.

The comment's remaining zeroes were re-measured before keeping them (scratch script over plugins/**/*.md):
absolute 0, reference-style definitions 0 (cross-checked with rg; the bracket-prefix positive control
matched), links in code fences 0; scheme links 2 (the two new https links, so that zero was dropped).

## Overall verification

- `claude plugin validate plugins/lz-tdd`: exit 0 ("Validation passed"). It also prints a non-verdict
  plugin-directory problem README_TRIVIAL (README has 23 words, 40 needed) and an ICON_MISSING warning.
  The README was already this short before this task, and its wording is out of scope per the plan.
- Packaged-link scan (`git archive HEAD:plugins/lz-tdd` into a new empty scratch dir, then pkg-links.mjs):
  - Before (00ea35d), 2 problems:
    ```
    OUTSIDE README.md:3 -> ../../README.md
    REPO-PATH skills\lz-refactor\references\functional-catalog\README.md:175: - `.planning/research/functional-depatterning-ts.md` Sections 10-13: the LOCKED design source of
    194 markdown files, 2 problems
    ```
  - After (9783765), full output: `194 markdown files, 0 problems` (the scanner now ignores https URLs).
- Allowlist-inversion: the email regex over the five changed files printed nothing; over all commit
  messages 4ad31e8..HEAD printed nothing; positive control on plugin.json printed only
  `larsbrinknielsen@gmail.com`. All commit identities are that address.
- `git status --short` is clean after the last commit (.planning/config.json is not modified in this
  worktree).

## Deviations from Plan

**1. [Rule 1 - Bug] Tighter escape test in the N2 leg**
- Found during: Task 3
- Issue: the plan's `startsWith("..")` would flag a target named `..something.md` that sits inside the
  plugin root.
- Fix: `insidePackage === ".." || insidePackage.startsWith(`..${path.sep}`) || path.isAbsolute(insidePackage)`.
- Commit: 9783765

**2. Bisect-safe ordering in Task 2**
- Edit c was backed out of the working tree before the a+b checker run and commit, then re-applied, so
  the checkers measured exactly the committed a+b state. No content change.

The functional-catalog README had only one Sources bullet, so "leave the other Sources bullets untouched"
had nothing to apply to.

## Known Stubs

None.

## Self-Check: PASSED

- All five modified files exist; commits f387ced, 6758d47, dafaa0a, 9783765 are on
  worktree-agent-a4cf054ca12a56790 (`git log 4ad31e8..HEAD`).

## Orchestrator gates after execution (2026-11-07)

- Merged the executor worktree (f96840c). Re-ran all 14 checkers (exit 0), the packaged-link scan on
  `git archive HEAD:plugins/lz-tdd` (194 files, 0 problems), and the email allowlist (no token in the diff).
- Review of both SKILL.md edits: one neutral reviewer (diff only) and one primed reviewer (told the
  rationale). No blocker. Both objected to the lz-red Sources link (a reference-list link with no
  instruction for when to open it does not get read; it also looked like a fourth testing-stance leaf)
  and to the unmeasured walkthrough sentence (invites over-reading before a possible DECLINE).
- Resolution: 7b27f09 names the Kerievsky leaf, adds a fallback for paths that do not exist, and drops
  the walkthrough sentence (all three leaves already link their walkthroughs, verified); d02204d reverts
  dafaa0a. Declined: moving the bullet out of the routing list (that form measured 8/8), dropping
  `smells/` and `functional-catalog` from the pattern (runs used the functional leaf productively).
  Two primed-reviewer claims were false on checking: only one leaf links its walkthrough (all three
  do) and return-modified-value is missing from the Fowler README (it is at README.md:92).
- Scoped review of 7b27f09: cosmetic only (two optional wordings), so the round stopped.
- Packaged slim `claude -p` (Opus 5.5, offline, --rules none) on the landed text: candidate leaf opened
  3/3 at f96840c and 3/3 at d02204d (the Kerievsky explain prompt reached the walkthrough through the
  leaf's own link). Total with the earlier arm B: 11/11. Two runs hit a refused `ls` under the offline
  allow list and recovered with Read (harness artifact).
