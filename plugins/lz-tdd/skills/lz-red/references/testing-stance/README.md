# Testing-stance router (adaptive stance selection) -- navigation index

Scope: detection signals plus a route table that maps a codebase's house testing stance to the
matching leaf (functional-core / message-matrix / seams-and-legacy). This index is NAVIGATION
ONLY: it carries no stance content of its own -- only recognize-by signals and links to the leaf
that acts. Open the routed leaf to get the assert/mock guidance; never infer stance guidance from
this index. This mirrors the lz-refactor smells.md index convention.

> The routed leaves carry the sourced assert-and-mock guidance, distilled in original words (no
> verbatim source prose or code; DST-04). This index adds none of its own.

## Route table

Scan the detection signals for the one that matches the code under test, then follow its link to the
leaf that carries the assert-and-mock guidance for that stance.

| Detection signal (recognize-by) | Route to |
|---------------------------------|----------|
| Value-in / value-out code; pure functions; no mocking needed | [functional-core.md](functional-core.md) |
| Object with collaborators; a query / command message split | [message-matrix.md](message-matrix.md) |
| Untested legacy; hidden I/O / statics / constructor work; no obvious place to assert | [seams-and-legacy.md](seams-and-legacy.md) |

No default stance: match the detection signal to the code under test. A functional core is a design
you achieve, not a property every codebase has, so no-seam legacy routes to seams-and-legacy.md
rather than to functional-core.md.

## Sources

- Router-only index: the sourced stance content lives in the leaves. Gary Bernhardt (functional
  core / imperative shell), Sandi Metz and Katrina Owen (query / command message matrix), and
  Michael Feathers (seams and legacy) are named and tiered in each leaf's own Sources section.
