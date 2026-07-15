---
phase: 13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness
verified: 2026-07-15T10:30:00Z
status: passed
score: 6/6 must-haves verified
overrides_applied: 0
re_verification: null
---

# Phase 13: lz-refactor vs base Opus eval -- book authenticity & correctness -- Verification Report

**Phase Goal:** Measure whether lz-refactor (with_skill/invoke_skill) produces more book-authentic
and more correct APPLIED refactorings than base Opus 4.8 @ high, by grading the applied diffs
against the source books (with_skill vs no_skill), producing a with/without comparison record +
empirical verdict. Measurement-only; ships no skill change.

**Verified:** 2026-07-15T10:30:00Z
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

This is a MEASUREMENT-ONLY, terminal-milestone phase. The goal is achieved when the six 13-SPEC.md
requirements are genuinely satisfied by artifacts on disk, and an honest empirical verdict is
recorded. The recorded verdict is PARITY (the skill does not measurably beat base on applied
output). Per the phase mandate this is a valid, complete outcome for a measurement phase -- "no
skill win" is a finding, NOT a gap.

### Observable Truths (SPEC req 1-6)

| # | Truth (SPEC req) | Status | Evidence |
| --- | --- | --- | --- |
| 1 | no_skill single-target apply backfill (p1, p2, gr1, k=3) persisted | VERIFIED | nx `no_skill/p1` (3 runs, diff.patch 14.9-22.6 KB), `no_skill/p2` (3 runs, 3.5-4.3 KB), kata `no_skill/gr1` (3 runs, 15.5-16.1 KB); each with meta.json; model=claude-opus-4-8 effort=high arm=no_skill (no skills_invoked) |
| 2 | sweep pair both-arm re-run with retained diffs (nx p8 no_skill + reused with_skill; kata gr4 both), k=3 | VERIFIED | nx `p8/no_skill` (3) + `p8/with_skill` (3 reused); kata `gr4/with_skill` (3) + `gr4/no_skill` (3); all diff.patch non-empty (10-25 KB) + meta.json; diffs live in tracked workspace and survived borrowed-repo restore (both repos now pristine, diffs still on disk) |
| 3 | book-authenticity grading via oracle for every applied refactoring (pass/partial/fail, agent's own words) | VERIFIED | claims.json (63 claims, 0 malformed, 1 N/A decline); fidelity.json (63 records, 62 pass + 1 N/A, 0 missing verdict); each record names book + refactoring + pass/partial/fail + own-words `why` (e.g. Kerievsky "Replace Conditional Logic with Strategy" pass) |
| 4 | correctness grading (name/layer + independent behavior oracle) both arms | VERIFIED | name-layer.json (33 records, 0 missing, cites T1/T2/G1/p7sweep/G1sweep); behavior.json (33 records, 33/33 tests_green, oracle=nx-differential vs 15-fail baseline / kata-jest-ci 2/2 snapshots); all 11 cell/arm groups x 3 runs |
| 5 | 13-RESULTS.md with per-cell with/without both dimensions + empirical verdict | VERIFIED | 13-RESULTS.md (132 lines) has Book authenticity + Correctness tables (per-cell with_skill/invoke_skill vs no_skill), Caveats, and a PARITY Verdict framed as empirical finding; summary.json rollup (11 rows, passAt3 + passHat3) |
| 6 | clean-room + hygiene + repo restoration | VERIFIED | no `.oracle/` path/prose in committed artifacts; ASCII-clean (rg -nP empty); only email token present = approved gmail; nx repo clean @ fea2cabbcc (=origin/23.0.x); kata clean on main, throwaway branch deleted, no worktrees; all phase-13 commits author+committer = approved gmail |

**Score:** 6/6 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `grading/book-authenticity/claims.json` | per-run per-claim list | VERIFIED | 63 claims, 11 cell/arm groups, 0 malformed |
| `grading/book-authenticity/fidelity.json` | oracle pass/partial/fail per claim + tally | VERIFIED | 63 records; 62 pass + 1 N/A; own-words `why`; DST-04 clean |
| `grading/correctness/name-layer.json` | name/layer correct y/n per run per arm | VERIFIED | 33 records; cites targets; decline handled n/a |
| `grading/correctness/behavior.json` | independent tests_green per run per arm + Pass@k | VERIFIED | 33 records; 33/33 green; differential/golden-master oracles |
| `grading/summary.json` | rollup joining all three records + Pass@k | VERIFIED | 11 rows; passAt3 + passHat3 present |
| `e2e-nx/behavior-baseline.json` | nx differential reference | VERIFIED | 169 passed / 15 failed / 184; failing suite + differential rule recorded |
| `e2e-gilded-rose/golden-master/approvals.spec.ts.snap` | pristine kata golden master | VERIFIED | seeded from pristine main (3e0085b), 388 lines / 2 snapshots |
| `e2e-gilded-rose/behavior-baseline.md` | kata jest --ci reuse note | VERIFIED | present, ASCII-clean |
| `results/apply/no_skill/**` + `with_skill/gr4/**` | 54 net-new run artifacts | VERIFIED | 27 (nx no_skill) + 18 (kata no_skill) + 9 (kata with_skill/gr4) tracked & committed |
| `13-RESULTS.md` | head-to-head + verdict | VERIFIED | 132 lines; both tables + Caveats + Verdict |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| results/apply diff.patch/answer.md | claims.json | main-context normalization (OUR output only) | WIRED | 63 claims derive from run output; no .oracle read |
| claims.json | fidelity.json | oracle agent establishes book mechanics, returns pass/partial/fail | WIRED | 62 pass verdicts + own-words why |
| diff.patch | name-layer.json | diff vs targets.json expected_family/judgment | WIRED | rows cite T1/T2/G1, p7sweep+T1-T4, G1sweep |
| diff.patch | behavior.json | git apply to fresh checkout, ORIGINAL tests on EDITED source | WIRED | nx differential (0 new failures) / kata --ci (2/2) |
| three grading records | summary.json + 13-RESULTS.md | join per cell/arm; Pass@k via run-e2e.mjs | WIRED | 11-row rollup; both tables + verdict |
| borrowed repos | pristine restored state | reset --hard base + clean; kata on main; worktrees removed | WIRED | nx clean; kata clean on main; throwaway branch gone |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
| --- | --- | --- | --- |
| claims.json well-formed | node structural check | 63 claims, 0 malformed, 1 N/A | PASS |
| fidelity verdicts complete | node structural check | 63 records, 0 missing verdict | PASS |
| correctness records complete | node structural check | name-layer 33/33, behavior 33/33 green | PASS |
| summary Pass@k present | node key check | passAt3 + passHat3 present, 11 rows | PASS |
| RESULTS structure | rg section count | Book authenticity + Correctness + Verdict + Caveats (4) | PASS |
| p2 with_skill run-3 no-edit decline | cat meta.json | changed_files [], exit_code 0 (valid REQ-1 no-edit outcome) | PASS |

Note: The independent behavior-oracle test runs (nx raw-jest differential; kata jest --ci) were NOT
re-executed by this verifier -- re-running them would disturb the now-pristine borrowed repos and the
per-run tests_green + detail evidence is recorded in behavior.json. Metered `claude -p` eval runs
were not re-run (measurement is complete, per DST-04 constraint).

### Requirements Coverage

| Requirement | Source | Description | Status | Evidence |
| --- | --- | --- | --- | --- |
| SPEC req 1 | 13-02 | no_skill single-target apply backfill | SATISFIED | 9 no_skill single-target runs persisted |
| SPEC req 2 | 13-02 | sweep pair both-arm, diffs retained | SATISFIED | p8 both arms + gr4 both arms; survive restore |
| SPEC req 3 | 13-03 | book-authenticity oracle grading | SATISFIED | fidelity.json 62 pass + 1 N/A, own words |
| SPEC req 4 | 13-01, 13-04 | correctness grading both arms | SATISFIED | name-layer + behavior, both arms, all cells |
| SPEC req 5 | 13-05 | 13-RESULTS.md + empirical verdict | SATISFIED | both tables + PARITY verdict + summary.json |
| SPEC req 6 | 13-05 | clean-room + hygiene + repo restoration | SATISFIED | DST-04/ASCII/email/repos/committer all clean |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| (none) | - | No TBD/FIXME/XXX/TODO/HACK/PLACEHOLDER in committed grading records, baselines, or 13-RESULTS.md | - | - |

The one 0-byte diff (p2 with_skill run-3) is a documented, expected QUESTION-mode advise-only
no-edit decline recorded with `changed_files: []` + `exit_code: 0` in meta.json -- a valid REQ-1
outcome, not a stub.

### Human Verification Required

None outstanding. The two "Manual-Only Verifications" flagged in 13-VALIDATION.md were both resolved:

1. **Verdict framed as empirical finding (not a pre-assumed win)** -- confirmed by this audit's read
   of 13-RESULTS.md (states PARITY with magnitude/direction, no unsupported "beats base" claim) AND
   by the dedicated from-scratch unbiased reviewer run in 13-05 Task 2, which independently derived
   "parity" from the per-cell numbers.
2. **Oracle verdicts contain no source prose (DST-04)** -- confirmed by spot-read (verdict `why`
   fields are structural paraphrase, e.g. "composition-based delegation + per-variant strategy
   classes"), the no-`.oracle/`-path scan, and the 13-05 unbiased reviewer's explicit no-source-prose
   check.

### Gaps Summary

No gaps. All six 13-SPEC.md requirements are genuinely satisfied by artifacts on disk (not merely
claimed in SUMMARYs). The empirical verdict is PARITY -- the skill shows no measurable applied-output
advantage over base Opus 4.8 @ high on book authenticity or correctness. For a measurement-only
phase this is a complete, valid finding and is NOT a deficiency. Hygiene (DST-04 clean-room,
ASCII-only, email allowlist-inversion, borrowed-repo restoration, approved-gmail committer) all pass.

---

_Verified: 2026-07-15T10:30:00Z_
_Verifier: Claude (gsd-verifier)_
