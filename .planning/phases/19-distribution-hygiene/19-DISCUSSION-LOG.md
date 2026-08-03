# Phase 19: Distribution & Hygiene - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-20
**Phase:** 19-distribution-hygiene
**Mode:** --analyze --auto --chain (autonomous single pass; trade-off tables logged; one gray area escalated)
**Areas discussed:** DST-04 no-verbatim sweep, README, manifest metadata, hygiene-gate coverage, review gates + triage, CHANGELOG, git-history work-domain needle (escalated)

---

## GA-1: DST-04 no-verbatim sweep for the lz-red tree (auto-locked)

| Option | Description | Selected |
|--------|-------------|----------|
| Scaled three-layer (deterministic gate + owned-surface attestation + targeted owned re-sweep) | Reuse the GREEN no-verbatim gate; cite the per-surface oracle-reviewer gates from Phases 16/17-06/18-06; re-sweep only the owned surfaces | YES |
| Full whole-tree oracle-reviewer re-sweep | Re-review every lz-red reference doc | |
| Attestation-only | Cite prior gates; no re-sweep | |

**Choice:** Scaled three-layer (D-01/D-02). **Notes:** NOT escalated (unlike Phase 10 GA-1) -- lz-red is a small, mostly no-oracle tree; every owned surface already carries a passing oracle-reviewer verdict with no recorded collision; the deterministic gate is GREEN. Confidence HIGH.

---

## GA-2: README for three skills (auto-locked)

| Option | Description | Selected |
|--------|-------------|----------|
| Mirror the lz-tpp/lz-refactor section shape for lz-red; lead becomes a three-skill red-green-refactor statement; link-don't-inline | Direct Phase-10 D-05/D-06 precedent | YES |
| Rewrite the README structure | | |

**Choice:** Mirror + three-skill lead (D-03/D-04). **Notes:** Reversible pre-tag Markdown; direct precedent.

---

## GA-3: Manifest metadata (auto-locked)

| Option | Description | Selected |
|--------|-------------|----------|
| Bump plugin.json 0.0.2 -> 0.0.3, extend description + keywords, correct marketplace.json description; no version in marketplace.json | Phase-10 D-08/D-09 precedent | YES |

**Choice:** D-05/D-06. **Notes:** One-line factual-accuracy edits; version in plugin.json only.

---

## GA-4: Hygiene-gate coverage (auto-locked)

| Option | Description | Selected |
|--------|-------------|----------|
| Re-verify + extend the existing check-hygiene walk (already covers lz-red) for new root prose; widen never weaken; keep allowlist-inversion shape | Phase-10 D-10/D-11 precedent | YES |

**Choice:** D-07. **Notes:** The single authoritative checker already scans the lz-red tree on all three axes (16-01); GREEN baseline.

---

## GA-5: Review gates + findings triage (auto-locked)

| Option | Description | Selected |
|--------|-------------|----------|
| validate + --strict (regression) + plugin-validator + skill-reviewer on lz-red (orchestrator-run); FIX errors/hygiene, DEFER triggering/routing to Phase 20 | Phase-10 D-12/D-13 precedent | YES |

**Choice:** D-08/D-09/D-10. **Notes:** Agent gates are orchestrator-run (executor has no Agent tool); SKILL.md edits get their own unbiased review.

---

## GA-6: CHANGELOG entry for 0.0.3 (auto-locked)

| Option | Description | Selected |
|--------|-------------|----------|
| Add [lz-tdd@0.0.3] entry in Keep-a-Changelog shape mirroring 0.0.2; link-ref to the not-yet-cut tag | Phase-10 D-15/D-16 precedent | YES |

**Choice:** D-11. **Notes:** Tag + Release deferred to a post-phase quick task.

---

## GA-7: Archived work-domain git-history needle (ESCALATED out of --auto)

| Option | Description | Selected |
|--------|-------------|----------|
| Forward-fix the tip | New commit rewrites the archived doc's needle to a non-encoding allowlist-inversion form; no shared-history rewrite; scoped task | YES |
| Purge from history (thorough) | git filter-repo --replace-text across main + branch + force-push; rewrites public main, re-points the 0.0.2 tag SHAs | |
| Accept + record, keep Phase 19 scoped | Treat as accepted residual; log as deferred | |

**User's choice:** Forward-fix the tip.
**Notes:** Escalated because HIGH-impact (needle on origin/main public history: 75ba6b0 -> 7c46b0a, and on the pushed 0.0.3 branch) + NOT-high-confidence (three valid remediations) -- the --auto trap quadrant, human in the loop. The thorough purge was rejected as disproportionate for a bare domain (no @local-part) in an archived planning meta-doc (CLAUDE.md: never rewrite main casually; bare-domain-in-history is out of scope for the automated detector). Runs as its own scoped task before the 0.0.3 push/PR. Captured as D-12.

---

## Claude's Discretion

- README section ordering / wording / usage snippet / badges; exact plugin.json keywords list; exact CHANGELOG bullet granularity; batched-vs-per-surface owned re-sweep; gate ordering; the exact check-hygiene wideTargets extension. All HOW inside the locked boundaries (D-13).

## Deferred Ideas

- Git tag lz-tdd@0.0.3 + GitHub Release -> separate post-phase quick task (0.0.1/0.0.2 precedent).
- Skill-effectiveness evals (EVL-01/EVL-02) -> Phase 20 (late, non-blocking).
- The thorough git filter-repo history purge -> rejected now; revisit only if the exposure escalates to a full-email.
- VIT-02 traceability reconciliation -> a Phase-17/18-close bookkeeping item, not Phase 19 scope.
- npm packaging / more plugins / non-TS examples / outside-in RED -> post-0.0.3.
