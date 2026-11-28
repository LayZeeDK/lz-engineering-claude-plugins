---
phase: 19
phase_name: "distribution-hygiene"
project: "lz-engineering-claude-plugins"
generated: "2026-07-21"
counts:
  decisions: 7
  lessons: 5
  patterns: 7
  surprises: 4
missing_artifacts:
  - "UAT.md"
---

# Phase 19 Learnings: distribution-hygiene

## Decisions

### Forward-fix the tip, no main-history rewrite (D-12)
The GA-7 encode-the-forbidden-value anti-pattern was removed by rewriting each instance to a
non-encoding allowlist-inversion form on the current branch tip, in one normal docs-only commit -- not
by `git filter-repo` / force-push of shared `main` history.

**Rationale:** the exposure was a bare work-domain in archived planning meta-docs; a shared-history
rewrite is disproportionate for that, and forward-fixing before the 0.0.3 push keeps the base tree clean
going forward.
**Source:** 19-02-SUMMARY.md

### Sweep ALL tracked planning docs, not just the frontmatter-listed file
All 19 tracked planning docs carrying the anti-pattern were rewritten, across two shipped milestones,
not only the one file the plan frontmatter named.

**Rationale:** the plan `<action>` + must_haves truth 3 + D-12 ("sweep all tracked planning docs; fix
each") are the controlling acceptance criteria; the frontmatter could list only one file because
enumerating siblings at plan time would have required spelling the needle, so enumeration was delegated
to the executor's ephemeral in-session grep.
**Source:** 19-02-SUMMARY.md

### version lives in plugin.json only; marketplace.json stays version-free (D-06)
The 0.0.3 bump went into `plugin.json` only; `marketplace.json` kept its version-free listing shape.

**Rationale:** avoids the dual-declaration trap where `plugin.json` silently wins and the marketplace
entry is masked; single source of version truth.
**Source:** 19-01-SUMMARY.md

### README ordered by the loop; all five RED-phase keywords added (D-13)
README sections run red -> green -> refactor (lz-red before lz-tpp before lz-refactor), and all five
candidate keywords (unit-testing, vitest, failing-test, assertions, three-laws-of-tdd) were added rather
than a minimum of three.

**Rationale:** the ordering matches the rewritten three-skill lead; every keyword is an accurate fact
about the shipped skill (three-laws-of-tdd is the literal spine, assertions is a whole reference file)
and keywords are zero-cost discoverability.
**Source:** 19-01-SUMMARY.md

### Verify-only finalize gate; agent gates deferred to the orchestrator, never self-certified
The 19-03 executor ran the deterministic battery and authored the DST-04 attestation but did NOT run the
three agent gates (plugin-validator, skill-reviewer, DST-04 oracle-reviewer re-sweep); those were handed
to the orchestrator.

**Rationale:** the gsd-executor has no Agent/Task tool and cannot spawn subagents; the review gates must
be reached BY their dedicated agents, never self-certified inline. Requirement closure (DST-02/DST-03)
depends on those verdicts plus gsd-verifier.
**Source:** 19-03-SUMMARY.md

### DST-04 layer-2 re-sweep discharged via a byte-unchanged-since-certified argument
Rather than re-running a full oracle-reviewer sweep, the layer-2 gate was discharged by observing that
Phase 19 modified zero bytes in the shipped lz-red skill tree, so the standing 16-03 / 17-06 / 18-06
oracle-reviewer PASSes apply byte-for-byte.

**Rationale:** `git diff --stat a9e6099..HEAD -- plugins/lz-tdd/skills/lz-red/` is empty; a re-read would
re-verify byte-identical content. Legitimate under the phase's own D-01 attestation-layer model;
gsd-verifier accepted the discharge as non-blocking.
**Source:** 19-VERIFICATION.md, 19-GATE-RESULTS.md, 19-03-SUMMARY.md

### DEFER description-length / body-length flags to Phase 20 (D-09)
The lz-red description (~1091 chars) and SKILL.md body (~147 lines) were recorded as DEFER-to-Phase-20
items, not acted on this phase.

**Rationale:** intentional lean design; empirical triggering-effectiveness tuning is Phase 20 (EVL-01/02).
Shortening the description or inflating the body now would chase a Phase-20 concern for zero phase-19 gain
and would trigger the D-10 review + /reload-plugins cascade.
**Source:** 19-03-SUMMARY.md, 19-VERIFICATION.md

---

## Lessons

### An "accepted risk" is not permanent -- D-12 superseded the 2026-07-09 deferral
The 0.0.1 main-side work-domain instances had been logged as maintainer-ACCEPTED deferred risk on
2026-07-09; D-12 (2026-07-20) reversed that and forward-fixed them, and the deferral narrative itself was
de-needled.

**Context:** a documented accepted-risk entry can be overtaken by a later remediation decision; the
acceptance record must then be explicitly marked as superseded so it does not read as still-current.
**Source:** 19-02-SUMMARY.md

### A naive allowlist-inversion one-liner false-positives on milestone filenames
The full-tree email scan surfaced 7 tokens; 6 were benign `<pkg>@<version>-<DOC>.md` milestone filenames
(a digit follows the `@`), not emails. The naive `test -z "$(... | rg -iv gmail)"` verify returns
non-empty for exactly those.

**Context:** the true empty remainder is only reached after excluding the `@[0-9]` filename tokens; the
one genuine email token is the approved public gmail.
**Source:** 19-03-SUMMARY.md

### The proof-of-absence needle is itself the leak
The archived 06-SECURITY.md T-06-01 cell proved work-email absence by embedding the maintainer
work-domain as an escaped `rg` search needle inside a shell command -- which discloses the very value it
claims is absent.

**Context:** the fix re-expresses proof-of-absence as allowlist-inversion (enumerate tokens, subtract the
approved gmail, assert empty), never naming the forbidden value.
**Source:** 19-02-SUMMARY.md

### Date rollover mid-execution
The wall clock crossed midnight into 2026-07-21 during 19-01; the CHANGELOG entry kept the plan's
2026-07-20 date to stay consistent with every other Phase-19 artifact.

**Context:** flagged for the post-phase tag/release quick task -- the entry date can be adjusted if the
release tag is cut on 2026-07-21.
**Source:** 19-01-SUMMARY.md

### WebFetch was unavailable in the executor context
URL verification for the README authoritative-source links fell back to `curl` HTTP-status checks per the
CLAUDE.md fetch fallback chain, which was sufficient to confirm each URL resolves.

**Context:** do not assume WebFetch is available inside a gsd-executor subagent; have the curl fallback
ready.
**Source:** 19-01-SUMMARY.md

---

## Patterns

### Three-skill loop framing across all public surfaces
Frame the plugin as a red -> green -> refactor loop (lz-red -> lz-tpp -> lz-refactor) consistently across
README, CHANGELOG, and both manifest descriptions.

**When to use:** documenting a multi-skill plugin whose skills form one coherent workflow.
**Source:** 19-01-SUMMARY.md

### Link-don't-inline for copyrighted sources
Cite authoritative sources by link and bundle a references pointer; never inline book prose or transcript
text into public docs.

**When to use:** any public-repo prose that draws on copyrighted material; keeps the no-verbatim hygiene
axis GREEN.
**Source:** 19-01-SUMMARY.md

### Per-edit hygiene re-verification
Run check-hygiene GREEN after each content edit (re-verify, do not widen the gate).

**When to use:** multi-edit content plans in a repo with a PII/ASCII/no-verbatim gate; catches a leak at
the edit that introduced it.
**Source:** 19-01-SUMMARY.md

### URL anti-drift
Verify each authoritative-source URL resolves (curl HTTP status) before committing it to public prose.

**When to use:** adding external links to shipped docs; prevents dead links and factual drift.
**Source:** 19-01-SUMMARY.md

### allowlist-inversion in prose
Enumerate every email-shaped token over the tree, subtract the approved public gmail, and assert the
remainder is empty -- mirroring the check-hygiene logic in words, never encoding the forbidden value.

**When to use:** proving maintainer work-email / work-domain absence in any committed doc, including
security/audit evidence cells.
**Source:** 19-02-SUMMARY.md

### DST-04 three-layer attestation artifact
Record layer-1 (deterministic no-verbatim GREEN), layer-2 (orchestrator re-sweep scope over the owned
surfaces), and layer-3 (standing owned-surface oracle-reviewer citations); discharge layer-2 by a
byte-unchanged argument when the owned surfaces were not modified this phase.

**When to use:** closing a copyright/no-verbatim gate on a phase that reuses previously-certified owned
surfaces without editing them.
**Source:** 19-03-SUMMARY.md, 19-DST-04-ATTESTATION.md

### Deterministic finalize gate split (executor battery + orchestrator agent gates)
The executor runs the machine battery and authors the attestation; the orchestrator drives the read-only
subagent gates afterward.

**When to use:** any GSD phase whose finalize gate needs both deterministic checks and non-deterministic
agent judgment, given the executor cannot spawn subagents.
**Source:** 19-03-SUMMARY.md

---

## Surprises

### 19 files carried the anti-pattern, not 1
The GA-7 sweep surfaced the encode-the-forbidden-value pattern across two shipped milestones (0.0.1 phases
02-05 and 0.0.2 phase 10), far beyond the single frontmatter-listed 06-SECURITY.md.

**Impact:** re-scoped the plan's file count from 1 to 19; docs-only and reversible via a single
`git revert`, but a reminder that a hygiene anti-pattern tends to have propagated wherever the technique
was copied.
**Source:** 19-02-SUMMARY.md

### Feathers has no Wikipedia bio page
The candidate author-bio URL 404'd; the README instead links the "Characterization test" article, which
is exactly the concept lz-red cites Feathers for.

**Impact:** avoided shipping a dead link in public prose; the substitute is more precise than a bio page
would have been.
**Source:** 19-01-SUMMARY.md

### Zero ship-blockers at the finalize gate
All six deterministic gates passed exit 0 on the first run; no D-09 FIX edit was needed and the D-10
SKILL.md-review escape valve never fired.

**Impact:** a clean close with no gap-closure loop -- the wave-1/wave-2 content and forward-fix landed
correct the first time.
**Source:** 19-03-SUMMARY.md

### A minor CLI bump landed mid-phase
The `claude` CLI moved 2.1.215 -> 2.1.216 between RESEARCH and the finalize gate; both `validate` gates
still exit 0.

**Impact:** none -- assumption A1 held and no D-09 FIX was triggered; noted so a future validate-gate
regression can be correlated with a CLI version rather than a content change.
**Source:** 19-03-SUMMARY.md
