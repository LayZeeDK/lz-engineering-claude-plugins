# Phase 1: Marketplace & Plugin Scaffold - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md -- this log preserves the alternatives considered.

**Date:** 2026-07-02
**Phase:** 1-Marketplace & Plugin Scaffold
**Mode:** `--auto --analyze --chain` (autonomous single-pass; recommended option auto-selected per gray area; trade-off tables logged)
**Areas discussed:** Manifest structure, Versioning, marketplace.json content, plugin.json content, Placeholder skill, Repo hygiene & naming, Phase-1 scope boundary

**Trap-quadrant check (auto-mode gate):** Every gray area was rated on IMPACT x CONFIDENCE.
All high-impact decisions (manifest structure, versioning, naming) are HIGH-confidence --
backed by `ARCHITECTURE.md`, the official Anthropic marketplace, the analogous `lz-advisor`
repo, and explicit roadmap success criteria. All lower-confidence items (`$schema` URL,
placeholder depth) are LOW-impact and trivially reversible. No item landed in the
HIGH-impact + NOT-HIGH-confidence trap quadrant, so autonomous auto-locking was safe and no
user escalation was warranted.

---

## Manifest structure & extensibility

| Option | Description | Selected |
|--------|-------------|----------|
| `plugins/<name>/` container from day one | Additive growth; matches official + lz-advisor repos; skills/ at plugin root | X |
| Flatten single plugin to repo root | Fewer dirs for one plugin, but conflates the two `.claude-plugin/` manifests and forces a restructure when plugin #2 is added (anti-pattern 1) | |

**Selection:** `plugins/lz-tdd/` container; component dirs at plugin root; auto-discovery (no path fields).
**Notes:** Driven by ARCHITECTURE.md + MKT-04 (extensibility) + anti-patterns 1-2.

---

## Versioning

| Option | Description | Selected |
|--------|-------------|----------|
| `version` in plugin.json only | Single source of truth; avoids version-masking (MKT-05) | X |
| `version` in both plugin.json and marketplace entry | Visible in both, but plugin.json silently wins and the marketplace value is masked; validator warns | |
| Omit version everywhere (commit-SHA versioning) | Every push = update, but no human-readable semver for a public semver-expecting plugin | |

**Selection:** `version: "0.0.1"` in `plugin.json` only; omitted from the marketplace entry.
**Notes:** Explicit success criterion (MKT-05). Full X.Y.Z semver.

---

## marketplace.json content

| Option | Description | Selected |
|--------|-------------|----------|
| `$schema` = Anthropic URL | Matches the official Anthropic marketplace (highest source authority); documentary only, does not resolve for editor validation | X |
| `$schema` = SchemaStore URL | Enables real editor autocomplete/validation; not what the official marketplace uses | |
| Omit `$schema` | Nothing to get wrong; no editor assistance | |

**Selection:** Anthropic `$schema` URL; `name: lz-engineering-claude-plugins`; `owner.name`; single plugin entry with name+source+description+category, no version.
**Notes:** `claude plugin validate` uses its own internal schema regardless of `$schema`. SchemaStore recorded as the fallback if editor validation is later wanted.

---

## plugin.json content

| Option | Description | Selected |
|--------|-------------|----------|
| Full MKT-02 metadata set | name/version/description/author(public gmail)/license:MIT/keywords + repository+homepage at plural GitHub URL | X |
| Minimal (name only) | Only `name` is strictly required, but MKT-02 requires the fuller metadata for a public plugin | |

**Selection:** Full MKT-02 field set; strict JSON; public gmail contact only.
**Notes:** `larsbrinknielsen@gmail.com` only -- work email never appears in this public repo.

---

## Placeholder skill

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal valid placeholder | frontmatter `name: lz-tpp` + short non-triggering description + stub body; defaults kept; no references/ yet | X |
| Fuller skeleton | Pre-stub sections/frontmatter Phase 3 would fill -- premature; risks half-baked auto-triggering during dev | |

**Selection:** Minimal valid placeholder; frontmatter defaults; description clearly a stub (not trigger-tuned until Phase 3); no `version` field.
**Notes:** Satisfies success criterion 5 ("frontmatter present") without shipping half-authored coach behavior.

---

## Repo hygiene & naming

| Option | Description | Selected |
|--------|-------------|----------|
| `.gitignore` (Node + OS) + plural name in all committed files | DIST-04; aligns four identifiers; physical rename done outside session | X |
| Defer naming reconciliation | Would risk pitfall 9 (four-identifier mismatch breaking install) | |

**Selection:** `.gitignore` for Node/OS noise; `.planning/` stays tracked; plural `lz-engineering-claude-plugins` everywhere; rename/push outside session.
**Notes:** Pitfalls 8 and 9; STATE.md blocker restated.

---

## Phase-1 scope boundary

| Option | Description | Selected |
|--------|-------------|----------|
| license field now; LICENSE file + README to Phase 4 | Follows roadmap traceability (DIST-01/02 in Phase 4); no commands/agents/hooks/MCP; no package.json | X |
| Pull LICENSE/README forward into Phase 1 | ARCHITECTURE build order lists them in the skeleton, but roadmap maps them to Phase 4 | |

**Selection:** `license: "MIT"` field in plugin.json only; LICENSE file + README content deferred to Phase 4; no extra component dirs; no build/lint tooling.
**Notes:** Verification caveat recorded (D-13): remote `/plugin marketplace add LayZeeDK/...` resolution is confirmable only after rename+push; Phase 1 validates via `claude plugin validate .` + local path add.

---

## Claude's Discretion

- Exact `keywords` array in `plugin.json`.
- Exact `.gitignore` entries beyond the Node/OS baseline.
- Exact placeholder `description` wording (kept non-triggering).
- `repository` only vs `repository` + `homepage` in `plugin.json`.
- Optional one-line stub `README.md` for GitHub presentability (full README is Phase 4).

## Deferred Ideas

- Physical folder + GitHub repo rename to plural + first push -- ship-time, outside session.
- LICENSE file + README.md content -- Phase 4 (DIST-01, DIST-02).
- Second plugin / second skill under `lz-tdd` -- NEXT-01 / NEXT-02 (pure additions).
- `package.json` + Prettier/ESLint tooling -- add when there is JS to lint / formatting to enforce.
- SchemaStore `$schema` swap -- if live editor autocomplete/validation becomes desirable.
