# Quick Task 260729-2ig: Remediate the test-double taxonomy after a three-reviewer DO NOT ACCEPT - Context

**Gathered:** 2026-07-29
**Status:** Ready for planning

<domain>
## Task Boundary

Remediate `plugins/lz-tdd/skills/lz-red/references/test-double-taxonomy.md` (441 lines, byte-identical
copies under `lz-refactor` and `lz-tpp` at sha256 `125f5de59fea`) and its dependents, after a
THREE-reviewer acceptance gate on merge `1d1474b` returned DO NOT ACCEPT. In the same round, repair
the checker `.claude/skills/lz-red-workspace/tools/check-red-references.mjs`, nine of whose seventeen
new guards are weak.

The gate was: two content reviewers (one wholly unprimed, briefed from scratch) plus one instrument
auditor. Verdicts: DO NOT ACCEPT, DO NOT ACCEPT, and TRUSTWORTHY WITH GAPS. Every finding carries
`file:line` and was verified by measurement, not recalled.

**Out of scope.** No new sources, no new oracle stores, no re-litigation of the coinage withdrawal or
of the three-axis structure itself. The term-to-author map measured sound (roughly thirty rows check
out, every dependent agrees, side-qualification is consistent); this task repairs the argumentation
around it and the instrument that failed to catch it.

</domain>

<decisions>
## Implementation Decisions

### OWNER-LOCKED: the split verdict on argumentative superstructure

All four blocking findings trace to argumentative superstructure rather than to the map. The owner
ruled SPLIT rather than uniform: repair the two arguments that are load-bearing for the naming
recommendation, delete the two that only defend the document's design to an auditing reader.

The governing line: **argumentation that tells a coach WHAT IT MAY NOT CITE is operational and
stays** (tiers, hard rules, the citability distinction, absence hedges); **argumentation that DEFENDS
THE DESIGN belongs in this CONTEXT.md, not in a shipped reference.**

- **REPAIR the Defines-or-uses rule.** The column is the discipline that would have caught the
  earlier fabricated attribution. Split a NAMING-citation (what an author calls the artifact; `Uses`
  suffices) from a MEANING-citation (what the term means; requires `Defines`). Do not weaken the
  meaning-citation requirement.
- **REPAIR the ambiguity finding** by weakening its quantifier from universal to a survey with a
  re-derived count.
- **CUT the degree-of-freedom proof.**
- **CUT the deliberate-negative INTENT claim**, keeping the owner-verified blank-column FACT.

### The two cuts are pure deletions -- both jobs are already discharged in section 6

Established by measurement during discussion, and it SIMPLIFIES the plan (no carry-forward riders
are needed):

- The degree-of-freedom proof had a second job: `:59-61` claims it retired an EXCEPTION section 6
  "used to carry for want of anywhere to put it", leaving section 6 "only the narrow citable rule".
  **Measured: section 6 at `:316-318` still carries the WHOLE caveat**, with chapter citations. The
  retirement never happened. So `:59-61` misdescribes section 6's current content -- a defect in its
  own right, independent of the cut -- and deleting the proof orphans nothing.
- The deliberate-negative claim's job is stated in the document at `:130-131`: stop Beck's
  production-side usage being read as an ERROR against Meszaros' scheme. The payload at `:138-139`
  is "not an error against a scheme that never claimed him" -- which IS the blank column restated,
  so the FACT alone licenses it. The anti-refabrication guard is **already written** as a
  prohibition in section 6 at `:325-333`, with both markup traps documented.

The pattern to avoid reintroducing: both cut passages RESTATE, with weaker warrant, a claim section 6
already carries with citations. The uncited copy is the one that drifted -- it grew an intent
inference and a chronology the cited original never needed. **When one claim lives in both registers,
the uncited copy drifts.**

### Auto-resolved gray areas (--auto; each rated HIGH confidence)

- **Unpopulated cells get no bullet and no commentary.** Keep the 2x2x2 = eight-cell arithmetic as a
  plain fact about the axes, but present the bullet list as the cells that rows POPULATE. Absence of
  a bullet then carries no claim. This follows directly from the hard rule (state only what
  populates); it also avoids the trap where omitting a bullet from a list framed as exhaustive is
  itself an implicit emptiness assertion.
- **All candidate names enter the ambiguity survey, including non-colliding ones.** `empty class` is
  the counterexample that falsifies the universal form, so it belongs IN the survey as a
  non-colliding candidate, turning the finding into "N of M collide". Honest and checkable; scoping
  it out would be special pleading against the very counterexample that forced the repair.
- **Sources scoped out by their own tiers are REMOVED from the list that uses them as evidence**,
  not annotated in place. Cooper's tier reads "NOT citable as a taxonomy" and Bernhardt's is verified
  "for the double-versus-value point ONLY"; a list using them as evidence for which side a term names
  is a taxonomy claim. Restate the count after removal.
- **Skill-relative content is fixed by naming `lz-red` EXPLICITLY**, not by deleting the content.
  Explicit naming is already the legal form -- only the relative form is banned, because the file is
  byte-identical across three skills and a relative reference resolves differently in each.
- **The "machine-enforced" claim gets BOTH fixes.** Extend the checker's scope to the two sibling
  reference trees it excludes, AND narrow the claim's wording -- because the checker lives outside
  the plugin and is not shipped, so no installed copy carries the gate regardless of scope.

### OWNER-LOCKED: "five kinds" is made derivable by ENUMERATING the five

Four of the five stated totals re-derive cleanly from the lists they summarise (twelve sources from the
Sources bullets; eight cells from the cell bullets; "six rows" from the rows matching that cell triple;
"four owned sources" from the distinct authors of that row set). **"five kinds" does not.** It appears at
NINE sites, the document never enumerates the five, and Meszaros carries nine rows in the table --
deriving 5 from 9 would require the checker to sniff PROSE in a defining-property cell, which is exactly
the wording-coupling that forced two guards to be removed last round.

**Owner ruling: enumerate the five in the document, then derive the count from that list.** Rejected
alternatives: hardcoding 5 protects nothing about the actual set (a guard in name only -- the category
of thing this round exists to delete), and dropping the assertion leaves a nine-times-repeated number
unprotected.

Two benefits beyond checkability. It fixes a real reader problem -- "five kinds" appears nine times and
a reader cannot tell WHICH five. And it adds no new claim, because the document already names every one
of Meszaros' terms as an individual row; enumerating makes an implicit claim explicit.

**An ORACLE CONSULT settles the membership -- it must NOT be asserted from memory.** The canonical five
are widely "known", which is precisely why they need verifying here: reproducing a remembered set as
fact is the failure class this whole remediation exists to remove. The consult must also settle whether
the book itself frames the classification as a set of FIVE (if it states no number, the phrase cannot be
attributed to him at all), and must settle the STATUS of four terms the table currently carries as peers
-- `Test Double`, `Responder`, `Saboteur`, `Temporary Test Stub` -- each of which may be an umbrella, a
sub-kind, or a variant rather than a member. If any of those four is not a member, the table currently
mis-levels it, which is a further finding.

**Guard shape:** assert the enumerated list's length equals the stated number, and assert every
enumerated name resolves to a table row. Do NOT derive membership from the rows -- derive the count from
the enumeration. Prove the guard fails at baseline (there is no enumeration today, so it must).

#### CONSULT RESULT: the phrase is FALSIFIED, not merely underivable

The consult settled membership AND overturned the premise. All CONFIRMED by end-to-end reads of the
opening overview, the dependency-isolation narrative chapter, the substitute-object catalog chapter, the
value-patterns catalog chapter, and the terminology appendix:

- **The book NEVER states five. The one number it states is FOUR.** The narrative chapter says a test
  double can behave in one of four ways, because its rundown FOLDS Test Stub and Test Spy into a single
  bullet (spy framed as a more capable stub). The catalog chapter says only "several major flavors";
  the figure caption says "several kinds". No numeral in the overview or the appendix.
- **Five is a reading of the HIERARCHY FIGURE, not the author's framing.** That figure shows exactly
  five direct subtypes under the root, so five is defensible -- but "his five kinds" attributes to him a
  framing he does not state, and it sits against an explicit four in his own prose. Counting from the
  catalog's Variations run instead yields six or nine, so the figure is the only coherent basis.
- **MEASURED: the document does this at NINE sites** (`:56`, `:105`, `:125`, `:134`, `:216`, `:327`,
  `:387`, `:396`), every one attributing the count to him.

**This is the same defect class as the fabricated Beck mapping this whole remediation exists to remove
-- attributing to a named author something he did not say -- repeated nine times.**

**DECIDED (high confidence, evidence-backed, so not the trap quadrant).** The owner's locked intent
(make the number derivable rather than hardcoded) still holds and is achievable; only the attribution
changes. Attribute the count to the hierarchy figure rather than to him as a framing; keep the numeral,
which the figure supports; and ADD the caveat that his prose states four by folding stub and spy --
that caveat is exactly the "what you may not cite" content this document should carry, and a coach
citing "his five kinds" to him is currently wrong.

**Membership, with per-member definition chapters:** Test Stub, Test Spy, Mock Object and Fake Object
are defined in the substitute-object catalog chapter; Dummy Object is defined in the VALUE-PATTERNS
chapter, not with the others. The table already cites that correctly. Carry the nuance that Dummy Object
is drawn as a subtype but demoted in prose in both chapters as not really one of these and in a
different league -- the table's cell already says it is filed under value patterns, which captures it.
Cite the SET to the catalog chapter, where the figure appears; per-member definitions per above.

#### Mis-levelling: MEASURED as already handled in 3 of 4 cases -- no restructure

The consult reported that four terms the table carries as rows are NON-MEMBERS: the umbrella, two
Variations of Test Stub, and one further Variation discriminated on a different axis. That sounded like
a structural defect requiring a level column or a table split -- which would have rippled through every
cell bullet, every derived count and the guard work, and would have been trap-quadrant.

**Measurement says otherwise.** The document's convention is to state the relationship in the
defining-property cell, and it already does for three of the four: the umbrella row says it is the
umbrella; both Variation rows say "A Variation of Test Stub"; the Dummy row says it is filed under value
patterns. **Only `Temporary Test Stub` states no relationship** -- its cell describes the artifact and
its near-miss status but never says it is a Variation of Test Stub on a lifecycle axis rather than an
input-kind axis. One cell, following a convention already in the file. DECIDED: fix that one cell; no
level column, no table split, no restructure.

Also measured and NOT present, so nothing to fix: the other families the consult warned might be
flattened (a procedural stub variation, a special case one level below Responder, and the orthogonal
build-axis trio) have ZERO mentions and ZERO rows in this document.

Also measured: the naming collision the consult flagged is NOT live here. The Fake Object row carries no
`Dummy` alias, and no checker guard keys on bare `Dummy`. Guards must still key on FULL row names rather
than a bare word, which is the row-scoping fix already required.

#### UNRESOLVED (recorded, not decided -- cannot be raised, owner offline)

**The numeral-absence claim cannot be certified book-wide in this round.** The consult's "never states
five" is a correctly-scoped negative over the parts it read end-to-end; it did not sweep the remaining
chapters and appendixes for the numeral, and it rightly declined to, noting a whole-book token sweep is
a deterministic check belonging to a harness. The oracle agent has no search tool, and the orchestrator
is firewalled from reading the store, so neither can close it here.
**This does NOT block the fix:** the correction is right either way, because the figure is the basis for
five regardless of what an unread chapter says, and the prose demonstrably states four. Record the claim
at the scope actually swept and leave the book-wide certification to a future harness sweep.
**Second, smaller:** two conversion defects in the store touch this question -- the appendix's
role-summary table came through garbled at character level, and one bullet of the narrative chapter's
rundown is an un-transcribed scanned image. Any claim resting on that appendix table should carry the
degraded-scan treatment the document already has a mechanism for.

### DEFERRED, deliberately not decided in this round

- **The axis-2 classification of `Subclassed Test Double` and `Self Shunt`.** They are citable
  (section 6 gives Ch. 11 and Ch. 23) but the unprimed reviewer holds they contradict axis 2's own
  definition -- a subclassed double overrides an already-written implementation, and a Self Shunt
  stands in for a COLLABORATOR. Deciding their axis-2 value is HIGH IMPACT (it would add rows and
  move cell populations) and NOT HIGH CONFIDENCE (the classification is contested on the merits).
  That is the trap quadrant, so it is NOT auto-locked.
  **Safe default taken instead:** do not add rows for them this round. They remain section-6
  caveats, where they are already cited. This requires no axis-2 ruling and is strictly the
  conservative action. Revisit only if a later round needs them placed.

### NEW BLOCKER found during discussion by the oracle consult -- not caught by any of the three reviewers

The consult was commissioned only to settle the suspected "both appendices" miscount at `:341`. It
settled that and found something larger in the same sentence.

**Confirmed by the oracle, read complete:**

- **The glossary IS one of the appendices** -- it carries a letter designation, as do the notation
  guide and the foundation-classes section. **The book has THREE appendices, not two.** So "both
  appendices" is wrong on the count, AND naming the glossary separately in the same breath implies
  it is not an appendix, which is also wrong.
- **The enumeration is not exhaustive.** It misses the entire front matter -- including a
  front-matter quick reference giving a one-line intent for each of the 23 patterns, which is a real
  hit site (the oracle found a `skeleton` occurrence there, a third site the document does not know
  about). It also misses an unnumbered interstitial section introducing the catalog between two
  chapters, which "all chapters" plus "both appendices" does not reach, and the inside-back-cover
  notation summary.

**The absence claim at `:340` is UNVERIFIED as written.** It asserts the contested word is "ABSENT
from the 1994 Gang of Four book entirely -- every sense". A targeted follow-up consult read the Proxy
pattern end to end plus seven smaller high-risk sites and found **NO HIT in any of them**, but the
catalog remainder is unread, so a whole-book absence still cannot be certified. Fix: state the scope
actually swept and name the unread remainder. Certified complete: the Proxy pattern in full
(including its remote-variant discussion), the Template Method pattern in full, all three appendices,
the bibliography, the collected notes, the index, the front-matter pattern summaries, the catalog
interstitial, and the inside-back-cover summary. Not swept: the introduction, case-study and
conclusion chapters; the creational chapter; the structural chapter apart from Proxy; and the
behavioral chapter apart from Template Method.

**A POSITIVE finding that is stronger than the absence, and should go INTO the document.** The
remote-variant material describes the stand-in-across-an-address-space role three separate times --
a local representative for an object elsewhere, the marshaling responsibility, and the
encode-and-forward round trip -- in functional vocabulary, and never reaches for the contested word.
A source that articulates the CONCEPT and still does not use the WORD is better evidence than a bare
absence, and it positively covers the one site a reader would challenge.

**CORRECTION -- the self-contradiction I briefed to the consult DOES NOT EXIST, and the document is
right.** I read `:284` as pointing at the same site while claiming a whole-book absence of the same
word. The oracle pushed back and the file settles it: `:282-286` is the candidate entry for
`placeholder`, NOT for bare `stub` (which is a separate entry at `:287`). Proxy's intent sentence
carries `surrogate` and `placeholder`; it does not carry `stub`. So the two claims are fully
compatible. The document is additionally precise in a way I did not credit: it states that only
`Surrogate` is formally registered as the also-known-as and that `placeholder` is therefore
CONTESTED USAGE rather than a second registration -- which is exactly what the oracle found
independently. **Leave `:282-286` alone; it is sound.** Lesson: my "self-contradiction" came from
matching on the site rather than on the word.

**Secondary, same consult:** the `skeleton` sense in that book is the fixed outline of an algorithm
with steps left to subclasses, carrying no testing connotation, so the MISREAD warning at
`:342-344` is CORRECTLY AIMED. Two refinements. (a) "its ONLY `skeleton`" is loose -- there are three
occurrences of one sense, so phrase it as the only SENSE, not the only occurrence. (b) The oracle
judges the real near-miss trap to be the do-nothing HOOK, not the word: a hook whose default body is
empty and which exists to be overridden looks placeholder-ish, and that is where a reader will
actually go wrong. The document currently warns only about the word. Worth redirecting the warning,
noting the book's own distinction between a hook a subclass MAY override and an operation it MUST.

**Independent corroboration of a row.** The Template Method hook row at `:233` types the artifact
Production / own implementation / PERMANENT and grounds that on the design goal of minimising what a
subclass must override. The oracle reached the same reading unprompted. That row is sound.

**No further grind.** The oracle offered to sweep the remaining chapters (roughly ten thousand more
lines of sequential reading -- it has Read and Glob only, no search tool). Declined: the certified
scope already covers the one challengeable site positively, and the document's own qualifier 2 says
an absence claim should be hedged to what was swept, so a hedge is the correct end state rather than
a compromise. Mechanics for future rounds: scope absence questions to named high-risk sites; never
ask this agent for an exhaustive negative over a whole book.

</decisions>

<specifics>
## Specific Ideas

**Process requirements, all load-bearing, carried from the owner's brief:**

1. **Fix the instrument FIRST.** Prove every new or changed guard FAILS at baseline before any
   content edit, with per-guard `file:line` evidence. This discipline worked last round -- it caught
   the previous executor's own author reproducing banned phrasing verbatim.
2. **NEW THIS ROUND: prove each STRENGTHENED guard catches the specific demonstrated evasion** -- a
   case the OLD guard passed and the NEW one fails. A strengthened guard that merely still-passes on
   current content is unproven. Two concrete cases to reproduce: stripping the delivery name from the
   Bernhardt ROW (old guard still passed via a Sources bullet), and reverting the kanban row's Source
   to the chapter the same file says CONTRADICTS the criterion (old guard still passed via a prose
   bullet).
3. **On deleting prose, check surviving positive topics in BOTH directions** -- whether a topic's
   sole satisfying occurrence lived inside the deleted text (false PASS), and whether a topic's only
   subject is being removed (false FAIL, which deadlocked the last round).
4. **Re-derive every count from the final list and machine-assert it.** A coincidentally unchanged
   total looks untouched.
5. **NEVER assert a cell is empty, in any wording, including set-scoped forms.** The previous round
   rewrote the rule to legalise its own scoped wording; that is not a fix.
6. **The battery is NOT the acceptance gate.** Six green checkers passed the defective version at
   12/12, and a 146/146 battery passed four blocking defects. An independent unprimed review is the
   gate and runs after execution.
7. **Never brief a reviewer with a two-dot diff across a merge boundary** -- use merge commit
   `1d1474b` or a three-dot diff. A two-dot diff already fabricated a finding once this session.

**All three copies must stay byte-identical** (sha256 gate), so every content edit is applied three
times and no copy may carry a skill-relative reference.

**The `.oracle/` copyright firewall is ABSOLUTE.** Only the `oracle` agent reads it; the orchestrator
and the executor never do, not even `index.md`. `gsd-executor` cannot spawn subagents, so the
ORCHESTRATOR drives the one oracle consult (the Gang of Four back-matter question behind the "both
appendices" claim) and hands the executor a settled answer.

</specifics>

<canonical_refs>
## Canonical References

- Merge under remediation: `1d1474b`; its substantive range is `bdeb81d..85abeeb` (verified linear,
  so two-dot is safe THERE and only there).
- Prior round's artifacts: `.planning/quick/260728-wev-revise-test-double-taxonomy-drop-coined-/`
  (PLAN, RED-BASELINE, SUMMARY). RESEARCH.md from that round is WRONG on two counts and its own
  split sums to 21 against a stated total of 20 -- trust measurement over it.
- Dependent that sets a NON-OPTIONAL qualifier the taxonomy currently drops:
  `plugins/lz-tdd/skills/lz-red/references/principle-backing.md:67`.
- Repo rules: `AGENTS.md` (public-repo hygiene, allowlist-inversion, never encode a forbidden value
  as a search needle), `CLAUDE.md`.

</canonical_refs>
