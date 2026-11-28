---
quick_id: 260728-1pj
description: Build the lz-red forcing-function probe and halt at the metered gate
date: 2026-07-28
status: complete
outcome: probe NOT built; a blocking skill defect was found instead, specified, and left unapplied
metered_spend: none
shipped_tree_touched: no
---

# Quick 260728-1pj -- Summary

## What was asked

Run the next probe: the forcing-function probe proposed in the Phase-21 eval record (embed an
always-active enumerate-and-decide step in `lz-red`'s `SKILL.md`, A/B it held-out with paired recall
and precision targets). Full pipeline, `--auto`.

## What actually happened

The research step found a blocker that outranks the probe, so the probe was never built. A
self-contradiction in the shipped skill means any forcing function added on top of it would lock in
whichever branch its wording happened to favour and measure noise. The task became: settle the
doctrine, fix the contradiction.

The fix was drafted twice, reviewed twice, and reverted both times. **The shipped skill is
byte-unchanged.** The corrected fix spec is preserved in `260728-1pj-FINDINGS.md` section 6.

## The defect

`SKILL.md` step 2 blesses stopping at a reference to a not-yet-defined symbol; step 5 forbids exactly
that and demands an AssertionError. The D-06 gate implements step 5's side, so the skill can steer a
model into the state its own gate fails. Reachability is measured: 3 of 9 RXL runs reasoned from the
step-2 doctrine, and **0 of 3 baseline runs did** -- the reasoning appears only where the skill was
loaded.

## What was settled (three oracle consultations, zero spend)

- **No owned source requires the red to be an assertion failure.** Unanimous. Step 5's absolute is
  unsupported.
- **The sources do support the test CARRYING a discriminating assertion** (assertion presence, not
  assertion-as-the-failure).
- **Whether a compile error counts as the red in a language that cannot run is unadjudicated by all
  three** -- legitimately lz-red's call, and it must carry the `no-oracle` tag.
- Beck IS owned via written content (Canon TDD). An earlier claim in this task that Beck was unowned
  was wrong and is corrected.
- Store gap recorded: Beck's 2002 TDD book is the keystroke-granularity authority here and is held
  summary-only.

## Why nothing shipped

Four proposals died, each to a gate rather than to inspection:

1. Gate precedence rule -- killed by the negative control (`canary-compile` has
   `attributed_failures: 1`, so the rule would flip a control to pass).
2. Missing-symbol exemption -- killed by Beck's doctrine.
3. "Step 5 unfaithful, step 2 faithful" -- killed by the transcripts; both steps are partly wrong.
4. The execution criterion -- killed empirically by the second reviewer, which ran the repo's own
   grader and showed a throwing stub grades `wrong_reason`, and showed the criterion is factually wrong
   for Vitest + TS (types are erased, so an unresolved identifier throws INSIDE the body).

The right line is the **compile** axis, which the pre-change wording already had; only the assertion
absolute was wrong.

## State on disk

- `plugins/lz-tdd/` -- unchanged, verified clean.
- Phase-21 committed eval numbers -- stand. The gate is correct as designed; its strictness is an
  eval-design choice, recorded as such.
- Artifacts: `260728-1pj-RESEARCH.md` (ranked force-functioning candidates),
  `260728-1pj-FINDINGS.md` (doctrine, dead ends, and the 7-item fix spec).

## Follow-ups

1. Implement the 7-item spec in FINDINGS section 6, in a fresh session, with its own unbiased review
   and `/reload-plugins` afterwards.
2. Owner judgement call recorded but not made: the stub instruction moves lz-tpp's highest-priority
   ranked transformation across the lz-red/lz-tpp seam.
3. The forcing-function probe remains unbuilt and unrun. Its strongest candidate is now better
   grounded: sample the suite's assertion convention by COUNT before writing (RXF used a form present
   in 1 of 142 spec files while the compiling dominant form sits in 90).
4. Phase 21 close-out is still outstanding: teardown, `/gsd-secure-phase 21`,
   `/gsd-validate-phase 21`, `/gsd-extract-learnings 21`, then the milestone.
