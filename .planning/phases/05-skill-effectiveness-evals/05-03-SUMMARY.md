---
phase: 05-skill-effectiveness-evals
plan: 03
type: execute
status: complete
requirements: [EVAL-01]
result: CORRECTED 2026-07-03 -- recall 100% (13/13), specificity 100% (14/14) measured cleanly = EVAL-01 PASS. The earlier "8%" was a num-workers-3 measurement artifact; D-07 tuning not needed.
---

# 05-03 SUMMARY -- EVAL-01 (trigger accuracy), native run

## Outcome (CORRECTED 2026-07-03)

> **The original conclusion in this file ("8% recall, description too narrow") was WRONG -- a
> measurement artifact.** The trigger probe was run at `--num-workers 3`; concurrent `claude -p`
> probes under a tight rate window silently failed and read as non-triggers, collapsing recall to
> ~8%. Re-measured cleanly -- **serial (`--num-workers 1`), `PONYTAIL_DEFAULT_MODE=off`, MCP servers
> stripped** -- the shipped `description` scores **100% recall / 100% specificity = PASS**. A widened
> variant was drafted + tested and also hit 100% recall (a tie), so it was **reverted, not shipped**.
> No skill change comes out of Phase 5.

| Metric | Corrected result (clean) | D-06 bar (~90%) | Original (artifact) |
|--------|--------------------------|-----------------|---------------------|
| Should-trigger RECALL (rate >= 0.5) | **13/13 = 100%** | PASS | 1/13 = 8% (num-workers-3 artifact) |
| Near-miss SPECIFICITY (rate < 0.5) | **14/14 = 100%** | PASS | 14/14 = 100% (corroborated) |

Evidence: recall 13/13 for the shipped description in `trigger-results-d07-recall-old.json` (serial)
and equally 13/13 for a widened variant in `trigger-results-d07-recall-new.json` + `-retry3.json`;
specificity 14/14 in two independent runs (`trigger-results.json` num-workers-3 and
`trigger-results-d07-spec.json` serial, 15.1-min real). Harness fixes in commit `5f586da`.

Non-blocking: EVAL-01 is optional-final; it does NOT reopen Phases 1-4 (the public ship).
The per-query table + analysis BELOW reflect the ORIGINAL num-workers-3 artifact run and are
retained only for provenance -- they do not reflect the corrected 100%/100% result.

## Smoke gate + A3 (Task 1)

- **A3 re-verified clean** at run time (Pitfall 2 -- no enabled skill can steal the trigger):
  - `~/.claude/plugins/installed_plugins.json` (the current enablement store; `config.json` is legacy) has NO `lz-tpp`/`lz-tdd`.
  - The repo has NO `.claude/settings.json` / `settings.local.json`.
  - `.claude/skills/` contains only `lz-tpp-workspace` with NO `SKILL.md` at any skill root -> `lz-tpp` is not a project skill.
- **Smoke (`trigger-smoke.json`, runs-per-query 1): PASSED 2/2** -- should-trigger `explain the transformation priority premise...` read 1/1; near-miss `refactor this 80-line processOrder...` read 0/1.

## Harness fix required to run at all (WinError 2)

The first smoke attempt failed with `[WinError 2] file not found` on every query (silent
false zeros). Root cause: the vendored `run_eval` spawned `subprocess.Popen(["claude", ...])`
with a bare name; native Windows `CreateProcess` appends `.exe` and the installed binary is
`claude.CMD` (there is no `claude.exe`). Fixed (`51b4398`) by resolving via
`shutil.which("claude")` (returns `claude.CMD` on Windows, the shim on POSIX) with
`shell=False` (queries contain backticks/quotes). The import-only preflight could not catch
this -- it never spawned `claude`.

## Run trustworthiness (verified against the usage-limit concern)

The full run finished, then a usage limit was hit + reset. Verified the run itself was NOT
corrupted by throttling (a throttled `claude -p` reads as a silent non-trigger, so exit-0 alone
is insufficient):

- **Duration 7.4 min (443s) for 81 sessions (~16s/3-wide wave).** A usage-limit rejection
  returns in 1-3s; 81 throttled sessions would finish in ~1-2 min. Mass-throttling is
  arithmetically excluded.
- Exit code 0; ZERO error/limit/throttle/overloaded/429 strings in the log; all 27 queries
  reported with denominator `/3` (81 sessions accounted for); 0 "query failed" exceptions.
- Completion notification arrived BEFORE the "usage limit reset" message (limit hit after, not during).
- Results correlate with query SEMANTICS (jargon-heavy #8 fired 3/3 matching a near-verbatim
  description phrase; smoke #11 read 1/1, full-run #11 read 1/3 -- consistent borderline
  flakiness), which throttling cannot fake.
- Caveat: `SKILL_EVAL_DEBUG` was not set, so per-session raw streams were not captured. The
  above is strong circumstantial proof; a targeted debug re-run of the borderline positives
  would give per-session certainty.

## Per-query results (27 queries x 3 runs, model claude-opus-4-8)

Convention: `rate = triggers/runs`; POS should trigger (want >=0.5), neg should stay quiet (want <0.5).

| # | rate | kind | verdict | query (truncated) |
|---|------|------|---------|-------------------|
| 0 | 0/3 | POS | MISS | red test `expect(of(2)).toBe(1)`, my `of` is `return n <= 1 ? n : 1;`. whats the smallest... |
| 1 | 0/3 | POS | MISS | ok fib(3) should be 2 but my code just returns 1 for anything above 1. don't want to write... |
| 2 | 0/3 | POS | MISS | only thing my code does right now is `return 0` and now theres a test wanting 1 when n is... |
| 3 | 0/3 | POS | MISS | here's my failing test `expect(romanNumeral(4)).toBe('IV')` and my code just returns 'I'. |
| 4 | 0/3 | POS | MISS | pytest: `assert to_roman(1) == 'I'` is red and the function body is just `pass`. simplest... |
| 5 | 0/3 | POS | MISS | here's my whole test file - `describe('stack', () => { it('starts empty', ...` |
| 6 | 0/3 | POS | MISS | my flatten() passes for [1,[2,3]] but the new test on a deeply nested input blows the stack... |
| 7 | 0/3 | POS | MISS | is there that uncle bob rule about always taking the simplest code change to pass a failing... |
| 8 | 3/3 | POS | HIT | what does the transformation `(constant -> scalar)` actually mean and when would I reach for... |
| 9 | 0/3 | POS | MISS | why is `({} -> nil)` first on the transformation priority list? explain the ordering rationale |
| 10 | 0/3 | POS | MISS | i'm at green on fib and the next test forces recursion. should I prefer (statement -> tail... |
| 11 | 1/3 | POS | MISS | explain the transformation priority premise and the list of transformations in order |
| 12 | 0/3 | POS | MISS | stuck: red test `expect(wrap('word wrap', 8)).toEqual(['word','wrap'])` and my code's empty... |
| 13 | 0/3 | neg | OK | write a jest test for this `formatCurrency(cents)` helper covering negative values and zero... |
| 14 | 0/3 | neg | OK | refactor this 80-line `processOrder` function to be cleaner - extract some helpers... |
| 15 | 0/3 | neg | OK | can you explain the SOLID principles with a short typescript example for each |
| 16 | 0/3 | neg | OK | how do I mock the `fetch` call in this test so it doesn't hit the network? using vitest |
| 17 | 0/3 | neg | OK | this function has a cyclomatic complexity of 14 per eslint. help me reduce it |
| 18 | 0/3 | neg | OK | write a fibonacci function in typescript that memoizes results |
| 19 | 0/3 | neg | OK | my test `expect(parseDate('2026-02-30')).toBeNull()` is failing and I can't figure out why |
| 20 | 0/3 | neg | OK | rename the variable `d` to `dueDate` everywhere in src/scheduler.ts and its tests |
| 21 | 0/3 | neg | OK | add pagination support to the GET /users endpoint in this express app |
| 22 | 0/3 | neg | OK | what's the time and space complexity of this recursive merge sort implementation |
| 23 | 0/3 | neg | OK | transform this array of user objects into a map keyed by id - cleanest way in typescript? |
| 24 | 0/3 | neg | OK | implement a priority queue backed by a binary heap in typescript |
| 25 | 0/3 | neg | OK | whats the simplest way to implement a debounce helper in typescript? |
| 26 | 0/3 | neg | OK | my CSV transformation step throws on empty rows and one test is failing - help me find the... |

## Analysis -- why recall is 8%

The two positives with any signal (#8 3/3, #11 1/3) are the ones that name TPP concepts
explicitly and match near-verbatim phrases in the `description`. The 9 jargon-free positives
(#0-7, #12: a failing test + trivial code, no TPP vocabulary) never fire -- Claude answers
them as generic coding help. The description's "coach when a failing test and the current code
are present and the question is which minimal change makes the failing test pass" clause is not
strong enough to win routing against a plain-help interpretation. Reference-style #9/#10 (which
DO use jargon but lead with ordering-rationale / a `(statement -> tail-recursion)` preference
question) also miss -- the description leans on the exact transform-name-lookup phrasing.

Specificity is perfect precisely because the description is so narrow.

## Implication for 05-04 (D-06 verdict + D-07 tuning)

- **D-06 verdict:** the description MISSES the ~90% recall bar badly (8%) while nailing
  specificity (100%). This is the classic "too narrow" tuning target.
- **D-07 (05-04, gated, at most one pass):** widen the `description` to fire on jargon-free
  red-green-refactor situations (a failing test + current code + "what's the smallest change")
  WITHOUT sacrificing the 100% specificity (must still stay quiet on plain refactor / write-a-
  function / test-authoring / complexity questions #13-26). Re-measure after any edit; only
  write into `plugins/lz-tdd/skills/lz-tpp/SKILL.md`.

## Artifacts

- `.claude/skills/lz-tpp-workspace/trigger-results.json` -- full per-query results + summary.
- Harness fix: `.claude/skills/lz-tpp-workspace/tools/skill-creator-eval/scripts/run_eval.py` (`51b4398`).
