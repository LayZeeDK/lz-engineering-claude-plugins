---
phase: 18
slug: coach-procedure-lz-tpp-seam-wiring
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-20
---

# Phase 18 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Test Infrastructure + the deterministic-vs-orchestrator-gate split are pre-filled from
> 18-RESEARCH.md `## Validation Architecture`. The Per-Task Verification Map and Wave 0 rows are
> completed by `/gsd-validate-phase` (gsd-nyquist-auditor) after execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Dev-only deterministic battery: node content/hygiene checkers + tsc --strict fence extractor (typescript 6.0.3) + vitest 4.1.10 (example pins). No runtime tests in the shipped `plugins/lz-tdd` tree (Markdown-only skill). |
| **Config file** | `.claude/skills/lz-red-workspace/package.json` (pins typescript 6.0.3 + vitest 4.1.10) |
| **Quick run command** | `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs` |
| **Full suite command** | `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs && npm --prefix .claude/skills/lz-red-workspace run typecheck && node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs && claude plugin validate .` |
| **Estimated runtime** | ~30 seconds |

---

## Sampling Rate

- **After every task commit:** Run `node .claude/skills/lz-red-workspace/tools/check-red-references.mjs`
- **After every plan wave:** Run the full suite command above
- **Before `/gsd:verify-work`:** Full suite green + `claude plugin validate .` exit 0
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| (populated by /gsd-validate-phase after execution) | - | - | LAW-01/02, RTR-02, SEAM-01/02 | - | N/A (doc-only) | content-guard | `check-red-references.mjs` | W0 | pending |

*Status: pending / green / red / flaky. The gsd-nyquist-auditor generates the per-task rows from the
executed PLAN.md task list; the deterministic checks below are the sampling substrate.*

---

## Deterministic checks (extend the instrument first, D-13)

These prove the Phase-18 requirements landed and stay the RED->GREEN signal:

- **LAW-01/02 (Three Laws spine + fail-for-the-right-reason):** `check-red-references.mjs` flips the
  `three-laws-and-test-selection.md`, `test-structure-and-assertions.md`, and
  `vitest-typescript-mechanics.md` Phase-18 deferral guards from "marker remains" into positive
  content-token assertions (Three Laws / classify-first / F.I.R.S.T.-baseline / fails-for-the-right-reason).
- **RTR-02 (routing step + override):** new SKILL.md content-token guards (detect house idiom, route by
  structural control / seam availability, state the route, natural-language override).
- **SEAM-01 (classify-first + forward handoff):** SKILL.md content-token guard for classify RED/GREEN/
  REFACTOR + the forward lz-red -> lz-tpp handoff.
- **SEAM-02 (reverse pointers):** a NET-NEW guard asserting `plugins/lz-tdd/skills/lz-tpp/SKILL.md`
  contains both the `lz-red` and `lz-refactor` reverse pointers.
- **VIT-02 (SKILL.md worked example):** a SKILL.md ts-fence guard (require a non-`ts ignore` fence) +
  the tsc extractor extended to cover the SKILL.md fence (tsc --strict clean).
- **Co-edit / honesty invariants:** no stale `Phase 18` deferral marker remains (needle: `/Phase 18/i`
  absence, since filled content legitimately contains `LAW-01`/`SEAM-01`); the Phase-17.1 D-05
  provenance-honesty gate stays intact; `check-hygiene.mjs` (ASCII / work-email allowlist-inversion /
  no-verbatim) GREEN; `claude plugin validate .` exit 0.

**Instrument caveat:** SKILL.md is currently INVISIBLE to `check-red-references.mjs` (references/ only)
and to `extract-samples.mjs` (skips skill root). Adding SKILL.md content + fence coverage, the SKILL.md
tsc-extractor path, and the lz-tpp reverse-pointer read are NET-NEW extensions -- without them the gate
goes falsely GREEN.

---

## Wave 0 Requirements

- [ ] Extend `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` to the Phase-18 RED
  baseline (flip the 4 deferral guards, add SKILL.md coach-procedure content tokens + ts-fence guard +
  the lz-tpp reverse-pointer guard) and assert it RED against the current placeholder SKILL.md / stubs
  before content lands. Extend the tsc extractor to cover the SKILL.md fence.

*Existing dev-only workspace covers the tooling; no new build dep enters `plugins/lz-tdd`.*

---

## Manual-Only Verifications (orchestrator-driven gates -- NOT executor-runnable, NOT deterministic)

gsd-executor has no Agent/Task tool; these three gates are ORCHESTRATOR steps AFTER the executor
returns its blind edits (per CONTEXT D-05/D-10/D-12):

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Three Laws spine own-words fidelity vs Clean Code Ch. 9 | LAW-01/02 | Owned-source clean-room fidelity is an oracle-reviewer judgment, not a token match; tier is gate-decided (may fall back to no-oracle) | Orchestrator spawns `oracle-reviewer` on the owned Three-Laws surface, converge-to-clean (3-round cap) |
| Shipped lz-tpp reverse-pointer edit quality | SEAM-02 | Editing a live shipped skill requires subagent review incl. >= 1 unbiased from-scratch reviewer before acceptance | Orchestrator spawns >= 1 unbiased + >= 1 review agent on the lz-tpp SKILL.md diff; going live needs a human `/reload-plugins` at ship (Phase 19) |
| lz-red SKILL.md coach-procedure quality | LAW/RTR/SEAM | SKILL.md instruction change must be subagent-reviewed before acceptance | Orchestrator spawns >= 1 review agent (incl. unbiased) on the lz-red SKILL.md coach procedure |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (instrument extension RED baseline)
- [ ] No watch-mode flags
- [ ] Feedback latency < 30s
- [ ] `nyquist_compliant: true` set in frontmatter (by /gsd-validate-phase)

**Approval:** pending
