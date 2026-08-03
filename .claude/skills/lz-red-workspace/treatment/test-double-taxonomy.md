# Test-double vocabulary: which side of the line a term names

DEV-TIME TREATMENT-ARM CONTENT for the D-12 A/B. NOT shipped, NOT approved for shipping -- the shipped
tree stays the no-artifact baseline arm by construction. As authored this file is INCOMPATIBLE with
guard G17, which fails on any bare use of the contested word under `plugins/`: the Meszaros catalog
names are themselves bare hits and D-06 forbids rewording them, so moving it into `plugins/` would
redden the reference battery.

GATING STATUS -- PARTIAL, and this is a ship precondition, not a nicety. A DST-04 oracle-reviewer pass
on 2026-08-01 covered the Meszaros and Fowler claims against their own stores and drove the revisions
now in this file. The census and the citation traps also attribute to Beck, Metz, 99 Bottles, Clean
Code, Kerievsky, Cooper and Bernhardt, and those stores were NOT supplied to that pass. Those lines are
UNGATED -- neither confirmed nor refuted. Re-gate them against their own sources before any ship
decision.

## The three axes

Place an artifact with three questions. Nearly every terminology fight here disputes the second one.

1. WHERE IT LIVES -- in the production tree as a real shipped symbol, or in the test's world, wired in
   so the code under test can run in isolation.
2. WHAT IT STANDS IN FOR -- the symbol's OWN unwritten implementation (right symbol, nothing behind it
   yet), or a COLLABORATOR the code under test talks to.
3. HOW LONG IT LIVES -- transitional, where its own removal is part of the plan, or permanent, where
   it is a fixture of the design or the suite.

Axes 1 and 2 are separate: collapse them into one production-versus-collaborator column and artifacts
get mis-placed, since Bernhardt's IO substitute lives inside a real production class yet stands in for
a collaborator.

HARD RULE ON EMPTINESS: never assert a cell is empty. The census records only what populates a cell; a
cell with no bullet claims nothing either way. No grid is drawn -- a grid invites reading an empty box
as a claim.

## Census: what populates which cell

- Production / own / transitional -- Beck's `stub`; Metz's `shim` and `empty method`; 99 Bottles'
  `empty class`; Kerievsky's `skeleton`.
- Production / own / permanent -- Beck's `pass-through interface`; 99 Bottles' `empty subclass`.
- Production / collaborator / transitional -- 99 Bottles' `shim`, in its defaultable-argument sense.
- Production / collaborator / permanent -- Bernhardt's IO substitute.
- Test / collaborator / transitional -- Meszaros' `Temporary Test Stub`, AXIS 1 UNSETTLED: the source
  also has this artifact maturing into the finished production class, which would place it in the
  production column instead. See the paragraph on it below; do not read this bullet as a flat
  test-side placement.
- Test / collaborator / permanent -- Meszaros' `Dummy Object`; Metz's `stub`; plus
  every term sitting in both lifetime cells of this pair: Meszaros' `Test Double`, `Test Stub`,
  `Fake Object`,
  `Test Spy`, `Mock Object`, `Responder`, `Saboteur`; Fowler's web contributions; Cooper's `classical`;
  Beck's `impostor` and `mocking`; 99 Bottles' `Fake`; Bernhardt's double-versus-value.

## The collision, and the rule that follows

Owned sources put the bare contested word in OPPOSITE cells, so alone it carries no information.

- Production side: Beck, for a symbol that genuinely exists in the shipped code and is not yet doing
  the work its name promises -- a 1994 report and four later essays. Clean Code Ch. 7 matches him.
- Test side: Metz, 99 Bottles, Clean Code Ch. 17 and Ch. 10, Fowler's web articles, and Meszaros.
- Inside single works too: Fowler uses it both ways in one 2007 essay, 99 Bottles splits `fake` across
  chapters 2 and 9, and Clean Code carries three names for the same artifact.
- The collision is documented INSIDE an owned source, not only across them: Meszaros devotes an
  appendix to mapping how other authors use the contested word, and the empty-implementation reading
  is among the senses he records. Do not present the clash as something he overlooked.

THE RULE, and it is hard: never use the bare word unqualified. Say production-side stub or
collaborator-side stub, or reach for a word that is not contested. When a developer says it bare, ASK
WHICH SIDE THEY MEAN before answering, rather than assuming the side this skill happens to prefer.

## The collaborator side: Meszaros' five kinds

`Test Double` is his umbrella term for the whole family below; the catalog chapter's hierarchy figure
draws five direct subtypes under it. Tell them apart by what the TEST needs:

- `Dummy Object` -- fills a required parameter slot and nothing more. If the code under test ever
  calls into it, this was the wrong kind. AXIS-2 STRAIN: it sits in the collaborator column by its
  place in the catalog, yet nothing ever talks to it. Read axis 2 here as "stands where a collaborator
  would", not "is talked to", or this kind looks mis-filed.
- `Test Stub` -- the scenario turns on what the code READS from around it, so the substitute supplies
  those incoming answers.
- `Test Spy` -- the test wants to see what was sent once the exercise is over, so the substitute keeps
  a log and the checking happens back in the test body.
- `Mock Object` -- the expectation is built into the substitute, so the substitute itself reports the
  failure when the call it was told to demand never happens. Spy versus Mock is about WHERE THE
  ASSERTION LIVES, not about how capable the object is.
- `Fake Object` -- it really does behave, in a cut-down way. Reached for where the genuine article is
  too slow or too awkward to run, and ALSO where the genuine article has not been built yet. That
  third motivation is why it is not a permanent-only term; the census lists it in both lifetime cells.

Two Variations of `Test Stub`, separated by what the prepared answer is: `Responder`, an ordinary
valid answer, and `Saboteur`, a failure. SABOTEUR POLARITY TRAP -- the failure is the stimulus, not
the verdict, so the test PASSES when the code copes with it. Cite Ch. 23, not Ch. 11.

`Temporary Test Stub` is the NEAREST MISS and a reader will reach for it. It is cut on a LIFECYCLE
axis rather than the input-kind axis the other two use, and it belongs to outside-in TDD. It matches
on lifetime. On axis 2 it covers a collaborator nobody has written yet, not the symbol's own missing
implementation.

AXIS 1 IS NOT SETTLED, and do not state it as though it were. The source also describes this
transitional artifact maturing into the finished production class, which places it in the production
column rather than the test one. Cite it as ambiguous on where-it-lives; a flat "test-side only"
reading overstates what the source supports.

## The production side

The artifact: a real production symbol, correct signature, nothing working behind it, written so a
test can run against it, headed for becoming the real implementation.

CALL IT A PRODUCTION-SIDE STUB, always qualified by side. Nothing is coined and nothing needs to be --
four owned sources already name it. No candidate is both unambiguous and general: `placeholder`, the
bare contested word, `shim`, `empty method` and bare `skeleton` are each committed to more than one
cell by the sources above.

## Citation traps

- AUTHORITY IS PER CELL; no single author arbitrates this vocabulary. Cite MESZAROS for what separates
  a `Test Spy` from a `Mock Object` -- that split is his. A Fowler taxonomy on that split is the common
  error; his five kinds relay Meszaros, as both of his relevant articles say outright.
  DO NOT over-read that into "he speaks for the collaborator side and only that". He also names a
  procedural stand-in linked into the program for a routine nobody has written yet, and a
  conditional-hook form that lives in shipped code. Asserting his silence on the production side would
  also breach the emptiness rule above -- it reads an unpopulated cell as a claim.
- THE COOPER FALSE FRIEND. Cooper's `classical` points backwards, at automated testing predating TDD;
  Fowler's `classicist` names a stance on how readily to substitute. The words rhyme and share no axis,
  so reading Cooper through Fowler's gets him backwards. Cite Cooper on over-mocking, never as taxonomy.
- BERNHARDT'S VALUE CRITERION IS TWO CONDITIONS TOGETHER: what comes out is fixed by what went in with
  nothing kept mutably, AND the thing depends on nothing else. Being simple is explicitly not it.
