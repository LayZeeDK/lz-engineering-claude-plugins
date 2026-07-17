# Feature Research

**Domain:** Dual-mode Claude Code agent skill -- lz-red, the RED step (choose + write the next failing UNIT test well) of red-green-refactor TDD, then hand off to lz-tpp.
**Researched:** 2026-07-18
**Confidence:** HIGH (framings of every locked source verified against authoritative talks/books/primary posts; Vitest API and Osherove-3rd-ed naming nuance are MEDIUM -- see Source Traceability)

## What RED Actually Consists Of

RED is not "write a test." It is a disciplined micro-decision loop, and lz-red must coach each move without straying into the GREEN step (lz-tpp) or the REFACTOR step (lz-refactor):

1. PICK the next failing test (from a test list, one small step at a time, degenerate-first, triangulating toward generality).
2. STRUCTURE it (Arrange-Act-Assert / Given-When-Then, assert-first, evident data, one concept per test).
3. ASSERT observable behavior, not implementation (Khorikov four pillars + three styles; Metz message matrix; Cooper public-API-only).
4. NAME it after the behavior (BDD "should" / Osherove three-part).
5. Make it FAIL for the right reason (Three Laws Law 2: write only enough to fail; watch the red bar; not-compiling counts as failing).
6. Match the codebase's testing STANCE adaptively (house idiom always; route by structural control / seams to Bernhardt / Metz / Feathers; "listen to the tests").
7. HAND OFF to lz-tpp for the minimal transformation that turns the bar green (Three Laws Law 3).

The load-bearing boundary: lz-red owns "what test, shaped how, asserting what, named how, failing how." The moment the question becomes "what minimal code change makes it pass," that is lz-tpp. The moment it becomes "improve working code without changing behavior," that is lz-refactor. lz-red re-uses the same three-way classify-first seam that lz-refactor step 1 already establishes.

## Feature Landscape

### Table Stakes (Users Expect These)

Every capability below is core to a credible RED coach. Missing any one leaves the skill unable to guide a full RED move. Each is traced to a locked source.

| Feature (candidate category) | Why Expected | Source (locked) | Complexity | Notes |
|---|---|---|---|---|
| **1. Test selection / ordering** -- keep a test list; take one small step (one-step test); start degenerate/starter (empty, zero, null); triangulate by adding a second/third example to force generality | RED begins with choosing WHICH test; picking too big a step or skipping the degenerate case is the most common RED failure | Beck, *TDD by Example* (Test List, One Step Test, Starter Test, Triangulate) | MEDIUM | Triangulation here is the RED facet only (add another example to select the next test). The GREEN facet (Fake It -> generalize, Obvious Implementation) stays in lz-tpp. Degenerate-first aligns with lz-tpp `{} -> nil` but lz-red picks the test, lz-tpp picks the transformation. |
| **2. Test structure** -- Arrange-Act-Assert / Given-When-Then; assert-first; evident/intention-revealing data; one concept per test | A well-formed test is table stakes; shape is what makes a RED test readable and diagnostic | Bill Wake (Arrange-Act-Assert); Dan North (Given-When-Then); Beck, *TDD by Example* (Assert First, Test Data, Evident Data, Isolated Test) | LOW-MEDIUM | AAA and GWT are the same skeleton in two vocabularies -- offer both, match house idiom. Assert-first ("write the assertion, then work backward") is a Beck RED-authoring pattern, not a green move. |
| **3. Assertion design** -- assert observable behavior not implementation; choose output- / state- / communication-based style; the four pillars as a quality lens | Deciding WHAT to assert is where RED tests are made durable or made fragile; this is the single highest-value RED skill | Khorikov, *Unit Testing* (four pillars: protection-against-regressions, resistance-to-refactoring, fast-feedback, maintainability; three styles: output/state/communication; observable-behavior-vs-implementation); Metz "Magic Tricks of Testing" (query->assert-return, incoming-command->assert-public-side-effect, self/outgoing-query->ignore, outgoing-command->expect-to-send); Cooper "TDD Where Did It All Go Wrong" (test through the module/public API) | MEDIUM-HIGH | The Metz matrix is design-agnostic and works on any public boundary; the Khorikov styles map cleanly onto the stance router (output <-> Bernhardt functional core; state/communication <-> Metz boundary; characterization <-> Feathers). |
| **4. Test naming** -- name after the behavior (BDD "should ..."); Osherove UnitOfWork_StateUnderTest_ExpectedBehavior as a documented alternative | A behavior-shaped name is expected of any test coach and doubles as living documentation | Dan North (*Introducing BDD*: "should", ubiquitous language, GWT); Roy Osherove (*Art of Unit Testing*: three-part convention; 3rd ed JS relaxes toward readability) | LOW | Primary = behavior/BDD naming (a name that fails the "should the class do X?" sentence test signals the behavior belongs elsewhere). Osherove three-part is the alternative for teams that prefer it; the 3rd-ed (JS) readability relaxation is noted with MEDIUM confidence. |
| **5. Fail for the right reason** -- write only enough test to fail (not-compiling is failing); watch the red bar; confirm it fails for the asserted reason, not a typo/compile error/false-green | The defining discipline of RED; without it TDD degenerates into test-after | Robert C. Martin (Three Laws of TDD, Law 2); Beck, *TDD by Example* (run it, see red before green) | LOW | This is the Three Laws spine the whole procedure hangs on. Exactly one red test at a time; Law 1 gates entry (no production code before a failing test), Law 3 is the lz-tpp handoff. |
| **6. Adaptive testing-stance router** -- detect + match the house test idiom always; route by structural control / seam availability: controllable structure -> Bernhardt functional core-imperative shell; testable public boundary -> Metz query/command matrix; no seams (legacy) -> Feathers seams + characterization tests; meta-rule "listen to the tests" (test pain = design feedback); optional override phrase, NO flag | Brownfield code cannot assume one school; a coach that imposes a single stance is wrong half the time -- this is the milestone's crown capability | Gary Bernhardt (*Boundaries*: functional core / imperative shell; *Fast Test Slow Test*: isolate, no I/O); Sandi Metz + Katrina Owen (*Magic Tricks of Testing*; message matrix); Michael Feathers (*WELC*: seams, characterization tests); Beck (*Test Desiderata* / design-feedback); GOOS "listen to the tests" (counterpoint) | HIGH | See Differentiators -- this is the primary differentiator, listed here because a RED coach that ignores house idiom is not credible. Feathers path overlaps lz-refactor/refactoring-without-tests.md (same author, different phase: lz-red writes the first characterization/failing test when ADDING behavior to seamless legacy; lz-refactor pins behavior before RESTRUCTURING). Cross-link, do not duplicate. |
| **7. TypeScript + Vitest mechanics mapping** -- `it.todo`/`test.todo` as the test list; `test.each`/`it.each` for triangulation; `expectTypeOf`/`assertType` (+ `--typecheck`) for type-level RED; `vi.fn`/`vi.spyOn`/`vi.mock` used with restraint; watch mode as the red-green feedback loop | The locked stack is TS + Vitest; a coach that only speaks in the abstract is not usable at the keyboard | Locked stack decision (PROJECT.md); Vitest API | MEDIUM | Language-agnostic principles stay primary; Vitest is the concrete rendering layer. Mechanics must be `tsc --strict`-clean, matching the 0.0.1/0.0.2 house rule. Mocks-with-restraint enforces Metz/Cooper/Khorikov at the API level. |
| **8. lz-tpp seam** -- Three Laws Law 1/2 (RED) -> Law 3 (GREEN) handoff; classify-first (RED vs GREEN vs REFACTOR); reverse pointer lz-tpp -> lz-red | Without the seam the RGR loop is not closed; lz-tpp already exists and expects the handoff | Robert C. Martin (Three Laws); existing lz-tpp SKILL.md seam pattern | LOW | Mirror lz-refactor's step-1 classification and its lz-tpp seam block. PROJECT.md carries the tech-debt to add the reverse lz-tpp -> lz-red pointer on the next lz-tpp edit; lz-red ships the forward pointer. |
| **9. Anti-pattern reference** -- a lazy-loaded leaf naming RED anti-patterns and the observable-behavior fix, including Cooper's over-mock / test-per-class warning | A reference skill is expected to explain what NOT to do, mirroring lz-refactor's de-patterning leaves | Cooper (over-mock, test-per-class, mock internals); Khorikov (testing private methods/state; communication-style overuse); Metz (ignore self/outgoing-query); Beck (*Test Desiderata*: structure-insensitive, deterministic, specific); Bernhardt / F.I.R.S.T. (slow/flaky) | MEDIUM | See Anti-Features. This is content the skill teaches, distinct from behaviors the skill refuses. |

### Differentiators (Competitive Advantage)

Where lz-red earns its keep over an unaided model or a generic "write tests" prompt.

| Feature | Value Proposition | Source (locked) | Complexity | Notes |
|---|---|---|---|---|
| **Adaptive testing-stance router (as a decision procedure, not a lecture)** | No mainstream tool routes test stance by structural control / seam availability and matches house idiom; this is the milestone's core bet and the thing an unaided model does inconsistently | Bernhardt / Metz / Feathers / Beck (see cat 6) | HIGH | Encode as an explicit routing step (like lz-refactor's smell-routing and APPLY/DECLINE net-cost gate): detect idiom -> assess control/seams -> pick stance -> pick assertion style. State the route chosen and why. |
| **"Listen to the tests" as design feedback** | Turns a hard-to-write RED test into a signal ("the test is hard because the design has a seam problem") instead of a reason to over-mock -- reframes RED as a design tool | GOOS (counterpoint: "listen to your tests"); Beck (*Test Desiderata*: test difficulty as feedback) | MEDIUM | The unifying meta-rule the milestone brief names. When a test wants heavy mocking or private access, that is a routing signal toward Bernhardt (extract a functional core) or Feathers (introduce a seam), not toward more doubles. |
| **Type-level RED** -- `expectTypeOf`/`assertType` failing tests for type contracts | TS-specific: lets RED drive type design, not just runtime behavior; unique to the locked stack | Locked stack; Vitest type-testing API | MEDIUM | An advanced leaf; requires `vitest --typecheck`. Keep behind progressive disclosure. |
| **Property-based RED with fast-check** -- express an invariant/property as the failing test, shrink to a minimal counterexample | Advanced RED technique that finds the degenerate case for you and states behavior as a universal rather than by example | fast-check (locked as advanced technique) | MEDIUM-HIGH | A lazy-loaded advanced leaf, not a default. Frame as "when example-based triangulation is not enough." |
| **Test Desiderata as a tradeoff lens (not dogma)** | Presents good-test properties as tradeoffs to optimize, matching lz-tpp's "heuristic not law" framing and avoiding cargo-cult rules | Beck (*Test Desiderata*: 12 properties, "no property given up without a property of greater value") | LOW | Lets the coach explain WHY a test is shaped a certain way, and permit a reasoned deviation -- consistent with the house voice. |

### Anti-Features (Commonly Requested, Often Problematic)

Behaviors the skill must refuse or steer away from. First group = capabilities out of scope for lz-red; second group = testing anti-patterns lz-red must not encourage.

| Feature | Why Requested | Why Problematic | Alternative |
|---|---|---|---|
| **Outside-in / acceptance / double-loop RED** (write a failing acceptance test that drives inner unit tests) | Natural next question once unit RED works; GOOS-style | Explicitly DEFERRED this milestone; pulls in test-double-heavy mockist style and acceptance tooling, ballooning scope | Unit RED only in 0.0.3; note the deferral and point forward to a later milestone |
| **Write and run the implementation to make it pass** | "Just make the test green for me" | That is the GREEN step -- lz-tpp's job; duplicating it fractures the seam | Hand off to lz-tpp with the failing test; coach, do not drive |
| **Refactor the code / clean up structure** | "While we are here, tidy this" | That is the REFACTOR step -- lz-refactor's job | Classify-first; route structure-only work to lz-refactor |
| **Auto-edit tests and run the suite unprompted** | "Do it for me" | Unrequested edits to a developer's tests are unwelcome; breaks the coach-don't-drive contract both sibling skills honor | Mirror lz-tpp/lz-refactor QUESTION vs COMMAND routing: present the test + next step on a question; write it only on an explicit command, then stop |
| **Impose one testing school regardless of codebase** | Simpler to teach one dogma | Wrong on brownfield / mismatched-idiom code; the whole point of the adaptive router | The stance router: match house idiom, route by control/seams |
| **Mock everything / test-per-class / test private methods** | Feels "thorough"; mirrors misread TDD | Couples tests to implementation, makes refactoring break tests, over-specifies | Cooper: test through the public API, trigger on new behavior not new class; Metz: ignore self + outgoing-query; Khorikov: assert observable behavior; mock only true external boundaries |
| **Coverage-percentage targets as a RED goal** | Managers/tools ask for a number | Coverage is an output, not a RED driver; chasing it produces low-value tests | Trigger a new test on a new behavior (Cooper); optimize desiderata (Beck), not a percentage |
| **DHH "TDD is dead" / test-induced-design-damage framing** | Well-known contrarian talking point | HARD BAN by maintainer decision | Do not cite or reference it in any leaf; use Bernhardt/Metz/Feathers for the design-vs-test tension instead |

## Feature Dependencies

```
Robert C. Martin -- Three Laws of TDD (cat 5)         <- the spine everything hangs on
    |
    +--requires--> Test selection/ordering (cat 1)
    |                   |
    |                   +--feeds--> lz-tpp seam (cat 8)  [after fail, hand to GREEN]
    |
    +--requires--> Test structure (cat 2)
    |                   ^
    |                   |--enhances-- Test naming (cat 4)   [name = the selected behavior]
    |
    +--requires--> Assertion design (cat 3)
                        |
                        +--requires--> Adaptive stance router (cat 6)  [style depends on stance]
                        |
                        +--underpins--> Anti-pattern reference (cat 9)

TypeScript + Vitest mechanics (cat 7) --renders--> cats 1-6   [concrete layer under all principles]

lz-red --classify-first--> { RED = stay | GREEN = lz-tpp | REFACTOR = lz-refactor }
    conflicts-with (scope): Outside-in / acceptance RED (deferred)
```

### Dependency Notes

- **cats 1-6 require the Three Laws spine (cat 5):** Law 1 gates entry (no production code before a failing test), Law 2 sizes the test (only enough to fail), Law 3 is the lz-tpp handoff. Author cat 5 first; it frames the coach decision procedure.
- **Assertion design (cat 3) requires the stance router (cat 6):** what you assert (output vs state vs communication -- Khorikov) is chosen by the stance (Bernhardt functional core -> output; Metz boundary -> state/communication; Feathers legacy -> characterization). Do not present assertion styles without the routing that selects them.
- **lz-tpp seam (cat 8) depends on lz-tpp existing:** it does (shipped 0.0.1). lz-red ships the forward pointer; the reverse lz-tpp -> lz-red pointer is carried tech-debt (PROJECT.md) for the next lz-tpp edit.
- **Feathers stance (inside cat 6) overlaps lz-refactor/refactoring-without-tests.md (same author):** different phase -- lz-red writes the FIRST failing/characterization test to add behavior to seamless legacy; lz-refactor pins behavior before restructuring. Cross-link, do not copy.
- **TS + Vitest mechanics (cat 7) render cats 1-6:** it.todo <-> test list; test.each <-> triangulation; expectTypeOf/assertType <-> type-level RED; vi.* with restraint <-> Metz/Cooper/Khorikov. Author last, on top of settled principles.
- **Scope conflict:** outside-in / acceptance RED conflicts with the 0.0.3 boundary; keep it out and label the deferral.

## MVP Definition

### Launch With (v1 -- lz-tdd@0.0.3)

The full RED decision procedure plus the adaptive router; everything the milestone brief lists.

- [ ] Dual-mode lz-red skill (auto-trigger coach + on-demand reference), lean SKILL.md + lazy references/, mirroring lz-tpp/lz-refactor -- essential structural parity
- [ ] Coach decision procedure on the Three Laws spine covering cats 1-6 in order -- essential (this is the product)
- [ ] Adaptive testing-stance router leaf (Bernhardt / Metz / Feathers + house-idiom detection + listen-to-the-tests + optional override phrase) -- the differentiator
- [ ] TS + Vitest mechanics woven through SKILL.md and references, tsc --strict-clean -- essential for usability
- [ ] lz-tpp seam block + forward pointer + classify-first -- essential to close the RGR loop
- [ ] Anti-pattern reference leaf (incl. Cooper over-mock / test-per-class) -- essential for a reference skill
- [ ] Behavior/BDD naming + Osherove alternative leaf -- essential
- [ ] Skill-effectiveness evals (trigger recall/specificity + RED-behavior accuracy) -- essential, as in 0.0.1/0.0.2

### Add After Validation (v1.x)

- [ ] Type-level RED leaf (expectTypeOf/assertType) -- add once the core RED loop triggers cleanly; TS differentiator
- [ ] Property-based RED with fast-check leaf -- add when example-based triangulation guidance is proven, as an advanced technique
- [ ] Reverse lz-tpp -> lz-red pointer -- bundle with the next lz-tpp edit (carried tech-debt)

### Future Consideration (v2+)

- [ ] Outside-in / acceptance / double-loop TDD RED -- deferred by decision; unit RED must land and prove out first
- [ ] Multi-language example sets beyond TypeScript -- deferred (FUT-02), agnostic principles + TS cover this milestone
- [ ] GOOS mockist stance as a first-class route -- GOOS stays counterpoint only unless mockist codebases become a supported target

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---|---|---|---|
| Coach decision procedure on Three Laws spine (cats 1,2,4,5) | HIGH | MEDIUM | P1 |
| Assertion design (cat 3) | HIGH | HIGH | P1 |
| Adaptive stance router (cat 6) | HIGH | HIGH | P1 |
| lz-tpp seam + classify-first (cat 8) | HIGH | LOW | P1 |
| TS + Vitest mechanics (cat 7) | HIGH | MEDIUM | P1 |
| Anti-pattern reference (cat 9) | MEDIUM | MEDIUM | P1 |
| Skill-effectiveness evals | HIGH | MEDIUM | P1 |
| Type-level RED (expectTypeOf/assertType) | MEDIUM | MEDIUM | P2 |
| Property-based RED (fast-check) | MEDIUM | HIGH | P2 |
| Reverse lz-tpp -> lz-red pointer | LOW | LOW | P2 |
| Outside-in / acceptance RED | MEDIUM | HIGH | P3 (deferred) |

**Priority key:** P1 must-have for launch; P2 should-have, add when possible; P3 future/deferred.

## Candidate lz-red Requirement Categories (downstream mapping)

The nine table-stakes rows map 1:1 to the requirement categories the milestone expects. Suggested grouping for REQUIREMENTS.md:

| # | Category | Table stakes / Differentiator | Primary locked source(s) | Depends on existing skill? |
|---|---|---|---|---|
| 1 | Test selection / ordering | Table stakes | Beck | -- |
| 2 | Test structure | Table stakes | Wake, North, Beck | -- |
| 3 | Assertion design | Table stakes | Khorikov, Metz, Cooper | -- |
| 4 | Test naming | Table stakes | North, Osherove | -- |
| 5 | Fail-for-the-right-reason (Three Laws spine) | Table stakes | Martin, Beck | seam to lz-tpp (Law 3) |
| 6 | Adaptive testing-stance router | Differentiator (crown) | Bernhardt, Metz, Feathers, Beck; GOOS counterpoint | cross-link lz-refactor Feathers leaf |
| 7 | TS + Vitest mechanics | Table stakes for stack | locked stack, Vitest | -- |
| 8 | lz-tpp seam | Table stakes | Martin; existing lz-tpp | requires lz-tpp; reverse pointer = lz-tpp tech-debt |
| 9 | Anti-pattern reference | Table stakes | Cooper, Khorikov, Metz, Beck | mirror lz-refactor de-patterning pattern |

## Non-Duplication Boundary (quality gate)

- **No transformations.** lz-red never ranks or recommends the code change that makes the test pass -- that is lz-tpp's Transformation Priority list. lz-red stops at "the test now fails for the right reason" and hands off.
- **No refactorings.** lz-red never restructures working code -- that is lz-refactor's Fowler/Kerievsky/GoF/functional catalogs. The only structural moves lz-red touches are stance-enabling (extract a functional core per Bernhardt, introduce a seam per Feathers) and even those are presented as design feedback / handoffs, not performed as refactorings.
- **Shared Feathers content is cross-linked, not copied:** lz-refactor already owns refactoring-without-tests.md (Feathers, pin-before-restructure). lz-red's Feathers use (characterization/first failing test when adding behavior to seamless legacy) links to it.

## Deferrals (explicit)

- Outside-in / acceptance / double-loop TDD RED -- OUT of 0.0.3 (Key Decision + Out of Scope in PROJECT.md).
- Multi-language examples beyond TypeScript -- deferred (FUT-02).
- GOOS mockist stance as a supported route -- counterpoint only.
- DHH test-induced-design-damage -- hard-banned, not a deferral.

## Source Traceability + Confidence

| Capability | Locked source | Framing verified | Confidence |
|---|---|---|---|
| Test list, one-step test, starter/degenerate, triangulate, assert-first, evident data | Beck, *TDD by Example* (TDD Patterns / Red Bar / Green Bar chapters) | Yes (established); triangulate has RED facet [select next example] vs GREEN facet [fake-it->generalize, stays in lz-tpp] | HIGH |
| Three Laws of TDD; F.I.R.S.T. (Fast, Isolated/Independent, Repeatable, Self-Validating, Timely) | Robert C. Martin, *Clean Code* | Yes | HIGH |
| Four pillars; observable behavior vs implementation; output/state/communication styles | Khorikov, *Unit Testing: Principles, Practices, and Patterns* | Yes | HIGH |
| Query/command x incoming/self/outgoing message matrix (assert return; assert public side effect; ignore self + outgoing-query; expect-to-send outgoing-command) | Metz + Owen, "Magic Tricks of Testing" | Yes | HIGH |
| Trigger on new behavior not new class; SUT = module/public API; do not mock internals; isolation for shared/slow/fragile, not defect-localization | Ian Cooper, "TDD, Where Did It All Go Wrong" | Yes | HIGH |
| Given-When-Then; "should" naming; ubiquitous language | Dan North, *Introducing BDD* | Yes | HIGH |
| Arrange-Act-Assert | Bill Wake | Yes | HIGH |
| Functional core / imperative shell; isolate, no I/O (fast vs slow tests) | Gary Bernhardt, *Boundaries* + *Fast Test Slow Test* | Yes | HIGH |
| Seams; characterization tests; "legacy code = code without tests" | Michael Feathers, *WELC* | Yes | HIGH |
| Test Desiderata (12 properties as tradeoffs; behavioral, structure-insensitive, deterministic, specific, isolated, composable, fast ...) | Kent Beck, Test Desiderata | Yes | HIGH |
| Osherove UnitOfWork_StateUnderTest_ExpectedBehavior | Osherove, *Art of Unit Testing* (blog + book) | Classic convention verified | HIGH |
| Osherove 3rd-ed (JS) relaxation toward readability | Osherove + Khorikov, *Art of Unit Testing* 3rd ed | Direction confirmed; exact updated wording not pinned | MEDIUM |
| "Listen to the tests" (test pain = design feedback) | GOOS (counterpoint) + Beck | Yes | HIGH |
| Vitest: it.todo, test.each, expectTypeOf/assertType (--typecheck), vi.* doubles, watch mode | Vitest API | Well-known API; not re-fetched this session | MEDIUM-HIGH (pin exact API in STACK research) |
| Property-based RED, shrinking | fast-check | Established (advanced technique) | HIGH |

## Sources

- Sandi Metz + Katrina Owen, "The Magic Tricks of Testing" (RailsConf 2013): https://www.rubyevents.org/talks/the-magic-tricks-of-testing ; slides https://speakerdeck.com/skmetz/magic-tricks-of-testing-railsconf -- HIGH
- Vladimir Khorikov, *Unit Testing: Principles, Practices, and Patterns* (Manning): https://www.oreilly.com/library/view/unit-testing-principles/9781617296277/ ; four-pillars summary https://www.sammancoaching.org/learning_hours/test_design/four_pillars_khorikov.html -- HIGH
- Kent Beck, "Test Desiderata": https://medium.com/@kentbeck_7670/test-desiderata-94150638a4b3 ; https://testdesiderata.com/ -- HIGH
- Ian Cooper, "TDD, Where Did It All Go Wrong" (NDC 2014): notes https://www.philhack.com/notes-from-tdd-where-did-it-all-go-wrong/ ; review https://robdmoore.id.au/blog/2015/01/26/review-of-ian-cooper-tdd-where-did-it-all-go-wrong -- HIGH
- Gary Bernhardt, "Boundaries" (functional core / imperative shell): https://www.destroyallsoftware.com/talks/boundaries -- HIGH
- Roy Osherove, "Naming standards for unit tests": https://osherove.com/blog/2005/4/3/naming-standards-for-unit-tests.html ; *Art of Unit Testing* 3rd ed (JS, w/ Khorikov): https://www.manning.com/books/the-art-of-unit-testing-third-edition -- HIGH (convention) / MEDIUM (3rd-ed nuance)
- Robert C. Martin, Three Laws of TDD + F.I.R.S.T. (*Clean Code*): https://agileinaflash.blogspot.com/2009/02/first.html -- HIGH
- Dan North, "Introducing BDD": https://dannorth.net/introducing-bdd/ -- HIGH
- Bill Wake, "Arrange-Act-Assert": https://xp123.com/articles/3a-arrange-act-assert/ -- HIGH (framing well-established)
- Kent Beck, *TDD by Example* (Test List, One Step Test, Starter Test, Assert First, Evident Data, Triangulate) -- primary book; framings cross-checked against community summaries -- HIGH
- Michael Feathers, *Working Effectively with Legacy Code* (seams, characterization tests) -- primary book -- HIGH
- fast-check (property-based testing for TS/JS): https://fast-check.dev/ -- HIGH

---
*Feature research for: lz-red RED-phase TDD coach + reference (lz-tdd@0.0.3)*
*Researched: 2026-07-18*
