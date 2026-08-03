# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [lz-tdd@0.0.3] - 2026-07-20

Adds the `lz-red` skill (`/lz-tdd:lz-red`) to the `lz-tdd` plugin: a dual-mode coach and
reference for the red step of red-green-refactor TDD, guiding which failing unit test to
write next and how to shape it so it fails for the right reason. With `lz-red` at the red
step, `lz-tpp` at the green step, and `lz-refactor` at the refactor step, the plugin now
spans the whole red-green-refactor loop. The plugin manifest moves to version 0.0.3.

### Added

- **`lz-red` skill** (`/lz-tdd:lz-red`): dual-mode red-step coach and reference.
  Auto-triggers when the question is which failing test to write next or how to shape it,
  and answers test-selection, structure, naming, and testing-stance questions on demand.
  It coaches only -- it never edits code or runs tests.
- **RED decision procedure on the Three Laws of TDD spine**: a step-by-step routine that
  classifies the request against the `lz-tpp` and `lz-refactor` seams, chooses the next
  test (running test list, one small step, degenerate starter case, triangulation),
  structures it, and confirms it fails for the right reason.
- **Adaptive testing-stance router**: matches the codebase's existing test idiom and
  routes by structural control and seam availability to a functional-core, message-matrix,
  or seams-and-legacy leaf, with a natural-language override and "listen to the tests" as
  the meta-rule.
- **TypeScript and Vitest RED mechanics**: red-step guidance for Vitest with TypeScript --
  the test list, triangulation, type-level assertions, and confirming an assertion failure
  rather than a compile or setup error -- with `tsc --strict`-clean examples.
- **`lz-tpp` seam**: the red step hands off to `lz-tpp` at the green step (Law 3), and
  `lz-tpp` gained a reverse pointer back to `lz-red` so the coach classifies the step
  before acting.
- **Anti-pattern and Test Desiderata references**: the over-mocking and test-per-class
  anti-pattern and a Test Desiderata tradeoff lens, each bundled as a reference file and
  linked, not inlined.
- **Manifest and docs**: `lz-tdd` manifest bumped to 0.0.3 with a three-skill description
  and RED-phase keywords; `README.md` documents `lz-red` alongside `lz-tpp` and
  `lz-refactor`.

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

[lz-tdd@0.0.3]: https://github.com/LayZeeDK/lz-engineering-claude-plugins/releases/tag/lz-tdd%400.0.3
[lz-tdd@0.0.2]: https://github.com/LayZeeDK/lz-engineering-claude-plugins/releases/tag/lz-tdd%400.0.2
[lz-tdd@0.0.1]: https://github.com/LayZeeDK/lz-engineering-claude-plugins/releases/tag/lz-tdd%400.0.1
