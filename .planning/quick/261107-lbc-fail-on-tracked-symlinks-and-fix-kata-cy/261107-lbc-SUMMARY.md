---
phase: quick-261107-lbc
plan: 01
subsystem: lz-red-workspace tooling (package-link gate, rules-ab kata grader)
tags: [package-links, symlink, n2-gate, grader, cycle-log]
requires: [quick-261107-kd7]
provides:
  - "nonFileEntries(listing) and trackedNonFiles(repoRoot) in tools/lib/package-links.mjs (round 2; replaced symlinkEntries/trackedSymlinks)"
  - "N2 hit per tracked non-regular-file entry under plugins/ (symlink, gitlink, any other mode; fails closed on a git or parse failure)"
  - "slim-arms.sh begin_cycle_logs/collect_cycle_logs, called by run-ab.sh and run-rgr.sh around every session"
  - "cycle-logs.mjs cycleLogs(since, project), shared by both graders; grade.mjs --cycle-logs <sinceMs> <project>"
affects:
  - .claude/skills/lz-red-workspace/tools/check-red-references.mjs
  - .claude/skills/lz-red-workspace/rules-ab-kata/RESULTS.md
  - .claude/skills/lz-red-workspace/e2e-rgr-srvx/README.md
tech-stack:
  added: []
  patterns: ["index-mode read via git ls-files -s -z", "per-run snapshot of shared-folder logs taken by the runner, read by the grader"]
key-files:
  created:
    - .claude/skills/lz-red-workspace/cycle-logs.mjs
  modified:
    - .claude/skills/lz-red-workspace/tools/lib/package-links.mjs
    - .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs
    - .claude/skills/lz-red-workspace/tools/check-red-references.mjs
    - .claude/skills/lz-red-workspace/rules-ab-kata/grade.mjs
    - .claude/skills/lz-red-workspace/rules-ab-kata/RESULTS.md
    - .claude/skills/lz-red-workspace/rules-ab-kata/run-ab.sh
    - .claude/skills/lz-red-workspace/e2e-rgr-srvx/grade-rgr.mjs
    - .claude/skills/lz-red-workspace/e2e-rgr-srvx/run-rgr.sh
    - .claude/skills/lz-red-workspace/e2e-rgr-srvx/README.md
    - .claude/skills/lz-red-workspace/slim-arms.sh
decisions:
  - "A tracked entry under plugins/ that is not a regular file (any mode but 100644/100755) is an N2 hit; collectFiles stays unchanged (fail loudly, never follow symlinks)"
  - "Non-file hits ride the existing N2 report, so EXPECTED_CHECKS stays 125 and LINK_RESOLVES_LABEL keeps its text"
  - "Runners copy each run's changed files from rules-b and SLIM_ROOT (non-recursive) into <run folder>.cycle-logs; graders read only the run folder and that copy, so attribution no longer depends on mtimes in shared folders"
  - "One cycle-log reader (cycle-logs.mjs) for both graders, so the two harnesses cannot drift again"
metrics:
  completed: 2026-11-07
  tasks: 3
  files: 11
status: complete
---

# Phase quick-261107-lbc Plan 01: Fail on tracked symlinks and fix kata cycle-log search Summary

N2 now fails on any mode-120000 index entry under plugins/ (read from `git ls-files -s -z`, fail-closed on git or
parse failure), and the rules-ab kata grader finds arm-b cycle logs in the rules folder and SLIM_ROOT, bounded by
the run's time window.

## Commits

| Task | Commit | Subject |
|------|--------|---------|
| 1 (red) | none, by plan | red state not committed; test and fix land together in Task 2 |
| 2 | b61fdf5 | fix(lz-red-workspace): fail the package-link gate on a tracked symlink under plugins/ |
| 3 | e22b8fc | fix(lz-red-workspace): find rules-ab kata cycle logs in the rules folder |
| review round 2 | 36ea418 | fix(lz-red-workspace): fail the package-link gate on any non-file index entry under plugins/ |
| review round 2 | 2915060 | fix(lz-red-workspace): copy each run's cycle logs out of the shared folders |

Both commits: author and committer `larsbrinknielsen@gmail.com`.

## Task 1: red first (measured)

`node .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs > .../lbc-red-task1.txt 2>&1; echo exit=$?`
printed `exit=1`. The `[FAIL]` lines and SUMMARY line from `lbc-red-task1.txt`, verbatim:

```
  [FAIL] T1: symlinkEntries returns the one mode-120000 path among regular files -- expected ["plugins/p/link.md"], got "threw: packageLinks.symlinkEntries is not a function": Expected values to be strictly deep-equal:
  [FAIL] T2: symlinkEntries over regular and executable files -> none -- expected [], got "threw: packageLinks.symlinkEntries is not a function": Expected values to be strictly deep-equal:
  [FAIL] T3: a symlink path with a space and a non-ASCII name comes back verbatim -- expected ["plugins/p/spaced ø.md"], got "threw: packageLinks.symlinkEntries is not a function": Expected values to be strictly deep-equal:
  [FAIL] T4: an empty listing -> none -- expected [], got "threw: packageLinks.symlinkEntries is not a function": Expected values to be strictly deep-equal:
  [FAIL] T5: a record with no tab -> throws malformed -- expected true, got false: Expected values to be strictly deep-equal:
  [FAIL] T6: trackedSymlinks finds the staged mode-120000 entry in a real repo -- expected ["plugins/p/linked.md"], got "threw: packageLinks.trackedSymlinks is not a function": Expected values to be strictly deep-equal:
  [FAIL] T7: trackedSymlinks throws when git fails, so the caller fails closed -- expected true, got false: Expected values to be strictly deep-equal:
SUMMARY: package-links self-test RED -- 7 of 73 assertion(s) FAILED
```

Exactly the seven T cases failed; the 66 earlier cases passed.

## Task 2: green and the end-to-end probe (measured)

- Selftest after the fix: `SUMMARY: package-links self-test GREEN -- 73/73 assertions pass`, exit 0.
- `npm --prefix .claude/skills/lz-red-workspace run check`: exit 0; N2 line
  `[PASS] [lc9] every relative markdown link in the shipped tree resolves inside its plugin package`; roster line
  `125 checks, equal to the PREDICTED literal`; every SUMMARY line GREEN (re-run after Task 3, same result).
- Probe (index only): blob `42061c01...` from `printf 'README.md' | git hash-object -w --stdin`, then
  `git update-index --add --cacheinfo 120000,<blob>,plugins/lz-tdd/lbc-probe.txt`. The checker exited 1 with:

```
  [FAIL] [lc9] every relative markdown link in the shipped tree resolves inside its plugin package -- 1 unresolved: plugins/lz-tdd/lbc-probe.txt: TRACKED SYMLINK (mode 120000; the G17, N1 and N3 disk walk skips symlinked files, so none may ship)
SUMMARY: RED-REFS RED -- 11/11 surfaces present, 1 check(s) FAILED (instrument-first Phase-18 RED baseline by design pre-content)
exit=1
```

- Undone with `git update-index --force-remove -- plugins/lz-tdd/lbc-probe.txt`; then `git status --porcelain --
  plugins` and `git diff --cached --name-only -- plugins` both printed nothing, before each commit.

## Task 3: grader fixture (measured)

Fixture under `D:/tmp/slim-claude-p/lbc-fixture` (in-window: `rules-b/cycle-log.md`, `harness.log`,
`rules-ab/runs/b-1.cycle.md`, `rules-ab/runs/b-1/src/cycle-notes.md`; controls: `rules-b/test-first.md`,
`rules-b/CLAUDE.md`, `rules-b/old-cycle.md` touched to 2020-01-01, `rules-b/next-run-cycle.md` touched to tomorrow,
`rules-ab/runs/b-1/node_modules/x/cycle.log`). Command and output:

```
$ SLIM_ROOT="$fx" node .claude/skills/lz-red-workspace/rules-ab-kata/grade.mjs --cycle-logs 1794061694544 1794061814663 "$fx/rules-ab/runs/b-1"
["D:\\tmp\\slim-claude-p\\lbc-fixture\\rules-b\\cycle-log.md","D:\\tmp\\slim-claude-p\\lbc-fixture\\harness.log","D:\\tmp\\slim-claude-p\\lbc-fixture\\rules-ab\\runs\\b-1.cycle.md","D:\\tmp\\slim-claude-p\\lbc-fixture\\rules-ab\\runs\\b-1\\src\\cycle-notes.md"]
exit=0
```

Exactly the four in-window files; none of the five controls. The fixture was removed afterwards with
`rm -rf D:/tmp/slim-claude-p/lbc-fixture`. `node --check` on grade.mjs passed.

That the OLD grader would have missed `rules-b/cycle-log.md` and `harness.log` is inferred from its code (it read
only the run folder and `${id}.*` beside it), not run: the old code had no CLI mode and `rules-ab-kata/out/` is absent.

RESULTS.md: the line-21 sentence is kept and one sentence appended ("grade.mjs now searches the rules folder and its
parent as well."); the following sentence was rewrapped. No number changed.

## Closing gates (measured)

- `git log --format='%h %ae %ce %s' 1fae18c..HEAD`: both commits show only the gmail as author and committer.
- `git diff --stat 1fae18c HEAD -- plugins`: empty.
- Allowlist-inversion email scan over the five changed files (`rg -o -i` email-shaped tokens, minus the approved
  gmail): empty (rg exit 1, no token at all). Positive control: the same pattern on AGENTS.md prints the gmail twice.
- No `claude -p` or other metered run.

## Deviations from Plan

- Base for diff checks is 1fae18c (orchestrator note), not 50e8dfb.
- RESULTS.md diff is three changed lines rather than one: appending the sentence pushed line 22 past the file's wrap
  width, so the next sentence was rewrapped. Text and numbers otherwise unchanged.
- grade.mjs matches `cycle|log` against the path relative to each search place rather than the bare file name, so it
  keeps the old grader's behaviour for a log inside a matching subfolder of the run folder. For the one-level places
  the two are the same.

## Review round 2 (scoped review of b61fdf5 and e22b8fc, triaged by the orchestrator)

Lars's scope ruling, verbatim: "I only want to resolve items from today's session now." Both harnesses landed
today. The note "Task 3: grader fixture" above describes e22b8fc; round 2 replaced its `until` bound and its scan of
SLIM_ROOT, the rules folder and the folder beside the run, as follows.

### Red first (measured, all against the committed e22b8fc code)

Grader probe (`red.mjs` in the session scratchpad, fixture under `D:/tmp/slim-claude-p/lbc-fixture`, removed after).
Run 1 owns [1000 s, 2000 s] and run 2 owns [3000 s, 4000 s]; run 2 rewrote the shared `rules-b/cycle-log.md`
(mtime 3500 s). The old rgr `cycleLogs` was imported from a scratch copy of the committed grade-rgr.mjs with an
`export` line appended:

```
R2 kata, run 1 window, reused log name: exit=0 stdout=[] error=(none)
R2 rgr, run 1 since=1000000, reused log name: ["D:\\tmp\\slim-claude-p\\lbc-fixture\\rules-b\\cycle-log.md"]
R3 kata, no arguments: exit=1 stdout=(none) error=TypeError [ERR_INVALID_ARG_TYPE]: The "path" argument must be of type string. Received undefined
R3 kata, non-numeric arguments: exit=0 stdout=[] error=(none)
R1 kata, dangling symlink named like a log: exit=1 stdout=(none) error=Error: ENOENT: no such file or directory, stat 'D:\tmp\slim-claude-p\lbc-fixture\rules-ab\runs\b-1\dangling-log'
```

So the kata grader lost run 1's log, and the rgr grader credited run 2's log to run 1. The review had only inferred
the rgr cross-credit; this run confirms it.

Selftest red after rewriting T1-T7 for the new API and adding T8 and T9
(`lbc-red-round2.txt`, untracked), verbatim:

```
  [FAIL] T1: nonFileEntries returns the one mode-120000 entry among regular files -- expected [{"mode":"120000","path":"plugins/p/link.md"}], got "threw: packageLinks.nonFileEntries is not a function": Expected values to be strictly deep-equal:
  [FAIL] T2: nonFileEntries over regular and executable files -> none -- expected [], got "threw: packageLinks.nonFileEntries is not a function": Expected values to be strictly deep-equal:
  [FAIL] T3: a symlink path with a space and a non-ASCII name comes back verbatim -- expected [{"mode":"120000","path":"plugins/p/spaced ø.md"}], got "threw: packageLinks.nonFileEntries is not a function": Expected values to be strictly deep-equal:
  [FAIL] T4: an empty listing -> none -- expected [], got "threw: packageLinks.nonFileEntries is not a function": Expected values to be strictly deep-equal:
  [FAIL] T5: a record with no tab -> throws malformed -- expected true, got false: Expected values to be strictly deep-equal:
  [FAIL] T8: a mode-160000 gitlink -> reported -- expected [{"mode":"160000","path":"plugins/p/sub"}], got "threw: packageLinks.nonFileEntries is not a function": Expected values to be strictly deep-equal:
  [FAIL] T9: a record with an empty path -> throws malformed -- expected true, got false: Expected values to be strictly deep-equal:
  [FAIL] T6: trackedNonFiles finds the staged mode-120000 entry in a real repo -- expected [{"mode":"120000","path":"plugins/p/linked.md"}], got "threw: packageLinks.trackedNonFiles is not a function": Expected values to be strictly deep-equal:
  [FAIL] T7: trackedNonFiles throws when git fails, so the caller fails closed -- expected true, got false: Expected values to be strictly deep-equal:
SUMMARY: package-links self-test RED -- 9 of 75 assertion(s) FAILED
```

The rename alone explains these reds, so a separate probe ran the committed `symlinkEntries` on the two inputs:

```
old symlinkEntries, a mode-160000 gitlink: []
old symlinkEntries, a mode-120000 record with an empty path: [""]
```

### Fixes

1. Dangling symlink (MEDIUM): the reader uses `lstatSync(file, { throwIfNoEntry: false })` and keeps only regular
   files.
2. Shared folders (MEDIUM, both harnesses): `slim-arms.sh` gained `begin_cycle_logs <run dir>`, which touches
   `<run dir>.cycle-start` and clears any old copy, and `collect_cycle_logs <run dir>`. The second copies, with
   `cp -p`, every file newer than the marker in `rules-b` (recursive) into `<run dir>.cycle-logs/rules-b/` and every
   file directly in SLIM_ROOT into `<run dir>.cycle-logs/slim-root/`, then removes the marker. `run-ab.sh` and
   `run-rgr.sh` call the pair around every session. The new `cycle-logs.mjs` is the single reader: it lists the files
   in the run folder and in its `.cycle-logs` copy whose path matches /cycle|log/i, outside node_modules, changed
   since the run started. Both graders import it. The SLIM_ROOT and rules-b scans and the `until` bound are gone.
   grade-rgr.mjs also prints `unknown (no ms in result)` instead of `-` when the result has no duration.
3. `--cycle-logs` (LOW): now `--cycle-logs <sinceMs> <project>`. Missing, extra, empty or non-numeric arguments
   print usage and exit 2.
4. Gitlink and empty path (LOW): `nonFileEntries`/`trackedNonFiles` replace `symlinkEntries`/`trackedSymlinks`.
   They report every entry whose mode is not 100644 or 100755, together with its mode, and an empty path throws as
   malformed. N2 names a 120000 entry `TRACKED SYMLINK`, a 160000 entry `TRACKED GITLINK`, and any other mode
   `TRACKED NON-FILE ENTRY (mode x)`. The count stays 125.
5. Docs (COSMETIC): the RESULTS.md sentence now says that run-ab.sh copies changed files from the rules folder and
   SLIM_ROOT into `<run folder>.cycle-logs` and that grade.mjs reads from there and the run folder. The e2e-rgr-srvx
   README gained a paragraph on the same mechanism. No number changed.

### Green (measured)

- Selftest: `SUMMARY: package-links self-test GREEN -- 75/75 assertions pass`.
- `npm --prefix .claude/skills/lz-red-workspace run check`: exit 0, `125 checks, equal to the PREDICTED literal`,
  every SUMMARY line GREEN (evasions 19 CAUGHT, 8 OPEN = baseline).
- Gitlink probe: staged `160000,<blob>,plugins/lz-tdd/lbc-probe-sub` in the index only. The checker exited 1 with:

```
  [FAIL] [lc9] every relative markdown link in the shipped tree resolves inside its plugin package -- 1 unresolved: plugins/lz-tdd/lbc-probe-sub: TRACKED GITLINK (mode 160000; a submodule ships as an empty folder while the disk walk reads its checkout)
```

  It was removed with `git update-index --force-remove`. `git status --porcelain -- plugins` and
  `git diff --cached --name-only -- plugins` were both empty before each commit.
- `node --check` passed on grade.mjs, grade-rgr.mjs and cycle-logs.mjs, and `bash -n` on slim-arms.sh, run-ab.sh and
  run-rgr.sh.
- Fixture (`green.sh` in the session scratchpad). It sources the real `slim-arms.sh` with
  `SLIM_ROOT=D:/tmp/slim-claude-p/lbc-fixture` and simulates two back-to-back sessions per harness layout. Every
  session writes the reused `rules-b/cycle-log.md`, run 1 also writes `SLIM_ROOT/harness.log`, and
  `stale-cycle.md` / `rules-b/CLAUDE.md` were written before the first marker as controls. Each run is graded
  through `grade.mjs --cycle-logs` (the shared reader grade-rgr.mjs imports). Output (path prefix shortened to
  `<fx>`, file content after the colon):

```
== rules-ab/runs/b-1
  <fx>\rules-ab\runs\b-1\cycle-notes.md: notes of run 1
  <fx>\rules-ab\runs\b-1.cycle-logs\rules-b\cycle-log.md: cycle log of run 1
  <fx>\rules-ab\runs\b-1.cycle-logs\slim-root\harness.log: harness log of run 1
== rules-ab/runs/b-2
  <fx>\rules-ab\runs\b-2\cycle-notes.md: notes of run 2
  <fx>\rules-ab\runs\b-2.cycle-logs\rules-b\cycle-log.md: cycle log of run 2
== rgr-eval/T3/runs/b-1
  <fx>\rgr-eval\T3\runs\b-1\cycle-notes.md: notes of run 1
  <fx>\rgr-eval\T3\runs\b-1.cycle-logs\rules-b\cycle-log.md: cycle log of run 1
  <fx>\rgr-eval\T3\runs\b-1.cycle-logs\slim-root\harness.log: harness log of run 1
== rgr-eval/T3/runs/b-2
  <fx>\rgr-eval\T3\runs\b-2\cycle-notes.md: notes of run 2
  <fx>\rgr-eval\T3\runs\b-2.cycle-logs\rules-b\cycle-log.md: cycle log of run 2
== markers left after collect: 
== R1 dangling symlink named like a log in the run folder
cycle-notes.md
cycle-log.md
exit=0
== R3 no arguments
Usage: node grade.mjs --cycle-logs <sinceMs> <project>
exit=2
== R3 non-numeric since
Usage: node grade.mjs --cycle-logs <sinceMs> <project>
exit=2
== R3 too many arguments
Usage: node grade.mjs --cycle-logs <sinceMs> <project>
exit=2
```

  Each run gets its own copy of the reused log name. Run 1's `harness.log` is not credited to run 2, the
  pre-marker `stale-cycle.md` is collected nowhere, no marker is left, and the dangling `dangling-log` is skipped.
  The fixture was removed with `rm -rf D:/tmp/slim-claude-p/lbc-fixture`.
- Dry runs. `bash .claude/skills/lz-red-workspace/rules-ab-kata/run-ab.sh --dry-run a 1 b 1` printed `== a 1 exit=0`
  and `== b 1 exit=0`, with cwd `D:\tmp\slim-claude-p\rules-ab\runs\a-1` / `b-1`, `--plugin-dir
  D:\tmp\slim-claude-p\pkg\d02204d` and `--model opus`, and only arm b carried `--add-dir` for rules-b.
  `bash .claude/skills/lz-red-workspace/e2e-rgr-srvx/run-rgr.sh --dry-run T3 a 1 T3 b 1` printed
  `== T3 a 1 exit=0` and `== T3 b 1 exit=0`, with cwd `...\rgr-eval\T3\runs\a-1` / `b-1`, and again only arm b had
  `--add-dir` for rules-b. Both runs left `<run>.cycle-logs/` folders and no `.cycle-start` marker. Afterwards
  `rm -rf D:/tmp/slim-claude-p/rgr-eval/T3/runs` and `rm -rf D:/tmp/slim-claude-p/rules-ab/runs` removed exactly
  those folders. The dry runs' own `ensure_rules_b` call rewrote `rules-b/CLAUDE.md` and `test-first.md`, as every
  invocation of the runners does.
- `git diff --stat 1fae18c HEAD -- plugins`: empty. `git log --format='%h %ae %ce %s' 1fae18c..HEAD`: all four
  commits carry the gmail as author and committer.
- Email allowlist-inversion scan over the 11 changed files, run with a pattern that does not require a TLD. Besides
  the approved gmail it finds only non-addresses: `lz-tdd@0.0.2` (twice, check-red-references.mjs), `Pass@3`
  (RESULTS.md), and the dummy commit identity `eval@localhost` in run-rgr.sh line 32, which predates this task and
  which this task did not touch. Positive control: the same pattern on AGENTS.md prints the gmail twice.
- No `claude -p` or other metered run.

### Declined (orchestrator triage)

- No unit test of the N2 call site; the two end-to-end probes (120000 in Task 2, 160000 here) prove it.
- The recursive readdir still walks node_modules before filtering: slower on a big run folder, but it misses nothing.
- Review LOW 3 (name regex also matches `catalog`/`blog`/`login`; SLIM_ROOT junk) was not on the fix list. The
  SLIM_ROOT exposure now applies only to files changed during the run, copied into the run's own folder.
- Review COSMETIC T7 (nonexistent cwd tests the spawn-failure path, not a git non-zero exit) was not on the fix list.

## Known Stubs

None.

## Self-Check: PASSED

- Files: all 11 changed files exist; `lbc-red-task1.txt` and `lbc-red-round2.txt` exist, untracked.
- Commits: b61fdf5, e22b8fc, 36ea418 and 2915060 present in `git log`.
