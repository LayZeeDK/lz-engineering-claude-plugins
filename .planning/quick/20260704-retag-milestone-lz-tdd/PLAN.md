---
type: quick-plan
slug: retag-milestone-lz-tdd
created: 2026-07-04
status: complete
---

# Quick Task: Rename v0.0.1 -> lz-tdd@0.0.1 (tag, milestone, release, changelog)

## Description

Re-identify the first release from repo-level `v0.0.1` to plugin-scoped `lz-tdd@0.0.1`
across the git tag, the GitHub Release, the GSD milestone (all `.planning/` artifacts and
archive filenames), and the CHANGELOG entry. Rationale: the marketplace hosts multiple
plugins, so versions are scoped per plugin (`<plugin>@<semver>`).

## Steps

1. Git tag: delete `v0.0.1` (local + remote), create annotated `lz-tdd@0.0.1` at the
   milestone commit `4fbd9fa`, push.
2. GitHub Release: delete the `v0.0.1` release, recreate as `lz-tdd@0.0.1 - First Release`.
3. GSD milestone: rename archive files `v0.0.1-*` -> `lz-tdd@0.0.1-*` and update the
   milestone id across STATE / ROADMAP / MILESTONES / RETROSPECTIVE / PROJECT / audit
   (product semver `0.0.1` and the `v1.0 -> v0.0.1` history are preserved).
4. CHANGELOG: change the `[0.0.1]` entry to `[lz-tdd@0.0.1]` and repoint the tag link.

## Acceptance

- Git tag `lz-tdd@0.0.1` exists locally and on origin; `v0.0.1` is gone.
- Published GitHub Release `lz-tdd@0.0.1` exists; the `v0.0.1` release is gone.
- No `v0.0.1` identifier remains in `.planning/` or CHANGELOG except intentional
  id-history notes.
