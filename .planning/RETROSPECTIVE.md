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

## Milestone: lz-tdd@0.0.2 -- lz-refactor Skill (Fowler + Kerievsky)

**Shipped:** 2026-07-17
**Phases:** 11 | **Plans:** 55

### What Was Built
- A second dual-mode skill, `lz-refactor` (`/lz-tdd:lz-refactor`), completing the red-green-refactor loop alongside `lz-tpp`.
- Five reference catalogs authored from copyrighted books: Fowler (62 refactorings + 24 smells + Ch.2 principles), Kerievsky (27 pattern-directed), GoF (23 + 5 extra), and Functional (19 idioms) with an N:1 pattern->idiom map + 55 mutual OO<->FP cross-links, over a unified smell taxonomy.
- A coach decision procedure (smell->named-refactoring routing, de-patterning, behavior-preservation with a Feathers no-tests fallback, the lz-tpp seam) backed by three no-oracle principle refs (Beck x2, Feathers).
- Public ship: two-skill 0.0.2 (README + CHANGELOG + marketplace), `validate --strict` clean, plugin-validator + skill-reviewer PASS, no-verbatim hygiene gate, plus native evals and head-to-head comparisons vs base Opus (Phase 13) and the mattpocock code-review skill (Phase 14).

### What Worked
- **Clean-room oracle loop.** The `oracle` / `oracle-reviewer` agents read the git-ignored `.oracle/` books while the main context never saw book prose; only own-words answers/verdicts crossed back. DST-04 held across 100+ pattern/refactoring leaves and the no-verbatim gate stayed GREEN.
- **Instrument-first phase gates.** Each catalog phase committed a RED checker (name-identity + contract) before any content, so the catalog was gated by exit code the whole way to GREEN.
- **Per-plugin milestone id from the start.** Using `lz-tdd@0.0.2` throughout avoided 0.0.1's late `v1.0 -> v0.0.1 -> lz-tdd@0.0.1` rename churn (the top 0.0.1 lesson, applied).
- **3-source requirements cross-reference at audit** again caught SUMMARY-frontmatter desyncs (FWL-03 omitted; EVL-01/02 empty by design) without orphaning any REQ-ID.
- **Unbiased review on every skill-instruction edit** -- mandatory for SKILL.md changes; caught an over-conversion hazard in the loop-audit forcing-function before ship.

### What Was Inefficient
- **A long output-warrant eval tail.** Five successive passive-content probes (description tweaks, cues, few-shot examples) were null on applied-output lift before the sixth -- a skill-level enumeration forcing-function -- flipped it. Adjacent-literature inference nearly closed the search early ("recognition ceiling, stop"); the direct experiment was what actually settled it.
- **Quick-task SUMMARY naming drift.** Newer quick tasks used prefixed `<slug>-SUMMARY.md`, invisible to the pre-close audit scanner (which keys on bare `SUMMARY.md` + `status: complete`), so 6 completed tasks false-flagged as open at close and had to be normalized.
- **Verification status not reconciled forward.** Phase 09 stayed `human_needed` because its lone gap (a skill-reviewer PASS) was satisfied in Phase 10 but the 09 frontmatter wasn't flipped until milestone close.
- **SUMMARY frontmatter lag recurred** (FWL-03 absent from Phase 7's closing SUMMARY; EVL IDs empty by design) -- VERIFICATION.md carried the truth, audit reconciled.

### Patterns Established
- **Clean-room oracle/oracle-reviewer model** for any copyrighted source: main context never reads book prose; agents return own-words only.
- **Instrument-first catalog gates**: a RED name-identity/contract checker committed before content, driven to GREEN.
- **The book's authoritative table beats chapter-prose** for settling metadata (Kerievsky's Refactoring Directions table settled To/Towards/Away).
- **Active forcing-function beats passive content** for applied-output lift (an in-SKILL AUDIT+DECIDE step reproduced skill-alone recall while staying precise).

### Key Lessons
1. Run the direct experiment before concluding from adjacent literature -- the passive-content nulls were real, but "judgment ceiling, stop" was falsified by the enumeration forcing-function.
2. Normalize quick-task artifacts to bare `SUMMARY.md` with `status: complete` so the pre-close audit scanner does not false-flag finished work.
3. Reconcile a phase's verification status the moment a later phase closes its `human_needed` item -- not at milestone close.
4. Carry the prior milestone's top lesson forward explicitly: the per-plugin milestone-id convention, decided up front, eliminated the version-relabel churn 0.0.1 hit.

### Cost Observations
- Model profile: `quality` -- Opus overrides across GSD agents.
- Notable: substantial metered `claude -p` eval spend in Phases 11-14 plus a string of probe quick tasks; the output-warrant search was the dominant cost, and most of it confirmed parity/null rather than changing the ship. The catalog authoring (clean-room oracle loop) was the high-value spend.

---

## Cross-Milestone Trends

### Process Evolution

| Milestone | Phases | Plans | Key Change |
|-----------|--------|-------|------------|
| lz-tdd@0.0.1 | 5 | 11 | Baseline: content-dependency phasing + optional-final non-blocking eval phase |
| lz-tdd@0.0.2 | 11 | 55 | Clean-room oracle loop for copyrighted sources; instrument-first catalog gates; per-plugin milestone id from the start; extended eval program (comparisons vs base Opus + a third-party skill) |

### Cumulative Quality

| Milestone | Requirements | Audit | Eval |
|-----------|--------------|-------|------|
| lz-tdd@0.0.1 | 24/24 satisfied | passed (Nyquist COMPLIANT, security CLEAN) | trigger 100%/100%, coaching 29/30 |
| lz-tdd@0.0.2 | 36/36 satisfied | passed (Nyquist 11/11 COMPLIANT) | EVL-01/02 PASS; parity vs base Opus (authenticity + correctness); loop-audit forcing-function recall 5/5 vs 0/3 control |

### Top Lessons (Verified Across Milestones)

1. **Public-repo secret hygiene is a fail-closed gate, not a review step.** Work-email exposure recurred twice in 0.0.1; 0.0.2 kept the allowlist-inversion guard GREEN across the full tree.
2. **Carry the prior milestone's top lesson forward as a decision.** The per-plugin milestone-id convention, decided up front in 0.0.2, eliminated the version-relabel churn 0.0.1 suffered at close.
3. **VERIFICATION.md is the authoritative coverage source; SUMMARY frontmatter lags.** Both milestones needed a 3-source reconciliation at audit for empty/omitted `requirements_completed` fields.
4. **Vendor a native-fixed eval harness on Windows/arm64.** The upstream skill-creator runner was broken in both milestones; the gitignored `.claude/skills/<skill>-workspace/` copy is the ground-truth path.
