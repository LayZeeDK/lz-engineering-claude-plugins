---
phase: 7
phase_name: "fowler-catalog-refactoring-2nd-ed"
project: "lz-engineering-claude-plugins"
generated: "2026-07-05"
counts:
  decisions: 7
  lessons: 6
  patterns: 6
  surprises: 4
missing_artifacts: []
---

# Phase 7 Learnings: fowler-catalog-refactoring-2nd-ed

## Decisions

### Clean-room reviewer model (Model C) for copyrighted-source content
Author every leaf/smell/principle BLIND from public knowledge, then verify fidelity against the owner's authoritative book via an ISOLATED `oracle-reviewer` subagent whose returned verdict never carries source prose. The main authoring context never reads `.oracle/`.

**Rationale:** Lets the phase reach the book's facts (mechanics, candidates, caveats) for fidelity checking without any copyrighted expression entering the world-readable repo (DST-04).
**Source:** 07-ORACLE-MODEL.md, 07-02-SUMMARY.md

### The orchestrator (main context) drives content plans INLINE, not via gsd-executor
Standard execute-phase spawns `gsd-executor` in worktrees; that FAILS for these plans because gsd-executor has no `Agent` tool (cannot spawn `oracle`/`oracle-reviewer`) and no `AskUserQuestion` (cannot do owner escalation).

**Rationale:** Only the main context can run the author -> gate -> revise -> escalate loop. `branching_strategy=none`, no worktrees (oracle agents are read-only).
**Source:** .continue-here.md (blocking anti-patterns), 07-02-SUMMARY.md

### 62-refactoring scope (66 web-catalog minus 4 1st-ed relics; keep Return Modified Value)
Cut the 4 refactorings that were in Refactoring 1st ed but dropped from 2nd-ed print+e-book; keep the one genuinely-new web-only entry (Return Modified Value, `[web-only]`).

**Rationale:** Targets the 2nd-edition catalog; 1st-ed-only entries are out of scope.
**Source:** 07-ROUTING-ARCHITECTURE.md

### Per-refactoring-leaf + smell-leaf model (over a flat catalog table / smell trigger-table)
Each refactoring is its own `fowler-catalog/<slug>.md` leaf; each smell its own `smells/<slug>.md` leaf; thin indexes (`README.md`, `smells.md`) link out.

**Rationale:** Progressive disclosure (no single file forces the whole catalog into context) + deterministic cross-link targets. Replaced the superseded 66/tag-group/smell-table pilot model.
**Source:** 07-02-SUMMARY.md, 07-ROUTING-ARCHITECTURE.md

### smells.md is navigation-only (recognize-by + link, NO candidate refactorings)
The smell index carries only a recognize-by cue and a link per smell; the smell->refactoring candidate map lives ONLY in the smell leaf.

**Rationale:** Forces the coach to open the leaf to confirm the fuzzy match before acting -- the index cannot shortcut the confirm step.
**Source:** 07-ROUTING-ARCHITECTURE.md, 07-10-SUMMARY.md

### Owner dropped Split Phase `[web-example]`; Return Modified Value is the sole provenance marker
Split Phase is a normal in-book Ch.6 refactoring; its `[web-example]` label was reversed by the owner during the pilot.

**Rationale:** The locked label contradicted the source; the harness `WEB_EXAMPLE` set is intentionally empty so no wave can re-introduce it.
**Source:** 07-02-SUMMARY.md

### Oracle-reviewer rubric sharpened after Ch.6-10 (three refinements)
(1) mechanics now scores cross-ref aptness (a resolvable-but-wrong sibling link is a defect); (2) applicability treats our own principles/sibling back-edges as benign additions, not invented limits; (3) `spirit` rescoped to `spirit/judgment`.

**Rationale:** Ch.10 caught a wrong cited sibling; back-edges recurred as benign; `spirit` never fired `wrong` in 29 leaves so it was retargeted rather than dropped.
**Source:** 07-ORACLE-MODEL.md (anchor sharpenings), STATE.md

---

## Lessons

### Richer chapters make blind drafts fold sub-steps; the loop restores them
Ch.7+ mechanics are denser than Ch.6, so blind drafts collapsed multi-step procedures; the reviewer's mechanics axis flagged the dropped steps for restoration.

**Context:** Ch.7 was R1 1 pass / 7 revise / 1 blocked -> R2 8 pass; every revise was a real dropped-step/branch fix.
**Source:** 07-04-SUMMARY.md

### Blind authoring can accidentally converge on the source's own example
Two leaves hit `too_close_to_source` on the example domain (Introduce Assertion; Push Down Method) despite never reading the source -- common textbook scenarios collide.

**Context:** Resolved by fully re-domaining the example blind on a `too_close` verdict; both then passed. The gate fired on an ACCIDENTAL collision, proving it is live.
**Source:** 07-07-SUMMARY.md, 07-09-SUMMARY.md

### A checker can be content-correct yet token-RED
`principles.md` was authored + oracle-converged but `check-principles` stayed 7/8 RED because the prose never used the literal token `definition` the checker keyed on.

**Context:** Fixed with a one-line own-framing lead-in supplying the token; no oracle re-review needed. Lesson: harness token contracts are separate from content fidelity.
**Source:** 07-02-SUMMARY.md (issues), 07-03 tracking

### The sample tsc workspace has no DOM lib
An extracted example using `console` broke `tsc --strict`; examples must be pure (return values, no ambient DOM/browser globals).

**Context:** Caught cheaply by the deterministic layer before spending an oracle-reviewer call.
**Source:** 07-02-SUMMARY.md

### Cross-ref aptness: a link that resolves can still be the wrong sibling
A leaf cited a plausible-but-wrong sibling refactoring (Replace Conditional with Polymorphism cited Decompose Conditional where the source uses Extract Function). Resolving-as-a-file is necessary but not sufficient; the NAME must be the sibling the source pairs.

**Context:** Prompted the mechanics-axis sharpening; recurred as the dominant smell-leaf defect (candidate completeness/aptness) in 07-10.
**Source:** STATE.md, 07-07-SUMMARY.md, 07-10-SUMMARY.md

### For smell leaves, the candidate map is where blind drafts drift most
12 of 24 smell leaves needed revision -- mostly a missing source-named candidate, an extra non-source candidate, or a drifted discriminator (e.g. Loops paired only with Replace Loop with Pipeline; Data Class not paired with Encapsulate Collection).

**Context:** Recognition/motivation/spirit axes were mostly `correct` on first pass; candidates + applicability caveats were the revise drivers.
**Source:** 07-10-SUMMARY.md

---

## Patterns

### Clean-room author -> oracle-reviewer gate -> revise blind -> converge (cap ~3 rounds)
Draft blind; gate via `oracle-reviewer` with per-axis anchors; revise blind from the directives; iterate to all-`pass` (or owner-accepted `blocked`). Driver caps rounds (~3) and escalates non-converging/blocked entries to the owner via `AskUserQuestion`.

**When to use:** Authoring public content faithful to a copyrighted source you must not reproduce. This IS the mechanized D-07 oracle gate.
**Source:** 07-ORACLE-MODEL.md, 07-02-SUMMARY.md

### Run the deterministic layer BEFORE spending oracle-reviewer calls
tsc-compile + contract + hygiene + cross-ref checks are cheap and catch format/compile/link breaks that would otherwise waste an expensive review round.

**When to use:** Any gated authoring loop where the reviewer is the costly step.
**Source:** 07-02-SUMMARY.md

### Sub-batch large review sets (~6-8 leaves per oracle-reviewer call, run in parallel)
Big chapters and the 24-smell set were gated in parallel batches rather than one giant call, keeping each reviewer's context focused.

**When to use:** Gating more than ~8 items; balances throughput against per-call context bloat.
**Source:** 07-02-SUMMARY.md, 07-10-SUMMARY.md

### Deterministic index generator that reads only public leaves
Build `README.md` (62 rows, Use-when mirrored verbatim) and `smells.md` from the authored leaves with a small script -- avoids hand-transcribing 62+ lines and guarantees the mirror is exact (verified the first-physical-line prefix property before writing).

**When to use:** Generating an index/table whose cells must match source files exactly; never open `.oracle/` in the generator.
**Source:** 07-10-SUMMARY.md

### Distinct example domains/identifiers to avoid too_close_to_source
Author every example in a domain unrelated to the source's, with original identifiers.

**When to use:** Any blind-authored example against a well-known textbook; textbook scenarios collide by default.
**Source:** 07-02-SUMMARY.md, 07-07-SUMMARY.md, 07-09-SUMMARY.md

### Candidate/inverse cross-links target each leaf's H1 anchor (#slug)
Smell-candidate and inverse-of links use `../fowler-catalog/<slug>.md#<slug>` (the leaf's H1 anchor), which is always present and always resolves at check-smells/check-crossrefs.

**When to use:** Cross-linking between leaf files where a stable, always-present anchor is needed.
**Source:** 07-10-SUMMARY.md

---

## Surprises

### Resuming across a usage-limit reset lost no verdicts
The three Round-1 `oracle-reviewer` smell batches had returned COMPLETE per-draft verdicts before the mid-run usage-limit pause. On resume, the correct move was to apply the 12 revise directives and re-gate only the revised subset (Round 2) -- NOT re-run Round 1.

**Impact:** Avoided ~15 min + tokens of redundant re-gating; the gate is idempotent as long as the returned verdicts are captured before the pause.
**Source:** 07-10-SUMMARY.md (this session)

### The DST-04 near-verbatim gate fired on an ACCIDENTAL collision
`push-down-method`'s blind draft matched the source's short imperative mechanics steps closely enough to trip `too_close_to_source`, with no source access.

**Impact:** Strong evidence the copyright gate is live and mechanized, not theatre; resolved by a blind reword.
**Source:** 07-09-SUMMARY.md, STATE.md

### The `spirit` axis never fired `wrong` across ~29 gated leaves
Through Ch.10, `spirit` scored `correct` on every leaf, so instead of dropping it, the rubric retargeted it to `spirit/judgment` for the judgment-heavy chapters (Ch.11/12) and smell leaves.

**Impact:** Turned a dormant axis into a discriminating one (it caught the Refused Bequest "usually mild judgment call" framing in 07-10).
**Source:** 07-ORACLE-MODEL.md, STATE.md

### A Markdown phase's "test suite" is its checker battery -- validate-phase generated 0 tests
The Nyquist validation found all requirements COVERED by the committed deterministic checkers (name-identity + contract + link resolution + tsc-clean), with no runtime behavior to unit-test.

**Impact:** Confirmed that generating `.test.`/`.spec.` files for a reference-authoring phase would be spurious; the checker battery is the correct, verifier-confirmed automated verification.
**Source:** 07-VALIDATION.md, 07-VERIFICATION.md
