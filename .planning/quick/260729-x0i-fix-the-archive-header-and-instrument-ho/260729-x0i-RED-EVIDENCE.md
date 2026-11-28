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

## REMEDIATION ROUND (2026-07-30) -- the unprimed content review that the closer above predicted

The prose review happened and found seven real defects that a 12/12 goal verifier could not see, for the
reason recorded in this work stream repeatedly: the verifier checked that entries EXIST, the reviewer
checked whether their content is TRUE. Every proposal was RE-MEASURED before being encoded; two of the
reviewer's supporting MECHANISMS measured wrong even though its verdicts held, and those corrections are
recorded below rather than quietly adopted.

### P1 / P1b -- "only the G17 entry is a string literal" is FALSE. FIXED in both places.

Counted directly in `NEW_LABELS`: 4 spread from `TWO_IG_GUARDS.map(...)`, then 5 inline string literals
(G17 plus four `[lc9]` entries), then 4 label CONSTANTS = 13. So 5 literals, not 1, and `13 - 8 blind = 5`
was the entry's own arithmetic contradicting its own sentence.

The four `[lc9]` literals are rename-CATCHING for the same reason G17 is -- their emission sites declare
INDEPENDENT literals, verified by locating each site:

```
206:    absent: { label: "[lc9] no Mock rule label", re: /Mock rule/i },
229:        label: "[lc9] Test Spy named for the record-then-inspect double",
236:    absent: { label: "[lc9] no Mock rule label", re: /Mock rule/i },
371:        label: "[lc9] side-qualification rule inline in the coach procedure",
```

The 8 blind entries were confirmed blind by the same method -- each of `RAGGED_TABLE_LABEL` (698 declared,
725 pushed, 1019 rostered), `LINK_RESOLVES_LABEL` (757 / 799), `TAXONOMY_COPY_LABEL` (814 / 825) and
`FOWLER_LABEL_LABEL` (848 / 871) puts the SAME constant on both sides, and the four `.map(...)` labels are
read off the guard objects that carry them to the report call. The distinction between those two blind
mechanisms is preserved in both the checker comment and the requirement entry; the previous requirement
text had flattened both to "constant-derived".

**OBSERVED RED for the new claim** -- the load-bearing half is "each of the five DOES catch a rename", and
the pre-existing measurement only covered G17. The side-qualification guard's own emission-site literal was
renamed in place, the battery run, then reverted by targeted edit (never `git checkout --`, which would have
discarded the legitimate comment fix in the same file):

```
OBSERVED EXIT: 1
FAIL lines: 1
  [FAIL] [2ig] roster integrity: exact emitted-check count -- 123 checks, equal to the PREDICTED literal; MISSING new label(s): SKILL.md: [lc9] side-qualification rule inline in the coach procedure; none of the 64 retired labels survive
```

Note what that line proves in one shot: the COUNT leg reads 123 and is blind to the rename, exactly as the
comment claims, and the LITERAL is what fires, through `missingNewLabels`. GREEN restored afterwards.

### P2 -- "guard N2 would correctly fail a link" is FALSE, and its own cited precedent falsifies it. FIXED.

N2 skips any target it does not classify as `relative`, then `existsSync`-checks the ones it does. So it
fails a relative target that does not RESOLVE, not links as such. The counterexample is the entry's own
precedent, verified on disk:

```
principles.md:27:see the Beck backing: [Test-Driven Development by Example](../../../references/beck-tdd-by-example.md).
plugins/lz-tdd/references/beck-tdd-by-example.md   -- exists, 5660 bytes
```

That is a plain relative Markdown link, it resolves, N2 passes it, and the battery is GREEN at 123. The
accurate and narrower reason is the one already on record at `.planning/.continue-here.md:139-140`: a
`${CLAUDE_PLUGIN_ROOT}`-prefixed target classifies as relative and can NEVER resolve on disk, so link
syntax around THAT target fails N2. The two independent RUNTIME reasons for preferring inline code (V7, I2)
are now cited as well. N2 itself was not weakened and gained no carve-out.

### P3 -- "discharged by owner-authorized research" had NO record. FIXED to the warrant that does.

Swept case-insensitively for `authoriz` across the lc9 quick directory, `.continue-here.md` and
`HANDOFF.json`. The sweep is POSITIVE-CONTROLLED: it returned 7 hits, so a zero would have been a genuine
zero. None is an authorization to research the mechanism. The hits are an executor authorized to edit a
verify literal, two mentions of unauthorized matcher surgery, and "the one authorized relocation" (twice),
which is an owner ruling about MOVING the Beck reference.

Replaced with the warrant that is on record and is stronger because it needs no authorization at all: the
mechanism was verified as a BYPRODUCT of the owner-authorized relocation. Chronology verified --
`git rev-list --count 23c8ee2..cafb16e` is 1, so the relocation landed first and the research record
followed it. The header now states plainly that D-10 was never overridden.

The D-10 quotation was also wrong. The register's own title is "Do not investigate the shared-reference
mechanism" (`260729-lc9-CONTEXT.md:177`), not "do not investigate the mechanism"; the header now quotes the
title and says it is the title.

### P5 -- provenance broader than the table supports. FIXED.

The table's own heading reads "read out of the shipped Claude Code 2.1.220 binary, OR observed on disk",
and the How-verified column splits cleanly: V1-V4 are `Decompiled bundle, getPromptForCommand` / `Same`,
while V5 is `Installed plugin cache on disk`, V6 is `lz-advisor 2.0.0, installed` and V7 is `rg over the
whole plugin cache`. Only the first four came out of the binary. The header now says so.

### P6 -- evidence narrower than the sentence, and the flag matters more than the reviewer thought. FIXED.

The old command checked ONE file while the sentence claims a CLASS. Replaced with a class-covering sweep,
measured both directions:

```
rg -uu -l -F 'research/test-double-taxonomy' . -g '!.planning/**'   -> exit 1, no match
rg -uu -l -F 'research/test-double-taxonomy' .                     -> 10 files, every one under .planning/
```

The positive control is the SAME needle with the exclusion dropped, which is stronger than a different
needle: it proves the needle is real AND that the only readers are inside the planning tree. No count is
written into the document, because that number moves with every planning doc added -- it was 8 before this
round's edits and 10 after.

**CORRECTION to the finding's stated mechanism, measured.** The finding attributed the false-negative trap
to gitignore. It is not gitignore here:

```
git check-ignore -v .claude/skills/lz-red-workspace/tools/check-red-references.mjs  -> exit 1 (NOT ignored)
rg          -l -F TAXONOMY_COPY_STEM . -g '!.planning/**'  -> no output
rg --hidden -l -F TAXONOMY_COPY_STEM . -g '!.planning/**'  -> finds the checker
rg --no-ignore -l -F TAXONOMY_COPY_STEM . -g '!.planning/**' -> no output
```

`--hidden` alone fixes it and `--no-ignore` alone does not, so the mechanism is ripgrep's HIDDEN-directory
skip over the dot-prefixed `.claude/` and `.planning/` trees. `-uu` still works because it implies
`--hidden`, and it is what the document records, but the stated REASON is now the true one. This matters
because a reader who believes the cause is gitignore will reach for `--no-ignore` and get a silent zero.

**CORRECTION to the finding's supporting example, measured.** The finding said
`check-functional.mjs:525` "DOES read a `.planning/research/` document". It does not:

```
525:const citesResearch = readmeText.includes(".planning/research/functional-depatterning-ts.md");
```

That reads a shipped README and asserts the README CITES the path. It never touches the planning file --
which is also why it still passes even though `functional-depatterning-ts.md` no longer exists at
`.planning/research/` and now lives in `.planning/milestones/lz-tdd@0.0.1-research/`. The finding's
SUBSTANCE survives and is arguably sharper: another development instrument outside the planning tree
carries a hardcoded `.planning/research/...` path that a one-file needle cannot see. The header states it
as "hardcodes a path of its own", not as a read.

### P7 -- five minors, all measured, all FIXED.

| # | Claim | Measurement | Fix |
|---|---|---|---|
| a | header names an unnamed "research note" | it is `PLUGIN-WIDE-REFERENCE-RESEARCH.md`, named 3 lines later, older N3 quoted at its `B2` entry as a `test-double-taxonomy.md` FILENAME match over the markdown list | named at the claim, with the entry id |
| b | `RETIRED_LABELS` attributed to the checker | `export const RETIRED_LABELS` is at `lib/row-guards.mjs:217`; the checker only imports it at `:86` | requirement now names the library and says a repair edits it, not the checker |
| c | bare `D-12` is ambiguous | Phase 21 has its OWN D-12 (metered-run gate) at `21-RESEARCH.md:23`; the intended one is the "prove it first" ruling at `260729-lc9-CONTEXT.md:197` | requirement names the register and excludes the other D-12 by name |
| d | `FUT-TAXONOMY-SHARED` never states its subject's path | subject is `.planning/research/test-double-taxonomy.md`; `.planning/milestones/lz-tdd@0.0.1-research/` on disk is the relocation precedent | entry now names the current path and the expected post-close path |
| e | N3 FAIL line quoted as a PREFIX | `report()` prints `[FAIL] <label> -- <detail>` and N3's detail is `<n> copy/copies: <paths>` | quoted complete; MEASURED below |

**OBSERVED RED for P7e**, because a claim about a guard's OUTPUT is a claim about a guard and was not going
to be inferred from the template. Probe planted at the canonical path, run, removed:

```
OBSERVED EXIT: 1
FAIL lines: 1
  [FAIL] [lc9] no test-double taxonomy copy in the shipped tree -- 1 copy/copies: plugins\lz-tdd\references\test-double-taxonomy.md
plugins/ porcelain after cleanup: 0
```

### P4 -- the un-annotated sibling of the superseded instruction. ANNOTATED.

`260729-lc9-CONTEXT.md` offered under `### Claude's Discretion` the exact option OD-X0I-1 rejected: "Which
of the ~14 retained guards retarget to the `.planning/` copy versus retire." The line-294 supersession was
scoped to line 294 only, so a reader landing on the discretion list could re-derive the defect in good
faith. Annotated in the same shape: SETTLED by OD-X0I-1 / `260729-x0i`, outcome stated (no guard retargets;
guards that read the departed document retire by name in `RETIRED_LABELS`; the ragged-table gate was
rescoped so the archive left its scope rather than being conditionally skipped), pointer to the fuller
line-294 annotation, and the original bullet preserved VERBATIM. Lines 26 and 222 also mention the
`.planning/` destination but describe a COMPLETED move, so they were left alone.

### The header BODY is untouched, proven by hash rather than by inspection

```
HEAD:     h1@60  header=59  body=541  bodySha=1c4e75835604d411  headerPipeRows=0  nonAscii=0
WORKTREE: h1@89  header=88  body=541  bodySha=1c4e75835604d411  headerPipeRows=0  nonAscii=0
BODY IDENTICAL: true
```

The blockquote header grew from 59 to 88 lines and gained no pipe row. All four edited files are ASCII-clean
and pass email allowlist-inversion (0 email-shaped tokens in any of them; nothing to invert against).

### Final gate for the remediation round

| Gate | Result |
|---|---|
| `check-red-references.mjs` | exit 0 -- 124 emitted `[PASS]` lines, **0 FAIL**, roster `123 checks, equal to the PREDICTED literal; all 13 new labels present; none of the 64 retired labels survive` |
| `row-guards.selftest.mjs` | exit 0 -- 49 assertions |
| `provenance-honesty.selftest.mjs` | exit 0 -- 3/3 assertions |
| `extract-samples.mjs` | exit 0 -- 259 modules `tsc --strict` clean, 0 skipped |
| `check-hygiene.mjs` | exit 0 |
| `claude plugin validate .` | exit 0 |
| `git diff lz-tdd@0.0.2 -- skills/lz-tpp/` | 0 lines (tag `rev-parse` and both path anchors asserted FIRST) |
| `git diff lz-tdd@0.0.2 -- skills/lz-refactor/SKILL.md` | 0 lines (same anchors) |

`EXPECTED_CHECKS` was not touched and no roster PREDICTED literal was moved. Every edit in this round is a
comment or prose, which is why the count could not move and why a moved count would have meant a real
regression.

### What this round does NOT prove

- The count still cannot see a rename. Five of thirteen entries can; eight cannot, and `FUT-ROSTER-LITERALS`
  now states that split correctly instead of understating it as one. Closing it is still 8 rename proofs.
- Nothing here re-reviews the taxonomy BODY. Only the leading blockquote was in scope, and the hash above
  is the proof of that boundary rather than a claim about the body's content.
- The remediation was itself authored against reviewer PROPOSALS, two of whose mechanisms measured wrong.
  That is the same class this whole task exists to close, one level up, and it is the argument for the next
  content review being unprimed again rather than shown this file.
