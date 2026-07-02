# Phase 1: Marketplace & Plugin Scaffold - Research

**Researched:** 2026-07-02
**Domain:** Claude Code plugin marketplace repo scaffold (JSON manifests + Markdown skill placeholder; no runtime code, no build step)
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions (D-01 .. D-13, binding)

- **D-01:** Three-level manifest hierarchy exactly as ARCHITECTURE.md prescribes: root
  `.claude-plugin/marketplace.json`, `plugins/lz-tdd/.claude-plugin/plugin.json`,
  `plugins/lz-tdd/skills/lz-tpp/SKILL.md`. Adopt the `plugins/<name>/` container from
  day one -- do NOT flatten the single plugin to the repo root (anti-pattern 1). This is
  what makes a second plugin a pure addition (MKT-04).
- **D-02:** Component dirs (`skills/`) live at the PLUGIN root, never inside
  `.claude-plugin/` (anti-pattern 2). Rely on auto-discovery -- `plugin.json` needs NO
  `skills`/`commands`/`agents`/`hooks` path fields.
- **D-03:** Marketplace entry locates the plugin via a relative string
  `"source": "./plugins/lz-tdd"`. Do NOT use `metadata.pluginRoot` for v1. Paths are
  `./`-relative, forward slashes, never `../` or absolute (anti-pattern 4).
- **D-04:** Declare `version: "0.0.1"` (full X.Y.Z semver) ONLY in `plugin.json`. OMIT
  `version` from the marketplace entry to avoid the version-masking trap (MKT-05).
- **D-05:** Include `$schema: "https://anthropic.com/claude-code/marketplace.schema.json"`
  to match the official Anthropic marketplace. `claude plugin validate` uses its own
  internal schema regardless of `$schema`; the Anthropic URL is documentary and does not
  resolve for live editor validation. SchemaStore's
  `https://json.schemastore.org/claude-code-marketplace.json` is the fallback ONLY if
  editor autocomplete/validation is later desired.
- **D-06:** `name: "lz-engineering-claude-plugins"` (plural, matches the target GitHub
  repo), `owner: { name: "Lars Gyrup Brink Nielsen" }`. The single plugin entry carries
  `name` + `source` + `description` + `category: "development"`. No `version` in the entry.
- **D-07:** `plugin.json` fields per MKT-02: `name: "lz-tdd"` (kebab-case; drives the
  `/lz-tdd:` namespace), `version: "0.0.1"`, `description`, `author`
  (`name: "Lars Gyrup Brink Nielsen"`, `email: "larsbrinknielsen@gmail.com"` -- public
  gmail only, NEVER the work email), `license: "MIT"` (machine-readable field),
  `keywords`, and `repository`/`homepage` pointing at
  `https://github.com/LayZeeDK/lz-engineering-claude-plugins`. Strict JSON -- no comments,
  no trailing commas.
- **D-08:** `plugins/lz-tdd/skills/lz-tpp/SKILL.md` is a MINIMAL valid placeholder: YAML
  frontmatter with `name: lz-tpp` (must equal the directory name so the namespace resolves
  to `/lz-tdd:lz-tpp`) + a short `description` + a stub body noting it is a placeholder to
  be authored in Phase 3. Keep frontmatter defaults -- do NOT set
  `disable-model-invocation` or `user-invocable`. Do NOT add a `version` field. No
  `references/` content yet (Phases 2-3).
- **D-09:** The placeholder `description` reads clearly as a stub and is NOT tuned to
  trigger during TDD (the trigger-tuned description is authored in Phase 3, tuned
  empirically in Phase 5).
- **D-10:** Add a `.gitignore` covering Node + OS noise (`node_modules/`, build output
  like `dist/`/`build/`, `*.log`, `.DS_Store`, `Thumbs.db`, editor cruft). Keep
  `.planning/` TRACKED. ASCII-only content (DIST-04).
- **D-11:** Every committed manifest and doc uses the FINAL plural name
  `lz-engineering-claude-plugins` from the first commit, even though the local working
  directory is the singular `lz-engineering-claude-plugin`. Never reference the singular
  folder name in committed files. Identifier alignment: GitHub repo == marketplace `name`
  == `lz-engineering-claude-plugins`; plugin `name: lz-tdd`; skill dir == frontmatter
  `name` == `lz-tpp` (pitfalls 6, 9).
- **D-12:** The `license: "MIT"` FIELD in `plugin.json` is in scope (MKT-02), but the
  LICENSE FILE and README content are DEFERRED to Phase 4. No `commands/`, `agents/`,
  `hooks/`, or `.mcp.json`. No `package.json` / build / lint tooling -- the repo is pure
  JSON + Markdown with no build step; `claude plugin validate` is the gate, not npm.
- **D-13 (verification caveat):** Success criterion 2
  (`/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` resolves) can only be
  FULLY confirmed after the physical rename + GitHub push, a ship-time step OUTSIDE this
  session. In Phase 1, validate structurally via `claude plugin validate .` and a LOCAL
  `claude plugin marketplace add ./` loop. The planner and verifier must NOT over-claim
  remote name resolution for Phase 1.

### Claude's Discretion

- Exact `keywords` array in `plugin.json` (e.g. `tdd`, `testing`,
  `transformation-priority-premise`, `red-green-refactor`, `clean-code`).
- Exact `.gitignore` entries beyond the Node/OS baseline.
- Exact placeholder `description` wording (kept non-triggering per D-09).
- Whether to include both `repository` and `homepage` in `plugin.json` or just `repository`.
- Whether to add a one-line stub `README.md` for GitHub presentability (full README is
  Phase 4 -- a stub is optional and low-impact).

### Deferred Ideas (OUT OF SCOPE for Phase 1)

- Physical folder + GitHub repo rename to plural + first push (ship-time, outside session).
- LICENSE file + README.md content (Phase 4: DIST-01, DIST-02). Only the `license: "MIT"`
  FIELD in `plugin.json` is in this phase.
- Second plugin / second skill under `lz-tdd` (NEXT-01 / NEXT-02).
- `package.json` + Prettier/ESLint tooling.
- SchemaStore `$schema` swap.
- `references/transformations.md` content (Phase 2/3).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MKT-01 | Root `.claude-plugin/marketplace.json` named `lz-engineering-claude-plugins` (owner LayZeeDK) listing `lz-tdd` via relative `source` `./plugins/lz-tdd` | Concrete `marketplace.json` spec below; source form verified against ARCHITECTURE.md + official Anthropic marketplace. |
| MKT-02 | `plugins/lz-tdd/.claude-plugin/plugin.json` valid: `name: lz-tdd`, `version: 0.0.1`, description, author, MIT license, keywords | Concrete `plugin.json` spec below (version pinned to 0.0.1 per D-04, superseding the 0.1.0 example in STACK.md). |
| MKT-03 | Repo passes `claude plugin validate .` and the plugin-dev validator with no errors | Validation gate section: exact CLI (`claude plugin validate .`, `--strict`) verified available on this machine; plugin-dev `plugin-validator` agent. |
| MKT-04 | Layout extensible -- adding a second skill or plugin needs no restructuring | Extensibility relies on auto-discovery (D-02) + per-plugin marketplace entries; structural check in Validation Architecture. |
| MKT-05 | `version` declared only in `plugin.json` (omitted from marketplace entry) | D-04; `--strict` catches any version-mask regression; grep check in Validation Architecture. |
| DIST-04 | A `.gitignore` (Node / OS noise) is present | Concrete `.gitignore` spec below; must NOT ignore `.planning/` (D-10). |
</phase_requirements>

## Summary

This phase is a greenfield scaffold: from a bare repo (only `.git`, `.planning`,
`AGENTS.md`, `CLAUDE.md` today), create four files that together form a valid, installable
Claude Code marketplace hosting one plugin (`lz-tdd`) with one placeholder skill
(`lz-tpp`). There is no runtime code, no test framework, no build step, and no external
package installation. The "stack" is entirely the Claude Code plugin/skill file format
plus the `claude` CLI as the validation gate.

The phase is heavily pre-researched (ARCHITECTURE.md, PITFALLS.md, STACK.md are all HIGH
confidence and already verified against the official Anthropic marketplace and the
maintainer's own `lz-advisor` repo). This document does not re-derive that work; it
consolidates the four buildable file specs (reconciled against the 13 locked decisions),
nails the validation gate on this Windows arm64 machine, and states the ordering
constraints and the small set of Phase-1-relevant pitfalls.

One correction the planner must not miss: STACK.md's copy-ready `plugin.json` shows
`version: "0.1.0"`, but D-04 and MKT-02 LOCK the version to `"0.0.1"` (the 0.0.1
milestone). Use `0.0.1`.

**Primary recommendation:** Create `.gitignore`, root `marketplace.json`,
`plugins/lz-tdd/.claude-plugin/plugin.json`, and
`plugins/lz-tdd/skills/lz-tpp/SKILL.md` exactly as specified below (all four before
validating), then gate on `claude plugin validate .` (plain, must be error-free) followed
by `claude plugin validate . --strict` (should be clean; proves MKT-05 and no unrecognized
fields), then a LOCAL `claude plugin marketplace add ./` -> `list` -> `remove` loop as the
offline proxy for success criterion 2.

## Architectural Responsibility Map

The three "tiers" here are the three manifest levels, not application layers. Each level
only references the level below; nothing is duplicated upward.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Marketplace identity + plugin catalog | Root `marketplace.json` | -- | Only file `/plugin marketplace add` reads first; lists plugins via `source`. [CITED: .planning/research/ARCHITECTURE.md] |
| Plugin identity + version + namespace (`/lz-tdd:`) | `plugins/lz-tdd/.claude-plugin/plugin.json` | -- | `name` drives the namespace; `version` is the single source of truth (D-04). |
| Skill registration + trigger metadata | `plugins/lz-tdd/skills/lz-tpp/SKILL.md` | -- | Auto-discovered under `skills/`; frontmatter `name`+`description` register `lz-tpp`. |
| Component discovery (skills) | Filesystem convention (`skills/*/SKILL.md`) | `plugin.json` (NO path fields) | Auto-discovery; adding path fields is unnecessary surface area (D-02). |
| Repo hygiene / ignore rules | `.gitignore` (repo root) | -- | Not read by the plugin runtime; pure distribution hygiene (DIST-04). |

## Concrete File Specs (buildable)

All four files are ASCII-only, strict JSON where applicable (no comments, no trailing
commas -- Pitfall 8). Create them under the singular working directory
`lz-engineering-claude-plugin`, but every committed identifier uses the plural
`lz-engineering-claude-plugins` (D-11).

### 1. `.gitignore` (repo root)

Node + OS baseline (D-10). MUST NOT contain `.planning/` (keep tracked). Editor entries
are discretion; keep minimal.

```
# Dependencies
node_modules/

# Build output
dist/
build/
out/

# Logs
*.log
npm-debug.log*

# OS noise
.DS_Store
Thumbs.db

# Editor
.idea/
*.swp
```

[CITED: CONTEXT.md D-10; .planning/research/PITFALLS.md security table (ASCII-only)]

### 2. `.claude-plugin/marketplace.json` (repo root)

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "lz-engineering-claude-plugins",
  "description": "Engineering-focused plugins for Claude Code.",
  "owner": {
    "name": "Lars Gyrup Brink Nielsen",
    "email": "larsbrinknielsen@gmail.com"
  },
  "plugins": [
    {
      "name": "lz-tdd",
      "source": "./plugins/lz-tdd",
      "description": "Test-driven development guidance for Claude Code, including Transformation Priority Premise (TPP) coaching.",
      "category": "development"
    }
  ]
}
```

Field provenance (locked vs recommended-optional):

| Field | Status | Note |
|-------|--------|------|
| `$schema` | LOCKED (D-05) | Documentary; validator ignores it. |
| `name` | LOCKED (D-06) | Plural. Not on Anthropic's reserved-names list. [CITED: STACK.md] |
| `owner.name` | LOCKED (D-06) | -- |
| `plugins[].name` / `.source` / `.description` / `.category` | LOCKED (D-06) | `source` relative string, no `version` in entry (D-04). |
| `description` (top-level) | RECOMMENDED-OPTIONAL | Not in D-06's field list, but clears the "no marketplace description" warning so `claude plugin validate . --strict` passes clean. Include unless the user objects. |
| `owner.email` | RECOMMENDED-OPTIONAL | Public gmail per CLAUDE.md contact rule; D-06 specifies only `owner.name`. Provides a public contact; safe to include. |

Note: D-06 lists the REQUIRED marketplace fields, not an exhaustive whitelist. The two
recommended-optional additions above do not contradict any locked decision. If strict
adherence to D-06's literal field set is preferred, drop both -- plain `claude plugin
validate .` still passes (they only affect `--strict`). [ASSUMED] that `--strict` errors
on a missing top-level marketplace description (help text says it fails on "missing
metadata"); confirm empirically during execution.

### 3. `plugins/lz-tdd/.claude-plugin/plugin.json`

```json
{
  "name": "lz-tdd",
  "version": "0.0.1",
  "description": "Test-driven development guidance for Claude Code. Includes the lz-tpp skill operationalizing Robert C. Martin's Transformation Priority Premise (TPP).",
  "author": {
    "name": "Lars Gyrup Brink Nielsen",
    "email": "larsbrinknielsen@gmail.com"
  },
  "homepage": "https://github.com/LayZeeDK/lz-engineering-claude-plugins",
  "repository": "https://github.com/LayZeeDK/lz-engineering-claude-plugins",
  "license": "MIT",
  "keywords": [
    "tdd",
    "test-driven-development",
    "transformation-priority-premise",
    "tpp",
    "red-green-refactor",
    "clean-code",
    "typescript"
  ]
}
```

Field provenance:

| Field | Status | Note |
|-------|--------|------|
| `name` | LOCKED (D-07) | Kebab-case, matches `^[a-z][a-z0-9]*(-[a-z0-9]+)*$`; drives `/lz-tdd:` namespace. [CITED: STACK.md] |
| `version` | LOCKED (D-04) | MUST be `"0.0.1"` (full X.Y.Z). This OVERRIDES STACK.md's `0.1.0` example. |
| `description`, `author.name`, `author.email`, `license`, `keywords` | LOCKED (D-07) | `author.email` = public gmail ONLY. `license: "MIT"` is the machine-readable field (the LICENSE FILE is Phase 4). |
| `homepage` + `repository` | RECOMMENDED (discretion) | Both included, string form pointing at the plural repo URL. String `repository` is acceptable for v1; the object form `{type,url,directory}` is available if precise monorepo pointing is later wanted. [CITED: STACK.md] |
| `keywords` values | DISCRETION | Merged set covering both STACK.md and CONTEXT.md example vocabularies. |
| NO `commands`/`agents`/`hooks`/`mcpServers` path fields | LOCKED (D-02) | Rely on auto-discovery of `skills/`. |

### 4. `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (placeholder)

```markdown
---
name: lz-tpp
description: Placeholder for the lz-tpp Transformation Priority Premise (TPP) skill. The dual-mode coach and reference behavior is authored in Phase 3.
---

# lz-tpp: Transformation Priority Premise coach

Placeholder skill. The dual-mode coach + reference behavior for Robert C. Martin's
Transformation Priority Premise is authored in Phase 3 (SKILL-01..06) on top of the
distilled reference material produced in Phase 2 (TPP-01..04). No `references/` content
exists yet.
```

Constraints:
- `name: lz-tpp` MUST equal the directory name so the namespace resolves to
  `/lz-tdd:lz-tpp` (D-08, anti-pattern 5). [CITED: ARCHITECTURE.md, PITFALLS.md Pitfall 6]
- `description` is a plain stub, deliberately NOT trigger-tuned (D-09). Keeping it
  non-triggering prevents a half-baked placeholder from auto-firing during development
  while still satisfying "frontmatter present" (success criterion 5).
- NO `version` field (not a valid skill frontmatter field; unknown fields are ignored by
  the runtime but `--strict` may flag them). [CITED: STACK.md flagged discrepancy]
- Do NOT set `disable-model-invocation` or `user-invocable` -- keep defaults (D-08).
- No `references/` directory yet (D-08).

## Standard Stack

Not a runtime application. The "stack" is the file format + the `claude` CLI gate.
Full field reference lives in .planning/research/STACK.md. Phase-1-relevant summary:

| Technology | Version | Purpose | Source |
|------------|---------|---------|--------|
| `.claude-plugin/marketplace.json` | Claude Code >= 2.1.x | Root catalog | [CITED: STACK.md] |
| `.claude-plugin/plugin.json` | Claude Code >= 2.1.x | Plugin manifest | [CITED: STACK.md] |
| `SKILL.md` (Agent Skills format) | current | Skill (frontmatter + body) | [CITED: STACK.md] |
| `claude` CLI (`plugin validate`, `plugin marketplace add`) | 2.1.198 (installed) | Validation + local install gate | [VERIFIED: claude CLI 2.1.198 on this machine] |
| `plugin-dev` plugin (`plugin-validator` agent) | 0.1.0 (installed) | Structural + security review | [CITED: STACK.md] |

**No installation step in this phase.** No npm/pip/cargo, no `package.json` (D-12).

## Package Legitimacy Audit

Not applicable. Phase 1 installs NO external packages -- it is pure JSON + Markdown with no
`package.json`, no build, no dependencies (D-12). slopcheck / registry verification is not
required for this phase.

## Build Order and Ordering Constraints

From ARCHITECTURE.md "Build Order", the Phase-1 subset (steps 1-4 + validate; steps 5-7
are Phases 2-4):

1. **`.gitignore`** -- repo-hygiene skeleton so the repo commits clean from the first
   commit (DIST-04). No dependency; can be created first or last.
2. **`plugins/lz-tdd/.claude-plugin/plugin.json`** and
   **`plugins/lz-tdd/skills/lz-tpp/SKILL.md`** -- the plugin subtree that the marketplace
   `source` must point at.
3. **`.claude-plugin/marketplace.json`** -- its `plugins[].source` (`./plugins/lz-tdd`)
   does NOT resolve until the plugin subtree in step 2 exists.
4. **Validate** -- only after ALL four files exist.

**Hard ordering constraint (the one thing the planner must respect):** Do NOT run
`claude plugin validate .` until `plugins/lz-tdd/.claude-plugin/plugin.json` AND
`plugins/lz-tdd/skills/lz-tpp/SKILL.md` both exist. The marketplace `source` resolution
and the `skills/` auto-discovery both fail if validated against an incomplete subtree.
Because this is a single plan creating all four files, the practical rule is: create all
files, then validate once. [CITED: ARCHITECTURE.md "What must exist before what"]

| Artifact | Hard prerequisite |
|----------|-------------------|
| marketplace.json plugin entry resolves | `plugins/lz-tdd/.claude-plugin/plugin.json` exists |
| Skill `lz-tpp` is discovered | `plugin.json` + `skills/lz-tpp/SKILL.md` exist |

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Manifest schema validation | A custom JSON schema check / ad-hoc `node -e` JSON.parse gate | `claude plugin validate .` (+ `--strict`) | First-party gate: checks marketplace schema, duplicate names, path traversal, descends into each plugin's `plugin.json`, and validates SKILL.md frontmatter. [VERIFIED: claude CLI 2.1.198] |
| Skill discovery wiring | `skills`/`commands` path fields in `plugin.json` | Auto-discovery of `skills/*/SKILL.md` | Fewer paths to get wrong; adding fields is unnecessary surface area (D-02). [CITED: ARCHITECTURE.md Pattern 3] |
| Structural / security review | Manual eyeballing | plugin-dev `plugin-validator` agent | Complements the CLI with structure + security findings. [CITED: STACK.md] |

**Key insight:** The entire correctness surface of this phase is covered by first-party
tooling. Do not write bespoke validation scripts.

## Common Pitfalls (Phase-1 subset)

Only the scaffold-relevant pitfalls from .planning/research/PITFALLS.md. The TPP-content
and skill-behavior pitfalls (1-5, 7, 10-12) belong to Phases 2-3.

### Pitfall 8: Manifest errors that make the plugin silently fail to load
**What goes wrong:** Invalid JSON (trailing comma, comment), a `source` path that does not
resolve, a non-kebab-case `name`, a non-full-semver `version` (`0.1` instead of `0.0.1`),
or a missing required field -- any one makes the plugin never load or fail validation.
**How to avoid:** Use the exact specs above; keep strict JSON; run `claude plugin validate
.` before commit. [CITED: PITFALLS.md Pitfall 8]
**Warning signs:** Plugin missing from `claude plugin list` after add; validator reports
schema/path/version errors.

### Pitfall 9: Repo-rename / four-identifier name-mismatch trap
**What goes wrong:** The remote install command fails or installs the wrong thing because
GitHub repo name, local working dir (`lz-engineering-claude-plugin`, singular),
marketplace.json `name`, and plugin `name` are not aligned.
**How to avoid:** Every committed file uses the plural `lz-engineering-claude-plugins`
(D-11). Alignment target: GitHub repo == marketplace `name` == `lz-engineering-claude-plugins`;
plugin `name: lz-tdd`; skill dir == frontmatter `name` == `lz-tpp`. The physical
folder + GitHub rename is a ship-time step OUTSIDE this session (D-13). Note: the LOCAL
`claude plugin marketplace add ./` loop uses the PATH, not the name, so the singular
folder name does NOT affect the local test -- only remote `owner/repo` resolution needs the
rename. [CITED: PITFALLS.md Pitfall 9; CONTEXT.md D-11, D-13]
**Warning signs:** Any committed path referencing the singular folder name; README install
command using a repo name that does not exist yet.

### Pitfall 6: Auto-trigger vs slash-invocation namespacing
**Phase-1 slice only:** Ensure skill dir == frontmatter `name` == `lz-tpp` so
`/lz-tdd:lz-tpp` resolves (the namespace uses the PLUGIN name `lz-tdd`, never the
marketplace name). The dual-mode frontmatter design is Phase 3; Phase 1 only fixes the
names. [CITED: PITFALLS.md Pitfall 6]

## Validation Architecture

This project has NO unit-test framework and NO build step (D-12) -- pure JSON + Markdown.
The Nyquist "test runner" for this phase is the `claude` CLI validation gate plus the
plugin-dev agents. That is the appropriate and sufficient sampling instrument for a
manifest scaffold.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `claude plugin validate` (first-party CLI) + plugin-dev `plugin-validator` agent |
| Config file | none (manifests are self-validating against the CLI's internal schema) |
| Quick run command | `claude plugin validate .` |
| Full suite command | `claude plugin validate .` then `claude plugin validate . --strict`, then local marketplace add/list/remove loop |

CLI availability and signatures [VERIFIED: claude CLI 2.1.198 on this machine]:
- `claude plugin validate <path>` -- validates a plugin or marketplace manifest;
  `--strict` treats warnings (unrecognized fields, missing metadata) as errors (exit 1).
- `claude plugin marketplace add <source>` -- source is a URL, path, or GitHub repo.
- `claude plugin marketplace list` -- lists configured marketplaces.
- `claude plugin marketplace remove <name>` -- removes by marketplace `name`.
- `claude plugin list` -- lists installed/available plugins.

### Success Criterion -> Validation Point Map

| Roadmap Success Criterion | Req | Validation Point (observable signal) |
|---------------------------|-----|--------------------------------------|
| 1. `claude plugin validate .` + plugin-dev validator report no errors | MKT-03 | `claude plugin validate .` exits 0 with no errors; `claude plugin validate . --strict` also clean; plugin-dev `plugin-validator` agent returns no findings. |
| 2. Marketplace resolves and lists `lz-tdd` via `./plugins/lz-tdd` | MKT-01 | LOCAL proxy: `claude plugin marketplace add .` SUCCEEDS (this parses marketplace.json AND resolves the `./plugins/lz-tdd` source); `claude plugin marketplace list` shows `lz-engineering-claude-plugins`; `claude plugin list` surfaces `lz-tdd`. Then `claude plugin marketplace remove lz-engineering-claude-plugins` to clean up. REMOTE `/plugin marketplace add LayZeeDK/...` is DEFERRED to ship-time (D-13) -- do NOT claim it passed in Phase 1. |
| 3. `version: 0.0.1` only in plugin.json, absent from marketplace entry (no mask) | MKT-05 | `git grep -n '"version"'` (or `rg`) shows `version` in `plugin.json` ONLY, not in `marketplace.json`. `claude plugin validate . --strict` emits no version-mismatch/mask warning. |
| 4. Second skill or plugin addable by new directories only | MKT-04 | Structural check: `plugin.json` has NO `skills`/`commands` path fields (auto-discovery); marketplace uses one entry per plugin. Confirm by inspection that adding `plugins/lz-tdd/skills/<new>/SKILL.md` or `plugins/<new>/` would need zero edits to existing files. [CITED: ARCHITECTURE.md Extensibility] |
| 5. `.gitignore` present + valid placeholder SKILL.md (frontmatter present); repo commits clean | DIST-04 | `.gitignore` exists at repo root and does NOT list `.planning/`; `SKILL.md` has valid `name`+`description` frontmatter (confirmed by `claude plugin validate .`); `git status` is clean after commit. |
| (cross-cutting) JSON well-formedness | MKT-01/02 | Both manifests parse as strict JSON -- `claude plugin validate .` fails fast on comments/trailing commas; optional cheap cross-check `node -e "JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'))" <file>`. |

### Sampling Rate
- **Per task commit:** `claude plugin validate .` (quick, must be error-free).
- **Phase gate:** `claude plugin validate . --strict` clean + local marketplace
  add/list/remove loop succeeds + plugin-dev `plugin-validator` agent clean, before
  `/gsd:verify-work`.

### Wave 0 Gaps
- None. No test framework to install (D-12 explicitly excludes npm/build tooling). The
  `claude` CLI gate is already present (2.1.198). No `conftest`/fixtures apply.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `claude` CLI | Validation gate (MKT-03) + local marketplace loop (MKT-01 proxy) | Yes | 2.1.198 | none needed |
| `git` | Repo hygiene / clean-commit check (success criterion 5) | Yes | (repo already initialized) | none needed |
| plugin-dev plugin (`plugin-validator` agent) | MKT-03 secondary review | Yes (installed 0.1.0) | 0.1.0 | `claude plugin validate --strict` alone is sufficient minimum |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none. Node.js is present (per CLAUDE.md runtimes)
if the optional `JSON.parse` cross-check is desired, but it is not required -- the CLI is
the gate.

## Security Domain

`security_enforcement` is not set in `.planning/config.json` (treated as enabled), but this
phase creates only static JSON + Markdown scaffold files -- no code execution, no auth, no
sessions, no cryptography, no input handling, no network calls, no external packages. The
ASVS categories (V2-V6) do not apply to a manifest scaffold. The only relevant concerns are
public-repo hygiene, drawn from PITFALLS.md "Security Mistakes":

| Concern | Control | Source |
|---------|---------|--------|
| Work email leaked in a public repo | Use `larsbrinknielsen@gmail.com` ONLY (in `plugin.json` `author.email` and, if included, `marketplace.json` `owner.email`); the work email appears nowhere | [CITED: PITFALLS.md; CLAUDE.md] |
| Non-ASCII / smart punctuation causing mojibake | ASCII-only in all committed files (`->` not arrows, `--` not em/en dashes) | [CITED: PITFALLS.md; CLAUDE.md] |
| Ambiguous reuse rights | `license: "MIT"` field in `plugin.json` this phase; LICENSE file is Phase 4 (D-12) | [CITED: CONTEXT.md D-12] |
| Path traversal in manifests | `./`-relative source, forward slashes, no `../` or absolute (D-03); `claude plugin validate` rejects traversal | [CITED: PITFALLS.md Pitfall 8] |

No STRIDE threat model applies beyond the above hygiene items.

## Runtime State Inventory

Omitted -- this is a greenfield scaffold phase (creating new files in a bare repo), not a
rename/refactor/migration. The four-identifier naming ALIGNMENT (D-11, Pitfall 9) is a
naming-consistency concern covered under Common Pitfalls, not runtime state (no stored
data, live services, OS registrations, secrets, or build artifacts exist to migrate). The
deferred physical folder + GitHub rename is a ship-time mechanical step (D-13), outside
this phase.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `claude plugin validate . --strict` errors on a MISSING top-level marketplace `description` ("missing metadata") | marketplace.json field provenance | LOW -- if wrong, the recommended top-level `description` is merely nice-to-have and plain validate still passes. Confirm empirically in execution. |
| A2 | The local `claude plugin marketplace add .` loop can register + list + remove the marketplace without polluting the user's environment when cleaned up via `marketplace remove` | Validation Architecture | LOW -- worst case leaves a stray local marketplace entry; `claude plugin marketplace remove lz-engineering-claude-plugins` reverses it. |

All other claims are LOCKED decisions (CONTEXT.md), CITED from HIGH-confidence local
research (ARCHITECTURE.md, PITFALLS.md, STACK.md), or VERIFIED against the installed
`claude` CLI 2.1.198.

## Open Questions (RESOLVED)

Both questions below are LOW-risk empirical assumptions with both branches handled by the
plan; recorded here as resolved for the research-resolution gate.

1. **Does `--strict` reject the placeholder SKILL.md's short non-triggering description?**
   - What we know: `--strict` fails on "unrecognized fields, missing metadata." A short but
     present `description` is valid frontmatter.
   - What's unclear: whether strict warns on a description it deems too generic/short.
   - RESOLVED: run `claude plugin validate . --strict` during execution; if it warns
     only (not errors) on the placeholder, that is acceptable for Phase 1 (D-09 keeps it a
     stub intentionally). Treat a strict ERROR here as a real gate; a strict WARNING on the
     placeholder is expected and non-blocking. (Assumption A1; confirm empirically at execution.)

2. **Optional stub `README.md` (discretion).**
   - What we know: full README is Phase 4 (DIST-01); a one-line stub is low-impact.
   - RESOLVED: OMIT for Phase 1 to keep the phase boundary clean (DIST-01 is
     explicitly Phase 4). If GitHub presentability matters before the ship-time push, a
     one-line stub is harmless -- but it is not required and adds a Phase-4-owned artifact.

## Sources

### Primary (HIGH confidence)
- `.planning/research/ARCHITECTURE.md` -- three-level hierarchy, copy-ready
  marketplace.json, `source` forms, build order, extensibility, anti-patterns. Verified
  against official Anthropic marketplace + maintainer's `lz-advisor` repo.
- `.planning/research/STACK.md` -- manifest field reference, copy-ready manifests,
  versioning/version-masking mechanics, `claude plugin validate` usage, min-version notes,
  SKILL.md frontmatter table.
- `.planning/research/PITFALLS.md` -- Pitfalls 6, 8, 9 (scaffold), security-mistakes and
  integration-gotchas tables, "Looks Done But Isn't" checklist.
- `.planning/phases/01-marketplace-plugin-scaffold/01-CONTEXT.md` -- locked decisions
  D-01..D-13.
- `.planning/REQUIREMENTS.md`, `.planning/ROADMAP.md` -- MKT-01..05, DIST-04 and the 5
  Phase-1 success criteria.
- `claude` CLI 2.1.198 on this machine -- `claude plugin validate --help`,
  `claude plugin marketplace --help`, `claude plugin --help` [VERIFIED this session].

### Secondary (MEDIUM confidence)
- CLAUDE.md "Technology Stack" section (project instructions) -- copy-ready manifests,
  versioning mechanics, "What NOT to Use (v1)" table (mirrors STACK.md).

## Metadata

**Confidence breakdown:**
- File specs: HIGH -- reconciled directly against locked decisions + HIGH-confidence
  research; only the `version` value corrected from STACK.md's 0.1.0 to the locked 0.0.1.
- Validation gate: HIGH -- CLI signatures verified on the exact target machine.
- Extensibility / build order: HIGH -- cited verbatim from ARCHITECTURE.md.
- Two minor assumptions (A1, A2) are LOW-risk and empirically checkable during execution.

**Research date:** 2026-07-02
**Valid until:** ~2026-08-01 (stable file format; re-check if `claude` CLI crosses a major
version or the marketplace schema changes).
