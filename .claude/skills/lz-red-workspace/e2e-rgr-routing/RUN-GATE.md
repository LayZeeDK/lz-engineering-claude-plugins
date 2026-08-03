# RGR routing placement A/B -- RUN-GATE (the gated metered-run presentation)

This file is DOCUMENTATION. It presents ready-to-run gated metered commands and then STOPS. Running
any command below is out of scope for phase execution: Phase 22 authored this file, proved the whole
instrument GREEN offline, and HALTED. Both metered rounds are separate, freshly-approved,
orchestrator-driven steps.

Skills under test: all three of `plugins/lz-tdd/skills/{lz-red,lz-tpp,lz-refactor}`. Milestone
lz-tdd@0.0.3, Phase 22.

Suite: `.claude/skills/lz-red-workspace/e2e-rgr-routing` -- nine cases, three placement arms,
recommend-only. The graded artifact is answer prose and the metric is a single closed DESTINATION
label (D-12), never house vocabulary.

| Arm | Plugin tree | Placement lever |
|-----|-------------|-----------------|
| `variant_a` | `plugins/lz-tdd` (the TRACKED tree) | inline only -- step-1 branches plus the per-skill narrative section. No new shipped file. |
| `variant_b` | `out/lz-tdd-variant-b` (generated) | shared routing table PLUS a short inline classify-first rationale in each `SKILL.md`. |
| `variant_c` | `out/lz-tdd-variant-c` (generated) | shared routing table REPLACING the three per-skill narrative sections; the lettered branch lists stay inline. |

Variant A needs no generated copy because the tracked tree IS variant A (D-24). That is also what
makes it the composition anchor `selfcheck-red.mjs` already asserts.

---

## HALT -- TWO SEPARATELY APPROVABLE METERED ROUNDS

**METERED RUN -- requires fresh explicit owner approval (the standing eval-run-approval-gate). Do NOT
run any command below during phase execution.**

This is the build-then-halt boundary (D-14). The instrument is BUILT and GREEN offline; every
`claude -p` and every `run_eval` command in this file spends real tokens.

- **This gate is blocking-human and NEVER auto-approvable.** No `workflow.auto_advance` setting, no
  `--auto` chain and no `--chain` flag overrides it.
- **No prior approval carries over.** An approval given for an earlier round, an earlier phase or an
  earlier eval is not an approval for anything here.
- **There are TWO rounds, and approving one does NOT approve the other.** Round A (the placement A/B)
  and Round B (the EVL-01 reciprocal trigger regression) are independent spends with independent
  purposes. Round B became MANDATORY as a regression check the moment D-06 put `description`
  frontmatter in scope -- but mandatory-as-a-check is not the same as approved-to-spend, and the
  spend is the owner's to authorize.
- **Round A's stage 2 needs its own approval, separate from stage 1's** (D-13). Say so at the gate
  rather than treating a stage-1 approval as covering the escalation.

Until approval, the phase is BUILD-complete and HALTED, and the held pull request stays held.

---

## PRE-RUN CHECKLIST (all three, before either round)

1. **The OWNER has run the plugin reload.** Committed is not live. All three `description` fields
   changed in this phase (`lz-refactor` from 1233 to 1369 chars, `lz-tpp` from 750 to 840, `lz-red`
   from 1245 to 1439), and a skill listing built before the reload carries the OLD descriptions.
   Claude cannot run the reload. **No trigger measurement is believed before the owner has run it** --
   that applies to Round B directly, and to Round A's per-arm auto-trigger reading too.

2. **The variant trees are freshly built and the routing selfcheck is GREEN.** The generated trees
   live under gitignored `out/` and do not survive a fresh checkout. Rebuild and re-prove, in this
   order:

   ```
   node .claude/skills/lz-red-workspace/variants/build-variants.mjs
   node .claude/skills/lz-red-workspace/selfcheck-routing.mjs
   ```

   This is not ceremony. Crux 3 re-asserts the per-skill `description` frontmatter is BYTE-IDENTICAL
   across all three trees at MEASUREMENT time, not merely at generation time -- and that assertion has
   to exist twice, because a one-byte frontmatter mutation was MEASURED invisible to the delta-set
   check (the file is already declared `edited`, so the delta set does not move). If the descriptions
   are not identical across the arms, the A/B is measuring triggering rather than placement and its
   result is void (D-11).

3. **The read-rate instrumentation is present.** Confirm `run-e2e.mjs` records `routing_table_read`
   and `routing_table_read_path` on every run's `meta.json`, and that `grade-routing.mjs` carries the
   fact into each grade. The grader FAILS CLOSED on a meta without a boolean `routing_table_read`, so
   a capture that predates the instrumentation cannot be silently graded -- but confirm it before
   spending rather than discovering it at grade time.

---

## THE READ-RATE RULE -- a gate, not a footnote

**Report every variant's READ RATE alongside its PASS RATE. A pass rate quoted without its read rate
is not a result.**

A high pass rate at a ZERO read rate means the measurement captured the INLINE RESIDUE rather than
the placement. Under variants B and C the routing content moved to a lazily-read file; if the model
never opened that file, the answer came from the branch list that is still inline, and the number says
nothing whatsoever about placement.

This is not a hypothetical. This repo has a MEASURED zero-retrieval precedent on a cited reference:
the prior placement probe shipped an artifact into `references/`, cited it from the reference list,
and ZERO of six treatment runs opened it -- verified by transcript scan with a passing positive
control. The treatment dose was zero and the arm measured retrieval rather than content.

`variant_a` cannot read a file its tree does not carry, so its read rate is a structural zero. That is
deliberate: it gives the other two arms an in-corpus zero baseline to be read against, rather than
leaving their rates uninterpretable.

**Warning sign to act on:** variant C's read rate is zero AND its pass rate equals variant A's. Read
that as "the shared table was never consulted", not as "the shared table works".

---

## ROUND A -- the placement A/B (D-08, D-11, D-12, D-13)

### Stage 1 -- screen at low k across the three arms over the nine cases

Run from the REPOSITORY ROOT. The suite's `repo` field is a relative path resolved against the
invoking process's cwd, so every documented invocation assumes the repo root (pass `--cwd` to
override).

```
node .claude/skills/lz-refactor-workspace/e2e-nx/run-e2e.mjs \
  --suite .claude/skills/lz-red-workspace/e2e-rgr-routing \
  --mode recommend \
  --arm placement \
  --runs 1
```

- `--suite` selects this suite; the driver lives in the lz-refactor workspace and is shared.
- `--mode recommend` is the only mode this suite supports. It hard-blocks Edit, Write, MultiEdit,
  NotebookEdit and Bash, so no diff can exist. The suite declares no `code` on any prompt and no
  `file` on its target, so apply mode throws by design rather than fabricating a meaningless baseline.
- `--arm placement` is the ARM GROUP that expands to `variant_a`, `variant_b` and `variant_c`. It was
  APPENDED to the driver, touching neither `both`, `all` nor `d12`, so the existing dry-run guarantees
  are byte-unchanged.
- `--runs 1` is stage 1's k. Nine cases x three arms x k=1 = 27 runs.
- Model pin: the driver defaults to `claude-opus-5`, the current default Claude Code model. Override
  with `E2E_MODEL` only to reproduce an older round. Re-check this pin every model generation -- it is
  the baseline every conclusion rests on.
- Add `--dry-run` first if you want the composed prompts and commands printed at zero spend. That is
  free and is not the metered run.

Captures land under `e2e-rgr-routing/results/recommend/<arm>/<case-id>/run-N/answer.md`.

### Then, per captured run -- the destination grader

```
node .claude/skills/lz-red-workspace/grade-routing.mjs \
  --suite .claude/skills/lz-red-workspace/e2e-rgr-routing
```

(or `--run <runDir>` for a single capture.)

It extracts ONE closed destination label per answer -- `lz-red`, `lz-tpp`, `lz-refactor`, an ordered
handoff of two of them, or `NONE` -- and compares it to that case's expected label from
`tools/rgr-cases.json`. Pass is label equality. There is no partial credit, no phrase bonus and no
second dimension.

Three cardinality classes, kept apart on purpose:

| Affirmed names in the answer | Resolution |
|------------------------------|------------|
| exactly one | resolved DETERMINISTICALLY against the expected label |
| two or more | ALWAYS unresolved -- handed to the judge |
| zero | resolved deterministically ONLY on the residual case `c9`; unresolved on every other case |

`multiple` is never guessed, because a CORRECT answer to the two-hop case `c4` names two skills
legitimately while a hedging answer names three, and no mechanical rule separates "lz-red first, then
lz-tpp" from "could be lz-red or lz-tpp". `zero` is not an automatic fail, because a coaching answer
that solves the problem without naming a skill is substantively ambiguous rather than wrong -- and on
`c9` it is exactly right.

The grader writes `routing-grade.preliminary.json` with `judge_required: [...]` and structurally
REFUSES to write a final `routing-grade.json` while anything remains unresolved.

### Then -- the blind judge, on the UNRESOLVED runs ONLY

Ask ONE question, and only one:

> Which single skill, if any, does this answer designate as the owner of the request -- `lz-red`,
> `lz-tpp`, `lz-refactor`, an ordered handoff of two of them, or none of the three? Answer with the
> label only.

- **Unresolved runs only.** A deterministically resolved run never reaches the judge.
- **One dimension, answered with a LABEL only.** No prose verdict, no second axis.
- **On NORMALIZED answers.** Feed the judge the grader's `judge_inputs`, never the raw answer.

**Blinding is genuinely achievable here, and that is a real advantage over the prior behavior eval.**
That one could not blind its judge, because a skill-loaded transcript self-identifies against a
no-skill baseline through house vocabulary. Here ALL THREE arms are skill-loaded and share the same
register, so the arm is not inferable from the coaching voice. Two residual leaks are closed by the
normalization pass before the judge sees anything:

- the FILE-PATH leak -- variants B and C may cite the shared table's path or the plugin-root variable;
  variant A cannot;
- the SECTION-TITLE leak -- variants A and B may quote a per-skill narrative heading that variant C
  deletes.

Both are replaced by neutral placeholders rather than deleted, and the grader REPORTS whether
normalization fired per run. Report that count per arm in the writeup, so blindness is EVIDENCED
rather than asserted.

### Then -- the judge merge and its pre-aggregate gate

```
node .claude/skills/lz-red-workspace/merge-judge.mjs --merge \
  --preliminary <runDir>/routing-grade.preliminary.json \
  --verdicts   <runDir>/judge-verdicts.json \
  --out        <runDir>/routing-grade.json
```

The merge is filename-agnostic -- it takes explicit paths -- and it is fail-closed: it writes nothing
and exits non-zero unless EVERY `judge_required` text has exactly one verdict with a strict boolean
`passed`, and it refuses unknown verdict texts, duplicate verdict texts, a preliminary that is already
final, and any expectation that would remain `passed: null`.

Its `--verify` gate is what stops an unmerged run from silently dropping out of the denominator. **See
the KNOWN GAPS section below before running it against this suite** -- `--verify` does not currently
reach this suite's directory shape.

### Then -- the tabulator, with the routing grade file

```
node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --grade-file routing-grade.json
```

**See the KNOWN GAPS section below.** As of this writing that invocation is a MEASURED silent no-op
for this suite.

### Stage 2 -- escalate ONLY on a signal, and ONLY on the discriminating subset

- Escalate k (to three, or five) only if stage 1 shows a signal.
- Escalate on the DISCRIMINATING SUBSET of cases, never globally. Five prior placement and
  passive-content probes on this project came back null, and eight of ten scenarios in the prior
  behavior eval saturated on substance, so a global escalation buys mostly noise at full price.
- **Stage 2's approval is NOT implied by stage 1's.** Return to this gate and ask again.

A NULL result is a likely and legitimate outcome here, not a failed experiment. That is precisely why
D-10 pre-registers a tiebreak -- and why the tiebreak carries a disclosed risk rather than being free.

---

## KNOWN GAPS in Round A's downstream chain -- MEASURED, stated rather than discovered at run time

Two steps of the chain above do not currently reach this suite. Neither blocks the CAPTURE or the
GRADING; both affect the ROLLUP. Both are recorded here rather than worked around silently, because a
rollup step that quietly produces nothing is the failure shape that looks healthiest.

### Gap 1 -- `tabulate-mechanical-red.mjs` cannot see this suite

**Measured.** Running `node tabulate-mechanical-red.mjs --grade-file routing-grade.json` from the repo
root prints:

```
no captured runs under any of 3 RED suite(s) -- nothing to tabulate (run the gated suites first):
  ...e2e-red-gilded-rose\results\apply
  ...e2e-red-radix-ng\results\apply
  ...e2e-red-srvx\results\apply
```

Two independent causes, both in the tabulator's main path:

1. `discoverSuiteDirs()` filters on `e2e-red-` as a directory-name prefix. This suite is deliberately
   named `e2e-rgr-routing`, OUTSIDE that namespace, because `selfcheck-red.mjs` auto-discovers
   `e2e-red-*` siblings and its crux 2 bans thirteen state-claim tokens in prompts -- while this
   corpus MUST carry test-state facts by design (D-03 exists precisely because routing has to IGNORE
   them). The name is correct; the discovery filter simply does not reach it.
2. `walkAllSuites()` walks `results/apply` only. This suite is recommend-only and writes to
   `results/recommend`.

It exits 0 with a message, so it is a SILENT NO-OP rather than a loud failure.

**This was anticipated and only half-closed.** The phase research recorded that the tabulator
"hard-wires `red-grade.json` AND the `results/apply/<arm>/<pid>/run-*/` walk" and that recommend mode
writes elsewhere. The `--grade-file` parameter closed the filename half; the directory half was not
closed. The `--grade-file` parameter is real, correct and selfchecked -- it is simply not sufficient
on its own.

**Do NOT read a clean exit as a tabulated result.** Either extend the tabulator (a `--suite` and a
`--mode` argument are the obvious shape, and `discoverSuiteDirs` / `walkAllSuites` are already
exported for exactly that kind of reuse), or compute Pass@k and Pass^k for the writeup from the
per-run `routing-grade.json` files directly. Whichever route is taken, it is a code change and it
belongs to a gap-closure step, not to a metered round already in flight.

### Gap 2 -- `merge-judge --verify` does not reach this suite's run dirs either

`--verify <iterationDir>` mirrors the skill-creator aggregate's glob, `eval-*/<config>/run-*`, and
looks for a file named `grading.json` in each run dir. This suite's captures live at
`results/recommend/<arm>/<case-id>/run-N/` and their final grade is named `routing-grade.json`. So the
verify gate reports "no `eval-*/<config>/run-*` dirs" rather than checking anything.

`--merge` is unaffected -- it takes explicit paths and is filename-agnostic, and its fail-closed
refusals all still bind.

**Consequence, stated plainly: the pre-aggregate completeness gate is NOT automated for this suite
yet.** Until it is, verify completeness explicitly before believing any rollup: every captured run dir
must hold a final `routing-grade.json` with `preliminary: false`, an empty `judge_required`, and no
expectation left at `passed: null`. Do not aggregate over a partially merged set -- an unresolved run
that drops out of the denominator is a scored-only false pass, which is the exact defect the verify
gate exists to prevent.

---

## ROUND B -- the EVL-01 reciprocal trigger regression (D-06, D-14)

**MANDATORY as a check, SEPARATELY APPROVABLE as a spend.** D-06 put `description` frontmatter in
scope, and all three descriptions changed. A description edit reopens the auto-trigger -- the one
lever this project has MEASURED to work -- so a reciprocal specificity regression must be measured
rather than assumed. Approving Round A does not approve this, and approving this does not approve
Round A.

### The commands, with the model pin refreshed

From `.claude/skills/lz-red-workspace/tools/skill-creator-eval/`. `<repo>` is the repository root.
The recorded commands pinned `claude-opus-4-8`; the pin below is refreshed to `claude-opus-5`, the
current default Claude Code model. Re-check it per model generation.

```
# lz-tpp must stay quiet on RED prompts
PONYTAIL_DEFAULT_MODE=off python -m scripts.run_eval \
  --eval-set ../../evals/reciprocal-red.json \
  --skill-path <repo>/plugins/lz-tdd/skills/lz-tpp \
  --model claude-opus-5 --runs-per-query 3 --num-workers 1

# lz-refactor must stay quiet on RED prompts
PONYTAIL_DEFAULT_MODE=off python -m scripts.run_eval \
  --eval-set ../../evals/reciprocal-red.json \
  --skill-path <repo>/plugins/lz-tdd/skills/lz-refactor \
  --model claude-opus-5 --runs-per-query 3 --num-workers 1
```

### Which set these read

`evals/reciprocal-red.json` -- the twelve lz-red trigger POSITIVES, re-tagged `should_trigger: false`
and byte-consistent with the forward positives. Fed to each SIBLING skill path, it asks the reciprocal
question: does a sibling wrongly fire on RED intent.

The canary-gated chunk runners are deliberately NOT used here. Their appended canary is an lz-red
should-trigger positive, so on a sibling skill path it would correctly not fire and could not certify
a healthy window. The reciprocal probe is a SPECIFICITY measurement, which is throttle-robust: a
throttled window can only make a sibling look quieter, never louder. The direct probe is therefore
sound for this measurement in a way it is not for recall.

### The pre-edit baseline, so a regression is visible

Measured 2026-07-21 under explicit owner approval, twelve RED positives x three runs = 36 per sibling:

| Sibling | Quiet on the RED positives | trigger_rate | Pass@1 |
|---------|----------------------------|--------------|--------|
| `lz-tpp` | 12 of 12 | zero | perfect |
| `lz-refactor` | 12 of 12 | zero | perfect |

Both siblings were fully quiet. **Any firing after the description edits is a regression against a
clean baseline, and is visible immediately** -- there is no noise floor to argue about. Per the
standing rule it is a bounded, non-blocking tuning candidate on THAT sibling's description, never a
blocker and never a reason to reopen the classifier.

### The one data gap, recorded honestly

**There is NO reciprocal set in the other direction for the new two-hop clause.** `reciprocal-red.json`
tests siblings staying quiet on RED intent. It does not test the converse the D-02 two-hop introduced:
a "I want to add a new behavior, nothing failing yet" request now routes to `lz-red` FIRST and only
then to `lz-tpp`, replacing the old dead end where `lz-refactor`'s description sent the case straight
to `lz-tpp` and `lz-tpp` declined it. No eval set currently asks whether `lz-red` fires on that shape.

**Consider adding at least two nothing-failing-yet queries to the lz-red trigger positives, with their
mirrored dual-writes.** Both are currently NOTHING-FAILING-YET in the other sense too -- nothing fails
today because nothing measures it, which is the least visible kind of gap.

Note that `check-evals.mjs` ENFORCES the mirrors: it asserts the reciprocal set is byte-consistent
with the positives and all-false. A one-sided edit -- adding a positive without its mirrored
reciprocal entry -- is caught by the lint at zero spend rather than surviving to a metered round. Add
both sides, then run the lint before spending anything.

---

## OFFLINE INSTRUMENT PROOF -- zero spend, NOT the metered run

Everything below is free and safe to re-run at any time. It is the proof that the instrument works; it
is NOT a measurement of the placement question, and a GREEN result here is a FLOOR rather than a
verdict.

```
npm --prefix .claude/skills/lz-red-workspace run check
npm --prefix .claude/skills/lz-refactor-workspace run check
node .claude/skills/lz-red-workspace/extract-samples.mjs
node .claude/skills/lz-red-workspace/check-evals.mjs
node .claude/skills/lz-red-workspace/variants/build-variants.mjs
node .claude/skills/lz-red-workspace/selfcheck-routing.mjs
node .claude/skills/lz-red-workspace/grade-routing.mjs --selfcheck
node .claude/skills/lz-red-workspace/grade-red.mjs --selfcheck
node .claude/skills/lz-red-workspace/tabulate-mechanical-red.mjs --selfcheck
node .claude/skills/lz-red-workspace/merge-judge.mjs --selfcheck
claude plugin validate .
claude plugin validate . --strict
```

`node .claude/skills/lz-red-workspace/selfcheck-red.mjs` belongs to the same zero-spend battery but is
NOT in the list above, because it is a different kind of command: it takes roughly fifteen minutes and
builds real git worktrees against three BORROWED external repos. **Run it in the BACKGROUND, never
under a tool timeout, and never in a throwaway worktree that something may force-remove.** Killing it
mid-run strands a grading worktree inside a borrowed repo -- that has happened on this project, and
clearing it needed an out-of-project destructive removal.

A fresh git worktree does not carry gitignored files, so `node_modules` is absent there. Restore it
from the tracked, pinned lockfile before running anything that needs a compiler:

```
npm --prefix .claude/skills/lz-red-workspace install
```

That adds no package. It restores a committed dependency set.

---

## POST-RUN PATH

1. **Fill the writeup** at `.claude/skills/lz-red-workspace/ROUTING-AB-RESULTS.md`. It is a
   phase-scoped SIBLING, deliberately not an append to the frozen eval record (D-25). Its caveats are
   already written; the numbers are blank placeholders waiting for real figures.

2. **Then, BEFORE the numbers are recorded as findings, at least one from-scratch UNBIASED reviewer
   audits three things:**
   - the grader SOURCE (`grade-routing.mjs`, including the affirmation test and the normalization
     pass),
   - a SAMPLE of normalized judge inputs (does the normalization actually blind, and did it strip
     anything load-bearing),
   - the REPORTED numbers, recomputed independently.

   The brief must be from scratch: no prior findings, no conclusion to confirm. This is the gate that
   caught a grader-vocabulary artifact on this project which inflated a headline roughly threefold,
   and it is an ORCHESTRATOR-spawned step -- the executor cannot spawn subagents.

3. **Apply any grader artifact SYMMETRICALLY to every arm.** The recorded failure was applying a
   caveat upward for one arm only.

4. **Reconcile the CLS-05 requirement row** when the run completes. It is currently and correctly
   recorded as BUILD-complete and halted; a status only ever written by the step that DEFERS it is
   never cleared by the step that RESOLVES it, and three prior gated requirements on this project
   decayed into a false Pending exactly that way.

5. **Only then decide the placement variant.** If the result is a measured TIE on routing correctness,
   D-10's pre-registered tiebreak selects variant C -- with its disclosed risk stated, not hidden. See
   the writeup's caveats section.
