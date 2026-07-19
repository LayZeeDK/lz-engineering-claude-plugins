# Phase 16: Source Distillation & Core RED References - Context

**Gathered:** 2026-07-19
**Status:** Ready for planning
**Mode:** --analyze --auto --chain (autonomous single pass; the one human-in-the-loop
point -- provisioning owned sources into `.oracle/` -- was escalated per operator
instruction and RESOLVED before this file was written).

## Provenance correction (2026-07-19, cross-phase, added during Phase 17)

Phase 17's execute-time oracle-reviewer found the query/command **message matrix** is Sandi Metz's
_The Magic Tricks of Testing_ talk, NOT _99 Bottles of OOP_ -- the two Metz works were conflated when
sources were provisioned here. The Phase-16 use of _99 Bottles_ for **test naming** ("name the
behavior, not the method") was separately oracle-gated and stands as a legitimately-owned source;
only the matrix attribution (a Phase-17 surface) was wrong, and it is corrected in the shipped tree
and in 17-CONTEXT. No Phase-16 shipped content changes. The `.oracle/` library has since been
expanded and reorganized (Metz/Bernhardt/Beck talks + Beck written content; transcripts now under
`.oracle/videos/`, written content under `.oracle/written-content/`).

## Owned-source upgrade (2026-07-20, added during Phase 17.1)

Phase 17.1 re-opened the closed Phase-16 test-selection and test-structure surfaces
(three-laws-and-test-selection.md, the test-structure-and-assertions.md STR slice, and the
principle-backing.md map) for a no-oracle -> owned tier upgrade, now that Kent Beck's essays are
provisioned in git-ignored .oracle/written-content/. The running test list, the one-step move, and
the starter / degenerate case were upgraded against Canon TDD, and triangulation against First One,
Then Many (both Access: free, so gateable). Assert-first and evident test data were flipped
provisionally against Canon TDD but are expected to revert to no-oracle: their primary source is
Test-Driven Development by Example, a copyrighted book held summary-only, so an owned tag holds only
if a free essay actually gates them under the orchestrator-driven oracle-reviewer gate.
Recommendation CONTENT was unchanged -- only attribution/tier text was edited. The touched
requirements (SEL-01, SEL-02, STR-02, DST-03, DST-04) stay Complete for Phase 16; this is a
provenance-tier upgrade, not reopened coverage.

<domain>
## Phase Boundary

Distill the RED-phase source facts CLEAN-ROOM into own words, and AUTHOR the three
core test-shaping references -- test SELECTION, test STRUCTURE, and test NAMING -- with
tsc --strict-clean TypeScript examples and zero verbatim source prose.

In scope (fills the requirement SLICES SEL-01, SEL-02, STR-01, STR-02, NAME-01):

- Clear the oracle-access checkpoint (mirrors 0.0.2's D-09): confirm the owned RED
  sources live git-ignored in `.oracle/`, then distill RED facts own-words via the
  oracle / oracle-reviewer clean-room agents (main context NEVER reads book/talk prose).
- Fill the SEL slice of `references/three-laws-and-test-selection.md` (test list, one
  small step, degenerate/starter-first, triangulation-for-selection bounded against
  lz-tpp's GREEN facet).
- Fill the STR slice of `references/test-structure-and-assertions.md` (Arrange-Act-Assert
  and Given-When-Then as one skeleton in two vocabularies; assert-first; evident test
  data; one-concept-per-test).
- Fill `references/naming.md` fully (behavior/"should" naming primary; Osherove three-part
  alternative).
- Every TypeScript sample in these three references is tsc --strict clean and has no
  verbatim book prose (oracle-reviewer + no-verbatim scan pass).

Explicitly NOT in this phase (fixed by ROADMAP -- these stubs are CO-EDITED, so leave the
"Populated in Phase NN" markers intact for later phases):

- Assertion design, Khorikov four pillars, Metz message matrix, stance router, Vitest deep
  mechanics, anti-patterns, Test Desiderata -> Phase 17.
- The Three Laws spine framing + fail-for-the-right-reason + classify-first + forward/reverse
  lz-tpp seam -> Phase 18.
- plugin.json 0.0.3 bump / README / CHANGELOG / validators -> Phase 19.
- Eval workspace + trigger/behavior evals + description tuning -> Phase 20.

</domain>

<decisions>
## Implementation Decisions

Requirements SEL-01, SEL-02, STR-01, STR-02, NAME-01 (see REQUIREMENTS.md) are the locked
scope. The decisions below are the HOW, auto-resolved from the ROADMAP Success Criteria
(5 items), the Phase-15 content-contract stubs, and the direct 0.0.2 clean-room precedent.
All were rated HIGH-confidence (success criteria explicit + stubs already name the source
clusters + 0.0.2 established the exact clean-room loop), so none was auto-locked in the
trap quadrant. The single genuinely user-owned decision (which sources to place in
`.oracle/`) was escalated and answered interactively.

### Oracle source access & clean-room (the escalation resolution)

- **D-01:** Oracle-access checkpoint CLEARED (mirrors 0.0.2's D-09). During this discussion
  the maintainer provisioned all RED-phase owned sources into git-ignored `.oracle/`:
  - `.oracle/clean-code/` (indexed subdir + `index.md`) -- Robert C. Martin, *Clean Code*.
    Load-bearing: Chapter 9 "Unit Tests" (Three Laws of TDD, F.I.R.S.T., one-concept-per-test)
    and Chapter 2 "Meaningful Names" (naming).
  - `.oracle/99-bottles-2e-js/` (indexed subdir + `index.md`) -- Sandi Metz + Katrina Owen,
    *99 Bottles of OOP*, **2nd Edition, JavaScript Edition** (NOT the Ruby-only 1st ed).
    Phase-16 load is light (name-for-behavior); its heavy role is Phase 17 (message matrix).
  - `.oracle/tdd-where-did-it-all-go-wrong-ian-cooper-yt-EZ05e7EMOLM.md` (flat transcript) --
    Ian Cooper, DevTernity.
  - `.oracle/tdd-revisited-ian-cooper-ndc-porto-2023-yt-IN9lftH0cJc.md` (flat transcript) --
    Ian Cooper, NDC Porto 2023.
  RED-phase facts are distilled OWN-WORDS via the clean-room oracle / oracle-reviewer agents;
  main context NEVER reads book/talk prose (DST-04). Same model as the 0.0.2 catalogs.

- **D-02:** Source tagging -- OWNED (oracle-verified against `.oracle/`) vs NO-ORACLE
  (high-confidence core only, tagged no-oracle, exactly as 0.0.2 handled Beck/Feathers):
  - OWNED / oracle-gated: RCM *Clean Code*; Metz+Owen *99 Bottles of OOP* 2e JS; the two
    Ian Cooper talk transcripts.
  - NO-ORACLE / high-confidence core: Kent Beck (*Test-Driven Development by Example* -- test
    list, triangulation, assert-first, evident data); Bill Wake (Arrange-Act-Assert); Dan
    North (Given-When-Then / BDD "should" naming); Roy Osherove (three-part naming). None are
    in `.oracle/` -- author blind from high-confidence core, tag no-oracle, and do NOT claim
    oracle verification for them.

- **D-03:** Talk-transcript access mechanics -- the two Cooper talks are FLAT files (no
  `<book>/index.md` subdir like the books). The oracle/oracle-reviewer packaged input points
  the agent DIRECTLY at the flat transcript path (a single file needs no navigation index).
  Both are large (~56-60 KB, ~1500 transcript segments) -> the oracle agents MUST chunk-read
  to EOF (length-agnostic), per the oracle-reviewer large-read contract. For Phase 16 the
  talks are a SECONDARY source (SEL: a new behavior is the trigger for the next test; NAME:
  name the behavior, not the method); their primary use is Phase 17.

### Reference scope -- fill slices only, co-edit the stubs

- **D-04:** Phase 16 fills only its requirement SLICES and leaves each stub's "Populated in
  Phase NN" marker intact for 17/18. Do NOT fragment a decision doc per-source (ARCHITECTURE
  Anti-Pattern 1); a stub spanning >1 phase is co-edited, never split:
  - `references/three-laws-and-test-selection.md` -- fill the SEL slice (SEL-01, SEL-02);
    LEAVE the Three Laws spine + classify-first seam (LAW-01/02, SEAM-01) to Phase 18.
  - `references/test-structure-and-assertions.md` -- fill the STR slice (STR-01, STR-02);
    LEAVE assertions + Khorikov four pillars (ASRT-01/02) to Phase 17.
  - `references/naming.md` -- fill fully (NAME-01 is entirely Phase 16).

### Test selection content (SEL)

- **D-05:** SEL-01 -- keep a running test list, take one small (one-step) step, and open from
  the degenerate / starter case (empty, zero, null). Own-words from *Clean Code* (owned) +
  Beck (no-oracle). Degenerate-first is framed as the opening move of a new behavior.
- **D-06:** SEL-02 -- triangulation is presented as a RED-facet test-SELECTION move (add a
  second concrete example to force the next test), EXPLICITLY bounded against lz-tpp's
  fake-it / generalize (the GREEN facet). The boundary sentence is load-bearing (SC-2) so the
  coach never strays into GREEN generalization -- that is lz-tpp's job.

### Test structure content (STR)

- **D-07:** STR-01 -- present Arrange-Act-Assert (Wake) and Given-When-Then (North) as ONE
  three-part skeleton in TWO vocabularies; do NOT impose one school; instruct to MATCH the
  house idiom. Design-agnostic framing (SC-3).
- **D-08:** STR-02 -- assert-first, evident / intention-revealing test data, one-concept-per-test
  (one reason for a test to fail). Own-words from Beck (assert-first + evident data, no-oracle)
  + *Clean Code* (one concept per test, owned).

### Test naming content (NAME)

- **D-09:** NAME-01 -- behavior / BDD "should ..." naming as the PRIMARY convention (North),
  with Osherove's three-part `UnitOfWork_StateUnderTest_ExpectedBehavior` as the documented
  ALTERNATIVE, plus "match the codebase's existing naming stance." Metz's name-the-behavior-
  not-the-method (owned) is the rationale thread.

### TypeScript examples & validation (SC-5)

- **D-10:** Every TypeScript sample in these three references is tsc --strict CLEAN and has NO
  verbatim book prose/code. Examples are MINIMAL RED illustrations (a failing-test skeleton, a
  degenerate-case test, an AAA/GWT pair, a "should"-named test) paired with the language-agnostic
  principle. Vitest is the framework idiom, but Phase 16 uses only the minimal `it`/`expect`
  surface -- deep Vitest mechanics (`it.todo`, `test.each`, `vi.*`) are Phase 17 (VIT).
- **D-11:** Validation harness -- the shipped `plugins/lz-tdd` tree gets NO build deps
  (Out-of-Scope). tsc --strict validation of the Phase-16 examples runs in a DEV-ONLY
  workspace, mirroring the lz-refactor-workspace one-module-per-fence extractor + pinned
  typescript. Planner's call whether to reuse the lz-refactor-workspace extractor pointed at
  the lz-red refs OR stand up a minimal `lz-red-workspace` tsc gate now (the full eval
  workspace is Phase 20, but a lightweight tsc gate is needed in 16/17). Instrument-first
  (RED against empty refs -> GREEN when content lands) is the 0.0.2 precedent; a tsc --strict
  gate is MANDATORY either way.

### No-verbatim gate (SC-5, DST-04)

- **D-12:** Owned-source surfaces (Clean Code / 99 Bottles / Cooper) are oracle-reviewer gated
  (converge-to-clean, 3-round cap) PLUS a deterministic no-verbatim scan -- exactly as the
  0.0.2 catalogs. No-oracle surfaces (Beck/Wake/North/Osherove) are authored blind from
  high-confidence core and get the no-verbatim scan only (no oracle to gate against). Main
  context never reads `.oracle/` prose; only own-words facts cross back.

### Claude's Discretion

- Exact own-words wording of each selection / structure / naming heuristic (executor drafts;
  oracle-reviewer gates the owned surfaces).
- Exact minimal TS/Vitest example per reference, within the D-10 constraints.
- Whether the planner reuses the lz-refactor-workspace tsc extractor or stands up a minimal
  lz-red one (D-11) -- planner's call; a tsc --strict gate + no-verbatim scan are mandatory.
- Whether Phase 16 opens with an instrument-first Wave-0 (empty-ref RED baseline) -- planner's
  call, but the tsc gate + no-verbatim scan are non-negotiable.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor) MUST read these before planning or
implementing.**

### Oracle sources (git-ignored; oracle/oracle-reviewer agents ONLY -- main context must NOT read the prose)
- `.oracle/clean-code/index.md` -- RCM *Clean Code* navigation index (OWNED). Ch. 9 Unit Tests
  + Ch. 2 Meaningful Names are the Phase-16 load-bearing chapters.
- `.oracle/99-bottles-2e-js/index.md` -- Metz + Owen *99 Bottles of OOP* 2nd Ed, JavaScript Ed
  (OWNED). Phase-16 use is light (name-for-behavior); heavy use is Phase 17.
- `.oracle/tdd-where-did-it-all-go-wrong-ian-cooper-yt-EZ05e7EMOLM.md` -- Ian Cooper talk (flat;
  secondary for Phase 16).
- `.oracle/tdd-revisited-ian-cooper-ndc-porto-2023-yt-IN9lftH0cJc.md` -- Ian Cooper talk (flat;
  secondary for Phase 16).

### Reference stubs to fill (Phase-15 scaffold; carry per-doc content contracts)
- `plugins/lz-tdd/skills/lz-red/references/three-laws-and-test-selection.md` -- SEL slice.
- `plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md` -- STR slice.
- `plugins/lz-tdd/skills/lz-red/references/naming.md` -- NAME-01 (fill fully).
- `plugins/lz-tdd/skills/lz-red/SKILL.md` -- the router; its reference-pointer section already
  links these three stubs (Phase 15). Phase 16 does NOT edit the SKILL.md body.

### Requirements, roadmap, project decisions
- `.planning/REQUIREMENTS.md` -- SEL-01, SEL-02, STR-01, STR-02, NAME-01 + the Out-of-Scope
  table (no build deps in `plugins/`, coach-don't-drive, no imposed testing school,
  DHH hard-ban).
- `.planning/ROADMAP.md` -- Phase 16 Success Criteria (5 items) + the phase split (ASRT/RTR/VIT
  -> 17; LAW/SEAM/RTR-02 -> 18).
- `.planning/PROJECT.md` -- Key Decisions: the clean-room `.oracle/` model, the lz-red owned-source
  model (Clean Code + 99 Bottles JS Ed + transcribed talks), the adaptive-stance router, the DHH
  hard-ban.

### Prior-phase context, research, and 0.0.2 precedent
- `.planning/phases/15-lz-red-skill-scaffold-description-boundary/15-CONTEXT.md` -- D-01 reference
  layout, D-02 content-contract stubs, D-03 (no `.oracle/` in Phase 15 -> provisioned now).
- `.planning/research/ARCHITECTURE.md`, `.planning/research/FEATURES.md`,
  `.planning/research/PITFALLS.md`, `.planning/research/SUMMARY.md`, `.planning/research/STACK.md`
  -- the milestone research; FEATURES/SUMMARY feed Phase-16 content.
- `.claude/skills/lz-refactor-workspace/tools/` -- the tsc --strict per-fence extractor
  (`extract-samples`) + `check-hygiene` (ASCII / email / no-verbatim) to reuse or mirror for
  D-11/D-12.
- `.planning/codebase/TESTING.md` -- the dev-only-workspace tsc + no-verbatim harness pattern
  (no build deps in `plugins/`); `.planning/codebase/CONVENTIONS.md` -- doc authoring conventions.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- lz-refactor catalog leaves + the oracle / oracle-reviewer clean-room authoring loop (0.0.2):
  the exact model for own-words distillation from owned `.oracle/` books.
- `lz-refactor-workspace/tools/extract-samples` (one-module-per-fence tsc --strict) +
  `check-hygiene` (ASCII/email/no-verbatim): reuse or mirror for D-11/D-12.
- The three Phase-15 stubs already carry per-doc content contracts + the requirement IDs they
  satisfy + a "Populated in Phase NN" marker -> unambiguous fill targets.

### Established Patterns
- Clean-room DST-04: main context never reads `.oracle/`; the oracle agent reads full text in its
  isolated context; only own-words facts cross back. Owned = oracle-gated; unowned = no-oracle
  high-confidence core.
- Progressive disclosure: SKILL.md links, references carry content, indexes are navigation-only.
  Phase 16 fills leaf content, not the SKILL.md body.
- Instrument-first (Nyquist): assert a RED baseline against empty refs, then GREEN when content
  lands, with the tsc gate machine-checkable before any oracle content is authored.

### Integration Points
- Phase-16 content links FROM the SKILL.md reference-pointer section (already wired in Phase 15)
  and FORWARD to Phase 17 (assertions / stance) and Phase 18 (Three Laws spine / classify-first
  seam) via the co-edited stubs' markers -- so links resolve from day one and later phases have
  clear insertion points.

</code_context>

<specifics>
## Specific Ideas

- *99 Bottles of OOP* is the **2nd Edition, JavaScript Edition** (Metz + Owen), NOT the Ruby-only
  1st ed -- the oracle agents must distill from and cite the JS edition.
- Triangulation is a RED test-SELECTION facet here, firewalled from lz-tpp's GREEN
  fake-it/generalize -- the boundary sentence is load-bearing (SC-2).
- Arrange-Act-Assert and Given-When-Then are ONE skeleton in TWO vocabularies; match the house
  idiom; do not impose a school (SC-3).
- "should"-naming is primary; Osherove three-part is the documented alternative (SC-4).
- The Cooper talks are provisioned now (both DevTernity + NDC Porto 2023) so Phases 16 and 17
  share one oracle setup; Phase 16 uses them only lightly.

</specifics>

<deferred>
## Deferred Ideas

- Assertion design (ASRT-01/02/03, Khorikov four pillars, Metz message matrix), the stance router
  (RTR), Vitest deep mechanics (VIT), anti-patterns (ANTI), Test Desiderata -> Phase 17. The
  99-Bottles message matrix and the Cooper talks' heavy use land there.
- Three Laws spine framing + fail-for-the-right-reason (LAW-01/02), classify-first + forward/reverse
  lz-tpp seam (SEAM-01/02, RTR-02) -> Phase 18.
- plugin.json 0.0.3 bump + README + CHANGELOG + validators (DST-01/02/03) -> Phase 19.
- Eval workspace (`lz-red-workspace`) + trigger/behavior evals + description tuning
  (EVL-01/02) -> Phase 20.

All of the above are the ROADMAP's own later phases (recorded so the planner does not pull them
into Phase 16), not scope creep from discussion.

None -- discussion stayed within phase scope. The only interactive point was the maintainer-approved
`.oracle/` source provisioning, which is a Phase-16 prerequisite (Success Criterion 1), not new scope.

</deferred>

---

*Phase: 16-source-distillation-core-red-references*
*Context gathered: 2026-07-19*
