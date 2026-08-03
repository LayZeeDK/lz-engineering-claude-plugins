---
phase: quick-260729-lc9
plan: 01
subsystem: lz-red instrument + lz-tdd shipped references
tags: [instrument-first, guard-retirement, taxonomy-removal, archive]
status: complete
---

# Quick 260729-lc9: Scope the test-double taxonomy to lz-red -- Summary

The test-double vocabulary map no longer ships in any lz-tdd skill; the constraint that
it must not is now machine-enforced rather than prose-enforced, and the dead-link class
the removal creates is closed by a general guard the battery did not previously carry.

Five commits. Battery re-scoped 174 -> 183 -> 125, GREEN at 125 with the roster gate
holding; selftest GREEN; `check-hygiene.mjs` GREEN; `claude plugin validate .` passes;
tree clean.

This file was written incrementally as each task completed, so a mid-run interruption
would have lost nothing.

## Base verification (before any work)

- `git rev-parse HEAD` = `09908625d9ccafd07ac41230d38361d8fdbb350e` -- EXACTLY the
  EXPECTED_BASE handed to me. No `git merge --ff-only` was needed.
- Anchor subject at that SHA reads
  `docs(quick-260729-lc9): commit the revised plan and its planning artifacts`. [OK]
- `git status --short` EMPTY at start.
- **Discrepancy recorded, not acted on:** the dispatch brief said the PLAN is 1591
  lines; `wc -l` measures **1635**. It is neither of the two stale sizes the brief
  named (~726, ~1295), and HEAD is byte-identical to EXPECTED_BASE, so the plan
  content is by definition the committed revision. Proceeded. The 44-line delta is
  a bookkeeping error in the brief, not a stale base.

## STEP ZERO -- SKIPPED (clean-tree fallback taken)

Task 1's step zero (`PLAN.md:193-226`) was already performed by the orchestrator as
commit `0990862`. The tree was clean at my start, so I took the documented
clean-tree fallback: **skipped that commit and edited NO verify literal** (NB-5 --
the permission to edit one is withdrawn). Task 4's chain pins the five mandatory
subjects individually and bounds the conventional-type total at `-le 6`; with the
step-zero commit already present plus my five, the total is exactly 6 and the
ceiling holds unmodified.

So I make FIVE commits, not six.

## Pre-change instrument baseline (measured, not assumed)

| Tool | Exit | Reading |
|---|---|---|
| `check-red-references.mjs` | 0 | GREEN at 174 emitted checks, roster gate holding |
| `row-guards.selftest.mjs` | 0 | GREEN, all assertions pass |
| `check-hygiene.mjs` | 0 | GREEN, ASCII + email + no-verbatim all clean |

**The 58 retiring labels were transcribed from a CAPTURED RUN, not from memory.** I
patched a throwaway copy of the checker (same directory, so `repoRoot` resolves
identically) to echo every `emittedLabels.push(label)` value behind a unique
sentinel, ran it, extracted the labels, and deleted the copy before doing any work
(`git status` re-verified clean). That gives the label strings unambiguously rather
than by reverse-engineering the printed ` -- detail` suffix. The set is exactly 58
and decomposes as the plan predicts: 29 topics + 1 auto scaffold + 14 absent +
1 sha256 + 2 taxonomy row-scoped + 1 `taxonomyRowBacked` + 9 count + 1 chronology.
`174 - 58 + 9 = 125` confirmed against the real emitted set.

Per mandatory instruction 4, the labels are recorded as the **emitted labels**, with
NO ` -- sha256 ...` detail appended (`check-red-references.mjs:638` sets
`TAXONOMY_LABEL` to the short form; the sha256 is a separate `detail` argument).

## Commits

| # | Task | SHA | Subject | Verify block exit |
|---|---|---|---|---|
| 1 | Task 1 instrument | `62b1c12` | `test(quick-260729-lc9): add nine guards with proofs, RED baseline recorded` | **0** |
| 2 | Task 2 | `1d13144` | `fix(quick-260729-lc9): name the Test Spy, drop the Mock rule label, attribute mockist` | **0** |
| 3 | Task 3a | `a13ae7d` | `refactor(quick-260729-lc9): scope the test-double taxonomy to planning, re-scope the battery` | (block runs after 3b) |
| 4 | Task 3b | `60ef38a` | `refactor(quick-260729-lc9): delete the unreferenced count-guard surface` | **0** |

### Task 1 -- nine guards, instrument-first

Verify block run VERBATIM, observed exit **0**. Readings:

- `row-guards.selftest.mjs` exit 0; 6 `scanTables:` PASS lines, 6 `findLinkTargets:`
  PASS lines, exactly 1 `escaped pipe` PASS line, offender string present exactly once
  in the source.
- `check-red-references.mjs` exit 1 with EXACTLY **8** `[FAIL]` lines, matching the
  plan's enumerated set line for line. Roster gate PASSES at **183 checks**, all 43
  new labels present, none of the 6 retired labels surviving.
- `[lc9] no ragged pipe table` PASSES -- invariant-GREEN, proof is the fixture set.
- `git status --short plugins/` EMPTY: nothing shipped was touched.

**I MEASURED rather than transcribed two things the plan supplied as prose.** Both
came out exactly as the plan stated, on my own implementation:

1. **N9's three-way discrimination, through the REAL evaluator.** Wrote three
   variants of the live `lz-red/SKILL.md`, ran the real checker for each, read the
   emitted verdict line for N9's label: `absent -> [FAIL]`,
   `in-procedure -> [PASS]`, `appendix-only -> [FAIL]`.
2. **The FORBIDDEN bare needle as a negative control.** Same three variants against
   a throwaway checker copy carrying `/which side they mean/i`:
   `absent -> [FAIL]`, `in-procedure -> [PASS]`, `appendix-only -> [PASS]`. So the
   bare needle IS satisfied by the appendix placement its label would forbid, and
   the region scope is load-bearing rather than decorative.

   Both probes restored `lz-red/SKILL.md` to its committed bytes and asserted the
   restore; the throwaway checker copy was deleted. `git status` verified clean after
   each.

**The four ZEROES written into N2's comment were verified, not copied.** Measured over
the shipped tree: 0 external-scheme links, 0 absolute links, 0 reference-style link
definitions, 0 links inside code fences. Also confirmed the plan's dated snapshot
exactly: 197 files, 31 tables, 405 pipe rows, 0 ragged, 1014 inline links (984
relative + 30 anchor). Per the plan's general rule, only the zeroes went into the
instrument; the totals went into the RED-BASELINE record, which is dated by
construction.

### Task 2 -- three D-05 correctness fixes, narrowly

Verify block run VERBATIM, observed exit **0**.

**Blast radius re-measured BEFORE editing, per the plan's instruction that my
measurement wins over its prose. It matched the plan exactly:**

- literal `warranted double` on 5 lines in 4 files (`anti-patterns.md:38,166`;
  `test-structure-and-assertions.md:130`; `message-matrix.md:79,137`);
- exact `the one warranted double` on 4 of those 5 (`:38` reads "that one");
- four further differently-phrased lines a literal grep misses:
  `anti-patterns.md:128` ("the one warranted BOUNDARY"), `message-matrix.md:57`,
  `message-matrix.md:73`, `vitest-typescript-mechanics.md:66`.

Exactly TWO lines edited (`:57` for its label word plus the Test Spy naming, `:137`
the in-fence comment); all SEVEN out-of-scope sites untouched and each pinned by its
own literal.

Readings: battery exits 1 with EXACTLY **4** `[FAIL]` lines, and they are exactly the
two taxonomy-deletion guards plus the two inline-rule guards. N4, N5, N6 and N7 all
flipped to PASS. Roster still 183. `Mock rule` now occurs in ZERO files under
`plugins/`. `Fowler's label` in exactly two files. `principle-backing.md` still 37
pipe-leading lines, and `[lc9] no ragged pipe table` still PASSES -- which is the
width control that the line count alone cannot provide.

Also verified separately: no in-document link targets the renamed
`## Mock rule: no doubles in the core` anchor (`git grep -i 'mock-rule'` over
`plugins/` returns nothing), so relabelling the H2 broke no anchor. No leg covers
that; I checked because renaming a heading is an anchor change.

### Task 3 -- the move, the deletion, the re-scope (two commits)

Task 3's single verify block runs after 3b, observed exit **0**.

**THE AFTER-3a BATTERY READING THE PLAN REQUIRES, and it was actually taken -- not
reconstructed from the after-3b run:**

```
BATTERY EXIT=0
[PASS] [2ig] roster integrity: exact emitted-check count -- 125 checks, equal to the
PREDICTED literal; all 13 new labels present; none of the 64 retired labels survive
```

**Emitted count after 3a: 125. Emitted count after 3b: 125.** Both runs taken
separately. Together with the legged fact that 3b's changed-file set is exactly
`lib/row-guards.mjs` + `row-guards.selftest.mjs`, that is the evidence 3b deleted only
unreferenced code.

`git log -M` reports `R100` exactly once for the move, so the archived copy arrived by
a PURE rename with no content change (H2 honoured -- no edit was applied to
`plugins/**/test-double-taxonomy.md` before moving it).

**The 58 retirements were spliced in from the CAPTURED PRE-CHANGE RUN by script**, not
hand-typed, so the machine-readable strings cannot carry a typo. The build step
asserted the captured set was exactly 58 and printed the three unusual shapes for
inspection; they are precisely the three the plan predicted:

- `[j9m] test-double-taxonomy.md: no scaffold phrase` (bracket prefix FIRST)
- `[j9m] test-double-taxonomy.md byte-identical across all three skills` (NO colon)
- `[2ig] owned-source count re-derived across both files` (no filename prefix)

Per mandatory instruction 4, all 58 are the EMITTED labels with no ` -- sha256 ...`
detail appended. `RETIRED_LABELS.length` = 64, all unique.

`\bTAX\b` is at count 0 in `lib/row-guards.mjs` (mandatory instruction 3), while
`TAXONOMY_LINES` survives in the selftest with a comment recording that it is a
synthetic fixture and the only one exercising two `parseRows` cases.

`lz-refactor/SKILL.md`: the H2 section was DELETED outright with NO replacement and no
heading pin added (mandatory instruction 5, F-4).

## Deviations from plan

### `[Rule 2 - missing critical functionality]` The `oneRow` duplicated-row proof was retargeted, not deleted

- **Found during:** Task 3, commit 3a (the selftest crashed with
  `TypeError: ROW_SCOPED_GUARDS.bernhardtDeliveryNamed is not a function`).
- **Issue:** the selftest's `oneRow: a DUPLICATED target row -> FAIL` case keyed on
  `bernhardtDeliveryNamed`, one of the three guards this task retires. The plan's
  step 14 enumerates the fixture blocks to delete but does not mention this case,
  which sits outside them. `oneRow` is the ANTI-VACUITY SPINE shared by every
  row-scoped guard in the module, and this was the only proof that finding TWO rows
  fails as loudly as finding none. Deleting the case would have silently removed that
  proof while leaving the selftest green.
- **Fix:** retargeted the case to a SURVIVING guard (`threeLawsRowBacked` over a
  duplicated Three Laws row), which exercises the identical shared code path. Verified
  it still FAILS on the duplicate.
- **Files modified:** `.claude/skills/lz-red-workspace/tools/row-guards.selftest.mjs`
- **Commit:** `a13ae7d`

### `[Rule 3 - blocking]` The archive path had to be a single joined literal

- **Found during:** Task 3, step 7 verification.
- **Issue:** I first wrote `path.join(repoRoot, ".planning", "research", "test-double-taxonomy.md")`,
  which is the surrounding file's idiom but produces NO occurrence of the literal
  `.planning/research/test-double-taxonomy.md`, so leg 13 read 0 and failed.
- **Fix:** `path.join(repoRoot, ".planning/research/test-double-taxonomy.md")` -- the
  literal now lives in the CODE, deliberately not in a comment, since a comment would
  satisfy the leg while leaving the path unwired (exactly the mentioned-vs-wired gap
  the plan routes to followup item 6).
- **Files modified:** `.claude/skills/lz-red-workspace/tools/check-red-references.mjs`
- **Commit:** `a13ae7d`

### Stale-claim sweeps beyond the four the plan enumerates

Step 8's second sweep target says to CHECK rather than assume. Checking found four
further stale claims that no leg covers, all of which I corrected in the same commits:

1. `check-red-references.mjs:58` -- a comment asserting "the taxonomy label constant
   below belongs to the sha256 byte-identity gate", pointing at a deleted gate.
2. `lib/row-guards.mjs` module header -- described a count-re-derivation half that no
   longer exists and a FLATTEN-BEFORE-MATCHING invariant with nothing left to flatten.
   This one was FORCED as well as correct: leg 26 asserts one of the deleted
   identifiers is absent from the file, and the header named it.
3. `lib/row-guards.mjs` section banners -- "Seven ROW-SCOPED guards" (now four) and
   "The SIX superseded file-scoped needles" (now one per surviving guard).
4. `row-guards.selftest.mjs` -- "Fourteen of the guards ... correctly PASS", the
   "seven ROW-SCOPED guards" banner and console line, the count-re-derivation banner,
   and the fixture-block numbering (which still read 1..7 with gaps).

Task 1's own comments were re-read per the same step and carry NO tree-dependent
number, as its general rule requires -- so that half of the sweep found nothing, which
is the intended outcome rather than a skipped check.

### Task 4 -- the archived copy as an honest inert record

Verify block run VERBATIM after the commit, observed exit **0**. All sixteen content
legs, the five commit-subject pins, the `-le 6` ceiling, the `.claude/agents/` gate,
all four hygiene subjects, both tools, plugin validation and the clean-tree leg.

All SIX mandated header literals present. The header states the status, why the record
is kept, the three failed gates with round three's actual verdict, what remains open
(including that the oracle agent has no search tool, which is why the absence claims
cannot be verified), and the D-02 forward constraint recorded but NOT investigated.

C-B1 is re-sourced to the essay the four dependent sites actually name, and the wrong
source is not merely deleted but INVERTED -- the paragraph now says explicitly that
the report and essays in the table below do NOT carry the position, so the record shows
what the error was. Both NOT-OPTIONAL qualifiers stay attached, and the dead relative
link is replaced by a plain repository path rather than another link.

**I also ran the mutation test the plan deliberately kept OUT of the verify chain** (it
would have to mutate a committed file, re-run and restore, leaving the tree dirty if a
later leg failed). Deleting one data cell together with its pipe from a table in the
archived record made the battery FAIL:

```
[FAIL] [lc9] no ragged pipe table -- 1 problem(s):
.planning/research/test-double-taxonomy.md: table at line 279: header is 9 wide,
but 1 row(s) differ -- line 281 is 8
```

That is direct evidence guard N1's archive path is **IN THE LOOP**, not merely present
as a literal in the checker -- which is exactly the uncertainty `<orchestrator_followup>`
item 6 exists to resolve by reading. The restore was asserted byte-identical. It also
discharges `must_haves.truths` entry 3 empirically: the failure names the table's start
line AND the ragged row's line.

## Holes I found rather than banked

The plan asks for these explicitly, and notes the last two executors' self-reported
weaknesses were all confirmed.

1. **N3's evidence form is unsatisfiable as the plan's direction table words it.** The
   table demands "a `file:line` per hit" for every ABSENCE-required guard, and lists N3
   among them. But N3 keys on a BASENAME, so its hit is a path -- there is no line to
   cite. I recorded the three paths and said so in the RED-BASELINE rather than
   fabricating `:1`, which would have been a worse record. This is the same
   self-contradiction shape the plan says cost an earlier round a cycle, surviving in
   one cell of the table that fixed it.

2. **The plan's `<output>` requires a SUMMARY, but the `-le 6` ceiling leaves no commit
   for it.** Five mandatory conventional-type commits plus the already-existing
   step-zero commit make exactly 6, so a seventh `docs(quick-260729-lc9)` commit for
   this file would break Task 4's own ceiling leg -- while leaving it uncommitted breaks
   Task 4's `git status --porcelain` clean-tree leg. I resolved it by staging this file
   INTO Task 4's commit. Consequence, stated rather than hidden: **Task 4's own SHA
   cannot appear in this file**; it is in my return message to the orchestrator. No
   verify literal was edited.

3. **Step 14's "two retired taxonomy row-scoped guard fixture blocks" undercounts by
   one.** Step 13 moves the roster assertion from seven guards to four, which is THREE
   removals, and the third guard's fixture block calls it directly -- so leaving that
   block would crash the selftest with a `TypeError` rather than fail an assertion. I
   deleted all three. Related and separately reported above as a Rule 2 deviation: the
   `oneRow` duplicated-row case sits OUTSIDE all three blocks and also referenced a
   retired guard.

4. **Leg 26's `## Reference material` pin is weaker than the F-3 reasoning wants.** It
   asserts the literal is somewhere in the checker SOURCE at count >= 1. My N9 comment
   also mentions that heading, so the leg would now pass even if the needle itself were
   the forbidden bare form. The plan already routes the needle-shape read to followup
   item 4, so this is a note on the leg's strength, not a gap in coverage -- but it is
   worth recording that the leg is satisfiable by prose. I did NOT weaken the needle:
   it is the verbatim region-scoped form, and I measured that the bare alternative
   passes an appendix-only placement while mine rejects it.

5. **Three residues the plan names, which I confirmed remain residues.** The
   `splitCells` count leg still cannot show the two calls are in `parseRows` and
   `scanTables` respectively (they are); the `tablesSeen`/`linksSeen` leg still cannot
   show the comparisons feed `report()` (they do); and the offender-string pins still
   cannot show `scanTables` PRODUCES the string (it does -- the mutation test above
   emitted it from live code, which is new evidence the plan did not expect to have).

## Open items -- `<orchestrator_followup>`, ALL STILL OPEN

I have no Agent or Task tool and did not attempt to spawn a reviewer. I did not
self-certify any of these.

1. **OPEN.** Spawn at least one WHOLLY UNPRIMED reviewer over the archived copy and the
   TWO replacement router sentences (lz-red's and lz-tpp's). There are TWO, not three --
   lz-refactor's section was DELETED with no replacement per F-4. No leg reads the BODY
   of either replacement, so this item owns their content outright.
2. **OPEN.** Spawn an instrument auditor over the 58 retirements. Mitigating evidence
   for it: I spliced them by script from a sentinel-patched capture of the pre-change
   run, so the strings are byte-copies of what the battery actually emitted rather than
   hand-transcribed. Its four further scope items (the step-12 replacement's teeth, the
   offender string being produced, `TAXONOMY_LINES` surviving as a synthetic fixture, no
   orphaned `taxonomyText`) all still need the read; `taxonomyText` I can report is gone
   from the checker entirely.
3. **OPEN.** Confirm no file under `.claude/agents/` was edited (legged, and it passes)
   and that `.planning/.continue-here.md` and `.planning/HANDOFF.json` were NOT
   rewritten. I touched neither; that half has no leg by design.
4. **OPEN.** Confirm the B0 fix is the one-line additive form, that the opt-in is set on
   N9 alone, and that N9's needle is the verbatim region-scoped form. See hole 4 above
   for why the read matters more than the leg here.
5. **N/A.** Step zero was already committed by the orchestrator before I was dispatched,
   which is the branch this item warns about; I took the documented clean-tree fallback
   and edited no verify literal.
6. **OPEN, but I have discharged its substance empirically** -- see the mutation test
   above. The read is one line and still worth doing.
7. **OPEN.** Read `lib/pipe-table.mjs`'s rewritten header. Specifically F-1: line 1 now
   reads `// quick-260729-2ig ROW PARSER, widened by quick-260729-lc9. THREE exported pure functions over a`
   -- the token `ROW PARSER` is preserved because both A4 legs bracket on it, and the
   rest of the line is REWRITTEN with the corrected export count. The departing file's
   census was DELETED in Task 3 rather than carried under a new heading.

## Final verification

The plan's `<verification>` block, run verbatim: **exit 0.**

| Gate | Result |
|---|---|
| `check-red-references.mjs` | exit 0, GREEN at 125 emitted checks, roster gate holding |
| `row-guards.selftest.mjs` | exit 0 |
| `check-hygiene.mjs` | exit 0 |
| `claude plugin validate .` | passed |
| `git status --porcelain` | empty |

Commit accounting: six conventional-type `quick-260729-lc9` commits -- the orchestrator's
step-zero `docs` commit plus my five -- so the `-le 6` ceiling holds unmodified, exactly
as the clean-tree fallback predicts. All five mandatory subjects present at count 1 each.
Zero commits touch `.claude/agents/`. The only author/committer email across every
commit is the approved public contact.

## Self-Check: PASSED

- Files claimed created, all FOUND on disk: `.planning/research/test-double-taxonomy.md`,
  `260729-lc9-RED-BASELINE.md`, `260729-lc9-SUMMARY.md`,
  `.claude/skills/lz-red-workspace/tools/lib/pipe-table.mjs`.
- Files claimed deleted, all GONE: `git ls-files -- 'plugins/**/test-double-taxonomy.md'`
  returns nothing.
- Commits claimed, all FOUND: `62b1c12`, `1d13144`, `a13ae7d`, `60ef38a`, and Task 4's
  own commit (its SHA is in the return message, since this file is inside it).

