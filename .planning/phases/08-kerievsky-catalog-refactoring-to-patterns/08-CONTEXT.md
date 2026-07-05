# Phase 8: Kerievsky Catalog (Refactoring to Patterns) - Context

**Gathered:** 2026-07-05
**Status:** Ready for planning
**Mode:** `--analyze --auto --chain` (autonomous single pass; recommended options auto-selected)

> Phase 8 is the Kerievsky analog of Phase 7 and REUSES Phase 7's LOCKED design
> verbatim -- READ THESE FIRST: `../07-fowler-catalog-refactoring-2nd-ed/07-ROUTING-ARCHITECTURE.md`
> (leaf/index contracts, flows, harness contract) and `../07-fowler-catalog-refactoring-2nd-ed/07-ORACLE-MODEL.md`
> (clean-room `oracle`/`oracle-reviewer` loop, oracle-availability matrix, driver
> responsibilities, per-axis anchors). The decisions below only add what is
> Kerievsky-SPECIFIC on top of that carried-forward model.

<domain>
## Phase Boundary

Phase 8 fills the empty `references/kerievsky-catalog/` (Phase-6 scaffold: a thin
`README.md` index over an empty leaf dir) with the complete Kerievsky
pattern-directed LAYER of the `lz-refactor` skill, and folds Kerievsky's Ch.4
smells into the already-built unified taxonomy. Satisfies KRV-01..KRV-04.

**In scope (the CONTENT of the Kerievsky layer):**

1. **Kerievsky catalog** (`references/kerievsky-catalog/`) -- all 27
   pattern-directed refactorings as per-refactoring leaf files behind the thin
   index, each with name + intent + distilled mechanics (original words) + an
   original TS/JS example re-rendered from the book's Java + the composed Fowler
   primitive(s) + the To/Towards/Away direction + the target GoF pattern name.
2. **Ch.4 smell fold** -- Kerievsky's Ch.4 smells folded into `smells.md` +
   `smells/` with source tags, deduplicated against Fowler's 24.
3. **Harness extension** -- extend the non-shipped checker battery to gate the
   27 Kerievsky leaves, their Fowler-primitive cross-refs, the direction field,
   the 3 named de-patterning cases, and the smell fold; the existing
   `extract-samples.mjs` already compiles every fenced example `tsc --strict`.

All TS/JS samples are `tsc --strict`-clean and behavior-preserving, verified via
the clean-room `oracle-reviewer` loop over `.oracle/refactoring-to-patterns/`
(the main context never reads book prose -- DST-04).

**Out of scope (later phases):** the coach decision procedure + de-patterning
routing that CONSUMES this catalog (Phase 9, CCH-*); Beck/Feathers
principle-backing (Phase 9, PRIN-*); version bump / README / CHANGELOG (Phase 10,
DST-*); evals (Phase 11, EVL-*). No new SKILL.md router changes (the
`kerievsky-catalog/README.md` pointer already resolves). No UI/frontend -- this
is a Markdown skill-authoring phase.

</domain>

<decisions>
## Implementation Decisions

### Catalog Structure (mirror the LOCKED Phase-7 leaf/index model)

- **D-01 [architecture]:** Author the Kerievsky layer as per-refactoring LEAF
  files `references/kerievsky-catalog/<slug>.md` (x27) behind the existing thin
  `kerievsky-catalog/README.md` index -- exactly mirroring the LOCKED Fowler
  per-refactoring-leaf + thin-index model (07-ROUTING-ARCHITECTURE.md). Group the
  index by Kerievsky's OWN six book chapters: Creation (Ch.6), Simplification
  (Ch.7), Generalization (Ch.8), Protection (Ch.9), Accumulation (Ch.10),
  Utilities (Ch.11). This is the authoritative, Fowler-consistent grouping (the
  book already partitions the 27 this way). SKILL.md is NOT re-touched -- its
  `references/kerievsky-catalog/README.md` pointer already resolves; adding leaf
  files needs no SKILL.md edit.
  COMPETING (rejected at auto-lock, re-openable at plan time): split by direction
  (To/Towards/Away) -- rejected because direction is a per-leaf FIELD (D-03), not
  a file axis, and a refactoring can be applied in more than one direction; split
  by GoF pattern family -- rejected because it fragments the catalog, diverges
  from the book's own structure, and a refactoring maps to one pattern anyway.

- **D-02 [architecture]:** Each Kerievsky leaf mirrors the LOCKED Fowler leaf
  contract (`Use when:` / `## Motivation` / `## Mechanics` / `## Example` /
  optional `## Watch for`) PLUS three Kerievsky-specific fields required by the
  requirements: **Composed Fowler primitive(s)** (KRV-01 -- cross-link to
  `../fowler-catalog/<slug>.md#<slug>`, the always-present H1 anchor per the
  Phase-7 cross-link pattern), **Direction** (KRV-02 -- To / Towards / Away), and
  **GoF pattern** (KRV-04 -- vocabulary name only; see D-04). Intent replaces/leads
  the Motivation section wording for the pattern-directed framing.

### Direction Model (KRV-02)

- **D-03 [content]:** Capture To / Towards / Away as a per-leaf `Direction:` field,
  annotated in the index rows. The three named de-patterning (Away) cases --
  **Inline Singleton**, **Move Accumulation to Visitor** (away from Iterator), and
  **Encapsulate Composite with Builder** (away from Composite) -- carry an explicit
  "refactor AWAY from `<pattern>`" callout in their leaves (the over-/under-
  engineering balance Phase 9's coach will route on). The extended harness asserts
  all 27 leaves carry a Direction value and that these 3 Away cases are present and
  flagged.

### GoF Cross-Reference Sourcing (KRV-04)

- **D-04 [oracle]:** Cross-reference GoF by pattern NAME (vocabulary only), per
  KRV-04's "for vocabulary ... without reproducing any GoF text." The target
  pattern for each refactoring is stated in the Kerievsky book itself and is
  oracle-verifiable by `oracle-reviewer` against `.oracle/refactoring-to-patterns/`;
  the pattern name (Composite, Visitor, State, Strategy, Template Method,
  Decorator, Factory Method, Adapter, Builder, Command, Observer, Singleton, etc.)
  plus at most a 1-line own-words intent are common-knowledge facts, not
  copyrightable expression. NO GoF prose or code is reproduced (DST-04); the
  harness `check-hygiene` guards this.
  **Sourcing / fallback:** GoF is NOT in `.oracle/` (07-ORACLE-MODEL matrix), so it
  cannot be oracle-gated. The standing AskUserQuestion-owner path is the FALLBACK
  ONLY -- fired for a specific GoF pattern-target the Kerievsky oracle cannot settle
  (an `ambiguities` / `error` verdict), NOT for pattern names generally. This is the
  same supersession logic Phase 7 applied: AskUserQuestion is retired as the
  primary path where the fact is verifiable from the `.oracle/` book, kept as the
  path for genuinely unowned content.
  **Confidence / re-open note (plan-time):** name-only vocabulary is the safe
  default and satisfies KRV-04 as written; if the owner later wants a richer GoF
  intent line per refactoring, that is an additive, reversible AskUserQuestion
  enhancement -- surface it at plan review, do not pre-build it.

### Ch.4 Smell Fold + Dedup (KRV-03)

- **D-05 [content]:** Fold Kerievsky's Ch.4 smells into the existing unified
  taxonomy (`smells.md` navigation index + `smells/<slug>.md` leaves) with source
  tags, deduplicated against Fowler's 24:
  - **Kerievsky-UNIQUE smells** (e.g. Solution Sprawl, Combinatorial Explosion,
    Oddball Solution, Indecent Exposure, Conditional Complexity where not already
    a Fowler smell) -> new `smells/<slug>.md` leaves + new source-tagged index rows
    in the LOCKED navigation-only shape (`recognize by:` + link; candidates in the
    leaf).
  - **Smells that OVERLAP Fowler's list** -> deduped: NO new leaf/row; add a source
    tag + an "also named by Kerievsky: `<name>`" note to the existing Fowler leaf,
    and (where apt) add Kerievsky pattern-directed candidate refactorings to that
    leaf's candidate map.
  - Introduce a `Fowler` / `Kerievsky` / `both` source tag. This LIGHTLY touches
    existing rows -- ADDING a tag only, never rewriting the Phase-7 recognize-by
    cues. (Reconciles the Phase-7 D-04 "fold WITHOUT re-touching the Phase-7 rows"
    note: additive tag on the index rows is the intended fold, not a rewrite.)
  - The exact per-smell dedup MAP (which Ch.4 smells are duplicates of which
    Fowler smells vs genuinely unique) is decided DURING the oracle-gated authoring
    loop against `.oracle/refactoring-to-patterns/` Ch.4 -- NOT blind at discuss
    time (the source is required to settle overlap).
  - Extend `check-smells` to assert the fold: new leaves present, source tags valid,
    no un-deduped duplicate smell, all candidate links resolve.

### Example Discipline (KRV-01)

- **D-06 [content]:** Re-render each Kerievsky example from the book's Java into
  ONE compact original TS/JS before/after, mirroring the LOCKED Fowler leaf example
  discipline: 5-15 lines per side, only the code the refactoring touches, hard cap
  of 2 examples, authored in a domain UNRELATED to the source with original
  identifiers to avoid `too_close_to_source`; every example `tsc --strict`-clean
  via the existing `extract-samples.mjs` harness. For genuinely pattern-heavy
  refactorings whose teaching lives in the intermediate states, use the LOCKED
  overflow rule -- push an evolving `<slug>-walkthrough.md` loaded only in
  explain-in-depth mode; the leaf keeps the compact before/after. Behavior-
  preservation AND full-strength DST-04 near-verbatim are gated by `oracle-reviewer`
  (a `tsc`-clean example can still change behavior -- the reviewer covers that).

### Oracle Model (carried forward from Phase 7, LOCKED -- reused as-is)

- **D-07 [oracle]:** Source and verify ALL Kerievsky catalog + smell content via
  the clean-room `oracle`/`oracle-reviewer` loop (Model C) over
  `.oracle/refactoring-to-patterns/index.md`, IDENTICAL to Phase 7: author BLIND
  from public knowledge; run the DETERMINISTIC layer first (tsc + contract +
  hygiene + cross-ref checks) before spending reviewer calls; gate fidelity +
  full-strength DST-04 near-verbatim via the isolated `oracle-reviewer` (its
  verdict never carries source prose); revise BLIND from the directives; sub-batch
  ~6-8 leaves per reviewer call in parallel; cap ~3 rounds; escalate
  non-convergence / `ambiguities` to the owner via AskUserQuestion. The main
  context NEVER reads `.oracle/` prose (only `ls` for names). Pass a tight per-leaf
  scope so the reviewer does not treat out-of-scope chapter entries as dropped.
  This SUPERSEDES the `kerievsky-catalog/README.md` stub's "AskUserQuestion
  oracle-access checkpoint" for the Kerievsky book (which IS in `.oracle/`), exactly
  as Phase 7 superseded D-07 for Fowler; AskUserQuestion survives only for GoF
  (D-04) and reviewer escalations. Reference only `index.md` + chapter number/topic
  in `.planning/` artifacts -- never hardcode the book's chapter filenames.

- **D-08 [orchestration]:** The orchestrator (MAIN context) drives the content
  plans INLINE -- NOT via `gsd-executor`. `gsd-executor` has no `Agent` tool (cannot
  spawn `oracle`/`oracle-reviewer`) and no `AskUserQuestion` (cannot do owner
  escalation), so only the main context can run the author -> gate -> revise ->
  escalate loop. Set `branching_strategy=none`, no worktrees (the oracle agents are
  read-only). This is the Phase-7 blocking anti-pattern carried forward -- the
  plan MUST encode it or execution will fail the same way.

### Claude's Discretion
- Leaf slugs; entry ordering within a chapter group; the exact index annotation
  format for Direction and GoF pattern; the precise `Composed Fowler primitive(s)`
  phrasing; whether the harness extension is added to the existing
  `check-catalog`/`check-smells` or a new `check-kerievsky` (keep it out of the
  shipped skill surface either way); oracle-reviewer sub-batch size within the
  ~6-8 guidance; the per-axis rubric anchors passed per reviewer call (default to
  the Phase-7 canonical anchors, adjusted for the pattern-directed content type).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### The LOCKED Phase-7 design to MIRROR (this is the primary input)
- `.planning/phases/07-fowler-catalog-refactoring-2nd-ed/07-ROUTING-ARCHITECTURE.md`
  -- leaf + index content contracts, the smell-leaf contract, the routing flows,
  the harness/validation contract, and the leaf->principles back-edge. Phase 8's
  kerievsky-catalog leaves + smell-fold follow this verbatim.
- `.planning/phases/07-fowler-catalog-refactoring-2nd-ed/07-ORACLE-MODEL.md`
  -- the clean-room `oracle`/`oracle-reviewer` loop, the firewall, the
  oracle-availability matrix (Kerievsky=yes/`.oracle`, GoF=no/AskUserQuestion),
  driver responsibilities (fan-out aggregation guard, loop bound, rubric anchors),
  and the canonical per-axis anchors. D-07/D-08 above are this doc applied to
  Kerievsky.
- `.planning/phases/07-fowler-catalog-refactoring-2nd-ed/07-LEARNINGS.md`
  -- Phase-7 lessons that pre-empt Phase-8 rework: richer chapters fold sub-steps
  (the loop restores them); blind drafts accidentally converge on the source's
  example (re-domain on `too_close`); a checker can be content-correct yet
  token-RED; the sample tsc workspace has no DOM lib (pure examples only);
  cross-ref aptness (a resolvable link can still be the wrong sibling); candidate
  maps are where smell drafts drift most.

### The scaffold to FILL (Phase-6 output -- content contracts)
- `plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/README.md`
  -- thin index + per-entry content contract (name/intent, mechanics, TS/JS
  example, composed Fowler primitives, direction, GoF cross-ref) + deferred
  split-axis note (resolved by D-01). FILL THIS (leaf files added alongside it).
- `plugins/lz-tdd/skills/lz-refactor/references/smells.md` +
  `plugins/lz-tdd/skills/lz-refactor/references/smells/` -- the unified taxonomy
  (navigation-only index + 24 Fowler smell leaves) to FOLD Ch.4 into (D-05).
- `plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/` -- the 62 Fowler
  leaves (each with an H1 anchor) that Kerievsky leaves cross-map to as composed
  primitives (D-02).
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` -- the router; pointers already
  resolve, do NOT re-touch.

### The oracle (owner-held, clean-room only -- main context never reads prose)
- `.oracle/refactoring-to-patterns/index.md` -- navigation entry for Kerievsky
  *Refactoring to Patterns*. Ch.4 = code smells; Ch.5 = catalog intro; Ch.6-11 =
  the six refactoring groups (Creation / Simplification / Generalization /
  Protection / Accumulation / Utilities). Accessed ONLY via `oracle`/`oracle-reviewer`
  by chapter/topic (never hardcode filenames). Owner is authoritative.
- GoF *Design Patterns* -- NOT in `.oracle/`; pattern NAMES are vocabulary
  (common knowledge); AskUserQuestion is the fallback for an unresolvable target
  (D-04). No GoF path (owner-held).

### The clean-room agents (read-only, isolated)
- `.claude/agents/oracle-reviewer.md` -- gates draft fidelity + DST-04 near-verbatim;
  returns `pass|revise|blocked`, never source prose.
- `.claude/agents/oracle.md` -- open-ended own-words lookups from the source.

### The non-shipped validation harness to EXTEND
- `.claude/skills/lz-refactor-workspace/` -- `extract-samples.mjs` (one-module-per-fence
  `tsc --strict`), `tools/check-catalog.mjs`, `tools/check-smells.mjs`,
  `tools/check-crossrefs.mjs`, `tools/check-hygiene.mjs`, `tools/verify-scaffold.mjs`,
  pinned `typescript`. Extend for the 27 Kerievsky leaves (name identity,
  Fowler-primitive + GoF cross-ref presence/resolution, direction field, 3 Away
  cases) and the smell fold; assert name IDENTITY not cardinality.

### Phase spec
- `.planning/ROADMAP.md` -> "Phase 8: Kerievsky Catalog (Refactoring to Patterns)"
  -- goal + the 4 success criteria this phase is graded on.
- `.planning/REQUIREMENTS.md` -> "Kerievsky Catalog" (KRV-01, KRV-02, KRV-03,
  KRV-04).
- `.planning/PROJECT.md` -- constraints (ASCII-only, MIT, public contact, no
  verbatim prose DST-04) + the oracle-access convention + prior key decisions.
- `.planning/phases/06-lz-refactor-skill-scaffold-progressive-disclosure/06-CONTEXT.md`
  -- Phase-6 D-09 oracle-checkpoint carry-forward (superseded for the `.oracle/`
  Kerievsky book by D-07, kept for GoF by D-04).

### Authoring guidance (via the Skill tool -- no path needed)
- `skill-creator` -- progressive-disclosure authoring.
- `plugin-dev:skill-development`, `plugin-dev:plugin-structure` -- skill/plugin
  structure and auto-discovery.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Phase-7 LOCKED design docs** (07-ROUTING-ARCHITECTURE.md, 07-ORACLE-MODEL.md):
  the leaf/index/harness contracts and the clean-room oracle loop are reused
  verbatim -- Phase 8 adds only the 3 Kerievsky-specific leaf fields (Fowler
  primitives, direction, GoF) and the Ch.4 smell fold.
- **`oracle` + `oracle-reviewer` agents** already exist and already know the
  `.oracle/` firewall; the Kerievsky book is fully provisioned at
  `.oracle/refactoring-to-patterns/` (Ch.4 smells + Ch.6-11 catalog + index.md).
- **The checker battery + `extract-samples.mjs`** already compile every fenced
  example `tsc --strict` and enforce hygiene/cross-ref resolution -- extend, do
  not rebuild.
- **The 62 Fowler leaves** are the composition targets; each has a stable
  `#<slug>` H1 anchor to cross-link to.

### Established Patterns
- Progressive disclosure: thin index + per-refactoring leaves; no single file
  forces the whole catalog into context (SKEL-04). Mirror the Fowler ratio.
- Clean-room author -> deterministic checks -> `oracle-reviewer` gate -> revise
  blind -> converge (~3 rounds, escalate on non-convergence). Run the cheap
  deterministic layer before spending reviewer calls; sub-batch ~6-8 leaves.
- Distinct example domains/identifiers to avoid `too_close_to_source`.
- Public-repo hygiene from every file: ASCII-only, MIT, public contact only, NO
  verbatim Kerievsky/GoF prose or code (DST-04).

### Integration Points
- The unified `smells.md`/`smells/` taxonomy becomes the coach trigger table
  Phase 9 consumes -- the Ch.4 fold (D-05) must keep the LOCKED navigation-only
  index shape so Phase 9's routing is unchanged.
- Kerievsky leaves' `Direction: Away` + de-patterning callouts (D-03) feed Phase
  9's over-/under-engineering (de-patterning) coach routing (CCH-02).
- Composed-Fowler-primitive cross-links (D-02) connect the two catalog layers for
  Phase 9's mechanical->Fowler / structural->Kerievsky routing (CCH-01).

</code_context>

<specifics>
## Specific Ideas

- This is a Markdown skill-authoring phase -- there is NO UI / frontend. SKIP
  UI-SPEC generation at plan time (the plan-phase UI gate false-positives on the
  word "guidance"; all 0.0.2 phases 6-11 are skill authoring).
- The Kerievsky book is FULLY provisioned in `.oracle/refactoring-to-patterns/`
  (verified: index.md + per-chapter Markdown present), so -- unlike Phase 7's
  mid-phase provisioning -- the oracle loop can run from the start; no owner
  provisioning step is needed for the Kerievsky book (GoF still needs no
  provisioning -- names are vocabulary, D-04).
- Standing milestone instruction ("use AskUserQuestion for authoritative oracle
  book access") is HONORED but scoped: superseded by the clean-room loop for the
  `.oracle/`-present Kerievsky book (D-07), retained as the fallback for GoF (D-04)
  and reviewer escalations -- identical to Phase 7's resolution.

</specifics>

<deferred>
## Deferred Ideas

- The coach decision procedure that consumes this catalog + the smell taxonomy
  (mechanical->Fowler, structural->Kerievsky; de-patterning routing) -> Phase 9
  (CCH-01..05).
- Beck / Feathers principle-backing references -> Phase 9 (PRIN-01..03).
- Splitting the Kerievsky layer into its own `lz-refactor-to-patterns` skill if it
  outgrows one skill -> FUT-04 (future milestone), only if warranted.
- A richer per-refactoring GoF intent line (beyond the pattern name) -> re-openable
  at plan review via a targeted AskUserQuestion if the owner wants it (D-04);
  default ships name-only vocabulary.

None of the above is in Phase-8 scope -- discussion stayed within the phase
boundary.

</deferred>

---

*Phase: 8-Kerievsky Catalog (Refactoring to Patterns)*
*Context gathered: 2026-07-05*
