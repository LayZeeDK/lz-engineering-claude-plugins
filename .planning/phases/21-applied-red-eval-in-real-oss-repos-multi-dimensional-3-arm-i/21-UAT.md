---
status: complete
phase: 21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-i
source: [21-01-SUMMARY.md, 21-02-SUMMARY.md, 21-03-SUMMARY.md, 21-04-SUMMARY.md]
started: 2026-08-02T23:10:00Z
updated: 2026-08-02T23:10:00Z
mode: autonomous
---

## Current Test

[testing complete]

## How this session was run

Owner instruction: "Verify it autonomously." Phase 21's deliverables are deterministic offline
instruments (selfcheck gates, checkers, a differential-tsc correctness classifier), so every
checkpoint below was discharged by RE-RUNNING the named command in this session and recording its
actual exit code -- not by reading a SUMMARY's claim and agreeing with it. Where a claim and the
observed behavior disagreed, the observation is recorded.

`uat.classify-coverage` reports 21-02 / 21-03 / 21-04 in `coverage` mode with
`all_auto_covered: true` (8 entries, `human_judgment: false` on every one) and 21-01 in `legacy`
mode. The 8 coverage entries were re-executed rather than accepted; 21-01's four deliverables were
extracted from prose and verified directly.

Cold-start smoke test: NOT injected. The scan over all four SUMMARY key-file lists matched none of
the startup/database/container patterns -- the phase touches `.mjs` harness tooling, `suite.json`,
`targets.json`, a prompt, `.gitignore` and `REQUIREMENTS.md`.

## Tests

### 1. grade-red 7-class RED correctness gate (21-02 D1, EVL-03.3)
expected: `grade-red.mjs --selfcheck` proves the differential-tsc + target-runner classifier passes only `genuinely_red`; module parses with its exports intact
result: pass
source: automated
coverage_id: 21-02/D1
evidence: "node --check grade-red.mjs exit 0; node grade-red.mjs --selfcheck exit 0"

### 2. Six fixture pairs classify to their expected D-06 class (21-02 D2)
expected: red->genuinely_red, green->false_green, compile->compile_error, collect->collection_error, notest->no_tests, wrong->wrong_reason against the pinned vitest 4.1.10
result: pass
source: automated
coverage_id: 21-02/D2
evidence: "covered by grade-red --selfcheck (exit 0); selfcheck-red crux 5 reports the classifier now spans 9 classes, a superset of the 7 recorded at plan time"

### 3. tabulate-mechanical-red lift dims + Pass@k/Pass^k (21-03 D1, EVL-03.4)
expected: mechanical dims per (target, arm) off the stream-json meta, auto-trigger rates, Pass@k + Pass^k on the correctness gate, fail-closed on a garbled meta
result: pass
source: automated
coverage_id: 21-03/D1
evidence: "node --check exit 0; node tabulate-mechanical-red.mjs --selfcheck exit 0"

### 4. selfcheck-red harness composition, parity and teardown (21-03 D2, EVL-03.1/.2)
expected: 3-arm composition, byte-identical prompt parity, worktree build/teardown leaving borrowed repos pristine, transcript parse, classifier, lz-refactor nx regression -- zero spend
result: pass
source: automated
coverage_id: 21-03/D2
evidence: "node --check exit 0; node selfcheck-red.mjs exit 0 -- cruxes 1-11 all OK including crux 6 lz-refactor nx regression and byte-for-byte apply-preamble parity"
note: "BETTER than recorded. 21-03-SUMMARY logged 'crux 4 SKIP no transcript'; crux 4 now actually RUNS against an on-disk with_skill capture (available lz-red+lz-tpp, model-fired lz-red=1) because the metered round has since produced transcripts."

### 5. Phase-21 EVAL-RESULTS.md results structure (21-03 D3, EVL-03.7 scaffold half)
expected: substance-only headline, per-target + overall Pass@k AND Pass^k, all three arm names, a reserved unbiased-reviewer slot
result: pass
source: automated
coverage_id: 21-03/D3
evidence: "e2e-red-gilded-rose/EVAL-RESULTS.md -- Pass@k 2, Pass^k 2, unbiased 2, substance 4, no_skill 22, with_skill 28, invoke_skill 26; 0 non-ASCII bytes; 0 email-shaped tokens"
note: "Checker error on my first pass, not a defect: I ran the token scan against the WORKSPACE-ROOT EVAL-RESULTS.md, which is Phase 20's two-arm EVL-01/EVL-02 record (vocabulary baseline/with_skill/no_skill, correctly 0 hits for invoke_skill). The 21-03 claim names the suite-local file. Re-checked at the right path: all tokens present."

### 6. Full deterministic battery GREEN on the merged tree (21-04 D1, EVL-03.1-.6)
expected: the four --selfcheck gates + the three workspace scripts + `claude plugin validate .` all exit 0, zero spend
result: pass
source: automated
coverage_id: 21-04/D1
evidence: "grade-red --selfcheck 0; tabulate-mechanical-red --selfcheck 0; merge-judge --selfcheck 0; selfcheck-red 0; npm --prefix .claude/skills/lz-red-workspace run check exit 0 (provenance-honesty + row-guards selftests + check-red-references RED-REFS 11/11, roster integrity 124 checks equal to the predicted literal); extract-samples 0 (tsc --strict); check-evals 0; claude plugin validate . exit 0 'Validation passed'"

### 7. Borrowed repos pristine and plugins/lz-tdd untouched (21-04 D2, SC4)
expected: kata git root clean, single worktree; `git status --porcelain plugins/lz-tdd` empty
result: pass
source: automated
coverage_id: 21-04/D2
evidence: "GildedRose-Refactoring-Kata: status clean, 1 worktree. primitives-pin: status clean, 1 worktree. plugins/lz-tdd: porcelain empty. Whole repo tree clean before the INT-02 edit."
observation: "OUT OF SCOPE for this claim, but recorded rather than dropped: srvx carries a second worktree at D:/.lz-red-throwaway/srvx-d12 holding two UNTRACKED files (src/correlation-id.ts, test/correlation-id.test.ts). It post-dates the Phase-21 build -- it is a leftover from the later D-12 A/B quick tasks (260801-w8b / 260802-j03), and the 21-04 claim names the kata specifically, which is clean. NOT removed: the worktree holds unsaved artifacts and deleting it would discard them. Owner decision."

### 8. RUN-GATE.md gate contract and hygiene (21-04 D3)
expected: HALT banner, fresh-approval language, the target-confirmation checklist, all three arm names, canary requirement; ASCII-only; email allowlist-inversion clean
result: pass
source: automated
coverage_id: 21-04/D3
evidence: "HALT 3, approv 11, 'arm all' 7, no_skill 5, with_skill 18, invoke_skill 15, unbiased 5, ponytail 1, mattpocock 2, canary 47; 0 non-ASCII bytes; 0 email-shaped tokens (allowlist-inversion: nothing to compare against the approved address because no email token is present at all)"

### 9. RED apply suite exists (21-01, EVL-03.1)
expected: suite.json + targets.json + prompts/r1-next-test.md present under e2e-red-gilded-rose
result: pass
evidence: "all three present"

### 10. run-e2e.mjs trackSkills is suite-driven with lz-refactor back-compat (21-01)
expected: tracked skill set sourced from SUITE.trackSkills; generic used_skills hit map; usedRefactor/refactorHits/usedTpp/tppHits retained so lz-refactor suites keep working
result: pass
evidence: "run-e2e.mjs:98 TRACK_SKILLS = SUITE.trackSkills || ['lz-refactor','lz-tpp']; :347 extractResult(raw, trackSkills = TRACK_SKILLS); :466-477 used_skills map plus all four back-compat scalars. Regression proven twice: selfcheck-red crux 6 and selfcheck-code-review 3/3 cruxes (exit 0)."

### 11. e2e-red run tree is git-ignored (21-01, EVL-03.6)
expected: per-run byproducts under the suite results tree do not enter git
result: pass
evidence: "git check-ignore -v resolves via .gitignore:67 .claude/skills/lz-red-workspace/e2e-red-*/**/results*/"

### 12. EVL-03 formalized in REQUIREMENTS.md (21-01, D-14)
expected: EVL-03 present with EVL-03.1..EVL-03.7 BUILD/RUN sub-criteria; coverage 27 -> 28
result: pass
evidence: "28 requirement entries counted in REQUIREMENTS.md; EVL-03 present with all seven sub-criteria"

### 13. EVL-03 metered RUN recorded (EVL-03.5 verdicts + EVL-03.7 numbers)
expected: the gated 3-arm apply run either remains an open owner decision, or is recorded with real numbers, Pass@k/Pass^k, and the mandatory unbiased reviewer
result: pass
evidence: "e2e-red-gilded-rose/EVAL-RESULTS.md:10 'RUN COMPLETE 2026-07-27/28. 36 runs, 4 cells, 3 suites, $29.04 total. User-approved'; :53 per-cell cost breakdown; four filled Pass@1/Pass@3/Pass@5/Pass^3 arm tables; :408 '## Unbiased reviewer (mandatory, D-10)'; ZERO occurrences of HALT / 'not yet run' / 'pending approval' remain"
note: "THIS is the item 21-VERIFICATION.md classified human_needed on 2026-07-23 -- the blocking-human metered-run spend approval. It is discharged by evidence, not by my judgment: the approval was given and the round ran on 2026-07-27/28, four days after that verification was written, and all 36 captures were re-graded on 2026-08-02 under the current grader with zero verdict changes."

### 14. lz-refactor-workspace battery GREEN (milestone-audit INT-02)
expected: `npm --prefix .claude/skills/lz-refactor-workspace run check` exits 0
result: pass
evidence: "exit 0 -- all 10 checkers GREEN: check-catalog 62/62, check-kerievsky 27/27, check-gof 23/23, check-extra-patterns 5/5, check-smells 24/24, check-crossrefs 718 links + 20 inverse pairs, check-principles 8/8, check-hygiene ASCII + work-email 197 files + no-verbatim 190 files, check-functional 19/19, check-backing 3/3"
note: "FAILED at session start -- this is milestone-audit gap INT-02, and it was fixed in-session (commit ee50a74) rather than left open. check-backing.mjs joined every entry against the lz-refactor references dir, but commit 23c8ee2 had promoted beck-tdd-by-example.md to the plugin-wide plugins/lz-tdd/references/. Worse than one red check: the missing-file branch CONTINUES, so that file's six PRIN-01 topic assertions plus its no-oracle-tag and scaffold gates were being silently skipped -- 8 assertions not running. Fixed with a per-entry `dir` base override (the `spec.dir ?? REFERENCES` shape check-red-references.mjs:431 already uses), NOT an existsSync tolerated-absence guard, which would have made the gate permanently fail-open on exactly the assertions it exists to run. Mutation-tested both directions: exit 1 with the file moved aside, exit 0 restored, restore sha256-identical."

## Summary

total: 14
passed: 14
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

[none outstanding]

Resolved during this session (recorded for traceability, NOT for `plan-phase --gaps` to re-plan):

- INT-02 (milestone-audit blocker, severity blocker) -- `check-backing.mjs` pointed at a relocated
  reference, silently skipping 8 PRIN-01 assertions. Root cause: commit 23c8ee2 moved the file
  without updating this one checker; the sibling `check-crossrefs.mjs` survived only because it
  guards the path with `existsSync`. Fixed and mutation-tested in commit ee50a74.

Open owner decision carried out of this session (not a Phase-21 gap):

- The `D:/.lz-red-throwaway/srvx-d12` worktree holds two untracked files from the later D-12 A/B
  quick tasks. Left in place deliberately -- removing it would discard unsaved artifacts.
