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
testing-stance) fired 1/3. That was the sole D-09 tuning candidate. D-09 tuning APPLIED 2026-07-21
(further user approval): the house-idiom description clause was widened and validated on an INDEPENDENT
held-out set (recall 5/6 -> 6/6, specificity 6/6 held, unbiased review PASS); these EVL-01 forward
numbers are the PRE-widen measurement, and `/reload-plugins` is the pending human ship action. Raw
evidence (git-ignored): `trigger-results-d07-{recall,spec}-chunk-*.json`,
`reciprocal-lz-{tpp,refactor}.json`, `heldout-d09-{current,new}.json`.

## EVL-01 forward -- Trigger accuracy (lz-red, native harness, canary-validated)

Recall = fraction of `should_trigger:true` queries that FIRED (`trigger_rate >= 0.5`).
Specificity = fraction of `should_trigger:false` queries that stayed QUIET (`trigger_rate < 0.5`).
Set: `evals/trigger-eval.json` (12 should-trigger RED prompts + 12 near-miss negatives; the negatives
draw from BOTH sibling seams -- 3 lz-tpp green-step + 3 lz-refactor refactor-step -- plus 6 generic).

| Metric | Result | D-08 bar (0.0.1 / 0.0.2 = 100%) |
|--------|--------|---------------------------------|
| Should-trigger RECALL (rate >= 0.5) | 92% (11/12) -- MISS by 1 (T9) | 100% (12/12) |
| Near-miss SPECIFICITY (rate < 0.5)  | 100% (12/12) | 100% (12/12) |

*(Run 2026-07-21, all chunks canary-validated, on the PRE-D-09 description. RECALL missed the 100% bar on T9 (house-idiom) only; the D-09 widen below targets that facet and was applied + held-out-validated.)*

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
matchers, negation-aware, + nodrive) -> independent LLM judge (exactly two dimensions:
"is THIS the right next test" + "is the asserted target observable behavior, not implementation")
-> merge -> verify -> aggregate. A run "fully passes" only when ALL its expectations pass (every
scored phrase-set dimension + both judge dimensions + nodrive). Set: `evals/evals.json` (10
leaf-grounded RED-situation scenarios, ids 0-9; every scenario's ground truth is pinned to a shipped
`lz-red` reference example).

**Read the SUBSTANCE-ONLY numbers as the headline, not the full-run numbers.** The unbiased review
(below) established that the deterministic phrase-set dimensions measure the skill's HOUSE VOCABULARY
as a proxy for correctness, and that proxy systematically false-fails the baseline, which gives
substantively-correct answers in its own words. Dropping the leaky phrase-set proxy and scoring only
the substance dimensions (the 2 LLM-judge dimensions + nodrive) gives the honest, config-fair result:
**with_skill 29/30 (Pass@1 0.97) vs baseline 26/30 (0.87)** -- the skill still wins, but by ~+10 pts,
concentrated in exactly two scenarios (eval-8 COMMAND handoff/coach-don't-drive, eval-9 classify-first
RED boundary). The full-run Pass@1 (0.87 vs 0.50) below is retained for completeness but is
vocabulary-inflated; it overstates the effect ~3x. The judge was NOT blinded to config (with_skill
transcripts self-identify via "lz-red"/"Law 1-3"/"message-matrix"); no bias symptom appeared (the
judge failed a with_skill run on eval-9 and passed the baseline on eval-3's over-mock judgment), but
the un-blindability is a design flaw to fix before relying on judge deltas.

Full-run Pass@1 = fraction of the 3 runs where EVERY expectation (all scored phrase-set dimensions +
both judge dimensions + nodrive) passed. n = 3 per cell.

| id | Scenario (RED situation) -> expected move | Primary dimension(s) | with_skill Pass@1 | baseline Pass@1 | discriminating? |
|----|-------------------------------------------|----------------------|-------------------|-----------------|-----------------|
| 0 | new `sumOf(values)`, nothing written -> degenerate/starter case + AAA | Selection + Structure | 1.00 (3/3) | 0.33 (1/3) | yes |
| 1 | `isEven` one example green, impl is `return true` -> triangulate | Selection: triangulation | 1.00 (3/3) | 1.00 (3/3) | saturated |
| 2 | pure `netOf(total, discount)` -> output-based assert, no doubles | Assertion: output-based | 1.00 (3/3) | 0.33 (1/3) | yes |
| 3 | `Gate` notifies an injected notifier -> expect-to-send, do not mock the query | Assertion: communication + over-mock | 0.00 (0/3) * | 0.33 (1/3) * | grader artifact |
| 4 | `ShoppingCart.addItem` -> state-based assert through the public surface | Assertion: state-based | 1.00 (3/3) | 0.33 (1/3) | yes |
| 5 | legacy `PriceCalculator` welded to a clock -> seam + characterization first | Assertion: characterization + Selection | 1.00 (3/3) | 0.67 (2/3) | yes |
| 6 | test went green immediately (false green) -> sharpen to fail on assertion | Fail-for-the-right-reason | 1.00 (3/3) | 0.67 (2/3) | yes |
| 7 | new `slugify`, "just advice" (QUESTION) -> present the test, do not write it | Coach-don't-drive | 1.00 (3/3) | 1.00 (3/3) | saturated |
| 8 | `isPalindrome` "write the red test, do not make it pass" (COMMAND) -> write then stop, hand green to lz-tpp | Handoff + Coach-don't-drive | 1.00 (3/3) | 0.00 (0/3) | yes |
| 9 | `parseAmount` green + messy + uncovered case (classify-first boundary) -> new RED test, not refactor/green | Selection: classify-first | 0.67 (2/3) | 0.33 (1/3) | yes |

*(EVL-02 RAN 2026-07-22 under explicit user approval. ORCHESTRATOR-driven: 60 coach subagents [10
scenarios x {with_skill, no_skill} x 3 runs] in isolated scratch sandboxes; deterministic grade ->
independent LLM judge [exactly the 2 locked judgment dimensions] -> merge -> verify [exit 0] ->
aggregate. Run config per the lock: claude-opus-4-8, 3 runs, serial, PONYTAIL forced off via an
explicit normal-mode directive in every subagent [the env-var lock does not reach in-session
subagents]. `with_skill` read the shipped D-09-widened SKILL.md + references on demand; `no_skill`
answered from base knowledge. The `with_skill Pass@1` / `baseline Pass@1` columns above are FULL-RUN
[all dimensions] and are vocabulary-inflated -- see the substance reframe below.)*

**The "discriminating?" column above is FULL-RUN discriminating, which is vocabulary-sensitive.** The
unbiased review showed that five of the eight "yes" rows (eval-0, 2, 4, 5, 6) are actually
SUBSTANCE-TIES: the baseline is substantively correct (LLM-judge + nodrive all pass 3/3) and only
misses the mechanical phrase-set because it words the same correct idea differently (e.g. "assert the
**return** value" vs the matcher's "return**ed** value"; AAA written as `// Arrange // Act // Assert`
comments; "there's nothing to mock" instead of "no double"). eval-3 is the same class of artifact
(both arms). Applying that artifact caveat SYMMETRICALLY (not just upward for with_skill), the honest
substance-only outcome is:

- **Substance ties (both arms 3/3 on judge+nodrive):** eval-0, 1, 2, 3, 4, 5, 6, 7 -- 8 scenarios.
  Base `claude-opus-4-8` already gives correct RED coaching here; the skill's measured edge on these
  is house vocabulary, not substance.
- **Substance wins for the skill:** eval-8 (COMMAND: write the red test then STOP + hand green to
  lz-tpp -- baseline substance 1/3, it drives to green or drops the handoff) and eval-9 (classify-first
  RED boundary -- baseline substance 1/3, it refactors/greens instead of writing the new failing test).
  These two are genuine, judge-verified behavior gaps the skill closes.

So the defensible claim is: **the skill reliably changes behavior on the RED-discipline cases a strong
base model gets wrong (handoff-without-driving, classify-first), and elsewhere mostly imposes its
vocabulary.** The full-run 0.87-vs-0.50 gap is an artifact of the vocabulary proxy and is NOT the
headline.

### Per-dimension detail (EVL-02)

For each scenario, the deterministic grader scores the mechanical dimensions (Selection / Structure /
Assertion-target / Fail-for-the-right-reason / Handoff / Coach-don't-drive) via negation-aware
phrase-set matchers; the LLM judge resolves exactly the two judgment-heavy dimensions. The filled
report records, per scenario x dimension x config, the pass count (n/3) and the merged verdict.

Only the dimensions where at least one config scored below 3/3 are listed (the discriminating ones).
Every dimension not listed scored 3/3 for BOTH configs, and the `nodrive` ("coach, don't drive")
dimension passed 3/3 for all 60 runs (every isolated `work/` sandbox stayed empty -- no run edited a
file or ran a suite).

| id | dimension | check kind | with_skill (n/3) | baseline (n/3) |
|----|-----------|-----------|-------------------|----------------|
| 0 | Shapes the test arrange-act-assert (or given-when-then) | phraseSet | 3/3 | 1/3 |
| 2 | Names an output-based assertion (assert the returned value) | phraseSet | 3/3 | 1/3 |
| 3 | Says the query needs no double / only the outgoing command warrants one | phraseSet | 0/3 * | 1/3 * |
| 3 | Reserves the double for the one outgoing command; refuses to mock the query (over-mock) | judge | 3/3 | 3/3 |
| 4 | Asserts through the public surface with no double | phraseSet | 3/3 | 1/3 |
| 5 | Names finding a seam to make the behavior reachable | phraseSet | 3/3 | 2/3 |
| 6 | Sharpened test must fail on its assertion (AssertionError on the value) | phraseSet | 3/3 | 2/3 |
| 8 | Frames making it pass as the green step (hands off to lz-tpp) | phraseSet | 3/3 | 1/3 |
| 8 | On a command, writes a test that fails on its assertion, then stops (no drive to green) | judge | 3/3 | 1/3 |
| 9 | Parks the tidy-up as a separate lz-refactor concern (after green) | phraseSet | 3/3 | 2/3 |
| 9 | Correct next move is a NEW failing test for the uncovered behavior (RED), not refactor/green | judge | 2/3 | 1/3 |

`*` eval-3 phrase-set false-negative (see the headline note): the mechanical `noOverMock` matcher
misses correct paraphrases; the eval-3 **judge** dimension -- the real over-mock judgment -- is 3/3 for
`with_skill`. This dim fails on both arms and is config-independent.

### Saturation (D-07 flag) -- an eval-DESIGN limitation, documented, NOT tuned away

`claude-opus-4-8` is a strong baseline. In Phase 11, 41 of 45 assertions were SATURATED
(Pass@1 = 1.0 for BOTH configs) and the entire skill-vs-baseline gap rested on a single designed
routing-boundary trap. The lz-red scenario set is leaf-sourced (ground truth proven in the shipped
references), so most straightforward scenarios are expected to saturate similarly. The discriminating
signal is expected to rest on the harder cases -- scenario 9 (classify-first boundary), scenario 3
(over-mock temptation), and scenario 6 (false green). Any Pass@1 = 1.0-for-both assertion is flagged
as saturated / non-discriminating in `iteration-1/passk-metrics.json` and is a candidate for a harder
future scenario. This is an eval-design limitation to record here, NOT a defect to tune away.

**Actual outcome (2026-07-22):** the prediction held and then some. On the SUBSTANCE dimensions, 8 of
10 scenarios were ties (base `claude-opus-4-8` coaches RED correctly); only eval-8 (COMMAND
handoff/coach-don't-drive) and eval-9 (classify-first boundary) showed a genuine skill advantage.
eval-3 (over-mock) turned out to be a grader phrase-set false-negative rather than a discriminator,
and eval-6 (false green) saturated on substance. So the discriminating signal is even more
concentrated than predicted -- two RED-DISCIPLINE cases, not the assertion-target cases -- which is
consistent with a strong base model that knows the textbook answers but under-applies the
red-step-vs-green-step boundary and the "write-then-stop-and-hand-off" discipline the skill enforces.

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

n = total runs for the unit, c = fully-correct runs (all expectations pass). Overall pools all 10
scenarios x 3 runs = 30 per config.

The SUBSTANCE-ONLY rows (judge + nodrive dims; the honest headline) are listed first; the FULL-RUN
rows (all dims, vocabulary-inflated) follow for completeness.

| Unit | config | n | c | Pass@1 | Pass@3 | Pass@5 | Pass^1 | Pass^3 | Pass^5 | saturated? |
|------|--------|---|---|--------|--------|--------|--------|--------|--------|------------|
| overall SUBSTANCE | with_skill | 30 | 29 | 0.97 | 1.00 | 1.00 | 0.97 | 0.90 | 0.83 | no |
| overall SUBSTANCE | baseline | 30 | 26 | 0.87 | 1.00 | 1.00 | 0.87 | 0.64 | 0.46 | no |
| overall full-run (vocab-inflated) | with_skill | 30 | 26 | 0.87 | 1.00 | 1.00 | 0.87 | 0.64 | 0.46 | no |
| overall full-run (vocab-inflated) | baseline | 30 | 15 | 0.50 | 0.89 | 0.98 | 0.50 | 0.11 | 0.02 | no |

Per-scenario full-run Pass@1 is in the EVL-02 headline table above (with_skill vs baseline). Scenarios
1 and 7 are saturated (both configs 3/3). eval-3 depresses `with_skill` overall by 3 full-run misses
that are a grader phrase-set artifact (the judge dimension is 3/3); absent that artifact, `with_skill`
full-run would be 29/30. The raw 26/30 is reported here and NOT tuned away.

*(EVL-01 Pass@k / Pass^k filled from the 2026-07-21 run at RUN level. EVL-02 Pass@k / Pass^k computed
by `iteration-1/passk-metrics.json` from the 2026-07-22 run; `iteration-1/benchmark.{json,md}` carries
the skill-creator aggregate [expectation-level pass_rate + token/time deltas].)*

## Verdict (filled after the gated run)

- **Trigger (EVL-01 forward):** SPECIFICITY PASS (12/12 = 100%; both sibling near-miss seams held).
  RECALL 92% (11/12) -- one facet below the 100% bar: T9 (house-idiom / testing-stance) fired 1/3.
  A soft, NON-blocking miss on a demonstrated defect.
- **Trigger (EVL-01 reciprocal):** PASS -- both siblings stayed fully quiet on the 12 RED positives
  (lz-tpp 12/12, lz-refactor 12/12; trigger_rate 0.00 each). The new cross-skill coverage is clean.
- **Behavior (EVL-02):** PASS (modest, honestly bounded) -- the skill beats the unaided baseline on
  the RED-discipline cases a strong base model gets wrong, and mostly imposes vocabulary elsewhere.
  **Headline (substance-only: judge + nodrive dims): with_skill Pass@1 0.97 (29/30) vs baseline 0.87
  (26/30)** -- a ~+10 pt gap concentrated in eval-8 (COMMAND: write the red test then STOP + hand
  green to lz-tpp; baseline substance 1/3) and eval-9 (classify-first RED boundary; baseline 1/3).
  The other 8 scenarios are substance-ties (base `claude-opus-4-8` already coaches RED correctly).
  The full-run Pass@1 (0.87 vs 0.50) is vocabulary-inflated -- the deterministic phrase-set dims
  reward the skill's house terms and false-fail the baseline's correct-but-differently-worded answers
  (unbiased review, adopted) -- so it is retained only as labeled context, not the headline. Cost:
  with_skill ~99k tokens / ~125s per turn vs baseline ~79k / ~83s (clean-run medians) -- the skill
  adds ~+25% tokens and ~+42s to read SKILL.md + the routed references. Eval-design follow-ups for a
  future iteration: route the mechanical dims through the judge (or widen the phrase sets) and blind
  the judge to config.
- **D-09 tuning:** APPLIED 2026-07-21 (user-approved) -- widened the house-idiom clause of the
  description; it beat the current description on an INDEPENDENT held-out set (recall 5/6 -> 6/6;
  specificity 6/6 held, 0 over-widen leaks), stays under the 1536-char cap (1233), unbiased review
  PASS. Shipped in SKILL.md; `/reload-plugins` is the pending human ship action. Details below.

## Unbiased reviewer verdict (RESERVED -- >= 1 from-scratch reviewer, D-07)

Per the CLAUDE.md skill-creator rule and memory `unbiased-review-beats-primed`, at least one review
agent with a NEUTRAL from-scratch brief (no prior findings, not primed with these results) audits the
grader source + a sample of run transcripts + the reported numbers AFTER the gated run, so
grader/rubric bugs are caught rather than confirmed (this is the gate that caught the Phase-11 CR-01
grader leniency). This reviewer is an ORCHESTRATOR-spawned step -- the gsd-executor cannot spawn
subagents. Slot reserved; filled post-run.

| Reviewer | Brief | Scope | Verdict | Findings |
|----------|-------|-------|---------|----------|
| Reviewer-1 (2026-07-22) | from-scratch, unprimed (given NO prior findings, not told the eval-3 conclusion) | grade-run.mjs + merge-judge.mjs source; grading.json + transcript for eval-3 (all 6), eval-8, eval-9, eval-1, eval-7 + others; passk-metrics.json + benchmark.json; EVAL-RESULTS.md numbers | **PASS-WITH-CAVEATS** | Pipeline integrity sound (both selfchecks OK; verify gate confirms all 60 final, no preliminary/null leaks). Numbers accurately computed (independently recomputed 26/30 and 15/30 full-run + every Pass@k -> exact match). **Core caveat (adopted):** the deterministic phrase-set dims measure the skill's house vocabulary as a correctness proxy and systematically false-fail the substantively-correct baseline (verified instances: eval-2 baseline "return value" vs "returned value"; eval-0 baseline AAA-as-comments; eval-4 baseline "nothing to mock"; eval-8 baseline "make the current test pass" as green framing; eval-3 both arms). Substance-only (judge+nodrive) gap is with_skill 29/30 vs baseline 26/30 = +10 pts, concentrated in eval-8 + eval-9 -- NOT the full-run +37 pts. Also: the "blind judge" claim was unsubstantiated (transcripts self-identify the arm), though no bias symptom was found; and the eval-3 artifact caveat had been applied asymmetrically (upward for with_skill only). No grader FALSE-POSITIVES found. Recommends foregrounding the substance-only comparison. ALL adopted: this report now leads with substance-only 0.97 vs 0.87, applies the artifact caveat symmetrically, corrected the blind-judge claim, and retains the full-run numbers only as labeled vocabulary-inflated context. |

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

### D-09 tuning APPLIED (2026-07-21, user-approved)

The T9 recall miss (house-idiom / testing-stance) was the sole soft-bar miss, so one bounded D-09
description widen was attempted and ACCEPTED. Change: strengthen the pre-existing house-idiom clause by
naming the surface forms that under-triggered, anchored to "when adding the next test" so it cannot leak
onto adjacent non-RED requests.

- Before: "... or how to match the codebase's existing testing stance -- even when they only ask ..."
- After:  "... or how to match the codebase's existing testing stance -- how the codebase already writes
  its tests and how to stay consistent with that existing test style or convention when adding the next
  test -- even when they only ask ..."

Held-out A/B (`evals/heldout-d09.json`: 6 fresh house-idiom positives + 6 style/consistency over-widen
negatives + 1 canary; claude-opus-4-8, 3 runs, num-workers 1; canary fired 3/3 in BOTH arms =
non-throttled windows). The held-out positives are independent of `trigger-eval.json` (no overfitting to
the measured set):

| Arm | house-idiom recall (query-level) | run-level | specificity (negatives quiet) |
|-----|----------------------------------|-----------|-------------------------------|
| current description | 5/6 | 14/18 | 6/6 (18/18) |
| widened description  | 6/6 | 15/18 | 6/6 (18/18) |

The widen eliminated the one hard held-out miss ("new to this repo -- how do i match how they test
here?", 0/3 -> 2/3) with ZERO specificity cost -- all 6 over-widen traps (lint config, runner config,
refactor-for-consistency, file-naming, the green-step seam) stayed 0/3 quiet in BOTH arms. Length 1233
chars (cap 1536). Unbiased from-scratch review (number-blind, plugin-dev skill-reviewer): PASS on all
six axes (accuracy, scope discipline / no leak, sibling seams intact, cap, ASCII, hygiene).

Bounds honored: description-frontmatter-only edit (the ONLY write-back into `plugins/`); no reference
files or LOCKED content touched; no scope expansion; a single at-most-one pass with no re-eval loop --
the original `trigger-eval.json` was NOT re-run, so the EVL-01 forward table above remains the pre-widen
measurement. `/reload-plugins` is the pending HUMAN ship action; committed != live.

## STATUS -- EVL-01 done, D-09 applied + live, EVL-02 done

EVL-01 forward + reciprocal RAN 2026-07-21 under explicit user approval (forward recall 92%,
specificity 100%; both siblings 100% quiet; every chunk canary-validated). The conditional D-09 tuning
then RAN under a further explicit approval: a held-out A/B validated a house-idiom description widen
(recall 5/6 -> 6/6, specificity 6/6 held, unbiased review PASS), it was APPLIED to SKILL.md, and
`/reload-plugins` was run (live). EVL-02 behavior benchmark RAN 2026-07-22 under a fresh explicit
approval (ORCHESTRATOR-driven fan-out of 60 coach subagents + 10 independent LLM judges + merge/verify/
aggregate) AND was audited by a from-scratch unbiased reviewer (PASS-WITH-CAVEATS; numbers verified,
grader-vocabulary-inflation caught and adopted). Honest headline (substance-only, judge+nodrive):
with_skill Pass@1 0.97 (29/30) vs baseline 0.87 (26/30) -- the skill's real edge is on eval-8 (COMMAND
handoff/coach-don't-drive) and eval-9 (classify-first boundary); the other 8 scenarios are
substance-ties. The full-run 0.87-vs-0.50 is vocabulary-inflated and kept only as labeled context. All
three EVL-02 requirements (behavior benchmark + Pass@k/Pass^k + unbiased review) are empirically
demonstrated. Remaining: milestone close.
