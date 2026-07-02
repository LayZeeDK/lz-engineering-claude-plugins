---
phase: 01-marketplace-plugin-scaffold
plan: 01
subsystem: infra
tags: [claude-code-plugin, marketplace, plugin-manifest, agent-skill, gitignore, json]

# Dependency graph
requires: []
provides:
  - "Valid Claude Code marketplace catalog (.claude-plugin/marketplace.json) named lz-engineering-claude-plugins"
  - "lz-tdd plugin manifest (plugins/lz-tdd/.claude-plugin/plugin.json) at version 0.0.1, MIT license"
  - "Placeholder lz-tpp skill (plugins/lz-tdd/skills/lz-tpp/SKILL.md) with valid frontmatter, invocable as /lz-tdd:lz-tpp"
  - "Repo-hygiene .gitignore (Node/OS noise) keeping .planning/ tracked"
  - "Additive-by-design layout: second skill/plugin needs new directories only, zero edits to existing manifests"
affects: [Phase 2 TPP source distillation (references/ under lz-tpp), Phase 3 skill authoring (SKILL.md body + description), Phase 4 distribution (README, LICENSE)]

# Tech tracking
tech-stack:
  added: [Claude Code plugin/marketplace file format, claude CLI plugin validate gate (2.1.198)]
  patterns: [three-level manifest hierarchy, relative ./ source string, skills auto-discovery (no path fields), version declared only in plugin.json]

key-files:
  created:
    - .claude-plugin/marketplace.json
    - plugins/lz-tdd/.claude-plugin/plugin.json
    - plugins/lz-tdd/skills/lz-tpp/SKILL.md
    - .gitignore
  modified: []

key-decisions:
  - "version 0.0.1 declared only in plugin.json, never in the marketplace entry (avoids version-masking trap; D-04/MKT-05)"
  - "skills auto-discovery: plugin.json carries no skills/commands/agents/hooks/mcpServers path fields (D-02/MKT-04)"
  - "Included optional top-level marketplace description + owner.email (public gmail); empirically confirmed --strict passes clean with them"
  - "Used claude plugin validate . --strict clean as the MKT-03 secondary-review path (plugin-dev plugin-validator agent not spawnable from this executor context)"

patterns-established:
  - "Three-level manifest hierarchy: root marketplace.json -> plugins/<name>/.claude-plugin/plugin.json -> plugins/<name>/skills/<skill>/SKILL.md"
  - "Relative ./ source strings (forward slashes, never ../ or absolute) wire the marketplace to co-located plugins"
  - "Plural committed name lz-engineering-claude-plugins throughout, even though the local working dir is singular"

requirements-completed: [MKT-01, MKT-02, MKT-03, MKT-04, MKT-05, DIST-04]

# Metrics
duration: 5min
completed: 2026-07-02
---

# Phase 1 Plan 01: Marketplace & Plugin Scaffold Summary

**Installable, validating three-level Claude Code marketplace hierarchy (lz-engineering-claude-plugins -> lz-tdd -> placeholder lz-tpp skill) plus a Node/OS .gitignore, passing `claude plugin validate .` clean in both plain and --strict modes.**

## Performance

- **Duration:** 5 min
- **Started:** 2026-07-02T06:07:17Z
- **Completed:** 2026-07-02T06:12:04Z
- **Tasks:** 3 (2 build tasks + 1 validation gate)
- **Files created:** 4

## Accomplishments

- Marketplace catalog `.claude-plugin/marketplace.json`: name `lz-engineering-claude-plugins` (plural), Anthropic `$schema`, owner (public gmail), one `plugins[]` entry sourcing `./plugins/lz-tdd`, no `version` field.
- Plugin manifest `plugins/lz-tdd/.claude-plugin/plugin.json`: name `lz-tdd`, `version 0.0.1`, MIT license field, public-gmail author, keywords, `homepage`+`repository`, and NO component path fields (relies on skills auto-discovery).
- Placeholder skill `plugins/lz-tdd/skills/lz-tpp/SKILL.md`: YAML frontmatter `name: lz-tpp` (matches dir -> `/lz-tdd:lz-tpp`) + a deliberately non-triggering stub `description` + stub body; no `references/` yet.
- Repo-hygiene `.gitignore`: Node + OS baseline; does NOT ignore `.planning/`.
- Full validation gate passed clean and the local marketplace add/list/remove loop resolved `lz-tdd` via its `./plugins/lz-tdd` source.

## Task Commits

Each build task was committed atomically:

1. **Task 1: Create the lz-tdd plugin subtree (plugin.json + placeholder SKILL.md)** - `1c7e7ef` (feat)
2. **Task 2: Create the root marketplace manifest and the .gitignore hygiene file** - `7641716` (feat)
3. **Task 3: Validate the full scaffold (CLI gate + local install loop + hygiene)** - no commit (pure validation gate; no file changes required, no fixes needed)

**Plan metadata:** committed separately (docs: complete plan)

## Files Created/Modified

- `.claude-plugin/marketplace.json` - Marketplace catalog; lists the lz-tdd plugin via relative `./plugins/lz-tdd` source; no version field.
- `plugins/lz-tdd/.claude-plugin/plugin.json` - lz-tdd plugin manifest; version 0.0.1, MIT license, public-gmail author, keywords; no component path fields.
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` - Placeholder lz-tpp skill; valid frontmatter (name + non-triggering stub description) + stub body.
- `.gitignore` - Node/OS ignore rules; `.planning/` intentionally left tracked.

## Validation Output (observed)

- **`claude plugin validate .`** -> `Validating marketplace manifest: ...\marketplace.json` then `Validation passed`, exit 0.
- **`claude plugin validate . --strict`** -> `Validation passed`, exit 0. No errors AND no warnings. Notably it did NOT flag the placeholder skill's short/non-triggering description (D-09 is safe under --strict).
- **Assumption A1 (resolved empirically):** With the optional top-level marketplace `description` present, `--strict` passes clean. A1 predicted `--strict` errors on a MISSING top-level description; the branch actually exercised (description PRESENT) is clean, so the recommended top-level description is confirmed sufficient. The "too-generic short description" concern (Open Question 1) did not materialize.
- **Local marketplace loop (MKT-01 LOCAL proxy):**
  - `claude plugin marketplace add ./` -> `Successfully added marketplace: lz-engineering-claude-plugins (declared in user settings)`, exit 0.
  - `claude plugin marketplace list` -> shows `lz-engineering-claude-plugins` (Source: Directory, local path).
  - `claude plugin list --available --json` -> surfaces `{"pluginId": "lz-tdd@lz-engineering-claude-plugins", "name": "lz-tdd", "marketplaceName": "lz-engineering-claude-plugins", "source": "./plugins/lz-tdd"}`, proving lz-tdd resolves via its `./plugins/lz-tdd` source.
  - `claude plugin marketplace remove lz-engineering-claude-plugins` -> `Successfully removed marketplace`, exit 0; confirmed absent from `marketplace list` afterward (assumption A2 confirmed -- no environment pollution).
- **Secondary structural review (MKT-03):** Used the `claude plugin validate . --strict` clean result as the sufficient minimum fallback (per RESEARCH "Environment Availability"). The plugin-dev `plugin-validator` agent is a subagent and is not directly spawnable from this executor's tool context; the `--strict` clean gate is the recorded review path.
- **Version-mask assertion (MKT-05):** `version` present in `plugin.json` only (`"version": "0.0.1"`), absent from `marketplace.json`.
- **Hygiene:** email allowlist over all committed manifests returns only `larsbrinknielsen@gmail.com` (no work email anywhere); no singular working-dir name leaked; all four files ASCII-only.

## Deferred (not claimed here)

- **Remote name resolution (D-13):** `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` is DEFERRED to ship-time. The GitHub repo + physical folder rename do not exist yet; only the LOCAL path-based proxy was exercised and passed. Remote resolution is NOT claimed as passing.

## Decisions Made

- Included the optional top-level marketplace `description` and `owner.email` (both RECOMMENDED-OPTIONAL in RESEARCH, not contradicting any locked decision) -- empirically confirmed they keep `--strict` clean.
- Recorded `--strict` clean as the MKT-03 secondary-review path because the plugin-dev `plugin-validator` agent cannot be spawned from this executor tool context (explicit RESEARCH-sanctioned fallback).

## Deviations from Plan

### Command-form corrections (verification procedure, no file changes)

**1. [Rule 3 - Blocking] Marketplace add source form: `.` -> `./`**
- **Found during:** Task 3 (local install loop)
- **Issue:** `claude plugin marketplace add .` (as literally written in the plan) was rejected: "Invalid marketplace source format. Try: owner/repo, https://..., or ./path" (exit 1).
- **Fix:** Used `claude plugin marketplace add ./` (the CLI's accepted `./path` form). Succeeded, exit 0.
- **Files modified:** none (CLI invocation adjustment only).
- **Verification:** Marketplace added and listed successfully.

**2. [Rule 3 - Blocking] Surfacing lz-tdd via `plugin list --available`**
- **Found during:** Task 3 (local install loop)
- **Issue:** Plain `claude plugin list` shows only INSTALLED plugins; adding a marketplace does not auto-install its plugins, so `lz-tdd` did not appear there.
- **Fix:** Used `claude plugin list --available --json`, which includes available marketplace plugins and surfaced `lz-tdd@lz-engineering-claude-plugins` with source `./plugins/lz-tdd`. This proves resolution without a destructive full install.
- **Files modified:** none (verification-method adjustment only).
- **Verification:** JSON output includes the lz-tdd entry with the expected marketplaceName and source.

---

**Total deviations:** 2 command-form corrections (both Rule 3 blocking, verification-procedure only; no committed file was changed).
**Impact on plan:** None on delivered artifacts. Both adjustments were CLI-invocation refinements to satisfy the same acceptance signals; the four files match the locked specs verbatim.

## Issues Encountered

- The `claude plugin details` command (attempted as an extra skill-auto-discovery confirmation) only inspects installed plugins and rejected `--plugin-dir`. Not pursued further: `claude plugin validate .` already validates SKILL.md frontmatter during its descent, and `plugin list --available --json` already confirmed source resolution -- so skill discovery is covered without it.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- The `plugins/lz-tdd/skills/lz-tpp/` directory exists and is ready to hold `references/` content in Phase 2 (TPP source distillation).
- The `SKILL.md` placeholder is ready for its dual-mode coach + reference authoring in Phase 3 (body + trigger-tuned description).
- Distribution artifacts (README.md, LICENSE file) remain intentionally deferred to Phase 4.
- Ship-time blocker unchanged: the physical folder + GitHub repo rename to the plural `lz-engineering-claude-plugins` and first push happen outside an active session; all committed files already use the plural name so the rename is purely mechanical.

## Self-Check: PASSED

- All 4 scaffold files + SUMMARY.md exist on disk.
- Both task commits (1c7e7ef, 7641716) present in git history.

---
*Phase: 01-marketplace-plugin-scaffold*
*Completed: 2026-07-02*
