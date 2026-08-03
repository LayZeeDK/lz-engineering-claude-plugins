# 260729-lc9 -- Plan-checker findings (iteration 3)

**Ran:** 2026-07-29, gsd-core:gsd-plan-checker (re-check, iteration 3; owner extended the cap, 2 cycles remain)
**Verdict:** ISSUES FOUND -- 2 EXECUTION-BLOCKING (both NEW), 4 NON-BLOCKING (all NEW)
**Plan checked:** `260729-lc9-PLAN.md`, **1314 lines** (the brief said 1295), 4 tasks, 6 commits, 9 guards, 58 retirements

**All TEN iteration-2 findings are CLOSED. Every number, table and exit code the planner reported
reproduces exactly when re-derived independently. Not one claim was found overstated on measurement.**

The two new blockers are the SAME SHAPE as BLOCKER-A/BLOCKER-B -- a numbered step in the action with no
leg -- at two sites neither iteration 1 nor iteration 2 examined. They are pre-existing holes in Task 3,
not damage from this revision. I missed them twice; the `.continue-here.md` prevention for this row is
"enumerate the task's OWN steps and map each to a leg", and this is the first iteration in which I did
that exhaustively for all 15 of Task 3's steps.

---

## Section 1: OBSERVED exit codes -- all four blocks extracted programmatically and run VERBATIM

Blocks pulled from the `<automated>` elements on disk by script, run with `bash` from the repo root
against the unmodified (dirty-by-design) tree.

| Block | `&&` count | legs | `;` | non-ASCII | `rg -E` | OBSERVED exit | First failing leg |
|---|---|---|---|---|---|---|---|
| Task 1 | **20** | 21 | 0 | 0 | 0 | **1** | leg 2 `scanTables: ` PASS count `-ge 6` |
| Task 2 | **15** | 16 | 0 | 0 | 0 | **1** | leg 2 `! node check-red-references.mjs` (battery GREEN today) |
| Task 3 | **21** | 22 | 0 | 0 | 0 | **1** | leg 2 the step-12 mandated label |
| Task 4 | **30** | 31 | 0 | 0 | 0 | **1** | leg 1 `test -s` on the archive path |

Planner's claimed leg counts (20 / 15 / 21 / 30) match exactly. `verify.plan-structure`:
`valid: true`, 0 errors, 0 warnings, 4 tasks, all of files/action/verify/done present on all four.
PLAN.md non-ASCII bytes: **0**. Zero `rg -E`. Zero `-F` patterns with a leading `--`.

Baseline re-established: battery exit **0**, **175** emitted lines, `EXPECTED_CHECKS = 174` at `:925`,
selftest exit **0**, `check-hygiene.mjs` exit **0**. Tree dirty exactly as documented
(`M STATE.md`, `M PLAN.md`, `?? PLAN-CHECK-2.md`).

**Environment claim verified, not assumed:** `/tmp/lc9-*.txt` written by bash redirection IS readable by
`rg` given the same literal argument -- MSYS converts rg's argv, so redirect and read agree
(`rg -c 'x' /tmp/probe.txt` -> exit 0, count 1). No `/tmp` hazard in any block.

---

## Section 2: BLOCKER-A -- CLOSED. The 12-run matrix re-derived through the real evaluator.

I rebuilt the probe from scratch in a throwaway `git worktree` (detached at HEAD), patched the matcher,
injected the exact topic into the `SKILL.md` FILES entry at `:311`, generated three variants of the live
`lz-red/SKILL.md`, and ran `node check-red-references.mjs` for each -- 4 matcher/needle combos x 3
variants = 12 runs, reading the emitted `[PASS]`/`[FAIL]` line for the label.

**Variant placement verified before use:** in-procedure puts the rule at line 54 with
`## Reference material` at 143 (rule precedes heading: true); appendix-only puts it at 143 with the
heading at 141 (precedes: false). So the variants really do straddle the region boundary.

| Matcher x needle | absent | rule IN the coach procedure | rule ONLY in the appendix |
|---|---|---|---|
| per-line (evaluator AS SHIPPED) + region needle | FAIL | **FAIL -- the deadlock** | FAIL |
| `wholeText: true` + region needle (ADOPTED) | FAIL | **PASS** | **FAIL** |
| `wholeText: true` + BARE needle (FORBIDDEN) | FAIL | PASS | **PASS -- overclaim** |
| per-line + BARE needle | FAIL | PASS | **PASS -- overclaim** |

**Byte-identical to the plan's table at `:333-338`.** Row 2 is the only row that discriminates all
three ways, and it rejects appendix-only -- which is the entire point.

Additional verifications, each observed:

| Claim | Observed |
|---|---|
| The fix is ONE line and strictly additive | With `wholeText: true` on N9 alone, the other **175** emitted lines are byte-identical to the per-line run: **0 differing**. |
| No other topic gains `wholeText` | `wholeText` occurs **0** times in the shipped checker, so Task 1 legs 6 and 7 (`topic.wholeText` = 1, `wholeText: true` = 1) are both RED at baseline and pin the flag to one site. |
| `:591` is genuinely irrelevant | `:591` is the `absent`-guard matcher; the plan's only `absent` guards are N5/N6 with the single-line needle `/Mock rule/i`. Nothing in the plan needs a multi-line `absent` needle. |
| Line citations exact | `:548` readFileSync, `:549` split, `:552` per-line `hit`, `:591` absent matcher, `:311` SKILL.md entry with `dir: SKILL_ROOT`. All exact. |
| N9 is the first multi-line needle | the `[\s\S]` idiom occurs **0** times in the shipped checker. |

**Verdict: CLOSED.** The recommended fix from iteration 2 was adopted correctly and the plan's
discrimination table is now measured through the mechanism that will actually run it.

---

## Section 3: BLOCKER-B -- CLOSED, and the planner's refutation of my fix is CORRECT

**I was wrong; the planner is right on both counts. Stated plainly.**

`row-guards.selftest.mjs:196-206` prints `  [PASS] <label>` on success, and prints the offender string
ONLY from the `[FAIL]` branch (which JSON-dumps expected/actual).

1. **My `rg -q -F <offender string> /tmp/lc9-st.txt` leg could never have passed on a green run.** The
   offender string reaches stdout only from the `[FAIL]` branch. A `[PASS]` line prints the label and
   nothing else. The planner's refutation is exactly correct.
2. **My `rg -q -F scanTables` leg would have been satisfied by a bare section header.** The selftest
   already prints group headers with plain `console.log` (e.g. `lib/pipe-table.mjs -- parseRows` at
   `:217`), so a header with zero `check()` calls under it satisfies a substring grep. Also correct.

The replacement is sound. Each leg is RED at baseline and no-op-resistant:

| Leg | Form | Observed today |
|---|---|---|
| scanTables PASS lines | `rg -c` on `^  [PASS] scanTables: ` with `-ge 6` | exit **1** (count 0) |
| findLinkTargets PASS lines | same shape, `-ge 6` | exit **1** |
| escaped-pipe case | `[PASS].*escaped pipe` count = 1 | exit **1** |
| offender string in SOURCE | count = 1 in `row-guards.selftest.mjs` | exit **1** |

The two-space `[PASS]` anchor matches `check()`'s exact prefix, and `rg -c` counts lines, so six
`check()` calls give six lines. A `touch`-only or do-nothing execution yields 0 on all four. The
mandated `scanTables: ` / `findLinkTargets: ` label prefixes are what make the count meaningful.

**Verdict: CLOSED.** See NEW-4 for one overstated sentence inside this otherwise-correct repair.

---

## Section 4: NB-1 .. NB-8, one by one, with observed evidence

### NB-1 (Task 3 taxonom-absent leg fail-open on a path typo) -- **CLOSED**

The counted positive anchor is present at leg 11, immediately before the absent leg at 12, on the SAME
path. Probed both ways:

| Command | exit |
|---|---|
| leg 12 absent leg with a deliberately mistyped path | **0** -- fail-open CONFIRMED in isolation |
| leg 11 anchor (Fowler-label count = 1) with the SAME mistyped path | **1** -- the anchor genuinely closes it |
| leg 11 on the correct path today | **1** (RED; the phrase arrives in Task 2) |

### NB-2 (G17's emitted LABEL is a stale claim) -- **CLOSED**

| Claim | Observed |
|---|---|
| Constant location | `:690 const BARE_QUALIFIER_LABEL = ...outside the taxonomy` -- exact |
| Emitted today | output line 160, `[PASS]` |
| Absent from NEW_LABELS | the `NEW_LABELS` block starts `:932` (plan says `:932-956`); the only `outside the taxonomy` occurrence in the whole checker is the constant itself, count **1** |
| Count 0 in RETIRED_LABELS | `outside the taxonomy` in `lib/row-guards.mjs`: **0** |
| RESEARCH.md `:341` is in the KEEP block | Confirmed: the retire total line is `:337`, the KEEP block is `:339-344`, and the old G17 string sits inside it |
| New string collides with nothing | the `in the shipped tree` form in the checker: **0**, so Task 3 leg 8 is RED at baseline |
| Legged both ways | leg 8 (new string emitted exactly once) exit **1**; leg 9 (old phrase absent from output) exit **1**. Both flip together only. |

### NB-3 (step-12 replacement unlegged) -- **CLOSED**

The mandated label is pinned verbatim as Task 3 leg 2 (`RETIRED_LABELS are non-empty, duplicate-free,
and each carries a filename or a bracketed tag`). Observed exit **1** today, and it is the block's
first-failing leg. Deleting the assertion instead of replacing it now fails.

### NB-4 (H2 pure `git mv` has no mechanical leg) -- **CLOSED**

Re-measured by actually performing both moves and committing them in a throwaway worktree:

| Subject | `git log -M --name-status` | leg exit |
|---|---|---|
| pure `git mv` + `git rm` of the two siblings | `R100 plugins/.../test-double-taxonomy.md .planning/research/test-double-taxonomy.md` | **0** |
| same move with ONE line prepended before the commit | `R099 ...` | **1** |

The two sibling copies show as `D` lines, so exactly one `R100` line is produced -- the count-equals-1
form is well-formed even though all three copies are byte-identical (one add pairs with one delete). The
leg discriminates exactly the H2 misreading it exists to catch, and it selects by subject so it survives
both of Task 3's commits.

### NB-5 (executor authorized to edit a verify literal) -- **CLOSED**

The `= "5"` total is gone. Five exact per-subject pins plus a plan-structural `-le 6` ceiling. All five
pins observed exit **1** today; the ceiling exits **0** (upper bound only, as designed). Step zero's
fallback now says "Do NOT edit any verify literal" and edits nothing. Both branches (six commits with
step zero, five without) satisfy the same unmodified chain -- verified by construction: no leg carries a
branch-dependent number.

### NB-6 (inert-header content beyond two literals unlegged) -- **CLOSED**

Six mandated literals, each with its own leg. Run against a VERBATIM copy of the shipped taxonomy placed
at the target path in a worktree (i.e. Task 3's `git mv` done, none of Task 4's edits):

| leg | subject | exit |
|---|---|---|
| 1 | `test -s` | 0 (anchor) |
| 2 | positive counted anchor on the C-B1 line | 0 (anchor) |
| 3 | `INERT RECORD` | **1** |
| 4 | `plugin-wide shared reference` | **1** |
| 5 | `not an agent input` | **1** |
| 6 | `260729-2ig-ACCEPTANCE-REVIEW.md` | **1** |
| 7 | ordered `2 BLOCKING` / `15 IMPORTANT` / `10 MINOR` | **1** |
| 8 | `has no search tool` | **1** |
| 9 | `does or does not name` | **1** |
| 10 | D-11 region-scoped | **1** |
| 11 | C-B1 region-scoped | **1** |
| 12-16 | the five negative legs | **1** each |

Positive control that the file WAS scanned: **31** Meszaros hits. So a move-without-edits cannot pass.

### NB-7 (Test Spy leg was file-level) -- **CLOSED**

Region-BRACKETED between two stable keys each. All four keys occur **exactly once** in
`message-matrix.md`. Observed:

| Check | exit |
|---|---|
| leg 1 (outgoing-command heading -> Test Spy -> outgoing-query heading) | **1** (RED) |
| leg 2 (`gate.openGate` -> Test Spy -> `toHaveBeenCalledWith`) | **1** (RED) |
| positive control, leg-1 form with needle `Mock rule` | **0** |
| positive control, leg-2 form with needle `warranted double` | **0** |
| negative control: the `:73` sentence (past the closing heading at `:60`) in leg-1 form | **1** |

The bracket is load-bearing, exactly as claimed. Headings measured at `:50` and `:60`; the target bullet
`:57` is inside, `:73` is outside.

### NB-8 (Task 3 scope) -- **CLOSED**, one residue

The split happened along the stated seam. 3b is legged with a positive anchor FIRST:

| Check | exit |
|---|---|
| leg 17 `ROW_SCOPED_GUARDS` in `lib/row-guards.mjs`, `-ge 1` | **0** (anchor holds) |
| leg 17 with a mistyped path | **1** (anchor closes the four absence legs after it) |
| legs 18/19/20 `COUNT_GUARDS` absent from checker / row-guards / selftest | **1** each (counts today: 10 / 1 / 23) |
| leg 21 the four TAXONOMY identifiers absent | **1** |

Residue -> NEW-5: the claim that the count is "125 both before and after 3b" is NOT legged; the verify
block runs once, after 3b.

---

## Section 5: the fail-open sweep (Priority 1) -- EXHAUSTIVE, direction-classified

Every leg in all four blocks was classified by whether a substituted `0` or an empty capture SATISFIES
its comparison. `|| echo 0` counts: block 1 = 6, block 2 = 0, block 3 = 4, block 4 = 6. Zero
`2>/dev/null`, zero `|| true`, zero `|| :`.

**Result: exactly ONE `|| echo 0` leg sits in a fail-open direction, and it is anchored.**

| Leg | Form | Direction | Anchor in the SAME chain | Anchor probed |
|---|---|---|---|---|
| B4 leg 22 | `-le 6` with `\|\| echo 0` | **FAIL-OPEN** | legs 17-21, five positive counted pins on the same `git log --format=%s` pipeline | broken pipeline -> leg 22 exit **0**, leg 17 exit **1**. Closed. |

Every other `|| echo 0` leg compares `-ge N` (N >= 1) or `= "1"`, where a substituted `0` FAILS.
Verified by inspection of all 15 of them.

The remaining fail-open-direction legs use `| wc -l` or a leading `!` on `rg -q`, which collapse rg
exit-2 the same way. All are anchored by a positive counted assertion on the same subject inside the
same chain:

| Legs | Subject | Anchor |
|---|---|---|
| B2 leg 6 (Mock rule absent under `plugins/`) | `git grep -- plugins/` | leg 9, positive counted `git grep -l ... -- plugins/` = 2 |
| B3 leg 9 (old G17 phrase absent from output) | `/tmp/lc9-t3.txt` | legs 5,6,7,8 positively grep the same file, and leg 4 creates it |
| B3 leg 10 (taxonomy basename absent under `plugins/`) | `git grep -- plugins/` | legs 11, 15, 16 positive counted `git grep` under `plugins/` |
| B3 leg 12 (taxonom absent) | `principle-backing.md` | leg 11, same exact path (NB-1 fix; probed above) |
| B3 legs 18, 20, 21 | checker + selftest paths | legs 4 and 1 `node` the same paths |
| B3 legs 19, 21 | `lib/row-guards.mjs` | leg 17 `-ge 1` on the same path (probed above) |
| B4 legs 12-16 (five negated `rg -q`) | the archive file | leg 2, positive counted `rg` on the same file. Probed: a negated `rg -q` on an absent path exits **0**; leg 2 on that same absent path exits **1**. |
| B4 legs 23, 24, 25 | `git log --grep=quick-260729-lc9` | legs 17-21 pin subjects that each CONTAIN the tag literal, so `--grep` provably matches. Confirmed against the existing wip commit, count 1. |
| B4 leg 26 | the archive file | leg 2 |
| B4 leg 31 | `git status --porcelain` | n/a; cannot fail-open in a repo |

**Verdict on Priority 1: no fail-open hole.** Every fail-open-direction leg has a proven anchor. The
planner's claim that `|| echo 0` fails closed is correct for the legs it was applied to, and the one
`-le` case it does NOT close is separately anchored.

For the record, since order was emphasised in iteration 2: in an `&&` chain, anchor POSITION does not
change the chain's verdict (any failing leg fails the whole chain). Anchor-first matters for diagnosis,
and the plan gets it right anyway.

---

## Section 6: regression -- everything iteration 2 confirmed still holds

Independently re-derived, not transcribed.

| Item | Observed |
|---|---|
| 58 retirement labels from RESEARCH Q2 fenced blocks | **58** extracted, **0** duplicates, **all 58** match an emitted baseline line VERBATIM |
| Reverse direction clean | **58** emitted labels mention `taxonom`; exactly **1** is absent from the retire list -- the G17 label, deliberately KEPT ("retire 58, keep 2") |
| `174 - 58 + 9 = 125` | **125**. `EXPECTED_CHECKS = 174` at `:925`; 175 emitted lines (174 + roster) |
| RETIRED 6 -> 64, ROW_SCOPED 7 -> 4, COUNT_GUARDS 9 -> deleted, OLD_NEEDLES 7 -> 4 | live module import measures **6 / 7 / 9 / 7** today; arithmetic consistent |
| NEW_LABELS 34 -> 13 | 16 taxonomy literals + `TWO_IG_GUARDS.map` (7 row-scoped + 9 count = 16) + 2 chronology = **34**. After: 4 surviving + 9 lc9 = **13** |
| Roster clauses individually pinned in Task 3 | legs 6 and 7 pin the `64` and `13` counts, which mechanically enforce `RETIRED_LABELS.length === 64` and `NEW_LABELS.length === 13`. Stronger than iteration 2. |
| Task 1 leg 9 (FAIL == 8) is a TIGHT gate | `rosterDetail` (`:962-972`) joins three INDEPENDENTLY worded clauses, so the `183 checks` string CAN appear on a failing roster line -- but then the roster is a 9th `[FAIL]`, which leg 9 catches. Iteration 2's reasoning holds. |
| FILES.length 12 -> 11 | **12** `name:` entries measured, the taxonomy entry at `:353`. Composed-label prefixes `testing-stance/message-matrix.md`, `testing-stance/functional-core.md`, `SKILL.md` all byte-right. |
| Task 2's seven out-of-scope pins | ALL SEVEN exit **0** today (correct values, satisfied if untouched). Legs 6 and 9 exit **1** (RED). |
| Mock rule site map | `message-matrix.md:38,47,57,67` (4) + `functional-core.md:42,44` (2) = SIX. N5 = 4, N6 = 2. Exact. |
| Escaped-pipe proof class | `plugins/**/*.md`: **0** escaped pipes. `.planning/research/STACK.md`: **3**. Exact. |
| The four Task 4 negative needles non-vacuous | count **1** each today, plus the relative-link needle count 1 |
| MINOR-2 region scoping still load-bearing | file-wide `read end to end` = **1** today, so a file-wide leg would pass vacuously; the 600-char window is RED, the 3000-char widening exits 0. Calibration confirmed. |
| C-B1 leg RED at baseline | the essay title in the taxonomy: **0**. Region positive control (`kanban cycle` within 900) exits **0**. |
| H1 ordering | the only 2 unresolved relative links are the two `:289` hits Task 3 deletes; Task 1 captures them first (legs 11, 12) |
| Proof kinds clean | N1 invariant-GREEN + fixtures; N2-N9 RED-at-baseline. **N9 is now genuinely RED-at-baseline, not RED-ALWAYS** -- BLOCKER-A's correction verified. |
| D-01..D-12 honored, D-12 included | `requirements: [D-01..D-12]`; `<decisions_coverage>` names an implementing task per decision. D-12: no runtime artifact authored, lz-red keeps the inline rule and NO reference file, N3 makes the absence machine-enforced. Correct as the baseline arm, not a regression. |
| Eight owner boundary steps covered | 1 -> T4 B; 2 -> T1 N1; 3 -> T2; 4 -> T3 A; 5 -> T3 A,B; 6 -> T4 D + T3 step 8; 7 -> T3 D; 8 -> T4 A + T3 step 8 |
| No scope creep | nothing authors the runtime artifact, runs a metered command, touches EVL-03, changes lz-refactor beyond the D-01 deletion, or investigates the shared-reference mechanism. All five out-of-scope items honored. |
| Commit accounting fails closed both ways | five mandatory subjects pinned individually (a missing one fails its own pin); `-le 6` catches a stray seventh; collapsing 3a+3b leaves pin 4 at 0. Neither branch needs a verify edit. |
| Public-repo hygiene | allowlist-inversion only; no forbidden value written as a needle anywhere in the plan. Identity inversion today: the single email is the approved public contact. `check-hygiene.mjs` exit 0. |

**Guard/retirement integrity: still 9 guards, 58 retirements, count 125. No leg was weakened to pass.**

---

## Section 7: NEW findings

### NEW-1. Task 3 step 7 -- adding the archive path to guard N1's scope has NO LEG. **EXECUTION-BLOCKING.**

Step 7 (`PLAN.md:768-770`) instructs: add `.planning/research/test-double-taxonomy.md` to guard N1's
target list as ONE extra path alongside the `plugins/` walk. Nothing checks it.

OBSERVED:

| Probe | Result |
|---|---|
| the archive path as a literal in the checker today | count **0** |
| blocks that assert the archive path is in the CHECKER's scope | **none**. Block 3 mentions the path once -- leg 14, `test -s`, which proves only that the FILE exists. Block 4's mentions are all content assertions on the file itself. |
| blocks carrying any `no ragged pipe table` assertion | **block 1 and block 2 only**. Blocks 3 and 4 carry **none**. |

So the executor can skip step 7 entirely: N1 keeps scanning `plugins/` alone, `tablesSeen` is 28 so the
anti-vacuity leg passes, the emitted count is 125 either way (N1 is ONE `report()` over all its targets,
so adding a path does not change the count), the battery exits 0, and **every leg in Tasks 3 and 4
passes.**

What that silently falsifies:

- `must_haves.truths` entry 3 (D-08): "deleting a data cell together with its pipe from any table in the
  shipped tree **or in the archived copy** makes the battery FAIL". The archived half becomes unenforced.
- Task 4 section F: "Guard N1 now scans this file. Do not introduce a ragged row while editing" -- a
  false instruction with no gate behind it.
- The `<verification>` statement that the archived copy has no machine gate "beyond table shape" --
  there would be no table-shape gate either.

**Mechanically fixable, two legs** appended to Task 3's chain. The first pins the archive path literal in
the checker at count >= 1 (fail-closed, RED at baseline since the count is 0 today); the second carries
N1's `[PASS] ... no ragged pipe table` count-equals-1 assertion forward from Tasks 1 and 2 into Task 3,
which no block currently does. Neither proves the path is wired into N1's loop rather than merely present
in the file, so also add that one-line read to `<orchestrator_followup>`. Still a strictly better floor
than nothing.

### NEW-2. Task 3 step 8 -- the emitted SUMMARY string correction has NO LEG. **EXECUTION-BLOCKING.**

Step 8 (`PLAN.md:776-777`) names four required corrections; the fourth is "the final SUMMARY string,
which names the taxonomy and asserts byte-identity across three skills."

OBSERVED at `check-red-references.mjs:980` -- hand-written, and printed on the GREEN path only
(inside `if (failures === 0)`), which is exactly the path Task 3 ends on. It currently reads, in part:
`... + the test-double taxonomy) with topics + ... , taxonomy byte-identical in all three skills, ...`

| Probe | Result |
|---|---|
| blocks forbidding `byte-identical` in the output | **0** (blocks 3 and 4 both) |
| block 3's output legs | 5 (125 checks), 6 (64 retired), 7 (13 new), 8 (new G17 string), 9 (old G17 phrase absent). **Leg 9 forbids the LABEL's stale phrase only.** |

The `12/12` prefix self-corrects to `11/11` because it is interpolated from `filesPresent` and
`FILES.length`. The PROSE does not. So the executor can leave the instrument's headline GREEN output
asserting a document that no longer exists and byte-identity across three copies just deleted, and the
chain passes.

This directly falsifies Task 3's own `<done>` bullet, which claims the old G17 phrase appears nowhere in
the battery's output "so the instrument no longer names a document that has left the tree". The second
half is false on this path. It is the NB-2 class -- a stale claim in the instrument's own output -- one
line away from the label NB-2 just closed, in the single most-read line the tool emits.

**Mechanically fixable, two negated legs** appended to Task 3's chain (anchored by legs 5-7 on the same
file): forbid the literal `byte-identical in all three skills` and forbid the taxonomy mention inside the
GREEN summary's parenthetical. Both are RED at baseline (each string is emitted today, count 1). Do NOT
use a blanket taxonomy-absent leg on the output: N3's own label contains the word.

### NEW-3. `lib/pipe-table.mjs` is touched by NO leg in any block, so Task 3 step 15 and Task 1 A4 are both unlegged. **NON-BLOCKING.**

OBSERVED: blocks mentioning `pipe-table` = **0 of 4**.

Two unlegged instructions land there:

- Task 1 A4: "Add the two new exports and the shared splitter to the header's description of the module."
- Task 3 step 15: "OWN the `:16-18` header rewrite here (S14), do not merely confirm it."

The header today (`:14-25`) carries a MEASURED census naming the departing file: the taxonomy basename
with "36 lines start with a pipe, every one splits to exactly 11 parts (9 columns), ... 0 escaped pipes".
After Task 3 that is a measurement of a file the module no longer targets -- exactly the "a number that
the same commit set will change is a defect" class Task 1's own general rule (`:289-291`) forbids. Task 3
leg 21 covers only the checker and `row-guards.mjs`; leg 10 covers only `plugins/`. Nothing reaches
`.claude/.../lib/pipe-table.mjs`.

NON-BLOCKING because it is a comment in a lib module -- no behavior, no emitted output. Mechanically
fixable with one anchored pair: a positive `parseRows` count >= 1 on that path FIRST (the second leg is a
fail-open direction), then the taxonomy basename absent from it.

### NEW-4. One overstated proof claim inside the (otherwise correct) BLOCKER-B repair. **NON-BLOCKING.**

`PLAN.md:411-412` states: "Source-presence plus `node row-guards.selftest.mjs` exiting 0 together prove
the fixture exists AND that `scanTables` really produces that string; neither alone does."

They do not. The offender string could sit in a COMMENT, or as a hardcoded value on BOTH sides of a
`check()`; the selftest still exits 0 and the count is still 1. The two legs are a sound FLOOR -- they
kill the "wrote nothing" case, which was the blocker -- but they do not establish production of the
string. The plan is honest about exactly this residue for the step-12 label ("cannot prove the assertion
has teeth") and should say the same here rather than claiming a proof. Fix: soften the sentence, and add
the offender-string fixture to `<orchestrator_followup>` item 2's scope, which already reads the
selftest. Mechanical.

### NEW-5. Task 3's "125 both before and after 3b" is asserted, not legged. **NON-BLOCKING.**

The `<action>` (`:680-683`) and `<done>` (`:931-933`) both call the identical count across 3a and 3b
"the mechanical demonstration" / "the proof" that 3b deleted only unreferenced code. Task 3's verify
block runs the battery ONCE, after 3b (leg 4), so the after-3a count is never measured or recorded. The
reasoning is sound; the word "mechanical" is not earned.

Cheapest honest fix, no new leg: change the `<done>` bullet to require the executor to run the battery
after 3a and RECORD the emitted count in the SUMMARY, which `<output>` already asks for per task.
Mechanical.

### NEW-6. The lz-refactor replacement section's content is unlegged. **NON-BLOCKING.**

Task 3 B replaces `lz-refactor/SKILL.md:182-186` with a new H2 section. Leg 10 proves the taxonomy
POINTER is gone; nothing proves the replacement arrived, and `claude plugin validate .` would not notice
an empty section. Already routed: `<orchestrator_followup>` item 1 puts "the three replacement router
sentences" in the unprimed reviewer's scope. Recorded for completeness; no plan change strictly required.

---

## Section 8: Priority 2 and Priority 4

**Priority 2 -- no-op resistance.** Re-checked every new or edited leg. No existence-only assertion
survives on an evidence-bearing file: the RED-BASELINE record has six content legs, the selftest has four
content legs (Section 3), the archive has fifteen (NB-6), and `test -f` was upgraded to `test -s` at both
sites. **A `touch`-only or do-nothing execution satisfies nothing that is legged.** The residual no-op
surfaces are NEW-1, NEW-2 and NEW-3 -- steps with no leg at all, which is a coverage hole rather than a
weak leg.

**Priority 4 -- did the growth to 1314 lines introduce anything?** No new tree-dependent number without a
mechanism. Spot-checks of newly written text: the N9 matrix (re-derived, exact); "~100 topic and 14
absent guards" (approximate by construction; the checker carries 140 `label:` entries, so the order of
magnitude is right); "31 tables / 405 pipe rows" (explicitly labelled a DATED SNAPSHOT for the
RED-BASELINE record and explicitly forbidden from instrument comments); the R100/R099 pair (re-measured);
the six mandated literals (re-measured); the six `Mock rule` sites (re-measured). The one new number I
could not tie to a mechanism is "125 both before and after 3b" -> NEW-5.

Scope: 4 tasks, 6 commits, Task 3 remains the largest unit (15 steps, 12 files, 2 commits). Acceptable
for a quick task given the atomicity argument, unchanged from iteration 2.

---

## Section 9: anti-pattern sweep against `.continue-here.md`

| Pattern | Status in this revision |
|---|---|
| Verify block that passes on a no-op | **CLOSED** for every legged artefact (all four blocks run verbatim, exit 1; controls in Sections 3, 4). Open only where a step has NO leg -- next row. |
| Coverage hole in a verify chain | **OPEN at three sites -- NEW-1, NEW-2, NEW-3.** All three are Task 3 steps. Pre-existing; the prevention ("enumerate the task's own steps and map each to a leg") was applied exhaustively for the first time this iteration. |
| Blast radius asserted, not measured | **CLOSED.** All seven out-of-scope pins exit 0 today; the six-site Mock-rule map is exact. |
| Fail-open guard on an absent subject | **CLOSED.** Exhaustive direction sweep; every fail-open-direction leg anchored, each anchor probed (Section 5). |
| Fix breeds the same defect class | **NOT FIRING this round.** Both blocker repairs are correct and neither introduced a new defect. NEW-4 is an overstated sentence inside a correct repair, not a new defect. |
| Needle outlives its subject | **CLOSED** for the G17 label, both Test Spy legs, D-11 and C-B1. **OPEN for the SUMMARY string (NEW-2) and the pipe-table header (NEW-3)**, both stale-claim instances the plan itself lists as required edits. |
| Inferring behavior from structure | **CLOSED.** The N9 table is now measured through the real evaluator; I re-derived all 12 runs. |

---

## Section 10: verdict

**ISSUES FOUND -- 2 EXECUTION-BLOCKING, 4 NON-BLOCKING. All ten iteration-2 findings CLOSED.**

| # | Finding | Class | Fix |
|---|---|---|---|
| BLOCKER-A | N9 per-line deadlock | **CLOSED** -- 12-run matrix re-derived exactly, additivity confirmed over 175 lines | -- |
| BLOCKER-B | Task 1 step C unlegged | **CLOSED** -- and the planner's refutation of my proposed fix is CORRECT on both counts | -- |
| NB-1 .. NB-8 | see Section 4 | **ALL CLOSED** | -- |
| NEW-1 | Task 3 step 7 (N1's archive scope) has no leg; falsifies a `must_haves` truth and Task 4 section F | **EXECUTION-BLOCKING** (exit 0 with work undone) | mechanical, 2 legs |
| NEW-2 | Task 3 step 8's SUMMARY-string correction has no leg; falsifies Task 3's own `<done>` | **EXECUTION-BLOCKING** (exit 0 with work undone; a stale claim ships in tool output) | mechanical, 2 legs |
| NEW-3 | `lib/pipe-table.mjs` untouched by any leg; Task 1 A4 and Task 3 step 15 both unlegged | NON-BLOCKING | mechanical, 2 legs |
| NEW-4 | overstated proof claim at `:411-412` | NON-BLOCKING | mechanical, one sentence |
| NEW-5 | "125 both before and after 3b" asserted, not legged | NON-BLOCKING | mechanical, `<done>` wording |
| NEW-6 | lz-refactor replacement content unlegged | NON-BLOCKING | already routed to followup item 1 |

**No finding needs an owner decision.** All six are mechanical, none touches a locked decision, and none
requires re-planning. The total fix is six appended legs and two sentences.

**Ruling asked for explicitly: the planner's refutation of my BLOCKER-B fix is CORRECT.** `check()` prints
the offender string only on failure, so my grep of the selftest OUTPUT could never have passed on a green
run; and a bare `scanTables` substring grep is satisfied by a section header with zero cases, because the
selftest already prints group headers with plain `console.log`. Its replacement -- mandated label prefixes
plus pinning the offender string against the SOURCE -- is the right shape, and I verified all four legs are
RED at baseline. NEW-4 is the only residue and it is a wording issue, not a mechanism issue.

**Failure shape if force-proceeding instead of revising:** neither blocker stalls the executor -- both let
the chain go green with a step skipped, which is strictly worse than BLOCKER-A's stall was. NEW-1 leaves
the archived copy with NO machine guard at all and makes `must_haves` truth 3 and Task 4 section F false.
NEW-2 leaves the battery's GREEN summary asserting a deleted document and byte-identity across three
deleted copies. A force-proceed instruction would have to name both steps explicitly and tell the executor
they are unverified, because nothing in the plan will catch either omission -- the same "went fully green
over a blocking defect" pattern this work stream has now produced four times.

**Worktree hygiene.** Two throwaway worktrees were created for the BLOCKER-A and NB-4/NB-6 probes and both
were removed. `git worktree list` shows only the main checkout. The main tree is unmodified:
`M .planning/STATE.md`, `M ...260729-lc9-PLAN.md`, `?? ...PLAN-CHECK-2.md` -- dirty exactly as designed.
Nothing under `plugins/` or `.claude/` was touched.
