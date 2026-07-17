# Skill-level loop-audit forcing-function -- Options A (recall) + B (precision), v1 -> v2

**Date:** 2026-07-17. **Follow-up to:** the prompt-level enum diagnostic (heldout-enum/RESULTS-enum.md,
idiom 0/5 -> 5/5). **Question:** the prompt-level loop-audit directive flipped the loop-to-pipeline miss.
Does embedding that directive as a SKILL-LEVEL step reproduce the lift in real use (Option A, recall),
and does it avoid over-converting non-convertible loops (Option B, precision, the ship gate)?

## The change under test

An AUDIT+DECIDE paragraph in SKILL.md step 5 ("Preserve behavior"), always-active on the apply path
(reached even when smell routing never opened the Loops leaf). List every loop/reduce/accumulator, name
its intent, decide pipeline y/n with a reason, convert the yes list; leave loops with side effects /
index-neighbor deps / multiple accumulators / hot path; early-exit loops may become find/some/every.
Passed the mandatory 2-subagent review (1 unbiased from-scratch) at both v1 and v2. Read live via
`--plugin-dir` (uncommitted during eval, shipped after).

Two skill versions were evaluated:
- **v1:** the base AUDIT+DECIDE paragraph.
- **v2 (shipped):** v1 + a targeted clause -- the audit covers loops you RELOCATE into extracted helpers
  (extracting a helper does not exempt its loop); a union of each item's sub-collection is a `flatMap`
  into a Set, while merging one whole collection into another is a spread (not a flatMap), external
  target -> leave. This closed both the observed union recall miss and a scalar-merge over-conversion
  hazard the unbiased reviewer flagged.

## Option A -- recall (skill alone, NO audit directive in the prompt)

- **Target:** held-out `getTypesOfSchema` (angular-cli @angular-devkit/core, 5584a589a). Natural prompt
  ("make it cleaner and apply") -- the skill, not the prompt, supplies the audit.
- **Arm/mode:** invoke_skill apply, k=5, edited skill via `--plugin-dir`.
- **Control:** `results-oby-edited` (same target/skill/model, no audit) = idiom **0/3**.
- Key convertible loops: enum `for/switch` classifier -> `map/filter` into Set; oneOf/anyOf unions ->
  `flatMap` into Set. allOf fold -> reduce OR left as an intersect loop (acceptable).

| metric | control | v1 (`results-skilledit-v1`) | v2 (`results`, shipped) |
|--------|:---:|:---:|:---:|
| enum classifier -> pipeline | 0/3 | 4/5 | **5/5** |
| unions -> flatMap | 0/3 | 2/5 | **5/5** |
| full pipeline (both) | 0/3 | 2/5 | **5/5** |
| tsc-clean (verified runs) | -- | run-1, run-5 | run-1, run-2, run-5 |

- v1: real but PARTIAL lift; union->flatMap sticky (2/5) -- the model extracted a helper for the union and
  left a hand-written merge loop inside it; run-4 audited and DECLINED the enum conversion.
- v2: the "audit covers relocated helper loops + sub-collection union -> flatMap" clause lifted
  union->flatMap to **5/5**; full pipeline conversion **5/5**. All verified runs tsc --strict clean.
- Pass@1 (full recall): v1 0.40 -> v2 **1.00**.

## Option B -- precision / over-conversion guard (the ship gate)

- **Target:** held-out `stylesheet-updates.ts` (angular-cli @schematics/angular, 5584a589a) -- 8 varied
  NON-convertible loops (worklist/consume, early-return, continue+mutation, multiple accumulators,
  per-iteration I/O, order-interdependence, a Set-merge decoy `for (dep of deps) all.add(dep)`) + early-exit.
- **Arm/mode:** invoke_skill apply, k=5.

| metric | v1 (`results-v1`) | v2 (`results`, shipped) |
|--------|:---:|:---:|
| wrongful pipeline conversions of a LEAVE loop | 0/5 | **0/5** |
| correct `.some()`/`.find()` on early-exit loops | yes | yes |
| explicit loop-audit + correct LEAVE reasoning | 5/5 | 5/5 |
| scalar-merge decoy correctly LEFT | (n/a in v1 phrasing) | **yes** (runs 4, 5 named it, left it) |
| tsc-clean (production file) | run-5 (real repo) | run-5 (real repo) |

- PRECISION ~PERFECT at BOTH versions. v2's stronger union phrasing did NOT regress precision: the
  scalar-merge decoy (`allExternalDeps.add`) was correctly left ("spreading a fresh Set each iteration
  would be worse" / "union into a running accumulator, spread would need a let"), exactly the boundary the
  v2 clause added. Multi-accumulator / I/O / order-dependent / lazy-generator loops all correctly left.
- Pass@1 (no over-conversion): 1.00 both. Pass^5: 1.00 both.

## Verdict: SHIP (v2)

Ship gate (A reproduces AND B precision high): **v2 recall 5/5 (union->flatMap 2/5 -> 5/5) AND precision
5/5 (0 over-conversion).** First genuinely positive lever on the output-warrant axis after five nulls, and
it is SAFE (perfect precision; correct discrimination incl. the scalar-merge decoy). Distinct from the five
prior nulls (which varied PASSIVE skill content -- prose, cues, few-shot examples): this is an ACTIVE
procedure step (a forcing-function), the untested lever the prompt-level diagnostic identified. Both edits
reviewed (2 subagents, 1 unbiased); all conversions tsc --strict clean; held-out targets. Cost: ~22 lines
in the lean router + a cheap audit step per apply.

Shipped 2026-07-17. Milestone lz-tdd@0.0.2 audit/close deferred to a later session (per operator).

## Reproduce

Option A: `run-e2e.mjs --suite e2e-angular/heldout --mode apply --arm invoke_skill --cwd <angular-cli> --runs 5`
Option B: `run-e2e.mjs --suite e2e-angular/heldout-precision --mode apply --arm invoke_skill --cwd <angular-cli> --runs 5`
(throwaway branch off 5584a589a; skill edited in the working tree, read via --plugin-dir; ABSOLUTE
--suite/runner paths.) angular-cli restored pristine. v1 raw runs under `*-v1/`; v2 under `results/`.
