# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [lz-tdd@0.0.2] - 2026-07-09

Adds the `lz-refactor` skill (`/lz-tdd:lz-refactor`) to the `lz-tdd` plugin: a
dual-mode refactoring coach and reference for the refactor step of red-green-refactor
TDD, covering Martin Fowler's mechanical refactorings and Joshua Kerievsky's
pattern-directed refactorings. The plugin manifest moves to version 0.0.2.

### Added

- **`lz-refactor` skill** (`/lz-tdd:lz-refactor`): dual-mode refactoring coach and
  reference. Auto-triggers at the refactor step to route a detected code smell to a
  candidate named refactoring, and answers refactoring, smell, pattern, and principle
  questions on demand. It coaches only -- it never edits code or runs tests.
- **Five reference catalogs**: 62 Fowler mechanical refactorings, 27 Kerievsky
  pattern-directed refactorings, 23 Gang-of-Four patterns, 5 extra target patterns,
  and 19 functional de-patterning idioms, each bundled as its own reference file and
  linked (not inlined).
- **Unified smell taxonomy**: a single recognize-by-cue index mapping 28 code smells
  to their candidate named refactorings, used as the coach's routing table.
- **Coach decision procedure**: a step-by-step routine that classifies the request
  against the `lz-tpp` green-step seam, recognizes the smell, routes it to a named
  refactoring, preserves behavior in small tested steps, and weighs over- versus
  under-engineering, citing Fowler's refactoring principles.
- **Principle-backing references** (core-only): the high-confidence core of Beck's
  *Test-Driven Development by Example* and *Tidy First?* and Feathers's *Working
  Effectively with Legacy Code* -- distilled principles only, not a complete Beck or
  Feathers catalog.
- **Manifest and docs**: `lz-tdd` manifest bumped to 0.0.2 with a two-skill
  description and refactoring keywords; `README.md` documents `lz-refactor` alongside
  `lz-tpp`.

## [lz-tdd@0.0.1] - 2026-07-04

First public release of the `lz-engineering-claude-plugins` marketplace: the `lz-tdd`
plugin and its dual-mode `lz-tpp` skill (`/lz-tdd:lz-tpp`).

### Added

- **Marketplace**: public Claude Code marketplace `lz-engineering-claude-plugins`
  hosting the `lz-tdd` plugin via a relative `./plugins/lz-tdd` source; passes
  `claude plugin validate .` (plain and `--strict`).
- **`lz-tdd` plugin**: manifest at version 0.0.1, MIT-licensed, with an additive
  auto-discovery layout (adding a skill or plugin needs new directories only).
- **`lz-tpp` skill** (`/lz-tdd:lz-tpp`): dual-mode Transformation Priority Premise
  coach and reference. Auto-triggers as a TDD coach (7-step decision procedure with
  impasse/backtrack) and answers on demand as a reference.
- **Canonical TPP reference** (`references/transformations.md`): the verbatim, cited
  14-item FibTPP transformation-priority list, the 12-vs-14 resolution with
  provenance, the transformations-vs-refactorings distinction, and the NDC 2011 talk
  transcript reconciliation.
- **TypeScript guidance**: paired functional and imperative examples, a Fibonacci
  worked example applied test-by-test in monotonic priority order, and JS/TS
  TCO-safe recursion patterns (trampoline, generator-as-state-machine, CPS).
- **Distribution**: root `README.md` (install and usage) and an MIT `LICENSE`.

[lz-tdd@0.0.2]: https://github.com/LayZeeDK/lz-engineering-claude-plugins/releases/tag/lz-tdd%400.0.2
[lz-tdd@0.0.1]: https://github.com/LayZeeDK/lz-engineering-claude-plugins/releases/tag/lz-tdd%400.0.1
