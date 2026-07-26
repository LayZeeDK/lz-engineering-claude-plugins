---
phase: quick-260726-uqn
plan: 01
type: execute
wave: 1
depends_on: []
autonomous: true
requirements: [EVL-03.3]
files_modified:
  - .claude/skills/lz-red-workspace/package.json
  - .claude/skills/lz-red-workspace/package-lock.json
  - .claude/skills/lz-red-workspace/grade-red.mjs
  - .claude/skills/lz-red-workspace/selfcheck-red.mjs
  - .claude/skills/lz-red-workspace/e2e-red-radix-ng/targets.json
  - .claude/skills/lz-red-workspace/fixtures/atc/
  - .claude/skills/lz-red-workspace/fixtures/canary-rdxf-template/
  - .claude/skills/lz-red-workspace/fixtures/canary-rdxf-append/
  - .claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md
  - .planning/phases/21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i/21-ATC-ADOPTION.md
  - .planning/HANDOFF.json
  - .planning/phases/21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i/.continue-here.md

must_haves:
  truths:
    - "`angular-typechecker@0.2.4` is a devDependency of `.claude/skills/lz-red-workspace` installed FROM NPM, and the installed CLI reproduces the measured radix baseline at the exact invocation the gate uses. No path anywhere depends on the sibling `angular-typechecker` checkout or its stale dist."
    - "A target selects its differential checker via `typecheck.checker`, DEFAULTING to `tsc`, so GRC (gilded-rose) and SRVC (srvx) behave byte-identically to before. Only RXF and RXL declare `atc`."
    - "An unknown, empty or non-string `checker`, a missing or malformed `tsconfig` on the atc path, and a `tsc` arg list declared alongside `checker: atc` each THROW before the grading worktree exists -- fail closed, never a silently REDUCED gate."
    - "atc is invoked as `-c <tsconfig> --format json` with `--format json` owned by the code rather than by config, and its JSON `diagnostics[]` are normalized into the SAME single-line diagnostic records the differential already consumes, so `classify()`, `isConfigLevelTscError()` and the multiset subtraction need NO per-checker branch downstream."
    - "The differential stays POSITION-INSENSITIVE on both checker paths: a multiset keyed on (file, code, message) with line/column stripped, `endLine`/`endColumn` deliberately discarded from the identity, and the RAW positioned line still recorded as the audit trail."
    - "Advisory A-1's two guards keep holding on BOTH paths: a typecheck that did not really run can no longer read as clean. On the atc path exit 2 (infrastructure-or-usage), unparseable stdout, an absent `diagnostics` key, and a non-zero exit with an EMPTY diagnostics array each throw; exit 0 clean is the only way to read zero."
    - "The vacuous-differential guard covers atc's OWN whole-program faults, which the TypeScript-code-gated `isConfigLevelTscError` cannot see: a FILE-LESS error-severity diagnostic in the baseline reads as config-level BY CONSTRUCTION and throws. Without it a references-only or empty project would emit one synthesized fault in BOTH passes, cancel to zero NEW errors, and report a differential that checked zero root names as clean."
    - "Three radix canaries prove the atc path DISCRIMINATES end to end: the existing `canary-rdxf-compile` still grades `compile_error`; a NEW template-broken canary grades `compile_error` on a diagnostic atc reports and tsc does not; and a NEW canary APPENDS to a file that already carries baseline diagnostics and still grades zero NEW errors."
    - "RXF's `compile_error` verdict STANDS. No matcher allowlist, no baseline-keyed noise rule, no target-specific tolerance was added; the accepted consequence is RECORDED as a residual instead."
    - "The RXF and RXL `typecheck_note` figures are the MEASURED atc baseline and per-pass timing, dated; no tsc-era figure survives in `targets.json`."
    - "`.planning/HANDOFF.json` and the phase `.continue-here.md` carry the CORRECTED root-cause mechanism, mark the `types`-array premise explicitly FALSIFIED, and no longer present the RXF verdict as an open question."
    - "A FULL `selfcheck-red.mjs` run exits 0 with ZERO skips in the radix block; it was backgrounded and waited for, never shortened to fit a timeout."
    - "All four borrowed repos end git-clean with one worktree each and correct pins; nothing was installed into any of them; `plugins/lz-tdd` has zero files in the task diff; zero metered spend."
  artifacts:
    - .claude/skills/lz-red-workspace/package.json
    - .claude/skills/lz-red-workspace/e2e-red-radix-ng/targets.json
    - "fixtures/atc/ -- the CAPTURED atc JSON payload the offline selfcheck asserts against"
    - "fixtures/canary-rdxf-template/ -- meta.json + diff.patch (atc-visible, tsc-invisible defect)"
    - "fixtures/canary-rdxf-append/ -- meta.json + diff.patch (append onto a file that already has diagnostics)"
    - .planning/phases/21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i/21-ATC-ADOPTION.md
  key_links:
    - "`target.typecheck.checker` -> `resolveTypecheck()` -> the composed arg list AND the checker id -> the single dispatch point that picks the binary and the parser. Two call sites, both inside `gradeRun`'s differential."
    - "atc JSON `diagnostics[]` -> the normalizer -> the same `path(line,col): error CODE: message` record shape -> `tscErrorIdentity()` -> `newTscErrorsOrThrow()`. One identity function, one subtraction, no checker branch past the normalizer."
    - "atc exit code + stdout -> `atcDiagnosticsOrThrow()` (guard and parse in ONE function, mirroring `tscLinesOrThrow`) so a later caller cannot reach the diagnostics without the check."
    - "resolved checker -> the config-level predicate `gradeRun` applies to the BASELINE. The tsc path keeps `isConfigLevelTscError` byte-unchanged; the atc path gets a predicate that requires a FILE, so no diagnostic code is ever enumerated and a future synthesized atc code is covered on arrival."
    - "`fixtures/canary-rdxf-append/diff.patch` -> `git apply` onto a spec that already carries baseline diagnostics -> the multiset subtraction -> `new_tsc_errors: 0`. The end-to-end proof of the append path the whole offline battery was blind to."
---

<objective>
Adopt `angular-typechecker` (atc) as the differential typechecker for the two radix-ng targets
(RXF + RXL) only, leaving GRC and SRVC on tsc with byte-identical behavior; then record the
Phase-21 JestMatchers research findings, the RXF verdict decision, and its accepted residual so no
future session re-inherits the falsified premise.

Purpose: tsc is STRUCTURALLY BLIND to Angular template diagnostics (measured: 0 against atc's 15 on
the same project). radix's own specs define inline misuse-host-component templates, so a produced
RXL test plausibly defines one too -- and a template-broken produced test currently passes tsc CLEAN
while still throwing an honest-looking assertion failure. That is the SAME false-pass class the
measured counterfactual proved the differential exists to close, and tsc cannot see it.

Output: a per-target checker selection in `grade-red.mjs` with fail-closed validation and an
atc JSON normalizer; three discriminating radix canaries including the first APPEND-onto-a-dirty-file
canary in the suite; re-measured target notes; and the durable record across the phase artifacts,
`HANDOFF.json`, `.continue-here.md` and the RUN-GATE residual list.

ZERO SPEND. No metered `claude -p`, no eval fan-out, no `run-e2e.mjs` outside `--dry-run`. The
~$39 four-cell round and the ~$1.10 `with_skill` pilot both remain user-gated and are NOT part of
this task.
</objective>

## Package Legitimacy Audit

Required before any package-manager install task. Verified against `registry.npmjs.org` this
session; no `[ASSUMED]` or `[SUS]` entry, so no blocking legitimacy checkpoint is required.

| Package | Version | Status | Evidence |
|---------|---------|--------|----------|
| `angular-typechecker` | 0.2.4 (`dist-tags.latest`) | VERIFIED | Published on npm; versions 0.0.1 through 0.2.4 present. Authored by the repo owner (`LayZeeDK/angular-typechecker`), so the publisher identity is first-party rather than inferred. Registry metadata read directly. |
| `nx`, `@nx/devkit` | `^23.0.0` / `23.0.1` (atc runtime deps) | VERIFIED | Nrwl's first-party monorepo toolchain; ubiquitous, non-typosquat, already the build system of the radix target itself. |
| `node-sarif-builder`, `tslib` | `^4.1.0` / `^2.3.0` (atc runtime deps) | VERIFIED | `tslib` is Microsoft's TypeScript runtime helper library. `node-sarif-builder` is the established SARIF emitter used for the `--format sarif` path this task does not use. |

Peer set atc declares: `@angular/compiler-cli ^22.0.0`, `typescript >=6.0.0 <6.1.0` (the workspace
already pins exactly `6.0.3`, satisfied), `@angular-devkit/architect`, `@angular-devkit/schematics
^22.0.0`, `rxjs`. Engines: `node ^22.22.3 || ^24.15.0 || ^26.0.0`.

Installs land ONLY in `.claude/skills/lz-red-workspace/node_modules`, which is gitignored while its
`package.json` and `package-lock.json` are tracked. Nothing is installed into any borrowed repo.

<execution_context>
@~/.claude/gsd-core/workflows/execute-plan.md
@~/.claude/gsd-core/templates/summary.md
</execution_context>

<context>
@.planning/PROJECT.md
@.planning/STATE.md
@.planning/HANDOFF.json
@CLAUDE.md
@AGENTS.md

@.claude/skills/lz-red-workspace/grade-red.mjs
@.claude/skills/lz-red-workspace/selfcheck-red.mjs
@.claude/skills/lz-red-workspace/e2e-red-radix-ng/targets.json
@.claude/skills/lz-red-workspace/e2e-red-srvx/targets.json
@.claude/skills/lz-red-workspace/e2e-red-gilded-rose/targets.json
@.claude/skills/lz-red-workspace/package.json
@.claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md
@.claude/skills/lz-red-workspace/fixtures/canary-rdxf-compile/diff.patch
</context>

## Measured facts this plan is built on -- cite, do not re-derive

Everything below was MEASURED this session. Do NOT plan or perform work that re-investigates it.

**Root cause of the RXF diagnostic** (`calendar.spec.ts(111,28): error TS2339: Property
'toHaveAttribute' does not exist on type 'JestMatchers<HTMLElement>'`): `@types/jest-axe/index.d.ts`
opens with a triple-slash `reference types="jest"` directive. That pulls in `@types/jest@30.0.0`,
present in radix's pnpm store as jest-axe's own dependency. `@types/jest` declares `expect` as
returning `JestMatchers<T>`, while `@testing-library/jest-dom/vitest` augments VITEST's `Assertion`
interface. The matchers land on a type nothing uses, so every jest-dom matcher call in that program
is a TS2339. Proven with `tsc --explainFiles`, which names the referencing file explicitly.
Corroborating: `test-setup.ts(29,1) TS2741`, because vitest's `describe.skip` is not assignable to
`@types/jest`'s `It` interface.

**FALSIFIED PREMISE that must be corrected in the record:** `HANDOFF.json`'s `next_action` and the
phase `.continue-here.md` both claim the cause is `packages/primitives/tsconfig.spec.json` setting a
`types` array that omits jest-dom, "so the TYPES never load". That is WRONG. jest-dom's types DO
load: `--explainFiles` shows `@testing-library/jest-dom/types/vitest.d.ts` in the program, imported
via `@testing-library/jest-dom/vitest` from `test-setup.ts`, which is in the config's `files` array.
A `types` array restricts AUTOMATIC `@types` inclusion; it does not block a triple-slash reference
inside an imported declaration file.

**The runner cannot fail on type errors at all.** Verified against the TAGGED Analog source at
v2.6.1: the vite plugin sets its tsconfig to the spec config when testing, but also defaults
`disableTypeChecking` to true and masks semantic diagnostics off. radix calls the plugin with no
options. That is why the RXF run produced a genuine assertion error despite 9 type errors in the
same file, and why NOTHING in the repo typechecks specs (no inferred nx typecheck target, no
typecheck target in the project config, no type-aware ESLint, CI runs test + build only).

**The differential typecheck is LOAD-BEARING** -- measured with the REAL exported `classify()` on
identical runner input, varying only `tscResult.newErrors`: 1 gives `compile_error` / pass false;
0 gives `genuinely_red` / pass TRUE. So `wrong_reason` does NOT cover the type-broken canary:
`canary-rdxf-compile`'s bad annotation evaporates at runtime, the query returns null, and the
assertion fails legitimately. This is why atc is being adopted rather than the typecheck dropped.

**atc A/B, SAME SESSION, identical tsconfig, cwd = primitives-pin** (cross-session timing
comparison is invalid on this project):

| | tsc 6.x | atc 0.2.3 (sibling dist) |
|---|---|---|
| wall clock per pass | 4.345 s | 9.567 s (~2.2x) |
| errors | 55 | 73 (+7 warnings, 80 diagnostics) |
| JestMatchers TS2339 | 8 | 8 (IDENTICAL) |
| Angular template diagnostics | 0 (structurally blind) | 15 (NG8113 x7, NG8007 x7, NG8022 x1) |
| output | text lines to parse | JSON records with file, line, column, endLine, endColumn, code, rawCode, severity, message |
| infra-vs-findings | hand-rolled `isConfigLevelTscError` | native: exit 0 clean / 1 verdict-fail / 2 infra-or-usage |

The 8 baseline JestMatchers errors are all `toHaveTextContent` in
`packages/primitives/calendar/__tests__/calendar.spec.ts` at lines 81, 82, 88, 89, 95, 96, 106, 110
-- the ONLY spec in the package using jest-dom matchers. atc's extra findings live in OTHER spec
files (alert-dialog, checkbox, dialog, drawer, menu, number-field, popover, preview-card, radio), so
for the differential they are pure absorbed baseline and cannot sink a produced test.

**atc CLI surface** (from a real `--help` run): `-c, --tsConfig <path>` repeatable and REQUIRED (one
solution config is reference-walked; two or more are union-checked); `--max-warnings <n>`;
`--fail-fast`; `--include-deps`; `--strict`; `--format <human|json|sarif>`; `--quiet`;
`--color`/`--no-color`; `-h`; `--version`. `-p` / `--project` are DELIBERATELY NOT registered -- do
not use them.

**Package entry points** (registry metadata for 0.2.4): `bin` maps both `angular-typechecker` and
`atc` to `src/cli/bin.js`; `exports` lists only `.` and `./package.json`, so
`angular-typechecker/package.json` IS resolvable and is the right way to locate the CLI.

**atc diagnostic-record shape, READ FROM THE 0.2.4 SOURCE** (`diagnostic-record.ts`,
`diagnostic-codes.ts`, `filter-diagnostics.ts` at the `release/0.2.4` merge). These four facts are
verified, not inferred, and two of them contradict an earlier draft of this plan:

- **`code` is ALREADY a fully prefixed label; `rawCode` is the bare number.** The record builder sets
  `code` from a helper that returns an Angular-prefixed label for a negative raw code, an
  atc-prefixed label for a raw code at or above 90000, and a TypeScript-prefixed label otherwise. It
  NEVER returns a bare number. So the normalizer uses `code` verbatim and must NOT add a prefix of
  its own -- doing so would double-prefix and break the existing identity and config-level matching.
- **atc synthesizes its OWN error-severity, FILE-LESS diagnostics for the config layer**, under a
  90000+ code space chosen deliberately outside both the TypeScript and the Angular code ranges: one
  for a references-only or empty project (zero root names) and one for a referenced project that was
  not found. Both are built through a single file-less-error factory with the diagnostic category set
  to Error and the file left undefined. Their labels therefore begin with the atc prefix and NEVER
  with the TypeScript one, which is exactly why the existing `isConfigLevelTscError` -- gated on a
  TypeScript-code pattern -- returns false for them. This is the B2 hazard and the reason for the
  file-less guard below.
- **A file-less diagnostic carries all-null positions**, because the position helper short-circuits
  to null on all four axes when the file or the start offset is undefined. So the normalizer must not
  emit a parenthesized position for such a record.
- **atc's own project-boundary filter treats file-less as load-bearing and NEVER suppresses it**,
  documenting the class as "config errors, the zero-rootNames guard". It also treats a file that is
  PRESENT but whose file name is the empty string as the same fail-safe case. So "file-less" means
  either no file or an empty file name, and atc's own design already equates file-less with a
  whole-program fault -- which is the warrant for the guard requiring a file rather than enumerating
  codes.
- The record's file field is produced by a helper that already relativizes against a base and
  normalizes separators, and its comment states the production adapters always pass a base. So the
  CLI most likely already emits repo-relative slash-normalized paths; confirm that against the
  captured payload rather than adding a relativization step that may be redundant.

## Locked owner decisions -- do NOT plan alternatives

- **RXF's `compile_error` verdict STANDS.** No matcher allowlist, no baseline-keyed noise rule, no
  target-specific tolerance, nothing that flips RXF to `genuinely_red`. The accepted consequence --
  that jest-dom matcher choice partly decides RXF grading -- is RECORDED as a residual, not
  engineered away.
- **The differential typecheck is KEPT.**
- **atc is adopted for the radix targets ONLY.** GRC and SRVC stay on tsc and must remain
  byte-identical in behavior: they are non-Angular and atc loads `@angular/compiler-cli`.
- **Do NOT modify any borrowed repo to make the type environment healthy.** No editing radix's
  tsconfig, package.json or test-setup.

<tasks>

<task type="auto">
  <name>Task 1: Install atc from npm, MEASURE the real invocation, and wire per-target checker selection into the differential</name>
  <files>
    .claude/skills/lz-red-workspace/package.json,
    .claude/skills/lz-red-workspace/package-lock.json,
    .claude/skills/lz-red-workspace/grade-red.mjs,
    .claude/skills/lz-red-workspace/fixtures/atc/,
    .claude/skills/lz-red-workspace/e2e-red-radix-ng/targets.json
  </files>
  <action>
MEASURE FIRST, WIRE SECOND. Do not write any figure or JSON field name into code or prose before a
command has printed it.

STEP 1 -- install. Add `angular-typechecker` at exact version `0.2.4` as a devDependency of
`.claude/skills/lz-red-workspace` using npm, from the public registry. Both `package.json` and
`package-lock.json` there are TRACKED and must be committed; `node_modules` is gitignored. Do NOT
add any dependency on the sibling `angular-typechecker` checkout or its built dist -- that dist is
stale and reports 0.2.3. If npm reports a peer-resolution conflict, record the exact resolution you
used in the task notes rather than silently reaching for a force flag; the workspace's existing
exact `typescript` pin already satisfies atc's TypeScript peer range, and npm auto-installs the
remaining peers. Before concluding anything from a failure, check the local node version against
atc's declared engines range.

STEP 2 -- measure the invocation and CAPTURE the JSON shape. Locate the CLI the way the gate will:
resolve `angular-typechecker/package.json` through a `createRequire` over this module's URL, read
its `bin.atc` entry, and join it to the package directory. Fail closed with a message naming the
workspace install step if either the package or the bin entry is absent -- a fresh worktree has the
manifests but no installed deps, and that must produce an actionable error rather than a fallthrough
to a global binary. Then run that CLI ONCE against the radix pin with the exact argument list the
gate will use -- the tsConfig flag pointing at the primitives spec config, plus JSON format -- from
the target repo as the working directory, READ-ONLY. Record: the exit code, the wall-clock seconds
for the single pass, the total diagnostic count, the error-severity count, the warning-severity
count, and how many are the calendar spec's jest-dom TS2339 lines. Confirm the npm-installed CLI
REPRODUCES the sibling-dist A/B numbers above; if it does not, that is a finding to record in Task 3,
not something to paper over. Save the raw JSON payload -- or, if it is large, a faithful excerpt
preserving every key and at least one diagnostic of each observed severity plus one TS-coded and one
NG-coded record -- under a new `fixtures/atc/` directory as the offline selfcheck's input, with a
sibling note stating exactly which command produced it and when.

Confirm from the CAPTURED payload -- not from this prose and not from memory -- whether `code` needs
any prefixing at all before writing normalizer logic, and whether `file` arrives absolute or
repo-relative. The source facts above say `code` is already prefixed and `file` is already
relativized, so the expected answer is "no transformation needed"; verify it rather than assume it in
either direction, since a wrong call here double-prefixes or double-relativizes silently.

ALSO MEASURE the guard's false-positive direction, using the same discipline the tsc path's target
note already records: run every diagnostic of the healthy measured baseline through the REAL
file-less predicate from step 5 and assert that ZERO of them is file-less. If a file-less
error-severity diagnostic DOES appear in the healthy baseline, the guard would hard-abort every grade
on this target -- stop and record that as a measured finding in Task 3 rather than weakening the
guard on a guess.

ALSO CAPTURE the config-fault payload the guard exists to catch, so the fixture is measured rather
than fabricated: point the atc CLI at a throwaway references-only or otherwise empty tsconfig created
OUTSIDE every borrowed repo (the workspace or the session scratchpad), and save its JSON alongside
the healthy payload under `fixtures/atc/`. Record its exit code and the label of the synthesized
diagnostic. This is the input for the vacuous-differential assertion in step 7.

STEP 3 -- checker selection in `resolveTypecheck`. Extend the exported `resolveTypecheck(target)` to
also resolve a checker id from `target.typecheck.checker`, returning it alongside the existing args
and prebuild. An ABSENT field resolves to the tsc default, which is what keeps GRC and SRVC
byte-identical. Everything else fails closed BEFORE the grading worktree exists, matching the
existing convention in this file where an empty entry falls back but a malformed one throws: a
non-string, an empty or whitespace-only string, and any value outside the known checker set each
throw with a message naming the target id and the offending value. The asymmetry with the args
fallback is deliberate and must be stated in the comment -- an empty args array falls back because
the DEFAULT is the stronger gate, whereas an unknown checker has no knowable stronger fallback, so
guessing could silently REDUCE the differential.

On the atc path the target declares `typecheck.tsconfig` instead of `typecheck.args`: a
repo-relative path string, REQUIRED, validated with the same shape rules
`resolveToolchainPaths` already applies (non-empty string, not absolute, no drive prefix, no parent
segment). `resolveTypecheck` then COMPOSES the atc argument list itself -- the tsConfig flag with
that path, plus the JSON format flag -- so the format flag is owned by the code and cannot be typed
away in config. Throw if a target declares `typecheck.args` alongside the atc checker: a tsc arg
list on the atc path would be silently ignored, which is the same class of invisible config fault
the surrounding guards exist to catch. Do NOT pass atc's own strict flag: the project's tsconfig
already sets strict, the A/B was measured WITHOUT that flag, and adding an unmeasured flag would
move the baseline.

STEP 4 -- the atc runner and normalizer. Add ONE function that spawns the atc CLI and returns
normalized diagnostic records, with its guard and its parse in the SAME function so a later caller
cannot reach the diagnostics without the check -- the same structural reason the existing
line-parser and the existing subtraction each own their guard. It mirrors the existing tsc
line-parser's contract and extends it with atc's native exit-code taxonomy:

- exit 2 means infrastructure-or-usage: ALWAYS throw, never read as clean. This is the atc-path
  equivalent of the config-level guard's purpose.
- stdout that does not parse as JSON: throw.
- parsed JSON with no diagnostics array: throw.
- a non-zero exit with an EMPTY diagnostics array: throw -- nothing was checked, and the
  subtraction would report a type-broken produced test as clean. This is the exact shape correlation
  the tsc path already refuses; keep the existing four-way reasoning table in the comment, adapted.
- exit 0 with diagnostics present: ALLOWED, for the same fail-safe reason the tsc path allows it --
  an extra diagnostic either appears in both passes and cancels, or lands only in the WITH pass and
  fails the produced test, so neither direction can manufacture a false pass.
- a spawn error or a null status: throw, same as the tsc path.

The normalizer turns each diagnostic into the SAME single-line record shape the tsc path already
produces -- the file path, its position in parentheses, the literal error keyword, the code, and the
message -- so the existing identity function, the existing config-level check, the existing multiset
subtraction and `classify()` all keep working with NO per-checker branch downstream. Use the record's
`code` field DIRECTLY; per the verified source facts above it is already a fully prefixed label, so
add no prefix of your own. Do not use `rawCode` for the record text -- that is the bare number, and
prefixing it by hand is how a double-prefixed label gets built. If the captured payload contradicts
this, follow the payload and say so in the comment.

Keep only error-severity diagnostics; a diagnostic whose severity is outside the observed set throws
rather than being dropped, because silently discarding a record REDUCES the gate. Collapse any
embedded newline in a message to a single-line separator: template diagnostics are multi-line, and
both passes collapse identically so the identity is unaffected -- this is a record shape decision
only. Only relativize the file path if the captured payload shows it arriving absolute.

A FILE-LESS record -- no file, or a file whose name is the empty string -- is emitted with NO
parenthesized position and NO file prefix at all, just the error keyword, the code and the message.
Two reasons, both load-bearing. Its positions are all-null by construction, so there is nothing
truthful to put in parentheses. And the ABSENCE of a file-scoped prefix is what the step 5 predicate
tests, which is the same shape test `isConfigLevelTscError` already performs on the tsc path -- so
one representation serves both, and a file-less record keys as itself under the existing identity
function exactly as that function's comment already promises for an option-level line.

Keep the differential POSITION-INSENSITIVE. Do NOT put line, column, end-line or end-column into the
identity -- they are dropped deliberately, and the raw positioned record is still what gets
returned and recorded as the audit trail. Do not regress the multiset behavior.

STEP 5 -- dispatch, INCLUDING the vacuous-differential guard. Give the internal function that
currently runs the target's tsc a checker parameter and dispatch on it, keeping BOTH existing call
sites inside the differential (the baseline pass and the WITH pass) and passing the resolved checker
to each.

`gradeRun` also applies a config-level predicate to the BASELINE, and that predicate MUST become
checker-aware. `isConfigLevelTscError` gates on a TypeScript-code pattern and returns false for
anything else, so it is BLIND to atc's own synthesized whole-program faults. Leave it byte-unchanged
for the tsc path -- it is proved and pinned -- and add a parallel atc predicate, then select between
them on the resolved checker at the single baseline check site.

The atc predicate requires a FILE: a diagnostic with no file-scoped prefix is config-level BY
CONSTRUCTION, as is one anchored at a tsconfig, reusing the existing file-prefix and tsconfig shape
tests rather than new ones. Enumerate NO diagnostic codes. That choice is deliberate on three
grounds, and the comment must state them: it is the project's allowlist-inversion instinct (require
the good shape, flag everything else, rather than encoding the bad values); it survives atc adding a
further synthesized code, which its own source comments anticipate; and atc's own project-boundary
filter already equates file-less with a whole-program fault and refuses to suppress it, so the
predicate agrees with the tool rather than second-guessing it. Note in the comment WHY the code gate
cannot be reused: atc's synthesized labels sit in a space chosen deliberately outside the TypeScript
range so it cannot collide, which is precisely what makes the TypeScript-code gate miss them.

State the failure chain the guard closes, so a later reader cannot mistake it for defensive noise: a
tsconfig path resolving to a references-only or empty project makes atc exit non-zero with a single
synthesized file-less fault; under the four-way exit table alone that is the ordinary
has-diagnostics case and passes through; the identical fault then appears in BOTH passes because it
does not depend on the applied diff, cancels in the multiset subtraction, and the gate reports zero
NEW errors for a differential that checked zero root names. That is the exact hazard Advisory A-1
exists to close, arriving through a code space the existing guard does not match.

Add a `checker` field to
`red-grade.json` next to the new-error count so every artifact records which checker produced its
diagnostics. Do NOT rename the existing new-error count or new-error-lines fields: they mean "the
differential's NEW diagnostics", several consumers and the whole residual record already key on
them, and a rename would churn the tabulator and every captured artifact for no gain. Say that in
the comment.

STEP 6 -- flip the radix targets. In the radix suite's `targets.json`, replace both targets'
`typecheck` blocks with the atc form -- the checker id and the repo-relative spec config path -- so
the two blocks stay DEEP-EQUAL, which is what the existing config-equality assertion requires and
what licenses one canary pair to cover both. Then rewrite every tsc-era claim and figure in that
file to the atc reality you MEASURED in step 2, keeping the file's existing discipline of stating
what was measured and when: the target-level typecheck notes (replace the tsc-era baseline count and
the tsc-era per-pass seconds with the measured atc equivalents, and replace the project-flag
argument with the reason the tsConfig flag is load-bearing), the runner block's note about where
type diagnostics live, and the qualification checklist's typecheck line. Leave no tsc-era figure
anywhere in that file. State the two NEW facts the switch buys: that atc sees Angular template
diagnostics tsc is structurally blind to, and that atc's extra findings sit in other spec files and
are therefore absorbed baseline for the differential.

STEP 7 -- offline selfcheck assertions in `grade-red.mjs --selfcheck`. Add zero-spend synthetic
assertions, in the file's existing style, for: the checker default; the atc checker accepted; each
fail-closed rejection from step 3 (unknown value, empty string, non-string, missing tsconfig,
malformed tsconfig, args declared alongside atc); the composed atc argument list including the
code-owned format flag; and the normalizer plus guard against the CAPTURED payload from
`fixtures/atc/` -- a clean pass, an errors-present pass, warning-severity records excluded from the
error set, exit 2 throwing, unparseable stdout throwing, a missing diagnostics array throwing, and a
non-zero exit with an empty array throwing.

Pin the VACUOUS-DIFFERENTIAL guard from step 5 the same way the tsc path's version is already pinned,
against the CAPTURED config-fault payload from step 2: the atc predicate reads the synthesized
file-less diagnostic as config-level, and the tsc predicate does NOT read that same normalized record
as config-level. Assert both directions -- the second is what proves the new predicate is load-bearing
rather than redundant. Also assert the predicate does NOT fire on an ordinary file-scoped atc
diagnostic (an Angular-coded template record from the healthy payload), so it cannot abort a grade
for a legitimate finding. Then reproduce the FULL failure chain end to end on normalized records: feed
the synthesized fault as BOTH the baseline and the WITH pass, confirm the multiset subtraction cancels
it to zero NEW errors -- which is the silent-clean outcome -- and confirm the baseline predicate is
what refuses it. That assertion FAILS if the predicate is reverted to the TypeScript-gated one, which
is the requirement.

Prove DISCRIMINATION the house way, with dead-end copies of the pre-guard logic in the same style as
the existing pre-attribution and raw-set-difference copies: a naive "parse stdout, return an empty
list on anything unexpected" reproduction must answer "clean" for the exit-2 and unparseable shapes
on identical inputs, and the pre-change TypeScript-gated predicate must answer "not config-level" for
the synthesized file-less fault, while the shipped code throws in every one of those cases. Do NOT
add an env var or flag whose purpose is to disable a guard for testing.

Also fix the now-stale mechanism comment above the new-error-lines field, which still describes the
subtraction as line-exact string subtraction and still cites the tsc-era baseline count; both were
superseded, the first by the position-insensitivity fix and the second by this switch.

While working: `git grep` cannot see gitignored paths such as `node_modules`, and returns zero
matches with no error -- use `rg -uu` there. Never use the Grep tool or bare `grep`; pipe filters
are `rg`. ASCII only.
  </action>
  <verify>
    <automated>cd .claude/skills/lz-red-workspace && node grade-red.mjs --selfcheck && test "$(rg -c -F '"checker": "atc"' e2e-red-radix-ng/targets.json)" = "2" && ! rg -q -e 'pre-existing errors across 17 files' -e '3\.9 s' e2e-red-radix-ng/targets.json</automated>
  </verify>
  <done>
`angular-typechecker` at exact 0.2.4 is a tracked devDependency and the installed CLI printed 0.2.4.
A real atc run against the radix pin was captured, its exit code, per-pass seconds, total, error and
warning counts and jest-dom TS2339 count recorded, and the numbers compared against the sibling-dist
A/B. `fixtures/atc/` holds the captured healthy payload AND the captured config-fault payload, each with
the command that produced it. `resolveTypecheck`
resolves the checker with the tsc default and throws on every malformed form. The atc guard-and-parse
function throws on exit 2, unparseable stdout, an absent diagnostics array, an empty array with a
non-zero exit, a spawn error and a null status, and allows exit 0 with diagnostics. The baseline
config-level predicate is checker-aware: `isConfigLevelTscError` is byte-unchanged and the atc
predicate requires a FILE, enumerating no codes, so a references-only or empty project throws instead
of cancelling to zero NEW errors. Zero diagnostics of the measured healthy baseline are file-less,
asserted by running each through the real predicate rather than by eye. Normalized
records feed the UNCHANGED identity function and multiset subtraction. `red-grade.json` records the
checker; the new-error field names are unchanged. Both radix targets declare the atc form with
deep-equal typecheck blocks, and no tsc-era figure remains in that file. `grade-red.mjs --selfcheck`
exits 0 including the dead-end-copy discrimination proof. GRC and SRVC `targets.json` are
byte-identical to HEAD.
  </done>
</task>

<task type="auto">
  <name>Task 2: Prove the atc path discriminates -- three radix canaries including the first append-onto-a-dirty-file canary -- then run the full battery</name>
  <files>
    .claude/skills/lz-red-workspace/fixtures/canary-rdxf-template/,
    .claude/skills/lz-red-workspace/fixtures/canary-rdxf-append/,
    .claude/skills/lz-red-workspace/selfcheck-red.mjs
  </files>
  <action>
Three canaries, all fabricated run directories in the existing shape -- a `meta.json` plus a
`diff.patch`, graded end to end through the REAL `gradeRun` against the real radix pin at zero spend.

CANARY A -- the EXISTING `fixtures/canary-rdxf-compile` must still grade `compile_error` under atc.
No fixture change: its bad annotation is a TypeScript assignability error and atc reports the same
code family. Update the radix canary block's assertion messages and figures in `selfcheck-red.mjs`,
which currently argue the failure mode in terms of the tsc project flag and cite the tsc-era
baseline count -- both are now wrong. Restate the failure mode in atc terms: a missing or wrong
tsConfig path makes the differential vacuous, and the guard set now also covers atc's
infrastructure exit code. Use the measured atc baseline count. The existing assertion that the
recorded lines BE the counted diagnostics must keep holding.

CANARY B -- NEW `fixtures/canary-rdxf-template`: a produced spec whose defect atc REPORTS and tsc
does NOT. Derive the defect from the MEASURED atc-versus-tsc delta rather than picking a code from
memory. Requirements on the choice, in order: atc must report it at ERROR severity (a
warning-severity diagnostic never enters the differential); tsc must not report it at all; and it
must be RUNTIME-INERT, because `gradeRun` runs the target's runner before it classifies, so a
defect that crashes the runner produces a throw instead of a verdict. Radix's own specs already
carry these diagnostics in inline misuse-host-component templates AND the repo's full suite exits 0
with them present -- that is direct evidence of runtime-inertness, so MIRROR the shape of a real
one you inspect in the delta rather than inventing a template. If no atc-error-severity,
tsc-invisible, runtime-inert shape exists in the measured delta, build the canary from the closest
available shape and RECORD the gap in Task 3; do not fabricate a code. Land the spec as a new file
in the calendar test directory the suite already pins.

Then MEASURE the tsc half of the claim rather than asserting it: in a throwaway detached worktree at
the pin, run the target's own tsc with the PREVIOUS argument list, once as a baseline and once with
this canary spec applied, and confirm it adds zero new diagnostics. Record that measured result, with
its date, in the fixture's own note and in the target notes -- the fixture's comment must state that
the SAME spec is tsc-CLEAN, which is precisely the hole atc closes. Assert in `selfcheck-red.mjs`
that this canary grades `compile_error` with pass false, with a positive new-error count, and that
the recorded new-error lines carry an Angular-coded diagnostic rather than a TypeScript-coded one --
the existing TypeScript-code assertion on canary A does not transfer, and asserting the code family
is what pins that atc is seeing what tsc cannot.

CANARY C -- NEW `fixtures/canary-rdxf-append`: a diff that APPENDS to a file that ALREADY carries
baseline diagnostics. This is the canary class the entire offline battery lacked, and its absence is
exactly how the position-sensitive differential survived a two-round plan check, a code review, an
8/8 verification and a full bisect until a metered pilot surfaced it. Target the calendar spec that
carries the eight measured jest-dom diagnostics. Read that file at the pin and build a real
`git apply`-able patch that appends a self-contained failing test at end of file; if it needs a
symbol the file does not already import, add the import in a second hunk AT THE TOP, which shifts
every one of the eight baseline diagnostics and is the strongest form of the exercise. Do NOT use
jest-dom matchers in the appended test -- that would add fresh diagnostics of the very kind under
test. Give the appended test a title that appears nowhere else in the file so attribution can
resolve it. Appending to a borrowed spec is already precedent here: the kata's borrowed-failure
canary does the same thing.

Assert this canary grades `genuinely_red` with pass true, ZERO new errors despite the eight shifted
baseline diagnostics, exactly one attributed failure, an excerpt naming the appended test, and an
empty changed-production-files array. Do NOT rebuild the position-insensitivity discrimination proof
-- the five synthetic assertions added by the earlier fix already own it and are checker-agnostic
because they operate on normalized records. This canary's job is the END-TO-END proof on the real
atc path.

For all three: emit a distinct console line per canary in the block's existing style, ending in
`canary OK`, so the battery's output is machine-checkable. The radix block must then log FOUR such
lines. Keep the existing skip-if-absent discipline, the borrowed-repo cleanliness assertions, the
apply-base leak check and the signal-handler assertions untouched -- they are shared machinery.

Then run the FULL `selfcheck-red.mjs` in the BACKGROUND and WAIT for it. It was roughly 230 to 260
seconds on tsc; atc is about 2.2x per pass and two canaries are being added, so budget substantially
longer -- on the order of eight to ten minutes. NEVER shorten it to fit a timeout, and never trim
the battery: a SKIP is not a pass, and a skipped radix canary means the discrimination went
unmeasured.

GATE ON THE PROCESS EXIT STATUS, not on the log text alone. The radix canary block runs in the MIDDLE
of the battery: the apply-base guard, the anchor arming, the diff-containment, runtime-write and
worktree-bounded containment checks, the multi-path toolchain copy check -- the last two exercise the
very radix multi-path toolchain this change touches -- and the nx regression check all run AFTER it.
`fail()` exits immediately, but everything already written to the log SURVIVES, including the four
`canary OK` lines. So a log-only assertion would report success while a later crux was failing, and
would contradict this task's own claim to have proved the no-regression half. Capture the status into
a variable and require it to be zero IN ADDITION to the log assertions.

Borrowed repos are READ-ONLY and must end git-clean: `radix-ng/primitives-pin` detached at its pin,
`h3js/srvx`, the GildedRose kata (exactly one worktree, its `node_modules` entry count intact, no
named branch, detach only), and `radix-ng/primitives`, the owner's checkout, which must never be
opened, installed into, or modified. atc runs out-of-tree from the workspace install; do NOT install
it into any borrowed repo. Note the KNOWN fidelity deviation for Task 3: atc resolves
`@angular/compiler-cli` from its OWN dependency tree rather than the target's, which departs from
the grade-with-the-target's-toolchain principle the toolchain copying upholds.

A fresh worktree has the tracked manifests but NO installed workspace deps, because that
`node_modules` is gitignored -- install in the worktree before running the battery, or the atc
resolution fails closed by design.
  </action>
  <verify>
    <automated>cd .claude/skills/lz-red-workspace && LOG="${TMPDIR:-/tmp}/uqn-selfcheck.log"; node selfcheck-red.mjs > "$LOG" 2>&1; STATUS=$?; echo "selfcheck exit=$STATUS"; test "$STATUS" = "0" && test "$(rg -c 'crux 7:RXF\].*canary OK' "$LOG")" = "4" && ! rg -q 'crux 7:RXF.*SKIP' "$LOG"</automated>
  </verify>
  <done>
`selfcheck-red.mjs` exits 0 -- the PROCESS STATUS was captured and gated on, not merely echoed, so
every crux that runs after the radix block is covered too -- and it was backgrounded, waited for, and
not shortened. Its radix block
logs four `canary OK` lines with no SKIP: the existing disciplined-spec canary, canary A grading
`compile_error` under atc with its evidence lines, canary B grading `compile_error` on an
Angular-coded diagnostic that a measured tsc pass on the SAME spec does not report, and canary C
appending to the eight-diagnostic calendar spec and still grading `genuinely_red` with zero new
errors and exactly one attributed failure. Both new fixtures carry a `meta.json`, a `diff.patch`, and
a note stating what was measured and when. All four borrowed repos end git-clean with one worktree
each and correct pins; nothing was installed into any of them. `plugins/lz-tdd` has zero files in the
diff. No metered command ran.
  </done>
</task>

<task type="auto">
  <name>Task 3: Record the corrected mechanism, the falsified premise, the RXF verdict and the accepted residuals</name>
  <files>
    .planning/phases/21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i/21-ATC-ADOPTION.md,
    .planning/HANDOFF.json,
    .planning/phases/21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i/.continue-here.md,
    .claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md
  </files>
  <action>
Create `21-ATC-ADOPTION.md` in the phase directory as the durable record. It carries, each stated as
measured with its date: the CORRECTED root-cause mechanism (the triple-slash type reference inside
the jest-axe declaration file pulling in a jest type package whose expect returns a matcher type
that jest-dom never augments, proven with the compiler's file-explanation flag, plus the
corroborating setup-file diagnostic); the FALSIFIED `types`-array premise, marked FALSIFIED in a
heading so no future session can skim past it, with the one-sentence reason a `types` array
restricts automatic inclusion but does not block a triple-slash reference in an imported declaration
file; the fact that the runner cannot fail on type errors at all and that nothing in the repo
typechecks specs, which is why the diagnostics sat unnoticed on a maintained default branch; the
LOAD-BEARING-typecheck counterfactual, with both classify outcomes on identical runner input and the
explanation of why the existing wrong-reason class does not cover the type-broken canary; the atc
A/B table; the RXF verdict DECISION and its rationale; and the accepted residual. State plainly that
the pilot's own numbers are instrument calibration, not a result.

Update `.planning/HANDOFF.json`: rewrite `next_action` so it no longer instructs a reader to research
what is now settled and no longer carries the falsified premise; move the research and verdict items
out of `remaining_tasks` into `completed_tasks`; remove the RXF blocker and the matching blocking
human action, while the metered-round approval gate REMAINS OPEN and unchanged as the only blocking
human action. Do NOT mark that gate resolved, approved or closed under any wording: the
eval-run-approval-gate requires a FRESH explicit approval naming the scope, and the four-cell round
has not been approved. Add a decision entry
recording the atc adoption, its radix-only scope, and the kept verdict; and correct the existing
decision entry that says the typecheck decision should be revisited after the research, since the
research is done and the decision held. Add the append-canary and checker-fidelity lessons to
`context_notes` alongside the existing measure-do-not-reason material.

Update the phase `.continue-here.md` to match: the RXF item leaves `remaining_work`, the blocker
list loses the RXF entry, the decision that flagged the typecheck as possibly wrong is resolved and
states the outcome, and `next_action` points at the two still-gated metered items rather than at
settled research. Keep every blocking constraint and anti-pattern row, and ADD an anti-pattern row
for the checker-fidelity deviation. Point the required-reading list at `21-ATC-ADOPTION.md`.

Add to the RUN-GATE residual list, in the same style and alongside the already-CLOSED advisory and
line-shift entries, ONE new entry covering the atc adoption with these parts, each labelled as
accepted or closed rather than left implicit:

- ACCEPTED, the owner's decision: RXF's `compile_error` verdict stands on the jest-dom matcher
  diagnostic. Say what that costs -- a produced test using a matcher the repo registers at runtime
  and that matches the house idiom grades `compile_error`, so matcher choice partly decides RXF
  grading -- and say explicitly that a matcher allowlist, a baseline-keyed noise rule and any
  target-specific tolerance were deliberately NOT written, because they would forge the measurement.
  Add how to read it: a `compile_error` cluster on RXF is worth inspecting against the recorded
  new-error lines before attributing anything to an arm.
- CLOSED: the Angular-template blind spot. tsc reported zero template diagnostics on this project
  against atc's measured count, so a template-broken produced test used to pass the differential
  clean and could still throw an honest-looking assertion failure -- the same false-pass class the
  counterfactual proved the differential exists to close. Name the new canary that now covers it, and
  the measured fact that atc's extra findings sit in other spec files and are therefore absorbed
  baseline that cannot sink a produced test.
- OPEN, a fidelity deviation, not a defect: atc resolves `@angular/compiler-cli` from its own
  dependency tree rather than the target's, so the compiler version it uses differs from the one
  radix ships. That departs from the grade-with-the-target's-toolchain principle the per-grade
  toolchain copy upholds. State the direction of the risk and that it was accepted knowingly.
- The re-priced per-grade differential cost, since atc is about 2.2x per pass and the differential
  runs two passes per grade. Update any RUN-GATE figure that states the differential's cost so the
  cost table stays honest for the still-gated round.

Every file here is committed prose in a PUBLIC repo. ASCII only -- no emoji, no box-drawing, no
em or en dashes, no curly quotes, no ellipsis character. Re-run the maintainer email allowlist
scan over what you write before committing: assert the only email-shaped token present is the
approved public contact and flag anything else; never write a forbidden value as a search needle.
  </action>
  <verify>
    <automated>cd "$(git rev-parse --show-toplevel)" && ! rg -q -P '[^\x00-\x7F]' .planning/phases/21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i/21-ATC-ADOPTION.md .planning/HANDOFF.json .planning/phases/21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i/.continue-here.md .claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md && rg -q -i 'falsified' .planning/HANDOFF.json && rg -q -i 'falsified' .planning/phases/21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i/.continue-here.md && rg -q -i 'angular-typechecker|\batc\b' .claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md</automated>
  </verify>
  <done>
`21-ATC-ADOPTION.md` exists in the phase directory carrying the corrected mechanism, the explicitly
FALSIFIED `types`-array premise, the runner-cannot-fail-on-types fact, the load-bearing-typecheck
counterfactual with both classify outcomes, the atc A/B table, the RXF verdict decision and the
accepted residual, each dated. Neither `HANDOFF.json` nor `.continue-here.md` still carries the
falsified premise or presents the RXF verdict as open; both point at the new artifact; the metered
approval gate remains the only blocking human action. RUN-GATE's residual list carries the new entry
with its accepted, closed and open parts and a re-priced differential cost. All four files are
ASCII-only and pass the maintainer email allowlist-inversion scan.
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| npm registry -> workspace `node_modules` | A new third-party dependency and its transitive tree enter a directory whose code the gate executes. |
| target config (`targets.json`) -> `gradeRun` | Operator-authored config decides which checker runs and against which project; a malformed value could silently weaken the gate. |
| atc CLI stdout/exit -> the differential | Untrusted process output decides a verdict; an unrun or crashed pass must never read as clean. |
| model-authored spec -> the target's runner | Already contained by the per-grade disposable toolchain copy; unchanged by this task. |
| borrowed repos -> this task | Four read-only third-party checkouts that must end git-clean. |

## STRIDE Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation Plan |
|-----------|----------|-----------|----------|-------------|-----------------|
| T-uqn-SC | Tampering | `npm install angular-typechecker` + transitive tree | high | mitigate | Package Legitimacy Audit above: all entries VERIFIED against the registry, publisher is first-party, no `[ASSUMED]`/`[SUS]` entry so no blocking checkpoint is required. Exact version pin, tracked lockfile, install confined to the gitignored workspace `node_modules`, never into a borrowed repo. Task 1 additionally re-measures the installed CLI against the sibling-dist A/B, so a substituted or drifted artifact shows up as a numeric mismatch. |
| T-uqn-01 | Tampering | `resolveTypecheck` checker resolution | high | mitigate | Unknown, empty and non-string checker values, a missing or malformed atc tsconfig, and a tsc arg list declared alongside the atc checker each THROW before the grading worktree exists. Absent falls back to tsc, the stronger-by-default gate. Asserted in `grade-red --selfcheck`. |
| T-uqn-02 | Repudiation | atc pass that did not really run | critical | mitigate | Guard and parse in ONE function: exit 2, unparseable stdout, an absent diagnostics array, a non-zero exit with an empty array, a spawn error and a null status all throw. Advisory A-1's property -- a typecheck that did not really run cannot read as clean -- is preserved on BOTH checker paths, and a dead-end copy of the pre-guard logic proves discrimination on identical inputs. |
| T-uqn-06 | Repudiation | atc pass that checked ZERO root names | critical | mitigate | atc synthesizes its own error-severity FILE-LESS faults for a references-only or empty project, under a code space chosen deliberately outside the TypeScript range -- so `isConfigLevelTscError` cannot see them, the fault appears in BOTH passes, cancels in the subtraction, and the gate would report a vacuous differential as clean. The baseline config-level predicate becomes checker-aware and the atc side requires a FILE, enumerating no codes, so a future synthesized code is covered on arrival. Pinned by a selfcheck assertion over the CAPTURED config-fault payload that reproduces the full cancel-to-zero chain and FAILS if the predicate is reverted, plus the measured fact that no diagnostic of the healthy baseline is file-less. |
| T-uqn-03 | Information disclosure | maintainer identity in committed prose | high | mitigate | Task 3 re-runs the allowlist-inversion scan over every file it writes; no forbidden value is written even as a search needle. |
| T-uqn-04 | Denial of service | borrowed repos left dirty or with stranded worktrees | medium | mitigate | Unchanged shared machinery: finally-style teardown, the per-canary cleanliness and worktree assertions, and the volume and stranded-worktree checks all run for every new canary. atc runs out-of-tree; nothing is installed into a borrowed repo. |
| T-uqn-05 | Elevation of privilege | atc using a different Angular compiler than the target | medium | accept | atc resolves `@angular/compiler-cli` from its own tree, deviating from the grade-with-the-target's-toolchain principle. Accepted knowingly and RECORDED as an open residual in RUN-GATE rather than hidden; the alternative is installing atc into a borrowed repo, which is forbidden. |
</threat_model>

<verification>
- `node grade-red.mjs --selfcheck` exits 0, including every new checker-resolution, guard,
  normalizer, vacuous-differential and dead-end-copy assertion.
- A FULL `node selfcheck-red.mjs` exits 0 with four `canary OK` lines in the radix block and no SKIP
  there; it was backgrounded and waited for, never shortened. The PROCESS STATUS is gated on, not
  echoed: the radix block runs mid-battery and its log output survives a later crux's failure, so a
  log-only assertion would pass over a regression in the containment, apply-base, multi-path
  toolchain or nx-regression cruxes that run after it.
- GRC and SRVC `targets.json` are byte-identical to HEAD, and their canaries still pass -- the
  no-regression half of the same battery run.
- No tsc-era figure remains in the radix `targets.json`.
- `git status` is clean in all four borrowed repos; one worktree each; correct pins; the kata's
  `node_modules` entry count intact; the owner's `radix-ng/primitives` checkout untouched.
- `plugins/lz-tdd` has zero files in the task diff.
- Zero metered spend: no `claude -p`, no eval fan-out, no `run-e2e.mjs` outside `--dry-run`.
- Every file written is ASCII-only and passes the maintainer email allowlist-inversion scan.
</verification>

<success_criteria>
- atc 0.2.4 is a tracked npm devDependency of the workspace, and the gate resolves its CLI through
  the installed package rather than through any sibling checkout.
- RXF and RXL grade through atc with deep-equal typecheck blocks; GRC and SRVC grade through tsc with
  behavior unchanged; a malformed checker fails closed.
- atc JSON feeds the UNCHANGED position-insensitive multiset differential and the UNCHANGED
  classifier through one normalizer, with no per-checker branch downstream.
- The atc path cannot read a pass that did not run as clean, and cannot read a pass that checked ZERO
  root names as clean either -- the baseline config-level predicate is checker-aware and requires a
  file rather than enumerating atc's synthesized codes.
- Three radix canaries prove discrimination, one of them by appending to a file that already carries
  diagnostics.
- RXF's `compile_error` verdict stands, unmodified, with its consequence recorded as a residual.
- The falsified premise is corrected everywhere a future session would read it, and the RXF verdict
  is no longer an open question in any artifact.
</success_criteria>

<output>
Create `.planning/quick/260726-uqn-adopt-angular-typechecker-for-the-radix-/260726-uqn-SUMMARY.md`
when done. Record the MEASURED atc numbers (exit code, per-pass seconds, total, error and warning
counts, jest-dom TS2339 count) and whether they reproduced the sibling-dist A/B, the full
`selfcheck-red.mjs` wall-clock, and the borrowed-repo cleanliness evidence.
</output>
