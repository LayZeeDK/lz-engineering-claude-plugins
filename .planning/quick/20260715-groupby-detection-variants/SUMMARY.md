---
slug: groupby-detection-variants
completed: 2026-07-15
mode: quick --full --research --auto
status: complete
outcome: null (variant reverted)
spend_usd: 1.33
---

# Quick Task SUMMARY: research-informed variant for the groupImports blind spot

## Goal

Second, deeper attempt at the T4 `groupImports` (reduce->Map group-by) blind spot the coach missed
3/3 in `groupby-loop-recall`. This time: research the mechanism, try a research-ranked variant, eval
on T3 + T4. Decisions --auto-locked per user directive.

## Research (RESEARCH.md)

Key finding: the prior task's edit was DEAD WEIGHT because it changed leaf bodies but left the GATE
CUE (`smells.md:64`, which coach step 2 scans FIRST to decide whether to open the leaf) byte-unchanged.
"an explicit loop whose real intent (filter, map, sum) is buried" anchors on for/while and excludes a
`.reduce()` group-by. The gate cue was the untested, highest-leverage lever. Also established: the
recognize-by mirror is NOT byte-enforced by check-smells, so editing the gate cue is low-risk; and the
recognition ceiling is ~2/3 because one prior run was a JUDGMENT miss ("reasonable as-is"), not a
recognition miss -- so no recognition edit can reach 3/3.

## Variant tried (A+B, --auto-locked, reviewer PASS)

- A (gate cue, both mirrored files): "an explicit loop whose real intent (filter, map, sum) is buried
  in bookkeeping" -> "a loop, or a reduce or accumulator that buckets items into a Map or object under
  a key, whose real intent (filter, map, sum, group-by) is buried in bookkeeping".
- B (loops leaf): added the O(n^2) `acc.find`-in-reduce cost so step-4 sees a real "removes".

Gates: check battery + typecheck + validate green; ASCII + email-clean; unbiased reviewer PASS (no T3
regression risk, no benign-reduce false-positive; one accuracy fix "is"->"can be quadratic" applied).

## Eval (user-approved; D-12 command shown inline)

cr-rlu invoke_skill k=3, fresh indices 7-9, byte-identical Phase-14 config. Spend $1.33. All exit 0.

### Result: NULL -- pass bar NOT met

| Target | Pre (run-1..3) | Prior leaf edit (run-4..6) | Gate-cue variant (run-7..9) |
|--------|----------------|----------------------------|------------------------------|
| T3 `findTransitiveExternalDependencies` | caught | 3/3 | **3/3** (no regression) |
| T4 `groupImports` reduce->Map group-by | missed 3/3 | missed 3/3 | **missed 3/3** (0 mentions) |

Pass bar was T4 >= 2/3 AND T3 3/3. T4 = 0/3 -> FAIL. Worse than the prior edit: run-7..9 did not mention
`groupImports` at ALL (the prior run-4 at least named it to dismiss it). Moving the cue to the gate
position -- the highest-leverage lever research identified -- did not move recall.

### Interpretation

Definitive: the blind spot is a model recall/judgment ceiling, not a catalog-detection gap. The coach
reliably flags T3 and several other real smells in the same file (hasTag dup, packageExists conditional,
lying return types, matchImportWithWildcard) but does not perceive `groupImports`' reduce as a
refactoring target regardless of how the catalog names the group-by case. Catalog edits cannot close it.
Reinforces the milestone's triple-closed null-skill-delta finding. See [[lz-refactor-output-warrant-axis-exhausted]].

## Disposition (--auto-locked: revert if null)

REVERTED variant A+B (`git checkout HEAD~1 -- smells.md smells/loops.md`); gate cue back to the narrow
form; check battery green. The experiment's PLAN.md + RESEARCH.md + the 3 run artifacts are kept as the
record.

NOTE for the user: the gate-cue broadening (variant A) was reviewer-PASSED and is defensible as a
taxonomy-completeness improvement independent of eval recall (a reduce group-by genuinely is a Loops
smell). It was reverted only to honor the pre-locked "revert if null" bar and keep the complete-milestone
tree minimal. If you value the broader cue on its own merit, it can be re-applied deliberately -- it is
one Edit and carries no T3-regression / false-positive risk per the review.

## Recommendation

Stop attacking this blind spot via the skill. Two metered experiments ($1.61 + $1.33 = $2.94) confirm
it is a model ceiling. Any further attempt should target the model/prompt layer (e.g. an explicit
"scan every reduce/forEach for a hidden group-by" instruction in the RUN prompt), not the shipped
catalog -- and only if the user specifically wants to keep probing.
