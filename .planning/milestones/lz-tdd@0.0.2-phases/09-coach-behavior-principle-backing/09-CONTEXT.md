# Phase 9: Coach Behavior & Principle-Backing - Context

**Gathered:** 2026-07-08
**Status:** Ready for planning

> Auto-discussed (`--analyze --auto`, discuss-phase only). Four phase-specific gray
> areas were auto-resolved to their recommended options with trade-off tables. All
> four are reversible Markdown / harness authoring decisions (no frozen contract,
> schema, or shipped-code rework) -- so none fell in the high-impact + low-confidence
> trap quadrant, and `--auto` locking is appropriate (as it was for Phase 8.2).
> Several coach sub-behaviors were pre-decided by the Phase 6 scaffold and the Phase
> 8.2 context and are carried forward, not re-asked.

<domain>
## Phase Boundary

Wire the dual-mode coach behavior into the already-built `lz-refactor` skill and author
the three no-oracle principle-backing references -- on top of the catalogs that already
exist (Fowler, Kerievsky, GoF, extra-patterns, functional; the unified smell taxonomy;
the Fowler Ch.2 principles). Concretely:

- Replace the "deferred to Phase 9" coach-decision-procedure placeholder in
  `SKILL.md` with the real procedure: smell -> named-refactoring routing
  (mechanical -> Fowler, repeated/complex-structure -> Kerievsky), the
  over-/under-engineering (de-patterning) balance routed to the functional-catalog,
  behavior-preservation discipline with a no-tests fallback to Feathers, the
  red-green-refactor seam with lz-tpp, and the functional-alternative surfacing
  (CCH-01..06).
- Author the three principle-backing references (PRIN-01 Beck *TDD by Example*,
  PRIN-02 Beck *Tidy First?*, PRIN-03 Feathers *Legacy Code* -- the last already
  stubbed at `refactoring-without-tests.md`), tagged no-oracle, high-confidence core
  only, DST-04-clean.
- Instrument the phase to a RED->GREEN structural gate consistent with prior phases.

**Out of scope (own phases):** version bump / README / CHANGELOG / first-party review
(Phase 10); behavioral routing-accuracy evals with-skill vs baseline (Phase 11); any
NEW catalog content (all catalogs are complete). Behavioral routing correctness is
NOT machine-checked here -- that is Phase 11's EVL-02.

</domain>

<decisions>
## Implementation Decisions

### Coach decision procedure (CCH-01..06)
- **D-01:** The coach decision procedure lives INLINE in `SKILL.md`, replacing the existing "Coach decision procedure (deferred to Phase 9)" placeholder section. It is the skill's core auto-trigger behavior (not heavy catalog material), and the Phase 6 scaffold reserved this inline slot. Heavy content stays in `references/`. [auto: recommended; GA-1]
- **D-02:** Router size budget guard -- `SKILL.md` MUST stay < 500 lines (SKEL-02). If the compact inline procedure would breach the budget, split ONLY the detailed decision tree into a new `references/coach-procedure.md` and keep a compact routing summary inline. The researcher/planner confirms the line count and picks inline-only vs inline-summary+ref. [auto: recommended; GA-1 fallback]
- **D-03:** Coach routing source-of-truth is the EXISTING `smells.md` + smell leaves -- no new duplicate smell->refactoring table. The procedure adds only the routing dimension on top: mechanical smell -> Fowler refactoring; repeated / complex-structure smell -> Kerievsky pattern-directed refactoring; unwarranted pattern -> functional-catalog de-patterning; missing tests -> Feathers. Preserves the locked "navigation-only index -> open the leaf for candidates" design (check-smells enforces it). [auto: recommended; GA-4]
- **D-04:** The procedure opens with the classify-the-request gate already framed in `SKILL.md` ("Refactoring vs the green step"): if a red test must be made to pass, that is lz-tpp (green step), not this skill. CCH-05 (the lz-tpp seam) extends the existing two-hats framing in `principles.md` -- do not re-derive it.
- **D-05:** CCH-06 functional-alternative surfacing routes to the `functional-catalog` (built in Phase 8.2). For a dissolvable pattern the coach names "pattern X disappears via FP idiom Y / TS feature Z" and follows the one-line `Functional alternative:` cross-links that already exist on the OO leaves; it also gives the Replace-Pipeline-with-Loop reverse-direction guidance (clarity is the default; reverse to a loop only on a measured hot path or a named house-style reason) already noted in the Fowler `replace-loop-with-pipeline.md` leaf.

### Principle-backing references (PRIN-01..03)
- **D-06:** Beck *TDD by Example* (PRIN-01) and Beck *Tidy First?* (PRIN-02) each get their OWN no-oracle reference file, mirroring the standalone Feathers file (`refactoring-without-tests.md`, PRIN-03, already stubbed). `principles.md` stays the Fowler-oracle file and gains cross-ref pointers to the backing files. Preserves oracle/no-oracle provenance separation and DST-04 tagging. Exact filenames are the researcher/planner's call. [auto: recommended; GA-2]
- **D-07:** All three principle references are tagged NO-ORACLE, high-confidence CORE only. Unlike Phase 8.2 (which had a committed research artifact as its no-oracle anchor), Beck/Feathers have NO owned oracle AND NO committed research doc. The correctness anchor is therefore: high-confidence core scope only + skill-reviewer PASS + DST-04 hygiene (original prose, no verbatim book prose/code). Downstream planning MUST NOT open the Phase 6 D-09 AskUserQuestion oracle-access checkpoint for these -- there is no book to verify against (same posture as Phase 8.2 D-06).
- **D-08:** PRIN core scope is fixed by the roadmap SC #6 and REQUIREMENTS, do not expand: Beck TDD = cycle + two rules + Fake It / Triangulate / Obvious Implementation, scoped to seam context; Beck Tidy First? = structural-vs-behavioral separation + refactor economics (coupling / cohesion / options), cross-referenced to overlapping Fowler refactorings, no complete tidyings catalog claimed (FUT-01); Feathers = seams, characterization tests, the change algorithm, Sprout/Wrap Method+Class, Subclass and Override Method, Extract Interface (the stub's content contract already lists these).

### Harness gate (instrument-first) + carried-in tech debt
- **D-09:** Add a structural checker gate for Phase 9 following the instrument-first / Nyquist pattern (RED baseline before content, GREEN when authored) used by every prior phase. It asserts: the 3 principle references exist; each carries its required core topic tokens (line-oriented, like `check-principles.mjs`); each carries the no-oracle tag; and the new coach cross-links resolve (via the existing `check-crossrefs`). Extend `check-principles.mjs` or add a sibling `check-backing.mjs` -- planner's call -- and wire it into `package.json`'s `npm run check` battery. [auto: recommended; GA-3]
- **D-10:** Fold the carried-in Phase 08.2 tech debt IN-02 (make H1/heading detection fence-aware in a shared helper imported by check-gof / check-kerievsky / check-extra-patterns / check-functional, alongside `githubSlug`) INTO the checker plan of this phase. The roadmap names a Phase 9 principle reference as IN-02's explicit trigger and directs folding it into "whichever plan next touches the checker harness" -- this phase touches it. A per-checker patch is forbidden (re-introduces the divergence the 08.2 fixer correctly declined); do it once in the shared helper.
- **D-11:** Author principle-reference content to keep IN-02 dormant-safe regardless: prefer TS fences or fence-free prose; avoid non-TS fenced blocks (bash/yaml/toml/dockerfile) with a column-0 `#` line. If such a block is genuinely needed, D-10's fence-aware fix must already be in place first.

### Claude's Discretion (deferred to research/planning)
- **D-12:** Exact principle-reference filenames, the inline-vs-split decision for the coach procedure (gated on the 500-line budget), and extend-vs-new-file for the checker are HOW micro-decisions left to the researcher/planner within D-01/D-02/D-06/D-09. [auto: downstream's job]

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Roadmap & requirements
- `.planning/ROADMAP.md` -> "Phase 9: Coach Behavior & Principle-Backing" -- goal, dependencies (7 / 8 / 8.1 / 8.2), the six Success Criteria, AND the "Carried-in tech debt" note (IN-02, at ROADMAP.md:174) that D-10 actions.
- `.planning/REQUIREMENTS.md` -> "Coach Behavior" (CCH-01..06) and "Principle-Backing Cross-References (no owned oracle -- high-confidence core only)" (PRIN-01..03).

### The skill being wired (edit targets)
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` -- the lean dual-mode router; the "Coach decision procedure (deferred to Phase 9)" placeholder (:38-43) is the D-01 edit target; the "Refactoring vs the green step" section (:33-36) is the D-04 classify gate.
- `plugins/lz-tdd/skills/lz-refactor/references/principles.md` -- Fowler Ch.2 (oracle-verified); stays the Fowler file, gains D-06 cross-ref pointers; two-hats framing (:18-24) is the CCH-05 seam anchor.
- `plugins/lz-tdd/skills/lz-refactor/references/refactoring-without-tests.md` -- the PRIN-03 Feathers stub with its content contract + core-techniques list already present; populate in this phase.
- `plugins/lz-tdd/skills/lz-refactor/references/smells.md` (+ `references/smells/` leaves) -- the D-03 coach trigger table (navigation-only index; candidate refactorings live in the leaves).

### Routing targets the coach procedure links to (already built)
- `plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/README.md` -- mechanical-smell routing target.
- `plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/README.md` -- repeated/complex-structure + de-patterning-Away routing target.
- `plugins/lz-tdd/skills/lz-refactor/references/gof-catalog/README.md`, `.../extra-patterns-catalog/README.md` -- target-pattern lookups.
- `plugins/lz-tdd/skills/lz-refactor/references/functional-catalog/README.md` -- CCH-02 de-patterning + CCH-06 functional-alternative routing target (the one-line `Functional alternative:` cross-links on OO leaves already point here).

### Harness (instrument-first gate + IN-02)
- `.claude/skills/lz-refactor-workspace/tools/check-principles.mjs` -- the line-oriented topic-token presence checker to extend or mirror for D-09.
- `.claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs` -- enforces link resolution; picks up the new coach cross-links; its header notes the same fence-blind gap IN-02 fixes.
- `.claude/skills/lz-refactor-workspace/tools/` (check-gof / check-kerievsky / check-extra-patterns / check-functional, `lib/`, `githubSlug`) -- the four `collectLeaves` call sites D-10's shared fence-aware helper must serve; `package.json` `npm run check` battery wiring.

### Prior context carried forward
- `.planning/phases/08.2-functional-catalog-inserted/08.2-CONTEXT.md` -- the no-oracle posture (D-06 there) this phase mirrors for Beck/Feathers, and the deferred-to-Phase-9 coach routing (CCH-02/04/06) now in scope.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `check-principles.mjs` -- a tiny, line-oriented topic-token presence checker (node builtins only); the exact template to extend/mirror for the D-09 principle-backing gate. RED-against-empty-stub baseline is the intended starting point.
- The Feathers stub (`refactoring-without-tests.md`) already declares a per-entry content contract (Technique / When-to-use / Distilled mechanics) and the core-techniques list -- author against it directly.
- The `SKILL.md` router already carries every routing pointer the coach procedure needs (Fowler, smells, principles, Kerievsky, GoF+extra, functional, Feathers) -- the procedure references them, it does not add new pointers.
- The functional-catalog + the one-line `Functional alternative:` cross-links on the OO leaves (Phase 8.2) are the CCH-06 substrate -- already built and check-functional-gated.

### Established Patterns
- Instrument-first / Nyquist scaffold: build the checker to a RED baseline BEFORE authoring content; requirements close only when the full `npm run check` battery goes GREEN (Phases 7 / 8 / 8.1 / 8.2 pattern).
- No-oracle content discipline: DST-04 clean-room (original prose, no verbatim book prose/code) applies with no oracle; correctness anchored by high-confidence-core scope + skill-reviewer + hygiene (weaker than an owned oracle -- keep scope tight).
- Shared-helper-once for cross-checker gaps (D-10): fix IN-02 in one imported helper, never per-checker (the 08.2 fixer's rationale).

### Integration Points
- New coach cross-links from `SKILL.md` (and any `coach-procedure.md`) + the 3 principle refs into the catalogs / smells / functional-catalog -- all enforced by `check-crossrefs`.
- `principles.md` <-> the two Beck backing files (D-06 cross-ref pointers).
- The new checker wired into the `package.json` `npm run check` battery + typecheck + `claude plugin validate .`.

</code_context>

<specifics>
## Specific Ideas

- The coach procedure is a compact decision tree, NOT a table dump: classify (refactor vs green-step/lz-tpp) -> recognize smell (smells.md) -> open leaf for candidates -> route by kind (mechanical->Fowler / repeated-complex->Kerievsky / unwarranted-pattern->functional de-patterning) -> apply behavior-preservation discipline (small steps, run tests after each) -> if no tests, route to Feathers.
- CCH-02 de-patterning is explicitly BROADER than the Kerievsky Away direction: it also routes to the functional-catalog (a pattern dissolving into an FP idiom), per the Phase 8.2 re-scope.
- Beck/Feathers references are tagged no-oracle inline (visible provenance marker), same spirit as the functional-catalog's `## Sources` no-oracle note -- but with NO research artifact to cite.
- PRIN-02 (Tidy First?) must cross-reference OVERLAPPING Fowler refactorings by link, not restate them.

</specifics>

<deferred>
## Deferred Ideas

- Full Beck *Tidy First?* tidyings catalog -- FUT-01, requires acquiring the book for oracle verification; this phase claims only the high-confidence core.
- Behavioral routing-accuracy evals (coach recommends the correct next refactoring, with-skill vs baseline) -- EVL-02, Phase 11 (late, non-blocking).
- Version bump / README / CHANGELOG / first-party review / hygiene ship gate -- Phase 10 (DST-01..04).
- Native FP as its own `lz-refactor-to-patterns` skill (FUT-04) -- tracked, not now.
- None of these are scope creep into Phase 9 -- all are downstream/future by design.

</deferred>

---

*Phase: 9-Coach Behavior & Principle-Backing*
*Context gathered: 2026-07-08*
