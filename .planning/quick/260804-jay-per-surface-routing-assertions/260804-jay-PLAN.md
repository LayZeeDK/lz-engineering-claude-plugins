---
quick_id: 260804-jay
description: >-
  Re-quantify the routing gate's exhaustiveness, catch-all and residual assertions PER
  SURFACE instead of over a pooled branch list, closing evasions E1, E2 and E7, and
  export the predicates so the selftest cannot drift from the gate again.
date: 2026-08-04
mode: quick-full
metered_spend: none
must_haves:
  truths:
    - "Every (step-1 surface, corpus case) pair is asserted INDEPENDENTLY: EXACTLY ONE report per pair,
       so 27 where there were 9, with both halves of a NONE assertion folded into that single report --
       deleting one skill's branch fails the gate even though its siblings carry an identical one."
    - "`[cls-02]` no longer prints PASS for a captured NONE case: for `expectedOwner: NONE` it requires
       ZERO self-claimants, not at-most-one."
    - "`CATCHALL_CONDITION_RE` covers the house residual vocabulary (`none of (a) through`, `none of
       the above`), so a self-claiming terminal in that vocabulary is flagged -- while the three real
       `1e` terminals are NOT flagged, because isBareCatchAll requires `&& !isResidual`."
    - "Each step-1 surface must carry its OWN declared residual terminal; borrowing a sibling's no
       longer satisfies the assertion."
    - "For a NONE case the gate asserts BOTH that a declared residual exists on that surface AND that
       zero non-residual branches positively cover it."
    - "`covers`, `owns`, `isDeclaredResidual` AND the pair-level quantifier `routesCase` are exported
       once and imported by BOTH the gate and the selftest. The quantifier matters most: the function
       that actually drifted was the selftest's `coveredBy` QUANTIFICATION, not the leaf predicates,
       which are byte-identical today. Sharing only the leaves would leave the drifted thing restated."
    - "All seven recorded evasions were re-run: E1, E2 and E7 flip GREEN -> RED; the three closed
       earlier stay RED **and redden their OWN named label**, so a wrong-site insertion cannot read as
       a pass; E5 stays GREEN and is documented as a named ceiling."
    - "The gate is GREEN on the shipped tree with no prose change -- PRE-MEASURED at 0 of 27 pairs
       failing, so no assertion was weakened to achieve it."
  artifacts:
    - .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs
    - .claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs
    - .claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs
  key_links:
    - .planning/quick/260804-hwy-close-the-four-unprimed-review-findings-/260804-hwy-deferred-items.md
    - .planning/quick/260804-jay-per-surface-routing-assertions/260804-jay-CONTEXT.md
---

# Quick Task 260804-jay -- per-surface routing assertions

## Why this is one task and not three

E1, E2 and E7 share a single root cause: the assertions are quantified over a POOLED branch list
rather than per surface. Fixing them separately would mean three guards where one structural change
does the job -- moving the case loops inside the surface loop. That is also the reviewer's own cheaper
recommendation.

## The research result that de-risks this, stated up front

A read-only probe evaluated the proposed per-surface predicate over all 3 x 9 pairs BEFORE writing any
guard: **0 of 27 would fail.** Each surface already owns every case correctly, each already carries its
own `1e` residual, and c9 is positively covered by zero non-residual branches on all three surfaces.

So this is a pure instrument-strengthening task with no prose consequence. **If the gate goes RED after
the refactor, the refactor is wrong** -- do not "fix" shipped Markdown to make it pass, and do not
weaken the predicate. Re-read the probe.

## Tasks

### T1. Export the three predicates AND the pair-level quantifier from `lib/routing-parse.mjs`

**Action.** Move `covers`, `owns` and `isDeclaredResidual` out of `check-rgr-routing.mjs` into
`lib/routing-parse.mjs` as exports, byte-preserving their logic. Import them in the gate. Keep the
existing explanatory comments with them -- the `owns` two-hop ORDER note and the `isDeclaredResidual`
"recognition is never by ABSENCE" note are load-bearing.

**Then add a fourth export, `routesCase(branches, kase)`**, returning `{ ok, why, via }`, holding the
ENTIRE per-pair decision: for a NONE case, a declared residual must exist among `branches` AND zero
non-residual branch may `covers()` it; otherwise some branch must `owns()` it. The gate's nested loop
body calls it, and the selftest's `coveredBy` IS it.

**Why the quantifier and not just the leaves.** The plan-checker established that the function which
actually drifted is the selftest's `coveredBy` -- the QUANTIFICATION -- not the three leaf predicates,
which are byte-identical between the two files today. Exporting only the leaves would leave the
drifted composition hand-written in both places and re-create the OPEN-5c defect one level up: the
selftest's new one-surface-loses-a-branch case would then prove a discrimination of the SELFTEST's
composition rather than the gate's.

**Verify.** `node .../check-rgr-routing.mjs` exit 0 and byte-identical report lines to the pre-change
run for every check EXCEPT the ones T2/T3 intentionally change. Diff the two outputs.

**Done when.** The gate imports the predicates and no copy remains in it.

### T2. Re-quantify `[cls-01]` exhaustive, and the residual, PER SURFACE

**Action.** Replace the pooled `step1Branches` loop with a nested loop: for each `STEP1_SURFACES`
entry, for each case, assert against THAT surface's own branches only. Emit one report per
(surface, case) pair -- 27 where there were 9 -- and name both in the label so a failure is
attributable. Keep `step1Branches` only if another assertion still legitimately needs a pooled view;
otherwise delete it rather than leave an unused pooled list that invites reuse.

For a `NONE` case, assert BOTH halves on that surface: a declared residual exists AND zero
non-residual branches `covers()` the case. **The second half is E7** -- asserting only existence is
what let a c9 capture print as `[PASS]`. Fold both halves into the SINGLE report for that pair, so the
count stays exactly one report per (surface, case) pair.

**Also fix `[cls-02]`, which is the other half of OPEN-3 and the source of its most misleading
symptom.** Measured by the plan-checker: under the E7 mutation `[cls-02]` still prints
`[PASS] ... c9 claimed by at most one step-1 procedure -- claimed by refactor-step1` for a case whose
whole point is that nobody owns it. The overall gate does go RED via `[cls-01]`, so the evasion is
caught -- but a reader triaging that run sees a line asserting the capture is fine. Branch on
`kase.expectedOwner === "NONE"` and require `claimants.length === 0`, with a label that says so.

**Verify.** Exit 0 on the shipped tree. Then re-run the E1 mutation from the deferred-items file
(delete `lz-red/SKILL.md` branch (a)) and confirm the gate now goes RED naming `red-step1`; restore and
confirm sha256-identical. Then the E7 mutation (add an `f.` branch to `lz-refactor` step 1 capturing
c9) and confirm RED. Both must have been verified PRESENT in the file before the gate is run --
a mutation that silently failed to apply produces a meaningless GREEN.

**Done when.** 27 pair reports; E1 and E7 mutations both RED; shipped tree GREEN.

### T3. Widen `CATCHALL_CONDITION_RE` to the house residual vocabulary

**Action.** Add the `none of the above` / `none of (a) through (...)` family to the regex, ANCHORED --
`\bnone\s+of\s+the\s+above\b|\bnone\s+of\s+\(?[a-z]\)?\s+through\b` -- not the loose `\bnone\s+of\b`.
The plan-checker measured that even the loose form matches only the three `1e` residuals across all 11
surfaces today, so this is future-proofing rather than a live fix: it stops a later narrative sentence
like "none of these smells applies, so route to lz-refactor" from being read as a catch-all. Keep it a
plain dumb family match otherwise -- its comment says dumb is what keeps it mutation-sensitive, and
that reason still holds. Update the comment to record that the house vocabulary is now covered and WHY
that does not flag the real terminals.

**Scope note from the checker:** the bare-catch-all loop iterates `ROUTER_SURFACES`, which is EIGHT
surfaces, not the three step-1 procedures. The widening was measured against all eight and against
`laws-classify` and `beck-seam`: zero delta, because no branch on any of them matches the old or new
family except the three residuals. Mode gates are outside the loop entirely.

**Do NOT** touch `RESIDUAL_MARKER_RE`, whose both-halves requirement is what keeps a
forgot-to-name-an-owner branch from passing as the residual.

**Verify.** The three `1e` terminals still report PASS (they satisfy `isResidual`, and
`isBareCatchAll` is `CATCHALL_CONDITION_RE.test(...) && !isResidual`). Then re-run the E2 mutation
(rewrite `lz-refactor` 1e to "None of (a) through (d): the request stays here anyway, and that is
lz-refactor.") and confirm the gate now goes RED on the bare-catch-all check.

**Done when.** E2 mutation RED, shipped terminals PASS.

### T4. Align the selftest and record the named ceiling

**Action.** Replace the selftest's hand-restated `covers` / `owns` / `isDeclaredResidual` with the
imported exports, and update its pooled-vs-per-surface fixtures so its mutation cases exercise the
per-surface shape. Update the export roster (exact-equality, so it WILL fail until updated -- that is
the gate working). Add a selftest case proving the per-surface assertion fails when ONE surface loses a
branch while its siblings keep theirs, since that is E1 in miniature and the thing a pooled assertion
could never catch.

Also add the E5 ceiling to the gate header as a NAMED limitation: `TEST_STATE_TOKENS` is a literal
blocklist, a novel paraphrase evades it, and the honest complement is the metered eval plus human
review. State it rather than leaving the axis looking closed.

**Verify.** `check-rgr-routing.selftest.mjs` exit 0, AND a literal-string check that the ceiling really
landed in the header -- `git grep -c -i "literal blocklist" -- <gate>` exits 0. The selftest cannot see
a header comment, so without this the E5 must_have is unfalsifiable. **`-i` is required and was found
the hard way:** the case-sensitive form exited 1 against a header that spells the phrase
`LITERAL BLOCKLIST`, so the check reported the documentation missing when it was present. Confirmed
discriminating by a negative control on the same path (an absent phrase exits 1).

**Done when.** Selftest imports `routesCase` rather than restating the quantification, covers the
per-surface shape, and the ceiling is documented and grep-verified.

## Verification battery -- exit codes, positive controls, no pipes

Measure every exit code WITHOUT a pipe: a pipeline reports the LAST stage's status, which already
produced one false reading this session.

- `node .../tools/check-rgr-routing.mjs` -- exit 0
- `node .../tools/check-rgr-routing.selftest.mjs` -- exit 0
- `npm --prefix .claude/skills/lz-red-workspace run check` -- exit 0
- `npm --prefix .claude/skills/lz-refactor-workspace run check` -- exit 0
- `node .../check-evals.mjs` -- exit 0
- `node .../merge-judge.mjs --selfcheck` and `tabulate-mechanical-red.mjs --selfcheck` -- exit 0
- `claude plugin validate .` and `--strict` -- exit 0
- **All seven evasions re-run**, each with its mutation verified PRESENT before the gate runs and each
  restore verified sha256-identical. **Sources, corrected:** `260804-hwy-deferred-items.md` records
  only FOUR (E1, E2, E5, E7) with verbatim mutations. The three closed earlier are in
  `260804-hwy-SUMMARY.md` lines 106-111, specified by CLASS plus expected failing label, not by
  verbatim text -- prose before item 1 and a later numbered step must redden
  `whole-section single-axis -- red-step1`, and a narrative sentence naming no slug must redden
  `whole-section single-axis -- red-narrative`. Require the NAMED label, not merely a red gate, so an
  insertion at the wrong site cannot read as a pass.
- ASCII-only; maintainer gmail identity; allowlist-inversion.
- Zero metered spend.

## Gates

- **No shipped `SKILL.md` is expected to change.** If one needs to, stop -- that means the predicate is
  wrong, not the prose. Confirm with `git diff --stat` that only the three instrument files moved.
- **MANDATORY from-scratch UNPRIMED review** before acceptance. It must be told nothing about what
  changed, and must be asked to attempt evasions of its own rather than confirm mine.
- No `/reload-plugins` needed: instrument files only, nothing shipped.
