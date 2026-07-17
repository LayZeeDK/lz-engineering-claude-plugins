---
phase: 07-fowler-catalog-refactoring-2nd-ed
plan: 10
subsystem: skill-authoring
tags: [fowler-catalog, smells, taxonomy, clean-room-oracle, catalog-index, phase-gate]

requires:
  - phase: 07-02
    provides: LOCKED 62/per-leaf/smell-leaf harness + calibrated clean-room loop + 62 name->slug map + rubric anchors
  - phase: 07-04..07-09
    provides: all 62 catalog leaves (Ch.6-12) so smell candidate cross-links + README index rows resolve
provides:
  - the 24 Fowler Ch.3 bad-smell leaves (references/smells/<slug>.md), oracle-converged, each with the smell->refactoring candidate map + discriminators (FWL-02)
  - the navigation-only recognize-by smell index references/smells.md (24 smells, resolving leaf links, no candidates)
  - the finalized chapter-grouped fowler-catalog/README.md (all 62 rows, Ch.6-12, mirrored Use-when + resolving links) (FWL-01)
  - the GREEN full deterministic battery (the phase gate) closing FWL-01/FWL-02/FWL-04
affects: [08-kerievsky-catalog, 09-coach-behavior-principles]

tech-stack:
  added: []
  patterns:
    - "Smell leaf: # <Smell> + Recognize by: + ## How to recognize (confirm, separate near-neighbors) + ## Why it's a problem + ## Candidate refactorings (resolving fowler-catalog link + 'pick when <discriminator>')"
    - "Smell index is navigation-only (recognize-by + link, NO candidates) so it cannot shortcut the confirm-via-leaf step"
    - "Catalog README rows mirror each leaf's Use-when verbatim; deterministic generator reads only public leaves (never .oracle/)"

key-files:
  created:
    - plugins/lz-tdd/skills/lz-refactor/references/smells/*.md (24 smell leaves)
  modified:
    - plugins/lz-tdd/skills/lz-refactor/references/smells.md (navigation-only index; replaced Phase-6 stub)
    - plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/README.md (finalized Ch.7-12 rows)

key-decisions:
  - "Smell-leaf candidate links target each catalog leaf's H1 anchor (#<slug>) so every candidate resolves at check-smells + check-crossrefs."
  - "smells.md carries NO candidate refactorings (deliberate) -- forces the coach to open the leaf to confirm the match and read the map; no Kerievsky rows (Phase-8 fold)."
  - "README + smells.md generated deterministically from the authored public leaves (mirror-exact Use-when), never from .oracle/."

patterns-established:
  - "Clean-room smell-leaf loop: author BLIND -> oracle-reviewer gate (CONTENT_TYPE smell-leaf; axes candidates/recognition/motivation/applicability/spirit) -> revise BLIND -> converge; main context never reads .oracle/."

requirements-completed: [FWL-01, FWL-02, FWL-04]

duration: ~1 session (oracle gate spanned a usage-limit reset)
completed: 2026-07-05
---

# Phase 7 / Plan 10: Smell taxonomy + catalog-index finalization (phase gate)

**The 24 Fowler Ch.3 bad-smell leaves authored as oracle-converged smell->refactoring maps, a navigation-only recognize-by smell index, and the finalized 62-row catalog README -- turning the FULL deterministic battery GREEN (the Phase-7 gate: FWL-01/FWL-02/FWL-04).**

## Performance

- **Duration:** ~1 working session (the oracle gate spanned a usage-limit reset, then resumed at Round 2)
- **Completed:** 2026-07-05
- **Tasks:** 2 executed + Task 3 (owner escalation) a no-op (nothing failed to converge / blocked)
- **Files modified/created:** 26 (24 smell leaves + smells.md + fowler-catalog/README.md)

## Accomplishments

- Authored the 24 Fowler bad-smell leaves via the clean-room oracle loop; every leaf carries a `Recognize by:` selector, a `## How to recognize` that separates near-neighbors, a `## Why it's a problem`, and a `## Candidate refactorings` section (the FWL-02 smell->refactoring map) whose links resolve to real catalog leaves with per-candidate discriminators.
- Replaced the Phase-6 `smells.md` stub with a NAVIGATION-only recognize-by index (24 smells, resolving leaf links, deliberately no candidates); real Fowler Ch.3 attribution; no Kerievsky rows.
- Finalized `fowler-catalog/README.md`: all 62 refactorings grouped under Ch.6-12, each row = name + 1st-ed alias(es) + the leaf's `Use when:` mirrored verbatim + a resolving link. SKILL.md untouched.
- Closed the phase gate: the FULL battery is GREEN and `claude plugin validate .` passes.

## Task Commits

1. **Task 1: author the 24 bad-smell leaves via the clean-room loop** - `77572bf` (feat)
2. **Task 2: navigation-only smell index + finalize catalog README + full battery** - `5341121` (feat)

_Task 3 (owner escalation) did not fire -- all 24 leaves reached oracle-reviewer `pass`._

## Clean-room oracle loop result (24/24 converged over 2 rounds)

Gated in 3 batches of 8 (Round 1) then 2 batches of 6 (the revised subset, Round 2), CONTENT_TYPE `smell-leaf`, per-axis anchors candidates/recognition/motivation/applicability/spirit.

- **Round 1:** 12 pass / 12 revise / 0 blocked / 0 error / 0 too_close_to_source.
- **Round 2 (12 revised leaves re-gated):** 12 pass. Convergence at 24/24.
- **0 owner escalations.** Firewall held: authored + revised BLIND; only the `oracle-reviewer` subagents read `.oracle/`.

**The 12 revise directives applied (blind):**

| Leaf | Axis | Correction |
|------|------|------------|
| long-function | candidates | added Replace Conditional with Polymorphism (repeated switching on one condition) |
| global-data | applicability | added caveat: small / provably-immutable global data is tolerable |
| mutable-data | candidates + applicability | added Combine Functions into Class/Transform (limit updating code); added narrow-scope caveat |
| shotgun-surgery | candidates | added Split Phase (combine output for a consuming phase) + Inline Class |
| feature-envy | applicability | added caveat: sometimes intentional (patterns); site multi-module fn with its dominant data |
| loops | candidates | dropped Extract Function (source pairs the smell solely with Replace Loop with Pipeline) |
| speculative-generality | candidates | Remove Dead Code discriminator: element used only by its tests -> delete the tests first |
| message-chains | applicability | added moderation: not every chain needs fixing; weigh before hiding the delegate |
| middle-man | candidates | retied both delegate-refactoring discriminators to keeping/extending behavior, not inheritance origin |
| large-class | motivation | foregrounded duplicated code as the key consequence |
| data-class | candidates + applicability | dropped Encapsulate Collection; moved Split Phase into the acceptable-exception caveat (immutable intermediate result) |
| refused-bequest | motivation + spirit | reframed as a usually-mild judgment call; sharp harm is refusing the interface |

## Confirmed 24-smell set

Mysterious Name, Duplicated Code, Long Function, Long Parameter List, Global Data, Mutable Data, Divergent Change, Shotgun Surgery, Feature Envy, Data Clumps, Primitive Obsession, Repeated Switches, Loops, Lazy Element, Speculative Generality, Temporary Field, Message Chains, Middle Man, Insider Trading, Large Class, Alternative Classes with Different Interfaces, Data Class, Refused Bequest, Comments. (All accepted in-scope by `oracle-reviewer` against the Ch.3 source; none returned a topic-mismatch error.)

## Final full-battery result (the phase gate)

| Checker | Result |
|---------|--------|
| extract-samples (tsc --strict --noEmit) | GREEN -- 124 modules clean, 0 skipped (FWL-04) |
| check-catalog | GREEN -- 62/62 + index-row Use-when mirror (FWL-01) |
| check-smells | GREEN -- 24/24 leaves + navigation index (FWL-02) |
| check-crossrefs | GREEN -- 291 links resolve, 20 inverse pairs mutual, no self-refs |
| check-principles | GREEN -- 8/8 Ch.2 topics (FWL-03, already closed at 07-03) |
| check-hygiene | GREEN -- ASCII + work-email allowlist clean over 92 files |
| `claude plugin validate .` | PASS |

## Decisions Made

- Candidate cross-links use each catalog leaf's H1 anchor (`../fowler-catalog/<slug>.md#<slug>`) -- always present, always resolving.
- `smells.md` stays candidate-free by design; the map lives only in the leaves (confirm-via-leaf).
- Regenerated the whole README (Ch.6-12) from the leaves for one uniform, mirror-exact format rather than hand-adding Ch.7-12 rows.

## Deviations from Plan

None - plan executed as written. Task 3 (conditional owner escalation) was a no-op because every leaf converged to `pass` within the round cap.

## Issues Encountered

- The oracle gate (Round 1) spanned a usage-limit reset. All three Round-1 `oracle-reviewer` batches had already returned complete per-draft verdicts (24/24) before the pause, so resumption applied the 12 revise directives and re-gated the revised subset (Round 2) rather than re-running Round 1 -- no verdicts were lost or re-derived.

## Next Phase Readiness

- Phase 7 content is complete: 62 catalog leaves + 24 smell leaves + both indexes + principles, all oracle-converged and battery-green. The taxonomy is shaped for the Phase-8 Kerievsky fold (new `smells/<slug>.md` leaves + source-tagged rows; Kerievsky refactorings cross-map to these catalog leaves) and for the Phase-9 coach routing (recognize-by -> smell leaf -> candidate refactoring leaf).
- Phase-close sequence remaining: verify_phase_goal (gsd-verifier) -> secure-phase -> validate-phase -> extract-learnings.

---
*Phase: 07-fowler-catalog-refactoring-2nd-ed*
*Completed: 2026-07-05*
