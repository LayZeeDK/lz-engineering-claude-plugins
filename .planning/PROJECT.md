# lz-engineering-claude-plugins

## What This Is

A public Claude Code plugin marketplace repository that hosts engineering-focused
plugins for Claude Code. The first plugin is `lz-tdd`, a test-driven-development
plugin. It ships two dual-mode agent skills covering the green and refactor steps of
the red-green-refactor loop: `lz-tpp` (`/lz-tdd:lz-tpp`) operationalizes Robert C.
Martin's Transformation Priority Premise for the green step, and `lz-refactor`
(`/lz-tdd:lz-refactor`, added in lz-tdd@0.0.2) operationalizes Martin Fowler's
*Refactoring* (2nd ed) and Joshua Kerievsky's *Refactoring to Patterns* for the refactor
step. A third skill, `lz-red` (`/lz-tdd:lz-red`), for the red (failing-test) step is in
progress under lz-tdd@0.0.3. It is for software engineers who use Claude Code and practice
TDD.

## Core Value

`lz-tpp` helps Claude choose the next code transformation by TPP priority order
during red-green-refactor TDD -- keeping the implementation at the simplest
transformation that passes the failing test -- and explains the premise on demand.
If everything else fails, this transformation-priority guidance must be correct and
usable.

## Current Milestone: lz-tdd@0.0.3 -- lz-red Skill (RED phase)

**Goal:** Add a third dual-mode agent skill, `/lz-tdd:lz-red`, that coaches the RED step of
red-green-refactor -- choosing and writing the next failing unit test well, adaptively
matching the codebase's testing stance -- completing the RGR loop and handing off to `lz-tpp`
at the green step.

**Target features:**

- Dual-mode `lz-red` skill (auto-triggering coach + on-demand reference) at
  `plugins/lz-tdd/skills/lz-red/`, mirroring lz-tpp/lz-refactor progressive disclosure (lean
  `SKILL.md` + lazy `references/`).
- RED decision procedure on the Three Laws of TDD spine: pick the next test (test list,
  one-step, starter/degenerate, triangulation) -> structure it (AAA / Given-When-Then,
  assert-first, evident data, one concept) -> assert observable behavior not implementation
  -> behavior-shaped naming -> fail for the right reason -> hand off to lz-tpp.
- Adaptive testing-stance router: match house idiom always; route by structural control /
  seams to Bernhardt (functional core-imperative shell) / Metz (Magic Tricks query-command
  matrix) / Feathers (no-seam legacy); "listen to the tests" as the meta-rule; optional
  override phrase (no flag).
- TypeScript + Vitest specialization: `it.todo` as the test list, `test.each` for
  triangulation, `expectTypeOf`/`assertType` for type-level RED, `vi.*` doubles with
  restraint, watch-mode feedback loop; TS examples throughout SKILL.md and references.
- lz-tpp seam (Three Laws 1/2 -> Law 3 handoff) + reverse pointer; anti-pattern leaf
  including Ian Cooper's over-mock / test-per-class warning.
- Skill-effectiveness evals (trigger recall/specificity + RED-behavior accuracy), as in
  0.0.1/0.0.2.

**Scope:** unit RED only; outside-in / acceptance / double-loop TDD deferred to a later
milestone. Grounding sources and their access tiers (owned-book/transcribed-talk clean-room
via git-ignored `.oracle/`; no-oracle high-confidence core; DHH banned) are recorded in Key
Decisions; full requirements are defined in `.planning/REQUIREMENTS.md`.

## Current State: lz-tdd@0.0.2 SHIPPED (2026-07-17)

**Shipped:** A single `/lz-tdd:lz-refactor` agent skill -- a dual-mode refactoring
coach + reference that operationalizes Martin Fowler's *Refactoring* (2nd ed) and
Joshua Kerievsky's *Refactoring to Patterns* -- completing the red-green-refactor
seam alongside `lz-tpp` (lz-tpp drives the green step; lz-refactor drives the
refactor step). All 36 milestone requirements satisfied; milestone audit passed;
Nyquist 11/11 compliant. Full detail archived at
`.planning/milestones/lz-tdd@0.0.2-{ROADMAP,REQUIREMENTS,MILESTONE-AUDIT}.md`.

**Next milestone:** define via `/gsd-new-milestone` (fresh requirements). Deferred
candidates below (Future Requirements in the archived REQUIREMENTS) remain the
starting backlog.

**Delivered:**

- Single `lz-refactor` skill built on progressive disclosure: a lean router
  `SKILL.md` plus lazy-loaded `references/` docs, modeled on the `angular-developer`
  skill and the skill-creator / plugin-dev authoring guidelines.
- Dual-mode: an auto-triggering refactor-step coach (smell -> named refactoring,
  including "refactor away from a pattern" de-patterning) and an on-demand catalog
  reference.
- Fowler layer at full grain: all 62 2nd-ed refactorings (mechanics + original TS/JS), a
  unified smell taxonomy, and Ch.2 principles; provenance-labeled (Return Modified Value
  `[web-only]` + Split Phase's online-only examples). (4 web-only 1st-ed relics cut.)
- Kerievsky layer at full grain: all 27 pattern-directed refactorings (mechanics +
  original TS/JS re-rendered from Java), the To/Towards/Away directions, and the
  Ch.4 smells; cross-mapped to the Fowler primitives each composes.
- Oracle-access convention (how copyrighted book content is sourced across phases): books
  present as Markdown under git-ignored `.oracle/` (Fowler 2nd ed; Kerievsky) are accessed
  ONLY via the clean-room `oracle`/`oracle-reviewer` agents -- the main context never reads
  book prose; only own-words answers/verdicts cross back (DST-04). Books NOT in `.oracle/`
  (GoF, Beck, RCM) use AskUserQuestion (the owner answers). See phase `07-ORACLE-MODEL.md`.
- Principle-backing cross-references (no oracle copy owned -- high-confidence core
  only): Beck *TDD by Example* + *Tidy First?* and Feathers *Working Effectively
  with Legacy Code* (refactoring safely without tests).
- Skill-effectiveness evals (trigger recall/specificity + smell->refactoring
  behavior accuracy), as in 0.0.1's Phase 5.

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

lz-refactor skill scaffold (Phase 6: lz-refactor Skill Scaffold & Progressive Disclosure, 2026-07-04):

- [x] SKEL-01: `/lz-tdd:lz-refactor` invocable; skill at `plugins/lz-tdd/skills/lz-refactor/SKILL.md` with dual-mode-by-omission frontmatter (name + description only; `name` == dir)
- [x] SKEL-02: lean 69-line router (< 500) lazy-loading five `references/` task-area groups (Fowler catalog, smell taxonomy, principles, Kerievsky patterns, refactoring-without-tests), each a one-level-deep pointer -- modeled on angular-developer sectioning + lz-tpp dual-mode framing
- [x] SKEL-03: 774-char seam-aware `description` (should-be-used + Do-not-use near-miss + lz-tpp green/refactor seam), within the char cap; empirical trigger tuning deferred to Phase 11 (EVL-01)
- [x] SKEL-04: heavy catalog material bundled, not inlined -- two splittable catalog subdirs behind thin index stubs; every `references/` stub carries its per-entry content contract; catalog stubs carry the D-09 Phase 7/8 oracle-access checkpoint note. Verified: Wave-0 checker + `claude plugin validate .` both exit 0

lz-refactor catalogs, coach, distribution & evals (Phases 7-14, shipped lz-tdd@0.0.2 2026-07-17) -- all 36 requirements satisfied (full per-requirement traceability archived at `.planning/milestones/lz-tdd@0.0.2-REQUIREMENTS.md`):

- [x] Fowler catalog (FWL-01..04) -- 62 refactorings + 24 smells + Ch.2 principles, clean-room-oracle-verified, tsc --strict-clean
- [x] Kerievsky catalog (KRV-01..04) -- 27 pattern-directed refactorings, To/Towards/Away directions, Fowler-primitive composition, Ch.4 smells folded
- [x] GoF + extra catalog (GOF-01..04, XTR-01) -- 23 GoF + 5 Tier-1 extra patterns on the 5-section contract, modern-status caveats, Away links
- [x] Functional catalog (FUN-01..04) -- 19 idiom leaves + N:1 pattern->idiom map + 55 mutual OO<->FP cross-links
- [x] Coach behavior (CCH-01..06) -- inline decision procedure; smell->named-refactoring routing, de-patterning, behavior-preservation, lz-tpp seam, functional-alternative surfacing
- [x] Principle-backing (PRIN-01..03) -- no-oracle Beck *TDD by Example* / *Tidy First?* / Feathers refs
- [x] Distribution & hygiene (DST-01..04) -- 0.0.2 bump, README + CHANGELOG, validate + `--strict`, plugin-validator + skill-reviewer PASS, no verbatim book prose, ASCII-only, work-email absent
- [x] Skill-effectiveness evals (EVL-01, EVL-02) -- trigger recall/specificity + smell->refactoring behavior vs baseline, both PASS (native harness)

### Active

<!-- Current scope. Hypotheses until shipped and validated. -->

Active milestone: **lz-tdd@0.0.3 -- `lz-red` skill (RED phase)** (see Current Milestone above). Requirements are being defined in a fresh `.planning/REQUIREMENTS.md`. Deferred candidates still tracked as backlog: additional plugins, npm packaging/distribution, multi-language example sets beyond TypeScript, outside-in / acceptance / double-loop TDD (deferred out of 0.0.3), and the archived 0.0.2 Future Requirements (FUT-01 full Tidy First? tidyings catalog; FUT-02 multi-language examples; FUT-03 automated refactoring execution / codemods; FUT-04 split the Kerievsky layer into its own skill). Carried-forward tech-debt: add a reverse `lz-tpp -> lz-refactor` pointer on the next lz-tpp edit (the seam is one-directional); when `lz-red` ships, wire the `lz-red -> lz-tpp` seam and a reverse `lz-tpp -> lz-red` pointer.

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Additional plugins beyond `lz-tdd` in 0.0.1 -- start with one plugin, keep structure extensible
- Commands / agents / hooks inside `lz-tdd` for 0.0.1 -- skill-first; add later if a real need appears
- npm packaging/distribution -- git-based marketplace install is sufficient for 0.0.1
- Deep language-specific guides beyond TypeScript examples -- agnostic principles + TS examples cover 0.0.1
- Additional TDD skills under `lz-tdd` (e.g., test naming, triangulation) -- future skills, not 0.0.1
- Outside-in / acceptance / double-loop TDD in `lz-red` (lz-tdd@0.0.3) -- deferred to a later milestone; unit RED first
- DHH's "TDD is dead" / test-induced design damage as an `lz-red` source -- excluded by maintainer decision (hard ban)

## Context

- **Current state (lz-tdd@0.0.2 shipped 2026-07-17):** the `lz-tdd` plugin now ships two dual-mode skills -- `lz-tpp` (green step) and `lz-refactor` (refactor step). lz-refactor bundles five reference catalogs (Fowler 62 refactorings + 24 smells + Ch.2 principles; Kerievsky 27; GoF 23 + 5 extra; Functional 19 idioms) with a unified smell taxonomy, a coach decision procedure, and no-oracle principle backing -- 178 Markdown files, `tsc --strict`-clean TS samples, `claude plugin validate . --strict` clean. All 36 milestone requirements satisfied; audit passed; Nyquist 11/11. Books present under git-ignored `.oracle/` (Fowler 2nd ed, Kerievsky, GoF) were sourced ONLY via the clean-room oracle/oracle-reviewer agents (DST-04). Next: define the post-0.0.2 milestone via `/gsd-new-milestone`.
- **Prior state (lz-tdd@0.0.1 shipped 2026-07-04):** first public release -- marketplace + `lz-tdd` plugin + dual-mode `lz-tpp` skill, ~909 LOC under `plugins/`, MIT-licensed. All 24 requirements satisfied; evals 100%/100% trigger recall/specificity, 29/30 coaching.
- Authoritative sources (from the brief):
  - The Transformation Priority Premise -- https://blog.cleancoder.com/uncle-bob/2013/05/27/TheTransformationPriorityPremise.html
  - Fib. The T-P Premise. -- https://blog.cleancoder.com/uncle-bob/2013/05/27/FibTPP.html
  - Robert C Martin -- The Transformation Priority Premise, NDC 2011 -- https://youtu.be/B93QezwTQpI (video id `B93QezwTQpI`)
- JS/TS tail-call caveat: ES6 proper tail calls are implemented only in JavaScriptCore (Safari); V8 (Node/Chrome) and SpiderMonkey (Firefox) do not optimize tail recursion. Recursion-based transformations therefore need stack-safe alternatives in JS/TS -- trampolines, generators-as-state-machines, Continuation-Passing Style (CPS) -- or a switch to the iterative transformation. The skill must teach this explicitly.
- TPP subject matter: an ordered list of "transformations" (for example `{}->nil`, `nil->constant`, `constant->variable`, `statement->statements`, `unconditional->if`, `...->recursion`, `...->while`) applied simplest-first during TDD. Higher-priority (simpler) transformations are preferred to avoid premature complexity and to escape local maxima where a test forces a large leap.
- Build tooling already installed: `skill-creator` plugin (create/optimize the skill and run evals), `plugin-dev` plugin (scaffold marketplace/plugin, validate structure).
- 0.0.1 research artifacts archived to `.planning/milestones/lz-tdd@0.0.1-research/`: STACK, FEATURES (incl. canonical transformation list), ARCHITECTURE, PITFALLS, SUMMARY, and TPP-TYPESCRIPT.md (verified TCO status + trampoline/generator/CPS patterns + functional-vs-imperative decision guide for TPP-05/TPP-07). Fresh lz-tdd@0.0.3 research lands in `.planning/research/`.
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
| Repo is a marketplace named `lz-engineering-claude-plugins` (plural) | Hosts multiple engineering plugins over time; name matches intent | Good -- shipped lz-tdd@0.0.1; marketplace resolves + validates from the public repo |
| First plugin is `lz-tdd` (TDD-focused) | Groups TDD skills; `lz-tpp` is its first skill | Good -- `lz-tdd` ships with `lz-tpp`; additive layout ready for more TDD skills |
| First skill is `lz-tpp` (`/lz-tdd:lz-tpp`) | TPP is the initial high-value TDD capability | Good -- shipped; evals confirm strong triggering + coaching accuracy |
| Skill is coach + reference | Drives next-transformation choice during TDD and explains the premise on demand | Good -- dual-mode verified: auto-triggers as coach, answers on demand as reference |
| Language-agnostic principles with TypeScript examples (functional + imperative) | Broad applicability, grounded in the user's primary stack; paradigm pairing shows how transformation priority shifts (recursion/expressions vs iteration/assignment), per Martin's language-specificity note | Good -- paired FP/imperative TS examples + Fibonacci walk + TCO guidance shipped, tsc-clean |
| Public GitHub, MIT license | Open-source distribution via `/plugin marketplace add` | Good -- MIT LICENSE + public repo; marketplace-add install loop verified |
| Build via `skill-creator` + `plugin-dev` | Follow first-party authoring workflows and guidelines | Good -- passed plugin-validator + skill-reviewer + `validate --strict` (exit 0) |
| First milestone is version 0.0.1 (pre-1.0) | Signals early/experimental status; `plugin.json` version 0.0.1 | Good -- shipped as 0.0.1; GSD milestone id reconciled to v0.0.1 then plugin-scoped to lz-tdd@0.0.1 at complete-milestone |
| Second skill `lz-refactor` under the same `lz-tdd` plugin (one skill, two reference layers -- not a separate `lz-refactor-to-patterns` skill) | Completes the red-green-refactor loop alongside lz-tpp; keeps TDD skills grouped; avoids premature skill split | Good -- shipped lz-tdd@0.0.2; both skills discoverable and namespaced; split deferred to FUT-04 |
| Clean-room oracle model for copyrighted books in `.oracle/` (oracle/oracle-reviewer agents only; main context never reads book prose; own-words only crosses back) | DST-04 / copyright: ship original prose + code + names + facts, never verbatim source | Good -- Fowler/Kerievsky/GoF catalogs authored + verified this way; no-verbatim hygiene gate GREEN; skill-reviewer PASS |
| Plugin-scoped milestone id (`<plugin>@<semver>`) from the start of 0.0.2 | 0.0.1's late relabel churn (v1.0 -> v0.0.1 -> lz-tdd@0.0.1); the marketplace hosts multiple plugins | Good -- lz-tdd@0.0.2 used the scoped id throughout; no rename sweep at close |
| Skill-level loop-audit forcing-function (SKILL.md AUDIT+DECIDE step), shipped post-Phase-14 | Five prior passive-content probes were null on the output-warrant axis; an active enumeration step reproduced skill-alone recall while staying precise | Pending -- first non-null + safe lever; held-out A/B recall 5/5 vs 0/3 control, 0/5 over-conversions; needs `/reload-plugins` to go live in-session |
| Third skill `lz-red` (`/lz-tdd:lz-red`) under `lz-tdd` for the RED step (lz-tdd@0.0.3) | Completes red-green-refactor alongside lz-tpp (green) + lz-refactor (refactor); keeps TDD skills grouped | Pending |
| `lz-red` testing stance = adaptive auto-detect (match house idiom; route by structural control/seams -> Bernhardt FCIS / Metz Magic-Tricks matrix / Feathers no-seam legacy; "listen to the tests"), not one fixed school | Brownfield cannot assume functional core-imperative shell; Metz's message matrix is design-agnostic; Feathers creates a seam first | Pending |
| `lz-red` source access model: owned books (RCM *Clean Code*; Metz *99 Bottles JS Ed*) + transcribed talks live git-ignored in `.oracle/` clean-room (own-words only, DST-04); unowned books = no-oracle high-confidence core; DHH hard-banned | Copyright hygiene: never commit verbatim copyrighted transcripts/prose; ship own-words synthesis | Pending |
| Verbatim transcripts of copyrighted talks are never committed to this public repo (git-ignored `.oracle/` only) | Open-source copyright hygiene; recorded talks are all-rights-reserved by default | Good -- NDC-2011 TPP transcript removed from HEAD (b79adef), no history rewrite |
| lz-tdd@0.0.3 scope = unit RED only; outside-in / acceptance / double-loop deferred | Keep `lz-red` lz-tpp-sized; avoid premature scope | Pending |

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
*Last updated: 2026-07-18 -- started milestone lz-tdd@0.0.3 (`lz-red` skill, RED phase): added the Current Milestone section, reset Active scope to lz-red, added Out of Scope boundaries (outside-in deferred; DHH banned), and logged Key Decisions (adaptive testing-stance router, source access model, talk-transcript copyright rule + NDC-2011 removal). Previous: 2026-07-17 after shipping lz-tdd@0.0.2 (lz-refactor Skill).*
