# Phase 13: lz-refactor vs base Opus eval -- book authenticity & correctness - Research

**Researched:** 2026-07-15
**Domain:** Empirical eval mechanics (grading applied refactoring diffs vs source books; independent behavior verification; with/without measurement)
**Confidence:** HIGH (all mechanics verified against on-disk artifacts; no external libraries; the one material gap is a disk-vs-SPEC discrepancy flagged as an open question)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Single-target cells (nx `p1`, `p2`; kata `gr1`): REUSE the already-persisted skill-arm apply diffs (nx = `with_skill`; kata = `with_skill` + `invoke_skill`); BACKFILL only the `no_skill` base arm (k=3) on the same targets/prompts. Prompts + targets already exist -- no authoring.
- **D-02:** Sweep cells (nx `p8` target `pkgsweep`; kata `gr4` target `projsweep`): re-run BOTH arms (`with_skill` + `no_skill`, k=3 each) from scratch -- no sweep applied diffs were persisted for either arm. Both prompts already exist. (NOTE: research found nx `p8` `with_skill` diffs DO exist on disk, committed, fresh 2026-07-14 -- see Open Question OQ-1.)
- **D-03:** Reuse `run-e2e.mjs` end-to-end (accepts `--arm no_skill|with_skill|invoke_skill|both|all`; `--mode apply` on a `--cwd` throwaway checkout; persists `diff.patch` + `meta.json` per run into the TRACKED workspace tree before resetting the borrowed repo). No new harness code.
- **D-04:** Diffs are captured into the WORKSPACE (outside the borrowed repo) before `reset --hard <applyBase>` + `clean -fd`, so they survive restoring the borrowed repos pristine. Apply runs execute on a THROWAWAY branch/worktree (runner refuses protected branches `23.0.x`/`main`/`master`, requires `--cwd`); nx sweeps may reuse the git worktree + `node_modules` junction. After all runs: restore each borrowed repo to clean `git status` and remove worktrees.
- **D-05 [grading posture]:** Book mechanics ground truth AND the pass/partial/fail fidelity verdict are OWNED by the `oracle` agent (DST-04: main context NEVER reads `.oracle/` prose; verdict in the agent's own words). Main context MAY read each run's `diff.patch` + `answer.md` (our generated output) and normalize into a per-claim list (named refactoring + book + file/symbol + functional description). Each claim is packaged to `oracle`, which establishes the book mechanics from `.oracle/` and returns a pass/partial/fail verdict in its own words. `oracle-reviewer` is usable ONLY if the per-claim list is first drafted as a document -- prefer `oracle` for raw-diff grading.
- **D-06 [grading unit]:** Sweep runs (`p8`, `gr4`) = EVERY applied refactoring in the run is a separate claim; single-target runs (`p1`, `p2`, `gr1`) = the ONE applied move. Each fidelity record names the book + refactoring + a pass/partial/fail verdict.
- **D-07:** Correctness has two scored sub-parts per run per arm: (a) named refactoring at the right LAYER is correct (Fowler mechanical / Kerievsky pattern-directed / functional) -- graded from the diff against each target's `expected_family` + `judgment` in `targets.json`; (b) behavior-preserving -- verified INDEPENDENTLY by re-applying the persisted `diff.patch` to a fresh throwaway checkout and running the repo's ORIGINAL tests against the EDITED source (Phase-12 D-14 behavior oracle), NOT trusting the in-session self-reported test run. nx `p8`: `@nx/eslint-plugin` jest; kata `gr1`/`gr4`: the TypeScript approval/golden-master suite. Record name/layer-correct y/n + target-tests-green y/n per run per arm.
- **D-08:** `13-RESULTS.md` tabulates `with_skill`/`invoke_skill` vs `no_skill` per cell for BOTH dimensions, with per-cell scores and Pass@k where run counts allow. The verdict is an EMPIRICAL finding (parity, or a delta with magnitude and direction), NEVER a pre-assumed skill win. Reuse the `EVAL-RESULTS.md` / `E2E-RESULTS.md` format conventions.
- **D-09 [HARD GATE]:** Every apply re-run and backfill spends metered `claude -p`. The plan BUILDS all run commands + grading scaffolding but MUST HALT for explicit user approval before executing ANY run -- no self-approval, even in this autonomous pass. Grading (oracle agent calls, on the Claude plan) runs only AFTER the graded diffs exist. `--chain` may auto-advance discuss -> plan; execution stops at this gate.

### Claude's Discretion

- Exact `run-e2e.mjs` invocation batching (per-prompt vs `--arm both`), and whether the nx and kata backfill/sweep runs share one plan or split by repo.
- Grading efficiency: MAY fetch reusable per-(book, named-refactoring) mechanics ground truth once and reuse it across runs applying the same refactoring, PROVIDED the per-claim VERDICT stays oracle-owned and in the agent's own words.
- Exact `13-RESULTS.md` table shape and whether book-authenticity + correctness share one table or two.
- Whether to add an unbiased from-scratch grading reviewer (recommended per unbiased-review-beats-primed) and whether a small normalization helper is written if manual diff reads prove noisy.

### Deferred Ideas (OUT OF SCOPE)

- Grading the `@nx/*` fleet (`p9`-`p13`) and `kata gr3` sweeps -- out of scope this phase; the representative pair covers both repos.
- Grading coach/recommend and reference/lookup run OUTPUT -- out of scope; this phase grades APPLIED output only.
- Turning apply-fidelity grading into a standing CI/regression gate -- future.
- Any tuning of the shipped skill on a surfaced defect -- explicitly out of scope; a defect feeds a separate, gated tuning decision in a future phase, never an in-phase edit.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description (from 13-SPEC.md) | Research Support |
|----|-------------------------------|------------------|
| REQ-1 | `no_skill` single-target apply backfill (nx `p1`, `p2`, kata `gr1`, k=3) | Exact `run-e2e.mjs` invocations in Code Examples; throwaway-branch setup verified; kata must leave `main` first (protected). Acceptance allows an explicit no-edit `meta.json` -- p2 `with_skill` already shows this pattern (run-3..8 are 0-byte declines). |
| REQ-2 | Sweep pair both-arm re-run with retained diffs (`nx p8`, `kata gr4`, k=3) | Runner persists diffs into the tracked workspace before repo reset (verified). **Disk reality: nx `p8` `with_skill` k=3 already persisted + committed (fresh 2026-07-14); kata `gr4` absent both arms.** See OQ-1. Net new runs if p8 `with_skill` reused: p8 `no_skill` (3) + gr4 both (6) = 9. If D-02 honored literally: 12. |
| REQ-3 | Book-authenticity grading via oracle ground truth (every applied refactoring, pass/partial/fail, agent's own words) | Grading pipeline in Architecture Patterns; `oracle` input contract read from `.claude/agents/oracle.md`; claim-extraction reads `diff.patch` + `answer.md` (p8 `answer.md` already reads like a claim list -- 5 numbered Extract Functions with file/symbol/description). |
| REQ-4 | Correctness grading differenced vs base (name/layer + behavior-preserving, both arms) | (a) layer from `targets.json` `expected_family`/`judgment`; sweep cells have NO `pkgsweep`/`projsweep` entry -> use the constituent per-target judgments (Pitfall 6). (b) behavior oracle commands in Code Examples; nx differential-failure method (15 pre-existing failures); kata `--ci` snapshot golden master seeded from pristine. |
| REQ-5 | With/without comparison record + verdict (`13-RESULTS.md`, both dimensions, empirical) | Table skeleton in Code Examples; Pass@k/Pass^k formulas already in `run-e2e.mjs` (reusable); prior finding (base is catalog-grade on mechanical; skill edge is pattern-directed/de-patterning/seam) is the hypothesis to confirm or refute. |
| REQ-6 | Clean-room + hygiene + repo restoration | DST-04: main context never reads `.oracle/`; only the `oracle`/`oracle-reviewer` agents touch it. ASCII-only committed output; committer = approved gmail. Repo restoration mechanics in Runtime State / Repo Isolation. |
</phase_requirements>

## Summary

This is a measurement-only, terminal-milestone phase that grades the APPLIED output of `lz-refactor` drive/apply runs against base Opus 4.8 @ high, on two dimensions: book authenticity (did the applied diff realize the named refactoring per the `.oracle/` book's mechanics?) and correctness (right named refactoring at the right layer + behavior-preserving). It ships no skill change. Nearly all machinery already exists: `run-e2e.mjs` runs the arms and persists diffs, the `oracle` agent owns book ground truth under DST-04, `targets.json` carries the correctness layer ground truth, and the Pass@k/Pass^k math is already implemented in the runner. The phase's real work is (1) generating the small set of missing run arms, (2) building the diff-to-claim-to-oracle grading pipeline, (3) independently re-verifying behavior preservation, and (4) tabulating the head-to-head with an honest verdict.

The single most important research finding is a disk-vs-SPEC discrepancy: **nx `p8` `with_skill` sweep diffs already exist, are git-committed, are k=3, and were captured 2026-07-14 on the current HEAD** -- contradicting D-02/REQ-2's "no sweep diffs were persisted for either arm." kata `gr4` is genuinely absent for both arms. So the true missing-run set is p8 `no_skill` (3) + gr4 both arms (6) = 9 metered runs, not 12. Reusing the fresh committed p8 `with_skill` is defensible (captured on the same shipped skill, current HEAD, via the persisting harness) and saves ~40 minutes, but it deviates from a locked decision, so it is a user call at the D-09 gate (OQ-1).

The two behavior-oracle traps are load-bearing and both are verified: nx `@nx/eslint-plugin` has 15 pre-existing test failures on this arm64 Windows box (a native-binding import error), so behavior-preservation must be a DIFFERENTIAL check (no NEW failures vs a recorded baseline), never "all green"; and the kata golden master uses jest/vitest `toMatchSnapshot()` with NO snapshot recorded on disk, so the snapshot must be seeded from PRISTINE `main` and re-checked with jest `--ci` (which refuses to write a new snapshot), or a run trivially "passes" against a snapshot of its own edited behavior.

**Primary recommendation:** Reuse `run-e2e.mjs` as-is for the 9 missing runs (dry-run first, halt at D-09); build a diff -> per-claim -> `oracle` grading pipeline that reads only our own `diff.patch`/`answer.md`; verify behavior INDEPENDENTLY with the differential-nx and pristine-seeded-kata methods below; tabulate both dimensions with Pass@k per cell and frame the verdict as an empirical finding. Present OQ-1 (reuse p8 `with_skill` vs re-run) to the user at the D-09 gate.

## Architectural Responsibility Map

The "tiers" here are the stages of the grading pipeline, not application layers. Assigning each capability to the correct tier is what keeps DST-04 intact (only the oracle tier touches book prose) and keeps behavior verification independent (a separate tier from the run that produced the diff).

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Generate missing run arms (apply diffs) | Run/harness tier (`run-e2e.mjs` + `claude -p`) | -- | The runner owns arm selection, throwaway-branch safety, and diff+meta capture. Metered -- gated by D-09. |
| Persist diffs so they survive repo restore | Run/harness tier (git add -A; diff --cached; write into workspace) | -- | Already implemented; the reason D-04 works. |
| Extract per-claim list from a diff | Normalization tier (main context) | small helper (discretion) | Reads OUR output (`diff.patch`, `answer.md`) only -- never `.oracle/`. Permitted by DST-04. |
| Establish book mechanics + fidelity verdict | Oracle tier (`oracle` agent, isolated) | `oracle-reviewer` (only on a drafted doc) | ONLY channel to `.oracle/` prose; verdict in agent's own words. DST-04 firewall. |
| Layer/name correctness | Normalization tier (main context vs `targets.json`) | -- | `targets.json` is our own repo file (not copyrighted); layer judgment is factual mapping. |
| Behavior preservation | Behavior-oracle tier (fresh checkout + ORIGINAL tests) | -- | MUST be independent of the run that produced the diff (D-07/Phase-12 D-14). |
| Tabulate + verdict | Reporting tier (`13-RESULTS.md`) | -- | ASCII-only, empirical framing, Pass@k. |
| Repo restoration + hygiene scan | Cleanup tier | -- | Borrowed repos pristine; no `.oracle/` prose or work email in committed artifacts. |

## Standard Stack

No external packages are installed by this phase. The "stack" is the existing eval rig plus repo-native test runners.

### Core
| Tool | Version | Purpose | Why Standard |
|------|---------|---------|--------------|
| `run-e2e.mjs` | in-repo (`e2e-nx/`, drives both suites via `--suite`) | Runs arms, applies on throwaway branch, persists `diff.patch`+`meta.json`, computes Pass@k | The locked harness (D-03); already supports every arm/mode this phase needs [VERIFIED: read source] |
| `oracle` agent | `.claude/agents/oracle.md` | Open-ended book ground truth + pass/partial/fail fidelity verdict, own words | The DST-04 channel to `.oracle/` (D-05) [VERIFIED: read agent def] |
| `oracle-reviewer` agent | `.claude/agents/oracle-reviewer.md` | Gates a DRAFTED per-claim doc against a book | Usable only on a normalized claim doc, not raw transcripts (D-05) [VERIFIED: read agent def] |
| `claude` CLI | claude-opus-4-8 @ high | The graded model, both arms (`--plugin-dir` = with_skill; omit = no_skill) | Matches prior eval config for comparability (SPEC constraint) [CITED: 13-SPEC.md] |
| git (2.54+) | system | Throwaway branches, diff capture, `git apply` for the behavior oracle, restoration | Repo isolation + independent re-apply [VERIFIED: repo state] |

### Supporting (repo-native test runners for the behavior oracle)
| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| nx / jest (`nx test eslint-plugin`) | nx 23.0.x, node_modules present | Run `@nx/eslint-plugin` suite against edited source | nx `p8` behavior oracle (differential; see Pitfall 2) [VERIFIED: repo has node_modules; project.json] |
| jest (`test:jest` -> `jest`) | jest ^29.4.3 (kata devDeps) | Run kata approval/golden-master suite | kata `gr1`/`gr4` behavior oracle; use `--ci` (see Pitfall 3) [VERIFIED: package.json] |
| vitest (`test:vitest`) | vitest 0.28.x (kata devDeps) | Alternative kata approval runner | Only if jest path fails; pick ONE and be consistent (OQ-2) [VERIFIED: package.json] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `oracle` on raw diff | `oracle-reviewer` on a drafted claim doc | oracle-reviewer gives a stricter structured pass/revise/blocked gate but requires first authoring a per-claim Markdown doc; D-05 prefers `oracle` for raw-diff grading. Reserve oracle-reviewer for an optional unbiased second pass on a drafted claim list. |
| kata jest `--ci` | vitest snapshot | Both have `approvals.spec.ts`; jest `--ci` gives the cleanest "refuse to write, fail on mismatch" golden-master guard. |
| Sequential behavior-oracle re-apply on the main clone | git worktree + node_modules junction | Sequential is simplest (node_modules already present); worktree+junction (prior art) only needed for parallelism/isolation. |

**Installation:** none. `pip install slopcheck` and package-registry checks are N/A -- this phase installs no external packages.

## Package Legitimacy Audit

**N/A -- this phase installs no external packages.** All tooling is in-repo (`run-e2e.mjs`, the oracle agents) or already present in the borrowed repos' `node_modules` (nx 23.0.x, jest, vitest). No `npm install` / `pip install` runs. slopcheck and registry verification are not applicable.

## Architecture Patterns

### System Architecture Diagram (the grading pipeline, per graded run)

```
                         [D-09 HARD GATE: halt for user approval before ANY metered run]
                                              |
  prompt (pN / grN) --> run-e2e.mjs --mode apply --arm <arm> --cwd <throwaway branch>
                                              |
                        (reset --hard base; clean -fd; claude -p runs; git add -A; diff --cached base)
                                              |
                                              v
             PERSISTED (tracked, survives repo restore):  results/apply/<arm>/<pN>/run-<k>/
                                              |
              +-------------------------------+-------------------------------+
              |                               |                               |
              v                               v                               v
        diff.patch                        answer.md                       meta.json
              |                               |                          (changed_files,
              +---------------+---------------+                           used_refactor, exit_code)
                              |
                              v
   NORMALIZATION TIER (main context; reads OUR output only, NEVER .oracle/):
     per applied refactoring -> claim { book, named_refactoring, file/symbol, functional description }
     (sweep: N claims per run; single-target: 1 claim per run)
                              |
             +----------------+-----------------------------+
             |                                              |
             v                                              v
   BOOK-AUTHENTICITY (REQ-3)                        CORRECTNESS (REQ-4)
     package claim -> oracle agent                    (a) name/layer:  claim vs targets.json
       (question + ONE .oracle/<book>/index.md)            expected_family + judgment  (main ctx)
     oracle reads book mechanics, judges              (b) behavior:  BEHAVIOR-ORACLE TIER
     -> pass | partial | fail  (own words)                 fresh checkout -> git apply diff.patch
             |                                              -> run ORIGINAL tests on EDITED source
             |                                              -> nx: differential vs 15-fail baseline
             |                                              -> kata: jest --ci vs pristine-seeded snap
             +----------------------+-----------------------+
                                    |
                                    v
                   REPORTING TIER:  13-RESULTS.md  (with/without per cell, both dimensions,
                                    Pass@k / Pass^k, empirical verdict; ASCII-only)
                                    |
                                    v
                   CLEANUP: restore borrowed repos pristine; remove worktrees;
                            hygiene scan (no .oracle prose, no work email, ASCII-only)
```

### Recommended artifact layout
```
.claude/skills/lz-refactor-workspace/
  e2e-nx/results/apply/
    with_skill/{p1,p2,p8}/run-{1..3}/{diff.patch,answer.md,meta.json}   # p1,p2,p8 EXIST (reuse)
    no_skill/{p1,p2,p8}/run-{1..3}/...                                   # BACKFILL / RE-RUN (missing)
  e2e-gilded-rose/results/apply/
    with_skill/gr1/run-{1..3}/...          invoke_skill/gr1/run-{1..3}/...   # gr1 EXISTS (reuse)
    with_skill/gr4/run-{1..3}/...          no_skill/{gr1,gr4}/run-{1..3}/...  # gr4 both + gr1 no_skill MISSING
  (grading records: keep in the workspace or the phase dir per discretion; ASCII-only)
.planning/phases/13-.../13-RESULTS.md      # the ONLY artifact under .planning (D-08)
```

### Pattern 1: Diff -> per-claim normalization (the input to the oracle)
**What:** For each persisted run, read `diff.patch` + `answer.md` and produce a per-claim list. The model's `answer.md` already summarizes what it did in claim-like form.
**When to use:** Every graded run (sweep = N claims; single-target = 1).
**Example (verbatim shape of a real p8 `with_skill` run-1 answer, ASCII-normalized):**
```
# from results/apply/with_skill/p8/run-1/answer.md -- reads as a ready-made claim list:
1. Source-tag helpers (runtime-lint-utils.ts) -> Extract Function; dedup a 5x expression   [book: Fowler]
2. findJsonPropertyByKey() (nx-plugin-checks.ts) -> Extract Function; collapse 11 copies     [book: Fowler]
3. getContextFileName() (runtime-lint-utils.ts) -> Extract Function; 8-site compat shim       [book: Fowler]
4. getImportMembers()+replaceWithGroupedImports() (enforce-module-boundaries.ts) -> Extract Function
5. parseSourceFile()+findIdentifierNodes() (ast-utils.ts) -> Extract Function; dedup 2x/3x
# each becomes: { book, named_refactoring, file/symbol, functional_change } -> one oracle claim
```

### Pattern 2: Packaging a claim to the `oracle` agent (DST-04)
**What:** One book per call. Hand the oracle the named refactoring + our functional description of what the diff did, and ask for a pass/partial/fail fidelity verdict in its own words.
**Input contract (from oracle.md):** a QUESTION/task + ONE book as an `.oracle/<book>/index.md` entry. Cross-book = fan-out (call once per book, merge).
**Book routing:** Fowler -> `.oracle/refactoring-2e/index.md`; Kerievsky -> `.oracle/refactoring-to-patterns/index.md`; GoF -> `.oracle/design-patterns/index.md` (all three present, each with `index.md`) [VERIFIED: ls .oracle].
**Efficiency lever (D discretion):** most sweep claims are the same refactoring (Extract Function). Batch same-(book, refactoring) claims into one oracle call ("here are N applied Extract Functions; for each, pass/partial/fail per the book mechanics") -- the oracle reads the chapter once and judges all N, and the per-claim VERDICT stays oracle-owned.

### Pattern 3: Independent behavior oracle (D-07 / Phase-12 D-14)
**What:** Never trust the in-session self-reported test run. Re-apply the persisted `diff.patch` to a FRESH throwaway checkout and run the repo's ORIGINAL, UNMODIFIED tests against the EDITED source.
**When to use:** Every graded run, both arms. See Code Examples for the exact nx (differential) and kata (`--ci` snapshot) commands.

### Anti-Patterns to Avoid
- **Reading `.oracle/` from main context.** Breaks DST-04. Only the oracle agents may. Normalize from `diff.patch`/`answer.md` (our own output) instead.
- **"All tests green" as the behavior gate on nx.** 15 tests fail at baseline -- use a differential check (Pitfall 2).
- **Generating the kata snapshot from edited source.** It passes trivially and proves nothing (Pitfall 3). Seed from pristine `main`; verify with `--ci`.
- **Assuming a pre-assumed skill win.** The prior finding is parity on mechanical work; the verdict must be an empirical finding (D-08).
- **Re-running p8 `with_skill` without checking disk.** It already exists, committed, fresh (OQ-1).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Run arms + capture diffs | A new runner or ad-hoc `claude -p` loop | `run-e2e.mjs` (D-03) | Already handles arm selection, throwaway-branch safety, idempotent resume, diff+meta capture into the tracked tree. Ad-hoc runs are exactly why the prior sweep diffs were lost. |
| Pass@k / Pass^k math | Hand-rolled combinatorics | `passAtK`/`passHatK` in `run-e2e.mjs` | Already implemented and tested (n=3, k in {1,3}). Reuse the functions or copy the formulas. |
| Book mechanics ground truth | Author reading the book | `oracle` agent | DST-04 firewall; the whole point of the isolated agent. |
| Kata golden master | A custom characterization harness | jest/vitest `toMatchSnapshot()` + `--ci` | The kata already ships `approvals.spec.ts`; seed once from pristine, `--ci` refuses to overwrite. |
| Diff isolation between k runs | Manual reset choreography | runner's `reset --hard base` + `clean -fd` per run (I1 guard) | Already aborts loudly on a failed reset so runs stay independent. |

**Key insight:** This phase is assembly, not construction. The expensive parts (harness, oracle firewall, Pass@k, snapshot golden master) already exist and are verified. New code should be limited to a thin diff-to-claim normalizer if manual reads prove noisy (discretion), plus the grading records and `13-RESULTS.md`.

## Runtime State / Repo Isolation & Restoration

Not a rename phase, but it DOES mutate borrowed-repo git state and generate untracked artifacts that must be restored (REQ-6). Current disk state verified 2026-07-15:

| Category | State found | Action required |
|----------|-------------|-----------------|
| nx borrowed repo | On branch `lz-refactor-e2e-smoke` (throwaway, not protected) with UNCOMMITTED edits in 3 eslint-plugin files; `node_modules` present; no worktrees | Runner's `reset --hard origin/23.0.x` + `clean -fd` wipes edits before each run; final cleanup must return to a clean `git status`. Safe to run apply here (branch is not protected). |
| kata borrowed repo | On branch `main` (PROTECTED); `node_modules` present; NO `__snapshots__/*.snap` on disk | MUST `git checkout -b <throwaway>` before any apply run (runner refuses `main`). Seed the golden-master snapshot from pristine main for the behavior oracle. Restore to `main`, clean, after. |
| Persisted skill-arm diffs (tracked) | nx `with_skill` p1/p2/p3/p4/p8 committed; kata `with_skill`+`invoke_skill` gr1 committed | Reuse in place -- they are the record and survive repo restore. |
| gr4 diffs | ABSENT on disk (RESULTS.md documents 2026-07-14 gr4 runs but diffs were never persisted) | Must re-run both arms (REQ-2). |
| `.oracle/` books | 3 present (Fowler / Kerievsky / GoF), each with `index.md`; git-ignored | Read only via the oracle agents; never copy prose into committed output. |
| Behavior-oracle throwaway checkouts / worktrees | none currently | Create for re-apply; remove after (`git worktree remove --force`), tear down any node_modules junction. |

**Canonical restoration check (REQ-6):** after the phase, `git status` in BOTH borrowed repos is clean (nx back to a clean tree; kata back on `main`); all throwaway worktrees removed; the persisted `diff.patch`/`meta.json` in THIS repo remain (they are the tracked record).

## Common Pitfalls

### Pitfall 1: nx p8 with_skill already exists -- do not blindly "re-run both arms from scratch"
**What goes wrong:** D-02/REQ-2 say no sweep diffs exist for either arm; a literal reading re-runs p8 `with_skill` (3 metered runs, ~40 min) that already exist committed on disk.
**Why it happens:** The SPEC/CONTEXT/ROADMAP "verified 2026-07-15" note missed the p8 `with_skill` re-run done during quick-260714-vmy (commit `4ef2dc6`, "p8 3/3 on HEAD"), which persisted + committed k=3 diffs dated 2026-07-14 23:xx.
**How to avoid:** Treat the true missing set as p8 `no_skill` (3) + gr4 both arms (6) = 9 runs. Surface the reuse-vs-re-run choice at the D-09 gate (OQ-1). kata gr4 IS genuinely absent for both arms -- re-run both there.
**Warning signs:** `results/apply/with_skill/p8/run-{1,2,3}/diff.patch` present and `git ls-files` shows them tracked (confirmed).

### Pitfall 2: nx behavior oracle -- 15 tests fail at baseline; "all green" is the wrong gate
**What goes wrong:** Grading behavior-preservation as "all tests pass" fails every nx run, because `@nx/eslint-plugin` has ~15 pre-existing failures on this arm64 Windows box (a `nx.win32-arm64-msvc.node` native-binding / `spyOn` import error in `dependency-checks.spec.ts`); jest fails the whole project when one spec's imports throw, masking the rest.
**Why it happens:** Environment, not the edit. The p8 `with_skill` answer.md records the stable baseline explicitly: "15 failed / 169 passed."
**How to avoid:** DIFFERENTIAL check. Record the baseline (`nx test eslint-plugin` on unedited source -> 15 failed / 169 passed) ONCE. For each edited-source run, behavior-preserved = no NEW failures beyond that baseline (same or fewer failures; the specs covering touched files still pass). Running the affected spec directly via raw jest is the prior-art workaround to sidestep the import-time crash.
**Warning signs:** A run reported "green" in-session but the whole-project `nx test` dies at import -- that is the pre-existing crash, not a regression.

### Pitfall 3: kata behavior oracle -- snapshot must be seeded from PRISTINE source
**What goes wrong:** `approvals.spec.ts` uses `toMatchSnapshot()` and NO `.snap` exists on disk. Running the approval test for the first time on EDITED source writes a snapshot of the edited behavior and passes trivially -- proving nothing.
**Why it happens:** Snapshot golden masters record on first run.
**How to avoid:** Seed the snapshot from PRISTINE `main` first (run the approval test on unedited source to write `__snapshots__/approvals.spec.ts.snap` = the golden master). Then, for each diff, `git apply` and re-run with jest `--ci` (CI mode refuses to write a new snapshot and FAILS on a missing/mismatched one). Reuse the SAME golden master across all runs and both arms. Ignore `test/jest/gilded-rose.spec.ts` -- it asserts `'fixme'` (a red placeholder), not behavior.
**Warning signs:** A "green" first run that just created a new `.snap`; a `.snap` file whose mtime is newer than the diff apply.

### Pitfall 4: DST-04 leak via main context reading `.oracle/`
**What goes wrong:** Normalizing claims by reading the book, or quoting book prose into `13-RESULTS.md` / grading records, leaks copyrighted expression.
**How to avoid:** Main context reads ONLY our own `diff.patch`/`answer.md`/`targets.json`. All book mechanics + verdicts come from the `oracle` agent in its own words. The oracle NEVER returns source prose or paths (functional names only).
**Warning signs:** A grading record that quotes a book definition, a chapter title, or a `.oracle/` path.

### Pitfall 5: ASCII + PII hygiene in committed output
**What goes wrong:** Reused transcript artifacts (`answer.md`) contain em-dashes and curly quotes (e.g. the p8 answer uses U+2014); copying those verbatim into `13-RESULTS.md` violates the ASCII-only rule. A work-email leak violates public-repo hygiene.
**How to avoid:** `13-RESULTS.md` and any grading record we author are ASCII-only (`->`, straight quotes, no emojis/em-dashes/box-drawing). When quoting a model claim or oracle verdict, normalize punctuation to ASCII. Verify committer identity = approved public gmail; run an allowlist-inversion email scan before committing (assert the only email-shaped token is the approved gmail); never write the work email/domain as a search needle.
**Warning signs:** `rg` for non-ASCII in the new artifacts returns hits; a git author/committer email that is not the approved gmail.

### Pitfall 6: sweep correctness ground truth is NOT in targets.json
**What goes wrong:** Looking up `targets.json` for `pkgsweep` (p8) or `projsweep` (gr4) returns nothing -- neither has a target entry.
**Why it happens:** The sweep prompts are whole-package/whole-project ("Identify the code smells in the `@nx/eslint-plugin` package and refactor them away"). The sweep is the union of many refactorings, not one target.
**How to avoid:** For sweep name/layer correctness, judge each applied refactoring against the closest constituent target judgment: nx `p8` -> the `@nx/eslint-plugin` targets T1-T4 + `p7sweep` (all `packages/eslint-plugin/...`); kata `gr4` -> the `G1`/`G1sweep` updateQuality judgments. The overarching expectation: behavior-preserving Fowler/functional moves; DECLINE speculative patterns (the sweep judgments encode the exported-signature PAUSE trap and the "no premature class/Strategy" rule).
**Warning signs:** A plan task that reads `targets.json["pkgsweep"]`.

### Pitfall 7: the grep tool ban / Windows arm64
**What goes wrong:** Using the Grep tool or `grep` returns silent zero results (vendored rg argv[0] bug) or is slow.
**How to avoid:** `git grep` for tracked files; `rg` for gitignored (`.oracle/`, `node_modules/`, `outputs/`) with `-uu`. Never the Grep tool.

### Pitfall 8: p2 single-target has only 2 non-empty with_skill diffs
**What goes wrong:** Expecting 3 gradeable with_skill diffs for p2; run-3..8 are 0-byte (the documented "fired but 0 edits" decline).
**How to avoid:** For p2 `with_skill`, k=3 = run-1 (edit), run-2 (edit), run-3 (explicit no-edit -- valid per REQ-1 acceptance, graded as "no refactoring applied" = N/A book-fidelity, a correctness data point of declining to act). The `no_skill` backfill runs its own k=3.

## Code Examples

Verified invocations. **Do NOT execute any `claude -p` run before the D-09 user-approval gate. `--dry-run` first (spends nothing).**

### REQ-1/REQ-2: generate the missing run arms (run-e2e.mjs)
```bash
# ALWAYS dry-run first (prints composed prompts + commands, spends nothing):
node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs --dry-run \
  --mode apply --arm no_skill --prompt p1 --prompt p2 --runs 3 \
  --cwd D:/projects/github/nrwl/nx

# --- nx single-target no_skill backfill (REQ-1); nx clone is on throwaway branch lz-refactor-e2e-smoke ---
node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs \
  --mode apply --arm no_skill --prompt p1 --prompt p2 --runs 3 \
  --cwd D:/projects/github/nrwl/nx

# --- nx p8 sweep: no_skill only if reusing the committed with_skill (OQ-1), else --arm both ---
node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs \
  --mode apply --arm no_skill --prompt p8 --runs 3 \
  --cwd D:/projects/github/nrwl/nx            # ~13 min/run; the biggest cell

# --- kata: MUST leave protected main first ---
#   cd D:/projects/github/emilybache/GildedRose-Refactoring-Kata && git checkout -b lz13-kata-apply
# gr1 no_skill backfill (REQ-1) + gr4 both arms (REQ-2), via --suite:
node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs \
  --suite D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/.claude/skills/lz-refactor-workspace/e2e-gilded-rose \
  --mode apply --arm no_skill --prompt gr1 --runs 3 \
  --cwd D:/projects/github/emilybache/GildedRose-Refactoring-Kata/TypeScript

node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs \
  --suite D:/projects/github/LayZeeDK/lz-engineering-claude-plugins/.claude/skills/lz-refactor-workspace/e2e-gilded-rose \
  --mode apply --arm both --prompt gr4 --runs 3 \
  --cwd D:/projects/github/emilybache/GildedRose-Refactoring-Kata/TypeScript
```
Notes: `--arm both` = `with_skill` + `no_skill`; runner is idempotent (completed exit-0 runs skip unless `--force`); each run resets `--cwd` to `applyBase` (`origin/23.0.x` for nx, `main` for kata) before running, and captures the diff into the tracked workspace before the next reset.

### REQ-4(b): nx behavior oracle -- differential (independent of the run)
```bash
# On a throwaway branch of the nx clone (node_modules present):
cd D:/projects/github/nrwl/nx
git reset --hard origin/23.0.x && git clean -fd
npx nx test eslint-plugin  2>&1 | rg -N 'Tests:|failed|passed'   # BASELINE once -> expect ~15 failed / 169 passed

# For each persisted diff (any arm/run):
git reset --hard origin/23.0.x && git clean -fd
git apply .../results/apply/<arm>/p8/run-<k>/diff.patch          # diff includes new files (captured via diff --cached)
npx nx test eslint-plugin  2>&1 | rg -N 'Tests:|failed|passed'   # PASS = no NEW failures vs the 15-fail baseline
git reset --hard origin/23.0.x && git clean -fd                 # restore for next run
```

### REQ-4(b): kata behavior oracle -- pristine-seeded snapshot with --ci
```bash
cd D:/projects/github/emilybache/GildedRose-Refactoring-Kata/TypeScript
git checkout lz13-kata-apply 2>/dev/null || git checkout -b lz13-kata-apply main
git reset --hard main && git clean -fd
npx jest test/jest/approvals.spec.ts                    # SEED golden master from PRISTINE main (writes __snapshots__)
cp -r test/jest/__snapshots__ /tmp/gr-golden            # keep the golden master aside

# For each persisted diff (with_skill / invoke_skill / no_skill, all runs):
git checkout -- app/gilded-rose.ts                      # revert prior edit (keep the seeded snapshot)
cp -r /tmp/gr-golden/* test/jest/__snapshots__/         # ensure golden master present
git apply .../results/apply/<arm>/gr4/run-<k>/diff.patch
npx jest --ci test/jest/approvals.spec.ts               # --ci: refuse to write, FAIL on mismatch -> PASS = behavior preserved
# ignore test/jest/gilded-rose.spec.ts (asserts 'fixme' placeholder, not behavior)
```

### REQ-3: package a claim to the oracle (conceptual -- via the Task/agent tool)
```
Invoke the `oracle` agent with:
  QUESTION: "An applied diff performs <named_refactoring> on <file>:<symbol>. The functional change:
             <our own-words description from diff.patch + answer.md>. Did this realize the named
             refactoring per the book's mechanics? Return pass|partial|fail in your own words + why."
  BOOK:     .oracle/refactoring-2e/index.md          # Fowler (or refactoring-to-patterns / design-patterns)
  OUTPUT:   JSON { answer, sources:["Ch.N (own-words topic)"], confidence, not_covered }
# Batch same-(book, refactoring) claims in one call for efficiency; verdict stays oracle-owned.
```

### REQ-5: 13-RESULTS.md table skeleton (ASCII-only, one table per dimension)
```
## Book authenticity (fidelity to book mechanics; pass/partial/fail per applied refactoring)
| cell | arm         | runs | claims | pass | partial | fail | pass@1 | pass@3 | pass^3 |
|------|-------------|------|--------|------|---------|------|--------|--------|--------|
| p1   | with_skill  | 3    | 3      | ...  | ...     | ...  | ...    | ...    | ...    |
| p1   | no_skill    | 3    | 3      | ...                                             |
| p8   | with_skill  | 3    | ~15    | ... (sweep: every applied refactoring is a claim) |
| p8   | no_skill    | 3    | ...    | ...                                             |
| gr4  | with_skill  | 3    | ...    | ...                                             |
| gr4  | no_skill    | 3    | ...    | ...                                             |

## Correctness (name/layer correct y/n ; behavior-preserving y/n -- independent oracle)
| cell | arm        | name/layer (k=3) | tests-green (k=3) | pass@1 | pass@3 |
|------|------------|------------------|-------------------|--------|--------|
| ...  | ...        | ...              | ...               | ...    | ...    |

Verdict: <empirical finding -- parity, or delta with magnitude + direction; NOT a pre-assumed win>
```

## State of the Art

| Old belief (SPEC/CONTEXT/ROADMAP) | Disk reality 2026-07-15 | Impact |
|-----------------------------------|-------------------------|--------|
| "no sweep applied diffs persisted for EITHER arm" | nx `p8` `with_skill` k=3 persisted + committed, fresh 2026-07-14 (commit `4ef2dc6`); kata `gr4` genuinely absent | True missing set = 9 runs (p8 no_skill 3 + gr4 both 6), not 12. See OQ-1. |
| (implicit) behavior gate = tests green | nx has 15 pre-existing failures; kata has no recorded snapshot | Behavior oracle must be differential (nx) / pristine-seeded `--ci` (kata). |
| (implicit) sweep correctness lives in targets.json | no `pkgsweep`/`projsweep` entry | Grade sweep name/layer against constituent per-target judgments. |

**Deprecated/outdated:** none technical -- these are stale planning facts, not deprecated tools.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Reusing the committed nx `p8` `with_skill` diffs (captured on current HEAD, same shipped skill) is comparable to a fresh re-run | OQ-1 / Pitfall 1 | If the shipped skill changed since 2026-07-14, the with/without p8 delta mixes skill versions. Mitigated: MEMORY confirms p8 was re-run "on HEAD" post-revert; the sweep carries no version caveat per the CONTEXT specifics. User decides at D-09. |
| A2 | `nx test eslint-plugin` reproduces the stable "15 failed / 169 passed" baseline on this box | Pitfall 2 | If the pre-existing failure set is unstable, the differential check is noisy -- fall back to running the affected specs directly via raw jest (prior-art workaround). |
| A3 | jest `--ci` on `approvals.spec.ts` is a sufficient kata golden master | Pitfall 3 / OQ-2 | If jest and vitest snapshots diverge, pick one runner and record which; the golden master must come from pristine main either way. |
| A4 | Sweep name/layer correctness can be judged against the constituent per-target judgments | Pitfall 6 | If a sweep applies a refactoring outside T1-T4/p7sweep (nx) or G1 (kata), grade it against the general expectation (behavior-preserving Fowler/functional; DECLINE speculative patterns). |
| A5 | Grading (oracle agent calls) runs on the Claude plan, not a separate metered pool, so only the `claude -p` apply runs are D-09-gated | D-09 / Summary | If oracle calls were metered separately, grading cost would need its own gate. CONTEXT D-09 states grading is on the plan; low risk. |

## Open Questions (RESOLVED)

1. **OQ-1: Reuse the committed nx `p8` `with_skill` diffs, or re-run per D-02?**
   - What we know: p8 `with_skill` k=3 diffs exist on disk, git-tracked, dated 2026-07-14, captured via the persisting harness on current HEAD (post-revert; same shipped skill). D-02 says re-run both arms from scratch.
   - What's unclear: whether the user wants strict D-02 consistency (re-run, +3 metered runs ~40 min) or the reuse optimization (backfill p8 `no_skill` only).
   - Recommendation: REUSE the committed p8 `with_skill` and backfill p8 `no_skill` only (defensible: same skill, current HEAD, harness-captured; the sweep carries no version caveat per CONTEXT specifics). kata `gr4` IS absent for both arms -- re-run both there regardless. Surface this explicitly at the D-09 gate; it is a user call.
   - RESOLVED (2026-07-15, discuss-phase OQ-1): user chose REUSE the committed p8 `with_skill`; backfill p8 `no_skill` only; re-run gr4 both arms. Locked in the amended D-02 (13-CONTEXT.md) and implemented by plan 13-02. Net-new = 18 metered runs.

2. **OQ-2: kata behavior-oracle runner -- jest or vitest?**
   - What we know: both `test:jest` and `test:vitest` exist and both have `approvals.spec.ts`; GR-RESULTS references vitest; no snapshot recorded on disk.
   - What's unclear: which the plan should standardize on.
   - Recommendation: jest with `--ci` (cleanest "refuse to write, fail on mismatch" golden-master guard). Pick ONE and record it; the pristine-seed requirement holds either way.
   - RESOLVED (planner, plans 13-01/13-04): jest `--ci` on `approvals.spec.ts`, snapshot seeded from pristine `main`.

3. **OQ-3: where do the per-claim grading records live?**
   - What we know: `13-RESULTS.md` is the only artifact mandated in the phase dir (D-08); the workspace holds the rest.
   - Recommendation: keep per-run/per-claim grading records in the workspace (e.g. alongside `results/apply/.../`), ASCII-only; summarize into `13-RESULTS.md`. Discretion.
   - RESOLVED (planner, plans 13-03/13-04/13-05): per-run/per-claim grading records live under the workspace `grading/` tree, ASCII-only; summarized into `13-RESULTS.md`.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `claude` CLI (opus-4-8 @ high) | REQ-1/2 apply runs | assumed yes (prior runs succeeded) | claude-opus-4-8 | none -- blocks metered runs |
| `run-e2e.mjs` | REQ-1/2 | yes | in-repo | none needed |
| `oracle`/`oracle-reviewer` agents | REQ-3 | yes | `.claude/agents/` | none needed |
| `.oracle/` books (Fowler/Kerievsky/GoF) | REQ-3 | yes (3, each with index.md) | git-ignored on disk | none -- blocks book grading |
| nx clone + node_modules | REQ-2/4 nx behavior oracle | yes (branch `lz-refactor-e2e-smoke`, node_modules present) | nx 23.0.x | none |
| kata clone + node_modules | REQ-1/2/4 kata behavior oracle | yes (branch `main`, node_modules present) | jest ^29.4.3 / vitest 0.28.x | none |
| git 2.54+ | throwaway branches, git apply, restoration | yes | system | none |

**Missing dependencies with no fallback:** none blocking -- all present. The only hard prerequisite is the D-09 user approval before spending metered runs.

## Validation Architecture

> nyquist_validation is `true` in `.planning/config.json` -- this section is mandatory.

### Test Framework
| Property | Value |
|----------|-------|
| Framework (behavior oracle, nx) | nx 23.0.x + jest (`nx test eslint-plugin`) -- node_modules present |
| Framework (behavior oracle, kata) | jest ^29.4.3 (`test/jest/approvals.spec.ts`, snapshot golden master); vitest 0.28.x alt |
| Config file (nx) | `packages/eslint-plugin/jest.config.cts` (preset `../../jest.preset.js`) |
| Config file (kata) | `package.json` scripts (`test:jest` -> `jest`); no jest.config committed at kata root |
| Quick run command (nx) | `npx nx test eslint-plugin` (or raw jest on affected specs) |
| Quick run command (kata) | `npx jest --ci test/jest/approvals.spec.ts` |
| Phase-artifact checks | disk-existence + oracle-verdict-presence + hygiene scan (this is an eval phase; "tests" are the acceptance checks below) |

### Phase Requirements -> Test/Check Map
| Req ID | Behavior | Check Type | Automated Command | Exists? |
|--------|----------|-----------|-------------------|---------|
| REQ-1 | no_skill single-target diffs exist (or explicit no-edit meta) | disk-artifact | `for p in p1 p2; do for k in 1 2 3; do test -f e2e-nx/results/apply/no_skill/$p/run-$k/meta.json && echo ok; done; done` (+ kata gr1) | needs runs |
| REQ-2 | sweep diffs persisted + survive repo restore | disk-artifact | `test -s e2e-nx/results/apply/no_skill/p8/run-1/diff.patch` (+ gr4 both arms); confirm still present after borrowed-repo `git status` clean | p8 with_skill EXISTS; rest needs runs |
| REQ-3 | every applied refactoring has an oracle fidelity verdict | verdict-presence | grading record lists {book, name, pass/partial/fail} per claim per graded run; assert every claim has a verdict | needs grading |
| REQ-4a | name/layer correct recorded both arms | record-presence | correctness record has name/layer y/n per run per arm vs targets.json/constituent judgments | needs grading |
| REQ-4b | behavior preserved (independent) | test-green | nx: differential vs 15-fail baseline (`nx test eslint-plugin`); kata: `jest --ci approvals.spec.ts` vs pristine snapshot | commands ready; needs runs |
| REQ-5 | 13-RESULTS.md tabulates both dims + empirical verdict | file + content | `test -f .planning/phases/13-.../13-RESULTS.md` and it contains per-cell with/without + Pass@k + a verdict sentence | to author |
| REQ-6 | clean-room + hygiene + restoration | scan | `git -C <nx> status --porcelain` empty; `git -C <kata> status` clean on main; `rg -n '[^\x00-\x7F]' 13-RESULTS.md` empty (ASCII); email allowlist-inversion scan (only approved gmail); no `.oracle/` path/prose in committed artifacts | check post-phase |

### Sampling Rate
- **Per graded run:** behavior-oracle command (nx differential / kata `--ci`) + oracle claim verdicts.
- **Per cell:** Pass@k / Pass^k across k=3 for both dimensions (reuse `run-e2e.mjs` `passAtK`/`passHatK`).
- **Phase gate:** all six acceptance checks pass; `13-RESULTS.md` complete; both borrowed repos restored; hygiene scan clean, BEFORE `/gsd-verify-work`.

### Wave 0 Gaps
- [ ] no external test infrastructure to install -- both repos have node_modules; oracle agents + runner present.
- [ ] Behavior-oracle needs a pristine baseline captured once per repo (nx 15-fail baseline; kata golden-master snapshot) BEFORE grading edited-source runs.
- [ ] Optional: a thin diff-to-claim normalizer helper (discretion) if manual reads of multi-file sweep diffs prove noisy.
- [ ] Optional: an unbiased from-scratch grading reviewer (recommended per unbiased-review-beats-primed) to catch grader bias on the verdict.

*(No test framework install needed -- existing infrastructure covers all phase checks.)*

## Security Domain

This phase ships NO application code and adds no runtime attack surface. The security-relevant controls are information-disclosure controls, already locked as project constraints:

### Applicable controls (STRIDE: Information Disclosure)
| Concern | Applies | Control |
|---------|---------|---------|
| Copyrighted book text leaking into committed artifacts (DST-04) | yes | Only the `oracle`/`oracle-reviewer` agents read `.oracle/`; verdicts in the agent's own words; main context reads only our own diffs/`targets.json`. Scan: no `.oracle/` path or source prose in committed output. |
| Maintainer PII (work email/domain) in a public repo | yes | Allowlist-inversion email scan before commit (assert only the approved gmail is present); committer identity = approved gmail; never write the work email/domain as a search needle. |
| Non-ASCII/mojibake in committed output | yes | ASCII-only (`->`, straight quotes); normalize reused-transcript punctuation when quoting. |
| Executing untrusted code | no | No new packages; borrowed repos are known upstreams; apply runs are sandboxed to throwaway branches the runner refuses to run on protected branches. |

Standard ASVS web categories (V2 auth, V3 session, V4 access control, V5 input validation, V6 crypto) are N/A -- there is no application, network surface, or user input in this measurement phase.

## Sources

### Primary (HIGH confidence -- read/verified this session)
- `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` -- arms, apply mode, throwaway-branch safety, diff+meta capture, Pass@k/Pass^k functions.
- `.claude/agents/oracle.md`, `.claude/agents/oracle-reviewer.md` -- input contracts, DST-04 firewall, one-book-per-call.
- `.claude/skills/lz-refactor-workspace/e2e-{nx,gilded-rose}/{suite.json,targets.json}` -- prompts, applyBase, protected branches, per-target expected_family/judgment; confirmed NO pkgsweep/projsweep entry.
- On-disk results trees + `git ls-files` -- p8 with_skill committed (fresh 2026-07-14); gr4 absent; p2 run-3..8 are 0-byte declines.
- p8 with_skill run-1 `meta.json` + `answer.md` + `diff.patch` -- claim-list shape; 5 Extract Functions; 15-fail baseline.
- nx repo state (branch `lz-refactor-e2e-smoke`, node_modules, uncommitted edits), `packages/eslint-plugin/{jest.config.cts,project.json}`; nx test masking documented in p2cmd run-3 answer.
- kata `package.json` (test:jest/vitest/mocha), `test/jest/approvals.spec.ts` (toMatchSnapshot), no `.snap` on disk, `golden-master-text-test.ts` present.
- `.planning/config.json` -- nyquist_validation true; security_enforcement key absent.
- 13-SPEC.md, 13-CONTEXT.md, ROADMAP Phase 13, E2E-FINDINGS.md, E2E-RESULTS.md, GR-RESULTS.md, MEMORY.md.

### Secondary
- `.planning/quick/20260710-lz-refactor-e2e-nx/SUMMARY.md` -- worktree + node_modules junction prior art (parallel apply).

### Tertiary
- none -- no external web sources needed (fully internal phase).

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all tools read from source; no external deps.
- Grading pipeline (REQ-3): HIGH -- oracle contract read directly; claim shape confirmed against a real answer.md.
- Behavior oracle (REQ-4b): HIGH -- both traps (nx 15-fail differential; kata pristine snapshot) verified on disk; exact commands derived.
- Corpus reality (REQ-1/2): HIGH -- disk enumerated + git-tracking confirmed; OQ-1 is the one deviation from SPEC, flagged not resolved.
- Correctness layer (REQ-4a): MEDIUM -- sweep cells lack a targets.json entry; constituent-judgment mapping is a documented workaround, not a single ground-truth row.

**Research date:** 2026-07-15
**Valid until:** 2026-08-14 (stable internal artifacts; re-verify disk state if runs happen in a later session, since apply runs mutate borrowed-repo trees)
