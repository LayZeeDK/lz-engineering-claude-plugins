---
phase: quick-260801-sc9
plan: 01
subsystem: lz-red eval instrument
tags: [d-12, test-double-taxonomy, ab-arm, treatment-plugin, run-gate, g17]
status: complete
requires:
  - .planning/research/test-double-taxonomy.md
  - plugins/lz-tdd (read-only, as the A/B baseline arm)
provides:
  - a tracked distilled test-double artifact outside the shipped tree
  - a one-command reproducible treatment plugin tree
  - the invoke_treatment A/B arm
  - the D-12 run gate record
affects:
  - .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs
  - .planning/REQUIREMENTS.md (FUT-TAXONOMY-SHARED)
tech-stack:
  added: []
  patterns: [--plugin-dir arm toggle, generated-tree-from-tracked-inputs, fail-closed build assertions]
key-files:
  created:
    - .claude/skills/lz-red-workspace/treatment/test-double-taxonomy.md
    - .claude/skills/lz-red-workspace/treatment/build-treatment.mjs
    - .planning/quick/260801-sc9-complete-distinguish-but-prove-it-first-/260801-sc9-RUN-GATE.md
  modified:
    - .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs
    - .planning/REQUIREMENTS.md
decisions:
  - Generated the treatment tree at out/lz-tdd-treatment rather than committing an 837K duplicate.
  - Kept invoke_treatment out of the both/all fan-outs so crux 6's --arm all dry run is unchanged.
  - Dropped every Gang of Four row from the distillation rather than paraphrasing canonical Intents again.
  - Restored the workspace's pinned devDependencies so the selfcheck could actually be run rather than skipped.
metrics:
  duration: ~75 min
  completed: 2026-08-01
  tasks: 3
  commits: 3
---

# Quick Task 260801-sc9: Complete "distinguish, but prove it first" Summary

Steps 1 and 2 of D-12 are built and the halt is recorded: a distilled test-double artifact tracked
outside the shipped tree, a one-command reproducible treatment plugin tree, an `invoke_treatment` A/B
arm whose baseline is `invoke_skill`, and a RUN-GATE naming the two gates that remain. Zero spend.

## What was built

| Task | Deliverable | Commit |
|------|-------------|--------|
| 1 | `treatment/test-double-taxonomy.md`, 100 lines, tracked, outside `plugins/` | `087e6d1` |
| 2 | `treatment/build-treatment.mjs` + the `invoke_treatment` arm in `run-e2e.mjs` | `344738a` |
| 3 | `260801-sc9-RUN-GATE.md` + the `FUT-TAXONOMY-SHARED` G17 correction | `8d88387` |

## Verification actually observed

Every figure below is from a command run in this worktree, gated on the EXIT CODE where the plan
required it.

- **Reference battery**: exit 0 at baseline and after each of the three tasks, four runs in total,
  with the roster line reading `123 checks` on every one. Both legs were checked separately, exit
  code first, because the roster line is emitted independently of accumulated failures.
- **`selfcheck-red.mjs`**: exit 0, gated on the process status. Crux 6 -- the tripwire for the
  `composePrompt` edit -- ran and passed on both of its legs: `nx regression OK (default lz-refactor
  suite still composes 3 arms with plugins/lz-tdd)` and `lz-refactor apply preamble unchanged OK`.
  Cruxes 1 and 2 also passed, confirming `with_skill` and `invoke_skill` still resolve to
  `plugins/lz-tdd` for every suite, prompt and mode.
- **`plugins/` untouched**: `git diff --quiet HEAD -- plugins/` exit 0 AND `git status --porcelain
  plugins/` empty, asserted after every task and again at the end. Guard N3 re-checked directly with
  `find plugins -name 'test-double-taxonomy*'` -- no match.
- **Generated tree invisible**: `git check-ignore -q out/lz-tdd-treatment` exit 0 and `git status
  --porcelain out` empty.
- **New arm**: dry run composes `--plugin-dir <...>/out/lz-tdd-treatment` plus the forced
  `/lz-tdd:lz-red ` slash command. `--arm all` still prints `arms: with_skill, no_skill,
  invoke_skill`, verified with a positive control so a crashed fan-out cannot pass as an absence.
- **Hygiene**: ASCII-only and allowlist-inversion (zero email-shaped tokens) on every file authored
  or edited. Committer identity is the public contact.

### Fail-closed behaviour was observed, not asserted

The build script's guards were exercised by running **byte-identical script bytes** (`cmp` exit 0)
from a relocated repo root against poisoned fixtures, so `plugins/` was never involved:

| Fixture | Expected | Observed |
|---------|----------|----------|
| one anchor, `name: lz-tdd` | exit 0 | exit 0, two deltas |
| duplicated anchor | exit 1 | exit 1, "anchor count is 2" |
| missing anchor | exit 1 | exit 1, "anchor count is 0" |
| `name: lz-tdd-treatment` | exit 1 | exit 1, plugin-identity message |

**One guard was NOT observed firing and is recorded as unexercised rather than proven**: the
destination assertion (inside `REPO_ROOT`, last two segments `out` / `lz-tdd-treatment`). Because the
destination is a hardcoded constant, its segments cannot drift without editing the script, so there
is no input that reaches the guard. It is defence-in-depth against a future edit.

## Re-derived figures (Task 3b)

RESEARCH said 9 and the plan checker said 10. I did not copy either. Measuring myself, mirroring
G17's needle and both allowlist forms from `check-red-references.mjs:565-567` against
`.planning/research/test-double-taxonomy.md` at commit `4f0da5e`:

| Figure | Unit | Value |
|--------|------|-------|
| total hits of the four inflections | OCCURRENCES | 34 |
| bare (unexcused) hits | OCCURRENCES | 31, spread over 29 unique lines |
| formal catalog names `Test Stub` + `Temporary Test Stub` | OCCURRENCES | 10 |
| the same catalog names | UNIQUE LINES | 9 |

**The disagreement was a unit difference, and both prior counts were right.** 9 is unique lines, 10
is occurrences; line 367 carries two hits, which is the whole gap. Confirmed by eye against the nine
matching lines (167, 170, 223, 229, 361, 365, 366, 367, 584). The catalog set was matched
case-sensitively with `Temporary Test Stub` deduplicated from `Test Stub`'s substring hits, since the
longer name contains the shorter.

## Deviations from plan

**1. [Rule 3 - Blocking] Restored the workspace's pinned devDependencies so the selfcheck could run**

- **Found during:** Task 2 verification.
- **Issue:** The first `selfcheck-red.mjs` run **failed, exit 1**, at `[crux 7:canary-rdxf-red]`:
  `Cannot find module 'angular-typechecker/package.json'`. This worktree had no
  `.claude/skills/lz-red-workspace/node_modules` -- it is gitignored and never installed here. The
  selfcheck's own error text names the fix. **Critically, the abort happened before crux 6 ran**, so
  the one crux that my `composePrompt` edit could actually break was unproven.
- **Fix:** `npm ci --prefix .claude/skills/lz-red-workspace`. Chose `ci` over `install` because it
  restores exactly from the tracked lockfile and cannot mutate `package.json` or `package-lock.json`
  (verified after: both clean under `git status --porcelain`).
- **Why this is not the package-manager exclusion:** that rule guards against installing a NEW or
  substituted package name, where a failed install may indicate slopsquatting. This installed no new
  package -- it restored three exact-pinned, already-tracked devDependencies (`angular-typechecker`
   0.2.4, `typescript` 6.0.3, `vitest` 4.1.10) from a tracked lockfile into a gitignored directory.
  No package-name judgement was made and nothing was substituted.
- **Result:** re-run exited 0 with crux 6 green. Had I skipped this, the mandatory leg would have
  been reported as environment-blocked with crux 6 unproven.
- **Note for the next worktree:** any fresh worktree needs this install before `selfcheck-red.mjs`
  can complete. `npm audit` reports 3 high-severity advisories in the restored dev tree; untouched,
  since changing pinned versions is out of scope here.

**2. [Rule 2 - Missing critical detail] Recorded a cosmetic dry-run banner caveat in RUN-GATE**

The dry-run banner line `plugin :` always prints `PLUGIN_DIR` regardless of arm, so it reads
`plugins/lz-tdd` even on `invoke_treatment`. Pre-existing behaviour shared with the `code_review`
arm; the `argv:` line carries the real value. Left unchanged deliberately (crux 6 pins the nx
`--arm all` dry-run output) and documented in RUN-GATE section 3 so the operator does not misread it
as a broken arm at spend time.

## Known gaps, deliberately left

1. **UNRESOLVED-1** -- the ambiguous-prompt corpus and its target. Owner decision, reproduced
   verbatim in RUN-GATE with the added note that option A carries the crux 1/2 entry cost.
2. **The `oracle-reviewer` DST-04 gate** on the distilled artifact. Orchestrator-driven (the executor
   has no Agent tool). A precondition of the ship, not of this build -- nothing here ships.
3. **The metered A/B run.** Needs a fresh spend approval. Explicitly out of scope; no `claude -p` or
   any metered command was run in this task.

## Self-Check: PASSED

Files verified present on disk: `treatment/test-double-taxonomy.md`, `treatment/build-treatment.mjs`,
`260801-sc9-RUN-GATE.md`; both treatment files confirmed tracked via `git ls-files`. Commits
`087e6d1`, `344738a`, `8d88387` all present in `git log`, none containing a file deletion.
