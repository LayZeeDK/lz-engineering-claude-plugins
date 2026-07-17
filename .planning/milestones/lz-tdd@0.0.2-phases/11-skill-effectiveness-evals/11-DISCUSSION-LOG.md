# Phase 11: Skill-Effectiveness Evals - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-09
**Phase:** 11-skill-effectiveness-evals
**Mode:** `--auto --analyze`, pause-before-plan-phase (auto-advance suppressed)
**Areas discussed:** Eval harness, Trigger set design, Behavior harness + rubric,
Scenario sourcing, Scoring/reliability, Pass bars, Tuning discipline, Artifact location,
Execution gate

---

## Auto-locked areas (`--auto`; recommended option taken; IMPACT x CONFIDENCE rated)

All auto-locked areas mirror the Phase-5 analog (05-CONTEXT.md D-01..D-09) on already-proven
ground truth (the shipped skill + the working lz-tpp eval rig). None fell in the
HIGH-impact + NOT-HIGH-confidence trap quadrant except the escalated rubric below.

| Area | Trade-off considered (`--analyze`) | Locked (recommended) | IMPACT / CONFIDENCE |
|------|-----------------------------------|----------------------|---------------------|
| Eval harness (D-01) | (a) re-fix upstream run_eval; (b) reuse vendored native-fixed harness from Phase 5; (c) WSL | (b) vendor the Phase-5 native-fixed harness under lz-refactor-workspace/tools/; serial + Ponytail-off + MCP-stripped + session model | med / HIGH (proven in Phase 5; WSL abandoned there) |
| Trigger set (D-02) | broad-net vs edge-case near-misses | ~20 queries, edge-case near-misses INCL. the lz-tpp green-step seam | HIGH / HIGH (shipped description's own Do-not-use clause is ground truth) |
| Behavior harness (D-03) | ad-hoc vs skill-creator test-case+benchmark w/ subagent orchestration | skill-creator benchmark; unnamed fire-and-forget subagents, isolated cwd, grade->judge->merge->verify->aggregate | med / HIGH (Phase-5 mechanic) |
| Scenario sourcing (D-05) | invent net-new vs lift from shipped leaves | lift from shipped catalog leaves (proven), representative both-layer spread + de-patterning + routing-boundary | HIGH / HIGH (verified leaves) |
| Scoring (D-06) | single-run vs >=3x + Pass@k/Pass^k | >=3x; Pass@k/Pass^k (k=1,3,5,total); wait-for-all-notifications; unbiased reviewer | med / HIGH (CLAUDE.md rule) |
| Pass bars (D-07) | hard gate vs soft/tunable | SOFT, non-blocking; ~90%+ trigger; high behavior Pass@1 beating baseline | low / HIGH |
| Tuning (D-08) | open-ended vs at-most-one bounded | at most ONE bounded pass; LOCKED content frozen; no scope expansion | med / HIGH (SC3) |
| Location (D-09) | .planning/ vs plugins/ vs .claude/skills/*-workspace/ | under lz-refactor-workspace/; generic *-workspace gitignore reused | med / HIGH (established) |
| Execution gate (D-10) | run-in-plan vs halt-for-approval | HALT before run; present command; wait for approval | HIGH / HIGH (standing eval-run rule) |

---

## Behavior eval: "correct next refactoring" rubric (EVL-02) [ESCALATED]

Escalated rather than auto-decided: HIGH impact (defines EVL-02 correctness; hard to reverse
once scenarios/assertions are authored) and the one place Phase 11 genuinely diverges from
Phase 5 (lz-refactor's smell->refactoring mapping is one-to-many, not a single-answer
priority order). A human was in the loop via the pause-before-plan-phase directive, so it was
put to the user.

| Option | Description | Selected |
|--------|-------------|----------|
| Hybrid | Name in the smell's candidate set (smells.md) AND correct layer; specific name where scenario pins one best-fit; deterministic name+layer, judge for rationale only | YES |
| Strict single-best-fit | Exactly one ground-truth refactoring per scenario; must name it | |
| Lenient routing-only | Accept any refactoring from the correct layer/candidate set; no specific name required | |

**User's choice:** Hybrid (recommended).
**Notes:** Anchors on shipped, verified artifacts (smells.md candidate sets + the coach's
CCH-01/CCH-02 layer-routing contract), so there is no new adjudication risk; still
discriminates (wrong-layer or off-candidate answers fail) without over-fitting to one name
where several are valid. Captured as D-04-RUBRIC in CONTEXT.md.

---

## Claude's Discretion

- Exact eval-query wording and scenario count (within D-02 / D-05 posture).
- Exact assertion text; which assertions scripted vs judged (deterministic name+layer first).
- Workspace layout under lz-refactor-workspace/; parallel vs series behavior runs.
- Whether EVL-01 and EVL-02 are one plan or two.
- Net-new scenario count beyond the leaf-sourced ones.

## Deferred Ideas

- Permanent CI/regression eval gate -> future (not this one-time validation).
- Exhaustive per-leaf coverage of all 62/27/23/19 leaves -> out of scope (catalog checkers
  + oracle sweeps already gate that); EVL-02 is a representative spread.
- A second/iterative tuning pass or catalog-content re-authoring on findings -> disallowed
  by SC3 / D-08.
- Multi-language example sets / additional skills -> post-0.0.2 (FUT-01..04).
