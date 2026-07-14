# e2e-reference: reference-catalog eval for lz-refactor

Measures whether lz-refactor's curated, oracle-verified reference catalog carries a real
correct-answer edge over base Opus 4.8 on look-up questions where base plausibly answers WRONG or
VAGUE. This is the one untested value lever after the output-warrant loop concluded null/parity.

## What it measures

The metric is the per-fact DELTA = invoke_skill_correct_rate - no_skill_correct_rate, computed with
the SAME deterministic rubric on both arms. A positive delta on a non-saturated, independently-true
fact is the only value signal. A NULL result is a decisive, valuable outcome (it closes the
reference-mode value lever).

- 12 discriminating questions (q1-q12) + 2 saturation controls (qc1-qc2).
- Recommend mode only (read-only). Every prompt is `code:false` -- there is nothing to apply.
- Primary A/B: `invoke_skill` (forced `/lz-tdd:lz-refactor`, catalog guaranteed loaded) vs
  `no_skill` (baseline). `with_skill` is a free secondary auto-trigger data point.

## Fairness rule (the crux)

Grade ONLY facts whose ground truth is INDEPENDENT of the skill's own invented conventions: real book
contents, real 1st->2nd-edition renames/merges, real Refactoring-Directions-table MEMBERSHIP (which
patterns appear in a refactoring's row), and real smell / print-vs-web provenance. Do NOT grade the
skill's own constructions (the inferred To-vs-Towards SEMANTICS, the n/a sentinel, the N:1 idiom
groupings, per-leaf mechanics wording, the 62-vs-66 count) -- base cannot be "wrong" about a
convention the catalog invented, so a delta there is echo, not value. NO direction word
(away / toward / towards / de-pattern / dismantle / retreat) is ever a graded token on any question.

## cwd is catalog-free by design

`repo` in suite.json points at a catalog-free kata directory OUTSIDE this repo
(`GildedRose-Refactoring-Kata/TypeScript`). It is used only as the session cwd and is never touched
(recommend mode hard-blocks Edit/Write/Bash). This prevents the no_skill arm from reading the shipped
catalog off disk -- the catalog reaches the skill arms only via `--plugin-dir`. `applyBase` in
suite.json is unused (recommend-only); it is present only to satisfy the shared runner shape.

## How to run

The runner is REUSED, not forked. Invoke the nx suite's runner with `--suite` pointing here:

```
# Dry run -- compose prompts + print the run count, spend nothing:
node ../e2e-nx/run-e2e.mjs --suite ../e2e-reference --mode recommend --arm all --runs 3 --dry-run

# Grade the collected answers deterministically (no spend):
node ../grade-reference.mjs --selfcheck
node ../grade-reference.mjs --aggregate
```

## Eval-run approval gate

Per the project's eval-run-approval-gate, the metered `claude -p` RUN must NOT start until the
instrument is (a) built, (b) PASSED an unbiased review (neutral + adversarial), and (c) the user has
explicitly approved the spend. Building the suite, prompts, grader, and running `--dry-run` /
`--selfcheck` spend nothing and are always allowed.
