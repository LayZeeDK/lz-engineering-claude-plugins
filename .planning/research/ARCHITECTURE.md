# Architecture Research

**Domain:** Claude Code plugin marketplace repository (single repo hosting its own plugin, which ships one agent skill)
**Researched:** 2026-07-02
**Confidence:** HIGH

Verified against three authoritative sources: (1) local plugin-dev skills `plugin-structure/SKILL.md`, `skill-development/SKILL.md`, and `plugin-structure/references/manifest-reference.md`; (2) the official Anthropic `claude-plugins-official/.claude-plugin/marketplace.json`; (3) the maintainer's own directly-analogous `lz-advisor-claude-plugins` repo (a marketplace whose `plugins/lz-advisor/.claude-plugin/plugin.json` sits under a `plugins/<name>/` container and is referenced by `"source": "./plugins/lz-advisor"`).

## Standard Architecture

### System Overview

A marketplace repo is a three-level manifest hierarchy. The repo root doubles as the marketplace root; each plugin is a self-contained subtree; each skill is a self-contained subtree inside its plugin. Higher levels only *reference* lower levels -- they never duplicate their contents.

```
+---------------------------------------------------------------+
|  MARKETPLACE  (repo root)                                     |
|  .claude-plugin/marketplace.json                              |
|    - name: "lz-engineering-claude-plugins"                    |
|    - owner: { name }                                          |
|    - plugins[]: entry per plugin, each with a "source" ref    |
|         |                                                     |
|         | source: "./plugins/lz-tdd"   (relative in-repo ref) |
|         v                                                     |
+---------------------------------------------------------------+
|  PLUGIN  (plugins/lz-tdd/)                                    |
|  .claude-plugin/plugin.json                                   |
|    - name: "lz-tdd"  (drives the /lz-tdd: namespace)          |
|    - version, description, author, repository, license, keywords
|  component dirs at PLUGIN ROOT (auto-discovered):             |
|    commands/  agents/  skills/  hooks/   (only what is used)  |
|         |                                                     |
|         | skills/ scanned for subdirs containing SKILL.md     |
|         v                                                     |
+---------------------------------------------------------------+
|  SKILL  (plugins/lz-tdd/skills/lz-tpp/)                       |
|  SKILL.md  (required: YAML frontmatter name+description+body) |
|  references/   assets/   scripts/   examples/  (optional)     |
|    - references/transformations.md  (loaded on demand)        |
+---------------------------------------------------------------+
```

The two `.claude-plugin/` directories are distinct and never overlap: the one at repo root holds `marketplace.json`; the one at `plugins/lz-tdd/` holds `plugin.json`. This separation is the load-bearing boundary that lets a single repo be both the marketplace and a plugin host.

### Component Responsibilities

| Component | Owns / Responsibility | What it must NOT do |
|-----------|-----------------------|---------------------|
| `.claude-plugin/marketplace.json` (repo root) | Marketplace identity (`name`, `owner`), and the `plugins[]` catalog. Each entry names a plugin and points to its location via `source`. This is the only file the `/plugin marketplace add` command reads first. | Does not contain plugin behavior, skills, or component config. Does not duplicate plugin.json fields (though it may echo `description`/`category` for listing). |
| `plugins/lz-tdd/.claude-plugin/plugin.json` | Plugin identity (`name` -> namespace), version, and optional custom component paths. Declares metadata for install and marketplace display. | Does not list other plugins. Does not hold component files -- those live at the plugin root, never inside `.claude-plugin/`. |
| `plugins/lz-tdd/skills/lz-tpp/SKILL.md` | The skill: frontmatter `name`+`description` (always-loaded trigger metadata) and the lean instruction body (loaded when triggered). | Does not carry the full reference corpus -- bulky material goes to `references/` for progressive disclosure. |
| `plugins/lz-tdd/skills/lz-tpp/references/` | On-demand reference material (the full TPP transformation catalog). Loaded only when the body points Claude to it. | Not always-loaded; must not be required just to trigger the skill. |
| Repo hygiene (`README.md`, `LICENSE`, `.gitignore`) | Human-facing docs, license, and ignore rules for the whole public repo. | Not read by the plugin runtime; purely distribution/hygiene. |

### `source` Reference Forms (verified from real marketplace.json files)

The `plugins[].source` field controls how the marketplace locates each plugin. Confirmed variants:

| Form | Example | Use for |
|------|---------|---------|
| Relative in-repo string | `"source": "./plugins/lz-tdd"` | Plugin that lives in the SAME repo as the marketplace. **This is the form for this project.** |
| `github` object | `{ "source": "github", "repo": "owner/repo" }` | Plugin in a separate GitHub repo (whole repo is the plugin). |
| `url` object | `{ "source": "url", "url": "https://.../x.git", "sha": "..." }` | Plugin in an external git repo pinned by sha. |
| `git-subdir` object | `{ "source": "git-subdir", "url": "...", "path": "plugins/x", "ref": "main", "sha": "..." }` | Plugin in a subdir of an external repo. |

Answer to the core question: **yes, a single repo can host both the marketplace manifest and the plugin(s) it lists** -- confirmed by both the official Anthropic marketplace (`"source": "./plugins/agent-sdk-dev"`) and the maintainer's own `lz-advisor` marketplace (`"source": "./plugins/lz-advisor"`). The relative-path form is exactly designed for this.

## Recommended Project Structure

Concrete tree for THIS repo (v1: one marketplace, one plugin `lz-tdd`, one skill `lz-tpp`):

```
lz-engineering-claude-plugins/            (repo root == marketplace root)
|-- .claude-plugin/
|   '-- marketplace.json                  MARKETPLACE manifest; lists lz-tdd
|-- plugins/
|   '-- lz-tdd/                           PLUGIN root (source: "./plugins/lz-tdd")
|       |-- .claude-plugin/
|       |   '-- plugin.json               PLUGIN manifest (name: "lz-tdd")
|       |-- skills/
|       |   '-- lz-tpp/                    SKILL dir (namespace: /lz-tdd:lz-tpp)
|       |       |-- SKILL.md               required: frontmatter + lean body
|       |       '-- references/
|       |           '-- transformations.md full TPP priority list (on demand)
|       '-- README.md                      optional per-plugin readme
|-- research/                             optional: source-of-truth material
|   |-- clean-coder-tpp.md                  (2 blog posts distilled)
|   '-- ndc-2011-transcript.md              (talk transcript)
|-- README.md                             repo/marketplace readme + install cmd
|-- LICENSE                               MIT, covers the whole repo
'-- .gitignore
```

Notes on this layout:

- **`plugins/<name>/` container from day one.** Even with a single plugin, do NOT flatten the plugin to the repo root. Keeping `plugins/lz-tdd/` separate from the repo-root `.claude-plugin/` is what makes adding a second plugin a pure addition (no move/restructure). The maintainer's `lz-advisor` repo follows exactly this.
- **Component dirs live at the plugin root** (`plugins/lz-tdd/skills/`, not `plugins/lz-tdd/.claude-plugin/skills/`). Auto-discovery only scans the plugin root. This is an explicit rule in `plugin-structure/SKILL.md`.
- **Skill directory name == intended skill namespace segment.** Directory `lz-tpp/` + plugin.json `name: "lz-tdd"` produce the `/lz-tdd:lz-tpp` reference. Keep the SKILL.md frontmatter `name` aligned (`lz-tpp`) to avoid confusion.
- **The transformation catalog belongs in `references/`, not in SKILL.md.** It is the on-demand tier of progressive disclosure. Short, illustrative TypeScript examples that are core to the coaching behavior can stay inline in SKILL.md; the exhaustive ordered list loads only when needed.
- **`research/` is optional and NOT part of the shipped skill context.** The analog repo keeps a `research/` dir at repo root for provenance. Grounding source material (the 2 Clean Code posts + NDC transcript) can live there; the distilled, shippable artifact is `references/transformations.md`.

### License placement

Put a single `LICENSE` (MIT) at the repo root -- it covers the whole public repo, which is the hygiene requirement. Additionally set `"license": "MIT"` in `plugin.json` (machine-readable, used for marketplace display). A per-plugin `LICENSE` file (as the analog repo has at `plugins/lz-advisor/LICENSE`) is optional and only worth adding if a plugin might be consumed independently of this repo. For v1, root LICENSE + plugin.json license field is sufficient.

### `${CLAUDE_PLUGIN_ROOT}` usage

For v1 this is effectively **not needed**. `${CLAUDE_PLUGIN_ROOT}` is required for paths inside executable manifests -- hook commands, MCP server args, and scripts -- because the plugin's install location is unknown. v1 ships no hooks, MCP servers, or scripts. A skill's own `references/` files are addressed relative to the skill directory (the SKILL.md body simply points to `references/transformations.md` and Claude loads it). Reserve `${CLAUDE_PLUGIN_ROOT}` for the future case where a skill gains a `scripts/` helper that a hook or command must invoke by absolute path -- at which point use `${CLAUDE_PLUGIN_ROOT}/skills/lz-tpp/scripts/<tool>` rather than any relative or hardcoded path.

## Architectural Patterns

### Pattern 1: Repo-as-marketplace with co-located plugins

**What:** One git repo is simultaneously the marketplace (root `.claude-plugin/marketplace.json`) and the host of its plugins (`plugins/<name>/`), wired together with relative `source` strings.
**When to use:** A maintainer owns both the catalog and the plugins (this project's exact situation).
**Trade-offs:** Simplest possible distribution (one `git clone`, one `/plugin marketplace add`); no cross-repo version pinning. If a plugin later needs an independent release cadence, migrate its entry to a `git-subdir`/`url` source pointing at its own repo -- the marketplace entry changes, the plugin subtree can move out, and consumers are unaffected.

**Example (`marketplace.json`):**
```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "lz-engineering-claude-plugins",
  "owner": { "name": "Lars Gyrup Brink Nielsen" },
  "plugins": [
    {
      "name": "lz-tdd",
      "source": "./plugins/lz-tdd",
      "description": "Test-driven development skills for Claude Code",
      "category": "development"
    }
  ]
}
```

### Pattern 2: Progressive disclosure (three loading tiers)

**What:** Skill content is split by how often it is needed -- frontmatter metadata (always in context), SKILL.md body (loaded on trigger), `references/` (loaded on demand).
**When to use:** Every skill; mandatory for the TPP catalog which is bulky.
**Trade-offs:** Keeps context lean and triggering accurate; costs a small amount of upfront design deciding what is "core" vs "reference." Rule of thumb from `skill-development/SKILL.md`: SKILL.md body 1,500-2,000 words (hard cap ~5k); move detailed catalogs to `references/`.

**Example (SKILL.md body pointer):**
```markdown
## Transformation priority reference

For the complete ordered transformation list with TypeScript examples,
consult `references/transformations.md`.
```

### Pattern 3: Auto-discovery over explicit configuration

**What:** Claude Code discovers `skills/*/SKILL.md` automatically; the plugin.json needs no `skills` field unless using a non-default location.
**When to use:** Standard layouts (this project). Keep `plugin.json` minimal -- `name` is the only required field.
**Trade-offs:** Less to maintain, fewer paths to get wrong. Custom component-path fields exist but *supplement* (never replace) the defaults, so adding them is rarely worth the extra surface area.

## Data Flow

Instead of a runtime request cycle, the meaningful flow is install -> discovery -> activation, and it maps directly onto the three manifest levels.

### Install and discovery flow

```
User: /plugin marketplace add LayZeeDK/lz-engineering-claude-plugins
   -> Claude Code fetches repo, reads .claude-plugin/marketplace.json
   -> enumerates plugins[]  (lz-tdd -> "./plugins/lz-tdd")

User: /plugin install lz-tdd@lz-engineering-claude-plugins
   -> reads plugins/lz-tdd/.claude-plugin/plugin.json  (identity, version)
   -> scans plugins/lz-tdd/skills/  for subdirs containing SKILL.md
   -> registers lz-tpp; loads its name+description into context (always-on)
```

### Skill activation flow (during a TDD session)

```
Session context mentions TDD / transformation / TPP
   -> description match -> SKILL.md body loads into context
   -> Claude coaches next transformation from the body
   -> needs the exhaustive ordered list
        -> reads references/transformations.md on demand
   -> (reference behavior) user asks to explain the premise
        -> same reference material serves the explanation
```

### Key data flows

1. **Reference-by-path, not by-copy:** marketplace.json -> `source` -> plugin dir -> plugin.json -> `skills/` scan -> SKILL.md -> `references/`. Every level points down; nothing is duplicated upward.
2. **Namespace derivation:** plugin.json `name` ("lz-tdd") + skill dir/frontmatter name ("lz-tpp") = `/lz-tdd:lz-tpp`. Renaming either segment changes the public reference.

## Build Order

Ordered by hard dependencies (each step's artifact is required by the next to install/validate cleanly):

1. **Repo skeleton + hygiene.** `git init`; create `README.md` (stub), `LICENSE` (MIT), `.gitignore`. Rationale: makes the repo a publishable, license-clean baseline; no runtime dependency but should exist before first push.
2. **Marketplace manifest.** `.claude-plugin/marketplace.json` with `name`, `owner`, and a `plugins[]` entry whose `source` is `./plugins/lz-tdd`. Rationale: it is the entry point `/plugin marketplace add` reads; but its plugin entry does not resolve until step 3 exists.
3. **Plugin manifest.** `plugins/lz-tdd/.claude-plugin/plugin.json` with `name: "lz-tdd"` (+ version, description, author, repository, license, keywords). Rationale: the `source` from step 2 must point at a directory containing this file for the plugin to install/validate. Must exist before skills are discoverable.
4. **Skill scaffold.** `plugins/lz-tdd/skills/lz-tpp/SKILL.md` with frontmatter (`name: lz-tpp`, trigger-tuned `description`) and a lean body. Rationale: auto-discovery under `skills/` requires this file to register the skill.
5. **Bundled reference content.** `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` (the full ordered TPP list + TS examples). Rationale: SKILL.md's on-demand pointers are only meaningful once this exists.
6. **Docs finalization.** Fill `README.md` with the exact install command (`/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins`). Rationale: the command string depends on the final GitHub `owner/repo`, which is fixed only at push time.
7. **Validate.** Run plugin-dev's `plugin-validator` agent on the plugin and `skill-reviewer` on the skill; confirm auto-discovery, frontmatter, and manifest paths.

### What must exist before what

| Artifact | Hard prerequisite | Why |
|----------|-------------------|-----|
| marketplace.json plugin entry resolves | `plugins/lz-tdd/.claude-plugin/plugin.json` | `source` must point at a real plugin dir |
| Skill is discovered | `plugin.json` + `skills/lz-tpp/SKILL.md` | discovery scans plugin root's `skills/` |
| Skill references load | `SKILL.md` body pointer + `references/*.md` | on-demand tier is addressed from the body |
| README install command is correct | final GitHub `owner/repo` | command embeds the exact repo path |

## Extensibility

The `plugins/<name>/` + `skills/<name>/` layout was chosen precisely so growth is *additive*, never a restructure.

### Add a second skill under `lz-tdd` (e.g., test naming, triangulation)

```
plugins/lz-tdd/skills/
|-- lz-tpp/
|   '-- SKILL.md
'-- lz-triangulation/          <-- new: just add the directory
    |-- SKILL.md
    '-- references/
```

- No manifest edits required -- auto-discovery scans `skills/` and picks up the new `SKILL.md`.
- New namespace `/lz-tdd:lz-triangulation` derives automatically.
- If two skills share reference material, either duplicate the small file per skill (simplest) or, only if it grows large, promote a shared `references/` at the plugin root and point both SKILL.md bodies at it.

### Add a second plugin (e.g., `lz-refactoring`)

```
plugins/
|-- lz-tdd/
|   '-- ...
'-- lz-refactoring/            <-- new plugin subtree
    |-- .claude-plugin/
    |   '-- plugin.json
    '-- skills/
        '-- <skill>/SKILL.md
```

Then add ONE entry to `marketplace.json`:
```json
{ "name": "lz-refactoring", "source": "./plugins/lz-refactoring", "description": "...", "category": "development" }
```

- Existing `lz-tdd` files are untouched -- pure addition.
- Consider `category`/`keywords` on each entry for discoverability once the catalog has several plugins.
- If a future plugin needs independent releases, switch its `source` to a `git-subdir`/`url` form and move its subtree to a dedicated repo without disturbing the others.

## Growth Considerations

| Scale | Structure adjustments |
|-------|-----------------------|
| 1 plugin, 1 skill (v1) | Flat layout above. `plugin.json` minimal (name + metadata). No hooks/scripts/MCP. |
| 1 plugin, many skills | Multiple dirs under `skills/`; keep each skill self-contained. Promote shared reference only if genuinely reused and large. |
| Many plugins | One `plugins/<name>/` subtree + one `marketplace.json` entry each. Add `category`/`keywords` per entry. Consider a short catalog table in the root README. |
| A plugin needs independent release | Migrate that plugin's `source` from `./plugins/x` to `git-subdir`/`url`; move its subtree out. Marketplace consumers unaffected. |

### Growth priorities

1. **First thing that strains:** SKILL.md bloat as coaching guidance grows. Fix by moving detail into `references/` (progressive disclosure) before the body exceeds ~2k words.
2. **Second:** discoverability of many plugins in one catalog. Fix with `category`, `keywords`, and a README catalog table -- not with directory restructuring.

## Anti-Patterns

### Anti-Pattern 1: Flattening the single plugin to the repo root

**What people do:** Put `skills/`, `plugin.json`, etc. directly at the repo root alongside `marketplace.json` because there is only one plugin.
**Why it's wrong:** The repo-root `.claude-plugin/` is the marketplace's, not a plugin's. Co-locating a plugin there conflates the two manifests and forces a disruptive move-everything restructure the moment a second plugin is added.
**Do this instead:** Use `plugins/lz-tdd/` from day one; reference it with `"source": "./plugins/lz-tdd"`.

### Anti-Pattern 2: Nesting component dirs inside `.claude-plugin/`

**What people do:** Create `plugins/lz-tdd/.claude-plugin/skills/...`.
**Why it's wrong:** Auto-discovery only scans the plugin root. Components inside `.claude-plugin/` are invisible; the skill silently never loads.
**Do this instead:** Keep `.claude-plugin/` for `plugin.json` only; put `skills/`, `commands/`, `agents/`, `hooks/` at the plugin root.

### Anti-Pattern 3: Putting the whole transformation catalog in SKILL.md

**What people do:** Inline the entire ordered TPP list + all examples in SKILL.md.
**Why it's wrong:** Bloats always-triggered context, weakens triggering accuracy, and violates progressive disclosure (SKILL.md should be ~1,500-2,000 words).
**Do this instead:** Keep core coaching heuristics + a few TS examples in the body; move the exhaustive ordered catalog to `references/transformations.md` and point to it.

### Anti-Pattern 4: Hardcoded, absolute, or `../` paths in manifests

**What people do:** Reference files with absolute paths, `~/`, or parent-directory hops; or omit the `./` prefix on component paths.
**Why it's wrong:** Install location is unknown and varies by OS/method; such paths break on other machines. Manifest component paths must be relative, start with `./`, and never use `../`.
**Do this instead:** `./`-relative paths in `plugin.json`; `${CLAUDE_PLUGIN_ROOT}/...` in any future hook/MCP/script commands.

### Anti-Pattern 5: Misaligned names between manifest and namespace

**What people do:** Name the plugin dir `lz-tdd` but set `plugin.json` `name` to something else, or name the skill dir differently from its frontmatter `name`.
**Why it's wrong:** The public reference `/lz-tdd:lz-tpp` derives from `plugin.json` `name` + skill name; mismatches make the skill hard to invoke and confuse contributors.
**Do this instead:** Keep dir name, manifest `name`, and intended namespace segment identical at both levels.

## Integration Points

### External / distribution

| Integration | Pattern | Notes |
|-------------|---------|-------|
| Install | `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` then `/plugin install lz-tdd@lz-engineering-claude-plugins` | The `add` argument is the GitHub `owner/repo`; the internal `name` field identifies the marketplace after clone. |
| Authoring tooling | `skill-creator` (build/optimize skill, run evals), `plugin-dev` (scaffold + `plugin-validator`/`skill-reviewer`) | Already installed; use for step 7 validation. |
| Provenance | 2 Clean Code posts + NDC 2011 transcript -> distilled into `references/transformations.md` | Keep raw sources in optional `research/`; ship only the distilled reference. |

### Internal boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| marketplace.json <-> plugin | relative `source` string (`./plugins/lz-tdd`) | one entry per plugin; addition-only growth |
| plugin.json <-> skill | filesystem convention (`skills/*/SKILL.md` auto-scan) | no explicit wiring needed for default layout |
| SKILL.md body <-> references/ | in-body relative pointer, loaded on demand | the progressive-disclosure seam |

## Sources

- `plugin-dev/skills/plugin-structure/SKILL.md` (local, authoritative): directory layout, `.claude-plugin/` manifest location rule, component-at-root rule, auto-discovery, `${CLAUDE_PLUGIN_ROOT}` usage. HIGH.
- `plugin-dev/skills/plugin-structure/references/manifest-reference.md` (local, authoritative): full `plugin.json` field reference, relative-path rules, license/README distribution guidance. HIGH.
- `plugin-dev/skills/skill-development/SKILL.md` (local, authoritative): skill anatomy (`SKILL.md` + `references/`/`assets/`/`scripts/`), progressive disclosure tiers, skill-in-plugin location. HIGH.
- `claude-plugins-official/.claude-plugin/marketplace.json` (official Anthropic): confirms `$schema`, `name`, `owner`, `plugins[]` shape and all `source` forms (`./...`, `github`, `url`, `git-subdir`). HIGH.
- `lz-advisor-claude-plugins` repo (maintainer's own analog): confirms the co-located `plugins/<name>/.claude-plugin/plugin.json` layout, relative `"source": "./plugins/lz-advisor"`, root `README.md`/`LICENSE`/`.gitignore` hygiene, and optional `research/` dir. HIGH.

---
*Architecture research for: Claude Code plugin marketplace repo (lz-engineering-claude-plugins)*
*Researched: 2026-07-02*
