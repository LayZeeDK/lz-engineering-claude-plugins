# lz-engineering-claude-plugins

## What This Is

A public Claude Code plugin marketplace repository that hosts engineering-focused
plugins for Claude Code. The first plugin is `lz-tdd`, a test-driven-development
plugin; its first skill is `lz-tpp` (invoked as `/lz-tdd:lz-tpp`), an agent skill
that operationalizes Robert C. Martin's Transformation Priority Premise (TPP). It
is for software engineers who use Claude Code and practice TDD.

## Core Value

`lz-tpp` helps Claude choose the next code transformation by TPP priority order
during red-green-refactor TDD -- keeping the implementation at the simplest
transformation that passes the failing test -- and explains the premise on demand.
If everything else fails, this transformation-priority guidance must be correct and
usable.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

Marketplace + plugin scaffold (Phase 1: Marketplace & Plugin Scaffold, 2026-07-02):

- [x] Repo is a valid Claude Code marketplace (root `.claude-plugin/marketplace.json`) named `lz-engineering-claude-plugins`
- [x] Marketplace lists the `lz-tdd` plugin via a relative `./plugins/lz-tdd` source
- [x] `lz-tdd` plugin has a valid `.claude-plugin/plugin.json` (name `lz-tdd`, version `0.0.1`, MIT)
- [x] Structure stays extensible (skills auto-discovery; adding a second skill/plugin needs no edits to existing manifests)
- [x] Placeholder `lz-tpp` skill exists at `plugins/lz-tdd/skills/lz-tpp/SKILL.md`; repo passes `claude plugin validate .` (local marketplace add/list loop verified; remote name resolution deferred to ship-time)

Canonical TPP source reference (Phase 2: TPP Source Distillation, 2026-07-02):

- [x] `plugins/lz-tdd/skills/lz-tpp/references/transformations.md` locks the canonical 14-item FibTPP transformation priority list -- verbatim-faithful and cited -- with the 12-vs-14 discrepancy resolved and the original 12-item list + secondary-source drift documented for provenance (TPP-01, TPP-02)
- [x] The NDC 2011 talk (`B93QezwTQpI`) is transcribed via the local `youtube-to-markdown` tool, retained as source material under `.planning/`, and reconciled against the blog list with discrepancies noted rather than silently resolved (TPP-03)
- [x] The reference states the transformations-vs-refactorings distinction and frames TPP as a provisional heuristic with the author's own hedges, not rigid law (TPP-04)
- [x] Bundles the full transformation priority list as reference material, grounded in the authoritative sources (2 Clean Code blog posts + NDC 2011 talk transcript)

lz-tpp dual-mode skill (Phase 3: lz-tpp Skill Authoring, 2026-07-02):

- [x] `lz-tpp` lives at `plugins/lz-tdd/skills/lz-tpp/SKILL.md`, invocable as `/lz-tdd:lz-tpp`, with default dual-mode frontmatter (SKILL-01, SKILL-02)
- [x] Coach behavior: a 7-step decision procedure recommends the next NAMED transformation by TPP priority during red-green-refactor, with impasse/backtrack (pose a simpler test) guidance (SKILL-03)
- [x] Reference behavior: on-demand explanation of the transformations and their priority ordering, routed to the locked `references/transformations.md` (SKILL-04)
- [x] Lean `SKILL.md` (87 lines / 702 words; 750-char scoped description) via progressive disclosure, heavy material in bundled `references/` (SKILL-05, SKILL-06); empirical trigger/coaching tuning deferred to Phase 5 (EVAL-01/02)
- [x] Paired functional/imperative TypeScript examples (Kata 1 sum, Kata 2 flatten) showing how transformation-priority choices shift by paradigm, plus the Fibonacci worked example test-by-test in monotonic priority order (TPP-05, TPP-06)
- [x] TS/JS TCO-alternative guidance (trampoline, generator-as-state-machine, CPS-with-trampoline, fold) + when to prefer the iterative transformation; tsc --strict-clean (TPP-07)

Distribution & hygiene (Phase 4: Distribution & Hygiene, 2026-07-02):

- [x] `README.md` documents install via `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` then `/plugin install lz-tdd@lz-engineering-claude-plugins`, plus what the skill does and how to invoke it (`/lz-tdd:lz-tpp`) (DIST-01)
- [x] MIT `LICENSE` at repo root with public contact `larsbrinknielsen@gmail.com`; the work email is absent from the shippable tree (DIST-02)
- [x] Passes first-party authoring review -- plugin-validator + skill-reviewer both PASS, `claude plugin validate . --strict` exits 0, findings triaged per D-06 (DIST-03)

Skill effectiveness evals (Phase 5: Skill Effectiveness Evals, 2026-07-03):

- [x] EVAL-01 trigger eval: the `description` fires on in-scope TDD / red-green-refactor / TPP / transformation-priority prompts and stays quiet on near-misses -- 100% recall (13/13) and 100% specificity (14/14) on the shipped description, run natively (EVAL-01)
- [x] EVAL-02 behavior eval: the coach recommends the correct next transformation -- with_skill 29/30 (Pass@1 0.97, Pass@3 1.00) vs 15/30 baseline; no tuning applied, shipped skill unchanged (EVAL-02)

### Active

<!-- Current scope. Hypotheses until shipped and validated. -->

Milestone 0.0.1 is fully shipped and validated (Phases 1-5). No active requirements -- the next milestone (post-0.0.1) defines fresh scope. Candidate directions tracked as NEXT-01..04: additional TDD skills under `lz-tdd` (test naming, triangulation, red-green discipline), additional plugins in the marketplace, npm packaging/distribution, and multi-language example sets beyond TypeScript.

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Additional plugins beyond `lz-tdd` in 0.0.1 -- start with one plugin, keep structure extensible
- Commands / agents / hooks inside `lz-tdd` for 0.0.1 -- skill-first; add later if a real need appears
- npm packaging/distribution -- git-based marketplace install is sufficient for 0.0.1
- Deep language-specific guides beyond TypeScript examples -- agnostic principles + TS examples cover 0.0.1
- Additional TDD skills under `lz-tdd` (e.g., test naming, triangulation) -- future skills, not 0.0.1

## Context

- **Current state (v0.0.1 shipped 2026-07-04):** first public release complete -- marketplace + `lz-tdd` plugin + dual-mode `lz-tpp` skill, ~909 LOC under `plugins/` (Markdown / JSON / TS), MIT-licensed, `claude plugin validate .` clean. All 24 milestone requirements satisfied; evals confirm 100%/100% trigger recall/specificity and 29/30 coaching accuracy. Next: define the post-0.0.1 milestone via `/gsd-new-milestone`.
- Authoritative sources (from the brief):
  - The Transformation Priority Premise -- https://blog.cleancoder.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html
  - Fib. The T-P Premise. -- https://blog.cleancoder.com/uncle-bob/2013/05/27/FibTPP.html
  - Robert C Martin -- The Transformation Priority Premise, NDC 2011 -- https://youtu.be/B93QezwTQpI (video id `B93QezwTQpI`)
- JS/TS tail-call caveat: ES6 proper tail calls are implemented only in JavaScriptCore (Safari); V8 (Node/Chrome) and SpiderMonkey (Firefox) do not optimize tail recursion. Recursion-based transformations therefore need stack-safe alternatives in JS/TS -- trampolines, generators-as-state-machines, Continuation-Passing Style (CPS) -- or a switch to the iterative transformation. The skill must teach this explicitly.
- TPP subject matter: an ordered list of "transformations" (for example `{}->nil`, `nil->constant`, `constant->variable`, `statement->statements`, `unconditional->if`, `...->recursion`, `...->while`) applied simplest-first during TDD. Higher-priority (simpler) transformations are preferred to avoid premature complexity and to escape local maxima where a test forces a large leap.
- Build tooling already installed: `skill-creator` plugin (create/optimize the skill and run evals), `plugin-dev` plugin (scaffold marketplace/plugin, validate structure).
- Research artifacts in `.planning/research/`: STACK, FEATURES (incl. canonical transformation list), ARCHITECTURE, PITFALLS, SUMMARY, and TPP-TYPESCRIPT.md (verified TCO status + trampoline/generator/CPS patterns + functional-vs-imperative decision guide for TPP-05/TPP-07).
- Transcription tooling (local):
  - Primary: `node D:\projects\github\LayZeeDK\lz-cybernetics-ai-plugins\tools\youtube-to-markdown\youtube-to-markdown.mjs B93QezwTQpI --output <prefix>`
  - Fallback (if transcript quality is poor): markitdown CLI at `C:\Users\LarsGyrupBrinkNielse\AppData\Local\Temp\markitdown-mcp-npx\venv\Scripts\markitdown`
- Naming (finalized 2026-07-02): repo `lz-engineering-claude-plugins` (plural), first plugin `lz-tdd`, first skill `lz-tpp` (`/lz-tdd:lz-tpp`). The physical folder rename and GitHub repo creation are complete; the working directory and `origin` remote both use `lz-engineering-claude-plugins`.
- Remote: https://github.com/LayZeeDK/lz-engineering-claude-plugins (created, public, owner `LayZeeDK`; `origin` wired, `main` in sync). `claude plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` resolves and validates the marketplace and its `./plugins/lz-tdd` source.

## Constraints

- **Tech stack**: Claude Code plugin format -- root `.claude-plugin/marketplace.json`, per-plugin `.claude-plugin/plugin.json`, skills as `SKILL.md` with YAML frontmatter and progressive disclosure. Skills are namespaced by plugin (`/lz-tdd:lz-tpp`).
- **Tooling**: Build the skill with `skill-creator`; scaffold and validate the plugin/marketplace with `plugin-dev`.
- **Source authority precedence**: Anthropic News / Claude Code Blog > frontier labs > community resources > Claude Code Docs > skill-creator > plugin-dev. Note: some Anthropic domains block AI fetchers -- use the fetch fallback chain (markdown.new, WebFetch, url-to-markdown, playwright-cli).
- **Public repo hygiene**: MIT license; public contact `larsbrinknielsen@gmail.com`; never use the work email in this repo.
- **Local system**: Windows 11 arm64, PowerShell Core + Git Bash; ASCII-only output (no Unicode/emojis); `git grep`/`rg` for search; `npm` default package manager.

## Key Decisions

<!-- Decisions that constrain future work. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Repo is a marketplace named `lz-engineering-claude-plugins` (plural) | Hosts multiple engineering plugins over time; name matches intent | Good -- shipped v0.0.1; marketplace resolves + validates from the public repo |
| First plugin is `lz-tdd` (TDD-focused) | Groups TDD skills; `lz-tpp` is its first skill | Good -- `lz-tdd` ships with `lz-tpp`; additive layout ready for more TDD skills |
| First skill is `lz-tpp` (`/lz-tdd:lz-tpp`) | TPP is the initial high-value TDD capability | Good -- shipped; evals confirm strong triggering + coaching accuracy |
| Skill is coach + reference | Drives next-transformation choice during TDD and explains the premise on demand | Good -- dual-mode verified: auto-triggers as coach, answers on demand as reference |
| Language-agnostic principles with TypeScript examples (functional + imperative) | Broad applicability, grounded in the user's primary stack; paradigm pairing shows how transformation priority shifts (recursion/expressions vs iteration/assignment), per Martin's language-specificity note | Good -- paired FP/imperative TS examples + Fibonacci walk + TCO guidance shipped, tsc-clean |
| Public GitHub, MIT license | Open-source distribution via `/plugin marketplace add` | Good -- MIT LICENSE + public repo; marketplace-add install loop verified |
| Build via `skill-creator` + `plugin-dev` | Follow first-party authoring workflows and guidelines | Good -- passed plugin-validator + skill-reviewer + `validate --strict` (exit 0) |
| First milestone is version 0.0.1 (pre-1.0) | Signals early/experimental status; `plugin.json` version 0.0.1 | Good -- shipped as 0.0.1; GSD milestone id reconciled to v0.0.1 at complete-milestone |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check -- still the right priority?
3. Audit Out of Scope -- reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-04 after v0.0.1 milestone completion*
