---
quick_id: 260804-jay
status: complete
date: 2026-08-04
metered_spend: none
files_modified:
  - .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs
  - .claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs
  - .claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs
review_gate: "NEEDS WORK -- the requested refactor VERIFIED closed; a larger pre-existing weakness set found, most left open by decision"
reload_required: false
---

# Quick Task 260804-jay -- SUMMARY

## The requested work is done and independently verified

E1, E2 and E7 are closed. An UNPRIMED reviewer, given no history and briefed to ATTACK the gate rather
than confirm anything, applied 17 mutations and could **not** defeat any of these:

| Attack | Result |
|--------|--------|
| Delete lz-red's own branch `a.` while siblings keep an identical one (**this is E1**) | **RED** -- 3 failures naming `red-step1` routes c2/c3/c8 |
| Make lz-red's `1a` also self-claim c1 | **RED** -- `[cls-02] ... claimed for itself by 2 procedures` |
| Strip the no-owner marker from terminal `1e` (**E2's neighbour**) | **RED** -- both no-residual and bare-catch-all |
| Capture the no-owner case with a new branch (**this is E7**) | **RED** -- `refactor-step1 routes c9` |
| Rename a parsed `## ` heading | **RED** -- scan floor + 11 downstream |
| Plain over-cap description append | **RED** -- `1683 chars, -147 of headroom` |
| Literal banned token in a declared surface | **RED** -- both single-axis checks |

In its words: "the per-surface quantification really did close this."

## What changed

- **`[cls-01]` is per surface.** One report per (surface, case) pair -- exactly **27** where there were
  9 -- with both halves of a NONE assertion folded into the pair's single report.
- **`[cls-02]` bounds a NONE case at ZERO claimants.** Found by the plan-checker: under the capture
  evasion the old at-most-one bound PRINTED `[PASS] ... c9 ... claimed by refactor-step1` for a case
  whose whole point is that nobody owns it. `[cls-01]` caught the capture, but a reader triaging that
  run met a line asserting it was fine.
- **`CATCHALL_CONDITION_RE` covers the house vocabulary**, anchored. Measured zero delta across all
  eight router surfaces.
- **`covers` / `owns` / `isDeclaredResidual` AND `routesCase` exported**, imported by gate and
  selftest. The plan-checker caught that my original must_have was FALSE: the function that actually
  drifted was the selftest's `coveredBy` QUANTIFICATION, not the leaf predicates, which were
  byte-identical. Sharing only the leaves would have re-created the defect one level up.

## Then the review broke the description checks I had been citing as evidence all session

**BLOCKING-1, and it is the most important thing in this task.** `foldedDescription` stopped at the
first line failing `/^\s+\S/` -- i.e. at the first BLANK line. A blank line inside a YAML folded
scalar is **valid and part of the value**. Two mutations exploited it:

- a blank line right after `description: >-` made the fold return `""`, and the gate reported
  **`0 chars, 1536 of headroom`** and **`banned=[]`** for a description that was fully intact and
  carried a literal banned token;
- a blank line mid-block made it return a PREFIX -- 1128 measured against a true 1870, i.e. **334 over
  the cap**, reported as "408 of headroom".

So every description-cap and description-single-axis number I reported this session was defeatable.
The check that "caught" my own 1551-char overshoot would have passed it silently with one blank line.

**Fixed two ways.** The fold now ends only where YAML says the block ends (a line that is neither
blank nor indented), and both description checks carry a 200-char anti-vacuity FLOOR that refuses
rather than reporting a reassuring number over text it could not see. Proven against both original
mutations: now `1559 chars, -23 of headroom` + `keys on [tests are green | has a smell]`, and
`1658 chars, -122 of headroom` + the same tokens. The floor was driven with a 10-char description and
both checks refuse.

**My fold fix then had its own bug, and the selftest caught it.** Emitting an empty entry per blank
line joined to a DOUBLE space, inflating every measured length by one char per blank line. The
mid-block leg failed with `"alpha beta  gamma delta"`. My expectation was right and my code was wrong.
Blank lines are now skipped entirely.

## Five stale or false comments, three of them mine from this session

| file:line | Was | Now |
|-----------|-----|-----|
| `check-rgr-routing.mjs` cap comment | "understated lz-refactor's budget by 250 chars" | **Inverted.** 1245 vs a real 1495 OVERSTATED it -- implied ~291 chars of room where 41 exist. Overstating is the dangerous direction |
| `check-rgr-routing.mjs` header | "caught two separate **over-cap** edits (1508 ..., then 1551 ...)" | 1508 is UNDER 1536, so it was never an over-cap catch. Only 1551 was |
| `check-rgr-routing.mjs` header inventory | omitted the whole-section check | Now lists it, and says why omitting the only whole-region check was the wrong thing to leave out |
| `routing-parse.mjs` catch-all note (mine) | "closes the evasion" | **Overclaim.** It closes ONE wording. Now carries a NAMED CEILING paragraph -- a later review walked through it with "In all remaining cases" |
| `routing-parse.mjs` `step1LeadIn` doc (mine) | orphaned 88 lines from its function, fused into the predicates banner | Relocated to sit on the function |
| `routing-parse.mjs` `isBareCatchAll` note (pre-existing) | "today's FOUR shipped catch-alls say 'otherwise ... is this skill's work'" | **False and measured false** -- `is this skill's work` is absent from `plugins/` (exit 1, positive control exit 0). It also directly contradicted my new note 460 lines above. Corrected as history; the predicate itself was always right, only its evidence was stale |
| `selftest` SCOPE note | "`covers`/`owns` are a deliberate minimal restatement" and the gate's wiring is evidenced "by its asserted-RED baseline" | They are imported now, and that baseline is CLOSED so that evidence no longer exists. Both corrected, and the remaining hand-restatements are named as still-unguarded |

## Verification -- exit codes measured without pipes

| Check | Result |
|-------|--------|
| `check-rgr-routing.mjs` | exit 0 |
| `check-rgr-routing.selftest.mjs` | exit 0, incl. 6 new `foldedDescription` legs and 7 `routesCase`/catch-all legs |
| Both workspace batteries, `check-evals`, `merge-judge --selfcheck`, `tabulate --selfcheck` | exit 0 |
| `claude plugin validate .` / `--strict` | exit 0 |
| Seven-evasion suite | E1/E2/E3/E4/E6/E7 **CAUGHT** with their own named labels; E5 GREEN as the documented ceiling |
| Fold proof | both original mutations caught on BOTH description checks; floor drives; restores sha256-identical |
| Shipped skills | `git diff --stat -- plugins/` EMPTY -- instrument only, so no reload needed |

Zero metered spend. The plan's own stop condition held: no shipped Markdown needed changing, which is
what the 0-of-27 pre-measurement predicted.

## Left OPEN by decision -- see `260804-jay-deferred-items.md`

The review found **16 successful evasions**. Three were the task's targets and are closed; BLOCKING-1
is closed because it invalidated evidence I had cited. The remaining set is pre-existing instrument
weakness, recorded with exact reproductions rather than fixed, because this repo's record is that
consecutive hand-patching rounds each introduce a fresh instance of the class they repair -- and this
task proved that again three times over: two false comment claims and a double-space fold bug, all
mine, all caught by something other than me.

Headline items still open: the sweep-rule citation check is **tautological** (`"changing behavior"`
matches `"without changing behavior"`, so its destination set contains all three skills and the check
collapses to "some sentence contains `(step 1)`"); **five of eight router surfaces carry no
correctness assertion at all**; `owns()` inspects only `destinations[0]`; `isBareCatchAll`'s
`!isResidual` conjunct lets a declared residual claim everything; and all three `## Two modes` gates
fail to classify most of what their own step-1 claims.
