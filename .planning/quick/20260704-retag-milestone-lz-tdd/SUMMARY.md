---
type: quick-summary
slug: retag-milestone-lz-tdd
completed: 2026-07-04
status: complete
---

# Summary: Rename v0.0.1 -> lz-tdd@0.0.1

## What was done

- **Git tag**: deleted `v0.0.1` (local + remote), created annotated `lz-tdd@0.0.1` at the
  milestone commit `4fbd9fa`, pushed to origin.
- **GitHub Release**: deleted the `v0.0.1` release; recreated **lz-tdd@0.0.1 - First Release**
  (published, not draft):
  https://github.com/LayZeeDK/lz-engineering-claude-plugins/releases/tag/lz-tdd%400.0.1
- **GSD milestone**: renamed archive files to
  `lz-tdd@0.0.1-{ROADMAP,REQUIREMENTS,MILESTONE-AUDIT}.md` (via `git mv`) and updated the
  milestone id across STATE.md, ROADMAP.md, MILESTONES.md, RETROSPECTIVE.md, PROJECT.md,
  and the audit. Product semver `0.0.1` (plugin.json) and the `v1.0 -> v0.0.1` id-history
  are preserved; the further relabel is appended, not erased.
- **CHANGELOG**: `## [0.0.1]` -> `## [lz-tdd@0.0.1]`; tag link repointed to the new release.

## Verification

- `git tag --list` -> `lz-tdd@0.0.1` only; `git ls-remote --tags origin` shows no `v0.0.1`.
- `gh release view "lz-tdd@0.0.1"` -> published, tag `lz-tdd@0.0.1`.
- `git grep v0.0.1` -> only intentional id-history notes remain.

## Rationale

The marketplace hosts multiple plugins, so a repo-level `v0.0.1` tag is ambiguous.
Plugin-scoped `<plugin>@<semver>` (`lz-tdd@0.0.1`) is the standard monorepo convention.
