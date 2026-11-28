# 260728-1pj -- lz-red red-bar doctrine: defect found, fix SPECIFIED, NOT applied

**Status: the defect is real and confirmed. A fix was drafted TWICE, reviewed TWICE, and REVERTED
both times. The shipped skill is unchanged. The corrected fix spec is in section 6 and is ready to
implement; do not re-derive it.**

This task started as "run the next probe" (the forcing-function probe proposed in
`21-EVAL-RESULTS`). The research step found a blocker that outranks the probe, so the probe was never
built. Nothing metered ran. `plugins/lz-tdd/` is byte-unchanged.

## 1. The defect (verbatim, from the shipped skill)

`plugins/lz-tdd/skills/lz-red/SKILL.md`:

- step 2, line 63: "Law 2 sizes the test: grow it only to the first failure, and a reference to a
  not-yet-defined symbol counts as that failure."
- step 5, line 80: "The fresh test must fail on its assertion -- an AssertionError on the behavior it
  pins -- not on a compile, import, or setup error"

Step 2 blesses stopping at a missing symbol. Step 5 forbids exactly that. The D-06 grading gate
implements step 5's side, so the skill can steer a model into the state its own gate fails.

**Reachability is measured, not theoretical.** Across the 9 RXL runs of the Phase-21 round, 3 show
explicit reasoning from the step-2 doctrine, and the distribution is the evidence:

| arm | runs invoking the missing-symbol doctrine |
|-----|-------------------------------------------|
| `no_skill` | **0 / 3** |
| `with_skill` | 1 / 3 |
| `invoke_skill` | 2 / 3 |

Zero in the baseline. The doctrinal reasoning appears ONLY where the skill was loaded, which is a
direct causal link from step 2's text to the behaviour. One run also visibly noticed the tension and
hedged ("but it's the coarser kind of ...").

## 2. What the owned sources actually say (three oracle consultations)

| source | position |
|--------|----------|
| Clean Code, unit-testing chapter | The Second Law carries an explicit clause that a BUILD FAILURE qualifies as the failure. The chapter NEVER requires an assertion failure. It states the classification without illustrating it and contains no TDD micro-cycle at all. |
| Kent Beck, written content | His loop contains a step whose PURPOSE is writing stubs so the test COMPILES; the failure he acts on is the test RUNNING and failing. So a build failure is what you clear BEFORE the red. He does NOT require an assertion failure -- his stub bodies throw a marker exception and that is the state he implements from. His canonical loop calls assertion-free tests a mistake. |
| Owned talk transcripts | Beck's own founding TDD session acted on missing-definition failures throughout, never an assertion mismatch -- but in a DYNAMIC language, so the test RAN and the runner reported the missing name. The collection explicitly does NOT discuss the compiled-language case where the test cannot run at all. Beck's canonical loop imposes no gate on observing a failure. Behaviour-sensitivity material establishes that a test's result must change when behaviour changes, violated by a test with no assertion or an imprecise one. |

**Settled, unanimous: no owned source requires the red to be an assertion failure.** Step 5's
assertion absolute is unsupported by all three.

**Settled: the sources DO support a test CARRYING a discriminating assertion** (Beck's canonical loop
plus the behaviour-sensitivity material). Note this is assertion PRESENCE, not assertion-as-the-failure.

**Unadjudicated by all three: whether a compile error counts as the red in a language where the test
cannot run.** Clean Code says it counts; Beck clears it first; the transcripts never address the
compiled case. This is legitimately lz-red's own call and MUST carry the `no-oracle` tag.

**Gap in the clean-room store:** Beck's 2002 TDD book is the keystroke-granularity authority for this
exact question and the store holds only a summary, not the text. Same for the XP book's test-first
chapter. If this ever needs settling canonically rather than by weighing partial sources, that text is
what is missing.

## 3. Four proposals that DIED. Do not retry these.

1. **Gate precedence rule** -- "if an added test collected and failed on its own assertion, treat a new
   type diagnostic as a warning, not a verdict." KILLED by the negative control: `canary-compile`
   records `attributed_failures: 1` because its deliberate type error (`const app: number = new
   GildedRose(...)`) is ALSO runtime-inert, so esbuild strips the annotation, the test runs, and it
   fails its assertion. The rule would flip the control to pass and punch a false-pass hole in the one
   clause a counterfactual proved load-bearing.
2. **Missing-symbol exemption in the gate** -- exempt TS2305/TS2307 (symbol/module absent) while still
   failing TS2322/TS2339 (type mismatch). KILLED by Beck: under his loop an unresolved reference is the
   cue to stub, not the red, so exempting it is doctrinally wrong. Also note it would have been keyed
   on diagnostic CLASS, which is not a matcher allowlist and not baseline-keyed -- the idea was sound in
   form, wrong in doctrine.
3. **"Step 5 is simply unfaithful, step 2 is faithful"** -- KILLED by the transcripts plus Beck: BOTH
   steps are partly wrong, in different ways, and the Beck-faithful rule is a third position neither
   step states.
4. **The execution criterion** ("the test must have EXECUTED and reached the code under test") -- KILLED
   by the second review, empirically. See section 4. This is the one that got furthest and it is the
   most instructive failure.

## 4. Why the execution criterion is wrong (the trap to avoid)

The second reviewer ran the repo's own grader, importing `classify` from `grade-red.mjs`:

```
wrong-value stub (AssertionError)   -> genuinely_red   (the only D-06 pass)
throwing stub (plain Error stack)   -> wrong_reason    (pass:false)
throwing stub ("Not implemented")   -> wrong_reason    (pass:false)
```

So blessing a throwing stub teaches a shape the project's own gate FAILS. The pass predicate is
`ASSERTION_RE.test(m) && !RUNTIME_RE.test(m)` (`grade-red.mjs:829-835`), and Vitest's JSON reporter
stores `e.stack || e.message` verbatim, so a thrown marker error carries no assertion vocabulary.

And the criterion is factually WRONG for this stack. In Vitest + TypeScript, types are erased, so a
bare unresolved identifier throws a `ReferenceError` INSIDE the body at the act step -- the body RAN.
The instrument encodes exactly this: `RUNTIME_RE` (`grade-red.mjs:89`) lists `is not defined` /
`referenceerror` and routes such a failure through the ATTRIBUTED-ASSERTION path (a test that ran) to
`wrong_reason`, not `collection_error`; `fixtures/wrong/module.ts` is a committed case. Only failed
module RESOLUTION actually stops the body.

Consequence: the criterion's own stated example is false in two of its three cases, and under the
literal rule the very state it meant to forbid PASSES.

**The state that actually failed 7/9 RXL runs was a NEW STRICT TYPECHECK error -- the test did not
COMPILE.** The pre-change step-5 wording named that correctly. lz-tpp already states "the code
compiles" as its precondition (`lz-tpp/SKILL.md:54-56`). The compile axis was the right line all along;
only the assertion absolute was wrong.

## 5. What is DECIDED and needs no further consultation

- The gate stays as-is. It is stricter than every owned source (it requires a behaviour-pinning
  assertion failure where the books accept a missing-definition failure), and that strictness is a
  deliberate EVAL-DESIGN choice -- the eval exists to measure whether the model pinned the missing
  BEHAVIOUR. Record it as eval design, never as doctrinal fidelity.
- The Phase-21 committed numbers stand. RXL's verdicts are correct under the gate as designed.
- "Do not run the suite unprompted" has NO source backing and NO source contradiction. Pure lz-red
  orchestration; the owner's call; leave it unless the owner changes it.
- Beck IS owned via written content (Canon TDD, First One Then Many). Do not tag Beck material
  `no-oracle` on the assumption he is unowned -- that was an error made and corrected in this task.

## 6. THE FIX SPEC (from the second unbiased review; implement this, do not re-derive)

Seven items. Five files.

1. **Restate the criterion in two clauses that are TRUE in Vitest + TS:** (a) the test typechecks --
   no unresolved names, no new strict errors; (b) the failure originates in the code under test, not
   in module load or setup. Fix all five sites: `SKILL.md:83-85`, `SKILL.md:100-103`,
   `vitest-typescript-mechanics.md:85-91`, `:116-120`, `three-laws-and-test-selection.md:106-113`.
   **Drop "the body never ran" as the explanation of an unresolved name -- it is false.**
2. **Make the wrong-value stub the stated default** and demote the throwing stub to a noted
   second-best (it gives the green step no expected-vs-actual target). If the throwing stub stays
   blessed at all, say IN THE SAME EDIT that D-06 grades it `wrong_reason`, so skill and instrument are
   not silently at odds.
3. **Add the stub constraint back:** a body the assertion REJECTS, never the expected value. The
   pre-change worked example carried this ("correct type signature, wrong body"); the drafted fix
   dropped it, which lets the emptiest compiling stub for a starter case (`return 0` for
   `sumOf([]) -> 0`) pass instantly and produce the false green step 5 forbids.
4. **Update `vitest-typescript-mechanics.md:114-116` and `:92`** -- "before a single line of production
   code is added" / "before you write any production code" contradict any stub requirement. They sit
   INSIDE the section being rewritten and were missed twice.
5. **Scope "resolve it" / "make the test EXECUTE" to COMMAND mode**, or attribute the resolution to the
   developer, in BOTH leaves (`vitest-typescript-mechanics.md:93-94`,
   `three-laws-and-test-selection.md:110-111`). Unqualified action directives in a leaf license the
   coach to write production code in QUESTION mode, against `SKILL.md:130`. Coach-don't-drive is the one
   dimension with a measured edge over base Opus, so a leak here has real cost.
6. **Update `SKILL.md:131-133`** so the COMMAND deliverable matches step 2 (it currently says "write the
   failing test and then stop", silent on the stub).
7. **`principle-backing.md`:** name the actual WORKS in the source cells (every other row does; "Kent
   Beck, written content" is too vague and the D-05 honesty gate matches a literal book title, so a
   vague Owned row is precisely the shape the gate cannot see). Split the discriminating-assertion row
   so the owned FACTS (assertion-free tests are a mistake; behaviour-sensitivity) are separated from the
   COMPOSED gate clause, which is lz-red orchestration.

Also flagged: `anti-patterns.md:76-77` still says the fail-for-the-right-reason procedure "lands with
the coach spine in a later phase" -- stale, and wrong to leave once this ships.

**Seam note (F9, judgement call for the owner):** making lz-red author the stub moves lz-tpp's
highest-priority ranked transformation (`{} -> nil`, `transformations.md:65`) across the seam, and the
worked example's stub (`return total`) is `(constant -> scalar)` territory. Defensible, but the skill
claims a crisp seam and this blurs it. Decide deliberately rather than by omission.

## 7. Process lessons worth keeping

- **Consult every owned source before editing a shipped skill, not the first one that answers.** Clean
  Code alone produced a confident and WRONG conclusion; Beck reversed it; the transcripts reversed it
  again. The final position matches none of the three intermediate readings.
- **A reviewer that RUNS the instrument beats one that reads the text.** The decisive finding in this
  task came from importing `classify` and grading two stub shapes -- 30 seconds of execution that
  falsified a whole doctrine edit.
- **Gate on the process exit status, not on piped log text.** `node x.mjs | tail` reports `tail`'s exit
  code; a failing checker read as GREEN once during this task.
- **The scaffold-phrase guard forbids the word "placeholder"** in lz-red references. Use "stub".
- **Four consecutive proposals of mine were killed by gates, none by my own inspection.** On a shipped
  skill, the review is not a formality.
