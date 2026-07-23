# lz-red APPLY Eval -- RUN-GATE (the gated metered-run presentation)

This file is DOCUMENTATION. It presents the ready-to-run gated metered commands and then STOPS.
Running any command below is out of scope for execute-phase; the metered 3-arm apply run is a
separate, freshly-approved, orchestrator-driven step.

Skill under test: `plugins/lz-tdd/skills/lz-red`. Milestone lz-tdd@0.0.3. Suite:
`.claude/skills/lz-red-workspace/e2e-red-gilded-rose`.

---

## HALT -- METERED RUN

**METERED RUN -- requires fresh explicit user approval (eval-run-approval-gate). Do NOT run any
command below during execute-phase.**

This is the build-then-halt boundary (D-12). The instrument is BUILT and GREEN offline; every
`claude -p` command in this file spends real tokens and MUST NOT start without fresh explicit
approval per the standing eval-run-approval-gate. No prior approval and no `workflow.auto_advance`
setting carries over -- this gate is blocking-human and never auto-approvable. Until approval, the
phase is BUILD-complete and HALTED.

Offline instrument proof (zero spend -- safe to re-run any time; this is NOT the metered run):

```
node .claude/skills/lz-red-workspace/grade-red.mjs --selfcheck               # all 7 D-06 classes
node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --selfcheck # mechanical + Pass@k/Pass^k
node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck             # judge merge + fail-closed verify
node .claude/skills/lz-red-workspace/selfcheck-red.mjs                       # composition/parity/worktree/classifier/nx
```

---

## Step 1 -- Pre-run confirmation checklist (D-01, target confirmation)

Before any spend, confirm the target corpus with the user at the gate:

1. **Anchor is fixed: GRC (Gilded Rose `Conjured`).** Verified genuinely-red (tsc-clean +
   assertion-red on current code). Contamination HIGH -- it is a correctness SMOKE anchor, NOT a
   discriminator. A correctness tie across all three arms on GRC is EXPECTED (read as pass-at-ceiling,
   not "the skill adds nothing"; RESEARCH Pitfall 5). Keeping GRC alone at k=3-5 is a valid first
   round (backup).
2. **Confirm or nominate the discriminating 2nd/3rd target** against the 7-point qualification
   checklist (steer-at-gate; D-01):
   1. Small + Vitest/Jest + offline-vendorable (its `npm test` runs a single file quickly).
   2. The target public API EXISTS and COMPILES (so the test is tsc-clean, not a compile error).
   3. A specific behavior is wrong/missing so a correct-behavior test FAILS on an ASSERTION (not
      compile, not false green) on CURRENT code.
   4. The gap is a genuine bug or unimplemented feature, NOT a deliberate design choice (else the red
      is arguing with the maintainers).
   5. Low contamination preferred (not a textbook example) -- or contamination flagged so parity is
      read correctly.
   6. A byte-identical short human prompt works (the target is nameable by path without leading the
      answer).
   7. It stresses at least one RED-DISCIPLINE axis (classify-first / assert-observable-behavior /
      message-matrix-over-mock / coach-don't-drive-to-green).
3. **Package-legitimacy gate on ANY newly nominated repo (T-21-SC).** If the user nominates a NEW
   real-OSS repo (not the already-vendored kata), run the package-legitimacy gate on it FIRST --
   confirm it is a real, maintained repo (registry age / downloads / source repo) -- and only then
   `npm install` + vendor it. Do NOT auto-substitute a similarly-named alternative if an install
   fails; surface it to the user. The anchor kata is already vendored + verified, so no install is
   needed for a GRC-only round.
4. **Decide run scope for spend (D-03):** ~2-3 targets x k=3; the exact target count and k are tuned
   here for spend. Report Pass@k AND Pass^k (k = 1, 3, 5, total) per target + overall.

---

## Step 2 -- REQUIRED canary before the full fan-out (runner-JSON shape drift)

**This canary is a REQUIRED gate step; run it BEFORE committing to the full k=3 x 2-3-target spend.**

Residual risk (RESEARCH A1 / Pitfall 4): `grade-red --selfcheck` exercises the classifier against the
workspace's pinned `vitest@4.1.10`, NOT the kata's actual `vitest@^0.28.5` / `jest@^29.4.3` that the
metered D-06 gate shells into. vitest 0.28's JSON reporter predates the 1.x shape, so a genuine
JSON-shape difference would surface ONLY at the metered run. This is mitigated by grade-red's
fail-closed contract (a garbled/keyless runner JSON throws rather than passing silently), so it is not
a BUILD blocker -- but it must be de-risked before spending on the full fan-out.

Do ONE of the following before the full run:

- **Canary (preferred):** capture ONE real kata run, then run a single real grade against it and
  confirm the verdict is sane -- `genuinely_red` on the known-red Conjured run, with the runner + its
  version recorded in `red-grade.json`:

  ```
  node .claude/skills/lz-red-workspace/grade-red.mjs \
    --run <one captured kata runDir> \
    --suite .claude/skills/lz-red-workspace/e2e-red-gilded-rose
  ```

  The gate DIFFERENTIAL-typechecks (record the pristine baseline error set, assert ZERO NEW errors
  from the produced test -- the kata's `Item` constructor is untyped, so a whole-project
  `tsc --strict` is already non-zero; RESEARCH Pitfall 3) and shells into the TARGET's own runner
  (`npx vitest run <file> --reporter=json` or `npx jest <file> --json`), never the workspace's runner
  (Pitfall 4). Confirm the runner + version are recorded for drift detection. jest 29's `--json` shape
  is the more stable one; prefer jest if the vitest 0.28 reporter shape drifts.

- **Offline alternative:** add a `jest` devDependency to the workspace so the fixtures can also
  exercise the `jest --json` shape offline, and re-run `grade-red --selfcheck` against it. (Keeps the
  de-risk zero-spend; still NO dependency added to `plugins/lz-tdd`.)

Only after the canary verdict is sane does the full fan-out below proceed.

---

## Step 3 -- First-round metered command (3 own-skill arms; GATED)

The first round runs the THREE own-skill arms (D-04): `no_skill` (no plugin), `with_skill`
(`--plugin-dir plugins/lz-tdd` + natural prompt -- genuine description auto-trigger), and
`invoke_skill` (natural prompt force-prefixed with `/lz-tdd:lz-red ` -- the always-fires content
control). `--arm all` composes exactly these three.

Isolation (baked into the suite / reused driver): `--strict-mcp-config` + `--setting-sources project`
(drop MCP servers and the user's global plugins); model `claude-opus-4-8` at effort `high`; arms x
prompts x runs run SERIALLY; one suite dir per target repo, driven sequentially.

The apply harness refuses to run on a protected branch (`main` / `master` per `suite.json`), so first
create a THROWAWAY branch checkout of the kata -- NEVER run apply against the pristine tree:

```
# a) throwaway kata checkout (never the pristine main tree):
git --git-dir="<kata>/.git" worktree add -b red-run-<stamp> <throwaway kata checkout> main

# b) drive the RED suite (arm all = no_skill + with_skill + invoke_skill), serial, k=3:
node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs \
  --suite .claude/skills/lz-red-workspace/e2e-red-gilded-rose \
  --mode apply --arm all \
  --cwd <throwaway kata checkout>/TypeScript \
  --runs 3

# c) grade each captured run (D-06 gate -> red-grade.json):
node .claude/skills/lz-red-workspace/grade-red.mjs --run <runDir> \
  --suite .claude/skills/lz-red-workspace/e2e-red-gilded-rose

# d) tabulate the mechanical dims + Pass@k/Pass^k on the correctness gate:
node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs
```

`c` (the pass criterion) = runs whose `red-grade.pass === true` (verdict `genuinely_red`). Pass@k over
exit-0 runs only. The auto-trigger gap = with_skill `used_skills['lz-red'] > 0` rate vs invoke_skill
(the forced control, expected ~1.0) vs no_skill (0 by construction) -- the D-04 trigger-gap signal.

---

## Step 4 -- Graded-dims path (blind judge + oracle-reviewer; ORCHESTRATOR-driven, post-run)

After the metered run, the ORCHESTRATOR (the gsd-executor cannot spawn subagents) runs:

1. **Blind LLM judge, at most 2 dims (the Phase-20 lock):**
   - Dim 1: "Is THIS the right next test?"
   - Dim 2: "Does it assert observable behavior, not implementation?"
   Blind the judge by feeding ONLY the produced test code + the target behavior spec -- NO arm label,
   NO skill self-identification (strip comments / normalize formatting). This is the Pitfall 7
   improvement over Phase 20 (a test file blinds far better than a self-identifying transcript).
2. **Second blind judge (contingent):** add classify-first ("is the right next move RED, not
   green/refactor?") as a THIRD dim only via a SECOND judge, and only if the confirmed targets stress
   it -- keep <= 2 dims per judge.
3. **oracle-reviewer for book/source authenticity** of the produced test vs the owned
   `.oracle/{clean-code, 99-bottles-2e-js, videos/test-desiderata, written-content}` RED sources
   (clean-room, DST-04; own-words verdicts only cross back). Expect lower discriminating power for a
   test artifact than for a named refactoring (RESEARCH A5).
4. **Fail-closed merge/verify:** `node .claude/skills/lz-red-workspace/merge-judge.mjs --merge` then
   `--verify` (byte-match verdict provenance + the fail-closed gate; reused verbatim, selfcheck-GREEN).
5. **Fill EVAL-RESULTS.md** -- every blank Pass@k/Pass^k, mechanical, auto-trigger, and graded-dim cell.

Contamination flag per target (GRC = HIGH) stays on each row so a tie is read as pass-at-ceiling.

---

## Step 5 -- Competitor round (D-05; LATER, CONTINGENT -- not the first fan-out)

The `mattpocock-skills:tdd` competitor arm is a LATER, CONTINGENT round -- run it ONLY after our own
lift is measured, and only because its standalone check passed (no hard sibling dep). **Scope
mismatch to note in the writeup:** mattpocock `tdd` is a full red->green loop with an interactive
seam-confirmation step, whereas lz-red is a RED-step-only coach (write the failing test and stop;
making it green is lz-tpp's job). The competitor is NOT in the first fan-out; add it as a separate,
freshly-scoped round if the own-skill lift warrants a head-to-head.

---

## Step 6 -- Run-time orchestration hygiene (D-13)

For the gated run (all RUN-time, not part of the build):

- **Small waves.** Fan out in SMALL waves (respect the org concurrency cap; the user flagged
  24-in-flight). run-e2e.mjs already drives arms x prompts x runs SERIALLY, so a single suite is safe;
  the risk is the ORCHESTRATOR spawning multiple background suites or many grading subagents at once.
  Drive ONE suite dir at a time, sequentially.
- **Normal mode / stop ponytail.** Put an explicit "normal mode / stop ponytail" directive in EVERY
  in-session Agent subagent prompt -- the env-var lock does not reach subagents, and a lazy default
  perturbs the probe.
- **Resume spend-limit kills.** If a subagent is killed by a spend limit, resume it via
  `SendMessage(agentId)` rather than re-spawning (avoids double-spend and preserves state).
- **Isolated git-ignored worktree per run.** Drive each run in an isolated git-ignored worktree/dir
  (ground-truth nodrive); the borrowed repo's pristine tree is never the apply target. Per-run
  byproducts (`results/apply/**`, transcripts) are git-ignored; NO dependency is added to
  `plugins/lz-tdd`.

---

## Step 7 -- Post-run unbiased review + substance-only headline (D-08 / D-10)

**Mandatory before any number is recorded:** at least ONE from-scratch UNBIASED reviewer (a neutral
brief, given NO prior findings and NOT primed with these numbers) audits the grader source
(`grade-red.mjs` + `merge-judge.mjs` + `tabulate-mechanical-red.mjs`), a sample of blinded test diffs
+ transcripts, and the reported Pass@k/Pass^k + mechanical numbers. This is the gate that caught the
Phase-20 ~3x vocabulary inflation (`unbiased-review-beats-primed`).

**The headline is SUBSTANCE-ONLY (D-08).** Substance = (1) the mechanical D-06 correctness GATE (runs
the test, classifies the runner JSON -- no house-vocabulary proxy can inflate it) + (2) the blind-judge
substance dims. Any house-style / house-vocabulary number, if reported at all, is a SEPARATE row
explicitly labeled CONTEXT-ONLY and is never the headline. Apply artifact caveats SYMMETRICALLY to
both arms, never just upward. Read a correctness tie on the contaminated GRC anchor as
pass-at-ceiling, framed by the Phase-13 parity + Phase-20 concentration priors -- NOT as evidence the
skill is inert.

---

## Reference -- expected outputs

- `results/apply/<arm>/<pid>/run-*/` (git-ignored): `meta.json`, `answer.md`, `diff.patch`,
  `red-grade.json`, `outputs/`.
- `mechanical-red.json`: the tabulated mechanical dims + Pass@k/Pass^k.
- `EVAL-RESULTS.md`: filled from the run + the graded dims + the unbiased-reviewer verdict.

All of the above is documentation only. Nothing here runs during execute-phase; the metered run starts
only on fresh explicit user approval.
