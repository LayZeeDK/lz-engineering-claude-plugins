# Run set repro-22.1

## Recorded cells

| Record | Recorded k/n [95% Wilson] | Reproduced k/m | Verdict |
|---|---|---|---|
| tpp-recall | 13/13 [0.772, 1.000] | 10/13 | outside |

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
