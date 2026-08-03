---
phase: 21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i
verified: 2026-08-03T00:20:40Z
status: human_needed
score: 8/8 must-haves verified (plus milestone-audit gap INT-02 verified closed)
behavior_unverified: 0
overrides_applied: 0
re_verification:
  previous_status: human_needed
  previous_score: 7/8 must-haves verified (1 partial -- one named SC3 lift dimension not run)
  gaps_closed:
    - "SC3 / EVL-03.5 book/source authenticity via oracle-reviewer. CLOSED BY MEASUREMENT, not by override. The dimension ran over all 36 captures; every claim in it that can be checked against independent data was independently confirmed in this session (the named inauthentic capture's defect verbatim in its diff, the RXL exact-equality claim across all nine specimens, the RXF 7-of-9 similarity, the corpus rebuild at 36/36, every Pass@k/Pass@3/Pass@5/Pass^3 figure, and per-cell-to-per-arm consistency)."
    - "The REQUIREMENTS.md EVL-03 disclosure gap. The closure note no longer lists authenticity among the graded dims without qualification; it now names the prior overstatement explicitly, records that the owner commissioned the measurement rather than accept the argument, and carries the numbers, the tie framing and the corpus defect."
    - "EVAL-RESULTS.md RXF/RXL per-cell cost split. Recomputed independently: GRC $3.8124, RXF $5.6299, RXL $7.4406, SRVC $12.1553, total $29.0382. The corrected text matches to the cent."
    - "REQUIREMENTS.md round total $29.05 -> $29.04, all 3 occurrences. Recomputed $29.0382 from the 36 pinned captures."
    - "EVL-03.3 class-count wording drift. Refreshed text matches the shipped instrument exactly: the VERDICTS array in grade-red.mjs:79-89 has the same 9 names in the same order, and verdictPass() at :947-949 returns true for genuinely_red and blunt_red only."
    - "Milestone-audit gap INT-02. check-backing.mjs now carries a per-entry dir override (the same spec.dir ?? REFERENCES shape check-red-references.mjs:431 already uses) and the 8 previously-skipped beck-tdd-by-example.md assertions now execute. Mutation-tested in this session: file moved aside -> exit 1, restored -> exit 0, sha256 identical, tree clean. NOT fail-open: report(false) increments failures, so a missing file still exits 1."
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "Decide the evidence standard for the oracle-reviewer authenticity dimension, and correct the one figure in it that is provably wrong. The section reports numbers that no later reader can re-derive: no per-specimen verdicts, no grader outputs and no corpus were committed, so the entire result rests on the narrative in EVAL-RESULTS.md plus an orchestrator attestation. That recording convention is not new -- it is how this phase records every graded dim (blind judge dims 1-2, classify-first, house-idiom, the unbiased reviewer), and the prior verification accepted it for all of them. What elevates it here is that the ONE figure in the section that could be cross-checked against independent data is wrong. The sentence 'Cross-tabulated, 5 compile_error captures still graded authentic in design while 8 genuinely_red captures graded only partial' (EVAL-RESULTS.md:436-437) cannot be true. Taking the mechanical verdicts off disk (GRC 9 genuinely_red; SRVC 8 genuinely_red + 1 unattributable; RXF 9 compile_error; RXL 2 genuinely_red + 7 compile_error) together with the document's own per-cell authentic counts (GRC 7 of 9, SRVC 3, RXF 1, RXL 7), the number of authentic-and-compile_error captures is bounded to [6, 8]; 5 is impossible under every assignment. The companion figure resolves it: '8 genuinely_red graded only partial' implies 10 authentic-and-genuinely_red, hence 8 authentic among the compile_error-or-unattributable set, hence 7 or 8 authentic-and-compile_error. So the '5' is a miscount and the self-consistent value is 7 or 8. Recomputation script and bound are reproducible from the captures. Decide: (a) correct the figure and accept prose-only recording as this phase's established convention for graded dims, or (b) commit the per-specimen authenticity verdicts (36 rows: cell, arm, run, verdict, one-line reason) so the axis becomes auditable the way the mechanical dims are, and recompute the cross-tab from them."
    expected: "Two outcomes, and they are separable. The figure correction is determinate and needs no judgment: replace 5 with the recomputed value. The evidence-standard choice is the actual decision. Under (a) the section stays as written with the figure fixed, and EVL-03 stays Complete -- defensible, because the direction of the error makes the section's own conclusion ('authenticity does not track the mechanical gate') STRONGER, not weaker, and no headline, arm verdict or Pass@k figure depends on the cross-tab. Under (b) a 36-row verdict table lands next to EVAL-RESULTS.md and the cross-tab is derived rather than asserted, which also makes the remaining unverifiable per-cell splits (GRC 2/3/2, SRVC 2/1/0, RXF 1/0/0, RXL 2/2/3) checkable by the milestone audit and by any future round that wants to compare against this one."
    why_human: "Not resolvable by me and not a defect I can close. The dimension genuinely ran -- I confirmed that against the artifacts on several independent axes, including one detail a fabricated report would not survive: the single inauthentic verdict names GRC/invoke_skill/run-1, and that capture's diff does contain, verbatim, the defect the grader described (it asserts item.quality toBe(-1) against already-working normal-item behavior, with an inline comment reading 'Lock in the revealed value to go green'). So this is not a trust question about whether the pass happened. It is a scope and rigor judgment about what standard of evidence a requirement-closing figure must meet, taken with direct evidence that this section's hand-computed figures were not fully checked. Choosing between accepting the convention and raising the bar is the owner's call, and the answer has cost implications for future rounds that want to reuse this baseline. Escalation gate."
---

# Phase 21: Applied RED Eval in Real OSS Repos (multi-dimensional, 3-arm) Verification Report

**Phase Goal:** lz-red is validated on REAL applied work -- driving the next failing (red) test in real
OSS TypeScript repos with short, basic, human-style prompts -- across three arms and graded on many
lift dimensions, mirroring the lz-refactor Phase 13/14 apply evals (not coaching prose over synthetic
snippets).

**Verified:** 2026-08-03T00:20:40Z
**Status:** human_needed
**Re-verification:** Yes -- third pass, replacing the 2026-08-02T23:27:33Z verdict.

## What changed since the prior verdict, and what I did about it

Four commits landed. I verified each against the tree rather than against its commit message, and I
re-ran the regression battery on the items the prior pass had already marked VERIFIED.

The headline: **the PARTIAL is closed by measurement.** The owner did not take the override branch the
prior report offered. The oracle-reviewer authenticity pass ran, so SC3's last unmeasured lift
dimension is measured rather than argued. Truth 5 moves from PARTIAL to VERIFIED and the score is 8/8.

I did not accept the authenticity result on the strength of its own prose. I attacked its checkable
claims one at a time (see Behavioral Spot-Checks). They held, including one that a fabricated report
would not survive. I also found one figure in it that is provably wrong, which is what drives the
single remaining human item.

## Goal Achievement

### Observable Truths

Same must-haves as the prior pass: ROADMAP Success Criteria SC1-SC5 merged with the four plans'
`must_haves.truths`, plus the prior verdict's gated RUN item.

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | (SC1/EVL-03.1) Short human-style APPLY prompts drive the next failing test in >= 1 real OSS TypeScript repo; byte-identical across arms except the target path; real applied output is captured and graded, not coaching prose. | VERIFIED (regression clean) | Unchanged by these commits. Re-confirmed structurally: the pinned round is the canonical `results/apply/` trees x {no_skill, with_skill, invoke_skill} x targets {r1, r2}, which enumerates to exactly 36 captures, each with `diff.patch`, `answer.md`, `meta.json`, `outputs/`, `red-grade.json`. `selfcheck-red` cruxes 1-3 (composition, prompt parity, worktree base) re-run exit 0 this session. |
| 2 | (SC2/EVL-03.2) Three OWN-skill arms compose and ran; with_skill vs invoke_skill surfaces the trigger gap; the lz-refactor suites still compose unchanged. | VERIFIED (regression clean) | `selfcheck-red` exit 0 with ZERO SKIPs, cruxes 1-11 all present, including crux 6 twice over: the default lz-refactor nx suite still composes 3 arms with `plugins/lz-tdd`, and the lz-refactor apply preamble is byte-for-byte unchanged. Trigger gap re-tabulated from the real round in this session: with_skill fired GRC 1.00, SRVC 1.00, RXF 0.33, RXL 0.67 = 9/12, against `avail 1.00 / force 1.00` in every cell. |
| 3 | (EVL-03.3) A mechanical D-06 correctness GATE classifies the produced test and passes only a genuinely-red-for-the-right-reason test, failing closed on garbled input. | VERIFIED -- and the wording drift I flagged is now CLOSED | `grade-red.mjs --selfcheck` exit 0. The prior pass recorded a documentation drift (recorded criterion said seven classes passing only `genuinely_red`, while enumerating six). The refreshed EVL-03.3 text now matches the shipped instrument exactly, which I checked against source rather than against the commit message: `VERDICTS` at `grade-red.mjs:79-89` lists the same nine names in the same order, and `verdictPass()` at `:947-949` is `verdict === 'genuinely_red' \|\| verdict === 'blunt_red'` -- "passes exactly two of them" is literally the shipped predicate. |
| 4 | (EVL-03.4) Mechanical lift dims tabulate from the stream-json meta, and Pass@k/Pass^k compute on the correctness gate, not a vocabulary proxy. | VERIFIED (regression clean) | `tabulate-mechanical-red.mjs --selfcheck` exit 0, and re-run against the REAL round in this session it again reproduces every published wall/cost/turn/tool figure to the digit (GRC 111/0.38/10, 92/0.46/11, 137/0.43/10; SRVC 231/1.32/22, 258/1.49/21, 222/1.25/18; RXF 169/0.59/13, 186/0.68/14, 172/0.62/13; RXL 189/0.63/15, 264/0.98/20, 268/0.86/17) plus the 9/12 trigger rate. |
| 5 | (SC3/EVL-03.5) The produced tests are graded and compared on the lift dimensions named in SC3, including book/source authenticity against the owned `.oracle/` RED sources via oracle-reviewer (DST-04). | **VERIFIED** -- was PARTIAL; closed by measurement, not by override | Every dimension SC3 names is now measured: wall-clock, tool usage, token usage (mechanical, reproduced by me), correctness (D-06 gate + Pass@k), output quality (blind judge dims 1-2), **book/source authenticity via oracle-reviewer (RUN 2026-08-02, EVAL-RESULTS.md:394-466)**, idioms and house style (house-idiom adherence, graded on all 36, labeled CONTEXT-ONLY per D-08), and the TDD RED practices: right next test (judge dim 1), fail-for-right-reason (the gate's `rightReason`), assert observable behavior (judge dim 2), classify-first (its own section), handoff (coach-don't-drive via `changed_production_files`). Thirteen dims; "many" is amply satisfied. The authenticity pass is independently corroborated on every claim I could check -- see Behavioral Spot-Checks rows 8-12. Two recorded notes, neither of which unseats the truth: the cross-tab figure at :436-437 is provably wrong (W1), and per-arm house-idiom aggregation was deliberately not computed (W3). |
| 6 | (SC4/EVL-03.6) The harness reuses the lz-refactor apply pattern with no build deps in `plugins/lz-tdd`; per-run byproducts are git-ignored; the metered run was user-gated; borrowed repos are pristine. | VERIFIED (regression clean, tested harder than at rest) | All three borrowed repos report 0 dirty entries after every command I ran, including a full 36-capture `git apply` reproduction (which I confined to the scratchpad) and a `worktree prune`. `plugins/lz-tdd` still has no `package*.json` and no `node_modules`. `git status --porcelain` on the plugin repo is empty after the tabulator rewrote three `mechanical-red.json` files, so gitignore coverage holds under write. `D:/.lz-red-grade-tmp` and `C:/.lz-red-grade-tmp` are both empty. |
| 7 | (SC5/EVL-03.7) Results are recorded with Pass@k/Pass^k + >= 1 unbiased from-scratch reviewer, and the substance-only comparison is the headline wherever a vocabulary proxy is used. | VERIFIED | Unchanged and re-confirmed. Pooled correctness "as tabulated" (0.50 / 0.50 / 0.58) matches my own per-arm pass counts off disk (6 / 6 / 7 of 12). The authenticity table added by these commits follows the same pooling convention (n=12 per arm) and reports the conservative Pass^3 column alongside Pass@k rather than only the flattering one. The one vocabulary-adjacent dim stays labeled CONTEXT-ONLY and never becomes the headline. |
| 8 | (Prior verdict's gated item) The metered 3-arm apply RUN happened on fresh approval and its results are real, reproducible and grader-regime-invariant. | VERIFIED (regression clean) | Round cost recomputed a second time from the captures' own `total_cost_usd`, pinned structurally: 36 runs, $29.0382 -> $29.04, mean $0.8066. Verdict census off disk unchanged: GRC 9/9 `genuinely_red`; RXF 9/9 `compile_error`; RXL 2 passes, both `run-1` on the two skill-bearing arms; SRVC 3/3, 2/3 with one `unattributable`, 3/3. Each grade records its `apply_base` (`ac6a0335` GRC, `4a7390a2` radix both cells, `55d90b39` srvx) and `checker` (`tsc` / `atc`). |

**Score:** 8/8 must-haves verified; 0 FAILED; 0 present-but-behavior-unverified; 0 overrides applied.

### Additional item assessed (milestone-audit gap, not a Phase-21 must-have)

| Item | Status | Evidence |
|------|--------|----------|
| INT-02 -- `check-backing.mjs` re-pointed at the relocated Beck reference | VERIFIED CLOSED, and the fix is NOT fail-open | The battery now emits all 8 previously-skipped `beck-tdd-by-example.md` assertions (6 topics + no-oracle tag + no scaffold phrase) and the full 10-checker lz-refactor battery is GREEN end to end. The `dir` override is the existing repo pattern, not a new one: `check-red-references.mjs:431` already reads `path.join(spec.dir ?? REFERENCES, spec.name)`, and `check-backing.mjs:102` is now the same expression. Fail-closed proven two ways. By source: the missing-file branch at `:104-107` calls `report(false, ...)`, which increments `failures` at `:87-89`, and `:127-133` exits 1 on any failure -- there is no `existsSync` tolerated-absence path. By mutation, run in this session: file moved aside -> exit 1; restored -> exit 0; sha256 identical before and after (`32b19114...60cd2`); `git status` clean. |

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `.claude/skills/lz-refactor-workspace/tools/check-backing.mjs` | INT-02 fix, fail-closed | VERIFIED | +10/-1. Comment records the relocation and states why an `existsSync` skip was rejected. Mutation-tested both directions in this session. |
| `.../e2e-red-gilded-rose/EVAL-RESULTS.md` | filled results record, all SC3 dims | VERIFIED (one figure wrong -- W1) | 631 lines. Cost split corrected and matching my recomputation to the cent; the superseded `$3.87 / $9.20` pair survives only inside the CORRECTED parenthetical, which is the right place for it. New 73-line authenticity section with the null, the tie framing, the corroboration, the RXL finding, the corpus-defect disclosure and a caveats paragraph. Zero non-ASCII bytes; zero email-shaped tokens. |
| `.planning/REQUIREMENTS.md` (EVL-03) | requirement closed against evidence, no overstatement | VERIFIED -- prior disclosure gap CLOSED | `$29.05` gone from all 3 occurrences. EVL-03.3 refreshed to the shipped 9-class / passes-2 gate. The EVL-03 note now names its own prior overstatement in so many words ("THIS line previously listed it among the graded dims, which overstated coverage"), records the owner's choice to measure rather than argue, and carries the null, the two-specimen tie caveat and the corpus defect. Zero non-ASCII; zero email-shaped tokens. |
| `.../e2e-red-gilded-rose/RUN-GATE.md` | the gate contract | VERIFIED (unchanged) | Step 4.3 prescribes the oracle-reviewer pass; it is now exercised rather than only documented. |
| Per-specimen authenticity verdicts | auditable trail for the new dimension | **ABSENT** | No file anywhere in the workspace matches `*authentic*` or `*oracle*`, and the apply capture dirs contain no grader output. Recorded rather than scored as a defect: this is the phase's established convention for every graded dim (the blind-judge, classify-first, house-idiom and unbiased-reviewer results are likewise prose-only, and the prior pass marked all of them VERIFIED). It is the substance of the human item. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `check-backing.mjs` FILES entries | `plugins/lz-tdd/references/` | `spec.dir ?? REFERENCES` | WIRED, and FLOWING | The 8 assertions that were being skipped now execute and pass. Mutation-tested closed. |
| `RUN-GATE.md` Step 4.3 | oracle-reviewer vs `.oracle/` | prescribed post-run pass | **WIRED and EXERCISED** -- was NOT EXERCISED | The prior pass's one open link. Now run over all 36 captures. Corroborated by content I could check against the artifacts, not by the claim alone. |
| `red-grade.json` verdicts | authenticity cross-tab | hand-computed cross-tabulation | **NOT VERIFIED** | The only link in the phase that fails a check. The published cross-tab figure is inconsistent with the mechanical verdicts it claims to cross against. See W1. |
| `grade-red.mjs` red-grade.json | `tabulate-mechanical-red.mjs` | shared `verdict` / `pass` shape | WIRED, and FLOWING | 36 real grades consumed; output matches the publication. |
| `run-e2e.mjs` TRACK_SKILLS | `suite.json` trackSkills | suite-driven param, lz-refactor default | WIRED | selfcheck crux 6 re-confirms the nx regression. |

### Data-Flow Trace (Level 4)

The live question for a results phase is whether published numbers flow from real classifier output or
from a hand-written table. Traced again this session and FLOWING for everything mechanical:
36 real `meta.json` + `diff.patch` -> `grade-red.mjs` -> `red-grade.json` -> `tabulate-mechanical-red.mjs`
-> figures matching EVAL-RESULTS.md to the digit, plus a cost total recomputed independently at
$29.0382.

The authenticity dimension is the one branch where the trace stops short of the numbers. Its INPUT is
provably real and reproducible: I rebuilt the corrected corpus myself from the captures and it applies
36/36. Its OUTPUT (the 36 verdicts) exists only as aggregates in prose, so the per-cell splits cannot
be re-derived. That asymmetry is what the human item is about.

### Behavioral Spot-Checks

All run by me in this session; zero metered spend.

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| INT-02 battery green | `node check-backing.mjs` | exit 0; all 8 `beck-tdd-by-example.md` assertions now emitted | PASS |
| INT-02 fix is fail-closed | move the reference aside, re-run, restore | exit 1 mutated / exit 0 restored; sha256 identical; tree clean | PASS |
| Full lz-refactor battery | `npm --prefix .claude/skills/lz-refactor-workspace run check` | 10/10 checkers GREEN, hygiene GREEN over 197 files | PASS |
| Per-cell cost split recomputed | sum `total_cost_usd` over the structurally pinned 36 | GRC $3.8124, RXF $5.6299, RXL $7.4406, SRVC $12.1553, total $29.0382 -- corrected text matches to the cent | PASS |
| EVL-03.3 wording vs instrument | read `VERDICTS` and `verdictPass()` in source | 9 names, same order; passes exactly `genuinely_red` and `blunt_red` | PASS |
| Authenticity Pass@k / Pass^k arithmetic | recompute `1 - C(n-c,k)/C(n,k)` and `C(c,k)/C(n,k)` at n=12 | all twelve cells reproduce exactly (0.58/0.95/1.00/0.16, 0.50/0.91/0.99/0.09, 0.42/0.84/0.97/0.05) | PASS |
| Authenticity per-cell vs per-arm consistency | sum the per-cell splits | 7 / 6 / 5 by arm and 18 / 17 / 1 by verdict, both summing to 36 | PASS |
| **The named inauthentic capture really is defective** | read `GRC/invoke_skill/r1/run-1/diff.patch` | The grader's reason is verbatim true. The test replaces the stub with an already-implemented normal-item case, asserts `item.quality).toBe(-1)`, and carries the comment "RED sentinel: this value is deliberately wrong ... Lock in the revealed value to go green" -- fabricated red plus adopting whatever the implementation emits, exactly as described, and the same capture the blind judge and classify-first independently flagged | PASS (strong) |
| RXL substring-hazard claim | assertion scan over all nine RXL specimens | all nine use `toBe` exact equality on a locale identifier (`fr-FR`, `de-DE`, `de`, `ltr`); zero `toContain` / `toMatch` / `startsWith`; none asserts rendered month text | PASS |
| RXF "7 of 9 the same test" claim | added-line counts per RXF specimen | 16/15/33/14/14/29/14/14/14 -- seven in a 14-16 band, two outliers | PASS (consistent) |
| **Corpus rebuild reproduced end to end** | `git show <recorded apply_base>:<path>` then `git apply`, all 36 | 36/36 applied, 0 failures, and every produced spec carries an import plus an invoking call -- the context a `+`-lines-only extraction drops | PASS |
| Authenticity cross-tab figure | bound authentic-and-compile_error from the disk verdicts + the doc's per-cell counts | bounded to [6, 8]; the document says 5 | **FAIL -- see W1** |
| Full crux battery | `node selfcheck-red.mjs` | exit 0, ZERO SKIPs, cruxes 1-11 | PASS |
| Grader / tabulator / merge selfchecks | `--selfcheck` on all three | exit 0 each | PASS |
| Mechanical dims on the REAL round | `node tabulate-mechanical-red.mjs` | every published wall/cost/turn/tool figure and the 9/12 trigger rate reproduced | PASS |
| lz-red reference battery | `npm --prefix .claude/skills/lz-red-workspace run check` | RED-REFS GREEN 11/11, roster integrity 124 checks | PASS |
| Plugin / marketplace structure | `claude plugin validate .` | Validation passed | PASS |
| Trees pristine after everything | `git status --porcelain` on plugin repo + all 3 borrowed repos | 0 dirty entries everywhere; both grade-tmp dirs empty | PASS |
| ASCII + email allowlist-inversion | non-ASCII and email-token scan over the three changed files | 0 non-ASCII; 0 email-shaped tokens, so nothing to compare against the approved address | PASS |

One process note for reproducibility, my own doing and not a tree defect: my first `selfcheck-red`
invocation hit a 2-minute tool timeout and was killed mid-canary, which stranded a grading worktree at
`D:/.lz-red-grade-tmp/red-wt-RXF-...`. The next clean run correctly FAILED on crux 7 for exactly that
strand -- the teardown canary works. I removed the worktree, pruned, confirmed the radix repo clean,
and re-ran to exit 0. Anyone re-running `selfcheck-red` should allow well over two minutes; it copies
target toolchains per suite.

### Probe Execution

No `scripts/*/tests/probe-*.sh` convention exists in this project. The phase's `--selfcheck` entry
points serve that role and are covered above; all were executed in this process.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| EVL-03 (overall) | 21-01 (formalized) | APPLY-based, 3-arm, multi-dim RED eval | SATISFIED | Every SC3 lift dimension is now measured. The closure note no longer overstates coverage; it discloses its own prior overstatement. |
| EVL-03.1 | 21-01 / 21-03 | Byte-identical, non-leading prompt across arms | SATISFIED | Regression clean. |
| EVL-03.2 | 21-01 / 21-03 | Three-arm composition | SATISFIED | selfcheck cruxes 1-3, 6 plus live `avail`/`force` from the round. |
| EVL-03.3 | 21-02 | D-06 correctness classifier | SATISFIED -- wording drift CLOSED | Refreshed text checked against `VERDICTS` and `verdictPass()` in source. |
| EVL-03.4 | 21-03 | Mechanical dims + Pass@k/Pass^k | SATISFIED | Reproduced against the real round again. |
| EVL-03.5 | 21-03 / 21-04 | Judge wiring (BUILD) + judge and authenticity verdicts (RUN) | **SATISFIED** -- was BUILD SATISFIED / RUN PARTIAL | Blind-judge verdicts filled; authenticity now RUN and corroborated. One figure in it is wrong (W1) and the per-specimen trail is absent (human item). |
| EVL-03.6 | 21-01 / 21-04 | No plugin deps; gitignored byproducts; gated run | SATISFIED | Verified under write and after a 36-capture apply reproduction. |
| EVL-03.7 | 21-03 / 21-04 | Recorded results, Pass@k/Pass^k, unbiased reviewer, substance-only headline | SATISFIED | Unchanged; the new section follows the same pooling and reports Pass^3. |

No orphaned requirements: REQUIREMENTS.md maps only EVL-03 to Phase 21 and all four plans declare
`requirements: [EVL-03]`.

### Anti-Patterns Found

| # | File | Line | Pattern | Severity | Impact |
|---|------|------|---------|----------|--------|
| W1 | `.../EVAL-RESULTS.md` | 436-437 | "Cross-tabulated, 5 `compile_error` captures still graded authentic in design while 8 `genuinely_red` captures graded only partial." The 5 is impossible. From the on-disk verdicts (RXF 9 `compile_error`; RXL 2 `genuinely_red` + 7 `compile_error`; GRC 9 and SRVC 8 `genuinely_red` + 1 `unattributable`) plus the document's own per-cell authentic counts (7 / 3 / 1 / 7), authentic-and-`compile_error` is bounded to [6, 8]. The companion "8 `genuinely_red` partial" pins it at 7 or 8. | WARNING (accuracy) | No headline, arm verdict or Pass@k figure depends on it, and the error's direction makes the section's own conclusion ("authenticity does not track the mechanical gate") stronger rather than weaker. Its real weight is as a signal: it is the one figure in an otherwise unauditable section that could be cross-checked, and it did not survive. Folded into the human item. |
| W2 | `.../EVAL-RESULTS.md` authenticity section | 394-466 | The result is reported entirely as aggregates in prose. No per-specimen verdicts, no corpus and no grader outputs were committed, so the per-cell splits cannot be re-derived by a later reader or by the milestone audit. | WARNING (auditability) | Not scored as a defect, because it is this phase's established convention: the blind-judge, classify-first, house-idiom and unbiased-reviewer results are recorded the same way and the prior pass marked all of them VERIFIED. Raising the bar for one dim only would be inconsistent. It is the decision in the human item. |
| W3 | `.../EVAL-RESULTS.md` | 548-549 | "Per-arm adherence was not computed: this is a context-only dimension and no per-arm pattern was apparent at cell level." SC3 asks for dims "graded + compared", and for idioms / house style the compare half rests on an assertion rather than a computation. | WARNING (precision) | Does not unseat SC3: the dim IS graded on all 36 specimens, "many" is satisfied by thirteen dims, and declining to make a vocabulary-adjacent proxy an arm comparison is what SC5 / D-08 positively require. Disclosed in the same document. But note the REQUIREMENTS phrase "every SC3 lift dimension measured rather than argued" is exactly true on "measured" and glosses this one uncomputed aggregation. |
| W4 | `21-LEARNINGS.md`, `21-04-SUMMARY.md` | 212, 83 | The corrected round total did not propagate: both still record `$29.05` against the measured `$29.0382` -> `$29.04`. The SUMMARY instance is a blockquote of the then-current REQUIREMENTS text; the LEARNINGS instance is a bare assertion. | INFO | One-cent drift, now inconsistent with the canonical figure in two tracked planning docs. Cheap to sweep while the correction is fresh. |
| W5 | `.../EVAL-RESULTS.md` | 404-420 | The three arms order monotonically against skill dose (7 > 6 > 5), which is the pattern that would matter most if it were real. The section names the direction in bold and argues the tie on n, on single-specimen craft calls, on a grader's split swinging 3/6 -> 7/2 -> 1/8 on one tie-breaker, and on the flat looser reading -- but it never names the monotonicity as such. | INFO | Not a dishonesty finding. The disclosure is genuinely good and symmetric (see the honesty assessment below). Naming the monotone ordering would make the caveat harder to read past. |

Debt-marker gate: CLEAN. `git grep -nE "\b(TBD|FIXME|XXX)\b"` over the three files these commits
touched returns one hit, `check-backing.mjs:14`, which is a comment enumerating the scaffold phrases
the checker searches FOR. Not a debt marker. ASCII-only and email allowlist-inversion both clean.

### Honesty assessment of the null result

Asked specifically. The two-specimen spread favoring the baseline is presented as a **tie**, and that
is the correct call as written:

- The direction is stated in bold and not buried: "There is no authenticity lift, and the baseline is
  nominally ahead."
- No lift is claimed anywhere, and the reverse reading is explicitly refused: "Read this as a tie, NOT
  as a reverse effect."
- The tie is argued from evidence rather than asserted: n=12 per arm, single-specimen craft calls the
  graders themselves called re-derivable, one grader's split swinging 3/6 -> 7/2 -> 1/8 on a single
  secondary tie-breaker, and the looser not-inauthentic reading coming out flat at 1.00 / 1.00 / 0.92
  (which I verified: 12/12, 12/12, 11/12).
- The conservative Pass^3 column (0.16 / 0.09 / 0.05) is published alongside Pass@k rather than only
  the flattering aggregate.
- **The discipline is symmetric.** The blind-judge section calls its lone dim-1 miss noise even though
  that miss also sits on a skill-bearing arm and also favors the baseline. Applying the same standard
  to a two-specimen authenticity gap is consistent, not selectively lenient. The section says so.
- The prediction that motivated the original skip is reported as having been VINDICATED, which would
  have been the easy place to quietly reinstate the skip as retroactively justified. Instead the owner
  paid for the measurement first and reported the prediction's confirmation second.

On the corpus-bug disclosure: adequate, and stronger than most. It names the defect (only `+` lines
extracted), names it as a repeat of the documented first-corpus bug, names the mechanism (modified
tests read as never invoking anything), names the observable symptom (the GRC grader failing four specs
for an unbound identifier), states the discarded figure explicitly (GRC 4 authentic of 9) and says
DISCARDED not averaged, documents the rebuild path, and states the delta (4 -> 7). The commit message
adds the attribution: "I introduced the documented first-corpus bug." I reproduced the rebuild myself
and it applies 36/36, so the recovery path is real and not just asserted. Two completeness gaps for a
later reader: the discarded first-round figures for SRVC, RXF and RXL are not given (only that they
were regraded on the corrected corpus, so all published numbers are post-correction), and neither
corpus was committed, so none of the recovery can be re-inspected. Neither is misleading; both are
audit-trail thinness of the same kind as W2.

### Gaps Summary

No gaps. The phase goal is achieved and, unlike the prior two passes, no named SC3 dimension is left
argued rather than measured.

What the three fix commits actually did, checked rather than taken on faith: INT-02 is closed with a
fix that I mutation-tested as fail-closed in both directions, using a pattern that already existed in
the tree rather than a new one, and it restored 8 assertions that had been silently skipped -- the
commit's characterization of the bug as worse than one red check is correct. All three accuracy
corrections are right as now written; I recomputed the cost split and the round total from the captures
independently and read the class set out of `grade-red.mjs` source, and all three match. The PARTIAL is
closed by measurement rather than by the override the prior report offered, which is the harder and
better branch.

One item is open and it is an escalation, not a defect I can close. The authenticity section is the one
place in this phase where a published figure fails an independent check: its cross-tab claims 5
`compile_error` captures graded authentic where the verdicts on disk bound that number to [6, 8], and
its own companion figure pins it at 7 or 8. The correction itself is determinate and needs no judgment.
What needs a human is the standard: that section's remaining figures cannot be re-derived by anyone
because no per-specimen verdicts were committed, and the single figure that could be cross-checked was
wrong. Whether to accept prose-only recording for a requirement-closing dimension -- which is this
phase's established convention for every graded dim, and which the prior pass accepted four times over
-- or to commit the 36-row verdict table and derive the cross-tab from it, is the owner's call.

Worth an owner glance and no more: the corrected round total did not propagate to `21-LEARNINGS.md` or
`21-04-SUMMARY.md`, per-arm house-idiom adherence is asserted rather than computed with a defensible
D-08 reason and a plain in-document disclosure, and the authenticity ordering is monotone in skill dose
without the section naming that fact.

---

*Verified: 2026-08-03T00:20:40Z*
*Verifier: Claude (gsd-verifier)*
