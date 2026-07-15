---
slug: groupby-loop-recall
completed: 2026-07-15
mode: quick --full
status: complete
outcome: null-delta (blind spot NOT resolved; catalog edit correct but marginal)
spend_usd: 1.61
---

# Quick Task SUMMARY: reduce->Map group-by recall in lz-refactor

## What was done

Enhanced the EXISTING refactoring route (no new leaf, per the user-selected scope) to name the
reduce-into-Map group-by case explicitly, then re-ran the Phase-14 cr-rlu eval against the edited
catalog to measure whether T4 recall improved.

Prose-only additions (no new code fence; mirrored `Recognize by:` / `Use when:` / `Correspondence:`
selector lines left byte-unchanged):

1. `references/smells/loops.md` -- a `reduce`/accumulator that buckets items into a Map/object under a key is the Loops smell wearing a functional coat (a group-by).
2. `references/fowler-catalog/replace-loop-with-pipeline.md` -- grouping named as a common instance; native `Map.groupBy`/`Object.groupBy` noted as runtime-dependent equivalents.
3. `references/functional-catalog/transducers.md` -- a single group-by fold is NOT a transducer; prefer the plain grouping pipeline.

Commit: `docs(lz-refactor): name reduce->Map group-by on the existing Loops route`.

## Gates (all green)

- `npm run check` exit 0 (smells 24/24, functional 19/19, catalog 62/62, crossrefs 716, hygiene ASCII + work-email + no-verbatim clean).
- `npm run typecheck` exit 0 (251 modules tsc --strict clean; no new fence added).
- `claude plugin validate .` passed.
- Unbiased from-scratch reviewer: PASS (one optional superlative softened; applied).
- Public-repo hygiene: 3 edited files ASCII-clean, zero email tokens, committer = approved gmail.

## Metered eval (user-approved; D-12 build-then-halt honored)

Re-ran cr-rlu invoke_skill k=3 (indices 4-6, fresh -- baseline run-1..3 preserved), byte-identical
Phase-14 config (recommend, --synthetic-base, claude-opus-4-8 @ high, --setting-sources project).
Spend: $1.61 (run-4 $0.75, run-5 $0.41, run-6 $0.45). All exit 0.

### Result: NULL delta -- the blind spot was NOT resolved

| Target | Baseline (run-1..3) | Post-edit (run-4..6) |
|--------|---------------------|----------------------|
| T3 `findTransitiveExternalDependencies` (for-loop -> Replace Loop with Pipeline) | caught | **3/3 caught** |
| T4 `groupImports` (reduce->Map group-by) | missed 3/3 | **missed 3/3** |

- run-4 READ `groupImports` and explicitly parked it under "What I would not touch -- reasonable as-is."
- run-5 did not mention `groupImports` (caught T3, using the Loops recognize-by cue near-verbatim).
- run-6 touched `groupImports` only for a `{ member; importPath }` type-shape angle, not the group-by.

`groupImports` is a genuine group-by implemented as an O(n^2) `reduce` with `acc.find` + nested
conditional mutation (nx `runtime-lint-utils.ts:471-493`) -- a real, fair refactoring target, so the
miss is genuine, not a defensible pass.

### Root cause (why the edit did not move recall)

The model's Loops lens is anchored on explicit `for`/index loops -- all three runs described T3 as
"C-style index for loops" and caught it every time. A `.reduce()` doing grouping does not trip that
lens even though the catalog edit now explicitly says "a reduce ... is the same smell wearing a
functional coat." The prose did not override the model's for-loop-anchored perception. This confirms
the milestone's established finding: the blind spot is a model recall/judgment ceiling, not a
catalog-content gap. See [[lz-refactor-output-warrant-axis-exhausted]].

## Disposition of the catalog edit

KEPT. The edit is independently correct (names a real idiom on its true route), reviewer-PASSED, and
gate-green -- it improves catalog explicitness. But it did NOT achieve the stated goal (resolve the
blind spot); its realized value is marginal documentation, not a recall fix. Reverting is a valid
alternative if the milestone-complete tree should stay minimal -- user's call.

## Notes

- Trigger signal noise: the persisted `meta.json.skills_invoked` was empty ([none]) for all 3 runs,
  while the runner's live banner reported "used: lz-refactor" on run-5/6. The invoke_skill arm
  prepends `/lz-tdd:lz-refactor` and all 3 answers are catalog-shaped, so this is a stale/unreliable
  meta signal, not a skill-load failure.
- For the edit to be live in an INTERACTIVE session, run `/reload-plugins` (the eval subprocess read
  it from disk via `--plugin-dir`, so the measurement above already reflects the edit).
