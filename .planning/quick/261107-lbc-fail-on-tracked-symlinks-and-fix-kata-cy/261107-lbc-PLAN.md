---
phase: quick-261107-lbc
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - .claude/skills/lz-red-workspace/tools/lib/package-links.mjs
  - .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs
  - .claude/skills/lz-red-workspace/tools/check-red-references.mjs
  - .claude/skills/lz-red-workspace/rules-ab-kata/grade.mjs
  - .claude/skills/lz-red-workspace/rules-ab-kata/RESULTS.md
autonomous: true
requirements:
  - QUICK-261107-lbc
must_haves:
  truths:
    - "Item 1: a git index entry of mode 120000 under plugins/ is an N2 hit naming the path, so the checker exits 1; today's tree (zero such entries) stays green"
    - "Item 1: the mode is read from `git ls-files -s -z -- plugins` and parsed by a pure exported function in lib/package-links.mjs; a malformed record throws and a git failure throws, and N2 turns either throw into a hit (fail closed)"
    - "Item 1: EXPECTED_CHECKS stays 125 and LINK_RESOLVES_LABEL keeps its text, because the symlink hits go into the existing N2 report"
    - "Item 1: every new selftest case printed [FAIL] against the pre-fix code before the fix, and the SUMMARY quotes those lines verbatim"
    - "Item 2: grade.mjs finds a cycle log written in the rules folder (SLIM_ROOT/rules-b), in SLIM_ROOT itself, beside the run folder, or inside the run folder, when its mtime falls between the run's start and the result file's mtime; a fixture run shows the rules-folder log reported and the out-of-window and non-matching files excluded"
    - "No `claude -p` or other metered run; plugins/ is byte-unchanged; RESULTS.md numbers are unchanged"
  artifacts:
    - path: .claude/skills/lz-red-workspace/tools/lib/package-links.mjs
      provides: "symlinkEntries(listing) pure parser and trackedSymlinks(repoRoot) git reader"
      exports: ["trackedFiles", "symlinkEntries", "trackedSymlinks", "packageLinkProblems", "packageLinkGate"]
    - path: .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs
      provides: "red-first cases T1-T7 (tracked-symlink detection, no real symlink needed)"
    - path: .claude/skills/lz-red-workspace/rules-ab-kata/grade.mjs
      provides: "cycleLogs(since, until, project) and a --cycle-logs CLI mode for fixture checks"
  key_links:
    - from: .claude/skills/lz-red-workspace/tools/check-red-references.mjs
      to: .claude/skills/lz-red-workspace/tools/lib/package-links.mjs
      via: "N2 calls trackedSymlinks(repoRoot) and pushes one hit per entry (or one hit on throw) into deadLinkHits before the single report"
    - from: .claude/skills/lz-red-workspace/rules-ab-kata/grade.mjs
      to: "SLIM_ROOT/rules-b"
      via: "cycleLogs searches rulesDir, dirname(rulesDir), dirname(project), and project (recursive, node_modules excluded)"
---

<objective>
Close the two items left from the 2026-11-07 audit. Lars's request, verbatim: "Audit, triage, and then resolve any
open/owed/deferred items/runs other than Blocked item 1."

1. Make a tracked symlink under plugins/ a loud N2 failure, so the disk walk (`collectFiles`, which skips symlinked
   files for G17, N1 and N3) can never silently miss a shipped file. Closes the kd7 SUMMARY's Deferred item.
2. Make the rules-ab kata grader find arm-b cycle logs in the generated rules folder and its parent, the way
   `e2e-rgr-srvx/grade-rgr.mjs` already does, so RESULTS.md line 21's hand correction is no longer needed.

Output: two commits on `gsd/lz-tdd-0.0.3-lz-red`, plus an untracked SUMMARY for the orchestrator.
</objective>

<execution_context>
@~/.claude/gsd-core/workflows/execute-plan.md
@~/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md
@./CLAUDE.md
@.planning/quick/261107-kd7-close-the-package-link-gate-silent-passe/261107-kd7-SUMMARY.md
@.claude/skills/lz-red-workspace/tools/lib/package-links.mjs
@.claude/skills/lz-red-workspace/tools/package-links.selftest.mjs
@.claude/skills/lz-red-workspace/rules-ab-kata/grade.mjs
@.claude/skills/lz-red-workspace/rules-ab-kata/RESULTS.md
@.claude/skills/lz-red-workspace/slim-arms.sh

Read only these ranges of the large files:
- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` lines 620-670 (collectFiles and THE ONE WALK
  comment) and 820-860 (the N2 block: `trackedFiles` try/catch, `packageLinkGate`, `report`).
- `.claude/skills/lz-red-workspace/e2e-rgr-srvx/grade-rgr.mjs` lines 1-15 (rulesDir/slimRoot) and 166-196
  (`cycleLogs`, the `--outcome-only` CLI mode, `since` computation).

Facts already measured by the planner (2026-11-07):
- `git ls-files -s plugins` has zero mode-120000 entries; `core.symlinks` is true.
- The selftest is 66/66 green today. Its scratch git repo already stages a 120000 index entry
  `plugins/p/linked.md` through `git update-index --add --cacheinfo` (inside the `gateReadsActual` attempt), so no
  real filesystem symlink or Windows privilege is needed.
- `rules-ab-kata/out/` is git-ignored and absent, so no old run can be re-graded; verification uses a fixture.
- Node is v24.22.0.

Repo rules the executor keeps (from CLAUDE.md, AGENTS.md and the orchestrator brief):
- Commit identity: author AND committer `larsbrinknielsen@gmail.com`. Check `git config user.email` before the first
  commit. Never write any other maintainer email or its domain anywhere, not even as a search needle; verify with an
  allowlist-inversion scan (email-shaped tokens minus the approved gmail must be empty).
- No AI attribution in commits. Stage files by name. Multi-line messages via a file and `git commit -F <file>`, then
  `git log --oneline -1`.
- Search with `rg` or the Grep tool, never `grep`. Text edits through Edit/Write, never `sed -i`.
- JS style: blank line before and after `if`/`for`/`while`/`try`/`switch`/`return` (not as first or last line of a
  block), braces on every body, lowerCamelCase consts. Quotes follow each file: double quotes in tools/*.mjs, single
  quotes in grade.mjs. Match the surrounding comment density.
- Do NOT commit the SUMMARY, STATE.md or this PLAN; the orchestrator does.
- No `claude -p` or other metered run. plugins/ stays untouched (the item-1 index probe below is undone and verified
  before any commit).
</context>

<tasks>

<task type="auto" tdd="true">
  <name>Task 1: Red first -- selftest cases T1-T7 for tracked-symlink detection</name>
  <files>.claude/skills/lz-red-workspace/tools/package-links.selftest.mjs</files>
  <behavior>
    Two new exports of lib/package-links.mjs, reached through the existing `packageLinks` namespace import and the
    existing `attempt()` helper so a missing export fails its own case instead of ending the run:
    - `symlinkEntries(listing)`: pure. `listing` is the raw stdout of `git ls-files -s -z`, records
      `<mode> <object> <stage>TAB<path>` separated by NUL. Returns the paths whose mode is `120000`, in listing order.
      Throws an Error whose message starts with `malformed git ls-files -s record` on a non-empty record that does not
      have that shape.
    - `trackedSymlinks(repoRoot)`: runs `git ls-files -s -z -- plugins` in `repoRoot` and returns
      `symlinkEntries(stdout)`. Throws when git fails.
    Cases (build listings with string concatenation, `\t` and `\0`; use a 40-hex object id such as `"a".repeat(40)`):
    - T1: listing with two 100644 entries and one 120000 entry -> `[that path]`.
    - T2: listing with only 100644 and 100755 entries -> `[]`.
    - T3: a 120000 entry whose path holds a space and the non-ASCII `\u00f8` (as M2 uses) -> that path, verbatim.
    - T4: empty string -> `[]`.
    - T5: a record with no TAB (for example `"120000 x\0"`) -> the attempt result starts with
      `threw: malformed git ls-files -s record`. Assert on that prefix (a boolean), so a missing export, which yields
      `threw: ... is not a function`, still fails.
    - T6 (real git, in the existing scratch-repo `try`, AFTER the `gateReadsActual` attempt that stages the 120000
      entry): `attempt(() => packageLinks.trackedSymlinks(scratchRepo))` -> `["plugins/p/linked.md"]`. Declare the
      result variable beside `trackedActual`/`gateReadsActual` and `check` it after the `finally`, next to M2/W2.
    - T7 (fail closed, also inside the scratch-repo `try`): calling `trackedSymlinks` with a cwd that does not exist
      (`path.join(scratchRepo, "no-such-dir")`) throws. Record
      `typeof packageLinks.trackedSymlinks === "function" && String(attempt(...)).startsWith("threw:")` and expect
      `true`, so the missing-export run fails it.
  </behavior>
  <action>
    Add T1-T5 as a block with a one-line comment (style of the `// A fence still open...` comments) before the
    `// The tracked-set builder, against a real git repo` block; add T6 and T7 as described in the behavior block.
    Do not touch lib/package-links.mjs in this task. Run
    `node .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs > .planning/quick/261107-lbc-fail-on-tracked-symlinks-and-fix-kata-cy/lbc-red-task1.txt 2>&1; echo exit=$?`.
    It must exit 1 with exactly the seven T cases printing `[FAIL]` and all 66 earlier cases `[PASS]`
    (`7 of 73 assertion(s) FAILED`). If any earlier case fails, or a T case passes, fix the case, not the expectation
    direction. Keep `lbc-red-task1.txt` untracked; the SUMMARY quotes its `[FAIL]` lines and SUMMARY line verbatim.
    No commit in this task (the red state must not be committed; Task 2 commits test and fix together).
  </action>
  <verify>
    <automated>node .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs; test $? -eq 1 && rg -c "^\s+\[FAIL\] T[1-7]:" .planning/quick/261107-lbc-fail-on-tracked-symlinks-and-fix-kata-cy/lbc-red-task1.txt</automated>
  </verify>
  <done>Selftest exits 1; `lbc-red-task1.txt` shows exactly 7 `[FAIL] T` lines and `7 of 73 assertion(s) FAILED`; no earlier case fails.</done>
</task>

<task type="auto" tdd="true">
  <name>Task 2: Green -- symlinkEntries/trackedSymlinks and the N2 hit</name>
  <files>.claude/skills/lz-red-workspace/tools/lib/package-links.mjs, .claude/skills/lz-red-workspace/tools/check-red-references.mjs, .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs</files>
  <behavior>
    - Selftest 73/73 green.
    - Checker exit 0, N2 `[PASS]`, `125 checks, equal to the PREDICTED literal` on today's tree.
    - With a 120000 index entry staged under plugins/, the checker exits 1 and the N2 `[FAIL]` line names it.
  </behavior>
  <action>
    In lib/package-links.mjs, directly after `trackedFiles`, add `symlinkEntries(listing)` (pure; split on `\0`, drop
    the empty tail, split each record at its FIRST tab, require the head to match six octal digits, a space, hex
    object id, a space, one stage digit; throw `malformed git ls-files -s record: <record>` otherwise; collect the
    path when the mode is `120000`) and `trackedSymlinks(repoRoot)` (same `execFileSync` call shape as
    `trackedFiles`, argument list `ls-files -s -z -- plugins`, returns `symlinkEntries(stdout)`; a git failure throws
    from `execFileSync`, so the caller fails closed). JSDoc both like `trackedFiles`. Update the module header's last
    paragraph: N2 reads its sources from the tracked set, and a tracked symlink under plugins/ is itself a hit,
    because the disk walk the other gates use skips symlinked files.

    In check-red-references.mjs N2 block, import `trackedSymlinks` beside `packageLinkGate, trackedFiles` and, right
    after the `trackedFiles` try/catch, add a try/catch that pushes one hit per entry into `deadLinkHits`, text
    `<path>: TRACKED SYMLINK (mode 120000; the G17, N1 and N3 disk walk skips symlinked files, so none may ship)`, and
    on throw pushes `git ls-files -s FAILED (<err.code ?? err.message>), so a tracked symlink could not be ruled out`.
    Do not add a `report` call, do not change `LINK_RESOLVES_LABEL`, `EXPECTED_CHECKS` (125) or `NEW_LABELS`; the
    hits ride the existing N2 report, as kd7 did for unsupported link forms. Update the "THE ONE WALK" comment above
    `PLUGINS_DIR` with one clause saying N2 fails on a tracked symlink, so the walk skipping symlinks cannot hide a
    shipped file. Leave `collectFiles` itself unchanged (Lars's brief: fail loudly instead of following symlinks).

    End-to-end probe (index only, undone before commit): write a blob with
    `git hash-object -w --stdin` fed the text `README.md`, then
    `git update-index --add --cacheinfo 120000,<blob>,plugins/lz-tdd/lbc-probe.txt` (`.txt`, so the gate does not
    also try to read it), run `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs`, record exit 1 and
    the N2 `[FAIL]` line verbatim for the SUMMARY, then `git update-index --force-remove -- plugins/lz-tdd/lbc-probe.txt`.
    Confirm `git status --porcelain -- plugins` and `git diff --cached --name-only -- plugins` are both empty before
    continuing; stop and report if not.

    Commit the three files by name with a `-F` message file, subject
    `fix(lz-red-workspace): fail the package-link gate on a tracked symlink under plugins/`, body naming the deferred
    kd7 item and that the count stays 125.
  </action>
  <verify>
    <automated>node .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs && npm --prefix .claude/skills/lz-red-workspace run check && git status --porcelain -- plugins && git diff --stat 50e8dfb HEAD -- plugins</automated>
  </verify>
  <done>Selftest `73/73 assertions pass`; `npm --prefix .claude/skills/lz-red-workspace run check` exits 0 with `125 checks, equal to the PREDICTED literal` and every SUMMARY line GREEN; probe showed exit 1 with the TRACKED SYMLINK hit and was undone; plugins/ empty in status and in the commit's diff; commit author and committer are the gmail.</done>
</task>

<task type="auto">
  <name>Task 3: Kata grader finds rules-folder cycle logs, verified with a fixture</name>
  <files>.claude/skills/lz-red-workspace/rules-ab-kata/grade.mjs, .claude/skills/lz-red-workspace/rules-ab-kata/RESULTS.md</files>
  <action>
    In grade.mjs, port `cycleLogs` from `e2e-rgr-srvx/grade-rgr.mjs`. Add `slimRoot` (`process.env.SLIM_ROOT ??
    'D:/tmp/slim-claude-p'`) and `rulesDir = join(slimRoot, 'rules-b')` (the folder `ensure_rules_b` in slim-arms.sh
    generates), and derive `runsRoot` from `slimRoot`. Define `cycleLogs(since, until, project)` as a function
    declaration (hoisted, so a CLI branch can call it before the loop): search `rulesDir` and `dirname(rulesDir)` one
    level deep, `dirname(project)` one level deep, and `project` recursively with `node_modules` paths excluded
    (kept from the current grader); skip places that do not exist; keep regular files whose name matches
    `/cycle|log/i` and whose `mtimeMs` is `>= since` and `<= until`; return absolute paths. The `until` bound is
    Claude's addition over grade-rgr: runs are sequential and share rules-b, so without it a later run's log would
    be credited to an earlier run when grading after the queue. Add a CLI mode before the main loop, modelled on
    grade-rgr's `--outcome-only`: `node grade.mjs --cycle-logs <sinceMs> <untilMs> <project>` prints
    `JSON.stringify(cycleLogs(...))` and exits 0. In the main loop compute `until = statSync(resultFile).mtimeMs` and
    `since = until - result.ms`; when `result.ms` is not a finite number print `cycleLog=unknown (no ms in result)`
    instead of searching, so a missing duration never reads as "no log". Replace the old two-line `cycleLog` array
    with the call; drop the now-unused imports only if nothing else uses them.

    In RESULTS.md, change only the sentence at line 21 that says grade.mjs reported "-" and it was corrected by hand:
    keep it, and append one sentence that grade.mjs now searches the rules folder and its parent as well. No number
    in the file changes.

    Fixture (Git Bash, no metered run): `fx=D:/tmp/slim-claude-p/lbc-fixture`; `rm -rf "$fx"`; create
    `$fx/rules-b`, `$fx/rules-ab/runs/b-1/src`, `$fx/rules-ab/runs/b-1/node_modules/x`. Record
    `since` as `Date.now()` from node minus 60000 and `until` as `Date.now()` plus 60000. Create in-window files:
    `$fx/rules-b/cycle-log.md`, `$fx/harness.log`, `$fx/rules-ab/runs/b-1.cycle.md`,
    `$fx/rules-ab/runs/b-1/src/cycle-notes.md`. Create controls that must NOT appear: `$fx/rules-b/test-first.md`
    and `$fx/rules-b/CLAUDE.md` (name does not match), `$fx/rules-b/old-cycle.md` with `touch -d '2020-01-01'`
    (before since), `$fx/rules-b/next-run-cycle.md` with `touch -d 'tomorrow'` (after until),
    `$fx/rules-ab/runs/b-1/node_modules/x/cycle.log` (node_modules). Run
    `SLIM_ROOT="$fx" node .claude/skills/lz-red-workspace/rules-ab-kata/grade.mjs --cycle-logs $since $until "$fx/rules-ab/runs/b-1"`
    and check the printed list is exactly the four in-window files (path separators may be mixed; compare by basename
    plus parent). Then `rm -rf "$fx"`. Quote the command and its output in the SUMMARY.

    Commit grade.mjs and RESULTS.md by name, subject
    `fix(lz-red-workspace): find rules-ab kata cycle logs in the rules folder`.

    Then the closing gates: allowlist-inversion email scan over all five changed files (`rg -o -i` for email-shaped
    tokens, minus the approved gmail, must be empty; positive control: same pattern finds the gmail in AGENTS.md);
    `git log --format='%ae %ce' 50e8dfb..HEAD` shows only the gmail; `git diff --stat 50e8dfb HEAD -- plugins`
    empty (50e8dfb is the branch tip when this plan was written; if the orchestrator committed on top first, use
    the parent of the Task 2 commit instead). Write the
    SUMMARY at `.planning/quick/261107-lbc-fail-on-tracked-symlinks-and-fix-kata-cy/261107-lbc-SUMMARY.md` with the
    verbatim Task 1 `[FAIL]` lines, the probe line, the green evidence and the fixture output; do not commit it.
  </action>
  <verify>
    <automated>node --check .claude/skills/lz-red-workspace/rules-ab-kata/grade.mjs && npm --prefix .claude/skills/lz-red-workspace run check && git diff --stat 50e8dfb HEAD -- plugins</automated>
  </verify>
  <done>Fixture output lists exactly `rules-b/cycle-log.md`, `harness.log`, `runs/b-1.cycle.md` and `runs/b-1/src/cycle-notes.md`, and none of the five controls; RESULTS.md numbers unchanged (`git diff` shows one prose line); both commits present with gmail identity; email scan clean; SUMMARY written, untracked.</done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| git CLI -> checker | `git ls-files -s -z` output is parsed into gate decisions |
| executor -> git index | the item-1 probe stages a plugins/ entry in the real index |
| executor -> public repo | committed files and identity are public |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-lbc-01 | Tampering | symlinkEntries parser | medium | mitigate | A record that does not match the `ls-files -s` shape throws (T5); N2 turns the throw into a hit, never an empty list |
| T-lbc-02 | Denial of service | trackedSymlinks git call | medium | mitigate | git failure throws (T7); N2 pushes `git ls-files -s FAILED` and fails |
| T-lbc-03 | Tampering | probe index entry under plugins/ | medium | mitigate | `.txt` probe removed with `update-index --force-remove`; status and cached diff of plugins/ verified empty before commit; commit diff of plugins/ verified empty |
| T-lbc-04 | Information disclosure | commits and changed files | high | mitigate | gmail identity checked before commit; allowlist-inversion email scan over changed files with a positive control; no forbidden value written as a needle |
| T-lbc-05 | Repudiation | grade.mjs cycleLog attribution | low | mitigate | `until` bound keeps a later run's log off an earlier run; a missing `ms` prints `unknown`, not `-` |
</threat_model>

<verification>
- `node .claude/skills/lz-red-workspace/tools/package-links.selftest.mjs` exit 0, `73/73 assertions pass`.
- `npm --prefix .claude/skills/lz-red-workspace run check` exit 0, `125 checks, equal to the PREDICTED literal`.
- Probe: checker exit 1 with a `TRACKED SYMLINK` N2 hit while the 120000 entry was staged; undone.
- Fixture: `--cycle-logs` lists the rules-folder log and the other three in-window files, no controls.
- `git diff --stat 50e8dfb HEAD -- plugins` empty; no metered run.
</verification>

<success_criteria>
Package-links selftest green, the lz-red-workspace check battery exit 0 at 125 checks, and the grader fixture shows
the rules-folder cycle log, with both commits under the gmail identity and the SUMMARY left untracked.
</success_criteria>

<output>
Create `.planning/quick/261107-lbc-fail-on-tracked-symlinks-and-fix-kata-cy/261107-lbc-SUMMARY.md` (do not commit it).
</output>
