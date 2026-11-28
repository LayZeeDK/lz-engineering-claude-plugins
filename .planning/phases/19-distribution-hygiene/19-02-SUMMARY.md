---
phase: 19-distribution-hygiene
plan: 02
subsystem: public-repo-hygiene
tags: [hygiene, pii, allowlist-inversion, ga7, forward-fix, information-disclosure]
requires:
  - "D-12 (operator-decided forward-fix; no shared-history rewrite of main)"
provides:
  - "anti-pattern-free tracked planning tree: no committed file encodes the maintainer work-domain as a search needle (GA-7 closed)"
  - "worked example of the non-encoding allowlist-inversion rewrite, applied consistently across two archived milestones"
affects:
  - "0.0.3 public push / PR readiness (the encode-the-forbidden-value anti-pattern no longer ships in the base tree)"
  - "supersedes the 2026-07-09 accepted-risk deferral for the 0.0.1 main-side docs (see Deviations)"
tech-stack:
  added: []
  patterns:
    - "allowlist-inversion: enumerate email-shaped tokens, subtract the approved public gmail, assert the remainder is empty -- never encode the forbidden value"
key-files:
  created:
    - .planning/phases/19-distribution-hygiene/19-02-SUMMARY.md
  modified:
    - .planning/milestones/lz-tdd@0.0.2-phases/06-lz-refactor-skill-scaffold-progressive-disclosure/06-SECURITY.md
    - .planning/milestones/lz-tdd@0.0.1-phases/02-tpp-source-distillation/02-SECURITY.md
    - .planning/milestones/lz-tdd@0.0.1-phases/03-lz-tpp-skill-authoring/03-SECURITY.md
    - .planning/milestones/lz-tdd@0.0.1-phases/03-lz-tpp-skill-authoring/03-REVIEW.md
    - .planning/milestones/lz-tdd@0.0.1-phases/04-distribution-hygiene/04-01-PLAN.md
    - .planning/milestones/lz-tdd@0.0.1-phases/04-distribution-hygiene/04-01-SUMMARY.md
    - .planning/milestones/lz-tdd@0.0.1-phases/04-distribution-hygiene/04-LEARNINGS.md
    - .planning/milestones/lz-tdd@0.0.1-phases/04-distribution-hygiene/04-RESEARCH.md
    - .planning/milestones/lz-tdd@0.0.1-phases/04-distribution-hygiene/04-SECURITY.md
    - .planning/milestones/lz-tdd@0.0.1-phases/04-distribution-hygiene/04-VALIDATION.md
    - .planning/milestones/lz-tdd@0.0.1-phases/04-distribution-hygiene/04-VERIFICATION.md
    - .planning/milestones/lz-tdd@0.0.1-phases/05-skill-effectiveness-evals/05-SECURITY.md
    - .planning/milestones/lz-tdd@0.0.2-phases/10-distribution-hygiene/10-01-PLAN.md
    - .planning/milestones/lz-tdd@0.0.2-phases/10-distribution-hygiene/10-03-PLAN.md
    - .planning/milestones/lz-tdd@0.0.2-phases/10-distribution-hygiene/10-03-SUMMARY.md
    - .planning/milestones/lz-tdd@0.0.2-phases/10-distribution-hygiene/10-04-PLAN.md
    - .planning/milestones/lz-tdd@0.0.2-phases/10-distribution-hygiene/10-PATTERNS.md
    - .planning/milestones/lz-tdd@0.0.2-phases/10-distribution-hygiene/10-RESEARCH.md
    - .planning/milestones/lz-tdd@0.0.2-phases/10-distribution-hygiene/deferred-items.md
decisions:
  - "D-12: forward-fix the tip only -- rewrite each encode-the-forbidden-value instance to a non-encoding allowlist-inversion form; no shared-history rewrite of main; docs-only commit before the 0.0.3 push/PR"
  - "Sweep scope read comprehensively (must_haves truth 3 + D-12 'sweep all ... fix each'): all 19 tracked planning docs carrying the anti-pattern were rewritten, not only the frontmatter-listed 06-SECURITY.md; the frontmatter listed one file because siblings could not be enumerated at plan time without spelling the needle -- enumeration was delegated to this ephemeral sweep"
metrics:
  tasks_completed: 1
  files_modified: 19
  files_created: 1
  duration: single execution session
  completed: 2026-07-21
status: complete
---

# Phase 19 Plan 02: GA-7 Work-Domain Forward-Fix Summary

Removed the encode-the-forbidden-value public-repo hygiene anti-pattern (GA-7) from 19 archived
planning docs across two shipped milestones by rewriting every work-domain-as-search-needle into a
non-encoding allowlist-inversion statement (assert the only email-shaped token present is the approved
public gmail; flag everything else). Forward-fix on the current tip only -- no git-history rewrite -- and
the fix never spells the forbidden value in any file, commit message, or this summary.

## What This Plan Did

The archived `06-SECURITY.md` T-06-01 mitigation cell proved work-email absence by embedding the
maintainer work-domain as an escaped `rg` search needle inside a shell command -- which is itself the
leak (AGENTS.md: "the needle is itself a leak"). This plan (D-12) rewrote that evidence to a
non-encoding allowlist-inversion statement and swept every other tracked planning doc carrying the same
anti-pattern, rewriting each to the same form.

The rewrite mirrors the `check-hygiene.mjs` allowlist-inversion logic in prose: enumerate every
email-shaped token over the tree, subtract the approved public gmail (`larsbrinknielsen@gmail.com`), and
assert the remainder is empty. No file names, spells, splits, or escapes the forbidden work-email or its
bare domain.

## Scope of the Sweep

An ephemeral, never-committed command-line grep (the needle held only in-session) surfaced the
anti-pattern in 19 tracked planning docs. All were rewritten to the non-encoding allowlist-inversion
form:

**Primary target (0.0.2 Phase 06):**
- `06-SECURITY.md` -- T-06-01 mitigation cell rewritten (the GA-7 target).

**0.0.1 milestone siblings (Phases 02/03/04/05):**
- `02-SECURITY.md` (T-02-01-01, T-02-02-03 cells), `03-SECURITY.md` (T-03-01-01), `03-REVIEW.md`
  (hygiene bullet), `05-SECURITY.md` (T-05-03 + remediation narrative).
- Phase 04 distribution-hygiene set (the docs that originated the now-retired escaped-needle
  technique): `04-01-PLAN.md`, `04-01-SUMMARY.md`, `04-LEARNINGS.md`, `04-RESEARCH.md`,
  `04-SECURITY.md`, `04-VALIDATION.md`, `04-VERIFICATION.md`.

**0.0.2 milestone siblings (Phase 10, the plan's named "known likely instances"):**
- `10-01-PLAN.md`, `10-03-PLAN.md`, `10-03-SUMMARY.md`, `10-04-PLAN.md`, `10-PATTERNS.md`,
  `10-RESEARCH.md`, `deferred-items.md`.

Occurrences took three shapes, all rewritten: (a) proof-of-absence needles in SECURITY/VALIDATION/
VERIFICATION evidence; (b) guard commands in plan `<automated>` verify blocks and research code fences;
(c) prose that prescribed the escaped-needle technique itself. Guard commands and verify blocks were
re-expressed as the allowlist-inversion pipeline (email-token enumeration minus the approved gmail),
with milestone-filename tokens (`lz-tdd@<version>.md`) excluded so they do not false-positive.

## Left Unchanged (by design)

- The sibling `06-SECURITY.md` T-06-03 ASCII cell (`[^\x00-\x7F]` byte-class needle): a generic
  character class, not the forbidden value -- already the correct non-encoding form. Untouched. The
  contrast between T-06-01 (encodes the value) and T-06-03 (encodes a generic class) is the exact tell
  the sweep used.
- No `plugins/lz-tdd` SKILL.md or any shipped-tree file was touched (docs-only diff under `.planning/`;
  no skill-review or `/reload-plugins` needed, D-10).
- No shared-history rewrite of `main`; no `git filter-repo`; no force-push (D-12). This is a new,
  normal commit on the current branch only.

## Verification

- Ephemeral confirm-grep (command-line only, never committed): zero remaining forbidden-domain tokens
  across the tracked tree in any form (bare, escaped, `@`-prefixed, or local-part).
- Allowlist-inversion over email-shaped tokens across the full tree: only the approved public gmail
  present; remainder empty (after excluding the known `lz-tdd@<version>.md` milestone-filename tokens,
  which are filenames, not emails).
- `06-SECURITY.md` is ASCII-only and contains the approved public gmail (plan automated check: PASS).
- Every edited file is ASCII-only (the 9 non-ASCII files elsewhere under `.planning/milestones/` are
  pre-existing GSD-emitted content and were not touched by this plan).
- Diff is docs-only under `.planning/milestones/` (19 files); `git status` confirms no shipped-tree
  file and no `SKILL.md` modified; `main` history intact.

## Deviations from Plan

**1. [Scope] Sweep rewrote 19 files; the plan frontmatter `files_modified` listed only `06-SECURITY.md`.**
- **Why:** The plan `<action>` and must_haves truth 3 direct a sweep of "every other tracked planning
  doc that carries the SAME anti-pattern" and D-12 says "sweep all tracked planning docs; fix each." The
  frontmatter could list only the one file because enumerating siblings at plan time would have required
  spelling the needle; enumeration was explicitly delegated to this executor's ephemeral sweep. Reading
  the comprehensive acceptance criteria as controlling, all 19 instances were fixed.
- **Impact:** Docs-only; reversible via `git revert` of this single commit.

**2. [Notable] This supersedes the 2026-07-09 accepted-risk deferral for the 0.0.1 main-side docs.**
- The 0.0.1 Phase 02/03/05 instances (and `03-REVIEW.md`) were previously logged as maintainer-ACCEPTED
  deferred risk in `10-distribution-hygiene/deferred-items.md` (bare company domain quoted as an audit
  needle; risk accepted 2026-07-09). D-12 (2026-07-20) is the operator's decision to stop deferring and
  forward-fix -- the whole point of GA-7 -- so those instances were rewritten here rather than left
  deferred. The `deferred-items.md` narrative itself was also de-needled. Flagged for operator awareness:
  the acceptance record is now overtaken by this remediation.

No architectural changes (Rule 4) were required; no auth gates; no package installs.

## Requirements

- **DST-03** (hygiene: maintainer work-email absent; allowlist-inversion scan passes): advanced. The
  encode-the-forbidden-value anti-pattern -- the one remaining DST-03 hygiene gap flagged by GA-7 -- is
  removed from the tracked tree; full-tree allowlist-inversion is clean.

## Self-Check: PASSED

- Created file exists: `.planning/phases/19-distribution-hygiene/19-02-SUMMARY.md` (this file).
- All 19 modified files confirmed via `git status --short` under `.planning/milestones/`.
- Zero forbidden-domain tokens remain (ephemeral confirm-grep, all forms CLEAN).
- Allowlist-inversion clean; `06-SECURITY.md` ASCII + approved gmail present.
- The forbidden value is not written in this summary, in any edited file, or in the commit message.
