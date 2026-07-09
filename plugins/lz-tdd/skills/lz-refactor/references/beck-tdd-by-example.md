# Test-Driven Development (Beck, TDD by Example)

Scope: the core of the test-first loop that lz-refactor sits inside, distilled from Beck's Test-Driven
Development by Example. This reference exists so the coach can name the seam it shares with lz-tpp and
explain where the refactor step begins. The green step is lz-tpp's concern; the refactor step is this
skill's. See the two-hats framing in principles.md for the same boundary from Fowler's side.

> No-oracle reference: high-confidence CORE only (no owned book to verify against). Original prose, no
> verbatim Beck prose or code (DST-04). NAMES of techniques are kept verbatim as facts; every
> definition below is written in original words.

## The red-green-refactor cycle

The loop runs in three short beats, repeated once per small behavior:

- Red: write a small test for the next slice of behavior and watch it fail. A test that fails for the
  expected reason proves the test can detect the behavior before the code exists.
- Green: do the least work that turns the bar green, even if that work is embarrassingly crude. Speed
  to green matters more than elegance here; correctness of design is deferred to the third beat.
- Refactor: with the bar green and a safety net in place, improve the internal structure and remove
  the duplication the quick green step introduced, holding observable behavior fixed.

The discipline is that structure only ever changes while the bar is green, never while chasing a
failing test.

## The two rules

Beck compresses the practice into two rules, paraphrased here:

- Add production code only in response to a test that is currently failing. Let the failing test pull
  each new piece of behavior into existence.
- Once the bar is green, drive out duplication (including duplication between the test and the code
  it exercises) before writing the next test.

The second rule is where this skill lives: removing that duplication is a refactoring, done under a
green bar.

## Green-bar strategies

Beck names three ways to get from red to green. They belong to the green step (lz-tpp / TPP chooses
among them); the coach mentions them only to locate the seam. The NAMES are kept as facts; the
descriptions are original:

- Fake It: return a hard-coded constant that satisfies the failing test immediately, then generalize
  the constant into real logic as later tests demand it. It gets you to green in seconds so refactoring
  can start.
- Triangulate: when the right generalization is unclear, add a second and third example so that only
  the real abstraction fits all of them; let the extra cases pull the general solution out of you.
- Obvious Implementation: when the correct code is small and self-evident, just write it directly
  rather than faking or triangulating. Fall back to the slower strategies the moment "obvious" turns
  out to be wrong.

## The seam with lz-tpp

The red-green-refactor loop is the boundary this plugin is built around. Making a failing test pass
(picking and applying the next transformation by priority) is the green step, and that is lz-tpp's
job. Once the bar is green, choosing and applying the structure-improving move is the refactor step,
and that is this skill's job. The coach classifies every request against this line first: if a red
test must be made to pass, hand off to lz-tpp; if the tests are green and the code has a smell, stay
here.

## Sources

- Beck, Test-Driven Development by Example. Unowned; high-confidence core only, no-oracle. There is
  no owned copy to verify against, so correctness rests on tight core scope, skill-reviewer review, and
  DST-04 hygiene (original prose; only technique NAMES kept verbatim).
