---
phase: 22-three-way-classifier-correctness-lz-refactor-lz-red
plan: 07
subsystem: phase gate -- offline battery proof plus the two gated documents, then HALT
tags: [phase-gate, zero-spend, halt-gate, blocking-human, non-vacuous-widen, frozen-evidence, known-gap]
status: complete
requires:
  - .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs (22-01: the semantic routing gate)
  - plugins/lz-tdd/skills/{lz-red,lz-tpp,lz-refactor}/SKILL.md (22-03: the fixed classifier surfaces)
  - plugins/lz-tdd/references/beck-tdd-by-example.md (22-04: the repaired plugin-wide seam)
  - .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs (22-05: the placement arm group)
  - .claude/skills/lz-red-workspace/grade-routing.mjs (22-05: the destination grader)
  - .claude/skills/lz-red-workspace/variants/build-variants.mjs (22-06: the two generated trees)
  - .claude/skills/lz-red-workspace/selfcheck-routing.mjs (22-06: the offline arm proof)
provides:
  - "the full-battery-GREEN record, every number compared against its measured pre-phase baseline"
  - "e2e-rgr-routing/RUN-GATE.md -- two separately-approvable metered rounds, presented and HALTED"
  - "ROUTING-AB-RESULTS.md -- the phase-scoped writeup scaffold, every figure a blank placeholder"
  - "two MEASURED rollup gaps, recorded rather than discovered at run time"
affects:
  - "the blocking-human checkpoint the orchestrator puts to the owner"
  - "the D-18/SC7 acceptance review and the D-26 unprimed review (both ORCHESTRATOR gates)"
  - "both metered rounds, which start only on fresh explicit owner approval"
tech-stack:
  added: []
  patterns:
    - "a rollup step that exits 0 while tabulating nothing is the failure shape that looks healthiest -- record it, do not work around it"
    - "caveats authored BEFORE the numbers, because a caveat written after a result is indistinguishable from a rationalization of it"
    - "blank placeholders asserted MECHANICALLY (no two-decimal token in the file) rather than promised"
    - "allowlist-inversion with a passing positive control, so a zero is a result and not a failed command"
key-files:
  created:
    - .claude/skills/lz-red-workspace/e2e-rgr-routing/RUN-GATE.md
    - .claude/skills/lz-red-workspace/ROUTING-AB-RESULTS.md
  modified:
    - .planning/phases/22-three-way-classifier-correctness-lz-refactor-lz-red/deferred-items.md
decisions:
  - "The two rollup gaps were RECORDED, not fixed. Plan 22-07's files_modified is the two documents; the tabulator is on VALIDATION.md's assert-unchanged line; and neither fix can be end-to-end verified without the metered run this phase HALTS on. Same disposition as the 22-03 and 22-04 escalations."
  - "RUN-GATE.md presents the tabulator command AND states immediately that it is a measured silent no-op for this suite, rather than omitting the command or presenting it as working. An operator who meets the gap at the gate loses nothing; one who meets it mid-round has already spent."
  - "The interim Task 1 commit was made before Task 2 began, against the executor's usual write-once SUMMARY flow, because a provider quota limit had already destroyed one executor on this plan and the battery record is the single expensive artifact here."
metrics:
  duration: "~55 min (base f8643eb -> final, 2026-08-03)"
  tasks_completed: 2
  checkpoint_reached: 3
  commits: 3
  files_created: 2
  files_modified: 1
  metered_spend: none
  reviewers_spawned: 0
  completed: 2026-08-03
---

# Phase 22 Plan 07: Close the BUILD and HALT Summary

The classifier and the instrument are proven GREEN offline with every number moved against a recorded
baseline, the two gated documents are authored, and the phase HALTS at a blocking-human gate holding
two separately-approvable metered rounds. Two rollup gaps were MEASURED and recorded rather than
papered over. Nothing metered ran, no reviewer was spawned, and no variant was selected.

## Commit trail

| Task | Name | Commit | Files |
| ---- | ---- | ------ | ----- |
| 1 | The offline battery, recorded | `5d406f6` | `22-07-SUMMARY.md` (interim, battery record) |
| 2 | The two gated documents | `774b5ca` | `e2e-rgr-routing/RUN-GATE.md` (new), `ROUTING-AB-RESULTS.md` (new) |
| 3 | HALT -- checkpoint reached | this commit | `22-07-SUMMARY.md` (final), `deferred-items.md` |

Fork base `f8643eb`. No `plugins/` file touched. No `STATE.md` or `ROADMAP.md` change (worktree mode
-- the orchestrator owns those). Nothing staged under the gitignored build-output directory or any
capture path.

## Task 1 -- the full offline battery, GREEN, at zero spend

Every command below ran in this worktree at base `f8643eb` unless the row says otherwise. No
command in this task invokes a model. Zero metered spend.

### Commands run, by name, with outcome

| # | Command | Outcome |
|---|---------|---------|
| 1 | `npm --prefix .claude/skills/lz-red-workspace run check` | exit 0 -- 5 checkers chained (provenance-honesty selftest, row-guards selftest, `check-red-references.mjs`, `check-rgr-routing.selftest.mjs`, `check-rgr-routing.mjs`) |
| 2 | `npm --prefix .claude/skills/lz-refactor-workspace run check` | exit 0 -- all ten checkers including the widened `check-hygiene.mjs` |
| 3 | `node .claude/skills/lz-red-workspace/extract-samples.mjs` | exit 0 -- 8 modules `tsc --strict --noEmit` clean, 0 skipped |
| 4 | `node .claude/skills/lz-red-workspace/check-evals.mjs` | exit 0 -- see the eval-lint numbers below |
| 5 | `node .claude/skills/lz-red-workspace/selfcheck-red.mjs` | **ORCHESTRATOR-VERIFIED, NOT RE-RUN HERE** -- see the section below |
| 6 | `node .claude/skills/lz-red-workspace/variants/build-variants.mjs` | exit 0 -- 2 trees, 4 declared deltas each, matched exactly |
| 7 | `node .claude/skills/lz-red-workspace/selfcheck-routing.mjs` | exit 0 -- 6/6 cruxes PASS |
| 8 | `node .claude/skills/lz-red-workspace/grade-routing.mjs --selfcheck` | exit 0 -- 10 hand-authored fixtures |
| 9 | `node .claude/skills/lz-red-workspace/grade-red.mjs --selfcheck` | exit 0 -- all nine D-06 classes |
| 10 | `node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --selfcheck` | exit 0 -- Pass@k / Pass^k at k=1,3,5,total |
| 11 | `node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck` | exit 0 -- `SELFCHECK OK` |
| 12 | `claude plugin validate .` | exit 0 -- `Validation passed` |
| 13 | `claude plugin validate . --strict` | exit 0 -- `Validation passed` |
| 14 | `git diff --stat` over the five frozen instrument files | EMPTY |

### `selfcheck-red.mjs` -- orchestrator-verified in the main tree, deliberately not re-run here

The ORCHESTRATOR ran `node selfcheck-red.mjs` to completion in the MAIN working tree at exactly
this plan's base commit `f8643eb`, and it exited **0**:

> `selfcheck-red: OK -- exit 0` -- composition, prompt-parity, worktree base, transcript parse,
> classifier, the target-toolchain canary, captured-diff containment, the runtime write path, the
> grading temp dir landing on each target's OWN volume, and the lz-refactor nx regression all pass;
> zero claude spend, borrowed repo left pristine.

It was NOT re-run inside this worktree, and this executor makes no claim to have run it. Two
measured reasons, both from today:

1. It takes roughly 15 minutes and spawns real git worktrees against three BORROWED external repos.
2. The 22-06 executor started it; it was still running when that plan closed; the orchestrator then
   force-removed the worktree, killing the process mid-run and STRANDING a grading worktree inside a
   borrowed repo (`radix-ng/primitives-pin`). That stranded directory made crux 7's canary FAIL, and
   clearing it required an out-of-project destructive removal that needed explicit owner permission.

This is a PASS in the authoritative environment, not a blocked or missing check. Its two
phase-relevant obligations are additionally proven here directly: the file is byte-unchanged
(row 14), and D-22's requirement that its `e2e-red-*` auto-discovery filter was not copied into
`selfcheck-routing.mjs` was measured in both directions by 22-06.

### The routing gate -- GREEN over eleven surfaces and nine corpus cases

`check-rgr-routing.mjs`: `SUMMARY: RGR-ROUTING GREEN -- 9 corpus cases exhaustive and at-most-one
over 3 step-1 procedures, no bare catch-all terminal, no test-state key in any of 11 surfaces,
citations resolve, descriptions within the 1536-char cap`.

The eleven surfaces by label (8 router, 3 mode-gate), each passing the scan floor with its branch
count:

| Surface label | Branches | File |
|---------------|----------|------|
| `refactor-step1` | 5 | `plugins/lz-tdd/skills/lz-refactor/SKILL.md` |
| `refactor-modes` | 5 | `plugins/lz-tdd/skills/lz-refactor/SKILL.md` |
| `refactor-narrative` | 7 | `plugins/lz-tdd/skills/lz-refactor/SKILL.md` |
| `red-step1` | 5 | `plugins/lz-tdd/skills/lz-red/SKILL.md` |
| `red-modes` | 4 | `plugins/lz-tdd/skills/lz-red/SKILL.md` |
| `red-narrative` | 7 | `plugins/lz-tdd/skills/lz-red/SKILL.md` |
| `tpp-step1` | 5 | `plugins/lz-tdd/skills/lz-tpp/SKILL.md` |
| `tpp-modes` | 4 | `plugins/lz-tdd/skills/lz-tpp/SKILL.md` |
| `tpp-narrative` | 7 | `plugins/lz-tdd/skills/lz-tpp/SKILL.md` |
| `laws-classify` | 10 | `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` |
| `beck-seam` | 6 | `plugins/lz-tdd/references/beck-tdd-by-example.md` |

Corpus floor: `9 cases, 11 surfaces, 3 step-1 procedures`, every case with non-empty match tokens
over a non-empty surface list.

Which labels close which requirement:

| Req | Labels that close it | Evidence |
|-----|----------------------|----------|
| CLS-01 | `[cls-01] exhaustive` (9/9) and `[cls-01] no bare catch-all terminal` (8/8 router surfaces) | every case lands on a named owner; `c9` resolves to *a declared residual terminal claiming no owner*, which is D-01's named-owner enumeration rather than a catch-all |
| CLS-02 | `[cls-02] at-most-one` (9/9) | each case claimed by at most one step-1 procedure; `c3` -> `red-step1` and `c5` -> `refactor-step1` are the D-04 test-code pair resolving to DIFFERENT owners |
| CLS-03 | `[cls-03] single-axis` (11/11), `[cls-03] sweep-rule citation resolves`, `[cls-03] QUESTION/COMMAND anchor resolves` | zero routing branches key on test state across all eleven surfaces; the D-07 citation and anchor both resolve |
| CLS-04 | `check-rgr-routing.selftest.mjs` mutations 4, 5 and 8, plus the gate's own `[cls] scan floor` and `[cls] corpus floor` | a renamed heading and a vanished file each fail CLOSED with an attributable reason; an emptied corpus and an emptied surface list both FAIL, so no vacuous pass is available |

The `c4` two-hop is present and ORDERED: `[cls-01] exhaustive -- c4 has a named owner -- lz-red
then lz-tpp (ordered)`, which is D-02's TDD-correct answer.

### The numbers, each against its measured pre-phase baseline

| Measurement | Pre-phase baseline | Now | Movement |
|-------------|--------------------|-----|----------|
| `check-red-references.mjs` roster label | 125 checks | **125 checks**, all 13 new labels present, none of the 64 retired labels surviving | UNCHANGED, as D-16 requires |
| `check-hygiene.mjs` wide (ASCII + email allowlist) | 197 files | **199 files** | RISEN by 2 |
| `check-hygiene.mjs` no-verbatim | 190 files | **192 files** | RISEN by 2 |
| `check-hygiene.mjs` scope-floor label | absent | **PASS** -- `[cls] hygiene scope floor -- plugin-wide references + README reached -- wide 199 / verbatim 192 (197 / 190 before the D-21 widen)` | new, and it names both the old and new counts itself |
| `check-evals.mjs` authored-file sweep | 14 files across 3 suite dirs | **25 files across 4 suite dirs** (`e2e-red-*` + `e2e-rgr-routing`) | RISEN |
| `lz-refactor` folded description | 1233 chars | **1369 chars** (167 headroom) | under the 1536 cap |
| `lz-tpp` folded description | 750 chars | **840 chars** (696 headroom) | under the 1536 cap |
| `lz-red` folded description | 1245 chars | **1439 chars** (97 headroom) | under the 1536 cap |

**Why the hygiene widen is NON-VACUOUS.** D-21 recorded that `plugins/lz-tdd/README.md` and
`plugins/lz-tdd/references/beck-tdd-by-example.md` fell outside all three of the checker's axes --
and `beck-tdd-by-example.md` is exactly the file this phase REPAIRED (D-20b) and exactly the
directory variants B and C write into. Before the widen, D-19's hygiene re-run would have been a
vacuous pass on the phase's own repaired file. The count moved 197 -> 199 and 190 -> 192, and the
scope-floor label passes with both numbers printed, so the widen is proven by a risen count rather
than asserted. The previously-unscanned file that mattered is
`plugins/lz-tdd/references/beck-tdd-by-example.md`.

**Why the eval-lint widen is NON-VACUOUS.** The clause-8 glob was `e2e-red-*`-anchored, which by
construction could never reach `e2e-rgr-routing` (deliberately named outside that prefix per D-22).
The swept set moved from 14 files across 3 suite dirs to 25 across 4, and the checker names the new
dir in its own summary line, so the new suite's authored prose is genuinely inside the ASCII and
email-allowlist sweep.

### Variant builder -- delta sets and frontmatter identity

`build-variants.mjs` exit 0. Both generated trees carry exactly 4 declared deltas and no more:

| Variant | Delta set |
|---------|-----------|
| `variant-b` | added `references/rgr-routing.md`; edited `skills/lz-red/SKILL.md`, `skills/lz-refactor/SKILL.md`, `skills/lz-tpp/SKILL.md` |
| `variant-c` | added `references/rgr-routing.md`; edited `skills/lz-red/SKILL.md`, `skills/lz-refactor/SKILL.md`, `skills/lz-tpp/SKILL.md` |

Per-skill frontmatter hash, IDENTICAL across all three trees (variant A is the tracked tree):

| Skill | Hash |
|-------|------|
| `lz-red` | `0e7c4d3408d99502` |
| `lz-tpp` | `004f400f9e2bf244` |
| `lz-refactor` | `35b3b7666d92c3d0` |

Also asserted by the builder in the same run: source tree `plugins/lz-tdd` UNTOUCHED (195 files
hashed before and after, all identical); all 3 pairs pairwise DISTINCT for each of the 3 `SKILL.md`
files (9 comparisons); the shared table BYTE-IDENTICAL in B and C (`d61f43debd38`); no generated
tree carries the staging note.

`selfcheck-routing.mjs` re-proves the frontmatter identity INDEPENDENTLY at measurement time
(crux 3, same three hashes) and confirms 3 arms x 9 byte-identical prompts across 3 distinct plugin
dirs. That D-11 assertion has to exist twice: 22-06 MEASURED that a one-byte frontmatter mutation is
invisible to the delta-set check, because the file was already declared `edited`.

### Frozen Phase-20 and Phase-21 evidence -- intact

`git diff --stat` is EMPTY for all five:

- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs`
- `.claude/skills/lz-red-workspace/selfcheck-red.mjs`
- `.claude/skills/lz-red-workspace/grade-run.mjs`
- `.claude/skills/lz-red-workspace/grade-red.mjs`
- `.claude/skills/lz-red-workspace/merge-judge.mjs`

Stronger than the diff: `git log --oneline -3` over that path set returns `da17585`, `50fb4ba`,
`11cb762` -- the most recent is the pre-Phase-22 `260803-53q` quick task. **No Phase 22 commit
touched any of these five files.** The roster label independently confirms the arithmetic survived:
125 checks, 13 new labels, 64 retired absent.

### Working-state attestation

`git status --porcelain` shows exactly one entry: `?? .claude/skills/lz-refactor-workspace/package-lock.json`.

- Nothing is staged or created under the gitignored build-output directory (`out/`). `git ls-files`
  under `.claude/skills/lz-red-workspace/out` returns nothing; the only tracked files under
  `variants/` are the two source artifacts 22-06 authored (`build-variants.mjs`, `rgr-routing.md`).
- No generated variant artifact is tracked. The two built trees live under gitignored `out/` and do
  not appear in `git status`.
- Nothing new under any results, `run-*` or outputs path. (`git ls-files` does match pre-existing
  `run-N` directories under `.claude/skills/lz-tpp-workspace/iteration-1/` -- those are the tracked
  Phase-5 eval records from lz-tdd@0.0.1 and predate this phase entirely. This plan created none.)
- The one untracked file is an install byproduct, described below. It is NOT staged.

### Environment note -- stated by mechanism, not guessed

A fresh git worktree does not carry gitignored files, so this worktree started with no
`node_modules` under either workspace. `npm --prefix .claude/skills/lz-red-workspace install` and
`npm --prefix .claude/skills/lz-refactor-workspace install` restored them from the tracked, pinned
lockfile. **No package was added and no dependency is missing from the repo** -- this is the same
restore 22-04 and 22-06 recorded. Without it, `extract-samples.mjs` (typescript) and
`grade-red.mjs --selfcheck` (angular-typechecker) would report environment failures rather than
measured results.

`.claude/skills/lz-refactor-workspace/` has no tracked `package-lock.json`, so its install generated
one. That file is an install byproduct, is NOT staged, and is not part of this plan's diff. An
attempt to delete it was refused by the permission classifier as an unrequested deletion; leaving it
untracked is harmless -- the orchestrator force-removes this worktree on return.

### A GREEN battery is a FLOOR, not a verdict

Recorded explicitly, because it is the exact failure this phase exists to prevent: **a 125/125 green
battery coexisted with a non-exhaustive classifier.** The deterministic layer proves the AUTHORED
classifier is exhaustive, disjoint and single-axis over the corpus. It does NOT prove that a model
ROUTES correctly -- that is CLS-05's metered eval, manual-only by D-14 -- and it does not prove that
prose surrounding a parsed surface agrees with it. Two OPEN items in `deferred-items.md` are
structurally invisible to this gate by construction and are named inputs to the reviews:

- the `lz-refactor/SKILL.md` intro paragraph above the first `## ` heading (outside all eleven
  parsed surfaces) -- input to the D-18/SC7 review;
- two skill-relative sentences in `beck-tdd-by-example.md` outside the repaired seam section --
  input to the D-26 review.

**The acceptance verdict is the ORCHESTRATOR's unprimed review, not this task's.** This task claims
a floor only.

### Deviations during Task 1

None. No checker was weakened, skipped or gated. Every check was run as written and every one
passed.

---

## Task 2 -- the two gated documents

Both files are ASCII-only, carry zero email-shaped tokens, and were verified with passing positive
controls so that every zero is a measured result rather than a failed command.

### `e2e-rgr-routing/RUN-GATE.md`

The gated presentation. Its first paragraph states that the file is documentation and that running any
command in it is out of scope for phase execution. Contents:

- **A bold HALT banner** naming the standing eval-run-approval-gate, stating that this gate is
  blocking-human and NEVER auto-approvable, that no `workflow.auto_advance` setting or `--auto` /
  `--chain` flag overrides it, and that no prior approval carries over.
- **TWO clearly separated, separately approvable rounds**, with the explicit statement that approving
  one does not approve the other, and that Round A's stage 2 needs its own approval separate from
  stage 1's.
- **Round A, the placement A/B.** Stage 1 screens the three arms over the nine cases at low k via the
  driver in recommend mode with the placement arm group and this suite; then the routing grader per
  captured run; then the blind judge on the UNRESOLVED runs only, ONE question, answered with a label
  only, on NORMALIZED answers; then the judge merge and its pre-aggregate verify gate; then the
  tabulator with the routing grade file. Stage 2 escalates k only on a signal and only on the
  discriminating subset.
- **Round B, the EVL-01 reciprocal trigger regression**, carried forward from the existing eval record
  with the model pin refreshed from `claude-opus-4-8` to `claude-opus-5` (the current default). It
  names the set the probes read (`evals/reciprocal-red.json`, the twelve RED positives re-tagged
  `should_trigger: false`) and the pre-edit baseline (lz-tpp 12 of 12 quiet, lz-refactor 12 of 12
  quiet, trigger rate zero each, 36 runs per sibling, measured 2026-07-21), so a regression is visible
  against a clean floor with no noise to argue about.
- **The honest data gap on Round B:** there is no reciprocal set in the other direction for the new
  two-hop clause, so it recommends adding at least two nothing-failing-yet queries to the trigger
  positives with their mirrored dual-writes -- and notes that `check-evals.mjs` ENFORCES those mirrors,
  so a one-sided edit is caught by the lint at zero spend rather than surviving to a metered round.
- **A PRE-RUN checklist:** the OWNER's plugin reload first (committed is not live; all three
  descriptions changed); a fresh variant build with the routing selfcheck GREEN, so the
  description-identity assertion holds at MEASUREMENT time and not only at generation time; and
  confirmed read-rate instrumentation.
- **The READ-RATE rule as a gate rather than a footnote,** with the measured zero-retrieval precedent
  stated (zero of six treatment runs opened a cited reference, verified with a passing positive
  control) and the concrete warning sign named.
- **The offline instrument proof section** -- the exact zero-spend commands from Task 1, labelled as
  NOT the metered run -- with `selfcheck-red.mjs` called out separately with its runtime, its
  background-not-timeout rule, and the stranded-worktree hazard.
- **A post-run path** requiring at least one from-scratch UNBIASED reviewer over the grader source, a
  sample of normalized answers, and the reported numbers BEFORE they are recorded as findings.

### `ROUTING-AB-RESULTS.md`

A phase-scoped SIBLING at the workspace root, deliberately not an append to the frozen 515-line eval
record (D-25). Verified: `git diff --stat` is EMPTY for BOTH
`.claude/skills/lz-red-workspace/EVAL-RESULTS.md` and
`.claude/skills/lz-red-workspace/e2e-red-gilded-rose/EVAL-RESULTS.md`.

Every figure is a blank placeholder, and that is asserted MECHANICALLY rather than promised. **The
exact check used:** `rg -n '[0-9]+\.[0-9]{2}' .claude/skills/lz-red-workspace/ROUTING-AB-RESULTS.md`
exits **1** -- no computed rate is present anywhere in the file. Positive control:
the same pattern against `.claude/skills/lz-red-workspace/EVAL-RESULTS.md` exits 0 with 55 matching
lines, so the 1 is a genuine no-match and not a broken pattern.

It carries:

- a status line -- the instrument is BUILT and the measurement is HALTED pending owner approval;
- **the D-24 success framing in its own section**, stated plainly: closing Phase 22 does not by itself
  unblock the held pull request; the owner-approved A/B run does. The phase completes with the
  classifier FIXED and the placement question BUILT-and-HALTED, and no variant shipped is the DESIGNED
  outcome rather than an incomplete phase. The tracked tree remains variant A, which is a legitimate
  variant and not a half-migrated state;
- blank per-arm Pass@k and Pass^k tables over the nine cases at k of one, three, five and total, one
  row per arm;
- a blank deterministic-versus-judge SPLIT table per arm, framed as a finding in its own right,
  because a variant that systematically hedges shows a higher judge share and that asymmetry should
  not hide inside a pass rate;
- a blank READ-RATE row per arm adjacent to the pass rate, with variant A's structural zero labelled
  as the in-corpus baseline that makes the other two interpretable;
- a blank normalization-fired count per arm, with the note that this A/B can be genuinely blinded
  where the prior one could not, because all three arms are skill-loaded and share the same register;
- **all four caveats, written in advance of the numbers:** the k=1 power bound stated in the same
  paragraph as the figures; the D-10 tiebreak caveat (fires only on a MEASURED tie, and a tie on
  routing correctness does NOT prove parity on coaching quality, because variant C moves the
  classify-first rationale behind a lazy read and classify-first is one of only two scenarios a prior
  behavior eval measured a real edge on -- 29 of 30 against 26 of 30 substance-only); the prior-probe
  base rate (five null probes, so a null is likely and legitimate); and the rule that any grader
  artifact applies SYMMETRICALLY to every arm;
- a reserved from-scratch UNBIASED reviewer slot;
- a reconcile-on-completion note NAMING the CLS-05 row, with the mechanism spelled out -- a status only
  ever written by the step that DEFERS it is never cleared by the step that RESOLVES it.

### Task 2 verification

| Check | Result |
| ----- | ------ |
| RUN-GATE.md required keywords (11) | all present: halt, approval, never, variant_a, variant_b, variant_c, read rate, unbiased, Pass@k, reload, stage 2 |
| ROUTING-AB-RESULTS.md required keywords (8) | all present: built, halted, pull request, Pass^k, unbiased, tiebreak, read rate, reconcile |
| ASCII-only, RUN-GATE.md | `LC_ALL=C rg -c -N '[^\x00-\x7F]'` exit 1 (zero non-ASCII bytes) |
| ASCII-only, ROUTING-AB-RESULTS.md | same, exit 1; positive control `[^\x00-\x39]` returns 170 lines (exit 0), so the negated class parses |
| no computed rate in the writeup | `rg '[0-9]+\.[0-9]{2}'` exit 1; positive control on EVAL-RESULTS.md returns 55 (exit 0) |
| email allowlist-inversion, both files | ZERO email-shaped tokens in either file (exit 1); positive control on `.claude-plugin/marketplace.json` finds the approved public contact (exit 0). The forbidden value was never written, not even as a needle |
| no append to either frozen EVAL-RESULTS.md | `git diff --stat` EMPTY for both |
| `node check-evals.mjs` | exit 0 -- **26 authored files** across 4 suite dirs, RISEN from 25 before this task, so the new RUN-GATE is genuinely inside the widened clause-8 sweep |
| metered commands run | **none** |

---

## Deviations from Plan

### Auto-fixed issues

None. No code was changed and no checker was touched.

### Findings raised rather than absorbed

**1. [Rule 3 boundary - escalated, not fixed] Round A's two ROLLUP steps cannot reach this suite**

- **Found during:** Task 2, while establishing the exact downstream commands RUN-GATE.md must present.
- **Issue, MEASURED not inferred.** Two of the four downstream steps the plan lists do not reach the
  routing suite:
  - `tabulate-mechanical-red.mjs --grade-file routing-grade.json` is a **silent no-op**. Reproduced
    from the repo root: it prints `no captured runs under any of 3 RED suite(s)` and exits **0**. Two
    independent causes, both in the main path -- `discoverSuiteDirs()` filters directory names on the
    `e2e-red-` prefix (this suite is deliberately `e2e-rgr-routing`, outside that namespace, per
    D-22), and `walkAllSuites()` walks `results/apply` only (this suite is recommend-only).
  - `merge-judge --verify` globs `eval-*/<config>/run-*` for a file named `grading.json`. This suite's
    captures are at `results/recommend/<arm>/<case-id>/run-N/` with a grade named
    `routing-grade.json`, so the pre-aggregate completeness gate checks nothing. `--merge` is
    unaffected -- it takes explicit paths and all its fail-closed refusals still bind.
- **Anticipated and only HALF closed.** `22-RESEARCH.md` L721-724 recorded that the tabulator
  "hard-wires `red-grade.json` AND the `results/apply/<arm>/<pid>/run-*/` walk" and that recommend
  mode writes elsewhere. 22-05 implemented the recommended `--grade-file` parameter correctly and it is
  selfchecked; that closes the FILENAME half. The DIRECTORY half was never closed, and the research's
  own sentence names both.
- **Disposition: RECORDED, not fixed.** Three reasons, the same shape as the 22-03 and 22-04
  escalations. Plan 22-07's `files_modified` is exactly the two documents, so editing two instrument
  files would put an unrelated hunk in front of the D-18/SC7 reviewer.
  `tabulate-mechanical-red.mjs` is on `22-VALIDATION.md`'s "assert unchanged after the new param"
  line, and changing its discovery and walk is a design choice rather than a one-argument addition.
  And neither fix can be END-TO-END verified without the metered run this phase exists to HALT on -- a
  change that cannot be proven at zero spend does not belong in the gate plan.
- **Where it is written down:** a KNOWN GAPS section in `RUN-GATE.md` (so the operator meets it at the
  gate, before spending, rather than mid-round after spending) and a full entry in
  `deferred-items.md` with the reproduction, the line numbers, and the suggested closure shape.
- **Why RUN-GATE.md still presents the command:** omitting it would hide the gap; presenting it as
  working would be false. It is presented WITH the measured no-op stated immediately beneath it.

### Interpretations recorded (not defects, but the reviewer should see them)

- **`selfcheck-red.mjs` was NOT re-run in this worktree, by instruction and with cause.** The
  orchestrator had already run it to completion in the main tree at this plan's exact base commit,
  exit 0. Re-running it here would have cost ~15 minutes against three borrowed external repos, and
  the 22-06 precedent is that a worktree force-removal killed it mid-run and stranded a grading
  worktree inside a borrowed repo. This is recorded as an orchestrator-verified PASS, not as a blocked
  or missing check, and this executor claims no credit for running it.
- **An interim SUMMARY commit was made before Task 2 began.** That is against the usual write-once
  SUMMARY flow. It was deliberate: a provider quota limit had already destroyed one executor on this
  plan before it produced anything durable, and the Task 1 battery record is the single expensive
  artifact here -- roughly an hour of checkers to reproduce. Committing it the moment it existed cost
  one extra commit and made the expensive part survivable.

## Known Stubs

None in the sense the term normally carries -- no hardcoded empty value flows to any consumer, and no
placeholder text stands in for logic.

`ROUTING-AB-RESULTS.md` is entirely composed of blank placeholders, and that is the REQUIREMENT rather
than a stub. D-14 forbids the metered run inside this phase, so there is nothing measured to put in
the tables; writing a number there would be fabrication. The blankness is asserted mechanically (the
no-two-decimal check above) precisely so it cannot silently acquire an unearned figure.

## Threat Flags

None new. No network surface, no auth path, no production code, no schema at a trust boundary. Two
tracked documents were added to a public repo and both were hygiene-scanned by allowlist-inversion
with a passing positive control.

This plan's own register is discharged as follows:

| Threat | Mitigation as built |
|--------|---------------------|
| T-22-SPEND7 | Zero metered spend. `RUN-GATE.md` is documentation and no task executed a command from it. TWO separately-approvable HALTs, both blocking-human and never auto-approvable, with the no-prior-approval and no-auto-advance statements explicit and stage 2 stated as not implied by stage 1 |
| T-22-SELFCERT3 | The SUMMARY states in its own words that a GREEN battery is a FLOOR and that the acceptance verdict belongs to the ORCHESTRATOR's unprimed review. No reviewer, judge or auditor was spawned by this executor -- it has no Agent tool. Two OPEN `deferred-items.md` entries are named as required inputs to those reviews, plus a third added here |
| T-22-VAC4 | Both widens proven by RISEN counts against recorded baselines (hygiene 197 to 199 wide and 190 to 192 no-verbatim with the scope-floor label PASSING; eval lint 14 files across 3 dirs to 26 across 4). No checker was weakened, skipped or gated |
| T-22-STALE | `ROUTING-AB-RESULTS.md` carries an explicit reconcile-on-completion note NAMING the CLS-05 row, with the decay mechanism spelled out rather than assumed |
| T-22-LIVE | The reload is a named precondition in RUN-GATE.md's pre-run checklist AND in the checkpoint presentation, and it is stated as the OWNER's action. The three changed description lengths are recorded so the staleness is concrete. Round B is presented as mandatory-as-a-check while its spend stays the owner's to approve |
| T-22-PREMATURE | No variant selected. No figure written. The blank-placeholder requirement is asserted mechanically with a passing positive control. The tracked tree stays variant A and the writeup says so |
| T-22-PII6 | Both new files ASCII-only at byte level; ZERO email-shaped tokens in either, by allowlist-inversion with a positive control confirming the scan works. The forbidden value was never written, not even as a needle. `check-evals.mjs` clause 8 now reaches this suite dir (26 files), so RUN-GATE.md is inside the standing sweep |

## Task 3 -- HALT reached

The blocking-human checkpoint was REACHED and the plan stops there. Nothing it gates was attempted.

- No metered command was executed. No `claude -p`, no trigger eval, no judge, no oracle-reviewer, no
  aggregate over real captures.
- No reviewer, judge or auditor was spawned. `gsd-executor` has no Agent tool; the D-18/SC7 acceptance
  review and the D-26 unprimed review are ORCHESTRATOR steps.
- No variant was selected and no figure was written into the writeup.
- The plugin reload was NOT run on the owner's behalf, and committed is not treated as live.

The checkpoint presentation returned to the orchestrator names both documents by path, presents the
Task 1 battery record, states plainly that closing this phase does not by itself unblock the held pull
request and that the tracked tree remains variant A, names the plugin reload as the owner's own
required action, names BOTH metered rounds separately with the statement that approving one does not
approve the other and that stage 2 needs its own approval, and discloses the pre-registered null
tiebreak's risk rather than presenting the tiebreak as free.

## Handoff to the orchestrator

1. **Nothing is shipped and no variant is selected.** That is D-24's stated outcome. Closing this
   phase does not unblock the held pull request; the owner-approved A/B run does.
2. **A GREEN battery is not acceptance.** The D-18/SC7 acceptance review (at least two reviewers, at
   least one from-scratch UNPRIMED) and the D-26 unprimed review are yours. Three OPEN
   `deferred-items.md` entries are named inputs: the `lz-refactor/SKILL.md` intro paragraph (22-03),
   the two skill-relative sentences in `beck-tdd-by-example.md` (22-04), and the two rollup gaps
   (22-07). The routing gate is structurally blind to the first two.
3. **Re-run the full battery post-merge in the main tree**, including `node selfcheck-red.mjs` to
   completion. Run that one in the BACKGROUND and do not force-remove a worktree while it is running.
4. **Rebuild the variant trees before any run.** They live under gitignored `out/` and do not survive
   a fresh checkout: `node variants/build-variants.mjs` then `node selfcheck-routing.mjs`, in that
   order.
5. **Close the two rollup gaps before Round A's rollup**, or record an explicit hand-verification step.
   They do not block the capture or the grading, only the numbers.
6. **Both metered rounds remain HALT-gated,** and neither is implied by phase closure.

## Self-Check: PASSED

| Claim | Verified |
| ----- | -------- |
| `.claude/skills/lz-red-workspace/e2e-rgr-routing/RUN-GATE.md` exists | FOUND |
| `.claude/skills/lz-red-workspace/ROUTING-AB-RESULTS.md` exists | FOUND |
| `.planning/.../22-07-SUMMARY.md` exists | FOUND (this file) |
| `deferred-items.md` carries the 22-07 entry | FOUND |
| Commit `5d406f6` exists | FOUND in `git log` |
| Commit `774b5ca` exists | FOUND in `git log` |
| No commit deleted a tracked file | `git diff --diff-filter=D` empty |
| No `STATE.md` / `ROADMAP.md` modification | `git status --porcelain` on both empty |
| No `plugins/lz-tdd` modification | `git status --porcelain` empty |
| No append to either frozen `EVAL-RESULTS.md` | `git diff --stat` empty for both |
| Frozen Phase-20/21 instruments byte-unchanged | `git diff --stat` empty for all five |
| Metered spend | **none** |
| Reviewers spawned by the executor | **none** |
