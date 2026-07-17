# Phase 6: lz-refactor Skill Scaffold & Progressive Disclosure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-04
**Phase:** 6-lz-refactor Skill Scaffold & Progressive Disclosure
**Mode:** `--analyze --auto --chain` (autonomous selection; trade-off tables logged; auto-advance to plan)
**Areas discussed:** Router architecture, references/ decomposition, Scaffold stub strategy, description trigger strategy

> **--auto note:** All gray areas auto-selected; the recommended option was chosen
> for each without an interactive prompt. Phase 6 is scaffold-only and required NO
> authoritative oracle book access, so the user's standing "AskUserQuestion for
> oracle access" instruction did not fire (threaded forward to Phases 7-8 as D-09).

---

## Router architecture

| Option | Description | Selected |
|--------|-------------|----------|
| lz-tpp lean dual-mode only | Short dual-mode coach + a small "Reference material" pointer list | |
| angular-developer sections only | Task-area `##` sections each pointing to a `references/*.md`, no coach framing | |
| Hybrid (dual-mode framing + task-area-sectioned pointers) | lz-tpp Coach/Reference framing PLUS angular-developer sectioned pointer layout | ✓ |

**Choice:** Hybrid (D-01, D-02).
**Notes:** lz-refactor is both a coach (needs a decision procedure like lz-tpp) and
has a far larger reference surface than lz-tpp (5 task areas, ~93 catalog entries),
so it needs angular-developer's sectioned pointers. The phase goal names BOTH models
explicitly. Frontmatter kept minimal (name + description only) to match the in-repo
lz-tpp convention.

---

## references/ decomposition

| Option | Description | Selected |
|--------|-------------|----------|
| One file per task area (5 files) | fowler-catalog / smell-taxonomy / principles / kerievsky / without-tests, one file each | |
| Splittable catalogs, defer split axis | 5 task-area groups; the two big catalogs structured as multi-file/subdir; exact split axis decided in Phase 7/8 | ✓ |
| Few large files | Merge areas into 2-3 big reference files | |

**Choice:** Splittable catalogs, defer the axis (D-03, D-04).
**Notes:** 66 Fowler refactorings (each with mechanics + TS/JS example) cannot fit
one file under SKEL-04 ("no single file forces the whole catalog into context"). The
scaffold must make the catalogs splittable now; the exact split axis (Fowler tag-group
vs. book chapter; Kerievsky by direction vs. GoF family) is deferred to Phase 7/8
planning, where the owner e-book oracle is consulted -- avoiding a premature freeze.

---

## Scaffold stub strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Empty files | Create empty `references/*.md` so pointers resolve | |
| Stub + content-contract schema | Heading + scope line + "Populated in Phase N" + the per-entry contract each later phase fills | ✓ |
| Pre-create all 66/27 headings | Fully skeleton every catalog entry heading now | |

**Choice:** Stub + content-contract schema (D-05, D-06).
**Notes:** Stubs make `SKILL.md` pointers resolve (validate-clean) and document the
per-entry contract (Fowler: name/motivation/mechanics/TS-JS/provenance; Kerievsky:
name/intent/mechanics/TS-JS-from-Java/composed-Fowler-primitives/direction/GoF-xref)
WITHOUT fabricating oracle content. Empty files fail to communicate the contract;
pre-creating 66/27 headings over-engineers a scaffold and risks drift.

---

## description trigger strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Mirror lz-tpp dual-mode shape | "use it when [refactor step, smell present, next named refactoring] ... explain on demand ... do NOT use it for [near-misses]" | ✓ |
| angular-developer terse capability list | Flat "generates X / provides guidance on Y, Z" style | |
| Custom from scratch | Author a bespoke trigger description | |

**Choice:** Mirror lz-tpp dual-mode shape (D-07, D-08).
**Notes:** lz-tpp's description scored 100% recall / 100% specificity in Phase 5 evals;
its near-miss exclusion clause is what produced the specificity. Reuse the shape, tune
triggers for refactor-step / code-smell / refactoring-catalog / de-patterning, and add
the lz-tpp seam disambiguation (refactor step vs. green/transformation step) so the two
sibling skills do not cross-trigger. Empirical validation deferred to Phase 11 (EVL-01).

---

## Claude's Discretion

- Exact `SKILL.md` section ordering, stub wording, and individual file names within
  the agreed five-group structure.

## Deferred Ideas

- Full coach decision procedure (routing, de-patterning, behavior-preservation,
  Feathers fallback, lz-tpp seam detail) -> Phase 9.
- Catalog CONTENT (66 Fowler / 27 Kerievsky / 24+ smells / Ch.2 principles) -> Phases 7-8.
- Exact intra-catalog file split axis -> Phase 7/8 planning (oracle-informed).
- Version bump 0.0.2, README/CHANGELOG -> Phase 10.
- Skill-effectiveness evals -> Phase 11.
