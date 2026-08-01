# Test-double vocabulary: which side of the line a term names

DEV-TIME TREATMENT-ARM CONTENT for the D-12 A/B. NOT shipped, NOT approved for shipping -- the shipped
tree stays the no-artifact baseline arm by construction. As authored this file is INCOMPATIBLE with
guard G17, which fails on any bare use of the contested word under `plugins/`: the Meszaros catalog
names are themselves bare hits and D-06 forbids rewording them, so moving it into `plugins/` would
redden the reference battery.

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
- Test / collaborator / transitional -- Meszaros' `Temporary Test Stub`.
- Test / collaborator / permanent -- Meszaros' `Dummy Object` and `Fake Object`; Metz's `stub`; plus
  every term sitting in both lifetime cells of this pair: Meszaros' `Test Double`, `Test Stub`,
  `Test Spy`, `Mock Object`, `Responder`, `Saboteur`; Fowler's web contributions; Cooper's `classical`;
  Beck's `impostor` and `mocking`; 99 Bottles' `Fake`; Bernhardt's double-versus-value.

## The collision, and the rule that follows

Owned sources put the bare contested word in OPPOSITE cells, so alone it carries no information.

- Production side: Beck, for a symbol that genuinely exists in the shipped code and is not yet doing
  the work its name promises -- a 1994 report and four later essays. Clean Code Ch. 7 matches him.
- Test side: Metz, 99 Bottles, Clean Code Ch. 17 and Ch. 10, Fowler's web articles, and Meszaros.
- Inside single works too: Fowler uses it both ways in one 2007 essay, 99 Bottles splits `fake` across
  chapters 2 and 9, and Clean Code carries three names for the same artifact.

THE RULE, and it is hard: never use the bare word unqualified. Say production-side stub or
collaborator-side stub, or reach for a word that is not contested. When a developer says it bare, ASK
WHICH SIDE THEY MEAN before answering, rather than assuming the side this skill happens to prefer.

## The collaborator side: Meszaros' five kinds

`Test Double` is his umbrella for anything installed where a real collaborator would be; the catalog
chapter's hierarchy figure draws five direct subtypes. Tell them apart by what the TEST needs:

- `Dummy Object` -- fills a required parameter slot and nothing more. If the code under test ever
  calls into it, this was the wrong kind.
- `Test Stub` -- the scenario turns on what the code READS from around it, so the substitute supplies
  those incoming answers.
- `Test Spy` -- the test wants to see what was sent once the exercise is over, so the substitute keeps
  a log and the checking happens back in the test body.
- `Mock Object` -- the expectation is built into the substitute, so the substitute itself reports the
  failure when the call it was told to demand never happens. Spy versus Mock is about WHERE THE
  ASSERTION LIVES, not about how capable the object is.
- `Fake Object` -- it really does behave, in a cut-down way, chosen where the genuine article is too
  slow or too awkward to run.

Two Variations of `Test Stub`, separated by what the prepared answer is: `Responder`, an ordinary
valid answer, and `Saboteur`, a failure. SABOTEUR POLARITY TRAP -- the failure is the stimulus, not
the verdict, so the test PASSES when the code copes with it. Cite Ch. 23, not Ch. 11.

`Temporary Test Stub` is the NEAREST MISS and a reader will reach for it. Cut on a LIFECYCLE axis
rather than the input-kind axis of the other two, tied to outside-in TDD where the shells turn into
real classes, it matches on lifetime but misses on the first two axes: the shell covers a collaborator
nobody has written yet, not the symbol's own missing implementation.

## The production side

The artifact: a real production symbol, correct signature, nothing working behind it, written so a
test can run against it, headed for becoming the real implementation.

CALL IT A PRODUCTION-SIDE STUB, always qualified by side. Nothing is coined and nothing needs to be --
four owned sources already name it. No candidate is both unambiguous and general: `placeholder`, the
bare contested word, `shim`, `empty method` and bare `skeleton` are each committed to more than one
cell by the sources above.

## Citation traps

- AUTHORITY IS PER CELL; no single author arbitrates this vocabulary. Meszaros frames the
  collaborator-side set and only that, so cite HIM for what separates a `Test Spy` from a
  `Mock Object`. A Fowler taxonomy on that split is the common error; his five kinds relay Meszaros.
- THE COOPER FALSE FRIEND. Cooper's `classical` points backwards, at automated testing predating TDD;
  Fowler's `classicist` names a stance on how readily to substitute. The words rhyme and share no axis,
  so reading Cooper through Fowler's gets him backwards. Cite Cooper on over-mocking, never as taxonomy.
- BERNHARDT'S VALUE CRITERION IS TWO CONDITIONS TOGETHER: what comes out is fixed by what went in with
  nothing kept mutably, AND the thing depends on nothing else. Being simple is explicitly not it.
