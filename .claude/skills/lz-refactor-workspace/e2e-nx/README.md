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
node run-e2e.mjs --dry-run                          # print composed prompts + commands, spend nothing
node run-e2e.mjs --mode recommend --arm with_skill  # stage 1
node run-e2e.mjs --mode recommend --arm both        # stage 1 + baseline
node run-e2e.mjs --report                           # summarize captured runs
# apply stage (later), on a throwaway branch checkout only:
node run-e2e.mjs --mode apply --arm with_skill --cwd <nx-branch-checkout>
```

Env: `CLAUDE_BIN` overrides the CLI path; `E2E_MODEL` overrides the model (default `claude-opus-4-8`).

## Output layout

```
results/<mode>/<arm>/<pN>/
  answer.md               # final assistant text (tracked -- the evidence)
  meta.json               # arm/mode/model, exact prompt_used, skill_referenced, timing (tracked)
  outputs/
    transcript.stream.jsonl   # raw stream-json (gitignored: **/outputs/, *.stream.jsonl)
    stderr.log
```

Grading is manual/qualitative for now: read each `answer.md` against the matching target's
`expected_family` + `judgment` in `targets.json`, and (for `both`) compare with_skill vs no_skill.
