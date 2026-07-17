# Research: Ranking Enforcement Mechanisms for the "Earns Its Keep" Warrant

**Researched:** 2026-07-13
**Domain:** Making a design principle BIND inside a Claude Code skill (Markdown instruction file)
**Question:** Rank -- neutrally, by evidence and ROI -- five mechanisms for binding the warrant
"a refactoring/pattern earns its keep only when complexity_removed > complexity_added"
across ~120 refactorings + patterns. No preferred outcome.
**Confidence:** HIGH on the mechanics of each mechanism (hook API, agent cost, metric blindness);
MEDIUM on the ROI ranking (design judgment applied to a small observed failure sample, n=1 to n=3).

---

## The empirical context (stated plainly, allowed to drive the ROI)

Five facts constrain this evaluation. They are not neutral background -- they are the dominant
inputs to a return-on-investment ranking, and every option is scored against them:

1. **The base model already matches or beats the skill.** Across a large eval, Claude Opus 4.8 @ high
   matched or beat the skill on refactoring output. The skill's only consistent, reproducible win is
   auto-triggering the workflow (verified 8/8 in the nx package fleet, see `260712-n5o-SUMMARY.md`).
2. **The failures a mechanism would catch are INFREQUENT and are judgment calls, not mechanical
   errors.** Over-application of a design pattern occurred in ~1 of 3 kata runs (a needless 4-class
   hierarchy). Driving through an exported-signature change occurred in ~1 of 1 single-file runs
   (n=1 -- a single observed instance).
3. **A prose-only "forced verdict + self-check" was already tried and did NOT bind.** The model
   rationalized past the veto and never emitted the required verdict.
4. **The sweep scope is whole-package, multi-round.** Any per-edit tax is multiplied by the edit
   count; any mechanism's cost must be judged at sweep scale, not per invocation.
5. **This is a public plugin skill, distributed to others.** Build and maintenance cost is not a
   one-time internal expense -- it is carried across every future release and every consumer.

The neutral consequence of facts 1-2: the *ceiling* on value any mechanism can add is low
(infrequent failures on a strong base), so ROI is dominated by *cost*, and cheap options are
structurally advantaged. This does not predetermine the ranking -- a cheap mechanism that cannot
catch the failures still loses to a slightly costlier one that can -- but it means an expensive
mechanism must earn its cost against a small, infrequent benefit.

---

## Ranked comparison table

Ranked by ROI given the context above (1 = best ROI). "Binds?" = does the model actually have to
comply, or can it skip the step.

| Rank | Option | Binds? | Cost / latency at sweep scale | Catches over-application (1/3)? | Catches export drive-through (1/1)? | Generalizes to ~120? | Build + maintenance | ROI verdict |
|------|--------|--------|-------------------------------|-------------------------------|------------------------------------|----------------------|---------------------|-------------|
| 1 | **5. No added mechanism** (rubric kept as pure guidance) | N/A (guidance) | Zero | No (relies on model) | No (relies on model) | Yes (principle) | Zero | **Highest** -- strong base + infrequent judgment failures; nothing cheap catches them anyway |
| 2 | **1. Prose forced-verdict + self-check** | **No (falsified)** | ~Zero | No (already didn't bind) | No | Yes (principle) | ~Zero | **High-but-inert** -- free, harmless, but empirically does not bind; degenerates into #5 |
| 3 | **3. Independent reviewer agent** (soft, Task/Agent tool) | Partial (skippable, but salient) | +1 agent round per consult; ~20k bootstrap + 4-7x tokens on consulted slice; +latency each | **Yes, if gated** (independence breaks anchoring) | Yes (blast-radius lens) | Yes (one rubric) | Medium (1 agent file + gating) | **Moderate** -- only active mechanism whose signal matches the failure type; taxes a strong model, ~2/3 consults just confirm |
| 4 | **4. Hook-forced hard gate** (PreToolUse deny) | **Yes (only true bind)** | Per-edit hook exec (ms if syntactic); block-then-idle bug harms autonomy | No (shell hook cannot read the semantic warrant) | **Yes, hard** (exported-symbol-touched is syntactically detectable) | Only the syntactic invariant, not the warrant | Medium-High (hook + per-language symbol detection + verdict protocol) | **Low** -- heavy machinery that hard-binds only the n=1 syntactic case |
| 5 | **2. Deterministic metric/threshold gate** | Yes (if wired to block) | Linter run per edit (seconds, deterministic) | **No -- false negative** (complexity metrics are blind to over-abstraction) | No (wrong tool; this is a boundary check, not a metric) | No (per-language, per-metric) | High (per-language tooling + threshold tuning + AST diff of proposed change) | **Lowest** -- structurally blind to the exact failure, or a false-positive firehose if class-count-based |

---

## Per-option evidence

### Option 5 -- No added mechanism (rely on the strong base; keep the rubric as guidance)

**Does it bind?** Not applicable -- it is guidance, not a gate. The rubric still sits in the skill
body and nudges the model, but nothing forces compliance.

**Cost / latency:** Zero build, zero runtime, zero maintenance. The auto-trigger (the skill's one
proven win) is retained independently of this decision.

**Reliability / FP-FN:** The residual risk is exactly the observed failure rate -- over-application
~1/3, export drive-through ~1/1 -- left unmitigated. There are no false positives (nothing fires)
and no new false negatives beyond the base model's own.

**Generalization:** Perfect. A stated principle the model reasons from transfers to all ~120 cases,
including catalog entries not yet written. This is the repo's own prior finding: rule-plus-rationale
generalizes where rigid enumerated lists miss unanticipated cases
(`260712-n5o-RESEARCH-warrant-generalization.md`, section e).

**ROI:** Highest. Facts 1-2 make the achievable benefit small; this option spends nothing to capture
that reality. The decisive point: **none of the cheap active mechanisms reliably catch the main
failure (over-application) either** -- the metric gate is blind to it, the hook cannot see it, and
the agent consult only *softly* addresses it while taxing a strong model. When the alternatives buy
little and cost real money, doing nothing is the ROI-rational default -- provided the residual
failure rate is judged tolerable (a judgment-call over-abstraction in 1/3 kata runs, which a human
reviewer would also debate, not a correctness regression).

**Evidence:** Base-model parity and the null value-delta across 6 measured scenarios are documented
in `260712-n5o-SUMMARY.md` (2026-07-13). The generalization-of-principle claim: `260712-n5o-RESEARCH-warrant-generalization.md` section e (2026-07-13), grounded in
[When "Better" Prompts Hurt (arXiv:2601.22025)](https://arxiv.org/html/2601.22025v1) [ASSUMED -- future-dated ID, treat as adjacent, not verified].

---

### Option 1 -- Prose-only forced verdict + terminal self-check (what was tried)

**Does it bind? No -- this is empirically falsified in this project.** Fact 3: the model rationalized
past the forced verdict and never emitted it. This is not a one-off. It is the predicted behavior of
intrinsic self-correction:

- **Huang et al., "Large Language Models Cannot Self-Correct Reasoning Yet"** (ICLR 2024, 668
  citations): LLMs "struggle to self-correct their responses without external feedback, and at times,
  their performance even degrades after self-correction." A prose self-check is intrinsic
  self-correction by the same model in the same context -- exactly the setting the paper finds
  ineffective. [VERIFIED via arXiv + Semantic Scholar]
  [arXiv:2310.01798](https://arxiv.org/abs/2310.01798) (accessed 2026-07-13).

**Cost / latency:** ~Zero. It is text in the skill body.

**Reliability:** The failure mode is a false negative by construction -- the gate the model is asked
to self-impose is the gate it skips. There is no external check to catch the skip.

**Generalization:** The *principle* generalizes fine; the *enforcement* does not exist.

**ROI:** High-but-inert. It costs nothing and does no harm, but as a *binding* mechanism it is dead.
Stripped of the "forced verdict" theater that does not fire, it collapses into Option 5 (a rubric as
guidance). Ranked #2 only because it is free; it adds nothing over #5.

**Evidence:** Project fact 3 (`260712-n5o-RESEARCH.md`, the diagnosed "compliance gap" -- step-3
surfaces a pattern, step-4's advisory veto is lost); [arXiv:2310.01798](https://arxiv.org/abs/2310.01798) (accessed 2026-07-13).

---

### Option 3 -- Independent reviewer/advisor agent (soft, skill-instructed via Task/Agent tool)

**Does it bind?** Partially. A skill instruction to "spawn the reviewer before adding structure" is
still skippable by the model -- the same compliance gap as prose -- but an explicit "spawn X" step is
more salient than "consider Y," so the skip rate is lower, not zero.

**Why it is the only active mechanism whose signal matches the failure:** the failures are *judgment
calls*, and the one thing that reliably improves a judgment call is an **independent, fresh-context**
second opinion. Huang et al. (above) show intrinsic self-correction fails but that *external
feedback* helps. A reviewer agent spawned in a fresh context, blind to what the primary was inclined
to do, supplies exactly that external signal -- and it works with the *same* base model, because the
gain comes from context separation, not from a stronger reviewer. This repo's own memory confirms it:
"unbiased review beats primed -- primed reviewers confirm your assumptions and miss bugs"
(`unbiased-review-beats-primed.md`).

**Cost / latency (the decisive ROI variable):** Each spawned agent is a separate API call with its
own context window, billed at full token rates. Independent measurement: subagents carry a
**~20,000-token bootstrap** each, and Anthropic's own guidance notes multi-agent workflows use
**~4-7x more tokens** than single-agent sessions; fan-out has been measured turning a 121k-token task
into 513k. Each consult also adds a round-trip of latency
([MindStudio, "Sub-Agents Explained: Context, Cost, and Parallel Execution"](https://www.mindstudio.ai/blog/claude-code-sub-agents-explained), accessed 2026-07-13;
[Anthropic, "How and when to use subagents"](https://claude.com/blog/subagents-in-claude-code), accessed 2026-07-13).

- **Per-edit consult on a whole-package sweep is ruinous** -- N edits x (20k bootstrap + full context).
- **Gated consult (fire only when about to ADD STRUCTURE, or touch an exported symbol) is
  affordable** -- consults scale with judgment-difficulty, not edit count, so on an N-edit sweep only
  a handful fire. Precedent: lz-advisor consults at orient/when-stuck/final-review only; GSD spawns
  auditors per phase gate, never per task.

**Reliability / FP-FN:** Real reduction of false negatives on the judgment failure. But on a strong
base, roughly 2/3 of warrant consults will simply confirm the primary's APPLY (fact 2: only ~1/3 of
pattern applications were wrong) -- so most of the spend buys confirmation, not correction. That is
the ROI drag.

**Generalization:** Good. One reviewer with a lens argument (`warrant` | `blast-radius` | `seam`)
applies the single rubric to every case; no per-refactoring agent proliferation.

**Maintenance:** One agent file to keep in sync with the six catalogs; moderate. Note the upstream
bug where a `tools:` frontmatter restriction on an agent strips MCP tools
([anthropics/claude-code#13898](https://github.com/anthropics/claude-code/issues/13898)) -- do not
over-restrict the reviewer.

**ROI:** Moderate. It is the best of the *active* mechanisms because its signal type matches the
failure type, and gated tightly it is affordable. But it is soft (still skippable), and it taxes a
model that is already good -- most consults confirm. Justified only if the residual failure rate from
Option 5 is judged unacceptable.

---

### Option 4 -- Hook-forced validator/reviewer (PreToolUse hook, hard gate)

**Does it bind? Yes -- this is the only option that truly binds.** A plugin-bundled PreToolUse hook
(`${CLAUDE_PLUGIN_ROOT}/hooks/hooks.json`, matcher `Edit|Write|MultiEdit`) runs before the tool call
and can deny it; the model cannot edit without passing. Unlike git hooks, plugin hooks ship with the
plugin and auto-load, so distribution is solved
([Claude Code hooks reference](https://code.claude.com/docs/en/hooks), accessed 2026-07-13).

**Two hard mechanics caveats (both verified):**

- **Exit code 2 does NOT reliably block Write/Edit.** Use JSON on stdout:
  `{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny","permissionDecisionReason":"..."}}`.
  A top-level `decision:"block"` is the wrong shape for PreToolUse and silently does nothing.
  ([anthropics/claude-code#13744](https://github.com/anthropics/claude-code/issues/13744),
  "PreToolUse hooks with exit code 2 don't block Write/Edit operations", CLOSED, created 2025-12-12
  -- verified via `gh` 2026-07-13.)
- **A hook block can leave Claude idle instead of adapting.** Reported: exit-code-2 blocks cause
  Claude to stop rather than read the reason and continue -- harmful in an autonomous multi-round
  sweep. ([anthropics/claude-code#24327](https://github.com/anthropics/claude-code/issues/24327),
  CLOSED, created 2026-02-09 -- verified via `gh` 2026-07-13.)

**The semantic ceiling (decisive):** a shell PreToolUse hook sees the tool input (`file_path`, new
content) -- NOT the semantic question "does this structure earn its keep?" To evaluate the *warrant*
it would have to spawn the reviewer itself, which just relocates Option 3 into the hook at **per-edit
cost** (every edit blocked pending a review round -- the ruinous case). What a hook does cheaply and
deterministically is a **syntactic invariant**: "does this edit touch an exported symbol, and is
there a recorded verdict?" -> deny if not.

**What it actually catches:** the exported-signature drive-through (fact 2, the **n=1** case), hard
and cheap. It does **not** catch the over-application failure (semantic, invisible to a syntactic
hook).

**Generalization:** Only the syntactic invariant generalizes (exported-symbol detection per
language). The warrant itself does not go through the hook.

**Maintenance:** Hook script + per-language exported-symbol detection + a verdict-recording protocol
the primary must populate. Non-trivial and carried across every release.

**ROI:** Low. It is the strongest *bind* but aimed at the weakest-evidenced failure -- a single
observed export drive-through (n=1). Building and maintaining a hard gate, working around two known
Claude Code bugs, to catch one observed instance is heavy machinery for a small, uncertain benefit.
It would rank higher only if the exported-signature case were reframed as a must-never-slip safety
invariant (data-loss / public-API-break) rather than a quality nicety -- which the current evidence
(n=1, judgment call) does not support.

---

### Option 2 -- Deterministic metric / threshold gate (linter-style, no LLM judgment)

**Does it bind?** Yes, if wired to block -- it is deterministic and computed. But *binding* is not the
problem; *measuring the right thing* is.

**The fatal false negative (verified across multiple sources):** cognitive and cyclomatic complexity
are computed **per function**, counting control-flow branches within a unit. Splitting a switch into a
4-class polymorphic hierarchy -- the exact over-application failure -- **lowers** each unit's score
while **adding** structure. The metric green-lights the over-engineering:

> "Converting a short if/else into an abstract hierarchy can improve a metric while making the code
> harder to navigate." "When structural simplification introduces problems like too many classes or
> indirection, the metric provides no warning."
> ([LinearB, "Cyclomatic Complexity explained"](https://linearb.io/blog/cyclomatic-complexity), accessed 2026-07-13;
> corroborated by [Sourcegraph](https://sourcegraph.com/blog/cyclomatic-complexity-what-it-is-and-how-to-reduce-it) and
> [getDX](https://getdx.com/blog/cyclomatic-complexity/), both accessed 2026-07-13.)

Cyclomatic complexity "does not capture readability, architecture, documentation, or abstraction
quality" -- it is structurally incapable of flagging the trade the warrant exists to catch.

**The alternative deterministic signal fails the other way:** gate on *added class/file count > 0*
and you catch the 4-class hierarchy -- but you also fire on every legitimate Extract Function, Extract
Class, and Introduce Parameter Object, which are the skill's bread-and-butter warranted additions.
That is a false-positive firehose on a refactoring tool whose job is often to add well-warranted
structure. Either calibration (complexity-delta or count) is wrong for a *judgment* call: the warrant
turns on whether the removed cost is *present and larger*, which no threshold measures.

**A partial exception, noted for fairness:** Java-only tools encode an "Unnecessary Abstraction"
smell (Designite) -- the closest deterministic analog. But it detects on *existing* code, not a
*proposed diff*; it is Java-only; and the skill spans TS/JS/Python and more
(`260712-n5o-RESEARCH-warrant-generalization.md` section c, 2026-07-13).

**Cost / latency:** Runtime is cheap (a linter run, seconds, deterministic -- no LLM tokens). But
**build and maintenance are the highest of any option**: per-language complexity tooling, threshold
tuning, and AST diffing of the *proposed* change (metrics run on files, not on a hypothetical edit),
all maintained across ~120 refactorings and multiple languages in a distributed plugin.

**Generalization:** Poor. Metrics and thresholds are per-language and per-metric; the warrant is a
single cross-language principle. The mismatch is fundamental.

**ROI:** Lowest. It is the only option that is *both* expensive to build/maintain *and* structurally
blind (false negative) to the primary failure -- or a false-positive firehose under the other
calibration. Deterministic enforcement is the right shape for a mechanical invariant; it is the wrong
shape for a net-cost judgment.

---

## A sixth option, for completeness: the layered stack (prior research's proposal)

The prior `260712-n5o-RESEARCH-warrant-generalization.md` (section f) recommended *layering* prose
(1) + targeted agent (3) + a hook backstop (4). Evaluated neutrally against the ROI context here,
**the full stack is over-built for this failure profile.** Layering multiplies build, maintenance,
and per-sweep cost; it is justified when getting the decision wrong is expensive and frequent. Here
the decisions are infrequent judgment calls on a strong base (facts 1-2), so the stack pays three
costs to reduce a small risk. It is not the ROI winner. If any active mechanism is added at all, a
*single* targeted agent consult (Option 3) captures most of the available signal without the hook's
build cost or the metric's blindness.

---

## Ranking rationale in one paragraph

The achievable benefit is capped low (strong base, infrequent judgment failures), so ROI is
cost-dominated, and the tie-breaker is *signal-to-failure match*. Option 5 wins because it spends
nothing and the failures it leaves are the ones no cheap mechanism catches anyway. Option 1 is free
but empirically inert as a bind, so it collapses into 5. Option 3 is the only active mechanism whose
signal (independent judgment) matches the failure type (judgment calls) -- moderate ROI, worth it
only if the residual rate is unacceptable, and only if gated to add-structure/export moments. Option
4 binds hardest but only on a syntactic invariant that maps to the single n=1 failure -- heavy for
that. Option 2 is last: expensive to build and structurally blind to the exact failure (or a
false-positive firehose), because a numeric threshold cannot evaluate a net-cost judgment.

---

## Recommendation (ROI-based)

**Default: Option 5 -- add no enforcement mechanism.** Keep the general warrant rubric as guidance,
keep the auto-trigger (the skill's one proven, generalizing win), and rely on the strong base model.
The evidence points here: the base is already at or above skill parity, the failures are infrequent
judgment calls, a prose gate already failed to bind, and none of the cheaper deterministic options
(metric gate, syntactic hook) can catch the primary over-application failure. Spending build,
runtime, or maintenance budget to chase a small, infrequent, judgment-shaped risk is negative ROI on
this evidence.

**Conditional escalation, if and only if the eval later shows the residual failure rate is
unacceptable:** add exactly ONE mechanism -- **Option 3, a single independent reviewer agent, tightly
gated to fire only at the "about to ADD STRUCTURE" moment** (and optionally the exported-symbol
moment). It is the only mechanism whose signal type matches the failure type, it works with the same
base model, and gated to judgment moments it stays affordable on a whole-package sweep. Do not build
it pre-emptively -- gate the decision on an eval that first proves the failure rate matters.

**Do not build Option 2 or Option 4 on current evidence.** Option 2 is blind to the over-application
failure (verified) and expensive to maintain across languages. Option 4 hard-binds only the n=1
syntactic case and requires working around two known Claude Code hook bugs. Revisit Option 4 only if
the exported-signature case is reclassified as a must-never-slip safety invariant.

**Confidence:** MEDIUM on the ranking. The mechanics of each option are HIGH-confidence and verified;
the ranking rests on a small observed failure sample (n=1 to n=3) and the judgment that its benefit
ceiling is low. If a larger eval raises the observed failure frequency materially, Option 3's ROI
improves and could overtake Option 5.

---

## Sources (URL + access date)

**Verified (HIGH):**
- Huang et al., "Large Language Models Cannot Self-Correct Reasoning Yet," ICLR 2024 --
  [arXiv:2310.01798](https://arxiv.org/abs/2310.01798) (verified via arXiv + Semantic Scholar, 668
  citations; accessed 2026-07-13). Grounds Option 1's failure to bind.
- Claude Code hooks reference (PreToolUse `permissionDecision:"deny"`, plugin `hooks.json`) --
  [https://code.claude.com/docs/en/hooks](https://code.claude.com/docs/en/hooks) (accessed 2026-07-13).
- anthropics/claude-code#13744, "PreToolUse hooks with exit code 2 don't block Write/Edit
  operations," CLOSED, created 2025-12-12 --
  [https://github.com/anthropics/claude-code/issues/13744](https://github.com/anthropics/claude-code/issues/13744)
  (verified via `gh` 2026-07-13).
- anthropics/claude-code#24327, "PreToolUse hook exit code 2 causes Claude to stop instead of acting
  on error feedback," CLOSED, created 2026-02-09 --
  [https://github.com/anthropics/claude-code/issues/24327](https://github.com/anthropics/claude-code/issues/24327)
  (verified via `gh` 2026-07-13).
- Cyclomatic/cognitive complexity is blind to over-abstraction (Option 2's false negative) --
  [LinearB](https://linearb.io/blog/cyclomatic-complexity),
  [Sourcegraph](https://sourcegraph.com/blog/cyclomatic-complexity-what-it-is-and-how-to-reduce-it),
  [getDX](https://getdx.com/blog/cyclomatic-complexity/) (all accessed 2026-07-13).

**Subagent cost/latency (MEDIUM -- community measurement + Anthropic guidance):**
- MindStudio, "Claude Code Sub-Agents Explained: Context, Cost, and Parallel Execution" (~20k
  bootstrap, 4-7x token multiplier, fan-out 121k->513k) --
  [https://www.mindstudio.ai/blog/claude-code-sub-agents-explained](https://www.mindstudio.ai/blog/claude-code-sub-agents-explained)
  (accessed 2026-07-13).
- Anthropic, "How and when to use subagents in Claude Code" --
  [https://claude.com/blog/subagents-in-claude-code](https://claude.com/blog/subagents-in-claude-code)
  (accessed 2026-07-13).
- anthropics/claude-code#13898 (`tools:` frontmatter strips MCP tools) --
  [https://github.com/anthropics/claude-code/issues/13898](https://github.com/anthropics/claude-code/issues/13898)
  (accessed 2026-07-13).

**Project-internal evidence (HIGH -- this repo, 2026-07-13):**
- `260712-n5o-SUMMARY.md` -- base-model parity, null value-delta across 6 scenarios, auto-trigger 8/8.
- `260712-n5o-RESEARCH.md` -- the diagnosed compliance gap (prose veto lost); Option 1 falsification.
- `260712-n5o-RESEARCH-warrant-generalization.md` -- warrant distillation, GitHub/tool survey,
  layered-stack proposal (the sixth option), plugin hook mechanics.
- MEMORY `unbiased-review-beats-primed.md` -- fresh/blind reviewer beats primed self-review.

**Adjacent / unverified (LOW -- cited by prior research, flagged as future-dated arXiv IDs; NOT
relied on here):**
- "When 'Better' Prompts Hurt" [arXiv:2601.22025](https://arxiv.org/html/2601.22025v1),
  "Self-Correction Illusion" (2606.05976), "Cross-Context Review" (2603.12123) -- [ASSUMED]. The
  direction (intrinsic self-correction weak, independent review stronger) is independently supported
  by the VERIFIED Huang 2310.01798; these specific preprint IDs were not verified in this session and
  the SUMMARY flags them as needing verification.

## Metadata

- Mechanism mechanics (hooks, agent cost, metric blindness): HIGH -- official docs + verified issues +
  multiple industry sources.
- ROI ranking: MEDIUM -- design judgment over a small observed failure sample (n=1 to n=3); would
  shift if eval-measured failure frequency rises.
- Valid until: ~2026-08-13 (recheck the two hook bugs' status and subagent cost multipliers if Claude
  Code major-versions).
