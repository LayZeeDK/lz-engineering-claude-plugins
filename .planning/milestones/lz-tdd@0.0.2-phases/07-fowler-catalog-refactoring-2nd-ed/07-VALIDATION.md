---
phase: 7
slug: fowler-catalog-refactoring-2nd-ed
status: complete
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-04
updated: 2026-07-05
---

# Phase 7 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> This is a Markdown skill-authoring phase: there is no application test runner.
> Validation is a `tsc --strict` compile harness over the extracted TS/JS samples
> plus Node checkers asserting catalog completeness, provenance, cross-link
> integrity, and hygiene. Finalized by `/gsd-validate-phase 7` post-execution:
> all requirements are COVERED and GREEN; no MISSING gaps; no `.test.`/`.spec.`
> files to generate (there is no runtime behavior to unit-test -- the checkers ARE
> the automated verification, and gsd-verifier confirmed they carry real assertions).

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | `tsc --strict --noEmit` (TypeScript 6.0.3, pinned) over a non-shipped compile workspace + Node built-in checkers (no app test runner) |
| **Config file** | `.claude/skills/lz-refactor-workspace/tsconfig.json` + `package.json` (gitignored-record pattern; `samples/` gitignored) |
| **Quick run command** | `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` |
| **Full suite command** | `extract-samples.mjs && tools/check-catalog.mjs && tools/check-smells.mjs && tools/check-crossrefs.mjs && tools/check-principles.mjs && tools/check-hygiene.mjs` (all under `.claude/skills/lz-refactor-workspace/`), plus `claude plugin validate .` |
| **Estimated runtime** | ~15-30 seconds (dominated by `tsc --strict` over 124 sample modules) |

---

## Sampling Rate

- **After every task commit:** Run the relevant chapter checker (`check-catalog` / `check-smells`) + `check-hygiene`
- **After every plan wave:** Run the full suite (tsc + all checkers)
- **Before phase close:** Full suite green (it is) + `claude plugin validate .` passes (it does)
- **Max feedback latency:** ~30 seconds

---

## Per-Task Verification Map

| Requirement | Wave | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|-------------|------|-----------------|-----------|-------------------|-------------|--------|
| FWL-01 (62 refactoring leaves + per-leaf contract + provenance + README Use-when mirror) | 2-4 | identity not cardinality; no fabricated/dropped entry; `[web-only]` on Return Modified Value only | structural | `node .claude/skills/lz-refactor-workspace/tools/check-catalog.mjs` | yes | green (62/62) |
| FWL-02 (24 smell leaves + candidate map + navigation-only index) | 4 | candidate links resolve to real leaves; index carries no candidates | structural | `node .claude/skills/lz-refactor-workspace/tools/check-smells.mjs` | yes | green (24/24) |
| FWL-03 (Ch.2 principles: definition / two hats / triggers / performance / YAGNI + attributions) | 2 | all 8 Ch.2 topics present; trigger->refactoring links resolve | structural | `node .claude/skills/lz-refactor-workspace/tools/check-principles.mjs` | yes | green (8/8) |
| FWL-04 (every TS/JS sample tsc --strict-clean + behavior-preserving) | 2-4 | compiles clean; behavior-preservation reviewer-gated | compile | `node .claude/skills/lz-refactor-workspace/extract-samples.mjs` | yes | green (124 modules) |
| Cross-link integrity (bidirectional smell<->refactoring, inverse-of mutual, no self-ref) | 4 | every intra-repo `.md` cross-link resolves | structural | `node .claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs` | yes | green (291 links, 20 inverse pairs) |
| DST-04 hygiene (ASCII-only, work-email allowlist, no-verbatim heuristic) | all | no non-ASCII, no work email, no verbatim prose | structural | `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` | yes | green (92 files) |
| Plugin regression (marketplace + skill frontmatter) | 4 | plugin structure valid | structural | `claude plugin validate .` | n/a | green (pass) |

*Status: green = the checker exits 0 with all phase content committed. Verified independently by gsd-verifier (checkers confirmed non-hollow).*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. The checker battery was built in 07-01
(`extract-samples`, `check-catalog`, `check-smells`, `check-principles`, `check-hygiene`) and
extended in 07-02 (`check-crossrefs`; the 62-scope / per-refactoring-leaf / smell-leaf overhaul). No
new test infrastructure was needed for 07-10.

- [x] `.claude/skills/lz-refactor-workspace/tsconfig.json` + `package.json` -- compile harness (FWL-04)
- [x] `check-catalog` -- 62-name identity + per-leaf contract + provenance + README mirror (FWL-01)
- [x] `check-smells` (24 leaves) + `check-crossrefs` phase-gate (FWL-02, link integrity)
- [x] `check-principles` -- Ch.2 topic presence + trigger links (FWL-03)
- [x] `check-hygiene` -- ASCII-only, no-verbatim (DST-04), work-email allowlist

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Owner-oracle content fidelity (mechanics/motivations/smell candidates/Ch.2 match the owner's edition) | FWL-01..04 | Semantic fidelity is not a plain compile/link check | Gated DURING execution by the clean-room `oracle-reviewer` loop over `.oracle/refactoring-2e/` (per 07-ORACLE-MODEL); the main context never reads book prose (DST-04). NOT re-runnable here without breaching the firewall. All 62 catalog + 24 smell leaves reached `oracle-reviewer` pass (recorded in the wave SUMMARY files) -- so this is an automated-during-execution gate, not an open manual gap |
| Behavior-preservation of each before->after sample | FWL-04 | Semantic equivalence is not fully machine-checkable beyond compilation | Confirmed by the `oracle-reviewer` example axis during execution (upgrades FWL-04's behavior-preserving clause from manual-only to reviewer-gated) |

---

## Validation Sign-Off

- [x] All requirements have an automated verify command (the checker battery + plugin validate)
- [x] Sampling continuity: every requirement maps to a green checker (no 3-task automated-verify gap)
- [x] Wave 0 covers all references (harness + checkers pre-existed from 07-01/07-02)
- [x] No watch-mode flags
- [x] Feedback latency < 30s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-07-05

## Validation Audit 2026-07-05

| Metric | Count |
|--------|-------|
| Requirements audited | FWL-01..04 + cross-link integrity + DST-04 hygiene + plugin regression |
| Covered (green automated) | all |
| Gaps found | 0 |
| Tests generated | 0 (the checker battery is the automated verification; a Markdown reference phase has no runtime behavior to unit-test) |
| Escalated | 0 |
