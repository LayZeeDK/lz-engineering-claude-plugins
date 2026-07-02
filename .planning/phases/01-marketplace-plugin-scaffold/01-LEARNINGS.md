---
phase: 1
phase_name: "marketplace-plugin-scaffold"
project: "lz-engineering-claude-plugins"
generated: "2026-07-02"
counts:
  decisions: 5
  lessons: 4
  patterns: 4
  surprises: 2
missing_artifacts:
  - "01-UAT.md"
---

# Phase 1 Learnings: marketplace-plugin-scaffold

## Decisions

### Three-level manifest hierarchy with `plugins/<name>/` container from day one
Root `.claude-plugin/marketplace.json` (marketplace) + `plugins/lz-tdd/.claude-plugin/plugin.json` (plugin) + `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (skill). The plugin is NOT flattened to the repo root even with a single plugin; component dirs (`skills/`) live at the plugin root and are auto-discovered (no path fields in `plugin.json`).

**Rationale:** Keeps adding a second plugin/skill a pure directory addition with zero edits to existing manifests (MKT-04); matches the official Anthropic marketplace and the maintainer's own `lz-advisor` repo.
**Source:** 01-CONTEXT.md (D-01, D-02, D-03), .planning/research/ARCHITECTURE.md

### `version` declared only in `plugin.json`, never in the marketplace entry
`version: "0.0.1"` (full X.Y.Z semver) lives in `plugin.json` alone; the marketplace `plugins[]` entry carries no `version`.

**Rationale:** Avoids the version-masking trap where `plugin.json` silently wins and the marketplace value is masked (MKT-05).
**Source:** 01-CONTEXT.md (D-04), 01-VERIFICATION.md

### `$schema` set to the Anthropic marketplace URL (documentary only)
`"$schema": "https://anthropic.com/claude-code/marketplace.schema.json"` matches the official marketplace, but is documentary: `claude plugin validate` uses its own internal schema regardless.

**Rationale:** Highest source-authority match; SchemaStore's schema is the fallback only if live editor autocomplete/validation is later wanted.
**Source:** 01-CONTEXT.md (D-05)

### Minimal, deliberately non-triggering placeholder skill
`SKILL.md` ships frontmatter `name: lz-tpp` (matches dir -> `/lz-tdd:lz-tpp`) + a short stub `description` that is NOT tuned to trigger during TDD, + a stub body; no `version` field, no `references/` yet.

**Rationale:** Satisfies "frontmatter present" (success criterion 5) without a half-baked coach auto-firing during development; real authoring + trigger-tuning are Phase 3/5 (D-08, D-09).
**Source:** 01-CONTEXT.md (D-08, D-09), 01-01-SUMMARY.md

### Remote install resolution deferred to ship-time; local path proxy is the Phase-1 gate
The remote form `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` is NOT claimed in Phase 1 (GitHub repo + physical singular->plural rename + push are out-of-session). Phase 1 validates the LOCAL proxy: `claude plugin marketplace add ./` -> list -> remove.

**Rationale:** No git remote exists yet and the cwd rename mid-session breaks tooling; separating the local structural gate from the remote name resolution keeps Phase 1 honestly verifiable (D-13).
**Source:** 01-CONTEXT.md (D-13), 01-VERIFICATION.md

---

## Lessons

### Writing the work-email literal as a grep needle leaks it into the public repo
Acceptance criteria and the validation strategy originally spelled out the work-email string as the search needle (`rg -n "<work-email>" ...`). Because `.planning/` is tracked and pushed, that literal became a real leak in the public repo, and a repo-wide check would also false-fail against the tracked planning docs.

**Context:** Caught by the plan-checker (and re-surfaced in code review WR area). Fixed by switching to an email ALLOWLIST that never spells the work email: `rg -uNo -e '<email-regex>' <manifests> | rg -v 'larsbrinknielsen@gmail\.com'` returns nothing. Applies to any public repo whose planning docs are tracked.
**Source:** 01-REVIEW.md, plan hygiene-fix commit (009060c), 01-SECURITY.md (T-01-01)

### Reference/stack docs drift from locked decisions -- reconcile sample values
The research STACK.md's copy-ready `plugin.json` sample showed `version: "0.1.0"`, but the milestone locks `0.0.1` (D-04/MKT-02). A planner copying the sample verbatim would have shipped the wrong version.

**Context:** Flagged explicitly in RESEARCH.md and re-stated as a planner constraint; the executor used 0.0.1. Treat copy-ready samples as illustrative, not authoritative -- locked decisions win.
**Source:** 01-RESEARCH.md, 01-01-PLAN.md constraints

### `claude plugin` CLI command forms differ from intuition
The local marketplace add uses `marketplace add ./` (the `./` path form, not bare `add .`), and uninstalled marketplace plugins surface via `plugin list --available --json` -- plain `plugin list` shows only installed plugins.

**Context:** Two Rule-3 command-form corrections during the Task 3 validation loop (verification-procedure only, no file change). Verified against `claude` CLI 2.1.198.
**Source:** 01-01-SUMMARY.md (deviations)

### `claude plugin validate . --strict` is clean when a top-level marketplace `description` is present
Assumption A1 resolved: with the optional top-level `description` set, `--strict` passes with zero errors AND zero warnings -- including on the intentionally short placeholder skill description (it did NOT trip a strict warning).

**Context:** RESEARCH.md flagged A1 as an empirical unknown; execution confirmed the clean path. Include a top-level marketplace `description` to keep `--strict` green.
**Source:** 01-RESEARCH.md (A1), 01-01-SUMMARY.md, 01-VERIFICATION.md

---

## Patterns

### Cite `D-NN` decision ids inside the plan's `must_haves` frontmatter block
The `check.decision-coverage-plan` gate (BLOCKING) searches ONLY the plan's `must_haves` frontmatter block (plus body sections under markdown `#`-headings named must_haves/truths/tasks/objective), matching each trackable decision by `\bD-NN\b` id token OR its first-6-normalized-words phrase.

**When to use:** Always, when a phase has a CONTEXT.md with trackable decisions. GSD plans use XML `<tasks>`/`<objective>` tags, so `D-NN` citations in task bodies are INVISIBLE to the gate -- put the id citations in `must_haves.truths`/`artifacts`. This phase's gate initially reported 1/12 covered until D-NN citations were added to must_haves.
**Source:** decision-coverage-plan gate behavior, fix commit (566999d)

### Tag meta/caveat decisions `[informational]` to exclude them from coverage gates
Verification caveats and other non-implementation decisions should be tagged `- **D-NN [informational]:**` in CONTEXT.md. The decisions parser requires the exact `**D-NN:**` or `**D-NN [tags]:**` form -- a parenthetical suffix like `**D-13 (verification caveat):**` BREAKS parsing (the decision is dropped / merged into the prior one).

**When to use:** For any CONTEXT.md decision that is guidance-for-downstream rather than something the plan builds (e.g., "don't over-claim X in verification"). Non-trackable tags: `informational`, `folded`, `deferred`; or place under a `### Claude's Discretion` heading.
**Source:** 01-CONTEXT.md (D-13), commit (566999d), get-shit-done decisions parser

### CLI validation as the Nyquist "test runner" for content/manifest phases
For pure JSON + Markdown phases (no code, no build), the `claude plugin validate .` gate (+ `--strict`, + the local marketplace add/list/remove loop, + `rg` source assertions) IS the validation instrument. No unit-test framework is installed and no test files are generated -- that would violate the phase's scope fence.

**When to use:** Scaffold/config/docs phases with no runtime behavior. Record the success-criterion -> validation-point map in VALIDATION.md; Wave 0 has no gaps; mark `nyquist_compliant: true` without generating tests.
**Source:** 01-VALIDATION.md, 01-RESEARCH.md (Validation Architecture)

### Single-plan wave -> run the executor sequentially on the main tree
With exactly one plan in a wave there is no parallelism to isolate, so worktree isolation adds merge/cleanup machinery for no benefit (and more risk on Windows). Run the one executor sequentially on `main`; it commits directly and updates STATE/ROADMAP itself.

**When to use:** Any phase whose wave contains a single plan, especially in a repo with no git remote (`worktree.baseRef: "head"` keeps worktrees safe, but sequential is simpler here).
**Source:** execute-phase orchestration (this run), 01-01-SUMMARY.md

---

## Surprises

### Decision-coverage gate reported 1/12 despite every `D-NN` being cited in the plan body
The plan cited all decisions by id in `<read_first>`/`<action>` task blocks, yet the gate counted only D-08 covered. Cause: the gate scans only `must_haves` (not `<tasks>` bodies), and D-08 matched by phrase coincidence because its decision text begins with a file path (`plugins/lz-tdd/skills/lz-tpp/SKILL.md`) that also appears in an artifact entry.

**Impact:** Required reverse-engineering the gate's matcher from source and a plan revision to add explicit `D-NN` citations to `must_haves`; ~1 extra revision cycle before the BLOCKING gate passed 12/12.
**Source:** check.decision-coverage-plan output, get-shit-done/sdk decision-coverage matcher, fix commit (566999d)

### `--strict` validation produced zero warnings on a deliberately minimal placeholder
The placeholder skill description was intentionally short and non-triggering, and RESEARCH flagged as a risk that `--strict` might warn on it. It did not -- `--strict` was fully clean.

**Impact:** No strict-warning noise to explain away; the phase gate stayed a simple exit-0 check. Confirms a minimal stub skill can coexist with a strict-clean marketplace.
**Source:** 01-01-SUMMARY.md, 01-RESEARCH.md (A1)
