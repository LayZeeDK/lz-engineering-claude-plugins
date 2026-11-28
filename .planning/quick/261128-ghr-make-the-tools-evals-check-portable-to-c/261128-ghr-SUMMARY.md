---
phase: quick-261128-ghr
plan: 01
subsystem: tools/evals (eval harness) and its GitHub Actions workflows
tags: [ci, portability, windows, linux, stryker, test-first]
status: complete
requires: []
provides:
  - npmCliPath(execPath, platform) in tools/evals/templates.ts
  - TriggerSpec.record.readFrom in tools/evals/port-cases.ts
  - core.autocrlf false step in evals-check.yml
  - lz-node-test build step in evals-mutation.yml
affects:
  - .github/workflows/evals-check.yml
  - .github/workflows/evals-mutation.yml
tech-stack:
  added: []
  patterns:
    - "Pick node:path win32 or posix by a platform argument, never host join/dirname, for host-independent paths"
key-files:
  created: []
  modified:
    - tools/evals/templates.ts
    - tools/evals/templates.test.ts
    - tools/evals/port-cases.ts
    - tools/evals/port-cases.test.ts
    - .github/workflows/evals-check.yml
    - .github/workflows/evals-mutation.yml
decisions:
  - "npmCliPath sits above the Stryker-disabled region so Stryker mutates it; kataToolchain's npmCli constant stays inside the region and calls it"
  - "The lz-tpp record reads d85ffeb (identical trigger-eval.json blob e6a62ca) and keeps the rec-5f586da tag on every recorded case"
  - "The autocrlf step goes in evals-check.yml only; evals-mutation.yml runs on ubuntu-latest, where it would change nothing"
metrics:
  duration: "about 47 minutes (11:00Z to 11:47Z)"
  completed: 2026-11-28
actuals:
  tasks: 3
  commits: 4
plan_head_before: 8bef6f5d85d2b682bed05c4c1cdfe63693736afe
plan_head_after: b9a2ddc757031d47acc491b71c7c897b7d3126ef
---

# Phase quick-261128-ghr Plan 01: Make the tools/evals check portable to CI runners Summary

The evals harness now finds npm-cli.js in both the Windows and the POSIX Node.js layout, reads the lz-tpp trigger record from published commit d85ffeb while keeping the rec-5f586da tag, checks out LF on Windows runners, and builds the pinned lz-node-test checkout before Stryker loads its mutators.

## Commits

| Task | Commit | Message |
|------|--------|---------|
| 1 | 8079b9f | fix(quick-261128-ghr): find npm-cli.js in the POSIX Node.js layout too |
| 2 | 1565123 | fix(quick-261128-ghr): read the lz-tpp trigger record from published d85ffeb |
| 3a | c5b4bcf | ci(quick-261128-ghr): check out LF on Windows runners for the evals check |
| 3b | b9a2ddc | ci(quick-261128-ghr): build the pinned lz-node-test checkout before Stryker loads it |

All four: author and committer larsbrinknielsen@gmail.com. `git rev-list --count 8bef6f5..HEAD` = 4.

## Test-first cycles

Cycle log: `C:\Users\LarsGyrupBrinkNielse\AppData\Local\Temp\claude\2ab0ddc7f3bc9bac\eb5dc786-46cb-4f54-ba2f-01195618b0f1\scratchpad\exec-261128-ghr\cycle-log.txt`

```text
1 | npmCliPath finds npm-cli.js in node_modules beside node.exe on Windows | red: fail 1 / Error: npmCliPath not implemented: C:\nodejs\node.exe win32 | green: (nil -> constant) | refactor: remove duplication between test and code (literal -> win32.join(win32.dirname(execPath), ...))
2 | npmCliPath finds npm-cli.js in <prefix>/lib/node_modules when node is in <prefix>/bin elsewhere | red: fail 1 / AssertionError [ERR_ASSERTION]: Expected values to be strictly equal: | green: (unconditional -> if) | refactor: remove duplication between test and code (literal -> posix.join(posix.dirname(posix.dirname(execPath)), 'lib', ...)); Extract Variable for the shared npm-cli.js tail DECLINED (adds a constant, removes one repeat)
3 | a record with readFrom is read from that commit and still tags its queries with the recorded sha | red: fail 1 / Error: git show 0abc123:... exited 128: fatal: invalid object name '0abc123'. | green: (unconditional -> if) | refactor: none
```

(The log file itself carries the runner's `fail 1` summary line verbatim, with its info glyph.)

Condition check for Task 1: with the platform condition forced true, the POSIX test failed (1 of 2); forced false, the Windows test failed (1 of 2). Both edits were reverted.

## Local proofs

- Task 1, real machine: `npmCliPath(process.execPath, process.platform)` gives `...\fnm_multishells\...\node_modules\npm\bin\npm-cli.js`, and it exists (`true`).
- Task 2 (a): `node tools/evals/port-cases.ts` printed trigger-lz-red 36, trigger-lz-tpp 28, trigger-lz-refactor 30, routing 9 cases; `git status --porcelain -- evals/` printed nothing.
- Task 2, blob identity: `d85ffeb:` and `5f586da:` `.claude/skills/lz-tpp-workspace/evals/trigger-eval.json` both hash to e6a62cac0bc8baf1b9c7e895ebc4c19e407249d6; d85ffeb is an ancestor of HEAD.
- Task 2 (b): clone `--no-local --single-branch --no-tags --branch gsd/lz-tdd-0.0.3-lz-red` at `...\scratchpad\exec-261128-ghr\published`. Control: `cat-file -e 5f586da` failed with `fatal: Not a valid object name 5f586da` (exit 128). With `LZ_EVAL_REPO` set to the clone, the real-sets test passed (tests 1, pass 1, fail 0). Negative control: with `readFrom` removed, the same test failed with `fatal: invalid object name '5f586da'`, the CI failure. Reverted.
- Task 3 (c): scratch checkout at `...\scratchpad\lz-node-test`, detached at a78a56c8, `npm ci --ignore-scripts` exit 0. Before the build, importing `packages/stryker-node-mutators/src/index.ts` failed: `ERR_MODULE_NOT_FOUND: Cannot find module '...\node_modules\@layzee\stryker-mutator-core\dist\index.js'`. The first `npx --no nx run-many -t build` was all cache hits (6/6), so the six `dist` folders were deleted, the control failed again, and the build ran with `--skip-nx-cache`: "Successfully ran target build for 6 projects", exit 0. After it, `packages/stryker-mutator-core/dist/index.js` exists and the import printed `[OK] ... exports lzNodeMutators`. `tools/evals/stryker.config.ts` also imports cleanly against the built checkout (`exports default`). `--ignore-scripts` did not block the build.
- Task 3 (d): full check `npm --prefix tools/evals run check` exit 0: tsc clean, then

```text
tests 155
suites 0
pass 155
fail 0
cancelled 0
skipped 0
todo 0
duration_ms 231481.7012
check-cases: OK - 19 suites, 169 cases, 101 grader definitions, 101 fixtures
```

## Deviations from Plan

1. **[Rule 3 - Blocking] lz-tdd skills not registered in this session.** `Skill(lz-tdd:lz-red)` returned "Unknown skill". I read the three SKILL.md files from `plugins/lz-tdd/skills/` once each before the first cycle and applied them as written.
2. **Cycle log path.** The scratchpad already held another run's `cycle-log.txt`, so this task's log is in `scratchpad\exec-261128-ghr\cycle-log.txt`.
3. **Plan-commit ledger file not written.** The worktree guard refused the compound command that writes `gsd-plan-head-before-*` into the git dir; the base is recorded above from the brief's known base 8bef6f5.
4. **Count discrepancy, no code impact.** The plan says 37 committed files carry `rec-5f586da`; I count 29 under `evals/` (27 lz-tpp trigger cases plus two run-set.json) and 34 tracked repo-wide (adding planning docs and the test file). The tag is unchanged either way.
5. **Shared-machine lock.** Cycle 3's green run started in the same command as a status check that showed a holder whose note said "timing-sensitive" (not the bracketed marker). After that I waited for the holder to clear before every run.

## Known Stubs

None.

## Self-Check: PASSED

- Files: tools/evals/templates.ts, templates.test.ts, port-cases.ts, port-cases.test.ts, .github/workflows/evals-check.yml, evals-mutation.yml all modified and committed.
- Commits 8079b9f, 1565123, c5b4bcf, b9a2ddc are ancestors of HEAD.
- Email allowlist scan of `git diff 8bef6f5..HEAD`: no email-shaped token (positive control on port-cases.test.ts finds only the gmail).
