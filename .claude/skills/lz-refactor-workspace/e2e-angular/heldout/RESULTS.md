# Held-out validation eval -- single-target drive-to-fixpoint SKILL.md edit

**Date:** 2026-07-16. **Quick task:** 260716-lq9. **Question:** does extending the lz-refactor
drive-to-fixpoint discipline from package/directory scope to SINGLE-TARGET apply lift `idiom_pattern`
(the coach completing an exposed map/pipeline follow-on after an extraction) WITHOUT regressing the
other graded dims?

## Design (edited vs pre-edit, held-out target)

- **Target ho1 (HELD-OUT, new symbol -- NOT the k=5 trained-on ac1/ac2/cd1/an1):**
  `getTypesOfSchema` in `packages/angular_devkit/core/src/json/schema/utility.ts` (angular-cli
  @angular-devkit/core, pristine 22.0.x @ 5584a589a). Pure, side-effect-free; Long Function + oneOf/anyOf
  duplication + three accumulation loops (enum typeof classifier; oneOf/anyOf union builds). The
  extract-then-exposed-pipeline shape: extracting the helpers leaves residual loops that a strong result
  converts to `enum.map(classify).filter(...)` (Set) and `branches.flatMap(...)` (Set).
- **Arm:** `invoke_skill` (forced `/lz-tdd:lz-refactor`), apply/drive mode, COMMAND-framed prompt
  ("Refactor ... apply the changes") so the edit's COMMAND path is exercised. Non-leading (names only
  the file/function; no smell/refactoring/pipeline named).
- **Conditions:** EDITED (working-tree SKILL.md with the single-target fixpoint edit) vs PREEDIT
  (SKILL.md reverted to HEAD). `--plugin-dir` reads the working tree, so toggling the file isolates the
  edit's effect. Same suite/prompt/model (claude-opus-4-8 @ high) for both.
- **k=3 per condition = 6 apply runs, all exit 0. Metered spend: $4.57.**

## Grading (two independent BLIND judges, condition hidden, shuffled A-F)

Both judges scored all six diffs identically:

| condition | idiom_pattern | behavior_preservation | over_under_engineering | incrementality | output_quality |
|-----------|:---:|:---:|:---:|:---:|:---:|
| EDITED (n=3)  | **0/3** | 3/3 | 3/3 | 3/3 | 3/3 |
| PREEDIT (n=3) | **0/3** | 3/3 | 3/3 | 3/3 | 3/3 |

## Verdict: NULL lift, zero regression

- **idiom_pattern did NOT lift.** All six runs (both conditions) extracted the helpers and collapsed the
  oneOf/anyOf duplication correctly, but every run left the enum classifier and the union accumulation as
  imperative `for` loops relocated into the new helpers. No run used `flatMap`; none converted the enum
  loop to `map/filter`. EDITED-r1 alone touched a `.map()` on the union branch iteration but still folded
  the union with an imperative loop -- short of the bar. Both judges independently confirmed 0/3 vs 0/3.
- **No regression.** behavior_preservation / over_under_engineering / incrementality / output_quality all
  3/3 in BOTH conditions -- the edit neither helped nor hurt.
- **Root cause (matches prior evidence):** the model does not RECOGNIZE these accumulation/union loops as
  warranted pipeline follow-ons in the first place (its Loops lens anchors on index/`for` loops, not
  accumulation), so the drive-to-fixpoint instruction has nothing to act on. This is a model
  recall/judgment ceiling, not a skill-prose or catalog gap -- the same conclusion as the 2026-07-15
  groupby-loop and groupby-detection-variants quick tasks. Catalog/instruction edits cannot close it.

## Decision

Per the pre-set rule (commit only on a real idiom lift with no regression), the edit is NOT shipped:
SKILL.md reverted to HEAD, nothing committed to the skill. The output-warrant axis is now null across a
FOURTH independent probe (L1 net-cost + reference-lookup + Phase-13 applied-output + this held-out apply).

## Reproduce

`node ../../e2e-nx/run-e2e.mjs --suite <this dir> --mode apply --arm invoke_skill --cwd D:/projects/github/angular/angular-cli --runs 3`
(throwaway branch off 5584a589a; toggle plugins/lz-tdd/skills/lz-refactor/SKILL.md between HEAD and the
edit to switch conditions). Angular-cli repo restored pristine; throwaway branch deleted.
