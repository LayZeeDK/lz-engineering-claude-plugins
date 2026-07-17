# skill-creator-eval (vendored dev tool)

Non-distributed development tool for Phase 5 (Skill Effectiveness Evals). It lives under
`.claude/` (project tooling) and is deliberately **NOT** under `plugins/` -- anything under
`plugins/lz-tdd/` ships with the `lz-tdd` plugin, and this eval harness must not be
distributed.

## Provenance and license

- `scripts/__init__.py`, `scripts/utils.py` -- verbatim from Anthropic's `skill-creator`
  plugin (Apache-2.0). See `LICENSE.upstream.txt`.
- `scripts/run_eval.py` -- upstream `skill-creator` base with the `run_single_query`
  function **reimplemented locally** to fix three trigger-probe bugs that make the upstream
  version unusable. Everything else in the file is unchanged upstream code.
- Upstream: https://github.com/anthropics/claude-plugins-official/tree/main/plugins/skill-creator
- Design source for the fix: `anthropics/claude-plugins-official#3041`. The three bugs:
  1. `select.select()` on a subprocess pipe is socket-only on Windows (raises
     `WinError 10038/10093`), silently scoring every query as a non-trigger -> replaced with
     a background reader thread + `queue.Queue` (cross-platform; runs natively on Windows,
     no WSL required).
  2. Detection quit at the first message boundary -> now spans the whole agentic turn; only
     the terminal `result` event counts as "did not trigger".
  3. Probed a `.claude/commands/` slash-command (which current Claude Code does not
     auto-trigger) -> now writes a real ephemeral `.claude/skills/<id>/SKILL.md` and matches
     the shared `<skill_name>-skill-` prefix (num_workers>1 spawns many same-description
     ephemeral skills).

The fix was **re-authored as reviewable first-party code** rather than applying the fork's
patch verbatim (the referenced fix lives on a third-party fork; re-authoring keeps every
line reviewed and stdlib-only).

## Usage (EVAL-01 trigger eval, native Windows)

Run from THIS directory (so `scripts` is an importable package):

```
python -m scripts.run_eval \
  --eval-set ../../evals/trigger-eval.json \
  --skill-path <repo>/plugins/lz-tdd/skills/lz-refactor \
  --model claude-opus-4-8 \
  --runs-per-query 3 \
  --num-workers 1 \
  --verbose
```

Notes:
- `--model claude-opus-4-8` matches the session model (what users experience).
- `--num-workers 1` (serial) is the LOCKED run config; concurrent probes throttle and read as
  spurious non-triggers. The authoritative run config is `EVAL-RESULTS.md` "Harness lessons".
- A3 / Pitfall 2: ensure NEITHER `lz-tpp` NOR `lz-refactor` is an enabled project skill in the
  directory where `claude -p` runs -- both siblings now ship in the same `lz-tdd` plugin, so
  either real skill can steal the trigger and cause false negatives.
- Optional `SKILL_EVAL_DEBUG=<path>` env var appends the raw stream-json for diagnosis.
- The probe writes/removes ephemeral skills under `<project_root>/.claude/skills/`; they are
  cleaned up in a `finally` block.
