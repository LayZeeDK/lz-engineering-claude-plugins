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

(None yet -- ship to validate)

### Active

<!-- Current scope. Hypotheses until shipped and validated. -->

Marketplace + plugin scaffold:

- [ ] Repo is a valid Claude Code marketplace (root `.claude-plugin/marketplace.json`) named `lz-engineering-claude-plugins`
- [ ] Marketplace lists the `lz-tdd` plugin
- [ ] `lz-tdd` plugin has a valid `.claude-plugin/plugin.json`
- [ ] Structure stays extensible for additional plugins and additional skills under `lz-tdd`

lz-tpp skill:

- [ ] `lz-tpp` skill lives under the `lz-tdd` plugin, invocable as `/lz-tdd:lz-tpp`
- [ ] Coach behavior: recommends the next code transformation by TPP priority order during TDD
- [ ] Reference behavior: explains the transformations and their priority ordering on demand
- [ ] Skill description tuned for accurate triggering (TDD / transformation / TPP contexts) without over-triggering
- [ ] Guidance is language-agnostic with concrete TypeScript examples in BOTH functional and imperative styles, showing how transformation-priority choices shift by paradigm (e.g. recursion/expressions vs iteration/assignment)
- [ ] JS/TS references cover TCO-alternative patterns (trampolines, generators-as-state-machines, CPS) for recursion-based transformations, since JS engines other than JavaScriptCore/Safari lack proper tail calls
- [ ] Bundles the full transformation priority list as reference material
- [ ] Grounded in authoritative sources (2 Clean Code blog posts + NDC 2011 talk transcript)

Distribution + hygiene:

- [ ] README documents install via `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins`
- [ ] MIT LICENSE and public contact (`larsbrinknielsen@gmail.com`)
- [ ] Complies with skill-creator and plugin-dev authoring guidelines

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Additional plugins beyond `lz-tdd` in 0.0.1 -- start with one plugin, keep structure extensible
- Commands / agents / hooks inside `lz-tdd` for 0.0.1 -- skill-first; add later if a real need appears
- npm packaging/distribution -- git-based marketplace install is sufficient for 0.0.1
- Deep language-specific guides beyond TypeScript examples -- agnostic principles + TS examples cover 0.0.1
- Additional TDD skills under `lz-tdd` (e.g., test naming, triangulation) -- future skills, not 0.0.1

## Context

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
- Naming change (2026-07-02): repo -> `lz-engineering-claude-plugins` (plural), first plugin -> `lz-tdd`, first skill -> `lz-tpp` (`/lz-tdd:lz-tpp`). The local working directory is still `lz-engineering-claude-plugin`; the physical folder and GitHub repo rename is pending and is safer to perform outside an active session (renaming the cwd mid-session breaks tooling).
- Remote (target): https://github.com/LayZeeDK/lz-engineering-claude-plugins -- to be created and pushed during execution/ship (not created yet; no git remote configured). Owner `LayZeeDK`, repo `lz-engineering-claude-plugins`, public.

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
| Repo is a marketplace named `lz-engineering-claude-plugins` (plural) | Hosts multiple engineering plugins over time; name matches intent | -- Pending |
| First plugin is `lz-tdd` (TDD-focused) | Groups TDD skills; `lz-tpp` is its first skill | -- Pending |
| First skill is `lz-tpp` (`/lz-tdd:lz-tpp`) | TPP is the initial high-value TDD capability | -- Pending |
| Skill is coach + reference | Drives next-transformation choice during TDD and explains the premise on demand | -- Pending |
| Language-agnostic principles with TypeScript examples (functional + imperative) | Broad applicability, grounded in the user's primary stack; paradigm pairing shows how transformation priority shifts (recursion/expressions vs iteration/assignment), per Martin's language-specificity note | -- Pending |
| Public GitHub, MIT license | Open-source distribution via `/plugin marketplace add` | -- Pending |
| Build via `skill-creator` + `plugin-dev` | Follow first-party authoring workflows and guidelines | -- Pending |
| First milestone is version 0.0.1 (pre-1.0) | Signals early/experimental status; `plugin.json` version 0.0.1 | -- Pending |

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
*Last updated: 2026-07-02 after initialization*
