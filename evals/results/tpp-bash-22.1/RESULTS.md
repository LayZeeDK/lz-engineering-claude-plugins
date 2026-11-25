# Run set tpp-bash-22.1

## Status: blocked, no recall verdict

| Record | Recorded k/n [95% Wilson] | Reproduced k/m | Verdict |
|---|---|---|---|
| tpp-recall | 13/13 [0.772, 1.000] | none | not measured |

Written by hand. `aggregate` and `crosscheck` were not run: the arm has no valid finished run. Every figure below is
counted from the run folders' result.json, plugin-eval.json, refused.txt and trace-with.jsonl.

This run set was meant to repeat the tpp-turns-22.1 cell (13 lz-tpp fire cases, claude-opus-4-8, plugin at 5f586da,
3 runs per case, `max_turns` 10) with Bash offered to the session. `claude plugin eval` on this Windows machine
refuses any run that grants Bash, so the measurement cannot be made with the plugin-eval backend here.

## What happened

1. First attempt (suite at b247d7d: Bash only in each case's `allowed_tools`). The session's tool list in the
   trace's init event was `Task, Glob, Grep, Read, Skill, TaskStop, ToolSearch` in all 10 finished runs: a case's
   `allowed_tools` only narrows the tools the session already has. These runs did not test Bash, so the eval was
   stopped after 10 finished runs and the arm folder was moved to `set-aside-1/`.
2. The suite got `"allowTools": ["Bash"]` (ed1c5ed), which the harness passes as `--allow-tools Bash`, the same way
   the Write/Edit suites get their tools.
3. Second attempt. Every run was refused before the model started, with `costUsd` 0. From `raw/refused.txt`:
   "A shell tool (Bash or PowerShell) was granted but this machine cannot confine it (no sandbox backend on this
   platform, or it is not installed), so the run was refused rather than run unconfined" and "sandbox is enabled but
   the Windows sandbox is not active on this session (feature gate off)". The eval was stopped after 12 refusals
   (cases 01 to 04) while the 3 runs of case 05 were starting; all 15 folders stay in `tpp-5f586da-bash/`. The
   case 05 runs left no refusal or cost record; the same refusal happens before the model starts, so they are taken
   to have cost $0 (inferred).

## The 10 finished runs of the first attempt (set-aside-1, no Bash in the session)

These repeat the turns10 configuration. They are not a Bash measurement.

| Case | Run | Fired | Turns | Tool calls in order |
|---|---|---|---|---|
| 01 | 1 | yes | 3 | Skill |
| 01 | 2 | yes | 3 | Skill |
| 01 | 3 | no | 1 | none |
| 02 | 1 | yes | 9 | Skill, Grep, Glob, Bash, Glob, Read, Read |
| 02 | 2 | yes | 6 | Skill, Grep, Read, Glob |
| 02 | 3 | yes | 5 | Skill, Read, Read |
| 03 | 1 | yes | 7 | Grep, Glob, Bash, Glob, Skill |
| 03 | 2 | no | 6 | Glob, Grep, Glob, Bash, Glob |
| 03 | 3 | yes | 7 | Glob, Bash, Grep, Glob, Skill |
| 04 | 2 | yes | 3 | Skill |

Every Skill call named `lz-tdd:lz-tpp`. The Bash calls could not run (Bash was not in the session's tool list), as in
tpp-turns-22.1. Case 03 fired at 2 of 3 here against 1 of 3 at turns10 with the same configuration, so that case
varies between replicates. Three more runs (04 run 1, 04 run 3, 05 run 1) were killed in flight and have no result.

## Spend

- Measured: $1.60 agent cost for the 10 finished runs (judge $0). The 12 refused runs cost $0.
- Not measured: the 3 runs killed in flight left no cost record; at the observed $0.08 to $0.26 per run they add at
  most about $0.80, so total spend is under $2.40, below the $8 stop.

## Peer load

A peer session ran Storybook tests from 23:20:40Z to 23:21:06Z. The runs whose start-to-end overlaps that window
are 02 runs 1, 2 and 3 (started 23:20:05Z, 23:20:13Z and 23:20:14Z; 74 s, 69 s and 61 s). Their wall clock and cost
were measured under peer load. Whether the skill fired is not affected.

## What it would take

Measuring lz-tpp recall with Bash offered needs a backend that can grant Bash on this machine: the slim
`claude -p` backend, a machine where `claude plugin eval` has a sandbox (Linux or macOS with the backend
installed), or the Windows sandbox once its feature gate is on. Each is a protocol change from the recorded cell
and needs its own approval.

## Outcome

Lars chose on 2026-11-26 not to measure this further and to retire lz-tpp's skill-creator runners: on the new runner
all three trigger suites drop alike (lz-tpp 10/13, lz-red 4/6, lz-refactor 8/10 in repro-22.1), so the gap comes from
the suite setup (an empty run folder, no Bash), not from lz-tpp. Plan 08's baseline is the new reference. Only this
file was merged: the `trigger-lz-tpp-bash` suite and its run set stay out of the repository because this machine
refuses every run of that suite, and the raw run folders are kept locally (git-ignored).
