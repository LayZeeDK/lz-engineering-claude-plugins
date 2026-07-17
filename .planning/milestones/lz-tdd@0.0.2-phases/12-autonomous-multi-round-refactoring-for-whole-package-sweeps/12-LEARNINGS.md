---
phase: 12
extracted: 2026-07-14
---

# Phase 12 Learnings -- autonomous multi-round refactoring for whole-package sweeps (+ the skill-improvement loop it spawned)

## Decisions

### The skill's realizable value is auto-trigger + a narrow reference edge, not coach-output
Six-plus e2e scenarios (Phase-12 gaps, quick i5y/n5o/nxp) show a NULL output/coach-value delta vs base Opus 4.8@high. Accepted conclusion: base is catalog-grade; the skill's proven value is auto-triggering the workflow, plus a narrow reference-catalog recall edge; output-gating and general reference recall are parity. No further output tuning warranted.

### L1 = one countable net-cost warrant, not a prose veto or per-pattern rules
Iteration-1's prose "forced-verdict" veto was rationalized past (1/3 built a hierarchy). L1 rewrote SKILL.md step 4 into a single countable added-vs-removed test (APPLY only if removed > added). Re-measure: 0/3 over-build, 3/3 explicit DECLINE. Verifiability is the binding lever; a countable test generalizes and subsumes polymorphism-over-type-codes.

### Phase 12 reconciled as superseded, not blind-executed
12-03 was a readiness-gate/HALT plan; its deferred before/after measurement was performed far more extensively by the skill-improvement loop. Reconciled via a SUMMARY pointing at that evidence rather than re-running the moot in-phase gate.

## Lessons

### The unbiased-review gate earns its keep on eval instruments -- run it BEFORE any metered spend
Neutral + adversarial reviewers caught FATAL, source-verified flaws pre-spend repeatedly: a vacuous test gate (nx vite configuration.spec never executes the target fns), break-even net-cost making DECLINE defensible, a grader false-pass on bare "both" and post-nominal negation, and echo-graded questions. Every eval instrument (prompts + grader) must pass neutral + adversarial review before spending; a same-model taste-reviewer is disqualified (shared blind spots).

### A refactoring skill's step-4 pattern gate is a deliberate YAGNI decline-gate -- a positive control is conceptually foreclosed
Step 4 has no extensibility/growth term by design; declining a pattern justified only by future growth is intended anti-Speculative-Generality. So a faithful skill MUST decline speculative-growth patterns; if it endorses, it overrode the gate with base instinct -- making a PASS indistinguishable from "skill inert." The gate can be shown harmless or harmful, never helpful.

### Catalog-recall evals are confounded by SKILL.md preamble-echo
invoke_skill loads the whole SKILL.md body, so any graded token that also appears in SKILL.md measures preamble-echo, not catalog recall. Audit every graded token against the SKILL.md body and exclude matches from the discriminating set (dropped q3/q5 this way).

## Patterns

### Deterministic book-fact grading with per-fact delta + saturation controls + verbosity guard
Grade knowledge-recall evals with mustName/anyOf/mustNotClaim token assertions (no LLM judge for core facts), metric = per-fact delta on the SAME rubric across both arms, plus saturation controls and per-arm median answer length. Fairness rule: grade ONLY facts with ground truth independent of the skill's own invented conventions (real book contents/renames/table-membership) -- never the skill's directional/grouping conventions (that is echo, not value).

### Catalog-free cwd isolates the A/B
Point the eval cwd at a repo with no catalog on disk so the no_skill arm cannot read the shipped catalog; the catalog reaches the skill arm only via --plugin-dir.

## Surprises

### The ONLY reference edge is the Kerievsky Refactoring-Directions dual/Away placement
Reference eval: 1/8 discriminating positive. base Opus confidently gets "Move Accumulation to Visitor moves away from Iterator" WRONG ("Visitor and only Visitor"); the catalog supplies the real inside-front-cover table fact. Every other classic Fowler/Kerievsky/GoF fact is parity -- base already knows them.

### Base Opus drives multi-round whole-package sweeps to a safe fixpoint unaided
Phase 12's premise (coach stops-and-asks; sweeps do not auto-trigger) did not reproduce at any version: base auto-triggers on directive sweep prompts and drives 4-6 behavior-preserving rounds to a fixpoint, checkpointing on blast-radius traps -- the same as with_skill.
