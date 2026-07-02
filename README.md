# lz-engineering-claude-plugins

Engineering-focused plugins for Claude Code. The first plugin, `lz-tdd`, ships
`lz-tpp` -- a test-driven-development coach and reference for Robert C. Martin's
Transformation Priority Premise (TPP).

## What this is

This repository is a Claude Code plugin marketplace:

- **Marketplace:** `lz-engineering-claude-plugins` (this repo)
- **Plugin:** `lz-tdd` -- a plugin for test-driven-development skills
- **Skill:** `lz-tpp` -- invoked as `/lz-tdd:lz-tpp`

The layout is extensible: additional skills and plugins are pure additions and
require no changes to existing files.

## Installation

In Claude Code, add the marketplace and install the plugin:

```
/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins
/plugin install lz-tdd@lz-engineering-claude-plugins
```

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

## License

MIT -- see [LICENSE](LICENSE). Contact: larsbrinknielsen@gmail.com
