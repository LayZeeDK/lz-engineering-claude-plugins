# canary-rdxf-template -- a defect atc REPORTS and tsc does NOT

The NEGATIVE control for the Angular-template half of the radix differential. It exists because tsc
is STRUCTURALLY BLIND to template diagnostics, so before the atc adoption a template-broken produced
test passed the differential CLEAN while still throwing an honest-looking assertion failure -- the
same false-pass class the measured counterfactual proved the differential exists to close.

Grades `compile_error` / `pass:false`, and the recorded new-error line is ANGULAR-coded rather than
TypeScript-coded. That code family is the whole point: `canary-rdxf-compile`'s TypeScript-code
assertion does not transfer, and asserting the family is what pins that atc is seeing what tsc
cannot.

## The defect

`[(locale)]="locale"` on `rdxCalendarRoot`. `locale` is a plain `input<string>('en')` on
`RdxCalendarRootDirective` (calendar-root.directive.ts:53) with NO matching `localeChange` output, so
the property half binds to the directive's input while the event half falls through to the host
element. Angular reports `NG8007`, "The property and event halves of the two-way binding 'locale'
are not bound to the same target."

Chosen from the MEASURED atc-versus-tsc delta rather than picked from memory, against the plan's
three requirements in order:

1. **atc reports it at ERROR severity.** `NG8007` is error-severity; a warning-severity diagnostic
   (`NG8113`, the other Angular code in the delta) would never enter the differential at all.
2. **tsc does not report it.** MEASURED, see below.
3. **It is RUNTIME-INERT.** `gradeRun` runs the target's runner BEFORE it classifies, so a defect
   that crashed the runner would produce a throw instead of a verdict. The event half becomes a DOM
   listener for an event that never fires. This is not reasoning -- it MIRRORS the shape of the seven
   real `NG8007` sites already in this repo's own specs (number-field.spec.ts:27 and :72,
   slider.spec.ts:90, :127 and :492, switch.spec.ts:16, checkbox-root.directive.spec.ts:418), every
   one of them a `[(value)]` / `[(checked)]` two-way binding on an inline misuse-host template, in a
   suite the repo runs green.

## Measured, 2026-07-26

In a throwaway detached worktree at the pin (`4a7390a2b058457aa47c6f3e0e03b69b70dee025`) with both
declared toolchain paths copied in, running each checker once as a baseline and once with this
canary's spec applied:

| checker | baseline | with this canary | NEW |
|---|---|---|---|
| atc 0.2.4 (`-c packages/primitives/tsconfig.spec.json --format json`) | exit 1, 80 diagnostics / 73 error, 9.040 s | exit 1, 81 diagnostics / 74 error, 9.099 s | **1** -- `NG8007` at `canary-rdxf-template.spec.ts(18,16)`, error severity |
| tsc 6.0.3 (`--noEmit --strict -p packages/primitives/tsconfig.spec.json`) | exit 2, 55 error lines across 17 files, 4.533 s | exit 2, 55 error lines, 4.066 s | **0** |

So the SAME spec is tsc-CLEAN. That is precisely the hole atc closes, and it is measured here rather
than asserted.

tsc's template blindness is measured directly too: ZERO of its 55 baseline error lines is
Angular-coded, against atc's 15 Angular diagnostics on the identical project.

## Generation

The patch was produced by `git diff` inside that throwaway worktree after `git add -N`, never by
hand-writing hunk headers.
