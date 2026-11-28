# Phase 19: Distribution & Hygiene - Research

**Researched:** 2026-07-20
**Domain:** Public-ship hygiene for the three-skill `lz-tdd@0.0.3` (version bump, three-skill README/CHANGELOG framing, first-party validation, ASCII/work-email/no-verbatim regression gates, targeted DST-04 clean-room re-sweep, one scoped git-history-hygiene forward-fix)
**Confidence:** HIGH

## Summary

This is a well-precedented ship phase with a near-exact analog in the shipped Phase 10 (`lz-tdd@0.0.2`
Distribution). Every HOW is locked in `19-CONTEXT.md` (D-01..D-13); the research job is to ground-truth
the current tree, confirm the regression baseline, and pin the deltas that are genuinely NEW for 0.0.3.
There is no new runtime code, no dependency install, and no new instrument to build.

Four things were verified live against the repo today (2026-07-20) and shape the plan. **First, the
entire Phase-19 baseline is already GREEN** [VERIFIED]: the `lz-red` content gate (11/11 surfaces), the
`lz-red` tsc extractor (8 modules `--strict` clean), the `lz-refactor` 10-checker battery, `check-hygiene`
(198 files ASCII+email / 191 no-verbatim), and `claude plugin validate .` + `--strict` all exit 0 (CLI
now **2.1.215**). **Second, `check-hygiene.mjs` already covers 100% of the surface Phase 19 edits** --
the whole `lz-red` tree on all three axes (added 16-01), plus `README.md`, `CHANGELOG.md`, both manifests,
and `LICENSE` (widened 10-01). So the D-07 "widen the gate" step is a **NO-OP** for 0.0.3 unless a brand-new
root prose file is introduced (none is planned); Phase 19 only RE-VERIFIES and authors new prose under the
already-widened gate. **Third, every OWNED `lz-red` surface already carries a passing `oracle-reviewer`
verdict** recorded in 16-03 / 17-VERIFICATION+17-06 / 18-06 (citations below), so the DST-04 layer-3
re-sweep is a targeted re-confirmation of a handful of surfaces on the final tree, not a whole-tree pass.
**Fourth, no full work-email token exists anywhere in the tracked tree** [VERIFIED: allowlist-inversion,
only the approved gmail present]; the GA-7 exposure (D-12) is a **bare domain** in one archived planning
meta-doc, remediated as its own scoped forward-fix commit.

**Primary recommendation:** Treat this as a documentation + regression-gate + review + one-scoped-fix
phase, NOT an instrument phase. Wave 1 (content, already gated): bump `plugin.json` 0.0.2->0.0.3 and add
`lz-red` to the two manifest descriptions + keywords; rewrite the README lead/"What this is" to three
skills and add a `## What lz-red does` section + original RED primer + link-only sources + `references/`
pointer; add the `[lz-tdd@0.0.3]` CHANGELOG entry + bottom link-ref; re-run `check-hygiene` GREEN after
each edit. Wave 2 (gates + sweep): orchestrator runs `plugin-validator` + `skill-reviewer` on `lz-red` +
the targeted DST-04 owned-surface re-sweep; re-run `validate --strict` + both batteries GREEN; triage per
D-09. GA-7 (D-12) is a **separate scoped commit** landed before the 0.0.3 push/PR to `main`.

<user_constraints>
## User Constraints (from CONTEXT.md)

> All decisions D-01..D-13 are LOCKED in `19-CONTEXT.md`. Reproduced here so the planner honors them
> verbatim. D-12 (GA-7) was operator-decided (escalated out of `--auto`); the rest auto-locked (reversible
> pre-tag edits with direct Phase-10 precedent, none in the high-impact/low-confidence trap quadrant).

### Locked Decisions

**DST-04 -- no-verbatim hygiene (load-bearing quality decision):**
- **D-01:** Phase-10 three-layer model, SCALED DOWN to the smaller, mostly-no-oracle `lz-red` tree:
  (1) **deterministic** -- the no-verbatim `(c)` gate in `check-hygiene.mjs` already covers the `lz-red`
  tree on all three axes (16-01); re-run it, extend the target set ONLY for new 0.0.3 root prose (D-07);
  (2) **attestation** -- every OWNED `lz-red` surface was individually `oracle-reviewer`-gated at authoring
  (16-03 Beck/RCM selection + F.I.R.S.T.; 17-06/17-VERIFICATION Metz matrix + Cooper + Clean Code F.I.R.S.T.;
  18-06 RCM Three-Laws spine) -- cite those verdicts as standing evidence (an undocumented attestation is
  not one); (3) **clean-room re-sweep (`oracle-reviewer` only), TARGETED** -- a DST-04 pass over the handful
  of OWNED surfaces only, not the whole tree. No-oracle leaves rest on the deterministic gate + no-verbatim
  scan (authored blind, no `.oracle/` read). NOT escalated: small tree, mostly no-oracle high-confidence
  core, every owned surface already passing -- confidence HIGH.
- **D-02:** Clean-room rule non-negotiable: **the main authoring context NEVER reads `.oracle/`.** Any
  fresh draft-vs-source comparison goes through the read-only `oracle-reviewer` subagent (own-words verdicts,
  never echoes source). "Just diff the tree against the book" is impossible by construction.

**DST-01 -- README:**
- **D-03:** README gains an `lz-red` section MIRRORING the `lz-tpp` / `lz-refactor` shape: "What lz-red
  does" (two modes -- auto-triggering RED coach; on-demand `/lz-tdd:lz-red`) + brief ORIGINAL RED primer +
  authoritative sources (link only) + a pointer into `plugins/lz-tdd/skills/lz-red/references/`. Rewrite the
  lead ("pairs two ... skills") and "What this is" listing to a THREE-skill statement framed as the completed
  red-green-refactor loop (lz-red red -> lz-tpp green -> lz-refactor refactor). Link, never inline. DST-04
  applies to the README prose (the primer is original).
- **D-04:** README MAY carry a one-line `lz-red` inventory (counts + names are FACTS). MUST NOT imply a
  complete Beck / Metz / Feathers catalog. Verify every count against the live tree at write time; do not
  transcribe.

**DST-01/DST-02 -- manifest metadata:**
- **D-05:** Bump `plugins/lz-tdd/.claude-plugin/plugin.json` `version` 0.0.2 -> 0.0.3; correct the two stale
  two-skill strings in the same file (`description` -> name `lz-red` as the third/RED skill; `keywords` ->
  add RED-phase vocabulary, exact list is D-13). Correct `.claude-plugin/marketplace.json`
  `plugins[0].description` to name all three skills. All one-line factual-accuracy edits (FIX-in-phase).
- **D-06:** Do NOT add a `version` field to `marketplace.json` (`plugin.json` wins silently, value masked,
  validator warns). Version lives in `plugin.json` only.

**DST-02 -- hygiene-gate coverage:**
- **D-07:** Authoritative gate = `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` (single
  checker; `lz-red-workspace` hosts the RED content gate + Phase-20 eval harness, NOT a second hygiene
  checker). It already walks the `lz-red` tree on all three axes (16-01). RE-VERIFY GREEN on the final tree
  and EXTEND the ASCII + work-email target set only for NEW 0.0.3 root prose (confirm README/CHANGELOG are in
  `wideTargets` -- they are). Widen a gate, never weaken one. Keep the allowlist-inversion shape. **Never
  write the work-email or its bare domain literal into any committed file** -- that is the anti-pattern D-12
  remediates.

**DST-02 -- review gates + triage:**
- **D-08:** Three review gates on the FINAL tree: (1) `claude plugin validate .` + `--strict` (HARD;
  regression gates, exit 0 today); (2) `plugin-dev` `plugin-validator` agent; (3) `plugin-dev` `skill-reviewer`
  on `lz-red` (explicit PASS required; re-confirm `lz-tpp`/`lz-refactor` only if a shared edit touches them).
  Plus `npm run check` + `npm run typecheck` GREEN. **Agent gates are ORCHESTRATOR-run** (gsd-executor has no
  Agent/Task tool) -- plan them as orchestrator gates after the executor returns.
- **D-09:** Findings triage. **FIX in Phase 19:** structural/manifest errors, security/path-traversal,
  anything breaking install or `/lz-tdd:lz-red|lz-tpp|lz-refactor` invocation, ASCII violations, broken
  reference links, malformed frontmatter, factual inaccuracies in README/CHANGELOG/LICENSE/manifests, any
  DST-04 verbatim hit. **DEFER to Phase 20 (EVL-01/02):** `description` triggering effectiveness,
  over/under-triggering, three-way cross-skill boundary, coach routing accuracy. Style suggestions recorded,
  optionally applied, never pull Phase-20 work forward.
- **D-10:** If `skill-reviewer` or the DST-04 sweep forces an edit to any `SKILL.md` (`lz-red` especially),
  that edit needs its OWN subagent review (>= 1 unbiased from-scratch) before acceptance, and `/reload-plugins`
  is a human ship action afterward (Claude cannot run it). README / CHANGELOG / manifest / checker edits are
  NOT skill-instruction files and need no such review.

**DST-01 -- CHANGELOG:**
- **D-11:** Add `## [lz-tdd@0.0.3] - <date>` in the existing Keep a Changelog shape, mirroring the 0.0.2
  entry: one-paragraph lead + `### Added` list + bottom link-ref to `.../releases/tag/lz-tdd%400.0.3`
  (percent-encoded `@`; a tag that does NOT exist yet at write time -- correct). Content: the `lz-red` skill
  (dual-mode, `/lz-tdd:lz-red`), the RED decision procedure on the Three Laws spine, the adaptive
  testing-stance router (Bernhardt / Metz / Feathers), the TS+Vitest RED mechanics, the `lz-tpp` seam +
  reverse pointer, the anti-pattern + Test Desiderata references. Link, don't inline; no complete-catalog
  implication.

**Public-repo git-history hygiene (NEW; escalated out of --auto):**
- **D-12 [OPERATOR-DECIDED -- FORWARD-FIX THE TIP]:** The maintainer work-DOMAIN needle in the archived
  `.planning/milestones/lz-tdd@0.0.2-phases/06-lz-refactor-skill-scaffold-progressive-disclosure/06-SECURITY.md`
  (the allowlist-inversion ANTI-PATTERN: the doc encodes the forbidden value as a search needle) is present on
  `origin/main` and the pushed 0.0.3 branch. Remediation: a NEW commit rewrites that doc's needle into a
  **non-encoding** allowlist-inversion form (assert only the approved gmail is present; never spell the
  forbidden value); sweep all tracked planning docs for the same anti-pattern and fix each. **NO shared-history
  rewrite of `main`** (rejected as disproportionate: rewrites public `main`, re-points the released 0.0.2 tag;
  exposure is a bare domain -- no `@local-part` -- in an archived planning meta-doc, not the shipped tree; bare-domain-in-history
  detection is out of scope for the automated detector BY DESIGN). **Runs as its OWN scoped task**, landed
  before the 0.0.3 push/PR to `main`.

### Claude's Discretion (D-13)
README section ordering / tagline / value-prop wording for the three-skill layout; whether to add a
copy-paste usage snippet or badges (ASCII, minimal); the exact `plugin.json` `keywords` list (candidates:
`unit-testing`, `vitest`, `failing-test`, `assertions`, `three-laws-of-tdd`); exact CHANGELOG bullet
granularity; whether the DST-04 owned-surface re-sweep is batched or per-surface; the order the D-08 gates
run; the exact `wideTargets` extension in `check-hygiene.mjs` (likely none needed). All HOW micro-decisions
inside the locked D-03 / D-05 / D-07 / D-08 / D-11 boundaries.

### Deferred Ideas (OUT OF SCOPE)
- Git tag `lz-tdd@0.0.3` + GitHub Release -- separate quick task AFTER Phase 19 closes (0.0.1/0.0.2 precedent).
- Skill-effectiveness evals (EVL-01 trigger incl. the three-way boundary; EVL-02 RED-behavior) -> Phase 20,
  late and non-blocking. Any triggering/routing finding `skill-reviewer` surfaces is recorded + deferred (D-09).
- The thorough `git filter-repo` history purge (GA-7 "purge from history") -- REJECTED now; revisit only if
  the exposure ever escalates to a full email (with `@local-part`).
- VIT-02 traceability reconciliation (18-05 landed the content; REQUIREMENTS still shows "Pending"/"Phase 17")
  -- a Phase-17/18-close bookkeeping item, NOT a Phase-19 gap.
- npm packaging / additional plugins / non-TypeScript example sets / outside-in RED -> post-0.0.3.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DST-01 | `plugin.json` bumped to 0.0.3; README + CHANGELOG document `lz-red` as the RED step completing the three-skill red-green-refactor loop; the marketplace listing names all three skills | Exact current file state read below: `plugin.json` `version` 0.0.2 + a two-skill `description`; `marketplace.json` two-skill `plugins[0].description`; README lead + "What this is" are two-skill; CHANGELOG top entry is `[lz-tdd@0.0.2]`. Mirror shapes identified. D-03/04/05/06/11. |
| DST-02 | `claude plugin validate . --strict` exits 0; `plugin-validator` + `skill-reviewer` both PASS on `lz-red`; `npm run check` + `npm run typecheck` stay GREEN | [VERIFIED today] validate + `--strict` exit 0 (CLI 2.1.215); both batteries GREEN; both `plugin-dev` agents on disk. Agent gates orchestrator-run (D-08). skill-reviewer will flag lz-red's 1091-char description / 147-line body -> D-09 DEFER to Phase 20. |
| DST-03 | Hygiene: ASCII-only shipped tree; no verbatim book prose / talk transcripts (own-words, DST-04 clean-room via git-ignored `.oracle/`); every TS sample `tsc --strict` clean; maintainer work-email absent (allowlist-inversion) | [VERIFIED today] `check-hygiene` 198 ASCII / 191 no-verbatim GREEN; tsc extractor 8 modules `--strict` clean; email allowlist-inversion clean (only approved gmail present, full tree). Owned surfaces attested (D-01 L2) + targeted re-sweep (D-01 L3). DST-04 axis. |
</phase_requirements>

## Architectural Responsibility Map

No runtime tiers; "responsibility" = which artifact owns each requirement surface (same shape as Phase 10).

| Capability | Primary Artifact | Secondary Artifact | Rationale |
|------------|------------------|--------------------|-----------|
| Install/usage documentation | root `README.md` | -- | GitHub landing page + `/plugin marketplace add` target (D-03) |
| Version bump (update-trigger) | `plugin.json` `version` | -- | `/plugin update` compares this; unchanged = existing installs never see `lz-red` (D-05) |
| Marketplace-listing text | `marketplace.json` `plugins[0].description` | `plugin.json` `description` | Both must name three skills (D-05) |
| Release history | root `CHANGELOG.md` | -- | Keep a Changelog record mirroring 0.0.2 (D-11) |
| ASCII + work-email + no-verbatim gate | `check-hygiene.mjs` (already covers the full surface) | full-tree `git grep` email allowlist-inversion | Deterministic tripwires over the shippable surface (D-07) |
| No-verbatim verification (semantic) | `oracle-reviewer` subagent (clean-room) | 16/17/18 attestation | Only sanctioned `.oracle/` reader; main context never reads source (D-01/02) |
| Structural correctness | `claude plugin validate . --strict` | `plugin-validator` agent | First-party hard gate + agent depth (D-08) |
| Skill quality | `skill-reviewer` agent on `lz-red` | -- | Findings triaged via D-09 (D-08) |
| Git-history hygiene forward-fix | archived `06-SECURITY.md` rewrite | full-tree email allowlist-inversion | Scoped commit, own task, before push/PR (D-12) |

## Verified Baseline (live, 2026-07-20) -- the headline delta

**The Phase-19 baseline is already GREEN.** Every gate this phase must keep green was re-run today and
passes. Phase 19 authors content UNDER these already-passing gates; it does not build or repair any instrument.

| Gate | Command | Result | Exit |
|------|---------|--------|------|
| `lz-red` content gate | `npm --prefix .claude/skills/lz-red-workspace run check` | RED-REFS GREEN -- 11/11 surfaces, all topics/fences/cross-links/absent-markers/SEAM-02/D-05-honesty PASS | 0 |
| `lz-red` tsc extractor | `npm --prefix .claude/skills/lz-red-workspace run typecheck` | RED-SAMPLES GREEN -- 8 modules `tsc --strict --noEmit` clean, 0 skipped | 0 |
| `lz-refactor` battery | `npm --prefix .claude/skills/lz-refactor-workspace run check` | 10 checkers GREEN (catalog/kerievsky/gof/extra/smells/crossrefs/principles/hygiene/functional/backing) | 0 |
| hygiene (all 3 axes) | `node .claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` | GREEN -- ASCII 198 files, no non-allowlisted emails, no-verbatim 191 files | 0 |
| first-party validator | `claude plugin validate .` | Validation passed | 0 |
| first-party validator (strict) | `claude plugin validate . --strict` | Validation passed | 0 |
| email allowlist-inversion (full tree) | `git grep -hoE '<email-regex>' -- . \| sort -u \| rg -v 'larsbrinknielsen@gmail\.com'` | only the approved gmail present; remainder empty (the apparent extras are `lz-tdd@0.0.x-*.md` milestone-tag filenames, not emails) | -- |

Environment: `claude` **2.1.215**, `node` **v24.18.0** [VERIFIED]. `plugin-dev` `plugin-validator.md` +
`skill-reviewer.md` on disk [VERIFIED].

## Standard Stack

No package installs. The "stack" is file formats, the first-party CLI, two installed review agents, the
in-repo `oracle-reviewer`, and the existing Node-builtin checker batteries -- all verified present.

| Tool / Format | Version | Purpose | Notes |
|---------------|---------|---------|-------|
| `claude plugin validate <path>` | 2.1.215 [VERIFIED] | HARD structural gate; `--strict` = warnings-as-errors | Both exit 0 today -- regression gates |
| Markdown (README / CHANGELOG) | CommonMark / GFM | Landing doc + Keep-a-Changelog history | Mirror existing 0.0.2 shapes |
| JSON (plugin.json / marketplace.json) | plugin/marketplace manifest schema | Version + identity + listing metadata | D-05 edits `version` + two descriptions + keywords; D-06 forbids marketplace `version` |
| `plugin-dev` `plugin-validator` agent | on disk [VERIFIED] | Structure/manifest/security/path-traversal | Read-only; orchestrator-run (D-08) |
| `plugin-dev` `skill-reviewer` agent | on disk [VERIFIED] | Skill quality (description, disclosure, references) | Read-only; orchestrator-run; will flag lz-red's 1091-char desc -> D-09 defer |
| `oracle-reviewer` agent | `.claude/agents/oracle-reviewer.md` | Only sanctioned `.oracle/` reader; own-words pass/revise/blocked | DST-04 layer-3 primitive; chunk-reads to EOF |
| `node` + two workspace batteries | v24.18.0 [VERIFIED] | content + tsc + hygiene checkers | GREEN as of Phase 18 close and re-verified today |

**Installation:** None. No `npm install`. Do NOT add build deps to `plugins/lz-tdd` (shipped skill stays
dependency-free Markdown; example-validation deps live only in the dev-only `*-workspace` dirs).

## Package Legitimacy Audit

**Not applicable.** This phase installs no external packages. Workspace devDependencies (`typescript@6.0.3`,
`vitest@4.1.10`) are already pinned and installed from Phases 7/16. No slopcheck / registry verification required.

## Delta Findings (what is NEW or must be re-verified for 0.0.3)

### Finding 1 -- `check-hygiene.mjs` already covers 100% of the Phase-19 edit surface (D-07 is a near-NO-OP)

Read in full (`.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs`, 229 lines). The
per-axis target sets already include everything Phase 19 touches:
- **`wideTargets`** (axes (a) ASCII + (b) work-email, `:100-124`): `lz-refactor` tree + `lz-tpp` tree +
  **entire `lz-red` tree** (`LZ_RED_SKILL_MD` + `walkMd(LZ_RED_REFERENCES)`, `:114-118`) + `ROOT_README` +
  `ROOT_CHANGELOG` + `LICENSE` + both manifests (`:120`).
- **`verbatimTargets`** (axis (c) no-verbatim, `:129-149`): `lz-refactor` tree + **entire `lz-red` tree**
  (`:139-143`) + `ROOT_README` + `ROOT_CHANGELOG` (`:145`). `lz-tpp` stays EXCLUDED (cited FibTPP by design);
  `LICENSE` + manifests excluded (verbatim/short-quoted by design).

**Consequence:** the README, CHANGELOG, both manifests, and the whole `lz-red` tree are ALREADY scanned on
their applicable axes. The D-07 "extend `wideTargets` for new 0.0.3 root prose" step is a **NO-OP** unless a
brand-new root file is introduced (none is planned -- README/CHANGELOG are the only root prose, both already
present). Phase 19's hygiene work = **re-run the gate GREEN after each content edit**, not widen it. The
Phase-10 "Wave 1 instrument" has no analog here; the instrument already exists (16-01 + 10-01).

The scan-floor control (`:160-172`) asserts `lz-refactor/SKILL.md` + both manifests exist before trusting a
clean scan -- unchanged, still valid.

### Finding 2 -- `lz-red` reference inventory (D-04), verified live

`plugins/lz-tdd/skills/lz-red/` = `SKILL.md` (147 lines) + **10 reference files** [VERIFIED via `ls`]:
- **6 flat references:** `three-laws-and-test-selection.md` (test selection), `test-structure-and-assertions.md`
  (structure + assertions), `naming.md`, `anti-patterns.md`, `vitest-typescript-mechanics.md`, `principle-backing.md`.
- **`testing-stance/`** = 1 navigation `README.md` + **3 stance leaves** (`functional-core.md` /
  `message-matrix.md` / `seams-and-legacy.md`).

**Recommended D-04 inventory phrasing (all FACTS; recount at write time, do NOT transcribe):** "test-selection,
test-structure/assertion, naming, anti-pattern, and Vitest/TypeScript mechanics references plus an adaptive
testing-stance router with three leaves (functional core / message matrix / seams + legacy)." **MUST NOT
imply a complete Beck / Metz / Feathers catalog** -- these are no-oracle high-confidence core or single-surface
owned, not exhaustive catalogs.

### Finding 3 -- Owned-surface attestation citations (D-01 layer 2), verified

Every OWNED `lz-red` surface already carries a passing `oracle-reviewer` verdict. Cite these in the phase
artifact; the targeted re-sweep (Finding 4) does not need to re-open them except to re-confirm on the final tree.

| Owned surface | Source (clean-room) | Recorded verdict | Citation |
|---------------|--------------------|------------------|----------|
| RCM Beck-lineage test selection (running list, one small step, degenerate starter, triangulation) + F.I.R.S.T. seed | Clean Code Ch. 9 / Canon TDD lineage | `oracle-reviewer` PASS, `too_close_to_source=false`, confidence 93 (2 near-verbatim reworded blind, re-gated) | `16-03-SUMMARY.md` (D1/D2 coverage) |
| Clean Code F.I.R.S.T. baseline; Metz query/command message matrix; Ian Cooper over-mock / test-per-class anti-pattern | Clean Code Ch. 9; Metz "Magic Tricks" / 99 Bottles 2e; Cooper talks | `oracle-reviewer` PASS on all owned surfaces + `skill-reviewer` PASS (>= 1 unbiased) | `17-VERIFICATION.md` "Human Verification Required" (owned surfaces PASS); gate handoff in `17-06-SUMMARY.md` D4 |
| RCM Three Laws of TDD spine (Law 1 gates entry; Law 2 sizes the test; Law 3 = lz-tpp handoff) | Clean Code Ch. 9 | `oracle-reviewer` PASS confidence 93, no tier downgrade; lz-tpp reverse-pointer unbiased review PASS; lz-red `skill-reviewer` PASS (8 properties) | `18-06-SUMMARY.md` (3 gates) + `18-VERIFICATION.md` (corroborated) |

**No-oracle leaves** (authored blind, no `.oracle/` read; rest on the deterministic gate + no-verbatim scan,
NOT a book sweep): `functional-core.md` (Bernhardt), `seams-and-legacy.md` (Feathers, cross-linked to
lz-refactor not copied), `vitest-typescript-mechanics.md`, `naming.md`, the STR/AAA-GWT structure content, and
`principle-backing.md`. These are OUT of the DST-04 book-prose re-sweep scope by construction.

### Finding 4 -- Targeted DST-04 re-sweep scope (D-01 layer 3)

The layer-3 clean-room re-sweep covers the OWNED surfaces ONLY, re-confirming on the FINAL tree:
1. RCM test-selection rows + F.I.R.S.T. block in `three-laws-and-test-selection.md` / `test-structure-and-assertions.md`.
2. Metz query/command matrix in `testing-stance/message-matrix.md`.
3. Cooper over-mock / test-per-class anti-pattern in `anti-patterns.md`.
4. RCM Three-Laws spine in `three-laws-and-test-selection.md` (+ SKILL.md step-2 compact spine).

D-13 leaves batched-vs-per-surface to the planner (these are ~4-5 surfaces across 4 files, so a single small
batch or per-file is both cheap). Per-invocation spec mirrors Phase 10: agent = `oracle-reviewer`; DRAFT input =
only the shipped surface (not whole leaves); source scope = the book via `index.md` (reviewer resolves the file);
rubric = DST-04 near-verbatim axis only; round cap = 3, escalate non-convergence to the owner; main context never
reads `.oracle/`. Any `revise` -> reword that surface BLIND from the reviewer's short directives, re-gate. A
forced `SKILL.md` edit additionally triggers D-10 (subagent review of the skill edit) + a human `/reload-plugins`.

### Finding 5 -- Three-skill README + CHANGELOG edit surface (D-03/D-04/D-11)

Exact edit points in the current files [read in full]:
- **`README.md`** -- lead (`:3-7`) says "pairs **two** ... skills: `lz-tpp` ... and `lz-refactor` ...". Rewrite
  to three skills framed as the completed loop. "What this is" (`:9-16`) lists Skill `lz-tpp` + Skill
  `lz-refactor`; add a `**Skill:** lz-red -- invoked as /lz-tdd:lz-red` bullet. Add a `## What lz-red does`
  section mirroring `## What lz-tpp does` (`:32-42`) and `## What lz-refactor does` (`:66-77`), plus a RED primer
  section mirroring `## Transformation Priority Premise` (`:44-64`) / `## Refactoring` (`:79-104`): brief
  ORIGINAL RED-phase primer + "Authoritative sources" (link only -- Beck, R.C. Martin Three Laws, Metz,
  Feathers as appropriate) + a pointer into `plugins/lz-tdd/skills/lz-red/references/`. The install block
  (`:23-30`) and `## License` (`:106-108`, public gmail) stay VERBATIM.
- **`CHANGELOG.md`** -- top entry is `## [lz-tdd@0.0.2] - 2026-07-09` (`:8`); bottom link-refs at `:63-64`.
  Add `## [lz-tdd@0.0.3] - <date>` ABOVE the 0.0.2 entry (lead + `### Added`) and a
  `[lz-tdd@0.0.3]: https://github.com/LayZeeDK/lz-engineering-claude-plugins/releases/tag/lz-tdd%400.0.3`
  link-ref ABOVE the 0.0.2 link-ref. `%40` = the percent-encoded `@`; the tag does not exist yet (correct).

### Finding 6 -- Manifest edits (D-05/D-06), verified current state

- **`plugin.json`** [read]: `"version": "0.0.2"` -> **`0.0.3`**. `description` (`:4`) already names `lz-tpp`
  (green) + `lz-refactor` (refactor) but **NOT `lz-red`** -- add the RED skill as the third step completing the
  loop. `keywords` (`:12-25`) currently 13 entries (tdd, test-driven-development, transformation-priority-premise,
  tpp, red-green-refactor, clean-code, typescript, refactoring, code-smells, design-patterns, gang-of-four,
  fowler, kerievsky); D-13 candidates to add: `unit-testing`, `vitest`, `failing-test`, `assertions`,
  `three-laws-of-tdd`. `author.email` already the public gmail.
- **`marketplace.json`** [read]: `plugins[0].description` (`:13`) names two skills (lz-tpp green + lz-refactor
  refactor) -- add `lz-red` (RED step). **No `version` field present** -- D-06: keep it that way.

### Finding 7 -- Review gates orchestrator-run + skill-reviewer defer items (D-08/D-09)

`plugin-validator` + `skill-reviewer` are `plugin-dev` SUBAGENTS (read-only), invoked by the ORCHESTRATOR
after the executor returns (gsd-executor has no Agent/Task tool -- memory `gsd-executor-cannot-spawn-subagents`;
this exact pattern held through 16-03/17-06/18-06). Only `claude plugin validate` gives a programmatic exit code.
**Expected D-09 defer item:** `skill-reviewer` will very likely flag `lz-red`'s description (**1091 chars**
[VERIFIED] > its 500-char heuristic) and possibly "body short" (147 lines) -- these are triggering-effectiveness /
content-organization concerns -> RECORD and DEFER to Phase 20 (EVL-01/02). Do NOT shorten the description or inflate
the body in Phase 19 (that pulls empirical Phase-20 work forward and fights the intentional lean design). Neither
blocks the ship. (`plugin-validator` may also warn README/LICENSE "missing" at the plugin root -- by-design for a
single-plugin marketplace; both live at repo root. Triage minor.)

### Finding 8 -- GA-7 forward-fix mechanics (D-12), no needle written

**Known instance** [read `06-SECURITY.md` in full]: the archived
`.planning/milestones/lz-tdd@0.0.2-phases/06-lz-refactor-skill-scaffold-progressive-disclosure/06-SECURITY.md`
threat-register **T-06-01 mitigation cell** proves work-email absence by embedding the forbidden **bare domain**
as an escaped search-needle inside an `rg` command string in its "VERIFIED:" evidence. That is exactly the
allowlist-inversion ANTI-PATTERN AGENTS.md forbids: encoding the forbidden value in order to detect it. (Note the
same file's T-06-03 ASCII cell uses a non-ASCII byte-class needle `[^\x00-\x7F]`, which is legitimate and needs no
change.)

**Rewrite pattern (non-encoding, own scoped commit):** replace the needle-based evidence with an
allowlist-inversion statement -- assert that enumerating every email-shaped token over the created tree and
subtracting the approved public gmail leaves an empty remainder (no other email present), WITHOUT naming the
forbidden value. The rewrite is a bare domain in an archived planning meta-doc (not the shipped tree), so it does
not touch any `SKILL.md` and needs no skill-review; it is a docs-only commit.

**Safe sweep + discovery (D-12 "fix each"):** the operator/agent holds the forbidden needle ONLY ephemerally in
the in-session command line (never committed) to grep the tracked tree for sibling instances of the same
anti-pattern, rewrites each cell to the allowlist-inversion form, then verifies with the email allowlist-inversion
(shown clean today for the whole tree -- only the approved gmail present). **CRITICAL:** never write the maintainer
work-email or its bare domain literal into any committed file -- including the plan, this research, or the rewritten
`06-SECURITY.md`. Verify absence by asserting only the approved public gmail (`larsbrinknielsen@gmail.com`) is
present; do not spell the forbidden value even as a search needle. Land before the 0.0.3 push/PR to `main`.
**Do NOT** propose a git-history rewrite -- the operator chose forward-fix (D-12; no shared-history rewrite of `main`).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Verbatim book-prose detection over real source | A main-context text diff against `.oracle/` | `oracle-reviewer` subagent (targeted re-sweep) | Main context reading `.oracle/` breaks the clean-room firewall (D-02) |
| Manifest/structure validation | Hand-check JSON + layout | `claude plugin validate . --strict` + `plugin-validator` | First-party validator knows the schema; exit 0 today |
| Skill quality review | Manual heuristic pass | `skill-reviewer` on `lz-red` | First-party agent; D-08 requires an explicit PASS |
| ASCII / work-email detection | Eyeball files | Existing `check-hygiene.mjs` (a)+(b) + full-tree `git grep` allowlist-inversion | Deterministic; already covers the whole surface; leak recurred twice in Phase 4 |
| Hygiene gate for the new prose | A new/second checker | The existing `check-hygiene.mjs` (already scans README/CHANGELOG/manifests + lz-red tree) | Widening exists; a sibling checker adds surface with no value (D-07) |
| MIT license text | Retype/paraphrase | Existing repo `LICENSE` (unchanged) | Any paraphrase risks an invalid grant |

**Key insight:** every capability this phase needs already exists as a first-party tool, an in-repo agent, or an
existing checker that already scans the exact files being edited. The work is content authoring + regression
verification + review + one scoped docs fix -- not construction.

## Common Pitfalls

### Pitfall 1: Treating D-07 as a real instrument step
**What goes wrong:** planning a "widen the hygiene gate" wave like Phase 10 did. **Reality:** `check-hygiene`
already scans README/CHANGELOG/both manifests + the whole `lz-red` tree (Finding 1). **Avoid:** plan a
re-verification (`node check-hygiene.mjs` GREEN after each edit), not a widening. Extend `wideTargets` ONLY if a
genuinely new root prose file is added (none is planned).

### Pitfall 2: The work-email / work-domain self-reference trap (recurred twice in Phase 4; GA-7 is a live instance)
**What goes wrong:** any doc stating the "work email/domain must appear nowhere" rule tends to spell the literal
(or an escaped-domain needle) while doing so -- which IS the leak (AGENTS.md: "the needle is itself a leak").
**Avoid:** reference the forbidden value only in escaped form in PRIVATE uncommitted notes; in committed files
assert only the approved gmail is present (allowlist-inversion). Run the full-tree `git grep` email
allowlist-inversion after every commit that adds a plan/summary/review/security doc. The GA-7 fix must not
reintroduce the anti-pattern it removes.

### Pitfall 3: skill-reviewer "description too long" / "body too short" pulled into scope
**What goes wrong:** a plan task that says "shorten the lz-red description" or "expand SKILL.md". **Reality:**
lz-red's description is 1091 chars (intentional three-way-guarded trigger) and SKILL.md is 147 lines (lean
progressive disclosure). **Avoid (D-09):** RECORD and DEFER these to Phase 20 (EVL-01/02). They are empirical
triggering concerns, not ship blockers.

### Pitfall 4: README / manifest / CHANGELOG drift
**What goes wrong:** README/CHANGELOG state an install command, invocation, contact, license, version, or count
that disagrees with the manifests / LICENSE / live tree. **Avoid:** lift identity verbatim (install strings from
README `:23-30`; email/URL/license from the manifests); recount the `lz-red` inventory against the tree (D-04);
post-write, `git grep` the README for `/lz-tdd:lz-red`, `/lz-tdd:lz-tpp`, `/lz-tdd:lz-refactor`, and the two
install strings to confirm presence. Confirm the CHANGELOG `%400.0.3` link-ref and the `plugin.json` `version`
agree (0.0.3).

### Pitfall 5: Reading `.oracle/` from the main context for a "quick diff"
**What goes wrong:** the DST-04 re-sweep tempts a shortcut. **Avoid:** forbidden by D-02 -- route every
draft-vs-source comparison through `oracle-reviewer`. Main context never reads book prose.

### Pitfall 6: Adding a `version` to `marketplace.json`, or bumping only one place
**What goes wrong:** duplicate `version` (plugin.json wins silently, validator warns) or forgetting the bump.
**Avoid (D-05/D-06):** bump `plugin.json` `version` to 0.0.3 ONLY; leave `marketplace.json` version-free. The
bump is the delivery mechanism -- an unchanged version makes `/plugin update` SKIP the plugin, so existing installs
never see `lz-red`.

## Runtime State Inventory

Not a code rename/migration, but two runtime-state facts are load-bearing (mirrors Phase 10):

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Update-trigger state | `plugin.json` `version` = 0.0.2 drives `/plugin update`; unchanged version makes auto-update SKIP the plugin, so existing installs never see `lz-red` | Bump to 0.0.3 (D-05) -- this IS the delivery mechanism, not cosmetic |
| Stale descriptive strings | `plugin.json` `description` + `marketplace.json` `plugins[0].description` both name only two skills (lz-tpp + lz-refactor) | Add `lz-red` (RED step) to both (D-05); factual inaccuracy = FIX-in-phase (D-09) |
| Secrets/PII in git history | The GA-7 bare-domain needle is on `origin/main` + the pushed 0.0.3 branch (D-12) | Forward-fix the tip in a scoped commit before push/PR; NO history rewrite |
| Skill-instruction live state | A forced `lz-red/SKILL.md` edit (only if the sweep/skill-reviewer demands one) needs `/reload-plugins` to go live | Human ship action (Claude cannot run it); D-10 |
| Stored data / OS-registered / build artifacts | None -- pure JSON + Markdown, no datastore, no OS registration, no build step in the shipped tree | None |

**Nothing found in stored-data / OS-registered / build-artifact categories -- verified: the shipped plugin is
dependency-free Markdown + JSON with no runtime state.**

## Validation Architecture

`nyquist_validation` is enabled (absent config key = enabled). This phase has no unit-test framework (docs +
JSON + Markdown reference content); **the deterministic gates + agent verdicts + the clean-room sweep ARE the
tests**, and all deterministic gates are already GREEN (Verified Baseline).

### Test Framework
| Property | Value |
|----------|-------|
| Framework | none (no runtime code) -- verification via first-party CLI + read-only agents + two Node-builtin checker batteries + `git grep` email allowlist-inversion + targeted clean-room `oracle-reviewer` re-sweep |
| Config file | `.claude/skills/lz-red-workspace/package.json` (`check`/`typecheck`) + `.claude/skills/lz-refactor-workspace/package.json` (`check`/`typecheck`, hosts `check-hygiene.mjs`) |
| Quick run command | `claude plugin validate . --strict` |
| Full suite command | `npm --prefix .claude/skills/lz-red-workspace run check && npm --prefix .claude/skills/lz-red-workspace run typecheck && npm --prefix .claude/skills/lz-refactor-workspace run check`, plus the two `plugin-dev` agents, plus the targeted DST-04 re-sweep |

### Phase Requirements -> Validation Map
| Req | Behavior | Type | Objective signal | Wave-0? |
|-----|----------|------|------------------|---------|
| DST-01 | version 0.0.3 + README documents lz-red (3-skill loop) + `/lz-tdd:lz-red`; marketplace lists all three | value + doc-presence | `node -e '...'`/`jq` -> `plugin.json` version == `0.0.3`; `git grep -nF '/lz-tdd:lz-red' -- README.md` present; README lead + "What this is" name three skills + a `## What lz-red does` section; `marketplace.json` description names three skills; CHANGELOG `[lz-tdd@0.0.3]` heading + `%400.0.3` link-ref present; recounted inventory matches tree | content edits not yet made |
| DST-02 | validate + `--strict` + agents PASS; batteries GREEN | gate + agent verdict | `claude plugin validate . --strict` exit 0; `plugin-validator` PASS; `skill-reviewer` PASS on lz-red (D-09-triaged); `npm run check` (both workspaces) + `npm run typecheck` exit 0 | gates already GREEN; agents run on final tree |
| DST-03 | ASCII-only; no verbatim book prose (DST-04); TS samples tsc-strict clean; work-email absent | gate + sweep + allowlist-inversion | `check-hygiene` (a)+(b)+(c) exit 0; tsc extractor exit 0 (8 modules); full-tree `git grep` email allowlist-inversion remainder empty; targeted `oracle-reviewer` re-sweep all-`pass` on the OWNED surfaces + attestation citations (16-03/17-VERIFICATION+17-06/18-06) recorded | gates already GREEN; re-sweep on final tree |

### Sampling Rate
- **Per content-edit commit:** `check-hygiene` (all 3 axes) + full-tree email allowlist-inversion `git grep`.
- **Per wave merge:** both workspace `check` batteries + `typecheck` GREEN.
- **Phase gate:** `claude plugin validate . --strict` exit 0 + `plugin-validator` + `skill-reviewer` (lz-red)
  triaged + targeted DST-04 re-sweep all-`pass` + attestation citations recorded, before `/gsd:verify-work`.
- **GA-7 gate (separate commit):** rewritten `06-SECURITY.md` carries no encoded needle; full-tree email
  allowlist-inversion remainder empty; docs-only diff.

### Wave 0 Gaps
None -- existing test infrastructure (both checker batteries + the tsc extractor + `check-hygiene` +
`claude plugin validate` + the three review agents) covers all Phase-19 requirements and is already GREEN. No
framework install, no new checker, no new test file needed (D-07 widening is a near-no-op). This is a
documentation + regression-gate + review + one-scoped-fix phase.

## Security Domain

`security_enforcement` absent in config (= enabled). Docs/licensing/manifest phase; the only live surfaces are
information disclosure (work email / work domain / PII) and manifest path safety.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Auth / V3 Session / V4 Access / V5 Input / V6 Crypto | no | -- (no runtime input, auth, or crypto) |
| V7/V8 Data protection & privacy | yes | Work-email/domain (PII) leak prevention: `check-hygiene` allowlist + full-tree `git grep` allowlist-inversion (D-07); GA-7 forward-fix removes the encoded bare-domain needle (D-12) |
| V14 Config | yes | No secrets in manifests/docs; relative `./plugins/lz-tdd` source only (no path traversal) -- `plugin-validator` |

### Known Threat Patterns for a public plugin marketplace
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Work/PII email exposed in the public repo | Information Disclosure | Allowlist-inversion in every committed doc; `check-hygiene` allowlist + full-tree `git grep` returns only the approved gmail (D-07) |
| Encoded work-domain needle in a committed doc (the allowlist-inversion anti-pattern) | Information Disclosure | GA-7 forward-fix: rewrite to a non-encoding allowlist-inversion form; never spell the forbidden value (D-12) |
| Verbatim copyrighted book prose / talk transcripts in the public tree | Information Disclosure / IP | 3-layer DST-04: deterministic `(c)` gate (GREEN) + owned-surface attestation + targeted clean-room `oracle-reviewer` re-sweep (D-01) |
| `../` / absolute paths in manifest `source` (path traversal) | Tampering | Relative `./plugins/lz-tdd` only (already compliant); `plugin-validator` verifies |

No secrets, auth, or network surface is introduced by this phase.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `claude` CLI (`plugin validate`) | DST-02 hard gate | Yes | 2.1.215 | none needed |
| `plugin-dev` `plugin-validator` agent | DST-02 | Yes (on disk) | plugin-dev | none needed |
| `plugin-dev` `skill-reviewer` agent | DST-02 | Yes (on disk) | plugin-dev | none needed |
| in-repo `oracle-reviewer` agent | DST-04 re-sweep | Yes | `.claude/agents/oracle-reviewer.md` | none (only sanctioned `.oracle/` reader) |
| `.oracle/` sources (Clean Code, Metz, Cooper) | DST-04 re-sweep of owned surfaces | Yes (per 16/17/18) | -- | owner adds a missing entry if reviewer returns `blocked` |
| `node` + both workspace batteries | DST-02 checkers/typecheck | Yes | v24.18.0 / tsc 6.0.3 / vitest 4.1.10 | none needed |
| `git grep` (PCRE) | ASCII + email allowlist-inversion | Yes | git w/ PCRE (ARM64-native) | `rg -uu` |
| Git remote `origin` -> public GitHub | install-command resolution + D-12 push target | Yes (pushed) | -- | none needed |

**Missing dependencies with no fallback:** none. **Missing dependencies with fallback:** none material.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `claude plugin validate .` / `--strict` still exit 0 on the FINAL tree (verified on today's pre-edit tree; CLI 2.1.215) | Verified Baseline | Low -- re-run at the phase gate; a regression is a D-09 FIX-now |
| A2 | `skill-reviewer` will flag lz-red's 1091-char description ("too long") and possibly "body short" per its stated heuristics | Finding 7 / Pitfall 3 | Low -- if it does not flag, the D-09 defer guidance is simply unused |
| A3 | The D-07 `wideTargets` extension is a no-op (no new root prose file in 0.0.3) | Finding 1 | Low -- if a new root file is added, add it to `wideTargets` (a one-line widen, never a weaken) |
| A4 | The targeted DST-04 re-sweep on the owned surfaces stays `pass` on the final tree (each already passed at authoring) | Finding 4 | Low -- a `revise` is reworded blind + re-gated within the 3-round cap; the surfaces are unchanged since their passing gates |
| A5 | `.planning/` is published to the public repo, so its work-domain hygiene matters (GA-7) | Finding 8 | The operator has already decided forward-fix regardless (D-12); the escaped-needle discipline holds either way |

## Sources

### Primary (HIGH confidence)
- Live repo files read in full: `README.md`, `CHANGELOG.md`, `plugins/lz-tdd/.claude-plugin/plugin.json`,
  `.claude-plugin/marketplace.json`, `plugins/lz-tdd/skills/lz-red/SKILL.md`,
  `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs`, both workspace `package.json`,
  the archived `06-SECURITY.md` (GA-7 target).
- Live commands run today (2026-07-20): both workspace `check`+`typecheck` batteries, `check-hygiene.mjs`,
  `claude plugin validate .` + `--strict` (all exit 0); `claude --version` (2.1.215), `node --version`
  (v24.18.0); full-tree email allowlist-inversion (`git grep` -> only the approved gmail); `lz-red` reference
  `ls` inventory; SKILL.md `wc -l` (147) + description length (1091 chars); `plugin-dev` agent files on disk.
- Attestation artifacts read: `16-03-SUMMARY.md`, `17-06-SUMMARY.md`, `17-VERIFICATION.md`, `18-06-SUMMARY.md`,
  `18-VERIFICATION.md`.
- Planning artifacts: `19-CONTEXT.md` (D-01..D-13), `REQUIREMENTS.md`, `STATE.md`, `10-RESEARCH.md` (Phase-10
  precedent), project `CLAUDE.md` + `AGENTS.md`.

### Secondary (MEDIUM confidence)
- Memory index: `archived-06-security-workdomain-needle-unremediated`, `public-repo-work-email-allowlist`,
  `lz-plugins-phase1-workemail-git-history-exposure`, `agent-skill-instruction-changes-need-review`,
  `reload-plugins-after-oracle-agent-changes`, `gsd-executor-cannot-spawn-subagents`, `skill-description-char-cap`.

### Tertiary (LOW confidence)
- None. All claims verified against tools or on-disk sources.

## Metadata

**Confidence breakdown:**
- Baseline / gate state: HIGH -- every gate re-run today, exit codes captured.
- Edit targets (README/CHANGELOG/manifests): HIGH -- every file read; exact line refs given.
- `lz-red` inventory: HIGH -- recounted live.
- Attestation citations: HIGH -- the three finalize-gate SUMMARY/VERIFICATION verdicts read directly.
- DST-04 re-sweep scope: HIGH -- owned vs no-oracle split taken from the 16/17/18 records.
- GA-7 mechanics: HIGH -- the anti-pattern instance read directly; fix pattern is the AGENTS.md
  allowlist-inversion rule; no needle written into this artifact.

**Research date:** 2026-07-20
**Valid until:** ~2026-08-20 (stable; the only real risk is a Claude Code CLI/agent update changing
`claude plugin validate` or the `plugin-dev` agent heuristics -- re-verify if the CLI advances materially
past 2.1.215).
