# Phase 14: Compare lz-refactor to mattpocock-skills code-review skill (kata + nx) - Context

**Gathered:** 2026-07-15
**Status:** Ready for planning
**Mode:** `--analyze --auto --chain`. No `14-SPEC.md` exists (ROADMAP says "lock in 14-SPEC.md
during discuss/plan"), so requirements are NOT pre-locked; the detailed ROADMAP Phase-14 goal is the
scope anchor and these decisions capture the HOW. Every gray area was rated IMPACT x CONFIDENCE
before auto-locking.

**Trap-quadrant analysis (per the `--auto` rule):** NO true trap-quadrant item (HIGH-impact +
not-HIGH-confidence in the lock-in sense) exists this phase, for the same reasons as Phase 13:
(a) this is a MEASUREMENT-ONLY, TERMINAL phase in milestone lz-tdd@0.0.2 -- no downstream phase
inherits its choices, it ships NO skill code, and re-grading / re-running is reversible; and
(b) every metered run is gated behind the standing eval-run-approval gate (a human checkpoint at
plan/execute time). The single most consequential HOW decision -- the comparability harness that
feeds `code-review` an equivalent input (D-02) -- is auto-locked with a recommended default AND
explicitly flagged to be re-surfaced at the spend-approval gate before any run. `--chain`
auto-advances discuss -> plan (planning spends no eval tokens); execution HALTS at the gate (D-12).

<domain>
## Phase Boundary

Head-to-head comparison of `/lz-tdd:lz-refactor` (in its recommend / smell-scan coach mode) against
the third-party `/mattpocock-skills:code-review` skill, both invoked explicitly via slash-command
syntax, on the SAME code targets from the prior eval corpus (Gilded Rose kata + nx `@nx/*`), scored
across multiple dimensions (lift, token usage, tool usage, output quality, book authenticity,
over-/under-engineering, and -- per the owner's mid-discussion addition -- TypeScript/FP/OOP idioms
and patterns). Produces a `14-RESULTS.md` head-to-head record + an empirical verdict on where
lz-refactor's book-grounded catalog measurably differs from a general code-review skill on
smell/refactoring analysis. This phase compares in RECOMMEND/REPORT mode only (no apply/drive), reuses
the Phase 11-13 workspace + borrowed repos + oracle grading pipeline, and changes NOTHING in the
shipped lz-refactor skill.

</domain>

<decisions>
## Implementation Decisions

### Comparison design + comparability (the crux)
- **D-01 [comparable modes]:** lz-refactor runs in **recommend mode** (`run-e2e.mjs --mode recommend`,
  read-only -- Edit/Write/Bash hard-blocked; the skill coaches, nothing is applied), invoked explicitly
  as `/lz-tdd:lz-refactor <query>`. `code-review` runs as `/mattpocock-skills:code-review <fixed-point>`.
  Both produce findings/recommendations (smells + named fixes), NOT applied diffs. This realizes the
  goal's "the mode of lz-refactor most comparable to Matt Pocock's code-review skill -- the
  smell-scan/recommend (coach) mode, not the apply/drive mode."
- **D-02 [equivalent inputs -- whole-file-as-diff; RECOMMENDED DEFAULT, re-surfaced at the spend gate]:**
  `code-review` reviews a `git diff <fixed-point>...HEAD`; lz-refactor recommend mode scans the target
  source directly. To compare on EQUIVALENT work, feed `code-review` the SAME target file(s) as a
  whole-file diff against an empty / pristine baseline, so the entire target appears as the reviewed
  change. Exact mechanism (git empty-tree diff, orphan-branch commit, or a small wrapper) = research +
  planner/executor discretion. CAVEAT (flagged per the owner's "flag caveats explicitly" directive):
  `code-review` is designed for INCREMENTAL diffs; a whole-file diff uses it slightly off its natural
  grain -- this is the necessary price of an equal-input comparison and MUST be stated as a methodology
  caveat in `14-RESULTS.md`. Trade-off table logged below.
- **D-03 [Spec axis skips -- expected asymmetry]:** `code-review` has TWO axes: Standards (which carries
  a fixed 12-Fowler-smell baseline -- this is its "Step 3" smell scan) and Spec (matches the diff to an
  originating issue/PRD). Only the **Standards axis** is comparable to lz-refactor's smell scan. The
  eval corpus (kata/nx) has no originating issue/PRD, so the Spec sub-agent skips and reports "no spec
  available" -- EXPECTED, reported as a structural asymmetry, not a defect. `docs/agents/issue-tracker.md`
  setup is NOT required (accept the skip).

### Dimensions scored (incl. the owner's mid-discussion addition)
- **D-04 [dimension set + measurement kind]:** Score the ROADMAP dimensions plus the owner-added
  idiom/pattern axis, each tagged MECHANICAL (from run meta/transcripts) or GRADED (oracle/judge):
  - **Lift** (GRADED-lite): count of distinct, actionable findings + named refactorings/smells surfaced
    per invocation.
  - **Token usage** (MECHANICAL): input/output tokens per run (see D-07).
  - **Tool usage** (MECHANICAL): which + how many tools each arm drives -- `code-review` spawns 2 parallel
    `general-purpose` sub-agents; lz-refactor recommend is a read-only single context. The asymmetry is
    itself a finding.
  - **Output quality** (GRADED/judge): usefulness, accuracy, actionability of findings.
  - **Book authenticity** (GRADED, DST-04): fidelity of each named refactoring/smell to the `.oracle/`
    books (Fowler / Kerievsky / GoF) via the `oracle`/`oracle-reviewer` agents.
  - **Over-/under-engineering** (GRADED): are recommendations proportionate -- no speculative patterns,
    no missed simplifications.
  - **TypeScript/FP/OOP idioms + patterns** (GRADED -- OWNER ADDITION): breadth + correctness of the
    TS/functional/OO idiom + pattern vocabulary each skill brings. lz-refactor carries the
    GoF (23) + extra (5) + Kerievsky (27) + functional (19 idioms) catalogs; `code-review` carries only
    12 Fowler smells with NO pattern/idiom vocabulary. This vocabulary asymmetry is EXPECTED and is the
    headline finding on this axis -- do NOT normalize it away.
- **D-05 [grading path -- DST-04]:** Book-authenticity + idiom/pattern grading route through the
  `oracle`/`oracle-reviewer` agents against the git-ignored `.oracle/` books; main context NEVER reads
  book prose; verdicts are in the agent's own words. Each surfaced smell/refactoring/pattern claim gets
  a pass/partial/fail fidelity verdict per arm. Reuse the Phase-13 posture (raw findings normalized in
  main context, per-claim verdict oracle-owned). Functional idioms grade against the committed research
  artifact `.planning/research/functional-depatterning-ts.md` (no-oracle tier) + the shipped
  functional-catalog.

### Harness (extensions required -- differs from Phase 13's "no new harness")
- **D-06 [competitor arm]:** Extend `run-e2e.mjs` with a **competitor arm** (e.g. `code_review`) that
  loads the mattpocock plugin dir via `--plugin-dir` and invokes `/mattpocock-skills:code-review
  <fixed-point>`, persisting output + meta the same way as the lz-refactor arms. Reuse the existing
  read-only recommend harness + capture; ADD the arm, do not rewrite.
- **D-07 [meta capture extension]:** Extend per-run `meta.json` to record **token usage** (input/output,
  from `claude -p --output-format json` usage) and **tool-usage counts** (per tool). Prior phases captured
  only `changed_files`/`used_refactor`/`skills_invoked`/`exit_code`/`elapsed_ms`; the token + tool
  dimensions (D-04) are new and need this. RESEARCH ITEM: confirm the runner can capture the JSON usage
  block + tool calls per session (incl. `code-review`'s sub-agents).
- **D-08 [recommend-mode queries]:** Author new recommend/report-oriented eval queries for lz-refactor
  that mirror `code-review`'s "review these files, surface smells + fixes" framing (explicit
  `/lz-tdd:lz-refactor` invocation), targeting the SAME files `code-review` reviews. Prior Phase-11-13
  queries were apply/drive-oriented; these are recommend-oriented for equivalent work.

### Corpus + arms + run config
- **D-09 [corpus]:** Reuse prior-eval targets from BOTH suites -- Gilded Rose kata (`e2e-gilded-rose`)
  + nx `@nx/*` (`e2e-nx`). Recommended representative subset to bound spend: the kata target + 1-2 nx
  packages (e.g. the `@nx/eslint-plugin` p8 target), not the full `@nx/*` fleet. Exact target list =
  planner discretion (reuse `targets.json`).
- **D-10 [arms + run config]:** Two arms per cell -- `lz-refactor` (recommend, `/lz-tdd:lz-refactor`,
  shipped plugin via `--plugin-dir plugins/lz-tdd`) vs `code_review` (`/mattpocock-skills:code-review`,
  mattpocock plugin-dir). k=3 (report Pass@k / Pass^k where run counts allow), serial
  (`--num-workers 1`), `claude-opus-4-8 @ high`, `--setting-sources project`, PONYTAIL off, MCP +
  user-plugins stripped except the plugin under test -- reuse the Phase-11/13 locked run config.

### Verdict + results
- **D-11 [results doc + verdict]:** `14-RESULTS.md` (phase dir) tabulates `lz-refactor` vs `code_review`
  per cell per dimension; the verdict is framed as an EMPIRICAL finding (where the book-grounded catalog
  measurably differs from a general code-review skill), NEVER a pre-assumed win. It MUST state the D-02
  whole-file-diff caveat + the D-03 Spec-axis-skip asymmetry. Include >= 1 unbiased from-scratch grading
  reviewer (per [[unbiased-review-beats-primed]]). Reuse the `E2E-RESULTS.md` / `EVAL-RESULTS.md` format
  conventions.

### Execution gate (HARD)
- **D-12 [HARD eval-run gate]:** Every arm run spends metered `claude -p`. Per the standing
  [[eval-run-approval-gate]], the plan BUILDS all run commands + grading scaffolding + harness
  extensions (D-06/D-07) and HALTS for explicit user approval before executing ANY metered run -- no
  self-approval, even in this `--auto` pass. Grading (oracle agent calls on the Claude plan, not a
  separate metered pool) runs only AFTER outputs exist. The invocation's "Approve spend" is recorded as
  the owner's standing intent to approve the metered runs, to be honored WHEN the gate is presented at
  plan/execute time -- the gate is still PRESENTED; approval is not silently assumed during discuss
  (which spends no eval tokens).

### Claude's Discretion
- Exact `run-e2e.mjs` arm / `--plugin-dir` wiring for the competitor; whether to vendor a pinned copy of
  mattpocock-skills@1.2.0 into the workspace for reproducibility vs point at the plugin cache.
- Exact target subset + whether nx and kata share one plan or split by suite.
- Whether to include a base `no_skill` third reference arm (Phase 13 already characterized base).
- Exact `14-RESULTS.md` table shape (one table per dimension vs a matrix); whether a small normalization
  helper is written for finding extraction if manual reads prove noisy.
- Grading efficiency: fetch reusable per-(book, refactoring/smell) mechanics ground truth once and reuse
  across arms, PROVIDED each per-claim VERDICT stays oracle-owned + in the agent's own words.
- Whether to run `/gsd-spec-phase 14` to formalize `14-SPEC.md` before plan. RECOMMENDED NOT to block the
  chain -- the ROADMAP goal + these decisions are detailed enough for planning; a spec-phase can be added
  later if the plan-checker flags ambiguity.

### `--analyze` trade-off tables (audit trail; recommended pick auto-locked)
**D-02 -- how does `code-review` get an equivalent input?**

| Approach | Pros | Cons |
|---|---|---|
| Whole-file diff vs empty/pristine baseline (RECOMMENDED) | Both skills see the SAME full target files -> equal-input, fair on lift/quality | `code-review` used off its incremental grain (caveat) |
| Natural incremental diff on a synthetic change | Uses `code-review` on its home turf | Not equivalent work vs lz-refactor's whole-source scan; distorts the comparison |
| Point `code-review` at working-tree files directly | Simplest | Deviates from `code-review`'s documented diff-only flow; ad-hoc, non-reproducible |

Recommended: whole-file diff vs baseline -- it is the only option that equalizes inputs, which the goal
requires ("compared on equivalent work"); the incremental-grain caveat is disclosed in the results.

**D-10 -- run config.** Reuse the already-locked Phase-11/13 serial config (`--num-workers 1`,
opus-4-8@high, `--setting-sources project`, PONYTAIL off, MCP/user-plugins stripped, k=3). Recommended:
reuse verbatim -- it is the proven, comparable harness config; inventing a new config would break
cross-phase comparability with the Phase-13 baseline.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Competitor skill under comparison
- `C:\Users\LarsGyrupBrinkNielse\.claude\plugins\cache\mattpocock\mattpocock-skills\1.2.0\skills\engineering\code-review\SKILL.md`
  -- the `/mattpocock-skills:code-review` skill: two-axis (Standards + Spec) diff review; Standards axis
  carries the fixed 12-Fowler-smell baseline (its Step 3); spawns 2 parallel `general-purpose`
  sub-agents; reviews `git diff <fixed-point>...HEAD`. Version 1.2.0.
- `C:\Users\LarsGyrupBrinkNielse\.claude\plugins\cache\mattpocock\mattpocock-skills\1.2.0\docs\engineering\code-review.md`
  -- companion doc (background on the two-axis rationale).

### e2e recommend harness + config (reuse + extend -- D-01/D-06/D-07/D-08)
- `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` -- the recommend/apply/arm/persist runner
  (`--mode recommend` read-only, Edit/Write/Bash blocked; `--arm`, `--plugin-dir`, diff+meta capture).
  Extend with the `code_review` competitor arm + token/tool meta capture.
- `.claude/skills/lz-refactor-workspace/e2e-nx/{suite.json,targets.json,prompts/}` -- nx suite;
  `targets.json` `expected_family`+`judgment` = correctness / layer ground truth.
- `.claude/skills/lz-refactor-workspace/e2e-gilded-rose/{suite.json,targets.json,prompts/}` -- kata suite.
- `.claude/skills/lz-refactor-workspace/e2e-nx/E2E-RESULTS.md`,
  `.claude/skills/lz-refactor-workspace/e2e-gilded-rose/GR-RESULTS.md`,
  `.claude/skills/lz-refactor-workspace/EVAL-RESULTS.md`,
  `.claude/skills/lz-refactor-workspace/E2E-FINDINGS.md` -- table + Pass@k conventions + prior finding
  (base Opus is catalog-grade on plain mechanical work; the skill's edge is pattern-directed /
  de-patterning / seam).

### Book-authenticity + idiom grading (DST-04 -- the ONLY channel to `.oracle/`)
- `oracle` agent -- open-ended book ground truth; facts in its own words, never source prose. Primary
  grading agent (D-05).
- `oracle-reviewer` agent -- gates a DRAFTED per-claim doc; usable only on a normalized claim list.
- `.planning/research/functional-depatterning-ts.md` -- no-oracle correctness anchor for the FP idiom
  axis (D-04/D-05); the pattern -> idiom -> TS-feature map + shared template.

### Shipped skill under test + its catalogs (the vocabulary lz-refactor brings)
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` + `references/` (fowler-catalog, kerievsky-catalog,
  gof-catalog, extra-patterns-catalog, functional-catalog, smells.md) -- the catalog vocabulary scored
  on the book-authenticity + idiom/pattern axes.

### Prior-phase methodology this phase inherits
- `.planning/phases/13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness/13-CONTEXT.md`,
  `13-SPEC.md`, `13-RESULTS.md` -- the reused grading posture, oracle DST-04 path, behavior-oracle,
  Pass@k discipline, the empirical-verdict framing, and the D-09 build-then-halt eval gate.
- `.planning/phases/11-skill-effectiveness-evals/11-CONTEXT.md` -- native harness reuse, wait-for-all
  notifications, unbiased-reviewer, the locked serial run config.
- `.planning/ROADMAP.md` -> "Phase 14" -- the goal + the (non-exhaustive) dimension list.
- `.planning/REQUIREMENTS.md` -- milestone requirements + Out-of-Scope framing.

### Project constraints
- `CLAUDE.md` + `AGENTS.md` -- DST-04 clean-room grading (main context never reads `.oracle/` prose);
  ASCII-only committed output; public-repo hygiene (only the approved public gmail may appear); Windows
  arm64 (`git grep`/`rg`, npm); NEVER run evals without explicit approval (D-12); compute + report
  Pass@k / Pass^k; include >= 1 unbiased reviewer.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `run-e2e.mjs` already supports `--mode recommend` (read-only), `--arm`, `--plugin-dir`, and per-run
  output + `meta.json` capture into the tracked workspace tree -- the backbone; phase 14 adds a
  competitor arm (D-06) + token/tool meta fields (D-07), not a rewrite.
- `targets.json` in both suites carries `expected_family` + `judgment` = ready-made correctness / layer
  ground truth reusable on the lift + book-authenticity axes.
- Both borrowed repos are on disk (nx `D:/projects/github/nrwl/nx`; kata
  `D:/projects/github/emilybache/GildedRose-Refactoring-Kata/TypeScript`).
- The mattpocock-skills plugin is installed at
  `~/.claude/plugins/cache/mattpocock/mattpocock-skills/1.2.0` -- loadable via `--plugin-dir` for the
  competitor arm.

### Established Patterns
- Eval material lives under `.claude/skills/*-workspace/` (git-tracked record; bulky raw `outputs/`
  gitignored; PR-filtered off the shipped surface). `14-RESULTS.md` is the only artifact under
  `.planning/`.
- Book-authenticity checks route through `oracle`/`oracle-reviewer` (never author eyeballing); verdicts
  in the agent's own words (DST-04); committed output ASCII-only.
- Every metered eval run is gated behind explicit user approval; Pass@k/Pass^k reported; >= 1 unbiased
  from-scratch reviewer included; wait for ALL completion notifications before grading.

### Integration Points
- Arms consume a skill by path via `--plugin-dir` (`plugins/lz-tdd` for lz-refactor; the mattpocock cache
  dir for code-review); runs use `claude-opus-4-8 @ high`, `--setting-sources project`, serial.
- This is the terminal measurement phase of milestone lz-tdd@0.0.2; after it, `/gsd-audit-milestone
  lz-tdd@0.0.2` then `/gsd-complete-milestone`. No phase depends on its output; it ships no skill change.

</code_context>

<specifics>
## Specific Ideas

- OWNER mid-discussion addition (2026-07-15): "Also compare on TypeScript/FP/OOP idioms and patterns."
  Captured as a first-class scored dimension (D-04). This is where lz-refactor is structurally expected
  to differ MOST: it carries GoF + Kerievsky + functional-catalog idiom/pattern vocabulary, whereas
  `code-review` carries only 12 Fowler smells. The breadth asymmetry is the expected headline on this
  axis -- reported, not normalized away.
- `code-review`'s 2-parallel-sub-agent spawn (Standards + Spec) vs lz-refactor recommend's single
  read-only context is a concrete tool-usage / token-usage finding (D-04), not noise.
- Equivalent-work comparison forces the whole-file-as-diff input for `code-review` (D-02); the caveat is
  disclosed in the results.
- The prior E2E finding (base Opus is catalog-grade on plain mechanical work; lz-refactor's realizable
  edge is pattern-directed / de-patterning / seam + auto-trigger) is the hypothesis this phase tests
  against a REAL external code-review skill rather than base Opus -- a parity-with-broader-vocabulary
  result is a publishable finding, not a failure.

</specifics>

<deferred>
## Deferred Ideas

- The full `@nx/*` fleet (`p9`-`p13`) and `kata gr3` -- out of scope; the representative kata + 1-2 nx
  targets cover both repos (same posture as Phase 13's representative pair).
- Comparing the two skills on APPLY/DRIVE output -- this phase compares recommend/report mode only (the
  mode comparable to `code-review`, which does not apply changes); apply-output fidelity was already
  graded in Phase 13.
- Turning the head-to-head into a standing CI/regression gate -- future; this is a one-time comparison.
- Any tuning of the shipped lz-refactor skill on a surfaced defect -- explicitly out of scope; a defect
  feeds a separate, gated tuning decision, never an in-phase edit (same posture as Phase 13).

None -- discussion stayed within phase scope.

</deferred>

---

*Phase: 14-compare-lz-refactor-to-mattpocock-skills-code-review-skill-k*
*Context gathered: 2026-07-15*
