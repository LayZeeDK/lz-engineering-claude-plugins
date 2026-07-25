# lz-red APPLY Eval (3-arm, multi-dimensional) -- Results

APPLY-based RED eval: short, human-style prompts drive a real PRODUCED TEST FILE in a real OSS
TypeScript repo, across three own-skill arms, graded on a hard correctness gate plus a set of lift
dimensions. This is the Phase-21 successor to the Phase-20 coaching-prose eval: the graded artifact
is a test file / diff, never coaching prose (D-02).

Skill under test: `plugins/lz-tdd/skills/lz-red`. Milestone lz-tdd@0.0.3.

**STATUS -- BUILD complete; metered run HALTED (D-11 / D-12).** The instrument is built and its
offline selfcheck is GREEN this phase (`node selfcheck-red.mjs` exit 0: composition, prompt-parity,
worktree base, transcript parse, classifier, lz-refactor regression; `node grade-red.mjs
--selfcheck` exit 0: all 7 D-06 classes; `node tabulate-mechanical-red.mjs --selfcheck` exit 0:
mechanical rollup + auto-trigger + Pass@k/Pass^k; `node merge-judge.mjs --selfcheck` exit 0). The
metered `claude -p` run is user-gated and RAN NONE of the sessions -- every result number below is a
blank placeholder (`_`) filled only after the gated run (21-04). Do not read a blank cell as a zero.

## Run configuration (locked -- filled at the gate per D-03)

- **Model:** `claude-opus-4-8` (the session model users experience), effort `high` (pinned, recorded
  in each `meta.json`).
- **Corpus:** ~2-3 targets x k=3 (D-03); the exact target count and k are tuned at the run gate for
  spend. Pass@k / Pass^k over the run count (k = 1, 3, 5, total).
- **Targets:** `GRC` (Gilded Rose Conjured anchor, contamination HIGH -- a correctness SMOKE anchor,
  NOT a discriminator) is fixed; the discriminating 2nd/3rd target is USER-confirmed at the gate using
  the 7-point checklist in `targets.json` (D-01 steer-at-gate; package-legitimacy gate on any newly
  nominated repo).
- **Serial per suite:** run-e2e.mjs drives arms x prompts x runs serially; one suite dir per target
  repo, driven sequentially at the gate (Pitfall 8 concurrency cap; D-13 small waves).
- **Isolation / minimize interference:** `--strict-mcp-config` + `--setting-sources project` (drop MCP
  servers and the user's global plugins); apply runs in a throwaway worktree at `applyBase`, pristine
  reset between runs.
- **Arms (D-04 -- three OWN-skill arms in the first rounds):**
  - `no_skill` -- baseline, no `--plugin-dir`.
  - `with_skill` -- `--plugin-dir plugins/lz-tdd` + a natural prompt (tests whether the description
    AUTO-TRIGGERS and then helps).
  - `invoke_skill` -- the natural prompt force-prefixed with `/lz-tdd:lz-red ` (isolates content value;
    the always-fires control). `with_skill` vs `invoke_skill` surfaces the trigger gap.
  - The `mattpocock-skills:tdd` competitor arm is DEFERRED to a later, contingent round (D-05) -- only
    after our own lift is measured; NOT in the first fan-out.

## Headline structure -- SUBSTANCE-ONLY (D-08), read against the contamination + concentration priors

**The headline is SUBSTANCE-ONLY.** Substance = (1) the D-06 correctness GATE, which is mechanical --
it runs the produced test and classifies the runner's structured JSON (tsc `--strict` differential +
`assertionResults[]`), so NO house-vocabulary proxy can inflate it; plus (2) the blind-judge substance
dimensions (right-next-test, observable-behavior) fed ONLY the blinded test code + behavior spec
(Pitfall 7). Any house-style / house-vocabulary number, if reported at all, is a SEPARATE row
explicitly labeled CONTEXT-ONLY and is never the headline (the Phase-20 lesson: a phrase-set proxy
measures house vocabulary, not substance, and inflated the apparent edge ~3x; apply artifact caveats
SYMMETRICALLY to both arms, never just upward).

**Priors that frame the read (do NOT misread a tie as "the skill adds nothing"):**
- **Phase-13 applied-output PARITY:** on applied output a strong base model (`claude-opus-4-8` @ high)
  is already excellent -- Phase 13 found strict parity between the skill arm and base Opus on
  correctness and book authenticity. Expect correctness parity at ceiling on easy / contaminated
  targets.
- **Phase-20 CONCENTRATION:** the skill's real, judge-verified edge concentrates on the RED-DISCIPLINE
  cases a strong base gets wrong (classify-first boundary, coach-don't-drive-to-green, handoff),
  not on the textbook moves it already knows.
- **GRC contamination (Pitfall 5):** the Conjured spec is fully documented, so a correctness TIE across
  all three arms on GRC is EXPECTED -- read it as pass-at-ceiling on a smoke anchor, NOT as evidence
  the skill is inert. The discriminating signal must come from the confirmed low-contamination target +
  the RED-discipline judge dims + the trigger gap + the process (mechanical) dims.

## Correctness gate -- Pass@k and Pass^k (D-06; the pass criterion)

`c` = runs whose `red-grade.pass === true` (verdict `genuinely_red`: tsc `--strict` differential clean
AND an assertion failure on current code). Pass@k over exit-0 runs only (a crashed run has no
meaningful grade). k = total means k = the clean-run count.

- **Pass@k (optimistic -- at least 1 of k samples passes):** `Pass@k = 1 - C(n - c, k) / C(n, k)`
- **Pass^k (conservative -- all k samples pass):** `Pass^k = C(c, k) / C(n, k)`

A cell is left blank where the run count does not support the k (a higher-k cell is `-` where n < k).
A row where Pass@1 = 1.0 for every arm is flagged saturated / non-discriminating (expected on GRC).

### GRC -- Conjured anchor (contamination HIGH; correctness SMOKE anchor, parity EXPECTED)

| arm | n | clean | c | Pass@1 | Pass@3 | Pass@5 | Pass@total | Pass^1 | Pass^3 | Pass^5 | Pass^total |
|-----|---|-------|---|--------|--------|--------|------------|--------|--------|--------|------------|
| no_skill | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ |
| with_skill | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ |
| invoke_skill | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ |

### <discriminating target -- confirmed at the gate> (contamination: _)

| arm | n | clean | c | Pass@1 | Pass@3 | Pass@5 | Pass@total | Pass^1 | Pass^3 | Pass^5 | Pass^total |
|-----|---|-------|---|--------|--------|--------|------------|--------|--------|--------|------------|
| no_skill | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ |
| with_skill | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ |
| invoke_skill | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ |

### Overall (pooled across targets)

| arm | n | clean | c | Pass@1 | Pass@3 | Pass@5 | Pass@total | Pass^1 | Pass^3 | Pass^5 | Pass^total |
|-----|---|-------|---|--------|--------|--------|------------|--------|--------|--------|------------|
| no_skill | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ |
| with_skill | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ |
| invoke_skill | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ | _ |

## Mechanical lift dims (D-07; from the stream-json meta, `tabulate-mechanical-red.mjs`)

Straight off each run's `meta.json` (no recompute). cost/turns/tools/tokens over ALL runs. Wall-clock =
`elapsed_ms`; tokens = the `model_usage` rollup (rolls up sub-agents); tools = the `tool_calls`
histogram; drove = clean runs whose produced diff changed >= 1 file.

| target | arm | wall-clock mean (s) | cost mean ($) | tokens in/out (rollup) | num_turns mean | tool histogram | edits/drove |
|--------|-----|---------------------|---------------|------------------------|----------------|----------------|-------------|
| GRC | no_skill | _ | _ | _ / _ | _ | _ | _ |
| GRC | with_skill | _ | _ | _ / _ | _ | _ | _ |
| GRC | invoke_skill | _ | _ | _ / _ | _ | _ | _ |
| <target 2> | no_skill | _ | _ | _ / _ | _ | _ | _ |
| <target 2> | with_skill | _ | _ | _ / _ | _ | _ | _ |
| <target 2> | invoke_skill | _ | _ | _ / _ | _ | _ | _ |

## Auto-trigger gap (D-04; with_skill vs invoke_skill)

The genuine description auto-trigger fire-rate. `with_skill` auto-triggers by description; `invoke_skill`
is the always-fires control (forced via the slash prefix); `no_skill` has no plugin (0 by construction).
The `with_skill` vs `invoke_skill` gap is the trigger-gap signal (used_skills['lz-red'] > 0 per run).

| target | with_skill auto-trigger rate | invoke_skill (forced control) | trigger gap | no_skill (baseline) |
|--------|------------------------------|-------------------------------|-------------|---------------------|
| GRC | _ | _ (expected ~1.0) | _ | 0.00 (no plugin) |
| <target 2> | _ | _ (expected ~1.0) | _ | 0.00 (no plugin) |

## Graded lift dims (D-07/D-09; blind LLM judge <= 2 dims + oracle-reviewer -- WIRED, verdicts post-run)

Judgment dims go through a BLIND LLM judge fed ONLY the blinded test code + the target behavior spec
(no arm label, no skill self-identification -- the Pitfall 7 improvement over Phase 20). At most TWO
dims per judge (the Phase-20 lock). Book/source authenticity is `oracle-reviewer` against the owned
`.oracle/` RED sources (clean-room, DST-04; own-words verdicts only). `merge-judge.mjs --merge` +
`--verify` is the fail-closed gate (selfcheck-GREEN, reused verbatim).

| dimension | resolver | with_skill | no_skill | invoke_skill | notes |
|-----------|----------|------------|----------|--------------|-------|
| Is THIS the right next test? | blind judge (dim 1) | _ | _ | _ | blinded test code + behavior spec |
| Asserts observable behavior, not implementation? | blind judge (dim 2) | _ | _ | _ | same blind input; <= 2 dims/judge |
| Classify-first (RED, not refactor/green) | 2nd blind judge (only if a target stresses it) | _ | _ | _ | added only if confirmed targets stress it |
| Book/source authenticity (RED practices) | oracle-reviewer vs `.oracle/` | _ | _ | _ | clean-room DST-04; expect lower discriminating power (A5) |

CONTEXT-ONLY (never the headline; labeled per D-08): any house-style / house-vocabulary number over
the produced test source is a vocabulary proxy and is reported, if at all, only as labeled context
with the artifact caveat applied SYMMETRICALLY to both arms.

## Unbiased reviewer (mandatory, D-10)

Per the CLAUDE.md skill-creator rule and memory `unbiased-review-beats-primed`, at least ONE review
agent with a NEUTRAL from-scratch brief (given NO prior findings, not primed with these numbers)
audits the grader source (`grade-red.mjs` + `merge-judge.mjs` + `tabulate-mechanical-red.mjs`) + a
sample of run transcripts + the reported numbers AFTER the gated run. This is the gate that caught the
Phase-20 ~3x vocabulary inflation. It is an ORCHESTRATOR-spawned step (the gsd-executor cannot spawn
subagents). Slot reserved; filled post-run.

| Reviewer | Brief | Scope | Verdict | Findings |
|----------|-------|-------|---------|----------|
| Reviewer-1 (pending) | from-scratch, unprimed (NO prior findings) | grade-red.mjs + merge-judge.mjs + tabulate-mechanical-red.mjs source; a sample of blinded test diffs + transcripts; the Pass@k/Pass^k + mechanical numbers | _ | _ |

## How to run (GATED -- user approval required; D-11 / D-12)

Every command that spends `claude -p` tokens is user-gated per the standing eval-run approval rule.
This phase RAN NONE of them. The full gated run procedure (target confirmation, arm fan-out, grading,
judge, merge/verify, unbiased review) lives in the phase's RUN-GATE plan (21-04). Paths are relative
to `.claude/skills/lz-red-workspace/` unless noted; `<repo>` = the repository root.

Instrument (offline, zero spend -- re-run any time to re-prove the build):

```
node selfcheck-red.mjs                       # composition + parity + worktree + parse + classifier + nx regression
                                             # + crux 7: the D-06 gate over a fabricated runDir against the
                                             #   kata's OWN toolchain (the REQUIRED zero-spend Step 2 canary)
node grade-red.mjs --selfcheck               # all 7 D-06 classes on fixtures
node tabulate-mechanical-red.mjs --selfcheck # mechanical rollup + auto-trigger + Pass@k/Pass^k on fixtures
node merge-judge.mjs --selfcheck             # judge-merge / fail-closed verify gate
```

Metered run (GATED -- see 21-04 for the full sequence; run only after explicit user approval):

```
# 0. give the throwaway kata checkout a toolchain FIRST (a fresh `git worktree add` has no
#    node_modules, so the model under test could not run the test it writes -- see RUN-GATE Step 3a):
npm --prefix "<throwaway kata branch checkout>/TypeScript" ci
# 1. drive the RED suite (3 arms x r1 x k), serial, one suite dir at a time:
node ../lz-refactor-workspace/e2e-nx/run-e2e.mjs --suite <this suite dir> \
  --mode apply --arm all --prompt r1 --runs 3 --cwd <throwaway kata branch checkout>
# 2. grade each captured run (D-06 gate -> red-grade.json):
node grade-red.mjs --run <runDir> --suite <this suite dir>
# 3. tabulate the mechanical dims + Pass@k/Pass^k on the correctness gate:
node tabulate-mechanical-red.mjs
# 4. ORCHESTRATOR: blind judge (<= 2 dims, blinded test code) + oracle-reviewer + merge/verify + the
#    mandatory unbiased-from-scratch reviewer; then fill every blank cell above.
```

Contamination flag per target: GRC = HIGH (correctness parity EXPECTED; smoke anchor, not a
discriminator). Flag every confirmed target's contamination in its row so a tie is read correctly.
