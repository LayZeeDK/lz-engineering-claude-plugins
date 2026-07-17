---
phase: 07-fowler-catalog-refactoring-2nd-ed
plan: 02
subsystem: skill-authoring
tags: [fowler-catalog, refactoring, clean-room-oracle, typescript, pilot, harness]

requires:
  - phase: 07-01
    provides: NON-shipped compile harness + FWL checker battery (extract-samples, check-catalog/smells/principles/hygiene)
provides:
  - LOCKED 62-scope / per-refactoring-leaf / smell-leaf harness (check-catalog, check-smells, new check-crossrefs)
  - the 11 Ch.6 basic-set catalog leaves (oracle-converged, tsc --strict clean)
  - the thin chapter-grouped fowler-catalog/README.md index (Ch.6 rows filled; Ch.7-12 headings stubbed)
  - the canonical 62 name->slug map (cross-link-target contract for waves 3-4 + 07-10)
  - a calibrated clean-room author -> oracle-reviewer-gate -> converge loop (rubric anchors + round counts)
affects: [07-04, 07-05, 07-06, 07-07, 07-08, 07-09, 07-10]

tech-stack:
  added: []
  patterns:
    - "Per-refactoring leaf: # Name + 1st-ed aliases + Use when: + ## Motivation + ## Mechanics + ## Example (tsc --strict) + optional ## Watch for"
    - "Clean-room oracle loop: author blind -> oracle-reviewer gate (per-axis anchors) -> revise blind -> converge; main context never reads .oracle/"
    - "Distinct example domains/identifiers (never the source's) to stay clear of the too_close_to_source gate"

key-files:
  created:
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/*.md (11 Ch.6 leaves)
    - .claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs
  modified:
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/README.md
    - .claude/skills/lz-refactor-workspace/tools/check-catalog.mjs
    - .claude/skills/lz-refactor-workspace/tools/check-smells.mjs
    - .claude/skills/lz-refactor-workspace/package.json

key-decisions:
  - "Owner (2026-07-05): DROP [web-example] for Split Phase -- it is a normal in-book Ch.6 refactoring; reverses that one line of the scope-correction. Return Modified Value [web-only] is now the sole provenance marker."
  - "check-crossrefs is a 07-10 phase-gate, not a per-wave gate (forward-links to later-chapter leaves are RED-by-design before 07-10)."

patterns-established:
  - "Oracle-reviewer batched over multiple DRAFT_PATHS with SOURCE=index.md+chapter/topic, CONTENT_TYPE=refactoring-leaf, + the canonical per-axis anchors."
  - "Deterministic layer (tsc + contract + hygiene) is validated BEFORE spending oracle-reviewer calls."

requirements-completed: []  # FWL-01/FWL-04 advanced (Ch.6 slice, 11/62); they CLOSE phase-wide at 07-10 when the full battery goes green.

duration: ~90min
completed: 2026-07-05
---

# Phase 7 / Plan 02: Basic-chapter pilot + 62-scope harness overhaul

**The 11 Ch.6 "first set" refactorings authored as oracle-converged per-refactoring leaves (tsc --strict clean), on a harness rebuilt to the LOCKED 62 / per-leaf / smell-leaf model, with the clean-room author->gate->converge loop calibrated for the wave-3 fan-out.**

## Performance

- **Duration:** ~90 min (incl. 3 oracle-review rounds + 1 owner escalation)
- **Tasks:** 3 (Task 3 fired once)
- **Files modified/created:** 15 (11 leaves + README + 3 harness files)

## Accomplishments

- Rebuilt the FWL harness from the superseded 66/tag-group/smell-table model to the LOCKED 62/per-leaf/smell-leaf model; added `check-crossrefs.mjs` (07-10 phase-gate).
- Authored + oracle-converged the 11 Ch.6 basic-set leaves; every extracted before/after example is `tsc --strict --noEmit` clean and behavior-preserving per the reviewer's example axis.
- Scaffolded the thin chapter-grouped README index (Ch.6 rows mirror each leaf's `Use when:`).
- Calibrated the clean-room loop and recorded its working rubric anchors + per-leaf round counts.

## Task Commits

1. **Task 1: harness overhaul (62/per-leaf/smell-leaf)** - `60ff93c` (test)
2. **Task 2 + Task 3: author Ch.6 leaves via the clean-room loop + owner escalation** - `9ccce17` (feat)

## Clean-room loop calibration (the pilot deliverable)

**Loop:** author BLIND (public knowledge + `.planning/research/refactoring-com-overview.md`) -> gate via `oracle-reviewer` (batched DRAFT_PATHS; SOURCE = `.oracle/refactoring-2e/index.md` + chapter/topic; CONTENT_TYPE `refactoring-leaf`; canonical per-axis anchors) -> revise BLIND from directives -> converge. Main/executor context never opened `.oracle/` (`ls` for names only). No `too_close_to_source`, no `blocked`, no `error` across all rounds.

**Rubric anchors that worked (pass verbatim to wave-3 `oracle-reviewer` calls):**
- mechanics -- correct: all steps, safe order, faithful branches + safety checkpoints. partial: a branch drifted or a checkpoint folded (still safe). wrong: a step/branch/checkpoint dropped, unsafe order, or a misstated step.
- motivation -- correct: key reasons + emphasis, none invented. partial: emphasis off or a secondary reason missing. wrong: a primary reason missing/misstated/invented.
- example -- correct: compiles, behavior-preserving, representative, honors preconditions, independent of the source. partial: compiles + behavior-preserving but atypical. wrong: changes behavior / wrong refactoring / violates preconditions / mirrors the source.
- applicability -- correct: source caveats represented, none invented. partial: a caveat missing/off. wrong: a load-bearing caveat missing or an invented limit.
- spirit -- correct: framing/emphasis match. partial: substance right, framing off. wrong: misframes character/intent.

**Per-leaf round counts (11/11 pass):**

| Leaf | Rounds | Notes |
|------|--------|-------|
| Extract Function | 1 | pass R1 (validated exemplar) |
| Extract Variable | 1 | pass R1 |
| Inline Variable | 1 | pass R1 |
| Encapsulate Variable | 1 | pass R1 |
| Combine Functions into Class | 1 | pass R1 |
| Combine Functions into Transform | 1 | pass R1 |
| Inline Function | 2 | R1 revise: add complexity caveat (recursion/multi-return/no-accessors argue against, not only polymorphism) |
| Change Function Declaration | 2 | R1 revise: restore remove-param precheck; do rename vs signature-change as separate steps; broaden migration triggers |
| Rename Variable | 2 | R1 revise: add read-only/constant copy-then-migrate technique |
| Introduce Parameter Object | 2 | R1 revise: add "consistent element names" benefit; restore per-step test checkpoints |
| Split Phase | 3 | R1 revise: step-5 selector (params first phase USES, not only produces); R2 revise: [web-example] provenance addition; R3 pass after owner drop |

**Round tally:** R1 = 6 pass / 5 revise; R2 = 4 pass / 1 revise; R3 = 1 pass. Every `revise` was a substantive dropped-step/branch/caveat fix -- the loop caught real omissions while holding the firewall (proves the D-07 gate is live, mechanized).

**Wave-3 guidance:** big chapters (07-08/07-09, ~11 leaves) should sub-batch the review (6+5 worked well here; ~2 parallel `oracle-reviewer` calls per chapter). Validate the deterministic layer (tsc + contract + hygiene) BEFORE spending review calls -- it caught a `console` (no DOM lib) compile break and a missing `## Example` cheaply.

## Owner escalation (Task 3, fired once)

**Split Phase [web-example] provenance.** The `oracle-reviewer` (reading the source) reported Split Phase is a normal in-book Ch.6 refactoring with its own worked example, contradicting the leaf's "worked examples appear online-only" note. The `[web-example]` marker was owner-locked in the scope-correction. Escalated via AskUserQuestion. **Owner decision: DROP [web-example] for Split Phase.** Applied: removed the leaf marker + note, emptied `check-catalog` `WEB_EXAMPLE`, dropped the `[web-example]` README legend entry. Split Phase then converged `pass` (R3). Return Modified Value `[web-only]` remains the sole provenance marker.

## Confirmed Ch.6 membership (11)

Extract Function, Inline Function, Extract Variable, Inline Variable, Change Function Declaration, Encapsulate Variable, Rename Variable, Introduce Parameter Object, Combine Functions into Class, Combine Functions into Transform, Split Phase. (All 11 accepted in-scope by `oracle-reviewer` against the Ch.6 source; none returned a topic-mismatch error.)

## Canonical 62 name -> slug map (cross-link-target contract)

Every leaf file is `fowler-catalog/<slug>.md`; `<slug>` = kebab-case of the canonical name. Waves 3-4 + 07-10 MUST use these exact slugs so inverse-of / see-also / candidate cross-links resolve at the 07-10 `check-crossrefs` gate. (Flat list; membership/slug are public facts from `refactoring-com-overview.md` -- no book compilation reproduced.)

- Change Function Declaration -> `change-function-declaration`
- Change Reference to Value -> `change-reference-to-value`
- Change Value to Reference -> `change-value-to-reference`
- Collapse Hierarchy -> `collapse-hierarchy`
- Combine Functions into Class -> `combine-functions-into-class`
- Combine Functions into Transform -> `combine-functions-into-transform`
- Consolidate Conditional Expression -> `consolidate-conditional-expression`
- Decompose Conditional -> `decompose-conditional`
- Encapsulate Collection -> `encapsulate-collection`
- Encapsulate Record -> `encapsulate-record`
- Encapsulate Variable -> `encapsulate-variable`
- Extract Class -> `extract-class`
- Extract Function -> `extract-function`
- Extract Superclass -> `extract-superclass`
- Extract Variable -> `extract-variable`
- Hide Delegate -> `hide-delegate`
- Inline Class -> `inline-class`
- Inline Function -> `inline-function`
- Inline Variable -> `inline-variable`
- Introduce Assertion -> `introduce-assertion`
- Introduce Parameter Object -> `introduce-parameter-object`
- Introduce Special Case -> `introduce-special-case`
- Move Field -> `move-field`
- Move Function -> `move-function`
- Move Statements into Function -> `move-statements-into-function`
- Move Statements to Callers -> `move-statements-to-callers`
- Parameterize Function -> `parameterize-function`
- Preserve Whole Object -> `preserve-whole-object`
- Pull Up Constructor Body -> `pull-up-constructor-body`
- Pull Up Field -> `pull-up-field`
- Pull Up Method -> `pull-up-method`
- Push Down Field -> `push-down-field`
- Push Down Method -> `push-down-method`
- Remove Dead Code -> `remove-dead-code`
- Remove Flag Argument -> `remove-flag-argument`
- Remove Middle Man -> `remove-middle-man`
- Remove Setting Method -> `remove-setting-method`
- Remove Subclass -> `remove-subclass`
- Rename Field -> `rename-field`
- Rename Variable -> `rename-variable`
- Replace Command with Function -> `replace-command-with-function`
- Replace Conditional with Polymorphism -> `replace-conditional-with-polymorphism`
- Replace Constructor with Factory Function -> `replace-constructor-with-factory-function`
- Replace Derived Variable with Query -> `replace-derived-variable-with-query`
- Replace Function with Command -> `replace-function-with-command`
- Replace Inline Code with Function Call -> `replace-inline-code-with-function-call`
- Replace Loop with Pipeline -> `replace-loop-with-pipeline`
- Replace Nested Conditional with Guard Clauses -> `replace-nested-conditional-with-guard-clauses`
- Replace Parameter with Query -> `replace-parameter-with-query`
- Replace Primitive with Object -> `replace-primitive-with-object`
- Replace Query with Parameter -> `replace-query-with-parameter`
- Replace Subclass with Delegate -> `replace-subclass-with-delegate`
- Replace Superclass with Delegate -> `replace-superclass-with-delegate`
- Replace Temp with Query -> `replace-temp-with-query`
- Replace Type Code with Subclasses -> `replace-type-code-with-subclasses`
- Return Modified Value -> `return-modified-value`  (carries `[web-only]`)
- Separate Query from Modifier -> `separate-query-from-modifier`
- Slide Statements -> `slide-statements`
- Split Loop -> `split-loop`
- Split Phase -> `split-phase`
- Split Variable -> `split-variable`
- Substitute Algorithm -> `substitute-algorithm`

Total: 62.

## Deviations from Plan

**1. [Owner adjudication] Dropped Split Phase `[web-example]`**
- **Found during:** Task 2/3 oracle loop (round 2 reviewer verdict + owner escalation)
- **Issue:** The locked `[web-example]` marker + "online-only examples" note is contradicted by the source (Split Phase is a full in-book Ch.6 refactoring).
- **Fix:** Owner directed DROP. Removed leaf marker/note, emptied `check-catalog` `WEB_EXAMPLE`, removed the README legend entry.
- **Impact:** Reverses one line of the scope-correction. The plan's Task-2 verify assertion `rg "web-example" split-phase.md` is now VOID (superseded); replaced by asserting the marker is ABSENT.
- **Follow-up:** 07-ROUTING-ARCHITECTURE / 07-CONTEXT still describe Split Phase `[web-example]` (now stale); the harness (`WEB_EXAMPLE` empty) enforces the drop regardless, so no wave can re-introduce it.

## Issues Encountered

- **Pre-existing 07-03 gap (NOT 07-02):** `check-principles` is 7/8 RED because the committed `principles.md` never uses the literal token `definition` (the checker's `definition-of-refactoring` topic). 07-03 was authored + oracle-converged but never made harness-green (its SUMMARY is deferred). Needs a one-token, own-framing fix (e.g. label the "What refactoring is" section as the definition) before the 07-10 full-battery gate. Flagged for the pilot checkpoint; out of 07-02 scope.
- tsc `console` break (harness `tsconfig` has no DOM lib) -> made the Extract Function example pure (return values). Missing `## Example` on Change Function Declaration -> added. Both caught by the deterministic layer before the oracle gate.

## Next Wave Readiness

- **Wave 3 (07-04..07-09) is unblocked:** the loop is calibrated, the harness is settled, and the 62 name->slug map + rubric anchors above are the contract to consume (`@`-ref this SUMMARY).
- `check-crossrefs` stays RED until 07-10 (forward-links); do NOT gate waves on it.
- Open before phase close: (a) the 07-03 `check-principles` `definition`-token fix + 07-03 SUMMARY; (b) 07-10 turns the full battery green (62/62 + 24/24 + crossrefs).

---
*Phase: 07-fowler-catalog-refactoring-2nd-ed*
*Completed: 2026-07-05*
