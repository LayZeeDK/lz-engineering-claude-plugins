# Phase 12: Autonomous multi-round refactoring for whole-package sweeps - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-11
**Phase:** 12-autonomous-multi-round-refactoring-for-whole-package-sweeps
**Mode:** `--analyze --auto --chain`
**Areas discussed:** GA-1 multi-round autonomy boundary (escalated -> panel-resolved), GA-2
sweep trigger, GA-3 behavior-preservation between rounds, GA-4 research scope, GA-5 measurement
design, GA-6 scope boundary

**How this pass ran:** GA-2..GA-6 were auto-locked (each is low-impact OR high-confidence on
approach). GA-1 was the one trap-quadrant item (HIGH impact + not-high confidence: it changes
SHIPPED skill behavior and re-opens the freshly-resolved coach/apply tension), so per the
standing `--auto` trap-quadrant rule it was NOT auto-locked. It was first raised to the user via
AskUserQuestion; the user was then away for the day and directed an autonomous, evidence-first
pass. GA-1 was therefore resolved WITH EVIDENCE via a 3-lens independent panel (unbiased
from-scratch, adversarial red-team, evals-design) instead of being left UNRESOLVED.

---

## GA-1: Multi-round autonomy boundary (the escalated / trap-quadrant decision)

| Option | Description | Selected |
|--------|-------------|----------|
| A. Drive to completion, pause only on real risk | On a sweep COMMAND, loop rounds autonomously (detect -> apply -> tests green -> next); pause only on behavior-change / API-break / ambiguity; questions stay advise-only; tests-between-rounds is the guard | [x] (REFINED) |
| B. Round-by-round checkpoint | Drive one round, summarize, continue only if the developer does not object | |
| C. Fully autonomous, tests-only guard | Once commanded, drive all rounds with no pauses; rely solely on tests staying green | |

**Outcome:** Refined Option A -- "scoped autonomous drive to a FIXPOINT, with a terminal review
gate and structural guards" (CONTEXT.md D-05..D-10). B was rejected (a checkpoint every round is
close to today's stop-and-ask and under-delivers SC2's "autonomous toward the end goal"). C was
rejected (max blast radius: false-green on uncovered code, monorepo API breakage, reverses the
"unrequested changes are unwelcome" principle).

**Panel evidence (3 independent lenses):**
- Unbiased from-scratch: independently recommended drive-to-completion, but defined the
  stop-condition as a FIXPOINT (no remaining warranted, in-scope refactoring), not "zero smells";
  enumerated 7 pause boundaries; framed sweep as the existing drive arm with looping termination
  (no new mode).
- Adversarial red-team: raw Option A is unshippable (unbounded loop, refactorings spawn next
  round's smells / oscillation, review-DOS, false-green on thin coverage, monorepo blast radius).
  Verdict: ship the NARROWER "scoped autonomous drive + terminal review gate" with 7 guardrails;
  SPLIT the two gaps and treat them differently; specificity guarantee must live in the eval set,
  not the prose.
- Evals-design: seed each sweep with N safe items + exactly ONE should-pause trap (nx =
  exported-signature break; kata = behavior change) so posture A/B/C reads deterministically from
  transcript+diff; single headline metric = AUTONOMY-PRECISION; dual-write sweep negatives;
  reload-plugins pivot; batched run-gate.

**Notes:** The precise boundary is intentionally also made an EMPIRICAL question the phase's own
evals adjudicate -- converting a trap-quadrant guess into an evidence-backed, measured outcome
(the user's "most evidence and value" directive).

---

## GA-2: Sweep trigger (Gap 1, SC1) -- auto-locked

| Option | Description | Selected |
|--------|-------------|----------|
| Broaden description to the whole-package-sweep intent CATEGORY + paired hard negatives, re-measure specificity/seam | Address the missing category (whole-package scan-and-fix of green code), not literal phrasings; pair each sweep positive with a sweep-shaped negative | [x] |
| Broaden with generic whole-codebase imperative vocabulary | Higher recall but neighbors the green step / feature work; risks specificity + seam regression | |

**Rationale:** The quick task proved the trigger-optimization method + no-regression eval gate.
Wording is empirical/downstream. CONTEXT.md D-02..D-04.

---

## GA-3: Behavior-preservation between rounds (SC2) -- auto-locked

| Option | Description | Selected |
|--------|-------------|----------|
| Tests between rounds; uncovered code -> Feathers characterization-first as a separate approved step | The existing discipline applied per-round; never false-green on uncovered code | [x] |
| Tests only at the end of the sweep | Faster but loses per-round behavior preservation | |

**Rationale:** Mandated by SC2; it is the skill's load-bearing invariant. CONTEXT.md D-07(2/3).

---

## GA-4: Research scope (SC3) -- auto-locked

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse the existing research artifact + extend on sweep-trigger + autonomous-loop patterns, per source-authority precedence | `.planning/research/skill-trigger-optimization.md` + targeted extension | [x] |

**Rationale:** Precedence is locked in PROJECT.md; the artifact exists. CONTEXT.md D-11.

---

## GA-5: Measurement design (SC4) -- auto-locked

| Option | Description | Selected |
|--------|-------------|----------|
| Extend the existing native trigger-eval harness + both e2e suites; before/after per-suite + combined; seeded posture traps | No new harness code; dual-write negatives; reload-plugins pivot; user-gated run (pre-approved conditionally) | [x] |

**Rationale:** Harness + suites already exist and are proven. CONTEXT.md D-12..D-16.

---

## GA-6: Scope boundary -- auto-locked

| Option | Description | Selected |
|--------|-------------|----------|
| Build ON the committed quick-task changes; do not re-author catalogs/smells/principles, do not weaken the seam, no codemods (FUT-03) | Split the two gaps; agent-review all SKILL.md edits incl. >=1 unbiased | [x] |

**Rationale:** Scope discipline; the quick-task changes are committed and validated. CONTEXT.md
D-01, D-17.

---

## Claude's Discretion

- Exact description wording + sweep positive/negative phrasings (empirical loop picks the final).
- Exact SKILL.md sweep-drive sentence-cluster wording (one added cluster; < 500 lines; no new
  mode/flag/sub-skill).
- Seeded-trap implementation + scenario counts; optional posture-labeling helper.
- One plan vs two for Gap-1 / Gap-2; `k` for the no_skill control.

## Deferred Ideas

- Automated refactoring execution / codemods (FUT-03).
- Trigger + drive eval sets as a permanent CI gate.
- Exhaustive per-leaf eval coverage.
- A dedicated sweep mode / config flag / sub-skill (rejected).
- Auto-authoring characterization tests to enable sweeping untested code (rejected).
