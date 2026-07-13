# Research: A General, Refactoring-Agnostic Warrant Test + Its Enforcement

**Researched:** 2026-07-13
**Domain:** Software-design cost/benefit judgment; LLM instruction + enforcement design for a refactoring coach
**Question:** One warrant test that binds across ALL ~120 refactorings + patterns -- "does this earn its keep, or is it over-engineering?" -- NOT a per-case rule; PLUS how to make that warrant actually BIND (enforcement mechanism) and WHERE to consult an independent reviewer (targeted multi-point consultation).
**Confidence:** HIGH on the authoritative distillation; MEDIUM on the LLM-generalization + independence claims (best-practice + adjacent empirical, not a controlled study of the exact claims).

**Sections:** (a) distilled warrant -- (b) authoritative grounding -- (c) GitHub/tool survey -- (d) refactoring-agnostic rewrite -- (e) keeping the rubric binding -- (f) enforcement: prose vs agent-consult vs hook-gate -- (g) targeted multi-point consultation.

---

## (a) The distilled GENERAL warrant test

> **A refactoring or pattern earns its keep only when it removes more complexity than it adds.**
> It must eliminate a *concrete, present* cost -- duplication across two or more sites, coupling,
> obscurity, or branching a reader has to hold in their head -- and that removed cost must be
> larger than the new structure it introduces (types, classes, files, indirection, interfaces).
> If you cannot name the present complexity removed, or the structure added is not clearly smaller
> than what it hides, decline and keep the simpler form.

**Net-cost framing (the one inequality behind every case):**

```
warranted  iff  complexity_removed  >  complexity_added
                (present duplication,      (new types, classes, files,
                 coupling, obscurity,       indirection, interfaces the
                 branching a reader          reader must now learn)
                 must hold in the head)

decline    iff  the delta is >= 0, OR complexity_removed is only anticipated
                ("might diverge", "could grow") rather than present now.
```

This is Ousterhout's deep-module test applied to the *change itself*: the structure a refactoring
adds is an "interface" the reader must learn; it is justified only when it is strictly simpler than
the "implementation" complexity it hides or removes. A shallow change -- one whose added structure
is not much smaller than what it removes -- is pure cost, exactly like a shallow module.

**Why this subsumes the polymorphism failure as an instance, not a special rule.** Given
"Conditional Complexity over 4 trivial type codes -> Replace Conditional with Polymorphism," the
test runs the accounting: REMOVES = nothing (one localized switch, no duplication across sites, no
genuinely divergent per-case behavior); ADDS = 4 class definitions + dispatch indirection.
`removed (~0) > added (4 classes)` is false -> DECLINE. No clause mentions polymorphism or a type
count; the general inequality produces the verdict. The same inequality declines a Decorator that
wraps one method (Ousterhout's own example of a shallow module), a Strategy for a single algorithm,
a Factory for one product, or an Extract Class that just moves two fields -- and it *approves*
Extract Function over duplication at 3 sites, an Introduce Parameter Object over a data clump in 5
signatures, or a Strategy when the algorithms genuinely vary at runtime. One test, every case.

---

## (b) Authoritative grounding

Every source below converges on the same inequality from a different vocabulary. That convergence
is the evidence that the warrant is general rather than an artifact of one author.

### 1. Ousterhout -- "A Philosophy of Software Design" (2018, 2nd ed. 2021)

- **Complexity = dependencies + obscurity**, and complexity is *anything that makes software hard
  to understand and modify*. The goal of design is to reduce **total** complexity of the system.
- **Deep vs shallow modules:** the benefit of a module is its functionality, the cost is its
  interface. The best modules are deep -- a simple interface hiding a lot of implementation. A
  **shallow module, whose interface is not much smaller than its implementation, "does not provide
  much value"** and is a design smell.
- **The signature question:** *"the interface of some functionality should be a lot simpler than
  its implementation."* Applied to a refactoring, the added structure is the interface; the removed
  complexity is the implementation it hides. He explicitly criticizes patterns that fail this --
  e.g. he is "not a fan of the decorator pattern" (thin classes adding little while delegating
  most work).
- Source: https://web.stanford.edu/~ouster/cgi-bin/aposd.php (book page); summary corroborated
  2026-07-13 via https://www.mattduck.com/2021-04-a-philosophy-of-software-design.html and
  https://henrikwarne.com/2021/07/12/book-review-a-philosophy-of-software-design/ . Confidence: HIGH.

### 2. Sandi Metz -- "The Wrong Abstraction" (blog, 2016-01-20; RailsConf 2014)

- *"Duplication is far cheaper than the wrong abstraction."* An abstraction extracted too early
  becomes a conditional-magnet: each new near-fit adds a parameter and a branch, and the accumulated
  cost exceeds the duplication it removed.
- Operational rule from the essay: when an abstraction is proved wrong, **re-introduce duplication**
  (inline it back) -- i.e. the net-cost sign has flipped, so reverse the change. This is the warrant
  test running in the AWAY direction.
- Source: https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction (accessed 2026-07-13).
  Confidence: HIGH.

### 3. Kent C. Dodds -- AHA / "Avoid Hasty Abstractions" (blog, 2019)

- Built directly on Metz: *"prefer duplication over the wrong abstraction,"* and **"optimize for
  change first."** Don't abstract on the first (or even second) sighting; wait until the shape of
  the variation is known, because a premature abstraction locks in the wrong structure.
- Source: https://kentcdodds.com/blog/aha-programming (accessed 2026-07-13). Confidence: HIGH.

### 4. Kent Beck -- Four Rules of Simple Design + YAGNI (Extreme Programming, late 1990s)

- Rules in priority order: (1) passes the tests, (2) reveals intention, (3) no duplication,
  (4) **fewest elements**. Rule 4 is the tie-breaker whose whole job is to **prevent
  over-engineering**: remove any class/method/abstraction that isn't earning its place.
- **YAGNI** ("You Aren't Gonna Need It"): don't introduce abstraction or structure for a need that
  is speculative rather than present. This is exactly the warrant's "present, not anticipated"
  clause on the `complexity_removed` side.
- Sources: https://martinfowler.com/bliki/BeckDesignRules.html and
  https://martinfowler.com/bliki/Yagni.html (accessed 2026-07-13). Confidence: HIGH.

### 5. Martin Fowler -- Rule of Three + refactoring workflows + "recoup the investment"

- **Rule of Three** (attributed to Don Roberts): do it once, wince the second time, refactor on the
  third. A threshold that says "abstract only when the *present* recurrence justifies it."
- **When to refactor:** preparatory ("make the change easy, then make the easy change"),
  comprehension, and litter-pickup -- all tied to a *present* need in the work at hand. The gate:
  *"Don't refactor unless you think you will recoup your investment later by quicker work."* That
  is the net-cost inequality stated as an economic one.
- Sources: https://martinfowler.com/articles/workflowsOfRefactoring/ and
  https://martinfowler.com/bliki/RuleOfThree.html (accessed 2026-07-13). "Is Design Dead?"
  (https://martinfowler.com/articles/designDead.html) makes the same anti-speculation argument.
  Confidence: HIGH.

### 6. Joshua Kerievsky -- "Refactoring to Patterns" (2004), over- vs under-engineering

- **Over-engineering: "making code more flexible or complicated than it *needs* to be."** His own
  cautionary tale is racing to Strategy when a conditional would do -- the exact failure the skill
  must prevent, named by the author of 23 of the catalog's refactorings.
- **Patterns are a destination, not a starting point:** *"patterns are where you want to be;
  refactorings are ways to get there from somewhere else."* You refactor *toward* a pattern when a
  present smell demands it, never toward one speculatively. This is why the warrant keys on present
  complexity removed.
- Source: https://martinfowler.com/books/r2p.html ; preface PDF
  https://courses.cs.duke.edu/compsci308/current/readings/kerievsky_preface.pdf (accessed
  2026-07-13). Confidence: HIGH.

**Synthesis.** Six independent authorities, one inequality: add structure only when it removes more
present complexity than it introduces. Ousterhout gives the measurable form (interface simpler than
implementation / reduce total complexity); Metz + Dodds give the failure mode (wrong abstraction
costs more than duplication); Beck gives the tie-breaker (fewest elements / YAGNI); Fowler gives the
trigger threshold (rule of three / recoup the investment); Kerievsky names the disease
(over-engineering = more flexible/complicated than *needed*).

---

## (c) GitHub / tool survey: how real tools encode this GENERALLY

Two families appear in the wild. **LLM refactoring agents** encode a prose principle
("is this actually simpler? / rule of three / duplication is cheaper than the wrong abstraction").
**Metric-based detectors** encode the same idea as a numeric threshold on a comprehension metric --
they flag a structure only when its measured cost crosses a line, which is the quantified analog of
"net cost is positive, so change it." Neither family enumerates per-pattern rules.

### LLM refactoring agents / skills (prose warrant)

| Repo | File | General heuristic it encodes |
|------|------|------------------------------|
| `CloudAI-X/claude-workflow-v2` | `agents/refactorer.md` | Post-change gate: **"Is this actually simpler? -- If the new code is harder to understand, revert."** Plus: **"Follow the Rule of Three. Duplication is cheaper than the wrong abstraction. When you do abstract, extract the simplest thing that works."** A named "Premature abstraction / WRONG" anti-pattern warns against abstracting on first sighting. |
| `DTeam-Top/vscode-docpilot` | `llm-skills/refactor.md` | "When to Refactor" is threshold-gated: **Rule of Three**; **"Speculative Generality -- Remove unnecessary abstractions added 'just in case.'"** (The AWAY direction, matching Metz's inline-it-back.) |
| `yurirxmos/opencode-refactor-agent` | `README.md` | Frames the agent as behavior-preserving, incremental, low-risk -- "improve code quality *without changing features*." Anchors the warrant on internal-quality delta, not feature addition (Fowler's "two hats"). |
| `alphaparkinc/genpark-codebase-refactoring-agent-skill` | `SKILL.md` | Claude skill that "scans, runs standard audits, and proposes drop-in refactoring" -- routes through audit metrics before proposing (metric-gated, see below). |
| `kentcdodds/old-kentcdodds.com` | `content/blog/aha-programming/index.mdx` | Canonical AHA source in a repo -- the "prefer duplication over the wrong abstraction / optimize for change first" principle as shipped text. |

Repo URLs: https://github.com/CloudAI-X/claude-workflow-v2 ,
https://github.com/DTeam-Top/vscode-docpilot , https://github.com/yurirxmos/opencode-refactor-agent ,
https://github.com/alphaparkinc/genpark-codebase-refactoring-agent-skill ,
https://github.com/kentcdodds/old-kentcdodds.com (all accessed via `gh` API 2026-07-13).

**Key finding:** the best-encoded LLM warrant in the wild is `CloudAI-X`'s single post-hoc question
-- *"Is this actually simpler? If not, revert"* -- a general net-cost test, not a per-refactoring
rule. It is the prose twin of the inequality in (a).

### Metric-based detectors / linters (numeric threshold = quantified net-cost gate)

These tools never list "when to apply Strategy." They compute a comprehension-cost metric and flag
only when it crosses a threshold -- and, crucially, a suggested refactoring is worth doing only if
it lowers that metric without raising another. That before/after comparison IS the net-cost test.

| Tool | General metric + threshold | Repo / doc URL |
|------|----------------------------|----------------|
| **SonarQube / SonarLint** | **Cognitive Complexity of a function should not exceed 15** (rule `java:S3776`, tagged `brain-overload`); message literally says "Refactor this function to reduce its Cognitive Complexity from X to the 15 allowed." Measures nesting + branching the reader must hold in their head -- Ousterhout's obscurity, quantified. | https://rules.sonarsource.com/java/RSPEC-3776/ (accessed 2026-07-13) |
| **ESLint** | `complexity` default **max 20** (cyclomatic); `max-depth` **4**; `max-lines-per-function` **50**; `max-statements` **10**. Flags structure only past the bound; below it, leave it alone (no speculative extraction). | https://eslint.org/docs/latest/rules/complexity (accessed 2026-07-13) |
| **Sourcery** (Python) | Blends **complexity + method length + working memory** into one **quality score (0-100)** and suggests a refactoring only when it produces a diff that *raises* the score. Explicit before/after net-cost gate on a comprehension metric ("working memory" = variables/attributes/calls the reader must track). | https://docs.sourcery.ai/Reference/Code-Quality/ ; https://www.sourcery.ai/blog/measuring_working_memory (accessed 2026-07-13) |
| **Reek** (Ruby) | Smell detectors with configurable thresholds -- e.g. `TooManyStatements` default **5**, `TooManyMethods`, `DataClump`, `ControlParameter`. A smell fires only past a count; the fix is warranted because it drops the count. | https://github.com/troessner/reek (accessed 2026-07-13) |
| **PMD** design rules | `CyclomaticComplexity`, `ExcessiveClassLength`, `GodClass`, `LawOfDemeter`, `CouplingBetweenObjects` -- all numeric-threshold design smells; the refactoring is justified by pulling the number back under the bound. | https://pmd.github.io/latest/pmd_rules_java_design.html (accessed 2026-07-13) |
| **Designite / Designite Java** | Detects design smells (e.g. Cyclic-Dependency, Unnecessary Abstraction, Deep Hierarchy) via metric thresholds; **"Unnecessary Abstraction"** is a first-class smell -- a coded form of Beck's fewest-elements / YAGNI (an abstraction that removes nothing is itself a smell). | https://www.designite-tools.com/ (accessed 2026-07-13) |

**Cross-family conclusion.** Whether prose ("is this actually simpler? revert if not") or numeric
(cognitive complexity > 15; quality score must rise), every real tool gates on a *single general
cost/benefit signal*, not a lookup table of "apply pattern X when Y." Two tools -- Designite's
"Unnecessary Abstraction" and docpilot's "Speculative Generality" removal -- even encode the AWAY
direction as a first-class smell, confirming the warrant is symmetric (add structure when it pays;
remove structure when it doesn't).

---

## (d) Concrete, refactoring-AGNOSTIC rewrite proposal for the skill's step-4 warrant

**Context -- what step 4 says today** (`plugins/lz-tdd/skills/lz-refactor/SKILL.md`, lines 61-81):
it already carries the right instinct ("APPLY only when ... real duplication across two or more
sites, or genuinely divergent per-case behavior, AND the pattern removes more than it adds"), but
(i) it hard-codes a *polymorphism-specific* worked DECLINE example, and (ii) its APPLY criterion
enumerates two removal types (duplication / divergence) that read as the whole list -- so a
refactoring whose payoff is *obscurity reduction* (Extract Function on a tangled 40-line method with
no duplication) doesn't obviously fit either named slot. The rewrite generalizes the payoff to
*any* complexity removed and makes the accounting a forced, emitted line.

**Proposed general warrant (drop-in replacement for the APPLY/DECLINE logic in step 4).** State the
principle once, force the accounting, let the verdict fall out:

> **Warrant test (applies to every refactoring and pattern, both catalog and de-patterning
> directions):** a change earns its keep only when it removes more complexity than it adds. Before
> any code, emit one accounting line per candidate:
>
> `<Refactoring/Pattern> | REMOVES: <the concrete, PRESENT complexity eliminated -- name the
> duplicated sites, the coupling, the obscurity, or the branching a reader must hold in their head>
> | ADDS: <the new structure -- count the types, classes, files, indirection, interfaces the reader
> must now learn> | VERDICT: APPLY (removed > added) | DECLINE (added >= removed, keep <simpler
> form>)`
>
> Rules that make the line honest:
> - **REMOVES must be present, not anticipated.** "Might diverge later," "could grow," or "in case
>   we add more" is not a removal -- it is speculation, and speculation is a DECLINE (YAGNI / rule
>   of three: wait until the third real case).
> - **Naming the smell is not a removal.** "Removes the conditional complexity" describes the label,
>   not a cost eliminated; the REMOVES field must point at something concrete a reader stops having
>   to track.
> - **A candidate with an empty or speculative REMOVES field is a DECLINE by construction** -- the
>   inequality cannot hold when nothing is removed.
> - **Default to the simplest form that removes the smell**: keep the switch, use a discriminated
>   union, or dissolve the pattern via a functional idiom. Reach for added structure only when the
>   line shows it pays.
> - **AWAY direction is the same test in reverse:** if an existing structure's ADDS already exceeds
>   its REMOVES (a wrapper that hides nothing, an abstraction whose callers all pass flags -- Metz's
>   wrong abstraction), refactor it away (Inline, functional dissolution), gated by the same intent
>   routing.

**Worked instances the ONE test produces (illustrative, not an enumeration to memorize):**

- `Replace Conditional with Polymorphism | REMOVES: nothing (one localized switch over 4 trivial
  type codes, no duplication across sites, cases not genuinely divergent) | ADDS: 4 class
  definitions + dispatch indirection | VERDICT: DECLINE -- keep the switch / discriminated union.`
  (The former hard-coded special case, now just the general inequality computed.)
- `Extract Function | REMOVES: a 3-site duplicated block + obscurity of a 40-line method | ADDS: 1
  named function | VERDICT: APPLY.`
- `Introduce Parameter Object | REMOVES: a data clump repeated across 5 signatures | ADDS: 1 type |
  VERDICT: APPLY.`
- `Decorator | REMOVES: nothing (wraps one method) | ADDS: a thin class whose interface ~= its
  implementation | VERDICT: DECLINE.` (Ousterhout's own shallow-module example.)

Note none of these instances is a rule in the skill -- each is the same `REMOVES vs ADDS` line
evaluated on a different candidate. Adding a 121st refactoring needs no new clause.

---

## (e) How to keep the RUBRIC binding (in-model self-check)

The reason step-4 over-applied polymorphism is that "candidate identified" silently became "pattern
applied" -- the model pattern-matched a smell to a pattern and skipped the accounting. Three
mechanics keep the general test binding within the primary model, without per-pattern enumeration:

1. **Force the accounting as emitted output, gated before code.** The `REMOVES: ... | ADDS: ... |
   VERDICT: ...` line must be produced *before* any edit (the skill already gates verdict-before-code
   via CCH-02/CCH-06). A model will not skip a step it must write down; making the two sides of the
   inequality explicit fields forces the comparison instead of asserting a conclusion.
2. **Make "nothing removed" a structural DECLINE.** Because APPLY requires the REMOVES field to name
   a present cost strictly larger than ADDS, an empty/speculative REMOVES cannot yield APPLY. This
   closes the loophole ("removes the conditional complexity") without naming any specific pattern.
3. **Close the loop at the end.** The skill's step-5 already says "verify every pattern you
   introduced carries an APPLY verdict naming what it removes." Keep that: it re-runs the same test
   as an exit check, so an unwarranted structure that slipped in must be justified or refactored away.

**Why a stated principle + rationale beats an enumerated per-case list -- for LLMs specifically
(research Q4).** A rule tells the model *what* to do in a named case; a rationale gives the *intent*,
which it extrapolates to the ~120 cases the list never enumerated. Practitioner guidance is explicit:
*"every instruction becomes more powerful when backed by reasoning ... it helps the model make better
decisions in edge cases,"* and absolute/rigid instructions "often lead to rigid, unhelpful responses"
that break on the unanticipated case
(https://medium.com/@rajnish_khatri/prompt-engineering-battle-tested-rules-for-working-with-llms-8160dcad90d6,
accessed 2026-07-13). Adjacent empirical work reinforces the failure mode of rule-piling: adding a
generic-rules system wrapper *degraded* task accuracy by ~10-13% because the generic rules collided
with task-specific constraints (https://arxiv.org/html/2601.22025v1, "When 'Better' Prompts Hurt,"
accessed 2026-07-13), and separate work notes LLMs' literal inferential rule-following is "far from
satisfactory" (https://arxiv.org/pdf/2407.08440, accessed 2026-07-13) -- so a long rigid list is both
brittle and unreliably applied. A single principle the model can *reason from* ("remove more than you
add; name what you removed") transfers to every refactoring, including ones not yet in the catalog,
and matches this repo's prior finding that rigid rule lists miss unanticipated cases while
rule-plus-why generalizes.

*Confidence on Q4: MEDIUM -- the strongest "principle-with-rationale generalizes better" phrasing is
practitioner best practice; the supporting empirical results are adjacent (rule-piling harms,
literal rule-following is fragile) rather than a controlled test of this exact claim. Confirm via
the skill's own eval, which is the mechanism that surfaced the polymorphism over-application.*

**Limit of the in-model self-check.** (e) is still self-critique in the *same* context by the *same*
model that just chose the pattern -- so it inherits anchoring bias (see (f)). It raises the floor but
does not guarantee the bind; that is what the independent consult and the hook add.

---

## (f) Enforcement: prose self-check vs skill-instructed agent-consult vs hook-forced reviewer-gate

The warrant in (a) is only as strong as whatever makes the model actually run it. There are three
binding mechanisms, weakest to strongest; the recommendation is to **layer** them so bindingness
scales with the cost of getting the decision wrong.

### Mechanism 1 -- Prose self-check (mechanism of (e); what step 4 does today)
The skill tells the primary to emit the REMOVES/ADDS/VERDICT line. **Soft:** same model, same
context, self-critique -- exactly the compliance gap that produced the polymorphism over-application.
An LLM that just selected a pattern has already *committed* to it: research on anchoring shows "the
agent that generated an answer has already committed to a line of reasoning, making it less likely
to spot the fundamental weaknesses of its own approach"; simple in-context tricks (Chain-of-Thought,
Reflection) are "insufficient" to break the anchor (https://arxiv.org/html/2606.05976 "The
Self-Correction Illusion"; https://arxiv.org/html/2603.12123 "Cross-Context Review"; accessed
2026-07-13). Cheapest (0 extra calls), weakest bind.

### Mechanism 2 -- Skill-instructed independent agent-consult (spawn a reviewer via the Task/Agent tool)
The skill instructs the primary: *before* applying an ADD-STRUCTURE change, spawn a **reviewer agent
in a FRESH context** whose rubric is the warrant from (a); it returns APPLY/DECLINE + the REMOVES/ADDS
accounting, blind to what the primary was inclined to do.
- **Independence payoff, and it works with the SAME base model.** The key empirical result: LLMs
  "correct others but not themselves" -- a fresh-context critic that does not know it produced the
  artifact escapes the anchoring, sycophancy, and self-preference biases that cripple in-context
  self-critique (https://arxiv.org/html/2606.05976 ; https://arxiv.org/html/2603.12123 , accessed
  2026-07-13). So Opus-reviewing-Opus adds real signal **as long as the reviewer's context is fresh
  and blind** -- you do NOT need a different or stronger model. *Caveat:* naive multi-agent critique
  with same-model copies sharing context can perform "no better than self-consistency" because
  identical models share error distributions; the fix is genuine context separation (blind, fresh
  session), not more copies. This repo's own finding agrees: "unbiased review beats primed -- always
  include >=1 reviewer with a neutral from-scratch brief; primed reviewers confirm your assumptions
  and miss bugs" (MEMORY: `unbiased-review-beats-primed.md`).
- **`allowed-tools` implication.** A skill that must spawn a reviewer needs the **Task/Agent tool
  available**. If the skill (or the reviewer agent) declares a restrictive `tools:`/`allowed-tools`
  frontmatter, be aware of the upstream bug where a `tools:` restriction on an agent strips MCP tools
  (anthropics/claude-code#13898). For v1 the safe path is: do not over-restrict; ensure Task is
  permitted; define the reviewer as its own agent file (e.g. `agents/refactoring-reviewer.md`) so it
  loads a genuinely fresh context.
- **Still SOFT.** A skill instruction to "spawn the reviewer" can be skipped by the model just like
  a prose veto -- the compliance gap persists, though it is smaller because an explicit "spawn X"
  step is more salient than "consider Y."
- **Cost:** +1 agent round-trip per consult; latency. Affordable only if consults are *targeted*
  (section (g)).

### Mechanism 3 -- Hook-forced reviewer-gate (PreToolUse hook blocks Edit/Write)
A **plugin-bundled** PreToolUse hook (`<plugin>/hooks/hooks.json`, matcher `Edit|Write|MultiEdit`)
runs before every matching tool call and can **deny** it. **Hard gate:** the model cannot edit
without passing.
- **Distribution advantage over git hooks.** Claude Code plugin hooks are bundled and load *with the
  plugin* via `${CLAUDE_PLUGIN_ROOT}/hooks/hooks.json` (verified shape from a real plugin:
  `czlonkowski/n8n-skills` `hooks/hooks.json`, which registers `PreToolUse` matchers pointing at
  `${CLAUDE_PLUGIN_ROOT}/hooks/pre-tool-use/*.sh`). This is the crucial distinction from *git* hooks
  (e.g. `wolfhead/claude-code-review-hook`, a `.git/hooks/commit-msg` reviewer) which are per-clone
  and never auto-installed -- the "hooks are per-clone" caveat does **not** apply to plugin hooks.
- **Blocking mechanism -- use JSON, not exit code 2.** For Edit/Write, exit code 2 is documented as
  **buggy** (anthropics/claude-code#13744: hook runs, prints stderr, but the file is written anyway;
  closed as duplicate, still reported). The reliable channel is JSON on stdout:
  `{"hookSpecificOutput":{"hookEventName":"PreToolUse","permissionDecision":"deny",
  "permissionDecisionReason":"..."}}`. Note: a top-level `decision:"block"` is the *wrong* shape for
  PreToolUse and silently does nothing; and hook decisions never bypass a user `deny`/`ask`
  permission rule (https://code.claude.com/docs/en/hooks , accessed 2026-07-13).
- **Cost/semantics limit.** A shell PreToolUse hook sees the tool input (`file_path`, new content),
  not the semantic question "am I adding structure?" To evaluate the *warrant* it would have to spawn
  the reviewer itself -- which just relocates mechanism 2 into the hook at *per-edit* cost (every
  Edit blocked pending a review round -- ruinous on a whole-package sweep). What a hook does cheaply
  and deterministically is a **syntactic invariant check**: e.g. "does this edit touch an exported
  symbol, and is there a recorded verdict for it?" -> deny if not.

### Recommendation (f): layer the three, matching cost to bindingness
1. **Always-on:** the prose self-check (mechanism 1 / section (e)) for the mechanical majority. Cheap,
   and Opus is reliable on mechanical steps.
2. **At the judgment gates only:** the skill-instructed independent reviewer (mechanism 2). Its
   fresh/blind context breaks the anchoring that caused the over-application, and same-base-model
   review is sufficient -- keeping it affordable. *Which gates: section (g).*
3. **One hard backstop, not a blanket gate:** a PreToolUse hook (mechanism 3) that blocks an
   Edit/Write touching an **exported / public-API symbol** unless a blast-radius verdict is recorded.
   This is cheaply, syntactically detectable (match the edit target against the package's exported
   symbols) and it structurally catches the exported-signature blast-radius failure without a review
   call per edit.

**Do NOT hook-force the warrant itself.** It is a semantic judgment a shell hook cannot evaluate
without spawning the reviewer anyway, so hooking it only raises per-edit cost. Hook-force the
mechanical, cheaply-checkable invariant (exported-symbol-touched -> require a verdict); agent-consult
the semantic one (does this structure earn its keep?). Net: the *soft* consult carries the semantic
load where it is affordable; the *hard* hook carries the one invariant that must never slip and is
cheap to check.

---

## (g) Targeted multi-point consultation: which workflow gates warrant an independent agent

### The mechanical / judgment split (the targeting principle)
Empirically (this skill's evals + Opus 4.8): the base model is **excellent at MECHANICAL steps** --
recognize a smell, route to a Fowler primitive, perform the extract, run the tests -- and
**inconsistent at JUDGMENT calls**: (i) does a pattern earn its keep / is this over-engineering;
(ii) blast-radius on an exported symbol; (iii) the refactor-vs-behavior-change seam. **Consult the
independent reviewer ONLY at the judgment gates; leave the mechanical majority to the primary.** This
is what keeps consultation affordable on a many-round whole-package sweep: consults scale with
*judgment-difficulty*, not with edit count.

### Precedent (why targeted consultation works, and what over-consulting costs)
- **lz-advisor** consults its advisor at exactly three moments -- **orient / when-stuck /
  final-review** -- not every step. Targeting works because those are the moments a fresh perspective
  can change the trajectory; a consult mid-mechanical-step would only echo the primary.
- **GSD** uses dedicated, fresh-context auditor agents at **phase GATES**, never per task:
  `gsd-verifier` (goal achievement), `gsd-security-auditor` (SECURITY.md), `gsd-nyquist-auditor`
  (validation), `gsd-code-reviewer` / `gsd-code-fixer` (review). The governing rule is that a gate
  with a dedicated auditor must be *reached by that auditor*, not self-certified by the orchestrator
  -- i.e. independence is mandatory precisely at the judgment gates. Over-consulting cost is explicit
  in the design: GSD does not spawn an auditor per task, only per phase gate; a per-task audit would
  multiply cost with zero signal gain on mechanical work.
- **This repo's finding:** "unbiased review beats primed" (MEMORY `unbiased-review-beats-primed.md`)
  -- the consult must be **blind** to the primary's choice, or it just confirms it.
- Sources: user's own lz-advisor + GSD systems (documented in project CLAUDE.md/MEMORY, 2026-07-13);
  independence evidence https://arxiv.org/html/2606.05976 , https://arxiv.org/html/2603.12123 .

### The cost/value curve on a multi-round sweep, and how to gate each consult
Consult **value** is roughly proportional to the judgment-difficulty of the decision and is ~0 for a
mechanical extract; consult **cost** is fixed (one agent round) per consult. So on an N-edit sweep,
consult-per-edit spends `N x cost` to buy only `(few judgment calls) x signal` -- most of the spend
buys nothing. Consult-per-judgment-gate spends `(few) x cost` for all the value. Gate each consult on
a cheap precondition the primary can self-check, so consults fire only on hard decisions:
- **about to ADD STRUCTURE** (introduce a pattern / class / interface / indirection -- not a rename
  or extract-in-place) -> **warrant** consult;
- **about to touch an EXPORTED / public-API symbol or a cross-package caller** -> **blast-radius**
  consult (the skill already pauses here in step 5);
- **uncertain whether a change preserves behavior** (a seam judgment) -> **seam** consult.
Mechanical edits below these triggers get **no** consult. Conveniently, the self-check line from (d)
*is* the trigger: a candidate whose line proposes ADD-STRUCTURE is exactly when the warrant consult
fires, so the rubric and the consult trigger are the same artifact.

### One reviewer with lenses vs separate specialized agents
**Recommend a SINGLE reviewer agent invoked with an explicit LENS argument (`warrant` |
`blast-radius` | `seam`)**, not three agent definitions. Rationale: (i) fewer agent files to keep in
sync with the six catalogs; (ii) the three judgments share the same context (the candidate change +
surrounding code), so one fresh-context read serves whichever lens is needed -- cheaper than three
cold starts; (iii) the independence signal comes from **fresh + blind context**, not from model
specialization (research Q2: same base model suffices; role-specialization adds some perspective
diversity but the dominant effect is the fresh/blind context). One agent, three lenses, invoked only
at the matching gate.

### Minimal consult set that would have caught BOTH observed failures
Two gated consult points -- no consult on the mechanical majority:

1. **PRE-STRUCTURE WARRANT consult** -- *trigger:* the primary's self-check line proposes an
   ADD-STRUCTURE change (a Kerievsky/GoF pattern candidate at step-4 APPLY). The reviewer, blind to
   the primary's inclination, applies the (a) rubric and returns APPLY/DECLINE with the REMOVES/ADDS
   accounting. **-> Catches the kata over-engineering:** it returns DECLINE on the 4-trivial-type
   polymorphism because REMOVES is empty.
2. **PRE-EXPORT BLAST-RADIUS consult** -- *trigger:* the primary is about to edit an exported /
   public-API symbol or a caller in another package. The reviewer assesses downstream consumers not
   covered by local tests. **-> Catches the exported-signature blast-radius failure.** This gate is
   *also* hook-backstopped (f, mechanism 3): "exported symbol touched" is cheaply detectable in a
   PreToolUse hook, so even if the model skips the soft consult, the hard gate denies the edit until
   a verdict exists.

Everything else -- Extract Function, Rename, Move, Inline, guard clauses, and the rest of the
mechanical sweep -- stays with the primary, no consult. **Two gated soft consults + one hard hook
backstop on the export case** is the minimal architecture that would have caught both observed
failures without taxing the mechanical majority.

### Composition with (a) and (f)
- **(a)** is the RUBRIC the pre-structure warrant reviewer applies.
- **(f) mechanism 1** (the primary's own REMOVES/ADDS line) runs for *every* candidate and doubles as
  the *trigger* for the warrant consult (fires only when the line proposes ADD-STRUCTURE).
- **(f) mechanism 2** (skill-instructed independent, fresh/blind, same base model) is HOW both
  consults run.
- **(f) mechanism 3** (PreToolUse hook, JSON `permissionDecision:"deny"`) backstops ONLY the
  export-blast-radius invariant -- the one thing that must never slip and is cheap to check.

This keeps the mechanical sweep at primary-only speed, spends an independent consult only on the two
judgment shapes the model is empirically unreliable at, and hard-gates just the single invariant a
shell hook can check without a review call.

---

## Sources (all accessed 2026-07-13)

**Primary -- design authorities (HIGH):**
- Ousterhout, *A Philosophy of Software Design* -- https://web.stanford.edu/~ouster/cgi-bin/aposd.php (corroborated: https://www.mattduck.com/2021-04-a-philosophy-of-software-design.html , https://henrikwarne.com/2021/07/12/book-review-a-philosophy-of-software-design/ )
- Metz, "The Wrong Abstraction" (2016-01-20) -- https://sandimetz.com/blog/2016/1/20/the-wrong-abstraction
- Dodds, "AHA Programming" -- https://kentcdodds.com/blog/aha-programming
- Beck design rules / YAGNI (via Fowler) -- https://martinfowler.com/bliki/BeckDesignRules.html , https://martinfowler.com/bliki/Yagni.html
- Fowler, "Workflows of Refactoring" / "Rule of Three" / "Is Design Dead?" -- https://martinfowler.com/articles/workflowsOfRefactoring/ , https://martinfowler.com/bliki/RuleOfThree.html , https://martinfowler.com/articles/designDead.html
- Kerievsky, *Refactoring to Patterns* -- https://martinfowler.com/books/r2p.html , https://courses.cs.duke.edu/compsci308/current/readings/kerievsky_preface.pdf

**Tool thresholds (HIGH):**
- SonarQube cognitive-complexity rule S3776 -- https://rules.sonarsource.com/java/RSPEC-3776/
- ESLint `complexity` (default 20) + related -- https://eslint.org/docs/latest/rules/complexity
- Sourcery quality metrics -- https://docs.sourcery.ai/Reference/Code-Quality/ , https://www.sourcery.ai/blog/measuring_working_memory

**GitHub survey -- refactoring agents/skills + hook mechanisms (accessed via `gh` API):**
- https://github.com/CloudAI-X/claude-workflow-v2 (`agents/refactorer.md` -- "is this actually simpler? revert" + rule of three)
- https://github.com/DTeam-Top/vscode-docpilot (`llm-skills/refactor.md` -- rule of three, speculative generality removal)
- https://github.com/yurirxmos/opencode-refactor-agent (behavior-preserving framing)
- https://github.com/alphaparkinc/genpark-codebase-refactoring-agent-skill (audit-gated Claude skill)
- https://github.com/kentcdodds/old-kentcdodds.com (`content/blog/aha-programming/index.mdx`)
- https://github.com/troessner/reek , https://pmd.github.io/latest/pmd_rules_java_design.html , https://www.designite-tools.com/ (threshold-based smell detectors; "Unnecessary Abstraction")
- https://github.com/czlonkowski/n8n-skills (`hooks/hooks.json` -- real plugin-bundled `PreToolUse` matchers via `${CLAUDE_PLUGIN_ROOT}`)
- https://github.com/wolfhead/claude-code-review-hook (git commit-msg reviewer -- contrast: per-clone git hook, not plugin-bundled)

**Enforcement + hooks (HIGH docs / MEDIUM community):**
- Claude Code hooks reference -- https://code.claude.com/docs/en/hooks (PreToolUse, `permissionDecision:"deny"`, plugin `hooks/hooks.json`)
- Exit-code-2 does NOT block Edit/Write -- anthropics/claude-code#13744 -- https://github.com/anthropics/claude-code/issues/13744
- Community hook guides (JSON deny shape, matchers) -- https://www.morphllm.com/claude-code-hooks , https://claudefa.st/blog/tools/hooks/hooks-guide

**Independence / self-critique (MEDIUM -- adjacent empirical + preprints):**
- "The Self-Correction Illusion: LLMs Correct Others but Not Themselves" -- https://arxiv.org/html/2606.05976
- "Cross-Context Review: Improving LLM Output Quality by Separating Production and Review Sessions" -- https://arxiv.org/html/2603.12123
- "LLMs-as-Judges: A Comprehensive Survey" -- https://arxiv.org/pdf/2412.05579
- Huang et al., "Large Language Models Cannot Self-Correct Reasoning Yet" (referenced across the above)

**LLM instruction-following (MEDIUM):**
- https://medium.com/@rajnish_khatri/prompt-engineering-battle-tested-rules-for-working-with-llms-8160dcad90d6
- https://arxiv.org/html/2601.22025v1 ("When 'Better' Prompts Hurt")
- https://arxiv.org/pdf/2407.08440 ("Beyond Instruction Following: Inferential Rule Following")

**Local precedent (this ecosystem, 2026-07-13):**
- lz-advisor (advisor consulted at orient / when-stuck / final-review) and GSD dedicated auditors (`gsd-verifier`, `gsd-security-auditor`, `gsd-nyquist-auditor`, `gsd-code-reviewer`) -- project CLAUDE.md / MEMORY; `unbiased-review-beats-primed.md`.

## Metadata

- Standard warrant (a,b): HIGH -- six independent authorities converge on one inequality.
- Tool/GitHub survey (c): HIGH for metric thresholds (official docs); MEDIUM for representativeness of the LLM-agent sample (a handful of public repos, not a census).
- LLM-generalization (e / Q4): MEDIUM -- best-practice + adjacent empirical; confirm via the skill's eval.
- Enforcement (f): HIGH on hook mechanics + the exit-code-2 bug (docs + issue); MEDIUM on the layered recommendation (design judgment, not a benchmarked result).
- Independence (f / Q2): MEDIUM -- "correct others not themselves" / cross-context review are recent preprints + one blog; the direction is well-supported, the magnitude is not benchmarked for this exact task.
- Targeted consultation (g): MEDIUM -- grounded in the mechanical/judgment split observed in this skill's evals + lz-advisor/GSD precedent; the specific two-point set is a design recommendation to validate against the skill's eval.
- Valid until: ~2026-08-13 (stable design principles; recheck tool thresholds + the #13744 hook bug status if a tool or Claude Code major-versions).
