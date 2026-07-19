# Phase 17: Assertion Design, Stance Router & TS/Vitest Mechanics - Context

**Gathered:** 2026-07-19
**Status:** Ready for planning
**Mode:** --analyze --auto --chain (autonomous single pass; trade-off tables logged for the
audit trail, recommended option auto-locked per gray area). Every gray area was rated on
IMPACT x CONFIDENCE per the trap-quadrant rule; none landed HIGH-impact + NOT-high-confidence,
so nothing was escalated -- the phase is heavily pre-determined by the ROADMAP Success Criteria,
the Phase-15 content-contract stubs (which already tag each source's access tier), and the
direct 0.0.2 / Phase-16 clean-room precedent.

<domain>
## Phase Boundary

Author the lz-red DIFFERENTIATOR content: assertion design tied to the adaptive testing-stance
router, the TypeScript + Vitest mechanics, and the anti-pattern / Test Desiderata references.
Fills requirement slices ASRT-01, ASRT-02, ASRT-03, RTR-01, RTR-03, VIT-01, VIT-02, ANTI-01,
ANTI-02 into the six Phase-15 stubs those requirements map to. Every TypeScript sample is
tsc --strict clean; no verbatim source prose or code (DST-04).

In scope (the six co-edited stubs and their Phase-17 slices):

- `references/test-structure-and-assertions.md` -- fill the "Assertions and the four pillars
  (Phase 17)" insertion point: Khorikov's four pillars (resistance-to-refactoring load-bearing),
  the F.I.R.S.T. properties, assert observable behavior over implementation (ASRT-01), and the
  output-/state-/communication-based assertion-style selection tied to the stance (ASRT-02).
  LEAVE the STR slice (already filled in Phase 16) intact.
- `references/testing-stance/README.md` -- author the navigation index HALF (detection signals +
  route table). The SKILL.md coach wiring (RTR-02) is Phase 18.
- `references/testing-stance/functional-core.md` -- Bernhardt FCIS (no-oracle); output/value-based
  assertion, no doubles in the core (RTR-01, ASRT-02).
- `references/testing-stance/message-matrix.md` -- Metz + Owen query/command matrix (owned,
  oracle-gated); the design-agnostic assert-vs-mock rule (RTR-01, ASRT-03).
- `references/testing-stance/seams-and-legacy.md` -- Feathers seams + characterization (no-oracle),
  CROSS-LINKED to lz-refactor's `refactoring-without-tests.md`, NOT copied (RTR-01, ASRT-02).
- `references/vitest-typescript-mechanics.md` -- Vitest 4.x mechanics mapped to RED concepts
  (VIT-01) with tsc --strict TS/Vitest examples (VIT-02).
- `references/anti-patterns.md` -- RED anti-patterns + observable-behavior fix (ANTI-01), the
  "listen to the tests" meta-rule (RTR-03), and the Test Desiderata tradeoff lens (ANTI-02).
- `references/principle-backing.md` -- co-edit: add the Phase-17 sources' backing rows + access
  tiers.

Explicitly NOT in this phase (fixed by ROADMAP; leave the Phase-18 markers intact -- these stubs
are CO-EDITED, never split):

- The Three Laws spine framing + fail-for-the-right-reason PROCEDURE + F.I.R.S.T.-as-baseline
  procedure step + classify-first seam (LAW-01/02, SEAM-01) -> Phase 18.
- The coach routing STEP that wires the stance index into SKILL.md + honors the override phrase
  (RTR-02) -> Phase 18. Phase 17 authors the index CONTENT; Phase 18 wires it.
- Any edit to the SKILL.md body (the coach procedure owns it) -> Phase 18.
- Type-level RED (`expectTypeOf`/`assertType` failing tests) and property-based RED (`fast-check`)
  as full leaves -> FUTURE requirements ADV-01 / ADV-02 (post-0.0.3), not this milestone.
- plugin.json 0.0.3 bump / README / CHANGELOG / validators -> Phase 19.
- Eval workspace + trigger/behavior evals + description tuning -> Phase 20.

</domain>

<decisions>
## Implementation Decisions

Requirements ASRT-01/02/03, RTR-01, RTR-03, VIT-01/02, ANTI-01, ANTI-02 (see REQUIREMENTS.md)
are the locked scope. The decisions below are the HOW, auto-resolved from the ROADMAP Success
Criteria (5 items), the Phase-15 content-contract stubs, and the Phase-16 / 0.0.2 clean-room
precedent. Confidence was HIGH on all but D-09 and D-10 (the two genuine judgment calls, both
medium-impact and evidence-backed -> auto-locked, not escalated).

### Source access tiers & clean-room (mirrors Phase 16 D-01/D-02/D-12)

- **D-01:** OWNED / oracle-gated Phase-17 surfaces -- distilled own-words via the clean-room
  oracle / oracle-reviewer agents (converge-to-clean, 3-round cap) + a deterministic no-verbatim
  scan; main context NEVER reads `.oracle/` prose:
  - Sandi Metz + Katrina Owen, *99 Bottles of OOP* 2nd Ed, JavaScript Ed -> `message-matrix.md`
    (the query/command matrix, ASRT-03 / RTR-01). `.oracle/99-bottles-2e-js/index.md`.
  - Robert C. Martin, *Clean Code* Ch. 9 (Unit Tests) -> the F.I.R.S.T. properties in the
    assertions slice. `.oracle/clean-code/index.md`.
  - Ian Cooper (two talks) -> the over-mock / test-per-class anti-pattern (ANTI-01). The two flat
    transcripts in `.oracle/` (see canonical refs); large -> oracle agents chunk-read to EOF.
- **D-02:** NO-ORACLE / high-confidence core -- authored BLIND from high-confidence core, tagged
  no-oracle, no oracle gate (nothing owned to check against), no-verbatim scan only:
  - Vladimir Khorikov -- the four pillars of a good unit test (ASRT-01).
  - Gary Bernhardt -- functional core / imperative shell (RTR-01, ASRT-02).
  - Michael Feathers -- seams + characterization (RTR-01, ASRT-02); CROSS-LINK to lz-refactor,
    not copy.
  - GOOS (Steve Freeman + Nat Pryce) -- the mockist counterpoint, stated fairly (ANTI-01, RTR-03).
  - Kent Beck -- Test Desiderata (ANTI-02).
  - DHH ("TDD is dead" / test-induced design damage) is HARD-BANNED -- not cited or referenced
    anywhere (maintainer decision; Out-of-Scope table).

### Assertion design (ASRT)

- **D-03:** ASRT-01 -- assert observable behavior, not implementation, via Khorikov's four pillars
  (protection against regressions; resistance to refactoring; fast feedback; maintainability),
  with resistance-to-refactoring named as the LOAD-BEARING property (fewest false failures on a
  behavior-preserving change). Authored blind (no-oracle). Lands in the assertions slice of
  `test-structure-and-assertions.md`. F.I.R.S.T. (owned, Clean Code Ch.9, oracle-gated) lands in
  the same slice as the test-quality baseline the four pillars sit on.
- **D-04:** ASRT-02 -- output-/state-/communication-based assertion-style selection tied to the
  stance router: output-based <-> Bernhardt functional core; state- / communication-based <->
  Metz boundary; characterization <-> Feathers legacy. This mapping is the spine linking the
  assertions slice to the three stance leaves (each leaf carries its own assert rule; the
  assertions slice carries the selection rule that points at them).
- **D-05:** ASRT-03 -- the Metz query / command message matrix as the design-agnostic assert-vs-mock
  rule: assert the RETURN of an incoming query; assert the direct public SIDE EFFECT of an incoming
  command; IGNORE self-messages and outgoing queries; EXPECT-to-send (the one warranted double)
  only for outgoing commands. Owned (99 Bottles), oracle-gated. Lands in `message-matrix.md`.

### Testing-stance router (RTR)

- **D-06:** RTR-01 -- author the `testing-stance/` subdir at content grain: the README navigation
  index (detection signals + route table, NAVIGATION-ONLY per the stub convention) plus the three
  leaves (functional-core / message-matrix / seams-and-legacy). The Feathers `seams-and-legacy.md`
  leaf CROSS-LINKS `plugins/lz-tdd/skills/lz-refactor/references/refactoring-without-tests.md`
  (verified present) rather than duplicating the refactor-step no-tests techniques -- this is the
  RED-step (write the pinning test) framing only.
- **D-07:** RTR-03 -- the "listen to the tests" meta-rule: test-writing pain (heavy mocking, private
  access, awkward assertions) is DESIGN FEEDBACK routing toward a functional core (Bernhardt) or a
  seam (Feathers), NOT a cue to add more doubles; GOOS referenced as a COUNTERPOINT only. Lands in
  `anti-patterns.md` (the stub scopes RTR-03 there). The lean SKILL.md already carries a short
  "Listen to the tests" section (Phase 15); the leaf deepens it -- no SKILL.md edit.

### TypeScript & Vitest mechanics (VIT)

- **D-08:** VIT-01 -- map Vitest 4.x (pinned 4.1.10 in the dev workspace) mechanics to RED concepts:
  `it.todo` = the running test list; `test.each` / `it.each` = triangulation over concrete examples;
  `vi.*` doubles WITH RESTRAINT (linked to listen-to-the-tests); watch mode = the fast feedback
  loop. Confirming a red "fails for the right reason" appears here only as a Vitest MECHANIC (how
  you read the red bar and see it is the asserted-behavior failure, not a compile / import /
  fixture failure) -- the LAW-02 spine framing + F.I.R.S.T.-as-baseline PROCEDURE step is Phase 18.
- **D-09 (judgment call -- scope of "advanced" mechanics):** cover VIT-01's NAMED surface fully;
  mention type-level assertions (`expectTypeOf` / `assertType`) and property-based generation
  (`fast-check`) ONLY as brief "advanced -- deferred to ADV-01 / ADV-02" forward-pointers. Do NOT
  author full type-level-RED or property-based leaves, and do NOT add `fast-check` as a dependency.
  Rationale: ADV-01 (type-level RED leaf) and ADV-02 (property-based RED leaf) are EXPLICIT Future
  Requirements (post-0.0.3); the shipped tree stays Markdown-only; YAGNI. (Trade-off table logged;
  medium impact, evidence-backed -> auto-locked.)
- **D-10 (judgment call -- VIT-02 "throughout SKILL.md"):** satisfy VIT-02 by placing TS + Vitest
  examples throughout the REFERENCES Phase 17 authors (assertions slice, message-matrix,
  functional-core, vitest-typescript-mechanics). The requirement's "throughout SKILL.md" clause is
  satisfied at the SKILL.md level in PHASE 18, when the coach procedure (which owns the SKILL.md
  body) lands its worked example. Phase 17 does NOT edit the SKILL.md body (16-CONTEXT co-edit rule
  + lean-router SKL-02). So VIT-02 closes as satisfied-by-references in 17 with the SKILL.md example
  co-owned by Phase 18. (Trade-off table logged; medium impact, evidence-backed -> auto-locked.)

### Anti-patterns & Test Desiderata (ANTI)

- **D-11:** ANTI-01 -- an anti-pattern leaf naming the RED anti-patterns with a Recognize-by cue and
  an observable-behavior Correction each: over-mocking / test-per-class rigidity (Cooper, owned),
  testing private methods, multiple unrelated assertions in one test, a test that passes immediately
  (no red), snapshot-as-thinking, and slow / order-dependent tests. Khorikov's implementation-detail
  brittleness (no-oracle) threads in as the assertion-side failure mode.
- **D-12:** ANTI-02 -- a Test Desiderata tradeoff lens: Beck's good-test properties presented as
  tradeoffs to OPTIMIZE, not dogma, matching lz-tpp's "heuristic not law" voice. No-oracle (Beck).

### Validation & co-edit boundary (mirrors Phase 16 D-04/D-10/D-11)

- **D-13:** Instrument-first -- extend the existing dev-only `lz-red-workspace`
  `check-red-references.mjs` (Phase 16 already stands it up with Phase-17 ASRT deferral guards +
  the one-module-per-fence tsc --strict extractor) so its Phase-17 RED guards turn GREEN as the
  content lands; every TS fence is tsc --strict clean via the pinned extractor (typescript 6.0.3 /
  vitest 4.1.10). NO build dep enters `plugins/lz-tdd`. Whether to open with a fresh Wave-0
  RED baseline is the planner's call; the tsc gate + no-verbatim scan are non-negotiable.
- **D-14:** No-verbatim gate -- owned surfaces (99 Bottles matrix, Cooper anti-patterns, Clean Code
  F.I.R.S.T.) go through oracle-reviewer converge-to-clean (3-round cap) + the deterministic
  no-verbatim scan; no-oracle surfaces (Khorikov / Bernhardt / Feathers / GOOS / Beck) are authored
  blind from high-confidence core + no-verbatim scan only. Main context never reads `.oracle/` prose.
- **D-15:** Co-edit, do not split -- Phase 17 fills only its ASRT / RTR-01 / RTR-03 / VIT / ANTI
  slices and leaves the Phase-18 markers (LAW spine, fail-for-the-right-reason procedure,
  classify-first seam, RTR-02 SKILL.md wiring) intact; does NOT edit the SKILL.md body;
  `principle-backing.md` is co-edited (add the Phase-17 sources' backing rows + tiers).

### Claude's Discretion

- Exact own-words wording of each pillar / matrix cell / stance signal / anti-pattern (executor
  drafts; oracle-reviewer gates the owned surfaces only).
- Exact minimal TS/Vitest example per reference, within D-08/D-09/VIT-02 and tsc --strict.
- Whether the planner reuses / extends the Phase-16 `check-red-references.mjs` guards vs adds a
  sibling check (D-13) -- planner's call; the tsc gate + no-verbatim scan are mandatory.
- Plan / wave breakdown across the six stubs (planner's call; owned-oracle leaves may sequence
  after the instrument baseline).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor) MUST read these before planning or
implementing.**

### Oracle sources (git-ignored; oracle / oracle-reviewer agents ONLY -- main context must NOT read the prose)
- `.oracle/99-bottles-2e-js/index.md` -- Metz + Owen *99 Bottles of OOP* 2nd Ed, JavaScript Ed
  (OWNED). Phase-17 HEAVY use: the query/command message matrix (ASRT-03, RTR-01).
- `.oracle/clean-code/index.md` -- RCM *Clean Code* navigation index (OWNED). Ch. 9 Unit Tests ->
  the F.I.R.S.T. properties in the assertions slice.
- `.oracle/tdd-where-did-it-all-go-wrong-ian-cooper-yt-EZ05e7EMOLM.md` -- Ian Cooper talk (flat
  transcript; OWNED). Phase-17 HEAVY use: over-mock / test-per-class (ANTI-01). Large -> chunk-read
  to EOF.
- `.oracle/tdd-revisited-ian-cooper-ndc-porto-2023-yt-IN9lftH0cJc.md` -- Ian Cooper talk (flat
  transcript; OWNED). Phase-17 HEAVY use: over-mock / test-per-class (ANTI-01). Large -> chunk-read
  to EOF.

### Reference stubs to fill (Phase-15 scaffold; each carries a per-doc content contract + Phase-17 marker)
- `plugins/lz-tdd/skills/lz-red/references/test-structure-and-assertions.md` -- ASRT slice (the
  "Assertions and the four pillars (Phase 17)" insertion point; STR slice already filled Phase 16).
- `plugins/lz-tdd/skills/lz-red/references/testing-stance/README.md` -- the navigation index half
  (detection signals + route table); RTR-02 SKILL.md wiring is Phase 18.
- `plugins/lz-tdd/skills/lz-red/references/testing-stance/functional-core.md` -- Bernhardt FCIS
  (RTR-01, ASRT-02).
- `plugins/lz-tdd/skills/lz-red/references/testing-stance/message-matrix.md` -- Metz matrix
  (RTR-01, ASRT-03).
- `plugins/lz-tdd/skills/lz-red/references/testing-stance/seams-and-legacy.md` -- Feathers
  (RTR-01, ASRT-02); cross-link target below.
- `plugins/lz-tdd/skills/lz-red/references/vitest-typescript-mechanics.md` -- VIT-01, VIT-02.
- `plugins/lz-tdd/skills/lz-red/references/anti-patterns.md` -- ANTI-01, ANTI-02, RTR-03.
- `plugins/lz-tdd/skills/lz-red/references/principle-backing.md` -- co-edited; add Phase-17 rows.
- `plugins/lz-tdd/skills/lz-red/SKILL.md` -- the router; Phase 17 does NOT edit its body (reads only
  for cross-link accuracy).

### Cross-link target (RTR-01 -- link, do not copy)
- `plugins/lz-tdd/skills/lz-refactor/references/refactoring-without-tests.md` -- lz-refactor's
  Feathers no-tests reference (VERIFIED present). The Phase-17 `seams-and-legacy.md` leaf points at
  it for the refactor-step no-tests techniques instead of duplicating them.

### Requirements, roadmap, project decisions
- `.planning/REQUIREMENTS.md` -- ASRT-01/02/03, RTR-01/03, VIT-01/02, ANTI-01/02 + the Future
  Requirements (ADV-01 type-level RED, ADV-02 property-based RED -- both deferred) + the Out-of-Scope
  table (no build deps in `plugins/`, coach-don't-drive, no imposed testing school, GOOS
  counterpoint-only, DHH hard-ban).
- `.planning/ROADMAP.md` -- Phase 17 Goal + Success Criteria (5 items) + the phase split
  (LAW/SEAM/RTR-02 -> 18; DST -> 19; EVL -> 20).
- `.planning/PROJECT.md` -- Key Decisions: the clean-room `.oracle/` model, the adaptive-stance
  router (Bernhardt / Metz / Feathers), the owned-source model, the DHH hard-ban.

### Prior-phase context, workspace, and precedent
- `.planning/phases/16-source-distillation-core-red-references/16-CONTEXT.md` -- D-01..D-12: the
  `.oracle/` provisioning, source tiers, clean-room loop, co-edit-don't-split rule, tsc-gate model.
- `.claude/skills/lz-red-workspace/tools/check-red-references.mjs` -- the Phase-16 instrument (tsc
  --strict per-fence extractor + RED->GREEN content guards, incl. the Phase-17 ASRT deferral guards)
  to extend for D-13; `package.json` pins typescript 6.0.3 + vitest 4.1.10.
- `.claude/skills/lz-refactor-workspace/tools/` -- the 0.0.2 extractor + `check-hygiene`
  (ASCII / email / no-verbatim) the lz-red workspace mirrors.
- `.planning/research/{FEATURES,ARCHITECTURE,PITFALLS,SUMMARY,STACK}.md` -- the milestone research
  (covers Khorikov four pillars, Bernhardt FCIS, the Metz matrix, Test Desiderata).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- lz-refactor catalog leaves + the oracle / oracle-reviewer clean-room authoring loop (0.0.2 /
  Phase 16): the exact model for own-words distillation of the owned surfaces (99 Bottles matrix,
  Cooper anti-patterns, Clean Code F.I.R.S.T.).
- `lz-red-workspace/tools/check-red-references.mjs` (Phase 16): one-module-per-fence tsc --strict
  extractor + RED->GREEN content guards already carrying Phase-17 ASRT deferral markers -> extend
  in place for D-13 rather than standing up a new gate.
- The six Phase-17 stubs already carry per-doc content contracts + the requirement IDs + a
  "Populated in Phase 17" marker + named source clusters -> unambiguous fill targets.
- lz-refactor `refactoring-without-tests.md` -- the Feathers cross-link target already exists.

### Established Patterns
- Clean-room DST-04: main context never reads `.oracle/`; the oracle agent reads full text in its
  isolated context; only own-words facts / verdicts cross back. Owned = oracle-gated; unowned =
  no-oracle high-confidence core.
- Progressive disclosure: SKILL.md links, references carry content, indexes are navigation-only.
  Phase 17 fills leaf content, not the SKILL.md body.
- Co-edit-don't-split (ARCHITECTURE Anti-Pattern 1): a stub spanning >1 phase is co-edited; leave
  the later-phase markers intact.
- Instrument-first (Nyquist): the RED guard is asserted before content lands; content turns it GREEN.

### Integration Points
- Phase-17 content links FROM the SKILL.md reference-pointer section (already wired Phase 15) and
  FORWARD to Phase 18 (the assertions slice, the stance index, and vitest mechanics leave LAW /
  fail-for-the-right-reason / RTR-02 / classify-first insertion points for the coach procedure).
- The `seams-and-legacy.md` leaf links OUT to the shipped lz-refactor Feathers reference (a
  cross-skill link inside the same plugin), tightening the red-green-refactor seam.

</code_context>

<specifics>
## Specific Ideas

- The Metz source is the *99 Bottles of OOP* 2nd Edition, JavaScript Edition (Metz + Owen) -- the
  matrix must be distilled from and cited to the JS edition, not the Ruby 1st ed.
- Khorikov's resistance-to-refactoring is the LOAD-BEARING pillar for lz-red: it is precisely the
  "assert observable behavior, not implementation" property, so it anchors the assertions slice.
- The assertion-style-to-stance mapping (output <-> functional core; state / communication <->
  Metz boundary; characterization <-> Feathers legacy) is written verbatim in ROADMAP Success
  Criterion 1 -- it is the spine that ties ASRT-02 to the three stance leaves.
- The Metz matrix's one warranted double is the OUTGOING COMMAND (expect-to-send); everything else
  is assert-a-value or do-not-test -- this is the design-agnostic firewall against over-mocking.
- GOOS is a counterpoint ONLY; the classicist / value-based default holds. DHH is never cited.
- Type-level RED (`expectTypeOf`/`assertType`) and property-based RED (`fast-check`) are Future
  Requirements (ADV-01/02) -- forward-point briefly, do not author (D-09).

</specifics>

<deferred>
## Deferred Ideas

- Three Laws spine framing + fail-for-the-right-reason PROCEDURE + F.I.R.S.T.-as-baseline procedure
  step (LAW-01/02), classify-first + forward/reverse lz-tpp seam (SEAM-01/02), and the coach
  routing step that wires the stance index into SKILL.md + honors the override phrase (RTR-02)
  -> Phase 18.
- Type-level RED leaf (`expectTypeOf`/`assertType` + `vitest --typecheck` + `*.test-d.ts`) -> ADV-01
  (Future Requirements, post-0.0.3).
- Property-based RED leaf (`fast-check`, express-the-invariant + shrink) -> ADV-02 (Future
  Requirements, post-0.0.3).
- plugin.json 0.0.3 bump + README + CHANGELOG + validators (DST-01/02/03) -> Phase 19.
- Eval workspace + trigger/behavior evals + description tuning (EVL-01/02) -> Phase 20.

All of the above are the ROADMAP's own later phases or explicit Future Requirements (recorded so
the planner does not pull them into Phase 17), not scope creep from discussion.

None -- autonomous single pass stayed within phase scope; no user-raised out-of-scope ideas.

</deferred>

---

*Phase: 17-assertion-design-stance-router-ts-vitest-mechanics*
*Context gathered: 2026-07-19*
