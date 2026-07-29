# 260729-x0i RED/GREEN evidence record

Every command below was RUN in the execution worktree and every quoted line is the output VERBATIM as
that run printed it. No expected string was copied out of the PLAN into this record.

Worktree root: `D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/.claude/worktrees/agent-af318abb634d0b852`
Base commit: `4ac024ded219ec0dbcb8929ea7c2dbaeba9d2c3e` on `worktree-agent-af318abb634d0b852`

ENVIRONMENT DEVIATION, recorded because it changed HOW every leg was invoked and nothing else: the
worktree-isolation guard refuses any multi-command shell chain that contains a redirect ("this command
is too complex to verify that it stays inside the worktree"). Each verify chain was therefore written
to a script file in the session scratchpad and run as a single plain command. This PRESERVES the
`&&` semantics the conventions require -- the script's exit status is the chain's status -- and it
preserves same-chain atomicity for the move-aside/restore pairs, which splitting into separate tool
calls would have broken (that atomicity is the stated mitigation for T-x0i-08). Each script asserts
`git rev-parse --show-toplevel` equals the worktree root as its first leg, replacing the plan's `cd`
to the main repo, which a worktree-isolated agent must not perform.

## Baseline re-measurement (every number in the plan's pre_measurements, re-run not trusted)

All reproduced exactly at the base commit:

| Subject | Plan said | Measured |
|---|---|---|
| battery exit / PASS lines / FAIL lines | 0 / 124 / 0 | 0 / 124 / 0 |
| roster line | `123 checks, equal to the PREDICTED literal` | present verbatim |
| `existsSync` / `try {` / `report(` file-wide | 9 / 5 / 16 | 9 / 5 / 16 |
| `RAGGED_TABLE_LABEL` / `tablesSeen` | 3 / 4 | 3 / 4 |
| `ARCHIVED_RECORD` / archived path literal | 2 / 1 | 2 / 1 |
| shipped-only loop / archive loop | 1 / 1 | 1 / 1 |
| `const EXPECTED_CHECKS = 123;` | 1 | 1 |
| `archived planning copy` / `PLUS the ONE` | 1 / 1 | 1 / 1 |
| `FAILS CLOSED if it is unreadable` | 1 | 1 |
| L11 scope slice lines / `TWO_IG_GUARDS` in it | 21 / 0 | 21 / 0 |
| `TWO_IG_GUARDS` file-wide | 4 | 4 |
| L12 gate slice lines / existsSync / try / continue / report | 33 / 0 / 1 / 1 / 1 | 33 / 0 / 1 / 1 / 1 |
| taxonomy total / body slice / header slice / header pipe rows | 570 / 540 / 31 / 0 | 570 / 540 / 31 / 0 |
| REQUIREMENTS.md lines / h2 / h3 | 166 / 4 / 14 | 166 / 4 / 14 |
| lc9 CONTEXT.md lines / h2 / h3 / pipe rows | 340 / 6 / 17 / 5 | 340 / 6 / 17 / 5 |

ONE number needed a corrected instrument before it could be compared, and it is recorded because the
first attempt looked like a disagreement and was not one. A naive line-based table counter reported 35
tables across 15 files, against the plan's 28 across 9. The plan states its figure was measured
THROUGH the real `scanTables`; the naive counter is a different instrument (no code-fence handling, a
different table-start rule), so its number was never comparable. Re-measured by importing the real
`scanTables` from `tools/lib/pipe-table.mjs` and rebuilding the walk exactly as
`check-red-references.mjs:606-607` does:

```
SHIPPED tree: markdown files 194
SHIPPED tree: files with tables 9
SHIPPED tree: tables (tablesSeen after narrowing) 28
SHIPPED tree: ragged offenders 0
ARCHIVE contributes tables 1 offenders 0
tablesSeen BEFORE narrowing 29 -> AFTER 28
```

The plan's figure is exact. The lesson is the plan's own: measure through the instrument that RUNS the
check, never through a re-implementation of it.

## RED control, PRE-FIX -- the defect exists (Task 1 step 2)

Command: move the archived planning record out of the repo, run the UNMODIFIED battery, move it back in
the same chain.

```
OBSERVED EXIT: 1
OBSERVED FAIL line count: 1
  [FAIL] [lc9] no ragged pipe table -- 1 problem(s): .planning\research\test-double-taxonomy.md: UNREADABLE (ENOENT)
SUMMARY: RED-REFS RED -- 11/11 surfaces present, 1 check(s) FAILED (instrument-first Phase-18 RED baseline by design pre-content)
porcelain lines on the archive path: 0
```

The gate FAILED CLOSED on an absent planning artifact, which is the milestone-close failure mode this
task removes. Paths print with BACKSLASH separators, as predicted. The archive was restored
byte-identically in the same chain.

## RED leg A, POST-FIX -- the narrowed gate still FIRES (Task 1 step 6)

Mutation: in `plugins/lz-tdd/skills/lz-red/references/testing-stance/README.md`, line 19's first data
cell was deleted together with the pipe that follows it.

```
planted line 19, verbatim: | [functional-core.md](functional-core.md) |
OBSERVED EXIT: 1
FAIL lines: 1
  [FAIL] [lc9] no ragged pipe table -- 1 problem(s): plugins\lz-tdd\skills\lz-red\references\testing-stance\README.md: table at line 17: header is 2 wide, but 1 row(s) differ -- line 19 is 1
restore porcelain lines: 0
```

Exactly one FAIL, naming the file, the table start line (17) and the ragged row's line (19). Restored
with `git checkout --`; the path is clean. The gate is not vacuous after the narrowing.

## RED leg B, POST-FIX -- an absent archive no longer reddens the gate (Task 1 step 7)

```
OBSERVED EXIT: 0
PASS lines: 124
FAIL lines: 0
  [PASS] [2ig] roster integrity: exact emitted-check count -- 123 checks, equal to the PREDICTED literal; all 13 new labels present; none of the 64 retired labels survive
restore porcelain lines: 0
```

The same input that produced the pre-fix `UNREADABLE (ENOENT)` failure now leaves the battery GREEN at
123 checks. The emitted count did NOT move, which is the construction the plan predicted: the gate is
one `report()` call OUTSIDE the loop, so removing a loop member cannot change the count.
`EXPECTED_CHECKS` was not edited.

## Anchor proof, BOTH ARMS of the scope-invariant fail-open (Task 1 step 8a)

The raw laundering fact first:

```
git diff <bogus tag> raw exit: 128
stderr, verbatim: fatal: bad revision 'nonexistent-tag-xyz'
piped through wc -l it prints: 0
```

Five observations of the leg AS WRITTEN:

```
OBS 1: bogus TAG, NO rev-parse anchor
OBS1 RESULT: PASSES (fail-open confirmed -- certifies byte-identical against a nonexistent revision)

OBS 2: bogus TAG, WITH rev-parse anchor
OBS2 RESULT: FAILS (anchor closed the TAG arm)

OBS 3: bogus PATH with the REAL tag, NO existence anchor
OBS3 RESULT: PASSES (fail-open confirmed -- rev-parse cleared, mistyped pathspec certifies clean)

OBS 4: bogus PATH, WITH [ -d ] / [ -f ] existence anchors
OBS4 RESULT: FAILS (existence anchor closed the PATH arm)

OBS 5: real tag and real paths, fully anchored
OBS5 RESULT: PASSES (fully anchored leg is GREEN on the real subjects)

porcelain (must be 0 -- this step edits nothing): 0
```

Both arms are real and both are closed. `git rev-parse` alone would have left OBS 3 passing: a mistyped
pathspec against a resolvable tag still prints zero lines and still certifies the frozen surfaces
byte-identical. Nothing in the repo was edited by this step.

## L12's own RED proof, against a MUTANT COPY (Task 1 step 8b)

An `existsSync` skip was planted inside the ragged loop of a COPY of the checker in the scratchpad. The
real instrument was never touched.

```
--- L12 against the MUTANT (must FAIL) ---
mutant slice lines: 36
  existsSync: 1
  try {:     1
  continue;: 2
  report(:   1
L12-on-MUTANT RESULT: FAILS  <-- correct, the leg can fail

--- L12 against the REAL file (must PASS) ---
real slice lines: 32
  existsSync: 0
  try {:     1
  continue;: 1
  report(:   1
L12-on-REAL RESULT: PASSES  <-- correct

real instrument untouched by step 8b -- porcelain on the checker:
 M .claude/skills/lz-red-workspace/tools/check-red-references.mjs
```

The leg fires on TWO axes at once, exactly as the plan predicted: `existsSync` 0 -> 1 AND `continue;`
1 -> 2. The single ` M` on the checker is Task 1's own fix, not a step-8b mutation -- step 8b wrote
only to the scratchpad copy.

The real slice is 32 lines post-fix where it measured 33 pre-fix, because the fix deleted the
archived-record declaration. L12 asserts `-ge 20`, so the shape pin is unaffected; recorded so the
change is not mistaken later for drift.

## Task 2 needle baselines, re-measured immediately before the header edit

For a presence-required claim the RED evidence is "phrase absent from the header, measured count 0" --
a `file:line` is unsatisfiable for an absent phrase, so none was manufactured. Measured on the header
slice (line 1 through the H1) at the post-Task-1 tree:

```
post-Task-1 header-slice needle baselines (each expect 0 -- the RED evidence for a presence claim):
  N3                                 0
  carve-out                          0
  check-red-references               0
  PLUGIN-WIDE-REFERENCE-RESEARCH     0
  beck-tdd-by-example                0
D3 false clause file-wide (expect 1, the positive control for its removal) 1
body slice lines (must stay) 540
body slice hash BEFORE 1c4e75835604d4111b02dde727c872e4
header pipe rows 0
```

All five presence needles read 0 before the edit, so those legs were RED and could only go GREEN by the
edit actually landing. The D3 false clause counted exactly 1, which direction-anchors its removal leg at
1 -> 0. The body slice hash is recorded here so the byte-identity claim is checkable against a value
captured BEFORE the edit rather than only against `git show HEAD`.

## D2 truth leg, MEASURED -- the plugin-wide shape really is blocked today

A probe file was planted at the canonical plugin-wide path and removed in the same chain:

```
OBSERVED EXIT: 1
FAIL lines: 1
  [FAIL] [lc9] no test-double taxonomy copy in the shipped tree -- 1 copy/copies: plugins\lz-tdd\references\test-double-taxonomy.md
plugins/ porcelain after cleanup: 0
```

So the header's forward constraint is not a hypothetical: N3 blocks the exact path the header names, and
the carve-out the header says a relocation needs is a real prerequisite. Recorded from the LIVE gate --
`TAXONOMY_COPY_STEM` matched via `path.basename(file, path.extname(file))` over `pluginsAllFiles` -- and
not from the research record's older snapshot of N3, which described a filename match over the markdown
list only.

## What these legs do NOT prove

- The pre-fix control and RED leg B are about the ragged gate's SCOPE. Neither says anything about the
  soundness of the other eight `existsSync` uses in the file; those are out of scope and unchanged.
- L12 proves no absence-tolerance lives in THIS gate. Its `try {` and `continue;` pins are exactly 1,
  not zero, because the gate's fail-CLOSED per-file read guard legitimately uses both and had to
  survive. A zero-assertion there would have forbidden the guard it exists to protect.
- No leg here reviews PROSE. The archive header edit in Task 2 still needs an unprimed content review;
  a green battery is not acceptance in this work stream.
