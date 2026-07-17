# e2e-reference: reference-catalog eval for lz-refactor

Measures whether lz-refactor's curated, oracle-verified reference catalog carries a real
correct-answer edge over base Opus 4.8 on look-up questions where base plausibly answers WRONG or
VAGUE. This is the one untested value lever after the output-warrant loop concluded null/parity.

## What it measures

The metric is the per-fact DELTA = invoke_skill_correct_rate - no_skill_correct_rate, computed with
the SAME deterministic rubric on both arms. A positive delta on a non-saturated, independently-true
fact is the only value signal. A NULL result is a decisive, valuable outcome (it closes the
reference-mode value lever).

- Recommend mode only (read-only). Every prompt is `code:false` -- there is nothing to apply.
- Primary A/B: `invoke_skill` (forced `/lz-tdd:lz-refactor`, catalog guaranteed loaded) vs
  `no_skill` (baseline). `with_skill` is a free secondary auto-trigger data point.

### Clean core (post unbiased review, quick-260714-nxp)

The unbiased review (neutral + adversarial) trimmed the discriminating set to a CLEAN CORE -- the
questions whose graded discriminator is genuine catalog recall, not an echo of the injected SKILL.md
preamble or of the stem itself:

- CLEAN CORE (8, run): **q1, q6, q7, q8, q9, q10, q11, q12**.
- DROPPED (removed from the suite): **q2** (saturated -- Builder+Composite are in the refactoring
  title quoted in the stem, delta ~0 by construction) and **q4** (SKILL.md echo -- the three Away
  refactorings are listed verbatim in the SKILL.md body).
- EXCLUDED from the clean core (kept in the suite for grader coverage, NOT run): **q3** (SKILL.md
  echo: "Inline Singleton" is in the SKILL.md body) and **q5** (SKILL.md echo: "Combinatorial
  Explosion" is in the SKILL.md body routed to Kerievsky). Their `excluded_from_clean_core` field
  in `targets.json` records why.
- 2 saturation controls (qc1, qc2) are run alongside the core to feed the verbosity guard.

The clean-core run is `--prompt q1 --prompt q6 --prompt q7 --prompt q8 --prompt q9 --prompt q10
--prompt q11 --prompt q12 --prompt qc1 --prompt qc2` (10 prompts) x 2 arms (invoke_skill, no_skill)
x k=3 = 60 runs.

### SKILL.md-echo audit (what defines the clean core)

A discriminating question is echo-tainted when its graded discriminator (or the subject->answer
linkage it grades) appears in the SKILL.md BODY -- then invoke_skill can answer from the injected
preamble rather than the catalog. The graded token that is merely restated in the STEM (e.g. q1's
"Visitor" from the title "Move Accumulation to Visitor", or the author names in a provenance stem)
is not the discriminator; the discriminator is the token the base model would plausibly miss
(q1's "Iterator", q7's "Introduce Special Case", each smell's true author linkage).

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

The aggregate prints, alongside each per-fact delta, a per-arm median `answer_chars` (from
`meta.json`) as a verbosity guard: a skill arm with a much larger median answer length may be
winning on token-naming/verbosity rather than recall, which the saturated qc1/qc2 controls cannot
catch on their own.

## Eval-run approval gate

Per the project's eval-run-approval-gate, the metered `claude -p` RUN must NOT start until the
instrument is (a) built, (b) PASSED an unbiased review (neutral + adversarial), and (c) the user has
explicitly approved the spend. Building the suite, prompts, grader, and running `--dry-run` /
`--selfcheck` spend nothing and are always allowed.
