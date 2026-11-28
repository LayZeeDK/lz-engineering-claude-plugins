# Quick Task 260804-jay: per-surface routing assertions (E1/E2/E7) -- Context

**Gathered:** 2026-08-04
**Status:** Ready for planning
**Mode:** `--full --auto`

<domain>
## Task Boundary

Close the three remaining gate evasions that share one root cause, from
`.planning/quick/260804-hwy-close-the-four-unprimed-review-findings-/260804-hwy-deferred-items.md`:

- **E1 / OPEN-1** -- `[cls-01] exhaustive` is quantified over `step1Branches`, a POOLED list from all
  three step-1 procedures, so a single skill can lose its own routing branch with the gate GREEN.
- **E2 / OPEN-2** -- `CATCHALL_CONDITION_RE` matches only the `otherwise` / `else` family, while every
  shipped terminal uses "None of (a) through (d)", so a self-claiming catch-all in the HOUSE
  vocabulary passes.
- **E7 / OPEN-3** -- for `expectedOwner: "NONE"` the gate asserts only that a declared residual
  EXISTS, never that the case is not positively covered. A branch capturing c9 passed, and `[cls-02]`
  printed the capture as `[PASS]`.

Explicitly IN SCOPE as a consequence: `check-rgr-routing.selftest.mjs` restates six gate predicates
by hand with no drift detection, and `coveredBy` HAS already drifted -- it runs over one surface while
the gate pools three, so the selftest currently proves a discrimination the gate does not have
(OPEN-5c). A per-surface refactor that leaves the restatement untouched would silently re-open that.

Explicitly OUT OF SCOPE: E5 / OPEN-4 (the literal-blocklist ceiling -- inherent, to be STATED as a
named limitation, not closed), and every OPEN-5 item other than 5c.
</domain>

<decisions>
## Implementation Decisions

### Strictness of the per-surface assertion -- LOCKED: strict, and it is SAFE BY MEASUREMENT

Each step-1 surface must independently route EVERY corpus case: own the cases whose `expectedOwner`
is its own owner, route the others to their correct owner, and carry its OWN declared residual.

**This was the one genuinely high-impact / low-confidence choice, and it was resolved by measuring
rather than by argument** (the `--auto` trap-quadrant rule). A read-only probe evaluated the proposed
predicate over all 3 surfaces x 9 cases BEFORE any guard was written:

```
per-surface assertion: 0 of 27 (surface,case) pairs WOULD FAIL
refactor-step1 / red-step1 / tpp-step1: declared residual branches: 1 each (1e)
c9 positively covered by non-residual branches: 0 on all three surfaces
```

So the strict reading is GREEN on the shipped tree today. That removes the entire risk that motivated
hesitating: the refactor needs NO prose change, and it cannot be accused of being weakened to fit.
Had the probe gone RED, the plan would have had to judge each RED first -- real incompleteness versus
an over-strict predicate -- because the file's own header forbids weakening an assertion to pass.

Confidence is HIGH because it is measured. Auto-locking is therefore legitimate here.

### E2's regex widening -- LOCKED: widen the family, and it cannot flag the real residual

Add the `none of the above` / `none of (a) through (...)` family to `CATCHALL_CONDITION_RE`.

**Verified safe before locking:** `isBareCatchAll` is
`CATCHALL_CONDITION_RE.test(conditionText) && !isResidual`. All three shipped `1e` terminals satisfy
`isResidual` (the probe confirms each parses as a declared residual with zero destinations), so
widening the condition family cannot flag them. It flags exactly the evasion: a branch using the house
residual vocabulary that then claims the request for itself.

Also LOCKED: the residual assertion becomes per-surface, so each router must carry its own terminal
rather than borrowing a sibling's.

### E7 -- LOCKED: assert the negative, not just the positive

For a `NONE` case, assert BOTH that a declared residual exists on that surface AND that zero
non-residual branches positively `covers()` it. Asserting only existence is what let a capture read as
a pass.

### Selftest predicate drift -- LOCKED: export the predicates, import them in both places

Export `covers`, `owns` and `isDeclaredResidual` from `lib/routing-parse.mjs` and have the gate and
the selftest import the SAME functions. Hand-restating them is what allowed `coveredBy` to drift. This
changes the export roster, which the exact-equality roster gate will catch -- deliberately.

### Claude's Discretion

- Exact report-line wording and grouping, provided each failure names the surface AND the case.
- Whether the per-surface loop nests case-inside-surface or surface-inside-case, provided every
  (surface, case) pair is reported.
</decisions>

<specifics>
## Specific Ideas

The acceptance suite is already written and does not need inventing: `260804-hwy-deferred-items.md`
records the EXACT mutation for each of the seven evasions. Re-run all seven. E1, E2 and E7 must flip
from GREEN to RED; the three already closed must stay RED; E5 stays GREEN and is documented as the
named blocklist ceiling rather than silently tolerated.

The reviewer's own cheaper suggestion, adopted: move the `for (const kase of CASES)` loops INSIDE the
`for (const surface of STEP1_SURFACES)` loop. One structural change closes all three.
</specifics>

<canonical_refs>
## Canonical References

- `.planning/quick/260804-hwy-close-the-four-unprimed-review-findings-/260804-hwy-deferred-items.md`
  -- the four open items with per-evasion reproductions.
- `.claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` -- `[cls-01]` / `[cls-02]` blocks.
- `.claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs` -- `CATCHALL_CONDITION_RE`,
  `RESIDUAL_MARKER_RE`, `isBareCatchAll`.
- `.claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs` -- the hand-restated
  predicates and the drifted `coveredBy`.
</canonical_refs>
