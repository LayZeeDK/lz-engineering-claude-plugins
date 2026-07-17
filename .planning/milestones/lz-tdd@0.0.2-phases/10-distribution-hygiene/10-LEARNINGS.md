---
phase: 10
phase_name: "distribution-hygiene"
project: "lz-engineering-claude-plugins"
generated: "2026-07-09"
counts:
  decisions: 6
  lessons: 5
  patterns: 5
  surprises: 4
missing_artifacts:
  - "10-UAT.md"
---

# Phase 10 Learnings: distribution-hygiene

## Decisions

### Widen a gate in place, never weaken one; split targets per axis inside one checker
Extended `check-hygiene.mjs` in place (not a sibling checker) with two internal target arrays: `wideTargets` for axes (a) ASCII + (b) work-email (187 files: both skill trees + root README/CHANGELOG/LICENSE + both manifests) and `verbatimTargets` for axis (c) no-verbatim (180 files: lz-refactor tree + new root prose only). Axis (c) was promoted from a soft WARN to a HARD `report()` gate; no existing HARD check was relaxed.

**Rationale:** Lower surface, reuses the existing `repoRoot` anchor; the narrower axis-(c) set correctly excludes lz-tpp (cited FibTPP by design), LICENSE (verbatim OSI MIT), and the manifests (short quoted JSON) that would false-positive.
**Source:** 10-01-SUMMARY.md, 10-01-PLAN.md

### Version lives in plugin.json only; marketplace.json stays version-free
Bumped `plugin.json` to 0.0.2 (the `/plugin update` trigger) and did NOT add a `version` key to `marketplace.json`.

**Rationale:** When both carry a version, `plugin.json` wins silently and the marketplace value is masked, drawing a validator warning (D-09).
**Source:** 10-02-PLAN.md, 10-02-SUMMARY.md

### Recount catalog inventory against the live tree at write time
The README inventory line (62 Fowler / 27 Kerievsky / 23 GoF / 5 extra / 19 functional / 28 smells) was recounted from the actual catalog dirs at authoring time, not transcribed from planning docs.

**Rationale:** Counts drift; planning-doc figures go stale. Counts + names are facts, not protected expression, but only if they match reality (D-07).
**Source:** 10-02-SUMMARY.md

### Triage findings FIX-vs-DEFER against a locked ship-blocker list (D-13)
FIX-in-phase = structural/manifest errors, security/path-traversal, broken install/invocation, ASCII violations, broken links, malformed frontmatter, factual inaccuracies, DST-04 verbatim hits. DEFER-to-Phase-11 = description-triggering effectiveness, over/under-triggering, coach-routing accuracy. The >500-char descriptions and lean SKILL.md bodies are DEFER, not defects.

**Rationale:** Keeps the ship gate from pulling empirical eval work forward and from fighting the intentional lean/progressive-disclosure design.
**Source:** 10-04-PLAN.md, 10-04-SUMMARY.md

### Full-tree work-email guard by allowlist-inversion, never by encoding the needle
The plan's literal verify used a bare-domain needle grep; the run instead enumerated every email-shaped token across the whole tree and asserted only the approved public gmail appears.

**Rationale:** The maintainer global rule mandates allowlist-inversion and treats writing the forbidden value as a search needle as itself the leak; bare-domain detection is deliberately out of scope.
**Source:** 10-04-SUMMARY.md, AGENTS.md

### Surface-scoped clean-room sweep with a blind reword loop
For DST-04, only the single shipped surface per leaf (one `## Intent` line or one `## Mechanics` list) was passed to `oracle-reviewer`, batched by chapter/family; on a `revise` verdict the surface was reworded blind from category-only structural directives (never reading `.oracle/`) and re-gated in a fresh invocation.

**Rationale:** Keeps copyrighted expression from crossing back into the main context while still converging the shipped surface to `pass`.
**Source:** 10-03-SUMMARY.md, 10-DST-04-ATTESTATION.md

---

## Lessons

### The escaped work-email needle in a committed audit doc IS the leak
While drafting 10-04-SUMMARY I wrote the escaped employer-domain needle into a code snippet describing the plan's grep; it was caught and stripped before commit. Even the escaped form belongs only in uncommitted notes, never in a committed file.

**Context:** This is the recurring self-reference trap (a doc asserting the domain's absence spells the domain). It has fired repeatedly across phases; re-scan every agent-authored meta-doc before commit.
**Source:** 10-04-SUMMARY.md (this run's deviation)

### gsd-executor cannot run a plan whose tasks spawn subagents
Plan 10-04 Task 2 spawns the plugin-dev `plugin-validator` + `skill-reviewer` agents; the `gsd-executor` agent type has no Agent tool, so it structurally cannot run that plan. The phase orchestrator ran 10-04 directly.

**Context:** Any gate/review plan that fans out to sub-subagents must be orchestrated by something that holds the Agent tool, not delegated to gsd-executor.
**Source:** 10-04-SUMMARY.md

### GSD SECURITY.md / VALIDATION.md templates carry a non-ASCII em-dash
The bundled templates ship a U+2014 em-dash in the H1 (a raw em-dash byte where an ASCII `--` belongs). Authoring from them silently injected non-ASCII into a repo with a hard ASCII-only committed-content rule; caught by the pre-commit byte scan and fixed to `--`.

**Context:** Always run the ASCII byte scan on any artifact authored from a GSD template before committing here.
**Source:** this run (10-SECURITY.md authoring)

### Windows Git Bash mangles leading-slash git grep patterns
Verify blocks using `git grep -qF '/plugin ...'` false-negative on Windows because MSYS path conversion rewrites the leading-slash pattern. Re-running with `MSYS_NO_PATHCONV=1` confirmed the strings were present.

**Context:** A GREEN-content check can look RED purely from this platform artifact; prefix the env var rather than "fixing" content that is already correct.
**Source:** 10-02-SUMMARY.md

### For a docs/config phase, the checker battery IS the test suite
Nyquist gap analysis found 0 MISSING gaps: every requirement maps to existing automated verification (10-checker battery + `tsc --strict` + `claude plugin validate --strict` + plan verify-block content assertions). No test files were generated; the nyquist-auditor was correctly not spawned.

**Context:** Do not generate unit tests for static docs/manifests; classify the existing deterministic gates as the coverage and mark nyquist-compliant.
**Source:** 10-VALIDATION.md, 10-VERIFICATION.md (this run)

---

## Patterns

### Per-axis target split inside one checker
Two internal target arrays so a broad axis (ASCII/email) can scan wider than a narrow axis (IP no-verbatim) without a second checker process.

**When to use:** A single instrument must apply different scope rules per check; some files belong to one axis but must be excluded from another.
**Source:** 10-01-SUMMARY.md

### New shippable prose mirrors an intra-file analog, link-don't-inline
Each new README/CHANGELOG block was authored as a diff-in-words against an existing analog in the same file (the lz-tpp section, the 0.0.1 entry); book sources are cited by link only, never inlined.

**When to use:** Adding a parallel section to an existing public doc under a no-verbatim IP constraint.
**Source:** 10-02-SUMMARY.md

### Blind reword loop through a read-only reviewer
On a fidelity `revise` verdict, rewrite the flagged surface from the reviewer's category-only directives WITHOUT reading the source, then re-gate in a fresh reviewer invocation (bounded round cap).

**When to use:** Converging shipped text away from near-verbatim while a clean-room firewall forbids the author from reading the source.
**Source:** 10-03-SUMMARY.md

### Orchestrator-run gate plan (deterministic inline, reviews fanned out)
Run the deterministic gates inline in the orchestrator, then launch the read-only review agents in parallel and triage their verdicts.

**When to use:** A verification/gate plan whose steps require spawning agents the executor type cannot spawn.
**Source:** 10-04-SUMMARY.md

### Allowlist-inversion email guard
Enumerate every email-shaped token across the target set and assert the only one present is the approved address; flag everything else. Never encode the forbidden value.

**When to use:** Any PII/identity hygiene gate; especially in a public repo where writing the forbidden value as a needle is itself the leak.
**Source:** 10-04-SUMMARY.md, check-hygiene.mjs

---

## Surprises

### The "work-email leak" was overstated, then corrected to an accepted bare-domain finding
The initial full-tree guard read as a HIGH-severity leak, but investigation showed no routable address and no author/committer identity exposure anywhere -- only the bare company domain quoted as an audit needle in four main-side prior-phase docs.

**Impact:** Disposition became ACCEPT (out of the shippable-surface scope; rewriting published main history would cost more than the exposure). Bare-domain detection was declared out of scope by design; branch-only leaks were scrubbed.
**Source:** deferred-items.md, 10-03-SUMMARY.md

### lz-tpp/SKILL.md is byte-unchanged on the branch yet still gets a review pass
The plan called for a skill-reviewer PASS on BOTH skills, but a git diff vs origin/main showed lz-tpp/SKILL.md was untouched this milestone -- so its review is a gap-fill, not a review of changed code.

**Impact:** Any lz-tpp finding is pre-existing/DEFER and lz-tpp was not edited; the scope caveat was recorded rather than acting on unchanged-file findings.
**Source:** 10-04-SUMMARY.md

### A transient WARN empirically validated the manifest exclusion
While axis (c) briefly scanned the wide set, a 150-char quoted JSON run in plugin.json tripped a WARN. Excluding the manifests from `verbatimTargets` removed it.

**Impact:** Confirmed by experiment why manifests must stay out of the no-verbatim axis -- the per-axis split is load-bearing, not cosmetic.
**Source:** 10-01-SUMMARY.md

### The manifests/README/CHANGELOG described a one-skill plugin
The pre-edit files still framed lz-tdd as shipping only lz-tpp -- a factual inaccuracy, not just a missing addition.

**Impact:** Correcting the stale one-skill strings was a FIX-in-phase item (factual accuracy), not optional polish.
**Source:** 10-02-PLAN.md
