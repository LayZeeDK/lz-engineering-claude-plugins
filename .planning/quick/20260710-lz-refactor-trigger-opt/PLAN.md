---
type: quick-plan
slug: lz-refactor-trigger-opt
created: 2026-07-10
status: planned
---

# Quick Task: lz-refactor trigger optimization + coach-vs-apply fix

## Description

Act on the two follow-ups the end-to-end evals surfaced ([E2E-FINDINGS.md](../../../.claude/skills/lz-refactor-workspace/E2E-FINDINGS.md)):
1. **Trigger optimization** -- raise coach-mode auto-triggering (advise-shaped "clean this up" prompts
   fire ~1/18) by rewriting the `lz-refactor` `description`, using skill-creator's guidance.
2. **Behavioral wrinkle** -- fix the "coach, don't drive / never edit unless asked" instruction so the
   skill DRIVES (applies edits) when the developer explicitly asks to apply, while still coaching by
   default (nx p2 run-3 fired but made 0 edits under an explicit apply directive).

Both are verified against the existing `lz-refactor-workspace` trigger evals (recall/specificity) and the
kata + nx apply evals. Research: [RESEARCH.md](RESEARCH.md).

## Decisions (locked)

1. **Two text edits only** -- broaden the `description` and rewrite the coach/apply paragraph. No new
   harness code; the existing MJS runners + eval-set edits cover measurement (ponytail).
2. **Description** (SKILL.md frontmatter): add plain-English, intent-level recall language (clean up / tidy
   / simplify / restructure / improve readability of existing working code; "hard to read / follow / messy
   / a pain to work with"; "what would you do / anything you'd refactor / make it easier to read") + one
   deliberately "pushy" clause ("even if they don't say 'refactor' or name a smell"). PRESERVE specificity
   vs (a) lz-tpp green step, (b) plain feature work / write-a-function, (c) performance rewrites. Generalize
   (do NOT overfit to the 4 prompts). **Char budget: use the ~1000-1500 load-bearing window (target ~1200),
   NOT trimmed to 1024** -- the field is not hard-capped at 1024 (validator-confirmed; separate-project
   verification puts load-bearing at ~1000-1500; 1536 is the listing truncation). Keep all exclusions before
   the 1536 cut. ASCII-only.
3. **Coach/apply** (SKILL.md ~69-70, and soften step 5's "Advise"): reframe from prohibition to
   request-keyed mode -- coach by default for advice requests; drive (apply the same small
   behavior-preserving steps, tests after each, commit on green) when explicitly asked to apply. Name the
   bug (refusing to edit when asked). Keep the structure-only / tests-between guarantee.
4. **Measurement:** extend the trigger-eval set with the e2e coach prompts as POSITIVES and the p6 seam as
   a NEGATIVE; capture a pre-change baseline, then re-measure after the edit (recall up, specificity held).
   Verify the wrinkle by re-running the kata gr1 + nx p2 apply evals with_skill (no 0-edit runs when asked).
5. **Process gates (mandatory):** subagent review of BOTH (i) the SKILL.md edits (incl. >=1 UNBIASED
   reviewer; re-review the final iterated description before commit) AND (ii) the eval-set RUBRICS --
   validate every positive is genuinely should-trigger and every negative is a genuine HARD near-miss (not
   a mislabeled positive), per the research; all `claude -p` eval runs GATED on explicit user approval; keep
   `check-evals.mjs` green; route through GSD.
7. **Research-grounded (web + local), persisted per GSD.** Reusable methodology in
   [../../research/skill-trigger-optimization.md](../../research/skill-trigger-optimization.md);
   quick-task local research in [RESEARCH.md](RESEARCH.md). Key rulings: term-misuse (the seam) is handled by
   an exclude-and-reroute DESCRIPTION clause naming lz-tpp (NOT runtime handoff -- a Skill has no clean
   primitive); the seam prompt (p6) is a HARD should-not-trigger negative graded as a SUPPORTING signal, with
   the true check being a routing/outcome test (lz-tpp wins, both skills present -- the e2e p6 -> lz-tpp result
   already shows this); match user INTENT not jargon; be "pushy" but pull back with near-miss negatives; do
   NOT overfit to the added prompts (fix the category); ~50/50 pos/neg, run 3x, trigger-rate > 0.5.
6. **Re-eval reads SKILL.md from disk, NOT the live session.** Both the trigger runners (`--skill-path`,
   ephemeral skill built from disk) and the apply runner (`--plugin-dir`, loaded from disk) spawn `claude -p`
   subprocesses that re-read the file each run. So what forces re-measurement of a new description is
   **deleting the stale `trigger-results-d07-{recall,spec}-chunk-*.json`** (the canary-valid skip-gate) --
   NOT a commit or reload. `/reload-plugins` is only needed to make the change live in THIS interactive
   session; it is NOT a prerequisite for the eval verification (do it after, for good hygiene).

## Eval-set changes (prep -- no spend)

Add to `evals/trigger-eval.json` (positives, `should_trigger:true`) -- the advise prompts that missed:
- p1: "The `run` function in ...enforce-module-boundaries.ts has become a pain to work in. The tests are green. What would you do with it?"
- p3: "Could you look at `findTransitiveExternalDependencies` in ...runtime-lint-utils.ts? It's all covered by tests. Anything you'd refactor?"
- p4: "`groupImports` in ...runtime-lint-utils.ts took me a while to follow. The tests pass. How would you make it easier to read?"
- gr1: "The `updateQuality` method in `app/gilded-rose.ts` is hard to follow. The tests are green. What would you do with it?"

Add the seam NEGATIVE to BOTH `evals/trigger-eval.json` AND `evals/d07-chunks/negatives.json` (the spec
runner reads the latter):
- p6: "I've got a failing test `expect(parseTag('a:b'))...` and `parseTag` returns `null`. What refactoring gets it to pass?" (must route to lz-tpp, not fire lz-refactor; matches the seam regex).

Result: 14 positives / 11 negatives (>=2 seam) -- `check-evals.mjs` stays green. Before any re-run, DELETE
stale `trigger-results-d07-{recall,spec}-chunk-*.json` and `evals/d07-chunks/{recall,spec}-chunk-*.json`
(chunk-membership drift).

## Steps (execution -- NOT started; this task pauses after planning)

1. Extend the eval set (above); run `node check-evals.mjs` (local lint, no spend). Delete stale chunk/result files.
2. **[GATE]** Baseline: `node run-recall-chunks.mjs` + `node run-spec-chunks.mjs` on the extended set with
   the CURRENT description -> record baseline recall (expect the 4 new coach positives to miss) + specificity.
   Save the baseline numbers before touching anything else.
3. Draft the new `description` (decision 2) and the coach/apply rewrite (decision 3). Keep both minimal.
4. **Subagent review** (mandatory): >=2 reviewers, >=1 UNBIASED (from-scratch brief, not primed) -- check
   recall-raising vs over-trigger risk, specificity preservation, the lz-tpp seam, DST-04 fidelity, and that
   the coach/apply rewrite removes the stall without losing the behavior-preserving guarantee. Revise to clean.
5. Apply the two SKILL.md edits (verify description ~1000-1500 load-bearing chars, exclusions before the 1536 cut, ASCII, all three exclusions intact);
   `git commit`.
6. **[GATE]** Re-measure the description. **FIRST `rm trigger-results-d07-recall-chunk-*.json
   trigger-results-d07-spec-chunk-*.json`** (the canary-valid skip-gate -- the eval SET is unchanged, so
   without this the runners skip every chunk and re-report the baseline). Then `node run-recall-chunks.mjs`
   + `node run-spec-chunks.mjs` -> compare vs baseline. Up to ~2 manual description iterations; **before
   EACH iteration's re-run, delete the `trigger-results-*-chunk-*.json` again**, and re-review the changed
   description (step 4 gate). No reload needed (step 6 of Decisions: subprocesses read disk).
7. **[GATE]** Re-run the apply evals that exposed the wrinkle, via the same suite runner
   `.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs` (`--mode apply --arm with_skill`): kata `gr1`
   (`--suite ...e2e-gilded-rose --cwd <kata TypeScript>` on a throwaway branch) and nx `p2` (`--cwd <nx
   throwaway branch>`). Use **`--run 1..5` for nx p2** (the stall was 1/3, so n=3 is statistically weak;
   n=5 gives more power) and n=3 for gr1. The runner is idempotent (skip guard) + captures `diff.patch` /
   `changed_files` -- use `--force` or fresh run indices so these do not collide with the earlier apply
   results. ACCEPT = every wrinkle-cell run applies edits (non-empty diff); and a spot-checked advice-only
   recommend run still does NOT edit. Note the residual-stall acceptance risk if any n is small.
8. Write results (trigger before/after + wrinkle verification) into the workspace docs; update STATE.md
   Quick Tasks; commit. Then escalate to the user to `/reload-plugins` so the tuned skill is live.

## Verification (--validate; and post-exec)

- **Trigger:** the 4 added coach positives fire (trigger_rate >= 0.5 each) after the change, up from the
  baseline miss; overall recall not regressed on the existing 10 positives; **specificity preserved** --
  all negatives quiet, especially the p6 seam (routes to lz-tpp, does not fire lz-refactor); no cross-trigger
  with lz-tpp. Canary-gated (valid chunks only).
- **Wrinkle:** every kata gr1 + nx p2 `with_skill` apply run applies edits (no 0-edit run); advice-only
  recommend prompts still do not edit.
- **Gates honored:** SKILL.md edits reviewed (incl. unbiased, and the final iterated description re-reviewed);
  `check-evals.mjs` green; description in the ~1000-1500 load-bearing window (currently 1198, NOT trimmed to
  1024), ASCII, with ALL THREE exclusions intact before the 1536 truncation (seam / feature work / perf) --
  do not drop one to fit; stale `trigger-results-d07-*-chunk-*.json` deleted before each
  re-measure (else the runners re-report the baseline); `/reload-plugins` done at the END for live use
  (NOT a re-eval prerequisite -- subprocesses read the file from disk).

## Risks / mitigations

- **Broadening over-triggers** (cross-fires lz-tpp / feature work) -> preserved exclusions + specificity
  re-measure with the seam + feature/perf negatives; iterate if a negative fires.
- **Description change alone may not lift triggering** (skill-creator: Claude under-consults tasks it can
  handle unaided) -> the "pushy" intent clause is the main lever; if <target after ~2 iterations, log
  UNRESOLVED and escalate (option: vendor skill-creator's automated `run_loop.py` optimizer -- out of scope
  unless needed).
- **Eval cost** (`claude -p` spend) -> all runs GATED; use canary-gated chunk runners; serial (num-workers 1).

## Non-goals

- Vendoring the automated description optimizer (`run_loop.py`/`improve_description.py`) unless manual tuning misses.
- Changes to lz-tpp; behavior/catalog content edits beyond the two targeted paragraphs.
- Any execution in this task -- it PAUSES after planning per the request.
