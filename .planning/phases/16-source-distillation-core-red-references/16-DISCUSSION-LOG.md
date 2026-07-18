# Phase 16: Source Distillation & Core RED References - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-19
**Phase:** 16-source-distillation-core-red-references
**Mode:** --analyze --auto --chain (autonomous single pass; one operator escalation)
**Areas discussed:** Oracle source provisioning (ESCALATED), source tagging, reference-slice
scope, test-selection content, test-structure content, test-naming content, TS example
validation

---

## Oracle source provisioning (ESCALATED to operator per instruction)

Operator instruction on invocation: "Escalate to me if we need books and video transcripts
added to `.oracle/`." Phase 16 Success Criterion 1 requires owned RED sources in git-ignored
`.oracle/`, which held only the three 0.0.2 books (GoF, Fowler, Kerievsky). This was escalated
via AskUserQuestion.

### Q1 -- owned books

| Option | Description | Selected |
|--------|-------------|----------|
| Add both books now | Operator places Clean Code + 99 Bottles (JS Ed) under `.oracle/`; both distilled full clean-room | Yes |
| Clean Code now, defer 99 Bottles | Only Clean Code now; 99 Bottles' heavy use is Phase 17 | |
| Neither - treat as no-oracle | Distill from high-confidence core only; SC-1 clean-room not met | |

**Operator's choice:** Added BOTH books now.
**Notes:** Operator corrected the edition -- *99 Bottles of OOP* is **2nd Edition, JavaScript
Edition** (the Ruby-only 1st ed is not the source). Verified on disk: `.oracle/clean-code/`
and `.oracle/99-bottles-2e-js/`, each with `index.md` + full chapter set.

### Q2 -- talk transcripts

| Option | Description | Selected |
|--------|-------------|----------|
| No transcript for Phase 16 | Non-owned sources handled no-oracle; Cooper talk at Phase 17 | |
| Provision Cooper talk now too | Add Cooper's talk transcript now for a shared 16/17 oracle setup | Yes (both talks) |
| I have another talk to add | Operator names a specific talk | |

**Operator's choice:** Added Ian Cooper's "TDD, Where Did It All Go Wrong" (DevTernity) AND the
follow-up "TDD Revisited" (NDC Porto 2023) to `.oracle/` as flat transcripts.
**Notes:** Both are git-ignored, ~56-60 KB, ~1500 transcript segments each. Primary use is
Phase 17; Phase 16 uses them only lightly (SEL/NAME). Clean-room own-words only (DST-04).

---

## Source tagging (owned vs no-oracle) -- auto (recommended)

**Trade-off:** owned sources (in `.oracle/`) can be oracle-gated for fidelity; unowned sources
must be authored from high-confidence core and tagged no-oracle (0.0.2 precedent for
Beck/Feathers). Mixing them without tags risks a false claim of oracle verification.

**Auto-selected:** OWNED/oracle-gated = Clean Code, 99 Bottles 2e JS, both Cooper talks.
NO-ORACLE/high-confidence-core = Beck (TDD by Example), Wake (AAA), North (GWT/BDD), Osherove
(naming). See CONTEXT.md D-02.

## Reference-slice scope -- auto (recommended)

**Trade-off:** filling a whole co-edited stub in Phase 16 would collide with Phase 17/18 slices
(ARCHITECTURE Anti-Pattern 1 = per-source fragmentation). Filling only the phase's requirement
slice and leaving the "Populated in Phase NN" markers keeps the stubs co-editable.

**Auto-selected:** three-laws-and-test-selection.md = SEL slice only; test-structure-and-assertions.md
= STR slice only; naming.md = full. See CONTEXT.md D-04.

## Test-selection content (SEL-01/02) -- auto (recommended)

**Auto-selected:** test list + one small step + degenerate/starter-first (D-05); triangulation
as a RED-facet SELECTION move bounded against lz-tpp's GREEN fake-it/generalize (D-06, boundary
sentence load-bearing per SC-2).

## Test-structure content (STR-01/02) -- auto (recommended)

**Auto-selected:** AAA (Wake) + GWT (North) as one skeleton in two vocabularies, match the house
idiom, impose no school (D-07); assert-first + evident data + one-concept-per-test (D-08).

## Test-naming content (NAME-01) -- auto (recommended)

**Auto-selected:** "should" naming primary (North); Osherove three-part alternative; match the
codebase's naming stance; Metz name-the-behavior rationale (D-09).

## TS example validation -- auto (recommended)

**Trade-off:** shipped `plugins/lz-tdd` must carry no build deps (Out-of-Scope), but SC-5 requires
tsc --strict-clean examples. The 0.0.2 answer was a dev-only workspace extractor.

**Auto-selected:** minimal RED illustrations, Vitest `it`/`expect` surface only (deep mechanics =
Phase 17); tsc --strict validated in a dev-only workspace mirroring lz-refactor-workspace's
one-module-per-fence extractor; oracle-reviewer + no-verbatim gate on owned surfaces (D-10, D-11,
D-12).

---

## Claude's Discretion

- Exact own-words wording of each selection / structure / naming heuristic.
- Exact minimal TS/Vitest example per reference.
- Reuse the lz-refactor-workspace tsc extractor vs. stand up a minimal lz-red one (tsc gate
  mandatory either way).
- Whether Phase 16 opens with an instrument-first Wave-0 (empty-ref RED baseline).

## Deferred Ideas

- Assertion design + Khorikov four pillars + Metz message matrix + stance router + Vitest deep
  mechanics + anti-patterns + Test Desiderata -> Phase 17.
- Three Laws spine + fail-for-the-right-reason + classify-first + lz-tpp seam -> Phase 18.
- plugin.json 0.0.3 bump + README + CHANGELOG + validators -> Phase 19.
- Eval workspace + trigger/behavior evals + description tuning -> Phase 20.
