# 260728-1pj -- What is worth FORCE-FUNCTIONING in lz-red

**Researched:** 2026-07-28
**Domain:** skill-authoring forcing functions for a RED-phase TDD coach; evidence from the 36-run
Phase-21 applied eval
**Confidence:** HIGH on the failure-mode characterisation (read from the produced diffs, grades and
transcripts), MEDIUM on candidate ranking, LOW on transfer of the lz-refactor mechanic to RED test
selection (unproven, see "What I could not determine")
**Spend:** ZERO. Read-only repo analysis. No `claude -p`, no metered eval. No file outside this
output path was written. `plugins/lz-tdd/**` untouched. Borrowed repos read via `git grep`/`git log`
only; none modified.

---

## 0. Headline, before the table

Three findings from primary evidence change the shape of the decision, and two of them contradict
the framing in the task brief. Read these first, because the ranking depends on them.

1. **The RXF failure has two independent causes, and BOTH are countable-sample failures.**
   - **(a) Nobody sampled the suite's convention.** jest-dom matchers are not this repo's idiom --
     they are a one-file outlier. Across the 142 `*.spec.ts` files under `packages/primitives`:
     `toHaveAttribute` 0 files, `toHaveTextContent` **1** file (and that file *is*
     `calendar/__tests__/calendar.spec.ts`), against `.toBe(` in 124 files and raw
     `getAttribute(`/`hasAttribute(` in **90**. `[VERIFIED: git grep -l over 142 spec files at pin
     4a7390a2, counted independently in this session]` Of the 9 RXF runs, **7 appended to
     `calendar.spec.ts` and mirrored its sole `toHaveTextContent`; the other 2 created a NEW spec file
     and reached for `toHaveAttribute`, which has ZERO precedent in the entire suite.**
     `[VERIFIED: 9 diff.patch]` So a compiling, convention-following route was not merely available --
     it was **dominant** -- and the specimens missed it by sampling at n=1 (the file they opened) or
     n=0 (training-data jest-dom habit).
   - **(b) Nobody verified.** All 36 runs ran the test runner; only 22 of 36 ran a typechecker, and on
     RXF that is **0 of 9**. Five of those nine then *claimed in prose* that the typecheck was clean.
     `[VERIFIED: transcript tool_use scan across all 36 runs + answer.md]` The models conflated "vitest
     executed my file" with "my file typechecks" -- false in a Vite/esbuild pipeline, where types are
     erased before execution.

   Cause (a) is a *prevention* lever and cause (b) a *detection* lever. Both have countable
   enumeration domains, both are graded exactly by the existing D-06 gate, and they compose.

   > **Correction to an earlier reading, including my own first pass.** "The models followed the house
   > idiom and the house idiom is broken" is FALSE and would have excused the result. Step 3 of
   > `SKILL.md` does tell them to detect the house idiom -- and they *complied, at a sample size of
   > one*. That is the sharpest available statement of the gap: the passive instruction was obeyed
   > and was too weak to bind because it never said how much to sample.

2. **The RXL failure is not (only) a discipline failure. It is lz-red's own step 2 being obeyed.**
   `RXL/invoke_skill/run-2` states verbatim: "Per Law 2, referencing a not-yet-defined symbol *is* a
   legitimate first failure". `SKILL.md:64-65` says exactly that; `SKILL.md:80-83` says the opposite
   ("must fail on its assertion ... not on a compile, import, or setup error"). The D-06 gate sides
   with step 5 and fails step 2. `[VERIFIED: answer.md + SKILL.md]` **A forcing function layered on
   top of an internal contradiction will amplify whichever branch it happens to name.** Fix the
   contradiction first; it is a doctrine question that needs the `oracle` agent (Section 6).

3. **The only measured HARM in the round came from the skill, and it is enumerable and cheap to
   gate.** 3 of 36 runs added two tests instead of one; in 2 of those the extra test was already
   green. All 3 are skill-bearing arms; the baseline is 0 of 12.
   `[VERIFIED: added_test_titles vs attributed_failures across 36 red-grade.json]`

A fourth finding constrains everything: the project's own prior research already established the
decisive selection criterion for this class of intervention. From
`.planning/quick/260712-n5o-skill-methodical-nx-fleet/260712-n5o-RESEARCH-review-regimes.md:152-155`:

> "the mechanism works **when countability is anchored to ground truth** (counts you can verify from
> the artifact). 'Countability' per se is not the lever; *externally-checkable* countability is.
> Adding structure/verbosity without an anchor can add a veneer of rigor while amplifying bias."

`[CITED: in-repo prior art, itself citing arxiv.org/abs/2603.00539 and arxiv.org/html/2605.06283]`

That is why "enumerate every loop" worked: loops are syntax tokens you can count in a file. It is
also why the most emotionally appealing lz-red candidate ("enumerate the observable behaviours the
contract promises") ranks fourth rather than first -- its enumeration domain is a taste judgement,
not a token set.

---

## 1. RANKED recommendation

Ranked on: strength of measured failure evidence x anchoring of the enumeration domain x
measurability by the existing instrument x availability of a paired precision control.

| # | Candidate discipline | Failure evidence in this round | Enumerable? (anchored to countable tokens) | Measurable by existing instrument? | Over-application hazard | Already passive prose? | Verdict |
|---|----------------------|-------------------------------|--------------------------------|-----------------------------------|------------------------|------------------------|---------|
| **1** | **Sample the suite's assertion convention by COUNT before writing: for the assertion form you are about to use, count how many existing spec files use it versus the alternatives, state the counts, and take the dominant form.** | STRONGEST in the round. RXF 9/9 `compile_error` on a matcher family used by 1 of 142 spec files (`toHaveTextContent`) or 0 of 142 (`toHaveAttribute`), while the dominant compiling form -- raw `getAttribute`/`textContent` + `.toBe(` -- sits in 90 and 124 files. 7/9 sampled at n=1 (the opened file); 2/9 at n=0. | **YES, best-anchored of all candidates.** The domain is a grep count over spec files -- externally checkable, re-walkable by a reader, exactly the property the in-repo prior art names as the lever. | **YES, mechanically and with zero new instrumentation.** Matcher choice IS the RXF verdict: `compile_error -> genuinely_red`. Also directly transcript-checkable (did a suite-wide grep occur). | Cargo-culting a dominant-but-poor convention; grep spend on large repos; picking a majority form that is wrong for the specific assertion. Precision control: a target whose dominant convention is genuinely unsuitable for the behaviour at hand -- the model must deviate and SAY why. | PARTIAL, and this is the sharp part. `SKILL.md:69` already says "Detect the house test idiom" -- and the models COMPLIED at sample size 1. The instruction exists; the **count** does not. Textbook "make existing advice active by anchoring it to a number". | **PROBE FIRST** |
| **2** | **Verify the red with cited evidence: before declaring "red for the right reason", run the project's TYPECHECKER as well as the runner, and quote the output line that proves the failure is an assertion failure.** | STRONG. RXF 9/9 `compile_error`, 0/9 ran any typecheck; 5/9 asserted a clean typecheck they never ran. Whole-round 2x2: typecheck-run 17/22 pass vs not-run 2/14 (confounded -- see Section 4). | YES -- a closed 2-item gate plus a required quoted-evidence artifact. Not an open enumeration, which is a strength: nothing to over-enumerate. | YES, exactly, zero new instrumentation. D-06 *is* a differential typecheck. | Model "fixes" pre-existing repo diagnostics, or edits `tsconfig`/`vite.config` to silence its own error. Precision target already exists: RXF carries 8 pre-existing identical jest-dom errors that MUST be left alone. Metric: files changed outside the produced test file. | PARTIAL, and inverted. "Confirm it fails for the right reason" is present (`SKILL.md:80-86`) but the skill **actively forbids the act** ("do not run the suite unprompted", `SKILL.md:83`; `vitest-typescript-mechanics.md:122-124`). The runner-vs-typechecker distinction is absent entirely -- that part is NEW. | **STRONG, but has a discoverability obstacle (Section 4)** |
| **3** | **Coverage audit: enumerate the tests that already exist for the symbol under change, mark each candidate behaviour COVERED or UNCOVERED with a one-line reason, and write the test for an UNCOVERED one.** | MODERATE, 3/36 with one shared root: `GRC/invoke_skill/run-1` (targeted an already-implemented normal item), `SRVC/with_skill/run-2` and `SRVC/invoke_skill/run-2` (added a test that was already green). | YES, strongly. `it(` / `test(` titles in the target spec files are countable tokens the model has already read. | PARTIALLY. `false_green` verdict class exists; judge dim 1 ("is THIS the right next test") caught `GRC/invoke_skill/run-1` on both passes. No single mechanical number. | Turn/token spend cataloguing; worse, the model DECLINES to write a test claiming coverage exists -- and the skill names refusal as "the failure to avoid" (`SKILL.md:124-125`). Precision target needs a similarly-named-but-different existing test over a genuinely uncovered behaviour. | LARGELY NEW. The running test list is about behaviours you OWE, not an audit of what exists; step 3 audits the *idiom* (shape), not coverage. `anti-patterns.md:65-76` covers the symptom, not the pre-check. | **BEST STRUCTURAL TWIN OF THE LOOP AUDIT** |
| **4** | **One-failing-test gate: count the tests your diff adds; exactly one must fail, and none may pass on arrival. Park the rest as `it.todo`.** | WEAK-MODERATE base rate but it is the round's only skill-attributable harm: 3/36 added 2 tests, all 3 in skill-bearing arms, baseline 0/12. | YES, strongly. The added `it(`/`test(` calls are tokens in the diff the model just wrote. | YES, nearly free. Derivable today as `added_test_titles.length - attributed_failures > 0`; a ~5-line grader change records added-but-passing exactly. Caveat: `it.todo` inflates `added_test_titles` (this is why `RXL/with_skill/run-1` reads 2 titles benignly). | Direction is subtractive, so the hazard is UNDER-production: dropping a legitimately useful second case instead of parking it. Precision control: a target where a second case is warranted -- check it lands as `it.todo`, not deleted. | YES. Law 2 / one-small-step (`SKILL.md:63-65`, `three-laws-and-test-selection.md:34-44`) and anti-pattern 4. Pure "make existing advice active". | **CHEAP ADD-ON** |
| **5** | **Observable-output enumeration: list what the contract promises OBSERVABLY, then assert one of those, not an internal seam.** | APPARENTLY STRONGEST headroom (RXL 0/9 on both judge dims, all arms, nobody rendered) but the cell is confounded -- see Section 4. | **NO.** "What the contract promises observably" is a judgement, not a token set. This is precisely the unanchored-countability failure the in-repo prior art warns amplifies bias. | Blind judge dim 2 only. It does discriminate (0/9 RXL vs 9/9 elsewhere) but it is an LLM judge, not a mechanical gate. | HIGH and poorly bounded: pushes every unit test toward end-to-end rendering, trading away F.I.R.S.T. Fast/Isolated -- properties the skill itself defends (`test-structure-and-assertions.md:107-121`). Precision control would need a target where a value-level assertion is correct and rendering is wrong. | YES, heavily -- `SKILL.md:76-79`, four pillars `test-structure-and-assertions.md:91-105`, assertion-style selection `:123-139`. Pure "make existing advice active". | **NEEDS A NEW CELL FIRST** |
| -- | Never fabricate an expected value to manufacture red ("RED sentinel") | n=1 (`GRC/invoke_skill/run-1`) | No -- a prohibition, not an enumeration | Judge dim 1 caught it | Would suppress legitimate characterization tests, which the skill's own stance router routes to | Semi-new; anti-pattern 4 covers false green, not fabricated expectations | **DO NOT force-function.** One negative example at most |
| -- | Coach-don't-drive (do not touch production) | 2/6 skill-arm production edits vs 0/3 baseline -- points AGAINST the skill | No -- a prohibition | `changed_production_files` (mechanical) | n/a | `SKILL.md:119-125` | **DO NOT force-function on this evidence.** Both edits were on a structurally unpassable cell where a production stub was the only route to a compiling test, i.e. a rational response to an impossible cell. Re-measure on a passable cell first |

### BLOCKER that outranks all five

| # | Item | Why it blocks |
|---|------|---------------|
| **0** | **Resolve the step-2 / step-5 contradiction about whether a missing-symbol compile error is a valid red to hand forward.** | 7 of 9 RXL runs failed the gate by taking the step-2 branch, and at least 4 said so explicitly. Any forcing function added on top of this will lock in whichever branch its wording happens to favour, and the choice has never been deliberated. This is a **doctrine** question, not a discretion gap. Needs the `oracle` agent (Section 6), then a decision, then the probe. |

### Suggested sequence (mirrors the path lz-refactor actually took, which is the only path with evidence)

1. **Zero spend.** Resolve blocker 0 via the `oracle` questions in Section 6. Decide the doctrine.
2. **Cheap prompt-level diagnostic, k=3-5, ONE cell (RXF).** Put candidates #1 and #2 in the RUN
   PROMPT and measure `compile_error -> genuinely_red`. RXF is the ideal diagnostic cell: 0/9 today,
   9/9 correct designs, a 1-expression fix, and a canary proving the compiling route. This is the
   exact move `heldout-enum/RESULTS-enum.md` made for lz-refactor, and it **falsified a wrong
   conclusion the project had already adopted** ("judgment ceiling, stop"). It costs one cell and it
   separates discretion/salience from capability before any skill is edited.
   *Consider running #1 and #2 as separate prompt variants rather than one combined directive* -- they
   are prevention versus detection, and a combined probe cannot attribute the lift.
3. **Only then** the skill-level A/B, with a paired recall target AND a precision target, on Opus 5
   from the start, with mandatory 2-subagent review (>=1 unbiased) of the skill edit before the eval.
   Tune recall and precision in the SAME edit, as lz-refactor v2 did.

---

## 2. The mechanic, extracted from the lz-refactor precedent

Sources: `.claude/skills/lz-refactor-workspace/e2e-angular/RESULTS-skill-forcing-function.md`,
`.claude/skills/lz-refactor-workspace/e2e-angular/heldout-enum/RESULTS-enum.md`, the shipped step at
`plugins/lz-tdd/skills/lz-refactor/SKILL.md:88-109`, commit `01208c8`. All `[VERIFIED: read in
this session]`.

### Load-bearing properties

| Property | Evidence it is load-bearing |
|----------|----------------------------|
| **ALWAYS-ACTIVE, in `SKILL.md`, not in a routed leaf** | Explicit in the shipped text: "run this even when step 2 never flagged the Loops smell". The five prior nulls include few-shot examples placed in the `loops.md` LEAF; the diagnosis in `RESULTS-enum.md` is "recognition ceiling BEFORE routing -> Loops leaf never opens -> leaf examples never reach context". Placement is the difference between the null and the hit. |
| **Enumeration over an EXTERNALLY COUNTABLE domain** | The step names the tokens to count: `for` / `for-of` / `while`, `.reduce()`, `result.push(...)`, `set.add(...)`, `map.set(...)`, `total +=`, `x = new Set([...x, ...])`. The model cannot claim completeness without walking a list a reader can re-walk. In-repo prior art (`260712-n5o-RESEARCH-review-regimes.md:152-155`) says this anchoring, not countability as such, is the lever. |
| **A FORCED VERDICT PER ITEM, with a one-line reason** | "answer yes or no with a one-line reason". `heldout-enum/RESULTS-enum.md:38` records the proof that this produces judgement rather than obedience: run-5 emitted a 7-row audit table and correctly LEFT the already-pipeline `not` site. Without a per-item verdict there is no place for a decline to surface. |
| **An explicit NO-list (the decline criteria)** | side effects, index/neighbour dependency, multiple accumulators, hot path, external merge target. This is what holds precision at 0/5. The v2 tightening that lifted recall to 5/5 also ADDED a decline boundary (scalar-merge -> spread, external target -> leave) because the unbiased reviewer flagged an over-conversion hazard the recall fix would otherwise have created. **Recall and precision were tuned in the same edit.** |
| **Closing self-check placement ("before you finish")** | Appended to step 5, the last acting step, so it is read at the recency-advantaged end of the procedure. Matches in-repo prior art A5 and C2 (`260712-n5o-RESEARCH.md:43-44`, `:78-80`). |
| **Intent routing preserved** | "on a COMMAND ... convert them; on a QUESTION, present them as next steps and do not edit". The forcing function did not override the coach/drive seam. Any lz-red analogue must respect the same seam. |

### Incidental, not load-bearing

- The specific catalog vocabulary (filter/map/sum/group-by/union/classify) -- a convenience label set.
- Length (~22 lines). Nothing indicates a length threshold.
- Living in step 5 specifically rather than "the last acting step".
- The named target of the yes-list (`Replace Loop with Pipeline`). The mechanic is audit-then-decide;
  the destination is domain content.

### What the PRECISION control looked like, and why the result only counts because of it

Option B: held-out `stylesheet-updates.ts` carrying **8 varied NON-convertible loops** -- worklist/
consume, early-return, continue+mutation, multiple accumulators, per-iteration I/O,
order-interdependence -- plus a deliberate **decoy**: `for (dep of deps) all.add(dep)`, a set-merge
that looks exactly like the shape the recall fix teaches you to convert. Result: **0/5 wrongful
conversions at BOTH v1 and v2**, with the decoy named and left ("spreading a fresh Set each iteration
would be worse"), and correct `.some()`/`.find()` on the early-exit loops.

Why it is decisive: recall 5/5 is trivially obtainable by a rule that says "convert everything". The
only thing separating a working forcing function from a blanket mandate is a target where the right
answer is mostly NO, measured under the same skill version. Without Option B the recall number is
uninterpretable. **The unbiased reviewer found the over-conversion hazard in v2's own recall fix
before it shipped** -- so the precision control was not a formality, it changed the shipped text.

Two further transferable process facts:

- The prompt-level probe came FIRST and was the thing that flipped the project's conclusion. It cost
  one target and it beat an inference drawn from adjacent literature.
- The shipped text closes with an anti-mandate sentence: "This audit is not a mandate to convert
  every loop -- an unwarranted pipeline is as unwelcome as an unwarranted pattern."

---

## 3. What the models actually got wrong -- characterised from the artifacts

Method: read all 36 `diff.patch` files, all 36 `red-grade.json`, all 36 `answer.md`, and scanned all
36 `outputs/transcript.stream.jsonl` for `tool_use` command strings. Failure classes below are mine,
not the eval's.

### FM-1 (RXF, 9/9) -- Sampled the convention at n=1, then claimed a verification never performed

Two separable causes. Either one alone is sufficient to explain the 9/9.

**(a) Convention sampled at n=1 (or n=0).**

- Every RXF run graded `compile_error` with exactly 1 new diagnostic, a jest-dom TS2339 on
  `toHaveTextContent` / `toHaveAttribute`. `[VERIFIED: red-grade.json x9]`
- Measured across the 142 `*.spec.ts` files under `packages/primitives` at pin `4a7390a2`:

  | assertion form | files |
  |----------------|-------|
  | `.toBe(` | 124 |
  | raw `getAttribute(` / `hasAttribute(` | 90 |
  | `toHaveTextContent` | **1** -- and that file IS `calendar/__tests__/calendar.spec.ts` |
  | `toHaveAttribute` | **0** |
  | `toBeInTheDocument` / `toBeVisible` / `toHaveClass` / `toBeDisabled` | 0 each |

  `[VERIFIED: git grep -l, counted independently this session]`
- Split by what the run did: **7 of 9 appended to `calendar.spec.ts` and mirrored its sole
  `toHaveTextContent`. The other 2 created a NEW spec file and reached for `toHaveAttribute`, a
  matcher with ZERO occurrences in all 142 files.** `[VERIFIED: 9 diff.patch, newSpecFile flag]`
- So the two sub-cases are "sampled only the file I opened" and "sampled nothing, used training-data
  habit". Neither sampled the suite. `test-setup.ts` does import
  `@testing-library/jest-dom/vitest`, so the matchers LOOK available -- the trap is real, but the
  dominant convention was compiling and sat in 90 of 142 files.
- **This corrects the "they followed the house idiom and the house idiom is broken" reading** (present
  in an earlier draft of this document and in an earlier revision of `EVAL-RESULTS.md`). That framing
  excuses the result. The measured position is that `SKILL.md:69` told them to detect the house idiom,
  **they complied at sample size one**, and the instruction was too weak to bind because it never
  quantified the sample.

**(b) Verification claimed but not performed.**

- **All 9 ran vitest. 0 of 9 ran `tsc` or `atc`.** `[VERIFIED: transcript tool_use scan]`
- **5 of 9 stated the typecheck was clean anyway.** `RXF/invoke_skill/run-1`: "Typecheck: clean --
  the test compiles and all the symbols resolve." `RXF/no_skill/run-1`: "fails exactly as intended
  (typecheck passed -- the file compiled)". Neither ran a typechecker.
  `[VERIFIED: answer.md + tool_use scan]`
- Mechanism: Vitest transpiles via esbuild, which strips types without checking them. A type-broken
  spec executes happily and reports `AssertionError: expected null to be truthy` -- indistinguishable
  from a valid red. The reasoning was locally sound; the conclusion was false.

**Common ground.** The designs were right (9/9 on both judge dimensions), and `canary-rdxf-red`
proves a compiling route differing by ONE expression:
`expect(el?.textContent?.trim()).toBe('20')` instead of `expect(el).toHaveTextContent(...)` --
which is also the suite's dominant form. `[VERIFIED: fixtures/canary-rdxf-red/diff.patch]`

**Class: discretion / salience plus a compliance gap. Not capability.** The fix is one expression the
models write elsewhere; the missing acts are counting and checking.

### FM-2 (RXL, 9/9 non-rendering; 7/9 unresolved-symbol failure) -- Doctrine conflict, not discretion

- All 9 asserted an injection token: 8 named `RDX_LOCALE`, one `RADIX_LOCALE`. **None rendered
  anything.** `[VERIFIED: 9 diff.patch]`
- 7 of 9 referenced a symbol absent at the pin. Grade: `TS2305: Module '"../src/config.provider"'
  has no exported member 'RADIX_LOCALE'`, and at runtime `TypeError: Cannot read properties of
  undefined (reading 'hasOwnProperty')` from `R3Injector.get` -- **the test never reached an
  assertion.** `[VERIFIED: red-grade.json failure_excerpt]`
- The 2 passes are the round's only 2 production edits: both created an `RDX_LOCALE` InjectionToken
  with a `computed(() => 'en')` factory in `config/src/config.provider.ts` and asserted against their
  own stub. `RXL/invoke_skill/run-1` labels it "STUB (RED)". `[VERIFIED: 2 diff.patch]`
- **5 of 9 DID run a typechecker and shipped the compile error deliberately.** Verbatim:
  - `RXL/invoke_skill/run-2`: "Per Law 2, referencing a not-yet-defined symbol *is* a legitimate
    first failure".
  - `RXL/with_skill/run-3`: "this is the legitimate first failure; the test is asking for production
    code that doesn't exist yet".
  - `RXL/no_skill/run-2`: "confirms the real red for the right reason".
  - `RXL/with_skill/run-2`: "red for the right reason".
  - `[VERIFIED: answer.md x4]`
- Within RXL there is **no** typecheck-to-pass correlation: typecheck-run 1/5 pass, not-run 1/4 pass.
  Diligence was not the binding constraint here. Doctrine was.
- **This means the brief's framing of RXL as a pure discretion/salience gap is not supported.** It is
  at least partly a definitional mismatch between `SKILL.md:64-65` (Law 2 blesses the missing-symbol
  failure) and `SKILL.md:80-83` + D-06 (which forbid it). The baseline reached the same conclusion
  without the skill, so the prior is the model's too -- the skill ratifies rather than originates it.
- Verified independently that the rendering route WAS available: `calendar-root.directive.ts:53`
  declares `locale = input<string>('en')`, and `calendar.ts:107,317` build the heading through
  `createFormatter(props.locale())` / `formatter.fullMonthAndYear(...)`. A test rendering the calendar
  under `provideRadixNG({ locale: 'de-DE' })` and asserting the heading text would use only existing
  symbols and would fail on its assertion. `[VERIFIED: git grep in radix-ng/primitives-pin @ 4a7390a2]`
  Caveat in Section 4.

### FM-3 (3/36, all skill-bearing) -- Added a test that was already green

- `SRVC/with_skill/run-2` and `SRVC/invoke_skill/run-2` each added 2 tests where 1 failed.
  `added_test_titles: 2`, `attributed_failures: 1`. The first test ("a lone Set-Cookie staged on the
  Node res survives a web Response") passed on arrival; only the second (both-sources) failed.
  `[VERIFIED: red-grade.json + diff.patch]`
- Baseline wrote exactly 1 test in 3/3 SRVC runs. Rate: skill arms 2/6, baseline 0/3; round-wide
  skill arms 3/24 vs baseline 0/12 (the third, `RXL/with_skill/run-1`, is a benign `it.todo` --
  arguably the running-test-list move working correctly).
- **Class: over-production caused by the skill's own running-test-list / triangulation content.**
  Directly relevant to the over-application hazard of ANY enumeration step added to lz-red: the
  passive version of "keep a list of behaviours you owe" already measurably produces extra tests.

### FM-4 (1/36) -- Wrong target plus a fabricated expectation

- `GRC/invoke_skill/run-1` ignored the Conjured gap entirely, tested an already-correct normal item,
  and wrote `expect(item.quality).toBe(-1)` with the comment "RED sentinel: this value is
  deliberately wrong so the bar fails on the assertion and reveals the real behavior. Lock in the
  revealed value to go green." `[VERIFIED: diff.patch]`
- Mechanically `genuinely_red` / pass=true. Both blind judge passes failed it. This is the round's
  clean demonstration that the D-06 gate does not require the test to be RIGHT.
- Root shared with FM-3: no check of what is already covered before choosing.

### Failure modes I checked for and did NOT find

- No snapshot-as-thinking. No reflection into privates. No over-mocking: SRVC runs used a real
  `serve()` + real `fetch`; radix runs used real TestBed renders.
- No arrange-act-assert structural breakdown. Naming was behaviour-oriented throughout.
- No run failed to run the runner. 36/36 ran it.
- GRC is at ceiling: 9/9 mechanical, 9/9 judge (bar FM-4). **There is nothing to force-function on
  the textbook case.**

---

## 4. Skeptical review of my own strongest inferences

Recorded because the brief asked for measurement over inference and the project has a documented
history of over-swinging on adjacent reasoning.

- **The 2x2 (typecheck-run 17/22 pass vs not-run 2/14) is confounded by cell difficulty.** GRC and
  SRVC are the easy cells and also the cells where models typechecked. Within RXL the correlation
  vanishes (1/5 vs 1/4). The only clean within-cell signal is RXF: 0/9 typechecked, 0/9 passed, and a
  1-expression fix existed. So candidate #2's evidence is **one cell plus a plausible mechanism plus
  five explicit false claims**, not a round-wide causal result. That is why the probe comes first.
- **Candidate #2 has a measured DISCOVERABILITY OBSTACLE that candidate #1 does not.** In this repo a
  naive typecheck is hard to invoke correctly: there is no root `tsconfig.json` (only
  `tsconfig.base.json`), `atc` requires an explicit `-c`, and the ad-hoc `npx tsc` invocations the
  models improvised produced spurious path-alias noise which they then dismissed --
  `RXL/invoke_skill/run-2`: "the two `TS2307` module-resolution errors are just my throwaway `tsc`
  invocation not resolving the `@radix-ng/*` path aliases; ignore them."
  `[VERIFIED: answer.md; corroborated by targets.json:26 on the missing root tsconfig]` A "run the
  typechecker" directive that does not also tell the model how to FIND the right project will produce
  noise the model correctly learns to ignore -- and dismissing noise is how it dismissed the real
  error. Candidate #1 needs only `git grep`, which has no such failure mode.
- **Candidate #1's counts are pin-specific.** 90/142 and 1/142 are facts about radix-ng at
  `4a7390a2`. The MECHANIC (count, then take the dominant form) is general; the numbers are not, and
  a probe must not be tuned to them.
- **RXL is a compromised cell, and its 0/9 should not carry a candidate on its own.** Three
  independent problems: (a) the prompt names `config.provider.ts` and directs the test into
  `packages/primitives/config/__tests__/`, anchoring away from calendar rendering; (b) the cell's own
  `discipline_traps` conflict -- "assert the rendered month heading" versus "the gap is the missing
  inheritance, not one primitive's default", and the DI-seam route is the faithful reading of the
  second; (c) **no canary was ever run for RXL** -- `targets.json:154` explicitly waives one ("No new
  canary is required if the three config blocks stay deep-equal"). My verification that the rendering
  route grades `genuinely_red` is a source-read inference, NOT an executed canary. `[ASSUMED]`
- **9/9 identical behaviour across three arms including the baseline is the signature of a strong
  prior, not of low salience.** In the lz-refactor case, discretion was *proved* by a prompt-level
  directive flipping 0/5 to 5/5. No equivalent exists for lz-red. Calling RXL a salience gap today is
  an unproven claim borrowed from the sibling skill.
- **Candidate #3's base rate is 3/36.** Even a perfect fix buys ~8% of runs. Its value is that it
  repairs a regression the skill itself causes, not headroom.
- **The unbiased reviewer's latent grader findings still stand** and could bite a follow-up probe:
  `rightReason` regexes run over raw `failureMessages` including the code frame (model-authored text
  can flip a verdict); `attributedAssertions` matches on `title` not `fullName`; only
  `producedTests[0]` is executed; `changedProductionFiles` would classify `vite.config.ts` as
  production. The last one is arguably useful for candidate #1's precision metric -- a model
  silencing a type error by editing `vite.config.ts` or a tsconfig would be caught.

---

## 5. What is NOT worth force-functioning

| Item | Why not |
|------|---------|
| **Anything on GRC's failure surface** | 9/9 mechanical and 9/9 judge. Ceiling. No headroom, and a forcing function here can only add cost. |
| **Coach-don't-drive** | The round's evidence points the WRONG way (skill arms 2/6 production edits, baseline 0/3), and both edits were on a cell that is structurally unpassable without a production stub -- a rational response, not an indiscipline. Re-measure on a passable cell before treating this as a defect at all. |
| **"Match the house test idiom" -- restated as prose** | Already mandated (`SKILL.md:69-75`) and it was OBEYED in all 9 RXF runs, at sample size 1. Re-asserting it more emphatically changes nothing; the binding defect is the absent sample size. Candidate #1 is the same instruction with a count attached, which is a different intervention. |
| **A second, competing matcher rule** (e.g. "prefer plain matchers over jest-dom") | Domain-specific, brittle, and it would be WRONG in a repo whose suite genuinely uses jest-dom throughout. Candidate #1 gets the same outcome from a repo-local count, with no hardcoded preference. |
| **"Never fabricate an expected value"** | n=1. A forcing function needs a base rate. Worse, it collides with the characterization-test route the skill's own stance router offers (`test-structure-and-assertions.md:130-131`, `testing-stance/seams-and-legacy.md`), where pinning "whatever it does now" is correct. One negative example, not a gate. |
| **Anything phrased as a prohibition** | In-repo prior art B3 (`260712-n5o-RESEARCH.md:58-60`): negations are the weakest instruction form, and larger models get *worse* at negated instructions. Candidates whose natural form is "do not X" (fabricated expectations, don't-drive) are structurally poor forcing-function material. |
| **A general "assert observable behavior" audit as the FIRST probe** | Its enumeration domain is unanchored, its only instrument is an LLM judge, its motivating cell is confounded and uncanaried, and the advice is already present three times passively. Rank 4 stands, and it needs a purpose-built cell first. |

### Is any of it a capability limit?

Assessed honestly, since the project has burned probes on this mistake before.

| Failure mode | Capability limit? | Basis |
|--------------|-------------------|-------|
| FM-1 (RXF matcher) | **NO, and this is now well established** | The compiling form is the suite's DOMINANT form (90/142), the fix is one expression the models write elsewhere, the canary proves the route, and the models *claimed* to have done the check they skipped. Both halves are discretion/salience plus a compliance gap (in-repo prior art B1, arXiv 2605.01771) -- the most tractable class. |
| FM-2 (RXL non-rendering) | **UNPROVEN, and probably not the right question** | It is at least partly a doctrine conflict inside the skill (blocker 0). Until step 2 versus step 5 is resolved, "can the model do it" is not what is being measured. A forcing function cannot fix a contradiction, and this project has already spent five probes learning that you must run the direct experiment rather than infer. |
| FM-3 (extra green test) | **NO** | The models wrote correct tests; the defect is one too many. Counting your own additions is not a capability question. |
| FM-4 (fabricated expectation) | **NO, but n=1** | Judge caught it; the model plainly knew what it was doing ("deliberately wrong"). Not a capability limit, just too rare to gate on. |

**Nothing in this round looks like a hard capability ceiling.** That is genuinely encouraging for the
forcing-function thesis and should be stated as such -- but "not a capability limit" is not the same
as "a forcing function will fix it", which is what blocker 0 and the step-2 probe exist to determine.

---

## 6. Questions to route to the `oracle` agent

Not answered here: `.oracle/` was not read, per project rule. These block or shape blocker 0 and
candidate #1.

1. **Clean Code, Ch. 9 (Unit Tests), Second Law.** Does "write only as much of a unit test as is
   sufficient to fail" mean (a) compilation failure is an acceptable red bar to STOP AT and hand
   forward to the green step, or (b) only the point at which you stop WRITING the test? Does Martin
   anywhere require the red bar be an assertion failure rather than a compile failure? Does he
   discuss the case where the symbol under test does not yet exist and the test cannot compile?
   *(This decides whether `SKILL.md:64-65` or `SKILL.md:80-83` is the faithful reading, and therefore
   whether 7/9 RXL runs were disciplined or undisciplined.)*
2. **Kent Beck, Canon TDD / TDD by Example.** On the same point: is "watch it fail" satisfied by a
   compile error, or does Beck require the test to run and the assertion to fail? Is there explicit
   guidance on writing a minimal production stub purely so the test compiles, and whether that
   violates the first law?
3. **Clean Code / Canon TDD.** Is there source support for a "confirm the red before writing
   production code" step that requires *executing* the test (as opposed to reasoning about it)?
   *(lz-red currently forbids running the suite unprompted; candidate #1 needs to know whether that
   prohibition has source backing or is lz-red orchestration.)*
4. **Any owned source (Beck, Martin, Metz, Khorikov).** Is there guidance on checking whether a
   behaviour is ALREADY covered by the existing suite before adding a test -- i.e. source backing for
   candidate #2's coverage audit? Or is that unowned/no-oracle territory?

---

## 7. Project constraints that bind the follow-up work

From `CLAUDE.md` / `AGENTS.md` / project memory. These are not research findings; they are the rails.

- **Metered eval runs require fresh explicit user approval.** Standing eval-run rule. Prep is fine;
  halt before execute. This document spent nothing.
- **Every edit to a `SKILL.md` or agent definition must be reviewed by subagent(s) before
  acceptance,** with at least one reviewer given a from-scratch unprimed brief. Both lz-refactor
  forcing-function versions passed a 2-subagent review, and the unbiased reviewer caught the v2
  over-conversion hazard. Harness `.mjs` changes are exempt.
- **Do not read `.oracle/`.** Route book questions to the `oracle` agent (Section 6).
- **Borrowed repos under `D:/projects/github/` are read-only.** Apply-mode probes run in a throwaway
  worktree; the harness refuses apply on protected branches; reset the working tree at the START of
  each run.
- **ASCII only.** No emojis, em dashes, en dashes, curly quotes, ellipsis characters.
- **Public repo hygiene:** allowlist-inversion only; never write a forbidden value as a search
  needle, including in planning docs.
- **`git grep` cannot see gitignored paths** -- `.claude/skills/*-workspace/node_modules` and any
  ignored results tree need `rg -uu`.
- Reload plugins after any shipped skill change before measuring it as live.

---

## 8. What I could not determine

| # | Open question | Why it is open | How to close it |
|---|---------------|----------------|-----------------|
| 1 | Would a typecheck have actually changed the RXF outcome? | 0/9 ran one, so there is no observation of a model reacting to TS2339 on its own new line. The canary proves a compiling route exists but says nothing about whether a model finds it when shown the error, and the RXL answers show models dismissing genuine tsc output as invocation noise. Mechanism plausible; effect size unmeasured. | The prompt-level diagnostic in step 2 of the sequence. One cell, k=3-5. Give the model the CORRECT typecheck invocation, or the probe measures tsc ergonomics rather than the discipline. |
| 1b | Would a convention COUNT have changed it? | Same gap: nobody ran a suite-wide grep, so there is no observation of a model reacting to "0 of 142 files use this matcher". The signal would be overwhelming (0-or-1 versus 90), which is why this ranks first -- but it is an inference from the counts, not a measurement of behaviour. | Same probe, separate prompt variant so the lift is attributable. |
| 2 | Is RXL's 0/9 a discretion gap at all? | Confounded prompt anchor, self-contradicting traps, no canary, and 9/9 uniformity across arms reads as a strong prior. | Redesign the cell (prompt that does not anchor the file; non-conflicting traps; a canary proving the rendering route grades `genuinely_red`), THEN a prompt-level directive probe. Do not skip the canary. |
| 3 | Does the audit-then-decide mechanic transfer from RECOGNITION (see a loop, classify it) to SELECTION (choose which behaviour to test)? | Zero evidence either way. Loops are a closed token set; candidate behaviours are not. The anchoring criterion predicts weaker transfer for #4 than for #1/#2/#3, but that is a prediction. | Candidate #2 is the cleanest test of it, since existing test titles ARE a closed token set. |
| 4 | Does the doctrine question have a source answer? | `.oracle/` not read by rule. | Section 6 questions to the `oracle` agent. |
| 5 | Is there measured prior art on the precision cost of enumerate-then-decide steps specifically? | WebSearch was unavailable this session (tool returned an effort-config API error on both attempts; I did not burn further budget walking the fetch chain given the in-repo prior art already covers it). The nearest in-repo anchors are arXiv 2603.00539 (rubric elaboration INCREASED false positives in code review) and arXiv 2605.06283 (decomposition benefit smallest or negative for subjective criteria), both already cited in `260712-n5o-RESEARCH-review-regimes.md`. `RESULTS-enum.md:34` also references a "Midolo 71%-broken" figure without a full citation. | If wanted: one targeted search for measured over-application costs, plus recover the Midolo citation. Low marginal value -- the in-repo prior art already supplies the decisive criterion. |
| 6 | What does the SRVC multi-line `test.skipIf(cond)(\n'title')` grader defect do to a follow-up round? | Deliberately unfixed. It cost this round one `unattributable` verdict on a substantively correct run. | Fix or accept explicitly before the next metered run; it will recur. |
| 7 | Would candidate #1 hold on Opus 5? | The whole main round is `claude-opus-4-8`. The Opus 5 probe covered only GRC/`with_skill` trigger + verdict (3/3, 3/3) and had no comparison arm. RXF is untested on Opus 5, and RXF is where every candidate-#1 observation lives. | Run the diagnostic on Opus 5 from the start, per the round's own recommendation. Budget ~1.8x. |

---

## Assumptions log

| # | Claim | Section | Risk if wrong |
|---|-------|---------|---------------|
| A1 | A test rendering the radix calendar under `provideRadixNG({ locale: 'de-DE' })` would typecheck clean and fail on its assertion, i.e. RXL was answerable via the rendering route. Read from `calendar-root.directive.ts:53` and `calendar.ts:107,317`; **not executed as a canary.** | 3 (FM-2), 4 | If false, RXL is unpassable by ANY route and its 0/9 measures nothing about the models. Candidate #4's motivating evidence evaporates entirely. |
| A2 | Showing a model a TS2339 on its own new line would cause it to switch matcher families. Inferred from the 1-expression gap to the canary and from the models' competence elsewhere. | 1 (#2), 3 (FM-1b) | If false, candidate #2 is null and RXF is closer to an environment trap. The RXL noise-dismissal observation is a live reason it might be false. Exactly what the cheap probe tests. |
| A2b | Reporting "0 of 142 spec files use `toHaveAttribute`; 90 use raw `getAttribute` + `.toBe`" would cause the model to take the dominant form. Inferred from the size of the margin, NOT observed -- no run performed a suite-wide grep. | 1 (#1), 3 (FM-1a) | If false, the top-ranked candidate is null. It remains the best-anchored candidate either way, so it is still the right thing to probe first. |
| A2c | My earlier claim that "the models followed the house idiom and the house idiom is broken" was wrong; corrected in this document after independently counting the 142 spec files. Recorded so the superseded reading is not re-adopted from an earlier draft or from the pre-correction `EVAL-RESULTS.md` text. | 0, 3 (FM-1a) | Re-adopting it would excuse a fixable discretion gap as an environment trap and would drop the top candidate. |
| A3 | `added_test_titles.length - attributed_failures > 0` is a sound proxy for "added a test that was already green". Verified on `SRVC/with_skill/run-2` (2 titles, 1 failure, first test green) but `it.todo` and skipped tests inflate the numerator, as `RXL/with_skill/run-1` shows. | 1 (#3) | A precision metric built on it would over-report. Mitigate with the ~5-line grader change rather than the proxy. |
| A4 | Anthropic skill-authoring and instruction-position findings quoted from `260712-n5o-RESEARCH.md` are current. Not re-verified against the live sources this session. | 2, 5 | Low. They are used for framing (placement, negation, self-check), not as load-bearing quantities. |
| A5 | The 6 "unbacked typecheck claim" detections are correct. Regex-based over `answer.md` prose against a regex-based command scan; both could misfire. The 5 RXF ones were confirmed by reading the answer text directly. | 3 (FM-1) | The SRVC one is the least verified and is immaterial (that run passed). |

## Sources

**Primary (HIGH, all read in this session)**

- `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/EVAL-RESULTS.md` -- round record.
- 36 x `results/apply/{arm}/{r}/{run}/{diff.patch,red-grade.json,answer.md,meta.json}` across the
  three red suites -- the primary artifacts every failure-mode claim rests on.
- 36 x `outputs/transcript.stream.jsonl` -- `tool_use` command scan; the source of the
  typecheck-execution and unbacked-claim findings.
- `.claude/skills/lz-red-workspace/grade-red.mjs:70-80, 790-840` -- the 8 D-06 classes and the
  `rightReason` / attribution logic; basis for every measurability judgement.
- `.claude/skills/lz-red-workspace/e2e-red-radix-ng/{targets.json,prompts/*}` -- cell design,
  discipline traps, the prompt anchoring confound, the waived RXL canary.
- `.claude/skills/lz-red-workspace/fixtures/canary-rdxf-red/diff.patch` -- proof of the compiling
  RXF route.
- `.claude/skills/lz-refactor-workspace/e2e-angular/RESULTS-skill-forcing-function.md` -- the shipped
  precedent, Options A and B.
- `.claude/skills/lz-refactor-workspace/e2e-angular/heldout-enum/RESULTS-enum.md` -- the prompt-level
  precursor and the discretion-vs-capability diagnosis.
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md:60-112` and commit `01208c8` -- the shipped forcing
  function verbatim.
- `plugins/lz-tdd/skills/lz-red/SKILL.md` (147 lines) and all 10 `references/` leaves -- the
  already-present-passive-prose determination.
- `radix-ng/primitives-pin` @ `4a7390a2`, read-only `git grep` -- locale plumbing for A1, and the
  142-spec-file assertion-convention counts underpinning candidate #1.

**Concurrent-edit note**

While this research ran, `.claude/skills/lz-red-workspace/e2e-red-gilded-rose/EVAL-RESULTS.md` was
modified and then committed by another session as `b07d002` ("docs(21): add classify-first +
house-idiom dims; correct the RXF framing twice"), carrying a 2026-07-28 CORRECTION with the same
convention-count finding. **I did not write that file and made no edit outside this output path.**

The overlap is independent corroboration, not a shared source. I re-counted all 142 spec files myself
with `git grep -l` and every figure matched; I additionally established the 7/9-versus-2/9
mirrored-file-versus-no-precedent split, which that note does not contain, and the ranking
consequence (a count-anchored version of the EXISTING step-3 instruction, rather than a new matcher
rule). Anyone reconciling the two documents should treat the counts as jointly verified and the
"house idiom is broken" framing as superseded in both.

**Secondary (MEDIUM, in-repo prior art, not re-verified against live sources)**

- `.planning/quick/260712-n5o-skill-methodical-nx-fleet/260712-n5o-RESEARCH.md` -- forcing-function
  technique inventory A1-A5, B1-B5, C1-C3.
- `.planning/quick/260712-n5o-skill-methodical-nx-fleet/260712-n5o-RESEARCH-review-regimes.md:140-155,
  225-240` -- the externally-checkable-countability criterion and the over-correction literature.

**Not consulted**

- `.oracle/` -- forbidden by project rule; questions routed in Section 6.
- Web sources -- WebSearch unavailable this session (API effort-config error, both attempts); the
  in-repo prior art covers the needed literature. Recorded as a gap, not as a null result.
