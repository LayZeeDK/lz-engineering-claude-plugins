---
phase: 11-skill-effectiveness-evals
plan: 02
subsystem: testing
tags: [skill-eval, trigger-probe, EVL-01, trigger-eval, check-evals, lz-refactor, lz-tpp-seam]

# Dependency graph
requires:
  - phase: 11-skill-effectiveness-evals
    provides: the vendored eval rig (run_eval.py + eval-status + merge-judge + EVAL-RESULTS template) from plan 11-01 that the trigger set runs on
  - phase: 06-lz-refactor-skill-scaffold-progressive-disclosure
    provides: the shipped lz-refactor SKILL.md description (in/out-of-scope clauses) that is the EVL-01 ground truth
provides:
  - evals/trigger-eval.json - the EVL-01 recall+specificity probe input (10 should-trigger + 10 near-miss, incl. 3 lz-tpp-seam green-step negatives)
  - check-evals.mjs - a fail-closed build-time lint (schema + >= 8/>= 8 split + >= 2 seam negatives + ASCII-only) over the trigger set
affects: [11-03, 11-04, skill-effectiveness-evals]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Trigger set authored from the shipped description in/out-of-scope clauses; lz-tpp green-step queries FLIP to should_trigger:false as the highest-value negatives (D-02)"
    - "Build-time schema/count/seam/ASCII lint gates the eval DATA without running it (D-10 halt honored)"

key-files:
  created:
    - .claude/skills/lz-refactor-workspace/evals/trigger-eval.json
    - .claude/skills/lz-refactor-workspace/check-evals.mjs
  modified: []

key-decisions:
  - "10 + 10 trigger set authored from the RESEARCH T1-T10 / N1-N10 candidates; every query concrete (code snippets, casual register), ASCII-only, no rename-variable near-miss (Rename Variable is a real Fowler refactoring -> legit trigger)"
  - "3 lz-tpp-seam green-step negatives (smallest edit / minimal transformation to green it / makes this failing test pass) exceed the >= 2 requirement - the seam is the phase's headline specificity risk"
  - "check-evals.mjs is a local lint (Node stdlib, single file), NOT a claude -p run; fail-closed on malformed / short-split / missing-seam / non-ASCII input (D-10, T-11-04)"

patterns-established:
  - "Fail-closed build-time lint pattern: fail(msg)+process.exit(1) on any violation; verified against short-split, no-seam, and non-ASCII probe inputs"

requirements-completed: []

# Metrics
duration: ~8min
completed: 2026-07-10
---

# Phase 11 Plan 02: Author EVL-01 trigger set + build-time lint Summary

**Authored the EVL-01 trigger eval set (10 should-trigger refactor-step / smell / catalog-lookup / de-patterning queries + 10 near-miss negatives including 3 lz-tpp-seam green-step probes) grounded in the shipped lz-refactor description, plus check-evals.mjs -- a fail-closed build-time schema/count/seam/ASCII lint that runs GREEN over the set. Data + lint only; nothing was run (D-10 halt).**

## Performance

- **Duration:** ~8 min
- **Completed:** 2026-07-10
- **Tasks:** 2
- **Files created:** 2

## Accomplishments

- Authored `evals/trigger-eval.json` as a flat array of `{query, should_trigger}`: 10 `should_trigger:true` (Long Function, Duplicated Code, Feature Envy, Long Parameter List, Conditional Complexity, Extract Function + Replace Conditional with Polymorphism catalog lookups, refactor-away-from-Singleton de-patterning, the rule-of-three principle, Combinatorial Explosion) and 10 `should_trigger:false` near-misses. The negatives include the 3 highest-value lz-tpp-seam green-step probes plus behavior-change "refactor for speed", write-a-test, write-a-function, feature work, explain-SOLID, debug, and complexity-analysis.
- The seam negatives are the phase's headline specificity risk (both siblings ship in one plugin): "smallest edit to get it passing", "minimal transformation to green it", "which change makes this failing test pass" - all green-step prompts lz-refactor MUST stay quiet on, drawn straight from the shipped description's "Do not use it for the green / transformation step of TDD ... is lz-tpp" clause.
- Authored `check-evals.mjs` (Node ESM, no new deps): asserts (1) array of `{query:string, should_trigger:boolean}`; (2) `>= 8` true AND `>= 8` false; (3) `>= 2` false entries match a case-insensitive seam regex (failing test / make .* pass / minimal transformation / go green / green it / smallest edit|step); (4) every query is ASCII-only (no byte `> 0x7F`). Exits 0 with an OK line on success; non-zero with a clear message on any violation.
- Lint runs GREEN over the authored set: `20 queries (10 trigger / 10 near-miss; 3 lz-tpp-seam negatives), ASCII-clean`. Fail-closed behavior verified against three bad inputs (short 2-entry split, valid split with 0 seam negatives, valid split with a non-ASCII byte) - each exits 1 with the right message.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author evals/trigger-eval.json (10 trigger + 10 near-miss)** - `f23c7f8` (test)
2. **Task 2: Author check-evals.mjs schema/count/seam/ASCII lint; run GREEN** - `ed7eba7` (test)

**Plan metadata:** committed with this SUMMARY + STATE.md + ROADMAP.md.

## Files Created/Modified

- `.claude/skills/lz-refactor-workspace/evals/trigger-eval.json` - EVL-01 trigger set (10 + 10; 3 lz-tpp-seam negatives)
- `.claude/skills/lz-refactor-workspace/check-evals.mjs` - fail-closed build-time lint over the trigger set

## Decisions Made

- **Trigger wording finalized from RESEARCH candidates:** the T1-T10 / N1-N10 tables already mapped each query to its in-scope facet / why-quiet rationale; I lifted them, kept every query concrete (snippets + casual speech), and stayed ASCII-only. No rename-variable near-miss (Rename Variable is a shipped Fowler refactoring, so it would be a legit trigger, not a clean negative).
- **3 seam negatives, not just the required 2:** the lz-tpp <-> lz-refactor seam is the single lz-refactor-specific delta from Phase 5, so I gave it extra coverage (matching failing-test-to-green, minimal-transformation, and makes-failing-test-pass phrasings) to make the specificity signal robust.
- **Lint is a local build-time gate, not an eval RUN:** check-evals.mjs reads local JSON and asserts shape only. It does not invoke `claude -p` (D-10). This is the Wave-0 schema check the RESEARCH Test Map calls for.

## Requirements Status (IMPORTANT caveat)

`requirements-completed` is deliberately **empty**. The plan frontmatter lists `[EVL-01]`, but this plan authors the trigger DATA + a build-time shape lint only - it does NOT measure trigger recall/specificity (that needs the gated `run_eval` probe, D-10). EVL-01's measured outcome closes only AFTER the user-approved run. Marking it complete here would create false traceability, consistent with the 11-01 posture. It remains OPEN and closes at the phase gate after the run.

## Deviations from Plan

None - plan executed exactly as written. (Mechanical adaptation, not a deviation: the `gsd-sdk` state handlers took named flags `--phase/--plan/--duration/--tasks/--files` and `--summary` where positional args are rejected on the installed CLI, same as 11-01. `state.update-progress` reported "Progress field not found in STATE.md" - non-fatal; the frontmatter `progress:` block tracks phase-level completion and is unchanged mid-phase.)

## Threat Surface

Per the plan `<threat_model>`: T-11-03 (info disclosure in committed eval prose) mitigated by the ASCII-only + email allowlist-inversion scans (both clean on both files); T-11-04 (tampering via malformed lint input) mitigated by check-evals.mjs failing closed on every malformed / short / non-ASCII input (verified by 3 probes) with no dynamic eval of file contents; T-11-SC (installs) not applicable - no packages installed, Node stdlib only. No new threat surface introduced.

## Self-Check: PASSED

- Files verified present (2/2): `evals/trigger-eval.json`, `check-evals.mjs`.
- Commits verified in git log: `f23c7f8`, `ed7eba7`.
- Gates: `python -m json.tool` valid; `node check-evals.mjs` GREEN (10/10, 3 seam negatives, ASCII-clean); fail-closed verified on short-split / no-seam / non-ASCII probes; ASCII-only + email allowlist-inversion clean on both files; committer identity is the public gmail.

## Next Plan Readiness

- The EVL-01 trigger DATA + its shape lint are in place. Next (11-03): heavy-rewrite `grade-run.mjs` (name+layer matcher + RUBRICS + name->layer lookup) and author `evals/evals.json` (EVL-02 behavior scenarios from the shipped smell leaves), with the `--selfcheck` RUBRICS<->evals.json alignment gate.
- No run happens until the D-10 halt is lifted by explicit user approval; `EVAL-RESULTS.md` numbers stay blank until then.

---
*Phase: 11-skill-effectiveness-evals*
*Completed: 2026-07-10*
