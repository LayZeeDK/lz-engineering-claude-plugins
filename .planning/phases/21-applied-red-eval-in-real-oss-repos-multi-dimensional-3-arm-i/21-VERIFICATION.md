---
phase: 21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i
verified: 2026-07-23T09:15:00Z
status: human_needed
score: 7/7 BUILD must-haves verified (1 RUN item legitimately gated, not counted as a gap)
behavior_unverified: 0
overrides_applied: 0
human_verification:
  - test: "Review .claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md and either approve the gated metered 3-arm apply run (confirming/nominating the discriminating 2nd/3rd target per the 7-point checklist, and the run scope for spend) or request instrument/target changes."
    expected: "An explicit human decision: 'approved -- run <target(s)> at k=<N>' to start the metered run, OR direction to revise the instrument/targets first. Until this decision, EVL-03 stays Pending (build complete; empirical run gated) and the RUN sub-criteria (EVL-03.5 verdicts, EVL-03.7 recorded numbers) remain open."
    why_human: "This is a blocking-human, never-auto-approvable checkpoint (eval-run-approval-gate / D-12): the metered run spends real claude tokens and requires fresh explicit approval. No amount of static analysis can substitute for that approval decision."
---

# Phase 21: Applied RED Eval in Real OSS Repos (multi-dimensional, 3-arm) Verification Report

**Phase Goal:** lz-red is validated on REAL applied work -- driving the next failing (red) test in
real OSS TypeScript repos with short, basic, human-style prompts -- across three arms and graded on
many lift dimensions, mirroring the lz-refactor Phase 13/14 apply evals (not coaching prose over
synthetic snippets).

**Verified:** 2026-07-23T09:15:00Z
**Status:** human_needed
**Re-verification:** No -- initial verification (no prior 21-VERIFICATION.md existed)

## Framing note (instrument-first BUILD-then-HALT phase)

This phase is deliberately scoped as BUILD-then-HALT (D-11/D-12/D-14, mirroring EVL-01/EVL-02 in
Phases 11 and 20). The four plans build the RED apply eval instrument and prove it GREEN offline at
zero metered spend; the metered 3-arm apply RUN is intentionally user-gated and NOT executed in this
phase (21-04 Task 3 is a `checkpoint:human-verify gate="blocking-human"`). EVL-03 is deliberately left
`Pending (build complete; empirical run gated)` in REQUIREMENTS.md -- this is the correct closure
shape for this phase, not a defect. Accordingly:

- **BUILD sub-criteria (EVL-03.1..EVL-03.6, plus the .5/.7 wiring/scaffold half)** are verified below
  against the actual codebase, not against SUMMARY.md narration.
- **The RUN sub-criterion (EVL-03.7 recorded numbers / EVL-03.5 verdicts)** is classified
  `human_needed` (a blocking-human approval gate), never `gaps_found` -- there is nothing broken to
  fix; there is a spend decision only a human can make.

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | (SC1/EVL-03.1) A RED apply suite exists whose short human prompt is byte-identical across arms except the target path, and never names the expected assertion (non-leading). | VERIFIED | `suite.json`/`targets.json`/`prompts/r1-next-test.md` all present and well-formed; re-ran `node run-e2e.mjs --suite e2e-red-gilded-rose --dry-run --mode recommend --arm all --prompt r1` independently -- `no_skill` and `with_skill` `-p` are byte-identical, `invoke_skill` `-p` is exactly `/lz-tdd:lz-red ` + the same text; `git grep -niE "conjured|degrade" prompts/` returns nothing (non-leading confirmed). |
| 2 | (SC2/EVL-03.2) The reused driver composes all THREE own-skill arms correctly (no_skill / with_skill via genuine `--plugin-dir` / invoke_skill via slash force-invoke), and the lz-refactor suites still compose unchanged (no regression). | VERIFIED | Same dry-run output shows `--plugin-dir ...plugins\lz-tdd` on with_skill/invoke_skill only, absent on no_skill; independently re-ran the DEFAULT nx-suite dry-run (`--arm all --prompt p1`) -- 3 `argv:` lines, composition unchanged. `git grep -n "trackSkills\|TRACK_SKILLS\|used_skills" run-e2e.mjs` confirms the suite-driven parameterization exists with back-compat default `['lz-refactor','lz-tpp']`. |
| 3 | (SC3a/EVL-03.3) A mechanical D-06 correctness GATE classifies a produced test into 7 classes (genuinely_red / false_green / drove_to_green / compile_error / collection_error / no_tests / wrong_reason), passing ONLY genuinely_red, via differential tsc + the target's own runner JSON, failing closed on garbled input. | VERIFIED | Read `grade-red.mjs` (680 lines, real implementation: `classify()`, `gradeRun()`, `gradeFixture()`, explicit `throw new Error(... fail closed ...)` branches for missing/empty diff, garbled meta, unparseable runner JSON). Independently re-ran `node grade-red.mjs --selfcheck` -- exit 0, all 7 classes proven against 6 runnable fixture pairs + 1 mandatory synthetic drove_to_green assertion; `git status --porcelain fixtures` empty afterward. |
| 4 | (SC3b/EVL-03.4) Mechanical lift dims (wall-clock, tokens, cost, tool histogram, num_turns, auto-trigger rate) tabulate from the stream-json meta, and Pass@k/Pass^k (k=1,3,5,total) compute on the correctness gate (not a vocabulary proxy), fail-closed on garbled/missing input. | VERIFIED | Read `tabulate-mechanical-red.mjs` (464 lines); independently re-ran `node tabulate-mechanical-red.mjs --selfcheck` -- exit 0, token/cost rollup + auto-trigger rates (with_skill 0.60, invoke_skill 1.00, no_skill 0.00) + Pass@k/Pass^k against the two fixture samples all match; `pass` criterion is `red-grade.pass`, confirmed in source. |
| 5 | (SC3c/EVL-03.5 wiring) The graded dims (blind judge <=2 dims, oracle-reviewer book/source authenticity) are WIRED (not run): merge-judge stays selfcheck-GREEN and the results scaffold documents the axes, blinding approach, and the <=2-dims-per-judge lock. | VERIFIED | Independently re-ran `node merge-judge.mjs --selfcheck` -- exit 0 ("SELFCHECK OK"). `EVAL-RESULTS.md` documents the blind-judge dims, blinding method (test code + behavior spec only, no arm label), the oracle-reviewer axis, and the <=2-dims-per-judge lock, with all verdict cells blank pending the gated run. |
| 6 | (SC4/EVL-03.6) The harness reuses the lz-refactor apply pattern with no new build deps in `plugins/lz-tdd`; per-run byproducts are git-ignored; the whole offline instrument stays GREEN together and the borrowed repos are pristine. | VERIFIED | Independently re-ran the full offline battery (see Behavioral Spot-Checks below) -- all exit 0. `git status --porcelain plugins/lz-tdd` empty. Kata git root (`D:/projects/github/emilybache/GildedRose-Refactoring-Kata`) porcelain-clean, only `main` branch, single worktree entry. `.gitignore` contains explicit `e2e-red-*` results/run/outputs coverage. |
| 7 | (SC5/EVL-03.7 BUILD half) A results scaffold exists with blank Pass@k/Pass^k tables (per-target + overall, k=1,3,5,total) on the correctness gate, a reserved >=1 unbiased-from-scratch-reviewer slot, and a SUBSTANCE-ONLY headline structure (any vocabulary-proxy number labeled context-only). | VERIFIED | Read `EVAL-RESULTS.md` in full: blank Pass@k/Pass^k tables for GRC + a discriminating-target placeholder + overall; a `## Unbiased reviewer (mandatory, D-10)` section with a pending reviewer row; an explicit SUBSTANCE-ONLY headline section citing the Phase-13 parity + Phase-20 concentration + GRC-contamination priors. |
| 8 | (SC3-run/SC5-run, EVL-03.5 verdicts + EVL-03.7 recorded numbers) The produced tests from an actual metered 3-arm run are graded/compared and the results/Pass@k/unbiased-review verdict are recorded. | NOT YET DONE -- legitimately human-gated | No `results/apply/**` tree exists under `e2e-red-gilded-rose/` (confirmed by directory listing: only `suite.json`, `targets.json`, `prompts/`, `EVAL-RESULTS.md`, `RUN-GATE.md`). `RUN-GATE.md` exists with a HALT banner and 21-04's Task 3 is a `checkpoint:human-verify gate="blocking-human"` that was reached, not crossed. Classified `human_needed`, not `gaps_found` (see Framing note). |

**Score:** 7/7 BUILD-time must-haves verified; 0 present-but-behavior-unverified; 1 truth is a
legitimately gated RUN item (human_needed), not a failure.

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` | parameterized trackSkills, back-compat preserved | VERIFIED | `TRACK_SKILLS` const + generic `used_skills` hit map + retained `usedRefactor`/`refactorHits`/`usedTpp`/`tppHits` scalars; default-nx dry-run regression confirmed live. |
| `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/suite.json` | RED apply suite config | VERIFIED | `skillCommand: /lz-tdd:lz-red`, `trackSkills: [lz-red, lz-tpp]`, one `r1` prompt targeting `GRC`. |
| `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/targets.json` | GRC anchor + discriminating-target checklist | VERIFIED | `GRC` target has file/symbol/runner(vitest+jest)/test_dir/behavior_gap/expected_red_color/constraint/discipline_traps/contamination HIGH/strict_scope_note; top-level 7-point `discriminating_target_checklist`. |
| `.../prompts/r1-next-test.md` | short, non-leading, human-style | VERIFIED | 2 sentences, names `app/gilded-rose.ts`, no "Conjured"/"degrade"/assertion tokens. |
| `.claude/skills/lz-red-workspace/grade-red.mjs` | D-06 correctness gate | VERIFIED | 680 lines; `classify()`/`gradeRun()`/`gradeFixture()` exported; module-main guard present; `--selfcheck` exit 0. |
| `.claude/skills/lz-red-workspace/fixtures/{red,green,compile,collect,notest,wrong}/` | 6 selfcheck-only fixture pairs | VERIFIED | All present on disk; `node_modules/.vite` caches present but gitignored (`git check-ignore` confirms); not referenced by any suite/targets.json (selfcheck-only, as required). |
| `.claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs` | mechanical dims + Pass@k/Pass^k tabulator | VERIFIED | 464 lines; `--selfcheck` exit 0 against `fixtures/tabulate/{meta.sample.json,red-grade.sample.json}` (both present on disk). |
| `.claude/skills/lz-red-workspace/selfcheck-red.mjs` | zero-spend crux battery | VERIFIED | 363 lines; re-ran directly -- exit 0, cruxes 1/2/3/5/6 OK, crux 4 SKIP (no on-disk transcript, by design). |
| `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/EVAL-RESULTS.md` | blank-numbers scaffold | VERIFIED | Present, full structure read; all numeric cells are `_` placeholders. |
| `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md` | gated-run presentation | VERIFIED | Present; HALT banner, 7-step gated procedure, canary requirement, hygiene, unbiased-reviewer/substance-only close. |
| `.planning/REQUIREMENTS.md` (EVL-03) | formalized requirement | VERIFIED | EVL-03 bullet + EVL-03.1..EVL-03.7 sub-criteria + Traceability row (`Pending (build complete; empirical run gated)`) + Coverage 28/28/0. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| `run-e2e.mjs extractResult()` | `suite.json trackSkills` | `TRACK_SKILLS` module const + suite-driven param | WIRED | Confirmed by source read + live dry-run showing correct arm composition for both the RED suite and the default nx suite. |
| `e2e-red-gilded-rose/suite.json skillCommand` | `plugins/lz-tdd/skills/lz-red` | invoke_skill arm's `/lz-tdd:lz-red ` prefix | WIRED | Live dry-run output: invoke_skill `-p` starts with `/lz-tdd:lz-red `; `--plugin-dir` resolves to the real `plugins/lz-tdd` path. |
| `prompts/r1-next-test.md` target path | `targets.json GRC.file` | `app/gilded-rose.ts` named in both | WIRED | Verified textually in both files. |
| `grade-red.mjs red-grade.json output` | `tabulate-mechanical-red.mjs` input | shared shape (`verdict`/`pass`) | WIRED | `tabulate-mechanical-red --selfcheck` fixture (`red-grade.sample.json`) matches the shape `grade-red.mjs` writes (`verdict`, `pass`, etc., confirmed by source read of both files). |
| RUN-GATE.md commands | `run-e2e.mjs --mode apply` + `grade-red` + `tabulate-mechanical-red` + judge/oracle-reviewer | documented command sequence | WIRED (documentation) | RUN-GATE.md Step 3/4 give the exact command sequence; verified these reference the real, existing scripts (not placeholders). |

### Data-Flow Trace (Level 4)

Not applicable in the conventional sense (no UI/dashboard rendering dynamic data this phase). The
closest analog -- does the tabulator's Pass@k computation flow from real classifier output rather than
a static stub -- is traced above: `tabulate-mechanical-red.mjs`'s `aggregate()` reads `red-grade.pass`
(the classifier's real verdict field, confirmed in `grade-red.mjs` source) rather than a synthetic
lift proxy. Confirmed FLOWING at the code level; the actual metered-run data has not been produced yet
(by design, per the BUILD-then-HALT boundary).

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| D-06 gate proves all 7 classes offline | `node grade-red.mjs --selfcheck` | exit 0, 7/7 classes + fail-closed paths | PASS |
| Mechanical tabulator + Pass@k/Pass^k | `node tabulate-mechanical-red.mjs --selfcheck` | exit 0, rollup/auto-trigger/Pass@k all match fixtures | PASS |
| Judge-merge stays selfcheck-GREEN | `node merge-judge.mjs --selfcheck` | exit 0 ("SELFCHECK OK") | PASS |
| Full crux battery (composition/parity/worktree/parse/classifier/regression) | `node selfcheck-red.mjs` | exit 0, cruxes 1/2/3/5/6 OK, crux 4 SKIP by design | PASS |
| Reference-completeness gate | `npm --prefix .claude/skills/lz-red-workspace run check` | exit 0, 11/11 lz-red surfaces | PASS |
| RED-samples tsc --strict gate | `node extract-samples.mjs` | exit 0, 8 modules clean | PASS |
| Trigger/behavior eval-JSON lint | `node check-evals.mjs` | exit 0, 24 queries | PASS |
| Plugin/marketplace structural validation | `claude plugin validate .` | exit 0, "Validation passed" | PASS |
| Default (lz-refactor) nx-suite dry-run regression | `node run-e2e.mjs --dry-run --arm all --prompt p1 \| rg -c "argv:"` | `3` | PASS |
| RED-suite dry-run 3-arm composition | `node run-e2e.mjs --suite e2e-red-gilded-rose --dry-run --mode recommend --arm all --prompt r1` | 3 arms composed, byte-identical parity confirmed | PASS |
| Kata git root pristine | `git --git-dir=... --work-tree=... status --porcelain` + `branch -a` + `worktree list` | clean; only `main`; single worktree | PASS |
| `plugins/lz-tdd` untouched | `git status --porcelain plugins/lz-tdd` | empty | PASS |
| Fixture pristine (no stray tracked artifacts) | `git status --porcelain .claude/skills/lz-red-workspace/fixtures` | empty | PASS |

All spot-checks independently re-run by this verifier (not taken from SUMMARY.md narration); all 12
exit/assert as claimed, zero metered spend incurred during verification.

### Probe Execution

No `scripts/*/tests/probe-*.sh` convention is used by this project; the phase's own selfcheck scripts
(`grade-red.mjs --selfcheck`, `tabulate-mechanical-red.mjs --selfcheck`, `merge-judge.mjs --selfcheck`,
`selfcheck-red.mjs`) serve the equivalent role and are covered under Behavioral Spot-Checks above.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|--------------|-------------|-------------|--------|----------|
| EVL-03 (overall) | 21-01 (formalized) | APPLY-based, 3-arm, multi-dim RED eval | Pending (build complete; empirical run gated) -- CORRECTLY so | REQUIREMENTS.md traceability row + Coverage 28/28/0; matches the phase's own design (D-14). |
| EVL-03.1 | 21-01/21-03 | Byte-identical, non-leading prompt across arms | SATISFIED (BUILD) | Verified live via dry-run + prompt grep. |
| EVL-03.2 | 21-01/21-03 | 3-arm composition | SATISFIED (BUILD) | Verified live via dry-run. |
| EVL-03.3 | 21-02 | D-06 correctness classifier | SATISFIED (BUILD) | `grade-red --selfcheck` re-run, exit 0. |
| EVL-03.4 | 21-03 | Mechanical dims + Pass@k/Pass^k | SATISFIED (BUILD) | `tabulate-mechanical-red --selfcheck` re-run, exit 0. |
| EVL-03.5 | 21-03/21-04 | Judge/oracle-reviewer wiring (BUILD) + verdicts (RUN) | BUILD half SATISFIED; RUN half NEEDS HUMAN | `merge-judge --selfcheck` green; verdicts pending the gated run. |
| EVL-03.6 | 21-01/21-04 | No new plugins/lz-tdd deps; gitignore; gate reached | SATISFIED (BUILD) | `git status --porcelain plugins/lz-tdd` empty; gitignore lines present; blocking-human checkpoint reached. |
| EVL-03.7 | 21-03/21-04 | Scaffold (BUILD) + recorded results (RUN) | BUILD half SATISFIED; RUN half NEEDS HUMAN | EVAL-RESULTS.md scaffold verified in full; numbers pending the gated run. |

No orphaned requirements: `.planning/REQUIREMENTS.md` maps only EVL-03 to Phase 21, and all 4 plans
declare `requirements: [EVL-03]` in frontmatter -- fully accounted for.

### Anti-Patterns Found

None. Scanned every file modified/created this phase (`grade-red.mjs`, `tabulate-mechanical-red.mjs`,
`selfcheck-red.mjs`, `run-e2e.mjs`, the `e2e-red-gilded-rose/*` suite files, `.gitignore`,
`.planning/REQUIREMENTS.md`) for `TBD|FIXME|XXX|TODO|HACK|PLACEHOLDER` -- zero matches. The blank `_`
cells in `EVAL-RESULTS.md` are a deliberate, documented scaffold (not a stub-in-code pattern) per the
BUILD-then-HALT design; the file explicitly states "Do not read a blank cell as a zero." No
non-ASCII bytes and no email-shaped tokens found in any of the above files (allowlist-inversion clean).

### Human Verification Required

#### 1. Gated metered 3-arm apply run approval (eval-run-approval-gate)

**Test:** Review `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/RUN-GATE.md`. Confirm the
Conjured (GRC) anchor and confirm/nominate the discriminating 2nd/3rd target against the 7-point
qualification checklist in `targets.json` (running the package-legitimacy gate first if a new repo is
nominated). Decide the run scope for spend (~2-3 targets x k=3) and whether to include the D-05
contingent mattpocock competitor round.

**Expected:** An explicit approval ("approved -- run <target(s)> at k=<N>") or a request to revise the
instrument/targets first. Only on explicit approval does the metered `claude -p` run start as a
separate, freshly-approved, orchestrator-driven step; the blind judge, oracle-reviewer, merge/verify,
and mandatory unbiased-from-scratch reviewer follow, filling every blank cell in `EVAL-RESULTS.md`.

**Why human:** This is a blocking-human, never-auto-approvable checkpoint (`eval-run-approval-gate` /
D-12). It spends real tokens against third-party OSS repos under `bypassPermissions`; no static check
can substitute for the human spend/scope decision. This is exactly the closure shape used for EVL-01
and EVL-02 in Phases 20/11 -- not a new pattern.

### Gaps Summary

No gaps. All BUILD-time must-haves (the instrument, its offline selfcheck battery, the corpus/suite
config, the requirement formalization, the run-gate documentation, and the pristine/untouched
attestations) are independently verified against the live codebase, not merely asserted by
SUMMARY.md. The single open item -- the metered 3-arm apply run and its resulting Pass@k/judge/
unbiased-reviewer numbers -- is not a defect: it is the designed, blocking-human halt point
(D-11/D-12/D-14), correctly left `Pending` in REQUIREMENTS.md and correctly reached (not bypassed) at
21-04's Task 3 checkpoint. This mirrors how EVL-01/EVL-02 were handled at the end of Phases 11 and 20.

---

*Verified: 2026-07-23T09:15:00Z*
*Verifier: Claude (gsd-verifier)*
