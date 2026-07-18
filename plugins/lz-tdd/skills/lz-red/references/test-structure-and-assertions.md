# Test Structure and Assertions

Scope: how to STRUCTURE a unit test and how to ASSERT well once the next test is chosen --
the arrange-act-assert and given-when-then vocabularies (both, without imposing one), assert-first,
evident test data, one concept per test, the F.I.R.S.T. properties, and the four pillars that make
an assertion pin observable behavior rather than implementation detail. This is the coach's
"now write it well" surface downstream of test selection.

> Populated in Phase 16 (structure: STR-01, STR-02) + Phase 17 (assertions: ASRT-01, ASRT-02)
> -- co-edited across both phases. Satisfies STR-01, STR-02, ASRT-01, ASRT-02. Source cluster:
> Bill Wake, Dan North, Kent Beck (unowned -> no-oracle), Vladimir Khorikov.
> No verbatim source prose or code (DST-04).

## Per-entry content contract

Each structure or assertion rule, when populated, carries:

- Rule -- the structuring or asserting guideline named in original words.
- When-to-use -- the situation in the red step that calls for it.
- Distilled rationale -- why it makes the test readable and behavior-pinning, in original words.

Sub-topics in scope for this doc:

- Arrange-act-assert (Wake) and given-when-then (North) -- both vocabularies for the same
  three-part shape, presented design-agnostically (do not impose a single school).
- Assert-first -- writing the assertion before the arrange/act.
- Evident test data -- data that makes the expected relationship obvious.
- One concept per test -- one reason for a test to fail.
- F.I.R.S.T. -- fast, isolated, repeatable, self-validating, timely.
- Khorikov four pillars -- protection against regressions, resistance to refactoring, fast
  feedback, maintainability -- as the lens for asserting observable behavior over implementation.

## Sources (placeholder)

- Bill Wake -- arrange-act-assert; Dan North -- given-when-then (Phases 16 + 17).
- Kent Beck -- assert-first and evident data (unowned; high-confidence core only, no-oracle).
- Vladimir Khorikov -- the four pillars of a good unit test (Phase 17).
