# Phase 10: Distribution & Hygiene - Research

**Researched:** 2026-07-09
**Domain:** Public-ship hygiene for a Claude Code plugin marketplace (version bump, README/CHANGELOG authoring, first-party review, ASCII/work-email/no-verbatim gating, clean-room DST-04 book-prose sweep)
**Confidence:** HIGH

## Summary

This is a documentation + manifest-metadata + harness-hardening + first-party-review phase over an
already-built, already-validating, already-hygiene-clean tree. Every decision (D-01..D-17) is LOCKED
in CONTEXT.md; the research job is to ground-truth the exact current file state, recount the catalog
inventory, and specify the three DST-04 scan layers precisely enough to be executable. There is no
new runtime code and no external dependency install.

Four things were verified live against the repo during research and shape the plan. First, the
D-10 widened hygiene target set (both skill trees + root README.md/CHANGELOG.md/LICENSE + both
manifests) is **already ASCII-clean and work-email-absent today** [VERIFIED], so widening the gate is a
pure regression-gate move that catches issues only in the NEW Phase-10 prose -- it discovers no
existing problem. Second, `claude plugin validate .` / `--strict` were confirmed exit-0 during
discussion (2026-07-09) and the CLI is now 2.1.205 [VERIFIED]; they are regression gates, not open
risk. Third, the catalog counts were recounted against the live tree and differ from a naive
"files minus one README" for two catalogs (Kerievsky has 3 walkthrough files; smells/ has no in-dir
README). Fourth, the two proven-collision surfaces the D-03 sweep targets are exactly 28 `## Intent`
lines (23 GoF + 5 extra) and 89 `## Mechanics` step lists (62 Fowler + 27 Kerievsky) [VERIFIED].

**Primary recommendation:** Follow instrument-first ordering. Wave 1 lands the D-01-layer-1 hardened
`(c)` gate + the D-10 target-set widening in `check-hygiene.mjs` (GREEN on today's tree = regression
baseline). Wave 2 writes the manifest edits (D-08/D-09), the README lz-refactor section + inventory
(D-05/06/07), and the CHANGELOG 0.0.2 entry (D-15/16) -- all now covered by the widened gate as they
land. Wave 3 runs the DST-04 clean-room `oracle-reviewer` sweep (surfaces only, batched by chapter,
~15-20 invocations), records the layer-3 attestation citation, and runs the D-12 gate battery
(`validate` + `--strict`, `plugin-validator`, `skill-reviewer` on BOTH skills, `npm run check` +
`npm run typecheck` GREEN). Triage findings per D-13; review any forced SKILL.md edit per D-14.

<user_constraints>
## User Constraints (from CONTEXT.md)

> All decisions D-01..D-17 are LOCKED. This section reproduces them so the planner honors them
> verbatim. The full rationale lives in `10-CONTEXT.md`.

### Locked Decisions

**DST-04 -- the no-verbatim hygiene scan (load-bearing):**
- **D-01:** Three-layer scan -- (1) deterministic layer: promote `check-hygiene.mjs`'s `(c)`
  no-verbatim heuristic from WARN to a real gate and widen it beyond long double-quoted runs to the
  surfaces that empirically collide (source-free, runs in the normal battery); (2) clean-room layer:
  a DST-04-only `oracle-reviewer` pass over a risk-ranked subset -- **main context MUST NEVER read
  `.oracle/`**; (3) attestation layer: cite the per-leaf `oracle-reviewer` verdicts already recorded
  in Phase 7/8/8.1 SUMMARY/LEARNINGS for leaves the sweep does not re-open (record the citation in
  the phase artifact -- an undocumented attestation is not one). `check-hygiene.mjs:8` names "the
  Phase-10 hygiene scan" as the authoritative no-verbatim gate, so this phase cannot defer to the
  checker.
- **D-02:** Known-collision surfaces (target these first): canonical one-line pattern `## Intent`
  lines (GoF + extra); short imperative mechanics step lists (Fowler + Kerievsky); `Applicability`
  first lines mirrored into `gof-catalog/README.md`.
- **D-03 [OPERATOR-DECIDED, LOCKED]:** Layer-2 sweep breadth = both proven collision surfaces across
  all leaves, surface-scoped: every `## Intent` line in gof-catalog + extra-patterns-catalog; every
  mechanics step list in fowler-catalog + kerievsky-catalog. Surfaces only (not motivation, examples,
  or Consequences -- those rest on attestation). Batch by chapter (one invocation per chapter),
  ~15-20 subagent invocations, not ~120.
- **D-04:** DST-04's book-prose axis is scoped to the `lz-refactor` tree
  (`plugins/lz-tdd/skills/lz-refactor/`) plus NEW Phase-10 prose (README primer, CHANGELOG entry).
  It does NOT extend to `lz-tpp` (its `transformations.md` carries the verbatim cited FibTPP list --
  a different source/license, shipped in 0.0.1; MUST NOT scrub it). The ASCII + work-email axes DO
  extend to `lz-tpp` (D-10).

**DST-01 -- README:**
- **D-05:** README gains an `lz-refactor` section MIRRORING the `lz-tpp` shape: a "What lz-refactor
  does" block (two modes: auto-triggering coach at the refactor step; on-demand reference via
  `/lz-tdd:lz-refactor`) + a brief ORIGINAL refactoring primer + authoritative book sources (link
  only) + a pointer into `references/`. The "What this is" bullet list becomes a two-skill listing;
  the title/lead must stop claiming the plugin ships only `lz-tpp`. Ordering/wording = D-17.
- **D-06:** Carry Phase-4 D-02 forward: link the sources, never inline them. Cite the two books by
  title + author + publisher/ISBN link; point at `references/`. Do NOT inline catalog entries,
  mechanics, smell tables, or examples. DST-04 applies to the README itself -- the primer is
  original prose.
- **D-07:** README MAY carry a one-line catalog inventory (counts + names are FACTS, not protected
  expression). MUST NOT imply a complete Beck or Feathers catalog (those three refs are no-oracle,
  high-confidence-core-only, FUT-01). Verify every count against the tree at write time; do not copy
  counts from CONTEXT.

**DST-01/DST-02 -- manifest metadata:**
- **D-08:** Bump `plugins/lz-tdd/.claude-plugin/plugin.json` `version` to `0.0.2`, AND correct the two
  stale one-skill strings in the same file (`description`, `keywords`). Also correct
  `.claude-plugin/marketplace.json` `plugins[0].description`. All three currently mis-describe a
  two-skill plugin; factual inaccuracy is FIX-in-phase (Phase-4 D-06).
- **D-09:** Do NOT add a `version` field to `.claude-plugin/marketplace.json` (documented trap:
  `plugin.json` wins silently, marketplace value masked, validator warns). Version lives in
  `plugin.json` only.

**DST-02 -- hygiene-gate coverage:**
- **D-10:** Widen `check-hygiene.mjs`'s ASCII + work-email walk. Today it walks ONLY the `lz-refactor`
  skill, leaving the exact files this phase writes (README/CHANGELOG/plugin.json/marketplace.json) and
  all of `lz-tpp` UNGATED. Widen to: both skill trees, repo-root README.md/CHANGELOG.md/LICENSE, and
  both manifests. Widening a gate is strictly safer and freezes no contract.
- **D-11:** Keep the allowlist shape of the email check (enumerate every email-shaped token, subtract
  the approved public contact `larsbrinknielsen@gmail.com`, assert the remainder is empty). NEVER
  write the work-email literal into any committed file. The non-self-tripping needle is documented in
  `04-RESEARCH.md`.

**DST-02 -- review gates and triage:**
- **D-12:** Three required gates (retargeted to 0.0.2): (1) `claude plugin validate .` and `--strict`
  (HARD; both exit 0 today -> regression gates); (2) `plugin-dev`'s `plugin-validator` agent (not run
  this milestone); (3) `plugin-dev`'s `skill-reviewer` agent on BOTH skills (09-04's PASS was
  pre-README/pre-bump and never covered `lz-tpp`). Plus `npm run check` + `npm run typecheck` GREEN.
- **D-13:** Findings triage (Phase-4 D-06, Phase 11 substituted for Phase 5). FIX now:
  structural/manifest errors, security/path-traversal, anything breaking install or
  `/lz-tdd:lz-refactor` / `/lz-tdd:lz-tpp` invocation, ASCII violations, broken reference links,
  malformed frontmatter, factual inaccuracies in README/CHANGELOG/LICENSE/manifests. DEFER to Phase 11:
  `description` triggering effectiveness, over/under-triggering, coach routing accuracy. Ship blockers
  = errors + security + broken install/invocation + ASCII violations + a DST-04 verbatim hit.
- **D-14:** If `skill-reviewer` or the DST-04 sweep forces an edit to either SKILL.md, that edit needs
  its own subagent review before acceptance (memory `agent-skill-instruction-changes-need-review`).
  README/CHANGELOG/manifest/checker edits need no such review and no `/reload-plugins`.

**DST-03 -- CHANGELOG:**
- **D-15:** Add `## [lz-tdd@0.0.2] - <date>` in the existing Keep a Changelog shape, mirroring the
  0.0.1 entry: one-paragraph lead, `### Added` list, bottom link-ref to the release-tag URL. Content:
  the `lz-refactor` skill (dual-mode coach + reference, `/lz-tdd:lz-refactor`), the five reference
  catalogs, the unified smell taxonomy, the coach decision procedure, and the three no-oracle
  principle-backing references (tagged core-only, no complete Beck/Feathers catalog claimed). Same
  "link, don't inline" rule.
- **D-16:** The bottom link-ref points at `.../releases/tag/lz-tdd%400.0.2` -- a tag that does NOT
  exist yet (correct; matches 0.0.1). Cutting the tag/Release is NOT this phase.

### Claude's Discretion (D-17)
README section ordering, tagline/value-prop wording, whether to include a copy-paste usage snippet,
any badges (keep ASCII, keep minimal). Exact `keywords` list in `plugin.json`. Exact CHANGELOG bullet
granularity. Whether the hardened DST-04 detector extends `check-hygiene.mjs` or lands as a sibling
checker. The order the three D-12 review gates run in. All HOW micro-decisions inside the locked
D-05/D-08/D-10/D-15 boundaries.

### Deferred Ideas (OUT OF SCOPE)
- Git tag `lz-tdd@0.0.2` + GitHub Release -- separate quick task AFTER Phase 10 closes.
- Skill-effectiveness evals (EVL-01/02) -> Phase 11, late and non-blocking.
- Full Beck *Tidy First?* tidyings catalog -> FUT-01.
- Splitting the Kerievsky layer into its own skill -> FUT-04.
- npm packaging / additional plugins / non-TS example sets -> post-0.0.2.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DST-01 | `plugin.json` version bumped to `0.0.2`; root `README.md` documents `lz-refactor` (what it does + `/lz-tdd:lz-refactor`) alongside `lz-tpp` | Exact current `plugin.json` (`version` 0.0.1, one-skill `description`/`keywords`) + README structure read below; mirror shape from the existing `## What lz-tpp does` section (README:29-61); install block unchanged (README:24-27). D-05/06/07/08/09. |
| DST-02 | Passes `claude plugin validate .` + `--strict` + first-party review (plugin-validator + skill-reviewer); work email absent, MIT, ASCII-only | CLI 2.1.205 verified installed; both agents on disk [VERIFIED]; widened D-10 target set already ASCII-clean + work-email-absent today [VERIFIED]; agent heuristics read (unchanged from Phase 4). D-10/11/12/13/14. |
| DST-03 | `CHANGELOG.md` gains an `lz-tdd@0.0.2` entry describing `lz-refactor` | Exact 0.0.1 entry shape read below (CHANGELOG:8-32): lead paragraph + `### Added` + bottom link-ref. D-15/16. |
| DST-04 | No verbatim Fowler/Kerievsky/GoF prose or code listings in the shipped tree -- original prose/code/names/facts only | Three-layer design specced below; `.oracle/` book dirs confirmed present (refactoring-2e, refactoring-to-patterns, design-patterns); surface counts verified (28 Intents, 89 mechanics); attestation artifacts confirmed present. D-01/02/03/04. |
</phase_requirements>

## Architectural Responsibility Map

No runtime tiers; "responsibility" = which artifact owns each requirement's surface.

| Capability | Primary Artifact | Secondary Artifact | Rationale |
|------------|------------------|--------------------|-----------|
| Install/usage documentation | root `README.md` | -- | GitHub landing page + `/plugin marketplace add` target (D-05) |
| Version bump (update-trigger) | `plugin.json` `version` | -- | `/plugin update` compares this; unchanged = existing installs never see `lz-refactor` (D-08) |
| Marketplace-listing text | `marketplace.json` `plugins[0].description` | `plugin.json` `description` | Listing text vs manifest text -- both must describe two skills (D-08) |
| Release history | root `CHANGELOG.md` | -- | Keep a Changelog record mirroring 0.0.1 (D-15) |
| ASCII + work-email gate | `check-hygiene.mjs` (a)+(b), widened | full-tree `git grep` post-commit check | Deterministic tripwires over the shippable surface (D-10/11) |
| No-verbatim gate (deterministic) | `check-hygiene.mjs` (c), hardened to a gate | -- | Source-free stylistic-proxy detector, runs in the normal battery (D-01 layer 1) |
| No-verbatim verification (semantic) | `oracle-reviewer` subagent (clean-room) | Phase 7/8/8.1 attestation | Only sanctioned `.oracle/` reader; main context never reads source (D-01 layers 2-3) |
| Structural correctness | `claude plugin validate . --strict` | `plugin-validator` agent | First-party hard gate + agent depth (D-12) |
| Skill quality | `skill-reviewer` agent (both skills) | -- | Findings triaged via D-13 (D-12) |

## Standard Stack

No package installs. The "stack" is file formats, the first-party CLI, two installed review agents,
and the existing Node-builtin checker battery -- all verified present.

### Core
| Tool / Format | Version | Purpose | Notes |
|---------------|---------|---------|-------|
| `claude plugin validate <path>` | Claude Code 2.1.205 [VERIFIED installed] | Hard structural gate; `--strict` treats warnings as errors | Both exit 0 on today's tree per D-12 (verified 2026-07-09) -- regression gate |
| Markdown (README.md / CHANGELOG.md) | CommonMark / GitHub-flavored | Landing doc + Keep-a-Changelog history | Mirror existing shapes read below |
| JSON (plugin.json / marketplace.json) | plugin/marketplace manifest schema | Version + identity + listing metadata | D-08 edits three strings + one version; D-09 forbids a marketplace `version` |
| `plugin-dev` `plugin-validator` agent | claude-plugins-official (on disk) [VERIFIED] | Structure/manifest/security/path-traversal review | `tools: Read, Grep, Glob, Bash`; read-only. Step 9 checks plugin-root README/LICENSE; step 10 security |
| `plugin-dev` `skill-reviewer` agent | claude-plugins-official (on disk) [VERIFIED] | Skill quality (description, disclosure, references) | `tools: Read, Grep, Glob`; read-only. Heuristics: description >500 chars = "too long"; body 1,000-3,000 words |
| `oracle-reviewer` agent | in-repo `.claude/agents/oracle-reviewer.md` | Only sanctioned `.oracle/` reader; returns pass/revise/blocked in its own words | Never echoes source prose; chunk-reads to EOF (memory `oracle-reviewer-large-chapter-read-cap`) |

### Supporting (verification tooling, already present)
| Tool | Version | Purpose |
|------|---------|---------|
| `node` | v24.18.0 [VERIFIED] | Runs the checker battery + `extract-samples.mjs` typecheck |
| `npm run check` | workspace battery (10 checkers) | Full gate; GREEN as of Phase 9 close |
| `npm run typecheck` | `extract-samples.mjs` (tsc@6.0.3, `--strict`) | 251 modules GREEN as of Phase 9 |
| `git grep -P` / `-E` | git w/ PCRE (ARM64-native) | ASCII gate + work-email guard (CLAUDE.md-preferred over `grep`) |

**Installation:** None. No `npm install`. This phase edits text/JSON files, hardens one existing
checker, and runs already-installed tools.

## Package Legitimacy Audit

**Not applicable.** This phase installs no external packages (npm/PyPI/crates). The workspace's sole
devDependency (`typescript@6.0.3`) is already pinned and installed from Phase 7. No slopcheck /
registry verification required.

## Ground-Truth Current File State (verified 2026-07-09)

### `README.md` (repo root, 65 lines) -- the mirror shape D-05 must follow
- **Title + lead (`:1-5`):** "The first plugin, `lz-tdd`, ships `lz-tpp` -- a test-driven-development
  coach and reference for ... TPP." **This lead claims a one-skill plugin -- D-05 requires rewording.**
- **`## What this is` (`:7-18`):** a 3-bullet list -- Marketplace / Plugin / **Skill: `lz-tpp`**. The
  bullet list is single-skill; D-05 requires a two-skill listing (add `lz-refactor`).
- **`## Installation` (`:21-27`):** the two `/plugin` commands. **Unchanged (stays verbatim).**
- **`## What lz-tpp does` (`:29-40`):** the coach/reference two-mode block. **This is the exact shape
  D-05 says to mirror for a new `## What lz-refactor does` section.**
- **`## Transformation Priority Premise` (`:41-61`):** brief original primer + "Authoritative sources"
  (link-only) + a pointer to `references/transformations.md`. **This is the shape D-05's refactoring
  primer + book-sources + `references/` pointer mirrors.**
- **`## License` (`:63-65`):** "MIT -- see LICENSE. Contact: larsbrinknielsen@gmail.com". Unchanged.

### `CHANGELOG.md` (repo root, 32 lines) -- the shape D-15/16 must mirror
- Keep a Changelog + SemVer header (`:1-6`).
- `## [lz-tdd@0.0.1] - 2026-07-04` (`:8`) then a one-paragraph lead (`:10-11`), an `### Added` list of
  6 bold-led bullets (`:13-30`), and a bottom link-ref (`:32`):
  `[lz-tdd@0.0.1]: https://github.com/LayZeeDK/lz-engineering-claude-plugins/releases/tag/lz-tdd%400.0.1`
  Mirror exactly for 0.0.2 (new entry ABOVE the 0.0.1 entry; new link-ref at the bottom).

### `plugins/lz-tdd/.claude-plugin/plugin.json` -- D-08 edits three fields
- `"version": "0.0.1"` -> **`0.0.2`** (D-08).
- `"description"`: "Test-driven development guidance ... Includes the lz-tpp skill operationalizing
  ... TPP." -- **names only lz-tpp; D-08 requires two-skill wording.**
- `"keywords"`: `["tdd","test-driven-development","transformation-priority-premise","tpp",
  "red-green-refactor","clean-code","typescript"]` -- **no refactoring vocabulary; D-08/D-17 add e.g.
  `refactoring`, `code-smells`, `design-patterns`, `gang-of-four`.**
- No `version` collision to worry about elsewhere; `author.email` is already the public gmail.

### `.claude-plugin/marketplace.json` -- D-08 + D-09
- `plugins[0].description`: "Test-driven development guidance ... including Transformation Priority
  Premise (TPP) coaching." -- **one-skill; D-08 requires two-skill wording.**
- **No `version` field present today [VERIFIED]** -- D-09: keep it that way.

### `check-hygiene.mjs` (`.claude/skills/lz-refactor-workspace/tools/`, 148 lines) -- D-01 L1 + D-10
- `:8` names "the Phase-10 hygiene scan" as the authoritative no-verbatim gate (this phase cannot
  defer back to the checker).
- `:15-20` `repoRoot` = `path.resolve(here, "..","..","..","..")` (tools -> workspace -> skills ->
  .claude -> repo root); `SKILL_DIR`/`SKILL_MD`/`REFERENCES` all scoped to `lz-refactor` **only**.
  **D-10 widens the target set; the `repoRoot` anchor already exists, so this is a target-set change,
  not a path-model change.**
- `:23-24` `APPROVED_EMAILS = {larsbrinknielsen@gmail.com}`; `EMAIL_RE` global.
- `:30-41` `report()` (HARD fail, increments `failures`, drives exit code) vs `warn()` (WARN only,
  never fails). **D-01 L1 = move the `(c)` check from `warn()` to `report()`.**
- `:51-69` `walkMd()` -- **filters `.endsWith(".md")` only.** D-10's non-`.md` targets (both manifests
  = JSON, LICENSE = no extension) need explicit file entries, not the Markdown walk.
- `:96-107` (a) ASCII byte scan (HARD). `:109-123` (b) email allowlist-subtraction (HARD).
- `:125-137` (c) no-verbatim: `quoteRe = /"([^"\n]{1,})"/g`, `QUOTE_THRESHOLD = 120`; flags quoted
  runs >= 120 chars as `warn()`. **This is what D-01 L1 hardens.**
- `package.json` `check` script chains 10 checkers; `check-hygiene.mjs` is 8th. `typecheck` runs
  `extract-samples.mjs`. **The battery is GREEN today.**

## Catalog Inventory -- RECOUNTED against the live tree (D-07)

> D-07 requires verifying counts at write time; do NOT copy CONTEXT's figures. A naive
> "files minus one README" is WRONG for two catalogs. Verified counts below.

| Catalog dir | .md files | Non-entry files | **Shippable entries** |
|-------------|-----------|-----------------|-----------------------|
| `fowler-catalog/` | 63 | 1 README | **62 refactorings** |
| `kerievsky-catalog/` | 31 | 1 README **+ 3 walkthroughs** | **27 pattern-directed refactorings** |
| `gof-catalog/` | 24 | 1 README | **23 GoF patterns** |
| `extra-patterns-catalog/` | 6 | 1 README | **5 extra (Tier-1) patterns** |
| `functional-catalog/` | 20 | 1 README | **19 functional idioms** |
| `smells/` | 28 | **0 (index is `references/smells.md`, not in-dir)** | **28 smells (24 Fowler + 4 Kerievsky-unique)** |

- The 3 Kerievsky walkthroughs (NOT counted as refactorings):
  `move-accumulation-to-visitor-walkthrough.md`,
  `replace-implicit-language-with-interpreter-walkthrough.md`,
  `replace-state-altering-conditionals-with-state-walkthrough.md`.
- The 4 Kerievsky-unique smells: `conditional-complexity`, `indecent-exposure`,
  `combinatorial-explosion`, `oddball-solution`.
- **Recommended README/CHANGELOG inventory line (all FACTS, D-07):** "62 Fowler refactorings,
  27 Kerievsky pattern-directed refactorings, 23 Gang-of-Four + 5 extra patterns, 19 functional
  de-patterning idioms, and 28 code smells." MUST NOT imply a complete Beck or Feathers catalog.
- Total `lz-refactor` hygiene targets today = SKILL.md + 177 references = **178 files** (matches
  CONTEXT). `lz-tpp` adds SKILL.md + 3 references = 4 files when D-10 widens the ASCII/email walk.

## Architecture Patterns

### DST-04 three-layer scan -- what the planner must specify

**Layer 1 -- deterministic gate (main-context-safe, runs in `npm run check`).**
- Promote `(c)` from `warn()` to `report()` (HARD). The one thing a source-free detector can
  deterministically block is a long verbatim-looking quoted run (the existing `QUOTE_THRESHOLD=120`
  check). Run the hardened gate against today's tree: **expected GREEN** (the tree already passed the
  per-leaf oracle gate with DST-04 as an axis; `check-hygiene` reports 0 WARN in the Phase-9 battery).
- Widen the `(c)` detection to EMIT the two proven-collision surfaces as enumerated review candidates
  that feed Layer 2 (one-line `## Intent` sections; short imperative `## Mechanics` step lists). The
  detector cannot judge originality (it has no source), so its job is to (a) hard-block long quoted
  runs and (b) route the risk surfaces to the clean-room reviewer.
- **Per-axis target-set split (critical -- D-04 + D-10):**
  - Axes (a) ASCII + (b) work-email: both skill trees + root README.md/CHANGELOG.md/LICENSE + both
    manifests. (LICENSE/manifests need explicit non-`.md` file entries; `walkMd` is `.md`-only.)
  - Axis (c) no-verbatim gate: `lz-refactor` tree + NEW README primer + NEW CHANGELOG entry ONLY.
    **EXCLUDE `lz-tpp`** (D-04: its `transformations.md` is verbatim cited FibTPP by design),
    **EXCLUDE LICENSE** (verbatim OSI MIT by design), **EXCLUDE the manifests** (short quoted JSON).
- D-17 leaves open whether this extends `check-hygiene.mjs` or lands as a sibling checker. Extending
  is lower-surface (one file, existing `repoRoot`); a sibling isolates the per-axis target split. Either
  satisfies "widen a gate, never weaken one" (Phase-9 T-09-GATE) provided no existing HARD check is
  relaxed.
- The D-02 third surface (`Applicability` first line mirrored into `gof-catalog/README.md`) is already
  deterministically gated by `check-gof` (the "Applicability-first-line selector mirror" contract), so
  its consistency is covered; its verbatim-from-GoF risk rests on Layer 3 attestation (D-03 scoped the
  sweep to the two PROVEN surfaces, not this one).

**Layer 2 -- clean-room `oracle-reviewer` sweep (subagent only; ~15-20 invocations).**
- **Binding constraint:** the MAIN context (planner + executor) NEVER reads `.oracle/`. Only
  `oracle-reviewer` (read-only, `.claude/agents/oracle-reviewer.md`) reads it, in its own isolated
  context, and returns pass/revise/blocked verdicts in its own words -- never echoing source prose.
  See `07-ORACLE-MODEL.md`. Point it at the book's `index.md`, pass the target by chapter/topic (do
  NOT hardcode chapter filenames); the reviewer resolves the file itself.
- **`.oracle/` book dirs confirmed present [VERIFIED via `ls` names only]:** `refactoring-2e`
  (Fowler), `refactoring-to-patterns` (Kerievsky), `design-patterns` (GoF). extra-patterns are
  Kerievsky+GoF-grounded, so gate their Intents against `design-patterns` / `refactoring-to-patterns`.
- **Surface counts [VERIFIED]:** 28 `## Intent` lines (23 gof-catalog + 5 extra-patterns-catalog);
  89 `## Mechanics` step lists (62 fowler-catalog + 27 kerievsky-catalog). (CONTEXT D-03 says "29
  leaves" for Intents; the verified count is 28 = 23 + 5. Use 28.)
- **Batching (D-03, "one invocation per chapter"):** Fowler mechanics -> 7 chapter batches (Ch.6-12);
  Kerievsky mechanics -> ~5-6 chapter batches (Creation / Simplification / Generalization /
  Protection+Accumulation+Utilities); GoF Intents -> 3 family batches (Creational 5 / Structural 7 /
  Behavioral 11); extra-patterns Intents -> 1 batch. Total ~15-17 invocations (within D-03's 15-20).
- **Per-invocation spec the planner must define:** (1) the agent = `oracle-reviewer`; (2) the DRAFT
  input = only the shipped surface (the `## Intent` line, or the `## Mechanics` step list) for the
  leaves in that chapter/family -- NOT whole leaves; (3) the source scope = the book + chapter/topic
  via `index.md`; (4) the rubric = DST-04 near-verbatim axis ONLY (`too_close_to_source` bool +
  structural reason, no span), surface-scoped; (5) round cap = 3, escalate non-convergence to owner
  via AskUserQuestion (memory: reviewer is adversarial and can oscillate); (6) fan-out firewall = the
  driver does NOT persist a full ordered name+chapter map (07-ORACLE-MODEL "Driver responsibilities").
- **Revise handling:** any `revise`/`blocked` verdict on a surface -> reword that surface BLIND (never
  reading the source) from the reviewer's short original directives, re-gate. A forced SKILL.md edit
  would additionally trigger D-14 (subagent review of the skill edit); a leaf-file edit does not.

**Layer 3 -- attestation (cite standing evidence for leaves the sweep does not re-open).**
- Every leaf in fowler/kerievsky/gof/extra ALREADY passed a per-leaf `oracle-reviewer` gate during
  Phases 7/8/8.1 with DST-04 as an explicit axis. **Record the citation in the phase artifact**
  (D-01: an undocumented attestation is not one). Confirmed-present artifacts to cite:
  - Fowler: `07-LEARNINGS.md` (+ `07-01..10-SUMMARY.md`). Notably 07-09 recorded the `push-down-method`
    ACCIDENTAL mechanics collision, caught + reworded blind + cleared -- the exact precedent that
    justifies keeping mechanics in the Layer-2 sweep.
  - Kerievsky: `08-LEARNINGS.md` (+ `08-01..06-SUMMARY.md`).
  - GoF + extra: `08.1-LEARNINGS.md` (+ `08.1-01..07-SUMMARY.md`). The canonical `## Intent` trap
    (memory `pattern-leaf-intent-near-verbatim-dst04`) was caught here.
  - functional-catalog is **no-oracle** (no book source; grounded in the committed research artifact),
    so it is OUTSIDE the DST-04 book-prose axis; its DST-04-clean status is attested by FUN-04 /
    Phase-8.2 skill-reviewer PASS, not by a book sweep.

### Instrument-first / Nyquist ordering (established pattern)
Every prior phase built its checker to a baseline before authoring content. D-01 layer 1 + D-10 are
this phase's instrument, so they land BEFORE the README/CHANGELOG prose they gate. Because the tree is
already clean, the instrument's baseline is GREEN (regression-proof) rather than RED; the NEW prose is
then authored UNDER the widened gate so any ASCII/email/verbatim issue in it is caught as it lands.

Recommended wave/task order:
1. **Wave 1 (instrument):** harden `(c)` to a gate + widen D-10 target set (with the per-axis split).
   Run `npm run check` -> GREEN (regression baseline). No SKILL.md touched (no D-14 review).
2. **Wave 2 (content, gated by Wave 1):** D-08 manifest edits (version + two descriptions + keywords;
   D-09 no marketplace version); D-05/06/07 README lz-refactor section + two-skill "What this is" +
   lead reword + verified inventory; D-15/16 CHANGELOG 0.0.2 entry. Re-run the widened gate -> GREEN.
3. **Wave 3 (DST-04 sweep + review gates):** Layer-2 `oracle-reviewer` sweep (~15-17 invocations);
   Layer-3 attestation citation recorded; D-12 gates (`validate` + `--strict`; `plugin-validator`;
   `skill-reviewer` on BOTH skills; `npm run check` + `npm run typecheck` GREEN); D-13 triage; D-14 if
   any SKILL.md edit is forced.

### README lz-refactor section (D-05 mirror), grounded in the existing shape
Mirror `## What lz-tpp does` (README:29-40) -> a `## What lz-refactor does` block (coach mode:
auto-triggers at the refactor step; reference mode: `/lz-tdd:lz-refactor`). Mirror the
`## Transformation Priority Premise` block (README:41-61) -> a brief ORIGINAL refactoring primer +
"Authoritative sources" (Fowler *Refactoring* 2nd ed + Kerievsky *Refactoring to Patterns*, by
title/author/publisher-or-ISBN link, LINK ONLY) + a pointer into
`plugins/lz-tdd/skills/lz-refactor/references/`. Update the lead + "What this is" bullets to two
skills. The red-green-refactor seam (lz-tpp at green, lz-refactor at refactor) is the best one-sentence
pitch for the pair (CONTEXT `<specifics>`).

### Anti-Patterns to Avoid
- **Inlining catalog entries, mechanics, smell tables, or examples into README/CHANGELOG** (D-06/D-15).
- **Scrubbing `lz-tpp`'s `transformations.md`** for verbatim -- it is cited FibTPP by design (D-04).
- **Adding `version` to `marketplace.json`** (D-09 trap).
- **Weakening any existing HARD checker** to turn the phase GREEN (T-09-GATE).
- **Reading `.oracle/` from the main context** for a "quick diff" -- forbidden; forces Layer 2.
- **Copying the catalog counts from CONTEXT** instead of recounting (D-07).
- **Running the review agents before README/LICENSE exist** -- `plugin-validator` step 9 checks they
  exist and would emit noise findings (README/LICENSE already exist here, so run order is free -- D-17).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Verbatim book-prose detection over real source | A main-context text diff against `.oracle/` | `oracle-reviewer` subagent (Layer 2) | Main context reading `.oracle/` breaks the clean-room firewall -- the whole DST-04 model |
| Manifest/structure validation | Hand-check JSON + layout | `claude plugin validate . --strict` + `plugin-validator` | First-party validator knows the schema; already exit 0 |
| Skill quality review | Manual heuristic pass | `skill-reviewer` on BOTH skills | First-party agent; D-12 requires it on the final tree |
| Non-ASCII / work-email detection | Eyeball files | Widened `check-hygiene.mjs` (a)+(b) + full-tree `git grep` post-commit | Deterministic; ARM64-native; the leak recurred twice in Phase 4 |
| MIT license text | Retype/paraphrase | Existing repo `LICENSE` (unchanged) | Any paraphrase risks an invalid grant; LICENSE stays as-is (verbatim OSI) |

**Key insight:** Every capability this phase needs already exists as a first-party tool, an in-repo
agent, or an existing checker. The work is target-set widening + one WARN->gate promotion + alignment
prose + verification -- not construction.

## Runtime State Inventory

Not a code rename/migration, but three runtime-state facts are load-bearing:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Update-trigger state | `plugin.json` `version` = `0.0.1` drives `/plugin update`; unchanged version makes auto-update SKIP the plugin, so existing installs never see `lz-refactor` | Bump to `0.0.2` (D-08) -- this IS the delivery mechanism, not cosmetic |
| Stale descriptive strings | `plugin.json` `description` + `keywords` and `marketplace.json` `plugins[0].description` all describe a one-skill (TPP-only) plugin | Rewrite all three to two-skill wording (D-08); factual inaccuracy = FIX-in-phase (D-13) |
| Secrets/PII in NEW planning artifacts | Phase-10 planning docs (CONTEXT/RESEARCH/PLAN/SUMMARY) must never spell the work-email literal (recurred twice in Phase 4) | Reference the work email only in escaped/redacted form; run the full-tree guard post-commit (04-LEARNINGS) |
| Stored data / OS-registered / build artifacts | None -- pure JSON + Markdown, no datastore, no OS registration, no build step (the workspace is NON-shipped) | None |
| Live service config | The public GitHub remote is wired + pushed (STATE.md); the documented `/plugin marketplace add` command resolves | None (verify the install strings stay verbatim, D-05) |

**Nothing found in stored-data / OS-registered / build-artifact categories -- verified: the shipped
plugin is dependency-free Markdown + JSON with no runtime state.**

## Common Pitfalls

### Pitfall 1: `walkMd` is `.md`-only -- the D-10 non-Markdown targets get silently skipped
**What goes wrong:** D-10 adds `LICENSE` (no extension), `plugin.json`, and `marketplace.json` (JSON)
to the ASCII/email walk, but `walkMd()` (`:63`) filters `entry.name.endsWith(".md")`, so those files
are never opened and the gate passes vacuously over them.
**How to avoid:** Add the non-`.md` targets as explicit file entries in the `targets` array (like the
existing `SKILL_MD` push), not via the directory walk. Confirm with a count line that all expected
files are scanned.
**Warning signs:** The "files: N" line does not increase by the number of non-`.md` targets added.

### Pitfall 2: Promoting `(c)` to a HARD gate can false-fail on legitimate long quotes
**What goes wrong:** A HARD `QUOTE_THRESHOLD>=120` gate fails on any legitimate 120+char double-quoted
run (a quoted sentence in original prose, a long quoted error string in a TS example). The tree is
clean today, but the README primer or a future leaf could trip it.
**How to avoid:** Run the hardened gate against the current tree FIRST (expected 0 hits). If a hit is
a legitimate original quote, refine the heuristic (tune threshold, or restrict to prose outside code
fences) rather than weaken it below its detection value -- widen, never weaken (T-09-GATE). Keep the
per-axis target split so LICENSE/lz-tpp/manifests (legitimately quote-heavy or verbatim-by-design) are
excluded from axis (c).
**Warning signs:** The gate fails citing a quote in `beck-*.md`, the README primer, or a TS example
error message.

### Pitfall 3: The work-email self-reference trap (recurred twice in Phase 4)
**What goes wrong:** Any doc stating the "work email must appear nowhere" rule, and any agent report
asserting absence, tends to spell the literal while doing so -- tripping the DST-02 full-tree guard.
**How to avoid (D-11):** Never write the work email or its work domain in any committed file, not even as
a search needle -- the needle is itself a leak. Detect by allowlist-inversion instead: assert the only
email-shaped token present is the approved public gmail and flag everything else. Run the allowlist-inversion
guard full-tree as a post-commit gate, not only at authoring time (04-LEARNINGS: "confirmed absent" is a
point-in-time claim). The widened `check-hygiene` covers the shippable surface; the full-tree scan catches `.planning/` leaks.
**Warning signs:** the full-tree allowlist-inversion guard leaves a non-empty remainder after a commit that added a
plan/summary/review doc.

### Pitfall 4: `skill-reviewer` WILL flag both skills' descriptions as ">500 chars" and possibly "body too short" -- these are D-13 defer items
**What goes wrong:** `skill-reviewer` heuristics (read 2026-07-09, unchanged): description "not too
long >500 chars"; body "1,000-3,000 words". `lz-refactor`'s description is ~800 chars and SKILL.md is
112 lines; `lz-tpp`'s is ~750 chars / 116 lines. Both will likely draw "description too long" and/or
"body too short" findings.
**How to avoid (D-13):** These are `description`-triggering-effectiveness / content-organization
concerns -> RECORD and DEFER to Phase 11 (EVL-01/02). Do NOT shorten descriptions or inflate bodies
in Phase 10 (that pulls empirical Phase-11 work forward and fights the intentional lean/progressive-
disclosure design). Neither blocks the ship.
**Warning signs:** A plan task that says "shorten the description" or "expand SKILL.md".

### Pitfall 5: `plugin-validator` may warn README/LICENSE "missing" at the PLUGIN root
**What goes wrong:** `plugin-validator` step 9 checks the plugin root (`plugins/lz-tdd/`) for README +
LICENSE, but they live at the repo/marketplace root (correct for a single-plugin marketplace).
**How to avoid (D-13):** Triage as minor/by-design (root LICENSE + `license:"MIT"` field covers the
plugin; root README is the documented landing page). This is a known Phase-4 finding, not a
regression.

### Pitfall 6: README / manifest / CHANGELOG drift
**What goes wrong:** README/CHANGELOG state an install command, invocation, contact, license, or count
that disagrees with the manifests / LICENSE / live tree.
**How to avoid:** Lift identity verbatim (install strings from README:24-27; email/URL/license from
the manifests); recount the catalog inventory against the tree (D-07); post-write, `git grep` the
README for `/lz-tdd:lz-refactor`, `/lz-tdd:lz-tpp`, and the two install strings to confirm presence.

## Code Examples

Verified commands (run during research, Windows arm64, Git Bash).

### Recount the catalog inventory (D-07, at write time)
```bash
# Shippable entries = files minus README, minus non-leaf files (walkthroughs).
for d in fowler-catalog kerievsky-catalog gof-catalog extra-patterns-catalog functional-catalog smells; do
  n=$(ls -1 "plugins/lz-tdd/skills/lz-refactor/references/$d" | rg -c '\.md$')
  echo "$d: $n files"
done
# VERIFIED 2026-07-09: 63 / 31 / 24 / 6 / 20 / 28.
# Kerievsky 31 includes 1 README + 3 *-walkthrough.md => 27 refactorings.
# smells/ 28 has NO in-dir README (index is references/smells.md) => 28 smells.
```

### DST-04 Layer-2 surface counts (what the sweep covers)
```bash
git grep -l '^## Intent' -- 'plugins/lz-tdd/skills/lz-refactor/references/gof-catalog/'            | rg -c '\.md$'  # 23
git grep -l '^## Intent' -- 'plugins/lz-tdd/skills/lz-refactor/references/extra-patterns-catalog/' | rg -c '\.md$'  # 5
git grep -c '^## Mechanics' -- 'plugins/lz-tdd/skills/lz-refactor/references/fowler-catalog/'      | rg -c ':1'      # 62
git grep -c '^## Mechanics' -- 'plugins/lz-tdd/skills/lz-refactor/references/kerievsky-catalog/'   | rg -c ':1'      # 27
```

### Widened D-10 hygiene baseline (ASCII + work-email) -- verify BEFORE authoring
```bash
# ASCII over the widened target set. rc=1 => clean (PASS). Do NOT read $? after a pipe.
git grep -qP '[^\x00-\x7F]' -- 'plugins/lz-tdd/skills/' 'README.md' 'CHANGELOG.md' 'LICENSE' '.claude-plugin/' 'plugins/lz-tdd/.claude-plugin/'
echo "ascii rc=$?   # target 1 (clean)"
# Work-email allowlist-inversion over the widened set (only the approved gmail permitted).
test -z "$(git grep -hoiE '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' -- 'plugins/lz-tdd/skills/' 'README.md' 'CHANGELOG.md' 'LICENSE' '.claude-plugin/' 'plugins/lz-tdd/.claude-plugin/' | sort -u | rg -iv 'larsbrinknielsen@gmail\.com')"
echo "email rc=$?   # target 0 (empty remainder)"
# VERIFIED 2026-07-09: both rc=1 (clean/absent) on today's tree -- widening is a regression gate.
```

### Hard gate: first-party CLI validation (DST-02)
```bash
claude plugin validate .            # exit 0 today
claude plugin validate . --strict   # exit 0 today (verified 2026-07-09; CLI 2.1.205)
```

### Battery + typecheck (DST-02, must stay GREEN)
```bash
# From the NON-shipped workspace:
cd .claude/skills/lz-refactor-workspace
npm run check       # 10 checkers incl. the (now-hardened) check-hygiene
npm run typecheck   # extract-samples.mjs: tsc --strict over every fenced sample
```

### Full-tree work-email post-commit guard (D-11, Pitfall 3)
```bash
# Allowlist-inversion: only the approved public gmail may appear as an email-shaped token.
test -z "$(git grep -hoiE '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' | sort -u | rg -iv 'larsbrinknielsen@gmail\.com' | rg -iv 'lz-tdd@')"   # rc=0 => clean (PASS). Run AFTER every commit touching docs/reports.
git grep -hoiE '[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}' | sort -u | rg -iv 'larsbrinknielsen@gmail\.com' | rg -iv 'lz-tdd@'   # list non-approved tokens if it fails.
```

### Running the review agents (NOT CLI commands)
`plugin-validator` and `skill-reviewer` are `plugin-dev` SUBAGENTS (read-only), invoked via the Task
tool / natural language in-session -- e.g. "use the plugin-validator agent on the lz-tdd plugin" and
"use the skill-reviewer agent on the lz-refactor skill" then again on `lz-tpp`. Each emits a Markdown
report (critical/major/minor + PASS/NEEDS-IMPROVEMENT). Only `claude plugin validate` gives a
programmatic exit code. `oracle-reviewer` is likewise a Task-tool subagent, the only one permitted to
read `.oracle/`.

## State of the Art

| Old Approach | Current Approach | When | Impact |
|--------------|------------------|------|--------|
| `(c)` no-verbatim = WARN, defer to "the Phase-10 scan" | `(c)` = HARD gate + clean-room sweep + attestation | This phase (D-01) | The checker's own `:8` note names Phase 10 as the authoritative gate; this phase realizes it |
| `check-hygiene` walks `lz-refactor` only | Walks both skill trees + root docs + manifests (per-axis split) | This phase (D-10) | The files this phase writes were previously ungated for ASCII/email |
| Batch AskUserQuestion oracle paste | Clean-room `oracle-reviewer` loop over `.oracle/` | Phase 7 (07-ORACLE-MODEL) | DST-04 firewall: main context never reads source |

**Deprecated/outdated:**
- `when_to_use` skill frontmatter -- `skill-reviewer` notes it deprecated; both skills already omit it.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `claude plugin validate .` / `--strict` still exit 0 on the final tree (verified 2026-07-09 on the pre-edit tree; CLI 2.1.205) | Standard Stack / Validation Arch | Low -- re-run at the phase gate; a regression would be a D-13 FIX-now |
| A2 | `skill-reviewer` will flag the >500-char descriptions and possibly "body too short" per its stated heuristics | Pitfall 4 | Low -- heuristics read directly; if it does not flag, triage guidance is unaffected |
| A3 | Promoting `(c)` to a HARD gate stays GREEN on today's tree | Layer 1 / Pitfall 2 | Medium -- must be run to confirm; a legitimate long quote would force a heuristic refinement (not a weaken) |
| A4 | extra-patterns Intents can be gated against `.oracle/refactoring-to-patterns` + `design-patterns` (Kerievsky-grounded) | Layer 2 | Low -- matches how Phase 8.1 authored them; the reviewer flags source-absence as `blocked` if wrong |
| A5 | `.planning/` is published to the public repo, so its work-email hygiene matters | Pitfall 3 | Medium -- if `.planning/` were stripped at ship the concern narrows to git history; the escaped-needle discipline holds regardless |

## Open Questions (RESOLVED)

All three below are D-17 discretion items, RESOLVED during Phase-10 planning (2026-07-09):
Q1 -> 10-01 (extend `check-hygiene.mjs`, two internal target arrays for the per-axis split);
Q2 -> 10-02 (keywords list + CHANGELOG bullet granularity per the recommendations below);
Q3 -> 10-03 (Kerievsky mechanics batched 5-6, within the D-03 15-20 invocation envelope).

1. **Does the hardened `(c)` gate extend `check-hygiene.mjs` or land as a sibling? (D-17)**
   - What we know: extending reuses `repoRoot` and one file; a sibling cleanly isolates the per-axis
     target split (axis (c) excludes lz-tpp/LICENSE/manifests that axes (a)/(b) include).
   - Recommendation: extend `check-hygiene.mjs` (lower surface), implementing the target split as two
     internal target arrays. Either is acceptable under T-09-GATE.
2. **Exact `keywords` list and CHANGELOG bullet granularity (D-17).**
   - Recommendation: keywords = existing 7 + `refactoring`, `code-smells`, `design-patterns`,
     `gang-of-four` (and optionally `fowler`, `kerievsky`); CHANGELOG `### Added` = one bold-led bullet
     per deliverable (skill, five catalogs, smell taxonomy, coach procedure, three principle refs),
     mirroring the 0.0.1 entry's 6-bullet granularity.
3. **Sweep batch boundaries for Kerievsky mechanics.** Phase 8 grouped Ch.9+10+11 in one plan; the
   planner should decide 5 vs 6 Kerievsky batches -- either lands within D-03's 15-20 total.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `claude` CLI (`plugin validate`) | DST-02 hard gate | Yes | 2.1.205 | none needed |
| `plugin-dev` `plugin-validator` agent | DST-02 | Yes (on disk) | claude-plugins-official | none needed |
| `plugin-dev` `skill-reviewer` agent | DST-02 | Yes (on disk) | claude-plugins-official | none needed |
| in-repo `oracle-reviewer` agent | DST-04 Layer 2 | Yes | `.claude/agents/oracle-reviewer.md` | none (no alternative reader of `.oracle/`) |
| `.oracle/` book sources | DST-04 Layer 2 | Yes | refactoring-2e, refactoring-to-patterns, design-patterns | owner adds a missing entry if the reviewer returns `blocked` |
| `node` + workspace battery | DST-02 checkers/typecheck | Yes | v24.18.0 / tsc 6.0.3 | none needed |
| `git grep -P` (PCRE) | ASCII + email guards | Yes | git w/ PCRE | `rg -uu` |
| Git remote `origin` -> public GitHub | install-command resolution | Yes (pushed) | -- | none needed |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none material.

## Validation Architecture

`nyquist_validation` is enabled. This phase has no unit-test framework (docs + JSON + one Node
checker); the gates ARE the tests. Each requirement maps to a deterministic gate, an agent verdict, or
a clean-room sweep verdict.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | none (no runtime code) -- verification via first-party CLI + read-only agents + Node-builtin checker battery + `git grep` guards + clean-room `oracle-reviewer` sweep |
| Config file | `.claude/skills/lz-refactor-workspace/package.json` (`check` + `typecheck` scripts) |
| Quick run command | `claude plugin validate . --strict` |
| Full suite command | `cd .claude/skills/lz-refactor-workspace && npm run check && npm run typecheck`, plus the two `plugin-dev` agents, plus the DST-04 sweep |

### Phase Requirements -> Validation Map
| Req | Behavior | Type | Objective signal | Wave-0? |
|-----|----------|------|------------------|---------|
| DST-01 | version 0.0.2 + README documents lz-refactor + `/lz-tdd:lz-refactor` | value + doc-presence | `jq -r .version plugins/lz-tdd/.claude-plugin/plugin.json` == `0.0.2`; `git grep -nF '/lz-tdd:lz-refactor' -- README.md` present; README has a two-skill "What this is" + a `## What lz-refactor does` section; recounted inventory matches the tree | README edits not yet made |
| DST-02 | validate + --strict + agents PASS; work-email absent; MIT; ASCII-only | gate + agent verdict | `claude plugin validate . --strict` exit 0; widened `check-hygiene` (a)+(b) GREEN; full-tree work-email allowlist-inversion clean (only approved gmail present); `plugin-validator` PASS; `skill-reviewer` PASS on BOTH skills (D-13-triaged); `npm run check` + `npm run typecheck` exit 0 | check-hygiene widening not yet made |
| DST-03 | CHANGELOG gains lz-tdd@0.0.2 entry | doc-presence | `git grep -nF '[lz-tdd@0.0.2]' -- CHANGELOG.md` present (heading + bottom link-ref); lead + `### Added` + `%400.0.2` release-tag link-ref present | CHANGELOG entry not yet made |
| DST-04 | no verbatim Fowler/Kerievsky/GoF prose or code in the shipped tree | gate + sweep verdict + attestation | (L1) hardened `check-hygiene` (c) gate exit 0 over lz-refactor + new prose; (L2) `oracle-reviewer` returns `pass` on all 28 Intent + 89 mechanics surfaces (revises reworded blind + re-passed); (L3) attestation citation to Phase 7/8/8.1 verdicts recorded in the phase artifact | hardened (c) gate + sweep not yet run |

### Sampling Rate
- **Per task commit:** widened `check-hygiene` (a)+(b)+(c) + full-tree work-email `git grep`.
- **Per wave merge:** `npm run check` + `npm run typecheck` GREEN.
- **Phase gate:** `claude plugin validate . --strict` exit 0 + both `plugin-dev` agents triaged +
  the DST-04 Layer-2 sweep all-`pass` + Layer-3 attestation recorded, before `/gsd-verify-work`.

### Wave 0 Gaps
- [ ] Harden `check-hygiene.mjs` `(c)` WARN -> HARD gate + widen the ASCII/email target set (D-01 L1,
      D-10) -- the phase instrument; run to a GREEN regression baseline.
- [ ] No test-framework install needed (no runtime code).

*(No new test files: this is a docs/config/harness phase; the review gates + sweep are the tests.)*

## Security Domain

`security_enforcement` is absent in config (= enabled). This is a docs/licensing/manifest phase; the
only live surfaces are information disclosure (work email / PII) and manifest path safety.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|------------------|
| V2 Authentication | no | -- |
| V3 Session Management | no | -- |
| V4 Access Control | no | -- |
| V5 Input Validation | no (no runtime input) | -- |
| V6 Cryptography | no | -- |
| V7/V8 Data protection & privacy | yes | Work-email (PII) leak prevention: widened allowlist gate + full-tree `git grep` post-commit (D-10/11) |
| V14 Config | yes | No secrets in manifests/docs; relative `./` source path only (no path traversal) -- `plugin-validator` step 10 |

### Known Threat Patterns for a public plugin marketplace
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Work/PII email exposed in public repo (incl. `.planning/`) | Information Disclosure | Escaped-needle discipline in every committed doc; widened `check-hygiene` allowlist + full-tree `git grep` returns absent (D-11) |
| Verbatim copyrighted book prose/code in the public tree | Information Disclosure / IP | 3-layer DST-04 scan: hardened deterministic gate + clean-room `oracle-reviewer` sweep + attestation (D-01) |
| `../` / absolute paths in manifest `source` (path traversal) | Tampering | Relative `./plugins/lz-tdd` only (already compliant); `plugin-validator` verifies |

No secrets, auth, or network surface is introduced by this phase.

## Sources

### Primary (HIGH confidence)
- Live repo files read directly: `README.md`, `CHANGELOG.md`, `plugins/lz-tdd/.claude-plugin/plugin.json`,
  `.claude-plugin/marketplace.json`, `plugins/lz-tdd/skills/lz-refactor/SKILL.md`,
  `.claude/skills/lz-refactor-workspace/tools/check-hygiene.mjs` + `package.json`.
- Live `ls` / `git grep` over the tree: catalog file counts, `## Intent` (28) + `## Mechanics` (89)
  surface counts, widened-target ASCII (rc=1 clean) + work-email (rc=1 absent) baselines, `.oracle/`
  book-dir names (refactoring-2e, refactoring-to-patterns, design-patterns).
- `claude --version` (2.1.205), `node --version` (v24.18.0) [VERIFIED].
- `plugin-dev` agent definitions on disk (`skill-reviewer.md`, `plugin-validator.md`) -- exact
  heuristics + steps read.
- Planning artifacts: `10-CONTEXT.md` (D-01..D-17), `REQUIREMENTS.md`, `ROADMAP.md`, `STATE.md`,
  `04-RESEARCH.md`, `04-LEARNINGS.md`, `07-ORACLE-MODEL.md`; attestation artifacts confirmed present
  (`07-LEARNINGS.md`, `08-LEARNINGS.md`, `08.1-LEARNINGS.md` + per-plan SUMMARYs).

### Secondary (MEDIUM confidence)
- Memory index entries: `pattern-leaf-intent-near-verbatim-dst04`, `public-repo-work-email-allowlist`,
  `lz-plugins-phase1-workemail-git-history-exposure`, `agent-skill-instruction-changes-need-review`.

### Tertiary (LOW confidence)
- None. All claims verified against tools or on-disk sources.

## Metadata

**Confidence breakdown:**
- File state / edit targets: HIGH -- every file read; exact line refs given.
- Catalog inventory: HIGH -- recounted live; walkthrough/README exclusions verified.
- DST-04 scan design: HIGH -- surface counts verified, `.oracle/` dirs confirmed, clean-room model +
  attestation artifacts read; the only run-time unknown is whether the hardened `(c)` gate stays GREEN
  (A3, must be run) and the exact Kerievsky batch count (within D-03's range).
- Review-gate behavior: HIGH -- CLI version + both agent defs verified; heuristics unchanged from Phase 4.
- Hygiene baselines: HIGH -- widened ASCII/email scans executed (both clean today).

**Research date:** 2026-07-09
**Valid until:** ~2026-08-09 (stable; only risk is a Claude Code CLI/agent update changing
`claude plugin validate` or the agent heuristics -- re-verify if the CLI version advances materially).
