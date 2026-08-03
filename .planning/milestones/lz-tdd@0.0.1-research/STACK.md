# Stack Research

**Domain:** Claude Code plugin marketplace + agent skill authoring (file-format + toolchain "stack")
**Researched:** 2026-07-02
**Confidence:** HIGH

> This is NOT a runtime application. The "stack" is the Claude Code plugin/skill
> authoring toolchain and the JSON/Markdown file formats it consumes. Everything
> below is verified against the current (dated 2026-07-01) official Claude Code
> docs AND against real installed manifests on this machine, including the
> official `claude-plugins-official` marketplace. Where a local `plugin-dev`
> v0.1.0 file disagrees with the current docs, the discrepancy is flagged.

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| `.claude-plugin/marketplace.json` | schema at `https://anthropic.com/claude-code/marketplace.schema.json` | Root catalog: names the marketplace and lists its plugins with sources | Required for a repo to be a Claude Code marketplace. `/plugin marketplace add` reads this file. |
| `.claude-plugin/plugin.json` (per plugin) | plugin manifest schema | Declares plugin identity/metadata; anchors auto-discovery of `skills/` | Required for Claude Code to recognize `lz-tdd` as a plugin. Only `name` is strictly required. |
| `SKILL.md` + Agent Skills format | Agent Skills open standard (agentskills.io); Claude Code extensions | The skill itself: YAML frontmatter + Markdown body with progressive disclosure | The single required file per skill. Directory name drives the `/lz-tdd:lz-tpp` command; `description` drives auto-triggering. |
| Claude Code plugin system | Claude Code >= 2.1.x (current line) | Runtime that installs, namespaces, and loads the plugin/skill | Target platform. Skill namespacing `/{plugin}:{skill}` and marketplace install are first-class. |

### Supporting Libraries / Authoring Toolchain

| Tool | Version | Purpose | When to Use |
|------|---------|---------|-------------|
| `plugin-dev` plugin (Anthropic) | 0.1.0 (installed) | Scaffolds plugin/marketplace structure; bundles the `plugin-validator` and `skill-reviewer` agents and the `/plugin-dev:create-plugin` workflow | Scaffolding the repo, validating structure, reviewing the skill. Per PROJECT.md constraint. |
| `skill-creator` plugin (Anthropic) | installed | Draft/iterate the skill, run trigger + output evals, optimize the `description` for accurate triggering | Building and tuning `lz-tpp` (coach + reference). Per PROJECT.md constraint. |
| `claude plugin validate .` (built-in CLI) | Claude Code >= 2.1.x | First-party validator: checks `marketplace.json` schema, duplicate names, path traversal; descends into each local-path plugin's `plugin.json`; validates skill/agent/command frontmatter | The authoritative structural gate before shipping. Also available as `/plugin validate .` in-session. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Git + GitHub (public repo) | Host the marketplace; enables `git`-based install and per-commit versioning | Repo must be named `lz-engineering-claude-plugins` for `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins`. |
| `claude plugin marketplace add ./<dir>` | Local test install before pushing | Use a local path to test the whole add -> install -> invoke loop offline. |
| `${CLAUDE_PLUGIN_ROOT}` / `${CLAUDE_SKILL_DIR}` | Portable path variables | `${CLAUDE_PLUGIN_ROOT}` = plugin install dir; `${CLAUDE_SKILL_DIR}` = the skill's own subdir. Needed only for hooks/scripts (not required for v1 lz-tpp). |

## Directory Layout (prescriptive, this repo)

```
lz-engineering-claude-plugins/          # repo root == marketplace root
|-- .claude-plugin/
|   '-- marketplace.json                # marketplace catalog (see below)
|-- plugins/
|   '-- lz-tdd/                          # plugin root (source: "./plugins/lz-tdd")
|       |-- .claude-plugin/
|       |   '-- plugin.json              # plugin manifest (see below)
|       |-- skills/
|       |   '-- lz-tpp/                  # skill dir name -> command /lz-tdd:lz-tpp
|       |       |-- SKILL.md             # required; frontmatter + body (< 500 lines)
|       |       '-- references/
|       |           '-- transformations.md   # bundled full TPP list (loaded on demand)
|       '-- README.md                    # optional, per-plugin docs
|-- LICENSE                              # MIT
'-- README.md                           # marketplace + install instructions
```

Rules that make this layout correct (all HIGH confidence, verified against current docs):

- `marketplace.json` MUST live at `<repo>/.claude-plugin/marketplace.json`.
- Relative `source` paths resolve against the **marketplace root** (the dir that
  contains `.claude-plugin/`), NOT against `.claude-plugin/` itself. So
  `"./plugins/lz-tdd"` points at `<repo>/plugins/lz-tdd`. Never use `../`.
- Component dirs (`skills/`) live at the plugin root, NOT inside `.claude-plugin/`.
- The skill's **directory name** (`lz-tpp`) determines the invocation command
  `/lz-tdd:lz-tpp`. For a plugin subdirectory skill the frontmatter `name` is only
  the display label; it does not change the command. Keep them identical to avoid confusion.
- `skills/` is auto-discovered from the plugin root; no path config in `plugin.json` is needed.

## Concrete Manifests (copy-ready for this repo)

### `.claude-plugin/marketplace.json`

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

Field notes:
- Required top-level: `name` (kebab-case, public-facing), `owner` (object; `name`
  required, `email` optional), `plugins` (array). Verified HIGH.
- `$schema` is optional and ignored at load time, but enables editor autocomplete/validation. The official marketplace sets it.
- The marketplace `name` is independent of the folder name. Set it to
  `lz-engineering-claude-plugins` even while the working directory is still
  `lz-engineering-claude-plugin` (singular). The name is NOT on Anthropic's
  reserved-names list and does not impersonate an official marketplace, so it is allowed.
- Per-plugin required fields inside `plugins[]`: `name` + `source`. Everything else
  (`description`, `category`, `author`, `version`, `keywords`, ...) is optional.
- **Deliberately omit `version` from the marketplace entry** -- see Versioning below.

### `plugins/lz-tdd/.claude-plugin/plugin.json`

```json
{
  "name": "lz-tdd",
  "version": "0.1.0",
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
    "refactoring",
    "typescript"
  ]
}
```

Field notes:
- Only `name` (kebab-case) is strictly required; the rest is recommended metadata
  for distribution. Verified HIGH against the official docs and the local
  `plugin-dev` manifest-reference.
- `name` must match `^[a-z][a-z0-9]*(-[a-z0-9]+)*$` -- `lz-tdd` passes.
- `version` follows semver `MAJOR.MINOR.PATCH`. Start at `0.1.0`.
- Because the plugin lives in a monorepo-style subdir, you MAY use the object form
  of `repository` to point precisely: `{"type":"git","url":"https://github.com/LayZeeDK/lz-engineering-claude-plugins.git","directory":"plugins/lz-tdd"}`.
  The string form above is simpler and acceptable for v1.
- No `commands`/`agents`/`hooks`/`mcpServers` path fields -- rely on auto-discovery of `skills/`.

### `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (frontmatter skeleton)

```yaml
---
name: lz-tpp
description: >-
  Recommends the next code transformation by Transformation Priority Premise
  (TPP) order during red-green-refactor TDD, and explains the transformations
  and their ordering on demand. Use when writing or discussing failing tests,
  choosing the simplest change to pass a test, refactoring, or when the user
  mentions TPP, transformation priority, {}->nil, nil->constant, or Uncle Bob's
  transformation list.
---

# lz-tpp: Transformation Priority Premise coach

[imperative-form body, < 500 lines; point to references/transformations.md for the full list]
```

Skill frontmatter decisions for `lz-tpp` (all verified against current skills doc):

| Field | Value for lz-tpp | Reason |
|-------|------------------|--------|
| `name` | `lz-tpp` | Display label; keep equal to the directory name. |
| `description` | coach + reference + trigger phrases | Primary triggering mechanism. Put the key use case first; the combined `description` (+ optional `when_to_use`) is truncated at 1,536 chars in the skill listing. |
| `disable-model-invocation` | omit (default `false`) | The skill is a coach that MUST auto-trigger during TDD. Setting this true would block auto-loading. |
| `user-invocable` | omit (default `true`) | The reference behavior needs direct `/lz-tdd:lz-tpp` invocation. |
| `allowed-tools` | omit for v1 | Pure guidance/knowledge skill; it does not need to run tools without approval. Add later only if a bundled script appears. |
| `version` | OMIT | Not part of the current Claude Code skill frontmatter spec (see flagged discrepancy). |

Bundled reference files: link them from the body with plain relative Markdown
links, e.g. `see [the full transformation list](references/transformations.md)`.
`${CLAUDE_SKILL_DIR}` is only needed when a `!`-injected shell command must locate
a bundled script regardless of cwd -- not required for v1.

## Install, Namespacing, and Versioning Mechanics

**Install (what the README documents):**
```text
/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins   # GitHub owner/repo shorthand
/plugin install lz-tdd@lz-engineering-claude-plugins             # install the plugin
```
- The skill then invokes as `/lz-tdd:lz-tpp` (plugin skills are namespaced
  `{plugin}:{skill}`, so they cannot collide with personal/project skills).
- Users refresh with `/plugin marketplace update lz-engineering-claude-plugins`.
- Local pre-ship test: `/plugin marketplace add ./` then `/plugin install lz-tdd@lz-engineering-claude-plugins`.

**Versioning / update detection (HIGH -- this is a real footgun):**
Claude Code resolves a plugin's version from the FIRST of:
1. `version` in the plugin's `plugin.json`
2. `version` in the marketplace entry
3. the git commit SHA of the plugin source

Consequences and the chosen strategy:
- If the resolved version is unchanged, `/plugin update` and auto-update SKIP the
  plugin. So a pinned `version` that you forget to bump means users never get updates.
- **Do NOT declare `version` in both places.** `plugin.json` silently wins, so a
  stale marketplace-entry version is masked. The `claude plugin validate` warns on mismatch.
- **Recommended for this public, semver-expecting plugin:** keep `version` in
  `plugin.json` ONLY, omit it from the marketplace entry, and bump it on every
  release. Clean, visible semver; matches the official walkthrough and most
  first-party entries in `claude-plugins-official`.
- Alternative (see table): omit `version` everywhere and let each commit be a new
  version. Simpler for rapid internal iteration, but no human-readable version.

**Validation (HIGH):**
```bash
claude plugin validate .                 # marketplace: schema, dup names, path traversal, per-entry plugin.json
claude plugin validate ./plugins/lz-tdd  # plugin: plugin.json + SKILL.md/agent/command/hook frontmatter
```
- Non-blocking warnings you want to clear: "no plugins defined", "no marketplace
  description", "plugin name not kebab-case".
- Complementary AI review: `plugin-dev`'s `plugin-validator` agent (structure/security)
  and `skill-reviewer` agent (description quality, progressive disclosure, writing style).

## What NOT to Use / Include (v1)

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `commands/` directory for the TPP feature | Custom commands have been MERGED into skills; a plugin subdirectory skill already produces the `/lz-tdd:lz-tpp` command. `commands/` is the legacy layout. | A single `skills/lz-tpp/SKILL.md`. |
| `agents/`, `hooks/`, `.mcp.json` in `lz-tdd` | Out of scope per PROJECT.md; skill-first. Adds surface area and validation risk with no v1 value. | Skill-only plugin; add later if a real need appears. |
| `npm` source for the plugin | Git-based marketplace install is sufficient for v1 and needs no publish pipeline. | Relative `source: "./plugins/lz-tdd"` in a GitHub-hosted marketplace. |
| `version` field in `SKILL.md` frontmatter | NOT in the current Claude Code skill frontmatter spec (see below). Harmless but noise. | Version the plugin via `plugin.json`, not the skill. |
| `version` in BOTH `plugin.json` and the marketplace entry | `plugin.json` wins silently; the other is masked and triggers a validator warning. | Declare `version` in `plugin.json` only. |
| `disable-model-invocation: true` on `lz-tpp` | Would stop the coach from auto-loading during TDD -- kills the primary use case. | Leave defaults so both Claude and the user can invoke. |
| Absolute or `../` paths anywhere | Rejected by the validator (path traversal) and break the cache-copy install model. | `./`-relative paths within the marketplace/plugin root. |

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Relative-path source `"./plugins/lz-tdd"` (single repo) | `github` / `git-subdir` / `url` / `npm` source objects | Use `github`/`git-subdir` if the plugin lives in a DIFFERENT repo than the marketplace, or for URL-only marketplace distribution (relative paths do NOT resolve when users add via a direct `marketplace.json` URL -- only that file is fetched). |
| `version` in `plugin.json`, bump per release | Omit `version` everywhere (commit-SHA versioning) | Rapid internal iteration where "every push = update" is desired and human-readable semver is not needed. |
| Skill-only plugin | Plugin bundling agents/hooks/MCP | When TDD workflows need deterministic automation (e.g., a pre-commit test hook) -- future milestones, not v1. |
| `owner.email` = `larsbrinknielsen@gmail.com` | Omit email | Only omit if you do not want a public contact; PROJECT.md requires the public contact, so include it. Never use the work email in this public repo. |

## Version Compatibility / Min-Version Notes

| Feature | Min Claude Code version | Relevance to v1 |
|---------|-------------------------|-----------------|
| Skills = commands merge, `/plugin` marketplace CLI, relative-path sources | Current 2.1.x line (broadly available) | Core to v1; assume any current install works. |
| `displayName` on plugin entry | 2.1.143 | Optional polish only; not needed. |
| `renames` map (auto-migrate renamed/removed plugins) | 2.1.193 | Not needed at launch; useful later if `lz-tdd` is ever renamed. |
| `${CLAUDE_PROJECT_DIR}` substitution in skills | 2.1.196 | Not needed for v1 lz-tpp (no scripts). |
| `defaultEnabled` on plugin entry | 2.1.154 | Leave default (enabled on install). |

Flagged discrepancy (MEDIUM confidence on the older source, HIGH on the resolution):
The locally-installed `plugin-dev` v0.1.0 skill files show `SKILL.md` frontmatter
with a `version:` field and a title-case `name:` (e.g. `name: Skill Name`). The
CURRENT official Claude Code skills reference (dated 2026-07-01) lists neither
`version` as a recognized skill field, and states `name` defaults to the directory
name and is only a display label for plugin subdirectory skills. Resolution: follow
the current docs -- omit `version` from `SKILL.md`, set `name: lz-tpp` (kebab, matching
the dir). Unknown frontmatter fields are ignored, so a stray `version` would not break
anything, but it is unnecessary.

## Sources

- Official Claude Code docs, "Extend Claude with skills" (https://docs.claude.com/en/docs/claude-code/skills) -- fetched via markdown.new, page timestamp 2026-07-01 -- HIGH. Skill frontmatter table, command-name derivation, namespacing, progressive disclosure, invocation control, 1,536-char description cap, `< 500 lines` guidance, Agent Skills open standard.
- Official Claude Code docs, "Create and distribute a plugin marketplace" (https://docs.claude.com/en/docs/claude-code/plugin-marketplaces) -- fetched via markdown.new, page timestamp 2026-07-01 -- HIGH. marketplace.json required/optional fields, plugin-entry fields, all source types, version resolution rules, `claude plugin validate`, install/update commands, reserved names.
- Installed `claude-plugins-official/.claude-plugin/marketplace.json` (Anthropic's own marketplace, on disk) -- HIGH. Real-world confirmation of `$schema`, `owner`, `source` variants (relative `./plugins/...`, `github`, `url`, `git-subdir`), `category`, `keywords`, `strict`.
- Installed `lz-advisor-claude-plugins/.claude-plugin/marketplace.json` (user's own prior marketplace) -- HIGH. Confirms the minimal relative-path pattern this repo should follow.
- Local `plugin-dev` v0.1.0: `skills/plugin-structure/SKILL.md`, `references/manifest-reference.md`, `agents/plugin-validator.md`, `commands/create-plugin.md`, `skills/skill-development/SKILL.md`; and `skill-creator` `skills/skill-creator/SKILL.md` -- HIGH for authoring conventions, with the `version`/`name` frontmatter discrepancy flagged above.

---
*Stack research for: Claude Code plugin marketplace + agent skill authoring*
*Researched: 2026-07-02*
