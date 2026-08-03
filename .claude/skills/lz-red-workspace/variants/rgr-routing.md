# Red-green-refactor routing table

Scope: the plugin-wide, normative routing reference for the lz-tdd red-green-refactor loop. For every
request the loop can receive it names the one skill that owns it -- lz-red for the red step, lz-tpp for
the green step, lz-refactor for the refactor step -- plus one explicit terminal for a request the loop
does not own at all. It is written from no skill's vantage: every rule below reads the same whichever
of the three a reader arrived from, because a plugin-wide file that names its owner in the first
person is correct for only one of its readers.

> Orchestration reference: the routing rules below are this project's own decisions, not a claim from
> any book. Original wording throughout; no verbatim source prose. The single book-backed rule any of
> them leans on is named in Sources and cited there for the one hop it actually supports.

## Staging note -- workspace artifact, not shipped

This file is a VARIANT artifact staged for the D-08 placement A/B. D-09 authors all three placement
variants and ships only the measured winner; D-24 records that variant A is the TRACKED tree and adds
no shipped file. So this source lives in the lz-red workspace and reaches a plugin tree only through
the variant builder, which copies it and strips this section before the copy is measured. It becomes a
shipped reference if, and only if, the owner-approved measurement selects a variant that includes it.
Nothing here is live in the tracked plugin.

## The routing table

Classify by the ASK -- what the developer is asking for -- and take the first row that fits. The state
of the suite never decides ownership. An empty second hop is written as a `none` marker, meaning the
owner answers the whole request; a named second hop means the first owner opens the work and the
second finishes it. The residual row names no owner and says so in its own cell.

| Case | Ask | Owner | Second hop | Reason |
|------|-----|-------|------------|--------|
| c1 | Just finished making a test pass, and asking what comes next | lz-refactor | none | Newly green and asking what is next is the refactor step's own trigger, so it fires a positive branch and never a fallback |
| c2 | Which test to write next | lz-red | none | Choosing and writing the next failing test is the red step |
| c3 | Whether a test is a good test | lz-red | none | An ask about the test itself belongs to the red step, whatever kind of file the code under discussion lives in |
| c4 | Add a new behavior, or change what working code does, before any test covers it | lz-red | lz-tpp | Production code waits for a failing test, so the red step opens the work and the green step takes over once that test is red |
| c5 | Tidy a duplicated or messy test file | lz-refactor | none | A structure-only tidy is the refactor step even when the code being tidied happens to live in a test file |
| c6 | Make a failing test pass | lz-tpp | none | Picking the minimal change that turns a red bar green is the green step |
| c7 | Clean up a function that carries no tests | lz-refactor | none | Coverage is not ownership; the refactor step pins the current behavior with characterization tests first, then refactors |
| c8 | Which test comes next, plus a secondary tidy ask in the same message | lz-red | none | One owner takes the primary ask; the tidy is named as a next step inside that answer rather than routed as a second hop |
| c9 | A design question outside the loop, such as how to structure a CLI's argument parsing | no owner | none | Not a red-green-refactor-loop request; nothing in the loop owns it, so the skill in view says so plainly and answers the question directly |

## Edge cases

The rows above are the whole case-to-owner map. The discretion behind three of them is stated here
rather than in any skill's branch list, because a branch list that restated it would stop being a
branch list.

**The two-hop rule, and why Law 1 forces it.** Case c4 is the only ordered pair in the map, and the
order is not a preference. Law 1 of the Three Laws of TDD gates production code behind a failing test,
so a request to add a new behavior cannot begin at the green step no matter how obvious the production
change looks: there is nothing yet for a transformation to make pass. The red step therefore opens the
work by choosing and writing that failing test, and the green step owns the request only once the test
is red. Reversing the pair is not a stylistic variation, it is a Law 1 violation. Ownership of the
first hop is what the routing decision settles; the handoff to the second hop happens inside the first
owner's own procedure and is not a second classification.

**Test code is owned by the ask, not by the file's kind.** Cases c3 and c5 sit on opposite sides of one
boundary and must resolve to different owners. An ask ABOUT a test -- what it should assert, how it
should be named, whether it is a good test, which test comes next -- is a red-step ask, and the red
step is lz-red, even though the code in question lives in a test file. An ask to improve the STRUCTURE
of code that happens to live in a test file -- it is duplicated, it is messy, tidy it -- is a
refactor-step ask, and the refactor step is lz-refactor, because nothing about the behavior changes.
Routing on the file's kind instead would collapse the two: it would send every test-file request to one
owner, which both misroutes the test-quality ask and strips a legitimate refactoring case. The axis is
the ask, in this boundary as everywhere else in the map.

**The residual terminal claims nothing.** Case c9 is not a gap in the map, it is a declared row. A
request can be a good engineering question and still be outside the red-green-refactor loop, and when
it is, no skill in the loop owns it. The correct response names no owner, says plainly that this is not
a loop request, and answers the question directly on its merits. That is why the row carries an
explicit no-owner marker rather than an empty cell: an empty owner cell would be indistinguishable from
a row that merely forgot to name one, and exhaustiveness proven by named-owner enumeration depends on
being able to tell those two apart.

## Sources

- This project's own routing decisions, recorded in the Phase 22 context: D-01 (exhaustiveness by
  named-owner enumeration with one declared no-owner terminal, never a catch-all), D-02 (the c1
  destination and the c4 ordered pair), D-03 (the single axis is the ask, so no routing branch keys on
  test state), and D-04 (test code is owned by the ask, not by the file's kind). Project decisions, not
  a book claim; the rows and the edge cases above are original wording.
- Robert C. Martin, the Three Laws of TDD -- Law 1 only. It is the one book-backed authority anything
  in this file leans on, and it is cited for the FIRST hop of case c4 and nothing else: it establishes
  that production code waits for a failing test, which is what puts the red step ahead of the green
  step for that case. The handoff framing that carries c4 on to its second hop is this project's own
  orchestration and claims no book backing. Unowned; high-confidence core only, no-oracle.
