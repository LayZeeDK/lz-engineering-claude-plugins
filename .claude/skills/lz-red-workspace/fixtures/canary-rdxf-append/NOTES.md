# canary-rdxf-append -- an APPEND onto a file that ALREADY carries baseline diagnostics

The canary class the entire offline battery LACKED, and its absence is exactly how the
position-sensitive differential survived a two-round plan check, a code review, an 8/8 verification
and a full bisect until a metered pilot surfaced it. No offline fixture could reach the shape: GRC's
baseline errors live in production code its specs do not touch, srvx's baseline is 0 after its
prebuild, and every other canary creates a NEW file. It needed a real diff appending to a DIRTY file,
which is ordinary model behaviour rather than an edge case.

Grades `genuinely_red` / `pass:true` with ZERO new errors, exactly one attributed failure, and an
empty `changed_production_files`.

## What the diff does

Two hunks against `packages/primitives/calendar/__tests__/calendar.spec.ts` -- the spec carrying the
eight MEASURED jest-dom `TS2339` diagnostics:

1. **A hunk AT THE TOP** adding `import { startOfMonth } from '@internationalized/date';`. This is
   the strongest form of the exercise: it SHIFTS every one of the eight baseline diagnostics below it,
   so a position-sensitive differential re-counts all eight as the model's own.
2. **An appended self-contained `describe` at end of file** whose test asserts the documented focus
   attribute on the first day of the month. It fails on an assertion (`expected undefined to be '1'`)
   because the calendar emits the other attribute spelling -- a legitimate RED, nothing throws.

Deliberately does NOT use jest-dom matchers: those are the very diagnostics under test here, and
adding fresh ones would confound the measurement. `toBe` is vitest's own.

The appended test's title appears nowhere else in the file, so attribution can resolve it to exactly
one reported assertion.

Appending to a borrowed spec is already precedent here -- the kata's `canary-borrowed` does the same
thing.

## Measured, 2026-07-26

Same throwaway detached worktree at the pin (`4a7390a2b058457aa47c6f3e0e03b69b70dee025`), atc 0.2.4
run once as a baseline and once with this canary applied:

| | baseline | with this canary |
|---|---|---|
| exit / diagnostics | 1, 80 total / 73 error | 1, 80 total / 73 error |
| `calendar.spec.ts` jest-dom `TS2339` lines | 81, 82, 88, 89, 95, 96, 106, 110 | 82, 83, 89, 90, 96, 97, 107, 111 |
| NEW error diagnostics under the shipped position-INSENSITIVE multiset | -- | **0** |
| NEW under a RAW POSITIONED difference (the pre-fix rule) | -- | **8** |

Every one of the eight shifted by exactly one line, and the shipped subtraction cancels all eight
while a raw positioned difference would have reported all eight as the model's. That 8-versus-0 split
IS this canary's proof, and it is the metered pilot's shape reproduced end to end on the real atc path
against the real repo.

The five synthetic position-insensitivity assertions in `grade-red.mjs --selfcheck` already own the
UNIT-level discrimination and are checker-agnostic (they operate on normalized records), so this
canary deliberately does not rebuild it. Its job is the END-TO-END proof.

## Generation

The patch was produced by `git diff` inside that throwaway worktree, never by hand-writing hunk
headers.
