# Run set baseline-22.1

## Arm head

- Ref: 20061f7dfd52f7d50325c5a3485ad3f2f727d128
- claude-sonnet-5-5: 255 runs; models that ran (CLI output): claude-sonnet-5-5
- claude-opus-5-5: 153 runs; models that ran (CLI output): claude-opus-5-5
- Cost (agent plus judge): $39.80
- Wall clock (summed): 8377 s

| Suite | Side | Model | Grader | Passed |
|---|---|---|---|---|
| routing | with | claude-sonnet-5-5 | owner-fired | 34/40 |
| routing | with | claude-sonnet-5-5 | quiet-lz-red | 25/25 |
| routing | with | claude-sonnet-5-5 | quiet-lz-tpp | 35/35 |
| routing | with | claude-sonnet-5-5 | quiet-lz-refactor | 30/30 |
| routing | with | claude-opus-5-5 | owner-fired | 24/24 |
| routing | with | claude-opus-5-5 | quiet-lz-red | 15/15 |
| routing | with | claude-opus-5-5 | quiet-lz-tpp | 21/21 |
| routing | with | claude-opus-5-5 | quiet-lz-refactor | 18/18 |
| trigger-lz-tpp | with | claude-sonnet-5-5 | sibling-quiet-lz-red | 25/25 |
| trigger-lz-tpp | with | claude-sonnet-5-5 | sibling-quiet-lz-refactor | 25/25 |
| trigger-lz-tpp | with | claude-sonnet-5-5 | skill-fired | 24/25 |
| trigger-lz-tpp | with | claude-sonnet-5-5 | quiet | 25/25 |
| trigger-lz-tpp | with | claude-opus-5-5 | sibling-quiet-lz-red | 15/15 |
| trigger-lz-tpp | with | claude-opus-5-5 | sibling-quiet-lz-refactor | 15/15 |
| trigger-lz-tpp | with | claude-opus-5-5 | skill-fired | 15/15 |
| trigger-lz-tpp | with | claude-opus-5-5 | quiet | 15/15 |
| trigger-lz-red | with | claude-sonnet-5-5 | sibling-quiet-lz-refactor | 25/25 |
| trigger-lz-red | with | claude-sonnet-5-5 | sibling-quiet-lz-tpp | 25/25 |
| trigger-lz-red | with | claude-sonnet-5-5 | skill-fired | 25/25 |
| trigger-lz-red | with | claude-sonnet-5-5 | quiet | 25/25 |
| trigger-lz-red | with | claude-opus-5-5 | sibling-quiet-lz-refactor | 15/15 |
| trigger-lz-red | with | claude-opus-5-5 | sibling-quiet-lz-tpp | 15/15 |
| trigger-lz-red | with | claude-opus-5-5 | skill-fired | 15/15 |
| trigger-lz-red | with | claude-opus-5-5 | quiet | 15/15 |
| trigger-lz-refactor | with | claude-sonnet-5-5 | sibling-quiet-lz-red | 25/25 |
| trigger-lz-refactor | with | claude-sonnet-5-5 | sibling-quiet-lz-tpp | 25/25 |
| trigger-lz-refactor | with | claude-sonnet-5-5 | skill-fired | 25/25 |
| trigger-lz-refactor | with | claude-sonnet-5-5 | quiet | 25/25 |
| trigger-lz-refactor | with | claude-opus-5-5 | sibling-quiet-lz-red | 15/15 |
| trigger-lz-refactor | with | claude-opus-5-5 | sibling-quiet-lz-tpp | 15/15 |
| trigger-lz-refactor | with | claude-opus-5-5 | skill-fired | 15/15 |
| trigger-lz-refactor | with | claude-opus-5-5 | quiet | 15/15 |
| doing-lz-red | with | claude-sonnet-5-5 | production-untouched-edit | 5/5 |
| doing-lz-red | with | claude-sonnet-5-5 | production-untouched-write | 5/5 |
| doing-lz-red | with | claude-sonnet-5-5 | red-line | 0/5 |
| doing-lz-red | with | claude-sonnet-5-5 | skill-fired | 5/5 |
| doing-lz-red | with | claude-sonnet-5-5 | wrote-test | 5/5 |
| doing-lz-red | without | claude-sonnet-5-5 | production-untouched-edit | 5/5 |
| doing-lz-red | without | claude-sonnet-5-5 | production-untouched-write | 5/5 |
| doing-lz-red | without | claude-sonnet-5-5 | red-line | 0/5 |
| doing-lz-red | without | claude-sonnet-5-5 | wrote-test | 5/5 |
| doing-lz-red | with | claude-opus-5-5 | production-untouched-edit | 3/3 |
| doing-lz-red | with | claude-opus-5-5 | production-untouched-write | 3/3 |
| doing-lz-red | with | claude-opus-5-5 | red-line | 0/3 |
| doing-lz-red | with | claude-opus-5-5 | skill-fired | 3/3 |
| doing-lz-red | with | claude-opus-5-5 | wrote-test | 3/3 |
| doing-lz-red | without | claude-opus-5-5 | production-untouched-edit | 3/3 |
| doing-lz-red | without | claude-opus-5-5 | production-untouched-write | 3/3 |
| doing-lz-red | without | claude-opus-5-5 | red-line | 0/3 |
| doing-lz-red | without | claude-opus-5-5 | wrote-test | 3/3 |
| doing-lz-red-invoke | with | claude-sonnet-5-5 | production-untouched-edit | 5/5 |
| doing-lz-red-invoke | with | claude-sonnet-5-5 | production-untouched-write | 5/5 |
| doing-lz-red-invoke | with | claude-sonnet-5-5 | red-line | 0/5 |
| doing-lz-red-invoke | with | claude-sonnet-5-5 | wrote-test | 5/5 |
| doing-lz-red-invoke | with | claude-opus-5-5 | production-untouched-edit | 3/3 |
| doing-lz-red-invoke | with | claude-opus-5-5 | production-untouched-write | 3/3 |
| doing-lz-red-invoke | with | claude-opus-5-5 | red-line | 0/3 |
| doing-lz-red-invoke | with | claude-opus-5-5 | wrote-test | 3/3 |
| doing-lz-tpp | with | claude-sonnet-5-5 | edited-production | 2/5 |
| doing-lz-tpp | with | claude-sonnet-5-5 | green-line | 0/5 |
| doing-lz-tpp | with | claude-sonnet-5-5 | leaf-read | 0/5 |
| doing-lz-tpp | with | claude-sonnet-5-5 | skill-fired | 4/5 |
| doing-lz-tpp | with | claude-sonnet-5-5 | test-untouched-edit | 5/5 |
| doing-lz-tpp | with | claude-sonnet-5-5 | test-untouched-write | 5/5 |
| doing-lz-tpp | without | claude-sonnet-5-5 | edited-production | 5/5 |
| doing-lz-tpp | without | claude-sonnet-5-5 | green-line | 0/5 |
| doing-lz-tpp | without | claude-sonnet-5-5 | test-untouched-edit | 5/5 |
| doing-lz-tpp | without | claude-sonnet-5-5 | test-untouched-write | 5/5 |
| doing-lz-tpp | with | claude-opus-5-5 | edited-production | 3/3 |
| doing-lz-tpp | with | claude-opus-5-5 | green-line | 0/3 |
| doing-lz-tpp | with | claude-opus-5-5 | leaf-read | 0/3 |
| doing-lz-tpp | with | claude-opus-5-5 | skill-fired | 3/3 |
| doing-lz-tpp | with | claude-opus-5-5 | test-untouched-edit | 3/3 |
| doing-lz-tpp | with | claude-opus-5-5 | test-untouched-write | 3/3 |
| doing-lz-tpp | without | claude-opus-5-5 | edited-production | 3/3 |
| doing-lz-tpp | without | claude-opus-5-5 | green-line | 0/3 |
| doing-lz-tpp | without | claude-opus-5-5 | test-untouched-edit | 3/3 |
| doing-lz-tpp | without | claude-opus-5-5 | test-untouched-write | 3/3 |
| doing-lz-tpp-invoke | with | claude-sonnet-5-5 | edited-production | 0/5 |
| doing-lz-tpp-invoke | with | claude-sonnet-5-5 | green-line | 0/5 |
| doing-lz-tpp-invoke | with | claude-sonnet-5-5 | leaf-read | 2/5 |
| doing-lz-tpp-invoke | with | claude-sonnet-5-5 | test-untouched-edit | 5/5 |
| doing-lz-tpp-invoke | with | claude-sonnet-5-5 | test-untouched-write | 5/5 |
| doing-lz-tpp-invoke | with | claude-opus-5-5 | edited-production | 0/3 |
| doing-lz-tpp-invoke | with | claude-opus-5-5 | green-line | 0/3 |
| doing-lz-tpp-invoke | with | claude-opus-5-5 | leaf-read | 0/3 |
| doing-lz-tpp-invoke | with | claude-opus-5-5 | test-untouched-edit | 3/3 |
| doing-lz-tpp-invoke | with | claude-opus-5-5 | test-untouched-write | 3/3 |
| doing-lz-refactor | with | claude-sonnet-5-5 | edited-production | 3/5 |
| doing-lz-refactor | with | claude-sonnet-5-5 | leaf-read | 3/5 |
| doing-lz-refactor | with | claude-sonnet-5-5 | refactor-line | 0/5 |
| doing-lz-refactor | with | claude-sonnet-5-5 | skill-fired | 5/5 |
| doing-lz-refactor | with | claude-sonnet-5-5 | test-untouched-edit | 5/5 |
| doing-lz-refactor | with | claude-sonnet-5-5 | test-untouched-write | 5/5 |
| doing-lz-refactor | without | claude-sonnet-5-5 | edited-production | 5/5 |
| doing-lz-refactor | without | claude-sonnet-5-5 | refactor-line | 0/5 |
| doing-lz-refactor | without | claude-sonnet-5-5 | test-untouched-edit | 5/5 |
| doing-lz-refactor | without | claude-sonnet-5-5 | test-untouched-write | 5/5 |
| doing-lz-refactor | with | claude-opus-5-5 | edited-production | 1/3 |
| doing-lz-refactor | with | claude-opus-5-5 | leaf-read | 3/3 |
| doing-lz-refactor | with | claude-opus-5-5 | refactor-line | 0/3 |
| doing-lz-refactor | with | claude-opus-5-5 | skill-fired | 3/3 |
| doing-lz-refactor | with | claude-opus-5-5 | test-untouched-edit | 3/3 |
| doing-lz-refactor | with | claude-opus-5-5 | test-untouched-write | 3/3 |
| doing-lz-refactor | without | claude-opus-5-5 | edited-production | 0/3 |
| doing-lz-refactor | without | claude-opus-5-5 | refactor-line | 0/3 |
| doing-lz-refactor | without | claude-opus-5-5 | test-untouched-edit | 3/3 |
| doing-lz-refactor | without | claude-opus-5-5 | test-untouched-write | 3/3 |
| doing-lz-refactor-invoke | with | claude-sonnet-5-5 | edited-production | 5/5 |
| doing-lz-refactor-invoke | with | claude-sonnet-5-5 | leaf-read | 3/5 |
| doing-lz-refactor-invoke | with | claude-sonnet-5-5 | refactor-line | 0/5 |
| doing-lz-refactor-invoke | with | claude-sonnet-5-5 | test-untouched-edit | 5/5 |
| doing-lz-refactor-invoke | with | claude-sonnet-5-5 | test-untouched-write | 5/5 |
| doing-lz-refactor-invoke | with | claude-opus-5-5 | edited-production | 1/3 |
| doing-lz-refactor-invoke | with | claude-opus-5-5 | leaf-read | 2/3 |
| doing-lz-refactor-invoke | with | claude-opus-5-5 | refactor-line | 0/3 |
| doing-lz-refactor-invoke | with | claude-opus-5-5 | test-untouched-edit | 3/3 |
| doing-lz-refactor-invoke | with | claude-opus-5-5 | test-untouched-write | 3/3 |
| apply-lz-red | with | claude-sonnet-5-5 | edited-test | 4/5 |
| apply-lz-red | with | claude-sonnet-5-5 | production-untouched-edit | 5/5 |
| apply-lz-red | with | claude-sonnet-5-5 | production-untouched-write | 5/5 |
| apply-lz-red | with | claude-sonnet-5-5 | ran-tests | 5/5 |
| apply-lz-red | with | claude-sonnet-5-5 | red-line | 0/5 |
| apply-lz-red | with | claude-sonnet-5-5 | skill-fired | 5/5 |
| apply-lz-red | with | claude-opus-5-5 | edited-test | 2/3 |
| apply-lz-red | with | claude-opus-5-5 | production-untouched-edit | 3/3 |
| apply-lz-red | with | claude-opus-5-5 | production-untouched-write | 3/3 |
| apply-lz-red | with | claude-opus-5-5 | ran-tests | 3/3 |
| apply-lz-red | with | claude-opus-5-5 | red-line | 0/3 |
| apply-lz-red | with | claude-opus-5-5 | skill-fired | 3/3 |
| apply-lz-red-invoke | with | claude-sonnet-5-5 | edited-test | 4/5 |
| apply-lz-red-invoke | with | claude-sonnet-5-5 | production-untouched-edit | 5/5 |
| apply-lz-red-invoke | with | claude-sonnet-5-5 | production-untouched-write | 5/5 |
| apply-lz-red-invoke | with | claude-sonnet-5-5 | ran-tests | 5/5 |
| apply-lz-red-invoke | with | claude-sonnet-5-5 | red-line | 0/5 |
| apply-lz-red-invoke | with | claude-opus-5-5 | edited-test | 3/3 |
| apply-lz-red-invoke | with | claude-opus-5-5 | production-untouched-edit | 3/3 |
| apply-lz-red-invoke | with | claude-opus-5-5 | production-untouched-write | 3/3 |
| apply-lz-red-invoke | with | claude-opus-5-5 | ran-tests | 3/3 |
| apply-lz-red-invoke | with | claude-opus-5-5 | red-line | 0/3 |
| apply-lz-tpp | with | claude-sonnet-5-5 | edited-production | 5/5 |
| apply-lz-tpp | with | claude-sonnet-5-5 | green-line | 0/5 |
| apply-lz-tpp | with | claude-sonnet-5-5 | leaf-read | 0/5 |
| apply-lz-tpp | with | claude-sonnet-5-5 | ran-tests | 5/5 |
| apply-lz-tpp | with | claude-sonnet-5-5 | skill-fired | 0/5 |
| apply-lz-tpp | with | claude-sonnet-5-5 | test-untouched-edit | 5/5 |
| apply-lz-tpp | with | claude-sonnet-5-5 | test-untouched-write | 5/5 |
| apply-lz-tpp | with | claude-opus-5-5 | edited-production | 3/3 |
| apply-lz-tpp | with | claude-opus-5-5 | green-line | 0/3 |
| apply-lz-tpp | with | claude-opus-5-5 | leaf-read | 0/3 |
| apply-lz-tpp | with | claude-opus-5-5 | ran-tests | 3/3 |
| apply-lz-tpp | with | claude-opus-5-5 | skill-fired | 3/3 |
| apply-lz-tpp | with | claude-opus-5-5 | test-untouched-edit | 3/3 |
| apply-lz-tpp | with | claude-opus-5-5 | test-untouched-write | 3/3 |
| apply-lz-tpp-invoke | with | claude-sonnet-5-5 | edited-production | 5/5 |
| apply-lz-tpp-invoke | with | claude-sonnet-5-5 | green-line | 0/5 |
| apply-lz-tpp-invoke | with | claude-sonnet-5-5 | leaf-read | 0/5 |
| apply-lz-tpp-invoke | with | claude-sonnet-5-5 | ran-tests | 5/5 |
| apply-lz-tpp-invoke | with | claude-sonnet-5-5 | test-untouched-edit | 5/5 |
| apply-lz-tpp-invoke | with | claude-sonnet-5-5 | test-untouched-write | 5/5 |
| apply-lz-tpp-invoke | with | claude-opus-5-5 | edited-production | 3/3 |
| apply-lz-tpp-invoke | with | claude-opus-5-5 | green-line | 0/3 |
| apply-lz-tpp-invoke | with | claude-opus-5-5 | leaf-read | 0/3 |
| apply-lz-tpp-invoke | with | claude-opus-5-5 | ran-tests | 3/3 |
| apply-lz-tpp-invoke | with | claude-opus-5-5 | test-untouched-edit | 3/3 |
| apply-lz-tpp-invoke | with | claude-opus-5-5 | test-untouched-write | 3/3 |
| apply-lz-refactor | with | claude-sonnet-5-5 | edited-production | 1/5 |
| apply-lz-refactor | with | claude-sonnet-5-5 | leaf-read | 0/5 |
| apply-lz-refactor | with | claude-sonnet-5-5 | ran-tests | 5/5 |
| apply-lz-refactor | with | claude-sonnet-5-5 | refactor-line | 0/5 |
| apply-lz-refactor | with | claude-sonnet-5-5 | skill-fired | 0/5 |
| apply-lz-refactor | with | claude-opus-5-5 | edited-production | 2/3 |
| apply-lz-refactor | with | claude-opus-5-5 | leaf-read | 0/3 |
| apply-lz-refactor | with | claude-opus-5-5 | ran-tests | 3/3 |
| apply-lz-refactor | with | claude-opus-5-5 | refactor-line | 0/3 |
| apply-lz-refactor | with | claude-opus-5-5 | skill-fired | 3/3 |
| apply-lz-refactor-invoke | with | claude-sonnet-5-5 | edited-production | 2/5 |
| apply-lz-refactor-invoke | with | claude-sonnet-5-5 | leaf-read | 0/5 |
| apply-lz-refactor-invoke | with | claude-sonnet-5-5 | ran-tests | 5/5 |
| apply-lz-refactor-invoke | with | claude-sonnet-5-5 | refactor-line | 0/5 |
| apply-lz-refactor-invoke | with | claude-opus-5-5 | edited-production | 1/3 |
| apply-lz-refactor-invoke | with | claude-opus-5-5 | leaf-read | 1/3 |
| apply-lz-refactor-invoke | with | claude-opus-5-5 | ran-tests | 3/3 |
| apply-lz-refactor-invoke | with | claude-opus-5-5 | refactor-line | 0/3 |

## Arm no-plugin

- Ref: none (no plugin)
- claude-sonnet-5-5: 15 runs; models that ran (CLI output): claude-sonnet-5-5
- claude-opus-5-5: 9 runs; models that ran (CLI output): claude-opus-5-5
- Cost (agent plus judge): $3.27
- Wall clock (summed): 914 s

| Suite | Side | Model | Grader | Passed |
|---|---|---|---|---|
| apply-lz-red | with | claude-sonnet-5-5 | edited-test | 4/5 |
| apply-lz-red | with | claude-sonnet-5-5 | production-untouched-edit | 5/5 |
| apply-lz-red | with | claude-sonnet-5-5 | production-untouched-write | 5/5 |
| apply-lz-red | with | claude-sonnet-5-5 | ran-tests | 5/5 |
| apply-lz-red | with | claude-sonnet-5-5 | red-line | 0/5 |
| apply-lz-red | with | claude-sonnet-5-5 | skill-fired | 0/5 |
| apply-lz-red | with | claude-opus-5-5 | edited-test | 3/3 |
| apply-lz-red | with | claude-opus-5-5 | production-untouched-edit | 3/3 |
| apply-lz-red | with | claude-opus-5-5 | production-untouched-write | 3/3 |
| apply-lz-red | with | claude-opus-5-5 | ran-tests | 3/3 |
| apply-lz-red | with | claude-opus-5-5 | red-line | 0/3 |
| apply-lz-red | with | claude-opus-5-5 | skill-fired | 0/3 |
| apply-lz-tpp | with | claude-sonnet-5-5 | edited-production | 5/5 |
| apply-lz-tpp | with | claude-sonnet-5-5 | green-line | 0/5 |
| apply-lz-tpp | with | claude-sonnet-5-5 | leaf-read | 0/5 |
| apply-lz-tpp | with | claude-sonnet-5-5 | ran-tests | 5/5 |
| apply-lz-tpp | with | claude-sonnet-5-5 | skill-fired | 0/5 |
| apply-lz-tpp | with | claude-sonnet-5-5 | test-untouched-edit | 5/5 |
| apply-lz-tpp | with | claude-sonnet-5-5 | test-untouched-write | 5/5 |
| apply-lz-tpp | with | claude-opus-5-5 | edited-production | 3/3 |
| apply-lz-tpp | with | claude-opus-5-5 | green-line | 0/3 |
| apply-lz-tpp | with | claude-opus-5-5 | leaf-read | 0/3 |
| apply-lz-tpp | with | claude-opus-5-5 | ran-tests | 3/3 |
| apply-lz-tpp | with | claude-opus-5-5 | skill-fired | 0/3 |
| apply-lz-tpp | with | claude-opus-5-5 | test-untouched-edit | 3/3 |
| apply-lz-tpp | with | claude-opus-5-5 | test-untouched-write | 3/3 |
| apply-lz-refactor | with | claude-sonnet-5-5 | edited-production | 4/5 |
| apply-lz-refactor | with | claude-sonnet-5-5 | leaf-read | 0/5 |
| apply-lz-refactor | with | claude-sonnet-5-5 | ran-tests | 4/5 |
| apply-lz-refactor | with | claude-sonnet-5-5 | refactor-line | 0/5 |
| apply-lz-refactor | with | claude-sonnet-5-5 | skill-fired | 0/5 |
| apply-lz-refactor | with | claude-opus-5-5 | edited-production | 1/3 |
| apply-lz-refactor | with | claude-opus-5-5 | leaf-read | 0/3 |
| apply-lz-refactor | with | claude-opus-5-5 | ran-tests | 3/3 |
| apply-lz-refactor | with | claude-opus-5-5 | refactor-line | 0/3 |
| apply-lz-refactor | with | claude-opus-5-5 | skill-fired | 0/3 |

## Arm srvx

- Ref: 9491ad3ca298ee1764479c24895cfcefa76c3f66
- claude-sonnet-5-5: 10 runs; models that ran (CLI output): claude-sonnet-5-5
- claude-opus-5-5: 6 runs; models that ran (CLI output): claude-opus-5-5
- Cost (agent plus judge): $3.58
- Wall clock (summed): 693 s

| Suite | Side | Model | Grader | Passed |
|---|---|---|---|---|
| apply-lz-red-srvx | with | claude-sonnet-5-5 | edited-test | 3/5 |
| apply-lz-red-srvx | with | claude-sonnet-5-5 | production-untouched-edit | 5/5 |
| apply-lz-red-srvx | with | claude-sonnet-5-5 | production-untouched-write | 5/5 |
| apply-lz-red-srvx | with | claude-sonnet-5-5 | ran-tests | 5/5 |
| apply-lz-red-srvx | with | claude-sonnet-5-5 | red-line | 0/5 |
| apply-lz-red-srvx | with | claude-sonnet-5-5 | skill-fired | 5/5 |
| apply-lz-red-srvx | with | claude-opus-5-5 | edited-test | 0/3 |
| apply-lz-red-srvx | with | claude-opus-5-5 | production-untouched-edit | 3/3 |
| apply-lz-red-srvx | with | claude-opus-5-5 | production-untouched-write | 3/3 |
| apply-lz-red-srvx | with | claude-opus-5-5 | ran-tests | 3/3 |
| apply-lz-red-srvx | with | claude-opus-5-5 | red-line | 0/3 |
| apply-lz-red-srvx | with | claude-opus-5-5 | skill-fired | 3/3 |
| apply-lz-red-srvx-invoke | with | claude-sonnet-5-5 | edited-test | 2/5 |
| apply-lz-red-srvx-invoke | with | claude-sonnet-5-5 | production-untouched-edit | 5/5 |
| apply-lz-red-srvx-invoke | with | claude-sonnet-5-5 | production-untouched-write | 5/5 |
| apply-lz-red-srvx-invoke | with | claude-sonnet-5-5 | ran-tests | 5/5 |
| apply-lz-red-srvx-invoke | with | claude-sonnet-5-5 | red-line | 0/5 |
| apply-lz-red-srvx-invoke | with | claude-opus-5-5 | edited-test | 0/3 |
| apply-lz-red-srvx-invoke | with | claude-opus-5-5 | production-untouched-edit | 3/3 |
| apply-lz-red-srvx-invoke | with | claude-opus-5-5 | production-untouched-write | 3/3 |
| apply-lz-red-srvx-invoke | with | claude-opus-5-5 | ran-tests | 3/3 |
| apply-lz-red-srvx-invoke | with | claude-opus-5-5 | red-line | 0/3 |

## Arm srvx-no-plugin

- Ref: none (no plugin)
- claude-sonnet-5-5: 5 runs; models that ran (CLI output): claude-sonnet-5-5
- claude-opus-5-5: 3 runs; models that ran (CLI output): claude-opus-5-5
- Cost (agent plus judge): $1.57
- Wall clock (summed): 352 s

| Suite | Side | Model | Grader | Passed |
|---|---|---|---|---|
| apply-lz-red-srvx | with | claude-sonnet-5-5 | edited-test | 0/5 |
| apply-lz-red-srvx | with | claude-sonnet-5-5 | production-untouched-edit | 5/5 |
| apply-lz-red-srvx | with | claude-sonnet-5-5 | production-untouched-write | 5/5 |
| apply-lz-red-srvx | with | claude-sonnet-5-5 | ran-tests | 5/5 |
| apply-lz-red-srvx | with | claude-sonnet-5-5 | red-line | 0/5 |
| apply-lz-red-srvx | with | claude-sonnet-5-5 | skill-fired | 0/5 |
| apply-lz-red-srvx | with | claude-opus-5-5 | edited-test | 0/3 |
| apply-lz-red-srvx | with | claude-opus-5-5 | production-untouched-edit | 3/3 |
| apply-lz-red-srvx | with | claude-opus-5-5 | production-untouched-write | 3/3 |
| apply-lz-red-srvx | with | claude-opus-5-5 | ran-tests | 3/3 |
| apply-lz-red-srvx | with | claude-opus-5-5 | red-line | 0/3 |
| apply-lz-red-srvx | with | claude-opus-5-5 | skill-fired | 0/3 |

## With and without

| Suite | Verdict |
|---|---|
| routing | no without arm |
| trigger-lz-tpp | no without arm |
| trigger-lz-red | no without arm |
| trigger-lz-refactor | no without arm |
| doing-lz-red | does not discriminate |
| doing-lz-red-invoke | does not discriminate |
| doing-lz-tpp | does not discriminate |
| doing-lz-tpp-invoke | discriminates |
| doing-lz-refactor | does not discriminate |
| doing-lz-refactor-invoke | does not discriminate |
| apply-lz-red | does not discriminate |
| apply-lz-red-invoke | does not discriminate |
| apply-lz-tpp | does not discriminate |
| apply-lz-tpp-invoke | does not discriminate |
| apply-lz-refactor | does not discriminate |
| apply-lz-refactor-invoke | does not discriminate |
| apply-lz-red-srvx | does not discriminate |
| apply-lz-red-srvx-invoke | does not discriminate |

| Suite | Model | Grader | With | Without | Delta | With 95% | Without 95% | Overlap |
|---|---|---|---|---|---|---|---|---|
| doing-lz-red | claude-sonnet-5-5 | production-untouched-edit | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-red | claude-sonnet-5-5 | production-untouched-write | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-red | claude-sonnet-5-5 | red-line | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| doing-lz-red | claude-sonnet-5-5 | wrote-test | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-red | claude-opus-5-5 | production-untouched-edit | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-red | claude-opus-5-5 | production-untouched-write | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-red | claude-opus-5-5 | red-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| doing-lz-red | claude-opus-5-5 | wrote-test | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-red-invoke | claude-sonnet-5-5 | production-untouched-edit | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-red-invoke | claude-sonnet-5-5 | production-untouched-write | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-red-invoke | claude-sonnet-5-5 | red-line | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| doing-lz-red-invoke | claude-sonnet-5-5 | wrote-test | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-red-invoke | claude-opus-5-5 | production-untouched-edit | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-red-invoke | claude-opus-5-5 | production-untouched-write | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-red-invoke | claude-opus-5-5 | red-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| doing-lz-red-invoke | claude-opus-5-5 | wrote-test | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-tpp | claude-sonnet-5-5 | edited-production | 2/5 | 5/5 | -0.60 | [0.118, 0.769] | [0.566, 1.000] | yes |
| doing-lz-tpp | claude-sonnet-5-5 | green-line | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| doing-lz-tpp | claude-sonnet-5-5 | test-untouched-edit | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-tpp | claude-sonnet-5-5 | test-untouched-write | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-tpp | claude-opus-5-5 | edited-production | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-tpp | claude-opus-5-5 | green-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| doing-lz-tpp | claude-opus-5-5 | test-untouched-edit | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-tpp | claude-opus-5-5 | test-untouched-write | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-tpp-invoke | claude-sonnet-5-5 | edited-production | 0/5 | 5/5 | -1.00 | [0.000, 0.434] | [0.566, 1.000] | no |
| doing-lz-tpp-invoke | claude-sonnet-5-5 | green-line | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| doing-lz-tpp-invoke | claude-sonnet-5-5 | test-untouched-edit | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-tpp-invoke | claude-sonnet-5-5 | test-untouched-write | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-tpp-invoke | claude-opus-5-5 | edited-production | 0/3 | 3/3 | -1.00 | [0.000, 0.561] | [0.439, 1.000] | yes |
| doing-lz-tpp-invoke | claude-opus-5-5 | green-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| doing-lz-tpp-invoke | claude-opus-5-5 | test-untouched-edit | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-tpp-invoke | claude-opus-5-5 | test-untouched-write | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-refactor | claude-sonnet-5-5 | edited-production | 3/5 | 5/5 | -0.40 | [0.231, 0.882] | [0.566, 1.000] | yes |
| doing-lz-refactor | claude-sonnet-5-5 | refactor-line | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| doing-lz-refactor | claude-sonnet-5-5 | test-untouched-edit | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-refactor | claude-sonnet-5-5 | test-untouched-write | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-refactor | claude-opus-5-5 | edited-production | 1/3 | 0/3 | 0.33 | [0.061, 0.792] | [0.000, 0.561] | yes |
| doing-lz-refactor | claude-opus-5-5 | refactor-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| doing-lz-refactor | claude-opus-5-5 | test-untouched-edit | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-refactor | claude-opus-5-5 | test-untouched-write | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-refactor-invoke | claude-sonnet-5-5 | edited-production | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-refactor-invoke | claude-sonnet-5-5 | refactor-line | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| doing-lz-refactor-invoke | claude-sonnet-5-5 | test-untouched-edit | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-refactor-invoke | claude-sonnet-5-5 | test-untouched-write | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| doing-lz-refactor-invoke | claude-opus-5-5 | edited-production | 1/3 | 0/3 | 0.33 | [0.061, 0.792] | [0.000, 0.561] | yes |
| doing-lz-refactor-invoke | claude-opus-5-5 | refactor-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| doing-lz-refactor-invoke | claude-opus-5-5 | test-untouched-edit | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-refactor-invoke | claude-opus-5-5 | test-untouched-write | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-red | claude-sonnet-5-5 | edited-test | 4/5 | 4/5 | 0.00 | [0.376, 0.964] | [0.376, 0.964] | yes |
| apply-lz-red | claude-sonnet-5-5 | production-untouched-edit | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-red | claude-sonnet-5-5 | production-untouched-write | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-red | claude-sonnet-5-5 | ran-tests | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-red | claude-sonnet-5-5 | red-line | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| apply-lz-red | claude-opus-5-5 | edited-test | 2/3 | 3/3 | -0.33 | [0.208, 0.939] | [0.439, 1.000] | yes |
| apply-lz-red | claude-opus-5-5 | production-untouched-edit | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-red | claude-opus-5-5 | production-untouched-write | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-red | claude-opus-5-5 | ran-tests | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-red | claude-opus-5-5 | red-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| apply-lz-red-invoke | claude-sonnet-5-5 | edited-test | 4/5 | 4/5 | 0.00 | [0.376, 0.964] | [0.376, 0.964] | yes |
| apply-lz-red-invoke | claude-sonnet-5-5 | production-untouched-edit | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-red-invoke | claude-sonnet-5-5 | production-untouched-write | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-red-invoke | claude-sonnet-5-5 | ran-tests | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-red-invoke | claude-sonnet-5-5 | red-line | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| apply-lz-red-invoke | claude-opus-5-5 | edited-test | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-red-invoke | claude-opus-5-5 | production-untouched-edit | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-red-invoke | claude-opus-5-5 | production-untouched-write | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-red-invoke | claude-opus-5-5 | ran-tests | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-red-invoke | claude-opus-5-5 | red-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| apply-lz-tpp | claude-sonnet-5-5 | edited-production | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-tpp | claude-sonnet-5-5 | green-line | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| apply-lz-tpp | claude-sonnet-5-5 | leaf-read | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| apply-lz-tpp | claude-sonnet-5-5 | ran-tests | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-tpp | claude-sonnet-5-5 | test-untouched-edit | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-tpp | claude-sonnet-5-5 | test-untouched-write | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-tpp | claude-opus-5-5 | edited-production | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-tpp | claude-opus-5-5 | green-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| apply-lz-tpp | claude-opus-5-5 | leaf-read | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| apply-lz-tpp | claude-opus-5-5 | ran-tests | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-tpp | claude-opus-5-5 | test-untouched-edit | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-tpp | claude-opus-5-5 | test-untouched-write | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-tpp-invoke | claude-sonnet-5-5 | edited-production | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-tpp-invoke | claude-sonnet-5-5 | green-line | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| apply-lz-tpp-invoke | claude-sonnet-5-5 | leaf-read | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| apply-lz-tpp-invoke | claude-sonnet-5-5 | ran-tests | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-tpp-invoke | claude-sonnet-5-5 | test-untouched-edit | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-tpp-invoke | claude-sonnet-5-5 | test-untouched-write | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-tpp-invoke | claude-opus-5-5 | edited-production | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-tpp-invoke | claude-opus-5-5 | green-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| apply-lz-tpp-invoke | claude-opus-5-5 | leaf-read | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| apply-lz-tpp-invoke | claude-opus-5-5 | ran-tests | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-tpp-invoke | claude-opus-5-5 | test-untouched-edit | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-tpp-invoke | claude-opus-5-5 | test-untouched-write | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-refactor | claude-sonnet-5-5 | edited-production | 1/5 | 4/5 | -0.60 | [0.036, 0.624] | [0.376, 0.964] | yes |
| apply-lz-refactor | claude-sonnet-5-5 | leaf-read | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| apply-lz-refactor | claude-sonnet-5-5 | ran-tests | 5/5 | 4/5 | 0.20 | [0.566, 1.000] | [0.376, 0.964] | yes |
| apply-lz-refactor | claude-sonnet-5-5 | refactor-line | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| apply-lz-refactor | claude-opus-5-5 | edited-production | 2/3 | 1/3 | 0.33 | [0.208, 0.939] | [0.061, 0.792] | yes |
| apply-lz-refactor | claude-opus-5-5 | leaf-read | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| apply-lz-refactor | claude-opus-5-5 | ran-tests | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-refactor | claude-opus-5-5 | refactor-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| apply-lz-refactor-invoke | claude-sonnet-5-5 | edited-production | 2/5 | 4/5 | -0.40 | [0.118, 0.769] | [0.376, 0.964] | yes |
| apply-lz-refactor-invoke | claude-sonnet-5-5 | leaf-read | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| apply-lz-refactor-invoke | claude-sonnet-5-5 | ran-tests | 5/5 | 4/5 | 0.20 | [0.566, 1.000] | [0.376, 0.964] | yes |
| apply-lz-refactor-invoke | claude-sonnet-5-5 | refactor-line | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| apply-lz-refactor-invoke | claude-opus-5-5 | edited-production | 1/3 | 1/3 | 0.00 | [0.061, 0.792] | [0.061, 0.792] | yes |
| apply-lz-refactor-invoke | claude-opus-5-5 | leaf-read | 1/3 | 0/3 | 0.33 | [0.061, 0.792] | [0.000, 0.561] | yes |
| apply-lz-refactor-invoke | claude-opus-5-5 | ran-tests | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-refactor-invoke | claude-opus-5-5 | refactor-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| apply-lz-red-srvx | claude-sonnet-5-5 | edited-test | 3/5 | 0/5 | 0.60 | [0.231, 0.882] | [0.000, 0.434] | yes |
| apply-lz-red-srvx | claude-sonnet-5-5 | production-untouched-edit | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-red-srvx | claude-sonnet-5-5 | production-untouched-write | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-red-srvx | claude-sonnet-5-5 | ran-tests | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-red-srvx | claude-sonnet-5-5 | red-line | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| apply-lz-red-srvx | claude-opus-5-5 | edited-test | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| apply-lz-red-srvx | claude-opus-5-5 | production-untouched-edit | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-red-srvx | claude-opus-5-5 | production-untouched-write | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-red-srvx | claude-opus-5-5 | ran-tests | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-red-srvx | claude-opus-5-5 | red-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| apply-lz-red-srvx-invoke | claude-sonnet-5-5 | edited-test | 2/5 | 0/5 | 0.40 | [0.118, 0.769] | [0.000, 0.434] | yes |
| apply-lz-red-srvx-invoke | claude-sonnet-5-5 | production-untouched-edit | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-red-srvx-invoke | claude-sonnet-5-5 | production-untouched-write | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-red-srvx-invoke | claude-sonnet-5-5 | ran-tests | 5/5 | 5/5 | 0.00 | [0.566, 1.000] | [0.566, 1.000] | yes |
| apply-lz-red-srvx-invoke | claude-sonnet-5-5 | red-line | 0/5 | 0/5 | 0.00 | [0.000, 0.434] | [0.000, 0.434] | yes |
| apply-lz-red-srvx-invoke | claude-opus-5-5 | edited-test | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| apply-lz-red-srvx-invoke | claude-opus-5-5 | production-untouched-edit | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-red-srvx-invoke | claude-opus-5-5 | production-untouched-write | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-red-srvx-invoke | claude-opus-5-5 | ran-tests | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| apply-lz-red-srvx-invoke | claude-opus-5-5 | red-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |

## Notes

Written by hand after `aggregate`; every figure is counted from the run folders' result.json files and the CLI
output in each run's raw folder.

- Models: all 456 results name the requested model in the CLI output (`initModel` and `modelsUsed`):
  claude-sonnet-5-5 in 285, claude-opus-5-5 in 171. No other model ran. The plugin tree in every `head` and `srvx`
  result is 6479dbe82d2e3542f88091a5fefb0fc8ad0be82f; the two no-plugin arms load no plugin.
- Cost: $48.22 for the 456 results ($39.80 `head`, $3.27 `no-plugin`, $3.58 `srvx`, $1.57 `srvx-no-plugin`). Runs
  that were stopped before they wrote a result are not in that sum. 11 run folders were set aside and rerun: 5 Sonnet
  doing-lz-red-08 runs whose scaffold failed before a session started (no cost), 5 runs stopped mid-session (2 Opus
  doing-lz-red-08, 3 slim apply runs) and 1 srvx run stopped by the usage limit within seconds. None of their traces
  reached a cost line; by their kinds' means they cost about $1.6 (estimated).
- `crosscheck`: 1032 agree, 0 disagree, 0 unchecked.
- Opus recheck: `aggregate` listed no case that passes on Sonnet and fails on Opus, before or after the srvx cells,
  so no recheck runs were planned.
- `max_turns`: 16 runs hit the routing suite's cap of 3 (11 Sonnet, 5 Opus). No trigger run hit its new cap of 10.
- In the two no-plugin arms the Side column reads `with` for every row: it names the ablation side, and those arms
  load no plugin at all. Their `skill-fired` rows are 0 by construction and are left out of the With and without
  section.
- srvx ran last, after the committed analysis of the other suites (Lars's 2026-11-25 ruling). Its template is built
  as an npm project; the first measured run (Sonnet, $0.14) needed no change to the suite's allow list.
- srvx `edited-test` re-grade (2026-11-27, no run cost): the grader counted only an Edit call on a file under
  `test/`, and most runs created the test file with Write. It now counts Edit or Write (`tool: 'Edit|Write'`). The
  24 srvx runs were graded again from their saved transcripts with the changed grader: `edited-test` passes in 24 of
  24 (srvx Sonnet natural 5/5, invoke 5/5; srvx Opus natural 3/3, invoke 3/3; srvx-no-plugin Sonnet 5/5, Opus 3/3).
  The tables above keep the figures of the original grading (3/5, 0/3, 2/5, 0/3 with; 0/5, 0/3 without); the result.json
  files were not rewritten. The Sonnet difference of 3/5 against 0/5 came from the grader, not from the plugin, so
  `apply-lz-red-srvx` still does not discriminate, now with every grader equal on both sides except `red-line` (0
  everywhere) and `skill-fired`.

### Trigger recall next to the reproduction

The reproduction (run set repro-22.1) and this baseline used different protocols. The reproduction re-ran the
recorded cells on claude-opus-4-8 with `max_turns: 3` and Agent allowed, in an empty folder. This baseline runs
`max_turns: 10` with the Agent tool disallowed (Lars's 2026-11-26 ruling), on claude-sonnet-5-5 and
claude-opus-5-5, on the first fire and quiet `baseline` cases of each suite (Lars's 2026-11-25 cut). The figures
are side by side for reference, not as a reproduction.

| Suite | Baseline skill-fired, Sonnet | Baseline skill-fired, Opus | repro-22.1 skill-fired (claude-opus-4-8) |
|---|---|---|---|
| trigger-lz-tpp | 24/25 | 15/15 | 29/39 runs, 10/13 cases |
| trigger-lz-red | 25/25 | 15/15 | 10/18 runs, 4/6 cases |
| trigger-lz-refactor | 25/25 | 15/15 | 23/30 runs, 8/10 cases |

Every quiet and sibling-quiet grader passed in every baseline trigger run.

### Graders that cannot discriminate

These graders pass or fail the same way on both sides, or miss the behaviour they are meant to see, so they cannot
tell with and without apart in this run set. None was changed here.

- `red-line`, `green-line` and `refactor-line`: 0 in every run of every suite, on both sides and both models.
- `leaf-read`: 0 in every apply run. In the doing suites it is a with-side-only signal (Sonnet 0/5 to 3/5, Opus 0/3
  to 3/3).
- `edited-production` on apply-lz-refactor-gr4: the skill often declines the refactor (as in the recorded result
  at 877aef3), so the grader scores that behaviour as a failure; with 1/5 vs without 4/5 on Sonnet.
- `edited-test` on the srvx suites accepts only an Edit call on a file under `test/`. The prompt asks the model to
  add a test under `test/`, and a new test file is written with Write. In 9 of the 24 srvx runs the model's final
  message says it added a new test file; `edited-test` failed in 8 of them (5 in the without arm, read from the
  final messages, not checked against the traces). Opus scores 0/3 in every srvx cell. The Sonnet delta of +0.60 on
  apply-lz-red-srvx is therefore not a measure of the skill.
- `skill-fired` on the natural apply suites, Sonnet: apply-lz-tpp 0/5 and apply-lz-refactor 0/5 (Opus 3/3 in
  both); apply-lz-red and apply-lz-red-srvx 5/5.

The one discriminating row: doing-lz-tpp-invoke, Sonnet `edited-production` with 0/5 vs without 5/5. With the
skill invoked, the model recommends the next transformation and does not edit the code.

### Refused calls

From `permission_denials` in each run's CLI output. The allow lists were not widened (brief rule): redirects to a
file, commands piped into grep, head or tail, and `npx jest` stay refused.

| Arm | Suite | Model | Runs | Refused |
|---|---|---|---|---|
| head | apply-lz-red | Sonnet | 5 | 3 |
| head | apply-lz-red | Opus | 3 | 15 |
| head | apply-lz-red-invoke | Opus | 3 | 9 |
| head | apply-lz-tpp | Sonnet | 5 | 6 |
| head | apply-lz-tpp | Opus | 3 | 7 |
| head | apply-lz-tpp-invoke | Sonnet | 5 | 4 |
| head | apply-lz-tpp-invoke | Opus | 3 | 7 |
| head | apply-lz-refactor | Sonnet | 5 | 14 |
| head | apply-lz-refactor | Opus | 3 | 17 |
| head | apply-lz-refactor-invoke | Sonnet | 5 | 15 |
| head | apply-lz-refactor-invoke | Opus | 3 | 11 |
| head | trigger-lz-tpp | Sonnet | 50 | 3 |
| head | trigger-lz-refactor | Sonnet | 50 | 1 |
| no-plugin | apply-lz-red | Sonnet | 5 | 5 |
| no-plugin | apply-lz-red | Opus | 3 | 13 |
| no-plugin | apply-lz-tpp | Sonnet | 5 | 5 |
| no-plugin | apply-lz-tpp | Opus | 3 | 6 |
| no-plugin | apply-lz-refactor | Sonnet | 5 | 21 |
| no-plugin | apply-lz-refactor | Opus | 3 | 15 |
| srvx | apply-lz-red-srvx | Sonnet | 5 | 5 |
| srvx | apply-lz-red-srvx | Opus | 3 | 5 |
| srvx | apply-lz-red-srvx-invoke | Sonnet | 5 | 5 |
| srvx | apply-lz-red-srvx-invoke | Opus | 3 | 3 |
| srvx-no-plugin | apply-lz-red-srvx | Sonnet | 5 | 6 |
| srvx-no-plugin | apply-lz-red-srvx | Opus | 3 | 6 |

Runs counts sessions: a plugin-eval run has one per side, a slim run one. Every other arm, suite, side and model
cell (25 of 50) had none. Kinds: compound `cd ... &&` commands with pipes into grep, head or tail (most
apply-lz-red, apply-lz-red-srvx and apply-lz-tpp refusals); `npx jest` (the gr4 template's test runner, which the
suite does not allow); file edits through the shell (heredoc, `sed -i`, `python -`, `git show ... >`); `git stash`
around a test run (apply-lz-tpp); redirects to a file; `npx ts-node`. The trigger refusals are 3 Grep calls and
1 Read outside the run folder.

### Peer load

Runs that overlapped a window in which a peer session ran short CPU work (windows relayed by the orchestrator, UTC):
00:51:00-00:52:00 (routing-c1 Sonnet runs 1-2), 01:52:30-01:53:40 (doing-lz-red-08 Sonnet runs 1-4),
02:08:00-02:09:50 (apply-lz-red-r1 Sonnet runs 1-2), 03:34:00-03:36:00 (apply-lz-refactor-invoke-gr4 Opus runs 2-3).
Only apply-lz-red-r1 Sonnet run 1 stands out: 73 s against 27-35 s for the case's other runs. The harness never
replaces a finished result, so it stays, flagged here; its wall clock is the only figure the load can touch.
Costs and pass rates are unaffected. No window was relayed during the srvx cells.
