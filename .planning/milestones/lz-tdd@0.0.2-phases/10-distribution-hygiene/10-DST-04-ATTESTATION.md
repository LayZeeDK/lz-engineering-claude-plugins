# DST-04 No-Verbatim Attestation (Phase 10, Plan 10-03)

**Requirement:** DST-04 -- no verbatim Fowler / Kerievsky / GoF prose or code listings in the
shipped `lz-refactor` tree; original prose, code, names, and facts only.

**Scan design (D-01):** three layers.
- **Layer 1 (deterministic, main-context-safe):** the hardened `check-hygiene.mjs` `(c)` gate
  (Plan 10-01). Source-free; blocks long verbatim-looking quoted runs and routes the risk surfaces.
  GREEN over the whole widened target set.
- **Layer 2 (clean-room semantic sweep):** this document, Part 1 below. The read-only
  `oracle-reviewer` subagent is the only reader of `.oracle/`; the main executor context never read
  any `.oracle/` path (only a top-level directory listing of the three book folder names, which are
  facts, not expression).
- **Layer 3 (standing attestation):** this document, Part 2 below. Cites the per-leaf
  `oracle-reviewer` verdicts already recorded in Phases 7, 8, and 8.1 for the leaf surfaces the
  Layer-2 sweep did not re-open.

---

## Part 1 -- Layer-2 clean-room sweep results

**Scope (D-02, D-03):** the two surfaces that empirically collided in prior phases, across every
catalog leaf, surface-scoped:

- every `## Intent` line in `gof-catalog/` (23) and `extra-patterns-catalog/` (5) = **28 Intents**;
- every `## Mechanics` step list in `fowler-catalog/` (62) and `kerievsky-catalog/` (27) =
  **89 mechanics step lists**.

Motivation, examples, and Consequences prose were NOT re-opened here -- they rest on the Layer-3
attestation (Part 2). The sweep answered one question per surface: does the shipped surface share
copyrightable EXPRESSION with the source? It did NOT re-audit coverage, dropped steps, safe order, or
cross-ref aptness -- all of which were gated per-leaf in Phases 7 / 8 / 8.1.

**Method.** The sweep ran as a series of `oracle-reviewer` subagent invocations, batched by
chapter / family (one batch per chapter or GoF family). Each invocation received ONLY that batch's
shipped surface (the `## Intent` line, or the `## Mechanics` step list -- never whole leaves) plus the
book pointed at via its `index.md` (chapter files resolved by the reviewer, never hardcoded). The
rubric was the DST-04 near-verbatim axis only (a `too_close_to_source` boolean plus a
category-only structural reason, no source span echoed). On any `revise` verdict the flagged surface
was reworded BLIND -- from the reviewer's short structural directives only, never reading the source
-- and re-gated in a fresh invocation. The round cap was 3 per batch; no batch reached it without
converging, so no surface was escalated to the owner.

**Batches and outcomes** (16 chapter/family batches, within the D-03 15-20 envelope; each converged
to an all-`pass` verdict):

| Batch | Surface | Leaves | Rounds | Reworded blind |
|-------|---------|--------|--------|----------------|
| GoF Creational | `## Intent` | 5 | 2 | 2 |
| GoF Structural | `## Intent` | 7 | 2 | 1 |
| GoF Behavioral | `## Intent` | 11 | 3 | 6 |
| extra-patterns | `## Intent` | 5 | 1 | 0 |
| Fowler Ch.6 (basic set) | `## Mechanics` | 11 | 3 | 4 |
| Fowler Ch.7 (encapsulation) | `## Mechanics` | 9 | 2 | 3 |
| Fowler Ch.8 (moving features) | `## Mechanics` | 9 | 2 | 5 |
| Fowler Ch.9 (organizing data) | `## Mechanics` | 5 | 1 | 0 |
| Fowler Ch.10 (conditional logic) | `## Mechanics` | 6 | 2 | 2 |
| Fowler Ch.11 (refactoring APIs) | `## Mechanics` | 11 | 1 | 0 |
| Fowler Ch.12 (inheritance) | `## Mechanics` | 11 | 1 | 0 |
| Kerievsky Ch.6 (Creation) | `## Mechanics` | 6 | 1 | 0 |
| Kerievsky Ch.7 (Simplification) | `## Mechanics` | 6 | 1 | 0 |
| Kerievsky Ch.8 (Generalization) | `## Mechanics` | 7 | 1 | 0 |
| Kerievsky Ch.9 + Ch.10 (Protection + Accumulation) | `## Mechanics` | 5 | 1 | 0 |
| Kerievsky Ch.11 (Utilities) | `## Mechanics` | 3 | 2 | 1 |

**Totals:** 28 Intents + 89 mechanics = **117 surfaces, all `pass`**. 16 first-pass batch invocations
plus 10 blind-reword re-gate invocations (across the 8 batches that had rewords) = 26
`oracle-reviewer` verdicts. One batch (Kerievsky Ch.8) was additionally re-spawned once after an
unrelated session-limit interruption; no verdict was lost. **24 leaf surfaces were reworded blind;
no batch was escalated.**

**Blind rewords, by leaf** (overlap named by CATEGORY only -- no source span is reproduced):

GoF `## Intent`:
- `abstract-factory` -- mirrored sentence skeleton and clause order.
- `builder` -- mirrored two-clause order and cadence.
- `flyweight` -- leading verb plus a distinctive object-descriptor echo.
- `chain-of-responsibility` -- a distinctive phrase plus a mirrored verb-object clause.
- `memento` -- mirrored clause order with short shared token spans.
- `observer` -- sustained sentence-structure parallel (clause order + connectives + cadence).
- `state` -- mirrored opening clause and cadence.
- `template-method` -- mirrored closing clause (round 2), then mirrored opening imperative frame
  (round 3).
- `visitor` -- mirrored closing clause with a short verbatim span.

Fowler `## Mechanics`:
- `inline-function` -- one step's imperative reproduced too closely.
- `extract-variable` -- two steps' wording plus a shared descriptive phrase.
- `combine-functions-into-class` -- two steps' sentence structure and wording.
- `split-phase` -- one step's imperative (round 2), then two steps' mirrored clause skeleton and
  openers (round 3).
- `replace-primitive-with-object` -- two steps' wording and sentence structure.
- `hide-delegate` -- one step's near-verbatim sentence and another's echoed structure.
- `remove-middle-man` -- one step's opening clause.
- `move-field` -- one step's precondition clause and another's wording.
- `move-statements-into-function` -- multi-word runs and a mirrored conditional structure across
  three steps.
- `move-statements-to-callers` -- one step's opening frame and another's opening clause plus a
  subclass structural parallel.
- `slide-statements` -- one step's phrasing and another's shared safety-check term.
- `replace-loop-with-pipeline` -- one step's sentence structure and a shared multi-word run.
- `consolidate-conditional-expression` -- one step's precondition sentence structure.
- `introduce-assertion` -- the single step's action-clause phrasing.

Kerievsky `## Mechanics`:
- `unify-interfaces` -- one step's distinctive two-word technical term for the do-nothing method body.

**Post-reword gate (Task-1 acceptance).** After every reword, from
`.claude/skills/lz-refactor-workspace`:

- `node tools/check-hygiene.mjs` -- exit 0 (hardened axis-c GREEN; 187 files ASCII-clean; email
  allowlist clean; 180 files no-verbatim-heuristic clean).
- `node tools/check-gof.mjs` -- exit 0 (23/23 patterns, 5-section contract + family index intact).
- `node tools/check-kerievsky.mjs` -- exit 0 (27/27 refactorings, contract + Direction + GoF +
  composed-primitive fields intact).
- `node tools/check-catalog.mjs` -- exit 0 (62/62 Fowler refactorings, contract + provenance intact).

No leaf lost its `## Intent` or `## Mechanics` surface during any reword; the 28 + 89 surface counts
are preserved. All rewords landed in leaf files; no SKILL.md edit was forced, so the D-14 subagent
review path was not triggered.

---

## Part 2 -- Layer-3 standing attestation (un-swept leaf surfaces)

The Layer-2 sweep re-opened only the two proven-collision surfaces. Every catalog leaf's remaining
surfaces (motivation, examples, applicability / Consequences, and cross-references) ALREADY passed a
per-leaf `oracle-reviewer` gate during the phase that authored them, with DST-04 near-verbatim as an
explicit review axis. Those verdicts stand as the attestation for the surfaces this sweep did not
re-open. Cited by filename:

- **Fowler (`fowler-catalog/`, 62 leaves):** `07-LEARNINGS.md`, plus the per-plan summaries
  `07-01-SUMMARY.md` through `07-10-SUMMARY.md`. `07-LEARNINGS.md` records that the DST-04
  near-verbatim gate fired on an ACCIDENTAL mechanics collision on the `push-down-method` blind draft
  (no source access), which was reworded blind and cleared -- the standing precedent that justified
  keeping `## Mechanics` step lists inside the Layer-2 sweep.

- **Kerievsky (`kerievsky-catalog/`, 27 leaves):** `08-LEARNINGS.md`, plus `08-01-SUMMARY.md` through
  `08-06-SUMMARY.md`. Records the same inline clean-room firewall (main context never reads
  `.oracle/`) and the deterministic-layer-before-oracle-calls discipline applied to these leaves.

- **GoF + extra-patterns (`gof-catalog/` 23 + `extra-patterns-catalog/` 5 leaves):**
  `08.1-LEARNINGS.md`, plus `08.1-01-SUMMARY.md` through `08.1-07-SUMMARY.md`. Records the canonical
  `## Intent` near-verbatim trap: the one-line GoF Intents are distinctive definitional prose that a
  blind draft reproduces near-verbatim, and independent per-family reviewers flagged the construct
  that one lenient reviewer had waved through -- forcing a catalog-wide blind intent-paraphrase pass.
  This is the standing precedent that justified keeping `## Intent` lines inside the Layer-2 sweep.

**functional-catalog is no-oracle -- OUTSIDE the DST-04 book-prose axis (D-04).** The 19 functional
de-patterning idioms have no `.oracle/` book source; their correctness is anchored in the committed
research artifact, the workspace checker, and the `tsc --strict` sample harness, not in a book. Their
DST-04-clean status is therefore attested by FUN-04 and the Phase-8.2 `skill-reviewer` PASS
(`08.2-LEARNINGS.md`, `08.2-01-SUMMARY.md` through `08.2-06-SUMMARY.md`), not by a book sweep. They
were correctly excluded from the Layer-2 sweep.

**lz-tpp is out of scope (D-04).** DST-04's book-prose axis covers the `lz-refactor` tree only. The
`lz-tpp` `references/transformations.md` carries a deliberately cited list under a different source
and license (shipped in 0.0.1) and must not be scrubbed; the ASCII and work-email axes (D-10) still
cover it, but the no-verbatim axis does not.

---

## Verdict

DST-04's semantic no-verbatim guarantee is verified for the two proven collision surfaces across
every `lz-refactor` catalog leaf (28 Intents + 89 mechanics, all `pass`, 24 reworded blind and
re-passed within the round cap, none escalated), and the standing per-leaf attestation for the
un-swept surfaces is recorded above by filename. The main executor context never read `.oracle/`
book prose; the clean-room firewall held throughout.
