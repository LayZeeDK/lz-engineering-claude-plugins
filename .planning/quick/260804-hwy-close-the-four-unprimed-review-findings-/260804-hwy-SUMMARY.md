---
quick_id: 260804-hwy
status: complete
date: 2026-08-04
metered_spend: none
files_modified:
  - plugins/lz-tdd/skills/lz-red/SKILL.md
  - plugins/lz-tdd/skills/lz-tpp/SKILL.md
  - plugins/lz-tdd/skills/lz-refactor/SKILL.md
  - .claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs
  - .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs
  - .claude/skills/lz-red-workspace/tools/check-rgr-routing.selftest.mjs
review_gate: "NEEDS WORK -- on the INSTRUMENT, not on the shipped text (see Review gate)"
reload_required: true
---

# Quick Task 260804-hwy -- SUMMARY

All of D1, D2, D3 and D4a-e are closed, plus three further gate evasions the review of THIS work
surfaced. The shipped routing text is independently confirmed correct on all nine corpus cases. The
open items are all about how much the GATE can catch, and they are listed at the end rather than
quietly carried.

## Instrument first, and it mattered

The load-bearing sequence: widen the guards, PROVE them RED against the shipped tree, only then edit
prose. Fixing the prose first would have produced a green gate proving nothing.

**Wave 1 RED baseline, captured verbatim, exactly the three predicted failures:**

```
[FAIL] [cls-03] step-1 lead-in single-axis -- tpp-step1 -- keys on [all prior tests green]
[FAIL] [cls-03] description single-axis -- lz-red -- keys on [no test is failing yet]
[FAIL] [cls-03] description single-axis -- lz-refactor -- keys on [no test is failing yet]
```

The new lead-in check DISCRIMINATES rather than blanket-failing: it PASSED `refactor-step1` and
`red-step1` in the same run and failed only `tpp-step1`.

**Wave 2:** prose fixed, all three GREEN, guards unweakened.

## What changed

### Instrument

| Change | Why |
|--------|-----|
| `TEST_STATE_TOKENS` += `no test is failing yet`, `no tests are failing` | The SEMANTIC variant of two listed literals was live in two shipped descriptions while the gate reported `banned=[]`. Measured both ways before widening: `keysOnTestState` returned `[]` on the shipped wording, `["nothing is failing yet"]` on the listed variant. |
| NEW exported `step1LeadIn(text, heading)` | `letteredChunks` starts its loop at index 1 and DISCARDS `parts[0]`, the prose before branch `a.` -- where the literal token `all prior tests green` was living. |
| NEW `[cls-03] step-1 lead-in single-axis` over the 3 step-1 surfaces | Makes that region answerable. |
| NEW `[cls-03] whole-section single-axis` over all 11 surfaces, PRE-filter | See "the same hole, a fourth time" below. |
| 6 selftest assertions for `step1LeadIn` | A new export with no behavioural test is an untested guard. The last one reproduces the actual defect shape. |
| Export roster 10 -> 11 | Exact-equality gate; it fired on my new export, which is the point. |
| 4 stale comments rewritten as history | Same class as D4e: a stale baseline note makes a maintainer "repair" something already correct. |

### Shipped skills

- **D1a** `lz-red` description: dropped the ` and no test is failing yet` conjunct. Its own body one
  surface below forbids that axis, and read literally the conjunct made the trigger conditional on
  the suite being green, so an add-a-behavior ask arriving while an unrelated test was red fell
  outside the stated trigger.
- **D1b** `lz-refactor` description: dropped ` when no test is failing yet` from the exclusion.
- **D2** `lz-tpp` step 1: the green-phase precondition moved OUT of the lead-in into its own numbered
  step (2), and **reworded off** the banned phrase -- `no unrelated test red`, not
  `all prior tests green`. Merely relocating it would have been evading the guard I had just built.
  It stays sequenced after routing, is stated as an ASSUMPTION rather than an interrogation (c6
  supplies none of the three facts), and steps 2-7 renumbered to 3-8.
- **D3** `lz-refactor` description: now claims `-- including code that lives in a test file --`, so
  c5 no longer depends on `lz-red`'s exclusion to reach its owner.
- **D4a** `lz-refactor` `## Two modes`: coach mode now names the post-green "what now" ask. It is a
  parsed classifier surface, and it could not classify c1 while both the description and branch (d)
  owned it.
- **D4b** `lz-red` description: primary-ask tiebreak added.
- **D4c/D4d** `lz-refactor` tail exclusion reworked; `lz-tpp` description now names lz-red then
  itself for an add-a-behavior ask. Previously `lz-refactor` routed that category to lz-red -> lz-tpp
  and then re-declined the overlapping "adding a feature" with no destination in the next sentence.
- **Funded by** dropping the redundant third example quote, which was also one of the three phrasings
  named as the c9 over-capture vector.

## Three things caught me, and each is why the guard exists

1. **The budget guard caught my own over-cap edit.** My D4b sentence took `lz-red` to **1551 -- 15
   OVER the 1536 cap.** Trimmed to the short form. (This is the second time that guard has caught an
   over-cap description edit in two tasks; the first was 1508 in 260804-hbv.)
2. **The export roster gate caught my new export**, as designed -- exact equality, so no export slips
   in silently. Updated deliberately.
3. **My own selftest expectation was wrong, not the code.** I asserted the lead-in text included the
   `1. ` marker; `numberedItem` consumes it. Fixed the expectation and documented why the obvious
   expectation is wrong.

## The same hole, a FOURTH time -- and this is the transferable result

The review of this very work found the identical defect shape one level further out. `step1LeadIn`
covers the prose INSIDE item 1 before `a.`; it does not cover the prose BETWEEN the `## ` heading and
item `1.`, which `numberedItem` also discards. Three separate one-line insertions each left the gate
GREEN:

- a narrative sentence naming no slug (dropped by the router/sentences filter),
- a later numbered step (outside item 1),
- prose before item 1 (the hole adjacent to the guard I had just built).

Rather than add a fourth sub-region guard, this closes the CLASS: `[cls-03] whole-section single-axis`
runs the token set over each surface's WHOLE section body, pre-filter and pre-chunking. All three
evasions are now caught, each mutation-proven:

| Evasion | Before | After |
|---------|--------|-------|
| prose before item 1 | GREEN | **RED** -- `whole-section single-axis -- red-step1` |
| later numbered step (item 3) | GREEN | **RED** -- `whole-section single-axis -- red-step1` |
| narrative sentence naming no slug | GREEN | **RED** -- `whole-section single-axis -- red-narrative -- keys on [tests are green]` |

Zero false positives: all 11 surfaces PASS at HEAD.

The recurrence is the lesson. The intro-prose hole, the lettered lead-in, and these three are the
SAME defect found four times, each one level out from the last, and every one found by a human review
rather than by the gate. Prefer a check quantified over a whole region to one more sub-region check.

## Verification -- exit codes with positive controls throughout

| Check | Result |
|-------|--------|
| `check-rgr-routing.mjs` | exit 0; 9 cases, 11 surfaces, 3 lead-ins, 11 whole sections |
| `check-rgr-routing.selftest.mjs` | exit 0, all assertions (guards the parser this task edited) |
| `npm run check` (lz-red-workspace) | exit 0 |
| `npm run check` (lz-refactor-workspace) | exit 0 |
| `check-evals.mjs` | exit 0 |
| `claude plugin validate .` / `--strict` | exit 0 both |
| Lead-in guard mutation | token planted -> RED with exact expected message; restore **sha256-identical** -> token gone (exit 1) -> GREEN |
| Descriptions | lz-red 1466 (70), lz-tpp 1139 (397), lz-refactor 1495 (41); banned hits 0, control 2/2 |
| Semantic variant gone from `plugins/` | exit **1** genuine absence, positive control exit 0 (16 hits) on the same path |
| Literal `all prior tests green` gone | exit **1** |
| ASCII | 0 non-ASCII lines in all three shipped files |
| Email allowlist-inversion | exit 1 -- zero email-shaped tokens |
| `selfcheck-red.mjs` | byte-unchanged (D-22) and has NO code path to the parser (exit 1 on a dependency search); run passing its cruxes |

**The exit-code trap fired again and was caught.** Two separate times: `rg` could not read a
`/tmp/...` path Git Bash had created (exit **2**, which looks identical to "no matches" if you only
read output), and a `sed` mutation silently failed because its anchor spanned a line wrap -- the gate
then read GREEN and proved nothing. Both were caught by checking that the mutation was actually
PRESENT before trusting the result. A mutation you did not verify landed is not a test.

Zero metered spend.

## Review gate

One from-scratch UNPRIMED reviewer, no history and no diff. **Verdict: NEEDS WORK -- directed at the
INSTRUMENT, not at the shipped text.** Its own words on the text: all nine cases correct and
tier-consistent, "No case reaches its owner only via a handoff", no live single-axis violation on the
routing axis, all three descriptions within cap, pure ASCII, zero email tokens, numbering with no
gaps and every step cross-reference resolving.

It then found **7 gate evasions**, each proven by mutating a tracked file, running the gate, and
restoring with a checksum. **Three are closed above.** Four remain open and are NOT closed here --
they are gate DESIGN changes, and this repo's own record is that consecutive hand-patching rounds
each introduce a fresh instance of the class they repair. They are itemized in
`260804-hwy-deferred-items.md` for an owner decision rather than absorbed.

## Still required

**`/reload-plugins`** -- three shipped `SKILL.md` files changed. Committed is not live.

**All three description edits ride the already-owed EVL-01 Round B.** They landed BEFORE it, so they
cost no additional metered round. Any further description edit must also land before Round B.
`lz-refactor` now has only **41 chars** of headroom, so there is very little room left for one.
