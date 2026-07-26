# Phase 21 -- the RXL `with_skill` pilot (2026-07-27)

Two user-approved `with_skill` apply runs on the RXL cell, bought to measure the D-04 auto-trigger
dimension. Total spend **$1.9286**. Graded through `angular-typechecker` (atc), adopted earlier the
same session by quick task `260726-uqn`.

## Why it was bought

D-04 (does `lz-red` fire on its own?) is unmeasurable in the `invoke_skill` arm by construction --
that arm forces the skill via its slash command, so `fired` reads 0.00 no matter what. No `with_skill`
run had EVER happened on SRVC, RXF or RXL. RXL was chosen over the primary RXF cell deliberately: RXF's
landing file carries the eight jest-dom `JestMatchers` diagnostics, so a house-idiom test there grades
`compile_error` on matcher choice, which would have burned the sample on a known confound. RXL's
landing directory has no jest-dom matchers at all, and RXL already had an `invoke_skill`
`genuinely_red` result to pair against.

## The three runs

All three are on the same cell and the same prompt (`r2`), and all three touched zero production
files.

| Run | Arm | Token the produced test bound to | Verdict | `changed_production_files` |
|---|---|---|---|---|
| `r2` run-1 | `invoke_skill` | `LOCALE_ID` -- EXISTS in `@angular/core` | `genuinely_red` PASS | 0 |
| `r2` run-1 | `with_skill` | `RDX_LOCALE` -- DOES NOT EXIST at the pin | `compile_error` | 0 |
| `r2` run-2 | `with_skill` | `RDX_LOCALE` -- DOES NOT EXIST at the pin | `compile_error` | 0 |

Per-run detail for the two `with_skill` runs:

| Dimension | run-1 | run-2 |
|-----------|-------|-------|
| Cost | $1.1535 | $0.7751 |
| Wall clock | 222.6 s | 209.0 s |
| Turns | 17 | 20 |
| Produced spec | `config/__tests__/locale-inheritance.spec.ts` (NEW file) | appended to `config/__tests__/config-provider.spec.ts` |
| NEW differential errors | 1 -- `TS2305` no exported member `RDX_LOCALE` | 2 -- same `TS2305` plus `TS18046` `'locale'` is of type `unknown` |

run-1 deliberately isolated its test in a new file, reasoning that importing a missing symbol into
`config-provider.spec.ts` would take that file's passing test red through a whole-file load error.
run-2 appended instead, so run-1 was the more careful of the two on test isolation.

## D-04: ANSWERED, 2/2 fired

Corroborated four independent ways per run:

- `skills_model_fired: {"lz-red": 1}`
- `skill_forced: false`, `forced_skill: null`
- `skills_invoked: ["lz-tdd:lz-red"]`
- `tool_calls` shows the `Skill` tool called once

Model `claude-opus-4-8` at effort `high`. This is the first `with_skill` firing ever recorded on SRVC,
RXF or RXL. The project's standing caveat about the trigger flag concerns FALSE NEGATIVES, so a
positive corroborated four ways is the trustworthy direction.

## Coach-don't-drive: 3/3 perfect

`changed_production_files: []` on every run. run-1 `with_skill` wrote "I stopped here per the red
phase", handed the green step over as instructions (define the token, provide it via
`useFactory: () => inject(RadixNG).locale`) rather than doing it, and asked a design question before
proceeding. It also independently derived the correct root cause: storage is already green,
`RDX_DIRECTION` is bridged at `config.provider.ts:43`, and locale has no such bridge.

## The finding -- the verdict is decided by a DESIGN choice, not by RED discipline

`invoke_skill` asserted `TestBed.inject(LOCALE_ID)).toBe('de')`. `LOCALE_ID` is a framework token, so
that compiles and fails on an assertion. Both `with_skill` runs asserted `TestBed.inject(RDX_LOCALE)`,
mirroring how `RDX_DIRECTION` is bridged in the very file they were pointed at -- the library's own
convention -- and that token does not exist yet, so the test cannot compile.

So the pass/fail split tracks which token the model imagined. The `with_skill` choice arguably matches
the repo's actual wiring convention BETTER; `invoke_skill` took a framework-native shortcut.

**The PASS is no more trustworthy than the failures.** This cell's own `discipline_traps` require the
produced test to assert THE RENDERED MONTH HEADING, "not that the service holds the value". Neither
arm did that -- `invoke_skill` asserted an injection token too, it merely picked one that compiles. So
RXL's `genuinely_red` certifies "chose a compiling token", not the observable-behavior discipline the
cell was built to measure.

Not an instrument defect and not an atc artifact. The `with_skill` verdict is DOUBLE-DETERMINED: both
runs also failed at runtime with `TypeError: Cannot read properties of undefined` from
`TestBed.inject(undefined)`, which matches `RUNTIME_RE`, so they would grade `wrong_reason` even with
the differential removed. And `TS2305` is a plain TypeScript code that tsc reports identically, so
this is unrelated to the checker switch.

## Decision (owner, 2026-07-27)

**Report RXL on the DISCIPLINE dimensions ONLY.** RXL stays in the round, but its mechanical D-06
verdict is treated as design-confounded and EXCLUDED from the headline. RXL is reported on
coach-don't-drive, drive-attempt evidence (`changed_production_files`), and D-04 auto-trigger, where
it discriminates cleanly and both arms look strong.

No gate change, no prompt change, and no captured verdict reclassified -- all three stand exactly as
graded. This is a scoping statement about what the cell measures, grounded in three measured runs and
taken BEFORE the round rather than after an inconvenient number.

The reason it matters: left in the headline, RXL would likely read as `with_skill` 0/3 against
`invoke_skill` up to 3/3, inviting the conclusion "auto-trigger produces worse RED" when the real
difference is a defensible architecture choice. That is a PLAUSIBLE BUT WRONG causal claim, and so
more dangerous than the accepted RXF jest-dom confound, which at least reads as obvious noise. It is
the same correction class as the Phase-20 finding where the grader measured house VOCABULARY rather
than substance and the headline had to be reported substance-only.

## Cross-references

- `e2e-red-gilded-rose/RUN-GATE.md` -- the calibration table, the reporting rule in Step 7, and the
  OPEN residual carrying this finding.
- `21-ATC-ADOPTION.md` -- the atc adoption these runs were graded through, and the settled
  JestMatchers mechanism.
- Captured artifacts (git-ignored): `e2e-red-radix-ng/results/apply/with_skill/r2/run-1` and `run-2`,
  and `results/apply/invoke_skill/r2/run-1` for the paired comparison.

## Still outstanding

The ~$39 four-cell round (4 cells x 3 arms x k=3 = 36 runs at the measured ~$1.09/run) is NOT
approved and REMAINS OPEN as the only blocking human action. Nothing technical blocks it.
