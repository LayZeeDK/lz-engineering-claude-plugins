# Quick Task 260801-sc9: RUN GATE

**Recorded:** 2026-08-01
**Status:** BUILD COMPLETE, HALTED AT THE METERED GATE. Steps 1 and 2 of D-12 are done and cost
nothing. Steps 3 and 4 are blocked, each on a different owner action.

## 1. What is built

Steps 1 and 2 of the D-12 ruling "distinguish, but prove it first", both zero-spend.

- **The treatment artifact** -- `.claude/skills/lz-red-workspace/treatment/test-double-taxonomy.md`,
  100 lines distilled from the remediated archive. Tracked (MEASURED: `git check-ignore` says NOT
  ignored) and outside `plugins/`, which is guard N3's only walk root, so N3 stays green and the
  shipped tree remains the no-artifact baseline arm by construction rather than by discipline.
  Discriminators were paraphrased blind per DST-04; every Gang of Four row was dropped rather than
  paraphrased again, that being this repo's worst near-verbatim offender class.
- **The build script** -- `.claude/skills/lz-red-workspace/treatment/build-treatment.mjs`. One
  command regenerates the whole treatment plugin tree from tracked inputs into
  `out/lz-tdd-treatment` (MEASURED gitignored, and `git status --porcelain out` is empty). It reports
  exactly two deltas against `plugins/lz-tdd` -- the added artifact and the edited `SKILL.md` -- over
  a 195-file tree, and prints that the source tree was read and never written.
- **The new arm** -- `invoke_treatment` in `run-e2e.mjs`, four additive edits. MEASURED by dry run:
  it composes `--plugin-dir <...>/out/lz-tdd-treatment` plus the forced `/lz-tdd:lz-red ` slash
  command, so its baseline is `invoke_skill` and the single isolated variable is the presence of the
  artifact in the plugin tree. `--arm all` still expands to exactly `with_skill, no_skill,
  invoke_skill` (MEASURED with a positive control, so a crashed fan-out cannot pass as an absence).

Fail-closed behaviour was OBSERVED, not asserted. The build script was run from a relocated repo root
with byte-identical bytes (`cmp` exit 0) against poisoned fixtures: a duplicated anchor exits 1, a
missing anchor exits 1, a manifest whose `name` is not `lz-tdd` exits 1, and the one-anchor control
exits 0. The destination guard is the one assertion NOT observed firing -- the destination is a
hardcoded constant, so its last two segments cannot drift without editing the script. It is
defence-in-depth against a future edit, and is recorded here as unexercised rather than as proven.

## 2. UNRESOLVED-1, the owner decision blocking step 3

Reproduced VERBATIM from `260801-sc9-CONTEXT.md`. Not summarised, not re-ranked, not resolved.

> ## UNRESOLVED-1 (BLOCKER) -- the ambiguous-prompt corpus and its target
>
> **NOT auto-locked. This is the `--auto` trap quadrant: HIGH impact, NOT-HIGH confidence.**
>
> D-12 requires "at least two genuinely ambiguous prompts". The supporting measurement the owner
> weighed is that **zero of the 59 prompts in lz-red's existing eval corpora are genuinely
> ambiguous** -- so no existing prompt or suite can carry this A/B, and the corpus must be authored
> new.
>
> Why confidence is NOT high:
>
> - There is no precedent for an "ambiguous prompt" in this instrument, and the RUN-GATE's 7-point
>   target qualification checklist does not contain the criterion. It is a new axis.
> - The measurement must turn on the model's test-double VOCABULARY/classification choice, while every
>   existing cell grades a produced test's RED correctness. These are different dependent variables,
>   and the existing D-06 gate does not score naming.
> - This project has just been burned by exactly this failure mode. RXL's mechanical verdict was
>   ruled DESIGN-CONFOUNDED because "the pass/fail split tracks WHICH INJECTION TOKEN the model
>   imagined, not RED discipline". An ambiguity corpus chosen carelessly reproduces that error with a
>   different variable.
>
> Competing options, none auto-lockable:
>
> - **(A) New dedicated suite** with a target where stub-vs-mock materially changes the correct test.
>   Cleanest measurement; highest authoring cost; needs a fresh target qualification.
> - **(B) New prompts against an existing target** (GRC / SRVC / RXF). Cheap; but those targets were
>   chosen to stress RED discipline, and none is known to make the double-kind choice load-bearing.
> - **(C) A non-apply judged probe** -- ambiguous prompt, grade the model's stated classification
>   rather than a produced test. Cheapest and most direct for a vocabulary question; but it is
>   coaching-prose grading, which D-02 moved this milestone AWAY from, and Phase 20 showed such
>   graders measure house vocabulary rather than substance.
>
> **Terminal action for this headless pass:** recorded here as UNRESOLVED. Steps 1-2 proceed and do
> not depend on it. Step 3 needs an owner decision; step 4 additionally needs metered approval.

ONE FACT ADDED, not visible when the three options were framed. Option A carries the crux 1 and 2
entry cost: the new suite must declare an apply preamble byte-identical to the other RED suites, every
prompt must name its target's pinned `test_dir`, the target must declare `prompt_forbidden_tokens` and
the prompt must name none of them, the prompt must make no test-state claim, and a poisoned variant
must be provably caught. Option A is not "a suite.json plus a prompt file".

## 3. The command, stated honestly

Two commands. The second is NOT runnable today -- `--suite` and `--prompt` are the two holes that
UNRESOLVED-1 fills, so this becomes single-command-ready only once the corpus exists.

```
node .claude/skills/lz-red-workspace/treatment/build-treatment.mjs

node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs \
  --suite <SUITE-DIR>        # HOLE: UNRESOLVED-1 (option A authors a new suite; B reuses one) \
  --mode apply \
  --cwd <THROWAWAY CHECKOUT> \
  --arm invoke_treatment \
  --prompt <PROMPT-ID>       # HOLE: UNRESOLVED-1 (the ambiguous prompts do not exist yet) \
  --runs <k>
```

The baseline is the SAME command with `--arm invoke_skill`. Those two arms compose identical prompts
and differ only in `--plugin-dir`, which is what isolates the artifact as the single variable. Add
`--dry-run` to inspect composition without spending; every dry run quoted in this document was free.

Note for whoever runs it: the dry-run banner line `plugin :` always prints `PLUGIN_DIR` regardless of
arm. That is pre-existing behaviour shared with the `code_review` arm and it is cosmetic -- read the
`argv:` line, which carries the arm's real `--plugin-dir`. It was left alone deliberately, because
crux 6 pins the nx `--arm all` dry-run output.

## 4. The grading warning

Carried forward so it is not rediscovered at spend time.

No existing grader scores a vocabulary or classification choice. `grade-red.mjs` classifies a produced
diff into the D-06 verdict classes and reads nothing about naming. The smallest honest addition is ONE
new `RUBRICS` scenario whose only scored dimension is a single `{judge}` item, plus its eval-set
entry: no new grader, no new merge path, no schema change.

DO NOT reach for the `{phraseSet}` matcher. For a vocabulary A/B the treatment IS the vocabulary, so a
phrase set scores the treatment arm high by construction and measures house vocabulary rather than
substance. That is the same defect class as the RXL DESIGN-CONFOUNDED verdict. The judge item is the
honest instrument; the phrase set is a confound wearing a determinism costume.

## 5. The two gates that remain, and who owns each

1. **The `oracle-reviewer` DST-04 gate on the distilled artifact -- RUN 2026-08-01, PARTIAL.**
   ORCHESTRATOR-driven, as predicted: the executor has no Agent tool. The distilled form is a NEW
   artifact for DST-04 purposes and did NOT inherit the archived source's four remediation rounds --
   the first pass proved that, returning `revise` with `too_close_to_source: true`.

   FIRST PASS found two spots reproducing source expression: the umbrella one-liner (it kept the
   source's verb and its real-thing contrast) and a clause about the transitional stand-in (the
   source's metaphor noun and clause shape, one verb swapped). Both are the standing near-verbatim
   trap for canonical one-line definitions. It also found four factual drifts and one internal
   contradiction.

   SECOND PASS, after revision: `too_close_to_source: false`; `dst04_clean_room`,
   `attribution_correctness` and `factual_fidelity` all `correct`. One self-consistency directive
   remained (a census bullet contradicting the revised text), applied and confirmed separately.

   STILL PARTIAL, and this is the live ship precondition: only the Meszaros and Fowler stores were
   supplied. The census and citation traps also attribute to Beck, Metz, 99 Bottles, Clean Code,
   Kerievsky, Cooper and Bernhardt. Those lines are UNGATED -- neither confirmed nor refuted -- and
   are disclosed as such in the artifact's own header. Re-gate them against their own stores before
   any ship decision.

   TWO OWNER-DECISION ITEMS raised by the reviewer, deliberately NOT silently changed in the draft
   because both are coach-scope judgement calls rather than fidelity defects:
   - The prepared-answer variation count reads as exhaustive; the source names further variations of
     that same pattern, one of which the draft now cites elsewhere. Decide whether the coach wants the
     full set or the two that carry the polarity lesson.
   - The `Mock Object` line frames failure only as a demanded call never arriving. The source also
     stresses failing at the first deviation, and a final-verification step the test must trigger.
     Decide whether that thinning is acceptable for a mid-cycle coach reference.
2. **A fresh spend approval for the metered A/B.** Required by the standing eval-run-approval-gate,
   which `--auto` cannot satisfy. A separate orchestrator-driven step. This task does not sit waiting
   on it: the build is complete and the task is closed at this gate.

Only after gate 2 returns a result does `FUT-TAXONOMY-SHARED` close -- as a ship on measured lift, or
as DECLINED on no lift. Both outcomes are pre-authorized, and DECLINED is a legitimate result rather
than a failure.
