---
phase: quick-260728-wev
plan: 01
subsystem: lz-tdd plugin -- cross-author test-double taxonomy, its dependents, and the lz-red reference checker
tags: [taxonomy, provenance, checker-falsifiability, public-repo-hygiene, tier-discipline]
requires:
  - the j9m taxonomy as shipped in merge c7a452d
  - the lz-red-workspace reference checker and its shared scaffold-phrase list
provides:
  - a three-axis cross-author taxonomy with no invented term and no emptiness assertion
  - seventeen falsifiability-proven checker guards, each demonstrated FAIL-at-baseline
  - a machine-enforced never-bare rule outside the taxonomy
  - the kanban-cycle provenance surface named, per-claim tiered, and qualified as non-uniform
affects:
  - plugins/lz-tdd/skills/lz-red
  - plugins/lz-tdd/skills/lz-refactor
  - plugins/lz-tdd/skills/lz-tpp
  - .claude/skills/lz-red-workspace/tools
tech-stack:
  added: []
  patterns:
    - instrument-first: fix the gate, prove every guard fails, only then edit content
    - authored-once-then-file-copied so byte-identity is structural rather than hoped for
    - allowlist-inversion for public-repo email hygiene, diffed against a pre-work BASE
key-files:
  created:
    - .planning/quick/260728-wev-revise-test-double-taxonomy-drop-coined-/260728-wev-RED-BASELINE.md
  modified:
    - .claude/skills/lz-red-workspace/tools/check-red-references.mjs
    - plugins/lz-tdd/skills/lz-red/references/test-double-taxonomy.md
    - plugins/lz-tdd/skills/lz-refactor/references/test-double-taxonomy.md
    - plugins/lz-tdd/skills/lz-tpp/references/test-double-taxonomy.md
    - plugins/lz-tdd/skills/lz-red/SKILL.md
    - plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
    - plugins/lz-tdd/skills/lz-red/references/principle-backing.md
    - plugins/lz-tdd/skills/lz-red/references/anti-patterns.md
    - plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md
    - plugins/lz-tdd/skills/lz-refactor/references/beck-tdd-by-example.md
    - plugins/lz-tdd/skills/lz-refactor/SKILL.md
    - plugins/lz-tdd/skills/lz-tpp/SKILL.md
    - .planning/HANDOFF.json
decisions:
  - The coinage is dropped, not softened. Its warrant was false against the document's own table.
  - The replacement warrant is ambiguity, not absence: no UNAMBIGUOUS name exists.
  - Axis one is production versus TEST, which is what lets one artifact live in production while standing in for a collaborator.
  - Emptiness is never asserted; the doctrine is stated explicitly so the guard on it is falsifiable.
  - The seniority argument is replaced by an INDEPENDENCE claim carrying no chronology, no lineage and no new source.
  - Tier reliability is qualified by claim type, source medium and source version, with no blanket downgrade.
metrics:
  tasks: 3
  commits: 3
  files_changed: 14
  emitted_checks_before: 132
  emitted_checks_after: 146
  guards_added: 17
  topics_removed: 3
  completed: 2026-07-29
status: complete
---

# Quick Task 260728-wev: Revise the test-double taxonomy, drop the coinage -- Summary

Fixed the instrument first and proved all seventeen new guards fail against the unmodified tree, then
re-axed the cross-author taxonomy onto three axes, dropped the invented term, deleted a fabricated
source mapping, replaced a defective seniority argument with an independence claim, applied a dozen
evidence-backed row corrections, and corrected eight dependent surfaces plus the live handoff.

## Why the ordering was load-bearing

Six mechanical checkers passed the superseded change at 12/12 GREEN while every defect this revision
fixes was present. The battery was therefore not the gate. Task 1 edited only the checker, captured the
RED baseline, and asserted that nothing under `plugins/` had changed -- because once Task 2 ran, the
baseline was unrecoverable and the primary control would have been unverifiable forever.

## Per-guard baseline-to-green transition

Full per-guard evidence, with file:line reasons and the checker's own emitted FAIL lines, is in
`260728-wev-RED-BASELINE.md`. All seventeen failed at baseline and all seventeen pass now. None had to
be excused, and no guard was defective on first run.

| Guard | Asserts | Baseline | Now |
| --- | --- | --- | --- |
| G1 | invented term absent | FAIL at taxonomy 22, 182, 189, 305 | PASS |
| G2 | no emptiness assertion | FAIL at taxonomy 46 | PASS |
| G3 | no skill-relative self-reference | FAIL at taxonomy 14, 113, 177 | PASS |
| G4 | fabricated-mapping caveat gone | FAIL at taxonomy 69, 236 | PASS |
| G5 | degraded-scan carve-out gone | FAIL at taxonomy 243 | PASS |
| G6 | three-axis count named | FAIL, token absent | PASS |
| G7 | emptiness doctrine STATED | FAIL, token absent | PASS |
| G8 | Bernhardt delivery named | FAIL, token absent | PASS |
| G9 | tiers are version-bound | FAIL, token absent | PASS |
| G10 | mistranscription named | FAIL, token absent | PASS |
| G11 | non-occurring Metz term gone | FAIL at taxonomy 132, 207, 275 | PASS |
| G12 | superseded axis-count wording gone | FAIL at taxonomy 18, 26, 45 | PASS |
| G13 | independence claim, not seniority | FAIL, token absent | PASS |
| G14 | worked example does not deny step 5 | FAIL at SKILL.md 112 | PASS |
| G15 | wrong body is not the identity return | FAIL at SKILL.md 127 | PASS |
| G16 | kanban essay named | FAIL, title absent tree-wide | PASS |
| G17 | no bare unqualified use outside the taxonomy | FAIL, SEVEN sites | PASS, zero sites |

Emitted checks went 132 to 146, matching the predicted derivation exactly (topics 102 to 106, absent 8
to 17, post-loop 3 to 4). Predicting the total is what makes a silently dropped guard fail on a number
rather than on inspection.

### The two removals that are mirror images

R1 was a needle that OUTLIVED ITS SUBJECT: two unrelated occurrences kept it reporting PASS after the
thing it policed was gone -- a false PASS, and the live fifth false-GREEN. R3 was the opposite end of
the same coupling bug: a SUBJECT DELETED FROM UNDER A NEEDLE, producing a false FAIL that would have
made the exit-0 requirement unsatisfiable. Both are one defect -- a positive topic silently depending
on prose another change is free to move. Fourteen surviving positive topics were run against the draft
before deletion, and none was orphaned.

## The derived Sources total

**Twelve.** Derived by counting the actual bullets in the final list, not carried forward. Composition
changed while the number did not: previously eleven real sources plus one coinage bullet, now twelve
real sources -- the coinage bullet removed, Clean Code added with its own tier, and no bullet added for
the independence claim because it introduces no new source. The row total is the same coincidence
class: 34 before and 34 after, because deleting the non-occurring Metz row and adding the Bernhardt
IO-substitute row cancel out. Both numbers are machine-asserted precisely so an unchanged number
cannot be mistaken for an unchanged list.

## How the kanban-cycle contradiction was closed

`principle-backing.md` was SHIPPING a self-contradiction: line 67 said which owned Beck surface carries
the kanban cycle was not established, and fourteen lines later line 81 counted four OWNED sources with
Beck among them citing that same instruction. Both cannot be true.

It is resolvable because the surface IS established: the essay **TDD is Kanban for Code**, which
enumerates a five-step cycle whose third step is a preparatory refactoring. The POSITION is what makes
it decisive -- that step sits after the one adding production stand-ins so the test compiles and fails,
and before the one changing logic to pass it.

- The row now names the ESSAY, never the book. Putting the book title in that Source cell with an owned
  tier would have tripped the D-05 provenance-honesty gate on the very row being fixed.
- The tier goes no-oracle to owned, and the wording no longer asserts both sides.
- `beck-tdd-by-example.md` gets a PER-CLAIM owned tier on the same claim. Its file-global no-oracle
  blockquote is untouched -- asserted by a diff scan -- because changing it would be the
  tiers-propagate error committed while fixing a tier defect.

**Beck positions named as conflicting, because the qualifier is the whole safety margin:**

1. **TDD is Kanban for Code** -- a preparatory refactoring before green, and refactoring after the test
   passes classified as over-production.
2. **TDD is Not Hill Climbing** -- the opposite rule directly: with a red test the only permitted move
   is making it pass, and refactoring becomes available once all tests pass.
3. **Canon TDD** -- no prepare-to-implement step at all.
4. **Asked directly** how tidy-first ordering coexists with refactor-last, he answers that the two
   contradict each other and judgment is required.

A constraint that TIGHTENS rather than weakens the claim is carried with it: he states changes to logic
and to structure are not begun until a test is failing, so the preparatory refactoring is GATED on a
red test existing. Both qualifiers appear at every site the claim is made.

## Files deliberately NOT touched, and why

- **The three j9m historical occurrences** -- `260728-j9m-PLAN.md:351` and `:662`, and
  `260728-j9m-SUMMARY.md:11`. MEASURED as three, which settles a live disagreement: CONTEXT.md says
  five and the earlier brief said four, and both are wrong. They are immutable records of what was true
  at the time, so byte-intactness is asserted over the WHOLE DIRECTORY rather than by the survival of
  some occurrence -- a partial rewrite would otherwise pass while contradicting the claim.
- **`grade-red.mjs`** -- audit-confirmed clean and byte-unchanged. Thirty-six recorded eval runs depend
  on it.
- **`lib/provenance-honesty.mjs`** -- byte-unchanged; its selftest still passes 3/3.
- **The sha256 gate's taxonomy label constant** -- it is the byte-identity gate's label, not a coinage
  gate, and touching it would have broken a gate while claiming to fix one.
- **`test-structure-and-assertions.md:24`** -- section 5's four-claimant claim is scoped to SUBSTITUTION
  terms, so this in-house structural sense is not a counterexample. Editing a fifth file to defend a
  claim is the wrong direction.
- **`beck-tdd-by-example.md`'s book-based tiers** -- the Beck Sources bullet and the file-global tier
  blockquote. Those rest on the book, and the Beck re-tier is SOURCE-DRIVEN so it does not reach the
  book. The file is edited, but only for the kanban claim.
- **The untracked Phase-21 scratch handoff** and **the generated sample under the workspace samples
  directory** -- scratch and regenerated respectively.
- **`principle-backing.md` tiers other than the kanban row** -- the Beck re-tier applies to the
  taxonomy's rows because their SOURCE changed, not because the book changed tier.

## Deviations from plan

### Auto-fixed

**1. [Rule 3 - Blocking] The required typecheck was RED at baseline for a worktree-environment reason**

- **Found during:** Task 3, before any content edit to the compiled fence.
- **Issue:** `extract-samples.mjs` failed with `TS2307: Cannot find module 'vitest'` on ALL EIGHT
  extracted samples, including several this task never touches. `node_modules/` is gitignored, present
  in the main checkout and absent in a git worktree by construction. So a required verify command was
  unrunnable for a reason with no connection to the change.
- **Fix:** a directory junction from the worktree's workspace to the main checkout's already-present
  dependency tree. No tracked file changed, no package was installed, and no package registry was
  contacted -- so the package-legitimacy carve-out on Rule 3 is not engaged; this adds no new package
  name and resolves nothing from a registry. The junction is covered by `.gitignore:2`, verified with
  `git check-ignore`.
- **Result:** the typecheck went from RED over 8 modules to `tsc --strict --noEmit` clean over 8
  modules, confirming the baseline RED was purely environmental.
- **Note for the reader:** this means the plan's `node extract-samples.mjs` verify would fail in any
  fresh worktree regardless of content. Worth pinning in the workspace docs or the plan template.

**2. [Rule 1 - Bug] My own header comment broke the label-count assertion**

- **Found during:** Task 1 verification.
- **Issue:** documenting that the sha256 gate's label was left alone made the token appear a FOURTH
  time, tripping the exactly-three assertion. The assertion was right and my comment was wrong.
- **Fix:** rephrased the comment to refer to the constant without naming it. Count back to 3.

**3. [Rule 1 - Bug] My first draft of section 5 tripped G2**

- **Found during:** Task 2, checking the draft against the guards before committing.
- **Issue:** while describing the withdrawn claim I reproduced the banned no-author phrasing verbatim,
  which is exactly what G2 exists to catch. The guard caught its author.
- **Fix:** rewritten to describe the withdrawn assertion without restating it.

**4. [Rule 3 - Blocking] RED-BASELINE row ids collided with the roster assertion**

- **Issue:** the needle-discrimination table's rows also matched `^\| G[0-9]+`, so the roster count read
  22 instead of 17.
- **Fix:** discrimination rows written as `Guard GNN`, so the seventeen-row assertion counts the roster
  and nothing else. Noted in the file itself.

### No unauthorised deviation was taken

No contradiction between plan requirements was found that could not be satisfied. Every count the plan
declared itself authoritative on was independently measured and matched: three j9m occurrences, seven
G17 baseline sites, 132 baseline checks, 146 after, 34 rows, 12 Sources bullets, 3 label occurrences.

## Verify commands I judged weak, reported rather than trusted

The plan asks explicitly for this, and seven false-GREENs in this work stream justify it.

- **The anchor-resolution loop is vacuous in isolation.** `for a in $(...); do ... done; echo
  anchors-ok` prints success when the anchor list is EMPTY, because the loop body never runs. It only
  means something alongside the sibling assertion pinning the anchor count at 7. I ran both, and all
  seven anchors were shown resolving individually.
- **The FAIL-count and total-check assertions are lower bounds.** `-ge 17` and `-ge 146` catch a
  DROPPED guard, which is the intended direction, but cannot detect an added or duplicated one. Exact
  equality was measured by hand: 17 and 146 on the nose.
- **`git grep -n -i -e "hill climbing" -e "contradict"` has no exit-status wrapper** in the plan's
  verify block, so it passes as long as the command runs. I read the three matching lines rather than
  trusting the invocation.
- **Falsifiability positively controlled where cheap.** The ASCII scan was proven able to fail against a
  control file containing a non-ASCII dash. Four needles that must DISCRIMINATE (G7, G12, G13, G14, G15)
  were each checked against the sibling text they must not catch -- fifteen cases, all correct. G17's
  allowlist was positively controlled too: the two meta-mentions the audit classified as non-violations
  were correctly NOT flagged, so the gate discriminates rather than flagging every occurrence.
- **The email scan as written IS falsifiable** -- it carries the `test` assertion that an earlier draft
  lacked. Zero email-shaped tokens across all 14 changed files, diffed against the pre-Task-1 BASE so
  the taxonomy rewrite is inside the scanned range rather than excluded by per-task commits.

## Follow-up forwarded

**The taxonomy's table-of-contents anchors remain ungated.** The taxonomy is not a
`check-crossrefs.mjs` source and the reference checker has no anchor check, so a stale anchor after a
heading rename passes silently. All seven were verified by hand this time, and every heading was
renamed in this revision -- which is exactly the change class that would have broken them. A dedicated
anchor gate is the obvious next increment and was deliberately not built here.

## Routed to human review -- no checker can hold these

Checker topics are FILE-SCOPED and match a token anywhere in the file, so presence is gateable and
PLACEMENT is not. At least two reviewers, at least one briefed from scratch with no prior findings.

- That the paragraph replacing the seniority block asserts INDEPENDENCE and nothing else. G13 gates
  only that the phrase is present; it cannot detect a seniority claim sitting beside it, and that
  distinction is the entire point of the rewrite.
- That the Bernhardt delivery name sits in the ROW'S OWN Source cell. Naming a delivery in a Sources
  bullet satisfies G8 while the row still cites the talk with no delivery, which is the exact defect
  being fixed. It is written as `Boundaries, PyCon 2013 delivery` in the row.
- That the axis count appears in the SECTION-1 HEADING, not merely somewhere in the prose.
- That the version and medium qualifiers sit in the CLOSING TIER BLOCK rather than scattered.
- That the eight-cell inventory is complete and correct, and that no cell is asserted empty.
- That the kanban-cycle claim reads as one position among several rather than as settled doctrine.

## Residual risks, restated as shipped

- G17's scope is the lz-red references tree plus the three SKILL.md routers. It does NOT cover
  `lz-refactor/references` or `lz-tpp/references`, so a bare unqualified use introduced there stays
  silent. Widening it means auditing two more catalog trees where the word may appear legitimately.
- The Metz RailsConf 2014 and Cascadia Ruby 2012 titles appear on no other shipped surface, so there is
  no in-tree precedent to mirror.
- The kanban claim is owned but is one of at least four conflicting Beck positions. G16 gates the
  essay's presence, not the qualifier; if a later edit drops the qualifier the claim silently becomes
  an overreach again.
- No seniority claim is made, deliberately and permanently for this document.
- The Usenet vocabulary store's findings are deferred, not dropped, and get no Sources bullet here.

## Self-Check: PASSED

Created and modified files confirmed present on disk; all three commits confirmed in `git log`.
Battery re-run after the final commit: `check-red-references` 146/146 exit 0 with all seventeen wev
guards PASS, `extract-samples` tsc --strict clean over 8 modules, `check-hygiene` clean over 201 and
193 files, `check-crossrefs` 719 links resolving, provenance selftest 3/3, `claude plugin validate`
passed. Three taxonomy copies share one sha256 (`125f5de59fea`). No file deletions in any commit.
