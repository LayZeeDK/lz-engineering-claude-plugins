---
quick_id: 260716-oby
slug: add-loops-pipeline-few-shot-typescript-e
status: complete
completed: 2026-07-16
---

# Quick 260716-oby: Loops/pipeline few-shot TypeScript examples -- Summary

Added few-shot before/after TypeScript pairs to the shipped Replace Loop with Pipeline catalog
leaf to aid recognition of accumulation-loop shapes the model was missing. Closed 2026-07-16;
this closing SUMMARY was authored retroactively at milestone close (the PLAN paused at
`status: in-progress` with review PENDING because both reviewers died on the session/API limit).

## Outcome

- **Change:** `references/fowler-catalog/replace-loop-with-pipeline.md` `## Example` expanded
  1 -> 5 labeled before/after pairs (filter+map kept; reduce sum; group-by into Map; union into
  Set/flatMap -- the `getTypesOfSchema` shape; classify into Set -- the enum shape), each naming
  the accumulator trigger cue. Placed in the catalog leaf (progressive disclosure), not the lean
  `SKILL.md` router. All TS fences tsc --strict clean; catalog + hygiene gates GREEN.
- **Shipped on teaching merit** (3138bbe) -- the examples have value independent of the eval,
  per the pre-registered decision.
- **Held-out recognition eval** (gated, user-approved; `getTypesOfSchema` target, EDITED-vs-PREEDIT
  leaf toggle, invoke_skill apply k=3): **NULL idiom lift (0/3 = 0/3), zero regression** (c067599).
- **Conclusion:** the miss is a recognition-at-inference salience ceiling (skill content not
  adjacent to the target code), which more example content cannot move -- exactly the research
  pre-registration. Per that decision, stopped editing skill content for recognition; the examples
  are retained on teaching merit. (The later skill-level forcing-function probe, not this task, is
  what flipped the output-warrant axis.)

## Notes

NON-shipped eval conclusion; the example pairs themselves live in the shipped catalog leaf.
Design rationale and the input-distribution/Min-et-al. framing are in `260716-oby-PLAN.md` and
`260716-oby-RESEARCH.md`.
