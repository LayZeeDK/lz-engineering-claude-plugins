# lz-red APPLY Eval (3-arm, multi-dimensional) -- Results

APPLY-based RED eval: short, human-style prompts drive a real PRODUCED TEST FILE in a real OSS
TypeScript repo, across three own-skill arms, graded on a hard correctness gate plus a set of lift
dimensions. This is the Phase-21 successor to the Phase-20 coaching-prose eval: the graded artifact
is a test file / diff, never coaching prose (D-02).

Skill under test: `plugins/lz-tdd/skills/lz-red`. Milestone lz-tdd@0.0.3.

**STATUS -- RUN COMPLETE 2026-07-27/28. 36 runs, 4 cells, 3 suites, $29.04 total.** User-approved at
the metered gate after the required zero-spend Step 2 canary passed (`selfcheck-red.mjs` exit 0, ZERO
SKIPs across all eleven fabricated runDirs, including the platform-conditional crux 9). Every number
below is measured.

**HEADLINE: no correctness lift and no test-design lift from PASSIVE skill content. The baseline is at
ceiling.** After the corrections an independent unbiased audit could defend, pooled Pass@1 is 0.67 for
all three arms, and blind-judge substance is 9/9 for `no_skill` on the three cells that can be judged.
The PASSIVE qualifier is load-bearing, not hedging: five lz-refactor probes established that passive
content does not move this axis, and a sixth probe -- an always-active forcing function -- moved it and
shipped. That lever has never been built for `lz-red`. See "What this round licenses, and the next
lever". The non-null
findings are all off the output axis: the description auto-triggered in 9 of 12 opportunities, the
skill-bearing arms cost more and take more turns, and the only two production edits in the round came
from skill-bearing arms -- which points AGAINST coach-don't-drive, not for it.

**SCOPE -- every number in the main round is `claude-opus-4-8`.** The harness default was a stale pin;
Opus 5 had been the default Claude Code model for about a week when this round ran. The output-quality
null survives a stronger baseline (it is a ceiling effect). The auto-trigger rate was the finding at
risk, because trigger propensity depends on how a model weighs skill descriptions and can shift across
a generation. **A follow-up probe has now MEASURED it on Opus 5 and it holds -- see "Opus 5 trigger
probe" below.** The pin has since been moved to `claude-opus-5` in all six call sites.

## Run configuration (as run)

- **Model:** `claude-opus-4-8`, effort `high`. Verified from the CLI's OWN `system/init` event and the
  `result` event's `modelUsage` keys, not only from the harness-written `meta.json` field -- a recorded
  model field is a claim about what was REQUESTED, and the CLI-sourced fields are what confirm it.
  Auxiliary `claude-haiku-4-5-20251001` usage appears in `model_usage` for 28 captures (CLI-internal
  helper calls, not the agent under test).
- **Corpus:** 4 cells x 3 arms x k=3 = 36 runs. GRC (Gilded Rose Conjured, contamination HIGH),
  SRVC (h3js/srvx dropped staged cookie, contamination LOW), RXF (radix-ng `data-focused`,
  contamination MEDIUM), RXL (radix-ng `RadixNGConfig.locale`, contamination MEDIUM).
- **Bases:** GRC armed at `ac6a0335` (snapshot committed INTO the base, so the characterize-first
  escape route is closed and the snapshot is invisible to every captured diff); SRVC pinned
  `55d90b39`; RXF/RXL pinned `4a7390a2`. Every cell graded against ONE base, verified per run via the
  `apply_base` field.
- **Serial per suite:** one suite dir at a time; `run-e2e.mjs` drives arms x prompts x runs serially.
- **Isolation:** `--strict-mcp-config` + `--setting-sources project`; apply in a throwaway worktree at
  `applyBase`; `reset --hard` + `clean -fd` before every run.
- **Arms:** `no_skill` (no `--plugin-dir`), `with_skill` (`--plugin-dir plugins/lz-tdd` + natural
  prompt), `invoke_skill` (natural prompt force-prefixed `/lz-tdd:lz-red `). The
  `mattpocock-skills:tdd` competitor arm remains DEFERRED (D-05); not in this fan-out.
- **Cost:** $29.04 / 36 = $0.807 mean. Per cell: GRC $3.81, SRVC $12.16, RXF $5.63, RXL $7.44.
  (CORRECTED 2026-08-02. The RXF/RXL split as first published read $3.87 / $9.20 -- $1.76 misallocated
  from RXF to RXL. Recomputed by summing `total_cost_usd` over the 36 pinned captures: the pin is the
  canonical `results/` tree, the three own-skill arms, targets r1/r2, which is exactly 36 and excludes
  the `results-pilots-*` / `results-probe-260728-opus5` trees and the later D-12 `a1`/`a2` +
  `invoke_forcing`/`invoke_treatment` captures that now share the tree. GRC $3.8124, SRVC $12.1553,
  RXF $5.6299, RXL $7.4406, total $29.0382. The pair sum, the two other cells, the round total and the
  arm-level mechanical table were all correct as published -- only this one per-cell split was wrong,
  so no headline, verdict or Pass@k figure is affected.)

**Arm comparability was independently verified and is CLEAN.** `prompt_used` is byte-identical between
`no_skill` and `with_skill` in all four cells (SHA-matched); `invoke_skill` differs by exactly the
15-character slash prefix and its suffix is byte-equal to the natural prompt. Same model, effort, cwd,
base, permission mode and setting sources; `buildCmd` adds `--plugin-dir` for the two treated arms and
nothing else. Runs are interleaved by run index, so there is no temporal block confound.

**Treatment caveat:** `--plugin-dir plugins/lz-tdd` loads `lz-tpp` as well as `lz-red`, so the
treatment is strictly "the lz-tdd plugin is installed", not "lz-red was used".

## Headline structure -- SUBSTANCE-ONLY (D-08), read against the contamination + concentration priors

**The headline is SUBSTANCE-ONLY.** Substance = (1) the D-06 correctness GATE, which is mechanical --
it runs the produced test and classifies the runner's structured JSON (strict differential typecheck +
`assertionResults[]`), so NO house-vocabulary proxy can inflate it; plus (2) the blind-judge substance
dimensions (right-next-test, observable-behavior) fed ONLY blinded test code + behavior spec
(Pitfall 7). Any house-style / house-vocabulary number, if reported at all, is a SEPARATE row
explicitly labeled CONTEXT-ONLY and is never the headline. No such number is reported for this round.

**Priors that frame the read (do NOT misread a tie as "the skill adds nothing"):**
- **Phase-13 applied-output PARITY:** on applied output a strong base model is already excellent.
  This round reproduces that at ceiling.
- **Phase-20 CONCENTRATION:** the skill's judge-verified edge concentrates on RED-DISCIPLINE cases,
  not textbook moves. This round found no discipline edge either -- see the production-edit row.
- **GRC contamination (Pitfall 5):** a correctness TIE across all three arms on GRC is EXPECTED and is
  pass-at-ceiling on a smoke anchor, NOT evidence of inertness.
- **PASSIVE content is null; an ACTIVE forcing function is not (the lz-refactor result).** This is the
  single most important prior for reading this round, and it is easy to state backwards. Five
  successive lz-refactor probes that varied PASSIVE skill content -- prose, gate cues, mirrored
  taxonomy text, few-shot examples, a widened scope clause -- all measured NULL. The SIXTH probe
  flipped the axis: an always-active AUDIT+DECIDE step embedded in `SKILL.md` (deliberately NOT in a
  leaf, so smell routing cannot bypass it) lifted held-out recall from 0/3 control to 5/5 after one
  tightening (Pass@1 0.40 -> 1.00) while holding precision at 0/5 over-conversions on a decoy-bearing
  target. It shipped. A prompt-level precursor had already gone 0/3 -> 5/5, which falsified an earlier
  "judgment ceiling, stop" conclusion. **So "passive content does not move the output axis" is
  established, and "nothing moves it" is FALSE.**

## Correctness gate -- Pass@k and Pass^k (D-06; the pass criterion)

`c` = runs whose `red-grade.pass === true` (verdict `genuinely_red`: differential clean AND an
assertion failure, on current code, in a test the produced diff ADDED). Checker is `tsc` on GRC and
SRVC, `atc` (angular-typechecker) on RXF and RXL, recorded per grade under `checker`.

**Statistical disclosure -- most of these columns carry no information at n=3, and two are the same
number.** `Pass@1 = 1 - C(n-c,1)/C(n,1) = c/n` and `Pass^1 = C(c,1)/C(n,1) = c/n` are IDENTICAL BY
CONSTRUCTION for every n; they are not two independent facts. At n=3, `Pass@3` is `1` iff `c >= 1` and
`0` otherwise -- a thresholded indicator, not a probability over three fresh draws -- and `Pass^3` is
`1` iff `c == 3`. `Pass@5`/`Pass^5` are null (k > n). **Only `c/n` is informative here.** The columns
are retained for format continuity with Phase 20 and should not be read as eight separate measurements.

**What `pass` does and does not mean.** The gate requires a clean differential plus at least one
attributed assertion failure. It does NOT require the test to be RIGHT. This fired in this round:
`GRC/invoke_skill/run-1` scored `genuinely_red` / pass=true on a test asserting an unreachable
`quality` of `-1` against an already-implemented normal item, never touching the Conjured gap. Both
blind-judge passes failed it. Read the mechanical column as "produced a genuinely failing test", and
the judge column as "produced the right test".

### GRC -- Conjured anchor (contamination HIGH; correctness SMOKE anchor, parity EXPECTED)

| arm | n | clean | c | Pass@1 | Pass@3 | Pass@5 | Pass^3 |
|-----|---|-------|---|--------|--------|--------|--------|
| no_skill | 3 | 3 | 3 | 1.00 | 1.00 | - | 1.00 |
| with_skill | 3 | 3 | 3 | 1.00 | 1.00 | - | 1.00 |
| invoke_skill | 3 | 3 | 3 | 1.00 | 1.00 | - | 1.00 |

SATURATED / non-discriminating, exactly as predicted. Read as pass-at-ceiling.

### SRVC -- h3js/srvx dropped staged cookie (contamination LOW; out-of-domain CONTROL)

| arm | n | clean | c | Pass@1 | Pass@3 | Pass@5 | Pass^3 |
|-----|---|-------|---|--------|--------|--------|--------|
| no_skill | 3 | 3 | 3 | 1.00 | 1.00 | - | 1.00 |
| with_skill | 3 | 3 | 2 | 0.67 | 1.00 | - | 0.00 |
| invoke_skill | 3 | 3 | 3 | 1.00 | 1.00 | - | 1.00 |

**The `with_skill` 0.67 is an INSTRUMENT ARTIFACT, not a quality difference. Do not report it bare.**
`with_skill/run-1` wrote `test.skipIf(isDeno)(` with the title on the FOLLOWING line. Title extraction
is line-scoped by design, so no title was extracted, the failure could not be attributed, and the run
graded `unattributable` -- with the model's OWN test title reported back as `PRE-EXISTING`. The runner
had reported that exact title as failed with a real `AssertionError`. Zero new type errors, zero
production files. **On substance this cell is 3/3 for every arm.** Corrected, SRVC is exact parity.

A related single-line form of the same defect (`test.skipIf(cond)('t')`) affected one other run and
WAS fixed in-round (commit `e428d8a`, plus a `[classify:cond]` canary); re-grading moved this cell
from 7/9 to 8/9. The multi-line form remains unfixed by deliberate choice.

### RXF -- radix-ng `data-focused` (contamination MEDIUM; designated PRIMARY drive discriminator)

| arm | n | clean | c | Pass@1 | Pass@3 | Pass@5 | Pass^3 |
|-----|---|-------|---|--------|--------|--------|--------|
| no_skill | 3 | 3 | 0 | 0.00 | 0.00 | - | 0.00 |
| with_skill | 3 | 3 | 0 | 0.00 | 0.00 | - | 0.00 |
| invoke_skill | 3 | 3 | 0 | 0.00 | 0.00 | - | 0.00 |

**EXCLUDED from the correctness headline. Report this cell as TWO numbers, not one:**

| RXF, all three arms | value | evidence |
|---------------------|-------|----------|
| behaviourally RED | **9/9** | `attributed_failures: 1` on every run -- the added test collected, ran, and failed on its own assertion |
| passes the differential | **0/9** | one new inherited type diagnostic per run |

**Why two numbers, and why the gate is NOT going to be changed to fix it (investigated 2026-07-28).**
The runner never sees these diagnostics -- Analog's `disableTypeChecking` defaults true -- and the repo
has no typecheck target at all, which is why 55 errors sat unnoticed on its default branch. So the gate
failed nine runs on a standard the target never applies, against tests that demonstrably ran and failed
as designed. A precedence rule was proposed to fix it: if an added test collected and failed on its own
assertion, treat a new type diagnostic as a warning rather than a verdict.

**That rule was tested against the negative control and it FAILED.** `canary-compile` grades
`compile_error` with `new_tsc_errors: 2` AND `attributed_failures: 1` -- its deliberate type error
(`const app: number = new GildedRose(...)`) is ALSO runtime-inert, so esbuild strips the annotation, the
test runs, and it fails its assertion (`expected 5 to be 4`). Under the proposed rule that control would
flip to pass, and the clause a counterfactual proved load-bearing would acquire a false-pass hole. The
rule is therefore rejected on evidence.

The distinction that actually separates the two cases is not runtime-inertness -- both are runtime-inert
-- but WHOSE defect it is. The produced RXF tests are type-correct given a correctly configured jest-dom;
the canary's test is type-correct nowhere. The only mechanical way to see that difference is "does this
diagnostic already appear in the baseline", which is precisely the baseline-keyed noise rule the owner
ruled out. So no sound fix is available inside the gate, and the honest response is to report both
numbers and name the limitation.

**State it two-sidedly.** Calling this purely a target defect is too kind to the gate; calling it purely
a gate defect is too kind to the runs, because a compiling convention was DOMINANT (90 of 142 files) and
all nine specimens missed it. Both are true: the gate cannot tell an inherited type error from a
self-inflicted one, and the specimens anchored on the repo's lone outlier file. All nine runs graded `compile_error` with exactly 1 new diagnostic, and every one is a
jest-dom matcher TS2339 (`toHaveTextContent` / `toHaveAttribute` "does not exist on type
`JestMatchers<...>`"). Cause: `@types/jest-axe` carries a triple-slash `reference types="jest"`, which
pulls in `@types/jest`, whose `expect` returns `JestMatchers<T>` -- a type `@testing-library/jest-dom/vitest`
never augments. The repo's own `calendar/__tests__/calendar.spec.ts` contains 8 instances of the
identical error and each specimen added a 9th, so the differential counted 1 new.

**CORRECTION (measured 2026-07-28, supersedes an earlier claim in this document that the models
"followed the house idiom").** They did not. jest-dom matchers are NOT this repo's convention -- they
are a single-file outlier, and the models mirrored the file they opened rather than the suite. Counted
across the 142 `*.spec.ts` files under `packages/primitives`:

| form | files |
|------|-------|
| `.toBe(` | 124 |
| raw `getAttribute(` / `hasAttribute(` | **90** (76 in the exact `expect(el.getAttribute('data-x')).toBe('')` shape) |
| `toHaveAttribute` | **0** |
| `toBeInTheDocument` / `toBeVisible` / `toHaveClass` / `toBeDisabled` | **0 each** |
| `toHaveTextContent` | **1** -- and that file IS `calendar/__tests__/calendar.spec.ts` |

`test-setup.ts` does import `@testing-library/jest-dom/vitest`, so the matchers LOOK available, but the
suite effectively does not use them. (`toHaveAttribute` occurs in 13 files, all Playwright locator
assertions in the separate `apps/visual-regression` suite, not the unit suite these specimens target.)

**Why this matters more than the original framing.** "The target's idiom is a trap" would excuse the
result. The measured position is different: a compiling, convention-following route was not merely
available -- it was DOMINANT, in 90 of 142 files -- and the specimens missed it by anchoring on the
nearest file, which happens to be the repo's only jest-dom user. That is a discretion / salience gap,
not a capability limit, and it is therefore the class of failure a forcing function can address. It
makes "check the convention across the suite, not just the file you opened" the strongest
force-functioning candidate this round produced.
`21-ATC-ADOPTION.md:150-152` pre-registered that a jest-dom TS2339 cluster here "is this residual and
not an arm effect". Reporting it as a quality result would contradict the project's own pre-registration.

All nine were nevertheless BEHAVIOURALLY red -- each collected and failed on an attributed assertion
(`attributed_failures: 1`, "expected null to be truthy") -- and all nine scored 9/9 on both judge
dimensions. A compiling idiomatic route exists and was proven pre-round by `canary-rdxf-red`, which
grades `genuinely_red` with 0 new diagnostics using plain `expect(el?.textContent?.trim()).toBe(...)`.
So the cell is answerable; the models chose a matcher family that is type-broken in this repo, which
nothing in radix's own tooling would surface.

### RXL -- radix-ng `RadixNGConfig.locale` (contamination MEDIUM; observable-output cell)

| arm | n | clean | c | Pass@1 | Pass@3 | Pass@5 | Pass^3 |
|-----|---|-------|---|--------|--------|--------|--------|
| no_skill | 3 | 3 | 0 | 0.00 | 0.00 | - | 0.00 |
| with_skill | 3 | 3 | 1 | 0.33 | 1.00 | - | 0.00 |
| invoke_skill | 3 | 3 | 1 | 0.33 | 1.00 | - | 0.00 |

**EXCLUDED from the correctness headline (owner decision 2026-07-27, upheld and strengthened by the
round). The 0.33-vs-0.00 is NOT a lift -- it is production-edit propensity.** The only two passes are
the only two runs that edited production: both created an `RDX_LOCALE` InjectionToken in
`packages/primitives/config/src/config.provider.ts` and then asserted against their own new token.
`RDX_LOCALE` does not exist at the pin (`git grep` = 0 hits), so the cell violates its own corpus
checklist item ("the target public API EXISTS and COMPILES") and is structurally unpassable without a
production edit. The other seven referenced a nonexistent symbol and failed as unresolved imports
(TS2305/TS2307), not as a behavioural red.

Blind judge: **0/9 on both dimensions, all three arms.** No specimen rendered anything; every one
relocated the already-passing "config holds the locale" assertion onto an injection token. The cell's
own `discipline_traps` require asserting the RENDERED month heading, and nobody did -- so even a pass
would have been incidental. The German-prefix false-green trap was never triggered, because no test
asserted rendered text at all. Read RXL on discipline dimensions only.

### Overall (pooled) -- and the corrections that must be applied to it

| correction applied | no_skill | with_skill | invoke_skill |
|--------------------|----------|------------|--------------|
| as tabulated (12 runs/arm) | 0.50 | 0.50 | 0.58 |
| + SRVC attribution artifact corrected | 0.50 | 0.58 | 0.58 |
| + RXF dropped (pre-registered target defect) | 0.67 | 0.78 | 0.78 |
| + RXL production-edit passes not counted as RED | **0.67** | **0.67** | **0.67** |

**After every correction that can be defended: exact three-way parity. No mechanical correctness lift.**

## Mechanical lift dims (D-07; from the stream-json meta, `tabulate-mechanical-red.mjs`)

Straight off each run's `meta.json`. **`drove` counts clean runs whose diff changed >= 1 file -- it
means "changed any file", NOT "drove to green"; it reads 3/3 in all twelve cells and is therefore
uninformative.** The drive signal to read is `changed_production_files`, below.

| target | arm | wall mean (s) | cost mean ($) | out tokens/run | turns mean | tool histogram (top) |
|--------|-----|---------------|---------------|----------------|------------|----------------------|
| GRC | no_skill | 111 | 0.38 | 5,057 | 10 | Read:14 Bash:8 Glob:3 Edit:3 |
| GRC | with_skill | 92 | 0.46 | 5,097 | 11 | Read:13 PowerShell:5 Glob:3 Skill:3 Edit:3 |
| GRC | invoke_skill | 137 | 0.43 | 6,658 | 10 | Read:13 Bash:8 Glob:3 Edit:3 |
| SRVC | no_skill | 231 | 1.32 | 13,088 | 22 | Bash:27 Read:21 Write:5 Grep:4 Edit:4 |
| SRVC | with_skill | 258 | 1.49 | 15,281 | 21 | Read:19 Bash:14 Grep:10 Skill:3 |
| SRVC | invoke_skill | 222 | 1.25 | 13,321 | 18 | Read:19 Bash:10 Grep:9 Skill:1 |
| RXF | no_skill | 169 | 0.59 | 4,819 | 13 | Bash:12 Read:11 Edit:4 Grep:4 |
| RXF | with_skill | 186 | 0.68 | 4,809 | 14 | Read:14 Bash:12 Glob:5 Skill:1 |
| RXF | invoke_skill | 172 | 0.62 | 5,430 | 13 | Read:10 Bash:9 Grep:7 Edit:6 |
| RXL | no_skill | 189 | 0.63 | 7,271 | 15 | Bash:16 Read:13 Grep:6 Edit:4 |
| RXL | with_skill | 264 | 0.98 | 11,991 | 20 | Bash:19 Read:16 Grep:9 Skill:2 |
| RXL | invoke_skill | 268 | 0.86 | 11,068 | 17 | Read:16 Bash:15 Grep:10 Edit:3 |

**Token dimension, pooled per arm across all four cells** (output tokens; the `model_usage` rollup,
which includes sub-agent usage):

| arm | output tokens | out/run | vs baseline |
|-----|---------------|---------|-------------|
| no_skill | 90,704 | 7,559 | -- |
| with_skill | 111,533 | 9,294 | **+23%** |
| invoke_skill | 109,433 | 9,119 | +21% |

**+23% output tokens for `with_skill` over baseline**, consistent in direction with the cost and turn
findings. The skill measurably costs more on every process dimension while buying nothing on
correctness or design.

Do NOT read `invoke_skill`'s near-zero INPUT tokens (2,630 vs ~12,700 for the other arms) as
efficiency. The slash command is expanded by the CLI at prompt-processing time and that arm records no
`haiku` auxiliary calls at all -- it is an artifact of how the arm is composed, not a saving.

**Cost/turn finding (non-null):** the treated arms are consistently more expensive on 3 of 4 cells --
`with_skill` exceeds `no_skill` on GRC (+$0.08), SRVC (+$0.17), RXF (+$0.09) and RXL (+$0.35). Loading
the skill costs tokens and turns without buying correctness here.

### Coach-don't-drive -- `changed_production_files` (EVIDENCE, not a gate)

34 of 36 runs changed no production file. The two that did are RXL `with_skill/run-1` and
`invoke_skill/run-1`, both `config/src/config.provider.ts` (a `src/` path, so genuine production, not
the benign TestBed-host false positive the field can produce). **Both are skill-bearing arms; the
baseline produced zero.** As a rate on the only cell where the shape is reachable: skill arms 2/6,
baseline 0/3. n is tiny and the cell is confounded, so this is a signal to investigate, not a verdict
-- but it points AGAINST the coach-don't-drive claim, which is where Phase 20 located the skill's edge.

## Auto-trigger (D-04)

| target | with_skill `fired` | invoke_skill `avail` / `force` | no_skill |
|--------|--------------------|-------------------------------|----------|
| GRC | 3/3 (1.00) | 1.00 / 1.00 | 0.00 |
| SRVC | 3/3 (1.00) | 1.00 / 1.00 | 0.00 |
| RXF | 1/3 (0.33) | 1.00 / 1.00 | 0.00 |
| RXL | 2/3 (0.67) | 1.00 / 1.00 | 0.00 |
| **total** | **9/12 (0.75)** | 1.00 / 1.00 | 0.00 |

**Report this as an ABSOLUTE rate, not as a delta against `no_skill`.** A "9/12 vs 0/12" framing is a
non-comparison: `no_skill` has no `--plugin-dir`, so firing is impossible by construction
(`availableRate` 0.00). The defensible statement is "the model chose to invoke the skill in 9 of 12
opportunities, on `claude-opus-4-8`".

The round's validity rests on `invoke_skill` reading `avail 1.00 + force 1.00` in every cell: that
proves `--plugin-dir` loaded the plugin and the detector is live, which is what licenses reading a
`with_skill` fire-rate as real. Had `avail` read 0.00 the whole round would have measured nothing.

Two further caveats. **`with_skill` is a MIXTURE arm:** 3 of 12 runs never fired, so they are baseline
runs wearing a treated label -- including 2 of the 3 RXF runs. And one `invoke_skill` SRVC run ALSO
emitted a `Skill` tool_use, so `invoke_skill fired = 0.00` is the norm by construction but not an
invariant.

## Opus 5 trigger probe (user-approved follow-up, 2026-07-28)

The main round's one positive finding was auto-trigger, and it was the finding most at risk from the
stale pin. This probe answers that specific question and nothing else.

**Scope:** GRC cell, `with_skill` arm only, k=3, model `claude-opus-5` at effort `high`, same armed base
`ac6a0335`, same throwaway checkout and toolchain. 3 runs, **$2.4410** ($0.814/run).

| measure | Opus 4.8 (main round) | Opus 5 (probe) |
|---------|----------------------|----------------|
| auto-trigger fired | 3/3 | **3/3** |
| `skill_forced` | false | false |
| D-06 verdict | 3/3 `genuinely_red` | **3/3 `genuinely_red`** |
| `changed_production_files` | 0/3 | **0/3** |
| cost mean | $0.46 | **$0.81** |
| turns mean | 11 | **~19** |

Model confirmed three ways -- the harness `meta.json` field, the CLI's own `system/init` event, and the
`result` event's `modelUsage` keys all read `claude-opus-5`.

**Conclusion: the description still auto-triggers on Opus 5, and RED discipline holds** (every run wrote
a genuinely failing test and edited no production file).

**What this does NOT establish.** It is same-cell replication, not transfer across the corpus. GRC also
fired 3/3 on Opus 4.8, so this reproduces the easy case. The interesting cell is RXF, which fired only
1/3 on Opus 4.8 and is **untested on Opus 5** -- so the round's overall 9/12 rate is still an Opus-4.8
figure and must not be restated as an Opus-5 one. Nothing here speaks to correctness lift either: the
probe has no `no_skill` comparison arm by construction.

**Cost finding:** Opus 5 is roughly 1.8x the cost per run and takes noticeably more turns on the same
cell against the same base. Worth budgeting for in the next round.

## Graded lift dims (D-07/D-09; blind LLM judge, <= 2 dims)

Judges saw ONLY: the full post-edit test file (verified to parse), the exact lines the author added,
and the author's production changes -- with comments stripped. No arm label. Judge model: Opus 5
(deliberately a different, stronger model than the subjects, so no judge grades its own output).

| dimension | resolver | no_skill | with_skill | invoke_skill |
|-----------|----------|----------|------------|--------------|
| Is THIS the right next test? | blind judge dim 1 | **9/9** | **9/9** | **8/9** |
| Asserts observable behavior? | blind judge dim 2 | **9/9** | **9/9** | **9/9** |

Excluding RXL (structurally unpassable, 0/9 uniformly across arms). Including it: 9/12, 9/12, 8/12
on dim 1. Per cell, dim 1: GRC 3/3 no_skill, 3/3 with_skill, 2/3 invoke_skill; SRVC and RXF 3/3 for
every arm; RXL 0/3 for every arm.

**No test-design lift. The baseline is at ceiling (9/9), and the single miss across the three judgeable
cells is on a skill-bearing arm** (`GRC/invoke_skill/run-1`, the unreachable `-1` expectation). At n=1
that is noise, not a reverse effect, and must not be reported as one.

The SRVC judge went beyond inspection: it extracted each added test into a standalone spec, ran all
nine against unfixed srvx HEAD (every one failed with the gap's exact signature -- the client receiving
only the Response's own cookie), applied a minimal staged-cookie merge, re-ran (all green), then
reverted and verified the tree clean. That is empirical red-to-green diagnostic power for 9/9, not
plausibility.

`oracle-reviewer` book-authenticity: NOT RUN. RESEARCH A5 predicted low discriminating power for a
test artifact versus a named refactoring, and with correctness and design both at parity there is no
signal for it to separate. Recorded as deliberately skipped, not as a null result.

### Judge-corpus history -- a defect worth recording

The first two judging passes are DISCARDED as invalid, not averaged in. The initial corpus extracted
only `+` lines from each diff, dropping the context lines a modified test depends on; the second
attempt took the hunk post-image but STITCHED disjoint hunks, so non-contiguous regions read as
contiguous code. The independent audit measured the damage: **14 of 36 specs failed to parse, split
`with_skill` 6/12, `invoke_skill` 5/12, `no_skill` 3/12 -- twice the corruption load on the treated
arms**, i.e. biased against the thing being measured. It also filtered production changes out
entirely, so the one fact that decides RXL was invisible to the judge.

The final corpus stops reconstructing anything: it materialises the base file via
`git show <recorded apply_base>:<path>` and lets `git apply` produce the post-edit file, the same path
the grader takes. Result: 36/36 applied, 36/36 parse clean, parse rate uniform 12/12 per arm.

The lesson generalises: **a judge disagreeing with the mechanical gate is a signal to audit the
harness, not the model.** The first corpus bug surfaced only because the judge failed four GRC specs
for an "unbound `items`" that nine `genuinely_red` verdicts proved could not exist.

## Unbiased reviewer (mandatory, D-10)

| Reviewer | Brief | Verdict |
|----------|-------|---------|
| Reviewer-1 | from-scratch, unprimed; given NO prior findings and none of these numbers | 11 findings; 5 blocking. Recomputed all 36 runs independently. |

It was NOT told about the attribution fix, the RXF jest-dom issue, the SRVC artifact or the corpus
bug. It found the substantive ones anyway, and it overturned four of the orchestrator's conclusions.

**Confirmed sound:** arm comparability (prompt SHAs, model, effort, base, interleaving, inter-run
reset); tabulation arithmetic, recomputed independently from all 36 grade/meta pairs and matching
`mechanical-red.json` to the digit, including `comb`/`passAtK`/`passHatK` at every edge; the
fail-closed guard set (differential collapse, config-level diagnostics, vacuous typecheck,
containment, multiset position-insensitivity); blinding against skill self-identification.

**Blocking findings, all adopted above:** RXF's verdict is decided by a pre-registered target defect
(F1); the SRVC `with_skill` miss is a grader attribution bug and correcting it yields parity (F2);
RXL's only passes are its only production edits, inverting the discipline axis (F3); `genuinely_red`
does not require the test to be right, and a wrong test passed (F4); the judge corpus was corrupted
and arm-skewed (F5).

**Latent findings, not triggered in this corpus, recorded for the next round:** `rightReason` applies
its regexes to raw `failureMessages` including the code frame, so model-authored text could flip a
verdict; `attributedAssertions` matches on `title` not `fullName`, so duplicate innermost titles in
different `describe`s could mis-attribute in the false-PASS direction; only `producedTests[0]` is run,
so a second produced spec is silently unmeasured; `changedProductionFiles` would classify
`vite.config.ts` or a `test/helpers.ts` as production.

## Added dimensions (re-graded 2026-07-28, judges on Opus 5, faithful corpus, zero metered spend)

Two dimensions the first pass left unmeasured. Both were graded blind over the same corpus, 9 specimens
per cell, two dims per judge (the Phase-20 lock).

### Classify-first (is the move RED?)

Judged from the added lines plus the production diff -- NOT from the transcript, because `answer.md`
self-identifies the skill and would unblind the arm instantly (Pitfall 7). That makes this dimension
partly OVERLAPPING with the mechanical gate rather than a fully independent signal; read it as
corroboration.

| cell | RED | other |
|------|-----|-------|
| GRC | 8/9 | 1 REFACTOR (`invoke_skill/run-1` -- replaced the stub with an already-implemented normal-item case) |
| SRVC | 9/9 | -- |
| RXF | 9/9 | -- |
| RXL | 7/9 | 2 MIXED (`invoke_skill/run-1`, `with_skill/run-1` -- created `RDX_LOCALE`, then asserted it) |

Per arm: `no_skill` **12/12** RED, `with_skill` 11/12, `invoke_skill` 10/12. **The baseline is the
cleanest arm on this dimension.** Every exception is a run already flagged by another signal, so the
dimension confirms rather than discriminates -- but the direction is again mildly AGAINST the skill.

### House-idiom adherence (CONTEXT-ONLY per D-08 -- never the headline)

Each judge derived the convention from the target's own tests before scoring.

| cell | HIGH | MIXED | LOW | the deviations that recurred |
|------|------|-------|-----|------------------------------|
| GRC | 5/9 | 4/9 | 0 | dropped the `should` title prefix; multi-line item array; destructuring over indexing |
| SRVC | 2/9 | 7/9 | 0 | `runtime!` bang-chain where the house optional-chains (0 occurrences under `test/`); `expect.arrayContaining` (0 occurrences); missing `test.skipIf(isDeno)` on appends to the one file Deno also runs |
| RXF | 7/9 | 2/9 | 0 | `toHaveAttribute` (0 of 142 spec files) |
| RXL | 5/9 | 4/9 | 0 | `RADIX_LOCALE` against the repo's 13 `RDX_*` tokens; an `as Signal<string>` cast on `TestBed.inject` (0 house occurrences); `it.todo` (0 across ~200 specs) |

Per-arm adherence was not computed: this is a context-only dimension and no per-arm pattern was
apparent at cell level.

**The finding worth carrying is an INVERSION, and it is the round's most useful by-product.** On BOTH
radix cells, high idiom adherence coincided with total failure on the substance dims:

- **RXL:** 5/9 judged HIGH -- several "indistinguishable from the house spec" -- because they faithfully
  mirrored the shipped `config-provider.spec.ts`. But that spec asserts the SERVICE half, which is
  already covered. Mirroring the nearest spec correctly is WHY nine of nine tested the wrong thing.
- **RXF:** 7/9 judged HIGH at FILE level, because they matched the host file's `toBeTruthy` +
  `toHaveTextContent` pair. That host file is the repo's only jest-dom user, 1 of 142.

In both cells the specimens copied the file in front of them rather than the convention of the suite.
`lz-red`'s SKILL.md step 3 currently advises "match the shape of the existing tests first" -- passively,
and in these two cells that advice points the WRONG way. A lever that asks what the nearest spec ALREADY
COVERS, and whether its idiom is representative of the suite, would address both failures at once.

## What this round licenses, and the next lever

**What it licenses.** On this corpus, at this model, `lz-red` produces no correctness lift and no
test-design lift. The baseline is at ceiling on test design (9/9), so there was very little headroom for
any skill to demonstrate.

**What it does NOT license: the conclusion that the skill cannot help.** What was measured is PASSIVE
skill content. `lz-red`'s `SKILL.md` is a six-step decision procedure that links out to reference
leaves -- structurally the same class of artifact as the five lz-refactor probes that measured null,
and NOT the class that worked. The one lever with positive, shipped, precision-controlled evidence --
an always-active enumerate-and-decide forcing function -- has never been built for `lz-red`. This round
therefore reproduces the known null; it does not test the known-good lever.

**Two of this round's failures are the shape a forcing function addresses.** Both are discretion /
salience gaps rather than capability gaps, which is exactly what the loop audit fixed on lz-refactor:

- **RXL, 0/9 on BOTH judge dims, all arms.** Every run asserted an injection token instead of rendered
  output, while the cell's own `discipline_traps` demand the rendered month heading. No specimen
  rendered anything. A forcing function of the form "enumerate what the contract promises OBSERVABLY,
  then assert that" targets this directly. The models were not incapable -- nine of nine simply never
  considered rendering.
- **RXF, 9/9 design but 0/9 mechanical.** Correct tests, using a matcher family that does not typecheck
  in this repo. Step 5 already names fail-for-the-right-reason, but PASSIVELY: nothing forces the model
  to confirm its test fails the way it intended.

**Caveats on the transfer, which must not be assumed away.** The lz-refactor forcing function fixed a
RECOGNITION gap in refactoring (see a loop, classify it, convert or decline). Whether the mechanic
transfers to RED test SELECTION is UNPROVEN. And the precision half needs its own control before
anything ships: a forcing function that makes models over-produce tests, or produce tests for
behaviours that are already covered, would be worse than the current null. The lz-refactor probe only
counted as a success because Option B measured 0/5 over-conversions on a decoy-bearing target at BOTH
versions -- an equivalent negative control is mandatory here, not optional.

**Suggested next probe (NOT run, needs its own scoping and approval):** embed an always-active
enumerate-and-decide step in `lz-red`'s `SKILL.md` -- enumerate the declared-but-unverified observable
behaviours, classify which are untested, pick the smallest failing test, and state how it will fail --
then A/B it held-out with a paired recall target and a precision target carrying already-covered
behaviours as decoys. Run it on Opus 5 from the start.

## Disclosures

- **Excluded pilot captures.** 7 earlier pilot runs were archived out of the tabulation path to
  `results-pilots-260727/` so pre-fix instrument versions could not blend into the round. Two of them
  are instrument-IDENTICAL to this round (same checker `atc`, target, prompt, arm and model): including
  those two RXL `with_skill` pilots would make that cell 1/5 = 0.20 rather than the reported 0.33. The
  exclusion is defensible as a clean re-run but is disclosed rather than silent.
- **`Pass@1` and `Pass^1` are the same number** (both `c/n`); `Pass@3` at n=3 is a thresholded
  indicator; `Pass@5`/`Pass^5` are null. Only `c/n` is informative.
- **`drove` means "changed any file"**, not "drove to green", and is 3/3 everywhere.
- **Every number is scoped to `claude-opus-4-8`** at effort `high`. Opus 5 is unmeasured.
- **Judges ran on Opus 5**, a different and stronger model than the subjects.
- One SRVC judge in an earlier pass copied blinded specs into the borrowed srvx checkout to execute
  them, leaving 9 untracked files; they were removed and the repo verified clean. Judge subagents
  should be given read-only tools, or an explicit prohibition on writing to borrowed repos.
- All six borrowed repos verified `git status --porcelain` clean after the round.

## Reproducing

Offline (zero spend):

```
node selfcheck-red.mjs                       # 11 fabricated runDirs across 3 suites; gate on EXIT STATUS,
                                             # and treat any SKIP as unmeasured, never as a pass
node grade-red.mjs --selfcheck               # all 8 D-06 classes + RED attribution + [classify:cond]
node tabulate-mechanical-red.mjs --selfcheck # mechanical rollup + trigger rates + Pass@k/Pass^k
node merge-judge.mjs --selfcheck             # judge-merge / fail-closed verify gate
node tabulate-mechanical-red.mjs             # re-tabulate the captured round
```

Metered (GATED -- fresh explicit user approval required per the standing eval-run rule; the full
sequence is RUN-GATE Steps 3a-3d). `E2E_APPLY_BASE` must be exported for GRC and MUST be unset for the
other suites: both srvx and `primitives-pin` have a `main` branch, so a leaked value grades the wrong
commit SILENTLY, with `apply_base` in the artifact as the only trace.

Contamination flags: GRC HIGH, SRVC LOW, RXF MEDIUM, RXL MEDIUM.
