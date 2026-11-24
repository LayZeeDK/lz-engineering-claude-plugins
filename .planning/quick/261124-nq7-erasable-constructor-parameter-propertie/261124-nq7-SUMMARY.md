---
phase: quick-261124-nq7
plan: 01
subsystem: lz-tdd skill references
tags: [typescript, erasable-syntax, regression-guard]
requires: []
provides:
  - check-erasable-ts.ts guard (exported findParameterProperties + CLI)
  - parameter-property-free TS examples in plugins/lz-tdd
affects: [plugins/lz-tdd/skills/lz-refactor/references, plugins/lz-tdd/skills/lz-red/references]
tech-stack:
  added: []
  patterns: [TypeScript run by Node.js type stripping, node:test beside the script]
key-files:
  created:
    - .claude/skills/lz-refactor-workspace/tools/check-erasable-ts.ts
    - .claude/skills/lz-refactor-workspace/tools/check-erasable-ts.test.ts
  modified:
    - 72 Markdown leaves under plugins/lz-tdd/skills (71 lz-refactor references, 1 lz-red reference)
decisions:
  - In derived classes the field assignment goes after super(...), since `this` is unavailable before it
  - Leaves written in a compact style (no blank lines between members, mostly kerievsky-catalog) keep that style; the others get a blank line after the field block
  - New fields go at the top of the class body, grouped with any existing field declarations
metrics:
  completed: 2026-11-24
  tasks: 3
  files: 74
status: complete
---

# Quick 261124-nq7 Plan 01: Erasable constructor parameter properties Summary

Rewrote 186 constructor parameter properties in 72 lz-tdd leaves as explicit field declarations plus `this.x = x` assignments, and added a fence-aware guard with 17 node:test cases that fails the build if the form comes back.

## Commits

| Order | SHA | Subject |
|-------|-----|---------|
| 1 | ee93548 | refactor(lz-tdd): declare fields explicitly in TS examples for erasable syntax |
| 2 | 6847f4c | test(lz-tdd): guard against constructor parameter properties in TS examples |

Both commits are green (rewrite first, guard second). Author and committer: the public gmail.

## Red evidence (Task 1)

- Tests before the module existed: `node --test check-erasable-ts.test.ts` exit 1 (module not found).
- Guard CLI on the unedited tree: exit 1, `check-erasable-ts: 186 hit(s)`, 171 distinct lines in 72 files.
- Against the triage numbers (104 single-line lines in 55 files plus 65 multi-line lines = 169 lines): the guard
  reports every one of the 169 triage lines, plus 2 real hits the triage regexes missed because they have a
  default or optional value (`remove-subclass.md:53` `private readonly admin: boolean = false`,
  `replace-subclass-with-delegate.md:63` `private readonly policy?: RankingPolicy`). No triage line was a false
  positive for the guard to miss; all 65 multi-line triage lines were constructor parameters.
- The hit count exceeds the line count because single-line constructors with two promoted parameters report once per parameter.
- Mutation check of the plan amendment: replacing the `=>`/`>=` exception with a no-op made the
  "keeps an arrow type inside a generic at depth 1" test fail (`Map<() => void, readonly string[]>`), then it
  was restored. The amendment's own `constructor(clock = () => 0, private x: T)` case is covered and passes, but on
  its own it cannot fail, because the depth clamp at 0 hides the bug; the generic case is the one that actually depends on the rule.

## Hit counts by folder (Task 2)

| After folder | Guard total |
|--------------|-------------|
| start | 186 |
| fowler-catalog | 101 |
| kerievsky-catalog | 54 |
| gof-catalog | 24 |
| functional, extra-patterns, lz-red | 0 |

## Red-green replay (Task 3)

`git show HEAD:plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/change-reference-to-value.md` (pre-edit
copy in the scratchpad), passed through the exported `findParameterProperties`: 6 hits (lines 31 x2, 35, 47 x2, 55).
The same leaf on the edited tree: 0 hits. CLI on the final tree: exit 0, `check-erasable-ts: 0 hit(s)`.

## Battery (final HEAD 6847f4c)

| Command | Exit |
|---------|------|
| check-catalog.mjs | 0 |
| check-kerievsky.mjs | 0 |
| check-gof.mjs | 0 |
| check-functional.mjs | 0 |
| check-extra-patterns.mjs | 0 |
| check-smells.mjs | 0 |
| check-crossrefs.mjs | 0 |
| check-backing.mjs | 0 |
| check-principles.mjs | 0 |
| check-hygiene.mjs | 0 |
| lz-red check-red-references.mjs | 0 |
| check-erasable-ts.ts | 0 |
| node --test check-erasable-ts.test.ts | 0 (17 pass) |
| claude plugin validate . | 0 |

No checker takes arguments. Email allowlist inversion: no email-shaped token in the plugins diff or in the two guard
files; `git config user.email` is the public gmail.

## Guard design

- Fences: opening ``` or ~~~ (any indent), info word `ts` or `typescript`, case-insensitive, trailing attributes allowed; closes on the same marker character at least as long, with no info string.
- Comments and string contents are replaced with spaces, so newlines and offsets stay put. `//` inside a string is not treated as a comment.
- `\bconstructor\s*\(` is scanned to its matching `)`, and the list is split on commas at depth 0 across `() [] {} <>`. A `>` right after `=` (`=>`, `>=`) does not close a bracket, and depth never goes below 0.
- A parameter is flagged when, after any decorators, its first token is public, private, protected, readonly or override followed by an identifier.

## Deviations from Plan

1. **[Rule 1 - Correctness] Derived-class assignment order.** The plan put the assignments first in the constructor body. In
   classes that call `super(...)` (pull-up-field, pull-up-constructor-body, decorator TracingHandler) `this` is not
   available before `super`, so the assignment comes after `super(...)`. In pull-up-constructor-body's Before block it
   comes after the duplicated `this.name`/`this.health` lines, so the duplicated setup still reads as one block. That block
   is what the refactoring moves.
2. **[Rule 2 - Test strength] Extra guard tests** beyond the plan's list: decorator-prefixed parameter, `override`,
   case-insensitive info strings, line numbers after a block comment, a generic `Map<string, number>` split, and the
   arrow-in-generic case that actually depends on the `=>` rule.
3. **Plan verify step not reproducible here:** the Task 3 chain asserts `.planning/config.json` is modified and unstaged.
   In this worktree config.json is unmodified (the modification lives in the main checkout). It was not touched or
   staged; the two `config.json` assertions apply to the main checkout, not this worktree.
4. Staging through `xargs git add` was denied by the auto-mode classifier. Every file was staged instead with
   literal-path `git add` calls (72 staged, 0 left unstaged, checked before the commit).

## Known Stubs

None.

## Self-Check: PASSED

- FOUND: .claude/skills/lz-refactor-workspace/tools/check-erasable-ts.ts
- FOUND: .claude/skills/lz-refactor-workspace/tools/check-erasable-ts.test.ts
- FOUND: ee93548, 6847f4c on worktree-agent-a21dd4d09fee9c670
