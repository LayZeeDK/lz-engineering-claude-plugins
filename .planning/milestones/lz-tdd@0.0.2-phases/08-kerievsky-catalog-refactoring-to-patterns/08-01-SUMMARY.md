---
phase: 08-kerievsky-catalog-refactoring-to-patterns
plan: 01
subsystem: testing
tags: [kerievsky-catalog, harness, checkers, node-mjs, tsc, validation, non-shipped-workspace]

# Dependency graph
requires:
  - phase: 07-fowler-catalog
    provides: the shipped-green check-catalog.mjs template, extract-samples.mjs, check-crossrefs.mjs, check-smells.mjs, the 62 Fowler leaves (composition targets), and the 24 Fowler smell leaves (fold target)
provides:
  - New tools/check-kerievsky.mjs (27-name identity + Direction/GoF/Composed-Fowler-primitive fields + 3 Away cases + README-row mirror), RED baseline (0/27, exit 1)
  - extract-samples.mjs extended to walk BOTH catalogs (incl. *-walkthrough.md) with per-catalog namespaced sample filenames
  - check-crossrefs.mjs extended with kerievsky-catalog leaves in sourceFiles (mutuality guard stays Fowler-scoped)
  - check-smells.mjs extended for the Ch.4 fold: (fowler|kerievsky) candidate regex + Source: tag validity + dedup + Kerievsky-unique contract loop
  - package.json check chain wired to run check-kerievsky.mjs
affects: [08-02, 08-03, 08-04, 08-05, 08-06, kerievsky-catalog authoring, Ch.4 smell fold]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Name-identity checker (not cardinality): key on a canonical NAMES array, assert each present exactly once as a leaf H1"
    - "Field-label / checker-regex lockstep (Pitfall 4): Direction:, GoF pattern:, Composed Fowler primitive(s): tokens identical in leaf template and checker regex"
    - "Sibling checker over extending: new check-kerievsky.mjs leaves the shipped-green Fowler 62-checker untouched"
    - "Source: tag defaults to Fowler when absent so the pre-fold 24 Fowler leaves stay green"
    - "Per-catalog namespaced sample filenames (fowler-/kerievsky-) prevent silent slug-collision overwrites"

key-files:
  created:
    - .claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs
  modified:
    - .claude/skills/lz-refactor-workspace/extract-samples.mjs
    - .claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs
    - .claude/skills/lz-refactor-workspace/tools/check-smells.mjs
    - .claude/skills/lz-refactor-workspace/package.json

key-decisions:
  - "check-kerievsky.mjs RED (0/27, exit 1) against the empty kerievsky-catalog is the expected Wave-1 baseline, not a failure"
  - "GoF pattern: field accepts any non-empty value OR the literal 'n/a -- utility' (Open Question 1) via the same presence check"
  - "Source: tags are optional in 08-01; absent = Fowler (default) so the pre-fold tree stays green; 08-06 adds explicit tags"
  - "KRV-01..04 remain Pending -- they close only when the authoring waves (08-02..08-06) turn the battery green (mirrors Phase 7's 07-01 harness plan)"

patterns-established:
  - "Away-case Set membership modeled on check-catalog.mjs WEB_ONLY: the 3 named Away leaves must carry Direction: Away + an 'away from <pattern>' callout"
  - "Kerievsky smell set derived from Source: tags rather than a hardcoded name list -- the checker validates STRUCTURE + resolution + dedup, oracle settles names"

requirements-completed: []  # KRV-01..04 are CONTENT requirements; this harness plan produces only the instruments (RED baseline). They close when 08-02..08-06 turn the battery green.

# Metrics
duration: 20min
completed: 2026-07-06
---

# Phase 8 Plan 01: Kerievsky Catalog Harness Extension Summary

**Scaffold-first checker battery for the 27 Kerievsky leaves: a new name-identity check-kerievsky.mjs (RED 0/27 baseline) plus re-pointed extract-samples/check-crossrefs/check-smells that stay green over the current Fowler-only tree.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-07-06
- **Tasks:** 2
- **Files modified:** 5 (1 created, 4 modified)

## Accomplishments

- New `tools/check-kerievsky.mjs` clones the check-catalog.mjs name-identity model for the 27 canonical Kerievsky pattern-directed refactorings (EXPECTED = 27, grouped by the 6 book chapters: Creation 6 / Simplification 6 / Generalization 7 / Protection 3 / Accumulation 2 / Utilities 3).
- Asserts the LOCKED Fowler contract fields (`Use when:`, `## Motivation`, `## Mechanics`, `## Example` + >=1 ts/js fence) PLUS the three Kerievsky field labels in token-lockstep (Pitfall 4): `Direction:` in {To, Towards, Away}; `GoF pattern:` non-empty or `n/a -- utility`; `Composed Fowler primitive(s):` with >=1 `../fowler-catalog/<slug>.md#<slug>` cross-link (presence only).
- Flags the 3 named de-patterning (Away) cases -- Inline Singleton, Move Accumulation to Visitor, Encapsulate Composite with Builder -- requiring `Direction: Away` + an "away from <pattern>" callout, modeled on check-catalog's WEB_ONLY Set.
- Reuses the README Use-when mirror; wired `node tools/check-kerievsky.mjs` into the package.json `check` chain (after check-catalog).
- Extended extract-samples/check-crossrefs/check-smells for the fold, all staying GREEN over the current Fowler-only tree.

## RED Baseline (the point of the plan)

| Checker | Command | Exit | Result |
|---------|---------|------|--------|
| check-kerievsky.mjs | `node tools/check-kerievsky.mjs` | 1 | RED baseline: `0/27 present, 27 check(s) FAILED` (empty kerievsky-catalog -- expected) |
| extract-samples.mjs | `node extract-samples.mjs` | 0 | GREEN: 124 modules tsc --strict --noEmit clean (Fowler only; samples now `fowler-`-prefixed) |
| check-crossrefs.mjs | `node tools/check-crossrefs.mjs` | 0 | GREEN: 291 links resolve, 20 inverse pairs mutual |
| check-smells.mjs | `node tools/check-smells.mjs` | 0 | GREEN: 24/24 Fowler smell leaves with contract + navigation index |
| check-catalog.mjs | (unchanged) | 0 | Untouched -- Fowler 62-checker intact |

check-kerievsky RED is the expected Wave-1 baseline; it turns GREEN as 08-02..08-06 fill the leaves.

## Task Commits

Each task was committed atomically:

1. **Task 1: check-kerievsky.mjs + package.json check chain** - `b8502ff` (test)
2. **Task 2: extend extract-samples + check-crossrefs + check-smells for the fold** - `fe5f3ed` (feat)

**Plan metadata:** final `docs(08-01)` commit (this SUMMARY + STATE.md + ROADMAP.md)

## Files Created/Modified

- `.claude/skills/lz-refactor-workspace/tools/check-kerievsky.mjs` (NEW) - 27-name identity + contract + Direction/GoF/Composed-primitive fields + 3 Away cases + README mirror; RED baseline.
- `.claude/skills/lz-refactor-workspace/extract-samples.mjs` - now iterates a `CATALOGS` array (fowler + kerievsky, `REFERENCES`-rooted); output filenames namespaced `${prefix}-${leaf}-${n}.ts` so a Kerievsky slug cannot silently overwrite a Fowler sample module.
- `.claude/skills/lz-refactor-workspace/tools/check-crossrefs.mjs` - added `KERIEVSKY` constant + `...collectLeafFiles(KERIEVSKY)` to `sourceFiles`; the inverse-of mutuality guard stays `CATALOG` (Fowler)-scoped so one-directional Kerievsky -> Fowler composed-primitive links are correctly excluded.
- `.claude/skills/lz-refactor-workspace/tools/check-smells.mjs` - candidate regex broadened to `(?:fowler|kerievsky)-catalog/`; added `VALID_SOURCE_TAGS` + `sourceTagOf` (default Fowler), a shared `smellContractMissing` helper, source-tag validity, Kerievsky-sourced heading acceptance, dedup (a `Kerievsky`-tagged leaf must not reuse a Fowler-canonical name), and a Kerievsky-unique contract loop derived from Source: tags.
- `.claude/skills/lz-refactor-workspace/package.json` - `check` chain now runs `node tools/check-kerievsky.mjs` after check-catalog.

## Exact Harness Diffs

- **check-kerievsky.mjs (new):** CATALOG -> `kerievsky-catalog`; NAMES = the 27 chapter-grouped names; EXPECTED = 27; AWAY Set = {Inline Singleton, Move Accumulation to Visitor, Encapsulate Composite with Builder}. Field regexes: `/^Direction:\s*(To|Towards|Away)\b/m`, `/^GoF pattern:\s*\S/m` (comment documents the `n/a -- utility` allowance), `/^Composed Fowler primitive\(s\):.*\]\(\.\.\/fowler-catalog\/[a-z0-9-]+\.md#[a-z0-9-]+\)/m`. Skips `*-walkthrough.md` companions in collectLeaves. SUMMARY + `process.exit(failures === 0 ? 0 : 1)`.
- **extract-samples.mjs:** `const CATALOG = ...fowler-catalog` -> `const REFERENCES = ...references` + `CATALOGS` array; single `for (const file of walkMd(CATALOG))` -> nested `for (const { dir, prefix } of CATALOGS) { for (const file of walkMd(dir)) ... }`; `outName = \`${leaf}-${n}.ts\`` -> `\`${prefix}-${leaf}-${n}.ts\``.
- **check-crossrefs.mjs:** +`const KERIEVSKY = path.join(REFERENCES, "kerievsky-catalog")`; `sourceFiles = [...CATALOG, ...SMELLS_DIR]` -> `[...CATALOG, ...KERIEVSKY, ...SMELLS_DIR]`; mutuality guard at the `isInverseLine` branch left Fowler-scoped (unchanged).
- **check-smells.mjs:** candidate `linkRe` gains `(?:fowler|kerievsky)-catalog/`; new `VALID_SOURCE_TAGS`/`sourceTagOf`/`smellContractMissing`; the old inline Fowler contract collapsed into the shared helper; the unknown-heading pass now accepts Kerievsky-sourced headings and adds source-tag + dedup checks; a new loop contract-checks Kerievsky-unique leaves.
- **package.json:** `check` inserts `&& node tools/check-kerievsky.mjs` after `check-catalog.mjs`.

## Decisions Made

- check-kerievsky RED (0/27, exit 1) is the intended Wave-1 baseline (scaffold-first / Nyquist), not a failure.
- `GoF pattern:` accepts any non-empty value OR `n/a -- utility` (Open Question 1) with a single presence check; the literal is documented in a comment.
- `Source:` tags are optional here; absence defaults to Fowler so the pre-fold 24 leaves stay green. 08-06 authors explicit tags in lockstep with these regexes.
- KRV-01..04 left Pending -- content requirements that close only when the authoring waves turn the battery green (same pattern as Phase 7's 07-01 harness plan).

## Deviations from Plan

None - plan executed exactly as written. (No Rule 1-4 deviations; no auth gates; no new dependencies; no package installs.)

## Issues Encountered

- The `check-smells` fold branches (Source-tag validity, dedup, Kerievsky-unique contract) are inert on the current Fowler-only tree, so they had no positive-path coverage from the plain run. Smoke-tested them with a throwaway `smells/zzz-temp-smell.md` (valid Kerievsky-unique leaf -> GREEN; invalid `Source: Bogus` -> RED; re-tagging an existing Fowler leaf `Kerievsky` -> RED "un-deduped smell") and then removed the temp file (git status clean, `check-catalog.mjs` untouched). Confirms the instrument fires correctly before content lands.

## Threat Surface

No new surface. This plan ships no runtime, network, user input, or copyrighted content -- only Node-builtin checkers hardcoding public refactoring names. T-08-07 (silent-pass checker) mitigated by 27-name IDENTITY + SUMMARY + non-zero exit; T-08-03 (non-ASCII) verified: `rg -n "[^\x00-\x7F]"` clean on all new/edited .mjs. No package installs (T-08-SC accept).

## Next Phase Readiness

- The full Kerievsky checker battery is in place and RED-by-design; 08-02..08-05 author the catalog leaves (per chapter) and 08-06 folds Ch.4 smells + fills the README index, turning the battery GREEN.
- Token-lockstep contract the authoring waves MUST honor: leaf field labels `Direction:` / `GoF pattern:` / `Composed Fowler primitive(s):` (with `../fowler-catalog/<slug>.md#<slug>` links); smell `Source:` tag values {Fowler, Kerievsky, both}; README index rows link `(<slug>.md)` without an anchor and mirror the leaf `Use when:` verbatim.

## Self-Check: PASSED

- Files: check-kerievsky.mjs, extract-samples.mjs, check-crossrefs.mjs, check-smells.mjs, package.json all FOUND.
- Commits: b8502ff FOUND, fe5f3ed FOUND.

---
*Phase: 08-kerievsky-catalog-refactoring-to-patterns*
*Completed: 2026-07-06*
