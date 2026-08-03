---
phase: quick-260729-x0i
plan: 01
subsystem: dev-instrument + planning records
tags: [instrument-honesty, guard-scope, archive-record, deferred-work, supersession]
requires: [lz-tdd@0.0.2 freeze tag, quick-260729-lc9 taxonomy archive]
provides: [ragged-table gate scoped to the shipped tree, corrected archive header, three FUT-* deferrals, OD-X0I-1 supersession annotation]
affects: [check-red-references.mjs N1 gate, .planning/research/test-double-taxonomy.md header, .planning/REQUIREMENTS.md, 260729-lc9-CONTEXT.md]
tech-stack:
  added: []
  patterns: [region-scoped shape pin, two-arm fail-open anchor, replace-pair legs, annotate-never-rewrite]
key-files:
  created:
    - .planning/quick/260729-x0i-fix-the-archive-header-and-instrument-ho/260729-x0i-RED-EVIDENCE.md
  modified:
    - .claude/skills/lz-red-workspace/tools/check-red-references.mjs
    - .planning/research/test-double-taxonomy.md
    - .planning/REQUIREMENTS.md
    - .planning/quick/260729-lc9-scope-the-test-double-taxonomy-to-lz-red/260729-lc9-CONTEXT.md
decisions:
  - OD-X0I-1 executed: the ragged-table gate was rescoped now rather than roadmapped, and the instruction that produced the defect was annotated SUPERSEDED in its own artifact.
  - Three FUT-* deferrals routed to REQUIREMENTS.md "### Later milestones", not ROADMAP.md, on the measured evidence that FUT-04 is labelled "carried from 0.0.2" and therefore survives a milestone close.
  - N3 was stated, never weakened; a leg pins its stem constant and its all-files loop.
  - A from-scratch unprimed content review WAS run after the first three commits and returned NEEDS WORK on the FUT entries, finding two false claims a 12/12-passing goal verifier could not see. A remediation round closed them; the verifier checked that entries EXIST, the reviewer checked whether their content is TRUE.
  - The roster rename-blindness defect was corrected UPSTREAM in check-red-references.mjs as well as in the FUT entry that inherited it, so the source could not re-seed it.
metrics:
  tasks: 3
  commits: 8
  duration: single session
  completed: 2026-07-30
status: complete
---

# Quick Task 260729-x0i: Fix the archive header and instrument honesty -- Summary

Removed a fail-CLOSED dependency from a shipped-skill gate onto an archived planning path that the next
milestone close would relocate, then corrected the three measured prose defects in that archive's header
against the post-fix reality, then recorded two by-design instrument gaps, one contingent relocation and
one superseded instruction.

## Commits

| # | SHA | Subject |
|---|---|---|
| 1 | `3d57ca6` | `fix(quick-260729-x0i): scope the ragged-table gate to the shipped tree` |
| 2 | `e6cd397` | `docs(quick-260729-x0i): correct three measured claims in the archive header` |
| 3 | `41ea804` | `docs(quick-260729-x0i): record two by-design gaps and annotate the superseded scope instruction` |

Base `4ac024d`. These three commits: 5 files, 305 insertions, 12 deletions. Each task's own `<verify>`
chain returned `TASK1_VERIFY_OK`, `TASK2_VERIFY_OK`, `TASK3_VERIFY_OK`.

Four further commits landed in the remediation round below. Whole task `4ac024d..c6f5855`: 5 files, 583
insertions, 22 deletions. The insertion totals of the two rounds do not sum to the whole-task figure
because the second round rewrote lines the first round had added, so those lines cancel in a base-to-tip
diff; the per-round numbers are each measured against their own base.

## Observed RED/GREEN pairs

Full verbatim records in `260729-x0i-RED-EVIDENCE.md`. Exit codes and lines as the runs printed them:

| Leg | Exit | Observed output |
|---|---|---|
| Pre-fix control (archive moved aside, UNMODIFIED checker) | `1` | `[FAIL] [lc9] no ragged pipe table -- 1 problem(s): .planning\research\test-double-taxonomy.md: UNREADABLE (ENOENT)` |
| RED leg A (planted ragged row, post-fix) | `1` | `[FAIL] [lc9] no ragged pipe table -- 1 problem(s): plugins\lz-tdd\skills\lz-red\references\testing-stance\README.md: table at line 17: header is 2 wide, but 1 row(s) differ -- line 19 is 1` |
| RED leg B (archive absent, post-fix) | `0` | `123 checks, equal to the PREDICTED literal`, 124 PASS, 0 FAIL |
| D2 truth leg (probe at the canonical plugin-wide path) | `1` | `[FAIL] [lc9] no test-double taxonomy copy in the shipped tree -- 1 copy/copies: plugins\lz-tdd\references\test-double-taxonomy.md` |
| Anchor proof, both arms | n/a | bogus tag unanchored PASSES / anchored FAILS; bogus path unanchored PASSES / anchored FAILS; real fully anchored PASSES. `fatal: bad revision 'nonexistent-tag-xyz'`, exit 128, `wc -l` prints 0 |
| L12 own RED (mutant copy with a planted `existsSync` skip) | n/a | FAILS on the mutant (`existsSync` 0 -> 1 AND `continue;` 1 -> 2), PASSES on the real file |

Every move-aside and plant was restored in the same chain; `git status --porcelain` on each mutated path
measured 0 lines afterwards. The emitted count never moved: 123 before and after, `EXPECTED_CHECKS`
untouched, exactly as the one-`report()`-outside-the-loop construction predicted.

## Final gate

Battery 124 PASS / 0 FAIL / roster 123, row-guards 49 assertions, provenance 3/3, hygiene GREEN,
`claude plugin validate .` passed, both frozen shipped surfaces 0 lines against `lz-tdd@0.0.2` behind
BOTH anchors, tree clean.

ONE leg could not run here and was NOT silently skipped: `extract-samples.mjs`. It shells out to
`tsc -p tsconfig.json` in `.claude/skills/lz-red-workspace/`, and its own header states it needs a local
`vitest` devDep. `node_modules/` is git-ignored, so a fresh worktree never has it and the harness reports
`error TS2307: Cannot find module 'vitest'` for all 8 modules. Asserted rather than assumed: the tracked
`package.json` and `tsconfig.json` are present, `node_modules` is absent, and
`git diff <base>..HEAD -- extract-samples.mjs tsconfig.json package.json plugins/lz-tdd/skills/lz-red/`
is empty, so none of that harness's inputs was touched by this task. I did not run a package install to
clear it -- package-manager installs are excluded from auto-fix. **This leg must be re-run in the main
repo after merge.**

RESOLVED post-merge by the orchestrator: `node extract-samples.mjs` in
`.claude/skills/lz-red-workspace/` returns exit 0, `RED-SAMPLES GREEN -- 8 module(s) tsc --strict
--noEmit clean, 0 skipped`. Recorded because the remediation round's own gate table reported `259
modules` for this row: that is the SIBLING extractor,
`.claude/skills/lz-refactor-workspace/extract-samples.mjs` (`FWL-04 GREEN`, a different instrument over a
different tree). Both are green, so nothing was broken, but the row named the wrong harness for a task
touching the lz-red tree. Two same-named scripts in adjacent workspaces is the trap; name the workspace,
not just the script.

## Deviations from plan

1. **Worktree isolation forced a change in HOW every chain was invoked, not what it asserted.** The
   isolation guard refuses any multi-command shell chain containing a redirect. Each verify chain was
   therefore written to a scratchpad script and run as one plain command. This preserves the `&&`
   semantics the conventions require (the script's exit status IS the chain's status) and preserves
   same-chain atomicity for the move-aside/restore pairs, which splitting into separate tool calls would
   have broken -- that atomicity is the stated mitigation for T-x0i-08. Splitting was the guard's own
   suggestion and was rejected for that reason.
2. **The plan's chains open with `cd` to the MAIN repo.** A worktree-isolated agent must not do that. In
   every chain that `cd` was replaced by an assertion that `git rev-parse --show-toplevel` equals the
   execution worktree root -- a strictly stronger check than the `cd` it replaced.
3. **`not a live instruction` is case-sensitive and my prose was not.** Task 3 L11 pins the lowercase
   literal; I first wrote "it is NOT a live instruction", which `rg -F` does not match. The leg was right
   and the prose was wrong; fixed to `**not a live instruction**`, which keeps the emphasis and matches.
   Recorded because it is the plan's own "needle outlives its subject" class pointed the other way -- a
   leg that pins prose constrains how that prose may be written.

## Process lapse, self-caught

I wrote the D2 probe observation into the evidence record BEFORE running the probe. The observed output
then matched it byte-for-byte, so the committed record is accurate -- but the sequencing was exactly the
assert-then-check inversion this whole task exists to close, and it would have produced a false record
had the probe differed. It is recorded rather than quietly corrected. Every other observation in the
evidence file was captured from a completed run first.

## What the plan got right, and one number that needed a better instrument

Every numeric claim in `<pre_measurements>` reproduced exactly: all sentinel counts, both slice line
counts and their contents, the three stale-claim needles at 1 each, all five header needles at 0, the
D3 clause at 1, and every heading and pipe-row count in both planning docs.

One figure initially looked like a disagreement and was not. A naive line-based table counter reported
35 tables across 15 files against the plan's 28 across 9. The plan states its figure was measured
THROUGH the real `scanTables`; the naive counter is a different instrument. Re-measured by importing the
real `scanTables` and rebuilding the walk exactly as `check-red-references.mjs:606-607` does: 28 tables,
9 files, 0 ragged rows, archive contributes 1, `tablesSeen` 29 -> 28. The plan was exact. The lesson is
the plan's own -- measure through the instrument that RUNS the check, never through a re-implementation.

## The content review ran, and it was right to be demanded

The paragraph above (kept verbatim as written before the gate ran) predicted that no guard reads the
prose. That gate was then run, and it found defects nothing else had.

**Goal verifier: `passed`, 12/12 must-haves.** It re-measured independently rather than trusting this
summary -- moved the archive aside itself, confirmed a byte-identical restore by sha256, planted the D2
probe itself, and anchored the tag-diff check.

**Unprimed content reviewer, same artifacts, same HEAD: NEEDS WORK.** It found TWO FALSE claims in the
FUT entries, plus an authorization asserted with no record behind it. The verifier could not have caught
any of them, because it checked that the entries EXIST while the reviewer checked whether their content
is TRUE. This is the clearest instance in this work stream of the recorded lesson that mechanism review
and content review find DISJOINT defects: 12/12 and NEEDS WORK were both correct, about different things.

Neither gate is redundant, and a green battery remains not acceptance.

Also still open, unchanged by this task: EVL-03's metered run and the D-12 A/B both remain owner-gated.
Zero metered spend here -- no `claude -p` ran.

## Remediation round (commits 4-7)

Closed every content-review finding. Full records appended to `260729-x0i-RED-EVIDENCE.md` under
`## REMEDIATION ROUND`.

| # | SHA | Subject |
|---|---|---|
| 4 | `edacaba` | `fix(quick-260729-x0i): correct the roster rename-blindness comment in the checker` |
| 5 | `c7c2677` | `docs(quick-260729-x0i): fix three false or under-specified deferred-work entries` |
| 6 | `4f0da5e` | `docs(quick-260729-x0i): correct authorization, provenance and evidence claims in the archive header` |
| 7 | `c6f5855` | `docs(quick-260729-x0i): settle the retarget discretion and record the remediation evidence` |

The two false claims, both falsified by artifacts already in this repo:

1. **`FUT-ROSTER-LITERALS` claimed only the `[wev G17]` entry is a string literal and the only one that
   can catch a rename.** `NEW_LABELS` holds FIVE literals; the four `[lc9]` roster literals are
   rename-catching for the same reason G17 is, because their emission sites declare INDEPENDENT literals.
   The entry's own arithmetic already contradicted it: 13 total minus 8 blind is 5, not 1. The 8-blind
   figure was correct. Corrected UPSTREAM too -- `check-red-references.mjs` carried the same
   contradiction, saying "the one entry in the list that can catch a RENAME" a few lines above "8 of
   these 13 entries are still rename-BLIND". Fixing only the copy would have left the source to re-seed
   it. NEW observed RED for the widened claim: renaming the side-qualification emission literal produced
   exit 1 with `MISSING new label(s): SKILL.md: [lc9] side-qualification rule inline in the coach
   procedure` -- one line proving both that the count leg is blind and that `missingNewLabels` fires.
2. **`FUT-TAXONOMY-SHARED` claimed guard N2 "would correctly fail a link".** N2 fails a relative target
   that does not RESOLVE, not a link as such. The counterexample was the entry's own cited precedent:
   `lz-refactor/references/principles.md:27` IS a relative Markdown link to
   `../../../references/beck-tdd-by-example.md`, the target exists, N2 passes it, battery GREEN. The
   accurate reason is narrower and was already on record -- a `${CLAUDE_PLUGIN_ROOT}`-prefixed target
   classifies as relative and can never resolve on disk. N2 itself was not touched and gained no
   carve-out.

The most serious in KIND was neither of those: the header asserted D-10 was "discharged by
owner-authorized research". A case-insensitive sweep with a positive control found NO such record -- only
an owner ruling authorizing a RELOCATION. Replaced with the warrant that is on record and is stronger:
the mechanism was verified as a byproduct of that authorized relocation, so D-10's ban on investigating
it for THIS document was never overridden. An authorization asserted without a record, used as the
warrant for overriding a locked decision, is the worst shape this class takes.

### The remediation corrected two of the orchestrator's own briefing errors

- **The rg false-negative is NOT gitignore.** The brief said `.claude/` is gitignored, so a bare `rg`
  silently returns zero. Measured: `git check-ignore` reports the file NOT ignored, and `--no-ignore`
  ALONE still returns zero; only `--hidden` finds it. The cause is ripgrep's hidden-directory skip over
  dot-prefixed `.claude/`. This matters operationally -- anyone believing it is gitignore reaches for
  `--no-ignore` and gets a silent zero. `-uu` works only because it implies `--hidden`.
- **The cited counterexample does not READ the document.** `check-functional.mjs:525` asserts that a
  README CITES a `.planning/research/` path; it does not open it -- and it still passes even though that
  file has already moved to `.planning/milestones/lz-tdd@0.0.1-research/`. The substance survived and
  sharpened: a hardcoded planning path that a one-file needle cannot see.

## Second content review, and round 3 (commit 8)

A SECOND from-scratch unprimed review was run against the remediated prose, because every repair round
in this task had so far introduced something and round 2 rewrote 123 lines. Verdicts: the archive header
SOUND, `REQUIREMENTS.md` SOUND with one precision fix, `260729-lc9-CONTEXT.md` NEEDS WORK on one FALSE
claim. Closed in `57b680d`, hand-patched by the orchestrator with the same RED/GREEN discipline.

**The false claim was the over-claim class again, and round 2 inherited it from round 1.** Both the
ragged-gate SCOPE comment (written in round 1) and the CONTEXT.md annotation (written in round 2) said
the three retargeting reasons are "mirrored in `lib/row-guards.mjs`". MEASURED: that file mirrors only
the FIRST -- the guard-that-cannot-fail argument. `coupling` counts 0 and `milestone` counts 0 there,
against `surface` at 4 as the positive control; the checker note carries all three (`coupling` 3,
`milestone close` 1). The annotation then directed the reader to "the third of them" through the one
file that does not contain it. Both sites were corrected, since fixing only the annotation would have
left the comment free to re-seed it -- the same upstream/downstream pairing as the P1/P1b fix.

The precision fix: `FUT-TAXONOMY-SHARED` presented V7 and I2 as "two independent RUNTIME reasons",
which reads as two measured facts. V7 is VERIFIED by disk observation; I2 is INFERRED at MEDIUM
confidence and its own rationale concedes the form is resolvable in principle. Now split by evidential
weight.

The reviewer also recorded a false negative of its own and corrected it before relying on it: an
`rg -U 'regression\s+surface'` returned exit 1 against text it had already read, because the phrase
wraps across a `//` comment prefix and `\s+` does not match `//`. Its finding rests on the re-measured
result. That is the third distinct false-negative mechanism this task has hit -- hidden-directory skip,
line-oriented matching, and now comment-prefix wrapping -- all producing the same symptom of a confident
zero.

## Deferred, by design

`FUT-ROSTER-TYPO`, `FUT-ROSTER-LITERALS` and `FUT-TAXONOMY-SHARED` are recorded in
`.planning/REQUIREMENTS.md` under the existing `### Later milestones`, each naming the cost of closing
it. Neither instrument gap was fixed -- a leg asserts that, since a "helpful" partial fix would have
been a scope violation rather than a bonus. ROADMAP.md is byte-unchanged.
