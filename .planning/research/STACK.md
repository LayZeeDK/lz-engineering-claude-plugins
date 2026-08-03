# Stack Research

**Domain:** RED-phase (failing-unit-test) coaching skill -- TypeScript + Vitest DEMONSTRATION stack for `lz-red`
**Researched:** 2026-07-18
**Confidence:** HIGH

> **Read this first -- what this stack IS and IS NOT.**
> The `lz-red` skill itself is **Markdown-only** (SKILL.md + `references/`, progressive
> disclosure), exactly like its siblings `lz-tpp` and `lz-refactor`. It adds **NO build
> or runtime dependencies to this repo / plugin**. The versions and APIs below are the
> **DEMONSTRATION stack** -- the language + test framework the skill's EXAMPLES are written
> in and validated against (`tsc --strict`-clean). Do NOT add `vitest`, `typescript`,
> `fast-check`, etc. to `plugins/lz-tdd`'s manifest or any shipped `package.json`. If
> example validation is wanted in CI, that belongs in a **dev-only** validation workspace
> (mirroring the existing eval-workspace pattern), never as a plugin dependency. Consumers
> of the skill bring their own Vitest setup.

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| TypeScript | 7.0.2 (latest GA; native port) | Language for all examples; `--strict` type gate | Locked milestone decision (TS + Vitest). Examples use only stable strict-mode syntax, so they are effectively version-agnostic across the 5.x -> 6.x-beta -> 7.x line. Pin whatever the reader's repo uses; the skill states "tsc --strict-clean", not a version. |
| Vitest | 4.1.10 | Unit test runner + assertion + doubles + type-test + watch loop, all in one dependency | The chosen runner (milestone decision). One install gives the entire RED surface: `describe/it/test`, `expect` (Jest-compatible + chai `expect`), `vi.*` doubles, `expectTypeOf`/`assertType` (bundled), and the watch-mode feedback loop. No separate assertion/mock/type-test packages needed. |
| Node.js | ^20 \|\| ^22 \|\| >=24 | Runtime Vitest 4 executes on | Vitest 4 `engines` requires this. Not a code concern for the skill, but the demo/validation environment must satisfy it. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| fast-check | 4.9.0 | Property-based testing -- state a property (invariant) that must hold across generated inputs | For the "property-based RED" idiom: when a single example under-specifies behavior and you want to assert an invariant instead of enumerating `test.each` cases. Use vanilla inside a normal Vitest `it`: `fc.assert(fc.property(...))`. No Vitest-specific binding required -- works everywhere, so it is the lazy default. |
| @fast-check/vitest | 0.4.1 (peer: `vitest ^4.1.0`) | Ergonomic `test.prop([...])` / `it.prop([...])` bindings that fold fast-check into Vitest's test API | OPTIONAL sugar over vanilla fast-check. Show it as the "nicer syntax" alternative once the vanilla form is understood; skip it if you want one fewer moving part in an example. |
| expect-type | 1.4.0 | The type-assertion engine behind `expectTypeOf` | **Already bundled inside Vitest -- do NOT install separately.** Listed only so nobody adds it as a redundant dep. Import `expectTypeOf` from `vitest`, not from `expect-type`. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `vitest` (no args) | The RED feedback loop | Defaults to **watch mode in a dev environment** and **run mode in CI** (when `process.env.CI` is set), automatically. This IS the red-green-refactor loop: save a failing test, see red instantly, make it green. |
| `vitest run` | One-shot, non-watch run | For CI / a single pass. The form to use when validating example files in a script. |
| `vitest --typecheck` | Enables type-level tests | Required to make `expectTypeOf`/`assertType` failures surface. Type tests live in `*.test-d.ts` files by default (configurable via `typecheck.include`). Without `--typecheck`, type assertions are parsed but not run as tests. |
| `tsc --noEmit --strict` | Independent strict-mode gate for every example | The authoritative "examples compile clean" check (matches how lz-tpp/lz-refactor samples were validated). LSP diagnostics are not authoritative -- run the compiler. |

## RED-relevant API surface (each API -> its RED-phase concept)

This is the load-bearing deliverable: every listed API mapped to a concrete RED use.

| API | RED-phase concept | One-line use |
|-----|-------------------|--------------|
| `describe` / `it` / `test` | Structure the test -- AAA / Given-When-Then; one concept per test | `describe` names the unit/context; `it`/`test` states ONE behavior. `it` and `test` are aliases -- pick one house style. |
| `expect(x).toEqual(y)` | Assert observable VALUE/state behavior (evident data) | Deep structural equality -- the default for asserting a returned value or object shape. |
| `expect(x).toBe(y)` | Assert identity / primitive equality | For primitives and same-reference checks; not for deep objects. |
| `expect(fn).toThrow(...)` | RED for the error path -- error IS the specified behavior | Assert that calling `fn` throws (optionally a message/type). The failing-first form when the behavior under test is a rejection of bad input. |
| `await expect(promise).rejects.toThrow(...)` / `.resolves.toEqual(...)` | Async RED | State the expected async outcome; `rejects`/`resolves` unwrap the promise so the assertion reads as behavior, not plumbing. Always `await`. |
| `expect.assertions(n)` / `expect.hasAssertions()` | "Fail for the right reason" guard | Guarantees the intended assertions actually executed (critical in async/callback tests) -- stops a test that silently passes because its assertion path was skipped. |
| `it.todo(...)` / `test.todo(...)` | Kent Beck's TEST LIST -- the RED backlog | Enumerate not-yet-written tests as todos; they report as pending, not passing. Pick the next todo to turn red. This is the direct Vitest expression of "write a list of the tests you know you'll need." |
| `test.each([...])` / `it.each([...])` | Triangulation / parameterized cases | Add input->expected rows to force generalization (Beck's triangulation) without copy-pasting test bodies. Each row is its own RED case. |
| `expectTypeOf(x).toEqualTypeOf<T>()` / `.parameter(0).toExtend<T>()` | Type-level RED (compile-time red) | Write a type assertion that currently produces a type error, then evolve the type until it checks. Bundled in Vitest; needs `--typecheck`. |
| `assertType<T>(value)` + `// @ts-expect-error` | Type-level RED for the "this must NOT type-check" direction | `@ts-expect-error` itself goes red when the code STARTS compiling -- an inverted red that proves a type guard exists. |
| `vi.fn()` / `vi.spyOn()` / `vi.mock()` | Test doubles -- with RESTRAINT | Use for collaboration/command verification (Metz command/query matrix; London-school outgoing-command tests). `vi.fn` for a stub/spy, `vi.spyOn` to wrap a real method, `vi.mock` to replace a module. See anti-patterns -- over-mocking is the failure mode. |
| `vitest` watch mode | The RED feedback loop | Keep it running; a saved failing test shows red in milliseconds. The tight loop is what makes writing-the-test-first cheap. |
| `beforeEach` / `afterEach` | Arrange (the "A" in AAA) shared setup | Brief -- keep setup evident; over-shared setup hides the "evident data" a RED test should make obvious. |

## Installation

```bash
# NOTHING is installed into the plugin -- the skill ships Markdown only.
# The block below is the DEMO / example-validation environment ONLY
# (a dev-only workspace, never plugins/lz-tdd dependencies).

# Core demo stack
npm install -D typescript vitest

# Property-based testing (vanilla is enough; the vitest binding is optional sugar)
npm install -D fast-check
npm install -D @fast-check/vitest   # optional: test.prop / it.prop bindings

# expect-type is ALREADY bundled in vitest -- do NOT install it.
# tsd / standalone expect-type are only for non-Vitest projects (see Alternatives).
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vitest built-in `expectTypeOf` / `assertType` (`--typecheck`) | `tsd` 0.33.0 | Only when the project has NO Vitest and wants a standalone `*.test-d.ts` type-assertion CLI. Redundant here -- Vitest already ships type testing, so a Vitest example using `tsd` would add a dep for nothing. |
| Vitest built-in type testing | `expect-type` 1.4.0 standalone | Only for non-Vitest test setups; it is the same engine Vitest already bundles, so installing it alongside Vitest is pure duplication. |
| Vanilla `fc.assert(fc.property(...))` inside `it` | `@fast-check/vitest` `test.prop` | When you want the terser property-binding syntax and are already on Vitest 4.1+. It is genuinely nicer, just one more dep and one more concept for an example to carry. |
| Vitest as runner | Jest / node:test | Milestone decision locks Vitest. Jest would need `ts-jest`/`babel-jest` transform config and has no first-party type testing; node:test lacks the integrated `expectTypeOf`/`vi.*`/watch ergonomics. No reason to show either. |
| `it.each` / `test.each` for triangulation | Hand-rolled `for` loop over cases | Never in examples -- a loop of `it()` calls or a single `it` looping assertions muddies which case is red. `each` keeps each case a discrete test. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| A separate assertion library (chai, should.js, expect.js, unexpected, jest-extended) | Vitest bundles a Jest-compatible `expect` AND a chai-style `expect`; a bolt-on assertion lib adds a dependency and a second matcher dialect to an example that needs neither. | Vitest's built-in `expect`. |
| Snapshot-everything (`toMatchSnapshot` as the default assertion) | A snapshot captures current output; it does not STATE intended behavior, so it cannot express a meaningful RED. A first snapshot "passes" by definition -- there is no red to make green. | Explicit `toEqual` / `toThrow` with evident expected data. Reserve `toMatchInlineSnapshot` for genuinely large stable structures, sparingly. |
| Over-mocking -- `vi.mock` / `vi.fn` on everything, a double per collaborator, test-per-class | Ian Cooper's warning: mocking implementation detail couples tests to structure and makes them assert "was this method called" instead of observable behavior; the RED test then fails on refactors that preserve behavior. | Doubles ONLY at real seams (I/O, time, network, non-deterministic collaborators). Prefer testing observable behavior of the unit; verify outgoing COMMANDS, not internal queries (Metz matrix). |
| `it.fails` / `test.fails` to represent RED | `fails` asserts a test is EXPECTED to fail and passes when it does -- it inverts red/green and is for known-broken cases, not the RED step. | A normal `it` that is currently red because the behavior is unimplemented. |
| `ts-jest`, `babel-jest`, `@swc/jest` transforms | Jest-era transform plumbing; irrelevant on Vitest (esbuild/Vite native) and would confuse a TS + Vitest example. | Nothing -- Vitest runs TS out of the box. |
| jsdom / happy-dom / @testing-library in examples | This is UNIT RED for logic; a DOM environment is out of scope and adds noise/deps. | Plain functions/values in the Node environment; no test DOM. |

## Stack Patterns by Variant

**If the behavior under test is a plain value/computation (the default RED):**
- `describe` the unit, one `it` per behavior, `expect(result).toEqual(expected)` with evident data.
- Because this is the simplest red-for-the-right-reason and hands off cleanly to `lz-tpp` at green.

**If the behavior is asynchronous:**
- `await expect(promise).rejects.toThrow(...)` or `.resolves.toEqual(...)`, plus `expect.assertions(n)` when the assertion sits inside a callback/branch.
- Because async tests silently pass when the assertion path is skipped -- `expect.assertions` makes "fail for the right reason" enforceable.

**If a single example under-specifies behavior:**
- Triangulate with `it.each([...])`; escalate to `fast-check` (`fc.assert(fc.property(...))`) when you want to assert an invariant over many generated inputs rather than list rows.
- Because `each` forces generalization discretely and property tests catch the cases you would not enumerate.

**If the "behavior" is a type contract:**
- `expectTypeOf<T>()` / `assertType` + `// @ts-expect-error`, in a `*.test-d.ts` file, run with `vitest --typecheck`.
- Because a compile-time red (a type that does not yet check, or code that must not compile) is a legitimate RED that `lz-tpp` then satisfies at the type level.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| vitest@4.1.10 | node ^20 \|\| ^22 \|\| >=24 | Hard `engines` requirement for the demo/validation env. |
| vitest@4.1.10 | vite ^6 \|\| ^7 \|\| ^8 (peer, bundled) | Vitest ships its own Vite; no separate Vite config needed for pure unit tests. |
| @fast-check/vitest@0.4.1 | vitest ^4.1.0 | Peer satisfied by 4.1.10. Only needed if you use `test.prop`/`it.prop`. |
| expectTypeOf (vitest) | expect-type ^1.x | Bundled -- never install `expect-type` alongside Vitest. |
| TypeScript 5.x / 6.0-beta / 7.0.2 | all example code | Examples use only stable strict-mode syntax; they compile clean on any of these. TS 6.0 is currently `beta`, 7.0.2 is `latest` (native port), 7.1 is `next`. State "tsc --strict-clean" rather than pinning a version in the skill. |

## Sources

- registry.npmjs.org (dist-tags + `latest` manifests, fetched 2026-07-18) -- HIGH. Verified versions: vitest 4.1.10 (V3 tag 3.2.7, beta 5.0.0-beta), typescript 7.0.2 latest / 6.0.0-beta / 7.1.0-dev next, fast-check 4.9.0 (legacy 2.15.1), @fast-check/vitest 0.4.1 (peer vitest ^4.1.0), tsd 0.33.0, expect-type 1.4.0. Also vitest engines (node ^20/^22/>=24) and vite peer (^6/^7/^8).
- https://vitest.dev/guide/testing-types (fetched 2026-07-18) -- HIGH. Confirmed `expectTypeOf`/`assertType` bundled in `vitest`, powered by expect-type, `*.test-d.ts` convention, `--typecheck` flag.
- https://vitest.dev/guide/features (fetched 2026-07-18) -- HIGH. Confirmed watch-mode-by-default / run-mode-in-CI behavior, `vitest run`/`vitest watch`, and presence of `.todo`, `.each`, `toEqual`, promise matchers.
- Prior-milestone knowledge (PROJECT.md) -- HIGH. Confirms Markdown-only skill shape and the tsc --strict-clean validation stance carried from lz-tpp/lz-refactor.

---
*Stack research for: lz-red RED-phase skill demonstration stack (TypeScript + Vitest)*
*Researched: 2026-07-18*
