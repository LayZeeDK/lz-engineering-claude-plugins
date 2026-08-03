---
phase: 16
phase_name: "Source Distillation & Core RED References"
project: "lz-engineering-claude-plugins"
generated: "2026-07-19"
counts:
  decisions: 7
  lessons: 6
  patterns: 5
  surprises: 4
missing_artifacts:
  - "16-UAT.md"
---

# Phase 16 Learnings: Source Distillation & Core RED References

## Decisions

### Provision the owned RED sources into git-ignored .oracle/ and clear the oracle-access checkpoint
All RED-phase owned sources were placed in git-ignored `.oracle/` before authoring: RCM *Clean Code*
(`clean-code/`), Metz + Owen *99 Bottles of OOP* **2nd Edition, JavaScript Edition**
(`99-bottles-2e-js/`), and two flat Ian Cooper talk transcripts. The maintainer supplied them during
discuss-phase in response to an explicit escalation.

**Rationale:** Success Criterion 1 requires owned-book clean-room distillation; the oracle agents can
only read what physically exists in `.oracle/`. The edition matters -- the 1st edition of 99 Bottles is
Ruby-only, so citing it would be wrong for a TypeScript skill.
**Source:** 16-CONTEXT.md (D-01), 16-DISCUSSION-LOG.md

### Tag every surface owned (oracle-gated) vs no-oracle (high-confidence core)
OWNED/oracle-gated: RCM Clean Code, Metz 99 Bottles 2e JS, the Cooper talks. NO-ORACLE: Beck (test
list, triangulation, assert-first, evident data), Wake (AAA), North (GWT / "should" naming), Osherove
(three-part naming) -- authored blind, tagged no-oracle, with no oracle-verification claimed.

**Rationale:** Mirrors how 0.0.2 handled Beck/Feathers. Claiming oracle verification for a source not
in `.oracle/` would be a false provenance claim.
**Source:** 16-CONTEXT.md (D-02), 16-02-SUMMARY.md

### Stand up a fresh dev-only lz-red-workspace rather than extending lz-refactor-workspace
Copied the proven extractor recipe (extract-samples.mjs + tsconfig.json + package.json +
scaffold-phrases lib) into a new `.claude/skills/lz-red-workspace/`, repointed at the flat lz-red
references walk.

**Rationale:** Avoids cross-skill coupling and edits to a closed milestone's tooling, and front-loads
the directory Phase 20 will need anyway.
**Source:** 16-RESEARCH.md (Open Questions Q1), 16-01-PLAN.md (D-11), 16-01-SUMMARY.md

### Use a dedicated completeness checker as the Nyquist RED baseline, not the tsc gate
`check-red-references.mjs` is the RED->GREEN instrument; `extract-samples.mjs` (tsc --strict) is a
separate correctness gate.

**Rationale:** The tsc extractor is GREEN-on-empty -- zero fences compile vacuously -- so it cannot
signal "content not yet authored". A completeness checker can.
**Source:** 16-RESEARCH.md (Validation Architecture), 16-01-SUMMARY.md

### Give every Vitest fence an explicit vitest import and pin vitest as a dev dep
Each fence opens with `import { describe, it, expect } from 'vitest'`; the workspace pins
`vitest@4.1.10` alongside `typescript@6.0.3`.

**Rationale:** The extractor forces module scope per fence; without the import (and the installed
types) a bare `it`/`expect` fence would not compile under tsc --strict. lz-refactor never hit this
because its fences are not tests.
**Source:** 16-RESEARCH.md (Pitfall 4), 16-02-SUMMARY.md

### Fill only this phase's requirement slices and preserve the later-phase deferral markers
Filled the SEL and STR slices and all of naming.md; left the "Phase 17 (ASRT)" and "Phase 18
(LAW/SEAM)" markers and their content unauthored.

**Rationale:** The three stubs are co-edited across phases; over-filling would strand Phase 17/18 with
nothing to do and blur requirement ownership. A checker guard asserts the markers remain.
**Source:** 16-CONTEXT.md (D-04), 16-02-PLAN.md, 16-VERIFICATION.md

### Apply Important-rated near-verbatim fixes at the ship gate; leave factual topic labels alone
Reworded two canonical-cadence phrasings flagged by review, but deliberately left "one reason to fail"
where it appears in a Sources citation as a topic label.

**Rationale:** DST-04 is a core public-repo constraint and the fixes were cheap, so "Important" was
worth acting on. But DST-04 explicitly permits facts and topic names -- a citation naming what a source
covers is not copyrightable expression, and scrubbing it would be over-scrupulous.
**Source:** 16-03-SUMMARY.md

---

## Lessons

### gsd-executor cannot spawn subagents, so an executor-driven oracle loop is infeasible
The `gsd-executor` agent's tools are `Read, Write, Edit, Bash, Grep, Glob, Skill, mcp__context7__*` --
no `Agent`/`Task`. Every plan task that says "spawn the oracle agent" or "spawn the skill-reviewer"
cannot be executed as written.

**Context:** Discovered at Wave-2 dispatch, after the researcher, pattern-mapper, planner, and
plan-checker had all passed plans containing that instruction. The fix was to split the work: the
executor authors blind and runs the deterministic gates; the orchestrator spawns oracle-reviewer and
the skill-reviewers.
**Source:** 16-02-SUMMARY.md (Deviations), 16-03-SUMMARY.md (Deviations)

### The automated hygiene gates structurally cannot catch short near-verbatim paraphrase
`check-hygiene.mjs`'s no-verbatim axis only flags double-quoted runs of >= 120 characters, and the
oracle-reviewer was scoped to the tagged "Distilled rationale" sentences. A canonical one-liner
paraphrased into an adjacent unquoted "Rule:" line sits in the blind spot of both.

**Context:** The primed reviewer found exactly two such items ("no more of a test than is enough to
fail"; "one reason to fail") after every automated gate was already GREEN and the oracle-reviewer had
returned pass.
**Source:** 16-03-SUMMARY.md

### A completeness checker can read GREEN while asserting almost nothing
`check-red-references.mjs` reported 22/22 PASS, but a diff against the Phase-15 stub commit showed all
14 topic-content checks were already satisfied by the stub's own Scope paragraph. Only ~6 checks (the
`>= 1 ts fence` and `no scaffold phrase` assertions) were the genuine RED->GREEN signal.

**Context:** Found by the nyquist auditor when it tested the instrument against the pre-authoring
commit instead of only running it. Single-common-word topic regexes (naming.md keys on "should" and
"behavior") would not catch a regression that hollowed out prose but left a keyword.
**Source:** 16-VALIDATION.md (Validation Audit 2026-07-19), 16-01-SUMMARY.md

### A GREEN-on-empty gate cannot double as a completeness signal
The tsc extractor exits 0 when there are zero fences, so running it against empty stubs "passes".

**Context:** This is why the instrument-first wave needed a second, separate checker. Any gate whose
empty case is indistinguishable from its satisfied case is unusable as a RED baseline.
**Source:** 16-RESEARCH.md, 16-01-SUMMARY.md

### The unbiased/primed reviewer split found strictly more than either reviewer alone
The unbiased from-scratch reviewer returned PASS with only optional suggestions; the primed
checklist reviewer returned NEEDS-CHANGES with two Important findings. They converged on one item and
the primed reviewer alone caught the second.

**Context:** Confirms the standing rule to always include at least one neutral from-scratch reviewer --
but also that a checklist-primed reviewer is not redundant, because a checklist item ("no near-verbatim
canon") directs attention a neutral read may rate as low-priority polish.
**Source:** 16-03-SUMMARY.md

### The decision-coverage gate only scans designated plan sections, not a prose decisions section
The planner recorded every decision under a `## Decisions implemented` heading, and the gate still
reported 1/12 covered. The checker scans only frontmatter `must_haves`/`truths`/`objective`, headings
matching must_haves|truths|tasks|objective, and `<objective>/<tasks>/<task>/<action>` XML bodies.

**Context:** Resolved by adding a `decisions: [D-01, ...]` list inside each plan's `must_haves` block,
which lands the ids in a scanned region. The one decision that did pass had matched via soft-phrase
text similarity against a truths line, not by id.
**Source:** 16-01-PLAN.md / 16-02-PLAN.md / 16-03-PLAN.md (must_haves.decisions)

---

## Patterns

### Author-blind, orchestrator-gates clean-room
The drafting agent authors every surface in its own words and never opens `.oracle/`; the orchestrator
then spawns `oracle-reviewer` (CONTENT_TYPE=other plus per-axis correct/partial/wrong anchors) to gate
each owned surface, and re-gates after any edit that touches one.

**When to use:** Any phase distilling from copyrighted sources under DST-04 where the drafting agent
cannot spawn subagents. Preserves the firewall (only verdicts cross back) while keeping authorship and
verification in separate contexts.
**Source:** 16-02-SUMMARY.md, 16-03-SUMMARY.md

### Dual-reviewer ship gate for skill-file content
Before accepting authored skill content, run two reviewers in parallel: one unbiased from-scratch (no
prior findings) and one primed with the plan's acceptance checklist. Merge findings; apply
Critical/Important.

**When to use:** Any edit to shipped skill files (SKILL.md, reference leaves), especially where a
copyright or fidelity axis is in play.
**Source:** 16-03-SUMMARY.md

### Instrument-first Wave 0 with an asserted RED baseline
Build the completeness checker before authoring any content, and assert it RED against the current
stubs as the wave's acceptance criterion.

**When to use:** Content-authoring phases where "done" is otherwise subjective. Gives authoring a
machine-checkable target and makes the RED->GREEN transition auditable. Pair it with a separate
correctness gate whose empty case is not vacuously green.
**Source:** 16-01-PLAN.md, 16-01-SUMMARY.md

### Copy-and-repoint a proven workspace recipe instead of authoring new tooling
The whole validation apparatus was a verbatim copy of the lz-refactor-workspace extractor, tsconfig,
package.json, and scaffold-phrase lib, with a single structural change (multi-catalog walk -> one flat
walk) and one added dev dep.

**When to use:** Whenever a sibling skill already solved the same tooling problem. The pattern-mapper
identified every analog with file and line ranges, which made the copy mechanical.
**Source:** 16-PATTERNS.md, 16-01-SUMMARY.md

### Blocking-human package-legitimacy checkpoint before installing new dependencies
New external dependencies are exact-pinned in the plan, then gated behind a `blocking-human` checkpoint
task that is never auto-approvable -- even under `--auto`. Installation happens only in a later wave,
after approval.

**When to use:** Any phase adding third-party packages. Keeps a supply-chain decision with the human
while leaving everything before the install fully autonomous.
**Source:** 16-01-PLAN.md, 16-01-SUMMARY.md

---

## Surprises

### The no-nested-subagents constraint survived four review passes before surfacing
The researcher, pattern-mapper, planner, and plan-checker all handled plans instructing the executor to
spawn oracle agents; none checked the executor's declared tool list.

**Impact:** Forced an orchestration redesign at Wave-2 dispatch. Outcome was unchanged (owned surfaces
still oracle-reviewer-verified) but the division of labor had to move from executor to orchestrator
mid-phase, and both affected SUMMARYs needed a deviation entry.
**Source:** 16-02-SUMMARY.md, 16-03-SUMMARY.md

### A 22/22 GREEN checker was mostly measuring the stub it was supposed to reject
Only about six of twenty-two assertions actually distinguished authored content from the Phase-15 stub.

**Impact:** Non-blocking for this phase -- tsc, hygiene, oracle-reviewer, the dual skill-review, and two
independent direct reads all corroborate the content -- but it is recorded as checker tech debt, and it
means the reported check count overstated the real coverage.
**Source:** 16-VALIDATION.md (Validation Audit 2026-07-19)

### Rewording for copyright distance raised the fidelity score instead of lowering it
The oracle-reviewer's confidence on the two reworded Clean Code surfaces went from 78 and 85 to 93 and
93 after the DST-04 rewrite.

**Impact:** Counters the intuition that moving away from source phrasing risks drifting from source
meaning. Distinct wording made the own-words/faithful judgment easier for the reviewer, not harder.
**Source:** 16-03-SUMMARY.md

### The verifier's two WARNINGs were both fixed by the very next workflow step
gsd-verifier flagged a stale STATE.md and a REQUIREMENTS.md traceability table still showing the phase
requirements as Pending.

**Impact:** None -- `phase.complete` updates both, and it runs immediately after verification. Worth
knowing so the warnings are not mistaken for real gaps: they are an artifact of verification running
before the completion step.
**Source:** 16-VERIFICATION.md

---

*Phase: 16-source-distillation-core-red-references*
*Extracted: 2026-07-19*
