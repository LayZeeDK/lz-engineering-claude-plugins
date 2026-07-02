---
phase: 01-marketplace-plugin-scaffold
reviewed: 2026-07-02T06:20:21Z
depth: deep
files_reviewed: 4
files_reviewed_list:
  - .claude-plugin/marketplace.json
  - plugins/lz-tdd/.claude-plugin/plugin.json
  - plugins/lz-tdd/skills/lz-tpp/SKILL.md
  - .gitignore
findings:
  critical: 0
  warning: 1
  info: 0
  total: 1
status: issues_found
---

# Phase 1: Code Review Report

**Reviewed:** 2026-07-02T06:20:21Z
**Depth:** deep
**Files Reviewed:** 4
**Status:** issues_found

## Summary

Reviewed the four static scaffold artifacts for the marketplace + plugin skeleton:
the root marketplace catalog, the `lz-tdd` plugin manifest, the placeholder `lz-tpp`
`SKILL.md`, and `.gitignore`. There is no executable code, build, or runtime logic,
so "deep" cross-file analysis reduces to manifest correctness, schema/JSON validity,
public-repo hygiene, and structural resolution.

Adversarial verification performed (all evidence-backed, not assumed):

- Strict JSON parse of both manifests via `JSON.parse` -- both OK, no trailing
  commas, no comments, no duplicate keys, no BOM.
- Byte-level non-ASCII scan of all four files -- zero non-ASCII code points
  (confirms the apostrophe in "Robert C. Martin's" is a straight ASCII `'`, not a
  curly quote; no mojibake risk).
- Line endings consistent (LF, no mixed CRLF).
- Structure resolution: `source: "./plugins/lz-tdd"` resolves to a real directory;
  no `../` or absolute paths (no path-traversal); skill directory `lz-tpp` matches
  frontmatter `name: lz-tpp`; no stray `commands/`, `agents/`, `hooks/`, or
  `.mcp.json`.
- Cross-manifest consistency: `plugins[0].name` (`lz-tdd`) equals plugin.json
  `name` (`lz-tdd`); `version` declared only in `plugin.json` (`0.0.1`, valid
  semver), never in the marketplace entry; SKILL.md has no disallowed `version`
  field and both required frontmatter keys (`name`, `description`) are present.
- Public-repo hygiene: only the public gmail contact appears in both `owner.email`
  and `author.email`; no work email present.
- `.gitignore` does NOT ignore `.planning/` (correct); covers standard Node/OS noise.

The artifacts are correct and internally consistent. The single finding below is a
pre-publish verification item, not a defect in the file contents.

Note on intentional stubs (confirmed in scope guidance, not flagged): the short,
non-triggering `lz-tpp` description is a deliberate Phase 3 placeholder; the absence
of `references/`, `LICENSE`, and `README` is deferred by design; `version: 0.0.1`
(rather than the generic `0.1.0` starting suggestion) is the deliberate first-
milestone version per the project's own requirements.

## Warnings

### WR-01: Declared repository identifiers (plural) may not match the published GitHub repo

**File:** `plugins/lz-tdd/.claude-plugin/plugin.json:9-10` (also `.claude-plugin/marketplace.json:3`)
**Issue:**
Every declared identifier uses the plural name `lz-engineering-claude-plugins`:

- `marketplace.json` `name`: `lz-engineering-claude-plugins`
- `plugin.json` `homepage`: `https://github.com/LayZeeDK/lz-engineering-claude-plugins`
- `plugin.json` `repository`: `https://github.com/LayZeeDK/lz-engineering-claude-plugins`
- The documented install command: `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins`

However, the local repository top-level directory is the SINGULAR
`lz-engineering-claude-plugin` (verified via `git rev-parse --show-toplevel`), and
no git remote is configured yet (`git remote -v` returns nothing), so the eventual
published repo name cannot be confirmed from the working tree. If the GitHub repo is
created under the singular name to match the local folder, the `homepage` and
`repository` links will 404 and the primary documented install path
(`/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins`) will fail for
end users. The reviewed files are themselves consistent (all plural); the risk is a
mismatch between them and the not-yet-created remote.

**Fix:**
Before publishing, ensure the GitHub repository is created with the plural name so
it matches the declared URLs and install command. Concretely:

```bash
# The remote repo name must be the plural form referenced everywhere:
git remote add origin https://github.com/LayZeeDK/lz-engineering-claude-plugins.git
```

If a singular repo name is intended instead, update all four identifiers above to
the singular form to keep the metadata links and install command working. Either
way, reconcile the local folder name and the declared URLs so they agree.

---

_Reviewed: 2026-07-02T06:20:21Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep_
