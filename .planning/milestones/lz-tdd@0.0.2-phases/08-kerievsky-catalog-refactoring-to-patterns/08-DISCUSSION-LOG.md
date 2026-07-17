# Phase 8: Kerievsky Catalog (Refactoring to Patterns) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-05
**Phase:** 8-kerievsky-catalog-refactoring-to-patterns
**Mode:** `--analyze --auto --chain` (autonomous single pass; recommended option auto-selected per gray area)
**Areas discussed:** catalog split axis, direction model, GoF cross-ref sourcing, Ch.4 smell fold + dedup, example discipline

---

## Catalog Split Axis

| Option | Description | Selected |
|--------|-------------|----------|
| Per-refactoring leaves, index grouped by the book's 6 chapters (Creation/Simplification/Generalization/Protection/Accumulation/Utilities) | Mirrors the LOCKED Phase-7 Fowler model; the book's own authoritative grouping | ✓ |
| Split leaves by direction (To/Towards/Away) | Direction is a per-leaf field, not a file axis; a refactoring can go multiple directions | |
| Split by GoF pattern family | Fragments the catalog; diverges from the book's own structure | |

**Choice (auto, recommended):** per-refactoring leaves + chapter-grouped thin index (D-01).
**Notes:** IMPACT medium, CONFIDENCE HIGH (mirrors 07-ROUTING-ARCHITECTURE.md, converged cleanly in Phase 7). Not in the trap quadrant.

---

## Direction Model (To/Towards/Away)

| Option | Description | Selected |
|--------|-------------|----------|
| Per-leaf `Direction:` field + explicit Away callout for the 3 named de-patterning cases; harness-asserted | Matches the Phase-6 stub content contract; feeds Phase 9 de-patterning routing | ✓ |
| Separate `directions.md` doc | Extra file; splits the direction from the refactoring it describes | |
| Group leaves by direction | Same objection as the split-by-direction catalog axis | |

**Choice (auto, recommended):** per-leaf `Direction:` field + Away callouts for Inline Singleton, Move Accumulation to Visitor, Encapsulate Composite with Builder (D-03).
**Notes:** IMPACT medium, CONFIDENCE HIGH (stub pre-specifies this field). Not in the trap quadrant.

---

## GoF Cross-Reference Sourcing (KRV-04)

| Option | Description | Selected |
|--------|-------------|----------|
| Pattern NAME only (vocabulary), oracle-verified from the Kerievsky book; AskUserQuestion = fallback for unresolvable targets | KRV-04 is "vocabulary only, no GoF text"; names are common knowledge; the Kerievsky book states each target pattern | ✓ |
| AskUserQuestion owner checkpoint for every GoF pattern | Over-escalation; the pattern names are non-copyrightable and oracle-verifiable from Kerievsky | |
| Source GoF intent prose from the owner's GoF e-book | Risks reproducing GoF text (DST-04); not needed for vocabulary | |

**Choice (auto, recommended):** pattern-name vocabulary, oracle-verified against `.oracle/refactoring-to-patterns/`; AskUserQuestion fallback only for an unresolvable target (D-04).
**Notes:** IMPACT medium but REVERSIBLE/additive (a richer GoF intent line can be added later via AskUserQuestion); CONFIDENCE HIGH for the safe name-only default. Not in the trap quadrant. Flagged as a plan-time re-open item (richer GoF intent line) and a plan-time fallback (AskUserQuestion for unresolvable pattern targets).

---

## Ch.4 Smell Fold + Dedup (KRV-03)

| Option | Description | Selected |
|--------|-------------|----------|
| Unique smells -> new source-tagged leaves; overlapping smells -> deduped tag + note on the existing Fowler leaf; per-smell MAP deferred to the oracle loop | Standard dedup; matches KRV-03 "source tags + deduplicated against Fowler's list"; preserves the LOCKED navigation-only index shape | ✓ |
| Add every Ch.4 smell as a separate Kerievsky-tagged leaf regardless of overlap | Creates un-deduped duplicates; violates KRV-03's dedup clause | |
| Rebuild the taxonomy with multi-source tags on every row | Re-touches all Phase-7 rows unnecessarily | |

**Choice (auto, recommended):** fold strategy locked (unique=new tagged leaves, overlap=deduped tag+note), exact per-smell MAP deferred to the oracle-gated authoring loop (D-05).
**Notes:** IMPACT medium-high, CONFIDENCE HIGH on the strategy; the exact overlap MAP correctly requires the `.oracle/` Ch.4 source and is deferred to execution (not decided blind). Not in the trap quadrant. Plan-time note: source tags LIGHTLY add to existing index rows (additive only) -- reconciles the Phase-7 "don't re-touch" note.

---

## Example Discipline (KRV-01)

| Option | Description | Selected |
|--------|-------------|----------|
| Mirror the LOCKED Fowler leaf example discipline: one compact TS before/after (cap 2), re-domained, tsc-clean; overflow-to-walkthrough for pattern-heavy cases | Consistent with Phase 7; overflow rule handles pattern-heavy refactorings; behavior-preservation gated by oracle-reviewer | ✓ |
| Full multi-step Java->TS pattern walkthroughs in every leaf | Bloats leaves; breaks progressive disclosure; against the LOCKED YAGNI overflow rule | |

**Choice (auto, recommended):** mirror the LOCKED Fowler leaf example rule with the overflow-walkthrough escape hatch (D-06).
**Notes:** IMPACT medium, CONFIDENCE HIGH. Not in the trap quadrant.

---

## Claude's Discretion

- Leaf slugs; entry ordering within a chapter group; exact index annotation format for Direction/GoF; `Composed Fowler primitive(s)` phrasing.
- Harness extension shape (extend `check-catalog`/`check-smells` vs a new `check-kerievsky`), kept off the shipped skill surface.
- oracle-reviewer sub-batch size (~6-8 leaves/call) and the per-axis rubric anchors (default to Phase-7 canonical anchors, adjusted for pattern-directed content).

## Carried-Forward LOCKED Decisions (not re-discussed -- reused from Phase 7)

- Clean-room `oracle`/`oracle-reviewer` loop over `.oracle/refactoring-to-patterns/index.md` (D-07); supersedes the stub's AskUserQuestion checkpoint for the `.oracle/`-present Kerievsky book, keeps AskUserQuestion for GoF + escalations.
- Orchestrator drives the loop INLINE, not via gsd-executor; branching_strategy=none, no worktrees (D-08).
- Deterministic-checks-before-oracle-calls; distinct example domains to avoid too_close_to_source; cross-link to leaf H1 anchors.

## Deferred Ideas

- Phase 9 coach decision procedure + de-patterning routing (CCH-01..05); Beck/Feathers principle-backing (PRIN-01..03).
- Splitting the Kerievsky layer into its own skill (FUT-04) -- only if it outgrows one skill.
- Richer per-refactoring GoF intent line beyond the name -- re-openable at plan review (D-04).
