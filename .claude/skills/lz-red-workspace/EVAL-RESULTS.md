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

**Status: NOT RUN.** Every number below is intentionally blank. The measurement spends `claude -p`
tokens and is user-gated (D-11 HARD GATE) -- the results are filled ONLY after an explicit
user-approved run. See "How to run (GATED)" at the end of this file. D-09 tuning: not yet evaluated
(applied at most once, only if a soft bar below is missed on a demonstrated defect).

## EVL-01 forward -- Trigger accuracy (lz-red, native harness, canary-validated)

Recall = fraction of `should_trigger:true` queries that FIRED (`trigger_rate >= 0.5`).
Specificity = fraction of `should_trigger:false` queries that stayed QUIET (`trigger_rate < 0.5`).
Set: `evals/trigger-eval.json` (12 should-trigger RED prompts + 12 near-miss negatives; the negatives
draw from BOTH sibling seams -- 3 lz-tpp green-step + 3 lz-refactor refactor-step -- plus 6 generic).

| Metric | Result | D-08 bar (0.0.1 / 0.0.2 = 100%) |
|--------|--------|---------------------------------|
| Should-trigger RECALL (rate >= 0.5) |  | 100% (12/12) |
| Near-miss SPECIFICITY (rate < 0.5)  |  | 100% (12/12) |

*(Result column intentionally blank; filled only after the user-approved run -- D-11.)*

### Per-query recall (should_trigger:true; canary = "how should i structure this unit test")

| # | Query (abbreviated) | In-scope facet | trigger_rate | fired? |
|---|---------------------|----------------|--------------|--------|
| T1 | starting a new `slugify(title)` from scratch, tests-first | Selection: starter case |  |  |
| T2 | tdd on `discount`, 10%-off green, whats the next test | Selection: triangulation |  |  |
| T3 | how should i structure this unit test (CANARY) | Structure: AAA/GWT |  |  |
| T4 | what should i actually assert here? returns a number | Assertion: output-based |  |  |
| T5 | `OrderService` notifies a mailer -- assert and mock? | Assertion: communication |  |  |
| T6 | is `test('works')` a good name for this? | Naming |  |  |
| T7 | keep a test list for this markdown parser feature | Selection: test list |  |  |
| T8 | brand-new test went green on the first run -- problem? | Fail-for-the-right-reason |  |  |
| T9 | how do i match this codebase's testing stance | Stance: house idiom |  |  |
| T10 | legacy `PriceCalculator`, global clock, first test | Stance: seams-and-legacy |  |  |
| T11 | is this a good test asserting a private field? | Assertion: observable behavior |  |  |
| T12 | what should i test here? (bare, small pure fn) | Low-signal catch-all |  |  |

### Per-query specificity (should_trigger:false; both siblings' seams + generic)

| # | Query (abbreviated) | Seam / kind | trigger_rate | quiet? |
|---|---------------------|-------------|--------------|--------|
| N1 | smallest edit to get this red test passing? | lz-tpp green-step |  |  |
| N2 | minimal transformation to green it | lz-tpp green-step |  |  |
| N3 | which change makes this failing test pass | lz-tpp green-step |  |  |
| N4 | 60-line fn, tests pass -- which named refactoring | lz-refactor refactor-step |  |  |
| N5 | green bar, copy-pasted block -- how to de-duplicate | lz-refactor refactor-step |  |  |
| N6 | tests green, messy module -- what would you refactor | lz-refactor refactor-step |  |  |
| N7 | write a debounce helper in typescript | generic write-a-function |  |  |
| N8 | add pagination to GET /users in this express app | generic feature work |  |  |
| N9 | explain the SOLID principles with examples | design-principle adjacent |  |  |
| N10 | CSV parse throws on empty rows -- find the bug | debugging |  |  |
| N11 | time and space complexity of this merge sort | analysis |  |  |
| N12 | run my whole test suite and tell me which fail | test execution |  |  |

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
| RED positives that lz-tpp stays QUIET on (rate < 0.5) |  | 100% (12/12) |

### lz-refactor specificity over the RED positives (`--skill-path .../lz-refactor`)

| Metric | Result | bar |
|--------|--------|-----|
| RED positives that lz-refactor stays QUIET on (rate < 0.5) |  | 100% (12/12) |

*(Result columns intentionally blank; filled only after the user-approved run -- D-11.)*

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

*(Result columns intentionally blank; filled only after the user-approved run -- D-11.)*

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
| overall (12 positives) |  |  |  |  |  |  |  |  |  |

### EVL-01 forward -- specificity (per query + overall)

| Unit | n | c | Pass@1 | Pass@3 | Pass@5 | Pass^1 | Pass^3 | Pass^5 | saturated? |
|------|---|---|--------|--------|--------|--------|--------|--------|------------|
| overall (12 negatives) |  |  |  |  |  |  |  |  |  |

### EVL-01 reciprocal -- sibling specificity (per sibling + overall)

| Unit | n | c | Pass@1 | Pass@3 | Pass@5 | Pass^1 | Pass^3 | Pass^5 | saturated? |
|------|---|---|--------|--------|--------|--------|--------|--------|------------|
| lz-tpp (12 RED positives quiet) |  |  |  |  |  |  |  |  |  |
| lz-refactor (12 RED positives quiet) |  |  |  |  |  |  |  |  |  |

### EVL-02 -- behavior (per scenario x config + overall)

| Unit | config | n | c | Pass@1 | Pass@3 | Pass@5 | Pass^1 | Pass^3 | Pass^5 | saturated? |
|------|--------|---|---|--------|--------|--------|--------|--------|--------|------------|
| overall | with_skill |  |  |  |  |  |  |  |  |  |
| overall | baseline |  |  |  |  |  |  |  |  |  |

*(All Pass@k / Pass^k cells intentionally blank; computed from the run at
`iteration-1/passk-metrics.json` and filled only after the user-approved run -- D-11. Per-query and
per-scenario rows are appended at fill time; the overall rows anchor the table shape here.)*

## Verdict (filled after the gated run)

- **Trigger (EVL-01 forward):** PENDING -- (recall / specificity vs the 100% D-08 bar; the lz-tpp and
  lz-refactor seams must both hold).
- **Trigger (EVL-01 reciprocal):** PENDING -- (both siblings must stay quiet on the RED positives).
- **Behavior (EVL-02):** PENDING -- (with_skill Pass@1 high AND clearly beating the unaided baseline,
  read against the saturation caveat).
- **D-09 tuning:** PENDING -- applied at most once and only on a demonstrated defect (see below).

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
