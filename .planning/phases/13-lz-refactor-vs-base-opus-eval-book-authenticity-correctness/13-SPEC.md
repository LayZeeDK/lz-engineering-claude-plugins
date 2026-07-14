# Phase 13: lz-refactor vs base Opus eval -- book authenticity & correctness -- Specification

**Created:** 2026-07-15
**Ambiguity score:** 0.18 (gate: <= 0.20)
**Requirements:** 6 locked

## Goal

Measure whether the `lz-refactor` skill produces more book-authentic and more correct APPLIED refactorings than base Opus 4.8 @ high, by grading the OUTPUT of drive/apply runs (the applied diffs / edited code) against the `.oracle/` source books, `with_skill`/`invoke_skill` vs `no_skill`, and producing a with/without comparison record plus a written verdict.

## Background

The prior eval loop (Phases 11-12 + quick tasks 260712-i5y, 260712-n5o, 260714-vmy, 260714-nxp) compared the skill to base Opus on trigger accuracy, coach/recommend answer quality, and reference recall -- and found base Opus 4.8 @ high already catalog-grade, with the skill's realizable value concentrated in auto-triggering plus a narrow Kerievsky direction-table recall edge. Two dimensions were never cleanly differenced against base on APPLIED output:

- **Book authenticity of the applied diff** -- did the transformation the model actually applied realize the named refactoring/pattern per the book's mechanics? (Phase 10's DST-04 sweep graded the shipped CATALOG, not live run output.)
- **Correctness of the applied diff vs base** -- apply/drive mode was only ever run `with_skill`/`invoke_skill`; no `no_skill` apply arm exists, so there is no base-vs-skill delta on applied correctness.

Disk state verified 2026-07-15:
- Single-target apply diffs (`nx p1/p2/p3/p4`, `kata gr1`) ARE persisted (tracked) under `.claude/skills/lz-refactor-workspace/e2e-*/results/apply/{with_skill,invoke_skill}/.../diff.patch` -- but there is NO `no_skill` apply tree.
- Per-package SWEEP applied diffs (`nx p8` + `@nx/*` fleet, `kata gr3/gr4`) are NOT persisted for either arm -- the sweep quick-tasks kept only PLAN/RESEARCH/SUMMARY/VERIFICATION docs; borrowed repos were restored pristine and `outputs/` is gitignored.
- All three source books exist locally for oracle grading: `.oracle/refactoring-2e/` (Fowler), `.oracle/refactoring-to-patterns/` (Kerievsky), `.oracle/design-patterns/` (GoF).

The primary new work: (1) backfill the missing `no_skill` single-target apply arm, (2) re-run both arms of the sweep pair (nothing reusable), (3) grade all graded runs for book authenticity + correctness via the oracle agents, (4) tabulate the head-to-head and write a verdict.

## Requirements

1. **no_skill single-target apply backfill**: The missing base-Opus apply arm for the reused single-target cells is generated.
   - Current: apply mode ran only `with_skill`/`invoke_skill`; no `no_skill` apply diffs exist for `p1`, `p2`, `gr1`
   - Target: `no_skill` apply runs for `nx p1`, `nx p2`, `kata gr1` (k=3 each) on the same targets/prompts as the existing skill-arm runs, applied diffs persisted
   - Acceptance: for each of {p1, p2, gr1} x run-{1..3}, a persisted `diff.patch` exists and is non-empty, OR a `meta.json` records an explicit no-edit outcome for that run

2. **Sweep pair both-arm re-run with retained diffs**: The sweep applied output is regenerated for both arms and retained this time.
   - Current: sweep applied diffs (`nx p8` @nx/eslint-plugin, `kata gr4`) are not persisted for either arm
   - Target: `nx p8` and `kata gr4` re-run for BOTH `with_skill` and `no_skill` (k=3 each), with applied diffs + `meta.json` persisted into a tracked location that survives borrowed-repo restoration
   - Acceptance: for each of {p8, gr4} x {with_skill, no_skill} x run-{1..3}, a `diff.patch` + `meta.json` exists and is still present after the borrowed repo is restored to pristine

3. **Book-authenticity grading via oracle ground truth**: Every graded applied refactoring is scored for fidelity to its book's mechanics.
   - Current: no per-run fidelity score of applied diffs against the books exists
   - Target: for EVERY applied refactoring in each SWEEP run (p8, gr4) and the applied move in each single-target run (p1, p2, gr1), the `oracle` agent establishes the relevant book's mechanics ground truth from `.oracle/`, and the applied change is scored pass/partial/fail on "did it realize the named refactoring per the book's mechanics"
   - Acceptance: a per-refactoring fidelity record exists for each graded run; each record names the book + refactoring and carries a pass/partial/fail verdict expressed in the agent's own words (no source prose)

4. **Correctness grading differenced vs base**: Each graded run is scored on correctness for both arms.
   - Current: correctness (right named refactoring/layer + behavior-preserving) was verified only for skill arms; no base delta
   - Target: each graded run scored on (a) named refactoring at the right layer is correct, and (b) behavior-preserving (target tests green post-apply), for `with_skill`/`invoke_skill` AND `no_skill`
   - Acceptance: a per-run correctness record (name/layer correct y/n; target tests green y/n) exists for both arms on all graded cells

5. **With/without comparison record + verdict**: A results artifact differences the two arms on both dimensions and states a verdict.
   - Current: no head-to-head record exists on book authenticity or correctness of applied output
   - Target: a `13-RESULTS.md` tabulates `with_skill`/`invoke_skill` vs `no_skill` per cell for BOTH dimensions (book-authenticity fidelity + correctness) and states whether the skill measurably beats base on either
   - Acceptance: `13-RESULTS.md` exists with per-cell with/without scores for both dimensions and a written verdict sentence; the verdict is framed as an empirical finding (parity / delta with magnitude), not a pre-assumed skill win

6. **Clean-room + hygiene + repo restoration**: Grading respects DST-04 and leaves no residue.
   - Current: grading uses `.oracle/` (git-ignored book text); borrowed repos must be left pristine
   - Target: all book-authenticity grading runs through the `oracle`/`oracle-reviewer` agents (main context never reads `.oracle/` prose); committed grading output is original-words + ASCII-only; borrowed `nx`/`kata` repos restored pristine and any worktrees removed
   - Acceptance: no `.oracle/` prose appears in committed artifacts (hygiene scan); committed output is ASCII-only; `git status` in each borrowed repo is clean after the phase; committer email is the approved public gmail

## Boundaries

**In scope:**
- Backfill of the `no_skill` single-target apply arm (`p1`, `p2`, `gr1`)
- Both-arm re-run of the sweep pair (`nx p8` @nx/eslint-plugin, `kata gr4`), k=3, diffs persisted
- Book-authenticity grading of applied diffs: EVERY applied refactoring in each sweep run + the applied move in each single-target run, via oracle ground truth from `.oracle/`
- Correctness grading (named refactoring/layer + behavior-preserving) for both arms on all graded cells
- A `13-RESULTS.md` head-to-head comparison record + written verdict

**Out of scope:**
- The `@nx/*` fleet (`p9`-`p13`) and `kata gr3` sweeps -- excluded; the representative pair (p8 + gr4) covers both repos and the prior finding is that the sweep null-delta generalizes across the fleet, so they add spend with low marginal signal
- Grading of coach/recommend and reference/lookup run OUTPUT -- this phase grades APPLIED output only (coach/reference are secondary and already characterized in prior phases)
- Re-running Phase 10's DST-04 authoring gate -- that graded the shipped catalog and is complete; Phase 13 grades live applied output
- Trigger-rate, token-spend, and wall-clock measurement -- different dimensions, not this phase
- Any edit to the shipped `lz-refactor` skill -- Phase 13 is measurement-only; a surfaced defect feeds a separate, gated tuning decision (D-08-style), never an in-phase skill edit

## Constraints

- Model `claude-opus-4-8`, effort `high` (defacto default; `--setting-sources project`), matching the prior eval config so results are comparable
- k=3 per cell (D-06 project standard)
- Every metered `claude -p` run is gated by the eval-run-approval gate: HALT for explicit user approval before executing any run (no self-approval, even in an autonomous pass)
- DST-04: book-authenticity grading runs through the `oracle`/`oracle-reviewer` agents against `.oracle/`; the main context never reads book prose; all verdicts are in the agent's own words
- Grading-agent fit: `oracle` establishes open-ended book ground truth; `oracle-reviewer` is only usable if a run's applied output is first normalized into a per-claim list (its contract gates drafted lz-refactor docs, not raw transcripts) -- the HOW is a plan/discuss decision
- Borrowed repos: `nrwl/nx` @ 23.0.x (`@nx/eslint-plugin`) and `emilybache/GildedRose-Refactoring-Kata`; restored pristine after; sweeps may need a git worktree + `node_modules` junction as prior nx apply runs did
- ASCII-only committed output; committer identity = approved public gmail (public-repo hygiene)

## Acceptance Criteria

- [ ] `no_skill` apply diffs exist for `p1`, `p2`, `gr1` (k=3) -- persisted and non-empty, or an explicit no-edit `meta.json` per declining run
- [ ] `nx p8` + `kata gr4` re-run for BOTH arms (k=3); applied diffs + `meta.json` persisted and still present after borrowed-repo restore
- [ ] Every applied refactoring in every graded run has an oracle-derived book-fidelity verdict (book + name + pass/partial/fail, agent's own words)
- [ ] Per-run correctness record (name/layer correct; target tests green) exists for both arms on all graded cells
- [ ] `13-RESULTS.md` tabulates `with_skill`/`invoke_skill` vs `no_skill` per cell for BOTH dimensions + a written empirical verdict
- [ ] No `.oracle/` prose in any committed artifact; committed output ASCII-only; each borrowed repo `git status` clean after; committer email = approved gmail
- [ ] No eval run executed without explicit user approval (eval-run-approval gate honored)

## Ambiguity Report

| Dimension          | Score | Min  | Status | Notes                                                        |
|--------------------|-------|------|--------|--------------------------------------------------------------|
| Goal Clarity       | 0.85  | 0.75 | MET    | Grade applied diffs vs .oracle books, with/without, verdict  |
| Boundary Clarity   | 0.90  | 0.70 | MET    | Corpus (representative pair) + depth (every refactoring) locked by user |
| Constraint Clarity | 0.72  | 0.65 | MET    | Model/effort/k, DST-04, eval-run-approval gate, repo restore |
| Acceptance Criteria| 0.78  | 0.70 | MET    | 7 pass/fail checks; verdict = empirical finding, not threshold |
| **Ambiguity**      | 0.18  | <=0.20| MET   |                                                              |

Status: MET = met minimum, BELOW = below minimum (planner treats as assumption)

## Interview Log

| Round | Perspective     | Question summary                              | Decision locked                                                        |
|-------|-----------------|-----------------------------------------------|------------------------------------------------------------------------|
| 1     | Researcher (auto) | What exists on disk to reuse vs backfill?   | single-target with_skill diffs persisted; no no_skill; sweep diffs gone |
| 2     | Boundary Keeper (escalated, --auto trap) | How much corpus to grade? (spend) | Representative pair: single-target p1/p2/gr1 + sweep pair p8/gr4        |
| 2     | Boundary Keeper (escalated) | Grading depth per sweep run?          | Every applied refactoring per sweep run                                |
| 3     | Seed Closer (auto) | Verdict criterion?                         | Empirical finding (parity/delta w/ magnitude), NOT a pre-assumed win   |
| 3     | Seed Closer (auto) | k / grading path?                          | k=3 (D-06); oracle establishes ground truth, oracle-reviewer only on normalized claims |

---

*Phase: 13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness*
*Spec created: 2026-07-15*
*Next step: /gsd:discuss-phase 13 -- implementation decisions (grading harness, oracle ground-truth capture, diff-fidelity scoring mechanics)*
