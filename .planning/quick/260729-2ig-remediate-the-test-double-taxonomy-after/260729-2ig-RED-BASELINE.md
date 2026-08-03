# Quick Task 260729-2ig: RED baseline for the strengthened checker

**Captured:** 2026-07-29
**Instrument:** `.claude/skills/lz-red-workspace/tools/check-red-references.mjs`, plus the new
`tools/lib/pipe-table.mjs`, `tools/lib/row-guards.mjs` and `tools/row-guards.selftest.mjs`.
**Tree state at capture:** the instrument is strengthened; NOTHING under `plugins/` is modified.
Asserted, not claimed: `git status --porcelain plugins/lz-tdd` was EMPTY at capture time, and that
assertion is a leg of Task 1's own verify chain. Once Task 2 runs, this baseline is unrecoverable and
the primary control becomes unverifiable forever, which is why the ordering is load-bearing rather
than bookkeeping.

## Pre-work commit

BASE=8edbe0ccbd959e447fd031ce51c23c94552ec088

## Two proof kinds, and why the demand is SPLIT

"Prove every new guard FAILS at baseline" and "prove every strengthened guard catches the evasion the
old guard passed" are in tension for any guard whose subject is ALREADY CORRECT in the live text. A
universal baseline-FAIL demand would order the executor to delete this round's core deliverable, or to
contort a needle to manufacture a RED. So the demand is split, and every new or changed guard below
carries EXACTLY ONE of these two kinds with that kind's evidence.

| Proof kind | Applies to | Evidence recorded here |
| --- | --- | --- |
| **RED-at-baseline** | a guard whose subject is wrong or missing in the live text | the `file:line` of the offending live text, plus the observed FAIL line |
| **Invariant, GREEN-at-baseline** | a guard asserting something already true, whose job is to STOP a regression | the selftest fixture set (pristine PASSES, mutation FAILS, empty text FAILS) and, for a STRENGTHENED guard, the row showing the OLD needle PASSES the same evasion |

**MEASURED: 14 of the 34 new or changed guards correctly PASS at baseline.** That is the instrument
being CORRECT, not the instrument being unproven. Predicted before the run: six of the seven
row-scoped guards, six of the nine count guards, the widened G17, and the roster gate. Actual: exactly
those fourteen. No unexplained difference.

## Check arithmetic

Measured baseline BEFORE this task: **146** emitted checks, 0 FAIL, exit 0.

PREDICTED from the guard inventory, in advance, and hardcoded as `EXPECTED_CHECKS`:

```
146 (baseline) - 6 (superseded file-scoped topics) + 7 (row-scoped) + 9 (count) + 6 (absent)
+ 10 (positive topics) = 172
```

| Bucket | Before | Change | After |
| --- | --- | --- | --- |
| topics (`FILES`) | 106 | minus 6 superseded file-scoped, plus 10 new positive topics | 110 |
| `absent` (`FILES`) | 17 | plus 6 | 23 |
| `requireFence` | 6 | unchanged | 6 |
| `requireNonIgnoreFence` | 1 | unchanged | 1 |
| scaffold | 12 | unchanged | 12 |
| post-loop, pre-existing | 4 | unchanged (D-05, SEAM-02, sha256, G17-widened) | 4 |
| post-loop, new row-scoped | 0 | plus 7 | 7 |
| post-loop, new count | 0 | plus 9 | 9 |
| **TOTAL, pre-roster** | **146** | | **172** |
| roster gate itself | 0 | plus 1 | 1 |
| **TOTAL emitted** | **146** | | **173** |

**Measured after: pre-roster count 172, equal to the PREDICTED literal; 173 total emitted lines; 20
FAIL; exit 1.** The roster gate snapshots the count BEFORE its own emission, which is why the literal
is 172 while the printed line count is 173. Observed:

```
  [PASS] [2ig] roster integrity: exact emitted-check count -- 172 checks, equal to the PREDICTED
  literal; all 32 new labels present; none of the 6 retired labels survive
```

The literal was NOT set from a post-hoc measurement. It was written from the inventory first and the
run then agreed, so no guard was lost between design and implementation. The inventory needed no
correction.

**Note the row-scoped swap is NOT net-zero:** seven in for six out is **+1**. Only the six-for-six
sub-swap cancels.

## The six removal-and-replacement pairings

Every removal is PAIRED with a replacement, so a reviewer can see no guard was silently dropped. Each
removed needle named a specific table ROW in its own LABEL while matching anywhere in the file, so the
row could be deleted outright and the guard still reported PASS. Ranked by measured decoy count.

| Removed (file-scoped) | Needle | Decoys it passed on | Replaced by (row-scoped) | New assertion |
| --- | --- | --- | --- | --- |
| `principle-backing.md: lz-tpp seam backing row` | `/seam\|handoff/i` | 6 prose lines | `seamRowBacked` | the row exists AND its tier cell matches the CANONICAL no-oracle string |
| `principle-backing.md: [j9m] failure-vs-error boundary row` | `/failure\|error boundary/i` | 5 prose lines | `failureVsErrorRowBacked` | the row exists AND its Source cell names Fowler's Refactoring 2e Ch. 4 |
| `principle-backing.md: [j9m] test-double taxonomy backing row` | `/test-double-taxonomy\.md/` | 1 prose cross-link | `taxonomyRowBacked` | the row exists AND its link target is the taxonomy |
| `principle-backing.md: Three Laws backing row` | `/three laws/i` | 1 section lead-in | `threeLawsRowBacked` | the row exists AND its Source cell names Robert C. Martin |
| `principle-backing.md: [wev G16] kanban-cycle essay named as the owned surface` | `/TDD is Kanban for Code/i` | 1 prose bullet | `kanbanEssayNamedInRow` | the row's Source cell names the owned ESSAY, and NOT the book |
| `test-double-taxonomy.md: [wev G8] Bernhardt row names a specific delivery` | `/\b(PyCon\|SCNA)\b/i` | 2 Sources bullets | `bernhardtDeliveryNamed` | the row's Source cell names a specific delivery |

Two of the six removed labels carry NO bracket prefix at all -- they are Phase-18 originals. The
strings above are the labels **AS EMITTED** (`<filename>: <label>`), which is the form the roster
gate's retired-label assertion consumes; a bare `label` value from `FILES` would not have matched.

Plus ONE net-new row assertion, `temporaryTestStubStatesRelationship`, which retires nothing. That is
seven guards closing six measured defects.

## Per-guard proof

### RED-at-baseline (20 guards)

| Guard | Proof kind | Live `file:line` evidence | Observed FAIL line |
| --- | --- | --- | --- |
| `temporaryTestStubStatesRelationship` | RED | `test-double-taxonomy.md:230` -- the cell describes the artifact and its near-miss status but never states that it is a Variation of Test Stub | `[FAIL] test-double-taxonomy.md: [2ig] Temporary Test Stub row states its relationship -- the Gerard Meszaros Temporary Test Stub row: its Defining property cell does not state its relationship to Test Stub` |
| `twelveSources` | RED | `:65` -- pinned to the POST value 2 against a live 3 (`:11`, `:65`, `:159`), so it FAILS at baseline BY DESIGN; `:65` sits inside the very clause E9(a) drops | `[FAIL] ... mapped-source count: expected 2 site(s) stating this total, found 3 [twelve, twelve, twelve]` |
| `fiveKindsEnumerated` | RED | no enumeration exists anywhere in the document | `[FAIL] ... kinds enumeration: expected exactly ONE enumeration run, found 0` |
| `ambiguitySurveyCount` | RED | `:282-303` -- nine candidate bullets, none carrying a verdict token | `[FAIL] ... ambiguity survey: no candidate bullet carries a verdict token` |
| `[2ig] no set-scoped emptiness assertion` | RED | `:64` (the hard rule's legalising clause) and `:81` (the bullet using it) | `[FAIL] ... stale marker still present (matches /no source in this set populates/i)` |
| `[2ig] no deliberate-negative intent inference` | RED | `:135` | `[FAIL] ... stale marker still present (matches /rather than an oversight/i)` |
| `[2ig] no every-available-name universal quantifier` | RED | `:275` | `[FAIL] ... stale marker still present (matches /Every available name/i)` |
| `[2ig] no possessive five-kinds attribution` | RED | `:56`, `:125`, `:134`, `:216` | `[FAIL] ... stale marker still present (matches /((\bhis\|\bits)\s+\|Meszaros'\s+)five kinds\b/i)` |
| `[2ig] no two-appendix count` | RED | `:341` | `[FAIL] ... stale marker still present (matches /both appendices/i)` |
| `[2ig] no only-occurrence skeleton phrasing` | RED | `:341` | `[FAIL] ... stale marker still present (matches /only `skeleton`/i)` |
| `[2ig] five-kind count attributed to the hierarchy figure` | RED | zero occurrences of `/hierarchy figure/i` | `[FAIL] ... topic token absent` |
| `[2ig] prose states four by folding two members` | RED | zero occurrences of `/prose states four/i` | `[FAIL] ... topic token absent` |
| `[2ig] the five kinds enumerated as direct subtypes` | RED | zero occurrences of `/direct subtypes/i` | `[FAIL] ... topic token absent` |
| `[2ig] naming citation versus meaning citation` | RED | zero occurrences of `/naming citation/i` | `[FAIL] ... topic token absent` |
| `[2ig] Temporary Test Stub relationship on the lifecycle axis` | RED | zero occurrences of `/lifecycle axis/i` | `[FAIL] ... topic token absent` |
| `[2ig] contested-word absence hedged to the swept scope` | RED | zero occurrences of `/not swept/i` | `[FAIL] ... topic token absent` |
| `[2ig] numeral absence hedged to the parts read end to end` | RED | zero occurrences of `/read end to end/i` | `[FAIL] ... topic token absent` |
| `[2ig] positive remote-variant finding across an address space` | RED | zero occurrences of `/address space/i` | `[FAIL] ... topic token absent` |
| `[2ig] do-nothing hook is the real near-miss trap` | RED | zero occurrences of `/do-nothing hook/i` | `[FAIL] ... topic token absent` |
| `[2ig] non-optional kanban qualifier carried` | RED | zero occurrences of `/one position among several/i` in the taxonomy (the qualifier lives only in the dependent, at `principle-backing.md:67`) | `[FAIL] ... topic token absent` |

**SCOPE OF THE POSSESSIVE NEEDLE, stated rather than implied.** It catches FOUR of the nine
five-kinds occurrences -- the ones carrying a possessive determiner (`his`, `its`) or the
explicit-name possessive. The other five occurrences are non-possessive in wording and are covered
instead by `fiveKindsEnumerated`'s PINNED SITE COUNT and by the figure-attribution positive topic --
NOT by this needle. Recording that honestly matters more than a needle that looks like it covers all
nine; a reviewer should know which mechanism carries which site.

**Every `absent` needle was VERIFIED single-line-matchable at the CURRENT wrap.** `absent` guards run
through the per-line loop and cannot use the whitespace flattening that `lib/row-guards.mjs` mandates
for its own multi-word needles, and that hazard already bit this checker once. The sharp case here is
the deliberate-negative inference: the phrase DELIBERATE NEGATIVE itself WRAPS across `:134-135`, so no
needle over that phrase could ever match. The needle is instead the inference's discriminating tail,
which sits wholly on `:135`.

### Invariant, GREEN-at-baseline (14 guards)

Six row-scoped guards find their rows, six count derivations already agree at their pinned site count,
the widened G17 finds nothing new, and the roster gate's prediction equals its measurement. For each,
the selftest fixture set IS the proof; a baseline FAIL is neither available nor required.

| Guard | Observed PASS | pristine PASSES | mutation FAILS | empty text FAILS |
| --- | --- | --- | --- | --- |
| `bernhardtDeliveryNamed` | `[PASS] test-double-taxonomy.md: [2ig] Bernhardt row names a specific delivery` | `bernhardtDeliveryNamed: pristine row names a delivery -> PASS` | `bernhardtDeliveryNamed: EVASION (delivery stripped from the ROW, Sources bullet still names one) -> FAIL` | `bernhardtDeliveryNamed: empty text -> FAIL (anti-vacuity)` |
| `failureVsErrorRowBacked` | `[PASS] principle-backing.md: [2ig] failure-versus-error boundary ROW backed` | `failureVsErrorRowBacked: pristine row names Fowler's Refactoring 2e Ch. 4 -> PASS` | `failureVsErrorRowBacked: EVASION (row deleted, prose still says failure) -> FAIL` | `failureVsErrorRowBacked: empty text -> FAIL (anti-vacuity)` |
| `seamRowBacked` | `[PASS] principle-backing.md: [2ig] classify-first seam ROW backed with the canonical tier` | `seamRowBacked: pristine row carries the canonical no-oracle tier -> PASS` | `seamRowBacked: EVASION (row deleted, prose still says seam and handoff) -> FAIL` **and** `seamRowBacked: a NON-EMPTY but wrong tier -> FAIL (a bare non-empty check could not catch this)` | `seamRowBacked: empty text -> FAIL (anti-vacuity)` |
| `taxonomyRowBacked` | `[PASS] principle-backing.md: [2ig] test-double taxonomy ROW backed` | `taxonomyRowBacked: pristine row links the taxonomy -> PASS` | `taxonomyRowBacked: EVASION (row deleted, prose cross-link survives) -> FAIL` | `taxonomyRowBacked: empty text -> FAIL (anti-vacuity)` |
| `threeLawsRowBacked` | `[PASS] principle-backing.md: [2ig] Three Laws spine ROW backed` | `threeLawsRowBacked: pristine row names Robert C. Martin -> PASS` | `threeLawsRowBacked: EVASION (row deleted, section lead-in survives) -> FAIL` | `threeLawsRowBacked: empty text -> FAIL (anti-vacuity)` |
| `kanbanEssayNamedInRow` | `[PASS] principle-backing.md: [2ig] kanban-cycle essay named IN THE ROW` | `kanbanEssayNamedInRow: pristine row names the owned essay -> PASS` | `kanbanEssayNamedInRow: EVASION (row reverted to the contradicting chapter, prose still names the essay) -> FAIL` **and** `kanbanEssayNamedInRow: row citing the BOOK instead of the essay -> FAIL` | `kanbanEssayNamedInRow: empty text -> FAIL (anti-vacuity)` |
| `eightCellsFromAxes` | `[PASS] ... cell count re-derived from the axes` | `eightCellsFromAxes: pristine derivation agrees with the stated word -> PASS` | `eightCellsFromAxes: stated word DISAGREES -> FAIL`, `... stated total DELETED, so the site count drops -> FAIL`, **and** `an axis gaining a THIRD value moves the product -> FAIL (proves the 8 is derived, not hardcoded)` | `eightCellsFromAxes: empty text -> FAIL (anti-vacuity)` |
| `threeAxes` | `[PASS] ... axis count re-derived` | `threeAxes: pristine derivation agrees with the stated word -> PASS` | `threeAxes: stated word DISAGREES -> FAIL` and `... stated total DELETED -> FAIL` | `threeAxes: empty text -> FAIL (anti-vacuity)` |
| `sixRowsInCell` | `[PASS] ... cell row count re-derived` | `sixRowsInCell: pristine derivation agrees with the stated word -> PASS` | `sixRowsInCell: stated word DISAGREES -> FAIL` and `... stated total DELETED -> FAIL` | `sixRowsInCell: empty text -> FAIL (anti-vacuity)` |
| `fourOwnedSourcesName` | `[PASS] [2ig] owned-source count re-derived across both files` | `fourOwnedSourcesName: pristine pair agrees at both sites -> PASS` | `... stated word DISAGREES -> FAIL`, `... the DEPENDENT's restatement deleted, so the site count drops -> FAIL`, **and** `... a row in that cell losing its Owned tier -> FAIL` | `fourOwnedSourcesName: empty texts -> FAIL (anti-vacuity)` |
| `threeFurtherQualifiers` | `[PASS] ... closing-qualifier count re-derived` | `threeFurtherQualifiers: pristine derivation agrees with the stated word -> PASS` | `... stated word DISAGREES -> FAIL` and `... stated total DELETED -> FAIL` | `threeFurtherQualifiers: empty text -> FAIL (anti-vacuity)` |
| `noEmptyDataCell` | `[PASS] ... no empty data cell in the per-author table` | `noEmptyDataCell: pristine table has no empty data cell -> PASS` | `noEmptyDataCell: a blanked data cell -> FAIL` | `noEmptyDataCell: empty text -> FAIL (anti-vacuity)` |
| **G17, WIDENED** | `[PASS] [wev G17] no bare unqualified contested word outside the taxonomy` | see the measurement below -- no fixture set is possible | see below | see below |
| **roster gate** | `[PASS] [2ig] roster integrity: exact emitted-check count` | see the measurement above -- no fixture set is possible | see below | see below |

**The two gates that carry NEITHER a fixture set nor a `file:line`, because neither is a pure
function.** Their evidence is the recorded MEASUREMENT, and no fixture set is required or possible:

- **G17, widened** to the two sibling reference trees. MEASURED, per tree, with the taxonomy copy
  excluded in each: `lz-red` 10 scanned files / 0 hits (unchanged); `lz-tpp` 3 scanned files / 0 hits
  (NEW); `lz-refactor` 177 scanned files / 0 hits (NEW). Zero new hits across both added trees, so the
  gate stayed GREEN across a scope that grew from 10 files to 190. A MISSING or unreadable tree is
  recorded as a HIT rather than filtered away: an `existsSync` FILTER would silently narrow the scope
  back down and hand the widened gate a vacuous pass, which is the whole defect the widening closes.
- **The roster gate.** Predicted 172, measured 172. Its own comment states what it CANNOT catch: a
  guard WEAKENED IN PLACE leaves the count unchanged, so only the selftest evasion proofs cover that,
  and nobody may mistake the roster gate for sufficient.

## The evasion proofs, per strengthened guard

The brief's requirement is stronger than "the new guard still passes current content": each
strengthened guard must catch a SPECIFIC evasion the OLD needle passed. That proof is COMMITTED in
`tools/row-guards.selftest.mjs` rather than thrown away in a scratchpad -- `OLD_NEEDLES` replicates
each superseded needle exactly as the checker evaluated it (per line, whole file), and one assertion
per guard shows it PASSING the same fixture its replacement FAILS.

| Guard | The evasion | New guard | OLD needle on the same fixture | Selftest assertion name |
| --- | --- | --- | --- | --- |
| `bernhardtDeliveryNamed` | **BRIEF-MANDATED (a).** Strip the delivery name from the Bernhardt ROW's Source cell while a Sources bullet still names a delivery | FAIL | **PASS** | `bernhardtDeliveryNamed: OLD file-scoped needle PASSES that same evasion` |
| `kanbanEssayNamedInRow` | **BRIEF-MANDATED (b).** Revert the kanban row's Source cell to the chapter the same file says CONTRADICTS the criterion, while a prose bullet still names the essay | FAIL | **PASS** | `kanbanEssayNamedInRow: OLD file-scoped needle PASSES that same evasion` |
| `failureVsErrorRowBacked` | Delete the ROW; prose still carries the bare word failure | FAIL | **PASS** | `failureVsErrorRowBacked: OLD file-scoped needle PASSES that same evasion` |
| `seamRowBacked` | Delete the ROW; prose still says seam and handoff | FAIL | **PASS** | `seamRowBacked: OLD file-scoped needle PASSES that same evasion` |
| `taxonomyRowBacked` | Delete the ROW; the prose cross-link survives | FAIL | **PASS** | `taxonomyRowBacked: OLD file-scoped needle PASSES that same evasion` |
| `threeLawsRowBacked` | Delete the ROW; the section lead-in survives | FAIL | **PASS** | `threeLawsRowBacked: OLD file-scoped needle PASSES that same evasion` |
| `temporaryTestStubStatesRelationship` | NET-NEW, so there is no superseded needle. The equivalent proof is stronger: strip the relationship from the ROW while the Responder and Saboteur rows still carry the same phrase -- a hypothetical FILE-SCOPED form of this very guard PASSES that fixture, which is WHY a net-new guard still had to be row-scoped | FAIL | **PASS** (file-scoped form) | `temporaryTestStubStatesRelationship: a FILE-SCOPED needle PASSES that same evasion (why row-scoping is required)` |

Plus the anti-vacuity spine, proven once for the shared `oneRow` helper: `oneRow: a DUPLICATED target
row -> FAIL (exactly one, or fail)`. A lookup that quietly finds ZERO -- or silently asserts about
whichever of two copies it met first -- is the wev R1 defect class reintroduced.

## Pre/post SITE-COUNT arithmetic per count guard

Site counts are pinned to the POST-content value, NOT to today's measurement, because Task 2's
deletions remove sites these guards count. A count pinned to today would FALSE-FAIL the moment the
content lands. Recorded here so a post-Task-2 FAIL can never be misdiagnosed as an instrument bug.

| Guard | Derivation | Derived | Sites PRE | Sites POST (PINNED) | Which edit moves it |
| --- | --- | --- | --- | --- | --- |
| `twelveSources` | top-level `- ` bullets between `## Sources` and the next `## ` | 12 | **3** (`:11`, `:65`, `:159`) | **2** | E9(a) drops the clause containing `:65`. RESEARCH's `:67` is STALE and was NOT used |
| `eightCellsFromAxes` | PRODUCT of the measured per-axis value-bullet counts (2 x 2 x 2), never a literal and never `2 ** 3` | 8 | 1 (`:70`) | 1 | none. Derived from the AXES, never from the cell bullet list, precisely so E9(b)'s two bullet deletions cannot break it |
| `threeAxes` | the `Axis one/two/three,` blocks | 3 | 3 (`:17`, `:25`, `:70`) | **3** | E9(b) reframes the `:70` lead-in but MUST keep the phrase, so the site survives. Pinned 3 |
| `sixRowsInCell` | rows where (Where, StandsFor, Lifetime) = (Production, Own implementation, Transitional) | 6 | 2 (`:74`, `:271`) | 2 | none; neither site is inside a deletion |
| `fourOwnedSourcesName` | DISTINCT Author values of that same 6-row set, AND all 6 tiers begin `Owned` | 4 | 2 (taxonomy `:270` + `principle-backing.md:71`) | 2 | none. The needle is noun-scoped to `<cardinal> owned sources name`, which deliberately EXCLUDES `principle-backing.md:81` ("Four owned sources independently decline") -- a different claim about a different set |
| `fiveKindsEnumerated` | the enumeration's length, AND every enumerated name resolves to a `Gerard Meszaros` row Term | 5 | **9** occurrences on 8 lines (`:56`, `:105`, `:125`, `:134`, `:216` carries TWO, `:327`, `:387`, `:396`) | **8** | E3 deletes the `:56` occurrence OUTRIGHT, so eight survive to be rewritten. The arithmetic is 9 = 8 rewritten + 1 deleted, never "nine corrected" |
| `threeFurtherQualifiers` | `^\d+\. ` lines (MEASURED: exactly the three closing items, at `:424`, `:428`, `:434`; no other numbered list exists in the file) | 3 | 1 (`:420`) | 1 | none |
| `ambiguitySurveyCount` | see the SURVEY SHAPE DECISION below | 10 surveyed / 5 colliding | 0 / 0 (no verdict tokens exist) | 1 / 1 | E2 AUTHORS TO this recorded shape |
| `noEmptyDataCell` | no data cell in the 9-column table is empty | 0 empty | n/a (states no total) | n/a | none |

EXCLUDED by measurement and deliberately NOT gated: the four-notes cross-reference clauses, the
claimant inline lists, and the two-live-conflicts bullets -- all three are prose punctuation rather
than lists, so a block-scoped or split-on-punctuation derivation is the fragile part. "Roughly thirty
rows" is correctly hedged and is not assertable. The cardinal alternation stops at `twelve`, so
"thirty" cannot produce a false site.

## SURVEY SHAPE DECISION, settled here in Task 1

The plan requires this decision in Task 1, because Task 1 is the only task permitted to write the
instrument, and a pin deferred to "post-E2" would be unsettable.

**Collision criterion, and it goes IN the document so a reader can check it:** a candidate COLLIDES
when the word itself is committed to MORE THAN ONE cell of the three axes by the owned sources mapped
here. That is a claim about AMBIGUITY, which is what the section is about -- not about unsuitability.

**DECIDED: TEN candidates surveyed, FIVE of them collide.** The nine live bullets plus `empty class`,
which E2 must ADD because it is the counterexample that falsifies the universal form; scoping it out
would be special pleading against the very counterexample that forced the repair.

| Candidate | Verdict | Why |
| --- | --- | --- |
| `placeholder` | COLLIDES | registered on the collaborator side as an alias, used production-side elsewhere |
| bare `stub` | COLLIDES | the headline collision this document exists to record |
| `shim` | COLLIDES | split between the two owned Metz sources, across the second axis |
| `empty method` | COLLIDES | split on the LIFETIME axis within a single work -- the chapter-2 sense IS this artifact, while the same phrase also names a body that stays empty |
| bare `skeleton` | COLLIDES | four claimants as a substitution term |
| `pass-through interface` | NO COLLISION | one commitment only; it fails on MEANING (denotes delegation, not absence) |
| `Walking Skeleton` | NO COLLISION | one sense only; it fails on SCOPE (a whole system, not a symbol) |
| `impostor` | NO COLLISION | one commitment only, to the test side |
| the stand-in family | NO COLLISION | one cell each; each denotes one object taking another's place while both exist |
| `empty class` | NO COLLISION | **THE COUNTEREXAMPLE.** Unambiguous, and committed to THIS cell. It is not the recommendation only because it names a class and so does not cover a method-level or function-level stand-in |

**Guard shape that makes this non-vacuous:** every candidate bullet carries an explicit verdict token,
and the guard asserts that the number of verdict-bearing bullets EQUALS the number of top-level bullets
in section 5. An UNLABELLED candidate bullet therefore FAILS rather than being silently skipped --
otherwise a candidate could be added without moving either count. Proven by
`ambiguitySurveyCount: an UNLABELLED candidate bullet -> FAIL (never silently skipped)`.

## Roster shape

| Item | Value |
| --- | --- |
| New or changed guards | 34 (7 row-scoped + 9 count + 6 absent + 10 topics + widened G17 + roster gate) |
| RED-at-baseline | 20 |
| Invariant GREEN-at-baseline | 14 |
| Guards with NEITHER proof | **0** |
| Guards deleted or weakened to manufacture a proof | **0** |
| New `[2ig] ` labels asserted present by the roster gate | 32 |
| Retired labels asserted absent by the roster gate | 6 |

The two label-set assertions exist because a bare COUNT is blind to a short swap that happens to
balance -- six removals against five additions lands inside any tolerance band. The selftest
independently asserts the exported guard NAME set (`ROW_SCOPED_GUARDS` = the seven, `COUNT_GUARDS` =
the nine), so a renamed or missing guard fails there even when the count does not move.

## Final baseline run

**Exit 1 BY DESIGN**, with the designed RED summary line rather than a crash:

```
SUMMARY: RED-REFS RED -- 12/12 surfaces present, 20 check(s) FAILED (instrument-first Phase-18 RED
baseline by design pre-content)
```

The negation of the exit code alone would also be satisfied by a top-level throw, which a brand-new
module makes more likely, so the summary line is asserted separately in Task 1's verify chain and is
what proves the RED is the designed one.

**Every pre-existing PASS still PASSES.** All 20 FAILs carry a `[2ig] ` label; not one pre-existing
check flipped. Specifically confirmed still GREEN: `[wev G7] never-assert-an-empty-cell doctrine
stated` (the rewritten hard rule must keep the wording `never asserts`, losing only the legalising
clause) and `[wev G17]` across its widened scope.

## Untouched, and asserted rather than claimed

- `lib/provenance-honesty.mjs` and `tools/provenance-honesty.selftest.mjs` -- byte-unchanged; the
  selftest still exits 0, verified BEFORE it was chained into `check`. A pre-existing failure there
  would have been a separate finding and a stop condition.
- `lib/scaffold-phrases.mjs` -- byte-unchanged. The lz-refactor battery imports it too.
- `grade-red.mjs` -- byte-unchanged.
- Everything under `plugins/` -- unmodified at capture time, asserted by
  `git status --porcelain plugins/lz-tdd` inside Task 1's verify chain.
- No path or env override was added to the checker. That would create a bypass on a gate whose value
  rests on its paths being fixed, and the pure functions in `lib/` make it unnecessary.
- Zero new dependencies; node builtins only. No package-manager install was run.

## Hygiene, because the repo checker does not reach these files

`check-hygiene.mjs` scans the shippable public surface only -- the three plugin skill trees plus the
root manifests. It does NOT scan `.claude/skills/lz-red-workspace/tools/**`, yet those files are
tracked and public, so Task 1 carries its own two probes over the changed workspace files, wired into
its verify chain:

- **Allowlist-inversion:** enumerate every email-shaped token in the changed workspace files, subtract
  the approved public contact, assert the remainder EMPTY. MEASURED: the changed files contain ZERO
  email-shaped tokens, so the remainder is empty. No forbidden value is encoded anywhere as a needle --
  writing the needle IS the leak.
- **Non-ASCII byte probe:** clean over the same file set.

**Both probes were positive-controlled**, because a zero-hit search is not evidence of absence: the
email regex was confirmed to FIND the approved contact in `.claude-plugin/marketplace.json`, and the
non-ASCII probe was confirmed to FIRE on a deliberately non-ASCII scratch file. Without those
controls a broken regex and a clean file are indistinguishable.

## Falsifiability note

This document's history is one of miscounted claims surviving review, and of GREEN batteries passing
blocking defects: six green checkers passed the defective version at 12/12, and a 146/146 battery
passed four blocking defects. So GREEN is necessary and never sufficient, and a guard is trusted here
only because it was SEEN to fail -- or, where its subject was already correct, because its mutation
fixture was seen to fail and the OLD needle was seen to pass the same evasion.
