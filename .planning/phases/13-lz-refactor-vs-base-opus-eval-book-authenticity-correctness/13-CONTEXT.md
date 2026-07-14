# Phase 13: lz-refactor vs base Opus eval -- book authenticity & correctness - Context

**Gathered:** 2026-07-15
**Status:** Ready for planning
**Mode:** `--analyze --auto --chain`. Requirements are LOCKED by `13-SPEC.md` (6 requirements,
ambiguity 0.18), so this discussion captured HOW-to-implement decisions only (grading harness,
oracle ground-truth capture, diff-fidelity scoring), never WHAT/WHY. Every gray area was rated
IMPACT x CONFIDENCE before auto-locking. **No trap-quadrant item (HIGH impact + not-high
confidence) exists this phase** -- unlike Phase 11 (D-04-RUBRIC) and Phase 12 (GA-1 autonomy) --
because (a) this is a MEASUREMENT-ONLY, TERMINAL-milestone phase: no downstream phase inherits its
choices, re-grading is reversible and does not re-spend on the expensive apply runs, and it ships
NO skill code; and (b) the high-impact framing decisions (corpus, grading depth, verdict = empirical
finding, oracle grading path) were already escalated and locked in the SPEC's spec-phase `--auto`
trap rounds (13-SPEC.md Interview Log rounds 2-3). All remaining HOW decisions are LOW/MEDIUM impact
+ HIGH confidence: the e2e harness, the p8/gr4/p1/p2/gr1 prompts + targets, and BOTH borrowed repos
were verified present on disk 2026-07-15. `--chain` auto-advances discuss -> plan (planning spends
no eval tokens); execution HALTS at the D-09 eval-run-approval gate before any metered run.

<domain>
## Phase Boundary

Measure whether `lz-refactor` (`with_skill`/`invoke_skill`) produces more book-authentic and more
correct APPLIED refactorings than base Opus 4.8 @ high, by grading the OUTPUT of drive/apply runs
(the applied `diff.patch` / edited code) against the `.oracle/` source books, differenced
with_skill vs no_skill, and producing a with/without comparison record plus a written empirical
verdict. This phase authors GRADING + the missing run arms, NOT new eval infrastructure and NOT any
change to the shipped skill.

</domain>

<spec_lock>
## Requirements (locked via SPEC.md)

**6 requirements are locked.** See `13-SPEC.md` for full requirements, boundaries, and acceptance
criteria. Downstream agents MUST read `13-SPEC.md` before planning or implementing. Requirements are
not duplicated here.

**In scope (from SPEC.md):**
- Backfill of the `no_skill` single-target apply arm (`p1`, `p2`, `gr1`)
- Both-arm re-run of the sweep pair (`nx p8` @nx/eslint-plugin, `kata gr4`), k=3, diffs persisted
- Book-authenticity grading of applied diffs: EVERY applied refactoring in each sweep run + the
  applied move in each single-target run, via oracle ground truth from `.oracle/`
- Correctness grading (named refactoring/layer + behavior-preserving) for both arms on all graded cells
- A `13-RESULTS.md` head-to-head comparison record + written verdict

**Out of scope (from SPEC.md):**
- The `@nx/*` fleet (`p9`-`p13`) and `kata gr3` sweeps (representative pair p8 + gr4 covers both repos)
- Grading of coach/recommend and reference/lookup run OUTPUT (this phase grades APPLIED output only)
- Re-running Phase 10's DST-04 authoring gate (that graded the shipped catalog)
- Trigger-rate, token-spend, and wall-clock measurement
- Any edit to the shipped `lz-refactor` skill (measurement-only; a surfaced defect feeds a separate,
  gated tuning decision, never an in-phase skill edit)

</spec_lock>

<decisions>
## Implementation Decisions

### Corpus + arms (reuse vs backfill vs re-run) -- execution contract for SPEC req 1-2
- **D-01:** Single-target cells (nx `p1`, `p2`; kata `gr1`): REUSE the already-persisted skill-arm
  apply diffs (nx = `with_skill`; kata = `with_skill` + `invoke_skill`; verified present under
  `results/apply/.../diff.patch`); BACKFILL only the `no_skill` base arm (k=3) on the same
  targets/prompts. Prompts + targets already exist -- no authoring.
- **D-02 [AMENDED 2026-07-15 via research + OQ-1]:** Sweep cells (nx `p8` target `pkgsweep`; kata
  `gr4` target `projsweep`). CORRECTION: the SPEC/ROADMAP premise "no sweep diffs for either arm" is
  FALSIFIED for nx `p8` `with_skill` -- those diffs ARE persisted (committed, k=3, fresh 2026-07-14 on
  HEAD `cfcbfa5`, against the unchanged shipped skill). User decision (OQ-1): REUSE the committed nx
  `p8` `with_skill` diffs (skill unchanged since capture -> valid A/B baseline; ~40 min saved) and
  backfill nx `p8` `no_skill` only (k=3). kata `gr4` is genuinely absent for BOTH arms -> re-run
  `with_skill` + `no_skill` (k=3 each). Both prompts (`p8-eslint-plugin-package-directive.md`,
  `gr4-project-directive.md`) already exist. Net missing metered runs = 18: single-target `no_skill`
  backfill (p1/p2/gr1 = 9) + sweep (p8 `no_skill` 3 + gr4 both 6).

### Harness reuse (no new eval infrastructure)
- **D-03:** Reuse the existing `.claude/skills/lz-refactor-workspace/e2e-{nx,gilded-rose}/run-e2e.mjs`
  end-to-end. It already: accepts `--arm no_skill|with_skill|invoke_skill|both|all`; runs
  `--mode apply` on a `--cwd` throwaway checkout; and persists `diff.patch` + `meta.json` per run into
  the TRACKED workspace tree (`e2e-*/results/apply/<arm>/<pN>/run-<k>/`) by staging `add -A` and
  `diff --cached <base>` BEFORE it resets the borrowed repo. `meta.json` records `changed_files`,
  `used_refactor`, `skills_invoked`, `exit_code`, `elapsed_ms`. No new harness code is needed;
  raw transcripts under `outputs/` stay gitignored.

### Diff persistence + repo isolation (SPEC req 2, req 6)
- **D-04:** Because run-e2e.mjs captures each diff into the WORKSPACE (outside the borrowed repo)
  before its `reset --hard <applyBase>` + `clean -fd`, the persisted diffs SURVIVE restoring the
  borrowed repos pristine -- this is what solves SPEC req 2 (the prior sweep quick-tasks lost diffs
  only because they ran ad-hoc, not through run-e2e.mjs). Apply runs execute on a THROWAWAY
  branch/worktree (the runner refuses protected branches `23.0.x`/`main`/`master` and requires
  `--cwd`); nx sweeps reuse the prior-art git worktree + `node_modules` junction so the package
  builds/tests. After all runs: restore each borrowed repo to a clean `git status` and remove any
  worktrees.

### Book-authenticity grading pipeline (SPEC req 3) -- DST-04
- **D-05 [grading posture]:** Book mechanics ground truth AND the pass/partial/fail fidelity verdict
  are OWNED by the `oracle` agent (DST-04: main context NEVER reads `.oracle/` prose; verdict in the
  agent's own words). The applied diff is OUR generated output (not book prose), so main context MAY
  read each run's `diff.patch` + `answer.md` and normalize it into a per-claim list (named refactoring
  + book + file/symbol + a functional description of the change). Each claim is packaged to `oracle`,
  which establishes the relevant book's mechanics from `.oracle/` and returns a pass/partial/fail
  verdict in its own words. `oracle-reviewer` is usable ONLY if the per-claim list is first drafted as
  a document (its contract gates drafted lz-refactor docs, not raw transcripts) -- prefer `oracle` for
  raw-diff grading (SPEC constraint).
- **D-06 [grading unit]:** Sweep runs (`p8`, `gr4`) = EVERY applied refactoring in the run is a
  separate claim (multi-file, multi-refactoring); single-target runs (`p1`, `p2`, `gr1`) = the ONE
  applied move per run. Each fidelity record names the book + refactoring and carries a
  pass/partial/fail verdict (SPEC req 3 acceptance).

### Correctness grading (SPEC req 4) -- independent behavior oracle
- **D-07:** Correctness has two scored sub-parts per run per arm: (a) named refactoring at the right
  LAYER is correct (Fowler mechanical / Kerievsky pattern-directed / functional) -- graded from the
  diff against each target's `expected_family` + `judgment` in `targets.json`; (b) behavior-preserving
  -- verified INDEPENDENTLY by re-applying the persisted `diff.patch` to a fresh throwaway checkout and
  running the repo's ORIGINAL tests against the EDITED source (the behavior oracle, Phase-12 D-14
  posture), NOT trusting the in-session self-reported test run. nx `p8`: `@nx/eslint-plugin` jest;
  kata `gr1`/`gr4`: the TypeScript approval / golden-master suite. Record name/layer-correct y/n +
  target-tests-green y/n per run per arm.

### Comparison record + verdict (SPEC req 5)
- **D-08:** `13-RESULTS.md` (in the phase dir) tabulates `with_skill`/`invoke_skill` vs `no_skill` per
  cell for BOTH dimensions (book-authenticity fidelity + correctness), with per-cell scores and Pass@k
  where run counts allow. The verdict is framed as an EMPIRICAL finding (parity, or a delta with
  magnitude and direction), NEVER a pre-assumed skill win. Reuse the `EVAL-RESULTS.md` /
  `E2E-RESULTS.md` format conventions already in the workspace.

### Execution gate (HARD -- build in-plan, halt before every metered run)
- **D-09 [HARD GATE]:** Every apply re-run and backfill spends metered `claude -p` (nx `p8` ~13
  min/run; roughly 12 sweep + 9 single-target backfill sessions => multi-hour spend). Per the standing
  eval-run-approval gate + SPEC constraint, the plan BUILDS all run commands + grading scaffolding but
  MUST HALT for explicit user approval before executing ANY run -- no self-approval, even in this
  autonomous pass. Grading (oracle agent calls, on the Claude plan, not a separate metered pool) runs
  only AFTER the graded diffs exist. `--chain` may auto-advance discuss -> plan; execution stops at
  this gate. (See [[eval-run-approval-gate]].)

### Claude's Discretion
- Exact `run-e2e.mjs` invocation batching (per-prompt vs `--arm both`), and whether the nx and kata
  backfill/sweep runs share one plan or split by repo.
- Grading efficiency: MAY fetch reusable per-(book, named-refactoring) mechanics ground truth once and
  reuse it across runs applying the same refactoring, PROVIDED the per-claim VERDICT stays oracle-owned
  and in the agent's own words.
- Exact `13-RESULTS.md` table shape and whether book-authenticity + correctness share one table or two.
- Whether to add an unbiased from-scratch grading reviewer (recommended per
  [[unbiased-review-beats-primed]] to catch grader bias) and whether a small normalization helper is
  written if manual diff reads prove noisy.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Locked requirements (PRIMARY)
- `.planning/phases/13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness/13-SPEC.md` --
  6 locked requirements, boundaries, constraints, acceptance criteria. MUST read before planning.
- `.planning/ROADMAP.md` -> "Phase 13: lz-refactor vs base Opus eval: book authenticity &
  correctness" -- goal + the backfill-reality note (what is persisted vs must re-run).
- `.planning/REQUIREMENTS.md` -- milestone requirements + Out of Scope framing.

### Grading agents (DST-04 -- the ONLY channel to `.oracle/` book text)
- `.claude/agents/oracle.md` (or the installed `oracle` agent definition) -- open-ended book
  ground truth; returns facts in its own words, never source prose. Primary grading agent (D-05).
- `.claude/agents/oracle-reviewer.md` -- gates a DRAFTED per-claim doc; usable only on a normalized
  claim list, not raw transcripts (D-05).

### e2e apply harness + config (reuse as-is -- SPEC req 1-2, D-03/D-04)
- `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` -- the apply/arm/persist runner (also the
  gilded-rose runner via `--suite`); `--arm no_skill|both`, `--mode apply`, diff+meta persistence.
- `.claude/skills/lz-refactor-workspace/e2e-nx/{suite.json,targets.json,prompts/}` -- nx suite;
  `p8` = `pkgsweep`, `p1`/`p2` single-target; `targets.json` `expected_family`+`judgment` =
  correctness ground truth (D-07).
- `.claude/skills/lz-refactor-workspace/e2e-gilded-rose/{suite.json,targets.json,prompts/}` -- kata
  suite; `gr4` = `projsweep`, `gr1` single-target; repo `.../GildedRose-Refactoring-Kata/TypeScript`.
- `.claude/skills/lz-refactor-workspace/e2e-nx/results/apply/` and
  `.claude/skills/lz-refactor-workspace/e2e-gilded-rose/results/apply/` -- the persisted skill-arm
  diffs to REUSE (nx `with_skill` p1/p2/p8; kata `with_skill`+`invoke_skill` gr1).

### Results-format precedent
- `.claude/skills/lz-refactor-workspace/EVAL-RESULTS.md`,
  `.claude/skills/lz-refactor-workspace/e2e-nx/E2E-RESULTS.md`,
  `.claude/skills/lz-refactor-workspace/e2e-gilded-rose/GR-RESULTS.md`,
  `.claude/skills/lz-refactor-workspace/E2E-FINDINGS.md` -- table + Pass@k conventions and the
  prior finding (base Opus 4.8 @ high is catalog-grade on plain mechanical work; the skill's edge is
  pattern-directed / de-patterning / seam) that the verdict must confirm or refute, not assume.

### Prior-phase methodology this phase inherits
- `.planning/phases/11-skill-effectiveness-evals/11-CONTEXT.md` -- native harness reuse, Pass@k/Pass^k
  discipline, wait-for-all-notifications, unbiased-reviewer, the D-10 build-then-halt eval gate.
- `.planning/phases/12-autonomous-multi-round-refactoring-for-whole-package-sweeps/12-CONTEXT.md` --
  D-14 behavior-oracle posture (run ORIGINAL tests against EDITED source), the sweep e2e mechanics,
  and the D-18 metered-spend gate.

### Project constraints
- `CLAUDE.md` + `AGENTS.md` -- DST-04 clean-room grading (main context never reads `.oracle/` prose;
  verdicts in agent's own words); ASCII-only committed output (`->`, straight quotes, no
  emojis/em-dashes); public-repo hygiene (only the approved public gmail may appear; work
  email/domain never committed; allowlist-inversion detection; committer identity = approved gmail);
  `git grep`/`rg` for search; npm default; NEVER run evals without explicit approval (D-09);
  compute + report Pass@k / Pass^k; include >=1 unbiased reviewer.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `run-e2e.mjs` already does everything the backfill + sweep re-runs need: the `no_skill` arm, the
  `apply` mode, throwaway-branch safety (refuses protected branches; requires `--cwd`), and per-run
  `diff.patch` + `meta.json` capture into the tracked workspace tree. No harness code to write.
- Persisted skill-arm apply diffs already exist (nx `with_skill` p1/p2/p3/p4/p8; kata
  `with_skill`+`invoke_skill` gr1) -- reuse the single-target ones directly (D-01); the sweep ones
  are absent for BOTH arms and must be regenerated (D-02).
- `targets.json` in both suites carries per-target `expected_family` + `judgment` = ready-made
  correctness ground truth (right named refactoring / right layer) for D-07 grading.
- Both borrowed repos are on disk (nx `D:/projects/github/nrwl/nx` @ `origin/23.0.x`; kata
  `D:/projects/github/emilybache/GildedRose-Refactoring-Kata/TypeScript` @ `main`).

### Established Patterns
- Eval material lives under `.claude/skills/*-workspace/` (git-tracked record; bulky raw `outputs/`
  gitignored; PR-filtered off the shipped surface). `13-RESULTS.md` is the only artifact that lands
  in the phase dir under `.planning/`.
- Book-authenticity checks route through the `oracle`/`oracle-reviewer` agents, never author
  eyeballing; verdicts are the agent's own words (DST-04); committed output is ASCII-only.
- Behavior-preservation is proven by running the ORIGINAL tests against the EDITED source (Phase-12
  behavior oracle), not by trusting an in-session self-reported test run.

### Integration Points
- Apply runs consume the shipped skill by path (`plugins/lz-tdd/skills/lz-refactor/`) via
  `--plugin-dir` (with_skill/invoke_skill) or omit it (no_skill baseline); the ONLY A/B difference is
  the plugin's presence. Runs use `claude-opus-4-8` @ `high`, `--setting-sources project`.
- This is the terminal measurement phase; after it, `/gsd-audit-milestone lz-tdd@0.0.2` then
  `/gsd-complete-milestone`. No phase depends on its output; it ships no skill change.

</code_context>

<specifics>
## Specific Ideas

- The sweep re-run (nx `p8` + kata `gr4`, both arms, k=3) is the single biggest metered-spend cell
  (nx p8 ~13 min/run observed in the reused with_skill run). It is also the highest-signal cell,
  because sweeps are where the skill's multi-round drive + de-patterning edge (if any) shows against
  a catalog-grade base.
- Comparability caveat: the reused single-target `with_skill`/`invoke_skill` diffs were generated
  under earlier shipped SKILL.md states; the `no_skill` backfill has no skill so version is moot for
  the base arm, but the with/without single-target delta should be read as skill-arm-at-capture-time
  vs base-now. The SWEEP cells re-run both arms fresh, so they carry no such caveat -- lean on the
  sweep pair for the headline verdict.
- The prior E2E finding (base Opus 4.8 @ high is already catalog-grade on plain mechanical Extract
  Function; the skill's realizable edge is pattern-directed / de-patterning / seam routing) is the
  hypothesis this phase tests on APPLIED output. A parity result on mechanical cells is the expected,
  publishable finding -- not a failure.

</specifics>

<deferred>
## Deferred Ideas

- Grading the `@nx/*` fleet (`p9`-`p13`) and `kata gr3` sweeps -- out of scope this phase (SPEC);
  the representative pair covers both repos and the prior finding is the sweep null-delta generalizes.
- Grading coach/recommend and reference/lookup run OUTPUT -- out of scope this phase (already
  characterized in Phases 11-12 + quick tasks); this phase grades APPLIED output only.
- Turning the apply-fidelity grading into a standing CI/regression gate -- future; this is a one-time
  with/without measurement, same posture as Phases 5, 11, 12.
- Any tuning of the shipped skill on a surfaced defect -- explicitly out of scope; a defect feeds a
  separate, gated D-08-style tuning decision in a future phase/milestone, never an in-phase edit.

None -- discussion stayed within phase scope.

</deferred>

---

*Phase: 13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness*
*Context gathered: 2026-07-15*
