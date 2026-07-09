# lz-refactor Skill Effectiveness Evals -- Results

Phase 11 (optional-final, NON-BLOCKING). Measures the shipped `lz-refactor` skill on two axes:
EVL-01 (does the `description` trigger correctly?) and EVL-02 (when triggered, does the coach
recommend the correct next NAMED refactoring, correct layer?). Nothing here can regress the shipped
skill; it feeds at most a single gated D-08 tuning pass.

Model: claude-opus-4-8 (the session model users experience). Runs: 3 per query/scenario/config (D-06).

> STATUS: template scaffold. All numbers below are BLANK and are filled ONLY after the gated eval
> RUN (D-10). This plan (11-01) builds infrastructure; nothing has been run.

## EVL-01 -- Trigger accuracy (native)

| Metric | Result | D-07 bar (~90%) |
|--------|--------|-----------------|
| Should-trigger RECALL (rate >= 0.5) | _TBD_ | _pending_ |
| Near-miss SPECIFICITY (rate < 0.5) | _TBD_ | _pending_ |

Highest-value negatives are the `lz-tpp` seam (green/transformation-step prompts) -- `lz-refactor`
MUST stay quiet on "which change makes this failing test pass" / "minimal transformation to green it".

## EVL-02 -- Behavior / next-refactoring

with_skill vs baseline, 3 runs each. Free-drive with isolated scratch dirs (ground-truth "drove?");
independent judge subagent per scenario; fail-closed grade -> judge -> merge -> verify -> aggregate.
One row per `evals/evals.json` scenario; filled at RUN time.

| Scenario | with_skill (full-pass, Pass@1) | baseline (full-pass, Pass@1) | Verdict |
|----------|-------------------------------|------------------------------|---------|
| _(per evals.json scenario)_ | _TBD_ | _TBD_ | _pending_ |

**Overall (n=_/config):** with_skill _Pass@1 / Pass@3 TBD_ vs baseline _Pass@1 TBD_. Pass@k / Pass^k
(k = 1, 3, 5, total) per eval and overall + saturated-assertion flags (Pass@1 = 1.0 for both configs)
filled at RUN time.

## D-07 verdict

- **Trigger (EVL-01):** _pending run_.
- **Behavior (EVL-02):** _pending run_.

## D-08 tuning

At most ONE bounded pass, and ONLY if a soft bar is missed (D-07/D-08). Description tuning ships to
`SKILL.md` frontmatter only if it beats the current one on a held-out trigger set; a coach-wording
tweak only if a scenario exposes a real routing defect. NO new reference files, NO re-authoring the
LOCKED catalog content. _Status: pending run._

## Harness lessons (authoritative run config)

- **Run the trigger probe serially (`--num-workers 1`).** Concurrent `claude -p` probes throttle
  under a tight rate window and read as spurious non-triggers (Phase 5 shipped a false ~8%-recall
  artifact from `--num-workers 3` before catching it).
- **`PONYTAIL_DEFAULT_MODE=off`** for probe subprocesses (the SessionStart lazy-mode hook otherwise
  leaks into eval sessions).
- **Probe cost / isolation:** each `claude -p` loads the full environment (~68K input+cache tokens).
  `--strict-mcp-config` drops MCP servers (~3%); the bulk is user plugins. `--setting-sources project`
  drops user plugins while keeping the project ephemeral skill -> ~54% cut. Do NOT use
  `--setting-sources ""` or `--bare` (they strip the ephemeral skill / auth -> broken probe).
- **Strip BOTH real sibling skills from the probe directory.** `lz-tpp` AND `lz-refactor` now ship in
  the same `lz-tdd` plugin; either enabled real skill can steal the trigger and cause false negatives.
  `--setting-sources project` drops the user-level plugins (both siblings) while keeping the ephemeral
  project skill under probe.
- **Specificity is throttle-robust; recall is not.** A throttled probe reads as a non-trigger, which
  for a negative looks like a (possibly false) pass -- so validate recall with self-evident triggering
  and corroborate specificity across independent runs (optionally via `run-spec-chunks.mjs` canary
  gating).

## Reproduce / resume

- **Trigger (EVL-01):** `python -m scripts.run_eval --eval-set ../../evals/trigger-eval.json
  --skill-path <repo>/plugins/lz-tdd/skills/lz-refactor --model claude-opus-4-8 --runs-per-query 3
  --num-workers 1` from `tools/skill-creator-eval/`, with `PONYTAIL_DEFAULT_MODE=off`,
  `--strict-mcp-config`, `--setting-sources project`. Optional throttle workaround:
  `node run-spec-chunks.mjs` (canary-gated specificity).
- **Behavior status/resume (EVL-02):** `node eval-status.mjs iteration-1 --evals <slugs>` (re-spawn
  only MISSING runs).
- **Grade chain:** `node grade-run.mjs` -> judge -> `node merge-judge.mjs --merge` ->
  `node merge-judge.mjs --verify <iteration-dir>` -> `python -m scripts.aggregate_benchmark
  iteration-1 --skill-name lz-refactor` -> `eval-viewer/generate_review.py`.
