# lz-engineering-claude-plugins

Engineering-focused plugins for Claude Code. The first plugin, `lz-tdd`, bundles three
test-driven-development skills that together complete the red-green-refactor loop:
`lz-red` coaches the red step -- choosing and writing the next failing unit test --
`lz-tpp` coaches the green step with Robert C. Martin's Transformation Priority Premise
(TPP), and `lz-refactor` coaches the refactor step with Martin Fowler's and Joshua
Kerievsky's refactorings. Each skill is both an auto-triggering coach and an on-demand
reference.

## What this is

This repository is a Claude Code plugin marketplace:

- **Marketplace:** `lz-engineering-claude-plugins` (this repo)
- **Plugin:** `lz-tdd` -- a plugin for test-driven-development skills
- **Skill:** `lz-red` -- invoked as `/lz-tdd:lz-red`
- **Skill:** `lz-tpp` -- invoked as `/lz-tdd:lz-tpp`
- **Skill:** `lz-refactor` -- invoked as `/lz-tdd:lz-refactor`

The layout is extensible: a new skill under `lz-tdd` is auto-discovered from its
`skills/` directory with no manifest changes, and a new plugin is added by
registering an entry in `.claude-plugin/marketplace.json` -- neither requires
restructuring existing files.

## Installation

In Claude Code, add the marketplace and install the plugin:

```
/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins
/plugin install lz-tdd@lz-engineering-claude-plugins
```

## What lz-red does

`lz-red` helps you choose and write the next failing (red) unit test well during
red-green-refactor TDD -- which test to write next, how to shape it, and how to be sure
it fails for the right reason.

- **Coach (auto-triggering):** at the red step, when the question is which failing test
  to write next or how to shape it, it picks the next test, matches the testing stance
  already in use in your codebase, structures the test, and confirms it fails for the
  right reason. It coaches; it does not edit your code or run your tests.
- **Reference (on demand):** invoke `/lz-tdd:lz-red` to have it explain test selection,
  triangulation, test structure, naming, the testing stance, or a red-step anti-pattern.

## The red step

The red step is where you write a new failing unit test before the production code that
makes it pass. A good red test pins one behavior: start from the simplest or degenerate
case, grow the test list one small step at a time, and triangulate with a second
concrete example when you need to drive out the general case. Shape the test
arrange-act-assert (or given-when-then), assert the observable behavior rather than how
the code produces it, name it for the behavior it pins, and confirm it fails for the
right reason -- an assertion failure on that behavior, not a compile or setup error.
`lz-red` also matches the testing stance already present in your codebase instead of
imposing a single style.

Authoritative sources:

- Kent Beck, *Test-Driven Development by Example* (Addison-Wesley, 2003) --
  https://en.wikipedia.org/wiki/Test-driven_development
- Robert C. Martin, The Three Laws of TDD --
  https://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html
- Sandi Metz, The Magic Tricks of Testing -- https://sandimetz.com
- Michael Feathers, characterization tests for legacy code (*Working Effectively with
  Legacy Code*) -- https://en.wikipedia.org/wiki/Characterization_test

The reference material is bundled as files, not inlined here. See
`plugins/lz-tdd/skills/lz-red/references/` for test-selection, test-structure and
assertion, naming, anti-pattern, and Vitest/TypeScript mechanics references, plus an
adaptive testing-stance router with three leaves (functional core / message matrix /
seams and legacy).

## What lz-tpp does

`lz-tpp` helps you keep an implementation at the simplest transformation that
passes the current failing test during red-green-refactor TDD.

- **Coach (auto-triggering):** when a failing test and the current code are
  present, it recommends the next named code transformation by TPP priority --
  the simplest change that makes the test pass -- with impasse and backtracking
  guidance. It coaches; it does not edit your code or run your tests.
- **Reference (on demand):** invoke `/lz-tdd:lz-tpp` to have it explain the
  transformations and their priority ordering.

## Transformation Priority Premise

The Transformation Priority Premise (TPP), described by Robert C. Martin, is an
ordered list of small "transformations" -- for example `({} -> nil)`,
`(constant -> scalar)`, `(statement -> statements)` -- applied simplest-first as
you make each failing test pass. Preferring higher-priority (simpler)
transformations keeps the code from taking premature complexity leaps and helps
escape local maxima where a test would otherwise force a large jump. TPP is a
provisional heuristic, not a rigid law.

Authoritative sources:

- The Transformation Priority Premise --
  https://blog.cleancoder.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html
- Fib. The T-P Premise. --
  https://blog.cleancoder.com/uncle-bob/2013/05/27/FibTPP.html
- Robert C Martin -- The Transformation Priority Premise, NDC 2011 --
  https://youtu.be/B93QezwTQpI

For the canonical transformation list and ordering rationale, see
`plugins/lz-tdd/skills/lz-tpp/references/transformations.md`.

## What lz-refactor does

`lz-refactor` helps you pick the next named refactoring for a code smell once the
tests are green, drawing on Martin Fowler's mechanical refactorings and Joshua
Kerievsky's pattern-directed refactorings.

- **Coach (auto-triggering):** when the tests are green and the code has a smell,
  it names the smell, routes it to a candidate named refactoring, and walks you
  through the smallest behavior-preserving steps. It coaches; it does not edit your
  code or run your tests.
- **Reference (on demand):** invoke `/lz-tdd:lz-refactor` to have it explain a
  refactoring, a code smell, a design pattern, or a refactoring principle.

## Refactoring

Refactoring is changing the internal structure of code without changing its
observable behavior, applied in small steps that keep the tests green. In the
refactor step you name the smell first, then apply the smallest refactoring that
removes it -- extracting a function, replacing a conditional with polymorphism, or
moving behavior toward or away from a design pattern -- rerunning the tests after
each step. `lz-refactor` covers both Fowler's mechanical refactorings and
Kerievsky's pattern-directed refactorings, and it will refactor a pattern AWAY once
it stops earning its keep.

Authoritative sources:

- Martin Fowler, *Refactoring: Improving the Design of Existing Code*, 2nd edition
  (Addison-Wesley, 2018) -- https://martinfowler.com/books/refactoring.html
- Joshua Kerievsky, *Refactoring to Patterns* (Addison-Wesley, 2004) --
  https://industriallogic.com/xp/refactoring/
- Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides, *Design Patterns:
  Elements of Reusable Object-Oriented Software* (Addison-Wesley, 1994) --
  https://en.wikipedia.org/wiki/Design_Patterns

The catalogs are bundled as reference files, not inlined here. See
`plugins/lz-tdd/skills/lz-refactor/references/` for 62 Fowler refactorings, 27
Kerievsky pattern-directed refactorings, 23 Gang-of-Four patterns plus 5 extra
patterns, 19 functional de-patterning idioms, and a unified taxonomy of 28 code
smells.

## License

MIT -- see [LICENSE](LICENSE). Contact: larsbrinknielsen@gmail.com
