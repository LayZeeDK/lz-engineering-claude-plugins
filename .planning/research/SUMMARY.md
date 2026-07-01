# Project Research Summary

**Project:** lz-engineering-claude-plugins (marketplace) / lz-tdd (plugin) / lz-tpp (skill, `/lz-tdd:lz-tpp`)
**Domain:** Claude Code plugin marketplace + agent skill authoring (file-format + toolchain, not a runtime app)
**Researched:** 2026-07-02
**Confidence:** HIGH

## Executive Summary

This is not a software application; it is an authoring project. The "product" is a
public git repo that is simultaneously a Claude Code marketplace and the host of one
plugin (`lz-tdd`) that ships one agent skill (`lz-tpp`). Experts build this as a
three-level manifest hierarchy that references downward and never duplicates upward:
root `.claude-plugin/marketplace.json` -> `plugins/lz-tdd/.claude-plugin/plugin.json`
-> `plugins/lz-tdd/skills/lz-tpp/SKILL.md` + `references/`. The stack is JSON manifests
plus a Markdown skill with YAML frontmatter, validated by first-party tooling
(`claude plugin validate`, `plugin-dev`'s validator/reviewer agents) and built/tuned
with `skill-creator`. All packaging research is HIGH confidence, verified against the
official 2026-07-01 docs and real installed manifests (Anthropic's own marketplace and
the maintainer's analog `lz-advisor` repo).

The recommended approach is deliberately narrow: a **skill-only v1** (custom
`commands/` have been merged into skills in the current Claude Code line, so a
plugin-subdirectory skill already yields the `/lz-tdd:lz-tpp` invocation -- no
`commands/`, `agents/`, `hooks/`, or MCP), a **single co-located repo** (relative
`"source": "./plugins/lz-tdd"`), and a **dual-mode skill** that both auto-triggers as
a coach during red-green-refactor TDD and responds to explicit `/lz-tdd:lz-tpp`
invocation as a reference. The skill's non-negotiable core is a correct, cited
transformation priority list plus a concrete coach decision procedure (failing test +
current code -> named next transformation), with progressive disclosure keeping
SKILL.md lean (~1,500-2,000 words) and the full catalog in `references/`.

The two highest risks are both about substance, not packaging. **(a) TPP fidelity:**
the transformation list must be transcribed verbatim from Uncle Bob's primary posts,
framed as a provisional heuristic (the author himself hedges heavily), and kept
distinct from refactorings -- secondary sources have already drifted, and the list has
an authoritative *revision* (see the 12-vs-14 flag below). **(b) Triggering accuracy:**
the requirement is accurate triggering "without over-triggering," which is in direct
tension with skill-creator's advice to write deliberately "pushy" descriptions. This
can only be resolved empirically via skill-creator's description-optimization eval
loop -- not by intuition -- which is why the eval/tune work is positioned as a late,
optional-final effectiveness pass rather than an early gate.

## Key Findings

### Recommended Stack

The stack is the Claude Code plugin/skill authoring toolchain and its file formats,
not a runtime. Everything is HIGH confidence against current docs + real manifests.
Ship skill-only: no `commands/`/`agents/`/`hooks/`/MCP in v1. Version the plugin via
`plugin.json` ONLY (omit `version` from the marketplace entry -- `plugin.json` wins
silently and a stale duplicate is masked; also omit `version` from SKILL.md
frontmatter, which is not a recognized field). See STACK.md.

**Core technologies:**
- `.claude-plugin/marketplace.json` (root) -- names the marketplace + lists `lz-tdd` with a relative `source` -- required for `/plugin marketplace add` to work.
- `plugins/lz-tdd/.claude-plugin/plugin.json` -- declares plugin identity; `name: lz-tdd` drives the `/lz-tdd:` namespace; only `name` strictly required.
- `SKILL.md` (Agent Skills format) -- the single required skill file; its **directory name** (`lz-tpp`) determines the command and its `description` drives auto-triggering.
- `skill-creator` + `plugin-dev` + `claude plugin validate` -- build/tune the skill, scaffold/validate structure; the authoritative structural gate before shipping.

### Expected Features

The skill has two jobs: **coach** (in-loop, picks the next transformation by priority)
and **reference** (explains the premise/list on demand). The coach behavior is the
genuine differentiator; a reference-only skill would ship the wrong product. See
FEATURES.md (Part 2 is the canonical TPP subject-matter extract).

**Must have (table stakes -- v1):**
- Tuned `description` (what + when + concrete TDD/TPP trigger terms) -- triggering is the gate; nothing else matters if it does not fire.
- Correct, cited transformation priority list bundled in `references/` -- the "if everything else fails, this must be correct" core.
- Coach decision procedure (failing test + code -> named next transformation) -- the Core Value; a repeatable algorithm, not prose.
- Reference/explain-on-demand behavior; transformations-vs-refactorings distinction; amended red-green-refactor framing.
- Progressive disclosure (lean SKILL.md, detail in `references/`); at least one concrete TypeScript worked example (Fibonacci); impasse/backtrack guidance.

**Should have (differentiators, add after validation):**
- Language-specific ordering overlay for TS/JS (prefer `(if->while)` + `(variable->assignment)` above recursion -- source-sanctioned by Uncle Bob for non-functional languages).
- Additional worked examples (Word Wrap impasse, Prime Factors); "name the transformation" pedagogical annotations.
- skill-creator trigger + behavior eval coverage (measurable triggering accuracy and coaching quality).

**Defer (v2+):**
- Additional languages beyond TS; a mechanical/AST transformation tool; additional TDD skills under `lz-tdd` (naming, triangulation); test-runner integration to auto-detect the red test (anti-feature: drives instead of coaches).

### Architecture Approach

A repo-as-marketplace with co-located plugins: one repo is both the marketplace and
the plugin host, wired by relative `source` strings, with `plugins/<name>/` used from
day one so a second plugin/skill is a pure addition (auto-discovery scans `skills/`;
no manifest edits needed to add a skill). Progressive disclosure is the load-bearing
skill pattern. `${CLAUDE_PLUGIN_ROOT}` is not needed for a script-free v1. See
ARCHITECTURE.md.

**Major components:**
1. `marketplace.json` (repo root) -- marketplace identity + `plugins[]` catalog; references down, never duplicates.
2. `plugin.json` (`plugins/lz-tdd/`) -- plugin identity/namespace + distribution metadata; component dirs live at the plugin root, never inside `.claude-plugin/`.
3. `SKILL.md` + `references/transformations.md` -- always-loaded trigger metadata + lean body (on trigger) + full catalog (on demand).
4. Repo hygiene (`README.md`, `LICENSE`, `.gitignore`) -- distribution surface; README carries the exact install command.

### Critical Pitfalls

Two failure surfaces that rarely co-occur: mechanical packaging (one bad path/field =
silent non-load) and methodology fidelity (encoding a self-described-provisional
premise correctly). See PITFALLS.md (12 pitfalls + phase mapping).

1. **Conflating transformations with refactorings** -- state the behavior-changing vs behavior-preserving distinction up front; scope the coach to the GREEN phase; add a should-not-trigger eval for "extract this helper."
2. **Presenting TPP as rigid law** -- frame as a why-driven heuristic; no MUST/NEVER around ordering; carry the author's own "probably not / not likely" caveat into the reference.
3. **Transformation-list drift from secondary sources** -- transcribe verbatim from the primary posts and cite; Wikipedia/summaries render `constant->variable`, mislabel recursion, etc. (This project's own PROJECT.md brief uses the drifted 7-item shorthand.)
4. **Reference-only skill that never coaches** -- design SKILL.md around the decision procedure with before/after snippets; validate with evals that supply a real failing test + code, not "explain TPP."
5. **Over- vs under-triggering tuned by feel** -- run skill-creator's ~20-query eval loop (8-10 should-trigger + 8-10 near-miss should-not-trigger); select by held-out score; scope triggers to transformation-choice-during-TDD, not broad "testing"/"TypeScript".

## Implications for Roadmap

The four researchers converged on a natural 5-step decomposition (scaffold ->
source-distillation -> skill-authoring -> eval-and-tune -> docs). Reconciled to this
project's COARSE granularity, that collapses to **4 phases**, with docs folded forward
and eval/tune positioned as a LATE, optional-final effectiveness pass:

### Phase 1: Scaffold
**Rationale:** Everything installs/validates against the manifest hierarchy; nothing downstream resolves until the structure exists. Well-documented, mechanical.
**Delivers:** Repo skeleton + hygiene stubs; `marketplace.json`; `plugins/lz-tdd/.claude-plugin/plugin.json`; empty `skills/lz-tpp/SKILL.md` scaffold; `claude plugin validate` passing.
**Addresses:** Marketplace + plugin scaffold requirements; extensible `plugins/<name>/` layout.
**Uses:** marketplace.json + plugin.json manifests, relative `source`, first-party validator.
**Avoids:** Pitfall 8 (manifest errors -> silent non-load), Pitfall 9 (name/rename mismatch -- decide all four identifiers now), Pitfall 6 (namespace: dir == frontmatter `name` == `lz-tpp`).

### Phase 2: Source distillation
**Rationale:** The skill's correctness depends entirely on a faithful canonical extract; get the subject matter right before authoring against it. FEATURES.md Part 2 has already done most of this at HIGH confidence -- the residual work is the NDC 2011 transcript and reconciling the list discrepancy.
**Delivers:** A cited, verbatim-faithful canonical transformation list (the revised 14-item FibTPP list -- see flag), the transformations-vs-refactorings definitions, the rationale/impasse "why," and the language-specificity caveat -- distilled into shippable `references/transformations.md` source material.
**Addresses:** "Grounded in authoritative sources"; "bundles the full transformation priority list."
**Avoids:** Pitfall 3 (list drift), Pitfall 1 (definition), Pitfall 2 (provisional caveat), Pitfall 12 (retain the rationale), Pitfall 10 (capture language caveat).

### Phase 3: Skill authoring
**Rationale:** With correct source material and a valid scaffold, write the dual-mode skill: coach procedure in SKILL.md, full catalog in `references/`. Patterns are well documented (skill-creator + plugin-dev); the only novel design is the decision procedure, already sketched in FEATURES.md.
**Delivers:** Lean SKILL.md (decision procedure + compact list + pointers), `references/transformations.md` (full annotated list + worked TS Fibonacci example), dual-mode frontmatter (auto-trigger coach + `/lz-tdd:lz-tpp` reference).
**Addresses:** Coach + reference behavior; language-agnostic principles with TS examples; progressive disclosure; impasse guidance.
**Implements:** SKILL.md body <-> references/ progressive-disclosure seam.
**Avoids:** Pitfall 4 (procedure, not glossary), Pitfall 7 (bloat), Pitfall 11 (annotate + verify each example step is highest-priority-that-passes), Pitfall 10 (neutral principle + labeled TS examples).

### Phase 4: Docs, hygiene, and (optional-final) eval/tune
**Rationale:** Docs + hygiene are prerequisites to a public ship; the eval/tune pass is deliberately positioned LAST and treated as an optional skill-effectiveness + trigger-optimization step per the project owner's instruction -- it refines an already-working skill rather than gating it.
**Delivers:** README with the exact install command, MIT LICENSE, public-contact hygiene, ASCII-only verification; then (optional-final) skill-creator trigger + behavior evals and description-optimization loop.
**Addresses:** Distribution + hygiene requirements; "description tuned for accurate triggering without over-triggering."
**Avoids:** Pitfall 5 (over/under-triggering -- the eval loop is the whole point), Pitfall 9 (README install command matches final repo name), plus the public-repo security/hygiene items (work email, license, ASCII).
**Note:** The physical folder + GitHub rename to the plural `lz-engineering-claude-plugins` must be executed OUTSIDE an active session (renaming cwd mid-session breaks tooling) -- treat as a ship-time step, not an in-phase edit.

### Phase Ordering Rationale

- **Hard build dependency chain:** scaffold before source (structure must exist to hold `references/`), source before authoring (cannot author a faithful skill against undistilled material), authoring before eval/tune (cannot optimize a description/behavior that does not yet exist).
- **Architecture grouping:** the three-level manifest hierarchy maps cleanly onto scaffold; the progressive-disclosure seam maps onto authoring; both are additive, so the layout never needs restructuring.
- **Pitfall coverage:** the two fidelity-critical pitfalls (list drift, transformation-vs-refactoring) are front-loaded into source distillation; the two empirical pitfalls (triggering, example fidelity) land in the final eval pass where they can actually be measured.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (source distillation):** LIGHT research, not deep -- the subject matter is already captured at HIGH confidence in FEATURES.md Part 2, but two items remain: (a) produce/verify the NDC 2011 transcript (deferred from project research per instructions; tooling in PROJECT.md), and (b) reconcile the 12-vs-14-item discrepancy between the research files (see Gaps). Flag `--research-phase` only if the transcript surfaces refinements to the list.

Phases with standard patterns (skip research-phase):
- **Phase 1 (scaffold):** Well-documented, mechanical; STACK + ARCHITECTURE are HIGH with copy-ready manifests.
- **Phase 3 (skill authoring):** Established skill-creator/plugin-dev patterns; the coach procedure is already sketched.
- **Phase 4 (eval/tune + docs):** The eval loop is a documented, empirical/iterative skill-creator workflow -- it needs *iteration and dogfooding*, not documentation research.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified against official 2026-07-01 docs + real installed manifests (Anthropic official + maintainer's analog). One resolved flag: SKILL.md `version` frontmatter is not a valid field -- omit it. |
| Features | HIGH | Primary TPP posts fetched verbatim; skill-authoring best practices from first-party docs. One in-research discrepancy: 12- vs 14-item list (resolved to 14 canonical -- see Gaps). |
| Architecture | HIGH | Cross-checked against three authoritative sources including the maintainer's own directly-analogous `lz-advisor` marketplace repo. |
| Pitfalls | HIGH | HIGH for packaging (first-party tooling + schema) and TPP fidelity (canonical source verbatim). Caveat: PITFALLS.md itself cites the 12-item list as canonical -- an instance of the very revision gap it warns about (see Gaps). |

**Overall confidence:** HIGH

### Gaps to Address

- **12-item vs 14-item transformation list (flagged, must reconcile in Phase 2).** FEATURES.md Part 2 is authoritative: the FibTPP post explicitly REVISES the original TPP post's 12-item list into a 14-item list (adds `(statement->tail-recursion)` above `(if->while)`, adds `(case)` at the bottom, moves plain `(statement->recursion)` below `(if->while)`). PITFALLS.md's "canonical list has 12 entries" reflects only the original post and is itself a mild drift. **Resolution: ship the revised 14-item FibTPP list as canonical, document the evolution from the 12-item original for provenance, and apply Uncle Bob's own source-sanctioned TS/JS overlay** (prefer `(if->while)` + `(variable->assignment)` above the recursion transformations, since JS/TS lack reliable TCO) as an opinionated overlay, not a contradiction.
- **NDC 2011 talk transcript not yet produced.** Deferred from project research per instructions. Transcribe during Phase 2 (tooling: youtube-to-markdown, markitdown fallback -- see PROJECT.md) and cross-check for any refinements to the list; note discrepancies rather than silently picking one.
- **Repo / folder / GitHub name alignment pending.** Working dir is still singular `lz-engineering-claude-plugin`; committed manifests/docs must use the plural `lz-engineering-claude-plugins` from the start, and the physical + GitHub rename must be done OUTSIDE an active session (ship-time step).
- **Description char cap discrepancy (minor, verify in authoring).** STACK.md cites a 1,536-char truncation on the combined listing; FEATURES.md/skill best-practices cite a 1,024-char `description` max. These may measure different things (single-field max vs combined-listing truncation). Keep the `description` well under 1,024 chars to satisfy both; confirm against skill-reviewer during authoring.
- **Triggering accuracy is empirically resolvable only.** No amount of research settles it; it requires the skill-creator eval loop (held-out scored) plus dogfooding. This is the substantive reason eval/tune is a late, optional-final phase.

## Sources

### Primary (HIGH confidence)
- Official Claude Code docs -- "Extend Claude with skills" and "Create and distribute a plugin marketplace" (page timestamp 2026-07-01) -- skill frontmatter, command derivation, namespacing, progressive disclosure, marketplace/plugin required fields, version resolution, `claude plugin validate`.
- Robert C. Martin, "The Transformation Priority Premise" (original 12-item list, transformation/refactoring definitions, mantra, Word Wrap impasse, provisional caveats) -- blog.cleancoder.com.
- Robert C. Martin, "Fib. The T-P Premise." (canonical revised 14-item list, tail-recursion + case additions, language-specificity, Fibonacci worked example) -- blog.cleancoder.com.
- Anthropic skill-authoring best practices + Agent Skills overview -- description = what + when, third-person, size targets, three-level progressive disclosure.
- Installed manifests: `claude-plugins-official/.claude-plugin/marketplace.json` (Anthropic's own) and the maintainer's `lz-advisor-claude-plugins` repo -- real-world confirmation of the co-located single-repo layout and `source` forms.
- Local first-party `plugin-dev` (plugin-structure, skill-development, manifest-reference, plugin-validator, skill-reviewer, create-plugin) and `skill-creator` SKILL.md -- authoring conventions, triggering mechanism, description-optimization loop.

### Secondary (MEDIUM confidence)
- Robert C. Martin, "The Transformation Priority Premise", NDC 2011 talk (video id `B93QezwTQpI`) -- authoritative but not yet transcribed; to be produced in Phase 2.
- Transformation Priority Premise -- Wikipedia -- used to DEMONSTRATE drift (renders `constant->variable`, mislabels recursion); confirms language-specificity note.
- Local `plugin-dev` v0.1.0 skill files -- show a stale `version:` field and title-case `name:` in SKILL.md frontmatter; superseded by the current docs (flagged, resolved: omit `version`, use kebab `name: lz-tpp`).

### Tertiary (LOW confidence)
- ASOS Coding Style handbook (TPP section) and David Halewood, "TDD with the Transformation Priority Premise" -- practitioner write-ups; use only to cross-check, blogs take precedence.
- Anthropic's referenced marketplace schema URL does not resolve at load time; use SchemaStore's `claude-code-marketplace.json` for editor validation only.

---
*Research completed: 2026-07-02*
*Ready for roadmap: yes*
