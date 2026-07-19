# Seams and legacy code

Scope: the testing stance for legacy code that has no seams and no tests (Feathers) -- find a
seam where behavior can be altered without editing in place, pin current behavior with a
characterization test first, then drive new behavior test-first from there. Reached from the
testing-stance index when the detection signal is untested legacy code with no obvious place to
assert. This is the RED-step framing (write the pinning test); the refactor-step no-tests
techniques already live in the lz-refactor skill.

> No-oracle reference: high-confidence core only (no owned Feathers source to verify against).
> Original prose, no verbatim source prose or code (DST-04); technique NAMES are kept as plain
> facts. RED-step framing only -- the refactor-step technique bodies are cross-linked below, not
> copied.

## Seam: the point where a test can assert

- Technique: a seam is a place where behavior can be altered without editing the code in place --
  the substitution or observation point a test uses to feed inputs or sense outputs.
- When-to-use: when the unit is welded to a collaborator (a database, the clock, the network, a
  static or global) so there is no obvious spot to drive it or watch what it does.
- Distilled note: the red step for legacy code starts at the seam. Before you can assert anything,
  you need one place where the behavior under test becomes reachable from a test.

## Characterization test: pin current behavior

- Technique: a characterization test runs the code on a chosen input, records the value it actually
  produces today, and asserts exactly that -- turning the code's present behavior into a fixed point.
- When-to-use: before you change untested legacy whose full behavior you do not yet trust, so any
  change you later make shows up as a broken assertion.
- Assert rule (ASRT-02): pin the CURRENT behavior, correct or not, never the desired behavior. If
  the observed value looks wrong, still lock it in and note the suspected bug separately; the point
  is to make change detectable, not to fix it here.

## Sequencing: seam, then characterization, then the new red test

- Technique: find a seam, write a characterization test that pins current behavior through it, and
  only then write the red test that drives the new behavior you actually want.
- When-to-use: every red step against legacy code that arrives with no tests around it.
- Distilled note: the characterization test is the safety net that makes the new red test safe to
  chase. Skipping straight to the new behavior leaves you changing code with nothing watching it.

## Refactor-step techniques live in lz-refactor (cross-link, not copied)

This leaf is the RED-step framing only. The refactor-step moves that break dependencies and get
awkward legacy code under test -- the object / link / preprocessing seam taxonomy, the change
algorithm, Sprout and Wrap, Extract Interface, and Subclass and Override -- belong to the refactor
step and are documented once, in the lz-refactor skill. For those techniques, follow the cross-link
rather than duplicating them here: see
[refactoring-without-tests.md](../../../lz-refactor/references/refactoring-without-tests.md).

## Sources

- Michael Feathers, Working Effectively with Legacy Code -- seams and characterization tests as the
  RED-step framing for untested legacy: find a seam, pin current behavior, then drive new behavior.
  Unowned; high-confidence core only (no-oracle). Cross-linked to, not copied from, lz-refactor's
  Feathers reference.
