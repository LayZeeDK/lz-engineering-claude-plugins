# 260729-lc9 -- Plan-checker findings (iteration 5, FINAL CYCLE)

**Ran:** 2026-07-29, gsd-core:gsd-plan-checker (re-check, iteration 5; revision cap EXHAUSTED)
**Verdict:** ISSUES FOUND -- **0 EXECUTION-BLOCKING**, 4 NON-BLOCKING (all NEW), 3 cosmetic nits
**Recommendation:** **FORCE-PROCEED**, with the five executor instructions in Section 10
**Plan checked:** `260729-lc9-PLAN.md`, **1591 lines**, 4 tasks, 6 commits, 9 guards, 58 retirements

**All six iteration-3 findings (NEW-1..NEW-6) are CLOSED, and all four extra legs the planner added
from its own enumeration are real, RED at baseline, and anchored. The step-zero staging DEADLOCK is
genuinely gone in BOTH branches. Every number, exit code and table the planner reported reproduces
when re-derived independently -- including the full 4x3 N9 matrix through the real evaluator.**

The four new findings are all defects of JUSTIFICATION or of a mandated instruction, not of a
mechanism. None lets the chain go green with an owner boundary step skipped. One (F-1) a competent
executor WILL hit by following the plan's own text; the other three need deliberate deviation or are
advisory.

---

## Section 1: OBSERVED exit codes -- all four blocks extracted programmatically, run VERBATIM

Blocks pulled from the four `<automated>` elements on disk by script, split on ` && `, run with `bash`
from the repo root against the unmodified (dirty-by-design) tree.

| Block | line | `&&` | legs | `;` | non-ASCII | `rg -E` | OBSERVED exit | First failing leg |
|---|---|---|---|---|---|---|---|---|
| Task 1 | 503 | **24** | **25** | 0 | 0 | 0 | **1** | leg 2, `scanTables: ` PASS count `-ge 6` |
| Task 2 | 682 | **15** | **16** | 0 | 0 | 0 | **1** | leg 2, `! node check-red-references.mjs` (battery GREEN today) |
| Task 3 | 1016 | **32** | **33** | 0 | 0 | 0 | **1** | leg 2, the step-12 mandated label |
| Task 4 | 1328 | **30** | **31** | 0 | 0 | 0 | **1** | leg 1, `test -s` on the archive path |

Claimed leg counts 25/16/33/31 match exactly. PLAN.md non-ASCII bytes **0** across all 1591 lines.
Zero `rg -E`. Zero `-F` patterns with a leading `--`.

`gsd-tools query verify.plan-structure`: valid true, **0 errors, 0 warnings**, 4 tasks, all of
files/action/verify/done present on all four.

Baseline re-established independently: battery exit **0**, **175** emitted labels (174 + roster),
EXPECTED_CHECKS 174 at :925, selftest exit **0**, check-hygiene exit **0**, plugin validate exit **0**.
Tree dirty exactly as designed (STATE.md, PLAN.md modified; PLAN-CHECK-2 and -3 untracked).

---

## Section 2: NEW-1 .. NEW-6, one by one, with OBSERVED evidence

### NEW-1 (T3 step 7, N1 archive scope) -- CLOSED

| Leg | OBSERVED | Mistyped-path probe |
|---|---|---|
| T3 13, archive path literal in the checker, `-ge 1` | **1** | **1** fail-closed |
| T3 8, `[PASS] ... no ragged pipe table` count 1 | **1** | **1** fail-closed |

Leg 8 IS the first such assertion in a post-Task-2 block: block 4 carries none (grep over block4 = 0).
Leg 13 also serves as the counted positive anchor on the checker SOURCE for legs 14, 24 and 28.
The mutation-test rejection is recorded at :862-869 with its stated reason, and the wiring is routed to
followup item 6 at :1575-1579. `<verification>` at :1505-1509 states why the table-shape half is real
only because step 7 is legged. Task 4 section F itself does NOT restate that -- see nit N-3.

### NEW-2 (T3 step 8, emitted SUMMARY string) -- CLOSED

| Leg | OBSERVED | Literal count today | Anchor |
|---|---|---|---|
| T3 11, byte-identity clause absent from output | **1** | **1** | legs 5-8 grep the same file; leg 8 mistyped -> **1** |
| T3 12, taxonomy item in the parenthetical absent | **1** | **1** | same |

Both are fail-open in isolation and both anchored. The no-blanket-leg trap is recorded at :885-887 and
is correct: N3's label is `[lc9] no test-double taxonomy copy in the shipped tree`.

### NEW-3 (lib/pipe-table.mjs untouched by any leg) -- CLOSED (but see F-1)

| Leg | OBSERVED | Probe |
|---|---|---|
| T3 29, `export function parseRows` `-ge 1` | **0** ANCHOR | mistyped -> **1** |
| T3 30, taxonomy basename absent | **1** | mistyped -> **0**, closed by 29 |
| T1 7, ROW PARSER .. scanTables .. const SEPARATOR_CELL_RE | **1** | mistyped -> **2** |
| T1 8, same bracket with findLinkTargets | **1** | mistyped -> **2** |

Bracket proven load-bearing: `ROW PARSER` occurs once (:1), `const SEPARATOR_CELL_RE` once (:28), first
`export function` at :38. `columnCount` first occurs :34, below the closing key -> leg-7 form with that
needle exits **1**. Positive control `FAILS CLOSED` (:10, inside the header) exits **0**.

### NEW-4 (overstated proof claim) -- CLOSED

:447-454 now states a FLOOR and says outright "The earlier wording here claimed a proof; the claim is
withdrawn." Routed to followup item 2(b) at :1555-1557, naming NEW-4.

### NEW-5 ("125 both before and after 3b") -- CLOSED

"mechanical proof" withdrawn twice (:749 action, :1101 done). `<done>` :1096-1101 now REQUIRES running
the battery after 3a and recording the count in the SUMMARY.

| Leg | OBSERVED | Probe |
|---|---|---|
| T3 31, 3b changed-file count `-ge 2` | **1** | no such commit -> subject resolves EMPTY, `git show ""` errors, `wc -l` 0 -> **1**. On an existing >=2-file commit -> **0** |
| T3 32, nothing outside the two row-guards files | **0** fail-open in isolation | substituted an EXISTING 6-file commit with non-matching paths -> **1**. Has teeth |

Pairing holds: 31 immediately precedes 32, so a missing, renamed or collapsed 3b fails at 31.

### NEW-6 (lz-refactor replacement content) -- CLOSED

T3 leg 22, `rg -c` on the mandated heading `= "1"`. OBSERVED **1**; mistyped -> **1**. `rg -c` on a
single file counts LINES, so the prose claim "exactly one matching LINE" is earned. The `| wc -l`
FILE-counting overclaim the planner self-reported is genuinely fixed.

---

## Section 3: the four extra legs the planner added from its own enumeration

| Leg | Assertion | Baseline | OBSERVED | Direction / anchor |
|---|---|---|---|---|
| T1 6 | `splitCells` `-ge 3` in lib/pipe-table.mjs | count **0** | **1** | fail-closed (mistyped 1) |
| T1 11 | `tablesSeen\|linksSeen` on `-ge 2` checker lines | count **0** | **1** | fail-closed (mistyped 1). T-lc9-03 genuinely had NO trace before |
| T3 14 | three stale checker comments, one combined negated leg | all three literals count **1** | **1** | fail-open form, anchored by leg 13 (mistyped 1) |
| T3 26 | eight count-guard helpers absent from lib/row-guards.mjs | 5/2/10/2/2/3/3/2, all present | **1** | fail-open form, anchored by leg 23 (correct 0, mistyped 1) |

All four RED at baseline for the right reason, all no-op resistant.

---

## Section 4: the step-zero DERIVED-STAGING fix -- RULED SOUND, deadlock gone in BOTH branches

No frozen add-list survives anywhere: `rg -n 'git add'` returns exactly two hits, both instructions
(:209, :214). The mechanism is `git status --porcelain -- .planning/` (:206) then "git add every path
that command lists, each spelled out BY NAME on the command line".

| Hazard the brief named | OBSERVED / verdict |
|---|---|
| `git add .` / `-A` / `-u` | Explicitly forbidden at :214 together with "never a bare directory path". Compliant with the global rule |
| Stage BY NAME | Mandated at :209 and :214; the mechanism enumerates and names |
| `.planning/config.json` sweep-in | NOT reachable today. Tracked and CLEAN (`git diff --stat` empty; `_auto_chain_active: false`, `auto_advance: false`), so it never appears in the derivation. If it ever did, :215 orders STOP-and-report -- a stall, not a sweep -- and the expected set at :210 excludes it |
| `.planning/HANDOFF.json`, `.planning/.continue-here.md` | Both tracked and CLEAN today; absent from the derivation |
| `.planning/async-jobs/` | Does not exist |
| temp top-level `.planning/LEARNINGS.md` bridge | Only ever created by the post-phase learnings bridge, never during quick execution |
| A NEW PLAN-CHECK-5.md appearing after the plan was written | HANDLED. The derivation reads the tree; :200-203 says outright the set is not knowable at authoring time. This report WILL be staged |
| T4 leg 31 reachable, 6-commit branch | YES. Every artifact has an owning commit: planning artifacts + STATE.md -> step zero; RED-BASELINE + instrument -> T1 commit 2; T2 -> T2; T3 -> 3a/3b; archive -> T4. SUMMARY.md is written after the verify per `<output>`, the normal GSD pattern |
| T4 leg 31 reachable, 5-commit branch | YES. The fallback fires only when the WHOLE-repo status is already empty, so nothing is left over, and no verify literal changes -- legs 17-21 are five exact subject pins, leg 22 a plan-structural `-le 6` ceiling |

Two residues, both NON-BLOCKING, neither a deadlock:

- R-1. `files_modified` (:29-31) and Task 1 `<files>` (:186-188) list PLAN-CHECK, -2, -3 but not -5.
  Cosmetic: no leg or gate reads either list, and the action says DERIVE FROM THE TREE.
- R-2. The derivation is scoped to `.planning/` while the clean-tree fallback tests the WHOLE repo.
  Dirt outside `.planning/` at Task 1 neither triggers the fallback nor gets staged, so T4 leg 31 fails
  CLOSED. Right direction; named for the record. Does not fire today.

---

## Section 5: the step_leg_map -- every leg number re-verified independently

The map has **47 data rows** (:1396-1442). The plan itself claims only the block sizes -- Task 1 = 25,
Task 2 = 16, Task 3 = 33, Task 4 = 31 -- and all four are EXACT.

I re-derived every cited leg number against the programmatic split. **46 of 47 rows cite the correct
leg(s).** Verified exhaustively for Task 1 (11 rows), Task 2 (4), Task 3 (21), Task 4 (11).

Would-it-fail spot checks:

| Map row | Cited | Fails if the step is skipped? |
|---|---|---|
| T1 step zero | T4 31 | YES, untracked PLAN-CHECK reports keep status non-empty |
| T1 A4 | T1 7, 8 | YES, bracket probed load-bearing |
| T1 D RED-BASELINE | T1 19-25 | YES, seven content sub-legs; a touch fails leg 19 |
| T2 blast radius | T2 10-15 (+16) | YES, all six pins exit 0 today so any sweep flips one |
| T3 A pure git mv | T3 18 | YES, R100 once; move-plus-edit gives R099 |
| T3 D5 COUNT_GUARDS import | T3 24 | YES, count 10 in the checker today |
| T3 D9 6 -> 64 | T3 6 | YES, the roster detail prints the list length, so `64` pins RETIRED_LABELS.length |
| T3 D15 header rewrite | T3 29, 30 | YES, anchored pair |
| T4 G, four hygiene subjects | T4 26, 25, 24, 27 | YES, one leg per subject |
| T4 H .claude/agents/ | T4 23 | YES, count 0 today, non-empty for commits that DO touch it |

**The one mis-citation (cosmetic, nit N-1).** The `T3 B lz-red inline rule` row says "must PASS for
leg 5's exit-0 battery". The un-negated battery RUN is **leg 4**; leg 5 asserts `125 checks` in its
captured output. Substance right, number off by one. The `T3 D10 3b dead-surface` row cites 25, 26, 28
and omits leg 27 (COUNT_GUARDS absent from the selftest), also 3b's -- an omission, not a wrong number.

**Task 4 section E, the UNGUARDABLE step -- measurement CONFIRMED.**
`git log --format=%H --grep='quick-260729-lc9' -- .planning/.continue-here.md .planning/HANDOFF.json | wc -l`
returns **1** today (commit 4fa274b, the pre-existing wip). An `= "0"` leg would FALSE-FAIL. The
"do not add that leg" note is present in BOTH places, :1438 and :1564. Ruled sound.

**The `TAX` cannot-be-legged claim is REFUTED -- see F-2.**

---

## Section 6: fail-open direction sweep over the +15 new legs (Priority 1)

Every new leg classified by whether a substituted 0 or an empty capture SATISFIES its comparison, then
PROBED with a deliberately mistyped path.

| Leg | Form | Direction | Probed |
|---|---|---|---|
| T1 6 | `\|\| echo 0` + `-ge 3` | fail-CLOSED | mistyped -> **1** |
| T1 7, 8 | bare `rg -U -q`, not negated | fail-CLOSED | mistyped -> **2** (non-zero) |
| T1 11 | `\|\| echo 0` + `-ge 2` | fail-CLOSED | mistyped -> **1** |
| T3 8 | `rg -c` + `= "1"` | fail-CLOSED | missing file -> **1** |
| T3 11, 12 | `\| wc -l` + `= "0"` | FAIL-OPEN | mistyped -> **0**; anchored by legs 5-8 on the same /tmp file (leg 8 mistyped -> **1**), leg 4 creates it |
| T3 13 | `\|\| echo 0` + `-ge 1` | fail-CLOSED | mistyped -> **1** |
| T3 14 | `\| wc -l` + `= "0"` | FAIL-OPEN | mistyped -> **0**; anchored by leg 13 same path, probed **1** |
| T3 22 | `\|\| echo 0` + `= "1"` | fail-CLOSED | mistyped -> **1** |
| T3 26 | `\| wc -l` + `= "0"` | FAIL-OPEN | mistyped -> **0**; anchored by leg 23 same path, probed **1** |
| T3 29 | `\|\| echo 0` + `-ge 1` | fail-CLOSED ANCHOR | mistyped -> **1** |
| T3 30 | `\| wc -l` + `= "0"` | FAIL-OPEN | mistyped -> **0**; anchored by leg 29 immediately before |
| T3 31 | nested git show/git log, `-ge 2` | fail-CLOSED ANCHOR | no such commit -> **1** |
| T3 32 | `\| rg -c -v` + `= "0"` | FAIL-OPEN in isolation (self-reported) | closed by 31; teeth probed on a mismatching 6-file commit -> **1** |

**Verdict: no new fail-open hole.** Every fail-open-direction leg has a positive counted anchor on the
SAME subject in the SAME chain, and every anchor was probed. The 31/32 pairing holds under both failure
modes the brief named (broken pipeline / no such commit -> 31 fails; mismatching file set -> 32 fails).

**Priority 3, no-op resistance.** A touch-only or do-nothing execution satisfies NONE of the fifteen.
Positive legs read 0 and fail their `-ge` / `= "1"`; negated legs still see the forbidden literals,
which are present at baseline (count 1 each, measured).

**Priority 4, new tree-dependent numbers.** None unbacked. Re-measured: 31 tables / 405 pipe rows ->
28 / 297 (exact, via the plan's own scanTables algorithm); 197 files / 1014 inline / 984 relative /
30 anchor (all exact) -> 194 / 990 / 981 / 9 (deltas reconcile to 3 copies x 8 links); bracket lines
:1, :28, :34, :38; escaped-pipe class (plugins/**/*.md = **0** files with a backslash-pipe;
.planning/research/STACK.md = **3** lines, and the naive split reports exactly **3** ragged rows there);
the eight helper counts; the three stale-comment literals each count 1. The "~100 topic and 14 absent
guards" figure is approximate by construction and labelled so.

---

## Section 7: regression -- everything previously confirmed, re-derived not transcribed

| Item | OBSERVED |
|---|---|
| 58 retirement labels from RESEARCH Q2 | **58** entries, **0** duplicates, and ALL 58 match an emitted LABEL verbatim -- measured authoritatively by instrumenting report() in a throwaway worktree to dump emittedLabels, because the roster gate compares `emittedLabels.includes(label)` on the LABEL, not on the printed line |
| Reverse direction clean | **58** emitted labels mention `taxonom`; exactly **1** is absent from the retire list, the G17 label, deliberately KEPT ("retire 58, keep 2") |
| A trap I fell into and corrected | Parsing the printed LINE makes the byte-identity label look truncated (`... skills` vs `... skills -- sha256 3bb4a27fa17d in all three`). It is NOT: check-red-references.mjs:638 sets TAXONOMY_LABEL to the short form and the sha256 is the `detail` argument. My iteration-3 wording "match an emitted baseline LINE verbatim" was imprecise; the true property is "match an emitted LABEL verbatim". **No defect** |
| 174 - 58 + 9 = 125 | **125**. EXPECTED_CHECKS 174 at :925; 175 emitted labels (174 + roster) |
| NEW_LABELS 34 -> 13 | roster prints `all 34 new labels present`. 16 taxonomy literals + TWO_IG_GUARDS.map (7 row-scoped + 9 count = 16) + 2 chronology = 34; after: 4 surviving + 9 lc9 = **13** |
| RETIRED 6 -> 64, ROW_SCOPED 7 -> 4, COUNT_GUARDS 9 -> deleted, OLD_NEEDLES 7 -> 4 | measured live 6 / 7 / 9 / 7. 7 - 3 = 4 (two taxonomy row-scoped + taxonomyRowBacked). Arithmetic consistent |
| FILES.length 12 | **12** `name:` entries; SUMMARY prints 12/12 |
| H1 ordering | implemented N2's algorithm fence-aware: **exactly 2** unresolved relative links, both `test-double-taxonomy.md:289 -> principle-backing.md`. Task 1 captures them (legs 15, 16) before Task 3 deletes them |
| N2's four load-bearing zeroes | **0** external-scheme, **0** absolute, **0** reference-style definitions, **0** links inside code fences. All exact -- no allowlist needed |
| Proof kinds | N1 invariant-GREEN (plugins/** = 31 tables, 405 pipe rows, **0 ragged**) + fixtures; N2-N9 RED-at-baseline. N9 genuinely RED-at-baseline, not RED-ALWAYS |
| N9 three-way discrimination through the REAL evaluator | Re-derived from scratch: throwaway worktree, :552 patched, the exact topic injected into the SKILL.md FILES entry, three variants of the live lz-red/SKILL.md, node run per variant, emitted verdict read. 4 combos x 3 variants = 12 runs, **byte-identical to PLAN.md:368-372** (table below) |
| scanTables/parseRows share ONE splitter | mandated `splitCells`, legged at `-ge 3` (T1 6); the two-consumer reading is routed to followup 4 |
| wholeText additivity | `wholeText` occurs **0** times in the shipped checker, so legs 9 and 10 pin it to one site. :552 per-line hit and :591 absent matcher -- both line citations EXACT |
| Task 4 negative needles non-vacuous | all four count **1** today; the relative-link needle count **1** at :289, the taxonomy's ONLY non-anchor relative link (verified) |
| G17 rename safety | old string count **1** in the checker (:690), **0** in lib/row-guards.mjs, **0** in NEW_LABELS; new `in the shipped tree` form count **0** (leg 9 RED); RESEARCH :341 sits inside the KEEP block. The roster gate is string-based over count / missing / surviving and a rename moves none of the three |
| Router sentences do not trip BARE_WORD_RE | BARE_WORD_RE is `/\b(stub\|stubs\|stubbed\|stubbing)\b/gi` with SIDE_QUALIFIED_RE `/(production\|collaborator)-side\s+$/i`. In both suggested wordings every `stub` is IMMEDIATELY preceded by a side qualifier ON THE SAME LINE, so both are allowlisted. lz-refactor's replacement carries no contested word (`git grep -c -i '\bstub' -- lz-refactor/` returns nothing outside the deleted copy). lz-red keeps only side-qualified uses at :99, :100, :111, :125 once :154-159 goes |
| Hygiene chain, anchor first | block 4 leg 2 is a positive COUNTED rg on the archive; legs 12-16 (negated) and leg 26 (inversion) all follow it. The inversion passes the token pattern positionally with no `-E`. Identity today: the only email is the approved public contact. No forbidden value appears as a needle anywhere in the plan |
| D-01..D-12 honored, D-12 included | requirements lists all twelve; `<decisions_coverage>` (:90-113) names an implementing task per decision. D-12: no runtime artifact authored, lz-red keeps the inline rule and NO reference file, N3 makes the absence machine-enforced. Correct as the baseline arm of a future A/B, not a regression |
| Eight owner boundary steps | 1 -> T4 B; 2 -> T1 N1; 3 -> T2; 4 -> T3 A; 5 -> T3 A+B; 6 -> T4 D + T3 step 8; 7 -> T3 D; 8 -> T4 A + T3 step 8. All eight covered |
| Out-of-scope honored | no runtime artifact, no metered run, no EVL-03, no shared-reference investigation. lz-refactor: see F-4 |
| Commit accounting fails closed both ways | five exact subject pins (each count 1 today, RED), `-le 6` ceiling (count 0 today, passes as an upper bound). Collapsing 3a+3b leaves pin 4 at 0. Neither branch needs a verify edit |
| Mock rule site map | case-sensitive `git grep -c 'Mock rule' -- plugins/`: functional-core **2**, message-matrix **4** = the SIX label sites, exact. test-structure-and-assertions.md:140 has lowercase `assert-vs-mock rule`, invisible to leg 6 (case-sensitive) and outside N5/N6's per-file scope |
| Test Spy brackets | all four keys occur **exactly once**; headings at :50 and :60, target bullet :57 inside. Positive control (`Mock rule`) -> **0**; negative control (the :73 sentence, outside the bracket) -> **1**; both legs -> **1** today |
| read end to end region scoping | file-wide count **1** today, so a file-wide leg WOULD pass vacuously. Region scoping load-bearing exactly as claimed |
| C-B1 measurement | `TDD is Kanban for Code` at principle-backing.md:67, :85 and beck-tdd-by-example.md:26, :83 -- four dependent sites, and NOT in the taxonomy (leg 11 RED at baseline) |
| Ordered BLOCKING/IMPORTANT/MINOR leg | `2 BLOCKING` count **0** in the taxonomy today, so leg 7 is RED |

**Guard/retirement integrity: still 9 guards, 58 retirements, count 125. No leg was weakened to pass.
Both commit branches fail closed. No leg carries a branch-dependent literal.**

### The N9 matrix, re-derived (12 runs through the real evaluator)

| Matcher x needle | absent | rule IN the coach procedure | rule ONLY in the appendix |
|---|---|---|---|
| per-line (evaluator AS SHIPPED) + region needle | FAIL | **FAIL -- the deadlock** | FAIL |
| `wholeText: true` + region needle (THIS PLAN) | FAIL | **PASS** | **FAIL** |
| `wholeText: true` + BARE needle (FORBIDDEN) | FAIL | PASS | **PASS -- the overclaim** |
| per-line + BARE needle | FAIL | PASS | **PASS -- the overclaim** |

Identical to the plan's table. Variants straddle the boundary correctly: `## Coach decision procedure`
at :52 and `## Reference material` at :141, each occurring exactly once.

---

## Section 8: NEW findings

### F-1. Task 1 A4 mandates KEEPING a line that Task 1's own commit falsifies. NON-BLOCKING.

**A competent executor following the plan's own text WILL hit this.** It is not bad luck; the plan
orders it.

`lib/pipe-table.mjs:1` reads, verbatim:

```
// quick-260729-2ig ROW PARSER. One exported pure function over a GitHub pipe table, node builtins
```

PLAN.md:269-272 orders: "KEEP the header's opening `ROW PARSER` line as-is ... ADD to the header; do not
restructure its first line."

Task 1 sections A2 and A3 add TWO more exports (`scanTables`, `findLinkTargets`), so **"One exported
pure function" becomes false in the SAME commit that adds them** -- precisely the rule the plan writes
47 lines later (:316-318): "a number that the same commit set will change is a defect, not
documentation." The KEEP mandate is only needed for the TOKEN `ROW PARSER`, which is legs 7 and 8's
opening bracket key, not for the whole line.

OBSERVED: `rg -c -F 'ROW PARSER' <module>` = **1**, at :1. First `export function` at :38. Legs 7/8
require only that the token precede `const SEPARATOR_CELL_RE` (:28), so rewriting the REST of line 1
keeps both legs green.

Not covered by any followup. Item 7 (:1580-1582) asks about "measurement of a file the module no longer
targets" and "census number that a later deletion will falsify"; neither reaches "One".

**Minimal patch, replace :269-270 with:**

> **KEEP the token `ROW PARSER` on the header's FIRST line** -- it is the bracket's opening key for legs
> 7 and 8, so removing or rewording that token would make both legs false-fail on correct work. The REST
> of that line MUST be updated: it currently says `One exported pure function`, which this commit
> falsifies (three exports after A2 and A3).

### F-2. The stated reason for leaving `TAX` unlegged is FALSE. NON-BLOCKING.

PLAN.md:952-954 asserts: "`TAX` cannot be legged AT ALL, because a bare `TAX` needle also matches
`TAXONOMY_LINES`, which step 14 requires to SURVIVE -- so a leg there would false-fail correct work."

OBSERVED, refuting it:

| Probe | Result |
|---|---|
| `rg -c -F -e 'TAXONOMY_LINES' .claude/skills/lz-red-workspace/tools/lib/row-guards.mjs` | exit **1**, count **0** |
| where TAXONOMY_LINES is declared | `row-guards.selftest.mjs:42` (and used at :167) -- a DIFFERENT file |
| `TAX` occurrences in lib/row-guards.mjs | **16** lines: the object at :39, TAXONOMY_COLUMNS/HEADER/taxonomyRows at :37/:38/:73, the two taxonomy row-scoped guards (deleted in 3a), and productionOwnTransitionalRows / fourOwnedSourcesName (count guards, deleted in 3b) |
| the FOUR surviving row-scoped guards | failureVsErrorRowBacked, seamRowBacked, threeLawsRowBacked, kanbanEssayNamedInRow -- all use `backingRows`, **none** uses `TAX` |
| hypothetical leg `test "$(rg -c -F -e 'TAX' <lib/row-guards.mjs> \| wc -l)" = "0"` | exit **1** today (RED at baseline), and it would go green only after a complete 3b |

So a `TAX`-absent leg scoped to `lib/row-guards.mjs` -- the only file step 10 deletes `TAX` from --
cannot see `TAXONOMY_LINES` and is perfectly constructible. Secondary inconsistency: :955-956 claims all
three residues "fall inside `<orchestrator_followup>` item 2's scope", but item 2's own enumerated list
(a)-(d) names `TAXONOMY_LINES` and `taxonomyText` and does **not** name `TAX`.

Consequence if unfixed: a leftover `TAX` object in `lib/row-guards.mjs` is dead code only (its guards'
labels are in the retired roster, so no check is gated on it), and the roster gate cannot see it.

**Minimal patch, either:**
- (i) delete the false sentence and append to block 3, immediately AFTER leg 23 (whose
  `ROW_SCOPED_GUARDS -ge 1` anchor closes the fail-open direction):
  `&& test "$(rg -c -F -e 'TAX' .claude/skills/lz-red-workspace/tools/lib/row-guards.mjs | wc -l)" = "0"`
- (ii) or keep the residue, correct the reason, and add `TAX` to followup item 2's list explicitly.

### F-3. N9's needle SHAPE is unlegged, and the FORBIDDEN escape passes every leg. NON-BLOCKING.

The plan spends 20 lines and a 12-run matrix establishing that the bare needle
`/which side they mean/i` is FORBIDDEN because it ships the placement overclaim (matrix row 3).
**Nothing checks which needle was written.**

OBSERVED:

| Escape route | Which leg catches it? |
|---|---|
| bare needle + `wholeText: true` (matrix row 3) | **NONE.** Legs 9 and 10 pin `topic.wholeText` and `wholeText: true` at count 1 each -- both satisfied. Leg 13 (exactly 8 FAILs) is unchanged, because the phrase is absent from lz-red/SKILL.md at baseline under EITHER needle. Leg 25 pins a PROSE token in the RED-BASELINE record. At Task 3 both needles PASS, so legs 4-8 go green |
| bare needle + NO B0 patch (matrix row 4) | legs 9 and 10 catch it (count 0) |

`rg -c -F -e 'Reference material'` across all four `<automated>` blocks: **0**. Followup item 4
(:1565-1570) reads B0's additivity and the flag's scope but never the needle's shape.

Needs deliberate deviation, not misreading -- the plan mandates the exact regex verbatim. But it is the
only undetected escape among the four matrix rows, in a plan whose premise is "a green battery is not
acceptance".

**Minimal patch, one leg, RED at baseline, fail-closed** -- append to block 1 after leg 10:

`&& test "$(rg -c -F -e '## Reference material' .claude/skills/lz-red-workspace/tools/check-red-references.mjs || echo 0)" -ge 1`

OBSERVED today: exit **1** (count 0). With a mistyped path: exit **1**. Cheaper alternative: add one
clause to followup item 4.

### F-4. D-09 tension: the lz-refactor replacement section is net-new mandated content. NON-BLOCKING, advisory.

D-09 locks "Nothing in lz-refactor changes beyond the one deletion D-01 requires."

OBSERVED: `lz-refactor/SKILL.md:182-186` is a pure router pointer and the file's LAST section, so a
plain deletion leaves no dangling reference. `git grep -c -i '\bstub' -- plugins/lz-tdd/skills/lz-refactor/`
returns nothing outside the taxonomy copy, which confirms the plan's own premise ("no naming rule to
preserve here") -- and that premise is exactly why no replacement is REQUIRED. The plan nevertheless
ADDS an H2 section with net-new coaching prose and MANDATES its heading verbatim via leg 22.

Mitigating: the new body is a compression of the deleted section's own framing ("whether an artifact is
a temporary step or a permanent fixture of the design"), so it reads as replacing the block rather than
extending the skill; and iterations 2, 3 and 4 all accepted it as part of the deletion.

**Minimal patch (owner's call, not the planner's):** either accept as-is, or replace leg 22 with
`test "$(rg -c -F -e 'test-double-taxonomy' plugins/lz-tdd/skills/lz-refactor/SKILL.md | wc -l)" = "0"`
plus a plain deletion instruction, which satisfies D-01 and D-09 with strictly less lz-refactor change.
Note that leg 15 already covers the pointer's absence tree-wide, so the plain-deletion variant needs no
new leg at all.

### Cosmetic nits (no patch required)

- **N-1.** step_leg_map, `T3 B` row cites "leg 5's exit-0 battery"; the battery RUN is leg 4.
- **N-2.** step_leg_map, `T3 D10 3b` row omits leg 27 (COUNT_GUARDS absent from the selftest).
- **N-3.** The claim that "Task 4 section F now state[s] why the table-shape half is real only because
  step 7 is legged" holds for `<verification>` (:1505-1509) and the map row, but section F itself
  (:1260-1261) says only "Guard N1 now scans this file."

---

## Section 9: anti-pattern sweep against `.planning/.continue-here.md`

| Pattern | Status in this revision |
|---|---|
| Verify block that passes on a no-op | **CLOSED.** All four blocks run verbatim exit 1; every legged artefact has content legs; a touch-only or do-nothing execution satisfies nothing |
| Coverage hole in a verify chain | **CLOSED for every owner boundary step and every numbered action step.** All 47 mapped steps trace to a leg or to an explicitly named, routed residue. Two residues gained the wrong justification (F-2) or none (F-3), but neither is an owner boundary step |
| Blast radius asserted, not measured | **CLOSED.** All six out-of-scope pins exit 0 today; the six-site Mock-rule map is exact; the seven-site phrase map re-measured |
| Fail-open guard on an absent subject | **CLOSED.** Exhaustive direction sweep over the +15 new legs; every fail-open-direction leg anchored and every anchor probed |
| Fix breeds the same defect class | **FIRING ONCE, mildly -- F-1.** The NEW-3 repair (a KEEP mandate on the bracket key) reintroduces a stale claim in the very file whose stale claims the same plan exists to sweep. F-2 is a wrong justification inside the NEW-5/step-10 residue accounting rather than a new defect |
| Needle outlives its subject | **CLOSED** for the G17 label, both Test Spy legs, D-11, C-B1, the SUMMARY string and the pipe-table basename. **The INVERTED form is handled** (A4 preserves the bracket key) but at the cost of F-1 |
| Inferring behavior from structure | **CLOSED.** The N9 matrix re-derived through the real evaluator, 12 runs; the roster gate read at source level (`emittedLabels.includes(label)`) rather than inferred from printed lines -- which is what caught and killed my own provisional false blocker on the byte-identity label |

**Scope sanity, advisory.** 4 tasks, 6 commits, 47 mapped steps, 1591 lines for a quick task; Task 3
remains the largest unit (15 steps, 12 files, 2 commits). The ACTION content has not grown since
iteration 1 -- the growth is verify rationale and the leg map, which is what four rounds of checking
demanded. One real context-budget note: `<context>` pulls in CONTEXT.md (20 KB) plus RESEARCH.md
(53 KB) plus `.continue-here.md` plus AGENTS.md on top of a 130 KB plan, and of RESEARCH.md the executor
actually needs only Q1's algorithm and Q2's 58-label block. Accepted by iterations 2, 3 and 4.

---

## Section 10: verdict and decision-grade summary

**ISSUES FOUND -- 0 EXECUTION-BLOCKING, 4 NON-BLOCKING, 3 cosmetic nits.**

| # | Finding | Blocking? | Would a competent executor hit it? | Minimal patch |
|---|---|---|---|---|
| F-1 | A4 mandates keeping `pipe-table.mjs:1` as-is; "One exported pure function" is falsified by the same commit | NON-BLOCKING (a comment; no behaviour, no emitted output) | **YES -- the plan orders it.** High probability | One sentence replacing :269-270 |
| F-2 | "`TAX` cannot be legged AT ALL" is factually false; `TAXONOMY_LINES` lives in a different file | NON-BLOCKING (leftover = dead code only) | Only if 3b is partially executed; the residue is routed (loosely) | One leg after leg 23, or correct the reason + name `TAX` in followup 2 |
| F-3 | N9's needle shape is unlegged; the FORBIDDEN bare needle passes every leg | NON-BLOCKING (needs deliberate deviation) | NO -- needs deviation from an explicitly mandated regex | One leg after block-1 leg 10, or one clause in followup 4 |
| F-4 | The lz-refactor replacement is net-new mandated content vs D-09 | NON-BLOCKING (owner's scope call) | N/A -- it is what the plan mandates | Owner decision; leg 15 already covers the plain-deletion variant |
| N-1..N-3 | leg-number mis-citation, one omitted leg, one overstated "section F states" | NON-BLOCKING | N/A | none required |

**No finding lets the chain go green with an owner boundary step skipped.** All eight boundary steps,
all twelve locked decisions and all four hygiene subjects are legged. Both commit branches fail closed.
The step-zero deadlock is gone.

### RECOMMENDATION: FORCE-PROCEED

The plan is executable. The four findings are a mandated stale comment, a wrong justification for a
routed residue, an unlegged escape that requires deliberate deviation, and a scope-tension the owner has
already accepted three times. None is worth a sixth cycle.

**Executor instructions that MUST accompany the force-proceed:**

1. **Task 1 A4 -- override the plan.** Preserve only the TOKEN `ROW PARSER` on
   `lib/pipe-table.mjs` line 1. You MUST rewrite the rest of that line: it says "One exported pure
   function" and your commit makes it three. Legs 7 and 8 only require the token to precede
   `const SEPARATOR_CELL_RE`. (F-1)
2. **Task 1 B0/N9 -- the needle is MANDATORY VERBATIM and this is the one place no leg protects you.**
   Write `re: /which side they mean[\s\S]*?\n## Reference material/i` with `wholeText: true`. The bare
   `/which side they mean/i` is FORBIDDEN and **passes every leg in this plan** -- you must not take
   that escape. (F-3)
3. **Task 3 step 10 -- delete `TAX` from `lib/row-guards.mjs` completely.** The plan says a leg is
   impossible there; that is wrong, and no leg protects it. After 3b, no surviving guard in that module
   references `TAX` (the four remaining row-scoped guards use `backingRows`). (F-2)
4. **Task 3 step 9 -- transcribe the 58 retired labels as EMITTED LABELS, not printed lines.** The
   roster gate compares the `label` argument, so the byte-identity entry is correctly the short form
   `[j9m] test-double-taxonomy.md byte-identical across all three skills`; the `-- sha256 ...` suffix is
   the `detail` argument and must NOT be included. RESEARCH Q2's block is correct as written -- copy it
   verbatim.
5. **Nothing else in the plan may be softened.** Do not edit any verify literal. Do not collapse Task
   3's two commits. Do not add a commit-scoped leg for Task 4 section E (measured: it false-fails
   today). Run the battery after commit 3a and record the emitted count in the SUMMARY -- no leg can
   observe it.

**Orchestrator additions (one line each, cheap):**

- followup item 2: add `TAX` to the enumerated residues (F-2).
- followup item 4: add "confirm N9's needle is the REGION-SCOPED form, not the bare one" (F-3).
- followup item 7: add "confirm the header's first line no longer claims one exported function" (F-1).

**ABORT is not warranted.** Nothing here requires re-planning, no locked decision is contradicted, and
the instrument work is sound at the mechanism level -- verified by 12 real-evaluator runs, a full
fail-open sweep with probed anchors, an authoritative `emittedLabels` dump, and four verbatim block runs.

---

## Worktree hygiene

One throwaway worktree was created (for the N9 12-run matrix and the `emittedLabels` dump) and removed.
`git worktree list` shows only the main checkout. The main tree is unchanged from the start of this run:
`M .planning/STATE.md`, `M ...260729-lc9-PLAN.md`, `?? ...PLAN-CHECK-2.md`, `?? ...PLAN-CHECK-3.md` --
dirty exactly as designed. Nothing under `plugins/` or `.claude/` was modified.
