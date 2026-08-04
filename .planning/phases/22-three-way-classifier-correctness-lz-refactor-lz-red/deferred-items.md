# Phase 22 -- deferred items (out-of-scope discoveries)

## From plan 22-02

### selfcheck-red.mjs crux 7 `canary-rdxf-red` cannot run in a fresh worktree -- RESOLVED, NOT DEFERRED

**RESOLUTION (orchestrator, post-merge, 2026-08-03).** There is nothing to defer. `node
selfcheck-red.mjs` exits **0** in the main working tree at merge commit `1d4673f`, with every crux
passing including crux 7 and crux 9. The entry is retained as history because the observation was
real in the worktree, but the item is CLOSED and needs no `npm install` and no follow-up.

Two corrections to the diagnosis below, both material:

- Evidence point 3 is **FALSE as written**. The main repo working copy DOES have
  `.claude/skills/lz-red-workspace/node_modules/angular-typechecker` present. Measured directly.
- The actual mechanism is narrower than "absent in every fresh checkout": a git worktree does not
  carry gitignored files, so the dependency was missing in the WORKTREE only. That is why the
  failure did not reproduce after merge.

The conclusion the executor drew -- that the failure was not caused by its edits -- was correct, and
it rests on independent evidence (points 1, 2 and 4 all hold). Only the stated reasoning in point 3
was wrong. Recording this because a spurious deferred item costs a future reader a real
investigation, and because "it fails in my worktree" must never be generalized to the repo without
measuring the repo.

**Found during:** plan 22-02 Task 2 verification (running `node selfcheck-red.mjs` as a
no-regression check after widening `check-evals.mjs` clause 8).

**Observed:** the script exits 1 at
`[crux 7:canary-rdxf-red] gradeRun threw instead of producing a verdict: grade-red: cannot resolve
the angular-typechecker package, so the atc differential cannot run (fail closed): Cannot find
module 'angular-typechecker/package.json'`.

**Diagnosis -- PRE-EXISTING environment condition, NOT caused by plan 22-02.** Four independent
pieces of evidence:

1. `selfcheck-red.mjs` is BYTE-UNCHANGED since the fork base (`git diff --stat` empty), as D-22
   requires. Same for `tools/check-red-references.mjs`.
2. `selfcheck-red.mjs` contains no reference to `check-evals` at all, so the file this plan widened
   is not on its code path (`git grep -F check-evals` returns nothing).
3. `angular-typechecker` is a TRACKED, pinned dependency of the workspace
   (`.claude/skills/lz-red-workspace/package.json:11` -> `"angular-typechecker": "0.2.4"`), and
   `node_modules/` is gitignored, so it is absent in a freshly created git worktree.
   (CORRECTED -- see the RESOLUTION block above. The original wording claimed it was also absent
   from the main repo working copy. It is not: the main copy has it, which is exactly why the whole
   run goes GREEN after merge.)
4. The tool's own error text documents this exact case: "This workspace's node_modules is gitignored
   while its package.json and package-lock.json are tracked, so a fresh worktree needs `npm install`
   in ...lz-red-workspace before the atc checker path works." The condition was anticipated by the
   author; it is the expected fresh-worktree state, not a defect.

Every crux that does not depend on that package PASSED in the same run: cruxes 1+2 (composition and
byte-identical prompt parity across 3 RED suites / 6 prompts x 2 modes, plus the D-12 arm proof and
the 13-token state-claim ban), 3, 4, 5, 10, and the crux-7 canaries for GRC / SRVC / RXF.

**Deliberately NOT fixed here.** Two reasons:

- Out of scope. Plan 22-02 touches `check-hygiene.mjs`, `check-evals.mjs`, `.gitignore` and
  `REQUIREMENTS.md`. The failing canary is `grade-red.mjs`'s Angular differential path, which none
  of those four files reach.
- Running a package-manager install is excluded from the executor's auto-fix rules. It would also
  create a large untracked `node_modules/` tree in a worktree the orchestrator force-removes on
  return, so the effect would not survive the merge anyway.

**To resolve:** nothing to do. Superseded by the RESOLUTION block at the top of this entry -- the
main working tree already has the dependency and the full run exits 0 post-merge. No `npm install`
is required. Anyone hitting this again inside a throwaway worktree can either ignore it or run
`npm install` in `.claude/skills/lz-red-workspace` (lockfile tracked and pinned, so it restores a
committed dependency set rather than resolving anything new).

**Effect on plan 22-02 acceptance:** clean. The D-22 obligation that actually matters --
`selfcheck-red.mjs` stays byte-unchanged -- is satisfied and independently proven against the fork
base. The plan's softer "`node selfcheck-red.mjs` exits 0" line is ALSO satisfied, measured in the
main tree post-merge. The executor was right to refuse to claim a pass it had not observed; the
orchestrator then observed it.

## From plan 22-03

### lz-refactor/SKILL.md intro paragraph contradicts the classifier beneath it -- OPEN, REQUIRED INPUT TO THE D-18/SC7 REVIEW

**Status:** OPEN. Not fixed in Phase 22 execution. This entry exists so the item reaches the
D-18/SC7 acceptance review as a NAMED input rather than depending on a reviewer happening to read
five particular lines.

**Where:** `plugins/lz-tdd/skills/lz-refactor/SKILL.md`, the intro paragraph directly under the H1
(around lines 23-27), ABOVE the first `## ` heading.

**Why the gate cannot see it.** `ROUTING_SURFACES` anchors every parsed surface to a `## ` heading;
the first one in this file is `## Two modes`. The intro paragraph sits above it, so it is outside
all eleven parsed surfaces. `check-rgr-routing.mjs` is GREEN on this file's routing and will stay
GREEN with this defect present. This is precisely the coverage boundary `22-VALIDATION.md` states:
the deterministic layer proves the AUTHORED classifier is exhaustive, disjoint and single-axis --
it does not prove the surrounding prose agrees with it.

**The two defects, both now weaker than the classifier below them:**

1. "with the tests green, it recommends the next NAMED refactoring ..." -- TEST-STATE framing, the
   exact axis D-03 removes from every routing branch. `## Two modes` and coach step 5 (which has an
   untested-code branch) now contradict it.
2. "Behavior changes belong to the green step and its sibling skill lz-tpp" -- omits the two-hop.
   Corpus case `c4` routes `lz-red` THEN `lz-tpp`, and this sentence names only the second hop.

**Why it was raised rather than absorbed.** Plan 22-03's `files_modified` covers the three
`SKILL.md` files, so the file is in scope, but this paragraph is not one of the plan's authoring
sites and not a parsed surface. The executor declined to widen its own diff and escalated instead.
The orchestrator declined to expand a plan's scope mid-wave. Both are the correct default; neither
closes the item.

**Why it still matters:** ROADMAP **SC5** requires "Body and description agree, per skill". A
shipped, public skill whose opening paragraph contradicts its own classifier is exactly what SC5
exists to catch, and no mechanical check in this phase can catch it.

**To resolve:** the D-18/SC7 fresh acceptance review (>= 1 from-scratch UNPRIMED reviewer over every
edited shipped file) should rule on it. If confirmed, close via `/gsd-plan-phase 22 --gaps` -> gap
plan -> `/gsd-execute-phase 22 --gaps-only`. Do NOT let a GREEN `check-rgr-routing.mjs` be read as
evidence that this paragraph is fine -- the gate is structurally blind to it.

## From plan 22-04

### Two skill-relative sentences survive OUTSIDE beck-tdd-by-example.md's two repaired regions -- OPEN, REQUIRED INPUT TO THE D-26 REVIEW

**Status:** OPEN. Not fixed in plan 22-04. Recorded so the ORCHESTRATOR has the item in hand when it
reads the D-26 unprimed reviewer's report, because that reviewer is asked precisely "is any sentence
skill-relative in a plugin-wide file" and will very likely surface these two. They are NOT regressions
introduced by 22-04 and they are NOT defects the executor left in its own diff.

**Where:** `plugins/lz-tdd/references/beck-tdd-by-example.md`

1. **Line 49, `## The two rules`:** "The second rule is where **this skill** lives: removing that
   duplication is a refactoring, done under a green bar." Read from `lz-red` or `lz-tpp`, this says
   the refactor step is theirs -- the identical defect class D-20b names for the seam section, in a
   different section of the same plugin-wide file.
2. **Line 55, `## Green-bar strategies`:** "...**the coach** mentions them only to locate the seam."
   `the coach` is unqualified in a file loaded from three skills, each of which has its own coach.

**Why 22-04 did not fix them.** The plan's action step for Task 2 scopes the repair to EXACTLY two
regions and names these sections in its byte-unchanged list: "Everything else -- the no-oracle banner,
the red-green-refactor-cycle section with its per-claim Owned Fowler tier, **the two rules**, **the
green-bar strategies**, and every `## Sources` row -- stays byte-unchanged." Widening the diff would
have contradicted an explicit instruction and put an unrelated hunk in front of the D-26 reviewer.
Same disposition, and same reasoning, as the 22-03 item above.

**Why the gate cannot see them.** `beck-seam` is anchored to the `## The seam across the three steps`
heading, so `sectionBody` stops at the next `## `. Both sentences sit in earlier sections and are
outside every one of the eleven parsed surfaces. `check-rgr-routing.mjs` is GREEN with them present.

**To resolve:** the orchestrator should decide after the D-26 unprimed review reports. Both are
one-sentence prose edits with no book-backed claim attached (neither carries a Sources row, a
provenance tier, or a Beck/Fowler attribution), so if the reviewer confirms them they are cheap to
close -- either folded into a 22-07 follow-up or via `/gsd-plan-phase 22 --gaps`. Do NOT treat the
GREEN routing gate as evidence they are fine.

## From plan 22-07

### Round A's ROLLUP steps cannot reach the routing suite -- OPEN, BLOCKS THE A/B WRITEUP, NOT THE CAPTURE

**Status:** OPEN. Not fixed in Phase 22 execution. Both halves are MEASURED, not inferred. Neither
blocks the metered CAPTURE or the per-run GRADING; both block the ROLLUP that turns captured grades
into the numbers `ROUTING-AB-RESULTS.md` is scaffolded to hold. Recorded here, and stated in full in
`e2e-rgr-routing/RUN-GATE.md` under KNOWN GAPS, so the operator meets them before spending rather
than after.

**Gap 1 -- `tabulate-mechanical-red.mjs` is a SILENT NO-OP for this suite.**

Reproduced from the repo root at base `f8643eb`:

```
node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --grade-file routing-grade.json
-> no captured runs under any of 3 RED suite(s) -- nothing to tabulate (run the gated suites first):
     ...e2e-red-gilded-rose\results\apply
     ...e2e-red-radix-ng\results\apply
     ...e2e-red-srvx\results\apply
```

Two independent causes, both in the main path:

1. `discoverSuiteDirs()` (L339-353) filters directory names on the `e2e-red-` prefix. This suite is
   deliberately named `e2e-rgr-routing`, OUTSIDE that namespace, per D-22 -- `selfcheck-red.mjs`
   auto-discovers `e2e-red-*` siblings and its crux 2 bans thirteen state-claim tokens in prompts,
   while this corpus MUST carry test-state facts by design. **The suite name is correct and must not
   be changed to work around this**; changing it would re-import the token ban onto a corpus that
   violates it by construction and would perturb `selfcheck-red.mjs`, which D-22 requires to stay
   byte-unchanged.
2. `walkAllSuites()` (L369) walks `results/apply` only. This suite is recommend-only and writes to
   `results/recommend`.

It exits **0** with an informational message, so it looks healthy while producing nothing.

**This was anticipated and only HALF closed.** `22-RESEARCH.md` L721-724 recorded that the tabulator
"hard-wires `red-grade.json` AND the `results/apply/<arm>/<pid>/run-*/` walk" and that recommend mode
writes elsewhere, then recommended the `--grade-file` parameter. 22-05 implemented that parameter
correctly and it is selfchecked -- it closes the FILENAME half. The DIRECTORY half (discovery prefix
plus the apply-only walk) was never closed, and the research's own sentence names both.

**Gap 2 -- `merge-judge --verify` does not reach these run dirs either.**

`--verify <iterationDir>` mirrors the skill-creator aggregate's glob `eval-*/<config>/run-*`
(L161-189) and looks for a file literally named `grading.json` (L228). This suite's captures live at
`results/recommend/<arm>/<case-id>/run-N/` and their final grade is `routing-grade.json`. So the gate
reports "no `eval-*/<config>/run-* dirs`" instead of checking anything.

`--merge` is UNAFFECTED: it takes explicit `--preliminary` / `--verdicts` / `--out` paths, is
filename-agnostic, and every one of its fail-closed refusals still binds.

**Consequence:** the pre-aggregate completeness gate is not automated for this suite. That gate exists
to stop an unmerged run from silently dropping out of the denominator -- a scored-only false pass. Until
it is closed, completeness must be confirmed by hand before any rollup is believed.

**Why 22-07 did not fix either.** Three reasons, all the same shape as the 22-03 and 22-04 items above:

- Plan 22-07's `files_modified` is exactly the two new documents. Editing two instrument files would
  have put an unrelated hunk in front of the D-18/SC7 reviewer.
- `tabulate-mechanical-red.mjs` is on `22-VALIDATION.md`'s "assert unchanged after the new param" line.
  Changing its discovery and walk is not a one-argument addition; it is a design choice.
- Neither fix can be END-TO-END verified without a metered run, which is exactly what this phase HALTS
  on. A change that cannot be proven at zero spend does not belong in the gate plan.

**To resolve:** a gap-closure step, before Round A's rollup rather than before its capture. The obvious
shape is a `--suite` and a `--mode` argument on the tabulator -- `discoverSuiteDirs` and `walkAllSuites`
are ALREADY exported, so the reuse path exists -- plus either a `--grade-file`-equivalent and a
directory-shape argument on `merge-judge --verify`, or an explicit hand-verification step recorded in
the writeup. Either way the fix needs its own selfcheck: a rollup that silently tabulates zero runs is
the same vacuity class this repo's instruments exist to refuse.

## From plan 22-08

### Q-3: the router is restated in five places with no single normative source -- OPEN, NOT A DEFECT TODAY

**Status:** OPEN, and deliberately not closed by plan 22-08. Recorded so it survives this phase as a
named design question rather than as an unwritten worry.

**The question** (22-ACCEPTANCE-REVIEW `### Q-3`, raised by two independent reviewers). The
red-vs-green-vs-refactor router is restated in FIVE places: the step-1 branch list in each of the
three `SKILL.md` files, the `Classify first:` paragraph in
`lz-red/references/three-laws-and-test-selection.md`, and the `## The seam across the three steps`
section in `references/beck-tdd-by-example.md`. Each restates the whole table; none defers to
another as normative. The untested-target carve-out in branch (d) has ALREADY begun to drift on
exactly that seam -- it is present in all three `SKILL.md` copies and absent from both reference
copies.

**Why it is not a defect today.** The outcome for corpus case c7 is unaffected: every copy routes it
to the same owner, so `check-rgr-routing.mjs` is GREEN on the substance and not merely blind to it.
The drift is a maintenance hazard, not a mis-route.

**Why it is not closed here.** The designed answer already exists and is unrun. Variant C of the
D-08 placement A/B replaces the three per-skill narrative sections with one shared routing table and
rewrites step 1's pointer to link out to it -- that IS the single normative source Q-3 asks for.
Choosing it by hand now would pre-empt the measurement the A/B exists to make. The A/B remains
HALT-gated on fresh explicit owner approval at run time per D-14, and no placement variant is
selected by this plan (D-24).

**This plan added a sixth instance of the same duplication, knowingly.** Task 4's two design-ruling
sentences are written into all four classify lead-ins in identical wording. That is another copy of
shared routing prose, accepted deliberately: the alternative -- putting the rulings in one normative
place the other surfaces defer to -- is precisely the design choice the unrun A/B is meant to
decide, and reference-file retrieval has a MEASURED zero-of-six rate on this repo, so a
single-source-of-truth placement would move a load-bearing rule to a tier that may never be read
(D-10). Identical wording in all four copies is the cheapest available guard against the drift Q-3
names, and it is why Task 4 mandated one wording rather than four paraphrases.

**To resolve:** run the D-08 placement A/B once the owner approves the metered round, then adopt or
reject variant C on the measurement. If the A/B is abandoned, Q-3 returns as an open design decision
to be made on judgment instead.
