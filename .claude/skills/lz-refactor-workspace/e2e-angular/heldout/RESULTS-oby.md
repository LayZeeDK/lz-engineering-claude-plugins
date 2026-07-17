# Held-out recognition eval -- Loops/pipeline few-shot EXAMPLES edit (quick 260716-oby)

**Date:** 2026-07-16. **Quick task:** 260716-oby. **Question:** does adding 4 more before/after
few-shot pairs to `replace-loop-with-pipeline.md` (`## Example` 1 -> 5, incl. the classify-into-Set and
union-into-Set shapes) lift `idiom_pattern` -- the run converting the exposed enum classifier to
`map/filter` into a Set and the oneOf/anyOf union loops to `flatMap` into a Set -- vs the 1-pair
baseline, WITHOUT regressing the other dims?

This is a DISTINCT lever from 260716-lq9 (which toggled the SKILL.md drive-to-fixpoint INSTRUCTION):
here the toggle is the catalog leaf's few-shot EXAMPLES (input-distribution / recognition lever,
Min et al.). Same held-out target and grading criterion as lq9, so it isolates examples vs instruction.

## Design (edited vs pre-edit, held-out target)

- **Target ho1 (HELD-OUT):** `getTypesOfSchema` in
  `packages/angular_devkit/core/src/json/schema/utility.ts` (angular-cli @angular-devkit/core, pristine
  22.0.x @ 5584a589a). Has exactly the taught shapes: an enum `for...switch` classifier accumulating into
  a Set (Pair 5), and oneOf/anyOf loops of the form `options = new Set([...options, ...types])` -- Pair 4's
  before-code verbatim.
- **Arm:** `invoke_skill` (forced `/lz-tdd:lz-refactor`), apply/drive mode, COMMAND-framed prompt.
- **Conditions:** EDITED (working-tree leaf with the 5 pairs = HEAD/3138bbe) vs PREEDIT (leaf reverted to
  e6d94f3 = 1 pair). `--plugin-dir` reads the working tree, so toggling the one file isolates the effect.
  Same suite/prompt/model (claude-opus-4-8 @ high) for both.
- **k=3 per condition = 6 apply runs, all exit 0.**

## Grading (mechanical, objective -- binary signal)

`idiom_pattern` here is a binary, mechanically-checkable signal (does the diff replace the loops with
`flatMap` / `.map().filter()` into a Set?), so it was graded by direct diff inspection + grep rather than
blind LLM judges -- the signal was unanimous, so an LLM panel would be over-investment on an expected null.

| condition | idiom_pattern | +flatMap | +.map( | behavior_preservation | over_under_eng | incrementality |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|
| EDITED (n=3)  | **0/3** | 0 | 0 | 3/3 | 3/3 | 3/3 |
| PREEDIT (n=3) | **0/3** | 0 | 0 | 3/3 | 3/3 | 3/3 |

## Verdict: NULL lift, zero regression (5th independent null)

- **idiom_pattern did NOT lift.** All six runs (both conditions) did a clean Extract Function pass
  (getTypeOfValue / typesOfEnumValues, unionOfSubSchemaTypes, intersect/difference helpers) and collapsed
  the oneOf/anyOf Duplicated Code -- but every run RELOCATED the imperative `for` loops into the new
  helpers rather than converting them. Zero runs used `flatMap`; zero converted the enum classifier to
  `map/filter`. 3-4 imperative `for (` loops survive in the helpers of every diff.
- **No regression.** behavior_preservation / over_under_engineering / incrementality all 3/3 in BOTH
  conditions -- the examples neither helped nor hurt the applied output.
- **Root cause (matches all prior evidence):** the model does not RECOGNIZE the accumulation/union loops
  as warranted pipeline follow-ons, so it never routes to the Loops leaf where the few-shot examples live
  -- progressive disclosure works AGAINST them here (inference-time salience ceiling the research flagged).
  Examples in a leaf cannot fix a recognition failure that prevents the leaf being opened. This is a model
  recall/judgment ceiling, not a skill-content gap. Identical target + result as 260716-lq9.

## Decision

The examples SHIP on teaching merit regardless (commit 3138bbe) -- that decision was pre-set and is
independent of this eval. The eval confirms the recognition lever is CLOSED: **stop editing skill content
to chase accumulation-loop recognition.** The output-warrant axis is now null across a FIFTH independent
probe (L1 net-cost + reference-lookup + Phase-13 applied-output + lq9 held-out instruction + this held-out
examples edit).

## Reproduce

`bash scratchpad/run-oby-heldout.sh` -- toggles the leaf between HEAD (5 pairs) and e6d94f3 (1 pair),
runs `run-e2e.mjs --suite <heldout> --mode apply --arm invoke_skill --cwd <angular-cli> --runs 3` per
condition. angular-cli restored pristine (22.0.x @ 5584a589a); throwaway branch deleted. Raw diffs under
`results-oby-edited/` and `results-oby-preedit/`.
