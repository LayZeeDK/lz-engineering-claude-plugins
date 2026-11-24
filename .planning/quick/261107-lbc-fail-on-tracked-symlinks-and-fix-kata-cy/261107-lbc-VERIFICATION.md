---
phase: quick-261107-lbc
verified: 2026-11-24T17:02:00Z
status: passed
score: 7/7 must-haves verified
behavior_unverified: 0
overrides_applied: 0
re_verification:
  previous_status: gaps_found
  previous_score: 6/7
  gaps_closed:
    - "Item 2: grade.mjs finds a cycle log written ... beside the run folder ... (closed by 37dbb12)"
  gaps_remaining: []
  regressions: []
---

# Quick 261107-lbc: Verification Report

**Goal:** (1) a tracked symlink under plugins/ is a loud N2 failure; (2) the rules-ab kata grader finds arm-b cycle
logs outside the run folder, so the hand correction in RESULTS.md is no longer needed.
**Verified:** 2026-11-24, first on HEAD 487a87d, re-verified on HEAD 37dbb12 (branch gsd/lz-tdd-0.0.3-lz-red)
**Status:** passed
**Re-verification:** Yes, after gap closure (37dbb12)

Note: review round 2 (506eb16, 487a87d) superseded part of the plan. `symlinkEntries`/`trackedSymlinks` became
`nonFileEntries`/`trackedNonFiles` (also covering gitlinks), and the grade.mjs place scan with an `until` bound became
runner-side per-run copies read by the shared `cycle-logs.mjs`. Truths are judged by intent against the current code.

## Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | A mode-120000 entry under plugins/ is an N2 hit naming the path, checker exits 1; today's tree stays green | VERIFIED | Real repo: checker exit 0, N2 `[PASS]`. Throwaway clone (scratchpad, deleted after) with a 120000 entry and a 160000 entry staged: exit 1, `[FAIL] [lc9] every relative markdown link ... -- 2 unresolved: plugins/lz-tdd/vprobe.txt: TRACKED SYMLINK (mode 120000; ...); plugins/lz-tdd/vsub: TRACKED GITLINK (mode 160000; ...)` |
| 2 | Mode read from `git ls-files -s -z -- plugins`, parsed by a pure exported function; malformed record and git failure throw; N2 turns a throw into a hit | VERIFIED | lib/package-links.mjs `nonFileEntries` (pure, throws `malformed git ls-files -s record` on no tab or empty path) and `trackedNonFiles` (execFileSync, throws); check-red-references.mjs N2 catch pushes `git ls-files -s FAILED ...`. Selftest T5, T7, T9 pass |
| 3 | EXPECTED_CHECKS stays 125, LINK_RESOLVES_LABEL unchanged, hits ride the N2 report | VERIFIED | Checker output: `125 checks, equal to the PREDICTED literal`; the probe hits appear inside the existing lc9 link line |
| 4 | New selftest cases printed [FAIL] against the pre-fix code, quoted verbatim in SUMMARY | VERIFIED | lbc-red-task1.txt: 7 `[FAIL]`, 66 `[PASS]`, `7 of 73 assertion(s) FAILED`; lbc-red-round2.txt: 9 `[FAIL]`, 66 `[PASS]`, `9 of 75`. SUMMARY quotes both. Pre-fix state not re-run; evidence files only |
| 5 | Cycle logs are found in the rules folder, in SLIM_ROOT, beside the run folder, and inside the run folder; non-matching and out-of-window files excluded | VERIFIED (was FAILED) | Re-run fixture below on 37dbb12: all four places credited, every control excluded |
| 6 | A run's cycle logs are attributed to that run only (round-2 goal) | VERIFIED | Fixture below: two back-to-back runs rewriting the same `rules-b/cycle-log.md` each get their own content; run 1's SLIM_ROOT log not credited to run 2; no marker left |
| 7 | No metered run; plugins/ unchanged by the lbc commits; RESULTS.md numbers unchanged | VERIFIED | The five commits touch no plugins/ path (later plugins/ changes come from unrelated commits); RESULTS.md diff is prose only; no claude -p in this verification |

**Score:** 7/7 verified

## Gap closure (37dbb12)

`fix(lz-red-workspace): credit cycle logs beside the run folder again`. cycle-logs.mjs now also reads
`<run folder>.<name>` files beside the run folder, matches on the file name only (contains "cycle", or "log" with a
.md/.txt/.log extension and not a changelog), and skips the `.cycle-start` marker. `cycle-logs.test.mjs` (3 tests,
pass) runs first in `npm run check`. Author and committer are the gmail; the only email-shaped token in the commit is
the gmail.

Fixture (scratchpad, SLIM_ROOT in scratchpad, deleted after). It sources the real slim-arms.sh, simulates two arm-b
runs with begin/collect around each, and grades with `grade.mjs --cycle-logs`. Each run also wrote these controls
during the run: `node_modules/x/cycle.log`, `src/log.ts`, `test/log.test.ts`, `CHANGELOG.md` (in the run folder),
`rules-b/test-first.md`, `runs/<id>.notes.md` (beside the run folder); `stale-cycle.md` and `rules-b/CLAUDE.md` were
written before the first run.

```
== b-1
  <fx>\rules-ab\runs\b-1\src\cycle-notes.md: notes b-1
  <fx>\rules-ab\runs\b-1.cycle.md: beside b-1
  <fx>\rules-ab\runs\b-1.cycle-logs\rules-b\cycle-log.md: cycle log of b-1
  <fx>\rules-ab\runs\b-1.cycle-logs\slim-root\harness-b-1.log: harness b-1
== b-2
  <fx>\rules-ab\runs\b-2\src\cycle-notes.md: notes b-2
  <fx>\rules-ab\runs\b-2.cycle.md: beside b-2
  <fx>\rules-ab\runs\b-2.cycle-logs\rules-b\cycle-log.md: cycle log of b-2
  <fx>\rules-ab\runs\b-2.cycle-logs\slim-root\harness-b-2.log: harness b-2
== markers left:
== bad args:
Usage: node grade.mjs --cycle-logs <sinceMs> <project>
exit=2
```

No control appears, which closes the earlier warning about `src/log.ts`, `test/log.test.ts` and `CHANGELOG.md`.

## Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full battery | `npm run check` in .claude/skills/lz-red-workspace | exit 0; cycle-logs tests 3 pass; package-links 75/75; RED-REFS GREEN (125 checks); RGR-ROUTING GREEN; EVASIONS 19 CAUGHT, 8 OPEN = baseline | PASS |
| Gate fails on non-file entries | checker in a throwaway clone with 120000 + 160000 staged | exit 1, both named | PASS |
| Syntax | `node --check` cycle-logs.mjs, grade.mjs, grade-rgr.mjs; `bash -n` slim-arms.sh, run-ab.sh, run-rgr.sh | all ok | PASS |

## Commit hygiene

| Commit | Author / committer | AI trailers |
|--------|--------------------|-------------|
| 878b46e | larsbrinknielsen@gmail.com / same | none |
| 15a3675 | larsbrinknielsen@gmail.com / same | none |
| 506eb16 | larsbrinknielsen@gmail.com / same | none |
| 487a87d | larsbrinknielsen@gmail.com / same | none |
| 37dbb12 | larsbrinknielsen@gmail.com / same | none |

Email-shaped tokens in the messages and diffs: none in the first four; the gmail only in 37dbb12. Positive control:
the same pattern on AGENTS.md finds the gmail twice.

## Anti-Patterns

| File | Issue | Severity |
|------|-------|----------|
| package.json | `&&node` missing a space in the `check` script (works) | INFO |

No TBD/FIXME/XXX markers in changed files.

## Gaps Summary

None. The beside-the-run-folder gap and the srvx false-positive warning are both closed by 37dbb12, confirmed by
the fixture.

_Verified: 2026-11-24T17:02:00Z_
_Verifier: Claude (gsd-verifier)_
