# lz-red Skill Effectiveness Evals -- Results

Phase 20 (optional-final, NON-BLOCKING). Measures the shipped `lz-red` skill on three axes:
EVL-01 forward (does the `description` trigger correctly on RED-phase intent?), EVL-01 reciprocal
(do the two siblings stay quiet on RED prompts?), and EVL-02 (when triggered, does the coach
recommend the correct next RED move -- selection, structure, assertion target, fail-for-the-right-
reason, handoff, coach-don't-drive?). Nothing here can regress the shipped skill; it feeds at most a
single gated D-09 tuning pass, and only on a demonstrated defect.

Skill under test: `plugins/lz-tdd/skills/lz-red`. Milestone lz-tdd@0.0.3.

## Run configuration (locked -- the exact config that fixed Phase-5's false 8%-recall artifact)

- **Model:** `claude-opus-4-8` (the session model users experience).
- **Runs:** 3 per query / scenario / config (D-07); Pass@k / Pass^k over the run count.
- **Serial:** `--num-workers 1` (concurrent probes throttle and read as false non-triggers -- Pitfall 1).
- **Ponytail:** `PONYTAIL_DEFAULT_MODE=off` (do not let the lazy-mode default perturb the probe).
- **MCP + sibling plugins stripped:** `--strict-mcp-config` + `--setting-sources project` (baked into
  `run_eval.py`) drop MCP servers and the user-level plugin skills so no real sibling skill
  (`lz-tpp` / `lz-refactor` / `lz-red`) steals the probe; the ephemeral project skill is kept.
- **Throttle-robust measurement:** prefer the canary-gated chunk runners; a chunk is trusted ONLY
  when its appended positive canary fired (`trigger_rate >= 0.5`), proving a non-throttled window.

**Status: EVL-01 RUN 2026-07-21 (user-approved; forward + reciprocal only).** EVL-02 behavior and its
Pass@k tables remain intentionally blank -- the user approved EVL-01 and paused before the heavy EVL-02
fan-out. EVL-01 headline: forward recall 11/12 = 92% (query-level; run-level Pass@1 0.96), forward
specificity 12/12 = 100%, reciprocal lz-tpp 12/12 quiet, reciprocal lz-refactor 12/12 quiet. Every one
of the 7 forward chunks was canary-validated (the appended positive fired 3/3 in each), so no result
rests on a throttled window. One recall miss sits below the 100% D-08 bar: T9 (house-idiom /
testing-stance) fired 1/3. That is a demonstrated, NON-blocking defect and the sole D-09 tuning
candidate; D-09 tuning was NOT applied (user paused after EVL-01). Raw evidence (git-ignored):
`trigger-results-d07-{recall,spec}-chunk-*.json` + `reciprocal-lz-{tpp,refactor}.json`.

## EVL-01 forward -- Trigger accuracy (lz-red, native harness, canary-validated)

Recall = fraction of `should_trigger:true` queries that FIRED (`trigger_rate >= 0.5`).
Specificity = fraction of `should_trigger:false` queries that stayed QUIET (`trigger_rate < 0.5`).
Set: `evals/trigger-eval.json` (12 should-trigger RED prompts + 12 near-miss negatives; the negatives
draw from BOTH sibling seams -- 3 lz-tpp green-step + 3 lz-refactor refactor-step -- plus 6 generic).

| Metric | Result | D-08 bar (0.0.1 / 0.0.2 = 100%) |
|--------|--------|---------------------------------|
| Should-trigger RECALL (rate >= 0.5) | 92% (11/12) -- MISS by 1 (T9) | 100% (12/12) |
| Near-miss SPECIFICITY (rate < 0.5)  | 100% (12/12) | 100% (12/12) |

*(Run 2026-07-21, all chunks canary-validated. RECALL misses the 100% bar on T9 only; see the D-09 candidate below.)*

### Per-query recall (should_trigger:true; canary = "how should i structure this unit test")

| # | Query (abbreviated) | In-scope facet | trigger_rate | fired? |
|---|---------------------|----------------|--------------|--------|
| T1 | starting a new `slugify(title)` from scratch, tests-first | Selection: starter case | 1.00 (3/3) | yes |
| T2 | tdd on `discount`, 10%-off green, whats the next test | Selection: triangulation | 1.00 (3/3) | yes |
| T3 | how should i structure this unit test (CANARY) | Structure: AAA/GWT | 1.00 (12/12) | yes |
| T4 | what should i actually assert here? returns a number | Assertion: output-based | 1.00 (3/3) | yes |
| T5 | `OrderService` notifies a mailer -- assert and mock? | Assertion: communication | 1.00 (3/3) | yes |
| T6 | is `test('works')` a good name for this? | Naming | 1.00 (3/3) | yes |
| T7 | keep a test list for this markdown parser feature | Selection: test list | 1.00 (3/3) | yes |
| T8 | brand-new test went green on the first run -- problem? | Fail-for-the-right-reason | 1.00 (3/3) | yes |
| T9 | how do i match this codebase's testing stance | Stance: house idiom | 0.33 (1/3) | NO -- miss |
| T10 | legacy `PriceCalculator`, global clock, first test | Stance: seams-and-legacy | 1.00 (3/3) | yes |
| T11 | is this a good test asserting a private field? | Assertion: observable behavior | 1.00 (3/3) | yes |
| T12 | what should i test here? (bare, small pure fn) | Low-signal catch-all | 1.00 (3/3) | yes |

### Per-query specificity (should_trigger:false; both siblings' seams + generic)

| # | Query (abbreviated) | Seam / kind | trigger_rate | quiet? |
|---|---------------------|-------------|--------------|--------|
| N1 | smallest edit to get this red test passing? | lz-tpp green-step | 0.00 (0/3) | yes |
| N2 | minimal transformation to green it | lz-tpp green-step | 0.00 (0/3) | yes |
| N3 | which change makes this failing test pass | lz-tpp green-step | 0.00 (0/3) | yes |
| N4 | 60-line fn, tests pass -- which named refactoring | lz-refactor refactor-step | 0.00 (0/3) | yes |
| N5 | green bar, copy-pasted block -- how to de-duplicate | lz-refactor refactor-step | 0.00 (0/3) | yes |
| N6 | tests green, messy module -- what would you refactor | lz-refactor refactor-step | 0.00 (0/3) | yes |
| N7 | write a debounce helper in typescript | generic write-a-function | 0.00 (0/3) | yes |
| N8 | add pagination to GET /users in this express app | generic feature work | 0.00 (0/3) | yes |
| N9 | explain the SOLID principles with examples | design-principle adjacent | 0.00 (0/3) | yes |
| N10 | CSV parse throws on empty rows -- find the bug | debugging | 0.00 (0/3) | yes |
| N11 | time and space complexity of this merge sort | analysis | 0.00 (0/3) | yes |
| N12 | run my whole test suite and tell me which fail | test execution | 0.00 (0/3) | yes |

### EVL-01 rate-limit artifact (harness lesson to reconfirm at run time)

A single large serial pass under a tight rate window UNDER-reads recall (a throttled `claude -p`
probe never completes the skill invocation and reads as a false non-trigger -- the Phase-5 /
Phase-11 artifact). Validate recall/specificity via the canary-gated chunk runners
(`run-recall-chunks.mjs`, `run-spec-chunks.mjs`); a chunk counts only when its appended positive
canary fired. Asymmetry: specificity is throttle-robust (a throttled negative still reads "quiet" =
pass); recall is NOT. Raw evidence at run time: `trigger-results-d07-recall-chunk-*.json`,
`trigger-results-d07-spec-chunk-*.json` (git-ignored).

## EVL-01 reciprocal RED spot-check (D-03.2 -- the genuinely new coverage)

Run the harness against each SIBLING skill-path, feeding the 12 lz-red RED positives re-tagged
`should_trigger:false` (`evals/reciprocal-red.json`, byte-consistent with the trigger positives). This
is a SPECIFICITY measurement: both siblings must stay QUIET on RED intent. No prior phase measured
this -- `lz-tpp` (Phase 5) and `lz-refactor` (Phase 11) were eval'd BEFORE any RED prompts existed, so
whether adding `lz-red` leaves them mis-firing on RED intent was never checked. Bounded spot-check,
NOT a full 3x3 confusion matrix. If a sibling FIRES on a RED positive, that is a bounded, non-blocking
D-09 tuning candidate on THAT sibling's description (never a blocker; never reopens Phases 15-19).

### lz-tpp specificity over the RED positives (`--skill-path .../lz-tpp`)

| Metric | Result | bar |
|--------|--------|-----|
| RED positives that lz-tpp stays QUIET on (rate < 0.5) | 12/12 (100%) | 100% (12/12) |

### lz-refactor specificity over the RED positives (`--skill-path .../lz-refactor`)

| Metric | Result | bar |
|--------|--------|-----|
| RED positives that lz-refactor stays QUIET on (rate < 0.5) | 12/12 (100%) | 100% (12/12) |

*(Run 2026-07-21: both siblings stayed quiet on all 12 RED positives -- trigger_rate 0.00 each. The genuinely-new cross-skill coverage is clean; no sibling D-09 candidate.)*

**Canary caveat for the reciprocal probe:** the canary-gated chunk runners
(`run-recall-chunks.mjs` / `run-spec-chunks.mjs`) are NOT used for the reciprocal spot-check. Their
appended canary is a lz-red should-trigger positive ("how should i structure this unit test"); on a
sibling skill-path that canary would (correctly) NOT fire, so it cannot certify a healthy window
there. The reciprocal probe is run via the direct `run_eval` invocation (see "How to run"). Because
specificity is throttle-robust (a throttled prompt still reads "quiet" = pass) the direct probe is
sound for this measurement; a throttled window can only make a sibling look quieter, never louder.

## EVL-02 -- RED-behavior / next-move (with_skill vs baseline, 3 runs each)

Free-drive coach subagents in isolated context; fail-closed deterministic grade (RED phrase-set
matchers, negation-aware, + nodrive) -> independent blind LLM judge (exactly two dimensions:
"is THIS the right next test" + "is the asserted target observable behavior, not implementation")
-> merge -> verify -> aggregate. A run "fully passes" only when ALL its expectations pass (every
scored phrase-set dimension + both judge dimensions + nodrive). Set: `evals/evals.json` (10
leaf-grounded RED-situation scenarios, ids 0-9; every scenario's ground truth is pinned to a shipped
`lz-red` reference example).

| id | Scenario (RED situation) -> expected move | Primary dimension(s) | with_skill Pass@1 | baseline Pass@1 |
|----|-------------------------------------------|----------------------|-------------------|-----------------|
| 0 | new `sumOf(values)`, nothing written -> degenerate/starter case + AAA | Selection + Structure |  |  |
| 1 | `isEven` one example green, impl is `return true` -> triangulate | Selection: triangulation |  |  |
| 2 | pure `netOf(total, discount)` -> output-based assert, no doubles | Assertion: output-based |  |  |
| 3 | `Gate` notifies an injected notifier -> expect-to-send, do not mock the query | Assertion: communication + over-mock |  |  |
| 4 | `ShoppingCart.addItem` -> state-based assert through the public surface | Assertion: state-based |  |  |
| 5 | legacy `PriceCalculator` welded to a clock -> seam + characterization first | Assertion: characterization + Selection |  |  |
| 6 | test went green immediately (false green) -> sharpen to fail on assertion | Fail-for-the-right-reason |  |  |
| 7 | new `slugify`, "just advice" (QUESTION) -> present the test, do not write it | Coach-don't-drive |  |  |
| 8 | `isPalindrome` "write the red test, do not make it pass" (COMMAND) -> write then stop, hand green to lz-tpp | Handoff + Coach-don't-drive |  |  |
| 9 | `parseAmount` green + messy + uncovered case (classify-first boundary) -> new RED test, not refactor/green | Selection: classify-first |  |  |

*(EVL-02 DEFERRED -- not run. The user approved EVL-01 (trigger) only and paused before this behavior
benchmark. Result columns stay blank until a further explicit approval; the ready-to-run sequence is
in "How to run (GATED)" below.)*

### Per-dimension detail (EVL-02)

For each scenario, the deterministic grader scores the mechanical dimensions (Selection / Structure /
Assertion-target / Fail-for-the-right-reason / Handoff / Coach-don't-drive) via negation-aware
phrase-set matchers; the LLM judge resolves exactly the two judgment-heavy dimensions. The filled
report records, per scenario x dimension x config, the pass count (n/3) and the merged verdict.

| id | dimension | check kind | with_skill (n/3) | baseline (n/3) |
|----|-----------|-----------|-------------------|----------------|
|    |           |           |                   |                |

*(One row per scenario-dimension is emitted by the grader at run time; left as a single blank
template row here. Populated from `iteration-1/eval-*/<config>/run-*/grading.json` after the run.)*

### Saturation (D-07 flag) -- an eval-DESIGN limitation, documented, NOT tuned away

`claude-opus-4-8` is a strong baseline. In Phase 11, 41 of 45 assertions were SATURATED
(Pass@1 = 1.0 for BOTH configs) and the entire skill-vs-baseline gap rested on a single designed
routing-boundary trap. The lz-red scenario set is leaf-sourced (ground truth proven in the shipped
references), so most straightforward scenarios are expected to saturate similarly. The discriminating
signal is expected to rest on the harder cases -- scenario 9 (classify-first boundary), scenario 3
(over-mock temptation), and scenario 6 (false green). Any Pass@1 = 1.0-for-both assertion is flagged
as saturated / non-discriminating in `iteration-1/passk-metrics.json` and is a candidate for a harder
future scenario. This is an eval-design limitation to record here, NOT a defect to tune away.

## Pass@k and Pass^k (D-07; CLAUDE.md skill-creator rule)

Reported per eval AND overall, for k = 1, 3, 5, and the total run count. Let n = total runs for the
unit and c = fully-correct runs (all expectations pass).

- **Pass@k (optimistic -- at least 1 of k samples fully passes):** `Pass@k = 1 - C(n - c, k) / C(n, k)`
- **Pass^k (conservative -- all k samples fully pass):** `Pass^k = C(c, k) / C(n, k)`

Rows for k = 5 and k = total apply only where the unit's run count supports them (>= 3 runs per unit
by D-07; a higher k row is left blank where n < k). A row where Pass@1 = 1.0 for both configs is
flagged saturated (see above).

### EVL-01 forward -- recall (per query + overall)

| Unit | n | c | Pass@1 | Pass@3 | Pass@5 | Pass^1 | Pass^3 | Pass^5 | saturated? |
|------|---|---|--------|--------|--------|--------|--------|--------|------------|
| T9 house-idiom (the miss) | 3 | 1 | 0.33 | 1.00 | - | 0.33 | 0.00 | - | no |
| other 11 positives (incl canary) | 42 | 42 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | yes |
| overall (12 positives) | 45 | 43 | 0.96 | 1.00 | 1.00 | 0.96 | 0.87 | 0.79 | no |

### EVL-01 forward -- specificity (per query + overall)

| Unit | n | c | Pass@1 | Pass@3 | Pass@5 | Pass^1 | Pass^3 | Pass^5 | saturated? |
|------|---|---|--------|--------|--------|--------|--------|--------|------------|
| overall (12 negatives) | 36 | 36 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | yes |

### EVL-01 reciprocal -- sibling specificity (per sibling + overall)

| Unit | n | c | Pass@1 | Pass@3 | Pass@5 | Pass^1 | Pass^3 | Pass^5 | saturated? |
|------|---|---|--------|--------|--------|--------|--------|--------|------------|
| lz-tpp (12 RED positives quiet) | 36 | 36 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | yes |
| lz-refactor (12 RED positives quiet) | 36 | 36 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | 1.00 | yes |

### EVL-02 -- behavior (per scenario x config + overall)

| Unit | config | n | c | Pass@1 | Pass@3 | Pass@5 | Pass^1 | Pass^3 | Pass^5 | saturated? |
|------|--------|---|---|--------|--------|--------|--------|--------|--------|------------|
| overall | with_skill |  |  |  |  |  |  |  |  |  |
| overall | baseline |  |  |  |  |  |  |  |  |  |

*(EVL-01 Pass@k / Pass^k filled from the 2026-07-21 run at RUN level: n = total runs, c = correct
runs. The canary positive was probed once per chunk (12 runs) so it carries proportional weight in the
recall pool -- overall recall n=45, not 36. EVL-02 rows stay blank; that benchmark was DEFERRED, not
run. When run, EVL-02 Pass@k is computed at `iteration-1/passk-metrics.json`.)*

## Verdict (filled after the gated run)

- **Trigger (EVL-01 forward):** SPECIFICITY PASS (12/12 = 100%; both sibling near-miss seams held).
  RECALL 92% (11/12) -- one facet below the 100% bar: T9 (house-idiom / testing-stance) fired 1/3.
  A soft, NON-blocking miss on a demonstrated defect.
- **Trigger (EVL-01 reciprocal):** PASS -- both siblings stayed fully quiet on the 12 RED positives
  (lz-tpp 12/12, lz-refactor 12/12; trigger_rate 0.00 each). The new cross-skill coverage is clean.
- **Behavior (EVL-02):** DEFERRED -- not run (the user approved EVL-01 only, then paused).
- **D-09 tuning:** CANDIDATE, NOT APPLIED -- the T9 recall miss is the one soft-bar miss on a
  demonstrated defect and thus a bounded D-09 description-widen candidate (must beat the current
  description on a HELD-OUT trigger set, stay under the 1536-char cap, own >= 1 unbiased review,
  /reload-plugins as a human ship action). Deferred to a user decision; not executed in this pass.

## Unbiased reviewer verdict (RESERVED -- >= 1 from-scratch reviewer, D-07)

Per the CLAUDE.md skill-creator rule and memory `unbiased-review-beats-primed`, at least one review
agent with a NEUTRAL from-scratch brief (no prior findings, not primed with these results) audits the
grader source + a sample of run transcripts + the reported numbers AFTER the gated run, so
grader/rubric bugs are caught rather than confirmed (this is the gate that caught the Phase-11 CR-01
grader leniency). This reviewer is an ORCHESTRATOR-spawned step -- the gsd-executor cannot spawn
subagents. Slot reserved; filled post-run.

| Reviewer | Brief | Scope | Verdict | Findings |
|----------|-------|-------|---------|----------|
| (reserved) | from-scratch, unprimed | grader source + sampled transcripts + reported numbers |  |  |

## How to run (GATED -- user approval required)

D-11 HARD GATE: every command below spends `claude -p` tokens (on the Claude plan, not a separate
metered pool) and is user-gated per the standing eval-run approval rule. This plan RAN NONE of them;
it presents them ready-to-run and HALTS. Run only after explicit user approval. Paths are relative to
`.claude/skills/lz-red-workspace/` unless noted; `<repo>` = the repository root.

### EVL-01 forward (lz-red trigger recall + specificity)

PREFERRED (any active / rate-limited session) -- the canary-gated chunk runners, from the workspace
root. Idempotent and resumable; a chunk counts ONLY when its appended positive canary fired (healthy,
non-throttled window):

```
node run-recall-chunks.mjs     # recall over the 12 should-trigger positives (resume-safe)
node run-spec-chunks.mjs       # specificity over the 12 near-miss negatives (resume-safe)
node run-recall-chunks.mjs --report   # print combined recall, run nothing
node run-spec-chunks.mjs --report     # print combined specificity, run nothing
```

DIRECT PROBE (only in a demonstrably healthy window) -- from `tools/skill-creator-eval/`:

```
PONYTAIL_DEFAULT_MODE=off python -m scripts.run_eval \
  --eval-set ../../evals/trigger-eval.json \
  --skill-path <repo>/plugins/lz-tdd/skills/lz-red \
  --model claude-opus-4-8 --runs-per-query 3 --num-workers 1
```

(`--strict-mcp-config` + `--setting-sources project` are baked into `run_eval.py`.) Asymmetry: recall
is throttle-SENSITIVE (a throttled probe reads as a false non-trigger and sinks recall -- the Phase-5
/ Phase-11 artifact), specificity is throttle-ROBUST (a throttled negative still reads "quiet" =
pass). A single large serial pass under load UNDER-reads recall; trust a chunk's data only when its
canary fired.

### EVL-01 reciprocal RED spot-check (D-03.2 -- run the DIRECT probe TWICE)

From `tools/skill-creator-eval/`, feed the RED positives (re-tagged `should_trigger:false`) to EACH
sibling skill-path and assert ~100% specificity (both siblings stay quiet on RED intent):

```
# lz-tpp must stay quiet on RED prompts
PONYTAIL_DEFAULT_MODE=off python -m scripts.run_eval \
  --eval-set ../../evals/reciprocal-red.json \
  --skill-path <repo>/plugins/lz-tdd/skills/lz-tpp \
  --model claude-opus-4-8 --runs-per-query 3 --num-workers 1

# lz-refactor must stay quiet on RED prompts
PONYTAIL_DEFAULT_MODE=off python -m scripts.run_eval \
  --eval-set ../../evals/reciprocal-red.json \
  --skill-path <repo>/plugins/lz-tdd/skills/lz-refactor \
  --model claude-opus-4-8 --runs-per-query 3 --num-workers 1
```

The canary-gated runners are NOT used for the reciprocal probe. Their appended canary is a lz-red
should-trigger positive; on a sibling skill-path it would (correctly) not fire, so it cannot certify a
window there. The reciprocal probe is a specificity measurement, which is throttle-robust, so the
direct probe is sound (a throttled window can only make a sibling look quieter, never louder). If a
sibling FIRES on a RED positive, that is a bounded, non-blocking D-09 tuning candidate on THAT
sibling's description -- never a blocker, never a Phases-15-19 reopening.

### EVL-02 behavior (ORCHESTRATOR-driven, post-approval -- the executor cannot spawn subagents)

The gsd-executor has only Read/Write/Edit/Bash/Grep/Glob/Skill and cannot spawn subagents; the entire
EVL-02 fan-out, the LLM judge, and the unbiased reviewer are ORCHESTRATOR steps that run only after
user approval (memory `gsd-executor-cannot-spawn-subagents`). Sequence:

1. **Fan-out:** spawn UNNAMED / fire-and-forget subagents per scenario (ids 0-9) x config
   (`with_skill` vs `no_skill`) x run (>= 3), each in an ISOLATED scratch cwd (ground-truths "did the
   coach drive?"). Each writes `outputs/transcript.md` + `metrics.json` under
   `iteration-1/eval-<id>/<config>/run-<n>/` (memory `eval02-subagent-orchestration-mechanic`).
2. **Wait for ALL completion notifications BEFORE grading.** `total_tokens` / `duration_ms` arrive
   only at completion and cannot be recovered later; persist timing as each notification arrives
   (D-07; memory `skill-creator eval` workflow rule). Do not poll / grade early.
3. **Deterministic grade:** `node grade-run.mjs` over each run dir -> `grading.json`, or
   `grading.preliminary.json` while judge items remain (fail-closed).
4. **LLM judge:** the installed skill-creator grader agent resolves EXACTLY the two judgment
   dimensions ("is THIS the right next test", "is the asserted target observable behavior, not
   implementation") -> `judge-verdicts.json`. Judge-string provenance: read the `judge_required`
   strings from each emitted `grading.preliminary.json`; NEVER transcribe judge strings by hand
   (`merge-judge --merge` rejects a verdict whose text does not byte-match the grader's string).
5. **Merge + gate:** `node merge-judge.mjs --merge --preliminary <grading.preliminary.json>
   --verdicts <judge-verdicts.json> --out <grading.json>`, then the pre-aggregate gate
   `node merge-judge.mjs --verify iteration-1` (exit non-zero = do NOT aggregate; a scored-only run
   is a silent false pass otherwise -- Pitfall 4).
6. **Aggregate + report:** `python -m scripts.aggregate_benchmark iteration-1 --skill-name lz-red`
   (installed skill-creator) -> `iteration-1/benchmark.json` + `benchmark.md` +
   `iteration-1/passk-metrics.json`; then `eval-viewer/generate_review.py` for the review view.
7. **Fill + review:** compute Pass@k / Pass^k per eval + overall, fill every blank cell above, then
   run >= 1 unbiased-from-scratch reviewer over the grader source + a sample of transcripts + the
   reported numbers (memory `unbiased-review-beats-primed`) and record the verdict in the reserved
   slot. All ORCHESTRATOR-driven, never the gsd-executor.

## D-08 soft pass bars (non-blocking) and the at-most-one D-09 tuning pass (conditional)

**D-08 soft bars (SOFT, tunable, NON-blocking -- missing a bar NEVER reopens Phases 15-19):**

- Trigger (EVL-01 forward): 100% recall AND 100% specificity (the 0.0.1 / 0.0.2 bar), with BOTH
  sibling near-miss seams (lz-tpp green-step and lz-refactor refactor-step) staying quiet.
- Trigger (EVL-01 reciprocal): both siblings quiet on the RED positives (~100% specificity).
- Behavior (EVL-02): with_skill correct-move Pass@1 high AND clearly beating the unaided baseline,
  read against the saturation caveat (a strong baseline may saturate the leaf-sourced scenarios; the
  discriminating signal rests on the classify-first / over-mock / false-green cases).

**D-09 tuning pass (AT MOST ONE, tightly bounded, and only if a bar is missed on a DEMONSTRATED
defect):**

- Description: apply a widened / tuned `description` to `plugins/lz-tdd/skills/lz-red/SKILL.md`
  frontmatter ONLY if it beats the current one on a HELD-OUT trigger set (show before/after + scores);
  it must stay under the 1536-char listing cap.
- Behavior: a bounded wording tweak to the SKILL.md coach decision procedure ONLY on a real routing /
  RED-move defect. NO new reference files; NO re-authoring the LOCKED reference content (all
  references + testing-stance leaves stay frozen); NO scope expansion.
- A D-09 edit is the ONLY write-back into `plugins/`. Any SKILL.md edit gets its OWN >= 1
  unbiased-from-scratch subagent review before acceptance (memory
  `agent-skill-instruction-changes-need-review`), and `/reload-plugins` is a HUMAN ship action
  afterward (memory `reload-plugins-after-oracle-agent-changes`). No self-feeding re-eval loops; once
  the eval + optional tuning pass is committed, the phase is complete. If the skill already meets the
  bars, NO tuning pass is applied and these evals stand as a validation record (the Phase-5 /
  Phase-11 outcome).

## STATUS -- EVL-01 done, EVL-02 deferred

EVL-01 forward + reciprocal RAN 2026-07-21 under explicit user approval (forward recall 92%,
specificity 100%; both siblings 100% quiet; every chunk canary-validated). The user then PAUSED.
STILL NOT RUN -- await a further explicit approval before executing the matching "How to run (GATED)"
commands: the EVL-02 behavior benchmark (the ORCHESTRATOR fan-out + LLM judge + >= 1 unbiased reviewer)
and the conditional at-most-one D-09 tuning pass (the T9 recall miss is the sole candidate). No
`claude -p` beyond the approved EVL-01 probes has run.
