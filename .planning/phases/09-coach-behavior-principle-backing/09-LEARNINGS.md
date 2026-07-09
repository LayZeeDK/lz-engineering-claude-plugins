---
phase: 09
phase_name: "coach-behavior-principle-backing"
project: "lz-engineering-claude-plugins"
generated: "2026-07-09"
counts:
  decisions: 7
  lessons: 5
  patterns: 6
  surprises: 4
missing_artifacts:
  - "09-UAT.md"
  - "09-SECURITY.md"
---

# Phase 09 Learnings: coach-behavior-principle-backing

## Decisions

### D-09: check-backing.mjs as a new sibling checker, not an overload of check-principles.mjs
The PRIN-01/02/03 structural gate was built as a NEW `check-backing.mjs` rather than extending the
FWL-03-specific `check-principles.mjs`, asserting the 3 principle refs exist with their core-topic
tokens, the no-oracle tag, and (for beck-tidy-first) a Fowler-catalog link; wired into the
`npm run check` battery.

**Rationale:** Keeps the FWL-03 Fowler-oracle checker single-purpose and lets the no-oracle Beck/Feathers
gate evolve independently; coach + Beck link resolution is delegated to the extended check-crossrefs.
**Source:** 09-01-PLAN.md, 09-01-SUMMARY.md

### D-10: single shared collectH1Lines helper, per-checker patch forbidden
IN-02 tech debt was retired ONCE as a shared `tools/lib/heading-scan.mjs` exporting a fence-aware
`collectH1Lines`, imported by all four catalog checkers in place of their identical fence-blind H1 scan.

**Rationale:** A per-checker patch re-introduces the divergence the 08.2 fixer declined to touch; one
helper is the single source of truth. The swap is behavior-preserving and the still-GREEN battery is the proof.
**Source:** 09-01-PLAN.md, 09-01-SUMMARY.md

### D-01/D-02: coach decision procedure inline in SKILL.md, no split
The coach procedure lives INLINE in SKILL.md (replacing the deferred-to-Phase-9 placeholder), a compact
6-step numbered tree that landed the file at 113 lines — well under the 500-line cap, so the
split-to-coach-procedure.md fallback was not triggered.

**Rationale:** The procedure is the skill's core auto-trigger behavior (not heavy catalog material);
heavy content stays in references/ per progressive disclosure.
**Source:** 09-02-PLAN.md, 09-02-SUMMARY.md

### D-03: coach routing source-of-truth is the existing smells.md, no duplicate table
The procedure adds only the routing dimension (mechanical -> Fowler; repeated/complex -> Kerievsky;
unwarranted pattern -> functional-catalog; missing tests -> Feathers) and references the existing
smells.md + smell leaves; it inlines no new smell->refactoring table.

**Rationale:** Preserves the navigation-only-index / open-the-leaf design and avoids duplicating the
taxonomy the coach must route against.
**Source:** 09-02-PLAN.md

### D-06: principles.md links to the Beck refs, pointers-only (no content import)
principles.md stays the Fowler-oracle file and gained two sibling-relative pointers to the two no-oracle
Beck backing files (under two-hats/seam and when-to-refactor/economics), importing no Beck content.

**Rationale:** Preserves the oracle / no-oracle provenance separation while still connecting a reader
from the Fowler principles to the Beck backing.
**Source:** 09-04-PLAN.md, 09-04-SUMMARY.md

### D-07: Beck/Feathers refs are no-oracle, high-confidence core only
The three principle refs are tagged no-oracle: Beck/Feathers are unowned with no committed research
artifact, so the correctness anchor is tight core scope (D-08) + skill-reviewer PASS + DST-04 hygiene,
NOT an oracle-reviewer.

**Rationale:** There is no owned book to diff against; substituting a tight-scope + review triad is the
only defensible correctness anchor.
**Source:** 09-03-PLAN.md

### D-11: principle content authored fence-safe
All three refs were authored fence-free or with TS fences only (TS comments are //, never a column-0
hash), avoiding any non-TS fenced block with a column-0 hash line.

**Rationale:** Keeps the check-crossrefs slugsFor fence gap dormant (an authoring-discipline mitigation
rather than a checker change).
**Source:** 09-03-PLAN.md, 09-03-SUMMARY.md

---

## Lessons

### check-backing's Fowler-link regex requires a leading dot
`check-backing`'s presence regex `/\]\(\.\.?\/?fowler-catalog\//` mandates a leading dot, so
beck-tidy-first.md uses the `./fowler-catalog/<slug>.md` form — NOT the bare `fowler-catalog/` form
that principles.md uses. Both resolve identically under check-crossrefs; only the leading-dot form
satisfies the presence gate.

**Context:** A future file the backing checker gates must keep the leading dot or it will falsely fail
the presence check while still resolving under crossrefs. A quiet divergence between two link-style
conventions in the same references/ tree.
**Source:** 09-03-SUMMARY.md

### Verify a plan's claims about code against the actual source before acting
The 09-01 plan (and orchestrator reminders) asserted check-functional.mjs referenced `const lines`
elsewhere and instructed keeping it. `rg` proved the variable was consumed ONLY by the removed H1 scan
(the other "lines" matches were the English word or distinct identifiers), so keeping it would have left
dead code, violating the plan's dominant "no dead const may remain" criterion.

**Context:** Plan prose can be wrong about the very code it edits; the executor's rg check + the fact
that check-functional still exits 0 (no ReferenceError) proved the deletion safe. Trust the source over
the plan's description of the source.
**Source:** 09-01-SUMMARY.md

### The DST-04 near-verbatim trap self-reproduces even in "paraphrased" drafts
The Feathers seam definition kept the canonical "...alter behavior... without editing... in that place"
sentence spine with only synonym swaps (place->point, alter behavior->change what a piece of code does).
Two independent reads (orchestrator + an independent DST-04 reviewer) flagged the SAME line.

**Context:** Confirms the project's known DST-04 trap: canonical one-liners reproduce near-verbatim
unless deliberately restructured to shed the source's sentence architecture, not just its words. The
fix reworded around external substitution so no canonical spine survived (commit a63d1b4).
**Source:** 09-03 skill-review + DST-04 review (this session), 09-03-SUMMARY.md

### skill-reviewer catches routing bugs the structural battery cannot
The 09-02 skill-reviewer found that step 3 cited "Repeated Switches" as a Kerievsky-routed smell, but
its own authoritative leaf routes only to Fowler (Replace Conditional with Polymorphism). The `[both]`
smell tag never determines the catalog — the leaf does; the author got Long Function right and Repeated
Switches wrong.

**Context:** The checker battery verifies links resolve and tokens exist, but not that a routing example
agrees with the leaf it points at. Behavioral/semantic correctness of coach prose needs a reviewer
(and, later, EVL-02). Fixed in commit 9b047cd.
**Source:** 09-02 skill-review (this session)

### Authoring subagents leak internal planning IDs into shipped public content
The finalize skill-reviewer found "wired in Phase 9" (a process artifact) and "FUT-01" (an internal
ticket ID) in shipped reference prose, plus a "no dedicated Fowler 2nd-edition leaf" phrasing that could
be misread as a claim about the book.

**Context:** For a public repo with strict content hygiene, executor-authored prose must be scrubbed of
planning-process vocabulary before phase close; the automated hygiene checker (ASCII + email) does not
catch these. Fixed in commit a4106f5.
**Source:** 09-04 skill-review (this session)

---

## Patterns

### Instrument-first / Nyquist RED baseline
Build the structural checker gate to an ASSERTED RED baseline (exit 1) BEFORE the content it gates
exists, wire it into the battery, then let the content plans turn it GREEN. The RED assertion proves
the gate actually works rather than passing vacuously against absent content.

**When to use:** Any phase where authored content must satisfy a machine-checkable contract — stand up
the checker first so the content plans have a target and a false-PASS is impossible.
**Source:** 09-01-PLAN.md, 09-01-SUMMARY.md

### Pointers-only cross-ref between oracle and no-oracle references
Link from an authoritative (oracle) reference to a no-oracle reference without importing the latter's
content — the reader is routed, provenance boundaries stay intact, and no unowned content bleeds into
the oracle file.

**When to use:** Connecting references of different provenance/confidence where you must not blur where
each claim's authority comes from.
**Source:** 09-04-SUMMARY.md

### Behavior-preserving refactor proven by an unchanged GREEN gate
When retiring duplication into a shared helper, assert every pre-existing checker still exits 0
individually after the swap — the unchanged battery IS the proof of behavior preservation.

**When to use:** Any dedup/extract refactor of tooling where "did I change behavior?" must be answered
objectively rather than by inspection.
**Source:** 09-01-SUMMARY.md

### No-oracle review triad substitutes for an oracle-reviewer
For content from unowned sources, replace the oracle-reviewer gate with: structural checker
(check-backing) + skill-reviewer PASS (authoritative IP anchor) + an independent DST-04 near-verbatim
read. Run the DST-04 read unprimed so an independent flag is real signal.

**When to use:** Authoring reference content from books/sources you do not own and cannot diff against.
**Source:** 09-03 (this session), D-07

### Single-plan waves run sequentially on the main tree, not in worktrees
Worktree isolation exists to protect PARALLEL plans from racing on the working tree; a single-plan wave
gains nothing from it and only adds merge + cleanup + manifest failure surface. Run single plans
sequentially; the executor commits directly and owns its own STATE/ROADMAP updates.

**When to use:** Any execute-phase invocation that resolves to exactly one plan (a `--wave N` with one
plan, or `--plan NN`).
**Source:** execute-phase orchestration (this session)

### Orchestrator-run review gate for agents that lack the Agent tool
When a plan's finalize gate requires a subagent review (skill-reviewer) but the executor has no Agent
tool, the executor runs the automated gates and records the review as orchestrator-pending; the
orchestrator runs the review and records the PASS as a committed artifact so verification is
artifact-backed.

**When to use:** Any gate step that needs a capability the executing agent lacks — delegate explicitly
and close the loop with a durable record.
**Source:** 09-04-SUMMARY.md, 09-VERIFICATION.md

---

## Surprises

### The finalize gate needed zero fixes — the merged tree was already GREEN
By the time 09-04 ran, the parallel Wave-2 content (09-02 coach + 09-03 refs) plus the 09-01 harness had
already produced a fully GREEN battery on the merged tree, so the Wave-3 finalize task authored only two
pointer lines and diagnosed no RED checker.

**Impact:** The instrument-first + tight-scope design paid off: integration produced no surprises to fix
at the gate.
**Source:** 09-04-SUMMARY.md

### validate-phase found 0 automatable gaps — the checker battery IS the test suite
For this documentation / skill-authoring phase there was no unit-test framework to populate; the
node-builtin checker battery + tsc --strict typecheck + `claude plugin validate .` constitute the entire
automated verification, and all were GREEN. No gsd-nyquist-auditor test generation was required.

**Impact:** Nyquist compliance was reached by completing the coverage map and marking behavioral routing
+ no-oracle IP fidelity as justified manual-only (skill-reviewer PASS + Phase 11 EVL-02), not by writing tests.
**Source:** 09-VALIDATION.md (this session)

### An independent review subagent died mid-run on a session-limit API error
The first DST-04 review subagent terminated early ("session limit") having done no real work; it was
re-run synchronously after the limit reset and completed normally, confirming the orchestrator's own
seam-definition finding.

**Impact:** Background review agents can fail on infrastructure, not content — re-run rather than
treating the failure as a verdict; running the retry synchronously avoided a second orphaned run.
**Source:** orchestration (this session)

### Two independent reads converged on the exact same near-verbatim line
The orchestrator's own DST-04 read and the independent reviewer's read both flagged the Feathers seam
definition — the single actionable finding across three authored files — with the other two files rated
CLEAN by both.

**Impact:** Convergence between an unprimed independent reviewer and the orchestrator's read raised
confidence that the one fix was the right and only fix, and that the CLEAN files were genuinely clean.
**Source:** 09-03 DST-04 review + skill-review (this session)
