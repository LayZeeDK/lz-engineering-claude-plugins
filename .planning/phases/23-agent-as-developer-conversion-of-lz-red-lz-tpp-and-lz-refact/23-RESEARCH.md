# Phase 23: Agent-as-developer conversion of lz-red, lz-tpp and lz-refactor, plus the new lz-tdd-coach skill - Research

**Researched:** 2026-11-26
**Domain:** Claude Code plugin skill authoring (SKILL.md behaviour change), the repo's deterministic check battery, and
the Phase 22.1 eval harness as the before/after instrument
**Confidence:** HIGH on the codebase facts (read this session); MEDIUM on Claude Code product mechanics (official docs
read this session through markdown.new, not exercised by a real install); LOW where marked `[ASSUMED]`

<user_constraints>
## User Constraints (from CONTEXT.md)

Copied verbatim from `23-CONTEXT.md` (`## Implementation Decisions`, `### Claude's Discretion`, `<deferred>`).

### Locked Decisions

### Default stance
- **D-01:** Each skill performs its step by default: it edits the code and runs the tests. The QUESTION-vs-COMMAND
  split is removed; a request phrased as a question ("which test next?", "what makes this pass?") gets the step done
  and the reason in one or two sentences. Only a request that explicitly limits the skill to advice ("don't change the
  code", "just suggest") gets the recommendation without edits. Lars approved this option (a) on 2026-11-24 ("D-01,
  what a plain question does: OK") over option (b), where a bare question would get a recommendation plus "say go to apply it". -- **Reversibility:** costly -- the trigger and
  behaviour evals, the Phase 22 routing corpus and the user-scope `test-first.md` workaround all assume the old default.
- **D-02:** The skill never asks permission to edit or run tests inside its own step. It still stops and reports
  instead of acting when the step cannot be done safely: no test runner found, the suite is red before a refactor, a
  red that would need a second behaviour, or a seam needed first (hand off per the existing routing).

### Reference mode (explain on demand)
- **D-03 (SUPERSEDED by Lars 2026-11-24, see D-14):** was "keep reference mode in all three skills for 0.0.3".
- **D-14:** Remove reference mode and the non-command coach mode from lz-red, lz-tpp and lz-refactor. Each keeps only
  the doing mode: it makes the step's changes itself and keeps going through the red, green and refactor steps and
  the next cycles until the goal is met, following the plugin's workflows. Explaining TDD and guiding a human or an
  agent (today's reference mode and non-command coach mode) belongs in the separate `lz-tdd-coach` skill. Lars
  2026-11-24, verbatim: "What I meant was to remove *reference* mode and the non-command *coach* mode from the main
  skills, keep the *coach* mode but using the agent-as-developer/command approach so that an agent using the skill
  makes the red/green/refactor step/changes automatically and keeps progressing between the TDD phases and cycles
  until the goal is met, following the lz-tdd plugin skills' workflows. The *reference* and non-command *coach* mode
  guiding a human or agent in TDD or answering questions about TDD is what I suggested in the separate
  `lz-tdd-coach` skill." -- **Reversibility:** costly -- descriptions, routing surfaces and every eval assume two modes.
  `lz-tdd-coach` ships in THIS phase, built by moving today's reference-mode and non-command coach content out of
  the three skills (Lars 2026-11-24: "When lz-tdd-coach ships: OK", approving Claude's Phase 23 recommendation).
- **D-15:** The doing skills hand off to each other to keep the cycle moving: after its RED line lz-red continues
  into the green step (lz-tpp), after GREEN into the refactor step (lz-refactor), after REFACTOR back to lz-red for
  the next test, until the goal (the request's behaviour, or the test list) is done; each step still ends with its
  D-05 line. The loop stops and reports on the D-02 conditions. Claude's reading of "keeps progressing between the
  TDD phases and cycles until the goal is met".

### Source names (Lars ruling, 2026-11-24)
- **D-16:** Shipped skills and references name no people, conferences, talks, books, articles, podcasts or similar;
  named patterns and named techniques may be named. A shipped `plugins/lz-tdd/ATTRIBUTION.md` names the sources the
  plugin drew on. Lars, verbatim: "Similar to lz-oop, the lz-tdd plugins' skills and references shouldn't mention or
  link to people, conferences, talks, books, articles, podcasts, or similar by name. Only for example named patterns
  should be named in the skills and references. ... keep an plugins/lz-tdd/ATTRIBUTION.md file which is shipped with
  the plugin and names sources used as inspiration for the plugin." lz-oop session's answer (2026-11-24): its
  names A/B was designed (arms ff64c1c / 23dfd28 / 9c7bcc7, 55 cases, k=3) but only the baseline arm ran, so NO
  lz-oop decision on names rests on measurement; its rules are Lars's rulings, and its person-name removal (9c7bcc7)
  is applied but unmeasured. Line (Lars's rule plus lz-oop Claude's reading, inferred): allowed = names of principles,
  rules, refactorings, smells, patterns, and a person-carrying concept name when it is the concept's usual name;
  forbidden = titles of books/talks/articles, chapter numbers, stand-ins ("the book", "the talk"), her/she for an
  author, provenance statements, Sources sections, and quoting or close paraphrase. ATTRIBUTION.md shape: intro, then
  Books (author, italic title, edition, year), Talks/interviews/podcasts (speaker: Title (year)), Articles; a work
  gets its line in the change that first draws on it. Enforcement model: lz-oop `tools/citations.ts` (+ test) reads
  titles from ATTRIBUTION.md and fails on them, chapter citations and stand-ins elsewhere; nothing checks person
  names. Placement: NOT this phase. Lars 2026-11-24: "Where the no-names sweep goes: Before Phase 24's eval port and
  the Phase 22 metered rounds"; Claude's reading: its own phase 23.1, after this one. The new `lz-tdd-coach` is
  written name-free from the start so 23.1 has less to sweep. Person names go too, and the effect is measured on
  the Phase 24 harness (both Lars rulings 2026-11-24, recorded verbatim in ROADMAP Phase 23.1).

### Model guidelines (Lars ruling, 2026-11-24)
- **D-17:** Every skill and reference this phase writes or converts (lz-red, lz-tpp, lz-refactor, the new
  `lz-tdd-coach`) follows the model-specific guidelines for the supported models and the general Claude model
  guidelines in `~/.claude/research/` (for example `claude-models-2026-09-blogs.md`, `prompting-evidence-2026-09.md`,
  `fable-5-2-evidence-2026-11.md`, `skills-and-agents/`) and the user-scope `~/.claude/references/prompting-*.md`.
  Newer sources and newer model generations outrank older ones where they conflict (`prompting-fable-5-1` is
  retired). plugin-dev and skill-creator are consulted for plugin and skill structure, and the dated research
  outranks them where they conflict. Lars, verbatim: "Skills should comply with model-specific guidelines for the
  models that we support and general Claude model guidelines, all in ~/.claude/research/, taking into account that
  sources of newer date and newer model generation outrank earlier sources when they conflict. Also consult the
  plugin-dev and skill-creator plugins for plugin and skill guidelines but the research of recent dates outrank them
  when they conlict." The planning research writes the resulting rule list into RESEARCH.md with each rule's
  source and date, and the phase's skill reviews (D-10) check against it. Phase 23.1's sweep follows the same list.
  Supported models: Opus 5.5 and Sonnet 5.5 only, each covered by the Phase 22.1 evals. Lars 2026-11-24, verbatim:
  "Which models the skills support: Official support (covered by evals) only for Opus 5.5 and Sonnet 5.5". Guidelines
  for other models (Haiku, Fable) do not bind the skills; where a general Claude guideline conflicts with an Opus 5.5
  or Sonnet 5.5 guideline, the model-specific one wins.

### Running tests
- **D-04:** Use the project's own test command (package scripts, runner config); never install dependencies. Red: run
  the new test alone and confirm it fails for the expected reason (an assertion from the code under test; a compile or
  import error is not a red). Green: run the new test, then the tests of the touched module, and report the count.
  Refactor: confirm green before the first refactoring and after each one; stop on red and revert that step.

### Naming line (A2)
- **D-05:** Each step ends with exactly one report line, fixed prefix, grep-able (Lars 2026-11-24: "D-05, the line
  each step ends with: OK"). Phase 24 graders and the later cycle log (A5) match on it:
  - `RED: <test name> -- fails: <one-phrase reason>`
  - `GREEN: <TPP transformation, number and name> -- <test name> passes; <n> tests green` (when the change is not the
    highest-priority transformation that works, add `-- deviation: <reason>`, keeping the existing deviation rule)
  - `REFACTOR: <refactoring name(s), catalog names> -- tests green` or `REFACTOR: none -- <why no smell warrants one>`
  Prose before the line is allowed; the line itself is required and last.

### Descriptions and routing
- **D-06:** Edit the three `description` fields only as far as the conversion needs: remove the coach framing ("use it
  as a coach", "coaches") and say the skill performs the step and explains on demand. Keep every trigger phrase, the
  named-owner enumeration (Phase 22 D-01) and the single axis "the ask" (Phase 22 D-03). No new trigger phrases (A4 is
  0.0.4). Description edits are why Phase 22 Round B (the trigger regression) must run after this phase.
- **D-07:** Rename the headings that say "coach" (`# lz-red: RED-phase TDD coach` and the other two H1s, `## Coach
  decision procedure` -> `## Decision procedure`) and update `routing-parse.mjs`'s heading selectors and every check
  that mirrors them in the same plan, so the Phase 22 routing gate (`check-rgr-routing.mjs`, `selfcheck-routing.mjs`)
  stays GREEN. Keep `## Two modes` as the heading of the do-versus-explain gate.
- **D-08:** Rebuild the Phase 22 placement variant trees (`build-variants.mjs`) from the converted bodies so Round A
  measures what ships; the D-11 frontmatter-identity precondition must still hold. This plan also closes two Phase 22
  review findings (`22-REVIEW.md`; Lars 2026-11-24 "How to fix the review findings: OK"): CR-01 "Variant C cannot be
  built" (re-anchor the lz-tpp transform to the converted text and keep the banned `all prior tests green` phrase out
  of every arm) and WR-06 (selfcheck cannot tell the variant trees are stale). Add a single-axis check over the
  generated variant trees and a staleness check, both in `npm run check`.

### Scripts
- **D-12:** Every script this phase adds, or edits beyond a selector change, meets the user-scope script bar
  (`~/.claude/references/lars-skill-authoring.md`, "Before calling a skill done"): erasable TypeScript run directly by
  Node.js, a `.test.ts` beside it run on Node.js 22 and 24, type-checked, code-reviewed, security-reviewed, through
  `/deslop`, ideally mutation-tested; never a new `.mjs` or `.js`. Lars 2026-11-24: "Make later scripts meet the bar by
  default: OK". A heading-selector update in an existing `.mjs` (D-07) is an edit, not a port.
- **D-13:** Where a skill step is deterministic (finding the test command, running the narrowest proof, emitting the
  D-05 line), consider a bundled script or CLI in the shipped plugin instead of prose. Lars 2026-11-24: "Consider
  scripts and/or a bundled CLI for deterministic steps/tasks. Note that Claude marketplace plugins support
  package.json and install `node_modules` using `npm ci`. Research and verify if in doubt about how this works. This
  means that script/CLI dependencies are allowed in the shipped plugin." Research must verify the install mechanics
  (when `npm ci` runs, lockfile requirement, Windows behaviour, `${CLAUDE_PLUGIN_ROOT}` paths) against the Claude Code
  docs and a real local install before the plan relies on it; shipped scripts meet D-12.

### Evals and checks
- **D-09:** The skill-creator-derived graders that score "Coach, don't drive" (`lz-tpp-workspace/grade-run.mjs`,
  `lz-red-workspace/grade-run.mjs`, lz-refactor's) are NOT edited here: Phase 24 replaces them. Record in the phase
  SUMMARY that they now expect the old behaviour. Every deterministic check (`npm run check` in each workspace,
  `claude plugin validate . --strict`) must end GREEN.
- **D-10:** Every SKILL.md and reference edit gets subagent review before it is accepted, including at least one
  reviewer with a neutral from-scratch brief (repo rule and memory). Code review per AGENTS.md runs after execution.

### Claude's Discretion
- Wording of the do-the-step paragraphs and where each skill's existing COMMAND paragraph is reused.
- Plan split (per skill, or shared clause first then one plan per skill) and wave order.
- Whether lz-refactor's step-5 loop audit wording needs more than the stance change.

### Folded Todos
- **D-11:** "Link the unreachable lz-refactor leaves, add Fowler Sources, fix the stale GoF line"
  (`.planning/todos/pending/2026-11-24-lz-refactor-reachability-fowler-sources-gof-line.md`, auto-folded, match 0.6):
  field-triage C8 (seven catalog leaves unreachable from the smell route), C9 (Fowler catalog lacks a Sources section),
  E1 (`.planning/PROJECT.md:89` contradicts line 214 on GoF). Fits here because the phase already edits lz-refactor
  and re-runs its checks; its own plan, independent of the conversion. Move the todo to `completed/` when it lands.

### Deferred Ideas (OUT OF SCOPE)

- Cycle card / once-per-session calls / smaller bodies (A3), agent-work trigger phrases (A4), cycle log (A5): 999.1.
- `lz-tdd-audit`, `lz-tdd-review`, explain-on-demand home: 999.1 (0.0.4).
- Dropping the "You are the developer" workaround from user-scope `test-first.md` once 0.0.3 ships: Lars's call, user scope.
- Porting the coach-era graders: Phase 24.

Header note in CONTEXT.md (verbatim): "every 'Phase 24' below outside a verbatim quote means the Phase 22.1 harness,
which lands BEFORE this phase. D-09 changes with it: the graders are already replaced when this phase starts, so this
phase keeps the 22.1 suites GREEN instead of leaving coach-era graders alone."
</user_constraints>

<phase_requirements>
## Phase Requirements

ROADMAP Phase 23 says `**Requirements**: TBD` and the tool mapped none. Phases 22 and 22.1 authored their IDs into
REQUIREMENTS.md at plan time from the RESEARCH table (CLS-01..05, EVH-01..12). The IDs below are PROPOSED on the same
precedent (new section "Agent-as-developer (AGD)"); the planner authors them into REQUIREMENTS.md.

| ID (proposed) | Description | Decisions | Research Support |
|----|-------------|-----------|------------------|
| AGD-01 | lz-red, lz-tpp and lz-refactor perform their step by default (edit, then run the tests); an explicitly advice-only request gets the recommendation without edits; the D-02 stop conditions stop and report | D-01, D-02 | Pattern 1, Pitfall 3, Open Question 2 |
| AGD-02 | Tests run with the project's own command, narrowest proof per step, no dependency install | D-04 | Pattern 3, Pitfall 5 |
| AGD-03 | Each step ends with its D-05 report line, last in the reply; formats match the 22.1 grader regexes | D-05 | Pattern 2, Pitfalls 1-2, the skill-contract check |
| AGD-04 | The cycle continues RED -> GREEN -> REFACTOR -> RED until the request's own goal is met, then stops | D-15 | Pattern 4, Pitfall 1 |
| AGD-05 | Reference mode and non-command coach mode leave the three skills; `lz-tdd-coach` ships with that content, name-free | D-14, D-16 (coach only) | Pattern 5, Pitfall 7 |
| AGD-06 | Descriptions lose the coach framing only; H1s and `## Coach decision procedure` renamed; routing gate GREEN | D-06, D-07 | Pitfalls 4, 6; Decision conflicts C1, C2 |
| AGD-07 | Variant trees rebuild from the converted bodies; CR-01 and WR-06 closed; single-axis and staleness checks in `npm run check` | D-08 | Pitfall 8 |
| AGD-08 | Every deterministic check GREEN (`npm run check` x2, `npm --prefix tools/evals run check`, `claude plugin validate . --strict`); new scripts meet the bar | D-09, D-12, D-13 | Validation Architecture, D-13 findings |
| AGD-09 | Folded todo: seven leaves linked from the smell route; PROJECT.md line 89 corrected; Fowler Sources per the conflict ruling | D-11 | Decision conflict C4 |
| AGD-10 | Before/after on the 22.1 harness: an after run set on a packaged copy of this phase's last skill commit, same suites, cases, models and n as `baseline-22.1` | ROADMAP goal | Measurement section, Open Question 1 |
| AGD-11 | Every skill and reference edit reviewed against the D-17 rule list, one reviewer unprimed | D-10, D-17 | D-17 rule list |
| AGD-12 | Docs follow the change: root README, plugin README, plugin.json and marketplace.json descriptions, PROJECT.md core value, REQUIREMENTS.md out-of-scope row | docs-follow-the-change | Runtime State Inventory |
</phase_requirements>

## Project Constraints (from CLAUDE.md and AGENTS.md)

- Public repo: the only email-shaped token allowed in committed content, commit messages and the maintainer's commit
  identity is the public gmail; detect by allowlist inversion; never write a forbidden value, even as a search needle.
- Every executed GSD phase gets `/gsd-code-review 23` before it closes; run order verify -> code review -> secure ->
  validate -> extract learnings; the `gsd-code-reviewer` agent reaches the verdict; merge-blocking findings go through
  `--fix`.
- Claude Code plugin format: skills as `SKILL.md` with YAML frontmatter and progressive disclosure, namespaced
  `/lz-tdd:<skill>`; `skills/` auto-discovered; build with `skill-creator`, validate with `plugin-dev` and
  `claude plugin validate`.
- ASCII only in committed files; bracketed tags in shipped Markdown are code spans; a Contents block only for
  references over 300 lines (project memory rulings).
- Banned-word table from the global CLAUDE.md applies to every file this phase writes, prompts and briefs included.
- Scripts: erasable TypeScript with a `.test.ts` beside it, Node 22 and 24 (D-12); `npm` is the package manager.
- Search with the Grep tool or `rg`, never `grep`; Git Bash on Windows; multi-line content goes through a file.
- Edits to `SKILL.md`, references or agent files need subagent review before acceptance; `gsd-executor` has no Agent
  tool, so reviewer gates in a plan are the orchestrator's, run after the executor returns (project memory).
- Description changes are not live until Lars runs `/reload-plugins` (Claude cannot run it; project memory).
- Never run skill evals without approval, except Phase 22.1-harness runs, which Lars pre-approved once run sets are
  resumable (project memory; ROADMAP 22.1 quote under Open Question 1).

## Summary

The conversion is mostly a text change in three SKILL.md files plus one new skill, but nearly every sentence it touches
is mirrored by a checker. The Phase 22 routing gate parses the `## Two modes` bullets by their labels
(`- Coach mode:` / `- Reference mode:`), requires a `## QUESTION vs COMMAND intent routing` heading in lz-refactor and
a pointer naming it, and keeps an adversarial suite whose anchors are literal sentences from the current intros,
descriptions and gates; a non-matching anchor fails the battery as "BAD TEST" `[VERIFIED: check-rgr-routing.mjs:199-204,
528-533, 849-870; evasions header read via rg]`. The `Coach decision procedure` heading is one constant shared by
all three skills' surfaces, so the heading rename has to land in all three files and every selector in one commit.
Today the batteries are GREEN (`npm run check` in both workspaces, `npm --prefix tools/evals run check`,
`claude plugin validate . --strict`: all exit 0, measured), while `build-variants.mjs` exits 1 on CR-01 and
`selfcheck-routing.mjs` still passes 6/6 over the stale variant-C tree: WR-06 reproduced live (measured this session).

The 22.1 harness already grades the D-05 lines, and its graders constrain the wording more than CONTEXT.md does. The
regexes have no flags, so `$` is the end of the final message: the step's line must be the very last line of the last
reply `[VERIFIED: tools/evals/grade.ts:73,108-111]`. That couples D-15 to the graders: a single-step request
("write the failing test", "make it pass") that loops on into the next step ends with the wrong line and edits files the
`*-untouched` graders forbid. The loop has to be bounded by the request's own goal. The plugin-eval doing suites grant
no Bash on this machine `[VERIFIED: doing-lz-red/suite.json:1-8; doing-lz-red-08/prompt.md:1-7]`, so the skills need an
honest line form for "tests not run", and the planner has to decide whether the REFACTOR grader can ever pass without
a shell.

The 22.1 harness measures before and after. Phase 23's after arm is a new run set with the same cells, cases, models
and n as `baseline-22.1`, plugin staged from this phase's last skill commit. Pilot unit costs put it at about 46 USD
(51 with a 10 percent reserve), the same figure ROADMAP 23.1 budgets for its names arm `[CITED: evals/results/pilot-22.1/FINDINGS.md]`.
CONTEXT.md says "No metered run happens in this phase", but the ROADMAP goal says "Measured before and after" and
the 22.1 rulings pre-approve later rounds, so the planner needs Lars's word on that (Open Question 1).

**Primary recommendation:** Instrument first: a TypeScript skill-contract check in `tools/evals` that ties each SKILL.md's
report-line formats to the committed grader regexes and bans the coach phrases, written so it fails at HEAD. Then one
plan renames the shared headings and selectors across all three skills in one commit. Convert lz-tpp, lz-red and
lz-refactor one after another, because they share the checker files. Then lz-tdd-coach, the variants (D-08), the docs,
and last the paid after run behind a Lars checkpoint. Ship no bundled script in this phase (D-13 findings).

## Architectural Responsibility Map

The "tiers" of a skill plugin, from always loaded to never shipped.

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Deciding which skill fires (doing vs coach) | Skill `description` (always in the listing) | Body `## Two modes` gate | The selector reads descriptions before any body loads; the gate only catches a misfire |
| Doing the step (edit, run, report line) | SKILL.md body (loads on invoke) | -- | Standing instructions; must sit near the top, since compaction re-attaches only the first 5,000 tokens of each skill `[CITED: claude-guidance.md 1.6]` |
| Step procedures (test selection, TPP list, smells, catalogs) | Reference files (read on demand) | SKILL.md pointers | Unchanged by this phase; the coach links to them in place |
| Handoff to the next step (D-15) | SKILL.md prose naming the next skill | -- | "Dependencies between skills are not native; reference other skills by name" `[CITED: claude-guidance.md 1.9]` |
| Explaining and guiding | `lz-tdd-coach` SKILL.md | The three skills' references | New skill; reuses the existing references (one source of truth) |
| Text-to-check coupling | Repo-only check battery (`.claude/skills/*-workspace`, `tools/evals`) | -- | Never shipped; GREEN gates the phase |
| Before/after measurement | 22.1 harness (`tools/evals`, `evals/`) | -- | Paid; runs on packaged copies (`git archive`), never the working tree |
| Installation of shipped code deps | Claude Code plugin cache install | `${CLAUDE_PLUGIN_DATA}` hook install | Only relevant if D-13 adds a script; not recommended here |

## Standard Stack

No library is added. The phase uses what the repo already has.

### Core
| Tool | Version (measured) | Purpose | Why |
|------|---------|---------|-----|
| Claude Code plugin skills | CLI 2.1.327 | The four skills | Project constraint |
| `claude plugin validate . --strict` | 2.1.327 | Structural gate | Exit 0 at HEAD (measured) |
| Node.js `node:test` + TypeScript | Node 26.13.0 default; fnm 22.23.1 and 24.22.0 installed; TS 6.0.3, @types/node 22.20.5 in `tools/evals` | New checks (D-12) | Existing `tools/evals` setup: tsconfig, check script, Stryker config planned by 22.1-08 |
| Workspace batteries | `.claude/skills/lz-red-workspace` and `lz-refactor-workspace` `npm run check` | Routing gate, hygiene, catalogs | Must stay GREEN (D-09); lz-tpp-workspace has no package.json (measured) |
| 22.1 eval harness | `node tools/evals/eval.ts run|aggregate|crosscheck` | After arm | Resumable; stages from `git archive <ref>:plugins/lz-tdd` |

### Supporting
| Tool | Purpose | When |
|------|---------|------|
| StrykerJS 10.1.1 + pinned lz-node-test runner (checkout at a78a56c, measured) | Mutation testing of new TS checks | Orchestrator gate via `lars-mutation-testing` (temporary install, as in 22.1-08) |
| `run-slim.ts` (`~/.claude/references/slim-claude-p/`) | Slim apply runs that need Bash | After arm, apply suites |
| `/claude-api prompt-audit` | Flags instructions written for older models in skills | Optional aid in the D-10 reviews `[CITED: claude-models-2026-09-blogs.md, Opus 5.5 "Prompting and session guidance"]` |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| New TS check inside `tools/evals` | A new `tools/checks/` package | A second package.json, tsconfig and Stryker config for a few checks; `tools/evals` already reads the graders the check needs |
| Re-anchoring evasions entries | Retiring entries whose surface disappears | Retiring changes the CAUGHT/OPEN counts and the `EXPECTED_OPEN` ratchet; allowed, but each retirement needs a recorded reason |

**Installation:** none.

## Package Legitimacy Audit

This phase installs no external package. Stryker 10.1.1 is installed only temporarily by the orchestrator's mutation
gate and was audited OK in 22.1-RESEARCH.md; it is not re-audited here. If the planner chooses a D-13 script with
dependencies against the recommendation below, every such package needs `gsd-tools query package-legitimacy check`
and a `checkpoint:human-verify` before install.

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| (none) | -- | -- | -- | -- | -- | -- |

**Packages removed due to [SLOP] verdict:** none
**Packages flagged as suspicious [SUS]:** none

## Decision conflicts the planner must resolve

These are places where locked decisions written at different times disagree. Each row gives Claude's recommended
reading; rows C1, C3 and C4 touch Lars rulings and should go to him if the planner does not accept the reading.

| # | Conflict | Evidence | Recommendation |
|---|----------|----------|----------------|
| C1 | D-06 says the descriptions should "say the skill performs the step and explains on demand" and "Keep every trigger phrase"; D-14 (later, Lars verbatim) removes explaining from the three skills | lz-tpp's description triggers on "asks what a transformation such as (constant -> scalar) or ({} -> nil) means or why the ordering is what it is" `[VERIFIED: lz-tpp/SKILL.md:9-10]` | Keep every DOING trigger phrase; move the explain triggers into `lz-tdd-coach`'s description; drop "explains on demand" from the three. Trigger regression shows up in the after run and Phase 22 Round B |
| C2 | D-07 keeps `## Two modes`, written when D-03 kept reference mode | The gate check splits the section on `- Reference mode:` `[VERIFIED: check-rgr-routing.mjs:530-532]` | Keep the heading (D-07) with two bullets: the doing bullet (all of the skill's corpus tokens plus a delegation phrase, see Pitfall 4) and an explain bullet that hands explain requests to `lz-tdd-coach`. Update the two label regexes to the new labels in the same commit (a selector change) so the split stays meaningful |
| C3 | D-01's advice-only sentence ("gets the recommendation without edits") vs D-14 "non-command coach mode guiding a human ... is ... `lz-tdd-coach`" | Both 2026-11-24; D-14 is later | Keep the advice-only path as one sentence in each doing skill: the procedure that computes the recommendation is already there, and a hop to another skill costs a second body load. `lz-tdd-coach` covers explaining concepts and teaching a person through the cycle. Needs Lars's confirmation (Open Question 2) |
| C4 | D-11 folds C9 "add a Fowler Sources section"; D-16 lists "Sources sections" as forbidden in shipped references (placement 23.1) | D-16 text above; lz-oop ledger item 6 `[VERIFIED: lz-oop references/lz-tdd-ledger.md:26-27]` | Do not add a Fowler Sources section in Phase 23; record C9 as settled by 23.1's `ATTRIBUTION.md` (same logic CONTEXT applies to writing lz-tdd-coach name-free). Lars's call, because D-11 names the fix |
| C5 | D-09 names coach-era graders (`grade-run.mjs` in lz-tpp and lz-red workspaces) to leave alone | `git ls-files .claude/skills` lists no `grade-run.mjs`, `run_eval`, `grade-red` or `arm-anchor` file; the only tracked runner left is `lz-refactor-workspace/e2e-nx/run-e2e.mjs` (measured) | D-09's "record that they expect the old behaviour" applies to nothing tracked except `e2e-nx/run-e2e.mjs`; the SUMMARY says so. The live graders are the 22.1 suites, which score the doing behaviour |
| C6 | CONTEXT domain "No metered run happens in this phase" vs ROADMAP goal "Measured before and after on the Phase 22.1 harness" | Both quoted under Open Question 1 | Open Question 1 |

## Architecture Patterns

### System Architecture Diagram

```
user / agent request
        |
        v
[skill listing: 4 descriptions] --(explain a concept / teach me)--> lz-tdd-coach --reads--> references of the 3 skills
        |                                                                              (no edits, no test runs)
        | (a move on code, even phrased as a question)
        v
[doing skill body]  step 1 classifies the ask (Phase 22 router, unchanged)
        |-- owned by a sibling --> hand off by name (lz-red / lz-tpp / lz-refactor)
        |-- no loop skill owns it --> branch (e): answer directly
        |-- advice-only ("don't change the code") --> recommendation, no edits, line stays (Open Question 2)
        v
  D-02 preconditions -- fail --> stop and report (no runner, red before refactor, second behaviour, seam first)
        |
        v
  edit (test file for RED, production for GREEN, structure for REFACTOR)
        |
        v
  run narrowest proof with the project's command (D-04)  -- no shell tool --> report "not run" (Pitfall 2)
        |
        v
  report line, last line of the reply (D-05)
        |
        v
  goal met? (the request's own scope) -- yes --> stop
        |
        no (goal is a behaviour or a test list)
        v
  next step: RED -> lz-tpp, GREEN -> lz-refactor, REFACTOR -> lz-red  (D-15)
```

### Recommended Project Structure

```
plugins/lz-tdd/
|-- skills/
|   |-- lz-red/SKILL.md          # converted: doing default, RED line, handoff to lz-tpp
|   |-- lz-tpp/SKILL.md          # converted: doing default, GREEN line, handoff to lz-refactor
|   |-- lz-refactor/SKILL.md     # converted: doing default, REFACTOR line, handoff to lz-red
|   '-- lz-tdd-coach/SKILL.md    # NEW: explain and guide; links into the three skills' references
|-- references/beck-tdd-by-example.md   # unchanged unless a coach phrase lives there
'-- README.md                    # updated
tools/evals/
|-- check-skills.ts              # NEW (name is the planner's): skill-contract gate
'-- check-skills.test.ts
```

Reference files do not move. Leaf-read graders match path tails such as `'references[\\/]+transformations\.md'`
`[VERIFIED: doing-lz-tpp-01/graders/leaf-read.md via cat; apply-lz-tpp leaf-read same pattern]`, and moving a leaf
into the coach would change what the doing arms read.

### Pattern 1: The doing paragraph (replaces "Coach by default; hand off, do not drive")

**What:** One short paragraph per skill, near the top of the body, stating the outcome, the finish line and the stop
conditions. It replaces lz-red's QUESTION/COMMAND paragraph (lines 169-175), lz-tpp's step 8 "Show, don't drive"
(lines 111-113) and lz-refactor's `## QUESTION vs COMMAND intent routing` section (lines 162-171), plus the matching
clause in lz-refactor step 4 (lines 119-121) and step 5's last sentences (lines 152-155) `[VERIFIED: the three SKILL.md
files, read this session]`. Reuse each skill's existing COMMAND sentence as the base (CONTEXT code_context: "the
conversion makes it the default rather than writing new procedure text").

**When to use:** every converted skill.

**Example (PROPOSED wording, `[ASSUMED]`; Claude's discretion):**

```markdown
## Doing the step

You make the change and run the tests yourself, whether the request is phrased as a question or a command:
write the failing test, run it alone, and confirm it fails for the right reason (step 5). Give the reason for the
choice in one or two sentences. Only a request that limits you to advice ("don't change the code", "just suggest")
gets the recommendation without edits. Stop and report instead of acting when no test command can be found, when the
red would need a second behaviour, or when a seam is needed first (hand it to lz-refactor). End with the report line.
```

lz-refactor's version keeps its existing guards (pause before an exported or public-API change whose consumers the local
tests do not cover; characterization tests first on an untested target; do not commit unless asked) `[VERIFIED:
lz-refactor/SKILL.md:123-133, 169-171]`.

### Pattern 2: The report line, defined once per skill and matching the graders

**What:** The D-05 format stated once in the body, as a code span, with one concrete example. The 22.1 graders the
line must pass, read this session:

| Grader | Pattern (verbatim) | Source |
|--------|--------------------|--------|
| RED (doing and apply) | `'RED: [^\n]+ -- fails: [^\n]+\s*$'` | `[VERIFIED: evals/lz-tdd/doing-lz-red/doing-lz-red-08/graders/red-line.md:3]` |
| GREEN (doing, no shell) | `'GREEN: [^\n]+ -- [^\n]+ passes[^\n]*\s*$'` | `[VERIFIED: evals/lz-tdd/doing-lz-tpp/doing-lz-tpp-01/graders/green-line.md:3]` |
| GREEN (apply, slim) | `'GREEN: [^\n]+ -- [^\n]+ passes; \d+ tests green[^\n]*\s*$'` | `[VERIFIED: evals/lz-tdd-apply/apply-lz-tpp/apply-lz-tpp-conjured/graders/green-line.md:3]` |
| REFACTOR (doing and apply) | `'REFACTOR: ([^\n]+ -- tests green\|none -- [^\n]+)\s*$'` | `[VERIFIED: evals/lz-tdd/doing-lz-refactor/doing-lz-refactor-00/graders/refactor-line.md:3]` |

Flags default to `''` (`flags: text('flags') ?? ''`) and the test runs on the final message only
(`new RegExp(def.pattern ?? '', def.flags).test(evidence.lastMessage)`) `[VERIFIED: tools/evals/grade.ts:73,110]`, so
`\s*$` means "the line is the last thing in the reply".

The GREEN line names the transformation by its number and name from the canonical list, which reads, verbatim,
`4. \`(constant -> scalar)\` -- replacing a constant with a variable or an argument` and
`6. \`(unconditional -> if)\` -- splitting the execution path` `[VERIFIED: lz-tpp/references/transformations.md:68,70]`.
Example lines that pass the graders above (the GREEN one is the 22.1 known-pass fixture text):

```text
RED: isPalindrome rejects "ab" -- fails: AssertionError, expected false, received true
GREEN: 6 (unconditional -> if) -- Conjured items lose two quality a day passes; 3 tests green
REFACTOR: Extract Function (x2) -- tests green
REFACTOR: none -- the switch has two cases and no duplication to remove
```

The GREEN example is `evals/fixtures/graders/green-line-slim.json`'s `pass.lastMessage`, read via `cat` this session
`[CITED: green-line-slim.json]`; the other three lines are `[ASSUMED]` examples built to match the verified patterns.

### Pattern 3: Running tests (D-04) as plain single commands

**What:** Run the project's own test command on the narrowest target, as one simple command, and read the runner's own
summary line for the counts the GREEN line reports.
**Why plain commands:** the 22.1 apply suites allow only `Bash(npx vitest:*) Bash(npx tsc:*) Bash(npm test:*) Bash(npm
run:*) Bash(cd:*) Bash(grep:*)` `[VERIFIED: evals/lz-tdd-apply/apply-lz-tpp/suite.json:5]`, and the reproduction
recorded refusals of commands piped into grep, `cd ... && ...` compounds and redirects to files `[CITED:
evals/results/repro-22.1/RESULTS.md, "Apply cells: refused calls"]`. A pipe through `head`/`tail` also cuts the runner
summary the count comes from (user-scope `test-first.md` makes the same point from field transcripts).
**Do not install dependencies** (D-04). This overrides the Sonnet 5.5 default of installing declared dependencies
"unless told not to" `[CITED: prompting-sonnet-5-5.md "Checking the result"]`; the skill text is the "told not to".

### Pattern 4: The goal-scoped loop (D-15)

**What:** After its line, a step continues to the next skill only while the request's goal is not met. Define the goal
from the request:

| Request shape | Goal | Last step and line |
|---------------|------|--------------------|
| "write the failing test", "what test next? add it" | one red test | RED, stop |
| "make this failing test pass" | that test green | GREEN, stop |
| "refactor this", "clean up", a sweep | structure improved, tests green | REFACTOR (sweep: to its fixpoint) |
| "add behaviour X test-first", "implement this test list", "fix this bug test-first" | the behaviour or the list | full cycles; the final reply ends with the last step's line |

**Why:** the baseline cases are single-step on purpose: `doing-lz-red-08` says "I want the red test itself, do not
make it pass" `[VERIFIED: doing-lz-red-08/prompt.md:7]`; `apply-lz-tpp-conjured` says "Make it pass with the smallest
change ... then run the tests" `[VERIFIED: apply-lz-tpp-conjured/prompt.md:5]`; `apply-lz-red-r1` says "What's the next
failing test you'd write ... Go ahead and add it under `test/vitest/`" `[VERIFIED: apply-lz-red-r1/prompt.md:7]`. Their
`production-untouched-*` and `test-untouched-*` graders (`min: 0, max: 0, arm: both`) fail any run that continues into
the next step, and a GREEN-then-REFACTOR reply fails the GREEN regex. This reading is within D-15's own words ("until the
goal (the request's behaviour, or the test list) is done").
**Handoff wording:** name the next skill in prose ("continue with the lz-tpp skill"). Do not add once-per-session call
rules here: that is A3, deferred to 999.1.

### Pattern 5: lz-tdd-coach

**What:** A new skill holding today's reference mode (explain TPP and its ordering, a RED concept, a refactoring,
smell, principle or pattern) and the non-command coaching (walking a person through the cycle who wants to make the
edits themselves). It edits nothing and runs nothing. It links to the existing references in place, with
`${CLAUDE_PLUGIN_ROOT}/skills/<skill>/references/<file>.md` paths, the form lz-red already uses for the plugin-wide
reference `[VERIFIED: lz-red/SKILL.md:191]`; Claude Code substitutes `${CLAUDE_PLUGIN_ROOT}` inline in skill bodies
`[CITED: code.claude.com/docs/en/plugins-reference, Environment variables]`.
**Name-free from the start (D-16):** the moved text loses the person and book names it carries today, for example
"Robert C. Martin's Transformation Priority Premise", "(Bernhardt)", "(Metz + Owen)", "(Feathers)"
`[VERIFIED: lz-tpp/SKILL.md:21; lz-red/SKILL.md:194-199]`; named patterns and techniques stay.
**Description:** explain and teach triggers only (the phrases C1 moves out of the three descriptions); keep it clear of
"what test next", "make this pass", "clean this up", which stay with the doing skills. The name changes to
`tddux-coach` in Phase 23.2 `[VERIFIED: ROADMAP.md Phase 23.2 "Proposed mapping"]`, so keep the literal skill name in
as few files as the checks allow.

**Skeleton (PROPOSED, `[ASSUMED]`):**

```markdown
---
name: lz-tdd-coach
description: >-
  This skill should be used when someone wants test-driven development EXPLAINED or wants to be GUIDED through it
  while they make the changes themselves: what the Transformation Priority Premise is, what a transformation such as
  (constant -> scalar) means or why the list is ordered as it is, what the Three Laws, triangulation or a starter case
  are, what a code smell, refactoring or design pattern is. ... Do NOT use it when the agent should write the
  failing test, make a test pass, or refactor code -- use lz-red, lz-tpp or lz-refactor, which do the step.
---
```

### Anti-Patterns to Avoid

- **Emphasis instead of a reason** ("ALWAYS run the tests"): "If you find yourself writing ALWAYS or NEVER in all
  caps ... that's a yellow flag" `[CITED: claude-guidance.md 2.4]`.
- **A verification ritual** ("verify twice", "double-check"): listed by Anthropic's prompt-reduction guidance as an
  anti-pattern for Opus 5.5 `[CITED: claude-models-2026-09-blogs.md, "Verification rituals"]`. A real check (run the
  test) is not a ritual.
- **Contradictory rules left side by side** (a removed "do not run the suite unprompted" surviving in one step while the
  doing paragraph says run it): measured to change Opus 5.5 behaviour (withheld refunds while asking to confirm)
  `[CITED: claude-models-2026-09-blogs.md, REDUCE]`. The skill-contract check bans the old phrases.
- **Repeating the doing rule in every step:** "Put instructions in one place" `[CITED: claude-guidance.md 2.7]`.
- **Moving reference files into the coach:** breaks the leaf-read graders and makes two copies.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Before/after measurement | A new runner or a comparison harness | `tools/evals/eval.ts` run set with the baseline's cells, cases, models and n | Resumable, model read from CLI output, `crosscheck`, `aggregate` with the With and without section |
| Grader regexes in the skill-contract check | A second copy of the four patterns | Read them from the committed `graders/*.md` through `tools/evals/grade.ts`'s `readGraders` | One source of truth; a grader edit cannot drift from the check |
| Routing-surface parsing | A new parser for the converted headings | `routing-parse.mjs` with updated heading strings | It is the Phase 22 gate; replacing it is a port D-12 would make expensive |
| Variant staleness detection | A timestamp comparison | Rebuild (deterministic, fails closed) or a content hash of the source tree plus the script and `rgr-routing.md` (22-REVIEW WR-06's own fix) | Timestamps change on copy; WR-06 names the hash |
| Plugin dependency install | A custom installer hook | Not needed this phase (see D-13 findings) | Claude Code's own install exists for cached plugins |

## D-13 findings: bundled scripts and plugin `package.json`

Read this session from the official docs through markdown.new; not exercised by a real install. `[CITED:
code.claude.com/docs/en/plugins/loading, "Node.js package dependencies"; plugins/components; plugins-reference]`

- **When it runs:** when Claude Code copies a marketplace plugin into `cache/<marketplace>/<plugin>/<version>/` -- at
  install, at update to a new version, and at session start when an enabled plugin is not cached yet.
- **When it does not run:** for plugins loaded in place: `--plugin-dir`, and "a relative-path plugin loaded in place
  from a marketplace you added from a local path". `claude plugin eval` and slim runs load a staged directory, and the
  repo's local test loop uses `/plugin marketplace add ./`, so none of them would install a script's dependencies
  (inferred from the in-place rule; `plugin eval`'s loading mode is not stated in the docs read `[ASSUMED]`).
- **Requirements:** both `package.json` and a lockfile in the plugin root; `package-lock.json` or
  `npm-shrinkwrap.json` with `lockfileVersion` 2 or 3 (or a text `bun.lock`); registry packages pinned to exact
  versions, `https` downloads, no npm `overrides`.
- **How:** not literally `npm ci`: it runs the lockfile's package manager from the user's PATH in a separate folder,
  with frozen resolution and `--ignore-scripts`, a 60-second timeout, then moves `node_modules` into the plugin. It
  cannot be turned off. A failed install still loads the plugin.
- **Paths:** `${CLAUDE_PLUGIN_ROOT}` is substituted inline in skill Markdown, but "The variables aren't present in the
  environment of commands Claude runs through the Bash tool". A skill runs a bundled script as
  `node "${CLAUDE_PLUGIN_ROOT}/scripts/<x>.ts"` written into the body.
- **Windows:** the docs read say nothing Windows-specific about the install beyond path forms `[no observation]`.

**Recommendation: no bundled script or CLI in this phase.** The deterministic steps D-13 names are small: the test
command is per repo and the model reads `package.json` well, and the report line is text. A shipped script would be
untestable by the 22.1 harness (in-place loads, no Bash in the plugin-eval doing suites). Under D-12 it would also be
erasable `.ts`, which needs Node 22.18 or later on the user's PATH; whether every Claude Code user has a Node runtime
at all is `[ASSUMED]` (the native installer is not known to need one). If the planner adds one anyway: zero
dependencies, a spike plan that installs from a git-hosted marketplace (not a local path) to observe the cache
install, and the D-12 bar.

## Runtime State Inventory

The phase renames headings and changes behaviour; it renames no skill or plugin (Phase 23.2 does).

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None. The plugin keeps no data store; `${CLAUDE_PLUGIN_DATA}` is unused (no hook) | none |
| Live service config | Installed plugin copies in users' `~/.claude/plugins/cache/...`: `plugin.json` pins `"version": "0.0.3"` `[VERIFIED: plugin.json read via cat]`, and a pinned manifest version keeps users on the cached copy until the string changes `[CITED: plugins/loading "How Claude Code computes the version"]` | Version bump is a ship-time call (milestone), not this phase; record it in the SUMMARY |
| OS-registered state | None | none -- verified: the plugin ships no hooks, MCP or LSP servers (file list read) |
| Secrets/env vars | None | none |
| Build artifacts | `variants/out/` trees (gitignored) built from pre-conversion bodies, variant C stale and failing to rebuild (measured); `dist/eval/<sha12>/` staging cache keyed by sha | Rebuild variants in the D-08 plan; staging rebuilds itself per ref |
| Session state | Live sessions keep the old descriptions until `/reload-plugins` | Lars runs it after the description commit (project memory) |
| User-scope workaround | `~/.claude/skills/lars-mode/references/test-first.md` "You are the developer" becomes redundant | Not edited here (deferred, Lars's call) |

## Common Pitfalls

### Pitfall 1: The loop runs past a single-step request
**What goes wrong:** lz-red writes the red test, then continues into lz-tpp and edits production; the reply ends with a
GREEN or REFACTOR line.
**Why:** D-15 read as "always loop".
**How to avoid:** Pattern 4's goal table in each doing paragraph.
**Warning signs:** `production-untouched-*` or `test-untouched-*` failing in the after run; the expected line absent at
the end of the last message.

### Pitfall 2: No shell, dishonest line
**What goes wrong:** in the plugin-eval doing suites (no Bash on this Windows machine `[CITED:
evals/results/tpp-bash-22.1/RESULTS.md]`), the skill cannot run tests, then either claims "passes"/"tests green" anyway
(the top Opus 5.5 failure mode is "asserting unverified inferences as established fact" `[CITED:
prompting-opus-5-5.md]`) or prints no line.
**How to avoid:** define one honest "not run" form per line in the skill text. Proposed (`[ASSUMED]`, checked against
the verified regexes above): `RED: <test> -- fails: not run (no shell tool); expected <reason>` (matches RED);
`GREEN: <n (name)> -- <test> passes once run; not run here (no shell tool)` (matches the doing GREEN regex; it contains
" passes"). REFACTOR has no honest form that matches: the regex requires the line to end in `tests green` or start
`none --`. The planner decides between (a) accept that `refactor-line` in `doing-lz-refactor` scores only runs with a
shell, (b) add a new no-shell refactor case with its own grader in a NEW suite (old suites untouched), or (c) wording
that ends in "tests green" while saying they were not run (not recommended).
**Also:** D-02's "no test runner found" (the project has no test command) is a different case from "this session has
no shell tool"; the skill should still make the edit in the second case and say the run is owed.

### Pitfall 3: "Is this a good test?" under D-01
**What goes wrong:** the doing default makes lz-red rewrite a test the user only asked about, or leaves it a pure
opinion (the old coach behaviour).
**How to avoid:** treat it as the red step's review: give the verdict; when the test has a defect, fix that test and
re-run it (still red for the right reason, or a pin still green). Routing case c3 must still reach lz-red
(`matchTokens` `["good test"]`, measured from `rgr-cases.json`).

### Pitfall 4: The mode-gate admission check goes quiet or red
**What goes wrong:** renaming `- Coach mode:` without updating the split regex makes the whole section count as the
doing bullet, so admission passes on tokens in the explain bullet (a check that cannot fail); removing a corpus token
from the doing bullet turns it red.
**How to avoid:** the doing bullet keeps every token of the skill's own cases and one delegation phrase. Tokens per
case (from `rgr-cases.json`, read via node this session): c1 lz-refactor `["finished","test pass","what now"]`, c2
lz-red `["what test","write next"]`, c3 lz-red `["good test"]`, c4 lz-red `["add a new behavior"]`, c5 lz-refactor
`["test file","tidy"]`, c6 lz-tpp `["failing test pass"]`, c7 lz-refactor `["clean up","no tests"]`, c8 lz-red
`["what test comes next"]`. Delegation phrases (allowlist, fails closed) include `"step 1 classifies the ask"` and
`"step 1 classifies the request"` `[VERIFIED: check-rgr-routing.mjs:510-516 region, read via sed; re-read before
editing]`. Update `/^-\s+Reference mode:/m` and `/^-\s+Coach mode:/m` `[VERIFIED: check-rgr-routing.mjs:531-532]` to
the new labels in the same commit.

### Pitfall 5: The QUESTION/COMMAND anchor assertion
**What goes wrong:** deleting `## QUESTION vs COMMAND intent routing` turns `[cls-03] QUESTION/COMMAND anchor
resolves` red: it requires that heading in lz-refactor and the procedure's prose naming it verbatim
(`const ANCHOR_HEADING = "QUESTION vs COMMAND intent routing";`) `[VERIFIED: check-rgr-routing.mjs:201, 849-870]`.
**How to avoid:** replace the section with the doing section (Pattern 1) under a new heading, point step 4's
de-patterning sentence at it, and change the constant (a selector change). Relabel the check's printed name in the same
commit.

### Pitfall 6: The shared heading constant
**What goes wrong:** renaming `## Coach decision procedure` in one skill only. `ROUTING_SURFACES` uses the heading for
`refactor-step1`, `red-step1` and `tpp-step1` `[VERIFIED: routing-parse.mjs:72,99,126]`; `PROCEDURE_HEADING` and the
contradiction sweep's `sectionBody(text, "Coach decision procedure")` read it for all three skills (read via sed,
lines 203 and 1035).
**How to avoid:** one commit renames the heading in all three SKILL.md files, in `routing-parse.mjs`,
`check-rgr-routing.mjs`, the selftest's fixture strings (`check-rgr-routing.selftest.mjs` lines 84-127, 365, 481-571,
via rg) and every evasions anchor that names it (E6 "Run these steps in order on a coach-mode request."). Battery GREEN
after.

### Pitfall 7: Evasions entries whose anchors disappear
**What goes wrong:** the adversarial suite fails as "BAD TEST" when an anchor no longer matches, and its OPEN count is
ratcheted (`const EXPECTED_OPEN = 8;`), so retiring an OPEN entry also fails until the constant changes (header rules 1
and 8, read via sed/rg).
**Entries whose anchors sit in text this phase will likely change** (from `rg` over the evasions file; re-read each
before editing): E6 (lz-red "coach-mode request"), F1 (lz-refactor "still coach mode"), E5 (lz-refactor "- Coach mode:"
bullet, unclosable), M12 (lz-red Two modes coach bullet), M10 (the QUESTION/COMMAND anchor), F6 (lz-red intro "sibling
skill lz-tpp; restructuring ..."), M8b/M8c (lz-refactor intro), F5 (lz-red procedure lead-in), and any description
anchor the description edit touches (M17, M1 lz-refactor; F2 lz-tpp).
**How to avoid:** a per-entry disposition table in the plan (re-anchor / retire with reason), then
`npm run check:evasions` GREEN with the same CAUGHT/OPEN/CEILING counts or a recorded change.

### Pitfall 8: Variant trees that look fine but are stale
**What goes wrong:** `selfcheck-routing.mjs` passes 6/6 over an old `out/` tree while `build-variants.mjs` exits 1
(measured this session: variant C's lz-tpp `replaceRun` "matched 0 time(s), expected exactly 1").
**How to avoid:** re-anchor `C_POINTER` and the other transform `from` runs to the converted text (string fixtures),
keep `all prior tests green` out of every arm, and make the staleness check impossible to skip: either `npm run check`
rebuilds before checking, or a new TS check compares a recorded source hash (22-REVIEW WR-06's fix). Under D-12, a new
check is `.ts` with a `.test.ts`; logic added to `build-variants.mjs` beyond its anchors is an edit "beyond a selector
change".

### Pitfall 9: Hygiene misses the new skill
**What goes wrong:** `check-hygiene.mjs` scans three hardcoded skill trees plus the plugin-wide README and references
`[VERIFIED: check-hygiene.mjs:24-37]`, so `skills/lz-tdd-coach/` gets no ASCII, email-allowlist or no-verbatim scan.
**How to avoid:** cover it in the same plan that adds the skill, with a path-keyed floor naming
`skills/lz-tdd-coach/SKILL.md`. Adding a target list entry is more than a heading selector; the planner records whether
it treats that as a selector-class edit or meets D-12 by putting the coverage in the new TS check instead.

### Pitfall 10: The after run silently differs from the baseline
**What goes wrong:** edits to a baseline suite's case or grader, a different case subset or n, or a different model
make the comparison meaningless. `casesTree` hashes the whole `evals/lz-tdd` and `evals/lz-tdd-apply` trees at HEAD
(`['evals/lz-tdd', 'evals/lz-tdd-apply'].map(...)`) `[VERIFIED via sed: tools/evals/stage.ts:50-58]` and cases are
staged from HEAD, plugin from the cell ref (eval.ts header).
**How to avoid:** copy `baseline-22.1/run-set.json`'s cells, suites, `cases` lists and models; change only the `ref`;
add any new suite (coach trigger, loop case) as an extra entry. Never edit a baseline suite in this phase.

## Code Examples

### Skill-contract check (sketch for the planner; `[ASSUMED]` names, verified inputs)

```typescript
// tools/evals/check-skills.ts -- repository-only; reads the shipped skills and the committed graders.
import { readFileSync } from 'node:fs';
import { readGraders } from './grade.ts';

const skills = ['lz-red', 'lz-tpp', 'lz-refactor'] as const;
const banned = ['coach, don\'t drive', 'Show, don\'t drive', 'do not run the suite unprompted', 'QUESTION vs COMMAND', 'Reference mode:'];
// For each skill: no banned phrase; the body states its line prefix ("RED: ", "GREEN: ", "REFACTOR: ");
// each fenced example line in the body passes the matching committed grader read with readGraders(<case dir>),
// e.g. evals/lz-tdd/doing-lz-red/doing-lz-red-08 for red-line. Also: skills/lz-tdd-coach/SKILL.md exists with
// name and description, and every description is at most 1536 characters.
```

The banned phrases are quoted from the current files: "coach, don't drive" `[VERIFIED: lz-tpp/SKILL.md:113]`,
"Show, don't drive" `[VERIFIED: lz-tpp/SKILL.md:111]`, "do not run the suite unprompted" `[VERIFIED: lz-red/SKILL.md:124]`,
"QUESTION vs COMMAND" `[VERIFIED: lz-refactor/SKILL.md:120,162]`, "Reference mode:" `[VERIFIED: all three ## Two modes
sections]`. Assert it RED at HEAD first (instrument-first, Phase 22 precedent).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Coach by default; drive only on a command | Do the step by default; advice only when asked (D-01) | This phase | Every eval and router assumed two modes |
| Reference mode inside each skill | `lz-tdd-coach` | This phase (D-14) | Explain triggers move between descriptions |
| skill-creator `run_eval` graders scoring "coach, don't drive" | 22.1 harness graders scoring the doing behaviour | 22.1 (retired 22.1-07) | Baseline expected low on the line graders; the after run is the first measured "doing" number |
| "Think carefully", emphasis, verification rituals in prompts | Outcome, finish line, stop conditions, a real check | Claude 5 generation (2026-07 / 2026-09 sources) | Applies to every paragraph this phase writes |

**Deprecated/outdated:** `prompting-fable-5-1` (retired 2026-11-13, D-17); REQUIREMENTS.md out-of-scope row "Auto-editing
the developer's tests and running the suite unprompted | Breaks the coach-don't-drive contract" (line 193, via rg) is
reversed by this phase.

## D-17 rule list (for writing and for the D-10 reviews)

Supported models: Opus 5.5 and Sonnet 5.5 (D-17). Newer sources win; model-specific beats general; plugin-dev and
skill-creator lose to dated research.

| # | Rule | Source (date) | Applies to |
|---|------|---------------|-----------|
| R1 | State the outcome, the finish line and when to stop and report; do not script steps that are not deterministic checks | `prompting-opus-5-5.md` "Asking" (sources 2026-09-22/29); `claude-guidance.md` 2.1 (2026-10-10) | Doing paragraphs, loop rule |
| R2 | Give the model a real check to run and require evidence, not an assertion; when no check can run, say which and why | `prompting-sonnet-5-5.md` "Checking the result" (2026-09-28/29); `claude-models-2026-09-blogs.md` Opus 5.5 "a way to check its work" | D-04, D-05, Pitfall 2 |
| R3 | Report lines carry measured facts only (counts from the runner output) | Opus 5.5 system card failure mode "asserting unverified inferences as established fact", via `prompting-evidence-2026-09.md` (2026-09-29) | GREEN/REFACTOR lines |
| R4 | Be specific for Sonnet: the spec plus the check; name scope limits ("don't add tests, docs or refactors that weren't asked for") | `prompting-sonnet-5-5.md` "Asking" (2026-09) | lz-tpp, lz-refactor doing text |
| R5 | No "think carefully", "step by step", "be thorough"; effort is the dial | `claude-guidance.md` 2.8; Opus 5.5 playbook 2026-09-22 | All text |
| R6 | A reason instead of capitals or emphasis; one short clause of why per non-obvious rule | `claude-guidance.md` 2.4 (inferred reconciliation, 2026-10-10) | All text |
| R7 | Positive target first; a prohibition only as a guardrail, paired with the target | `claude-guidance.md` 2.5; `lars-skill-authoring.md` (2026-10-26) | Doing paragraphs |
| R8 | No contradictory rules; remove the old coach sentences rather than overriding them | `claude-models-2026-09-blogs.md` REDUCE (measured harm on Opus 5.5) | Conversion of all three |
| R9 | Each instruction once; no repetition across steps | `claude-guidance.md` 2.7 (new-rules 2026-07-24) | Doing rule stated once per skill |
| R10 | Don't state what both models do unprompted; settle by a no-op check | `claude-guidance.md` 2.3; `lars-skill-authoring.md` "Against the default" | Review lens |
| R11 | Examples few and canonical, for output shape (one example report line) | `claude-guidance.md` 2.6 | D-05 lines |
| R12 | Description = trigger condition, key use first, at most 1,536 chars with exclusions before the cut | `claude-guidance.md` 1.3 (docs/skills, 2026-10-09); project memory on the char window | Four descriptions |
| R13 | Most important instructions near the top of the body (compaction re-attaches the first 5,000 tokens) | `claude-guidance.md` 1.6 | Placement of the doing paragraph |
| R14 | Body under 500 lines; references named with when to read each | `claude-guidance.md` 1.5 | lz-tdd-coach |
| R15 | Skills reference each other by name in prose; there is no dependency mechanism | `claude-guidance.md` 1.9 | D-15 handoffs |
| R16 | Write for both Opus 5.5 and Sonnet 5.5; run the no-op check | `lars-skill-authoring.md` (Lars 2026-10-26: "Support both Opus 5.5 and Sonnet 5.5.") | Review lens |
| R17 | Description voice: keep the existing "This skill should be used ..." form for consistency; no Claude-5-era source rules on voice | `claude-guidance.md` 1.3 "Open" (plugin-dev 2025-11 is older) | Four descriptions |
| R18 | ASCII, code-span tags, banned words, no names in new text (D-16 for the coach; recommended for new paragraphs in the other three too) | Project memory rulings 2026-11-07; D-16 | All text |

Not binding: Fable 5.2 and Haiku 5.5 guidance (D-17); skill-creator's "pushy" description advice (2026-02, no
Claude-5-era repeat).

## Measurement (the before/after)

- **Before:** `evals/results/baseline-22.1/` (Plan 22.1-08, running in another worktree; not yet in this tree --
  `ls evals/results` shows only pilot, repro, tpp-bash and tpp-turns). Its plan: trigger first k fire and k quiet
  `baseline` cases per skill (FINDINGS.md: "baseline trigger cases per skill: 10"), all 9 routing cases, one case per
  doing suite (`doing-lz-red-08`, `doing-lz-tpp-01`, `doing-lz-refactor-00`) plus invoke twins, one case per apply suite
  plus twins and no-plugin cells, srvx last; Sonnet n=5, Opus n=3, Opus recheck to n=5 `[CITED: 22.1-08-PLAN.md]`.
- **After:** a new run set (for example `evals/results/after-23/`) whose `run-set.json` copies the baseline's cells,
  suites, `cases` and models with `ref` set to this phase's last skill commit. The no-plugin cells and the doing
  suites' `without` side do not depend on the plugin; the slim no-plugin cells can be left out. `ablation` is read
  per suite from `suite.json`, not per cell (`ablation` appears only in `cases.ts` and `plugin-eval.ts`, measured with
  rg), so the doing suites' without arm runs again unless the harness gains a cell-level override (D-12 code).
- **Projected cost** at pilot means `[CITED: FINDINGS.md "n recheck"]`: trigger 30 x 0.5826 = 17.48, routing 9 x
  0.5826 = 5.24, doing 3 x 1.9743 = 5.92, GildedRose apply natural and twin 6 x 1.4381 = 8.63, srvx natural and twin
  2 x 4.5875 = 9.18; sum 46.45, 51.10 with 10 percent. Replace with the baseline's measured spend once its RESULTS.md
  lands. ROADMAP 23.1 budgets "One new arm, with srvx at about $51" and reuses Phase 23's after measurement as its names
  arm "when nothing in the shipped text changes between it and this phase's start".
- **Comparison:** `aggregate` compares with/without within a run set and recorded cells by Wilson interval; it has no
  before/after-across-run-sets section (read: `aggregate.ts` imports and `## Recorded cells` rendering). Options: enter
  the baseline's k/n as `record` entries (the existing "inside/outside" check, which tests for no change, not
  improvement), or write the comparison table from both RESULTS.md files. A new aggregate section is D-12 code.
- **Gaps the baseline cannot show:** the loop (no baseline case runs a multi-step goal), lz-tdd-coach triggering, and
  whether the coach steals the doing skills' question-shaped fire cases (trigger graders only check the three doing
  skills; for example `trigger-lz-red-01` is "before i add a test to this repo, how do i figure out the testing
  conventions the team already follows?"). New suites can cover them in the after run only, with a no-plugin cell for
  the loop case so it has a with/without verdict.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | All proposed SKILL.md wording, bullet labels, section names and the coach description | Patterns 1, 5 | Review cost only; checks catch selector breaks |
| A2 | The "not run" line forms in Pitfall 2 | Pitfalls | A line form Lars or the reviewers reject; grader scores differ |
| A3 | `claude plugin eval` loads the staged plugin in place, so a dependency install would not run | D-13 | Only matters if a script ships |
| A4 | Not every Claude Code user has Node 22.18+ on PATH | D-13 | Only matters if a script ships |
| A5 | Example RED/REFACTOR lines | Pattern 2 | None; they are built to match the verified regexes |
| A6 | Names `check-skills.ts`, `after-23` | Code Examples, Measurement | None |
| A7 | Evasion entry list in Pitfall 7 is complete | Pitfall 7 | Missed entries surface as BAD TEST on the first battery run |

## Open Questions

1. **Does Phase 23 run its paid after arm?**
   - What we know: CONTEXT domain, verbatim: "No metered run happens in this phase." ROADMAP Phase 23 goal, verbatim:
     "Measured before and after on the Phase 22.1 harness." ROADMAP 22.1, verbatim: "Until resumability is built and
     shown working on a dry run, no paid run starts; after that, the baseline and the later rounds run without a
     separate go-ahead." ROADMAP 23.1 relies on "Phase 23's after-measurement".
   - What's unclear: whether the CONTEXT line (written when the harness came after Phase 23) still holds.
   - Recommendation: plan the after run as the last plan, behind a `checkpoint:human-verify` that shows the projected
     cost and Lars's quotes above; a budget check per stage as in 22.1-08.
2. **Advice-only requests: doing skill or coach?** (conflict C3). Recommendation: one sentence in each doing skill.
3. **REFACTOR line without a shell** (Pitfall 2 options a/b/c). Recommendation: (a) for the baseline comparison, plus
   (b) only if Lars wants the no-shell refactor case scored.
4. **Fowler Sources (C4).** Recommendation: leave to 23.1's ATTRIBUTION.md.
5. **New suites in the after run** (coach trigger, loop case): each adds about 4-6 USD at pilot means. Recommendation:
   add both; they measure two ROADMAP goal clauses the baseline cannot.
6. **Hand-over from 22.1-07:** stale comments that name retired scripts, and `grade-routing.mjs` whose judge step has no
   merger ("Phase 23 owns grade-routing") `[CITED: 22.1-07-SUMMARY.md:62-71]`. Recommendation: fold the comment clean-up
   into the selector plan only where the same files are touched; leave `grade-routing.mjs` to the check-battery move.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Claude Code CLI | validate, plugin eval, slim runs | yes | 2.1.327 | -- |
| Node.js | checks, harness | yes | 26.13.0 default; fnm 22.23.1, 24.22.0 | -- |
| npm | workspace checks | yes | 12.2.0 | -- |
| git | staging (`git archive`) | yes | 2.54.0.windows.1 | -- |
| lz-node-test checkout (Stryker runner) | mutation gate | yes | a78a56c | -- |
| StrykerJS | mutation gate | no (by design) | -- | temporary install by `lars-mutation-testing` |
| `run-slim.ts` | slim apply runs | yes | -- | -- |
| OS sandbox for Bash under `claude plugin eval` | doing suites that run tests | no (Windows refuses Bash grants) | -- | slim `claude -p` |

**Missing dependencies with no fallback:** none. **With fallback:** Stryker (temporary install), Bash under plugin eval
(slim).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | `node:test` + `tsc` (tools/evals); Node `.mjs` selftests and gates (workspaces); `claude plugin validate` |
| Config file | `tools/evals/package.json` `scripts.check`, `tools/evals/tsconfig.json`; workspace `package.json` `check` scripts |
| Quick run command | `npm --prefix .claude/skills/lz-red-workspace run check` (routing gate; seconds) and `npm --prefix .claude/skills/lz-refactor-workspace run check` |
| Full suite command | both workspace checks, `npm --prefix tools/evals run check` (about 116 s measured), `claude plugin validate . --strict`, `node .claude/skills/lz-red-workspace/variants/build-variants.mjs`, `node .claude/skills/lz-red-workspace/selfcheck-routing.mjs` |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AGD-01 | Doing default, coach phrases gone | static | skill-contract check | no, Wave 0 |
| AGD-01 | Doing behaviour in a session | eval (paid) | after run, doing suites `edited-*`, `wrote-test` | yes (22.1 suites) |
| AGD-02 | Tests run | eval (paid) | after run, apply suites `ran-tests` | yes |
| AGD-03 | Line format matches graders | static | skill-contract check (examples against committed graders) | no, Wave 0 |
| AGD-03 | Line emitted last | eval (paid) | `red-line`, `green-line`, `refactor-line` | yes |
| AGD-04 | Single-step requests stop | eval (paid) | `*-untouched-*` graders | yes |
| AGD-04 | Multi-step goal loops | eval (paid) | new loop case (slim) | no, optional |
| AGD-05 | lz-tdd-coach exists, valid, hygiene-covered | static | skill-contract check; `claude plugin validate . --strict`; hygiene | partly, Wave 0 |
| AGD-05 | Coach triggers on explain, not on doing | eval (paid) | new `trigger-lz-tdd-coach` suite | no, optional |
| AGD-06 | Routing gate GREEN after renames | static | `npm --prefix .claude/skills/lz-red-workspace run check` | yes |
| AGD-06 | Trigger regression | eval (paid) | after run trigger suites; Phase 22 Round B later | yes |
| AGD-07 | Variants build; single-axis; staleness | static | `build-variants.mjs` exit 0; new TS checks in `npm run check` | no, Wave 0 |
| AGD-08 | All batteries GREEN | static | full suite command | yes |
| AGD-09 | Seven leaves reachable | static | a link check (seven named leaves linked from a smell leaf) | no |
| AGD-10 | Before/after numbers | eval (paid) | `node tools/evals/eval.ts run|aggregate|crosscheck evals/results/<after>` | harness yes |
| AGD-11 | Reviews | manual (agents) | D-10 reviewer gates by the orchestrator | -- |
| AGD-12 | Docs updated | static | `rg -n -i "coaches|coach mode|reference mode" README.md plugins/lz-tdd` prints nothing outside lz-tdd-coach | -- |

### Sampling Rate
- **Per task commit:** the workspace battery the commit touches, plus the skill-contract check once it exists.
- **Per wave merge:** the full suite command.
- **Phase gate:** full suite GREEN, then the paid after run (if approved), before `/gsd-verify-work`.

### Wave 0 Gaps
- [ ] `tools/evals/check-skills.ts` + `.test.ts`: banned coach phrases, line formats against committed graders,
  coach skill present, description caps (AGD-01, 03, 05); asserted RED at HEAD.
- [ ] Hygiene coverage for `skills/lz-tdd-coach/` (AGD-05).
- [ ] Variant single-axis and staleness checks (AGD-07, D-08).
- [ ] Leaf-reachability check for the seven named leaves (AGD-09), or a one-time measured `rg` in the plan.
- [ ] Optional new eval suites: `trigger-lz-tdd-coach`, one slim loop case (AGD-04, 05).

## Security Domain

`security_enforcement` is absent from `.planning/config.json`, so it is enabled.

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | -- |
| V3 Session Management | no | -- |
| V4 Access Control | yes, indirectly | The skills now run commands; they rely on Claude Code permissions and the user's allow rules; the text asks for the project's own test command only |
| V5 Input Validation | yes | New TS checks parse Markdown and grader frontmatter from the repo: reuse `grade.ts` parsing and `guards.ts`; fail closed |
| V6 Cryptography | no | -- |
| V14 Configuration | yes | Public-repo hygiene scans over new files; no secrets |

### Known Threat Patterns

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Prompt injection from repo files steering an agent that now runs commands by default | Tampering / Elevation | Run only the project's declared test command; never install dependencies (D-04); Claude Code permission prompts and allow rules stay in force; stop on D-02 conditions |
| Supply chain through an auto-install | Tampering | No dependency install (D-04); no shipped `package.json` (D-13 recommendation) |
| Unreviewed change to working code | Tampering | Behaviour-preserving steps with tests green after each; revert on red (D-04); no commit unless asked (existing lz-refactor rule) |
| Maintainer identity or employer address leak in new committed text | Information disclosure | Allowlist-inversion scan before commit (AGENTS.md); `check-hygiene` covering the new skill |
| Paid run exceeding budget | Denial of service | Staged budget checks as in 22.1-08; Lars checkpoint before the after run |

## Sources

### Primary (HIGH confidence, read this session)
- The three SKILL.md files; `23-CONTEXT.md`; `22.1-CONTEXT.md`; `22.1-08-PLAN.md`; `22.1-07-SUMMARY.md` lines 45-93.
- 22.1 graders and cases: `doing-lz-red-08` (prompt, suite, red-line), `doing-lz-tpp-01` green-line,
  `doing-lz-refactor-00` refactor-line, `apply-lz-tpp` suite and prompt, `apply-lz-tpp-conjured` green-line,
  `apply-lz-red-r1` prompt.
- `tools/evals/grade.ts:60-119`; `routing-parse.mjs:40-155`; `check-rgr-routing.mjs:198-204, 528-533, 845-872`;
  `check-hygiene.mjs:20-49`; `lz-tpp/references/transformations.md:59-79`; lz-oop `references/lz-tdd-ledger.md:11-32`.
- Measured runs: both workspace `npm run check` (exit 0), `npm --prefix tools/evals run check` (exit 0, 182 cases,
  101 graders), `claude plugin validate . --strict` (exit 0), `build-variants.mjs` (exit 1, CR-01), `selfcheck-routing.mjs`
  (exit 0 over stale trees).
- `evals/results/pilot-22.1/FINDINGS.md`, `repro-22.1/RESULTS.md`, `tpp-turns-22.1/RESULTS.md`, `tpp-bash-22.1/RESULTS.md`.
- User-scope: `prompting-opus-5-5.md`, `prompting-sonnet-5-5.md`, `prompting-evidence-2026-09.md`,
  `lars-skill-authoring.md`, `research/skills-and-agents/synthesis/claude-guidance.md` (lines 1-293),
  `research/claude-models-2026-09-blogs.md` (lines 126-235), `skills/lars-mode/references/test-first.md`.

### Secondary (MEDIUM, official docs via markdown.new, 2026-11-26)
- code.claude.com/docs/en/plugins-reference (Environment variables), plugins/loading (Node.js package dependencies;
  in-place and copied plugins; versions), plugins/components (path variables, SessionStart install example),
  plugins/dependencies.

### Tertiary (LOW)
- Values read through `cat`, `sed` or `rg` rather than the Read tool are cited with that note (evasions anchors,
  `rgr-cases.json` tokens, delegation phrase lines, `stage.ts:50-58`, selftest line numbers); re-read before editing.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- nothing new; versions measured.
- Architecture and coupling: HIGH -- checker code read, batteries run.
- Pitfalls: HIGH for 1, 2, 4-10 (grounded in read code and measured runs); MEDIUM for 3 (a design reading).
- D-13 mechanics: MEDIUM -- docs only, no real install.
- Measurement cost: MEDIUM -- pilot means; the baseline's measured spend will replace them.

**Research date:** 2026-11-26
**Valid until:** the baseline-22.1 RESULTS.md lands (cost figures), or any edit to the checker files or 22.1 suites.
