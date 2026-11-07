---
phase: quick-261107-isy
plan: 01
subsystem: eval-harness
tags: [lz-red-workspace, eval, slim-claude-p, srvx, rules-ab]
status: complete
requires: []
provides:
  - .claude/skills/lz-red-workspace/slim-arms.sh (shared package + arm-b rules helper)
  - .claude/skills/lz-red-workspace/e2e-rgr-srvx/ (red-green-refactor outcome eval harness)
  - .claude/skills/lz-red-workspace/rules-ab-kata/ (shippingCost kata A/B harness with --dry-run)
affects: []
tech-stack:
  added: []
  patterns:
    - "Runners source ../slim-arms.sh; every path comes from the script folder, $HOME, or SLIM_ROOT/LZ_TDD_REF/SRVX_REPO"
    - "Plugin under test packaged at run time with git archive from the repo top level"
key-files:
  created:
    - .claude/skills/lz-red-workspace/slim-arms.sh
    - .claude/skills/lz-red-workspace/e2e-rgr-srvx/README.md
    - .claude/skills/lz-red-workspace/e2e-rgr-srvx/make-template.sh
    - .claude/skills/lz-red-workspace/e2e-rgr-srvx/control.sh
    - .claude/skills/lz-red-workspace/e2e-rgr-srvx/selfcheck.sh
    - .claude/skills/lz-red-workspace/e2e-rgr-srvx/run-rgr.sh
    - .claude/skills/lz-red-workspace/e2e-rgr-srvx/grade-rgr.mjs
    - .claude/skills/lz-red-workspace/e2e-rgr-srvx/prompts/T1.md
    - .claude/skills/lz-red-workspace/e2e-rgr-srvx/prompts/T2.md
    - .claude/skills/lz-red-workspace/e2e-rgr-srvx/prompts/T3.md
    - .claude/skills/lz-red-workspace/e2e-rgr-srvx/prompts/control.md
    - .claude/skills/lz-red-workspace/rules-ab-kata/run-ab.sh
    - .claude/skills/lz-red-workspace/rules-ab-kata/grade.mjs
    - .claude/skills/lz-red-workspace/rules-ab-kata/task.md
    - .claude/skills/lz-red-workspace/rules-ab-kata/RESULTS.md
    - .claude/skills/lz-red-workspace/rules-ab-kata/template/package.json
    - .claude/skills/lz-red-workspace/rules-ab-kata/template/package-lock.json
    - .claude/skills/lz-red-workspace/rules-ab-kata/template/tsconfig.json
    - .claude/skills/lz-red-workspace/rules-ab-kata/hidden/acceptance.spec.ts
  modified: []
decisions:
  - "git archive runs from the repo top level: from a subfolder it silently archives only that subfolder (measured: empty package)"
  - "run-ab.sh creates the run folder's src/ itself, since git does not track the source's empty template/src"
metrics:
  duration: ~15 min
  completed: 2026-11-07
  tasks: 2
  files: 19
---

# Quick 261107-isy: Land rgr-srvx and rules-ab-kata eval harnesses Summary

Two slim `claude -p` eval harnesses now live under `.claude/skills/lz-red-workspace/`: the srvx red-green-refactor
outcome eval and the shippingCost kata A/B. They share `slim-arms.sh`, which packages lz-tdd at a ref with
`git archive` and builds arm b's Test-first rules folder at run time from Lars's lars-mode reference. That
reference is never committed. Both harnesses were checked with dry runs and the grader self-check only; nothing
metered ran.

## Commits

| Task | Commit | Subject |
|---|---|---|
| 1 | 3b9d40f | test(lz-red-workspace): land the e2e-rgr-srvx red-green-refactor eval harness |
| 2 | 8719dbd | test(lz-red-workspace): land the rules-ab shippingCost kata harness |

## Verification (all run, results measured)

| Check | Result |
|---|---|
| `bash e2e-rgr-srvx/run-rgr.sh --dry-run T3 a 1 T3 b 1` | exit 0; cwd `D:\tmp\slim-claude-p\rgr-eval\T3\runs\{a,b}-1`, `--plugin-dir D:\tmp\slim-claude-p\pkg\d02204d`, arm a has no rules dir (`--rules none`), arm b `--add-dir D:\tmp\slim-claude-p\rules-b`, no `~1` |
| `bash e2e-rgr-srvx/selfcheck.sh T3` | parent `hidden 117/119, hiddenAllPass false`; reference `hidden 119/119, hiddenAllPass true` |
| `node --check` on both graders | exit 0 |
| package + rules-b | `pkg/d02204d/.claude-plugin/plugin.json` exists; generated `rules-b/CLAUDE.md` names `D:/tmp/slim-claude-p/rules-b/test-first.md`, otherwise word for word the source bullet |
| `git ls-files .claude/skills/lz-red-workspace` for test-first | none (rg exit 1) |
| `bash rules-ab-kata/run-ab.sh --dry-run a 1 b 1` | exit 0; run folders `D:\tmp\slim-claude-p\rules-ab\runs\{a,b}-1` set up (npm ci done), reused pkg d02204d, arm b rules-b, no `~1` |
| `git check-ignore -v` on both suites' out/ files | ignored by `.gitignore:7:out/` |
| `git ls-files rules-ab-kata` | exactly the 8 task files |
| Email allowlist-inversion (positive control 1 hit) | no email token in any landed file, both tasks |
| Path-literal scan (positive control on the source run-rgr.sh exit 0) | exit 1 (no hit) on both tasks' files |
| `git log -2 --format='%ae %ce'` | gmail for author and committer on both commits; no AI attribution |
| `git diff --name-only 39018f6 8719dbd -- plugins` | empty |
| RESULTS.md diff against source | only the provenance lines changed; every number and the verdict as before |

Haiku control facts in the README were checked against the two control result files: both exited 0 on Haiku, `grep`
and `pnpm` were refused, WebFetch was not available, and Test-first reached the main session and the subagent in
arm b only. The README wording says WebFetch "was not available" rather than "refused", to match those files.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] git archive from a subfolder produced an empty package**
- **Found during:** Task 1, first dry run (`[ERROR] no .claude-plugin/plugin.json`)
- **Issue:** The plan said to run git inside the helper's own folder. Run from a subfolder, `git archive` keeps only
  that subfolder's paths, so the archive came out empty.
- **Fix:** `ensure_pkg` changes to `git rev-parse --show-toplevel` before archiving.
- **Files:** slim-arms.sh. **Commit:** 3b9d40f

**2. [Rule 1 - Bug] grade-rgr.mjs crashed when a cycle-log place did not exist**
- **Issue:** `readdirSync` throws on a missing folder. The rules-b folder is now generated, not permanent, and the
  runs' parent folder can be missing too.
- **Fix:** Missing places are filtered out with `existsSync`.
- **Commit:** 3b9d40f

**3. [Rule 3 - Blocking] The kata template's empty src/ cannot be tracked**
- **Issue:** The source template had an empty `src/`, which git does not keep. The grader copies the hidden spec into
  `src/`.
- **Fix:** run-ab.sh runs `mkdir -p "$dir/src"` before it copies the template.
- **Commit:** 8719dbd

**4. Path form:** both runners set `here` with `cygpath -m`, so `--out` and `--prompt-file` reach node as `D:/...`
paths and not as MSYS `/d/...` paths.

## Leftovers outside the repo

The dry runs and selfcheck left run folders under `D:/tmp/slim-claude-p` (`rgr-eval/T3/runs/{a,b}-1`,
`rgr-eval/T3/selfcheck-*`, `rules-ab/runs/{a,b}-1`), plus `pkg/d02204d` and `rules-b/`. The harness reuses or
recreates them on the next run.

## Self-Check: PASSED

All 19 files are tracked at 8719dbd. Commits 3b9d40f and 8719dbd exist on `worktree-agent-a374434fcab245790`.
