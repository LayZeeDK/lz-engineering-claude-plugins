# Testing-stance router (adaptive stance selection) -- navigation index

Scope: detection signals plus a route table that maps a codebase's house testing stance to the
matching leaf (functional-core / message-matrix / seams-and-legacy). This index is NAVIGATION
ONLY: it carries no stance content of its own -- only recognize-by signals and links to the leaf
that acts. Open the leaf to get the assert/mock guidance; never infer stance guidance from this
index. This mirrors the lz-refactor smells.md index convention.

> Populated in Phase 17 (the index: detection signals + route table) + Phase 18 (wired into the
> SKILL.md coach routing step). Satisfies RTR-02. Source cluster: router-only (the leaves carry
> the sourced stance content).
> No verbatim source prose or code (DST-04).

## Per-entry content contract

Each stance, when populated, is one route-table row carrying:

- Detection signal -- the recognize-by cue in the codebase that points at this stance
  (value-based tests with no doubles; a query/command message split; missing seams on legacy
  code), in original words.
- Route -- a link to the leaf that carries that stance's assert-and-mock guidance.

Stances routed by this index (navigation targets; content lives in the leaves):

- Functional core, imperative shell -> functional-core.md.
- Message-based (query vs command) -> message-matrix.md.
- Seams and legacy (no-seam / characterization) -> seams-and-legacy.md.

## Sources (placeholder)

- Gary Bernhardt (functional core / imperative shell), Sandi Metz + Katrina Owen (query/command
  message matrix), Michael Feathers (seams). Distilled in original words in the leaves; Phase 17.
