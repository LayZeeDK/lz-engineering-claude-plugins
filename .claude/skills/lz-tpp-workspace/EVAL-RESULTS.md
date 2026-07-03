# lz-tpp Skill Effectiveness Evals -- Results

Phase 5 (optional-final, NON-BLOCKING). Measures the shipped `lz-tpp` skill on two axes:
EVAL-01 (does the `description` trigger correctly?) and EVAL-02 (when triggered, does the coach
recommend the correct next transformation by priority?). Nothing here can regress the shipped skill;
it feeds at most a single gated D-07 description-tuning pass.

Model: claude-opus-4-8 (the session model users experience). Runs: 3 per query/scenario/config (D-05).

## EVAL-01 -- Trigger accuracy (native)

| Metric | Result | D-06 bar (~90%) |
|--------|--------|-----------------|
| Should-trigger RECALL (rate >= 0.5) | **13/13 = 100%** | PASS |
| Near-miss SPECIFICITY (rate < 0.5) | **14/14 = 100%** | PASS |

**Trigger accuracy is a clean PASS.** The shipped `description` fires on all 13 should-trigger
queries -- including the 9 jargon-free red-green-refactor situations (a failing
`expect(of(2)).toBe(1)` with trivial code, a Roman-numeral kata at `return`, etc.) -- and stays
quiet on all 14 near-misses.

> **CORRECTION (2026-07-03).** An earlier version of this file reported recall as **8% ("too
> narrow")**. That was a **measurement artifact, not a real result.** The trigger probe was run at
> `--num-workers 3`; concurrent `claude -p` probes under a tight rate window produced spurious
> non-triggers, collapsing recall to ~8%. Re-measured correctly -- **serial (`--num-workers 1`),
> Ponytail disabled (`PONYTAIL_DEFAULT_MODE=off`), MCP servers stripped from the probe -- recall is
> 100%** for BOTH the shipped description AND a widened variant (they tied), which is why the widened
> variant was NOT adopted (no benefit). Specificity 100% is corroborated by two independent runs
> (the num-workers-3 run and a 15.1-min real serial run). Raw: `trigger-results-d07-recall-old.json`
> (shipped desc, recall 13/13), `trigger-results-d07-spec.json` (spec 14/14). Harness fixes:
> commit `5f586da` (num-workers reliability + ~54% probe token cut). Details: `05-03-SUMMARY.md`.

## EVAL-02 -- Behavior / next-transformation (all 10 scenarios)

with_skill vs baseline, 3 runs each, 60 runs total. Free-drive with isolated scratch dirs
(ground-truth "drove?"); independent judge subagent per scenario; fail-closed grade -> judge ->
merge -> verify -> aggregate. (eval-2 is the earlier advise-only pilot; eval-0,1,3-9 free-drive.)

| Scenario | with_skill (full-pass, Pass@1) | baseline (full-pass, Pass@1) | Verdict |
|----------|-------------------------------|------------------------------|---------|
| eval-0 fib nothing-to-constant | 2/3, 0.67 | 0/3, 0.00 | discriminates |
| eval-1 fib split-base-case | 3/3, 1.00 | 1/3, 0.33 | discriminates |
| eval-2 fib prefer tail-recursion | 3/3, 1.00 | 0/3, 0.00 | discriminates (strong) |
| eval-3 sum deep-input stack-safe | 3/3, 1.00 | 2/3, 0.67 | discriminates (weak) |
| eval-4 flatten tree-no-tail | 3/3, 1.00 | 1/3, 0.33 | discriminates |
| eval-5 wordwrap impasse backtrack | 3/3, 1.00 | 3/3, 1.00 | saturated |
| eval-6 refactor-not-transformation | 3/3, 1.00 | 3/3, 1.00 | saturated |
| eval-7 wrong-proposal-correction | 3/3, 1.00 | 2/3, 0.67 | discriminates (weak) |
| eval-8 reference-mode ordering-hedges | 3/3, 1.00 | 3/3, 1.00 | saturated |
| eval-9 deviation-with-reason | 3/3, 1.00 | 0/3, 0.00 | discriminates (strong) |

**Overall (n=30/config):** with_skill **Pass@1 = 0.97, Pass@3 = 1.00** (29/30 full-pass) vs
baseline **Pass@1 = 0.50** (15/30). Aggregate mean pass_rate 98.9% vs 80.3%, delta +0.19.
**7/10 discriminate; 3 saturated (eval-5,6,8).** The single with_skill miss: one eval-0 run named
only `(nil -> constant)` not both `({} -> nil)` + `(nil -> constant)`.

**The skill lifts full-pass reliability from 50% (baseline) to 97% (Pass@1) / 100% (Pass@3),**
strongest on priority-reasoning: eval-2 (tail-recursion #9 over #11) and eval-9 (anti-dogma
deviation) both 100% vs 0%. Findings + full Pass@k/Pass^k:
`.planning/phases/05-skill-effectiveness-evals/05-02-SUMMARY.md`; viewer: `iteration-1/review.html`.

Notable: NO run drove (0/60) -- even baselines advised on these question-shaped prompts -- so the
"coach, don't drive" check is a passing safety net here, not a discriminator. The skill's measured
value is transformation *reasoning*, which the LLM judge is required to detect (e.g. eval-2 baseline
named `(statement -> tail-recursion)` only to reject it -- a false name-match the judge correctly
failed; eval-9 baseline treated the priority order as a hard rule while with_skill allowed the
reasoned deviation).

Two eval-set-quality caveats surfaced (feed a future eval iteration, not this result): eval-1's
ground-truth over-specifies a base-case split when `(constant->scalar)` alone suffices, and eval-9's
"allow the deviation" expectation is debatable (the stated reason is a forecast). Neither caused
false-fails; details in 05-02-SUMMARY.md.

## D-06 verdict

- **Behavior (EVAL-02): PASS.** Across all 10 scenarios the skill clearly improves
  next-transformation choice vs baseline (full-pass Pass@1 0.97 vs 0.50; 7/10 scenarios
  discriminate). The load-bearing core -- "recommend the correct next transformation by priority" --
  holds.
- **Trigger (EVAL-01): PASS.** Recall 100% (13/13) and specificity 100% (14/14), measured cleanly.
  The shipped description triggers on jargon-free red-test situations and stays quiet on near-misses.
  (The earlier "8% MISS" was a num-workers-3 measurement artifact -- see the EVAL-01 correction above.)

## D-07 tuning -- NOT NEEDED (resolved 2026-07-03)

D-07 was the gated allowance to widen the `description` for jargon-free trigger recall. It turned
out to be **unnecessary**: once EVAL-01 was measured cleanly, the shipped description already scores
**100% recall / 100% specificity**. A widened variant was drafted and tested serially -- it also
scored 100% recall (a tie, no benefit) -- so it was **reverted** and NOT shipped. The apparent need
for D-07 was an artifact of the num-workers-3 measurement bug, not the description. No skill change
ships from Phase 5; the shipped `lz-tpp` description stands as-is.

## Harness lessons (for future eval runs)

- **Run the trigger probe serially (`--num-workers 1`).** Concurrent `claude -p` probes throttle
  under a tight rate window and read as spurious non-triggers.
- **`PONYTAIL_DEFAULT_MODE=off`** for probe subprocesses (the SessionStart lazy-mode hook otherwise
  leaks into eval sessions).
- **Probe cost:** each `claude -p` loads the full environment (~68K input+cache tokens). `--strict-mcp-config`
  drops MCP servers (~3%); the bulk is user plugins. `--setting-sources project` drops user plugins
  while keeping the project ephemeral skill -> ~54% cut (~31K/probe). Do NOT use `--setting-sources ""`
  or `--bare` (they strip the ephemeral skill / auth -> broken probe). All in commit `5f586da`.
- **Specificity is throttle-robust; recall is not.** A throttled probe reads as a non-trigger, which
  for a negative looks like a (possibly false) pass -- so validate recall with self-evident triggering
  and corroborate specificity across independent runs.

## Reproduce / resume

- Trigger: `python -m scripts.run_eval --eval-set <ws>/evals/trigger-eval.json --skill-path <lztpp> --model claude-opus-4-8 --runs-per-query 3` from `tools/skill-creator-eval/`.
- Behavior status/resume: `node eval-status.mjs iteration-1 --evals <slugs>` (re-spawn only MISSING runs).
- Grade chain: `grade-run.mjs` -> judge -> `merge-judge.mjs --merge` -> `--verify` -> `aggregate_benchmark.py`.
