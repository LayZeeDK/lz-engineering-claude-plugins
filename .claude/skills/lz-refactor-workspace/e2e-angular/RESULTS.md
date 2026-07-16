# e2e-angular results -- lz-refactor apply/drive mode vs no_skill (real Angular TS)

**Date:** 2026-07-16. **Mode:** apply/drive (skill EDITS code). **Model:** claude-opus-4-8 @ high,
`--setting-sources project`. **Arms:** `invoke_skill` (forced `/lz-tdd:lz-refactor`) vs `no_skill`
(baseline Opus, no plugin). **k=3.** 24 runs, all exit 0 (16 re-run after a mid-run auth expiry).

**Cells (TypeScript, pre-identified nx-style targets):**

| cell | repo / package | target | expected move |
|------|----------------|--------|---------------|
| ac1 | angular-cli `@angular-devkit/core` | `registry.ts _compile` | Extract Function + dedup transform loops |
| ac2 | angular-cli `@angular-devkit/core` | `writer.ts convert*Collection` | Parameterize Function |
| cd1 | components `@angular/cdk` | `sticky-styler.ts stickRows` | Extract Function + consolidate branch |
| an1 | angular `@angular/core` schematics | `change_tracker.ts _recordImports` | Extract Function + pipeline |

**Grading:** blind cell-judges (variants shuffled, arm hidden; scored on absolute merit vs each
target); `book_authenticity` via the `oracle` agent (DST-04 firewall); mechanical dims from
`meta.json`+diff. Matt-Pocock rule: independent axes, no cross-dimension winner.

## Graded dimensions (strict pass / 12 runs per arm)

| dimension | invoke_skill | no_skill | note |
|-----------|:---:|:---:|------|
| output_quality | **12/12** | 8/12 | baseline: 4 partial |
| behavior_preservation | **12/12** | 9/12 | baseline: 2 partial, **1 fail** (dropped `await` on `compileAsync` -> MissingRefError race) |
| over_under_engineering | **12/12** | 9/12 | baseline over-reached (new interface, changed iteration source) / under-reached (left long method) |
| incrementality | **12/12** | 6/12 | baseline did bigger single-restructures |
| idiom_pattern | 10/12 | 9/12 | ~tie; skill deferred the `.map()` FP idiom twice on an1 (conservative) |

## Mechanical dimensions

- **lift** (named refactorings surfaced): invoke_skill Pass@1 **1.00** every cell (Extract Function;
  Parameterize Function; Replace Loop with Pipeline); no_skill **~0.00** (applies the change, names nothing).
- **drove_vs_advised**: 12/12 both arms edited -- no advise-only failures (the coach-vs-apply tension did NOT bite).
- **cost**: invoke_skill pricier (catalog context) -- e.g. ac1 $1.63 vs $1.04/run; cdk ~parity ($0.87 vs $0.84).
- **incrementality (mechanical corr.)**: skill made many small edits (ac1: 18 Edits/24 turns) vs baseline few big ones (4 Edits/14 turns).

## book_authenticity (oracle, DST-04)

The skill's ACTUAL named claims -- **Extract Function, Parameterize Function, Replace Loop with
Pipeline** -- are **3/3 book-authentic** (real Fowler names, faithful mechanics). The oracle also
flagged that "**Consolidate Conditional Expression**" would be a *misapplication* for branch-body
dedup (it merges conditions sharing a result) -- but that term came from THIS suite's cd1 target
spec, NOT the skill's output (the skill used Extract Function + plain-language branch collapse). So:
skill book-authentic on all it named; the oracle caught an imprecision in the eval's own target design.

## Verdict

In **apply/drive mode on real Angular TypeScript**, `invoke_skill` **measurably beat** `no_skill` on
4 of 5 graded dimensions plus vocabulary, and ~tied on idiom. The mechanism is the skill's
**small-behavior-preserving-steps discipline**: baseline's bigger-bang restructures occasionally
introduced a subtle async regression (ac1), changed an empty-array path or the iteration source
(an1), over-built a new interface / changed a loop bound (cd1), or left the long method (cd1) --
while the skill stayed incremental, proportionate (declined a Strategy on cd1, a closure-hoist on
ac1), and routed a behavior concern to lz-tpp. ac2 (a trivial dedup) was **saturated** -- both arms
3/3 on everything.

This is a **stronger** result than the recommend-mode Phase-14 finding (output parity vs a code-review
skill). Apply mode is where the skill's TDD-refactor discipline pays off on messy real code.

## Caveats (this is tentative, not a headline win)

1. **n=3/cell (12/arm).** The gaps are driven by baseline stumbling on 1-2 runs per cell, not by the
   skill doing something baseline cannot. A larger n could shrink them.
2. **invoke_skill = FORCED activation.** This measures skill-active quality, NOT whether the coach
   auto-triggers. The nx e2e found coach auto-trigger unreliable; the real-world delta depends on it.
   `with_skill` (auto-trigger) was deferred in this scoped pass.
3. **behavior_preservation judged from diffs + self-reported `tsc`**, not independently re-run
   (bazel-first repos; per-run tsconfigs). Judges are independent of the producer, but this is a read,
   not an execution.
4. **cost**: the skill is ~30-55% pricier per run.
5. **blinding**: variants followed a fixed permutation (odd = skill); judges scored each absolutely
   vs the target, and mixed per-cell results + ac2 saturation argue against systematic pro-skill bias.

## k=5 firm-up + third arm (auto-trigger) -- SUPERSEDES the k=3 figures above

Extended ac1/cd1/an1 to k=5 and added the `with_skill` (auto-trigger, natural prompt, no forcing)
arm. ac2 left at k=3 (saturated). **Power-mode caveat:** the k=3 batch ran under Performance power
mode, the k=5 extension under Balanced -- so `elapsed_ms`/wall-clock is NOT comparable across
batches (segment by batch); cost/tokens/turns/edits/graded dims are power-independent and fine.

**Auto-trigger (the headline question):** `with_skill` fired the coach **15/15 = 100%** across
ac1/cd1/an1 -- the OPPOSITE of the nx recommend-mode result (1/12). The coach reliably auto-fires in
apply framing.

**Three-arm aggregate (ac1+cd1+an1; strict pass / DROVE-runs; k=5):**

| metric | invoke_skill (forced) | with_skill (auto) | no_skill (baseline) |
|--------|:---:|:---:|:---:|
| drove / ran | 13/15 (87%) | **9/15 (60%)** | 15/15 (100%) |
| output_quality | 100% (13/13) | 78% (7/9) | 60% (9/15) |
| behavior_preservation | 100% | 78% | 67% |
| over_under_engineering | 100% | 100% | 73% |
| incrementality | 100% | 100% | 60% |
| idiom_pattern | 77% | 89% | 73% |

**What firmed up (now robust, not n=3 noise):**
1. **The skill's applied-quality edge is REAL when it drives.** invoke_skill is 100% on
   output/behavior/over/incrementality; baseline trails at 60-73%. The ac1 `await`-drop regression
   **recurred in baseline (runs 1 AND 4 = 2/5)** and baseline also under/over-engineered cd1 -- these
   are recurring baseline failure modes, not flukes. The skill's small-steps + proportionality
   discipline avoids them.
2. **Auto-trigger fires 100%** but **under-drives (60%)**: on question-phrased apply asks
   ("what would you do?"), the skill's question->coach routing advises instead of editing ~40% of the
   time. Forced invoke drives 87%; baseline 100%. So real-world value is gated on activation + phrasing.
3. **idiom_pattern is ~tied** (invoke 77%, with_skill 89%, baseline 73%). The one skill soft spot is
   FORCED-invoke-specific: on the mild-smell an1 cell, invoke deferred the `.map()` pipeline (idiom
   1/4), while auto-triggered with_skill took it (idiom 3/3). Weak, cell- and activation-specific.

**Corrected verdict (k=5):** In apply/drive mode on real Angular TS, **when the skill drives, it
produces measurably cleaner, safer, more proportionate refactorings than baseline** (robust at k=5) --
its real value beyond vocabulary. BUT that value is gated: auto-triggered it fires 100% yet drives
only 60% (question->advise), so the realized benefit depends on an explicit apply command. This both
CONFIRMS the recommend-mode "output parity" prior (baseline is competent) AND extends it: apply mode +
drive discipline is where the skill earns its keep. idiom_pattern is the marginal soft spot (the
queued follow-on task).

## Reproduce

`node ../e2e-nx/run-e2e.mjs --suite <cli|cdk|core> --mode apply --arm <no_skill|invoke_skill> --cwd <repo> --runs 3`
(repos on `eval/lz-refactor-apply`; angular-cli needs `corepack pnpm@10.34.4 install`). Grade:
`node tabulate-mechanical.mjs`; `node prep-graded.mjs` -> blind cell-judges + oracle -> `node synth.mjs`.
