# Phase 10 - Deferred / Out-of-Scope Items

Discoveries made during Phase 10 execution that fall OUTSIDE the plan being
executed. Logged here per the executor scope-boundary rule (do not fix
out-of-scope issues inside an unrelated plan's commits).

---

## [BLOCKER-severity, pre-existing] Plain-form work-email domain in 6 prior-phase `.planning/` docs

**Found during:** 10-01 final verification pass (full-tree `git grep` post-commit
guard, D-11 / RESEARCH Pitfall 3).

**Finding:** The full-tree work-email absence guard is RED. Six committed
prior-phase planning artifacts contain the work-email domain in its PLAIN
(unescaped) form -- a genuine public-repo PII leak, distinct from the sanctioned
escaped `@consensus\.dk` needle that D-11 permits in docs that quote the guard:

- `.planning/phases/02-tpp-source-distillation/02-SECURITY.md`
- `.planning/phases/03-lz-tpp-skill-authoring/03-REVIEW.md`
- `.planning/phases/03-lz-tpp-skill-authoring/03-SECURITY.md`
- `.planning/phases/05-skill-effectiveness-evals/05-SECURITY.md`
- `.planning/phases/08-kerievsky-catalog-refactoring-to-patterns/08-SECURITY.md`
- `.planning/phases/08.2-functional-catalog-inserted/08.2-SECURITY.md`

Detection: `git grep -lE 'consensus\.dk'` (ERE; the escaped `\.` is a literal
dot, so the pattern string itself carries no plain-form domain and does not
self-trip). It matches the unescaped domain but NOT the escaped `@consensus\.dk`
needle, so the six files above carry the domain in plain form. These are almost
certainly the Pitfall-3 self-reference trap: security-auditor / review outputs
that spelled the plain domain while asserting its absence.

**Why this is OUT OF SCOPE for 10-01:** Plan 10-01 hardens/widens the
`check-hygiene.mjs` instrument, whose (a)/(b) axes scan the SHIPPABLE surface
(both skill trees + root README/CHANGELOG/LICENSE + both manifests) -- NOT
`.planning/`. That surface is clean (187 files ASCII/email PASS). None of the six
leaking files were touched by any 10-01 commit (`546a11a`, `57d35c9`, `0cee0d4`,
`d89a5b2`). Fixing them would be an unrelated cross-phase edit and is not a 10-01
success-criterion gap.

**Severity / precedent:** HIGH. This is the recurring incident class documented in
memory `lz-plugins-phase1-workemail-git-history-exposure` (Phase 1 required
`git filter-repo` + a force-push of `origin/main`) and `public-repo-work-email-allowlist`.
The leak is in the working tree AND in git history.

**Recommended remediation (dedicated task, human-gated):**
1. Scrub the plain domain from all six files (replace with the escaped
   `@consensus\.dk` needle or redact entirely), commit.
2. Assess whether a git-history rewrite (`git filter-repo`) + force-push is
   warranted, as in the Phase-1 precedent, since the domain is in prior commits.
3. Consider extending the phase's hygiene discipline: the widened
   `check-hygiene.mjs` covers the shippable surface; a full-tree `git grep -F`
   plain-form guard over `.planning/` catches this class (D-11 / Pitfall 3
   already prescribe running it post-commit -- it was simply not enforced for the
   `.planning/` tree in phases 02/03/05/08/08.2).

This does NOT block plan 10-01, whose deliverable (the instrument) is complete
and GREEN. It SHOULD be triaged before the public 0.0.2 ship (DST-02 requires the
work email absent) if `.planning/` is published with the repo (RESEARCH A5).
