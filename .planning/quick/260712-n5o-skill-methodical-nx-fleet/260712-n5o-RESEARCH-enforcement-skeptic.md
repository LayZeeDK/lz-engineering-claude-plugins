# RESEARCH -- The Case AGAINST Adding a Reviewer-Agent or Hook to a Refactoring Skill

Role: designated skeptic. Task: build the strongest evidence-backed case that adding an
independent "expert reviewer" subagent (consulted at judgment gates) and/or a PreToolUse hook
(hard-gating edits) is the WRONG mechanism for making a refactoring skill decline
over-engineering and pause on blast-radius. Steelman the cheaper alternatives: a plain prose
rubric, or no added mechanism at all.

Research-only. No skill files were edited. All sources carry a URL and a date.

Date of research: 2026-07-13.

---

## TL;DR (bottom line up front)

Adding a same-model reviewer-agent or a PreToolUse hook to catch two rare, nameable judgment
slips is disproportionate, and the reviewer variant is likely to fail exactly where it is needed.

1. The mechanism is aimed at low base-rate failures (a needless class hierarchy in ~1/3 kata
   runs; an exported-signature change in a single single-file observation). A heavyweight
   general-purpose gate is the wrong instrument for two specific, addressable slips. Matching a
   two-line prose rubric to two named failure modes is the proportionate fix. (Anthropic's own
   guidance: "the simplest solution possible ... might mean not building agentic systems at all.")

2. A same-base-model reviewer shares the blind spot that produced the slip. If Opus judged the
   class hierarchy acceptable while writing it, an Opus reviewer inherits the same training
   distribution, inductive biases, and self-preference bias -- it tends to ratify its own output.
   Evidence: self-preference bias in LLM judges, sycophancy/agreement bias, the self-correction
   blind spot (avg 64.5% across models), and multi-agent same-model critique performing "no
   better than self-consistency."

3. The cost is real and recurring on a whole-package sweep: each gate is an extra cold-context
   agent call (Anthropic documents ~7x token use for agent teams; subagents do not inherit the
   prompt cache), and coordination adds 3x-6x latency in controlled studies. This tax is paid on
   every file, every round, forever -- to catch a slip that fires in a minority of runs.

4. The gate does not reliably do its job. A skill-instructed consult is skippable (a compliance
   gap the model can rationalize away under task pressure). A hook is per-clone, opt-in machinery
   with a documented history of not blocking when told to, being circumvented via the Bash tool,
   and generating false positives that block legitimate edits and erode trust.

5. The null hypothesis has strong backing: with a capable base model, the skill's value is
   auto-triggering the workflow and supplying the reference catalog -- not gating output. Both
   Anthropic engineering guidance and the multi-agent scaling literature converge on "do not add
   coordination/verification machinery to beat a base model that is already past the capability
   threshold."

The mechanism becomes justifiable only under conditions that do not currently hold (see
"When the mechanism WOULD be justified"). Until then: stay prose-only, and only if a targeted
prose rubric provably fails to move the eval numbers should any mechanism be considered.

---

## 1. ROI / proportionality: this is over-engineering the anti-over-engineering skill

### 1.1 The targeted failures are rare and nameable

The stated failure base rates:
- needless class hierarchy: ~1 in 3 kata runs.
- exported-signature change: 1 of 1 single-file runs (n=1 -- a single observation, not an
  established rate).

Two observations follow. First, a ~33% occasional slip and a single n=1 anecdote do not clear
the bar for standing infrastructure. Second, both failures are *specific and nameable*. "Do not
introduce a class hierarchy the failing test does not force" and "flag any change to an exported
signature and state the blast radius before editing" are each one sentence of prose. The cheapest
instrument that addresses the root cause is a targeted rubric line, not a general-purpose gate.
This is the ponytail/YAGNI ladder: rung 1 (does the mechanism need to exist?) and rung 6 (can it
be one line?) both resolve before you reach "build a reviewer agent + hook."

### 1.2 Anthropic's own guidance: simplest solution first; agents are a cost-bearing choice

Anthropic's "Building effective agents" is explicit that complexity must earn its place:

> "When building applications with LLMs, we recommend finding the simplest solution possible, and
> only increasing complexity when needed. This might mean not building agentic systems at all.
> Agentic systems often trade latency and cost for better task performance, and you should
> consider when this tradeoff makes sense."

It further warns that frameworks and extra orchestration layers "make it tempting to add
complexity when a simpler setup would suffice," and recommends starting with direct, minimal
implementations.
Source: https://www.anthropic.com/engineering/building-effective-agents (published 2024-12-19).

The follow-up context-engineering guidance reaffirms the same north star:

> "Do the simplest thing that works" ... "will likely remain our best advice for teams building
> agents on top of Claude."
Source: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
(2025).

### 1.3 The irony: the mechanism is the anti-pattern the skill preaches

A refactoring skill exists to keep implementations at the simplest transformation that passes the
test and to decline speculative structure (needless hierarchies, premature abstraction). Bolting a
reviewer-agent plus a PreToolUse hook onto that skill -- speculative machinery to catch an
infrequent slip -- is the exact over-engineering the skill counsels against, applied to the skill
itself. If the skill's core lesson is "do not add a class hierarchy the test does not force," then
adding an agent+hook the eval numbers do not force is a self-refuting design.

---

## 2. Same-model reviewer blind spots: the reviewer ratifies its own mistakes

The proposed reviewer would be the same base model (Opus 4.8). This is the weakest possible
reviewer for the specific failures in question, for four independent, well-documented reasons.

### 2.1 Correlated errors / shared blind spots -- same-model peers add little

A single model evaluating its own output faces correlated error by construction: identical
training data, inductive biases, and blind spots. Empirically, multi-agent critique with
same-model copies performs "no better than self-consistency," and consensus among similar models
can amplify shared mistakes (the "popularity trap"): copies converge on the same plausible-but-
wrong answer and filter out minority-correct solutions.
Source (survey of the mechanism + code-ensemble findings): "Cross-Context Review," arXiv:2603.12123
(2026), https://arxiv.org/abs/2603.12123 ; N-CRITICS, arXiv:2310.18679 (2023),
https://arxiv.org/abs/2310.18679 .

The "self-correction blind spot" quantifies this: LLMs correct an identical error when it comes
from an external source but fail to correct it in their own output. Across 14 models the average
blind-spot rate is 64.5%, rising from ~45.2% on simple tasks to ~79.2% on multi-step reasoning --
"a fundamental rather than task-specific limitation."
Source: "Self-Correction Bench," arXiv:2507.02778 (2025), https://arxiv.org/abs/2507.02778 .

Consequence for this proposal: if the base model wrote the needless class hierarchy because it
judged the abstraction reasonable, the same-model reviewer inherits that judgment. The reviewer is
most likely to wave through precisely the errors the base model is prone to make -- the ones the
gate was built to catch.

### 2.2 LLMs cannot reliably self-correct reasoning without external signal

The foundational result: intrinsic self-correction (no external feedback) does not reliably
improve reasoning and can degrade it. On GSM8K, GPT-3.5 corrected 7.6% of its incorrect answers
but flipped 8.8% of correct answers to incorrect -- a net loss. The paper's conclusion is that
LLMs "struggle to self-correct their responses without external feedback, and at times, their
performance even degrades after self-correction."
Source: Huang et al., "Large Language Models Cannot Self-Correct Reasoning Yet," arXiv:2310.01798,
submitted 2023-10-03 (rev 2024-03-14), ICLR 2024, https://arxiv.org/abs/2310.01798 .

A same-model reviewer gate is a self-correction loop with extra steps. The evidence says it can
subtract as much correctness as it adds.

### 2.3 Self-preference bias -- judges favor their own generations

LLM judges systematically favor outputs produced by themselves or their own model family
("self-preference bias"). GPT-4 shows a significant degree of it; judges rate low-perplexity
(familiar) text higher than humans do, regardless of quality. Self-recognition ability correlates
with the size of the bias.
Sources:
- Wataoka et al., "Self-Preference Bias in LLM-as-a-Judge," arXiv:2410.21819 (2024-10),
  https://arxiv.org/abs/2410.21819 .
- Panickssery, Bowman, Feng, "LLM Evaluators Recognize and Favor Their Own Generations,"
  arXiv:2404.13076 (2024), https://arxiv.org/abs/2404.13076 .
- Zheng et al., "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena," arXiv:2306.05685,
  NeurIPS 2023, https://arxiv.org/abs/2306.05685 -- names "self-enhancement bias" (judges favor
  their own answers) alongside position and verbosity bias.

Crucially, capability does not cure it. A 2026 analysis of 20 mainstream LLMs finds "advanced
capabilities are often uncorrelated, or even negatively correlated, with low self-preference
bias," and labels high-discriminability-yet-biased models "Machiavellian Judges" -- able to
recognize quality yet systematically biased toward their own outputs.
Source: "Quantifying and Mitigating Self-Preference Bias of LLM Judges," arXiv:2604.22891 (2026),
https://arxiv.org/abs/2604.22891 . So "the base model is strong" is not a defense against this
failure; it may make it worse.

### 2.4 Sycophancy / agreement bias -- the reviewer rubber-stamps under pressure

Sycophancy is a general behavior of RLHF-trained assistants across vendors (Anthropic, OpenAI,
Meta): models match user/context beliefs over truth, admit non-mistakes, and mimic errors. Both
humans and preference models sometimes prefer convincingly written but incorrect responses.
Source: Sharma et al. (Anthropic), "Towards Understanding Sycophancy in Language Models,"
arXiv:2310.13548 (2023-10), https://arxiv.org/abs/2310.13548 ; blog:
https://www.anthropic.com/research/towards-understanding-sycophancy-in-language-models .
Later formal work argues RLHF amplifies this failure mode.
Source: "How RLHF Amplifies Sycophancy," arXiv:2602.01002 (2026),
https://arxiv.org/abs/2602.01002 .

In a skill that hands the reviewer the executor's plan and justification as context, the
agreement-bias pull is toward ratifying that plan -- the opposite of an independent challenge.

### 2.5 Verifier agents do shallow checks in practice (empirical, not theoretical)

The MAST failure taxonomy studied 200+ traces across 7 multi-agent frameworks. A dedicated
category, "Task Verification," accounts for 21.30% of all failures; "No/Incomplete Verification"
(FM-3.2) plus "Incorrect Verification" (FM-3.3) together account for 13.48%. The authors' finding
about verifier agents specifically:

> "current verifiers often only perform superficial checks (e.g., missing comments or code
> compilation) and struggle to ensure deeper correctness."

Their worked example: a ChatDev verifier approved chess code that compiled but accepted illegal
moves -- it never checked the actual game rules. A refactoring reviewer is just as likely to check
"does it still compile / do tests pass" (which the TDD loop already guarantees) and miss the
judgment call ("is this abstraction warranted?") that is the whole point of the gate.
Source: Cemri et al., "Why Do Multi-Agent LLM Systems Fail?" (MAST), arXiv:2503.13657, NeurIPS
2025 Datasets & Benchmarks spotlight, https://arxiv.org/abs/2503.13657 .

---

## 3. Cost / latency tax on a whole-package sweep

A refactoring sweep over a package is many files x many red-green-refactor rounds. A per-gate
reviewer call multiplies against all of them.

### 3.1 Subagent calls are expensive and do not inherit the cache

Anthropic's cost documentation and community measurement:
- Agent teams use approximately 7x more tokens than a standard session, because each teammate
  runs as a separate instance with its own context window.
  Source: https://code.claude.com/docs/en/costs (Claude Code "Manage costs", 2026).
- A subagent spins up a fresh, cold context: it does NOT inherit the parent session's cached
  prefix (system prompt + tool defs + accumulated history), so it pays full uncached input price
  for context the main session holds cheaply. Fan out over the same repo and you re-buy
  overlapping context per agent, at the uncached rate. System prompts are re-charged as input on
  every call.
  Source: "The Context Window Tax," HackerNoon (2026),
  https://hackernoon.com/navigating-claude-code-the-context-window-tax ; "The Hidden Token Cost,"
  https://extraheadroom.com/blog/claude-code-subagents-token-costs (2026).

For a judgment gate that returns a short verdict, most of that cost is pure overhead -- the gate
re-reads the diff and surrounding code cold on every invocation.

### 3.2 Coordination adds multiplicative latency and often does not improve quality

Controlled measurement of single- vs multi-agent pipelines:
- Token cost scaled from 166 tokens (single agent) to 552 (two-agent) to 896 (three-agent) on the
  same task (~5.4x).
- Latency: three-agent settings incur a 3x-6x slowdown on average; GPT-4.1 went from 3.88s to
  38.43s (~10x) in one case.
  Source: "1-2-3 Check: Enhancing Contextual Privacy in LLM via Multi-Agent Reasoning,"
  arXiv:2508.07667 (2025), https://arxiv.org/abs/2508.07667 .
- A Mars-rover decision-support benchmark: single-agent required substantially lower latency and
  token usage, and multi-agent orchestration "did not reliably improve aggregate decision accuracy
  or hazard F1"; the authors call multi-agent "a cost-bearing design choice rather than an assumed
  improvement."
  Source: Frontiers in Robotics and AI (2026),
  https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2026.1877762/full .

Net: on a whole-package sweep, the mechanism imposes a standing 3x-10x latency and up to ~7x token
tax on every gated step, to catch a failure that fires in a minority of runs. The ROI is inverted.

---

## 4. Skippability + maintenance: neither gate reliably gates

### 4.1 A skill-instructed consult is advisory -- it can be skipped (compliance gap)

A skill is a Markdown prompt; "consult the reviewer at judgment gate X" is an instruction the
model may skip, especially under task pressure or long context, and then rationalize post hoc.
There is no hard enforcement. This is the same category as the project's own documented reality
that GSD post-execution gates get self-certified inline unless a hard mechanism forces the
independent agent -- instructions drift when the model is busy. A soft gate that fires only when
the model chooses to fire it does not close a reliability gap; it adds a step the model can and
will occasionally omit, giving false confidence that the gate "is there."

### 4.2 A PreToolUse hook is per-clone, opt-in machinery with a bad reliability record

Hooks are not auto-installed; they are per-clone/per-machine configuration (matching the
maintainer's own standing rule to avoid git hooks for enforcement because they cannot bind other
contributors and add setup friction). Beyond that, the Claude Code hook mechanism has a documented
history of failing at the one job a hard gate must do:

- "PreToolUse hooks cannot block tool execution -- approve: false is ignored." Issue #4362,
  opened 2025-07-25 (closed). https://github.com/anthropics/claude-code/issues/4362
- "[BUG] PreToolUse hooks exit code ignored -- operations proceed after hook failure"; reporter
  warns that if hooks cannot actually block, they "provide false security." Issue #21988, opened
  2026-01-30 (closed). https://github.com/anthropics/claude-code/issues/21988
- "PreToolUse hook permissionDecision: 'deny' ignored for Edit tool -- tool executes despite
  deny." Issue #37210, opened 2026-03-21 (closed).
  https://github.com/anthropics/claude-code/issues/37210
- "Claude Code circumvents PreToolUse:Edit hook via Bash tool" -- a Write/Edit hook is trivially
  bypassed by writing files through Bash (sed/python/echo). Issue #29709, opened 2026-03-01
  (closed). https://github.com/anthropics/claude-code/issues/29709

Even when working as designed, PreToolUse command hooks communicate only via exit codes (stdout is
not read), and the whole edit surface is not covered (Bash-mediated edits bypass Edit/Write
matchers). A refactoring agent that can run shell can route around the gate.
Source (mechanism + coverage gap): Claude Code hooks reference,
https://code.claude.com/docs/en/hooks (2026).

### 4.3 False positives block legitimate edits and destroy trust -- the rubber-stamp endgame

Practitioner guidance on hook guardrails is blunt: "False positives. Aggressive patterns will
block legitimate operations. You'll spend time tuning."
Source: "Claude Code Hooks: Guardrails That Actually Work," https://paddo.dev/blog/claude-code-hooks-guardrails/
(2025).

The AI-code-review literature quantifies the downstream damage of a noisy gate. As false-positive
rate climbs, developer behavior degrades from "investigate every finding" (<10% FP) to "dismiss by
default" (>50% FP). Up to ~40% of AI review alerts get ignored once alert fatigue sets in;
untuned first-generation LLM reviewers commonly sit at 40%-80% FP, versus SonarSource's 3.2% after
years of rule tuning. The endpoint is the rubber-stamp: reviews shift from evaluation to reflexive
dismissal, and real issues slip through with the noise.
Sources:
- cubic.dev, "The false-positive problem" (2025-12),
  https://www.cubic.dev/blog/the-false-positive-problem-why-most-ai-code-reviewers-fail-and-how-cubic-solved-it .
- atomicrobot, "AI Writes Better Code. We're Getting Worse at Reviewing It." (2025-2026),
  https://atomicrobot.com/blog/ai-review-fatigue/ (automation complacency / vigilance decrement).

A same-model judgment gate on a subjective call ("is this abstraction warranted?") is a
false-positive generator: it will flag defensible refactorings and, per 2.4, also wave through
bad ones. Both directions erode the gate's value.

### 4.4 Maintenance surface

A reviewer agent is another prompt to version, review (this repo's own rule requires subagent
review of every agent/SKILL change), eval, and keep in sync with the skill. A hook is
settings.json machinery plus a script, per clone, with its own failure/circumvention modes. Both
add standing maintenance to a skill whose entire selling point is minimalism.

---

## 5. The null hypothesis: a strong base model does not need the gate

The multi-agent scaling literature gives a quantitative version of "do not add machinery to beat a
capable base model":

- Capability Saturation: coordination/verification yields diminishing returns once the
  single-agent baseline exceeds ~45% on the studied benchmarks; above that, coordination overhead
  outweighs the benefit. Anthropic-family models specifically showed "higher variance and
  occasional MAS underperformance, reflecting sensitivity to coordination overhead." Independent
  multi-agent (parallel, no communication -- closest to a bolt-on reviewer) showed 17.2x
  trace-level error amplification and +58% token overhead.
  Source: "Towards a Science of Scaling Agent Systems," arXiv:2512.08296 (2025),
  https://arxiv.org/html/2512.08296v1 .
- MAST's headline: multi-agent performance gains "often remain minimal compared with single-agent
  frameworks," and failures are rooted in orchestration, not raw model capability -- "improvements
  in base model capabilities will be insufficient to address the full taxonomy," and, conversely,
  adding orchestration does not buy reliability. Source: arXiv:2503.13657 (as above).

For a task the base model already handles well (the premise: Opus 4.8 is strong at TPP-style
refactoring), the honest read is that the skill's leverage is:
1. auto-triggering the right workflow (red-green-refactor discipline) at the right moment, and
2. supplying the reference catalog (TPP order, Kerievsky/GoF leaves, smell definitions)

-- i.e., putting the right knowledge and sequence in front of a capable model. Neither of those is
a gate on output. Gating is where the added-mechanism ROI is worst and the same-model failure
modes bite hardest.

The proportionate response to the two observed slips is to encode them as prose in the skill body:
one rubric line each ("do not introduce structure the failing test does not force"; "flag exported
-signature changes and state blast radius before editing"), then re-run the evals. If a one-line
rubric moves the numbers -- which, per 2.x, is far more plausible than a same-model gate moving
them -- the mechanism was never needed.

---

## Steelman of the cheaper alternatives

Prose rubric (recommended default):
- Zero added latency/token cost; no cache-cold agent calls; no per-clone machinery.
- Rides the base model's strength instead of fighting its blind spot -- an instruction in the
  primary context is acted on in-distribution, not re-litigated by a biased second copy.
- Directly matches the two named failures with two sentences (instrument fits the defect).
- Maintainable: it is the skill; nothing extra to version, review, or sync.
- Testable the same way the failures were found: re-run the kata + single-file evals and compare.

No mechanism at all (viable if evals are already green enough):
- If the failures are within acceptable tolerance for the skill's core value ("the transformation
  guidance must be correct and usable"), YAGNI says ship and monitor. Anthropic: the simplest
  solution "might mean not building agentic systems at all."

---

## Honest counter-evidence (where the mechanism has a real, narrow case)

Intellectual honesty requires noting the conditions under which external review DOES help -- and
why they mostly do not apply here.

- Fresh-context / separated review helps. Reframing a model's own output as external input (a
  clean session that never saw the generation) partially recovers correction ability, because the
  self-correction blind spot is triggered by "this is my completion."
  Source: "Cross-Context Review," arXiv:2603.12123 (2026), https://arxiv.org/abs/2603.12123 ;
  mechanism corroborated by "Self-Correction Bench," arXiv:2507.02778.
  Caveat: this addresses the "own-output" trigger, NOT the shared-training-bias problem. A
  fresh-context Opus reviewer still shares Opus's inductive biases and self-preference. Fresh
  context is a partial, not a full, fix.
- Executable/formal ground truth breaks correlation. Tests, type-checkers, and compilers provide
  genuinely independent signal. But the TDD loop ALREADY supplies this -- the failing/passing
  test is the ground-truth gate. Blast-radius for an exported-signature change is better caught by
  a deterministic check (grep/type-check the callers) than by an LLM judgment call. A cheap
  deterministic tripwire beats a probabilistic same-model reviewer for the signature case
  specifically.
- A different model family is the only reviewer that escapes shared blind spots -- but that is out
  of scope here (the proposal is a same-base-model reviewer) and adds cost/approval burden.
- Zheng et al. (MT-Bench) show a strong judge can reach ~80% agreement with humans IN AGGREGATE on
  open-ended preference -- but that is population-level correlation, not reliability on the exact
  minority cases (own-generated, plausible-but-wrong) where self-preference and the blind spot
  concentrate. Aggregate agreement is not the metric that matters for a rare-slip gate.

---

## When the mechanism WOULD be justified (decision boundary)

Stay prose-only / no-gate UNLESS ALL of the following hold:

1. A targeted prose rubric was tried first and measurably failed to move the eval numbers
   (evidence, not assumption). This is the gating precondition -- climb the cheap rungs first.
2. The residual failure is frequent and high-blast-radius (e.g., an exported-signature/API break
   in a clear majority of runs, not a 1/3 slip or an n=1 anecdote), so the standing 3x-10x
   latency / ~7x token tax is proportionate to the harm avoided.
3. The gate can use INDEPENDENT signal rather than same-model judgment:
   - prefer a DETERMINISTIC check (type-check/compile/grep callers for signature and blast-radius
     -- cheap, non-probabilistic, no self-preference), or
   - a DIFFERENT model family, or at minimum a FRESH-CONTEXT reviewer that never saw the
     generation -- never a same-session same-model rubber stamp.
4. If a hook is used, it targets an OBJECTIVE, machine-checkable predicate (does a public symbol's
   signature change? -- a diff/AST fact), NOT a subjective judgment ("is this abstraction
   warranted?"), because subjective hooks are false-positive engines that get dismissed (Section
   4.3), and it accepts the known coverage gap (Bash-mediated edits bypass it, per #29709) and the
   per-clone opt-in nature.
5. False-positive rate is measured and kept low (target < ~10%, the threshold below which findings
   are still investigated rather than dismissed -- Section 4.3), with a feedback/suppression loop.

If any of 1-5 fails, the evidence favors prose-only or no mechanism. For the two failures as
currently characterized, condition 1 is unmet (no prose rubric tried yet) and condition 2 is
unmet (rates too low / sample too small), so the mechanism is not justified today. The
signature-change case, if it recurs, is best served by a deterministic caller/type check (a cheap
tripwire), not a same-model reviewer or a subjective hook.

---

## Source list (URL + date)

Academic:
- Huang et al., "Large Language Models Cannot Self-Correct Reasoning Yet," arXiv:2310.01798,
  2023-10-03 (rev 2024-03-14), ICLR 2024. https://arxiv.org/abs/2310.01798
- Zheng et al., "Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena," arXiv:2306.05685,
  NeurIPS 2023. https://arxiv.org/abs/2306.05685
- Sharma et al. (Anthropic), "Towards Understanding Sycophancy in Language Models,"
  arXiv:2310.13548, 2023-10. https://arxiv.org/abs/2310.13548
- Wataoka et al., "Self-Preference Bias in LLM-as-a-Judge," arXiv:2410.21819, 2024-10.
  https://arxiv.org/abs/2410.21819
- Panickssery, Bowman, Feng, "LLM Evaluators Recognize and Favor Their Own Generations,"
  arXiv:2404.13076, 2024. https://arxiv.org/abs/2404.13076
- Cemri et al., "Why Do Multi-Agent LLM Systems Fail?" (MAST), arXiv:2503.13657, NeurIPS 2025.
  https://arxiv.org/abs/2503.13657
- "Towards a Science of Scaling Agent Systems," arXiv:2512.08296, 2025-12.
  https://arxiv.org/html/2512.08296v1
- "1-2-3 Check: Enhancing Contextual Privacy in LLM via Multi-Agent Reasoning," arXiv:2508.07667,
  2025-08. https://arxiv.org/abs/2508.07667
- "Self-Correction Bench," arXiv:2507.02778, 2025-07. https://arxiv.org/abs/2507.02778
- "Cross-Context Review," arXiv:2603.12123, 2026-03. https://arxiv.org/abs/2603.12123
- "Quantifying and Mitigating Self-Preference Bias of LLM Judges," arXiv:2604.22891, 2026-04.
  https://arxiv.org/abs/2604.22891
- "How RLHF Amplifies Sycophancy," arXiv:2602.01002, 2026-02. https://arxiv.org/abs/2602.01002
- N-CRITICS, arXiv:2310.18679, 2023-10. https://arxiv.org/abs/2310.18679
- Mars-rover single-vs-multi-agent, Frontiers in Robotics and AI, 2026.
  https://www.frontiersin.org/journals/robotics-and-ai/articles/10.3389/frobt.2026.1877762/full

Anthropic / Claude Code:
- "Building effective agents," 2024-12-19.
  https://www.anthropic.com/engineering/building-effective-agents
- "Effective context engineering for AI agents," 2025.
  https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
- Claude Code "Manage costs," 2026. https://code.claude.com/docs/en/costs
- Claude Code hooks reference, 2026. https://code.claude.com/docs/en/hooks

GitHub issues (anthropics/claude-code):
- #4362, opened 2025-07-25 (closed). https://github.com/anthropics/claude-code/issues/4362
- #21988, opened 2026-01-30 (closed). https://github.com/anthropics/claude-code/issues/21988
- #37210, opened 2026-03-21 (closed). https://github.com/anthropics/claude-code/issues/37210
- #29709, opened 2026-03-01 (closed). https://github.com/anthropics/claude-code/issues/29709

Practitioner:
- "The Context Window Tax," HackerNoon, 2026.
  https://hackernoon.com/navigating-claude-code-the-context-window-tax
- "The Hidden Token Cost," extraheadroom, 2026.
  https://extraheadroom.com/blog/claude-code-subagents-token-costs
- "Claude Code Hooks: Guardrails That Actually Work," paddo.dev, 2025.
  https://paddo.dev/blog/claude-code-hooks-guardrails/
- cubic.dev, "The false-positive problem," 2025-12.
  https://www.cubic.dev/blog/the-false-positive-problem-why-most-ai-code-reviewers-fail-and-how-cubic-solved-it
- atomicrobot, "AI Review Fatigue," 2025-2026. https://atomicrobot.com/blog/ai-review-fatigue/
