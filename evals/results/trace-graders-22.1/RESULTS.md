# Run set trace-graders-22.1

## Arm head

- Ref: 20061f7dfd52f7d50325c5a3485ad3f2f727d128
- claude-opus-5-5: 3 runs; models that ran (CLI output): claude-opus-5-5
- Cost (agent plus judge): $1.33
- Wall clock (summed): 210 s

| Suite | Side | Model | Grader | Passed |
|---|---|---|---|---|
| doing-lz-refactor | with | claude-opus-5-5 | edited-production | 3/3 |
| doing-lz-refactor | with | claude-opus-5-5 | leaf-read | 2/3 |
| doing-lz-refactor | with | claude-opus-5-5 | refactor-line | 0/3 |
| doing-lz-refactor | with | claude-opus-5-5 | skill-fired | 3/3 |
| doing-lz-refactor | with | claude-opus-5-5 | test-untouched-edit | 3/3 |
| doing-lz-refactor | with | claude-opus-5-5 | test-untouched-write | 3/3 |
| doing-lz-refactor | without | claude-opus-5-5 | edited-production | 3/3 |
| doing-lz-refactor | without | claude-opus-5-5 | refactor-line | 0/3 |
| doing-lz-refactor | without | claude-opus-5-5 | test-untouched-edit | 3/3 |
| doing-lz-refactor | without | claude-opus-5-5 | test-untouched-write | 3/3 |

## With and without

| Suite | Arm | Verdict |
|---|---|---|
| doing-lz-refactor | head | does not discriminate |

| Suite | Arm | Model | Grader | With | Without | Delta | With 95% | Without 95% | Overlap |
|---|---|---|---|---|---|---|---|---|---|
| doing-lz-refactor | head | claude-opus-5-5 | edited-production | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-refactor | head | claude-opus-5-5 | refactor-line | 0/3 | 0/3 | 0.00 | [0.000, 0.561] | [0.000, 0.561] | yes |
| doing-lz-refactor | head | claude-opus-5-5 | test-untouched-edit | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
| doing-lz-refactor | head | claude-opus-5-5 | test-untouched-write | 3/3 | 3/3 | 0.00 | [0.439, 1.000] | [0.439, 1.000] | yes |
