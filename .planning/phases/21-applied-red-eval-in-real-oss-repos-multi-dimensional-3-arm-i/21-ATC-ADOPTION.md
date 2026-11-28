# Phase 21 -- adopting angular-typechecker for the radix cells, and the JestMatchers question settled

The durable record for quick task `260726-uqn`. It exists so no future session re-inherits the
falsified premise this phase paused on, and so the RXF verdict stops reading as an open question.

Everything below was MEASURED on 2026-07-26 unless a different date is given. Cite it; do not
re-derive it.

---

## 1. The corrected root-cause mechanism

**The diagnostic**, verbatim:

```
packages/primitives/calendar/__tests__/calendar.spec.ts(111,28): error TS2339:
Property 'toHaveAttribute' does not exist on type 'JestMatchers<HTMLElement>'.
```

**The mechanism**, proven with `tsc --explainFiles`, which names the referencing file outright:

1. `@types/jest-axe/index.d.ts` opens with a triple-slash `reference types="jest"` directive.
2. That pulls in `@types/jest` (version 30.0.0), which is present in radix's pnpm store as
   jest-axe's OWN dependency -- nothing in the repo asks for it directly.
3. `@types/jest` declares `expect` as returning `JestMatchers<T>`.
4. `@testing-library/jest-dom/vitest` augments VITEST's `Assertion` interface, not `JestMatchers`.
5. So the jest-dom matchers land on a type nothing in this program uses, and every jest-dom matcher
   call in it is a `TS2339`.

**Corroborating diagnostic**, same cause from the other direction: `test-setup.ts(29,1)` reports
`TS2741`, because vitest's `describe.skip` is not assignable to `@types/jest`'s `It` interface. Two
independent symptoms, one cause.

**Scope of the symptom:** eight `TS2339` diagnostics, all `toHaveTextContent`, all in
`packages/primitives/calendar/__tests__/calendar.spec.ts` at lines 81, 82, 88, 89, 95, 96, 106 and
110 -- the ONLY spec in the package that uses jest-dom matchers.

---

## 2. FALSIFIED: the `types`-array premise

**This section exists so the premise cannot be skimmed past. The phase paused on it, and it is
WRONG.**

`HANDOFF.json`'s `next_action` and the phase `.continue-here.md` both claimed that
`packages/primitives/tsconfig.spec.json` sets an explicit `types` array omitting jest-dom, "so the
TYPES never load".

**That is false. jest-dom's types DO load.** `tsc --explainFiles` shows
`@testing-library/jest-dom/types/vitest.d.ts` in the program, imported via
`@testing-library/jest-dom/vitest` from `test-setup.ts`, which is in the config's `files` array.

**The one-sentence reason:** a `types` array restricts AUTOMATIC `@types` inclusion; it does not
block a triple-slash reference inside an imported declaration file. So it neither prevents jest-dom's
types from loading nor prevents `@types/jest` from being pulled in -- the exact opposite of what the
premise asserted on both halves.

The real cause is the one in section 1: a matcher-target MISMATCH, not a missing type load.

---

## 3. The runner cannot fail on type errors at all

VERIFIED against the TAGGED Analog source at `v2.6.1`: the vite plugin sets its tsconfig to the spec
config when testing, but ALSO defaults `disableTypeChecking` to true and masks semantic diagnostics
off. radix calls the plugin with no options.

That is why the RXF pilot run produced a genuine assertion error despite nine type errors in the same
file -- and why NOTHING in the repo typechecks specs:

- no inferred nx typecheck target,
- no typecheck target in the project config,
- no type-aware ESLint,
- CI runs `test` + `build` only.

**Consequence worth stating plainly:** these diagnostics sit on a maintained default branch,
unnoticed, because nothing in the repo's own toolchain would ever surface them. The gate's
differential is the only type signal on this target.

---

## 4. The differential typecheck is LOAD-BEARING (the counterfactual)

Measured with the REAL exported `classify()` on identical runner input, varying ONLY
`tscResult.newErrors`:

| `newErrors` | verdict | `pass` |
|---|---|---|
| 1 | `compile_error` | false |
| 0 | `genuinely_red` | **true** |

So the existing `wrong_reason` class does NOT cover the type-broken canary, and dropping the
differential would not be a neutral simplification. `canary-rdxf-compile`'s bad annotation evaporates
at runtime: the query returns `null`, the assertion fails legitimately, and the run reads as an
honest RED. Only the differential distinguishes it from one.

**This is why atc was adopted rather than the typecheck dropped.**

---

## 5. The atc A/B

Same session, identical tsconfig, working directory = `primitives-pin` at its pin. Cross-session
timing comparison is invalid on this project, so both halves were run back to back.

| | tsc 6.0.3 | atc 0.2.4 |
|---|---|---|
| wall clock per pass | 4.533 s | 9.870 s (~2.2x) |
| exit code | 2 | 1 |
| error-severity diagnostics | 55 across 17 files | 73 across 26 files |
| warning-severity diagnostics | n/a | 7 |
| total diagnostics | 55 | 80 |
| jest-dom `TS2339` in the calendar spec | 8 | 8 (IDENTICAL) |
| **Angular template diagnostics** | **0 (structurally blind)** | **15** -- `NG8113` x7 (warning), `NG8007` x7 (error), `NG8022` x1 (error) |
| output | text lines to parse | JSON records with `file`, `line`, `column`, `endLine`, `endColumn`, `code`, `rawCode`, `severity`, `message` |
| infra-vs-findings | hand-rolled `isConfigLevelTscError` | native: exit 0 clean / 1 verdict-fail / 2 infra-or-usage |

The npm-installed 0.2.4 CLI REPRODUCED the earlier sibling-dist numbers on every axis (that run
measured 9.567 s, 73 error + 7 warning, the same 8 jest-dom diagnostics and the same 15 Angular
diagnostics with the same per-code split). The sub-second timing difference is run-to-run noise.

**Why the extra findings do not distort the measurement:** atc's additional diagnostics live in OTHER
spec files (alert-dialog, autocomplete, checkbox, combobox, dialog, drawer, menu, number-field,
popover, preview-card, radio, slider, switch, tooltip). For a DIFFERENTIAL they are pure absorbed
baseline and cannot sink a produced test.

---

## 6. The RXF verdict: DECISION

**RXF's `compile_error` verdict STANDS.** Owner decision, recorded here as settled rather than open.

**Rationale.** The diagnostic is real, it is the model's own, and it is not an instrument defect. The
gate is behaving exactly as designed: the produced test used `.toHaveAttribute` where the program's
resolved typings expose no such matcher on the type `expect()` actually returns. Whether a single
missing-matcher diagnostic SHOULD sink a run is a question about the D-06 taxonomy, and the answer
chosen is yes -- because the alternative is worse. A matcher allowlist, a baseline-keyed noise rule or
any target-specific tolerance in the grader would forge the measurement, and each would have to be
maintained against a type environment nobody controls.

**What was deliberately NOT built:** no matcher allowlist, no baseline-keyed noise rule, no
target-specific tolerance, nothing that flips RXF to `genuinely_red`.

**The accepted consequence, stated as a cost rather than buried.** A produced test that uses a matcher
the repo REGISTERS AT RUNTIME, and that matches the house idiom the calendar spec itself uses, grades
`compile_error`. So jest-dom matcher choice partly decides RXF grading. That is a real property of a
real type environment, and it is recorded as a residual in
`.claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md` rather than engineered away.

**How to read it when the round runs:** a `compile_error` cluster on RXF is worth inspecting against
the recorded `new_tsc_error_lines` BEFORE attributing anything to an arm. If the recorded diagnostics
are jest-dom matcher `TS2339`s, that is this residual and not an arm effect.

---

## 7. What the adoption changed, and what it deliberately did not

**Scope: the radix targets ONLY.** GRC and SRVC stay on tsc and are byte-identical -- their
`targets.json` files were not touched, and `typecheck.checker` defaults to `tsc` precisely so that
absent config means the historical behaviour.

**Closed -- the Angular-template blind spot.** Before this, a template-broken produced test passed the
differential CLEAN while still throwing an honest-looking assertion failure. radix's own specs define
inline misuse-host-component templates, so a produced test plausibly defines one too. Now covered by
`fixtures/canary-rdxf-template/`: an `NG8007` two-way-binding defect that atc reports at error
severity and that a MEASURED tsc pass on the SAME spec does not report at all (55 baseline error
lines, 55 with it applied).

**Closed -- the append-onto-a-dirty-file gap.** `fixtures/canary-rdxf-append/` is the first canary in
the suite that appends to a file already carrying diagnostics. MEASURED: 0 NEW under the shipped
position-insensitive multiset while all eight of the calendar spec's jest-dom diagnostics shift by a
line, against 8 NEW under a raw positioned difference. This is the class the whole offline battery
lacked, and its absence is exactly how the position-sensitive differential survived a two-round plan
check, a code review, an 8/8 verification and a full bisect until a metered pilot surfaced it.

**Extended, not reused -- the vacuous-differential guard.** atc synthesizes its own error-severity
FILE-LESS diagnostics for the config layer, in a code space chosen deliberately outside both the
TypeScript and the Angular ranges (`ATC90001` for a references-only or empty project, `ATC90002` for a
referenced project that was not found). `isConfigLevelTscError` gates on `TS5xxx`/`TS6xxx`, so it is
blind to all of them: the fault would appear in BOTH differential passes, cancel in the subtraction,
and the gate would report a differential that checked ZERO root names as clean. MEASURED against a
real empty project: exit 1, `rootNamesCount` 0, and TWO file-less error diagnostics (`TS18002` and
`ATC90001`) -- the TypeScript-gated predicate reads NEITHER as config-level, because `TS18002` sits
outside its range too. `isConfigLevelTscError` is byte-unchanged for the tsc path; the atc predicate
requires a FILE and enumerates NO codes. Measured in the false-positive direction as well: ZERO of the
73 error-severity records in the healthy radix baseline is file-less, so the guard cannot hard-abort a
legitimate grade.

**OPEN -- a fidelity deviation, accepted knowingly.** atc resolves `@angular/compiler-cli` from its
OWN dependency tree rather than the target's, so the compiler doing the template check is not the one
radix ships. That departs from the grade-with-the-target's-toolchain principle the per-grade toolchain
copy upholds everywhere else. Accepted because the alternative is installing atc into a borrowed repo,
which is forbidden. Recorded as an open residual in RUN-GATE rather than hidden.

**RE-PRICED.** The differential now costs ~19 s per grade on radix rather than ~7.8 s (atc is ~2.2x
per pass and the differential runs two passes). Model spend is unchanged; only the grading columns
move, by about +3 min across a k=3 round's 18 radix runs. RUN-GATE's cost table, fan-out estimates and
Step 3c prose all carry the re-priced figures.

---

## 8. The pilot numbers are instrument calibration, NOT a result

Stated plainly because it would be easy to misread. The three approved pilot runs -- and the RXF
`compile_error` in particular -- measured whether the INSTRUMENT works. They are not an arm
comparison, they are not a Pass@k, and no conclusion about lz-red's effectiveness follows from them.
Every defect they surfaced (a trigger detector blind to slash-command invocation, an anti-RED apply
preamble, a borrowed-failure false PASS, and the position-sensitive differential) was an instrument
defect that offline work had not caught.

What they earned is confidence that the four-cell round would measure what it claims to. That round
remains GATED and unapproved.

---

## 9. Still open, and still gated

- **The ~$39 four-cell round** (4 cells x 3 arms x k=3 = 36 runs, at the MEASURED $1.09/run). Needs
  FRESH explicit approval naming the scope. NOT approved by this task.
- **A `with_skill` pilot on one cell (~$1.10).** No `with_skill` run has EVER happened on SRVC, RXF or
  RXL, and the D-04 auto-trigger dimension depends on it -- `invoke_skill` reads fired 0.00 BY DESIGN.
  Also unapproved.

Both are the only blocking human actions left on this phase. The research and the verdict this
document records are DONE.
