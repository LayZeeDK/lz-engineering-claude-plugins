# Research: Making a skill follow its own decision procedure -- and making the anti-over-engineering guard BIND

**Researched:** 2026-07-12
**Domain:** Prompt / instruction engineering for Markdown-steered agents (Claude Code Agent Skills)
**Confidence:** HIGH for the mechanisms and Anthropic authoring guidance; MEDIUM where a technique is community-sourced or the empirical effect is model-dependent.

## The concrete failure, framed

`lz-refactor`'s coach procedure (SKILL.md lines 46-111) does this:

- **Step 3** routes a Conditional Complexity / Combinatorial Explosion smell TO a Kerievsky/GoF pattern -- it *surfaces the pattern first*.
- **Step 4** is the over/under-engineering balance ("clarity is the default; an unwarranted pattern is refactored AWAY") -- it is *advisory prose meant to walk the pattern back*.
- A separate "add-on-spec pause guard" ("a pattern you would only be adding on spec -- leave it with a one-line reason") is buried inside the ~30-line mega-paragraph at lines 87-111.

Observed run: the model executed step 3 (built a 4-subclass polymorphic hierarchy for 4 trivial types) and gave **zero trade-off acknowledgment** -- step 4 and the pause guard never fired.

This is a textbook instance of three documented phenomena, addressed in sections (a)-(c) below:
1. The **compliance gap** -- a model can acknowledge a procedural constraint yet not execute it, because understanding is decoupled from generation.
2. **Positional / ordering hazard** -- the temptation (the pattern) is surfaced before the guard, and the guard that should veto it sits mid-document where attention is weakest.
3. **Negative/advisory framing** -- "don't add an unwarranted pattern" is a soft negation with no forcing function, so nothing makes the model stop and decide.

---

## (a) Techniques that make a multi-step procedure actually followed, in order and completely

**A1. Force an explicit, per-step plan/decision before acting ("think out loud" / planning component).**
OpenAI's GPT-4.1 guide shows that *inducing explicit planning* -- making the model emit a step-by-step plan rather than silently acting -- raised the SWE-bench Verified pass rate by 4%, and that a short block of foundational agentic instructions (persistence, tool-use, planning) raised the internal score by ~20%. The mechanism: the model "thinks out loud" and commits to each step before executing. Anthropic's chain-of-thought guidance is the same lever from the other vendor: "for complex tasks, giving Claude space to reason step-by-step dramatically improves accuracy," with a *Structured* form using explicit `<thinking>`/`<answer>` separation.
Sources: OpenAI GPT-4.1 Prompting Guide, https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide (2025); Anthropic "Let Claude think", https://docs.anthropic.com/en/docs/let-claude-think (2025). Confidence: HIGH.

**A2. Give the agent a checklist it copies into its response and checks off.**
This is Anthropic's own skill-authoring recommendation: "Use workflows for complex tasks. Break complex operations into clear, sequential steps. For particularly complex workflows, provide a checklist that the agent can copy into its response and check off as it progresses." A copied, ticked checklist converts an implicit procedure into a visible artifact the model must fill -- skipping a step becomes conspicuous.
Source: Anthropic best-practices for skill authoring, as captured in obra/superpowers `anthropic-best-practices.md`, https://github.com/obra/superpowers/blob/main/skills/writing-skills/anthropic-best-practices.md (2025); primary: Anthropic "Equipping agents for the real world with Agent Skills", https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills (2025). Confidence: HIGH.

**A3. Gate progression: a step must produce a stated result before the next step is allowed.**
The same Anthropic material models a hard gate: "Step 5: Verify output... If verification fails, return to Step 2." Completion-gating (the model checks a step is done, and only then proceeds) is the recurring pattern across the multi-step-workflow literature -- each step builds on the previous, and the model verifies completion at each stage before continuing.
Sources: obra/superpowers `anthropic-best-practices.md` (2025); Deepchecks "Multi-Step LLM Chains: Best Practices", https://deepchecks.com/orchestrating-multi-step-llm-chains-best-practices/ (2025). Confidence: HIGH (pattern), MEDIUM (magnitude of effect for a prose-only skill).

**A4. Match instruction specificity to task fragility -- use LOW degrees of freedom where a specific sequence and consistency are load-bearing.**
Anthropic's authoring guidance says to "match the level of specificity to the task's fragility and variability." High freedom (heuristics, "multiple approaches are valid") is for open judgement; LOW freedom -- prescriptive steps, checklists, gates -- is explicitly for when "operations are fragile and error-prone, consistency is critical, a specific sequence must be followed." The over/under-engineering veto is a fragile, consistency-critical decision; it currently sits in the high-freedom register (advisory prose) and should move to the low-freedom register (a forced decision).
Source: obra/superpowers `anthropic-best-practices.md` (2025). Confidence: HIGH.

**A5. Separate generate from verify; append a self-check that re-asserts the critical rule at the end.**
Anthropic: "Ask Claude to self-check. Append something like 'Before you finish, verify your answer against [test criteria].' This catches errors reliably." Community syntheses add: "repeat the most important instruction at the end" and run a short checklist before finalizing. This exploits the recency half of the position effect (see c) -- a closing verification pass is read with high attention.
Sources: Anthropic prompt-engineering / chain-of-thought docs, https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-of-thought (2025); Gravitee "Prompt Engineering for LLMs", https://www.gravitee.io/blog/prompt-engineering-for-llms (2026). Confidence: HIGH (Anthropic self-check), MEDIUM (repeat-at-end).

---

## (b) Making the veto / balance BINDING rather than advisory

**B1. The core diagnosis: the "compliance gap."**
Shin, "The Compliance Gap: Why AI Systems Promise to Follow Process Instructions but Don't" (arXiv 2605.01771, 2025), names exactly this failure: systems "demonstrate they understand procedural constraints through acknowledgment, yet systematically fail to adhere to them during execution." Causes: (1) **decoupling of understanding from execution** -- the model can confirm a rule but has no mechanism forcing adherence during generation; (2) **attention competition** -- the process constraint competes with task content for capacity; (3) **training/deployment mismatch** on novel constraints. Its prescribed mitigations are precisely the forcing functions this skill lacks: **explicit acknowledgment before proceeding, gating checkpoints that verify compliance, structured output that inherently enforces the rule, and procedural scaffolding with verification between stages.**
Source: https://arxiv.org/abs/2605.01771 (2025). Confidence: HIGH for the diagnosis; MEDIUM that the specific mitigations transfer fully to a prose skill (they are argued, and consistent with A1-A5).

**B2. Force an explicit APPLY-or-DECLINE decision with a one-line reason -- do not let the pattern pass silently.**
The binding version of "clarity is the default" is not a sentence of advice; it is a required decision the model must emit for every candidate pattern: state "APPLY -- earns its keep because it removes {named duplication/complexity}" OR "DECLINE -- clarity default; {reason}". This is B1's "explicit acknowledgment before proceeding" plus A1's planning: the veto only bites if declining is a first-class output the model has to produce, not an inference it may skip.
Sources: arXiv 2605.01771 (2025); OpenAI GPT-4.1 guide (2025). Confidence: HIGH (follows directly from B1/A1).

**B3. Reframe the veto positively -- state the default action, not the prohibition ("Pink Elephant").**
"Don't add an unwarranted pattern" is a negation; negations are the weakest instruction form. Anthropic's own docs: tell the model what TO do instead of what NOT to do (their example: replace "Do not use markdown" with "Your response should be composed of smoothly flowing prose paragraphs"). The 16x Eval "Pink Elephant" analysis found "only use real data" reliably beats "don't use mock data," and cites a KAIST result that larger models get *worse* at negated instructions. So phrase the default affirmatively: "Keep the conditional / dissolve to the functional idiom UNLESS the pattern removes a named duplication or complexity" -- and give the concrete positive action for the decline branch (keep the switch; use a discriminated union; leave a one-line note).
Sources: Anthropic prompt-engineering docs (2025); 16x Eval "The Pink Elephant Problem", https://eval.16x.engineer/blog/the-pink-elephant-negative-instructions-llms-effectiveness-analysis (2025); DigitalOcean prompt-engineering guide, https://www.digitalocean.com/resources/articles/prompt-engineering-best-practices (2025). Confidence: HIGH.

**B4. Explain WHY the veto exists so the model generalizes past the cases you enumerated.**
Anthropic's most load-bearing skill-authoring finding for this problem: skills written as "strings of ALWAYS, NEVER, MUST in capital letters give Claude rigid rules with no context. The model follows the letter but misses edge cases the author did not anticipate, or over-applies a rule." Fix: "state the rule, then explain why so Claude can generalise." The step-4 balance needs its rationale attached -- e.g., "a pattern that adds subclasses/indirection without removing named duplication is pure cost: more code, more places to look, no behavior change" -- so the model recognizes the 4-trivial-types case even though the skill never listed it.
Source: Anthropic "Equipping agents for the real world with Agent Skills" (2025), via generativeprogrammer.com summary https://generativeprogrammer.com/p/skill-authoring-patterns-from-anthropics and obra/superpowers (2025). Confidence: HIGH.

**B5. Few-shot the correct DECLINE.**
Give one worked example where a smell legitimately routes to a pattern and the coach *declines* it -- ideally the exact observed failure (Conditional Complexity over 4 trivial types -> candidate polymorphism -> DECLINE: "4 trivial cases, a switch/discriminated union is clearer; polymorphism adds 4 classes for no removed duplication"). Models imitate demonstrated behavior far more reliably than they follow described behavior; a single decline exemplar teaches the shape of the output the veto is supposed to produce.
Sources: general few-shot practice, Anthropic prompt-engineering docs (2025); consistent with arXiv 2605.01771 "procedural scaffolding" (2025). Confidence: MEDIUM-HIGH.

---

## (c) The ordering / priming hazard: guard should precede or be co-located with the temptation

**C1. Instruction/constraint ORDER measurably changes compliance.**
Zeng et al., "Order Matters: Investigate the Position Bias in Multi-Constraint Instruction Following" (arXiv 2502.17204, Feb 2025): "LLMs exhibit dramatic performance fluctuation when disturbing the order of the incorporated constraints." Their headline result -- **hard-to-easy ordering wins**: putting the difficult constraint first yields better overall compliance than easy-first, and this generalizes across architectures and sizes. Implication for lz-refactor: the *hard* constraint here is the veto ("does this pattern earn its keep?"), and it currently comes AFTER the easy one (pick a pattern). The veto should move earlier / be fused with the routing step.
Source: https://arxiv.org/abs/2502.17204 (2025). Confidence: HIGH.

**C2. Lost-in-the-middle: a critical instruction buried mid-document carries the least weight.**
Liu et al. (2023) established the U-shaped effect -- models use information at the beginning and end of context far more reliably than the middle; MIT's 2025 follow-up traces it to an intrinsic U-shaped attention bias regardless of relevance. The "add-on-spec pause guard" lives inside a ~30-line paragraph in the back half of SKILL.md -- structurally the worst position. Caveat: at least one 2025 study (arXiv 2510.14842) found the effect on *instruction*-following specifically is model-dependent and not always consistent, so treat this as "don't bury critical guards," not "position alone determines behavior."
Sources: Liu et al. "Lost in the Middle" https://arxiv.org/abs/2307.03172 (2023); MIT News, https://news.mit.edu/2025/unpacking-large-language-model-bias-0617 (2025); "Boosting Instruction Following at Scale" https://arxiv.org/pdf/2510.14842 (2025). Confidence: HIGH for retrieval, MEDIUM for instruction-following.

**C3. Anchoring: surfacing the pattern first primes the model toward applying it.**
Once step 3 names a specific pattern and points at its catalog leaf, that pattern is the salient, concrete, "already-decided" option; step 4's abstract balance then has to overcome an anchor the skill itself planted. The robust fix is not to argue harder in step 4 but to **co-locate the gate with the temptation** -- the routing step must deliver the candidate pattern *and* its warrant test as a single unit, so the pattern is never presented as a fait accompli. This is the direct application of C1 (hard constraint first/fused) and B1 (acknowledgment before proceeding).
Sources: synthesis of C1 (arXiv 2502.17204) + B1 (arXiv 2605.01771). Confidence: MEDIUM-HIGH.

---

## (d) Anthropic's own Agent Skills / effective-prompt guidance (authority-precedence primary)

- **Progressive disclosure; keep SKILL.md lean (< 500 lines), one level deep.** The body is an overview pointing to detail files loaded on demand. lz-refactor already does this; the fix must not bloat the body.
  Source: Anthropic "Equipping agents for the real world with Agent Skills", https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills (2025). Confidence: HIGH.
- **Explain the why, do not just stack imperatives** (see B4). Rigid ALWAYS/NEVER lists cause both letter-following-that-misses-edge-cases and over-application. State rule + rationale.
  Source: same, plus obra/superpowers `anthropic-best-practices.md` (2025). Confidence: HIGH.
- **Degrees of freedom: prescriptive/checklist/gate for fragile, consistency-critical, must-follow-a-sequence steps** (see A4). The veto qualifies.
  Source: obra/superpowers `anthropic-best-practices.md` (2025). Confidence: HIGH.
- **Checklists the agent copies and checks off; verification gates that loop back on failure** (see A2, A3).
  Source: same (2025). Confidence: HIGH.
- **Self-check before finishing** (see A5): "Before you finish, verify your answer against [criteria]."
  Source: Anthropic chain-of-thought docs, https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-of-thought (2025). Confidence: HIGH.
- **Tell it what TO do, not what NOT to do** (see B3): reframe negative formatting/behavior rules as positive targets.
  Source: Anthropic prompt-engineering docs (2025), corroborated by 16x Eval (2025). Confidence: HIGH.
- **Build from evals; think from Claude's perspective and iterate on real trajectories.** The measured 4-subclass run is exactly the "unexpected trajectory / overreliance" signal Anthropic says to iterate against -- fold it back as a regression eval and a few-shot (B5).
  Source: Anthropic Agent Skills blog (2025). Confidence: HIGH.

Note on the model in play: Anthropic notes Opus-class models are sensitive to the literal word "think"; when phrasing a reasoning gate prefer "consider / evaluate / justify / decide" over "think" (source: Claude prompt-engineering best-practices, https://claude.com/blog/best-practices-for-prompt-engineering, 2026). And OpenAI's GPT-4.1 guidance -- that current models follow instructions more literally and infer less -- cuts in favor of an explicit forced-decision gate over advisory prose regardless of vendor (source: GPT-4.1 guide, 2025).

---

## (e) Concrete, implementation-ready edits for lz-refactor/SKILL.md (research only -- not applied)

Each edit names the SKILL.md location and the source that justifies it. They are ordered by expected impact.

**E1. Fuse the veto INTO the routing step -- never surface a pattern without its warrant test in the same breath.**
Merge the operative half of step 4 into step 3 so the pattern-directed route reads as one unit: "Route to a candidate pattern AND, in the same step, decide whether it earns its keep -- name the duplication or complexity it removes, or decline it." Keep step 4 only as the catalog of AWAY moves / functional dissolutions for the decline branch.
Why/source: C1 hard-constraint-first + C3 anchoring (arXiv 2502.17204, 2025); B1 acknowledgment-before-proceeding (arXiv 2605.01771, 2025).

**E2. Make the warrant a REQUIRED, stated APPLY-or-DECLINE verdict with a one-line reason, before any code is written or advised.**
In the coach procedure, require the coach to emit, for each routed pattern:
`Pattern: <name> | Verdict: APPLY | earns its keep by removing <named duplication/complexity>` or `Verdict: DECLINE | clarity default -- <reason>; keep <concrete simpler form>`.
No pattern reaches the "apply/advise" step without this line.
Why/source: B1/B2 forced explicit decision + gating (arXiv 2605.01771, 2025); A1 explicit planning (OpenAI GPT-4.1, 2025).

**E3. Reframe "clarity is the default" as a positive rule with the decline ACTION spelled out.**
Replace the advisory negation with an affirmative default + concrete alternative: "Default to the simplest form that removes the smell -- keep the switch / use a discriminated union / dissolve to the functional idiom. Introduce a pattern only when it removes a duplication or complexity you can name in one line."
Why/source: B3 Pink Elephant / positive framing (Anthropic prompt docs 2025; 16x Eval 2025; DigitalOcean 2025).

**E4. Attach the WHY to the balance so it generalizes to unlisted cases.**
Add one rationale sentence: "An unwarranted pattern is pure cost -- more classes/indirection to read and maintain, with no behavior change and no duplication removed; over N trivial cases a polymorphic hierarchy is strictly more to look at than a switch."
Why/source: B4 explain-the-why (Anthropic Agent Skills blog 2025; obra/superpowers 2025).

**E5. Add a copyable per-refactoring checklist to the coach procedure.**
Provide a short checklist the coach copies into its response for each refactoring in a sweep: `[ ] smell named  [ ] candidate refactoring  [ ] warrant verdict APPLY/KEEP/AWAY/DECLINE + one-line reason  [ ] behavior-preserving step  [ ] tests green`. Every item must be ticked before the refactoring is considered done.
Why/source: A2 checklists + A3 gating (obra/superpowers `anthropic-best-practices.md` 2025; Anthropic Agent Skills blog 2025).

**E6. Promote the "add-on-spec pause guard" out of the buried mega-paragraph into the E2 verdict.**
Delete the "a pattern you would only be adding on spec -- leave it with a one-line reason" clause from the lines 87-111 paragraph and re-express it as the DECLINE branch of the E2 verdict (on-spec = a pattern with no named duplication/complexity to remove -> DECLINE, record the one-line reason). It becomes a decision the model must make, not a note it may skim past.
Why/source: C2 lost-in-the-middle -- do not bury a critical guard mid-document (Liu et al. 2023; MIT 2025); B1 (arXiv 2605.01771, 2025).

**E7. Few-shot the correct DECLINE using the exact observed failure.**
Add one compact worked example (in SKILL.md or a `references/` leaf if length is tight): Conditional Complexity across 4 trivial type codes -> candidate Replace Conditional with Polymorphism -> `DECLINE | clarity default -- 4 trivial cases; a switch/discriminated union is clearer; polymorphism adds 4 classes and removes no duplication.` Show the coach declining, not applying.
Why/source: B5 demonstrate-don't-describe (Anthropic prompt docs 2025); A4 low-freedom examples (obra/superpowers 2025).

**E8. Add a terminal self-check at the review gate that re-asserts the veto (recency slot).**
At the sweep's terminal review gate (lines ~96-98), append: "Before finishing, verify every pattern you introduced this session names the duplication or complexity it removed. For any that cannot, refactor it away or record the one-line on-spec reason." Phrase the reasoning verb as "verify / evaluate," not "think."
Why/source: A5 self-check + end-anchoring (Anthropic chain-of-thought docs 2025); Opus "think"-word sensitivity (Claude best-practices blog 2026); B1 verification-between-stages (arXiv 2605.01771, 2025).

**Scope guard for the implementer:** the body is already near the < 500-line budget and progressive-disclosure conventions apply -- E4/E7 detail can live in a `references/` leaf (e.g., extend `principles.md` or `smells/combinatorial-explosion.md`) so only the forced verdict, the positive default, and the checklist land in the body. (Anthropic Agent Skills blog, 2025.)

---

## Sources (with dates and confidence)

Primary -- Anthropic (highest authority for this project):
- Anthropic, "Equipping agents for the real world with Agent Skills", https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills (2025) -- HIGH. Progressive disclosure, explain-the-why, think-from-Claude's-perspective, evals.
- Anthropic skill-authoring best practices, mirrored in obra/superpowers `anthropic-best-practices.md`, https://github.com/obra/superpowers/blob/main/skills/writing-skills/anthropic-best-practices.md (2025) -- HIGH. Checklists, verification gates, degrees of freedom, prefer-explanation-over-imperatives.
- Anthropic "Let Claude think (chain of thought)", https://docs.anthropic.com/en/docs/let-claude-think and chain-of-thought best practices, https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/chain-of-thought (2025) -- HIGH. Structured CoT, self-check-before-finishing.
- Anthropic/Claude "Prompt engineering best practices for 2026", https://claude.com/blog/best-practices-for-prompt-engineering (2026) -- HIGH. Opus "think"-word sensitivity; tell-it-what-to-do.
- generativeprogrammer.com, "Skill Authoring Patterns from Anthropic's Best Practices", https://generativeprogrammer.com/p/skill-authoring-patterns-from-anthropics (2025) -- MEDIUM (secondary summary of the Anthropic blog).

Frontier labs:
- OpenAI, "GPT-4.1 Prompting Guide", https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide (2025) -- HIGH. Literal instruction-following, inducing explicit planning (+4% SWE-bench), foundational agentic instructions (~+20%).

Peer-reviewed / preprint:
- Zeng et al., "Order Matters: Investigate the Position Bias in Multi-Constraint Instruction Following", https://arxiv.org/abs/2502.17204 (Feb 2025) -- HIGH. Order changes compliance; hard-to-easy ordering wins.
- Shin, "The Compliance Gap: Why AI Systems Promise to Follow Process Instructions but Don't", https://arxiv.org/abs/2605.01771 (2025) -- HIGH (diagnosis), MEDIUM (mitigation transfer). Acknowledgment != execution; gating, explicit acknowledgment, structured output, procedural scaffolding.
- Liu et al., "Lost in the Middle: How Language Models Use Long Contexts", https://arxiv.org/abs/2307.03172 (2023) -- HIGH (retrieval). U-shaped positional reliability.
- MIT News, "Unpacking the bias of large language models", https://news.mit.edu/2025/unpacking-large-language-model-bias-0617 (2025) -- HIGH. U-shaped attention bias mechanism.
- "Boosting Instruction Following at Scale", https://arxiv.org/pdf/2510.14842 (2025) -- MEDIUM. Caveat: position effect on instruction-following is model-dependent.

Community (needs-verification tier, used only to corroborate primary sources):
- 16x Eval, "The Pink Elephant Problem", https://eval.16x.engineer/blog/the-pink-elephant-negative-instructions-llms-effectiveness-analysis (2025) -- MEDIUM. Positive framing beats negation; KAIST negation result.
- DigitalOcean, "Prompt Engineering Best Practices", https://www.digitalocean.com/resources/articles/prompt-engineering-best-practices (2025) -- MEDIUM. Negative-to-positive rewrites.
- Deepchecks, "Multi-Step LLM Chains: Best Practices", https://deepchecks.com/orchestrating-multi-step-llm-chains-best-practices/ (2025) -- LOW-MEDIUM. Completion gating in chains.
- Gravitee, "Prompt Engineering for LLMs", https://www.gravitee.io/blog/prompt-engineering-for-llms (2026) -- LOW-MEDIUM. Repeat-critical-instruction-at-end, checklist self-validation.

**Valid until:** ~2026-08-12 for fast-moving vendor docs; the arXiv findings are stable.
