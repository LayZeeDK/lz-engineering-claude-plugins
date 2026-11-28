---
phase: quick-261107-jfm
plan: 01
subsystem: lz-red-workspace link checker
status: complete
tags: [security-review, link-gate, selftest, tdd]
requires: []
provides:
  - "tools/lib/package-links.mjs: pure, lexical packageLinkProblems(target, sourceRel, tracked)"
  - "tools/package-links.selftest.mjs in npm run check"
affects:
  - .claude/skills/lz-red-workspace/tools/check-red-references.mjs (N2 gate)
  - .claude/skills/lz-red-workspace/tools/lib/pipe-table.mjs (linkKind)
tech-stack:
  added: []
  patterns: ["pure core + node:fs recorder selftest", "git ls-files tracked set as the package definition"]
key-files:
  created:
    - .claude/skills/lz-red-workspace/tools/lib/package-links.mjs
    - .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs
  modified:
    - .claude/skills/lz-red-workspace/tools/check-red-references.mjs
    - .claude/skills/lz-red-workspace/tools/lib/pipe-table.mjs
    - .claude/skills/lz-red-workspace/package.json
decisions:
  - "The N2 gate resolves link targets lexically against the case-sensitive `git ls-files -z -- plugins` set, never the disk; escaping or rooted targets fail LEAVES PACKAGE before any lookup"
  - "linkKind classifies drive-letter (`/^[a-z]:/i`), `/`-root and `\\`-root (UNC) targets as absolute, tested before the scheme test"
  - "The N2 anti-vacuity counter counts every target the core acts on (relative and absolute), not anchors or scheme URLs"
metrics:
  duration: "about 15 minutes"
  completed: 2026-11-07
---

# Quick 261107-jfm Plan 01: Harden check-red-references link checker Summary

The N2 relative-link gate now resolves each target as a posix path against the git-tracked plugin files, case-sensitively, and rejects escaping, UNC, root and drive-letter targets before any lookup, with no `node:fs` call in the core. Each of the ft7 security review findings F1, F2, F3 (drive letters) and F4 has a selftest case that failed against a faithful port of the old logic and passes after the fix.

## Commits

| Task | Commit | Subject |
|------|--------|---------|
| 1 | 74ca5a6 | test(lz-red-workspace): extract link-gate core and add red package-links selftest |
| 2 | b823e62 | fix(lz-red-workspace): resolve package links against the git-tracked set |
| review fix | c5052c3 | fix(lz-red-workspace): close package-link gaps found in review |

## Red evidence (Task 1, selftest against the faithful port, exit 1)

All 6 floor cases passed; these 11 lines are the selftest's `[FAIL]` output, verbatim:

```
  [FAIL] F1: target on disk but not in the tracked set -> one dead problem -- expected {"count":1,"dead":true,"leavesPackage":false}, got {"count":0,"dead":false,"leavesPackage":false}: Expected values to be strictly deep-equal:
  [FAIL] F4: target differing only in letter case from a tracked file -> one dead problem -- expected {"count":1,"dead":true,"leavesPackage":false}, got {"count":0,"dead":false,"leavesPackage":false}: Expected values to be strictly deep-equal:
  [FAIL] F2: UNC target -> LEAVES PACKAGE with zero fs calls -- expected {"leavesPackage":true,"fsCalls":[]}, got {"leavesPackage":true,"fsCalls":["existsSync(\\\\127.0.0.1\\lzjfm-probe\\x.md)"]}: Expected values to be strictly deep-equal:
  [FAIL] F2: relative escape -> LEAVES PACKAGE with zero fs calls -- expected {"leavesPackage":true,"fsCalls":[]}, got {"leavesPackage":true,"fsCalls":["existsSync(D:\\projects\\github\\LayZeeDK\\lz-engineering-claude-plugins\\.claude\\worktrees\\agent-a8a0c45c7c2182681\\README.md)"]}: Expected values to be strictly deep-equal:
  [FAIL] F2: root-absolute target -> LEAVES PACKAGE with zero fs calls -- expected {"leavesPackage":true,"fsCalls":[]}, got {"leavesPackage":false,"fsCalls":[]}: Expected values to be strictly deep-equal:
  [FAIL] F3: drive-letter target `C:/Windows/win.ini` classifies absolute -- expected "absolute", got "scheme": Expected values to be strictly deep-equal:
  [FAIL] F3: drive-letter target `C:/Windows/win.ini` -> LEAVES PACKAGE with zero fs calls -- expected {"leavesPackage":true,"fsCalls":[]}, got {"leavesPackage":false,"fsCalls":[]}: Expected values to be strictly deep-equal:
  [FAIL] F3: drive-letter target `C:\x.md` classifies absolute -- expected "absolute", got "scheme": Expected values to be strictly deep-equal:
  [FAIL] F3: drive-letter target `C:\x.md` -> LEAVES PACKAGE with zero fs calls -- expected {"leavesPackage":true,"fsCalls":[]}, got {"leavesPackage":false,"fsCalls":[]}: Expected values to be strictly deep-equal:
  [FAIL] F3: drive-letter target `c:..\..\README.md` classifies absolute -- expected "absolute", got "scheme": Expected values to be strictly deep-equal:
  [FAIL] F3: drive-letter target `c:..\..\README.md` -> LEAVES PACKAGE with zero fs calls -- expected {"leavesPackage":true,"fsCalls":[]}, got {"leavesPackage":false,"fsCalls":[]}: Expected values to be strictly deep-equal:
```

`SUMMARY: package-links self-test RED -- 11 of 17 assertion(s) FAILED`. The fs recorder intercepted the UNC `existsSync`, so the red run opened no SMB session. At the Task 1 commit the checker stayed GREEN at 125 checks with the port in place.

## Green evidence (Task 2, expectations unchanged)

| Command (from the worktree root) | Result |
|---|---|
| `node .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs` | exit 0, `17/17 assertions pass` |
| `node .claude/skills/lz-red-workspace/tools/row-guards.selftest.mjs` | exit 0, `row-guards self-test GREEN` |
| `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` | exit 0, `125 checks, equal to the PREDICTED literal`, `RED-REFS GREEN` |
| `npm --prefix .claude/skills/lz-red-workspace run check` | exit 0; every SUMMARY line GREEN, package-links selftest in the chain |
| `git status --porcelain -- plugins` | empty |
| email allowlist-inversion `rg -n -o -i` over the 5 changed files | exit 1, no tokens (positive control on the gmail matched, exit 0) |

The checker staying GREEN on the real tree also shows the tracked-set paths and the core's posix paths agree: a mismatch would report every link dead.

## Review fixes (commit c5052c3)

An independent review of 74ca5a6..b823e62 (scratchpad `review-jfm.md`) found gaps. The orchestrator triaged them, and each fix was made red first.

| Finding | Fix |
|---|---|
| H1 (high) `..` that leaves the plugin root and re-enters through the folder name passed (the installed root is not named `lz-tdd`) | The boundary test walks the target's segments from the source file's depth below the plugin root and fails LEAVES PACKAGE as soon as the depth drops below 0 |
| M1 backslash-separated in-package target passed | Reported as `uses backslash separators (no such path on a POSIX install)`. The `\` to `/` mapping is used only for the escape walk |
| M2 the `git ls-files` set builder had no test | Moved into an exported `trackedFiles(repoRoot)` in `lib/package-links.mjs`, and tested against a throwaway `git init` repo in the OS temp folder: tracked, untracked, git-ignored and non-ASCII names, deleted afterwards |
| M3 directory links (`skills/lz-red/`, `skills`, `.`) false-failed | Accepted when the resolved path is tracked or some tracked path starts with `<resolved>/` |
| L1 the fs recorder missed named `node:fs` imports | `syncBuiltinESMExports()` runs after patching and after restoring; a named-import case proves calls through a named import are recorded |
| L2 `file:` targets were skipped as `scheme` | `linkKind` classifies `/^file:/i` as `absolute`. row-guards.selftest pins no `file:` expectation, so none changed |
| L6 cosmetic | `findLinkTargets` JSDoc rewritten (absolute targets fail); `&&node` spacing fixed in `package.json` |

Hits now read `<file>:<line> -> <raw> <problem>` for every problem, so a dead or backslash hit names its cause. This changes failure text only; green output is unchanged.

### Red evidence (new cases against b823e62, exit 1, `13 of 32 assertion(s) FAILED`)

The 17 earlier cases and the two new M3 negative floors (`skills/no-such-dir/` and the `skills/lz-re` prefix trap) passed. The `[FAIL]` lines, verbatim:

```
  [FAIL] H1: `../lz-tdd/...` re-enters through the plugin folder name -> LEAVES PACKAGE -- expected true, got false: Expected values to be strictly deep-equal:
  [FAIL] H1: `../../plugins/lz-tdd/README.md` re-enters from the repo root -> LEAVES PACKAGE -- expected true, got false: Expected values to be strictly deep-equal:
  [FAIL] H1: `../../../lz-tdd/README.md` from a nested file re-enters -> LEAVES PACKAGE -- expected true, got false: Expected values to be strictly deep-equal:
  [FAIL] M1: backslash-separated in-package target -> one backslash problem -- expected {"count":1,"backslash":true}, got {"count":0,"backslash":false}: Expected values to be strictly deep-equal:
  [FAIL] M3: directory link with a trailing slash -> fine -- expected [], got ["dead (target is not in the package)"]: Expected values to be strictly deep-equal:
  [FAIL] M3: directory link without a trailing slash -> fine -- expected [], got ["dead (target is not in the package)"]: Expected values to be strictly deep-equal:
  [FAIL] M3: `.` names the plugin root -> fine -- expected [], got ["dead (target is not in the package)"]: Expected values to be strictly deep-equal:
  [FAIL] L2: `file:///C:/x.md` classifies absolute -- expected "absolute", got "scheme": Expected values to be strictly deep-equal:
  [FAIL] L2: `file:///C:/x.md` -> LEAVES PACKAGE with zero fs calls -- expected {"leavesPackage":true,"fsCalls":[]}, got {"leavesPackage":false,"fsCalls":[]}: Expected values to be strictly deep-equal:
  [FAIL] L2: `file:../../README.md` classifies absolute -- expected "absolute", got "scheme": Expected values to be strictly deep-equal:
  [FAIL] L2: `file:../../README.md` -> LEAVES PACKAGE with zero fs calls -- expected {"leavesPackage":true,"fsCalls":[]}, got {"leavesPackage":false,"fsCalls":[]}: Expected values to be strictly deep-equal:
  [FAIL] L1: the fs recorder records a call made through a named import -- expected ["existsSync(lzjfm-recorder-probe.md)"], got []: Expected values to be strictly deep-equal:
  [FAIL] M2: trackedFiles lists only the git-tracked files under plugins/, non-ASCII names unquoted -- expected ["plugins/p/spaced ø.md","plugins/p/tracked.md"], got "threw: packageLinks.trackedFiles is not a function or its return value is not iterable": Expected values to be strictly deep-equal:
```

Extra mutation check for M2: I dropped `-z` from `trackedFiles` (splitting on newlines) and the M2 case failed, getting `"\"plugins/p/spaced \\303\\270.md\""`. Then I reverted it.

### Green evidence (c5052c3)

| Command (from the worktree root) | Result |
|---|---|
| `node .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs` | exit 0, `32/32 assertions pass`; temp repo removed (no `lzjfm-*` left in the temp folder) |
| `node .claude/skills/lz-red-workspace/tools/row-guards.selftest.mjs` | exit 0, GREEN |
| `npm --prefix .claude/skills/lz-red-workspace run check` | exit 0; checker `125 checks, equal to the PREDICTED literal`, RED-REFS GREEN; every SUMMARY line GREEN |
| `git status --porcelain -- plugins` | empty |
| email allowlist-inversion scan over the 5 changed files | exit 1, no tokens (gmail positive control exit 0) |
| non-ASCII scan of the two new files | exit 1, none (the selftest writes the non-ASCII name as `\u00f8`) |

## Deviations from Plan

None in behaviour. Two small choices, recorded for the reviewer:
- The selftest compares a `{ count, dead, leavesPackage }` shape rather than exact problem strings, so the same expectation held for the port (which could return both `dead` and `LEAVES PACKAGE`) and the fix.
- The checker keeps today's hit text by mapping the `LEAVES PACKAGE` problem to the `... LEAVES PACKAGE` suffix and the dead problem to the bare `${shown}:${line} -> ${raw}` hit.

## Deferred

- F3 remaining unparsed link forms: angle-bracket destinations, single-quoted titles, nested brackets in link text, reference-style definitions, and HTML `href`/`src`. The review measured zero of each in the shipped tree, so they are latent. The follow-up is a CommonMark parser, or a gate that fails on any unsupported form (`]: `, `](<`, `href=`/`src=`, `'`-title).
- The shipped-tree walk (`collectFiles`) still reads the disk and skips symlinked Markdown files and directories. The review raised this under F1, but this task covered link targets only.
- L5 (pre-existing link-regex gaps): single-quoted titles, reference-style links, `<...>` destinations with spaces, and links inside inline code, which are extracted and can false-fail. Same follow-up as the F3 remainder above.

## Declined

- F5 (quadratic `LINK_RE` on crafted lines): pre-existing, polynomial not exponential, and the input is repo-authored.
- F6 (`${CLAUDE_SKILL_DIR}` prefix for the lz-refactor SKILL.md references path): leaf opens were measured 11/11 and 2/2 without it.
- F7 (unpinned plugin README link to the repository): intended, a human navigation link to the default branch.
- L3 (percent-encoded and query-string targets false-fail): they fail loudly, which is the safe direction. None exist in the tree, and encoded traversal still fails (as dead).
- L4 (the gate reads the index, the package is built from a commit): reading the index is right for a pre-commit gate. `git ls-tree -r -z --name-only HEAD -- plugins` is the option if a post-commit check is ever wanted.

## Scoped review of c5052c3 (orchestrator triage)

An independent opus-low reviewer probed 27 targets against c5052c3 and found no high or medium bug. Its five low
items, triaged by Claude:

- Declined, same reasoning as L3: percent-encoded paths (`a%20b.md`) and `?query` suffixes are reported dead. They fail
  loudly in the safe direction, and none exist in the tree.
- Deferred with L5: `<a b.md>` angle-bracket destinations are never extracted by `LINK_RE`.
- Deferred, low: a trailing slash on a file (`README.md/`) and `x/..` with an untracked `x` both pass because the
  check is lexical; each would break on a POSIX install. Neither form exists in the tree, and fixing them means
  treating a trailing-slash target as directory-only and walking `..` against the tracked set. Price: one small change
  in `package-links.mjs` plus two selftest cases.
- Declined: a source file directly at `plugins/X.md` (not inside a plugin folder) would start the depth walk at -1 and
  report every link as leaving the package. That fails loudly, and no such file exists.

## Threat Flags

None. The change removes surface (no `node:fs` in the core); the one new process call is `git ls-files` with a fixed argument list via `execFileSync` (no shell), and it fails closed.

## Self-Check: PASSED

- FOUND: .claude/skills/lz-red-workspace/tools/lib/package-links.mjs
- FOUND: .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs
- FOUND: commit 74ca5a6
- FOUND: commit b823e62
- FOUND: commit c5052c3
