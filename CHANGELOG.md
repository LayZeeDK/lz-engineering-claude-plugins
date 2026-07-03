# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-07-04

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

[0.0.1]: https://github.com/LayZeeDK/lz-engineering-claude-plugins/releases/tag/v0.0.1
