# Principle Backing

Scope: the cross-cutting map from each RED recommendation back to the source that backs it, plus
the owned / unowned access-tier note for each source. This is the "why we say this" layer: it lets
the coach justify a recommendation from a named principle, and it records which sources are
oracle-verifiable (owned books) versus high-confidence-core-only (unowned, no-oracle). It carries
no selection, structure, naming, or stance guidance of its own -- it points back at the docs that do.

> Cross-cutting backing map, co-edited as the other reference docs are authored -- each
> recommendation is backed as it lands. It supports DST-03 (source-to-recommendation traceability).
> Source and technique NAMES and the acronym facts are plain facts; no verbatim source prose or code
> (DST-04). Phases 16-17 back the selection, structure, naming, assertion, stance, anti-pattern, and
> mechanics recommendations; the Three-Laws spine (LAW-01, LAW-02) and the lz-tpp seam rows (SEAM-01,
> SEAM-02) are backed in the section below.

## Per-entry content contract

Each backing row carries:

- Recommendation -- the RED guidance being backed, linked to the reference doc that states it.
- Source -- the author or work that backs it, named in original words.
- Access tier -- owned book (oracle-verifiable against the clean-room source) or unowned
  (high-confidence core only, no-oracle).

## Source-to-recommendation map

| Recommendation | Source | Access tier |
| --- | --- | --- |
| [Running test list](three-laws-and-test-selection.md) | Kent Beck, Canon TDD | Owned; oracle-verified against the clean-room source. |
| [Take one small step](three-laws-and-test-selection.md) | Kent Beck, Canon TDD | Owned; oracle-verified against the clean-room source. |
| [Grow the test only enough to fail](three-laws-and-test-selection.md) | Robert C. Martin, Clean Code Ch. 9 | Owned; oracle-verified against the clean-room source. |
| [Start from the degenerate case](three-laws-and-test-selection.md) | Kent Beck, Test-Driven Development by Example | Unowned; high-confidence core only (no-oracle). |
| [Triangulate to the next test](three-laws-and-test-selection.md) | Kent Beck, Test-Driven Development by Example | Unowned; high-confidence core only (no-oracle). |
| [Arrange-act-assert](test-structure-and-assertions.md) | Bill Wake | Unowned; high-confidence core only (no-oracle). |
| [Given-when-then](test-structure-and-assertions.md) | Dan North | Unowned; high-confidence core only (no-oracle). |
| [Assert-first](test-structure-and-assertions.md) | Kent Beck, Canon TDD | Owned; oracle-verified against the clean-room source. |
| [Evident test data](test-structure-and-assertions.md) | Kent Beck, Test-Driven Development by Example | Unowned; high-confidence core only (no-oracle). |
| [One concept per test](test-structure-and-assertions.md) | Robert C. Martin, Clean Code Ch. 9 | Owned; oracle-verified against the clean-room source. |
| [Behavior-oriented naming](naming.md) | Dan North | Unowned; high-confidence core only (no-oracle). |
| [Osherove three-part naming](naming.md) | Roy Osherove | Unowned; high-confidence core only (no-oracle). |
| [Name the behavior, not the method](naming.md) | Sandi Metz and Katrina Owen, 99 Bottles of OOP, JavaScript Edition | Owned; oracle-verified against the clean-room source. |
| [The four pillars](test-structure-and-assertions.md) | Vladimir Khorikov, Unit Testing: Principles, Practices, and Patterns | Unowned; high-confidence core only (no-oracle). |
| [F.I.R.S.T. properties](test-structure-and-assertions.md) | Robert C. Martin, Clean Code Ch. 9 | Owned; oracle-verified against the clean-room source. |
| [Output/state/communication selection](test-structure-and-assertions.md) | Vladimir Khorikov, Unit Testing: Principles, Practices, and Patterns | Unowned; high-confidence core only (no-oracle). |
| [Functional core, output-based assert](testing-stance/functional-core.md) | Gary Bernhardt, Boundaries (talk) | Owned; oracle-verified against the clean-room source. |
| [Query/command message matrix](testing-stance/message-matrix.md) | Sandi Metz, The Magic Tricks of Testing (talk) | Owned; oracle-verified against the clean-room source. |
| [Seams and characterization](testing-stance/seams-and-legacy.md) | Michael Feathers, Working Effectively with Legacy Code | Unowned; high-confidence core only (no-oracle). |
| [Avoid over-mocking and test-per-class](anti-patterns.md) | Ian Cooper | Owned; oracle-verified against the clean-room source. |
| [Keep test doubles honest (double drift)](anti-patterns.md) | Sandi Metz, The Design of Tests (talk) | Owned; oracle-verified against the clean-room source. |
| [Listen to the tests (test pain is design feedback)](anti-patterns.md) | Sandi Metz, The Design of Tests (talk) | Owned; oracle-verified against the clean-room source. |
| [Implementation-detail brittleness](anti-patterns.md) | Vladimir Khorikov, Unit Testing: Principles, Practices, and Patterns | Unowned; high-confidence core only (no-oracle). |
| [Mockist counterpoint, stated fairly](anti-patterns.md) | Steve Freeman and Nat Pryce, Growing Object-Oriented Software, Guided by Tests | Unowned; high-confidence core only (no-oracle). |
| [Test Desiderata tradeoff lens](anti-patterns.md) | Kent Beck, Test Desiderata (essay + video series); Sandi Metz, The Design of Tests, corroborates the over-testing cost | Owned; oracle-verified against the clean-room source. |
| [Vitest mechanics mapped to RED concepts](vitest-typescript-mechanics.md) | Vitest 4.x documentation | Unowned; high-confidence core only (no-oracle). |

## Three-Laws spine and lz-tpp seam backing

The Three Laws of TDD spine (LAW-01, LAW-02) and the classify-first / lz-tpp seam (SEAM-01, SEAM-02)
are backed here. Laws 1 and 2 are Robert C. Martin's, owned and oracle-verified against the clean-room
source; the classify-first framing and both directions of the lz-tpp handoff are lz-red orchestration,
high-confidence core only.

| Recommendation | Source | Access tier |
| --- | --- | --- |
| [Three Laws of TDD spine](three-laws-and-test-selection.md) | Robert C. Martin, Clean Code Ch. 9 | Owned; oracle-verified against the clean-room source. |
| [Fail for the right reason](vitest-typescript-mechanics.md) | Robert C. Martin, Clean Code Ch. 9 | Owned; oracle-verified against the clean-room source. |
| [Classify-first and the forward lz-tpp handoff](three-laws-and-test-selection.md) | lz-red orchestration | Unowned; high-confidence core only (no-oracle). |
| [Reverse lz-tpp -> lz-red pointer](../../lz-tpp/SKILL.md) | lz-red orchestration | Unowned; high-confidence core only (no-oracle). |

## Sources

- The RED-coach sources mapped above, each tagged with its access tier. Owned sources are
  oracle-verifiable against the clean-room set: Robert C. Martin (Clean Code Ch. 9); Sandi Metz (The
  Magic Tricks of Testing and The Design of Tests talks -- the message matrix and test-as-design-
  feedback; and, with Katrina Owen, 99 Bottles of OOP, JavaScript Edition, for test naming); Gary
  Bernhardt (Boundaries -- functional core / imperative shell); Kent Beck (Canon TDD -- running test
  list, one small step, and assert-first; Test Desiderata essay and video series); and Ian Cooper.
  Beck's remaining selection / structure rows (the starter / degenerate case, triangulation, and
  evident test data) remain no-oracle: they rest on Test-Driven Development by Example, a book held
  summary-only in the clean-room set, so they cannot be oracle-gated against full text. Unowned
  no-oracle sources are used at high-confidence core only: Bill Wake, Dan North, Roy Osherove,
  Vladimir Khorikov, Michael Feathers, Steve Freeman and Nat Pryce (GOOS), and the Vitest 4.x
  documentation.
