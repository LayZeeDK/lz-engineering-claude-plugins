# Forced-enumeration diagnostic -- perception vs recognition vs judgment (quick 260716-oby follow-up)

**Date:** 2026-07-16. **Question:** the shipped few-shot examples did not lift loop-to-pipeline
conversion (oby eval: idiom 0/3 = 0/3). Is that miss a PERCEPTION gap (model can't see the loops), a
RECOGNITION gap (sees them, doesn't classify them as pipeline candidates), or a JUDGMENT/value
threshold (recognizes them, reasonably declines a marginal transform)? This probe forces the model to
audit every loop and decide, isolating the answer.

## Design

- **Target:** held-out `getTypesOfSchema` (angular-cli @angular-devkit/core, pristine 22.0.x @
  5584a589a) -- same target as oby/lq9. Contains the enum `for/switch` classifier (Pair 5 shape) and
  two `options = new Set([...options, ...types])` union loops (Pair 4's before-code).
- **Arm:** invoke_skill apply on HEAD (shipped skill, 5 few-shot pairs). Prompt = the normal "make it
  cleaner and apply" body PLUS an explicit loop-audit directive: list every loop/reduce/accumulator,
  classify its intent, mark whether a pipeline expresses it (y/n + reason), then apply the yes's.
- **Control:** the existing oby EDITED runs (`../heldout/results-oby-edited`, same target/skill/model,
  NO audit directive) = idiom 0/3, all loops relocated as imperative helpers.
- **k=5**, all exit 0. Only difference vs control = the audit directive in the prompt.

## Result: forced enumeration FLIPS the miss -- 0/5 -> 5/5, correct and tsc-clean

| condition | idiom_pattern | +flatMap | enum->map/filter | union->flatMap | allOf->reduce |
|-----------|:---:|:---:|:---:|:---:|:---:|
| control (oby-edited, no audit), n=3 | **0/3** | 0 | 0/3 | 0/3 | 0/3 |
| forced-enumeration, n=5 | **5/5** | 5 | 5/5 | 5/5 | 5/5 |

- All 5 runs converted the enum classifier to `enum.map(classify).filter(...)` into a Set, the
  oneOf/anyOf unions to `new Set(subs.flatMap(sub => [...getTypesOfSchema(sub)]))` (+ intersect), and
  the allOf fold to `.reduce()`. Exactly the shapes Pairs 4/5 teach.
- **Correctness verified independently:** all 5 refactored files reconstructed (git apply) and
  type-checked under `tsc --strict --noEmit` (es2021 lib) -> ALL 5 CLEAN. Behavior preservation traced
  by hand (Set dedup/order preserved; the enum `.filter(undefined)` matches the old switch's implicit
  skip; folds seeded to match the reassigning loops). NOT Midolo's 71%-broken case.
- **Not blind obedience -- the model discriminated:** run-5 emitted a 7-row audit table, classified
  each site's intent, and correctly LEFT `not` (already a filter pipeline) unconverted. The model
  genuinely evaluated each loop and judged it convertible, rather than mechanically converting all.

## Interpretation: it is a DISCRETION / SALIENCE gap, not perception and not a hard judgment ceiling

- **Not perception:** the model lists every loop when asked -- it sees them.
- **Not a hard value ceiling:** when made to evaluate each loop it judges them pipeline-convertible and
  converts them well. Its baseline "leave them as imperative loops" was NON-CONSIDERATION, not a
  considered decline. Under open-ended "make it cleaner", the model does not spontaneously SURFACE each
  loop as a conversion candidate; a systematic-enumeration forcing-function makes it do so.
- This **falsifies the prior working conclusion** (that the loop-to-pipeline miss was a model judgment
  ceiling / "reasonable as-is" decline, inferred from adjacent literature). The direct experiment beats
  the inference. It is consistent with the 5 prior nulls, which all varied PASSIVE skill content
  (prose, cues, few-shot examples) and left the model's discretion intact; none forced enumeration.
  Passive content is null; an active forcing-function (a procedure step) is the untested lever, and it
  works -- at least at the prompt level on this target.

## Caveats (do not over-swing)

1. **n=1 target.** Strong within-target signal (5/5 vs 0/5) but one function. The MECHANISM generalizes
   plausibly; PRECISION across diverse code does not follow -- a blanket "convert every loop" could
   over-convert loops with early exit / side effects / where a pipeline is worse (the overcorrection
   risk the literature warns about). Only weak positive-precision evidence here (it declined the
   already-pipeline `not`).
2. **Prompt-level, not skill-level.** The audit directive lived in the RUN PROMPT. This proves the
   run/model layer moves. It does NOT prove a SKILL-embedded enumeration step reproduces it in real
   use, where the user's prompt won't carry the directive and the skill must supply it + keep it
   salient at apply time.
3. **Somewhat leading directive.** It named the pipeline operations and said "apply every yes." A
   milder "audit and decide" phrasing would test robustness; the model's own classification reasoning
   (and its `not` decline) argue it evaluated rather than rote-obeyed, but this is not fully isolated.

## Next step (if pursued)

A SKILL-LEVEL forcing-function probe: embed a loop-audit step in the apply/sweep procedure, then test
(a) it reproduces the lift WITHOUT the prompt directive (skill alone), and (b) precision on targets
where NOT every loop should convert (guard against overcorrection). Gate metered runs on explicit
approval. This is a procedure lever, distinct from the nulled passive-content edits.

## Reproduce

`node ../../e2e-nx/run-e2e.mjs --suite <this dir> --mode apply --arm invoke_skill --cwd
D:/projects/github/angular/angular-cli --runs 5` (throwaway branch off 5584a589a; skill at HEAD).
angular-cli restored pristine; throwaway branch deleted. Raw diffs/answers under `results/`.
