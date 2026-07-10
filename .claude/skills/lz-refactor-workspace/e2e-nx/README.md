# lz-refactor end-to-end test against nrwl/nx

Functional test of the `lz-refactor` skill on a real-world repo. Distinct from the trigger/recall
evals (`../evals/`, `../iteration-1/`), which force-inject an ephemeral skill to measure *routing*.
This suite drives real `claude -p` sessions against real nx code and observes whether lz-refactor
-- loaded naturally through `--plugin-dir` -- steers the model to the right NAMED refactoring for a
curated smell, and respects "coach, don't drive".

## What it exercises

- **Repo:** `D:/projects/github/nrwl/nx` @ `23.0.x`
- **Focus package:** `@nx/eslint-plugin` (pure TS rule/utility logic; recognizable, self-contained smells)
- **Targets:** see [`targets.json`](targets.json) -- 4 code targets (T1-T4) across mechanical (Fowler)
  and functional (FP) axes, plus a reference-mode probe (T5) and a seam/routing negative (T6).
- **Prompts:** [`prompts/`](prompts/) -- natural developer phrasing, real `file:line`, no skill jargon
  (the skill must recognize the smell itself). The runner prepends a mode-specific preamble; the exact
  composed prompt is recorded per run in `meta.json`.

## Arms and modes

| Arm | Command difference |
|-----|--------------------|
| `with_skill` | adds `--plugin-dir <repo>/plugins/lz-tdd` (lz-refactor auto-triggers by description) |
| `no_skill` | identical command WITHOUT `--plugin-dir` (baseline) |

The only difference between arms is the plugin. `--setting-sources project` drops the user's global
plugins; nx's own project settings load identically in both arms, so they do not bias the A/B.

| Mode | Behavior |
|------|----------|
| `recommend` | read-only; Edit/Write/Bash hard-blocked; the skill coaches, nothing is applied |
| `apply` | agent may Edit + run tsc/tests; MUST run in a throwaway nx branch checkout (`--cwd`), never 23.0.x |

## Staged plan (per the task owner)

1. **recommend-only, `with_skill`** first -- cheap, read-only, no risk. Grade the coaching quality.
2. Then decide whether to run **`apply` + typecheck + real tests** (`with_skill`) on a throwaway branch.
3. Then decide whether to run the **`no_skill`** baseline on the same prompts for comparison.

## Run

```bash
node run-e2e.mjs --dry-run                                  # print composed prompts + commands, spend nothing
node run-e2e.mjs --mode recommend --arm with_skill --runs 3 # recommend, with skill, k=3
node run-e2e.mjs --mode recommend --arm no_skill --runs 3   # baseline (no --plugin-dir)
node run-e2e.mjs --report                                   # summarize + Pass@k/Pass^k on skill-firing
```

Runs are pinned to `--effort high` (recorded in each `meta.json`); `--setting-sources project` drops
the user's global config, so the runs represent the defacto model+effort, not the maintainer's setup.
Per-run subdirs (`run-<k>/`) with an idempotent skip guard: re-invoking resumes and only runs missing
runs (use `--force` to re-run completed ones). Env: `CLAUDE_BIN`, `E2E_MODEL`, `E2E_EFFORT`,
`E2E_APPLY_BASE`, `E2E_APPLY_TIMEOUT_MS`.

### apply stage (p1-p4 only; p5/p6 auto-skipped)

apply edits real source, so it MUST run on a throwaway branch -- the runner `git reset --hard`s the
cwd to `E2E_APPLY_BASE` (default `origin/23.0.x`) before each run and refuses to run on a protected
branch (`23.0.x`/`main`/`master`):

```bash
cd <nx>; git checkout -b lz-refactor-e2e-apply         # throwaway branch
# one-time: trust the nx workspace so tool perms aren't ignored (either accept the trust dialog by
# running claude interactively in <nx> once, or set projects["<nx>"].hasTrustDialogAccepted: true
# in ~/.claude.json)
node run-e2e.mjs --mode apply --arm with_skill --cwd <nx> --runs 3
# cleanup: cd <nx>; git checkout 23.0.x; git branch -D lz-refactor-e2e-apply
```

Each apply run captures `diff.patch` + `changed_files` (in meta) after a pristine reset. The agent
also typechecks + runs the affected tests per the apply preamble (nx eslint-plugin uses Jest; heavy).

## Output layout

```
results/<mode>/<arm>/<pN>/run-<k>/
  answer.md               # final assistant text (tracked -- the evidence)
  meta.json               # arm/mode/model/effort, exact prompt_used, used_refactor/used_tpp,
                          #   changed_files (apply), timing (tracked)
  diff.patch              # apply mode only: what the agent changed (tracked)
  outputs/
    transcript.stream.jsonl   # raw stream-json (gitignored: **/outputs/, *.stream.jsonl)
    stderr.log
```

Grading is manual/qualitative: read each `answer.md` against the matching target's `expected_family`
+ `judgment` in `targets.json`; `--report` gives deterministic Pass@k/Pass^k on skill-firing. See
`E2E-RESULTS.md` for the stage-(a) findings and the with/without comparison.
