---
quick_id: 260804-kvh
description: >-
  Close every open routing-gate evasion (OPEN-1 through OPEN-8) from the two deferred-items
  files, instrument-first: commit the 16 reproductions as a RUNNABLE suite before touching
  any predicate, so each fix has an executable acceptance test instead of a judgment call.
date: 2026-08-04
mode: quick-full
metered_spend: none
owner_decision: >-
  Owner chose "Instrument hardening in full" over a minimum-path-to-milestone-close and over
  deferring to a fresh session, having been shown the caveat that this is a fourth patching
  round in one session and that each of the previous three introduced a defect. Scope accepted
  as stated. The mitigation is structural, not optional: the evasion suite lands FIRST.
must_haves:
  truths:
    - "A COMMITTED, runnable evasion suite exists and is wired into `npm run check`. It applies each
       recorded reproduction, asserts the mutation LANDED, runs the gate, asserts the expected named
       label, restores, and verifies the restore by checksum. Prose reproductions in deferred-items
       files are no longer the only record."
    - "The suite is RED-capable: it FAILS if any evasion that should be caught is not, and it FAILS if
       a mutation anchor stops matching -- a silently non-applying mutation must never read as a pass."
    - "OPEN-1: the sweep-rule citation check no longer passes while asserting a property it cannot
       compute. Its behavior-change destination set is a strict subset of the three slugs, proven."
    - "OPEN-2: every `kind: \"router\"` surface -- eight, not the lettered three -- carries a
       correctness assertion, OR the measured reason it cannot is recorded with the measurement."
    - "OPEN-3: `owns()` rejects a single-hop case whose branch names a contradicting second destination."
    - "OPEN-4: a declared residual that also self-claims in the house self-reference form is flagged."
    - "OPEN-5: remains OPEN and NAMED as an unclosable literal-blocklist ceiling -- not silently
       tolerated, not falsely claimed closed."
    - "OPEN-6: every `## Two modes` gate classifies every request its own description and step-1
       branches claim, and an assertion enforces it."
    - "OPEN-7: the intro two-hop check requires a first-hop CLAIM, not merely mention order."
    - "OPEN-8a-8f closed or explicitly declined with a reason: the `without`-clause negation
       false-negative, the unanchored sections, the unasserted corpus shape, the selftest
       hand-restatements plus `numberedItem` n!=1, and the two remaining stale comments."
    - "No shipped `SKILL.md` DESCRIPTION is edited. Body edits are fine; a description edit would force
       a second metered EVL-01 round and is out of scope here."
  artifacts:
    - .claude/skills/lz-red-workspace/tools/check-rgr-routing.evasions.mjs
    - .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs
    - .claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs
    - .claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs
    - .claude/skills/lz-red-workspace/tools/rgr-cases.json
  key_links:
    - .planning/quick/260804-jay-per-surface-routing-assertions/260804-jay-deferred-items.md
    - .planning/quick/260804-hwy-close-the-four-unprimed-review-findings-/260804-hwy-deferred-items.md
---

# Quick Task 260804-kvh -- close every open routing-gate evasion

## Why the suite lands first

Three patching rounds ran in one session and each introduced a defect: two false comment claims and a
double-space bug in a fold repair. Every one was caught by something other than the author -- a
plan-checker, an unprimed reviewer, a selftest leg. The pattern is not carelessness, it is that prose
acceptance criteria in a deferred-items file are not executable, so the author grades their own work.

So wave 1 makes the criteria executable. After it lands, "OPEN-3 is closed" stops being a claim and
becomes a suite line going from GREEN to RED.

**Sequencing is therefore not negotiable within this plan:** no predicate changes before the suite is
committed and its current verdicts recorded.

## Wave 1 -- the committed evasion suite (T1)

**File:** `tools/check-rgr-routing.evasions.mjs`, wired into the workspace `check` script.

**Action.** One table-driven runner over every recorded reproduction, sourced from
`260804-jay-deferred-items.md` and `260804-hwy-deferred-items.md`. Per entry: `id`, `what`, target
file, anchor + replacement, and `expect` -- either a named label that must appear in a FAIL line, or
`null` meaning "documented ceiling, expected to stay GREEN".

Hard requirements, each learned from a failure this session:
1. **Assert the mutation LANDED** before running the gate. A non-matching anchor must FAIL the suite as
   `BAD TEST`, never pass. This fired twice today (a `sed` anchor spanning a line wrap, and a
   `prove-fold` anchor that did not exist).
2. **Restore and verify by checksum.** Report the checksum comparison per entry.
3. **Assert the expected NAMED label**, not merely a non-zero exit. A wrong-site insertion that
   reddens some other check must not read as a pass.
4. **Measure exit codes without pipes.** A pipeline reports the last stage's status; this produced a
   false reading today.
5. **Refuse to run at all if the baseline gate is not GREEN** -- every downstream verdict would be
   meaningless.
6. **Restore even on throw** (try/finally per entry), so a crash cannot leave a mutated shipped file.

**Verify.** Suite exits 0 with the current tree; deliberately break one expectation and confirm it
exits non-zero; confirm `git status --porcelain` is unchanged after a full run.

**Done when.** Committed, wired into `npm run check`, and its per-entry verdicts recorded in the
SUMMARY as the wave-1 baseline.

## Wave 2 -- OPEN-2, and it is MEASURE-FIRST (T2)

Extending `routesCase` to all eight router surfaces may legitimately go RED: the five non-lettered
surfaces are prose, parsed by sentence, and may simply not carry every case's ask-words. That is not a
defect to paper over.

**Action.** A read-only probe first, exactly as the 0-of-27 probe de-risked the previous task: for each
`kind: "router"` surface x each case, evaluate the predicate and print the matrix. THEN decide:
- all pass -> extend the assertion to all eight;
- some fail for a real reason (prose genuinely does not route that case) -> assert only what the
  surface CLAIMS, and record the measured reason the rest is out of scope. Do NOT weaken `routesCase`.

**Done when.** The matrix is recorded in the SUMMARY and the chosen shape is justified BY it.

## Wave 3 -- the predicate tightenings (T3)

Each has a reproduction that becomes its acceptance test, and each must flip its suite entry to RED.

- **OPEN-1** -- make the behavior-change destination side negation-aware (reuse the `NEG`/clause logic
  `destinationsIn` already has) or drop `"changing behavior"` for a token that cannot appear inside
  `without ...`. Add an assertion that the set is a strict subset of the three slugs -- that is the
  anti-tautology control. Note OPEN-8a shares this root cause; fixing it here may close both.
- **OPEN-3** -- when `expectedSecondHop` is null, require `destinations.length === 1`.
- **OPEN-4** -- flag a declared residual whose text also self-claims (`this skill`, `continue here`,
  `answer it here`, `here as part of`). Keep `RESIDUAL_MARKER_RE`'s both-halves rule untouched.
- **OPEN-7** -- require a first-hop CLAIM in the same sentence as `lz-red`, not just mention order.

**Watch for interaction:** OPEN-3 and OPEN-4 both touch how destinations are counted, and OPEN-4's
self-claim vocabulary overlaps text OPEN-1's negation logic reads. Re-run the FULL suite after each,
not once at the end.

## Wave 4 -- OPEN-8's tail (T4)

- **8d** corpus shape: assert exactly one `NONE` case, exactly one case with `expectedSecondHop`, and
  every `expectedOwner` drawn from the three slugs plus `NONE`. This protects the D-02 ordered-pair
  assertion from being retired by a one-word edit.
- **8e** selftest: import `corpusFloorOk` / `scanFloorOk` / `hopsOrderedOk` / `flatten` rather than
  restating; model the gate's `STEP1_SURFACES.length !== 3` clause; add a `numberedItem` n!=1 leg and
  state that items 2..N are covered only by the coarse whole-section scan.
- **8f** the two remaining stale comments in `routing-parse.mjs`: the `TEST_STATE_TOKENS` seed comment's
  four "MEASURED live sites" (all absent from `plugins/` -- re-verify with a positive control before
  rewriting) and the `destinationsIn` note claiming shipped self-owning branches parse to zero
  destinations for their own owner (false: `1a`/`1b`/`1d` name literal slugs).
- **8b/8c** unanchored sections: either add the two cited-but-unparsed sections to `ROUTING_SURFACES`
  so the single-axis checks reach them, or record the measured decision not to. State the residual
  inventory either way.

## Wave 5 -- OPEN-6, the only shipped-prose item (T5)

**Body only. Do NOT touch any `description`.**

Each `## Two modes` gate must classify every request its own description and step-1 branches claim.
Measured gaps: `lz-tpp` fails 7 of 9; `lz-red` fails c3 (claimed verbatim by its description) plus the
hand-off cases; `lz-refactor` fails c2/c3/c4/c6/c9. Note `lz-tpp` step 2 reads "Once branch (b) has
settled this as the green step", so its gate must admit a request before step 1 can decline it.

**Then add the assertion that would have caught it:** for each mode-gate surface, every corpus case
must match some mode clause, or the gate must be shown to route it away. Without an assertion this
recurs, because mode gates are currently token-scanned only.

## Wave 6 -- OPEN-5 (T6)

Confirm it stays OPEN and NAMED. Already documented at both `TEST_STATE_TOKENS` and
`CATCHALL_CONDITION_RE`; verify with `git grep -c -i` (**`-i` required** -- the case-sensitive form
reported the documentation missing today when it was present) plus a negative control.

## Verification battery -- no pipes, positive controls, exit codes

`check-rgr-routing.mjs`, `.selftest.mjs`, the NEW `.evasions.mjs`, both workspace `npm run check`,
`check-evals.mjs`, `merge-judge --selfcheck`, `tabulate --selfcheck`, `selfcheck-red.mjs`,
`claude plugin validate .` and `--strict` -- all exit 0. Plus:

- Full evasion suite GREEN, with every previously-open entry now expecting a catch.
- `git diff --stat` shows no `description:` block changed -- check the frontmatter diff explicitly, not
  just the file list.
- ASCII-only, maintainer gmail identity, allowlist-inversion.
- Zero metered spend.

## Gates

- **MANDATORY from-scratch UNPRIMED review**, briefed to ATTACK rather than confirm, as the last step.
- If it finds new evasions, ADD them to the committed suite even if they are not fixed -- the suite is
  the durable record, and that is the loop-closing move this task exists to make.
- **CHECKPOINT DISCIPLINE:** if context runs short mid-wave, write `HANDOFF.json` naming the wave, the
  suite's current verdicts, and the next action. Do not leave a wave half-applied with a mutated file.
