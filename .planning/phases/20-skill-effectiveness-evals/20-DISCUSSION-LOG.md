# Phase 20: Skill-Effectiveness Evals - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-21
**Phase:** 20-skill-effectiveness-evals
**Mode:** `--analyze --auto --chain`
**Areas discussed:** Three-way cross-skill trigger boundary (ESCALATED); RED-behavior
correctness rubric (ESCALATED). Nine further areas auto-locked from the Phase-11 / Phase-5
analogs (logged below with their trade-off framing).

---

## Three-way cross-skill trigger boundary (D-03) [ESCALATED -- trap quadrant]

Rated HIGH impact (EVL-01 headline deliverable + ROADMAP SC1 three-way boundary claim) +
NOT-high confidence (the harness measures one skill at a time; "prove the three-way
boundary" was genuinely ambiguous with a real cost / scope tradeoff). NOT auto-locked;
escalated to the operator (human in the loop).

| Option | Description | Selected |
|--------|-------------|----------|
| Specificity + reciprocal RED spot-check | lz-red recall/specificity with near-misses from BOTH sibling territories, THEN run lz-tpp + lz-refactor against the RED should-trigger prompts only, asserting both stay quiet. Proves both directions; catches the new risk (siblings eval'd before RED prompts existed) at bounded cost. | [x] |
| lz-red-centric near-misses only | Measure only lz-red's own recall/specificity; near-misses hold sibling prompts. Cheapest (~1x), exact Phase-11 precedent, but never re-checks siblings stay quiet on the new RED prompts. | |
| Full 3x3 reciprocal matrix | Harness once per skill against a shared RED+green+refactor corpus; assert each fires only on its own territory. Strongest literal proof but ~3x runs/tokens and re-checks sibling directions already covered by Phases 5/11. | |

**User's choice:** Specificity + reciprocal RED spot-check.
**Notes:** The reciprocal spot-check is the one piece of coverage no prior phase produced --
lz-tpp (Phase 5) and lz-refactor (Phase 11) were both eval'd before any RED prompts existed.
A sibling firing on RED intent becomes a bounded, non-blocking D-09 tuning candidate on that
sibling's description. Not a full matrix -- the incremental value of re-checking sibling
directions already covered by Phases 5/11 is low.

---

## RED-behavior correctness rubric (D-05-RUBRIC) [ESCALATED -- trap quadrant]

Rated HIGH impact (EVL-02 core "if everything else fails, this must be correct" deliverable)
+ NOT-high confidence (the dimensional decomposition and deterministic-vs-judge split are new
for open-ended RED coaching; lz-refactor was a single name+layer set-match). NOT auto-locked;
escalated. Direct analog of the Phase-11 D-04-RUBRIC escalation.

| Option | Description | Selected |
|--------|-------------|----------|
| Per-dimension hybrid (deterministic + judge) | Decompose the RED move into coach-procedure dimensions; grade mechanical ones deterministically (AAA/GWT named, starter case, no-drive, handoff), judge only the judgment-heavy ones (right next test; behavior-not-implementation). Scenarios pin known-correct answers from shipped examples. Mirrors Phase 5/11 "deterministic first, judge only where a set-match is insufficient". | [x] |
| Single best-move set-match | Pre-specify the ONE correct next test per scenario and grade a near-exact match; minimal judge. Most reproducible/cheap, but brittle -- penalizes correct-but-alternative next tests (Phase-11 strict-single-best-fit failure mode). | |
| Holistic LLM-judge rubric | A judge scores each response against the written 6-dimension rubric with a pass threshold; few deterministic checks. Most flexible, but weakest reproducibility + judge-bias risk across iterations (analog of Phase-11's rejected lenient-only). | |

**User's choice:** Per-dimension hybrid (deterministic + judge).
**Notes:** The mechanical dimensions (selection / structure / fail-for-the-right-reason /
handoff / coach-don't-drive) are scripted and reusable across iterations; the LLM-judge is
reserved only for "is THIS the right next test" and "is the assertion target observable
behavior rather than implementation". Each scenario anchors on a shipped lz-red reference
example so ground truth is already proven.

---

## Auto-locked areas (HIGH confidence, `--analyze` trade-off framing)

These nine areas were NOT escalated -- each is a HIGH-confidence carry-forward from Phase 11
(lz-refactor evals) and/or Phase 5 (lz-tpp evals), both CLOSED with detailed CONTEXT. `--auto`
locked each to its recommended option. Full detail in CONTEXT.md D-01, D-02, D-04, D-06..D-11.

- **Harness (D-01):** reuse the vendored native-fixed skill-creator-eval rig (copy from
  lz-refactor-workspace); serial / Ponytail-off / MCP-stripped / model claude-opus-4-8.
  Alternative rejected: re-fixing the upstream run_eval bugs from scratch (already solved
  twice).
- **Trigger set design (D-02):** ~20-24 hand-authored queries; sibling-seam near-misses for
  BOTH lz-tpp and lz-refactor. Alternative rejected: obvious-irrelevancy negatives (test nothing).
- **Behavior harness + orchestration (D-04):** skill-creator with-skill vs no-skill posture;
  unnamed fire-and-forget subagents, isolated scratch cwd, grade -> judge -> merge -> verify
  -> aggregate. Alternative rejected: named teammate subagents (no result/timing).
- **Scenario sourcing (D-06):** primarily from shipped lz-red reference examples; representative
  spread across the coach-procedure dimensions + three stances + a classify-first boundary case.
  Alternative rejected: inventing scenarios (re-derivation risk).
- **Scoring / reliability (D-07):** >=3x runs; Pass@k/Pass^k (k=1,3,5,total); wait-for-all
  notifications; >=1 unbiased from-scratch reviewer; flag saturated assertions. Alternative
  rejected: primed-only review (confirms grader bugs).
- **Pass bars (D-08):** trigger 100%/100% (ROADMAP SC1); behavior clearly beats baseline; soft,
  non-blocking. Alternative rejected: a hard blocking bar (contradicts the non-blocking phase).
- **Tuning discipline (D-09):** at most one bounded description/coach-wording pass, only on
  evidence, re-validated on a held-out set; SKILL.md edits get their own unbiased review +
  human /reload-plugins. Alternative rejected: iterative multi-pass tuning (SC3 forbids).
- **Location + git hygiene (D-10):** everything under .claude/skills/lz-red-workspace/;
  existing *-workspace gitignore rules reused. Alternative rejected: under plugins/ (ships;
  no build deps) or .planning/.
- **Execution gate (D-11, HARD):** build all assets in-plan, HALT before the metered run
  (user-gated). Alternative rejected: running inline (violates the standing eval-run approval gate).

---

## Claude's Discretion

Deferred to research / planning (CONTEXT.md "Claude's Discretion"): exact query / scenario
wording and counts; which dimensions are scripted vs judged within the D-05-RUBRIC split;
whether the reciprocal spot-check reuses verbatim or a curated subset of the RED prompts;
workspace directory naming; one plan vs two (EVL-01 / EVL-02); parallel vs series behavior runs;
net-new scenario count; harness env specifics.

## Deferred Ideas

Permanent CI / regression gate; a full 3x3 reciprocal matrix; exhaustive per-reference / per-
stance coverage; a second / iterative tuning pass; ADV-01 / ADV-02 / outside-in RED / multi-
language sets (post-0.0.3 Future Requirements); the 0.0.3 tag / GitHub Release (post-Phase-19
ship task). See CONTEXT.md "Deferred Ideas".
