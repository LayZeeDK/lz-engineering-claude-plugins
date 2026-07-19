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

- [ ] **ASRT-01**: Guidance to assert observable behavior, not implementation (Khorikov's four pillars, with resistance-to-refactoring as the load-bearing property).
- [ ] **ASRT-02**: Output- / state- / communication-based assertion-style selection, tied to the stance router (output <-> Bernhardt functional core; state / communication <-> Metz boundary; characterization <-> Feathers legacy).
- [ ] **ASRT-03**: The Metz query / command message matrix as the design-agnostic rule for what to assert and what to mock (assert return of incoming queries; assert public side effect of incoming commands; ignore self and outgoing queries; expect-to-send only for outgoing commands).

### Test naming (NAME)

- [x] **NAME-01**: Behavior / BDD "should ..." naming as primary, with Osherove's three-part `UnitOfWork_StateUnderTest_ExpectedBehavior` convention as a documented alternative.

### Three Laws spine and fail-for-the-right-reason (LAW)

- [ ] **LAW-01**: The Three Laws of TDD framed as the RED spine -- Law 1 gates entry (no production code before a failing test), Law 2 sizes the test (only enough to fail; not-compiling counts), Law 3 is the lz-tpp handoff.
- [ ] **LAW-02**: Fail-for-the-right-reason guidance -- watch the red bar; confirm the test fails on the asserted behavior, not a compile / setup error or a false green; F.I.R.S.T. as the test-quality baseline.

### Adaptive testing-stance router (RTR) -- the differentiator

- [ ] **RTR-01**: A `testing-stance/` reference subdir with three leaves -- Bernhardt (functional core-imperative shell), Metz (message matrix), Feathers (seams + characterization tests) -- with Feathers cross-linked to lz-refactor's `refactoring-without-tests.md`, not copied.
- [ ] **RTR-02**: A coach routing step -- detect and match the house test idiom always; route by structural control / seam availability to the right stance; state the route chosen and why; honor an optional override phrase (no CLI flag).
- [ ] **RTR-03**: The "listen to the tests" meta-rule -- test-writing pain (heavy mocking, private access) is design feedback routing toward a functional core (Bernhardt) or a seam (Feathers), not more doubles; GOOS referenced as a counterpoint only.

### TypeScript and Vitest mechanics (VIT)

- [ ] **VIT-01**: Vitest mechanics mapped to RED concepts -- `it.todo` (test list), `test.each` (triangulation), `vi.*` doubles with restraint, watch mode as the feedback loop -- pinned to Vitest 4.x and tsc --strict-clean.
- [ ] **VIT-02**: TypeScript + Vitest examples throughout `SKILL.md` and the references, paired with the language-agnostic principles, all tsc --strict-clean.

### lz-tpp seam (SEAM)

- [ ] **SEAM-01**: Classify-first (RED vs GREEN vs REFACTOR) plus the forward `lz-red -> lz-tpp` handoff (Law 1/2 -> Law 3) in the coach decision procedure.
- [ ] **SEAM-02**: A reverse `lz-tpp -> lz-red` pointer added to the shipped lz-tpp skill (closes the carried reverse-pointer tech-debt); the lz-tpp edit is subagent-reviewed before acceptance.

### Anti-pattern reference and Test Desiderata (ANTI)

- [ ] **ANTI-01**: An anti-pattern reference leaf naming RED anti-patterns and the observable-behavior fix -- including Ian Cooper's over-mock / test-per-class warning, testing private methods, multiple unrelated assertions, a test that passes immediately, snapshot-as-thinking, and slow / order-dependent tests.
- [ ] **ANTI-02**: A Test Desiderata tradeoff lens (Beck's good-test properties as tradeoffs to optimize, not dogma), matching lz-tpp's "heuristic not law" voice.

### Distribution and hygiene (DST)

- [ ] **DST-01**: `plugin.json` bumped to 0.0.3; README + CHANGELOG document lz-red as the RED step completing the three-skill red-green-refactor loop; the marketplace listing names all three skills.
- [ ] **DST-02**: The repo passes `claude plugin validate . --strict`; the plugin-validator and skill-reviewer agents both PASS on lz-red.
- [ ] **DST-03**: Hygiene -- ASCII-only shipped tree; no verbatim book prose or talk transcripts (own-words, DST-04 clean-room via git-ignored `.oracle/`); maintainer work-email absent (allowlist-inversion); all TypeScript samples tsc --strict-clean.

### Skill-effectiveness evals (EVL)

- [ ] **EVL-01**: A trigger eval -- lz-red fires on RED-phase prompts and stays quiet on near-misses -- INCLUDING a cross-skill trigger eval proving the three-way boundary (lz-red vs lz-tpp vs lz-refactor) holds.
- [ ] **EVL-02**: A RED-behavior eval -- the coach recommends the correct next-test / assertion move (right selection, structure, and assertion target) versus an unaided baseline, as in the 0.0.1 / 0.0.2 evals.

## Future Requirements

Deferred to a later lz-tdd release. Tracked, not in this roadmap.

### Advanced RED techniques (post-0.0.3)

- **ADV-01**: Type-level RED leaf -- `expectTypeOf` / `assertType` failing tests for type contracts (needs `vitest --typecheck` + `*.test-d.ts`). Add after the core RED loop triggers cleanly.
- **ADV-02**: Property-based RED leaf -- express an invariant as the failing test and shrink to a minimal counterexample with `fast-check`. Add when example-based triangulation guidance is proven.

### Later milestones

- **FUT-OUTSIDE-IN**: Outside-in / acceptance / double-loop TDD RED (a failing acceptance test driving inner unit tests). Deferred; unit RED must land and prove out first.
- **FUT-02**: Multi-language example sets beyond TypeScript.
- **FUT-04**: Split the Kerievsky layer of lz-refactor into its own skill (carried from 0.0.2).

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
| ASRT-01 | Phase 17 | Pending |
| ASRT-02 | Phase 17 | Pending |
| ASRT-03 | Phase 17 | Pending |
| NAME-01 | Phase 16 | Complete |
| LAW-01 | Phase 18 | Pending |
| LAW-02 | Phase 18 | Pending |
| RTR-01 | Phase 17 | Pending |
| RTR-02 | Phase 18 | Pending |
| RTR-03 | Phase 17 | Pending |
| VIT-01 | Phase 17 | Pending |
| VIT-02 | Phase 17 | Pending |
| SEAM-01 | Phase 18 | Pending |
| SEAM-02 | Phase 18 | Pending |
| ANTI-01 | Phase 17 | Pending |
| ANTI-02 | Phase 17 | Pending |
| DST-01 | Phase 19 | Pending |
| DST-02 | Phase 19 | Pending |
| DST-03 | Phase 19 | Pending |
| EVL-01 | Phase 20 | Pending |
| EVL-02 | Phase 20 | Pending |

**Coverage:**

- lz-tdd@0.0.3 requirements: 27 total
- Mapped to phases: 27
- Unmapped: 0

---
*Requirements defined: 2026-07-18*
*Last updated: 2026-07-18 after roadmap creation (all 27 requirements mapped to Phases 15-20)*
