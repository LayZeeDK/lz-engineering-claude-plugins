---
phase: 261124-v73-bring-two-workspace-scripts-up-to-the-us
fixed_at: 2026-11-24T22:12:59Z
review_path: .planning/quick/261124-v73-bring-two-workspace-scripts-up-to-the-us/261124-v73-REVIEW.md
iteration: 1
findings_in_scope: 5
fixed: 5
skipped: 0
status: all_fixed
---

# Quick 261124-v73: Code Review Fix Report

**Fixed at:** 2026-11-24T22:12:59Z
**Source review:** .planning/quick/261124-v73-bring-two-workspace-scripts-up-to-the-us/261124-v73-REVIEW.md
**Iteration:** 1

**Summary:**

- Findings in scope: 5 (WR-01, WR-02, WR-03, WR-04, IN-01, set by the brief)
- Fixed: 5
- Skipped: 0 in scope. IN-02, IN-03 and IN-04 are out of scope and stay open (listed below).

Where it ran: every edit, commit and gate ran in the main checkout on branch `gsd/lz-tdd-0.0.3-lz-red`. No
worktree was created, because a fresh worktree has no `node_modules` and could not run `npm run check`. The
numbers below can be reproduced from the main checkout.

## Fixed Issues

### WR-01: check-no-new-js test runs git against an inherited GIT_DIR / GIT_INDEX_FILE

**Files modified:** `.claude/skills/lz-refactor-workspace/tools/check-no-new-js.test.ts`
**Commit:** 431b10c
**Test first:** new case "git calls go to the scratch repository even under an inherited GIT_DIR or
GIT_INDEX_FILE". It asserts `git rev-parse --git-dir` is `.git` and `git rev-parse --git-path index` is
`.git/index` in the scratch repository. Watched red before the fix: under `GIT_DIR=<decoy>/.git` the first
assertion got the decoy path, and under `GIT_INDEX_FILE=<decoy-index>` the second got the decoy file, which the
existing listing test also created. Both decoys were throwaway repositories in the session scratchpad.
**Applied fix:** at the top of the test file, delete `GIT_DIR`, `GIT_WORK_TREE`, `GIT_INDEX_FILE`,
`GIT_OBJECT_DIRECTORY` and `GIT_COMMON_DIR` from `process.env` before any git call. The `git()` test utility now
returns stdout so the case can read it. After the fix both decoy runs pass 10/10, the decoy repository's
config is byte-identical, and no decoy index file is written. The production `listWorkspaceFiles` is unchanged:
inside a hook, honouring the inherited index is correct for the guard itself.

### WR-02: Type-check accepts ES2025 APIs that crash on Node.js 22

**Files modified:** `.claude/skills/lz-red-workspace/tsconfig.tools.json`,
`.claude/skills/lz-red-workspace/package.json`, `.claude/skills/lz-red-workspace/package-lock.json`,
`.claude/skills/lz-refactor-workspace/tsconfig.tools.json`, `.claude/skills/lz-refactor-workspace/package.json`,
`.claude/skills/lz-refactor-workspace/package-lock.json`
**Commit:** 761c482
**Test first:** no test file covers a tsconfig, so a temporary probe `wr02-probe.ts` (deleted again, never
committed) used `RegExp.escape`, `Promise.try`, `Float16Array` and `crypto.argon2Sync`. Red before the fix:
`tsc -p tsconfig.tools.json` exited 0, and `argon2Sync` is `undefined` on Node.js 22.23.1. After the fix, `tsc`
exited 2 with one error per API (TS2305, TS2550 twice, TS2304).
**Applied fix:** `"lib": ["es2024"]` in both files, and `@types/node` pinned to 22.20.5 (was 24.19.2) in both
workspaces, so Node.js APIs added in 23 or 24 are rejected too. The lockfile diffs change only `@types/node`
and its `undici-types` dependency (7.24.6 -> 6.21.0). The `npm audit` notice in lz-red-workspace was already
there with the old lock.
**Note:** the first commit attempt took its message from a stale file of an earlier run in the scratchpad. The
content was correct; the unpushed commit was amended with the right message before anything else happened.

### WR-03: The guard misses .cjs, so a ported script can come back as CommonJS

**Files modified:** `.claude/skills/lz-refactor-workspace/tools/check-no-new-js.ts`,
`.claude/skills/lz-refactor-workspace/tools/check-no-new-js.test.ts`,
`.claude/skills/lz-refactor-workspace/tools/grandfathered-js.txt`
**Commit:** a005509
**Test first:** the case "reports a .js or .cjs the same way and matches the extension case-insensitively"
(renamed from "reports a .js the same way ...") now also lists `x.cjs` and `y.CJS`. Watched red: 9/10 pass, this
case failed with the two `.cjs` paths missing from `added`.
**Applied fix:** the pattern is now `/^\.claude\/skills\/[^/]+-workspace\/.*\.[cm]?js$/i`, so `.js`, `.mjs` and
`.cjs` match case-insensitively. The header comment and the first line of grandfathered-js.txt name `.cjs`.
`.mts` and `.cts` are TypeScript and stay allowed. The "ignores other extensions under a workspace" case now
lists `x.mts` and `x.cts` to pin that. No `.cjs` file exists under the workspaces, so the guard still reports
0 new, 0 stale.

### WR-04: Glob-based `node --test` passes with zero tests

**Files modified:** `.claude/skills/lz-red-workspace/package.json`, `.claude/skills/lz-refactor-workspace/package.json`
**Commit:** 110492e
**Test first:** no test file covers a package script, so I measured the behaviour directly. On Node.js 22.23.1
and 24.22.0, `node --test "tools/**/*.test.ts"` with no match exits 0. `node --test no-such.test.ts` exits 1.
**Applied fix:** both check scripts name their test files, as the brief preferred. lz-red runs
`node --test cycle-logs.test.ts` (3 tests). lz-refactor runs
`node --test tools/check-erasable-ts.test.ts tools/check-no-new-js.test.ts` (30 tests). A renamed, moved or
deleted test file now fails the check. No glob remains.

### IN-01: Node.js 22.18 minimum is implied but not declared; below it the guard can pass silently

**Files modified:** `.claude/skills/lz-red-workspace/package.json`, `.claude/skills/lz-red-workspace/package-lock.json`,
`.claude/skills/lz-refactor-workspace/package.json`, `.claude/skills/lz-refactor-workspace/package-lock.json`,
`.claude/skills/lz-refactor-workspace/tools/check-no-new-js.ts`, `.claude/skills/lz-refactor-workspace/tools/check-erasable-ts.ts`
**Commit:** cb40542
**Lars's ruling (2026-11-24, verbatim, relayed by the coordinator):** "We will set the minimum supported Node.js
version to the first version to support .ts erasable syntax". Confirmed by Lars (2026-11-24, verbatim, relayed by
the coordinator): "`>=22.18.0` it is then". Refined by Lars the same day (verbatim): "Or rather, `>=22.18.0` plus
first LTS 24 version and first LTS 26 version". The orchestrator set `engines.node` to
`^22.18.0 || ^24.11.0 || ^26.13.0` in both package.json files and lockfiles (follow-up commit after cb40542). First LTS
releases measured from https://nodejs.org/dist/index.json: v24.11.0 (Krypton, 2025-10-28) and v26.13.0 (Lithium,
2026-10-28). The range leaves out the odd lines (23, 25) and anything after 26 until it is widened.
**Docs:** the Node.js History tables say "v22.18.0 | Type stripping is enabled by default."
(https://nodejs.org/docs/latest-v22.x/api/typescript.html) and, for `import.meta.main`, "Added in: v24.2.0,
v22.18.0" (https://nodejs.org/api/esm.html).
**Version check:** the Node.js clone at tag v22.18.0 has `doc/changelogs/CHANGELOG_V22.md` 22.18.0 "Type
stripping is enabled by default" (#56350, "module: unflag --experimental-strip-types"). `doc/api/esm.md` lists
`import.meta.main` as "added: v22.18.0", and v22.17.1's esm.md does not mention it. I installed Node.js 22.17.1
with `fnm install 22.17.1` for this check; it is a new fnm version on the machine, and the fnm default was not
changed. On 22.17.1, `node tools/check-no-new-js.ts` with no flag fails (no type stripping), which matches the
changelog. The measured first version is 22.18.0, as Claude read the ruling.
**Test first:** I could not write an automated test case for this, because every Node.js version the suite
supports defines `import.meta.main`. The red was a real run instead. On 22.17.1 with
`--experimental-strip-types`, both `check-no-new-js.ts` and `check-erasable-ts.ts` printed only the
ExperimentalWarning and exited 0, without running their check.
**Applied fix:** `"engines": { "node": ">=22.18.0" }` in both package.json files. The lockfiles' root entries
were refreshed with `npm install --package-lock-only`, which added only the same `engines` block. Both guards
now throw `needs Node.js >= 22.18.0 (import.meta.main)` when `typeof import.meta.main !== 'boolean'`. After the
fix, on 22.17.1 with the flag, both exit 1 with that error. On 22.23.1 and 24.22.0 both run and exit 0. This
applies to the two `.ts` entry points that use `import.meta.main`. `cycle-logs.ts` does not use it.

## Skipped Issues

### IN-02: A grandfathered file deleted but not staged is not reported as stale

**File:** `.claude/skills/lz-refactor-workspace/tools/check-no-new-js.ts:39`
**Reason:** skipped: out of scope (the brief fixes WR-01..WR-04 and IN-01 only).
**Original issue:** `--cached` keeps listing a tracked file after it is deleted from the working tree, so its
grandfather line is reported stale only after `git rm`.

### IN-03: cycle-logs tests leave documented behaviour untested and depend on test order

**File:** `.claude/skills/lz-red-workspace/cycle-logs.test.ts:30-62`
**Reason:** skipped: out of scope (the brief fixes WR-01..WR-04 and IN-01 only).
**Original issue:** the `node_modules` exclusion, the `.txt`/`.log` extensions and the dangling-symlink skip
are untested, and the first test's `deepEqual` depends on test order through a shared folder.

### IN-04: check-erasable-ts blanks code after an apostrophe in tsx text

**File:** `.claude/skills/lz-refactor-workspace/tools/check-erasable-ts.ts:84-104`
**Reason:** skipped: out of scope (the brief fixes WR-01..WR-04 and IN-01 only).
**Original issue:** a `'` or `"` string is read across newlines, so JSX text such as `<p>Don't</p>` hides any
parameter property up to the next quote (false negatives only).

## Verification

All runs were in the main checkout after the last fix (HEAD cb40542):

| Run | Exit | Tests |
|-----|------|-------|
| `npm run check`, lz-red-workspace, Node.js 26.13.0 (default) | 0 | 3 pass, 0 fail; check-no-new-js 0 new, 0 stale |
| `npm run check`, lz-refactor-workspace, Node.js 26.13.0 (default) | 0 | 30 pass, 0 fail; check-erasable-ts 0 hits |
| `npm run check`, lz-red-workspace, Node.js 22.23.1 / 24.22.0 | 0 / 0 | 3 pass, 0 fail each |
| `npm run check`, lz-refactor-workspace, Node.js 22.23.1 / 24.22.0 | 0 / 0 | 30 pass, 0 fail each |
| `node --test tools/check-no-new-js.test.ts` (the only changed test file), 22.23.1 / 24.22.0 | 0 / 0 | 10 pass, 0 fail each |

---

_Fixed: 2026-11-24T22:12:59Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
