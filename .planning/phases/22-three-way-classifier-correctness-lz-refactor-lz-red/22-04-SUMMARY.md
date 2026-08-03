---
phase: 22-three-way-classifier-correctness-lz-refactor-lz-red
plan: 04
subsystem: shipped-markdown (reference tier)
tags: [classifier, routing, reference-leaf, plugin-wide-reference, lz-red, lz-refactor, lz-tpp]
status: complete
requires:
  - 22-01 (the parser, the 9-case corpus and the gate whose last two failures this plan closes)
  - 22-02 (check-hygiene.mjs widened to 199 wide / 192 verbatim, so both edited files are actually scanned)
  - 22-03 (the five-branch shared vocabulary these two surfaces mirror)
provides:
  - "an lz-red skill that no longer ships two contradicting classifiers: the leaf and the SKILL.md router state the same split"
  - "a plugin-wide shared reference that routes all three steps by the ask from a plugin-neutral vantage"
  - "the ## The seam across the three steps heading the beck-seam ROUTING_SURFACES entry declares"
  - "check-rgr-routing.mjs GREEN -- the first fully green run of the phase"
affects:
  - plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
  - plugins/lz-tdd/references/beck-tdd-by-example.md
tech-stack:
  added: []
  patterns:
    - "named-owner enumeration with a declared residual terminal, in prose register (RESEARCH Pattern 1, D-01)"
    - "literal-slug self-naming in every routing sentence, including the self-owning one"
    - "the heading as a parse INPUT -- the rename is the repair, not a cosmetic touch"
key-files:
  created: []
  modified:
    - plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md
    - plugins/lz-tdd/references/beck-tdd-by-example.md
decisions:
  - "principle-backing.md was NOT edited. Its classify-first row describes classify-first plus the forward lz-tpp handoff; neither claim implies a two-way split and both stay true after the repair, so the plan's touch-only-if-it-moved-materially test returns no."
  - "The two-hop sentence cites Law 1 for the FIRST hop only and attributes the handoff to the Law-3 reframe stated three lines above it; no book backing is claimed for the handoff framing."
  - "The leaf's refactor branch deliberately omits the router's no-tests carve-out. The leaf is the entry gate to the selection moves, the plan's minimum branch list does not include it, and every phrasing that named it put a NEG token (no tests) in the clause the parser reads for slug affirmation."
  - "A hard wrap between 'the same' and 'red-vs-green-vs-refactor' made the plan's own acceptance grep a false negative. Re-wrapped rather than reworded -- git grep is line-oriented and the criterion is the audit trail."
  - "Two skill-relative sentences OUTSIDE the two repaired regions were found and deliberately left, because the plan names both sections in its byte-unchanged list. Logged to deferred-items.md instead."
metrics:
  duration: ~35 min (base bba7c24 -> c222a5c, 2026-08-03)
  tasks: 2
  commits: 2
  files-created: 0
  files-modified: 2
  gate-failures-before: 2
  gate-failures-after: 0
completed: 2026-08-03
---

# Phase 22 Plan 04: Reference-tier classifier repair Summary

Both reference-tier classifier surfaces now state the same ask-keyed, named-owner enumeration the
three shipped `SKILL.md` files carry -- the leaf's replicated catch-all is gone and its own
machine-readable promise about the router is true, and the plugin-wide shared reference is three-way,
plugin-neutral and ask-keyed for the first time -- taking `check-rgr-routing.mjs` from 2 hard failures
to **0**. CLS-01, CLS-02 and CLS-03 close here.

## The falsifiable acceptance target, measured

22-03 handed over exactly two failures and named both as this plan's. Both are gone, and nothing else
moved.

| Run | Failures | Labels |
|-----|----------|--------|
| Fork base `bba7c24` | 2 | `[cls] scan floor -- beck-seam`, `[cls-01] no bare catch-all terminal -- laws-classify` |
| After task 1 (the leaf) | 1 | `[cls] scan floor -- beck-seam` |
| After task 2 (the beck file) | **0** | `SUMMARY: RGR-ROUTING GREEN` |

```
SUMMARY: RGR-ROUTING GREEN -- 9 corpus cases exhaustive and at-most-one over 3 step-1 procedures,
no bare catch-all terminal, no test-state key in any of 11 surfaces, citations resolve,
descriptions within the 1536-char cap
```

`[cls-03] single-axis` now reports real, non-vacuous branch counts on both repaired surfaces:
`laws-classify` 10 branches, `beck-seam` 6 branches -- where `beck-seam` reported 0 at the base
because its heading was unreachable.

## What was built

### Task 1 -- `three-laws-and-test-selection.md`, the replicated catch-all

The `## The Three Laws spine and classify-first` section keeps its heading byte-identical (it is a
parse input) and keeps all three Law bullets, their provenance parentheticals and Law 2's
scope-carefully clause untouched. Only the classify-first paragraph changed. Parsed result, branch by
branch:

| Branch | Condition (the ask) | Destinations | Corpus alignment |
|--------|---------------------|--------------|------------------|
| `#s17` | which test comes next, what a test should assert, how to name it, whether this is a good test | `lz-red` | c2, c3, c8 |
| `#s18` | make a failing test pass | `lz-tpp` | c6 |
| `#s19` | add a new behavior, or change what working code does, before any test covers it | `lz-red` then `lz-tpp` (ordered) | c4 |
| `#s20` | improve structure or readability without changing behavior; clean up, tidy this test file, de-duplicate; or "I just finished making a test pass, what now?" | `lz-refactor` | c1, c5, c7 |
| `#s21` | an ask about the test itself -- what it should assert, how it reads as a test | `lz-red` | D-04's other direction (c3 vs c5) |
| `#s22` | anything outside those | **none**, `isResidual: true` | c9 |

The `Otherwise the work is ... which is lz-red` terminal is gone; nothing in the block routes the
residual to this skill. The `Already-passing code to clean up ...` routing sentence is gone with it --
that was the block's one test-state key. The closing sentence declaring this is the same split the
`SKILL.md` router states survives verbatim and is now true.

Every branch names its owner by literal slug, including the self-owning one, per 22-01 follow-up 1
(`destinationsIn` has no self-reference resolution by design).

### Task 2 -- `beck-tdd-by-example.md`, the plugin-wide shared reference

Exactly two regions changed. The diff is two hunks: lines 1-9 and lines 63-77.

**Scope line.** Was "the test-first loop that **lz-refactor** sits inside ... the refactor step is
**this skill's**". Now describes the loop all three `lz-tdd` skills sit inside, states the file is a
plugin-wide shared reference, names each step's owner (`lz-red` / `lz-tpp` / `lz-refactor`), and
carries the two-hats pointer as an lz-refactor-side cross-reference rather than as this file's own
vantage. Kept as plain text, NOT a Markdown link: `principles.md` lives under
`skills/lz-refactor/references/`, so a relative link from here would not resolve.

**Seam section.** Heading renamed to `## The seam across the three steps` -- the exact string
`tools/lib/routing-parse.mjs` declares. Content authored from D-01 through D-04 and the corpus; the
old paragraph was not paraphrased. Parsed result:

| Branch | Condition (the ask) | Destinations |
|--------|---------------------|--------------|
| `#s3` | which test comes next, what to assert, how to name it, whether this is a good test | `lz-red` |
| `#s4` | make a failing test pass, by picking and applying the next transformation by priority | `lz-tpp` |
| `#s5` | add a new behavior, or change what working code does, before any test covers it | `lz-red`, `lz-tpp` (ordered) |
| `#s6` | improve structure or readability without changing behavior; or "I just finished making a test pass, what now?" | `lz-refactor` |
| `#s7` | a structure-only tidy of code living in a test file / an ask about the test itself | `lz-refactor`, `lz-red` |
| `#s8` | anything outside those | **none**, `isResidual: true` |

`lz-red` appears in this file for the first time -- `git grep -c -F 'lz-red'` reports 4 lines where it
reported 0. The `if the tests are green and the code has a smell, stay here` sentence is gone; no
sentence in the section conditions a destination on test state. No first-person plugin vantage
survives in either repaired region: a re-read of both found no `this skill`, no `stay here`, and no
sentence that reads differently depending on which of the three skills the reader arrived from.

## Book-backed claims: none touched, nothing to escalate

Per the plan's STOP-and-escalate rule, this is the explicit report. **No edit reached a book-backed
claim, so the orchestrator has nothing to escalate to an oracle-reviewer gate.** Verified by diff, not
by inspection:

| Protected surface | State |
|-------------------|-------|
| `beck-tdd-by-example.md` `## Sources` (both rows) | byte-unchanged -- no diff hunk at or below the `## Sources` heading |
| the per-claim `Owned; oracle-verified` Fowler Ch.4 attribution inside `## The red-green-refactor cycle` | byte-unchanged -- no hunk in that section at all |
| the Beck kanban-cycle qualifiers (gated on a red test; one position among several he calls contradictory) | byte-unchanged, same section |
| `## The two rules`, `## Green-bar strategies`, the no-oracle banner | byte-unchanged |
| `three-laws-and-test-selection.md` Law 1 / Law 2 / Law 3 bullets and their provenance parentheticals | byte-unchanged -- the single diff hunk starts below them |
| that file's `## Sources` block and its four selection-move rows | byte-unchanged |
| the Law-3-as-forward-handoff tier (`lz-red orchestration, no-oracle`) | not upgraded; the new two-hop sentence attributes the handoff to that reframe, and cites Law 1 for the FIRST hop only |

The `.oracle/` tree was not read.

## Deviations from Plan

### Auto-fixed issues

**1. [Rule 1 - Bug] The plan's own acceptance grep was a false negative caused by my line wrap**

- **Found during:** Task 1 verification.
- **Issue:** The criterion is
  `git grep -c -F 'the same red-vs-green-vs-refactor split' -- <leaf>` reporting at least 1. My first
  wrap put a newline between `the same` and `red-vs-green-vs-refactor`. `git grep` is line-oriented,
  so it reported nothing even though the sentence was present and intact. In the pre-edit file that
  phrase happened to sit on one line, which is why the criterion was written that way.
- **Fix:** re-wrapped the last three lines of the paragraph so the phrase is contiguous. No wording
  changed. Re-ran: `plugins/.../three-laws-and-test-selection.md:1`.
- **Why this is a bug and not a criterion problem:** a criterion that a future editor can silently
  break by re-flowing a paragraph is worth keeping satisfiable. Rewording the sentence would have
  been the wrong fix -- the plan prohibits deleting it, and it is the auditable promise.
- **Files modified:** `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md`
- **Commit:** `ff85aec`

### Authorized non-edits and interpretations

- **`principle-backing.md` was NOT edited, and this is the explicit statement the plan asks for.**
  The row reads
  `| [Classify-first and the forward lz-tpp handoff](three-laws-and-test-selection.md) | lz-red orchestration | Unowned; high-confidence core only (no-oracle). |`.
  It names two things -- classify-first, and the forward `lz-tpp` handoff -- and asserts nothing about
  how many ways the split goes. Both remain accurate after the repair, so the plan's own test ("touch
  the DESCRIPTION only if the section it describes moved materially, for example if the row's wording
  implies a two-way split") returns no. Editing for symmetry would have risked
  `check-red-references.mjs`'s three `principle-backing.md` row assertions and its 125-check
  arithmetic for zero correctness gain. Those three labels are measured GREEN below.

- **The leaf's refactor branch omits the router's no-tests carve-out.** `lz-red/SKILL.md` step 1
  branch (d) adds "and so does a target that carries no tests (characterization tests pin its
  behavior first)". The leaf's mirror does not. Two reasons, in order: the plan's step-2 minimum
  branch list does not include it, and the leaf is the entry gate to the selection moves rather than
  the full router. There is also a mechanical hazard worth recording for whoever adds it later --
  `no tests` contains a `NEG` token, so putting that phrase in the clause immediately after
  `lz-refactor` makes `firstAffirmedIndex` score the slug as negated, which drops the whole branch
  from the parse. It has to go in its own sentence with the slug behind a comma. This is a
  narrowness, not a contradiction: the leaf routes c7 to `lz-refactor` through the same
  structure-only branch, and `[cls-01] exhaustive` is quantified over the three step-1 procedures,
  not over this leaf.

- **The two-destination sentence in each surface (`#s21` / `#s7`) is intentional.** D-04's pin is a
  PAIR (c3 to `lz-red`, c5 to `lz-refactor`), so stating both directions in one place is what makes
  the disambiguation legible. No gate assertion constrains destination arity on a non-step-1 surface.

### Adjacent defects observed and deliberately NOT edited

Two skill-relative sentences survive in `beck-tdd-by-example.md`, both OUTSIDE the two regions this
plan is scoped to, and both in sections the plan's action step names in its byte-unchanged list:

1. **Line 49, `## The two rules`:** "The second rule is where **this skill** lives".
2. **Line 55, `## Green-bar strategies`:** "**the coach** mentions them only to locate the seam" --
   unqualified in a file loaded from three skills.

These are the same defect class D-20b names for the seam section, in different sections of the same
plugin-wide file. They are pre-existing, not introduced here. Widening the diff would have
contradicted an explicit plan instruction; absorbing them silently would have hidden them. Logged to
`deferred-items.md` as a named input for the ORCHESTRATOR, since the D-26 unprimed reviewer is asked
exactly "is any sentence skill-relative in a plugin-wide file" and is likely to surface them. Neither
carries a Sources row, a provenance tier or a Beck/Fowler attribution, so neither is an
oracle-reviewer matter.

## Verification performed

| Check | Result |
|-------|--------|
| `node tools/check-rgr-routing.mjs` | **GREEN**, exit 0, `SUMMARY: RGR-ROUTING GREEN`, 0 failures over 11 surfaces and 9 cases |
| `[cls] scan floor` all 11 surfaces | PASS -- `laws-classify` 10 branches, `beck-seam` 6 branches |
| `[cls-01] no bare catch-all terminal` all 8 router surfaces | PASS, including `laws-classify` |
| `[cls-01] exhaustive` all 9 cases / `[cls-02] at-most-one` all 9 cases | PASS, unchanged from 22-03 (neither repaired surface is a step-1 procedure, so neither could perturb them) |
| `[cls-03] single-axis` all 11 surfaces | PASS -- zero `TEST_STATE_TOKENS` in any branch |
| `npm --prefix .claude/skills/lz-red-workspace run check` | **exit 0** -- the first fully GREEN lz-red battery of the phase |
| `node tools/check-red-references.mjs` | GREEN, roster label still `125 checks`, all 13 new labels present, none of the 64 retired labels survive |
| the 3 `principle-backing.md` row labels (classify-first seam ROW, Three Laws spine ROW, kanban-cycle essay named IN THE ROW) | PASS |
| `npm --prefix .claude/skills/lz-refactor-workspace run check` | **exit 0** |
| `node tools/check-hygiene.mjs` | GREEN -- ASCII 199 files, no non-allowlisted emails, no-verbatim 192 files; `[cls] hygiene scope floor` PASS at wide 199 / verbatim 192 |
| `node tools/check-backing.mjs` beck-tdd-by-example.md topics | all 6 PASS + `no-oracle tag` + `no scaffold phrase` |
| `node check-evals.mjs` | OK -- 24 queries, 25 authored files across 4 suite dirs |
| `node extract-samples.mjs` | GREEN, `8 module(s) tsc --strict --noEmit clean, 0 skipped` |
| `claude plugin validate .` | exit 0, validation passed |
| `claude plugin validate . --strict` | exit 0, validation passed |
| `git grep -n '^## The Three Laws spine and classify-first'` | exactly 1 line (heading byte-unchanged) |
| `git grep -n '^## The seam across the three steps'` | exactly 1 line |
| `git grep -c -F 'the same red-vs-green-vs-refactor split'` | 1 |
| `git grep -c -F 'lz-red'` on the beck file | 4 (was 0) |
| `git grep -e 'this skill' -e 'stay here'` on the beck file | 1 hit, at line 49, outside both repaired regions (see Adjacent defects) |
| ASCII per file (`LC_ALL=C rg -c -N '[^\x00-\x7F]'`) | exit 1 (zero non-ASCII bytes) on both files |
| `git diff` hunk placement | leaf: 1 hunk, classify-first paragraph only. beck: 2 hunks, scope line + seam section only. No hunk in any `## Sources` block, in the red-green-refactor-cycle section, or on any Law provenance parenthetical |
| `git diff --stat bba7c24..HEAD` | exactly 2 files, +36 / -19 (criterion allows at most 3) |
| `git status --porcelain .claude/skills` | empty -- no checker, parser or corpus touched |
| `git status --porcelain .planning/STATE.md .planning/ROADMAP.md` | empty -- worktree mode, the orchestrator owns those writes |
| `git diff --diff-filter=D` per commit | empty -- no file deleted by either commit |
| metered commands | none ran. No `claude -p`, no eval, no reviewer spawned |

**Environment note (not a defect, and stated with the correct mechanism).** `extract-samples.mjs`
first reported RED with 8x `TS2307 Cannot find module 'vitest'`. Every error was module resolution;
zero were real type errors, and no `ts` fence was touched by either task. The cause is that a git
worktree does not carry gitignored files, so this worktree had no `node_modules` -- the same
mechanism `deferred-items.md` records for 22-02 and 22-03. Running
`npm --prefix .claude/skills/lz-red-workspace install` (tracked, pinned lockfile; **no new package
added**) turned it GREEN, so the table above records a measured PASS rather than an argument.
`node_modules/` is gitignored and `git status` stayed clean. This is a worktree artifact, not a
missing repo dependency.

## Known Stubs

None. Both files are complete shipped Markdown with no placeholder, no TODO and no unwired content.

## Threat Flags

None new. No file created, no network surface, no production code. The plan's register is covered by
what shipped:

| Threat | Mitigation as built |
|--------|---------------------|
| T-22-CONTRA | Both surfaces are `kind: router` in `ROUTING_SURFACES`, and both now PASS every label the gate asserts over them. The leaf's self-describing closing sentence is kept, so the pair stays auditable and the promise is machine-checkable rather than asserted |
| T-22-IP2 | Every `## Sources` row and every book-backed claim is byte-unchanged, proven by diff hunk placement. `check-hygiene.mjs`'s no-verbatim axis REACHES both files now (192 verbatim files) and did not fire; the threshold was not touched. `.oracle/` not read |
| T-22-ORACLE | The Law-3 reframe keeps its `lz-red orchestration, no-oracle` tier. The new two-hop sentence cites Law 1 (which IS `Owned; oracle-verified` in this file's own Sources block) for the first hop only. `check-red-references.mjs` roster still 125 |
| T-22-SELFCERT2 | **No acceptance is claimed here.** The GREEN gate is a floor. The D-26 unprimed review is an orchestrator step after this executor returns, and the D-18/SC7 acceptance review is 22-07's. The two adjacent defects are raised rather than absorbed |
| T-22-PII4 | Hygiene allowlist-inversion GREEN over 199 files including both edited files; no forbidden value written anywhere, not even as a needle |
| T-22-LINK2 | The heading rename breaks no anchor -- both citers target the FILE (`lz-red/SKILL.md`'s inline-code plugin-root citation, `lz-refactor/references/principles.md`'s relative link). Proven by `check-red-references.mjs` guards N2/N3 GREEN ("no dead relative link anywhere in the shipped tree") and `check-crossrefs.mjs` GREEN, not by inspection. No Markdown link with a plugin-root variable was introduced |
| T-22-SPEND4 | Zero metered spend. No `claude -p` and no eval command exists in either task or ran |

## Handoff to the orchestrator

1. **The D-26 unprimed review is yours, not mine.** `gsd-executor` has no Agent tool. Brief the
   reviewer from scratch over `plugins/lz-tdd/references/beck-tdd-by-example.md` with no contract, no
   decision list and no hint of what changed.
2. **Do not hand the reviewer `deferred-items.md`** -- the new 22-04 entry is a decision record for
   YOU to read alongside the reviewer's report. Handing it over would prime the review it exists to
   cross-check.
3. **Nothing to escalate to an oracle-reviewer.** No edit touched a book-backed claim; the table above
   itemizes each protected surface and its byte-unchanged state.
4. **A GREEN battery is not acceptance.** This phase exists because a green 125-check battery
   coexisted with a non-exhaustive classifier. `check-rgr-routing.mjs` GREEN closes CLS-01, CLS-02 and
   CLS-03 as a floor; the verdict is the unprimed review's.
5. **Re-run the battery post-merge.** This worktree needed `npm install` to restore its gitignored,
   pinned `node_modules`; the main tree already has it.

## Self-Check: PASSED

| Claim | Verified |
|-------|----------|
| `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` exists and is modified | FOUND, 147 lines (`wc -l`), committed in `ff85aec` |
| `plugins/lz-tdd/references/beck-tdd-by-example.md` exists and is modified | FOUND, 95 lines (`wc -l`), committed in `c222a5c` |
| Commit `ff85aec` exists | FOUND in `git log bba7c24..HEAD` |
| Commit `c222a5c` exists | FOUND in `git log bba7c24..HEAD` |
| No file deleted by either commit | `git diff --diff-filter=D` empty for both |
| Gate reports GREEN with 0 failures | measured, quoted verbatim above |
| No `STATE.md` / `ROADMAP.md` modification | `git status --porcelain` on both is empty |
