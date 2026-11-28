---
quick_id: 260804-hwy
description: >-
  Close all four findings (D1, D2, D3, D4a-e) from quick task 260804-hbv's unprimed
  review. Instrument-first: widen the ban list and close the lettered lead-in blind
  spot BEFORE touching prose, so the fixes are falsifiable rather than asserted.
date: 2026-08-04
mode: quick
metered_spend: none
owner_decision: >-
  Owner chose the FULL scope, explicitly including D3 -- which overturns
  gsd-verifier's "omission, not contradiction" ruling on 22-VERIFICATION item 3 in
  favour of the reviewer's sharper argument that a single-surface router must not
  depend on a sibling's exclusion to win its own case.
must_haves:
  truths:
    - "TEST_STATE_TOKENS covers the SEMANTIC variant `no test is failing yet`, not just the two
       `nothing failing yet` literals, so the D1 wording cannot return undetected."
    - "The step-1 LEAD-IN prose (before branch `a.`) is an ASSERTED surface. It was outside every
       parsed branch because `letteredChunks` discards `parts[0]`."
    - "Both widenings are PROVEN RED at baseline -- 3 named failures with file:line -- before any
       prose edit, then GREEN after. Neither guard is weakened to manufacture the green."
    - "No shipped description or step-1 lead-in keys on test state, semantically or literally."
    - "Every folded description stays within the 1536-char cap, each with headroom recorded."
    - "c5 has a description-tier owner without relying on lz-red's exclusion; c8 has a
       description-tier tiebreak; c9 is declined by lz-refactor's description, not only by body
       branch (e)."
    - "lz-refactor's `## Two modes` gate classifies c1."
    - "Every destination-less exclusion for a loop-owned category either names its destination or is
       narrowed to genuinely unowned greenfield."
  artifacts:
    - plugins/lz-tdd/skills/lz-red/SKILL.md
    - plugins/lz-tdd/skills/lz-tpp/SKILL.md
    - plugins/lz-tdd/skills/lz-refactor/SKILL.md
    - .claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs
    - .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs
  key_links:
    - .planning/quick/260804-hbv-close-phase-22-description-completeness-/260804-hbv-deferred-items.md
---

# Quick Task 260804-hwy -- close all four unprimed-review findings

Source: `260804-hbv-deferred-items.md`. Every item was raised by a from-scratch UNPRIMED reviewer
given no history and no diff, and each was verified against file content with a positive control.

## Sequencing is the point: instrument BEFORE prose

Two of these findings exist because a guard could not see the defect. Fixing the prose first would
produce a green gate that proves nothing, which is the exact failure shape this repo refuses. So:

- **Wave 1 -- widen the instrument, assert RED.** Expect exactly three named failures:
  `lz-tpp` step-1 lead-in on `all prior tests green` (literal), `lz-red`'s description and
  `lz-refactor`'s description on `no test is failing yet` (semantic, newly covered).
- **Wave 2 -- fix the prose, assert GREEN.** Same guards, unweakened.

Record the RED output verbatim in the SUMMARY. A guard that was never RED is not evidence.

## Wave 1 -- instrument

### T1. `routing-parse.mjs`

1. **Widen `TEST_STATE_TOKENS`** with `no test is failing yet` and `no tests are failing`. Do not
   remove or reword an existing entry.
2. **Export `step1LeadIn(body)`** -- the prose of numbered item 1 BEFORE the first `a.` sub-item,
   flattened; `""` when item 1 has no lettered sub-items (the degenerate shape `letteredChunks`
   already returns whole), `null` when item 1 is absent. Reuse `numberedItem`; do not change
   `letteredChunks`.
   **Why a separate helper and not `parts[0]` as a branch:** emitting the lead-in as a routing
   BRANCH would feed it to the exhaustiveness, at-most-one and bare-catch-all assertions, which
   judge routing branches. The lead-in is not a branch. Mirror the `introBody` precedent instead --
   a dedicated surface with a dedicated single-axis check.
3. **D4e:** the comment at `:61-63` claims `beck-seam`'s heading is a DELIBERATE RED baseline and
   warns against "fixing" it. The file now carries `## The seam across the three steps`
   (`beck-tdd-by-example.md:70`), matching the surface entry, and the checker PASSES. Restate as
   history or delete. Verify the heading match before editing the comment.

### T2. `check-rgr-routing.mjs`

Add `[cls-03] step-1 lead-in single-axis` over `STEP1_SURFACES`, mirroring the existing
`[cls-03] intro prose` block: iterate the three step-1 surfaces, run `keysOnTestState` on
`step1LeadIn`, report per surface, and name the offending tokens in the failure message. Report
`false` when the lead-in is unreachable -- never skip. Update the header comment and the SUMMARY line
to name the new surface count.

### T3. Prove RED

Run the gate. Capture the three FAIL lines verbatim. Then run a positive control confirming the two
new tokens are detected and the old ones still are. **If the gate is GREEN here, stop** -- the guard
is not discriminating and the whole task is invalid.

## Wave 2 -- prose

### T4. Descriptions (all three ride the already-owed EVL-01 Round B)

**Budget is the binding constraint. Measure after every edit; three fixes compete for
`lz-refactor`'s headroom.** Pre-edit: lz-red 1422 / lz-tpp 1000 / lz-refactor 1476, cap 1536.

`lz-red/SKILL.md` description:
- **D1a:** drop the state conjunct at `:12-13`. "Also use it when the developer wants to ADD or
  CHANGE behavior and no test is failing yet: production code waits ..." -> drop
  " and no test is failing yet", keeping the causal clause that follows. The trigger must not be
  conditional on suite state.
- **D4b:** add the primary-ask tiebreak, one short sentence, e.g. "A combined ask belongs to its
  primary ask." c8 currently resolves only because `lz-refactor`'s branch (a) precedes branch (d)
  and hands off -- by ordering, not by selection.

`lz-refactor/SKILL.md` description:
- **D1b:** drop " when no test is failing yet" from the `:17` exclusion.
- **D3:** claim test-file code, e.g. ", including code in a test file," after "de-duplicate existing
  working code". This is what stops c5 depending on `lz-red`'s exclusion.
- **D4c + D4d:** rework the `:19` tail. It currently excludes "writing new code, adding a feature, or
  writing a function from scratch" -- but "adding a feature" IS loop-owned and `:17-18` already
  routes it to lz-red then lz-tpp, so the two sentences contradict each other. Narrow to genuinely
  unowned greenfield AND add the design-question decline that c9 needs.
- **Funding:** drop the third example quote `, or "how would you make it easier to read?"`. It is
  redundant against "improving the STRUCTURE or READABILITY" and "make such code more readable" in
  the same block, and it is one of the three phrasings the reviewer named as the c9 over-capture
  vector -- so removing it serves D4c and pays for D3.

`lz-tpp/SKILL.md` description (536 chars of headroom, the roomiest):
- **D4d:** give the `:14-15` add-a-feature exclusion its destination. Its own branch (c) forwards to
  lz-red then lz-tpp; the description names neither.

### T5. `lz-tpp/SKILL.md` step 1 -- the D2 prose half

Move the green-phase precondition OUT of the step-1 lead-in into its own numbered step, and reword it
off the banned phrase. Keep the "never by the state of the suite" sentence in step 1.

Two properties to preserve: it must stay sequenced AFTER routing (it is a precondition on ranking,
not a routing key), and it must not license an interrogation before coaching -- on c6 ("Make this
failing test pass.") the developer supplies none of the three facts, so treat them as assumed unless
the developer says otherwise. Renumber the following steps and fix every internal cross-reference to
a step number.

### T6. `lz-refactor/SKILL.md` `## Two modes` -- D4a

Coach mode covers "improve the structure or readability of existing code ... or which refactoring
applies to a smell in view"; reference mode covers explain/lookup/bare invocation. c1 ("I just
finished making a test pass. What now?") matches neither, yet the description and branch (d) both own
it. `## Two modes` is a parsed classifier surface, so extend the coach-mode clause to cover it.

## Verify -- by exit code, with positive controls

- `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` -- exit 0 in wave 2, and the
  wave-1 RED captured verbatim first.
- `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs` -- exit 0. The
  selftest guards the parser this task edits; it is the regression gate for T1.
- `npm --prefix .claude/skills/lz-red-workspace run check` -- exit 0.
- `node .claude/skills/lz-red-workspace/check-evals.mjs` -- exit 0.
- `node .claude/skills/lz-red-workspace/selfcheck-red.mjs` -- exit 0 (D-22: must stay byte-unchanged
  AND keep passing; the parser edit is upstream of it).
- `claude plugin validate .` and `--strict` -- exit 0.
- Description lengths + banned hits re-measured with the repo's own helpers, positive control firing.
- ASCII-only; maintainer gmail identity; allowlist-inversion, never a forbidden needle.
- Zero metered spend.

## Gates

- **MANDATORY from-scratch UNPRIMED review** -- three shipped `SKILL.md` files change, so this is
  non-negotiable and the orchestrator must not self-certify it.
- **`/reload-plugins` is a human action** afterward. Committed is not live.
- **All description edits must land before Round B.** That is why they are batched here.

## The trap, named again because it fired four times last session

Every absence claim carries an exit code (0 hits / 1 genuine absence / 2 command FAILED) and a
positive control on the same path. These files hard-wrap near 100 columns, so search multi-word
phrases wrap-tolerantly or search a rare single word and read around it.
