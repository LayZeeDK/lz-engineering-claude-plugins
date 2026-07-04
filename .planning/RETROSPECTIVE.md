# Project Retrospective

*A living document updated after each milestone. Lessons feed forward into future planning.*

## Milestone: lz-tdd@0.0.1 -- First Release

**Shipped:** 2026-07-04
**Phases:** 5 | **Plans:** 11 | **Tasks:** 15

### What Was Built
- A public, installable Claude Code marketplace (`lz-engineering-claude-plugins`) hosting the `lz-tdd` plugin and its dual-mode `lz-tpp` skill (`/lz-tdd:lz-tpp`).
- A cited, canonical TPP reference (`transformations.md`): verbatim 14-item FibTPP list, 12-vs-14 resolution + provenance, transformations-vs-refactorings, provisional-heuristic framing, NDC 2011 transcript reconciliation.
- The dual-mode skill itself -- an auto-triggering coach (7-step decision procedure + impasse/backtrack) plus an on-demand reference -- with paired FP/imperative TS examples, a Fibonacci monotonic worked example, and JS/TS TCO-safe recursion guidance.
- Ship hygiene: README, MIT LICENSE (public contact), `claude plugin validate . --strict` clean, and a native skill-effectiveness eval harness (EVAL-01 100%/100% recall/specificity; EVAL-02 29/30 coaching vs 15/30 baseline).

### What Worked
- **Content-dependency phasing.** Locking the correct, cited source (Phase 2) before authoring behavior on top of it (Phase 3) prevented rework and kept the skill grounded in authoritative material.
- **Optional-final, non-blocking evals.** Isolating EVAL-01/02 in Phase 5 let the public ship (Phases 1-4) complete without waiting on empirical tuning; the evals then confirmed the shipped skill needed no changes.
- **3-source requirements cross-reference at audit** (VERIFICATION + SUMMARY frontmatter + REQUIREMENTS checkbox) caught the empty `requirements_completed` lags without letting any REQ-ID go orphaned.
- **Unbiased/from-scratch review agents** surfaced issues a primed reviewer would have confirmed past.

### What Was Inefficient
- **Work-email exposure recurred twice.** The work email leaked into git history in Phase 1 (fixed via `git filter-repo` + force-push) and again in an unpushed Phase 5 commit (fixed via amend). A post-commit allowlist gate is now the standing guard.
- **SUMMARY.md frontmatter lag.** `requirements_completed` was left empty in 04-01 and 05-01..04; VERIFICATION.md carried the real coverage, so the audit had to reconcile manually.
- **Version-numbering churn.** GSD tracked the milestone as `v1.0` while the product shipped semver `0.0.1`; it was reconciled to `v0.0.1` at complete-milestone, then re-scoped again to plugin-qualified `lz-tdd@0.0.1` (because the marketplace hosts multiple plugins). Two relabels that a single up-front decision would have avoided. Decide the milestone-id convention -- and whether to scope it per plugin (`<plugin>@<semver>`) -- before the first tag next time.
- **Upstream tooling gaps on Windows/arm64.** The skill-creator eval runner was broken on Windows (select-based harness) and mis-detected triggers cross-OS; the repo had to vendor a native-fixed harness under `.claude/skills/lz-tpp-workspace/tools`.

### Patterns Established
- **ASCII-only output gate** across all committed artifacts (no em dashes / emoji / box-drawing) -- Windows cp1252 hygiene.
- **Version declared only in `plugin.json`**, omitted from the marketplace entry, to avoid the version-masking trap.
- **Native, vendored eval harness** at `.claude/skills/<skill>-workspace/` (gitignored workspace) as the ground-truth eval path, replacing the broken upstream runner.
- **Public-repo contact hygiene**: only the public gmail in committed files; work email verified absent by an allowlist post-commit check.

### Key Lessons
1. Reconcile the GSD milestone id against the product's shipped version at the *start* of a milestone, not at close -- a `v1.0`/`0.0.1` split forces a rename sweep later.
2. Treat public-repo secret hygiene (work email) as a fail-closed post-commit gate, not a per-file review step -- it recurred twice when left to review.
3. When upstream first-party tooling breaks on this platform (Windows/arm64), vendor a native-fixed copy in a gitignored workspace rather than fighting the runner.
4. The GSD SDK stamps dates in UTC (`new Date().toISOString()`); expect a one-day skew from local time near midnight and normalize milestone/ship dates to the local release date.

### Cost Observations
- Model profile: `quality` -- Opus overrides on nearly all GSD agents (planner, executor, verifier, researchers, auditors).
- Notable: the optional-final eval phase confirmed zero tuning was needed, so the Opus-heavy eval spend validated rather than changed the ship.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| lz-tdd@0.0.1 | 5 | 11 | Baseline: content-dependency phasing + optional-final non-blocking eval phase |

### Cumulative Quality

| Milestone | Requirements | Audit | Eval |
|-----------|--------------|-------|------|
| lz-tdd@0.0.1 | 24/24 satisfied | passed (Nyquist COMPLIANT, security CLEAN) | trigger 100%/100%, coaching 29/30 |

### Top Lessons (Verified Across Milestones)

1. (Pending a second milestone to cross-validate.)
