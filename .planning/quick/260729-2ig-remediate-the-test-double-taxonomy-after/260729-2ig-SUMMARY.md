---
phase: quick-260729-2ig
plan: 01
subsystem: lz-red reference content + the non-shipped lz-red checker
status: complete
tags: [taxonomy, remediation, instrument-first, attribution, absence-hedging, row-scoped-guards]
requires:
  - the three-reviewer acceptance gate on merge 1d1474b (two DO NOT ACCEPT, one TRUSTWORTHY WITH GAPS)
  - the oracle consult recorded in 260729-2ig-CONTEXT.md (orchestrator-driven; the executor cannot spawn subagents and never read .oracle/)
provides:
  - a taxonomy whose every stated total re-derives from a list on the page and is machine-asserted
  - seven row-scoped checker guards, nine count-re-derivation guards, and a roster-integrity gate
  - a committed evasion proof per strengthened guard
affects:
  - plugins/lz-tdd/skills/lz-red/references/test-double-taxonomy.md (and its two byte-identical copies)
  - .claude/skills/lz-red-workspace/tools/check-red-references.mjs
tech-stack:
  added: []
  patterns:
    - pure-function guard modules under tools/lib/ with an in-memory fixture selftest (the provenance-honesty precedent)
    - count guards asserting BOTH the stated number word and the SITE COUNT
    - hand-maintained PREDICTED literals (EXPECTED_CHECKS, the new-label set) rather than derived ones
key-files:
  created:
    - .claude/skills/lz-red-workspace/tools/lib/pipe-table.mjs
    - .claude/skills/lz-red-workspace/tools/lib/row-guards.mjs
    - .claude/skills/lz-red-workspace/tools/row-guards.selftest.mjs
    - .planning/quick/260729-2ig-remediate-the-test-double-taxonomy-after/260729-2ig-RED-BASELINE.md
  modified:
    - .claude/skills/lz-red-workspace/tools/check-red-references.mjs
    - .claude/skills/lz-red-workspace/package.json
    - plugins/lz-tdd/skills/lz-red/references/test-double-taxonomy.md
    - plugins/lz-tdd/skills/lz-tpp/references/test-double-taxonomy.md
    - plugins/lz-tdd/skills/lz-refactor/references/test-double-taxonomy.md
decisions:
  - The ambiguity survey shape was settled in Task 1 and pinned before E2 authored to it -- TEN candidates, FIVE colliding, under a collision criterion stated in the document.
  - The possessive five-kinds needle covers FOUR of the nine occurrences; the other five are covered by the pinned site count and the figure-attribution topic. Recorded as scoped rather than implied as total.
  - Dependents were left unedited because measurement showed none asserts anything the taxonomy no longer supports.
metrics:
  duration: one session
  completed: 2026-07-29
  tasks: 3
  commits: 2
---

# Quick Task 260729-2ig: Remediate the test-double taxonomy after a three-reviewer DO NOT ACCEPT

Repaired the taxonomy's argumentation and its falsified attribution, and first repaired the instrument
that had passed four blocking defects at 146/146 -- adding seven row-scoped guards, nine
count-re-derivation guards and a roster gate, each new or changed guard carrying exactly one of two
named proof kinds.

## THE GREEN BATTERY IS NOT ACCEPTANCE

Read this before anything else in this document.

The battery is green: 173/173 checker checks, both selftests, the tsc extractor, the repo hygiene
checker and the plugin validator all exit 0. **That is not acceptance and must not be read as
acceptance.** This document has shipped with blocking defects TWICE, each time behind a green battery:
six green checkers passed the defective version at 12/12, and a 146/146 battery passed the four
blocking defects this task exists to remove.

**An independent unprimed review is the acceptance gate, and it HAS NOT RUN.** Green here means only
that the deterministic instruments agree with the content. Nothing in this summary certifies the work,
and no part of it should be quoted as a verdict.

## Commits

| Task | Commit | What |
| --- | --- | --- |
| 1 | `bf6955c` | the instrument, RED at baseline by design, plus the RED-BASELINE evidence |
| 2 | `19b6c6a` | the content corrections in the lz-red copy, byte-copied to the other two |
| 3 | none | Task 3 changed NO file. Its dependent sweep found nothing to edit, and its only artifact is this SUMMARY, which the orchestrator owns |

## What changed, per E-item

Line references are into the FINAL `plugins/lz-tdd/skills/lz-red/references/test-double-taxonomy.md`
(522 lines, sha256 `352931ce4042` in all three copies).

| Item | Change | Result at |
| --- | --- | --- |
| E1 (2IG-01) | REPAIRED the Defines-or-uses rule by splitting a NAMING citation (a `Uses` row suffices) from a MEANING citation (a `Defines` row is REQUIRED, and no quantity of `Uses` rows substitutes). The meaning requirement is NOT softened -- it is the discipline that would have caught the earlier fabricated attribution. The repair also licenses section 5's naming claim, which rests entirely on `Uses` rows, instead of leaving it in tension with the column's own rule | `:220-229` |
| E2 (2IG-02) | REPAIRED the ambiguity finding: the universal quantifier is gone, replaced by a survey of TEN candidates of which FIVE collide, under a collision criterion stated in the document so a reader can check it. `empty class` was ADDED as the non-colliding counterexample that falsified the universal form | `:311-360` |
| E3 (2IG-03) | CUT the degree-of-freedom proof and its four-combination roll-call, plus the paragraph claiming it had retired an EXCEPTION from section 6. That retirement never happened -- section 6 still carries the whole caveat with chapter citations -- so the paragraph was a defect in its own right. The KEEP/DELETE boundary fell MID-LINE and was cut by content | boundary now at `:52`; the operational reason the axes are separate is KEPT |
| E4 (2IG-04) | CUT the INTENT inference that the blank Beck column is deliberate rather than an oversight. KEPT: the blank column, the source listing, the owner-verification, the independent-vocabularies framing and the conclusion | `:149-151`; the kept framing at `:147` |
| E5 (2IG-05) | Corrected the five-kinds ATTRIBUTION. **EIGHT occurrences rewritten plus ONE deleted outright by E3 -- NOT "nine corrected".** The numeral is kept everywhere and attributed to the catalog chapter's hierarchy figure rather than to the author as his own framing | `:94`, `:115`, `:151`, `:249` (two), `:380`, `:467`, `:476` |
| E6 (2IG-05) | ADDED the prose-states-four caveat and the machine-parseable ENUMERATION of the five | caveat `:123`; enumeration `:129-133` |
| E7 (2IG-05) | HEDGED the numeral-absence claim to the parts read end to end, naming the unread remainder, and pointed the two conversion defects at the existing degraded-scan mechanism | `:135-144` |
| E8 (2IG-06) | Fixed ONE cell: the Temporary Test Stub row now states its relationship to Test Stub, following the convention the other three non-member rows already use. NO level column, NO table split, NO restructure | `:263` |
| E9 (2IG-07) | (a) Rewrote the hard rule so it states the prohibition and DROPS the clause an earlier revision added to legalise its own scoped wording; the phrase `never asserts` is preserved. (b) Reframed the cell list as a CENSUS OF WHAT ROWS POPULATE and deleted the two bullets no row populates -- with no bullet, no commentary and no explanation for either | rule `:54-59`; lead-in `:61-63`; eight bullets down to six |
| E10 (2IG-08) | REMOVED the two tier-scoped-out sources from the side-assignment evidence list. Which side a term names is a taxonomy claim, and each source's own tier excludes it from taxonomy use. Both keep their rows, Sources entries and caveats | `:184-190` |
| E11 (2IG-09 + 2IG-10) | NARROWED the machine-enforced claim: the gate lives in the lz-red development workspace, outside the plugin, and is NOT SHIPPED, so no installed copy carries it however wide its scope. `lz-red` is named explicitly, never relatively | `:208-214` |
| E12 (2IG-11) | Fixed the Gang of Four back matter: THREE appendices (the glossary among them, carrying a letter designation), an enumeration that is no longer presented as exhaustive, the absence claim hedged to SWEPT COMPLETE with NOT SWEPT named, and the near-miss phrasing corrected from only-occurrence to only-SENSE with its three occurrences | `:393-412` |
| E13 (2IG-11) | ADDED the POSITIVE remote-variant finding -- a source that articulates the concept across an address space three times and still never reaches for the word is better evidence than a bare absence -- and redirected the near-miss warning to the do-nothing HOOK | `:413-424` |
| E14 (2IG-15) | Carried the two NON-OPTIONAL qualifiers the taxonomy was dropping, pointing at the dependent rather than restating its detail | `:286-289` |

**DO NOT TOUCH `:282-286` (pre-edit)** was honoured. That entry is the candidate entry for a DIFFERENT
word from the one the absence claim concerns, so the two claims are compatible; it is sound and was left
alone.

**DEFERRED, and still deferred:** no rows were added for the two deliberately-unplaced terms. They
remain section-6 caveats where they are already cited.

## The three-directions audit

Run BEFORE every deletion, as the plan requires, because a subject deleted from under a needle
deadlocked the previous round.

### Directions 1 and 2 -- surviving positive topics

Every positive topic on the taxonomy entry was enumerated and cross-referenced against the deletion
regions, not just the two the plan named. Surviving `file:line` is against the FINAL text.

| Positive topic | Occurrences touched by a deletion | Verdict | Surviving `file:line` |
| --- | --- | --- | --- |
| `[wev G7]` never-asserts doctrine | its ONLY occurrence was inside E9(a)'s region | **DIRECTION 2 FALSE-FAIL RISK, pre-resolved by the plan.** E9(a) is a REWRITE, not a deletion, and the plan mandates keeping the phrase. Preserved rather than removing the guard | `:54` |
| `[j9m] Self Shunt disclosure model` | 2 of 3 (E3a at pre-edit `:57`, E9(b) at pre-edit `:83`) | SURVIVES in section 6, as the plan predicted | `:390` |
| `[wev G6] three axes` | 1 of 3 (the E9(b) lead-in reframe) | SURVIVES; the reframe keeps the phrase, and two other sites are untouched anyway | `:17`, `:25`, `:61` |
| `[j9m] lifetime axis` | 1 of 4 (the same lead-in) | SURVIVES | `:42`, `:249`, `:407` and others |
| `[wev G13] independent vocabularies` | none; E4's cut is surgical and keeps that paragraph | SURVIVES | `:147` |
| `[j9m] table of contents` | none | SAFE | `:15` |
| `[j9m] bare-stub collision headline` | none | SAFE | 5 sites |
| `[j9m] defines-vs-uses column` | none | SAFE | 21 sites |
| `[j9m] Saboteur polarity caveat` | none | SAFE | 4 sites |
| `[j9m] Overspecified Software citation` | none | SAFE | 1 site |
| `[j9m] Cooper false-friend caveat` | none. E10 removes Cooper from the EVIDENCE LIST only; the false-friend caveat is elsewhere | SAFE | 3 sites |
| `[j9m] degraded-scan confidence caveat` | none | SAFE | 1 site |
| `[j9m] appendices not exhaustive` | none | SAFE | 1 site |
| `[j9m] authority is per cell` | none | SAFE | 4 sites |
| `[j9m] Meszaros as a reference frame` | none | SAFE | 1 site |
| `[j9m] inherited disagreement named` | none | SAFE | 3 sites |
| `[j9m] no declared precedence` | none | SAFE | 1 site |
| `[wev G9] version-bound tiers` | none | SAFE | 1 site |
| `[wev G10] transcript mistranscription` | none | SAFE | 1 site |

**No positive topic had to be REMOVED this round.** The one at risk was resolved by preserving its
subject, which is the right resolution when the subject is being rewritten rather than deleted.

### Direction 3 -- count guard x deletion

Count guards are neither positive topics nor absent guards, so directions 1 and 2 do not inspect them,
and the SITE-COUNT assertion is the load-bearing half of the whole mechanism. One row per pair.

| Count guard | E3 | E4 | E9 | E10 | Net site change | Handled by |
| --- | --- | --- | --- | --- | --- | --- |
| `twelveSources` | no | no | **YES -- E9(a) removes the `:65` site** | no | 3 -> 2 | pinned POST 2 in Task 1 |
| `eightCellsFromAxes` | no | no | reframes the site's line but KEEPS the arithmetic | no | 1 -> 1 | derived from the AXES, never from the bullet list, so the two bullet deletions cannot break it |
| `threeAxes` | no | no | reframes the site's line but KEEPS the phrase | no | 3 -> 3 | pinned 3 |
| `sixRowsInCell` | no | no | no | no | 2 -> 2 | no action |
| `fourOwnedSourcesName` | no | no | no | no | 2 -> 2 | no action |
| `fiveKindsEnumerated` | **YES -- E3 deletes the `:56` occurrence** | touches the line but the occurrence sits BEFORE the cut clause and SURVIVES | no | no | 9 -> 8 | pinned POST 8 in Task 1 |
| `threeFurtherQualifiers` | no | no | no | no | 1 -> 1 | no action |
| `ambiguitySurveyCount` | no | no | no | no | 0 -> 1 / 1 | E2 authored to the Task-1 pin |
| `noEmptyDataCell` | no | no | no | no | states no total | no action |

The E4 row is the one that needed measuring rather than assuming: the plan located the inference at
`:134-135`, and `:134` also carries a gated `five kinds` occurrence. Measurement showed the occurrence
sits BEFORE the clause being cut, so it survives and the pin of 8 holds. Also measured: E4 deletes an
`eight other source columns` phrase, which is NOT a gated site (`eightCellsFromAxes` is noun-scoped to
`eight cells`), so no count moved there. E10 was measured to remove no cardinal at all -- the
side-assignment list carries no stated count -- so the plan's "restate any count after removal"
instruction was vacuous here rather than skipped.

## Emitted-check arithmetic: PREDICTED equals MEASURED

```
146 (baseline) - 6 (superseded file-scoped topics) + 7 (row-scoped) + 9 (count) + 6 (absent)
+ 10 (positive topics) = 172   <- PREDICTED, written before the run and hardcoded as EXPECTED_CHECKS
172                            <- MEASURED pre-roster count
```

The literal was not set from a post-hoc measurement, and no correction to the inventory was needed. The
printed line count is 173 because the roster gate snapshots the count BEFORE emitting its own line. The
row-scoped swap is not net-zero: seven in for six out is +1.

Also asserted by the roster gate, because a bare count is blind to a short swap that balances: all 32
new `[2ig] ` labels present, and NONE of the six retired labels still emitted.

**Verified independently by diffing the baseline and final label sets:** 6/6 retired labels were present
at baseline and are now absent; **0 pre-existing checks vanished** other than those six; **0
pre-existing PASS flipped to FAIL**.

## The seven row-scoped guards, with proof kind and evasion-proof assertion

| Guard | Proof kind | Evasion proved | Selftest assertion name |
| --- | --- | --- | --- |
| `bernhardtDeliveryNamed` | invariant GREEN | **brief-mandated (a)** -- delivery stripped from the ROW while a Sources bullet still names one | `bernhardtDeliveryNamed: OLD file-scoped needle PASSES that same evasion` |
| `temporaryTestStubStatesRelationship` | **RED-at-baseline** (`:230` pre-edit) | relationship stripped from the ROW while the Responder and Saboteur rows still carry the phrase -- so a FILE-SCOPED form of this very guard passes, which is why a net-new guard still had to be row-scoped | `temporaryTestStubStatesRelationship: a FILE-SCOPED needle PASSES that same evasion (why row-scoping is required)` |
| `failureVsErrorRowBacked` | invariant GREEN | ROW deleted while prose still carries the bare word failure (5 decoys) | `failureVsErrorRowBacked: OLD file-scoped needle PASSES that same evasion` |
| `seamRowBacked` | invariant GREEN | ROW deleted while prose still says seam and handoff (6 decoys); plus a NON-EMPTY but wrong tier, which a bare non-empty check could not catch | `seamRowBacked: OLD file-scoped needle PASSES that same evasion` |
| `taxonomyRowBacked` | invariant GREEN | ROW deleted while the prose cross-link survives | `taxonomyRowBacked: OLD file-scoped needle PASSES that same evasion` |
| `threeLawsRowBacked` | invariant GREEN | ROW deleted while the section lead-in survives | `threeLawsRowBacked: OLD file-scoped needle PASSES that same evasion` |
| `kanbanEssayNamedInRow` | invariant GREEN | **brief-mandated (b)** -- row's Source reverted to the chapter the same file says CONTRADICTS the criterion, while a prose bullet still names the essay | `kanbanEssayNamedInRow: OLD file-scoped needle PASSES that same evasion` |

Every one also carries an EMPTY-TEXT anti-vacuity control, and the shared `oneRow` helper is proven by
`oneRow: a DUPLICATED target row -> FAIL (exactly one, or fail)`.

## Count re-derivation, by hand from the FINAL text

Derived independently of `lib/row-guards.mjs` and then reconciled. **The hand derivation and the
machine agreed on every row, including the rows that did not need to change** -- a coincidentally
unchanged total looks untouched, so each is recorded anyway.

| Guard | Derivation | Derived | Word | Sites PRE | Sites POST | Machine agrees |
| --- | --- | --- | --- | --- | --- | --- |
| `twelveSources` | Sources bullets | 12 | twelve | 3 | **2** | yes |
| `eightCellsFromAxes` | product of per-axis value counts [2, 2, 2] | 8 | eight | 1 | 1 | yes |
| `threeAxes` | `Axis one/two/three,` blocks | 3 | three | 3 | 3 | yes |
| `sixRowsInCell` | rows matching (Production, Own implementation, Transitional) | 6 | six | 2 | 2 | yes |
| `fourOwnedSourcesName` | distinct Authors of those 6 rows; all 6 tiers begin `Owned` | 4 | four | 2 | 2 | yes |
| `fiveKindsEnumerated` | enumeration length; every name resolves to a Gerard Meszaros row Term | 5 | five | 9 | **8** | yes |
| `threeFurtherQualifiers` | numbered items in the closing block | 3 | three | 1 | 1 | yes |
| `ambiguitySurveyCount` | verdict-bearing candidate bullets = 5 COLLIDES + 5 NO COLLISION | 10 / 5 | ten / five | 0 / 0 | 1 / 1 | yes |
| `noEmptyDataCell` | empty cells among 34 data rows | 0 | n/a | n/a | n/a | yes |

Informational, per the plan: `rg -o "five kinds" | wc -l` now reads **8** -- an occurrence count, not
the line count `rg -c` returns.

## Dependent sweep -- measured, not assumed

Four files link to the taxonomy: `lz-red/SKILL.md`, `lz-red/references/principle-backing.md`,
`lz-refactor/SKILL.md`, `lz-tpp/SKILL.md`.

| Check | Result |
| --- | --- |
| Any restatement of the five-kinds count or its attribution | **NONE.** `git grep -i 'five kinds'` over `plugins/lz-tdd` excluding the taxonomy returns zero hits |
| Any claim pointing at a passage E3, E4, E9 or E10 deleted | **NONE.** The only `every combination` hits are in `lz-refactor/references/gof-catalog/decorator.md`, about Decorator's subclass explosion -- unrelated |
| Any restatement of a count the taxonomy states | `principle-backing.md:71` restates BOTH `Twelve sources` and `four owned sources name it`. Both still TRUE; the second is gated by `fourOwnedSourcesName`, which scans both files and PASSES. Confirmed the gate binds across files |
| The three thin three-axes pointers | `lz-red/SKILL.md:155`, `lz-refactor/SKILL.md:185`, `lz-tpp/SKILL.md:94` -- all still true; the taxonomy still has three axes |
| Any bare unqualified contested word introduced by the WIDENED G17 scope | **NONE.** G17 PASSES over its new scope: 10 + 3 + 177 = 190 scanned files, 0 hits |
| Cooper / Bernhardt citations in dependents after E10 | All are STANCE or over-mocking citations, which the taxonomy explicitly licenses, not side-assignment taxonomy claims. No change needed |

**No dependent was edited, and that is a measurement rather than an assumption.** Editing a dependent
that is already correct is churn.

## Guards that caught ME

Reported because the previous round's honesty about its own trips was the most useful thing in its
summary. All three were caught by guards added in Task 1, before any human saw the content.

1. **`[2ig] prose states four by folding two members` FAILED** after E6 was authored. My new sentence
   wrapped as `his PROSE` / `STATES FOUR` across two lines, and `topics` match PER LINE. The needle was
   correct; my prose was not. Reflowed so the phrase sits on one line.
2. **`[2ig] non-optional kanban qualifier carried` FAILED** after E14. Same defect: `ONE POSITION` /
   `AMONG SEVERAL` wrapped. Reflowed.
   Both are the exact per-line wrap hazard the plan warned about and the checker already carries a
   comment about. Knowing the hazard was not enough to avoid it twice; the guards were.
3. **`[2ig] axis count re-derived` FAILED with "expected 3 site(s), found 4".** My E2 collision
   criterion sentence said "more than one cell of the three axes", silently adding a FOURTH site to a
   count pinned at 3. **I did not re-pin the guard.** Re-pinning to fit content I had just written is
   exactly the softening hard rule 7 forbids, and the pin was a Task-1 decision. Reworded to
   `three-axis grid`, which does not match the needle.

A fourth, non-guard catch worth recording: my first content Edit used an absolute path into the MAIN
checkout rather than the worktree, and the worktree guard refused it. Had the harness not caught it, the
edit would have landed outside this task's branch entirely.

## Deviations

| Deviation | Reasoning |
| --- | --- |
| **RED-BASELINE.md was committed with Task 1** despite the instruction not to commit docs artifacts | That instruction enumerates SUMMARY.md, STATE.md and PLAN.md. RED-BASELINE.md is Task 1's own `<done>` evidence, the plan lists it in `files_modified` and in `<output>` as a Task-1 artifact, the previous round committed its equivalent as part of the tracked record, and an uncommitted file in a worktree is discarded on teardown. Flagging it as a judgment call rather than presenting it as unambiguous |
| **A gitignored directory junction was created for `node_modules`** (see below) | `npm run typecheck` is RED at baseline in ANY worktree because `node_modules` is gitignored and therefore absent. Required to run the battery at all |
| Line-length tidying of my own over-long lines was limited to those exceeding 104 characters | The file's existing convention is ~102-103. Reflowing lines already within one character of the norm buys nothing and each reflow risks re-breaking a per-line needle -- which had already happened twice |

## Worktree environment note, for whoever tears this worktree down

I created a gitignored **directory junction**:

```
.claude/skills/lz-red-workspace/node_modules
  -> D:\projects\github\LayZeeDK\lz-engineering-claude-plugins\.claude\skills\lz-red-workspace\node_modules
```

**It points OUTSIDE the worktree, at the main checkout's real `node_modules`.** No package was
installed and no registry was contacted. `git status` does not see it (gitignored), so it is not in any
commit.

**Whoever removes this worktree must delete the LINK without recursing through it** -- a recursive
delete that follows the junction would delete the MAIN CHECKOUT's `node_modules`. Use
`cmd /c rmdir "<path>"` or `Remove-Item -LiteralPath "<path>"` (no `-Recurse`), or remove the junction
before `git worktree remove`.

Created via PowerShell `New-Item -ItemType Junction`. `cmd //c mklink /J` failed twice under Git Bash
path conversion, including with `MSYS_NO_PATHCONV=1`, which silently started an interactive `cmd` and
created nothing -- worth knowing, because it reports success-looking output.

## UNRESOLVED, carried forward from CONTEXT.md and NOT closed

Both remain open. Neither can be closed by anything in this round.

1. **The numeral-absence claim is not certifiable book-wide.** The consult's negative is correctly
   scoped over the parts it read end to end -- the opening overview, the dependency-isolation narrative
   chapter, the substitute-object catalog chapter, the value-patterns catalog chapter, and the
   terminology appendix. It did not sweep the remaining chapters and appendixes for the numeral and
   rightly declined to: a whole-book token sweep is a deterministic check belonging to a harness. The
   oracle agent has no search tool and the rest of this loop is firewalled from the store, so nobody
   here can close it. The document now states the claim at the scope actually swept and names the
   unread remainder, which is the correct end state rather than a compromise. **A future harness sweep
   is still owed.** Secondary and smaller: two conversion defects touch this question -- the
   terminology appendix's role-summary table came through garbled at character level, and one bullet of
   the narrative rundown is an un-transcribed scanned image -- and any claim resting on them now falls
   under the existing degraded-scan caveat.
2. **The axis-2 classification of the two deliberately-unplaced terms stays undecided.** Deciding it is
   HIGH IMPACT (it would add rows and move cell populations) and NOT HIGH CONFIDENCE (the
   classification is contested on the merits), which is the trap quadrant, so it was not auto-locked.
   The conservative default was taken: **no rows added.** They remain section-6 caveats where they are
   already cited. Revisit only if a later round needs them placed.

## Verification status

| Gate | Result |
| --- | --- |
| `TASK1_OK` | printed |
| `TASK2_OK` | printed |
| `BATTERY_GREEN` | printed |
| `npm run check` (both selftests + checker) | exit 0; 173/173 |
| `npm run typecheck` | exit 0; 8 modules tsc --strict clean |
| `check-hygiene.mjs` | exit 0; ASCII 201 files, no non-allowlisted emails, no verbatim runs |
| `claude plugin validate .` | exit 0 |
| Task 1 hygiene probes over the workspace tools | clean, and BOTH positive-controlled -- the email regex was confirmed to find the approved contact elsewhere, and the non-ASCII probe was confirmed to fire on a deliberately non-ASCII file. A zero-hit search is not evidence of absence |
| Guards widened, softened or deleted to reach green | **none** |

### Verify commands I judged WEAK, rather than banking the pass

- **`! node check-red-references.mjs`** in Task 1's chain. The negation alone is satisfied by a CRASH,
  and a brand-new module makes a top-level throw more likely. The plan already pairs it with an
  assertion on the designed RED summary line, which is what I relied on.
- **`test -z "$(rg -o '<email pattern>' ... | rg -v '<approved>')"`** is indistinguishable from a broken
  regex or a mistyped path, both of which produce empty output. I ran a positive control before
  trusting it, and the same for the non-ASCII probe.
- **The sha256 leg of Task 2's chain passes VACUOUSLY on an untouched tree** -- three unmodified copies
  are already identical. The roster-gate leg is what stops that, by requiring the instrument to be
  present and armed. I ran the copies explicitly and then re-verified rather than treating a green
  digest as proof the copy happened.
- **The battery does not test the roster gate's own blind spot.** A guard WEAKENED IN PLACE leaves the
  emitted count unchanged. Only the selftest evasion proofs cover that, and the gate's own comment says
  so. I have not proven the absence of a weakened guard; I have proven that the ones I touched fail on
  their mutations.

## Known stubs

None. No hardcoded empty value, placeholder text or unwired data path was introduced. `placeholder` does
occur in the taxonomy as a registered alias under discussion, which is the pre-existing scoped scaffold
exemption on that entry, not a stub.

## Threat flags

None. No new network endpoint, auth path, file-access pattern or schema at a trust boundary. The one
disclosure-relevant surface -- new fixtures, comments and labels in files the repo hygiene checker does
not reach -- is mitigated by Task 1's own two positive-controlled probes, as `T-2ig-01` requires. No
forbidden value is encoded anywhere as a search needle.

## Self-Check: PASSED

- `.claude/skills/lz-red-workspace/tools/lib/pipe-table.mjs` -- FOUND
- `.claude/skills/lz-red-workspace/tools/lib/row-guards.mjs` -- FOUND
- `.claude/skills/lz-red-workspace/tools/row-guards.selftest.mjs` -- FOUND
- `.planning/quick/260729-2ig-remediate-the-test-double-taxonomy-after/260729-2ig-RED-BASELINE.md` -- FOUND
- all three `test-double-taxonomy.md` copies -- FOUND, one sha256 `352931ce4042`
- commit `bf6955c` -- FOUND
- commit `19b6c6a` -- FOUND
