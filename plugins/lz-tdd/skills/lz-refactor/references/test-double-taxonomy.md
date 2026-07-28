# Test-double and stand-in taxonomy across authors

Scope: the cross-author vocabulary map for the artifacts a developer substitutes, leaves empty, or
stands up in place of something real -- both the ones that replace a COLLABORATOR of the code under
test and the ones that stand in for the code's own unwritten implementation. It exists because the
words collide: the same term is assigned to opposite sides of that line by sources this project owns.
This document settles what to CALL things and which author to cite for each cell. It carries no
test-selection, structuring, or stance guidance of its own.

> Mixed-provenance reference, and the mixing is the point: TIERS ARE PER ROW. This document maps
> twelve authors whose access tiers differ, and several of whom disagree with each other; no single
> tier applies to the table as a whole. Every definition below is written in original words -- only
> term NAMES are kept as plain facts (DST-04), with no verbatim source prose or code. One term in
> section 5 is COINED by this skill and has no source at all; it is labelled as such where it appears.

## Table of contents

- [1. The two axes: what it stands in for, and how long it lives](#1-the-two-axes-what-it-stands-in-for-and-how-long-it-lives)
- [2. The authority rule: authority is per cell](#2-the-authority-rule-authority-is-per-cell)
- [3. The headline finding: bare stub is unusable](#3-the-headline-finding-bare-stub-is-unusable)
- [4. The per-author table](#4-the-per-author-table)
- [5. The coined term: signature skeleton](#5-the-coined-term-signature-skeleton)
- [6. Caveats that change a citation](#6-caveats-that-change-a-citation)
- [Sources](#sources)

## 1. The two axes: what it stands in for, and how long it lives

Every artifact in this document is placed by two questions, and almost every terminology argument in
the literature is a disagreement about the first one.

Axis one, WHAT IT STANDS IN FOR:

- Production side -- the artifact stands in for the code under test's OWN unwritten implementation. It
  is a real production symbol that does not do its job yet.
- Collaborator side -- the artifact stands in for something the code under test TALKS TO. It lives in
  the test's world and is wired in so the code under test can be exercised in isolation.

Axis two, LIFETIME:

- Transitional -- the artifact is destined to be replaced. It is a step on the way to something else,
  and its own removal is part of the plan.
- Permanent -- the artifact is a fixture of the design or of the suite. It is not waiting to be
  replaced by anything; it is what it will remain.

Crossing the two axes gives four cells. Three of them are well populated by the literature. The
fourth -- production side, transitional -- is the one no author names, which is why section 5 exists.

## 2. The authority rule: authority is per cell

Read this section before citing anything below. Gerard Meszaros' material is the largest and most
systematic block in the table, which makes it look like the spine. IT IS NOT THE SPINE.

**Authority is PER CELL. No single author arbitrates this taxonomy.** Four scopes follow, and the
last three are limits, not footnotes.

- Meszaros IS the reference frame for the COLLABORATOR-SIDE term set, and only for that. He coined the
  umbrella term and the five kinds under it; Fowler credits him rather than claiming them, and 99
  Bottles credits him with standardising the scheme. So for what separates a Test Spy from a Mock
  Object, cite MESZAROS. Citing a Fowler taxonomy for that split is the common error, and it is wrong.
- He is NOT the authority for the PRODUCTION side. He does not name that artifact at all, and he has
  already spent both of the obvious words on something else: `placeholder` and bare `Stub` are BOTH
  registered aliases of his `Dummy Object`, which is collaborator side. On the one cell that most
  needed a name from him, he is an obstacle rather than an authority.
- He is NOT the authority on what counts as a valid red. His outcome vocabulary has no slot for a test
  that never ran -- all three of his outcome definitions start from the test having been run, so a
  compile failure falls outside his scheme entirely. He IS citable for the narrower and useful point
  that an error is a legitimate, equally severe red that should not be converted into a failure.
- He is NOT the authority on Beck's usage. His mapping of his own `Test Stub` onto Beck's `Fake` is
  unaudited -- see section 6 -- so it must not be used to interpret Beck.

**Two senses of different VINTAGE, not a deviation.** The production-side sense of one thing standing
in for another is the older DOCUMENTED vocabulary, and the test-side sense is the newcomer on those
words. The owned chronology: in 1994 the Gang of Four's Proxy carries `surrogate` and `placeholder` in
its intent, and the same book reaches for `representative` and `stand-in`, framing a remote proxy as a
local representative for an object living in a different address space. That book positions ITSELF as
documenting prior practice rather than originating it -- each pattern had to be found in at least two
prior uses from different domains -- and it credits the substitution ideas to earlier, differently
named work: Coplien's `Ambassador`, Pascoe's `Encapsulators`, `Handle/Body`, Carolan's `Cheshire Cat`,
Meyer's `Marriage of Convenience`, with the lineage reaching back to 1963. The test-double vocabulary
arrives in 2007. So when Beck uses `stub` for a production-side artifact he is NOT deviating from a
standard: on the production side the stand-in vocabulary is the senior one, and the collision came
from the later literature taking those words for the test side. Do not present his usage as an error
against a scheme that postdates it -- and note that lz-red's own step-2 mechanics rest on him.

This document deliberately does NOT assert an etymology for the specific word `stub`. A descent from
remote-procedure-call stubs is a plausible story with no owned basis, so it is not claimed here, and
the 1994 book a reader would reach for to support it does not support it (section 6).

**Lineage.** lz-red's spine is Robert C. Martin's Three Laws; its selection moves are Beck's; its
testing stances are Metz, Bernhardt and Feathers. Meszaros is a testing-PATTERNS author and is not in
that lineage. He is imported here for vocabulary precision, not for TDD-cycle doctrine.

**Precedence.** This project's declared source-authority precedence covers PLUGIN-AUTHORING sources
only. There is **no declared precedence** for the TDD content sources mapped below -- which is
precisely why authority has to be settled per cell rather than by rank.

## 3. The headline finding: bare stub is unusable

This is the reason the document exists. Owned, oracle-verified sources assign `stub` to OPPOSITE
cells, so the bare word carries no information.

- Production side: Kent Beck uses it consistently for a real production symbol that does not do its
  job yet, across four separate files of his material. Clean Code Ch. 7 -- the chapter guest-authored
  by Michael Feathers -- uses it the same way.
- Collaborator side: Sandi Metz, 99 Bottles of OOP, Clean Code Ch. 17 and Ch. 10, Ian Cooper, Gary
  Bernhardt, Fowler's web articles, and Meszaros all use it for a test-side substitute.

That is a genuine COLLISION between owned sources, not a misreading of one of them. Note that Clean
Code lands on BOTH sides depending on the chapter, so even one book is not internally decisive.

Consequence for the coach, and it is a hard rule: **never use bare `stub` unqualified.** Say
production-side stub or collaborator-side stub, or use a term that is not contested. When a developer
says `stub`, establish which side they mean before answering rather than assuming the side this skill
happens to prefer.

## 4. The per-author table

Every row carries its OWN citability tier. A tier NEVER propagates to a neighbouring row and is never
inherited from a block of rows or from the Sources section. `Defines or uses` separates a source that
DEFINES a term from one that merely uses it in passing -- a distinction that matters because only the
first kind can be cited for what the term means.

| Author | Term | Side | Lifetime | Defining property (this document's words) | Defines or uses | Source | Citability tier |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Kent Beck | `stub` | Production | Transitional | A real production symbol that compiles but does not do its job yet | Uses consistently, does not formally define | Test-Driven Development by Example | Unowned; high-confidence core only (no-oracle) |
| Kent Beck | `pass-through interface` | Production | Permanent | A symbol that satisfies a call by delegating it onward; denotes delegation, NOT absence | Uses | Test-Driven Development by Example | Unowned; high-confidence core only (no-oracle) |
| Kent Beck | `impostor` | Collaborator | Either | His word for something standing in for a collaborator in a test | Uses | Test-Driven Development by Example | Unowned; high-confidence core only (no-oracle) |
| Kent Beck | `mocking` | Collaborator | Either | His verb for substituting a collaborator in a test | Uses | Test-Driven Development by Example | Unowned; high-confidence core only (no-oracle) |
| Sandi Metz (talks) | `stub` | Collaborator | Permanent | A test-side stand-in that answers a query with a canned value | Uses | The Magic Tricks of Testing; The Design of Tests | Owned; oracle-verified against the clean-room source |
| Sandi Metz (talks) | `shim` | Production | Transitional | A minimal production definition standing where the real one will go | Uses | The Magic Tricks of Testing; The Design of Tests | Owned; oracle-verified against the clean-room source |
| Sandi Metz (talks) | `empty method` | Production | Permanent | A method whose body is deliberately empty and stays that way | Uses | The Magic Tricks of Testing; The Design of Tests | Owned; oracle-verified against the clean-room source |
| Sandi Metz (talks) | `do-nothing method` | Production | Permanent | Same artifact as an empty method, named for its behaviour | Uses | The Magic Tricks of Testing; The Design of Tests | Owned; oracle-verified against the clean-room source |
| Metz and Owen | `Fake` | Collaborator | Either | The only test-side substitute term the book DEFINES | Defines | 99 Bottles of OOP, JavaScript Edition | Owned; oracle-verified against the clean-room source |
| Metz and Owen | `empty class` | Production | Transitional | A class stood up with no behaviour so the code can be named and referenced | Uses | 99 Bottles of OOP, JavaScript Edition | Owned; oracle-verified against the clean-room source |
| Metz and Owen | `empty method` | Production | Permanent | A method defined with no body | Uses | 99 Bottles of OOP, JavaScript Edition | Owned; oracle-verified against the clean-room source |
| Metz and Owen | `empty subclass` | Production | Transitional | A subclass with no behaviour of its own, used to open a seam for the next step | Uses | 99 Bottles of OOP, JavaScript Edition | Owned; oracle-verified against the clean-room source |
| Metz and Owen | `shim` | Collaborator | Transitional | A temporary DEFAULTABLE ARGUMENT -- not an empty definition, so NOT what Metz's talks mean by the word | Uses | 99 Bottles of OOP, JavaScript Edition | Owned; oracle-verified against the clean-room source |
| Gary Bernhardt | double versus value | Collaborator | Either | The distinction between a substituted object and a plain value fed to a pure function | Uses; supplies a count only | Boundaries (talk) | Owned; oracle-verified against the clean-room source, for the double-versus-value point ONLY |
| Martin Fowler (web) | `test double`, the five kinds, `SUT` | Collaborator | Either | The umbrella term, its five kinds, and the code-under-test abbreviation | Relays; credits Meszaros | Fowler's web articles | Cite as Meszaros, via Fowler; unowned relay (no-oracle) |
| Martin Fowler (web) | state versus behaviour verification | Collaborator | Either | Whether a test checks resulting state or the messages that were sent | Defines; his OWN contribution | Fowler's web articles | Unowned; high-confidence core only (no-oracle) |
| Martin Fowler (web) | `classicist` and `mockist` | Collaborator | Either | The two schools named for how readily they reach for a substitute | Defines; his OWN contribution | Fowler's web articles | Unowned; high-confidence core only (no-oracle) |
| Martin Fowler (Refactoring 2e) | `failure` versus `error` | Neither | Permanent | A failure is an assertion mismatch; an error is an exception raised in an earlier phase | Defines | Refactoring, 2nd Edition, Ch. 4 | Owned; oracle-verified against the clean-room source |
| Ian Cooper | `classical` | Collaborator | Either | Pre-TDD classical automated testing; see the false-friend note below | Uses loosely | Cooper's TDD talks | Owned as a talk, but NOT citable as a taxonomy |
| Joshua Kerievsky | `skeleton` | Production | Transitional | A structural stand-in introduced as a temporary step toward an extraction | Defines | Refactoring to Patterns, Ch. 11 | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Test Double` | Collaborator | Either | The umbrella for anything installed in place of a real collaborator | Defines; coined it | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Dummy Object` | Collaborator | Permanent | Something passed only to satisfy a signature, never exercised. Filed under Value Patterns in Ch. 27, and he notes that little of what applies to the other doubles applies to it | Defines | xUnit Test Patterns, Ch. 27 | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Test Stub` | Collaborator | Either | Installed to feed the code under test the indirect INPUT a scenario needs | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Test Spy` | Collaborator | Either | Records the calls it receives so the test can inspect them afterwards | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Mock Object` | Collaborator | Either | Carries the expectation itself and fails the test when the expected call does not arrive | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Fake Object` | Collaborator | Permanent | A working lightweight implementation substituted for a real one that is too costly to use | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Responder` | Collaborator | Either | A Variation of Test Stub that returns a valid canned answer | Defines | xUnit Test Patterns, Ch. 23 | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Saboteur` | Collaborator | Either | A Variation of Test Stub that injects a fault; see the polarity caveat below | Defines | xUnit Test Patterns, Ch. 23 | Owned; oracle-verified against the clean-room source |
| Gerard Meszaros | `Temporary Test Stub` | Collaborator | Transitional | A Variation of Test Stub installed only until the real collaborator is available | Defines | xUnit Test Patterns | Owned; oracle-verified against the clean-room source |
| Gang of Four | `Proxy`, alias `Surrogate` | Production | Permanent | An object taking the place of another so that access to it can be governed. Variants: `remote proxy`, `virtual proxy`, `protection proxy`, `smart reference` (also `smart pointers`); Coplien's `Ambassador` is credited for the remote kind | Defines | Design Patterns (1994) | Owned; production-side ancestor only |
| Gang of Four | `Adapter`, alias `Wrapper` | Production | Permanent | Converts one interface into the one a client already expects. The book draws the timing contrast itself: an adapter makes things work AFTER the fact, a bridge before | Defines | Design Patterns (1994) | Owned; production-side ancestor only |
| Gang of Four | Template Method `hook` | Production | Permanent | A default a subclass MAY extend, frequently doing nothing by default. PERMANENT, not transitional: the stated design goal is to minimise what a subclass must override | Defines | Design Patterns (1994) | Owned; production-side ancestor only |
| Gang of Four | empty build operation (Builder) | Production | Permanent | Build operations deliberately defined empty rather than pure virtual, so a concrete builder overrides only the parts it cares about. Arguably a purer instance of the permanent empty default than the Template Method hook | Defines | Design Patterns (1994) | Owned; production-side ancestor only |
| Gang of Four | `NullIterator` | Production | Permanent | An iterator that is always already done, so a caller needs no special-case branch. A NAMED INSTANCE only, not a general pattern -- see the caveat below | Names an instance; does not generalise | Design Patterns (1994) | Owned; production-side ancestor only |

Beck's `fixture` (which he uses in two senses) and `test bed` are test-side words but are NOT
substitution terms, so they get no row here; they name where a test's world is set up, not something
standing in for anything. Clean Code's two opposed uses of `stub` are evidence in section 3 rather
than rows here: what is established is WHICH SIDE each chapter lands on, not whether that chapter
defines the term, and this table does not guess at the missing column.

**The Cooper FALSE FRIEND.** Cooper's `classical` means pre-TDD classical automated testing. It is a
**false friend** for Fowler's `classicist`, which names a position on how readily to reach for a
substitute. The two words look like the same axis and are not: mapping Cooper onto Fowler's axis
INVERTS him. Cite Cooper for the over-mocking argument, never as a taxonomy.

**Two live conflicts, presented rather than resolved.** Where owned sources genuinely disagree, this
document names the disagreement as INHERITED instead of quietly picking a winner:

- Clean Code versus Beck on whether a build failure is a valid red. Both are owned. They disagree.
- Beck versus Meszaros on which side `stub` names -- section 3.

The first of those has a direct consequence for this skill: lz-red's own step-2 versus step-5
contradiction was a FAITHFUL TRANSCRIPTION of that inherited conflict, not carelessness. Two owned
sources were followed accurately in two different places and the disagreement came along with them.
The fix names the disagreement; it does not pretend one source was misread.

## 5. The coined term: signature skeleton

The fourth cell -- production side, transitional -- has no name in any of the twelve sources mapped
here. The artifact is specific and common: a real production symbol, with the correct signature, no
working implementation behind it, written so that a test can run against it, and destined to become
the real implementation. Twelve independent sources, and not one names it.

This document therefore **coins** `signature skeleton` for it. The term is COINED HERE and belongs to
no author. It is grounded on Kerievsky's owned `skeleton` -- the only owned candidate in the cell's
neighbourhood -- and deliberately narrowed away from it by the qualifier.

Declaring a coinage in the open, rather than smuggling it in as though a source supplied it, follows
Meszaros' own model: he names the weaknesses of his `Self Shunt` naming himself instead of defending
it. Same disclosure standard applies here.

Checked and rejected, with the reason each failed:

- `placeholder` -- contested from BOTH sides. Meszaros registers it as an alias of `Dummy Object`,
  which is collaborator side, so reusing it inverts the side axis; and it has been contested since
  1994, when the Gang of Four used it production-side in Proxy's intent sentence. That book formally
  registers only `Surrogate` as Proxy's also-known-as and never elevates `placeholder` to an alias, so
  the claim here is contested usage, not a second registration. Two claimants, opposite sides.
- bare `stub` -- the collision this whole document exists to record.
- `shim` -- Metz's talks use it production-side, but 99 Bottles uses it for a temporary defaultable
  argument, so the word is already split between the two owned Metz sources.
- `empty method` and `do-nothing method` -- both denote a body that STAYS empty. This artifact's whole
  point is that it will be filled.
- `pass-through interface` -- Beck's, production-side, but it denotes delegation rather than absence.
- `Walking Skeleton` -- a whole-system end-to-end scaffold, not a single symbol.
- `impostor` -- Beck's, but TEST-side.
- bare `skeleton` -- Kerievsky's, owned and the closest of any candidate, but his denotes a
  transitional class-EXTRACTION step. Bare reuse would overload an owned term.
- the Gang of Four stand-in family, `surrogate` and `representative` and `stand-in` -- production-side
  and genuinely senior, but each denotes one object taking another's PLACE while both exist. None of
  them denotes a symbol that has no implementation yet.

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
- **Meszaros' mapping of his `Test Stub` onto Beck's `Fake` is UNAUDITED.** No page reference, no
  explanatory note, and no discussion of Beck's `Fake It` anywhere in the volume. Do not use that
  mapping to interpret Beck.
- **`Fragile Fixture` is typed THREE different ways** across Ch. 2, Ch. 16 and Appendix F. Name the
  chapter you are citing, because the type of thing it is changes between them.
- **Both registries are NOT EXHAUSTIVE.** Appendix F omits `Test Hook`; Appendix G omits two of
  `Self Shunt`'s aliases. Neither is a closed list, so an absence from either proves nothing.
- **The cross-reference tables are a DEGRADED SCAN.** Per-column assignments other than the Beck cell
  are consistent-with rather than confirmed. Treat them as corroboration, never as the sole warrant.
- **`stub` is ABSENT from the 1994 Gang of Four book entirely** -- every sense, checked across the
  index, glossary, bibliography, footnotes, both appendices and all chapters. Its only `skeleton` is
  the Template Method algorithm outline, which is a different idea; citing that as an ancestor of the
  stub sense is a MISREAD, and it is the specific trap a reader will fall into when looking for the
  production-side pedigree.
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
- **`virtual proxy` is the nearest miss on the transitional cell, and it still fails.** Name it
  explicitly, because a reader will reach for it. The proxy PERSISTS and keeps forwarding; what
  changes over its life is only the sharpness of its reference. The artifact is never replaced -- it
  graduates. That is a different lifetime from the one section 5 names.
- **`DebuggingGlyph` is a resemblance, never a claim.** It is a decorator that prints trace
  information before and after forwarding, and it is the closest thing in that book to what a later
  author would call a spy -- but it is presented purely as a production diagnostic, with no test
  framing at all. Record it as resemblance; do not attribute a testing idea to it.

## Sources

- Kent Beck, Test-Driven Development by Example -- production-side `stub` and `pass-through
  interface`, plus the test-side words `impostor` and `mocking`. Unowned; high-confidence core only
  (no-oracle), a book held summary-only in the clean-room set.
- Sandi Metz, The Magic Tricks of Testing and The Design of Tests (talks) -- collaborator-side `stub`,
  and the production-side `shim`, `empty method` and `do-nothing method`. Owned; oracle-verified
  against the clean-room source.
- Sandi Metz and Katrina Owen, 99 Bottles of OOP, JavaScript Edition -- the defined `Fake`, the empty
  class, method and subclass, and `shim` in its defaultable-argument sense. Owned; oracle-verified
  against the clean-room source.
- Gary Bernhardt, Boundaries (talk) -- the double-versus-value distinction ONLY. He never states the
  mock-versus-stub split, and his diagram supplies a count rather than a taxonomy. Owned;
  oracle-verified against the clean-room source, for that one point.
- Martin Fowler, web articles -- state-versus-behaviour verification and the classicist and mockist
  naming are his own; the umbrella term, the five kinds and `SUT` are Meszaros' and are cited here as
  Meszaros, via Fowler. Unowned; high-confidence core only (no-oracle).
- Martin Fowler, Refactoring, 2nd Edition, Ch. 4 -- the `failure` versus `error` boundary. Owned;
  oracle-verified against the clean-room source. The BOOK carries ZERO test-double vocabulary; readers
  routinely assume the taxonomy is in it, and it is not.
- Ian Cooper, TDD talks -- the over-mocking argument. Owned as a talk, but NOT citable as a taxonomy,
  and his `classical` is a false friend for Fowler's `classicist`.
- Joshua Kerievsky, Refactoring to Patterns, Ch. 11 -- `skeleton` as a transitional production-side
  step. Owned; oracle-verified against the clean-room source.
- Gerard Meszaros, xUnit Test Patterns -- the `Test Double` umbrella, the five kinds, the Variations of
  Test Stub, and the smell vocabulary the caveats above correct. Owned; oracle-verified against the
  clean-room source, with the degraded-scan limit noted in section 6.
- Gang of Four, Design Patterns (1994) -- the production-side ancestors: Proxy and its variants,
  Adapter, the Template Method hook, Builder's empty build operations, and the `NullIterator`
  instance. Owned; PRODUCTION-SIDE ANCESTOR ONLY. It has no testing vocabulary and never treats
  testability as a design consideration; that absence is structural rather than accidental, since
  Ch. 1 declares distributed, concurrent and real-time work out of scope and the book's own
  what-varies summary is entirely production-side.
- Bobby Woolf, PLoPD3 -- Null Object, with Bruce Anderson credited for `active nothing`. Named here as
  the correct citation for a general inert-object pattern. Unowned; high-confidence core only
  (no-oracle).
- `signature skeleton` (section 5) -- COINED by lz-red. No source, by construction.

**A tier listed above does NOT license a tier for any table row that cites the same source.** Tiers
are per row. A source can be owned overall while a specific claim drawn from it is unverified, or
citable for one cell and not for another -- Bernhardt and Cooper are both live examples. Read the
row's own tier cell and nothing else.
