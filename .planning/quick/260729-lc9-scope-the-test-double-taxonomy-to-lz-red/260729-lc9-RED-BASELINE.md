# quick-260729-lc9 RED BASELINE -- the falsifiability record for nine guards

Instrument-first. Every guard below was added to `check-red-references.mjs` BEFORE any content edit and
BEFORE the deletion this task performs, and every one was OBSERVED against the unmodified tree. This
file is the record of that observation, because two of the three proofs it carries cannot be re-derived
afterwards: guard N2's baseline hits are destroyed by the very deletion N2 exists to police, and guard
N9's rejection of a wrong placement is not visible from a green battery.

All measurements taken 2026-07-29 against the tree at commit `0990862`.

## The nine guards

Evidence form follows the guard's DIRECTION, because demanding a `file:line` from a presence-required
guard is unsatisfiable -- there is no line to cite for a phrase that is absent.

| Guard | Composed label AS EMITTED | Direction | Proof kind | Evidence |
|---|---|---|---|---|
| N1 | `[lc9] no ragged pipe table` | shape-invariant | `invariant-GREEN + fixture set` | 0 ragged rows across the shipped tree, so no baseline failure exists and none was manufactured. Proof is the six-case fixture set below. |
| N2 | `[lc9] every relative markdown link resolves` | ABSENCE-required (fails because the dead link IS there) | `RED-at-baseline` | 2 located hits, both pointing at `principle-backing.md`, which exists only under `lz-red/references/`: `plugins/lz-tdd/skills/lz-refactor/references/test-double-taxonomy.md:289` and `plugins/lz-tdd/skills/lz-tpp/references/test-double-taxonomy.md:289` |
| N3 | `[lc9] no test-double taxonomy copy in the shipped tree` | ABSENCE-required (fails because the copies ARE there) | `RED-at-baseline` | 3 located hits. This gate keys on a BASENAME, so its hit is a path and there is no line to cite; fabricating one would be a worse record than saying so. `plugins/lz-tdd/skills/lz-red/references/test-double-taxonomy.md`, `plugins/lz-tdd/skills/lz-refactor/references/test-double-taxonomy.md`, `plugins/lz-tdd/skills/lz-tpp/references/test-double-taxonomy.md` |
| N4 | `testing-stance/message-matrix.md: [lc9] Test Spy named for the record-then-inspect double` | PRESENCE-required (fails because the name is NOT there) | `RED-at-baseline` | phrase `test spy` absent from `message-matrix.md`, measured count 0 |
| N5 | `testing-stance/message-matrix.md: [lc9] no Mock rule label` | ABSENCE-required (fails because the label IS there) | `RED-at-baseline` | 4 located hits: `message-matrix.md:38`, `:47`, `:57`, `:67` |
| N6 | `testing-stance/functional-core.md: [lc9] no Mock rule label` | ABSENCE-required (fails because the label IS there) | `RED-at-baseline` | 2 located hits: `functional-core.md:42` (an H2 heading) and `:44` (a bullet label) |
| N7 | `[lc9] mockist label attributed to Fowler at both sites` | PRESENCE-required (fails because the attribution is NOT there) | `RED-at-baseline` | phrase `Fowler's label` absent from BOTH `anti-patterns.md` and `principle-backing.md`, measured count 0 in each |
| N8 | `[lc9] lz-tpp/SKILL.md carries the side-qualification rule inline` | PRESENCE-required (fails because the rule is NOT there) | `RED-at-baseline` | phrase `which side they mean` absent from `lz-tpp/SKILL.md`, measured count 0 |
| N9 | `SKILL.md: [lc9] side-qualification rule inline in the coach procedure` | PRESENCE-required, PLACEMENT-scoped | `RED-at-baseline` | phrase `which side they mean` absent from `lz-red/SKILL.md`, measured count 0. Plus the three-way discrimination below, which is the half a bare absence measurement cannot carry. |

Measured for completeness: `which side they mean` occurs at baseline ONLY inside the three taxonomy
copies (one line each), all three of which this task deletes. So neither N8 nor N9 can be satisfied by
surviving text; the rule has to be written inline.

## N9's three-way discrimination, measured THROUGH THE REAL EVALUATOR

N9's label asserts a PLACEMENT, so "absent, measured count 0" proves only half of it. The other half is
that the guard REJECTS the placement its label calls wrong. Measured by writing three variants of the
live `lz-red/SKILL.md`, running the real `node check-red-references.mjs` for each, and reading the
emitted verdict line for N9's own label -- not by reasoning about the regex in isolation, which is the
error that cost this task an iteration.

- `absent -> RED`
- `in-procedure -> GREEN`
- `appendix-only -> RED`

The last one is the load-bearing result: it is the only evidence that the guard is not overclaiming its
placement.

NEGATIVE CONTROL, measured the same way, on a throwaway copy of the checker carrying the FORBIDDEN bare
needle instead of the region-scoped one: `absent -> RED`, `in-procedure -> GREEN`,
`appendix-only -> GREEN`. So the bare needle is satisfied by exactly the appendix placement the label
forbids, and the region scope is what makes the label honest rather than decorative. Both probes
restored `lz-red/SKILL.md` to its committed bytes and verified the restore; the throwaway checker copy
was deleted.

The region scope also required a one-line evaluator change: the `topics` matcher splits the file into
lines before testing, so a needle containing a newline can never match any line. Without that change
N9 is RED-ALWAYS and no correct content can satisfy it. The opt-in is per entry and is set on N9 alone.

## N1's fixture set -- its entire falsifiability proof

`scanTables` is invariant-GREEN against the shipped tree, so these in-memory fixtures in
`row-guards.selftest.mjs` are the proof that it can fail. All six PASS.

1. a well-formed three-column table -> 0 offenders, 1 table.
2. a data cell deleted TOGETHER WITH its pipe -> exactly 1 offender, verbatim
   `table at line 1: header is 3 wide, but 1 row(s) differ -- line 3 is 2`. This is the mutation the
   gate exists for: the row renders short in GFM and `parseRows` silently SKIPS it.
3. the same cell BLANKED with its pipe KEPT -> 0 offenders. A different gate's job, deliberately: the
   row stays the right width and the two mutations render identically.
4. a ragged-looking table inside a code fence -> 0 tables, 0 offenders.
5. two tables of different widths separated by a blank line -> 2 tables, 0 offenders.
6. `scanTables("")` -> 0 tables, 0 offenders. This is WHY the anti-vacuity control lives on the table
   count in the checker and not here: "no ragged tables" is true of an empty document, so the pure
   function cannot fail on empty text and only the caller can catch a scan that read nothing.

Plus six `findLinkTargets` cases (one per kind, a file-plus-fragment target, and a link inside a fence)
and one new `parseRows` case: a row containing a backslash-escaped pipe parses to the intended width.

## Dated snapshot -- correct for this commit ONLY

Recorded here rather than in any instrument comment, because the deletion later in this task falsifies
every one of these numbers. An instrument comment stating a number that a later commit changes is a
defect, not documentation; the instrument asserts the INVARIANTS instead (a zero, or a nonzero seen-count
via each gate's anti-vacuity leg).

| Quantity, over the shipped `plugins/` tree | At this commit |
|---|---|
| markdown files walked | 197 |
| pipe tables | 31 |
| pipe-leading rows | 405 |
| ragged rows | 0 |
| inline links | 1014 |
| relative links | 984 |
| anchor links | 30 |
| external-scheme links | 0 |
| absolute links | 0 |
| reference-style link definitions | 0 |
| links inside code fences | 0 |

Those four ZEROES are the load-bearing facts, and they are the ones written into guard N2's comment:
they are why no allowlist is needed, and they are invariant across the deletion. The totals are not
written there.

## The exact failure set this commit leaves behind

`check-red-references.mjs` exits 1 with EXACTLY 8 `[FAIL]` lines, and the roster gate PASSES at 183
emitted checks -- proving nine guards were added and none dropped or duplicated. The eight:

1. `testing-stance/functional-core.md: [lc9] no Mock rule label`
2. `testing-stance/message-matrix.md: [lc9] Test Spy named for the record-then-inspect double`
3. `testing-stance/message-matrix.md: [lc9] no Mock rule label`
4. `SKILL.md: [lc9] side-qualification rule inline in the coach procedure`
5. `[lc9] every relative markdown link resolves` -- 2 unresolved, both at `:289`
6. `[lc9] no test-double taxonomy copy in the shipped tree` -- 3 copies
7. `[lc9] mockist label attributed to Fowler at both sites` -- absent from both files
8. `[lc9] lz-tpp/SKILL.md carries the side-qualification rule inline`

`[lc9] no ragged pipe table` PASSES, as designed. This is a DELIBERATE RED WINDOW with an exactly
enumerated failure set: the exact count is what stops a real failure hiding inside a designed one.

Nothing under `plugins/` was changed by this commit.

## What these proofs do NOT establish

Stated so a reviewer does not have to find it.

- The `splitCells` count leg proves the name is defined and used at least twice. It does not prove the
  two uses are inside `parseRows` and `scanTables` respectively.
- The `tablesSeen` / `linksSeen` leg proves the two counters are named in the checker. It does not prove
  the comparison feeds the guard's `report()`.
- Source-presence of the verbatim offender string plus a green selftest kills the "wrote nothing" case.
  It does not prove `scanTables` PRODUCES the string -- the literal could sit in a comment, or be
  hardcoded on both sides of one assertion.

All three are named for the orchestrator's follow-up reads.
