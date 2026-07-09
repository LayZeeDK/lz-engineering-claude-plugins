@AGENTS.md

<!-- GSD:project-start source:PROJECT.md -->
## Project

**lz-engineering-claude-plugins**

A public Claude Code plugin marketplace repository that hosts engineering-focused
plugins for Claude Code. The first plugin is `lz-tdd`, a test-driven-development
plugin; its first skill is `lz-tpp` (invoked as `/lz-tdd:lz-tpp`), an agent skill
that operationalizes Robert C. Martin's Transformation Priority Premise (TPP). It
is for software engineers who use Claude Code and practice TDD.

**Core Value:** `lz-tpp` helps Claude choose the next code transformation by TPP priority order
during red-green-refactor TDD -- keeping the implementation at the simplest
transformation that passes the failing test -- and explains the premise on demand.
If everything else fails, this transformation-priority guidance must be correct and
usable.

### Constraints

- **Tech stack**: Claude Code plugin format -- root `.claude-plugin/marketplace.json`, per-plugin `.claude-plugin/plugin.json`, skills as `SKILL.md` with YAML frontmatter and progressive disclosure. Skills are namespaced by plugin (`/lz-tdd:lz-tpp`).
- **Tooling**: Build the skill with `skill-creator`; scaffold and validate the plugin/marketplace with `plugin-dev`.
- **Source authority precedence**: Anthropic News / Claude Code Blog > frontier labs > community resources > Claude Code Docs > skill-creator > plugin-dev. Note: some Anthropic domains block AI fetchers -- use the fetch fallback chain (markdown.new, WebFetch, url-to-markdown, playwright-cli).
- **Public repo hygiene**: MIT license. For the MAINTAINER's commits and authored content, the only email that may appear -- in committed files, commit messages, and the commit author/committer identity -- is the public contact `larsbrinknielsen@gmail.com`; the maintainer's employer email and its bare domain must never be committed, plain or obfuscated. Outside contributors commit under their own identity and must never be blocked by a hygiene check. Verify by allowlist-inversion (assert only the approved gmail is present); never write a forbidden value as a search needle. See `AGENTS.md`.
- **Local system**: Windows 11 arm64, PowerShell Core + Git Bash; ASCII-only output (no Unicode/emojis); `git grep`/`rg` for search; `npm` default package manager.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

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
- `marketplace.json` MUST live at `<repo>/.claude-plugin/marketplace.json`.
- Relative `source` paths resolve against the **marketplace root** (the dir that
- Component dirs (`skills/`) live at the plugin root, NOT inside `.claude-plugin/`.
- The skill's **directory name** (`lz-tpp`) determines the invocation command
- `skills/` is auto-discovered from the plugin root; no path config in `plugin.json` is needed.
## Concrete Manifests (copy-ready for this repo)
### `.claude-plugin/marketplace.json`
- Required top-level: `name` (kebab-case, public-facing), `owner` (object; `name`
- `$schema` is optional and ignored at load time, but enables editor autocomplete/validation. The official marketplace sets it.
- The marketplace `name` is independent of the folder name. Set it to
- Per-plugin required fields inside `plugins[]`: `name` + `source`. Everything else
- **Deliberately omit `version` from the marketplace entry** -- see Versioning below.
### `plugins/lz-tdd/.claude-plugin/plugin.json`
- Only `name` (kebab-case) is strictly required; the rest is recommended metadata
- `name` must match `^[a-z][a-z0-9]*(-[a-z0-9]+)*$` -- `lz-tdd` passes.
- `version` follows semver `MAJOR.MINOR.PATCH`. Start at `0.1.0`.
- Because the plugin lives in a monorepo-style subdir, you MAY use the object form
- No `commands`/`agents`/`hooks`/`mcpServers` path fields -- rely on auto-discovery of `skills/`.
### `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (frontmatter skeleton)
# lz-tpp: Transformation Priority Premise coach
| Field | Value for lz-tpp | Reason |
|-------|------------------|--------|
| `name` | `lz-tpp` | Display label; keep equal to the directory name. |
| `description` | coach + reference + trigger phrases | Primary triggering mechanism. Put the key use case first; the combined `description` (+ optional `when_to_use`) is truncated at 1,536 chars in the skill listing. |
| `disable-model-invocation` | omit (default `false`) | The skill is a coach that MUST auto-trigger during TDD. Setting this true would block auto-loading. |
| `user-invocable` | omit (default `true`) | The reference behavior needs direct `/lz-tdd:lz-tpp` invocation. |
| `allowed-tools` | omit for v1 | Pure guidance/knowledge skill; it does not need to run tools without approval. Add later only if a bundled script appears. |
| `version` | OMIT | Not part of the current Claude Code skill frontmatter spec (see flagged discrepancy). |
## Install, Namespacing, and Versioning Mechanics
- The skill then invokes as `/lz-tdd:lz-tpp` (plugin skills are namespaced
- Users refresh with `/plugin marketplace update lz-engineering-claude-plugins`.
- Local pre-ship test: `/plugin marketplace add ./` then `/plugin install lz-tdd@lz-engineering-claude-plugins`.
- If the resolved version is unchanged, `/plugin update` and auto-update SKIP the
- **Do NOT declare `version` in both places.** `plugin.json` silently wins, so a
- **Recommended for this public, semver-expecting plugin:** keep `version` in
- Alternative (see table): omit `version` everywhere and let each commit be a new
- Non-blocking warnings you want to clear: "no plugins defined", "no marketplace
- Complementary AI review: `plugin-dev`'s `plugin-validator` agent (structure/security)
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
## Sources
- Official Claude Code docs, "Extend Claude with skills" (https://docs.claude.com/en/docs/claude-code/skills) -- fetched via markdown.new, page timestamp 2026-07-01 -- HIGH. Skill frontmatter table, command-name derivation, namespacing, progressive disclosure, invocation control, 1,536-char description cap, `< 500 lines` guidance, Agent Skills open standard.
- Official Claude Code docs, "Create and distribute a plugin marketplace" (https://docs.claude.com/en/docs/claude-code/plugin-marketplaces) -- fetched via markdown.new, page timestamp 2026-07-01 -- HIGH. marketplace.json required/optional fields, plugin-entry fields, all source types, version resolution rules, `claude plugin validate`, install/update commands, reserved names.
- Installed `claude-plugins-official/.claude-plugin/marketplace.json` (Anthropic's own marketplace, on disk) -- HIGH. Real-world confirmation of `$schema`, `owner`, `source` variants (relative `./plugins/...`, `github`, `url`, `git-subdir`), `category`, `keywords`, `strict`.
- Installed `lz-advisor-claude-plugins/.claude-plugin/marketplace.json` (user's own prior marketplace) -- HIGH. Confirms the minimal relative-path pattern this repo should follow.
- Local `plugin-dev` v0.1.0: `skills/plugin-structure/SKILL.md`, `references/manifest-reference.md`, `agents/plugin-validator.md`, `commands/create-plugin.md`, `skills/skill-development/SKILL.md`; and `skill-creator` `skills/skill-creator/SKILL.md` -- HIGH for authoring conventions, with the `version`/`name` frontmatter discrepancy flagged above.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->

<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
