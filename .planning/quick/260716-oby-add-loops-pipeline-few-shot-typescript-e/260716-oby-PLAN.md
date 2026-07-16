---
quick_id: 260716-oby
slug: add-loops-pipeline-few-shot-typescript-e
description: Add multiple Loops/pipeline few-shot TypeScript before/after examples to lz-refactor to aid pattern/smell/refactoring recognition
date: 2026-07-16
mode: full --research --auto
status: in-progress
review_status: PENDING (mandatory subagent review not yet done -- both reviewers died on session/API limit)
must_haves:
  truths:
    - Multiple before/after TS few-shot pairs cover the loop shapes the model misses (group-by into Map, union into Set/flatMap, classify into Set), each naming its accumulator trigger cue.
    - Examples live in the catalog leaf (progressive disclosure); SKILL.md stays a lean router.
    - Every TS fence type-checks under tsc --strict; catalog + hygiene gates stay green.
    - Change is accepted + committed ONLY after subagent review passes (>=2, >=1 unbiased).
  artifacts:
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-loop-with-pipeline.md
  key_links:
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/replace-loop-with-pipeline.md
    - .planning/quick/260716-oby-add-loops-pipeline-few-shot-typescript-e/260716-oby-RESEARCH.md
---

# Quick Task 260716-oby: Loops/pipeline few-shot TypeScript examples

## Goal

The skill's stated value proposition is intentional TypeScript examples. Prior evals showed the model
fails to RECOGNIZE certain accumulation-loop shapes as pipeline candidates. Add multiple few-shot
before/after TS pairs so those shapes are recognizable. Distinct lever from the just-nulled
drive-to-fixpoint instruction edit (260716-lq9): that changed the drive instruction; this targets
recognition via input-distribution examples.

## Research (done -- 260716-oby-RESEARCH.md)

Few-shot IS a genuinely different lever than the prose-cue edits already nulled: rules supply the label
space (model knows "pipeline"), examples supply the input distribution (mapping THESE surface forms into
that category); the miss is an input-distribution/recognition failure examples can address and prose
cannot (Min et al.). Design to maximize the mechanism: cover multiple surface disguises of the missed
shapes, minimal contrast, explicitly NAME the trigger cue (accumulator fed inside the loop:
push / map.set(key,...) / set.add(...) / total+=). HONEST: support is indirect, no study tests this
exact setup; if the ceiling is inference-time salience (skill content not adjacent to target code) more
content will not move it. Worth exactly ONE eval; if null, conclude recognition-at-inference and STOP
editing skill content.

## Change applied (uncommitted at pause; REVIEW PENDING)

`references/fowler-catalog/replace-loop-with-pipeline.md` `## Example` section expanded from 1 to 5
labeled before/after pairs, plus a lead-in naming the accumulator trigger cue:
1. Filter, then collect a field (filter + map) -- the existing pair, kept.
2. Sum with an accumulator (reduce).
3. Bucket items under a key / group-by (loop-into-Map -> reduce-fold, "reads as group these by X").
4. Union nested collections into a set (for+re-new-Set -> flatMap into Set) -- the getTypesOfSchema shape.
5. Classify each element into a set (for+switch -> map(classifier) + filter(type-guard)) -- the enum shape.
Placement = catalog leaf (opened when the coach routes a Loops smell), NOT inlined into the lean SKILL.md
router (progressive disclosure). Heading kept `## Example` singular (check-catalog regex needs it).

## Gates (GREEN at pause)

- npm run typecheck: 259 modules tsc --strict --noEmit clean (8 new fences compile).
- npm run check: exit 0 -- FWL-01 62/62, cross-refs 716 links, hygiene (ASCII + work-email + no-verbatim) GREEN.
- Manual hygiene scan: no non-ASCII, no non-gmail email tokens in the edit + task dir.

## Remaining (gated)

- [ ] T-review: mandatory subagent review of the skill-content edit (>=2 reviewers, >=1 unbiased
      from-scratch): behavior-preservation of each before->after, tsc-clean sanity, Fowler fidelity
      (esp. the group-by reduce illustration + the "never [...acc,x] in reduce = quadratic" warning is
      not violated), DST-04 originality, recognition value + label accuracy, ASCII/email hygiene.
      BOTH reviewers died on the 2026-07-16 session limit -- re-run on resume.
- [ ] T-accept: apply any review fixes; only then treat the edit as accepted.
- [ ] T-commit: commit on documentation/teaching merit (the examples have value independent of the eval)
      + update STATE quick-tasks table.
- [ ] T-reload (if kept): user runs /reload-plugins (Claude cannot; committed != live).
- [ ] T-eval (OPTIONAL, gated): held-out recognition validation eval = metered claude -p spend -- needs
      EXPLICIT user approval (eval-run-approval-gate). Expected likely-null per research; the examples
      ship on merit regardless. If run and null, record + stop editing skill content for recognition.

## Decisions

- Placement in the catalog leaf, not SKILL.md (keep the router lean; per progressive disclosure).
- Ship on teaching merit even if the recognition eval is null (TS examples are the skill's value prop);
  the eval is optional confirmation, gated on approval, not a ship blocker.
- Kept to 5 distinct-shape pairs (no extra disguise variants yet) to avoid bloat; expand only if a
  partial eval signal warrants it.
