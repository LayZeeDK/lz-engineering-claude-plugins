# Phase 19: Distribution & Hygiene - Context

**Gathered:** 2026-07-20
**Status:** Ready for planning
**Mode:** --analyze --auto --chain

> Auto-discussed (`--auto`; trade-off analysis logged for the audit trail). Seven
> phase-specific gray areas. Six are reversible pre-tag Markdown / JSON / checker edits
> with DIRECT Phase-10 (0.0.2 Distribution) precedent -- none in the high-impact +
> low-confidence trap quadrant -- so `--auto` locked them to their recommended options.
> The seventh (GA-7: the archived work-domain git-history needle) is HIGH-impact
> (`origin/main` public history) + NOT-high-confidence (competing valid remediations),
> so `--auto` did NOT lock it: it was escalated to the operator and decided there
> (see D-12). Nothing below is open.

<domain>
## Phase Boundary

Make the repo publicly shippable **as a three-skill 0.0.3** (`lz-tpp` green step,
`lz-refactor` refactor step, `lz-red` red step -- completing the red-green-refactor
loop). It delivers exactly the three roadmap Success Criteria and nothing more:

1. **DST-01** -- `plugins/lz-tdd/.claude-plugin/plugin.json` `version` bumped
   `0.0.2` -> `0.0.3`; the root `README.md` + `CHANGELOG.md` document `lz-red` as the
   RED step completing the three-skill loop; the `.claude-plugin/marketplace.json`
   listing names all three skills.
2. **DST-02** -- `claude plugin validate . --strict` exits 0 AND the `plugin-dev`
   `plugin-validator` + `skill-reviewer` agents both PASS on `lz-red`; the full
   `npm run check` battery + `npm run typecheck` stay GREEN.
3. **DST-03** -- hygiene: the shipped tree is ASCII-only; no verbatim book prose or
   talk transcripts (own-words, DST-04 clean-room via git-ignored `.oracle/`); every
   TypeScript sample is `tsc --strict` clean; the maintainer work-email is absent
   (allowlist-inversion scan passes); author / committer = the public gmail.

This phase clarifies HOW to document, bump, review, and scan what already exists. It
does **not** author or re-tune any skill behavior or reference content (Phases 15-18,
all CLOSED), does **not** run trigger / behavior evals or empirically tune the `lz-red`
`description` (Phase 20, EVL-01/02), and does **not** cut a git tag or publish a GitHub
Release (see `<deferred>` -- the 0.0.1 / 0.0.2 precedent made that a separate quick task
AFTER the phase). GA-7's remediation (D-12) is a hygiene DECISION captured here but runs
as its own scoped task; it does NOT expand the DST-01/02/03 plan scope.

</domain>

<decisions>
## Implementation Decisions

Decisions carry forward from **Phase 10 (0.0.2 Distribution & Hygiene)** -- the direct
precedent -- adapted to three skills, the `0.0.3` bump, and the `lz-red` reference tree.
Phase 10's own D-01..D-17 are the template; the mapping is noted per decision.

### DST-04: the no-verbatim hygiene scan (the load-bearing quality decision)

- **D-01:** DST-04 uses the Phase-10 three-layer model, SCALED DOWN to the smaller,
  mostly-no-oracle `lz-red` tree:
  1. **Deterministic layer (hard gate, main-context safe).** The no-verbatim `(c)`
     gate in `check-hygiene.mjs` ALREADY covers the `lz-red` tree across all three axes
     (added 16-01; `LZ_RED_SKILL_DIR`, `:28-31` / `:137`); it is GREEN (198/191 files).
     Re-run it on the final tree; extend the target set only for NEW 0.0.3 root prose
     (see D-07). Never reads book prose -> runs in the normal battery.
  2. **Attestation layer (standing evidence).** Every OWNED `lz-red` surface was
     individually `oracle-reviewer`-gated at authoring time -- 16-03 (Beck/RCM selection
     + F.I.R.S.T.), 17-06 (Metz Magic-Tricks message matrix, Ian Cooper anti-patterns,
     Clean Code F.I.R.S.T.), 18-06 (RCM Three Laws spine). Cite those verdicts
     (phase SUMMARY / LEARNINGS / VERIFICATION files) as attestation for surfaces the
     targeted sweep does not re-open. An undocumented attestation is not an attestation
     -- record the citation in the phase artifact.
  3. **Clean-room re-sweep layer (`oracle-reviewer` only), TARGETED.** A DST-04 review
     pass over the handful of OWNED `lz-red` surfaces only (the Beck/RCM/Metz/Cooper
     leaves + the Three-Laws spine), not the whole tree. The no-oracle leaves
     (functional-core, seams-and-legacy, vitest mechanics, naming, structure) rest on
     the deterministic gate + the no-verbatim scan -- they were authored blind with no
     `.oracle/` read.
  **Divergence from Phase 10 (why this is NOT escalated):** Phase 10's GA-1 breadth was
  a trap-quadrant escalation because 89 mechanics steps + 29 canonical `## Intent` lines
  had PROVEN accidental collisions and no single prior gate covered them all. `lz-red`
  is the opposite: a small tree, mostly no-oracle high-confidence core, and every OWNED
  surface already carries its own passing `oracle-reviewer` verdict with no recorded
  collision. Confidence is HIGH -> auto-locked.

- **D-02:** Clean-room rule is non-negotiable: **the main authoring context NEVER reads
  `.oracle/`.** Any fresh draft-vs-source comparison is forced through the read-only
  `oracle-reviewer` subagent, which returns verdicts in its own words and never echoes
  source prose (07-ORACLE-MODEL.md; Phase 10 D-01 layer 2). This makes any
  "just diff the tree against the book" plan impossible by construction.

### DST-01: README

- **D-03:** The root `README.md` gains an `lz-red` section MIRRORING the `lz-tpp` /
  `lz-refactor` shape: a "What lz-red does" block (two modes -- auto-triggering coach at
  the RED step; on-demand reference via `/lz-tdd:lz-red`) + a brief ORIGINAL RED-phase
  primer + authoritative sources (link only) + a pointer into
  `plugins/lz-tdd/skills/lz-red/references/`. Structural update: the lead paragraph
  ("pairs two ... test-driven-development skills") and the "What this is" listing must
  become a THREE-skill statement, framed as the completed red-green-refactor loop
  (lz-red red -> lz-tpp green -> lz-refactor refactor). Link, never inline (Phase 4 D-02
  / Phase 10 D-06). DST-04 applies to the README prose itself -- the primer is original.

- **D-04:** The README MAY carry a one-line `lz-red` inventory (the test-selection /
  structure / assertion / naming references + the three testing-stance router leaves --
  counts and names are FACTS, not protected expression). It MUST NOT imply a complete
  Beck / Metz / Feathers catalog: those sources are no-oracle high-confidence core or
  single-surface owned, not exhaustive catalogs. Verify every count against the live
  tree at write time; do not transcribe counts from this file.

### DST-01/DST-02: manifest metadata

- **D-05:** Bump `plugins/lz-tdd/.claude-plugin/plugin.json` `version` `0.0.2` ->
  `0.0.3`, AND correct the two stale two-skill strings in the same file: `description`
  (today names only `lz-tpp` + `lz-refactor`) must name `lz-red` (RED step) as the third
  skill completing the loop, and `keywords` should gain RED-phase vocabulary (candidates:
  `unit-testing`, `vitest`, `failing-test`, `assertions`, `three-laws-of-tdd`; exact
  list is D-13). Also correct `.claude-plugin/marketplace.json` `plugins[0].description`
  -- the marketplace-listing text -- to name all three skills. All are one-line
  factual-accuracy edits inside DST-01's blast radius (Phase 10 D-08 precedent classifies
  factual inaccuracy as FIX-in-phase).

- **D-06:** Do **NOT** add a `version` field to `.claude-plugin/marketplace.json`.
  `plugin.json` silently wins, the marketplace value is masked, and the validator warns.
  `version` lives in `plugin.json` only. (Phase 10 D-09; project `CLAUDE.md` tech-stack
  rule.)

### DST-02: hygiene-gate coverage

- **D-07:** The authoritative gate is
  `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` (a single checker; the
  `lz-red-workspace` hosts the RED content gate + Phase-20 eval harness, NOT a second
  hygiene checker). It ALREADY walks the `lz-red` tree on all three axes (ASCII +
  work-email allowlist-inversion + no-verbatim; 16-01). Phase 19 RE-VERIFIES it is GREEN
  on the final tree and EXTENDS the ASCII + work-email target set to cover any NEW 0.0.3
  root prose it does not already reach (root `README.md` / `CHANGELOG.md` -- confirm they
  are in `wideTargets`; both manifests + `LICENSE` were widened in 10-01). Widen a gate,
  never weaken one (Phase 9 T-09-GATE). Keep the allowlist-inversion shape (enumerate
  every email-shaped token, subtract the approved public gmail, assert the remainder is
  empty). **Never write the work-email or its bare domain literal into any committed file
  -- not a checker, not a plan, not this context file.** That is exactly the anti-pattern
  D-12 remediates.

### DST-02: review gates and findings triage

- **D-08:** Three review gates, all required on the FINAL tree (Phase 10 D-12, retargeted):
  1. `claude plugin validate .` and `claude plugin validate . --strict` -- the
     first-party CLI, HARD gate. Exit 0 on today's tree (prior phases), so these are
     REGRESSION gates; re-run after the manifest / README / CHANGELOG land.
  2. `plugin-dev`'s `plugin-validator` agent (structure / manifest / security /
     path-traversal).
  3. `plugin-dev`'s `skill-reviewer` agent on `lz-red` -- MUST reach an explicit PASS.
     Re-confirm `lz-tpp` / `lz-refactor` only if a shared edit touches them.
  Plus the full `npm run check` battery + `npm run typecheck` (`tsc --strict`) stay GREEN.
  **These agent gates are ORCHESTRATOR-run** -- the `gsd-executor` has no Agent/Task tool
  (memory `gsd-executor-cannot-spawn-subagents`); plan them as orchestrator gates after
  the executor returns, not as executor tasks.

- **D-09:** Findings triage (Phase 10 D-13, with Phase 20 substituted for Phase 11).
  **FIX in Phase 19:** structural / manifest errors, security or path-traversal issues,
  anything breaking install or `/lz-tdd:lz-red` / `/lz-tdd:lz-tpp` / `/lz-tdd:lz-refactor`
  invocation, ASCII violations, broken reference links, malformed frontmatter, factual
  inaccuracies in README / CHANGELOG / LICENSE / manifests, and any DST-04 verbatim hit.
  **DEFER to Phase 20 (EVL-01/02):** any finding about `description` triggering
  effectiveness, over- / under-triggering, the three-way cross-skill boundary, or coach
  routing accuracy -- these are empirical-tuning concerns the roadmap isolates in the
  late, non-blocking eval phase. Style suggestions are recorded, optionally applied,
  never allowed to pull Phase-20 empirical work forward.

- **D-10:** If `skill-reviewer` or the DST-04 sweep forces an edit to any `SKILL.md`
  (`lz-red` especially), that edit needs its OWN subagent review (>= 1 unbiased
  from-scratch) before acceptance (memory `agent-skill-instruction-changes-need-review`),
  and `/reload-plugins` is a human ship action afterward (Claude cannot run it; memory
  `reload-plugins-after-oracle-agent-changes`). README / CHANGELOG / manifest / checker
  edits are NOT skill-instruction files and need no such review.

### DST-01: CHANGELOG

- **D-11:** Add `## [lz-tdd@0.0.3] - <date>` to `CHANGELOG.md` in the existing Keep a
  Changelog shape, mirroring the 0.0.2 entry: a one-paragraph lead, an `### Added` list,
  and a bottom link-ref to the release-tag URL (`.../releases/tag/lz-tdd%400.0.3` --
  percent-encoded `@`, a tag that does NOT exist yet at write time; correct, matches what
  0.0.1 / 0.0.2 did). Content: the `lz-red` skill (dual-mode coach + reference,
  `/lz-tdd:lz-red`), the RED decision procedure on the Three Laws of TDD spine, the
  adaptive testing-stance router (Bernhardt functional-core / Metz message-matrix /
  Feathers seams+legacy), the TypeScript + Vitest RED mechanics, the `lz-tpp` seam +
  reverse pointer, and the anti-pattern + Test Desiderata references. Link, don't inline;
  do not imply a complete Beck / Metz / Feathers catalog.

### Public-repo git-history hygiene (NEW; escalated out of --auto)

- **D-12:** **[OPERATOR-DECIDED 2026-07-20 -- escalated out of `--auto`, then locked:
  FORWARD-FIX THE TIP.]** The maintainer work-DOMAIN needle in
  `.planning/milestones/lz-tdd@0.0.2-phases/06-lz-refactor-skill-scaffold-progressive-disclosure/06-SECURITY.md`
  -- the allowlist-inversion ANTI-PATTERN where the doc encodes the forbidden value as a
  search needle -- is present on `origin/main` public history (entered `75ba6b0`
  "docs(phase-6): add security threat verification"; archived to `milestones/` at
  `7c46b0a`) and on the pushed 0.0.3 branch. Remediation:
  - A NEW commit rewrites that doc's needle into a **non-encoding** allowlist-inversion
    form (assert only the approved gmail is present; never spell the forbidden value).
    Sweep all tracked planning docs for the same anti-pattern; fix each.
  - **NO shared-history rewrite of `main`.** The thorough `git filter-repo --replace-text`
    + `push --force-with-lease` option was REJECTED as disproportionate: it rewrites
    PUBLIC `main` (CLAUDE.md "never rewrite `main` casually") and re-points the released
    `lz-tdd@0.0.2` tag SHAs. The exposure is a bare domain (no `@local-part`) in an
    archived planning meta-doc -- NOT the shipped plugin tree -- and bare-domain-in-history
    detection is out of scope for the automated allowlist detector BY DESIGN (ordinary
    URLs make a domain allowlist impractical; AGENTS.md).
  - **Runs as its OWN scoped task**, not folded into the DST-01/02/03 skill-authoring
    plans (like the tag/release quick task). Land it before the 0.0.3 push/PR to `main`.
  Escalated because it is HIGH-impact (public `main` history) + NOT-high-confidence
  (three valid remediations) -- the documented `--auto` trap quadrant. Refs: memories
  `archived-06-security-workdomain-needle-unremediated`, `public-repo-work-email-allowlist`,
  `lz-plugins-phase1-workemail-git-history-exposure`.

### Claude's Discretion (deferred to research / planning)

- **D-13:** README section ordering / tagline / value-prop wording for the three-skill
  layout; whether to add a copy-paste usage snippet or badges (ASCII, minimal); the exact
  `plugin.json` `keywords` list; exact CHANGELOG bullet granularity; whether the DST-04
  owned-surface re-sweep (D-01 layer 3) is batched or per-surface; the order the D-08
  gates run; the exact `wideTargets` extension in `check-hygiene.mjs` (D-07). All HOW
  micro-decisions inside the locked D-03 / D-05 / D-07 / D-08 / D-11 boundaries.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Roadmap and requirements (PRIMARY)
- `.planning/ROADMAP.md` -> "Phase 19: Distribution & Hygiene" -- goal, dependency on
  Phase 18, the three Success Criteria.
- `.planning/REQUIREMENTS.md` -> "Distribution and hygiene (DST)" (DST-01, DST-02,
  DST-03), the "Out of Scope" table (no new build deps; verbatim prose banned), and the
  Future Requirements (bound the CHANGELOG's Beck / Metz claims).

### Direct precedent -- the 0.0.2 Distribution phase (READ FIRST)
- `.planning/milestones/lz-tdd@0.0.2-phases/10-distribution-hygiene/10-CONTEXT.md` --
  the template for every decision above: D-01 (three-layer DST-04), D-05/D-06 (README
  link-don't-inline), D-08/D-09 (manifest bump + factual-accuracy FIX rule), D-10/D-11
  (widened hygiene gate + allowlist shape), D-12/D-13 (three review gates + findings
  triage), D-15/D-16 (CHANGELOG shape + not-yet-cut tag link).
- `.planning/milestones/lz-tdd@0.0.1-phases/04-distribution-hygiene/04-CONTEXT.md` and
  `04-RESEARCH.md` -- the ORIGINAL link-don't-inline rule and the non-self-tripping
  work-email allowlist needle (do NOT re-derive it).

### The DST-04 clean-room model (binding on D-01 / D-02)
- `.planning/milestones/lz-tdd@0.0.2-phases/07-fowler-catalog-refactoring-2nd-ed/07-ORACLE-MODEL.md`
  -- the clean-room `oracle` / `oracle-reviewer` loop; **the main context never reads
  `.oracle/`.**
- `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` -- `:28-31` / `:137`
  the `lz-red` tree already in all three axes; the `wideTargets` set D-07 extends; the
  no-verbatim `(c)` gate D-01 layer 1 relies on.

### lz-red owned-surface attestation (D-01 layer 2)
- `.planning/phases/16-source-distillation-core-red-references/` SUMMARY + LEARNINGS +
  VERIFICATION -- the Beck/RCM selection + F.I.R.S.T. `oracle-reviewer` verdicts.
- `.planning/phases/17-assertion-design-stance-router-ts-vitest-mechanics/` (17-06 gate)
  -- the Metz message-matrix, Ian Cooper, and Clean Code F.I.R.S.T. owned-surface verdicts.
- `.planning/phases/18-coach-procedure-lz-tpp-seam-wiring/` (18-06 gate) -- the RCM
  Three-Laws spine owned-surface verdict.

### Edit targets
- `README.md` (repo root) -- D-03, D-04. Today it documents two skills (`:1-15`).
- `CHANGELOG.md` (repo root) -- D-11. The `lz-tdd@0.0.2` entry (`:8`) is the shape to mirror.
- `plugins/lz-tdd/.claude-plugin/plugin.json` -- D-05 (`version` `0.0.2` -> `0.0.3`,
  `description`, `keywords`). Currently `0.0.2`.
- `.claude-plugin/marketplace.json` -- D-05 (`plugins[0].description`); D-06 (no `version`).
- `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` + the workspace
  `package.json` `npm run check` battery -- D-07.

### GA-7 remediation target (D-12; scoped task, not a skill plan)
- `.planning/milestones/lz-tdd@0.0.2-phases/06-lz-refactor-skill-scaffold-progressive-disclosure/06-SECURITY.md`
  -- the archived doc carrying the work-domain needle to forward-fix.

### Artifacts documented / reviewed (do not edit unless a gate forces it)
- `plugins/lz-tdd/skills/lz-red/SKILL.md` (147 lines) + its `references/` tree -- in
  scope for `skill-reviewer` (D-08) and all three hygiene axes.
- `plugins/lz-tdd/skills/lz-tpp/` and `plugins/lz-tdd/skills/lz-refactor/` -- in scope
  for ASCII + email; `lz-tpp` OUT of scope for the DST-04 book-prose axis (cited-verbatim
  TPP list, Phase 10 D-04).
- `LICENSE` (repo root, MIT) -- stays MIT; contact stays the public gmail.

### Project-level constraints
- `.planning/PROJECT.md` Key Decisions; `CLAUDE.md` + `AGENTS.md` (project) --
  ASCII-only committed output, the public contact, the work-email prohibition +
  allowlist-inversion detection rule, the "`version` in `plugin.json` only" rule (D-06),
  the "never rewrite `main` casually" remediation tree (D-12).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`check-hygiene.mjs`** already implements all three DST-03 axes (ASCII byte scan;
  email allowlist-subtraction; no-verbatim gate) AND already walks the `lz-red` tree
  (16-01). D-07 only re-verifies + extends the `wideTargets` set for new root prose.
  Do not rewrite it.
- **The `oracle-reviewer` agent** is the ONLY sanctioned reader of `.oracle/`; returns
  own-words `pass | revise | blocked` verdicts. The DST-04 layer-3 primitive (D-01).
- **The 0.0.1 + 0.0.2 README / CHANGELOG** are the tone, structure, and Keep-a-Changelog
  templates to mirror; both written under the same hygiene rules.
- **The `npm run check` battery + `npm run typecheck`** are GREEN as of Phase 18's close
  -- the Phase-19 baseline.

### Established Patterns
- **Instrument-first / Nyquist:** the hygiene + content gates were built to a RED
  baseline before content; for Phase 19 they exist and are GREEN -- this is a
  documentation + regression-gate phase, not a new-instrument phase.
- **Clean-room DST-04:** the main context never reads book prose; `oracle-reviewer` does.
- **Link, don't inline:** README / CHANGELOG point at `references/`; `references/` holds
  the content.
- **Widen a gate, never weaken one** (T-09-GATE).
- **Orchestrator runs agent gates:** `plugin-validator` / `skill-reviewer` /
  `oracle-reviewer` are spawned by the orchestrator AFTER the executor returns (the
  executor has no Agent tool).

### Integration Points
- `plugin.json` `version` is what `/plugin update` compares; an unchanged version makes
  auto-update SKIP the plugin, so DST-01's bump is how existing installs ever see
  `lz-red`.
- `README.md` install commands target `.claude-plugin/marketplace.json`; the remote
  `github.com/LayZeeDK/lz-engineering-claude-plugins` is wired + pushed, so the documented
  `/plugin marketplace add` command resolves.
- The GA-7 forward-fix (D-12) is a standalone commit on the 0.0.3 branch, landed before
  the push/PR to `main`; it touches an archived planning meta-doc only, not the shipped
  tree or any `SKILL.md`.
- This is the last GATING phase for the public 0.0.3 ship. Phase 20 (evals) is explicitly
  non-blocking and runs after.

</code_context>

<specifics>
## Specific Ideas

- The README install block is unchanged from 0.0.1 / 0.0.2 and stays verbatim:
  `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins`, then
  `/plugin install lz-tdd@lz-engineering-claude-plugins`.
- Three invocations to document: `/lz-tdd:lz-red` (RED step), `/lz-tdd:lz-tpp` (green
  step), `/lz-tdd:lz-refactor` (refactor step) -- each also auto-triggers as a coach.
  The red-green-refactor loop is the README's one-sentence pitch for the trio.
- Verify D-04 inventory counts against the live `lz-red/references/` tree at write time;
  do not transcribe.
- The work-email allowlist guard is a HARD pre-commit check, not a best-effort scan.
- GA-7 (D-12) edits `06-SECURITY.md` to remove the encoding anti-pattern; the fix itself
  must NOT spell the forbidden value -- assert only the approved gmail is present.

</specifics>

<deferred>
## Deferred Ideas

- **Git tag `lz-tdd@0.0.3` + GitHub Release.** NOT in Phase 19. The Success Criteria
  never mention tags/releases; 0.0.1 and 0.0.2 both cut them in a separate quick task
  AFTER the distribution phase closed. Do the same: close Phase 19, then run the quick
  task. D-11's link-ref intentionally points at the tag ahead of its creation.
- **Skill-effectiveness evals** (EVL-01 trigger recall/specificity incl. the three-way
  cross-skill boundary; EVL-02 RED-behavior accuracy vs baseline) -> Phase 20, late and
  non-blocking. Any triggering / routing finding `skill-reviewer` surfaces in Phase 19 is
  recorded and deferred here, per D-09.
- **The thorough `git filter-repo` history purge** (GA-7 "Purge from history" option) --
  REJECTED now as disproportionate (D-12); revisit ONLY if the exposure ever escalates to
  a full-email (with `@local-part`) rather than a bare domain.
- **VIT-02 traceability reconciliation.** STATE records VIT-02's content landed in 18-05
  (the SKILL.md worked example) while REQUIREMENTS still shows it "Pending" under Phase
  17. That is a Phase-17/18-close bookkeeping item, NOT Phase 19 scope -- do not treat it
  as a Phase-19 gap.
- **npm packaging / additional plugins / non-TypeScript example sets / outside-in RED**
  -> post-0.0.3, per the REQUIREMENTS Out-of-Scope + Future Requirements tables.
- None of these is scope creep into Phase 19 -- each is downstream or future by design.

</deferred>

---

*Phase: 19-distribution-hygiene*
*Context gathered: 2026-07-20*
