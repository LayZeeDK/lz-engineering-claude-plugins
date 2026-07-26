# fixtures/atc -- captured angular-typechecker JSON payloads

Two REAL `atc --format json` payloads, captured 2026-07-26 from the npm-installed
`angular-typechecker@0.2.4` in this workspace. They are the offline input for the atc guard,
normalizer and vacuous-differential assertions in `grade-red.mjs --selfcheck`, so the battery is
pinned against what the CLI actually emits rather than against a hand-written shape that could
drift from it.

Both were produced READ-ONLY. Nothing was installed into, or written to, any borrowed repo.

## radix-healthy.json -- the ordinary has-diagnostics pass

The command, run with the working directory set to the radix pin
(`D:/projects/github/radix-ng/primitives-pin`, detached at
`4a7390a2b058457aa47c6f3e0e03b69b70dee025`), using the exact argument list the gate composes:

```
node <workspace>/node_modules/angular-typechecker/src/cli/bin.js \
  -c packages/primitives/tsconfig.spec.json --format json
```

MEASURED, single pass:

| | value |
|---|---|
| exit code | 1 (type verdict) |
| wall clock | 9.870 s |
| diagnostics total | 80 |
| error severity | 73 |
| warning severity | 7 |
| distinct files carrying a diagnostic | 30 (26 of them error-severity) |
| `summary.rootNamesCount` | 146 |
| `summary.totalFilesCount` | 607 |
| jest-dom `TS2339` in `packages/primitives/calendar/__tests__/calendar.spec.ts` | 8, at lines 81, 82, 88, 89, 95, 96, 106, 110 |
| Angular diagnostics | 15 -- `NG8113` x7 (warning), `NG8007` x7 (error), `NG8022` x1 (error) |
| multi-line messages | 29 of 80 |
| absolute file paths | 0 |
| file-less records | 0 |

This REPRODUCES the sibling-dist A/B recorded in the plan (9.567 s, 73 errors + 7 warnings = 80
diagnostics, 8 jest-dom `TS2339`, 15 Angular diagnostics with the same per-code split). The 0.303 s
timing difference is run-to-run noise on the same machine.

## config-fault.json -- the whole-program fault the vacuous-differential guard exists to catch

Produced by pointing the same CLI at a throwaway EMPTY project created OUTSIDE every borrowed repo
and outside the user profile, so the payload's own paths stay short and machine-neutral:

```
D:/.lz-red-grade-tmp/atc-empty-project/tsconfig.empty.json
  { "compilerOptions": { "noEmit": true, "strict": true }, "files": [] }

node <workspace>/node_modules/angular-typechecker/src/cli/bin.js \
  -c tsconfig.empty.json --format json          # cwd = D:/.lz-red-grade-tmp/atc-empty-project
```

MEASURED: exit code 1, `summary.rootNamesCount` 0, and TWO file-less error-severity diagnostics:

| `code` | `rawCode` | origin |
|---|---|---|
| `TS18002` | 18002 | TypeScript's own "the 'files' list in config file ... is empty" |
| `ATC90001` | 90001 | angular-typechecker's SYNTHESIZED zero-root-names guard |

This is the B2 hazard in one payload. NEITHER record is visible to `isConfigLevelTscError`, whose
gate is `error TS5xxx`/`TS6xxx`: `ATC90001` is not TypeScript-coded at all, and `TS18002` sits
outside that range. Both are file-less, so both are caught by `isConfigLevelAtcError`, which
requires a FILE and enumerates no codes.

## Verified payload-shape facts the normalizer depends on

Confirmed from THESE payloads (and cross-checked against the installed 0.2.4 source), not assumed:

- **`code` is ALREADY a fully prefixed label** -- every value is a string (`TS2339`, `NG8007`,
  `ATC90001`), never a bare number. The normalizer therefore uses it VERBATIM; adding a prefix
  would build `TSTS2339` and break both the identity keying and the config-level matching.
  `rawCode` is the bare number (`2339`, `-998113`, `90001`) and is deliberately unused for record
  text.
- **`file` arrives repo-relative with forward slashes**, or `null` for a file-less record. Zero
  absolute paths in the healthy payload, so no relativization step belongs in the normalizer.
- **A file-less record carries all-null positions** on all four axes, which is why it is normalized
  with no parenthesized position and no file prefix at all.
- **Record keys**: `file`, `line`, `column`, `endLine`, `endColumn`, `code`, `rawCode`, `severity`,
  `message`. `endLine`/`endColumn` are deliberately DISCARDED from the differential identity, which
  stays position-insensitive.
- **Severity values** observed here are `error` and `warning`. The tool's own projection can also
  emit `suggestion` and `message`, so all four are recognised (and only `error` is kept); anything
  outside that set throws rather than being silently dropped.
