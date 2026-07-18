# Seams and legacy code

Scope: the testing stance for legacy code that has no seams and no tests (Feathers) -- find a
seam where behavior can be altered without editing in place, pin current behavior with a
characterization test first, then drive new behavior test-first from there. Reached from the
testing-stance index when the detection signal is untested legacy code with no obvious place to
assert. This is the RED-step framing (write the pinning test); the refactor-step no-tests
techniques already live in the lz-refactor skill.

> Populated in Phase 17. Satisfies RTR-01, ASRT-02. Source cluster: Michael Feathers (Working
> Effectively with Legacy Code; unowned -> high-confidence core only, no-oracle).
> No verbatim source prose or code (DST-04).

## Per-entry content contract

Each technique, when populated, carries:

- Technique -- the seam or characterization move named in original words.
- When-to-use -- the legacy situation that calls for it before a red test can be written.
- Assert rule -- what the characterization test pins (current behavior, not desired behavior).

Sub-topics in scope for this doc:

- Seams -- places where behavior can be altered without editing in place, as the assertion point.
- Characterization tests -- pinning current behavior before changing it.
- Sequencing -- seam and characterization first, then the new red test.
- Cross-link (add at fill time, NOT in this stub) -- when populated this leaf will point at
  lz-refactor's refactoring-without-tests.md (Feathers) rather than copy it; the outbound link
  is Phase-17 content, so no link is added here yet.

## Sources (placeholder)

- Michael Feathers -- seams and characterization tests (unowned; high-confidence core only,
  no-oracle tag; Phase 17). Cross-linked to, not copied from, lz-refactor's Feathers reference.
