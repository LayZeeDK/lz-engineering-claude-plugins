---
phase: 21
plan: 02
subsystem: eval-harness
tags: [eval, red, apply-eval, differential-tsc, vitest-json, classifier, fixtures, d06-gate]
requires:
  - phase: 21-01
    provides: "e2e-red-gilded-rose suite.json/targets.json (GRC runner commands + test_dir + strict_scope_note the gate reads)"
provides:
  - "grade-red.mjs -- the D-06 RED correctness gate: differential tsc + the target's own runner JSON + a 7-class classify() passing ONLY genuinely_red"
  - "pure classify(tscResult, runnerJson, diffPatch) + gradeFixture() + gradeRun() exports for 21-03 to import"
  - "six selfcheck-only fixture pairs (red/green/compile/collect/notest/wrong) + the pinned vitest 4.1.10 JSON shapes"
  - "grade-red --selfcheck: offline zero-spend proof of all 7 D-06 classes"
affects:
  - "21-03 tabulate-mechanical-red.mjs (consumes red-grade.json + imports classify/gradeFixture for selfcheck-red)"
  - "21-04 RUN-GATE (grade-red --run grades each captured run at the gated metered run)"
tech-stack:
  added: []
  patterns:
    - "differential-tsc NEW-errors-only (baseline vs with-test set-difference; the kata's untyped Item source never sinks the verdict -- Pitfall 3)"
    - "runner-JSON classifier (mechanical 7-class decision from testResults[].assertionResults[], not a text/vocabulary scan)"
    - "collect-vs-notest disambiguation on testResults[0].message (identical vitest JSON shape otherwise)"
    - "selfcheck-only fixtures (never eval targets); --outputFile to os.tmpdir() keeps fixtures pristine"
    - "fail-closed gate integrity (throw on empty/missing diff, garbled meta, unparseable runner JSON)"
key-files:
  created:
    - ".claude/skills/lz-red-workspace/grade-red.mjs"
    - ".claude/skills/lz-red-workspace/fixtures/red/{module.ts, module.spec.ts}"
    - ".claude/skills/lz-red-workspace/fixtures/green/{module.ts, module.spec.ts}"
    - ".claude/skills/lz-red-workspace/fixtures/compile/{module.ts, module.spec.ts}"
    - ".claude/skills/lz-red-workspace/fixtures/collect/module.spec.ts"
    - ".claude/skills/lz-red-workspace/fixtures/notest/module.spec.ts"
    - ".claude/skills/lz-red-workspace/fixtures/wrong/{module.ts, module.spec.ts}"
  modified: []
key-decisions:
  - "grade-red.mjs is the ONE hard D-06 gate: tsc --strict clean (differential, NEW errors only) AND an ASSERTION failure on current code = genuinely_red (the only pass); everything else is reported, not passed."
  - "drove_to_green is split from false_green by inspecting the diff for a production (non-test) file change (Pitfall 9); a benign compiling stub that keeps the test red is NOT a fault (Law 2)."
  - "vitest 4.1.10 --reporter=json shapes were EMPIRICALLY PINNED against the six fixtures (RESEARCH A1); collect_error vs no_tests are disambiguated ONLY on testResults[0].message."
  - "EVL-03 NOT marked Complete -- 21-02 closes the EVL-03.3 BUILD sub-criterion; the empirical run is gated to 21-04 (mirrors 21-01 build-then-halt, D-14)."
patterns-established:
  - "Differential tsc counts NEW errors only via baseline/with-test set-difference, so a repo whose pristine tsc --strict is already non-zero (untyped Item ctor) does not fail the produced test."
  - "The classifier reads the runner's structured JSON (assertionResults[].status + failureMessages[]); an ASSERTION message => genuinely_red, a runtime/type error masquerading as a failure => wrong_reason."
requirements-completed: []

coverage:
  - id: D1
    description: "grade-red.mjs mechanically classifies a produced test into the 7 D-06 classes (differential tsc + the target's own runner), passing only genuinely_red, with drove_to_green detection and fail-closed integrity."
    requirement: "EVL-03"
    verification:
      - kind: other
        ref: "node .claude/skills/lz-red-workspace/grade-red.mjs --selfcheck (exit 0; all 7 classes proven offline, zero spend)"
        status: pass
      - kind: other
        ref: "node --check .claude/skills/lz-red-workspace/grade-red.mjs (exit 0; module-main guard + classify/gradeFixture/gradeRun exported)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Six selfcheck-only fixture pairs (red/green/compile/collect/notest/wrong) each classify to their expected D-06 class against the pinned vitest 4.1.10 runner; the wrong/ fixture is tsc-strict clean yet classifies wrong_reason."
    requirement: "EVL-03"
    verification:
      - kind: unit
        ref: "grade-red --selfcheck fixture loop: red->genuinely_red, green->false_green, compile->compile_error, collect->collection_error, notest->no_tests, wrong->wrong_reason (all OK)"
        status: pass
    human_judgment: false

duration: 18min
completed: 2026-07-23
status: complete
---

# Phase 21 Plan 02: RED Correctness Gate (grade-red.mjs) Summary

**grade-red.mjs -- the mechanical D-06 RED correctness gate: a differential `tsc --noEmit --strict`
(NEW errors only) plus the target's own vitest/jest JSON reporter, classifying a produced test into
7 classes and passing ONLY genuinely_red, with drove_to_green detection and fail-closed integrity --
proven offline on 6 fixture pairs + a mandatory synthetic drove_to_green assertion (`--selfcheck`
exit 0, zero spend, fixtures pristine).**

## Performance

- **Duration:** ~18 min (working time; wall-clock spanned a session-limit reset)
- **Started:** 2026-07-22T23:14:55Z
- **Completed:** 2026-07-23
- **Tasks:** 2
- **Files created:** 11 (grade-red.mjs + 10 fixture files)

## Accomplishments

- Built `grade-red.mjs`, the genuinely-new logic of Phase 21: a POST-RUN pass that applies a captured
  run's `diff.patch` to a fresh `os.tmpdir()` worktree at `applyBase`, runs a DIFFERENTIAL
  `tsc --noEmit --strict` (baseline vs with-test set-difference, so the kata's pre-existing untyped
  `Item` source never sinks the verdict -- Pitfall 3), runs the TARGET's own runner (command + cwd
  read from suite/targets, not the workspace -- Pitfall 4), and classifies via a pure `classify()`
  into exactly one of `genuinely_red / false_green / drove_to_green / compile_error /
  collection_error / no_tests / wrong_reason`. `pass` is true for `genuinely_red` only (D-06).
- Empirically PINNED the assumed vitest 4.1.10 `--reporter=json` shapes (RESEARCH A1) against the six
  fixtures before writing `classify()`, then wrote the classifier to match the real shapes.
- Authored six SELFCHECK-ONLY fixture pairs (one per runnable class) + wired `grade-red --selfcheck`,
  which proves all SEVEN classes offline with zero spend and leaves the fixtures + repos pristine.
- Fail-closed everywhere (T-21-02 / T-21-V5): an unreadable/empty `diff.patch`, a garbled/keyless
  `meta.json`, or an unparseable runner JSON throws rather than silently scoring "no change".

## Pinned runner-JSON findings (RESEARCH A1 -- the crux this plan verifies)

Measured against the workspace's pinned vitest 4.1.10 + typescript 6.0.3 (`--reporter=json
--outputFile=<tmp>`, Jest-compatible shape):

| Fixture | tsc --strict | Key JSON signature | Verdict |
|---------|--------------|--------------------|---------|
| red | clean | `assertionResults[0].failureMessages[0]` = "AssertionError: expected -1 to be 5..." | genuinely_red |
| green | clean | `assertionResults[0].status='passed'` | false_green |
| compile | 1 error (TS2345) | tsc NEW errors > 0 (short-circuits before the runner) | compile_error |
| collect | clean | `numTotalTests=0`, `testResults[0].status='failed'`, `assertionResults=[]`, message="Cannot read properties of undefined..." | collection_error |
| notest | clean | `numTotalTests=0`, `status='failed'`, `assertionResults=[]`, message="No test found in suite..." | no_tests |
| wrong | clean | `assertionResults[0].failureMessages[0]` = "TypeError: ...compute is not a function" | wrong_reason |

- **The load-bearing discovery:** `collection_error` and `no_tests` have an IDENTICAL vitest JSON
  shape (both `numTotalTests=0`, `status='failed'`, empty `assertionResults`). The ONLY discriminator
  is `testResults[0].message` -- so `classify()` disambiguates on it (`NO_TESTS_RE` matches
  "No test found in suite" / "must contain at least one test"; anything else with zero assertions is
  a load/import throw = `collection_error`).
- `wrong_reason` is caught two ways (belt and suspenders): the runtime message fails `ASSERTION_RE`
  AND matches `RUNTIME_RE` ("is not a function"), so a runtime/type error masquerading as a failure
  is never scored genuinely_red.
- `drove_to_green` is the ONE class with no runnable fixture; it is proven by a MANDATORY synthetic
  `classify()` assertion (green runnerJson + a production-file diff -> drove_to_green, vs a test-only
  diff -> false_green).

## Task Commits

Committed atomically. Commit ORDER is fixtures-first so the grade-red.mjs commit is immediately
selfcheck-verifiable (the fixtures it needs already exist) -- see Deviations.

1. **Fixture pairs (plan Task 2 artifacts)** - `ff40490` (test)
2. **grade-red.mjs D-06 gate + selfcheck (plan Task 1 logic + Task 2 selfcheck)** - `5498be4` (feat)

**Plan metadata:** (this SUMMARY + STATE.md + ROADMAP.md) - docs commit below.

## Files Created/Modified

- `.claude/skills/lz-red-workspace/grade-red.mjs` - The D-06 gate: `classify()` (pure 7-class),
  `gradeFixture()` (offline selfcheck path), `gradeRun()` (real gate over a captured run: worktree +
  differential tsc + target runner + writes `red-grade.json`), `runSelfcheck()`, module-main guard.
- `.claude/skills/lz-red-workspace/fixtures/red/{module.ts,module.spec.ts}` - compiling stub + wrong body -> genuinely_red.
- `.claude/skills/lz-red-workspace/fixtures/green/{module.ts,module.spec.ts}` - correct module + passing test -> false_green.
- `.claude/skills/lz-red-workspace/fixtures/compile/{module.ts,module.spec.ts}` - spec with a --strict type error -> compile_error.
- `.claude/skills/lz-red-workspace/fixtures/collect/module.spec.ts` - spec-only; top-level throw at load (tsc-clean) -> collection_error.
- `.claude/skills/lz-red-workspace/fixtures/notest/module.spec.ts` - spec-only; describe with no it() bodies -> no_tests.
- `.claude/skills/lz-red-workspace/fixtures/wrong/{module.ts,module.spec.ts}` - tsc-clean; runtime TypeError inside it() -> wrong_reason.

## Decisions Made

- **The classifier reads structured JSON, never text.** Correctness is the one hard gate; making it
  mechanical (run the test, classify the runner's assertionResults) means no house-vocabulary proxy
  can inflate it (Phase-20 lesson).
- **Differential tsc, NEW errors only.** Baseline error set at the pristine worktree vs the with-test
  set; the difference is what the produced test introduced. A repo whose pristine `tsc --strict` is
  already non-zero (the kata's untyped `Item` ctor) therefore does not fail the produced test.
- **EVL-03 stays Pending (build complete; empirical run gated).** This plan closes the EVL-03.3 BUILD
  sub-criterion only; the metered run is 21-04. `requirements mark-complete` was deliberately NOT
  run (mirrors 21-01 / D-14). `requirements-completed: []`.

## Deviations from Plan

### Execution-ordering (not scope): fixtures committed before grade-red.mjs

- **What:** The plan lists Task 1 = grade-red.mjs and Task 2 = fixtures + selfcheck. I committed the
  fixtures FIRST (`ff40490`, test) and grade-red.mjs SECOND (`5498be4`, feat).
- **Why:** grade-red.mjs's `--selfcheck` depends on the fixtures existing, so committing fixtures
  first makes the grade-red.mjs commit immediately selfcheck-verifiable (green at that commit) rather
  than committing a script whose selfcheck cannot yet run. The coordinator explicitly directed this
  order. All specified deliverables were built (grade-red.mjs + ALL 10 fixture files + every
  classifier branch + the full --selfcheck with all 7 classes + fail-closed assertions). No scope
  change; the plan's file list is fully satisfied.

### Design refinement forced by the pinned shapes (faithful extension, not a departure)

- The RESEARCH `classify()` sketch returned a fused `false_green_or_drove` and did not distinguish
  `no_tests` from `collection_error`. The empirically-pinned vitest shapes required (a) splitting
  drove_to_green from false_green on the diff, and (b) disambiguating no_tests from collection_error
  on `testResults[0].message`. Both are the plan's explicit intent (the 7-class set + Pitfall 9); the
  message-based split is the mechanical realization of it.

## Issues Encountered

- **TypeScript 6.0.3 `--ignoreConfig` requirement (blocking, auto-fixed inline -- Rule 3).** TS 6.x
  emits `TS5112` when files are passed on the command line while a `tsconfig.json` is present. The
  fixture tsc invocation therefore passes `--ignoreConfig` plus explicit compiler options mirroring
  the workspace tsconfig. Discovered by an empirical probe before finalizing the classifier.
- **Fixture pristineness.** vitest writes a `node_modules/.vite` cache inside each fixture dir on
  first run; these are already gitignored (verified), and the JSON report is written to
  `os.tmpdir()` (not the fixture), so `git status --porcelain fixtures/` is empty after the selfcheck.

## Verification (all offline, zero spend)

- `node --check grade-red.mjs` exit 0; module-main guard present; `classify` / `gradeFixture` /
  `gradeRun` / `verdictPass` / diff helpers / `VERDICTS` exported.
- `node grade-red.mjs --selfcheck` exit 0: red->genuinely_red, green->false_green,
  compile->compile_error, collect->collection_error, notest->no_tests, wrong->wrong_reason, plus the
  mandatory synthetic drove_to_green (vs test-only false_green) and the fail-closed paths (empty diff,
  null/empty runner JSON throw).
- `git status --porcelain .claude/skills/lz-red-workspace/fixtures` empty after the selfcheck
  (fixtures pristine; vitest caches gitignored); no claude process spawned.
- `git status --porcelain plugins/lz-tdd` empty (skill under test untouched; NO dependency added).
- ASCII-only across all 11 files; email allowlist-inversion clean (no maintainer work-email/domain).

## Known Stubs

None. The real gate `gradeRun()` is fully implemented (worktree + differential tsc + target runner +
`red-grade.json`) but is NOT exercised in this plan by design -- it needs a captured metered run,
which is gated to 21-04 (D-12). Its integrity is proven by the shared `classify()` (fixture-verified)
plus `node --check`; the fixtures selfcheck is the build-time verification of the runner-JSON shape.

## Threat Surface

Both register threats for this plan were mitigated; no new surface introduced:
- **T-21-02** (Tampering / false verdict): grade-red fails CLOSED -- unreadable/empty diff.patch,
  garbled/keyless meta.json, and unparseable/empty runner JSON all throw (asserted by the selfcheck).
- **T-21-12** (worktree files/resources): per-grade detached `os.tmpdir()` worktree with finally-style
  `worktree remove --force` + `prune`; refuses a protected branch name.
- **T-21-V5** (runner JSON parse): defensive parse of testResults[]/assertionResults[]; a missing
  suite -> collection_error (not a crash); the fixtures selfcheck verifies the shape offline.

## Next Phase Readiness

- **21-03** (`tabulate-mechanical-red.mjs` + `selfcheck-red`): import `classify` / `gradeFixture` from
  grade-red.mjs; consume `red-grade.json` (verdict + pass) as the correctness-gate input to Pass@k /
  Pass^k. The runner-JSON shape is now pinned, so no shape surprises downstream.
- **21-04** (RUN-GATE): `grade-red --run <runDir> [--suite <dir>]` grades each captured run; the
  runner command is read from `GRC.runner` (prefer jest --json per A1 if the vitest 0.28 shape drifts
  on the kata), `test_dir` = `test/vitest/`, differential tsc per `strict_scope_note`.
- HALT boundary intact: nothing metered ran; EVL-03 remains Pending (empirical run user-gated).

## Self-Check: PASSED

- Created files: all 11 FOUND on disk (grade-red.mjs + 10 fixture files).
- Commits: both FOUND (ff40490 fixtures, 5498be4 grade-red.mjs).
- `grade-red --selfcheck` exits 0 (all 7 D-06 classes proven offline, fixtures pristine).

---
*Phase: 21-applied-red-eval-in-real-oss-repos-multi-dimensional-3-arm-inserted*
*Completed: 2026-07-23*
