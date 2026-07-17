# Reference-catalog eval -- results (2026-07-14, quick 260714-nxp)

Does the curated, oracle-verified lz-refactor catalog give a RECALL edge over base Opus 4.8 on
on-demand explain/look-up questions? Clean-core probe: invoke_skill (catalog via `--plugin-dir`) vs
no_skill (base), recommend mode, k=3, deterministic per-fact grading. cwd = catalog-free kata dir (base
cannot read the catalog off disk). 60 runs, all exit 0.

## Verdict: essentially NULL, with ONE genuine niche edge (q1)

**Discriminating: 1/8 positive; mean delta +0.13; the only positive is q1 (+1.00).**

| Q | fact class | no_skill | invoke_skill | delta | note |
|---|---|---|---|---|---|
| q1 | Kerievsky Directions dual/Away placement (Move Accumulation to Visitor -> away from Iterator) | 0.00 | 1.00 | **+1.00** | GENUINE edge (verified) |
| q6 | Primitive Obsession = both catalogs | 1.00 | 1.00 | +0.00 | parity (base knows) |
| q7 | Introduce Null Object -> Introduce Special Case | 1.00 | 1.00 | +0.00 | parity |
| q8 | Add/Remove Param -> Change Function Declaration | 1.00 | 1.00 | +0.00 | parity |
| q9 | Return Modified Value is web-only (not in print) | 1.00 | 1.00 | +0.00 | parity |
| q10 | no Extract Interface in Fowler 2nd ed | 0.00 | 0.00 | +0.00 | parity -- GRADER FALSE-FAIL (both answers correct; anyOf missed "does not contain a refactoring named ...") -- delta unaffected |
| q11 | Consolidate Duplicate Conditional Fragments -> Slide Statements | 1.00 | 1.00 | +0.00 | parity |
| q12 | Indecent Exposure = Kerievsky-unique smell | 1.00 | 1.00 | +0.00 | parity |
| qc1 | control (Extract Function) | 1.00 | 1.00 | +0.00 | saturated, expected |
| qc2 | control (Strategy) | 1.00 | 1.00 | +0.00 | saturated, expected |

Excluded from the clean core by the SKILL.md-echo audit (their graded tokens appear in the SKILL.md body,
so invoke_skill would answer from the injected preamble, not the catalog): q3 (Inline Singleton), q5
(Combinatorial Explosion). q2 (saturated) and q4 (SKILL.md echo) dropped in the review-fix pass.

## The one edge is real (verified from answers)
q1 invoke_skill (1.00): names BOTH Visitor and Iterator, sourced to the catalog's Directions row +
Motivation (and even flags the catalog's own Direction-column tension). q1 no_skill (0.00): "Visitor --
and only Visitor ... I'm confident the entry relates to Visitor alone" -- base is CONFIDENTLY WRONG. So
the catalog supplies a real Kerievsky inside-front-cover table fact (dual/Away placement) that base
misremembers. This is exactly the TIER-1 fact class the research predicted, and the only place the edge
materialized.

## Verbosity guard
invoke_skill median 1548.5 chars vs no_skill 1256 (+23%). Mildly more verbose, but the single edge (q1)
is a specific CORRECT fact base got wrong -- not a verbosity/token-naming artifact (base was confident and
concise, just wrong). The 7 parity questions and 2 saturated controls confirm the +23% length does not buy
correctness anywhere except q1.

## Interpretation (matches both reviewers' predicted ceiling)
Base Opus 4.8 already recalls the classic Fowler/Kerievsky/GoF literature (6/8 discriminating + both
controls saturated at 1.00; q10 both-correct). The curated catalog's realizable recall edge is
CONCENTRATED in the oracle-settled Kerievsky Refactoring-Directions dual/Away placements -- the one class
base confidently misremembers. That is a real, defensible edge but NARROW and low-utility for the TDD
refactor-coaching use case (a developer rarely needs "which pattern does Move Accumulation to Visitor move
away from" mid-refactor).

## Conclusion -- reference lever closed
The reference use case does NOT change the skill's value story. Consistent with the whole
skill-improvement loop: base Opus is catalog-grade; the skill's realizable value is AUTO-TRIGGER (proven)
plus a NARROW reference edge on oracle-settled Kerievsky direction-table facts (1/8 here). Output-gating
and general reference recall are null/parity. No further tuning warranted.

Known grader limitation (not re-run): q10 anyOf under-matches "does not contain a refactoring named X";
it false-fails both arms symmetrically, so the delta is correct (+0.00). Left as-is -- fixing it would
change 0.00/0.00 to 1.00/1.00 (still parity) at additional metered cost for no verdict change.
