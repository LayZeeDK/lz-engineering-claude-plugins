# Run set pilot-22.1

## Arm head

- Ref: 975e819c2690492c2f4933eb0b58aeded7df06f3
- claude-sonnet-5-5: 28 runs; models that ran (CLI output): claude-sonnet-5-5
- claude-opus-5-5: 28 runs; models that ran (CLI output): claude-opus-5-5
- Cost (agent plus judge): $5.80
- Wall clock (summed): 1329 s

| Suite | Side | Model | Grader | Passed |
|---|---|---|---|---|
| trigger-lz-tpp | with | claude-sonnet-5-5 | sibling-quiet-lz-red | 2/2 |
| trigger-lz-tpp | with | claude-sonnet-5-5 | sibling-quiet-lz-refactor | 2/2 |
| trigger-lz-tpp | with | claude-sonnet-5-5 | skill-fired | 2/2 |
| trigger-lz-tpp | with | claude-sonnet-5-5 | quiet | 2/2 |
| trigger-lz-tpp | with | claude-opus-5-5 | sibling-quiet-lz-red | 2/2 |
| trigger-lz-tpp | with | claude-opus-5-5 | sibling-quiet-lz-refactor | 2/2 |
| trigger-lz-tpp | with | claude-opus-5-5 | skill-fired | 2/2 |
| trigger-lz-tpp | with | claude-opus-5-5 | quiet | 2/2 |
| trigger-lz-red | with | claude-sonnet-5-5 | sibling-quiet-lz-refactor | 2/2 |
| trigger-lz-red | with | claude-sonnet-5-5 | sibling-quiet-lz-tpp | 2/2 |
| trigger-lz-red | with | claude-sonnet-5-5 | skill-fired | 2/2 |
| trigger-lz-red | with | claude-sonnet-5-5 | quiet | 2/2 |
| trigger-lz-red | with | claude-opus-5-5 | sibling-quiet-lz-refactor | 2/2 |
| trigger-lz-red | with | claude-opus-5-5 | sibling-quiet-lz-tpp | 2/2 |
| trigger-lz-red | with | claude-opus-5-5 | skill-fired | 2/2 |
| trigger-lz-red | with | claude-opus-5-5 | quiet | 2/2 |
| trigger-lz-refactor | with | claude-sonnet-5-5 | sibling-quiet-lz-red | 2/2 |
| trigger-lz-refactor | with | claude-sonnet-5-5 | sibling-quiet-lz-tpp | 2/2 |
| trigger-lz-refactor | with | claude-sonnet-5-5 | skill-fired | 2/2 |
| trigger-lz-refactor | with | claude-sonnet-5-5 | quiet | 2/2 |
| trigger-lz-refactor | with | claude-opus-5-5 | sibling-quiet-lz-red | 2/2 |
| trigger-lz-refactor | with | claude-opus-5-5 | sibling-quiet-lz-tpp | 2/2 |
| trigger-lz-refactor | with | claude-opus-5-5 | skill-fired | 2/2 |
| trigger-lz-refactor | with | claude-opus-5-5 | quiet | 2/2 |
| routing | with | claude-sonnet-5-5 | owner-fired | 2/2 |
| routing | with | claude-sonnet-5-5 | quiet-lz-red | 4/4 |
| routing | with | claude-sonnet-5-5 | quiet-lz-tpp | 4/4 |
| routing | with | claude-sonnet-5-5 | quiet-lz-refactor | 2/2 |
| routing | with | claude-opus-5-5 | owner-fired | 2/2 |
| routing | with | claude-opus-5-5 | quiet-lz-red | 4/4 |
| routing | with | claude-opus-5-5 | quiet-lz-tpp | 4/4 |
| routing | with | claude-opus-5-5 | quiet-lz-refactor | 2/2 |
| doing-lz-red | with | claude-sonnet-5-5 | production-untouched-edit | 2/2 |
| doing-lz-red | with | claude-sonnet-5-5 | production-untouched-write | 2/2 |
| doing-lz-red | with | claude-sonnet-5-5 | red-line | 0/2 |
| doing-lz-red | with | claude-sonnet-5-5 | skill-fired | 2/2 |
| doing-lz-red | with | claude-sonnet-5-5 | wrote-test | 2/2 |
| doing-lz-red | without | claude-sonnet-5-5 | production-untouched-edit | 2/2 |
| doing-lz-red | without | claude-sonnet-5-5 | production-untouched-write | 2/2 |
| doing-lz-red | without | claude-sonnet-5-5 | red-line | 0/2 |
| doing-lz-red | without | claude-sonnet-5-5 | wrote-test | 2/2 |
| doing-lz-red | with | claude-opus-5-5 | production-untouched-edit | 2/2 |
| doing-lz-red | with | claude-opus-5-5 | production-untouched-write | 2/2 |
| doing-lz-red | with | claude-opus-5-5 | red-line | 0/2 |
| doing-lz-red | with | claude-opus-5-5 | skill-fired | 2/2 |
| doing-lz-red | with | claude-opus-5-5 | wrote-test | 2/2 |
| doing-lz-red | without | claude-opus-5-5 | production-untouched-edit | 2/2 |
| doing-lz-red | without | claude-opus-5-5 | production-untouched-write | 2/2 |
| doing-lz-red | without | claude-opus-5-5 | red-line | 0/2 |
| doing-lz-red | without | claude-opus-5-5 | wrote-test | 2/2 |
| doing-lz-red-invoke | with | claude-sonnet-5-5 | production-untouched-edit | 2/2 |
| doing-lz-red-invoke | with | claude-sonnet-5-5 | production-untouched-write | 2/2 |
| doing-lz-red-invoke | with | claude-sonnet-5-5 | red-line | 0/2 |
| doing-lz-red-invoke | with | claude-sonnet-5-5 | wrote-test | 2/2 |
| doing-lz-red-invoke | with | claude-opus-5-5 | production-untouched-edit | 2/2 |
| doing-lz-red-invoke | with | claude-opus-5-5 | production-untouched-write | 2/2 |
| doing-lz-red-invoke | with | claude-opus-5-5 | red-line | 0/2 |
| doing-lz-red-invoke | with | claude-opus-5-5 | wrote-test | 2/2 |
| harness-probes | with | claude-sonnet-5-5 | wrote-inside | 2/2 |
| harness-probes | with | claude-sonnet-5-5 | asked-outside | 2/2 |
| harness-probes | with | claude-opus-5-5 | wrote-inside | 2/2 |
| harness-probes | with | claude-opus-5-5 | asked-outside | 2/2 |
| apply-lz-red | with | claude-sonnet-5-5 | production-untouched-edit | 2/2 |
| apply-lz-red | with | claude-sonnet-5-5 | production-untouched-write | 2/2 |
| apply-lz-red | with | claude-sonnet-5-5 | ran-tests | 2/2 |
| apply-lz-red | with | claude-sonnet-5-5 | red-line | 0/2 |
| apply-lz-red | with | claude-sonnet-5-5 | skill-fired | 2/2 |
| apply-lz-red | with | claude-sonnet-5-5 | wrote-test | 0/2 |
| apply-lz-red | with | claude-opus-5-5 | production-untouched-edit | 2/2 |
| apply-lz-red | with | claude-opus-5-5 | production-untouched-write | 2/2 |
| apply-lz-red | with | claude-opus-5-5 | ran-tests | 2/2 |
| apply-lz-red | with | claude-opus-5-5 | red-line | 0/2 |
| apply-lz-red | with | claude-opus-5-5 | skill-fired | 2/2 |
| apply-lz-red | with | claude-opus-5-5 | wrote-test | 0/2 |
| apply-lz-red-invoke | with | claude-sonnet-5-5 | production-untouched-edit | 2/2 |
| apply-lz-red-invoke | with | claude-sonnet-5-5 | production-untouched-write | 2/2 |
| apply-lz-red-invoke | with | claude-sonnet-5-5 | ran-tests | 2/2 |
| apply-lz-red-invoke | with | claude-sonnet-5-5 | red-line | 0/2 |
| apply-lz-red-invoke | with | claude-sonnet-5-5 | wrote-test | 1/2 |
| apply-lz-red-invoke | with | claude-opus-5-5 | production-untouched-edit | 2/2 |
| apply-lz-red-invoke | with | claude-opus-5-5 | production-untouched-write | 2/2 |
| apply-lz-red-invoke | with | claude-opus-5-5 | ran-tests | 2/2 |
| apply-lz-red-invoke | with | claude-opus-5-5 | red-line | 0/2 |
| apply-lz-red-invoke | with | claude-opus-5-5 | wrote-test | 0/2 |

## Arm no-plugin

- Ref: none (no plugin)
- claude-sonnet-5-5: 1 runs; models that ran (CLI output): claude-sonnet-5-5
- claude-opus-5-5: 1 runs; models that ran (CLI output): claude-opus-5-5
- Cost (agent plus judge): $0.28
- Wall clock (summed): 85 s

| Suite | Side | Model | Grader | Passed |
|---|---|---|---|---|
| apply-lz-red | with | claude-sonnet-5-5 | production-untouched-edit | 1/1 |
| apply-lz-red | with | claude-sonnet-5-5 | production-untouched-write | 1/1 |
| apply-lz-red | with | claude-sonnet-5-5 | ran-tests | 1/1 |
| apply-lz-red | with | claude-sonnet-5-5 | red-line | 0/1 |
| apply-lz-red | with | claude-sonnet-5-5 | skill-fired | 0/1 |
| apply-lz-red | with | claude-sonnet-5-5 | wrote-test | 0/1 |
| apply-lz-red | with | claude-opus-5-5 | production-untouched-edit | 1/1 |
| apply-lz-red | with | claude-opus-5-5 | production-untouched-write | 1/1 |
| apply-lz-red | with | claude-opus-5-5 | ran-tests | 1/1 |
| apply-lz-red | with | claude-opus-5-5 | red-line | 0/1 |
| apply-lz-red | with | claude-opus-5-5 | skill-fired | 0/1 |
| apply-lz-red | with | claude-opus-5-5 | wrote-test | 0/1 |

## With and without

| Suite | Verdict |
|---|---|
| trigger-lz-tpp | no without arm |
| trigger-lz-red | no without arm |
| trigger-lz-refactor | no without arm |
| routing | no without arm |
| doing-lz-red | does not discriminate |
| doing-lz-red-invoke | does not discriminate |
| harness-probes | no without arm |
| apply-lz-red | does not discriminate |
| apply-lz-red-invoke | does not discriminate |

| Suite | Model | Grader | With | Without | Delta | With 95% | Without 95% | Overlap |
|---|---|---|---|---|---|---|---|---|
| doing-lz-red | claude-sonnet-5-5 | production-untouched-edit | 2/2 | 2/2 | 0.00 | [0.342, 1.000] | [0.342, 1.000] | yes |
| doing-lz-red | claude-sonnet-5-5 | production-untouched-write | 2/2 | 2/2 | 0.00 | [0.342, 1.000] | [0.342, 1.000] | yes |
| doing-lz-red | claude-sonnet-5-5 | red-line | 0/2 | 0/2 | 0.00 | [0.000, 0.658] | [0.000, 0.658] | yes |
| doing-lz-red | claude-sonnet-5-5 | wrote-test | 2/2 | 2/2 | 0.00 | [0.342, 1.000] | [0.342, 1.000] | yes |
| doing-lz-red | claude-opus-5-5 | production-untouched-edit | 2/2 | 2/2 | 0.00 | [0.342, 1.000] | [0.342, 1.000] | yes |
| doing-lz-red | claude-opus-5-5 | production-untouched-write | 2/2 | 2/2 | 0.00 | [0.342, 1.000] | [0.342, 1.000] | yes |
| doing-lz-red | claude-opus-5-5 | red-line | 0/2 | 0/2 | 0.00 | [0.000, 0.658] | [0.000, 0.658] | yes |
| doing-lz-red | claude-opus-5-5 | wrote-test | 2/2 | 2/2 | 0.00 | [0.342, 1.000] | [0.342, 1.000] | yes |
| doing-lz-red-invoke | claude-sonnet-5-5 | production-untouched-edit | 2/2 | 2/2 | 0.00 | [0.342, 1.000] | [0.342, 1.000] | yes |
| doing-lz-red-invoke | claude-sonnet-5-5 | production-untouched-write | 2/2 | 2/2 | 0.00 | [0.342, 1.000] | [0.342, 1.000] | yes |
| doing-lz-red-invoke | claude-sonnet-5-5 | red-line | 0/2 | 0/2 | 0.00 | [0.000, 0.658] | [0.000, 0.658] | yes |
| doing-lz-red-invoke | claude-sonnet-5-5 | wrote-test | 2/2 | 2/2 | 0.00 | [0.342, 1.000] | [0.342, 1.000] | yes |
| doing-lz-red-invoke | claude-opus-5-5 | production-untouched-edit | 2/2 | 2/2 | 0.00 | [0.342, 1.000] | [0.342, 1.000] | yes |
| doing-lz-red-invoke | claude-opus-5-5 | production-untouched-write | 2/2 | 2/2 | 0.00 | [0.342, 1.000] | [0.342, 1.000] | yes |
| doing-lz-red-invoke | claude-opus-5-5 | red-line | 0/2 | 0/2 | 0.00 | [0.000, 0.658] | [0.000, 0.658] | yes |
| doing-lz-red-invoke | claude-opus-5-5 | wrote-test | 2/2 | 2/2 | 0.00 | [0.342, 1.000] | [0.342, 1.000] | yes |
| apply-lz-red | claude-sonnet-5-5 | production-untouched-edit | 2/2 | 1/1 | 0.00 | [0.342, 1.000] | [0.207, 1.000] | yes |
| apply-lz-red | claude-sonnet-5-5 | production-untouched-write | 2/2 | 1/1 | 0.00 | [0.342, 1.000] | [0.207, 1.000] | yes |
| apply-lz-red | claude-sonnet-5-5 | ran-tests | 2/2 | 1/1 | 0.00 | [0.342, 1.000] | [0.207, 1.000] | yes |
| apply-lz-red | claude-sonnet-5-5 | red-line | 0/2 | 0/1 | 0.00 | [0.000, 0.658] | [0.000, 0.793] | yes |
| apply-lz-red | claude-sonnet-5-5 | wrote-test | 0/2 | 0/1 | 0.00 | [0.000, 0.658] | [0.000, 0.793] | yes |
| apply-lz-red | claude-opus-5-5 | production-untouched-edit | 2/2 | 1/1 | 0.00 | [0.342, 1.000] | [0.207, 1.000] | yes |
| apply-lz-red | claude-opus-5-5 | production-untouched-write | 2/2 | 1/1 | 0.00 | [0.342, 1.000] | [0.207, 1.000] | yes |
| apply-lz-red | claude-opus-5-5 | ran-tests | 2/2 | 1/1 | 0.00 | [0.342, 1.000] | [0.207, 1.000] | yes |
| apply-lz-red | claude-opus-5-5 | red-line | 0/2 | 0/1 | 0.00 | [0.000, 0.658] | [0.000, 0.793] | yes |
| apply-lz-red | claude-opus-5-5 | wrote-test | 0/2 | 0/1 | 0.00 | [0.000, 0.658] | [0.000, 0.793] | yes |
| apply-lz-red-invoke | claude-sonnet-5-5 | production-untouched-edit | 2/2 | 1/1 | 0.00 | [0.342, 1.000] | [0.207, 1.000] | yes |
| apply-lz-red-invoke | claude-sonnet-5-5 | production-untouched-write | 2/2 | 1/1 | 0.00 | [0.342, 1.000] | [0.207, 1.000] | yes |
| apply-lz-red-invoke | claude-sonnet-5-5 | ran-tests | 2/2 | 1/1 | 0.00 | [0.342, 1.000] | [0.207, 1.000] | yes |
| apply-lz-red-invoke | claude-sonnet-5-5 | red-line | 0/2 | 0/1 | 0.00 | [0.000, 0.658] | [0.000, 0.793] | yes |
| apply-lz-red-invoke | claude-sonnet-5-5 | wrote-test | 1/2 | 0/1 | 0.50 | [0.095, 0.905] | [0.000, 0.793] | yes |
| apply-lz-red-invoke | claude-opus-5-5 | production-untouched-edit | 2/2 | 1/1 | 0.00 | [0.342, 1.000] | [0.207, 1.000] | yes |
| apply-lz-red-invoke | claude-opus-5-5 | production-untouched-write | 2/2 | 1/1 | 0.00 | [0.342, 1.000] | [0.207, 1.000] | yes |
| apply-lz-red-invoke | claude-opus-5-5 | ran-tests | 2/2 | 1/1 | 0.00 | [0.342, 1.000] | [0.207, 1.000] | yes |
| apply-lz-red-invoke | claude-opus-5-5 | red-line | 0/2 | 0/1 | 0.00 | [0.000, 0.658] | [0.000, 0.793] | yes |
| apply-lz-red-invoke | claude-opus-5-5 | wrote-test | 0/2 | 0/1 | 0.00 | [0.000, 0.658] | [0.000, 0.793] | yes |
