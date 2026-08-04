# Quick task 260804-hbv -- deferred items (out-of-scope discoveries)

All four items below were raised by the task's mandatory from-scratch UNPRIMED reviewer, which was
given no history and no diff. **None is caused by this task's edit** -- every one predates it, and
two are the exact defect class Phase 22 existed to close, still invisible to a GREEN gate. They are
recorded rather than absorbed because expanding a task's scope mid-run in front of its own review
gate is the thing this project has repeatedly ruled against.

Each was re-verified by the reviewer against file content with a positive control, not asserted.

---

## D1 -- Two shipped DESCRIPTIONS key on test state semantically, and the ban list cannot see it

**Severity as filed:** IMPORTANT. **Cost to fix:** free if it lands before Round B; forces a second
metered round if it lands after.

**Where:**
- `plugins/lz-tdd/skills/lz-red/SKILL.md:12-13` -- "Also use it when the developer wants to ADD or
  CHANGE behavior / and no test is failing yet"
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md:17` -- "Do NOT use it to ADD or CHANGE behavior when
  no test is failing yet"

**Why it matters.** Both files forbid this axis in their own bodies, one surface below: `lz-red:66`
and `lz-refactor:60` each read "Classify the request by what the developer is asking for, never by
the state of the suite." D-03 removed the test-state axis from every routing branch; these two
descriptions put it back, on the one surface the selector actually reads.

**Why the gate is blind.** `TEST_STATE_TOKENS` (`routing-parse.mjs:199-200`) holds the literals
`nothing failing yet` and `nothing is failing yet`. The shipped wording is `no test is failing yet`
-- a semantic member of the banned set and not a literal one. PROVEN both directions by the
reviewer: `keysOnTestState` returns `[]` on the shipped wording and `['nothing is failing yet']` on
the token-list variant. So `[cls-03] description single-axis -- lz-red -- banned=[]` passes while the
axis is live.

**Read literally**, `lz-red:12-13` makes its own trigger conditional on the suite being green, so an
add-a-behavior ask that arrives while some unrelated test is red falls outside the stated trigger.

**Suggested fix (reviewer's).** Drop the state conjunct from both, e.g. `lz-red` -> "Also use it when
the developer wants to ADD or CHANGE behavior: production code waits for a failing test, so the red
step starts here and lz-tpp takes over once that test is red." Then ADD `no test is failing yet` and
`no tests are failing` to `TEST_STATE_TOKENS` so the variant cannot return.

---

## D2 -- A LITERAL banned token ships in lz-tpp step 1, inside a NEW parser blind spot

**Severity as filed:** IMPORTANT. **Cost to fix:** free -- body text and instrument only, no
description touched, so it does NOT reopen a metered round.

**Where:** `plugins/lz-tdd/skills/lz-tpp/SKILL.md:62-65`, one sentence after the same file forbids
the axis:

> "1. Classify the request by what the developer is asking for, never by the state of the suite.
> Once a branch below has settled this as the green step, confirm the green phase before ranking
> anything: exactly one new failing (red) test, all prior tests green, and the code compiles."

`all prior tests green` is `TEST_STATE_TOKENS[4]` (`routing-parse.mjs:192`) -- not a near-miss like
D1, the literal entry.

**Why the gate is blind, and this is the transferable part.** `letteredChunks`
(`routing-parse.mjs:460-480`) starts its loop at `i = 1` and discards `parts[0]`, which is the
prose LEAD-IN before branch `a.`. Driving the parser directly, `tpp-step1` yields exactly 5 branches
(1a-1e) and none contains the token. Positive control: `keysOnTestState` on the raw sentence returns
`['all prior tests green']`. The reviewer searched `check-rgr-routing.mjs` and `routing-parse.mjs`
for any lead-in/preamble assertion and found none (single hit was an unrelated comment at
`routing-parse.mjs:530`, with a positive control confirming the search works on those files).

**This is the same shape as the blind spot Phase 22 just closed.** The intro-prose hole was "above
the first `## ` heading, therefore outside every parsed surface". This one is "before the first
lettered branch, therefore outside every parsed branch". Closing the first did not close the second.

**Behavioral cost** on the corpus's own regression-floor case: c6 "Make this failing test pass."
supplies none of the three required facts, so "confirm the green phase before ranking anything"
licenses an interrogation before any coaching. In its defence, the sentence is explicitly sequenced
AFTER routing ("Once a branch below has settled this"), so it is a precondition on the action rather
than a routing key.

**Suggested fix (reviewer's).** Move it out of step 1 into its own numbered step, reword off the
banned phrase ("confirm no unrelated test is red"), soften it to an assumption unless the developer
says otherwise -- and extend the parser to emit `parts[0]` as a lead-in surface (or assert on it
directly) so the location stops being blind. The instrument half is the durable part.

---

## D3 -- No description claims test-file code, so c5 wins only via a SIBLING's exclusion

**Severity as filed:** IMPORTANT. **Status:** this is verification **item 3**, which was explicitly
ruled OUT OF SCOPE for this task and ruled "omission, not contradiction" by `gsd-verifier`. The
reviewer reached the same observation independently and argues it harder.

**The sharper argument.** D-04's rule -- test code is owned by the ask, not by the file's kind -- is
stated in all three BODIES and in NO description. Verified: `test file`, `no tests`,
`characterization` and `primary ask` are all absent from each folded description, with a positive
control showing 8 `test file` and 6 `characterization` hits across the same three bodies. So at
trigger time on c5 ("This test file is duplicated and messy, tidy it up."), `lz-refactor`'s
description never claims code living in a test file while `lz-red`'s description is dense with test
vocabulary, and the only thing stopping `lz-red` from winning is `lz-red`'s OWN negative clause at
`:16-17`.

> "A single-surface router should not depend on a sibling's exclusion to win its own case."

That is a different claim from the verifier's, which asked only whether any single skill's body
contradicts its own frontmatter. It does not overturn the SC5 ruling; it argues the omission has a
cost the SC5 test was never measuring.

**Suggested fix (reviewer's).** `lz-refactor` now has 60 chars of headroom. Insert ", including code
in a test file," (31 chars) after "de-duplicate existing working code". Competes for headroom with
D4's suggestion -- fund both by trimming one of the three example quotes.

**Cost:** free if before Round B, a second metered round if after.

---

## D4 -- Minor items

| id | Where | Finding | Cost |
|----|-------|---------|------|
| D4a | `lz-refactor/SKILL.md:34-41` | The `## Two modes` gate has NO clause covering c1. Coach mode is "improve the structure or readability of existing code ... or which refactoring applies to a smell in view"; reference mode is explain/lookup/bare invocation. "I just finished making a test pass. What now?" -- now owned by the description and by branch (d) -- matches neither. `## Two modes` IS a parsed classifier surface (`routing-parse.mjs:76-83`), so this is a coverage hole, not just prose. Pre-existing: 22-08 authored branch (d) without updating the mode gate. **Most tightly coupled to this task's edit** -- the description now promises a case the mode gate cannot classify. | free (body only) |
| D4b | all three descriptions | The primary-ask tiebreak ("a request carrying more than one ask is owned whole by its primary ask") is in every body and no description, so c8 has two description-tier contenders and resolves only because `lz-refactor`'s branch (a) precedes branch (d) and hands off. Correct today, by ordering rather than by selection. | rides Round B |
| D4c | `lz-refactor/SKILL.md:5-6, 11, 19` | No description declines a DESIGN question, so c9 (expected owner NONE) is a soft over-capture risk toward `lz-refactor` via "restructure ... existing working code" and "how would you make it easier to read?". Only body branch (e) declines it. | rides Round B |
| D4d | `lz-tpp:14-15`, `lz-refactor:17-19` | Two destination-less exclusions for a category the loop DOES own; `lz-refactor` routes "ADD or CHANGE behavior" to lz-red then lz-tpp and then re-declines the overlapping "adding a feature" with no destination in the very next sentence. | rides Round B |
| D4e | `routing-parse.mjs:61-63` | Stale comment claims `beck-seam`'s heading is a "DELIBERATE RED baseline" and warns against "fixing" it. The file now carries `## The seam across the three steps` (`beck-tdd-by-example.md:70`), matching the surface entry at `:159`, and the checker PASSES. A maintainer could "repair" something already correct. | free |

---

## Recommended sequencing, if the owner wants these closed

1. **Free now, no metered implication:** D2 (including the parser lead-in fix -- the durable half),
   D4a, D4e.
2. **Must land BEFORE Round B or each forces a second metered round:** D1, D3, D4b, D4c, D4d.
3. Then approve Round B once, covering every description edit in a single round.

D1 and D2 are the two worth doing on merit rather than on timing: both are the phase's own D-03 axis
surviving in a shipped file behind a green gate, and D2 additionally exposes an instrument blind spot
of the same shape as the one Phase 22 just closed.
