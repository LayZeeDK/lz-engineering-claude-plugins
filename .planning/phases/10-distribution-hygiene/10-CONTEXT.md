# Phase 10: Distribution & Hygiene - Context

**Gathered:** 2026-07-09
**Status:** Ready for planning

> Auto-discussed (`--analyze --auto`, discuss-phase only; operator requested a PAUSE
> before plan-phase, so no auto-advance ran). Six phase-specific gray areas were
> auto-resolved to their recommended options with trade-off tables (see
> `10-DISCUSSION-LOG.md`). Five are reversible pre-tag Markdown / JSON / harness edits
> with direct Phase-4 precedent -- none in the high-impact + low-confidence trap
> quadrant. GA-1's scan BREADTH is the one exception and is flagged as
> **OPEN-FOR-OPERATOR** below (D-03): high impact (public-repo copyright, expensive to
> reverse) and only medium confidence, so it is surfaced at the pause rather than
> silently locked.

<domain>
## Phase Boundary

Make the repo publicly shippable **with the `lz-refactor` skill**. It delivers four
things and nothing more:

1. **DST-01** -- `plugins/lz-tdd/.claude-plugin/plugin.json` `version` bumped `0.0.1` ->
   `0.0.2`, and the root `README.md` documents the `lz-refactor` skill (what it does +
   `/lz-tdd:lz-refactor` invocation) alongside `lz-tpp`.
2. **DST-03** -- `CHANGELOG.md` gains an `lz-tdd@0.0.2` entry describing the
   `lz-refactor` skill.
3. **DST-02** -- `claude plugin validate .` AND `--strict` pass on the final tree;
   first-party review (`plugin-dev`'s `plugin-validator` + `skill-reviewer`) PASSes;
   the work email is absent; the license stays MIT; committed output is ASCII-only.
4. **DST-04** -- a hygiene scan confirms no verbatim Fowler / Kerievsky / GoF prose or
   code listings appear in the shipped tree -- only original prose, original code,
   names, and facts.

This phase clarifies HOW to document, bump, review, and scan what already exists. It
does **not** author or re-tune any skill behavior or catalog content (Phases 6-9, all
CLOSED), does **not** run trigger / behavior evals or empirically tune either skill's
`description` (Phase 11, EVL-01/02), and does **not** cut a git tag or publish a
GitHub Release (see `<deferred>` -- the 0.0.1 precedent made that a separate quick
task AFTER the phase).

</domain>

<decisions>
## Implementation Decisions

### DST-04: the no-verbatim hygiene scan (the load-bearing decision of this phase)

- **D-01:** The scan is a **risk-targeted `oracle-reviewer` sweep + a hardened
  deterministic detector + the on-file per-leaf attestation** -- not a full 178-leaf
  re-sweep (unaffordable) and not attestation-only (circular). Three layers:
  1. **Deterministic layer (hard gate, main context safe).** Promote
     `check-hygiene.mjs`'s `(c)` no-verbatim heuristic from WARN to a real gate, and
     widen it beyond long double-quoted runs to the surfaces that empirically collide.
     This layer never reads book prose, so it runs in the normal battery.
  2. **Clean-room layer (`oracle-reviewer` only).** A DST-04-ONLY review pass over a
     risk-ranked subset of leaves. **Main context MUST NEVER read `.oracle/`** -- that
     is the whole point of the clean-room model (see `07-ORACLE-MODEL.md`), so any
     fresh draft-vs-source comparison is forced through the read-only `oracle-reviewer`
     subagent, which returns verdicts in its own words and never echoes source prose.
  3. **Attestation layer.** Every leaf in `fowler-catalog/`, `kerievsky-catalog/`,
     `gof-catalog/`, and `extra-patterns-catalog/` ALREADY passed a per-leaf
     `oracle-reviewer` gate during Phases 7 / 8 / 8.1, with DST-04 as an explicit
     review axis. Cite those verdicts (the phase SUMMARY / LEARNINGS files) as the
     standing evidence for leaves the risk sweep does not re-open. Record the citation
     in the phase artifact -- an undocumented attestation is not an attestation.
  Rationale: `check-hygiene.mjs:8` names "the Phase-10 hygiene scan" as the
  authoritative no-verbatim gate, so this phase cannot defer back to the checker.

- **D-02:** The known-collision surfaces, from prior evidence -- the risk sweep and the
  hardened detector MUST both target these first:
  - **Canonical one-line pattern `## Intent` lines** (GoF + extra-patterns leaves).
    Memory `pattern-leaf-intent-near-verbatim-dst04`: canonical Intents reproduce
    near-verbatim even in a *blind* draft; three of four Phase-08.1 reviewers flagged
    it and one was lenient. Highest-risk surface in the tree.
  - **Short imperative mechanics step lists** (Fowler + Kerievsky leaves). Phase 7
    (07-09) recorded an ACCIDENTAL verbatim collision on `push-down-method`'s
    mechanics -- a blind draft matched the source's short imperative steps. Short
    procedural steps have few original phrasings available.
  - **`Applicability` first lines** mirrored into the `gof-catalog/README.md` selector
    column -- a mirror multiplies any single leaf's collision into two files.

- **D-03:** **[OPEN-FOR-OPERATOR -- do NOT treat as locked]** The **breadth** of the
  D-01 layer-2 clean-room sweep. The MECHANISM is forced (only `oracle-reviewer` may
  read `.oracle/`, so confidence is HIGH); the BREADTH is a judgment call at only
  MEDIUM confidence against a HIGH-IMPACT, expensive-to-reverse outcome (verbatim
  copyrighted prose in a public repo's git history -- cf. memory
  `lz-plugins-phase1-workemail-git-history-exposure`, which cost a `git filter-repo` +
  force-push). Do not silently lock a breadth. The operator picks from:
  - **(a) Surface-scoped, all leaves** -- sweep every `## Intent` line (29 leaves) and
    every mechanics step list, but only those surfaces, not whole leaves. Widest
    coverage of the two proven collision surfaces; the highest oracle cost of the three.
  - **(b) Surface-scoped, GoF + extra only** (29 leaves) -- the one surface with a
    *proved, reviewer-confirmed* near-verbatim trap. Cheapest defensible option;
    leaves the Fowler/Kerievsky mechanics surface on Phase-7/8 attestation alone.
  - **(c) Detector-first** -- run the hardened deterministic detector FIRST across all
    178 leaves, then send only its hits (plus all 29 `## Intent` lines
    unconditionally) to `oracle-reviewer`. Data-driven breadth; unknown oracle cost
    until the detector runs; requires a detector that does not need the source text.
  Planner: surface this to the operator before writing plans. Do not auto-pick.

- **D-04:** DST-04's book-prose axis is scoped to the **`lz-refactor` tree**
  (`plugins/lz-tdd/skills/lz-refactor/`) plus any NEW Phase-10 prose (README primer,
  CHANGELOG entry). It does NOT extend to `lz-tpp`: its
  `references/transformations.md` intentionally carries the verbatim, cited 14-item
  FibTPP list from Robert C. Martin's two free Clean Code blog posts -- a different
  source, a different license posture, shipped and reviewed in 0.0.1, and outside
  DST-04's requirement text ("Fowler/Kerievsky/GoF"). A planner MUST NOT scrub it.
  The ASCII + work-email axes DO extend to `lz-tpp` (see D-10).

### DST-01: README

- **D-05:** The root `README.md` gains an `lz-refactor` section MIRRORING the existing
  `lz-tpp` shape: a "What lz-refactor does" block (two modes: auto-triggering coach at
  the refactor step; on-demand reference via `/lz-tdd:lz-refactor`) + a brief ORIGINAL
  refactoring primer + authoritative book sources (link only) + a pointer into
  `references/`. Structural updates: the "What this is" bullet list must become a
  two-skill listing, and the title/lead paragraph must stop claiming the plugin ships
  only `lz-tpp`. Section ordering and wording are Claude's discretion (D-13).

- **D-06:** Carry Phase-4 **D-02** forward unchanged: **link the sources, never inline
  them.** Cite the two books by title + author + publisher/ISBN link; point readers at
  `plugins/lz-tdd/skills/lz-refactor/references/` for the catalogs. Do NOT inline
  catalog entries, mechanics, smell tables, or examples into the README -- the
  `references/` tree stays the single source of truth (progressive disclosure, drift
  avoidance). **DST-04 applies to the README itself:** the primer is original prose.

- **D-07:** The README MAY carry a one-line catalog inventory (62 Fowler refactorings /
  27 Kerievsky pattern-directed refactorings / 23 GoF + 5 extra patterns / the
  functional de-patterning idioms / 28 smells) -- counts and names are FACTS, not
  protected expression, and they are what communicates the skill's scope. It MUST NOT
  imply a complete Beck or Feathers catalog: those three references are no-oracle,
  high-confidence-core-only (FUT-01). Verify every count against the tree at write
  time; do not copy the counts from this file.

### DST-01/DST-02: manifest metadata

- **D-08:** Bump `plugins/lz-tdd/.claude-plugin/plugin.json` `version` to `0.0.2`, AND
  correct the two stale one-skill strings in the same file: `description` (today names
  only `lz-tpp` / TPP) and `keywords` (today carries no refactoring vocabulary). Also
  correct the `.claude-plugin/marketplace.json` `plugins[0].description` -- it is the
  marketplace-listing text and likewise claims only "TPP coaching". All three
  currently mis-describe a two-skill plugin; Phase-4 **D-06** classifies factual
  inaccuracy as FIX-in-phase, and all three are one-line edits inside DST-01's blast
  radius.

- **D-09:** Do **NOT** add a `version` field to `.claude-plugin/marketplace.json`.
  Declaring it in both places is a documented trap: `plugin.json` silently wins, the
  marketplace value is masked, and the validator warns. `version` lives in
  `plugin.json` only. (Project tech-stack constraint, `CLAUDE.md`.)

### DST-02: hygiene-gate coverage

- **D-10:** Widen `check-hygiene.mjs`'s ASCII + work-email walk. Today it walks ONLY
  `plugins/lz-tdd/skills/lz-refactor/` -- which means the exact files this phase writes
  (`README.md`, `CHANGELOG.md`, `plugin.json`, `marketplace.json`) and the whole
  `lz-tpp` skill are UNGATED for both axes. Widen the target set to: both skill trees,
  the repo-root `README.md` / `CHANGELOG.md` / `LICENSE`, and both manifests. This is
  not scope creep -- DST-02 states the work email is absent and committed output is
  ASCII-only, and the gate cannot assert that over files it never opens.
  Evidence this matters: the checker's own header records that the work-email leak
  "recurred twice in Phase 4" (the README-writing phase); memory
  `lz-plugins-phase1-workemail-git-history-exposure` records a third exposure that
  required `git filter-repo` + a force-push of `origin/main`. Widening a gate is
  strictly safer and freezes no contract.

- **D-11:** Keep the allowlist shape of the email check (enumerate every email-shaped
  token, subtract the approved public contact `larsbrinknielsen@gmail.com`, assert the
  remainder is empty). Never write the work-email literal into a committed file -- not
  into a checker, not into a plan, not into this context file. That is precisely how
  Phase 4's `04-CONTEXT.md` first tripped its own rule. The non-self-tripping needle is
  documented in `.planning/phases/04-distribution-hygiene/04-RESEARCH.md`. See memory
  `public-repo-work-email-allowlist`.

### DST-02: review gates and findings triage

- **D-12:** Carry Phase-4 **D-05 / D-06** forward, retargeted to the 0.0.2 tree.
  Gates, all three required:
  1. `claude plugin validate .` and `claude plugin validate . --strict` -- the
     first-party CLI, a HARD gate. **Both already exit 0 on today's tree (verified
     during this discussion, 2026-07-09), so they are REGRESSION gates, not open
     risk.** Re-run them on the final tree after the manifest and README land.
  2. `plugin-dev`'s `plugin-validator` agent (structure / manifest / security / path
     traversal) -- has NOT been run during this milestone.
  3. `plugin-dev`'s `skill-reviewer` agent, on **BOTH** skills. Phase 09-04's
     `skill-reviewer` PASS was taken on the pre-README, pre-bump tree and never covered
     `lz-tpp`; the public ship gate belongs on the final tree.
  Plus: the full `npm run check` battery + `npm run typecheck`, which must stay GREEN.

- **D-13:** Findings triage (unchanged from Phase-4 D-06, with Phase 11 substituted for
  Phase 5). **FIX in Phase 10:** structural / manifest errors, security or
  path-traversal issues, anything breaking install or `/lz-tdd:lz-refactor` /
  `/lz-tdd:lz-tpp` invocation, ASCII violations, broken reference links, malformed
  frontmatter, and factual inaccuracies in README / CHANGELOG / LICENSE / manifests.
  **DEFER to Phase 11 (EVL-01/02):** any finding about `description` triggering
  effectiveness, over- or under-triggering, or coach routing accuracy -- these are
  empirical-tuning concerns the roadmap explicitly isolates in a late, non-blocking
  phase. "Significant findings" that block the public ship = errors + security + broken
  install/invocation + ASCII violations + a DST-04 verbatim hit. Subjective style
  suggestions are recorded and optionally applied, never allowed to pull Phase-11
  empirical work forward.

- **D-14:** If `skill-reviewer` or the DST-04 sweep forces an edit to either
  `SKILL.md`, that edit needs its own subagent review before acceptance (memory
  `agent-skill-instruction-changes-need-review`). README / CHANGELOG / manifest /
  checker edits are NOT skill-instruction files and need no such review, and none of
  them require `/reload-plugins`.

### DST-03: CHANGELOG

- **D-15:** Add `## [lz-tdd@0.0.2] - <date>` to `CHANGELOG.md` in the existing Keep a
  Changelog shape, mirroring the 0.0.1 entry: a one-paragraph lead, an `### Added`
  list, and a bottom link-ref to the release-tag URL. Content: the `lz-refactor` skill
  (dual-mode coach + reference, `/lz-tdd:lz-refactor`), the five reference catalogs,
  the unified smell taxonomy, the coach decision procedure, and the three no-oracle
  principle-backing references (tagged as core-only, no complete Beck/Feathers catalog
  claimed). Same "link, don't inline" rule as D-06.

- **D-16:** The bottom link-ref points at
  `.../releases/tag/lz-tdd%400.0.2` -- a tag that does NOT exist yet at write time.
  That is correct and matches what the 0.0.1 entry did when it was authored. Cutting
  the tag and publishing the GitHub Release is NOT this phase (see `<deferred>`).

### Claude's Discretion (deferred to research/planning)

- **D-17:** README section ordering, tagline and value-prop wording, whether to include
  a copy-paste usage snippet, and any badges (keep ASCII, keep minimal). Exact
  `keywords` list in `plugin.json`. Exact CHANGELOG bullet granularity. Whether the
  hardened DST-04 detector extends `check-hygiene.mjs` or lands as a sibling checker.
  The order the three D-12 review gates run in. All HOW micro-decisions inside the
  locked D-05 / D-08 / D-10 / D-15 boundaries.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Roadmap and requirements (PRIMARY)
- `.planning/ROADMAP.md` -> "Phase 10: Distribution & Hygiene" -- the goal, the
  dependency on Phase 9, and the four Success Criteria.
- `.planning/REQUIREMENTS.md` -> "Distribution & Hygiene" (DST-01..04), the
  "Future Requirements" list (FUT-01 bounds the CHANGELOG's Beck claim), and the
  "Out of Scope" table (verbatim book prose; npm packaging).

### Direct precedent -- the 0.0.1 Distribution phase (READ FIRST)
- `.planning/phases/04-distribution-hygiene/04-CONTEXT.md` -- D-02 (link, never inline
  the sources), D-05 (the three review gates), D-06 (the findings-triage rule this
  phase's D-13 carries forward verbatim).
- `.planning/phases/04-distribution-hygiene/04-RESEARCH.md` -- the non-self-tripping
  work-email allowlist needle (D-11). Do not re-derive it.
- `.planning/phases/04-distribution-hygiene/04-LEARNINGS.md` -- what the 0.0.1 ship
  phase actually cost and got wrong.

### The DST-04 clean-room model (binding constraint on GA-1 / D-01)
- `.planning/phases/07-fowler-catalog-refactoring-2nd-ed/07-ORACLE-MODEL.md` -- the
  clean-room `oracle` / `oracle-reviewer` loop and the oracle-availability matrix.
  **The main context never reads `.oracle/`.** This is what forces D-01's layer 2
  through the subagent.
- `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` -- `:8` names "the
  Phase-10 hygiene scan" as the authoritative no-verbatim gate; `:83-89` shows the
  `lz-refactor`-only target walk that D-10 widens; `:125-137` is the WARN-level
  heuristic D-01 layer 1 hardens.

### Prior-phase attestation for the DST-04 sweep (D-01 layer 3)
- `.planning/phases/07-fowler-catalog-refactoring-2nd-ed/07-LEARNINGS.md` -- the
  `push-down-method` accidental-verbatim collision on short imperative mechanics steps.
- `.planning/phases/08-kerievsky-catalog-refactoring-to-patterns/` and
  `.planning/phases/08.1-gof-design-patterns-catalog/` SUMMARY + LEARNINGS files --
  the per-leaf `oracle-reviewer` verdicts that stand as attestation for leaves the
  risk sweep does not re-open.
- `.planning/phases/08.1-gof-design-patterns-catalog/08.1-CONTEXT.md` -- the locked
  GoF 5-section leaf contract whose `## Intent` line is D-02's highest-risk surface.

### Edit targets
- `README.md` (repo root) -- D-05, D-06, D-07. Today it documents only `lz-tpp`
  (`:1-5`, `:11-13`, `:29-61`).
- `CHANGELOG.md` (repo root) -- D-15, D-16. The `lz-tdd@0.0.1` entry (`:8-32`) is the
  shape to mirror.
- `plugins/lz-tdd/.claude-plugin/plugin.json` -- D-08 (`version` `0.0.1` -> `0.0.2`,
  plus `description` and `keywords`).
- `.claude-plugin/marketplace.json` -- D-08 (`plugins[0].description`); D-09 (no
  `version` field, ever).
- `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` + the workspace
  `package.json` `npm run check` battery -- D-01 layer 1, D-10, D-11.

### Artifacts being documented and reviewed (do not edit unless a gate forces it)
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` (112 lines, well under the 500-line
  SKEL-02 budget) and its `references/` tree (178 Markdown files).
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` and its `references/` (4 Markdown files) --
  in scope for `skill-reviewer` (D-12) and the ASCII/email gate (D-10); OUT of scope
  for the DST-04 book-prose axis (D-04).
- `LICENSE` (repo root, MIT) -- must stay MIT; contact stays the public gmail.

### Project-level constraints
- `.planning/PROJECT.md` and `CLAUDE.md` (project) -- ASCII-only committed output, the
  public contact, the work-email prohibition, source-authority precedence, `npm`
  default, and the "`version` in `plugin.json` only" tech-stack rule behind D-09.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`check-hygiene.mjs`** already implements two of the three DST-02 axes correctly
  (ASCII byte scan; email allowlist-subtraction). D-10 widens its target walk; D-01
  layer 1 hardens its `(c)` heuristic from WARN to gate. Do not rewrite it.
- **The `oracle-reviewer` agent** is the ONLY sanctioned reader of `.oracle/`. It
  returns structured `pass | revise | blocked` verdicts in its own words and never
  echoes source prose -- exactly the DST-04 primitive layer 2 needs. It already
  chunk-reads long chapters to EOF (memory `oracle-reviewer-large-chapter-read-cap`).
- **The 0.0.1 README + CHANGELOG** are the tone, structure, and Keep-a-Changelog
  templates to mirror -- both were written under the same DST-02 hygiene rules.
- **The `npm run check` battery** (10 checkers) + `npm run typecheck` (251 modules,
  `tsc --strict`) are GREEN as of Phase 9's close -- the Phase-10 baseline.

### Established Patterns
- **Instrument-first / Nyquist:** every prior phase built its checker to a RED baseline
  before authoring content. D-01 layer 1 and D-10 are this phase's instrument, so they
  land BEFORE the README / CHANGELOG prose they gate.
- **Clean-room DST-04:** the main authoring context never reads book prose; the
  read-only `oracle-reviewer` subagent does. Non-negotiable, and it is what makes any
  "just diff the tree against the book" plan impossible.
- **Link, don't inline** (Phase-4 D-02): docs point at `references/`; `references/`
  holds the content. Applies to README and CHANGELOG alike.
- **Widen a gate, never weaken one** (Phase-9 T-09-GATE): no checker may be relaxed to
  turn a phase GREEN.

### Integration Points
- `plugin.json` `version` is what `/plugin update` compares; an unchanged version makes
  auto-update SKIP the plugin, so DST-01's bump is the mechanism by which existing
  installs ever see `lz-refactor`.
- `README.md` install commands target `.claude-plugin/marketplace.json`; the remote
  `github.com/LayZeeDK/lz-engineering-claude-plugins` is wired and pushed (STATE.md),
  so the documented `/plugin marketplace add` command genuinely resolves.
- The widened `check-hygiene.mjs` (D-10) reaches OUTSIDE the skill dir for the first
  time (repo-root files + both manifests) -- its `repoRoot` resolution already exists
  (`:17`), so this is a target-set change, not a path-model change.
- This is the last gating phase for the public 0.0.2 ship. Phase 11 (evals) is
  explicitly non-blocking and runs after.

</code_context>

<specifics>
## Specific Ideas

- The README install block is unchanged from 0.0.1 and stays verbatim:
  `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins`, then
  `/plugin install lz-tdd@lz-engineering-claude-plugins`.
- Invocations to document: `/lz-tdd:lz-refactor` (reference mode) and
  `/lz-tdd:lz-tpp`, each noting the skill also auto-triggers as a coach -- `lz-tpp` at
  the green step, `lz-refactor` at the refactor step. The red-green-refactor seam
  between them is the README's best one-sentence pitch for the pair.
- `plugin.json` `keywords` should gain refactoring vocabulary (`refactoring`,
  `code-smells`, `design-patterns`, `gang-of-four`, and similar) alongside the existing
  TDD terms. Exact list is D-17.
- The work-email allowlist guard is a HARD pre-commit check, not a best-effort scan.
- Verify the D-07 catalog counts against the live tree at write time. As of this
  discussion: `fowler-catalog/` 63 files, `kerievsky-catalog/` 31, `gof-catalog/` 24,
  `extra-patterns-catalog/` 6, `functional-catalog/` 20, `smells/` 28 -- each includes
  a `README.md` index, so the shippable ENTRY counts are one lower than the file counts
  (62 / 27 / 23 / 5 / ~19 / 27+1). Recount; do not transcribe these.
- An empty untracked `scratchpad/` directory sits at the repo root. Git ignores empty
  directories so it cannot be committed, and `git status` is clean -- harmless, noted
  only so a reviewer does not re-discover it as a finding.

</specifics>

<deferred>
## Deferred Ideas

- **Git tag `lz-tdd@0.0.2` + GitHub Release.** NOT in Phase 10. The roadmap's four
  Success Criteria never mention tags or releases, and the 0.0.1 precedent cut both in
  a separate `changelog-and-github-release` quick task AFTER Phase 4 closed (STATE.md,
  Quick Tasks Completed, 2026-07-04). Do the same here: close Phase 10, then run the
  quick task. D-16's link-ref intentionally points at the tag ahead of its creation.
- **Skill-effectiveness evals** (EVL-01 trigger recall/specificity; EVL-02 coach
  routing accuracy with-skill vs baseline) -> Phase 11, late and non-blocking. Any
  triggering-effectiveness or routing-accuracy finding surfaced by `skill-reviewer` in
  Phase 10 is recorded and deferred here, per D-13.
- **Full Beck *Tidy First?* tidyings catalog** -> FUT-01; requires acquiring the book
  for oracle verification. The CHANGELOG must not imply it exists (D-15).
- **Splitting the Kerievsky layer into its own `lz-refactor-to-patterns` skill** ->
  FUT-04. Tracked, not now.
- **npm packaging / additional plugins / non-TypeScript example sets** -> post-0.0.2,
  per the REQUIREMENTS "Out of Scope" table.
- None of these is scope creep into Phase 10 -- each is downstream or future by design.

</deferred>

---

*Phase: 10-Distribution & Hygiene*
*Context gathered: 2026-07-09*
