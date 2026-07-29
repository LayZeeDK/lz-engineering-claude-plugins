# Test-double and stand-in taxonomy across authors

Scope: the cross-author vocabulary map for the artifacts a developer substitutes, leaves empty, or
stands up in place of something real -- both the ones that replace a COLLABORATOR of the code under
test and the ones that stand in for the code's own unwritten implementation. It exists because the
words collide: the same term is assigned to opposite sides of that line by sources this project owns.
This document settles what to CALL things and which author to cite for each cell. It carries no
test-selection, structuring, or stance guidance of its own.

> Mixed-provenance reference, and the mixing is the point: TIERS ARE PER ROW. This document maps
> twelve sources whose access tiers differ, and several of whom disagree with each other; no single
> tier applies to the table as a whole. Every definition below is written in original words -- only
> term NAMES are kept as plain facts (DST-04), with no verbatim source prose or code.

## Table of contents

- [1. The three axes: where it lives, what it stands in for, and how long it lives](#1-the-three-axes-where-it-lives-what-it-stands-in-for-and-how-long-it-lives)
- [2. The authority rule: authority is per cell](#2-the-authority-rule-authority-is-per-cell)
- [3. The headline finding, credited to Meszaros: bare stub is unusable](#3-the-headline-finding-credited-to-meszaros-bare-stub-is-unusable)
- [4. The per-author table](#4-the-per-author-table)
- [5. Naming the production-side transitional artifact](#5-naming-the-production-side-transitional-artifact)
- [6. Caveats that change a citation](#6-caveats-that-change-a-citation)
- [Sources](#sources)

## 1. The three axes: where it lives, what it stands in for, and how long it lives

Every artifact in this document is placed by three questions, and almost every terminology argument in
the literature is a disagreement about the second one.

Axis one, WHERE IT LIVES:

- Production -- the artifact is a real production symbol, shipped in the production tree.
- Test -- the artifact lives in the test's world and is wired in so the code under test can be
  exercised in isolation.

Axis two, WHAT IT STANDS IN FOR:

- Its own unwritten implementation -- the artifact stands in for the job the symbol itself will
  eventually do. It is the right symbol with nothing behind it yet.
- A collaborator -- the artifact stands in for something else, which the code under test talks to.

Axis three, LIFETIME:

- Transitional -- the artifact is destined to be replaced. It is a step on the way to something else,
  and its own removal is part of the plan.
- Permanent -- the artifact is a fixture of the design or of the suite. It is not waiting to be
  replaced by anything; it is what it will remain.

**Why where-it-lives and what-it-stands-in-for are separate questions.** Collapsing them into one
production-versus-collaborator column mis-places real artifacts. Bernhardt's IO substitute lives
inside a real production class and yet stands in for a collaborator, so under the collapsed naming it
fits neither value while this document claims to place every artifact it lists.

**HARD RULE ON EMPTINESS: this document never asserts that a cell is empty.** It states only what
POPULATES each cell. There is no scoped form of the prohibition that satisfies it: a claim that
nothing in some named set populates a cell is still an emptiness assertion, and an earlier revision of
this rule carved out exactly that form in order to license its own wording. The claim that started
this document's own correction was an emptiness assertion that the table on this page falsified, so
the doctrine is stated here rather than merely obeyed.

Crossing the three axes gives eight cells. The list below is a CENSUS OF WHAT ROWS POPULATE rather
than a tour of all eight, so a cell with no bullet carries no claim in either direction. Rows typed
`Either` on lifetime sit in both lifetime cells of their side pair, and are listed once below.

- **Production / own / transitional.** Beck's `stub`; Metz's `shim` and `empty method`; 99 Bottles'
  `empty class`; Kerievsky's `skeleton`. Six rows in the table land here. This is the cell section 5
  names, and an earlier revision of this page wrongly described it as unnamed.
- **Production / own / permanent.** Beck's `pass-through interface`; 99 Bottles' `empty subclass`; the
  Gang of Four's Template Method hook and Builder's empty build operations.
- **Production / collaborator / transitional.** 99 Bottles' `shim`, in its defaultable-argument sense.
- **Production / collaborator / permanent.** The Gang of Four's Proxy, Adapter and `NullIterator`;
  Bernhardt's IO substitute.
- **Test / collaborator / transitional.** Meszaros' `Temporary Test Stub`; 99 Bottles' `shim` also
  reads this way if the argument is read as test-facing.
- **Test / collaborator / permanent.** Meszaros' `Dummy Object` and `Fake Object`; Metz's `stub`; and
  every row typed `Either` on the test-and-collaborator pair -- Meszaros' `Test Double`, `Test Stub`,
  `Test Spy`, `Mock Object`, `Responder` and `Saboteur`, Fowler's three web contributions, Cooper's
  `classical`, Beck's `impostor` and `mocking`, 99 Bottles' `Fake`, and Bernhardt's
  double-versus-value distinction.

No eight-cell matrix diagram is drawn here on purpose. This page is read mid-cycle, and a list is
cheaper to scan than a grid.

## 2. The authority rule: authority is per cell

Read this section before citing anything below. Gerard Meszaros' material is the largest and most
systematic block in the table, which makes it look like the spine. IT IS NOT THE SPINE.

**Authority is PER CELL. No single author arbitrates this taxonomy.** Meszaros is the frame for one
part of it and is explicitly out of frame for the rest, and the limits below are limits, not
footnotes.

- Meszaros IS the reference frame for the COLLABORATOR-SIDE term set, and only for that. He coined the
  umbrella term, and the five kinds beneath it are what the substitute-object catalog chapter's
  HIERARCHY FIGURE shows as its DIRECT SUBTYPES; Fowler credits him rather than claiming them, and 99
  Bottles credits him with standardising the scheme. So for what separates a Test Spy from a Mock
  Object, cite MESZAROS. Citing a Fowler taxonomy for that split is the common error, and it is wrong.
- **He is also the CORROBORATING AUTHORITY for the collision this document exists to record**, and
  that is the reverse of treating him as an obstacle. Four notes in his own cross-reference apparatus
  document the collision from the inside: another book's use of the contested term for an empty
  implementation of a method -- the production side -- which he attributes to the procedural world and
  maps to Null Object; the remote-procedure-call pair, included expressly because it is another use of
  a term common in the TDD community; early mock-objects literature conflating the canned-answer
  double with the expectation-bearing one; and a third book using his dummy term for his fake term.
  Section 3's headline is HIS finding before it is this document's, and it is credited to him there.
- He is NOT the authority for the PRODUCTION side. He does not name that artifact, and he has already
  spent both of the obvious words on something else: `placeholder` and bare `Stub` are BOTH registered
  aliases of his `Dummy Object`, which is collaborator side. On the one cell that most needed a name
  from him, the words were already committed elsewhere.
- He is NOT the authority on what counts as a valid red. His outcome vocabulary has no slot for a test
  that never ran -- all three of his outcome definitions start from the test having been run, so a
  compile failure falls outside his scheme entirely. He IS citable for the narrower and useful point
  that an error is a legitimate, equally severe red that should not be converted into a failure.
- He is NOT the authority on Beck's usage, and the reason is structural rather than evaluative: his
  terminology cross-reference records no Beck equivalent for any of the five kinds (section 6). He
  never mapped Beck, so nothing he wrote can be used to interpret Beck.
- The contested second word of the coinage candidates now has a FOURTH claimant as a substitution
  term, so nothing in this document is grounded on that word (section 5).

**Which five, and what the number rests on.** The count is a reading of the substitute-object catalog
chapter's HIERARCHY FIGURE, which draws exactly five DIRECT SUBTYPES under the root. It is NOT his own
framing, and a coach citing him for a set of five is citing something he does not state. His own
prose states four, because the narrative chapter's rundown folds Test Stub and Test Spy into a single
bullet and presents the spy as a more capable stub. The catalog chapter says only several major
flavors and the figure caption says several kinds. Counting from the catalog's Variations run instead
yields six or nine, so the figure is the only coherent basis for a number at all. Each name below
carries its own row in section 4.

- `Test Stub`
- `Test Spy`
- `Mock Object`
- `Fake Object`
- `Dummy Object`

SCOPE OF THAT NEGATIVE, because an unhedged absence claim is exactly what this document forbids
elsewhere. The parts READ END TO END are the opening overview, the dependency-isolation narrative
chapter, the substitute-object catalog chapter, the value-patterns catalog chapter, and the terminology
appendix; across those, no numeral for this set appears other than the four. The remaining chapters and
appendixes were NOT read for the numeral, so the claim is scoped to what was checked rather than
asserted for the book entire -- a whole-book token sweep is a deterministic job for a harness, not for
a reader. The scoping costs nothing: the figure is the basis for the number regardless of what an
unread chapter says, and the prose demonstrably states four. Two conversion defects in the clean-room
store also touch this question, so the degraded-scan caveat in section 6 governs any claim resting on
them -- the terminology appendix's role-summary table came through garbled at character level, and one
bullet of the narrative chapter's rundown is an un-transcribed scanned image.

**Two INDEPENDENT VOCABULARIES that collided on one word.** This matters for exactly one reason: it
stops Beck's production-side usage being presented as an ERROR against Meszaros' scheme, given that
section 3's thesis is that the two collide. Meszaros' terminology cross-reference leaves the BECK
COLUMN BLANK IN EVERY ROW. He lists Beck's 2002 book as a source and records no equivalent term for
any of the five kinds; owner-verified against the print book. Beck's collaborator-side
vocabulary POSTDATES that 2007 book -- one term in an August 2008 essay, the other in a January 2022
essay, both owned and both carrying rows in the table below. So neither author is citing the other and
neither is deviating from the other. Beck's production-side usage is not an error against a scheme
that never claimed him.

This document deliberately does NOT assert an etymology for the specific word `stub`. A descent from
remote-procedure-call stubs is a plausible story with no owned basis, so it is not claimed here, and
the 1994 book a reader would reach for to support it does not support it (section 6).

**Lineage.** lz-red's spine is Robert C. Martin's Three Laws; its selection moves are Beck's; its
testing stances are Metz, Bernhardt and Feathers. Meszaros is a testing-PATTERNS author and is not in
that lineage. He is imported here for vocabulary precision, not for TDD-cycle doctrine.

**Precedence.** This project's declared source-authority precedence covers PLUGIN-AUTHORING sources
only. There is **no declared precedence** for the TDD content sources mapped below -- which is
precisely why authority has to be settled per cell rather than by rank.

## 3. The headline finding, credited to Meszaros: bare stub is unusable

This is the reason the document exists, and the finding is Meszaros' before it is this document's: his
own cross-reference notes record the contested term being used for an empty implementation of a
method on the production side, and separately record a remote-procedure-call use of the same word,
included expressly because the word is common in the TDD community (section 2). What this page adds is
the measurement across twelve sources, not the observation.

Owned, oracle-verified sources assign `stub` to OPPOSITE cells, so the bare word carries no
information.

- Production side: Kent Beck uses it consistently for a real production symbol that does not do its
  job yet, across a 1994 report and four later essays. Clean Code Ch. 7 -- the chapter guest-authored
  by Michael Feathers -- uses it the same way.
- Test side: Sandi Metz, 99 Bottles of OOP, Clean Code Ch. 17 and Ch. 10, Fowler's web articles, and
  Meszaros all use it for a test-side substitute.

Cooper and Bernhardt are deliberately NOT in that second list, though both use the word test-side.
Which side a term names is a TAXONOMY claim, and each of them is scoped out of taxonomy use by his own
tier: Cooper's row reads owned as a talk but NOT citable as a taxonomy, and Bernhardt's is verified for
the double-versus-value point ONLY. Using a source as evidence for something its own tier excludes is
the failure this document exists to prevent, so they are removed from the evidence rather than annotated
inside it. Both keep their table rows, their Sources entries and their own caveats.

That is a genuine COLLISION between owned sources, not a misreading of one of them.

**The collision reproduces INSIDE individual works, which strengthens the finding rather than
weakening it.** A reader who treats this as a cross-author problem will trust a single work to be
internally consistent, and these three are not:

- Fowler uses the word production-side in the passage about driving code with tests and test-side in
  the taxonomy passage of the SAME 2007 essay, without remarking on it.
- 99 Bottles collides a SECOND word the same way: `fake` is production-side in chapter 2, where it
  names Beck's get-to-green move, and collaborator-side in chapter 9, with no cross-reference between
  them.
- Clean Code carries THREE inconsistent names for the production-side transitional artifact across
  chapters: the contested word in Ch. 7, which Feathers guest-authored; a structural word in Ch. 14;
  and a degenerate-implementation phrasing in Ch. 4. So even one book is not internally decisive.

Consequence for the coach, and it is a hard rule: **never use bare `stub` unqualified.** Say
production-side stub or collaborator-side stub, or use a term that is not contested. When a developer
says `stub`, establish which side they mean before answering rather than assuming the side lz-red
happens to prefer. A gate in the lz-red DEVELOPMENT WORKSPACE checks that rule across all three
skills' reference trees and all three routers, exempting the three copies of this document because here
the word is the subject matter. That gate is NOT SHIPPED -- it lives outside the plugin, so no installed
copy carries it however wide its scope, and the rule reaches a reader as a rule rather than as something
enforced on them.

## 4. The per-author table

Every row carries its OWN citability tier. A tier NEVER propagates to a neighbouring row and is never
inherited from a block of rows or from the Sources section. `Defines or uses` separates a source that
DEFINES a term from one that merely uses it in passing, and the distinction cuts by WHAT IS BEING
CITED. For what an author CALLS the artifact -- a NAMING CITATION -- a `Uses` row suffices, because
using a word consistently for a thing is itself the evidence that the author names it that way. For
what the term MEANS -- a MEANING CITATION -- a `Defines` row is REQUIRED, and no quantity of `Uses`
rows substitutes for one. That second requirement is not softened here: it is the discipline that would
have caught the fabricated attribution an earlier revision of this page carried. Section 5's claim
about which owned sources NAME the production-side transitional artifact is a naming citation and rests
entirely on `Uses` rows, which is precisely what the split licenses; nothing in this document cites a
`Uses` row for a meaning. The one row that places no artifact at all carries an
explicit not-applicable value in both side columns rather than a blank, so an empty cell is never left
to be read as a claim.

| Author | Term | Where it lives | What it stands in for | Lifetime | Defining property (this document's words) | Defines or uses | Source | Citability tier |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Kent Beck | `stub` | Production | Own implementation | Transitional | A real production symbol that compiles but does not do its job yet | Uses consistently, does not formally define | Smalltalk Report 4.2, October 1994; four essays 2007 to 2010 | Owned; oracle-verified against the clean-room source |
| Kent Beck | `pass-through interface` | Production | Own implementation | Permanent | A symbol that satisfies a call by delegating it onward; denotes delegation, NOT absence | Uses | Essay, February 2022 | Owned; oracle-verified against the clean-room source |
| Kent Beck | `impostor` | Test | A collaborator | Either | His word for something standing in for a collaborator in a test | Uses | Essay, August 2008 | Owned; oracle-verified against the clean-room source. The talks corpus uses this token only in the psychological sense |
| Kent Beck | `mocking` | Test | A collaborator | Either | His verb for substituting a collaborator in a test | Uses | Essay, January 2022 | Owned; oracle-verified against the clean-room source |
| Sandi Metz (talks) | `stub` | Test | A collaborator | Permanent | A test-side stand-in that answers a query with a canned value | Uses | The Magic Tricks of Testing; The Design of Tests | Owned; oracle-verified against the clean-room source, with the transcript qualifier in the closing tier note |
| Sandi Metz (talks) | `shim` | Production | Own implementation | Transitional | A minimal production definition standing where the real one will go | Uses | RailsConf 2014 | Owned; oracle-verified against the clean-room source, with the transcript qualifier in the closing tier note |
| Sandi Metz (talks) | `empty method` | Production | Own implementation | Transitional | A method stood up with no body so the call site can be written; filled in by intent rather than left empty | Uses | RailsConf 2014; corroborated by Katrina Owen, Cascadia Ruby 2012 | Owned; oracle-verified against the clean-room source, with the transcript qualifier in the closing tier note |
| Metz and Owen | `Fake` | Test | A collaborator | Either | The only test-side substitute term the book DEFINES; note the same word is used production-side in chapter 2 | Defines | 99 Bottles of OOP, JavaScript Edition, Ch. 9 | Owned; oracle-verified against the clean-room source |
| Metz and Owen | `empty class` | Production | Own implementation | Transitional | A class stood up with no behaviour so the code can be named and referenced | Uses | 99 Bottles of OOP, JavaScript Edition | Owned; oracle-verified against the clean-room source |
| Metz and Owen | `empty method` | Production | Own implementation | Transitional | A method defined with no body, in the chapter-2 sense that IS this artifact rather than a body that stays empty | Uses | 99 Bottles of OOP, JavaScript Edition, Ch. 2 | Owned; oracle-verified against the clean-room source |
| Metz and Owen | `empty subclass` | Production | Own implementation | Permanent | A subclass with no behaviour of its own that PERSISTS into the final code, inheriting full working behaviour | Uses | 99 Bottles of OOP, JavaScript Edition | Owned; oracle-verified against the clean-room source |
| Metz and Owen | `shim` | Production | A collaborator | Transitional | A temporary DEFAULTABLE ARGUMENT -- not an empty definition, so NOT what Metz's talks mean by the word | Uses | 99 Bottles of OOP, JavaScript Edition | Owned; oracle-verified against the clean-room source |
| Gary Bernhardt | double versus value | Test | A collaborator | Either | The distinction between a substituted object and a value handed to a function. His criterion for the value side is TWO numbered properties -- it is a function, values in and values out with nothing stashed mutably, AND it has no dependencies -- and he explicitly REJECTS simplicity as the reason | Uses; and in this delivery the count of substitutes is framed as a BENEFIT of isolated testing, since the pain of standing up ten of them reveals a bad design, not as an argument against substitutes | Boundaries, PyCon 2013 delivery | Owned; oracle-verified against the clean-room source, for the double-versus-value point ONLY. Exempt from the transcript qualifier; see the version qualifier in the closing tier note |
| Gary Bernhardt | IO substitute | Production | A collaborator | Permanent | A substitute for the outside world that sits inside a real production class rather than in the test, pushing effects to the edge so the centre stays a function | Uses | Functional-core screencast | Owned; oracle-verified against the clean-room source. Exempt from the transcript qualifier |
| Martin Fowler (web) | `test double`, the five kinds, `SUT` | Test | A collaborator | Either | The umbrella term, the five kinds the hierarchy figure shows, and the code-under-test abbreviation | Relays; credits Meszaros | Fowler's web articles | Cite as Meszaros, via Fowler; unowned relay (no-oracle) |
| Martin Fowler (web) | state versus behaviour verification | Test | A collaborator | Either | Whether a test checks resulting state or the messages that were sent | Defines; his OWN contribution | Fowler's web articles | Unowned; high-confidence core only (no-oracle) |
| Martin Fowler (web) | `classicist` and `mockist` | Test | A collaborator | Either | The two schools named for how readily they reach for a substitute | Defines; his OWN contribution | Fowler's web articles | Unowned; high-confidence core only (no-oracle) |
| Martin Fowler (Refactoring 2e) | `failure` versus `error` | Not applicable | Not applicable | Permanent | A failure is an assertion mismatch; an error is an exception raised in an earlier phase. This row names an outcome distinction, not a substituted artifact | Defines | Refactoring, 2nd Edition, Ch. 4 | Owned; oracle-verified against the clean-room source |
| Ian Cooper | `classical` | Test | A collaborator | Either | Pre-TDD classical automated testing; see the false-friend note below | Uses loosely | Cooper's TDD talks | Owned as a talk, but NOT citable as a taxonomy |
| Joshua Kerievsky | `skeleton` | Production | Own implementation | Transitional | A structural stand-in introduced as a temporary step toward an extraction | Uses in passing; undefined and unindexed, a descriptive noun rather than a named pattern | Refactoring to Patterns, Ch. 10, Move Accumulation to Visitor | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Test Double` | Test | A collaborator | Either | The umbrella for anything installed in place of a real collaborator | Defines; coined it | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Dummy Object` | Test | A collaborator | Permanent | Something passed only to satisfy a signature, never exercised. Filed under Value Patterns in Ch. 27, and he notes that little of what applies to the other doubles applies to it | Defines | xUnit Test Patterns, Ch. 27 | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Test Stub` | Test | A collaborator | Either | Installed to feed the code under test the indirect INPUT a scenario needs | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Test Spy` | Test | A collaborator | Either | Records the calls it receives so the test can inspect them afterwards | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Mock Object` | Test | A collaborator | Either | Carries the expectation itself and fails the test when the expected call does not arrive | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Fake Object` | Test | A collaborator | Permanent | A working lightweight implementation substituted for a real one that is too costly to use | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Responder` | Test | A collaborator | Either | A Variation of Test Stub that returns a valid canned answer | Defines | xUnit Test Patterns, Ch. 23 | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Saboteur` | Test | A collaborator | Either | A Variation of Test Stub that injects a fault; see the polarity caveat below | Defines | xUnit Test Patterns, Ch. 23 | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Temporary Test Stub` | Test | A collaborator | Transitional | A Variation of Test Stub, discriminated on a LIFECYCLE axis rather than on the input-kind axis that separates Responder from Saboteur. THE NEAREST MISS, and a reader will reach for it. He ties it to outside-in TDD, describes it as an empty shell with hardcoded returns, and says the shells EVOLVE INTO the real classes. It passes on destiny and fails only on where it lives: his shell stands in for a collaborator not yet available, not for the symbol's own unwritten implementation | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |
| Gang of Four | `Proxy`, alias `Surrogate` | Production | A collaborator | Permanent | An object taking the place of another so that access to it can be governed. Variants: `remote proxy`, `virtual proxy`, `protection proxy`, `smart reference` (also `smart pointers`); Coplien's `Ambassador` is credited for the remote kind | Defines | Design Patterns (1994) | Owned; production-side ancestor only |
| Gang of Four | `Adapter`, alias `Wrapper` | Production | A collaborator | Permanent | Converts one interface into the one a client already expects. The book draws the timing contrast itself: an adapter makes things work AFTER the fact, a bridge before | Defines | Design Patterns (1994) | Owned; production-side ancestor only |
| Gang of Four | Template Method `hook` | Production | Own implementation | Permanent | A default a subclass MAY extend, frequently doing nothing by default. PERMANENT, not transitional: the stated design goal is to minimise what a subclass must override | Defines | Design Patterns (1994) | Owned; production-side ancestor only |
| Gang of Four | empty build operation (Builder) | Production | Own implementation | Permanent | Build operations deliberately defined empty rather than pure virtual, so a concrete builder overrides only the parts it cares about. Arguably a purer instance of the permanent empty default than the Template Method hook | Defines | Design Patterns (1994) | Owned; production-side ancestor only |
| Gang of Four | `NullIterator` | Production | A collaborator | Permanent | An iterator that is always already done, so a caller needs no special-case branch. A NAMED INSTANCE only, not a general pattern -- see the caveat below | Names an instance; does not generalise | Design Patterns (1994) | Owned; production-side ancestor only |

Beck's `fixture` (which he uses in two senses) and `test bed` are test-side words but are NOT
substitution terms, so they get no row here; they name where a test's world is set up, not something
standing in for anything. Clean Code's opposed uses of the contested word are evidence in section 3
rather than rows here: what is established is WHICH SIDE each chapter lands on, not whether that
chapter defines the term, and this table does not guess at the missing column.

**The Cooper FALSE FRIEND.** Cooper's `classical` means pre-TDD classical automated testing. It is a
**false friend** for Fowler's `classicist`, which names a position on how readily to reach for a
substitute. The two words look like the same axis and are not: mapping Cooper onto Fowler's axis
INVERTS him. Cite Cooper for the over-mocking argument, never as a taxonomy.

**Two live conflicts, presented rather than resolved.** Where owned sources genuinely disagree, this
document names the disagreement as INHERITED instead of quietly picking a winner:

- Clean Code versus Beck on whether a build failure is a valid red. Both are owned -- Beck by the
  report and essays cited in his rows above -- and Clean Code Ch. 9 states within the Second Law
  itself that failing to compile counts as failing. They disagree. TWO QUALIFIERS TRAVEL WITH THE BECK
  SIDE AND ARE NOT OPTIONAL: the claim is GATED on a red test already existing, and it is only
  ONE POSITION AMONG SEVERAL that he himself calls contradictory. Both are stated in full on the
  row that backs it in [principle-backing.md](principle-backing.md); never present the kanban cycle
  as his settled doctrine.
- Beck versus Meszaros on which side `stub` names -- section 3.

The first of those has a direct consequence for lz-red: its own step-2 versus step-5 contradiction was
a FAITHFUL TRANSCRIPTION of that inherited conflict, not carelessness. Two owned sources were followed
accurately in two different places and the disagreement came along with them. The fix names the
disagreement; it does not pretend one source was misread.

## 5. Naming the production-side transitional artifact

The artifact is specific and common: a real production symbol, with the correct signature, no working
implementation behind it, written so that a test can run against it, and destined to become the real
implementation.

**Call it a production-side stub.** Always qualified by side, which is what the hard rule in section 3
already prescribes. No new term is invented here, and none is needed.

**Four owned sources NAME this artifact** -- Beck with the contested word, Metz's talks with two words,
99 Bottles with two more, and Kerievsky with a structural word. Six rows in the table land in its
cell. An earlier revision of this page asserted that the cell was unnamed and coined a term on that
basis; the assertion was false against the table on this same page, and the coinage is withdrawn.

**The true and stronger finding is that no name is both UNAMBIGUOUS and general.** A candidate
COLLIDES when the word itself is committed to more than one cell of the three-axis grid by the owned
sources mapped here. That is a claim about ambiguity rather than about absence, and it is checkable
against the table above. Ten candidates are surveyed below and five of them collide. The other five
fail for a stated reason that is NOT ambiguity, and the last of those collides with nothing whatever
-- which is why the UNIVERSAL form of this finding, carried by an earlier revision of this page, was
false and is withdrawn.

Each bullet states its verdict and then its reason. Read the list as the evidence for the finding
rather than as a justification for inventing anything:

- `placeholder` -- COLLIDES. Contested from BOTH sides. Meszaros registers it as an alias of
  `Dummy Object`, which is collaborator side, so reusing it inverts the side axis; and it has been
  contested since 1994, when the Gang of Four used it production-side in Proxy's intent sentence. That
  book formally registers only `Surrogate` as Proxy's also-known-as and never elevates `placeholder` to
  an alias, so the claim here is contested usage, not a second registration. Two claimants, opposite
  sides.
- bare `stub` -- COLLIDES. The collision this whole document exists to record. Correct once qualified
  by side, which is why the qualified form is the recommendation above.
- `shim` -- COLLIDES, across the second axis. Metz's talks use it production-side for the symbol's own
  unwritten implementation, but 99 Bottles uses it for a temporary defaultable argument, so the word is
  already split between the two owned Metz sources.
- `empty method` -- COLLIDES, on the LIFETIME axis rather than the side axis. Accurate for what the
  artifact looks like and wrong about what happens next in some of its uses, since the same phrase also
  names a body that STAYS empty. 99 Bottles' chapter-2 sense IS this artifact, so the word is split
  within a single work rather than simply unsuitable.
- bare `skeleton` -- COLLIDES. Kerievsky's, owned and the closest of any candidate, but his denotes a
  transitional class-EXTRACTION step. As a SUBSTITUTION TERM this word now has four claimants --
  Kerievsky's extraction step, Clean Code Ch. 14's artifact, the Gang of Four's Template Method
  algorithm outline, and the generated far end of a remote procedure call -- so nothing is grounded on
  it in that sense. The claim is scoped to substitution terms deliberately: the word also has settled
  in-house structural senses that are not in contention here.
- `pass-through interface` -- NO COLLISION. Beck's, production-side, and committed to one cell only. It
  fails on MEANING instead: it denotes delegation rather than absence.
- `Walking Skeleton` -- NO COLLISION. It carries a single sense and fails on SCOPE: a whole-system
  end-to-end scaffold, not one symbol.
- `impostor` -- NO COLLISION. Beck's, and committed to one cell only. It fails because that cell is the
  test side, not because the word is contested.
- the Gang of Four stand-in family, `surrogate` and `representative` and `stand-in` -- NO COLLISION.
  Production-side and one cell each, but each denotes one object taking another's PLACE while both
  exist. None of them denotes a symbol that has no implementation yet.
- `empty class` -- NO COLLISION, and it is the candidate that falsifies any universal form of this
  finding. 99 Bottles commits it to THIS cell and no owned source mapped here commits it to another, so
  it is listed rather than quietly scoped out; omitting the one counterexample would be special
  pleading. It is not the recommendation only because it names a CLASS, so it does not reach a
  method-level or function-level stand-in, and the artifact this section names occurs at all three
  granularities.

## 6. Caveats that change a citation

Each item below CHANGES A CITATION -- which chapter to cite, which author, or whether the claim is
citable at all. The Meszaros internal edges belong here for exactly that reason: they are not trivia
about a book, they are the difference between a correct citation and a wrong one.

- **`Saboteur` polarity is PASS-when-handled.** The injected failure is the STIMULUS, not the verdict:
  the test passes when the code under test handles the fault correctly. Cite Ch. 23, NOT Ch. 11 -- the
  two chapters draw the Responder and Saboteur line in different places.
- **The claim that the code under test can never be its own double is NOT citable.** Ch. 11 states you
  may make it its own `Subclassed Test Double`, and Ch. 23 works the example. Only the narrow rule is
  citable: never double the part actually under verification.
- **Meszaros is NET PRO-SUBSTITUTION**, with one narrow warning. Do not present him as an
  anti-mocking authority; he is not one.
- **The correct anti-over-mocking citation is `Overspecified Software`** -- a CAUSE of the
  `Fragile Test` smell, and itself a form of `Behavior Sensitivity` -- with the actual argument in
  Ch. 5, `Use the Front Door First`. `Behavior Sensitivity` alone carries NO anti-substitution
  content, so citing it for that argument cites nothing.
- **There is NO Meszaros-to-Beck mapping to audit.** His terminology cross-reference leaves the BECK
  COLUMN BLANK IN EVERY ROW: Beck's book is listed as a source and no equivalent term is recorded for
  any of the five kinds. Owner-verified against the print book. An earlier revision of this page
  asserted a specific mapping of his canned-answer double onto one of Beck's terms and then flagged
  that mapping as unverified; the mapping does not exist, so the finding is the blank column and the
  authority claim built on the mapping is withdrawn with it. TWO MARKUP TRAPS produced four readings
  of that table, of which two were wrong and both wrong ones came by the owned path: a spanning
  super-header carrying one cell more than the table declares, and header rows marked up as data cells
  rather than as header cells. Anyone re-reading that table should expect both.
- **`Fragile Fixture` is typed THREE different ways** across Ch. 2, Ch. 16 and Appendix F. Name the
  chapter you are citing, because the type of thing it is changes between them.
- **Both registries are NOT EXHAUSTIVE.** Appendix F omits `Test Hook`; Appendix G omits two of
  `Self Shunt`'s aliases. Neither is a closed list, so an absence from either proves nothing.
- **The cross-reference tables are a DEGRADED SCAN.** Per-column assignments are consistent-with
  rather than confirmed, with no exception. Treat them as corroboration, never as the sole warrant.
- **`stub` is ABSENT, in every sense, from every part of the 1994 Gang of Four book that has been
  swept -- and the sweep is not the whole book.** SWEPT COMPLETE: the Proxy pattern in full including
  its remote-variant discussion; the Template Method pattern in full; all THREE appendices -- the
  glossary is one of them, carrying a letter designation exactly as the notation guide and the
  foundation-classes section do; the bibliography; the collected notes; the index; the front-matter
  pattern summaries; the unnumbered interstitial section that introduces the catalog between two
  chapters; and the inside-back-cover notation summary. NOT SWEPT: the introduction, case-study and
  conclusion chapters; the creational chapter; the structural chapter apart from Proxy; and the
  behavioral chapter apart from Template Method. An earlier revision of this page asserted the absence
  for the book ENTIRE, and enumerated the parts it had checked in a way that under-counted the
  appendices, implied the glossary was not one of them, and missed the whole front matter, the catalog
  interstitial and the inside-back-cover summary. The scoped claim is the honest end state here rather
  than a compromise: this document's own qualifier 2 says an absence claim should be hedged to what was
  actually checked.
- **The one SENSE that book gives `skeleton` is the Template Method algorithm outline** -- a fixed
  outline of an algorithm with steps left to subclasses, carrying no testing connotation at all. That is
  a SENSE and not an occurrence: there are three occurrences of it, one of them in the front-matter
  quick reference that gives a one-line intent for each pattern. Citing it as an ancestor of the stub
  sense is a MISREAD, and it is the specific trap a reader will fall into when looking for the
  production-side pedigree.
- **A POSITIVE finding, and it is stronger warrant than the absence.** The remote-variant material in
  that book describes the role of standing in for an object across an ADDRESS SPACE three separate
  times -- a local representative for an object that lives elsewhere, the marshaling responsibility, and
  the encode-and-forward round trip -- entirely in functional vocabulary, and never once reaches for the
  contested word. A source that articulates the CONCEPT and still does not use the WORD is better
  evidence than a bare absence, and it positively covers the one site a reader would challenge.
- **The real near-miss trap in that book is the do-nothing HOOK, not a word.** A hook whose default body
  is empty and which exists to be overridden LOOKS like the production-side transitional artifact, and
  that is where a reader will actually go wrong -- more reliably than on any vocabulary resemblance.
  Carry the book's own distinction: a hook a subclass MAY override is not an operation it MUST. The
  Template Method hook row above types that artifact PERMANENT on the stated goal of minimising what a
  subclass must override, which is exactly why it is a near miss rather than a match.
- **The do-nothing-object misattribution is HALF true.** That book supplies the named instance
  `NullIterator` -- iteration-specific, appearing in three places, with exactly the
  no-special-case-branch payoff -- but NOT a general pattern. It is an implementation note inside
  Iterator with no intent, applicability, consequences or known uses of its own, and it is never
  generalised. So Null Object remains Woolf's, in PLoPD3, with Bruce Anderson credited for
  `active nothing`. Citing the 1994 book for a general inert-object pattern over-reads it.
- **That book also argues AGAINST a harmless default where the default would mask a bug.** Composite
  considers a do-nothing `Add` and REJECTS it, on the grounds that an attempted add to a leaf probably
  indicates a defect, and recommends failing instead. So it is not uniformly in favour of silently
  inert defaults: it distinguishes where empty is a legitimate value from where a no-op hides an error.
- **`virtual proxy` is the nearest miss among the production-side ancestors, and it still fails.** Name
  it explicitly, because a reader will reach for it. The proxy PERSISTS and keeps forwarding; what
  changes over its life is only the sharpness of its reference. The artifact is never replaced -- it
  graduates. That is a different lifetime from the transitional cell.
- **`DebuggingGlyph` is a resemblance, never a claim.** It is a decorator that prints trace
  information before and after forwarding, and it is the closest thing in that book to what a later
  author would call a spy -- but it is presented purely as a production diagnostic, with no test
  framing at all. Record it as resemblance; do not attribute a testing idea to it.

## Sources

- Kent Beck -- production-side `stub` in the Smalltalk Report 4.2, October 1994 and across four essays
  2007 to 2010; `pass-through interface` February 2022; `impostor` August 2008; `mocking` January 2022.
  Owned; oracle-verified against the clean-room source. His book Test-Driven Development by Example is
  a SEPARATE surface, held summary-only and unowned (no-oracle); it backs no row above, and the owned
  tier on these essay-and-report rows does not reach it.
- Sandi Metz, conference talks -- collaborator-side `stub` in The Magic Tricks of Testing and The
  Design of Tests; production-side `shim` and `empty method` in RailsConf 2014, with Katrina Owen's
  Cascadia Ruby 2012 talk corroborating the empty method. Owned; oracle-verified against the
  clean-room source, subject to the transcript qualifier below.
- Sandi Metz and Katrina Owen, 99 Bottles of OOP, JavaScript Edition -- the defined `Fake`, the empty
  class, method and subclass, and `shim` in its defaultable-argument sense. Owned; oracle-verified
  against the clean-room source.
- Gary Bernhardt -- the double-versus-value distinction from Boundaries, and the IO substitute from the
  functional-core screencast. Two deliveries of Boundaries exist and differ materially, so a claim must
  name one: PyCon 2013 is a compressed thirty-minute cut of an originally forty-five-minute talk with
  code examples deliberately dropped and no reference to the other delivery, while SCNA 2012 is a
  separate thirty-four-minute delivery with Ruby examples and a hundred-and-thirty-slide deck whose
  slides positionally label the substitutes by role. Findings do not transfer between them. He never
  states the mock-versus-stub split in either, and that negative needs no hedge. Owned;
  oracle-verified against the clean-room source, and EXEMPT from the transcript qualifier below.
- Martin Fowler, web articles -- state-versus-behaviour verification and the classicist and mockist
  naming are his own; the umbrella term, the five kinds the hierarchy figure shows, and `SUT` are
  Meszaros' and are cited here as Meszaros, via Fowler. Unowned; high-confidence core only (no-oracle).
- Martin Fowler, Refactoring, 2nd Edition, Ch. 4 -- the `failure` versus `error` boundary. Owned;
  oracle-verified against the clean-room source. The BOOK carries ZERO test-double vocabulary; readers
  routinely assume the taxonomy is in it, and it is not.
- Ian Cooper, TDD talks -- the over-mocking argument. Owned as a talk, but NOT citable as a taxonomy,
  and his `classical` is a false friend for Fowler's `classicist`. Subject to the transcript qualifier.
- Joshua Kerievsky, Refactoring to Patterns, Ch. 10 -- `skeleton` as a transitional production-side
  step, used in passing rather than defined. Owned; oracle-verified against the clean-room source.
- Gerard Meszaros, xUnit Test Patterns -- the `Test Double` umbrella, the five kinds the hierarchy
  figure shows, the Variations of
  Test Stub, the terminology cross-reference whose blank Beck column section 2 rests on, and the smell
  vocabulary the caveats above correct. Owned; oracle-verified against the clean-room source, with the
  degraded-scan limit noted in section 6.
- Robert C. Martin and contributors, Clean Code -- the production-side use of the contested word in
  Ch. 7, which Michael Feathers guest-authored; test-side uses in Ch. 17 and Ch. 10; a structural word
  for the same artifact in Ch. 14 and a degenerate-implementation phrasing in Ch. 4; and the Second
  Law in Ch. 9, which counts failing to compile as failing. Owned; oracle-verified against the
  clean-room source. Carries load in sections 3 and 4 and is listed here so that load is tiered.
- Gang of Four, Design Patterns (1994) -- the production-side ancestors: Proxy and its variants,
  Adapter, the Template Method hook, Builder's empty build operations, and the `NullIterator`
  instance. Owned; PRODUCTION-SIDE ANCESTOR ONLY. It has no testing vocabulary and never treats
  testability as a design consideration; that absence is structural rather than accidental, since
  Ch. 1 declares distributed, concurrent and real-time work out of scope and the book's own
  what-varies summary is entirely production-side.
- Bobby Woolf, PLoPD3 -- Null Object, with Bruce Anderson credited for `active nothing`. Named here as
  the correct citation for a general inert-object pattern. Unowned; high-confidence core only
  (no-oracle).

**A tier listed above does NOT license a tier for any table row that cites the same source.** Tiers
are per row. A source can be owned overall while a specific claim drawn from it is unverified, or
citable for one cell and not for another -- Bernhardt and Cooper are both live examples. Read the
row's own tier cell and nothing else.

Three further qualifiers on what a tier promises, because the tier vocabulary over-promises and the
honest fix is to name the limit rather than to lower every row. Roughly thirty rows above are sound
and are NOT downgraded here; the failures that prompted these qualifiers were specific, not random.

1. BY CLAIM TYPE. Prose claims from print hold up. TABLE and other STRUCTURAL claims, from any medium,
   are unreliable and require direct verification before use. The terminology cross-reference was
   misread twice, once by a reader explicitly asserting two independent structural signals and denying
   the precise hazard it had been warned about, and the two markup traps in section 6 explain how.
2. BY SOURCE MEDIUM. Automatic-transcript sources are weaker, and the corollary a reader needs is that
   for such a source an ABSENCE claim is the weak case: a single mistranscription hides a hit, so
   "the term does not appear" carries far less from a transcript than from print. Reliability is per
   source and depends on transcription quality rather than on the medium alone, so the rule is to NAME
   THE SOURCE rather than to discount all video. Currently weaker: the Metz talks, the Beck talks, the
   Cooper talks. Exempt and trustworthy: both Bernhardt sets.
3. BY SOURCE VERSION. A tier records that a source WAS verified. It does not record WHICH VERSION was
   verified, so every tier assertion here should be read as version-bound. When a source is later
   re-acquired or re-transcribed, findings drawn from the earlier version silently inherit a tier they
   no longer earn, and any row whose source has been re-acquired since the row was written needs
   re-verification before its tier can be trusted. THE BERNHARDT DOUBLE-VERSUS-VALUE ROW IS THE
   CONCRETE CASE, on two counts: its verification is stale because the transcript it was originally
   verified against has since been replaced by an improved one, AND its citation was ambiguous between
   two materially different deliveries until the row named one.
