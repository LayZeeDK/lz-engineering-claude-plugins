---
phase: 15
phase_name: "lz-red Skill Scaffold & Description Boundary"
project: "lz-engineering-claude-plugins"
generated: "2026-07-18"
counts:
  decisions: 5
  lessons: 4
  patterns: 4
  surprises: 3
missing_artifacts:
  - "UAT.md"
---

# Phase 15 Learnings: lz-red Skill Scaffold & Description Boundary

## Decisions

### Reference tree clustered by decision-procedure step, not by source author or phase
Adopted the ARCHITECTURE.md 10-file `references/` layout verbatim: six flat single-topic
docs plus one `testing-stance/` navigation subdir (index + three leaves). Cohesion axis is the
coach's decision-procedure step, which means a doc can be co-edited by more than one later
phase (e.g. `test-structure-and-assertions.md` spans STR in Phase 16 and ASRT in Phase 17).

**Rationale:** Matches lz-tpp's flat grain plus lz-refactor's index-is-navigation-only
convention; a file-per-author layout would fragment one decision procedure (ARCHITECTURE
Anti-Pattern 1). Files crossing phase boundaries is acceptable -- requirement ownership is by
content, not by file.
**Source:** 15-CONTEXT.md (D-01), 15-01-PLAN.md

### Reference stubs are thin content contracts, coach procedure is a labeled placeholder
Every stub carries only a title + scope bullets + the requirement IDs it satisfies + a
`Populated in Phase NN` marker + a sources placeholder -- no real prose or TS/Vitest examples
(Phases 16-17). The SKILL.md numbered coach procedure is a labeled placeholder deferred to
Phase 18.

**Rationale:** Keeps Phase 15's diff scoped to the scaffold; mirrors the Phase 6 lz-refactor
scaffold exactly (which left a Phase-9 coach placeholder). Satisfies success-criterion 2
without pulling content work forward.
**Source:** 15-CONTEXT.md (D-02, D-04), 15-01-SUMMARY.md

### v1 three-way-guarded description now, empirical tuning deferred to Phase 20
Drafted a language-agnostic description that leads with a positive RED-phase trigger and
carries two reciprocal exclusion clauses (make-the-failing-test-pass -> lz-tpp;
restructure-passing-code -> lz-refactor), folded length 1091 chars (<= 1536). Empirical
trigger recall/specificity is deferred to Phase 20 (EVL-01).

**Rationale:** Mirrors the Phase 6 precedent (lz-refactor shipped a scaffold-time description
and deferred tuning to Phase 11). Reciprocity (each of the three skills points at the other
two) is the locked triggering pattern.
**Source:** 15-CONTEXT.md (D-06/D-07/D-08), 15-RESEARCH.md

### Version bump and manifest edits deferred out of the scaffold phase
Left `plugin.json` at 0.0.2 and `marketplace.json` untouched; did not edit lz-tpp/SKILL.md
(the reverse pointer is Phase 18) or create an eval workspace / .oracle content.

**Rationale:** Overrides ARCHITECTURE.md's "Phase A bumps version" because the ROADMAP phase
split is fixed and 0.0.2 bumped the version in the Distribution phase (Phase 10), not the
scaffold phase (Phase 6). `claude plugin validate .` exits 0 without a bump because skills are
auto-discovered.
**Source:** 15-CONTEXT.md (D-03/D-09/D-10), 15-VERIFICATION.md

### Single-plan wave executed sequentially (no worktree isolation)
The phase was planned as one plan / one wave; the orchestrator ran the executor in sequential
mode on the phase branch rather than in an isolated worktree.

**Rationale:** Worktree isolation exists to de-conflict parallel agents; a single-plan wave
gains nothing from it and only adds merge/cleanup surface. Sequential mode is a first-class
documented mode and let the executor commit directly + update STATE/ROADMAP itself.
**Source:** 15-01-SUMMARY.md (execution mode), orchestrator decision

---

## Lessons

### The sibling description char budget was stale; the current shipped value is the ground truth
CONTEXT.md and early research cited lz-refactor's description as 774 chars, but that was its
scaffold-time (Phase 6) length; the current shipped value is 1245 (post Phase-11 tuning).
lz-red's v1 (1091) sits between the siblings with headroom under the 1536 cap.

**Context:** A "measured, not assumed" recheck of the on-disk sibling corrected a planning
assumption before it could mislead the description budget. Measure the current artifact rather
than trusting a historical number.
**Source:** 15-RESEARCH.md (budget correction)

### git grep acceptance checks false-negative on an untracked new file until it is staged
The executor's `git grep -F` link-resolution assertions briefly reported false negatives on
the just-created (untracked) SKILL.md; staging the file resolved it with no content change.

**Context:** `git grep` searches the index/tracked files by default; a brand-new untracked
file is invisible to it. For acceptance checks on files a task just created, stage first or use
`rg` (which reads the working tree).
**Source:** 15-01-SUMMARY.md (Issues section)

### A Markdown-only scaffold needs no test framework -- the structural gate IS the Nyquist instrument
Nyquist validation for this phase is fully satisfied by `claude plugin validate .` plus inline
mechanical assertions (`test -f`, `wc -l < 500`, `git grep -F` link resolution, folded
description char count, frontmatter-key shape). No Vitest/Jest/pytest harness was added.

**Context:** The no-new-deps scope fence (REQUIREMENTS Out-of-Scope) forbids adding a test
framework; the nyquist-auditor confirmed COVERED and flipped `nyquist_compliant: true` without
generating test files. "No test files created" is the correct outcome for a docs scaffold.
**Source:** 15-VALIDATION.md, gsd-nyquist-auditor verdict

### Under --auto, the trap-quadrant gray-area rule is what makes autonomous discuss safe here
All six gray areas were auto-resolved because each was high-confidence (explicit ARCHITECTURE
research + a direct Phase 6 precedent + fixed ROADMAP scope). None fell in the
high-impact/low-confidence quadrant that would have required interrupting the autonomous pass.

**Context:** A heavily pre-researched scaffold phase with a direct prior-milestone template is
exactly the case where --auto is low-risk; the safety check is per-gray-area confidence, not a
blanket "auto is fine."
**Source:** 15-CONTEXT.md, 15-DISCUSSION-LOG.md

---

## Patterns

### Mine the prior scaffold's scaffold-TIME commit snapshots, not its current filled state
The pattern-mapper recovered Phase 6's original scaffold commits (the lz-refactor SKILL.md
router-body snapshot and the original reference-stub snapshot) to give the executor the exact
"stub carries only a content contract" and "coach section is a labeled placeholder" templates
-- which the current, now-filled sibling no longer shows.

**When to use:** Any "copy-adapt from a prior scaffold" phase. The analog you want is the
sibling's state at ITS scaffold phase, recoverable from history, not its shipped state.
**Source:** 15-PATTERNS.md

### Allowlist-inversion security verification -- assert only the approved value, never write the forbidden one
15-SECURITY.md verified the maintainer-PII threat by asserting the only email-shaped token
permitted in the 11 files is the public gmail (result: none present) and confirming
author/committer identity -- without ever writing the forbidden work-email/domain, even as a
search needle.

**When to use:** Every public-repo hygiene check on maintainer identity. Encoding the forbidden
value to "detect" it is itself the leak.
**Source:** 15-SECURITY.md

### Instrument-first structural Wave-0 gate for docs/config phases
For phases with no runtime surface, define the Wave-0 gate as `claude plugin validate .` plus
inline shell assertions rather than a committed checker or a test framework. The plan's
`<verification>` steps ARE the instrument.

**When to use:** Markdown/config scaffolds where the deliverable is structure + a validator
gate, and adding a harness would violate a no-deps constraint (defer any real harness to the
eval phase).
**Source:** 15-VALIDATION.md, 15-RESEARCH.md (Validation Architecture)

### Cross-skill triggering via reciprocal exclusion clauses in the description
The dual-mode-by-omission frontmatter puts the entire triggering burden on the `description`;
a three-way boundary is drawn by leading with the positive intent and reserving the tail for
one exclusion clause per sibling skill (name each sibling and its step).

**When to use:** Adding a skill to a family where near-miss collisions with siblings are the
main triggering risk; pairs with a deferred empirical trigger eval to tune it.
**Source:** 15-01-PLAN.md (SKL-03), plugins/lz-tdd/skills/lz-refactor/SKILL.md (the template)

---

## Surprises

### An archived 0.0.2 artifact committed the maintainer work-domain as an escaped search needle
The security auditor flagged that `.planning/milestones/lz-tdd@0.0.2-phases/06-.../06-SECURITY.md`
committed the forbidden work-domain as an escaped `rg` needle -- the exact allowlist-inversion
anti-pattern the maintainer-identity rule warns against, sitting in already-committed history.

**Impact:** Out of Phase 15's scope, but a real pre-existing public-repo hygiene leak that
needs a separate remediation decision (check push state -> scoped history rewrite, or leave).
Flagged for the maintainer; deliberately not folded into this autonomous run.
**Source:** 15-SECURITY.md (auditor scope note)

### Code review caught a fill-phase pointer that contradicted the traceability table
The SKILL.md coach placeholder cited "authored in Phase 18 (... RTR-02/03)", but RTR-03 is
scoped Phase 17 (the "listen to the tests" meta-rule, a reference-content item), not Phase 18
(the coach routing step, RTR-02). Fixed to `RTR-02` (WR-01).

**Impact:** Low -- a placeholder pointer, forward-only -- but an inaccurate fill-phase pointer
would have misdirected Phases 16-18. A standard-depth review of an 80-line router surfaced it.
**Source:** 15-REVIEW.md (WR-01), commit 81e446b

### The stock quality profile leaves verification-tier agents off Opus
This session initially ran with explicit per-agent `model_overrides` forcing every agent
(including the verification tier) to Opus; the stock `quality` profile actually assigns Sonnet
to verifier / plan-checker / nyquist-auditor / etc.

**Impact:** Surfaced when reconciling the model configuration -- "quality" is Opus-everywhere-
EXCEPT-verification, so "Opus for all agents" required the overrides (later removed by explicit
maintainer directive in favor of the stock profile). Worth knowing when a phase wants a
specific tier for a specific role.
**Source:** STATE.md / config.json reconciliation during the session
