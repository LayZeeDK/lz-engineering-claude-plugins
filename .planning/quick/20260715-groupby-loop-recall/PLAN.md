---
slug: groupby-loop-recall
created: 2026-07-15
mode: quick --full
status: complete
---

# Quick Task: Improve reduce->Map group-by recall in lz-refactor

## Problem

Phase 14 found a blind spot shared by lz-refactor, code_review, AND base Opus: the T4
`groupImports` case (`runtime-lint-utils.ts`, a `reduce` with nested conditional mutation whose
real intent is a Map-based group-by) was missed in every cr-rlu run.

## Finding (drove the approach)

The transform is ALREADY routed in the shipped catalog, just not by the literal name "group-by":
Loops smell (`smells/loops.md`) -> Replace Loop with Pipeline (`fowler-catalog/`) -> transducers
(`functional-catalog/`, the FP alternative). It is a recall gap, not a catalog gap. A standalone
group-by leaf would duplicate transducers and violate the catalog's leaf-vs-note rule.

## Approach (user-selected: "enhance existing route")

Name the reduce-into-Map group-by case EXPLICITLY in the three files already on the route, prose-only
(no new leaf, no new code fence -> no tsc-strict extractor risk, no mirrored-selector breakage):

1. `references/smells/loops.md` -- add the reduce-building-a-Map (group-by) instance to the recognize body.
2. `references/fowler-catalog/replace-loop-with-pipeline.md` -- name the group-by instance in the motivation.
3. `references/functional-catalog/transducers.md` -- note the Map-based group-by belongs to the same family.

Leave `Recognize by:` / `Use when:` / `Correspondence:` selector lines untouched (checker-mirrored).

## Gates

- Check battery green: `cd .claude/skills/lz-refactor-workspace && npm run check` + `npm run typecheck` + `claude plugin validate .`
- Public-repo hygiene: ASCII-only + allowlist-inversion email scan.
- skill-reviewer subagent review (mandatory for skill-file edits).
- Then user /reload-plugins.
- Metered (user-approved): re-run cr-rlu invoke_skill k=3, re-grade T4 recall vs the Phase-14 baseline (lift mean 7.33, T4 missed 3/3).

## Out of scope

No new catalog leaf. No change to any other phase artifact. Expectation set: per the milestone's
null-skill-delta finding, this may not move eval recall; the eval measures whether it does.
