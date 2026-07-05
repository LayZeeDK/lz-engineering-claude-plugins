# Refactoring Principles (Fowler, Refactoring 2nd ed, Ch.2)

Reference for the principles that back the coach's recommendations. Coach mode cites a principle when
justifying a recommendation; reference mode explains one on demand. Distilled in original words; no
verbatim book prose (DST-04).

## What refactoring is

Refactoring (noun): reworking the internal structure of code without changing its observable
behavior, so the code reads more clearly for the next person and future edits take less effort.
Refactoring (verb): to improve that structure through a sequence of such small steps, each one
holding observable behavior fixed. Behavior preservation is what separates refactoring from other
restructuring: if observable behavior changes, the edit is some other kind of change, not
refactoring.

## The two hats

Development alternates between two hats, worn one at a time: adding function (new capability -- new
tests pass, behavior grows) and refactoring (structure only -- no new tests, no behavior change).
Know which hat you have on, and switch deliberately. This is the seam with lz-tpp: making a failing
test pass is the add-function hat (lz-tpp's transformation step); the refactor step is the
refactoring hat (this skill).

## Why refactor

- Improve the design against the entropy that accumulates as code changes.
- Make code easier to understand -- encode what you now know for the next reader.
- Help find bugs -- clarifying structure surfaces defects.
- Program faster -- a clean design compounds, speeding later change.

Refactoring is economic, not aesthetic: the aim is to go faster -- ship features and fix bugs sooner
-- not clean code for its own sake. In practice too LITTLE refactoring is far more common than too
much.

## When to refactor

Bad smells are the vocabulary for *when* -- they name what to look for -- so let informed judgment,
not a metric threshold, decide, and remember that knowing when to STOP matters as much as when to
start (see Limits and cautions). Refactor opportunistically, woven into everyday work, rather than as
a separate scheduled activity:

- **Rule of three** -- the third time you meet the same duplication, refactor it.
  See the [Duplicated Code](smells/duplicated-code.md) smell.
- **Preparatory** -- before adding a feature or fixing a bug, restructure so the change becomes easy
  ("make the change easy, then make the easy change"). Pick the seam via the `Use when` lines in the
  [catalog index](fowler-catalog/README.md).
- **Comprehension** -- as you come to understand code you are reading, fold that understanding back
  into it: [Rename Variable](fowler-catalog/rename-variable.md),
  [Extract Function](fowler-catalog/extract-function.md),
  [Extract Variable](fowler-catalog/extract-variable.md),
  [Decompose Conditional](fowler-catalog/decompose-conditional.md).
- **Litter-pickup** -- tidy small messes you pass through, as far as is cheap.

Planned, dedicated refactoring is the exception; prefer continuous, opportunistic cleanup.

## How to refactor safely

- Take the smallest steps that keep the code working; run the tests after each step.
- Commit after each green run, so there is always a known-good state to return to.
- On a failure you cannot immediately explain, revert to the last green commit and redo in smaller
  steps -- do not debug forward from a broken refactoring.
- Rest the loop on self-testing code: tests that check themselves and run fast enough to run
  constantly. Never refactor on a red suite -- get to green first.
- Prefer your IDE's automated refactoring for a move where one exists; a syntax-tree-based automated
  refactoring is safer than editing by hand.

## When not to refactor

- Code you do not need to modify or understand -- leave working code that you will not touch.
- When rewriting from scratch is cheaper than refactoring.

## Limits and cautions

**Serve delivery; know when to stop.** Refactor only in service of the work: stop when the next
refactoring stops paying for itself, and prefer small, frequently integrated steps over big-bang
structural moves on long-lived branches.

**Safe refactoring rests on tests -- both ways.** With a reliable test suite you can restructure
freely, because the tests catch any behavior you change by accident. The absence of tests is itself
an obstacle: establish characterization tests first to pin current behavior -- missing tests are a
precondition to satisfy, not a reason never to refactor (routes to the refactoring-without-tests
reference, wired in Phase 9).

**Changes you cannot make atomically need parallel change, not the normal loop.** When a refactoring
touches something whose consumers you cannot update in the same step -- a published or consumed API,
or persisted data / a schema -- passing unit tests do NOT prove it safe. Use parallel change
(expand-contract): add the new form, migrate the consumers, then remove the old form. Keeping your
published surface small lets you refactor freely behind it. (Per-refactoring migration mechanics live
on the affected catalog leaves, chiefly Change Function Declaration.)

## Architecture, YAGNI, and evolutionary design

Continuous refactoring enables evolutionary design: build for today's needs and reshape as tomorrow's
arrive, instead of speculatively generalizing up front (YAGNI). Preparatory refactoring is how you
add flexibility at the moment a real need appears, rather than guessing at it early.

## Refactoring and performance

Refactoring and performance optimization are the same kind of code manipulation with different aims
-- clarity versus speed. Prefer readable code first, then optimize with measurement: clear structure
makes performance work more targeted, not less; where a measured hot spot needs it, optimize that
spot with data -- do not obscure the whole codebase pre-emptively for speculative speed.

## Attribution

Refactoring's practice grew from the Smalltalk community (Ward Cunningham, Kent Beck) and Bill
Opdyke's thesis, and was brought to a wide audience by Martin Fowler; the two-hats framing is Kent
Beck's. Many catalog refactorings are automated by modern IDEs. (Context only; not a coach decision.)
