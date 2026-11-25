# Run set repro-22.1

## Recorded cells

| Record | Recorded k/n [95% Wilson] | Reproduced k/m | Verdict |
|---|---|---|---|
| tpp-recall | 13/13 [0.772, 1.000] | 10/13 | outside |
| red-heldout-recall | 6/6 [0.610, 1.000] | 4/6 | inside |
| refactor-recall | 10/10 [0.722, 1.000] | 8/10 | inside |
| red-apply-fired | 3/3 [0.439, 1.000] | 3/3 | inside |
| red-apply-untouched-edit | 3/3 [0.439, 1.000] | 3/3 | inside |
| red-apply-untouched-write | 3/3 [0.439, 1.000] | 3/3 | inside |
| refactor-apply-fired | 3/3 [0.439, 1.000] | 2/3 | inside |

## Arm tpp-5f586da

- Ref: 5f586da3b18097b3aaa22dec115d607577e56151
- claude-opus-4-8: 39 runs; models that ran (CLI output): claude-opus-4-8
- Cost (agent plus judge): $5.21
- Wall clock (summed): 993 s

| Suite | Side | Model | Grader | Passed |
|---|---|---|---|---|
| trigger-lz-tpp | with | claude-opus-4-8 | sibling-quiet-lz-red | 39/39 |
| trigger-lz-tpp | with | claude-opus-4-8 | sibling-quiet-lz-refactor | 39/39 |
| trigger-lz-tpp | with | claude-opus-4-8 | skill-fired | 29/39 |

## Arm red-8cd13a8

- Ref: 8cd13a8bdf7b2feae5961d1100b6fa21f997de8a
- claude-opus-4-8: 18 runs; models that ran (CLI output): claude-opus-4-8
- Cost (agent plus judge): $2.59
- Wall clock (summed): 425 s

| Suite | Side | Model | Grader | Passed |
|---|---|---|---|---|
| trigger-lz-red | with | claude-opus-4-8 | sibling-quiet-lz-refactor | 18/18 |
| trigger-lz-red | with | claude-opus-4-8 | sibling-quiet-lz-tpp | 18/18 |
| trigger-lz-red | with | claude-opus-4-8 | skill-fired | 10/18 |

## Arm refactor-2daaf40

- Ref: 2daaf40601d91c8f3b379687750eb20b30ecd630
- claude-opus-4-8: 30 runs; models that ran (CLI output): claude-opus-4-8
- Cost (agent plus judge): $4.56
- Wall clock (summed): 596 s

| Suite | Side | Model | Grader | Passed |
|---|---|---|---|---|
| trigger-lz-refactor | with | claude-opus-4-8 | sibling-quiet-lz-red | 30/30 |
| trigger-lz-refactor | with | claude-opus-4-8 | sibling-quiet-lz-tpp | 30/30 |
| trigger-lz-refactor | with | claude-opus-4-8 | skill-fired | 23/30 |

## Arm red-apply-9ad48cd

- Ref: 9ad48cdeefe4c5f34ea19103162d057b1c19b9eb
- claude-opus-5: 3 runs; models that ran (CLI output): claude-opus-5
- Cost (agent plus judge): $2.61
- Wall clock (summed): 357 s

| Suite | Side | Model | Grader | Passed |
|---|---|---|---|---|
| apply-lz-red | with | claude-opus-5 | edited-test | 2/3 |
| apply-lz-red | with | claude-opus-5 | production-untouched-edit | 3/3 |
| apply-lz-red | with | claude-opus-5 | production-untouched-write | 3/3 |
| apply-lz-red | with | claude-opus-5 | ran-tests | 2/3 |
| apply-lz-red | with | claude-opus-5 | red-line | 0/3 |
| apply-lz-red | with | claude-opus-5 | skill-fired | 3/3 |

## Arm refactor-apply-877aef3

- Ref: 877aef36febee93b1e6bb8e2a98b35cb8a978171
- claude-opus-4-8: 3 runs; models that ran (CLI output): claude-opus-4-8
- Cost (agent plus judge): $2.10
- Wall clock (summed): 544 s

| Suite | Side | Model | Grader | Passed |
|---|---|---|---|---|
| apply-lz-refactor | with | claude-opus-4-8 | edited-production | 1/3 |
| apply-lz-refactor | with | claude-opus-4-8 | leaf-read | 0/3 |
| apply-lz-refactor | with | claude-opus-4-8 | ran-tests | 3/3 |
| apply-lz-refactor | with | claude-opus-4-8 | refactor-line | 0/3 |
| apply-lz-refactor | with | claude-opus-4-8 | skill-fired | 2/3 |

## Notes

Written by hand after `aggregate`; every figure is counted from the run folders' result.json files and traces.

- Models: every recorded model was served. All 93 results name the requested model in the CLI output (`initModel`
  and `modelsUsed`): claude-opus-4-8 in 90, claude-opus-5 in 3. No "not served" substitution was needed. The
  plugin tree in every result equals its cell's ref tree (93 of 93). The 87 plugin-eval runs report Claude Code
  2.1.327; the 6 slim results leave the version null.
- Cost: $17.07 for the 93 runs (5.21 + 2.59 + 4.56 + 2.61 + 2.10), inside the projected $15.09-18.26.
- `crosscheck`: 261 agree, 0 disagree, 0 unchecked (plugin-eval runs only).

### tpp-recall outside

Per case, skill-fired passed 3 of 3 in 9 cases, 2 of 3 in trigger-lz-tpp-02, and 0 of 3 in trigger-lz-tpp-03,
-05 and -07, so 10 of 13 cases count as fired (a case counts at 2 of 3 or better). The record has all 13 at 3 of 3.

What the 10 failed runs did, read from their traces:

| Behaviour | Runs | Old detector's reading |
|---|---|---|
| Ended at `max_turns` 3 after only Grep/Glob calls on the empty run folder | 5 | undecided: it ignored Read/Glob/Grep and had no turn cap |
| Grep/Glob, then a Bash call (Bash is not in the case's tools) | 4 | not fired |
| Grep/Glob, then a text answer | 1 | not fired |

The two protocols differ in ways that bear on recall. The recorded run used the vendored skill-creator `run_eval.py`
with no turn cap, in the repository root, and kept scanning past recon calls until the model called a skill or another
tool. The ported case has `max_turns: 3` and runs in an empty folder: the model spends its turns searching for code
the prompt describes. Half the misses (5 of 10) ended mid-search. A run of the same cases with a higher turn cap
would show whether the gap is the protocol or the model; that run is outside this plan.

### Misses in the other trigger cells (both inside)

| Cell | Failed runs | Cut off at max_turns during recon | Bash | Text answer | Agent call first |
|---|---|---|---|---|---|
| `red-8cd13a8` | 8 of 18 | 4 | 2 | 0 | 2 |
| `refactor-2daaf40` | 7 of 30 | 1 | 0 | 6 | 0 |

In two trigger-lz-red-01 runs the model called the Agent tool, which is not in the case's `allowed_tools`, and the
subagent ran a long Glob/Read search; the parent ended after 2 turns, so the turn cap does not bound such a run
(those two runs cost $0.30 and $0.29 against a cell mean of $0.14).

### Apply cells: refused calls

Every apply run used run-slim's offline permission set plus the suite's allow list; the recorded apply results ran
under a different set. Refused calls (`permission_denials` in each run's CLI output):

| Cell | Runs | Refused calls | Kinds |
|---|---|---|---|
| `red-apply-9ad48cd` | 3 | 13 | commands piped into grep (3); `ls` piped into head (3); `npm install` (2); `npx --no-install`, `npx --prefix`, `node -e` (3); a redirect to a file (1); `cd ... && npx tsc ...; echo` (1) |
| `refactor-apply-877aef3` | 3 | 10 | `npx jest` with or without a pipe (5, two of them asking to disable the sandbox); compound `cd ... && ...` commands with pipes, `;` or `\|\|` (5) |

All four apply rows are inside, so no gap needs explaining. The one apply miss, refactor-apply-877aef3 run 3
(skill-fired failed), had 3 refused calls, all type-check or `ls` commands and none a Skill call, so the refusals do
not explain it. Two refusals are new measured facts for the suites: a redirect to a file (`> tsc-out.txt`) was
refused although the suites allow bare Edit, and `Bash(grep:*)` is shadowed (commands piped into grep were refused).

Other protocol differences: the recorded claude-opus-5 probe ran at effort `high`; the harness sets no effort. The
recorded GRC `with_skill` runs used the PowerShell tool (5 calls), which the offline set denies.

### Graders outside the record

These graders were not part of any recorded result and gate nothing here: apply-lz-red `red-line` 0 of 3 (0 of 10 in
the pilot too), `edited-test` 2 of 3, `ran-tests` 2 of 3; apply-lz-refactor-gr4 `leaf-read` 0 of 3, `refactor-line`
0 of 3, `edited-production` 1 of 3. The recorded gr4 result at 877aef3 has the skill declining the refactor in 3 of 3
runs (a net-cost warrant), so a grader that requires a production edit scores the recorded behaviour as a failure.

### Peer load

Seven runs started between 21:01 and 21:03 UTC (22:01-22:03 local) while peer sessions ran short CPU work and an
install: trigger-lz-red-01 runs 1-3, trigger-lz-red-02 runs 1-3 and trigger-lz-red-03 run 1. Their seconds and the
red-8cd13a8 summed wall clock may be slowed by that load; costs and pass rates are unaffected.
