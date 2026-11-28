---
phase: quick-260726-uqn
plan: 01
status: complete
subsystem: lz-red-workspace RED apply-eval instrument
requirements: [EVL-03.3]
tags: [angular-typechecker, differential-typecheck, radix-ng, canaries, fail-closed, phase-21]
duration: one session
completed: 2026-07-26
commits:
  - fc174c7  # feat: adopt angular-typechecker as the radix differential checker
  - 7ade70a  # test: prove the atc path discriminates with three radix canaries
  - 9794e90  # docs: record the corrected mechanism, the falsified premise and the RXF verdict
key-files:
  created:
    - .claude/skills/lz-red-workspace/fixtures/atc/radix-healthy.json
    - .claude/skills/lz-red-workspace/fixtures/atc/config-fault.json
    - .claude/skills/lz-red-workspace/fixtures/atc/CAPTURE-NOTES.md
    - .claude/skills/lz-red-workspace/fixtures/canary-rdxf-template/
    - .claude/skills/lz-red-workspace/fixtures/canary-rdxf-append/
    - .planning/phases/21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i/21-ATC-ADOPTION.md
  modified:
    - .claude/skills/lz-red-workspace/grade-red.mjs
    - .claude/skills/lz-red-workspace/selfcheck-red.mjs
    - .claude/skills/lz-red-workspace/e2e-red-radix-ng/targets.json
    - .claude/skills/lz-red-workspace/package.json
    - .claude/skills/lz-red-workspace/package-lock.json
    - .claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md
    - .planning/HANDOFF.json
    - .planning/.continue-here.md
---

# Quick 260726-uqn: adopt angular-typechecker for the radix cells -- Summary

Adopted `angular-typechecker` (atc) 0.2.4 as the differential typechecker for the two radix-ng
targets only, closing a measured Angular-template blind spot in tsc; added the first
append-onto-a-dirty-file canary the suite has ever had; and recorded the settled JestMatchers
mechanism, the falsified `types`-array premise and the standing RXF verdict so no future session
re-inherits them.

**Zero metered spend.** The ~$39 four-cell round and the ~$1.10 `with_skill` pilot both REMAIN
USER-GATED and unapproved.

---

## Measured numbers (the actual ones, not the plan's expectations)

### The npm-installed atc CLI against the radix pin

Command, working directory = `D:/projects/github/radix-ng/primitives-pin` (detached at
`4a7390a2b058457aa47c6f3e0e03b69b70dee025`), read-only:

```
node <workspace>/node_modules/angular-typechecker/src/cli/bin.js \
  -c packages/primitives/tsconfig.spec.json --format json
```

| Dimension | Measured |
|---|---|
| exit code | **1** (type verdict) |
| wall clock per pass | **9.870 s** |
| total diagnostics | **80** |
| error severity | **73** (across 26 files) |
| warning severity | **7** |
| distinct files carrying any diagnostic | 30 |
| `summary.rootNamesCount` / `totalFilesCount` | 146 / 607 |
| jest-dom `TS2339` in the calendar spec | **8**, at lines 81, 82, 88, 89, 95, 96, 106, 110 |
| Angular diagnostics | **15** -- `NG8113` x7 (warning), `NG8007` x7 (error), `NG8022` x1 (error) |
| multi-line messages | 29 of 80 |
| absolute file paths / file-less records | 0 / 0 |

**Did it reproduce the sibling-dist A/B? YES, on every axis.** That run measured 9.567 s, 73 error +
7 warning = 80 diagnostics, the same 8 jest-dom `TS2339` at the same lines, and the same 15 Angular
diagnostics with the same per-code split. The 0.303 s timing difference is run-to-run noise on the
same machine.

Environment confirmations: Node v24.18.0 satisfies atc's declared engines (`^24.15.0`); the
workspace's pinned `typescript` resolves to **6.0.3**, satisfying atc's peer range `>=6.0.0 <6.1.0`;
the installed CLI prints **0.2.4**; `bin` maps both `angular-typechecker` and `atc` to
`./src/cli/bin.js`. `npm install --save-exact --save-dev angular-typechecker@0.2.4` added 223
packages with **no peer-resolution conflict**, so no force flag was needed. (npm did warn that
`nx@23.1.0`'s postinstall was not run under its allow-scripts policy; atc works regardless, proven
by the measurement above.)

### The payload shape, CONFIRMED from the payload before any normalizer logic was written

Both of the plan's corrected source facts held, and following the earlier draft would have broken the
gate:

- **`code` is ALREADY a fully prefixed label** -- every value is a string (`TS2339`, `NG8007`,
  `ATC90001`), never a bare number. Used VERBATIM. Prefixing it would have produced `TSTS2339` and
  broken both the identity keying and the config-level matching.
- **`rawCode` is the bare number** (`2339`, `-998113`, `90001`) and is deliberately unused for record
  text.
- **`file` arrives repo-relative with forward slashes**, `null` when file-less. Zero absolute paths,
  so no relativization step was added.
- Record keys: `file`, `line`, `column`, `endLine`, `endColumn`, `code`, `rawCode`, `severity`,
  `message`. `endLine`/`endColumn` are discarded from the differential identity.

### The config-fault payload (what the vacuous-differential guard exists to catch)

A throwaway empty project (`files: []`) created OUTSIDE every borrowed repo:

| Dimension | Measured |
|---|---|
| exit code | 1 |
| `summary.rootNamesCount` | **0** |
| diagnostics | **2, both FILE-LESS and error-severity**: `TS18002` (rawCode 18002) and `ATC90001` (rawCode 90001) |

`isConfigLevelTscError` reads **NEITHER** as config-level -- `ATC90001` is not TypeScript-coded and
`TS18002` sits outside its `TS5xxx`/`TS6xxx` gate. That is the B2 hazard in one payload, and it is why
the atc predicate had to be new rather than reused.

**The guard's false-positive direction, measured rather than assumed:** ZERO of the 73 error-severity
records in the healthy radix baseline is file-less, asserted by running every one through the REAL
predicate. So the guard cannot hard-abort a legitimate grade on this target.

### The two checkers on the same project, same session, in-worktree

| | tsc 6.0.3 | atc 0.2.4 |
|---|---|---|
| exit | 2 | 1 |
| per pass | **4.533 s** | **9.040 s** (~2.0-2.2x) |
| error-severity diagnostics | 55 across 17 files | 73 across 26 files |
| **Angular-coded diagnostics** | **0 (structurally blind)** | **15** |

### Canary B -- the atc-visible, tsc-invisible defect

`NG8007` ("the property and event halves of the two-way binding 'locale' are not bound to the same
target"), mirrored from the seven real `NG8007` sites in radix's own specs.

| checker | baseline | with the canary | NEW |
|---|---|---|---|
| atc | exit 1, 80 / 73 error, 9.040 s | exit 1, **81 / 74 error**, 9.099 s | **1** -- `NG8007` at `canary-rdxf-template.spec.ts(18,16)`, error severity |
| tsc | exit 2, 55 error lines, 4.533 s | exit 2, **55 error lines**, 4.066 s | **0** |

The SAME spec is tsc-CLEAN. Measured, not asserted.

### Canary C -- the append onto a dirty file

| | baseline | with the canary |
|---|---|---|
| atc exit / diagnostics | 1, 80 / 73 error | 1, **80 / 73 error** |
| calendar spec jest-dom `TS2339` lines | 81, 82, 88, 89, 95, 96, 106, 110 | **82, 83, 89, 90, 96, 97, 107, 111** |
| NEW under the shipped position-insensitive multiset | -- | **0** |
| NEW under a RAW positioned difference (the pre-fix rule) | -- | **8** |

All eight shifted by exactly one line. The 8-versus-0 split is the proof, and it is the metered
pilot's shape reproduced end to end on the real atc path against the real repo.

### Canary A under atc

Still grades `compile_error`, **1 NEW diagnostic, `TS2322` at `canary-rdxf-compile.spec.ts(17,15)`** --
so the TypeScript-coded half of the differential is unaffected by the switch.

### Re-priced cost

atc is ~9.0-9.9 s per pass against tsc's ~3.9 s, and the differential runs TWO passes per grade:
**~19 s per radix grade, up from ~7.8 s.** A k=3 round's radix grading becomes ~54 s per grade
(~35 s toolchain copy + ~19 s typecheck), about +3 min across the 18 radix runs. Model spend is
unchanged.

---

## Full selfcheck battery

**Exited 0, twice.** Backgrounded and waited for both times; never shortened.

| | Run 1 (pre-commit) | Run 2 (the SHIPPED tree) |
|---|---|---|
| exit status (CAPTURED, not inferred from the log) | **0** | **0** |
| wall clock | 404.5 s (6.74 min) | **395.3 s (6.59 min)** |
| `canary OK` lines in the radix block | **4** | **4** |
| radix fixture SKIPs | **0** | **0** |
| SKIP lines anywhere in the log | **0** | **0** |
| crux lines, all green | 40 | 40 |

Run 2 exists because a console-log string in `selfcheck-red.mjs` was corrected after run 1, so the
passing claim had to be made about the code that was actually committed rather than about a
near-identical tree. All ELEVEN fabricated runDirs pass in it: five GRC, two SRVC (both still
reporting "NEW tsc errors" -- they are on the unchanged tsc path), and four RXF. The 9 s spread
between the two runs is machine load.

Previous timings for context: 114.9 s before the radix suite existed, 232.1 s and 262.9 s with its
first two canaries. The rise to ~395-405 s is the two new canaries' own toolchain copies and runs plus
atc being ~2.2x tsc per pass across all four.

The exit status was gated on rather than the log text, because the radix block runs in the MIDDLE of
the battery and its `canary OK` lines survive a later crux's failure -- a log-only assertion would
report success while containment, apply-base, multi-path-toolchain or nx-regression cruxes were
failing.

GRC and SRVC `targets.json` are **byte-identical to HEAD** (`git diff` empty), and their canaries
still pass in the same run -- the no-regression half of the same measurement.

---

## Borrowed repos -- all clean

| Repo | State |
|---|---|
| `radix-ng/primitives-pin` (the eval source) | CLEAN, detached at `4a7390a2`, ONE worktree |
| `h3js/srvx` | CLEAN, detached at `55d90b3`, ONE worktree |
| GildedRose kata | CLEAN, on `main`, ONE worktree, only `main` as a branch, `TypeScript/node_modules` at **308** non-dotted entries |
| `radix-ng/primitives` (the OWNER'S checkout) | never opened, installed into, or modified; its 2 dirty files (`package.json`, `pnpm-lock.yaml`) are the owner's own pre-existing work |
| `LayZeeDK/angular-typechecker` | CLEAN, untouched |
| `analogjs/analog` | untouched; its 2 dirty files are the owner's uncommitted WIP |

Nothing was installed into any borrowed repo -- atc runs out-of-tree from the workspace install.
`plugins/lz-tdd` has **zero** files in the task diff (18 files total, all under
`.claude/skills/lz-red-workspace/` and `.planning/`).

---

## Checker-warning compliance

**CW1 -- stale tsc-era cost figures in RUN-GATE.md.** Every one is either replaced or now carries
explicit re-pricing context: the per-target cost table row, the Step 1 k-scoping note, the fan-out
estimate rows (grading 15 -> 18 min; 19-20 -> 22-23 min with the runner spawn), the per-target
grading bullet, the Step 3c prose, the 55-error baseline references, the battery timing, the fixture
count (NINE -> ELEVEN) and the toolchain-copy count. Verified by a check asserting no BARE stale
figure survives AND that all three current figures are present. A blunt "the string must be absent"
test was deliberately NOT used -- the re-priced entries cite the old numbers on purpose to document
what changed, and forbidding the string would push the doc toward hiding the change. The check also
had to be corrected twice: the unbounded `7.8 s` pattern matched `37.8 s` (an unrelated pnpm-install
timing) and the doc is hard-wrapped, so context legitimately sits on the previous line. Both were
checker bugs, not doc bugs.

**CW2 -- ASCII-only and maintainer-email allowlist-inversion over EVERY file gaining committed
prose,** not just Task 3's four. Run over all 15 committed files across the three commits, including
`targets.json`, the `fixtures/atc/` capture notes and payloads, and both new canary NOTES. All pass:
ASCII clean, and the only email-shaped token permitted is the approved public contact. Detection is
by allowlist-inversion -- **no forbidden address or domain was written anywhere, not even as a search
needle.**

**CW3 -- the vacuous `! rg -q 'crux 7:RXF.*SKIP'` clause.** Confirmed vacuous by reading
`gradeFabricatedRunDir`: its SKIP message is FIXTURE-name-scoped
(`[crux 7:canary-rdxf-template] SKIP -- ...`), never `crux 7:RXF...SKIP`; only `checkRdxCanaries`'
pass-path messages carry the `[crux 7:RXF]` prefix. The clause could never fire. Replaced with a
check against the real fixture-scoped strings
(`canary-rdxf-red|canary-rdxf-compile|canary-rdxf-template|canary-rdxf-append`), which measured
**0**. The distinction is documented in RUN-GATE so a future operator greps the right thing.

---

## Deviations from plan

**1. The phase `.continue-here.md` does not exist at the path the plan names.** The plan listed
`.planning/phases/21-.../. continue-here.md`; the real resume file is `.planning/.continue-here.md`,
and it was badly STALE -- dated 2026-07-22, describing Phase 21 as "NOT yet
discussed/planned/scaffolded" at a HEAD from before the entire build. It had no RXF item to remove and
its blocker list already held only the metered-run entry.

I updated the file that actually exists rather than creating a second one at the plan's path, because
two files claiming to be the resume point is worse than one correct file. Every instruction was
applied to it: both blocking constraints and all five anti-pattern rows kept, a sixth added for the
checker-fidelity deviation, the typecheck decision resolved with its outcome stated, required reading
pointed at `21-ATC-ADOPTION.md` first, and `next_action` pointing at the two still-gated metered
items. It was also brought current.

Consequence worth flagging: Task 3's `<automated>` verify names the non-existent path, and
`! rg -q -P <pattern> <missing-file>` evaluates TRUE (rg exits 2 on a missing file, which the `!`
inverts) -- so that clause would have FALSE-PASSED regardless. The ASCII and email checks were run
against the real path instead.

**2. A stricter severity domain than "the observed set".** The plan said a diagnostic whose severity
is outside the observed set must throw. Observed on this target were only `error` and `warning`, but
atc's own projection can also emit `suggestion` and `message` (read from the installed source). Using
only the two observed values would hard-abort a grade on legitimate future data, so all four of the
tool's real domain are recognised (only `error` is kept) and anything outside it throws. The
selfcheck asserts the throw on an unrecognised value.

Nothing else deviated. No work was left undone.

---

## Still open (unchanged by this task)

The metered-round approval gate **REMAINS OPEN** and is the only blocking human action on Phase 21:

- the ~$39 four-cell round (4 cells x 3 arms x k=3 = 36 runs at the measured $1.09/run), and
- optionally a ~$1.10 single-cell `with_skill` pilot, the only way to measure the D-04 auto-trigger
  dimension.

Neither is approved, and nothing in this task should be read as approving them.

---

## Self-Check: PASSED

- All seven claimed created files exist on disk (`fixtures/atc/` x3, both canary fixture dirs,
  `21-ATC-ADOPTION.md`, this summary).
- All three claimed commits exist in `git log`: `fc174c7`, `7ade70a`, `9794e90`.
- None of the three commits deletes a tracked file (`git diff --diff-filter=D` empty for each).
- Task diff is exactly 18 files, all under `.claude/skills/lz-red-workspace/` and `.planning/`;
  `plugins/lz-tdd` has zero.
- `node grade-red.mjs --selfcheck` exits 0 on the committed tree; `node selfcheck-red.mjs` exits 0
  on the committed tree (395.3 s, 4 radix `canary OK`, 0 SKIPs).
- Working tree clean apart from this summary, which is deliberately left uncommitted for the
  orchestrator.
- No stranded grading worktree in `D:\.lz-red-grade-tmp`.
