---
phase: 21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i
verified: 2026-08-03T00:43:44Z
status: passed
score: 8/8 must-haves verified (plus milestone-audit gap INT-02 verified closed)
behavior_unverified: 0
overrides_applied: 0
re_verification:
  previous_status: human_needed
  previous_score: 8/8 must-haves verified (1 escalation open on the authenticity cross-tab)
  gaps_closed:
    - "The authenticity cross-tab figure. CLOSED, and the corrected values are 6 and 6 -- confirmed by me twice over, from the committed 36-row table and independently from the 36 on-disk red-grade.json verdicts, which agree with each other on all 36 rows. My own pass-2 inference of 7 or 8 was WRONG, as the fix commit says: I bounded the first figure correctly but derived the replacement from the companion figure, which was also stale. Recomputing both together is what closes the arithmetic. compile_error AND authentic = 6 (RXF/no_skill/3, RXL/no_skill/1, RXL/no_skill/3, RXL/with_skill/3, RXL/invoke_skill/2, RXL/invoke_skill/3); genuinely_red AND partial = 6 (GRC/no_skill/1, SRVC/no_skill/3, SRVC/with_skill/2, SRVC/invoke_skill/1, SRVC/invoke_skill/2, SRVC/invoke_skill/3)."
    - "The evidence-standard escalation, taken on branch (b) as specified. All 36 per-specimen rows are committed with cell, arm, run, mechanical verdict, authenticity verdict and condensed grader reason. Every figure the section publishes now derives from that table and I re-derived all of them: per-arm authentic-of-12 at 7/6/5, per-arm partial/inauthentic at 5/0, 6/0, 6/1, per-cell GRC 2/3/2, SRVC 2/1/0, RXF 1/0/0, RXL 2/2/3, the looser not-inauthentic reading at 12/12, 12/12, 11/12 (1.00/1.00/0.92), all twelve Pass@k/Pass^k cells, and the monotone 7 > 6 > 5. The table also carries a mechanical column that IS independently checkable, and it checks: 0 mismatches against the 36 red-grade.json files on disk."
    - "W4 corrected-round-total sweep. $29.05 is gone from 21-LEARNINGS.md:212 and 21-04-SUMMARY.md:83. The only surviving occurrences in the tree are inside the prior VERIFICATION.md text that this file replaces. Round total independently recomputed a third time from the 36 captures' own total_cost_usd: $29.0382 -> $29.04, mean $0.8066, and the four per-cell figures reproduce to the cent."
    - "W5 monotone-in-dose disclosure. The ordering is now named explicitly at :451 before being argued away, which is the right order for a report that argues a direction away."
  gaps_remaining: []
  regressions: []
human_verification: []
---

# Phase 21: Applied RED Eval in Real OSS Repos (multi-dimensional, 3-arm) Verification Report

**Phase Goal:** lz-red is validated on REAL applied work -- driving the next failing (red) test in real
OSS TypeScript repos with short, basic, human-style prompts -- across three arms and graded on many
lift dimensions, mirroring the lz-refactor Phase 13/14 apply evals (not coaching prose over synthetic
snippets).

**Verified:** 2026-08-03T00:43:44Z
**Status:** passed
**Re-verification:** Yes -- fourth pass, replacing the 2026-08-03T00:20:40Z verdict. That prior report
survives in history at `4165a0d`, so overwriting it here loses no record.

## The escalation is closed, on both halves, and my own figure was the wrong one

The prior pass returned `human_needed` on one item with two separable halves. Both are closed, and one
of them corrects me rather than the tree.

**The determinate half.** My bound was sound and my replacement was not. I proved 5 impossible by
bounding authentic-and-`compile_error` against the on-disk mechanical verdicts plus the section's own
per-cell counts, then inferred 7 or 8 from the companion figure "8 `genuinely_red` graded only partial".
That companion figure was itself stale, so my inference inherited the error. Recomputed from the v2
verdicts, **both figures are 6**, and I confirmed that independently from two sources that agree:

- From the committed 36-row table: `compile_error` AND `authentic` = 6; `genuinely_red` AND `partial` = 6.
- From the 36 `red-grade.json` files on disk: the mechanical column of that table matches all 36 rows
  with zero mismatches, so the cross-tab computed from the table is the cross-tab computed from disk.

I get 6 and 6, not anything else. The full contingency I derived is `compile_error` 6 authentic / 0
inauthentic / 10 partial, `genuinely_red` 12 / 1 / 6, `unattributable` 0 / 0 / 1, summing to 36.

**The evidence-standard half, branch (b).** The 36 per-specimen rows landed with exactly the shape the
escalation specified. This is the harder branch and it was the right one, for the reason the commit
gives: the figure was wrong precisely because nothing in the tree could contradict it. The standard
immediately proved itself -- the one defect I found this pass is a defect I could only find BECAUSE the
table exists (see W1). Under the old prose-only convention that sentence would have been unfalsifiable.

## Goal Achievement

### Observable Truths

Same must-haves as the prior passes: ROADMAP Success Criteria SC1-SC5 merged with the four plans'
`must_haves.truths`, plus the earlier verdict's gated RUN item.

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | (SC1/EVL-03.1) Short human-style APPLY prompts drive the next failing test in >= 1 real OSS TypeScript repo; byte-identical across arms except the target path; real applied output is captured and graded, not coaching prose. | VERIFIED (regression clean) | `selfcheck-red` exit 0 this session with cruxes 1-3 present: composition, prompt parity ("no test-state claim in any prompt", every prompt pins its target `test_dir`, a POISONED prompt IS caught, all 3 RED suites declare byte-identical apply preamble bytes) and worktree base. The pinned round still enumerates to exactly 36 captures, each carrying `diff.patch`, `answer.md`, `meta.json`, `red-grade.json`. |
| 2 | (SC2/EVL-03.2) Three OWN-skill arms compose and ran; with_skill vs invoke_skill surfaces the trigger gap; the lz-refactor suites still compose unchanged. | VERIFIED (regression clean) | `selfcheck-red` exit 0 with **ZERO SKIPs**, all of cruxes 1-11 emitted, including crux 6 twice: the default lz-refactor nx suite still composes 3 arms with `plugins/lz-tdd`, and the lz-refactor apply preamble is byte-for-byte unchanged. Trigger gap re-tabulated from the real round this session: `with_skill` fired GRC 1.00, SRVC 1.00, RXF 0.33, RXL 0.67 = 9/12, against `avail 1.00` in every cell and `force 1.00` on `invoke_skill`. |
| 3 | (EVL-03.3) A mechanical D-06 correctness GATE classifies the produced test and passes only a genuinely-red-for-the-right-reason test, failing closed on garbled input. | VERIFIED (regression clean) | `grade-red.mjs --selfcheck` exit 0, all nine D-06 classes proven offline plus the fail-closed leg. Re-read from source rather than from the commit message: `VERDICTS` at `grade-red.mjs:80-88` is the same nine names in the same order, and `verdictPass()` at `:947-949` is `verdict === 'genuinely_red' \|\| verdict === 'blunt_red'`. The recorded "nine classes, passes exactly two" wording is literally the shipped predicate. |
| 4 | (EVL-03.4) Mechanical lift dims tabulate from the stream-json meta, and Pass@k/Pass^k compute on the correctness gate, not a vocabulary proxy. | VERIFIED (regression clean) | `tabulate-mechanical-red.mjs --selfcheck` exit 0. Re-run against the REAL round it again reproduces every published wall/cost/turn figure to the digit: GRC 111/0.38/10, 92/0.46/11, 137/0.43/10; SRVC 231/1.32/22, 258/1.49/21, 222/1.25/18; RXF 169/0.59/13, 186/0.68/14, 172/0.62/13; RXL 189/0.63/15, 264/0.98/20, 268/0.86/17. Per-arm gate passes 6/6/7 of 12, matching the published 0.50/0.50/0.58. |
| 5 | (SC3/EVL-03.5) The produced tests are graded and compared on the lift dimensions named in SC3, including book/source authenticity against the owned `.oracle/` RED sources via oracle-reviewer (DST-04). | **VERIFIED** -- and the axis is now auditable, not asserted | Thirteen dims measured. The authenticity dim's every published aggregate now re-derives from the committed 36-row table, and I re-derived all of them (see the two tables below). The one figure that failed last pass now reconciles at 6 and 6 from two agreeing sources. One new WARNING (W1) sits in a descriptive label column and moves no statistic. |
| 6 | (SC4/EVL-03.6) The harness reuses the lz-refactor apply pattern with no build deps in `plugins/lz-tdd`; per-run byproducts are git-ignored; the metered run was user-gated; borrowed repos are pristine. | VERIFIED (regression clean) | `plugins/lz-tdd` still has zero `package*.json` and zero `node_modules`. After a full `selfcheck-red` (which provisions target toolchains and grades canaries in both volumes' temp dirs) all four trees report 0 dirty entries: plugin repo, GildedRose-Refactoring-Kata, srvx, primitives-pin. `D:/.lz-red-grade-tmp` and `C:/.lz-red-grade-tmp` both back to 0 entries after teardown. |
| 7 | (SC5/EVL-03.7) Results are recorded with Pass@k/Pass^k + >= 1 unbiased from-scratch reviewer, and the substance-only comparison is the headline wherever a vocabulary proxy is used. | VERIFIED | Unchanged and re-confirmed. The authenticity table follows the same pooling convention (n=12 per arm) and publishes the conservative Pass^3 column beside Pass@k rather than only the flattering aggregate; I reproduced all twelve cells exactly. The one vocabulary-adjacent dim stays labeled CONTEXT-ONLY and never becomes the headline. |
| 8 | (Earlier verdict's gated item) The metered 3-arm apply RUN happened on fresh approval and its results are real, reproducible and grader-regime-invariant. | VERIFIED (regression clean) | Round cost recomputed a third time from the captures' own `total_cost_usd` over the structurally pinned 36: GRC $3.8124, SRVC $12.1553, RXF $5.6299, RXL $7.4406, total **$29.0382 -> $29.04**, mean $0.8066 -> $0.807. Matches `EVAL-RESULTS.md:53` on every cell and the total. Verdict census off disk unchanged: GRC 9/9 `genuinely_red`; RXF 9/9 `compile_error`; RXL 7 `compile_error` + 2 `genuinely_red`, both on `run-1` of the two skill-bearing arms; SRVC 8 `genuinely_red` + 1 `unattributable`. |

**Score:** 8/8 must-haves verified; 0 FAILED; 0 present-but-behavior-unverified; 0 overrides applied.

### Additional item assessed (milestone-audit gap, not a Phase-21 must-have)

| Item | Status | Evidence |
|------|--------|----------|
| INT-02 -- `check-backing.mjs` re-pointed at the relocated Beck reference | VERIFIED CLOSED (regression clean) | Full lz-refactor battery re-run this session: **exit 0, 0 FAIL, 0 SKIP**, and all 8 `beck-tdd-by-example.md` assertions emit and pass (red-green-refactor cycle, the two rules, Fake It, Triangulate, Obvious Implementation, lz-tpp seam, no-oracle tag, no scaffold phrase). Mutation-tested fail-closed in the prior pass; nothing in these two commits touches the checker. |

### The 36-row table, re-derived

Everything the section publishes, recomputed by me from the committed table. The mechanical column was
independently cross-checked against the 36 `red-grade.json` files: **0 mismatches**, 0 duplicate row
keys, 36 rows parsed, three distinct authenticity values.

| Published figure | Section says | I derive | Match |
|---|---|---|---|
| Cross-tab: `compile_error` AND authentic | 6 | 6 | YES |
| Cross-tab: `genuinely_red` AND partial | 6 | 6 | YES |
| Per-arm authentic of 12 | 7 / 6 / 5 | 7 / 6 / 5 | YES |
| Per-arm partial of 12 | 5 / 6 / 6 | 5 / 6 / 6 | YES |
| Per-arm inauthentic of 12 | 0 / 0 / 1 | 0 / 0 / 1 | YES |
| Per-cell authentic-of-3, GRC | 2/3/2 | 2/3/2 | YES |
| Per-cell authentic-of-3, SRVC | 2/1/0 | 2/1/0 | YES |
| Per-cell authentic-of-3, RXF | 1/0/0 | 1/0/0 | YES |
| Per-cell authentic-of-3, RXL | 2/2/3 | 2/2/3 | YES |
| Pass@1 / @3 / @5 / ^3, `no_skill` | 0.58 / 0.95 / 1.00 / 0.16 | identical | YES |
| Pass@1 / @3 / @5 / ^3, `with_skill` | 0.50 / 0.91 / 0.99 / 0.09 | identical | YES |
| Pass@1 / @3 / @5 / ^3, `invoke_skill` | 0.42 / 0.84 / 0.97 / 0.05 | identical | YES |
| Looser not-inauthentic reading | 1.00 / 1.00 / 0.92 | 12/12, 12/12, 11/12 | YES |
| Monotone in dose | 7 > 6 > 5 | 7 > 6 > 5 | YES |
| Census over 36 | 18 authentic / 17 partial / 1 inauthentic | identical, sums to 36 | YES |
| RXF `shared design` rows | "seven" (:501) | **six** labeled in the table | **NO -- W1** |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `.../e2e-red-gilded-rose/EVAL-RESULTS.md` | filled results record, all SC3 dims, auditable authenticity trail | VERIFIED (one label count wrong -- W1) | 705 lines, +72/-4 in `528e689`. Cross-tab corrected to 6 and 6 with a CORRECTED block that names the cause rather than restating the number. New 36-row per-specimen table at :462-499. Monotone ordering named at :451. Zero non-ASCII bytes; zero email-shaped tokens. |
| Per-specimen authenticity verdicts | auditable trail for the new dimension | **VERIFIED -- was ABSENT** | The escalation's branch (b) delivered as specified: 36 rows, cell / arm / run / mechanical verdict / authenticity verdict / condensed grader reason. Load-bearing addition beyond the spec: the mechanical column makes part of the table independently falsifiable, and it verifies at 0/36 mismatches. |
| `21-LEARNINGS.md` | corrected round total propagated | VERIFIED -- W4 CLOSED | `:212` now reads $29.04. Zero non-ASCII; zero email-shaped tokens. |
| `21-04-SUMMARY.md` | corrected round total propagated | VERIFIED -- W4 CLOSED | `:83` now reads $29.04 inside the forward-pointer blockquote. Zero non-ASCII; zero email-shaped tokens. |
| `.planning/REQUIREMENTS.md` (EVL-03) | requirement closed against evidence, no overstatement | VERIFIED (unchanged, re-checked) | Untouched by these commits and still correct: its authenticity figures (7 / 6 / 5, Pass@1 0.58 / 0.50 / 0.42) match my derivation exactly, it names its own prior overstatement, and $29.04 stands at all 3 occurrences. |
| `.claude/skills/lz-refactor-workspace/tools/check-backing.mjs` | INT-02 fix, fail-closed | VERIFIED (unchanged, regression clean) | Not touched by these commits; battery re-run green with all 8 restored assertions. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `red-grade.json` verdicts | authenticity cross-tab | the committed 36-row table | **WIRED and FLOWING** -- was NOT VERIFIED | The only failing link in the phase is now the best-evidenced one. The table's mechanical column agrees with all 36 on-disk verdicts, and the cross-tab computed from either source is 6 and 6. |
| 36-row table | per-arm / per-cell / Pass@k figures | derivation | WIRED and FLOWING | Fifteen of sixteen published figures re-derived exactly; the sixteenth is W1. |
| `RUN-GATE.md` Step 4.3 | oracle-reviewer vs `.oracle/` | prescribed post-run pass | WIRED and EXERCISED | Unchanged. Run over all 36 captures; corroborated last pass against content a fabricated report would not survive. |
| `grade-red.mjs` red-grade.json | `tabulate-mechanical-red.mjs` | shared `verdict` / `pass` shape | WIRED and FLOWING | 36 real grades consumed; output matches the publication to the digit. |
| `check-backing.mjs` FILES entries | `plugins/lz-tdd/references/` | `spec.dir ?? REFERENCES` | WIRED and FLOWING | 8 previously-skipped assertions execute and pass. |
| `run-e2e.mjs` TRACK_SKILLS | `suite.json` trackSkills | suite-driven param, lz-refactor default | WIRED | crux 6 re-confirms the nx regression. |

### Data-Flow Trace (Level 4)

The live question for a results phase is whether published numbers flow from real classifier output or
from a hand-written table. Both branches now FLOW.

Mechanical: 36 real `meta.json` + `diff.patch` -> `grade-red.mjs` -> `red-grade.json` ->
`tabulate-mechanical-red.mjs` -> figures matching EVAL-RESULTS.md to the digit, plus a cost total
recomputed independently at $29.0382.

Authenticity: the branch that stopped short of its numbers last pass now reaches them. Input is real and
reproducible (corpus rebuild verified 36/36 applied last pass). Output is the committed 36-row table, and
every aggregate the section publishes recomputes from it. The residual, unchanged and intrinsic to a
judge dimension: the authenticity COLUMN is still the graders' recorded judgment with no separate
transcript committed, so a row's verdict cannot be regenerated the way a mechanical verdict can. That is
what branch (b) asked for and delivered; it is not a wiring gap. It is also mitigated in practice --
individual rows ARE falsifiable against the diffs, which is exactly how I found W1 and how I confirmed
four sampled notes below.

### Behavioral Spot-Checks

All run by me in this session; zero metered spend.

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Cross-tab from the committed table | parse the 36 rows, compute both cells | 6 and 6, with the specific rows named | PASS |
| Cross-tab from on-disk verdicts | 36 `red-grade.json` vs the table's mechanical column | 0 mismatches over 36, so both sources give the same cross-tab | PASS |
| Table internal integrity | 36 rows, duplicate keys, value domain | 36 parsed, 0 duplicates, exactly {authentic, partial, inauthentic} | PASS |
| Every other published authenticity figure | re-derive per-arm, per-cell, census, looser reading, monotone | all 15 reproduce exactly | PASS |
| Authenticity Pass@k / Pass^k | recompute `1 - C(n-c,k)/C(n,k)` and `C(c,k)/C(n,k)` at n=12 | all twelve cells reproduce exactly | PASS |
| **RXF `shared design` label count** | count table rows labeled `shared design` against the prose at :501 | prose says seven, table labels **six** | **FAIL -- W1** |
| **RXF grouping against the diffs** | read all nine RXF `diff.patch` added lines in full | the correct group IS seven; `invoke_skill/2` is near-identical to `invoke_skill/1` and `/3`; the two genuine outliers are `no_skill/3` and `with_skill/3`, the only two that write their own TestBed spec file. All four cosmetic dimensions named at :502 are jointly exhibited only by the seven-member group | PASS (the prose's substance is right; the table's label is the error) |
| Note column sampled beyond RXF: RXL/no_skill/2 | read the diff | claim "folds an unrelated already-working direction token into the same test" is verbatim true: it injects `RDX_DIRECTION` with the comment "Sanity: direction is already bridged into DI this way today" | PASS |
| Note column sampled: RXL/with_skill/1 | read the diff | "explicit three-part comments; pending marker records the next step without a false signal" is true: `// Arrange` `// Act` `// Assert` plus `it.todo(...)` | PASS |
| Note column sampled: SRVC/with_skill/2 | read the diff | both halves true: the FIRST test is the already-working single-cookie case, and `await server.close(true)` is the last statement inside each `test` rather than in a `finally`, so it never runs on the failing path | PASS |
| Round total + per-cell cost | sum `total_cost_usd` over the pinned 36 | $3.8124 / $12.1553 / $5.6299 / $7.4406, total $29.0382 -> $29.04, mean $0.807 -- matches `:53` on every figure | PASS |
| W4 sweep completeness | tree-wide search for the superseded total | $29.05 survives only inside the prior VERIFICATION.md this file replaces | PASS |
| EVL-03.3 wording vs instrument | read `VERDICTS` and `verdictPass()` in source | nine names, same order; passes exactly `genuinely_red` and `blunt_red` | PASS |
| Full crux battery | `node selfcheck-red.mjs` | **exit 0, ZERO SKIPs, cruxes 1-11 all emitted** | PASS |
| Grader + tabulator selfchecks | `--selfcheck` on both | exit 0 each; nine D-06 classes and the fail-closed legs proven | PASS |
| Mechanical dims on the REAL round | `node tabulate-mechanical-red.mjs` | every published wall/cost/turn figure and the 9/12 trigger rate reproduced | PASS |
| Full lz-refactor battery (INT-02) | `npm --prefix .claude/skills/lz-refactor-workspace run check` | exit 0, 0 FAIL, 0 SKIP, all 8 restored Beck assertions emitted | PASS |
| lz-red reference battery | `npm --prefix .claude/skills/lz-red-workspace run check` | RED-REFS GREEN 11/11, roster integrity 124 checks | PASS |
| Plugin / marketplace structure | `claude plugin validate .` | Validation passed | PASS |
| No build deps in the plugin | search `plugins/lz-tdd` | 0 `package*.json`, 0 `node_modules` | PASS |
| Trees pristine after everything | `git status --porcelain` on the plugin repo + all 3 borrowed repos | 0 dirty entries everywhere; both grade-tmp dirs back to 0 entries after teardown | PASS |
| ASCII + email allowlist-inversion | non-ASCII and email-token scan over the three changed files | 0 non-ASCII; 0 email-shaped tokens, so nothing to compare against the approved address | PASS |

Reproducibility note, unchanged from last pass: `selfcheck-red` needs well over two minutes (it copies
target toolchains per suite; the RXF two-path copy alone took 22 s). Run it with a generous timeout or in
the background. A killed run strands a grading worktree, which the next run correctly FAILS on at crux 7.

### Probe Execution

No `scripts/*/tests/probe-*.sh` convention exists in this project. The phase's `--selfcheck` entry points
serve that role and are covered above; all were executed in this process.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| EVL-03 (overall) | 21-01 (formalized) | APPLY-based, 3-arm, multi-dim RED eval | SATISFIED | Every SC3 lift dimension measured, and the last one is now auditable rather than asserted. |
| EVL-03.1 | 21-01 / 21-03 | Byte-identical, non-leading prompt across arms | SATISFIED | Regression clean, cruxes 1-3. |
| EVL-03.2 | 21-01 / 21-03 | Three-arm composition | SATISFIED | selfcheck cruxes 1-3, 6 plus live trigger rates from the round. |
| EVL-03.3 | 21-02 | D-06 correctness classifier | SATISFIED | Re-read from source: nine classes, passes exactly two. |
| EVL-03.4 | 21-03 | Mechanical dims + Pass@k/Pass^k | SATISFIED | Reproduced against the real round again. |
| EVL-03.5 | 21-03 / 21-04 | Judge wiring (BUILD) + judge and authenticity verdicts (RUN) | **SATISFIED, now auditable** | Cross-tab reconciles at 6 and 6 from two agreeing sources; 15 of 16 published figures re-derived; the 16th is W1, a label count that moves nothing. |
| EVL-03.6 | 21-01 / 21-04 | No plugin deps; gitignored byproducts; gated run | SATISFIED | Verified after a full toolchain-provisioning selfcheck. |
| EVL-03.7 | 21-03 / 21-04 | Recorded results, Pass@k/Pass^k, unbiased reviewer, substance-only headline | SATISFIED | Pass^3 published beside Pass@k; all twelve cells reproduce. |

No orphaned requirements: REQUIREMENTS.md maps only EVL-03 to Phase 21 and all four plans declare
`requirements: [EVL-03]`.

### Anti-Patterns Found

| # | File | Line | Pattern | Severity | Impact |
|---|------|------|---------|----------|--------|
| W1 | `.../EVAL-RESULTS.md` | 501 | "RXF's **seven** `shared design` rows ..." The table it points at labels **six**: `no_skill/1`, `no_skill/2`, `with_skill/1`, `with_skill/2`, `invoke_skill/1`, `invoke_skill/3`. `RXF/invoke_skill/2` is not labeled, though I read all nine diffs and it IS the same test -- same `getFocusedDay` helper, same `[data-focused]` query, same two assertions, differing only in title wording. The two genuine outliers are `no_skill/3` and `with_skill/3`, the only two that write their own TestBed spec file. The four cosmetic dimensions named at :502 (title wording, truthiness versus null check, an optional non-null cast, comment volume) are jointly exhibited ONLY by the seven-member group: `not.toBeNull` appears only in the `invoke_skill` trio and the zero-comment variant only outside `no_skill`. So "seven" is the correct grouping and the table's note column is what is off by one row. | WARNING (accuracy) | **Determinate fix, one row:** add the `shared design` label to `RXF/invoke_skill/2`, keeping its distinguishing nits ("locates the subject by the state under test; containment text match"). Changing "seven" to "six" would instead make the prose disagree with the diffs. Moves NO statistic: `invoke_skill/2` is `partial` either way, so RXF stays 1/0/0, the arms stay 7/6/5, the cross-tab stays 6 and 6, and every Pass@k cell is unaffected. Recorded, not scored as a gap. |
| W2 | `.../EVAL-RESULTS.md` authenticity section | 462-499 | The authenticity COLUMN is the graders' recorded judgment; no grader transcript was committed, so an individual verdict cannot be regenerated the way a mechanical verdict can. | INFO (residual, intrinsic) | Down from a WARNING. This is what branch (b) specified and delivered, and it is intrinsic to a judge dimension. Materially mitigated: the mechanical column IS independently checkable (0/36 mismatches) and individual notes ARE falsifiable against the diffs -- I sampled four beyond RXF and all four held verbatim, and the one that did not hold is W1, found precisely this way. |
| W3 | `.../EVAL-RESULTS.md` | 614-615 | "Per-arm adherence was not computed" for the house-idiom dim. SC3 asks for dims "graded + compared", and for idioms / house style the compare half rests on an assertion rather than a computation. | INFO | Unchanged and does not unseat SC3: the dim IS graded on all 36 specimens, thirteen dims satisfy "many", and declining to make a vocabulary-adjacent proxy an arm comparison is what SC5 / D-08 positively require. Disclosed in the same document. |
| W4 | `.../EVAL-RESULTS.md` | 452-453 | "it inverts to flat on the not-inauthentic reading". It does not invert -- 12 / 12 / 11 is still weakly decreasing in dose, with `invoke_skill` last. | INFO (wording) | Harmless: the actual numbers (1.00 / 1.00 / 0.92) are published two paragraphs above at :420, so a reader can see the flattening is a near-tie and not an inversion. Natural reading is "the ordering flattens", which is true. |

Debt-marker gate: **CLEAN.** `git grep -nE "\b(TBD|FIXME|XXX)\b"` over the three files these commits
touched returns zero hits. ASCII-only and email allowlist-inversion both clean on all three.

### Was the corrected-figure disclosure honest about the cause?

Yes, and this is the part the fix got most right. The CORRECTED block at :441-449 does four things a
quiet restatement would not:

- It states the OLD figures verbatim ("This sentence first read '5 `compile_error` ... 8
  `genuinely_red`'") rather than silently swapping in new ones.
- It names the actual mechanism: both figures were carried out of the DISCARDED v1 grading round into a
  paragraph about the corrected one. That is a specific, checkable root cause, not "a miscount".
- It records that MY inferred replacement was also wrong and why (derived from the stale companion
  figure), which is a correction against the verifier, disclosed rather than buried. I confirmed this
  independently: 6 and 6, from two agreeing sources, and my 7-or-8 does not hold.
- It ties the remedy to the cause in one sentence -- "the figure was wrong because nothing in the tree
  could contradict it" -- and states what the table is FOR. That is the reasoning that justifies branch
  (b) over branch (a), and it is the correct reasoning.

It also declines the easy out. It could have argued the error was harmless (the direction did make the
section's own conclusion look weaker, which it says) and stopped at the cheap branch. It paid for the
auditable one instead.

The monotone-ordering disclosure at :451-455 is likewise the right shape: it names the direction in bold
FIRST (7 > 6 > 5), then argues the tie. The prior implicit ordering is gone.

### Did the repair introduce a fresh instance of the class it repaired?

Asked specifically, because every prior round in this phase did. **Yes, once, in the mildest available
form** -- and the repair's own new artifact is what exposed it.

W1 is a count in NEW prose that does not reconcile with the NEW table it explicitly points at. Same
class as the defect repaired: a figure not checked against its own source data. Three things bound how
much it means:

1. It is a label count in a descriptive column, not a statistic. No published number moves.
2. The prose's substance is TRUE. I verified "7 of 9 the same test" against all nine diffs; the
   pre-existing claim at :424-425 is right, and it is the table row that under-labels.
3. It was FINDABLE only because the table landed. Under the prose-only convention this sentence would
   have been unfalsifiable, exactly like the cross-tab was. The new standard caught its own first error
   on its first pass, which is the standard working rather than failing.

That is why W1 is recorded as a WARNING and not as a gap or an escalation: no truth fails, no artifact is
a stub, no link is unwired, no debt marker exists, and the correct fix is determinate -- I resolved it
from the source diffs and named the one row to change. There is no judgment left for a human to make.

### Gaps Summary

**No gaps, and no human items. The phase goal is achieved and the escalation is genuinely closed.**

The cross-tab reconciles at 6 and 6. I recomputed it twice from independent sources -- the committed
36-row table and the 36 `red-grade.json` files on disk -- and the two agree on all 36 mechanical
verdicts, so they cannot disagree on the cross-tab. My own pass-2 inference of 7 or 8 was wrong for the
reason the fix commit gives, and I confirm that against myself here.

The committed table is internally consistent with every per-arm and per-cell figure the section
publishes: authentic-of-12 at 7 / 6 / 5, per-cell GRC 2/3/2, SRVC 2/1/0, RXF 1/0/0, RXL 2/2/3, the
partial and inauthentic splits, the census at 18/17/1, the looser 1.00/1.00/0.92 reading, and all twelve
Pass@k/Pass^k cells. Fifteen of sixteen checkable figures reproduce exactly.

The sixteenth is W1: the prose says RXF has seven `shared design` rows and the table labels six. It is a
real instance of the repaired class, it is disclosed here rather than waved past, and it is a one-row
determinate fix that moves no statistic -- I read all nine RXF diffs and the seven-member grouping the
prose asserts is the correct one. Worth sweeping when someone is next in the file; not worth a fourth
repair round on its own, and not a decision anyone needs to make.

Nothing regressed. Every item the prior passes verified re-verified clean: `selfcheck-red` exit 0 with
zero SKIPs across cruxes 1-11, both `--selfcheck` entry points exit 0, the tabulator reproduces the real
round to the digit, the round total recomputes to $29.0382, the nine-class gate reads as documented from
source, INT-02's 8 restored assertions still execute in a green battery, the plugin still carries no
build deps, all four trees are pristine after a full toolchain-provisioning run, and the three changed
files are ASCII-clean with no email-shaped token.

---

*Verified: 2026-08-03T00:43:44Z*
*Verifier: Claude (gsd-verifier)*
