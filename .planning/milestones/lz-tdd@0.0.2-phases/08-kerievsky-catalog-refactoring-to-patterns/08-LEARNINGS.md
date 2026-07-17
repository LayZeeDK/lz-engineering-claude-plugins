---
phase: 8
phase_name: "Kerievsky Catalog (Refactoring to Patterns)"
project: "lz-engineering-claude-plugins"
generated: "2026-07-06"
counts:
  decisions: 9
  lessons: 7
  patterns: 7
  surprises: 4
missing_artifacts: []
---

# Phase 8 Learnings: Kerievsky Catalog (Refactoring to Patterns)

## Decisions

### The book's Refactoring Directions table is the authoritative Direction source

The `Direction:` field on every Kerievsky leaf is settled against the book's "Refactoring Directions" table (Inside Front Cover), which OUTRANKS oracle chapter-prose. Chapter prose frames only the pattern being adopted, so it misses a refactoring's classification relative to a DIFFERENT pattern (e.g. it reads "Towards Visitor" and drops the "Away from Iterator" fact). The owner supplied the table; the `oracle`/`oracle-reviewer` agents were made permanently aware of it (committed 9a877d7, reloaded).

**Rationale:** Direction is a per-leaf FACT with a single canonical source; anchoring it to the table (not prose) makes the field reproducible and prevents prose-driven mislabels.
**Source:** 08-REFACTORING-DIRECTIONS.md; 08-05-SUMMARY.md; STATE.md Accumulated Context

### Compound `To/Towards` + `n/a` sentinel Direction convention (LOCKED)

Four Direction values ship: `To` (fully instantiates the pattern), `To/Towards` (compound, for the 6 refactorings the table places in BOTH cells -- lossless record of dual placement), `Away` (de-patterning), and `n/a` (sentinel for the 4 table-absent utilities, which target no pattern). Final census: 14 To / 6 To/Towards / 3 Away / 4 n/a = 27. A single shared Direction gloss ships in the kerievsky-catalog README, never per-leaf. Locked by a unanimous 6-member Opus board (3 advisors + 3 adversarial critics, peer-deliberated, no chair); owner-approved.

**Rationale:** `Towards`-alone or `Towards` on a utility falsely implies partial adoption of a (sometimes nonexistent) pattern; the compound preserves the table fact losslessly while staying checker-legal (leading `To` token) and coach-safe (coach keys only on `Away`).
**Source:** 08-REFACTORING-DIRECTIONS.md; 08-05-SUMMARY.md; 08-06-SUMMARY.md

### Ch.4 smell dedup map: 4 unique + 8 overlap (oracle-settled)

Kerievsky's 12 Ch.4 smells resolve to 4 UNIQUE (Conditional Complexity, Indecent Exposure, Combinatorial Explosion, Oddball Solution -> new `Source: Kerievsky` leaves) + 8 OVERLAP (get an additive `Source: both` tag + "also named by Kerievsky" note on the existing Fowler leaf, recognize-by cues unchanged). Settled against `.oracle/` Ch.4 at 95-98 confidence, not blind from research.

**Rationale:** Overlap can only be settled against the source; folding additively (tag + note) preserves the LOCKED navigation-only index shape that Phase 9's routing consumes.
**Source:** 08-06-SUMMARY.md; 08-VERIFICATION.md (Truth 4)

### INLINE main-context clean-room orchestration (D-08)

The content-authoring loop (author -> deterministic check -> oracle gate -> revise -> escalate) runs INLINE in the main context, NOT via `gsd-executor`, with no worktrees and `branching_strategy=none`. `gsd-executor` has neither the `Agent` tool (to spawn `oracle`/`oracle-reviewer`) nor `AskUserQuestion` (owner escalation), so only the main context can drive the loop.

**Rationale:** Spawning gsd-executor for these plans fails structurally -- it is how Phase 7 first failed; the constraint is encoded up front so execution cannot repeat that failure.
**Source:** 08-CONTEXT.md (D-08); .continue-here.md (BLOCKING CONSTRAINTS); 08-SECURITY.md (T-08-05)

### Clean-room firewall: the main context never reads `.oracle/` prose (D-07)

Copyrighted Kerievsky expression is reached ONLY through the isolated `oracle`/`oracle-reviewer` subagents, whose verdicts carry no source prose, code, headings, or paths (functional names allowed). The main context uses `ls`/`wc` for names/sizes only. This satisfies DST-04 for a world-readable public repo.

**Rationale:** Any book prose read into the main context could leak into a committed, world-readable file; the firewall keeps the only crossing point inside agents that return own-words verdicts.
**Source:** 08-CONTEXT.md (D-07); 08-SECURITY.md (Trust Boundaries, T-08-05); .continue-here.md

### Run the deterministic layer BEFORE spending oracle-reviewer calls (D-07)

Every authoring batch runs the cheap deterministic checks first (tsc-extract, contract/field presence, hygiene, cross-ref resolution) and only spends an `oracle-reviewer` call once that layer is green. Feedback latency stays under ~90s; the reviewer round is the costly step, sub-batched at ~6-8 leaves and capped at ~3 rounds.

**Rationale:** The oracle-reviewer call is the expensive resource; format/compile/link breaks are caught for free by deterministic checks, so reviewer calls are reserved for semantic fidelity.
**Source:** 08-CONTEXT.md (D-07); 08-VALIDATION.md (Sampling Rate); 08-02..08-06 PLAN.md

### GoF cross-references are vocabulary name only (D-04)

Each leaf names its target GoF pattern (Composite, Visitor, Strategy, ...) with at most a parenthetical clarifier ("non-GoF", "Kerievsky's own"); no GoF prose or code is reproduced. GoF is NOT in `.oracle/`, so the target pattern is oracle-gated against the Kerievsky source (which states it), and AskUserQuestion is the fallback ONLY for a pattern target the Kerievsky oracle cannot settle -- not for pattern names generally.

**Rationale:** Pattern names are common-knowledge vocabulary, not copyrightable expression; name-only satisfies KRV-04 as written and keeps `check-hygiene` no-verbatim clean.
**Source:** 08-CONTEXT.md (D-04); 08-ORACLE-MODEL.md (target-pattern sourcing); 08-VERIFICATION.md (Truth 5)

### Per-refactoring leaves behind a thin chapter-grouped index (D-01)

The Kerievsky layer is authored as 27 per-refactoring leaf files behind the existing thin `kerievsky-catalog/README.md`, grouped by Kerievsky's own six book chapters (Creation / Simplification / Generalization / Protection / Accumulation / Utilities). Rejected alternatives: split by direction (direction is a per-leaf field, and a refactoring can go more than one way) and split by GoF family (fragments the catalog, diverges from the book).

**Rationale:** Mirrors the LOCKED Fowler leaf/index model for progressive disclosure; the book already partitions the 27 this way, making it the authoritative Fowler-consistent grouping.
**Source:** 08-CONTEXT.md (D-01); 08-VERIFICATION.md (Required Artifacts)

### Retargeted spirit/judgment axis with strict ownership seams

For pattern-directed leaves the base spirit axis is REPLACED: `spirit/judgment` scores ONE thing exclusively -- whether the leaf carries a pattern-specific over-application counterweight (for To/Towards, a guard against applying the pattern speculatively; for Away, why the pattern was premature). `applicability` is BARRED from scoring that same guard (it scores only the OTHER source caveats); `motivation` owns the reasons; `direction` owns the label. A separate mechanics-vs-composed-primitive split avoids double-scoring one root cause.

**Rationale:** A pilot A/B/C gate showed spirit is the ONLY axis that separates a silent omission (partial) from an apply-always over-claim (wrong); without the seams, spirit and applicability double-scored the same over-engineering caveat.
**Source:** 08-ORACLE-MODEL.md (Locked anchors, Pilot findings); .continue-here.md (decisions_made)

## Lessons

### The oracle corrected the provisional dedup map (2 reclassifications)

The plan's PROVISIONAL Ch.4 map was wrong on two smells, corrected against the source during the loop: Conditional Complexity stayed UNIQUE (broader than Repeated Switches -- it is the accretion of variant-selection + optional-behavior + state-transition branching, not just switch duplication), and Solution Sprawl was reclassified OVERLAP -> Shotgun Surgery (the book explicitly equates them), so NO solution-sprawl leaf was authored. Net new unique leaves = 4, not the provisional 4-5.

**Context:** D-05 deliberately deferred the exact dedup map to the oracle-gated loop rather than deciding it blind at discuss time; this is that deferral paying off.
**Source:** 08-06-SUMMARY.md (Deviations from Plan; dedup map)

### Oracle chapter-prose can mislead on Direction -- the table outranks it

The oracle's chapter-prose read of Move Accumulation to Visitor said "Towards Visitor," which nearly drove a wrong flip away from D-03's locked `Away`. The Refactoring Directions table lists it under BOTH Visitor (To/Towards) AND Iterator (Away), vindicating the `Away`-from-Iterator framing. The prose frames only the adopted pattern and is blind to a refactoring's relationship to a different pattern.

**Context:** This single conflict is what escalated to the owner, produced the authoritative Directions table, and locked the "table outranks prose" convention for the whole phase.
**Source:** 08-05-SUMMARY.md (Decisions Made; Owner Escalations); 08-REFACTORING-DIRECTIONS.md

### Composed-primitive fields need a 1st-ed -> 2nd-ed name mapping passed to the reviewer

Kerievsky cites 1st-edition Fowler primitive names; the shipped catalog is 2nd-edition. The mapping (Extract Method -> Extract Function, Move Method -> Move Function, Inline Method -> Inline Function; "Extract Interface" has no 2nd-ed leaf -> express via Change Function Declaration or Extract Superclass) must be passed to `oracle-reviewer` explicitly, or it false-flags composed-primitive fields for citing "non-existent" 1st-ed-named leaves. This was the dominant R1 defect across Ch.8.

**Context:** Discovered in 08-04 and carried forward as a reusable provenance constraint; without it the reviewer demands vocabulary that does not exist in the target catalog.
**Source:** 08-04-SUMMARY.md (Decisions Made; Issues Encountered); 08-05-SUMMARY.md; .continue-here.md

### oracle/oracle-reviewer silently truncate long `.oracle/` chapters (Read ~25K-token cap)

Mid-phase, the `oracle`/`oracle-reviewer` agents were found to silently drop the tail of long chapters (Ch.7 ~40K, Ch.8 ~39K tokens exceed the Read tool's ~25K cap), yielding false source-only or missed-drop verdicts. Both agent contracts were fixed to ALWAYS chunk-read to EOF (advance by actual lines returned, stop on zero lines), agent-reviewed (firewall SAFE + correctness PASS after a first token-vs-line-cap fix), committed, and reloaded live.

**Context:** A behavioral defect in a load-bearing gate that produces no error -- it just returns a confident wrong verdict on a truncated read; big-chapter verdicts still warrant an incomplete-read sanity check.
**Source:** 08-02-SUMMARY.md (Deviation); .continue-here.md (Critical Anti-Patterns, Infrastructure State)

### oracle-reviewer oscillates on already-converged leaves under a fresh adversarial re-pass

A fresh reviewer pass re-flagged `mechanics` and `composed-primitive` as `partial` on leaves that had already converged to `pass`, with directives partly CONTRADICTING those leaves' own R2 verdicts (run-to-run variance / adversarial oscillation on the composed-primitive axis). The rule: do NOT reopen committed, converged leaves on a lone re-flag; honor the round cap and the converged verdict, and re-gate ONLY a changed axis (as the spirit-only re-gate of the 12 shipped leaves did).

**Context:** Exactly the driver-responsibility hazard 07-ORACLE-MODEL warned about; treating a lone re-flag as signal would have re-churned converged, committed content indefinitely.
**Source:** 08-ORACLE-MODEL.md (Pilot findings, Operational caution); .continue-here.md (Critical Anti-Patterns)

### A GSD phase-close auditor introduced em dashes that needed ASCII normalization

During phase close, a GSD auditor's generated artifact contained non-ASCII em dashes, which had to be normalized to ASCII (`--`) to satisfy the repo's ASCII-only constraint (the same constraint `check-hygiene` hard-fails on for shipped files).

**Context:** Even GSD's own auditor agents can emit non-ASCII punctuation; generated phase-close artifacts must be re-scanned for ASCII compliance, not assumed clean.
**Source:** Phase-close orchestration (this session; extract-learnings task brief)

### The nyquist auditor can die mid-run on an org spend-limit API error; retry after reset

During validate-phase, the `gsd-nyquist-auditor` terminated once on an organization spend-limit API error mid-run. It was successfully retried after the limit reset, and validate-phase completed (nyquist_compliant: true).

**Context:** An external billing/quota fault -- not a content or logic failure -- can abort an auditor; the recovery is simply to re-run after reset rather than diagnose the phase work.
**Source:** Phase-close orchestration (this session; extract-learnings task brief)

## Patterns

### Clean-room loop: author-blind -> deterministic-first -> oracle-reviewer gate -> revise-blind -> converge

Per chapter: author leaves BLIND from public knowledge (never `.oracle/`) in the LOCKED Fowler-leaf format + the 3 Kerievsky fields; run the deterministic layer FIRST; gate the batch in one `oracle-reviewer` call with a tight per-leaf scope + the per-axis anchors; revise BLIND from the directives; converge to all-pass within a ~3-round cap; escalate only non-convergence / unresolvable target-pattern to the owner. Converges in ~2 rounds in practice.

**When to use:** Authoring public content that must be faithful to a copyrighted source without reproducing its expression -- the firewall + own-words-verdict gate lets you converge on fidelity while never crossing the IP boundary.
**Source:** 08-CONTEXT.md (D-07, Established Patterns); 08-ORACLE-MODEL.md (How the driver packages the call); 08-02..08-06 SUMMARYs

### Source-tagged unified smell taxonomy

Smells fold into one taxonomy with a three-value tag convention: untagged = Fowler (default, keeps the pre-fold 24 leaves green), `[both]` / `Source: both` = an overlap smell folded ONTO the existing Fowler leaf (additive tag + "also named by Kerievsky" note, recognize-by cues unchanged), and `[Kerievsky]` / `Source: Kerievsky` = a Ch.4-unique new leaf. `check-smells` derives the Kerievsky set from the tags (not a hardcoded name list) and enforces dedup + candidate-link resolution.

**When to use:** Merging a second author's catalog into an existing one without rewriting the first author's entries or breaking downstream routing that keyed on the original shape.
**Source:** 08-01-SUMMARY.md (patterns-established); 08-06-SUMMARY.md (patterns-established); 08-VERIFICATION.md (Truth 4)

### Within-pass fidelity refinement + single-axis re-gate

When the reviewer flags a nuance within an otherwise-passing draft, fix it blind and re-gate ONLY the affected axis rather than reopening all axes. Examples: Oddball Solution took a within-pass refinement ("determine the preferred solution first -- occasionally the oddball is the better design to keep") and was re-gated on the candidate axis only (R1 -> R2 pass); all 12 Ch.6-7 leaves were re-gated on the retargeted spirit axis ALONE after the axis was locked (12/12 correct after one blind Command fix).

**When to use:** After an axis definition changes, or when a single flagged nuance lands on converged content -- re-scoring the untouched axes only invites the documented oscillation.
**Source:** 08-06-SUMMARY.md (Per-leaf oracle-reviewer round counts); 08-ORACLE-MODEL.md (re-gate record); .continue-here.md

### Checker allow-list widen is the sole authorized post-wave-1 checker edit

After the wave-1 harness lands, the only checker `.mjs` change permitted downstream is a data/allow-list widen on the normal verify path (checker edits are exempt from the agent-review rule that governs agent/skill instruction files). At the phase gate, `check-kerievsky`'s Direction allow-list was widened by the `n/a` token only -- a pure data edit, no logic change.

**When to use:** Keep instruments stable through the authoring waves; when the content convention shifts (a new Direction value), widen the allow-list rather than rewriting checker logic.
**Source:** 08-06-SUMMARY.md (Deviations from Plan); .continue-here.md (next_action, decisions_made)

### README thin-index Use-when mirror

The catalog index stays thin: each of the 27 rows links `(<slug>.md)` (no anchor) and mirrors the leaf's `Use when:` line verbatim, plus Direction + GoF annotations and the single shared Direction gloss. `check-kerievsky` asserts the row-to-leaf Use-when mirror for all 27, so the index cannot drift from the leaves.

**When to use:** A navigable index over many leaves where the index must never inline leaf content but must stay in lockstep with each leaf's trigger line.
**Source:** 08-01-SUMMARY.md (Next Phase Readiness); 08-VERIFICATION.md (Truth 1, Key Link Verification)

### Overflow walkthrough for pattern-heavy leaves (D-06 YAGNI)

When a refactoring's teaching lives in its intermediate states and the compact before/after (2 examples, 5-15 lines/side) loses that lesson, push an evolving `<slug>-walkthrough.md` loaded only in explain-in-depth mode; the leaf keeps its compact example. Authored only when the compact example genuinely loses the teaching -- exercised for exactly 3 of 27 leaves (State, Interpreter, Move Accumulation to Visitor). The `oracle-reviewer` `example` axis flags `partial` to trigger it.

**When to use:** A compact example is the default; add a walkthrough only when a reviewer confirms the compact form drops the lesson -- not preemptively.
**Source:** 08-CONTEXT.md (D-06); 08-03-SUMMARY.md; 08-04-SUMMARY.md; 08-ORACLE-MODEL.md (example/walkthrough clause)

### Per-catalog namespaced sample filenames prevent silent slug collisions

`extract-samples.mjs` was extended to walk BOTH catalogs and emit sample module files namespaced by catalog prefix (`fowler-<slug>-<n>.ts`, `kerievsky-<slug>-<n>.ts`), so a Kerievsky slug that happens to match a Fowler slug cannot silently overwrite the other catalog's compiled sample (a false-green).

**When to use:** Any time two content trees with independent slug namespaces feed one shared extraction/compile output directory.
**Source:** 08-01-SUMMARY.md (Files Created/Modified; Decisions Made)

## Surprises

### Compound `To/Towards` was already checker-legal -- only `n/a` needed adding

Widening `check-kerievsky`'s Direction allow-list for the new convention turned out to need only ONE new token: `n/a`. The compound `To/Towards` value already validated (and routed as `To`) via the checker's existing leading-token match, so no checker change was required for it.

**Impact:** The convention change that looked like it needed a two-value enum widen was a one-token data edit; the leading-token design absorbed the compound value for free.
**Source:** 08-06-SUMMARY.md (Direction reconciliation); 08-REFACTORING-DIRECTIONS.md; .continue-here.md

### All 27 authored H1 slugs already matched the checker NAMES array

The planned `check-kerievsky` NAMES reconciliation step was a NO-OP: every one of the 27 authored leaf H1 slugs already matched its canonical name, so no wave-2 oracle name/slug correction was ever needed (each chapter's SUMMARY confirmed "no oracle name/slug corrections").

**Impact:** The name-identity contract held across all 6 chapters on the first author-blind pass, retiring an anticipated phase-gate reconciliation task entirely.
**Source:** 08-06-SUMMARY.md (key-decisions); 08-02-SUMMARY.md; 08-03-SUMMARY.md; 08-04-SUMMARY.md

### Exactly one owner escalation across the entire phase -- and it produced the Directions convention

Five of the six plans' owner-escalation checkpoints (08-02, 08-03, 08-04, 08-06) were no-ops; a single escalation fired in 08-05 (the Move Accumulation to Visitor direction conflict). Rather than a cost, that one escalation is what surfaced the owner-provided Refactoring Directions table and locked the authoritative Direction convention for all 27 leaves. Zero leaves ever shipped `blocked`.

**Impact:** A near-escalation-free phase where the lone escalation was net-positive -- it upgraded a per-leaf disagreement into a phase-wide authoritative convention.
**Source:** 08-05-SUMMARY.md (Owner Escalations); 08-02..08-04, 08-06 SUMMARYs (Task 2/3 no-op)

### The nyquist auditor was interrupted mid-close by an org spend-limit fault

Phase close did not run clean end-to-end: the `gsd-nyquist-auditor` hit an organization spend-limit API error mid-run and terminated, an external billing fault unrelated to the phase content. It was retried after the limit reset and validate-phase then completed (nyquist_compliant: true).

**Impact:** A quota/billing fault -- not a work defect -- can abort a phase-close auditor; the fix is a plain re-run after reset, so such interruptions should not be mistaken for validation failures.
**Source:** Phase-close orchestration (this session; extract-learnings task brief)
