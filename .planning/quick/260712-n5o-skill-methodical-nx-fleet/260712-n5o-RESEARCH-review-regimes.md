# Review Regimes: When Same-Base-Model Reviewer Agents Work vs Fail

**Researched:** 2026-07-14
**Domain:** LLM-as-judge / self-correction / reviewer-agent reliability
**Question:** Can a same-base-model reviewer agent reliably catch an over-engineering judgment error the primary model made?
**Overall confidence:** HIGH on the regime boundary; MEDIUM-HIGH on the over-engineering application (extrapolated from adjacent code-review evidence, not a direct study of over-engineering detection).

> Method note: evidence was gathered to CONFIRM and to DISCONFIRM each of the four claims.
> Disconfirming findings are reported inline, not buried. Confidence levels are per-claim.
> Every source carries a URL and a date. arXiv IDs of the form 26MM.xxxxx are 2026 papers
> (current date is July 2026); they are real, recent, and dated accordingly.

---

## Bottom Line (read this first)

The perspective is **substantially correct but mis-weights its own lever**. The dominant lever
is **verifiability / external anchoring** (Claim 2), not fresh context (Claim 1). Fresh context
and a distinct rubric are real, measurable second-order levers that remove anchoring, sycophancy,
and self-preference -- but they do **not** convert a pure-taste judgment into a reliable one, and
they do **not** fully decorrelate a same-base-model reviewer's blind spots (shared weights ->
correlated errors). The over-engineering warrant (Claim 4) sits **on the regime boundary**: its
*inputs* are countable and verifiable (structure added, duplication/branches removed), which is
the "works" regime; its *netting verdict* ("is the structure worth it?") has a residual taste
threshold with no external ground truth, which is the "weak" regime. A fresh-context,
verifiable-rubric, same-base-model reviewer is **sound for the counting and for a
threshold-driven netting verdict** -- provided it is engineered to maximize the countable/anchored
fraction and to suppress the documented **over-correction (excessive fault-finding) bias**. It is
**not sound** implemented as a holistic "does this feel over-engineered?" prompt with a
justify-your-verdict instruction -- that lands squarely in the failure zone and the justification
prompt *amplifies* the bias.

---

## Per-Claim Verdicts

### Claim 1 -- Two setups, and the lever is fresh context (not model identity)

> "In-context self-correction is the weak case; fresh-context independent review is meaningfully
> stronger, EVEN with the same base model. The lever is fresh context + distinct rubric + no anchor."

**Verdict: SUPPORTED, with one materially-wrong sub-claim. Confidence: HIGH (direction); HIGH (the "not model identity" strong form is partially CONTRADICTED).**

Supporting evidence:
- **Cross-Context Review (CCR)** frames session separation as an *information-theoretic*
  intervention, not a psychological one: "a fresh session has no prior decisions to anchor to...
  removing the production context from the reviewer's input." It quantifies anchoring: the
  first-reviewer anchoring coefficient is **0.255 for GPT-4o**, "substantially higher than the
  human committee baseline," and persists even against contradictory evidence. Choi et al. (2025,
  cited therein): when models do not know authorship, "sycophantic bias nearly disappears" -- and
  a fresh reviewing session achieves exactly this natural anonymization. `[CITED: arxiv.org/html/2603.12123 -- "Cross-Context Review," Mar 2026]`
- **Self-preference is linked to self-recognition** (Panickssery et al.): LLMs recognize their own
  outputs and a linear correlation exists between self-recognition strength and self-preference
  bias. A fresh, anonymized reviewer breaks the recognition -> preference chain. `[CITED: arxiv.org/abs/2404.13076 -- NeurIPS 2024]`
- **CALM / bias survey** recommendation: "one effective way to reduce self-enhancement bias is to
  avoid using the same model to both generate and judge." `[CITED: llm-judge-bias.github.io -- "Justice or Prejudice? Quantifying Biases in LLM-as-a-Judge," 2024]`
- Independent practitioner articulation (GitHub, `adam-s/agent-spec`): read-only reviewer
  sub-agents exist precisely because "the parent's context is already polluted... a clean room is
  just another name for fresh context, which is just another name for sub-agent." `[CITED: github.com/adam-s/agent-spec docs/temp/agent-language-vs-code.md -- retrieved 2026-07-14]`

Disconfirming / qualifying evidence:
- **"Not model identity" is too strong.** CCR itself grounds the benefit in *error decorrelation*
  from ensemble theory and warns that "error correlation may be particularly relevant due to
  shared training data, weights, and context." Fresh context removes the *context* term; a
  same-base model still shares *weights and training data*, so blind-spot errors stay correlated.
  Cross-family review adds decorrelation that same-model fresh context cannot. So model identity
  *does* matter -- just less than context for the anchoring/sycophancy failure modes. `[CITED: arxiv.org/html/2603.12123, Mar 2026]`
- CCR's own sub-result shows a case where separation gave **no significant advantage** (SA F1
  23.8% vs SR 24.6%), confirming the anchoring lever only bites when production context is actually
  present and load-bearing. `[CITED: arxiv.org/html/2603.12123, Mar 2026]`
- Fresh context does **not** fix the *feedback-generation bottleneck* (see Claim 2 / Kamoi). The
  "+ distinct rubric" half of the claim is doing more work than the "fresh context" half.

Net: the directional claim (fresh-context independent review >> in-context self-refine, and this
holds for a same base model) is well supported. The rhetorical emphasis ("the lever is fresh
context, not model identity") over-credits fresh context and under-credits both verifiability
(Claim 2) and cross-family decorrelation.

---

### Claim 2 -- The verifiability / external-ground-truth axis is what separates works from fails

> "Reviewers are strong against an external anchor or verifiable criterion; weak for pure
> subjective/taste with no anchor. This -- not model identity -- explains why code/security/
> source-fidelity/coverage review works while 'is this tastefully designed?' fails."

**Verdict: STRONGLY SUPPORTED. Confidence: HIGH. This is the best-supported claim and the true dominant lever.**

- **Kamoi et al. critical survey** is the central reconciliation. Self-correction succeeds in
  exactly three regimes: (1) reliable external tools (code interpreter, search), (2)
  verifiable/decomposable tasks where "correctness can be verified easily without external
  information" -- which they argue is *equivalent to having oracle-quality feedback* -- and (3)
  large-scale fine-tuning. Intrinsic self-correction on general (non-verifiable) tasks "rarely
  demonstrates successful self-correction due to intrinsic difficulties in generating reliable
  feedback." The bottleneck "is in the feedback generation." `[CITED: arxiv.org/html/2406.01297v1 -- TACL 2024, published June 2024]`
- **The Geometry of LLM-as-Judge** provides the sharpest quantitative confirmation. On
  **subjective** rubrics, inter-LLM agreement (~0.35) *exceeds* LLM-human agreement (0.27-0.32) --
  "consensus reflects shared bias rather than shared signal"; the judge's evaluation axis is
  **87-89 degrees** (near-perpendicular) to the human axis. On **verifiable factual** rubrics the
  pattern *reverses*: LLM-human correlation rises to **0.519** and the axis falls to **58.5
  degrees** (within human range). Conclusion: "LLMs genuinely capture objective truth but
  systematize bias on subjective assessments." `[CITED: arxiv.org/abs/2606.03043 -- "The Geometry of LLM-as-Judge," June 2026]`
- **Rubric-modification statistical study**: "agreement gaps shrink dramatically for objective
  criteria... the objective factual rubric collapses the gap" while subjective rubrics have the
  longest gaps. `[CITED: arxiv.org/html/2605.06283 -- May 2026]`
- **CriticGPT / LLM Critics Help Catch LLM Bugs**: on code (a checkable domain, with
  inserted/ground-truthable bugs) a GPT-4-based critic *outperforms* paid human reviewers at bug
  detection and its critiques are preferred >80% of the time. Strong evidence that reviewer agents
  excel where an external/verifiable anchor exists. `[CITED: arxiv.org/pdf/2407.00215 and openai.com/index/finding-gpt4s-mistakes-with-gpt-4 -- June 2024]`
- **Reference-Guided Verdict**: reference-*based* judging beats reference-free on knowledge-
  intensive tasks; reference-free is only "a reliable alternative on tasks that do not involve
  external knowledge." Anchoring to a reference is what buys reliability where truth is external. `[CITED: arxiv.org/html/2408.09235 -- Aug 2024]`

No credible disconfirming evidence found for Claim 2. The nuance is only that "verifiable" is a
spectrum (deterministic oracle > reference doc > checkable rule > structured taste > pure taste),
and reliability degrades monotonically along it.

---

### Claim 3 -- The verifiability lever: making a subjective criterion countable/objective improves reliability and reduces bias

> "Structured rubric with concrete counts, decomposed atomic checks, reference-guided judging
> measurably improves reviewer reliability and moves a taste judgment toward the regime where
> review works."

**Verdict: SUPPORTED but QUALIFIED (MIXED at the edges). Confidence: MEDIUM-HIGH.**

Supporting evidence:
- **Rubric-based rewards**: rubric rewards "reduce variance in reward signals across different
  sizes of LLM judges" and are "most reliable when criteria are specific (often instance-level),
  grounded (via references or retrieval), and carefully curated." `[CITED: cameronrwolfe.substack.com/p/rubric-rl -- "Rubric-Based Rewards for RL," 2025]`
- **Decomposed criteria-based evaluation** and **evidence-anchored scoring (Rulers)**: decomposing
  holistic quality into atomic, evidence-anchored checks improves auditability and alignment; tie
  each judgment to an extractive quote/span. `[CITED: arxiv.org/pdf/2509.16093 -- EMNLP 2025 industry; arxiv.org/html/2601.08654 -- "Rulers," Jan 2026]`
- **RevisEval**: dynamically generated, response-adapted references outperform both reference-free
  and reference-based judging -- i.e., manufacturing an anchor where none existed helps. `[CITED: openreview.net/forum?id=1tBvzOYTLF -- RevisEval]`

Disconfirming / qualifying evidence (important):
- **Decomposition is NOT automatically beneficial.** The rubric-modification study empirically
  challenges the assumption that simpler/decomposed rubrics improve human-autorater agreement in
  open-ended domains; decomposition "may result in disagreement between the two scores, or with the
  associated holistic judgment." Benefit is largest for objective criteria, **smallest or negative
  for inherently subjective ones**. `[CITED: arxiv.org/html/2605.06283 -- May 2026]`
- Decomposition introduces **new failure modes**: segmentation errors, brittle extractive/string
  matching, and conservative score-capping that reduces sensitivity to genuine improvements. `[CITED: arxiv.org/html/2601.08654 -- Jan 2026]`
- **The critical counter for the application**: "Are LLMs Reliable Code Reviewers?" shows that
  adding rubric elaboration -- requiring explicit explanations and suggested fixes -- **increased**
  misjudgment: "detailed prompts may inadvertently introduce biases toward excessive fault finding,
  causing models to detect non-existent errors in otherwise correct implementations." So more
  rubric structure can *amplify* fault-finding bias rather than reduce it. `[CITED: arxiv.org/abs/2603.00539 -- "Systematic Overcorrection in Requirement Conformance Judgement," Mar 2026]`

Net: the mechanism works **when countability is anchored to ground truth** (counts you can verify
from the artifact). "Countability" per se is not the lever; *externally-checkable* countability is.
Adding structure/verbosity without an anchor can add a veneer of rigor while amplifying bias.

---

### Claim 4 -- The over-engineering warrant as a countable netting rubric: works regime or weak-taste regime?

> "Structure added (classes/files/indirection) vs concrete cost removed (duplication sites,
> branches). Which regime, and what rubric/prompt design maximizes a fresh-context same-model
> reviewer's reliability for it?"

**Verdict: MIXED -- a BORDERLINE case that decomposes into two regimes. Confidence: MEDIUM-HIGH (extrapolated from code-review evidence; no direct over-engineering-detection study found).**

The warrant splits cleanly:

1. **The counting (WORKS regime).** Structure added -- new classes, files, interfaces, indirection
   layers -- is countable from the diff. Cost removed -- duplication sites eliminated, branches/
   conditionals removed -- is countable (clone detection, line refs). These are objective, artifact-
   derivable facts. On the Geometry axis this is the *objective* regime (0.519 correlation, 58.5-deg
   axis) where a same-base-model judge genuinely aligns with human truth. `[CITED: arxiv.org/abs/2606.03043, June 2026]`

2. **The netting verdict (WEAK-TASTE regime).** "Is the added structure justified by the removed
   cost?" has **no external ground truth** -- there is no failing test for over-abstraction, no
   oracle for "worth it." This residual is the subjective regime where same-family judges cluster
   in a *collapsed subspace* (agree with each other and with the primary model, 87-89-deg off the
   human axis) `[CITED: arxiv.org/abs/2606.03043]` and where the **over-correction / excessive-
   fault-finding bias** lives `[CITED: arxiv.org/abs/2603.00539]`. Worse, the over-engineering
   *framing itself* is an anchor: a reviewer asked "is this over-engineered?" is primed to find
   over-engineering, and the elaboration/justification prompt amplifies it (the exact effect
   measured in 2603.00539).

So the honest answer: the warrant is **movable into the works regime to the exact degree the
verdict is a deterministic function of the verified counts** rather than a gestalt. That is the
design goal.

---

## Recommended Rubric Design (if the over-engineering-warrant reviewer is built)

Ordered by leverage. Each rung cites the evidence it rests on.

1. **Fresh context, artifact-only, separate agent.** No production transcript in the reviewer's
   input; feed the diff/artifact cold. Removes anchoring (0.255 coefficient) and self-recognition
   -> self-preference. `[CCR 2603.12123; Panickssery 2404.13076; CALM]`

2. **Extract the countable facts FIRST, before any verdict.** Force the reviewer to enumerate, with
   line references: (a) each structural unit added (class/file/interface/indirection layer); (b)
   each concrete cost removed (duplication site with before/after locations; branch/conditional
   removed). Every count must cite an extractive span -- evidence-anchored, no unsupported claims.
   `[Rulers 2601.08654; decomposed criteria 2509.16093]`

3. **Make the netting verdict a deterministic function of the counts, not a vibe.** e.g. compute
   "net structural units added minus distinct duplication sites removed" against an explicit,
   pre-registered threshold. The subjective step collapses to one small, auditable comparison
   instead of a holistic impression. This is the Claim-3 move -- countable netting pushes taste
   toward verifiable -- and it works only because the counts are artifact-anchored. `[2605.06283 -- decomposition helps when it converts subjective to objective]`

4. **Require a disconfirming (steelman) pass before the verdict.** Instruct the reviewer to first
   argue why the added structure IS justified, then rule. This directly counters the documented
   over-correction/fault-finding bias and the "over-engineered?" framing anchor. Do NOT ask for a
   verbose free-text justification of a *guilty* verdict -- that elaboration is what inflated false
   positives in the study. `[2603.00539 -- explanation/fix elaboration increased false positives]`

5. **Calibrate the threshold against human-anchored exemplars.** Include a few labeled examples
   ("this was over-engineered" / "this was proportionate") in context. Geometry found that only
   post-hoc **human-anchored** calibration repositioned the evaluation axis -- fine-tuning and
   preference optimization did not. `[2606.03043]`

6. **Prefer an executable counterfactual when cheap.** If a simpler alternative can be sketched and
   shown to pass the same tests, that is executable ground truth and dominates any taste judgment
   -- the CriticGPT / fix-guided-verification pattern (treat the proposed simplification as a
   counterfactual and run the tests). `[CriticGPT 2407.00215; fix-guided verification filter 2603.00539]`

7. **For the residual taste verdict on high-stakes/ambiguous cases, escalate to a cross-family
   second judge or a human.** Same-base-model is fine for the counting; it is a collapsed-subspace
   risk for the netting. Cross-family adds the weight-level decorrelation that fresh context alone
   cannot. `[Geometry 2606.03043; CCR error-decorrelation 2603.12123]`

**Residual failure modes (design cannot fully remove these):**
- **Over-correction bias**: inflated false-positive "over-engineered" verdicts, worsened by verbose
  justify-the-verdict prompts. Mitigated (not eliminated) by rung 4. `[2603.00539]`
- **Collapsed-subspace agreement**: a same-family reviewer confidently ratifies a *wrong*
  over-engineered call because it shares the primary model's taste priors -- consensus that looks
  like validation but is shared bias. `[2606.03043]`
- **Countability theater**: counts not truly anchored to removed cost (mislabeled duplication,
  phantom "removed branches"). Mitigated by extractive-span requirement (rung 2).
- **Speculative-but-reasonable structure (YAGNI judgments)**: whether a not-yet-needed abstraction
  is warranted depends on domain/roadmap knowledge absent from the artifact. Genuinely
  hard-to-verify; flag for human. `[Kamoi 2406.01297 -- non-verifiable = feedback bottleneck]`
- **Dispersed over-engineering**: system-level over-abstraction spread across many files evades a
  single-artifact netting rubric -- CriticGPT's documented limitation on errors "spread across many
  parts." `[2407.00215]`

---

## The Precise Fail-vs-Succeed Regime Boundary for Same-Model Review

This reconciles the ubiquity of reviewer skills with the Huang-style "self-correction fails" results.

**Same-model review genuinely FAILS when ALL of these hold** (the Huang / Kamoi / Stechly regime):
- The model critiques its **own output in-context** (anchored, self-recognizing).
- There is **no external feedback** and the criterion is **not verifiable** by a check simpler than
  the original generation.
- The verdict is a **pure subjective/taste** judgment with no reference.
In this regime, generating reliable feedback is as hard as the original task (Kamoi's feedback-
generation bottleneck), discrimination is not reliably better than generation (SELF-[IN]CORRECT's
DG-DIFF is not reliably positive `[CITED: arxiv.org/abs/2404.04298 -- AAAI]`), the "verification is
easier than generation" intuition does **not** transfer to approximate-retrieval LLMs (Stechly/
Kambhampati `[CITED: arxiv.org/abs/2402.08115 -- ICLR 2025; arxiv.org/abs/2402.01817 -- ICML 2024]`),
and multi-agent debate adds nothing over self-consistency at equal compute (Huang;
`[CITED: arxiv.org/abs/2502.08788 -- "If Multi-Agent Debate is the Answer," Feb 2025]`).

**Same-model review genuinely SUCCEEDS when it shifts on THREE axes** (the reviewer-skill regime):
1. **Verifiable / externally-anchored criterion** (dominant): code vs tests, security vs OWASP/CWE,
   source-fidelity vs the source doc, coverage vs a spec, style vs an explicit rule. Moves onto the
   Geometry *objective axis* (~0.52 human correlation) where alignment is genuine, not shared bias.
2. **Fresh context + distinct rubric + anonymization**: removes anchoring/sycophancy/self-preference
   (CCR, Panickssery, CALM).
3. **Generation-verification asymmetry holds only because there is a checkable anchor** -- not as a
   general property of the model.

The over-engineering warrant sits **on the boundary**: axis 1 is partially satisfied (counts are
verifiable; the netting threshold is not). The entire rubric-design recommendation above is an
exercise in dragging as much of the judgment as possible from the fail side (holistic taste) to the
succeed side (anchored counts + deterministic netting + human-calibrated threshold + disconfirming
pass).

---

## Where the Evidence CONTRADICTS the Perspective (consolidated)

1. **Claim 1's strong form is wrong.** "The lever is fresh context, not model identity" -- model
   identity *does* matter, because same-base-model reviewers share weights and thus have correlated
   blind spots that fresh context cannot decorrelate. Confidence: HIGH. `[2603.12123; 2606.03043]`
2. **Claim 1 under-weights verifiability.** Fresh context does not fix the feedback-generation
   bottleneck on non-verifiable tasks; verifiability (Claim 2) is the bigger lever. Confidence: HIGH.
   `[2406.01297]`
3. **Claim 3's "more structure -> more reliable" fails in the subjective regime and can backfire.**
   Rubric elaboration increased false positives in code review (over-correction bias); decomposition
   does not automatically improve open-ended agreement. Confidence: MEDIUM-HIGH. `[2603.00539; 2605.06283]`
4. **Generation-verification asymmetry is not a general LLM property.** It is a
   complexity-theoretic argument that only transfers when a sound external verifier / checkable
   criterion exists; LLMs are not reliably better at discriminating than generating their own
   outputs. This tempers the intuition underlying the whole reviewer premise. Confidence: HIGH.
   `[2404.04298; 2402.08115]`
5. **Same-family consensus is not validation.** On subjective criteria, inter-LLM agreement exceeds
   LLM-human agreement (shared bias, near-perpendicular axis) -- so a same-model reviewer "agreeing"
   is weak evidence the primary's call was right. Confidence: HIGH. `[2606.03043]`

Where the perspective is RIGHT: the two-setups distinction is real and measurable (Claim 1
direction); the verifiability axis is the correct organizing principle (Claim 2, strongly);
countability anchored to ground truth genuinely helps (Claim 3, qualified). The perspective's main
error is *ranking* fresh context above verifiability and treating model identity as irrelevant.

---

## Sources

Primary (HIGH confidence -- peer-reviewed or authoritative, directly on point):
- Huang et al., "Large Language Models Cannot Self-Correct Reasoning Yet," arXiv:2310.01798, Oct 2023 / ICLR 2024. https://arxiv.org/pdf/2310.01798
- Kamoi et al., "When Can LLMs Actually Correct Their Own Mistakes? A Critical Survey," arXiv:2406.01297, June 2024 / TACL. https://arxiv.org/html/2406.01297v1
- Panickssery, Bowman, Feng, "LLM Evaluators Recognize and Favor Their Own Generations," arXiv:2404.13076, Apr 2024 / NeurIPS 2024. https://arxiv.org/abs/2404.13076
- Stechly, Valmeekam, Kambhampati, "On the Self-Verification Limitations of LLMs on Reasoning and Planning Tasks," arXiv:2402.08115, Feb 2024 / ICLR 2025. https://arxiv.org/pdf/2402.08115
- Kambhampati et al., "LLMs Can't Plan, But Can Help Planning in LLM-Modulo Frameworks," arXiv:2402.01817, ICML 2024. https://arxiv.org/abs/2402.01817
- Jiang et al., "SELF-[IN]CORRECT: LLMs Struggle with Discriminating Self-Generated Responses," arXiv:2404.04298, Apr 2024 / AAAI. https://arxiv.org/abs/2404.04298
- McAleese et al. (OpenAI), "LLM Critics Help Catch LLM Bugs" (CriticGPT), arXiv:2407.00215, June 2024; OpenAI blog. https://arxiv.org/pdf/2407.00215 ; https://openai.com/index/finding-gpt4s-mistakes-with-gpt-4/
- "The Geometry of LLM-as-Judge: Why Inter-LLM Consensus Is Not Human Alignment," arXiv:2606.03043, June 2026. https://arxiv.org/abs/2606.03043
- "Are LLMs Reliable Code Reviewers? Systematic Overcorrection in Requirement Conformance Judgement," arXiv:2603.00539, Mar 2026. https://arxiv.org/abs/2603.00539
- Madaan et al., "Self-Refine: Iterative Refinement with Self-Feedback," arXiv:2303.17651, Mar 2023 / NeurIPS 2023. https://github.com/madaan/self-refine

Secondary (MEDIUM-HIGH -- recent, on point, cross-verified):
- "Cross-Context Review: Improving LLM Output Quality by Separating Production and Review Sessions," arXiv:2603.12123, Mar 2026. https://arxiv.org/html/2603.12123
- "Quantifying the Statistical Effect of Rubric Modifications on Human-Autorater Agreement," arXiv:2605.06283, May 2026. https://arxiv.org/html/2605.06283
- "Beyond Pointwise Scores: Decomposed Criteria-Based Evaluation of LLM Responses," arXiv:2509.16093, EMNLP 2025 industry. https://www.arxiv.org/pdf/2509.16093
- "Rulers: Locked Rubrics and Evidence-Anchored Scoring for Robust LLM Evaluation," arXiv:2601.08654, Jan 2026. https://arxiv.org/html/2601.08654v1
- "Reference-Guided Verdict: LLMs-as-Judges in Automatic Evaluation of Free-Form QA," arXiv:2408.09235, Aug 2024. https://arxiv.org/html/2408.09235
- "If Multi-Agent Debate is the Answer, What is the Question?," arXiv:2502.08788, Feb 2025. https://arxiv.org/abs/2502.08788
- "Justice or Prejudice? Quantifying Biases in LLM-as-a-Judge" (CALM), 2024. https://llm-judge-bias.github.io/
- RevisEval, OpenReview. https://openreview.net/forum?id=1tBvzOYTLF
- Cameron Wolfe, "Rubric-Based Rewards for RL," 2025. https://cameronrwolfe.substack.com/p/rubric-rl
- "Understanding Verification Dynamics in Large Language Models," arXiv:2509.17995, 2025. https://arxiv.org/html/2509.17995v1

Tertiary (context / practitioner corpus, LOW-MEDIUM -- illustrative, not load-bearing):
- GitHub reviewer-rubric corpus retrieved 2026-07-14 via `gh search code`: `adam-s/agent-spec` (clean-room reviewer = fresh context argument), `jerryfane/gitmoot` (cross_family_review rubric with explicit "no over-engineering" axis), `dfrysinger/qrspi-plus`, `wei18/Upkeep`, `HunterMcGrew/PRISM` (stakes-calibrated reviewer rigor). Demonstrates real reviewer rubrics already encode over-engineering as a graded, cross-family-reviewed criterion.

---

## Metadata

**Confidence breakdown:**
- Regime boundary (fail vs succeed): HIGH -- convergent across Huang, Kamoi, Stechly, Geometry, SELF-[IN]CORRECT.
- Claim 1: HIGH direction; the "not model identity" strong form is partially contradicted (HIGH).
- Claim 2: HIGH -- best-supported, no credible disconfirmation.
- Claim 3: MEDIUM-HIGH -- supported but with real qualifications and a backfire mode.
- Claim 4 / over-engineering application: MEDIUM-HIGH -- extrapolated from adjacent code-review
  evidence; no direct study of LLM over-engineering detection was found (a genuine gap).

**Open gap:** No paper directly measures LLM reliability at detecting *over-engineered* (needlessly
complex) code specifically. The nearest anchor is the over-correction bias in requirement-conformance
review (2603.00539). A direct eval would be worth building if this reviewer ships.

**Research date:** 2026-07-14
**Valid until:** ~2026-08-14 (fast-moving; LLM-as-judge and self-correction literature turns over monthly).
