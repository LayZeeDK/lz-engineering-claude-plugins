---
phase: 5
slug: skill-effectiveness-evals
type: learnings
extracted: 2026-07-03
---

# Phase 5 Learnings -- Skill Effectiveness Evals

## Headline

**A measurement-harness bug masqueraded as a skill defect.** EVAL-01 first reported 8% trigger recall
("description too narrow, needs D-07 tuning"). It was a `--num-workers 3` concurrency artifact: parallel
`claude -p` probes under a tight rate window silently fail and read as non-triggers. Measured serially
the shipped description scores **100% recall / 100% specificity**. Lesson: before concluding a skill is
bad, prove the harness is sound. Discriminating-looking "failures" concentrated at a run's tail or under
concurrency are the tell.

## Decisions

- **D-07: no tuning applied.** Shipped `lz-tpp` description already passes both bars; a widened variant
  tied (100% recall) and was reverted. No change ships to `plugins/`.
- Grader = deterministic pre-filter (`grade-run.mjs`) + independent LLM-judge merge (`merge-judge.mjs`),
  fail-closed (verify gate errors on any unmerged run; aggregate never silently skips).
- Run trigger probes **serially** (`--num-workers 1`); behavior coaches as **unnamed fire-and-forget**
  subagents with **isolated scratch dirs**.

## Lessons (reusable)

1. **num-workers-3 corrupts trigger evals.** Concurrent probes throttle -> spurious non-triggers.
   Serial is reliable. Asymmetry: throttling only *deflates* recall (positives) but *inflates*
   specificity (a throttled negative looks quiet = false pass) -- validate recall by self-evident
   firing; corroborate specificity across independent runs.
2. **Probe token cost is dominated by PLUGINS, not MCP.** Each `claude -p` loads ~68K input+cache
   tokens (13 MCP + 152 slash-commands + 29 tools). `--strict-mcp-config` = only ~3%; `--setting-sources
   project` drops user plugins while keeping the project ephemeral skill -> ~54% cut (~31K/probe).
   `--setting-sources ""` and `--bare` strip the ephemeral skill/auth -> break the probe. Serial does
   NOT reduce total tokens (only concurrency).
3. **Ponytail (and any SessionStart hook) leaks into eval subagents.** Set `PONYTAIL_DEFAULT_MODE=off`
   for probe subprocesses; evidence of the leak was a `ponytail:` comment in a driving leftover.
4. **Named Agent = persistent teammate** (no returned result, no timing) -- spawn eval subagents
   UNNAMED/background. Ground-truth "did it drive?" = isolated scratch dir non-empty (no self-report).
5. **The LLM judge is load-bearing.** A deterministic name-match passes a response that NAMES a
   transformation only to REJECT it (eval-2 baseline); only the judge catches it. Include a fresh/unbiased
   reviewer -- a primed round missed a CRITICAL metrics-shape false-pass.
6. **Windows spawn gotcha:** `subprocess.Popen(["claude", ...])` fails `WinError 2` (no `claude.exe`;
   binary is `claude.CMD`) -- resolve via `shutil.which`, `shell=False`.
7. **Resumability asymmetry:** positives self-validate (a 3/3 proves health, so keep+resume works);
   negatives don't (throttled and genuine-quiet both read 0/3) -- need a health signal (canary or, better,
   per-probe throttle detection) to resume specificity.

## Surprises

- The whole "D-07 tuning" thread was ultimately unnecessary -- the skill was fine; the harness wasn't.
- Even baselines never drove (0/60) on question-shaped prompts -- so "coach, don't drive" is a passing
  safety net here, not the discriminator; the skill's value is transformation *reasoning*.
- Eval-set-quality issues found mid-run: eval-1 over-specifies a base-case split (`return n` alone
  suffices); eval-9's "allow the deviation" ground-truth is debatable (the reason is a forecast).

## Process / tooling debt

- Commit messages got a stray `@` from using PowerShell `@'...'@` here-strings in the Bash tool
  (CLAUDE.md warns against this) -- reworded + force-pushed. Use `git commit -F <file>` or single-line `-m`.
- Future harness enhancement: per-probe throttle detection (result-event success vs error) in `run_eval`
  would remove canary overhead and make every run resumable.
