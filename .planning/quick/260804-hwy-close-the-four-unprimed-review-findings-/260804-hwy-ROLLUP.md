# Round A rollup gap -- CLOSED (2026-08-04, zero spend)

The second of the two zero-spend items the owner selected at the resume gate. Both halves of the
Phase 22 deferred item "Round A's ROLLUP steps cannot reach the routing suite" are now closed and
proven in BOTH directions.

## What was broken

Neither step failed loudly, which is why this needed closing before Round A rather than after:

- `tabulate-mechanical-red.mjs` exited **0** while tabulating **nothing**.
- `merge-judge --verify` reported "no `eval-*/<config>/run-*` dirs" and checked **nothing**.

Round A could capture and grade; it could not roll up. A rollup that quietly produces nothing is the
failure shape that looks healthiest, and the pre-aggregate completeness gate exists to stop an
unmerged run from silently dropping out of the denominator -- a scored-only false pass.

## Gap 1 -- the tabulator

Two independent causes, both in the main path:

1. `discoverSuiteDirs()` filtered directory names on the `e2e-red-` prefix; this suite is
   `e2e-rgr-routing`.
2. `walkAllSuites()` walked `results/apply` only; this suite is recommend-only.

**Fix.** `discoverSuiteDirs(root, prefixes = ['e2e-red-'])` and
`walkAllSuites(suiteDirs, gradeFile, mode = 'apply')`, plus `--suite` and `--mode` CLI flags. Both
defaults are today's values, so a bare invocation is unchanged -- verified by running it and getting
the existing `e2e-red-*` apply table.

**The suite name did NOT move, deliberately.** `selfcheck-red.mjs` auto-discovers `e2e-red-*` siblings
and bans state-claim tokens in their prompts, while this corpus must carry test-state facts by
construction (D-03 exists precisely because routing has to IGNORE them). Renaming would re-import that
ban onto a corpus that violates it by design and perturb a file D-22 requires to stay byte-unchanged.
So the DISCOVERY widened.

**Proof.** The selfcheck gained an out-of-namespace, recommend-only case with **two negative
controls**, because the positive assertions are worthless without them:

```
[OK] out-of-namespace recommend-only suite: default prefix finds 0 / explicit finds 1;
     mode apply finds 0 runs / recommend finds 1
```

- default `e2e-red-` prefix finds **0** suites in that tree -- reproduces the original defect;
- explicit prefix finds **1**;
- mode `apply` finds **0** runs in a recommend-only suite;
- mode `recommend` finds **1** and it aggregates into the expected cell;
- `discoverSuiteDirs(root, [])` and `walkAllSuites(..., 'a/b')` both throw (fail-closed args).

## Gap 2 -- `merge-judge --verify`

`--verify` globbed `eval-*/<config>/run-*` for a file named `grading.json`. This suite's captures live
at `results/recommend/<arm>/<case-id>/run-N/routing-grade.json`. The two layouts are the SAME DEPTH and
differ only in the first level's naming and the grade filename.

**Fix.** `--grade-file <name>` and `--eval-prefix <p>` (pass `""` to accept any first-level name), both
defaulting to the skill-creator shape. The preliminary sibling name is DERIVED from the grade filename
rather than hardcoded, so the "merge not run" diagnosis stays accurate. `--merge` is untouched.

One trap handled: `--eval-prefix ""` is meaningful, and `""` is falsy, so presence is tested with `in`
rather than truthiness. A truthiness test would silently fall back to `eval-` and reproduce the exact
vacuous pass being closed.

**Proof** against a fabricated tree mirroring the real layout, 5/5:

```
[OK] default --verify finds NO run dirs in this layout (reproduces the original gap)
[OK] with --grade-file + empty --eval-prefix, all 3 run dirs verify OK
[OK] an unmerged (preliminary-only) run FAILS the gate and is named
[OK] a routing-grade.json still marked preliminary FAILS the gate
[OK] --grade-file rejects a path rather than a bare filename
```

The third and fourth are the ones that matter: they prove the gate still DISCRIMINATES on the defect
it exists to catch, rather than merely being reachable.

## The commands, now correct in RUN-GATE.md

```
node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs \
  --suite .claude/skills/lz-red-workspace/e2e-rgr-routing \
  --mode recommend \
  --grade-file routing-grade.json

node .claude/skills/lz-red-workspace/merge-judge.mjs --verify \
  .claude/skills/lz-red-workspace/e2e-rgr-routing/results/recommend \
  --grade-file routing-grade.json --eval-prefix ""
```

All three tabulator flags are required. `--grade-file` alone -- what RUN-GATE.md used to prescribe --
was the measured no-op. RUN-GATE.md's KNOWN GAPS section now carries a CLOSED banner, and the two
in-body pointers that still said the gaps were open were corrected; leaving them would have made the
document contradict itself, which is the staleness class this whole session kept finding.

Verified verbatim: the tabulator command exits 0 and names
`e2e-rgr-routing\results\recommend`; `--verify` exits **1** with "iteration dir not found", which is
correct fail-closed behaviour because no metered run has created that directory yet.

## Verification

| Check | Result |
|-------|--------|
| `tabulate-mechanical-red.mjs --selfcheck` | exit 0, incl. the new case + 2 negative controls |
| `merge-judge.mjs --selfcheck` | exit 0 |
| Rollup proof script (5 assertions, both directions) | exit 0 |
| Bare tabulator invocation | still prints the existing `e2e-red-*` apply table |
| `npm --prefix .claude/skills/lz-red-workspace run check` | exit 0 |
| `check-evals.mjs` | exit 0 |
| `claude plugin validate .` | exit 0 |
| RUN-GATE.md | ASCII-clean |
| Shipped skills touched | **none** -- instrument and docs only |

Zero metered spend.

**A trap caught in my own command, worth recording.** I first measured `--verify`'s exit code through
a pipe into `head`, so `$?` captured *head's* status and reported 0 for a command that actually exits
1. Same class as the `rg | sort` case this project already records: a pipeline's exit code is the LAST
stage's. Re-measured without the pipe.

## Consequence for Round A

The rollup chain is now complete end to end, so an approved Round A can be tabulated mechanically
instead of by hand. Nothing metered has run, and Round A still requires explicit owner approval.
