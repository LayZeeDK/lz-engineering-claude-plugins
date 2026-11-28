# Run set tpp-turns-22.1

## Recorded cells

| Record | Recorded k/n [95% Wilson] | Reproduced k/m | Verdict |
|---|---|---|---|
| tpp-recall | 13/13 [0.772, 1.000] | 10/13 | outside |

## Arm tpp-5f586da-turns10

- Ref: 5f586da3b18097b3aaa22dec115d607577e56151
- claude-opus-4-8: 39 runs; models that ran (CLI output): claude-opus-4-8
- Cost (agent plus judge): $5.84
- Wall clock (summed): 1173 s

| Suite | Side | Model | Grader | Passed |
|---|---|---|---|---|
| trigger-lz-tpp-turns10 | with | claude-opus-4-8 | sibling-quiet-lz-red | 39/39 |
| trigger-lz-tpp-turns10 | with | claude-opus-4-8 | sibling-quiet-lz-refactor | 39/39 |
| trigger-lz-tpp-turns10 | with | claude-opus-4-8 | skill-fired | 30/39 |

## Notes

Written by hand after `aggregate`. Every figure is counted from the run folders' result.json files and
trace-with.jsonl. This is a diagnostic re-run of the repro-22.1 `tpp-5f586da` cell. It uses the same 13 fire
cases, the same model (claude-opus-4-8), the same plugin ref (5f586da) and 3 runs per case. Only `max_turns` is
different: 10 here, 3 there.

- Case variant: staging reads cases only from the committed suites under `evals/lz-tdd/`, so the variant is the
  suite `evals/lz-tdd/trigger-lz-tpp-turns10/`. Its 13 cases copy `trigger-lz-tpp-01`..`13` with the same prompt,
  tags, `allowed_tools` and graders, and differ only in `max_turns: 10`. The original suite, repro-22.1 and the
  plugin are untouched.
- Models: all 39 results name claude-opus-4-8 in `initModel` and `modelsUsed`. Claude Code 2.1.327.
- `crosscheck`: 117 agree, 0 disagree, 0 unchecked.
- Spend: $5.84 agent plus judge for the 39 runs. The cell at `max_turns` 3 cost $5.21. Wall clock was 1173 s
  summed, and about 11 minutes elapsed at concurrency 2 (22:33:53Z to 22:44:57Z).

### Recall: still 10/13, outside [0.772, 1.000]

| Case | Fired at max_turns 10 | Fired at max_turns 3 (repro-22.1) |
|---|---|---|
| 01 | 2/3 | 3/3 |
| 02 | 3/3 | 2/3 |
| 03 | 1/3 | 0/3 |
| 04 | 3/3 | 3/3 |
| 05 | 0/3 | 0/3 |
| 06 | 3/3 | 3/3 |
| 07 | 0/3 | 0/3 |
| 08 | 3/3 | 3/3 |
| 09 | 3/3 | 3/3 |
| 10 | 3/3 | 3/3 |
| 11 | 3/3 | 3/3 |
| 12 | 3/3 | 3/3 |
| 13 | 3/3 | 3/3 |

A case counts as fired at 2 of 3 or better. The same three cases miss as at `max_turns` 3: 03, 05 and 07. Run-level
skill-fired is 30/39, against 29/39 before.

### What the runs did

- Ended at `max_turns`: 0 of 39 (`maxTurns` false in every result). All 39 ended with subtype `success` and a text
  answer.
- Turns used: 1 to 9, mean 4.3, median 4. The one run that used 9 turns was 03 run 2.
- Fired after turn 3: one run, 03 run 2. It made 6 search calls (one of them Bash) before the Skill call on turn 9.
  It is the only fire the higher cap made possible. 02 run 3 fired on its second call.
- Bash attempts: 6 runs (all 3 runs of 03 and all 3 of 05). Bash is not in the session's tool list, so each call
  returned an error. 03 run 2 then fired; the other 5 gave a text answer. No permission denials were recorded.

The 9 failed runs:

| Behaviour | Runs | Cases |
|---|---|---|
| Grep/Glob, a Bash call that errored, more Glob, then a text answer | 5 | 03 (2), 05 (3) |
| Grep/Glob on the empty run folder, then a text answer | 3 | 07 (3) |
| No tool call, a text answer after 1 turn | 1 | 01 run 2 |

In two fired runs (01 run 3, 13 run 2) the first Skill call carried no `skill` name, returned an error, and the
retry named `lz-tdd:lz-tpp`.

### What it says about the turn cap

At `max_turns` 3, half the misses (5 of 10) were runs cut off mid-search. At 10 no run reaches the cap, but recall
does not move: the same three cases miss, and the cap-limited runs turn into a failed Bash call or a text answer
instead of a Skill call. Turn cap 3 does not explain the gap between the recorded 13/13 and this suite. What the
model does with these three prompts in an empty folder explains it. The remaining protocol differences are
untested: the recorded run used skill-creator `run_eval.py` in the repository root, with a detector that ignored
Read/Glob/Grep and stopped at the first other tool or skill call.

### Peer load

Two peer sessions' check runs (an nx affected lint/typecheck/build/test run and a typecheck/lint/test run) ended
about 22:35Z, which overlaps the start of this slot. Six runs started before 22:36Z: 01 runs 1-3 and 02 runs 1-3
(22:34:26Z to 22:35:40Z). Their wall clock (31, 23, 38, 34, 47, 36 s) and cost were measured under peer load.
Recall verdicts are not affected.
