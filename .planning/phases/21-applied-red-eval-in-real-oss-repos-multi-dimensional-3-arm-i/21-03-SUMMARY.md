---
phase: 21
plan: 03
subsystem: eval-harness
tags: [eval, red, apply-eval, tabulate, pass-at-k, auto-trigger, selfcheck, build-then-halt, d06-gate]
requires:
  - phase: 21-01
    provides: "run-e2e.mjs suite-driven trackSkills (used_skills) + e2e-red-gilded-rose suite.json/targets.json + prompts/r1"
  - phase: 21-02
    provides: "grade-red.mjs red-grade.json shape (verdict/pass) + classify() export the tabulator/selfcheck consume"
provides:
  - "tabulate-mechanical-red.mjs -- mechanical lift dims + the with_skill auto-trigger rate + Pass@k/Pass^k on the D-06 correctness gate, off the stream-json meta; --selfcheck exit 0 offline"
  - "selfcheck-red.mjs -- the zero-spend crux battery (composition, prompt-parity, worktree base, transcript parse, classifier, lz-refactor regression); the D-12 build-then-halt boundary"
  - "e2e-red-gilded-rose/EVAL-RESULTS.md -- the substance-only results scaffold with blank Pass@k/Pass^k tables + a reserved mandatory unbiased-reviewer slot"
  - "two tabulate fixtures (meta.sample.json + red-grade.sample.json) -- the offline proof data with known Pass@k/rollup/auto-trigger values"
affects:
  - "21-04 RUN-GATE (drives the suite, grades with grade-red, tabulates with tabulate-mechanical-red, fills EVAL-RESULTS.md; the metered run is user-gated)"
tech-stack:
  added: []
  patterns:
    - "pure aggregate(runs) shared by the real results walk and --selfcheck (the fixture arrays feed the same code path as the on-disk run tree)"
    - "Pass@k over exit-0 runs only; cost/turns/tools/model_usage/auto-trigger over ALL runs (mirrors the tabulate-mechanical.mjs clean-filter)"
    - "auto-trigger rate = fraction of runs with used_skills['lz-red'] > 0 (D-04 trigger-gap: with_skill genuine trigger vs invoke_skill forced control vs no_skill 0-by-construction)"
    - "arm->argv map parsed from the dry-run's `--- mode/arm/pid ---` headers (robust arm identification for composition + prompt-parity)"
    - "buildSyntheticBase reused to exercise git-root worktree build/teardown offline (Pitfall 6) without a captured run"
key-files:
  created:
    - ".claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs"
    - ".claude/skills/lz-red-workspace/selfcheck-red.mjs"
    - ".claude/skills/lz-red-workspace/e2e-red-gilded-rose/EVAL-RESULTS.md"
    - ".claude/skills/lz-red-workspace/fixtures/tabulate/meta.sample.json"
    - ".claude/skills/lz-red-workspace/fixtures/tabulate/red-grade.sample.json"
  modified: []
key-decisions:
  - "Pass@k/Pass^k pass criterion is the D-06 correctness gate (c = red-grade.pass === true), NOT a vocabulary/lift proxy (Pitfall 6); comb/passAtK/passHatK copied verbatim from run-e2e.mjs / tabulate-mechanical.mjs (neither importably clean)."
  - "aggregate() is a pure function shared by the real results walk and the fixture --selfcheck, so the offline proof exercises the exact aggregation the metered run will."
  - "selfcheck-red exercises worktree teardown via buildSyntheticBase against the kata git root (offline, no captured run); Pitfall-6 cleanliness (git status clean, no leftover worktree/branch) is asserted after teardown."
  - "EVL-03 NOT marked Complete -- 21-03 closes the EVL-03.4 BUILD sub-criterion (mechanical dims + Pass@k) + the EVL-03.5 WIRING + the EVL-03.7 scaffold; the empirical run is gated to 21-04 (mirrors 21-01/21-02 build-then-halt, D-14)."
patterns-established:
  - "The tabulator fails CLOSED (exit 1) on a garbled/keyless meta or a captured run (meta.json present) missing its red-grade.json -- a run is never silently dropped from the numbers (T-21-02b)."
  - "Every offline instrument gate stays GREEN together: selfcheck-red + grade-red --selfcheck + tabulate-mechanical-red --selfcheck + merge-judge --selfcheck all exit 0 with zero claude spend."
requirements-completed: []

coverage:
  - id: D1
    description: "tabulate-mechanical-red.mjs emits the mechanical lift dims per (target, arm) off the stream-json meta (wall-clock, cost + per-model model_usage rollup, tool histogram, num_turns, edits) + the with_skill lz-red auto-trigger rate, and computes Pass@k + Pass^k (k=1,3,5,total) on the D-06 correctness gate, fail-closed on a garbled/keyless meta or a captured run missing red-grade.json."
    requirement: "EVL-03"
    verification:
      - kind: other
        ref: "node --check tabulate-mechanical-red.mjs (exit 0)"
        status: pass
      - kind: unit
        ref: "node tabulate-mechanical-red.mjs --selfcheck (exit 0; asserts token/cost rollup, the with_skill auto-trigger rate 0.60, invoke_skill 1.00, no_skill 0.00, and Pass@1/Pass@3/Pass@5/Pass^1/Pass^3 on the correctness gate against the two fixtures; fail-closed paths throw)"
        status: pass
    human_judgment: false
  - id: D2
    description: "selfcheck-red.mjs proves the RED harness composes + tears down offline: 3-arm composition, byte-identical prompt-parity (invoke_skill == with_skill + '/lz-tdd:lz-red '), worktree build/teardown leaving the kata git root pristine, transcript parse keyed by lz-red/lz-tpp, the classifier, and the lz-refactor nx regression -- zero claude spend."
    requirement: "EVL-03"
    verification:
      - kind: other
        ref: "node --check selfcheck-red.mjs (exit 0)"
        status: pass
      - kind: unit
        ref: "node selfcheck-red.mjs (exit 0; crux 1-2-3-5-6 OK, crux 4 SKIP no transcript; kata git root pristine, no leftover worktree/branch after crux 3)"
        status: pass
    human_judgment: false
  - id: D3
    description: "e2e-red-gilded-rose/EVAL-RESULTS.md is the BUILD-then-HALT results scaffold: substance-only headline (D-08), per-target + overall Pass@k AND Pass^k on the correctness gate, mechanical-dim tables, the with_skill-vs-invoke_skill auto-trigger-gap row (D-04), the graded-dims wiring with the <= 2-dims-per-blind-judge + blinded-test-code note (Pitfall 7), and a reserved mandatory unbiased-reviewer slot (D-10); all numbers blank."
    requirement: "EVL-03"
    verification:
      - kind: other
        ref: "node -e regex check (Pass@k, Pass^k, Unbiased reviewer, substance, no_skill/with_skill/invoke_skill all present) -> OK-scaffold"
        status: pass
    human_judgment: false

duration: 15min
completed: 2026-07-23
status: complete
---

# Phase 21 Plan 03: RED Reporting + Offline-Proof Instrument Summary

**Built the reporting + offline-proof half of the applied-RED instrument: `tabulate-mechanical-red.mjs`
(mechanical lift dims + the with_skill auto-trigger rate + Pass@k/Pass^k on the D-06 correctness gate,
all off the stream-json meta), `selfcheck-red.mjs` (the zero-spend crux battery that proves
composition, prompt-parity, worktree teardown, transcript parse, the classifier, and the lz-refactor
regression), and the substance-only `EVAL-RESULTS.md` scaffold with a reserved mandatory
unbiased-reviewer slot -- all offline, zero claude spend, `plugins/lz-tdd` untouched.**

## What Was Built

### Task 1 -- tabulate-mechanical-red.mjs + tabulate fixtures (commit 82ed825)

- Adapted `lz-refactor-workspace/e2e-angular/tabulate-mechanical.mjs` into `tabulate-mechanical-red.mjs`
  for the RED apply suite. It walks `e2e-red-gilded-rose/results/apply/<arm>/<pid>/run-*/`, joins each
  `meta.json` with its sibling `red-grade.json`, and emits per (target:pid, arm):
  - wall-clock mean (`elapsed_ms`), cost mean (`total_cost_usd`) + a per-model `model_usage` rollup,
  - tool histogram + `num_turns` mean, changed-files/edits count (drove),
  - the AUTO-TRIGGER rate = fraction of runs whose `used_skills['lz-red'] > 0` (the D-04 trigger-gap
    dimension; invoke_skill is the always-fires control, no_skill is 0 by construction).
- Pass@k + Pass^k (k = 1, 3, 5, total) are computed on the **D-06 correctness gate** (`c` = runs whose
  `red-grade.pass === true`), NOT a vocabulary/lift proxy. `comb`/`passAtK`/`passHatK` were copied
  VERBATIM from run-e2e.mjs / tabulate-mechanical.mjs (neither is importably clean, per the Phase-14
  note). cost/turns/tools/model_usage/auto-trigger stay over ALL runs; Pass@k stays over exit-0 runs
  only (a crashed run has no meaningful grade), mirroring the analog's clean-filter.
- The mechanical dims come straight off the meta (D-07/D-09) -- nothing is re-computed from transcript
  text. Writes `mechanical-red.json` and prints a per-cell table on a real run; fail-closed (exit 1)
  on a garbled/keyless meta or a captured run missing its `red-grade.json` (T-21-02b).
- `aggregate(runs)` is a PURE function shared by the real results walk and `--selfcheck`, so the
  offline proof exercises the exact aggregation the gated run will.
- Two fixtures (`fixtures/tabulate/meta.sample.json` + `red-grade.sample.json`): 11 run records across
  with_skill (5, one crashed), invoke_skill (3), no_skill (3) with hand-computed known values.
  `--selfcheck` asserts the token/cost rollup (5000 in / 1000 out / $1.05), the tool histogram
  (Read:9/Edit:3/Bash:2), the auto-trigger rates (with_skill 0.60, invoke_skill 1.00, no_skill 0.00),
  and Pass@k/Pass^k (with_skill Pass@1 0.75, Pass@3 1.00, Pass@5 null, Pass^1 0.75, Pass^3 0.25;
  no_skill Pass@1 0.667) plus two fail-closed paths -- exit 0, zero spend.

### Task 2 -- selfcheck-red.mjs (commit ceea1d1)

Mirrors `selfcheck-code-review.mjs`. Six cruxes, all zero claude spend:

1. **COMPOSITION** -- `run-e2e.mjs --suite e2e-red-gilded-rose --dry-run --mode recommend --arm all
   --prompt r1`: no_skill has NO `--plugin-dir`; with_skill's `--plugin-dir` ends `plugins/lz-tdd` and
   its `-p` is a natural prompt (no leading slash); invoke_skill's `-p` starts `/lz-tdd:lz-red `.
2. **PROMPT-PARITY (EVL-03.1)** -- `no_skill -p === with_skill -p` (byte-identical) and
   `invoke_skill -p === '/lz-tdd:lz-red ' + with_skill -p`.
3. **WORKTREE BASE** -- `buildSyntheticBase` against the kata git root builds + tears down; after
   teardown `git status --porcelain` is clean, no `review-*` branch, no `lz-review-wt-` worktree
   (Pitfall 6). Kata unavailable -> SKIP (does not fail the whole selfcheck).
4. **TRANSCRIPT PARSE** -- `extractResult(raw, ['lz-red','lz-tpp'])` on an on-disk RED transcript
   asserts `used_skills` is keyed by the tracked names; gitignored/absent -> SKIP (as designed).
5. **CLASSIFIER** -- imports grade-red's `classify()` and re-asserts genuinely_red + false_green (thin;
   grade-red --selfcheck is the full 7-class one).
6. **REGRESSION (D-11)** -- `run-e2e.mjs --dry-run --arm all --prompt p1` on the DEFAULT nx suite still
   composes 3 arms with `plugins/lz-tdd` (the suite-driven trackSkills edit did not break lz-refactor).

Prints per-crux OK lines + an overall OK line, exits 0; any violation prints FAIL and exits 1. Not
wired into `npm run check` (it touches the borrowed repo); run explicitly.

### Task 3 -- e2e-red-gilded-rose/EVAL-RESULTS.md scaffold (commit d845695)

A BUILD-then-HALT results scaffold with ALL numbers blank (`_`):

- Header + status line (instrument built + selfcheck GREEN this phase; the metered run is user-gated
  per D-11 -- numbers pending; a blank cell is not a zero).
- Locked run-config: `claude-opus-4-8` @ effort high; ~2-3 targets x k=3 (tuned at the gate, D-03);
  serial per-suite; `--strict-mcp-config` + `--setting-sources project`; the 3 own-skill arms with the
  mattpocock `tdd` competitor DEFERRED to a later contingent round (D-05).
- SUBSTANCE-ONLY headline structure (D-08): the correctness gate (mechanical) + blind-judge substance
  dims; any house-vocabulary/style number is a separate CONTEXT-ONLY row explicitly labeled. States
  the Phase-13 parity + Phase-20 concentration + GRC contamination priors so a correctness tie on the
  contaminated Conjured anchor reads as pass-at-ceiling, NOT "the skill adds nothing" (Pitfall 5).
- Blank tables: per-target and overall Pass@k AND Pass^k (k=1,3,5,total) on the correctness gate; the
  mechanical dims (wall-clock, tokens, cost, tools, num_turns) per arm; the with_skill-vs-invoke_skill
  auto-trigger-gap row (D-04); the graded dims (right-next-test, observable-behavior, classify-first,
  book authenticity via oracle-reviewer) with the <= 2-dims-per-blind-judge + blinded-test-code note
  (Pitfall 7).
- A reserved `## Unbiased reviewer (mandatory, D-10)` section (neutral-brief placeholder) + a "How to
  run (gated)" pointer to 21-04's commands with the per-target contamination flag.

## Verification (all offline, zero spend)

- `node --check` exit 0 for both new scripts.
- `node tabulate-mechanical-red.mjs --selfcheck` exit 0 -- token/cost rollup, the with_skill
  auto-trigger rate, and Pass@k/Pass^k (k=1,3,5,total) on the D-06 gate all match the fixtures;
  fail-closed paths (meta without a grade, keyless meta) throw.
- `node selfcheck-red.mjs` exit 0 -- crux 1/2/3/5/6 OK, crux 4 SKIP (no transcript on disk); the kata
  git root is pristine after crux 3 (no leftover worktree/branch; verified via the kata's own
  `git status --porcelain`).
- Reused gates still GREEN: `node grade-red.mjs --selfcheck` exit 0 (all 7 D-06 classes),
  `node merge-judge.mjs --selfcheck` exit 0 (judge-merge/verify intact).
- EVAL-RESULTS.md scaffold present with blank Pass@k/Pass^k tables + reserved unbiased slot +
  substance-only headline (verify regex -> OK-scaffold).
- `git status --porcelain plugins/lz-tdd` empty (skill under test untouched; NO dependency added, D-12).
- ASCII-only across all 5 files; email allowlist-inversion clean (no maintainer work-email/domain).

## Deviations from Plan

None -- the plan executed exactly as written (NORMAL mode). Every specified deliverable was built:
tabulate-mechanical-red.mjs with its `--selfcheck`, selfcheck-red.mjs with all six cruxes,
EVAL-RESULTS.md with the full substance-only structure (Pass@k + Pass^k tables, mechanical + graded
dim tables, the auto-trigger-gap row, the reserved unbiased slot), and BOTH tabulate fixtures. No
selfcheck case, fixture, Pass@k/Pass^k table, or dimension was trimmed, deferred, or minimized.

### State-update / harness notes (not plan deviations)

- **EVL-03 intentionally NOT marked Complete.** 21-03 closes the EVL-03.4 BUILD sub-criterion
  (mechanical dims + Pass@k/Pass^k, offline-provable) + the EVL-03.5 WIRING (merge-judge selfcheck-GREEN
  + the results scaffold documenting the judge/oracle-reviewer axes) + the EVL-03.7 scaffold (blank
  tables + reserved unbiased slot + substance-only headline). EVL-03 remains **Pending (build complete;
  empirical run gated)** per D-14; the metered run closes it in 21-04. `requirements mark-complete` was
  deliberately skipped (mirrors 21-01/21-02). `requirements-completed: []`.
- **SDK state-command arg form.** The installed gsd-tools (1.6.1) router uses NAMED flags
  (`--phase`/`--plan`/`--duration`/`--tasks`/`--files`/`--decision`/`--stopped-at`/`--resume-file`),
  not the positional form the execute-plan workflow documents. The named form was used; STATE.md got
  the metric row + 3 decisions + the session update, and `roadmap update-plan-progress 21` (positional)
  refreshed ROADMAP.md.

## Known Stubs

None that block the plan goal. EVAL-RESULTS.md is a deliberate scaffold with blank result numbers --
this is the build-then-halt design (D-11/D-12), not an unresolved stub; the numbers fill only after
the user-gated metered run (21-04). The discriminating 2nd/3rd target remains steer-at-gate (D-01), as
documented in the scaffold's run-config and 21-01's targets.json checklist.

## Threat Surface

All three register threats for this plan were mitigated; no new surface introduced:

- **T-21-02b** (Tampering / false verdict, tabulate-mechanical-red): fails CLOSED (exit 1) on a
  garbled/keyless `meta.json` or a captured run missing its `red-grade.json`; Pass@k over exit-0 runs
  only. Two fail-closed paths are asserted by `--selfcheck`.
- **T-21-03** (Information Disclosure, EVAL-RESULTS.md scaffold): ASCII-only + allowlist-inversion
  clean (no maintainer work-email or its domain, plain or as a needle); per-run transcripts git-ignored.
- **T-21-V5b** (Input Validation, selfcheck-red transcript parse): the transcript-parse crux SKIPs (not
  crashes) when the gitignored transcript is absent; zero spend.

## Next Phase Readiness

- **21-04 RUN-GATE:** drive `e2e-red-gilded-rose` serially (3 arms x r1 x k) in a throwaway kata branch
  checkout; grade each run with `grade-red.mjs --run <runDir>`; tabulate with
  `tabulate-mechanical-red.mjs`; then the ORCHESTRATOR runs the blind judge (<= 2 dims, blinded test
  code), oracle-reviewer, merge/verify, and the mandatory unbiased-from-scratch reviewer, and fills
  every blank cell in EVAL-RESULTS.md. The user confirms the discriminating 2nd/3rd target at the gate
  (7-point checklist; package-legitimacy gate on any new repo).
- HALT boundary intact: nothing metered ran; EVL-03 stays Pending (empirical run user-gated); the whole
  instrument is offline-proven (four `--selfcheck` gates GREEN).

## Self-Check: PASSED

- Created files: all 5 FOUND on disk (tabulate-mechanical-red.mjs, selfcheck-red.mjs,
  e2e-red-gilded-rose/EVAL-RESULTS.md, fixtures/tabulate/meta.sample.json,
  fixtures/tabulate/red-grade.sample.json).
- Commits: all 3 task commits FOUND (82ed825 tabulator+fixtures, ceea1d1 selfcheck-red, d845695
  EVAL-RESULTS scaffold).
- `node tabulate-mechanical-red.mjs --selfcheck` + `node selfcheck-red.mjs` + `node grade-red.mjs
  --selfcheck` + `node merge-judge.mjs --selfcheck` all exit 0; `git status --porcelain plugins/lz-tdd`
  empty.

---
*Phase: 21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i*
*Completed: 2026-07-23*
