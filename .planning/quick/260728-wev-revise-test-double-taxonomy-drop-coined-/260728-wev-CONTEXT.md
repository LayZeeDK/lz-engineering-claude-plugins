# Quick Task 260728-wev: Revise test-double taxonomy - Context

**Gathered:** 2026-07-28
**Status:** Ready for planning
**Mode:** `--full --auto` (gray areas auto-resolved from prior owner decisions; trap-quadrant items recorded as UNRESOLVED)

<domain>
## Task Boundary

Revise `test-double-taxonomy.md` (byte-identical in all three lz-tdd skills) and its
dependents, correcting defects found by a two-reviewer acceptance gate on merge `c7a452d`
plus roughly fifteen oracle consultations and four web-research threads.

IN SCOPE: the taxonomy reference, `lz-red/SKILL.md`, `three-laws-and-test-selection.md`,
`principle-backing.md`, `beck-tdd-by-example.md`, and the
`check-red-references.mjs` checker.

SCOPE WIDENED after the current-state audit found two sibling glosses that go stale:
`lz-refactor/SKILL.md:185` literally says "the side and lifetime axes", which is FALSE under
three axes, and `lz-tpp/SKILL.md:92-94` paraphrases the artifact the coinage named. Leaving
either is exactly the unnoticed-dependent failure that produced this revision, so both are
now in scope. Also `test-structure-and-assertions.md:24`, which carries a FIFTH in-house
`skeleton` sense two files away.

TRAP the audit surfaced, affecting the vintage placeholder directly: the scaffold gate exempts
the bare word `placeholder`, so a placeholder using that word is UNDETECTABLE by the checker -
and it HARD-FAILS the file if it uses `TODO`, `TBD`, `to be authored` or `once it exists`. The
placeholder's wording must therefore be chosen deliberately and its detectability verified,
not assumed.

Note also `.planning/HANDOFF.json` is TRACKED and still records the coinage as a decision with
the review `not_started`. It is a historical record of a paused session, so decide explicitly
whether to update or leave it - do not rewrite it silently.

OUT OF SCOPE: the vintage/seniority argument's evidence base (sources not yet in
`.oracle/`), the Phase-21 eval round, and any change to `grade-red.mjs`, which is
verified byte-unchanged and must stay that way.

</domain>

<decisions>
## Implementation Decisions

### Coined vocabulary: drop it entirely

`signature skeleton` is removed. No invented terms. Owner instruction, verbatim: "Don't
invent terms."

The artifact's attested name is `stub`, always qualified by side. Evidence: Beck uses it
production-side in the Smalltalk Report 4.2 (October 1994) and across four owned essays
2007-2010; Exercism's docs DEFINE "stub implementation" for it; Microsoft, ReSharper and
rust-analyzer all reach for `stub`. Independent community vocabulary converged on the
qualified form the document's own hard rule already prescribes.

The old warrant ("no author names it") was FALSE and must not be softened - it must be
replaced. Four owned sources name the artifact. The true and stronger claim is that no
UNAMBIGUOUS name exists: every available name reuses a contested word.

### Axis one: production-side versus TEST-side

Not "collaborator-side". Owner's choice, and it fixes a real defect: Bernhardt's `fake` IO
object lives inside a real production class yet stands in for a collaborator, so under
production-versus-collaborator naming it fits neither side - while the document claims to
place every artifact.

### Three axes, not two

1. WHERE it lives: production / test
2. WHAT it stands in for: its own unwritten implementation / a collaborator
3. LIFETIME: transitional / permanent

Justification: all four combinations of axes 1 and 2 are populated by owned sources, which
is the test for a real degree of freedom rather than a description. Beck's `stub` is
production/own; GoF Proxy and Bernhardt's fake IO are production/collaborator; Meszaros'
five kinds are test/collaborator; his Subclassed Test Double and Self Shunt are test/own.

That last cell also rescues an orphaned caveat: section 6 currently carries the
Subclassed-Test-Double point as an EXCEPTION precisely because no cell existed for it.

### HARD GUARD-RAIL: never assert a cell is empty

Eight cells means more chances to repeat the defect that started this. The document states
only what POPULATES each cell. Where nothing does, the wording is "no source in this set
populates it" - NEVER "no author names it". Asserting an empty cell is what the reviewers
falsified against the document's own table.

No eight-cell matrix diagram. A compact list; this is read by an agent mid-cycle.

### Remove the fabricated Meszaros-to-Beck mapping

The document claims Meszaros maps his `Test Stub` onto Beck's `Fake` and calls that mapping
unaudited. The owner verified against the print book: **Beck's column is BLANK IN EVERY ROW**
of the terminology cross-reference. The mapping does not exist. The authority-denial built
on it goes with it.

Four readings, two wrong, and both wrong ones were the "owned" path: the print-book OCR
oracle said `Fake` while flagging its own column alignment as reconstructed; the website
oracle said `Fake` while asserting two independent structural signals and explicitly
denying the exact hazard it was warned about. Two structural traps explain it - a spanning
super-header carrying one cell more than the table declares, and header rows marked up with
`td` instead of `th`.

### Reframe Meszaros as the collision's corroborating authority

Section 2 calls him "an obstacle rather than an authority". That is backwards. His own four
cross-reference notes document the collision the taxonomy exists to record:

- Pragmatic Unit Testing's `Stub` as an empty implementation of a method - the production
  side - which he attributes to the procedural world and maps to Null Object.
- CORBA's `stubs` and `skeletons`, included expressly because it is another use of a term
  common in the TDD community.
- Early mock-objects literature conflating `Stub` with `Mock Object`.
- UTwJ using `Dummy Object` for his `Fake Object`.

Section 3's headline is his finding, not ours, and the document should credit him.

Consequence: `skeleton` now has a FOURTH claimant (Kerievsky's extraction step, Clean Code
Ch.14's artifact, GoF's Template Method outline, and the RPC generated far-end). Nothing may
be grounded on that word.

### Row corrections, all evidence-backed

- Kerievsky `skeleton`: Ch.10 (Move Accumulation to Visitor), NOT Ch.11 which contains no
  occurrence; and "Uses" not "Defines" - undefined and unindexed, a passing descriptive noun.
- Metz `shim` and `empty method`: cited to the wrong talks. Real source is RailsConf 2014
  (plus Owen at Cascadia Ruby 2012 for `empty method`), not the two testing talks.
- Metz `empty method`: mis-typed Permanent; transitional by intent.
- Metz `do-nothing method`: the term does not occur anywhere in the 21-file Metz/Owen corpus.
- All four Beck rows: mis-tiered DOWN to unowned with the wrong source. His production-side
  `stub` is owned and dated - Smalltalk Report 4.2 (Oct 1994) plus four essays 2007-2010.
  `pass-through interface` Feb 2022, `impostor` Aug 2008 (collaborator-side, and note the
  talks corpus uses that token only in the psychological sense), `mocking` Jan 2022.
- 99 Bottles `empty method` mis-typed Permanent; its Ch.2 sense IS the artifact, and the
  rejection list dismissed it on a FALSE ground. Its `empty subclass` is typed Transitional
  but persists in the final code and inherits full working behaviour.
- Row 174's "Both are owned. They disagree." becomes TRUE once Beck is re-tiered. Clean
  Code Ch.9's Second Law states within the law that failing to compile counts as failing.
- Clean Code carries load in sections 3 and 4 with no Sources entry and no tier at all.

### Add three intra-work collisions

The document frames the `stub` collision as cross-author only. It reproduces INSIDE
individual works, which strengthens the thesis:

- Fowler: production-side placeholder in the TDD-driving passage, test-side double in the
  taxonomy passage, same 2007 essay, unremarked.
- 99 Bottles: `fake` production-side in Ch.2 (Beck's Fake It), collaborator-side in Ch.9,
  never cross-referenced. A second collided word the document does not record at all.
- Clean Code: three inconsistent names for the artifact - `stub` (Ch.7, guest-authored by
  Feathers), `skeleton` (Ch.14), `degenerate implementation` (Ch.4).

### `Temporary Test Stub` undersells the trap

Meszaros ties it to outside-in TDD, calls it an empty shell with hardcoded returns, and
says the shells EVOLVE INTO the real classes. It passes destiny and fails only on side.
That is the near-miss a reader will reach for, and row 153 does not say so.

### Vintage paragraph: explicit placeholder

The chronology is established - Mills 1971 p.43 earliest, then Liskov Feb 1973, Hetzel
1973, two Datamation papers Dec 1973, IBM Oct 1974, Yourdon 1975 (definitional), Yourdon
and Constantine 1975 (a table of stub types), Tausworthe Jul 1976 crediting Mills - but
those sources are NOT in `.oracle/` yet, so nothing citable may be written.

Leave a clearly marked placeholder. Do NOT write a weak version, and do NOT keep the
current one: its equivocation is a real defect, since it argues from GoF's stand-in
vocabulary while the document itself states `stub` is absent from GoF entirely.

Also record, when the paragraph is eventually written: the evidence supports SENIORITY and
PARALLEL EXISTENCE ONLY, never descent. And a caveat a later reader needs - `stub` had an
unrelated decision-table sense in 1960s computing (condition stub, action stub), so a bare
pre-1971 hit is not evidence of the stand-in sense.

### Mechanical consequences

- `three-laws-and-test-selection.md` references `signature skeleton`; replace.
- `check-red-references.mjs` - TWO OF MY CLAIMS HERE WERE WRONG. Corrected by the
  current-state audit; trust the audit, not this list's earlier phrasing:
  - The checker contains ZERO occurrences of `skeleton`. `TAXONOMY_LABEL` (L457) is the
    sha256 label and says nothing about the coinage. There is no "label gate referencing the
    coined term" to update.
  - What touches the coinage is a TOPIC at L309, `re: /\bcoined\b/i`. **That needle will keep
    reporting PASS after the coinage is dropped**, because the taxonomy retains two unrelated
    `coined` occurrences (L56 and L145, both about Meszaros coining Test Double). This is a
    LIVE FIFTH FALSE-GREEN and must be fixed as part of this task.
  - `SKILL.md` DOES have an `absent` guard (L291, `/Phase 18/i`). What it lacks is any
    SEMANTIC guard on the worked example. The entry with NO `absent` guard at all is the
    TAXONOMY's own.
  Every new or changed guard MUST be shown to FAIL at baseline before it is trusted. A guard
  that cannot fail is worse than no guard, and this work stream has now produced five.
- Six bare `stub` uses violate the document's own hard rule, three added by `c7a452d`
  itself, two of those inside the paragraph introducing the doctrine.
- `lz-red/SKILL.md`: the worked example says "not a missing symbol" seven lines below a step
  that makes a not-implemented throw a valid red, and demonstrates `return total` - a
  wrong-value stub carrying a latent FALSE GREEN, since that is correct behaviour for a
  zero-percent discount. Note `:105`'s "not a compile error" is CORRECT and must not change.
- All three taxonomy copies stay byte-identical (sha256 gate), so the document may carry NO
  skill-relative pronouns. Dropping the coinage removes the worst of these, since "COINED by
  this skill" versus "COINED by lz-red" only existed to declare it.

### Claude's Discretion

Section ordering and prose style within the constraints above. Whether the eight cells are
presented as a list or a compact table. Exact wording of rejection reasons.

</decisions>

<resolved_late>
## RESOLVED by the owner after the auto pass - tier reliability is per MEDIUM and per CLAIM TYPE

Was recorded as UNRESOLVED (high impact, low confidence). The owner resolved it directly,
supplying the empirical reliability ordering. It is now a LOCKED decision.

**Do NOT downgrade every row.** The failure was not random, and a blanket caveat would
discount roughly thirty sound rows because of one bad cell. Tier reliability instead varies
along two axes:

1. **Print-book PROSE - reliable.** Keep the existing tier language as-is. Session evidence:
   Clean Code's both-sides `stub` usage, GoF, Refactoring 2e's zero-test-double-vocabulary
   claim, and Meszaros' own prose all held up under scrutiny.
2. **TABLE and other STRUCTURAL claims, from any medium - unreliable, require direct
   verification.** Markdown and scanned tables are notoriously hard to read correctly. The
   cross-reference table was misread twice, once by an agent explicitly asserting two
   independent structural signals and denying the precise hazard it was warned about. Two
   markup traps caused it: a spanning super-header carrying one cell more than the table
   declares, and header rows marked up with `td` instead of `th`.
3. **ASR VIDEO TRANSCRIPTS - trust less.** Many transcription artifacts. Three of the four
   Metz rows sourced from talks were defective (two wrong sources, one wrong lifetime, one
   term that does not exist in her corpus at all), and the Bernhardt row understated him.
   The video oracles flagged their own weakness unprompted: Whisper renderings where `fake`
   could surface as take or make, garbled stretches in two transcripts, and a hardware-sense
   `shims` appearing as a probable mistranscription in a second delivery of the same talk.

**Corollary that must be written into the document: for ASR sources, ABSENCE claims are the
weak case.** "The term does not appear" is far weaker from a transcript than from print,
because a single mistranscription hides a hit. Several of this document's negatives rest on
video sources and must carry that qualifier.

### Per-source exception: the Bernhardt Boundaries transcripts ARE trustworthy

Owner-stated. The Boundaries transcripts were significantly improved and re-transcribed for
clarity, so tier 3 above does NOT apply to them. Reliability is per-source and depends on
transcription quality, not on the medium alone - so the rule is "ASR quality varies, name the
source", not "all video is weak".

Consequences for the Bernhardt row:

- Its narrow negative - that he never states the mock-versus-stub split - may be asserted
  WITHOUT the ASR absence hedge. That negative survived scrutiny and now rests on a
  trustworthy record of both the 570-segment narration and the slide walkthrough.
- CORRECTED after a fresh pass on the SECOND delivery: "Uses; supplies a count only" is NOT
  simply wrong. The positional stub/mock labelling exists in the SCNA 2012 delivery's SLIDES
  ONLY. The row was built from the PyCon 2013 delivery, where that mapping is ABSENT - only
  one substitute is named there (a mock object) and `stub` is never bound to a position. So
  the characterisation is close to accurate FOR THE DELIVERY IT DESCRIBES, and my earlier
  "it is wrong" reading was really a finding about a different delivery.

  THE ACTUAL DEFECT IS THE AMBIGUOUS CITATION. The row cites "Boundaries (talk)" while two
  deliveries exist that differ on exactly the point it asserts. PyCon 2013 is a compressed
  30:19 cut of an originally 45-minute talk with code examples deliberately dropped, and it
  never references SCNA; SCNA 2012 is a separate 33:44 delivery with Ruby examples and a
  130-slide deck. The oracle was explicit that findings cannot transfer between them.

  So: name a delivery, or cite both and state the difference. Record the slide labelling only
  if SCNA is cited. And if the counting argument is rendered, note its DIRECTION - in PyCon it
  is a BENEFIT of isolated testing (the pain of standing up ten substitutes reveals a bad
  design), not an indictment of doubles.
- Its Defining property understates him. His criterion for naturally-isolated is TWO
  properties - takes a value and returns a value with nothing stashed mutably, AND no
  dependencies - not "a plain value fed to a pure function". He insists the reason integer
  addition needs no isolation is those properties, not simplicity.

### Also trustworthy: the das-0072 screencast transcript

Owner-stated, same grant as Boundaries. So BOTH Bernhardt sets are exempt from tier 3.

This confirms the finding that motivated splitting where-it-lives from what-it-stands-in-for:
Bernhardt's `fake` IO object living INSIDE a real production class - production code standing
in for a collaborator, which fits neither side under production-versus-collaborator naming.
It may now be cited without an ASR hedge.

The axis structure never depended on it alone - the production/collaborator cell is also held
by GoF's Proxy and Adapter, and the test/own cell by Meszaros' Subclassed Test Double and Self
Shunt, all tier-1 print sources - but the clearest example is now reliable.

Net effect: tier 3 (ASR, trust less) currently applies to the Metz talks, the Beck talks and
the Cooper talks. Both Bernhardt sets are tier 1.

### BUT: the existing Bernhardt row's verification is STALE, not merely weak

Owner-stated, and this is a distinct and worse problem than transcript quality. The taxonomy's
Bernhardt row was written in an earlier phase **from the older, poorer YouTube transcript**.
That transcript has since been replaced by an improved one. So the row's tier - "oracle-verified
against the clean-room source" - names a source that NO LONGER EXISTS IN THE FORM IT WAS
VERIFIED AGAINST. The verification is stale by construction.

Compounding it, the row cites "Boundaries (talk)" without naming a DELIVERY. Two exist and
they differ materially: SCNA 2012 with Ruby examples (the multi-file `boundaries/` set) and
PyCon 2013 with Python examples (the single-file YouTube record). This session's oracle read
only SCNA, because it was explicitly pointed there. So the "supplies a count only" correction
is established for SCNA, while the ORIGINAL row was built from PyCon. Different evidence bases,
and until now nobody had checked whether the claims hold for both.

REQUIRED: the row must cite a specific delivery, or cite both with any per-delivery difference
stated. A fresh oracle pass on the PyCon 2013 delivery is running to establish that.

### The general hazard this exposes - applies beyond Bernhardt

A row's tier records that a source was verified. It does NOT record WHICH VERSION of the source
was verified. When a source is later re-acquired, re-transcribed or improved, every finding
drawn from the earlier version silently inherits a tier it no longer earns.

So a tier assertion needs to be understood as version-bound. Any row whose source has been
re-acquired since the row was written requires re-verification before its tier can be trusted,
and the document should say so rather than leaving it implicit. This is the same class of
problem as the medium/claim-type split above: the tier vocabulary promises more than it can
deliver, and the honest fix is to name the limit rather than to downgrade everything.

### NEW owned evidence: the Usenet vocabulary store

A mining pass over 862,747 Usenet messages (2.42 GB, 12 newsgroups, 1980s-2010s) produced a
new oracle store at `.oracle/usenet-vocabulary/` - 746 curated messages plus an index. Plain
text with verified headers, so it is neither ASR nor tabular: reliable for both prose and
dating. Four findings bear directly on this revision.

1. **`test double` is NOT ATTESTED - zero occurrences in 862,747 messages.** The only two
   case-insensitive line matches are "the test doubled the time" and a `test DoubleDynamic`
   classpath, both correctly rejected on word boundaries. Meszaros' umbrella term never
   circulated in the community's own primary venue. A powerful owned negative the document
   does not currently carry.
2. **`stub` in own-text as early as 1988-03-18** (comp.software-eng), and `dummy` 1989-05-11
   used in the same sentence as "test stubs". Community usage of the production-side sense is
   therefore owned-and-dated at 1988 - nineteen years before the 2007 taxonomy.
3. **Beck's own post naming `Fake It` as a TDD pattern, 2002-02-04**, on
   comp.software.extreme-programming - NINE MONTHS before the book. The `Fake It` provenance
   question is closed by a primary source earlier than the book itself, and it is owned.
4. **Meszaros never posted to any of the 12 groups**, nor did Cunningham, Metz or Myers. So
   his documenting of the term collision happened in print, not in community discussion -
   which is worth stating precisely when crediting him for it.

Also verified absent, and worth knowing before anyone asserts otherwise: Mackinnon, Freeman,
Pryce and Astels posted 117 messages between them across these groups without once using
`mock`, `stub`, `fake` or `dummy`. Note the scope limit - the mock-objects work happened on
the XP mailing list and at conferences, not in these newsgroups, so this is not evidence about
their vocabulary generally.

METHOD NOTE, because it makes these numbers usable: the sweep applied word boundaries (killing
the `stubborn`/`stubble` class that produced an earlier bad hit), rejected `spy` and `shim`
wholesale after reading every hit, gated generic single words on nearby testing vocabulary, and
logged every cap it applied with the dropped count. It also found and fixed two of its own bugs
mid-run, each requiring a full re-sweep.

### Consequence for the vintage paragraph - reconsider the placeholder

The paragraph was to be stubbed because the Mills 1971 chronology's sources are not in
`.oracle/`. That reasoning no longer fully holds: the Usenet store IS owned and supplies a
dated 1988 community attestation plus the `test double` non-attestation.

So a NARROWER but fully-owned paragraph is now possible - production-side `stub` in documented
community use from 1988, against a test-double vocabulary that is absent from the same corpus
entirely - without citing Mills, Myers, NBS or IEEE at all. That is weaker on earliest-date but
stronger on provenance, and it avoids the equivocation that made the current version defective.

The planner should present BOTH options and let the owner choose: marked placeholder, or the
narrow owned version with the deeper 1970s chronology deferred to a later task.

### The existing caveat had the right instinct and the wrong exception

Section 6 already says the cross-reference tables are a DEGRADED SCAN and that per-column
assignments are "consistent-with rather than confirmed" - then carves out an exception:
"other than the Beck cell". The Beck cell is precisely the one that was fabricated.

DELETE that exception. The caveat's general claim was correct and should be strengthened;
its single carve-out inverted the actual reliability.

</resolved_late>

<specifics>
## Specific Ideas

Evidence is consolidated in session task #21. Reviewer findings and the row-level corrections
are enumerated there with sources.

The acceptance gate that found these defects was two independent neutral reviewers plus a
sweep of eleven oracle consultations. Six mechanical checkers passed the change at 12/12
GREEN while every defect above was present - so the checker battery is not the gate, and the
revision must not be treated as accepted merely because the battery goes green again.

</specifics>

<canonical_refs>
## Canonical References

- `AGENTS.md` - public-repo hygiene: allowlist-inversion for the maintainer's email, never
  encode a forbidden value as a search needle.
- The taxonomy's own closing rule - tiers are per row and never propagate - which the
  document currently violates at line 174.
- Owner-approved red criterion (Phase 21): a red must have RUN and failed, with the failure
  originating in the code under test. An assertion failure is sharpest; a not-implemented
  throw is valid but blunter; a build failure is a prerequisite to clear. Characterization
  tests are green by construction. This revision must not disturb that criterion - only stop
  the worked example from contradicting it.

</canonical_refs>
