# Pitfalls Research

**Domain:** Authoring the lz-red RED-phase TDD coaching skill (Claude Code plugin skill) -- milestone lz-tdd@0.0.3
**Researched:** 2026-07-18
**Confidence:** HIGH

Two buckets, per the brief:

- **Bucket A -- RED anti-patterns to CATALOG in the skill** (each tied to a locked source). These are what the
  skill's anti-pattern reference leaf must teach against, and what the coach must steer away from.
- **Bucket B -- authoring pitfalls specific to building this skill in this repo.** These are risks to the
  roadmap itself: how the skill gets built wrong.

Phase names below are proposed (roadmap not yet created); they mirror the 0.0.1 / 0.0.2 phase shape
(source distillation -> scaffold -> coach -> router -> TS+Vitest -> anti-pattern leaf -> seam -> distribution/hygiene -> evals):
`P-SRC`, `P-SCAF`, `P-COACH`, `P-ROUTER`, `P-TS`, `P-ANTI`, `P-SEAM`, `P-DIST`, `P-EVAL`.

---

## Critical Pitfalls

The highest-impact items from both buckets. Bucket A anti-patterns 1-10 and Bucket B authoring pitfalls B1-B6
are summarized in full tables further down; the detailed entries here are the ones most likely to sink the
milestone if missed.

### Pitfall 1 (A): The test that never fails -- not observed RED, or RED for the wrong reason

**What goes wrong:**
A test is written that passes on first run (asserts something already true), or it "fails" but for a reason
other than missing behavior (compile error, typo in the setup, wrong import, an exception in Arrange rather than
Act). Either way the developer never sees a legitimate RED that the next code change will turn green. The whole
premise of RED is defeated: the test proves nothing.

**Why it happens:**
The coach jumps to writing production code before confirming the test fails, or accepts a red bar without
reading WHY it is red. Assertions on incidental state pass trivially. This is the failure RCM's First Law
exists to prevent.

**Source:** RCM Three Laws (First Law: no production code until a failing test demands it) + Beck (see it fail
first; the RED bar must be a real, expected failure) + Osherove (a test that cannot fail is untrustworthy).

**How to avoid:**
Make "fail for the right reason" an explicit step in the RED decision procedure: run the new test, read the
failure message, and confirm it fails on the ASSERTION (Act/Assert) because behavior is missing -- not on a
compile/setup error. If it passes immediately, the behavior already exists or the assertion is wrong; revise the
test. Only then hand off to lz-tpp.

**Warning signs:**
Green on first run; a failure message pointing at Arrange, an import, or a type error rather than the assertion;
"expected X but got undefined is a compile error" confusion.

**Phase to address:** P-COACH (make it a procedure step), P-ANTI (catalog it).

---

### Pitfall 2 (A): Testing implementation details -- brittle tests, no resistance to refactoring

**What goes wrong:**
Tests assert on private methods, internal call sequences, or the identity of collaborators (that a
`TeamRepository` was used) rather than on observable behavior. The tests break the moment structure changes even
though behavior is unchanged -- so they actively punish refactoring, which is the exact opposite of what TDD
should enable.

**Why it happens:**
The "one test per class/method" habit (see Pitfall 4) forces knowledge of internals into tests. Developers
conflate "unit" with "class" and over-specify.

**Source:** Khorikov (four pillars; "resistance to refactoring" is the pillar this violates -- coupling to
implementation produces false positives) + Ian Cooper (the trigger for a new test is a new BEHAVIOR, not a new
function; you cannot refactor if implementation details are baked into tests) + Metz (test the interface / the
messages, not the internals).

**How to avoid:**
Coach asserts on observable behavior through the smallest public/port boundary that expresses the requirement.
Route "what is the unit / where does the test go" to a behavior boundary, not a class. State the yardstick: if a
behavior-preserving refactoring would break this test, the test is testing the wrong thing.

**Warning signs:**
Assertions naming private members; heavy setup mirroring internal structure; tests that must change in lockstep
with every refactor.

**Phase to address:** P-COACH, P-ANTI, P-ROUTER (Metz matrix decides what is assertable).

---

### Pitfall 3 (B): Description collision with lz-tpp and lz-refactor -- the trigger-boundary problem

**What goes wrong:**
lz-red, lz-tpp, and lz-refactor sit on three adjacent steps of one loop and share vocabulary (test, failing,
red, TDD, unit). lz-tpp's shipped description already fires on "when a failing test and the current code are
present." lz-red's whole job is the step just BEFORE that -- writing the failing test. Without sharp guards, a
prompt like "help me with this failing test" auto-triggers the wrong skill, or two/three skills fire at once and
the model picks arbitrarily. The RGR seam becomes noise.

**Why it happens:**
Description-based auto-triggering keys on surface phrases. "Failing test" is the natural phrase for both "help me
WRITE the next failing test" (lz-red) and "what minimal code makes this failing test pass" (lz-tpp). Adjacent
steps with a shared noun collide by default.

**How to avoid:**
Define one crisp boundary and encode it as reciprocal near-miss guards in all three descriptions:

- **lz-red** = choosing and WRITING the next failing UNIT test (which test next, how to structure it, is this a
  good test, does it fail for the right reason). Its "Do NOT use" clause must defer (a) making an existing red
  test pass / choosing the minimal code change -> lz-tpp, and (b) improving structure of green code -> lz-refactor.
- **lz-tpp** = a test already exists and is RED; pick the minimal transformation to make it pass. Add a reverse
  guard: if the request is which test to write / how to write the test, that is lz-red (this closes the
  carried-forward "reverse lz-tpp -> lz-red pointer" tech-debt noted in PROJECT.md).
- **lz-refactor** = tests green; structure only. Its existing green/refactor seam already excludes behavior
  change; confirm it does not swallow "write a test" prompts.

Wire the lz-red -> lz-tpp handoff (Three Laws 1/2 -> Law 3) and reverse pointers. Then PROVE the boundary holds
with cross-skill trigger evals: near-miss prompts that belong to each sibling must NOT fire lz-red, and vice
versa (recall + specificity, as in EVAL-01 / EVL-01).

**Warning signs:**
Two skills' descriptions both plausibly match a test-writing prompt; eval specificity drops when lz-tpp / lz-refactor
near-miss prompts are added to the lz-red suite; the word "test" appears un-qualified in lz-red's should-be-used
clause.

**Phase to address:** P-SCAF (author the three-way-guarded description), P-SEAM (wire handoff + reverse pointers),
P-EVAL (cross-skill trigger eval is the verification gate).

---

### Pitfall 4 (A): Over-mocking, mockist over-coupling, and one-test-per-class

**What goes wrong:**
Every collaborator is mocked; every class gets its own test in isolation. Result: a high ratio of test code to
production code, tests that assert on interactions with implementation collaborators, and a suite that blocks
refactoring because swapping internal classes breaks tests. This is Ian Cooper's central diagnosis of "where TDD
went wrong."

**Why it happens:**
Misreading Beck's "unit test = test that runs in isolation from other tests" as "test each unit (class) in
isolation." Once you test every class alone, you must mock every collaborator, which means mocking implementation
details.

**Source:** Ian Cooper (direct -- do not mock internals, privates, or adapters; several classes tested by one
test class is correct) + Khorikov (mock only unmanaged out-of-process dependencies; never in-process
collaborators) + Metz (Magic Tricks message matrix: assert outgoing COMMAND messages with mocks; do NOT test
outgoing query messages; do not test private methods). **GOOS is the counterpoint** (London/mockist school, mock
roles at boundaries) -- present it as a documented alternative, not the default, and never let it license mocking
in-process collaborators.

**How to avoid:**
Coach mocks only at true seams / unmanaged out-of-process dependencies (per the router: Feathers seams, Metz
command messages). Default to testing behavior through a port with real in-process collaborators. Trigger for a
new test is a new behavior, not a new class. Route mock decisions through the Metz command/query matrix.

**Warning signs:**
A mock for every constructor argument; assertions like "verify repository.save was called"; one spec file per
class file; test count tracking class count.

**Phase to address:** P-COACH, P-ROUTER (Metz matrix + Feathers seams), P-ANTI (this is the flagship anti-pattern
leaf, called out in PROJECT.md target features).

---

### Pitfall 5 (A): The functional-core-imperative-shell brownfield trap

**What goes wrong:**
The coach recommends "extract a functional core and test it without mocks" (Bernhardt) as if it is always
available. In brownfield code there is often no seam and no separable pure core; the advice is unactionable and
the developer either can't follow it or performs a large, risky restructuring just to write one test.

**Why it happens:**
FCIS is a design you ACHIEVE, a precondition for cheap value-based testing -- not a property every codebase
already has. Treating a design target as a starting assumption is the error. The adaptive router must not default
to one school.

**Source:** Bernhardt (Boundaries / functional core-imperative shell -- the ideal) counterpointed by Feathers
(WELC -- when there is no seam, introduce one first via characterization tests) and Metz (the message matrix is
design-agnostic and works without a pure core).

**How to avoid:**
This is exactly what the adaptive testing-stance router is for. Detect structural control / seams first:
FCIS-shaped code -> Bernhardt value-based tests; message-oriented OO -> Metz query/command matrix; no seam /
legacy -> Feathers (pin behavior with a characterization test, create a seam, THEN write the driving test).
Never prescribe FCIS where no core exists.

**Warning signs:**
"Just extract the pure logic" with no seam in sight; a RED step that requires a multi-file restructure before the
test can even be written; the router collapsing to one school regardless of the code.

**Phase to address:** P-ROUTER (the router IS the mitigation), P-ANTI.

---

### Pitfall 6 (B): DST-04 near-verbatim copyright leak from books and talks

**What goes wrong:**
The reference leaves reproduce canonical one-liners near word-for-word: the F.I.R.S.T. acronym expansion, the
Three Laws phrasing, Beck's definitions, Metz's matrix cells, Cooper's "Fallacy / Principle" formulations,
North's Given-When-Then wording. Terse, memorable canon reconstructs itself almost verbatim in a blind draft --
this trap has fired repeatedly in this repo (memory: pattern-leaf Intent near-verbatim DST-04 trap; caught by
multiple reviewers in 0.0.1 / 0.0.2).

**Why it happens:**
Canonical definitions are short and quotable; an author drafting from memory lands on the source's exact words.
Owned books (RCM Clean Code; Metz 99 Bottles JS Ed) and transcribed talks are copyrighted.

**How to avoid:**
Use the established clean-room model: owned books and transcribed talks live git-ignored under `.oracle/` and are
read ONLY via the clean-room oracle / oracle-reviewer agents; the main context never reads book prose; only
own-words synthesis crosses back. Paraphrase every canonical one-liner in original wording from the first draft
(do not draft verbatim then soften). Facts, acronyms-as-facts, and API names are fine; sentence-level phrasing
must be original. Run the oracle-reviewer verdict and the no-verbatim hygiene gate before ship. DHH is hard-banned
as a source entirely (not just paraphrased -- excluded).

**Warning signs:**
A leaf sentence that would match the source if grep'd; acronym glosses that read like the book's own gloss;
reviewer flags "this is the source's phrasing."

**Phase to address:** P-SRC (clean-room distillation), P-ANTI / P-COACH (own-words drafting), P-DIST (skill-reviewer
+ no-verbatim gate).

---

## Bucket A -- RED anti-patterns to catalog (all 10, source-tied)

Each is a leaf the skill teaches against; symptom / why / prevention condensed, source named.

| # | Anti-pattern | Source | Symptom | Prevention (what the coach does) |
|---|--------------|--------|---------|----------------------------------|
| A1 | Test passes immediately / never seen RED / RED for wrong reason | RCM Three Laws; Beck; Osherove | Green on first run, or failure is a compile/setup error not an assertion | Explicit "fail for the right reason" step before handoff |
| A2 | Testing implementation details (brittle, no resistance to refactoring) | Khorikov (four pillars); Ian Cooper; Metz | Asserts private members / call sequences; breaks on behavior-preserving refactor | Assert observable behavior through the smallest port/boundary |
| A3 | Multiple unrelated assertions / more than one concept per test | Beck (one concept per test); Osherove; Wake (single Act) | One test asserts several independent things; unclear what broke | One behavior per test; one logical concept; assert-first to keep it focused |
| A4 | Over-mocking / mockist over-coupling / one-test-per-class | Ian Cooper (direct); Khorikov; Metz; GOOS (counterpoint only) | Mock per collaborator; one spec per class; "verify X was called" | Mock only unmanaged out-of-process deps / true seams; test behavior through a port |
| A5 | Starting with too large a test (violates one-step) | Beck (one-step test; starter/degenerate); RCM/TPP (start degenerate) | First test demands a big leap of production code; no small green path | Pick the smallest test that teaches something and is confidently passable; start degenerate ({} -> nil, nil -> constant); triangulate |
| A6 | Method-shaped test names instead of behavior names | North (BDD / Given-When-Then, "should"); Osherove (scenario naming); Ian Cooper | Names like `test_getUser` / `add_returnsSum`; names track methods not behavior | Behavior-shaped names describing scenario + expected outcome |
| A7 | Slow / order-dependent / non-isolated tests | RCM F.I.R.S.T. (Fast, Independent, Repeatable, Self-validating, Timely) | Tests share state, pass only in order, hit I/O, run slow | Independent + isolated + fast; no shared mutable state; deterministic |
| A8 | Snapshot-everything as a substitute for deliberate assertions | Khorikov (readability + resistance to refactoring); Beck (evident/assert-first); Osherove | Giant `toMatchSnapshot` blobs auto-updated on every change; no stated expectation | Deliberate, minimal assertions on the behavior under test; snapshots only for stable serializable output, reviewed not rubber-stamped |
| A9 | FCIS-in-brownfield trap (assuming a functional core exists) | Bernhardt (FCIS ideal); Feathers (seam-first); Metz (design-agnostic matrix) | "Extract the pure core" advice with no seam; RED needs a big restructure first | Router detects seams; no seam -> Feathers characterization + seam first; do not force FCIS |
| A10 | Blindly mirroring a bad house style | GOOS / Beck "listen to the tests" meta-rule; Metz / Khorikov as yardstick | Propagating the codebase's existing implementation-detail tests / over-mocking because "that's the house style" | Match house IDIOM (naming, structure, doubles) but not house ANTI-PATTERNS; surface the tension when the house style is one of A1-A8 |

Note on A10 vs the locked "match house idiom ALWAYS" rule: the router matches the house TEST IDIOM (framework
usage, naming shape, assertion style). It does not adopt house practices that are themselves A1-A8. When the two
conflict, name it and let the developer decide -- do not silently propagate the anti-pattern.

---

## Bucket B -- authoring pitfalls specific to this skill + repo (all 6)

| # | Authoring pitfall | Symptom | Why it happens | Prevention | Phase |
|---|-------------------|---------|----------------|------------|-------|
| B1 | Near-verbatim copyright leak (DST-04) | Leaf reproduces canonical one-liners word-for-word | Terse canon reconstructs verbatim in blind drafts | Clean-room `.oracle/`; own-words only; paraphrase every one-liner from first draft; oracle-reviewer + no-verbatim gate; DHH excluded | P-SRC, P-ANTI, P-DIST |
| B2 | Over-scoping beyond unit RED | Skill drifts into outside-in / acceptance / double-loop / Gherkin coaching | Sources (GOOS, Cooper, North) discuss the outer loop; easy to follow them out of scope | LOCKED: unit RED only; GOOS is counterpoint only; explicit out-of-scope guard in SKILL.md + description near-miss; defer outside-in to a later milestone | P-SCAF, P-COACH |
| B3 | Description collision with lz-tpp / lz-refactor | Wrong skill auto-triggers on "failing test" prompts; multiple fire | Adjacent RGR steps share the noun "test"; lz-tpp already fires on "a failing test is present" | Reciprocal near-miss guards in all three descriptions; sharp boundary (write-the-test vs make-it-pass vs restructure); wire lz-red -> lz-tpp + reverse pointers; cross-skill trigger eval | P-SCAF, P-SEAM, P-EVAL |
| B4 | Vitest API drift / wrong version in examples | Examples use removed/deprecated APIs; type tests misconfigured | Vitest moves fast (4.0 current stable, 5.0 beta); training data mixes versions | Pin examples to Vitest 4.x; use APIs stable across 4.x; verify each snippet against current docs at authoring time (details below) | P-TS, P-DIST |
| B5 | tsc --strict failures in examples | Shipped TS samples do not compile under strict | Hand-written snippets: implicit any, unused vars, missing null checks | Every TS sample compiled tsc --strict-clean before ship (established 0.0.1 / 0.0.2 gate) | P-TS, P-DIST |
| B6 | ASCII-only + work-email hygiene | Unicode (em-dash, curly quotes, checkmarks, arrows) or maintainer work email/domain in shipped content or commit identity | AI prose favors em-dashes/Unicode; copy-paste from docs; commit identity misconfig | ASCII-only shipped content (`--`, `->`); allowlist-inversion scan (assert only `larsbrinknielsen@gmail.com`); verify git author/committer = public gmail before committing; re-run before committing agent-generated prose | P-DIST + every authoring phase (continuous) |

### B4 detail -- concrete Vitest 4.x drift traps to avoid in examples

Verified against current Vitest docs (4.0 is the current stable major; 5.0 in beta as of mid-2026):

- **`toMatchTypeOf` is deprecated** (since expect-type v1.2.0). Use `toExtend` (union/complex types) or
  `toMatchObjectType` (plain objects). This directly affects the milestone's `expectTypeOf` type-level RED examples.
- **Type-level RED requires setup**: type tests live in `*.test-d.ts`, need the `--typecheck` flag, and are
  statically analyzed by tsc (Vitest does not run them). `expectTypeOf` / `assertType` are correct and current.
  `test.each` / `test.for` names are NOT interpolated in type tests -- do not show dynamic names there.
- **`vi.restoreAllMocks()` narrowed in v4**: it now only restores `vi.spyOn()` mocks, not `vi.fn()` or automocks.
  Examples relying on the old broad reset semantics will mislead. (Aligns with the skill's "vi.* with restraint"
  principle -- keep mock examples minimal and current.)
- **Mock constructors in v4**: a mock called with `new` must use a `function`/`class` implementation, not an arrow
  function (arrow -> "is not a constructor").
- **Config renames**: `workspace` removed -> `projects` (since 3.2); `poolOptions` gone -> top-level
  `maxWorkers` / `isolate`. Only relevant if an example shows config.
- Prefer `it.todo` (the test list) and `test.each` (triangulation) as shown in the brief -- both stable in 4.x.

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems for this milestone.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Draft canon verbatim then "clean it up later" | Faster first draft | DST-04 leak survives to ship; reviewer churn; copyright exposure | Never -- draft own-words from the start |
| Ship lz-red description without cross-skill near-miss eval | Faster scaffold | Silent trigger collisions with lz-tpp / lz-refactor; wrong skill fires in real use | Never -- the eval is the only proof the boundary holds |
| Skip the "fail for the right reason" step to keep the procedure short | Leaner SKILL.md | Coach endorses false-RED tests; core value undermined | Never -- it is the RED equivalent of lz-tpp's classify step |
| Default the router to one school (FCIS or mockist) | Simpler router | Wrong advice in brownfield (A9) or over-mocking (A4) | Only if scope were single-paradigm -- it is not; router is locked adaptive |
| Copy example snippets from mixed-version Vitest docs/training data | Fast examples | API drift (B4); examples fail on Vitest 4.x | Only after verifying each against current 4.x docs |
| Match house style wholesale including its anti-patterns | Frictionless "fits your codebase" | Propagates A1-A8; skill amplifies bad tests | Never -- match idiom, not anti-patterns (A10) |

---

## "Looks Done But Isn't" Checklist

- [ ] **RED decision procedure:** Often missing the explicit "fail for the right reason" step -- verify the
      procedure confirms the failure is on the assertion, not a compile/setup error, before lz-tpp handoff.
- [ ] **Description boundary:** Often missing reciprocal near-miss guards -- verify all THREE descriptions
      (lz-red, lz-tpp, lz-refactor) delimit write-the-test vs make-it-pass vs restructure, and that a cross-skill
      trigger eval passes (near-miss prompts do not cross-fire).
- [ ] **Adaptive router:** Often collapses to one school -- verify it routes FCIS / Metz / Feathers by detected
      seams and does not prescribe FCIS where no core exists (A9).
- [ ] **Anti-pattern leaf:** Often missing the source tie -- verify every catalogued anti-pattern names its
      locked source (A1-A10) and that the Ian Cooper over-mock / test-per-class warning is present (PROJECT.md
      target feature).
- [ ] **TS + Vitest examples:** Often missing strict-clean / current-API check -- verify every sample compiles
      tsc --strict and uses Vitest 4.x APIs (no `toMatchTypeOf`; `--typecheck` + `.test-d.ts` for type-level RED).
- [ ] **Hygiene:** Often missing the final scan -- verify ASCII-only shipped content and allowlist-inversion email
      scan (only the public gmail present); confirm git author/committer identity before committing.
- [ ] **Seam wiring:** Often one-directional -- verify lz-red -> lz-tpp handoff AND the reverse lz-tpp -> lz-red
      pointer (closes the carried-forward tech debt) exist.
- [ ] **Scope:** Often creeps -- verify no outside-in / acceptance / double-loop coaching leaked in (unit RED only).

---

## Process Gotchas (GSD / plugin authoring, from repo memory)

Not skill-content pitfalls, but they bite the roadmap; carry them forward.

| Gotcha | Effect | Mitigation |
|--------|--------|------------|
| GSD plan-phase UI gate false-positive | "ui" in "guidance" trips the UI-SPEC gate on Markdown skill phases | Skip-UI on lz-red phases; do not auto-generate UI-SPEC (these are Markdown authoring) |
| Skill description char cap | `description` truncates in the listing at 1536 chars; ~1000-1500 is the load-bearing trigger window | Size the trigger-critical part of lz-red's description under ~1500; keep near-miss exclusions before 1536 |
| Committed != live | Skill/agent edits are not active in-session until reload | After a reviewed+committed skill edit, run `/reload-plugins` before relying on it |
| Skill/agent instruction edits need agent review | Unreviewed SKILL.md changes ship regressions | Every SKILL.md / reference-leaf edit reviewed by subagent(s), incl. >=1 unbiased reviewer, before acceptance |

---

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| DST-04 verbatim leak (B1) reaches a commit | MEDIUM | Rewrite the leaked prose in own words; if pushed on a feature branch, scoped `git filter-repo --replace-text` + force-with-lease; re-run no-verbatim gate |
| Trigger collision (B3) found after ship | MEDIUM | Tighten near-miss guards in the offending descriptions; re-run cross-skill trigger eval; `/reload-plugins` |
| Vitest API drift (B4) in a shipped example | LOW | Patch the snippet to current 4.x API; re-run tsc --strict; bump patch version |
| tsc --strict failure (B5) slips through | LOW | Fix the snippet; add compile-check to the hygiene gate so it cannot recur |
| Work-email / Unicode leak (B6) committed | LOW-MEDIUM | Allowlist scan finds it; amend if unpushed, scoped filter-repo if pushed; confirm identity config |
| Router defaults to one school (A9 shipped) | MEDIUM | Rework the router to seam-based branching; add brownfield/no-seam eval cases |

---

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| A1 never-fails / wrong-reason RED | P-COACH, P-ANTI | Procedure has a fail-for-the-right-reason step; RED-behavior eval includes a false-RED case |
| A2 implementation-detail tests | P-COACH, P-ROUTER, P-ANTI | Coach asserts behavior through a boundary; eval rewards behavior-level assertions |
| A3 multiple assertions / concepts | P-COACH, P-ANTI | Leaf present; coach enforces one behavior per test |
| A4 over-mocking / test-per-class | P-COACH, P-ROUTER, P-ANTI | Ian Cooper warning leaf present; Metz matrix routes mock decisions; eval penalizes needless mocks |
| A5 too-large first test | P-COACH, P-ANTI | Coach starts degenerate / one-step; eval checks smallest-test selection |
| A6 method-shaped names | P-COACH, P-ANTI | Behavior-naming guidance present; eval checks names |
| A7 slow / order-dependent tests | P-COACH, P-ANTI | F.I.R.S.T. leaf present |
| A8 snapshot-everything | P-TS, P-ANTI | Vitest snapshot guidance present; leaf ties to Khorikov/Beck |
| A9 FCIS-brownfield trap | P-ROUTER, P-ANTI | Router branches by seam; brownfield/no-seam eval case passes |
| A10 mirroring bad house style | P-ROUTER, P-ANTI | Router matches idiom not anti-patterns; leaf present |
| B1 DST-04 leak | P-SRC, P-ANTI, P-DIST | oracle-reviewer verdict + no-verbatim gate GREEN; skill-reviewer PASS |
| B2 over-scoping | P-SCAF, P-COACH | Out-of-scope guard in SKILL.md + description; no outside-in content |
| B3 description collision | P-SCAF, P-SEAM, P-EVAL | Cross-skill trigger eval: near-miss prompts do not cross-fire (recall + specificity) |
| B4 Vitest API drift | P-TS, P-DIST | Every example verified against Vitest 4.x docs; no deprecated APIs |
| B5 tsc --strict failure | P-TS, P-DIST | All samples compile tsc --strict-clean |
| B6 ASCII / email hygiene | P-DIST + continuous | ASCII-only scan; allowlist-inversion email scan; identity check |

---

## Sources

- Robert C. Martin -- Three Laws of TDD and F.I.R.S.T. (Fast, Independent, Repeatable, Self-validating, Timely).
  HIGH. (A1, A7; no-oracle high-confidence core.)
- Kent Beck, *Test Driven Development: By Example* -- one-step test, starter/degenerate case, triangulation,
  assert-first, evident data, one concept per test, see-it-fail-first. HIGH. (A1, A3, A5.)
- Ian Cooper, "TDD, Where Did It All Go Wrong" (NDC Oslo 2013 / DevTernity 2017; video id EZ05e7EMOLM) --
  trigger for a new test is a new BEHAVIOR not a function; do not test each class in isolation; do not mock
  internals/privates/adapters; test via ports. Verified via web summary 2026-07-18. HIGH. (A2, A4, A6.)
  Sources: https://herbertograca.com/2018/08/27/distillation-of-tdd-where-did-it-all-go-wrong/ ,
  https://robdmoore.id.au/blog/2015/01/26/review-of-ian-cooper-tdd-where-did-it-all-go-wrong
- Vladimir Khorikov, *Unit Testing: Principles, Practices, and Patterns* -- four pillars (protection against
  regressions, resistance to refactoring, fast feedback, maintainability); mock only unmanaged out-of-process
  dependencies. HIGH. (A2, A4, A8.)
- Sandi Metz + Katrina Owen, *99 Bottles of OOP* / "Magic Tricks of Testing" -- query/command message matrix;
  test the interface not internals; do not test private methods or outgoing queries. HIGH. (A2, A4, A9, A10.)
  (Owned: 99 Bottles JS Ed -- clean-room `.oracle/`.)
- Gary Bernhardt, "Boundaries" -- functional core, imperative shell (a design target, not a given). HIGH. (A9.)
- Michael Feathers, *Working Effectively with Legacy Code* -- seams; characterization tests when no seam exists.
  HIGH. (A9, A10.)
- Dan North -- BDD, Given-When-Then, behavior-focused naming. HIGH. (A6.)
- Roy Osherove, *The Art of Unit Testing* -- trustworthy/readable tests, scenario-based naming, one logical
  concept. HIGH. (A1, A3, A6, A8.)
- Steve Freeman + Nat Pryce, *Growing Object-Oriented Software, Guided by Tests* (GOOS) -- London/mockist school;
  used here as a documented COUNTERPOINT to A4, and its double-loop is OUT OF SCOPE. HIGH. (A4, A10; B2.)
- fast-check -- property-based testing (advanced; triangulation alternative). MEDIUM (breadth not depth this pass).
- Vitest official docs (testing types, expect-typeof, assert-type, vi, migration guide) -- current API for the
  B4 drift pitfall; Vitest 4.0 current stable, 5.0 beta; `toMatchTypeOf` deprecated -> `toExtend`;
  `vi.restoreAllMocks()` narrowed to spyOn; type tests need `--typecheck` + `.test-d.ts`. Verified 2026-07-18. HIGH.
  https://vitest.dev/guide/testing-types , https://vitest.dev/api/expect-typeof , https://vitest.dev/api/assert-type ,
  https://vitest.dev/guide/migration.html
- Repo conventions -- `.planning/PROJECT.md` (lz-tdd@0.0.3 milestone, Key Decisions, Constraints);
  `plugins/lz-tdd/skills/lz-tpp/SKILL.md` and `.../lz-refactor/SKILL.md` (sibling descriptions for the B3
  collision analysis); `AGENTS.md` (public-repo hygiene). Read 2026-07-18. HIGH.
- Repo memory -- DST-04 near-verbatim trap, skill description char cap, GSD UI-gate false-positive, reload-plugins
  after skill edits, unbiased-reviewer requirement. HIGH (project-specific, proven in 0.0.1 / 0.0.2).

---
*Pitfalls research for: lz-red RED-phase TDD coaching skill (lz-tdd@0.0.3)*
*Researched: 2026-07-18*
