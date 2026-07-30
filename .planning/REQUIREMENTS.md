# Requirements: lz-engineering-claude-plugins -- lz-tdd@0.0.3 (lz-red)

**Defined:** 2026-07-18
**Core Value:** lz-red helps Claude choose and write the next failing unit test well during red-green-refactor TDD -- adaptively matching the codebase's testing stance -- then hands off to lz-tpp for the green step. It completes the red-green-refactor loop alongside lz-tpp (green) and lz-refactor (refactor).

## lz-tdd@0.0.3 Requirements

Requirements for milestone lz-tdd@0.0.3. Each maps to a roadmap phase. Grounded in the locked literature (Beck, R.C. Martin, Metz + Owen, Bernhardt, Khorikov, Feathers, Ian Cooper, North, Wake, Osherove; GOOS counterpoint; DHH hard-banned).

### Skill scaffold and boundary (SKL)

- [x] **SKL-01**: `/lz-tdd:lz-red` is invocable; skill lives at `plugins/lz-tdd/skills/lz-red/SKILL.md` with dual-mode-by-omission frontmatter (name + description only; `name` equals the directory).
- [x] **SKL-02**: Lean `SKILL.md` router (< 500 lines; target near lz-tpp's size) using progressive disclosure -- heavy content in lazy-loaded `references/` (flat docs plus one `testing-stance/` subdir), mirroring lz-tpp / lz-refactor and the angular-developer skill.
- [x] **SKL-03**: The `lz-red` `description` auto-triggers on RED-phase intent (choose / write the next failing test) and carries reciprocal near-miss guards against lz-tpp (make the failing test pass) and lz-refactor (restructure working code), within the description char cap.

### Test selection and ordering (SEL)

- [x] **SEL-01**: Coach guidance to keep a test list and take one small step (one-step test), starting from the degenerate / starter case (empty, zero, null).
- [x] **SEL-02**: Triangulation guidance for the RED facet (add another concrete example to select the next test), explicitly bounded against lz-tpp's fake-it / generalize (the GREEN facet).

### Test structure (STR)

- [x] **STR-01**: Guidance on Arrange-Act-Assert and Given-When-Then structure -- offer both vocabularies for the same skeleton and match the house idiom.
- [x] **STR-02**: Assert-first, evident / intention-revealing test data, and one-concept-per-test guidance.

### Assertion design (ASRT)

- [x] **ASRT-01**: Guidance to assert observable behavior, not implementation (Khorikov's four pillars, with resistance-to-refactoring as the load-bearing property).
- [x] **ASRT-02**: Output- / state- / communication-based assertion-style selection, tied to the stance router (output <-> Bernhardt functional core; state / communication <-> Metz boundary; characterization <-> Feathers legacy).
- [x] **ASRT-03**: The Metz query / command message matrix as the design-agnostic rule for what to assert and what to mock (assert return of incoming queries; assert public side effect of incoming commands; ignore self and outgoing queries; expect-to-send only for outgoing commands).

### Test naming (NAME)

- [x] **NAME-01**: Behavior / BDD "should ..." naming as primary, with Osherove's three-part `UnitOfWork_StateUnderTest_ExpectedBehavior` convention as a documented alternative.

### Three Laws spine and fail-for-the-right-reason (LAW)

- [x] **LAW-01**: The Three Laws of TDD framed as the RED spine -- Law 1 gates entry (no production code before a failing test), Law 2 sizes the test (only enough to fail; not-compiling counts), Law 3 is the lz-tpp handoff.
- [x] **LAW-02**: Fail-for-the-right-reason guidance -- watch the red bar; confirm the test fails on the asserted behavior, not a compile / setup error or a false green; F.I.R.S.T. as the test-quality baseline.

### Adaptive testing-stance router (RTR) -- the differentiator

- [x] **RTR-01**: A `testing-stance/` reference subdir with three leaves -- Bernhardt (functional core-imperative shell), Metz (message matrix), Feathers (seams + characterization tests) -- with Feathers cross-linked to lz-refactor's `refactoring-without-tests.md`, not copied.
- [x] **RTR-02**: A coach routing step -- detect and match the house test idiom always; route by structural control / seam availability to the right stance; state the route chosen and why; honor an optional override phrase (no CLI flag).
- [x] **RTR-03**: The "listen to the tests" meta-rule -- test-writing pain (heavy mocking, private access) is design feedback routing toward a functional core (Bernhardt) or a seam (Feathers), not more doubles; GOOS referenced as a counterpoint only.

### TypeScript and Vitest mechanics (VIT)

- [x] **VIT-01**: Vitest mechanics mapped to RED concepts -- `it.todo` (test list), `test.each` (triangulation), `vi.*` doubles with restraint, watch mode as the feedback loop -- pinned to Vitest 4.x and tsc --strict-clean.
- [ ] **VIT-02**: TypeScript + Vitest examples throughout `SKILL.md` and the references, paired with the language-agnostic principles, all tsc --strict-clean.

### lz-tpp seam (SEAM)

- [x] **SEAM-01**: Classify-first (RED vs GREEN vs REFACTOR) plus the forward `lz-red -> lz-tpp` handoff (Law 1/2 -> Law 3) in the coach decision procedure.
- [x] **SEAM-02**: A reverse `lz-tpp -> lz-red` pointer added to the shipped lz-tpp skill (closes the carried reverse-pointer tech-debt); the lz-tpp edit is subagent-reviewed before acceptance.

### Anti-pattern reference and Test Desiderata (ANTI)

- [x] **ANTI-01**: An anti-pattern reference leaf naming RED anti-patterns and the observable-behavior fix -- including Ian Cooper's over-mock / test-per-class warning, testing private methods, multiple unrelated assertions, a test that passes immediately, snapshot-as-thinking, and slow / order-dependent tests.
- [x] **ANTI-02**: A Test Desiderata tradeoff lens (Beck's good-test properties as tradeoffs to optimize, not dogma), matching lz-tpp's "heuristic not law" voice.

### Distribution and hygiene (DST)

- [x] **DST-01**: `plugin.json` bumped to 0.0.3; README + CHANGELOG document lz-red as the RED step completing the three-skill red-green-refactor loop; the marketplace listing names all three skills.
- [x] **DST-02**: The repo passes `claude plugin validate . --strict`; the plugin-validator and skill-reviewer agents both PASS on lz-red.
- [x] **DST-03**: Hygiene -- ASCII-only shipped tree; no verbatim book prose or talk transcripts (own-words, DST-04 clean-room via git-ignored `.oracle/`); maintainer work-email absent (allowlist-inversion); all TypeScript samples tsc --strict-clean.

### Skill-effectiveness evals (EVL)

- [ ] **EVL-01**: A trigger eval -- lz-red fires on RED-phase prompts and stays quiet on near-misses -- INCLUDING a cross-skill trigger eval proving the three-way boundary (lz-red vs lz-tpp vs lz-refactor) holds. (Phase 20 BUILT + deterministically verified the trigger harness/data; the empirical recall/specificity + reciprocal run is user-gated per D-11 -- Pending until run.)
- [ ] **EVL-02**: A RED-behavior eval -- the coach recommends the correct next-test / assertion move (right selection, structure, and assertion target) versus an unaided baseline, as in the 0.0.1 / 0.0.2 evals. (Phase 20 BUILT + deterministically verified the grader + scenarios; the empirical with-skill-vs-baseline benchmark is user-gated per D-11 -- Pending until run.)
- [ ] **EVL-03**: An APPLY-based, 3-arm, multi-dimensional RED eval -- short human prompts drive the next failing test in >= 1 real OSS TypeScript repo across no_skill / with_skill / invoke_skill arms; the produced test file/diff is graded on a correctness GATE (tsc --strict differential clean AND genuinely red for the right reason) plus lift dims (wall-clock, tokens, tools, output quality, book/source authenticity via oracle-reviewer, idioms, house style, TDD RED practices), with Pass@k/Pass^k + >= 1 unbiased reviewer and a substance-only headline. (Phase 21 BUILT + deterministically verified the instrument/harness/grader/selfcheck this phase; the empirical metered run is user-gated per D-11 -- Pending until run.)
  - **EVL-03.1** (BUILD, maps SC1): A RED apply suite exists (suite.json + prompts/ + targets.json) whose short human prompt is byte-identical across arms except the target path, and whose bodies never name the expected test/assertion (non-leading). Proven by the selfcheck-red composition crux + a prompt-parity assertion.
  - **EVL-03.2** (BUILD, maps SC2): The harness composes all THREE own-skill arms correctly -- no_skill (no --plugin-dir), with_skill (--plugin-dir plugins/lz-tdd, natural prompt), invoke_skill (natural prompt prefixed with /lz-tdd:lz-red). Proven by selfcheck-red dry-run argv assertions.
  - **EVL-03.3** (BUILD, maps SC3): The produced-test correctness GATE (D-06) classifies a run as {genuinely_red / false_green / compile_error / collection_error / no_tests / drove_to_green} and passes ONLY genuinely_red (tsc --strict differential-clean AND assertion-failure on current code). Proven by grade-red --selfcheck over fixture test-pairs (zero spend, fixtures pristine).
  - **EVL-03.4** (BUILD, maps SC3 + SC5): Mechanical dims (wall-clock, tokens, cost, tool histogram, num_turns, auto-trigger rate) tabulate from the stream-json meta, with Pass@k + Pass^k (k=1,3,5,total) on the correctness gate, per target and overall. Proven by tabulate-mechanical-red --selfcheck over fixture meta.json + red-grade.json.
  - **EVL-03.5** (BUILD wiring / RUN verdicts, maps SC3 + SC5): Judgment dims (>= 1 blind LLM judge, <= 2 dims each: "is THIS the right next test?" + "does it assert observable behavior, not implementation?") and book/source authenticity (oracle-reviewer vs owned .oracle/ RED sources, DST-04) are wired with a fail-closed merge/verify gate. Proven by merge-judge --selfcheck + a judge-input emission check; verdicts fill post-run.
  - **EVL-03.6** (BUILD, maps SC4): The build adds NO dependency to plugins/lz-tdd; per-run byproducts are git-ignored; the metered run is gated (HALT). Proven by git status clean after selfcheck + gitignore covers the results tree + plugins/lz-tdd untouched.
  - **EVL-03.7** (RUN, maps SC5): Results are recorded with Pass@k / Pass^k + >= 1 from-scratch unbiased reviewer; wherever a vocabulary proxy is used the SUBSTANCE-ONLY comparison is the headline (D-08 / D-10). Proven by the EVAL-RESULTS scaffold with a reserved unbiased-reviewer slot + substance-only headline structure; verdict fills post-run.

## Future Requirements

Deferred to a later lz-tdd release. Tracked, not in this roadmap.

### Advanced RED techniques (post-0.0.3)

- **ADV-01**: Type-level RED leaf -- `expectTypeOf` / `assertType` failing tests for type contracts (needs `vitest --typecheck` + `*.test-d.ts`). Add after the core RED loop triggers cleanly.
- **ADV-02**: Property-based RED leaf -- express an invariant as the failing test and shrink to a minimal counterexample with `fast-check`. Add when example-based triangulation guidance is proven.

### Later milestones

- **FUT-OUTSIDE-IN**: Outside-in / acceptance / double-loop TDD RED (a failing acceptance test driving inner unit tests). Deferred; unit RED must land and prove out first.
- **FUT-02**: Multi-language example sets beyond TypeScript.
- **FUT-04**: Split the Kerievsky layer of lz-refactor into its own skill (carried from 0.0.2).
- **FUT-METZ-REFACTOR**: An lz-refactor "Metz layer" -- enrich the shipped refactor catalogs and smell
  taxonomy with the Sandi Metz talk sources now provisioned in git-ignored `.oracle/` (21 talks
  surveyed via the oracle agent 2026-07-19): the code-smell taxonomy in five families (Get a Whiff of
  This), small-object extraction + the squint test (All the Little Things), null object (Nothing is
  Something), the factory taxonomy (If You Build It / Devs for Ukraine), duck typing + dependency
  direction (Less), message/role design (Polly Want a Message; the POODR discussion), and SOLID (SOLID
  OO Design). Deferred to a post-0.0.3 lz-refactor milestone (that skill is already shipped). The
  cross-skill "rules are heuristics, not law" coach voice has an owned source too (Rules). NOTE: none
  of the 21 surveyed Metz talks is a source for the GREEN / Transformation Priority Premise step
  (lz-tpp) -- all were checked and none carries TPP content.
- **FUT-ROSTER-TYPO**: the `RETIRED_LABELS` roster is blind to a TYPO in a retired label. It is DEFINED in
  `.claude/skills/lz-red-workspace/tools/lib/row-guards.mjs` and imported and consumed by
  `check-red-references.mjs`, so a repair edits the library, not the checker. A mistyped entry is absent
  from the emitted label set for exactly the same reason a correctly-retired label is, so the leg passes
  either way and the roster cannot tell a typo from a retirement. Open BY DESIGN, not an oversight. COST of
  closing it: cross-version label CAPTURE -- comparing the emitted label set against a prior commit's --
  which is a different instrument from a hand-maintained roster, not an edit to the roster.
- **FUT-ROSTER-LITERALS**: 8 of the 13 `NEW_LABELS` entries in `check-red-references.mjs` are rename-blind,
  by TWO distinct mechanisms rather than one. FOUR are PROPERTY-derived: `TWO_IG_GUARDS.map(...)` reads each
  label off the same guard object that carries it to the report call. FOUR are CONSTANT-derived: the roster
  names the very constants their own report calls push. Either way a constant sits on both sides of the
  comparison and asserts nothing, because a rename moves both sides together and the leg stays green. The
  other FIVE entries are string literals and each of the five DOES catch a rename -- `[wev G17]` plus the
  four `[lc9]` additions, whose emission sites declare their own independent inline literals, so a rename
  there edits one side only and `missingNewLabels` fires (MEASURED: with G17's label value changed the
  battery exits 0 before that entry and 1 after). COST of closing it: one rename proof per converted entry,
  8 in total.
- **FUT-TAXONOMY-SHARED**: relocate the archived test-double taxonomy into the plugin as ONE plugin-wide
  shared reference at `plugins/lz-tdd/references/`. The subject is `.planning/research/test-double-taxonomy.md`
  today; a milestone close relocates it, so after `lz-tdd@0.0.3` closes expect it at
  `.planning/milestones/lz-tdd@0.0.3-research/test-double-taxonomy.md`, following the
  `.planning/milestones/lz-tdd@0.0.1-research/` precedent already on disk. Cite it as INLINE CODE carrying
  the `${CLAUDE_PLUGIN_ROOT}` variable, never as a Markdown link -- guard N2 existsSync-checks any target it
  classifies as `relative`, and a variable-prefixed path is classified relative yet can never resolve on
  disk, so link syntax around THAT target fails N2. To be exact about what N2 does and does not forbid: it
  fails a relative target that does not RESOLVE, not links as such. A plain resolving relative link is fine
  and one already ships -- `plugins/lz-tdd/skills/lz-refactor/references/principles.md:27` links
  `../../../references/beck-tdd-by-example.md`, the target exists, N2 passes it and the battery is GREEN.
  The inline-code form is preferred for two independent RUNTIME reasons recorded as V7 and I2 in
  `PLUGIN-WIDE-REFERENCE-RESEARCH.md`: zero installed `SKILL.md` files use a `](../` link, and such a link
  is interpretable by the model but fragile. CONTINGENT on the D-12 A/B showing lift -- D-12 here means the
  "distinguish, but prove it first" ruling in the lc9 decision register
  `.planning/quick/260729-lc9-scope-the-test-double-taxonomy-to-lz-red/260729-lc9-CONTEXT.md`, NOT Phase
  21's separate D-12 metered-run gate in `21-RESEARCH.md`. If the A/B shows no lift the archive stays where
  it is and this entry closes as DECLINED. It is NOT approved for shipping, and its absence today is the
  A/B's baseline arm rather than an oversight. COST of closing it: an explicit N3 carve-out, because N3
  fails on the basename stem over every file under `plugins/` with no carve-out for a canonical location
  (MEASURED: a probe file at that exact path fails N3 by name), so the carve-out must be "at most one, at
  the canonical path" and the lz-red-only-versus-shared ownership question has to be answered first. The
  mechanism itself is VERIFIED, not speculative -- V1-V7 in `PLUGIN-WIDE-REFERENCE-RESEARCH.md`, with the
  pattern already in production at `plugins/lz-tdd/references/beck-tdd-by-example.md`.

## Out of Scope

Explicitly excluded from lz-tdd@0.0.3. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Writing / running the implementation to make the test pass | That is the GREEN step -- lz-tpp's job; hand off, do not drive |
| Refactoring / cleaning up working code | That is the REFACTOR step -- lz-refactor's job; classify-first and route there |
| Auto-editing the developer's tests and running the suite unprompted | Breaks the coach-don't-drive contract; mirror lz-tpp/lz-refactor question-vs-command routing |
| Imposing one testing school regardless of codebase | The whole point of the adaptive router; wrong on brownfield / mismatched-idiom code |
| Mock-everything / test-per-class / testing private methods | Couples tests to implementation; Cooper / Metz / Khorikov steer against it |
| Coverage-percentage targets as a RED goal | Coverage is an output, not a RED driver; trigger a new test on a new behavior |
| Outside-in / acceptance / double-loop RED | Deferred (Future Requirements); balloons scope and pulls in mockist tooling |
| GOOS mockist stance as a first-class route | Counterpoint only, unless mockist codebases become a supported target |
| DHH "TDD is dead" / test-induced design damage as a source | Hard-banned by maintainer decision; not cited or referenced anywhere |
| New repo build dependencies for the skill | The skill is Markdown-only; example-validation deps live in a dev-only workspace |

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| SKL-01 | Phase 15 | Complete |
| SKL-02 | Phase 15 | Complete |
| SKL-03 | Phase 15 | Complete |
| SEL-01 | Phase 16 | Complete |
| SEL-02 | Phase 16 | Complete |
| STR-01 | Phase 16 | Complete |
| STR-02 | Phase 16 | Complete |
| ASRT-01 | Phase 17 | Complete |
| ASRT-02 | Phase 17 | Complete |
| ASRT-03 | Phase 17 | Complete |
| NAME-01 | Phase 16 | Complete |
| LAW-01 | Phase 18 | Complete |
| LAW-02 | Phase 18 | Complete |
| RTR-01 | Phase 17 | Complete |
| RTR-02 | Phase 18 | Complete |
| RTR-03 | Phase 17 | Complete |
| VIT-01 | Phase 17 | Complete |
| VIT-02 | Phase 17 | Pending |
| SEAM-01 | Phase 18 | Complete |
| SEAM-02 | Phase 18 | Complete |
| ANTI-01 | Phase 17 | Complete |
| ANTI-02 | Phase 17 | Complete |
| DST-01 | Phase 19 | Complete |
| DST-02 | Phase 19 | Complete |
| DST-03 | Phase 19 | Complete |
| EVL-01 | Phase 20 | Pending (build complete; empirical run gated) |
| EVL-02 | Phase 20 | Pending (build complete; empirical run gated) |
| EVL-03 | Phase 21 | Pending (build complete; empirical run gated) |

**Coverage:**

- lz-tdd@0.0.3 requirements: 28 total
- Mapped to phases: 28
- Unmapped: 0

---
*Requirements defined: 2026-07-18*
*Last updated: 2026-07-22 -- EVL-03 formalized at Phase 21 plan time (D-14): an APPLY-based, 3-arm, multi-dimensional RED eval decomposed into EVL-03.1..EVL-03.7 (BUILD/RUN split) mapping the 5 Phase-21 ROADMAP success criteria, in the EVL-01/EVL-02 "build complete; empirical run gated" closure shape. Coverage 27 -> 28. Prior: 2026-07-21 after Phase 20 completion (25/27 Complete; EVL-01 + EVL-02 Pending build-then-halt per D-11; VIT-02 also Pending, carried).*
