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

- [x] **Phase 6: lz-refactor Skill Scaffold & Progressive Disclosure** - Invocable, auto-triggering `/lz-tdd:lz-refactor` router with a lean SKILL.md and a wired references/ structure (completed 2026-07-04)
- [x] **Phase 7: Fowler Catalog (Refactoring, 2nd ed)** - All 62 refactorings + 24 smells + Ch.2 principles, original prose + tsc-clean TS/JS, clean-room-oracle-verified and provenance-labeled (completed 2026-07-05)
- [x] **Phase 8: Kerievsky Catalog (Refactoring to Patterns)** - All 27 pattern-directed refactorings with To/Towards/Away directions, GoF cross-refs, Fowler-primitive composition, and Ch.4 smells folded into the unified taxonomy (completed 2026-07-07)
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

- [x] 06-01-PLAN.md -- lz-refactor scaffold: Wave-0 SC checker, five references/ stubs (two thin catalog index subdirs), and the lean dual-mode SKILL.md router

### Phase 7: Fowler Catalog (Refactoring, 2nd ed)

**Goal**: A complete, provenance-labeled Fowler reference layer -- all 62 refactorings (per-refactoring leaves), the 24 bad smells mapped to candidate refactorings, and the Ch.2 principles -- in original prose with tsc --strict-clean original TS/JS, verified against the owner's authoritative source via the clean-room oracle loop (`.oracle/refactoring-2e/`, DST-04; main context never reads book prose).
**Depends on**: Phase 6 (the skill router and `references/` structure must exist to hold the catalog docs).
**Scaffold**: `.planning/research/refactoring-com-overview.md` (ingested 2026-07-04 -- names + 1st-ed aliases + tags + inverse-of pattern; orientation only, `.oracle/refactoring-2e/` is the oracle). Design LOCKED in `07-ROUTING-ARCHITECTURE.md` (62-scope, chapter-grouped per-refactoring leaves) and `07-ORACLE-MODEL.md` (clean-room oracle/oracle-reviewer loop; oracle-availability matrix).
**Requirements**: FWL-01, FWL-02, FWL-03, FWL-04
**Success Criteria** (what must be TRUE):

  1. The Fowler catalog reference documents all 62 refactorings as per-refactoring leaves -- each with name (+ 1st-ed aliases), a `Use when:` selector, motivation, distilled mechanics (original words), and an original TS/JS before/after example; Return Modified Value `[web-only]` is provenance-labeled (the sole such marker -- Split Phase's `[web-example]` label was owner-dropped in 07-02 as a normal in-book Ch.6 refactoring). All 62 are verified via the clean-room oracle loop (`oracle-reviewer` over `.oracle/refactoring-2e/`).
  2. A unified smell-taxonomy reference lists the 24 Fowler bad smells, each mapped to its candidate refactorings, usable as the coach's trigger table.
  3. A principles reference distills Ch.2 (definition, the two hats, when-to-refactor: rule of three / preparatory / comprehension / litter-pickup, performance, YAGNI) in original words with correct attributions.
  4. Every Fowler TS/JS sample compiles tsc --strict-clean and is behavior-preserving, verified via the clean-room `oracle-reviewer` gate (not an AskUserQuestion paste) against `.oracle/refactoring-2e/`, which covers all 62 refactorings.

**Plans**: 10 plans (4 waves)

- [x] 07-01-PLAN.md -- Wave-1 tsc --strict compile harness + FWL-01/02/03 + hygiene checkers (wave 1)
- [x] 07-02-PLAN.md -- PILOT: basic chapter (Ch.6) per-refactoring leaves + harness overhaul (62-scope, per-leaf, smell-leaf, +check-crossrefs) + chapter-grouped README scaffold; calibrates the clean-room loop (wave 2)
- [x] 07-03-PLAN.md -- Principles: Fowler Ch.2 distilled (authored + oracle-converged; check-principles 8/8) (wave 2)
- [x] 07-04-PLAN.md -- Catalog: encapsulation chapter (Ch.7) per-refactoring leaves (wave 3)
- [x] 07-05-PLAN.md -- Catalog: moving-features chapter (Ch.8) per-refactoring leaves (wave 3)
- [x] 07-06-PLAN.md -- Catalog: organizing-data chapter (Ch.9) per-refactoring leaves (wave 3)
- [x] 07-07-PLAN.md -- Catalog: simplify-conditional-logic chapter (Ch.10) per-refactoring leaves (wave 3)
- [x] 07-08-PLAN.md -- Catalog: refactoring-apis chapter (Ch.11) leaves, incl. Return Modified Value [web-only] (wave 3)
- [x] 07-09-PLAN.md -- Catalog: dealing-with-inheritance chapter (Ch.12) per-refactoring leaves (wave 3)
- [x] 07-10-PLAN.md -- Smell leaves (24) + navigation-only smells.md index + catalog README finalize + full battery (wave 4)

### Phase 8: Kerievsky Catalog (Refactoring to Patterns)

**Goal**: A complete Kerievsky pattern-directed layer -- all 27 refactorings with the To/Towards/Away directions and GoF cross-refs, each composed from named Fowler primitives, and its Ch.4 smells folded/deduplicated into the unified taxonomy.
**Depends on**: Phase 7 (Kerievsky refactorings cross-map to named Fowler primitives and fold into the Fowler-established smell taxonomy, so Fowler must exist first).
**Requirements**: KRV-01, KRV-02, KRV-03, KRV-04
**Success Criteria** (what must be TRUE):

  1. The Kerievsky reference documents all 27 pattern-directed refactorings -- each with name, intent, distilled mechanics (original words), an original TS/JS example re-rendered from the book's Java, and the Fowler primitive(s) it composes; all samples tsc --strict-clean and owner-oracle-verified.
  2. The To / Towards / Away directions model is captured, with the "refactor AWAY from a pattern" (de-patterning) cases explicitly called out (Inline Singleton; Move Accumulation to Visitor away from Iterator; Encapsulate Composite with Builder away from Composite).
  3. Kerievsky's Ch.4 smells (including Conditional Complexity, Indecent Exposure, Solution Sprawl, Combinatorial Explosion, Oddball Solution) are folded into the unified smell taxonomy with source tags and deduplicated against Fowler's list.
  4. Each Kerievsky refactoring cross-references its target GoF pattern (from the owner's GoF e-book) for vocabulary, without reproducing any GoF text.

**Plans**: 6 plans (3 waves)

- [x] 08-01-PLAN.md -- Wave-1 harness extension: new check-kerievsky.mjs (27-name identity + 3 fields + 3 Away + README mirror) + re-point extract-samples / check-crossrefs / check-smells + package.json (wave 1)
- [x] 08-02-PLAN.md -- Catalog: Ch.6 Creation leaves (6) via the clean-room oracle loop; incl. 2 de-patterning Away cases (Inline Singleton, Encapsulate Composite with Builder) (wave 2)
- [x] 08-03-PLAN.md -- Catalog: Ch.7 Simplification leaves (6) via the clean-room oracle loop (State/Command overflow candidates) (wave 2)
- [x] 08-04-PLAN.md -- Catalog: Ch.8 Generalization leaves (7) via the clean-room oracle loop (Interpreter overflow candidate) (wave 2)
- [x] 08-05-PLAN.md -- Catalog: Ch.9 Protection + Ch.10 Accumulation + Ch.11 Utilities leaves (8) via the clean-room oracle loop; incl. the 3rd Away case (Move Accumulation to Visitor) + the 3 n/a-utility GoF leaves (wave 2)
- [x] 08-06-PLAN.md -- Ch.4 smell fold + dedup into the unified taxonomy + finalize kerievsky-catalog/README.md index + full battery green + claude plugin validate (wave 3)

### Phase 08.1: GoF Design Patterns Catalog (INSERTED)

**Goal**: A complete GoF design-patterns reference layer for `lz-refactor` -- all 23 GoF patterns (grouped Creational / Structural / Behavioral) plus 5 Tier-1 extra patterns (Null Object, Factory, Creation Method, Composed Method, Collecting Parameter), each a per-pattern leaf on the locked 5-section contract (Intent / Applicability / Consequences / Example / Related patterns), in original prose + `tsc --strict`-clean original TypeScript, clean-room-oracle-verified against `.oracle/design-patterns/` and `.oracle/refactoring-to-patterns/`; every Kerievsky `GoF pattern:` token that names a real pattern is resolved into a link (GoF-23 -> `gof-catalog`, extra -> `extra-patterns-catalog`) incl. the 3 Direction:Away de-patterning links, with author-cited modern-status caveats folded into `## Consequences`.
**Depends on**: Phase 8 (all 27 Kerievsky `GoF pattern:` tokens must exist before they can be linkified).
**Requirements**: GOF-01, GOF-02, GOF-03, GOF-04, XTR-01
**Success Criteria** (what must be TRUE):

  1. All 23 GoF patterns exist as per-pattern leaves on the locked 5-section contract, grouped by family in `gof-catalog/README.md` with the Applicability-first-line selector mirror; `check-gof` passes 23/23.
  2. The 5 Tier-1 extra patterns exist as leaves in `extra-patterns-catalog/` on the same contract, Kerievsky-grounded and oracle-verified; `check-extra-patterns` passes 5/5.
  3. Every Kerievsky `GoF pattern:` token that names a real pattern resolves to a link (GoF-23 -> `gof-catalog`, extra -> `extra-patterns-catalog`); tokens naming no real pattern stay free text; the 3 Direction:Away leaves carry the required `## Related patterns` link (Singleton -> Inline Singleton; Composite -> Encapsulate Composite with Builder; Iterator -> Move Accumulation to Visitor); `check-kerievsky` linkify gate + `check-crossrefs` all resolve.
  4. Author-cited modern-status caveats are folded into `## Consequences` (Singleton cites Dependency Injection); no invented liabilities for the 8 GoF-benefits-only patterns.
  5. Hygiene: no verbatim GoF / Kerievsky / Fowler prose or code in the shipped tree; ASCII-only; every GoF + extra-pattern TS fence compiles `tsc --strict`; `claude plugin validate .` passes.

**Plans**: 7 plans (3 waves)

- [x] 08.1-01-PLAN.md -- Wave-1 harness: new check-gof + check-extra-patterns, check-kerievsky linkify retrofit, extended check-crossrefs / extract-samples / package.json, both README scaffolds (RED baseline expected) (wave 1)
- [x] 08.1-02-PLAN.md -- GoF Creational leaves (5: Abstract Factory, Builder, Factory Method, Prototype, Singleton) via the clean-room oracle loop; Singleton DI caveat + Inline Singleton Away link (wave 2)
- [x] 08.1-03-PLAN.md -- GoF Structural leaves (7: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy); Composite Away link + Composite/Flyweight caveats (wave 2)
- [x] 08.1-04-PLAN.md -- GoF Behavioral part 1 (6: Chain of Responsibility, Command, Interpreter, Iterator, Mediator, Memento); Iterator Away link + Iterator/Interpreter/Command caveats (wave 2)
- [x] 08.1-05-PLAN.md -- GoF Behavioral part 2 (5: Observer, State, Strategy, Template Method, Visitor); Observer/Template Method caveats (wave 2)
- [x] 08.1-06-PLAN.md -- Extra patterns (5: Null Object, Factory, Creation Method, Composed Method, Collecting Parameter) via the clean-room oracle loop (wave 2)
- [x] 08.1-07-PLAN.md -- Wave-3 gate: linkify the 27 Kerievsky GoF pattern: tokens, finalize both READMEs + SKILL.md wiring, full npm run check + typecheck + claude plugin validate . (wave 3)

### Phase 8.2: Functional Catalog (INSERTED)

**Goal**: A single by-idiom `functional-catalog/` reference group documenting how OO patterns/refactorings dissolve into functional TypeScript idioms AND native FP patterns, on the LOCKED Kerievsky-aligned shared template. Unifies de-patterning idioms (FP renderings of GoF/Kerievsky/Fowler-analog patterns) and native FP patterns under one template that differs only by `Correspondence: dissolves-from | alternative-to`; ~17 idiom leaves + an N:1 pattern->idiom map README; each OO catalog leaf gains a one-line `Functional alternative:` cross-link; no-oracle correctness anchor = the committed research artifact + a new `check-functional` gate + `tsc --strict`.
**Depends on**: Phases 7, 8, 8.1 (the functional-catalog cross-links to the Fowler / Kerievsky / GoF+extra leaves it de-patterns, so all three OO catalogs must exist first).
**Scaffold**: Design LOCKED in `.planning/research/functional-depatterning-ts.md` (Sections 10-13: the pattern->idiom->TS-feature disappearance map, the full-corpus Stays-OO analysis, the opposite-direction / Replace-Pipeline-with-Loop findings, and the board-ratified shared template + `check-functional` spec). No owned oracle -- cited no-oracle tier.
**Requirements**: FUN-01, FUN-02, FUN-03, FUN-04
**Success Criteria** (what must be TRUE):

  1. A `functional-catalog/` group exists: a thin N:1 pattern->idiom map README (declares its N:1 contract, mirrors each leaf's `Use when:` selector, caps note cells to one line, `## Sources` cites the research artifact) plus per-idiom leaves on the locked template (Use when / Correspondence / Keep the OO form when / Idiom / Example / When each fits); every TS Example compiles `tsc --strict`.
  2. De-patterning coverage: every dissolvable/collapsible GoF pattern (23), Kerievsky pattern-directed refactoring, and Fowler FP-analog refactoring resolves via the README map to an idiom leaf or a one-line note (moot / FP-avoids-via-data-modeling), deduped by idiom; the selector/lens + normalized-store idioms and the Replace-Pipeline-with-Loop reverse-direction note are present.
  3. Native FP patterns (Option/Either, functor/monad, lens/optics, currying/partial application, transducers) exist as `alternative-to` idiom leaves, each cross-referencing its OO alternative.
  4. Bidirectional link integrity: each gof/kerievsky/extra leaf carries a one-line `Functional alternative:` link to its idiom leaf and every `Correspondence:` link resolves back (spanning all three OO catalogs); a new `check-functional` gate enforces the selector-mirror, the `Correspondence` enum, bidirectional + intra-leaf-anchor link resolution, the one-line-per-served-pattern cap, and `tsc --strict`; DST-04-clean (original prose/code); skill-reviewer PASS.

**Plans**: 6 plans (4 waves)

- [x] 08.2-01-PLAN.md -- Wave-1 instrument: check-functional.mjs RED baseline + extract-samples/check-crossrefs/package.json wiring + README scaffold (wave 1)
- [ ] 08.2-02-PLAN.md -- 6 N:1 dissolves-from idiom leaves (first-class-function, thunk-and-lazy-value, function-composition, discriminated-union-and-fold, module-namespace, factory-function) + per-pattern residual anchors (wave 2)
- [ ] 08.2-03-PLAN.md -- 7 1:1 dissolves-from idiom leaves (reducer-and-store, observer-callbacks, generator, memoization-and-interning, immutable-snapshot, structural-clone, branded-type) (wave 2)
- [ ] 08.2-04-PLAN.md -- 6 alternative-to native FP leaves (option-and-either, functor-and-monad, lens-and-optics, currying-and-partial-application, transducers, normalized-store) (wave 2)
- [ ] 08.2-05-PLAN.md -- N:1 pattern->idiom map README finalize + D-14 Replace-Pipeline-with-Loop reverse note in the Fowler leaf (wave 3)
- [ ] 08.2-06-PLAN.md -- 55 Functional alternative: cross-links + SKILL.md router pointer + full battery/typecheck/validate/skill-reviewer gate (wave 4)

### Phase 9: Coach Behavior & Principle-Backing

**Goal**: The dual-mode coach behavior is wired on top of both catalogs -- smell->named-refactoring routing (mechanical->Fowler, structural->Kerievsky), the over-/under-engineering (de-patterning) balance routed to the functional-catalog, behavior-preservation discipline with a no-tests fallback, and the red-green-refactor seam with lz-tpp -- backed by the three no-oracle, high-confidence-core principle cross-references.
**Depends on**: Phases 7, 8, 8.1, and 8.2 (the coach routes to the Fowler / Kerievsky catalogs, the smell taxonomy, the GoF pattern catalog, AND the functional-catalog it surfaces FP alternatives from; all must already exist).
**Requirements**: CCH-01, CCH-02, CCH-03, CCH-04, CCH-05, CCH-06, PRIN-01, PRIN-02, PRIN-03
**Success Criteria** (what must be TRUE):

  1. For a detected or named smell during the refactor step, the coach recommends the next NAMED refactoring, routing mechanical smells to Fowler refactorings and repeated / complex-structure smells to Kerievsky pattern-directed refactorings.
  2. The coach applies the over-/under-engineering balance -- it recommends de-patterning (refactor away) when a pattern is unwarranted, routing to the functional-catalog (the FP idiom a pattern dissolves into), not only the Kerievsky Away direction.
  3. The coach enforces behavior-preservation discipline (small steps, run tests after each) and, when tests are absent, routes to the Feathers "refactor safely without tests" reference.
  4. In reference mode the coach answers on-demand catalog / smell / principle / functional-alternative questions by routing to the correct `references/` doc (Fowler / Kerievsky / GoF / functional-catalog), and it frames the red-green-refactor seam with lz-tpp (green step = TPP transformation; refactor step = lz-refactor) consistent with Beck's TDD cycle.
  5. The coach surfaces the functional alternative (CCH-06): for a dissolvable pattern it names "pattern X disappears via FP idiom Y / TS feature Z" and routes to the functional-catalog, and it gives the Replace-Pipeline-with-Loop reverse-direction guidance (clarity is the default; reverse to a loop only on a measured hot path or a named house-style reason).
  6. Principle-backing references exist, tagged no-oracle and scoped to high-confidence core only: Beck *TDD by Example* (cycle, two rules, Fake It / Triangulate / Obvious Implementation), Beck *Tidy First?* (structural-vs-behavioral separation + refactor economics, cross-referenced to overlapping Fowler refactorings), and Feathers *Legacy Code* (seams, characterization tests, the change algorithm, Sprout/Wrap Method+Class, Subclass and Override Method, Extract Interface).

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
Phases execute in numeric order: 6 -> 7 -> 8 -> 8.1 -> 8.2 -> 9 -> 10 -> 11

| Phase | Milestone | Plans Complete | Status | Completed |
| ----- | --------- | -------------- | ------ | --------- |
| 1. Marketplace & Plugin Scaffold | lz-tdd@0.0.1 | 1/1 | Complete | 2026-07-02 |
| 2. TPP Source Distillation | lz-tdd@0.0.1 | 2/2 | Complete | 2026-07-02 |
| 3. lz-tpp Skill Authoring | lz-tdd@0.0.1 | 3/3 | Complete | 2026-07-02 |
| 4. Distribution & Hygiene | lz-tdd@0.0.1 | 1/1 | Complete | 2026-07-02 |
| 5. Skill Effectiveness Evals | lz-tdd@0.0.1 | 4/4 | Complete | 2026-07-03 |
| 6. lz-refactor Skill Scaffold & Progressive Disclosure | lz-tdd@0.0.2 | 1/1 | Complete    | 2026-07-04 |
| 7. Fowler Catalog (Refactoring, 2nd ed) | lz-tdd@0.0.2 | 10/10 | Complete   | 2026-07-05 |
| 8. Kerievsky Catalog (Refactoring to Patterns) | lz-tdd@0.0.2 | 6/6 | Complete   | 2026-07-07 |
| 8.1. GoF Design Patterns Catalog (INSERTED) | lz-tdd@0.0.2 | 7/7 | Complete   | 2026-07-07 |
| 8.2. Functional Catalog (INSERTED) | lz-tdd@0.0.2 | 1/6 | In Progress|  |
| 9. Coach Behavior & Principle-Backing | lz-tdd@0.0.2 | - | Not started | - |
| 10. Distribution & Hygiene | lz-tdd@0.0.2 | - | Not started | - |
| 11. Skill-Effectiveness Evals | lz-tdd@0.0.2 | - | Not started | - |

---
*Roadmap created: 2026-07-02 | lz-tdd@0.0.1 completed: 2026-07-04 | lz-tdd@0.0.2 roadmap added: 2026-07-04 | Phase 6 planned: 2026-07-04 | Phase 7 planned: 2026-07-04 | Phase 7 re-planned (scope-correction: 62-scope + clean-room oracle, per-refactoring leaves): 2026-07-05 | Phase 8 planned: 2026-07-05 | Phase 8 completed: 2026-07-07 | Phase 8.2 inserted (Functional Catalog): 2026-07-07 | Phase 8.2 planned (6 plans, 4 waves): 2026-07-07*
