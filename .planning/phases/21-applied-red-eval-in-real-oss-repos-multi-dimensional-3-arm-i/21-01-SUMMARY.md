---
phase: 21
plan: 01
subsystem: eval-harness
tags: [eval, red, apply-eval, harness-reuse, gilded-rose, requirements]
requires:
  - ".claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs (the reused 3-arm apply driver)"
  - "D:/projects/github/emilybache/GildedRose-Refactoring-Kata (the vendored Conjured RED target)"
provides:
  - "e2e-red-gilded-rose suite (suite.json + targets.json + prompts/r1-next-test.md) -- the RED apply corpus"
  - "run-e2e.mjs suite-driven trackSkills (used_skills hit map; lz-refactor back-compat preserved)"
  - "EVL-03 requirement formalized (Pending; build-then-halt closure shape)"
affects:
  - "21-02 grade-red.mjs (consumes the GRC target runner + differential-tsc strict_scope_note)"
  - "21-03 selfcheck-red (asserts the trackSkills regression + prompt-parity + 3-arm composition)"
  - "21-04 RUN-GATE (drives the e2e-red-gilded-rose suite sequentially; user confirms discriminating target)"
tech-stack:
  added: []
  patterns:
    - "suite-driven trackSkills (SUITE.trackSkills sources the fired-skill signal; default preserves lz-refactor)"
    - "differential-tsc target-shape (existing-compiling-API + missing behavior => tsc-clean + assertion-red)"
    - "steer-at-gate checklist (discriminating target confirmed by the user at the run gate, not hard-locked)"
key-files:
  created:
    - ".claude/skills/lz-red-workspace/e2e-red-gilded-rose/suite.json"
    - ".claude/skills/lz-red-workspace/e2e-red-gilded-rose/targets.json"
    - ".claude/skills/lz-red-workspace/e2e-red-gilded-rose/prompts/r1-next-test.md"
  modified:
    - ".claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs"
    - ".gitignore"
    - ".planning/REQUIREMENTS.md"
decisions: [D-01, D-02, D-04, D-11, D-12, D-14]
metrics:
  duration: 7min
  tasks: 3
  files: 6
  completed: 2026-07-22
status: complete
---

# Phase 21 Plan 01: RED Apply Eval Foundation Summary

Made the reused lz-refactor apply driver skill-name-agnostic (one surgical edit sourcing the tracked
skill set from `SUITE.trackSkills`, lz-refactor back-compat byte-identical), authored the Gilded Rose
`Conjured` RED apply suite (a genuinely-red, non-leading, contamination-flagged correctness anchor plus
a steer-at-gate checklist for the discriminating target), git-ignored its run tree, and formalized
EVL-03 in REQUIREMENTS.md as "build complete; empirical run gated" -- all offline, zero spend,
`plugins/lz-tdd` untouched.

## What Was Built

### Task 1 -- `run-e2e.mjs` trackSkills parameterization (commit 36cc0a0)
- Added `const TRACK_SKILLS = SUITE.trackSkills || ['lz-refactor', 'lz-tpp'];` after the SUITE/TARGETS
  parse -- the tracked "fired-skill" set is now suite-driven (D-11).
- `extractResult(raw, trackSkills = TRACK_SKILLS)`: replaced the two hardcoded `lz-refactor` /
  `lz-tpp` counters with a generic per-name hit map (`skillHits`), scanning each `tool_use` blob
  (lowercased) for every tracked name. The return now emits `used_skills` (name -> hit count) and
  RETAINS the back-compat scalars `usedRefactor` / `refactorHits` / `usedTpp` / `tppHits`, derived from
  the map (0 when a name is not tracked) so `skillFlag()` / `report()` and the lz-refactor suites keep
  working unchanged.
- `runOne()`'s meta object gains `used_skills` alongside every existing field (nothing removed).
- The default single-arg call (`selfcheck-code-review.mjs`) is unbroken -- the default keeps the
  single-arg signature working.
- `.gitignore`: added explicit `e2e-red-*` `results*/` + `run-*/` + `outputs/` coverage under the
  existing lz-red-workspace block (belt-and-suspenders over the generic `**/results*/` / `**/run-*/`
  / `*-workspace/**/outputs/` rules); no `work/` line (the grader drives os.tmpdir() worktrees).
  lz-refactor-workspace rules left byte-unchanged.

### Task 2 -- e2e-red-gilded-rose RED apply suite (commit 97655d7)
- `suite.json`: `red-gilded-rose`, `skillCommand: /lz-tdd:lz-red`, `trackSkills: [lz-red, lz-tpp]`,
  one `r1` prompt targeting `GRC` (mirrors `e2e-gilded-rose/suite.json` shape exactly except
  name/skillCommand/trackSkills/prompts).
- `targets.json` `GRC` (the Conjured anchor): `file: app/gilded-rose.ts`; a `runner` object with BOTH
  the vitest (`npx vitest run <file> --reporter=json`) and jest (`npx jest <file> --json`) commands +
  a preference note (jest 29 --json is the more stable shape, A1); `test_dir: test/vitest/`;
  `behavior_gap` (no Conjured branch -> a "degrades by 2" test compiles and fails on the assertion);
  `expected_red_color: genuinely_red`; `red_shape_rationale` (existing-compiling-API + missing behavior,
  D-06 / Pitfall 1); `constraint: do NOT modify Item`; `discipline_traps` (classify-first,
  assert-observable-behavior, coach-don't-drive-to-green, lz-tpp handoff); `contamination: HIGH` with the
  smoke-anchor-not-discriminator note (parity expected); `strict_scope_note` (Item ctor untyped ->
  DIFFERENTIAL typecheck for NEW errors only, Pitfall 3).
- Top-level `discriminating_target_checklist` (7 points, verbatim-in-spirit from RESEARCH) + a note
  that the 2nd/3rd target is user-confirmed at the run gate (D-01), with a package-legitimacy gate on
  any newly nominated repo.
- `prompts/r1-next-test.md`: a 3-sentence human-style body that names `app/gilded-rose.ts`, states the
  tests are green, and asks for the next failing test + to add it -- non-leading (no `Conjured`,
  `degrade`, or any assertion value) and arm-agnostic (the driver adds the plugin/slash plumbing).

### Task 3 -- EVL-03 formalized in REQUIREMENTS.md (commit ac0cb81)
- Added the `EVL-03` bullet to the EVL section in the EVL-01/EVL-02 "build complete; empirical run
  gated" closure shape, plus the `EVL-03.1..EVL-03.7` BUILD/RUN sub-criteria, each tagged and mapping
  a Phase-21 ROADMAP success criterion (SC1..SC5).
- Traceability row `| EVL-03 | Phase 21 | Pending (build complete; empirical run gated) |`.
- Coverage `27 -> 28` total / `28` mapped / `0` unmapped; footer updated.

## Verification (all offline, zero spend)

- `node --check run-e2e.mjs` exit 0; default nx-suite dry-run (`--arm all --prompt p1`) prints 3
  `argv:` lines -- no lz-refactor composition regression.
- RED suite dry-run (`--suite e2e-red-gilded-rose --mode recommend --arm all --prompt r1`) exit 0,
  3 arms composed.
- `suite.json` / `targets.json` parse; `GRC` + `discriminating_target_checklist` (7 points) present;
  prompt names the path and contains no `conjured`/`degrade`/assertion tokens.
- `extractResult` offline test: single-arg back-compat (default `used_skills` = `{lz-refactor:0,
  lz-tpp:1}`, scalars intact, `input_tokens`/`total_cost_usd`/`tool_calls` preserved) AND RED tracking
  (`{lz-red:1, lz-tpp:1}`, `refactorHits` 0 when untracked) both pass.
- `selfcheck-code-review.mjs` regression: all 3 cruxes GREEN (composition + synthetic base for nx +
  kata + transcript parse via the single-arg `extractResult`), borrowed repos left pristine.
- REQUIREMENTS.md: `EVL-03` + 7 sub-criteria + traceability row + `28 total` / `28 mapped`.
- `git status --porcelain plugins/lz-tdd` empty (skill under test untouched); no `results/` tree under
  the RED suite (no metered run occurred).

## Deviations from Plan

None -- the plan executed exactly as written (NORMAL mode; every specified deliverable built: the
driver edit, the 3 suite files with all required fields, the 7-point checklist, the gitignore lines,
and the full EVL-03 formalization).

### State-update / harness notes (not plan deviations)

- **EVL-03 intentionally NOT marked Complete.** The generic executor `state_updates` step would run
  `requirements mark-complete` for the plan's `requirements: [EVL-03]` frontmatter. EVL-03 is
  formalized as **Pending (build complete; empirical run gated)** by the plan's own D-14 closure shape
  (mirroring EVL-01/EVL-02). Marking it Complete would contradict the plan and the build-then-halt
  boundary, so `requirements mark-complete` was deliberately skipped. EVL-03 closes empirically only
  after the user-gated metered run (21-04).
- **SDK state-command arg form.** The `execute-plan` workflow documents positional args for
  `state.record-metric` / `state.add-decision` / `state.record-session`; the installed gsd-tools
  (1.6.1) router uses NAMED flags (`--phase` / `--summary` / `--duration` / `--stopped-at` ...). The
  named form was used; STATE.md received the metric row + 3 decisions + the session update.

## Known Stubs

None that block the plan goal. The discriminating 2nd/3rd OSS target is **intentionally deferred** to
the run gate (D-01 steer-at-gate) and documented in `targets.json`
(`discriminating_target_checklist` + `discriminating_target_note`) -- this is a locked design choice,
not an unresolved stub. The Conjured anchor is fully specified and verified genuinely-red.

## Threat Surface

Both register threats were mitigated this plan and no NEW surface was introduced:
- **T-21-03** (info disclosure): all new/edited files ASCII-only + allowlist-inversion clean (no
  maintainer work-email or its domain, plain or as a needle); per-run transcripts git-ignored (this
  plan added the explicit `e2e-red-*` ignore lines).
- **T-21-EVAL** (eval integrity): the `r1` prompt is non-leading (never names Conjured or the
  assertion) and arm-agnostic; byte-identical-across-arms is enforced by the driver and will be
  asserted by 21-03's prompt-parity crux.

## Notes for Downstream Plans

- 21-02 `grade-red.mjs`: read `GRC.runner` (prefer jest --json per A1 if the vitest 0.28 shape drifts),
  `GRC.test_dir` (`test/vitest/`), and `GRC.strict_scope_note` (differential typecheck -- the kata's
  `Item` ctor is untyped, so a whole-project `tsc --strict` is already non-zero).
- 21-03 `selfcheck-red.mjs`: add the trackSkills regression assertion (the lz-refactor suites still
  compose unchanged) + the prompt-parity crux (only the target path / slash prefix differs across arms).
- 21-04 RUN-GATE: drive `e2e-red-gilded-rose` as the first sequential suite; the user confirms/nominates
  the discriminating target using the 7-point checklist (package-legitimacy gate on any new repo).

## Self-Check: PASSED

- Created/modified files: all 6 FOUND on disk (run-e2e.mjs, .gitignore, suite.json, targets.json,
  r1-next-test.md, REQUIREMENTS.md).
- Commits: all 3 FOUND (36cc0a0, 97655d7, ac0cb81).
