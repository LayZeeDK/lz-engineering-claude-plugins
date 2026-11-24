# Phase 23: Agent-as-developer conversion of lz-red, lz-tpp and lz-refactor - Context

**Gathered:** 2026-11-24 (`--analyze --auto`: every decision below is the recommended option, chosen by Claude; trade-offs in 23-DISCUSSION-LOG.md)
**Status:** Ready for planning (D-01, D-05, D-14 placement and D-16 placement settled by Lars on 2026-11-24; the
person-name question belongs to phase 23.1)

<domain>
## Phase Boundary

The three shipped skills stop coaching and start doing. When an agent is doing the work, lz-red writes the next
failing test and runs it, lz-tpp makes the green change and runs the tests, and lz-refactor applies the refactoring and
runs the tests. Each ends its step with one line naming what it did. Coach mode ("coach, don't drive", "do not run the
suite unprompted", QUESTION-vs-COMMAND gating) is removed from all three, and so is reference mode; explaining and
guiding move to a new `lz-tdd-coach` skill in this phase (D-14). Field-triage themes A1 and A2.

Not in this phase: the source-name sweep (phase 23.1, D-16), the new `lz-tdd-audit` / `lz-tdd-review` skills, the once-per-session cycle card
and smaller SKILL.md bodies (A3), new trigger phrases for an agent's own work (A4), the cycle log (A5) -- all
backlog 999.1. No metered run happens in this phase.

</domain>

<decisions>
## Implementation Decisions

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

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Scope and evidence
- `.planning/research/lz-tdd-field-triage-2026-11-24.md` -- themes A1, A2 (this phase), A3-A5 (deferred), C8, C9, E1 (folded); the rules-adoption table ("You are the developer" adopted)
- `.planning/ROADMAP.md` -- Phase 23 goal and rulings; Phase 24 and backlog 999.1 boundaries
- `.planning/todos/pending/2026-11-24-lz-refactor-reachability-fowler-sources-gof-line.md` -- folded todo

### Constraints carried from Phase 22
- `.planning/phases/22-three-way-classifier-correctness-lz-refactor-lz-red/22-CONTEXT.md` -- D-01 named-owner enumeration, D-03 single axis, D-06 descriptions in scope, D-11 frontmatter identity, D-14 metered rounds gated
- `.planning/phases/22-three-way-classifier-correctness-lz-refactor-lz-red/22-VERIFICATION.md` -- SC8 override; the owed Round A and Round B

### The skills
- `plugins/lz-tdd/skills/lz-red/SKILL.md` -- "Two modes", "Coach decision procedure", the QUESTION/COMMAND paragraph near line 169
- `plugins/lz-tdd/skills/lz-tpp/SKILL.md` -- "Two modes", step 113 "coach, don't drive"
- `plugins/lz-tdd/skills/lz-refactor/SKILL.md` -- "Two modes", "QUESTION vs COMMAND intent routing" near line 162, step 5 loop audit, step 6 reference router

### Rules
- `AGENTS.md` -- public-repo hygiene; GSD code review required
- `~/.claude/skills/lars-mode/references/test-first.md` -- "You are the developer" (the user-scope workaround this phase makes unnecessary; not edited here)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- Each SKILL.md already has a COMMAND path (write the failing test for me / apply the refactoring); the conversion
  makes it the default rather than writing new procedure text.
- `.claude/skills/lz-red-workspace/tools/lib/routing-parse.mjs` parses the routing surfaces by heading
  (`Coach decision procedure`, `Two modes`, lines ~72-135); `check-rgr-routing.mjs` and `selfcheck-routing.mjs` read it.
- `.claude/skills/lz-red-workspace/build-variants.mjs` builds the Round A placement variants.

### Established Patterns
- Checker selectors mirror SKILL.md text exactly; a prose edit can silently break them (memory: humanize drift broke
  12 checker tokens). Re-run every workspace's `npm run check` after each edit.
- Bracketed tags in shipped Markdown are code spans; TOC only for references over 300 lines; ASCII in committed files.

### Integration Points
- `plugins/lz-tdd/README.md` and the plugin description describe "coach" behaviour; update them with the skills
  (docs follow the change).
- `.planning/PROJECT.md` core value wording mentions coaching.

</code_context>

<specifics>
## Specific Ideas

- Lars 2026-11-24: "I'm okay with converting the lz-tdd plugin to an agent-as-developer plugin and instead of coach
  mode have `/lz-tdd:lz-tdd-audit` and `/lz-tdd:lz-tdd-review` skills similar to the lz-oop plugin."
- Lars 2026-11-24: "Agent-as-developer clause and command naming line (themes A1 and A2): Ship in 0.0.3".
- Field evidence: all four ledgers had to phrase every call as a command to get the step done; under a command lz-tpp
  named the transformation in only 2 of 10 calls.

</specifics>

<deferred>
## Deferred Ideas

- Cycle card / once-per-session calls / smaller bodies (A3), agent-work trigger phrases (A4), cycle log (A5): 999.1.
- `lz-tdd-audit`, `lz-tdd-review`, explain-on-demand home: 999.1 (0.0.4).
- Dropping the "You are the developer" workaround from user-scope `test-first.md` once 0.0.3 ships: Lars's call, user scope.
- Porting the coach-era graders: Phase 24.

</deferred>

---

*Phase: 23-agent-as-developer-conversion-of-lz-red-lz-tpp-and-lz-refactor*
*Context gathered: 2026-11-24*
