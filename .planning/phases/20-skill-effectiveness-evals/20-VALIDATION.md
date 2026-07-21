---
phase: 20
slug: skill-effectiveness-evals
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-21
validated: 2026-07-21
---

# Phase 20 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This is a skill-effectiveness EVAL phase. `plugins/lz-tdd` ships only dependency-free
> Markdown; there is no runtime feature to unit-test. "Validation" here splits in two:
> (a) DETERMINISTIC, zero-spend, build-time gates that ARE the coverage instruments and
> ARE ALREADY GREEN on the merged tree (eval-set lint, grader --selfcheck, judge-merge
> --selfcheck, plus the pre-existing content gate), and (b) the EMPIRICAL eval
> measurements (trigger recall/specificity + reciprocal RED spot-check; RED-behavior
> with-skill-vs-baseline) which spend tokens via `claude -p` and are USER-GATED
> (CONTEXT.md D-11 HARD GATE / memory `eval-run-approval-gate`) -- they are manual-only
> by design, not automated in this battery, and are NOT counted as coverage gaps.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | node built-in `--selfcheck` / lint scripts in the dev-only `lz-red-workspace`; no runtime test framework in the shipped plugin |
| **Config file** | none per-eval-script (each `.mjs` is self-contained); `.claude/skills/lz-red-workspace/package.json` only wires the PRE-EXISTING Phase-16 content gate (`check` -> `check-red-references.mjs`, `typecheck` -> `extract-samples.mjs`) -- it does NOT include the Phase-20 eval gates, so the quick/full commands below invoke the eval scripts directly rather than via `npm run` |
| **Quick run command** | `node .claude/skills/lz-red-workspace/check-evals.mjs && node .claude/skills/lz-red-workspace/grade-run.mjs --selfcheck && node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck` |
| **Full suite command** | Quick run + `npm run check --prefix .claude/skills/lz-red-workspace && npm run typecheck --prefix .claude/skills/lz-red-workspace` (the pre-existing Phase-16/17/18 content gate + tsc-strict sample extractor, confirmed unregressed) |
| **Estimated runtime** | ~10 seconds (five zero-spend, filesystem-only checks; the metered eval run is separate + user-gated) |

*Corrected during validate-phase: the scaffold's original "Quick run command" (`npm run check
--prefix ...`) only runs the Phase-16 content gate and does not exercise `check-evals.mjs` /
`grade-run.mjs --selfcheck` / `merge-judge.mjs --selfcheck` -- `package.json`'s `scripts` block was
never extended for the Phase-20 additions. Corrected here to the direct `node` invocations that
actually cover the EVL-01/EVL-02 instruments; no source file was changed to make this correction
(doc-only fix).*

---

## Sampling Rate

- **After every task commit:** Run the quick check battery (`check-evals.mjs` + `grade-run.mjs --selfcheck` + `merge-judge.mjs --selfcheck`)
- **After every plan wave:** Run the full suite command (quick battery + the pre-existing content gate)
- **Before `/gsd:verify-work`:** Full deterministic suite green; the metered eval run is a separate user-approved step
- **Max feedback latency:** ~10 seconds (deterministic gates)

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Correct Behavior | Test Type | Automated Command | Status |
|---------|------|------|-------------|-------------------|-----------|--------------------|--------|
| 20-01 Task 1 | 20-01 | 1 | EVL-01 | Vendored native-fixed harness + generic scripts byte-identical to the lz-refactor source; canary-gated runners re-pointed at lz-red; gitignore drops per-run captures | build-time (byte-diff + selfcheck + `node --check`) | `git diff --no-index --quiet <src> <dst>` (6 files) + `node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck` + `node --check` on eval-status.mjs/both runners | green |
| 20-01 Task 2 | 20-01 | 1 | EVL-01 | `check-evals.mjs` adapted to the three-way boundary (both-seam negatives, reciprocal dual-write, email-allowlist); fails closed before the data exists (RED baseline) | build-time lint | `node .claude/skills/lz-red-workspace/check-evals.mjs` (RED at this task; proves fail-closed instrument) | green (superseded RED baseline, see Task 3) |
| 20-01 Task 3 | 20-01 | 1 | EVL-01 | trigger-eval.json (12 pos/12 neg incl. both seams), reciprocal-red.json (positives re-tagged false), d07-chunks/negatives.json (dual-write slice) authored; canary re-derived from a real positive | build-time lint | `node .claude/skills/lz-red-workspace/check-evals.mjs` (exit 0: 24 queries, 3+3 seam, reciprocal 12 all-false, ASCII-clean, email-allowlist-clean) | green |
| 20-02 Task 1 | 20-02 | 1 | EVL-02 | `grade-run.mjs` rewritten as the D-05-RUBRIC hybrid grader (6 mechanical dimensions via negation-aware phrase-set matchers + judge locked to 2 dimensions); fails closed before the data exists (RED baseline) | unit (selfcheck) | `node .claude/skills/lz-red-workspace/grade-run.mjs --selfcheck` (RED at this task; proves alignment gate fails closed on absent evals.json) | green (superseded RED baseline, see Task 2) |
| 20-02 Task 2 | 20-02 | 1 | EVL-02 | evals/evals.json authored: 10 leaf-grounded RED scenarios (ids 0-9), incl. the classify-first boundary + all four assertion stances, count-aligned 1:1 to RUBRICS | unit (selfcheck) | `node .claude/skills/lz-red-workspace/grade-run.mjs --selfcheck` (exit 0: alignment gate + negation-rejection fixtures + judge-count <=2 all pass) | green |
| 20-03 Task 1 | 20-03 | 2 | EVL-01, EVL-02 | EVAL-RESULTS.md scaffolded (3-measurement structure + Pass@k/Pass^k tables, numbers blank); full deterministic battery GREEN on the merged tree; existing content gate unregressed | build-time (5 selfchecks/lints) + doc scaffold | `check-evals.mjs` + `grade-run.mjs --selfcheck` + `merge-judge.mjs --selfcheck` + `tools/check-red-references.mjs` + `extract-samples.mjs` (all exit 0) | green |
| 20-03 Task 2 | 20-03 | 2 | EVL-01, EVL-02 | Ready-to-run command set + orchestrator-gate + D-09 tuning notes documented; tree-wide ASCII/email-hygiene backstop over all maintainer-authored eval artifacts; explicit HALT (D-11), nothing metered ran | build-time hygiene scan + doc | `rg -c "GATED|user approval|HALT"` + tree-wide `node -e` ASCII/allowlist-inversion walk (prints `tree-hygiene-ok`) | green |

*Status legend: pending / green / red / flaky. All rows independently re-verified by
gsd-nyquist-auditor on 2026-07-21 (see Validation Audit trail below) -- not taken on the
SUMMARY.md's word alone.*

---

## Wave 0 Requirements

The `lz-red-workspace` instrument already existed (Phase 16: content gate + tsc extractor). Phase
20 ADDED the vendored eval rig + eval data + a RED-behavior grader; the following are the Wave 0
"tests" that went RED-then-GREEN before the metered run, all now GREEN on the merged tree:

- [x] Vendored native-fixed `skill-creator-eval` harness (byte-identical copy) -- exists, byte-diff clean
- [x] `check-evals.mjs` (EVL-01 build-time lint, both-seam + reciprocal + email-allowlist) -- exit 0
- [x] `evals/trigger-eval.json` + `evals/reciprocal-red.json` + `evals/d07-chunks/negatives.json` (EVL-01 data) -- authored, schema/dual-write/reciprocal invariants hold
- [x] `grade-run.mjs` (EVL-02 D-05-RUBRIC hybrid grader, negation-aware) -- `--selfcheck` exit 0
- [x] `evals/evals.json` (EVL-02 data, 10 leaf-grounded RED scenarios) -- authored, count-aligned to RUBRICS
- [x] `merge-judge.mjs` (verbatim, judge-merge instrument) -- `--selfcheck` exit 0
- [x] Framework install: none needed -- byte-identical copy of the proven Phase-11 rig; workspace devDeps pre-exist; no new package

No runtime test framework was introduced in the shipped plugin (REQUIREMENTS Out of Scope, correct
per PROJECT constraints).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|--------------------|
| Trigger recall/specificity incl. the three-way boundary + reciprocal RED spot-check | EVL-01 | The measurement runs the skill via `claude -p` (token spend); model-specific; user-gated (D-11) | Ready-to-run commands are documented in `EVAL-RESULTS.md`'s "How to run (GATED)" section: canary-gated runners (`run-recall-chunks.mjs`, `run-spec-chunks.mjs`) or the direct `run_eval` probe for the forward measurement; direct `run_eval` twice (vs. lz-tpp, then lz-refactor) against `reciprocal-red.json` for the reciprocal spot-check. Run only after explicit user approval; target 100% recall / 100% specificity |
| RED-behavior correct-move vs unaided baseline (with_skill vs no_skill) | EVL-02 | Behavior subagents + LLM-judge dimensions spend tokens; user-gated (D-11) | Ready-to-run orchestrator chain documented in `EVAL-RESULTS.md`: subagent fan-out (with_skill/no_skill x >=3 runs) -> `grade-run.mjs` -> LLM judge (2 locked dimensions) -> `merge-judge.mjs --merge` -> `--verify` -> aggregate -> Pass@k/Pass^k -> >=1 unbiased-from-scratch reviewer. Run only after approval |

*The DETERMINISTIC halves (eval-set lint + grader selfcheck + judge-merge selfcheck + tsc-strict
content gate) are automated, ALREADY GREEN, and re-verified independently during this audit. The
EMPIRICAL measurements above are manual-only by design per the eval-run approval gate (CONTEXT.md
D-11, a HARD GATE that predates execution) and are NOT counted as coverage gaps -- see the audit
trail below for the adversarial reasoning.*

---

## Validation Sign-Off

- [x] All tasks have automated verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (deterministic build-time gates)
- [x] No watch-mode flags
- [x] Feedback latency < 30s (measured ~10s for the full deterministic battery)
- [x] `nyquist_compliant: true` set in frontmatter (this audit, 2026-07-21)

**Approval:** VALIDATED 2026-07-21 -- deterministic build-time coverage COMPLETE for this
build-then-halt phase's delivered scope; the empirical run remains an explicit, user-gated,
non-blocking follow-up (not a gap). See the Validation Audit trail below.

---

## Validation Audit trail (2026-07-21)

Retroactive Nyquist audit for a locked, build-then-halt eval-infrastructure phase (CONTEXT.md D-11
HARD GATE, pre-dating execution). Starting hypothesis: the "manual-only" framing is a scope-excuse
invented to dodge real coverage work. I checked that directly rather than accepting the SUMMARY /
prior VERIFICATION.md claims at face value.

### Automated commands independently re-executed (all exit 0, zero `claude -p` spend)

Run from the repo root (`D:\projects\github\LayZeeDK\lz-engineering-claude-plugins`):

| # | Command | Result | Covers | Can fail? |
|---|---------|--------|--------|-----------|
| 1 | `node .claude/skills/lz-red-workspace/check-evals.mjs` | `check-evals: OK - 24 queries (12 trigger / 12 near-miss; 3 lz-tpp-seam + 3 lz-refactor-seam), reciprocal 12 all-false byte-consistent, ASCII-clean, email-allowlist-clean` | EVL-01 build-time (schema, split, both-seam, dual-write, reciprocal dual-write, ASCII, email-allowlist) | Yes -- fail-closed `process.exit(1)` on any malformed/short-split/missing-seam/stale-dual-write/non-ASCII/non-allowlisted input (confirmed by reading the full source: 7 independent fail-closed assertion blocks, each reading real files from disk, not hardcoded) |
| 2 | `node .claude/skills/lz-red-workspace/grade-run.mjs --selfcheck` | `SELFCHECK OK` | EVL-02 build-time (RUBRICS<->evals.json count alignment; phrase-set matchers; judge-count <=2 per scenario; negation-aware `occursAffirmed` fixtures) | Yes -- confirmed by reading the fixture assertions directly (e.g. `assert(!occursAffirmed("this is not a false green...", "false green"))`); these are real executable `assert()` calls, not a log message |
| 3 | `node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck` | `SELFCHECK OK` | judge-merge instrument (verbatim Phase-11 copy) | Yes -- fail-closed refusal-path assertions (verified present by source read, unchanged from the proven Phase-11 rig) |
| 4 | `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` | `RED-REFS GREEN -- 11/11 lz-red surfaces authored ...` | pre-existing Phase-16/17/18 content gate, unregressed by the Phase-20 additions | Yes -- fails on any missing topic/fence/cross-link/scaffold-leak across 11 surfaces |
| 5 | `node .claude/skills/lz-red-workspace/extract-samples.mjs` | `RED-SAMPLES GREEN -- 8 module(s) tsc --strict --noEmit clean` | pre-existing tsc-strict sample extractor, unregressed | Yes -- fails on any TypeScript-strict compile error in the extracted reference samples |

### Adversarial confirmation these are not vacuous

- Read `check-evals.mjs` in full (238 lines): confirmed each of the 7 checks (schema, split,
  both-seam regex with an AND-combined refactor-vocab + tests-green requirement, ASCII byte scan,
  negatives dual-write, reciprocal dual-write, email allowlist-inversion) reads real files from disk
  via `readFileSync`/`JSON.parse` and calls `fail()` -> `process.exit(1)` on violation. This is a
  real fail-closed lint, not a fixed "OK" string.
- Read `grade-run.mjs`'s `occursAffirmed()` + selfcheck fixtures directly: the negation-rejection
  fixtures are executable `assert()` statements (lines ~446-452) covering same-clause negation,
  forward negation, negation-past-comma non-suppression, and hedged-then-retracted phrasing. Running
  `--selfcheck` executes these assertions live (confirmed exit 0 == all asserts passed, not skipped).
- Attempted a direct mutation test (flip one `reciprocal-red.json` entry to `should_trigger:true` and
  re-run `check-evals.mjs`, expecting a non-zero exit) to prove the dual-write/reciprocal check is
  not vacuously green. This action was BLOCKED by the auto-mode permission classifier as an
  unauthorized mutation of a tracked eval fixture (the task scoped this audit to confirming/filling
  the VALIDATION doc, not modifying existing gate fixtures). Respected the denial; relied instead on
  the direct source read above (the reciprocal check at `check-evals.mjs:159-199` performs an
  unconditional `posQueries[i] !== recipQueries[i]` byte comparison with no short-circuit or
  always-true branch, which is sufficient to establish it is not vacuous without executing a live
  mutation).
- Confirmed via `git status --short` (clean) and a `rg --files -uu` sweep for
  `run-*|iteration-*|trigger-results-*` that NO metered-run byproduct exists anywhere under
  `lz-red-workspace/` -- corroborating the SUMMARY/VERIFICATION claim that nothing metered ran.

### Why the empirical (manual-only) half is NOT counted as a gap

- **D-11 predates execution and is a standing, cross-project policy**, not a phase-local excuse:
  CONTEXT.md locks it citing the global memory rule `eval-run-approval-gate` ("never RUN skill
  evals ... without explicit user approval"). This is the maintainer's own policy, authored before
  any plan or execution existed for this phase, and CONTEXT.md itself notes the run is
  "NON-BLOCKING -- the public 0.0.3 ship ... is complete regardless of eval outcome."
- **REQUIREMENTS.md is left honestly "Pending"** for EVL-01/EVL-02 -- consistent with a genuine,
  intentional scope boundary rather than a shortcut being concealed as done.
- **No run artifacts exist** (confirmed independently above) and **zero `plugins/lz-tdd/` diff**
  across the phase (a prior D-09 tuning pass would be the only path that writes back into
  `plugins/`, and none occurred) -- consistent with "no measurement has run yet."
- The critical framing for this audit explicitly instructs treating the gated empirical run as
  out-of-scope for coverage purposes, and my own independent evidence above corroborates that this
  is genuine rather than a rationalization (same conclusion 20-VERIFICATION.md reached
  independently, cross-checked here rather than assumed).

### Coverage verdict: COMPLETE for the delivered (build-then-halt) scope -- no gaps

- EVL-01: build-time COVERED (commands #1, green; source-verified non-vacuous). Empirical
  recall/specificity + reciprocal spot-check: NOT YET RUN, correctly gated (Manual-Only
  Verifications table), NOT a gap.
- EVL-02: build-time COVERED (commands #2/#3, green; source-verified non-vacuous). Empirical
  with-skill-vs-baseline behavior benchmark: NOT YET RUN, correctly gated, NOT a gap.
- Pre-existing content gate (Phase 16/17/18): unregressed (commands #4/#5, green).

No implementation file was modified during this audit (the vendored/authored eval tooling and data
are READ-ONLY here; the one attempted mutation for adversarial testing was blocked by the
permission classifier and left no trace -- confirmed via `git status --short`). Only this
VALIDATION.md was edited.

### Non-blocking observations (WARNING, not gaps)

- The scaffold's original "Quick run command" (`npm run check --prefix
  .claude/skills/lz-red-workspace`) only wires the pre-existing Phase-16 `check-red-references.mjs`
  gate; `package.json`'s `scripts` block was never extended to cover `check-evals.mjs` /
  `grade-run.mjs --selfcheck` / `merge-judge.mjs --selfcheck`. Corrected in the Test Infrastructure
  section above to the direct `node` invocations that actually exercise the Phase-20 gates. This is
  a documentation-accuracy fix only -- the underlying `.mjs` scripts themselves are unaffected and
  were not touched.
- `check-evals.mjs` has no dedicated `--selfcheck` mode of its own (unlike `grade-run.mjs` /
  `merge-judge.mjs`): it lints the real `evals/*.json` files directly (green) rather than exercising
  its own fail-closed branches against synthetic bad inputs on every run. Its fail-closed branches
  were verified by direct source read (adversarial confirmation above) rather than by a live
  mutation test (blocked by the permission classifier, see above). This mirrors an identical,
  previously-recorded non-blocking observation from the Phase-11 precedent (`11-VALIDATION.md`) and
  does not affect EVL-01's actual delivered job (validating the real committed trigger set), which
  is automated and green.
