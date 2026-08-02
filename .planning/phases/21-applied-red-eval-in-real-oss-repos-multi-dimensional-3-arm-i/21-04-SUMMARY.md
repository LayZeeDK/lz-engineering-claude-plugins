---
phase: 21
plan: 04
subsystem: eval-harness
tags: [eval, red, apply-eval, run-gate, build-then-halt, eval-run-approval-gate, d12-gate, halt]
requires:
  - phase: 21-01
    provides: "e2e-red-gilded-rose suite.json/targets.json (GRC anchor + 7-point discriminating-target checklist) + run-e2e.mjs suite-driven trackSkills"
  - phase: 21-02
    provides: "grade-red.mjs D-06 correctness gate (differential tsc + target runner + 7-class classify)"
  - phase: 21-03
    provides: "tabulate-mechanical-red.mjs + selfcheck-red.mjs + EVAL-RESULTS.md scaffold; the four offline --selfcheck gates"
provides:
  - "e2e-red-gilded-rose/RUN-GATE.md -- the ready-to-run gated metered-run presentation: HALT banner, D-01 target-confirmation checklist + package-legitimacy gate, the REQUIRED runner-JSON shape-drift canary, the exact first-round 3-arm command, the blinded <=2-dim judge + merge/verify + oracle-reviewer path, the D-05 contingent mattpocock round, D-13 hygiene, and the D-10 unbiased reviewer + substance-only headline"
  - "the BUILD-closure attestation: the full offline battery GREEN, the borrowed kata git root pristine, and plugins/lz-tdd untouched -- EVL-03.1..EVL-03.6 BUILD sub-criteria closed and the phase HALTED at the blocking-human run gate"
affects:
  - "the gated metered 3-arm apply RUN (a separate, orchestrator-driven step that starts only on fresh explicit approval per RUN-GATE.md; it grades with grade-red, tabulates with tabulate-mechanical-red, runs the blind judge + oracle-reviewer + unbiased reviewer, and fills EVAL-RESULTS.md)"
tech-stack:
  added: []
  patterns:
    - "build-then-halt: prove the whole instrument GREEN offline (zero spend), attest borrowed repos pristine + skill-under-test untouched, then HALT at a blocking-human run gate (D-12 / eval-run-approval-gate)"
    - "the metered-run commands are DOCUMENTED (RUN-GATE.md), never executed during execute-phase"
    - "kata git-root pristineness checked via git --git-dir/--work-tree (no cd-prefix, no git -C) to respect the allowed-tools + working-dir rules"
key-files:
  created:
    - ".claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md"
  modified: []
key-decisions:
  - "The metered 3-arm apply RUN is NOT executed in this phase: RUN-GATE.md presents the ready-to-run commands and the phase HALTS at a blocking-human gate for fresh explicit approval (D-11 / D-12 / eval-run-approval-gate). Zero claude tokens spent."
  - "EVL-03 stays Pending (build complete; empirical run gated) -- 21-04 closes the EVL-03.6 gate/no-dep BUILD sub-criterion and the RUN-GATE presentation for EVL-03.7; the empirical RUN sub-criteria close only after the user-gated metered run. requirements mark-complete deliberately skipped (mirrors 21-01/21-02/21-03)."
  - "RUN-GATE.md states a REQUIRED runner-JSON shape-drift canary before the full spend: grade-red --selfcheck pins vitest@4.1.10 while the metered gate shells into the kata's vitest@^0.28.5 / jest@^29.4.3; run ONE real grade-red --run against a captured kata run (or add a jest devDependency to exercise jest --json offline) before the full fan-out."
patterns-established:
  - "The whole offline instrument stays GREEN together: grade-red --selfcheck + tabulate-mechanical-red --selfcheck + merge-judge --selfcheck + selfcheck-red + npm run check (check-red-references) + extract-samples.mjs + check-evals.mjs + claude plugin validate . all exit 0 with zero claude spend."
requirements-completed: []

coverage:
  - id: D1
    description: "The full deterministic battery is GREEN on the merged tree, zero spend (EVL-03.1-.6 BUILD closure): the four --selfcheck gates + the three separate workspace scripts + claude plugin validate . all exit 0."
    requirement: "EVL-03"
    verification:
      - kind: other
        ref: "node grade-red.mjs --selfcheck && node tabulate-mechanical-red.mjs --selfcheck && node merge-judge.mjs --selfcheck && node selfcheck-red.mjs (all exit 0)"
        status: pass
      - kind: other
        ref: "npm --prefix .claude/skills/lz-red-workspace run check (check-red-references, 11/11) && node extract-samples.mjs (8 modules tsc --strict clean) && node check-evals.mjs (24 queries) && claude plugin validate . (all exit 0)"
        status: pass
    human_judgment: false
  - id: D2
    description: "The borrowed repos are pristine (kata git root git status --porcelain clean; only main; single worktree) and plugins/lz-tdd is untouched (git status --porcelain empty) after the whole build (D-12; SC4)."
    requirement: "EVL-03"
    verification:
      - kind: other
        ref: "git --git-dir=<kata>/.git --work-tree=<kata> status --porcelain empty; branch list only main; worktree list single entry; git status --porcelain plugins/lz-tdd empty"
        status: pass
    human_judgment: false
  - id: D3
    description: "RUN-GATE.md exists with the HALT banner (fresh explicit approval; no command runs during execute-phase), the D-01 target-confirmation checklist + package-legitimacy gate, the REQUIRED canary, the exact first-round 3-arm command + per-run grade/tabulate, the blinded <=2-dim judge + merge/verify + oracle-reviewer path, the D-05 contingent mattpocock round + scope mismatch, D-13 hygiene, and the D-10 unbiased reviewer + substance-only headline; ASCII-only; no maintainer work-email/domain."
    requirement: "EVL-03"
    verification:
      - kind: other
        ref: "node regex check (HALT, approval, arm all, no_skill, with_skill, invoke_skill, unbiased, ponytail, mattpocock, canary all present) -> OK-run-gate"
        status: pass
      - kind: other
        ref: "ASCII-only (0 non-ASCII bytes) + email allowlist-inversion (0 email tokens; no disallowed address/domain)"
        status: pass
    human_judgment: false

duration: 12min
completed: 2026-07-23
status: complete
---

# Phase 21 Plan 04: RED Apply RUN-GATE + BUILD Closure Summary

> **ADDENDUM 2026-08-02 -- forward pointer only; nothing below is edited.**
>
> Everything in this summary was TRUE WHEN WRITTEN and is left intact as the point-in-time
> record of what this plan did. In particular, "the metered run is user-gated and RAN NONE
> of the sessions" and "EVL-03 stays Pending" were accurate statements about THIS plan's
> execution.
>
> What happened afterwards: the gated metered run WAS approved and RAN on 2026-07-27/28 --
> 36 runs, $29.05, across GRC/RXF/RXL/SRVC -- and is written up in
> `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/EVAL-RESULTS.md`. EVL-03 was
> reconciled to Complete in `REQUIREMENTS.md` on 2026-08-02, and all 36 captures were
> re-graded under the current grader with zero verdict changes.
>
> This note exists so a reader does not conclude from the text below that the round never
> happened. Read the living status in `REQUIREMENTS.md`, not a closed plan's summary.

**Closed the BUILD of the applied-RED instrument: proved the whole thing GREEN offline (the four
`--selfcheck` gates + the three separate workspace scripts + `claude plugin validate .` all exit 0,
zero claude spend), attested the borrowed Gilded Rose kata git root is pristine and `plugins/lz-tdd`
is untouched, and wrote `e2e-red-gilded-rose/RUN-GATE.md` -- the ready-to-run gated 3-arm metered-run
presentation. The phase then HALTS at the Task-3 blocking-human run gate: the metered `claude -p` run
is user-gated and RAN NONE of the sessions (D-12 / eval-run-approval-gate).**

## What Was Done

### Task 1 -- Phase gate: full deterministic battery GREEN + repos pristine + plugins/lz-tdd untouched (verification only, no commit)

Ran the full offline battery on the merged tree; every command exited 0 with zero claude spend:

1. `node grade-red.mjs --selfcheck` -- exit 0; all SEVEN D-06 classes proven (genuinely_red /
   false_green / drove_to_green / compile_error / collection_error / no_tests / wrong_reason);
   fixtures pristine, fail-closed paths throw.
2. `node tabulate-mechanical-red.mjs --selfcheck` -- exit 0; token/cost rollup, the with_skill
   auto-trigger rate (0.60) vs invoke_skill (1.00) vs no_skill (0.00), and Pass@k/Pass^k on the D-06
   gate all match the fixtures.
3. `node merge-judge.mjs --selfcheck` -- exit 0 (judge merge + fail-closed verify intact).
4. `node selfcheck-red.mjs` -- exit 0; crux 1/2/3/5/6 OK, crux 4 SKIP by design (no RED transcript on
   disk, gitignored); crux 3 confirms the kata git root is pristine after worktree teardown (no
   leftover `review-*` branch, no `lz-review-wt-` worktree).
5. The workspace deterministic battery as THREE SEPARATE steps (the `check` npm script runs ONLY
   `check-red-references.mjs` -- it does NOT spawn the other two):
   - `npm --prefix .claude/skills/lz-red-workspace run check` -- exit 0; RED-REFS GREEN, 11/11 lz-red
     surfaces authored (SKILL.md coach procedure + SEL/STR/NAME/ASRT/RTR/VIT/ANTI references), SEAM-02
     reverse pointers present, D-05 honesty gate holds.
   - `node extract-samples.mjs` -- exit 0; RED-SAMPLES GREEN, 8 modules `tsc --strict --noEmit` clean.
   - `node check-evals.mjs` -- exit 0; 24 queries (12 trigger / 12 near-miss; 3 lz-tpp-seam + 3
     lz-refactor-seam), reciprocal 12 all-false byte-consistent, ASCII-clean, email-allowlist-clean.
6. `claude plugin validate .` -- exit 0 ("Validation passed").

Attestations:
- **Kata git root pristine:** `git --git-dir=<kata>/.git --work-tree=<kata> status --porcelain` is
  empty; branches = only `main`; `worktree list` = a single entry (the main checkout, no leftover
  review/red worktree). Checked via `--git-dir`/`--work-tree` to respect the no-`cd`-prefix and
  no-`git -C` rules.
- **Skill under test untouched:** `git status --porcelain plugins/lz-tdd` is empty (NO dependency
  added, D-12).

### Task 2 -- RUN-GATE.md (commit 7fdb045)

Created `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md` -- the presentation of the
gated metered run. It PRESENTS commands and STOPS. Sections:

- **HALT banner** -- "METERED RUN -- requires fresh explicit user approval (eval-run-approval-gate).
  Do NOT run any command below during execute-phase." Blocking-human, never auto-approvable; no prior
  approval or `workflow.auto_advance` carries over. Plus the offline instrument re-prove commands
  (zero spend).
- **Step 1 -- D-01 target confirmation:** GRC (Conjured) is the fixed, verified genuinely-red
  correctness SMOKE anchor (contamination HIGH -> parity EXPECTED, read as pass-at-ceiling); confirm
  or nominate the discriminating 2nd/3rd target against the 7-point qualification checklist; run the
  **package-legitimacy gate** (real, maintained repo verified) + `npm install` on any NEW nominated
  repo before vendoring; decide run scope (D-03: ~2-3 targets x k=3; Pass@k AND Pass^k).
- **Step 2 -- REQUIRED canary (runner-JSON shape drift, RESEARCH A1 / Pitfall 4):** grade-red
  --selfcheck pins `vitest@4.1.10`, but the metered gate shells into the kata's `vitest@^0.28.5` /
  `jest@^29.4.3`; before the full spend, run ONE real `grade-red --run <captured kata runDir>` and
  confirm a sane `genuinely_red` verdict with runner + version recorded, OR add a `jest`
  devDependency to exercise `jest --json` offline. Stated as a REQUIRED gate step (mitigated by
  grade-red's fail-closed contract, so not a BUILD blocker).
- **Step 3 -- exact first-round 3-arm command:** create a throwaway kata branch checkout (never the
  pristine tree; the harness refuses apply on protected `main`/`master`), then
  `run-e2e.mjs --suite e2e-red-gilded-rose --mode apply --arm all --cwd <throwaway checkout>/TypeScript
  --runs 3` (arm all = no_skill + with_skill + invoke_skill) + per-run `grade-red --run` +
  `tabulate-mechanical-red`; isolation via `--strict-mcp-config` + `--setting-sources project`;
  `claude-opus-4-8` @ high; serial per suite.
- **Step 4 -- graded-dims path:** the blind LLM judge (<=2 dims: "is THIS the right next test?" +
  "asserts observable behavior, not implementation?") fed ONLY the blinded test code + behavior spec
  (Pitfall 7); a contingent second judge for classify-first only if targets stress it;
  oracle-reviewer vs `.oracle/` (DST-04); `merge-judge --merge` + `--verify` fail-closed; then fill
  EVAL-RESULTS.md.
- **Step 5 -- competitor round (D-05):** mattpocock-skills:tdd as a LATER, CONTINGENT round only after
  own lift is measured; note the red->green scope mismatch (full loop + interactive seam-confirmation
  vs lz-red's RED-step-only coach).
- **Step 6 -- run-time hygiene (D-13):** small waves (org cap / 24-in-flight); "normal mode / stop
  ponytail" in every in-session subagent prompt; resume spend-limit kills via SendMessage; isolated
  git-ignored worktree per run.
- **Step 7 -- post-run (D-08/D-10):** >= 1 from-scratch UNBIASED reviewer audits the grader source +
  a transcript sample + the numbers before recording, with a SUBSTANCE-ONLY headline; caveats applied
  symmetrically to both arms.

### Task 3 -- HALT (blocking-human run gate; REACHED, not crossed)

The Task-3 checkpoint is a `checkpoint:human-verify` with `gate="blocking-human"` (the
eval-run-approval-gate). It is REACHED and surfaced, not crossed: no metered `claude -p`, no
`run-e2e.mjs --mode apply`, no judge, no oracle-reviewer, no eval fan-out ran. The metered 3-arm
apply run and the subsequent judge / oracle-reviewer / unbiased-reviewer gates are a separate,
orchestrator-driven step that starts only on explicit fresh approval per RUN-GATE.md. The Task-3
`<what-built>` / `<how-to-verify>` / `<resume-signal>` are surfaced to the orchestrator for human
presentation.

## Verification (all offline, zero spend)

- The four `--selfcheck` gates + the three separate workspace scripts + `claude plugin validate .`
  all exit 0 (recorded above).
- Kata git root pristine (clean porcelain, only `main`, single worktree); `git status --porcelain
  plugins/lz-tdd` empty.
- RUN-GATE.md verify regex passes (`HALT`, `approval`, `arm all`, `no_skill`, `with_skill`,
  `invoke_skill`, `unbiased`, `ponytail`, `mattpocock`, `canary` all present -> OK-run-gate).
- RUN-GATE.md is ASCII-only (0 non-ASCII bytes) and email allowlist-inversion clean (0 email tokens;
  no maintainer work-email or its domain, plain or as a needle).
- The blocking-human checkpoint is reached; NO metered `claude -p` run occurred.

## Deviations from Plan

None -- the plan executed exactly as written (NORMAL mode; the ponytail-lite hook was overridden by
the orchestrator's explicit NORMAL-mode directive). Every offline check the plan's Task 1 lists was
run (not the `check` npm script alone), all asserted exit 0; RUN-GATE.md was built with every section
the Task 2 acceptance criteria require and passes its verify regex; Task 3 was surfaced as a HALT,
not crossed.

### State-update note (not a plan deviation)

- **EVL-03 intentionally NOT marked Complete.** 21-04 closes the EVL-03.6 (no-dep / gitignore / gated
  HALT) BUILD sub-criterion and delivers the EVL-03.7 RUN-GATE presentation, but EVL-03 remains
  **Pending (build complete; empirical run gated)** -- the RUN sub-criteria (EVL-03.5 verdicts,
  EVL-03.7 recorded numbers) close only after the user-gated metered run. `requirements mark-complete`
  was deliberately skipped (mirrors 21-01/21-02/21-03). `requirements-completed: []`.
- The installed gsd-tools state commands use NAMED flags (per the 21-03 note); the named form was
  used for the metric/decision/session updates, and `roadmap update-plan-progress 21` refreshed
  ROADMAP.md.

## Known Stubs

None that block the plan goal. RUN-GATE.md is a deliberate documentation artifact (the gated-run
presentation), not an unresolved stub; EVAL-RESULTS.md keeps its blank result cells by build-then-halt
design (D-11/D-12) -- they fill only after the user-gated metered run. The discriminating 2nd/3rd
target remains steer-at-gate (D-01), as documented in RUN-GATE.md Step 1.

## Threat Surface

All three register threats for this plan were mitigated; no new surface introduced:

- **T-21-01** (Elevation/Tampering, metered apply run under bypassPermissions): the run is GATED (no
  spend without fresh approval); RUN-GATE.md documents disposable-worktree isolation + reset-to-base +
  the never-the-pristine-tree rule; nothing metered ran this phase.
- **T-21-SC** (Tampering / supply chain, gate-nominated target repo): RUN-GATE.md Step 1 requires the
  package-legitimacy gate on ANY newly nominated repo (real, maintained repo verified) before
  vendoring / `npm install`; the blocking-human checkpoint is never auto-approvable; the anchor kata
  is already vendored + verified.
- **T-21-03** (Information Disclosure, RUN-GATE.md): ASCII-only + allowlist-inversion clean (no
  maintainer work-email or its domain, plain or as a needle); per-run transcripts git-ignored.

## Next Step Readiness (the gated metered run -- a separate, freshly-approved step)

- On explicit fresh approval per RUN-GATE.md: confirm the target(s) (D-01), run the REQUIRED canary,
  drive `e2e-red-gilded-rose` serially (3 arms x r1 x k) in a throwaway kata branch checkout, grade
  each run with `grade-red --run`, tabulate with `tabulate-mechanical-red`, then the ORCHESTRATOR runs
  the blind judge (<=2 dims, blinded test code) + oracle-reviewer + merge/verify + the mandatory
  unbiased-from-scratch reviewer, and fills every blank cell in EVAL-RESULTS.md.
- HALT boundary intact: nothing metered ran; EVL-03 stays Pending (empirical run user-gated); the
  whole instrument is offline-proven (eight zero-spend gates GREEN).

## Self-Check: PASSED

- Created file: `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md` FOUND on disk.
- Commit: `7fdb045` (RUN-GATE.md) FOUND in git log.
- The full offline battery (grade-red / tabulate-mechanical-red / merge-judge / selfcheck-red +
  check-red-references / extract-samples / check-evals + claude plugin validate .) all exit 0; kata
  git root pristine; `git status --porcelain plugins/lz-tdd` empty; RUN-GATE.md verify regex +
  ASCII-only + email allowlist-inversion all pass.

---
*Phase: 21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i*
*Completed: 2026-07-23*
