---
quick_id: 260804-hbv
description: >-
  Close the Phase 22 description-completeness item -- give corpus case c1 a direct
  description-level owner by adding the post-green trigger to lz-refactor's folded
  description.
date: 2026-08-04
mode: quick
metered_spend: none
must_haves:
  truths:
    - "lz-refactor's folded `description` carries a POSITIVE trigger for the post-green moment, so
       corpus case c1 (\"I just finished making a test pass. What now?\") has a direct
       description-level owner instead of reaching lz-refactor only because lz-tpp lexically
       mis-loads on \"test pass\" and hands off."
    - "The clause echoes c1's own matchTokens vocabulary (`finished`, `test pass`, `what now`) so the
       trigger surface and the corpus agree."
    - "Every folded description stays within the 1536-char per-entry listing cap."
    - "No folded description keys on the D-03 test-state axis -- `keysOnTestState` returns 0 hits for
       all three skills, PROVEN discriminating by a positive control in the same run."
    - "lz-red's and lz-tpp's descriptions are BYTE-UNCHANGED. Only lz-refactor's is edited."
    - "No file outside plugins/lz-tdd/skills/lz-refactor/SKILL.md changes, apart from planning
       artifacts."
  artifacts:
    - plugins/lz-tdd/skills/lz-refactor/SKILL.md
  key_links:
    - .planning/phases/22-three-way-classifier-correctness-lz-refactor-lz-red/22-VERIFICATION.md
    - .planning/phases/22-three-way-classifier-correctness-lz-refactor-lz-red/22-ACCEPTANCE-REVIEW.md
    - .claude/skills/lz-red-workspace/tools/rgr-cases.json
    - .claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs
    - .claude/skills/lz-red-workspace/e2e-rgr-routing/RUN-GATE.md
---

# Quick Task 260804-hbv -- close the Phase 22 description-completeness item

## Why now, and why it is nearly free

Plan 22-08 already edited all three `description` fields, so the EVL-01 reciprocal trigger round
(Round B) is **already owed**. A further description edit that lands BEFORE that round costs no
additional metered round. The same edit landing AFTER it forces a second one. That timing, not the
severity of the item, is the whole reason this runs now.

`gsd-verifier` ruled this cluster **OMISSION, not contradiction**, so SC5 is not falsified and this
is explicitly NOT a phase gap. It is an optional improvement recorded in `22-VERIFICATION.md`
(lines 70-111) and in the superseding block of `22-ACCEPTANCE-REVIEW.md` (lines 28-38).

## The defect, stated precisely

`rgr-cases.json` case `c1` is the verbatim request `I just finished making a test pass. What now?`
with `expectedOwner: lz-refactor` and `matchTokens: ["finished", "test pass", "what now"]`. Its own
rationale reads: "Newly green and asking what comes next IS the refactor step's own trigger, so this
must fire a POSITIVE lz-refactor branch -- never a fallback."

Phase 22 added that positive branch to the **body** of all three routers. It never brought the
**frontmatter** level with it. The `description` is the only surface Claude Code's skill selector
reads before any body text loads, so today c1 reaches its owner only via `lz-tpp` lexically
mis-loading on "test pass" and then handing off. The routing gate cannot see this: it checks
descriptions for the char cap and the test-state axis only, never for routing content.

## Scope

### Task 1 -- add the post-green trigger to lz-refactor's description

**File:** `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (folded `description` block only)

**Action:** insert ONE sentence into the positive-trigger run, immediately after
`say the word refactor.` and before `It recommends the next named Fowler ...`, so all positive
triggers stay together and the exclusions stay at the tail. Re-wrap the affected lines to the file's
existing ~100-column discipline. Change nothing else in the block.

**Verify (by EXIT CODE, with a positive control on the same path):**

- `node <scratch>/measure-desc.mjs` -- reports each folded length, headroom, and
  `keysOnTestState` hits using the repo's OWN exported helpers, and FAILS LOUD (exit 1) if its
  positive control does not detect exactly 2 planted banned phrases. A zero-hit result is worthless
  without that control firing.
- `node .claude/skills/lz-red-workspace/tools/check-rgr-routing.mjs` -- exit 0.
- `npm --prefix .claude/skills/lz-red-workspace run check` -- exit 0.
- `node .claude/skills/lz-red-workspace/check-evals.mjs` -- exit 0.
- `claude plugin validate .` -- exit 0.
- `git diff --stat` shows exactly one non-planning file.

**Done when:** lz-refactor's folded description names the post-green moment as a positive trigger,
its length is <= 1536, banned hits are 0 with the control firing, and the full offline battery is
green.

## Explicitly OUT OF SCOPE -- do not edit

| Item | Ruling | Why not |
|------|--------|---------|
| Verification item 2 -- lz-red's "how to write or structure a unit test" overlapping a test-file-tidy ask | No edit | lz-red's description ALREADY carries the correct exclusion. This is cross-skill contention at trigger time, which is an SC2/EVL-01 concern Round B measures -- not a per-skill body/description mismatch. |
| Verification item 3 -- lz-refactor's description omits the test-file-tidy and untested-target carve-outs | No edit | "existing working code" is THIS PHASE'S OWN deliberately-chosen ask-keyed vocabulary and is not a `TEST_STATE_TOKENS` entry. Reading it as "tested code" would contradict the vocabulary decision applied everywhere else in the shipped tree. |
| The a-through-e router replicated in four/five files (Q-3) | No edit | The designed answer is variant C of the unrun D-08 placement A/B. Choosing it by hand pre-empts the measurement. |
| lz-red / lz-tpp descriptions | Byte-unchanged | Round B's baseline is per-sibling; widening the edit widens what the round has to explain. |

## Hard constraints

1. **Char cap 1536.** MEASURED at this HEAD, not carried from the handoff: lz-red **1422** (114
   headroom), lz-tpp **1000** (536), lz-refactor **1391** (145). The handoff's "lz-refactor 1369 /
   lz-tpp 840" figures are STALE -- the budget is 145 chars, not 167.
2. **Zero test-state framing.** The ban is a 17-phrase exact-match list in
   `routing-parse.mjs` (`TEST_STATE_TOKENS`), including `nothing failing yet`, `the bar is green`,
   `the suite is green`, `tests are green`, `already passing code` and `has a smell`. Note the
   existing exclusion `make a failing or red test pass` is PERMITTED -- it matches no listed phrase.
   The criterion is demonstrably discriminating (4 hits at the pre-edit commit, 0 at HEAD); keep it
   at 0.
3. **ASCII only.** No em dash, no curly quotes, no emoji. Use `--`.
4. **Public repo hygiene.** Maintainer gmail identity only; allowlist-inversion, never a forbidden
   needle.
5. **Zero metered spend.** No eval, no `claude -p`, no `run_eval`.

## Gates after the edit

- **MANDATORY unprimed subagent review.** This is a shipped `SKILL.md` edit, so the standing project
  rule applies: at least one from-scratch UNPRIMED reviewer, told nothing about what changed or why,
  must pass it before acceptance. The orchestrator must not self-certify this.
- **`/reload-plugins` is a HUMAN action** afterward to make the edit live in-session. Committed is
  not live.

## The trap to avoid, named because it fired four times last session

A negative check that reads clean while proving nothing. All four disguises: a wrapped-phrase grep
reading clean before any fix existed; `rg -E` exiting 2 with no output behind a `|| echo NONE`
fallback that reported absence; an `rg` piped into `sort` capturing `sort`'s exit code; and a
wrap-tolerant pattern whose `\s+` sat at the wrong word join. Every absence claim here must carry an
exit code AND a positive control on the same path.
