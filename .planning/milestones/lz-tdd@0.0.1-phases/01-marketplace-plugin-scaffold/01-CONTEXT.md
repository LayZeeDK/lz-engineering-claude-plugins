# Phase 1: Marketplace & Plugin Scaffold - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning

<domain>
## Phase Boundary

A valid Claude Code marketplace repo that installs and validates cleanly. It
delivers the three-level manifest hierarchy -- root `.claude-plugin/marketplace.json`,
the `lz-tdd` plugin at `plugins/lz-tdd/.claude-plugin/plugin.json`, and a placeholder
`lz-tpp` skill at `plugins/lz-tdd/skills/lz-tpp/SKILL.md` -- plus a repo-hygiene
skeleton (`.gitignore`). The layout is additive-by-design so a second skill or plugin
is a pure addition. Requirements: MKT-01, MKT-02, MKT-03, MKT-04, MKT-05, DIST-04.

This phase clarifies HOW to scaffold what is already scoped. It does NOT author skill
behavior (Phase 3), distill TPP content (Phase 2), or write README/LICENSE files
(Phase 4).

</domain>

<decisions>
## Implementation Decisions

### Manifest structure & extensibility
- **D-01:** Use the three-level manifest hierarchy exactly as `ARCHITECTURE.md`
  prescribes: root `.claude-plugin/marketplace.json` (marketplace), `plugins/lz-tdd/.claude-plugin/plugin.json`
  (plugin), `plugins/lz-tdd/skills/lz-tpp/SKILL.md` (skill). Adopt the `plugins/<name>/`
  container from day one -- do NOT flatten the single plugin to the repo root
  (anti-pattern 1). This is what makes a second plugin a pure addition (MKT-04).
- **D-02:** Component dirs (`skills/`) live at the PLUGIN root, never inside
  `.claude-plugin/` (anti-pattern 2). Rely on auto-discovery -- `plugin.json`
  needs NO `skills`/`commands`/`agents`/`hooks` path fields.
- **D-03:** The marketplace entry locates the plugin via a relative string
  `"source": "./plugins/lz-tdd"`. Do NOT use `metadata.pluginRoot` for v1 (single
  plugin, the relative path is already clear). Paths are `./`-relative, forward
  slashes, never `../` or absolute (anti-pattern 4).

### Versioning
- **D-04:** Declare `version: "0.0.1"` (full X.Y.Z semver) ONLY in `plugin.json`.
  OMIT `version` from the marketplace entry to avoid the version-masking trap where
  `plugin.json` silently wins and the marketplace value is masked (MKT-05).

### marketplace.json content
- **D-05:** Include `$schema: "https://anthropic.com/claude-code/marketplace.schema.json"`
  to match the official Anthropic marketplace (highest source-authority reference).
  Note: `claude plugin validate` uses its own internal schema regardless of `$schema`;
  the Anthropic URL is documentary and does not resolve for live editor validation.
  SchemaStore's `https://json.schemastore.org/claude-code-marketplace.json` is the
  fallback ONLY if editor autocomplete/validation is later desired.
- **D-06:** `name: "lz-engineering-claude-plugins"` (plural, matches the target GitHub
  repo), `owner: { name: "Lars Gyrup Brink Nielsen" }`. The single plugin entry carries
  `name` + `source` + `description` + `category: "development"`. No `version` in the entry.

### plugin.json content
- **D-07:** Fields per MKT-02: `name: "lz-tdd"` (kebab-case; drives the `/lz-tdd:` namespace),
  `version: "0.0.1"`, `description`, `author` (`name: "Lars Gyrup Brink Nielsen"`,
  `email: "larsbrinknielsen@gmail.com"` -- public gmail only, NEVER the work email),
  `license: "MIT"` (machine-readable field), `keywords`, and `repository`/`homepage`
  pointing at `https://github.com/LayZeeDK/lz-engineering-claude-plugins`. Strict JSON --
  no comments, no trailing commas.

### Placeholder skill
- **D-08:** `plugins/lz-tdd/skills/lz-tpp/SKILL.md` is a MINIMAL valid placeholder for
  this phase: YAML frontmatter with `name: lz-tpp` (must equal the directory name so the
  namespace resolves to `/lz-tdd:lz-tpp`) + a short `description` + a stub body noting it
  is a placeholder to be authored in Phase 3. Keep frontmatter defaults -- do NOT set
  `disable-model-invocation` or `user-invocable`. Do NOT add a `version` field (not a
  valid skill frontmatter field). No `references/` content yet (Phases 2-3).
- **D-09:** The placeholder `description` should read clearly as a stub and NOT be
  tuned to trigger during TDD (the trigger-tuned description is authored in Phase 3,
  tuned empirically in Phase 5). This avoids a half-baked placeholder auto-firing during
  development while still satisfying "frontmatter present" (success criterion 5).

### Repo hygiene & naming
- **D-10:** Add a `.gitignore` covering Node + OS noise (`node_modules/`, build output
  like `dist/`/`build/`, `*.log`, `.DS_Store`, `Thumbs.db`, editor cruft). Keep
  `.planning/` TRACKED -- it already is, and GSD PR branches filter it out separately.
  ASCII-only content, per repo conventions (DIST-04).
- **D-11:** Every committed manifest and doc uses the FINAL plural name
  `lz-engineering-claude-plugins` from the first commit, even though the local working
  directory is the singular `lz-engineering-claude-plugin`. Never reference the singular
  folder name in committed files. Identifier alignment: GitHub repo == marketplace `name`
  == `lz-engineering-claude-plugins`; plugin `name: lz-tdd`; skill dir == frontmatter
  `name` == `lz-tpp` (pitfalls 6, 9).

### Phase-1 scope boundary
- **D-12:** The `license: "MIT"` FIELD in `plugin.json` is in scope (MKT-02), but the
  LICENSE FILE and README content are DEFERRED to Phase 4 (DIST-01, DIST-02) per roadmap
  traceability. No `commands/`, `agents/`, `hooks/`, or `.mcp.json` (out of scope). No
  `package.json` / build / lint tooling in this phase -- the repo is pure JSON + Markdown
  with no build step; `claude plugin validate` is the gate, not npm.
- **D-13 [informational]:** (verification caveat) Success criterion 2 (`/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins`
  resolves) can only be FULLY confirmed after the physical rename + GitHub push, which is a
  ship-time step outside this session. In Phase 1, validate structurally via
  `claude plugin validate .` and a LOCAL `/plugin marketplace add ./` (offline add ->
  install -> list loop). The planner and verifier must not over-claim remote name
  resolution for Phase 1.

### Claude's Discretion
- Exact `keywords` array in `plugin.json` (e.g. `tdd`, `testing`, `transformation-priority-premise`,
  `red-green-refactor`, `clean-code`).
- Exact `.gitignore` entries beyond the Node/OS baseline.
- Exact placeholder `description` wording (kept non-triggering per D-09).
- Whether to include both `repository` and `homepage` in `plugin.json` or just `repository`.
- Whether to add a one-line stub `README.md` for GitHub presentability (the full README
  is Phase 4 -- a stub is optional and low-impact).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Scaffold structure & manifests (PRIMARY)
- `.planning/research/ARCHITECTURE.md` -- prescriptive three-level layout, copy-ready
  `marketplace.json` example, `source` reference forms, build order, extensibility
  patterns (add-a-skill / add-a-plugin), license placement, and the 5 scaffold
  anti-patterns. HIGH confidence; verified against the official Anthropic marketplace
  and the maintainer's own `lz-advisor` repo.
- `.planning/research/STACK.md` -- manifest field reference and min-version notes.
- `CLAUDE.md` (project instructions) "Technology Stack" section -- copy-ready
  `marketplace.json` / `plugin.json` manifests, versioning mechanics (version-masking
  trap), directory layout, and the "What NOT to Use (v1)" table.

### Scaffold pitfalls to avoid
- `.planning/research/PITFALLS.md` -- Pitfall 6 (auto-trigger vs slash-invocation
  namespacing), Pitfall 8 (manifest errors that make the plugin silently fail to load +
  validation gate), Pitfall 9 (repo-rename / four-identifier name-mismatch trap).

### Requirements & success criteria
- `.planning/REQUIREMENTS.md` -- MKT-01, MKT-02, MKT-03, MKT-04, MKT-05, DIST-04 (the
  locked requirements for this phase) and the Out of Scope table.
- `.planning/ROADMAP.md` -- Phase 1 goal and the 5 success criteria.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- The maintainer's own `lz-advisor-claude-plugins` marketplace repo is a directly
  analogous template: same co-located `plugins/<name>/.claude-plugin/plugin.json` layout,
  relative `"source": "./plugins/lz-advisor"`, and root hygiene files. Use it as the
  concrete pattern to mirror (cited as HIGH-confidence source in ARCHITECTURE.md).
- Copy-ready `marketplace.json` and `plugin.json` skeletons already exist in the project
  `CLAUDE.md` "Technology Stack" section -- adapt rather than author from scratch.

### Established Patterns
- Repo-as-marketplace with co-located plugins wired by relative `source` strings.
- Auto-discovery over explicit configuration: `skills/*/SKILL.md` is scanned; no path
  config in `plugin.json`.
- Progressive disclosure: the placeholder `SKILL.md` stays lean now; heavy content lands
  in `references/` in later phases.

### Integration Points
- Validation gate: `claude plugin validate .` (first-party CLI) plus the plugin-dev
  `plugin-validator` agent (structure) and, later, `skill-reviewer` (skill quality).
- Install loop: `/plugin marketplace add <path-or-owner/repo>` -> reads `marketplace.json`
  -> resolves `./plugins/lz-tdd` -> reads `plugin.json` -> scans `skills/` -> registers
  `lz-tpp`.

</code_context>

<specifics>
## Specific Ideas

- Marketplace name is deliberately the plural `lz-engineering-claude-plugins` (matches
  the intended GitHub repo and install command `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins`).
- Install/usage target string documented for Phase 4:
  `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` then
  `/plugin install lz-tdd@lz-engineering-claude-plugins`.

</specifics>

<deferred>
## Deferred Ideas

- **Physical folder + GitHub repo rename to plural + first push** -- ship-time step
  OUTSIDE an active session (renaming the cwd mid-session breaks tooling). Already a
  STATE.md blocker; restated here so it is not lost. Committed files already use the
  plural name so this rename is purely mechanical.
- **LICENSE file + README.md content** -- Phase 4 (DIST-01, DIST-02). Only the
  `license: "MIT"` field in `plugin.json` is in this phase.
- **Second plugin / second skill under `lz-tdd`** -- NEXT-01 / NEXT-02; the layout is
  designed so these are pure additions (no restructuring).
- **`package.json` + Prettier/ESLint tooling** -- add if/when there is JS to lint or
  formatting to enforce; not needed for a JSON + Markdown scaffold.
- **SchemaStore `$schema` swap** -- switch from the Anthropic URL to
  `https://json.schemastore.org/claude-code-marketplace.json` if live editor
  autocomplete/validation becomes desirable.

</deferred>

---

*Phase: 1-Marketplace & Plugin Scaffold*
*Context gathered: 2026-07-02*
