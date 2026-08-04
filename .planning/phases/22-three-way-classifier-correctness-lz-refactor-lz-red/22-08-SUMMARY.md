---
phase: 22-three-way-classifier-correctness-lz-refactor-lz-red
plan: 08
subsystem: skills
tags: [lz-tdd, lz-red, lz-tpp, lz-refactor, classifier, routing, skill-description, markdown]

# Dependency graph
requires:
  - phase: 22-03
    provides: the three SKILL.md step-1 branch lists and the working-code vocabulary normalization the intro copies had drifted from
  - phase: 22-04
    provides: the repaired beck-tdd-by-example.md seam section and the deferred F-5/F-6 items this plan closes
provides:
  - lz-refactor's intro paragraph states the two-hop rule (the phase BLOCKER, closed)
  - all six classifier intro/scope surfaces key on the ask rather than on suite state
  - lz-red's branch (c) is coherent from lz-red's own vantage while still resolving to the ordered pair c4 asserts
  - beck-tdd-by-example.md reads identically from all three vantages and its self-description matches its real inbound citations
  - the three shipped descriptions key on the ask, with reciprocal sibling naming complete in all three
  - Q-1 and Q-2 ruled on in the shipped prose; Q-3 recorded as open
affects: [22-VERIFICATION re-run, D-18/SC7 acceptance review, EVL-01 reciprocal trigger round, D-08 placement A/B]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Design rulings live in the numbered item's LEAD-IN, after the `Take the FIRST branch that matches:` line and before the first lettered branch -- structurally invisible to `letteredChunks` and outside every `C_POINTER` exact line run"
    - "A ruling sentence in a classify surface carries no skill slug, no residual marker, no CATCHALL_CONDITION_RE word and no TEST_STATE_TOKENS phrase, asserted against the real exported constants with a firing positive control per predicate"
    - "A description-level gap is graded on the FOLDED form via `keysOnTestState(foldedDescription(file))`, never on a line-oriented grep"

key-files:
  created:
    - .planning/phases/22-three-way-classifier-correctness-lz-refactor-lz-red/22-08-SUMMARY.md
  modified:
    - plugins/lz-tdd/skills/lz-refactor/SKILL.md
    - plugins/lz-tdd/skills/lz-red/SKILL.md
    - plugins/lz-tdd/skills/lz-tpp/SKILL.md
    - plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
    - plugins/lz-tdd/references/beck-tdd-by-example.md
    - .planning/phases/22-three-way-classifier-correctness-lz-refactor-lz-red/deferred-items.md

key-decisions:
  - "F-7 ruled NARROW THE CLAIM, not add an lz-tpp citation: D-05 keeps lz-tpp classifier-only, and this repo has MEASURED zero-of-six reference retrieval, so a new citation buys an unproven read path while enlarging lz-tpp's reference surface"
  - "lz-red's refactor exclusion re-keyed to `de-duplicate working code` rather than `working code without changing what it does`: the longer phrasing overshot the 97-char headroom by 12, and the plan forbids raising the cap, so the clause was tightened instead of recovering characters from an unrelated trigger clause"
  - "Both design rulings written in IDENTICAL wording in all four classify lead-ins, deliberately accepting a sixth copy of shared routing prose, because the single-normative-source alternative is exactly what the HALT-gated placement A/B exists to decide"
  - "The lz-refactor description block was re-flowed after the word change so the insertion left no orphan line; the folded form is byte-identical either way, verified at len=1391 before and after the re-flow"

patterns-established:
  - "Negative checks carry a stated positive control: every removal criterion in this plan was proven capable of failing by running it against the pre-edit blob"
  - "Wrap-tolerant assertions are verified PER PATH with `\\s+` at every join a wrap could fall on -- the Q-2 ruling initially under-reported 3 of 4 files purely because the leaf wrapped at a different word"

requirements-completed: [CLS-03]

coverage:
  - id: D1
    description: "lz-refactor/SKILL.md's intro states the two-hop rule (the phase BLOCKER, B-1) and its scope sentence keys on the ask (F-2)"
    requirement: CLS-03
    verification:
      - kind: other
        ref: "sed -n '21,30p' plugins/lz-tdd/skills/lz-refactor/SKILL.md | rg -U -c 'Behavior\\s+changes belong to the green step' -> exit 1 (positive control at HEAD reports 1)"
        status: pass
      - kind: other
        ref: "sed -n '21,30p' plugins/lz-tdd/skills/lz-refactor/SKILL.md | rg -U -c 'lz-red[\\s\\S]{0,200}lz-tpp' -> 1"
        status: pass
    human_judgment: false
  - id: D2
    description: "lz-red/SKILL.md uses one vocabulary with its own narrative (F-3) and branch (c) is self-owning without losing the ordered destination pair (F-4)"
    requirement: CLS-03
    verification:
      - kind: other
        ref: "node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs -- [cls-01] exhaustive c4 resolves to lz-red then lz-tpp (ordered) via red-step1#1c"
        status: pass
      - kind: other
        ref: "node .claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs -- mutation legs included"
        status: pass
    human_judgment: false
  - id: D3
    description: "beck-tdd-by-example.md carries no skill-relative pronoun and its scope line matches its real inbound citations (F-5, F-6, F-7)"
    requirement: CLS-03
    verification:
      - kind: other
        ref: "git grep -c -F 'this skill' / 'the coach' / 'any of the three' -- plugins/lz-tdd/references/beck-tdd-by-example.md -> exit 1 each; 'green bar' survives exactly once at the Fowler site"
        status: pass
      - kind: other
        ref: "node .claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs -- 720 links resolve, both citers intact"
        status: pass
    human_judgment: false
  - id: D4
    description: "Q-1 and Q-2 ruled on in all four classify lead-ins, in wording the parser provably ignores; Q-3 recorded as open"
    requirement: CLS-03
    verification:
      - kind: other
        ref: "node .claude/skills/lz-red-workspace/variants/build-variants.mjs -- 4 declared delta(s) matched exactly for BOTH trees (catches a mis-placed insertion)"
        status: pass
      - kind: other
        ref: "check-rgr-routing.mjs laws-classify still parses to 10 branches, proving both ruling sentences were dropped by the sentences-router fragment filter"
        status: pass
    human_judgment: false
  - id: D5
    description: "All three shipped descriptions key on the ask; lz-tpp names lz-refactor (F-8, F-9)"
    requirement: CLS-03
    verification:
      - kind: other
        ref: "keysOnTestState(foldedDescription(file)) returns [] for all three; lz-red 1439 -> 1422 (shorter, within its 97 headroom)"
        status: pass
      - kind: other
        ref: "build-variants.mjs -- per-skill frontmatter IDENTICAL across all 3 trees (the D-11 precondition)"
        status: pass
    human_judgment: false
  - id: D6
    description: "The eight 22-VERIFICATION gaps are closed to the satisfaction of an INDEPENDENT reviewer and the phase acceptance gate"
    verification: []
    human_judgment: true
    rationale: "D-18/SC7 requires a fresh acceptance review with at least one from-scratch UNPRIMED reviewer plus a gsd-verifier re-run. The executor has no Agent tool and MUST NOT self-certify; the phase exists because a green battery hid a real defect."

# Metrics
duration: 62min
completed: 2026-08-04
status: complete
---

# Phase 22 Plan 08: Gap Closure Summary

**Eight confirmed content defects closed in five shipped Markdown files: the two-hop BLOCKER in lz-refactor's opening prose, a self-referential branch in lz-red, three skill-relative sentences in the plugin-wide Beck reference, and the banned test-state qualifier removed from two shipped `description` fields -- all outside the deterministic gate's 11 parsed surfaces, all verified by criteria proven capable of failing.**

## Performance

- **Duration:** 62 min
- **Tasks:** 5
- **Files modified:** 6 (5 shipped Markdown + 1 planning record)
- **Metered spend:** zero

## Accomplishments

- **The phase BLOCKER is closed.** `lz-refactor/SKILL.md`'s first prose after the H1 now states the two-hop rule its own frontmatter, narrative and branch (c) already stated. SC5's own example file no longer falsifies SC5.
- **Every classifier intro/scope surface keys on the ask.** Line 23's suite-state framing, lz-red's stale `passing code` adjective, beck's green-bar ownership conditioning, and the banned phrase in two `description` fields are all removals of a test-state key from a surface that decides ownership or scope (D-03).
- **lz-red no longer tells itself to hand off to itself**, while `destinationsIn()` still yields the ordered pair `['lz-red','lz-tpp']` that corpus case c4 binds on.
- **The plugin-wide Beck reference reads identically from all three vantages**, and its self-description now matches its two real inbound citations instead of overclaiming three.
- **Both open design questions are ruled on where a reader meets them**, in four places, in wording the parser provably ignores. The third is recorded as open rather than silently carried.
- **The D-11 precondition survived the description edits** -- per-skill frontmatter is still byte-identical across all three placement trees, re-asserted after the edits rather than assumed.

## Task Commits

1. **Task 1: lz-refactor intro -- BLOCKER + test-state scope framing** - `1006c9f` (fix)
2. **Task 2: lz-red intro vocabulary + self-referential branch (c)** - `5136974` (fix)
3. **Task 3: beck skill-relative pronouns + false reach claim** - `be2a09a` (docs)
4. **Task 4: the two design rulings + Q-3 deferred entry** - `0cf46b0` (docs)
5. **Task 5: the three description frontmatter fields** - `6be5376` (fix)

## The description measurement (Task 5 primary criterion)

Measured on the FOLDED form via `keysOnTestState(foldedDescription(file))`, which is how the runtime and the gate both see the field. A line-oriented grep for the offending phrase returns exit 1 at HEAD, PRE-edit, because the clause wraps across two source lines -- so a grep could never have graded this.

| skill | PRE len / headroom | PRE banned | POST len / headroom | POST banned |
|---|---|---|---|---|
| lz-red | 1439 / 97 | `["tests already pass","code whose tests already pass"]` | 1422 / 114 | `[]` |
| lz-refactor | 1369 / 167 | `["tests already pass","code whose tests already pass"]` | 1391 / 145 | `[]` |
| lz-tpp | 840 / 696 | `[]` | 1000 / 536 | `[]` |

TWO tokens fired per description, not one: `TEST_STATE_TOKENS[3]` (`tests already pass`) is a strict substring of `TEST_STATE_TOKENS[10]` (`code whose tests already pass`), so removing only the longer phrase would have left the shorter one live. The target was an EMPTY array and it is met for all three.

lz-red's binding length constraint is satisfied with margin: **1439 -> 1422, SHORTER**, so no character recovery from an unrelated trigger clause was needed.

The gate's own cap label agrees:

```
[PASS] [cls] description char cap -- lz-red -- 1422 chars, 114 of headroom
[PASS] [cls] description char cap -- lz-tpp -- 1000 chars, 536 of headroom
[PASS] [cls] description char cap -- lz-refactor -- 1391 chars, 145 of headroom
```

## The D-11 precondition, re-asserted after the edits

`build-variants.mjs` rebuilds both generated placement trees FROM the tracked tree and then asserts each skill's frontmatter hash is identical across all three. Quoted verbatim from the post-edit run:

```
[OK] lz-red frontmatter IDENTICAL across all 3 trees -- 96dc19eacb038e48
[OK] lz-tpp frontmatter IDENTICAL across all 3 trees -- 05e23a05916fc341
[OK] lz-refactor frontmatter IDENTICAL across all 3 trees -- a5d425ba9dcc974f
```

```
SUMMARY: variants GREEN -- 2 tree(s) built, each with 4 declared delta(s) matched exactly;
source untouched; 3 arms pairwise distinct per SKILL.md; frontmatter byte-identical across all 3 trees
```

`selfcheck-routing.mjs` independently re-derives the same three hashes at crux 3 and passes 6/6.

## The F-7 ruling and its reason

**Ruled: NARROW THE CLAIM. No lz-tpp citation was added.**

The scope line asserted the file is shared "so any of the three can name the seams it owns". That reach claim is FALSE and was re-verified here, not taken from the review: `git grep -F 'beck-tdd-by-example' -- plugins/lz-tdd/skills/lz-tpp/` exits 1, with a passing positive control on the same path (`git grep -c -F 'references' -- plugins/lz-tdd/skills/lz-tpp/SKILL.md` reports 5). The only inbound citers are `lz-red/SKILL.md` and `lz-refactor/references/principles.md`.

Two reasons for narrowing rather than adding a citation:

1. **D-05** keeps lz-tpp's edits minimal and classifier-only, and a new reference citation is not a classifier edit.
2. This project has **MEASURED zero-of-six retrieval** on a cited reference, so a new citation buys an unproven read path while enlarging lz-tpp's reference surface. Narrowing is a one-sentence factual correction with no new surface at all.

The sentence orienting all three STEPS to their owning skills was kept (that orientation is true and is what makes the file plugin-wide), as was the two-hats pointer into lz-refactor's `principles.md`.

## The two design rulings -- exact wording and where they live

Both sentences are written in IDENTICAL wording in **four** files:

- `plugins/lz-tdd/skills/lz-red/SKILL.md` (coach step 1 lead-in)
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (coach step 1 lead-in)
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (coach step 1 lead-in)
- `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` (the `Classify first:` paragraph)

**Q-1, the carve-out:**

> A developer's own report of where they are in the loop is context for the ask, not a condition to route on, so classify from what they are asking for next.

**Q-2, the compound ask:**

> A request carrying more than one ask is owned whole by its primary ask, and the secondary ask is named as a next step in the answer rather than routed as a second hop.

Q-2 states the policy `rgr-cases.json` case c8's rationale already encoded and no shipped file stated. It also answers the reviewer's underlying worry: under this policy the first-match owner does not perform the tidy its own description forbids, it names who does.

**The quoted utterance in branch (d) was NOT touched.** Q-1 is answered by ADDING a carve-out, never by editing the trigger -- corpus case c1 binds on `finished`, `test pass` and `what now`, and it is the canonical request whose mis-routing created this phase. Verified per path with a fully wrap-tolerant pattern (`rg -U -c 'I just finished\s+making\s+a test pass'` reports 1 in each of the four files individually, never as a directory-wide count, because `beck-tdd-by-example.md` carries the same utterance at a different wrap point and Task 3 edits that file).

**The four exclusions were asserted mechanically, not eyeballed.** Both sentences were run through the real exported `destinationsIn`, `keysOnTestState`, `CATCHALL_CONDITION_RE` and `RESIDUAL_MARKER_RE`, with a firing positive control for each predicate:

```
Q-1: slugs=[] testState=[] catchall=false residual=false terminated=true ascii=true -> OK
Q-2: slugs=[] testState=[] catchall=false residual=false terminated=true ascii=true -> OK
--- positive controls (each MUST fire) ---
slug control       : ["lz-refactor"]
testState control  : ["tests already pass","code whose tests already pass"]
catchall control   : true
residual control   : true
```

`laws-classify` still parses to exactly 10 branches, which is the direct evidence that both sentences were dropped by the sentences-router fragment filter rather than becoming branches.

## Book-backed claims: nothing was approached, nothing to escalate

**No edit reached a book-backed claim, so there is no item for the orchestrator to escalate to an oracle-reviewer gate.**

Byte-unchanged and verified as such in the diff:

- every `## Sources` row in every file
- the per-claim `Owned; oracle-verified` Fowler attribution in `## The red-green-refactor cycle`, including its green-bar sentence -- `git grep -n -F 'green bar'` reports exactly **1** match, and it is that sentence (a count of 0 would have been a STOP condition)
- both Beck two-rules bullets, including the one whose own text opens on the bar being green
- the `## The seam across the three steps` section repaired in 22-04
- every Law provenance parenthetical in `three-laws-and-test-selection.md`

`git diff` on `beck-tdd-by-example.md` shows three hunks, all in the in-scope regions (the scope line, the ownership sentence below the two rules, the green-bar-strategies lead-in), with the Beck bullets appearing only as unchanged context lines.

**Note for the orchestrator's D-26 review:** the recorded widen stands. Task 3 edited one sentence in `## The two rules` and one in `## Green-bar strategies`, beyond D-26's original seam-section-plus-scope-line scope. The unprimed review MUST cover the widened region.

## Full verification battery -- all GREEN, all offline

| Check | Result |
|---|---|
| `check-rgr-routing.mjs` | exit 0, `SUMMARY: RGR-ROUTING GREEN`, 54 PASS / 0 FAIL over 11 surfaces and 9 corpus cases |
| `check-rgr-routing.selftest.mjs` | exit 0, mutation legs both directions |
| `npm --prefix .claude/skills/lz-red-workspace run check` | exit 0, `check-red-references.mjs` roster at **125 checks** |
| `npm --prefix .claude/skills/lz-refactor-workspace run check` | exit 0, hygiene at **199 wide / 192 no-verbatim**, scope floor PASS |
| `check-evals.mjs` | exit 0, 24 queries, reciprocal 12 all-false byte-consistent |
| `extract-samples.mjs` | exit 0, 8 modules `tsc --strict --noEmit` clean |
| `build-variants.mjs` | exit 0, 4 declared deltas matched exactly for both trees, frontmatter identical across all 3 |
| `selfcheck-routing.mjs` | exit 0, **6/6 cruxes** |
| `check-crossrefs.mjs` | exit 0, 720 links resolve |
| `claude plugin validate .` | exit 0 |
| `claude plugin validate . --strict` | exit 0 |

**Scope assertion:** `git diff --name-only 287e2ba..HEAD` lists exactly the five shipped files from `files_modified` plus `deferred-items.md`. **No file under `.claude/skills/` was modified** -- this plan changed content, never instruments. No checker was weakened, retuned or scope-narrowed; no check went RED at any point that required one.

**Public-repo hygiene:** allowlist-inversion run over both the five commits' author/committer identities and the authored `.planning/` content, each with a firing positive control. No non-approved email-shaped token in either. No forbidden value was written anywhere, including as a search needle.

## Decisions Made

- **F-7: narrow the claim rather than add an lz-tpp citation** (reasoning above).
- **lz-red's exclusion re-keyed to `de-duplicate working code`.** The clearer `working code without changing what it does` overshot the 97-char headroom by 12. The plan forbids raising the cap and directs "tighten this clause further" ahead of recovering characters elsewhere, so the clause was tightened. `working code` is this file's own house vocabulary (its narrative at line 41 and branch (c) both use it), it is not a `TEST_STATE_TOKENS` phrase, and the ask lives in the verbs (`restructure, clean up, de-duplicate`). It also fixes reviewer B's traced consequence directly: a cleanup ask on an UNTESTED target now falls INSIDE the exclusion. Net effect is 17 chars of headroom recovered rather than spent.
- **Identical wording for both rulings in all four copies** -- deliberately a sixth instance of the router duplication Q-3 names, accepted and recorded in `deferred-items.md` with its reasoning, because the single-normative-source alternative is precisely the design choice the unrun A/B exists to decide (D-10's measured zero retrieval is the countervailing evidence).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Restored the workspace's pinned dependencies in the worktree**
- **Found during:** Task 4 (running `extract-samples.mjs` in the verify chain)
- **Issue:** `extract-samples.mjs` exited 1 with `TS2307: Cannot find module 'vitest'` for all 8 extracted modules.
- **Diagnosis, stated accurately:** `vitest@4.1.10` is a TRACKED, pinned `devDependency` of `.claude/skills/lz-red-workspace/package.json` with a tracked lockfile. `node_modules/` is gitignored, and **a git worktree does not carry gitignored files** -- so the dependency was absent in this worktree only. This is the documented fresh-worktree condition already recorded in `deferred-items.md` under plan 22-02, not a missing repo dependency and not a consequence of any edit in this plan.
- **Fix:** `npm --prefix .claude/skills/lz-red-workspace install` -- a restore from the tracked pinned lockfile, adding no package. Explicitly authorized by this plan's worktree environment note.
- **Files modified:** none tracked (`git status --short .claude/skills/lz-red-workspace/` is clean before and after).
- **Verification:** `extract-samples.mjs` then exits 0 with `RED-SAMPLES GREEN -- 8 module(s) tsc --strict --noEmit clean`.
- **Committed in:** nothing to commit; the restored tree is gitignored.

**2. [Rule 1 - Cosmetic defect in own diff] Re-flowed the lz-refactor description block**
- **Found during:** Task 5 (reading back the diff before committing)
- **Issue:** the word change added 22 characters to a fully-wrapped YAML block, leaving an 18-character orphan line (`is hard to read,`) mid-description in a shipped triggering surface.
- **Fix:** re-flowed the remainder of that description block to an even wrap.
- **Verification:** the folded form is byte-identical either way -- `len=1391 banned=[]` measured both before and after the re-flow, and `build-variants.mjs` was re-run afterwards, confirming frontmatter identity across all three trees at the new hash.
- **Committed in:** `6be5376` (Task 5 commit).

---

**Total deviations:** 2 auto-fixed (1 blocking environment restore, 1 cosmetic defect in the executor's own diff)
**Impact on plan:** No scope creep. Neither deviation touched an instrument, a checker, or a file outside the plan's declared set.

## Issues Encountered

**A wrap-tolerant assertion under-reported and had to be corrected, not accepted.** The Q-2 ruling's presence check `rg -U -c 'owned whole by its\s+primary ask'` reported only 3 of the 4 expected files. That was a FALSE failure: the leaf wraps between `by` and `its`, not between `its` and `primary`. Re-running with `\s+` at BOTH joins (`owned whole by\s+its\s+primary ask`) reports 1 in each of the four paths, confirmed a second way by a wrap-tolerant match on the sentence's terminating full stop. This is exactly the trap the plan warns about, met live: a zero or a short count is not evidence until the pattern's wrap tolerances have been placed at every join a wrap could fall on.

## User Setup Required

**Two OWNER actions are now owed. Neither runs here and neither is optional.**

1. **`/reload-plugins`** is mandatory per D-19 now that the `description` edits have landed. Claude cannot run it; committed is not live.
2. **The EVL-01 reciprocal trigger regression round is OWED.** D-06's description edits force it. The owner approved *including the edits*, NOT *running the round*. It stays HALT-gated on separate explicit approval at run time per D-14, and `workflow.auto_advance` does not carry it.

## Next Phase Readiness

**This executor makes no acceptance claim, and the GREEN battery above must not be read as one.** Every gap this plan closes sits OUTSIDE the 11 surfaces `check-rgr-routing.mjs` parses, so the gate is structurally blind to all of them; it is a floor, never evidence the fixes landed correctly.

Remaining ORCHESTRATOR gates, all of which begin after this return:

- **Re-run the D-18/SC7 acceptance review** over all three `SKILL.md` files plus both edited reference files, with at least one from-scratch UNPRIMED reviewer, and keep at least one contract-scoped reviewer. Treat the prior review as a known-answer test. The D-26 review must cover the widened region named above.
- **Re-run `gsd-verifier`** to refresh `22-VERIFICATION.md`; its eight `gaps:` entries are this plan's acceptance target.
- **Re-run `selfcheck-red.mjs` post-merge** -- deliberately NOT run here (it spawns worktrees against borrowed external repos and a killed run strands one).
- **No reviewer, judge or auditor was spawned by this executor.** `gsd-executor` has no Agent tool; every verdict in this phase belongs to the orchestrator.
- **No metered command ran.** No `claude -p`, no eval, no capture arm. `git grep -c -F 'claude -p'` over every file this plan created or edited returns nothing.

## Self-Check: PASSED

- All 5 shipped files and both planning files exist on disk (`ls -1`, all resolved).
- All 5 commit hashes exist in `git log` on `worktree-agent-a2a985434d1ecc3bd`: `1006c9f`, `5136974`, `be2a09a`, `0cf46b0`, `6be5376`.
- This SUMMARY is ASCII-clean and carries no non-approved email-shaped token; both scans were run with a firing positive control, so neither clean result is vacuous.

---
*Phase: 22-three-way-classifier-correctness-lz-refactor-lz-red*
*Completed: 2026-08-04*
