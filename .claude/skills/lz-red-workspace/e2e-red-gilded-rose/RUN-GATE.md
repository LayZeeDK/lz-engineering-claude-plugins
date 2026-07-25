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
                                                                             # + crux 7, the Step 2 target-toolchain canary
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

## Step 2 -- REQUIRED zero-spend canary before the full fan-out

**This canary is a REQUIRED gate step; run it BEFORE committing to the full k=3 x 2-3-target spend.
It costs NOTHING, so there is no reason to skip it.**

```
node .claude/skills/lz-red-workspace/selfcheck-red.mjs
```

Crux 7 inside that battery grades a FABRICATED runDir -- a committed `meta.json` + `diff.patch`
under `fixtures/canary-rundir/`, the same two files a real capture contributes -- end to end against
the kata's OWN toolchain, and asserts:

- the gate produced a VERDICT rather than throwing;
- the verdict is `genuinely_red` with `pass: true`, and zero NEW differential tsc errors;
- the recorded `runner` is the one the produced test's directory routes to;
- the recorded `runner_version` is a REAL version, not the `unknown` sentinel -- which is only
  readable from a `node_modules` the grading worktree can actually see;
- the borrowed kata still has its `node_modules`, is git-clean, and leaked no grading worktree.

Two more fixtures cover the other directions. `fixtures/canary-nocollect/` puts the produced spec
outside every collection root and asserts the gate returns `no_tests` rather than throwing.
`fixtures/canary-compile/` is the NEGATIVE control: a spec with one deliberate type error, asserted
to grade `compile_error` with `new_tsc_errors > 0`. Without it nothing in the whole battery would
notice the differential typecheck silently ceasing to discriminate, which is the exact defect that
made a produced test with blatant type errors grade as tsc-clean.

Crux 8 is pure and offline and never SKIPs: it pins the steering and write exploits measured on
2026-07-25 as blocked -- a captured diff cannot write into the borrowed repo through the toolchain
junction, the no-tests signal is taken from the runner's own anchored status line rather than from
the produced spec's text, and the config-abort guard ignores ordinary source diagnostics.

If crux 7 prints SKIP, the kata or its `node_modules` is not on disk. Fix that first
(`npm ci` in the kata's own `TypeScript/`, which HAS an untracked lockfile on disk -- unlike a
fresh worktree checkout; see Step 3a2) -- a SKIP here is NOT a pass, and the fan-out would grade
against a toolchain that is not there.

**Why this replaced the old metered canary.** Step 2 used to require capturing ONE real metered run
and grading it, framing the residual risk narrowly as "runner-JSON shape drift". Two things were
wrong with that. First, the shape risk it existed to de-risk was closed offline on 2026-07-25: both
of the kata's runners were measured against the real repo and BOTH emit the Jest-compatible report
shape `classify()` reads (jest 29 `--json`: 4455 bytes, `numFailedTests` 1; vitest 0.28
`--reporter=json`: 1016 bytes, `assertionResults[0].status` `failed`). Second, and more important, a
shape-only check could not see the two defects that were actually present -- a grading worktree with
no toolchain at all, and a runner selected by substring-matching a PROSE field so that it could not
collect the produced test. A fabricated runDir catches both and costs nothing. The old
"add a `jest` devDependency to the workspace" alternative is moot: the kata already ships jest 29,
and the canary uses the target's toolchain rather than the workspace's.

**Residual risk after this canary (the honest list, not just reporter shape):**

- The canary drives THREE fabricated diffs, not every possible one. They prove the gate mechanism
  -- that it sees the target toolchain, routes to a runner that collects the spec, still tells a
  clean spec from a type-broken one, and returns a verdict rather than crashing when nothing is
  collected. They do not prove every model-produced diff applies cleanly; a malformed capture still
  fails closed at `git apply`.
- A captured diff that touches `node_modules`, escapes the worktree, or writes into `.git` is
  REJECTED outright before the grading worktree is built, so such a run gets no verdict at all
  rather than a wrong one. **Read a rejected-capture error as an instrument or a model-behaviour
  finding worth inspecting by hand, not as a verdict.**
- The produced test's directory is now PINNED in the prompt (`test/vitest/`, byte-identical across
  arms) and asserted against `targets.json`, which closes the directory lottery: a spec outside
  every collection root would grade `no_tests` for a folder choice that says nothing about RED
  quality. The residual is a model that ignores the pin. **Read a cluster of `no_tests` OR
  `collection_error` verdicts as a possible instrument artifact and inspect where the specs
  actually landed before attributing anything to an arm.** The pinned directory accepts both jest
  and vitest idiom (vitest globals are on), so idiom alone no longer produces a `collection_error`.
- A produced spec using an es2021-or-later method DOES manufacture a NEW differential error under
  the current tsc args and grades `compile_error` -- measured, `String.replaceAll` yields one new
  TS2550. That verdict is HONEST (the test genuinely does not compile under the target's own pinned
  TypeScript 4.9.5, which is what D-06 clause 1 is for), but the class exists, so an operator
  reading a `compile_error` cluster should check whether it is modern-syntax rather than a real type
  error. Pinning `--lib` was considered and REJECTED: it couples a target-agnostic gate to one
  compiler's accepted lib list, and a value the target's tsc rejects becomes an identical error in
  both differential runs -- the vacuous differential the config-abort guard now catches.
- Contamination on GRC is HIGH, so a correctness tie across arms is expected (Step 1).

**Optional extra (metered, NOT required):** once the fan-out is approved and the first real runs are
captured, grading one of them is a free sanity read on real model output --
`node .claude/skills/lz-red-workspace/grade-red.mjs --run <runDir> --suite <this suite dir>`. It is
no longer a gate step, because the fabricated canary already covers everything it would have.

Only after the zero-spend canary passes does the full fan-out below proceed.

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

# a2) GIVE THAT CHECKOUT A TOOLCHAIN -- see the note below; do NOT skip this.
#     `npm ci` ALONE CANNOT WORK HERE: TypeScript/.gitignore lists package-lock.json, so no
#     lockfile is tracked and a fresh worktree checkout has none. Measured -- `npm ci` in such a
#     checkout exits EUSAGE, "can only install with an existing package-lock.json". Copy the
#     kata's untracked lockfile in first, THEN ci, which keeps the install reproducible:
cp "<kata>/TypeScript/package-lock.json" "<throwaway kata checkout>/TypeScript/package-lock.json"
npm --prefix "<throwaway kata checkout>/TypeScript" ci
#     Fallback if the kata has no lockfile on disk either:
#     npm --prefix "<throwaway kata checkout>/TypeScript" install
#
#     Do NOT link the kata's node_modules into this checkout with `mklink /J`. That instruction was
#     REMOVED on 2026-07-25. The apply checkout is where the MODEL UNDER TEST runs with write
#     access for the whole metered round, so a junction hands it the borrowed repo's real
#     dependency tree -- one `npm install` in its turn and a third-party checkout is modified. The
#     earlier note warned only about a recursive delete following the link on teardown and said
#     nothing about writes, which is the same blind spot that made the grader's own `git apply` a
#     write path into the kata (closed separately by assertSafeDiffPaths in grade-red.mjs).

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

**Why `a2` matters for the MEASUREMENT, not just for tidiness.** A fresh `git worktree add` checkout
has no `node_modules` -- it is gitignored and untracked, so nothing is copied into it. Without a
toolchain the model under test cannot RUN the test it writes. That does not merely slow it down: it
silently removes the "watch it fail for the right reason" step from the RED loop, in all three arms
at once, which is one of the behaviours the eval is supposed to be measuring. Verified 2026-07-25 --
a fresh detached kata worktree has no `TypeScript/node_modules`, and neither `npx jest` nor `npx
tsc` resolves the kata's pinned versions from inside it. Install or link BEFORE driving `b`.

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
