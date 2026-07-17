# Phase 13: lz-refactor vs base Opus eval -- book authenticity & correctness - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-15
**Phase:** 13-lz-refactor-vs-base-opus-eval-book-authenticity-correctness
**Mode:** `--analyze --auto --chain` (requirements locked by 13-SPEC.md; HOW-only discussion)
**Areas discussed (auto-selected):** Corpus/arms, Harness reuse, Diff persistence + repo isolation,
Book-authenticity grading pipeline, Correctness grading, Results record + verdict, Execution gate

---

## --auto trap-quadrant screen (IMPACT x CONFIDENCE)

Each gray area rated before auto-locking (CLAUDE.md `--auto` rule). Trap quadrant = HIGH impact +
NOT-HIGH confidence. This phase is measurement-only and terminal (no downstream inheritance,
reversible re-grading, ships no skill code), and the SPEC already locked the high-impact framing
(corpus, depth, verdict criterion, grading path) in its spec-phase `--auto` trap rounds.

| Gray area | Impact | Confidence | Trap? | Disposition |
|-----------|--------|-----------|-------|-------------|
| Corpus/arms (reuse vs backfill vs re-run) | LOW | HIGH (SPEC-locked; prompts/targets on disk) | no | auto-lock D-01/D-02 |
| Harness reuse | LOW | HIGH (run-e2e.mjs already supports no_skill + apply + persist) | no | auto-lock D-03 |
| Diff persistence + repo isolation | MED | HIGH (persist-before-reset verified in code) | no | auto-lock D-04 |
| Book-authenticity grading pipeline | MED | HIGH-ish (SPEC frames oracle path) | no | auto-lock D-05/D-06 |
| Correctness / behavior oracle | MED | HIGH (Phase-12 D-14 posture) | no | auto-lock D-07 |
| Results record + verdict shape | LOW | HIGH (SPEC dictates per-cell + empirical) | no | auto-lock D-08 |
| Execution gate | HIGH (spend) | HIGH (standing eval-run gate) | no | auto-lock D-09 as HARD GATE |

Conclusion: no trap-quadrant item -> full auto-lock is correct. (Contrast Phase 11 D-04-RUBRIC and
Phase 12 GA-1, which WERE trap-quadrant and were escalated.)

---

## Corpus + arms

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse skill-arm single-target + backfill no_skill; re-run sweep both arms | Matches SPEC req 1-2 disk reality | [x] |
| Re-run every cell both arms from scratch | Wastes the persisted skill-arm single-target diffs; extra spend | |
| Grade only what exists (no backfill/re-run) | Leaves no base-vs-skill delta; fails SPEC | |

**Auto-selected:** Reuse + backfill + sweep re-run (recommended default; SPEC-locked).
**Notes:** p1/p2/gr1 skill-arm diffs persisted; no_skill absent -> backfill. p8/gr4 sweep diffs
absent for both arms -> re-run both. gr4/p8 prompts + targets confirmed present in the suites.

---

## Harness reuse

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse run-e2e.mjs as-is | Already has --arm no_skill/both, --mode apply, diff+meta persist | [x] |
| Write a new grading-specific runner | Duplicates working infra; ponytail violation | |

**Auto-selected:** Reuse run-e2e.mjs (recommended default).
**Notes:** Confirmed in code: `--arm no_skill|with_skill|invoke_skill|both|all`; diff staged +
captured to workspace BEFORE borrowed-repo reset.

---

## Diff persistence + repo isolation

| Option | Description | Selected |
|--------|-------------|----------|
| Rely on run-e2e.mjs persist-before-reset into workspace tree | Diffs survive repo restoration by design | [x] |
| Persist diffs inside the borrowed repo | Lost on restoration (the prior sweep failure mode) | |

**Auto-selected:** Workspace-tree persistence via run-e2e.mjs (recommended default).
**Notes:** Throwaway branch/worktree + node_modules junction for nx sweeps; restore repos pristine +
remove worktrees after.

---

## Book-authenticity grading pipeline (DST-04)

| Option | Description | Selected |
|--------|-------------|----------|
| oracle owns verdict; main context normalizes our own diff into per-claim list | DST-04-safe; SPEC-framed | [x] |
| oracle-reviewer on raw transcripts | Contract gates drafted docs, not raw transcripts | |
| Main context reads .oracle prose to grade | DST-04 violation | |

**Auto-selected:** oracle-owned verdict + main-context claim normalization (recommended default).
**Notes:** Diff is our output (safe to read); ground truth + pass/partial/fail verdict stay in the
oracle's own words. Grading unit = every refactoring per sweep run; one move per single-target run.

---

## Correctness grading

| Option | Description | Selected |
|--------|-------------|----------|
| Independent behavior oracle: re-apply diff, run ORIGINAL tests on EDITED source | Phase-12 D-14 posture; trustworthy | [x] |
| Trust in-session self-reported test run | Self-reported; weak evidence | |

**Auto-selected:** Independent behavior oracle (recommended default).
**Notes:** name/layer-correct graded vs targets.json expected_family/judgment; tests-green via
`@nx/eslint-plugin` jest (nx) and the TypeScript approval suite (kata).

---

## Results record + verdict

| Option | Description | Selected |
|--------|-------------|----------|
| 13-RESULTS.md per-cell with/without for both dimensions + empirical verdict | SPEC req 5 | [x] |
| Narrative-only verdict | Fails per-cell acceptance | |

**Auto-selected:** Per-cell table + empirical verdict (recommended default; SPEC-dictated).
**Notes:** Verdict framed as parity or delta-with-magnitude, never a pre-assumed skill win.

---

## Execution gate

| Option | Description | Selected |
|--------|-------------|----------|
| Build all run commands in-plan; HALT for approval before any metered run | Standing eval-run-approval gate | [x] |
| Auto-execute runs in the autonomous pass | Violates the gate (no self-approval) | |

**Auto-selected:** Build-then-halt HARD GATE (recommended default).
**Notes:** ~12 sweep + ~9 backfill metered `claude -p` sessions (multi-hour). `--chain` auto-advances
discuss -> plan only; execution stops at the gate.

---

## Claude's Discretion

- Exact run-e2e.mjs invocation batching; whether nx and kata share one plan or split.
- Grading efficiency (reuse per-refactoring mechanics ground truth across runs; verdict stays
  oracle-owned).
- Exact 13-RESULTS.md table shape (one table vs two).
- Whether to add an unbiased from-scratch grading reviewer; whether a normalization helper is written.

## Deferred Ideas

- Grading the `@nx/*` fleet (p9-p13) + kata gr3 sweeps (out of scope; representative pair covers it).
- Grading coach/recommend + reference/lookup OUTPUT (out of scope; already characterized).
- Turning apply-fidelity grading into a standing CI gate (future).
- Any tuning of the shipped skill on a surfaced defect (out of scope; separate gated decision).
