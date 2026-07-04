# Roadmap: lz-engineering-claude-plugins

## Milestones

- [SHIPPED] **lz-tdd@0.0.1 First Release** -- Phases 1-5 (shipped 2026-07-04)
- [ ] **lz-tdd@0.0.2 lz-refactor Skill (Fowler + Kerievsky)** -- Phases 6-11 (active)

## Phases

<details>
<summary>[SHIPPED] lz-tdd@0.0.1 First Release (Phases 1-5) -- 2026-07-04</summary>

- [x] Phase 1: Marketplace & Plugin Scaffold (1/1 plans) -- completed 2026-07-02
- [x] Phase 2: TPP Source Distillation (2/2 plans) -- completed 2026-07-02
- [x] Phase 3: lz-tpp Skill Authoring (3/3 plans) -- completed 2026-07-02
- [x] Phase 4: Distribution & Hygiene (1/1 plan) -- completed 2026-07-02
- [x] Phase 5: Skill Effectiveness Evals (4/4 plans) -- completed 2026-07-03

Full phase detail archived at `.planning/milestones/lz-tdd@0.0.1-ROADMAP.md`
(requirements at `.planning/milestones/lz-tdd@0.0.1-REQUIREMENTS.md`, audit at
`.planning/milestones/lz-tdd@0.0.1-MILESTONE-AUDIT.md`).

</details>

### lz-tdd@0.0.2 lz-refactor Skill (Fowler + Kerievsky)

This milestone adds a single `/lz-tdd:lz-refactor` dual-mode coach + reference that
operationalizes Martin Fowler's *Refactoring* (2nd ed) and Joshua Kerievsky's
*Refactoring to Patterns*, completing the red-green-refactor seam alongside `lz-tpp`
(lz-tpp drives the green step; lz-refactor drives the refactor step). It mirrors
0.0.1's shape and follows the content-dependency chain: stand up the skill router and
progressive-disclosure structure; distill and author the Fowler catalog (the smell
taxonomy and mechanical primitives the rest builds on); distill and author the
Kerievsky catalog (which composes named Fowler primitives, so it comes after Fowler);
wire the dual-mode coach behavior on top of both catalogs plus the no-oracle
principle-backing cross-refs; ship the repo publicly (version bump, docs, review,
hygiene); and finally, as a late non-blocking refinement, run skill-effectiveness
evals -- as in 0.0.1's Phase 5.

Phase numbering continues from the previous milestone (0.0.1 ended at Phase 5), so
this milestone starts at Phase 6.

- [ ] **Phase 6: lz-refactor Skill Scaffold & Progressive Disclosure** - Invocable, auto-triggering `/lz-tdd:lz-refactor` router with a lean SKILL.md and a wired references/ structure
- [ ] **Phase 7: Fowler Catalog (Refactoring, 2nd ed)** - All 66 refactorings + 24 smells + Ch.2 principles, original prose + tsc-clean TS/JS, owner-oracle-verified and provenance-labeled
- [ ] **Phase 8: Kerievsky Catalog (Refactoring to Patterns)** - All 27 pattern-directed refactorings with To/Towards/Away directions, GoF cross-refs, Fowler-primitive composition, and Ch.4 smells folded into the unified taxonomy
- [ ] **Phase 9: Coach Behavior & Principle-Backing** - Dual-mode smell->named-refactoring routing (incl. de-patterning), behavior-preservation discipline, the lz-tpp seam, and the three no-oracle Beck/Feathers cross-refs
- [ ] **Phase 10: Distribution & Hygiene** - Version bump to 0.0.2, README + CHANGELOG, first-party review, no-verbatim-prose hygiene, public-repo hygiene preserved
- [ ] **Phase 11: Skill-Effectiveness Evals** - Native-harness trigger recall/specificity + smell->refactoring behavior accuracy (with-skill vs baseline), late and non-blocking

## Phase Details

### Phase 6: lz-refactor Skill Scaffold & Progressive Disclosure

**Goal**: A user-invocable, auto-triggering `/lz-tdd:lz-refactor` skill exists as a lean router with a wired progressive-disclosure `references/` structure, modeled on the `angular-developer` skill (local clone) and the skill-creator / plugin-dev authoring guidance -- ready to hold the catalogs authored in later phases.
**Depends on**: lz-tdd@0.0.1 (the shipped `lz-tdd` plugin + marketplace). First phase of this milestone.
**Requirements**: SKEL-01, SKEL-02, SKEL-03, SKEL-04
**Success Criteria** (what must be TRUE):

  1. The skill lives at `plugins/lz-tdd/skills/lz-refactor/SKILL.md`, is invocable as `/lz-tdd:lz-refactor`, and has dual-mode default frontmatter (auto-triggers as a coach AND is user-invocable as a reference).
  2. `SKILL.md` is a lean router (< 500 lines) that lazy-loads `references/` docs grouped by task area (Fowler catalog, smell taxonomy, principles, Kerievsky patterns, refactoring-without-tests), each reachable via a one-level-deep pointer.
  3. The `description` is authored to fire on refactor-step / code-smell / refactoring-catalog prompts and stay quiet on near-misses, within the description character cap (empirical validation deferred to Phase 11).
  4. The progressive-disclosure architecture guarantees heavy catalog material is bundled in `references/`, not inlined -- no single file forces the whole catalog into context.

**Plans**: 1 plan (wave 1)

- [ ] 06-01-PLAN.md -- lz-refactor scaffold: Wave-0 SC checker, five references/ stubs (two thin catalog index subdirs), and the lean dual-mode SKILL.md router

### Phase 7: Fowler Catalog (Refactoring, 2nd ed)

**Goal**: A complete, provenance-labeled Fowler reference layer -- all 66 refactorings, the 24 bad smells mapped to candidate refactorings, and the Ch.2 principles -- in original prose with tsc --strict-clean original TS/JS, verified against the owner's e-book/web oracle.
**Depends on**: Phase 6 (the skill router and `references/` structure must exist to hold the catalog docs).
**Scaffold**: `.planning/research/refactoring-com-overview.md` (ingested 2026-07-04 -- the 66 names + 1st-ed aliases + tags + inverse-of pattern; orientation only, owner e-book/web is the oracle).
**Requirements**: FWL-01, FWL-02, FWL-03, FWL-04
**Success Criteria** (what must be TRUE):

  1. The Fowler catalog reference documents all 66 refactorings -- each with name, motivation, distilled mechanics (original words), and an original TS/JS before/after example; the 5 print-absent `+` entries and Split Phase's online-only examples are provenance-labeled. All 66 (print-absent entries included) are verified against the owner's e-book/web oracle.
  2. A unified smell-taxonomy reference lists the 24 Fowler bad smells, each mapped to its candidate refactorings, usable as the coach's trigger table.
  3. A principles reference distills Ch.2 (definition, the two hats, when-to-refactor: rule of three / preparatory / comprehension / litter-pickup, performance, YAGNI) in original words with correct attributions.
  4. Every Fowler TS/JS sample compiles tsc --strict-clean and is behavior-preserving, verified at an owner-oracle checkpoint against the e-book/web editions, which include all 66 refactorings.

**Plans**: TBD

### Phase 8: Kerievsky Catalog (Refactoring to Patterns)

**Goal**: A complete Kerievsky pattern-directed layer -- all 27 refactorings with the To/Towards/Away directions and GoF cross-refs, each composed from named Fowler primitives, and its Ch.4 smells folded/deduplicated into the unified taxonomy.
**Depends on**: Phase 7 (Kerievsky refactorings cross-map to named Fowler primitives and fold into the Fowler-established smell taxonomy, so Fowler must exist first).
**Requirements**: KRV-01, KRV-02, KRV-03, KRV-04
**Success Criteria** (what must be TRUE):

  1. The Kerievsky reference documents all 27 pattern-directed refactorings -- each with name, intent, distilled mechanics (original words), an original TS/JS example re-rendered from the book's Java, and the Fowler primitive(s) it composes; all samples tsc --strict-clean and owner-oracle-verified.
  2. The To / Towards / Away directions model is captured, with the "refactor AWAY from a pattern" (de-patterning) cases explicitly called out (Inline Singleton; Move Accumulation to Visitor away from Iterator; Encapsulate Composite with Builder away from Composite).
  3. Kerievsky's Ch.4 smells (including Conditional Complexity, Indecent Exposure, Solution Sprawl, Combinatorial Explosion, Oddball Solution) are folded into the unified smell taxonomy with source tags and deduplicated against Fowler's list.
  4. Each Kerievsky refactoring cross-references its target GoF pattern (from the owner's GoF e-book) for vocabulary, without reproducing any GoF text.

**Plans**: TBD

### Phase 9: Coach Behavior & Principle-Backing

**Goal**: The dual-mode coach behavior is wired on top of both catalogs -- smell->named-refactoring routing (mechanical->Fowler, structural->Kerievsky), the over-/under-engineering (de-patterning) balance, behavior-preservation discipline with a no-tests fallback, and the red-green-refactor seam with lz-tpp -- backed by the three no-oracle, high-confidence-core principle cross-references.
**Depends on**: Phases 7 and 8 (the coach routes to catalog and smell-taxonomy references that must already exist; the taxonomy is the coach's trigger table).
**Requirements**: CCH-01, CCH-02, CCH-03, CCH-04, CCH-05, PRIN-01, PRIN-02, PRIN-03
**Success Criteria** (what must be TRUE):

  1. For a detected or named smell during the refactor step, the coach recommends the next NAMED refactoring, routing mechanical smells to Fowler refactorings and repeated / complex-structure smells to Kerievsky pattern-directed refactorings.
  2. The coach applies the over-/under-engineering balance -- it recommends de-patterning (refactor away) when a pattern is unwarranted, not only adding structure.
  3. The coach enforces behavior-preservation discipline (small steps, run tests after each) and, when tests are absent, routes to the Feathers "refactor safely without tests" reference.
  4. In reference mode the coach answers on-demand catalog / smell / principle questions by routing to the correct `references/` doc, and it frames the red-green-refactor seam with lz-tpp (green step = TPP transformation; refactor step = lz-refactor) consistent with Beck's TDD cycle.
  5. Principle-backing references exist, tagged no-oracle and scoped to high-confidence core only: Beck *TDD by Example* (cycle, two rules, Fake It / Triangulate / Obvious Implementation), Beck *Tidy First?* (structural-vs-behavioral separation + refactor economics, cross-referenced to overlapping Fowler refactorings), and Feathers *Legacy Code* (seams, characterization tests, the change algorithm, Sprout/Wrap Method+Class, Subclass and Override Method, Extract Interface).

**Plans**: TBD

### Phase 10: Distribution & Hygiene

**Goal**: The repo is publicly shippable with the new skill -- version bumped to 0.0.2, README and CHANGELOG updated, no verbatim book prose or code in the tree, passing first-party review and `validate --strict`, with public-repo hygiene intact.
**Depends on**: Phase 9 (the full skill -- router, both catalogs, coach behavior, principle cross-refs -- must exist to document and to pass authoring review).
**Requirements**: DST-01, DST-02, DST-03, DST-04
**Success Criteria** (what must be TRUE):

  1. `plugins/lz-tdd/.claude-plugin/plugin.json` version is bumped to `0.0.2` and the root `README.md` documents the `lz-refactor` skill (what it does + `/lz-tdd:lz-refactor` invocation) alongside `lz-tpp`.
  2. `CHANGELOG.md` gains an `lz-tdd@0.0.2` entry describing the lz-refactor skill.
  3. `claude plugin validate .` and `--strict` pass with the new skill and first-party review (plugin-validator + skill-reviewer) PASSes; the work email is absent, license stays MIT, and committed output is ASCII-only.
  4. A hygiene scan confirms no verbatim Fowler/Kerievsky/GoF prose or code listings appear in the shipped tree -- only original prose, original code, names, and facts.

**Plans**: TBD

### Phase 11: Skill-Effectiveness Evals

**Goal**: Empirically validate the lz-refactor skill's triggering accuracy and coach routing correctness on the native eval harness -- a late, non-blocking refinement that does not gate the public ship.
**Depends on**: Phase 9 (skill must exist to evaluate); runs after Phase 10. Non-blocking -- Phases 6-10 do not depend on it.
**Requirements**: EVL-01, EVL-02
**Success Criteria** (what must be TRUE):

  1. A trigger eval (in-scope refactoring / refactor-step / smell prompts + near-miss should-not-trigger prompts) confirms the `description` fires on in-scope contexts and stays quiet otherwise (recall + specificity), run on the native eval harness.
  2. A behavior eval confirms the coach recommends the correct next refactoring across representative smell/scenario prompts spanning both layers (Fowler mechanical + Kerievsky pattern-directed routing), measured with-skill vs. baseline.
  3. Eval findings feed at most a bounded description/behavior tuning pass on the already-shipped skill; earlier phases remain complete regardless of eval outcomes (non-blocking).

**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 6 -> 7 -> 8 -> 9 -> 10 -> 11

| Phase | Milestone | Plans Complete | Status | Completed |
| ----- | --------- | -------------- | ------ | --------- |
| 1. Marketplace & Plugin Scaffold | lz-tdd@0.0.1 | 1/1 | Complete | 2026-07-02 |
| 2. TPP Source Distillation | lz-tdd@0.0.1 | 2/2 | Complete | 2026-07-02 |
| 3. lz-tpp Skill Authoring | lz-tdd@0.0.1 | 3/3 | Complete | 2026-07-02 |
| 4. Distribution & Hygiene | lz-tdd@0.0.1 | 1/1 | Complete | 2026-07-02 |
| 5. Skill Effectiveness Evals | lz-tdd@0.0.1 | 4/4 | Complete | 2026-07-03 |
| 6. lz-refactor Skill Scaffold & Progressive Disclosure | lz-tdd@0.0.2 | 0/1 | Planned | - |
| 7. Fowler Catalog (Refactoring, 2nd ed) | lz-tdd@0.0.2 | - | Not started | - |
| 8. Kerievsky Catalog (Refactoring to Patterns) | lz-tdd@0.0.2 | - | Not started | - |
| 9. Coach Behavior & Principle-Backing | lz-tdd@0.0.2 | - | Not started | - |
| 10. Distribution & Hygiene | lz-tdd@0.0.2 | - | Not started | - |
| 11. Skill-Effectiveness Evals | lz-tdd@0.0.2 | - | Not started | - |

---
*Roadmap created: 2026-07-02 | lz-tdd@0.0.1 completed: 2026-07-04 | lz-tdd@0.0.2 roadmap added: 2026-07-04 | Phase 6 planned: 2026-07-04*
