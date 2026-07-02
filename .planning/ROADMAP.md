# Roadmap: lz-engineering-claude-plugins

**Milestone:** 0.0.1 (first release, pre-1.0)

## Overview

0.0.1 delivers a public Claude Code marketplace repo (`lz-engineering-claude-plugins`)
that hosts the `lz-tdd` plugin and its first skill, `lz-tpp` (`/lz-tdd:lz-tpp`) -- a
dual-mode TDD coach + reference for Robert C. Martin's Transformation Priority Premise.
The work follows the content-dependency chain: first stand up an installable, validating
manifest hierarchy (scaffold); then lock a correct, cited canonical TPP reference before
authoring behavior on top of it (source distillation); then author the dual-mode skill
with paired functional/imperative TypeScript examples and TCO-safe recursion guidance
(skill authoring); then make the repo publicly shippable -- documented, licensed, and
review-clean (distribution); and finally, as an optional, non-blocking refinement,
empirically tune triggering and coaching accuracy with skill-creator evals.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Marketplace & Plugin Scaffold** - Installable, validating manifest hierarchy + repo-hygiene skeleton
- [ ] **Phase 2: TPP Source Distillation** - Lock the cited, canonical transformation reference before authoring
- [ ] **Phase 3: lz-tpp Skill Authoring** - Dual-mode coach + reference skill with paired TS examples and TCO guidance
- [ ] **Phase 4: Distribution & Hygiene** - README, MIT license, contact, and first-party authoring review
- [ ] **Phase 5: Skill Effectiveness Evals** - Optional-final, non-blocking triggering + coaching eval and tune

## Phase Details

### Phase 1: Marketplace & Plugin Scaffold
**Goal**: A valid Claude Code marketplace repo that installs and validates cleanly, hosting the `lz-tdd` plugin with an extensible layout and a placeholder `lz-tpp` skill.
**Depends on**: Nothing (first phase)
**Requirements**: MKT-01, MKT-02, MKT-03, MKT-04, MKT-05, DIST-04
**Success Criteria** (what must be TRUE):
  1. Running `claude plugin validate .` and the plugin-dev validator reports no errors.
  2. `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` resolves the marketplace and lists `lz-tdd` via its relative `./plugins/lz-tdd` source.
  3. `version: 0.0.1` appears only in `plugin.json` (absent from the marketplace entry), so no version is masked.
  4. A second skill under `lz-tdd` or a second plugin can be added by creating new directories only -- no existing manifest or file needs restructuring.
  5. A `.gitignore` (Node / OS noise) and a valid placeholder `skills/lz-tpp/SKILL.md` (frontmatter present) exist, so the repo commits clean and validates.
**Plans**: 1 plan

Plans:
- [ ] 01-01-PLAN.md - Create the three-level manifest hierarchy (marketplace.json, plugin.json, placeholder SKILL.md) + .gitignore, then gate on `claude plugin validate .` and the plugin-dev validator.

### Phase 2: TPP Source Distillation
**Goal**: A correct, cited, canonical TPP reference locked as the source of truth before any skill behavior is authored on top of it.
**Depends on**: Phase 1 (skill directory must exist to hold `references/`)
**Requirements**: TPP-01, TPP-02, TPP-03, TPP-04
**Success Criteria** (what must be TRUE):
  1. `references/transformations.md` lists the canonical transformation priority list transcribed verbatim-faithfully from the two Clean Code posts, with inline citations.
  2. The reference explicitly resolves the 12-item vs 14-item discrepancy -- adopting the revised FibTPP 14-item list as canonical while documenting the original 12-item list and secondary-source drift for provenance.
  3. The NDC 2011 talk (video id `B93QezwTQpI`) is transcribed with the local `youtube-to-markdown` tool (markitdown fallback), retained as source material, and reconciled against the blog list with any discrepancies noted rather than silently resolved.
  4. The content states the transformations (behavior-changing, green) vs refactorings (behavior-preserving) distinction and frames TPP as a provisional heuristic (carrying the author's own hedges), not rigid law.
**Plans**: 2 plans

Plans:
- [ ] 02-01: Transcribe the NDC 2011 talk via `youtube-to-markdown` (markitdown fallback); retain the transcript as cited source material.
- [ ] 02-02: Distill the cited canonical `references/transformations.md` (14-item FibTPP list, 12-vs-14 resolution, transformations-vs-refactorings, provisional-heuristic framing), reconciled against the transcript.

### Phase 3: lz-tpp Skill Authoring
**Goal**: A working dual-mode skill -- auto-triggering TDD coach plus on-demand reference -- built on the distilled source, with paired TypeScript examples and TCO-safe recursion guidance.
**Depends on**: Phase 2 (faithful source material must exist to author against)
**Requirements**: SKILL-01, SKILL-02, SKILL-03, SKILL-04, SKILL-05, SKILL-06, TPP-05, TPP-06, TPP-07
**Success Criteria** (what must be TRUE):
  1. On a red-green-refactor TDD prompt (a failing test + current code), the skill auto-triggers and recommends a named next transformation by TPP priority, including backtracking / posing a simpler test at an impasse.
  2. Invoking `/lz-tdd:lz-tpp` explicitly returns a reference explanation of the transformations and their priority ordering with rationale.
  3. The skill ships paired functional and imperative TypeScript examples showing how transformation-priority choices shift by paradigm, plus at least one full worked example (e.g. Fibonacci) applied test-by-test in monotonic priority order.
  4. The TS/JS guidance addresses the lack of reliable tail-call optimization and covers stack-safe alternatives (trampoline, generator-as-state-machine, CPS-with-trampoline) and when to prefer the iterative transformation instead.
  5. `SKILL.md` stays lean (well under the ~500-line / ~1.5-2k-word guidance) with a tuned `description` (<= 1024 chars); heavy material lives in bundled `references/`.
**Plans**: 3 plans

Plans:
- [ ] 03-01: Author the lean `SKILL.md` -- tuned `description`, dual-mode frontmatter, coach decision procedure, impasse/backtrack guidance, and reference pointers.
- [ ] 03-02: Build the `references/` catalog (annotated full list) and the worked Fibonacci example applied test-by-test in priority order.
- [ ] 03-03: Author paired functional/imperative TypeScript examples and the TS/JS TCO-alternative guidance (trampoline / generator / CPS + recurse-vs-iterate decision guide).

### Phase 4: Distribution & Hygiene
**Goal**: The repo is publicly shippable -- documented, licensed, contact-correct, and passing first-party authoring review.
**Depends on**: Phase 3 (the skill must exist to document and to pass authoring review)
**Requirements**: DIST-01, DIST-02, DIST-03
**Success Criteria** (what must be TRUE):
  1. `README.md` documents install via `/plugin marketplace add LayZeeDK/lz-engineering-claude-plugins` then `/plugin install lz-tdd@lz-engineering-claude-plugins`, plus what the skill does and how to invoke it.
  2. An MIT `LICENSE` is present, the public contact `larsbrinknielsen@gmail.com` is used, and the work email appears nowhere in the repo.
  3. The skill and manifests pass the plugin-dev plugin-validator and skill-reviewer without significant findings, with all committed output ASCII-only per repo conventions.
**Plans**: 1 plan

Plans:
- [ ] 04-01: Write `README.md` (install + usage) and MIT `LICENSE` with public contact, verify ASCII-only output, then run plugin-validator + skill-reviewer and resolve findings.

### Phase 5: Skill Effectiveness Evals
**Goal**: Empirically validate and tune the skill's triggering accuracy and coaching correctness -- a late, optional refinement that does not gate the public ship.
**Depends on**: Phase 3 (skill must exist to evaluate); runs after Phase 4. Optional-final and non-blocking -- Phases 1-4 do not depend on it.
**Requirements**: EVAL-01, EVAL-02
**Success Criteria** (what must be TRUE):
  1. A skill-creator trigger-eval set (in-scope should-trigger prompts + near-miss should-not-trigger prompts) confirms the `description` fires on TDD / transformation / TPP contexts and stays quiet otherwise.
  2. A skill-creator behavior/effectiveness eval confirms the coach recommends the correct next transformation on sample failing-test scenarios.
  3. Eval findings feed at most a description/behavior tuning pass on the already-shipped skill; earlier phases remain complete regardless of eval outcomes (non-blocking).
**Plans**: 1 plan

Plans:
- [ ] 05-01: Build the skill-creator trigger + behavior eval sets, run held-out scoring, and apply an optional description/behavior tuning pass.

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Marketplace & Plugin Scaffold | 0/1 | Not started | - |
| 2. TPP Source Distillation | 0/2 | Not started | - |
| 3. lz-tpp Skill Authoring | 0/3 | Not started | - |
| 4. Distribution & Hygiene | 0/1 | Not started | - |
| 5. Skill Effectiveness Evals | 0/1 | Not started | - |

---
*Roadmap created: 2026-07-02*
