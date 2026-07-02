# Phase 4: Distribution & Hygiene - Context

**Gathered:** 2026-07-02
**Status:** Ready for planning
**Mode:** `--auto` (decisions auto-locked from prior context + requirements; `--analyze` trade-off tables in DISCUSSION-LOG.md; `--chain` auto-advances to plan-phase)

<domain>
## Phase Boundary

Make the repo publicly shippable. It delivers three things and nothing more:
1. A `README.md` documenting install (`/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins`
   then `/plugin install lz-tdd@lz-engineering-claude-plugins`), what the `lz-tpp` skill does,
   and how to invoke it (`/lz-tdd:lz-tpp`) (DIST-01).
2. An MIT `LICENSE` at repo root with the correct public contact `larsbrinknielsen@gmail.com`,
   and the work email appearing nowhere (DIST-02).
3. First-party authoring review: the skill and manifests pass `plugin-dev`'s `plugin-validator`
   and `skill-reviewer` without significant findings, plus `claude plugin validate .`, with all
   committed output ASCII-only (DIST-03).

This phase clarifies HOW to document, license, and review what already exists. It does NOT
author or re-tune skill behavior (Phase 3, DONE), and does NOT build or run skill-creator
trigger/behavior evals or empirically tune the `description` (Phase 5, EVAL-01/02).

</domain>

<decisions>
## Implementation Decisions

### README documentation (DIST-01)
- **D-01:** A single root `README.md` is the primary shippable doc (GitHub landing page +
  install-command target). Section order (Claude's discretion on exact wording):
  title + one-line value prop; "What this is" (marketplace -> `lz-tdd` plugin -> `lz-tpp`
  skill); Install (the two documented commands verbatim); "What `lz-tpp` does" + invocation
  (`/lz-tdd:lz-tpp`) noting it auto-triggers as a coach during red-green-refactor TDD and
  serves an on-demand reference; brief TPP primer (see D-02); License + contact. A per-plugin
  `plugins/lz-tdd/README.md` is OPTIONAL and low value for a single-plugin marketplace; if
  added at all, keep it a short pointer to the root README (never a duplicate) to avoid drift.
- **D-02:** README TPP content is a BRIEF summary plus links to the authoritative sources
  (the two Clean Code posts + the NDC 2011 talk, listed in PROJECT.md Context) and a pointer
  to the bundled `plugins/lz-tdd/skills/lz-tpp/references/transformations.md`. Do NOT
  duplicate or inline the canonical 14-item list, worked examples, or TCO guidance -- the
  skill's `references/` remain the single source of truth (progressive disclosure; drift
  avoidance).

### Licensing & contact (DIST-02)
- **D-03:** Add a standard MIT `LICENSE` file at repo root using the verbatim OSI MIT text,
  with copyright line `Copyright (c) 2026 Lars Gyrup Brink Nielsen` (matches the `plugin.json`
  `author.name`; current year 2026). This is the LICENSE FILE deferred from Phase 1 (Phase-1
  D-12 kept only the machine-readable `license: "MIT"` field in `plugin.json`).
- **D-04:** The public contact is `larsbrinknielsen@gmail.com` in every place it appears
  (README contact line + the existing `plugin.json` `author.email`). The work email MUST
  appear nowhere in the repo, and the literal MUST NEVER be spelled out in any committed
  file (spelling it here is exactly how this file first tripped its own rule). Before the
  phase-completion commit, verify absence with an allowlist guard (the exact non-self-
  tripping needle is documented in `04-RESEARCH.md`) -> expect zero hits on the shippable
  surface. See memory `public-repo-work-email-allowlist`.

### First-party authoring review & findings triage (DIST-03)
- **D-05:** Run three review gates: (1) `claude plugin validate .` -- the first-party CLI,
  a HARD gate that MUST report no errors; (2) `plugin-dev`'s `plugin-validator` agent
  (structure / manifest / security / path traversal); (3) `plugin-dev`'s `skill-reviewer`
  agent (skill quality). Independently verify all committed output is ASCII-only per repo
  convention (arrows `->`, straight quotes, no emojis/box-drawing/em-dashes).
- **D-06:** Findings triage (this is the load-bearing decision of the phase). FIX in Phase 4:
  structural/manifest errors, security/path-traversal issues, anything that breaks install or
  `/lz-tdd:lz-tpp` invocation, ASCII violations, factual inaccuracies in README/LICENSE, and
  clear skill-authoring defects (e.g. malformed frontmatter, broken reference links). DEFER to
  Phase 5 (EVAL-01/02): any finding about `description` triggering effectiveness, over/under-
  triggering, or coaching-accuracy -- these are empirical-tuning concerns explicitly deferred
  by Phase-3 D-10 and the roadmap. "Significant findings" that block the public ship =
  errors + security + broken install/invocation + ASCII violations; subjective/style
  suggestions are recorded and optionally applied, never allowed to pull Phase-5 empirical
  work forward.

### Claude's Discretion
- Exact README section ordering, tagline/value-prop wording, and whether to include a short
  copy-paste usage snippet (no screenshots needed -- backend/CLI-focused).
- Whether to add an optional one-line `plugins/lz-tdd/README.md` pointer (D-01).
- Any README badges/keywords (optional; keep ASCII, keep minimal).
- Exact MIT text whitespace/formatting (use the standard OSI template verbatim).
- Order in which the three review gates run, and whether validator/reviewer run as agents
  or the CLI-only gate suffices for a given check (all three must ultimately be satisfied).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requirements & success criteria (PRIMARY)
- `.planning/REQUIREMENTS.md` -- DIST-01, DIST-02, DIST-03 (Phase 4 locked requirements),
  DIST-04 (`.gitignore`, already complete in Phase 1), and the Out of Scope table.
- `.planning/ROADMAP.md` Phase 4 -- goal ("publicly shippable -- documented, licensed,
  contact-correct, passing first-party authoring review") and the 3 success criteria.

### Project-level constraints & content sources
- `.planning/PROJECT.md` -- Core Value (what the README must convey), the Context section's
  three authoritative TPP sources (2 Clean Code posts + NDC 2011 talk `B93QezwTQpI`) to link
  in the README, the public-contact / work-email hygiene rule, and the remote
  `https://github.com/LayZeeDK/lz-engineering-claude-plugins` (created + pushed; verified per
  STATE.md, so the documented install command resolves).
- `CLAUDE.md` (project) -- ASCII-only committed output, public contact
  `larsbrinknielsen@gmail.com` (never the work email), source-authority precedence, npm
  default. Note: `CLAUDE.md` imports `@AGENTS.md`, which is currently a 0-byte file (see
  Deferred).

### Prior-phase decisions this phase inherits
- `.planning/phases/01-marketplace-plugin-scaffold/01-CONTEXT.md` -- D-12 (LICENSE FILE +
  README content DEFERRED to Phase 4; only the `license: "MIT"` field lives in `plugin.json`),
  and `<specifics>` (the exact documented install/usage command strings for the README).
- `.planning/phases/03-lz-tpp-skill-authoring/03-CONTEXT.md` -- D-10 (scoped `description`
  authored now, empirical trigger/behavior tuning DEFERRED to Phase 5) -- this is the basis
  for D-06's deferral of triggering-effectiveness findings.

### Artifacts being documented / reviewed
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` and `references/` (`transformations.md`,
  `fibonacci-worked-example.md`, `typescript-and-tco.md`) -- what the README describes and
  what `skill-reviewer` audits.
- `plugins/lz-tdd/.claude-plugin/plugin.json` -- `author.email`, `license`, `repository`;
  README/LICENSE must stay consistent with these.
- `.claude-plugin/marketplace.json` -- the marketplace `plugin-validator` inspects; the
  install command in the README targets it.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Documented install/usage strings already exist verbatim in `01-CONTEXT.md` `<specifics>`
  -- lift them into the README rather than re-deriving.
- `plugin.json` already carries `author.email: larsbrinknielsen@gmail.com`, `license: "MIT"`,
  and the `repository`/`homepage` URLs -- the README and LICENSE align to these, no new
  identity values are introduced.
- The maintainer's `lz-advisor-claude-plugins` repo (referenced in Phase 1) is an analogous
  README + MIT LICENSE precedent to mirror for tone/structure.

### Established Patterns
- ASCII-only committed content (arrows `->`, straight quotes; no emojis/box-drawing) -- repo
  convention enforced across all prior phases; the DIST-03 ASCII check formalizes it.
- Progressive disclosure -- the README points at the skill's `references/` rather than
  inlining them (mirrors how `SKILL.md` points at `references/`).
- Validation gate discipline -- `claude plugin validate .` was the Phase-1 gate; Phase 4 adds
  the `plugin-validator` + `skill-reviewer` agents on top.

### Integration Points
- Git remote `origin` -> `https://github.com/LayZeeDK/lz-engineering-claude-plugins.git`
  (wired + pushed + remote-resolution verified per STATE.md), so the README's
  `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` command genuinely resolves.
- This is the last gating phase for the public 0.0.1 ship; Phase 5 (evals) is optional and
  non-blocking and runs after.

</code_context>

<specifics>
## Specific Ideas

- README install block, verbatim:
  `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins`
  then `/plugin install lz-tdd@lz-engineering-claude-plugins`.
- Invocation to document: `/lz-tdd:lz-tpp` (explicit reference mode); plus a note that the
  skill auto-triggers as a coach during red-green-refactor TDD.
- Link (do not inline) the three authoritative TPP sources from PROJECT.md Context, and point
  readers to `references/transformations.md` for the canonical list.
- Work-email allowlist guard is a hard pre-commit check, not a best-effort scan (see
  memory: public-repo-work-email-allowlist).

</specifics>

<deferred>
## Deferred Ideas

- **Empty `AGENTS.md` (0 bytes) imported by `CLAUDE.md` via `@AGENTS.md`** -- a hygiene defect
  discovered during codebase scout. NOT in DIST-01/02/03 scope, so it is NOT folded into the
  locked Phase 4 scope (respects roadmap traceability). Flagged for the user/planner: it is a
  trivial fix (populate with agent-agnostic rules or remove the empty import) if the user
  wants it addressed -- but as a separate hygiene task, not this phase's requirements.
- **Skill-creator trigger + behavior evals and empirical `description` tuning** -> Phase 5
  (EVAL-01/02). Any triggering-effectiveness / coaching-accuracy finding surfaced by
  `skill-reviewer` in Phase 4 is recorded and deferred here, per D-06.
- **npm packaging / additional plugins / additional skills / non-TS example sets**
  -> post-0.0.1 (NEXT-01..04), out of scope.

### Reviewed Todos (not folded)
None -- `todo.match-phase` returned 0 matches.

</deferred>

---

*Phase: 4-Distribution & Hygiene*
*Context gathered: 2026-07-02*
