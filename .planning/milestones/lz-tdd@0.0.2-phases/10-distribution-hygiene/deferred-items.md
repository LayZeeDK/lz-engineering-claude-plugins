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
escaped work-domain needle that D-11 formerly permitted in docs quoting the guard:

- `.planning/phases/02-tpp-source-distillation/02-SECURITY.md` -- in `main`, ACCEPTED
- `.planning/phases/03-lz-tpp-skill-authoring/03-REVIEW.md` -- in `main`, ACCEPTED
- `.planning/phases/03-lz-tpp-skill-authoring/03-SECURITY.md` -- in `main`, ACCEPTED
- `.planning/phases/05-skill-effectiveness-evals/05-SECURITY.md` -- in `main`, ACCEPTED
- `.planning/phases/08-kerievsky-catalog-refactoring-to-patterns/08-SECURITY.md` -- branch-only, SCRUBBED
- `.planning/phases/08.2-functional-catalog-inserted/08.2-SECURITY.md` -- branch-only, SCRUBBED

Detection: a bare work-domain scan, held only ephemerally on the command line and
never committed (the needle is itself a leak). It matched the plain-form domain but not
the escaped-needle form, so the six files above carried the domain in plain form. These are almost
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

## Resolution (2026-07-09)

**Corrected assessment.** The original finding above overstated severity. There is NO
routable work email (`<local-part>@` + the domain) anywhere in the repo, and NO commit has
the domain in its author or committer identity (verified across all refs via
`git log --all --format='%ae %ce'`). Every hit is the BARE domain with no `@local-part`,
quoted as the search NEEDLE inside audit tables that were asserting the email was absent --
the Pitfall-3 self-reference trap. A bare domain is not an email-shaped token, which is why
the `check-hygiene.mjs` allowlist axis (b) never flagged it.

**Branch-only files (08, 08.2): SCRUBBED.** Redacted from all branch-exclusive history with a
scoped rewrite that provably left `main` untouched:
`git filter-repo --replace-text <expr> --refs <merge-base>..HEAD --partial --force`, then
`git push --force-with-lease`. Verified: `main` SHA unchanged, 256 commits + 2 merge commits
preserved, domain absent from every branch commit, sanctioned escaped needle intact.

**`main`-side files (02, 03-REVIEW, 03, 05): ACCEPTED.** Risk accepted by the maintainer on
2026-07-09. Disposition is ACCEPT, not mitigate. Rationale:

- The exposure is a bare company domain (public information), not a routable address; the
  one line that also carries the address local-part is a doc quoting the guard, not a contact.
- Remediation would require rewriting SHARED, already-published `main` history plus a
  force-push of `origin/main`, breaking SHAs for any existing clone or fork. That cost
  exceeds the exposure.
- DST-02 requires the work EMAIL to be absent from the shippable surface. That surface is
  clean (187 files, ASCII + email allowlist PASS), so DST-02 is unaffected and this does NOT
  block the 0.0.2 ship.

**Forward prevention (landed, commit `444c5ad`).** Instructions now cover the email AND its
bare domain across three surfaces -- committed file content, commit messages, and the
maintainer's commit author/committer identity -- in `AGENTS.md` (cross-agent home) and
`CLAUDE.md`. Detection stays ALLOWLIST-INVERSION (encode only the approved public gmail, flag
everything else); the forbidden value is never encoded, not even split or hashed. Two
deliberate scope decisions: the rule is maintainer-scoped so outside contributors are never
blocked, and bare-domain detection in arbitrary content is out of scope (ordinary URLs make a
domain allowlist impractical) -- it is covered by instruction, not by a checker. Git hooks
were explicitly rejected: they are per-clone/per-machine and cannot enforce for other committers.

This never blocked plan 10-01, whose deliverable (the instrument) is complete and GREEN.
