# Pilot 22.1 findings

Run set `pilot-22.1`, ref 975e819c2690492c2f4933eb0b58aeded7df06f3 (the commit the plugin and cases were staged
from), Claude Code 2.1.327, 2026-11-25. 58 results: 56 in cell `head` (28 per model) and 2 in cell `no-plugin`.
Every result names the requested model in its CLI output (`initModel` and `modelsUsed`, 58 of 58). `crosscheck`:
132 agree, 0 disagree, 0 unchecked.

Written by the orchestrator from the raw results after the executor's Write of this file was refused; every count
below was recounted from the raw results unless it says otherwise.

## A1

Write under `plugin eval` on native Windows works inside the run workspace. `wrote-inside` passed 4 of 4 and the
doing suites' `wrote-test` 12 of 12 sides: each Write landed in a file under the run's own workspace. No call in a
doing trace was refused.

Decision: PASS. The doing suites stay on `plugin-eval` in Plan 05.

## A2

The outside probe asked for a Write to the probe file outside the workspace in 4 runs (2 per model), and the agent
tried it every time (`asked-outside` 4 of 4). The CLI refused each call in dontAsk mode. After the pilot the probe
folder does not exist.

Decision: PASS. The baseline may include the doing suites.

## A5

Every slim result (10 of 10) names exactly the requested model in `modelsUsed`, and `initModel` agrees with it. A5
holds; slim needs no transcript fallback for the model.

## A6

Trigger and routing cases, one `plugin eval` invocation per run (n = 16 per model):

| Model | Median CLI run seconds | Median turns (max) |
|---|---|---|
| claude-sonnet-5-5 | 19 s | 3 (5) |
| claude-opus-5-5 | 18.5 s | 4 (6) |

The executor measured the start-up overhead per invocation during the run at about 2 s (median wall clock 21.6 s
Sonnet, 23.6 s Opus, from the harness's start stamp to `result.json`). Not recounted: copying the raw results out
of the worktree reset the file times that measure it. About a tenth of a trigger run either way; A6 holds.

## Scaffold

`doing-lz-red-08` and its twin ran their scaffold under `--scaffold` in all 8 invocations, and no loader error
appeared on any run (executor's reading of the traces).

Two harness defects surfaced and were fixed test-first before the results counted. The CLI deletes the run sandbox,
and the trace with it, before it exits, so every invocation now passes `--keep-temp` and the harness removes the kept
sandbox after copying both traces. The run set name check refused the dotted folder `pilot-22.1`.

## Slim permissions

Refused calls in the 10 apply runs (28 in all, from `permission_denials` in each run's CLI output), by kind:

| Kind | Runs with it | Example | Rule that would allow it |
|---|---|---|---|
| Compound or piped Bash (`cd <cwd> && ...`, `... \| grep`, `\| tail`, `> file`) | 7 | `cd <cwd> && npx tsc --noEmit -p .` | `Bash(cd:*)`, `Bash(cat:*)`, `Bash(grep:*)`, `Bash(tail:*)`, `Bash(git ls-files:*)` beside the existing `npx` rules |
| PowerShell tool | 5 | `npx tsc --noEmit -p . 2>&1 \| Select-String ...` | `PowerShell(npx tsc:*)`, `PowerShell(npx vitest:*)` |
| Read of the staged plugin's own skill reference (outside the run cwd) | 1 | the lz-red testing-stance reference | `Read` on the staged plugin folder (or `--add-dir` for it) |

The plugin-reference Read matters most: under slim the skill could not open its own reference file. Plan 05 adds
the plugin folder Read and the PowerShell rules to the apply suites' `allow`; the compound-Bash rules are its call.
The harness's `denied` flag missed all of these (it read only `permissionDecision`); it now also reads the refusal
text of an error tool result.

Apply graders, all 10 runs: `production-untouched-edit` and `-write` 10 of 10, `ran-tests` 10 of 10, `skill-fired`
4 of 4 natural-arm runs and 0 of 2 no-plugin runs (as expected; the invoke twin does not score it). Two graders
failed in every arm, the no-plugin arm included: `red-line` 0 of 10 (no reply ended with the
`RED: ... -- fails: ...` line) and `wrote-test` 1 of 10 (agents edited the existing spec instead of writing a new
file, and the grader matches Write only). The doing case's `red-line` also passed 0 of 12 sides. These graders
cannot tell the arms apart as they stand; Plans 05-06 revisit them before the baseline relies on them.

## Rate limit

No run carried a rate-limit or usage-limit error. Every trigger and routing grader passed in both models at
concurrency 2 (fire and quiet cases alike), so there is no sign of throttling showing up as a missed trigger. n is
2 runs per case and model, too small to rule out a small drop.

## Cost

Mean `costUsd` plus `judgeCostUsd` per run (judge cost was 0 on every run: no llm graders):

| Run kind | claude-sonnet-5-5 | claude-opus-5-5 | n per model |
|---|---|---|---|
| plugin-eval trigger and routing (ablation none) | $0.0498 | $0.1112 | 16 |
| `doing-lz-red` (one with-without run, both arms) | $0.1176 | $0.2201 | 2 |
| `doing-lz-red-invoke` | $0.0648 | $0.1340 | 2 |
| slim apply (natural, twin and no-plugin together) | $0.1048 | $0.3047 | 5 |
| harness probes | $0.0318 | $0.0657 | 4 |

Pilot spend: $6.09 over the 58 results, plus $0.05 for the first tracer run that was set aside, $6.13 measured.
The two runs stopped on purpose left no cost record; at the Opus trigger mean they cost about $0.22 together.

## n recheck

Projection of the Plan 08 baseline at Sonnet n = 5 and Opus n = 3, per case cost = 5 x Sonnet mean + 3 x Opus mean
of its run kind:

- Trigger or routing case: 5 x 0.0498 + 3 x 0.1112 = $0.5826.
- Doing case with-without: 5 x 0.1176 + 3 x 0.2201 = $1.2483; its invoke twin: 5 x 0.0648 + 3 x 0.1340 = $0.7260;
  3 skills x 1.9743 = $5.9229. `doing-lz-tpp-01` and `doing-lz-refactor-00` take the `doing-lz-red-08` means (not
  measured).
- GildedRose apply cell: 5 x 0.1048 + 3 x 0.3047 = $1.4381; natural, invoke twin and no-plugin: 3 x 1.4381 =
  $4.3143.
- srvx apply cell at the apply mean x 3.19 per model: 5 x 0.3343 + 3 x 0.9720 = $4.5875; three cells = $13.7626.
- Routing, 9 cases: 9 x 0.5826 = $5.2434.
- Trigger cases: 3 suites x 2k cases x 0.5826 = $3.4956 x k.

| k (fire and quiet per suite) | Trigger cases | Sum | Total x 1.10 |
|---|---|---|---|
| 5 | $17.4780 | $46.7212 | $51.39 |
| 4 | $13.9824 | $43.2256 | $47.55 |
| 3 | $10.4868 | $39.7300 | $43.70 |
| 2 | $6.9912 | $36.2344 | $39.86 |

k = 5 is the largest k whose total is at most 100 USD.

keep n; baseline trigger cases per skill: 10 (projected total $51.39 of the 100 USD budget).
