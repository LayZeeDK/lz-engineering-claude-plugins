# Test Naming

Scope: how to NAME a unit test so the name states the behavior the test pins -- behavior-oriented
("should ...") naming as the primary convention, with Osherove's three-part
(unit-of-work / scenario / expected-behavior) naming as a design-agnostic alternative. A test name
is documentation of the behavior, not of the method under test.

> Populated in Phase 16. Satisfies NAME-01. Source cluster: Dan North, Roy Osherove, Sandi Metz.
> No verbatim source prose or code (DST-04).

## Per-entry content contract

Each naming convention, when populated, carries:

- Convention -- the naming scheme named in original words.
- When-to-use -- the codebase style or situation it suits.
- Distilled rationale -- why the name documents behavior rather than implementation, in original words.

Sub-topics in scope for this doc:

- Behavior / "should" naming as the primary convention -- the name reads as a sentence about
  observable behavior (North).
- Osherove three-part naming -- unit-of-work, scenario, expected-behavior -- as the alternative
  when the codebase already uses it.
- Naming for the behavior pinned, not the function called -- avoiding names that leak
  implementation detail (Metz).
- Matching the codebase's existing naming stance rather than imposing one.

## Sources (placeholder)

- Dan North -- behavior / "should" naming (Phase 16).
- Roy Osherove -- three-part test naming (Phase 16).
- Sandi Metz -- naming for behavior over implementation (owned; Phase 16).
