# 260729-2ig -- Acceptance review findings

**Ran:** 2026-07-29, unattended
**Reviewers:** two independent; one wholly unprimed (content), one instrument auditor. Both firewalled
from `.oracle/`. Both briefed with `git diff 8edbe0c..HEAD`, verified a true-ancestor range so there is
no merge-boundary hazard.
**Verdicts:** content ACCEPT WITH FIXES (2 BLOCKING, 15 IMPORTANT, 10 MINOR); instrument TRUSTWORTHY
WITH GAPS.

**STATUS: MERGED, NOT ACCEPTED.** The work is on `gsd/lz-tdd-0.0.3-lz-red`, unpushed, untagged, not
released -- the same holding state `260728-wev` sat in. Nothing reaches a user from here.

---

## Why this round stopped instead of running a fourth

Three rounds have now failed their acceptance gate: `260728-j9m` (ten blocking), `260728-wev` (four
blocking), and this one (two blocking). Blocker counts are converging, but the IMPORTANT tier is not,
and the decisive pattern is this:

**Each round's fix introduced a fresh instance of the class it was repairing.**

| Round | The self-falsifying claim | Where it came from |
|---|---|---|
| j9m | a cell is named by NO author -- while five of its own rows sat in that cell | original authoring |
| wev | that same cell is POPULATED -- while zero rows sat in it | the fix for j9m |
| 2ig | a candidate word COLLIDES -- while the table commits it to one cell only | the fix for wev's ambiguity finding |

Every repair adds a new checkable assertion, and every new assertion is a fresh chance to contradict
the table. Continuing to hand-patch content while unattended is how a fourth instance gets written. The
owner is offline and cannot be asked, so the loop stops here and hands back.

**This is not a judgement that the work is bad.** Measured improvements this round are real and are
recorded below. It is a judgement that the remaining content defects need a different mechanism than
another patch, and that the mechanism is identified.

---

## The structural insight, and the recommendation

Content BLOCKER 2 is machine-checkable and is not currently machine-checked. The document defines
collision as a word committed to more than one cell of the three-axis grid, and says the reader should
check that against the table. That is a derivation, not an opinion -- so a guard can compute each
candidate word's cell set from the parsed table and assert the survey's verdict against it.

**Recommendation: build the verdict-derivation guard instead of editing the verdict.** That closes the
whole class permanently rather than patching its third instance, and it is the same move that worked
for the counts this round -- the count guards that re-derive from their lists are the guards the auditor
rated SOUND.

The instrument already has the parts: `pipe-table.mjs` parses rows, and `row-guards.mjs` holds pure
`(text) => {ok, why}` guards with a fixture-based selftest.

---

## Content review: the two blockers

**C-B1. A mandatory qualifier points at sources that do not carry it.** `test-double-taxonomy.md:285-287`
says the Beck side of a live conflict is owned "by the report and essays cited in his rows above". The
Beck surface that actually carries that position is named in `principle-backing.md:67`/`:85` and
`beck-tdd-by-example.md:26`/`:83`. No Beck row in the taxonomy cites it -- the rows give a 1994 report
plus essays from 2007-2010, Feb 2022, Aug 2008 and Jan 2022. A coach therefore cites the wrong work AND
attaches the two qualifiers the document marks NOT OPTIONAL to it. On the one row flagged mandatory.
Note the traffic direction: the dependent is right and the taxonomy is wrong, which is how this
surfaced.

**C-B2. A survey verdict is falsified by the document's own criterion and its own table.** `:334-337`
marks `empty method` as COLLIDES. `:313-315` defines collision as a word committed to more than one
cell, "checkable against the table above". Both `empty method` rows -- `:241` and `:244` -- are
`Production | Own implementation | Transitional`, the SAME cell. So the verdict has no row behind it,
the clause about a body that stays empty cites nothing, and two downstream totals move: "five of them
collide" becomes four. See the recommendation above rather than patching the verdict.

## Content review: the IMPORTANT tier, and what it clusters on

Fifteen findings, concentrated almost entirely on **absence claims and attribution** -- the two things
the document declares itself most disciplined about. The ones that matter most:

- **A rule this round DELETED was guarding a live defect.** The previous hard rule forbade wording
  "about what some author does or does not name". That clause was removed in this range while the
  unhedged claim it would have caught survived at `:106` -- and that claim is the entire basis for a
  NOT-authority ruling. **This traces to the split ruling on superstructure, made on the orchestrator's
  framing; re-opening it is the owner's call.**
- Two whole-book absence claims (`:470-471`, `:488-489`) are unhedged while the equivalent claim for
  another print book is carefully scoped 90 lines away -- an inconsistent standard between two sources.
- `:404-406` cites the document's own qualifier 2 for a rule qualifier 2 does not state; qualifier 2's
  actual content argues the opposite way.
- `:135-136` states a rule about itself that `:464` violates.
- The headline finding is over-credited: `:19`/`:169`/`:171` credit an author with a finding `:98` says
  he only corroborates, and the credit rests on apparatus `:391-392` says must never be a sole warrant.
- `:289` is a sibling-relative link that **dead-ends in two of the three shipped copies** -- the two
  mandatory qualifiers are declared "stated in full" behind it.
- Two named artifacts are orphaned (`:368`, `:389`): still discussed, no row, no cell, no tier.
- Clean Code and Woolf carry load but have no row, so the document's own "read the row's own tier cell
  and nothing else" instruction leaves them untierable.
- The collision criterion misfires on all 14 `Either`-typed rows.

## Content review: what measured SOUND

Stated so this is not read as uniformly negative. Every count re-derived correctly. The 14-item
enumeration is exact and complete, no omissions or extras. The gate-scope claim at `:211-213` is TRUE
against the checker's actual walk, including its honest NOT-SHIPPED disclosure. The bare-contested-word
rule holds in shipped files. No dependent contradicts the taxonomy. The `Either` handling, the
naming-versus-meaning citation split, and the withdrawal of the universal no-name finding via its
counterexample are all careful work.

---

## Instrument audit

Everything below was measured by running the real checker against real content in a sandbox copy, 60+
invocations, with baseline files extracted via `git show`. The repo was not modified.

### Verified sound, and genuinely improved

- **All 20 RED-at-baseline claims reproduced exactly**, including verbatim FAIL strings. All 14
  invariant-GREEN reproduced. **No guard misfiled between the two proof kinds.**
- **The seven row-scoped guards genuinely close the six measured defects.** Decoy prose is now
  STRUCTURALLY unreachable, not merely narrowed away: the parser only reads pipe-leading lines of the
  right width, so an occurrence in prose cannot satisfy a row assertion. All seven fail on row
  deletion, row duplication and empty input.
- **The roster gate is exact equality and strong**, verified across eight scenarios including the short
  swap that motivated it -- count balances, label-set assertion fires anyway.
- **Byte identity: 9/9 FAIL** across content injection, whitespace-only single-byte drift and outright
  deletion, in each of the three positions independently.
- The widened tree gate is binding, not decoration: injections into each of the three trees each FAIL
  with file and line.

### The vacuous guard, found

**`noEmptyDataCell` is defeated by deleting the cell's PIPE along with the cell, and the full
175-check battery stays exit 0 with zero FAILs.** Blanking the cell and keeping the pipe is caught;
deleting cell and pipe is not, because the parser SKIPS rows of the wrong width. Since GFM inserts
empty cells for a short row, the rendered document then shows exactly the empty cell the guard forbids.
The two mutations render identically and only one is caught.

Two consequences. First, `pipe-table.mjs`'s own header claim -- "a skipped row can therefore never pass
silently" -- is FALSE for whole-table scans; it holds only for name-keyed guards. Second, **about 21 of
34 rows can be removed from the instrument's view by deleting one character.**

### Two author claims refuted by measurement

- The claim that an unlabelled candidate bullet fails rather than being silently skipped: a 2-space
  INDENTED bullet matches neither pattern, so an eleventh candidate can be added with both counts
  unmoved. Top-level is correctly caught -- the control passes.
- The claim that non-possessive `five kinds` sites are covered by the pinned site count and the
  figure-attribution topic: three rewordings each leave the battery at exit 0 -- an apostrophe-s form,
  one intervening word, and a different possessive. Neither claimed backstop fires.

### Further measured gaps

- **All six new must-not-appear needles are wrap-evadable**: 6/6 caught single-line, 6/6 MISSED with a
  newline inside the phrase. The authors wrote this very constraint one commit later for the chronology
  ban. Their "verified single-line-matchable at the current wrap" is a snapshot, not an invariant.
- One must-appear topic **already keeps passing after both substantive passages are reworded**, because
  a table cell and a Sources bullet carry the phrase. That is the documented defect class recurring.
- Three count guards derive from a wider region than their label names, each with a measured evasion:
  one counts to EOF because no following heading exists, one is file-global rather than
  section-scoped, one misses indented bullets.
- The selftest is a real backstop for weakening a row guard's cell pattern, but relaxing the site check
  from exact equality to a lower bound leaves every assertion green -- there is no "an extra stated
  site must FAIL" fixture.

### The four self-reported holes: ALL CONFIRMED

The executors flagged these against themselves, which is why they were worth testing rather than
crediting.

- **(a) No committed fixture set for the two chronology guards** -- confirmed. The auditor demonstrated
  12 independent failures through the real checker, including 4/4 wrapped phrases, which independently
  reproduces the flattening justification. LOW as correctness, MEDIUM as durability.
- **(b) The lineage hole** -- confirmed, and **a working fix was found**. Three ancestry-phrased
  chronology claims each left the battery green. A needle genuinely cannot fix it (it false-fails the
  legitimate ancestry block and the disclaimed etymology), but **allowlist-inversion by occurrence
  count** on ancestry stems catches 5/5 injections with ZERO false-fails on the unmodified document --
  and that is both the instrument's existing idiom and the repo's own hygiene doctrine.
- **(c) Both chronology guards scan one of three copies** -- confirmed; the sha256 gate catches all six
  cross-copy cases, so the composition holds today. Wider than reported, though: the ten topics and
  seven absent needles share the same single-copy dependency.
- **(d) The roster gate cannot see a guard weakened IN PLACE** -- confirmed four ways. The asymmetry the
  authors did not state: the selftest catches a weakened ROW guard, but nothing catches a weakened
  topic, absent needle or chronology guard. That is **19 of 36 guards uncovered**, not a corner case.

### Repair priority, from the auditor

1. Assert the parsed row count against the raw pipe-line count -- **one line**, closes the vacuous
   guard and the ~21 invisible rows.
2. Flatten the six must-not-appear needles, or split them into non-wrapping tokens.
3. Section-scope the two file-global count derivations.
4. Add the ancestry-stem count pin for the lineage hole.
5. Add fixtures for the two chronology guards, and an extra-stated-site assertion.

---

## Still UNRESOLVED, carried from the plan and unclosed

- The numeral-absence claim cannot be certified book-wide: the oracle has no search tool and the
  orchestrator is firewalled from the store, so only a harness sweep can close it.
- The axis classification of two unplaced terms stays at its conservative default -- no rows added,
  they remain caveats where already cited. High impact and genuinely contested, so never auto-decided.

## For the owner, in priority order

1. **Decide whether to fix content or build the verdict guard** for C-B2. The recommendation is the
   guard.
2. **Re-open the deleted hard rule** on author-absence wording. That deletion came from the split
   ruling on the orchestrator's framing, and it removed a guard that a live defect then walked past.
3. Instrument repair 1 is one line and closes a whole class -- worth doing regardless of the content
   decision.
4. C-B1 needs the right Beck surface named in the row. The dependents already name it correctly.
