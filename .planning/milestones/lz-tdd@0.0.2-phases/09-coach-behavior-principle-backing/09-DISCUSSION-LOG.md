# Phase 9: Coach Behavior & Principle-Backing - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-08
**Phase:** 9-Coach Behavior & Principle-Backing
**Mode:** `--analyze --auto` (discuss-phase only; auto-advance to plan-phase suppressed per user)
**Areas discussed:** Coach-procedure placement, Beck-backing placement, Harness gate + IN-02, Coach routing source-of-truth

---

## GA-1: Coach decision procedure placement

| Option | Description | Selected |
|--------|-------------|----------|
| Inline in SKILL.md | Replace the reserved "deferred to Phase 9" placeholder; core behavior auto-loads with the skill | [x] |
| New references/coach-procedure.md | Compact inline pointer + detailed tree in a reference doc; leanest router | |

**Auto-selected:** Inline compact procedure in SKILL.md (recommended).
**Notes:** Core auto-trigger behavior, not heavy catalog material; scaffold reserved the inline slot. Split-to-reference only if the < 500-line router budget (SKEL-02) would be breached. Reversible (move a section + one pointer). Trap-quadrant check: reversible, not a frozen contract -> safe to auto-lock.

---

## GA-2: Beck TDD + Tidy First? backing placement

| Option | Description | Selected |
|--------|-------------|----------|
| Separate no-oracle files per source | One file per unowned source, mirroring the standalone Feathers file; clean provenance split | [x] |
| Append tagged sections to principles.md | Fewest files; mixes oracle Fowler with no-oracle Beck in one file | |
| One combined principles-backing.md | Provenance split from Fowler; both Beck books in one file | |

**Auto-selected:** Separate no-oracle reference files, one per unowned source (recommended).
**Notes:** Preserves oracle/no-oracle provenance separation and DST-04 tagging; symmetric with the existing `refactoring-without-tests.md`. `principles.md` stays the Fowler-oracle file with cross-ref pointers. Exact filenames deferred to research/planning.

---

## GA-3: Phase 9 harness gate + carried-in IN-02 tech debt

| Option | Description | Selected |
|--------|-------------|----------|
| Structural checker (instrument-first) + fold IN-02 | RED->GREEN gate for PRIN presence/tags + coach cross-links; action IN-02 fence-aware fix at its named trigger | [x] |
| skill-reviewer + existing gates only | Less harness code; breaks instrument-first pattern; IN-02 deferred again | |

**Auto-selected:** Add structural checker + fold IN-02 (recommended).
**Notes:** Matches every prior phase's Nyquist pattern. Roadmap (ROADMAP.md:174) names a Phase 9 principle reference as IN-02's explicit trigger and directs folding it into the next plan that touches the harness -- this is that plan; fix in the shared helper once, never per-checker. Behavioral routing accuracy stays with Phase 11 (EVL-02).

---

## GA-4: Coach routing source-of-truth

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse smells.md + smell leaves | Procedure layers only the routing dimension on the existing trigger table; DRY | [x] |
| New consolidated routing table | One-stop table inside the procedure; duplicates the smell->refactoring maps | |

**Auto-selected:** Reuse smells.md + leaves (recommended).
**Notes:** Preserves the locked "navigation-only index -> open the leaf for candidates" design (check-smells enforces it). The procedure adds mechanical->Fowler / repeated-complex->Kerievsky / unwarranted-pattern->functional / no-tests->Feathers routing plus the refactor-vs-green-step classify gate.

## Claude's Discretion

- Exact principle-reference filenames; inline-vs-split for the coach procedure (gated on the 500-line budget); extend-vs-new-file for the checker. Left to the researcher/planner within D-01/D-02/D-06/D-09.

## Deferred Ideas

- Full Beck *Tidy First?* tidyings catalog (FUT-01) -- needs the book for oracle verification.
- Behavioral routing-accuracy evals (EVL-02) -- Phase 11.
- Version bump / README / CHANGELOG / review / ship hygiene (DST-01..04) -- Phase 10.
- Native FP as its own skill (FUT-04) -- tracked, not now.
