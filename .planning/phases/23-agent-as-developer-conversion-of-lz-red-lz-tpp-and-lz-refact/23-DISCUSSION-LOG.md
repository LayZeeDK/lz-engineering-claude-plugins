# Phase 23: Agent-as-developer conversion of lz-red, lz-tpp and lz-refactor - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-11-24
**Phase:** 23-agent-as-developer-conversion-of-lz-red-lz-tpp-and-lz-refactor
**Mode:** `--analyze --auto`. No question was put to Lars; Claude chose the recommended option in each area and
logged the trade-off. Lars can overturn any of them before planning.
**Areas discussed:** Default stance, Reference mode, Running tests, Naming line, Descriptions and routing, Evals and
checks, Folded todo

---

## Default stance

| Option | Pros | Cons | Selected |
|--------|------|------|----------|
| Do the step by default; advice only when explicitly asked | Matches Lars's ruling and all four ledgers (A1, 4/4); removes the need for "Command" wording | A human asking "what next?" gets an edit | X |
| Keep QUESTION/COMMAND split, flip only the tie | Smaller change | Ledgers show agents still phrase calls as questions; A1 stays half-fixed | |
| Do the step only when an agent (not a human) is the caller | Precise | The skill cannot tell who the caller is | |

**Choice:** [auto] do the step by default (D-01, D-02).

## Reference mode

| Option | Pros | Cons | Selected |
|--------|------|------|----------|
| Keep reference mode until 0.0.4 | Core value stays served; no gap | Explaining stays in the shipped skills a little longer | X |
| Remove now with coach mode | Cleaner bodies | Nothing explains TPP/smells until 0.0.4 ships | |

**Choice:** [auto] keep (D-03).

## Running tests

| Option | Pros | Cons | Selected |
|--------|------|------|----------|
| Narrowest proof per step (new test; then module tests; refactor before/after each step) | Proves each step; cheap | Full suite not run every step | X |
| Full suite every step | Strongest | Slow; field reports slow suites (B8) and Lars's wall-clock concern | |
| Leave to the caller | No new text | A1 again: steps finish unproven | |

**Choice:** [auto] narrowest proof per step (D-04).

## Naming line

| Option | Pros | Cons | Selected |
|--------|------|------|----------|
| Fixed-prefix last line per step | Grep-able for evals and a later cycle log; A2 measurable | Slightly rigid | X |
| Free prose that must mention the name | Natural | 2 of 10 named it in the field; not checkable | |

**Choice:** [auto] fixed prefix (D-05).

## Descriptions and routing

| Option | Pros | Cons | Selected |
|--------|------|------|----------|
| Minimal description edits, headings renamed with the parser updated | Removes "coach" framing; Phase 22 gate stays GREEN | Forces Round B to run after (already planned) | X |
| Body-only change, descriptions untouched | No trigger risk | Descriptions keep saying "coach", contradicting the bodies | |
| Rewrite descriptions with agent-work triggers (A4) | Fixes A4 too | Scope of 0.0.4; larger trigger risk | |

**Choice:** [auto] minimal edits (D-06, D-07, D-08).

## Evals and checks

| Option | Pros | Cons | Selected |
|--------|------|------|----------|
| Leave coach-era graders to Phase 24; keep deterministic checks GREEN | No throwaway work | Old graders expect old behaviour until then | X |
| Update the graders now | Old harness stays usable | Work Phase 24 deletes | |

**Choice:** [auto] leave them (D-09, D-10).

## Folded todo

Todo "Link the unreachable lz-refactor leaves, add Fowler Sources, fix the stale GoF line" matched at 0.6 and was
folded automatically (D-11).

---

## Claude's Discretion

Paragraph wording, plan split and wave order, step-5 loop audit wording.

## Deferred Ideas

A3-A5 and the audit/review/coach skills (999.1); the user-scope `test-first.md` workaround (Lars); grader port
(Phase 24).
