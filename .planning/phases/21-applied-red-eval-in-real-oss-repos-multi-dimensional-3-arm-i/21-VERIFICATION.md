---
phase: 21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i
verified: 2026-08-02T23:27:33Z
status: human_needed
score: 7/8 must-haves verified (1 partial -- one named SC3 lift dimension not run)
behavior_unverified: 0
overrides_applied: 0
re_verification:
  previous_status: human_needed
  previous_score: 7/7 BUILD must-haves verified (1 RUN item legitimately gated)
  gaps_closed:
    - "The blocking-human metered-run approval gate (21-04 Task 3 / RUN-GATE.md). DISCHARGED: the round ran 2026-07-27/28, 36 captures exist on disk with real cost data, and every published number reproduces from them."
    - "EVL-03.5 RUN half, blind-judge verdicts -- filled (two dims per judge, 4 dims across two passes, faithful corpus)."
    - "EVL-03.7 RUN half, recorded numbers -- filled (per-cell + pooled Pass@k/Pass^k, mechanical dims, unbiased reviewer, substance-only headline)."
  gaps_remaining:
    - "EVL-03.5 RUN half, book/source authenticity axis: the oracle-reviewer pass named in ROADMAP SC3, EVL-03.5 and RUN-GATE Step 4.3 was NOT RUN. Disclosed in EVAL-RESULTS.md; NOT disclosed in the REQUIREMENTS.md EVL-03 closure note, which lists the dimension and marks the requirement Complete."
  regressions: []
human_verification:
  - test: "Decide the disposition of the one lift dimension in ROADMAP SC3 / EVL-03.5 that was never measured: book/source authenticity of the produced tests against the owned .oracle/ RED sources via oracle-reviewer (DST-04). EVAL-RESULTS.md line 386 records it as NOT RUN with the rationale that RESEARCH A5 predicted low discriminating power for a test artifact versus a named refactoring, and that with correctness and design both at parity there is no signal for it to separate. Verify that rationale is one you still accept, then pick a branch. Note the closure is cheap either way: all 36 diff.patch captures are on disk, so branch (b) costs in-session agent tokens only and no metered claude -p spend."
    expected: "One of two explicit outcomes. (a) ACCEPT the deliberate skip: record it as a verification override in this file's frontmatter (must_have: 'book/source authenticity via oracle-reviewer (DST-04)', with reason, accepted_by, accepted_at), AND amend the REQUIREMENTS.md EVL-03 closure note so it names the unmeasured dimension -- that note currently lists 'book/source authenticity via oracle-reviewer' among the graded dims and marks EVL-03 Complete without disclosing the skip, so the requirement row overstates coverage relative to the results file. (b) COMMISSION the pass: run oracle-reviewer over the captured produced tests per RUN-GATE Step 4.3, fill the row in EVAL-RESULTS.md, then re-verify."
    why_human: "Not a defect and not programmatically resolvable. The oracle-reviewer path is built, wired and proven (merge-judge --selfcheck exit 0; RUN-GATE Step 4.3 prescribes it), so nothing is broken to fix. What is outstanding is a scope judgment -- whether an axis the owner reasoned has no discriminating power on this corpus is worth measuring -- and the wording of the disclosure follows from that choice. Escalation, not gap closure."
---

# Phase 21: Applied RED Eval in Real OSS Repos (multi-dimensional, 3-arm) Verification Report

**Phase Goal:** lz-red is validated on REAL applied work -- driving the next failing (red) test in real
OSS TypeScript repos with short, basic, human-style prompts -- across three arms and graded on many
lift dimensions, mirroring the lz-refactor Phase 13/14 apply evals (not coaching prose over synthetic
snippets).

**Verified:** 2026-08-02T23:27:33Z
**Status:** human_needed
**Re-verification:** Yes -- replaces the 2026-07-23 verdict, which gated on the then-unrun metered
round. That gate is now discharged; a different, smaller item remains open.

## What changed since the prior verdict

The prior report verified the BUILD 7/7 and classified the phase `human_needed` on a single item: the
blocking-human approval for the metered 3-arm apply run. That run has since happened, so this
verification covers ground the prior one could not: the RUN sub-criteria (EVL-03.5 verdicts, EVL-03.7
recorded numbers) are now verifiable against captured artifacts rather than against a scaffold.

I did not take the run's existence on the word of SUMMARY.md, REQUIREMENTS.md, EVAL-RESULTS.md or
21-UAT.md. I recomputed it. Every headline number in EVAL-RESULTS.md was independently reproduced from
the 36 on-disk captures in this session (see Behavioral Spot-Checks). One new open item surfaced that
neither the prior verification nor the autonomous UAT covered.

## Goal Achievement

### Observable Truths

Merged from ROADMAP Success Criteria SC1-SC5 (the contract) and the four plans' `must_haves.truths`.

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | (SC1/EVL-03.1) Short human-style APPLY prompts drive the next failing test in >= 1 real OSS TypeScript repo; byte-identical across arms except the target path; real applied output is captured and graded, not coaching prose. | VERIFIED | 3 real repos, 4 cells: GRC (Gilded Rose kata), SRVC (h3js/srvx, Vitest), RXF + RXL (radix-ng). 36 captures on disk, each with `diff.patch` (36/36 present, 0 empty), `answer.md`, `meta.json`, `outputs/`, `red-grade.json` -- the graded artifact is the diff, not prose. Prompt parity recomputed from the captures' own `prompt_used`: SHA-identical between `no_skill` and `with_skill` in ALL FOUR cells (GRC d9c656c84940/378 B, RXF e5d592a52f46/546 B, RXL 2efd6e15320f/554 B, SRVC 1a3d9d4b3c21/510 B); `invoke_skill` is exactly 15 bytes longer in every cell, the length of `/lz-tdd:lz-red `. Non-leading confirmed: the whole prompt body is one sentence naming only the path, and `git grep -niE "conjured\|degrade\|expected\|assert"` over `prompts/` returns nothing. |
| 2 | (SC2/EVL-03.2) Three OWN-skill arms compose and ran: `no_skill`, `with_skill` (genuine `--plugin-dir` auto-trigger), `invoke_skill` (slash force-invoke); with_skill vs invoke_skill surfaces the trigger gap; the lz-refactor suites still compose unchanged. | VERIFIED | Live dry-run from repo root: 3 argv lines; `--plugin-dir ...plugins\lz-tdd` present on with_skill + invoke_skill and absent on no_skill; invoke_skill's `-p` starts with `/lz-tdd:lz-red `. Trigger gap measured, not asserted: with_skill model-fired 9/12 (GRC 3/3, SRVC 3/3, RXF 1/3, RXL 2/3) against invoke_skill `avail 1.00 / force 1.00` in every cell, reproduced by my own re-tabulation. Default nx suite still composes 3 arms (regression clean); `selfcheck-red` crux 6 independently asserts the lz-refactor apply preamble is byte-for-byte unchanged. mattpocock competitor correctly DEFERRED per D-05. |
| 3 | (EVL-03.3) A mechanical D-06 correctness GATE classifies the produced test and passes only a genuinely-red-for-the-right-reason test, via differential typecheck + the target's own runner JSON, failing closed on garbled input. | VERIFIED (with a wording-drift note) | `node grade-red.mjs --selfcheck` re-run here: exit 0, every class proven offline against runnable fixtures plus synthetic classify() assertions, with each new rule discriminated against the pre-change rule. Fail-closed paths throw (empty diff, null/empty runner JSON, killed/failed spawn, unparseable atc payload, vacuous differential, differential collapse). Live-tree drift, recorded not hidden: the class set is now NINE (`blunt_red` and `unattributable` added post-phase) and `verdictPass()` admits `blunt_red`, so the literal 21-02 / EVL-03.3 wording "seven classes, passes ONLY genuinely_red" no longer describes the shipped grader. Substance is intact and measured: no capture in this round grades `blunt_red`, and all 36 re-graded with zero verdict changes, so the phase's published numbers are grader-regime-invariant. See Anti-Patterns W4. |
| 4 | (EVL-03.4) Mechanical lift dims tabulate from the stream-json meta, and Pass@k/Pass^k compute on the correctness gate, not a vocabulary proxy. | VERIFIED | `node tabulate-mechanical-red.mjs --selfcheck` exit 0. Stronger check: I ran the tabulator against the REAL captured round and it reproduced the published tables exactly -- wall/cost/turns per cell and arm match to the digit (GRC 111/0.38/10, 92/0.46/11, 137/0.43/10; SRVC 231/1.32/22, 258/1.49/21, 222/1.25/18; RXF 169/0.59/13, 186/0.68/14, 172/0.62/13; RXL 189/0.63/15, 264/0.98/20, 268/0.86/17), as do all four cells' Pass@1 columns and the 9/12 trigger rate. `pass` reads `red-grade.pass`, the mechanical verdict. |
| 5 | (SC3/EVL-03.5) The produced tests are graded and compared on the lift dimensions named in SC3, including book/source authenticity against the owned `.oracle/` RED sources via oracle-reviewer (DST-04). | PARTIAL -- human decision required | Measured and recorded: wall-clock, cost, output tokens, tool histogram, turns, auto-trigger, coach-don't-drive via `changed_production_files`, correctness (mechanical gate), right-next-test and observable-behavior (blind judge, 2 dims, arm-blinded), classify-first, house-idiom adherence (labeled CONTEXT-ONLY). Twelve dimensions -- "many" is amply satisfied, and the judge corpus defect was found, discarded and rebuilt (36/36 parse clean, uniform 12/12 per arm). NOT measured: `oracle-reviewer` book/source authenticity. EVAL-RESULTS.md:386 records it "NOT RUN ... Recorded as deliberately skipped, not as a null result." I searched the whole workspace and the phase planning tree: no oracle-reviewer pass exists anywhere, and RUN-GATE.md Step 4.3 still prescribes it. Not FAILED (the path is built, wired and selfcheck-proven; the omission is a disclosed scope decision) and not VERIFIED (the axis was never exercised). Routed to Human Verification. |
| 6 | (SC4/EVL-03.6) The harness reuses the lz-refactor apply pattern with no build deps in `plugins/lz-tdd`; per-run byproducts are git-ignored; the metered run was user-gated; borrowed repos are pristine. | VERIFIED | Driver reused with the single `trackSkills` parameterization (`TRACK_SKILLS = SUITE.trackSkills \|\| ['lz-refactor','lz-tpp']`, back-compat scalars retained). `find plugins/lz-tdd -name 'package*.json' -o -name node_modules` returns nothing -- zero build deps; the pins live only in the dev-only workspace `package.json`. `git check-ignore -v` resolves the capture tree via `.gitignore:67`. `git status --porcelain` is EMPTY for the whole repo both before and after I re-ran the tabulator (which rewrote three `mechanical-red.json` files) -- the ignore coverage holds under write. Gate honored: RUN-GATE.md carries the HALT banner, a REQUIRED zero-spend Step 2 canary, and calibration records of two separately user-approved k=1 pilots (2026-07-25, 2026-07-27) before the fan-out; the canary condition is reproducible -- `node selfcheck-red.mjs` exit 0 here with ZERO SKIPs. |
| 7 | (SC5/EVL-03.7) Results are recorded with Pass@k/Pass^k + >= 1 unbiased from-scratch reviewer, and the substance-only comparison is the headline wherever a vocabulary proxy is used. | VERIFIED | Per-cell tables for all four cells plus a pooled table that shows each correction applied in sequence (0.50/0.50/0.58 as tabulated, down to 0.67/0.67/0.67 after every defensible correction). Reviewer-1 recorded as from-scratch and unprimed, 11 findings / 5 blocking, all five adopted into the document and traceable to it (F1 drives the RXF two-number split, F2 the SRVC artifact correction, F3 the RXL inversion, F4 the "pass does not mean right" caveat, F5 the discarded judge corpora); four latent findings recorded for the next round. Substance-only headline explicit and honest -- the one vocabulary-adjacent dimension (house-idiom) is labeled CONTEXT-ONLY, and the headline reports a NULL rather than a flattering number. Disclosures section states the n=3 statistical limits, the `Pass@1 == Pass^1` identity, the `drove` field's uselessness, the model-pin scope, and the excluded pilots including the direction that inclusion would have moved RXL. |
| 8 | (Prior verdict's gated item) The metered 3-arm apply RUN happened on fresh approval and its results are real, reproducible and grader-regime-invariant. | VERIFIED -- gate discharged | 36 capture dirs exist across the three suite trees with the 4 documented cells (GRC 9, RXF 9, RXL 9, SRVC 9). I recomputed the round cost from the captures' own `total_cost_usd`: 36 runs, $29.0382, i.e. $29.04 -- matching EVAL-RESULTS.md. All 36 `red-grade.json` files carry 2026-08-02 21:22-21:51 mtimes, before the 21:55:26 reconciliation commit, so the re-grade demonstrably ran; their verdicts reproduce the published tables cell for cell (GRC 9/9 genuinely_red; RXF 9/9 compile_error; RXL 1 pass in with_skill r2 + 1 in invoke_skill r2, 0 in no_skill; SRVC 3/3, 2/3, 3/3 with the one `unattributable`). Each grade records the `apply_base` it used (`ac6a0335` GRC, `4a7390a2` radix, `55d90b39` srvx) and its `checker` (`tsc` / `atc`). The approval itself is an owner attestation in the record and in the owner's own reconciliation commit, which is as far as any artifact can carry it. |

**Score:** 7/8 must-haves verified; 1 PARTIAL awaiting an owner decision; 0 FAILED; 0
present-but-behavior-unverified; 0 overrides applied.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` | suite-driven trackSkills, back-compat preserved | VERIFIED | `TRACK_SKILLS` const with the lz-refactor default; nx suite still composes 3 arms; model pin now `claude-opus-5` (line 112), confirming the record's "pin has been moved" claim. Residual `claude-opus-4-8` strings are fixture assertions, not live pins. |
| `.../e2e-red-gilded-rose/{suite.json, targets.json, prompts/r1-next-test.md}` | the RED apply corpus | VERIFIED | All present. Prompt is a single non-leading sentence. `targets.json` carries the GRC anchor with contamination HIGH plus the 7-point discriminating-target checklist. |
| `.claude/skills/lz-red-workspace/e2e-red-srvx/**` and `e2e-red-radix-ng/**` | the discriminating targets confirmed at the gate | VERIFIED | Both suites exist with their own `suite.json` / `targets.json` / `prompts/` and captured results. RUN-GATE.md Step 1 records the confirmation, including one candidate (`ngx-layout`) closed out permanently. This satisfies the prior verdict's "confirm/nominate the discriminating 2nd/3rd target" instruction. |
| `.claude/skills/lz-red-workspace/grade-red.mjs` | the D-06 correctness gate | VERIFIED | `--selfcheck` exit 0. Substantially hardened since the phase (per-target checker with `atc` support, containment guards, differential position-insensitivity, config-level and collapse guards) -- all additions carry their own discrimination assertions. |
| `.claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs` | mechanical dims + Pass@k/Pass^k | VERIFIED | `--selfcheck` exit 0, and it reproduces the real round exactly. |
| `.claude/skills/lz-red-workspace/selfcheck-red.mjs` | zero-spend crux battery | VERIFIED | Exit 0, ZERO SKIPs, cruxes through 11 including the target-toolchain canaries per suite, the atc template blind spot, containment, and the lz-refactor regression. The prior verdict's "crux 4 SKIP by design" is now a real pass -- the round produced the transcript it needed. |
| `.claude/skills/lz-red-workspace/merge-judge.mjs` | judge merge + fail-closed verify | VERIFIED | `--selfcheck` exit 0. |
| `.../e2e-red-gilded-rose/EVAL-RESULTS.md` | the filled results record | VERIFIED (one dimension open) | 561 lines, every numeric cell filled and independently reproduced. Zero non-ASCII bytes, zero email-shaped tokens. The one open dimension is the oracle-reviewer row, disclosed in the file itself. |
| `.../e2e-red-gilded-rose/RUN-GATE.md` | the gate contract | VERIFIED | 1323 lines: HALT banner, target confirmation, REQUIRED canary, per-suite metered commands with the `E2E_APPLY_BASE` leak hazard called out, Step 4 graded-dims path, Step 5 unbiased reviewer. Zero non-ASCII, zero email tokens. |
| `.planning/REQUIREMENTS.md` (EVL-03) | requirement closed against evidence | VERIFIED with a disclosure gap | EVL-03 `[x]` Complete with EVL-03.1..EVL-03.7 intact, traceability row updated, and a DRIFT NOTICE that correctly refuses to sweep EVL-01/EVL-02 along with it. Two accuracy nits: the closure note lists `book/source authenticity via oracle-reviewer` among the graded dims without disclosing that it was not run (see Human Verification), and it records `$29.05` where the measured total is `$29.04`. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `run-e2e.mjs` TRACK_SKILLS | `suite.json` trackSkills | suite-driven param with lz-refactor default | WIRED | Source read plus both dry-runs; the RED suite tracks lz-red and the nx suite is unchanged. |
| `suite.json` skillCommand | `plugins/lz-tdd/skills/lz-red` | invoke_skill `/lz-tdd:lz-red ` prefix + `--plugin-dir` | WIRED, and PROVEN LIVE | Not just composed: `avail 1.00 / force 1.00` in all four cells of the real round proves `--plugin-dir` actually loaded the plugin and the detector fired. This is what licenses reading the with_skill rate as real. |
| `grade-red.mjs` red-grade.json | `tabulate-mechanical-red.mjs` | shared `verdict` / `pass` shape | WIRED, and FLOWING | The tabulator consumed all 36 real grades and produced numbers matching the publication. Not a fixture-only link. |
| `meta.json` stream-json fields | mechanical dims + trigger rates | `extractResult` -> tabulator | WIRED, and FLOWING | Reproduced from the 36 real metas. |
| `RUN-GATE.md` Step 3 commands | `run-e2e.mjs --mode apply` + grade + tabulate | documented sequence | WIRED, and EXERCISED | The sequence was actually executed for three suites; `apply_base` per grade matches the bases RUN-GATE Step 3a3/3b/3c prescribe. |
| `RUN-GATE.md` Step 4.3 | oracle-reviewer vs `.oracle/` | prescribed post-run pass | NOT EXERCISED | Documented but never run. The one open link; see Human Verification. |

### Data-Flow Trace (Level 4)

The live question for this phase is whether the published numbers flow from real classifier output or
from a hand-written table. Traced end to end and FLOWING: `meta.json` and `diff.patch` (36 real
captures, none empty) -> `grade-red.mjs` (re-graded 2026-08-02, timestamps precede the reconciliation
commit) -> `red-grade.json` -> `tabulate-mechanical-red.mjs` (re-run by me in this session) ->
numbers that match EVAL-RESULTS.md to the digit across all four cells and all three arms. No
disconnected prop, no static table, no hollow cell.

### Behavioral Spot-Checks

All re-run by me in this session; zero metered spend.

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| D-06 gate proves every class offline | `node grade-red.mjs --selfcheck` | exit 0; nine classes plus fail-closed paths, each discriminated against the pre-change rule | PASS |
| Mechanical dims + Pass@k/Pass^k on fixtures | `node tabulate-mechanical-red.mjs --selfcheck` | exit 0 | PASS |
| Mechanical dims + Pass@k/Pass^k on the REAL round | `node tabulate-mechanical-red.mjs` | exit 0; every published wall/cost/turn/tool/Pass@1 figure and the 9/12 trigger rate reproduced | PASS |
| Judge merge + fail-closed verify | `node merge-judge.mjs --selfcheck` | exit 0, SELFCHECK OK | PASS |
| Full crux battery, the Step 2 canary condition | `node selfcheck-red.mjs` | exit 0, ZERO SKIPs, cruxes through 11 | PASS |
| lz-red reference completeness | `npm --prefix .claude/skills/lz-red-workspace run check` | exit 0; RED-REFS GREEN 11/11, roster integrity 124 checks | PASS |
| Plugin / marketplace structure | `claude plugin validate .` | exit 0, Validation passed | PASS |
| RED-suite 3-arm composition | `node run-e2e.mjs --suite .claude/skills/lz-red-workspace/e2e-red-gilded-rose --dry-run --mode recommend --arm all --prompt r1` | 3 argv lines; plugin-dir on the two treated arms only; slash prefix on invoke_skill only | PASS |
| lz-refactor nx-suite regression | `node run-e2e.mjs --dry-run --arm all --prompt p1` | 3 | PASS |
| Apply mode refuses a pristine tree | `... --mode apply` from repo root | throws "apply mode requires --cwd pointing at a THROWAWAY branch checkout" | PASS (correct fail-closed guard) |
| Prompt parity in the ACTUAL captures | SHA over each capture's own `prompt_used` | no_skill == with_skill in all 4 cells; invoke_skill +15 B exactly | PASS |
| Round cost recomputed from captures | sum `total_cost_usd` over 36 metas | $29.0382 -> $29.04, matching the record | PASS |
| Capture completeness | `find ... -name diff.patch` | 36 present, 0 empty | PASS |
| No build deps in the shipped plugin | `find plugins/lz-tdd -name 'package*.json' -o -name node_modules` | nothing | PASS |
| Tree clean, including after a write | `git status --porcelain` before and after re-tabulation | empty both times | PASS |
| Gitignore covers the capture tree | `git check-ignore -v` on two suites | resolves via `.gitignore:67` | PASS |
| ASCII + email allowlist-inversion | non-ASCII scan and email-token scan over the phase's tracked artifacts | 0 non-ASCII bytes; 0 email-shaped tokens, so nothing to compare against the approved address | PASS |

One correction to the prior report's record, for reproducibility: it logged the RED-suite dry-run as
`node run-e2e.mjs --suite e2e-red-gilded-rose ...`. That form fails with ENOENT -- `--suite` is
`path.resolve`d against the CWD, not against the driver's own directory. The working invocation is the
repo-root-relative path used above, which is also the form RUN-GATE.md documents.

### Probe Execution

No `scripts/*/tests/probe-*.sh` convention exists in this project. The phase's own `--selfcheck`
entry points serve that role and are covered under Behavioral Spot-Checks; all were executed in this
process, not read from a SUMMARY.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| EVL-03 (overall) | 21-01 (formalized) | APPLY-based, 3-arm, multi-dim RED eval | SATISFIED except one named dimension | Round ran, graded, tabulated, audited and published; one SC3 dimension unmeasured and undisclosed at the requirement level. |
| EVL-03.1 | 21-01 / 21-03 | Byte-identical, non-leading prompt across arms | SATISFIED | Recomputed from the captures, not just the dry-run. |
| EVL-03.2 | 21-01 / 21-03 | Three-arm composition | SATISFIED | Dry-run plus live `avail`/`force` evidence from the round. |
| EVL-03.3 | 21-02 | D-06 correctness classifier | SATISFIED (wording drift) | `--selfcheck` exit 0; class set is now a superset of the recorded seven and `verdictPass()` admits `blunt_red`. Numbers proven invariant. |
| EVL-03.4 | 21-03 | Mechanical dims + Pass@k/Pass^k | SATISFIED | Reproduced against the real round. |
| EVL-03.5 | 21-03 / 21-04 | Judge wiring (BUILD) + judge and authenticity verdicts (RUN) | BUILD SATISFIED; RUN PARTIAL | Blind-judge verdicts filled across 4 dims with a documented corpus-defect recovery. oracle-reviewer authenticity NOT RUN. |
| EVL-03.6 | 21-01 / 21-04 | No plugin deps; gitignored byproducts; gated run | SATISFIED | Verified under write, not just at rest. |
| EVL-03.7 | 21-03 / 21-04 | Recorded results, Pass@k/Pass^k, unbiased reviewer, substance-only headline | SATISFIED | All present; the unbiased reviewer's five blocking findings are traceable to adopted corrections in the document. |

No orphaned requirements: REQUIREMENTS.md maps only EVL-03 to Phase 21 and all four plans declare
`requirements: [EVL-03]`.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `.planning/REQUIREMENTS.md` | 72 | Closure note lists `book/source authenticity via oracle-reviewer` among the graded dims and marks EVL-03 Complete, without disclosing that the dimension was not run | WARNING | The requirement row overstates coverage relative to EVAL-RESULTS.md, which does disclose the skip. Reading the requirement alone, a future reader would believe the axis was measured. Folded into the Human Verification item. |
| `.../e2e-red-gilded-rose/EVAL-RESULTS.md` | 53 | Per-cell cost breakdown reads `RXF $3.87, RXL $9.20`; recomputed from the captures they are `$5.63` and `$7.44` | WARNING (accuracy) | An internal inconsistency: those two figures disagree with the arm-level mechanical table in the SAME document, which does reproduce exactly. The pair sum ($13.07), the other two cells and the round total ($29.04) are all correct, so no headline is affected -- but the radix split as printed is wrong. |
| `.planning/REQUIREMENTS.md` | 72, 212, 270 | Round total recorded as `$29.05`; measured `$29.0382` -> `$29.04` | INFO | One-cent transcription drift against EVAL-RESULTS.md. |
| `grade-red.mjs`, `.planning/REQUIREMENTS.md` EVL-03.3 | -- | Live grader has nine classes and `verdictPass()` admits `blunt_red`; the recorded criterion says seven classes and "passes ONLY genuinely_red" (REQUIREMENTS.md EVL-03.3 in fact enumerates only six) | WARNING (documentation drift) | Not a substance defect: the widening is deliberate, each blunt-red rule carries a discrimination assertion against the pre-change rule, and all 36 captures re-graded with zero verdict changes -- so this phase's numbers are regime-invariant and none of them is a `blunt_red`. The criterion wording should be refreshed to describe the gate that now ships. |

Debt-marker gate: CLEAN. `git grep -nE "\b(TBD\|FIXME\|XXX)\b"` over every file this phase touched
returns nothing. The single `TODO` hit in `grade-red.mjs:108` is a comment explaining why bare `TODO`
is deliberately EXCLUDED from a phrase list -- not a debt marker. ASCII-only and email
allowlist-inversion both clean across the phase's tracked artifacts.

Two out-of-scope observations, recorded rather than dropped:

- `D:/.lz-red-throwaway/srvx-d12` holds a second srvx worktree with two untracked files. It post-dates
  this phase (leftover from the later D-12 A/B quick tasks) and 21-UAT.md records the owner's decision
  to keep it because it holds unsaved artifacts. Phase 21's own attestation named the kata, which is
  clean; the whole repo tree is clean.
- The srvx suite carries `invoke_forcing` / `invoke_treatment` arms and `a1` / `a2` prompts from a
  later forcing-function probe. They occupy distinct cell ids (AMB1, AMB2) and cannot contaminate the
  four Phase-21 cells, which I re-tabulated separately and reproduced exactly.

### Human Verification Required

#### 1. Disposition of the unmeasured book/source authenticity dimension (SC3 / EVL-03.5 / DST-04)

**Test:** ROADMAP SC3 and EVL-03.5 both name book/source authenticity of the produced tests against
the owned `.oracle/` RED sources via oracle-reviewer, and RUN-GATE.md Step 4.3 prescribes the pass.
EVAL-RESULTS.md:386 records it as NOT RUN, with the rationale that RESEARCH A5 predicted low
discriminating power for a test artifact versus a named refactoring, and that with correctness and
design both at parity there is no signal for it to separate. I confirmed by search that no such pass
exists anywhere in the workspace or the planning tree. Decide whether that rationale still stands.
Closure is cheap either way: all 36 `diff.patch` captures are on disk, so measuring it costs in-session
agent tokens only, with no metered `claude -p` spend.

**Expected:** one of two explicit outcomes.

(a) ACCEPT the deliberate skip. Record it as an override in this file's frontmatter:

```yaml
overrides:
  - must_have: "book/source authenticity via oracle-reviewer against the owned .oracle/ RED sources (DST-04)"
    reason: "Deliberately skipped -- RESEARCH A5 predicted low discriminating power for a test artifact versus a named refactoring, and with correctness and design both at parity there is no signal for it to separate."
    accepted_by: "{name}"
    accepted_at: "{ISO timestamp}"
```

and amend the REQUIREMENTS.md EVL-03 closure note so it names the unmeasured dimension. That note
currently lists the dimension among the graded dims and marks the requirement Complete, so the
requirement row overstates coverage relative to the results file.

(b) COMMISSION the pass per RUN-GATE Step 4.3, fill the row in EVAL-RESULTS.md, then re-verify.

**Why human:** not a defect and not programmatically resolvable. The oracle-reviewer path is built,
wired and selfcheck-proven, so nothing is broken to fix; marking it FAILED and routing it to
`plan-phase --gaps` would be the wrong machinery. What is outstanding is a scope judgment about
whether an axis the owner reasoned has no discriminating power here is worth measuring, and the
wording of the disclosure follows from that choice. This is an escalation gate.

### Gaps Summary

No gaps in the build and no gaps in the round. The instrument is GREEN on the live tree under
independent re-execution, the metered round genuinely ran and was approved, and -- the part that
matters most for a results phase -- every published number reproduces from the captured artifacts in
this session, including the 36-run cost total, all four cells' Pass@k columns, the full mechanical
table and the 9/12 auto-trigger rate. The write-up is unusually honest for a null result: it reports
no lift, discloses the stale model pin and then measures the one at-risk finding on the current model,
excludes two cells for pre-registered reasons, discards two corrupted judge corpora rather than
averaging them in, and lets an unbiased reviewer overturn four of its own conclusions.

One item is open, and it is a decision rather than a defect: the single SC3 lift dimension that was
never exercised -- oracle-reviewer book/source authenticity -- is disclosed in the results file but not
in the REQUIREMENTS.md closure note that marks EVL-03 Complete while listing that dimension. The
status is therefore `human_needed`, not `passed` and not `gaps_found`.

Also worth an owner glance, though none of it changes the verdict: the RXF/RXL per-cell cost split
printed in the run configuration disagrees with the same document's own arm-level table (the sum and
the round total are right), REQUIREMENTS.md records a one-cent-high round total, and the shipped
grader has grown past the seven classes its recorded criterion describes -- deliberately, with the
round's numbers proven invariant under the change.

---

*Verified: 2026-08-02T23:27:33Z*
*Verifier: Claude (gsd-verifier)*
