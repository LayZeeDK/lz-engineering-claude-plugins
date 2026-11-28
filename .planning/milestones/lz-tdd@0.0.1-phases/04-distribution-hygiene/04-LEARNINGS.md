---
phase: 4
phase_name: "Distribution & Hygiene"
project: "lz-engineering-claude-plugins"
generated: "2026-07-02"
counts:
  decisions: 5
  lessons: 3
  patterns: 5
  surprises: 4
missing_artifacts:
  - "04-UAT.md"
---

# Phase 4 Learnings: Distribution & Hygiene

## Decisions

### Single root README as the primary shippable doc
A single root `README.md` is the GitHub landing page and `/plugin marketplace add` target; the per-plugin `plugins/lz-tdd/README.md` is a one-line pointer only, never a duplicate.

**Rationale:** A single-plugin marketplace does not justify duplicated docs; a pointer preempts the plugin-validator per-plugin-README warning without drift.
**Source:** 04-CONTEXT.md (D-01), 04-01-PLAN.md

### README links TPP sources, never inlines the list
The README gives a brief TPP primer that links the three authoritative sources and points to `references/transformations.md`; it does not inline the 14-item list or worked examples.

**Rationale:** Keeps the skill's `references/` the single source of truth (progressive disclosure); prevents README/reference drift.
**Source:** 04-CONTEXT.md (D-02)

### Plugin version stays 0.0.1 (locked), overriding the STACK "start at 0.1.0" note
plugin.json `version` is deliberately 0.0.1, not the 0.1.0 the research STACK note suggested.

**Rationale:** 0.0.1 is a validated milestone decision (PROJECT.md Key Decisions + MKT-02, Phase 1 complete); the STACK suggestion was superseded. The plugin-validator advisory was triaged as by-design.
**Source:** plugin-validator report, 04-SUMMARY.md

### Findings-triage rule (D-06): fix structural now, defer effectiveness to Phase 5
Fix structural/manifest/security/ASCII/factual/authoring-defect findings now; record-and-defer description-length, body-word-count, and triggering-effectiveness findings to Phase 5.

**Rationale:** Empirical description/coaching tuning was explicitly deferred to Phase 5 (Phase-3 D-10, EVAL-01/02); acting on those findings in Phase 4 would pull Phase-5 work forward.
**Source:** 04-CONTEXT.md (D-06), 04-SUMMARY.md

### ASCII gate scoped to the shippable surface, not full-tree
The ASCII gate runs only over `plugins/`, `.claude-plugin/`, `README.md`, `LICENSE` -- never the whole tree.

**Rationale:** `.planning/` already contains pre-existing GSD-emitted non-ASCII (em-dashes, U+2588 progress bars) the phase did not author; a full-tree scan would false-fail on out-of-scope content.
**Source:** 04-RESEARCH.md (Pitfall 2), 04-01-PLAN.md

---

## Lessons

### The work-email self-reference trap recurred twice in one phase
Any document that states the "work email must appear nowhere" rule -- and any agent report asserting the email is absent -- tends to spell the literal while doing so. It happened first in the discuss-phase artifacts (04-CONTEXT.md, 04-DISCUSSION-LOG.md) and again in the code-review agent's 04-REVIEW.md. Both tripped the DIST-02 full-tree guard.

**Context:** Never write the work email or its work domain in any committed file, not even as an escaped search needle (the needle is itself a leak); detect by allowlist-inversion instead -- assert the only email-shaped token present is the approved public gmail and flag everything else.
**Source:** 04-RESEARCH.md (Pitfalls 1, 3), 04-VERIFICATION.md, 04-SUMMARY.md

### Run the DIST-02 guard as a post-commit gate, not only at authoring time
Committing 04-REVIEW.md (an agent-generated report) without re-running the full-tree work-email guard let the literal reach HEAD; only the phase verifier caught it, forcing a redact + commit-amend.

**Context:** The work-email allowlist-inversion guard (assert only the approved public gmail is present, remainder empty) must run after every commit that touches meta-docs or agent reports -- authoring-time "confirmed absent" is stale the moment any later doc quotes the rule.
**Source:** 04-VERIFICATION.md (gap_found -> passed re-verification)

### "Confirmed absent" is a point-in-time claim, not a durable one
The discuss-phase note "work email confirmed absent at discuss time" was already false by the time CONTEXT.md was committed, because the commit itself introduced the literal.

**Context:** Verify secret-absence at commit time (and pre-push), not at discovery time; treat the guard as the source of truth over any prose assertion.
**Source:** 04-RESEARCH.md (Pitfall 1)

---

## Patterns

### MSYS_NO_PATHCONV=1 for slash-leading git grep/rg patterns on Git Bash
On Windows Git Bash, a `git grep`/`rg` pattern that starts with `/` (e.g. `/plugin marketplace add ...`) is mangled by MSYS path conversion before the tool sees it, producing a false negative. Verified: `marketplace add` matched but `/plugin marketplace add` did not until `MSYS_NO_PATHCONV=1` was set.

**When to use:** Any acceptance-criteria / verification `git grep -F`/`rg -F` for a string beginning with `/` on Git Bash. Patterns not starting with `/` (`larsbrinknielsen@gmail\.com`, `[^\x00-\x7F]`) are unaffected.
**Source:** execution (Task 1 verify debugging), 04-VALIDATION.md (Windows note)

### Detect PII by allowlist-inversion, never by encoding the forbidden value
Never write the work email or its work domain in a committed file, not even as an escaped search needle -- the needle is itself a leak. Detect absence by allowlist-inversion instead: assert the only email-shaped token present is the approved public gmail (larsbrinknielsen@gmail.com) and flag everything else.

**When to use:** Whenever a committed artifact must document a secret/PII detection method without spelling the forbidden value.
**Source:** 04-RESEARCH.md (Pitfall 3)

### Redact-and-amend an unpushed commit to purge a secret before it goes public
When a secret lands in a local unpushed commit, redact the working tree then fold the fix into the offending commit (fixup + non-interactive autosquash, or amend if it is HEAD) so the literal never exists in any commit bound for the public remote. Safe while unpushed; the reflog retains a backup.

**When to use:** A secret/PII leak caught before push, on a linear (no-merge) unpushed range.
**Source:** execution (3c313a9 rewrite; 04-REVIEW.md commit amend)

### Lift identity values verbatim from manifests (anti-drift)
README/LICENSE reuse the exact email, license, repo URL, install strings, and invocation from `marketplace.json`/`plugin.json` rather than re-typing them.

**When to use:** Authoring any doc that restates identity/config values already defined in a manifest -- lift, never re-invent, to prevent drift (D-04).
**Source:** 04-01-PLAN.md, 04-PATTERNS.md

### For a framework-free docs phase, the review gates ARE the tests
With no unit-test framework, Nyquist coverage is satisfied by scriptable gates (ASCII, work-email, `claude plugin validate . --strict`) plus read-only agent reviews recorded as manual-only checks.

**When to use:** Documentation/licensing/config phases with no runtime code; map each requirement to a deterministic gate command instead of expecting test files.
**Source:** 04-VALIDATION.md, 04-RESEARCH.md (Validation Architecture)

---

## Surprises

### The work email was ALREADY public in Phase-1 git history
Phase-4 research discovered the work-email literal in the diffs of four Phase-1 commits (`5f46fee`, `79b1db0`, `43ee129`, `009060c`), all ancestors of `origin/main` -- i.e. already public since Phase 1 shipped.

**Impact:** The Phase-4 working tree is clean, but a separate, user-gated decision remains open: scrub public history (rewrite + force-push) vs. accept the exposure. Out of scope for this phase, which gates the working tree.
**Source:** 04-RESEARCH.md (Open Q1), 04-VERIFICATION.md

### The code-review file scope mis-computed and pulled in Phase-3 files
The code-review workflow's loose `--grep="04"` diff-base heuristic resolved a base far back and swept in the Phase-3 skill files (SKILL.md + 3 references) that Phase 4 never touched.

**Impact:** Corrected by scoping the review to the actual Phase-4 files via an explicit file list, avoiding a redundant deep re-review of already-verified Phase-3 deliverables.
**Source:** execution (code_review_gate scoping)

### The hard first-party gate was already green before the phase started
`claude plugin validate . --strict` exited 0 on the repo before any Phase-4 work; the only risk was regressing it, not achieving it.

**Impact:** Reframed the phase as lift-align-verify (regression-avoidance) rather than construction.
**Source:** 04-RESEARCH.md (Summary, Standard Stack)

### skill-reviewer found repo-internal IDs leaking into shipped reference docs
Repo-internal decision IDs (`D-03`, `TPP-05`) and a `.planning/` transcript path appear in the shipped `references/` files -- contextless for an installed-skill reader.

**Impact:** Out of Phase-4 scope (Phase-2/3 LOCKED deliverables, esp. the "DO NOT MODIFY" transformations.md); recorded as a deferred polish item, not a ship blocker.
**Source:** skill-reviewer report, 04-SUMMARY.md
