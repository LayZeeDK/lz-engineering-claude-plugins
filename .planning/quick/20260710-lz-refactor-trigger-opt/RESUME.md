# RESUME runbook -- lz-refactor trigger-opt evals

Staged, resumable execution of the gated `claude -p` evals. Every runner is idempotent/canary-gated, so a
usage-limit hit mid-run is safe: re-invoke the SAME command and it resumes (skips valid/completed work).
Update the **CURRENT STEP** marker below as each phase completes.

## CURRENT STEP: 3 done (SKILL.md edited; pending final in-context review + commit). Next: Step 4 after-eval (GATED) + new Step 4b e2e ground-truth (GATED).

## KEY FINDING (2026-07-11): the isolated trigger-eval does NOT reproduce the e2e gap

Baseline recall = 12/13 = 92%, specificity = 11/11 = 100% -- the OLD description already triggers ~92% in
the ISOLATED probe harness (`--skill-path`, minimal session). The e2e coach-mode gap (1/18) is a
BUSY-SESSION / multi-skill-competition effect (`--plugin-dir` in the nx/kata repos, sibling lz-tpp, 25
tools), which the trigger-eval does not capture. So: (a) description headroom in the trigger-eval is small
(one miss: `groupImports`, the readability-only prompt, 0/3 -- fixed by the new READABILITY language); (b)
the MEANINGFUL test of the real gap is re-running the e2e coach prompts via `--plugin-dir` with the new
description -> **Step 4b** below.

## Invariants (do not violate -- they make resume safe)

- **Do NOT edit `plugins/lz-tdd/skills/lz-refactor/SKILL.md` until Step 1 baseline is COMPLETE and PRESERVED**
  (Step 2). The runners build the probe skill from that SKILL.md on disk, and result files use fixed names
  (`trigger-results-d07-{recall,spec}-chunk-N.json`) -- editing early would make a resumed baseline measure
  the new description and/or overwrite the baseline.
- **Before ANY re-measure of a changed description, delete `trigger-results-d07-{recall,spec}-chunk-*.json`**
  (the canary-valid skip-gate). The eval SET is unchanged between baseline and after, so without deleting,
  the runners skip every chunk and re-report the prior numbers.
- All runs: `--num-workers 1`, model opus-4-8, `PONYTAIL_DEFAULT_MODE=off` (baked into the runners). Use the
  chunk runners, never one big serial pass.

## Steps

**Step 1 -- BASELINE (current SKILL.md = OLD description).** Working dir: the workspace.
```
cd .claude/skills/lz-refactor-workspace
node run-recall-chunks.mjs      # resumable; re-run until all chunks VALID (canary fired)
node run-spec-chunks.mjs        # resumable
node run-recall-chunks.mjs --report ; node run-spec-chunks.mjs --report   # confirm all valid
```
Resume after a limit: just re-run the two `node run-*-chunks.mjs` commands; valid chunks skip.
DONE when every chunk reports VALID.

**Step 2 -- PRESERVE baseline (no spend).**
```
mkdir -p baseline
cp trigger-results-d07-recall-chunk-*.json trigger-results-d07-spec-chunk-*.json baseline/
```
Record the baseline recall/specificity numbers in this file under "Baseline results". Commit.

**Step 3 -- APPLY the reviewed edits to SKILL.md (no spend).** Apply Edit 1 (description) + Edit 2
(coach/apply + step 5) from `PROPOSED-EDITS.md`. Re-review the applied SKILL.md via subagent(s) incl. an
UNBIASED one (mandatory for skill-instruction edits). `git commit`.

**Step 4 -- AFTER re-measure (SKILL.md = NEW description).**
```
cd .claude/skills/lz-refactor-workspace
rm -f trigger-results-d07-recall-chunk-*.json trigger-results-d07-spec-chunk-*.json   # clear skip-gate
node run-recall-chunks.mjs ; node run-spec-chunks.mjs                                  # resumable
```
Resume after a limit: `rm` is only needed ONCE (the first time after the SKILL.md change); after that the
partial after-results are the resume state -- re-run WITHOUT deleting to continue. (If unsure whether the
on-disk results are baseline or after: baseline is preserved in `baseline/`, so working-dir results after
Step 4's rm are always "after".) Up to ~2 description iterations (edit -> re-review -> rm -> re-run).

**Step 5 -- WRINKLE apply-verify (needs throwaway branches; see e2e READMEs).**
```
# kata gr1 (throwaway branch in the kata; npm install already done):
node e2e-nx/run-e2e.mjs --suite e2e-gilded-rose --mode apply --arm with_skill --prompt gr1 --cwd <kata>/TypeScript --runs 3
# nx p2 (throwaway branch in nx; n=5 for statistical power):
node e2e-nx/run-e2e.mjs --mode apply --arm with_skill --prompt p2 --cwd <nx-branch> --run 1 --run 2 --run 3 --run 4 --run 5
```
Resumable via the run-e2e skip guard (completed runs skip). ACCEPT = every run applies edits (non-empty
diff); advice-only recommend prompt still does not edit.

**Step 6 -- Results + wrap.** Write before/after into the workspace docs; update STATE.md; commit.
`/reload-plugins` at the END so the tuned skill is live in the interactive session (NOT a re-eval prereq).

## Step 4b -- e2e GROUND-TRUTH trigger check (the real-gap test; GATED) -- FULL, fresh indices run-4/5/6

Re-run the e2e coach recommend prompts via `--plugin-dir` (busy session, new SKILL.md on disk) at run
indices 4/5/6 (run-1/2/3 = OLD desc, preserved for comparison). Compare with_skill auto-trigger rate to the
e2e baseline (nx coach 1/12, kata 0/6). Read-only (recommend), resumable via the skip guard.
```
R=.claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs
# nx coach p1-p4 (cwd defaults to nx @ 23.0.x, read-only):
node $R --mode recommend --arm with_skill --prompt p1 --prompt p2 --prompt p3 --prompt p4 --run 4 --run 5 --run 6
# kata gr1+gr2 (cwd defaults to the kata):
node $R --suite .claude/skills/lz-refactor-workspace/e2e-gilded-rose --mode recommend --arm with_skill --prompt gr1 --prompt gr2 --run 4 --run 5 --run 6
```
Resume after a limit: re-run the same command(s); completed runs skip. Compare run-1/2/3 (old) vs run-4/5/6
(new) `used_refactor` per prompt.

## Baseline results (Step 1, OLD description, isolated harness)

- RECALL: 12/13 = 92% (canary-validated). Miss: `groupImports` readability-only prompt (0/3).
- SPECIFICITY: 11/11 = 100% quiet (0 false positives; seam p6, perf L20, SOLID L24 all correctly quiet).
- Preserved in `baseline/` (7 result files).

## After results (Step 4, NEW description, isolated harness) -- DONE, preserved in `after/`

- RECALL: 13/13 = 100% (up from 92%). The `groupImports` readability miss is FIXED (now 3/3).
- SPECIFICITY: 11/11 = 100% quiet. ZERO regressions -- every near-miss quiet at 0/3, incl. p6 seam, perf
  L20, SOLID L24, all green-step seams, feature/write-a-function.
- Net: broadened+pushier description raised recall without over-triggering. Clean win on the ISOLATED eval.
- CAVEAT (unchanged): the isolated eval does not reproduce the e2e gap -> Step 4b is the real-gap test.

## CURRENT STEP after Step 4: Step 4b (e2e ground-truth) + Step 5 (wrinkle) remain -- both GATED --plugin-dir spend.
