# Phase 5: Skill Effectiveness Evals - Research

**Researched:** 2026-07-02
**Domain:** Anthropic skill-creator eval tooling (trigger optimization + behavior benchmark), applied to the shipped lz-tpp skill
**Confidence:** HIGH (harness read verbatim off local disk; environment behaviors verified empirically on this machine)

<user_constraints>
## User Constraints (from 05-CONTEXT.md)

### Locked Decisions (D-01 .. D-08)
- **D-01 (trigger harness):** Use skill-creator's Description Optimization loop as the EVAL-01 harness: `python -m scripts.run_loop --eval-set <trigger-eval.json> --skill-path <lz-tpp> --model <session-model> --max-iterations 5 --verbose`, run from the installed skill-creator dir. 60/40 train/held-out split, 3 runs/query, `best_description` selected by HELD-OUT score. `run_eval.py` (one-shot, no improver) is the fallback / standalone measurement.
- **D-02 (trigger set):** Hand-author ~20 queries: 8-10 should-trigger (failing-test + "minimal change / which transformation", explicit TPP mentions, reference-mode asks like what does `(constant -> scalar)` mean) and 8-10 genuinely-tricky should-not-trigger near-misses (generic write-a-function, plain refactoring with no failing test, "write a test for this", "mock this dependency", "explain SOLID", "reduce complexity"). Queries must be concrete/detailed (paths, snippets, casual speech, typos). Use session model id `claude-opus-4-8`.
- **D-03 (behavior harness):** Use the test-case + benchmark harness: `evals/evals.json`, with-skill vs baseline (no-skill) subagent runs, per-eval assertions, grading via `agents/grader.md` (`grading.json` fields `text`/`passed`/`evidence`), and `python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name lz-tpp`. Each scenario = a red test + current code. Source scenarios PRIMARILY from the locked worked examples (Fibonacci walk, Kata 1 sum, Kata 2 flatten) plus a small number of net-new INCLUDING the Word Wrap impasse.
- **D-04-RUBRIC (ground truth):** "Correct next transformation" = the named highest-priority (lowest-numbered) AVAILABLE transformation the Phase-3 coach decision procedure should pick, per the canonical 14-item list, INCLUDING the TS/JS overlay (`(if -> while)` / `(variable -> assignment)` above the recursion transformations) where it changes the pick. Grade DETERMINISTICALLY first (string-match the named transformation; assert the coach did NOT edit code or run tests -- "coach, don't drive"); use an LLM-judge pass only for rationale quality. Deterministic assertions are scripted.
- **D-05 (sampling/metrics):** >= 3 runs per behavior scenario, 3 runs/query for trigger. Compute and report Pass@k and Pass^k (k = 1, 3, 5, total) per eval AND overall. Flag saturated/non-discriminating assertions (Pass@1 = 1.0 for both configs). WAIT for ALL run-completion notifications before grading -- `total_tokens`/`duration_ms` arrive only at completion; save to `timing.json` as each arrives.
- **D-06 (tunable bars, SOFT/non-blocking):** trigger held-out accuracy >= ~90% with near-misses quiet; behavior correct-transformation Pass@1 ~= 1.0 on deterministic-answer scenarios. Missing a bar triggers AT MOST the D-07 tuning pass; never reopens Phases 1-4. If already at bar, no tuning pass -- evals stand as a validation record.
- **D-07 (at most one tuning pass):** Apply run_loop's `best_description` to SKILL.md frontmatter ONLY if it beats current on the HELD-OUT set (show before/after + scores). Behavior: a bounded wording tweak to the coach procedure/description ONLY if a scenario exposes a real coaching defect. NO new reference files, NO re-authoring locked content (`transformations.md` + worked examples stay frozen), NO scope expansion. No self-feeding re-eval loops beyond `--max-iterations 5`.
- **D-08 (artifact location + hygiene):** Eval sets, the skill-creator workspace (iteration run dirs), and an EVAL results summary live UNDER `.planning/phases/05-skill-effectiveness-evals/` (git-tracked, PR-filtered out of the shipped skill), NOT under `plugins/lz-tdd/skills/lz-tpp/`. Commit the eval sets + a concise results summary + benchmark.json/.md; keep bulky iteration transcripts / raw outputs out of the shipped surface (scratchpad or gitignored). Any D-07 tuning pass is the only write into `plugins/`.

### Claude's Discretion
- Exact query wording and scenario count (>= skill-creator minimums; edge-case-focused).
- Exact assertion text and which are scripted vs judged (deterministic first).
- Exact workspace dir naming/layout under the phase dir; parallel vs series behavior runs (series is fine if timeouts bite).
- Whether EVAL-01/EVAL-02 are one plan or two (roadmap sketches one plan, 05-01).
- Whether to also run `run_eval.py` as a standalone pre/post measurement around any tuning.

### Deferred Ideas (OUT OF SCOPE)
- Additional worked examples / languages, a cheat-sheet reference -> post-0.0.1 (NEXT-01, NEXT-04). Word Wrap may be REFERENCED as an impasse test but this phase does NOT author a new full worked-example file.
- Empty `AGENTS.md` hygiene defect -- separate quick task, not this phase.
- Turning eval sets into a permanent CI/regression gate -> future; this phase is a one-time validation + at-most-one tuning pass.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| EVAL-01 | A skill-creator trigger-eval set validates the `description` fires on in-scope prompts and stays quiet on out-of-scope prompts | Harness = `run_loop.py`/`run_eval.py` (schema, split, sampling, `best_description` documented below). Candidate 20-query set provided. WINDOWS BLOCKER + WSL mitigation documented (verified). |
| EVAL-02 | A skill-creator behavior/effectiveness eval checks the coach recommends correct next transformations on sample scenarios | Harness = `evals/evals.json` + orchestrator-spawned with_skill/baseline subagents + `grader.md` + `aggregate_benchmark.py` + `generate_review.py`. 7 ready-to-use scenarios with expected NAMED transformations + deterministic assertions provided. Not affected by the Windows blocker. |
</phase_requirements>

## Summary

This phase authors eval DATA and runs the Anthropic skill-creator harness against the already-shipped lz-tpp skill. Two mechanisms, distinct code paths:

1. **EVAL-01 (trigger):** `scripts/run_loop.py` synthesizes a throwaway command file carrying the skill's `description`, runs `claude -p <query> --model claude-opus-4-8 --output-format stream-json`, and detects whether Claude invoked the `Skill`/`Read` tool for it. It splits the set 60/40 (stratified by `should_trigger`), runs each query 3x, and -- if the current description misses -- calls Claude to propose improvements, re-scoring on both train and held-out for up to 5 iterations. It returns JSON with `best_description` chosen by HELD-OUT score. This is the ONE component with a hard environment blocker on this machine (below).

2. **EVAL-02 (behavior):** The orchestrator spawns two subagents per scenario in the same turn (one with the skill path, one baseline no-skill), each executing a red-test-plus-code prompt. You grade each run against `expectations` (prefer scripted string-match on the named transformation + a "coach, don't drive" check), write `grading.json` (fields `text`/`passed`/`evidence`), aggregate with `aggregate_benchmark.py`, and render `generate_review.py --static` for headless review. No `claude -p` subprocess is involved, so the Windows blocker does not apply.

**Primary recommendation:** Author both eval sets under the phase dir; run EVAL-01's `run_loop.py` UNDER WSL2 Ubuntu (native Windows Python cannot `select()` on a subprocess pipe -- verified WinError 10093 on Python 3.13 and 3.14, which silently makes every query register as non-triggering); run EVAL-02 natively via orchestrator subagents; grade deterministically; report Pass@k/Pass^k; apply `best_description` only if it beats the held-out baseline.

## Architectural Responsibility Map

The "tiers" here are the two eval mechanisms plus the orchestrator that drives EVAL-02.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Measure whether the `description` triggers (EVAL-01) | `run_loop.py`/`run_eval.py` (python + `claude -p` subprocess) | -- | It is the only component that programmatically probes triggering via `available_skills`. Must run under WSL2 on this machine. |
| Propose an improved `description` (D-07 candidate) | `run_loop.py` -> `improve_description.py` (calls `claude`) | -- | The loop produces the measurement AND the tuning candidate in one run; `best_description` picked by held-out score. |
| Run coach on a red-test scenario, with vs without skill (EVAL-02) | GSD orchestrator (Task subagents) | -- | skill-creator's behavior harness expects the CALLER to spawn subagents in-session; no python driver exists for this path. |
| Grade assertions -> `grading.json` | Scripted string-match (deterministic) | `agents/grader.md` subagent (rationale quality only) | D-04: deterministic first; LLM-judge only where a string match is insufficient. |
| Aggregate runs -> `benchmark.json`/`.md` | `scripts/aggregate_benchmark.py` (pure stdlib) | -- | Reads `grading.json` under `eval-*/<config>/run-*/`; computes mean/stddev/delta. |
| Headless human review | `eval-viewer/generate_review.py --static <out.html>` | -- | No display on the box; `--static` writes a standalone HTML instead of serving. |

## Standard Stack

Nothing is installed. The entire harness ships inside the installed `skill-creator` plugin; the only runtime dependencies are Python (stdlib only) and the `claude` CLI, both already present.

### Core
| Component | Version | Purpose | Why Standard |
|-----------|---------|---------|--------------|
| skill-creator harness scripts | on disk (Jul 2026 install) | run_loop / run_eval / aggregate_benchmark / generate_review + grader/analyzer agents + schemas | D-01/D-03 lock this exact harness; it is the first-party Anthropic eval tooling. |
| Python | 3.13.6 (`python`), 3.14.3 (`python3`) native; 3.12.3 in WSL2 | runs the scripts | Verified present. Scripts use stdlib only. |
| `claude` CLI | 2.1.198 (native and via WSL /mnt/c interop) | `claude -p` triggering probe (EVAL-01) | Verified present. `run_eval.py` shells out to it. |

**Absolute paths (constants for the planner):**

- `SKILL_CREATOR_DIR` (native): `C:/Users/LarsGyrupBrinkNielse/.claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/skills/skill-creator`
- `SKILL_CREATOR_DIR` (WSL): `/mnt/c/Users/LarsGyrupBrinkNielse/.claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/skills/skill-creator`
- `LZTPP` (native): `D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/plugins/lz-tdd/skills/lz-tpp`
- `LZTPP` (WSL): `/mnt/d/projects/github/LayZeeDK/lz-engineering-claude-plugins/plugins/lz-tdd/skills/lz-tpp`
- `PHASE_DIR` (native): `D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/.planning/phases/05-skill-effectiveness-evals`
- `PHASE_DIR` (WSL): `/mnt/d/projects/github/LayZeeDK/lz-engineering-claude-plugins/.planning/phases/05-skill-effectiveness-evals`

`scripts/` is a Python package (`__init__.py` present); every script MUST be invoked as `python -m scripts.<name>` with the working directory set to `SKILL_CREATOR_DIR` (run_loop imports `from scripts.generate_report import ...` etc.).

**Installation:** None. `[VERIFIED: local disk]` -- all scripts read directly from the installed plugin.

## Package Legitimacy Audit

Not applicable. This phase installs no external packages -- the harness ships with skill-creator and uses only the Python standard library and the already-installed `claude` CLI. No npm/PyPI/crates install occurs, so there is no slopcheck surface. `[VERIFIED: local disk read of scripts + `ls`]`

## Architecture Patterns

### System data flow

```
EVAL-01 (trigger)                                     [RUN UNDER WSL2 -- see pitfall 1]
  trigger-eval.json ([{query, should_trigger}, ...])
        |
        v
  run_loop.py  --(60/40 stratified split, seed 42)--> train_set + held-out test_set
        |
        |  for each query x 3 runs (ProcessPoolExecutor):
        |    write .claude/commands/<name>-skill-<uuid>.md  (frontmatter = the description)
        |    claude -p <query> --model claude-opus-4-8 --output-format stream-json --include-partial-messages
        |    detect Skill/Read tool_use referencing <uuid>  -> triggered? true/false
        v
  trigger_rate per query; pass = (should_trigger ? rate>=0.5 : rate<0.5)
        |
        |  if any train query fails and iteration<5:
        |    improve_description.py (calls claude) -> new description -> re-evaluate
        v
  JSON to stdout + results.json: { best_description (by HELD-OUT score), best_test_score,
                                   best_train_score, history[], ... }
        |
        v
  D-07: if best_description beats current on held-out -> apply to LZTPP/SKILL.md frontmatter

EVAL-02 (behavior)                                    [RUN NATIVELY -- orchestrator Task subagents]
  evals/evals.json (prompts = red test + code; expectations[])
        |
        v
  orchestrator spawns, same turn, per scenario:
     with_skill subagent  (skill path = LZTPP)   -> outputs/ + transcript
     without_skill subagent (no skill, baseline) -> outputs/ + transcript
        |            (capture total_tokens/duration_ms from each completion -> timing.json)
        v
  grade each run -> grading.json {expectations:[{text,passed,evidence}], summary, ...}
        |            (prefer a scripted deterministic string-match; grader.md subagent for rationale only)
        v
  aggregate_benchmark.py <workspace>/iteration-N --skill-name lz-tpp -> benchmark.json + benchmark.md
        |
        v
  generate_review.py <workspace>/iteration-N --skill-name lz-tpp --benchmark .../benchmark.json --static out.html
        |
        v
  Pass@k / Pass^k per eval + overall; results summary
```

### Workspace layout (behavior eval) -- the exact layout the scripts require

`aggregate_benchmark.py` globs `eval-*` directories and, inside each config dir, globs `run-*` subdirs each containing `grading.json`. `generate_review.py` recursively finds any dir containing an `outputs/` subdir. To satisfy BOTH:

```
PHASE_DIR/lz-tpp-workspace/            # D-08: under the phase dir, NOT under plugins/
  iteration-1/
    eval-0-fib-nothing-to-constant/    # MUST start with "eval-" (aggregate globs eval-*)
      eval_metadata.json               # {eval_id, eval_name, prompt, assertions[]}
      with_skill/
        run-1/
          outputs/                     # what the coach produced (transcript / recommendation)
            transcript.md              # include a "## Eval Prompt" section so the viewer shows the prompt
          grading.json                 # {expectations:[{text,passed,evidence}], summary{...}}
          timing.json                  # {total_tokens, duration_ms, total_duration_seconds}
        run-2/ ...
        run-3/ ...
      without_skill/
        run-1/ { outputs/, grading.json, timing.json }
        run-2/ ...
        run-3/ ...
    benchmark.json                     # from aggregate_benchmark.py
    benchmark.md
    review.html                        # from generate_review.py --static
```

Naming note: use `eval-<N>-<slug>` (e.g. `eval-2-fib-prefer-tail-recursion`). `aggregate_benchmark.py` derives `eval_id` from `eval_metadata.json` first, else from `int(dirname.split("-")[1])` -- so the `eval-<N>-...` prefix keeps both paths happy. `configuration` MUST be exactly `with_skill` / `without_skill` (the viewer color-codes on that literal).

### Trigger workspace layout

`run_loop.py --results-dir <dir>` creates a timestamped subdir and writes `results.json` (+ `report.html` only when `--report` != none). Point `--results-dir` at `PHASE_DIR/trigger-workspace/`.

### Anti-patterns to avoid
- **Do NOT write custom HTML for review.** Use `generate_review.py` (`--static` on this headless box). The skill-creator SKILL.md is emphatic about this.
- **Do NOT put `pass_rate` at the top level of a benchmark run** -- it must be nested under `result`, and the config key must be `configuration` not `config`, or the viewer shows zeros.
- **Do NOT grade before all runs finish.** `total_tokens`/`duration_ms` are only in the completion notification and are unrecoverable later (D-05 / CLAUDE.md).
- **Do NOT run a self-feeding re-eval loop** beyond `--max-iterations 5` (D-07).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Detecting whether a description triggers | A custom prompt-and-scan script | `run_eval.py`/`run_loop.py` | It already handles the synthetic-command trick, stream-event early detection, 3x sampling, and stratified split. |
| Improving the description | Hand-editing and re-guessing | `run_loop.py` improver + held-out selection | Guards against overfitting; produces before/after scores for D-07. |
| Aggregating run stats | A bespoke mean/stddev script | `aggregate_benchmark.py` | Produces the exact `benchmark.json` the viewer expects. |
| Human review UI | Custom HTML | `generate_review.py --static` | Standalone HTML, no server, embeds outputs + benchmark. |
| Ground-truth transformations | Inventing expected answers | The locked references (fibonacci-worked-example.md, typescript-and-tco.md, transformations.md) | Ground truth is already proven test-by-test; lift it, do not re-derive. |

**Key insight:** This phase authors eval DATA (query set, scenarios, assertions) and a results summary. The infrastructure is fully shipped; building any of it is wasted work and a divergence risk.

## Common Pitfalls

### Pitfall 1: run_loop.py / run_eval.py do NOT work on native Windows Python (EVAL-01 blocker)
**What goes wrong:** `run_eval.py` calls `select.select([process.stdout], [], [], 1.0)` on a subprocess pipe. On native Windows Python this raises `OSError [WinError 10093]` (WSAStartup) because `select` only accepts sockets on Windows. The exception is caught per-query and recorded as `False`, so EVERY query registers as "did not trigger": should-trigger queries all fail, should-not-trigger all "pass", yielding a meaningless ~50% score with all trigger counts = 0.
**Why it happens:** POSIX `select` on arbitrary fds is not portable to Windows.
**How to avoid:** Run EVAL-01 under WSL2 Ubuntu. VERIFIED on this machine: `select`-on-pipe succeeds under WSL (`WSL_SELECT_OK True`); `claude` resolves in WSL to `/mnt/c/Users/LarsGyrupBrinkNielse/.local/bin/claude` (2.1.198) via /mnt/c interop; python3 is 3.12.3. Use `/mnt/d/...` and `/mnt/c/...` paths, cwd = `SKILL_CREATOR_DIR` (WSL form).
**Warning signs:** run_loop `--verbose` shows `rate=0/3` for every query including obvious should-trigger ones; the improver keeps "improving" a description that is not the problem.
**Verification hedge:** The WSL `claude` is the Windows binary bridged via interop. Before the full loop, run a 2-query smoke test with `run_eval.py --runs-per-query 1 --verbose` and confirm at least one obvious should-trigger query reports `rate=1/1`. If the interop pipe does not stream `stream-json` correctly, fall back to installing/using a Linux-native `claude` in WSL, or (last resort) a one-line local patch that swaps the `select` call for a blocking `readline` on Windows -- but patching installed plugin code is discouraged (D-08 scope) and should be a documented, reverted-after workaround, not a commit.

### Pitfall 2: An installed/enabled lz-tpp could steal the trigger (false negative)
**What goes wrong:** `run_eval.py` detects triggering by matching the SYNTHETIC command's uuid name in the `Skill`/`Read` tool input. If the real lz-tpp plugin is installed AND enabled in the environment where `claude -p` runs, Claude may invoke the real skill instead of the synthetic command; the detector sees a non-matching tool_use and returns `False` -> false negative on should-trigger queries.
**Why it happens:** The probe measures the description via a stand-in command, but a real competing skill with the same description can win the routing.
**How to avoid:** Verified today that `lz-tdd`/`lz-tpp` do NOT appear in `~/.claude/plugins/config.json` or `~/.claude/settings.json` (not an enabled plugin), so this is currently safe. Keep it that way for the run, or run from a cwd/profile where lz-tdd is not enabled. Sanity-check with `--verbose`: obvious should-trigger queries should read `rate=3/3`.

### Pitfall 3: aggregate vs viewer directory-shape mismatch
**What goes wrong:** The skill-creator SKILL.md prose shows `with_skill/outputs/` (single run), but `aggregate_benchmark.py` requires `with_skill/run-*/grading.json`. Using the prose layout with >= 3 runs yields an empty benchmark.
**How to avoid:** Use the `eval-<N>-slug/<config>/run-<K>/{outputs/,grading.json,timing.json}` layout shown above. Confirmed against the script's globbing (`eval_dir.glob("eval-*")`, `config_dir.glob("run-*")`).

### Pitfall 4: grading.json field names are load-bearing
**What goes wrong:** Using `name`/`met`/`details` instead of `text`/`passed`/`evidence` makes the viewer and aggregate warn/blank. `aggregate_benchmark.py` explicitly warns if an expectation lacks `text`/`passed`.
**How to avoid:** Emit exactly `{"text":..., "passed":..., "evidence":...}` per expectation and a `summary{passed,failed,total,pass_rate}`.

### Pitfall 5: headless environment quirks
**What goes wrong:** `generate_review.py` (no `--static`) starts a server and calls `webbrowser.open` -- useless on a headless box; its `_kill_port` shells `lsof` which is ABSENT on native Windows (prints a note, non-fatal). `run_loop.py` also calls `webbrowser.open` unless `--report none`.
**How to avoid:** For the viewer, always pass `--static PHASE_DIR/lz-tpp-workspace/iteration-N/review.html`. For run_loop, pass `--report none` (headless) and read `results.json` / captured stdout.

### Pitfall 6: timing capture is one-shot
**What goes wrong:** `total_tokens`/`duration_ms` come only in the subagent completion notification; grading before all complete loses them; they are not persisted anywhere else.
**How to avoid:** Spawn all runs, wait for EVERY completion, write each `timing.json` as its notification arrives, THEN grade (D-05).

## Code Examples

### EVAL-01 trigger-eval set schema (JSON array, distinct from evals.json)
`run_eval.py`/`run_loop.py` read a plain array of `{query, should_trigger}`:
```json
[
  {"query": "the user prompt text", "should_trigger": true},
  {"query": "another prompt", "should_trigger": false}
]
```

### EVAL-01 run commands (UNDER WSL2, cwd = SKILL_CREATOR_DIR WSL form)
Smoke test first (confirms the WSL+claude interop pipe streams):
```bash
# cwd: /mnt/c/Users/LarsGyrupBrinkNielse/.claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/skills/skill-creator
python3 -m scripts.run_eval \
  --eval-set /mnt/d/projects/github/LayZeeDK/lz-engineering-claude-plugins/.planning/phases/05-skill-effectiveness-evals/evals/trigger-smoke.json \
  --skill-path /mnt/d/projects/github/LayZeeDK/lz-engineering-claude-plugins/plugins/lz-tdd/skills/lz-tpp \
  --model claude-opus-4-8 \
  --runs-per-query 1 \
  --verbose
```
Full optimization loop (D-01):
```bash
# cwd: SKILL_CREATOR_DIR (WSL form)
python3 -m scripts.run_loop \
  --eval-set /mnt/d/.../05-skill-effectiveness-evals/evals/trigger-eval.json \
  --skill-path /mnt/d/.../plugins/lz-tdd/skills/lz-tpp \
  --model claude-opus-4-8 \
  --max-iterations 5 \
  --runs-per-query 3 \
  --holdout 0.4 \
  --report none \
  --results-dir /mnt/d/.../05-skill-effectiveness-evals/trigger-workspace \
  --verbose \
  > /mnt/d/.../05-skill-effectiveness-evals/trigger-workspace/run_loop_stdout.json \
  2> /mnt/d/.../05-skill-effectiveness-evals/trigger-workspace/run_loop_stderr.log
```
Output shape (stdout AND `results.json`), fields the planner cares about:
```json
{
  "exit_reason": "all_passed (iteration N) | max_iterations (5)",
  "original_description": "...",
  "best_description": "... apply this to SKILL.md ONLY if it beats current on held-out ...",
  "best_score": "held-out passed/total",
  "best_train_score": "train passed/total",
  "best_test_score": "held-out passed/total",
  "final_description": "...",
  "iterations_run": N,
  "holdout": 0.4, "train_size": T, "test_size": H,
  "history": [ { "iteration": 1, "description": "...",
                 "train_passed": .., "test_passed": ..,
                 "train_results": [ {"query","should_trigger","trigger_rate","triggers","runs","pass"} ],
                 "test_results": [ ... ] }, ... ]
}
```
D-07 application rule: iteration 1 evaluates the CURRENT description, so `best_description` may equal `original_description` (no change needed). Apply only when `best_test_score` for `best_description` strictly beats iteration-1's held-out score.

### EVAL-01 candidate 20-query trigger set (ready to use; discretion on final wording, D-02)
```json
[
  {"query": "i've got a red test `expect(of(2)).toBe(1)` and right now `of` just does `return n <= 1 ? n : 1;`. whats the smallest change to green it? trying to stay disciplined about tpp here", "should_trigger": true},
  {"query": "failing test: sum(3) should be 6. current code is `function sum(n){ if(n===0) return 0; return 0; }`. which transformation comes next by priority - i don't want to jump straight to recursion if theres a simpler move", "should_trigger": true},
  {"query": "walk me through the next transformation for this. test asserts fib(3)===2, the impl returns 1 for every n>1. transformation priority premise style pls", "should_trigger": true},
  {"query": "my flatten() passes for [1,[2,3]] but the new test flatten(deeplyNested).length===200001 blows the stack. what's the minimal transformation to make it pass - tail recursion or a while loop?", "should_trigger": true},
  {"query": "in TDD what's the highest-priority transformation available when I only have `return 0` and a new test wants a different constant for n=1", "should_trigger": true},
  {"query": "what does the transformation `(constant -> scalar)` actually mean and when would I reach for it", "should_trigger": true},
  {"query": "why is `({} -> nil)` first on the transformation priority list? explain the ordering rationale", "should_trigger": true},
  {"query": "i'm at green on fib and the next test forces recursion. should I prefer (statement -> tail-recursion) or (if -> while) in typescript, and why does the language matter", "should_trigger": true},
  {"query": "explain the transformation priority premise and the list of transformations in order", "should_trigger": true},
  {"query": "red: `expect(wrap('word wrap', 8)).toEqual(['word','wrap'])`. the only way I see to pass is writing the whole algorithm. is there a more disciplined next step per TPP or am I stuck", "should_trigger": true},

  {"query": "write a jest test for this `formatCurrency(cents)` helper covering negative values and zero", "should_trigger": false},
  {"query": "refactor this 80-line `processOrder` function to be cleaner - extract some helpers, all tests already pass", "should_trigger": false},
  {"query": "can you explain the SOLID principles with a short typescript example for each", "should_trigger": false},
  {"query": "how do I mock the `fetch` call in this test so it doesn't hit the network? using vitest", "should_trigger": false},
  {"query": "this function has a cyclomatic complexity of 14 per eslint. help me reduce it", "should_trigger": false},
  {"query": "write a fibonacci function in typescript that memoizes results", "should_trigger": false},
  {"query": "my test `expect(parseDate('2026-02-30')).toBeNull()` is failing and I can't figure out why - help me debug it", "should_trigger": false},
  {"query": "rename the variable `d` to `dueDate` everywhere in src/scheduler.ts and its tests", "should_trigger": false},
  {"query": "add pagination support to the GET /users endpoint in this express app", "should_trigger": false},
  {"query": "what's the time and space complexity of this recursive merge sort implementation", "should_trigger": false}
]
```
Rationale: near-misses share the skill's keywords (test, refactor, fibonacci, complexity, TDD, recursion) but need something other than choosing the next transformation during a red-green step -- exactly the "genuinely tricky" negatives skill-creator asks for. All queries are substantive/multi-step (simple one-step queries may not trigger any skill regardless of description).

### EVAL-02 evals.json schema (verbatim field names)
```json
{
  "skill_name": "lz-tpp",
  "evals": [
    {
      "id": 0,
      "prompt": "User's task prompt (red test + current code)",
      "expected_output": "Human-readable description of success",
      "files": [],
      "expectations": [
        "The recommendation names the transformation (statement -> tail-recursion)",
        "The coach does not edit code or run tests"
      ]
    }
  ]
}
```

### EVAL-02 eval_metadata.json (per eval dir; verbatim field names)
```json
{
  "eval_id": 0,
  "eval_name": "fib-prefer-tail-recursion",
  "prompt": "The user's task prompt",
  "assertions": [
    "The recommendation names (statement -> tail-recursion) as the pick",
    "It explicitly does NOT recommend plain (statement -> recursion) #11 as the next move",
    "No source file is edited and no test is executed (coach, don't drive)"
  ]
}
```

### EVAL-02 grading.json (verbatim required fields -- the viewer and aggregate depend on these)
```json
{
  "expectations": [
    {"text": "The recommendation names (statement -> tail-recursion)", "passed": true, "evidence": "Output line: 'Apply (statement -> tail-recursion) #9 with an accumulator helper'"},
    {"text": "No source file is edited and no test is executed", "passed": true, "evidence": "metrics.json shows Edit=0, Write=0; no Bash test invocation in transcript"}
  ],
  "summary": {"passed": 2, "failed": 0, "total": 2, "pass_rate": 1.0}
}
```

### EVAL-02 aggregate + viewer commands (native Windows OK; cwd = SKILL_CREATOR_DIR native form)
```bash
# cwd: C:/Users/LarsGyrupBrinkNielse/.claude/plugins/marketplaces/claude-plugins-official/plugins/skill-creator/skills/skill-creator
python -m scripts.aggregate_benchmark \
  D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/.planning/phases/05-skill-effectiveness-evals/lz-tpp-workspace/iteration-1 \
  --skill-name lz-tpp

python eval-viewer/generate_review.py \
  D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/.planning/phases/05-skill-effectiveness-evals/lz-tpp-workspace/iteration-1 \
  --skill-name lz-tpp \
  --benchmark D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/.planning/phases/05-skill-effectiveness-evals/lz-tpp-workspace/iteration-1/benchmark.json \
  --static D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/.planning/phases/05-skill-effectiveness-evals/lz-tpp-workspace/iteration-1/review.html
```

### Behavior scenarios with expected NAMED transformations (D-03 / D-04 ground truth, ready to use)
Sourced from the locked references. Priority-number convention: LOWER number = HIGHER priority. Every scenario also carries the cross-cutting "coach, don't drive" assertion (no Edit/Write to the provided code, no test execution).

| # | eval_name | Red test + current code | Expected NAMED transformation(s) | Discriminating assertion(s) | Source |
|---|-----------|-------------------------|----------------------------------|-----------------------------|--------|
| 0 | fib-nothing-to-constant | No code yet; red `of(0)===0` | `({} -> nil)` #1 then `(nil -> constant)` #2; present `return 0` | Names both #1 and #2; presents `return 0`, not a full algorithm | fibonacci-worked-example Step 1 |
| 1 | fib-split-base-case | `return 0`; red `of(1)===1` | `(unconditional -> if)` #6 + `(constant -> scalar)` #4 (return `n` in base branch) | Names #6 and #4; does NOT jump to recursion | Step 2 |
| 2 | fib-prefer-tail-recursion | returns 1 for n>1; red `of(3)===2` | `(statement -> tail-recursion)` #9 (accumulator helper) | Names #9; explicitly REJECTS plain `(statement -> recursion)` #11 as the pick and explains higher-priority + no-reliable-TCO risk | Steps 3-4 |
| 3 | sum-deep-input-stacksafe | Kata 1; base case done; red `sum(1_000_000)===500000500000` (deep-input test pins stack safety) | TS/JS overlay: `(if -> while)` #10 + `(variable -> assignment)` #13 (or a trampoline named as the stack-safe form) | States that the deep-input test makes stack safety BEHAVIORAL; names #10+#13 (or trampoline); does NOT offer a plain V8 tail-recursive form as the final answer | typescript-and-tco Kata 1 |
| 4 | flatten-tree-no-tail | Kata 2; naive tree recursion green shallow; red on deeply nested input | Explicit-stack `(if -> while)` #10 iteration (or generator-as-state-machine) | States `(statement -> tail-recursion)` #9 is NOT AVAILABLE (no tail form for tree recursion); names explicit-stack while-loop / generator | typescript-and-tco Kata 2 |
| 5 | wordwrap-impasse-backtrack | Word Wrap: current hard red test only passable by low-priority `(expression -> function)` #12 (write the whole algorithm) | BACKTRACK: pose a simpler test passable by a higher-priority transformation (optionally skip the hard test); check for a structure-only refactoring first | Recommendation includes the backtrack/simpler-test move; does NOT immediately apply `(expression -> function)` #12 | fibonacci-worked-example Word Wrap section + SKILL.md step 6 |
| 6 | refactor-not-transformation | All tests GREEN; request "extract a helper / clean this up" | NONE -- classify as a REFACTORING (structure-only, behavior-preserving, not priority-ranked) | Identifies it as a refactoring, declines to name a numbered transformation; does not priority-rank | SKILL.md step 1 + transformations.md |

Scenario 6 doubles as a behavior-level near-miss (it must NOT force a transformation). Scenarios 2, 3, 4, 5 are the discriminating core: they separate a coach that merely "writes code" (baseline) from one that reasons by priority, applies the TS/JS overlay, recognizes shape constraints, and backtracks at an impasse.

### Pass@k / Pass^k (restated from CLAUDE.md; the reporting contract)
Let n = runs for the eval, c = runs that FULLY pass (all that eval's assertions passed; for behavior that is `grading.summary.pass_rate == 1.0`; for trigger, a run "passes" when it triggered-as-expected).
- **Pass@k (optimistic, at least 1 of k passes):** `1 - C(n-c, k) / C(n, k)`
- **Pass^k (conservative, all k pass):** `C(c, k) / C(n, k)`
Report per-eval (that eval's n) AND overall (sum of runs across evals). Use k = 1, 3, 5, total run count; cap k at n (k>n is undefined -- skip). Skip trivial rows where both configs are 1.0. Flag any eval with Pass@1 = 1.0 for BOTH with_skill and without_skill as saturated/non-discriminating (candidate for a harder prompt). Runs per D-05: >= 3 per behavior scenario per config; 3 per trigger query.

## State of the Art

| Old Approach | Current Approach | When | Impact |
|--------------|------------------|------|--------|
| `/skill-test` or ad-hoc manual triggering checks | skill-creator `run_loop.py` synthetic-command probe with stream-event early detection + held-out selection | current install | Deterministic, sampled, overfitting-guarded description tuning. skill-creator SKILL.md explicitly says do NOT use `/skill-test`. |
| Single-run "does it work" spot checks | >= 3-run benchmarks with Pass@k/Pass^k and analyst pass for non-discriminating assertions | current | Reliability + variance visibility; matches the project's CLAUDE.md skill-creator discipline. |

**Deprecated/outdated:** none relevant; the harness on disk is current (installed 2026-07-02).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | The WSL `claude` (Windows binary via /mnt/c interop) streams `--output-format stream-json` correctly through the pipe run_eval reads | Pitfall 1 / EVAL-01 commands | If interop mangles the stream, trigger detection fails; mitigated by the mandated smoke test before the full loop. |
| A2 | `--model claude-opus-4-8` is the correct, currently-valid id for the session model and is accepted by `claude -p --model` | EVAL-01 | If the id is stale/invalid, `claude -p` errors and every query records False; verify with the smoke test (a should-trigger query must read rate=1/1). |
| A3 | The lz-tpp plugin stays NOT-enabled in the environment where `claude -p` runs during EVAL-01 | Pitfall 2 | If it becomes enabled, the real skill can steal the trigger -> false negatives. Re-verify config.json/settings.json at run time. |
| A4 | The Word Wrap impasse scenario (5) can be posed with a compact code snippet WITHOUT authoring a new full worked-example reference file | Behavior scenarios | Authoring a new reference would violate D-07/deferred scope; keep the scenario inline in evals.json only. |

## Open Questions (RESOLVED)

All three are (D discretion) planning choices, resolved during planning. The substantive technical unknowns (A1 WSL interop streaming, A2 model-id validity) live in the Assumptions Log and are gated by the [BLOCKING] smoke test, not left open here.
- RESOLVED (Q1): 4 plans -- 05-01 (author eval data + grader), 05-02 (behavior/native), 05-03 (trigger/WSL2, smoke-gated), 05-04 (combine + gated D-07 tuning). The WSL-vs-native split + blocking gates warranted the split over a single 05-01.
- RESOLVED (Q2): parallel with a series/batch fallback if spawn limits bite; wait-for-all-notifications before grading.
- RESOLVED (Q3): yes -- a one-shot run_eval.py before/after is offered inside 05-04's D-07 apply.

1. **One plan or two?** (D discretion) Given the WSL/native split (EVAL-01 must run under WSL; EVAL-02 native), splitting into 05-01 (behavior, native) and 05-02 (trigger, WSL) may reduce environment friction, but the roadmap sketches a single 05-01. Recommendation: keep one plan with clearly separated EVAL-01 (WSL) and EVAL-02 (native) task groups, since they share the results summary and the D-07 gate.
2. **Behavior runs parallel vs series?** (D discretion) Start parallel (all subagents same turn per SKILL.md); fall back to series only if timeouts bite. With 7 scenarios x 2 configs x 3 runs = 42 subagent runs, series is slow -- prefer parallel batches, but respect the wait-for-all-notifications rule before grading.
3. **Standalone pre/post `run_eval.py` measurement around a D-07 tuning apply?** (D discretion) Recommendation: yes if a tuning is applied -- a one-shot `run_eval.py` on the held-out queries before and after the SKILL.md edit gives a clean regression datapoint without re-running the whole loop.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Python (native) | EVAL-02 aggregate/viewer | Yes | 3.13.6 / 3.14.3 | -- |
| Python (WSL2) | EVAL-01 run_loop/run_eval | Yes | 3.12.3 | -- |
| `claude` CLI | EVAL-01 triggering probe | Yes (native + WSL via /mnt/c) | 2.1.198 | -- |
| `select()` on subprocess pipe (native Win) | EVAL-01 (run_eval streaming) | NO | -- | WSL2 (verified working) |
| WSL2 Ubuntu | EVAL-01 fallback host | Yes | Ubuntu | -- |
| `lsof` (native Win) | viewer `_kill_port` (server mode only) | NO | -- | Use `--static` (no server) -- non-fatal note only |
| display / browser | viewer server mode; run_loop report | NO (headless) | -- | `generate_review.py --static`; `run_loop --report none` |
| skill-creator harness scripts | both evals | Yes | on-disk 2026-07-02 | -- |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** native-Windows `select` (-> WSL2); `lsof`/browser (-> `--static`, non-blocking).

## Validation Architecture

The "test framework" here is the skill-creator eval harness itself; the phase's own deliverables ARE the tests that prove EVAL-01/EVAL-02.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | skill-creator harness: `run_loop.py` (trigger) + `evals.json`/`aggregate_benchmark.py`/`generate_review.py` (behavior) + `grader.md` |
| Config file | none -- eval DATA authored this phase under `PHASE_DIR/evals/` and `PHASE_DIR/lz-tpp-workspace/` (see Wave 0) |
| Quick run command (trigger, WSL) | `python3 -m scripts.run_eval --eval-set <trigger-eval.json> --skill-path <LZTPP> --model claude-opus-4-8 --runs-per-query 1 --verbose` |
| Full suite command (trigger, WSL) | `python3 -m scripts.run_loop ... --runs-per-query 3 --holdout 0.4 --max-iterations 5 --report none --results-dir <trigger-workspace>` |
| Full suite command (behavior, native) | orchestrator spawns with_skill+baseline subagents x >=3 runs, then `python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name lz-tpp` |

### Phase Requirements -> Test Map
| Req ID | Behavior to prove | Test type | Automated command / mechanism | Exists? |
|--------|-------------------|-----------|-------------------------------|---------|
| EVAL-01 | `description` triggers on TDD/TPP/transformation-priority prompts; stays quiet on near-misses | trigger eval (3x/query, held-out) | `run_loop.py` -> held-out accuracy + per-query rate | Wave 0 (author trigger-eval.json) |
| EVAL-02 | Coach names the correct highest-priority AVAILABLE transformation per scenario (incl. TS/JS overlay); backtracks at impasse; classifies refactorings; does not edit code / run tests | behavior benchmark (>=3 runs, with vs baseline) | subagents -> `grading.json` (scripted string-match) -> `aggregate_benchmark.py` -> Pass@k/Pass^k | Wave 0 (author evals.json + assertions + workspace) |

### Sampling Rate
- **Per trigger query:** 3 runs (loop default), pass = rate vs 0.5 threshold.
- **Per behavior scenario per config:** >= 3 runs (D-05).
- **Reliability metric:** Pass@k / Pass^k (k=1,3,5,total; cap k at n) per eval and overall.
- **Gate:** D-06 soft bars (trigger held-out >= ~90%; behavior correct-transformation Pass@1 ~= 1.0). Missing a bar -> at most the D-07 tuning pass; never reopens Phases 1-4.

### Wave 0 Gaps (author before running)
- [ ] `PHASE_DIR/evals/trigger-eval.json` -- the ~20-query set (candidate above) -- covers EVAL-01
- [ ] `PHASE_DIR/evals/trigger-smoke.json` -- 2-query subset for the WSL interop smoke test
- [ ] `PHASE_DIR/evals/evals.json` -- 7 behavior scenarios with `expectations[]` -- covers EVAL-02
- [ ] `PHASE_DIR/lz-tpp-workspace/iteration-1/eval-<N>-<slug>/eval_metadata.json` per scenario
- [ ] A scripted deterministic grader (string-match named transformation + no-Edit/Write/test-run check) writing `grading.json` per run
- [ ] `PHASE_DIR/EVAL-RESULTS.md` (or similar) -- concise results summary + Pass@k/Pass^k tables (committed per D-08)
- [ ] Framework install: none needed (harness + Python + claude all present)

## Security Domain

This is an offline eval/validation phase: no untrusted network input, no authn/z, no sessions, no cryptography, no user-data handling. Most ASVS categories do not apply.

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | -- |
| V3 Session Management | no | -- |
| V4 Access Control | no | -- |
| V5 Input Validation | minor | Eval-set JSON is hand-authored, not user-supplied; still validate it parses before feeding the harness. |
| V6 Cryptography | no | -- |

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| `run_eval.py` writes throwaway command files under `.claude/commands/` and shells `claude -p` | Tampering/EoP | These are generated by the first-party harness from your own description; run only against the authored eval set. The script deletes each synthetic command file after use. |
| Public-repo hygiene (D-08) | Information disclosure | Keep bulky raw transcripts out of the shipped surface; commit only eval sets + summary + benchmark; verify no work-email string leaks into committed eval artifacts (repo convention / MEMORY allowlist). |

## Sources

### Primary (HIGH confidence -- read verbatim off local disk)
- `skill-creator/SKILL.md` -- Description Optimization (run_loop, 60/40 split, 3x sampling, best_description by held-out) and Running-and-evaluating-test-cases (subagent pattern, timing capture, grading, aggregate, viewer, `--static`).
- `skill-creator/references/schemas.md` -- evals.json, grading.json, benchmark.json, timing.json, eval_metadata (via SKILL.md) exact field names.
- `skill-creator/scripts/run_loop.py`, `run_eval.py`, `aggregate_benchmark.py` -- CLI flags, split logic, trigger detection, output shape, directory globbing.
- `skill-creator/eval-viewer/generate_review.py` -- `--static`, `--benchmark`, `--previous-workspace`, run discovery.
- `skill-creator/agents/grader.md`, `analyzer.md` -- assertion grading + non-discriminating-assertion analysis.
- lz-tpp `SKILL.md`, `references/transformations.md`, `fibonacci-worked-example.md`, `typescript-and-tco.md` -- skill under test + behavior ground truth.
- `.planning/` CONTEXT/REQUIREMENTS/ROADMAP/config.json.

### Verified this session (empirical, on this machine)
- `select.select` on a subprocess pipe: FAILS on native Windows Python 3.13.6 and 3.14.3 (`OSError WinError 10093`); SUCCEEDS under WSL2 Ubuntu.
- `claude` in WSL2 -> `/mnt/c/.../claude` 2.1.198; python3 3.12.3.
- `lz-tdd`/`lz-tpp` absent from `~/.claude/plugins/config.json` and `~/.claude/settings.json` (not an enabled plugin).
- `lsof` absent on native Windows; `scripts/` is a Python package requiring `python -m` from `SKILL_CREATOR_DIR`.

## Metadata

**Confidence breakdown:**
- Standard stack / harness mechanics: HIGH -- scripts read verbatim, field names quoted.
- EVAL-01 Windows blocker + WSL mitigation: HIGH -- reproduced empirically.
- Behavior ground truth / scenarios: HIGH -- lifted from locked, proven references.
- WSL+claude interop streaming (A1) / model-id validity (A2): MEDIUM -- gated behind a mandated smoke test before the full loop.

**Research date:** 2026-07-02
**Valid until:** ~2026-08-01 for the harness (stable local install); the Windows `select` behavior and WSL fallback are structural and long-lived.

## RESEARCH COMPLETE
