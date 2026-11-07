# e2e-rgr-srvx: red-green-refactor outcome eval on srvx

## Purpose

A full red-green-refactor outcome eval: a slim `claude -p` session implements a real feature test-first in the
h3js/srvx repository, and the grader checks the produced code against the upstream commit's own tests. The three
tasks are srvx commits made after the model's training cutoff, so the session cannot recall the answer:

| Task | Commit | Change |
|---|---|---|
| T1 | 555a793 | `createError` option for the body-limit middleware |
| T2 | d946356 | cookie de-duplication on AWS Lambda |
| T3 | 5866bc7 | content-type text/binary detection |

## Arms

- **a**: the lz-tdd plugin, packaged from this repository, and no rules folder (`--rules none`).
- **b**: the same plugin plus the Test-first rule folder that `../slim-arms.sh` generates at run time. It copies the
  Test-first reference from the owner's lars-mode skill into the folder and writes a `CLAUDE.md` holding the
  Test-first rule. The reference is never committed; the runner prints its sha256 so each run log records which
  version ran.

`../slim-arms.sh` also packages `plugins/lz-tdd` with `git archive` at `LZ_TDD_REF` into
`D:/tmp/slim-claude-p/pkg/<ref>`, and reuses that package on later runs.

## How a task is built

`make-template.sh TASK COMMIT` rebuilds `D:/tmp/slim-claude-p/rgr-eval/TASK` from the local srvx clone:

- `template/`: the commit's parent, source only. Each run copies it and runs its own `pnpm install`.
- `hidden/`: the commit's own test files, the hidden suite.
- `after-src/`: the commit's source files, the reference solution.

Nothing from srvx is stored in this repository.

## Measured controls

- `control.sh TASK` runs the hidden suite on the parent and then on the commit's source. On the parent it fails
  5 of 33 tests for T1, 3 of 93 for T2 and 2 of 119 for T3; on the commit it passes in full.
- `selfcheck.sh TASK` shows that the grader separates the parent (hidden failures, no tests added) from the
  reference (all hidden tests green).
- A Haiku setup control (`prompts/control.md`) passed in both arms on 2026-11-07. The allowed commands ran, the
  denied ones (`grep`, `pnpm`) were refused, WebFetch was not available, and the Test-first rule reached the main session and a
  subagent in arm b only.

## Environment variables

| Variable | Default | Use |
|---|---|---|
| `SLIM_ROOT` | `D:/tmp/slim-claude-p` | Work root for templates, run folders, the package and the rules folder. Must be outside the home folder. |
| `LZ_TDD_REF` | `d02204d` | Commit of this repository whose `plugins/lz-tdd` gets packaged. |
| `SRVX_REPO` | `D:/projects/github/h3js/srvx` | Local srvx clone that `make-template.sh` reads. |
| `MODEL` | `opus` | Model for `run-rgr.sh`. |
| `PROMPT` | the task id | Prompt file name under `prompts/`, without `.md`. |

## How to run

```bash
bash make-template.sh T1 555a793
bash make-template.sh T2 d946356
bash make-template.sh T3 5866bc7
bash control.sh T3
bash selfcheck.sh T3
bash run-rgr.sh --dry-run T3 a 1 T3 b 1
MODEL=haiku PROMPT=control bash run-rgr.sh T1 a ctl T1 b ctl
node grade-rgr.mjs T1-a-1 T1-b-1
```

`run-rgr.sh` takes `<task> <arm> <k>` triples, runs one session at a time, and stops the queue at the first failed
session. `--dry-run` sets up each run folder and prints the arguments run-slim would pass, without starting a session.
Results go to `out/run-TASK-ARM-K.json`. These files hold local paths and prompts, so `out/` stays git-ignored.

The metered Opus run (3 tasks x 2 arms x k=3, one session at a time) is blocked until Lars gives the go-ahead.
