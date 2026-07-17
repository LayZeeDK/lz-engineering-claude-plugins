# Technology Stack

**Analysis Date:** 2026-07-17

## Languages

**Primary:**
- Markdown (CommonMark + YAML frontmatter) - The shipped product itself. Every deliverable is Markdown: `plugins/lz-tdd/skills/lz-tpp/SKILL.md`, `plugins/lz-tdd/skills/lz-refactor/SKILL.md`, and the reference catalogs under `plugins/lz-tdd/skills/lz-refactor/references/`. The skill body must stay under ~500 lines (progressive disclosure); bulk knowledge lives in `references/*`.
- JSON - Declarative manifests and eval configuration. `.claude-plugin/marketplace.json`, `plugins/lz-tdd/.claude-plugin/plugin.json`, and eval config such as `.claude/skills/lz-refactor-workspace/evals/evals.json`.

**Secondary:**
- JavaScript (ESM, `.mjs`) - The NON-shipped checker/eval harness only. Node built-ins only, no runtime framework. Lives under `.claude/skills/lz-refactor-workspace/` (e.g. `tools/check-catalog.mjs`, `grade-run.mjs`, `extract-samples.mjs`). Never distributed with the plugin.
- TypeScript - Appears ONLY inside fenced `ts` code blocks in the refactoring catalog Markdown (illustrative before/after snippets). `extract-samples.mjs` extracts these fences and compiles them with `tsc --strict --noEmit` to keep examples honest. There is no TypeScript application code.

## Runtime

**Environment:**
- Claude Code plugin runtime (>= 2.1.x, current line) - The actual target platform. It installs the marketplace, namespaces skills as `/lz-tdd:lz-tpp` and `/lz-tdd:lz-refactor`, and auto-loads/auto-triggers skills from the `description` frontmatter. The shipped plugin executes no code -- it is knowledge/guidance Markdown.
- Node.js v24.18.0 - Used ONLY by the local eval/checker harness (`.claude/skills/lz-refactor-workspace/`). Not required by end users of the plugin.

**Package Manager:**
- npm (default) - Only the harness has a manifest: `.claude/skills/lz-refactor-workspace/package.json` (`"private": true`, `"type": "module"`).
- Lockfile: none at repo root; the shipped plugin is intentionally dependency-free. Any `package-lock.json` would belong only to the gitignored workspace.

## Frameworks

**Core:**
- Claude Code plugin/marketplace system - Defines the required layout: root `.claude-plugin/marketplace.json` catalog, per-plugin `.claude-plugin/plugin.json`, and auto-discovered `skills/` directories. `source: "./plugins/lz-tdd"` resolves relative to the marketplace root.
- Agent Skills open standard - `SKILL.md` = YAML frontmatter (`name`, `description`) + Markdown body with progressive disclosure. The skill directory name drives the invocation command; `description` drives auto-triggering.

**Testing / Evaluation:**
- Custom checker battery (`.claude/skills/lz-refactor-workspace/tools/*.mjs`) - Structural/consistency gates over the catalogs. Run via `npm run check` (chains `check-catalog`, `check-kerievsky`, `check-gof`, `check-extra-patterns`, `check-smells`, `check-crossrefs`, `check-principles`, `check-hygiene`, `check-functional`, `check-backing`).
- `tsc --strict --noEmit` compile harness (`extract-samples.mjs`, `npm run typecheck`) - Compiles every `ts` fence in the catalogs so example code cannot rot.
- skill-creator eval harness (vendored, native-fixed) at `.claude/skills/lz-refactor-workspace/tools/skill-creator-eval/` - Runs trigger evals and applied-output evals via Claude Code headless (`claude -p`). Grading scripts: `grade-run.mjs`, `grade-reference.mjs`, `merge-judge.mjs`.

**Build/Dev:**
- No bundler/compiler for the shipped artifact -- Markdown ships as-is.
- `claude plugin validate .` (built-in CLI) - Authoritative structural gate: validates `marketplace.json` schema, duplicate names, path traversal, and descends into each plugin's `plugin.json` and skill frontmatter.

## Key Dependencies

**Critical (shipped plugin):**
- None. The shipped plugin is dependency-free Markdown by design (see `.claude/skills/lz-refactor-workspace/package.json` description: "the shipped skill stays dependency-free Markdown").

**Infrastructure (harness only, devDependencies):**
- `typescript` `6.0.3` - Pinned in `.claude/skills/lz-refactor-workspace/package.json`; provides `tsc` for the compile harness. Global `tsc 6.0.3` on PATH also works.

## Configuration

**Manifests:**
- `.claude-plugin/marketplace.json` - Marketplace catalog. Top-level `name`, `description`, `owner` (`name` + `email` = `larsbrinknielsen@gmail.com`), and `plugins[]` (each with `name`, `source`, `description`, `category`). `$schema` points at `https://anthropic.com/claude-code/marketplace.schema.json`.
- `plugins/lz-tdd/.claude-plugin/plugin.json` - Plugin manifest. `name: lz-tdd`, `version: 0.0.2` (semver, single source of truth -- deliberately NOT duplicated in the marketplace entry), `author`, `homepage`, `repository`, `license: MIT`, `keywords[]`.

**Environment:**
- No `.env` / `.env.*` files present. The plugin requires no environment variables or secrets.

**Repo hygiene / tooling config:**
- `.gitignore` - Excludes `node_modules/`, build output, `.oracle/`, `.gsd-opengsd/`, `.continue-here.md`, and (critically) the bulky per-run eval byproducts under `.claude/skills/*-workspace/**/` while keeping the tracked eval RECORD.
- `.worktreeinclude` - Copies the gitignored `.oracle/` clean-room source excerpts into new Claude Code worktrees.

## Platform Requirements

**Development:**
- Windows 11 arm64, PowerShell Core + Git Bash (per project constraints); ASCII-only output.
- Node.js v24.x for the eval/checker harness.
- Authoring toolchain: `skill-creator` and `plugin-dev` Claude Code plugins; `claude plugin validate .`.

**Production / Distribution:**
- GitHub-hosted marketplace (public repo `LayZeeDK/lz-engineering-claude-plugins`). Users install with `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` then `/plugin install lz-tdd`.
- No server, database, or hosting runtime -- distribution is git-based and the artifact is static Markdown.
- No CI pipeline (`.github/` absent); validation and checks run locally.

---

*Stack analysis: 2026-07-17*
