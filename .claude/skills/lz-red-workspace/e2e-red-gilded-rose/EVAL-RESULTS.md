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

**HEADLINE: no correctness lift and no test-design lift. The baseline is at ceiling.** After the
corrections an independent unbiased audit could defend, pooled Pass@1 is 0.67 for all three arms, and
blind-judge substance is 9/9 for `no_skill` on the three cells that can be judged. The non-null
findings are all off the output axis: the description auto-triggered in 9 of 12 opportunities, the
skill-bearing arms cost more and take more turns, and the only two production edits in the round came
from skill-bearing arms -- which points AGAINST coach-don't-drive, not for it.

**SCOPE WARNING -- every number is `claude-opus-4-8`.** The harness default was a stale pin; Opus 5
had been the default Claude Code model for about a week when this round ran. The output-quality null
survives a stronger baseline (it is a ceiling effect), but the auto-trigger rate does NOT transfer:
trigger propensity depends on how a model weighs skill descriptions, which can shift across a
generation. The pin has since been moved to `claude-opus-5` in all six call sites. Any Opus-5 claim
about this skill is UNMEASURED.

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
- **Cost:** $29.04 / 36 = $0.807 mean. Per cell: GRC $3.81, SRVC $12.16, RXF $3.87, RXL $9.20.

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

**EXCLUDED from the correctness headline. This 0.00 is a PRE-REGISTERED target defect, not a RED
result.** All nine runs graded `compile_error` with exactly 1 new diagnostic, and every one is a
jest-dom matcher TS2339 (`toHaveTextContent` / `toHaveAttribute` "does not exist on type
`JestMatchers<...>`"). Cause: `@types/jest-axe` carries a triple-slash `reference types="jest"`, which
pulls in `@types/jest`, whose `expect` returns `JestMatchers<T>` -- a type `@testing-library/jest-dom/vitest`
never augments. The repo's own `calendar/__tests__/calendar.spec.ts` contains 8 instances of the
identical error; every model used the house idiom and added a 9th, so the differential counted 1 new.
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

| target | arm | wall mean (s) | cost mean ($) | turns mean | tool histogram (top) |
|--------|-----|---------------|---------------|------------|----------------------|
| GRC | no_skill | 111 | 0.38 | 10 | Read:14 Bash:8 Glob:3 Edit:3 |
| GRC | with_skill | 92 | 0.46 | 11 | Read:13 PowerShell:5 Glob:3 Skill:3 Edit:3 |
| GRC | invoke_skill | 137 | 0.43 | 10 | Read:13 Bash:8 Glob:3 Edit:3 |
| SRVC | no_skill | 231 | 1.32 | 22 | Bash:27 Read:21 Write:5 Grep:4 Edit:4 |
| SRVC | with_skill | 258 | 1.49 | 21 | Read:19 Bash:14 Grep:10 Skill:3 |
| SRVC | invoke_skill | 222 | 1.25 | 18 | Read:19 Bash:10 Grep:9 Skill:1 |
| RXF | no_skill | 169 | 0.59 | 13 | Bash:12 Read:11 Edit:4 Grep:4 |
| RXF | with_skill | 186 | 0.68 | 14 | Read:14 Bash:12 Glob:5 Skill:1 |
| RXF | invoke_skill | 172 | 0.62 | 13 | Read:10 Bash:9 Grep:7 Edit:6 |
| RXL | no_skill | 189 | 0.63 | 15 | Bash:16 Read:13 Grep:6 Edit:4 |
| RXL | with_skill | 264 | 0.98 | 20 | Bash:19 Read:16 Grep:9 Skill:2 |
| RXL | invoke_skill | 268 | 0.86 | 17 | Read:16 Bash:15 Grep:10 Edit:3 |

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
